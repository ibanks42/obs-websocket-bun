"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } var _class;// src/types.ts
var WebSocketOpCode = /* @__PURE__ */ ((WebSocketOpCode2) => {
  WebSocketOpCode2[WebSocketOpCode2["Hello"] = 0] = "Hello";
  WebSocketOpCode2[WebSocketOpCode2["Identify"] = 1] = "Identify";
  WebSocketOpCode2[WebSocketOpCode2["Identified"] = 2] = "Identified";
  WebSocketOpCode2[WebSocketOpCode2["Reidentify"] = 3] = "Reidentify";
  WebSocketOpCode2[WebSocketOpCode2["Event"] = 5] = "Event";
  WebSocketOpCode2[WebSocketOpCode2["Request"] = 6] = "Request";
  WebSocketOpCode2[WebSocketOpCode2["RequestResponse"] = 7] = "RequestResponse";
  WebSocketOpCode2[WebSocketOpCode2["RequestBatch"] = 8] = "RequestBatch";
  WebSocketOpCode2[WebSocketOpCode2["RequestBatchResponse"] = 9] = "RequestBatchResponse";
  return WebSocketOpCode2;
})(WebSocketOpCode || {});
var EventSubscription = /* @__PURE__ */ ((EventSubscription2) => {
  EventSubscription2[EventSubscription2["None"] = 0] = "None";
  EventSubscription2[EventSubscription2["General"] = 1] = "General";
  EventSubscription2[EventSubscription2["Config"] = 2] = "Config";
  EventSubscription2[EventSubscription2["Scenes"] = 4] = "Scenes";
  EventSubscription2[EventSubscription2["Inputs"] = 8] = "Inputs";
  EventSubscription2[EventSubscription2["Transitions"] = 16] = "Transitions";
  EventSubscription2[EventSubscription2["Filters"] = 32] = "Filters";
  EventSubscription2[EventSubscription2["Outputs"] = 64] = "Outputs";
  EventSubscription2[EventSubscription2["SceneItems"] = 128] = "SceneItems";
  EventSubscription2[EventSubscription2["MediaInputs"] = 256] = "MediaInputs";
  EventSubscription2[EventSubscription2["Vendors"] = 512] = "Vendors";
  EventSubscription2[EventSubscription2["Ui"] = 1024] = "Ui";
  EventSubscription2[EventSubscription2["All"] = 2047] = "All";
  EventSubscription2[EventSubscription2["InputVolumeMeters"] = 65536] = "InputVolumeMeters";
  EventSubscription2[EventSubscription2["InputActiveStateChanged"] = 131072] = "InputActiveStateChanged";
  EventSubscription2[EventSubscription2["InputShowStateChanged"] = 262144] = "InputShowStateChanged";
  EventSubscription2[EventSubscription2["SceneItemTransformChanged"] = 524288] = "SceneItemTransformChanged";
  return EventSubscription2;
})(EventSubscription || {});
var RequestBatchExecutionType = /* @__PURE__ */ ((RequestBatchExecutionType2) => {
  RequestBatchExecutionType2[RequestBatchExecutionType2["None"] = -1] = "None";
  RequestBatchExecutionType2[RequestBatchExecutionType2["SerialRealtime"] = 0] = "SerialRealtime";
  RequestBatchExecutionType2[RequestBatchExecutionType2["SerialFrame"] = 1] = "SerialFrame";
  RequestBatchExecutionType2[RequestBatchExecutionType2["Parallel"] = 2] = "Parallel";
  return RequestBatchExecutionType2;
})(RequestBatchExecutionType || {});

// src/base.ts
var _debug = require('debug'); var _debug2 = _interopRequireDefault(_debug);
var _eventemitter3 = require('eventemitter3');
var _isomorphicws = require('isomorphic-ws'); var _isomorphicws2 = _interopRequireDefault(_isomorphicws);

// src/utils/authenticationHashing.ts
var _sha256js = require('crypto-js/sha256.js'); var _sha256js2 = _interopRequireDefault(_sha256js);
var _encbase64js = require('crypto-js/enc-base64.js'); var _encbase64js2 = _interopRequireDefault(_encbase64js);
function authenticationHashing_default(salt, challenge, msg) {
  const hash = _encbase64js2.default.stringify(_sha256js2.default.call(void 0, msg + salt));
  return _encbase64js2.default.stringify(_sha256js2.default.call(void 0, hash + challenge));
}

// src/base.ts
var debug = _debug2.default.call(void 0, "obs-websocket-js");
var OBSWebSocketError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
};
var BaseOBSWebSocket = (_class = class _BaseOBSWebSocket extends _eventemitter3.EventEmitter {constructor(...args) { super(...args); _class.prototype.__init.call(this);_class.prototype.__init2.call(this); }
  static __initStatic() {this.requestCounter = 1}
  static generateMessageId() {
    return String(_BaseOBSWebSocket.requestCounter++);
  }
  __init() {this._identified = false}
  __init2() {this.internalListeners = new (0, _eventemitter3.EventEmitter)()}
  
  get identified() {
    return this._identified;
  }
  /**
   * Connect to an obs-websocket server
   * @param url Websocket server to connect to (including ws:// or wss:// protocol)
   * @param password Password
   * @param identificationParams Data for Identify event
   * @returns Hello & Identified messages data (combined)
   */
  async connect(url = "ws://127.0.0.1:4455", password, identificationParams = {}) {
    if (this.socket) {
      await this.disconnect();
    }
    try {
      const connectionClosedPromise = this.internalEventPromise("ConnectionClosed");
      const connectionErrorPromise = this.internalEventPromise("ConnectionError");
      return await Promise.race([
        (async () => {
          const hello = await this.createConnection(url);
          this.emit("Hello", hello);
          return this.identify(hello, password, identificationParams);
        })(),
        // Choose the best promise for connection error/close
        // In browser connection close has close code + reason,
        // while in node error event has these
        new Promise((resolve, reject) => {
          void connectionErrorPromise.then((e) => {
            if (e.message) {
              reject(e);
            }
          });
          void connectionClosedPromise.then((e) => {
            reject(e);
          });
        })
      ]);
    } catch (error) {
      await this.disconnect();
      throw error;
    }
  }
  /**
   * Disconnect from obs-websocket server
   */
  async disconnect() {
    if (!this.socket || this.socket.readyState === _isomorphicws2.default.CLOSED) {
      return;
    }
    const connectionClosedPromise = this.internalEventPromise("ConnectionClosed");
    this.socket.close();
    await connectionClosedPromise;
  }
  /**
   * Update session parameters
   * @param data Reidentify data
   * @returns Identified message data
   */
  async reidentify(data) {
    const identifiedPromise = this.internalEventPromise(`op:${2 /* Identified */}`);
    await this.message(3 /* Reidentify */, data);
    return identifiedPromise;
  }
  /**
   * Send a request to obs-websocket
   * @param requestType Request name
   * @param requestData Request data
   * @returns Request response
   */
  async call(requestType, requestData) {
    const requestId = _BaseOBSWebSocket.generateMessageId();
    const responsePromise = this.internalEventPromise(`res:${requestId}`);
    await this.message(6 /* Request */, {
      requestId,
      requestType,
      requestData
    });
    const { requestStatus, responseData } = await responsePromise;
    if (!requestStatus.result) {
      throw new OBSWebSocketError(requestStatus.code, requestStatus.comment);
    }
    return responseData;
  }
  /**
   * Send a batch request to obs-websocket
   * @param requests Array of Request objects (type and data)
   * @param options A set of options for how the batch will be executed
   * @param options.executionType The mode of execution obs-websocket will run the batch in
   * @param options.haltOnFailure Whether obs-websocket should stop executing the batch if one request fails
   * @returns RequestBatch response
   */
  async callBatch(requests, options = {}) {
    const requestId = _BaseOBSWebSocket.generateMessageId();
    const responsePromise = this.internalEventPromise(`res:${requestId}`);
    await this.message(8 /* RequestBatch */, {
      requestId,
      requests,
      ...options
    });
    const { results } = await responsePromise;
    return results;
  }
  /**
   * Cleanup from socket disconnection
   */
  cleanup() {
    if (!this.socket) {
      return;
    }
    this.socket.onopen = null;
    this.socket.onmessage = null;
    this.socket.onerror = null;
    this.socket.onclose = null;
    this.socket = void 0;
    this._identified = false;
    this.internalListeners.removeAllListeners();
  }
  /**
   * Create connection to specified obs-websocket server
   *
   * @private
   * @param url Websocket address
   * @returns Promise for hello data
   */
  async createConnection(url) {
    var _a;
    const connectionOpenedPromise = this.internalEventPromise("ConnectionOpened");
    const helloPromise = this.internalEventPromise(`op:${0 /* Hello */}`);
    this.socket = new (0, _isomorphicws2.default)(url, this.protocol);
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    await connectionOpenedPromise;
    const protocol = (_a = this.socket) == null ? void 0 : _a.protocol;
    return helloPromise;
  }
  /**
   * Send identify message
   *
   * @private
   * @param hello Hello message data
   * @param password Password
   * @param identificationParams Identification params
   * @returns Hello & Identified messages data (combined)
   */
  async identify({
    authentication,
    rpcVersion,
    ...helloRest
  }, password, identificationParams = {}) {
    const data = {
      rpcVersion,
      ...identificationParams
    };
    if (authentication && password) {
      data.authentication = authenticationHashing_default(authentication.salt, authentication.challenge, password);
    }
    const identifiedPromise = this.internalEventPromise(`op:${2 /* Identified */}`);
    await this.message(1 /* Identify */, data);
    const identified = await identifiedPromise;
    this._identified = true;
    this.emit("Identified", identified);
    return {
      rpcVersion,
      ...helloRest,
      ...identified
    };
  }
  /**
   * Send message to obs-websocket
   *
   * @private
   * @param op WebSocketOpCode
   * @param d Message data
   */
  async message(op, d) {
    if (!this.socket) {
      throw new Error("Not connected");
    }
    if (!this.identified && op !== 1) {
      throw new Error("Socket not identified");
    }
    const encoded = await this.encodeMessage({
      op,
      d
    });
    this.socket.send(encoded);
  }
  /**
   * Create a promise to listen for an event on internal listener
   * (will be cleaned up on disconnect)
   *
   * @private
   * @param event Event to listen to
   * @returns Event data
   */
  async internalEventPromise(event) {
    return new Promise((resolve) => {
      this.internalListeners.once(event, resolve);
    });
  }
  /**
   * Websocket open event listener
   *
   * @private
   * @param e Event
   */
  onOpen(e) {
    debug("socket.open");
    this.emit("ConnectionOpened");
    this.internalListeners.emit("ConnectionOpened", e);
  }
  /**
   * Websocket message event listener
   *
   * @private
   * @param e Event
   */
  async onMessage(e) {
    try {
      const { op, d } = await this.decodeMessage(e.data);
      debug("socket.message: %d %j", op, d);
      if (op === void 0 || d === void 0) {
        return;
      }
      switch (op) {
        case 5 /* Event */: {
          const { eventType, eventData } = d;
          this.emit(eventType, eventData);
          return;
        }
        case 7 /* RequestResponse */:
        case 9 /* RequestBatchResponse */: {
          const { requestId } = d;
          this.internalListeners.emit(`res:${requestId}`, d);
          return;
        }
        default:
          this.internalListeners.emit(`op:${op}`, d);
      }
    } catch (error) {
      debug("error handling message: %o", error);
    }
  }
  /**
   * Websocket error event listener
   *
   * @private
   * @param e ErrorEvent
   */
  onError(e) {
    debug("socket.error: %o", e);
    const error = new OBSWebSocketError(-1, e.message);
    this.emit("ConnectionError", error);
    this.internalListeners.emit("ConnectionError", error);
  }
  /**
   * Websocket close event listener
   *
   * @private
   * @param e Event
   */
  onClose(e) {
    debug("socket.close: %s (%d)", e.reason, e.code);
    const error = new OBSWebSocketError(e.code, e.reason);
    this.emit("ConnectionClosed", error);
    this.internalListeners.emit("ConnectionClosed", error);
    this.cleanup();
  }
}, _class.__initStatic(), _class);
if (typeof exports !== "undefined") {
  Object.defineProperty(exports, "__esModule", { value: true });
}







exports.WebSocketOpCode = WebSocketOpCode; exports.EventSubscription = EventSubscription; exports.RequestBatchExecutionType = RequestBatchExecutionType; exports.OBSWebSocketError = OBSWebSocketError; exports.BaseOBSWebSocket = BaseOBSWebSocket;
//# sourceMappingURL=chunk-OAJQMLLF.cjs.map