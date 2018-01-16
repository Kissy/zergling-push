var ZerglingPush = ZerglingPush || {};

ZerglingPush.PlayState = {
    preload: function() {
        this.game.load.image('avatar', 'img/ship1.png');
        this.game.load.image('hostile', 'img/ship1-enemy.png');
        this.game.load.image('laser', 'img/laser.png');
        this.game.load.image('shield_silver', 'img/shield_silver.png');
        this.game.load.spritesheet('fire', 'img/fire-sprite.png', 10, 30, 3);

        this.game.net.webSocket.onmessage = this.onWebSocketMessage.bind(this);
    },
    create: function() {
        this.game.time.ping = 0;
        this.game.time.latency = 0;
        this.game.time.advancedTiming = true;

        this.sendTimeSyncRequest();
        this.game.time.events.loop(1000, this.sendTimeSyncRequest, this);

        this.world = new World(this);

        var playerConnectBuilder = new flatbuffers.Builder();
        Event.PlayerConnect.startPlayerConnect(playerConnectBuilder);
        Event.PlayerConnect.finishPlayerConnectBuffer(playerConnectBuilder, Event.PlayerConnect.endPlayerConnect(playerConnectBuilder));
        this.game.net.webSocket.send(playerConnectBuilder.asUint8Array());
    },
    update: function() {
        // var performanceNow = performance.now();
        // game.time.physicsElapsed = (performanceNow - game.time.performanceTime) / 1000;
        // game.time.physicsElapsedMS = game.time.physicsElapsed * 1000;
        // game.time.performanceTime = performanceNow;
        // TODO Check times
        this.game.time.serverTime += this.game.time.physicsElapsedMS;
        this.game.time.localTime += this.game.time.physicsElapsedMS;
        this.game.time.clientTime += this.game.time.physicsElapsedMS;

        this.world.update();

        var i;

        // Process messages from server
        for (i = 0; i < _messageQueue.length; i++) {
            var event, byteBuffer = _messageQueue[i];
            if (Event.PlayerShot.bufferHasIdentifier(byteBuffer)) {
                event = Event.PlayerShot.getRootAsPlayerShot(byteBuffer);
                _players[event.id()].shot(event);
            } else if (Event.PlayerHit.bufferHasIdentifier(byteBuffer)) {
                event = Event.PlayerHit.getRootAsPlayerHit(byteBuffer);
                _players[event.id()].hit(event);
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
                Event.PlayerSnapshot.startPlayerSnapshot(playerJoinedBuilder);
                Event.PlayerSnapshot.addId(playerJoinedBuilder, idOffset);
                Event.PlayerSnapshot.addX(playerJoinedBuilder, 0);
                Event.PlayerSnapshot.addY(playerJoinedBuilder, 0);
                Event.PlayerSnapshot.addRotation(playerJoinedBuilder, 0);
                var playerSnapshotOffset = Event.PlayerSnapshot.endPlayerSnapshot(playerJoinedBuilder);
                Event.PlayerJoined.startPlayerJoined(playerJoinedBuilder);
                Event.PlayerJoined.addId(playerJoinedBuilder, idOffset);
                Event.PlayerJoined.addTime(playerJoinedBuilder, this.game.time.serverStartTime + this.game.time.now);
                Event.PlayerJoined.addName(playerJoinedBuilder, nameOffset);
                Event.PlayerJoined.addSnapshot(playerJoinedBuilder, playerSnapshotOffset);
                Event.PlayerJoined.finishPlayerJoinedBuffer(playerJoinedBuilder, Event.PlayerJoined.endPlayerJoined(playerJoinedBuilder));
                _inputQueue.push(playerJoinedBuilder.asUint8Array());
            } else {
                console.log("Unhandled message");
            }
        }
        _messageQueue = [];

        // Send global messages to server
        for (i = 0; i < _inputQueue.length; i++) {
            this.game.net.webSocket.send(_inputQueue[i]);
        }
        _inputQueue = [];
    },
    render: function() {
        this.game.debug.text("FPS : " + (this.game.time.fps || '--'), 2, 15, "#00ff00");

        this.game.debug.text("Ping    : " + this.game.time.ping, 2, 30, "#FFFF00");
        this.game.debug.text("Latency : " + this.game.time.latency, 2, 45, "#FFFF00");

        this.game.debug.text("Server Time : " + (this.game.time.serverTime / 1000 || '--'), 2, 75, "#00FFFF");
        this.game.debug.text("Local Time  : " + (this.game.time.localTime / 1000 || '--'), 2, 60, "#00FFFF");
        this.game.debug.text("Client Time : " + (this.game.time.clientTime / 1000 || '--'), 2, 90, "#00FFFF");
        // game.debug.text("Server Time Start : " + (game.time.serverStartTime || '--'), 2, 75, "#00FFFF");

        // _game.debug.text("serverTime : " + (_game.time.serverStartTime + _game.time.now), 10, 20);
        // _game.debug.geom(new Phaser.Line(750 - diff, 0, 750 - diff, 40), "#00FFFF");
        //this.game.debug.text("Snapshots : " + (this.world.snapshotList.snapshots.length || '--'), 2, 120, "#00FFFF");
        //this.game.debug.text("Current SS : " + (this.world.snapshotList.snapshots[0].time() / 1000 || '--'), 2, 140, "#00FFFF");
        /*if (this.world.snapshotList.snapshots[1]) {
            this.game.debug.text("Target SS : " + (this.world.snapshotList.snapshots[1].time() / 1000 || '--'), 2, 160, "#00FFFF");
        }*/

        this.world.debug();
    },
    sendTimeSyncRequest: function sendTimeSyncRequest() {
        var timeSyncRequestBuilder = new flatbuffers.Builder();
        Event.TimeSyncRequest.startTimeSyncRequest(timeSyncRequestBuilder);
        Event.TimeSyncRequest.addTime(timeSyncRequestBuilder, this.game.time.time - _referenceTime);
        Event.TimeSyncRequest.finishTimeSyncRequestBuffer(timeSyncRequestBuilder, Event.TimeSyncRequest.endTimeSyncRequest(timeSyncRequestBuilder));
        _inputQueue.push(timeSyncRequestBuilder.asUint8Array());
    },
    onWebSocketMessage: function onWebSocketMessage(response) {
        var byteBuffer = new flatbuffers.ByteBuffer(new Uint8Array(response.data));
        if (Event.TimeSyncResponse.bufferHasIdentifier(byteBuffer)) {
            var event = Event.TimeSyncResponse.getRootAsTimeSyncResponse(byteBuffer);
            this.game.time.ping = this.game.time.time - _referenceTime - event.time();
            this.game.time.latency = Math.round(this.game.time.ping / 2);
            this.game.time.serverStartTime = event.serverTime();
            // TODO make a world class ?
            this.game.time.serverTime = event.serverTime();
            this.game.time.localTime = event.serverTime() - this.game.time.latency;
            this.game.time.clientTime = event.serverTime() - _remoteClientDelay;
        } else if (Event.WorldSnapshot.bufferHasIdentifier(byteBuffer)) {
            this.world.receiveSnapshot(Event.WorldSnapshot.getRootAsWorldSnapshot(byteBuffer));
        } else if (Event.PlayerJoined.bufferHasIdentifier(byteBuffer)) {
            this.world.playerJoined(Event.PlayerJoined.getRootAsPlayerJoined(byteBuffer));
            //event = Event.PlayerJoined.getRootAsPlayerJoined(byteBuffer);
            //_players[event.id()] = (event.id() === _playerId) ? new ControlledPlayer(event.snapshot()) : new RemotePlayer(event.snapshot());
        } else {
            _messageQueue.push(byteBuffer);
        }
    }
};