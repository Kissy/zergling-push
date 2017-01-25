(function (window) {
    function Player(event, texture) {
        Phaser.Sprite.call(this, _game, event.x() * _scale, event.y() * _scale, texture);

        this.id = event.id();
        this.forwardVelocity = 0;
        this.residualVelocity = 0;
        this.shields = 3;
        this.shots = _game.add.group();
        this.shots.enableBody = true;
        this.shots.physicsBodyType = Phaser.Physics.ARCADE;

        this.scale.set(_scale);
        this.anchor.set(0.5);

        _game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;

        /*this.avatarSprite = ;
        this.avatarSprite.anchor.set(0.5, 0.5);
        this.avatarSprite.rotation = event.rotation();
        this.sprite.addChild(this.avatarSprite);*/
        /*var textX = - (50 / 2);
        var textY = - (_playerHeight + 20 / _scale + _playerNameSpriteYOffset);
        this.nameSprite = new Phaser.Text(_game, textX, textY, event.name(), {font: "15px Arial", fill: "#F7531C"});
        this.nameSprite.alpha = 0.4;
        this.sprite.addChild(this.nameSprite);*/

        _game.add.existing(this);
    }

    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.moved = function moved(event) {
    };
    Player.prototype.shot = function shot(event) {
    };
    Player.prototype.hit = function hit(event) {
        this.shields--;
    };
    Player.prototype.update = function update() {
        this.residualVelocity = Math.max(this.residualVelocity - _playerDecelerationFactor, 0);
        var currentVelocity = (this.forwardVelocity + this.residualVelocity) * _playerVelocityFactor;

        _game.physics.arcade.velocityFromRotation(this.rotation - Math.PI / 2, currentVelocity, this.body.velocity);
    };

    window.Player = Player;
})(window);