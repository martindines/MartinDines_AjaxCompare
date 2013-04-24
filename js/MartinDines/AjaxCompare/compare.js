/*
    namespace MartinDines
 */
var MartinDines = MartinDines || {};

/*
    namespace MartinDines.events

    I had an issue with sessions being locked when multiple ajax requests were sent. A work around has been written
    but ideally a queue system for events would be good
 */
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

/*
    namespace MartinDines.utils
 */
MartinDines.utils = MartinDines.utils || {};

MartinDines.utils.XMLHttpRequest = (function() {
    var XMLHttpRequest;
    if (window.XMLHttpRequest) {
        XMLHttpRequest = window.XMLHttpRequest;
    } else {
        try {
            XMLHttpRequest = ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                XMLHttpRequest = ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {}
        }
    }
    return XMLHttpRequest;
})(MartinDines.events.XMLHttpRequest || {});

/*
    namespace MartinDines.AjaxCompare
 */
MartinDines.AjaxCompare = (function() {
    var XHR_Handler, Event_Handler;
    var message_container_id = 'messages-container';
    var sidebar_compare_container_id = 'block-compare';
    var message_ajax_url = location.protocol + "//" + location.host + '/catalog/product_compare/get_messages';
    var sidebar_compare_ajax_url = location.protocol + "//" + location.host + '/catalog/product_compare/get_sidebar_compare';

    return {
        getXHRHandler: function() {
            return XHR_Handler;
        },

        setXHRHandler: function(handler) {
            XHR_Handler = handler;
        },

        getEventHandler: function() {
            return Event_Handler;
        },

        setEventHandler: function(handler) {
            Event_Handler = handler;
        },

        getMessageContainerElement: function() {
            return document.getElementById(message_container_id);
        },

        getSidebarCompareContainerElement: function() {
            return document.getElementById(sidebar_compare_container_id);
        },

        getMessages: function() {
            var XHR = new XHR_Handler;
            var Events = Event_Handler;
            var URL = message_ajax_url;

            XHR.open('GET', URL, true);
            XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            XHR.send();

            console.log(URL);
            XHR.onreadystatechange = function() {
                if (this.readyState == 2) { console.log('request made, headers available'); }
                if (this.readyState == 3) { console.log('request in progress'); }
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        var XHRReponse = this.responseText;
                        Events.fire({type: 'MartinDines_AjaxCompare_getMessages_Success', data: XHRReponse});
                    } else {
                        Events.fire('MartinDines_AjaxCompare_getMessages_Failure');
                    }
                }
            }
        },

        addProductToCompare: function() {
            var XHR = new XHR_Handler;
            var Events = Event_Handler;
            var element = this;

            XHR.open('POST', element.href, true);
            XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            XHR.send();

            console.log(element.href);
            XHR.onreadystatechange = function() {
                if (this.readyState == 2) { console.log('request made, headers available'); }
                if (this.readyState == 3) { console.log('request in progress'); }
                if (this.readyState == 4) {
                    // JSON is ie8+ .. check how magento handles responses and use their method
                    var XHRResponse = JSON.parse(this.responseText)
                    if ((this.status == 200) && (XHRResponse.success == true)) {
                        Events.fire({type: 'MartinDines_AjaxCompare_addProductToCompare_Success', data: XHRResponse});
                    } else {
                        Events.fire('MartinDines_AjaxCompare_addProductToCompare_Failure');
                    }
                }
            }
            return false;
        },

        getSidebarCompare: function() {
            var XHR = new XHR_Handler;
            var Events = Event_Handler;
            var URL = sidebar_compare_ajax_url;

            XHR.open('GET', URL, true);
            XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            XHR.send();

            console.log(URL);
            XHR.onreadystatechange = function() {
                if (this.readyState == 2) { console.log('request made, headers available'); }
                if (this.readyState == 3) { console.log('request in progress'); }
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        var XHRReponse = this.responseText;
                        Events.fire({type: 'MartinDines_AjaxCompare_getSidebarCompare_Success', data: XHRReponse});
                    } else {
                        Events.fire('MartinDines_AjaxCompare_ggetSidebarCompare_Failure');
                    }
                }
            }
        },

        init: function() {
            var Events = Event_Handler;
            var URL = sidebar_compare_ajax_url;
            var AjaxCompare = this;

            // When a product has been added to compare update messages via ajax
            Events.addListener('MartinDines_AjaxCompare_addProductToCompare_Success', function() {
                AjaxCompare.getMessages();
            });

            // When messages request returns data - update the html with data
            Events.addListener('MartinDines_AjaxCompare_getMessages_Success', function(event) {
                var messageHtml = event.data;
                console.log(event);
                if (messageHtml) {
                    var message_container = AjaxCompare.getMessageContainerElement();
                    message_container.innerHTML = messageHtml;
                }
            });

            // When messages request returns data - get sidebar compare data
            Events.addListener('MartinDines_AjaxCompare_getMessages_Success', function() {
                AjaxCompare.getSidebarCompare();
            });

            // When sidebar compare request returns data - update the html with data
            Events.addListener('MartinDines_AjaxCompare_getSidebarCompare_Success', function(event) {
                var blockHtml = event.data;
                console.log(event);
                if (blockHtml) {
                    var divs = document.getElementsByTagName('div');
                    for (var i = 0; i < divs.length; i++) {
                        var div = divs[i];
                        // @todo revisit because the below does not replace as expected
                        if ((/\bblock-compare\b/).match(div.className)) { // @todo AjaxCompare.getSidebarCompareContainerElement()
                            var responseContainer = document.createElement('div');
                            responseContainer.innerHTML = blockHtml;
                            div.innerHTML = blockHtml;
                            break;
                        }
                    }
                }
            });

            // @todo IE 7 & 8 do not support getElementsByClassName() .. Support those guys or not? TBD
            var anchors = document.getElementsByTagName('a');
            for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                if ((/\blink-compare\b/).match(anchor.className)) {
                    anchor.onclick = AjaxCompare.addProductToCompare;
                }
            }
        }
    };
})();

/*
    Document
 */
var EventHandler = MartinDines.events;
var XHRHandler = MartinDines.utils.XMLHttpRequest;

var AjaxCompare = MartinDines.AjaxCompare;
AjaxCompare.setEventHandler(EventHandler);
AjaxCompare.setXHRHandler(XHRHandler);

window.onload = function() {
    AjaxCompare.init();
}