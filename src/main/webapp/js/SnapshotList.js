var ZerglingPush = ZerglingPush || {};

var EMPTY_SNAPSHOT= {
    time: function () {
        return 0;
    }, players: function () {
        return [];
    }
};

var SnapshotList = new Phaser.Class({
    initialize: function SnapshotList(time) {
        this.time = time;
        this.snapshots = [EMPTY_SNAPSHOT, EMPTY_SNAPSHOT];
    },
    preload: function () {
    },
    create: function() {
    },
    update: function (time, delta) {
        // remove old snapshots
        for (var i = 1; i < this.snapshots.length; i++) {
            var currentSnapshot = this.snapshots[i];
            if (currentSnapshot.time() > this.time.clientTime) {
                return this.snapshots.splice(0, i - 1).length > 0;
            }
        }
        return false;
    },
    receiveSnapshot: function (newSnapshot) {
        for (var i = this.snapshots.length - 1; i >= 0; i--) {
            var currentSnapshot = this.snapshots[i];
            if (currentSnapshot.time() < newSnapshot.time()) {
                this.snapshots.splice(i, 0, newSnapshot);
                break;
            }
        }
    },
    getCurrentSnapshot: function getCurrentSnapshot() {
        return this.snapshots[0];
    },
    getTargetSnapshot: function getTargetSnapshot() {
        return this.snapshots[1];
    }
});