class Round {
    constructor(numCardsPerPlayer, trumpSuit, dealer, players, numberOfTricks) {
        this.numCardsPerPlayer = numCardsPerPlayer;
        this.trumpSuit = trumpSuit;
        this.dealer = dealer;
        this.players = players;
        this.leadingPlayerIndex = (players.indexOf(dealer) + 1) % players.length;
        this.bids = {};
        this.tricks = [];
        this.numberOfTricks = numberOfTricks;
    }


    // Method to set bid for a player
    setBid(playerName, bid) {
        this.bids[playerName] = bid;
    }

    // Method to get bid for a player
    getBid(playerName) {
        return this.bids[playerName];
    }

    // Method to check if all players have placed their bids
    allBidsPlaced() {
        return Object.keys(this.bids).length === this.players.length;
    }

    // Method to get bids from players
getBids() {
    const bids = {};
    let totalBidsPlaced = 0;
    let currentPlayerIndex = this.leadingPlayerIndex;

    while (totalBidsPlaced < this.numberOfTricks) {
        const currentPlayer = this.players[currentPlayerIndex];

        // Determine if the current player is the dealer and if so, ensure they don't bid to make total bids equal to number of tricks
        if (currentPlayer === this.dealer && totalBidsPlaced === this.numberOfTricks - 1) {
            break; // Dealer cannot bid to make total bids equal to number of tricks
        }

        // Prompt the player to place their bid
        const bid = parseInt(prompt(`${currentPlayer.name}, enter your bid:`));

        // Validate the bid
        if (!isNaN(bid) && bid >= 0 && bid <= this.numberOfTricks - totalBidsPlaced) {
            // Record the bid
            bids[currentPlayer.name] = bid;
            totalBidsPlaced += bid;
            currentPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
        } else {
            // Handle invalid bid
            alert('Invalid bid. Please enter a number between 0 and ' + (this.numberOfTricks - totalBidsPlaced));
        }
    }

    return bids;
}


    // Method to play a trick
    playTrick() {
        const trick = [];
        let winningCard = null;
        let winningPlayer = null;

        // Each player plays one card
        for (let i = 0; i < this.players.length; i++) {
            const playerIndex = (this.leadingPlayerIndex + i) % this.players.length;
            const player = this.players[playerIndex];
            const card = player.playCard(this.tricks.length === 0 ? null : this.tricks[0][0].card.suit, this.trumpSuit);
            trick.push({ player: player.name, card });
            if (!winningCard || (card.suit === winningCard.suit && card.value > winningCard.value) ||
                (card.suit === this.trumpSuit && winningCard.suit !== this.trumpSuit)) {
                winningCard = card;
                winningPlayer = player;
            }
        }

        // Determine the winner of the trick
        this.tricks.push(trick);
        this.leadingPlayerIndex = this.players.indexOf(winningPlayer); // Update leading player index for next trick
        return winningPlayer;
    }

    // Method to score the round
    scoreRound() {
        let totalPoints = 0;
        for (const trick of this.tricks) {
            const winner = trick.find(item => item.player === this.determineHighestBid().player);
            if (winner) {
                const points = (winner.player === this.determineHighestBid().player) ? 10 + this.getBid(winner.player) : 1;
                totalPoints += points;
            }
        }
        return totalPoints;
    }

    // Method to determine the highest bid and the player who made it
    determineHighestBid() {
        let highestBid = -1;
        let highestBidder = null;
        for (const [player, bid] of Object.entries(this.bids)) {
            if (bid > highestBid) {
                highestBid = bid;
                highestBidder = player;
            }
        }
        return { player: highestBidder, bid: highestBid };
    }
}


