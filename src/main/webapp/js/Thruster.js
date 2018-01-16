var ZerglingPush = ZerglingPush || {};

ZerglingPush.Thruster = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'fire');
    this.animations.add('burn', [0, 1, 2, 1], 10, true);
    this.animations.play('burn');
    this.anchor.set(0.5);
};

ZerglingPush.Thruster.prototype = Object.create(Phaser.Sprite.prototype);
ZerglingPush.Thruster.prototype.constructor = ZerglingPush.Thruster;

ZerglingPush.Thruster.prototype.start = function start() {
    this.visible = true;
};

ZerglingPush.Thruster.prototype.stop = function start() {
    this.visible = false;
};
