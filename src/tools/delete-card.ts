import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CardIdSchema, DeckIdSchema } from "./schema.js";
import { OwlClient } from "../owl-client.js";
import { err, text } from "./content.js";

export async function setupDeleteCardTool(
  client: OwlClient,
  server: McpServer
) {
  server.tool(
    "delete-card",
    "Delete a card from a specific deck. This action cannot be undone so ALWAYS ASK THE USER FOR CONFIRMATION BEFORE PROCEEDING WITH DELETION.",
    {
      deck_id: DeckIdSchema,
      card_id: CardIdSchema,
    },
    async ({ deck_id, card_id }) => {
      try {
        await client.makeRequest<void>(`/decks/${deck_id}/cards/${card_id}`, {
          method: "DELETE",
        });

        return text(
          `Successfully deleted card ${card_id} from deck ${deck_id}.`
        );
      } catch (error) {
        return err(error, `Delete card ${card_id} from deck ${deck_id}`);
      }
    }
  );
}
