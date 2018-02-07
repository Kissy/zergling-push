import * as Phaser from "phaser";
import Player from "./Player";
import {_playerAngularVelocityFactor, _playerVelocityFactor} from "../scenes/Play";
import Projectile from "./Projectile";

const Event = fr.kissy.zergling_push.event;

class ControlledPlayer extends Player {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.inputSequence = 0;
        this.inputQueue = [];
        this.nextFireTime = 0;
        this.nextShotId = 1;

        this.cursorKeys = this.scene.input.keyboard.addKeys({
            up:  Phaser.Input.Keyboard.KeyCodes.UP,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }

    preUpdate (time, delta) {
        super.preUpdate(time, delta);

        // if (_game.time.now < this.nextProcessInputTime) {
        // console.log("skipping " + _game.time.now);
        // return;
        // }

        // console.log("sampling " + _game.time.now);
        //this.nextProcessInputTime = this.time.now + SAMPLE_INPUT_RATE;
        //console.log(this.nextProcessInputTime);

        // var self = this, event;
        const event = this.createPlayerMoved(delta);
        const byteBuffer = new flatbuffers.ByteBuffer(event.asUint8Array());
        const currentEvent = Event.PlayerMoved.getRootAsPlayerMoved(byteBuffer);

        if (currentEvent.firing()) {
            if (time > this.nextFireTime) {
                this.nextFireTime = time + 1000; // TODO get from server & sync from snapshots
                let x = this.x + (this.displayHeight) * Math.sin(this.rotation);
                let y = this.y - (this.displayHeight) * Math.cos(this.rotation);
                let projectile = new Projectile(this.scene, x, y, 'laser');
                projectile.id = this.getId() + this.nextShotId ++;
                projectile.setRotation(this.rotation);
                projectile.setTime(time); // TODO find right time
                this.scene.projectiles.add(projectile, true);
            }
        }

        this.inputQueue.push(currentEvent);

        // TODO send only at 30 fps
        this.scene.network.send(event);

        /*if (this.cursorKeys.isDown) {
             if (_game.time.now > this.nextFireTime) {
                 this.nextFireTime = _game.time.now + _playerFireRate;
                 event = this.createPlayerShot();

                 var byteBuffer = new flatbuffers.ByteBuffer(event);
                 var currentEvent = Event.PlayerShot.getRootAsPlayerShot(byteBuffer);
                 this.shots.add(new Laser(this, currentEvent));

                 _webSocket.send(event);
             }
         }*/
    }

    update (time, delta) {
        super.update(time, delta);

        // Client prediction (apply queued inputs)
        this.rotation = this.targetSnapshot.rotation();
        this.x = this.targetSnapshot.x();
        this.y = this.targetSnapshot.y();

        for (let j = 0; j < this.inputQueue.length; j++) {
            const currentEvent = this.inputQueue[j];
            let duration = currentEvent.duration() / 1000;
            this.rotation += currentEvent.angularVelocity() * _playerAngularVelocityFactor * duration;
            this.x += currentEvent.velocity() * _playerVelocityFactor * Math.sin(this.rotation) * duration;
            this.y -= currentEvent.velocity() * _playerVelocityFactor * Math.cos(this.rotation) * duration;
        }

        // Detect collision
        if (this.inputQueue.length > 0) {
            this.x = Phaser.Math.Clamp(this.x, 0, 1920);
            this.y = Phaser.Math.Clamp(this.y, 0, 960);
        }
    }

    getId() {
        return this.targetSnapshot.id();
    }

    receiveSnapshot (playerSnapshot) {
        this.targetSnapshot = playerSnapshot;

        for (let i = 0; i < this.inputQueue.length; i++) {
            let currentEvent = this.inputQueue[i];
            if (currentEvent.sequence() > playerSnapshot.sequence()) {
                this.inputQueue.splice(0, i);
                break;
            }
        }
    }

    createPlayerMoved(delta) {
        const builder = new flatbuffers.Builder();
        //const idOffset = builder.createString(this.name);
        Event.PlayerMoved.startPlayerMoved(builder);
        //Event.PlayerMoved.addId(builder, idOffset);
        //Event.PlayerMoved.addTime(builder, this.time.now);
        Event.PlayerMoved.addDuration(builder, delta);
        Event.PlayerMoved.addSequence(builder, ++this.inputSequence);
        Event.PlayerMoved.addVelocity(builder, this.cursorKeys.up.isDown);
        Event.PlayerMoved.addAngularVelocity(builder, this.cursorKeys.right.isDown - this.cursorKeys.left.isDown);
        Event.PlayerMoved.addFiring(builder, this.cursorKeys.space.isDown);
        Event.PlayerMoved.finishPlayerMovedBuffer(builder, Event.PlayerMoved.endPlayerMoved(builder));
        return builder;
    }
}

export default ControlledPlayer;
