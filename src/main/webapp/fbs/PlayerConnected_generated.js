// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
 * @namespace
 */
var Event = Event || {};

/**
 * @constructor
 */
Event.PlayerConnected = function() {
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
 * @returns {Event.PlayerConnected}
 */
Event.PlayerConnected.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Event.PlayerConnected=} obj
 * @returns {Event.PlayerConnected}
 */
Event.PlayerConnected.getRootAsPlayerConnected = function(bb, obj) {
  return (obj || new Event.PlayerConnected).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {boolean}
 */
Event.PlayerConnected.bufferHasIdentifier = function(bb) {
  return bb.__has_identifier('PLCN');
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
Event.PlayerConnected.prototype.id = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
Event.PlayerConnected.prototype.name = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @returns {number}
 */
Event.PlayerConnected.prototype.startingXPosition = function() {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
Event.PlayerConnected.prototype.startingYPosition = function() {
  var offset = this.bb.__offset(this.bb_pos, 10);
  return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
Event.PlayerConnected.prototype.startingRotation = function() {
  var offset = this.bb.__offset(this.bb_pos, 12);
  return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
Event.PlayerConnected.prototype.velocityFactor = function() {
  var offset = this.bb.__offset(this.bb_pos, 14);
  return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
Event.PlayerConnected.prototype.angularVelocityFactor = function() {
  var offset = this.bb.__offset(this.bb_pos, 16);
  return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
Event.PlayerConnected.prototype.decelerationFactor = function() {
  var offset = this.bb.__offset(this.bb_pos, 18);
  return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
};

/**
 * @returns {number}
 */
Event.PlayerConnected.prototype.laserVelocityFactor = function() {
  var offset = this.bb.__offset(this.bb_pos, 20);
  return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
};

/**
 * @param {flatbuffers.Builder} builder
 */
Event.PlayerConnected.startPlayerConnected = function(builder) {
  builder.startObject(9);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} idOffset
 */
Event.PlayerConnected.addId = function(builder, idOffset) {
  builder.addFieldOffset(0, idOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} nameOffset
 */
Event.PlayerConnected.addName = function(builder, nameOffset) {
  builder.addFieldOffset(1, nameOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} startingXPosition
 */
Event.PlayerConnected.addStartingXPosition = function(builder, startingXPosition) {
  builder.addFieldFloat32(2, startingXPosition, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} startingYPosition
 */
Event.PlayerConnected.addStartingYPosition = function(builder, startingYPosition) {
  builder.addFieldFloat32(3, startingYPosition, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} startingRotation
 */
Event.PlayerConnected.addStartingRotation = function(builder, startingRotation) {
  builder.addFieldFloat32(4, startingRotation, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} velocityFactor
 */
Event.PlayerConnected.addVelocityFactor = function(builder, velocityFactor) {
  builder.addFieldFloat32(5, velocityFactor, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} angularVelocityFactor
 */
Event.PlayerConnected.addAngularVelocityFactor = function(builder, angularVelocityFactor) {
  builder.addFieldFloat32(6, angularVelocityFactor, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} decelerationFactor
 */
Event.PlayerConnected.addDecelerationFactor = function(builder, decelerationFactor) {
  builder.addFieldFloat32(7, decelerationFactor, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} laserVelocityFactor
 */
Event.PlayerConnected.addLaserVelocityFactor = function(builder, laserVelocityFactor) {
  builder.addFieldFloat32(8, laserVelocityFactor, 0.0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Event.PlayerConnected.endPlayerConnected = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
Event.PlayerConnected.finishPlayerConnectedBuffer = function(builder, offset) {
  builder.finish(offset, 'PLCN');
};

// Exports for Node.js and RequireJS
this.Event = Event;
