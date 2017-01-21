package fr.kissy.zergling_push.debug;

import fr.kissy.zergling_push.model.Player;

import javax.swing.*;
import java.awt.*;

import static fr.kissy.zergling_push.debug.DebugFrame.SCALE;

/**
 * Created by Guillaume on 21/01/2017.
 */
public class DebugPlayer extends JPanel {
    private Player player;

    public DebugPlayer(Player player) {
        this.player = player;
    }

    @Override
    protected void paintComponent(Graphics g) {
        g.setColor(Color.blue);
        g.drawRect(Math.round(player.getX() / SCALE) - 3, Math.round(player.getY() / SCALE) - 5, 6, 10);
    }
}
