(function (window) {
    function RemotePlayer(event) {
        Player.call(this, event, 'hostile');
        //this.nameSprite.destroy();
        /*this.shieldSprite = new PIXI.Sprite(PIXI.loader.resources['shield_silver'].texture);
         _stage.addChild(this.shieldSprite);*/
        this.firing = false;
        this.firingTimer = 0;
        this.currentSnapshot = null;
        this.targetSnapshot = null;
        this.currentTime = null;
    }

    RemotePlayer.prototype = Object.create(Player.prototype);
    RemotePlayer.prototype.constructor = RemotePlayer;

    RemotePlayer.prototype.shot = function shot(event) {
        // var laser = new Laser(event.x(), event.y(), event.rotation());
        // this.shots.add(laser);
    };
    RemotePlayer.prototype.hit = function hit(event) {
        this.alpha = 0.2;
    };
    RemotePlayer.prototype.update = function update() {
        // Object.getPrototypeOf(RemotePlayer.prototype).update.call(this);
        // TODO initialize snapshot

        // Snapshot is expired
        if (this.targetSnapshot == null || this.game.time.clientTime >= this.targetSnapshot.time) {
            for (var i = 0; i < this.snapshots.length - 1; i++) {
                var snapshot = this.snapshots[i];
                var nextSnapshot = this.snapshots[i + 1];

                if (this.game.time.clientTime >= snapshot.time && this.game.time.clientTime < nextSnapshot.time) {
                    this.currentSnapshot = snapshot;
                    this.targetSnapshot = nextSnapshot;
                    break;
                }
            }
        }

        if (this.targetSnapshot) {
            var timePoint = (this.game.time.clientTime - this.currentSnapshot.time) / (this.targetSnapshot.time - this.currentSnapshot.time);
            var angleDifference = this.targetSnapshot.rotation() - this.currentSnapshot.rotation();
            if (angleDifference < -Math.PI) {
                angleDifference += 2 * Math.PI;
            } else if (angleDifference > Math.PI) {
                angleDifference -= 2 * Math.PI;
            }
            this.rotation = this.currentSnapshot.rotation() + angleDifference * timePoint;
            this.x = this.currentSnapshot.x() + (this.targetSnapshot.x() - this.currentSnapshot.x()) * timePoint;
            this.y = this.currentSnapshot.y() + (this.targetSnapshot.y() - this.currentSnapshot.y()) * timePoint;

            // Shots
            for (var p = 0; p < this.targetSnapshot.shotsLength(); p++) {
                var playerShotSnapshot = this.targetSnapshot.shots(p);
                var shot = this.shots.getFirstExists(false);
                if (shot) {
                    shot.reset(playerShotSnapshot);
                }
            }
        }
    };
    // RemotePlayer.prototype.processSnapshot = function processSnapshot(event) {
    //     Object.getPrototypeOf(RemotePlayer.prototype).processSnapshot.call(this, event);
    // };

    window.RemotePlayer = RemotePlayer;
})(window);