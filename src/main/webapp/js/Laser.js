var ZerglingPush = ZerglingPush || {};

ZerglingPush.Projectile = function (game, event) {
    Phaser.Sprite.call(this, game, event.x(), event.y(), 'laser');
    this.id = event.id();
    this.name = event.id();
    this.anchor.set(0.5);
    this.scale.set(3);
    this.originX = event.x();
    this.originY = event.y();
    this.rotation = event.rotation();
    this.time = event.time()/* + _remoteClientDelay*/;
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
};