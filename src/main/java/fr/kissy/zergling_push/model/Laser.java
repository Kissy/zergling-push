package fr.kissy.zergling_push.model;

import Event.PlayerShotSnapshot;
import com.google.flatbuffers.FlatBufferBuilder;

import java.util.HashSet;
import java.util.Set;

import static fr.kissy.zergling_push.model.Player.MAX_X_VALUE;
import static fr.kissy.zergling_push.model.Player.MAX_Y_VALUE;
import static fr.kissy.zergling_push.model.Player.MIN_X_Y_VALUE;

/**
 * Created by Guillaume on 21/01/2017.
 */
public class Laser {
    public static final float VELOCITY_FACTOR = 1000f;
    public static final float VELOCITY_FACTOR_MS = VELOCITY_FACTOR / 1000f;
    private final Player player;
    private final Set<Player> playersHit;
    private String id;
    private double x;
    private double y;
    private double rotation;

    public Laser(Player player, String id, float x, float y, double rotation) {
        this.player = player;
        this.id = id;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.playersHit = new HashSet<>();
    }

    public void update(double deltaTime) {
        this.x = this.x + VELOCITY_FACTOR_MS * Math.sin(this.rotation) * deltaTime;
        this.y = this.y - VELOCITY_FACTOR_MS * Math.cos(this.rotation) * deltaTime;
    }

    public boolean canHit(Player player) {
        return !this.player.equals(player) && !playersHit.contains(player);
    }

    public void hit(Player player) {
        playersHit.add(player);
        player.getShots().remove(this);
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

    public Integer createPlayerShotSnapshotOffset(FlatBufferBuilder fbb) {
        int idOffset = fbb.createString(id);
        return PlayerShotSnapshot.createPlayerShotSnapshot(fbb, idOffset, (float) x, (float) y, (float) rotation);
    }
}
