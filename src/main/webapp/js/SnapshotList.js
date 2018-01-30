var ZerglingPush = ZerglingPush || {};

var EMPTY_SNAPSHOT= {
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

var SnapshotList = new Phaser.Class({
    initialize: function SnapshotList(time) {
        this.time = time;
        this.currentSnapshot = EMPTY_SNAPSHOT;
        this.targetSnapshot = EMPTY_SNAPSHOT;
    },
    update: function (time, delta) {
        return false;
    },
    receiveSnapshot: function (newSnapshot) {
        this.currentSnapshot = this.targetSnapshot;
        this.targetSnapshot = newSnapshot;
    },
    getCurrentSnapshot: function getCurrentSnapshot() {
        return this.currentSnapshot;
    },
    getTargetSnapshot: function getTargetSnapshot() {
        return this.targetSnapshot;
    }
});

export default SnapshotList;