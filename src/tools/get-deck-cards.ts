import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { OwlClient } from "../owl-client.js";
import { Card } from "../models/models.js";
import { z } from "zod";

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
        return {
          content: [
            {
              type: "text",
              text: `Failed to retrieve cards from deck ${deck_id}.`,
            },
          ],
        };
      }

      const cardsText = cardsData
        .map((card) => {
          const cardType = card.type === "BasicCard" ? "Basic" : "Cloze";
          const state =
            card.state.charAt(0).toUpperCase() + card.state.slice(1);
          return `${cardType} Card (ID: ${card.id})\nFront: ${
            card.type === "BasicCard" ? card.front : card.text
          }\nState: ${state}\nStability: ${card.stability}\nDifficulty: ${
            card.difficulty
          }\nReps: ${card.reps}\nLapses: ${card.lapses}\nLast Reviewed: ${
            card.last_reviewed_at || "Never"
          }\nNext Review: ${card.next_review_at || "Not scheduled"}\n`;
        })
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: cardsText,
          },
        ],
      };
    }
  );
}
