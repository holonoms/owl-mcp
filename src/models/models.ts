export type UserId = string;

export type DeckId = string;
export interface Deck {
  id: DeckId;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  user_id: UserId;
  public: boolean;
  cards_count: number;
  cards_in_review_count: number;
  completion_percentage: number;
}

export type CardId = string;
interface BaseCard {
  id: CardId;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  state: CardState;
  last_reviewed_at: string | null;
  next_review_at: string | null;
  url: string;
  deck_id: DeckId;
  deck_title: string;
}

export type CardState = "new" | "learning" | "review" | "relearning";
export type ReviewGrade = "again" | "hard" | "good" | "easy";

export interface BasicCard extends BaseCard {
  type: "BasicCard";
  front: string;
  back: string;
}

export interface ClozeCard extends BaseCard {
  type: "ClozeCard";
  text: string;
}

export type Card = BasicCard | ClozeCard;

export type StudySessionId = string;
export interface StudySessionMeta {
  id: StudySessionId;
  created_at: string;
  finished_at: string | null;
  card_reviews_count: number;
  correct_reviews_count: number;
  deck_id?: DeckId;
  deck_title?: string;
}

export interface GradePreviews {
  again: GradePreview;
  hard: GradePreview;
  good: GradePreview;
  easy: GradePreview;
}

export interface GradePreview {
  interval_days: number;
}
