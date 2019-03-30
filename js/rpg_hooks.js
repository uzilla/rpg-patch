// Author: urain39
// FIXED: Mobile Devices Such As Android Cannot Run At Browser

/**** BEGIN OF THE HOOKS ****/
(function() {
/**** BEGIN OF THE HOOKS ****/

if (!WebAudio.canPlayOgg()) {
    SceneManager.stop();
    AudioManager.stopAll();
    // NOTE: Canvas doesn't initiated now.
    alert("Doesn't support on your browser!");
}

var _onload = window["onload"];
var _bindKeyEvents = function() {
    $(".control-key").on("touchstart", function(event) {
        event.srcElement.click();
        return false;
    });
};
var $vConsolse = new VConsole();

window.onload = function() {
    _bindKeyEvents.apply(this, arguments);
    if (typeof(_onload) === "function") {
        _onload.apply(this, arguments);
    }
};

AudioManager.audioFileExt = function() {
    return '.ogg'; // Only checking once.
};

Input.nameMapper = (function() {
    var nameMapper = {
        "f2": 113, // Show FPSMeter
        "f4": 115, // Switch FullScreen
        'C': 67,
        'Z': 90,
    };
    for (var code in Input.keyMapper) {
        nameMapper[Input.keyMapper[code]] = Number(code);
    }
    return nameMapper;
})();

Input._fireKeyDown = function(keyname) {
    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: keyname,
        keyCode: this.nameMapper[keyname],
    }));
};

Input._fireKeyUp = function(keyname) {
    document.dispatchEvent(new KeyboardEvent('keyup', {
        key: keyname,
        keyCode: this.nameMapper[keyname],
    }));
};

Input.fireKey = function(keyname) {
    this._fireKeyDown(keyname);
    // Ensure that keydown has been processed.
    setTimeout((function() {
        this._fireKeyUp(keyname);
    }).bind(this), 0);
};

document.addEventListener('keydown', function(event) {
    console.log("Key Down: " + event.key);
});

document.addEventListener('keyup', function(event) {
    console.log("Key Up: " + event.key);
});


Hooks = function() {
    throw new Error("This is a static class!");
};

Hooks.quickSave = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Save);
    }
    return false;
};

Hooks.quickLoad = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Load);
    }
    return false;
};

Hooks.dumpSave = function() {
    function dumpFile(filename, text) {
        var elem = document.createElement('a');
        elem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        elem.setAttribute('download', filename);

        elem.style.display = 'none';
        document.body.appendChild(elem);

        elem.click();
        document.body.removeChild(elem);
    }

    var i, k,
        buf = {};
    for (i = 0; i < localStorage.length; i++) {
        k = localStorage.key(i);
        buf[k] = localStorage.getItem(k);
    }

    dumpFile("rpg-saves.json", JSON.stringify(buf));
}

Hooks.loadDump = function() {
    function fetchFile() {
        return new Waiter(function (resolve) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "rpg-saves.json", true);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "text/plain");
            xhr.onload = function() {
                if (this.status === 200) {
                    resolve(this.response);
                }
            };
            xhr.send(null);
        });
    }

    fetchFile()
        .then(function(data) {
            var k,
                buf = data;
            // Apply saves.
            for (k in buf) {
                localStorage.setItem(k, buf[k]);
            }
        })
        .done();
}

/**** END OF THE HOOKS ****/
})();
/**** END OF THE HOOKS ****/
