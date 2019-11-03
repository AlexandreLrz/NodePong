function sendPlayersMessage(message, content, players, socket = null) {
    for (i = 0; i < players.length ; i++) {
        if(players[i] == socket) {
            continue;
        }
        players[i].emit(message, content);
    }
}

function sendSpectatorsMessage(message, content, spectators, socket = null) {
    for (i = 0; i < spectators.length ; i++) {
        if(spectators[i] == socket) {
            continue;
        }
        spectators[i].emit(message, content);
    }
}

module.exports = {
    sendSpectatorsMessage: sendSpectatorsMessage,
    sendPlayersMessage: sendPlayersMessage
}