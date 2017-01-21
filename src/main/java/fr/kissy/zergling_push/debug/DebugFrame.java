package fr.kissy.zergling_push.debug;

import fr.kissy.zergling_push.model.Player;
import io.netty.channel.Channel;

import javax.swing.*;
import java.awt.*;
import java.util.Map;


public class DebugFrame extends JFrame {
    private static final int SCALE = 2;
    private Map<Channel, Player> players;

    public DebugFrame(Map<Channel, Player> players) {
        super("Zergling-Push Debug");
        this.players = players;
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setSize(1920 / SCALE, 960 / SCALE);
        setBackground(Color.BLACK);
        setVisible(true);

        add(new DebugPlayer());
    }



    /*public void paint(Graphics g) {
        //super.paint(g);
        for (Player player : players.values()) {
            g.setColor(Color.red);
            g.drawRect(Math.round(player.x() / SCALE), Math.round(player.y() / SCALE), 10, 10);
        }
    }*/
}