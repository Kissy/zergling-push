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

new Phaser.Game({
    type: Phaser.CANVAS,
    width: _width,
    height: _height,
    scene: [ZerglingPush.BootState]
});
//this.time.advancedTiming = true;
//this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//this.stage.disableVisibilityChange = true;

var _messageQueue = [];
var _players = {};
