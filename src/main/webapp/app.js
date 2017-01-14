var _websocket = new WebSocket("ws://localhost:8080/websocket");
_websocket.onmessage = function(response) {
    console.log(response.data);
};
_websocket.onopen = function() {
    console.log('WS Connection');
};

var _renderer = PIXI.autoDetectRenderer();
_renderer.view.style.position = "absolute";
_renderer.view.style.display = "block";
_renderer.autoResize = true;
_renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(_renderer.view);

var _stage = new PIXI.Container();
_renderer.render(_stage);

PIXI.loader
    .add("avatar", "img/avatar.png")
    .add("laser", "img/laser.png")
    .load(function() {
        var player = new Player();
        player.addToStage();
        gameLoop();
    });

function gameLoop() {
    for (var i = 0; i < _stage.children.length; i++) {
        _stage.children[i].component.update();
    }
    _renderer.render(_stage);
    requestAnimationFrame(gameLoop);
}
