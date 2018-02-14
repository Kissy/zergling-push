package fr.kissy.zergling_push.model;

import fr.kissy.zergling_push.event.PlayerJoined;
import fr.kissy.zergling_push.event.WorldSnapshot;
import com.google.flatbuffers.FlatBufferBuilder;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelId;
import io.netty.channel.DefaultChannelId;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import io.netty.util.concurrent.GlobalEventExecutor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class World {
    private final Map<ChannelId, Player> players;
    private final List<Projectile> projectiles;
    private final ChannelGroup allPlayers = new DefaultChannelGroup("AllPlayers", GlobalEventExecutor.INSTANCE);

    public World() {
        this.players = new HashMap<>();
        // Dummy
        this.players.put(DefaultChannelId.newInstance(), new AIPlayer("test", 400, 400, 0, this, "test"));
        this.players.put(DefaultChannelId.newInstance(), new AIPlayer("test-2", 600, 800, 0, this, "test-2"));
        this.players.put(DefaultChannelId.newInstance(), new AIPlayer("test-3", 200, 600, 0, this, "test-3"));
        this.projectiles = new ArrayList<>();
    }

    public void update(double deltaTime) {
        projectiles.parallelStream().forEach(l -> {
            l.update(deltaTime);
            l.detectHit(players.values());
        });
        projectiles.removeIf(Projectile::expired);
    }

    public void playerJoined(Channel channel, PlayerJoined playerJoined) {
        players.put(channel.id(), new Player(this, channel, playerJoined, new ArrayList<>()));
        allPlayers.add(channel);
    }

    public void playerLeaved(Channel channel) {
        players.remove(channel.id());
        allPlayers.remove(channel);
    }

    public void playerShot(Projectile projectile) {
        projectiles.add(projectile);
    }

    public Player getPlayer(ChannelId id) {
        return players.get(id);
    }

    public void sendWorldSnapshot(long serverTime) {
        FlatBufferBuilder fbb = new FlatBufferBuilder();
        List<Integer> playersOffsets = new ArrayList<>();
        for (Player player : players.values()) {
            playersOffsets.add(player.createPlayerSnapshotOffset(fbb));
        }
        List<Integer> projectilesOffsets = new ArrayList<>();
        for (Projectile projectile : projectiles) {
            projectilesOffsets.add(projectile.createPlayerShotSnapshotOffset(fbb));
        }
        int playersVectorOffset = WorldSnapshot.createPlayersVector(fbb, playersOffsets.stream().mapToInt(i -> i).toArray());
        int projectilesVectorOffset = WorldSnapshot.createProjectilesVector(fbb, projectilesOffsets.stream().mapToInt(i -> i).toArray());
        int offset = WorldSnapshot.createWorldSnapshot(fbb, serverTime, playersVectorOffset, projectilesVectorOffset);
        WorldSnapshot.finishWorldSnapshotBuffer(fbb, offset);
        ByteBuf byteBuf = Unpooled.wrappedBuffer(fbb.dataBuffer());
        allPlayers.writeAndFlush(new BinaryWebSocketFrame(byteBuf));
    }
}
