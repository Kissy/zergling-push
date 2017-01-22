package fr.kissy.zergling_push.debug;

import fr.kissy.zergling_push.model.Player;
import io.netty.channel.Channel;

import java.util.HashMap;

/**
 * Created by Guillaume on 22/01/2017.
 */
public class DebugPlayerMap extends HashMap<Channel, Player> {
    private DebugFrame debugFrame;

    public DebugPlayerMap(DebugFrame debugFrame) {
        this.debugFrame = debugFrame;
    }

    @Override
    public Player put(Channel key, Player value) {
        debugFrame.addPlayer(key.id(), value);
        return super.put(key, value);
    }

    @Override
    public Player remove(Object key) {
        debugFrame.removePlayer(((Channel) key).id());
        return super.remove(key);
    }
}
