/* globals __DEV__ */

import * as Phaser from "phaser";

class NetworkManager extends Phaser.EventEmitter {

    constructor(game) {
        super();
        this.game = game;
    }

    connect() {
        this.webSocket = new WebSocket("ws://localhost:8080/websocket");
        this.webSocket.binaryType = 'arraybuffer';
        this.webSocket.onopen = this.onWebSocketOpen.bind(this);
        this.webSocket.onmessage = this.onWebSocketMessage.bind(this);
    }

    send(message) {
        this.webSocket.send(message.asUint8Array());
    }

    onWebSocketOpen() {
        this.emit('connected');
    }

    onWebSocketMessage(message) {
        let byteBuffer = new flatbuffers.ByteBuffer(new Uint8Array(message.data));
        this.emit('message', byteBuffer);
    }
}

// TODO Maybe replace it by a real Phaser plugin ?
let instance = null;
NetworkManager.get = function (game) {
    if (instance === null) {
        instance = new NetworkManager(game);
    }
    return instance;
};

export default NetworkManager
