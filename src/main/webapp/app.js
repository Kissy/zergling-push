var _targetWidth = 1920;
var _targetHeight = 960;
var _scale = (_targetWidth / _targetHeight >= window.innerWidth / window.innerHeight) ? (window.innerWidth / _targetWidth) : (window.innerHeight / _targetHeight);
var _width = _targetWidth * _scale;
var _height = _targetHeight * _scale;

var _playerVelocityFactor;
var _playerAngularVelocityFactor;
var _playerDecelerationFactor;
var _laserFullVelocity = 2 * _scale;
var _laserStartingLifespan = 1000;
var _moduloRadian = 2 * Math.PI;

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
}

var _inputQueue = [];
var _messageQueue = [];
function processMessage(response) {
    var byteBuffer = new flatbuffers.ByteBuffer(new Uint8Array(response.data));
    _messageQueue.push(byteBuffer);
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

function begin() {

}

function update(deltaTime) {
    var i;

    // Process messages from server
    for (i = 0; i < _messageQueue.length; i++) {
        var event, byteBuffer = _messageQueue[i];
        if (Event.PlayerConnected.bufferHasIdentifier(byteBuffer)) {
            event = Event.PlayerConnected.getRootAsPlayerConnected(byteBuffer);
            _playerVelocityFactor = event.velocityFactor() * _scale;
            _playerAngularVelocityFactor = event.angularVelocityFactor();
            _playerDecelerationFactor = event.decelerationFactor();
            console.log(_playerDecelerationFactor);

            _player = new ControlledPlayer();
            _player.id = event.id();
            _player.name = event.name();
            _player.sprite.x = event.x() * _scale;
            _player.sprite.y = event.y() * _scale;
            _stage.addChild(_player.sprite);
            _players[event.id()] = _player;
        } else if (Event.PlayerJoined.bufferHasIdentifier(byteBuffer)) {
            event = Event.PlayerJoined.getRootAsPlayerJoined(byteBuffer);
            console.log("Player joined " + event.id());
            var player = new Player();
            player.name = event.name();
            player.sprite.x = event.x() * _scale;
            player.sprite.y = event.y() * _scale;
            _stage.addChild(player.sprite);
            _players[event.id()] = player;
        } else if (Event.PlayerLeaved.bufferHasIdentifier(byteBuffer)) {
            event = Event.PlayerLeaved.getRootAsPlayerLeaved(byteBuffer);
            console.log("Player leaved " + event.id());
            if (_players[event.id()]) {
                _stage.removeChild(_players[event.id()].sprite);
                delete _players[event.id()];
            }
        } else if (Event.PlayerMoved.bufferHasIdentifier(byteBuffer)) {
            event = Event.PlayerMoved.getRootAsPlayerMoved(byteBuffer);
            console.log("Player moved " + event.id());
            _players[event.id()].moved(event);
        } else {
            console.log("Unhandled message");
        }
    }
    _messageQueue = [];

    for (i = 0; i < _stage.children.length; i++) {
        _stage.children[i].component.update(deltaTime);
    }

    // Send messages to server
    for (i = 0; i < _inputQueue.length; i++) {
        _webSocket.send(_inputQueue[i]);
    }
    _inputQueue = [];

    /*for (i = 0; i < _stage.children.length; i++) {
        var child = _stage.children[i];
        if (child.component instanceof PowerUp && collide(_player.sprite, child)) {
            _stage.removeChild(child);
        }
    }*/
}

function draw() {
    _renderer.render(_stage);
}

MainLoop.setUpdate(update).setBegin(begin).setDraw(draw).start();