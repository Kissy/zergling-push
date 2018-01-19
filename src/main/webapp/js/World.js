(function (window) {

    // TODO rename GameWorld
    function World(state) {
        this.game = state.game;
        this.players = this.game.add.group(null, "players", true);
        this.projectiles = this.game.add.group(null, "projectiles", true);
        this.snapshotList = new SnapshotList(this.game);
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
                this.players.add(new Player(this.game, this, playerSnapshots[i], 'hostile'));
            }
            for (var i = 0; i < targetSnapshot.projectilesLength(); i++) {
                var projectileSnapshot = targetSnapshot.projectiles(i);
                // TODO only create once
                if (this.projectiles.getByName(projectileSnapshot.id()) == null) {
                    this.projectiles.add(new ZerglingPush.Projectile(this.game, projectileSnapshot));
                }
            }
        }
        this.snapshotCurrentTime = (this.game.time.clientTime - this.snapshotList.getCurrentSnapshot().time())
            / (this.snapshotList.getTargetSnapshot().time() - this.snapshotList.getCurrentSnapshot().time());
    };

    World.prototype.playerJoined = function playerJoined(playerJoined) {
        this.players.add(new ControlledPlayer(this.game, this, playerJoined.snapshot()));
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