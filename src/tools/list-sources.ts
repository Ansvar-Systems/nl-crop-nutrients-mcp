import { buildMeta } from '../metadata.js';
import type { Database } from '../db.js';

interface Source {
  name: string;
  authority: string;
  official_url: string;
  retrieval_method: string;
  update_frequency: string;
  license: string;
  coverage: string;
  last_retrieved?: string;
}

export function handleListSources(db: Database): { sources: Source[]; _meta: ReturnType<typeof buildMeta> } {
  const lastIngest = db.get<{ value: string }>('SELECT value FROM db_metadata WHERE key = ?', ['last_ingest']);

  const sources: Source[] = [
    {
      name: 'RVO Handboek Bodem en Bemesting',
      authority: 'Rijksdienst voor Ondernemend Nederland (RVO)',
      official_url: 'https://www.handboekbodemenbemesting.nl',
      retrieval_method: 'HTML_SCRAPE',
      update_frequency: 'annual',
      license: 'Public domain (Dutch government publication)',
      coverage: 'NPK recommendations for all major Dutch crops by soil type, phosphate status, and crop group',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'Meststoffenwet / Uitvoeringsregeling Meststoffenwet',
      authority: 'Ministerie van Landbouw, Natuur en Voedselkwaliteit (LNV)',
      official_url: 'https://wetten.overheid.nl/BWBR0004054',
      retrieval_method: 'LEGAL_REFERENCE',
      update_frequency: 'annual (legislative cycle)',
      license: 'Public domain (Dutch legislation)',
      coverage: 'Nitrogen and phosphate application norms (gebruiksnormen) for Dutch agriculture',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'WUR Agrimatie',
      authority: 'Wageningen University & Research (WUR)',
      official_url: 'https://www.agrimatie.nl',
      retrieval_method: 'HTML_SCRAPE',
      update_frequency: 'monthly',
      license: 'Public domain (WUR research data)',
      coverage: 'Dutch agricultural commodity prices and market data',
      last_retrieved: lastIngest?.value,
    },
  ];

  return {
    sources,
    _meta: buildMeta({ source_url: 'https://www.handboekbodemenbemesting.nl' }),
  };
}
