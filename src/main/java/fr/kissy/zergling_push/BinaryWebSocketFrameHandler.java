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

import Event.PlayerAccelerated;
import Event.PlayerConnected;
import com.google.flatbuffers.FlatBufferBuilder;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import io.netty.util.concurrent.GlobalEventExecutor;

import java.nio.ByteBuffer;

public class BinaryWebSocketFrameHandler extends SimpleChannelInboundHandler<BinaryWebSocketFrame> {

    private static final ChannelGroup CHANNELS = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        super.channelActive(ctx);
        FlatBufferBuilder fbb = new FlatBufferBuilder();
        int offset = PlayerConnected.createPlayerConnected(fbb, 1, 100, 100);
        PlayerConnected.finishPlayerConnectedBuffer(fbb, offset);
        ByteBuf byteBuf = Unpooled.wrappedBuffer(fbb.dataBuffer());
        BinaryWebSocketFrame frame = new BinaryWebSocketFrame(byteBuf);
        for (Channel channel : CHANNELS) {
            channel.writeAndFlush(frame);
        }
        CHANNELS.add(ctx.channel());
        // Iterate through players and spawn it
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        super.channelInactive(ctx);
        CHANNELS.remove(ctx.channel());
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, BinaryWebSocketFrame frame) throws Exception {
        ByteBuffer request = frame.content().nioBuffer();
        ByteBuf byteBuf = Unpooled.wrappedBuffer(request);
        BinaryWebSocketFrame responseFrame = new BinaryWebSocketFrame(byteBuf);
        for (Channel channel : CHANNELS) {
            if (ctx.channel().equals(channel)) {
                continue;
            }
            channel.writeAndFlush(responseFrame);
        }
    }
}