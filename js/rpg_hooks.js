// Author: urain39
// FIXED: Mobile Devices Such As Android Cannot Run At Browser

(function() {
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
})();

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
