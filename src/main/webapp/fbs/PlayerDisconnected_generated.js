// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
 * @namespace
 */
var Event = Event || {};

/**
 * @constructor
 */
Event.PlayerDisconnected = function() {
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
 * @returns {Event.PlayerDisconnected}
 */
Event.PlayerDisconnected.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Event.PlayerDisconnected=} obj
 * @returns {Event.PlayerDisconnected}
 */
Event.PlayerDisconnected.getRootAsPlayerDisconnected = function(bb, obj) {
  return (obj || new Event.PlayerDisconnected).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {boolean}
 */
Event.PlayerDisconnected.bufferHasIdentifier = function(bb) {
  return bb.__has_identifier('PLDN');
};

/**
 * @returns {number}
 */
Event.PlayerDisconnected.prototype.id = function() {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
};

/**
 * @param {number} value
 * @returns {boolean}
 */
Event.PlayerDisconnected.prototype.mutate_id = function(value) {
  var offset = this.bb.__offset(this.bb_pos, 4);

  if (offset === 0) {
    return false;
  }

  this.bb.writeInt32(this.bb_pos + offset, value);
  return true;
};

/**
 * @param {flatbuffers.Builder} builder
 */
Event.PlayerDisconnected.startPlayerDisconnected = function(builder) {
  builder.startObject(1);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} id
 */
Event.PlayerDisconnected.addId = function(builder, id) {
  builder.addFieldInt32(0, id, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Event.PlayerDisconnected.endPlayerDisconnected = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
Event.PlayerDisconnected.finishPlayerDisconnectedBuffer = function(builder, offset) {
  builder.finish(offset, 'PLDN');
};

// Exports for Node.js and RequireJS
this.Event = Event;
