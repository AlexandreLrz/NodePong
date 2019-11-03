function movePlayer(canvas, x) {
    var context = canvas.getContext("2d");
    context.clearRect(1/4*270+0.5, 130, 3/4*270+30-1/4*270-1, 1);
    if(player) {    // Si le client est un spectateur, on met la couleur en rouge
        context.fillStyle = "blue";
    } else {
        context.fillStyle = "red";
    }
    
    context.fillRect(x, 130, 30, 1);
    initArena(canvas);
}

function initArena(canvas) {
    var context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(1/4*270, 20, 0.5, 120);
    context.fillRect(3/4*270+30, 20, 0.5, 120);
}

function moveConc(canvas, x) {
    var context = canvas.getContext("2d");
    context.clearRect(1/4*270+0.5, 30, 3/4*270+30-1/4*270-1, 1);
    context.fillStyle = "red";
    context.fillRect(x, 30, 30, 1);
}

function drawBall(canvas, x, y, ballSize) {
    var context = canvas.getContext("2d");
    context.clearRect(1/4*270+0.5, 0, 3/4*270+30-1/4*270-1, 150);
    context.beginPath();
    context.arc(ballX, ballY, ballSize, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();
    context.stroke();
}