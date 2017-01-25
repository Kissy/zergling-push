(function (window) {
    function RemotePlayer(event) {
        Player.call(this, event, 'hostile');
        //this.nameSprite.destroy();
        /*this.shieldSprite = new PIXI.Sprite(PIXI.loader.resources['shield_silver'].texture);
         _stage.addChild(this.shieldSprite);*/
        this.firing = false;
        this.firingTimer = 0;
    }

    RemotePlayer.prototype = Object.create(Player.prototype);
    RemotePlayer.prototype.constructor = RemotePlayer;

    RemotePlayer.prototype.moved = function moved(event) {
        if (this.forwardVelocity != event.velocity()) {
            this.residualVelocity = 1 - event.velocity();
        }

        this.body.rotation = event.rotation();
        this.forwardVelocity = event.velocity();
        this.body.x = event.x() * _scale;
        this.body.y = event.y() * _scale;
        this.body.angularVelocity = event.angularVelocity() * _playerAngularVelocityFactor;
    };
    RemotePlayer.prototype.shot = function shot(event) {
        var laser = new Laser(event.x() * _scale, event.y() * _scale, event.rotation());
        this.shots.add(laser);
    };
    RemotePlayer.prototype.hit = function hit(event) {
        this.alpha = 0.2;
    };

    window.RemotePlayer = RemotePlayer;
})(window);