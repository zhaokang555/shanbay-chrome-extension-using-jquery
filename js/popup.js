/**
 * Created by zhaokang on 16/5/2.
 */

var wrapper = document.getElementById('wrapper');

wrapper.onclick = function (e) {
    var id = e.target.id;
    var txt = id + ' clicked';

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: txt});
    });

};

