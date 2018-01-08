(function (window) {
    function RemoteSprite(game, event, texture) {
        Phaser.Sprite.call(this, game, event.x(), event.y(), texture);

        this.game = game;
        this.name = event.id();
        this.anchor.set(0.5);
        this.currentSnapshot = event;
        this.targetSnapshot = event;
    }

    RemoteSprite.prototype = Object.create(Phaser.Sprite.prototype);
    RemoteSprite.prototype.constructor = RemoteSprite;

    RemoteSprite.prototype.updateTargetSnapshot = function updateTargetSnapshot(playerSnapshot) {
        this.currentSnapshot = this.targetSnapshot;
        this.targetSnapshot = playerSnapshot;
    };

    RemoteSprite.prototype.update = function update(deltaTime) {
        // Network reconciliation
        // TODO Use linear interpolation in Phaser.Math
        // TODO calculate from world
        var angleDifference = this.targetSnapshot.rotation() - this.currentSnapshot.rotation();
        // TODO find something in Phaser.Math
        if (angleDifference < -Math.PI) {
            angleDifference += 2 * Math.PI;
        } else if (angleDifference > Math.PI) {
            angleDifference -= 2 * Math.PI;
        }
        this.rotation = this.currentSnapshot.rotation() + angleDifference * this.game.remoteWorld.getSnapshotCurrentTime();
        this.x = Phaser.Math.linear(this.currentSnapshot.x(), this.targetSnapshot.x(), this.game.remoteWorld.getSnapshotCurrentTime());
        this.y = Phaser.Math.linear(this.currentSnapshot.y(), this.targetSnapshot.y(), this.game.remoteWorld.getSnapshotCurrentTime());
    };

    RemoteSprite.prototype.debug = function debug() {
        if (this.snapshot && this.snapshot.current && this.snapshot.target) {
            this.game.debug.geom(new Phaser.Rectangle(this.snapshot.target.x() - (this.width / 2),
                this.snapshot.target.y() - (this.height / 2), this.width, this.height), "green", false);
            this.game.debug.geom(new Phaser.Rectangle(this.snapshot.current.x() - (this.width / 2),
                this.snapshot.current.y() - (this.height / 2), this.width, this.height), "red", false);
        }
    };

    window.RemoteSprite = RemoteSprite;
})(window);