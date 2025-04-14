import { PaginationMeta } from "./api.js";
import { BasicCard, Card, ClozeCard, Deck } from "./models.js";

export function renderDeckList(decks: Deck[]): string {
  return decks.map((deck) => renderDeckMeta(deck)).join("\n");
}

export function renderDeckMeta(deck: Deck): string {
  const completionPct = Math.round(deck.completion_percentage);
  return `${deck.title} (ID: ${deck.id}, ${deck.cards_count} cards, ${completionPct}% learned)`;
}

export function renderCardList(cards: Card[]): string {
  return cards.map(renderCard).join("\n");
}

export function renderCard(card: Card): string {
  return card.type === "BasicCard"
    ? renderBasicCard(card)
    : renderClozeCard(card);
}

function renderBasicCard(card: BasicCard): string {
  return `Basic Card\n  ID: ${card.id}\n  Front: '${card.front}'\n  Back: '${card.back}'`;
}

function renderClozeCard(card: ClozeCard): string {
  return `Cloze Card\n  ID: ${card.id}\n  Text: '${card.text}'`;
}

export function renderPaginationData(
  pagination: PaginationMeta,
  label: string
): string {
  return `[Paginated result for ${label}: page ${pagination.current_page} of ${pagination.total_pages} (total items: ${pagination.total_count})]`;
}
