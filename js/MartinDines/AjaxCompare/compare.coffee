###
@category    MartinDines
@package     MartinDines_AjaxCompare
@author      Martin Dines <martin.dines@live.co.uk>
###

#
#    namespace MartinDines
# 
MartinDines = MartinDines or {}

#
#    module MartinDines.events
#
#    I had an issue with sessions being locked when multiple ajax requests were sent. A work around has been written
#    but ideally a queue system for events would be good
# 
MartinDines.events = (->
  _listeners: {}
  addListener: (type, listener) ->
    @_listeners[type] = []  if typeof @_listeners[type] is "undefined"
    @_listeners[type].push listener

  fire: (event) ->
    event = type: event  if typeof event is "string"
    event.target = this  unless event.target
    throw new Error("Event object missing \"type\" property")  unless event.type
    if @_listeners[event.type] instanceof Array
      listeners = @_listeners[event.type]
      i = 0
      len = listeners.length

      while i < len
        listeners[i].call this, event
        i++

  removeListener: (type, listener) ->
    if @_listeners[type] instanceof Array
      listeners = @_listeners[type]
      i = 0
      len = listeners.length

      while i < len
        if listeners[i] is listener
          listeners.splice i, 1
          break
        i++
)(MartinDines.events or {})

#
#    namespace MartinDines.utils
# 
MartinDines.utils = MartinDines.utils or {}
MartinDines.utils.XMLHttpRequest = (->
  XMLHttpRequest = undefined
  if window.XMLHttpRequest
    XMLHttpRequest = window.XMLHttpRequest
  else
    try
      XMLHttpRequest = ActiveXObject("Msxml2.XMLHTTP")
    catch e
      try
        XMLHttpRequest = ActiveXObject("Microsoft.XMLHTTP")
  XMLHttpRequest
)(MartinDines.events.XMLHttpRequest or {})

#
#    module MartinDines.AjaxCompare
# 
MartinDines.AjaxCompare = (->
  XHR_Handler = undefined
  Event_Handler = undefined
  settings:
    message_ajax_url: location.protocol + "//" + location.host + "/catalog/product_compare/get_messages"
    sidebar_compare_ajax_url: location.protocol + "//" + location.host + "/catalog/product_compare/get_sidebar_compare"
    message_container_id: "messages-container"
    sidebar_compare_container_id: "compare-sidebar-container"

  getXHRHandler: ->
    XHR_Handler

  setXHRHandler: (handler) ->
    XHR_Handler = handler

  getEventHandler: ->
    Event_Handler

  setEventHandler: (handler) ->
    Event_Handler = handler

  getMessageContainerElement: ->
    document.getElementById @settings.message_container_id

  getSidebarCompareContainerElement: ->
    document.getElementById @settings.sidebar_compare_container_id

  getMessages: ->
    XHR = new XHR_Handler
    Events = Event_Handler
    URL = @settings.message_ajax_url
    XHR.open "GET", URL, true
    XHR.setRequestHeader "X-Requested-With", "XMLHttpRequest"
    XHR.send()
    console.log URL
    XHR.onreadystatechange = ->
      console.log "request made, headers available"  if @readyState is 2
      console.log "request in progress"  if @readyState is 3
      if @readyState is 4
        if @status is 200
          XHRReponse = @responseText
          Events.fire
            type: "MartinDines_AjaxCompare_getMessages_Success"
            data: XHRReponse

        else
          Events.fire "MartinDines_AjaxCompare_getMessages_Failure"

  addProductToCompare: ->
    XHR = new XHR_Handler
    Events = Event_Handler
    element = this
    XHR.open "POST", element.href, true
    XHR.setRequestHeader "X-Requested-With", "XMLHttpRequest"
    XHR.send()
    console.log element.href
    XHR.onreadystatechange = ->
      console.log "request made, headers available"  if @readyState is 2
      console.log "request in progress"  if @readyState is 3
      if @readyState is 4

        # JSON is ie8+ .. check how magento handles responses and use their method
        XHRResponse = JSON.parse(@responseText)
        if (@status is 200) and (XHRResponse.success is true)
          Events.fire
            type: "MartinDines_AjaxCompare_addProductToCompare_Success"
            data: XHRResponse

        else
          Events.fire "MartinDines_AjaxCompare_addProductToCompare_Failure"

    false

  removeProductFromCompare: ->
    XHR = new XHR_Handler
    Events = Event_Handler
    element = this
    XHR.open "POST", element.href, true
    XHR.setRequestHeader "X-Requested-With", "XMLHttpRequest"
    XHR.send()
    console.log element.href
    XHR.onreadystatechange = ->
      console.log "request made, headers available"  if @readyState is 2
      console.log "request in progress"  if @readyState is 3
      if @readyState is 4

        # JSON is ie8+ .. check how magento handles responses and use their method
        XHRResponse = JSON.parse(@responseText)
        if (@status is 200) and (XHRResponse.success is true)
          Events.fire
            type: "MartinDines_AjaxCompare_removeProductFromCompare_Success"
            data: XHRResponse

        else
          Events.fire "MartinDines_AjaxCompare_removeProductFromCompare_Failure"

    false

  removeAllProductsFromCompare: ->

    # @todo this is a straight up duplicate of removeProductFromCompare. I'm not sure how to alias it whilst keeping context of 'this'
    XHR = new XHR_Handler
    Events = Event_Handler
    element = this
    XHR.open "GET", element.href, true
    XHR.setRequestHeader "X-Requested-With", "XMLHttpRequest"
    XHR.send()
    console.log element.href
    XHR.onreadystatechange = ->
      console.log "request made, headers available"  if @readyState is 2
      console.log "request in progress"  if @readyState is 3
      if @readyState is 4

        # JSON is ie8+ .. check how magento handles responses and use their method
        XHRResponse = JSON.parse(@responseText)
        if (@status is 200) and (XHRResponse.success is true)
          Events.fire
            type: "MartinDines_AjaxCompare_removeAllProductsFromCompare_Success"
            data: XHRResponse

        else
          Events.fire "MartinDines_AjaxCompare_removeAllProductsFromCompare_Failure"

    false

  getSidebarCompare: ->
    XHR = new XHR_Handler
    Events = Event_Handler
    URL = @settings.sidebar_compare_ajax_url
    XHR.open "GET", URL, true
    XHR.setRequestHeader "X-Requested-With", "XMLHttpRequest"
    XHR.send()
    console.log URL
    XHR.onreadystatechange = ->
      console.log "request made, headers available"  if @readyState is 2
      console.log "request in progress"  if @readyState is 3
      if @readyState is 4
        if @status is 200
          XHRReponse = @responseText
          Events.fire
            type: "MartinDines_AjaxCompare_getSidebarCompare_Success"
            data: XHRReponse

        else
          Events.fire "MartinDines_AjaxCompare_getSidebarCompare_Failure"

  extendSettings: (options) ->
    for key of options
      @settings[key] = options[key]  if options.hasOwnProperty(key)

  addClickToAddAnchors: ->

    # @todo IE 7 & 8 do not support getElementsByClassName() .. Support those guys or not? TBD
    anchors = document.getElementsByTagName("a")
    i = 0

    while i < anchors.length
      anchor = anchors[i]
      anchor.onclick = AjaxCompare.addProductToCompare  if (/\blink-compare\b/).match(anchor.className)
      i++

  addAnchorsToSidebarCompare: ->
    sidebar_compare_container = AjaxCompare.getSidebarCompareContainerElement()
    if sidebar_compare_container
      anchors = sidebar_compare_container.getElementsByTagName("a")
      i = 0

      while i < anchors.length
        anchor = anchors[i]
        console.log anchor.className
        anchor.onclick = AjaxCompare.removeAllProductsFromCompare  if (/\bbtn-remove-all\b/).match(anchor.className)
        anchor.onclick = AjaxCompare.removeProductFromCompare  if (/\bbtn-remove\b/).match(anchor.className)
        i++

  addAnchorsToCompareTable: ->


    # @todo Would it be an improvement to rewrite current magento functionality on product_compare/index?
  init: (options) ->
    Events = Event_Handler
    AjaxCompare = this
    @extendSettings options

    # When a product has been added to compare update messages via ajax
    Events.addListener "MartinDines_AjaxCompare_addProductToCompare_Success", ->
      AjaxCompare.getMessages()


    # When a product has been removed from compare update messages via ajax
    Events.addListener "MartinDines_AjaxCompare_removeProductFromCompare_Success", ->
      AjaxCompare.getMessages()

    Events.addListener "MartinDines_AjaxCompare_removeAllProductsFromCompare_Success", ->
      AjaxCompare.getMessages()


    # When messages request returns data - update the html with data
    Events.addListener "MartinDines_AjaxCompare_getMessages_Success", (event) ->
      messageHtml = event.data
      console.log event
      if messageHtml
        message_container = AjaxCompare.getMessageContainerElement()
        message_container.innerHTML = messageHtml


    # When messages request returns data - get sidebar compare data
    # This may not be desirable as we might want to getMessages without reloading sidebar
    Events.addListener "MartinDines_AjaxCompare_getMessages_Success", ->
      AjaxCompare.getSidebarCompare()


    # When sidebar compare request returns data - update the html with data
    Events.addListener "MartinDines_AjaxCompare_getSidebarCompare_Success", (event) ->
      blockHtml = event.data
      console.log event
      if blockHtml
        sidebar_compare_container = AjaxCompare.getSidebarCompareContainerElement()
        if sidebar_compare_container
          responseContainer = document.createElement("div")
          responseContainer.innerHTML = blockHtml

          # Clear before we append elements
          sidebar_compare_container.innerHTML = ""

          # We're going to assume blockHtml contains a single node, which is block-compare div
          if blockNode = responseContainer.childNodes[0]
            j = 0

            while j < blockNode.childNodes.length
              childNode = blockNode.childNodes[j]
              sidebar_compare_container.appendChild childNode.cloneNode(true)
              j++

            # @todo Find solution: As cloneNode doesnt execute <script>s that it imports, we do it manually below
            decorateList "compare-items"

        # Reattach events to possible new items in compare
        AjaxCompare.addAnchorsToSidebarCompare()

    AjaxCompare.addClickToAddAnchors()
    AjaxCompare.addAnchorsToSidebarCompare()
    AjaxCompare.addAnchorsToCompareTable()
)()

#
#    Document
# 
EventHandler = MartinDines.events
XHRHandler = MartinDines.utils.XMLHttpRequest
AjaxCompare = MartinDines.AjaxCompare
AjaxCompare.setEventHandler EventHandler
AjaxCompare.setXHRHandler XHRHandler

# @todo Replace with a more reliable way of detecting finished DOM load
window.onload = ->
  AjaxCompare.init()