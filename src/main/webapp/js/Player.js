(function (window) {
    function Player(event, texture) {
        Phaser.Sprite.call(this, _game, event.x(), event.y(), texture);

        this.id = event.id();
        this.shields = 3;
        this.inputQueue = [];
        this.updateQueue = [];
        this.shots = _game.add.group();
        this.shots.enableBody = true;
        // this.shots.physicsBodyType = Phaser.Physics.ARCADE;

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
        this.updateQueue.push(event);

        if(this.updateQueue.length > 120) {
            this.updateQueue.splice(0,1);
        }

        // console.log("snapshot received " + event.time + " " + (this.game.time.serverStartTime + this.game.time.now - 100));

        // this.serverX = event.x();
        // this.serverY = event.y();
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