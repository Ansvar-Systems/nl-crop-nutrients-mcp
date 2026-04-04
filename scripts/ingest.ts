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
// 1. Crops — Dutch arable, grassland, horticultural, bulb, fruit, tree crops
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
  // --- Granen ---
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
    id: 'korrelmais',
    name: 'Korrelma\u00EFs',
    crop_group: 'granen',
    typical_yield_t_ha: 10.0,
    nutrient_offtake_n: 140,
    nutrient_offtake_p2o5: 60,
    nutrient_offtake_k2o: 50,
    growth_stages: ['opkomst', 'stengelstrekking', 'bloei', 'korrelvulling', 'afrijping'],
  },
  {
    id: 'haver',
    name: 'Haver',
    crop_group: 'granen',
    typical_yield_t_ha: 5.5,
    nutrient_offtake_n: 99,
    nutrient_offtake_p2o5: 44,
    nutrient_offtake_k2o: 33,
    growth_stages: ['uitstoeling', 'stengelstrekking', 'pluimvorming', 'korrelvulling'],
  },
  {
    id: 'triticale',
    name: 'Triticale',
    crop_group: 'granen',
    typical_yield_t_ha: 7.0,
    nutrient_offtake_n: 147,
    nutrient_offtake_p2o5: 56,
    nutrient_offtake_k2o: 42,
    growth_stages: ['uitstoeling', 'stengelstrekking', 'aarzwelling', 'bloei', 'korrelvulling'],
  },
  {
    id: 'rogge',
    name: 'Rogge',
    crop_group: 'granen',
    typical_yield_t_ha: 5.5,
    nutrient_offtake_n: 88,
    nutrient_offtake_p2o5: 44,
    nutrient_offtake_k2o: 33,
    growth_stages: ['uitstoeling', 'stengelstrekking', 'bloei', 'korrelvulling'],
  },
  {
    id: 'spelt',
    name: 'Spelt',
    crop_group: 'granen',
    typical_yield_t_ha: 4.5,
    nutrient_offtake_n: 90,
    nutrient_offtake_p2o5: 36,
    nutrient_offtake_k2o: 27,
    growth_stages: ['uitstoeling', 'stengelstrekking', 'aarzwelling', 'korrelvulling'],
  },

  // --- Hakvruchten ---
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

  // --- Peulvruchten ---
  {
    id: 'veldbonen',
    name: 'Veldbonen',
    crop_group: 'peulvruchten',
    typical_yield_t_ha: 4.5,
    nutrient_offtake_n: 180,
    nutrient_offtake_p2o5: 45,
    nutrient_offtake_k2o: 54,
    growth_stages: ['opkomst', 'vertakking', 'bloei', 'peulvulling', 'afrijping'],
  },
  {
    id: 'erwten-droog',
    name: 'Erwten (droog)',
    crop_group: 'peulvruchten',
    typical_yield_t_ha: 4.0,
    nutrient_offtake_n: 152,
    nutrient_offtake_p2o5: 40,
    nutrient_offtake_k2o: 44,
    growth_stages: ['opkomst', 'vertakking', 'bloei', 'peulvulling', 'afrijping'],
  },
  {
    id: 'kapucijners',
    name: 'Kapucijners',
    crop_group: 'peulvruchten',
    typical_yield_t_ha: 3.0,
    nutrient_offtake_n: 120,
    nutrient_offtake_p2o5: 30,
    nutrient_offtake_k2o: 36,
    growth_stages: ['opkomst', 'vertakking', 'bloei', 'peulvulling', 'afrijping'],
  },
  {
    id: 'bruine-bonen',
    name: 'Bruine bonen',
    crop_group: 'peulvruchten',
    typical_yield_t_ha: 3.5,
    nutrient_offtake_n: 140,
    nutrient_offtake_p2o5: 35,
    nutrient_offtake_k2o: 42,
    growth_stages: ['opkomst', 'vertakking', 'bloei', 'peulvulling', 'afrijping'],
  },

  // --- Handelsgewassen ---
  {
    id: 'winterkoolzaad',
    name: 'Winterkoolzaad',
    crop_group: 'handelsgewassen',
    typical_yield_t_ha: 4.0,
    nutrient_offtake_n: 140,
    nutrient_offtake_p2o5: 48,
    nutrient_offtake_k2o: 36,
    growth_stages: ['rozet', 'stengelstrekking', 'bloei', 'peulvulling', 'afrijping'],
  },
  {
    id: 'vlas',
    name: 'Vlas',
    crop_group: 'handelsgewassen',
    typical_yield_t_ha: 6.5,
    nutrient_offtake_n: 65,
    nutrient_offtake_p2o5: 26,
    nutrient_offtake_k2o: 52,
    growth_stages: ['opkomst', 'snelle groei', 'bloei', 'zaadrijping', 'rootoogst'],
  },
  {
    id: 'hennep',
    name: 'Hennep',
    crop_group: 'handelsgewassen',
    typical_yield_t_ha: 8.0,
    nutrient_offtake_n: 120,
    nutrient_offtake_p2o5: 32,
    nutrient_offtake_k2o: 96,
    growth_stages: ['opkomst', 'vegetatieve groei', 'bloei', 'zaadrijping'],
  },
  {
    id: 'cichorei',
    name: 'Cichorei',
    crop_group: 'handelsgewassen',
    typical_yield_t_ha: 45.0,
    nutrient_offtake_n: 90,
    nutrient_offtake_p2o5: 45,
    nutrient_offtake_k2o: 180,
    growth_stages: ['opkomst', 'bladgroei', 'wortelgroei', 'oogst'],
  },
  {
    id: 'karwij',
    name: 'Karwij',
    crop_group: 'handelsgewassen',
    typical_yield_t_ha: 2.0,
    nutrient_offtake_n: 60,
    nutrient_offtake_p2o5: 16,
    nutrient_offtake_k2o: 20,
    growth_stages: ['rozet', 'stengelstrekking', 'bloei', 'zaadrijping'],
  },

  // --- Vollegrondsgroenten ---
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
    id: 'spruitkool',
    name: 'Spruitkool',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 20.0,
    nutrient_offtake_n: 200,
    nutrient_offtake_p2o5: 60,
    nutrient_offtake_k2o: 140,
    growth_stages: ['planten', 'vegetatieve groei', 'spruitvorming', 'oogst'],
  },
  {
    id: 'bloemkool',
    name: 'Bloemkool',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 25.0,
    nutrient_offtake_n: 175,
    nutrient_offtake_p2o5: 50,
    nutrient_offtake_k2o: 175,
    growth_stages: ['planten', 'vegetatieve groei', 'koolvorming', 'oogst'],
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 12.0,
    nutrient_offtake_n: 132,
    nutrient_offtake_p2o5: 36,
    nutrient_offtake_k2o: 96,
    growth_stages: ['planten', 'vegetatieve groei', 'hoofdvorming', 'oogst'],
  },
  {
    id: 'witte-kool',
    name: 'Witte kool',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 60.0,
    nutrient_offtake_n: 240,
    nutrient_offtake_p2o5: 60,
    nutrient_offtake_k2o: 180,
    growth_stages: ['planten', 'vegetatieve groei', 'koolvorming', 'oogst'],
  },
  {
    id: 'rode-kool',
    name: 'Rode kool',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 45.0,
    nutrient_offtake_n: 180,
    nutrient_offtake_p2o5: 50,
    nutrient_offtake_k2o: 135,
    growth_stages: ['planten', 'vegetatieve groei', 'koolvorming', 'oogst'],
  },
  {
    id: 'prei',
    name: 'Prei',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 35.0,
    nutrient_offtake_n: 140,
    nutrient_offtake_p2o5: 42,
    nutrient_offtake_k2o: 140,
    growth_stages: ['planten', 'bladgroei', 'schachtvorming', 'oogst'],
  },
  {
    id: 'wortelen',
    name: 'Wortelen',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 60.0,
    nutrient_offtake_n: 108,
    nutrient_offtake_p2o5: 48,
    nutrient_offtake_k2o: 240,
    growth_stages: ['opkomst', 'bladgroei', 'wortelgroei', 'oogst'],
  },
  {
    id: 'schorseneren',
    name: 'Schorseneren',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 20.0,
    nutrient_offtake_n: 60,
    nutrient_offtake_p2o5: 20,
    nutrient_offtake_k2o: 80,
    growth_stages: ['opkomst', 'bladgroei', 'wortelgroei', 'oogst'],
  },
  {
    id: 'witlofwortelen',
    name: 'Witlofwortelen',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 40.0,
    nutrient_offtake_n: 120,
    nutrient_offtake_p2o5: 40,
    nutrient_offtake_k2o: 160,
    growth_stages: ['opkomst', 'bladgroei', 'wortelgroei', 'rooien'],
  },
  {
    id: 'sla',
    name: 'Sla',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 30.0,
    nutrient_offtake_n: 60,
    nutrient_offtake_p2o5: 18,
    nutrient_offtake_k2o: 90,
    growth_stages: ['planten', 'bladgroei', 'kropvorming', 'oogst'],
  },
  {
    id: 'spinazie',
    name: 'Spinazie',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 25.0,
    nutrient_offtake_n: 100,
    nutrient_offtake_p2o5: 25,
    nutrient_offtake_k2o: 125,
    growth_stages: ['opkomst', 'bladgroei', 'oogst'],
  },
  {
    id: 'stamslabonen',
    name: 'Stamslabonen',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 12.0,
    nutrient_offtake_n: 72,
    nutrient_offtake_p2o5: 24,
    nutrient_offtake_k2o: 48,
    growth_stages: ['opkomst', 'vegetatieve groei', 'bloei', 'peulvulling', 'oogst'],
  },
  {
    id: 'was-pronkbonen',
    name: 'Was- en pronkbonen',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 15.0,
    nutrient_offtake_n: 90,
    nutrient_offtake_p2o5: 30,
    nutrient_offtake_k2o: 60,
    growth_stages: ['opkomst', 'vegetatieve groei', 'bloei', 'peulvulling', 'oogst'],
  },
  {
    id: 'knolselderij',
    name: 'Knolselderij',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 45.0,
    nutrient_offtake_n: 135,
    nutrient_offtake_p2o5: 54,
    nutrient_offtake_k2o: 225,
    growth_stages: ['planten', 'bladgroei', 'knolvorming', 'oogst'],
  },
  {
    id: 'asperges',
    name: 'Asperges',
    crop_group: 'vollegrondsgroenten',
    typical_yield_t_ha: 6.0,
    nutrient_offtake_n: 60,
    nutrient_offtake_p2o5: 18,
    nutrient_offtake_k2o: 42,
    growth_stages: ['uitloop', 'steekperiode', 'loofgroei', 'afsterving'],
  },

  // --- Bolgewassen ---
  {
    id: 'tulpen',
    name: 'Tulpen',
    crop_group: 'bolgewassen',
    typical_yield_t_ha: 30.0,
    nutrient_offtake_n: 120,
    nutrient_offtake_p2o5: 36,
    nutrient_offtake_k2o: 120,
    growth_stages: ['opkomst', 'bladgroei', 'bloei', 'bolgroei', 'rooien'],
  },
  {
    id: 'lelies',
    name: 'Lelies',
    crop_group: 'bolgewassen',
    typical_yield_t_ha: 25.0,
    nutrient_offtake_n: 100,
    nutrient_offtake_p2o5: 25,
    nutrient_offtake_k2o: 100,
    growth_stages: ['opkomst', 'stengelgroei', 'bloei', 'bolgroei', 'rooien'],
  },
  {
    id: 'gladiolen',
    name: 'Gladiolen',
    crop_group: 'bolgewassen',
    typical_yield_t_ha: 20.0,
    nutrient_offtake_n: 80,
    nutrient_offtake_p2o5: 20,
    nutrient_offtake_k2o: 80,
    growth_stages: ['opkomst', 'bladgroei', 'bloei', 'knolgroei', 'rooien'],
  },
  {
    id: 'hyacinten',
    name: 'Hyacinten',
    crop_group: 'bolgewassen',
    typical_yield_t_ha: 25.0,
    nutrient_offtake_n: 100,
    nutrient_offtake_p2o5: 30,
    nutrient_offtake_k2o: 100,
    growth_stages: ['opkomst', 'bladgroei', 'bloei', 'bolgroei', 'rooien'],
  },
  {
    id: 'narcissen',
    name: 'Narcissen',
    crop_group: 'bolgewassen',
    typical_yield_t_ha: 28.0,
    nutrient_offtake_n: 84,
    nutrient_offtake_p2o5: 28,
    nutrient_offtake_k2o: 84,
    growth_stages: ['opkomst', 'bladgroei', 'bloei', 'bolgroei', 'rooien'],
  },
  {
    id: 'dahlias',
    name: "Dahlia's",
    crop_group: 'bolgewassen',
    typical_yield_t_ha: 18.0,
    nutrient_offtake_n: 72,
    nutrient_offtake_p2o5: 18,
    nutrient_offtake_k2o: 72,
    growth_stages: ['opkomst', 'vegetatieve groei', 'bloei', 'knolgroei', 'rooien'],
  },
  {
    id: 'irissen',
    name: 'Irissen',
    crop_group: 'bolgewassen',
    typical_yield_t_ha: 22.0,
    nutrient_offtake_n: 66,
    nutrient_offtake_p2o5: 22,
    nutrient_offtake_k2o: 66,
    growth_stages: ['opkomst', 'bladgroei', 'bloei', 'bolgroei', 'rooien'],
  },

  // --- Fruitteelt ---
  {
    id: 'appels',
    name: 'Appels',
    crop_group: 'fruitteelt',
    typical_yield_t_ha: 40.0,
    nutrient_offtake_n: 40,
    nutrient_offtake_p2o5: 12,
    nutrient_offtake_k2o: 56,
    growth_stages: ['knopzwelling', 'bloei', 'vruchtzetting', 'celstrekking', 'oogst'],
  },
  {
    id: 'peren',
    name: 'Peren',
    crop_group: 'fruitteelt',
    typical_yield_t_ha: 35.0,
    nutrient_offtake_n: 28,
    nutrient_offtake_p2o5: 11,
    nutrient_offtake_k2o: 49,
    growth_stages: ['knopzwelling', 'bloei', 'vruchtzetting', 'celstrekking', 'oogst'],
  },
  {
    id: 'aardbeien',
    name: 'Aardbeien',
    crop_group: 'fruitteelt',
    typical_yield_t_ha: 25.0,
    nutrient_offtake_n: 75,
    nutrient_offtake_p2o5: 25,
    nutrient_offtake_k2o: 100,
    growth_stages: ['uitloop', 'bloei', 'vruchtzetting', 'oogstperiode'],
  },
  {
    id: 'blauwe-bessen',
    name: 'Blauwe bessen',
    crop_group: 'fruitteelt',
    typical_yield_t_ha: 8.0,
    nutrient_offtake_n: 40,
    nutrient_offtake_p2o5: 8,
    nutrient_offtake_k2o: 24,
    growth_stages: ['knopzwelling', 'bloei', 'vruchtzetting', 'rijping', 'oogst'],
  },
  {
    id: 'frambozen',
    name: 'Frambozen',
    crop_group: 'fruitteelt',
    typical_yield_t_ha: 10.0,
    nutrient_offtake_n: 50,
    nutrient_offtake_p2o5: 15,
    nutrient_offtake_k2o: 40,
    growth_stages: ['uitloop', 'bloei', 'vruchtzetting', 'rijping', 'oogst'],
  },
  {
    id: 'kersen',
    name: 'Kersen',
    crop_group: 'fruitteelt',
    typical_yield_t_ha: 12.0,
    nutrient_offtake_n: 36,
    nutrient_offtake_p2o5: 12,
    nutrient_offtake_k2o: 48,
    growth_stages: ['knopzwelling', 'bloei', 'vruchtzetting', 'rijping', 'oogst'],
  },

  // --- Boomkwekerij ---
  {
    id: 'laanbomen',
    name: 'Laanbomen',
    crop_group: 'boomkwekerij',
    typical_yield_t_ha: 0.0,
    nutrient_offtake_n: 80,
    nutrient_offtake_p2o5: 20,
    nutrient_offtake_k2o: 60,
    growth_stages: ['uitloop', 'scheutgroei', 'houtrijping', 'bladval'],
  },
  {
    id: 'vruchtbomen',
    name: 'Vruchtbomen',
    crop_group: 'boomkwekerij',
    typical_yield_t_ha: 0.0,
    nutrient_offtake_n: 70,
    nutrient_offtake_p2o5: 18,
    nutrient_offtake_k2o: 50,
    growth_stages: ['uitloop', 'scheutgroei', 'enten', 'houtrijping'],
  },
  {
    id: 'sierheesters',
    name: 'Sierheesters',
    crop_group: 'boomkwekerij',
    typical_yield_t_ha: 0.0,
    nutrient_offtake_n: 60,
    nutrient_offtake_p2o5: 15,
    nutrient_offtake_k2o: 45,
    growth_stages: ['uitloop', 'scheutgroei', 'bloei', 'houtrijping'],
  },

  // --- Voedergewassen ---
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
    id: 'luzerne',
    name: 'Luzerne',
    crop_group: 'voedergewassen',
    typical_yield_t_ha: 12.0,
    nutrient_offtake_n: 360,
    nutrient_offtake_p2o5: 72,
    nutrient_offtake_k2o: 300,
    growth_stages: ['opkomst', 'vegetatieve groei', 'bloei', 'snede', 'hergroei'],
  },
  {
    id: 'gras-klaver',
    name: 'Gras-klaver',
    crop_group: 'voedergewassen',
    typical_yield_t_ha: 11.0,
    nutrient_offtake_n: 308,
    nutrient_offtake_p2o5: 88,
    nutrient_offtake_k2o: 275,
    growth_stages: ['voorjaar', 'eerste snede', 'hergroei', 'volgende sneden', 'najaar'],
  },

  // --- Grasland ---
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

  // --- Energiegewassen / overig ---
  {
    id: 'japanse-duizendknoop',
    name: 'Japanse duizendknoop (energiegewas)',
    crop_group: 'energiegewassen',
    typical_yield_t_ha: 15.0,
    nutrient_offtake_n: 60,
    nutrient_offtake_p2o5: 15,
    nutrient_offtake_k2o: 75,
    growth_stages: ['uitloop', 'snelle groei', 'bloei', 'afsterving'],
  },
  {
    id: 'miscanthus',
    name: 'Miscanthus',
    crop_group: 'energiegewassen',
    typical_yield_t_ha: 15.0,
    nutrient_offtake_n: 45,
    nutrient_offtake_p2o5: 9,
    nutrient_offtake_k2o: 90,
    growth_stages: ['uitloop', 'stengelstrekking', 'bloei', 'afrijping', 'oogst'],
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
// 2. Soil types — Dutch classification (RVO / BLGG) with expanded detail
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
    description: 'Kleigronden (rivierklei, zeeklei). Grondsoort 1 in het Handboek Bodem en Bemesting. Hoog vochthoudend vermogen, goede structuur bij juist beheer. Organische stof 3-8%. CEC 15-30 meq/100g. Typische gewassen: wintertarwe, suikerbieten, consumptieaardappelen, zaaiuien, spruitkool. Drainage matig tot slecht, afhankelijk van zwaarte en profiel. Kalibehoefte lager dan op zand door hoge K-fixatie.',
  },
  {
    id: 'zand',
    name: 'Zand en lichte zavel',
    soil_group: 2,
    texture: 'zand',
    drainage_class: 'goed',
    description: 'Zandgronden en lichte zavelgronden. Grondsoort 2. Uitspoelingsgevoelig, vaak lagere N-normen door nitraatrichtlijn. Organische stof 2-5%. CEC 5-15 meq/100g. Typische gewassen: consumptieaardappelen, snijmais, prei, wortelen, boomkwekerij. Goede drainage, snelle opwarming in het voorjaar. Hogere K- en S-behoefte door uitspoeling.',
  },
  {
    id: 'dalgrond',
    name: 'Dalgrond',
    soil_group: 3,
    texture: 'veenkoloniaal',
    drainage_class: 'matig',
    description: 'Dalgronden (veenkoloniaal). Grondsoort 3. Typisch voor Drenthe en Groningen. Geschikt voor zetmeelaardappelen. Organische stof 5-15%. CEC 10-25 meq/100g. Typische gewassen: zetmeelaardappelen, suikerbieten, granen. Drainage matig, grondwaterstand relatief hoog. N-mineralisatie hoger dan minerale gronden.',
  },
  {
    id: 'veen',
    name: 'Veen',
    soil_group: 4,
    texture: 'veen',
    drainage_class: 'slecht',
    description: 'Veengronden. Grondsoort 4. Hoog organische stof gehalte, N-mineralisatie hoog, vaak lagere N-bemestingsadvies. Organische stof 20-60%. CEC 30-80 meq/100g. Typische gewassen: grasland, gras-klaver. Drainage slecht, hoge grondwaterstand. Bodemdaling door oxidatie van veen. Lage draagkracht, beperkt geschikt voor akkerbouw.',
  },
  {
    id: 'loess',
    name: 'L\u00F6ss',
    soil_group: 5,
    texture: 'silt',
    drainage_class: 'matig',
    description: 'L\u00F6ssgronden (Zuid-Limburg). Grondsoort 5. Hoog vochthoudend vermogen, erosiegevoelig, vruchtbaar. Organische stof 2-4%. CEC 12-25 meq/100g. Typische gewassen: wintertarwe, suikerbieten, fruitteelt (appels, peren, kersen). Drainage matig, erosie op hellingen. N-norm tussen klei en zand. Rijenbemesting verplicht voor mais.',
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
//    Expanded: every crop x relevant soil group, differentiated N/P/K
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

// Phosphate norms depend on fosfaattoestand (P-status). Default = neutraal.
// K2O norms from Handboek Bodem en Bemesting, differentiated by soil group.
const recs: NutrientRec[] = [
  // =================== GRANEN ===================

  // Wintertarwe — all 5 soil groups
  { crop_id: 'wintertarwe', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 245, p_rec_kg_ha: 60, k_rec_kg_ha: 50, s_rec_kg_ha: 20,
    notes: 'Kleigrond. N-gebruiksnorm Meststoffenwet tabel 1. P2O5 bij fosfaattoestand neutraal. K2O advies Handboek.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'wintertarwe', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 190, p_rec_kg_ha: 60, k_rec_kg_ha: 40, s_rec_kg_ha: 25,
    notes: 'Zandgrond. Lagere N-norm door uitspoelingsgevoeligheid. S-behoefte hoger op zand.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'wintertarwe', soil_group: 3, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 200, p_rec_kg_ha: 60, k_rec_kg_ha: 45, s_rec_kg_ha: 20,
    notes: 'Dalgrond. N-norm vergelijkbaar met zand, iets hoger door N-vastlegging in organische stof.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'wintertarwe', soil_group: 4, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 180, p_rec_kg_ha: 55, k_rec_kg_ha: 40, s_rec_kg_ha: 15,
    notes: 'Veengrond. Lagere N-gift door hoge N-mineralisatie. Beperkt geteeld op veen.',
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
  { crop_id: 'zomertarwe', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 160, p_rec_kg_ha: 55, k_rec_kg_ha: 40, s_rec_kg_ha: 18,
    notes: 'Lossgrond.',
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
  { crop_id: 'wintergerst', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 135, p_rec_kg_ha: 55, k_rec_kg_ha: 45, s_rec_kg_ha: 18,
    notes: 'Lossgrond.',
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

  // Korrelmais
  { crop_id: 'korrelmais', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 160, p_rec_kg_ha: 55, k_rec_kg_ha: 50, s_rec_kg_ha: 10,
    notes: 'Kleigrond. K-afvoer lager dan snijmais (stro blijft op veld).',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'korrelmais', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 140, p_rec_kg_ha: 55, k_rec_kg_ha: 50, s_rec_kg_ha: 10,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Haver
  { crop_id: 'haver', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 50, k_rec_kg_ha: 40, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Haver verdraagt arme gronden goed.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'haver', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 80, p_rec_kg_ha: 50, k_rec_kg_ha: 35, s_rec_kg_ha: 15,
    notes: 'Zandgrond. Goede voorvrucht voor andere gewassen.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'haver', soil_group: 3, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 85, p_rec_kg_ha: 50, k_rec_kg_ha: 35, s_rec_kg_ha: 12,
    notes: 'Dalgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Triticale
  { crop_id: 'triticale', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 160, p_rec_kg_ha: 55, k_rec_kg_ha: 50, s_rec_kg_ha: 15,
    notes: 'Kleigrond. Kruising tarwe x rogge, robuust gewas.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'triticale', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 130, p_rec_kg_ha: 55, k_rec_kg_ha: 40, s_rec_kg_ha: 20,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'triticale', soil_group: 3, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 135, p_rec_kg_ha: 55, k_rec_kg_ha: 45, s_rec_kg_ha: 18,
    notes: 'Dalgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Rogge
  { crop_id: 'rogge', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 120, p_rec_kg_ha: 50, k_rec_kg_ha: 40, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Rogge: lage N-behoefte, goed op arme gronden.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'rogge', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 50, k_rec_kg_ha: 35, s_rec_kg_ha: 15,
    notes: 'Zandgrond. Traditioneel roggeteeltgebied.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'rogge', soil_group: 3, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 105, p_rec_kg_ha: 50, k_rec_kg_ha: 35, s_rec_kg_ha: 12,
    notes: 'Dalgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Spelt
  { crop_id: 'spelt', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 120, p_rec_kg_ha: 45, k_rec_kg_ha: 35, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Spelt: lage N-behoefte, robuust oud graan.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'spelt', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 45, k_rec_kg_ha: 30, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // =================== HAKVRUCHTEN ===================

  // Consumptieaardappelen
  { crop_id: 'consumptieaardappelen', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 250, p_rec_kg_ha: 60, k_rec_kg_ha: 180, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Hoge K-behoefte. P2O5 bij fosfaattoestand neutraal.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'consumptieaardappelen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 200, p_rec_kg_ha: 60, k_rec_kg_ha: 220, s_rec_kg_ha: 10,
    notes: 'Zandgrond. Hogere K-norm door uitspoeling.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'consumptieaardappelen', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 225, p_rec_kg_ha: 60, k_rec_kg_ha: 200, s_rec_kg_ha: 10,
    notes: 'Lossgrond.',
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
  { crop_id: 'suikerbieten', soil_group: 3, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 145, p_rec_kg_ha: 55, k_rec_kg_ha: 220, s_rec_kg_ha: 18,
    notes: 'Dalgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'suikerbieten', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 150, p_rec_kg_ha: 55, k_rec_kg_ha: 210, s_rec_kg_ha: 15,
    notes: 'Lossgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // =================== PEULVRUCHTEN ===================

  // Veldbonen
  { crop_id: 'veldbonen', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 30, p_rec_kg_ha: 50, k_rec_kg_ha: 80, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Lage N-gift: vlinderbloemige fixeert N. Alleen startgift.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'veldbonen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 30, p_rec_kg_ha: 50, k_rec_kg_ha: 90, s_rec_kg_ha: 15,
    notes: 'Zandgrond. Hogere K-gift door uitspoeling.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'veldbonen', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 30, p_rec_kg_ha: 50, k_rec_kg_ha: 85, s_rec_kg_ha: 12,
    notes: 'Lossgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Erwten (droog)
  { crop_id: 'erwten-droog', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 25, p_rec_kg_ha: 45, k_rec_kg_ha: 60, s_rec_kg_ha: 10,
    notes: 'Kleigrond. N-fixatie door Rhizobium. Alleen startgift.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'erwten-droog', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 25, p_rec_kg_ha: 45, k_rec_kg_ha: 70, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Kapucijners
  { crop_id: 'kapucijners', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 25, p_rec_kg_ha: 40, k_rec_kg_ha: 50, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Traditioneel Zeeuws/Zuid-Hollands gewas. N-fixatie.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'kapucijners', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 25, p_rec_kg_ha: 40, k_rec_kg_ha: 60, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Bruine bonen
  { crop_id: 'bruine-bonen', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 25, p_rec_kg_ha: 45, k_rec_kg_ha: 55, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Traditioneel Zeeuws gewas. N-fixatie.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'bruine-bonen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 25, p_rec_kg_ha: 45, k_rec_kg_ha: 65, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // =================== HANDELSGEWASSEN ===================

  // Winterkoolzaad
  { crop_id: 'winterkoolzaad', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 205, p_rec_kg_ha: 50, k_rec_kg_ha: 40, s_rec_kg_ha: 30,
    notes: 'Kleigrond. Hoge S-behoefte (kruisbloemigen).',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'winterkoolzaad', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 175, p_rec_kg_ha: 50, k_rec_kg_ha: 35, s_rec_kg_ha: 35,
    notes: 'Zandgrond. S-gift extra belangrijk op uitspoelingsgevoelige grond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'winterkoolzaad', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 190, p_rec_kg_ha: 50, k_rec_kg_ha: 38, s_rec_kg_ha: 30,
    notes: 'Lossgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Vlas
  { crop_id: 'vlas', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 50, p_rec_kg_ha: 40, k_rec_kg_ha: 80, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Lage N-gift voorkomt legering. Zeeuws-Vlaamse teelt.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'vlas', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 40, p_rec_kg_ha: 40, k_rec_kg_ha: 90, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Hennep
  { crop_id: 'hennep', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 120, p_rec_kg_ha: 45, k_rec_kg_ha: 120, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Vezelkennep: hoge K-behoefte.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'hennep', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 45, k_rec_kg_ha: 140, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Cichorei
  { crop_id: 'cichorei', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 120, p_rec_kg_ha: 50, k_rec_kg_ha: 180, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Wortelgewas voor inuline. Hoge K-afvoer.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'cichorei', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 50, k_rec_kg_ha: 200, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Karwij
  { crop_id: 'karwij', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 80, p_rec_kg_ha: 30, k_rec_kg_ha: 30, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Tweejarig gewas, karwijzaad. N bescheiden.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'karwij', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 65, p_rec_kg_ha: 30, k_rec_kg_ha: 25, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // =================== VOLLEGRONDSGROENTEN ===================

  // Zaaiuien
  { crop_id: 'zaaiuien', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 120, p_rec_kg_ha: 50, k_rec_kg_ha: 60, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Uien gevoelig voor te veel N (bewaarziekte).',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'zaaiuien', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 50, k_rec_kg_ha: 70, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Spruitkool
  { crop_id: 'spruitkool', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 275, p_rec_kg_ha: 55, k_rec_kg_ha: 180, s_rec_kg_ha: 30,
    notes: 'Kleigrond. Hoge N-behoefte. Kruisbloemige: S belangrijk.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'spruitkool', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 230, p_rec_kg_ha: 55, k_rec_kg_ha: 210, s_rec_kg_ha: 35,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Bloemkool
  { crop_id: 'bloemkool', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 250, p_rec_kg_ha: 50, k_rec_kg_ha: 200, s_rec_kg_ha: 30,
    notes: 'Kleigrond. Kruisbloemige: hoge S-behoefte.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'bloemkool', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 210, p_rec_kg_ha: 50, k_rec_kg_ha: 230, s_rec_kg_ha: 35,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Broccoli
  { crop_id: 'broccoli', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 230, p_rec_kg_ha: 45, k_rec_kg_ha: 150, s_rec_kg_ha: 30,
    notes: 'Kleigrond. Kruisbloemige: S belangrijk.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'broccoli', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 195, p_rec_kg_ha: 45, k_rec_kg_ha: 170, s_rec_kg_ha: 35,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Witte kool
  { crop_id: 'witte-kool', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 300, p_rec_kg_ha: 55, k_rec_kg_ha: 250, s_rec_kg_ha: 30,
    notes: 'Kleigrond. Zeer hoge N-behoefte. Bewaar- en industriekool.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'witte-kool', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 260, p_rec_kg_ha: 55, k_rec_kg_ha: 280, s_rec_kg_ha: 35,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Rode kool
  { crop_id: 'rode-kool', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 260, p_rec_kg_ha: 50, k_rec_kg_ha: 200, s_rec_kg_ha: 25,
    notes: 'Kleigrond. Vergelijkbaar met witte kool, iets lagere opbrengst.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'rode-kool', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 220, p_rec_kg_ha: 50, k_rec_kg_ha: 230, s_rec_kg_ha: 30,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Prei
  { crop_id: 'prei', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 200, p_rec_kg_ha: 50, k_rec_kg_ha: 180, s_rec_kg_ha: 15,
    notes: 'Kleigrond. Lang groeiseizoen, hoge K-behoefte.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'prei', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 170, p_rec_kg_ha: 50, k_rec_kg_ha: 210, s_rec_kg_ha: 20,
    notes: 'Zandgrond. Hoofdteeltgebied prei is Zuid-Limburg (loss) en Noord-Brabant (zand).',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'prei', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 185, p_rec_kg_ha: 50, k_rec_kg_ha: 190, s_rec_kg_ha: 18,
    notes: 'Lossgrond. Belangrijk teeltgebied.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Wortelen
  { crop_id: 'wortelen', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 50, k_rec_kg_ha: 200, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Wortelgewas: hoge K-behoefte, matige N.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'wortelen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 80, p_rec_kg_ha: 50, k_rec_kg_ha: 240, s_rec_kg_ha: 15,
    notes: 'Zandgrond. Hoofdteeltgebied bospeen en waspeen.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Schorseneren
  { crop_id: 'schorseneren', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 80, p_rec_kg_ha: 40, k_rec_kg_ha: 100, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Wortelgewas.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'schorseneren', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 65, p_rec_kg_ha: 40, k_rec_kg_ha: 120, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Witlofwortelen
  { crop_id: 'witlofwortelen', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 45, k_rec_kg_ha: 150, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Wortelteelt voor witloftrek.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'witlofwortelen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 85, p_rec_kg_ha: 45, k_rec_kg_ha: 170, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Sla
  { crop_id: 'sla', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 30, k_rec_kg_ha: 100, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Kort groeiseizoen, meerdere teelten per jaar.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'sla', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 80, p_rec_kg_ha: 30, k_rec_kg_ha: 120, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Spinazie
  { crop_id: 'spinazie', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 175, p_rec_kg_ha: 40, k_rec_kg_ha: 150, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Hoge N-behoefte per kg droge stof.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'spinazie', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 150, p_rec_kg_ha: 40, k_rec_kg_ha: 170, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Stamslabonen
  { crop_id: 'stamslabonen', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 60, p_rec_kg_ha: 35, k_rec_kg_ha: 60, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Deels N-fixerend. Conservenindustrie.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'stamslabonen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 50, p_rec_kg_ha: 35, k_rec_kg_ha: 70, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Was- en pronkbonen
  { crop_id: 'was-pronkbonen', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 70, p_rec_kg_ha: 40, k_rec_kg_ha: 80, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Deels N-fixerend.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'was-pronkbonen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 55, p_rec_kg_ha: 40, k_rec_kg_ha: 90, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Knolselderij
  { crop_id: 'knolselderij', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 185, p_rec_kg_ha: 50, k_rec_kg_ha: 250, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Hoge K-afvoer. Lang groeiseizoen.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'knolselderij', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 160, p_rec_kg_ha: 50, k_rec_kg_ha: 280, s_rec_kg_ha: 15,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Asperges
  { crop_id: 'asperges', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 120, p_rec_kg_ha: 30, k_rec_kg_ha: 100, s_rec_kg_ha: 10,
    notes: 'Zandgrond. Meerjarig gewas, typisch op lichte grond. Bemesting na steekseizoen.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'asperges', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 130, p_rec_kg_ha: 30, k_rec_kg_ha: 90, s_rec_kg_ha: 10,
    notes: 'Lossgrond. Limburgs teeltgebied.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // =================== BOLGEWASSEN ===================

  // Tulpen
  { crop_id: 'tulpen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 140, p_rec_kg_ha: 40, k_rec_kg_ha: 120, s_rec_kg_ha: 10,
    notes: 'Zandgrond. Bollenstreek en Noord-Holland. Plantgoedkwaliteit bepalend.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'tulpen', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 160, p_rec_kg_ha: 40, k_rec_kg_ha: 100, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Beperkte teelt op klei.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Lelies
  { crop_id: 'lelies', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 130, p_rec_kg_ha: 35, k_rec_kg_ha: 100, s_rec_kg_ha: 10,
    notes: 'Zandgrond. Hoofdteeltgebied: Drenthe, Noord-Holland.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'lelies', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 150, p_rec_kg_ha: 35, k_rec_kg_ha: 85, s_rec_kg_ha: 10,
    notes: 'Kleigrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Gladiolen
  { crop_id: 'gladiolen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 30, k_rec_kg_ha: 100, s_rec_kg_ha: 10,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Hyacinten
  { crop_id: 'hyacinten', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 120, p_rec_kg_ha: 35, k_rec_kg_ha: 100, s_rec_kg_ha: 10,
    notes: 'Zandgrond. Bollenstreek, specifieke geestgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Narcissen
  { crop_id: 'narcissen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 30, k_rec_kg_ha: 80, s_rec_kg_ha: 10,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Dahlia's
  { crop_id: 'dahlias', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 30, k_rec_kg_ha: 80, s_rec_kg_ha: 10,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Irissen
  { crop_id: 'irissen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 90, p_rec_kg_ha: 25, k_rec_kg_ha: 70, s_rec_kg_ha: 10,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // =================== FRUITTEELT ===================

  // Appels
  { crop_id: 'appels', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 60, p_rec_kg_ha: 20, k_rec_kg_ha: 100, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Meerjarig gewas. N bescheiden, K via bladanalyse.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'appels', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 50, p_rec_kg_ha: 20, k_rec_kg_ha: 120, s_rec_kg_ha: 12,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'appels', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 55, p_rec_kg_ha: 20, k_rec_kg_ha: 110, s_rec_kg_ha: 10,
    notes: 'Lossgrond. Zuid-Limburgs fruitteeltgebied.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Peren
  { crop_id: 'peren', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 50, p_rec_kg_ha: 18, k_rec_kg_ha: 90, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Betuwe fruitteeltgebied.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'peren', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 40, p_rec_kg_ha: 18, k_rec_kg_ha: 110, s_rec_kg_ha: 12,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Aardbeien
  { crop_id: 'aardbeien', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 120, p_rec_kg_ha: 35, k_rec_kg_ha: 150, s_rec_kg_ha: 10,
    notes: 'Zandgrond. Hoofdteeltgebied. Meerdere plukronden.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'aardbeien', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 140, p_rec_kg_ha: 35, k_rec_kg_ha: 130, s_rec_kg_ha: 10,
    notes: 'Kleigrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Blauwe bessen
  { crop_id: 'blauwe-bessen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 50, p_rec_kg_ha: 15, k_rec_kg_ha: 40, s_rec_kg_ha: 10,
    notes: 'Zandgrond. Zuurminnend gewas, pH 4.0-5.5.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'blauwe-bessen', soil_group: 4, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 35, p_rec_kg_ha: 12, k_rec_kg_ha: 35, s_rec_kg_ha: 8,
    notes: 'Veengrond. Ideaal substraat, lage pH.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Frambozen
  { crop_id: 'frambozen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 80, p_rec_kg_ha: 20, k_rec_kg_ha: 80, s_rec_kg_ha: 10,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Kersen
  { crop_id: 'kersen', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 50, p_rec_kg_ha: 15, k_rec_kg_ha: 70, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Betuwe, Zuid-Limburg.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'kersen', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 55, p_rec_kg_ha: 15, k_rec_kg_ha: 65, s_rec_kg_ha: 10,
    notes: 'Lossgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // =================== BOOMKWEKERIJ ===================

  // Laanbomen
  { crop_id: 'laanbomen', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 30, k_rec_kg_ha: 80, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Betuwe boomkwekerijgebied.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'laanbomen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 80, p_rec_kg_ha: 30, k_rec_kg_ha: 90, s_rec_kg_ha: 15,
    notes: 'Zandgrond. Haaren/Zundert teeltgebied.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Vruchtbomen
  { crop_id: 'vruchtbomen', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 90, p_rec_kg_ha: 25, k_rec_kg_ha: 70, s_rec_kg_ha: 10,
    notes: 'Kleigrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'vruchtbomen', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 75, p_rec_kg_ha: 25, k_rec_kg_ha: 80, s_rec_kg_ha: 12,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Sierheesters
  { crop_id: 'sierheesters', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 80, p_rec_kg_ha: 20, k_rec_kg_ha: 60, s_rec_kg_ha: 10,
    notes: 'Kleigrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'sierheesters', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 70, p_rec_kg_ha: 20, k_rec_kg_ha: 70, s_rec_kg_ha: 12,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // =================== VOEDERGEWASSEN ===================

  // Snijmais
  { crop_id: 'snijmais', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 185, p_rec_kg_ha: 60, k_rec_kg_ha: 200, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Hogere N-norm op klei dan op zand.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'snijmais', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 150, p_rec_kg_ha: 55, k_rec_kg_ha: 220, s_rec_kg_ha: 10,
    notes: 'Zandgrond. N-gebruiksnorm 150 kg/ha. Rijenbemesting verplicht op zand/loss.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'snijmais', soil_group: 3, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 155, p_rec_kg_ha: 55, k_rec_kg_ha: 210, s_rec_kg_ha: 10,
    notes: 'Dalgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'snijmais', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 150, p_rec_kg_ha: 55, k_rec_kg_ha: 180, s_rec_kg_ha: 10,
    notes: 'Lossgrond. Rijenbemesting verplicht.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Luzerne
  { crop_id: 'luzerne', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 20, p_rec_kg_ha: 50, k_rec_kg_ha: 250, s_rec_kg_ha: 15,
    notes: 'Kleigrond. Vlinderbloemige: bijna volledige N-fixatie. Hoge K-afvoer door meerdere sneden.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'luzerne', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 20, p_rec_kg_ha: 50, k_rec_kg_ha: 280, s_rec_kg_ha: 20,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'luzerne', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 20, p_rec_kg_ha: 50, k_rec_kg_ha: 260, s_rec_kg_ha: 15,
    notes: 'Lossgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Gras-klaver
  { crop_id: 'gras-klaver', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 100, p_rec_kg_ha: 55, k_rec_kg_ha: 220, s_rec_kg_ha: 15,
    notes: 'Kleigrond. Gereduceerde N-gift door klaver N-fixatie. 30-50% klaveraandeel gewenst.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },
  { crop_id: 'gras-klaver', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 80, p_rec_kg_ha: 55, k_rec_kg_ha: 260, s_rec_kg_ha: 20,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },
  { crop_id: 'gras-klaver', soil_group: 4, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 60, p_rec_kg_ha: 50, k_rec_kg_ha: 220, s_rec_kg_ha: 10,
    notes: 'Veengrond. Lage N-gift door hoge N-mineralisatie + klaver-fixatie.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },

  // =================== GRASLAND ===================

  // Grasland (maaien)
  { crop_id: 'grasland-maaien', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 345, p_rec_kg_ha: 60, k_rec_kg_ha: 240, s_rec_kg_ha: 20,
    notes: 'Kleigrond, alleen maaien. Hoogste N-norm in NL. P2O5 bij fosfaattoestand neutraal.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },
  { crop_id: 'grasland-maaien', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 250, p_rec_kg_ha: 60, k_rec_kg_ha: 280, s_rec_kg_ha: 25,
    notes: 'Zandgrond, alleen maaien. Lagere N-norm door derogatie-eisen.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },
  { crop_id: 'grasland-maaien', soil_group: 3, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 260, p_rec_kg_ha: 60, k_rec_kg_ha: 260, s_rec_kg_ha: 20,
    notes: 'Dalgrond, alleen maaien.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },
  { crop_id: 'grasland-maaien', soil_group: 4, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 265, p_rec_kg_ha: 55, k_rec_kg_ha: 240, s_rec_kg_ha: 15,
    notes: 'Veengrond, alleen maaien. Hoge N-mineralisatie compenseert gedeeltelijk.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },
  { crop_id: 'grasland-maaien', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 275, p_rec_kg_ha: 60, k_rec_kg_ha: 250, s_rec_kg_ha: 20,
    notes: 'Lossgrond, alleen maaien.',
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
  { crop_id: 'grasland-beweiden', soil_group: 3, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 210, p_rec_kg_ha: 55, k_rec_kg_ha: 190, s_rec_kg_ha: 18,
    notes: 'Dalgrond met beweiding.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },
  { crop_id: 'grasland-beweiden', soil_group: 4, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 190, p_rec_kg_ha: 50, k_rec_kg_ha: 180, s_rec_kg_ha: 10,
    notes: 'Veengrond met beweiding. N-mineralisatie hoog, lagere N-gift nodig.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },
  { crop_id: 'grasland-beweiden', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 220, p_rec_kg_ha: 55, k_rec_kg_ha: 190, s_rec_kg_ha: 15,
    notes: 'Lossgrond met beweiding.',
    rb209_section: 'Tabel 2 Uitvoeringsregeling' },

  // =================== EXTRA SOIL GROUP COVERAGE ===================

  // Zomertarwe extra soil groups
  { crop_id: 'zomertarwe', soil_group: 3, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 155, p_rec_kg_ha: 55, k_rec_kg_ha: 38, s_rec_kg_ha: 18,
    notes: 'Dalgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'zomertarwe', soil_group: 4, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 140, p_rec_kg_ha: 50, k_rec_kg_ha: 35, s_rec_kg_ha: 12,
    notes: 'Veengrond. Lagere N-gift door mineralisatie.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Consumptieaardappelen extra
  { crop_id: 'consumptieaardappelen', soil_group: 3, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 210, p_rec_kg_ha: 60, k_rec_kg_ha: 210, s_rec_kg_ha: 10,
    notes: 'Dalgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Zaaiuien extra
  { crop_id: 'zaaiuien', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 110, p_rec_kg_ha: 50, k_rec_kg_ha: 65, s_rec_kg_ha: 12,
    notes: 'Lossgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Spruitkool extra
  { crop_id: 'spruitkool', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 250, p_rec_kg_ha: 55, k_rec_kg_ha: 195, s_rec_kg_ha: 32,
    notes: 'Lossgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Bloemkool extra
  { crop_id: 'bloemkool', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 230, p_rec_kg_ha: 50, k_rec_kg_ha: 215, s_rec_kg_ha: 32,
    notes: 'Lossgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Wortelen extra
  { crop_id: 'wortelen', soil_group: 3, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 85, p_rec_kg_ha: 50, k_rec_kg_ha: 230, s_rec_kg_ha: 12,
    notes: 'Dalgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Tulpen extra
  { crop_id: 'tulpen', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 150, p_rec_kg_ha: 40, k_rec_kg_ha: 110, s_rec_kg_ha: 10,
    notes: 'Lossgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Peren extra
  { crop_id: 'peren', soil_group: 5, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 45, p_rec_kg_ha: 18, k_rec_kg_ha: 100, s_rec_kg_ha: 10,
    notes: 'Lossgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Snijmais extra
  { crop_id: 'snijmais', soil_group: 4, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 140, p_rec_kg_ha: 50, k_rec_kg_ha: 190, s_rec_kg_ha: 8,
    notes: 'Veengrond. Lagere N-norm door mineralisatie.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // =================== ENERGIEGEWASSEN ===================

  // Japanse duizendknoop
  { crop_id: 'japanse-duizendknoop', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 80, p_rec_kg_ha: 25, k_rec_kg_ha: 100, s_rec_kg_ha: 10,
    notes: 'Kleigrond. Energiegewas. Lage bemestingsbehoefte.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'japanse-duizendknoop', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 60, p_rec_kg_ha: 25, k_rec_kg_ha: 110, s_rec_kg_ha: 12,
    notes: 'Zandgrond.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },

  // Miscanthus
  { crop_id: 'miscanthus', soil_group: 1, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 50, p_rec_kg_ha: 15, k_rec_kg_ha: 100, s_rec_kg_ha: 10,
    notes: 'Kleigrond. C4-gras: efficient N-gebruik. Late oogst: nutrienten terug in rhizoom.',
    rb209_section: 'Tabel 1 Uitvoeringsregeling' },
  { crop_id: 'miscanthus', soil_group: 2, sns_index: null, previous_crop_group: null,
    n_rec_kg_ha: 40, p_rec_kg_ha: 15, k_rec_kg_ha: 110, s_rec_kg_ha: 12,
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
  // Granen
  { crop_id: 'wintertarwe', market: 'af-boerderij', price_per_tonne: 210.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Wageningen Economic Research' },
  { crop_id: 'zomergerst', market: 'af-boerderij (brouwgerst)', price_per_tonne: 250.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Wageningen Economic Research' },
  { crop_id: 'haver', market: 'af-boerderij', price_per_tonne: 195.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Wageningen Economic Research' },
  { crop_id: 'triticale', market: 'af-boerderij', price_per_tonne: 185.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Wageningen Economic Research' },

  // Hakvruchten
  { crop_id: 'consumptieaardappelen', market: 'af-boerderij', price_per_tonne: 120.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / PotatoNL' },
  { crop_id: 'pootaardappelen', market: 'af-boerderij', price_per_tonne: 350.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / NAO' },
  { crop_id: 'suikerbieten', market: 'Cosun', price_per_tonne: 45.0, currency: 'EUR',
    price_source: 'cosun_suiker', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'Cosun / Royal Cosun bietenprijs' },

  // Vollegrondsgroenten
  { crop_id: 'zaaiuien', market: 'af-boerderij', price_per_tonne: 150.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Uienmarkt' },
  { crop_id: 'spruitkool', market: 'af-boerderij', price_per_tonne: 450.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / GroentenFruit Huis' },
  { crop_id: 'bloemkool', market: 'af-boerderij', price_per_tonne: 380.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / GroentenFruit Huis' },
  { crop_id: 'prei', market: 'af-boerderij', price_per_tonne: 320.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / GroentenFruit Huis' },
  { crop_id: 'wortelen', market: 'af-boerderij', price_per_tonne: 85.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / GroentenFruit Huis' },
  { crop_id: 'asperges', market: 'af-boerderij', price_per_tonne: 4500.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / GroentenFruit Huis' },

  // Peulvruchten
  { crop_id: 'veldbonen', market: 'af-boerderij', price_per_tonne: 280.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Wageningen Economic Research' },
  { crop_id: 'erwten-droog', market: 'af-boerderij', price_per_tonne: 310.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Wageningen Economic Research' },

  // Handelsgewassen
  { crop_id: 'winterkoolzaad', market: 'af-boerderij', price_per_tonne: 440.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Matif' },
  { crop_id: 'vlas', market: 'af-boerderij (vezelvlas)', price_per_tonne: 160.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Wageningen Economic Research' },

  // Voedergewassen
  { crop_id: 'snijmais', market: 'af-boerderij (per ton vers)', price_per_tonne: 45.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / Boerenbusiness' },

  // Bolgewassen
  { crop_id: 'tulpen', market: 'af-boerderij (per ton bollen)', price_per_tonne: 2500.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / KAVB' },
  { crop_id: 'lelies', market: 'af-boerderij (per ton bollen)', price_per_tonne: 3200.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / KAVB' },

  // Fruitteelt
  { crop_id: 'appels', market: 'af-boerderij', price_per_tonne: 450.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / NFO' },
  { crop_id: 'peren', market: 'af-boerderij', price_per_tonne: 550.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / NFO' },
  { crop_id: 'aardbeien', market: 'af-boerderij', price_per_tonne: 2800.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / GroentenFruit Huis' },

  // Zuivel referentieprijzen
  { crop_id: 'grasland-maaien', market: 'melk (biologisch, referentie)', price_per_tonne: 520.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / ZuivelNL — biologische melkprijs per ton' },
  { crop_id: 'grasland-beweiden', market: 'kaas (boerderijprijs, referentie)', price_per_tonne: 4200.0, currency: 'EUR',
    price_source: 'agrimatie_wur', published_date: '2026-03-01', retrieved_at: '2026-04-01',
    source: 'WUR Agrimatie / ZuivelNL — boerenkaas af-boerderij per ton' },
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
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('data_version', '2026.2')", []);
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
