var MartinDines = MartinDines || {};

window.onload = function() {
    /*
        IE 7 & 8 do not support getElementsByClassName() .. Support those guys or not? TBD
     */
    var anchors = document.getElementsByTagName('a');
    for(var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        if ((/\blink-compare\b/).match(anchor.className)) {
            anchor.onclick = function() {
                console.log(anchor);
            }
        }
    }
}