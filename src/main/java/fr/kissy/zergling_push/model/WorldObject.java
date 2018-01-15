package fr.kissy.zergling_push.model;

public class WorldObject {
    protected String id;
    protected double x;
    protected double y;
    protected double rotation;

    public WorldObject(String id, double x, double y, double rotation) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }
}
