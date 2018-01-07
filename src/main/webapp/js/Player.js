(function (window) {
    function Player(event, texture) {
        Phaser.Sprite.call(this, _game, event.x(), event.y(), texture);

        this.name = event.id();
        this.anchor.set(0.5);

        // TODO set in RemoteObject class
        this.snapshot = null;

        this.shots = _game.add.group();
        this.shots.enableBody = true;
        this.shots.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 0; i < 20; i++) {
            this.shots.add(new Laser(this, null));
        }
        this.shields = 3;
        _game.add.existing(this);
    }

    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.shot = function shot(event) {
    };
    Player.prototype.hit = function hit(event) {
        this.shields--;
    };
    Player.prototype.updateSnapshot = function updateSnapshot(playerSnapshot) {
        this.snapshot = playerSnapshot;
    };
    Player.prototype.update = function update(deltaTime) {
        // Network reconciliation
        // TODO initialize snapshot when creating object
        if (this.snapshot && this.snapshot.target) {
            var currentSnapshot = this.snapshot.current;
            var targetSnapshot = this.snapshot.target;
            // Use linear interpolation in Phaser.Math
            var timePoint = (this.game.time.clientTime - currentSnapshot.time) / (targetSnapshot.time - currentSnapshot.time);
            var angleDifference = targetSnapshot.rotation() - currentSnapshot.rotation();
            // TODO find something in Phaser.Math
            if (angleDifference < -Math.PI) {
                angleDifference += 2 * Math.PI;
            } else if (angleDifference > Math.PI) {
                angleDifference -= 2 * Math.PI;
            }
            this.rotation = currentSnapshot.rotation() + angleDifference * timePoint;
            this.x = Phaser.Math.linear(currentSnapshot.x(), targetSnapshot.x(), timePoint);
            this.y = Phaser.Math.linear(currentSnapshot.y(), targetSnapshot.y(), timePoint);

            // Shots
            for (var p = 0; p < targetSnapshot.shotsLength(); p++) {
                var playerShotSnapshot = targetSnapshot.shots(p);
                var shot = this.shots.getFirstExists(false);
                if (shot) {
                    shot.reset(playerShotSnapshot);
                }
            }
        }

        // this.residualVelocity = Math.max(this.residualVelocity - _playerDecelerationFactor, 0);
        // var currentVelocity = (this.forwardVelocity + this.residualVelocity);
        // var xVelocity = currentVelocity * Math.sin(this.rotation);
        // var yVelocity = currentVelocity * Math.cos(this.rotation);
        // this.x += xVelocity * _game.time.physicsElapsed;
        // this.y -= yVelocity * _game.time.physicsElapsed;
    };
    Player.prototype.debug = function debug() {
        if (this.snapshot && this.snapshot.current && this.snapshot.target) {
            _game.debug.geom(new Phaser.Rectangle(this.snapshot.target.x() - (this.width / 2),
                this.snapshot.target.y() - (this.height / 2), this.width, this.height), "green", false);
            _game.debug.geom(new Phaser.Rectangle(this.snapshot.current.x() - (this.width / 2),
                this.snapshot.current.y() - (this.height / 2), this.width, this.height), "red", false);
        }
    };

    window.Player = Player;
})(window);