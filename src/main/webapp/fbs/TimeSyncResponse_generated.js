// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
 * @namespace
 */
var Event = Event || {};

/**
 * @constructor
 */
Event.TimeSyncResponse = function() {
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
 * @returns {Event.TimeSyncResponse}
 */
Event.TimeSyncResponse.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Event.TimeSyncResponse=} obj
 * @returns {Event.TimeSyncResponse}
 */
Event.TimeSyncResponse.getRootAsTimeSyncResponse = function(bb, obj) {
  return (obj || new Event.TimeSyncResponse).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {boolean}
 */
Event.TimeSyncResponse.bufferHasIdentifier = function(bb) {
  return bb.__has_identifier('TSRS');
};

/**
 * @returns {number}
 */
Event.TimeSyncResponse.prototype.time = function() {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
};

/**
 * @returns {number}
 */
Event.TimeSyncResponse.prototype.serverTime = function() {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
};

/**
 * @returns {number}
 */
Event.TimeSyncResponse.prototype.serverStartTime = function() {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
};

/**
 * @param {flatbuffers.Builder} builder
 */
Event.TimeSyncResponse.startTimeSyncResponse = function(builder) {
  builder.startObject(3);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} time
 */
Event.TimeSyncResponse.addTime = function(builder, time) {
  builder.addFieldInt32(0, time, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} serverTime
 */
Event.TimeSyncResponse.addServerTime = function(builder, serverTime) {
  builder.addFieldInt32(1, serverTime, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} serverStartTime
 */
Event.TimeSyncResponse.addServerStartTime = function(builder, serverStartTime) {
  builder.addFieldInt32(2, serverStartTime, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Event.TimeSyncResponse.endTimeSyncResponse = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
Event.TimeSyncResponse.finishTimeSyncResponseBuffer = function(builder, offset) {
  builder.finish(offset, 'TSRS');
};

// Exports for Node.js and RequireJS
this.Event = Event;
