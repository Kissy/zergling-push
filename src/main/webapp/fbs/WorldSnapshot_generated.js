// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
 * @namespace
 */
var fr = fr || {};

/**
 * @const
 * @namespace
 */
fr.kissy = fr.kissy || {};

/**
 * @const
 * @namespace
 */
fr.kissy.zergling_push = fr.kissy.zergling_push || {};

/**
 * @const
 * @namespace
 */
fr.kissy.zergling_push.event = fr.kissy.zergling_push.event || {};

/**
 * @constructor
 */
fr.kissy.zergling_push.event.WorldSnapshot = function() {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  this.bb = null;

  /**
   * @type {number}
   */
  this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {fr.kissy.zergling_push.event.WorldSnapshot}
 */
fr.kissy.zergling_push.event.WorldSnapshot.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {fr.kissy.zergling_push.event.WorldSnapshot=} obj
 * @returns {fr.kissy.zergling_push.event.WorldSnapshot}
 */
fr.kissy.zergling_push.event.WorldSnapshot.getRootAsWorldSnapshot = function(bb, obj) {
  return (obj || new fr.kissy.zergling_push.event.WorldSnapshot).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {boolean}
 */
fr.kissy.zergling_push.event.WorldSnapshot.bufferHasIdentifier = function(bb) {
  return bb.__has_identifier('WDSP');
};

/**
 * @returns {number}
 */
fr.kissy.zergling_push.event.WorldSnapshot.prototype.time = function() {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
};

/**
 * @param {number} index
 * @param {fr.kissy.zergling_push.event.PlayerSnapshot=} obj
 * @returns {fr.kissy.zergling_push.event.PlayerSnapshot}
 */
fr.kissy.zergling_push.event.WorldSnapshot.prototype.players = function(index, obj) {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? (obj || new fr.kissy.zergling_push.event.PlayerSnapshot).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
};

/**
 * @returns {number}
 */
fr.kissy.zergling_push.event.WorldSnapshot.prototype.playersLength = function() {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @param {number} index
 * @param {fr.kissy.zergling_push.event.ProjectileSnapshot=} obj
 * @returns {fr.kissy.zergling_push.event.ProjectileSnapshot}
 */
fr.kissy.zergling_push.event.WorldSnapshot.prototype.projectiles = function(index, obj) {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? (obj || new fr.kissy.zergling_push.event.ProjectileSnapshot).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
};

/**
 * @returns {number}
 */
fr.kissy.zergling_push.event.WorldSnapshot.prototype.projectilesLength = function() {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @param {flatbuffers.Builder} builder
 */
fr.kissy.zergling_push.event.WorldSnapshot.startWorldSnapshot = function(builder) {
  builder.startObject(3);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} time
 */
fr.kissy.zergling_push.event.WorldSnapshot.addTime = function(builder, time) {
  builder.addFieldInt32(0, time, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} playersOffset
 */
fr.kissy.zergling_push.event.WorldSnapshot.addPlayers = function(builder, playersOffset) {
  builder.addFieldOffset(1, playersOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Array.<flatbuffers.Offset>} data
 * @returns {flatbuffers.Offset}
 */
fr.kissy.zergling_push.event.WorldSnapshot.createPlayersVector = function(builder, data) {
  builder.startVector(4, data.length, 4);
  for (var i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]);
  }
  return builder.endVector();
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} numElems
 */
fr.kissy.zergling_push.event.WorldSnapshot.startPlayersVector = function(builder, numElems) {
  builder.startVector(4, numElems, 4);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} projectilesOffset
 */
fr.kissy.zergling_push.event.WorldSnapshot.addProjectiles = function(builder, projectilesOffset) {
  builder.addFieldOffset(2, projectilesOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Array.<flatbuffers.Offset>} data
 * @returns {flatbuffers.Offset}
 */
fr.kissy.zergling_push.event.WorldSnapshot.createProjectilesVector = function(builder, data) {
  builder.startVector(4, data.length, 4);
  for (var i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]);
  }
  return builder.endVector();
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} numElems
 */
fr.kissy.zergling_push.event.WorldSnapshot.startProjectilesVector = function(builder, numElems) {
  builder.startVector(4, numElems, 4);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
fr.kissy.zergling_push.event.WorldSnapshot.endWorldSnapshot = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
fr.kissy.zergling_push.event.WorldSnapshot.finishWorldSnapshotBuffer = function(builder, offset) {
  builder.finish(offset, 'WDSP');
};

// Exports for Node.js and RequireJS
this.fr = fr;
