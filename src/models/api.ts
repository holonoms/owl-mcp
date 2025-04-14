import {
  BasicCard,
  Card,
  ClozeCard,
  Deck,
  DeckId,
  GradePreviews,
} from "./models.js";

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

export interface CreateDeckInput {
  title: string;
  description: string;
  public?: boolean;
  cards?: Array<Omit<CreateCardInput, "deck_id">>;
}

export interface CreateStudySessionInput {
  deck_id?: DeckId;
}

export interface NextStudyCardResponse {
  card: Card | null;
  grade_previews: GradePreviews | null;
  cards_remaining: CardCountsByState;
}

export interface CardCountsByState {
  new: number;
  learning: number;
  review: number;
  relearning: number;
}
