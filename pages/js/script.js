var player = false;
var player_number = -1;
var ballSize = 1;

var ballX = 0;
var ballY = 0;


var player0X;
var player1X;

setScoreMessage('0', 1);
setScoreMessage('0', 2);

var canvas = $('#canvas_').get(0);

var socket = io.connect('http://localhost:8080');
socket.on('message', function(message) {
    console.log("Server : " + message);
});

socket.on('player_state', function(message) {   // Active ou désactive le joueur
    player_number = message['id'];
    if(message['state'] == 'y') {
        setTitleMessage('Vous êtes ' + message['id']);
        player = true;
    }
    else {
        setTitleMessage('Vous êtes spectateur');
        player = false;
    }
});

socket.on('spectator_info', function(message) { // Réception des données des joueurs
    if(player) {
        console.log('ERREUR');
        return;
    }
    var canvas = $('#canvas_').get(0);
    var position = message[1];
    var idPlayer = message[0];

    if(idPlayer == 'joueur0') {
        player0X = position;
        movePlayer(canvas, position);
    }
    else {
        player1X = position;
        moveConc(canvas, player1X);
    }
});

socket.on('conc_position', function(message) {  // Réception des données de l'adversaire
    if(!player) {
        console.log('ERREUR');
        return;
    }
    var canvas = $('#canvas_').get(0);
    player1X = message;
    if(player_number == 'joueur1') {
        player1X = invertX(player1X);
    }
    moveConc(canvas, player1X);
});

socket.on('timer_info', function(message) {
    setTimerMessage(message);
    if(message == 'GO !') {
        setTimeout(() => {
            setTimerMessage('');
        }, 300)
    }
});

socket.on('score_change', function(message) {
    var score = message['score'];
    var playerid = message['id'];
    if(playerid == 'joueur0') {
        if(player_number == 'joueur1') {
            setScoreMessage(score, 2);
        } else {
            setScoreMessage(score, 1);
        }
        
    } else {
        if(player_number == 'joueur1') {
            setScoreMessage(score, 1);
        } else {
            setScoreMessage(score, 2);
        } 
    }
});

socket.on('ball_coords', function(message) {  // Réception de la position de la balle
    ballX = message['x'];
    ballY = message['y'];
    if(player_number == 'joueur1') {
        ballX = invertX(ballX)+30;
        ballY = invertY(ballY);
    }
    var canvas = $('#canvas_').get(0);
    drawBall(canvas, ballX, ballY, ballSize);
    reloadPlayersAndArena();
});


$(document).ready(function() {
    var canvas = $('#canvas_').get(0);
    
    initArena(canvas);
    $(document).mousemove(function(event){
        var x = 0;
        var screen_width = $(window).width();
        if(event.pageX < 1/4*screen_width) {
            x = 1/4*screen_width*270/screen_width+1;
        }
        else if(event.pageX > 3/4*screen_width) {
            x = 3/4*screen_width*270/screen_width-1;
        }
        else {
            x = event.pageX*270/screen_width;
        }
        if(player) {
            player0X = x;
            movePlayer(canvas, x);
            var trs = x;
            if(player_number == 'joueur1') {
                trs = invertX(x);
            }
            socket.emit('send_position', trs);
        }
        
      });

});

function setTitleMessage(message) {
    $('#title_').text(message);
}

function setTimerMessage(message) {
    $('#timer_').text(message);
}

function setScoreMessage(message, id) {
    if(id == 1) {
        $('#score_p1').text(message);
    } else if(id == 2){
        $('#score_p2').text(message);
    }
    
}


function reloadPlayersAndArena() {
    var canvas = $('#canvas_').get(0);
    initArena(canvas);
    movePlayer(canvas, player0X);
    moveConc(canvas, player1X);
}

function invertX(ballX) {
    var cx = 135;
    var dcx = Math.abs(ballX - cx);
    var xo;
    if(ballX > cx) {
        xo = ballX - 2*dcx;
    } else {
        xo = ballX + 2*dcx;
    }
    return xo;
}

function invertY(ballY) {
    var cy = 80;
    var dcy = Math.abs(ballY - cy);
    var yo;
    if(ballY > cy) {
        yo = ballY - 2*dcy;
    } else {
        yo = ballY + 2*dcy;
    }
    return yo;
}