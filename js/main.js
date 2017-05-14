
function useAppScript() {
    USE_PROXY = true;
}

function notUseAppScript() {
    USE_PROXY = false;
}

function trelloAuthorize(done, fail) {
    if (USE_PROXY) {
        done();
    } else {
    	warningAlert("<strong>Warning: </strong>Authorize Failed.<br>" +
            "Please get the authorization in the popup.");
        trelloAuthorize2(
            function() {
                $("#alert-box").addClass("hidden");
                $("#alert-box").removeClass("alert-warning");
                done();
            },
            function() {
                $('#loader').remove();
                failAlert("<strong>錯誤: </strong>Authorize Failed.");
                fail();
            }
        );
    }
}

function trelloAuthorize2(done, fail) {
	Trello.authorize({
        type: "popup",
        name: "81st HKG QM",
        scope: {
            read: true,
            write: true },
        //expiration: "never",
        expiration: "30days",
        success: function() {
        	done();
        },
        error: function() {
        	fail();
        }
    });
}

function trelloGet(url, done, fail) {
    if (USE_PROXY) {
        $.get(APPSCRIPT_URL, {
            "trello_url": url,
            "method": "get"
        })
        .done( function(data) {
            if (data.hasAccess === false) {
                $('#loader').remove();
                failAlert("<strong>錯誤: </strong>Authorize Failed.<br>" +
                    "Please get the authorization <a href='"+data.authorizationUrl+"' target='_blank'>here</a> and then re-run this page.");
            } else {
                done(data);
            }
        })
        .fail(fail);
    } else {
        Trello.get(url, done, fail);
    }
}

function trelloPost(url, data, done, fail) {
    if (USE_PROXY) {
        $.get(APPSCRIPT_URL, {
            "trello_url": url,
            "method": "post",
            "data": JSON.stringify(data)
        })
        .done(done)
        .fail(fail);
    } else {
       Trello.post(url, data, done, fail);
    }
}

function trelloPut(url, data, done, fail) {
    if (USE_PROXY) {
        $.get(APPSCRIPT_URL, {
            "trello_url": url,
            "method": "put",
            "data": JSON.stringify(data)
        })
        .done(done)
        .fail(fail);
    } else {
       Trello.put(url, data, done, fail);
    }
}

function trelloDelete(url, done, fail) {
    if (USE_PROXY) {
        $.get(APPSCRIPT_URL, {
            "trello_url": url,
            "method": "delete"
        })
        .done(done)
        .fail(fail);
    } else {
       Trello.del(url, done, fail);
    }
}

function sendEmail(to, cc, subject, message, done, fail) {
    $.get(APPSCRIPT_URL, {
        "method": "email",
        "to": to,
        "cc": cc,
        "subject": subject,
        "message": message
    })
    .done(done)
    .fail(fail);
}

function successAlert(msg) {
    $("#alert-box").removeClass("hidden");
    $("#alert-box")
    	.addClass("alert-success")
    	.removeClass("alert-danger")
    	.removeClass("alert-warning");
    $("#alert-msg").html(msg);
}

function failAlert(msg) {
    console.log("FAIL - " + msg);
    $("#alert-box").removeClass("hidden");
    $("#alert-box")
    	.addClass("alert-danger")
    	.removeClass("alert-success")
    	.removeClass("alert-warning");
    $("#alert-msg").html(msg);
}

function warningAlert(msg) {
    $("#alert-box").removeClass("hidden");
    $("#alert-box")
    	.addClass("alert-warning")
    	.removeClass("alert-danger")
    	.removeClass("alert-success");
    $("#alert-msg").html(msg);
}

$.wait = function(milliseconds, callback){
    return window.setTimeout(callback, milliseconds);
}

function hasLabel(card, Label) {
    for (var i = 0; i < card.labels.length; i++) {
        if (card.labels[i].id == Label)
            return true;
    }
    return false;
}

function isBorrowed(card) {
    if (card.idList == List.cupboardA ||
        card.idList == List.cupboardB ||
        card.idList == List.cupboardC ||
        card.idList == List.cupboardOut ||
        card.idList == List.drying ||
        card.idList == List.repair) {
        return false;
    }
    return true;
}

function getItemLabelSeq(card) {
    if (hasLabel(card, Label.tent))
        return 1;
    else if (hasLabel(card, Label.yurt))
        return 2;
    else if (hasLabel(card, Label.tentpeg))
        return 3;
    else if (hasLabel(card, Label.fly))
        return 4;
    else if (hasLabel(card, Label.cookset))
        return 5;
    else if (hasLabel(card, Label.stove))
        return 6;
    else if (hasLabel(card, Label.other))
        return 7;
    else
        return 99;
}

function urlParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var username = '';

function checkLogin(){
	if (isLogin()) {
        trelloGet('/member/me',
            function(data) {
                $('.user-box').removeClass('hidden');
                username = data.fullName;
                $('#user-id').html(username);
                $('#admin-nav').removeClass('hidden');
            },
            function(data) {
                console.log('get login info fail: '+JSON.stringify(data));
                if (data.responseText == "invalid token")
	            	logout();
            }
        );
    }
	// For Testing
	else if (window.location.href.substring(0,4) == 'file') {
		$('.user-box').removeClass('hidden');
        $('#user-id').html('Testing');
	}
}

function isLogin() {
	 if (localStorage.trelloLogin === undefined || localStorage.tokenExpire === undefined || localStorage.trello_token === undefined) {
		 return false;
	 }
	 
	 if (localStorage.trelloLogin != 'Y') {
		 logout();
		 return false;
	 }
	
	 var d = localStorage.tokenExpire.split("/");
     if (d.length != 3) {
    	 //console.log("Invalid Expire Date");
    	 logout();
    	 return false; 
     }
     
     var now = new Date();
     var expireDt = new Date(d[2], d[1]-1, d[0]);
     
     if (expireDt > now) {
         return true;
     } else {
    	 //console.log("Token Expired");
    	 logout();
    	 return false;
     }
}

function login() {
	var d = new Date();
    d.setDate(d.getDate() + 30); 
    var m = d.getMonth()+1;
    localStorage.tokenExpire = d.getDate() + "/" + m + "/" + d.getFullYear();
	localStorage.trelloLogin = 'Y';
}

function logout() {
	localStorage.removeItem('trelloLogin');
    localStorage.removeItem('trello_token');
    localStorage.removeItem('tokenExpire');
}

// Additional Data is stored in Description
// wrapping by three backticks (```) at the end
// in JSON format
function getAdditionalData(card) {
	var desc = card.desc;
    var array = desc.split('```');
    if (array.length >= 2) {
    	return JSON.parse(array[1]);
    }
    return {};
}

function getDesc(card) {
	var desc = card.desc;
    var array = desc.split('```');
    if (array.length >= 1) {
    	return array[0];
    }
    return '';
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function dateFormat(date) {
    return date.getFullYear()+'-'+leadingZero(date.getMonth()+1)+'-'+leadingZero(date.getDate())+' '
        +leadingZero(date.getHours())+':'+leadingZero(date.getMinutes())+':'+leadingZero(date.getSeconds());
}

function dateFormat_ymd(date) {
    return date.getFullYear()+'-'+leadingZero(date.getMonth()+1)+'-'+leadingZero(date.getDate());
}

function leadingZero(n) {
    var paddingValue = '00';
    return String(paddingValue + n).slice(-paddingValue.length);
};

// Custom url replacement function
function cardUrlReplace(autolinker, match, cards) {
    switch( match.getType() ) {
        case 'url' :
            var anchorText = match.getAnchorText().split('/');
            if (anchorText[0] == 'trello.com' && anchorText[1] == 'c') {
                //return '<a href="'+match.getUrl()+'">'+getCardNameByUrl(cards, match.getUrl())+'</a>';
                return '<a href="javascript: $(\'#'+anchorText[2]+'\').triggerHandler(\'click\');">'+getCardNameByShortLink(cards, anchorText[2])+'</a>';
            } else {
                return true;
            }

        case 'email' :
            return true;

        case 'phone' :
            return true;

        case 'twitter' :
            return true;

        case 'hashtag' :
            return true;
    }
}

// Custom url replacement function
function cardUrlToName(autolinker, match, cards) {
    switch( match.getType() ) {
        case 'url' :
            var anchorText = match.getAnchorText().split('/');
            if (anchorText[0] == 'trello.com' && anchorText[1] == 'c') {
                return getCardNameByShortLink(cards, anchorText[2]);
            } else {
                return true;
            }

        case 'email' :
            return true;

        case 'phone' :
            return true;

        case 'twitter' :
            return true;

        case 'hashtag' :
            return true;
    }
}

// Custom url remove function
function cardUrlRemove(autolinker, match, cards) {
    switch( match.getType() ) {
        case 'url' :
            var anchorText = match.getAnchorText().split('/');
            if (anchorText[0] == 'trello.com' && anchorText[1] == 'c') {
                return '';
            } else {
                return true;
            }

        case 'email' :
            return true;

        case 'phone' :
            return true;

        case 'twitter' :
            return true;

        case 'hashtag' :
            return true;
    }
}

function getCardNameByUrl(cards, url) {
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].url == url) {
            return cards[i].name;
        }
    }
    return url;
}

function getCardNameByShortLink(cards, shortLink) {
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].shortLink == shortLink) {
            return cards[i].name;
        }
    }
    return url;
}

function getCardByUrl(cards, url) {
	url = url.substring(8); // Trim "https://"
	var anchorText = url.split('/');
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].shortLink == anchorText[2]) {
            return cards[i];
        }
    }
    return null;
}

function getListNameById(lists, id) {
    for (var i = 0; i < lists.length; i++) {
        if (lists[i].id == id) {
            return lists[i].name;
        }
    }
    return id;
};

function getLateItems(cards) {
    // Find out late items
    var lateCardUrls = [];
    $.each(cards, function(index, card) {
        var dueDt = null;
        if (card.due != null)
            dueDt = new Date(card.due);

        if ( (hasLabel(card, Label.borrowRec) || hasLabel(card, Label.repairRec)) &&
                card.idList != List.pending && card.idList != List.completed &&
                dueDt != null && dueDt < new Date() &&
                card.badges.checkItemsChecked < card.badges.checkItems
                ) {
            if (card.checklists.length > 0) {
                for (var i = 0; i < card.checklists[0].checkItems.length; i++) {
                    if (card.checklists[0].checkItems[i].state == 'incomplete') {
                        lateCardUrls.push(card.checklists[0].checkItems[i].name);
                    }
                }
            }
        }
    });
    return lateCardUrls;
}

function getBorrowDate(card) {
    //return card.name.substring(0, 10);
    var str = card.name;
    str = str.replace(/\] \[/g, '|');
    str = str.replace(/\[/g, '');
    str = str.replace(/\]/g, '');
    var array = str.split('|');
    if (array.length >= 1)
        return array[0];
    else
        return null;
}

function getActivity(card) {
    //return card.name.substring(12, card.name.length-1);
    var str = card.name;
    str = str.replace(/\] \[/g, '|');
    str = str.replace(/\[/g, '');
    str = str.replace(/\]/g, '');
    var array = str.split('|');
    if (array.length >= 2)
        return array[1];
    else
        return null;
}

function getApplicant(card) {
    var str = card.name;
    str = str.replace(/\] \[/g, '|');
    str = str.replace(/\[/g, '');
    str = str.replace(/\]/g, '');
    var array = str.split('|');
    if (array.length >= 3)
        return array[2];
    else
        return null;
}

//Sort by status, due date, id
function itemCompare(a, b) {
	var order_a = (typeof a.custom === "undefined" || typeof a.custom.order === "undefined" ? 0 : a.custom.order);
    var order_b = (typeof a.custom === "undefined" || typeof b.custom.order === "undefined" ? 0 : b.custom.order);
    var due_a = new Date(a.due);
    var due_b = new Date(b.due);
    
    if (order_a == order_b) {
        if (due_a == due_b) {
            return b.id.localeCompare(a.id);
        } else if (due_b < due_a) {
            return -1;
        } else { 
            return 1;
        }
    } else if (order_a < order_b) {
        return -1;
    } else {
        return 1;
    }   
}

function initRequest(request) {
	request.custom = {}; // To store custom varables
	
	 var dueDt = null;
     if (request.due != null) {
         dueDt = new Date(request.due);
         dueDt = new Date(dueDt.getFullYear(), dueDt.getMonth(), dueDt.getDate());
     }
     
     var currDt = new Date(); 
     currDt = new Date(currDt.getFullYear(), currDt.getMonth(), currDt.getDate());
     
     // Check request status
     var pending = (request.idList == List.pending);
     var borrowProcess = hasLabel(request, Label.borrowProcess);
     var overdue = (!pending && !borrowProcess && dueDt != null && dueDt < currDt && request.badges.checkItemsChecked < request.badges.checkItems);
     var active = (hasLabel(request, Label.active) && !overdue);
     var completed = (request.idList == List.completed);
     
     var borrowDt = getBorrowDate(request);
     var activity = getActivity(request);
     var applicant = getApplicant(request);
     
     request.custom.dueDt = dateFormat_ymd(dueDt);
     request.custom.pending = pending;
     request.custom.completed = completed;
     request.custom.overdue = overdue;
     request.custom.active = active;
     request.custom.borrowProcess = borrowProcess;
     request.custom.borrowDt = borrowDt;
     request.custom.activity = activity;
     request.custom.applicant = applicant;
     request.custom.location = request.custom.activity + ' (' + request.custom.applicant + ')';
     request.custom.checkedItemCount = request.badges.checkItemsChecked;
     request.custom.itemCount = request.badges.checkItems;
}

function initItem(item) {
	
}

function loadQM(done, fail) {
	var QM = {
		lists: {},
		listsArray: [],
		requests: {},
		requestsArray: [],
		items: {},
		itemsArray: [],
	};
	
	var trello_CardsData = null;
	var trello_ListsData = null;
	
	var cardsData_isDone = false;
	var listsData_isDone = false;
	
	// Check Authorize
	trelloAuthorize(function() {
		
		// Get Cards Data
		trelloGet('/boards/'+Board+'/cards?checklists=all&actions=updateCheckItemStateOnCard&attachments=cover',
	        function(data) {
				trello_CardsData = data;
				cardsData_isDone = true;
				if (cardsData_isDone && listsData_isDone) {
					doLoadQM(QM, trello_CardsData, trello_ListsData);
					done(QM);
				}
			},
	        function(data) {
				$('#loader').remove();
                failAlert("<strong>錯誤: </strong>請聯絡物資管理員。");
	            console.log("Get Cards Data Fail: "+JSON.stringify(data));
	            if (data.responseText == "invalid token") {
	            	logout();
	            	location.reload();
	            }
	            fail();
	        }
	    );
		
		// Get Lists Data
		trelloGet('/boards/'+Board+'/lists',
	        function(data) {
				trello_ListsData = data;
				listsData_isDone = true;
				if (cardsData_isDone && listsData_isDone) {
					doLoadQM(QM, trello_CardsData, trello_ListsData);
					done(QM);
				}
			},
	        function(data) {
				$('#loader').remove();
                failAlert("<strong>錯誤: </strong>請聯絡物資管理員。");
	            console.log("Get Lists Data Fail: "+JSON.stringify(data));
	            if (data.responseText == "invalid token") {
	            	logout();
	            	location.reload();
	            }
	            fail();
	        }
	    );
	});
}

function doLoadQM(QM, trello_CardsData, trello_ListsData) {
	
	$.each(trello_ListsData, function(index, list) {
		QM.lists[list.id] = list;
		QM.listsArray.push(list);
    });
	
	$.each(trello_CardsData, function(index, card) {
		if ( hasLabel(card, Label.borrowRec) || hasLabel(card, Label.repairRec) ) {
			QM.requests[card.shortLink] = card;
			QM.requestsArray.push(card);
		} else {
			QM.items[card.shortLink] = card;
			QM.itemsArray.push(card);
		}
    });
	
	// -------------------------------------------------------------------
	// Requests
	// -------------------------------------------------------------------
	$.each(QM.requestsArray, function(index, request) {
		request.custom = {}; // To store custom varables
		
		var dueDt = null;
	    if (request.due != null) {
	    	dueDt = new Date(request.due);
	    	dueDt = new Date(dueDt.getFullYear(), dueDt.getMonth(), dueDt.getDate());
	    }
	     
	    var currDt = new Date(); 
	    currDt = new Date(currDt.getFullYear(), currDt.getMonth(), currDt.getDate());
	    
	    // Request status
	    request.custom.pending = (request.idList == List.pending);
	    request.custom.borrowProcess = hasLabel(request, Label.borrowProcess);
	    request.custom.overdue = (!request.custom.pending && !request.custom.borrowProcess && dueDt != null && dueDt < currDt && request.badges.checkItemsChecked < request.badges.checkItems);
	    request.custom.active = (hasLabel(request, Label.active) && !request.custom.overdue);
	    request.custom.completed = (request.idList == List.completed);
	    
	    request.custom.borrowDt = getBorrowDate(request);
	    request.custom.activity = getActivity(request);
	    request.custom.applicant = getApplicant(request);
	    request.custom.dueDt = dateFormat_ymd(dueDt);
	    request.custom.location = request.custom.activity + ' (' + request.custom.applicant + ')';
	    request.custom.checkedItemCount = request.badges.checkItemsChecked;
	    request.custom.itemCount = request.badges.checkItems;
	    
	    // Request Items
	    request.custom.requestItems = [];
	    
	    // Sort Request Items by pos
        request.checklists[0].checkItems.sort(function (a, b) {
        	return (a.pos < b.pos ? -1 : 1);
        });
        
        for (var i = 0; i < request.checklists[0].checkItems.length; i++) {
         
        	// -------------------------------------------------------------------
        	// Request Items
        	// -------------------------------------------------------------------
        	
        	// Get item ShortLink
        	var reqItemUrl = request.checklists[0].checkItems[i].name; // url e.g. https://trello.com/c/zxzacSwh/67-tp06-20
        	reqItemUrl = reqItemUrl.substring(8); // Trim "https://"
        	var reqItemShortLink = reqItemUrl.split('/')[2];
        	
        	// clone item
        	var reqItem = $.extend(true, {}, QM.items[reqItemShortLink]);
        	request.custom.requestItems.push(reqItem);
        	 
        	// Init item
        	reqItem.custom = {}; // To store custom varables
        	reqItem.custom.idCheckItem = request.checklists[0].checkItems[i].id;
        	reqItem.custom.location = QM.lists[reqItem.idList].name;
        	reqItem.custom = $.extend(true, reqItem.custom, getAdditionalData(reqItem)); // Load additional data from desc
        	reqItem.custom.index = i;
            
            var reqItemDueDt = null;
    	    if (reqItem.due != null) {
    	    	reqItemDueDt = new Date(reqItem.due);
    	    	reqItemDueDt = new Date(reqItemDueDt.getFullYear(), reqItemDueDt.getMonth(), reqItemDueDt.getDate());
    	    }
            
            // item status
    	    reqItem.custom.borrowed = (reqItem.idList == request.idList);
    	    reqItem.custom.borrowedByOther = (reqItem.idList != request.idList && isBorrowed(reqItem));
    	    reqItem.custom.overdue = (reqItem.due != null && reqItemDueDt < currDt);
    	    reqItem.custom.repair = (reqItem.idList == List.repair);
    	    reqItem.custom.drying = (reqItem.idList == List.drying);
    	    reqItem.custom.damaged = hasLabel(reqItem, Label.damaged);
    	    reqItem.custom.broken = hasLabel(reqItem, Label.broken);
    	    reqItem.custom.returned = (request.checklists[0].checkItems[i].state == 'complete');
             
            if ( (reqItem.custom.borrowed || reqItem.custom.borrowedByOther || reqItem.custom.overdue)
            		&& (reqItem.due != null && reqItem.due != '') ) {
            	reqItem.custom.dueDt = dateFormat_ymd(reqItemDueDt);
            }
            
            if (reqItem.custom.returned) {
                $.each(request.actions, function(index, action) {
                    if (action.type == 'updateCheckItemStateOnCard'
                            && action.data.checkItem.id == reqItem.custom.idCheckItem
                            && action.data.checkItem.state == 'complete') {
                    	reqItem.custom.completeDt = dateFormat_ymd(new Date(action.date));
                    }
                });
            }
            
            // item type
    		for (var j = 0; j < reqItem.labels.length; j++) {
    	        if (reqItem.labels[j].id == Label.tent) {
    	        	reqItem.custom.itemType = 'tent';
    	        } else if (reqItem.labels[j].id == Label.yurt) {
    	        	reqItem.custom.itemType = 'yurt';
    	        } else if (reqItem.labels[j].id == Label.tentpeg) {
    	        	reqItem.custom.itemType = 'tentpeg';
    	        } else if (reqItem.labels[j].id == Label.fly) {
    	        	reqItem.custom.itemType = 'fly';
    	        } else if (reqItem.labels[j].id == Label.cookset) {
    	        	reqItem.custom.itemType = 'cookset';
    	        } else if (reqItem.labels[j].id == Label.stove) {
    	        	reqItem.custom.itemType = 'stove';
    	        } else if (reqItem.labels[j].id == Label.other) {
    	        	reqItem.custom.itemType = 'other';
    	        } else if (reqItem.labels[j].id == Label.tent_tent) {
    	        	reqItem.custom.tentPart = 'tent';
    	        } else if (reqItem.labels[j].id == Label.tent_pole) {
    	        	reqItem.custom.tentPart = 'pole';
    	        } else if (reqItem.labels[j].id == Label.tent_shelter) {
    	        	reqItem.custom.tentPart = 'shelter';
    	        }
    	    }
         } // End of Request Items
	});	// End of Request Items
    
	// -------------------------------------------------------------------
	// Items
	// -------------------------------------------------------------------
	$.each(QM.itemsArray, function(index, item) {
		
		item.custom = {}; // To store custom varables
		
		var dueDt = null;
	    if (item.due != null) {
	    	dueDt = new Date(item.due);
	    	dueDt = new Date(dueDt.getFullYear(), dueDt.getMonth(), dueDt.getDate());
	    }
	     
	    var currDt = new Date(); 
	    currDt = new Date(currDt.getFullYear(), currDt.getMonth(), currDt.getDate());
	    
		// item status
		item.custom.borrowed = isBorrowed(item);
		item.custom.overdue = (item.due != null && dueDt < currDt);
		item.custom.repair = (item.idList == List.repair);
		item.custom.drying = (item.idList == List.drying);
		item.custom.damaged = hasLabel(item, Label.damaged);
		item.custom.broken = hasLabel(item, Label.broken);
		
		item.custom = $.extend(true, item.custom, getAdditionalData(item)); // Load additional data from desc
		item.custom.location = QM.lists[item.idList].name;
		
		if (dueDt != null) {
			item.custom.dueDt = dateFormat_ymd(dueDt);
        }
		
		// item type
		for (var i = 0; i < item.labels.length; i++) {
	        if (item.labels[i].id == Label.tent) {
	            item.custom.itemType = 'tent';
	        } else if (item.labels[i].id == Label.yurt) {
	        	item.custom.itemType = 'yurt';
	        } else if (item.labels[i].id == Label.tentpeg) {
	        	item.custom.itemType = 'tentpeg';
	        } else if (item.labels[i].id == Label.fly) {
	        	item.custom.itemType = 'fly';
	        } else if (item.labels[i].id == Label.cookset) {
	        	item.custom.itemType = 'cookset';
	        } else if (item.labels[i].id == Label.stove) {
	        	item.custom.itemType = 'stove';
	        } else if (item.labels[i].id == Label.other) {
	        	item.custom.itemType = 'other';
	        } else if (item.labels[i].id == Label.tent_tent) {
	        	item.custom.tentPart = 'tent';
	        } else if (item.labels[i].id == Label.tent_pole) {
	        	item.custom.tentPart = 'pole';
	        } else if (item.labels[i].id == Label.tent_shelter) {
	        	item.custom.tentPart = 'shelter';
	        }
	    }
	}); // End of Items
	
}

/*******************
 * Process Box
 ******************/
var processCount = 0;

function startProcess(msg, display) {
    processCount++;
    $('#process-msg').append('<div id="process-'+processCount+'" class="process running">'+msg+'</div>');
    if (display !== false)
    	$('#process-box').removeClass('hidden');
    return processCount;
}

function finishProcess(pid) {
    $('#process-'+pid)
       .removeClass('running')
       .addClass('finish')
       .append(' - <strong>Completed</strong>.');
}

function failProcess(pid) {
    $('#process-'+pid)
       .removeClass('running')
       .addClass('fail')
       .append(' - <strong>Fail</strong>.');
    $('#process-box')
        .removeClass('alert-warning')
        .addClass('alert-danger');
}

function clearProcess() {
	$.wait(3000, function() {
        if ($('.process.running').length <= 0 && $('.process.fail').length <= 0) {
            $('.process.finish').remove();
            $('#process-box').addClass('hidden');
        }
    });
}

function completeProcess() {
	if ($('.process.running').length <= 0 && $('.process.fail').length <= 0) {
        $('#process-box')
        	.removeClass('alert-warning')
        	.addClass('alert-success');
    }
}

/*******************
 * Fix Affix Width
 * Usage:
 *  <div data-clampedwidth=".myParent">This long content will force clamped width</div>
 *
 ******************/
/*
$(function(){
	$('[data-clampedwidth]').each(function () {
	    var elem = $(this);
	    var parentPanel = elem.data('clampedwidth');
	    var resizeFn = function () {
	        var sideBarNavWidth = $(parentPanel).width() - parseInt(elem.css('paddingLeft')) - parseInt(elem.css('paddingRight')) - parseInt(elem.css('marginLeft')) - parseInt(elem.css('marginRight')) - parseInt(elem.css('borderLeftWidth')) - parseInt(elem.css('borderRightWidth'));
	        console.log('$(parentPanel).width()='+$(parentPanel).width());
	        console.log('elem.css(paddingLeft)='+elem.css('paddingLeft'));
	        console.log('elem.css(paddingRight)='+elem.css('paddingRight'));
	        console.log('elem.css(marginLeft)='+elem.css('marginLeft'));
	        console.log('elem.css(marginRight)='+elem.css('marginRight'));
	        console.log('elem.css(borderLeftWidth)='+elem.css('borderLeftWidth'));
	        console.log('elem.css(borderRightWidth)='+elem.css('borderRightWidth'));
	        elem.css('width', sideBarNavWidth);
	    };
	
	    resizeFn();
	    $(window).resize(resizeFn);
	});
});
*/
/*******************
 * Progress Bar
 ******************/
function updateProgressIcon() {
    $('.bs-wizard-step.disabled .glyphicon').removeClass('glyphicon-arrow-right').removeClass('glyphicon-ok');
    $('.bs-wizard-step.active .glyphicon').addClass('glyphicon-arrow-right').removeClass('glyphicon-ok');
    $('.bs-wizard-step.overdue .glyphicon').addClass('glyphicon-arrow-right').removeClass('glyphicon-ok');
    $('.bs-wizard-step.complete .glyphicon').removeClass('glyphicon-arrow-right').addClass('glyphicon-ok');
}

function updateProgressStatus(progress_step, status) {
    if (status == 'disabled')
        $(progress_step).addClass('disabled').removeClass('active').removeClass('overdue').removeClass('complete');
    else if (status == 'active')
        $(progress_step).removeClass('disabled').addClass('active').removeClass('overdue').removeClass('complete');
    else if (status == 'overdue')
        $(progress_step).removeClass('disabled').removeClass('active').addClass('overdue').removeClass('complete');
    else if (status == 'complete')
        $(progress_step).removeClass('disabled').removeClass('active').removeClass('overdue').addClass('complete');
}

function updateOverdueStatus(element) {
    if ($(element).hasClass('overdue')) {
        $(element + ' .bs-wizard-stepnum').html('逾時未還').addClass('txt-overdue');
    } else {
        $(element + ' .bs-wizard-stepnum').html('進行中').removeClass('txt-overdue');
    }
}

function updateProgressBarWidth(pct) {
    $('.bs-wizard .progress-bar').width(pct);
}

function updateProgressBar($element) {
    var stepNum = $element.data('stepnum');
    var totalStep = $element.data('totalstep');
    var barLength = $element.data('barlength');
    var chkOverdue = $element.data('chkoverdue');
    
    // Update Progress Status for previous steps
    for (var i = 1; i < parseInt(stepNum); i++)
        updateProgressStatus('#progress-step-'+i, 'complete');
    
    // Update Progress Status for current step
    if (stepNum === totalStep) {
        updateProgressStatus('#progress-step-'+stepNum, 'complete');
    } else if (chkOverdue === 'Y') {
        updateProgressStatus('#progress-step-'+stepNum, $('#request').hasClass('overdue') ? 'overdue' : 'active');
    } else {
        updateProgressStatus('#progress-step-'+stepNum, 'active');
    }
    
    // Update Progress Status for next steps
    for (var i = parseInt(stepNum) + 1; i <= parseInt(totalStep); i++)
        updateProgressStatus('#progress-step-'+i, 'disabled');
    
    // set clickable
    for (var i = 1; i <= parseInt(totalStep); i++) {
        if (i == parseInt(stepNum) + 1) {
            $('#progress-step-'+i+' .progress-bar-btn').removeClass('unclickable');
        } else {
            $('#progress-step-'+i+' .progress-bar-btn').addClass('unclickable');
        } 
    }
    
    updateOverdueStatus('#progress-step-3');
    updateProgressIcon();
    updateProgressBarWidth(barLength);
}
/*******************/
