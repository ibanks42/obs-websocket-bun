import {
  BaseOBSWebSocket,
  EventSubscription,
  OBSWebSocketError,
  RequestBatchExecutionType,
  WebSocketOpCode
} from "./chunk-7RUNZFN7.js";

// src/msgpack.ts
import { decode, encode } from "@msgpack/msgpack";
var OBSWebSocket = class extends BaseOBSWebSocket {
  protocol = "obswebsocket.msgpack";
  async encodeMessage(data) {
    return encode(data);
  }
  async decodeMessage(data) {
    if (typeof Blob !== "undefined" && data instanceof Blob) {
      data = await data.arrayBuffer();
    }
    return decode(data);
  }
};
var msgpack_default = OBSWebSocket;
export {
  EventSubscription,
  OBSWebSocket,
  OBSWebSocketError,
  RequestBatchExecutionType,
  WebSocketOpCode,
  msgpack_default as default
};
//# sourceMappingURL=msgpack.js.map