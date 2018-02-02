const EMPTY_SNAPSHOT= {
    time: function () {
        return 0;
    },
    playersLength: function () {
        return 0;
    },
    projectilesLength: function() {
        return 0;
    }
};

class SnapshotList extends new Phaser.Class {
    constructor(scene) {
        super();
        this.scene = scene;
        //this.currentSnapshot = EMPTY_SNAPSHOT;
        //this.targetSnapshot = EMPTY_SNAPSHOT;
        this.snapshots = [EMPTY_SNAPSHOT, EMPTY_SNAPSHOT];
    }

    update(time, delta) {
        // remove old snapshots
        const localTime = this.scene.remoteClock.getLocalTime();
        for (let i = 1; i < this.snapshots.length; i++) {
            const currentSnapshot = this.snapshots[i];
            if (currentSnapshot.time() > localTime) {
                return this.snapshots.splice(0, i - 1).length > 0;
            }
        }
        return false;
    }

    receiveSnapshot(newSnapshot) {
        for (let i = this.snapshots.length - 1; i >= 0; i--) {
            const currentSnapshot = this.snapshots[i];
            if (currentSnapshot.time() < newSnapshot.time()) {
                this.snapshots.splice(i + 1, 0, newSnapshot);
                break;
            }
        }
        //this.currentSnapshot = this.targetSnapshot;
        //this.targetSnapshot = newSnapshot;
    }

    getCurrentSnapshot() {
        //return this.currentSnapshot;
        return this.snapshots[0];
    }

    getTargetSnapshot() {
        //return this.targetSnapshot;
        return this.snapshots[1];
    }
}

export default SnapshotList;