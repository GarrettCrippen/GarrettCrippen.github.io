var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0; //A, 2 -> 11 +2

var hidden;
var deck;

var canHit = true;
var over = false;

//load and to restart game
window.onload = function(){
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck(){
    let values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    let types = ['C','D','H','S'];
    deck = [];

    for (let i =0; i<types.length; i++){
        for(let j=0; j<values.length; j++){
            deck.push(values[j]+'-'+types[i]); //a-c->k-c, a-d -> k-d
        }
    }
}

//make 52 swaps
function shuffleDeck(){
    for(let i =0; i<deck.length; i++){
        let j = Math.floor(Math.random()*deck.length); // (0-1)*52 [0,51]
        let temp = deck[i];
        deck[i]=deck[j];
        deck[j]=temp;
    }
    console.log(deck);
}

function startGame(){
    //give the dealer a face down card
    hidden = deck.pop();
    dealerSum += getValue(hidden);

    //give the dealer a face up card
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/"+card+".png";
    document.getElementById("dealer-cards").append(cardImg);

    dealerSum+=getValue(card);
    dealerAceCount+= checkAce(hidden);

    //deal the player two cards
    for(let i =0; i<2;i++){
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/"+card+".png";
        yourSum+= getValue(card);
        yourAceCount+=checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    //allow the player two controls
    document.getElementById("hit").addEventListener("click",hit);
    document.getElementById("stay").addEventListener("click",stay);

}

function hit(){
    //player can not hit if he exceeds 21
    if(!canHit){
        return;
    }
    
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/"+card+".png";
    yourSum+= getValue(card);
    yourAceCount+=checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    console.log("player hitting... %s",card)
    if(reduceAce(yourSum, yourAceCount) > 21){
        canHit = false;
    }
}

//return largest value of a hand thats below 21 or a value above 21
function reduceAce(playerSum,playerAceCount){
    while(playerSum > 21 && playerAceCount > 0){
        playerSum-=10;
        playerAceCount -=1;
    }
    return playerSum;
}

function stay(){

    if(over){
        return;
    }

    //compute hands for both players
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    win = false;

    //reveal dealer's hand
    document.getElementById("hidden").src = "./cards/"+hidden+".png";
    console.log("dealer reveals %s",hidden);

    //dealer hits and stands on 17
    while(dealerSum < 17 && dealerSum <= yourSum && yourSum <= 21){
        let cardImg = document.createElement("img");
        let card = deck.pop();
        console.log("dealer hitting... %s",card)

        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount +=checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    let message = "";
    if(yourSum > 21){
        message = "You Lose!"
    }
    else if (dealerSum > 21){
        message = "You Win!" 
        win = true;
    }
    else if (yourSum == dealerSum){
        message = "Tie!";
    }
    else if (yourSum > dealerSum){
        message = "You Win!";
        win = true;
    }
    else if ( yourSum < dealerSum){
        message = "You Lose!";
    }

    //output victory gif and restart button
    end = document.createElement('img');
    end.id = 'end';
    document.getElementById('your-cards').append(end);
    if(win){
    document.getElementById("end").src = "win.gif";}
    else{
        document.getElementById("end").src = "lose.gif";
    }
    
    restart = document.createElement('button');
    restart.textContent = 'Restart';
    restart.id = 'restart';

    document.getElementById("controls").appendChild(restart);
    document.getElementById("restart").addEventListener('click',restartB);

    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("results").innerText = message;

    over = true;
}

function restartB(){
    console.log("restarting...");
    window.location.reload();
}

function getValue(card){
    let data = card.split("-"); // "4-C" 4 is value and c is the type-> [4,C]
    let value = data[0];

    if(isNaN(value)){ //A J Q K
        if(value == "A"){
            return 11;
        }
        return 10;
    }

    return parseInt(value);
}

function checkAce(card){
    if (card[0] == 'A'){
        return 1;
    }
    else{
        return 0;
    }
}
