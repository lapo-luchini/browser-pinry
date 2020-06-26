// Show and save changes to browser extension settings.

const
    defaultURL = 'http://demo.getpinry.com/',
    url = document.getElementById('pinryUrl'),
    menu = document.getElementById('contextMenu'),
    re = /[/]+(static[/]js[/]bookmarklet[.]js)?$/;

function checkIMG(url) {
    return new Promise((resolve, reject) => {
        // we can avoid extra permissions and CORS this way
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
    });
}

function check() {
    const img1 = checkIMG(url.value + '/static/img/logo-dark.png'); // Pinry pre-SPA
    const img2 = checkIMG(url.value + '/img/icons/android-chrome-192x192.png'); // Pinry SPA
    img1.catch(() => img2 // waiting for Promise.any: https://github.com/tc39/proposal-promise-any
    ).then(() => { url.style.backgroundColor = '#9F9' }
    ).catch(() => { url.style.backgroundColor = '#F99' });
}

function load() {
    chrome.storage.local.get(null, function (obj) {
        url.value = obj.pinryUrl || defaultURL;
        menu.checked = (obj.contextMenu === false) ? false : true; // default true
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
