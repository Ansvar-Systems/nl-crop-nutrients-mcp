# Coverage

## What Is Included

- **Crop nutrient recommendations** from RVO Handboek Bodem en Bemesting and Meststoffenwet gebruiksnormen: N, P2O5, K2O, and S rates by crop and soil type
- **Soil type classifications**: 5 Dutch soil groups (klei, zand, dalgrond, veen, loss) with texture and drainage characteristics
- **Commodity prices**: Dutch market prices from WUR Agrimatie and industry sources (EUR/tonne)
- **Crop profiles**: 14 crops with typical yields, nutrient offtake values, and growth stages for major Dutch arable and grassland crops

## Crops Covered

| Crop | Group | Typical Yield |
|------|-------|---------------|
| Wintertarwe | Granen | 9.0 t/ha |
| Zomertarwe | Granen | 7.0 t/ha |
| Wintergerst | Granen | 7.5 t/ha |
| Zomergerst | Granen | 6.0 t/ha |
| Consumptieaardappelen | Hakvruchten | 45.0 t/ha |
| Pootaardappelen | Hakvruchten | 35.0 t/ha |
| Zetmeelaardappelen | Hakvruchten | 45.0 t/ha |
| Suikerbieten | Hakvruchten | 75.0 t/ha |
| Zaaiuien | Vollegrondsgroenten | 55.0 t/ha |
| Snijmais | Voedergewassen | 50.0 t/ha |
| Grasland (maaien) | Grasland | 12.0 t ds/ha |
| Grasland (beweiden) | Grasland | 10.0 t ds/ha |
| Winterkoolzaad | Oliegewassen | 4.0 t/ha |
| Korrelmais | Granen | 10.0 t/ha |

## Jurisdictions

| Code | Country | Status |
|------|---------|--------|
| NL | Netherlands | Supported |

## What Is NOT Included

- **Organic farming recommendations** -- Only conventional norms are covered
- **Micronutrient recommendations** -- Only N, P2O5, K2O, and S are covered
- **Individual field analysis** -- This is reference data, not a precision farming tool
- **Lime recommendations** -- Not yet ingested
- **Phosphate differentiation by P-status** -- Default values use fosfaattoestand "neutraal"; laag/hoog/zeer hoog variants are described but not individually queryable per field
- **Real-time prices** -- Prices are snapshots from the last ingestion run
- **Derogation-specific adjustments** -- Derogatie was phased out; norms reflect post-derogation reality

## Known Gaps

1. Commodity price data depends on WUR Agrimatie publication schedule
2. FTS5 search quality varies with query phrasing -- use specific Dutch crop names for best results
3. Phosphate norms are shown at fosfaattoestand "neutraal" by default; field-specific P-status adjustment requires soil analysis

## Data Freshness

Run `check_data_freshness` to see when data was last updated. The ingestion pipeline runs on a schedule; manual triggers available via `gh workflow run ingest.yml`.
