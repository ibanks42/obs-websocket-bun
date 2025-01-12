"use strict";Object.defineProperty(exports, "__esModule", {value: true}); var _class;





var _chunkOAJQMLLFcjs = require('./chunk-OAJQMLLF.cjs');

// src/json.ts
var OBSWebSocket = (_class = class extends _chunkOAJQMLLFcjs.BaseOBSWebSocket {constructor(...args) { super(...args); _class.prototype.__init.call(this); }
  __init() {this.protocol = "obswebsocket.json"}
  async encodeMessage(data) {
    return JSON.stringify(data);
  }
  async decodeMessage(data) {
    return JSON.parse(data);
  }
}, _class);
var json_default = OBSWebSocket;







exports.EventSubscription = _chunkOAJQMLLFcjs.EventSubscription; exports.OBSWebSocket = OBSWebSocket; exports.OBSWebSocketError = _chunkOAJQMLLFcjs.OBSWebSocketError; exports.RequestBatchExecutionType = _chunkOAJQMLLFcjs.RequestBatchExecutionType; exports.WebSocketOpCode = _chunkOAJQMLLFcjs.WebSocketOpCode; exports.default = json_default;
//# sourceMappingURL=json.cjs.map