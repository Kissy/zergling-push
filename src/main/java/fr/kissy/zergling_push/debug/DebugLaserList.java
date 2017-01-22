package fr.kissy.zergling_push.debug;

import fr.kissy.zergling_push.model.Laser;
import fr.kissy.zergling_push.model.Player;
import io.netty.channel.Channel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by Guillaume on 22/01/2017.
 */
public class DebugLaserList extends ArrayList<Laser> {
    private DebugFrame debugFrame;

    public DebugLaserList(DebugFrame debugFrame) {
        this.debugFrame = debugFrame;
    }

    @Override
    public boolean add(Laser value) {
        debugFrame.addShot(value);
        return super.add(value);
    }

    @Override
    public boolean remove(Object key) {
        debugFrame.removeShot((Laser) key);
        return super.remove(key);
    }
}
