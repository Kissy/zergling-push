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
    }

    RemotePlayer.prototype = Object.create(Player.prototype);
    RemotePlayer.prototype.constructor = RemotePlayer;

    RemotePlayer.prototype.moved = function moved(event) {
        if (this.forwardVelocity != event.velocity()) {
            this.residualVelocity = 1 - event.velocity();
        }

        this.body.rotation = event.rotation();
        this.forwardVelocity = event.velocity();
        this.body.x = event.x();
        this.body.y = event.y();
        this.body.angularVelocity = event.angularVelocity() * _playerAngularVelocityFactor;
    };
    RemotePlayer.prototype.shot = function shot(event) {
        var laser = new Laser(event.x(), event.y(), event.rotation());
        this.shots.add(laser);
    };
    RemotePlayer.prototype.hit = function hit(event) {
        this.alpha = 0.2;
    };
    RemotePlayer.prototype.update = function update() {
        // Network interpolation
        // Object.getPrototypeOf(RemotePlayer.prototype).update.call(this);

        var currentTime = this.game.time.serverStartTime + this.game.time.now - 100;
        this.currentSnapshot = null;
        this.targetSnapshot = null;

        for (var i = 0; i < this.updateQueue.length - 1; i++) {
            var snapshot = this.updateQueue[i];
            var nextSnapshot = this.updateQueue[i + 1];

            if(currentTime >= snapshot.time && currentTime < nextSnapshot.time) {
                this.currentSnapshot = snapshot;
                this.targetSnapshot = nextSnapshot;
                break;
            }
        }

        if (this.targetSnapshot) {
            var timePoint = (currentTime - this.currentSnapshot.time) / (this.targetSnapshot.time - this.currentSnapshot.time);
            this.rotation = this.targetSnapshot.rotation() + (this.currentSnapshot.rotation() - this.targetSnapshot.rotation()) * timePoint;
            this.x = this.currentSnapshot.x() + (this.targetSnapshot.x() - this.currentSnapshot.x()) * timePoint;
            this.y = this.currentSnapshot.y() + (this.targetSnapshot.y() - this.currentSnapshot.y()) * timePoint;
        }
    };

    window.RemotePlayer = RemotePlayer;
})(window);