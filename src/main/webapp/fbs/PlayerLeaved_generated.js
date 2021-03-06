// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
 * @namespace
 */
var Event = Event || {};

/**
 * @constructor
 */
Event.PlayerLeaved = function() {
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
 * @returns {Event.PlayerLeaved}
 */
Event.PlayerLeaved.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Event.PlayerLeaved=} obj
 * @returns {Event.PlayerLeaved}
 */
Event.PlayerLeaved.getRootAsPlayerLeaved = function(bb, obj) {
  return (obj || new Event.PlayerLeaved).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {boolean}
 */
Event.PlayerLeaved.bufferHasIdentifier = function(bb) {
  return bb.__has_identifier('PLLV');
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
Event.PlayerLeaved.prototype.id = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Builder} builder
 */
Event.PlayerLeaved.startPlayerLeaved = function(builder) {
  builder.startObject(1);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} idOffset
 */
Event.PlayerLeaved.addId = function(builder, idOffset) {
  builder.addFieldOffset(0, idOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Event.PlayerLeaved.endPlayerLeaved = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
Event.PlayerLeaved.finishPlayerLeavedBuffer = function(builder, offset) {
  builder.finish(offset, 'PLLV');
};

// Exports for Node.js and RequireJS
this.Event = Event;
