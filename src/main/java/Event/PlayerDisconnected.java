// automatically generated by the FlatBuffers compiler, do not modify

package Event;

import java.nio.*;
import java.lang.*;
import java.util.*;
import com.google.flatbuffers.*;

@SuppressWarnings("unused")
public final class PlayerDisconnected extends Table {
  public static PlayerDisconnected getRootAsPlayerDisconnected(ByteBuffer _bb) { return getRootAsPlayerDisconnected(_bb, new PlayerDisconnected()); }
  public static PlayerDisconnected getRootAsPlayerDisconnected(ByteBuffer _bb, PlayerDisconnected obj) { _bb.order(ByteOrder.LITTLE_ENDIAN); return (obj.__assign(_bb.getInt(_bb.position()) + _bb.position(), _bb)); }
  public static boolean PlayerDisconnectedBufferHasIdentifier(ByteBuffer _bb) { return __has_identifier(_bb, "PLDN"); }
  public void __init(int _i, ByteBuffer _bb) { bb_pos = _i; bb = _bb; }
  public PlayerDisconnected __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public int id() { int o = __offset(4); return o != 0 ? bb.getInt(o + bb_pos) : 0; }
  public boolean mutateId(int id) { int o = __offset(4); if (o != 0) { bb.putInt(o + bb_pos, id); return true; } else { return false; } }

  public static int createPlayerDisconnected(FlatBufferBuilder builder,
      int id) {
    builder.startObject(1);
    PlayerDisconnected.addId(builder, id);
    return PlayerDisconnected.endPlayerDisconnected(builder);
  }

  public static void startPlayerDisconnected(FlatBufferBuilder builder) { builder.startObject(1); }
  public static void addId(FlatBufferBuilder builder, int id) { builder.addInt(0, id, 0); }
  public static int endPlayerDisconnected(FlatBufferBuilder builder) {
    int o = builder.endObject();
    return o;
  }
  public static void finishPlayerDisconnectedBuffer(FlatBufferBuilder builder, int offset) { builder.finish(offset, "PLDN"); }
}

