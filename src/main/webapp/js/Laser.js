var ZerglingPush = ZerglingPush || {};

ZerglingPush.Projectile = function (game, event) {
    Phaser.Sprite.call(this, game, event.x(), event.y(), 'laser');
    this.id = event.id();
    this.name = event.id();
    this.anchor.set(0.5);
    this.scale.set(3);
    this.rotation = event.rotation();
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    // TODO render with few ms in advance
    _game.physics.arcade.velocityFromRotation(event.rotation() - Math.PI / 2, _laserFullVelocity, this.body.velocity);
};

ZerglingPush.Projectile.prototype = Object.create(Phaser.Sprite.prototype);
ZerglingPush.Projectile.prototype.constructor = ZerglingPush.Projectile;

// ZerglingPush.Projectile.prototype.update = function start(deltaTime) {
// };

ZerglingPush.Projectile.prototype.start = function start() {
    this.visible = true;
};