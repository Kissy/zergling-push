var World = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function World() {
        Phaser.Scene.call(this, { key: 'World' });
    },
    preload: function () {
        this.load.image('avatar', 'img/avatar.png');
        this.load.image('hostile', 'img/hostile.png');
        this.load.image('laser', 'img/laser.png');
        this.load.image('shield_silver', 'img/shield_silver.png');
        this.load.image("background", "img/background.png");

        this._webSocket = new WebSocket("ws://" + window.location.hostname + ":8080/websocket");
        this._webSocket.binaryType = 'arraybuffer';
        this._webSocket.onmessage = this.processMessage.bind(this);
    },
    create: function() {
        this.time.addEvent({
            delay: 1000,
            callback: function sendTimeSyncRequest() {
                var timeSyncRequestBuilder = new flatbuffers.Builder();
                Event.TimeSyncRequest.startTimeSyncRequest(timeSyncRequestBuilder);
                Event.TimeSyncRequest.addTime(timeSyncRequestBuilder, this.time.time - _referenceTime);
                Event.TimeSyncRequest.finishTimeSyncRequestBuffer(timeSyncRequestBuilder, Event.TimeSyncRequest.endTimeSyncRequest(timeSyncRequestBuilder));
                this._inputQueue.push(timeSyncRequestBuilder.asUint8Array());
            },
            callbackScope: this,
            loop: true
        });

        this.players = this.add.group();

        this._inputQueue = []; // TODO move to ControllerPlayer
        this.snapshotList = new SnapshotList(this.time);
        this.snapshotCurrentTime = 0;

        var background = this.add.sprite(0, 0, "background");
        background.setOrigin(0, 0);

        /*var rainParticle = this.add.bitmapData(10, 10);

        rainParticle.ctx.fillStyle = '#19BBF9';
        rainParticle.ctx.fillRect(0, 0, 10, 10);

        var emitter = this.add.emitter(this.world.centerX, this.world.centerY, 200);
        emitter.gravity = 0;
        emitter.width = this.world.width;
        emitter.height = this.world.height;
        // emitter.angle = 10;
        var tween = this.make.tween({ v: 0 }).to( { v: 0.8 }, 1500, "Circ.easeInOut").yoyo(true);
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
        */
    },
    update: function (time, delta) {
        // var performanceNow = performance.now();
        // this.game.time.physicsElapsed = (performanceNow - this.game.time.performanceTime) / 1000;
        // this.game.time.physicsElapsedMS = this.game.time.physicsElapsed * 1000;
        // this.game.time.performanceTime = performanceNow;
        this.time.serverTime += delta;
        this.time.localTime += delta;
        this.time.clientTime += delta;

        var i;
        // Snapshot update
        var updated = this.snapshotList.update(time, delta);
        if (updated) {
            // TODO set in snapshotList
            var playerSnapshots = {};
            var targetSnapshot = this.snapshotList.getTargetSnapshot();
            for (i = 0; i < targetSnapshot.playersLength(); i++) {
                var playerSnapshot = targetSnapshot.players(i);
                if (!playerSnapshots[playerSnapshot.id()]) {
                    playerSnapshots[playerSnapshot.id()] = {};
                }
                playerSnapshots[playerSnapshot.id()] = playerSnapshot;
            }
            this.players.getChildren().forEach(function (player) { // TODO use named function
                var playerSnapshot = playerSnapshots[player.name];
                if (playerSnapshot) {
                    player.updateTargetSnapshot(playerSnapshot);
                    delete playerSnapshots[player.name];
                } else {
                    player.kill();
                }
            });
            for (var i in playerSnapshots) {
                this.players.add(new Player(this.game, this, playerSnapshots[i], 'hostile'));
            }
            for (var i = 0; i < targetSnapshot.projectilesLength(); i++) {
                var projectileSnapshot = targetSnapshot.projectiles(i);
                // TODO only create once
                if (this.projectiles.getByName(projectileSnapshot.id()) == null) {
                    //this.projectiles.add(new ZerglingPush.Projectile(this.game, projectileSnapshot));
                }
            }
        }

        this.snapshotCurrentTime = (this.time.clientTime - this.snapshotList.getCurrentSnapshot().time())
            / (this.snapshotList.getTargetSnapshot().time() - this.snapshotList.getCurrentSnapshot().time());

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
                Event.PlayerJoined.addTime(playerJoinedBuilder, this.time.serverStartTime + this.time.now);
                Event.PlayerJoined.addName(playerJoinedBuilder, nameOffset);
                Event.PlayerJoined.addSnapshot(playerJoinedBuilder, playerSnapshotOffset);
                Event.PlayerJoined.finishPlayerJoinedBuffer(playerJoinedBuilder, Event.PlayerJoined.endPlayerJoined(playerJoinedBuilder));
                this._inputQueue.push(playerJoinedBuilder.asUint8Array());
            } else {
                console.log("Unhandled message");
            }
        }
        _messageQueue = [];

        // Send global messages to server
        for (i = 0; i < this._inputQueue.length; i++) {
            this._webSocket.send(this._inputQueue[i]);
        }
        this._inputQueue = [];
    },
    receiveSnapshot: function receiveSnapshot(worldSnapshot) {
        this.snapshotList.receiveSnapshot(worldSnapshot);
    },

    getSnapshotCurrentTime: function getSnapshotCurrentTime() {
        return this.snapshotCurrentTime;
    },

    processMessage: function(response) {
        var byteBuffer = new flatbuffers.ByteBuffer(new Uint8Array(response.data));
        if (Event.TimeSyncResponse.bufferHasIdentifier(byteBuffer)) {
            var event = Event.TimeSyncResponse.getRootAsTimeSyncResponse(byteBuffer);
            this.time.ping = this.time.time - _referenceTime - event.time();
            this.time.latency = Math.round(this.time.ping / 2);
            this.time.serverStartTime = event.serverTime();
            // TODO make a world class ?
            this.time.serverTime = event.serverTime();
            this.time.localTime = event.serverTime() - this.time.latency;
            this.time.clientTime = event.serverTime() - _remoteClientDelay;
        } else if (Event.WorldSnapshot.bufferHasIdentifier(byteBuffer)) {
            this.receiveSnapshot(Event.WorldSnapshot.getRootAsWorldSnapshot(byteBuffer));
        } else if (Event.PlayerJoined.bufferHasIdentifier(byteBuffer)) {
            this.playerJoined(Event.PlayerJoined.getRootAsPlayerJoined(byteBuffer));
            //event = Event.PlayerJoined.getRootAsPlayerJoined(byteBuffer);
            //_players[event.id()] = (event.id() === _playerId) ? new ControlledPlayer(event.snapshot()) : new RemotePlayer(event.snapshot());
        } else {
            _messageQueue.push(byteBuffer);
        }
    },
    render: function () {
        /*this.debug.text("FPS : " + (this.time.fps || '--'), 2, 15, "#00ff00");

        this.debug.text("Ping    : " + this.time.ping, 2, 30, "#FFFF00");
        this.debug.text("Latency : " + this.time.latency, 2, 45, "#FFFF00");

        this.debug.text("Server Time : " + (this.time.serverTime / 1000 || '--'), 2, 75, "#00FFFF");
        this.debug.text("Local Time  : " + (this.time.localTime / 1000 || '--'), 2, 60, "#00FFFF");
        this.debug.text("Client Time : " + (this.time.clientTime / 1000 || '--'), 2, 90, "#00FFFF");
        // this.debug.text("Server Time Start : " + (this.time.serverStartTime || '--'), 2, 75, "#00FFFF");

        // _this.debug.text("serverTime : " + (_this.time.serverStartTime + _this.time.now), 10, 20);
        // _this.debug.geom(new Phaser.Line(750 - diff, 0, 750 - diff, 40), "#00FFFF");
        this.debug.text("Snapshots : " + (this.snapshotList.snapshots.length || '--'), 2, 120, "#00FFFF");
        this.debug.text("Current SS : " + (this.snapshotList.snapshots[0].time() / 1000 || '--'), 2, 140, "#00FFFF");
        if (this.snapshotList.snapshots[1]) {
            this.debug.text("Target SS : " + (this.snapshotList.snapshots[1].time() / 1000 || '--'), 2, 160, "#00FFFF");
        }

        this.players.forEachAlive(function (player) {
            player.debug();
        });*/
    }
});