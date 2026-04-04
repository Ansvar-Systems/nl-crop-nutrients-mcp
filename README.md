# Netherlands Crop Nutrients MCP

[![CI](https://github.com/ansvar-systems/nl-crop-nutrients-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/ansvar-systems/nl-crop-nutrients-mcp/actions/workflows/ci.yml)
[![GHCR](https://github.com/ansvar-systems/nl-crop-nutrients-mcp/actions/workflows/ghcr-build.yml/badge.svg)](https://github.com/ansvar-systems/nl-crop-nutrients-mcp/actions/workflows/ghcr-build.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Dutch crop nutrient recommendations via the [Model Context Protocol](https://modelcontextprotocol.io). Query RVO gebruiksnormen, soil types, NPK planning, and commodity prices -- all from your AI assistant.

Part of [Ansvar Open Agriculture](https://ansvar.eu/open-agriculture).

## Why This Exists

Farmers and agronomists in the Netherlands need quick access to nutrient application norms (gebruiksnormen), commodity prices, and soil data. This information is published by RVO, the Meststoffenwet, and WUR but is scattered across government websites, legal texts, and PDFs that AI assistants cannot query directly. This MCP server makes it all searchable.

## Quick Start

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "nl-crop-nutrients": {
      "command": "npx",
      "args": ["-y", "@ansvar/nl-crop-nutrients-mcp"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add nl-crop-nutrients npx @ansvar/nl-crop-nutrients-mcp
```

### Streamable HTTP (remote)

```
https://mcp.ansvar.eu/nl-crop-nutrients/mcp
```

### Docker (self-hosted)

```bash
docker run -p 3000:3000 ghcr.io/ansvar-systems/nl-crop-nutrients-mcp:latest
```

### npm (stdio)

```bash
npx @ansvar/nl-crop-nutrients-mcp
```

## Example Queries

Ask your AI assistant:

- "Wat is de N-gebruiksnorm voor wintertarwe op kleigrond?"
- "What NPK does winter wheat need on clay soil in the Netherlands?"
- "Wat is de huidige prijs van consumptieaardappelen?"
- "Welke grondsoort is dalgrond?"
- "Zoek bemestingsadvies voor snijmais op zand"
- "Calculate gross margin for 9 t/ha wintertarwe at 900/ha input costs"

## Stats

| Metric | Value |
|--------|-------|
| Tools | 10 (3 meta + 7 domain) |
| Crops | 14 (arable + grassland) |
| Soil types | 5 (klei, zand, dalgrond, veen, loss) |
| Jurisdiction | NL |
| Data sources | RVO Handboek Bodem en Bemesting, Meststoffenwet, WUR Agrimatie |
| License (data) | Public domain (Dutch government) |
| License (code) | Apache-2.0 |
| Transport | stdio + Streamable HTTP |

## Tools

| Tool | Description |
|------|-------------|
| `about` | Server metadata and links |
| `list_sources` | Data sources with freshness info |
| `check_data_freshness` | Staleness status and refresh command |
| `search_crop_requirements` | FTS5 search across crop and nutrient data |
| `get_nutrient_plan` | NPK recommendation for crop + soil type |
| `get_soil_classification` | Soil group and characteristics |
| `list_crops` | All crops, optionally by group |
| `get_crop_details` | Full crop profile with nutrient offtake |
| `get_commodity_price` | Latest price with source attribution |
| `calculate_margin` | Gross margin estimate |

See [TOOLS.md](TOOLS.md) for full parameter documentation.

## Security Scanning

This repository runs 6 security checks on every push:

- **CodeQL** -- static analysis for JavaScript/TypeScript
- **Gitleaks** -- secret detection across full history
- **Dependency review** -- via Dependabot
- **Container scanning** -- via GHCR build pipeline

See [SECURITY.md](SECURITY.md) for reporting policy.

## Disclaimer

This tool provides reference data for informational purposes only. It is not professional agricultural advice. Nutrient application norms (gebruiksnormen) are legally binding under the Meststoffenwet -- verify current norms at [rvo.nl](https://www.rvo.nl/onderwerpen/mest) before application. See [DISCLAIMER.md](DISCLAIMER.md).

## Contributing

Issues and pull requests welcome. For security vulnerabilities, email security@ansvar.eu (do not open a public issue).

## License

Apache-2.0. Data sourced from Dutch government publications (public domain) and WUR research data.
