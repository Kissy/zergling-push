(function (window) {
    var _powerUpStartingLifespan = 500;

    function PowerUp(x, y) {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources['shield_silver'].texture);
        this.sprite.component = this;
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scale.x = _scale;
        this.sprite.scale.y = _scale;
        this.sprite.anchor.set(0.5, 0.5);
        this.lifespan = _powerUpStartingLifespan;
    }

    PowerUp.prototype.update = function update(deltaTime) {
        this.lifespan--;
        if (this.lifespan <= 0) {
            _stage.removeChild(this.sprite);
        }
    };

    window.PowerUp = PowerUp;
})(window);