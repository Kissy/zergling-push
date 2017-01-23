package fr.kissy.zergling_push.debug;

import fr.kissy.zergling_push.MainLoop;
import fr.kissy.zergling_push.model.Laser;
import fr.kissy.zergling_push.model.Player;
import io.netty.channel.ChannelId;

import javax.swing.JFrame;
import javax.swing.JLabel;
import java.awt.Color;
import java.util.HashMap;
import java.util.Map;

public class DebugFrame extends JFrame {
    protected static final int SCALE = 2;
    private Map<ChannelId, DebugPlayer> players = new HashMap<>();
    private Map<Laser, DebugLaser> lasers = new HashMap<>();

    public DebugFrame(MainLoop mainLoop) {
        super("Zergling-Push Debug");
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setSize(1920 / SCALE, 960 / SCALE);
        setBackground(Color.BLACK);
        setVisible(true);

        getContentPane().add(new DebugDeltaTime(mainLoop));
    }

    public void addPlayer(ChannelId id, Player player) {
        DebugPlayer debugPlayer = new DebugPlayer(player);
        players.put(id, debugPlayer);
        getContentPane().add(debugPlayer);
        validate();
    }

    public void removePlayer(ChannelId id) {
        DebugPlayer debugPlayer = players.remove(id);
        if (debugPlayer != null) {
            remove(debugPlayer);
        }
    }

    public void addShot(Laser laser) {
        DebugLaser debugLaser = new DebugLaser(laser);
        lasers.put(laser, debugLaser);
        getContentPane().add(debugLaser);
        validate();
    }

    public void removeShot(Laser laser) {
        remove(lasers.remove(laser));
    }
}