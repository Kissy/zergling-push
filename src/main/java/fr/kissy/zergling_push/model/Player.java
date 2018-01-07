package fr.kissy.zergling_push.model;

import Event.PlayerJoined;
import Event.PlayerMoved;
import Event.PlayerShot;
import Event.PlayerSnapshot;
import com.google.flatbuffers.FlatBufferBuilder;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.LinkedBlockingDeque;

/**
 * Created by Guillaume on 19/01/2017.
 */
public class Player {
    public static final double VELOCITY_FACTOR = 500f; // pixel par seconds
    public static final double VELOCITY_FACTOR_MS = VELOCITY_FACTOR / 1000f; // pixel par milliseconds
    public static final double ANGULAR_VELOCITY_FACTOR = 180f; // degres par seconds
    public static final double ANGULAR_VELOCITY_FACTOR_RAD_MS = ANGULAR_VELOCITY_FACTOR * 2f * Math.PI / 360f / 1000f; // radian par milliseconds
    public static final double DECELERATION_FACTOR = 5010f;
    public static final double FIRE_RATE_MS = 150f;
    public static final int MIN_X_Y_VALUE = 0;
    public static final int MAX_X_VALUE = 1920;
    public static final int MAX_Y_VALUE = 1960;
    private static final int _playerWidth = 32;
    private static final int _playerHeight = 38;
    private static final double _moduloRadian = 2 * Math.PI;

    private Channel channel;
    private String id;
    private String name;
    private double x;
    private double y;
    private double rotation;
    private List<Laser> shots;
    private List<Laser> newShots;
    private int shields = 3;
    private long lastInputSequence = 0;
    private double lastFiringTime = 0;
    // TODO Release on delete player
    private Queue<ByteBuf> playerMovedEvents;

    public Player(Channel channel, PlayerJoined event, List<Laser> shots) {
        this.channel = channel;
        this.id = event.id();
        this.name = event.name();
        this.x = 500; // TODO
        this.y = 400;
        this.rotation = event.snapshot().rotation();
        this.shots = shots;
        this.newShots = new ArrayList<>();
        this.playerMovedEvents = new LinkedBlockingDeque<>();
        this.channel.writeAndFlush(new BinaryWebSocketFrame(createPlayerJoined()));
    }

    public void moved(ByteBuf event) {
        event.retain();
        playerMovedEvents.add(event);
    }

    public boolean update(double deltaTime) {
        this.shots.forEach(shot -> shot.update(deltaTime));
        this.shots.removeIf(Laser::expired);

        while (!playerMovedEvents.isEmpty()) {
            // TODO handle input sequence

            ByteBuf content = playerMovedEvents.poll();
            PlayerMoved event = PlayerMoved.getRootAsPlayerMoved(content.nioBuffer());
            this.lastFiringTime += event.duration();
            this.lastInputSequence = event.sequence();

            if (event.angularVelocity() != 0) {
                this.rotation = (this.rotation + (event.angularVelocity() * ANGULAR_VELOCITY_FACTOR_RAD_MS * event.duration())) % _moduloRadian;
            }
            if (event.velocity() != 0) {
                this.x += event.velocity() * VELOCITY_FACTOR_MS * Math.sin(this.rotation) * event.duration();
                this.x = clamp(this.x, 0, 1920);
                this.y -= event.velocity() * VELOCITY_FACTOR_MS * Math.cos(this.rotation) * event.duration();
                this.y = clamp(this.y, 0, 960);
            }
            content.release();

            if (event.firing() && lastFiringTime > FIRE_RATE_MS) {
                System.out.println("shot");
                shot();
            }

        }

        return false;
    }

    public ByteBuf createPlayerJoined() {
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
        for (Laser laser : newShots) {
            newShotsOffsets.add(laser.createPlayerShotSnapshotOffset(fbb));
        }
        newShots.clear();
        int playerShotsVectorOffset = PlayerSnapshot.createShotsVector(fbb, newShotsOffsets.stream().mapToInt(i -> i).toArray());
        return PlayerSnapshot.createPlayerSnapshot(fbb, idOffset, this.lastInputSequence, (float) x, (float) y, (float) rotation, playerShotsVectorOffset);
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

    private void shot() {
        float shotX = (float) (this.x + _playerWidth * Math.sin(this.rotation));
        float shotY = (float) (this.y - _playerHeight * Math.cos(this.rotation));
        Laser laser = new Laser(this, String.valueOf(lastInputSequence), shotX, shotY, this.rotation);
        this.shots.add(laser);
        this.newShots.add(laser); // TODO create shot snapshot
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
