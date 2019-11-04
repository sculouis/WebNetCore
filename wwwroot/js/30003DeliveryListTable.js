$(function(){


$("[alt='DeliveryList_SimpleCell']").hide();

})

function fun_DeliveryList_expandDetail(target) {

    if ($(target).find('.icon-arrow-up').length > 0) {
	 $(target).parents('thead').children('tr').eq(1).hide(200);
        $(target).parents('table').eq(0).children('tbody').hide(200);
        $(target).find('.icon-arrow-up').toggleClass('icon-arrow-up icon-arrow-down');
    } else {
	 $(target).parents('thead').children('tr').eq(1).show(200);
       $(target).parents('table').eq(0).children('tbody').show(200);
        $(target).find('.icon-arrow-down').toggleClass('icon-arrow-down icon-arrow-up');
    }
}


function fun_AddDeliveryCell(target) {

	parentsTable=$(target).parents("[alt='DeliveryListTable']")

	SimpleCell=$(parentsTable).find("[alt='DeliveryList_SimpleCell']").html();

	$(parentsTable).find("tbody").append("<tr alt='NewDeliveryCell'>"+ SimpleCell + " </tr>")
			

	/*
	bootstrap selectpicker在編譯後會自行產生JS語法
	導致複製simpleCell時顯示異常，故放到新增時再加上去
	*/
	$(parentsTable).find("[alt='NewDeliveryCell']").last().find("select").addClass("selectpicker show-tick form-control select-h30")

 

  $(parentsTable).find('.selectpicker').selectpicker();
  
  
  

	 fun_resetDeliveryCellIndex(parentsTable);
}


function fun_removeDeliveryCell(target) {

parentsTable=$(target).parents("[alt='DeliveryListTable']")
 $(target).parents('tr').eq(0).remove();
fun_resetDeliveryCellIndex(parentsTable);

}

function fun_resetDeliveryCellIndex(targetTable){
	 i=0;
	$(targetTable).find("[alt='DeliveryIndex']").each(function(){
	
	$(this).text(i);
	i++;
	})

}
