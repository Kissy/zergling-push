(function (window) {
    function ControlledPlayer(event) {
        Player.call(this, event, 'avatar');
        /*this.shieldSprite = new PIXI.Sprite(PIXI.loader.resources['shield_silver'].texture);
        _stage.addChild(this.shieldSprite);*/
        this.firing = false;
        this.firingTimer = 0;

        this.upKey = _game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.upKey.onDown.add(this.accelerate, this);
        this.upKey.onUp.add(this.decelerate, this);
        this.rightKey = _game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.rightKey.onDown.add(this.turnRight, this);
        this.rightKey.onUp.add(this.turnLeft, this);
        this.leftKey = _game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.leftKey.onDown.add(this.turnLeft, this);
        this.leftKey.onUp.add(this.turnRight, this);
        this.spaceKey = _game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceKey.onDown.add(this.fire, this);
    }

    ControlledPlayer.prototype = Object.create(Player.prototype);
    ControlledPlayer.prototype.constructor = ControlledPlayer;

    ControlledPlayer.prototype.accelerate = function accelerate() {
        this.forwardVelocity = 1;
        this.residualVelocity = 0;
        this.queuePlayerMoved();
    };
    ControlledPlayer.prototype.decelerate = function decelerate() {
        this.forwardVelocity = 0;
        this.residualVelocity = 1;
        this.queuePlayerMoved();
    };
    ControlledPlayer.prototype.turnRight = function turnRight() {
        this.body.angularVelocity += _playerAngularVelocityFactor;
        this.queuePlayerMoved();
    };
    ControlledPlayer.prototype.turnLeft = function turnLeft() {
        this.body.angularVelocity -= _playerAngularVelocityFactor;
        this.queuePlayerMoved();
    };
    ControlledPlayer.prototype.startFiring = function turnLeft() {
        this.firing = true;
    };
    ControlledPlayer.prototype.stopFiring = function turnLeft() {
        this.firing = false;
    };
    ControlledPlayer.prototype.fire = function fire() {
        var x = this.body.center.x + this.width * Math.sin(this.rotation);
        var y = this.body.center.y - this.height * Math.cos(this.rotation);
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
    ControlledPlayer.prototype.queuePlayerMoved = function queuePlayerMoved() {
        var builder = new flatbuffers.Builder();
        var idOffset = builder.createString(this.id);
        Event.PlayerMoved.startPlayerMoved(builder);
        Event.PlayerMoved.addId(builder, idOffset);
        Event.PlayerMoved.addTime(builder, new Date().getTime() - _referenceTime);
        Event.PlayerMoved.addX(builder, this.body.x / _scale);
        Event.PlayerMoved.addY(builder, this.body.y / _scale);
        Event.PlayerMoved.addRotation(builder, this.rotation);
        Event.PlayerMoved.addVelocity(builder, this.forwardVelocity);
        Event.PlayerMoved.addAngularVelocity(builder, this.body.angularVelocity / _playerAngularVelocityFactor);
        Event.PlayerMoved.finishPlayerMovedBuffer(builder, Event.PlayerMoved.endPlayerMoved(builder));
        _inputQueue.push(builder.asUint8Array());
    };
    ControlledPlayer.prototype.queuePlayerShot = function queuePlayerShot(laser) {
        var builder = new flatbuffers.Builder();
        var idOffset = builder.createString(this.id);
        Event.PlayerShot.startPlayerShot(builder);
        Event.PlayerShot.addId(builder, idOffset);
        Event.PlayerShot.addTime(builder, new Date().getTime() - _referenceTime);
        Event.PlayerShot.addX(builder, laser.body.x / _scale);
        Event.PlayerShot.addY(builder, laser.body.y / _scale);
        Event.PlayerShot.addRotation(builder, laser.rotation);
        Event.PlayerShot.finishPlayerShotBuffer(builder, Event.PlayerShot.endPlayerShot(builder));
        _inputQueue.push(builder.asUint8Array());
    };
    ControlledPlayer.prototype.update = function update(deltaTime) {
        Object.getPrototypeOf(ControlledPlayer.prototype).update.call(this, deltaTime);

        /*this.firingTimer--;
        if (this.firing && this.firingTimer <= 0) {
            this.fire();
        }*/
    };

    window.ControlledPlayer = ControlledPlayer;
})(window);