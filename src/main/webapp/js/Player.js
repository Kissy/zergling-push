(function (window) {
    function Player(event) {
        this.id = event.id();
        this.sprite = new PIXI.Container();
        this.sprite.component = this;
        this.sprite.x = event.x() * _scale;
        this.sprite.y = event.y() * _scale;
        this.sprite.scale.x = _scale;
        this.sprite.scale.y = _scale;
        this.velocity = 0;
        this.angularVelocity = 0;
        this.residualVelocity = 0;

        this.avatarSprite = new PIXI.Sprite(PIXI.loader.resources['hostile'].texture);
        this.avatarSprite.anchor.set(0.5, 0.5);
        this.avatarSprite.rotation = event.rotation();
        this.sprite.addChild(this.avatarSprite);
        this.nameSprite = new PIXI.Text(event.name(), {font: "20px Arial", fill: "#F7531C"});
        this.nameSprite.position.set(- (this.nameSprite.width / 2), - (_playerHeight + this.nameSprite.height + _playerNameSpace * _scale));
        this.sprite.addChild(this.nameSprite);
    }

    Player.prototype.moved = function moved(event) {
        if (this.velocity != event.velocity()) {
            this.residualVelocity = 1 - event.velocity();
        }

        this.sprite.x = event.x() * _scale;
        this.sprite.y = event.y() * _scale;
        this.avatarSprite.rotation = event.rotation();
        this.velocity = event.velocity();
        this.angularVelocity = event.angularVelocity();
    };
    Player.prototype.shot = function shot(event) {
        var laser = new Laser(event.x() * _scale, event.y() * _scale, event.rotation());
        _stage.addChild(laser.sprite);
    };
    Player.prototype.fire = function fire() {
        var x = this.sprite.x + this.sprite.width * Math.sin(this.avatarSprite.rotation);
        var y = this.sprite.y - this.sprite.height * Math.cos(this.avatarSprite.rotation);
        var laser = new Laser(x, y, this.avatarSprite.rotation);
        _stage.addChild(laser.sprite);
        return laser;
    };
    Player.prototype.update = function update(deltaTime) {
        this.residualVelocity = Math.max(this.residualVelocity - _playerDecelerationFactor, 0);

        var currentVelocity = (this.velocity + this.residualVelocity) * _playerVelocityFactor * deltaTime;
        this.sprite.x = clamp(this.sprite.x + currentVelocity * Math.sin(this.avatarSprite.rotation),
            _playerPlayground.x, _playerPlayground.width);
        this.sprite.y = clamp(this.sprite.y - currentVelocity * Math.cos(this.avatarSprite.rotation),
            _playerPlayground.y, _playerPlayground.height);
        this.avatarSprite.rotation = (this.avatarSprite.rotation + this.angularVelocity * _playerAngularVelocityFactor * deltaTime) % _moduloRadian;
    };

    window.Player = Player;
})(window);