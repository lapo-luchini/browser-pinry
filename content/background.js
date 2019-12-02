chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, { file: 'bookmarklet.js' })
});

function updateContextMenu() {
    chrome.storage.local.get('contextMenu', function (obj) {
        console.log('Context menu: ' + (obj.contextMenu ? 'enabled' : 'disabled'));
        chrome.contextMenus.removeAll();
        if (obj.contextMenu)
            chrome.contextMenus.create({
                title: 'Add to Pinry',
                contexts: [ 'page', 'selection', 'link', 'editable', 'image', 'video', 'audio' ],
                onclick: function (info, tab) {
                    chrome.tabs.executeScript(tab.id, { file: 'bookmarklet.js' })
                }
            });
    });
}

updateContextMenu();
chrome.runtime.onMessage.addListener(updateContextMenu);
