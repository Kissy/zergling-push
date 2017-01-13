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

function Player() {
    this._fullSpeed = 10;
    this._angularSpeed = 0.1;
    this._deceleration = 0.5;

    this.sprite = new PIXI.Sprite(PIXI.loader.resources['avatar'].texture);
    this.sprite.component = this;
    this.sprite.width = 34.4;
    this.sprite.height = 40.6;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.x = window.innerWidth / 2 - this.sprite.width / 2;
    this.sprite.y = window.innerHeight / 2 - this.sprite.height / 2;
    this.sprite.rotation = 0;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.angularVelocity = 0;
}
Player.prototype.accelerate = function accelerate() {
    this.xVelocity = this._fullSpeed * Math.sin(this.sprite.rotation);
    this.yVelocity = - this._fullSpeed * Math.cos(this.sprite.rotation);
};
Player.prototype.slowDown = function slowDown() {
    this.xVelocity -= this._deceleration;
    if (this.xVelocity < 0) {
        this.xVelocity = 0;
    }
    this.yVelocity -= this._deceleration;
    if (this.yVelocity < 0) {
        this.yVelocity = 0;
    }
};
Player.prototype.rotate = function rotate() {
    this.angularVelocity = 0;
    if (key.isPressed("right")) {
        this.angularVelocity += this._angularSpeed;
    }
    if (key.isPressed("left")) {
        this.angularVelocity -= this._angularSpeed;
    }
};
Player.prototype.update = function update() {
    if (key.isPressed("up")) {
        this.accelerate();
    } else {
        this.slowDown();
    }
    this.rotate();

    this.sprite.x += this.xVelocity;
    this.sprite.y += this.yVelocity;
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

var sprite;

function gameLoop() {
    requestAnimationFrame(gameLoop);
    for (var i = 0; i < _stage.children.length; i++) {
        _stage.children[i].component.update();
    }
    _renderer.render(_stage);
}


function setup() {

    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    left.press = function() {

        //Change the sprite's velocity when the key is pressed
        sprite.vx = -5;
        sprite.vy = 0;
    };

    //Left arrow key `release` method
    left.release = function() {

        //If the left arrow has been released, and the right arrow isn't down,
        //and the sprite isn't moving vertically:
        //Stop the sprite
        if (!right.isDown && sprite.vy === 0) {
            sprite.vx = 0;
        }
    };

    //Up
    up.press = function() {
        sprite.vy = -5;
        sprite.vx = 0;
    };
    up.release = function() {
        if (!down.isDown && sprite.vx === 0) {
            sprite.vy = 0;
        }
    };

    //Right
    right.press = function() {
        sprite.vx = 5;
        sprite.vy = 0;
    };
    right.release = function() {
        if (!left.isDown && sprite.vy === 0) {
            sprite.vx = 0;
        }
    };

    //Down
    down.press = function() {
        sprite.vy = 5;
        sprite.vx = 0;
    };
    down.release = function() {
        if (!up.isDown && sprite.vx === 0) {
            sprite.vy = 0;
        }
    };

    sprite.width = 50;
    sprite.height = 50;

    sprite.vx = 0;
    sprite.vy = 0;

    _stage.addChild(sprite);
    _renderer.render(sprite);

    gameLoop();
}