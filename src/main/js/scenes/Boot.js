/* globals __DEV__ */

import * as Phaser from "phaser";
import NetworkManager from "./../NetworkManager";

class BootScene extends Phaser.Scene {
    constructor() {
        super({key: 'Boot'});
    }

    preload() {

    }

    create() {
        this.network = NetworkManager.get(this.sys.game);
        this.network.on('connected', this.startPlayScene, this);
        this.network.connect();
    }

    startPlayScene() {
        // TODO Do TimeSync here ?
        this.scene.start('Main');
    }

}

export default BootScene
