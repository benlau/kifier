
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

/** Bind a button for link format conversion
 */

function button(name,linkCreator) {
	var div = $("<div>" + name + " <div>");

	$(div).addClass("button");

	$(div).click(function() {
		$(".button").removeClass("active");
		$(this).addClass("active");
		var a = linkCreator();
		$("#copydata").html(a);		
		copy($("#copydata").get(0));                    
	});

	$("#buttongroup").append(div);
	
	return div;
}

function link(tab){
	return "<a href='"+ tab.url +"'>" + tab.title + "</a>";
}

$(document).ready(function() {
	// The current tab
	var tab;

	button("Hyperlink",function(){
		return link(tab);
	}).addClass("active");

	button("HTML",function(){
		//return '&lt;a href="' + tab.url + '"&gt;' + table.html + 
		return '&lt;a href="' + tab.url + '"&gt;' + tab.title + '&lt;/a&gt;';
	});
    
    button("Two Lines",function() {
        return tab.title + "<br>" + tab.url; 
    });

    button("Markdown",function() {
		return '[' + tab.title + "](" + tab.url+ ")";
	});    

	button("Google Spreadsheet",function(){
		return '=hyperlink("'+ tab.url+ '","' + tab.title + '")';
	});
	
	
    chrome.windows.getCurrent(function(win) { 
    	chrome.tabs.query( {'windowId': win.id, 'active': true}, function(tabs){
    	    if (tabs && tabs.length > 0) { 
                tab = tabs[0];
                var a = link(tab);
                $("#copydata").html(a);
                copy($("#copydata").get(0));
            } 		
        }); 
    });

});
