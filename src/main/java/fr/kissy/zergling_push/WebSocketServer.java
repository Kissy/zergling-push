/*
 * Copyright 2012 The Netty Project
 *
 * The Netty Project licenses this file to you under the Apache License, version
 * 2.0 (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
package fr.kissy.zergling_push;

import fr.kissy.zergling_push.debug.DebugFrame;
import fr.kissy.zergling_push.infrastructure.BinaryWebSocketFrameHandler;
import fr.kissy.zergling_push.infrastructure.HttpStaticFileServerHandler;
import fr.kissy.zergling_push.model.Player;
import fr.kissy.zergling_push.model.PlayerMessage;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;
import io.netty.util.concurrent.GlobalEventExecutor;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * A WebSocket Server that respondes to requests at:
 * <p>
 * <pre>
 * http://localhost:8080/websocket
 * </pre>
 * <p>
 * The example differs from many of the other examples in Netty in that is does
 * not have an acomponying client. Instead a html page is provided that
 * interacts with this server. <br>
 * Open up the following file a web browser that supports WebSocket's:
 * <p>
 * <pre>
 * example/src/main/resources/websocketx/html5/websocket.html
 * </pre>
 * <p>
 * The html page is very simple were you simply enter some text and the server
 * will echo the same text back, but in uppercase. You, also see getStatus messages
 * in the "Response From Server" area when client has connected, disconnected
 * etc.
 */
public class WebSocketServer {

    public static final long TICK_RATE = 1000L / 60L;

    public static void main(String[] args) throws Exception {
        new WebSocketServer().run();
    }

    private void run() throws Exception {
        final ArrayBlockingQueue<PlayerMessage> messagesQueue = new ArrayBlockingQueue<PlayerMessage>(1024);

        final MainLoop mainLoop = new MainLoop(messagesQueue);
        ScheduledThreadPoolExecutor mainLoopExecutor = new ScheduledThreadPoolExecutor(1);
        mainLoopExecutor.scheduleAtFixedRate(mainLoop, 0, TICK_RATE, TimeUnit.MILLISECONDS);

        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            final ServerBootstrap sb = new ServerBootstrap();
            sb.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(final SocketChannel ch) throws Exception {
                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline.addLast("decoder", new HttpServerCodec());
                            pipeline.addLast("aggregator", new HttpObjectAggregator(65536));
                            pipeline.addLast("encoder", new WebSocketServerProtocolHandler("/websocket", null, true));
                            pipeline.addLast("webSocket", new BinaryWebSocketFrameHandler(messagesQueue));
                            pipeline.addLast("http", new HttpStaticFileServerHandler());
                        }
                    });
            final Channel ch = sb.bind(8080).sync().channel();
            ch.closeFuture().sync();
        } catch (Exception e) {
            throw new RuntimeException("Error while running server", e);
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }

}