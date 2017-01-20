package fr.kissy.zergling_push;

import io.netty.channel.Channel;
import io.netty.channel.group.ChannelGroup;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;

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

    public MainLoop(ChannelGroup allPlayers, Map<Channel, Player> players, ArrayBlockingQueue<PlayerMessage> messagesQueue) {
        this.allPlayers = allPlayers;
        this.players = players;
        this.messagesQueue = messagesQueue;
    }

    public void run() {
        try {
            long currentTime = System.nanoTime();
            long deltaTime = currentTime - lastExecutionTime;
            lastExecutionTime = currentTime;

            while (!messagesQueue.isEmpty()) {
                PlayerMessage playerMessage = messagesQueue.poll();
                players.get(playerMessage.getPlayer()).processMessage(playerMessage.getMessage());
                allPlayers.write(new BinaryWebSocketFrame(playerMessage.getMessage()));
//                playerMessage.release();
            }
            allPlayers.flush();

            for (Player player : players.values()) {
                player.update(deltaTime);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
