
chrome.runtime.onConnect.addListener(function(port) {
    if(port.name === 'yald') {
        port.onMessage.addListener(function(msg) {
        if (msg.action === "start" && msg.items)
        downloadSequentially(msg.items);
        });
    } 
  });


function downloadSequentially(downloadTargets) {
    if(!downloadTargets) return;   

    item = downloadTargets.shift();
    chrome.storage.local.get([item.title], items => {
        if(items[item.title] !== true) {
            chrome.downloads.download({url: item.url, filename: item.fileName}, currentId => { 
                function onChanged({id, state}) {
                    if (id === currentId && state) {
                        switch(state.current) {
                            case 'complete':
                                chrome.downloads.onChanged.removeListener(onChanged);                             
                                chrome.storage.local.set({[item.title]: true})
                                downloadSequentially(downloadTargets);
                                break;
                            case 'interrupted': 
                                chrome.downloads.resume(currentId); 
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
    } );
     
}
