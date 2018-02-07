// automatically generated by the FlatBuffers compiler, do not modify

package fr.kissy.zergling_push.event;

import java.nio.*;
import java.lang.*;
import java.util.*;
import com.google.flatbuffers.*;

@SuppressWarnings("unused")
public final class PlayerHit extends Table {
  public static PlayerHit getRootAsPlayerHit(ByteBuffer _bb) { return getRootAsPlayerHit(_bb, new PlayerHit()); }
  public static PlayerHit getRootAsPlayerHit(ByteBuffer _bb, PlayerHit obj) { _bb.order(ByteOrder.LITTLE_ENDIAN); return (obj.__assign(_bb.getInt(_bb.position()) + _bb.position(), _bb)); }
  public static boolean PlayerHitBufferHasIdentifier(ByteBuffer _bb) { return __has_identifier(_bb, "PLHT"); }
  public void __init(int _i, ByteBuffer _bb) { bb_pos = _i; bb = _bb; }
  public PlayerHit __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public String id() { int o = __offset(4); return o != 0 ? __string(o + bb_pos) : null; }
  public ByteBuffer idAsByteBuffer() { return __vector_as_bytebuffer(4, 1); }
  public long time() { int o = __offset(6); return o != 0 ? (long)bb.getInt(o + bb_pos) & 0xFFFFFFFFL : 0L; }
  public String shot() { int o = __offset(8); return o != 0 ? __string(o + bb_pos) : null; }
  public ByteBuffer shotAsByteBuffer() { return __vector_as_bytebuffer(8, 1); }

  public static int createPlayerHit(FlatBufferBuilder builder,
      int idOffset,
      long time,
      int shotOffset) {
    builder.startObject(3);
    PlayerHit.addShot(builder, shotOffset);
    PlayerHit.addTime(builder, time);
    PlayerHit.addId(builder, idOffset);
    return PlayerHit.endPlayerHit(builder);
  }

  public static void startPlayerHit(FlatBufferBuilder builder) { builder.startObject(3); }
  public static void addId(FlatBufferBuilder builder, int idOffset) { builder.addOffset(0, idOffset, 0); }
  public static void addTime(FlatBufferBuilder builder, long time) { builder.addInt(1, (int)time, (int)0L); }
  public static void addShot(FlatBufferBuilder builder, int shotOffset) { builder.addOffset(2, shotOffset, 0); }
  public static int endPlayerHit(FlatBufferBuilder builder) {
    int o = builder.endObject();
    return o;
  }
  public static void finishPlayerHitBuffer(FlatBufferBuilder builder, int offset) { builder.finish(offset, "PLHT"); }
}

