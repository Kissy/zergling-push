(function (window) {
    function Player() {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources['avatar'].texture);
        this.sprite.component = this;
        this.sprite.x = _width / 2 - this.sprite.width / 2;
        this.sprite.y = _height / 2 - this.sprite.height / 2;
        this.sprite.scale.x = _scale;
        this.sprite.scale.y = _scale;
        this.sprite.anchor.set(0.5, 0.5);
        this.playerPlayground = new PIXI.Rectangle(this.sprite.width / 2, this.sprite.height / 2,
            _width - this.sprite.width / 2, _height - this.sprite.height / 2);
        this.sprite.rotation = 0;
        this.velocity = 0;
        this.angularVelocity = 0;
        this.residualVelocity = 0;
    }

    Player.prototype.moved = function moved(event) {
        if (this.velocity != event.velocity()) {
            this.residualVelocity = 1 - event.velocity();
        }

        this.sprite.x = event.x() * _scale;
        this.sprite.y = event.y() * _scale;
        this.sprite.rotation = event.rotation();
        this.velocity = event.velocity();
        this.angularVelocity = event.angularVelocity();
    };
    Player.prototype.fire = function fire() {
        var x = this.sprite.x + this.sprite.width * Math.sin(this.sprite.rotation);
        var y = this.sprite.y - this.sprite.height * Math.cos(this.sprite.rotation);
        var laser = new Laser(x, y, this.sprite.rotation);
        _stage.addChild(laser.sprite);
    };
    Player.prototype.update = function update(deltaTime) {
        this.residualVelocity = Math.max(this.residualVelocity - _playerDecelerationFactor, 0);

        var currentVelocity = (this.velocity + this.residualVelocity) * _playerVelocityFactor * deltaTime;
        this.sprite.x = clamp(this.sprite.x + currentVelocity * Math.sin(this.sprite.rotation),
            this.playerPlayground.x, this.playerPlayground.width);
        this.sprite.y = clamp(this.sprite.y - currentVelocity * Math.cos(this.sprite.rotation),
            this.playerPlayground.y, this.playerPlayground.height);
        this.sprite.rotation = (this.sprite.rotation + this.angularVelocity * _playerAngularVelocityFactor * deltaTime) % _moduloRadian;
    };

    window.Player = Player;
})(window);