/**
 * Netherlands Crop Nutrients MCP — Data Ingestion Script
 *
 * Populates the database with Dutch crop nutrient data from:
 * - RVO Handboek Bodem en Bemesting (gebruiksnormen)
 * - Meststoffenwet / Uitvoeringsregeling Meststoffenwet (N- en P-normen)
 * - WUR/BLGG soil classification
 * - Dutch commodity prices (2025/2026 season)
 *
 * Usage: npm run ingest
 */

import { createDatabase } from '../src/db.js';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('data', { recursive: true });
const db = createDatabase('data/database.db');

const now = new Date().toISOString().split('T')[0];

// ---------------------------------------------------------------------------
// 1. Crops — Common Dutch arable + grassland crops
// ---------------------------------------------------------------------------

interface Crop {
  id: string;
  name: string;
  crop_group: string;
  typical_yield_t_ha: number;
  nutrient_offtake_n: number;
  nutrient_offtake_p2o5: number;
  nutrient_offtake_k2o: number;
  growth_stages: string[];
}

const crops: Crop[] = [
  {
    id: 'wintertarwe',
    name: 'Wintertarwe',
    crop_group: 'granen',
    typical_yield_t_ha: 9.0,
    nutrient_offtake_n: 207,
    nutrient_offtake_p2o5: 72,
    nutrient_offtake_k2o: 50,
    growth_stages: ['uitstoeling', 'stengelstrekking', 'aarzwelling', 'bloei', 'korrelvulling'],
  },
  {
    id: 'zomertarwe',
    name: 'Zomertarwe',
    crop_group: 'granen',
    typical_yield_t_ha: 7.0,
    nutrient_offtake_n: 161,
    nutrient_offtake_p2o5: 56,
    nutrient_offtake_k2o: 39,
    growth_stages: ['uitstoeling', 'stengelstrekking', 'aarzwelling', 'korrelvulling'],
  },
  {
    id: 'wintergerst',
    name: 'Wintergerst',
    crop_group: 'granen',
    typical_yield_t_ha: 7.5,
    nutrient_offtake_n: 142,
    nutrient_offtake_p2o5: 60,
    nutrient_offtake_k2o: 48,
    growth_stages: ['uitstoeling', 'stengelstrekking', 'aarzwelling', 'korrelvulling'],
  },
  {
    id: 'zomergerst',
    name: 'Zomergerst',
    crop_group: 'granen',
    typical_yield_t_ha: 6.0,
    nutrient_offtake_n: 108,
    nutrient_offtake_p2o5: 48,
    nutrient_offtake_k2o: 42,
    growth_stages: ['uitstoeling', 'stengelstrekking', 'aarzwelling', 'korrelvulling'],
  },
  {
    id: 'consumptieaardappelen',
    name: 'Consumptieaardappelen',
    crop_group: 'hakvruchten',
    typical_yield_t_ha: 45.0,
    nutrient_offtake_n: 135,
    nutrient_offtake_p2o5: 54,
    nutrient_offtake_k2o: 225,
    growth_stages: ['poten', 'opkomst', 'knolzetting', 'knolgroei', 'afrijping'],
  },
  {
    id: 'pootaardappelen',
    name: 'Pootaardappelen',
    crop_group: 'hakvruchten',
    typical_yield_t_ha: 35.0,
    nutrient_offtake_n: 91,
    nutrient_offtake_p2o5: 42,
    nutrient_offtake_k2o: 175,
    growth_stages: ['poten', 'opkomst', 'knolzetting', 'knolgroei', 'loofdoding'],
  },
  {
    id: 'zetmeelaardappelen',
    name: 'Zetmeelaardappelen',
    crop_group: 'hakvruchten',
    typical_yield_t_ha: 45.0,
    nutrient_offtake_n: 112,
    nutrient_offtake_p2o5: 54,
    nutrient_offtake_k2o: 247,
    growth_stages: ['poten', 'opkomst', 'knolzetting', 'knolgroei', 'afrijping'],
  },
  {
    id: 'suikerbieten',
    name: 'Suikerbieten',
    crop_group: 'hakvruchten',
    typical_yield_t_ha: 75.0,
    nutrient_offtake_n: 120,
    nutrient_offtake_p2o5: 60,
    nutrient_offtake_k2o: 225,
    growth_stages: ['opkomst', 'sluiting', 'suikeropbouw', 'oogst'],
  },
  {
    id: 'zaaiuien',
    name: 'Zaaiuien',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 55.0,
    nutrient_offtake_n: 99,
    nutrient_offtake_p2o5: 44,
    nutrient_offtake_k2o: 88,
    growth_stages: ['opkomst', 'loofgroei', 'bolvorming', 'afrijping', 'oogst'],
  },
  {
    id: 'snijmais',
    name: 'Snijmais',
    crop_group: 'voedergewassen',
    typical_yield_t_ha: 50.0,
    nutrient_offtake_n: 145,
    nutrient_offtake_p2o5: 65,
    nutrient_offtake_k2o: 200,
    growth_stages: ['opkomst', 'stengelstrekking', 'bloei', 'korrelvulling', 'oogst'],
  },
  {
    id: 'grasland-maaien',
    name: 'Grasland (maaien)',
    crop_group: 'grasland',
    typical_yield_t_ha: 12.0,
    nutrient_offtake_n: 336,
    nutrient_offtake_p2o5: 96,
    nutrient_offtake_k2o: 300,
    growth_stages: ['voorjaar', 'eerste snede', 'hergroei', 'volgende sneden', 'najaar'],
  },
  {
    id: 'grasland-beweiden',
    name: 'Grasland (beweiden)',
    crop_group: 'grasland',
    typical_yield_t_ha: 10.0,
    nutrient_offtake_n: 280,
    nutrient_offtake_p2o5: 80,
    nutrient_offtake_k2o: 250,
    growth_stages: ['voorjaar', 'eerste beweiding', 'hergroei', 'nabeweiding'],
  },
  {
    id: 'winterkoolzaad',
    name: 'Winterkoolzaad',
    crop_group: 'oliegewassen',
    typical_yield_t_ha: 4.0,
    nutrient_offtake_n: 140,
    nutrient_offtake_p2o5: 48,
    nutrient_offtake_k2o: 36,
    growth_stages: ['rozet', 'stengelstrekking', 'bloei', 'peulvulling', 'afrijping'],
  },
  {
    id: 'korrelmais',
    name: 'Korrelma\u00EFs',
    crop_group: 'granen',
    typical_yield_t_ha: 10.0,
    nutrient_offtake_n: 140,
    nutrient_offtake_p2o5: 60,
    nutrient_offtake_k2o: 50,
    growth_stages: ['opkomst', 'stengelstrekking', 'bloei', 'korrelvulling', 'afrijping'],
  },
];

for (const c of crops) {
  db.run(
    `INSERT OR REPLACE INTO crops (id, name, crop_group, typical_yield_t_ha, nutrient_offtake_n, nutrient_offtake_p2o5, nutrient_offtake_k2o, growth_stages, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [c.id, c.name, c.crop_group, c.typical_yield_t_ha, c.nutrient_offtake_n, c.nutrient_offtake_p2o5, c.nutrient_offtake_k2o, JSON.stringify(c.growth_stages), 'NL']
  );
}
console.log(`Inserted ${crops.length} crops.`);

// ---------------------------------------------------------------------------
// 2. Soil types — Dutch classification (RVO / BLGG)
// ---------------------------------------------------------------------------

interface SoilType {
  id: string;
  name: string;
  soil_group: number;
  texture: string;
  drainage_class: string;
  description: string;
}

const soilTypes: SoilType[] = [
  {
    id: 'klei',
    name: 'Klei',
    soil_group: 1,
    texture: 'klei',
    drainage_class: 'matig',
    description: 'Kleigronden (rivierklei, zeeklei). Grondsoort 1 in het Handboek Bodem en Bemesting. Hoog vochthoudend vermogen, goede structuur bij juist beheer.',
  },
  {
    id: 'zand',
    name: 'Zand en lichte zavel',
    soil_group: 2,
    texture: 'zand',
    drainage_class: 'goed',
    description: 'Zandgronden en lichte zavelgronden. Grondsoort 2. Uitspoelingsgevoelig, vaak lagere N-normen door nitraatrichtlijn.',
  },
  {
    id: 'dalgrond',
    name: 'Dalgrond',
    soil_group: 3,
    texture: 'veenkoloniaal',
    drainage_class: 'matig',
    description: 'Dalgronden (veenkoloniaal). Grondsoort 3. Typisch voor Drenthe en Groningen. Geschikt voor zetmeelaardappelen.',
  },
  {
    id: 'veen',
    name: 'Veen',
    soil_group: 4,
    texture: 'veen',
    drainage_class: 'slecht',
    description: 'Veengronden. Grondsoort 4. Hoog organische stof gehalte, N-mineralisatie hoog, vaak lagere N-bemestingsadvies.',
  },
  {
    id: 'loess',
    name: 'L\u00F6ss',
    soil_group: 5,
    texture: 'silt',
    drainage_class: 'matig',
    description: 'L\u00F6ssgronden (Zuid-Limburg). Grondsoort 5. Hoog vochthoudend vermogen, erosiegevoelig, vruchtbaar.',
  },
];

for (const s of soilTypes) {
  db.run(
    `INSERT OR REPLACE INTO soil_types (id, name, soil_group, texture, drainage_class, description)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [s.id, s.name, s.soil_group, s.texture, s.drainage_class, s.description]
  );
}
console.log(`Inserted ${soilTypes.length} soil types.`);

// ---------------------------------------------------------------------------
// 3. Nutrient recommendations — RVO gebruiksnormen + Handboek Bodem en Bemesting
// ---------------------------------------------------------------------------

interface NutrientRec {
  crop_id: string;
  soil_group: number;
  sns_index: number | null;
  previous_crop_group: string | null;
  n_rec_kg_ha: number;
  p_rec_kg_ha: number;
  k_rec_kg_ha: number;
  s_rec_kg_ha: number;
  notes: string;
  rb209_section: string;
}

// Helper: Dutch phosphate depends on fosfaattoestand (P-status).
// We use 'neutraal' as the default (class P-AL adequate).
// Helper: K2O norms from Handboek Bodem en Bemesting.
const recs: NutrientRec[] = [
  // Wintertarwe
  { crop_id: 'wintertarwe', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 245, p_rec_kg_ha: 60, k_rec_kg_ha: 50, s_rec_kg_ha: 20,
    notes: 'Kleigrond. N-gebruiksnorm Meststoffenwet tabel 1. P2O5 bij fosfaattoestand neutraal. K2O advies Handboek.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'wintertarwe', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 190, p_rec_kg_ha: 60, k_rec_kg_ha: 40, s_rec_kg_ha: 25,
    notes: 'Zandgrond. Lagere N-norm door uitspoelingsgevoeligheid. S-behoefte hoger op zand.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'wintertarwe', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 220, p_rec_kg_ha: 55, k_rec_kg_ha: 45, s_rec_kg_ha: 20,
    notes: 'Lossgrond. N-norm tussen klei en zand.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Zomertarwe
  { crop_id: 'zomertarwe', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 170, p_rec_kg_ha: 55, k_rec_kg_ha: 45, s_rec_kg_ha: 15,
    notes: 'Kleigrond. Lagere N-behoefte dan wintertarwe door korter groeiseizoen.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'zomertarwe', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 150, p_rec_kg_ha: 55, k_rec_kg_ha: 35, s_rec_kg_ha: 20,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Wintergerst
  { crop_id: 'wintergerst', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 150, p_rec_kg_ha: 55, k_rec_kg_ha: 50, s_rec_kg_ha: 15,
    notes: 'Kleigrond. N-norm voor wintergerst.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'wintergerst', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 120, p_rec_kg_ha: 55, k_rec_kg_ha: 40, s_rec_kg_ha: 20,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Zomergerst
  { crop_id: 'zomergerst', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 80, p_rec_kg_ha: 50, k_rec_kg_ha: 45, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Laag N-advies voor brouwgerst (eiwitgehalte laag houden).',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'zomergerst', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 60, p_rec_kg_ha: 50, k_rec_kg_ha: 35, s_rec_kg_ha: 15,
    notes: 'Zandgrond. Brouwgerst: N laag houden.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Consumptieaardappelen
  { crop_id: 'consumptieaardappelen', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 250, p_rec_kg_ha: 60, k_rec_kg_ha: 180, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Hoge K-behoefte. P2O5 bij fosfaattoestand neutraal.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'consumptieaardappelen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 200, p_rec_kg_ha: 60, k_rec_kg_ha: 220, s_rec_kg_ha: 10,
    notes: 'Zandgrond. Hogere K-norm door uitspoeling.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Pootaardappelen
  { crop_id: 'pootaardappelen', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 120, p_rec_kg_ha: 55, k_rec_kg_ha: 150, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Beperkte N voor fysiologische kwaliteit pootgoed.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'pootaardappelen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 55, k_rec_kg_ha: 180, s_rec_kg_ha: 10,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Zetmeelaardappelen
  { crop_id: 'zetmeelaardappelen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 240, p_rec_kg_ha: 60, k_rec_kg_ha: 200, s_rec_kg_ha: 10,
    notes: 'Zand/dalgrond. Typisch Veenkolonien teelt.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'zetmeelaardappelen', soil_group: 3, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 240, p_rec_kg_ha: 60, k_rec_kg_ha: 200, s_rec_kg_ha: 10,
    notes: 'Dalgrond. Voornaamste teeltgebied zetmeelaardappelen.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Suikerbieten
  { crop_id: 'suikerbieten', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 150, p_rec_kg_ha: 55, k_rec_kg_ha: 200, s_rec_kg_ha: 15,
    notes: 'Kleigrond. Te veel N verlaagt suikergehalte en winbaarheid.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'suikerbieten', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 145, p_rec_kg_ha: 55, k_rec_kg_ha: 240, s_rec_kg_ha: 20,
    notes: 'Zandgrond. Hogere K op zand, S-behoefte hoger.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Zaaiuien
  { crop_id: 'zaaiuien', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 120, p_rec_kg_ha: 50, k_rec_kg_ha: 60, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Uien gevoelig voor te veel N (bewaarziekte).',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'zaaiuien', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 50, k_rec_kg_ha: 70, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Snijmais
  { crop_id: 'snijmais', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 185, p_rec_kg_ha: 60, k_rec_kg_ha: 200, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Hogere N-norm op klei dan op zand.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'snijmais', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 150, p_rec_kg_ha: 55, k_rec_kg_ha: 220, s_rec_kg_ha: 10,
    notes: 'Zandgrond. N-gebruiksnorm 150 kg/ha. Rijenbemesting verplicht op zand/loss.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'snijmais', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 150, p_rec_kg_ha: 55, k_rec_kg_ha: 180, s_rec_kg_ha: 10,
    notes: 'Lossgrond. Rijenbemesting verplicht.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Grasland (maaien)
  { crop_id: 'grasland-maaien', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 345, p_rec_kg_ha: 60, k_rec_kg_ha: 240, s_rec_kg_ha: 20,
    notes: 'Kleigrond, alleen maaien. Hoogste N-norm in NL. P2O5 bij fosfaattoestand neutraal.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },
  { crop_id: 'grasland-maaien', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 250, p_rec_kg_ha: 60, k_rec_kg_ha: 280, s_rec_kg_ha: 25,
    notes: 'Zandgrond, alleen maaien. Lagere N-norm door derogatie-eisen.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },
  { crop_id: 'grasland-maaien', soil_group: 4, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 265, p_rec_kg_ha: 55, k_rec_kg_ha: 240, s_rec_kg_ha: 15,
    notes: 'Veengrond, alleen maaien. Hoge N-mineralisatie compenseert gedeeltelijk.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },

  // Grasland (beweiden)
  { crop_id: 'grasland-beweiden', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 250, p_rec_kg_ha: 55, k_rec_kg_ha: 180, s_rec_kg_ha: 15,
    notes: 'Kleigrond met beweiding. Lagere K dan maaien (retour via mest op perceel).',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },
  { crop_id: 'grasland-beweiden', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 200, p_rec_kg_ha: 55, k_rec_kg_ha: 200, s_rec_kg_ha: 20,
    notes: 'Zandgrond met beweiding.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },
  { crop_id: 'grasland-beweiden', soil_group: 4, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 190, p_rec_kg_ha: 50, k_rec_kg_ha: 180, s_rec_kg_ha: 10,
    notes: 'Veengrond met beweiding. N-mineralisatie hoog, lagere N-gift nodig.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },

  // Winterkoolzaad
  { crop_id: 'winterkoolzaad', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 205, p_rec_kg_ha: 50, k_rec_kg_ha: 40, s_rec_kg_ha: 30,
    notes: 'Kleigrond. Hoge S-behoefte (kruisbloemigen).',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'winterkoolzaad', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 175, p_rec_kg_ha: 50, k_rec_kg_ha: 35, s_rec_kg_ha: 35,
    notes: 'Zandgrond. S-gift extra belangrijk op uitspoelingsgevoelige grond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Korrelmais
  { crop_id: 'korrelmais', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 160, p_rec_kg_ha: 55, k_rec_kg_ha: 50, s_rec_kg_ha: 10,
    notes: 'Kleigrond. K-afvoer lager dan snijmais (stro blijft op veld).',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'korrelmais', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 140, p_rec_kg_ha: 55, k_rec_kg_ha: 50, s_rec_kg_ha: 10,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
];

for (const r of recs) {
  db.run(
    `INSERT INTO nutrient_recommendations (crop_id, soil_group, sns_index, previous_crop_group, n_rec_kg_ha, p_rec_kg_ha, k_rec_kg_ha, s_rec_kg_ha, notes, rb209_section, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [r.crop_id, r.soil_group, r.sns_index, r.previous_crop_group, r.n_rec_kg_ha, r.p_rec_kg_ha, r.k_rec_kg_ha, r.s_rec_kg_ha, r.notes, r.rb209_section, 'NL']
  );
}
console.log(`Inserted ${recs.length} nutrient recommendations.`);

// ---------------------------------------------------------------------------
// 4. Commodity prices — 2025/2026 Dutch market (EUR)
// ---------------------------------------------------------------------------

interface Price {
  crop_id: string;
  market: string;
  price_per_tonne: number;
  currency: string;
  price_source: string;
  published_date: string;
  retrieved_at: string;
  source: string;
}

const prices: Price[] = [
  { crop_id: 'wintertarwe', market: 'af-boerderij', price_per_tonne: 210.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Wageningen Economic Research' },
  { crop_id: 'zomergerst', market: 'af-boerderij (brouwgerst)', price_per_tonne: 250.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Wageningen Economic Research' },
  { crop_id: 'consumptieaardappelen', market: 'af-boerderij', price_per_tonne: 120.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / PotatoNL' },
  { crop_id: 'pootaardappelen', market: 'af-boerderij', price_per_tonne: 350.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / NAO' },
  { crop_id: 'suikerbieten', market: 'Cosun', price_per_tonne: 45.0, currency: 'EUR',
    price_source: 'cosun_suiker', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'Cosun / Royal Cosun bietenprijs' },
  { crop_id: 'zaaiuien', market: 'af-boerderij', price_per_tonne: 150.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Uienmarkt' },
  { crop_id: 'snijmais', market: 'af-boerderij (per ton vers)', price_per_tonne: 45.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Boerenbusiness' },
  { crop_id: 'winterkoolzaad', market: 'af-boerderij', price_per_tonne: 440.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Matif' },
];

for (const p of prices) {
  db.run(
    `INSERT OR REPLACE INTO commodity_prices (crop_id, market, price_per_tonne, currency, price_source, published_date, retrieved_at, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [p.crop_id, p.market, p.price_per_tonne, p.currency, p.price_source, p.published_date, p.retrieved_at, p.source, 'NL']
  );
}
console.log(`Inserted ${prices.length} commodity prices.`);

// ---------------------------------------------------------------------------
// 5. FTS5 search index
// ---------------------------------------------------------------------------

// Clear existing FTS data
db.run('DELETE FROM search_index', []);

// Index each crop with its nutrient info
for (const c of crops) {
  const cropRecs = recs.filter(r => r.crop_id === c.id);
  const soilNotes = cropRecs.map(r => {
    const soil = soilTypes.find(s => s.soil_group === r.soil_group);
    return `${soil?.name ?? `grondsoort ${r.soil_group}`}: N ${r.n_rec_kg_ha} kg/ha, P2O5 ${r.p_rec_kg_ha} kg/ha, K2O ${r.k_rec_kg_ha} kg/ha. ${r.notes}`;
  }).join(' ');

  const body = `${c.name} nutrient recommendations (gebruiksnormen). ` +
    `Opbrengst ${c.typical_yield_t_ha} t/ha. ` +
    `Afvoer: N ${c.nutrient_offtake_n}, P2O5 ${c.nutrient_offtake_p2o5}, K2O ${c.nutrient_offtake_k2o} kg/ha. ` +
    soilNotes;

  db.run(
    'INSERT INTO search_index (title, body, crop_group, jurisdiction) VALUES (?, ?, ?, ?)',
    [`${c.name} bemestingsadvies`, body, c.crop_group, 'NL']
  );
}

// Index soil types
for (const s of soilTypes) {
  db.run(
    'INSERT INTO search_index (title, body, crop_group, jurisdiction) VALUES (?, ?, ?, ?)',
    [`Grondsoort: ${s.name}`, s.description, 'bodemclassificatie', 'NL']
  );
}

// Index phosphate status rules
db.run(
  'INSERT INTO search_index (title, body, crop_group, jurisdiction) VALUES (?, ?, ?, ?)',
  [
    'Fosfaatgebruiksnormen (P2O5)',
    'Fosfaat normen zijn afhankelijk van de fosfaattoestand van de bodem. ' +
    'Laag: 80 kg P2O5/ha, Neutraal: 60 kg P2O5/ha, Hoog: 40 kg P2O5/ha. ' +
    'Bij fosfaattoestand zeer hoog is op grasland geen fosfaatbemesting toegestaan. ' +
    'Bouwland bij zeer hoog: maximaal 10 kg P2O5/ha. ' +
    'De fosfaattoestand wordt bepaald met P-AL (grasland) of Pw (bouwland), ' +
    'vanaf 2026 overgangsfase naar P-CaCl2 en P-AL combinatie.',
    'regelgeving',
    'NL',
  ]
);

// Index derogation info
db.run(
  'INSERT INTO search_index (title, body, crop_group, jurisdiction) VALUES (?, ?, ?, ?)',
  [
    'Derogatie en gebruiksnormen',
    'Nederland had tot 2023 derogatie van de Nitraatrichtlijn, waardoor meer dierlijke mest mocht worden toegepast ' +
    '(230-250 kg N/ha i.p.v. 170 kg N/ha uit dierlijke mest). Derogatie is per 2026 afgebouwd. ' +
    'De totale stikstofgebruiksnorm omvat zowel dierlijke mest als kunstmest. ' +
    'Op uitspoelingsgevoelige gronden (zand, loss) gelden strengere normen. ' +
    'Mestplaatsingsruimte verschilt per gewas en grondsoort.',
    'regelgeving',
    'NL',
  ]
);

console.log('FTS5 search index rebuilt.');

// ---------------------------------------------------------------------------
// 6. db_metadata
// ---------------------------------------------------------------------------

db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('last_ingest', ?)", [now]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('build_date', ?)", [now]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('data_version', '2026.1')", []);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('crops_count', ?)", [String(crops.length)]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('soil_types_count', ?)", [String(soilTypes.length)]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('recommendations_count', ?)", [String(recs.length)]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('prices_count', ?)", [String(prices.length)]);

// ---------------------------------------------------------------------------
// 7. Coverage manifest
// ---------------------------------------------------------------------------

writeFileSync('data/coverage.json', JSON.stringify({
  mcp_name: 'Netherlands Crop Nutrients MCP',
  jurisdiction: 'NL',
  build_date: now,
  status: 'production',
  crops: crops.length,
  soil_types: soilTypes.length,
  nutrient_recommendations: recs.length,
  commodity_prices: prices.length,
  fts_entries: crops.length + soilTypes.length + 2,
  data_sources: [
    'RVO Handboek Bodem en Bemesting',
    'Meststoffenwet / Uitvoeringsregeling Meststoffenwet',
    'WUR Agrimatie',
    'BLGG AgroXpertus',
  ],
}, null, 2));

db.close();

console.log('');
console.log('Netherlands Crop Nutrients MCP — ingestion complete.');
console.log(`  Crops:             ${crops.length}`);
console.log(`  Soil types:        ${soilTypes.length}`);
console.log(`  Recommendations:   ${recs.length}`);
console.log(`  Commodity prices:  ${prices.length}`);
console.log(`  FTS entries:       ${crops.length + soilTypes.length + 2}`);
console.log(`  Build date:        ${now}`);
