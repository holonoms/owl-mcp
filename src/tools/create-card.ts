import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CreateCardInput } from "../models/api.js";
import { Card } from "../models/models.js";
import { CreateCardSchema, DeckIdSchema } from "./schema.js";
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
      deck_id: DeckIdSchema,
      ...CreateCardSchema.shape,
    },
    async ({ deck_id, type, front, back, text: cloze }) => {
      const cardInput: CreateCardInput =
        type === "BasicCard"
          ? { deck_id, type, front: front!, back: back! }
          : { deck_id, type, text: cloze! };

      try {
        const cardData = await client.makeRequest<Card>(
          `/decks/${deck_id}/cards`,
          {
            method: "POST",
            body: cardInput,
          }
        );

        return text(
          `Successfully created ${type} in deck ${deck_id} with ID ${cardData.id}.`
        );
      } catch (error) {
        return err(error, `Create card in deck ${deck_id}`);
      }
    }
  );
}
