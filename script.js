//
//Blackjack
//by Ahmed Marzook
//FEATURES TO ADD:
//

//Card Variables
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'],
    values = ['Ace', 'King', 'Queen', 'Jack', 
    'Ten', 'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two'];

//DOM (Document Object Model) Variables
let textArea = document.getElementById('text-area');
let newGameButton = document.getElementById('new-game-button');
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');

//Game Variables initialized
let gameStarted =false,
    gameOver = false,
    playerWon = false,
    playerDraw = false,
    dealerCards = [],
    playerCards = [],
    deck = [],
    dealerScore = 0,
    playerScore = 0;

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

//Initilizing new Game with new values
newGameButton.addEventListener('click', function(){
  textArea.innerText = 'Started....';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  newGameButton.style.display = 'none';
  //restarting values
  gameStarted = true;
  gameOver = false;
  playerWon = false;
  //gettingnew deck and new Hand
  deck = createDeck();
  dealerCards = [getNextCard(), getNextCard()]
  playerCards = [getNextCard(), getNextCard()]
  //updating Screen
  showStatus();
})

//When hitbutton clicked gives player new card
hitButton.addEventListener('click', function() {
  playerCards.push(getNextCard());
  //Check if the player goes over score of 21 if they do Dealer wins
  checkForEndOfGame();
  //Updates player screen
  showStatus();
});
//Game has stopped and check to see if the game has ended
stayButton.addEventListener('click', function() {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

//Creating a new deck and returnign it shuffled
function createDeck(){
    let deck = [];
    for (let suitIdx = 0; suitIdx<suits.length; suitIdx++){
        for (let valueIdx = 0; valueIdx<values.length; valueIdx++){
            let card = {
              suit: suits[suitIdx],
              value: values[valueIdx]
            };
            deck.push(card);
        }
    }
    return shuffle(deck);
}
//Even more shuffling to give random new card
function getNextCard(){
   let random = Math.trunc(Math.random() * deck.length);
   let card = deck[random];
   deck.splice(random, 1);
   return card;
}
//Converting Card into String
function getCardString(card){
  return card.value + ' of ' + card.suit;
}

function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

//Calculate how much each Card is worth
function getCardNumericValue(card) {
  switch(card.value) {
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five': 
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
    //King, Queen and Jack are default 10 score
      return 10;
  }
}

//Get the total score of each deck
function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  //goes through card array calculating the score
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'Ace') {
      hasAce = true;
    }
  }
  /*
  A hand with an ace valued as 11 is called "soft", meaning that the hand will not 
  bust by taking an additional card; the value of the ace 
  will become one to prevent the hand from exceeding 21. Otherwise, the hand is "hard".
  */
  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}
//updating the dealer score and the player score
function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function showStatus() {
  if(!gameStarted) {
    textArea.innerText = 'Welcome to Blackjack!';
    return;
  }
  //Converting the deck from Array to readable String
  let dealerCardString = '';
  for (let i=0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  }
  
  let playerCardString = '';
  for (let i=0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + '\n';
  }
  //Updating scores
  updateScores();
  //Updating text Area
  textArea.innerText = 
    'Dealer has:\n' +
    dealerCardString + 
    '(score: '+ dealerScore  + ')\n\n' +
    
    'Player has:\n' +
    playerCardString +
    '(score: '+ playerScore  + ')\n\n';
    //IF the game is over change the main text area
    if (gameOver) {
    if (playerWon) {
      textArea.innerText += "YOU WIN!";
    }
    else if(playerDraw){
      textArea.innerText += "YOU DRAW!";
    } 
    else {
      textArea.innerText += "DEALER WINS";
    }
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }
}

function checkForEndOfGame() {
  //get the latest Scores
  updateScores();
  //if the player has clicked Stay
  if (gameOver) {
    // let dealer take cards
    //if the dealer and the player have less the 21 score and the dealer score is less then 21
    //it will keep giving the dealer a card till the conditions are not met
    while(dealerScore < playerScore 
          && playerScore <= 21 
          && dealerScore <= 21) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }
  //if player score is greater then 21 automatic loss
  if (playerScore > 21) {
    playerWon = false;
    gameOver = true;
  }
  //dealer score above 21 dealer loss
  else if (dealerScore > 21) {
    playerWon = true;
    gameOver = true;
  }
  //if game over check to see if the dealer or player won and who has the higher score
  else if (gameOver) {
    if(playerScore === dealerScore){
      playerDraw = true;
      playerWon = false;
    }
    else if (playerScore > dealerScore) {
      playerWon = true;
    }
    else {
      playerWon = false;
    }
  }
}

// let deck = createDeck();

// let playerCards = [ getNextCard(), getNextCard() ];
    
// console.log("Welcome to Blackjack!");

// console.log("You are dealt: ");
// console.log("  " + getCardString(playerCards[0]));
// console.log("  " + getCardString(playerCards[1]));
