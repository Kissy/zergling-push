/* globals __DEV__ */

import * as Phaser from "phaser";
import NetworkManager from "./../NetworkManager";
import ControlledPlayer from "../objects/ControlledPlayer";
import SnapshotList from "../SnapshotList";
import RemoteClock from "../RemoteClock";
import Projectile from "../objects/Projectile";
import RemotePlayer from "../objects/RemotePlayer";

var _playerId;
export var _playerVelocityFactor;
export var _playerAngularVelocityFactor;
var _playerDecelerationFactor;
var _playerStartingXPosition;
var _playerStartingYPosition;
var _playerStartingRotation;
var _playerFireRate;
var _laserFullVelocity;
var _remoteClientDelay = 100; // TODO send from server ?

const Event = fr.kissy.zergling_push.event;

class MainScene extends Phaser.Scene {
    constructor() {
        super({key: 'Main'});
    }

    preload() {
        this.load.svg('avatar', 'img/ship1.svg');
        this.load.svg('hostile', 'img/ship1-enemy.svg');
        this.load.image('laser', 'img/laser.png');
        this.load.image('shield_silver', 'img/shield_silver.png');
        this.load.image('grid', 'img/grid-hexa.png');
        this.load.spritesheet('fire', 'img/fire-sprite.png', {frameWidth: 10, frameHeight: 30, endFrame: 3});
    }

    create() {
        //this.cameras.main.setZoom(1); // TODO calculate a good zoom
        this.remoteClock = new RemoteClock(this);

        var background = this.add.tileSprite(1920 / 2, 960 / 2, 1920, 960, 'grid');
        background.alpha = 0.3;

        this.network = NetworkManager.get(this.sys.game);
        this.network.on('message', this.onNetworkMessage, this);

        this.time.addEvent({ delay: 1000, callback: this.sendTimeSyncRequest, callbackScope: this, loop: true });

        this.snapshotList = new SnapshotList(this);
        this.players = this.add.group({
            classType: RemotePlayer,
            runChildUpdate: true
        });
        this.projectiles = this.add.group({
            classType: Projectile,
            runChildUpdate: true
        });

        //this.world = new World(this);

        let playerConnectBuilder = new flatbuffers.Builder();
        Event.PlayerConnect.startPlayerConnect(playerConnectBuilder);
        Event.PlayerConnect.finishPlayerConnectBuffer(playerConnectBuilder, Event.PlayerConnect.endPlayerConnect(playerConnectBuilder));
        this.network.send(playerConnectBuilder);
    }

    update(time, delta) {
        this.remoteClock.update(time, delta);
        let updated = this.snapshotList.update(time, delta);
        if (updated) {
            const playerSnapshots = {};
            const targetSnapshot = this.snapshotList.getTargetSnapshot();
            for (let i = 0; i < targetSnapshot.playersLength(); i++) {
                const playerSnapshot = targetSnapshot.players(i);
                playerSnapshots[playerSnapshot.id()] = playerSnapshot;
            }
            this.players.getChildren().forEach(function (player) { // TODO use named function
                const playerSnapshot = playerSnapshots[player.getId()];
                if (playerSnapshot) {
                    player.receiveSnapshot(playerSnapshot);
                    delete playerSnapshots[player.getId()];
                } else {
                    player.setActive(false);
                    player.setVisible(false);
                }
            });
            for (let i in playerSnapshots) {
                let remotePlayer = new RemotePlayer(this, playerSnapshots[i].x(), playerSnapshots[i].y(), 'hostile');
                remotePlayer.receiveSnapshot(playerSnapshots[i]);
                remotePlayer.receiveSnapshot(playerSnapshots[i]);
                this.players.add(remotePlayer, true);
            }
            const projectileSnapshots = {};
            for (let i = 0; i < targetSnapshot.projectilesLength(); i++) {
                const projectileSnapshot = targetSnapshot.projectiles(i);
                projectileSnapshots[projectileSnapshot.id()] = projectileSnapshot;
            }
            this.projectiles.getChildren().forEach(function (projectile) { // TODO use named function
                const projectileSnapshot = projectileSnapshots[projectile.getId()];
                if (projectileSnapshot) {
                    //projectile.receiveSnapshot(projectileSnapshot);
                    delete projectileSnapshots[projectile.getId()];
                } else {
                    projectile.setActive(false);
                    projectile.setVisible(false);
                }
            });
            /*for (let i in playerSnapshots) {
                let remotePlayer = new RemotePlayer(this, playerSnapshots[i].x(), playerSnapshots[i].y(), 'hostile');
                remotePlayer.receiveSnapshot(playerSnapshots[i]);
                remotePlayer.receiveSnapshot(playerSnapshots[i]);
                this.players.add(remotePlayer, true);
            }*/

        }

        this.snapshotCurrentTime = (this.remoteClock.getLocalTime() - this.snapshotList.getCurrentSnapshot().time())
            / (this.snapshotList.getTargetSnapshot().time() - this.snapshotList.getCurrentSnapshot().time());
    }

    onNetworkMessage(byteBuffer) {
        if (Event.TimeSyncResponse.bufferHasIdentifier(byteBuffer)) {
            this.remoteClock.onTimeSyncResponse(byteBuffer);
        } else if (Event.WorldSnapshot.bufferHasIdentifier(byteBuffer)) {
            this.snapshotList.receiveSnapshot(Event.WorldSnapshot.getRootAsWorldSnapshot(byteBuffer));
        } else if (Event.PlayerJoined.bufferHasIdentifier(byteBuffer)) {
            this.playerJoined(Event.PlayerJoined.getRootAsPlayerJoined(byteBuffer));
        } else if (Event.PlayerConnected.bufferHasIdentifier(byteBuffer)) {
            this.playerConnected(Event.PlayerConnected.getRootAsPlayerConnected(byteBuffer));
        } else {
            console.log(byteBuffer);
        }
    }

    sendTimeSyncRequest() {
        let timeSyncRequestBuilder = new flatbuffers.Builder();
        Event.TimeSyncRequest.startTimeSyncRequest(timeSyncRequestBuilder);
        Event.TimeSyncRequest.addTime(timeSyncRequestBuilder, this.time.now);
        Event.TimeSyncRequest.finishTimeSyncRequestBuffer(timeSyncRequestBuilder, Event.TimeSyncRequest.endTimeSyncRequest(timeSyncRequestBuilder));
        this.network.send(timeSyncRequestBuilder);
    }

    playerConnected(event) {
        // TODO settings ?
        _playerId = event.id();
        _playerVelocityFactor = event.velocityFactor();
        console.log(_playerVelocityFactor);
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
        controlledPlayer.receiveSnapshot(playerJoinedSnapshot);
        controlledPlayer.receiveSnapshot(playerJoinedSnapshot);
        this.players.add(controlledPlayer, true);
        this.cameras.main.startFollow(controlledPlayer);
    }

    getSnapshotCurrentTime() {
        return this.snapshotCurrentTime;
    }

    destroy() {
        this.webSocket.removeEventListener();
    }
}

export default MainScene;