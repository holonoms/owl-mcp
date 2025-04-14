import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { OwlClient } from "../owl-client.js";
import { z } from "zod";
import { CreateDeckInput } from "../models/api.js";
import { Deck } from "../models/models.js";

export async function setupCreateDeckTool(
  client: OwlClient,
  server: McpServer
) {
  server.tool(
    "create-deck",
    "Create a new deck with optional cards",
    {
      title: z.string().describe("The title of the deck"),
      description: z.string().describe("A description of the deck"),
      public: z
        .boolean()
        .optional()
        .describe("Whether the deck should be public"),
      cards: z
        .array(
          z.object({
            type: z.enum(["BasicCard", "ClozeCard"]),
            front: z.string().optional(),
            back: z.string().optional(),
            text: z.string().optional(),
          })
        )
        .optional()
        .describe("Optional array of cards to add to the deck"),
    },
    async ({ title, description, public: isPublic, cards }) => {
      const deckInput: CreateDeckInput = {
        title,
        description,
        public: isPublic,
        cards,
      };

      const deckData = await client.makeRequest<Deck>(
        `/decks`,
        "POST",
        deckInput
      );

      if (!deckData) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to create deck "${title}".`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Successfully created deck "${deckData.title}" with ID ${deckData.id}.`,
          },
        ],
      };
    }
  );
}
