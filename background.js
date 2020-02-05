
chrome.runtime.onConnect.addListener(function(port) {
    if(port.name === 'yald') {
        port.onMessage.addListener(function(msg) {
        if (msg.action === "start" && msg.items)
            download(msg.items);
        });
    } 
  });


function download(downloadTargets) {
    if(!downloadTargets) return;   

    item = downloadTargets.shift();
    chrome.storage.local.get([item.title], items => {
        if(items[item.title] !== true) {
            chrome.downloads.download({url: item.url, filename: item.fileName}, id => { 
                const currentId = id;
                function onChanged({id, state}) {
                    if (id === currentId && state) {
                        switch(state.current) {
                            case 'complete':
                                chrome.downloads.onChanged.removeListener(onChanged);                             
                                chrome.storage.local.set({[item.title]: true})
                                download(downloadTargets);
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
            download(downloadTargets);
        }
    } );
     
}
