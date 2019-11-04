/* ------------【 navbar-small動態 】------------ */
$(window).on('scroll', function () {
    if (_blockstatus) {
        return;
    }

    if ($(this).scrollTop() > 100) {
        $(".container").addClass("m-top132");
        $(".nav").addClass("nav-s");
        $(".container-1").addClass("container-1-s");
        $(".container-h2").addClass("container-h2-s");
        $(".function-btn").addClass("function-btn-s");
        $(".container-btn-right").addClass("container-btn-right-s");
        $(".nav-title-icon").addClass("nav-title-icon-s");
        $(".file-level").hide(0);
    } else {
        $(".container").removeClass("m-top132");
        $(".nav").show().removeClass("nav-s");
        $(".container-1").removeClass("container-1-s");
        $(".container-h2").removeClass("container-h2-s");
        $(".function-btn").removeClass("function-btn-s");
        $(".container-btn-right").removeClass("container-btn-right-s");
        $(".nav-title-icon").removeClass("nav-title-icon-s");
        $(".file-level").show(0);
    }
});

/* ------------【 go-top-js 表單頁 】------------ */
var $backToTop = $(".back-to-top");
$backToTop.hide();
$(window).on('scroll', function () {
    if ($(this).scrollTop() > 300) {
        $backToTop.fadeIn();
    } else {
        $backToTop.fadeOut();
    }
});
$backToTop.on('click', function (e) {
    $("html, body").animate({ scrollTop: 0 }, 500);
});

/* ------------【 info輔助說明-js 】------------ */
$(function () {
    $(".added-info-text").hide(0);//先隱藏按鈕
    $(function () {
        $('.added-info').hover(function () {
            $(this).closest('.added-info').find('.added-info-text').show(0);
        }, function () {
            //滑開時樣式
            $(this).closest('.added-info').find('.added-info-text').hide(0);
        }
        );
    });
});

/* ------------【 資訊欄位展開-js 】------------ */
$(function () {
    $(document).on('mouseenter', '.information-info-bt', function () {
        $(this).closest('.information-text').find('.information-info-box').show(50);
    });
    $(document).on('mouseleave', '.information-info-bt', function () {
        $(this).closest('.information-text').find('.information-info-box').hide(50);
    });
    $(document).on('click', '.information-info-bt', function (event) {
        $(this).closest('.information-text').find('.information-info-box').toggle(50);
    });
});

/* ------------【 表單-資訊區塊顯示- info-note-box 】------------ */
$(function () {
    $(document).on(
        {
            'mouseenter': function () { $(this).closest('.info-note-box').find('.info-note').fadeIn(300); },
            'mouseleave': function () { $(this).closest('.info-note-box').find('.info-note').hide(0); }
        },
        '.info-bt'
    )
});

/* ------------【 簽核紀錄動態 】------------ */
$(function () {
    if ($('#RecordCountBody tr').length > 2) {
        switchAuditLogStyle(false);
    }

    $("#record-open-bt").on("click", function () {
        switchAuditLogStyle(true);
    });
    $("#record-close-bt").on("click", function () {
        switchAuditLogStyle(false);
    });
});
function switchAuditLogStyle(isShow) {
    if (isShow) {
        $("#record-open-bt").hide(10);
        $("#record-close-bt").show(10);
        $('#RecordCountBody tr').each(function (index, element) {
            if (index > 1) {
                $(element).show(500);
            }
        });
    }
    else {
        $("#record-open-bt").show(10);
        $("#record-close-bt").hide(10);
        $('#RecordCountBody tr').each(function (index, element) {
            if (index > 1) {
                $(element).hide(500);
            }
        });
    }
}

/* ------------【意見紀錄訊息開合 message-box.js 】------------ */
$(function () {
    //針對少於三則的訊息做按鈕隱藏判斷
    $('.message-box-3').each(function () { //針對這區塊作迴圈
        if ($(this).find('li').length <= 3)  //先抓到這li，length 抓 li 的範圍
        {
            $(this).closest('.row').find('a.box-open').hide(0);//.closest會抓鄰近的直
            $(this).closest('.row').find('a.box-close').hide(0);//.closest會抓鄰近的直
        }
    });

    //message-box點選後動作
    $(".box-close").hide(0);//先隱藏按鈕
    $(".box-open").on("click", function () {
        $(this).closest('.row').find('.box-open').hide(10);
        $(this).closest('.row').find('.box-close').show(10);
        $(this).closest('.row').find('.message-box-3').addClass("message-box-all");//this:觸發當下.closest:最鄰近的值.find找到物件 後做動作
    });

    $(".box-close").on("click", function () {
        $(this).closest('.row').find('.box-open').show(10);
        $(this).closest('.row').find('.box-close').hide(10);
        $(this).closest('.row').find('.message-box-3').removeClass("message-box-all");
    });
});

/* ------------【查詢輸入欄位動態 search-input-box.js 】------------ */
$(".cr-search-box").on("click", function () {
    $(this).closest('.col-sm-12').find(".cr-search-over-box").toggle();
});

/* ------------【右側欄功能選單 form_menu.js 】------------ */

/*-- 側欄選單-1 --*/
$(function ($) {
    $('#MENUICON-close').hide();
    var $win = $(window),
        $MENU = $('#MENU'),
        MENUHeight = $('#MENU').outerHeight(true),
        MENUWidth = $('#MENU').outerWidth(true),
        $page = $('#page'),
        pageHeight = $page.outerHeight(true);

    $(document).on('click', '#MENUICON', function (event) {
        event.preventDefault();
        var isHide = $('#MENU').hasClass('hideMENU');
        event.preventDefault();
        var isHide = $('#MENU').hasClass('hideMENU'); $('#MENU').stop().animate({ right: isHide ? -145 : 0 });
        $('#MENUICON').hide(); $('#MENUICON-close').show();
    });

    $(document).on('click', '#MENUICON-close', function (event) {
        event.preventDefault();
        var isHide = $('#MENU').hasClass('hideMENU');
        $('#MENU').stop().animate({ right: "-145px" }, 500);
        $('#MENUICON').show(); $('#MENUICON-close').hide();
    });
});

//錨點滑動
$(function () {
    $(document).on('click', 'a[href*=#]:not([href=#])', function () {
        var target = $(this.hash);
        if (target.offset() == undefined) {
            return;
        }
        $('html,body').animate({ scrollTop: target.offset().top - 60 }, 300);
        //nav隱藏
        // $(".nav").animate({ top: "-50px" }, 500);
        return false;
    });
});

/*-- 側欄選單-2 --*/
$(function () {
    $(document).on('mouseenter', '.submenu-title-link', function () {
        $('.submenu-title-box').hide(0);
        $(this).closest('.submenu-area').find('.submenu-title-box').slideDown(100);
    });
    $(document).on('mouseleave', '.submenu-title-link', function () {
        $(this).closest('.submenu-area').find('.submenu-title-box').hide(0);
    });

    $(document).on('mouseenter', '.submenu-title-box', function () {
        $(this).show(0);
    });
    $(document).on('mouseleave', '.submenu-title-box', function () {
        $(this).hide(0);
    });
});

// 側欄POPUP樣式
$(function () {
    $(".addcase01").on("click", function () {
        $('.popup-left-addcase').show(0);
        $('.popup-overlay').fadeIn(0);
        $('.popup-box').animate({ right: "0px" }, 300);
        $("html, body").css("overflow", "hidden");
    });

    // 關閉
    $(".popup-close").on("click", function () {
        $('.popup-left-addcase').fadeOut(300);
        $('.popup-overlay').fadeOut(100);
        $('.popup-box').animate({ right: "-70%" }, 80);
        $("html, body").css("overflow", "visible");
        event.preventDefault();//取消預設連結至頂動作
    });

    // popup-overlay關閉
    $(".popup-overlay").on("click", function () {
        $('.popup-left-addcase').fadeOut(300);
        $('.popup-overlay').fadeOut(100);
        $('.popup-box').animate({ right: "-70%" }, 80);
        $("html, body").css("overflow", "visible");
        event.preventDefault();//取消預設連結至頂動作
    });
});

//前次紀錄
$(function () {
    $(".recode-bt-show").show(0);
    $(".recode-bt-hide").hide(0);

    $(".recode-bt-show").on("click", function () {
        $(this).parents('.area-btn-right').find('.recode-bt-show').hide(0);
        $(this).parents('.area-btn-right').find('.recode-bt-hide').show(0);
    });

    $(".recode-bt-hide").on("click", function () {
        $(this).parents('.area-btn-right').find('.recode-bt-show').show(0);
        $(this).parents('.area-btn-right').find('.recode-bt-hide').hide(0);
    });
});