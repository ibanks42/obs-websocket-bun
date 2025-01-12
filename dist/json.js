import {
  BaseOBSWebSocket,
  EventSubscription,
  OBSWebSocketError,
  RequestBatchExecutionType,
  WebSocketOpCode
} from "./chunk-7RUNZFN7.js";

// src/json.ts
var OBSWebSocket = class extends BaseOBSWebSocket {
  protocol = "obswebsocket.json";
  async encodeMessage(data) {
    return JSON.stringify(data);
  }
  async decodeMessage(data) {
    return JSON.parse(data);
  }
};
var json_default = OBSWebSocket;
export {
  EventSubscription,
  OBSWebSocket,
  OBSWebSocketError,
  RequestBatchExecutionType,
  WebSocketOpCode,
  json_default as default
};
//# sourceMappingURL=json.js.map