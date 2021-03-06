// APP.JS

// GLOBAL VARIABLES
//===============================================================
let winner;

// GLOBAL OBJECTS
//===============================================================

// TODO
const chatInterface = {
  message: '',
  sendChatMessage: function(newMessage) {
    //console.log('got message: ' + newMessage);
    dbInterface.storeChatMessage(newMessage);
    messageForRender = makeChatMessageForDisplay(this.message);
    render(messageForRender, ".chatLand");
  }
}

const dbInterface = {
  // provides single interface to Firebase
  firebaseInUse: true,
  database: '',
  initializeDB: function () {
    // initializes database at start of game
    //console.log('in dbInterface.initializeDB()');
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
  },
  initializeDataElements: function() {
    //console.log('in dbInterface.initializeDataElements()');
    // this retrieves data initially and whenever it changes
    this.database.ref().on("value", function(snapshot) {
    rps.p1Name =  snapshot.val().p1.name;
    rps.p1Choice = snapshot.val().p1.choice;
    rps.p1Wins = snapshot.val().p1.wins;
    rps.p1Losses = snapshot.val().p1.losses;
    rps.p2Name =  snapshot.val().p2.name;
    rps.p2Choice = snapshot.val().p2.choice;
    rps.p2Wins = snapshot.val().p2.wins;
    rps.p2Losses = snapshot.val().p2.losses;
    chatInterface.message = snapshot.val().message.currentMsg;
    }, function(errorObject) {
      //console.log("The read failed: " + errorObject.code);
    });
  },
  setDataElement: function(player, key, value) {
    // writes individual data elements to Firebase
    //console.log('in dbInterface.setDataElement()');
    //console.log(player, key, value);
    // NOTE the [] around the 'key' variable!
    this.database.ref().child(player).update({[key]: value});
    //console.log('set a value in the DB');
  },
  storeChatMessage: function (newMessage) {
    this.database.ref().child('message').update({currentMsg: newMessage});
  },
  zeroPlayerData: function(player) {
    //console.log('in zeroPlayerData');
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
    //console.log('in managePlayers.addPlayer')
    let message = '';
    if (this.playerOneName) {
      this.playerTwoName = playerName;
      // TODO: not DRY; refactor
      dbInterface.setDataElement('p2', 'name', playerName);
      message = welcomePlayer(this.playerTwoName, 'p2');
      render(message, '#nameLand', 'empty');
      //console.log('replacing welcome and indicating turn');
      setTimeout(() => {
          const message = indicateTurn(this.playerOneName);
          //console.log(message);
          render(message, '#nameLand', 'empty');
        }, 1500);
      message = makeInitialPlayerControls(this.playerTwoName, 'p2', rps.p2Wins, rps.p2Losses);
      render(message, '#second_player_info', 'empty');
      //console.log('playerTwoName is: ' + this.playerTwoName);
    } else {
      this.playerOneName = playerName;
      dbInterface.setDataElement('p1', 'name', playerName);
      message = welcomePlayer(this.playerOneName, 'p1');
      render(message, '#nameLand', 'empty');
      //console.log('replacing welcome with name form');
      setTimeout(() => {
          render(makeNameInputForm(), '#nameLand', 'empty');
        }, 2000);
      message = makeInitialPlayerControls(this.playerOneName, 'p1', rps.p1Wins, rps.p1Losses);
      render(message, '#first_player_info', 'empty');
      //console.log('playerOneName is: ' + this.playerOneName);
    }
  },
  enterGame: function(playerName) {
    // gets player set up and ready to play game
    this.addPlayer(playerName);
    if (this.playerOneName && this.playerTwoName) {
      //console.log('two players present - start play');
      rps.startPlay();
    } else {
      //console.log('only one player present - wait');
    }
  },
  leaveGame: function (player) {
    // initialize that player's data;
    // sends disconnect message in chat
    // TODO
  }
}

const rps = {
  // provides functionality for play of the game
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
  initializeP1Data: function() {
    dbInterface.zeroPlayerData('p1');
  },
  initializeP2Data: function() {
    dbInterface.zeroPlayerData('p2');
  },
  initializeGameData: function() {
    //console.log('in rps.initializeGameData()')
    this.initializeP1Data();
    this.initializeP2Data();
    this.tieGames = 0;
  },
  incrementPlayerWins: function(player) {
    //console.log('in incrementPlayerWins');
    if (player === 'p1') {
      this.p1Wins++;
      dbInterface.setDataElement('p1', 'wins', this.p1Wins);
      //console.log('player 1 has won: ' + rps.p1Wins);
    } else {
      this.p2Wins++;
      dbInterface.setDataElement('p2', 'wins', this.p2Wins);
      //console.log('player 2 has won: ' + rps.p2Wins);
    }
  },
  incrementPlayerLosses: function(player) {
    //console.log('in incrementPlayerLosses');
    if (player === 'p1') {
      this.p1Losses++;
      dbInterface.setDataElement('p1', 'losses', this.p1Losses);
      //console.log('player 1 has lost: ' + rps.p1Losses);
    } else {
      //console.log('rps.p2Losses is now: ' + rps.p2Losses);  
      this.p2Losses++;
      //console.log('rps.p2Losses is now: ' + rps.p2Losses);
      dbInterface.setDataElement('p2', 'losses', this.p2Losses);
      //console.log('player 2 has lost: ' + rps.p2Losses);
    }
  },
  incrementTies: function() {
    this.tieGames++;
  },
  playRound: function() {
    // drives play of a round of RPS
    // triggered by second player making a choice
    if ((rps.p1Choice === "rock") && (rps.p2Choice === "scissors")) {
        //console.log('p1 wins!');
        winner = rps.p1Name;
        this.incrementPlayerWins('p1');
        this.incrementPlayerLosses('p2');
    } else if ((rps.p1Choice === "rock") && (rps.p2Choice === "paper")) {
        //console.log('p2 wins!');
        winner = rps.p2Name;
        this.incrementPlayerWins('p2');
        this.incrementPlayerLosses('p1');

    } else if ((rps.p1Choice === "scissors") && (rps.p2Choice === "rock")) {
        //console.log('p2 wins!');
        winner = rps.p2Name;
        this.incrementPlayerWins('p2');
        this.incrementPlayerLosses('p1');
    } else if ((rps.p1Choice === "scissors") && (rps.p2Choice === "paper")) {
        //console.log('p1 wins!');
        winner = rps.p1Name;
        this.incrementPlayerWins('p1');
        this.incrementPlayerLosses('p2');

    } else if ((rps.p1Choice === "paper") && (rps.p2Choice === "rock")) {
        //console.log('p1 wins!');
        winner = rps.p1Name;
        this.incrementPlayerWins('p1');
        this.incrementPlayerLosses('p2');
    } else if ((rps.p1Choice === "paper") && (rps.p2Choice === "scissors")) {
        //console.log('p2 wins!');
        winner = rps.p2Name;
        this.incrementPlayerWins('p2');
        this.incrementPlayerLosses('p1');

    } else if (rps.p1Choice === rps.p2Choice) {
        //console.log('it is a tie!');
        this.incrementTies();
        winner = 'tie';
    } else {
      //console.log('something went badly wrong in rps.PlayRound');
    }
    this.endPlay();
  },
  startPlay: function() {
    //console.log('in rps.startPlay()');
    //console.log('triggering setup of buttons now');
    // TODO: this may need to move to playRound
    this.showPlayerOneControls();
  },
  endPlay: function() {
    // drives display at end of one play
    let message = makeInitialPlayerControls(rps.p2Name, 'p2', rps.p2Wins, rps.p2Losses);
    render(message, '#second_player_info', 'empty');
    message = announceResults(winner);
    render(message, '#outcome_info', 'empty');
    // TODO: RESUME 2
    // setTimeout needs to use rps.restartPlay as callback
    setTimeout(() => {
      rps.restartPlay() }, 2000);
    rps.updateCounters();
    //console.log('back from updateCounters');
  },  
  restartPlay: function() {
    // sets up play of next game
    //console.log('in rps.restartPlay');
    winner = '';
    let message = emptyAnnouncementArea();
    render(message, '#outcome_info', 'empty'); 
    message = makePlayerControls(rps.p1Name, 'p1', rps.p1Wins, rps.p1Losses);
    //console.log(message);
    render(message, '#first_player_info', 'empty');
    message = indicateTurn(rps.p1Name);
    //console.log(message);
    render(message, '#nameLand', 'empty');
  },
  updateCounters: function() {
    let message = makeInitialPlayerControls(rps.p1Name, 'p1', rps.p1Wins, rps.p1Losses);
    render(message, '#first_player_info', 'empty');
    message = makeInitialPlayerControls(rps.p2Name, 'p2', rps.p2Wins, rps.p2Losses);
    render(message, '#second_player_info', 'empty');
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
} // end of rps definition

// GLOBAL FUNCTIONS
//===============================================================

const clickHandler = (e) => {
  ////console.log('in clickHandler');
  const clickTarget = e.target.className;
  let message;
  switch (clickTarget) {
    case 'btn.btn-square btn-success ml-2 addPlayer':
      ////console.log('clicked on start button');
      e.defaultPrevented;
      const newPlayer = $('#player_name').val().trim();
      if (validateNameInput(newPlayer)) {
        ////console.log('calling managePlayers.enterGame');
        // TODO: move to render()
        $('#player_name').val('');
        managePlayers.enterGame(newPlayer);
      } else {
        //console.log('empty string, no good');
        message = requestName();
        //console.log(message);
        render(message, '#nameLand', 'empty');
        setTimeout(() => {
          render(makeNameInputForm(), '#nameLand', 'empty');
        }, 1500);
      }
      break;
    // TODO: refactor to be more DRY. It's really wet!!!
    case 'rock p1' :
      //console.log('p1 chose rock');
      dbInterface.setDataElement('p1', 'choice', 'rock');
      //console.log('rps.p1Name is:' + rps.p1Name);
      message = makeInitialPlayerControls(rps.p1Name, 'p1', rps.p1Wins, rps.p1Losses);
      render(message, '#first_player_info', 'empty');
      rps.showPlayerTwoControls();
      message = indicateTurn(rps.p2Name);
      //console.log(message);
      render(message, '#nameLand', 'empty');
      break;
    case 'paper p1':
      //console.log('p1 chose paper');
      dbInterface.setDataElement('p1', 'choice', 'paper');
      message = makeInitialPlayerControls(rps.p1Name, 'p1', rps.p1Wins, rps.p1Losses);
      render(message, '#first_player_info', 'empty');
      rps.showPlayerTwoControls();
      message = indicateTurn(rps.p2Name);
      //console.log(message);
      render(message, '#nameLand', 'empty');
      break;
    case 'scissors p1':
      //console.log('p1 chose scissors');
      dbInterface.setDataElement('p1', 'choice', 'scissors');
      message = makeInitialPlayerControls(rps.p1Name, 'p1', rps.p1Wins, rps.p1Losses);
      render(message, '#first_player_info', 'empty');
      rps.showPlayerTwoControls();
      message = indicateTurn(rps.p2Name);
      //console.log(message);
      render(message, '#nameLand', 'empty');
      break;
    case 'rock p2' :
      //console.log('p2 chose rock');
      dbInterface.setDataElement('p2', 'choice', 'rock');
      rps.playRound();
      break;
    case 'paper p2':
      //console.log('p2 chose paper');
      dbInterface.setDataElement('p2', 'choice', 'paper');
      rps.playRound();
      break;
    case 'scissors p2':
      //console.log('p2 chose scissors');
      dbInterface.setDataElement('p2', 'choice', 'scissors');
      rps.playRound();
      break;
    case "btn.btn-square btn-success ml-2 send_msg":
      e.defaultPrevented;
      //console.log('clicked on send button');
      message = $('#chat_message').val().trim();
      chatInterface.sendChatMessage(message);
      // TODO move to render
      $("#chat_message").val('');
      break;
    default:
      //console.log('user clicked in unsupported region');
  }
}

function closingCode() {
  //console.log('im running closing code!');
  // resets DB when last player leaves
  // TODO: add logic to test if it is the last player leaving
  dbInterface.database.ref().set({
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
   },
   message: {
     currentMsg: ''
   }
  });
  return null;
}

const initializeGlobals = () => {
  // initializes global variables
  //console.log('in initializeGlobals');
  winner = '';
  // forces DB initialization when app starts up for first time
  dbInterface.initializeDB();
  dbInterface.initializeDataElements();
  rps.initializeGameData();
}

// TODO: delete if unused
const initializeDisplay = () => {
  // initializes display ... if needed
  //console.log('in initializeDisplay');
}

const main = () => {
  // provides main game functionality
  //console.log('in main()');
  $(document).on('click', clickHandler);
}

const render = (message, location, action) => {
  // intended to be sole interface to HTML page.
  // updates screen at location with contents of imgElements after taking
  // the action, if one is specified;
  // writes message to location after taking action (if any)
  //console.log('in render()');
  // currently, only supports emptying the location
  if (action) {
      $(location).empty();
  }
  // TODO: this may need update
  $(location).append(message);
}

const validateNameInput = (newPlayer) => {
  // any string is OK as long as it's not empty
  if (newPlayer === '') {
    return false
  }
  return true;
}

// GAME
//===============================================================
$(document).ready(function() {
  //console.log('starting app.js');
  initializeGlobals();
  // TODO: delete if unused
  initializeDisplay();
  main();
});

window.onunload = closingCode;

