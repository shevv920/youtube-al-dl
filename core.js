

browser.contextMenus.create({
    id: "download-tracks",
    title: "download tracks"
  });

browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "download-tracks") {
    browser.tabs.executeScript({
      file: "downloader.js"
    });
  }
});
