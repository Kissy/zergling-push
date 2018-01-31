/* globals __DEV__ */

import * as Phaser from "phaser";

class RemoteClock {

    constructor(scene) {
        this.scene = scene;
        this.ping = 0;
        this.serverOffset = 0;
        this.serverOffsets = [];
    }

    update(time, delta) {
    }

    onTimeSyncResponse(byteBuffer) {
        let event = Event.TimeSyncResponse.getRootAsTimeSyncResponse(byteBuffer);
        this.ping = Math.round((this.scene.time.now - event.time()) / 2);
        this.serverOffsets.push(event.serverTime() - this.ping - this.scene.time.now);
        this.serverOffset = Phaser.Math.Average(this.serverOffsets);
        console.log(this.serverOffset);
    }
}

export default RemoteClock
