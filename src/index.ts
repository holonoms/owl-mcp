import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { DecksResponse, Card } from "./models.js";
import { z } from "zod";

// TODO: Get these from the .env file
const OWL_API_KEY = "owl-bf00d3718a903550172bea7d4d5a0cc8b4f706b4380cfcfc45d4fd6f6d2e";
const OWL_API_URL = "http://localhost:3000";

const server = new McpServer({
  name: "owl",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function makeOwlRequest<T>(url: string): Promise<T | null> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-Key": OWL_API_KEY,
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making request to the Owl API:", error);
    return null;
  }
}

server.tool("get-decks", "Get a list of decks from the user's account", {}, async () => {
  const decksUrl = `${OWL_API_URL}/decks`;
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

  const deckText = decksData.items.map((deck) => `${deck.title} (ID: ${deck.id}, ${deck.cards_count} cards, ${deck.completion_percentage}% complete)`).join("\n");

  return {
    content: [
      {
        type: "text",
        text: deckText,
      },
    ],
  };
});

server.tool(
  "get-deck-cards",
  "Get a list of cards from a specific deck",
  {
    deck_id: z.string().describe("The ID of the deck to get cards from"),
  },
  async ({ deck_id }) => {
    const cardsUrl = `${OWL_API_URL}/decks/${deck_id}/cards`;
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
        return `${cardType} Card (ID: ${card.id})\nFront: ${card.type === "BasicCard" ? card.front : card.text}\nState: ${state}\nStability: ${card.stability}\nDifficulty: ${card.difficulty}\nReps: ${
          card.reps
        }\nLapses: ${card.lapses}\nLast Reviewed: ${card.last_reviewed_at || "Never"}\nNext Review: ${card.next_review_at || "Not scheduled"}\n`;
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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Owl MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
