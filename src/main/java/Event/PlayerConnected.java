// automatically generated by the FlatBuffers compiler, do not modify

package Event;

import java.nio.*;
import java.lang.*;
import java.util.*;
import com.google.flatbuffers.*;

@SuppressWarnings("unused")
public final class PlayerConnected extends Table {
  public static PlayerConnected getRootAsPlayerConnected(ByteBuffer _bb) { return getRootAsPlayerConnected(_bb, new PlayerConnected()); }
  public static PlayerConnected getRootAsPlayerConnected(ByteBuffer _bb, PlayerConnected obj) { _bb.order(ByteOrder.LITTLE_ENDIAN); return (obj.__assign(_bb.getInt(_bb.position()) + _bb.position(), _bb)); }
  public static boolean PlayerConnectedBufferHasIdentifier(ByteBuffer _bb) { return __has_identifier(_bb, "PLCN"); }
  public void __init(int _i, ByteBuffer _bb) { bb_pos = _i; bb = _bb; }
  public PlayerConnected __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public int id() { int o = __offset(4); return o != 0 ? bb.getInt(o + bb_pos) : 0; }
  public boolean mutateId(int id) { int o = __offset(4); if (o != 0) { bb.putInt(o + bb_pos, id); return true; } else { return false; } }
  public float x() { int o = __offset(6); return o != 0 ? bb.getFloat(o + bb_pos) : 0.0f; }
  public boolean mutateX(float x) { int o = __offset(6); if (o != 0) { bb.putFloat(o + bb_pos, x); return true; } else { return false; } }
  public float y() { int o = __offset(8); return o != 0 ? bb.getFloat(o + bb_pos) : 0.0f; }
  public boolean mutateY(float y) { int o = __offset(8); if (o != 0) { bb.putFloat(o + bb_pos, y); return true; } else { return false; } }

  public static int createPlayerConnected(FlatBufferBuilder builder,
      int id,
      float x,
      float y) {
    builder.startObject(3);
    PlayerConnected.addY(builder, y);
    PlayerConnected.addX(builder, x);
    PlayerConnected.addId(builder, id);
    return PlayerConnected.endPlayerConnected(builder);
  }

  public static void startPlayerConnected(FlatBufferBuilder builder) { builder.startObject(3); }
  public static void addId(FlatBufferBuilder builder, int id) { builder.addInt(0, id, 0); }
  public static void addX(FlatBufferBuilder builder, float x) { builder.addFloat(1, x, 0.0f); }
  public static void addY(FlatBufferBuilder builder, float y) { builder.addFloat(2, y, 0.0f); }
  public static int endPlayerConnected(FlatBufferBuilder builder) {
    int o = builder.endObject();
    return o;
  }
  public static void finishPlayerConnectedBuffer(FlatBufferBuilder builder, int offset) { builder.finish(offset, "PLCN"); }
}

