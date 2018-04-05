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
    // zeros data in DB
    // TODO: not DRY, but calling external method breaks game, so leaving for now
    this.database.ref().set({
      p1: {
        name: '',
        wins: 0,
        losses: 0,
        choice: ''
      },
      p2: {
        name: '',
        wins: 0,
        losses: 0,
        choice: ''
      }
    });
  },
  initializeDataElements: function() {
    // if firebaseInUse is true, get from Firebase, else get from localStorage
    console.log('in dbInterface.initializeDataElements()');
    // this retrieves data initially and whenever it changes
    this.database.ref().on("value", function(snapshot) {
    
    //   const dataElementPath = 'snapshot.val().' + player + '.' + key;
    //   console.log('logging dataElementPath: ' + dataElementPath);

    // this dumps all values out
    // const player1 = snapshot.val().p1;
    // const player2 = snapshot.val().p2;
    rps.p1Name =  snapshot.val().p1.name;
    rps.p1Choice = snapshot.val().p1.choice;
    rps.p1Wins = snapshot.val().p1.wins;
    rps.p1Losses = snapshot.val().p1.losses;
    console.log('rps.p1Name is: ' + rps.p1Name);
    console.log('rps.p1Choice is: ' + rps.p1Choice);
    console.log('rps.p1Wins is: ' + rps.p1Wins);
    console.log('rps.p1Losses is: ' +  rps.p1Losses);
    rps.p2Name =  snapshot.val().p2.name;
    rps.p2Choice = snapshot.val().p2.choice;
    rps.p2Wins = snapshot.val().p2.wins;
    rps.p2Losses = snapshot.val().p2.Losses;
    console.log('rps.p2Name is: ' + rps.p2Name);
    console.log('rps.p2Choice is: ' + rps.p2Choice);
    console.log('rps.p2Wins is: ' + rps.p2Wins);
    console.log('rps.p2Losses is: ' +  rps.p2Losses);
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  },
  setDataElement: function(player, key, value) {
    // if firebaseInUse is true, write data to Firebase else write to localStorage
    console.log('in dbInterface.setDataElement()');
    console.log(player, key, value);
    // NOTE the [] around the 'key' variable!
    this.database.ref().child(player).update({[key]: value});
    console.log('set a value in the DB');
  },
  zeroPlayerData: function(player) {
    console.log('in zeroPlayerData');
    this.database.ref().child(player).update({
        name: '',
        wins: 0,
        losses: 0,
        choice: '' 
    });
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
      // TODO: not DRY; refactor
      dbInterface.setDataElement('p2', 'name', playerName);
      message = welcomePlayer(this.playerTwoName, 'p2');
      render(message, '#nameLand', 'empty');
      console.log('replacing welcome with name form');
      setTimeout(() => {
          render(makeNameInputForm(), '#nameLand', 'empty');
        }, 2000);
      // TODO fix this!
      message = makeInitialPlayerControls(this.playerTwoName, 'p2');
      render(message, '#second_player_info', 'empty');
      console.log('playerTwoName is: ' + this.playerTwoName);
    } else {
      this.playerOneName = playerName;
      dbInterface.setDataElement('p1', 'name', playerName);
      message = welcomePlayer(this.playerOneName, 'p1');
      render(message, '#nameLand', 'empty');
      console.log('replacing welcome with name form');
      setTimeout(() => {
          render(makeNameInputForm(), '#nameLand', 'empty');
        }, 2000);
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
  p1Name: '',
  p1Choice: '',
  p1Wins: 0,
  p1Losses: 0,
  p2Name: '',
  p2Choice: '',
  p2Wins: 0,
  p2Losses: 0,
  // TODO: many of these methods can probably be deleted 

  initializeP1Data: function() {
    dbInterface.zeroPlayerData('p1');
  },
  initializeP2Data: function() {
    dbInterface.zeroPlayerData('p2');
  },
  initializeGameData: function() {
    console.log('in rps.initializeGameData()')
    this.initializeP1Data();
    this.initializeP2Data();
    this.tieGames = 0;
  },
  incrementPlayerWins: function(player) {
    // increment player's wins
    if (player === 'p1') {
      this.p1Wins++;
      // TODO: write to DB
      console.log('player 1 has won: ' + this.p1Wins);
    } else {
      this.p2Wins++;
      // TODO: write to DB
      console.log('player 2 has won: ' + this.p2Wins);
    }
  },
  incrementPlayerLosses: function(player) {
    // increment player's losses
    if (player === 'p1') {
      this.p1Losses++;
      // TODO: write to DB
      console.log('player 1 has lost: ' + this.losses[0]);
    } else {
      this.p2Losses++;
      // TODO: write to DB
      console.log('player 2 has lost: ' + this.losses[0]);
    }
  },
  incrementTies: function() {
    this.tieGames++;
  },
  getPlayerWins: function(player) {
    // gets player's wins
    if (player === 'p1') {
      return this.p1Wins;
    } else {
      return this.p2Wins;
    }
  },
  getPlayerLosses: function(player) {
    // TODO get player's losses
  },
  getTieGames: function() {
    return this.tieGames;
  },
  // TODO delete?
  sendPlayerChoice: function(choice) {
    // sends player's choice to DB
    console.log('in sendPlayerChoice');
    // TODO: build this
  },

  // TODO: this is broken, or will be soon
  // DELETE instead?
  // retrievePlayerChoice: function(player) {
  //   // gets other player's choice from the DB
  //   // TODO: current dummy functionality
  //   if (player === 'p1') {
  //     // return this.p1Choice;
  //     const testVar = dbInterface.initializeDataElements('p1Choice');
  //     console.log('retrieved p1s choice from DB: ' + testVar);  
  //   } else {
  //     return this.p2Choice;
  //   }
  // },
  playRound: function() {
    // drives play of a round of RPS
    // triggered by second player making a choice
    // TODO: delete next 4 lines
    // const p1Choice = this.retrievePlayerChoice('p1', 'choice');
    //console.log('In playRound, p1Choice is ' + p1Choice);
    // const p2Choice = this.retrievePlayerChoice('p2', 'choice');
    //console.log('in playRound, p2Choice is ' + p2Choice);
    if ((rps.p1Choice === "rock") && (rps.p2Choice === "scissors")) {
        console.log('p1 wins!');
        this.incrementPlayerWins('p1');
        this.incrementPlayerLosses('p2');
    } else if ((rps.p1Choice === "rock") && (rps.p2Choice === "paper")) {
        console.log('p2 wins!');
        this.incrementPlayerWins('p2');
        this.incrementPlayerLosses('p1');

    } else if ((rps.p1Choice === "scissors") && (rps.p2Choice === "rock")) {
        console.log('p2 wins!');
        this.incrementPlayerWins('p2');
        this.incrementPlayerLosses('p1');
    } else if ((rps.p1Choice === "scissors") && (rps.p2Choice === "paper")) {
        console.log('p1 wins!');
        this.incrementPlayerWins('p1');
        this.incrementPlayerLosses('p2');

    } else if ((rps.p1Choice === "paper") && (rps.p2Choice === "rock")) {
        console.log('p1 wins!');
        this.incrementPlayerWins('p1');
        this.incrementPlayerLosses('p2');
    } else if ((rps.p1Choice === "paper") && (rps.p2Choice === "scissors")) {
        console.log('p2 wins!');
        this.incrementPlayerWins('p2');
        this.incrementPlayerLosses('p1');

    } else if (rps.p1Choice === rps.p2Choice) {
        console.log('it is a tie!');
        this.incrementTies();
    } else {
      console.log('something went badly wrong in rps.PlayRound');
    }
  },
  startPlay: function() {
    console.log('in rps.startPlay()');
    console.log('triggering setup of buttons now');
    // TODO: this may need to move to playRound
    this.showPlayerOneControls();
  },
  showPlayerOneControls: function() {
    const message = makePlayerControls(managePlayers.playerOneName,  
      "p1",
      this.p1Wins,
      this.p1Losses
     );
    render(message, '#first_player_info', 'empty');
  },
  showPlayerTwoControls: function() {
    const message = makePlayerControls(managePlayers.playerTwoName,  
      "p2",
      this.p2Wins,
      this.p2Losses
     );
    render(message, '#second_player_info', 'empty');
  }

  // TODO: continue adding methods as needed

} // end of rps definition

// GLOBAL FUNCTIONS
//===============================================================

const clickHandler = (e) => {
  console.log('in clickHandler');
  const clickTarget = e.target.className;
  switch (clickTarget) {
    case 'btn.btn-square btn-success ml-2 addPlayer':
      console.log('clicked on start button');
      e.defaultPrevented;
      const newPlayer = $('#player_name').val().trim();
      console.log('calling managePlayers.enterGame');
      // TODO: move to render()
      $('#player_name').val('');
      managePlayers.enterGame(newPlayer);
      break;
    // TODO: refactor to be more DRY? It's really wet!!!
    case 'rock p1' :
      console.log('p1 chose rock');
      dbInterface.setDataElement('p1', 'choice', 'rock');
      console.log('rps.p1Name is:' + rps.p1Name);
      message = makeInitialPlayerControls(rps.p1Name, 'p1');
      render(message, '#first_player_info', 'empty');
      rps.showPlayerTwoControls();
      break;
    case 'paper p1':
    console.log('p1 chose paper');
      dbInterface.setDataElement('p1', 'choice', 'paper');
      message = makeInitialPlayerControls(rps.p1Name, 'p1');
      render(message, '#first_player_info', 'empty');
      rps.showPlayerTwoControls();
      break;
    case 'scissors p1':
      console.log('p1 chose scissors');
      dbInterface.setDataElement('p1', 'choice', 'scissors');
      message = makeInitialPlayerControls(rps.p1Name, 'p1');
      render(message, '#first_player_info', 'empty');
      rps.showPlayerTwoControls();
      break;
    case 'rock p2' :
      console.log('p2 chose rock');
      dbInterface.setDataElement('p2', 'choice', 'rock');
      rps.playRound();
      break;
    case 'paper p2':
      console.log('p2 chose paper');
      dbInterface.setDataElement('p2', 'choice', 'paper');
      rps.playRound();
      break;
    case 'scissors p2':
      console.log('p2 chose scissors');
      dbInterface.setDataElement('p2', 'choice', 'scissors');
      rps.playRound();
      break;
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
  dbInterface.initializeDB();
  dbInterface.initializeDataElements();
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