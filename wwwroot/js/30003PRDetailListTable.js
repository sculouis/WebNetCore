
function PRDetailList_expandDetail(target) {

    if ($(target).find('.icon-arrow-up').length > 0) {
	 $(target).closest('thead').children('tr').eq(1).hide(200);
        $(target).closest('table').children('tbody').hide(200);
        $(target).find('.icon-arrow-up').toggleClass('icon-arrow-up icon-arrow-down');
    } else {
	 $(target).closest('thead').children('tr').eq(1).show(200);
       $(target).closest('table').children('tbody').show(200);
        $(target).find('.icon-arrow-down').toggleClass('icon-arrow-down icon-arrow-up');
    }
}
