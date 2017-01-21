package fr.kissy.zergling_push.model;

import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;

/**
 * Created by Guillaume on 19/01/2017.
 */
public class PlayerMessage {
    private final Channel player;
    private final ByteBuf message;

    public PlayerMessage(Channel player, ByteBuf message) {
        this.player = player;
        this.message = message.retain();
    }

    public Channel getPlayer() {
        return player;
    }

    public ByteBuf getMessage() {
        return message;
    }

    public void release() {
        message.release();
    }
}
