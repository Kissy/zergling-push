var socket = new WebSocket("ws://localhost:8080/websocket");
socket.onmessage = function(response) {
    console.log(response.data);
};
socket.onopen = function() {
    console.log('WS Connection');
    socket.send("hello !");
};




var renderer = PIXI.autoDetectRenderer(256, 256);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container();

//Tell the `renderer` to `render` the `stage`
renderer.render(stage);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

// Load image
PIXI.loader
    .add("plane.png")
    .load(setup);

var sprite;

function gameLoop() {

    //Loop this function at 60 frames per second
    requestAnimationFrame(gameLoop);

    //Move the sprite 1 pixel to the right each frame
    sprite.x += sprite.vx;
    sprite.y += sprite.vy;

    //Render the stage to see the animation
    renderer.render(stage);
}

function setup() {
    sprite = new PIXI.Sprite(
        PIXI.loader.resources["plane.png"].texture
    );

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

    stage.addChild(sprite);
    renderer.render(sprite);

    gameLoop();
}

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}