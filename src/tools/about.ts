import { buildMeta } from '../metadata.js';
import { SUPPORTED_JURISDICTIONS } from '../jurisdiction.js';

export function handleAbout() {
  return {
    name: 'Netherlands Crop Nutrients MCP',
    description:
      'Dutch crop nutrient recommendations based on RVO Handboek Bodem en Bemesting and Meststoffenwet. ' +
      'Provides NPK planning, soil classification (klei, zand, dalgrond, veen, loss), ' +
      'crop requirements for 14 Dutch arable and grassland crops, and commodity pricing.',
    version: '0.1.0',
    jurisdiction: [...SUPPORTED_JURISDICTIONS],
    data_sources: [
      'RVO Handboek Bodem en Bemesting',
      'Meststoffenwet / Uitvoeringsregeling Meststoffenwet',
      'WUR Agrimatie',
    ],
    tools_count: 10,
    links: {
      homepage: 'https://ansvar.eu/open-agriculture',
      repository: 'https://github.com/ansvar-systems/nl-crop-nutrients-mcp',
      mcp_network: 'https://ansvar.ai/mcp',
    },
    _meta: buildMeta(),
  };
}
