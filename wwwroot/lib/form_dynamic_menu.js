var non_sub_menu = $('<div class="submenu-title-link">\
                        <a href="" class="">\
                        </a>\
                      </div>');

var have_sub_menu = $('<div class="submenu-area">\
                            <div class="submenu-title-link">\
                                <a href="">\
                                </a>\
                            </div>\
                            <div class="submenu-title-box">\
                            </div>\
                       </div>');

window.onload = function () {
    resetSubMenu();
};
//$(function () {
//    resetSubMenu();
//});

function createSubMenuBody() {
    $('#dynamicMenu').empty();
    $('#dynamicMenu').replaceWith(
        '<div class="SUBMENU SUBMENU-2" id="MENU">\
                <div class="submenu-title-1">快速閱覽</div>\
         </div>');
}

function createSubMenu() {
    if ($('#MENU').length) {
        var id, title;
        $.each($('.section-area:visible'), function (index, element) {
            id = $(element).attr('id');
            title = $(element).find('.section-title span').text();
            if (id && title) {
                var tmp;
                var subIDList = $(element).find('.sub-id-flag').map(function () { return this.id; }).toArray();
                var subTitleList = $(element).find('.sub-title-flag').map(function () { return $(this).contents().not($(this).children()).text(); }).toArray();

                if (subIDList.length > 0 && subIDList.length == subTitleList.length) {
                    tmp = createHaveSubMenuHtml(id, title, subIDList, subTitleList);
                }
                else {
                    tmp = createNonSubMenuHtml(id, title);
                }
                $('#MENU').append(tmp);
            }
        });
    }
}

function createButton() {
    $('#MENU').append('<div class="SUBbtnOA icon-keyboard_arrow_left icon-right-size" id="MENUICON"></div>\
                       <div class="SUBbtnOA icon-keyboard_arrow_right icon-right-size" id="MENUICON-close"></div>');
    $('#MENUICON-close').hide();
}

function clearSubMenu() {
    $('#MENU').replaceWith('<div id="dynamicMenu"></div>');
}

function resetSubMenu() {
    clearSubMenu();
    if ($('.section-area:visible').length > 2) {
        createSubMenuBody();
        createSubMenu();
        createButton();
    }
}

function createHaveSubMenuHtml(id, title, subIDList, subTitleList) {
    var tmp = have_sub_menu.clone();    
    switch (id) {
        case 'InformationSection':
            $(tmp).find('.submenu-title-link a').attr('href', '#' + id).append('<b class="icon-paper"></b>' + title);            
            break;
        case 'SpeechSection':
            $(tmp).find('.submenu-title-link a').attr('href', '#' + id).append('<b class="icon-speech-bubble"></b>' + title);            
            break;
    }
    $.each(subIDList, function (index, value) {
        if ($('#' + value).parent().is(':visible')) {
            $(tmp).find('.submenu-title-box').append('<a href="#' + value + '">' + subTitleList[index] + '</a>');
        }        
    });
    return tmp;
}

function createNonSubMenuHtml(id, title) {
    var tmp = non_sub_menu.clone();    
    switch (id) {
        case 'SendSection':
            $(tmp).find('a').attr('href', '#' + id).addClass('send-setting').append('<b class="icon-2-send"></b>').append('<p>' + title + '</p>');            
            break;
        case 'fileSection':
            $(tmp).find('a').attr('href', '#' + id).append('<b class="icon-archive2"></b>' + title);
            break;
        case 'RecordSection':
            $(tmp).find('a').attr('href', '#' + id).addClass('raduse-setting').append('<b class="icon-content_paste"></b>' + title);
            break;
    }
    return tmp;
}