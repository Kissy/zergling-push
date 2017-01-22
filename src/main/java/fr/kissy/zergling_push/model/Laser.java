package fr.kissy.zergling_push.model;

/**
 * Created by Guillaume on 21/01/2017.
 */
public class Laser {
    private static final double _laserFullVelocity = 2;
    private static final double _laserStartingLifespan = 1000;
    private float x;
    private float y;
    private double rotation;
    private short lifespan;

    public Laser(float x, float y, double rotation) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }

    public void update(long deltaTime) {
        this.x = (float) (this.x + _laserFullVelocity * Math.sin(this.rotation) * deltaTime);
        this.y = (float) (this.y - _laserFullVelocity * Math.cos(this.rotation) * deltaTime);
        this.lifespan -= deltaTime;
        if (this.lifespan <= 0) {
            //_stage.removeChild(this.sprite);
        }
    }

    public float getX() {
        return x;
    }

    public float getY() {
        return y;
    }
}
