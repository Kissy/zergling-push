package fr.kissy.zergling_push;

import Event.PlayerJoined;
import Event.PlayerLeaved;
import Event.PlayerMoved;
import Event.PlayerShot;
import fr.kissy.zergling_push.debug.DebugFrame;
import fr.kissy.zergling_push.model.Player;
import fr.kissy.zergling_push.model.PlayerMessage;
import io.netty.channel.Channel;
import io.netty.channel.group.ChannelGroup;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;

import java.nio.ByteBuffer;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;

/**
 * Created by Guillaume on 19/01/2017.
 */
public class MainLoop implements Runnable {
    private long lastExecutionTime = System.nanoTime();
    private ChannelGroup allPlayers;
    private Map<Channel, Player> players;
    private ArrayBlockingQueue<PlayerMessage> messagesQueue;
    private DebugFrame debugFrame;

    public MainLoop(ChannelGroup allPlayers, Map<Channel, Player> players, ArrayBlockingQueue<PlayerMessage> messagesQueue, DebugFrame debugFrame) {
        this.allPlayers = allPlayers;
        this.players = players;
        this.messagesQueue = messagesQueue;
        this.debugFrame = debugFrame;
    }

    public void run() {
        try {
            long currentTime = System.nanoTime();
            long deltaTime = currentTime - lastExecutionTime;
            lastExecutionTime = currentTime;

            while (!messagesQueue.isEmpty()) {
                PlayerMessage playerMessage = messagesQueue.poll();
                dispatchToPlayer(playerMessage);
                allPlayers.write(new BinaryWebSocketFrame(playerMessage.getMessage()));
            }
            allPlayers.flush();

            for (Player player : players.values()) {
                player.update(deltaTime);
            }

            debugFrame.repaint();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void dispatchToPlayer(PlayerMessage playerMessage) {
        ByteBuffer byteBuffer = playerMessage.getMessage().nioBuffer();
        if (PlayerMoved.PlayerMovedBufferHasIdentifier(byteBuffer)) {
            players.get(playerMessage.getPlayer()).moved(PlayerMoved.getRootAsPlayerMoved(byteBuffer));
        } else if (PlayerShot.PlayerShotBufferHasIdentifier(byteBuffer)) {
            players.get(playerMessage.getPlayer()).shot(PlayerShot.getRootAsPlayerShot(byteBuffer));
        } else if (PlayerJoined.PlayerJoinedBufferHasIdentifier(byteBuffer)) {
            Player currentPlayer = new Player(PlayerJoined.getRootAsPlayerJoined(byteBuffer));
            players.values().stream().map(Player::createPlayerJoined).map(BinaryWebSocketFrame::new)
                    .forEach(playerMessage.getPlayer()::write);
            players.put(playerMessage.getPlayer(), currentPlayer);
            allPlayers.add(playerMessage.getPlayer());
        } else if (PlayerLeaved.PlayerLeavedBufferHasIdentifier(byteBuffer)) {
            players.remove(playerMessage.getPlayer());
            allPlayers.remove(playerMessage.getPlayer());
        }
    }
}
