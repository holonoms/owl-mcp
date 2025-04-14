import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CreateCardInput } from "../models/api.js";
import { Card } from "../models/models.js";
import { OwlClient } from "../owl-client.js";
import { err, text } from "./content.js";

export async function setupCreateCardTool(
  client: OwlClient,
  server: McpServer
) {
  server.tool(
    "create-card",
    "Create a new card in a specific deck",
    {
      deck_id: z.string().describe("The ID of the deck to add the card to"),
      type: z
        .enum(["BasicCard", "ClozeCard"])
        .describe("The type of card to create"),
      front: z.string().optional().describe("The front text for a basic card"),
      back: z.string().optional().describe("The back text for a basic card"),
      text: z.string().optional().describe("The text for a cloze card"),
    },
    async ({ deck_id, type, front, back, text: cloze }) => {
      const cardInput: CreateCardInput =
        type === "BasicCard"
          ? { deck_id, type, front: front!, back: back! }
          : { deck_id, type, text: cloze! };

      const cardData = await client.makeRequest<Card>(
        `/decks/${deck_id}/cards`,
        "POST",
        cardInput
      );

      if (!cardData) {
        return err(`Failed to create card in deck ${deck_id}.`);
      }

      return text(
        `Successfully created ${type} in deck ${deck_id} with ID ${cardData.id}.`
      );
    }
  );
}
