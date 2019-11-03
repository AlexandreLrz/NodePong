var centerx = 100;
var centery = 100;

var posX = getCenterX();
var posY = getCenterY();

var velocityX = 0;
var velocityY = 0;

var circleSize = 20;
var angleMax = Math.PI/4;

var speed = 25;

var player0;
var player1;

var stopped = false;

function launchBall(positionSenderCall, player0_, player1_, onPlayer0Lose, onPlayer1Lose) {    
    player0 = player0_;
    player1 = player1_;
    setTimeout(() => {
        if(posY >= 130) {
            speed = 25;
            onPlayer0Lose();
        } else if(posY <= 30) {
            speed = 25;
            onPlayer1Lose();
        }
        updateCoords();
        if(isTouchingWallX()) {
            invertBy('x');
        }
        var playerTouched = isTouchingPlayer();
        if(playerTouched != null) {
            onCollision(playerTouched);
        }
        positionSenderCall(posX, posY);
        if(!stopped) {
            launchBall(positionSenderCall, player0, player1_, onPlayer0Lose, onPlayer1Lose);
        }
    }, 1000/speed)
}

function stopBall() {
    stopped = true;
    posX = getCenterX();
    posY = getCenterY();
    velocityX = 0;
    velocityY = 0;
}

function firstLaunch() {
    stopped = false;
}

function getCenterX() {
    return (202.5+67.5+30)/2;
}

function getCenterY() {
    return (30+130)/2;
}

function updateCoords() {
    posX+=velocityX;
    posY+=velocityY;
}

function initBall() {
    var random = Math.floor((Math.random() * 2) + 1);
    if(random == 1) {
        velocityY = -1;
    } else {
        velocityY = 1;
    }
    velocityX = 0.5;
}

function isTouchingWallX() {
    if(posX <= 67.5+1 || posX >= 202.5+30-1) {
        return true;
    }
    return false;
}

function isTouchingWallY() {
    return false;
}

function isTouchingPlayer() {
    if(posY <= 30+1) {      // la balle est en haut
        if(player1 == null) {
            return null;
        }
        if(posX >= player1.positionX && posX <= player1.positionX + 30) {
            return player1;
        }
    } else if( posY >= 130-1) {     // la balle est en bas
        if(player0 == null) {
            return null;
        }
        if(posX >= player0.positionX && posX <= player0.positionX + 30) {
            return player0;
        }
    }
    return null;
}

function invertBy(coord) {  // inverse la velocité de coord
    if(coord == 'x') {
        velocityX = -velocityX;
    } else {
        velocityY = -velocityY;
    }
}

function onCollision(player) {
     var playerMiddleX = player.positionX + 15;
     var ballX = posX;
     var xpos = (playerMiddleX - ballX) * angleMax / 15;
     var acos = Math.acos(xpos);
     var ypos = Math.sin(acos);
     velocityX = -xpos;
     if(velocityY > 0) {
         velocityY = (-ypos);
     } else {
         velocityY = ypos;
     }
}

module.exports = {
    launchBall: launchBall,
    initBall: initBall,
    firstLaunch: firstLaunch,
    stopBall: stopBall
}

