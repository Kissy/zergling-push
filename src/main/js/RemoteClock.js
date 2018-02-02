/* globals __DEV__ */

import * as Phaser from "phaser";

const clientDelay = 100;

class RemoteClock {

    constructor(scene) {
        this.scene = scene;
        this.latency = 0;
        this.serverOffset = 0;
        this.serverOffsets = [];
        this.localTime = 0;
    }

    update(time, delta) {
        this.localTime += delta;
    }

    onTimeSyncResponse(byteBuffer) {
        let event = Event.TimeSyncResponse.getRootAsTimeSyncResponse(byteBuffer);
        this.latency = Math.round((this.scene.time.now - event.time()) / 2);
        this.serverOffsets.push(event.serverTime() + this.latency - this.scene.time.now);
        if (this.serverOffsets.length > 5) {
            this.serverOffsets.shift();
        }
        this.serverOffset = Phaser.Math.Average(this.serverOffsets);
        this.localTime = this.serverOffset + this.scene.time.now - clientDelay;
    }

    getLocalTime() {
        return this.localTime;
    }
}

export default RemoteClock
