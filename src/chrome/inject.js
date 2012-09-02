chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        
        if (request.senderHash = "66d546") { // Make sure it is requested by Kifier. 
             if(request.kifierMethod == "getHTML"){ // Get the HTML
                var html = document.body.innerHTML;
                sendResponse({html : html,
                              kifierMethod: request.kifierMethod});
            } else if (request.kifierMethod == "getElementById") { // Get the content on an element
                var element = document.getElementById(request.elementId);
                var html = "";
                if (element) {
                    html = element.innerHTML;
                  }
                sendResponse({html : html,
                              kifierMethod: request.kifierMethod});
            }
         }
        
    }
);