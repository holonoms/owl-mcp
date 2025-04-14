import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CreateMultipleCardsInput } from "../models/api.js";
import { Card } from "../models/models.js";
import { CreateCardSchema, DeckIdSchema } from "./schema.js";
import { OwlClient } from "../owl-client.js";
import { err, text } from "./content.js";

export async function setupCreateCardsTool(
  client: OwlClient,
  server: McpServer
) {
  server.tool(
    "create-cards",
    "Create multiple cards in a specific deck",
    {
      deck_id: DeckIdSchema,
      cards: z.array(CreateCardSchema).describe("Array of cards to create"),
    },
    async ({ deck_id, cards }) => {
      const cardsInput: CreateMultipleCardsInput = { deck_id, cards };
      try {
        const cardsData = await client.makeRequest<Card[]>(
          `/decks/${deck_id}/cards/batch`,
          {
            method: "POST",
            body: cardsInput,
          }
        );

        return text(
          `Successfully created ${cardsData.length} cards in deck ${deck_id}.`
        );
      } catch (error) {
        return err(error, `Create cards in deck ${deck_id}`);
      }
    }
  );
}
