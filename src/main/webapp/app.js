var _width = 1920;
var _height = 960;

var _referenceTime = new Date();
_referenceTime.setHours(0,0,0,0);
_referenceTime = _referenceTime.getTime();
var _serverOffset = 0;

var _playerId;
var _playerVelocityFactor;
var _playerAngularVelocityFactor;
var _playerDecelerationFactor;
var _playerStartingXPosition;
var _playerStartingYPosition;
var _playerStartingRotation;

var _laserFullVelocity = 800;

var _game = new Phaser.Game(_width, _height, Phaser.AUTO, '',
    {
        preload: preload,
        create: create,
        update: update,
        render: render
    }, false, true, {
        // 'arcade': true
    });

function preload (game) {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.stage.disableVisibilityChange = true;
    game.load.image('avatar', 'img/avatar.png');
    game.load.image('hostile', 'img/hostile.png');
    game.load.image('laser', 'img/laser.png');
    game.load.image('shield_silver', 'img/shield_silver.png');
}

var _webSocket;
var _inputQueue = [];
var _messageQueue = [];
var _players = {};


function create(game) {
    // game.world.setBounds(0, 0, _width, _height);
    // game.world.sortDirection = Phaser.Physics.Arcade.SORT_NONE;
    game.time.performanceTime = performance.now();

    _webSocket = new WebSocket("ws://" + window.location.hostname + ":8080/websocket");
    _webSocket.binaryType = 'arraybuffer';
    _webSocket.onmessage = function processMessage(response) {
        _messageQueue.push(new Uint8Array(response.data));
    };

    // var pingTimer = new Phaser.Timer(game);
    game.time.events.loop(1000, function() {
        // _webSocket.send()
    });
}

function update(game) {
    var performanceNow = performance.now();
    game.time.physicsElapsed = (performanceNow - game.time.performanceTime) / 1000;
    game.time.physicsElapsedMS = game.time.physicsElapsed * 1000;
    game.time.performanceTime = performanceNow;

    var i;

    // Process messages from server
    for (i = 0; i < _messageQueue.length; i++) {
        var event, byteBuffer = new flatbuffers.ByteBuffer(_messageQueue[i]);
        if (Event.WorldSnapshot.bufferHasIdentifier(byteBuffer)) {
            event = Event.WorldSnapshot.getRootAsWorldSnapshot(byteBuffer);
            for (var p = 0; p < event.playersLength(); p++) {
                var playerSnapshot = event.players(p);
                if (_players[playerSnapshot.id()]) {
                    playerSnapshot.time = event.time();
                    _players[playerSnapshot.id()].processSnapshot(playerSnapshot);
                }
            }
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
            console.log("player leaved");
            if (_players[event.id()]) {
                _players[event.id()].destroy();
                delete _players[event.id()];
            }
        } else if (Event.PlayerConnected.bufferHasIdentifier(byteBuffer)) {
            event = Event.PlayerConnected.getRootAsPlayerConnected(byteBuffer);
            _playerId = event.id();
            _playerVelocityFactor = event.velocityFactor();
            _playerAngularVelocityFactor = event.angularVelocityFactor() * 2 * Math.PI / 360;
            _playerDecelerationFactor = event.decelerationFactor();
            _playerStartingXPosition = event.startingXPosition();
            _playerStartingYPosition = event.startingYPosition();
            _playerStartingRotation = event.startingRotation();

            var timeSyncRequestBuilder = new flatbuffers.Builder();
            Event.TimeSyncRequest.startTimeSyncRequest(timeSyncRequestBuilder);
            Event.TimeSyncRequest.addTime(timeSyncRequestBuilder, _game.time.time - _referenceTime);
            Event.TimeSyncRequest.finishTimeSyncRequestBuffer(timeSyncRequestBuilder, Event.TimeSyncRequest.endTimeSyncRequest(timeSyncRequestBuilder));
            _inputQueue.push(timeSyncRequestBuilder.asUint8Array());
        } else if (Event.TimeSyncResponse.bufferHasIdentifier(byteBuffer)) {
            event = Event.TimeSyncResponse.getRootAsTimeSyncResponse(byteBuffer);
            _serverOffset = Math.round((event.time() - event.serverTime()) / 2);
            var latency = Math.round((event.time() - event.serverTime()) / 2);
            _game.time.serverStartTime = event.serverStartTime() + latency - this.game.time.now;
            console.log("latency is " + latency);
            console.log("server time is " + (this.game.time.serverStartTime + this.game.time.now));

            // TODO press enter to join
            var playerJoinedBuilder = new flatbuffers.Builder();
            var idOffset = playerJoinedBuilder.createString(_playerId);
            var nameOffset = playerJoinedBuilder.createString(_playerId);
            Event.PlayerJoined.startPlayerJoined(playerJoinedBuilder);
            Event.PlayerJoined.addId(playerJoinedBuilder, idOffset);
            Event.PlayerJoined.addTime(playerJoinedBuilder, this.game.time.serverStartTime + this.game.time.now);
            Event.PlayerJoined.addName(playerJoinedBuilder, nameOffset);
            Event.PlayerJoined.addX(playerJoinedBuilder, _playerStartingXPosition);
            Event.PlayerJoined.addY(playerJoinedBuilder, _playerStartingYPosition);
            Event.PlayerJoined.addRotation(playerJoinedBuilder, _playerStartingRotation);
            Event.PlayerJoined.finishPlayerJoinedBuffer(playerJoinedBuilder, Event.PlayerJoined.endPlayerJoined(playerJoinedBuilder));
            _inputQueue.push(playerJoinedBuilder.asUint8Array());
        } else {
            console.log("Unhandled message");
        }
    }
    _messageQueue = [];

    // Send global messages to server
    for (i = 0; i < _inputQueue.length; i++) {
        _webSocket.send(_inputQueue[i]);
    }
    _inputQueue = [];
}

function render () {
    if (_players[_playerId]) {
        _game.debug.spriteInfo(_players[_playerId], 10, 15);
        // _game.debug.bodyInfo(_players[_playerId], 10, 115);
        // _game.debug.body(_players[_playerId]);

        for (var i in _players) {
            if (_players[i] == _players[_playerId]) {
                continue;
            }

            var player = _players[i];
            if (player.targetSnapshot) {
                // this.game.debug.geom(new Phaser.Rectangle(player.targetSnapshot.x() - 25/2, player.targetSnapshot.y() - 30/2, 25, 30), "rgba(255,0,0,0.4)");
                // this.game.debug.geom(new Phaser.Rectangle(player.currentSnapshot.x() - 25/2, player.currentSnapshot.y() - 30/2, 25, 30), "rgba(0,255,0,0.4)");
            }
        }
    }
}
