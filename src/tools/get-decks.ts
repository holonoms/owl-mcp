import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DecksResponse } from "../models/api.js";
import { OwlClient } from "../owl-client.js";

export function setupGetDecksTool(client: OwlClient, server: McpServer) {
  server.tool(
    "get-decks",
    "Get a list of decks from the user's account",
    {},
    async () => {
      const decksData = await client.makeRequest<DecksResponse>(`/decks`);

      if (!decksData) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to retrieve decks from the user's account.`,
            },
          ],
        };
      }

      const deckText = decksData.items
        .map(
          (deck) =>
            `${deck.title} (ID: ${deck.id}, ${deck.cards_count} cards, ${deck.completion_percentage}% complete)`
        )
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: deckText,
          },
        ],
      };
    }
  );
}
