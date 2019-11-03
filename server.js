// Node modules
var http = require('http');
var fs = require('fs');

// Personnal scrips
var serverRequest = require('./scripts/serverRequest');
var serverMessage = require('./scripts/serverMessages');
var serverBall = require('./scripts/serverBall');


var server = http.createServer(function(req, res) {
    serverRequest.onServerRequest(req, res);   
});


var io = require('socket.io').listen(server);

var players = new Array();
var spectators = new Array();

io.sockets.on('connection', function (socket) {
    

    if(players.length < 2) {
        socket.broadcast.emit('message', 'Nouveau joueur connecté !');
        socket.idPlayer = 'joueur' + players.length;
        socket.score = 0;
        if(players[0] != null) {
            if(players[0].idPlayer == 'joueur1') {
                socket.idPlayer = 'joueur0';
            } else {
                socket.idPlayer = 'joueur1';
            }
        }
        socket.emit('player_state', {'state': 'y', 'id': socket.idPlayer});
        console.log('Un joueur est connecté !');
        players.push(socket);
        if(players.length == 1) {
            // Activation du timer
        }
    }
    else {
        socket.broadcast.emit('message', 'Nouveau spectateur connecté !');
        socket.emit('player_state', {'state': 'n', 'id': -1});
        console.log('Un spectateur est connecté !');
        spectators.push(socket);
    }   

    socket.on('send_position', function (message) {
        socket.positionX = message;
        serverMessage.sendPlayersMessage('conc_position', message, players, socket);   // On envoie l'info de la position à l'adversaire
        serverMessage.sendSpectatorsMessage('spectator_info', {0 : socket.idPlayer, 1 : message}, spectators);
     });

     socket.on('disconnect', function() {
        var idDisconnected = socket.idPlayer;
        if(players.includes(socket)) { // On retire le joueur déconnecté de la liste des joueurs
            console.log('Un joueur s\'est déconnecté');
            serverBall.stopBall();      // on stop la balle
            var index_ = players.indexOf(socket);
            players.splice(index_, 1);
        }
        else { // On retire le joueur déconnecté de la liste des spectateurs
            console.log('Un spectateur s\'est déconnecté');
            var index_ = spectators.indexOf(socket);
            spectators.splice(index_, 1);
        }
        if(!loadNewPlayer(idDisconnected)) {  // Si on ne peut pas charger de nouveau joueur, on lance le timer
            serverMessage.sendPlayersMessage('message', 'En attente d\'un joueur', players);
        }
     });

     if(players.length == 2) {
        serverBall.stopBall();      // on stop la balle
        launchGameTimer();
     }

});

function launchGameTimer() {
    timer(3);
}

function timer(i) {
    setTimeout(() => {
        if(players.length == 2) {
            if(i != 0) {
                serverMessage.sendPlayersMessage('timer_info', i, players);
                serverMessage.sendSpectatorsMessage('timer_info', i, spectators);
                timer(i-1);
            } else {
                serverMessage.sendPlayersMessage('timer_info', 'GO !', players);
                serverMessage.sendSpectatorsMessage('timer_info', 'GO !', spectators);
                startGame();
            }
        }
    }, 1000)
}

function startGame() {
    serverBall.firstLaunch();
    serverBall.initBall();
    serverBall.launchBall(
    function(x, y) {  // fonction à call lors de l'update des coords de la balle
        serverMessage.sendPlayersMessage('ball_coords', {'x': x, 'y': y}, players);
        serverMessage.sendSpectatorsMessage('ball_coords', {'x': x, 'y': y}, spectators);
    }, 
    players[0], 
    players[1],
    function() {
        players[1].score++;
        onScoreChange(players[1]);
        serverBall.stopBall();
        launchGameTimer();
    },
    function() {
        players[0].score++;
        onScoreChange(players[0]);
        serverBall.stopBall();
        launchGameTimer();
    });
}

function onScoreChange(player) {
    serverMessage.sendPlayersMessage('score_change', {'id': player.idPlayer, 'score': player.score}, players);
    serverMessage.sendSpectatorsMessage('score_change', {'id': player.idPlayer, 'score': player.score}, spectators);
}

function loadNewPlayer(idDisconnected) {  // Change un spectateur en joueur
    if(spectators.length > 0) {
        var newPlayer = spectators.shift();
        newPlayer.idPlayer = idDisconnected;
        newPlayer.emit('player_state', {'state': 'y', 'id': newPlayer.idPlayer});
        players.push(newPlayer);
        return true;
    }
    else {
        return false;
    }
}

server.listen(8080);