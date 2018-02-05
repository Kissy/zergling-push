package fr.kissy.zergling_push.model;

import com.google.flatbuffers.FlatBufferBuilder;
import fr.kissy.zergling_push.event.ProjectileSnapshot;

import java.util.Collection;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static fr.kissy.zergling_push.model.Player.*;

/**
 * Created by Guillaume on 21/01/2017.
 */
public class Projectile extends WorldObject {
    public static final float VELOCITY_FACTOR = 500f;
    public static final float VELOCITY_FACTOR_MS = VELOCITY_FACTOR / 1000f;
    private final Player player;
    private final Set<Player> playersHit;
    private double originX;
    private double originY;
    private double velocityX;
    private double velocityY;
    private long time;
    private boolean expired;

    public Projectile(Player player, String id, float x, float y, double rotation, long time) {
        super(id, x, y, rotation);
        this.player = player;
        this.originX = x;
        this.originY = y;
        this.velocityX = Math.cos(this.rotation - Math.PI / 2) * VELOCITY_FACTOR_MS;
        this.velocityY = Math.sin(this.rotation - Math.PI / 2) * VELOCITY_FACTOR_MS;
        this.time = time;
        this.rotation = rotation;
        this.playersHit = new HashSet<>();
        this.expired = false;
    }

    public void update(double deltaTime) {
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
    }

    public void detectHit(Collection<Player> players) {
        Optional<Player> hitPlayer = players.stream()
                .filter(p -> !p.equals(this.player))
                .filter(p -> p.isHitBy(this))
                .findAny();
        if (hitPlayer.isPresent()) {
            hitPlayer.get().hit(this);
            this.expired = true;
        }
    }

    public boolean canHit(Player player) {
        return !this.player.equals(player) && !playersHit.contains(player);
    }

    public void hit(Player player) {
        playersHit.add(player);
        player.getShots().remove(this);
    }

    public boolean expired() {
        return expired || x > MAX_X_VALUE || x < MIN_X_Y_VALUE || y > MAX_Y_VALUE || y < MIN_X_Y_VALUE;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public Integer createPlayerShotSnapshotOffset(FlatBufferBuilder fbb) {
        int idOffset = fbb.createString(id);
        return ProjectileSnapshot.createProjectileSnapshot(fbb, idOffset, (float) originX, (float) originY, (float) rotation, time);
    }
}
