import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { OwlClient } from "./owl-client.js";
import { setupCreateCardTool } from "./tools/create-card.js";
import { setupCreateCardsTool } from "./tools/create-cards.js";
import { setupCreateDeckTool } from "./tools/create-deck.js";
import { setupEditCardTool } from "./tools/edit-card.js";
import { setupGetDeckCardsTool } from "./tools/get-deck-cards.js";
import { setupGetDecksTool } from "./tools/get-decks.js";
import { setupStartStudySessionTool } from "./tools/start-study-session.js";
import { setupSubmitCardReviewTool } from "./tools/submit-card-review.js";

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
  setupCreateCardTool(client, server);
  setupCreateCardsTool(client, server);
  setupStartStudySessionTool(client, server);
  setupSubmitCardReviewTool(client, server);
  setupEditCardTool(client, server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Owl MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
