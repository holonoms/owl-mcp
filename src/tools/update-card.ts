import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Card } from "../models/models.js";
import { OwlClient } from "../owl-client.js";
import { err, text } from "./content.js";
import { CardIdSchema, DeckIdSchema, UpdateCardSchema } from "./schema.js";

export async function setupUpdateCardTool(
  client: OwlClient,
  server: McpServer
) {
  server.tool(
    "edit-card",
    "Edit an existing card in a specific deck.",
    {
      deck_id: DeckIdSchema,
      card_id: CardIdSchema,
      ...UpdateCardSchema.shape,
    },
    async ({ deck_id, card_id, type, front, back, text: cloze }) => {
      try {
        await client.makeRequest<Card>(`/decks/${deck_id}/cards/${card_id}`, {
          method: "PUT",
          body: {
            type,
            front,
            back,
            text: cloze,
          },
        });
        return text(`Successfully updated card ${card_id} in deck ${deck_id}.`);
      } catch (error) {
        return err(error, `Update card ${card_id} in deck ${deck_id}`);
      }
    }
  );
}
