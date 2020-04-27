// Author: urain39
// FIXED: Mobile Devices Such As Android Cannot Run At Browser

/**** BEGIN OF THE HOOKS ****/
(function() {
/**** BEGIN OF THE HOOKS ****/

if (!WebAudio.canPlayOgg()) {
    SceneManager.stop();
    AudioManager.stopAll();
    // NOTE: Canvas doesn't initiated now.
    alert('Doesn\'t support on your browser!');
}

var _$getSaveFile = () => 'rpg-saves(' + $('title').text() + ').json';

$(window).on('load', function(event) {
    /*
     * For Debug.
     */

    var $vConsolse = new VConsole();

    $(document)
        .on('keydown', function(event) {
            console.log('Key Down: ' + event.key);
        })
        .on('keyup', function(event) {
            console.log('Key Up: ' + event.key);
        });

    /*
     * Functions Binding.
     */
    $('#ctrl-key-esc').on('click', function(event) {
        Hooks.fireKey('Escape'); return false;
    });
    $('#ctrl-key-ok').on('click', function(event) {
        Hooks.fireKey('Enter'); return false;
    });
    $('#ctrl-key-f2').on('click', function(event) {
        Hooks.fireKey('F2'); return false;
    });
    $('#ctrl-key-f4').on('click', function(event) {
        Hooks.fireKey('F4'); return false;
    });
    $('#action-quick-load').on('click', function(event) {
        Hooks.quickLoad(); return false;
    });
    $('#action-quick-save').on('click', function(event) {
        Hooks.quickSave(); return false;
    });
    $('#action-read-saves').on('click', function(event) {
        Hooks.readSaves(); return false;
    });
    $('#action-dump-saves').on('click', function(event) {
        Hooks.dumpSaves(); return false;
    });

    /*
     * Fix click on Mobile Devices.
     */
    $('.control-key').each(function (idx, elem) {
        $(elem).on('touchstart', function(event) {
            elem.click(); return false;
        });
    });

   /*
    * Support Long Press.
    */
    function _$(selector, keyName) {
        $(selector)
            .on('touchstart', function(event) {
                Hooks.fireKeyDown(keyName); return false;
            })
            .on('touchend', function(event) {
                Hooks.fireKeyUp(keyName); return false;
            });
    }
   /*
    * Mapings Binding.
    */
    _$('#ctrl-key-left', 'ArrowLeft');
    _$('#ctrl-key-right', 'ArrowRight');
    _$('#ctrl-key-up', 'ArrowUp');
    _$('#ctrl-key-down', 'ArrowDown');
});

AudioManager.audioFileExt = function() {
    return '.ogg'; // Only checking once.
};

Hooks = function() {
    throw new Error('This is a static class!');
};

Hooks.keyNameMapper = {
    'ArrowLeft' : 37,
    'ArrowUp'   : 38,
    'ArrowRight': 39,
    'ArrowDown' : 40,
    'PageDown'  : 33,
    'PageUp'    : 34,
    'Escape'    : 27,
    'Enter'     : 13,
    'F2'        : 113, // Show FPSMeter
    'F4'        : 115, // Switch FullScreen
};

Hooks.fireKeyDown = function(keyName) {
    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: keyName,
        keyCode: this.keyNameMapper[keyName],
    }));
};

Hooks.fireKeyUp = function(keyName) {
    document.dispatchEvent(new KeyboardEvent('keyup', {
        key: keyName,
        keyCode: this.keyNameMapper[keyName],
    }));
};

Hooks.fireKey = function(keyName) {
    this.fireKeyDown(keyName);

    var that = this;
    // Ensure that keydown has been processed
    setTimeout(function() {
        that.fireKeyUp(keyName);
    }, Input.keyRepeatWait + 1);
};

Hooks.quickLoad = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Load);
    }
};

Hooks.quickSave = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Save);
    }
};

Hooks.readSaves = function() {
    function fetchFile() {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', _$getSaveFile(), true);
            xhr.responseType = 'json';
            xhr.setRequestHeader('Content-Type', 'text/plain');
            xhr.onload = function() {
                if (this.status === 200) {
                    resolve(this.response);
                }
            };

            xhr.send(null);
        });
    }

    alert('WARNING: This operation will overwrite your current saves!');

    if (confirm('Are you sure you want to overwrite?')) {
        fetchFile()
            .then(function(data) {
                var k,
                    temp = data;
                // Apply saves.
                for (k in temp) {
                    localStorage.setItem(k, temp[k]);
                }
            })
            .then(function(data) {
                alert('Overwrited.');
            });

        return;
    }

    alert('Canceled.');
};

Hooks.dumpSaves = function() {
    function dumpSaveFile(filename, text) {
        var elem = document.createElement('a');
        elem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        elem.setAttribute('download', filename);

        elem.style.display = 'none';
        document.body.appendChild(elem);

        elem.click();
        document.body.removeChild(elem);
    }

    var i, k,
        temp = {};

    for (i = 0; i < localStorage.length; i++) {
        k = localStorage.key(i);
        temp[k] = localStorage.getItem(k);
    }

    dumpSaveFile(_$getSaveFile(), JSON.stringify(temp));
};

/**** END OF THE HOOKS ****/
})();
/**** END OF THE HOOKS ****/
