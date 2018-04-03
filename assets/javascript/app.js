// APP.JS

// GLOBAL VARIABLES
//===============================================================
const dataElement = {
  // not sure this makes sense here
  key: '',
  value: ''
}

// GLOBAL OBJECTS
//===============================================================

// TODO
const chatInterface = {
  // provides functionality for the chat interface
}

// TODO
const dbInterface = {
  // provides single interface to Firebase and localStorage
  firebaseInUse: true,
  initializeDB: function () {
    // initializes database at start of game
    console.log('in dbInterface.initializeDB()');
  },
  getDataElement: function(key) {
    // if firebaseInUse is true, get from Firebase
    // else get from localStorage
    // and return it
    console.log('in rps.getDataElement()');
  },
  setDataElement: function(key, value) {
    /// if firebaseInUse is true, write data to Firebase
    // else write it to localStorage
    // return outcome
    console.log('in rps.setDataElement()');
  }
}

// TODO
const playerManagement = {
  // provides functionality for players to join and leave the game
}

// TODO
const rps = {
  // provides functionality for play of the game
  player_1_wins: ['p1', 0],
  player_1_losses: ['p1', 0],
  player_2_wins: ['p2', 0],
  player_2_losses: ['p2', 0],
  tie_games: 0,
  // TODO: add further properties
  initializeP1Data: function() {
    // TODO: refactor/simplify?
    this.player_1_wins[1] = 0;
    this.player_1_losses[1] = 0;
  },
  initializeP2Data: function() {
    // TODO: refactor/simplify?
    this.player_2_wins[1] = 0;
    this.player_2_losses[1] = 0;
  },
  initializeGameData: function() {
    console.log('in rps.initializeGameData()')
    // initializes both player's data
    this.initializeP1Data();
    this.initializeP2Data();
    this.tie_games = 0;
  },
  incrementPlayerWins: function(player) {
    // TODO increment player's wins
  },
  incrementPlayerLosses: function(player) {
    // TODO increment player's losses
  },
  getPlayerWins: function(player) {
    // TODO get player's wins
  },
  getPlayerLosses: function(player) {
    // TODO get player's losses
  },
  displayPlayerChoices: function() {
    // TODO builds rock paper scissors choice and sends to render
  },
  getPlayerChoice: function() {
    // TODO gets player's choice - rock, paper, scissors
    // and sends to DB
  },
  sendPlayerChoice: function() {
    // TODO sends player's choice to DB
  },
  retrievePlayerChoice: function() {
    // TODO: gets other player's choice from the DB
  },
  determineOutcome: function() {
    // TODO: compares player choices and decides who won
  },
  playRound: function() {
    // TODO: drives play of a round of RPS
  }

  // TODO: add methods to play rps

} // end of rps definition

// GLOBAL FUNCTIONS
//===============================================================

// TODO
const initializeGlobals = () => {
  // initializes global variables... if any
  console.log('in initializeGlobals');
  dbInterface.initializeDB()
  rps.initializeGameData();
}

const initializeDisplay = () => {
  // initializes display ... if needed
  console.log('in initializeDisplay');
}

const main = () => {
  // provides main game functionality
  console.log('in main()');
}

const render = (message, location, action) => {
  // intended to be sole interface to HTML page
  // writes message to location after taking action (if any)
  console.log('in render()');
}



// GAME
//===============================================================
$(document).ready(function() {
  console.log('starting');
  initializeGlobals();
  initializeDisplay();
  main();
})

