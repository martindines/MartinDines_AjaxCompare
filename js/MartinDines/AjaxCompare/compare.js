var MartinDines = MartinDines || {};

MartinDines.events = (function () {
    return {
        _listeners: {},

        addListener: function(type, listener) {
            if (typeof this._listeners[type] == "undefined") {
                this._listeners[type] = [];
            }

            this._listeners[type].push(listener);
        },

        fire: function(event) {
            if (typeof event == "string") {
                event = { type: event };
            }
            if (!event.target) {
                event.target = this;
            }

            if (!event.type) {
                throw new Error('Event object missing "type" property');
            }

            if (this._listeners[event.type] instanceof Array) {
                var listeners = this._listeners[event.type];
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].call(this, event);
                }
            }
        },

        removeListener: function(type, listener) {
            if (this._listeners[type] instanceof Array) {
                var listeners = this._listeners[type];
                for (var i = 0, len = listeners.length; i < len; i++) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
        }
    };
})(MartinDines.events || {});

MartinDines.utils = MartinDines.utils || {};

MartinDines.utils.XMLHttpRequest = (function() {
    var XMLHttpRequest;
    if (window.XMLHttpRequest) {
        XMLHttpRequest = new window.XMLHttpRequest;
    } else {
        try {
            XMLHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                XMLHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {}
        }
    }
    return XMLHttpRequest;
})(MartinDines.events.XMLHttpRequest || {});

var EventHandler = MartinDines.events;
console.log(EventHandler);
EventHandler.addListener('MartinDines_AjaxCompare_AddedToCompare', function() { console.log('test'); });
EventHandler.addListener('MartinDines_AjaxCompare_AddedToCompare', function() { console.log('tesst'); });

window.onload = function() {
    /*
        IE 7 & 8 do not support getElementsByClassName() .. Support those guys or not? TBD
     */
    var anchors = document.getElementsByTagName('a');
    for(var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        if ((/\blink-compare\b/).match(anchor.className)) {
            anchor.onclick = function() {
                var elem = this;
                var XHR = MartinDines.utils.XMLHttpRequest();

                XHR.open('POST', this.href, true);
                XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                XHR.send();

                console.log(elem.href);
                XHR.onreadystatechange = function() {
                    if (this.readyState == 2) { console.log('request made, headers available'); }
                    if (this.readyState == 3) { console.log('request in progress'); }
                    if (this.readyState == 4) {
                        // JSON is ie8+ .. check how magento handles responses and use their method
                        var XHRResponse = JSON.parse(this.responseText);

                        if (XHRResponse.success == true) {
                            MartinDines.events.fire('MartinDines_AjaxCompare_AddedToCompare');
                            console.log('aw yiss');
                        } else {
                            console.log('something went wrong');
                        }
                    }
                }

                // Do something with XHRResponse;
                /*
                var productComparePost = $.ajax(
                    {
                        url: settings.productCompareAddUrl,
                        data: { product: checkbox.value },
                        type: 'POST',
                        beforeSend: function(jqXHR) {
                            $.xhrPool.abortAll();
                            $.xhrPool.push(jqXHR);
                        },
                        complete: function(jqXHR) {
                            var index = $.xhrPool.indexOf(jqXHR);
                            if (index > -1) {
                                $.xhrPool.splice(index, 1);
                            }
                        }
                    }
                );*/

                return false;
            }
        }
    }
}