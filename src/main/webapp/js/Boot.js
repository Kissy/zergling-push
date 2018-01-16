var ZerglingPush = ZerglingPush || {};

ZerglingPush.BootState = {
    create: function() {
        this.game.webSocket = new WebSocket("ws://" + window.location.hostname + ":8080/websocket");
        this.game.webSocket.binaryType = 'arraybuffer';
        this.game.webSocket.onopen = this.onWebSocketOpen.bind(this);
        /*_webSocket.onmessage = function onWebSocketMessage(response) {
            return processMessage(null, response);
        };*/
    },
    onWebSocketOpen: function() {
        this.game.state.start('play');
    }
};