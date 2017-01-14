(function (global) {
    var _playerFullVelocity = 10;
    var _playerFullAngularVelocity = 0.1;
    var _playerDeceleration = 0.5;

    function Player() {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources['avatar'].texture);
        this.sprite.component = this;
        this.sprite.width = 34.4;
        this.sprite.height = 40.6;
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.x = window.innerWidth / 2 - this.sprite.width / 2;
        this.sprite.y = window.innerHeight / 2 - this.sprite.height / 2;
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
        new Laser(x, y, this.sprite.rotation).addToStage();
    };
    Player.prototype.update = function update() {
        this.velocity = Math.max(this.velocity - this.deceleration, 0);
        this.sprite.x += this.velocity * Math.sin(this.sprite.rotation);
        this.sprite.y -= this.velocity * Math.cos(this.sprite.rotation);
        this.sprite.rotation += this.angularVelocity;
    };
    Player.prototype.addToStage = function addToStage() {
        _stage.addChild(this.sprite);
    };


    global.Player = Player;
})(window);