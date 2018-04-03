// buildHTML.js
// builds dynamic HTML for Multiplayer RPS

const makePlayerControls = (playerName, playerID, playerWins, playerLosses) => {
  // builds and won/loss display for a player
  console.log('in buildHTmL makePlayerControls')
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