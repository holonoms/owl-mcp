import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DeckIdSchema } from "./schema.js";
import { OwlClient } from "../owl-client.js";
import { err, text } from "./content.js";

export async function setupDeleteDeckTool(
  client: OwlClient,
  server: McpServer
) {
  server.tool(
    "delete-deck",
    "Delete a deck and all its cards. This action cannot be undone so ALWAYS ASK THE USER FOR CONFIRMATION BEFORE PROCEEDING WITH DELETION.",
    {
      deck_id: DeckIdSchema,
    },
    async ({ deck_id }) => {
      try {
        await client.makeRequest<void>(`/decks/${deck_id}`, {
          method: "DELETE",
        });

        return text(`Successfully deleted deck ${deck_id}.`);
      } catch (error) {
        return err(error, `Delete deck ${deck_id}`);
      }
    }
  );
}
