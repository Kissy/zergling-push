(function (window) {
    function ControlledPlayer(event) {
        Player.call(this, event);
        this.avatarSprite.texture = PIXI.loader.resources['avatar'].texture;
        this.nameSprite.style.fill = "#2979FF";

        Keyboard.bind('up', this.accelerate.bind(this), this.decelerate.bind(this));
        Keyboard.bind('right', this.turnRight.bind(this), this.turnLeft.bind(this));
        Keyboard.bind('left', this.turnLeft.bind(this), this.turnRight.bind(this));
        Keyboard.bind('a', this.fire.bind(this));
    }

    ControlledPlayer.prototype = Object.create(Player.prototype);
    ControlledPlayer.prototype.constructor = ControlledPlayer;

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
    ControlledPlayer.prototype.moved = function moved(event) {
    };
    ControlledPlayer.prototype.shot = function shot(event) {
    };
    ControlledPlayer.prototype.hit = function hit(event) {
    };
    ControlledPlayer.prototype.fire = function fire() {
        var laser = Object.getPrototypeOf(ControlledPlayer.prototype).fire.call(this);
        this.queuePlayerShot(laser);
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