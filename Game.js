class Game {
    constructor(players, numCardsPerPlayer, trumpSuit, numberOfRounds) {
        this.players = players;
        this.numCardsPerPlayer = numCardsPerPlayer;
        this.trumpSuit = trumpSuit;
        this.numberOfRounds = numberOfRounds;
        this.deck = this.createDeck();
        this.rounds = [];
    }

    // Method to create a deck of cards
    createDeck() {
        const deck = [];
        const suits = ['Hearts ❤️', 'Diamonds ♦️', 'Clubs ♣️', 'Spades ♠️'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

        suits.forEach(suit => {
            values.forEach(value => {
                deck.push(new Card(value, suit));
            });
        });

        return deck;
    }


    // Method to start the game
start() {
    // Shuffle the deck
    this.shuffleDeck();

    // Deal cards to players
    for (const player of this.players) {
        const cards = this.deck.splice(0, this.numCardsPerPlayer);
        player.addCardsToHand(cards);
    }

    // Play rounds
    for (let i = 0; i < this.numberOfRounds; i++) {
        const dealer = this.players[i % this.players.length]; // Cycle through players to determine dealer for each round
        const round = new Round(this.numCardsPerPlayer, this.trumpSuit, dealer, this.players, 10); // Example value for numberOfTricks
        this.rounds.push(round);
        round.getBids(); // Start the bidding process for the round
    }

    // End of game logic
}

// Method to shuffle the deck
shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
}


// Method to handle the bidding process for a round
getBidsForRound(roundNumber, trumpSuit) {
    // Iterate over each player
    this.players.forEach((player, index) => {
        // Display the current round information
        const roundInfo = `Current Player: ${player.name}<br>Round: ${roundNumber}<br>Trump Suit: ${trumpSuit}`;
        UIDIV.innerHTML = roundInfo;

        // Create a button to show the current player's hand
        const handButton = document.createElement('button');
        handButton.textContent = "Look at your cards";
        handButton.addEventListener('click', () => {
            const modalContent = player.hand.join(', '); // Assuming player's hand is an array of card names
            $('#handModalBody').html(modalContent);
            $('#handModal').modal('show');
        });
        UIDIV.appendChild(handButton);

        // Create a numerical input and a submit button for placing bids
        const bidForm = document.createElement('form');
        const bidInput = document.createElement('input');
        bidInput.type = 'number';
        bidInput.id = 'bidInput';
        bidInput.min = '0';
        bidInput.required = true;
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.type = 'submit';

        // Handle bid submission
        bidForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const bid = parseInt(document.getElementById('bidInput').value);
            // Handle bid validation and processing here
            console.log(`${player.name}'s bid:`, bid);
        });

        bidForm.appendChild(bidInput);
        bidForm.appendChild(submitButton);
        UIDIV.appendChild(bidForm);
    });
}


    // Method to play a round
    playRound(round) {
        // Implement your logic to play a round
    }
}
