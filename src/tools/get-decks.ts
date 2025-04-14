import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PaginatedResult } from "../models/api.js";
import { Deck } from "../models/models.js";
import { renderDeckList, renderPaginationData } from "../models/render.js";
import { CursorSchema } from "./schema.js";
import { OwlClient } from "../owl-client.js";
import { err, texts as multiText } from "./content.js";

export function setupGetDecksTool(client: OwlClient, server: McpServer) {
  server.tool(
    "get-decks",
    "Get a page of decks from the user's account.",
    CursorSchema.shape,
    async (cursor) => {
      try {
        const page = await client.makeRequest<PaginatedResult<Deck>>("/decks", {
          params: { ...cursor },
        });

        return multiText(
          renderPaginationData(page.pagination, "decks"),
          renderDeckList(page.items)
        );
      } catch (error) {
        return err(error, `Get decks (cursor: ${cursor})`);
      }
    }
  );
}
