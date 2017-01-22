package fr.kissy.zergling_push.model;

import static fr.kissy.zergling_push.model.Player.MAX_X_VALUE;
import static fr.kissy.zergling_push.model.Player.MAX_Y_VALUE;
import static fr.kissy.zergling_push.model.Player.MIN_X_Y_VALUE;

/**
 * Created by Guillaume on 21/01/2017.
 */
public class Laser {
    private static final double _laserFullVelocity = 2;
    private static final short _laserStartingLifespan = 1000;
    private final Player player;
    private float x;
    private float y;
    private double rotation;
    private short lifespan;

    public Laser(Player player, float x, float y, double rotation) {
        this.player = player;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.lifespan = _laserStartingLifespan;
    }

    public void update(long deltaTime) {
        this.x = (float) (this.x + _laserFullVelocity * Math.sin(this.rotation) * deltaTime);
        this.y = (float) (this.y - _laserFullVelocity * Math.cos(this.rotation) * deltaTime);
        if (x > MAX_X_VALUE || x < MIN_X_Y_VALUE || y > MAX_Y_VALUE || y < MIN_X_Y_VALUE) {
            this.lifespan = 0;
        } else {
            this.lifespan -= deltaTime;
        }
    }

    public void hit() {
        player.getShots().remove(this);
    }

    public boolean expired() {
        return this.lifespan <= 0;
    }

    public float getX() {
        return x;
    }

    public float getY() {
        return y;
    }
}
