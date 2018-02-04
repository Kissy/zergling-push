import Player from "./Player";
import * as Phaser from "phaser";

class RemotePlayers extends Phaser.GameObjects.Group {
    constructor(scene, children, config) {
        super(scene, children, config);
    }
}

export default RemotePlayers
