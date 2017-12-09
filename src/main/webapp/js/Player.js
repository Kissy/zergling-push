(function (window) {
    function Player(event, texture) {
        Phaser.Sprite.call(this, _game, event.x(), event.y(), texture);

        this.id = event.id();
        this.shields = 3;
        this.inputQueue = []; // Should be be useful only for controlled
        // TODO include snapshot inside player join
        this.snapshots = [];
        this.shots = _game.add.group();
        this.shots.enableBody = true;
        this.shots.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 0; i < 20; i++) {
            this.shots.add(new Laser(this, null));
        }

        this.anchor.set(0.5);

        this.forwardVelocity = 0;
        this.residualVelocity = 0;

        // this.x = event.x() + this.width / 2;
        // this.y = event.y() + this.height / 2;

        /*this.avatarSprite = ;
        this.avatarSprite.anchor.set(0.5, 0.5);
        this.avatarSprite.rotation = event.rotation();
        this.sprite.addChild(this.avatarSprite);*/
        /*var textX = - (50 / 2);
        var textY = - (_playerHeight + 20 / _scale + _playerNameSpriteYOffset);
        this.nameSprite = new Phaser.Text(_game, textX, textY, event.name(), {font: "15px Arial", fill: "#F7531C"});
        this.nameSprite.alpha = 0.4;
        this.sprite.addChild(this.nameSprite);*/

        _game.add.existing(this);
    }

    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.shot = function shot(event) {
    };
    Player.prototype.hit = function hit(event) {
        this.shields--;
    };
    Player.prototype.update = function update() {
        // this.applyInputQueue();

        // this.residualVelocity = Math.max(this.residualVelocity - _playerDecelerationFactor, 0);
        // var currentVelocity = (this.forwardVelocity + this.residualVelocity);
        // var xVelocity = currentVelocity * Math.sin(this.rotation);
        // var yVelocity = currentVelocity * Math.cos(this.rotation);
        // this.x += xVelocity * _game.time.physicsElapsed;
        // this.y -= yVelocity * _game.time.physicsElapsed;
    };
    Player.prototype.processSnapshot = function receiveInput(event) {
        // TODO remove only when current snapshot is expired
        for (var j = this.snapshots.length - 1; j >= 0; j--) {
            if (this.snapshots[j].time < this.game.time.clientTime) {
                this.snapshots.splice(0, Math.max(j - 1, 0));
                break;
            }
        }

        for (var i = this.snapshots.length - 1; i >= 0; i--) {
            if (this.snapshots[i].time < event.time) {
                this.snapshots.splice(i + 1, 0, event);
                break;
            }
        }

        // TODO create player with initial snapshot instead of this
        if (this.snapshots.length === 0) {
            this.snapshots.push(event)
        }
    };
    Player.prototype.applyInputQueue = function applyInputQueue(event) {
        // if (this.forwardVelocity != event.velocity()) {
        //     this.residualVelocity = (1 - event.velocity()) * _playerVelocityFactor;
        // }
        // this.forwardVelocity = event.velocity() * _playerVelocityFactor;
        // this.angularVelocity = event.angularVelocity() * _playerAngularVelocityFactor;
    };

    window.Player = Player;
})(window);