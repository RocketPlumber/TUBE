// Takes care of reading the history, to look for potential services that
// have inconsistencies in their EULAs. 

chrome.runtime.onInstalled.addListener(function() {
	// TODO Show some initial startup message
	// TODO Scan through history looking for predefined pages
	// TODO Start timer
});

chrome.runtime.onStartup.addListener(function() {
	// TODO Look for local storage, and load from there
	// TODO Restart timer, or keep track of time elapsed since install
});

chrome.runtime.onSusped.addListener(function() {
	// TODO Save any data generated since last session
	// TODO Save session timer
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, Tab) {
	if (changeInfo.status === "complete") {
		// When a page loads, get all data in <p> tags (anything else we can do?)
	}	
});