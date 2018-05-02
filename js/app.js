/*jshint esversion: 6 */

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x+= this.speed * dt;

    // When enemy oversteps visible border of canvas
    // restart that enemy at the beginning of canvas
    // and apply random speed
    if(this.x > 500) {
      this.x = -20;
      this.speed = (Math.random() * 300) + 300;
    }

    // Player and enemy collision functionality:
    // if player touches enemy, restart the player
    // and the starting location
    if(this.x + 50 > player.x &&
    player.x + 50 > this.x &&
    this.y + 30 > player.y &&
    player.y + 30 > this.y) {
      player.x = 203;
      player.y = 405;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method
const Player = function(x, y) {
  this.x = x;
  this.y = y;
  this.player = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.player), this.x, this.y);
};

// Handle player movement on click of arrow keys and
// handle player - rock collision
Player.prototype.handleInput = function(keyboardPress) {
  // Check if player clicks the left arrow key and if player
  // is not breaching left border of the canvas. All other arrow
  // keys are using the same logic pattern
  if(keyboardPress === 'left' && this.x > 3) {
    // Check if current player cordinates match cordinates
    // of the closest stone. If yes, do not allow movement in
    // required direction. If no, allow movement in required direction
    // All other arrow keys below use the same logic pattern
    if(rockCordinates.indexOf(this.y - 10 + this.x - 100) !== -1) {
      this.x+= 0;
    } else {
      this.x-= 100;
    }
  } else if (keyboardPress === 'right' && this.x < 403) {
    if(rockCordinates.indexOf(this.y - 10 + this.x + 100) !== -1) {
      this.x+= 0;
    } else {
      this.x+= 100;
    }
  } else if (keyboardPress === 'up' && this.y > -20) {
    if(rockCordinates.indexOf(this.y - 95 + this.x) !== -1) {
      this.y+= 0;
    } else {
      this.y-= 85;
      // If player wins (reaches the highest row on canvas), move player to
      // the starting location with small delay
      if(this.y === -20) {
        setTimeout(() => {
          this.x = 203;
          this.y = 405;
          // When player wins randomly replace all rock objects on canvas
          rocks = [];
          createRocs();
        }, 200);
      }
    }
  } else if (keyboardPress === 'down' && this.y < 490) {
    if(rockCordinates.indexOf(this.y + 75 + this.x) !== -1) {
      this.y+= 0;
    } else {
      this.y+= 85;
    }
  }
};

// Create Rock class. Necessary adjustments in engine.js file also made
const Rock = function (x, y) {
  this.x = x;
  this.y = y;
  this.rock = 'images/Rock.png';
};

Rock.prototype.update = function(dt) {};

Rock.prototype.render = function() {
  ctx.drawImage(Resources.get(this.rock), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
const allEnemies = [];
// Create array to provide y cordinate for each enemy object
const enemyYLocation = [63, 147, 230, 310];
// Place the player object in a variable called player
const player = new Player(203, 490);

// Create enemy objects and provide y cordinates stored in the
// enemyYLocation array
enemyYLocation.forEach(yCordinate => {
  enemy = new Enemy(0, yCordinate, (Math.random() * 300) + 300);
  allEnemies.push(enemy);
});

// rockLocations array stores values of rock objects on the canvas
// First nested array stores x cordinates
// Second nested array stores y cordinates
const rockLocations = [[3, 103, 203, 303, 403], [310, 225, 140, 55]];

// rocks array will store all rock objects that are rendered by
// engine.js file
let rocks =[];

// Function creates 3 rock objects and gives them
// random combination of x and y cordinates. Below method will place
// new instance of Rock object to rocks array so push() method is not needed.
// createRocs function is also placed in engine.js file
function createRocs() {
  for(let numOfRock = 3; numOfRock > 0; numOfRock--) {
    rocks[numOfRock] = new Rock(rockLocations[0][randomNumber(5)], rockLocations[1][randomNumber(4)]);
  }
}

// rockCordinates array is used to store cordinates of all created rock objects
let rockCordinates = [];

// Below function extracts x and y cordinates from rock objects
// that were created by createRocs function. Sum of cordinates is used to provide 
// unique identifier to each rock object
rocks.forEach(function(rock){
  rockCordinates.push(rock['x'] + rock['y']);
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Function for a random number. Function is used to create
// random location for rocks on the grid
function randomNumber (num) {
  return Math.floor(Math.random() * num);
}
