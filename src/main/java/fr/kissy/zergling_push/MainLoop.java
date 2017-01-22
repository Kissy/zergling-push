package fr.kissy.zergling_push;

import Event.PlayerJoined;
import Event.PlayerLeaved;
import Event.PlayerMoved;
import Event.PlayerShot;
import fr.kissy.zergling_push.debug.DebugFrame;
import fr.kissy.zergling_push.debug.DebugLaserList;
import fr.kissy.zergling_push.debug.DebugPlayerMap;
import fr.kissy.zergling_push.model.Laser;
import fr.kissy.zergling_push.model.Player;
import fr.kissy.zergling_push.model.PlayerMessage;
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

/**
 * Created by Guillaume on 19/01/2017.
 */
public class MainLoop implements Runnable {
    private static final boolean DEBUG_ENABLED = true;
    private long lastExecutionTime = System.nanoTime();
    private final ArrayBlockingQueue<PlayerMessage> messagesQueue;
    private final ChannelGroup allPlayers;
    private final DebugFrame debugFrame;
    private final Map<Channel, Player> players;

    public MainLoop(ArrayBlockingQueue<PlayerMessage> messagesQueue) {
        this.messagesQueue = messagesQueue;
        this.allPlayers = new DefaultChannelGroup("AllPlayers", GlobalEventExecutor.INSTANCE);
        this.debugFrame = DEBUG_ENABLED ? new DebugFrame() : null;
        this.players  = DEBUG_ENABLED ? new DebugPlayerMap(this.debugFrame) : new HashMap<>();
    }

    public void run() {
        try {
            long currentTime = System.nanoTime();
            long deltaTime = (currentTime - lastExecutionTime) / 1000000;
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

            if (DEBUG_ENABLED) {
                SwingUtilities.invokeLater(debugFrame::repaint);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void dispatchToPlayer(PlayerMessage playerMessage) {
        ByteBuffer byteBuffer = playerMessage.getMessage().nioBuffer();
        if (PlayerMoved.PlayerMovedBufferHasIdentifier(byteBuffer)) {
            players.get(playerMessage.getPlayer()).moved(PlayerMoved.getRootAsPlayerMoved(byteBuffer));
        } else if (PlayerShot.PlayerShotBufferHasIdentifier(byteBuffer)) {
            PlayerShot shot = PlayerShot.getRootAsPlayerShot(byteBuffer);
            players.get(playerMessage.getPlayer()).shot(shot);
        } else if (PlayerJoined.PlayerJoinedBufferHasIdentifier(byteBuffer)) {
            Player currentPlayer = new Player(PlayerJoined.getRootAsPlayerJoined(byteBuffer), createNewLaserList());
            players.values().stream().map(Player::createPlayerJoined).map(BinaryWebSocketFrame::new)
                    .forEach(playerMessage.getPlayer()::write);
            players.put(playerMessage.getPlayer(), currentPlayer);
            allPlayers.add(playerMessage.getPlayer());
        } else if (PlayerLeaved.PlayerLeavedBufferHasIdentifier(byteBuffer)) {
            players.remove(playerMessage.getPlayer());
            allPlayers.remove(playerMessage.getPlayer());
        }
    }

    private List<Laser> createNewLaserList() {
        if (DEBUG_ENABLED) {
            return new DebugLaserList(this.debugFrame);
        }
        return new ArrayList<>();
    }
}
