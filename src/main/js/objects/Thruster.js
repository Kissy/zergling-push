import * as Phaser from "phaser";

class Thruster extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture = 'fire') {
        super(scene, x, y, texture);

        /*his.animations.add('idle', [0, 1], 10, true);
        this.animations.add('burn', [1, 2], 10, true);
        this.animations.play('idle');
        this.anchor.set(0.5);*/
    }
}

export default Thruster


/*
var ZerglingPush = ZerglingPush || {};

ZerglingPush.Thruster = function (game, x, y) {
};

ZerglingPush.Thruster.prototype = Object.create(Phaser.Sprite.prototype);
ZerglingPush.Thruster.prototype.constructor = ZerglingPush.Thruster;

ZerglingPush.Thruster.prototype.start = function start() {
    this.animations.play('burn');
};

ZerglingPush.Thruster.prototype.stop = function start() {
    this.animations.play('idle');
};*/
