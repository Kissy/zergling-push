package fr.kissy.zergling_push.debug;

import fr.kissy.zergling_push.MainLoop;

import javax.swing.JLabel;
import javax.swing.JPanel;
import java.awt.Color;
import java.awt.Graphics;

import static fr.kissy.zergling_push.debug.DebugFrame.SCALE;

/**
 * Created by Guillaume on 21/01/2017.
 */
public class DebugDeltaTime extends JPanel {
    private MainLoop mainLoop;

    public DebugDeltaTime(MainLoop mainLoop) {
        this.mainLoop = mainLoop;
    }

    @Override
    protected void paintComponent(Graphics g) {
        String text = "DeltaTime : " + mainLoop.getDeltaTime();
        g.setColor(Color.RED);
        g.drawChars(text.toCharArray(), 0, text.length(), 5, 15);
        text = "ServerTime : " + mainLoop.getServerTime();
        g.drawChars(text.toCharArray(), 0, text.length(), 5, 30);
    }
}
