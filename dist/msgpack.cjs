"use strict";Object.defineProperty(exports, "__esModule", {value: true}); var _class;





var _chunkOAJQMLLFcjs = require('./chunk-OAJQMLLF.cjs');

// src/msgpack.ts
var _msgpack = require('@msgpack/msgpack');
var OBSWebSocket = (_class = class extends _chunkOAJQMLLFcjs.BaseOBSWebSocket {constructor(...args) { super(...args); _class.prototype.__init.call(this); }
  __init() {this.protocol = "obswebsocket.msgpack"}
  async encodeMessage(data) {
    return _msgpack.encode.call(void 0, data);
  }
  async decodeMessage(data) {
    if (typeof Blob !== "undefined" && data instanceof Blob) {
      data = await data.arrayBuffer();
    }
    return _msgpack.decode.call(void 0, data);
  }
}, _class);
var msgpack_default = OBSWebSocket;







exports.EventSubscription = _chunkOAJQMLLFcjs.EventSubscription; exports.OBSWebSocket = OBSWebSocket; exports.OBSWebSocketError = _chunkOAJQMLLFcjs.OBSWebSocketError; exports.RequestBatchExecutionType = _chunkOAJQMLLFcjs.RequestBatchExecutionType; exports.WebSocketOpCode = _chunkOAJQMLLFcjs.WebSocketOpCode; exports.default = msgpack_default;
//# sourceMappingURL=msgpack.cjs.map