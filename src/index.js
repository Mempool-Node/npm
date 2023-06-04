"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionManager = void 0;
var ws_1 = require("ws");
var connectionManager = function (apiKey, url) {
    if (url === void 0) { url = null; }
    if (url != null && url.endsWith("/")) {
        url = url.slice(0, -1);
    }
    var connectionUrl = url == null ? "wss://api.mempoolnode.com/ws?apiKey=".concat(apiKey) : "".concat(url, "?apiKey=").concat(apiKey);
    var socket = null;
    var onMessageHandler;
    var onCloseHandler;
    var onErrorHandler;
    var registered = false;
    var registerHandlers = function (callback, onError) {
        if (onError === void 0) { onError = console.error; }
        if (registered) {
            onError('A callback handler has already been registered. Call .stop() first.');
            return;
        }
        socket = new ws_1.WebSocket(connectionUrl);
        onMessageHandler = function (ev) { return callback(ev.data); };
        onCloseHandler = function (ev) {
            onError("Server closed conection: \"".concat(JSON.stringify(ev), "\". Please remediate before calling .start() again."));
            registered = false;
        };
        onErrorHandler = function (ev) {
            onError("Error occurred \"".concat(ev.message, "\". Retrying in 1s"));
            setTimeout(function () {
                socket === null || socket === void 0 ? void 0 : socket.removeEventListener('message', onMessageHandler);
                socket === null || socket === void 0 ? void 0 : socket.removeEventListener('close', onCloseHandler);
                socket === null || socket === void 0 ? void 0 : socket.removeEventListener('error', onErrorHandler);
                socket === null || socket === void 0 ? void 0 : socket.close();
                socket = new ws_1.WebSocket(connectionUrl);
                register(socket);
            }, 1000);
        };
        var register = function (ws) {
            console.log('Starting new connection with MempoolNode');
            ws.addEventListener('message', onMessageHandler);
            ws.addEventListener('close', onCloseHandler);
            ws.addEventListener('error', onErrorHandler);
            registered = true;
        };
        register(socket);
    };
    return {
        start: function (callback, onError) {
            if (onError === void 0) { onError = console.error; }
            registerHandlers(callback, onError);
        },
        stop: function () {
            socket === null || socket === void 0 ? void 0 : socket.removeEventListener('message', onMessageHandler);
            socket === null || socket === void 0 ? void 0 : socket.removeEventListener('close', onCloseHandler);
            socket === null || socket === void 0 ? void 0 : socket.removeEventListener('error', onErrorHandler);
            socket === null || socket === void 0 ? void 0 : socket.close();
            registered = false;
        }
    };
};
exports.connectionManager = connectionManager;
