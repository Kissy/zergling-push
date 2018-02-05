import * as Phaser from "phaser";

class Projectile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.setDisplaySize(10, 30);

        this.origin = new Phaser.Geom.Point(this.x, this.y);
        this.velocity = new Phaser.Math.Vector2(0, 0);
    }

    setRotation(rotation) {
        this.rotation = rotation;
        this.velocity.setToPolar(rotation - Math.PI / 2, 500);
    }

    setTime(time) {
        this.time = time;
    }

    update (time, delta) {
        super.update(time, delta);

        let currentTime = (time - this.time) / 1000;
        this.x = this.origin.x + currentTime * this.velocity.x;
        this.y = this.origin.y + currentTime * this.velocity.y;
    }

    getId() {
        return this.id;
    }
}

export default Projectile

/*var ZerglingPush = ZerglingPush || {};

ZerglingPush.Projectile = function (game, event) {
    Phaser.Sprite.call(this, game, event.x(), event.y(), 'laser');
    this.id = event.id();
    this.name = event.id();
    this.anchor.set(0.5);
    this.scale.set(3);
    this.originX = event.x();
    this.originY = event.y();
    this.rotation = event.rotation();
    this.time = event.time() + _remoteClientDelay;
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.velocity = this.game.physics.arcade.velocityFromRotation(event.rotation() - Math.PI / 2, _laserFullVelocity);
    //this.visible = false;
};

ZerglingPush.Projectile.prototype = Object.create(Phaser.Sprite.prototype);
ZerglingPush.Projectile.prototype.constructor = ZerglingPush.Projectile;

ZerglingPush.Projectile.prototype.update = function start() {
    var currentTime = (this.game.time.clientTime - this.time) / 1000;
    //this.visible = currentTime > 0;
    this.x = this.originX + currentTime * this.velocity.x;
    this.y = this.originY + currentTime * this.velocity.y;
};

ZerglingPush.Projectile.prototype.start = function start() {
    this.visible = true;
};*/