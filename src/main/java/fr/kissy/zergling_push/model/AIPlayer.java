package fr.kissy.zergling_push.model;

import com.google.flatbuffers.FlatBufferBuilder;
import fr.kissy.zergling_push.MainServer;

public class AIPlayer extends Player {
    public AIPlayer(String id, double x, double y, double rotation, World world, String name) {
        super(id, x, y, rotation, world, name);
    }

    @Override
    public int createPlayerSnapshotOffset(FlatBufferBuilder fbb) {
        this.rotation = (this.rotation + (ANGULAR_VELOCITY_FACTOR_RAD_MS * MainServer.TICK_RATE)) % _moduloRadian;
        this.x += VELOCITY_FACTOR_MS * Math.sin(this.rotation) * MainServer.TICK_RATE;
        this.y -= VELOCITY_FACTOR_MS * Math.cos(this.rotation) * MainServer.TICK_RATE;
        return super.createPlayerSnapshotOffset(fbb);
    }
}
