chrome.action.onClicked.addListener(function (tab) {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['bookmarklet.js']
    });
});

function updateContextMenu() {
    chrome.storage.local.get('contextMenu', function (obj) {
        console.log('Context menu: ' + (obj.contextMenu ? 'enabled' : 'disabled'));
        chrome.contextMenus.removeAll();
        if (obj.contextMenu !== false) // Default to true if not set
            chrome.contextMenus.create({
                id: 'addToPinry',
                title: 'Add to Pinry',
                contexts: ['page', 'selection', 'link', 'editable', 'image', 'video', 'audio']
            });
    });
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === 'addToPinry') {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['bookmarklet.js']
        });
    }
});


updateContextMenu();
chrome.runtime.onMessage.addListener(updateContextMenu);