// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
 * @namespace
 */
var Event = Event || {};

/**
 * @constructor
 */
Event.PlayerConnect = function() {
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
 * @returns {Event.PlayerConnect}
 */
Event.PlayerConnect.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Event.PlayerConnect=} obj
 * @returns {Event.PlayerConnect}
 */
Event.PlayerConnect.getRootAsPlayerConnect = function(bb, obj) {
  return (obj || new Event.PlayerConnect).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {boolean}
 */
Event.PlayerConnect.bufferHasIdentifier = function(bb) {
  return bb.__has_identifier('PLCO');
};

/**
 * @param {flatbuffers.Builder} builder
 */
Event.PlayerConnect.startPlayerConnect = function(builder) {
  builder.startObject(0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Event.PlayerConnect.endPlayerConnect = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
Event.PlayerConnect.finishPlayerConnectBuffer = function(builder, offset) {
  builder.finish(offset, 'PLCO');
};

// Exports for Node.js and RequireJS
this.Event = Event;