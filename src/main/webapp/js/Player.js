(function (window) {
    var _playerFullVelocity = 10;
    var _playerFullAngularVelocity = 0.1;
    var _playerDeceleration = 0.5;

    function Player() {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources['avatar'].texture);
        this.sprite.component = this;
        this.sprite.x = window.innerWidth / 2 - this.sprite.width / 2;
        this.sprite.y = window.innerHeight / 2 - this.sprite.height / 2;
        this.sprite.scale.x = _xScale;
        this.sprite.scale.y = _yScale;
        this.sprite.anchor.set(0.5, 0.5);
        this.playerPlayground = new PIXI.Rectangle(this.sprite.width / 2, this.sprite.height / 2,
            window.innerWidth - this.sprite.width / 2, window.innerHeight - this.sprite.height / 2);
        this.sprite.rotation = 0;
        this.velocity = 0;
        this.deceleration = 0;
        this.angularVelocity = 0;
        Keyboard.bind('up', this.accelerate.bind(this), this.decelerate.bind(this));
        Keyboard.bind('right', this.turnRight.bind(this), this.turnLeft.bind(this));
        Keyboard.bind('left', this.turnLeft.bind(this), this.turnRight.bind(this));
        Keyboard.bind('a', this.fire.bind(this));
    }

    Player.prototype.accelerate = function accelerate() {
        this.deceleration = 0;
        this.velocity = _playerFullVelocity;
    };
    Player.prototype.decelerate = function decelerate() {
        this.deceleration = _playerDeceleration;
    };
    Player.prototype.turnRight = function turnRight() {
        this.angularVelocity += _playerFullAngularVelocity;
        _websocket.send("turnRight");
    };
    Player.prototype.turnLeft = function turnLeft() {
        this.angularVelocity -= _playerFullAngularVelocity;
        _websocket.send("turnLeft");
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