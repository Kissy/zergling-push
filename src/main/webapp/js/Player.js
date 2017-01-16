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
        this.deceleration = 0;
        this.angularVelocity = 0;
    }

    Player.prototype.accelerated = function accelerated(event) {
        this.deceleration = 0;
        this.sprite.x = event.x();
        this.sprite.y = event.y();
        this.sprite.rotation = event.rotation();
        this.velocity = event.velocity();
    };
    Player.prototype.decelerated = function decelerated(event) {
        this.sprite.x = event.x();
        this.sprite.y = event.y();
        this.deceleration = event.deceleration();
    };
    Player.prototype.turned = function turned(event) {
        this.sprite.x = event.x();
        this.sprite.y = event.y();
        this.sprite.rotation = event.rotation();
        this.angularVelocity = event.angularVelocity();
    };
    Player.prototype.fire = function fire() {
        var x = this.sprite.x + this.sprite.width * Math.sin(this.sprite.rotation);
        var y = this.sprite.y - this.sprite.height * Math.cos(this.sprite.rotation);
        var laser = new Laser(x, y, this.sprite.rotation);
        _stage.addChild(laser.sprite);
    };
    Player.prototype.update = function update() {
        this.velocity = Math.max(this.velocity - this.deceleration, 0);

        this.sprite.x = clamp(this.sprite.x + this.velocity * Math.sin(this.sprite.rotation),
            this.playerPlayground.x, this.playerPlayground.width);
        this.sprite.y = clamp(this.sprite.y - this.velocity * Math.cos(this.sprite.rotation),
            this.playerPlayground.y, this.playerPlayground.height);
        this.sprite.rotation += this.angularVelocity;
    };

    window.Player = Player;
})(window);