package fr.kissy.zergling_push.model;

import Event.PlayerJoined;
import Event.PlayerMoved;
import Event.PlayerShot;
import Event.PlayerSnapshot;
import com.google.flatbuffers.FlatBufferBuilder;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;

import java.util.ArrayDeque;
import java.util.Date;
import java.util.List;
import java.util.Queue;

/**
 * Created by Guillaume on 19/01/2017.
 */
public class Player {
    public static final double VELOCITY_FACTOR = 500f; // pixel par seconds
    public static final double VELOCITY_FACTOR_MS = VELOCITY_FACTOR / 1000f; // pixel par seconds
    public static final double ANGULAR_VELOCITY_FACTOR = 180f; // degres par seconds
    public static final double ANGULAR_VELOCITY_FACTOR_RAD_MS = ANGULAR_VELOCITY_FACTOR * 2f * Math.PI / 360f / 1000f; // radian par seconds
    public static final double DECELERATION_FACTOR = 5010f;
    public static final int MIN_X_Y_VALUE = 0;
    public static final int MAX_X_VALUE = 1920;
    public static final int MAX_Y_VALUE = 1960;
    private static final int _playerWidth = 32;
    private static final int _playerHeight = 38;
    private static final double _moduloRadian = 2 * Math.PI;

    private String id;
    private String name;
    private double x;
    private double y;
    private double rotation;
    private double forwardVelocity;
    private double angularVelocity;
    private double residualVelocity;
    private double xVelocity;
    private double yVelocity;
    private double previousTime = 0;
    private List<Laser> shots;
    private int shields = 3;
    private long lastInputSequence = 0;
    private Queue<PlayerMoved> playerMovedEvents;

    public Player(PlayerJoined event, List<Laser> shots) {
        this.id = event.id();
        this.name = event.name();
        this.x = event.x();
        this.y = event.y();
        this.shots = shots;
        this.playerMovedEvents = new ArrayDeque<>();
    }

    public void moved(PlayerMoved event) {
        playerMovedEvents.add(event);
    }

    public void shot(PlayerShot event) {
        // Check validity ?
        this.shots.add(new Laser(this, event.x(), event.y(), event.rotation()));
    }

    public boolean update(double serverTime, double deltaTime) {
        double remainingDeltaTime = deltaTime;
        ByteBuf createdEvent = null;

        boolean playerMoved = !playerMovedEvents.isEmpty();

        while (!playerMovedEvents.isEmpty()) {
            PlayerMoved event = playerMovedEvents.poll();

//            if (this.forwardVelocity != event.velocity()) {
//                this.residualVelocity = 1 - event.velocity();
//            }

//            this.forwardVelocity = event.velocity();
//            this.angularVelocity = event.angularVelocity();

//            createdEvent = createPlayerMoved(Math.round(serverTime + beforeInputDeltaTime));

//            this.rotation = (this.rotation + (this.angularVelocity * ANGULAR_VELOCITY_FACTOR_RAD_MS * deltaTime)) % _moduloRadian;
//
//            double currentVelocity = (this.forwardVelocity + this.residualVelocity) * VELOCITY_FACTOR_MS;
//            this.xVelocity = currentVelocity * Math.sin(this.rotation);
//            this.yVelocity = currentVelocity * Math.cos(this.rotation);
//
//            this.x = clamp(this.x + this.xVelocity * deltaTime, MIN_X_Y_VALUE, MAX_X_VALUE);
//            this.y = clamp(this.y - this.yVelocity * deltaTime, MIN_X_Y_VALUE, MAX_Y_VALUE);
            this.rotation = (this.rotation + (event.angularVelocity() * ANGULAR_VELOCITY_FACTOR_RAD_MS * deltaTime)) % _moduloRadian;
            this.x += event.velocity() * VELOCITY_FACTOR_MS * Math.sin(this.rotation) * deltaTime;
            this.y -= event.velocity() * VELOCITY_FACTOR_MS * Math.cos(this.rotation) * deltaTime;

            this.lastInputSequence = event.sequence();
        }

        // Detect collision
        if (playerMoved) {
            this.x = clamp(this.x, 0, 1920);
            this.y = clamp(this.y, 0, 960);
        }

        /*
        this.shots.forEach(shot -> shot.update(deltaTime));
        this.shots.removeIf(Laser::expired);
        */

        return false;
    }

    public ByteBuf createPlayerJoined() {
        FlatBufferBuilder fbb = new FlatBufferBuilder();
        int idOffset = fbb.createString(id);
        int nameOffset = fbb.createString(name);
        int offset = PlayerJoined.createPlayerJoined(fbb, idOffset, (int) new Date().getTime(), nameOffset, (float) x, (float) y, (float) rotation);
        PlayerJoined.finishPlayerJoinedBuffer(fbb, offset);
        return Unpooled.wrappedBuffer(fbb.dataBuffer());
    }

    public ByteBuf createPlayerMoved(long time) {
        FlatBufferBuilder fbb = new FlatBufferBuilder();
        int idOffset = fbb.createString(id);
        int offset = PlayerMoved.createPlayerMoved(fbb, idOffset, time,0, (float) x, (float) y, (float) rotation,
                (byte) Math.signum(forwardVelocity), (byte) Math.signum(angularVelocity));
        PlayerMoved.finishPlayerMovedBuffer(fbb, offset);
        return Unpooled.wrappedBuffer(fbb.dataBuffer());
    }

    public int createPlayerSnapshotOffset(FlatBufferBuilder fbb) {
        int idOffset = fbb.createString(id);
        return PlayerSnapshot.createPlayerSnapshot(fbb, idOffset, (long) this.lastInputSequence, (float) x, (float) y, (float) rotation);
    }

    public boolean isHitBy(Laser shot) {
        return shot.getX() > x - _playerWidth / 2 && shot.getX() < x + _playerWidth / 2
                && shot.getY() > y - _playerHeight / 2 && shot.getY() < y + _playerHeight / 2;
    }

    public boolean hit(Laser shot) {
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

    public List<Laser> getShots() {
        return shots;
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
