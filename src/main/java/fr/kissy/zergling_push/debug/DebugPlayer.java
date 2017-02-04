package fr.kissy.zergling_push.debug;

import fr.kissy.zergling_push.model.Player;

import javax.swing.JPanel;
import java.awt.Color;
import java.awt.Graphics;

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
        g.drawRect((int) Math.round(player.getX() / SCALE) - 3, (int) Math.round(player.getY() / SCALE) - 5, 6, 10);

        String text = "x : " + Math.round(player.getX() * 100) / 100.f + " y : " + Math.round(player.getY() * 100) / 100.f;
        g.drawChars(text.toCharArray(), 0, text.length(), 5, 45);
        text = "angle : " + Math.round(player.getRotation() / (2 * Math.PI) * 360 * 10) / 10.f + " rotation : " + Math.round(player.getRotation() * 10) / 10.f;
        g.drawChars(text.toCharArray(), 0, text.length(), 5, 65);
    }
}
