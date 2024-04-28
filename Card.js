class Card {
  constructor(value, suit, color) {
    this.suit = suit;
    this.value = value;
    this.color = null;
    if (suit === '♠' || suit === "♣") {
      this.color == "black";
    }
    if (suit === '♥' || suit === "♦") {
      this.color == "red";
    }
  }

  toString() {
    return `${this.value} ${this.suit}`;
  }
}