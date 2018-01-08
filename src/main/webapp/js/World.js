(function (window) {

    // TODO rename RemoteWorld
    function World(game) {
        this.game = game;
        this.players = game.add.group(null, "players", true);
        this.snapshotList = new SnapshotList(game);
        this.snapshotCurrentTime = 0;
    }

    World.prototype.update = function update(deltaTime) {
        var updated = this.snapshotList.update(deltaTime);
        if (updated) {
            // TODO set in snapshotList
            var playerSnapshots = {};
            var targetSnapshot = this.snapshotList.getTargetSnapshot();
            for (var i = 0; i < targetSnapshot.playersLength(); i++) {
                var playerSnapshot = targetSnapshot.players(i);
                if (!playerSnapshots[playerSnapshot.id()]) {
                    playerSnapshots[playerSnapshot.id()] = {};
                }
                playerSnapshots[playerSnapshot.id()] = playerSnapshot;
            }
            this.players.forEachAlive(function(player) { // TODO use named function
                var playerSnapshot = playerSnapshots[player.name];
                if (playerSnapshot) {
                    player.updateTargetSnapshot(playerSnapshot);
                    delete playerSnapshots[player.name];
                } else {
                    player.kill();
                }
            });
            for (var i in playerSnapshots) {
                this.players.add(new Player(this.game, playerSnapshots[i], 'hostile'));
            }
        }

        this.snapshotCurrentTime = (this.game.time.clientTime - this.snapshotList.getCurrentSnapshot().time())
            / (this.snapshotList.getTargetSnapshot().time() - this.snapshotList.getCurrentSnapshot().time());
    };

    World.prototype.playerJoined = function playerJoined(playerJoined) {
        this.players.add(new ControlledPlayer(this.game, playerJoined.snapshot(), 'avatar'));
    };

    World.prototype.receiveSnapshot = function receiveSnapshot(worldSnapshot) {
        this.snapshotList.receiveSnapshot(worldSnapshot);
    };

    World.prototype.getSnapshotCurrentTime = function getSnapshotCurrentTime() {
        return this.snapshotCurrentTime;
    };

    World.prototype.debug = function debug() {
        this.players.forEachAlive(function(player) {
            player.debug();
        });
    };

    window.World = World;
})(window);