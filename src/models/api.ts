import { BasicCard, ClozeCard, DeckId } from "./models.js";

export interface Cursor {
  page?: number;
  per_page?: number;
  /**
   * Sorting criteria. Can be a single string or an array of strings
   * representing model fields.
   *
   * For descending order, prefix field with - (e.g. "-created_at")
   */
  sort?: string[] | string;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_count: number;
}

export interface CreateBasicCardInput {
  deck_id: DeckId;
  type: BasicCard["type"];
  front: string;
  back: string;
}

export interface CreateClozeCardInput {
  deck_id: DeckId;
  type: ClozeCard["type"];
  text: string;
}

export type CreateMultipleCardsInput = {
  deck_id: DeckId;
  cards: Omit<CreateCardInput, "deck_id">[];
};

export type CreateCardInput = CreateBasicCardInput | CreateClozeCardInput;

export interface UpdateBasicCardInput {
  type?: BasicCard["type"];
  front?: string;
  back?: string;
}

export interface UpdateClozeCardInput {
  type?: ClozeCard["type"];
  text?: string;
}

export type UpdateCardInput = UpdateBasicCardInput | UpdateClozeCardInput;

export interface CreateDeckInput {
  title: string;
  description: string;
  public?: boolean;
  cards?: Array<Omit<CreateCardInput, "deck_id">>;
}
