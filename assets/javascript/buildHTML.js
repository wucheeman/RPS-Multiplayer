// buildHTML.js
// builds dynamic HTML for Multiplayer RPS

const makePlayerControls = (playerName) => {
  // builds and won/loss display for a player
  console.log('in buildHTmL makePlayerControls')
  const message = `
    <h4> ${playerName} </h4>
    <hr>
    <h5 class='rock'>Rock</h5>
    <h5 class='paper'>Paper</h5>
    <h5 class='scissors'>Scissors</h5>
    <hr>
    <h6><span class='wins'>Wins: TBD</span><span class='losses'>Losses: </span></h6> 
  `
  return message;
}