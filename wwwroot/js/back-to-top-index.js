// 針對首頁 gotop-js
var $backToTop = $(".back-to-top");
$backToTop.hide();
$(".main-content-box").on('scroll', function () {
    if ($(this).scrollTop() > 100) {
        $backToTop.stop(true, false).fadeIn();
    } else {
        $backToTop.stop(true, false).fadeOut();
    }
});
$backToTop.on('click', function (e) {
    $(".main-content-box").animate({ scrollTop: 0 }, 200);
});