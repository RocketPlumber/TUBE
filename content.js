chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("This is working!");
        if (request.text && (request.text == "dom")) {
            console.log("Got your stuff");
            sendResponse(document.body.innerHTML);
        } else if (request.text == "frontend") {
            sendResponse(document.body.innerHTML);
        }
    }
)