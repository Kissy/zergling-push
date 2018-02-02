import * as Phaser from "phaser";
import BootScene from './scenes/Boot';
import MainScene from "./scenes/Play";

/*var ZerglingPush = ZerglingPush || {};

var _width = 1920;
var _height = 960;

var _referenceTime = new Date();
_referenceTime.setHours(0, 0, 0, 0);
_referenceTime = _referenceTime.getTime();

var game = new Phaser.Game({
    type: Phaser.CANVAS,
    width: _width,
    height: _height,
    title: 'Zergling Push',
    scene: [ZerglingPush.Scenes.Boot, ZerglingPush.Scenes.Main]
});
console.log(game);
console.log(Phaser);
PluginManager.register('InputPlugin', InputPlugin, 'input');
game.network = new ZerglingPush.NetworkManager(game);


//this.time.advancedTiming = true;
//this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//this.stage.disableVisibilityChange = true;

var _messageQueue = [];
var _players = {};
*/

new Phaser.Game({
    type: Phaser.CANVAS,
    parent: 'content',
    width: 1920,
    height: 960,
    title: 'Zergling Push',
    backgroundColor: '#1E0835',
    scene: [BootScene, MainScene]
});
