// automatically generated by the FlatBuffers compiler, do not modify

package fr.kissy.zergling_push.event;

import java.nio.*;
import java.lang.*;
import java.util.*;
import com.google.flatbuffers.*;

@SuppressWarnings("unused")
public final class WorldSnapshot extends Table {
  public static WorldSnapshot getRootAsWorldSnapshot(ByteBuffer _bb) { return getRootAsWorldSnapshot(_bb, new WorldSnapshot()); }
  public static WorldSnapshot getRootAsWorldSnapshot(ByteBuffer _bb, WorldSnapshot obj) { _bb.order(ByteOrder.LITTLE_ENDIAN); return (obj.__assign(_bb.getInt(_bb.position()) + _bb.position(), _bb)); }
  public static boolean WorldSnapshotBufferHasIdentifier(ByteBuffer _bb) { return __has_identifier(_bb, "WDSP"); }
  public void __init(int _i, ByteBuffer _bb) { bb_pos = _i; bb = _bb; }
  public WorldSnapshot __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public long time() { int o = __offset(4); return o != 0 ? (long)bb.getInt(o + bb_pos) & 0xFFFFFFFFL : 0L; }
  public PlayerSnapshot players(int j) { return players(new PlayerSnapshot(), j); }
  public PlayerSnapshot players(PlayerSnapshot obj, int j) { int o = __offset(6); return o != 0 ? obj.__assign(__indirect(__vector(o) + j * 4), bb) : null; }
  public int playersLength() { int o = __offset(6); return o != 0 ? __vector_len(o) : 0; }
  public ProjectileSnapshot projectiles(int j) { return projectiles(new ProjectileSnapshot(), j); }
  public ProjectileSnapshot projectiles(ProjectileSnapshot obj, int j) { int o = __offset(8); return o != 0 ? obj.__assign(__indirect(__vector(o) + j * 4), bb) : null; }
  public int projectilesLength() { int o = __offset(8); return o != 0 ? __vector_len(o) : 0; }

  public static int createWorldSnapshot(FlatBufferBuilder builder,
      long time,
      int playersOffset,
      int projectilesOffset) {
    builder.startObject(3);
    WorldSnapshot.addProjectiles(builder, projectilesOffset);
    WorldSnapshot.addPlayers(builder, playersOffset);
    WorldSnapshot.addTime(builder, time);
    return WorldSnapshot.endWorldSnapshot(builder);
  }

  public static void startWorldSnapshot(FlatBufferBuilder builder) { builder.startObject(3); }
  public static void addTime(FlatBufferBuilder builder, long time) { builder.addInt(0, (int)time, (int)0L); }
  public static void addPlayers(FlatBufferBuilder builder, int playersOffset) { builder.addOffset(1, playersOffset, 0); }
  public static int createPlayersVector(FlatBufferBuilder builder, int[] data) { builder.startVector(4, data.length, 4); for (int i = data.length - 1; i >= 0; i--) builder.addOffset(data[i]); return builder.endVector(); }
  public static void startPlayersVector(FlatBufferBuilder builder, int numElems) { builder.startVector(4, numElems, 4); }
  public static void addProjectiles(FlatBufferBuilder builder, int projectilesOffset) { builder.addOffset(2, projectilesOffset, 0); }
  public static int createProjectilesVector(FlatBufferBuilder builder, int[] data) { builder.startVector(4, data.length, 4); for (int i = data.length - 1; i >= 0; i--) builder.addOffset(data[i]); return builder.endVector(); }
  public static void startProjectilesVector(FlatBufferBuilder builder, int numElems) { builder.startVector(4, numElems, 4); }
  public static int endWorldSnapshot(FlatBufferBuilder builder) {
    int o = builder.endObject();
    return o;
  }
  public static void finishWorldSnapshotBuffer(FlatBufferBuilder builder, int offset) { builder.finish(offset, "WDSP"); }
}

