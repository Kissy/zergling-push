var ZerglingPush = ZerglingPush || {};

ZerglingPush.BootState = {
    create: function() {
        this.game.net.webSocket = new WebSocket("ws://" + this.game.net.getHostName() + ":8080/websocket");
        this.game.net.webSocket.binaryType = 'arraybuffer';
        this.game.net.webSocket.onopen = this.onWebSocketOpen.bind(this);
    },
    onWebSocketOpen: function() {
        this.game.state.start('play');
    }
};