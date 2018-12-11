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
            // `return false;` is same as `event.stopPropagation()`.
            event.srcElement.click(); return false;
        });
    }

    window.onload = function() {
        _bindKeyEvents();
        if (typeof(_onload) === "function") {
            _onload();
        }
        GameController.init();
    }
})();

AudioManager.audioFileExt = function() {
    return '.ogg'; // Checking on one time only.
};

Input.nameMapper = (function() {
    var nameMapper = {
        "f2": 113, // Show FPSMeter
        "f4": 115, // Switch FullScreen
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
}

Input._fireKeyUp = function(keyname) {
    document.dispatchEvent(new KeyboardEvent('keyup', {
        key: keyname,
        keyCode: this.nameMapper[keyname],
    }));
}

Input.fireKey = function(keyname) {
    this._fireKeyDown(keyname);
    // Ensure that we run at end.
    setTimeout((function() {
        this._fireKeyUp(keyname);
    }).bind(this), 0);
}

document.addEventListener('keydown', function(event) {
    console.log("Key Down: " + event.key);
});

document.addEventListener('keyup', function(event) {
    console.log("Key Up: " + event.key);
});
