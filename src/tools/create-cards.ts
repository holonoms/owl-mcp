import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CreateCardInput, CreateMultipleCardsInput } from "../models/api.js";
import { Card } from "../models/models.js";
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
      deck_id: z.string().describe("The ID of the deck to add the cards to"),
      cards: z
        .array(
          z.object({
            type: z
              .enum(["BasicCard", "ClozeCard"])
              .describe("The type of card to create"),
            front: z
              .string()
              .optional()
              .describe("The front text for a basic card"),
            back: z
              .string()
              .optional()
              .describe("The back text for a basic card"),
            text: z.string().optional().describe("The text for a cloze card"),
          })
        )
        .describe("Array of cards to create"),
    },
    async ({ deck_id, cards }) => {
      const cardsInput: CreateMultipleCardsInput = { deck_id, cards };

      const cardsData = await client.makeRequest<Card[]>(
        `/decks/${deck_id}/cards/batch`,
        "POST",
        cardsInput
      );

      if (!cardsData) {
        return err(`Failed to create cards in deck ${deck_id}.`);
      }

      return text(
        `Successfully created ${cardsData.length} cards in deck ${deck_id}.`
      );
    }
  );
}
