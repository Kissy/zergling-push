(function (window) {
    var _playerFullVelocity = 0.8;
    var _playerFullAngularVelocity = 0.006;
    var _playerDeceleration = 0.4;

    function ControlledPlayer() {
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
        this.deceleration = 0;
        Keyboard.bind('up', this.accelerate.bind(this), this.decelerate.bind(this));
        Keyboard.bind('right', this.turnRight.bind(this), this.turnLeft.bind(this));
        Keyboard.bind('left', this.turnLeft.bind(this), this.turnRight.bind(this));
        Keyboard.bind('a', this.fire.bind(this));

        this.playerAcceleratedBuilder = generatePlayerAccelerated.call(this);
        this.playerDeceleratedBuilder = generatePlayerDecelerated.call(this);
        this.playerTurnedBuilder = generatePlayerTurned.call(this);
    }

    function generatePlayerAccelerated() {
        var builder = new flatbuffers.Builder();
        builder.forceDefaults(true);
        Event.PlayerAccelerated.startPlayerAccelerated(builder);
        Event.PlayerAccelerated.addId(builder, 1);
        Event.PlayerAccelerated.addX(builder, this.sprite.x);
        Event.PlayerAccelerated.addY(builder, this.sprite.y);
        Event.PlayerAccelerated.addRotation(builder, this.sprite.rotation);
        Event.PlayerAccelerated.addVelocity(builder, this.velocity);
        Event.PlayerAccelerated.finishPlayerAcceleratedBuffer(builder, Event.PlayerAccelerated.endPlayerAccelerated(builder));
        return builder;
    }

    function generatePlayerDecelerated() {
        var builder = new flatbuffers.Builder();
        builder.forceDefaults(true);
        Event.PlayerDecelerated.startPlayerDecelerated(builder);
        Event.PlayerDecelerated.addId(builder, 1);
        Event.PlayerDecelerated.addX(builder, this.sprite.x);
        Event.PlayerDecelerated.addY(builder, this.sprite.y);
        Event.PlayerDecelerated.addRotation(builder, this.sprite.rotation);
        Event.PlayerDecelerated.addDeceleration(builder, this.deceleration);
        Event.PlayerDecelerated.finishPlayerDeceleratedBuffer(builder, Event.PlayerDecelerated.endPlayerDecelerated(builder));
        return builder;
    }

    function generatePlayerTurned() {
        var builder = new flatbuffers.Builder();
        builder.forceDefaults(true);
        Event.PlayerTurned.startPlayerTurned(builder);
        Event.PlayerTurned.addId(builder, 1);
        Event.PlayerTurned.addX(builder, this.sprite.x);
        Event.PlayerTurned.addY(builder, this.sprite.y);
        Event.PlayerTurned.addRotation(builder, this.sprite.rotation);
        Event.PlayerTurned.addAngularVelocity(builder, this.angularVelocity);
        Event.PlayerTurned.finishPlayerTurnedBuffer(builder, Event.PlayerTurned.endPlayerTurned(builder));
        return builder;
    }

    ControlledPlayer.prototype.accelerate = function accelerate() {
        this.deceleration = 0;
        this.velocity = _playerFullVelocity;

        var event = Event.PlayerAccelerated.getRootAsPlayerAccelerated(this.playerAcceleratedBuilder.dataBuffer());
        event.mutate_x(this.sprite.x);
        event.mutate_y(this.sprite.y);
        event.mutate_rotation(this.sprite.rotation);
        event.mutate_velocity(this.velocity);
        //noinspection JSCheckFunctionSignatures
        _webSocket.send(this.playerAcceleratedBuilder.asUint8Array());
    };
    ControlledPlayer.prototype.decelerate = function decelerate() {
        this.deceleration = _playerDeceleration;

        var event = Event.PlayerDecelerated.getRootAsPlayerDecelerated(this.playerDeceleratedBuilder.dataBuffer());
        event.mutate_x(this.sprite.x);
        event.mutate_y(this.sprite.y);
        event.mutate_deceleration(this.deceleration);
        //noinspection JSCheckFunctionSignatures
        _webSocket.send(this.playerDeceleratedBuilder.asUint8Array());
    };
    ControlledPlayer.prototype.turnRight = function turnRight() {
        this.angularVelocity += _playerFullAngularVelocity;

        var event = Event.PlayerTurned.getRootAsPlayerTurned(this.playerTurnedBuilder.dataBuffer());
        event.mutate_x(this.sprite.x);
        event.mutate_y(this.sprite.y);
        event.mutate_rotation(this.sprite.rotation);
        event.mutate_angularVelocity(this.angularVelocity);
        //noinspection JSCheckFunctionSignatures
        _webSocket.send(this.playerTurnedBuilder.asUint8Array());
    };
    ControlledPlayer.prototype.turnLeft = function turnLeft() {
        this.angularVelocity -= _playerFullAngularVelocity;

        var event = Event.PlayerTurned.getRootAsPlayerTurned(this.playerTurnedBuilder.dataBuffer());
        event.mutate_x(this.sprite.x);
        event.mutate_y(this.sprite.y);
        event.mutate_rotation(this.sprite.rotation);
        event.mutate_angularVelocity(this.angularVelocity);
        //noinspection JSCheckFunctionSignatures
        _webSocket.send(this.playerTurnedBuilder.asUint8Array());
    };
    ControlledPlayer.prototype.fire = function fire() {
        var x = this.sprite.x + this.sprite.width * Math.sin(this.sprite.rotation);
        var y = this.sprite.y - this.sprite.height * Math.cos(this.sprite.rotation);
        var laser = new Laser(x, y, this.sprite.rotation);
        _stage.addChild(laser.sprite);
    };
    ControlledPlayer.prototype.update = function update(deltaTime) {
        this.velocity = Math.max(this.velocity - this.deceleration, 0);

        this.sprite.x = clamp(this.sprite.x + this.velocity * Math.sin(this.sprite.rotation) * deltaTime,
            this.playerPlayground.x, this.playerPlayground.width);
        this.sprite.y = clamp(this.sprite.y - this.velocity * Math.cos(this.sprite.rotation) * deltaTime,
            this.playerPlayground.y, this.playerPlayground.height);
        this.sprite.rotation += this.angularVelocity * deltaTime;
    };

    window.ControlledPlayer = ControlledPlayer;
})(window);