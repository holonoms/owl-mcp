import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { NextStudyCardResponse } from "../models/api.js";
import { StudySessionMeta } from "../models/models.js";
import { OwlClient } from "../owl-client.js";
import { err, text } from "./content.js";
import { renderCard } from "../models/render.js";

export function setupSubmitCardReviewTool(
  client: OwlClient,
  server: McpServer
) {
  server.tool(
    "submit-card-review",
    "Submit a review for a card",
    {
      session_id: z.string().describe("The ID of the study session"),
      card_id: z.string().describe("The ID of the card to review"),
      grade: z
        .enum(["again", "hard", "good", "easy"])
        .describe(
          "The grade to submit for the card ('again' for incorrect answers or failure to recall, 'hard' for partial recollection with some effort, 'good' for good recollection, and 'easy' for trivial recollection."
        ),
    },
    async ({ session_id, card_id, grade }) => {
      const result = await client.makeRequest<
        StudySessionMeta & NextStudyCardResponse
      >(`/study_sessions/${session_id}/reviews`, "POST", {
        card_id,
        grade,
      });
      if (!result) return err("Unable to submit card review");

      if (result.card) {
        return text(
          `Review submited; next card being studied is: ${renderCard(
            result.card
          )}`
        );
      }

      return text(`Review submited; no more cards to study, session over.`);
    }
  );
}
