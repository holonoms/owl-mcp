import { z } from "zod";

export const CursorSchema = z.object({
  page: z
    .number()
    .optional()
    .describe(
      "Page number, 1-indexed. Do NOT set this unless you are intentionally paginating through a list."
    ),
  per_page: z
    .number()
    .optional()
    .describe(
      "Number of items per page. Do NOT set this unless the user has explicitly requested a specific page size."
    ),
  sort: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe(
      "Sorting criteria. Can be a single string or an array of strings representing model fields. For descending order, prefix field with - (e.g. '-created_at'). Should not be set unless there's explicit user intent to sort differently from default."
    ),
});

export const CardIdSchema = z
  .string()
  .describe("The ID of the card for this tool call.");

export const CreateCardSchema = z.object({
  type: z
    .enum(["BasicCard", "ClozeCard"])
    .describe("The type of card to create"),
  front: z
    .string()
    .optional()
    .describe(
      "The front text for a basic card. Required if type is BasicCard."
    ),
  back: z
    .string()
    .optional()
    .describe("The back text for a basic card. Required if type is BasicCard."),
  text: z
    .string()
    .optional()
    .describe(
      "The text for a cloze card. Required if type is ClozeCard. To occlude a word, wrap it in {{curly braces}}."
    ),
});

export const UpdateCardSchema = z.object({
  type: z
    .enum(["BasicCard", "ClozeCard"])
    .optional()
    .describe("The type of card to update"),
  front: z.string().optional().describe("The front text for a basic card"),
  back: z.string().optional().describe("The back text for a basic card"),
  text: z
    .string()
    .optional()
    .describe(
      "The text for a cloze card. To occlude a word, wrap it in {{curly braces}}"
    ),
});

export const DeckIdSchema = z
  .string()
  .describe(
    "The ID of the deck for this tool call. If this is not clear, ask the user (understanding the user will give you an approximate name of the deck, rather than its ID)"
  );

export const CreateDeckSchema = z.object({
  title: z.string().describe("The title of the deck"),
  description: z.string().describe("A description of the deck"),
  public: z.boolean().optional().describe("Whether the deck should be public"),
  cards: z
    .array(CreateCardSchema)
    .optional()
    .describe("Optional array of cards to add to the deck"),
});

export const UpdateDeckSchema = z.object({
  title: z.string().optional().describe("The new title of the deck"),
  description: z.string().optional().describe("A new description of the deck"),
  public: z.boolean().optional().describe("Whether the deck should be public"),
});
