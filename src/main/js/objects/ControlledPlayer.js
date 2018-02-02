import * as Phaser from "phaser";
import RemotePlayer from "./RemotePlayer";
import {_playerAngularVelocityFactor, _playerVelocityFactor} from "../scenes/Play";
import Projectile from "./Projectile";

class ControlledPlayer extends RemotePlayer {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.inputSequence = 0;
        this.inputQueue = [];
        this.nextFireTime = 0;

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
        this.inputQueue.push({
            event: event,
            sequence: this.inputSequence
        });

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
            const currentInput = this.inputQueue[j];
            const byteBuffer = new flatbuffers.ByteBuffer(currentInput.event.asUint8Array());
            const currentEvent = Event.PlayerMoved.getRootAsPlayerMoved(byteBuffer);
            let duration = currentEvent.duration() / 1000;
            this.rotation += currentEvent.angularVelocity() * _playerAngularVelocityFactor * duration;
            if (currentInput.done !== true && currentEvent.firing() === true) {
                currentInput.done = true;
            }
            this.x += currentEvent.velocity() * _playerVelocityFactor * Math.sin(this.rotation) * duration;
            this.y -= currentEvent.velocity() * _playerVelocityFactor * Math.cos(this.rotation) * duration;

            if (currentEvent.firing()) {
                if (time > this.nextFireTime) {
                    console.log("firing");
                    this.nextFireTime = time + 2000;
                    let x = this.x + (this.height + 10) * Math.sin(this.rotation);
                    let y = this.y - (this.height + 10) * Math.cos(this.rotation);
                    let projectile = new Projectile(this.scene, x, y, 'laser');
                    projectile.setRotation(this.rotation);
                    projectile.setTime(time); // TODO find right time
                    this.scene.projectiles.add(projectile, true);
                }
            }
        }

        // Detect collision
        if (this.inputQueue.length > 0) {
            this.x = Phaser.Math.Clamp(this.x, 0, 1920);
            this.y = Phaser.Math.Clamp(this.y, 0, 960);
        }
    }

    receiveSnapshot (playerSnapshot) {
        super.receiveSnapshot(playerSnapshot);

        for (let i = 0; i < this.inputQueue.length; i++) {
            let currentInput = this.inputQueue[i];
            if (currentInput.sequence > playerSnapshot.sequence()) {
                this.inputQueue.splice(0, i);
                break;
            }
        }
    }

    createPlayerMoved(delta) {
        const builder = new flatbuffers.Builder();
        const idOffset = builder.createString(this.name);
        Event.PlayerMoved.startPlayerMoved(builder);
        Event.PlayerMoved.addId(builder, idOffset);
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

export default ControlledPlayer


/*

var SAMPLE_INPUT_RATE = 32;

var ControlledPlayer = new Phaser.Class({
    Extends: RemoteSprite,

    update: function (time, delta) {
        console.log(time);
        Object.getPrototypeOf(ControlledPlayer.prototype).update.call(this, time, delta);



    },

    processInputs: function processInputs() {
    }
});


*/