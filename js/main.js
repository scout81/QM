
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
    	Trello.authorize({
            type: "popup",
            name: "HKG81 QM",
            scope: {
                read: true,
                write: true },
            //expiration: "never",
            expiration: "30days",
            success: function() {
				$("#alert-box").addClass("hidden");
				$("#alert-box").removeClass("alert-warning");
				done();
			},
            error: function() {
				$('#loader').remove();
				failAlert("<strong>錯誤: </strong>Authorize Failed.");
				fail();
			}
        });
    }
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
    $("#alert-box").addClass("alert-success");
    $("#alert-msg").html(msg);
}

function failAlert(msg) {
    console.log("FAIL - " + msg);
    $("#alert-box").removeClass("hidden");
    $("#alert-box").addClass("alert-danger");
    $("#alert-msg").html(msg);
}

function warningAlert(msg) {
    $("#alert-box").removeClass("hidden");
    $("#alert-box").addClass("alert-warning");
    $("#alert-msg").html(msg);
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

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

$(function(){
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true
    });
});

function dateFormat(date) {
    return date.getFullYear()+'-'+leadingZero(date.getMonth()+1)+'-'+leadingZero(date.getDate())+' '
        +leadingZero(date.getHours())+':'+leadingZero(date.getMinutes())+':'+leadingZero(date.getSeconds());
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
                return '<a href="javascript: $(\'#'+anchorText[2]+'\').triggerHandler(\'click\');">'+getCardNameByUrl(cards, match.getUrl())+'</a>';
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
                return getCardNameByUrl(cards, match.getUrl());
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
