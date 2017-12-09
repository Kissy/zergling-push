package fr.kissy.zergling_push.model;

import Event.PlayerJoined;
import Event.PlayerMoved;
import com.google.flatbuffers.FlatBufferBuilder;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PlayerTest {

    @Test
    void testApplyInput() {
        PlayerJoined event = createPlayerJoined();
        Player player = new Player(event, new ArrayList<>());

        double deltaTime = 50;
        double serverTime = 0;

        player.update(serverTime, deltaTime);
        serverTime += deltaTime;

        player.moved(createPlayerMoved(0L, 1000, 1000, 0, (byte) 1, (byte) 0));

        player.update(serverTime, deltaTime);
        serverTime += deltaTime;

        player.update(serverTime, deltaTime);
        serverTime += deltaTime;

        player.update(serverTime, deltaTime);
        serverTime += deltaTime;

        player.moved(createPlayerMoved(125L, 1000, 875, 0, (byte) 0, (byte) 0));

        player.update(serverTime, deltaTime);
        serverTime += deltaTime;

        player.update(serverTime, deltaTime);
        serverTime += deltaTime;

        player.update(serverTime, deltaTime);
        serverTime += deltaTime;

        assertEquals(player.getY(), 875);
    }

    private PlayerJoined createPlayerJoined() {
        FlatBufferBuilder builder = new FlatBufferBuilder();
        int idOffset = builder.createString("id");
        int nameOffset = builder.createString("name");
        int offset = PlayerJoined.createPlayerJoined(builder, idOffset, 100, nameOffset, 1000, 1000, 0);
        PlayerJoined.finishPlayerJoinedBuffer(builder, offset);
        return PlayerJoined.getRootAsPlayerJoined(builder.dataBuffer());
    }

    private PlayerMoved createPlayerMoved(long time, float x, float y, int rotation, byte velocity, byte angularVelocity) {
        FlatBufferBuilder builder = new FlatBufferBuilder();
        int idOffset = builder.createString("id");
        int offset = PlayerMoved.createPlayerMoved(builder, idOffset, time, 0, velocity, angularVelocity, false);
        PlayerMoved.finishPlayerMovedBuffer(builder, offset);
        return PlayerMoved.getRootAsPlayerMoved(builder.dataBuffer());
    }
}