let downloading = false;
let alSubtitle = document.querySelector("#audio-library-content > div.audio-library-tab-subtitle");

let button       = document.createElement("div");
button.innerHTML = "Start downloading";
button.id        = "start-download-button";
button.style     = "border: 2px solid #e62117;background: aliceblue;cursor: pointer;padding: 3px; font-family: monospace;display:inline";
button.onclick   = () => toggleDownloading();
alSubtitle.appendChild(button);

let port = chrome.runtime.connect({name: "yald"}); 
port.onMessage.addListener(msg => {
  switch (msg) {
    case "started":
      downloading = true;
      button.innerHTML = "Stop downloading"; 
      break;
    case "stopped": 
      downloading = false;
      button.innerHTML = "Start download"; 
      break;
    default: 
      break;
  }
});

function getDownloadTargets() {
  Array.from(document.querySelectorAll(".audiolibrary-track-head"))
    .filter(elem => elem.children.length > 0)
    .map(elem => {
      const title = elem.querySelector(".audiolibrary-column-title").textContent;
      const url   = elem.querySelector(".audiolibrary-column-download > a").getAttribute("href");
      return {title: title, fileName : title + ".mp3", url: url};
    });
}

function toggleDownloading() { 
  if(downloading) 
    sendMessage("stop");    
  else 
    sendMessage("start", getDownloadTargets());        
}

function sendMessage(action, downloadTargets) { 
  port.postMessage({action: action, items: downloadTargets});
}
