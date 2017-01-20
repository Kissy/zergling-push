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
package fr.kissy.zergling_push;

import Event.PlayerConnected;
import Event.PlayerJoined;
import Event.PlayerLeaved;
import com.google.flatbuffers.FlatBufferBuilder;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.group.ChannelGroup;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;

import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;

public class BinaryWebSocketFrameHandler extends SimpleChannelInboundHandler<BinaryWebSocketFrame> {

    public static final float VELOCITY_FACTOR = 0.8f;
    public static final float ANGULAR_VELOCITY_FACTOR = 0.006f;
    public static final float DECELERATION_FACTOR = 0.05f;
    private ChannelGroup allPlayers;
    private Map<Channel, Player> players;
    private ArrayBlockingQueue<PlayerMessage> messagesQueue;

    public BinaryWebSocketFrameHandler(ChannelGroup allPlayers, Map<Channel, Player> players, ArrayBlockingQueue<PlayerMessage> messagesQueue) {
        this.allPlayers = allPlayers;
        this.players = players;
        this.messagesQueue = messagesQueue;
    }

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        super.userEventTriggered(ctx, evt);
        if (evt instanceof WebSocketServerProtocolHandler.HandshakeComplete) {
            Player currentPlayer = players.get(ctx.channel());
            allPlayers.writeAndFlush(createPlayerJoinedMessage(ctx.channel(), currentPlayer));
            allPlayers.add(ctx.channel());
            for (Map.Entry<Channel, Player> entry : players.entrySet()) {
                if (entry.getKey().equals(ctx.channel())) {
                    ctx.channel().write(createPlayerConnectedMessage(ctx.channel(), currentPlayer));
                } else {
                    ctx.channel().write(createPlayerJoinedMessage(entry.getKey(), entry.getValue()));
                }
            }
        }
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        super.channelActive(ctx);
        players.put(ctx.channel(), new Player());
        System.out.println("Played joined "  + ctx.channel().id().asShortText());
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        super.channelInactive(ctx);
        players.remove(ctx.channel());
        allPlayers.remove(ctx.channel());
        allPlayers.writeAndFlush(createPlayerLeavedMessage(ctx.channel()));
        System.out.println("Played leaved " + ctx.channel().id().asShortText());
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, BinaryWebSocketFrame frame) throws Exception {
        ByteBuf message = frame.content();
        messagesQueue.add(new PlayerMessage(ctx.channel(), message));
        System.out.println("Message received from " + ctx.channel().id().asShortText());
    }

    private BinaryWebSocketFrame createPlayerConnectedMessage(Channel channel, Player player) {
        FlatBufferBuilder fbb = new FlatBufferBuilder();
        int idOffset = fbb.createString(channel.id().asShortText());
        int nameOffset = fbb.createString("Name");
        int offset = PlayerConnected.createPlayerConnected(fbb, idOffset, nameOffset, player.y(), player.y(),
                VELOCITY_FACTOR, ANGULAR_VELOCITY_FACTOR, DECELERATION_FACTOR);
        PlayerConnected.finishPlayerConnectedBuffer(fbb, offset);
        ByteBuf byteBuf = Unpooled.wrappedBuffer(fbb.dataBuffer());
        return new BinaryWebSocketFrame(byteBuf);
    }

    private BinaryWebSocketFrame createPlayerJoinedMessage(Channel channel, Player player) {
        FlatBufferBuilder fbb = new FlatBufferBuilder();
        int idOffset = fbb.createString(channel.id().asShortText());
        int nameOffset = fbb.createString("Name");
        int offset = PlayerJoined.createPlayerJoined(fbb, idOffset, nameOffset, player.x(), player.y());
        PlayerJoined.finishPlayerJoinedBuffer(fbb, offset);
        ByteBuf byteBuf = Unpooled.wrappedBuffer(fbb.dataBuffer());
        return new BinaryWebSocketFrame(byteBuf);
    }

    private BinaryWebSocketFrame createPlayerLeavedMessage(Channel channel) {
        FlatBufferBuilder fbb = new FlatBufferBuilder();
        int idOffset = fbb.createString(channel.id().asShortText());
        int offset = PlayerLeaved.createPlayerLeaved(fbb, idOffset);
        PlayerLeaved.finishPlayerLeavedBuffer(fbb, offset);
        ByteBuf byteBuf = Unpooled.wrappedBuffer(fbb.dataBuffer());
        return new BinaryWebSocketFrame(byteBuf);
    }
}