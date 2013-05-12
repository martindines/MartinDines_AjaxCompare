/**
 * @category    MartinDines
 * @package     MartinDines_AjaxCompare
 * @author      Martin Dines <martin.dines@live.co.uk>
 */
/*
    namespace MartinDines
 */
var MartinDines = MartinDines || {};

/*
    module MartinDines.events

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
    module MartinDines.AjaxCompare
 */
MartinDines.AjaxCompare = (function() {
    var XHR_Handler, Event_Handler;

    return {
        settings: {
            message_ajax_url: location.protocol + "//" + location.host + '/catalog/product_compare/get_messages',
            sidebar_compare_ajax_url: location.protocol + "//" + location.host + '/catalog/product_compare/get_sidebar_compare',
            message_container_id: 'messages-container',
            sidebar_compare_container_id: 'compare-sidebar-container'
        },

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
            return document.getElementById(this.settings.message_container_id);
        },

        getSidebarCompareContainerElement: function() {
            return document.getElementById(this.settings.sidebar_compare_container_id);
        },

        getMessages: function() {
            var XHR = new XHR_Handler;
            var Events = Event_Handler;
            var URL = this.settings.message_ajax_url;

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
                    var XHRResponse = JSON.parse(this.responseText);
                    if ((this.status == 200) && (XHRResponse.success == true)) {
                        Events.fire({type: 'MartinDines_AjaxCompare_addProductToCompare_Success', data: XHRResponse});
                    } else {
                        Events.fire('MartinDines_AjaxCompare_addProductToCompare_Failure');
                    }
                }
            }
            return false;
        },

        removeProductFromCompare: function() {
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
                    var XHRResponse = JSON.parse(this.responseText);
                    if ((this.status == 200) && (XHRResponse.success == true)) {
                        Events.fire({type: 'MartinDines_AjaxCompare_removeProductFromCompare_Success', data: XHRResponse});
                    } else {
                        Events.fire('MartinDines_AjaxCompare_removeProductFromCompare_Failure');
                    }
                }
            }
            return false;
        },

        removeAllProductsFromCompare: function() {
            // @todo this is a straight up duplicate of removeProductFromCompare. I'm not sure how to alias it whilst keeping context of 'this'
            var XHR = new XHR_Handler;
            var Events = Event_Handler;
            var element = this;

            XHR.open('GET', element.href, true);
            XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            XHR.send();

            console.log(element.href);
            XHR.onreadystatechange = function() {
                if (this.readyState == 2) { console.log('request made, headers available'); }
                if (this.readyState == 3) { console.log('request in progress'); }
                if (this.readyState == 4) {
                    // JSON is ie8+ .. check how magento handles responses and use their method
                    var XHRResponse = JSON.parse(this.responseText);
                    if ((this.status == 200) && (XHRResponse.success == true)) {
                        Events.fire({type: 'MartinDines_AjaxCompare_removeAllProductsFromCompare_Success', data: XHRResponse});
                    } else {
                        Events.fire('MartinDines_AjaxCompare_removeAllProductsFromCompare_Failure');
                    }
                }
            }
            return false;
        },

        getSidebarCompare: function() {
            var XHR = new XHR_Handler;
            var Events = Event_Handler;
            var URL = this.settings.sidebar_compare_ajax_url;

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
                        Events.fire('MartinDines_AjaxCompare_getSidebarCompare_Failure');
                    }
                }
            }
        },

        extendSettings: function(options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    this.settings[key] = options[key];
                }
            }
        },

        addClickToAddAnchors: function() {
            // @todo IE 7 & 8 do not support getElementsByClassName() .. Support those guys or not? TBD
            var anchors = document.getElementsByTagName('a');
            for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                if ((/\blink-compare\b/).match(anchor.className)) {
                    anchor.onclick = AjaxCompare.addProductToCompare;
                }
            }
        },

        addAnchorsToSidebarCompare: function() {
            var sidebar_compare_container = AjaxCompare.getSidebarCompareContainerElement();
            if (sidebar_compare_container) {
                var anchors = sidebar_compare_container.getElementsByTagName('a');
                for (var i = 0; i < anchors.length; i++) {
                    var anchor = anchors[i];
                    console.log(anchor.className);
                    if ((/\bbtn-remove-all\b/).match(anchor.className)) {
                        anchor.onclick = AjaxCompare.removeAllProductsFromCompare;
                    }
                    if ((/\bbtn-remove\b/).match(anchor.className)) {
                        anchor.onclick = AjaxCompare.removeProductFromCompare;
                    }
                }
            }
        },

        addAnchorsToCompareTable: function() {
            // @todo Would it be an improvement to rewrite current magento functionality on product_compare/index?
        },

        init: function(options) {
            var Events = Event_Handler;
            var AjaxCompare = this;

            this.extendSettings(options);

            // When a product has been added to compare update messages via ajax
            Events.addListener('MartinDines_AjaxCompare_addProductToCompare_Success', function() {
                AjaxCompare.getMessages();
            });

            // When a product has been removed from compare update messages via ajax
            Events.addListener('MartinDines_AjaxCompare_removeProductFromCompare_Success', function() {
                AjaxCompare.getMessages();
            });

            Events.addListener('MartinDines_AjaxCompare_removeAllProductsFromCompare_Success', function() {
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
            // This may not be desirable as we might want to getMessages without reloading sidebar
            Events.addListener('MartinDines_AjaxCompare_getMessages_Success', function() {
                AjaxCompare.getSidebarCompare();
            });

            // When sidebar compare request returns data - update the html with data
            Events.addListener('MartinDines_AjaxCompare_getSidebarCompare_Success', function(event) {
                var blockHtml = event.data;
                console.log(event);
                if (blockHtml) {
                    var sidebar_compare_container = AjaxCompare.getSidebarCompareContainerElement();
                    if (sidebar_compare_container) {
                        var responseContainer = document.createElement('div');
                        responseContainer.innerHTML = blockHtml;

                        // Clear before we append elements
                        sidebar_compare_container.innerHTML = '';

                        // We're going to assume blockHtml contains a single node, which is block-compare div
                        if (blockNode = responseContainer.childNodes[0]) {
                            for (var j = 0; j < blockNode.childNodes.length; j++) {
                                var childNode = blockNode.childNodes[j];
                                sidebar_compare_container.appendChild(childNode.cloneNode(true));
                            }
                            // @todo Find solution: As cloneNode doesnt execute <script>s that it imports, we do it manually below
                            decorateList('compare-items');
                        }
                    }
                    // Reattach events to possible new items in compare
                    AjaxCompare.addAnchorsToSidebarCompare();
                }
            });

            AjaxCompare.addClickToAddAnchors();
            AjaxCompare.addAnchorsToSidebarCompare();
            AjaxCompare.addAnchorsToCompareTable();
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

// @todo Replace with a more reliable way of detecting finished DOM load
window.onload = function() {
    AjaxCompare.init();
}