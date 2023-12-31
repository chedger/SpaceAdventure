// Global variables to hold the textures and background image
let bgImage;
let redGemTexture;
let greenGemTexture;
let blueGemTexture;
let asteroidTexture;
let spaceshipImage;
// Spaceship class to represent the player
class Spaceship {
  constructor() {
    this.xPosition = width / 2; // Horizontal position of the spaceship
    this.yPosition = height / 2; // Vertical position of the spaceship
    this.size = 60; // Size of the spaceship (visual size, not hitbox)
    this.speed = 5; // Speed of movement for the spaceship
  }

  // Method to draw the spaceship centered on the screen
  draw() {
    image(spaceshipImage, this.xPosition - this.size / 2, this.yPosition - this.size / 2, this.size, this.size);
  }

  // Method to ensure the spaceship stays within the window boundaries
  constrain() {
    this.xPosition = constrain(this.xPosition, 30 / 2, width - 30 / 2); // Using original hitbox size
    this.yPosition = constrain(this.yPosition, 30 / 2, height - 30 / 2); // Using original hitbox size
  }
}

// Gem class to represent collectible objects
class Gem {
  constructor(spaceship) {
    this.size = 30; // Size of the gem (visual size, not hitbox)
    this.texture = [redGemTexture, greenGemTexture, blueGemTexture][int(random(3))]; // Randomly selecting a gem texture
    // Ensuring gems are not spawned on top of the spaceship
    do {
      this.xPosition = random(15 / 2, width - 15 / 2); // Using original hitbox size
      this.yPosition = random(15 / 2, height - 15 / 2); // Using original hitbox size
    } while (dist(spaceship.xPosition, spaceship.yPosition, this.xPosition, this.yPosition) < spaceship.size / 2 + 15); // Using original hitbox size
  }

  // Method to draw the gem on the screen
  draw() {
    image(this.texture, this.xPosition - this.size / 2, this.yPosition - this.size / 2, this.size, this.size);
  }
}

// Asteroid class to represent obstacles
class Asteroid {
  constructor(spaceship) {
    this.size = 100; // Size of the asteroid (visual size, not hitbox)
    // Ensuring asteroids are not spawned on top of the spaceship
    do {
      this.xPosition = random(50 / 2, width - 50 / 2);
      this.yPosition = random(50 / 2, height - 50 / 2);
    } while (dist(spaceship.xPosition, spaceship.yPosition, this.xPosition, this.yPosition) < spaceship.size / 2 + 50); 
    this.xSpeed = random(-2, 2); // Horizontal speed of the asteroid
    this.ySpeed = random(-2, 2); // Vertical speed of the asteroid
  }

  // Method to draw the asteroid on the screen
  draw() {
    image(asteroidTexture, this.xPosition - this.size / 2, this.yPosition - this.size / 2, this.size, this.size);
  }

  // Method to move the asteroid
  move() {
    // Reflecting off the window's boundaries
    if (this.xPosition + 50 / 2 > width || this.xPosition - 50 / 2 < 0) { // Using original hitbox size
      this.xSpeed *= -1;
    }
    if (this.yPosition + 50 / 2 > height || this.yPosition - 50 / 2 < 0) { // Using original hitbox size
      this.ySpeed *= -1;
    }
    this.xPosition += this.xSpeed; // Updating the horizontal position
    this.yPosition += this.ySpeed; // Updating the vertical position
  }
}

// Game class to represent the entire game
class Game {
  constructor() {
    this.level = 1; // Current level of the game
    this.score = 0; // Current score of the game
    this.highScore = 0; // High score stored locally
    this.spaceship = new Spaceship(); // Creating a spaceship object
    this.gems = Array.from({length: this.level + 3}, () => new Gem(this.spaceship)); // Array of gem objects
    this.asteroids = Array.from({length: this.level * 2}, () => new Asteroid(this.spaceship)); // Array of asteroid objects
    this.isGameOver = false; // Flag to check if the game is over
  }

  // Method to end the game
  gameOver() {
    this.isGameOver = true;
    this.highScore = max(this.score, this.highScore); // Update high score if current score is higher
    noLoop(); // Stop the game loop
  }

  // Method to draw game elements and check conditions
  draw() {
    background(bgImage); // Using the custom background image

    this.spaceship.draw(); // Drawing the spaceship
    this.spaceship.constrain(); // Applying constraints to the spaceship

    for (let gem of this.gems) {
      gem.draw(); // Drawing each gem
      // Checking if a gem has been picked
      if (dist(this.spaceship.xPosition, this.spaceship.yPosition, gem.xPosition, gem.yPosition) < this.spaceship.size / 2 + 15 / 2) { // Using original hitbox size
        this.score++; // Incrementing the score
        this.gems.splice(this.gems.indexOf(gem), 1); // Remove gem when picked
      }
    }

    for (let asteroid of this.asteroids) {
      asteroid.draw(); // Drawing each asteroid
      asteroid.move(); // Moving each asteroid
      // Checking if an asteroid has hit the spaceship
      if (dist(this.spaceship.xPosition, this.spaceship.yPosition, asteroid.xPosition, asteroid.yPosition) < this.spaceship.size / 2 + 50 / 2) { // Using original hitbox size
        this.gameOver(); // Ending the game if an asteroid is hit
      }
    }

    fill(255);
    textSize(20);
    text('Score: ' + this.score, 10, 30); // Displaying the score above everything else
    text('Level: ' + this.level, 10, 60); // Displaying the level above everything else

    if (this.gems.length === 0) {
      this.level++; // Incrementing the level
      // Creating new gems and asteroids for the new level
      this.gems = Array.from({length: this.level + 3}, () => new Gem(this.spaceship));
      this.asteroids = Array.from({length: 2 * this.level}, () => new Asteroid(this.spaceship));
    }

    if (this.isGameOver) {
      fill(200);
      textSize(80);
      let gameOverText = "GAME OVER";
      // Centering the Game Over text
      text(gameOverText, (width - textWidth(gameOverText)) / 2, height / 2 - 40);

      textSize(20); // Keep consistent font size for High Score
      let highScoreText = "High Score: " + this.highScore;
      // Centering the High Score text
      text(highScoreText, (width - textWidth(highScoreText)) / 2, height / 2 + 20);

      this.restartButton.show(); // Show restart button on game over
    }
  }

  // Method to restart the game
  restart() {
    this.level = 1; // Resetting the level
    this.score = 0; // Resetting the score
    this.spaceship = new Spaceship(); // Creating a new spaceship object
    this.gems = Array.from({length: this.level + 3}, () => new Gem(this.spaceship)); // Creating a new array of gem objects
    this.asteroids = Array.from({length: this.level * 2}, () => new Asteroid(this.spaceship)); // Creating a new array of asteroid objects
    this.isGameOver = false; // Resetting the game over flag
    this.restartButton.hide(); // Hide the restart button when game is restarted
    loop(); // Restarting the game loop
  }
}

let game; // Global variable to hold the game object

// Function to preload the assets
function preload() {
  // Preloading the images
  bgImage = loadImage("./Assets/SpaceBG.png");
  redGemTexture = loadImage("./Assets/RedGem.png");
  greenGemTexture = loadImage("./Assets/GreenGem.png");
  blueGemTexture = loadImage("./Assets/BlueGem.png");
  asteroidTexture = loadImage("./Assets/Asteroid.png");
  spaceshipImage = loadImage("./Assets/Spaceship.png");
}

function setup() {
  let canvas = createCanvas(windowWidth*0.9745, windowHeight*0.9745); // Creating the canvas
  canvas.parent('game');  // This line attaches the canvas to the #game section
  
  game = new Game(); // Creating the game object
  // Creating a restart button and linking it to the game's restart function
  game.restartButton = createButton('Restart Game');
  game.restartButton.parent('game');
  // Centering the restart button
  game.restartButton.position((width - game.restartButton.width) / 2, height / 2 + 80);
  game.restartButton.mousePressed(() => game.restart());
  game.restartButton.hide(); // Hiding the restart button initially
}

function draw() {
  game.draw(); // Drawing the game

  // Adding support for both arrow keys and WASD controls
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    game.spaceship.xPosition -= game.spaceship.speed; // Moving the spaceship left
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    game.spaceship.xPosition += game.spaceship.speed; // Moving the spaceship right
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    game.spaceship.yPosition -= game.spaceship.speed; // Moving the spaceship up
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    game.spaceship.yPosition += game.spaceship.speed; // Moving the spaceship down
  }
}
