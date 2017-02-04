package fr.kissy.zergling_push.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static fr.kissy.zergling_push.model.Player.MAX_X_VALUE;
import static fr.kissy.zergling_push.model.Player.MAX_Y_VALUE;
import static fr.kissy.zergling_push.model.Player.MIN_X_Y_VALUE;

/**
 * Created by Guillaume on 21/01/2017.
 */
public class Laser {
    public static final float LASER_VELOCITY_FACTOR = 500f;
    private final Player player;
    private final Set<Player> playersHit;
    private double x;
    private double y;
    private double rotation;

    public Laser(Player player, float x, float y, double rotation) {
        this.player = player;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.playersHit = new HashSet<>();
    }

    public void update(double deltaTime) {
        this.x = this.x + LASER_VELOCITY_FACTOR * Math.sin(this.rotation) * deltaTime;
        this.y = this.y - LASER_VELOCITY_FACTOR * Math.cos(this.rotation) * deltaTime;
    }

    public boolean canHit(Player player) {
        return !this.player.equals(player) && !playersHit.contains(player);
    }

    public void hit(Player player) {
        playersHit.add(player);
    }

    public boolean expired() {
        return x > MAX_X_VALUE || x < MIN_X_Y_VALUE || y > MAX_Y_VALUE || y < MIN_X_Y_VALUE;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }
}
