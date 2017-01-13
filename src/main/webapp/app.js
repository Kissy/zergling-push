var socket = new WebSocket("ws://localhost:8080/websocket");
socket.onmessage = function(response) {
    console.log(response.data);
};
socket.onopen = function() {
    console.log('WS Connection');
    socket.send("hello !");
};

var _renderer = PIXI.autoDetectRenderer();
_renderer.view.style.position = "absolute";
_renderer.view.style.display = "block";
_renderer.autoResize = true;
_renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(_renderer.view);

var _stage = new PIXI.Container();
_renderer.render(_stage);

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
    key('up', this.accelerate.bind(this), this.decelerate.bind(this));
    key('right', this.turnRight.bind(this), this.turnLeft.bind(this));
    key('left', this.turnLeft.bind(this), this.turnRight.bind(this));
    key('a', this.fire.bind(this)); //
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
};
Player.prototype.turnLeft = function turnLeft() {
    this.angularVelocity -= _playerFullAngularVelocity;
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

var _laserFullVelocity = 20;
var _laserStartingLifespan = 50;
function Laser(x, y, r) {
    this.sprite = new PIXI.Sprite(PIXI.loader.resources['laser'].texture);
    this.sprite.component = this;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.rotation = r;
    this.lifespan = _laserStartingLifespan;
}
Laser.prototype.update = function update() {
    this.sprite.x += _laserFullVelocity * Math.sin(this.sprite.rotation);
    this.sprite.y -= _laserFullVelocity * Math.cos(this.sprite.rotation);
    this.lifespan--;
    if (this.lifespan <= 0) {
        this.removeFromStage();
    }
};
Laser.prototype.addToStage = function addToStage() {
    _stage.addChild(this.sprite);
};
Laser.prototype.removeFromStage = function removeFromStage() {
    _stage.removeChild(this.sprite);
};

PIXI.loader
    .add("avatar", "img/avatar.png")
    .add("laser", "img/laser.png")
    .load(function() {
        var player = new Player();
        player.addToStage();
        gameLoop();
    });

function gameLoop() {
    requestAnimationFrame(gameLoop);
    for (var i = 0; i < _stage.children.length; i++) {
        _stage.children[i].component.update();
    }
    _renderer.render(_stage);
}
