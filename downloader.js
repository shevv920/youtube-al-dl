//
let alSubtitle = document.querySelector("#audio-library-content > div.audio-library-tab-subtitle");

let button       = document.createElement("div");
button.innerHTML = "Start downloading";
button.id        = "start-download-button";
button.style     = "border: 2px solid #e62117;background: aliceblue;cursor: pointer;padding: 3px; font-family: monospace;display:inline";
button.onclick   = () => sendMessage();
alSubtitle.appendChild(button);

let port = chrome.runtime.connect({name: "yald"}); 

function sendMessage() {
    let tracks = Array.from(document.querySelectorAll(".audiolibrary-track-head")).filter(elem => elem.children.length > 0);

    let downloadTargets = tracks.map(elem => {
        const title = elem.querySelector(".audiolibrary-column-title").textContent;
        const url   = elem.querySelector(".audiolibrary-column-download > a").getAttribute("href");
        return {title: title, fileName : title + ".mp3", url: url};
    });

    port.postMessage({action: "start", items: downloadTargets});
}