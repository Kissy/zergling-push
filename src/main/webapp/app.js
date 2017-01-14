var _websocket = new WebSocket("ws://localhost:8080/websocket");
_websocket.onmessage = function (response) {
    console.log(response.data);
};
_websocket.onopen = function () {
    console.log('WS Connection');
};

var _xScale = 0.5;
var _yScale = 0.5;

var _renderer = PIXI.autoDetectRenderer();
_renderer.view.style.position = "absolute";
_renderer.view.style.display = "block";
_renderer.autoResize = true;
_renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(_renderer.view);

var _stage = new PIXI.Container();
_renderer.render(_stage);

var _player;

PIXI.loader
    .add("avatar", "img/avatar.png")
    .add("laser", "img/laser.png")
    .add("shield_silver", "img/shield_silver.png")
    .load(function () {
        _player = new Player();
        _stage.addChild(_player.sprite);
        gameLoop();
        powerUpFactory();
    });

function clamp(value, min, max) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else {
        return value;
    }
}

function collide(first, second) {
    var firstBound = first.getBounds(true);
    var secondBound = second.getBounds(true);
    return firstBound.x < secondBound.x + secondBound.width &&
        firstBound.x + firstBound.width > secondBound.x &&
        firstBound.y < secondBound.y + secondBound.height &&
        firstBound.height + firstBound.y > secondBound.y;
}

function powerUpFactory() {
    var powerUp = new PowerUp(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    _stage.addChild(powerUp.sprite);
    setTimeout(powerUpFactory, Math.random() * 10000)
}

function gameLoop() {
    var i;
    for (i = 0; i < _stage.children.length; i++) {
        _stage.children[i].component.update();
    }

    _renderer.render(_stage);

    for (i = 0; i < _stage.children.length; i++) {
        var child = _stage.children[i];
        if (child.component instanceof PowerUp && collide(_player.sprite, child)) {
            _stage.removeChild(child);
        }
    }

    requestAnimationFrame(gameLoop);
}
