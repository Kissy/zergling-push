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
fr.kissy.zergling_push.event.PlayerJoined = function() {
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
 * @returns {fr.kissy.zergling_push.event.PlayerJoined}
 */
fr.kissy.zergling_push.event.PlayerJoined.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {fr.kissy.zergling_push.event.PlayerJoined=} obj
 * @returns {fr.kissy.zergling_push.event.PlayerJoined}
 */
fr.kissy.zergling_push.event.PlayerJoined.getRootAsPlayerJoined = function(bb, obj) {
  return (obj || new fr.kissy.zergling_push.event.PlayerJoined).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {boolean}
 */
fr.kissy.zergling_push.event.PlayerJoined.bufferHasIdentifier = function(bb) {
  return bb.__has_identifier('PLJN');
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
fr.kissy.zergling_push.event.PlayerJoined.prototype.id = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @returns {number}
 */
fr.kissy.zergling_push.event.PlayerJoined.prototype.time = function() {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
fr.kissy.zergling_push.event.PlayerJoined.prototype.name = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {fr.kissy.zergling_push.event.PlayerSnapshot=} obj
 * @returns {fr.kissy.zergling_push.event.PlayerSnapshot|null}
 */
fr.kissy.zergling_push.event.PlayerJoined.prototype.snapshot = function(obj) {
  var offset = this.bb.__offset(this.bb_pos, 10);
  return offset ? (obj || new fr.kissy.zergling_push.event.PlayerSnapshot).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
};

/**
 * @param {flatbuffers.Builder} builder
 */
fr.kissy.zergling_push.event.PlayerJoined.startPlayerJoined = function(builder) {
  builder.startObject(4);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} idOffset
 */
fr.kissy.zergling_push.event.PlayerJoined.addId = function(builder, idOffset) {
  builder.addFieldOffset(0, idOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} time
 */
fr.kissy.zergling_push.event.PlayerJoined.addTime = function(builder, time) {
  builder.addFieldInt32(1, time, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} nameOffset
 */
fr.kissy.zergling_push.event.PlayerJoined.addName = function(builder, nameOffset) {
  builder.addFieldOffset(2, nameOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} snapshotOffset
 */
fr.kissy.zergling_push.event.PlayerJoined.addSnapshot = function(builder, snapshotOffset) {
  builder.addFieldOffset(3, snapshotOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
fr.kissy.zergling_push.event.PlayerJoined.endPlayerJoined = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
fr.kissy.zergling_push.event.PlayerJoined.finishPlayerJoinedBuffer = function(builder, offset) {
  builder.finish(offset, 'PLJN');
};

// Exports for Node.js and RequireJS
this.fr = fr;
