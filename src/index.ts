import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { OwlClient } from "./owl-client.js";
import { setupCreateCardTool } from "./tools/create-card.js";
import { setupCreateCardsTool } from "./tools/create-cards.js";
import { setupCreateDeckTool } from "./tools/create-deck.js";
import { setupGetDeckCardsTool } from "./tools/get-deck-cards.js";
import { setupGetDecksTool } from "./tools/get-decks.js";
import { updateCardTool as setupUpdateCardTool } from "./tools/update-card.js";
import { setupUpdateDeckTool } from "./tools/update-deck.js";
import { setupDeleteCardTool } from "./tools/delete-card.js";
import { setupDeleteDeckTool } from "./tools/delete-deck.js";
import { setupDeckArchivalTool as setupArchiveDeckTool } from "./tools/set-deck-archived.js";
import { setupCardArchivalTool as setupArchiveCardTool } from "./tools/set-card-archived.js";

async function main() {
  const apiKey = process.env.OWL_API_KEY;
  const baseUrl = process.env.OWL_API_URL;
  if (!apiKey || !baseUrl) {
    throw new Error(
      "Missing required environment variables: OWL_API_KEY and/or OWL_API_URL"
    );
  }

  const client = new OwlClient(apiKey, baseUrl);
  const server = new McpServer({
    name: "owl",
    version: "1.0.0",
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  setupGetDecksTool(client, server);
  setupGetDeckCardsTool(client, server);
  setupCreateDeckTool(client, server);
  setupUpdateDeckTool(client, server);
  setupDeleteDeckTool(client, server);
  setupArchiveDeckTool(client, server);
  setupCreateCardTool(client, server);
  setupCreateCardsTool(client, server);
  setupUpdateCardTool(client, server);
  setupDeleteCardTool(client, server);
  setupArchiveCardTool(client, server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Owl MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
