// Takes care of reading the history, to look for potential services that
// have inconsistencies in their EULAs. 

chrome.runtime.onInstalled.addListener(function () {
	// TODO Start timer
});

chrome.runtime.onStartup.addListener(function () {
	// TODO Look for local storage, and load from there
	// TODO Restart timer, or keep track of time elapsed since install
});

chrome.runtime.onSuspend.addListener(function () {
	// TODO Save any data generated since last session
	// TODO Save session timer
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, Tab) {
	if (changeInfo.status === "complete" && changeInfo.url) {
		const paragraphs = Array.prototype.slice
			.call(document.getElementsByTagName("p"))
			.map((data) => data.innerHtml).join(" ");
		const request = XMLHttpRequest();
		const http = request.open("POST", "https://gateway-syd.watsonplatform.net/personality-insights/api",
			false,
			"sb5455+watson@nyu.edu",
			"CoolCoolEvan42069");

		http.setRequestHeader("X-Watson-Learning-Opt-Out", false);
		http.setRequestHeader("Content-Type", "application/json;charset=utf-8")

		http.onreadystatechanged = function () {
			if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
				chrome.storage.local.set({ "personalities": http.responseText });
			}
		}
		http.send(paragraphs);
	}
});