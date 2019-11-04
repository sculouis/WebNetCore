$(function () {
$("[alt='simplePRListCell']").hide();
$("[alt='PRInfoDetail']").hide();
})

function PRInfoexpandDetail(target) {
PRInfoIndex = $(target).closest('tr').eq(0).children("[alt='PRInfoIndex']").text()
    if ($(target).find('.icon-arrow-up').length > 0) {
     $(target).find('.icon-arrow-up').toggleClass('icon-arrow-up icon-arrow-down');
	 $(target).closest('table').find("[alt='PRInfoDetail']").eq(PRInfoIndex).hide(200)  
   } else {
	   $(target).find('.icon-arrow-down').toggleClass('icon-arrow-down icon-arrow-up');
		$(target).closest('table').find("[alt='PRInfoDetail']").eq(PRInfoIndex).show(200)  
    }
}


function fun_AddPRInfoCell(target) {
	parentsTable=$(target).closest("table")
	SimpleCell_1=$(parentsTable).find("[alt='simplePRListCell']").html();
	SimpleCell_2=$(parentsTable).find("[alt='PRInfoDetail']").eq(0).html();

	$(parentsTable).append("<tbody alt='NewPRInfoCell'>"+ SimpleCell_1 + " </tbody>")
	$(parentsTable).append("<tbody alt='PRInfoDetail'>"+ SimpleCell_2 + " </tbody>")		

	/*
	bootstrap selectpicker在編譯後會自行產生JS語法
	導致複製simpleCell時顯示異常，故放到新增時再加上去
	*/
	$(parentsTable).find("[alt='NewPRInfoCell']").last().find("select").addClass("selectpicker show-tick form-control select-h30")
	$(parentsTable).find("[alt='PRInfoDetail']").last().find("[alt='EcoSelect']").addClass("selectpicker show-tick form-control select-h30")
	$(parentsTable).find("[alt='PRInfoDetail']").last().hide();
	$(parentsTable).find("[alt='NewPRInfoCell']").last().find("select").selectpicker();
	$(parentsTable).find("[alt='PRInfoDetail']").last().find("[alt='EcoSelect']").selectpicker();

	 fun_resetPRInfoCellIndex(parentsTable);
}


function fun_removePRInfoCell(target) {

parentsTable=$(target).closest("table")
PRInfoIndex = $(target).closest('tr').children("[alt='PRInfoIndex']").text()
 $(target).closest('tbody').eq(0).remove();
 $(parentsTable).find("[alt='PRInfoDetail']").eq(PRInfoIndex).remove();
fun_resetPRInfoCellIndex(parentsTable);
}

function  fun_resetPRInfoCellIndex(targetTable){
	i=0;	
	$(targetTable).find("[alt='PRInfoIndex']").each(function(){	
	$(this).text(i);
	$(this).nextAll("[alt=AddItem]").find("a").attr("PRInfoIndex", i)
	$(this).nextAll("[alt=Addperson]").find("a").attr("PRInfoIndex", i)	
	i++;
	})
}
