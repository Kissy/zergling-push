package fr.kissy.zergling_push.debug;

import fr.kissy.zergling_push.model.Laser;
import fr.kissy.zergling_push.model.Player;
import io.netty.channel.ChannelId;

import javax.swing.JFrame;
import java.awt.Color;
import java.util.HashMap;
import java.util.Map;

public class DebugFrame extends JFrame {
    protected static final int SCALE = 2;
    private Map<ChannelId, DebugPlayer> players = new HashMap<>();
    private Map<Laser, DebugLaser> lasers = new HashMap<>();

    public DebugFrame() {
        super("Zergling-Push Debug");
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setSize(1920 / SCALE, 960 / SCALE);
        setBackground(Color.BLACK);
        setVisible(true);
    }

    public void addPlayer(ChannelId id, Player player) {
        DebugPlayer debugPlayer = new DebugPlayer(player);
        players.put(id, debugPlayer);
        add(debugPlayer);
        validate();
    }

    public void removePlayer(ChannelId id) {
        remove(players.remove(id));
    }

    public void addShot(Laser laser) {
        DebugLaser debugLaser = new DebugLaser(laser);
        lasers.put(laser, debugLaser);
        add(debugLaser);
        validate();
    }

    public void removeShot(Laser laser) {
        remove(lasers.remove(laser));
    }
}