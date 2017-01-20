package fr.kissy.zergling_push;

import Event.PlayerMoved;
import io.netty.buffer.ByteBuf;

import java.nio.ByteBuffer;

/**
 * Created by Guillaume on 19/01/2017.
 */
public class Player {
    private static final double _playerVelocityFactor = 0.8;
    private static final double _playerAngularVelocityFactor = 0.006;
    private static final double _playerDecelerationFactor = 0.05;
    private static final double _moduloRadian = 2 * Math.PI;

    private float x;
    private float y;
    private double rotation;
    private byte velocity;
    private byte angularVelocity;
    private double residualVelocity;

    public Player() {
        this.x = 100;
        this.y = 100;
    }

    public void processMessage(ByteBuf message) {
        ByteBuffer byteBuffer = message.nioBuffer();
        if (PlayerMoved.PlayerMovedBufferHasIdentifier(byteBuffer)) {
            PlayerMoved event = PlayerMoved.getRootAsPlayerMoved(byteBuffer);
            this.x = event.y();
            this.y = event.y();
            this.rotation = event.rotation();
            this.velocity = event.velocity();
            this.angularVelocity = event.angularVelocity();
        }
    }

    public void update(long deltaTime) {
        this.residualVelocity = Math.max(this.residualVelocity - _playerDecelerationFactor, 0);

        double currentVelocity = (this.velocity + this.residualVelocity) * _playerVelocityFactor * deltaTime;
        this.x = clamp((float) (this.x + currentVelocity * Math.sin(this.rotation)), 0, 1920);
        this.y = clamp((float) (this.y - currentVelocity * Math.cos(this.rotation)), 0, 960);
        this.rotation = (this.rotation + this.angularVelocity * _playerAngularVelocityFactor * deltaTime) % _moduloRadian;
    }

    private float clamp(float value, float min, float max) {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        } else {
            return value;
        }
    }

    public float x() {
        return x;
    }

    public float y() {
        return y;
    }
}
