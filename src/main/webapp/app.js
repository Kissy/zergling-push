var ZerglingPush = ZerglingPush || {};

var _width = 1920;
var _height = 960;

var _referenceTime = new Date();
_referenceTime.setHours(0,0,0,0);
_referenceTime = _referenceTime.getTime();

var _playerId;
var _playerVelocityFactor;
var _playerAngularVelocityFactor;
var _playerDecelerationFactor;
var _playerStartingXPosition;
var _playerStartingYPosition;
var _playerStartingRotation;
var _playerFireRate;
var _laserFullVelocity;
var _remoteClientDelay = 100; // TODO send from server ?

var _game = new Phaser.Game({
    width: 1920,
    height: 960,
    renderer: Phaser.CANVAS,
    antialias: false,
    scaleMode: Phaser.ScaleManager.SHOW_ALL,
    disableVisibilityChange: true,
    backgroundColor: "#1E0835"
});
_game.state.add('boot', ZerglingPush.BootState);
_game.state.add('play', ZerglingPush.PlayState);
_game.state.start('boot');

var _inputQueue = [];
var _messageQueue = [];
var _players = {};

function create(game) {
    // TODO move to world ?
    /*var rainParticle = this.game.add.bitmapData(10, 10);

    rainParticle.ctx.fillStyle = '#19BBF9';
    rainParticle.ctx.fillRect(0, 0, 10, 10);

    var emitter = game.add.emitter(game.world.centerX, game.world.centerY, 200);
    emitter.gravity = 0;
    emitter.width = game.world.width;
    emitter.height = game.world.height;
    // emitter.angle = 10;
    var tween = game.make.tween({ v: 0 }).to( { v: 0.8 }, 1500, "Circ.easeInOut").yoyo(true);
    emitter.alphaData = tween.generateData(60);
    emitter.autoAlpha = true;

    emitter.makeParticles(rainParticle);

    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 0.6;

    // emitter.setYSpeed(600, 1000);
    // emitter.setXSpeed(-5, 5);

    emitter.minRotation = 0;
    emitter.maxRotation = 0;

    emitter.start(false, 1500, 200, 0);*/
}
