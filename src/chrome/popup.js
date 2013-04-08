
var ContentDocument = {
    tab : undefined,
    init : function(tab){
        this.tab = tab;
     },
    getElementById : function(elementId,callback){
        chrome.tabs.sendRequest(this.tab.id, 
                                    {
                                 senderHash : "66d546",
                                 kifierMethod: "getElementById",
                                 elementId: elementId
                                    }, 
                                function(response) {
            var html = undefined;

            if (response)
                html = response.html;
            if (html == undefined)
                html = "";
            callback(html);
         });
     }
        
};

var LinkCreator = {
     hooks : [],   
    
    /** Create link text from tab
     * 
     * @param tab
     * @return A string of the link representation
     */

    create : function(tab,win,callback) {
        var info = {
            title : tab.title,
            url : tab.url 
         };
        
        var callbacks = [];
        var count = 0;
        
        $.each(this.hooks,function(idx,hook){
           if (tab.url.match(hook.pattern)) {
               callbacks.push(hook.callback);
               count++;
            }
         });

       function last(){
           var a = "<a href='"+ info.url +"'>" + info.title + "</a>";
           if (callback)
               callback(a);         
        }

        
        if (count > 0) {
            var deferreds = [];
             $.each(callbacks ,function(idx, callback){
                 var ret = callback(info);
                 if (ret != undefined)
                     deferreds.push(ret);
               });
             
             $.when.apply($,deferreds).done(last);
             
         } else {
             last();
          }       
    },
    
    /** Register a hook function for link creation.
     * 
     * @param callback
     */
    
    hook : function(pattern,callback) {
        this.hooks.push({pattern : pattern ,callback:callback});
    }
};

/** Hook for Evernote
 * 
 */
function evernoteHook(info) {
    var dtd = $.Deferred();
    
    ContentDocument.getElementById("gwt-debug-noteTitle",function(html){
        console.log("gwt-debug-noteTitle",html);
        if (html != "") {
            info.title = html;
         }
        dtd.resolve();
    });
    
    return dtd;
}

LinkCreator.hook(/^https*:\/\/[a-z]*\.evernote.com\/Home.action/,evernoteHook);

/** Select and copy the node content to clipboard
 * 
 * @param node
 */

function copy(node) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    
    document.execCommand('copy');
}

function button(id,linkCreator) {

	$(id).click(function() {
		$(".button").removeClass("active");
		$(this).addClass("active");
		var a = linkCreator();
		$("#copydata").html(a);		
		copy($("#copydata").get(0));                    
	});
	
}

$(document).ready(function() {
	
	// The current tab
	var tab;
	var buttons = ["#hyperlink","#gspreadsheet"]

	button("#hyperlink",function(){
		return "<a href='"+ tab.url +"'>" + tab.title + "</a>";
	});

	button("#gspreadsheet",function(){
		return '=hyperlink("'+ tab.url+ '","' + tab.title + '")';
	});
	
    chrome.windows.getCurrent(function(win) { 
    	chrome.tabs.query( {'windowId': win.id, 'active': true}, function(tabs){
    	    if (tabs && tabs.length > 0) { 
                tab = tabs[0];
                ContentDocument.init(tab);
                LinkCreator.create(tab,win,function(a) {
                    $("#copydata").html(a);
                    
                    copy($("#copydata").get(0));                    
                  });
            } 		
        }); 
    });
	
	
});
