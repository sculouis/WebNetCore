//==============================
//使DOM元件有效
//==============================
function EnableDOMObject(obj) {
    if ($(obj)[0] == undefined) {
        return;
    }
    $(obj).attr('disabled', false);
    if ($(obj)[0].tagName === 'SELECT') {
        $(obj).removeClass('input-disable');
        $(obj).parent('div').removeClass('input-disable');
        $(obj).selectpicker('refresh');
    };
    if ($(obj)[0].tagName === 'DIV') {
        $(obj).datetimepicker({ format: 'YYYY-MM-DD' });
        $(obj).find('input').removeClass('input-disable').prop('disabled', false);
        $(obj).find('span').removeClass('input-disable')
    }
    if ($(obj)[0].tagName === 'INPUT') {
        $(obj).removeClass('input-disable');
    }
}
//==============================
//使DOM元件失效
//==============================
function DisableDOMObject(obj) {
    if ($(obj)[0] == undefined) {
        return;
    }
    $(obj).attr('disabled', true);
    if ($(obj)[0].tagName === 'SELECT') {
        $(obj).addClass('input-disable');
        $(obj).selectpicker('refresh');
    };
    if ($(obj)[0].tagName === 'DIV') {
        if ($(obj).data('DateTimePicker') == undefined) {
            return;
        }
        $(obj).data('DateTimePicker').destroy();
        $(obj).find('input').addClass('input-disable');
        $(obj).find('span').addClass('input-disable');
    }
    if ($(obj)[0].tagName === 'INPUT') {
        $(obj).addClass('input-disable');
        $(obj).next("span").removeClass().addClass("input-group-addon d-input input-disable");
    }
}
//==============================
//isNullOrEmpty
//==============================
function isNullOrEmpty(s) {
    return (s == null || s == "");
}

//==============================
//檢核Email格式
//==============================
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//=====================================================
//畫面捲動至domObject元件位置
//=====================================================
function scrollTo(domObject) {
    if ($(domObject).offset() != undefined) {
        $("html, body").animate({ scrollTop: $(domObject).offset().top - 50 }, 500);
    }
}

//=====================================================
//開啟BlockUI
//=====================================================
$.fn.center = function () {
    this.css("position", "absolute");
    this.css("top", ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px");
    this.css("left", ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px");
    return this;
}

function openBlockUI() {
    $.blockUI.defaults.css = {
    };
    $.blockUI({
        message: "<h1><img src=\"\\Content\\images\\block.gif\" /></h1>",
    });
    $('.blockUI.blockMsg').center();
};

function confirmopen(text, OKfunction, Escfunction, okText, escText) {
    ///<summary>確認視窗Remodal</summary>
    ///<param name="text">提示文字</param>
    ///<param name="OKfunction">確認後續動作</param>
    ///<param name="Escfunction">取消後續動作</param>

    $('#confirmOK').unbind();
    $('#confirmEsc').unbind();
    $('#confirmClose').unbind();

    $('#confirmText').text(text);
    if (okText) {
        $('#confirmOK').text(okText);
    } else {
        $('#confirmOK').text("確認")
    }
    if (escText) {
        $('#confirmEsc').text(escText);
    } else {
        $('#confirmEsc').text("取消")
    }
    $('#confirmOK').on('click', OKfunction);
    $('#confirmEsc').on('click', Escfunction);
    $('#confirmClose').on('click', Escfunction);
    $('[data-remodal-id=confirm-modal]').remodal().open();
}