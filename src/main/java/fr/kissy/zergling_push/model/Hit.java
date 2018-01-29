package fr.kissy.zergling_push.model;

import fr.kissy.zergling_push.event.PlayerHit;
import com.google.flatbuffers.FlatBufferBuilder;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;

import java.util.Date;

/**
 * Created by Guillaume on 22/01/2017.
 */
public class Hit {
    private final Player player;
    private final Laser shot;

    public Hit(Player player, Laser shot) {
        this.player = player;
        this.shot = shot;
    }

    public ByteBuf process() {
        shot.hit(player);
        boolean alive = player.hit(shot);
        return createPlayerHit();
    }

    private ByteBuf createPlayerHit() {
        FlatBufferBuilder fbb = new FlatBufferBuilder();
        int idOffset = fbb.createString(player.getId());
        int shotOffset = fbb.createString(shot.toString());
        int offset = PlayerHit.createPlayerHit(fbb, idOffset, new Date().getTime(), shotOffset);
        PlayerHit.finishPlayerHitBuffer(fbb, offset);
        return Unpooled.wrappedBuffer(fbb.dataBuffer());
    }
}
