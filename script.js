const gameContainer = document.getElementById("game");
const header = document.querySelector('.header')
const h1 = document.querySelector('h1')
const start = document.querySelector('#start');
const resetBtn = document.querySelector('#resetBtn');
let bestScoreNum = parseInt(localStorage.getItem('bestScore')) || 0;
const scorecard = document.createElement('h3');
const bestScoreEl = document.createElement('h3')

let flippedCount = 0;
let score = 0;
let firstCard = null;
let secondCard = null;
let noClick = false;
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];
resetBtn.style.display = 'none';
// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  if(noClick) {
    return;
  }
  // you can use event.target to see which element was clicked
  let currentCard = event.target;
  if (currentCard.classList.contains('flipped')) {
    return;
  }
  console.log("you just clicked", event.target);
  let color = currentCard.className
  currentCard.style.backgroundColor = color;

  if (!firstCard || !secondCard) {
    currentCard.classList.add('flipped')
    firstCard = firstCard || currentCard;
    secondCard = firstCard === currentCard ? null: currentCard;
  }

  if (firstCard && secondCard) {
    noClick = true;
    let class1 = firstCard.className
    let class2 = secondCard.className
    
    if (class1 === class2) {
      flippedCount += 2;
      score += 1;
      scorecard.innerText = `Score: ${score}`;;
      firstCard.removeEventListener('click', handleCardClick);
      secondCard.removeEventListener('click', handleCardClick);
      firstCard = null;
      secondCard = null;
      noClick = false;
    } else {
      setTimeout(function() {
        score += 1;
        scorecard.innerText = `Score: ${score}`;;
        firstCard.style.backgroundColor = ''
        secondCard.style.backgroundColor = ''
        firstCard.classList.remove('flipped')
        secondCard.classList.remove('flipped')
        firstCard = null;
        secondCard = null;
        noClick = false;
      }, 1000);
    }
  }
  if (flippedCount === COLORS.length) {
    if (score < bestScoreNum || bestScoreNum === 0){
      localStorage.setItem('bestScore', score)
      bestScoreNum = score;
      gameContainer.innerHTML = '';
      h1.innerText = 'Game Finished!';
      scorecard.innerText = 'New Best Score!'
      bestScoreEl.innerText = `Your Score: ${score}`
      resetBtn.style.display = '';
    } else {
      gameContainer.innerHTML = '';
      h1.innerText = 'Game Finished!';
      resetBtn.style.display = '';
    }
  }
}

function appendElement(referenceH1, newH3) {
  referenceH1.parentNode.insertBefore(newH3, referenceH1.nextSibling);
}



// when the DOM loads
start.addEventListener('click',function(){
  header.classList.remove('header')
  header.classList.add('start')
  createDivsForColors(shuffledColors);
  start.remove();
  scorecard.innerText = `Score: ${score}`;
  scorecard.classList.add('scores')
  appendElement(h1, scorecard);
  if (bestScoreNum !== 0) {
    bestScoreEl.innerText = `Best Score: ${bestScoreNum}`
    bestScoreEl.classList.add('scores')
    appendElement(scorecard, bestScoreEl)
  }
});

resetBtn.addEventListener('click', function() {
  createDivsForColors(shuffledColors);
  resetBtn.style.display = 'none';
  score = 0;
  flippedCount = 0;
  scorecard.innerText = `Score: ${score}`;
  h1.innerText = 'Memory Game!'
  // appendElement(h1, scorecard);
  if (bestScoreNum !== 0) {
    bestScoreEl.innerText = `Best Score: ${bestScoreNum}`
    appendElement(scorecard, bestScoreEl)
  }
});