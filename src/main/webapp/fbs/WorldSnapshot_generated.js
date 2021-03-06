// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
 * @namespace
 */
var Event = Event || {};

/**
 * @constructor
 */
Event.WorldSnapshot = function() {
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
 * @returns {Event.WorldSnapshot}
 */
Event.WorldSnapshot.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Event.WorldSnapshot=} obj
 * @returns {Event.WorldSnapshot}
 */
Event.WorldSnapshot.getRootAsWorldSnapshot = function(bb, obj) {
  return (obj || new Event.WorldSnapshot).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {boolean}
 */
Event.WorldSnapshot.bufferHasIdentifier = function(bb) {
  return bb.__has_identifier('WDSP');
};

/**
 * @returns {number}
 */
Event.WorldSnapshot.prototype.time = function() {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
};

/**
 * @param {number} index
 * @param {Event.PlayerSnapshot=} obj
 * @returns {Event.PlayerSnapshot}
 */
Event.WorldSnapshot.prototype.players = function(index, obj) {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? (obj || new Event.PlayerSnapshot).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
};

/**
 * @returns {number}
 */
Event.WorldSnapshot.prototype.playersLength = function() {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @param {number} index
 * @param {Event.ProjectileSnapshot=} obj
 * @returns {Event.ProjectileSnapshot}
 */
Event.WorldSnapshot.prototype.projectiles = function(index, obj) {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? (obj || new Event.ProjectileSnapshot).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
};

/**
 * @returns {number}
 */
Event.WorldSnapshot.prototype.projectilesLength = function() {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @param {flatbuffers.Builder} builder
 */
Event.WorldSnapshot.startWorldSnapshot = function(builder) {
  builder.startObject(3);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} time
 */
Event.WorldSnapshot.addTime = function(builder, time) {
  builder.addFieldInt32(0, time, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} playersOffset
 */
Event.WorldSnapshot.addPlayers = function(builder, playersOffset) {
  builder.addFieldOffset(1, playersOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Array.<flatbuffers.Offset>} data
 * @returns {flatbuffers.Offset}
 */
Event.WorldSnapshot.createPlayersVector = function(builder, data) {
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
Event.WorldSnapshot.startPlayersVector = function(builder, numElems) {
  builder.startVector(4, numElems, 4);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} projectilesOffset
 */
Event.WorldSnapshot.addProjectiles = function(builder, projectilesOffset) {
  builder.addFieldOffset(2, projectilesOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Array.<flatbuffers.Offset>} data
 * @returns {flatbuffers.Offset}
 */
Event.WorldSnapshot.createProjectilesVector = function(builder, data) {
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
Event.WorldSnapshot.startProjectilesVector = function(builder, numElems) {
  builder.startVector(4, numElems, 4);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Event.WorldSnapshot.endWorldSnapshot = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
Event.WorldSnapshot.finishWorldSnapshotBuffer = function(builder, offset) {
  builder.finish(offset, 'WDSP');
};

// Exports for Node.js and RequireJS
this.Event = Event;
