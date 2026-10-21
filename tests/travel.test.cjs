const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');
function load(file) {
  const output = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', output)(require, module, module.exports);
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
    process.env.ELEVENLABS_VOICE_ID='voice-one';process.env.ELEVENLABS_MODEL_ID='model-one';
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
      await new Promise(r=>setTimeout(r,20));return new Response(new Uint8Array([1,2,3]),{headers:{'Content-Type':'audio/mpeg'}});
    };
    await Promise.all([audio.generateAudio(tour,stop),audio.generateAudio(tour,stop)]);
    assert.equal(calls,1);assert.equal((await audio.readAudio(tour,stop)).length,3);
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
