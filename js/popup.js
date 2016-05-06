/**
 * Created by zhaokang on 16/5/2.
 */

var wrapper = document.getElementById('wrapper');
var filter = document.getElementById('filter');
var paging = document.getElementById('paging');
var flag = true;

paging.disabled = flag;

wrapper.onclick = function (e) {
    var id = e.target.id;
    var txt = id + ' clicked';

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: txt});
    });

    if (id === 'filter') {
        flag = !flag;
        paging.disabled = flag;
    }

};

