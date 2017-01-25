var _targetWidth = 1920;
var _targetHeight = 960;
var _scale = (_targetWidth / _targetHeight >= window.innerWidth / window.innerHeight) ? (window.innerWidth / _targetWidth) : (window.innerHeight / _targetHeight);
var _width = _targetWidth * _scale;
var _height = _targetHeight * _scale;

var _referenceTime = new Date();
_referenceTime.setHours(0,0,0,0);
_referenceTime = _referenceTime.getTime();

var _moduloRadian = 2 * Math.PI;

var _playerId;
var _playerVelocityFactor;
var _playerAngularVelocityFactor;
var _playerDecelerationFactor;
var _playerStartingXPosition;
var _playerStartingYPosition;
var _playerStartingRotation;
var _playerFiringRate = 15;
var _playerWidth = 32 * _scale;
var _playerHeight = 38 * _scale;
var _playerNameSpriteYOffset = -10;
//var _playerPlayground = new PIXI.Rectangle(_playerWidth / 2, _playerHeight / 2, _width - _playerWidth / 2, _height - _playerHeight / 2);

var _laserFullVelocity = 800 * _scale;

console.log("width " + _width + ", height " + _height + ", scale " + _scale);
var _game = new Phaser.Game(_width, _height, Phaser.AUTO, '',
    {
        preload: preload,
        create: create,
        update: update,
        render: render
    });

function preload () {
    _game.stage.disableVisibilityChange = true;
    _game.load.image('avatar', 'img/avatar.png');
    _game.load.image('hostile', 'img/hostile.png');
    _game.load.image('laser', 'img/laser.png');
    _game.load.image('shield_silver', 'img/shield_silver.png');
}

var _webSocket;
var _inputQueue = [];
var _messageQueue = [];
var _players = {};


function create() {
    _game.physics.startSystem(Phaser.Physics.ARCADE);
    _game.world.setBounds(0, 0, _width, _height);
    _game.world.sortDirection = Phaser.Physics.Arcade.SORT_NONE;

    _webSocket = new WebSocket("ws://" + window.location.hostname + ":8080/websocket");
    _webSocket.binaryType = 'arraybuffer';
    _webSocket.onmessage = function processMessage(response) {
        var byteBuffer = new flatbuffers.ByteBuffer(new Uint8Array(response.data));
        _messageQueue.push(byteBuffer);
    };
}

function update(deltaTime) {
    var i;

    // Process messages from server
    for (i = 0; i < _messageQueue.length; i++) {
        var event, byteBuffer = _messageQueue[i];
        if (Event.PlayerMoved.bufferHasIdentifier(byteBuffer)) {
            event = Event.PlayerMoved.getRootAsPlayerMoved(byteBuffer);
            _players[event.id()].moved(event);
        } else if (Event.PlayerShot.bufferHasIdentifier(byteBuffer)) {
            event = Event.PlayerShot.getRootAsPlayerShot(byteBuffer);
            _players[event.id()].shot(event);
        } else if (Event.PlayerHit.bufferHasIdentifier(byteBuffer)) {
            event = Event.PlayerHit.getRootAsPlayerHit(byteBuffer);
            _players[event.id()].hit(event);
        } else if (Event.PlayerJoined.bufferHasIdentifier(byteBuffer)) {
            event = Event.PlayerJoined.getRootAsPlayerJoined(byteBuffer);
            _players[event.id()] = (event.id() == _playerId) ? new ControlledPlayer(event) : new RemotePlayer(event);
        } else if (Event.PlayerLeaved.bufferHasIdentifier(byteBuffer)) {
            event = Event.PlayerLeaved.getRootAsPlayerLeaved(byteBuffer);
            if (_players[event.id()]) {
                _players[event.id()].destroy();
                delete _players[event.id()];
            }
        } else if (Event.PlayerConnected.bufferHasIdentifier(byteBuffer)) {
            event = Event.PlayerConnected.getRootAsPlayerConnected(byteBuffer);
            _playerId = event.id();
            _playerVelocityFactor = event.velocityFactor() * _scale;
            _playerAngularVelocityFactor = event.angularVelocityFactor();
            _playerDecelerationFactor = event.decelerationFactor();
            _playerStartingXPosition = event.startingXPosition();
            _playerStartingYPosition = event.startingYPosition();
            _playerStartingRotation = event.startingRotation();

            // TODO press enter to join
            var builder = new flatbuffers.Builder();
            var idOffset = builder.createString(_playerId);
            var nameOffset = builder.createString(_playerId);
            Event.PlayerJoined.startPlayerJoined(builder);
            Event.PlayerJoined.addId(builder, idOffset);
            Event.PlayerJoined.addTime(builder, new Date().getTime() - _referenceTime);
            Event.PlayerJoined.addName(builder, nameOffset);
            Event.PlayerJoined.addX(builder, _playerStartingXPosition);
            Event.PlayerJoined.addY(builder, _playerStartingYPosition);
            Event.PlayerJoined.addRotation(builder, _playerStartingRotation);
            Event.PlayerJoined.finishPlayerJoinedBuffer(builder, Event.PlayerJoined.endPlayerJoined(builder));
            _inputQueue.push(builder.asUint8Array());
        } else {
            console.log("Unhandled message");
        }
    }
    _messageQueue = [];

    // Send messages to server
    for (i = 0; i < _inputQueue.length; i++) {
        _webSocket.send(_inputQueue[i]);
    }
    _inputQueue = [];
}

function render () {
    if (_players[_playerId]) {
        _game.debug.spriteInfo(_players[_playerId], 32, 32);
        _game.debug.body(_players[_playerId]);
    }
}
