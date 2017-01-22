package fr.kissy.zergling_push.debug;

import fr.kissy.zergling_push.model.Laser;

import java.util.ArrayList;
import java.util.BitSet;
import java.util.function.Predicate;

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

    @Override
    public boolean removeIf(Predicate<? super Laser> filter) {
        forEach(s -> {
            if (filter.test(s)) {
                debugFrame.removeShot(s);
            }
        });
        return super.removeIf(filter);
    }
}
