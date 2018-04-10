// buildHTML.js
// builds dynamic HTML for Multiplayer RPS

const announceResults = (playerName) => {
  // builds announcement in central region of game
  // TODO: (future) improve HTML/CSS
  let message;
  if (playerName === 'tie') {
    message = `
      <br>
      <h3 class="text-center">It's a Tie!!!</h3>
      <h4 class="text-center">Let's Go For Another Round!</h4>
    `
  } else {
    message = `
      <br>
      <h3 class="text-center">${playerName} Wins!!!</h3>
      <h4 class="text-center">Let's Go For Another Round!</h4>
    `
  }
  return message;
}

const indicateTurn = (playerName) => {
  //console.log("in indicateTurn()");
  const message = `
      <h3>It's ${playerName}'s turn!</h3>
  `
  return message;
}

const emptyAnnouncementArea = () => {
  const message = ``;
  return message;
}

const makeChatMessageForDisplay = (chatMessage) => {
  //console.log('in makeChatMessageForDisplay');
  return`<p class="pb-0 mb-0">${chatMessage}</p>`;
}

const makeNameInputForm = () => {
  const message = `
    <div class="input-group mb-3">
      <input type="text" class="form-control" id='player_name' placeholder="Name">
      <div class="input-group-append">
        <button class="btn.btn-square btn-success ml-2 addPlayer" id='player_start' type="button">Start</button>
      </div>
    </div>
  `
  return message
}

const makePlayerControls = (playerName, playerID, playerWins, playerLosses) => {
  // builds and won/loss display for a player
  //console.log('in buildHTmL makePlayerControls')
  const message = `
    <h4> ${playerName} </h4>
    <hr>
    <h5 class='rock ${playerID}'>Rock</h5>
    <h5 class='paper ${playerID}'>Paper</h5>
    <h5 class='scissors ${playerID}'>Scissors</h5>
    <hr>
    <h6><span class='wins'>Wins: ${playerWins}</span><span class='losses'>   Losses: ${playerLosses}</span></h6> 
  `
  return message;
}

// TODO (future): make this DRY
const makeInitialPlayerControls = (playerName, playerID, playerWins, playerLosses) => {
  // builds initial control-area display for a player
  //console.log('in buildHTmL makeInitialPlayerControls')
  const message = `
    <h4> ${playerName} </h4>
    <hr>
    <br>
    <br>
    <br>
    <hr>
    <h6><span class='wins'>Wins: ${playerWins}</span><span class='losses'>   Losses: ${playerLosses}</span></h6> 
  `
  return message;
}

const welcomePlayer = (playerName, playerID) => {
  // builds welcome display for a player
  //console.log('in buildHTmL welcomePlayer')
  let message = '';
  let num;
  if (playerID === 'p1') {
    num = 1;
  } else {
    num = 2;
  }
  message = `
    <h5>Welcome, ${playerName}! You are Player ${num}</h5>
  `
  return message;
}

const requestName = () => {
  const message = `
    <h5>Please enter a name</h5>
  `
  return message;
}