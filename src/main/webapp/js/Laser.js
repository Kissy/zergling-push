(function (window) {
    function Laser(player, event) {
        // Phaser.Sprite.call(this, _game, event.x(), event.y(), 'laser');
        Phaser.Sprite.call(this, _game, 0, 0, 'laser');

        // this.id = event.id();
        // this.rotation = event.rotation();

        this.anchor.set(0.5);

        _game.physics.enable(this, Phaser.Physics.ARCADE);

        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.kill();
    }

    Laser.prototype = Object.create(Phaser.Sprite.prototype);
    Laser.prototype.constructor = Laser;

    Laser.prototype.update = function update() {
    };

    Laser.prototype.reset = function(event) {
        Object.getPrototypeOf(Laser.prototype).reset.call(this, event.x(), event.y());
        this.id = event.id();
        this.rotation = event.rotation();
        _game.physics.arcade.velocityFromRotation(event.rotation() - Math.PI / 2, _laserFullVelocity, this.body.velocity);
    };

    window.Laser = Laser;
})(window);