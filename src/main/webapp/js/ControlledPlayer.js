(function (window) {
    function ControlledPlayer() {
        this.id = "self";
        this.sprite = new PIXI.Sprite(PIXI.loader.resources['avatar'].texture);
        this.sprite.component = this;
        this.sprite.x = _width / 2 - this.sprite.width / 2;
        this.sprite.y = _height / 2 - this.sprite.height / 2;
        this.sprite.scale.x = _scale;
        this.sprite.scale.y = _scale;
        this.sprite.anchor.set(0.5, 0.5);
        this.playerPlayground = new PIXI.Rectangle(this.sprite.width / 2, this.sprite.height / 2,
            _width - this.sprite.width / 2, _height - this.sprite.height / 2);
        this.sprite.rotation = 0;
        this.velocity = 0;
        this.angularVelocity = 0;
        this.residualVelocity = 0;
        Keyboard.bind('up', this.accelerate.bind(this), this.decelerate.bind(this));
        Keyboard.bind('right', this.turnRight.bind(this), this.turnLeft.bind(this));
        Keyboard.bind('left', this.turnLeft.bind(this), this.turnRight.bind(this));
        Keyboard.bind('a', this.fire.bind(this));
    }

    ControlledPlayer.prototype.moved = function moved(event) {
        console.log("check player moved");
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
        var x = this.sprite.x + this.sprite.width * Math.sin(this.sprite.rotation);
        var y = this.sprite.y - this.sprite.height * Math.cos(this.sprite.rotation);
        var laser = new Laser(x, y, this.sprite.rotation);
        _stage.addChild(laser.sprite);
    };
    ControlledPlayer.prototype.update = function update(deltaTime) {
        this.residualVelocity = Math.max(this.residualVelocity - _playerDecelerationFactor, 0);

        var currentVelocity = (this.velocity + this.residualVelocity) * _playerVelocityFactor * deltaTime;
        this.sprite.x = clamp(this.sprite.x + currentVelocity * Math.sin(this.sprite.rotation),
            this.playerPlayground.x, this.playerPlayground.width);
        this.sprite.y = clamp(this.sprite.y - currentVelocity * Math.cos(this.sprite.rotation),
            this.playerPlayground.y, this.playerPlayground.height);
        this.sprite.rotation = (this.sprite.rotation + this.angularVelocity * _playerAngularVelocityFactor * deltaTime) % _moduloRadian;
    };
    ControlledPlayer.prototype.queuePlayerMoved = function queuePlayerMoved() {
        var builder = new flatbuffers.Builder();
        var idOffset = builder.createString(this.id);
        Event.PlayerMoved.startPlayerMoved(builder);
        Event.PlayerMoved.addId(builder, idOffset);
        Event.PlayerMoved.addTime(builder, new Date().getTime());
        Event.PlayerMoved.addX(builder, this.sprite.x / _scale);
        Event.PlayerMoved.addY(builder, this.sprite.y / _scale);
        Event.PlayerMoved.addRotation(builder, this.sprite.rotation);
        Event.PlayerMoved.addVelocity(builder, this.velocity);
        Event.PlayerMoved.addAngularVelocity(builder, this.angularVelocity);
        Event.PlayerMoved.finishPlayerMovedBuffer(builder, Event.PlayerMoved.endPlayerMoved(builder));
        _inputQueue.push(builder.asUint8Array());
    };

    window.ControlledPlayer = ControlledPlayer;
})(window);