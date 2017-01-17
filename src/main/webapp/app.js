var _targetWidth = 1920;
var _targetHeight = 960;
var _scale = (_targetWidth / _targetHeight >= window.innerWidth / window.innerHeight) ? (window.innerWidth / _targetWidth) : (window.innerHeight / _targetHeight);
var _width = _targetWidth * _scale;
var _height = _targetHeight * _scale;

console.log("width " + _width + ", height " + _height + ", scale " + _scale);
var _renderer = PIXI.autoDetectRenderer(_width, _height);
_renderer.autoResize = true;
document.body.appendChild(_renderer.view);

var _stage = new PIXI.Container();
_renderer.render(_stage);

var _player;
var _players = {};

PIXI.loader
    .add("avatar", "img/avatar.png")
    .add("laser", "img/laser.png")
    .add("shield_silver", "img/shield_silver.png")
    .load(connectToServer);

var _webSocket;
function connectToServer() {
    _webSocket = new WebSocket("ws://localhost:8080/websocket");
    _webSocket.binaryType = 'arraybuffer';
    _webSocket.onmessage = processMessage;
    _webSocket.onopen = processConnection;
}

function processConnection() {
    _player = new ControlledPlayer();
    _stage.addChild(_player.sprite);
    requestAnimationFrame(gameLoop);
    // powerUpFactory();
}

function processMessage(response) {
    var event;
    var byteBuffer = new flatbuffers.ByteBuffer(new Uint8Array(response.data));
    if (Event.PlayerConnected.bufferHasIdentifier(byteBuffer)) {
        event = Event.PlayerConnected.getRootAsPlayerConnected(byteBuffer);
        var player = new Player();
        _stage.addChild(player.sprite);
        _players[event.id()] = player;
    } else if (Event.PlayerAccelerated.bufferHasIdentifier(byteBuffer)) {
        event = Event.PlayerAccelerated.getRootAsPlayerAccelerated(byteBuffer);
        _players[event.id()].accelerated(event);
    } else if (Event.PlayerDecelerated.bufferHasIdentifier(byteBuffer)) {
        event = Event.PlayerDecelerated.getRootAsPlayerDecelerated(byteBuffer);
        _players[event.id()].decelerated(event);
    } else if (Event.PlayerTurned.bufferHasIdentifier(byteBuffer)) {
        event = Event.PlayerTurned.getRootAsPlayerTurned(byteBuffer);
        _players[event.id()].turned(event);
    } else {
        console.log("Unhandled message");
    }
}

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
    //setTimeout(powerUpFactory, Math.random() * 10000 + 5000);
}

function update(deltaTime) {
    var i;
    for (i = 0; i < _stage.children.length; i++) {
        _stage.children[i].component.update(deltaTime);
    }

    for (i = 0; i < _stage.children.length; i++) {
        var child = _stage.children[i];
        if (child.component instanceof PowerUp && collide(_player.sprite, child)) {
            _stage.removeChild(child);
        }
    }
}

function draw() {
    _renderer.render(_stage);
}

MainLoop.setUpdate(update).setDraw(draw).start();