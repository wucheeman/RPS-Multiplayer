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
  // currently only supports Firebase
  firebaseInUse: true,
  database: '',
  initializeDB: function () {
    // initializes database at start of game
    console.log('in dbInterface.initializeDB()');
    const config = {
      apiKey: "AIzaSyCO8AKA-sBxzIiQ5kO9P5NGYQbfOBkqpSY",
      authDomain: "rpsmultiplayer-b292e.firebaseapp.com",
      databaseURL: "https://rpsmultiplayer-b292e.firebaseio.com",
      projectId: "rpsmultiplayer-b292e",
      storageBucket: "rpsmultiplayer-b292e.appspot.com",
      messagingSenderId: "1035200309195"
    };
    firebase.initializeApp(config);
    this.database = firebase.database();
    // TODO: under construction; un comment when ready to go
    //this.removeExistingData();
    console.log('done initializing Firebase');
  },
  // TODO: under construction; un comment when ready to go
  // removeExistingData: function() {
  //   this.database.remove()
  // },
  getDataElement: function(key) {
    // if firebaseInUse is true, get from Firebase, else get from localStorage
    console.log('in dbInterface.getDataElement()');
    // this retrieves data initially and whenever it changes
    // TODO: determine how to use this beyond simply displaying it
    this.database.ref().on("value", function(snapshot) {
      console.log('logging snapshot.val().key: ' + snapshot.val().key);
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  },
  setDataElement: function(key, value) {
    /// if firebaseInUse is true, write data to Firebase
    // else write it to localStorage
    // return outcome
    console.log('in dbInterface.setDataElement()');
    // Note how we are using the Firebase .set() method
      this.database.ref().set({
        key: value
      });
    console.log('set a value in the DB');
  }
}

// TODO
const managePlayers = {
  // provides functionality for players to join and leave the game
  playerOneName: '',
  playerTwoName: '',
  addPlayer: function(playerName) {
    console.log('in managePlayers.addPlayer')
    let message = '';
    if (this.playerOneName) {
      this.playerTwoName = playerName;
      console.log('playerTwoName is: ' + this.playerTwoName);
    } else {
      this.playerOneName = playerName;
      message = welcomePlayer(this.playerOneName, 'p1');
      render(message, '#nameLand', 'empty');
      console.log('replacing welcome with name form');
      setTimeout(() => {
          render(makeNameInputForm(), '#nameLand', 'empty');
        }, 2000);
      // set timeout 
      message = makeInitialPlayerControls(this.playerOneName, 'p1');
      render(message, '#first_player_info', 'empty');
      console.log('playerOneName is: ' + this.playerOneName);
    }
  },
  enterGame: function(playerName) {
    // gets player set up and ready to play game
    this.addPlayer(playerName);
    if (this.playerOneName && this.playerTwoName) {
      console.log('two players present - start play');
      rps.startPlay();
    } else {
      console.log('only one player present - wait');
    }
  },
  leaveGame: function (player) {
    // initialize that player's data;
    // sends disconnect message in chat
    // TODO
  }
}

// TODO
const rps = {
  // provides functionality for play of the game
  // TODO: settle on best representaton of these data
  wins: [0, 0],
  losses: [0, 0],
  tieGames: 0,
  choices: ['rock', 'paper', 'scissors'],
  p1Choice: '',
  p2Choice: '',
  // TODO: add further properties
  initializeP1Data: function() {
    // TODO: refactor/simplify?
    this.wins[0] = 0;
    this.losses[0] = 0;
    this.p1Choice = '';
  },
  initializeP2Data: function() {
    // TODO: refactor/simplify?
    this.wins[1] = 0;
    this.losses[1] = 0;
    this.p2Choice = '';
  },
  initializeGameData: function() {
    console.log('in rps.initializeGameData()')
    // initializes both player's data
    this.initializeP1Data();
    this.initializeP2Data();
    this.tieGames = 0;
  },
  incrementPlayerWins: function(player) {
    // increment player's wins
    if (player === 'p1') {
      this.wins[0]++;
      console.log('player 1 has won: ' + this.wins[0]);
    } else {
      this.wins[1]++;
      console.log('player 2 has won: ' + this.wins[0]);
    }
  },
  incrementPlayerLosses: function(player) {
    // increment player's losses
    if (player === 'p1') {
      this.losses[0]++;
      console.log('player 1 has lost: ' + this.losses[0]);
    } else {
      this.wins[1]++;
      console.log('player 2 has lost: ' + this.losses[0]);
    }
  },
  incrementTies: function() {
    this.tieGames++;
  },
  getPlayerWins: function(player) {
    // gets player's wins
    if (player === 'p1') {
      return this.wins[0];
    } else {
      return this.wins[1];
    }
  },
  getPlayerLosses: function(player) {
    // TODO get player's losses
  },
  getTieGames: function() {
    return this.tieGames;
  },
  // TODO: delete
  // displayPlayerChoices: function() {
  //   // TODO builds rock paper scissors choice and sends to render
  // },
  // TODO: on.click takes care of this: delete
  // getPlayerChoice: function(player) {
  //   // TODO gets player's choice - rock, paper, scissors
  //   // and sends to DB
  // },
  sendPlayerChoice: function(choice) {
    // sends player's choice to DB
    console.log('in sendPlayerChoice');
    // TODO: build this
  },
  retrievePlayerChoice: function(player) {
    // gets other player's choice from the DB
    // TODO: current dummy functionality
    if (player === 'p1') {
      // return this.p1Choice;
      const testVar = dbInterface.getDataElement('p1Choice');
      console.log('retrieved p1s choice from DB: ' + testVar);  
    } else {
      return this.p2Choice;
    }
  },
  playRound: function() {
    // drives play of a round of RPS
    // TODO: need some trigger to set this off
    const p1Choice = this.retrievePlayerChoice('p1');
    //console.log('In playRound, p1Choice is ' + p1Choice);
    const p2Choice = this.retrievePlayerChoice('p2');
    //console.log('in playRound, p2Choice is ' + p2Choice);
    if ((p1Choice === "rock") && (p2Choice === "scissors")) {
        console.log('p1 wins!');
        this.incrementPlayerWins('p1');
        this.incrementPlayerLosses('p2');
    } else if ((p1Choice === "rock") && (p2Choice === "paper")) {
        console.log('p2 wins!');
        this.incrementPlayerWins('p2');
        this.incrementPlayerLosses('p1');

    } else if ((p1Choice === "scissors") && (p2Choice === "rock")) {
        console.log('p2 wins!');
        this.incrementPlayerWins('p2');
        this.incrementPlayerLosses('p1');
    } else if ((p1Choice === "scissors") && (p2Choice === "paper")) {
        console.log('p1 wins!');
        this.incrementPlayerWins('p1');
        this.incrementPlayerLosses('p2');

    } else if ((p1Choice === "paper") && (p2Choice === "rock")) {
        console.log('p1 wins!');
        this.incrementPlayerWins('p1');
        this.incrementPlayerLosses('p2');
    } else if ((p1Choice === "paper") && (p2Choice === "scissors")) {
        console.log('p2 wins!');
        this.incrementPlayerWins('p2');
        this.incrementPlayerLosses('p1');

    } else if (p1Choice === p2Choice) {
        console.log('it is a tie!');
        this.incrementTies();
    }
  },
  startPlay: function() {
    console.log('in rps.startPlay()');
    console.log('triggering setup of buttons now');
    // TODO: this may need to move to playRound
    let message = makePlayerControls(managePlayers.playerOneName,  
                                     "p1",
                                     this.wins[0],
                                     this.losses[0]);
    render(message, '#first_player_info', 'empty');
    console.log('pinging the DB: ' + rps.retrievePlayerChoice("p1"));
  }

  // TODO: continue adding methods as needed

} // end of rps definition

// GLOBAL FUNCTIONS
//===============================================================

// TODO

const clickHandler = (e) => {
  const clickTarget = e.target.className;
  switch (clickTarget) {
    case 'btn.btn-square btn-success ml-2 addPlayer':
      console.log('clicked on start button');
      e.defaultPrevented;
      const newPlayer = $('#player_name').val();
      console.log('calling managePlayers.enterGame');
      // TODO: move to render()
      $('#player_name').val('');
      managePlayers.enterGame(newPlayer);
      break;
    // TODO: enhance to cover both players?
    case 'rock p1' :
      console.log('p1 chose rock');
      dbInterface.setDataElement('p1Choice', 'rock');
      break;
    case 'paper p1':
    console.log('p1 chose paper');
      dbInterface.setDataElement('p1Choice', 'paper');
      break;
    case 'scissors p1':
      console.log('p1 chose scissors');
      dbInterface.setDataElement('p1Choice', 'scissors');
      break;
    // case <value 3> :
    //     code to be executed if <variable> has <value 3>
    //     break;
    // //...
    // case <value n> :
    //     code to be executed if <variable> has <value n>
    //     break;
    // //...
    default:
      console.log('user clicked in unsupported region');
  }
}

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
  $(document).on('click', clickHandler);
}

const render = (message, location, action) => {
  // intended to be sole interface to HTML page.
  // updates screen at location with contents of imgElements after taking
  // the action, if one is specified;
  // writes message to location after taking action (if any)
  console.log('in render()');
  // currently, only supports emptying the location
  if (action) {
      $(location).empty();
  }
  // TODO: this may need update
  $(location).append(message);
}

// GAME
//===============================================================
$(document).ready(function() {
  console.log('starting app.js');
  initializeGlobals();
  initializeDisplay();
  main();
});