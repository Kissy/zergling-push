// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
 * @namespace
 */
var Event = Event || {};

/**
 * @constructor
 */
Event.PlayerShot = function() {
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
 * @returns {Event.PlayerShot}
 */
Event.PlayerShot.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Event.PlayerShot=} obj
 * @returns {Event.PlayerShot}
 */
Event.PlayerShot.getRootAsPlayerShot = function(bb, obj) {
  return (obj || new Event.PlayerShot).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {boolean}
 */
Event.PlayerShot.bufferHasIdentifier = function(bb) {
  return bb.__has_identifier('PLSH');
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
Event.PlayerShot.prototype.id = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @returns {number}
 */
Event.PlayerShot.prototype.time = function() {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
};

/**
 * @returns {number}
 */
Event.PlayerShot.prototype.x = function() {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
Event.PlayerShot.prototype.y = function() {
  var offset = this.bb.__offset(this.bb_pos, 10);
  return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
Event.PlayerShot.prototype.rotation = function() {
  var offset = this.bb.__offset(this.bb_pos, 12);
  return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
};

/**
 * @param {flatbuffers.Builder} builder
 */
Event.PlayerShot.startPlayerShot = function(builder) {
  builder.startObject(5);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} idOffset
 */
Event.PlayerShot.addId = function(builder, idOffset) {
  builder.addFieldOffset(0, idOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} time
 */
Event.PlayerShot.addTime = function(builder, time) {
  builder.addFieldInt32(1, time, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} x
 */
Event.PlayerShot.addX = function(builder, x) {
  builder.addFieldFloat32(2, x, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} y
 */
Event.PlayerShot.addY = function(builder, y) {
  builder.addFieldFloat32(3, y, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} rotation
 */
Event.PlayerShot.addRotation = function(builder, rotation) {
  builder.addFieldFloat32(4, rotation, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Event.PlayerShot.endPlayerShot = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
Event.PlayerShot.finishPlayerShotBuffer = function(builder, offset) {
  builder.finish(offset, 'PLSH');
};

// Exports for Node.js and RequireJS
this.Event = Event;
