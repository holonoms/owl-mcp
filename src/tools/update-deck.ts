import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Deck } from "../models/models.js";
import { DeckIdSchema, UpdateDeckSchema } from "./schema.js";
import { OwlClient } from "../owl-client.js";
import { err, text } from "./content.js";

export async function setupUpdateDeckTool(
  client: OwlClient,
  server: McpServer
) {
  server.tool(
    "update-deck",
    "Update an existing deck's properties.",
    {
      deck_id: DeckIdSchema,
      ...UpdateDeckSchema.shape,
    },
    async ({ deck_id, title, description, public: isPublic }) => {
      try {
        const deckData = await client.makeRequest<Deck>(`/decks/${deck_id}`, {
          method: "PUT",
          body: {
            title,
            description,
            public: isPublic,
          },
        });

        return text(
          `Successfully updated deck "${deckData.title}" with ID ${deckData.id}.`
        );
      } catch (error) {
        return err(error, `Update deck with ID ${deck_id}`);
      }
    }
  );
}
