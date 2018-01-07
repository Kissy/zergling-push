(function (window) {

    function World(game) {
        this.game = game;
        this.players = game.add.group(null, "players", true);
        this.snapshotList = new SnapshotList(game);
    }

    World.prototype.update = function update(deltaTime) {
        var updated = this.snapshotList.update(deltaTime);
        if (updated) {
            // TODO set in snapshotList
            var currentSnapshot = this.snapshotList.getCurrentSnapshot();
            var playerSnapshots = {};
            for (var i = 0; i < currentSnapshot.playersLength(); i++) {
                var playerSnapshot = currentSnapshot.players(i);
                playerSnapshots[playerSnapshot.id()] = {};
                playerSnapshots[playerSnapshot.id()]['current'] = playerSnapshot;
                playerSnapshots[playerSnapshot.id()]['current'].time = currentSnapshot.time();
            }
            var targetSnapshot = this.snapshotList.getTargetSnapshot();
            for (var i = 0; i < targetSnapshot.playersLength(); i++) {
                var playerSnapshot = targetSnapshot.players(i);
                if (!playerSnapshots[playerSnapshot.id()]) {
                    playerSnapshots[playerSnapshot.id()] = {};
                }
                playerSnapshots[playerSnapshot.id()]['target'] = playerSnapshot;
                playerSnapshots[playerSnapshot.id()]['target'].time = targetSnapshot.time();
            }
            this.players.forEachAlive(function(player) { // TODO use named function
                var playerSnapshot = playerSnapshots[player.name];
                if (playerSnapshot) {
                    player.updateSnapshot(playerSnapshot);
                    delete playerSnapshots[player.name];
                } else {
                    player.kill();
                }
            });
            for (var i in playerSnapshots) {
                this.players.add(new Player(playerSnapshots[i].target, 'hostile'));
            }
        }
    };

    World.prototype.playerJoined = function playerJoined(playerJoined) {
        this.players.add(new ControlledPlayer(playerJoined.snapshot()));
    };

    World.prototype.receiveSnapshot = function receiveSnapshot(worldSnapshot) {
        this.snapshotList.receiveSnapshot(worldSnapshot);
    };

    World.prototype.debug = function debug() {
        this.players.forEachAlive(function(player) {
            player.debug();
        });
    };

    window.World = World;
})(window);