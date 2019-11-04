//blockUI方法，若傳入值為空則解除頁面Block狀態
var _blockstatus = false;
function blockPage(UImessage) {
    if (UImessage == "") {
        _blockstatus = false;
        $('nav').unblock();
        $.unblockUI();
    } else {
        $(".container").removeClass("m-top132");
        $(".nav").show().removeClass("nav-s");
        $(".container-1").removeClass("container-1-s");
        $(".container-h2").removeClass("container-h2-s");
        $(".function-btn").removeClass("function-btn-s");
        $(".container-btn-right").removeClass("container-btn-right-s");
        $(".nav-title-icon").removeClass("nav-title-icon-s");
        $(".file-level").show(0);
        _blockstatus = true
        $('nav').block({ message: null });
        $.blockUI({ message: UImessage });
    }
}
function changeBlockText(UImessage) {
    $('.blockMsg').text(UImessage);
}

function blockPageForJBPMSend() {
    $(".container").removeClass("m-top132");
    $(".nav").show().removeClass("nav-s");
    $(".container-1").removeClass("container-1-s");
    $(".container-h2").removeClass("container-h2-s");
    $(".function-btn").removeClass("function-btn-s");
    $(".container-btn-right").removeClass("container-btn-right-s");
    $(".nav-title-icon").removeClass("nav-title-icon-s");
    $(".file-level").show(0);
    _blockstatus = true
    $('nav').block({ message: null });

    $.blockUI({
        message: '<img src=\"\\Content\\images\\block.gif\" />',
        css: {
            border: 'none'
        },
        overlayCSS: {
            backgroundColor: '#ffffff',
            opacity: 1
        }
    });
}