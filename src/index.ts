import { config } from "dotenv";

// Try .env then .env.local (latter overrides former)
config();
config({ path: ".env.local" });

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { Card, Deck } from "./models/models.js";
import {
  CreateCardInput,
  CreateDeckInput,
  CreateMultipleCardsInput,
  DecksResponse,
} from "./models/api.js";

const OWL_API_KEY = process.env.OWL_API_KEY;
const OWL_API_URL = process.env.OWL_API_URL;

if (!OWL_API_KEY || !OWL_API_URL) {
  throw new Error(
    "Missing required environment variables: OWL_API_KEY and/or OWL_API_URL"
  );
}

// After the check above, we know these are strings
const apiKey: string = OWL_API_KEY;
const apiUrl: string = OWL_API_URL;

const server = new McpServer({
  name: "owl",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function makeOwlRequest<T>(
  url: string,
  method: string = "GET",
  body?: unknown
): Promise<T | null> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(
      "Error making request to the Owl API:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

// MARK: Tools

server.tool(
  "get-decks",
  "Get a list of decks from the user's account",
  {},
  async () => {
    const decksUrl = `${apiUrl}/decks`;
    const decksData = await makeOwlRequest<DecksResponse>(decksUrl);

    if (!decksData) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve decks from the user's account.`,
          },
        ],
      };
    }

    const deckText = decksData.items
      .map(
        (deck) =>
          `${deck.title} (ID: ${deck.id}, ${deck.cards_count} cards, ${deck.completion_percentage}% complete)`
      )
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: deckText,
        },
      ],
    };
  }
);

server.tool(
  "get-deck-cards",
  "Get a list of cards from a specific deck",
  {
    deck_id: z.string().describe("The ID of the deck to get cards from"),
  },
  async ({ deck_id }) => {
    const cardsUrl = `${apiUrl}/decks/${deck_id}/cards`;
    const cardsData = await makeOwlRequest<Card[]>(cardsUrl);

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
        const state = card.state.charAt(0).toUpperCase() + card.state.slice(1);
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

    const deckUrl = `${apiUrl}/decks`;
    const deckData = await makeOwlRequest<Deck>(deckUrl, "POST", deckInput);

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

server.tool(
  "create-card",
  "Create a new card in a specific deck",
  {
    deck_id: z.string().describe("The ID of the deck to add the card to"),
    type: z
      .enum(["BasicCard", "ClozeCard"])
      .describe("The type of card to create"),
    front: z.string().optional().describe("The front text for a basic card"),
    back: z.string().optional().describe("The back text for a basic card"),
    text: z.string().optional().describe("The text for a cloze card"),
  },
  async ({ deck_id, type, front, back, text }) => {
    const cardInput: CreateCardInput =
      type === "BasicCard"
        ? { deck_id, type, front: front!, back: back! }
        : { deck_id, type, text: text! };

    const cardUrl = `${apiUrl}/decks/${deck_id}/cards`;
    const cardData = await makeOwlRequest<Card>(cardUrl, "POST", cardInput);

    if (!cardData) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to create card in deck ${deck_id}.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Successfully created ${type} in deck ${deck_id} with ID ${cardData.id}.`,
        },
      ],
    };
  }
);

server.tool(
  "create-cards",
  "Create multiple cards in a specific deck",
  {
    deck_id: z.string().describe("The ID of the deck to add the cards to"),
    cards: z
      .array(
        z.object({
          type: z
            .enum(["BasicCard", "ClozeCard"])
            .describe("The type of card to create"),
          front: z
            .string()
            .optional()
            .describe("The front text for a basic card"),
          back: z
            .string()
            .optional()
            .describe("The back text for a basic card"),
          text: z.string().optional().describe("The text for a cloze card"),
        })
      )
      .describe("Array of cards to create"),
  },
  async ({ deck_id, cards }) => {
    const cardsInput: CreateMultipleCardsInput = { deck_id, cards };

    const cardsUrl = `${apiUrl}/decks/${deck_id}/cards/batch`;
    const cardsData = await makeOwlRequest<Card[]>(
      cardsUrl,
      "POST",
      cardsInput
    );

    if (!cardsData) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to create cards in deck ${deck_id}.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Successfully created ${cardsData.length} cards in deck ${deck_id}.`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Owl MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
