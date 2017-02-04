(function (window) {
    function ControlledPlayer(event) {
        Player.call(this, event, 'avatar');
        /*this.shieldSprite = new PIXI.Sprite(PIXI.loader.resources['shield_silver'].texture);
        _stage.addChild(this.shieldSprite);*/
        this.firing = false;
        this.firingTimer = 0;

        this.lastAppliedInputSequence = 0;
        this.lastSnapshot = null;

        this.serverX = 0;
        this.serverY = 0;

        this.inputSequence = 0;
        this.cursorKeys = this.game.input.keyboard.createCursorKeys();
        // delete this.cursorKeys['down'];

        // this.upKey = _game.input.keyboard.addKey(Phaser.Keyboard.UP);
        // this.upKey.onDown.add(this.accelerate, this);
        // this.upKey.onUp.add(this.decelerate, this);
        // this.rightKey = _game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        // this.rightKey.onDown.add(this.turnRight, this);
        // this.rightKey.onUp.add(this.turnLeft, this);
        // this.leftKey = _game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        // this.leftKey.onDown.add(this.turnLeft, this);
        // this.leftKey.onUp.add(this.turnRight, this);
        // this.spaceKey = _game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // this.spaceKey.onDown.add(this.fire, this);
    }

    ControlledPlayer.prototype = Object.create(Player.prototype);

    ControlledPlayer.prototype.accelerate = function accelerate() {
        // this.forwardVelocity = 1;
        // this.residualVelocity = 0;
        // this.queuePlayerMoved();
    };
    ControlledPlayer.prototype.decelerate = function decelerate() {
        // this.forwardVelocity = 0;
        // this.residualVelocity = 1;
        // this.queuePlayerMoved();
    };
    ControlledPlayer.prototype.turnRight = function turnRight() {
        // this.body.angularVelocity += _playerAngularVelocityFactor;
        // this.queuePlayerMoved();
    };
    ControlledPlayer.prototype.turnLeft = function turnLeft() {
        // this.body.angularVelocity -= _playerAngularVelocityFactor;
        // this.queuePlayerMoved();
    };
    ControlledPlayer.prototype.startFiring = function turnLeft() {
        this.firing = true;
    };
    ControlledPlayer.prototype.stopFiring = function turnLeft() {
        this.firing = false;
    };
    ControlledPlayer.prototype.fire = function fire() {
        var x = this.center.x + this.width * Math.sin(this.rotation);
        var y = this.center.y - this.height * Math.cos(this.rotation);
        var laser = new Laser(x, y, this.rotation);
        this.shots.add(laser);
        /*this.firingTimer = _playerFiringRate;
        _stage.addChild(laser.sprite);*/
        this.queuePlayerShot(laser);
    };
    ControlledPlayer.prototype.moved = function moved(event) {
    };
    ControlledPlayer.prototype.shot = function shot(event) {
    };
    ControlledPlayer.prototype.hit = function hit(event) {
        this.alpha = 0.2;
    };
    ControlledPlayer.prototype.update = function update(deltaTime) {
        // Network reconciliation
        if (this.lastSnapshot) {
            this.rotation = this.lastSnapshot.rotation();
            this.x = this.lastSnapshot.x();
            this.y = this.lastSnapshot.y();
        }

        this.processInputs(); // Process inputs and add it to queue

        // Client prediction (apply queued inputs)
        var playerMoved = this.inputQueue.length > 0;

        for (var j = 0; j < this.inputQueue.length; j++) {
            var currentEvent = Event.PlayerMoved.getRootAsPlayerMoved(new flatbuffers.ByteBuffer(this.inputQueue[j]));
            this.rotation = this.rotation + (currentEvent.angularVelocity() * _playerAngularVelocityFactor * _game.time.physicsElapsed);
            this.x += currentEvent.velocity() * _playerVelocityFactor * Math.sin(this.rotation) * _game.time.physicsElapsed;
            this.y -= currentEvent.velocity() * _playerVelocityFactor * Math.cos(this.rotation) * _game.time.physicsElapsed;
        }

        // Detect collision
        if (playerMoved) {
            this.x = clamp(this.x, 0, 1920);
            this.y = clamp(this.y, 0, 960);
        }

        Object.getPrototypeOf(ControlledPlayer.prototype).update.call(this, deltaTime);

        /*this.firingTimer--;
        if (this.firing && this.firingTimer <= 0) {
            this.fire();
        }*/
    };
    ControlledPlayer.prototype.processInputs = function processInputs() {
        var self = this;
        var playerMoved = false;
        Object.keys(this.cursorKeys).forEach(function(key) {
            playerMoved |= self.cursorKeys[key].isDown;
        });
        if (playerMoved) {
            var event = this.createPlayerMoved();
            this.inputQueue.push(event);
            _webSocket.send(event);
        }
    };
    ControlledPlayer.prototype.processSnapshot = function processSnapshot(event) {
        Object.getPrototypeOf(ControlledPlayer.prototype).processSnapshot.call(this, event);

        var lastInputSequenceIndex = -1;
        for (var i = 0; i < this.inputQueue.length; i++) {
            var currentEvent = Event.PlayerMoved.getRootAsPlayerMoved(new flatbuffers.ByteBuffer(this.inputQueue[i]));
            if (currentEvent.sequence() == event.sequence()) {
                lastInputSequenceIndex = i;
                break;
            }
        }

        if (lastInputSequenceIndex != -1) {
            this.inputQueue.splice(0, lastInputSequenceIndex + 1);
        }

        this.lastSnapshot = event;
    };
    ControlledPlayer.prototype.createPlayerMoved = function queuePlayerMoved() {
        var builder = new flatbuffers.Builder();
        var idOffset = builder.createString(this.id);
        Event.PlayerMoved.startPlayerMoved(builder);
        Event.PlayerMoved.addId(builder, idOffset);
        Event.PlayerMoved.addTime(builder, this.game.time.serverStartTime + this.game.time.now);
        Event.PlayerMoved.addSequence(builder, this.inputSequence++);
        // Event.PlayerMoved.addX(builder, this.x);
        // Event.PlayerMoved.addY(builder, this.y);
        // Event.PlayerMoved.addRotation(builder, Phaser.Math.degToRad(this.rotation));
        Event.PlayerMoved.addVelocity(builder, this.cursorKeys['up'].isDown);
        Event.PlayerMoved.addAngularVelocity(builder, this.cursorKeys['right'].isDown - this.cursorKeys['left'].isDown);
        Event.PlayerMoved.finishPlayerMovedBuffer(builder, Event.PlayerMoved.endPlayerMoved(builder));
        return builder.asUint8Array();
    };
    ControlledPlayer.prototype.queuePlayerShot = function queuePlayerShot(laser) {
        var builder = new flatbuffers.Builder();
        var idOffset = builder.createString(this.id);
        Event.PlayerShot.startPlayerShot(builder);
        Event.PlayerShot.addId(builder, idOffset);
        Event.PlayerShot.addTime(builder, this.game.time.serverStartTime + this.game.time.now);
        Event.PlayerShot.addX(builder, laser.x);
        Event.PlayerShot.addY(builder, laser.y);
        Event.PlayerShot.addRotation(builder, laser.rotation);
        Event.PlayerShot.finishPlayerShotBuffer(builder, Event.PlayerShot.endPlayerShot(builder));
        _inputQueue.push(builder.asUint8Array());
    };


    function clamp(value, min, max) {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        } else {
            return value;
        }
    }

    ControlledPlayer.prototype.constructor = ControlledPlayer;
    window.ControlledPlayer = ControlledPlayer;
})(window);