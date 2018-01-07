// automatically generated by the FlatBuffers compiler, do not modify

package Event;

import java.nio.*;
import java.lang.*;
import java.util.*;
import com.google.flatbuffers.*;

@SuppressWarnings("unused")
public final class PlayerJoined extends Table {
  public static PlayerJoined getRootAsPlayerJoined(ByteBuffer _bb) { return getRootAsPlayerJoined(_bb, new PlayerJoined()); }
  public static PlayerJoined getRootAsPlayerJoined(ByteBuffer _bb, PlayerJoined obj) { _bb.order(ByteOrder.LITTLE_ENDIAN); return (obj.__assign(_bb.getInt(_bb.position()) + _bb.position(), _bb)); }
  public static boolean PlayerJoinedBufferHasIdentifier(ByteBuffer _bb) { return __has_identifier(_bb, "PLJN"); }
  public void __init(int _i, ByteBuffer _bb) { bb_pos = _i; bb = _bb; }
  public PlayerJoined __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public String id() { int o = __offset(4); return o != 0 ? __string(o + bb_pos) : null; }
  public ByteBuffer idAsByteBuffer() { return __vector_as_bytebuffer(4, 1); }
  public long time() { int o = __offset(6); return o != 0 ? (long)bb.getInt(o + bb_pos) & 0xFFFFFFFFL : 0L; }
  public String name() { int o = __offset(8); return o != 0 ? __string(o + bb_pos) : null; }
  public ByteBuffer nameAsByteBuffer() { return __vector_as_bytebuffer(8, 1); }
  public PlayerSnapshot snapshot() { return snapshot(new PlayerSnapshot()); }
  public PlayerSnapshot snapshot(PlayerSnapshot obj) { int o = __offset(10); return o != 0 ? obj.__assign(__indirect(o + bb_pos), bb) : null; }

  public static int createPlayerJoined(FlatBufferBuilder builder,
      int idOffset,
      long time,
      int nameOffset,
      int snapshotOffset) {
    builder.startObject(4);
    PlayerJoined.addSnapshot(builder, snapshotOffset);
    PlayerJoined.addName(builder, nameOffset);
    PlayerJoined.addTime(builder, time);
    PlayerJoined.addId(builder, idOffset);
    return PlayerJoined.endPlayerJoined(builder);
  }

  public static void startPlayerJoined(FlatBufferBuilder builder) { builder.startObject(4); }
  public static void addId(FlatBufferBuilder builder, int idOffset) { builder.addOffset(0, idOffset, 0); }
  public static void addTime(FlatBufferBuilder builder, long time) { builder.addInt(1, (int)time, (int)0L); }
  public static void addName(FlatBufferBuilder builder, int nameOffset) { builder.addOffset(2, nameOffset, 0); }
  public static void addSnapshot(FlatBufferBuilder builder, int snapshotOffset) { builder.addOffset(3, snapshotOffset, 0); }
  public static int endPlayerJoined(FlatBufferBuilder builder) {
    int o = builder.endObject();
    return o;
  }
  public static void finishPlayerJoinedBuffer(FlatBufferBuilder builder, int offset) { builder.finish(offset, "PLJN"); }
}

