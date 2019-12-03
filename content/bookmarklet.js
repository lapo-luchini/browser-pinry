void((function (d) {
    var prev = d.getElementById('pinry-bookmarklet');
    if (prev) // remove previous instance
        try {
            prev.remove();
            d.getElementById('pinry-images').remove();
        } finally {
            return;
        }
    // load new instance
    chrome.storage.local.get('pinryUrl', function (obj) {
        var s = d.createElement('script');
        s.id  = 'pinry-bookmarklet';
        s.src = obj.pinryUrl + '/static/js/bookmarklet.js?' + Math.random() * 10000000000000000;
        d.body.appendChild(s);
    });
})(document));
