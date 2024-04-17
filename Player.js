class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
        this.points = 0;
    }

    // Method to add cards to the player's hand
    addCardsToHand(cards) {
        this.hand.push(...cards);
    }

    // Method to display the player's hand
    displayHand() {
        return this.hand.map(card => card.toString()).join(', ');
    }

    // Method to calculate and update the player's points
    calculatePoints() {
        // Implement your logic to calculate points based on the player's hand
    }

    // Method to play a card
    playCard(leadSuit, trumpSuit) {
        let playableCards = [];
        if (leadSuit) {
            playableCards = this.hand.filter(card => card.suit === leadSuit);
        }
        if (playableCards.length === 0) {
            playableCards = this.hand;
        }

        // Implement your logic to determine which card to play
        const index = Math.floor(Math.random() * playableCards.length);
        const card = playableCards[index];
        this.hand.splice(this.hand.indexOf(card), 1); // Remove the card from the player's hand
        return card;
    }
}