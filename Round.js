class Round {
    constructor(numCardsPerPlayer, trumpSuit, dealer, players, numberOfTricks) {
        this.numCardsPerPlayer = numCardsPerPlayer;
        this.trumpSuit = trumpSuit;
        this.dealer = dealer;
        this.players = players;
        this.leadingPlayerIndex = (players.indexOf(dealer) + 1) % players.length;
        this.currentPlayerIndex = this.leadingPlayerIndex;
        this.bids = {};
        this.tricks = [];
        this.numberOfTricks = numberOfTricks;
    }

    // Method to open the bid modal
    openBidModal() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const modalLabel = $('#bidModalLabel');
        modalLabel.text(currentPlayer.name + ', Enter Your Bid');
    
        // Check if the button already exists
        let showCardsButton = $('#showCardsButton');
        if (showCardsButton.length === 0) {
            // Create a button to display the player's cards
            showCardsButton = $('<button>').addClass('btn btn-primary').text('Show Me My Cards').attr('id', 'showCardsButton');
            showCardsButton.on('click', () => this.showPlayerCards(currentPlayer));
            const trumpSuitText = $('<p>').text('Trump Suit: ' + this.trumpSuit);
            modalLabel.after(trumpSuitText, showCardsButton);
        }
    
        $('#bidInput').val('');
        $('#bidModal').modal('show'); // Show modal
    }
    

   // Method to display the player's cards in a modal
showPlayerCards(player) {
    const handModalBody = $('#handModalBody');
    handModalBody.empty(); // Clear previous content

    // Display trump suit
    handModalBody.append(`<p>Trump Suit: ${this.trumpSuit}</p>`);

    // Display player's cards
    const cards = player.hand.map(card => `${card.value} of ${card.suit}`);
    const cardsList = $('<ul>').addClass('list-group');
    cards.forEach(card => {
        const listItem = $('<li>').addClass('list-group-item').text(card);
        cardsList.append(listItem);
    });

    handModalBody.append(cardsList);
    $('#handModal').modal('show'); // Show modal
}


    // // Function to handle bid submission
    // handleBidSubmit(event) {
    //     event.preventDefault(); // Prevent form submission

    //     const bid = parseInt(document.getElementById('bidInput').value);

    //     // Validate the bid
    //     if (!isNaN(bid) && bid >= 0 && bid <= this.numberOfTricks - totalBidsPlaced) {
    //         const currentPlayer = this.players[this.currentPlayerIndex];
    //         this.bids[currentPlayer.name] = bid;
    //         totalBidsPlaced += bid;
    //         this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    //         $('#bidModal').modal('hide'); // Hide modal
    //         if (totalBidsPlaced < this.numberOfTricks) {
    //             openBidModal(); // Open modal for the next player
    //         }
    //     } else {
    //         // Handle invalid bid
    //         alert('Invalid bid. Please enter a number between 0 and ' + (this.numberOfTricks - totalBidsPlaced));
    //     }
    // }


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
    this.currentPlayerIndex = this.leadingPlayerIndex;

    const self = this; // Preserve reference to Round object

    // Function to handle bid submission
    function handleBidSubmit(event) {
        event.preventDefault(); // Prevent form submission
        const bid = parseInt(document.getElementById('bidInput').value);
        // Validate the bid
        if (!isNaN(bid) && bid >= 0 && bid <= self.numberOfTricks - totalBidsPlaced) {
            const currentPlayer = self.players[self.currentPlayerIndex]; // Define currentPlayer here
            // Record the bid
            bids[currentPlayer.name] = bid;
            console.log(bids);
            totalBidsPlaced += bid;
            self.currentPlayerIndex = (self.currentPlayerIndex + 1) % self.players.length;
            $('#bidModal').modal('hide'); // Hide modal
            if (totalBidsPlaced < self.numberOfTricks) {
                self.openBidModal(); // Open modal for the next player
            }
        } else {
            // Handle invalid bid
            alert('Invalid bid. Please enter a number between 0 and ' + self.numberOfTricks);
        }
    }

    // Open bidding modal for the first player
    this.openBidModal();

    // Event listener for bid submission
    $('#bidForm').off('submit').on('submit', handleBidSubmit);

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


