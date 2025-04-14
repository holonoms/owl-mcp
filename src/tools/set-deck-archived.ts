import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { OwlClient } from "../owl-client.js";
import { err, text } from "./content.js";
import { ArchiveSchema, DeckIdSchema } from "./schema.js";

export function setupDeckArchivalTool(
  client: OwlClient,
  server: McpServer
): void {
  server.tool(
    "set-deck-archived",
    "Archive or unarchive a deck. If archiving, let the user know that none of the cards in this deck will appear in future study sessions.",
    {
      deck_id: DeckIdSchema,
      archive: ArchiveSchema,
    },
    async ({ deck_id, archive }) => {
      try {
        const action = archive ? "archive" : "unarchive";
        await client.makeRequest(`/decks/${deck_id}/${action}`, {
          method: "POST",
        });

        return text(
          `Successfully ${archive ? "archived" : "unarchived"} deck ${deck_id}.`
        );
      } catch (error) {
        return err(
          error,
          `${archive ? "Archive" : "Unarchive"} deck ${deck_id}`
        );
      }
    }
  );
}
