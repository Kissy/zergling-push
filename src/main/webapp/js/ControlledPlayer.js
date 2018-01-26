(function (window) {
    var SAMPLE_INPUT_RATE = 32;

    function ControlledPlayer(game, remoteWorld, event) {
        Player.call(this, game, remoteWorld, event, 'avatar');

        this.firing = false;
        this.firingTimer = 0;
        this.nextFireTime = 0;
        this.nextProcessInputTime = 0;

        this.lastAppliedInputSequence = 0;
        this.lastSnapshot = null;

        // TODO make InputList class
        this.inputQueue = [];
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
        Object.getPrototypeOf(ControlledPlayer.prototype).update.call(this, deltaTime);

        // Process inputs and add it to queue
        this.processInputs();

        // TODO do it when snapshot arrives
        for (var i = 0; i < this.inputQueue.length; i++) {
            var currentInput = this.inputQueue[i];
            if (currentInput.sequence > this.targetSnapshot.sequence()) {
                this.inputQueue.splice(0, i);
                break;
            }
        }

        // Client prediction (apply queued inputs)
        this.rotation = this.targetSnapshot.rotation();
        this.x = this.targetSnapshot.x();
        this.y = this.targetSnapshot.y();
        for (var j = 0; j < this.inputQueue.length; j++) {
            var currentInput = this.inputQueue[j];
            var byteBuffer = new flatbuffers.ByteBuffer(currentInput.event);
            var currentEvent = Event.PlayerMoved.getRootAsPlayerMoved(byteBuffer);
            var duration = currentEvent.duration() / 1000;
            this.rotation += currentEvent.angularVelocity() * _playerAngularVelocityFactor * duration;
            if (currentInput.done !== true && currentEvent.firing() === true) {
                console.log(this.rotation);
                currentInput.done = true;
            }
            this.x += currentEvent.velocity() * _playerVelocityFactor * Math.sin(this.rotation) * duration;
            this.y -= currentEvent.velocity() * _playerVelocityFactor * Math.cos(this.rotation) * duration;

            if (currentEvent.firing()) {
                 if (_game.time.now > this.nextFireTime) {
                     this.nextFireTime = _game.time.now + _playerFireRate;
                     var x = this.x + (this.height + 10) * Math.sin(this.rotation);
                     currentEvent.x = function() {
                         return x;
                     };
                     var y = this.y - (this.height + 10) * Math.cos(this.rotation);
                     currentEvent.y = function() {
                         return y;
                     };
                     var rotation = this.rotation;
                     currentEvent.rotation = function() {
                         return rotation;
                     };
                     console.log(this.game.time);
                     ZerglingPush.PlayState.world.projectiles.add(new ZerglingPush.Projectile(this.game, currentEvent));
                 }
             }
        }

        // Detect collision
        if (this.inputQueue.length > 0) {
            this.x = clamp(this.x, 0, 1920);
            this.y = clamp(this.y, 0, 960);
        }
    };
    ControlledPlayer.prototype.processInputs = function processInputs() {
        // if (_game.time.now < this.nextProcessInputTime) {
            // console.log("skipping " + _game.time.now);
            // return;
        // }

        // console.log("sampling " + _game.time.now);
        this.nextProcessInputTime = _game.time.now + SAMPLE_INPUT_RATE;

        // var self = this, event;
        var event = this.createPlayerMoved();
        this.inputQueue.push({
            event: event,
            sequence: this.inputSequence
        });
        // TODO send only at 30 fps
        this.game.net.webSocket.send(event);
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
    ControlledPlayer.prototype.createPlayerMoved = function queuePlayerMoved() {
        var builder = new flatbuffers.Builder();
        var idOffset = builder.createString(this.name);
        Event.PlayerMoved.startPlayerMoved(builder);
        Event.PlayerMoved.addId(builder, idOffset);
        Event.PlayerMoved.addTime(builder, this.game.time.clientTime);
        Event.PlayerMoved.addDuration(builder, this.game.time.physicsElapsedMS);
        Event.PlayerMoved.addSequence(builder, ++this.inputSequence);
        Event.PlayerMoved.addVelocity(builder, this.cursorKeys['up'].isDown);
        Event.PlayerMoved.addAngularVelocity(builder, this.cursorKeys['right'].isDown - this.cursorKeys['left'].isDown);
        Event.PlayerMoved.addFiring(builder, this.cursorKeys['space'].isDown);
        Event.PlayerMoved.finishPlayerMovedBuffer(builder, Event.PlayerMoved.endPlayerMoved(builder));
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