// Author: urain39
// FIXED: Mobile Devices Such As Android Cannot Run At Browser

AudioManager.audioFileExt = function() {
    if (WebAudio.canPlayOgg()) {
        return '.ogg';
    } else {
        alert('Cannot run on your browser!');
    }
};

Input.nameMapper = (function() {
    var nameMapper = {};
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
    // Ensure that we run fireKeyUp at end.
    setTimeout((function() {
        this._fireKeyUp(keyname);
    }).bind(this), 0);
}

document.addEventListener('keydown', (event) => {
    console.log("KeyDown: " + event.key);
});

document.addEventListener('keyup', (event) => {
    console.log("KeyUp: " + event.key);
});
