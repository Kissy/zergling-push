// automatically generated by the FlatBuffers compiler, do not modify

package fr.kissy.zergling_push.event;

import com.google.flatbuffers.FlatBufferBuilder;
import com.google.flatbuffers.Table;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;

@SuppressWarnings("unused")
public final class PlayerConnected extends Table {
  public static PlayerConnected getRootAsPlayerConnected(ByteBuffer _bb) { return getRootAsPlayerConnected(_bb, new PlayerConnected()); }
  public static PlayerConnected getRootAsPlayerConnected(ByteBuffer _bb, PlayerConnected obj) { _bb.order(ByteOrder.LITTLE_ENDIAN); return (obj.__assign(_bb.getInt(_bb.position()) + _bb.position(), _bb)); }
  public static boolean PlayerConnectedBufferHasIdentifier(ByteBuffer _bb) { return __has_identifier(_bb, "PLCN"); }
  public void __init(int _i, ByteBuffer _bb) { bb_pos = _i; bb = _bb; }
  public PlayerConnected __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public String id() { int o = __offset(4); return o != 0 ? __string(o + bb_pos) : null; }
  public ByteBuffer idAsByteBuffer() { return __vector_as_bytebuffer(4, 1); }
  public String name() { int o = __offset(6); return o != 0 ? __string(o + bb_pos) : null; }
  public ByteBuffer nameAsByteBuffer() { return __vector_as_bytebuffer(6, 1); }
  public float startingXPosition() { int o = __offset(8); return o != 0 ? bb.getFloat(o + bb_pos) : 0.0f; }
  public float startingYPosition() { int o = __offset(10); return o != 0 ? bb.getFloat(o + bb_pos) : 0.0f; }
  public float startingRotation() { int o = __offset(12); return o != 0 ? bb.getFloat(o + bb_pos) : 0.0f; }
  public float velocityFactor() { int o = __offset(14); return o != 0 ? bb.getFloat(o + bb_pos) : 0.0f; }
  public float angularVelocityFactor() { int o = __offset(16); return o != 0 ? bb.getFloat(o + bb_pos) : 0.0f; }
  public float decelerationFactor() { int o = __offset(18); return o != 0 ? bb.getFloat(o + bb_pos) : 0.0f; }
  public float laserVelocityFactor() { int o = __offset(20); return o != 0 ? bb.getFloat(o + bb_pos) : 0.0f; }

  public static int createPlayerConnected(FlatBufferBuilder builder,
      int idOffset,
      int nameOffset,
      float startingXPosition,
      float startingYPosition,
      float startingRotation,
      float velocityFactor,
      float angularVelocityFactor,
      float decelerationFactor,
      float laserVelocityFactor) {
    builder.startObject(9);
    PlayerConnected.addLaserVelocityFactor(builder, laserVelocityFactor);
    PlayerConnected.addDecelerationFactor(builder, decelerationFactor);
    PlayerConnected.addAngularVelocityFactor(builder, angularVelocityFactor);
    PlayerConnected.addVelocityFactor(builder, velocityFactor);
    PlayerConnected.addStartingRotation(builder, startingRotation);
    PlayerConnected.addStartingYPosition(builder, startingYPosition);
    PlayerConnected.addStartingXPosition(builder, startingXPosition);
    PlayerConnected.addName(builder, nameOffset);
    PlayerConnected.addId(builder, idOffset);
    return PlayerConnected.endPlayerConnected(builder);
  }

  public static void startPlayerConnected(FlatBufferBuilder builder) { builder.startObject(9); }
  public static void addId(FlatBufferBuilder builder, int idOffset) { builder.addOffset(0, idOffset, 0); }
  public static void addName(FlatBufferBuilder builder, int nameOffset) { builder.addOffset(1, nameOffset, 0); }
  public static void addStartingXPosition(FlatBufferBuilder builder, float startingXPosition) { builder.addFloat(2, startingXPosition, 0.0f); }
  public static void addStartingYPosition(FlatBufferBuilder builder, float startingYPosition) { builder.addFloat(3, startingYPosition, 0.0f); }
  public static void addStartingRotation(FlatBufferBuilder builder, float startingRotation) { builder.addFloat(4, startingRotation, 0.0f); }
  public static void addVelocityFactor(FlatBufferBuilder builder, float velocityFactor) { builder.addFloat(5, velocityFactor, 0.0f); }
  public static void addAngularVelocityFactor(FlatBufferBuilder builder, float angularVelocityFactor) { builder.addFloat(6, angularVelocityFactor, 0.0f); }
  public static void addDecelerationFactor(FlatBufferBuilder builder, float decelerationFactor) { builder.addFloat(7, decelerationFactor, 0.0f); }
  public static void addLaserVelocityFactor(FlatBufferBuilder builder, float laserVelocityFactor) { builder.addFloat(8, laserVelocityFactor, 0.0f); }
  public static int endPlayerConnected(FlatBufferBuilder builder) {
    int o = builder.endObject();
    return o;
  }
  public static void finishPlayerConnectedBuffer(FlatBufferBuilder builder, int offset) { builder.finish(offset, "PLCN"); }
}

