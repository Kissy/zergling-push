(function (window) {
    function Laser(x, y, r) {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources['laser'].texture);
        this.sprite.component = this;
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.rotation = r;
        this.sprite.scale.x = _scale;
        this.sprite.scale.y = _scale;
        this.sprite.anchor.set(0.5, 0.5);
        this.lifespan = _laserStartingLifespan;
    }

    Laser.prototype.update = function update(deltaTime) {
        this.sprite.x = this.sprite.x + _laserFullVelocity * Math.sin(this.sprite.rotation) * deltaTime;
        this.sprite.y = this.sprite.y - _laserFullVelocity * Math.cos(this.sprite.rotation) * deltaTime;
        this.lifespan -= deltaTime;
        if (this.lifespan <= 0) {
            _stage.removeChild(this.sprite);
        }
    };
    window.Laser = Laser;
})(window);