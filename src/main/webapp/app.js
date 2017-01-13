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
    key('up', this.accelerate.bind(this), this.decelerate.bind(this), true);
    key('right', this.turnRight.bind(this), this.turnLeft.bind(this), true);
    key('left', this.turnLeft.bind(this), this.turnRight.bind(this), true);
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
Player.prototype.update = function update() {
    this.velocity = Math.max(this.velocity - this.deceleration, 0);
    this.sprite.x += this.velocity * Math.sin(this.sprite.rotation);
    this.sprite.y -= this.velocity * Math.cos(this.sprite.rotation);
    this.sprite.rotation += this.angularVelocity;
};
Player.prototype.addToStage = function addToStage(stage) {
    stage.addChild(this.sprite);
};

PIXI.loader
    .add("avatar", "img/avatar.png")
    .load(function() {
        var player = new Player();
        player.addToStage(_stage);
        gameLoop();
    });

function gameLoop() {
    requestAnimationFrame(gameLoop);
    for (var i = 0; i < _stage.children.length; i++) {
        _stage.children[i].component.update();
    }
    _renderer.render(_stage);
}
