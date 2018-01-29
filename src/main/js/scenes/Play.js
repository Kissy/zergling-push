/* globals __DEV__ */

import * as Phaser from "phaser";
import NetworkManager from "./../NetworkManager";
import ControlledPlayer from "../objects/ControlledPlayer";
import SnapshotList from "../../webapp/js/SnapshotList";
import RemotePlayer from "../objects/RemotePlayer";

var _playerId;
var _playerVelocityFactor;
var _playerAngularVelocityFactor;
var _playerDecelerationFactor;
var _playerStartingXPosition;
var _playerStartingYPosition;
var _playerStartingRotation;
var _playerFireRate;
var _laserFullVelocity;
var _remoteClientDelay = 100; // TODO send from server ?

class MainScene extends Phaser.Scene {
    constructor() {
        super({key: 'Main'});
    }

    preload() {
        this.load.image('avatar', 'img/ship1.png');
        this.load.image('hostile', 'img/ship1-enemy.png');
        this.load.image('laser', 'img/laser.png');
        this.load.image('shield_silver', 'img/shield_silver.png');
        this.load.spritesheet('fire', 'img/fire-sprite.png', {frameWidth: 10, frameHeight: 30, endFrame: 3});
    }

    create() {
        this.network = NetworkManager.get(this.sys.game);
        this.network.on('message', this.onNetworkMessage.bind(this));

        this.snapshotList = new SnapshotList(this.time);
        this.players = this.add.group({
            classType: RemotePlayer,
            runChildUpdate: true
        });

        this.sendTimeSyncRequest();

        //this.game.time.ping = 0;
        //this.game.time.latency = 0;
        //this.game.time.advancedTiming = true;

        //
        //this.game.time.events.loop(1000, this.sendTimeSyncRequest, this);

        //this.world = new World(this);

        let playerConnectBuilder = new flatbuffers.Builder();
        Event.PlayerConnect.startPlayerConnect(playerConnectBuilder);
        Event.PlayerConnect.finishPlayerConnectBuffer(playerConnectBuilder, Event.PlayerConnect.endPlayerConnect(playerConnectBuilder));
        this.network.send(playerConnectBuilder);
    }

    update(time, delta) {
        this.snapshotCurrentTime = (time - this.snapshotList.getCurrentSnapshot().time())
            / (this.snapshotList.getTargetSnapshot().time() - this.snapshotList.getCurrentSnapshot().time());

        // var performanceNow = performance.now();
        // game.time.physicsElapsed = (performanceNow - game.time.performanceTime) / 1000;
        // game.time.physicsElapsedMS = game.time.physicsElapsed * 1000;
        // game.time.performanceTime = performanceNow;
        // TODO Check times
        /*this.game.time.serverTime += this.game.time.physicsElapsedMS;
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
                Event.PlayerJoined.addTime(playerJoinedBuilder, this.game.time.localTime);
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
        */
    }

    render() {
        /*this.game.debug.text("FPS : " + (this.game.time.fps || '--'), 2, 15, "#00ff00");

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
    }

    sendTimeSyncRequest() {
        let timeSyncRequestBuilder = new flatbuffers.Builder();
        Event.TimeSyncRequest.startTimeSyncRequest(timeSyncRequestBuilder);
        Event.TimeSyncRequest.addTime(timeSyncRequestBuilder, this.time.now);
        Event.TimeSyncRequest.finishTimeSyncRequestBuffer(timeSyncRequestBuilder, Event.TimeSyncRequest.endTimeSyncRequest(timeSyncRequestBuilder));
        this.network.send(timeSyncRequestBuilder);
    }

    onNetworkMessage(byteBuffer) {
        if (Event.TimeSyncResponse.bufferHasIdentifier(byteBuffer)) {
            let event = Event.TimeSyncResponse.getRootAsTimeSyncResponse(byteBuffer);
            console.log(event.serverTime() + " " + event.time() + " " + this.time.now);
            //this.time.now = event.serverTime();
            /*this.game.time.ping = this.game.time.time - _referenceTime - event.time();
            this.game.time.latency = Math.round(this.game.time.ping / 2);
            // TODO make a world class ?
            this.game.time.serverTime = event.serverTime();
            this.game.time.localTime = event.serverTime() - this.game.time.latency;
            this.game.time.clientTime = event.serverTime() - _remoteClientDelay;
            */
        } else if (Event.WorldSnapshot.bufferHasIdentifier(byteBuffer)) {
            this.snapshotList.receiveSnapshot(Event.WorldSnapshot.getRootAsWorldSnapshot(byteBuffer));

            /*var playerSnapshots = {};
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
            }*/
        } else if (Event.PlayerJoined.bufferHasIdentifier(byteBuffer)) {
            this.playerJoined(Event.PlayerJoined.getRootAsPlayerJoined(byteBuffer));
        } else if (Event.PlayerConnected.bufferHasIdentifier(byteBuffer)) {
            this.playerConnected(Event.PlayerConnected.getRootAsPlayerConnected(byteBuffer));
        } else {
            console.log(byteBuffer);
        }
    }

    playerConnected(event) {
        // TODO settings ?
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
        let playerJoinedBuilder = new flatbuffers.Builder();
        let idOffset = playerJoinedBuilder.createString(_playerId);
        let nameOffset = playerJoinedBuilder.createString(_playerId);
        Event.PlayerSnapshot.startPlayerSnapshot(playerJoinedBuilder);
        Event.PlayerSnapshot.addId(playerJoinedBuilder, idOffset);
        Event.PlayerSnapshot.addX(playerJoinedBuilder, 0);
        Event.PlayerSnapshot.addY(playerJoinedBuilder, 0);
        Event.PlayerSnapshot.addRotation(playerJoinedBuilder, 0);
        let playerSnapshotOffset = Event.PlayerSnapshot.endPlayerSnapshot(playerJoinedBuilder);
        Event.PlayerJoined.startPlayerJoined(playerJoinedBuilder);
        Event.PlayerJoined.addId(playerJoinedBuilder, idOffset);
        Event.PlayerJoined.addTime(playerJoinedBuilder, this.time.serverStartTime + this.time.now);
        Event.PlayerJoined.addName(playerJoinedBuilder, nameOffset);
        Event.PlayerJoined.addSnapshot(playerJoinedBuilder, playerSnapshotOffset);
        Event.PlayerJoined.finishPlayerJoinedBuffer(playerJoinedBuilder, Event.PlayerJoined.endPlayerJoined(playerJoinedBuilder));
        this.network.send(playerJoinedBuilder);
    }

    playerJoined(playerJoined) {
        const playerJoinedSnapshot = playerJoined.snapshot();
        const controlledPlayer = new ControlledPlayer(this, playerJoinedSnapshot.x(), playerJoinedSnapshot.y(), 'avatar');
        controlledPlayer.updateTargetSnapshot(playerJoinedSnapshot);
        controlledPlayer.updateTargetSnapshot(playerJoinedSnapshot);
        this.players.add(controlledPlayer, true);
    }

    getSnapshotCurrentTime() {
        return this.snapshotCurrentTime;
    }

    destroy() {
        this.webSocket.removeEventListener();
    }
}

export default MainScene

