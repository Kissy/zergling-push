package fr.kissy.zergling_push.debug;

import fr.kissy.zergling_push.model.Player;

import javax.swing.*;
import java.awt.*;
import java.util.Random;

/**
 * Created by Guillaume on 21/01/2017.
 */
public class DebugPlayer extends JPanel {
    private Player player;

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        Graphics2D g2d = (Graphics2D) g;
        g2d.setColor(Color.blue);

        for (int i = 0; i <= 1000; i++) {

            Dimension size = getSize();
            Insets insets = getInsets();

            int w = size.width - insets.left - insets.right;
            int h = size.height - insets.top - insets.bottom;

            Random r = new Random();
            int x = Math.abs(r.nextInt()) % w;
            int y = Math.abs(r.nextInt()) % h;
            g2d.drawLine(x, y, x, y);
        }
    }
}
