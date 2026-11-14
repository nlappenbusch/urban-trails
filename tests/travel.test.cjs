const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');
function load(file) {
  const output = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  new Function("require", "module", "exports", output)(n => n.startsWith("./") ? load("src/lib/" + n.slice(2) + ".ts") : n.startsWith("@/") ? load("src/" + n.slice(2) + ".ts") : require(n), module, module.exports);
  return module.exports;
}
const gps = load('src/lib/gps.ts');
const audio = load('src/lib/audio-server.ts');
const project = load('src/data/projects/frankenthal.ts').frankenthal;
const zurich = load('src/data/tours/zuerich-klassiker.ts').zuerichKlassiker;
test('GPS rejects stale, inaccurate and distant fixes; accepts arrival', () => {
  const stop = { lat: 47.37, lng: 8.54 }, now = 100000;
  assert.equal(gps.arrival(stop, 10, now, stop, now), true);
  assert.equal(gps.arrival(stop, 80, now, stop, now), false);
  assert.equal(gps.arrival(stop, 10, now-16000, stop, now), false);
  assert.equal(gps.arrival(stop, 10, now+1, stop, now), false);
  assert.equal(gps.arrival({ lat: 47.38, lng: 8.54 }, 10, now, stop, now), false);
});
test('Zürich timing and safety fixes are consistent', () => {
  assert.equal(zurich.durationMinutes, zurich.stops.reduce((n,s) => n+s.walkMinutesFromPrevious+s.stayMinutes, 0));
  assert.equal(zurich.stops.length, 13);
  assert.match(zurich.stops.find(s => s.id==='muensterbruecke').insiderTip, /nicht baden/);
  assert.doesNotMatch(zurich.faq.map(f => f.answer).join(' '), /12 Stops|2¾|Premium-Version/);
});
test('Frankenthal has 30 minutes, all five planned languages, no invented GPS fixes', () => {
  assert.equal(project.stops.length, 15);
  assert.equal(project.stops.reduce((n,s) => n+s.audioSeconds, 0), 1800);
  assert.deepEqual(project.languages.map(l => l.code), ['de','en','fr','it','de-easy']);
  assert.ok(project.stops.every(s => s.coordinates===null && !s.gpsApproved && s.status==='planned'));
});
test('Audio version changes for script, voice and model', () => {
  const tour = {citySlug:'test',slug:'test'}, stop = {id:'one',audioScript:'Before'};
  const env = {...process.env};
  try {
    process.env.ELEVENLABS_API_KEY='test-key';process.env.ELEVENLABS_VOICE_ID='voice-one';process.env.ELEVENLABS_MODEL_ID='model-one';
    const first = audio.audioIdentity(tour,stop).version;
    assert.notEqual(audio.audioIdentity(tour,{...stop,audioScript:'After'}).version,first);
    process.env.ELEVENLABS_VOICE_ID='voice-two';assert.notEqual(audio.audioIdentity(tour,stop).version,first);
    process.env.ELEVENLABS_VOICE_ID='voice-one';process.env.ELEVENLABS_MODEL_ID='model-two';assert.notEqual(audio.audioIdentity(tour,stop).version,first);
  } finally { process.env=env; }
});
test('Audio administration fails closed', () => {
  const env={...process.env};try{
    delete process.env.AUDIO_ADMIN_TOKEN;assert.equal(audio.isAudioAdmin(new Request('http://local')),false);
    process.env.AUDIO_ADMIN_TOKEN='a'.repeat(32);
    assert.equal(audio.isAudioAdmin(new Request('http://local',{headers:{authorization:'Bearer '+'a'.repeat(32)}})),true);
    assert.equal(audio.isAudioAdmin(new Request('http://local',{headers:{authorization:'Bearer '+'b'.repeat(32)}})),false);
  }finally{process.env=env;}
});
test('ElevenLabs generation is deduplicated, cached and failed responses do not become audio', async () => {
  const env={...process.env}, originalFetch=global.fetch;
  const tour={citySlug:'test',slug:'elevenlabs'},stop={id:'voice-'+Date.now(),audioScript:'Test only'};
  let calls=0;
  try {
    process.env.ELEVENLABS_API_KEY='test-key';process.env.ELEVENLABS_VOICE_ID='test-voice';
    global.fetch=async(url,options)=>{
      calls++;assert.match(url,/api\.elevenlabs\.io/);assert.equal(JSON.parse(options.body).text,stop.audioScript);
      await new Promise(r=>setTimeout(r,20));return new Response(new Uint8Array(2048),{headers:{'Content-Type':'audio/mpeg'}});
    };
    await Promise.all([audio.generateAudio(tour,stop),audio.generateAudio(tour,stop)]);
    assert.equal(calls,1);assert.equal((await audio.readAudio(tour,stop)).length,2048);
    await audio.generateAudio(tour,stop);assert.equal(calls,1);
    const bad={...stop,id:stop.id+'-bad'};global.fetch=async()=>new Response('denied',{status:429});
    await assert.rejects(audio.generateAudio(tour,bad));assert.equal(await audio.readAudio(tour,bad),null);
  } finally {
    await fs.promises.unlink(audio.audioIdentity(tour,stop).file).catch(()=>{});
    global.fetch=originalFetch;process.env=env;
  }
});
function workerFixture(complete, url = "https://local/api/audio?v=one") {
  let handler;
  const stored=new Map([[url,new Response(new Uint8Array([0,1,2,3,4]),{headers:{'Content-Type':'audio/mpeg'}})]]);
  const cache={match:async key=>key==='/__ut_offline_ready__'?(complete?Response.json({revision:'one'}):undefined):stored.get(key)?.clone()};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/sw.js'),'utf8'),{
    self:{location:{origin:'https://local'},addEventListener:(name,fn)=>{if(name==='fetch')handler=fn;}},
    caches:{keys:async()=>['ut-tour-test-one'],open:async()=>cache},URL,Response,
    fetch:async()=>new Response('network',{status:503}),
  });
  return async headers => {let result;handler({request:new Request(url,{headers}),respondWith:p=>result=p});return result;};
}
test('Offline audio supports suffix and bounded ranges and rejects invalid ranges', async () => {
  const fetch=workerFixture(true);
  const suffix=await fetch({Range:'bytes=-2'});assert.equal(suffix.status,206);assert.deepEqual([...new Uint8Array(await suffix.arrayBuffer())],[3,4]);
  const bounded=await fetch({Range:'bytes=1-2'});assert.equal(bounded.headers.get('Content-Range'),'bytes 1-2/5');
  assert.equal((await fetch({Range:'bytes=99-'})).status,416);
  assert.equal((await fetch({Range:'bytes=-0'})).status,416);
});
test('Service worker never serves an incomplete download', async () => {
  assert.equal((await workerFixture(false)({})).status,503);
});

test('Frankenthal sample is available offline with seeking only after a complete download', async () => {
  const url = 'https://local/audio/frankenthal/kanalhafen-v1.mp3';
  const response = await workerFixture(true, url)({Range:'bytes=2-'});
  assert.equal(response.status,206);
  assert.deepEqual([...new Uint8Array(await response.arrayBuffer())],[2,3,4]);
  assert.equal((await workerFixture(false, url)({})).status,503);
});

test('Player never falls back to the robotic browser voice', () => {
  const source=fs.readFileSync(path.join(__dirname,'../src/components/AudioPlayer.tsx'),'utf8');
  assert.doesNotMatch(source,/speechSynthesis|SpeechSynthesisUtterance/);
});
test('Gemini is the default voice; legacy recordings stay valid except for changed scripts', () => {
  const env={...process.env};
  try {
    delete process.env.ELEVENLABS_API_KEY;delete process.env.ELEVENLABS_VOICE_ID;delete process.env.GEMINI_TTS_VOICE;
    const id=audio.audioIdentity({citySlug:'test',slug:'t'},{id:'one',audioScript:'Hallo'});
    assert.equal(id.provider,'gemini');assert.equal(id.voice,'Sulafat');assert.match(id.file,/test-t-one-sulafat-[0-9a-f]{16}.mp3$/);
    assert.notEqual(audio.audioIdentity({citySlug:'test',slug:'t'},{id:'one',audioScript:'Anders'}).version,id.version);
  } finally { process.env=env; }
});
test('Ambience scene follows the place', () => {
  const scene=load('src/lib/scene.ts').sceneFor;
  assert.ok(scene({name:'Seebad Enge',teaser:'Baden im See'}).water>0.5);
  assert.ok(scene({name:'Grossmünster',teaser:'Die Kirche mit den Doppeltürmen'}).bells>0.5);
  assert.ok(scene({name:'Lindenhof',teaser:'Ruhiger Park über der Stadt'}).birds>0.5);
  assert.equal(scene({name:'Bahnhofstrasse',teaser:'Shopping'}).water,0);
});
test('Navigation maths: projection, remaining distance and next manoeuvre', () => {
  const nav=load('src/lib/nav.ts');
  const route=nav.buildRoute([[8.54,47.37],[8.54,47.371],[8.542,47.371]],[{distance:111,name:'A',maneuver:{type:'depart',location:[8.54,47.37]}},{distance:150,name:'B',maneuver:{type:'turn',modifier:'right',instruction:'Rechts abbiegen',location:[8.54,47.371]}},{distance:0,name:'',maneuver:{type:'arrive',location:[8.542,47.371]}}],{lat:47.37,lng:8.54},'x');
  assert.ok(Math.abs(route.length-262)<8);
  const p=nav.project(route,{lat:47.3705,lng:8.5401});
  assert.ok(p.off<10&&Math.abs(p.along-55)<6);
  const next=nav.nextStep(route,p.along);
  assert.equal(next.step.modifier,'right');assert.ok(Math.abs(next.distance-56)<8);
  assert.equal(nav.maneuverAngle('turn','left'),-90);
  assert.ok(Math.abs(nav.bearing({lat:47.37,lng:8.54},{lat:47.38,lng:8.54}))<1);
});
