// Show and save changes to browser extension settings.

var defaultURL = 'http://demo.getpinry.com/',
    input = document.getElementById('pinryUrl'),
    re = /[/]+(static[/]js[/]bookmarklet[.]js)?$/;

function load() {
    chrome.storage.local.get('pinryUrl', function (obj) {
        input.value = (obj.pinryUrl || defaultURL).replace(re, '');
    });
}

function save() {
  chrome.storage.local.set({ pinryUrl: input.value }, load);
}

input.addEventListener('change', save);
document.addEventListener('DOMContentLoaded', load);
