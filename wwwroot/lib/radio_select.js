
$(function(){
	$("#result-two").show();
	$("#result-three").hide();
	
	$("#rd02").on("click", OPEN1 );
	function OPEN1(){
		$("#result-two").hide(200);
		$("#result-three").show(200);
	}
	
	$("#rd01").on("click", OPEN2 );
	function OPEN2(){
		$("#result-two").show(200);
		$("#result-three").hide(200);
	}

});
