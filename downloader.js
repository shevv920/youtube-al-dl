//
let alSubtitle = document.querySelector("#audio-library-content > div.audio-library-tab-subtitle");

let button = document.createElement("BUTTON");
button.innerHTML = "Start downloading";
button.setAttribute("id", "start-download-button");

let port = chrome.runtime.connect({name: "yald"});
 
let tracks = Array.from(document.querySelectorAll(".audiolibrary-track-head")).filter(elem => elem.children.length > 0);

let downloadTargets = tracks.map(function (elem) {
    const title = elem.querySelector(".audiolibrary-column-title").textContent;
    const url   = elem.querySelector(".audiolibrary-column-download > a").getAttribute("href");
    return {title: title, fileName : title + ".mp3", url: url};
});
button.onclick = () => sendMessage();

alSubtitle.appendChild(button);

function sendMessage() {
    let tracks = Array.from(document.querySelectorAll(".audiolibrary-track-head")).filter(elem => elem.children.length > 0);

    let downloadTargets = tracks.map(function (elem) {
        const title = elem.querySelector(".audiolibrary-column-title").textContent;
        const url   = elem.querySelector(".audiolibrary-column-download > a").getAttribute("href");
        return {title: title, fileName : title + ".mp3", url: url};
    });

    port.postMessage({action: "start", items: downloadTargets});
}