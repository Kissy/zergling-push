(function (window) {

    var EMPTY_SNAPSHOT = {
        time: function () {
            return 0;
        }, players: function () {
            return [];
        }
    };

    function SnapshotList(game) {
        this.game = game;
        this.snapshots = [EMPTY_SNAPSHOT, EMPTY_SNAPSHOT];
    }

    SnapshotList.prototype.update = function update(deltaTime) {
        // remove old snapshots
        for (var i = 1; i < this.snapshots.length; i++) {
            var currentSnapshot = this.snapshots[i];
            if (currentSnapshot.time() > this.game.time.clientTime) {
                return this.snapshots.splice(0, i - 1).length > 0;
            }
        }
        return false;
    };

    SnapshotList.prototype.receiveSnapshot = function receiveSnapshot(newSnapshot) {
        for (var i = this.snapshots.length - 1; i >= 0; i--) {
            var currentSnapshot = this.snapshots[i];
            if (currentSnapshot.time() < newSnapshot.time()) {
                this.snapshots.splice(i, 0, newSnapshot);
                break;
            }
        }
    };

    SnapshotList.prototype.getCurrentSnapshot = function getCurrentSnapshot() {
        return this.snapshots[0];
    };

    SnapshotList.prototype.getTargetSnapshot = function getTargetSnapshot() {
        return this.snapshots[1];
    };

    window.SnapshotList = SnapshotList;
})(window);