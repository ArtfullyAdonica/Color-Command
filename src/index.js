/**
 * DOM SELECTORS
 */
const startButton = document.querySelector(".js-start-button");
// Missing query selectors added:
const statusSpan = document.querySelector(".js-status");
const heading = document.querySelector(".js-heading");
const padContainer = document.querySelector(".js-pad-container");

/**
 * VARIABLES
 */
let computerSequence = []; // Track the computer-generated sequence of pad presses
let playerSequence = []; // Track the player-generated sequence of pad presses
let maxRoundCount = 0; // The max number of rounds, varies with the chosen level
let roundCount = 0; // Track the number of rounds that have been played so far

/**
 * PADS ARRAY
 */
const pads = [
  {
    color: "pink",
    selector: document.querySelector(".js-pad-pink"),
    sound: new Audio("../assets/simon-says-sound-1.mp3"),
  },
  {
    color: "purple",
    selector: document.querySelector(".js-pad-purple"),
    sound: new Audio("../assets/simon-says-sound-2.mp3"),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("../assets/simon-says-sound-3.mp3"),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("../assets/simon-says-sound-4.mp3"),
  },
];

/**
 * EVENT LISTENERS
 */
startButton.addEventListener("click", startButtonHandler);
padContainer.addEventListener("click", padHandler);

/**
 * EVENT HANDLERS
 */

/**
 * Called when the start button is clicked.
 *
 * 1. Call setLevel() to set the level of the game
 * 2. Increment the roundCount from 0 to 1
 * 3. Hide the start button by adding the `.hidden` class
 * 4. Unhide the status element, which displays the status messages
 * 5. Call `playComputerTurn()` to start the game with the computer going first.
 */
function startButtonHandler() {
  setLevel(1);
  roundCount = 1;
  startButton.classList.add("hidden");
  statusSpan.classList.remove("hidden");
  playComputerTurn();
}

/**
 * Called when one of the pads is clicked.
 *
 * 1. Extracts the value of `data-color` attribute and stores it in `color`
 * 2. If `color` is falsy, exit the function
 * 3. Find the pad in the `pads` array
 * 4. Play the pad's sound
 * 5. Call `checkPress(color)` to verify the player's selection
 */
function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;

  const pad = pads.find(p => p.color === color);
  pad.sound.play();
  checkPress(color);
  return color;
}

/**
 * HELPER FUNCTIONS
 */

/**
 * Sets the level of the game given a `level` parameter.
 * Returns the length of the sequence for a valid `level` parameter (1 - 4) or an error message otherwise.
 */
function setLevel(level = 1) {
  switch (level) {
    case 1:
      maxRoundCount = 8;
      break;
    case 2:
      maxRoundCount = 14;
      break;
    case 3:
      maxRoundCount = 20;
      break;
    case 4:
      maxRoundCount = 31;
      break;
    default:
      return "Please enter level 1, 2, 3, or 4";
  }
  return maxRoundCount;
}

/**
 * Sets the text content of a given HTML element with the specified text.
 */
function setText(element, text) {
  element.textContent = text;
}

/**
 * Activates a pad of a given color by playing its sound and lighting it up.
 */
function activatePad(color) {
  const pad = pads.find(p => p.color === color);
  pad.selector.classList.add("activated");
  pad.sound.play();

  setTimeout(() => {
    pad.selector.classList.remove("activated");
  }, 500);
}

/**
 * Activates a sequence of colors passed as an array to the function.
 */
function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activatePad(color);
    }, index * 600);
  });
}

/**
 * Allows the computer to play its turn.
 */
function playComputerTurn() {
  padContainer.classList.add("unclickable");
  setText(statusSpan, "The computer's turn...");
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);

  const randomColor = getRandomItem(pads).color;
  computerSequence.push(randomColor);

  activatePads(computerSequence);
  
  setTimeout(() => playHumanTurn(), roundCount * 600 + 1000);
}

/**
 * Allows the player to play their turn.
 */
function playHumanTurn() {
  padContainer.classList.remove("unclickable");
  setText(statusSpan, `Your turn: ${computerSequence.length - playerSequence.length} presses left`);
}

/**
 * Checks the player's selection every time the player presses a pad.
 */
function checkPress(color) {
  playerSequence.push(color);
  const index = playerSequence.length - 1;
  const remainingPresses = computerSequence.length - playerSequence.length;

  setText(statusSpan, `Your turn: ${remainingPresses} presses left`);

  if (computerSequence[index] !== playerSequence[index]) {
    resetGame("Game over! You made a mistake.");
    return;
  }

  if (remainingPresses === 0) {
    checkRound();
  }
}

/**
 * Checks each round to see if the player has completed all rounds or advances to the next round.
 */
function checkRound() {
  if (playerSequence.length === maxRoundCount) {
    resetGame("Congratulations! You won the game!");
  } else {
    roundCount++;
    playerSequence = [];
    setText(statusSpan, "Nice! Keep going!");
    setTimeout(playComputerTurn, 1000);
  }
}

/**
 * Resets the game to its original state.
 */
function resetGame(text) {
  computerSequence = [];
  playerSequence = [];
  roundCount = 0;
  alert(text);
  setText(heading, "Color Command");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");
}

/**
 * Returns a randomly selected item from a given array.
 */
function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

/**
 * Please do not modify the code below.
 * Used for testing purposes.
 */
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame;

