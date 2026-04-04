import { createDatabase, type Database } from '../../src/db.js';

export function createSeededDatabase(dbPath: string): Database {
  const db = createDatabase(dbPath);

  // Crops — Dutch arable
  db.run(
    `INSERT INTO crops (id, name, crop_group, typical_yield_t_ha, nutrient_offtake_n, nutrient_offtake_p2o5, nutrient_offtake_k2o, growth_stages, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['wintertarwe', 'Wintertarwe', 'granen', 9.0, 207, 72, 50, JSON.stringify(['uitstoeling', 'stengelstrekking', 'aarzwelling', 'bloei', 'korrelvulling']), 'NL']
  );
  db.run(
    `INSERT INTO crops (id, name, crop_group, typical_yield_t_ha, nutrient_offtake_n, nutrient_offtake_p2o5, nutrient_offtake_k2o, growth_stages, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['zomergerst', 'Zomergerst', 'granen', 6.0, 108, 48, 42, JSON.stringify(['uitstoeling', 'stengelstrekking', 'aarzwelling', 'korrelvulling']), 'NL']
  );

  // Soil types — Dutch classification
  db.run(
    `INSERT INTO soil_types (id, name, soil_group, texture, drainage_class, description)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['klei', 'Klei', 1, 'klei', 'matig', 'Kleigronden (rivierklei, zeeklei). Grondsoort 1 in het Handboek Bodem en Bemesting.']
  );
  db.run(
    `INSERT INTO soil_types (id, name, soil_group, texture, drainage_class, description)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['zand', 'Zand en lichte zavel', 2, 'zand', 'goed', 'Zandgronden en lichte zavelgronden. Grondsoort 2.']
  );

  // Nutrient recommendations
  db.run(
    `INSERT INTO nutrient_recommendations (crop_id, soil_group, sns_index, previous_crop_group, n_rec_kg_ha, p_rec_kg_ha, k_rec_kg_ha, s_rec_kg_ha, notes, rb209_section, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['wintertarwe', 1, null, null, 245, 60, 50, 20, 'Kleigrond. N-gebruiksnorm Meststoffenwet tabel 1.', 'Tabel 1 Uitvoeringsregeling', 'NL']
  );
  db.run(
    `INSERT INTO nutrient_recommendations (crop_id, soil_group, sns_index, previous_crop_group, n_rec_kg_ha, p_rec_kg_ha, k_rec_kg_ha, s_rec_kg_ha, notes, rb209_section, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['zomergerst', 2, null, null, 60, 50, 35, 15, 'Zandgrond. Brouwgerst: N laag houden.', 'Tabel 1 Uitvoeringsregeling', 'NL']
  );

  // Commodity prices — EUR
  db.run(
    `INSERT INTO commodity_prices (crop_id, market, price_per_tonne, currency, price_source, published_date, retrieved_at, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['wintertarwe', 'af-boerderij', 210.0, 'EUR', 'agrimatie_wur', '2026-03-01', '2026-04-01', 'WUR Agrimatie', 'NL']
  );
  db.run(
    `INSERT INTO commodity_prices (crop_id, market, price_per_tonne, currency, price_source, published_date, retrieved_at, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['zomergerst', 'af-boerderij (brouwgerst)', 250.0, 'EUR', 'agrimatie_wur', '2026-03-01', '2026-04-01', 'WUR Agrimatie', 'NL']
  );

  // FTS5 search index
  db.run(
    `INSERT INTO search_index (title, body, crop_group, jurisdiction) VALUES (?, ?, ?, ?)`,
    ['Wintertarwe bemestingsadvies', 'Wintertarwe gebruiksnorm 245 kg N/ha op kleigrond. P2O5 60, K2O 50 kg/ha. Opbrengst 9.0 t/ha.', 'granen', 'NL']
  );
  db.run(
    `INSERT INTO search_index (title, body, crop_group, jurisdiction) VALUES (?, ?, ?, ?)`,
    ['Zomergerst bemestingsadvies', 'Zomergerst gebruiksnorm 60 kg N/ha op zandgrond. Brouwgerst: N laag houden. Opbrengst 6.0 t/ha.', 'granen', 'NL']
  );

  return db;
}
