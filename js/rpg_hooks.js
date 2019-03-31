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
    var self = this;
    _bindKeyEvents.apply(self, arguments);
    if (typeof(_onload) === "function") {
        _onload.apply(self, arguments);
    }
};

AudioManager.audioFileExt = function() {
    return '.ogg'; // Only checking once.
};

Hooks = function() {
    throw new Error("This is a static class!");
};

Hooks.nameMapper = (function() {
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

Hooks.fireKeyDown = function(keyname) {
    var self = this;
    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: keyname,
        keyCode: self.nameMapper[keyname],
    }));
};

Hooks.fireKeyUp = function(keyname) {
    var self = this;
    document.dispatchEvent(new KeyboardEvent('keyup', {
        key: keyname,
        keyCode: self.nameMapper[keyname],
    }));
};

Hooks.fireKey = function(keyname) {
    var self = this;
    self.fireKeyDown(keyname);
    // Ensure that keydown has been processed
    setTimeout(function() {
        self.fireKeyUp(keyname);
    }, TouchInput.keyRepeatWait);
};

document.addEventListener('keydown', function(event) {
    console.log("Key Down: " + event.key);
});

document.addEventListener('keyup', function(event) {
    console.log("Key Up: " + event.key);
});

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

Hooks.dumpSaves = function() {
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

    return false;
}

Hooks.loadDumps = function() {
    function fetchFile() {
        return new Waiter(function (resolve) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "rpg-saves.json", true);
            xhr.responseType = "json";
            xhr.setRequestHeader("Content-Type", "text/plain");
            xhr.onload = function() {
                var self = this;
                if (self.status === 200) {
                    resolve(self.response);
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

    return false;
}

/**** END OF THE HOOKS ****/
})();
/**** END OF THE HOOKS ****/
