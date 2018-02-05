package fr.kissy.zergling_push.model;

import com.google.flatbuffers.FlatBufferBuilder;
import fr.kissy.zergling_push.event.PlayerJoined;
import fr.kissy.zergling_push.event.PlayerMoved;
import fr.kissy.zergling_push.event.PlayerSnapshot;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Guillaume on 19/01/2017.
 */
public class Player extends WorldObject {
    public static final double VELOCITY_FACTOR = 300f; // pixel par seconds
    public static final double VELOCITY_FACTOR_MS = VELOCITY_FACTOR / 1000f; // pixel par milliseconds
    public static final double ANGULAR_VELOCITY_FACTOR = 180f; // degres par seconds
    public static final double ANGULAR_VELOCITY_FACTOR_RAD_MS = ANGULAR_VELOCITY_FACTOR * 2f * Math.PI / 360f / 1000f; // radian par milliseconds
    public static final double DECELERATION_FACTOR = 5010f;
    public static final double FIRE_RATE_MS = 1000f;
    public static final int MIN_X_Y_VALUE = 0;
    public static final int MAX_X_VALUE = 1920;
    public static final int MAX_Y_VALUE = 1960;
    protected static final double _moduloRadian = 2 * Math.PI;
    private static final int _playerWidth = 32;
    private static final int _playerHeight = 38;
    private World world;
    private Channel channel;
    private String name;
    private List<Projectile> shots;
    private List<Projectile> newShots;
    private int shields = 3;
    private long lastInputSequence = 0;
    private double lastFiringTime = FIRE_RATE_MS;
    private int nextShotId = 1;

    public Player(String id, double x, double y, double rotation, World world, String name) {
        super(id, x, y, rotation);
        this.world = world;
        this.name = name;
        this.newShots = new ArrayList<>();
    }

    public Player(World world, Channel channel, PlayerJoined event, List<Projectile> shots) {
        super(event.id(), 500, 400, event.snapshot().rotation());
        this.world = world;
        this.channel = channel;
        this.name = event.name();
        this.shots = shots;
        this.newShots = new ArrayList<>();
        if (this.channel != null) {
            this.channel.writeAndFlush(new BinaryWebSocketFrame(createPlayerJoined()));
        }
    }

    public void moved(PlayerMoved event) {
        if (event.angularVelocity() != 0) {
            this.rotation = (this.rotation + (event.angularVelocity() * ANGULAR_VELOCITY_FACTOR_RAD_MS * event.duration())) % _moduloRadian;
        }
        if (event.velocity() != 0) {
            this.x += event.velocity() * VELOCITY_FACTOR_MS * Math.sin(this.rotation) * event.duration();
            this.x = clamp(this.x, 0, 1920);
            this.y -= event.velocity() * VELOCITY_FACTOR_MS * Math.cos(this.rotation) * event.duration();
            this.y = clamp(this.y, 0, 960);
        }

        if (event.firing() && lastFiringTime >= FIRE_RATE_MS) {
            shot(event.time());
        }

        this.lastFiringTime += event.duration();
        this.lastInputSequence = event.sequence();
    }

    private ByteBuf createPlayerJoined() {
        FlatBufferBuilder fbb = new FlatBufferBuilder();
        int idOffset = fbb.createString(id);
        int nameOffset = fbb.createString(name);
        int snapshotOffset = createPlayerSnapshotOffset(fbb);
        int offset = PlayerJoined.createPlayerJoined(fbb, idOffset, (int) new Date().getTime(), nameOffset, snapshotOffset);
        PlayerJoined.finishPlayerJoinedBuffer(fbb, offset);
        return Unpooled.wrappedBuffer(fbb.dataBuffer());
    }

    public int createPlayerSnapshotOffset(FlatBufferBuilder fbb) {
        int idOffset = fbb.createString(id);
        List<Integer> newShotsOffsets = new ArrayList<>();
        newShots.clear();
        int playerShotsVectorOffset = PlayerSnapshot.createShotsVector(fbb, newShotsOffsets.stream().mapToInt(i -> i).toArray());
        return PlayerSnapshot.createPlayerSnapshot(fbb, idOffset, this.lastInputSequence, (float) x, (float) y, (float) rotation, (byte) this.shields, playerShotsVectorOffset);
    }

    public boolean isHitBy(Projectile shot) {
        return shot.getX() > x - _playerWidth / 2 && shot.getX() < x + _playerWidth / 2
                && shot.getY() > y - _playerHeight / 2 && shot.getY() < y + _playerHeight / 2;
    }

    public boolean hit(Projectile shot) {
        shields--;
        return shields == 0;
    }

    public String getId() {
        return id;
    }

    public double getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public double getRotation() {
        return rotation;
    }

    public List<Projectile> getShots() {
        return shots;
    }

    private void shot(long time) {
        float shotX = (float) (this.x + (_playerHeight + 10) * Math.sin(this.rotation));
        float shotY = (float) (this.y - (_playerHeight + 10) * Math.cos(this.rotation));
        System.out.println(nextShotId);
        this.world.playerShot(new Projectile(this, id + String.valueOf(this.nextShotId++), shotX, shotY, this.rotation, time));
        this.lastFiringTime = 0;
    }

    private double clamp(double value, double min, double max) {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        } else {
            return value;
        }
    }
}
