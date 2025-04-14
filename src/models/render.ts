import { BasicCard, Card, ClozeCard, Deck } from "./models.js";

export function renderDeckList(decks: Deck[]): string {
  return decks.map((deck) => renderDeckMeta(deck)).join("\n");
}

export function renderDeckMeta(deck: Deck): string {
  return `${deck.title} (ID: ${deck.id}, ${deck.cards_count} cards, ${deck.completion_percentage}% learned)`;
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
  return `Basic Card (ID: ${card.id})\nFront: '${card.front}'\nBack: '${card.back}'`;
}

function renderClozeCard(card: ClozeCard): string {
  return `Cloze Card (ID: ${card.id})\nText: '${card.text}'`;
}
