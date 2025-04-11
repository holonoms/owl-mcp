import { BasicCard, ClozeCard, DeckId } from "./models.js";

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

export type CreateCardInput = CreateBasicCardInput | CreateClozeCardInput;

export interface CreateDeckInput {
  title: string;
  description: string;
  public?: boolean;
  cards?: Array<Omit<CreateCardInput, "deck_id">>;
}
