import { BasicCard, ClozeCard, Deck, DeckId } from "./models.js";

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

export interface DecksResponse {
  items: Deck[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
  };
}
