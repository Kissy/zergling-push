(function (window) {
    function ControlledPlayer(event) {
        this.id = event.id();
        this.sprite = new PIXI.Container();
        this.sprite.component = this;
        this.sprite.x = event.x() * _scale;
        this.sprite.y = event.y() * _scale;
        this.sprite.scale.x = _scale;
        this.sprite.scale.y = _scale;
        this.velocity = 0;
        this.angularVelocity = 0;
        this.residualVelocity = 0;

        this.avatarSprite = new PIXI.Sprite(PIXI.loader.resources['avatar'].texture);
        this.avatarSprite.anchor.set(0.5, 0.5);
        this.avatarSprite.rotation = event.rotation();
        this.sprite.addChild(this.avatarSprite);
        this.nameSprite = new PIXI.Text(event.name(), {font: "20px Arial", fill: "#2979FF"});
        this.nameSprite.position.set(- (this.nameSprite.width / 2), - (_playerHeight + this.nameSprite.height + _playerNameSpace * _scale));
        this.sprite.addChild(this.nameSprite);

        Keyboard.bind('up', this.accelerate.bind(this), this.decelerate.bind(this));
        Keyboard.bind('right', this.turnRight.bind(this), this.turnLeft.bind(this));
        Keyboard.bind('left', this.turnLeft.bind(this), this.turnRight.bind(this));
        Keyboard.bind('a', this.fire.bind(this));
    }

    ControlledPlayer.prototype.moved = function moved(event) {
    };
    ControlledPlayer.prototype.shot = function shot(event) {
    };
    ControlledPlayer.prototype.accelerate = function accelerate() {
        this.velocity = 1;
        this.residualVelocity = 0;
        this.queuePlayerMoved();
    };
    ControlledPlayer.prototype.decelerate = function decelerate() {
        this.velocity = 0;
        this.residualVelocity = 1;
        this.queuePlayerMoved();
    };
    ControlledPlayer.prototype.turnRight = function turnRight() {
        this.angularVelocity++;
        this.queuePlayerMoved();
    };
    ControlledPlayer.prototype.turnLeft = function turnLeft() {
        this.angularVelocity--;
        this.queuePlayerMoved();
    };
    ControlledPlayer.prototype.fire = function fire() {
        var x = this.sprite.x + this.sprite.width * Math.sin(this.avatarSprite.rotation);
        var y = this.sprite.y - this.sprite.height * Math.cos(this.avatarSprite.rotation);
        var laser = new Laser(x, y, this.avatarSprite.rotation);
        _stage.addChild(laser.sprite);
        this.queuePlayerShot(laser);
    };
    ControlledPlayer.prototype.update = function update(deltaTime) {
        this.residualVelocity = Math.max(this.residualVelocity - _playerDecelerationFactor, 0);

        var currentVelocity = (this.velocity + this.residualVelocity) * _playerVelocityFactor * deltaTime;
        this.sprite.x = clamp(this.sprite.x + currentVelocity * Math.sin(this.avatarSprite.rotation),
            _playerPlayground.x, _playerPlayground.width);
        this.sprite.y = clamp(this.sprite.y - currentVelocity * Math.cos(this.avatarSprite.rotation),
            _playerPlayground.y, _playerPlayground.height);
        this.avatarSprite.rotation = (this.avatarSprite.rotation + this.angularVelocity * _playerAngularVelocityFactor * deltaTime) % _moduloRadian;
    };
    ControlledPlayer.prototype.queuePlayerMoved = function queuePlayerMoved() {
        var builder = new flatbuffers.Builder();
        var idOffset = builder.createString(this.id);
        Event.PlayerMoved.startPlayerMoved(builder);
        Event.PlayerMoved.addId(builder, idOffset);
        Event.PlayerMoved.addTime(builder, new Date().getTime() - _referenceTime);
        Event.PlayerMoved.addX(builder, this.sprite.x / _scale);
        Event.PlayerMoved.addY(builder, this.sprite.y / _scale);
        Event.PlayerMoved.addRotation(builder, this.avatarSprite.rotation);
        Event.PlayerMoved.addVelocity(builder, this.velocity);
        Event.PlayerMoved.addAngularVelocity(builder, this.angularVelocity);
        Event.PlayerMoved.finishPlayerMovedBuffer(builder, Event.PlayerMoved.endPlayerMoved(builder));
        _inputQueue.push(builder.asUint8Array());
    };
    ControlledPlayer.prototype.queuePlayerShot = function queuePlayerShot(laser) {
        var builder = new flatbuffers.Builder();
        var idOffset = builder.createString(this.id);
        Event.PlayerShot.startPlayerShot(builder);
        Event.PlayerShot.addId(builder, idOffset);
        Event.PlayerShot.addTime(builder, new Date().getTime() - _referenceTime);
        Event.PlayerShot.addX(builder, laser.sprite.x / _scale);
        Event.PlayerShot.addY(builder, laser.sprite.y / _scale);
        Event.PlayerShot.addRotation(builder, laser.sprite.rotation);
        Event.PlayerShot.finishPlayerShotBuffer(builder, Event.PlayerShot.endPlayerShot(builder));
        _inputQueue.push(builder.asUint8Array());
    };

    window.ControlledPlayer = ControlledPlayer;
})(window);