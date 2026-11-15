import type { StopImage, StopImageSource } from "@/lib/types";
import meta from "./image-meta.json";

/** Fotos von Wikimedia Commons – Credit verlinkt die Bildseite.
 *  Ausgeliefert werden die eigenen WebP-Kopien unter /img (scripts/fetch-images.mjs). */
export const stopImages: Record<string, StopImageSource> = {
  "aarequai": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Aare_und_Aarequai_%28Obere_Hauptgasse%29_in_Thun_BE_%282014%29.jpg/1280px-Aare_und_Aarequai_%28Obere_Hauptgasse%29_in_Thun_BE_%282014%29.jpg",
    alt: "Aare und Aarequai (Obere Hauptgasse) in Thun BE (2014)",
    credit: "https://commons.wikimedia.org/wiki/File%3AAare_und_Aarequai_%28Obere_Hauptgasse%29_in_Thun_BE_%282014%29.jpg",
  },
  "altstadt-und-hauptplatz": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Hauptplatz_-_Rapperswil_Schlosstreppe_2011-06-19_14-57-58_ShiftN2.jpg/1280px-Hauptplatz_-_Rapperswil_Schlosstreppe_2011-06-19_14-57-58_ShiftN2.jpg",
    alt: "Hauptplatz - Rapperswil Schlosstreppe 2011-06-19 14-57-58 ShiftN2",
    credit: "https://commons.wikimedia.org/wiki/File%3AHauptplatz_-_Rapperswil_Schlosstreppe_2011-06-19_14-57-58_ShiftN2.jpg",
  },
  "arboretum": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Arboretum-Zuerich.jpg/1280px-Arboretum-Zuerich.jpg",
    alt: "Arboretum-Zuerich",
    credit: "https://commons.wikimedia.org/wiki/File%3AArboretum-Zuerich.jpg",
  },
  "arcas-platz": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Chur_in_Graub%C3%BCnden_%28Zwitserland%29_035.jpg/1280px-Chur_in_Graub%C3%BCnden_%28Zwitserland%29_035.jpg",
    alt: "Chur in Graubünden (Zwitserland) 035",
    credit: "https://commons.wikimedia.org/wiki/File%3AChur_in_Graub%C3%BCnden_%28Zwitserland%29_035.jpg",
  },
  "augustinergasse": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Augustinergasse_21_%26_25_in_Z%C3%BCrich_%282013%29.jpg/1280px-Augustinergasse_21_%26_25_in_Z%C3%BCrich_%282013%29.jpg",
    alt: "Augustinergasse 21 & 25 in Zürich (2013)",
    credit: "https://commons.wikimedia.org/wiki/File%3AAugustinergasse_21_%26_25_in_Z%C3%BCrich_%282013%29.jpg",
  },
  "baden-stadtturm": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Baden_Stadtturm_9785.jpg/1280px-Baden_Stadtturm_9785.jpg",
    alt: "Baden Stadtturm 9785",
    credit: "https://commons.wikimedia.org/wiki/File%3ABaden_Stadtturm_9785.jpg",
  },
  "baerenpark": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Bern_B%C3%A4renpark_B%C3%A4r-20120807-RM-190637.jpg/1280px-Bern_B%C3%A4renpark_B%C3%A4r-20120807-RM-190637.jpg",
    alt: "Bern Bärenpark Bär-20120807-RM-190637",
    credit: "https://commons.wikimedia.org/wiki/File%3ABern_B%C3%A4renpark_B%C3%A4r-20120807-RM-190637.jpg",
  },
  "bahnhof-chur": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Lokomotiv-Parade_bei_der_Wiederer%C3%B6ffnung_des_Bahnhofs_Chur_%2825.05.2008%29.jpg/1280px-Lokomotiv-Parade_bei_der_Wiederer%C3%B6ffnung_des_Bahnhofs_Chur_%2825.05.2008%29.jpg",
    alt: "Lokomotiv-Parade bei der Wiedereröffnung des Bahnhofs Chur (25.05.2008)",
    credit: "https://commons.wikimedia.org/wiki/File%3ALokomotiv-Parade_bei_der_Wiederer%C3%B6ffnung_des_Bahnhofs_Chur_%2825.05.2008%29.jpg",
  },
  "bahnhof-eglisau-und-blick-auf-den-rhein": {
    source: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Eglisau-Stadt.jpg",
    alt: "Eglisau-Stadt",
    credit: "https://commons.wikimedia.org/wiki/File%3AEglisau-Stadt.jpg",
  },
  "bahnhof-heiliggeistkirche": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Bern_Church_of_the_Holy_Ghost_Spire_with_Eiger_M%C3%B6nch_Jungfrau_2019-10-16_18-50.jpg/1280px-Bern_Church_of_the_Holy_Ghost_Spire_with_Eiger_M%C3%B6nch_Jungfrau_2019-10-16_18-50.jpg",
    alt: "Bern Church of the Holy Ghost Spire with Eiger Mönch Jungfrau 2019-10-16 18-50",
    credit: "https://commons.wikimedia.org/wiki/File%3ABern_Church_of_the_Holy_Ghost_Spire_with_Eiger_M%C3%B6nch_Jungfrau_2019-10-16_18-50.jpg",
  },
  "bahnhof-luzern": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Luzern_asv2022-10_Kultur-_und_Kongresszentrum.jpg/1280px-Luzern_asv2022-10_Kultur-_und_Kongresszentrum.jpg",
    alt: "Luzern asv2022-10 Kultur- und Kongresszentrum",
    credit: "https://commons.wikimedia.org/wiki/File%3ALuzern_asv2022-10_Kultur-_und_Kongresszentrum.jpg",
  },
  "bahnhof-st-gallen": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/StGallen_asv2022-10_Hauptpost_img5.jpg/1280px-StGallen_asv2022-10_Hauptpost_img5.jpg",
    alt: "StGallen asv2022-10 Hauptpost img5",
    credit: "https://commons.wikimedia.org/wiki/File%3AStGallen_asv2022-10_Hauptpost_img5.jpg",
  },
  "bahnhof-thun": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Bahnhof_Thun2.jpg/1280px-Bahnhof_Thun2.jpg",
    alt: "Bahnhof Thun2",
    credit: "https://commons.wikimedia.org/wiki/File%3ABahnhof_Thun2.jpg",
  },
  "bahnhof-wiedikon": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Bahnhof_Wiedikon%2C_Zurich_%28Ank_Kumar%29_08.jpg/1280px-Bahnhof_Wiedikon%2C_Zurich_%28Ank_Kumar%29_08.jpg",
    alt: "Bahnhof Wiedikon, Zurich (Ank Kumar) 08",
    credit: "https://commons.wikimedia.org/wiki/File%3ABahnhof_Wiedikon%2C_Zurich_%28Ank_Kumar%29_08.jpg",
  },
  "bains-des-paquis": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Gen%C3%A8ve_-_Bains_des_P%C3%A2quis_150814-02.JPG/1280px-Gen%C3%A8ve_-_Bains_des_P%C3%A2quis_150814-02.JPG",
    alt: "Genève - Bains des Pâquis 150814-02",
    credit: "https://commons.wikimedia.org/wiki/File%3AGen%C3%A8ve_-_Bains_des_P%C3%A2quis_150814-02.JPG",
  },
  "bellevue": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Zurich_Sechsel%C3%A4utenplatz_panosphere_20210709.jpg/1280px-Zurich_Sechsel%C3%A4utenplatz_panosphere_20210709.jpg",
    alt: "Zurich Sechseläutenplatz panosphere 20210709",
    credit: "https://commons.wikimedia.org/wiki/File%3AZurich_Sechsel%C3%A4utenplatz_panosphere_20210709.jpg",
  },
  "bellevue-express": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Zurich_Sechsel%C3%A4utenplatz_panosphere_20210709.jpg/1280px-Zurich_Sechsel%C3%A4utenplatz_panosphere_20210709.jpg",
    alt: "Zurich Sechseläutenplatz panosphere 20210709",
    credit: "https://commons.wikimedia.org/wiki/File%3AZurich_Sechsel%C3%A4utenplatz_panosphere_20210709.jpg",
  },
  "belvedere-finale": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Lago_di_Lugano_Tramonto.jpg/1280px-Lago_di_Lugano_Tramonto.jpg",
    alt: "Lago di Lugano Tramonto",
    credit: "https://commons.wikimedia.org/wiki/File%3ALago_di_Lugano_Tramonto.jpg",
  },
  "bischoeflicher-hof": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Chur_Hof.jpg/1280px-Chur_Hof.jpg",
    alt: "Chur Hof",
    credit: "https://commons.wikimedia.org/wiki/File%3AChur_Hof.jpg",
  },
  "bourg-de-four": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Place_du_Bourg-de-Four_%287%29_%C3%A0_Gen%C3%A8ve_%282026.jpg/1280px-Place_du_Bourg-de-Four_%287%29_%C3%A0_Gen%C3%A8ve_%282026.jpg",
    alt: "Place du Bourg-de-Four (7) à Genève (2026",
    credit: "https://commons.wikimedia.org/wiki/File%3APlace_du_Bourg-de-Four_%287%29_%C3%A0_Gen%C3%A8ve_%282026.jpg",
  },
  "buerkliplatz": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Z%C3%BCrich_B%C3%BCrkliplatz_panosphere_20210709.jpg/1280px-Z%C3%BCrich_B%C3%BCrkliplatz_panosphere_20210709.jpg",
    alt: "Zürich Bürkliplatz panosphere 20210709",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_B%C3%BCrkliplatz_panosphere_20210709.jpg",
  },
  "cabaret-voltaire": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Z%C3%BCrich_-_Cabaret_Voltaire_%2848687833078%29.jpg/1280px-Z%C3%BCrich_-_Cabaret_Voltaire_%2848687833078%29.jpg",
    alt: "Zürich - Cabaret Voltaire (48687833078)",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_-_Cabaret_Voltaire_%2848687833078%29.jpg",
  },
  "cafe-schober": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Z%C3%BCrich_%28Schweiz%29_--_2011_--_1396.jpg/1280px-Z%C3%BCrich_%28Schweiz%29_--_2011_--_1396.jpg",
    alt: "Zürich (Schweiz) -- 2011 -- 1396",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_%28Schweiz%29_--_2011_--_1396.jpg",
  },
  "cathedrale-lausanne": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Cath%C3%A9drale_de_Lausanne_-_int%C3%A9rieur.jpg/1280px-Cath%C3%A9drale_de_Lausanne_-_int%C3%A9rieur.jpg",
    alt: "Cathédrale de Lausanne - intérieur",
    credit: "https://commons.wikimedia.org/wiki/File%3ACath%C3%A9drale_de_Lausanne_-_int%C3%A9rieur.jpg",
  },
  "cathedrale-st-pierre": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Fa%C3%A7ade_de_la_cath%C3%A9drale_Saint-Pierre_de_Gen%C3%A8ve_2009-07-11.jpg/1280px-Fa%C3%A7ade_de_la_cath%C3%A9drale_Saint-Pierre_de_Gen%C3%A8ve_2009-07-11.jpg",
    alt: "Façade de la cathédrale Saint-Pierre de Genève 2009-07-11",
    credit: "https://commons.wikimedia.org/wiki/File%3AFa%C3%A7ade_de_la_cath%C3%A9drale_Saint-Pierre_de_Gen%C3%A8ve_2009-07-11.jpg",
  },
  "central-polybahn": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Polybahn_Z%C3%BCrich-20131011.jpg/1280px-Polybahn_Z%C3%BCrich-20131011.jpg",
    alt: "Polybahn Zürich-20131011",
    credit: "https://commons.wikimedia.org/wiki/File%3APolybahn_Z%C3%BCrich-20131011.jpg",
  },
  "chinagarten": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Chinagarten_Z%C3%BCrich_4.jpg/1280px-Chinagarten_Z%C3%BCrich_4.jpg",
    alt: "Chinagarten Zürich 4",
    credit: "https://commons.wikimedia.org/wiki/File%3AChinagarten_Z%C3%BCrich_4.jpg",
  },
  "drei-weieren": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/St.Gallen_Dreiweieren_Eichweiher.jpg/1280px-St.Gallen_Dreiweieren_Eichweiher.jpg",
    alt: "St.Gallen Dreiweieren Eichweiher",
    credit: "https://commons.wikimedia.org/wiki/File%3ASt.Gallen_Dreiweieren_Eichweiher.jpg",
  },
  "einsteinhaus": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Einstein_Haus.jpg/1280px-Einstein_Haus.jpg",
    alt: "Einstein Haus",
    credit: "https://commons.wikimedia.org/wiki/File%3AEinstein_Haus.jpg",
  },
  "erker-altstadt": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Erker_Gallusplatz.jpg/1280px-Erker_Gallusplatz.jpg",
    alt: "Erker Gallusplatz",
    credit: "https://commons.wikimedia.org/wiki/File%3AErker_Gallusplatz.jpg",
  },
  "escaliers-du-marche": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Escaliers_du_March%C3%A9_%282%29.jpg/1280px-Escaliers_du_March%C3%A9_%282%29.jpg",
    alt: "Escaliers du Marché (2)",
    credit: "https://commons.wikimedia.org/wiki/File%3AEscaliers_du_March%C3%A9_%282%29.jpg",
  },
  "europaallee": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Credit_Suisse_Office_at_Europaallee_in_Z%C3%BCrich%2C_Switzerland_%28Ank_Kumar%2C_Infosys_Limited%29.jpg/1280px-Credit_Suisse_Office_at_Europaallee_in_Z%C3%BCrich%2C_Switzerland_%28Ank_Kumar%2C_Infosys_Limited%29.jpg",
    alt: "Credit Suisse Office at Europaallee in Zürich, Switzerland (Ank Kumar, Infosys Limited)",
    credit: "https://commons.wikimedia.org/wiki/File%3ACredit_Suisse_Office_at_Europaallee_in_Z%C3%BCrich%2C_Switzerland_%28Ank_Kumar%2C_Infosys_Limited%29.jpg",
  },
  "felsenegg": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Adliswil.JPG/1280px-Adliswil.JPG",
    alt: "Adliswil",
    credit: "https://commons.wikimedia.org/wiki/File%3AAdliswil.JPG",
  },
  "felseneggbahn": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Luftseilbahn_Adliswil_Felsenegg_20220703.jpg/1280px-Luftseilbahn_Adliswil_Felsenegg_20220703.jpg",
    alt: "Luftseilbahn Adliswil Felsenegg 20220703",
    credit: "https://commons.wikimedia.org/wiki/File%3ALuftseilbahn_Adliswil_Felsenegg_20220703.jpg",
  },
  "fischmarktplatz-und-seequai": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Rapperswil_Schloss_Nacht.jpeg/1280px-Rapperswil_Schloss_Nacht.jpeg",
    alt: "Rapperswil Schloss Nacht",
    credit: "https://commons.wikimedia.org/wiki/File%3ARapperswil_Schloss_Nacht.jpeg",
  },
  "flon": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Lausanne-Flon-nuit-48.jpg/1280px-Lausanne-Flon-nuit-48.jpg",
    alt: "Lausanne-Flon-nuit-48",
    credit: "https://commons.wikimedia.org/wiki/File%3ALausanne-Flon-nuit-48.jpg",
  },
  "frau-gerolds-garten": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Z%C3%BCrich_-_Frau_Gerolds_Garten_%2848677206963%29.jpg/1280px-Z%C3%BCrich_-_Frau_Gerolds_Garten_%2848677206963%29.jpg",
    alt: "Zürich - Frau Gerolds Garten (48677206963)",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_-_Frau_Gerolds_Garten_%2848677206963%29.jpg",
  },
  "fraumuenster": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Z%C3%BCrich_-_Fraum%C3%BCnster_-_M%C3%BCnsterhof_IMG_3733.JPG/1280px-Z%C3%BCrich_-_Fraum%C3%BCnster_-_M%C3%BCnsterhof_IMG_3733.JPG",
    alt: "Zürich - Fraumünster - Münsterhof IMG 3733",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_-_Fraum%C3%BCnster_-_M%C3%BCnsterhof_IMG_3733.JPG",
  },
  "freitag-tower": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Prime_tower%2C_Hardbrucke_%28Ank_Kumar%2C_Infosys_limited%29_12.jpg/1280px-Prime_tower%2C_Hardbrucke_%28Ank_Kumar%2C_Infosys_limited%29_12.jpg",
    alt: "Prime tower, Hardbrucke (Ank Kumar, Infosys limited) 12",
    credit: "https://commons.wikimedia.org/wiki/File%3APrime_tower%2C_Hardbrucke_%28Ank_Kumar%2C_Infosys_limited%29_12.jpg",
  },
  "friedhof-sihlfeld": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Z%C3%BCrich_Aemtlerstrasse_05.jpg/1280px-Z%C3%BCrich_Aemtlerstrasse_05.jpg",
    alt: "Zürich Aemtlerstrasse 05",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_Aemtlerstrasse_05.jpg",
  },
  "gerechtigkeitsgasse": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Gerechtigkeitsgasse_%28Bern%29.jpg/1280px-Gerechtigkeitsgasse_%28Bern%29.jpg",
    alt: "Gerechtigkeitsgasse (Bern)",
    credit: "https://commons.wikimedia.org/wiki/File%3AGerechtigkeitsgasse_%28Bern%29.jpg",
  },
  "gerold-garten-finale": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Z%C3%BCrich_-_Frau_Gerolds_Garten_%2848677206963%29.jpg/1280px-Z%C3%BCrich_-_Frau_Gerolds_Garten_%2848677206963%29.jpg",
    alt: "Zürich - Frau Gerolds Garten (48677206963)",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_-_Frau_Gerolds_Garten_%2848677206963%29.jpg",
  },
  "geroldstrasse-streetart": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Regenschirme._Geroldstrasse_5._Z%C3%BCrich.jpg/1280px-Regenschirme._Geroldstrasse_5._Z%C3%BCrich.jpg",
    alt: "Regenschirme. Geroldstrasse 5. Zürich",
    credit: "https://commons.wikimedia.org/wiki/File%3ARegenschirme._Geroldstrasse_5._Z%C3%BCrich.jpg",
  },
  "grossmuenster": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Z%C3%BCrich_Switzerland-Grossm%C3%BCnster-01.jpg/1280px-Z%C3%BCrich_Switzerland-Grossm%C3%BCnster-01.jpg",
    alt: "Zürich Switzerland-Grossmünster-01",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_Switzerland-Grossm%C3%BCnster-01.jpg",
  },
  "hallwylplatz": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Volkshaus-zuerich.jpg/1280px-Volkshaus-zuerich.jpg",
    alt: "Volkshaus-zuerich",
    credit: "https://commons.wikimedia.org/wiki/File%3AVolkshaus-zuerich.jpg",
  },
  "hardbruecke": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Prime_Tower_Night_Z%C3%BCrich_Zurich.jpg/1280px-Prime_Tower_Night_Z%C3%BCrich_Zurich.jpg",
    alt: "Prime Tower Night Zürich Zurich",
    credit: "https://commons.wikimedia.org/wiki/File%3APrime_Tower_Night_Z%C3%BCrich_Zurich.jpg",
  },
  "hauptbahnhof": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Brunnen_Hauptbahnhof_Z%C3%BCrich_%28Halle%29.jpg/1280px-Brunnen_Hauptbahnhof_Z%C3%BCrich_%28Halle%29.jpg",
    alt: "Brunnen Hauptbahnhof Zürich (Halle)",
    credit: "https://commons.wikimedia.org/wiki/File%3ABrunnen_Hauptbahnhof_Z%C3%BCrich_%28Halle%29.jpg",
  },
  "hauptbahnhof-winterthur": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Bahnhof_Winterthur_-_SBB_Re_420_223_%26_Thurbo_Stadler_GTW_%282014%29.jpg/1280px-Bahnhof_Winterthur_-_SBB_Re_420_223_%26_Thurbo_Stadler_GTW_%282014%29.jpg",
    alt: "Bahnhof Winterthur - SBB Re 420 223 & Thurbo Stadler GTW (2014)",
    credit: "https://commons.wikimedia.org/wiki/File%3ABahnhof_Winterthur_-_SBB_Re_420_223_%26_Thurbo_Stadler_GTW_%282014%29.jpg",
  },
  "hb-blitzstart": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Brunnen_Hauptbahnhof_Z%C3%BCrich_%28Halle%29.jpg/1280px-Brunnen_Hauptbahnhof_Z%C3%BCrich_%28Halle%29.jpg",
    alt: "Brunnen Hauptbahnhof Zürich (Halle)",
    credit: "https://commons.wikimedia.org/wiki/File%3ABrunnen_Hauptbahnhof_Z%C3%BCrich_%28Halle%29.jpg",
  },
  "helvetiaplatz": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Helvetiaplatz_pano.jpg/1280px-Helvetiaplatz_pano.jpg",
    alt: "Helvetiaplatz pano",
    credit: "https://commons.wikimedia.org/wiki/File%3AHelvetiaplatz_pano.jpg",
  },
  "holzsteg-nach-hurden": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Rapperswil_-_Seedamm_-_Holzbr%C3%BCcke_-_Hurden_-_Etzel_Kulm_2010-10-21_16-44-08.JPG/1280px-Rapperswil_-_Seedamm_-_Holzbr%C3%BCcke_-_Hurden_-_Etzel_Kulm_2010-10-21_16-44-08.JPG",
    alt: "Rapperswil - Seedamm - Holzbrücke - Hurden - Etzel Kulm 2010-10-21 16-44-08",
    credit: "https://commons.wikimedia.org/wiki/File%3ARapperswil_-_Seedamm_-_Holzbr%C3%BCcke_-_Hurden_-_Etzel_Kulm_2010-10-21_16-44-08.JPG",
  },
  "idaplatz": {
    source: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Idaplatz_im_Winter_-_panoramio.jpg",
    alt: "Idaplatz im Winter - panoramio",
    credit: "https://commons.wikimedia.org/wiki/File%3AIdaplatz_im_Winter_-_panoramio.jpg",
  },
  "im-viadukt": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Aussersihler_Viadukt_-_Ladengesch%C3%A4fte.jpg/1280px-Aussersihler_Viadukt_-_Ladengesch%C3%A4fte.jpg",
    alt: "Aussersihler Viadukt - Ladengeschäfte",
    credit: "https://commons.wikimedia.org/wiki/File%3AAussersihler_Viadukt_-_Ladengesch%C3%A4fte.jpg",
  },
  "jardin-anglais": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Horloge_fleurie_Gen%C3%A8ve-04.jpg/1280px-Horloge_fleurie_Gen%C3%A8ve-04.jpg",
    alt: "Horloge fleurie Genève-04",
    credit: "https://commons.wikimedia.org/wiki/File%3AHorloge_fleurie_Gen%C3%A8ve-04.jpg",
  },
  "jesuitenkirche": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Luzern_asv2022-10_Jesuitenkirche_img2.jpg/1280px-Luzern_asv2022-10_Jesuitenkirche_img2.jpg",
    alt: "Luzern asv2022-10 Jesuitenkirche img2",
    credit: "https://commons.wikimedia.org/wiki/File%3ALuzern_asv2022-10_Jesuitenkirche_img2.jpg",
  },
  "jet-deau": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Jet_d%27eau_Aug_06.JPG/1280px-Jet_d%27eau_Aug_06.JPG",
    alt: "Jet d'eau Aug 06",
    credit: "https://commons.wikimedia.org/wiki/File%3AJet_d%27eau_Aug_06.JPG",
  },
  "josefwiese": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Josefwiese_Z%C3%BCrich_Dezember_2020.jpg/1280px-Josefwiese_Z%C3%BCrich_Dezember_2020.jpg",
    alt: "Josefwiese Zürich Dezember 2020",
    credit: "https://commons.wikimedia.org/wiki/File%3AJosefwiese_Z%C3%BCrich_Dezember_2020.jpg",
  },
  "josefwiese-pingpong": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Josefwiese_Z%C3%BCrich_Dezember_2020.jpg/1280px-Josefwiese_Z%C3%BCrich_Dezember_2020.jpg",
    alt: "Josefwiese Zürich Dezember 2020",
    credit: "https://commons.wikimedia.org/wiki/File%3AJosefwiese_Z%C3%BCrich_Dezember_2020.jpg",
  },
  "kalkbreite": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Z%C3%BCrich_Badenerstrasse_tram_depot.jpg/1280px-Z%C3%BCrich_Badenerstrasse_tram_depot.jpg",
    alt: "Zürich Badenerstrasse tram depot",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_Badenerstrasse_tram_depot.jpg",
  },
  "kanzlei-flohmarkt-social": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Brunnen_Engelstrasse_Ecke_Kanzleistrasse%2C_2019.jpg/1280px-Brunnen_Engelstrasse_Ecke_Kanzleistrasse%2C_2019.jpg",
    alt: "Brunnen Engelstrasse Ecke Kanzleistrasse, 2019",
    credit: "https://commons.wikimedia.org/wiki/File%3ABrunnen_Engelstrasse_Ecke_Kanzleistrasse%2C_2019.jpg",
  },
  "kanzleiareal": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Brunnen_Engelstrasse_Ecke_Kanzleistrasse%2C_2019.jpg/1280px-Brunnen_Engelstrasse_Ecke_Kanzleistrasse%2C_2019.jpg",
    alt: "Brunnen Engelstrasse Ecke Kanzleistrasse, 2019",
    credit: "https://commons.wikimedia.org/wiki/File%3ABrunnen_Engelstrasse_Ecke_Kanzleistrasse%2C_2019.jpg",
  },
  "kapellbruecke": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Luzern_asv2022-10_Kapellbr%C3%BCcke_img1.jpg/1280px-Luzern_asv2022-10_Kapellbr%C3%BCcke_img1.jpg",
    alt: "Luzern asv2022-10 Kapellbrücke img1",
    credit: "https://commons.wikimedia.org/wiki/File%3ALuzern_asv2022-10_Kapellbr%C3%BCcke_img1.jpg",
  },
  "kapuzinerkloster-am-endingerhorn": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Rapperswil_-_Kapuzinerkloster_20080222_006.jpg/1280px-Rapperswil_-_Kapuzinerkloster_20080222_006.jpg",
    alt: "Rapperswil - Kapuzinerkloster 20080222 006",
    credit: "https://commons.wikimedia.org/wiki/File%3ARapperswil_-_Kapuzinerkloster_20080222_006.jpg",
  },
  "klingental-faehre": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Basel_M%C3%BCnsterf%C3%A4hre-20120505-RM-145245.jpg/1280px-Basel_M%C3%BCnsterf%C3%A4hre-20120505-RM-145245.jpg",
    alt: "Basel Münsterfähre-20120505-RM-145245",
    credit: "https://commons.wikimedia.org/wiki/File%3ABasel_M%C3%BCnsterf%C3%A4hre-20120505-RM-145245.jpg",
  },
  "kunsthaus": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Kunsthaus_Z%C3%BCrich_by_ArmAg.jpg/1280px-Kunsthaus_Z%C3%BCrich_by_ArmAg.jpg",
    alt: "Kunsthaus Zürich by ArmAg",
    credit: "https://commons.wikimedia.org/wiki/File%3AKunsthaus_Z%C3%BCrich_by_ArmAg.jpg",
  },
  "kunstquartier-und-stadtgarten": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Kunstmuseum_Winterthur_58.JPG/1280px-Kunstmuseum_Winterthur_58.JPG",
    alt: "Kunstmuseum Winterthur 58",
    credit: "https://commons.wikimedia.org/wiki/File%3AKunstmuseum_Winterthur_58.JPG",
  },
  "landesmuseum": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Landesmuseum_Z%C3%BCrich%2C_2017.jpg/1280px-Landesmuseum_Z%C3%BCrich%2C_2017.jpg",
    alt: "Landesmuseum Zürich, 2017",
    credit: "https://commons.wikimedia.org/wiki/File%3ALandesmuseum_Z%C3%BCrich%2C_2017.jpg",
  },
  "langstrasse": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Perla_Mode_Langstrasse_Zurich.jpg/1280px-Perla_Mode_Langstrasse_Zurich.jpg",
    alt: "Perla Mode Langstrasse Zurich",
    credit: "https://commons.wikimedia.org/wiki/File%3APerla_Mode_Langstrasse_Zurich.jpg",
  },
  "letten-finale-social": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Z%C3%BCrich_Flussbad_Oberer_Letten.jpg/1280px-Z%C3%BCrich_Flussbad_Oberer_Letten.jpg",
    alt: "Zürich Flussbad Oberer Letten",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_Flussbad_Oberer_Letten.jpg",
  },
  "limmatplatz": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Zuerich_Migroshochhaus_2.jpg/1280px-Zuerich_Migroshochhaus_2.jpg",
    alt: "Zuerich Migroshochhaus 2",
    credit: "https://commons.wikimedia.org/wiki/File%3AZuerich_Migroshochhaus_2.jpg",
  },
  "lindenhof": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Lindenhof_Hill%2C_Zurich%2C_20250330_1227_7917.jpg/1280px-Lindenhof_Hill%2C_Zurich%2C_20250330_1227_7917.jpg",
    alt: "Lindenhof Hill, Zurich, 20250330 1227 7917",
    credit: "https://commons.wikimedia.org/wiki/File%3ALindenhof_Hill%2C_Zurich%2C_20250330_1227_7917.jpg",
  },
  "lindenhof-abend": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Lindenhof_Hill%2C_Zurich%2C_20250330_1227_7917.jpg/1280px-Lindenhof_Hill%2C_Zurich%2C_20250330_1227_7917.jpg",
    alt: "Lindenhof Hill, Zurich, 20250330 1227 7917",
    credit: "https://commons.wikimedia.org/wiki/File%3ALindenhof_Hill%2C_Zurich%2C_20250330_1227_7917.jpg",
  },
  "lindenhof-express": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Lindenhof_Hill%2C_Zurich%2C_20250330_1227_7917.jpg/1280px-Lindenhof_Hill%2C_Zurich%2C_20250330_1227_7917.jpg",
    alt: "Lindenhof Hill, Zurich, 20250330 1227 7917",
    credit: "https://commons.wikimedia.org/wiki/File%3ALindenhof_Hill%2C_Zurich%2C_20250330_1227_7917.jpg",
  },
  "loewendenkmal": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/L%C3%B6wendenkmal_-_The_Lion_Monument_%28Lucerne%29_02.jpg/1280px-L%C3%B6wendenkmal_-_The_Lion_Monument_%28Lucerne%29_02.jpg",
    alt: "Löwendenkmal - The Lion Monument (Lucerne) 02",
    credit: "https://commons.wikimedia.org/wiki/File%3AL%C3%B6wendenkmal_-_The_Lion_Monument_%28Lucerne%29_02.jpg",
  },
  "lokstadt-und-lagerplatz": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Halle_53%2C_Lokstadt_Winterthur_%2845996310572%29.jpg/1280px-Halle_53%2C_Lokstadt_Winterthur_%2845996310572%29.jpg",
    alt: "Halle 53, Lokstadt Winterthur (45996310572)",
    credit: "https://commons.wikimedia.org/wiki/File%3AHalle_53%2C_Lokstadt_Winterthur_%2845996310572%29.jpg",
  },
  "lungolago": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Lungolago_di_Paradiso%2C_Lugano_2004.jpg/1280px-Lungolago_di_Paradiso%2C_Lugano_2004.jpg",
    alt: "Lungolago di Paradiso, Lugano 2004",
    credit: "https://commons.wikimedia.org/wiki/File%3ALungolago_di_Paradiso%2C_Lugano_2004.jpg",
  },
  "marktgasse-und-altstadt": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Winterthur_Stadthaus.jpg/1280px-Winterthur_Stadthaus.jpg",
    alt: "Winterthur Stadthaus",
    credit: "https://commons.wikimedia.org/wiki/File%3AWinterthur_Stadthaus.jpg",
  },
  "markthalle-foodtour": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Aussersihler_Viadukt_-_Ladengesch%C3%A4fte.jpg/1280px-Aussersihler_Viadukt_-_Ladengesch%C3%A4fte.jpg",
    alt: "Aussersihler Viadukt - Ladengeschäfte",
    credit: "https://commons.wikimedia.org/wiki/File%3AAussersihler_Viadukt_-_Ladengesch%C3%A4fte.jpg",
  },
  "markthalle-gemeinschaftstisch": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Aussersihler_Viadukt_-_Ladengesch%C3%A4fte.jpg/1280px-Aussersihler_Viadukt_-_Ladengesch%C3%A4fte.jpg",
    alt: "Aussersihler Viadukt - Ladengeschäfte",
    credit: "https://commons.wikimedia.org/wiki/File%3AAussersihler_Viadukt_-_Ladengesch%C3%A4fte.jpg",
  },
  "marktplatz-rathaus": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Basel_Marktplatz_Rotes_Rathaus_by_Niederkasseler_-_panoramio.jpg/1280px-Basel_Marktplatz_Rotes_Rathaus_by_Niederkasseler_-_panoramio.jpg",
    alt: "Basel Marktplatz Rotes Rathaus by Niederkasseler - panoramio",
    credit: "https://commons.wikimedia.org/wiki/File%3ABasel_Marktplatz_Rotes_Rathaus_by_Niederkasseler_-_panoramio.jpg",
  },
  "mittlere-bruecke": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Mittlere_Br%C3%BCcke_-_Basel.jpg/1280px-Mittlere_Br%C3%BCcke_-_Basel.jpg",
    alt: "Mittlere Brücke - Basel",
    credit: "https://commons.wikimedia.org/wiki/File%3AMittlere_Br%C3%BCcke_-_Basel.jpg",
  },
  "muehleschleuse-surfer": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/M%C3%BChleschleusenbr%C3%BCcke_%C3%BCber_die_innere_Aare%2C_Thun_BE_20221108-jag9889_Horizont.jpg/1280px-M%C3%BChleschleusenbr%C3%BCcke_%C3%BCber_die_innere_Aare%2C_Thun_BE_20221108-jag9889_Horizont.jpg",
    alt: "Mühleschleusenbrücke über die innere Aare, Thun BE 20221108-jag9889 Horizont",
    credit: "https://commons.wikimedia.org/wiki/File%3AM%C3%BChleschleusenbr%C3%BCcke_%C3%BCber_die_innere_Aare%2C_Thun_BE_20221108-jag9889_Horizont.jpg",
  },
  "muenster": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Berner_M%C3%BCnster_Turm_Oktagon_Skulpturen_08.jpg/1280px-Berner_M%C3%BCnster_Turm_Oktagon_Skulpturen_08.jpg",
    alt: "Berner Münster Turm Oktagon Skulpturen 08",
    credit: "https://commons.wikimedia.org/wiki/File%3ABerner_M%C3%BCnster_Turm_Oktagon_Skulpturen_08.jpg",
  },
  "muenster-pfalz": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Ausblick_auf_den_Rhein_und_zum_Basler_M%C3%BCnster_%2811620838405%29.jpg/1280px-Ausblick_auf_den_Rhein_und_zum_Basler_M%C3%BCnster_%2811620838405%29.jpg",
    alt: "Ausblick auf den Rhein und zum Basler Münster (11620838405)",
    credit: "https://commons.wikimedia.org/wiki/File%3AAusblick_auf_den_Rhein_und_zum_Basler_M%C3%BCnster_%2811620838405%29.jpg",
  },
  "muensterbruecke": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Z%C3%BCrich_view_Quaibr%C3%BCcke_20200702.jpg/1280px-Z%C3%BCrich_view_Quaibr%C3%BCcke_20200702.jpg",
    alt: "Zürich view Quaibrücke 20200702",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_view_Quaibr%C3%BCcke_20200702.jpg",
  },
  "muensterbruecke-grossmuenster-express": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Z%C3%BCrich_Switzerland-Grossm%C3%BCnster-01.jpg/1280px-Z%C3%BCrich_Switzerland-Grossm%C3%BCnster-01.jpg",
    alt: "Zürich Switzerland-Grossmünster-01",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_Switzerland-Grossm%C3%BCnster-01.jpg",
  },
  "museggmauer": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Luzern_asv2022-10_Museggmauer.jpg/1280px-Luzern_asv2022-10_Museggmauer.jpg",
    alt: "Luzern asv2022-10 Museggmauer",
    credit: "https://commons.wikimedia.org/wiki/File%3ALuzern_asv2022-10_Museggmauer.jpg",
  },
  "nationalquai": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Dampfschiff_Stadt_Luzern_1928.jpg/1280px-Dampfschiff_Stadt_Luzern_1928.jpg",
    alt: "Dampfschiff Stadt Luzern 1928",
    credit: "https://commons.wikimedia.org/wiki/File%3ADampfschiff_Stadt_Luzern_1928.jpg",
  },
  "negrellisteg": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Negrellisteg_Nordturm.jpg/1280px-Negrellisteg_Nordturm.jpg",
    alt: "Negrellisteg Nordturm",
    credit: "https://commons.wikimedia.org/wiki/File%3ANegrellisteg_Nordturm.jpg",
  },
  "niederdorf": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Z%C3%BCrich_%28Schweiz%29_--_2011_--_1396.jpg/1280px-Z%C3%BCrich_%28Schweiz%29_--_2011_--_1396.jpg",
    alt: "Zürich (Schweiz) -- 2011 -- 1396",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_%28Schweiz%29_--_2011_--_1396.jpg",
  },
  "oberburg-das-staedtli": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Regensberg_%28Kunreuth%29_cropped.jpg/1280px-Regensberg_%28Kunreuth%29_cropped.jpg",
    alt: "Regensberg (Kunreuth) cropped",
    credit: "https://commons.wikimedia.org/wiki/File%3ARegensberg_%28Kunreuth%29_cropped.jpg",
  },
  "obere-gasse": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Chur_in_Graub%C3%BCnden_%28Zwitserland%29_030.jpg/1280px-Chur_in_Graub%C3%BCnden_%28Zwitserland%29_030.jpg",
    alt: "Chur in Graubünden (Zwitserland) 030",
    credit: "https://commons.wikimedia.org/wiki/File%3AChur_in_Graub%C3%BCnden_%28Zwitserland%29_030.jpg",
  },
  "obere-hauptgasse": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Obere_Hauptgasse_74_und_Altstadt_von_Thun_%282014%29.jpg/1280px-Obere_Hauptgasse_74_und_Altstadt_von_Thun_%282014%29.jpg",
    alt: "Obere Hauptgasse 74 und Altstadt von Thun (2014)",
    credit: "https://commons.wikimedia.org/wiki/File%3AObere_Hauptgasse_74_und_Altstadt_von_Thun_%282014%29.jpg",
  },
  "oberer-letten": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Z%C3%BCrich_Flussbad_Oberer_Letten.jpg/1280px-Z%C3%BCrich_Flussbad_Oberer_Letten.jpg",
    alt: "Zürich Flussbad Oberer Letten",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_Flussbad_Oberer_Letten.jpg",
  },
  "obertor": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Chur_Obertor_Info.jpg/1280px-Chur_Obertor_Info.jpg",
    alt: "Chur Obertor Info",
    credit: "https://commons.wikimedia.org/wiki/File%3AChur_Obertor_Info.jpg",
  },
  "odeon": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Z%C3%BCrich_-_Apotheke-Cafe_Odeon_IMG_0562_ShiftN.jpg/1280px-Z%C3%BCrich_-_Apotheke-Cafe_Odeon_IMG_0562_ShiftN.jpg",
    alt: "Zürich - Apotheke-Cafe Odeon IMG 0562 ShiftN",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_-_Apotheke-Cafe_Odeon_IMG_0562_ShiftN.jpg",
  },
  "opernhaus": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Opernhaus_Z%C3%BCrich_-_Sechsel%C3%A4utenplatz_2013-08-31_18-30-40.JPG/1280px-Opernhaus_Z%C3%BCrich_-_Sechsel%C3%A4utenplatz_2013-08-31_18-30-40.JPG",
    alt: "Opernhaus Zürich - Sechseläutenplatz 2013-08-31 18-30-40",
    credit: "https://commons.wikimedia.org/wiki/File%3AOpernhaus_Z%C3%BCrich_-_Sechsel%C3%A4utenplatz_2013-08-31_18-30-40.JPG",
  },
  "ouchy-olympia": {
    source: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Entree_musee_olympique%2C_Lausanne.jpg",
    alt: "Entree musee olympique, Lausanne",
    credit: "https://commons.wikimedia.org/wiki/File%3AEntree_musee_olympique%2C_Lausanne.jpg",
  },
  "paradeplatz-spruengli": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Credit_Suisse%2C_Zurich_Paradeplatz_%28Ank_Kumar%2C_Infosys_Limited%29_09.jpg/1280px-Credit_Suisse%2C_Zurich_Paradeplatz_%28Ank_Kumar%2C_Infosys_Limited%29_09.jpg",
    alt: "Credit Suisse, Zurich Paradeplatz (Ank Kumar, Infosys Limited) 09",
    credit: "https://commons.wikimedia.org/wiki/File%3ACredit_Suisse%2C_Zurich_Paradeplatz_%28Ank_Kumar%2C_Infosys_Limited%29_09.jpg",
  },
  "parc-des-bastions": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gen%C3%A8ve_-_Reformation_monument_-_Mur_des_R%C3%A9formateurs_-_panoramio.jpg/1280px-Gen%C3%A8ve_-_Reformation_monument_-_Mur_des_R%C3%A9formateurs_-_panoramio.jpg",
    alt: "Genève - Reformation monument - Mur des Réformateurs - panoramio",
    credit: "https://commons.wikimedia.org/wiki/File%3AGen%C3%A8ve_-_Reformation_monument_-_Mur_des_R%C3%A9formateurs_-_panoramio.jpg",
  },
  "parco-ciani": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Parco_Ciani_%28Lugano%29_IV.jpg/1280px-Parco_Ciani_%28Lugano%29_IV.jpg",
    alt: "Parco Ciani (Lugano) IV",
    credit: "https://commons.wikimedia.org/wiki/File%3AParco_Ciani_%28Lugano%29_IV.jpg",
  },
  "piazza-cella": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Zwinglistrasse_32_Z%C3%BCrich.jpeg/1280px-Zwinglistrasse_32_Z%C3%BCrich.jpeg",
    alt: "Zwinglistrasse 32 Zürich",
    credit: "https://commons.wikimedia.org/wiki/File%3AZwinglistrasse_32_Z%C3%BCrich.jpeg",
  },
  "piazza-riforma": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Lugano_from_Sighignola.jpg/1280px-Lugano_from_Sighignola.jpg",
    alt: "Lugano from Sighignola",
    credit: "https://commons.wikimedia.org/wiki/File%3ALugano_from_Sighignola.jpg",
  },
  "place-de-la-palud": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Place_de_la_Palud_Lausanne.jpg/1280px-Place_de_la_Palud_Lausanne.jpg",
    alt: "Place de la Palud Lausanne",
    credit: "https://commons.wikimedia.org/wiki/File%3APlace_de_la_Palud_Lausanne.jpg",
  },
  "planetenweg": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/From_Uetliberg_to_Felsenegg_%2C_Zurich_-_panoramio_%28148%29.jpg/1280px-From_Uetliberg_to_Felsenegg_%2C_Zurich_-_panoramio_%28148%29.jpg",
    alt: "From Uetliberg to Felsenegg , Zurich - panoramio (148)",
    credit: "https://commons.wikimedia.org/wiki/File%3AFrom_Uetliberg_to_Felsenegg_%2C_Zurich_-_panoramio_%28148%29.jpg",
  },
  "platzspitz-letten-weg": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Letten-Viadukt_%281894%29_%C3%BCber_die_Limmat%2C_Stadt_Z%C3%BCrich_20180908-jag9889.jpg/1280px-Letten-Viadukt_%281894%29_%C3%BCber_die_Limmat%2C_Stadt_Z%C3%BCrich_20180908-jag9889.jpg",
    alt: "Letten-Viadukt (1894) über die Limmat, Stadt Zürich 20180908-jag9889",
    credit: "https://commons.wikimedia.org/wiki/File%3ALetten-Viadukt_%281894%29_%C3%BCber_die_Limmat%2C_Stadt_Z%C3%BCrich_20180908-jag9889.jpg",
  },
  "polyterrasse": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Polyterrasse_Z%C3%BCrich_2022-09-24_01.jpg/1280px-Polyterrasse_Z%C3%BCrich_2022-09-24_01.jpg",
    alt: "Polyterrasse Zürich 2022-09-24 01",
    credit: "https://commons.wikimedia.org/wiki/File%3APolyterrasse_Z%C3%BCrich_2022-09-24_01.jpg",
  },
  "quai-ouchy": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Place_du_Port_%40_Ouchy_%40_Lausanne_%2836517578000%29.jpg/1280px-Place_du_Port_%40_Ouchy_%40_Lausanne_%2836517578000%29.jpg",
    alt: "Place du Port @ Ouchy @ Lausanne (36517578000)",
    credit: "https://commons.wikimedia.org/wiki/File%3APlace_du_Port_%40_Ouchy_%40_Lausanne_%2836517578000%29.jpg",
  },
  "reformierte-kirche": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Eglisau_Kirche.JPG/1280px-Eglisau_Kirche.JPG",
    alt: "Eglisau Kirche",
    credit: "https://commons.wikimedia.org/wiki/File%3AEglisau_Kirche.JPG",
  },
  "rentenwiese-seebad": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Enge_-_Seebad_-_Arboretum_Z%C3%BCrich_2015-02-26_11-56-02.JPG/1280px-Enge_-_Seebad_-_Arboretum_Z%C3%BCrich_2015-02-26_11-56-02.JPG",
    alt: "Enge - Seebad - Arboretum Zürich 2015-02-26 11-56-02",
    credit: "https://commons.wikimedia.org/wiki/File%3AEnge_-_Seebad_-_Arboretum_Z%C3%BCrich_2015-02-26_11-56-02.JPG",
  },
  "rheinbruecke": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Rheinbruecke_Eglisau_02_10.jpg/1280px-Rheinbruecke_Eglisau_02_10.jpg",
    alt: "Rheinbruecke Eglisau 02 10",
    credit: "https://commons.wikimedia.org/wiki/File%3ARheinbruecke_Eglisau_02_10.jpg",
  },
  "rheingasse-kleinbasel": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Rheingasse_48.jpg/1280px-Rheingasse_48.jpg",
    alt: "Rheingasse 48",
    credit: "https://commons.wikimedia.org/wiki/File%3ARheingasse_48.jpg",
  },
  "roentgenplatz": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/R%C3%B6ngtenplatz01.JPG/1280px-R%C3%B6ngtenplatz01.JPG",
    alt: "Röngtenplatz01",
    credit: "https://commons.wikimedia.org/wiki/File%3AR%C3%B6ngtenplatz01.JPG",
  },
  "rosengaerten": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Rapperswil_-_Hafen_-_Panta_Rhei_-_Einsiedlerhaus-Roseng%C3%A4rten_-_Lindenhof_2011-06-19_15-16-24_ShiftN.jpg/1280px-Rapperswil_-_Hafen_-_Panta_Rhei_-_Einsiedlerhaus-Roseng%C3%A4rten_-_Lindenhof_2011-06-19_15-16-24_ShiftN.jpg",
    alt: "Rapperswil - Hafen - Panta Rhei - Einsiedlerhaus-Rosengärten - Lindenhof 2011-06-19 15-16-24 ShiftN",
    credit: "https://commons.wikimedia.org/wiki/File%3ARapperswil_-_Hafen_-_Panta_Rhei_-_Einsiedlerhaus-Roseng%C3%A4rten_-_Lindenhof_2011-06-19_15-16-24_ShiftN.jpg",
  },
  "rosengarten": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Altstadt_Bern_%28S%C3%BCdostseite%29.jpg/1280px-Altstadt_Bern_%28S%C3%BCdostseite%29.jpg",
    alt: "Altstadt Bern (Südostseite)",
    credit: "https://commons.wikimedia.org/wiki/File%3AAltstadt_Bern_%28S%C3%BCdostseite%29.jpg",
  },
  "rote-fabrik": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Rote_Fabrik_%28Ank_Kumar_Infosys_Limited%29_02.jpg/1280px-Rote_Fabrik_%28Ank_Kumar_Infosys_Limited%29_02.jpg",
    alt: "Rote Fabrik (Ank Kumar Infosys Limited) 02",
    credit: "https://commons.wikimedia.org/wiki/File%3ARote_Fabrik_%28Ank_Kumar_Infosys_Limited%29_02.jpg",
  },
  "rundturm": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Regensberg_-_Schloss_-_L%C3%A4gern_20100524_18-16-46.JPG/1280px-Regensberg_-_Schloss_-_L%C3%A4gern_20100524_18-16-46.JPG",
    alt: "Regensberg - Schloss - Lägern 20100524 18-16-46",
    credit: "https://commons.wikimedia.org/wiki/File%3ARegensberg_-_Schloss_-_L%C3%A4gern_20100524_18-16-46.JPG",
  },
  "saffa-insel": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Saffa_Insel_bei_Wollishofen.JPG/1280px-Saffa_Insel_bei_Wollishofen.JPG",
    alt: "Saffa Insel bei Wollishofen",
    credit: "https://commons.wikimedia.org/wiki/File%3ASaffa_Insel_bei_Wollishofen.JPG",
  },
  "santa-maria-angioli": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Lugano_Santa_Maria_Angeli_Luini_Ultima_Cena_2.jpg/1280px-Lugano_Santa_Maria_Angeli_Luini_Ultima_Cena_2.jpg",
    alt: "Lugano Santa Maria Angeli Luini Ultima Cena 2",
    credit: "https://commons.wikimedia.org/wiki/File%3ALugano_Santa_Maria_Angeli_Luini_Ultima_Cena_2.jpg",
  },
  "schadaupark": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Schloss_Schadau_Thun_20140501.jpg/1280px-Schloss_Schadau_Thun_20140501.jpg",
    alt: "Schloss Schadau Thun 20140501",
    credit: "https://commons.wikimedia.org/wiki/File%3ASchloss_Schadau_Thun_20140501.jpg",
  },
  "schiffbau": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/VBZ_Tram_4035_leaving_Schiffbau%2C_Z%C3%BCrich.jpg/1280px-VBZ_Tram_4035_leaving_Schiffbau%2C_Z%C3%BCrich.jpg",
    alt: "VBZ Tram 4035 leaving Schiffbau, Zürich",
    credit: "https://commons.wikimedia.org/wiki/File%3AVBZ_Tram_4035_leaving_Schiffbau%2C_Z%C3%BCrich.jpg",
  },
  "schipfe": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Z%C3%BCrich_Switzerland-Schipfe-01.jpg/1280px-Z%C3%BCrich_Switzerland-Schipfe-01.jpg",
    alt: "Zürich Switzerland-Schipfe-01",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_Switzerland-Schipfe-01.jpg",
  },
  "schipfe-express": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Z%C3%BCrich_Switzerland-Schipfe-01.jpg/1280px-Z%C3%BCrich_Switzerland-Schipfe-01.jpg",
    alt: "Zürich Switzerland-Schipfe-01",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_Switzerland-Schipfe-01.jpg",
  },
  "schloss-rapperswil": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Rapperswil_Schloss_Nacht.jpeg/1280px-Rapperswil_Schloss_Nacht.jpeg",
    alt: "Rapperswil Schloss Nacht",
    credit: "https://commons.wikimedia.org/wiki/File%3ARapperswil_Schloss_Nacht.jpeg",
  },
  "schloss-regensberg": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Regensberg_-_Schloss_-_L%C3%A4gern_20100524_18-16-46.JPG/1280px-Regensberg_-_Schloss_-_L%C3%A4gern_20100524_18-16-46.JPG",
    alt: "Regensberg - Schloss - Lägern 20100524 18-16-46",
    credit: "https://commons.wikimedia.org/wiki/File%3ARegensberg_-_Schloss_-_L%C3%A4gern_20100524_18-16-46.JPG",
  },
  "schloss-thun": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Rathausplatz%2C_Zunfthaus_zu_Metzgern_und_Schloss_Thun_%282014%29.jpg/1280px-Rathausplatz%2C_Zunfthaus_zu_Metzgern_und_Schloss_Thun_%282014%29.jpg",
    alt: "Rathausplatz, Zunfthaus zu Metzgern und Schloss Thun (2014)",
    credit: "https://commons.wikimedia.org/wiki/File%3ARathausplatz%2C_Zunfthaus_zu_Metzgern_und_Schloss_Thun_%282014%29.jpg",
  },
  "schwarzenbach": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/M%C3%BCnstergasse_19_und_Napfgasse_1_in_Z%C3%BCrich.jpg/1280px-M%C3%BCnstergasse_19_und_Napfgasse_1_in_Z%C3%BCrich.jpg",
    alt: "Münstergasse 19 und Napfgasse 1 in Zürich",
    credit: "https://commons.wikimedia.org/wiki/File%3AM%C3%BCnstergasse_19_und_Napfgasse_1_in_Z%C3%BCrich.jpg",
  },
  "seepromenade": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/General-Guisan-Quai_Z%C3%BCrich_2022-09-24_01.jpg/1280px-General-Guisan-Quai_Z%C3%BCrich_2022-09-24_01.jpg",
    alt: "General-Guisan-Quai Zürich 2022-09-24 01",
    credit: "https://commons.wikimedia.org/wiki/File%3AGeneral-Guisan-Quai_Z%C3%BCrich_2022-09-24_01.jpg",
  },
  "shopville": {
    source: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Shopville_zurich.jpg",
    alt: "Shopville zurich",
    credit: "https://commons.wikimedia.org/wiki/File%3AShopville_zurich.jpg",
  },
  "spheres-buchbar": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Turbinenplatz-Night-1.jpg/1280px-Turbinenplatz-Night-1.jpg",
    alt: "Turbinenplatz-Night-1",
    credit: "https://commons.wikimedia.org/wiki/File%3ATurbinenplatz-Night-1.jpg",
  },
  "spreuerbruecke": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Nadelwehr_und_Spreuerbr%C3%BCcke_Luzern.jpg/1280px-Nadelwehr_und_Spreuerbr%C3%BCcke_Luzern.jpg",
    alt: "Nadelwehr und Spreuerbrücke Luzern",
    credit: "https://commons.wikimedia.org/wiki/File%3ANadelwehr_und_Spreuerbr%C3%BCcke_Luzern.jpg",
  },
  "st-peter": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Kirche_St._Peter_Z%C3%BCrich.jpg/1280px-Kirche_St._Peter_Z%C3%BCrich.jpg",
    alt: "Kirche St. Peter Zürich",
    credit: "https://commons.wikimedia.org/wiki/File%3AKirche_St._Peter_Z%C3%BCrich.jpg",
  },
  "stadthaus-von-gottfried-semper": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Winterthur_Stadthaus.jpg/1280px-Winterthur_Stadthaus.jpg",
    alt: "Winterthur Stadthaus",
    credit: "https://commons.wikimedia.org/wiki/File%3AWinterthur_Stadthaus.jpg",
  },
  "stadtkirche": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Winterthur_Stadtkirche_nordost.jpg/1280px-Winterthur_Stadtkirche_nordost.jpg",
    alt: "Winterthur Stadtkirche nordost",
    credit: "https://commons.wikimedia.org/wiki/File%3AWinterthur_Stadtkirche_nordost.jpg",
  },
  "stadtlounge": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stadtlounge_St._Gallen_mit_Raiffeisen_Schweiz_%26_Restaurant_Roter_Platz_%282017%29.jpg/1280px-Stadtlounge_St._Gallen_mit_Raiffeisen_Schweiz_%26_Restaurant_Roter_Platz_%282017%29.jpg",
    alt: "Stadtlounge St. Gallen mit Raiffeisen Schweiz & Restaurant Roter Platz (2017)",
    credit: "https://commons.wikimedia.org/wiki/File%3AStadtlounge_St._Gallen_mit_Raiffeisen_Schweiz_%26_Restaurant_Roter_Platz_%282017%29.jpg",
  },
  "stiftsbezirk-kathedrale": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Stiftskirche_St._Gallen_%28April_2017%29.jpg/1280px-Stiftskirche_St._Gallen_%28April_2017%29.jpg",
    alt: "Stiftskirche St. Gallen (April 2017)",
    credit: "https://commons.wikimedia.org/wiki/File%3AStiftskirche_St._Gallen_%28April_2017%29.jpg",
  },
  "stiftsbibliothek": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Stiftsbibliothek_Saal_2023_1.jpg/1280px-Stiftsbibliothek_Saal_2023_1.jpg",
    alt: "Stiftsbibliothek Saal 2023 1",
    credit: "https://commons.wikimedia.org/wiki/File%3AStiftsbibliothek_Saal_2023_1.jpg",
  },
  "sulzerareal-und-kesselhaus": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sulzer-Areal_Winterthur_-_Turbinenstrasse.jpg/1280px-Sulzer-Areal_Winterthur_-_Turbinenstrasse.jpg",
    alt: "Sulzer-Areal Winterthur - Turbinenstrasse",
    credit: "https://commons.wikimedia.org/wiki/File%3ASulzer-Areal_Winterthur_-_Turbinenstrasse.jpg",
  },
  "uetliberg-bahn": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Uetliberg-Bahn._Zurich._affiche%2C_non_identifi%C3%A9.jpg/1280px-Uetliberg-Bahn._Zurich._affiche%2C_non_identifi%C3%A9.jpg",
    alt: "Uetliberg-Bahn. Zurich. affiche, non identifié",
    credit: "https://commons.wikimedia.org/wiki/File%3AUetliberg-Bahn._Zurich._affiche%2C_non_identifi%C3%A9.jpg",
  },
  "unterburg-und-aufstieg": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Regensberg_%28Kunreuth%29_cropped.jpg/1280px-Regensberg_%28Kunreuth%29_cropped.jpg",
    alt: "Regensberg (Kunreuth) cropped",
    credit: "https://commons.wikimedia.org/wiki/File%3ARegensberg_%28Kunreuth%29_cropped.jpg",
  },
  "unterer-rheinweg": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Rheinufer_Kleinbasel.jpg/1280px-Rheinufer_Kleinbasel.jpg",
    alt: "Rheinufer Kleinbasel",
    credit: "https://commons.wikimedia.org/wiki/File%3ARheinufer_Kleinbasel.jpg",
  },
  "untergass-das-staedtli": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Eglisau_Untergass_1.JPG/1280px-Eglisau_Untergass_1.JPG",
    alt: "Eglisau Untergass 1",
    credit: "https://commons.wikimedia.org/wiki/File%3AEglisau_Untergass_1.JPG",
  },
  "via-nassa": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Via_Nassa_in_Lugano_%282026%29.jpg/1280px-Via_Nassa_in_Lugano_%282026%29.jpg",
    alt: "Via Nassa in Lugano (2026)",
    credit: "https://commons.wikimedia.org/wiki/File%3AVia_Nassa_in_Lugano_%282026%29.jpg",
  },
  "weinmarkt": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Luzern_Weinmarkt_4.JPG/1280px-Luzern_Weinmarkt_4.JPG",
    alt: "Luzern Weinmarkt 4",
    credit: "https://commons.wikimedia.org/wiki/File%3ALuzern_Weinmarkt_4.JPG",
  },
  "zytglogge": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/The_Zytglogge_clock_tower.jpg/1280px-The_Zytglogge_clock_tower.jpg",
    alt: "The Zytglogge clock tower",
    credit: "https://commons.wikimedia.org/wiki/File%3AThe_Zytglogge_clock_tower.jpg",
  },
  "so-krummturm": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Krummturm.4132.JPG/1280px-Krummturm.4132.JPG",
    alt: "Krummturm in Solothurn mit seinem «schiefen» Dach",
    credit: "https://commons.wikimedia.org/wiki/File%3AKrummturm.4132.JPG",
  },
  "so-wengibruecke-landhausquai": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Landhausquai_4%2C_Landhaus_Solothurn_20240331_0055.jpg/1280px-Landhausquai_4%2C_Landhaus_Solothurn_20240331_0055.jpg",
    alt: "Landhaus am Landhausquai in Solothurn",
    credit: "https://commons.wikimedia.org/wiki/File%3ALandhausquai_4%2C_Landhaus_Solothurn_20240331_0055.jpg",
  },
  "so-zytglogge": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Solothurn_Zeitglockenturm_3.JPG/1280px-Solothurn_Zeitglockenturm_3.JPG",
    alt: "Zeitglockenturm (Zytglogge) in Solothurn",
    credit: "https://commons.wikimedia.org/wiki/File%3ASolothurn_Zeitglockenturm_3.JPG",
  },
  "so-jesuitenkirche": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Jesuitenkirche_Solothurn_%281%29.jpg/1280px-Jesuitenkirche_Solothurn_%281%29.jpg",
    alt: "Jesuitenkirche an der Hauptgasse in Solothurn",
    credit: "https://commons.wikimedia.org/wiki/File%3AJesuitenkirche_Solothurn_%281%29.jpg",
  },
  "so-rathaus": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Rathaus_Kanton_Solothurn_1.jpg/1280px-Rathaus_Kanton_Solothurn_1.jpg",
    alt: "Ostfassade des Rathauses Solothurn",
    credit: "https://commons.wikimedia.org/wiki/File%3ARathaus_Kanton_Solothurn_1.jpg",
  },
  "so-baseltor": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Solothurn_Baseltor_1.JPG/1280px-Solothurn_Baseltor_1.JPG",
    alt: "Baseltor in Solothurn",
    credit: "https://commons.wikimedia.org/wiki/File%3ASolothurn_Baseltor_1.JPG",
  },
  "so-st-ursen": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/St._Ursenkathedrale.jpg/1280px-St._Ursenkathedrale.jpg",
    alt: "St.-Ursen-Kathedrale in Solothurn",
    credit: "https://commons.wikimedia.org/wiki/File%3ASt._Ursenkathedrale.jpg",
  },
  "so-roetibruecke": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Aare_und_St._Ursen_Kathedrale_in_Solothurn_%282014%29.jpg/1280px-Aare_und_St._Ursen_Kathedrale_in_Solothurn_%282014%29.jpg",
    alt: "Aare mit Ritterquai und St.-Ursen-Kathedrale in Solothurn",
    credit: "https://commons.wikimedia.org/wiki/File%3AAare_und_St._Ursen_Kathedrale_in_Solothurn_%282014%29.jpg",
  },
  "so-riedholzturm": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Riedholzturm_und_St._Ursenbastion%2C_Solothurn.jpg/1280px-Riedholzturm_und_St._Ursenbastion%2C_Solothurn.jpg",
    alt: "Riedholzturm und St.-Ursen-Bastion in Solothurn, von Norden",
    credit: "https://commons.wikimedia.org/wiki/File%3ARiedholzturm_und_St._Ursenbastion%2C_Solothurn.jpg",
  },
  "so-einsiedelei": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Einsiedelei_St_Verena_November_2015.jpg/1280px-Einsiedelei_St_Verena_November_2015.jpg",
    alt: "Einsiedelei St. Verena in der Verenaschlucht",
    credit: "https://commons.wikimedia.org/wiki/File%3AEinsiedelei_St_Verena_November_2015.jpg",
  },
  "so-schluchteingang": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Katholische_Kirche._Feldbrunnen-St._Niklaus_%281%29.jpg/1280px-Katholische_Kirche._Feldbrunnen-St._Niklaus_%281%29.jpg",
    alt: "Kirche St. Niklaus, wo der Kreuzweg zur Verenaschlucht beginnt",
    credit: "https://commons.wikimedia.org/wiki/File%3AKatholische_Kirche._Feldbrunnen-St._Niklaus_%281%29.jpg",
  },
  "so-verenaschlucht": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Verenaschlucht_Nov_2015_Fussweg.jpg/1280px-Verenaschlucht_Nov_2015_Fussweg.jpg",
    alt: "Fussweg mit Holzgeländer am Verenabach im Herbst",
    credit: "https://commons.wikimedia.org/wiki/File%3AVerenaschlucht_Nov_2015_Fussweg.jpg",
  },
  "so-kreuzen": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Zentralbibliothek_Solothurn_-_Eglise_des_Croix_pr%C3%A8s_de_Soleure_-_aa0457.tiff/lossy-page1-1280px-Zentralbibliothek_Solothurn_-_Eglise_des_Croix_pr%C3%A8s_de_Soleure_-_aa0457.tiff.jpg",
    alt: "Historischer Stich der Kapelle Kreuzen bei Solothurn (Zentralbibliothek Solothurn)",
    credit: "https://commons.wikimedia.org/wiki/File%3AZentralbibliothek_Solothurn_-_Eglise_des_Croix_pr%C3%A8s_de_Soleure_-_aa0457.tiff",
  },
  "so-schloss-waldegg": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Schloss_Waldegg.jpg/1280px-Schloss_Waldegg.jpg",
    alt: "Schloss Waldegg mit Barockgarten, Südseite",
    credit: "https://commons.wikimedia.org/wiki/File%3ASchloss_Waldegg.jpg",
  },
};

export const tourHeroImages: Record<string, StopImageSource> = {
  "baden-altstadt": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Baden_Stadtturm_9785.jpg/1280px-Baden_Stadtturm_9785.jpg",
    alt: "Baden Stadtturm 9785",
    credit: "https://commons.wikimedia.org/wiki/File%3ABaden_Stadtturm_9785.jpg",
  },
  "basel-rhein": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Ausblick_auf_den_Rhein_und_zum_Basler_M%C3%BCnster_%2811620838405%29.jpg/1280px-Ausblick_auf_den_Rhein_und_zum_Basler_M%C3%BCnster_%2811620838405%29.jpg",
    alt: "Ausblick auf den Rhein und zum Basler Münster (11620838405)",
    credit: "https://commons.wikimedia.org/wiki/File%3AAusblick_auf_den_Rhein_und_zum_Basler_M%C3%BCnster_%2811620838405%29.jpg",
  },
  "bern-altstadt": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Altstadt_Bern_%28S%C3%BCdostseite%29.jpg/1280px-Altstadt_Bern_%28S%C3%BCdostseite%29.jpg",
    alt: "Altstadt Bern (Südostseite)",
    credit: "https://commons.wikimedia.org/wiki/File%3AAltstadt_Bern_%28S%C3%BCdostseite%29.jpg",
  },
  "chreis-cheib": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Perla_Mode_Langstrasse_Zurich.jpg/1280px-Perla_Mode_Langstrasse_Zurich.jpg",
    alt: "Perla Mode Langstrasse Zurich",
    credit: "https://commons.wikimedia.org/wiki/File%3APerla_Mode_Langstrasse_Zurich.jpg",
  },
  "chur-aelteste-stadt": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Chur_in_Graub%C3%BCnden_%28Zwitserland%29_035.jpg/1280px-Chur_in_Graub%C3%BCnden_%28Zwitserland%29_035.jpg",
    alt: "Chur in Graubünden (Zwitserland) 035",
    credit: "https://commons.wikimedia.org/wiki/File%3AChur_in_Graub%C3%BCnden_%28Zwitserland%29_035.jpg",
  },
  "eglisau": {
    source: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Eglisau-Stadt.jpg",
    alt: "Eglisau-Stadt",
    credit: "https://commons.wikimedia.org/wiki/File%3AEglisau-Stadt.jpg",
  },
  "genf-jet-deau": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Jet_d%27eau_Aug_06.JPG/1280px-Jet_d%27eau_Aug_06.JPG",
    alt: "Jet d'eau Aug 06",
    credit: "https://commons.wikimedia.org/wiki/File%3AJet_d%27eau_Aug_06.JPG",
  },
  "hidden-zuerich": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Z%C3%BCrich-West_%2816363855156%29.jpg/1280px-Z%C3%BCrich-West_%2816363855156%29.jpg",
    alt: "Zürich-West (16363855156)",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich-West_%2816363855156%29.jpg",
  },
  "ich-muss-mal-raus": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/From_Uetliberg_to_Felsenegg_%2C_Zurich_-_panoramio_%28148%29.jpg/1280px-From_Uetliberg_to_Felsenegg_%2C_Zurich_-_panoramio_%28148%29.jpg",
    alt: "From Uetliberg to Felsenegg , Zurich - panoramio (148)",
    credit: "https://commons.wikimedia.org/wiki/File%3AFrom_Uetliberg_to_Felsenegg_%2C_Zurich_-_panoramio_%28148%29.jpg",
  },
  "lausanne-hoch-tief": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Cath%C3%A9drale_de_Lausanne_-_int%C3%A9rieur.jpg/1280px-Cath%C3%A9drale_de_Lausanne_-_int%C3%A9rieur.jpg",
    alt: "Cathédrale de Lausanne - intérieur",
    credit: "https://commons.wikimedia.org/wiki/File%3ACath%C3%A9drale_de_Lausanne_-_int%C3%A9rieur.jpg",
  },
  "lugano-dolce-vita": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Lungolago_di_Paradiso%2C_Lugano_2004.jpg/1280px-Lungolago_di_Paradiso%2C_Lugano_2004.jpg",
    alt: "Lungolago di Paradiso, Lugano 2004",
    credit: "https://commons.wikimedia.org/wiki/File%3ALungolago_di_Paradiso%2C_Lugano_2004.jpg",
  },
  "luzern-klassiker": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Luzern_asv2022-10_Kapellbr%C3%BCcke_img1.jpg/1280px-Luzern_asv2022-10_Kapellbr%C3%BCcke_img1.jpg",
    alt: "Luzern asv2022-10 Kapellbrücke img1",
    credit: "https://commons.wikimedia.org/wiki/File%3ALuzern_asv2022-10_Kapellbr%C3%BCcke_img1.jpg",
  },
  "new-people-route": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Josefwiese_Z%C3%BCrich_Dezember_2020.jpg/1280px-Josefwiese_Z%C3%BCrich_Dezember_2020.jpg",
    alt: "Josefwiese Zürich Dezember 2020",
    credit: "https://commons.wikimedia.org/wiki/File%3AJosefwiese_Z%C3%BCrich_Dezember_2020.jpg",
  },
  "rapperswil": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Rapperswil_Schloss_Nacht.jpeg/1280px-Rapperswil_Schloss_Nacht.jpeg",
    alt: "Rapperswil Schloss Nacht",
    credit: "https://commons.wikimedia.org/wiki/File%3ARapperswil_Schloss_Nacht.jpeg",
  },
  "regensberg": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Regensberg_%28Kunreuth%29_cropped.jpg/1280px-Regensberg_%28Kunreuth%29_cropped.jpg",
    alt: "Regensberg (Kunreuth) cropped",
    credit: "https://commons.wikimedia.org/wiki/File%3ARegensberg_%28Kunreuth%29_cropped.jpg",
  },
  "st-gallen-stiftsbezirk": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Stiftsbibliothek_Saal_2023_1.jpg/1280px-Stiftsbibliothek_Saal_2023_1.jpg",
    alt: "Stiftsbibliothek Saal 2023 1",
    credit: "https://commons.wikimedia.org/wiki/File%3AStiftsbibliothek_Saal_2023_1.jpg",
  },
  "thun-schloss-aare": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Rathausplatz%2C_Zunfthaus_zu_Metzgern_und_Schloss_Thun_%282014%29.jpg/1280px-Rathausplatz%2C_Zunfthaus_zu_Metzgern_und_Schloss_Thun_%282014%29.jpg",
    alt: "Rathausplatz, Zunfthaus zu Metzgern und Schloss Thun (2014)",
    credit: "https://commons.wikimedia.org/wiki/File%3ARathausplatz%2C_Zunfthaus_zu_Metzgern_und_Schloss_Thun_%282014%29.jpg",
  },
  "urban-sunset-walk": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Utoquai_-_Sonnenuntergang_2011-08-16_20-43-46.JPG/1280px-Utoquai_-_Sonnenuntergang_2011-08-16_20-43-46.JPG",
    alt: "Utoquai - Sonnenuntergang 2011-08-16 20-43-46",
    credit: "https://commons.wikimedia.org/wiki/File%3AUtoquai_-_Sonnenuntergang_2011-08-16_20-43-46.JPG",
  },
  "winterthur": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Winterthur_Stadthaus.jpg/1280px-Winterthur_Stadthaus.jpg",
    alt: "Winterthur Stadthaus",
    credit: "https://commons.wikimedia.org/wiki/File%3AWinterthur_Stadthaus.jpg",
  },
  "zuerich-60-minuten": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Z%C3%BCrich_Switzerland-Grossm%C3%BCnster-01.jpg/1280px-Z%C3%BCrich_Switzerland-Grossm%C3%BCnster-01.jpg",
    alt: "Zürich Switzerland-Grossmünster-01",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_Switzerland-Grossm%C3%BCnster-01.jpg",
  },
  "zuerich-foodies": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Z%C3%BCrich_-_Frau_Gerolds_Garten_%2848677206963%29.jpg/1280px-Z%C3%BCrich_-_Frau_Gerolds_Garten_%2848677206963%29.jpg",
    alt: "Zürich - Frau Gerolds Garten (48677206963)",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_-_Frau_Gerolds_Garten_%2848677206963%29.jpg",
  },
  "zuerich-klassiker": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Z%C3%BCrich_view_Quaibr%C3%BCcke_20200702.jpg/1280px-Z%C3%BCrich_view_Quaibr%C3%BCcke_20200702.jpg",
    alt: "Zürich view Quaibrücke 20200702",
    credit: "https://commons.wikimedia.org/wiki/File%3AZ%C3%BCrich_view_Quaibr%C3%BCcke_20200702.jpg",
  },
  "solothurn-elf": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Landhausquai_-_panoramio.jpg/1280px-Landhausquai_-_panoramio.jpg",
    alt: "Landhausquai in Solothurn an der Aare (Panorama)",
    credit: "https://commons.wikimedia.org/wiki/File%3ALandhausquai_-_panoramio.jpg",
  },
  "solothurn-verenaschlucht": {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Verenaschlucht_Martinskapelle.JPG/1280px-Verenaschlucht_Martinskapelle.JPG",
    alt: "Martinskapelle in der Verenaschlucht",
    credit: "https://commons.wikimedia.org/wiki/File%3AVerenaschlucht_Martinskapelle.JPG",
  },
};

const sizes = meta as unknown as Record<string, [number, number]>;

function local(key: string, img: StopImageSource | undefined): StopImage | undefined {
  const dims = sizes[key];
  if (!img) return undefined;
  // Übergang: noch nicht geladene Fotos kommen weiter von Wikimedia (scripts/fetch-images.mjs nachlaufen lassen)
  if (!dims) return { url: img.source, small: img.source, width: 1280, height: 853, alt: img.alt, credit: img.credit };
  return { url: `/img/${key}-1200.webp`, small: `/img/${key}-480.webp`, width: dims[0], height: dims[1], alt: img.alt, credit: img.credit };
}

export function getStopImage(stopId: string): StopImage | undefined {
  return local(`s/${stopId}`, stopImages[stopId]);
}

export function getTourHeroImage(tourSlug: string): StopImage | undefined {
  return local(`t/${tourSlug}`, tourHeroImages[tourSlug]);
}
