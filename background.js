let currentId = undefined;
let port = undefined;
let downloadCancelled = false;
let downloadTargets = [];
chrome.downloads.onChanged.addListener(onChanged);

chrome.runtime.onConnect.addListener(p => {
  if(p.name === 'yald')
    port = p;
    port.onMessage.addListener(msg => {
      if (msg.action === "start" && msg.items) {
        downloadTargets = msg.items;
        downloadCancelled = false;
        downloadSequentially();
      } else if(msg.action === "stop")
        stopDownload();
    });
});

function sendMessage(msg) {
  if(port !== undefined) {
    port.postMessage({action: msg});
  }
}

function stopDownload() {
  if(currentId !== undefined) chrome.downloads.cancel(currentId);
  downloadCancelled = true;
}

function onChanged({id, state}) {
  if (id === currentId && state) {
    switch(state.current) {
      case 'complete':                           
        chrome.storage.local.set({[item.title]: "completed"}, () =>{
          if(downloadCancelled === true) {
            sendMessage("stopped");
           } else {
            downloadSequentially(downloadTargets);
           }
        });        
        break;
      case 'interrupted': 
        sendMessage("stopped");
        break;
      case 'in_progress': 
        break;
    }
  }
}

function downloadSequentially() {
  if(!downloadTargets) return;   
  item = downloadTargets.shift();
  chrome.storage.local.get([item.title], items => {
    if(items[item.title] !== "completed") {
      chrome.downloads.download({url: item.url, filename: item.fileName}, cId => { 
        sendMessage("started");
        currentId = cId;       
      });  
    } else {
      downloadSequentially(downloadTargets);
    }
  });     
}
