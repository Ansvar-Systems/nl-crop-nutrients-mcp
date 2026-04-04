import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleGetNutrientPlan } from '../../src/tools/get-nutrient-plan.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-nutrient-plan.db';

describe('get_nutrient_plan tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('returns NPK for wintertarwe on klei', () => {
    const result = handleGetNutrientPlan(db, { crop: 'wintertarwe', soil_type: 'klei' });
    expect(result).toHaveProperty('recommendation');
    const rec = (result as { recommendation: { nitrogen_kg_ha: number; phosphate_kg_ha: number; potash_kg_ha: number } }).recommendation;
    expect(rec.nitrogen_kg_ha).toBe(245);
    expect(rec.phosphate_kg_ha).toBe(60);
    expect(rec.potash_kg_ha).toBe(50);
  });

  test('rejects unsupported jurisdiction', () => {
    const result = handleGetNutrientPlan(db, { crop: 'wintertarwe', soil_type: 'klei', jurisdiction: 'SE' });
    expect(result).toHaveProperty('error', 'jurisdiction_not_supported');
  });

  test('returns not_found for unknown crop', () => {
    const result = handleGetNutrientPlan(db, { crop: 'turnips', soil_type: 'klei' });
    expect(result).toHaveProperty('error', 'not_found');
  });

  test('returns not_found for unknown soil type', () => {
    const result = handleGetNutrientPlan(db, { crop: 'wintertarwe', soil_type: 'volcanic-ash' });
    expect(result).toHaveProperty('error', 'not_found');
  });

  test('looks up by crop name case-insensitively', () => {
    const result = handleGetNutrientPlan(db, { crop: 'Wintertarwe', soil_type: 'klei' });
    expect(result).toHaveProperty('recommendation');
  });
});
