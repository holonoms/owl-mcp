import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PaginatedResult } from "../models/api.js";
import { Deck } from "../models/models.js";
import { renderDeckList } from "../models/render.js";
import { OwlClient } from "../owl-client.js";
import { err, text } from "./content.js";

export function setupGetDecksTool(client: OwlClient, server: McpServer) {
  server.tool(
    "get-decks",
    "Get a list of decks from the user's account",
    {},
    async () => {
      const decksPage = await client.makeRequest<PaginatedResult<Deck>>(
        `/decks`
      );
      if (!decksPage) {
        return err("Failed to retrieve decks from the user's account.");
      }

      return text(renderDeckList(decksPage.items));
    }
  );
}
