// 新增表單動態
	$(function(){
		$('.add-form').hover(function(){
				$(".add-form-text").stop(true,false).show(150);	
			},function(){
				$(".add-form-text").stop(true,false).hide(0);	
			}
		);
	});
// table 下滑-nav上縮
	// $(".main-right-box").on('scroll', function() {
	//   if ($(this).scrollTop() > 50) {
	//   	  $(".main-right-box").addClass("main-right-box-s");  
	//   	  $(".add-form").addClass("add-form-s");
	//       $(".index-nav").addClass("index-nav-s");
	//       $(".main-menu").addClass("main-menu-s");
	//   } else {
	//   	  $(".main-right-box").removeClass("main-right-box-s");
	//   	  $(".add-form").removeClass("add-form-s");  
	//       $(".index-nav").removeClass("index-nav-s");
	//       $(".main-menu").removeClass("main-menu-s");     
	//   }
	// });

// 側欄選單
	$(function(){
	  $(".menu-list-1").on( "click", function() {
	  	// 整體移除狀態
		  $(this).closest('.main-menu-box').find('.menu-list-2').not(this).hide(0)
		  $(this).closest('.main-menu-box').find('.menu-list-1').not(this).removeClass('menu-list-1-active')
		  $(this).closest('.main-menu-box').find('.menu-icon-size').not(this).hide();
		// 當下新增狀態
		if($(this).hasClass( "menu-list-1-active" ))
		{	
			// 如果被點選狀態 -則做下方動作
	    	$(this).removeClass('menu-list-1-active');
		    $(this).closest('.menu-list-box').find('.menu-list-2').hide(0);
		    $(this).find('.menu-icon-size').removeClass("glyphicon-minus").addClass("glyphicon-plus").show(); 	
	    }
	    else
	    {
            // 如果沒被點選狀態 -則做下方動作
			$(this).toggleClass('menu-list-1-active')
		    $(this).closest('.menu-list-box').find('.menu-list-2').slideToggle(200);
		    $(this).find('.menu-icon-size').removeClass("glyphicon-plus").addClass("glyphicon-minus").show();
	    }
	  });
    });
	$(function(){
		$('.menu-list-1').hover(function(){
				// $(this).find('.menu-icon-size').removeClass("glyphicon-plus").addClass("glyphicon-minus").show();
				if($(this).hasClass( "menu-list-1-active" ))
				{	
					// 如果被點選狀態 -則做下方動作
				    $(this).find('.menu-icon-size').removeClass("glyphicon-plus").addClass("glyphicon-minus").show();	
			    }
			    else
			    {
		            // 如果沒被點選狀態 -則做下方動作
				    $(this).find('.menu-icon-size').removeClass("glyphicon-minus").addClass("glyphicon-plus").show();
			    }				
			},function(){
				$(this).find('.menu-icon-size').hide();
			}
		);
	});

