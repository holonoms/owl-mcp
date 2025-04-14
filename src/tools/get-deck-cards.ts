import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { OwlClient } from "../owl-client.js";
import { Card } from "../models/models.js";
import { z } from "zod";
import { err, text } from "./content.js";
import { renderCardList } from "../models/render.js";

export function setupGetDeckCardsTool(client: OwlClient, server: McpServer) {
  server.tool(
    "get-deck-cards",
    "Get a list of cards from a specific deck",
    {
      deck_id: z.string().describe("The ID of the deck to get cards from"),
    },
    async ({ deck_id }) => {
      const cardsData = await client.makeRequest<Card[]>(
        `/decks/${deck_id}/cards`
      );

      if (!cardsData) {
        return err(`Failed to retrieve cards from deck ${deck_id}.`);
      }

      return text(renderCardList(cardsData));
    }
  );
}
