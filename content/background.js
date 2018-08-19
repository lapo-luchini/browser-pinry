chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, { file: 'bookmarklet.js' })
});

chrome.contextMenus.create(
    {
      "title": "Run Pinry",
      "contexts": [
        "page","selection","link","editable","image","video", "audio"
      ],
      "onclick": function (info, tab) {
         chrome.tabs.executeScript(tab.id, { file: 'bookmarklet.js' })
      }
    }
);
