void((function (d) {
    chrome.storage.local.get('pinryUrl', function (obj) {
        var s = d.createElement('script');
        s.id  = 'pinry-bookmarklet';
        s.src = obj.pinryUrl + '/static/js/bookmarklet.js?' + Math.random() * 10000000000000000;
        d.body.appendChild(s);
    });
})(document));
