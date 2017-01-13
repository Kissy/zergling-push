(function (global) {
    var _handlers = {},
        // special keys
        _MAP = {
            backspace: 8, tab: 9, clear: 12,
            enter: 13, 'return': 13,
            esc: 27, escape: 27, space: 32,
            left: 37, up: 38,
            right: 39, down: 40,
            del: 46, 'delete': 46,
            home: 36, end: 35,
            pageup: 33, pagedown: 34,
            ',': 188, '.': 190, '/': 191,
            '`': 192, '-': 189, '=': 187,
            ';': 186, '\'': 222,
            '[': 219, ']': 221, '\\': 220
        },
        code = function (x) {
            return _MAP[x] || x.toUpperCase().charCodeAt(0);
        },
        _downKeys = [];

    for (var k = 1; k < 20; k++) {
        _MAP['f' + k] = 111 + k;
    }

    // IE doesn't support Array#indexOf, so have a simple replacement
    function index(array, item) {
        var i = array.length;
        while (i--) if (array[i] === item) return i;
        return -1;
    }

    function dispatch(event) {
        var key, handler;
        key = event.keyCode;

        var keyIndex = index(_downKeys, key);
        if (event.type == 'keydown') {
            if (keyIndex == -1) {
                _downKeys.push(key);
            }
        } else {
            if (keyIndex >= 0) {
                _downKeys.splice(keyIndex, 1);
            }
        }

        // right command on webkit, command on Gecko
        if (key == 93 || key == 224) {
            key = 91;
        }

        // abort if no potentially matching shortcuts found
        if (!(key in _handlers)) {
            return;
        }

        // for each potential shortcut
        for (var i = 0; i < _handlers[key].length; i++) {
            handler = _handlers[key][i];

            if (handler.preventRepeat && keyIndex >= 0 && event.type == 'keydown') {
                continue;
            }

            // call the handler and stop the event if neccessary
            if (handler[event.type + 'Listener'](event, handler) === false) {
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                if (event.cancelBubble) {
                    event.cancelBubble = true;
                }
            }
        }
    }

    // parse and assign shortcut
    function assignKey(key, keydownListener, keyupListener, preventRepeat) {
        var keys = getKeys(key);
        for (var i = 0; i < keys.length; i++) {
            key = code(key);
            // ...store handler
            if (!(key in _handlers)) {
                _handlers[key] = [];
            }
            _handlers[key].push({key: keys[i], keydownListener: keydownListener, keyupListener: keyupListener, preventRepeat: preventRepeat || false});
        }
    }

    // unbind all handlers for given key in current scope
    function unbindKey(key) {
        var multipleKeys = getKeys(key);
        for (var j = 0; j < multipleKeys.length; j++) {
            key = multipleKeys[j];
            key = code(key);

            if (!_handlers[key]) {
                return;
            }
            for (var i = 0; i < _handlers[key].length; i++) {
                _handlers[key][i] = {};
            }
        }
    }

    // Returns true if the key with code 'keyCode' is currently down
    // Converts strings into key codes.
    function isPressed(keyCode) {
        if (typeof(keyCode) == 'string') {
            keyCode = code(keyCode);
        }
        return index(_downKeys, keyCode) != -1;
    }

    function getPressedKeyCodes() {
        return _downKeys.slice(0);
    }

    // abstract key logic for assign and unassign
    function getKeys(key) {
        var keys;
        key = key.replace(/\s/g, '');
        keys = key.split(',');
        if ((keys[keys.length - 1]) == '') {
            keys[keys.length - 2] += ',';
        }
        return keys;
    }

    // cross-browser events
    function addEvent(object, event, callback) {
        if (object.addEventListener) {
            object.addEventListener(event, callback, false);
        } else if (object.attachEvent) {
            object.attachEvent('on' + event, function () {
                callback(window.event)
            });
        }
    }

    // set the handlers globally on document
    addEvent(document, 'keydown', function (event) {
        dispatch(event);
    });
    addEvent(document, 'keyup', function (event) {
        dispatch(event);
    });

    // store previously defined key
    var previousKey = global.key;

    // restore previously defined key and return reference to our key object
    function noConflict() {
        var k = global.key;
        global.key = previousKey;
        return k;
    }

    global.key = assignKey;
    global.key.isPressed = isPressed;
    global.key.getPressedKeyCodes = getPressedKeyCodes;
    global.key.noConflict = noConflict;
    global.key.unbind = unbindKey;
})(this);