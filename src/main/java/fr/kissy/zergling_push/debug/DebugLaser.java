package fr.kissy.zergling_push.debug;

import fr.kissy.zergling_push.model.Laser;

import javax.swing.JPanel;
import java.awt.Color;
import java.awt.Graphics;

import static fr.kissy.zergling_push.debug.DebugFrame.SCALE;

/**
 * Created by Guillaume on 21/01/2017.
 */
public class DebugLaser extends JPanel {
    private Laser laser;

    public DebugLaser(Laser laser) {
        this.laser = laser;
    }

    @Override
    protected void paintComponent(Graphics g) {
        g.setColor(Color.CYAN);
        g.drawRect((int) Math.round(laser.getX() / SCALE) - 3, (int) Math.round(laser.getY() / SCALE) - 5, 6, 10);
    }
}
