import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Card } from "../models/models.js";
import { renderCardList } from "../models/render.js";
import { DeckIdSchema } from "./schema.js";
import { OwlClient } from "../owl-client.js";
import { err, text } from "./content.js";

export function setupGetDeckCardsTool(client: OwlClient, server: McpServer) {
  server.tool(
    "get-deck-cards",
    "Get a list of cards from a specific deck.",
    {
      deck_id: DeckIdSchema,
    },
    async ({ deck_id }) => {
      try {
        const cardsData = await client.makeRequest<Card[]>(
          `/decks/${deck_id}/cards`
        );

        return text(renderCardList(cardsData));
      } catch (error) {
        return err(error, `Get cards from deck ${deck_id}`);
      }
    }
  );
}
