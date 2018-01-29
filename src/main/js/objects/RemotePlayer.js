import * as Phaser from "phaser";
import RemoteSprite from "./RemoteSprite";

class RemotePlayer extends RemoteSprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        //this.anchor.set(0.5);

        //this.thruster = new ZerglingPush.Thruster(this.game, 1, 48);
        //this.addChild(this.thruster);

        /*this.thruster1 = new ZerglingPush.Thruster(this.game, 26, 38);
        this.thruster1.scale.set(0.7);
        this.addChild(this.thruster1);
        this.thruster2 = new ZerglingPush.Thruster(this.game, -26, 38);
        this.thruster2.scale.set(0.7);
        this.addChild(this.thruster2);

        this.shields = 3;
        this.display = true;*/
    }

    update (time, delta) {
        super.update(time, delta);
    }

    updateTargetSnapshot (playerSnapshot) {
        this.currentSnapshot = this.targetSnapshot;
        this.targetSnapshot = playerSnapshot;
    }
}

export default RemotePlayer



/*
var ZerglingPush = ZerglingPush || {};

(function (window) {
    function Player(game, remoteWorld, event, texture) {
        RemoteSprite.call(this, game, remoteWorld, event, texture);

        this.anchor.set(0.5);

        //this.thruster = new ZerglingPush.Thruster(this.game, 1, 48);
        //this.addChild(this.thruster);

        this.thruster1 = new ZerglingPush.Thruster(this.game, 26, 38);
        this.thruster1.scale.set(0.7);
        this.addChild(this.thruster1);
        this.thruster2 = new ZerglingPush.Thruster(this.game, -26, 38);
        this.thruster2.scale.set(0.7);
        this.addChild(this.thruster2);

        this.shields = 3;
        this.display = true;
    }

    Player.prototype = Object.create(RemoteSprite.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.shot = function shot(event) {
    };
    Player.prototype.hit = function hit(event) {
        this.shields--;
    };
    Player.prototype.update = function update(deltaTime) {
        Object.getPrototypeOf(Player.prototype).update.call(this, deltaTime);
        if (this.moved()) {
            this.thruster1.start();
            this.thruster2.start();
        } else {
            this.thruster1.stop();
            this.thruster2.stop();
        }

        // this.residualVelocity = Math.max(this.residualVelocity - _playerDecelerationFactor, 0);
        // var currentVelocity = (this.forwardVelocity + this.residualVelocity);
        // var xVelocity = currentVelocity * Math.sin(this.rotation);
        // var yVelocity = currentVelocity * Math.cos(this.rotation);
        // this.x += xVelocity * _game.time.physicsElapsed;
        // this.y -= yVelocity * _game.time.physicsElapsed;
    };
    Player.prototype.moved = function moved() {
        return !this.position.equals(this.previousPosition);
    };

    window.Player = Player;
})(window);
*/