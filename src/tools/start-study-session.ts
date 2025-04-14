import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  CreateStudySessionInput,
  NextStudyCardResponse,
} from "../models/api.js";
import { StudySessionMeta } from "../models/models.js";
import { OwlClient } from "../owl-client.js";
import { err, text } from "./content.js";
import { renderCard } from "../models/render.js";

export function setupStartStudySessionTool(
  client: OwlClient,
  server: McpServer
) {
  server.tool(
    "start-study-session",
    "Start a study session for a deck",
    {
      deck_id: z
        .string()
        .optional()
        .describe("Optional deck ID to narrow the scope of the study session."),
    },
    async ({ deck_id }: CreateStudySessionInput) => {
      let url = "/study_sessions";
      if (deck_id) {
        url += `?deck_id=${deck_id}`;
      }

      const session = await client.makeRequest<
        StudySessionMeta & NextStudyCardResponse
      >(url, "POST");
      if (!session) return err("Unable to start study session");

      return text(
        `Study session started (ID: ${session.id})

        Card being studied is ${renderCard(session.card!)}

        Do not reveal the answer to the user. If it's a cloze occlusion, occlude
        the text between markers.`
      );
    }
  );
}
