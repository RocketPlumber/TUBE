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

var frontend = new RegExp("^.*/frontend\.html$");

function show_page_and_display() {
  chrome.tabs.create({
    active: true,
    url: chrome.runtime.getURL("frontend.html")
  }, function (tab) {
    // Set display: none if not in browsing history
    // const personalities = dom.getElementById("personality");
    // const b5_list = dom.createElement("ul");
    // personalities.after(b5_list);
    // console.log(personalities);


    // TODO Add list items here. Something with appendChild, not sure

  })
}

let check_and_show_page = function (result) {
  let time = parseInt(result);
  if (time != NaN) {

    if (Math.round(new Date().getTime() / 1000) - Math.round(time / 1000) >= 48 * 3600) {
      show_page_and_display();
    }
  }
};


chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ "init_time": new Date().getTime() });
  chrome.storage.local.set({ "percount": 0 });
});

chrome.runtime.onStartup.addListener(function () {
  // TODO Look for local storage, and load from there
  chrome.storage.local.get(['init_time'], check_and_show_page(result));
  // TODO Restart timer, or keep track of time elapsed since install? NO. IT RUNS ONCE AND THEN YOU
  // TODO: remove existential comments

});

chrome.runtime.onSuspend.addListener(function () {
  // STRETCH GOALS:
  // TODO Save any data generated since last session
  // TODO Save session timer
});

/* 
  Check what the tab is, and then delegate actions accordingly

*/
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" && tab.active) {
    if (frontend.test(tab.url)) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { text: "frontend" }, populate_frontend)});
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, talk_to_watson)
      });

    }
  }
});

/* 
  Show the front-end page after pressing the extension button
*/
chrome.browserAction.onClicked.addListener(function (activeTab) {
  show_page_and_display();
})

/* 
  talk_to_watson() tries to send the text from the page to Watson,
  and then add it to a local array of personality traits
*/
function talk_to_watson(dom) {
  chrome.storage.local.get(['percount'], function (result) {
    if (result < 3) {
      const paragraphs = Array.prototype.slice
        .call(dom.getElementsByTagName("p"))
        .map((data) => data.innerHTML).join(" ");
      const request = new XMLHttpRequest();
      request.open("POST", "https://gateway-syd.watsonplatform.net/personality-insights/api",
        true, "sb5455+watson@nyu.edu", "CoolCoolEvan42069");

      request.setRequestHeader("X-Watson-Learning-Opt-Out", true); // wouldn't be much of a privacy art-piece if we left this true
      request.setRequestHeader("Content-Type", "application/json;charset=utf-8");

      request.onreadystatechanged = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
          let p_traits = JSON.parse(http.responseText).personality;
          p_traits.sort();

          console.log(p_traits);

          let stored_b5_traits = [];
          chrome.storage.local.get(["b5_traits"], function (result) {
            stored_b5_traits = JSON.parse(result);
          });

          if (!stored_b5_traits.length) {
            stored_b5_traits = p_traits;
          } else {
            stored_b5_traits.sort();
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
};

/* 
  populate_frontend() gets the list of personality traits
  and appends them to the front-end
*/
function populate_frontend(dom) {
  var personalities = dom.getElementById("personalities");
  var error = dom.getElementById("error");
  b5_traits = [];
  chrome.storage.local.get(["b5_traits"], (result) => b5_traits = JSON.parse(result));
  if (b5_traits) {
    error.style.display = "none";

    var list = dom.createElement("ul");
    for (var trait in b5_traits) {
      var elem = dom.createElement("li");
      elem.innerText = trait.name + ": " + Math.round(parseFloat(trait.percentile) * 100) + " %";
      list.append(elem);
    }
  }

}