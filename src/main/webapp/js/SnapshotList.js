var ZerglingPush = ZerglingPush || {};


ZerglingPush.EMPTY_SNAPSHOT = {
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

ZerglingPush.SnapshotList = function (game) {
    this.game = game;
    this.snapshots = [ZerglingPush.EMPTY_SNAPSHOT, ZerglingPush.EMPTY_SNAPSHOT];
};

ZerglingPush.SnapshotList.prototype.update = function update() {
    // remove old snapshots
    for (var i = 1; i < this.snapshots.length; i++) {
        var currentSnapshot = this.snapshots[i];
        if (currentSnapshot.time() > this.game.time.clientTime) {
            return this.snapshots.splice(0, i - 1).length > 0;
        }
    }
    return false;
};

ZerglingPush.SnapshotList.prototype.receiveSnapshot = function receiveSnapshot(newSnapshot) {
    for (var i = this.snapshots.length - 1; i >= 0; i--) {
        var currentSnapshot = this.snapshots[i];
        if (currentSnapshot.time() < newSnapshot.time()) {
            this.snapshots.splice(i, 0, newSnapshot);
            break;
        }
    }
};

ZerglingPush.SnapshotList.prototype.getCurrentSnapshot = function getCurrentSnapshot() {
    return this.snapshots[0];
};

ZerglingPush.SnapshotList.prototype.getTargetSnapshot = function getCurrentSnapshot() {
    return this.snapshots[1];
};
