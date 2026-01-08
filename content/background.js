function executeBookmarklet(tab) {
    console.log('Execute bookmarklet on tab', tab.id)
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['bookmarklet.js'],
    })
}

chrome.action.onClicked.addListener(executeBookmarklet)

function updateContextMenu() {
    chrome.storage.local.get('contextMenu', (obj) => {
        console.log('Context menu: ' + (obj.contextMenu ? 'enabled' : 'disabled'))
        chrome.contextMenus.removeAll()
        if (obj.contextMenu)
            chrome.contextMenus.create({
                id: 'addToPinry',
                title: 'Add to Pinry',
                contexts: ['page', 'selection', 'link', 'editable', 'image', 'video', 'audio'],
            })
    })
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == 'addToPinry') executeBookmarklet(tab)
})

updateContextMenu()

// called on each change of options
chrome.runtime.onMessage.addListener(updateContextMenu)
