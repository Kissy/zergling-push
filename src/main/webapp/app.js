var _width = 1920;
var _height = 960;

var _referenceTime = new Date();
_referenceTime.setHours(0,0,0,0);
_referenceTime = _referenceTime.getTime();

var _playerId;
var _playerVelocityFactor;
var _playerAngularVelocityFactor;
var _playerDecelerationFactor;
var _playerStartingXPosition;
var _playerStartingYPosition;
var _playerStartingRotation;
var _playerFireRate;
var _laserFullVelocity;
var _remoteClientDelay = 500; // TODO send from server ?

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
    // DEBUG
    game.time.advancedTiming = true;

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
    game.time.ping = 0;
    game.time.latency = 0;
    console.log(this.game.time);
    // game.world.setBounds(0, 0, _width, _height);
    // game.world.sortDirection = Phaser.Physics.Arcade.SORT_NONE;

    _webSocket = new WebSocket("ws://" + window.location.hostname + ":8080/websocket");
    _webSocket.binaryType = 'arraybuffer';
    _webSocket.onmessage = function onWebSocketMessage(response) {
        return processMessage(game, response);
    };

    var rainParticle = this.game.add.bitmapData(10, 10);

    rainParticle.ctx.fillStyle = '#19BBF9';
    rainParticle.ctx.fillRect(0, 0, 10, 10);

    var emitter = game.add.emitter(game.world.centerX, game.world.centerY, 200);
    emitter.gravity = 0;
    emitter.width = game.world.width;
    emitter.height = game.world.height;
    // emitter.angle = 10;
    var tween = game.make.tween({ v: 0 }).to( { v: 0.8 }, 1500, "Circ.easeInOut").yoyo(true);
    emitter.alphaData = tween.generateData(60);
    emitter.autoAlpha = true;

    emitter.makeParticles(rainParticle);

    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 0.6;

    // emitter.setYSpeed(600, 1000);
    // emitter.setXSpeed(-5, 5);

    emitter.minRotation = 0;
    emitter.maxRotation = 0;

    emitter.start(false, 1500, 200, 0);
}

// TODO make a world class ?
function processMessage(game, response) {
    var byteBuffer = new flatbuffers.ByteBuffer(new Uint8Array(response.data));
    if (Event.TimeSyncResponse.bufferHasIdentifier(byteBuffer)) {
        var event = Event.TimeSyncResponse.getRootAsTimeSyncResponse(byteBuffer);
        game.time.ping = game.time.time - _referenceTime - event.time();
        game.time.latency = Math.round(game.time.ping / 2);
        game.time.serverStartTime = event.serverTime();
    } else {
        _messageQueue.push(byteBuffer);
    }
}

function update(game) {
    // var performanceNow = performance.now();
    // game.time.physicsElapsed = (performanceNow - game.time.performanceTime) / 1000;
    // game.time.physicsElapsedMS = game.time.physicsElapsed * 1000;
    // game.time.performanceTime = performanceNow;
    game.time.serverTime += game.time.physicsElapsedMS;
    game.time.localTime += game.time.physicsElapsedMS;
    game.time.clientTime += game.time.physicsElapsedMS;

    var i;

    // Process messages from server
    for (i = 0; i < _messageQueue.length; i++) {
        var event, byteBuffer = _messageQueue[i];
        if (Event.WorldSnapshot.bufferHasIdentifier(byteBuffer)) {
            event = Event.WorldSnapshot.getRootAsWorldSnapshot(byteBuffer);
            // TODO make a world class ?
            game.time.serverTime = event.time();
            game.time.localTime = event.time() - game.time.latency;
            game.time.clientTime = event.time() - _remoteClientDelay;
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
            _players[event.id()] = (event.id() === _playerId) ? new ControlledPlayer(event) : new RemotePlayer(event);
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
            _playerFireRate = 500;
            _laserFullVelocity = 1000;

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

            game.time.events.loop(1000, function sendTimeSyncRequest() {
                var timeSyncRequestBuilder = new flatbuffers.Builder();
                Event.TimeSyncRequest.startTimeSyncRequest(timeSyncRequestBuilder);
                Event.TimeSyncRequest.addTime(timeSyncRequestBuilder, game.time.time - _referenceTime);
                Event.TimeSyncRequest.finishTimeSyncRequestBuffer(timeSyncRequestBuilder, Event.TimeSyncRequest.endTimeSyncRequest(timeSyncRequestBuilder));
                _inputQueue.push(timeSyncRequestBuilder.asUint8Array());
            });
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

function render (game) {
    game.debug.text("FPS : " + (game.time.fps || '--'), 2, 15, "#00ff00");

    game.debug.text("Ping    : " + game.time.ping, 2, 30, "#FFFF00");
    game.debug.text("Latency : " + game.time.latency, 2, 45, "#FFFF00");

    game.debug.text("Server Time : " + (game.time.serverTime / 1000 || '--'), 2, 75, "#00FFFF");
    game.debug.text("Local Time  : " + (game.time.localTime / 1000 || '--'), 2, 60, "#00FFFF");
    game.debug.text("Client Time : " + (game.time.clientTime / 1000 || '--'), 2, 90, "#00FFFF");
    // game.debug.text("Server Time Start : " + (game.time.serverStartTime || '--'), 2, 75, "#00FFFF");

    // _game.debug.text("serverTime : " + (_game.time.serverStartTime + _game.time.now), 10, 20);
   // _game.debug.geom(new Phaser.Line(750 - diff, 0, 750 - diff, 40), "#00FFFF");
    var currentPlayer = _players[_playerId];
    if (currentPlayer) {
        game.debug.text("Snapshots : " + (currentPlayer.snapshots.length || '--'), 2, 120, "#00FFFF");
        for (var k = currentPlayer.inputQueue.length - 1; k >= 0; k--) {
            // _game.debug.text(currentPlayer.inputQueue[k].sequence, 2, 40 + (20 * k));
            // _game.debug.geom(currentPlayer.inputQueue[k].sequence, 2, 40 + (20 * k));
        }
    }
}
