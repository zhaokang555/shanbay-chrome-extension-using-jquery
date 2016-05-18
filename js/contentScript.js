/**
 * Created by zhaokang on 16/5/2.
 */

// ======1.初始化======
$(function () {

    var isFilter = false,
        isPaging = false,
        isSearch = false;

    var pageContent = null;

    createPopupAndAudio();

    // 点击页面其他地方popup消失
    $('body').click(function () {
        $('#popup').hide();
    });

    chrome.extension.onMessage.addListener(function(request){
        console.log(request.message);


        switch (request.message) {
            case 'filter clicked':
                isFilter = !isFilter;
                pageContent = getContent();
                if (isFilter) {
                    filt(pageContent);
                } else {
                    unFilt(pageContent);
                }
                break;

            case 'paging clicked':
                isPaging = !isPaging;

                pageContent = getContent();
                if (isPaging) {
                    paging(pageContent);
                } else {
                    unPaging();
                }
                break;

            case 'search clicked':
                isSearch = !isSearch;
                var $body = $('body');
                if (isSearch) {
                    $body.mouseup(searchHandler);
                } else {
                    $body.off('mouseup', searchHandler);
                }
                break;
        }

    });
});


// ======2.主要函数======
function createPopupAndAudio() {
    var $popup = $('<div id="popup"></div>');

    var imgUrl = chrome.extension.getURL('img/horn24.png');
    $popup.html('英式发音'
        + '<button id="ukBtn" type="button" style="background-image: url(' + imgUrl + ')"></button>'
        + '美式发音'
        + '<button id="usBtn" type="button" style="background-image: url(' + imgUrl + ')"></button>'
        + '<p id="p"></p>');

    $popup.click(function (e) {
        e.stopPropagation();

        var id = e.target.id;
        var uk = document.getElementById('uk');
        var us = document.getElementById('us');
        if (id === 'ukBtn') {
            uk.play();
        } else if (id === 'usBtn') {
            us.play();
        }

    });

    // 不查询popup内的单词
    $popup.mouseup(e => e.stopPropagation());

    $('body').append($popup);

    $('body').append('<audio id="uk"></audio><audio id="us"></audio>');

}

function filt(pageContent) {
    document.body.style.visibility = 'hidden';
    //$('body').hide();
    for (let i of pageContent.arrToShow) {
        i.style.visibility = 'visible';
        //$(i).show();
    }
    for (let i of pageContent.arrToHide) {
        i.style.visibility = 'hidden';
        //$(i).hide();
    }
}

function unFilt(pageContent) {
    document.body.style.visibility = 'visible';
    //$('body').show();
    for (let i of pageContent.arrToHide) {
        i.style.visibility = 'visible';
        //$(i).show();
    }
}


function paging(pageContent) {
    //console.log(pageContent);

    var pagePositionArr = [];
    var beginPosition = pageContent.beginPosition;
    var endPosition = pageContent.endPosition;

    var $btnSet =$('<div id="btnSet"></div>');
    $btnSet.width(window.innerWidth + 'px');
    $btnSet.height('40px');

    var pageHeight = window.innerHeight - $btnSet.height();
    var y = beginPosition;
    for (; y < endPosition; y += pageHeight) {
        pagePositionArr.push(y  - $btnSet.height() - 16);
    }
    console.log(pagePositionArr);

    var btnOriginLeft = pageContent.leftPosition;
    for (let i in pagePositionArr) {
        var $btn = $('<button>第' + (parseInt(i) + 1) + '页</button>');
        $btn.css('left', btnOriginLeft + 'px');
        $btn.click(function () {
            $(document).scrollTop(pagePositionArr[i]);
        });

        $btnSet.append($btn);
    }

    $('body').append($btnSet);
    $btnSet.hide().show(600);

    // 默认滚动到第一页的位置
    $(document).scrollTop(pagePositionArr[0]);
}


function unPaging() {
    location.reload();
}


function searchHandler(e) {

    var selectedTxt = window.getSelection().toString();

    // 判断选中的文本是否是英文单词
    var re = /[a-zA-Z]+/;
    if (!re.test(selectedTxt)) {
        return;
    }

    // 判断popup是否在边界上
    var popup = document.getElementById('popup');

    if (e.clientY > window.innerHeight - 100) {
        popup.style.top = (e.pageY - 100) + 'px';
    } else {
        popup.style.top = e.pageY + 'px';
    }

    if (e.clientX > window.innerWidth - 200) {
        popup.style.left = (e.pageX - 200) + 'px';
    } else {
        popup.style.left = e.pageX + 'px';
    }

    searchWord(selectedTxt);
}



// ======主要函数 end======


// ======3.工具函数======
function getContent() {
    var article = document.getElementById('article');

    var h = article.querySelector('header h1');
    var standfirst = article.querySelector('div.content__standfirst p');
    var img = article.querySelector('#img-1 picture img');
    var figcaption = article.querySelector('#img-1 figcaption');
    var artcleBody = article.querySelector('div.content__article-body');
    var arrToShow = [h, standfirst, img, figcaption, artcleBody];

    var aside = article.querySelector('aside.element.element-rich-link ');
    var ad = article.querySelector('#dfp-ad--inline1');
    var arrToHide = [aside, ad];

    var $h = $(h);
    var beginPosition = $h.offset().top;
    var leftPosition = $h.offset().left;
    var endPosition = artcleBody.getBoundingClientRect().bottom;




    return {
        arrToShow: arrToShow,
        arrToHide: arrToHide,
        beginPosition: beginPosition,
        leftPosition: leftPosition,
        endPosition: endPosition
    };
}



function searchWord(word) {
    // $.get('https://api.shanbay.com/bdc/search/', {word: word}, function (responseObj) {
    //     showPopup(responseObj);
    // }, 'json');

    $.getJSON('https://api.shanbay.com/bdc/search/', {word: word}, function (responseObj) {
        showPopup(responseObj);
    })
}

function showPopup(responseObj) {
    if (responseObj.msg !== 'SUCCESS') {
        console.log('查询失败');
        return;
    }

    $('#p').text(responseObj.data.definition);
    $('#uk')[0].src = responseObj.data.uk_audio;
    $('#us')[0].src = responseObj.data.us_audio;

    $('#popup').show();
    //console.log($('#popup').offset());
}

// ======工具函数 end======
