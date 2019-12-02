// Show and save changes to browser extension settings.

const
    defaultURL = 'http://demo.getpinry.com/',
    url = document.getElementById('pinryUrl'),
    menu = document.getElementById('contextMenu'),
    re = /[/]+(static[/]js[/]bookmarklet[.]js)?$/;

function check() {
    // urlState.innerText = '(checking)';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url.value, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState < 4) return;
        const valid = xhr.responseText.indexOf('* Bookmarklet for Pinry') > 0;
        console.log(xhr.readyState, xhr.responseText.substring(0, 100));
        url.style.backgroundColor = valid ? '#9F9' : '#F99';
    };
    xhr.send();
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
