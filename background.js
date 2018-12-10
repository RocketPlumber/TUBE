/*
Totally Unsuspicious Browser Extension

Art through browser plugins

Definitely doesn't want to know which social media sites you visit
Totally won't collect text to see what sort of personalities you enjoy

FEATURES:
    BOOKMARKS + BROWSER HISTORY to see which SNS you use, and tell you about the issue with privacy policies of these SNS
    TEXT ON PAGES -> Personality insights, to tell you about the kind of personalities you seem to agree with


Isn't going to collect all this data and write up a report that gets given to you after 48 hours of installing the extension

And TOTALLY isn't designed to make you more wary of the things you install onto your browser, as well as the sites you visit when using these browser plugins
*/

// Takes care of reading the history, to look for potential services that
// have inconsistencies in their EULAs. 


chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ "init_time": new Date().getTime() });
  chrome.storage.local.set({ "percount": 0 });
});

chrome.runtime.onStartup.addListener(function () {
  // TODO Look for local storage, and load from there
  let check_and_show_page = function (result) {
    let time = parseInt(result);
    if (time != NaN) {
      // Get number of seconds elapsed. Currently setting it for two hours
      if (Math.round(time / 1000) <= 7200) {
        chrome.tabs.create({
          active: true,
          url: chrome.runtime.getURL("frontend.html")
        }, function (tab) {
          if (tab.url == "frontend.html") {
            const facebook = document.getElementById("facebook");
            const instagram = document.getElementById("instagram");
            const snapchat = document.getElementById("snapchat");

            // Set display: none if not in browsing history
            const personalities = document.getElementById("personality");
            const b5_list = document.createElement("ul");
            personalities.after(b5_list);

            // TODO Add list items here. Something with appendChild, not sure

          }
        })
      }
    }
  } // placeholder. Put actual code into this function l8r

  chrome.storage.local.get(['init_time'], check_and_show_page(result));

  // TODO Restart timer, or keep track of time elapsed since install? NO. IT RUNS ONCE AND THEN YOU
  /*


   DIEDIED     DIEDIE  EDIEDIEDIED
   EDIEDIEDI   EDIEDI  IEDIEDIEDIED
   IEDIEDIEDI   EDIE   DIED    EDIE
   DIED   IEDI   EDI    DIE
    DIE   DIED  DIE     EDIEDI
    EDI    DIE   DIE    IEDIEDI
    IED   IEDI   ED     DIEDIED
   EDIE  EDIED   IE     EDI
  DIEDIEDIEDIE  EDIE    IEDI    DIE
  EDIEDIEDIED  DIEDIE  EDIEDIE IEDI
  IEDIEDIED    EDIEDIE IEDIEDIEDIED


  * */
  // ...
  //TODO: Die
});

chrome.runtime.onSuspend.addListener(function () {
  // TODO Save any data generated since last session
  // TODO Save session timer
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, Tab) {
  if (changeInfo.status === "complete" && changeInfo.url) {
    chrome.storage.local.get(['percount'], function (result) {
      if (result < 3) {
        const paragraphs = Array.prototype.slice
          .call(document.getElementsByTagName("p"))
          .map((data) => data.innerHTML).join(" ");
        const request = new XMLHttpRequest();
        request.open("POST", "https://gateway-syd.watsonplatform.net/personality-insights/api",
          true, "sb5455+watson@nyu.edu", "CoolCoolEvan42069");

        request.setRequestHeader("X-Watson-Learning-Opt-Out", true);
        request.setRequestHeader("Content-Type", "application/json;charset=utf-8");

        request.onreadystatechanged = function () {
          if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            let p_traits = JSON.parse(http.responseText).personality;
            p_traits.sort(objNameCompare(a, b));

            let stored_b5_traits = [];
            chrome.storage.local.get(["b5_traits"], function (result) {
              stored_b5_traits = JSON.parse(result);
            });


            if (!stored_b5_traits.length) {
              stored_b5_traits = p_traits;
            } else {
              stored_b5_traits.sort(objNameCompare(a, b));
              for (let i = 0; i < p_traits.length; i++) {
                if (stored_b5_traits[i].name === p_traits[i].name) {
                  stored_b5_traits[i].percentile += p_traits[i].percentile;
                }
              }
            }

            chrome.storage.local.set({ "b5_traits": stored_b5_traits });
          }
        };
        request.send(paragraphs);
        chrome.storage.local.set({ "percount": ++result });
      }
    }
    )
  }
});

function objNameCompare(a, b) {
  if (a.name > b.name)
    return 1;
  if (a.name < b.name)
    return -1;
  return 0;
}