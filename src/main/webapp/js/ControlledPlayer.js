(function (window) {
    var SAMPLE_INPUT_RATE = 32;

    function ControlledPlayer(event) {
        Player.call(this, event, 'avatar');
        /*this.shieldSprite = new PIXI.Sprite(PIXI.loader.resources['shield_silver'].texture);
         _stage.addChild(this.shieldSprite);*/
        this.firing = false;
        this.firingTimer = 0;
        this.nextFireTime = 0;
        this.nextProcessInputTime = 0;

        this.lastAppliedInputSequence = 0;
        this.lastSnapshot = null;

        this.inputSequence = 0;
        // this.cursorKeys = this.game.input.keyboard.createCursorKeys();
        this.cursorKeys = this.game.input.keyboard.addKeys({
            'up': Phaser.KeyCode.UP,
            'left': Phaser.KeyCode.LEFT,
            'right': Phaser.KeyCode.RIGHT,
            'space': Phaser.KeyCode.SPACEBAR
        });

        // this.spaceKey = _game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // this.spaceKey.onDown.add(this.fire, this);
    }

    ControlledPlayer.prototype = Object.create(Player.prototype);

    ControlledPlayer.prototype.shot = function shot(event) {
    };
    ControlledPlayer.prototype.hit = function hit(event) {
        this.alpha = 0.2;
    };
    ControlledPlayer.prototype.update = function update(deltaTime) {
        // Process inputs and add it to queue
        this.processInputs();

        // Network reconciliation
        if (this.lastSnapshot) {
            this.rotation = this.lastSnapshot.rotation();
            this.x = this.lastSnapshot.x();
            this.y = this.lastSnapshot.y();

            if (!this.lastSnapshot.shotProcessed) {
                this.lastSnapshot.shotProcessed = true;
                for (var p = 0; p < this.lastSnapshot.shotsLength(); p++) {
                    var playerShotSnapshot = this.lastSnapshot.shots(p);
                    var shot = this.shots.getFirstExists(false);
                    if (shot) {
                        shot.reset(playerShotSnapshot);
                    }
                }
            }
        }

        // Client prediction (apply queued inputs)
        for (var j = 0; j < this.inputQueue.length; j++) {
            var currentInput = this.inputQueue[j];
            var byteBuffer = new flatbuffers.ByteBuffer(currentInput.event);
            var currentEvent = Event.PlayerMoved.getRootAsPlayerMoved(byteBuffer);
            this.rotation += currentEvent.angularVelocity() * _playerAngularVelocityFactor * currentInput.physicsElapsed;
            this.x += currentEvent.velocity() * _playerVelocityFactor * Math.sin(this.rotation) * currentInput.physicsElapsed;
            this.y -= currentEvent.velocity() * _playerVelocityFactor * Math.cos(this.rotation) * currentInput.physicsElapsed;
            // if (currentEvent.firing()) {
            //     if (_game.time.now > this.nextFireTime) {
            //         this.nextFireTime = _game.time.now + _playerFireRate;
            //         this.shots.add(new Laser(this, currentEvent));
            //     }
            // }
        }

        // Detect collision
        if (this.inputQueue.length > 0) {
            this.x = clamp(this.x, 0, 1920);
            this.y = clamp(this.y, 0, 960);
        }

        Object.getPrototypeOf(ControlledPlayer.prototype).update.call(this, deltaTime);
    };
    ControlledPlayer.prototype.processInputs = function processInputs() {
        // if (_game.time.now < this.nextProcessInputTime) {
            // console.log("skipping " + _game.time.now);
            // return;
        // }

        // console.log("sampling " + _game.time.now);
        this.nextProcessInputTime = _game.time.now + SAMPLE_INPUT_RATE;

        // var self = this, event;
        // var playerMoved = false;
        // Object.keys(this.cursorKeys).forEach(function (key) {
        //     playerMoved |= self.cursorKeys[key].isDown;
        // });
        // if (playerMoved) {
            var event = this.createPlayerMoved();
            this.inputQueue.push({
                event: event,
                sequence: this.inputSequence,
                physicsElapsed: _game.time.physicsElapsed
            });
            // TODO send only at 30 fps
            _webSocket.send(event);
        // }
        /*if (this.cursorKeys.isDown) {
             if (_game.time.now > this.nextFireTime) {
                 this.nextFireTime = _game.time.now + _playerFireRate;
                 event = this.createPlayerShot();

                 var byteBuffer = new flatbuffers.ByteBuffer(event);
                 var currentEvent = Event.PlayerShot.getRootAsPlayerShot(byteBuffer);
                 this.shots.add(new Laser(this, currentEvent));

                 _webSocket.send(event);
             }
         }*/
    };
    ControlledPlayer.prototype.processSnapshot = function processSnapshot(event) {
        Object.getPrototypeOf(ControlledPlayer.prototype).processSnapshot.call(this, event);

        var lastInputSequenceIndex = -1;
        for (var i = 0; i < this.inputQueue.length; i++) {
            if (this.inputQueue[i].sequence === event.sequence()) {
                lastInputSequenceIndex = i;
                break;
            }
        }

        if (lastInputSequenceIndex !== -1) {
            this.inputQueue.splice(0, lastInputSequenceIndex + 1);
        }

        this.lastSnapshot = event;
        this.lastSnapshot.shotProcessed = false;
    };
    ControlledPlayer.prototype.createPlayerMoved = function queuePlayerMoved() {
        var builder = new flatbuffers.Builder();
        var idOffset = builder.createString(this.id);
        Event.PlayerMoved.startPlayerMoved(builder);
        Event.PlayerMoved.addId(builder, idOffset);
        Event.PlayerMoved.addTime(builder, this.game.time.serverStartTime + this.game.time.now);
        Event.PlayerMoved.addSequence(builder, ++this.inputSequence);
        Event.PlayerMoved.addVelocity(builder, this.cursorKeys['up'].isDown);
        Event.PlayerMoved.addAngularVelocity(builder, this.cursorKeys['right'].isDown - this.cursorKeys['left'].isDown);
        Event.PlayerMoved.addFiring(builder, this.cursorKeys['space'].isDown);
        Event.PlayerMoved.finishPlayerMovedBuffer(builder, Event.PlayerMoved.endPlayerMoved(builder));
        return builder.asUint8Array();
    };
    ControlledPlayer.prototype.createPlayerShot = function createPlayerShot() {
        var builder = new flatbuffers.Builder();
        var idOffset = builder.createString(this.id + "-" + new Date().getTime());
        Event.PlayerShot.startPlayerShot(builder);
        Event.PlayerShot.addId(builder, idOffset);
        Event.PlayerShot.addTime(builder, this.game.time.serverStartTime + this.game.time.now);
        Event.PlayerShot.finishPlayerShotBuffer(builder, Event.PlayerShot.endPlayerShot(builder));
        return builder.asUint8Array();
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