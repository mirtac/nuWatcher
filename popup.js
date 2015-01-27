/*chrome.app.runtime.onLaunched.addListener(function() {
 console.log("runtime.onLaunched");
 });*/

chrome.browserAction.onClicked.addListener(function(tab) {
	//var action_url = "javascript:window.print();";
	//chrome.tabs.update(tab.id, {url: action_url});
	console.log("browserAction.onClicked");
	/*var action_url = "javascript:window.print();";
	 chrome.tabs.update(tab.id, {
	 url : action_url
	 });*/
	webs = new Wsclient("ws://140.123.101.185:5566", "test");

});
function getmesage(opt) {//should be websocket.onmessage
	chrome.notifications.create("id" + Math.random(), opt, function(id) {
		console.log("createID:" + id);
	});
	//this wii put to get message from notifications
	chrome.browserAction.setBadgeBackgroundColor({
		color : [255, 0, 0, 0]
	});
};
chrome.notifications.onClicked.addListener(replyBtnClick);
function replyBtnClick(notificationId) {
	console.log("id:" + notificationId);
	chrome.browserAction.setBadgeText({
		text : ""
	});
	chrome.tabs.create({
		url : "http://www.cs.ccu.edu.tw/"
	});
	chrome.notifications.clear(notificationId, function(wasCleared) {
	});

};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.status == 'complete') {//TODO sent restful request to server
		console.log("tabs.onUpdated:[" + tab.url + "] id: " + tabId + "  status: " + changeInfo.status);
	}
});

chrome.tabs.onCreated.addListener(function(tab) {
	console.log("tabs.onCreated: " + tab.url);
});

function Wsclient(wsURL, wsProtocol, callback) {
	var websocket = null;
	var isClose = true;
	var ws = new WebSocket(wsURL, wsProtocol);
	this.ws = ws;
	ws.onmessage = function(e) {
		console.log(e.data);
		try {
			receiveJson = JSON.parse(e.data);
		} catch(e) {
			console.log("JSON parse error at Wsclient.onmessage()");
			return false;
		}
		var opt = {
			type : "basic",
			title : receiveJson.title,
			message : receiveJson.message,
			iconUrl : "icon.png"

		};
		chrome.browserAction.setBadgeText({
			text : ""+receiveJson.notificationNum
		});

		getmesage(opt);
	};
	ws.onclose = function(e) {
		isClose = true;
		console.log("ws close");
	};
	ws.onopen = function(e) {
		console.log("ws open");
	};
	ws.onerror = function(e) {
		console.log("something wrong in ws");
	};
	//TODO auth
	/*
	$.get(WWW_HOST+"/ws/users/me", function(data) {
                //console.log('DATA',data);
                //chrome.tabs.sendMessage(targetTab.id, {type: 'id', data: data});
                if(!=null){
                	                ws.send(JSON.stringify(auth_data));
                }
                else{
                	turn login page by chrome.tabs.create();
                }
                });*/
}
