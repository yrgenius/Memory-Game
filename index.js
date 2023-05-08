const moves = document.querySelector('#moves-count');
const timeValue = document.querySelector('#time');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const gameContainer = document.querySelector('.game-container');
const result = document.querySelector('#result');
const controls = document.querySelector('.controls-container');
let cards;
let interval;
let firstCard = false;
let secondCard = false;

const items = [
    { name: 'Chrome', image: "Chrome.ico" },
    { name: 'CCleaner', image: "CCleaner.ico" },
    { name: 'Facebook', image: "Facebook.ico" },
    { name: 'YouTube', image: "YouTube.ico" },
    { name: 'Yandex', image: "Yandex.ico" },
    { name: 'Twitter', image: "Twitter.ico" },
    { name: 'Opera', image: "Opera.ico" },
    { name: 'Skype', image: "Skype.ico" },
    { name: 'PotPlayer', image: "PotPlayer.ico" },
];

//initial time
let seconds = 0;
let minutes = 0;
//initial moves and win count
let movesCount = 0;
let winCount = 0;

//for timer
const timeGenerator = () => {
    seconds += 1;
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
}

//format time before displaying
let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;


//for calculating moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
}

//pick random objects from the items array
const generateRandom = (size = 4) => {
    // temp array
    let tempArray = [...items];
    //initializes cardValues array
    let cardValues = [];
    //size should be double (4*4 matrix)/2 since pairs of objects would exist
    size = (size * size) / 2;
    //random object selection
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //once selected remove
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
}

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = '';
    cardValues = [...cardValues, ...cardValues];
    //simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        //create cards
        //before => font side (contains question mark)
        //after => back side (contains actual image)
        //data-card-values is a castom attribute name
        gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="images/${cardValues[i].image}" class="image"/></div>
     </div>
     `;
    }


    //grid
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto )`;

    //cards
    cards = document.querySelectorAll('.card-container');
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('matched')) {
                card.classList.add('flipped');
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute('data-card-value');
                }
            }
            else {
                movesCounter();
                secondCard = card;
                let secondCardValue = card.getAttribute('data-card-value');
                if (firstCardValue == secondCardValue) {
                    firstCard.classList.add('matched');
                    secondCard.classList.add('matched');
                    firstCard = false;
                    winCount += 1;
                    if (winCount == Math.floor(cardValues.length / 2)) {
                        result.innerHTML = `
                        <h2>You Won</h2>
                        <h4>Movies: ${movesCount}</h4>
                        `;
                        stopGame();
                    }
                }
                else {
                    let [tempFirst, tempSecond] = [firstCard, secondCard];
                    firstCard = false;
                    secondCard = false;
                    let delay = setTimeout(() => {
                        tempFirst.classList.remove('flipped');
                        tempSecond.classList.remove('flipped');
                    }, 900);
                }
            }
        });
    });
}

startButton.addEventListener('click', () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    controls.classList.add('hide');
    stopButton.classList.remove('hide');
    startButton.classList.add('hide');
    //start timer
    interval = setInterval(timeGenerator, 1000);
    //initial moves
    moves.innerHTML = `<span>Moves: <span> ${movesCount}`;
    initializer();
});

//stop game
stopButton.addEventListener('click', (stopGame => {
    controls.classList.remove('hide');
    stopButton.classList.add('hide');
    startButton.classList.remove('hide');
    clearInterval(interval);
}));

//initialize values and func calls
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues); //del
    matrixGenerator(cardValues);
}

