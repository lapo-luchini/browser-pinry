// Show and save changes to browser extension settings.

const
    defaultURL = 'http://demo.getpinry.com/',
    url = document.getElementById('pinryUrl'),
    menu = document.getElementById('contextMenu'),
    re = /[/]+(static[/]js[/]bookmarklet[.]js)?$/;

function check() {
    const img = new Image(); // we can avoid extra permissions and CORS this way
    img.onload = function() { url.style.backgroundColor = '#9F9'; };
    img.onerror = function() { url.style.backgroundColor = '#F99'; };
    img.src = url.value + '/static/img/logo-dark.png';
}

function load() {
    chrome.storage.local.get(null, function (obj) {
        url.value = obj.pinryUrl || defaultURL;
        menu.checked = obj.contextMenu;
        check();
    });
}

function save() {
    url.value = url.value.trim().replace(re, '');
    check();
    const cfg = {
        pinryUrl: url.value,
        contextMenu: menu.checked,
    };
    chrome.storage.local.set(cfg, load);
    chrome.runtime.sendMessage(null, 'updateContextMenu');
    console.log('Saved:', cfg);
}

document.addEventListener('DOMContentLoaded', load);
url.addEventListener('change', save);
menu.addEventListener('change', save);
