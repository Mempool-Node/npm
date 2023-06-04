"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionManager = void 0;
const ws_1 = require("ws");
const connectionManager = (apiKey, url = null) => {
    if (url != null && url.endsWith("/")) {
        url = url.slice(0, -1);
    }
    const connectionUrl = url == null ? `wss://api.mempoolnode.com/ws?apiKey=${apiKey}` : `${url}?apiKey=${apiKey}`;
    var socket = null;
    var onMessageHandler;
    var onCloseHandler;
    var onErrorHandler;
    var registered = false;
    const registerHandlers = (callback, onError = console.error) => {
        if (registered) {
            onError('A callback handler has already been registered. Call .stop() first.');
            return;
        }
        socket = new ws_1.WebSocket(connectionUrl);
        onMessageHandler = (ev) => callback(ev.data);
        onCloseHandler = (ev) => {
            onError(`Server closed conection: "${JSON.stringify(ev)}". Please remediate before calling .start() again.`);
            registered = false;
        };
        onErrorHandler = (ev) => {
            onError(`Error occurred "${ev.message}". Retrying in 1s`);
            setTimeout(() => {
                socket === null || socket === void 0 ? void 0 : socket.removeEventListener('message', onMessageHandler);
                socket === null || socket === void 0 ? void 0 : socket.removeEventListener('close', onCloseHandler);
                socket === null || socket === void 0 ? void 0 : socket.removeEventListener('error', onErrorHandler);
                socket === null || socket === void 0 ? void 0 : socket.close();
                socket = new ws_1.WebSocket(connectionUrl);
                register(socket);
            }, 1000);
        };
        const register = (ws) => {
            console.log('Starting new connection with MempoolNode');
            ws.addEventListener('message', onMessageHandler);
            ws.addEventListener('close', onCloseHandler);
            ws.addEventListener('error', onErrorHandler);
            registered = true;
        };
        register(socket);
    };
    return {
        start: (callback, onError = console.error) => {
            registerHandlers(callback, onError);
        },
        stop: () => {
            socket === null || socket === void 0 ? void 0 : socket.removeEventListener('message', onMessageHandler);
            socket === null || socket === void 0 ? void 0 : socket.removeEventListener('close', onCloseHandler);
            socket === null || socket === void 0 ? void 0 : socket.removeEventListener('error', onErrorHandler);
            socket === null || socket === void 0 ? void 0 : socket.close();
            registered = false;
        }
    };
};
exports.connectionManager = connectionManager;
//# sourceMappingURL=index.js.map