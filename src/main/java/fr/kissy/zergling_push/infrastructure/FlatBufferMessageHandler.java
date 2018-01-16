/*
 * Copyright 2012 The Netty Project
 *
 * The Netty Project licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
package fr.kissy.zergling_push.infrastructure;

import Event.*;
import com.google.flatbuffers.FlatBufferBuilder;
import fr.kissy.zergling_push.MainLoop;
import fr.kissy.zergling_push.model.Laser;
import fr.kissy.zergling_push.model.Player;
import fr.kissy.zergling_push.model.PlayerMessage;
import fr.kissy.zergling_push.model.World;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;

import java.nio.ByteBuffer;
import java.util.concurrent.ArrayBlockingQueue;

public class FlatBufferMessageHandler extends SimpleChannelInboundHandler<BinaryWebSocketFrame> {

    private static final int STARTING_X = 1920 / 2;
    private static final int STARTING_Y = 960 / 2;
    private static final int STARTING_ROTATION = 0;

    private World world;
    private ArrayBlockingQueue<PlayerMessage> messagesQueue;

    public FlatBufferMessageHandler(World world, ArrayBlockingQueue<PlayerMessage> messagesQueue) {
        this.world = world;
        this.messagesQueue = messagesQueue;
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        super.channelInactive(ctx);
        world.playerLeaved(ctx.channel());
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, BinaryWebSocketFrame frame) throws Exception {
        ByteBuf content = frame.content();
        ByteBuffer byteBuffer = content.nioBuffer();
        // TODO only make one time sync request ?
        if (TimeSyncRequest.TimeSyncRequestBufferHasIdentifier(byteBuffer)) {
            TimeSyncRequest timeSyncRequest = TimeSyncRequest.getRootAsTimeSyncRequest(byteBuffer);
            ctx.writeAndFlush(createTimeSyncResponse(timeSyncRequest));
        } else if (PlayerMoved.PlayerMovedBufferHasIdentifier(byteBuffer)) {
            world.getPlayer(ctx.channel().id()).moved(content);
        } else if (PlayerJoined.PlayerJoinedBufferHasIdentifier(byteBuffer)) {
            world.playerJoined(ctx.channel(), PlayerJoined.getRootAsPlayerJoined(byteBuffer));
        } else if (PlayerConnect.PlayerConnectBufferHasIdentifier(byteBuffer)) {
            ctx.channel().writeAndFlush(createPlayerConnectedMessage(ctx.channel()));
        } else {
            //messagesQueue.add(new PlayerMessage(ctx.channel(), message));
        }
    }

    private BinaryWebSocketFrame createTimeSyncResponse(TimeSyncRequest timeSyncRequest) {
        FlatBufferBuilder fbb = new FlatBufferBuilder();
        int offset = TimeSyncResponse.createTimeSyncResponse(fbb, timeSyncRequest.time(), MainLoop.serverTime, MainLoop.serverStartTime);
        TimeSyncResponse.finishTimeSyncResponseBuffer(fbb, offset);
        ByteBuf byteBuf = Unpooled.wrappedBuffer(fbb.dataBuffer());
        return new BinaryWebSocketFrame(byteBuf);
    }

    private BinaryWebSocketFrame createPlayerConnectedMessage(Channel channel) {
        FlatBufferBuilder fbb = new FlatBufferBuilder();
        int idOffset = fbb.createString(channel.id().asShortText());
        int nameOffset = fbb.createString(channel.id().asShortText());
        int offset = PlayerConnected.createPlayerConnected(fbb, idOffset, nameOffset, STARTING_X, STARTING_Y, STARTING_ROTATION,
                (float) Player.VELOCITY_FACTOR, (float) Player.ANGULAR_VELOCITY_FACTOR, (float) Player.DECELERATION_FACTOR, Laser.VELOCITY_FACTOR);
        PlayerConnected.finishPlayerConnectedBuffer(fbb, offset);
        ByteBuf byteBuf = Unpooled.wrappedBuffer(fbb.dataBuffer());
        return new BinaryWebSocketFrame(byteBuf);
    }

    private ByteBuf createPlayerLeavedMessage(Channel channel) {
        FlatBufferBuilder fbb = new FlatBufferBuilder();
        int idOffset = fbb.createString(channel.id().asShortText());
        int offset = PlayerLeaved.createPlayerLeaved(fbb, idOffset);
        PlayerLeaved.finishPlayerLeavedBuffer(fbb, offset);
        return Unpooled.wrappedBuffer(fbb.dataBuffer());
    }

}