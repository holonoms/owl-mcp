import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Deck } from "../models/models.js";
import { CreateCardSchema, CreateDeckSchema } from "./schema.js";
import { OwlClient } from "../owl-client.js";
import { err, text } from "./content.js";

export async function setupCreateDeckTool(
  client: OwlClient,
  server: McpServer
) {
  server.tool(
    "create-deck",
    "Create a new deck with optional cards",
    CreateDeckSchema.shape,
    async (createDeckInput) => {
      try {
        const deckData = await client.makeRequest<Deck>(`/decks`, {
          method: "POST",
          body: createDeckInput,
        });

        return text(
          `Successfully created deck "${deckData.title}" with ID ${deckData.id}.`
        );
      } catch (error) {
        return err(error, `Create deck "${createDeckInput.title}"`);
      }
    }
  );
}
