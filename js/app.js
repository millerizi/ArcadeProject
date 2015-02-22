var Enemy = function() {
    //This is the range left to right enemy can be within
    this.X = [-50, 508];
    //This is the range up and down the enemy can be 60 is for top road, 140 is second, and 220 is third
    this.Y = [60, 140, 220];
    //Range of speed for the enemies to move accross the screen Min, max
    this.EnemySpeed = [100, 900];
    //This is the image that will be used as enemy
    this.sprite = 'images/enemy-bug.png';
    this.reset();
}

//This gets the Random Y axis for the enemies using random() and multiplying by Y
//Length and then rounding to lowest integer
Enemy.prototype.RandomYAxis = function() {
        return this.Y[Math.floor(Math.random() * this.Y.length)];
    }
    //Used to determine random speed of Enemies
Enemy.prototype.RandomSpeed = function() {
    // create two variables using array items for min and max speed
    var minSpeed = this.EnemySpeed[0],
        maxSpeed = this.EnemySpeed[1];
    //take random number 0.... multply my diff of max and min speed then add minspeed
    //and then round to lowest interger
    return Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
}

//This is how the enemy knows to reset and start from left to right and at what speed
Enemy.prototype.reset = function() {
    var start = this.X[0]; // [0] is the first item in the X array
    this.x = start; // this will be -150
    //the random Y is pulled from function Enemy.prototype.RandomYAxis
    this.y = this.RandomYAxis();
    //this speed will equal the number created in Enemy.prototype.RandomSpeed
    this.speed = this.RandomSpeed();
}

Enemy.prototype.update = function(dt) {
        var maxPos = this.X[1]; //[1] is the second item in X array that will be used
        this.x += this.speed * dt; // current x axys += second item in X array times dt function

        if (this.x > maxPos) { //If current x axys is greater that max Pos (Second item in array) reset enemy
            this.reset();
        }
    }
    //Draws enemy based on logic
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//Creates the player using an array so a different charachter each time played(Random)
var Player = function() {
    this.Images = [
    'images/char-horn-girl.png',
    'images/char-cat-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png',
    'images/char-boy.png'
    ];
    this.sprite = this.Images[Math.floor(Math.random() * 5)];
    this.X = [-45, 402];
    this.PlayerYAxis = [-20, 380];
    this.reset();
}

//This is where the character is placed on screen when reset, this will be random
Player.prototype.reset = function() {
    this.x = 200;
    this.y = this.PlayerYAxis[1];
}

//This is calling the function where we validate if any collisions took place
Player.prototype.update = function() {
    this.checkCollisions();
}

//Function determines what to do if there is a collision on the page
Player.prototype.checkCollisions = function() {
    if (this.y == -20) {
        // player has reached the top row and can be reset to try again
        this.reset();
        //if between 60 and 220 its in the area of the screen where the bugs are
    } else if (this.y >= 60 && this.y <= 220) {
        var player = this;
        // player is on road rows, check collisions for each bug on screen
        allEnemies.forEach(function(enemy) {
            // validate if bug and player are on the same page
            if (enemy.y == player.y) {
                // is the bug touching player
                if (enemy.x >= player.x - 30 && enemy.x <= player.x + 30) {
                    player.reset();
                }
            }
        });
    }
}

//Draws the player onto the screen.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//When button is presssed we validated the user is still on screen and will go off
//If they would go off screen nothing will happen and player will stay on screen
// This also controls the amound of space moved each time button is clicked
Player.prototype.handleInput = function(key) {
    if (key === 'left') {
        //This statement look at the x axys and then if statement is true will move left 100
        this.x -= (this.x - 100 < this.X[0]) ? 0 : 100;
    } else if (key === 'right') {
        //This statement look at the y axys and then if statement is true will move right 100
        this.x += (this.x + 100 > this.X[1]) ? 0 : 100;
    } else if (key === 'up') {
        //This statement look at the x axys and then if statement is true will move up 80
        this.y -= (this.y - 80 < this.PlayerYAxis[0]) ? 0 : 80;
    } else if (key === 'down') {
        //This statement look at the y axys and then if statement is true will move down 80
        this.y += (this.y + 80 > this.PlayerYAxis[1]) ? 0 : 80;
    }
}

//Browser listens for the keys below to be pressed and then stores as e in function, which is used to handle input
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//disables arrow keys from scrolling window in game.
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

//Variables for enemies and player
var one = new Enemy();
var two = new Enemy();
var three = new Enemy();
var allEnemies = [one, two, three];
var player = new Player();