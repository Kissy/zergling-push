// automatically generated by the FlatBuffers compiler, do not modify

package Event;

import java.nio.*;
import java.lang.*;
import java.util.*;
import com.google.flatbuffers.*;

@SuppressWarnings("unused")
public final class PlayerShot extends Table {
  public static PlayerShot getRootAsPlayerShot(ByteBuffer _bb) { return getRootAsPlayerShot(_bb, new PlayerShot()); }
  public static PlayerShot getRootAsPlayerShot(ByteBuffer _bb, PlayerShot obj) { _bb.order(ByteOrder.LITTLE_ENDIAN); return (obj.__assign(_bb.getInt(_bb.position()) + _bb.position(), _bb)); }
  public static boolean PlayerShotBufferHasIdentifier(ByteBuffer _bb) { return __has_identifier(_bb, "PLSH"); }
  public void __init(int _i, ByteBuffer _bb) { bb_pos = _i; bb = _bb; }
  public PlayerShot __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public String id() { int o = __offset(4); return o != 0 ? __string(o + bb_pos) : null; }
  public ByteBuffer idAsByteBuffer() { return __vector_as_bytebuffer(4, 1); }
  public long time() { int o = __offset(6); return o != 0 ? (long)bb.getInt(o + bb_pos) & 0xFFFFFFFFL : 0L; }
  public boolean mutateTime(long time) { int o = __offset(6); if (o != 0) { bb.putInt(o + bb_pos, (int)time); return true; } else { return false; } }
  public float x() { int o = __offset(8); return o != 0 ? bb.getFloat(o + bb_pos) : 0.0f; }
  public boolean mutateX(float x) { int o = __offset(8); if (o != 0) { bb.putFloat(o + bb_pos, x); return true; } else { return false; } }
  public float y() { int o = __offset(10); return o != 0 ? bb.getFloat(o + bb_pos) : 0.0f; }
  public boolean mutateY(float y) { int o = __offset(10); if (o != 0) { bb.putFloat(o + bb_pos, y); return true; } else { return false; } }
  public float rotation() { int o = __offset(12); return o != 0 ? bb.getFloat(o + bb_pos) : 0.0f; }
  public boolean mutateRotation(float rotation) { int o = __offset(12); if (o != 0) { bb.putFloat(o + bb_pos, rotation); return true; } else { return false; } }

  public static int createPlayerShot(FlatBufferBuilder builder,
      int idOffset,
      long time,
      float x,
      float y,
      float rotation) {
    builder.startObject(5);
    PlayerShot.addRotation(builder, rotation);
    PlayerShot.addY(builder, y);
    PlayerShot.addX(builder, x);
    PlayerShot.addTime(builder, time);
    PlayerShot.addId(builder, idOffset);
    return PlayerShot.endPlayerShot(builder);
  }

  public static void startPlayerShot(FlatBufferBuilder builder) { builder.startObject(5); }
  public static void addId(FlatBufferBuilder builder, int idOffset) { builder.addOffset(0, idOffset, 0); }
  public static void addTime(FlatBufferBuilder builder, long time) { builder.addInt(1, (int)time, (int)0L); }
  public static void addX(FlatBufferBuilder builder, float x) { builder.addFloat(2, x, 0.0f); }
  public static void addY(FlatBufferBuilder builder, float y) { builder.addFloat(3, y, 0.0f); }
  public static void addRotation(FlatBufferBuilder builder, float rotation) { builder.addFloat(4, rotation, 0.0f); }
  public static int endPlayerShot(FlatBufferBuilder builder) {
    int o = builder.endObject();
    return o;
  }
  public static void finishPlayerShotBuffer(FlatBufferBuilder builder, int offset) { builder.finish(offset, "PLSH"); }
}

