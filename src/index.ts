import { WebSocket, CloseEvent, ErrorEvent, MessageEvent } from 'ws';

export type MempoolTransaction = {
    blockHash: string | null;
    accessList: any[];
    transactionIndex: string | null;
    type: number;
    nonce: number;
    input: string;
    r: string;
    s: string;
    chainId: string;
    v: string;
    blockNumber: string | null;
    gas: number;
    maxPriorityFeePerGas: string;
    from: string;
    to: string;
    maxFeePerGas: string;
    value: string;
    hash: string;
    gasPrice: string;
}

export const connectionManager = (apiKey: string, url: string | null = null) => {
    if(url != null && url.endsWith("/")){
        url = url.slice(0,-1);
    }

    const connectionUrl = url == null ? `wss://api.mempoolnode.com/ws?apiKey=${apiKey}` : `${url}?apiKey=${apiKey}`;
    var socket: WebSocket|null = null;
    var onMessageHandler: (ev: MessageEvent) => void;
    var onCloseHandler: (ev: CloseEvent) => void;
    var onErrorHandler: (ev: ErrorEvent) => void;
    var registered = false;

    const registerHandlers = (callback: (transaction: MempoolTransaction) => void, onError: (errorMessage: string) => void = console.error) => {
        if(registered){
            onError('A callback handler has already been registered. Call .stop() first.');
            return;
        }
        socket = new WebSocket(connectionUrl);
        onMessageHandler = (ev: MessageEvent) => callback(<MempoolTransaction><unknown>ev.data);
        onCloseHandler = (ev: CloseEvent) => {
            onError(`Server closed conection: "${JSON.stringify(ev)}". Please remediate before calling .start() again.`);
            registered = false;
        };
        onErrorHandler = (ev: ErrorEvent) => {
            onError(`Error occurred "${ev.message}". Retrying in 1s`);
            setTimeout(() => {
                socket?.removeEventListener('message', onMessageHandler);
                socket?.removeEventListener('close', onCloseHandler);
                socket?.removeEventListener('error', onErrorHandler);
                socket?.close();
                socket = new WebSocket(connectionUrl);
                register(socket);
            }, 1000);
        };

        const register = (ws: WebSocket) => {
            console.log('Starting new connection with MempoolNode');

            ws.addEventListener('message', onMessageHandler);
            ws.addEventListener('close', onCloseHandler);
            ws.addEventListener('error', onErrorHandler);

            registered = true;
        };
        register(socket);
    };


    return {
        start: (callback: (transaction: MempoolTransaction) => void, onError: (errorMessage: string) => void = console.error) => {
            registerHandlers(callback, onError);
        },
        stop: () => {
            socket?.removeEventListener('message', onMessageHandler);
            socket?.removeEventListener('close', onCloseHandler);
            socket?.removeEventListener('error', onErrorHandler);
            socket?.close();

            registered = false;
        }
    }
}