import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { OwlClient } from "../owl-client.js";
import { err, text } from "./content.js";
import { ArchiveSchema, CardIdSchema, DeckIdSchema } from "./schema.js";

export function setupCardArchivalTool(
  client: OwlClient,
  server: McpServer
): void {
  server.tool(
    "set-card-archived",
    "Archive or unarchive a card. If archiving, let the user know that this card will no longer appear in future study sessions.",
    {
      deck_id: DeckIdSchema,
      card_id: CardIdSchema,
      archive: ArchiveSchema,
    },
    async ({ deck_id, card_id, archive }) => {
      try {
        const action = archive ? "archive" : "unarchive";
        await client.makeRequest(
          `/decks/${deck_id}/cards/${card_id}/${action}`,
          {
            method: "POST",
          }
        );

        return text(
          `Successfully ${
            archive ? "archived" : "unarchived"
          } card ${card_id} in deck ${deck_id}.`
        );
      } catch (error) {
        return err(
          error,
          `${
            archive ? "Archive" : "Unarchive"
          } card ${card_id} in deck ${deck_id}`
        );
      }
    }
  );
}
