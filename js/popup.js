/**
 * Created by zhaokang on 16/5/2.
 */

$(function () {
    //var wrapper = document.getElementById('wrapper');
    //
    //wrapper.onclick = function (e) {
    //    var id = e.target.id;
    //    var txt = id + ' clicked';
    //    var msg = {content: txt};
    //
    //    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    //        chrome.tabs.sendMessage(tabs[0].id, msg);
    //    });
    //
    //};

    $('wrapper').on('click', 'button', function (e) {
            var id = e.target.id;
            var txt = id + ' clicked';
            var msg = {content: txt};

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, msg);
        });
    });
});