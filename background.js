let currentId = undefined;
let port = undefined;
chrome.runtime.onConnect.addListener(p => {
  if(p.name === 'yald')
    port = p;
    port.onMessage.addListener(msg => {
      if (msg.action === "start" && msg.items)
        downloadSequentially(msg.items);
      else if(msg.action === "stop")
        stopDownload();
    });
});

function sendMessage(msg) {
  if(port !== undefined) {
    port.postMessage(msg);
  }
}

function stopDownload() {
  if(currentId !== undefined) chrome.downloads.cancel(currentId, () => sendMessage("stopped"));
}

function downloadSequentially(downloadTargets) {
  if(!downloadTargets) return;   

  item = downloadTargets.shift();
  chrome.storage.local.get([item.title], items => {
    if(items[item.title] !== "completed") {
      chrome.downloads.download({url: item.url, filename: item.fileName}, cId => { 
        sendMessage("started");
        currentId = cId;
        function onChanged({id, state}) {
          if (id === currentId && state) {
            switch(state.current) {
              case 'complete':
                chrome.downloads.onChanged.removeListener(onChanged);                             
                chrome.storage.local.set({[item.title]: "completed"})
                downloadSequentially(downloadTargets);
                break;
              case 'interrupted': 
                sendMessage("stopped");
                break;
              case 'in_progress': 
                break;
            }
          }
        }
        chrome.downloads.onChanged.addListener(onChanged)
      });  
    } else {
      downloadSequentially(downloadTargets);
    }
  });     
}
