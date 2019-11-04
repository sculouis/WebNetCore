
function fun_QuotationInfo_expandDetail(target) {
	QuotationInfoDetial=$(target).closest('tr').next(["alt=QuotationInfoDetial"])

	if($(QuotationInfoDetial).is(':visible')){
		
		$(QuotationInfoDetial).hide(200)
		
	}
	else{
		
		$(QuotationInfoDetial).show(200)
	}

   
}
