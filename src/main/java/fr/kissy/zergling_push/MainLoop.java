package fr.kissy.zergling_push;

import Event.PlayerJoined;
import Event.PlayerLeaved;
import Event.PlayerMoved;
import Event.PlayerShot;
import Event.WorldSnapshot;
import com.google.flatbuffers.FlatBufferBuilder;
import fr.kissy.zergling_push.debug.DebugFrame;
import fr.kissy.zergling_push.debug.DebugLaserList;
import fr.kissy.zergling_push.debug.DebugPlayerMap;
import fr.kissy.zergling_push.model.Hit;
import fr.kissy.zergling_push.model.Laser;
import fr.kissy.zergling_push.model.Player;
import fr.kissy.zergling_push.model.PlayerMessage;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import io.netty.util.concurrent.GlobalEventExecutor;

import javax.swing.SwingUtilities;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.stream.Collectors;

/**
 * Created by Guillaume on 19/01/2017.
 */
public class MainLoop implements Runnable {
    public static long serverStartTime = System.currentTimeMillis();
    public static long serverTime = 0;
    private final ArrayBlockingQueue<PlayerMessage> messagesQueue;
    private final ChannelGroup allPlayers;
    private final Map<Channel, Player> players;
    private long lastExecutionTime;
    private double deltaTime;
    private int snapshotCount = 0;


    public MainLoop(ChannelGroup allPlayers, ArrayBlockingQueue<PlayerMessage> messagesQueue) {
        this.allPlayers = allPlayers;
        this.messagesQueue = messagesQueue;
        this.players = new HashMap<>();
        this.lastExecutionTime = System.nanoTime();
    }

    public void run() {
        try {
            long currentTime = System.nanoTime();
            deltaTime = (currentTime - lastExecutionTime) / 1_000_000f;
            lastExecutionTime = currentTime;
            serverTime = System.currentTimeMillis() - serverStartTime;

            messagesQueue.forEach(this::dispatch);

            for (Player player : players.values()) {
                player.update(serverTime, deltaTime);
            }

            if (++snapshotCount % 3 == 0) {
                sendWorldSnapshot();
                snapshotCount = 0;
            }

            detectCollisions();

            while (!messagesQueue.isEmpty()) {
                PlayerMessage playerMessage = messagesQueue.poll();
                playerMessage.release();
            }
        } catch (Exception e) {
            throw new RuntimeException("Error in main loop", e);
        }
    }

    private void sendWorldSnapshot() {
        FlatBufferBuilder fbb = new FlatBufferBuilder();
        List<Integer> playersOffset = new ArrayList<>();
        for (Player player : players.values()) {
            playersOffset.add(player.createPlayerSnapshotOffset(fbb));
        }
        int playersVectorOffset = WorldSnapshot.createPlayersVector(fbb, playersOffset.stream().mapToInt(i -> i).toArray());
        int offset = WorldSnapshot.createWorldSnapshot(fbb, serverTime, playersVectorOffset);
        WorldSnapshot.finishWorldSnapshotBuffer(fbb, offset);
        ByteBuf byteBuf = Unpooled.wrappedBuffer(fbb.dataBuffer());
        allPlayers.writeAndFlush(new BinaryWebSocketFrame(byteBuf));
    }

    private void detectCollisions() {
        List<Hit> hits = players.values().stream()
                .flatMap(player -> player.getShots().stream())
                .flatMap(shot ->
                        players.values().stream()
                                .filter(shot::canHit)
                                .filter(player -> player.isHitBy(shot))
                                .map(player -> new Hit(player, shot))
                                .collect(Collectors.toList()).stream()
                )
                .collect(Collectors.toList());

        for (Hit hit : hits) {
            // TODO call in stream directly
            ByteBuf message = hit.process();
            // TODO send with world snapshot
            allPlayers.write(new BinaryWebSocketFrame(message));
        }
        allPlayers.flush();
    }

    private void dispatch(PlayerMessage playerMessage) {
        Channel player = playerMessage.getPlayer();
        ByteBuffer byteBuffer = playerMessage.getMessage().nioBuffer();
        if (PlayerMoved.PlayerMovedBufferHasIdentifier(byteBuffer)) {
            players.get(player).moved(PlayerMoved.getRootAsPlayerMoved(byteBuffer));
        } else if (PlayerShot.PlayerShotBufferHasIdentifier(byteBuffer)) {
            PlayerShot shot = PlayerShot.getRootAsPlayerShot(byteBuffer);
            players.get(player).shot(shot);
        } else if (PlayerJoined.PlayerJoinedBufferHasIdentifier(byteBuffer)) {
            Player currentPlayer = new Player(PlayerJoined.getRootAsPlayerJoined(byteBuffer), new ArrayList<>());
            players.values().stream().map(Player::createPlayerJoined).map(BinaryWebSocketFrame::new)
                    .forEach(player::write);
            players.put(player, currentPlayer);
            allPlayers.add(player);
            allPlayers.writeAndFlush(new BinaryWebSocketFrame(currentPlayer.createPlayerJoined()));
        } else if (PlayerLeaved.PlayerLeavedBufferHasIdentifier(byteBuffer)) {
            players.remove(player);
            allPlayers.remove(player);
            allPlayers.writeAndFlush(new BinaryWebSocketFrame(playerMessage.getMessage()));
        }
    }

    public double getDeltaTime() {
        return deltaTime;
    }

    public long getServerTime() {
        return serverTime;
    }

}
