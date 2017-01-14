(function (window) {
    var _laserFullVelocity = 20;
    var _laserStartingLifespan = 50;

    function Laser(x, y, r) {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources['laser'].texture);
        this.sprite.component = this;
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.rotation = r;
        this.lifespan = _laserStartingLifespan;
    }

    Laser.prototype.update = function update() {
        this.sprite.x += _laserFullVelocity * Math.sin(this.sprite.rotation);
        this.sprite.y -= _laserFullVelocity * Math.cos(this.sprite.rotation);
        this.lifespan--;
        if (this.lifespan <= 0) {
            this.removeFromStage();
        }
    };
    Laser.prototype.addToStage = function addToStage() {
        _stage.addChild(this.sprite);
    };
    Laser.prototype.removeFromStage = function removeFromStage() {
        _stage.removeChild(this.sprite);
    };

    window.Laser = Laser;
})(window);