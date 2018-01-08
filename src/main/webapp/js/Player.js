(function (window) {
    function Player(game, event, texture) {
        RemoteSprite.call(this, game, event, texture);

        this.shields = 3;
    }

    Player.prototype = Object.create(RemoteSprite.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.shot = function shot(event) {
    };
    Player.prototype.hit = function hit(event) {
        this.shields--;
    };
    Player.prototype.update = function update(deltaTime) {
        Object.getPrototypeOf(Player.prototype).update.call(this, deltaTime);

        // this.residualVelocity = Math.max(this.residualVelocity - _playerDecelerationFactor, 0);
        // var currentVelocity = (this.forwardVelocity + this.residualVelocity);
        // var xVelocity = currentVelocity * Math.sin(this.rotation);
        // var yVelocity = currentVelocity * Math.cos(this.rotation);
        // this.x += xVelocity * _game.time.physicsElapsed;
        // this.y -= yVelocity * _game.time.physicsElapsed;
    };

    window.Player = Player;
})(window);