$(function(){
//pop 視窗控制
	$.fn.extend({
		//重新給定搜尋窗的值
	  setSearchBox: function(list) {				 
				
				_parents=$(this).closest("[alt=popWindow]")
				
				popWindow_SearchBox=$(_parents).find("[alt=popWindow_SearchBox]");
				$(popWindow_SearchBox).html("");
				
				searchList="";
				
				if($(list).length>0){
	  					$(list).each(function(){
					searchList+="<li val='" + $(this)[1] + "'>"+  $(this)[0] +"</li>"
					
					})
				
					
					$(popWindow_SearchBox).html("<ul>" + searchList + "</ul>");
					
					$(popWindow_SearchBox).find("li").click(
						function(){
							$(this).addSel($(this).text(),$(this).attr("val"));
							$(this).searchBoxHide();
						}
					)
					
				}		
				else{
					$(popWindow_SearchBox).html("<ul><li>查無資料</li></ul>");
					
					$(popWindow_SearchBox).find("li").click(
						function(){
							$(this).searchBoxHide();
						}
					)					
				}	
				$(popWindow_SearchBox).show()		
		},
		//隱藏搜尋窗
	 searchBoxHide:function(){
		$(this).closest("[alt=popWindow]").find("[alt=popWindow_SearchBox]").hide();
	 },	
	
	//移除所選
	 removeSel: function () {
	    
			_parent=$(this).closest('.Links').parent();
			$(this).closest('.Links').remove() 
			if(_parent.find('.Links').length==0){
				$(_parent).find("[alt=popWindow_NoItem]").show();
			}
			$(this).filter(':checkbox').prop('checked', false);
			
				
			
		},
		//新增所選
	addSel: function(text,val){
		_parents=$(this).closest("[alt=popWindow]")
		
		
		if($(_parents).find("[alt=popWindow_SelectedBox]").find(".Links-n").find("[val='"+val+"']").length > 0) return false;
		
		
		
		addSelDiv='<div class="Links"><div class="Links-n"><span class="file-text" val="'+ val +'">'+ text +'</span>'
					+'<div class="XX01" onclick="$(this).removeSel()"><i class="glyphicon glyphicon-remove"></i></div></div> </div>	'
									
		$(_parents).find("[alt=popWindow_NoItem]").hide();		

		limit=parseInt($(_parents).find("[alt=popWindow_SelectedBox]").attr("limit"));
		
		if(limit==1){
			
			$(_parents).find("[alt=popWindow_SelectedBox]").html(addSelDiv);	
			
		}
		else if(limit > 1){
			if($(_parents).find("[alt=popWindow_SelectedBox]").find(".Links-n").length>=limit) alert("超過數量限制")
			else $(_parents).find("[alt=popWindow_SelectedBox]").append(addSelDiv);	
		}
		else{//無數量限制
			
			$(_parents).find("[alt=popWindow_SelectedBox]").append(addSelDiv);	
		}
		
	
	},
	//新增所選 特定控制器
	addSelTotarget: function(target,text,val){
		if($(target).find(".Links-n").find("[val="+val+"]").length > 0) return false;
		
		addSelDiv='<div class="Links"><div class="Links-n"><span class="file-text" val="'+ val +'">'+ text +'</span>'
					+'<div class="XX01" onclick="$(this).removeSel()"><i class="glyphicon glyphicon-remove"></i></div></div> </div>	'
									
		$(target).find("[alt=popWindow_NoItem]").hide();

		limit=parseInt($(target).attr("limit"));
		
		if(limit==1){
			
			$(target).html(addSelDiv);	
			
		}
		else if(limit > 1){
			if($(target).find(".Links-n").length>=limit) alert("超過數量限制")
			else $(target).append(addSelDiv);	
		}
		else{//無數量限制
			
			$(target).append(addSelDiv);	
		}

		
	
	},
	//帶入選取值 target:帶入的目標
	sendSelected:function(target){
		_parents=$(this).closest("[alt=popWindow]")
		$(target).find('.Links').remove();
			
		if($(_parents).find("[alt=popWindow_SelectedBox]").find('.Links').length>0){
			$(target).find("[alt=popWindow_NoItem]").hide();
			$(_parents).find("[alt=popWindow_SelectedBox]").find('.Links').each(
				function(){
				
				$(target).append($(this).clone())
				
				}
			)
		}
		else{
		$(target).find("[alt=popWindow_NoItem]").show();
		}
		
	},
	//設定select 控制器 target:select 控制器,動作,值(text,value)
	setSelectOption:function(target,action,valueList){
		
		if(action=="set"){
		
			$(target).children().remove();
		
			$(valueList).each(function(){
					
				$(target).append($("<option></option>").attr("value", $(this)[1]).text($(this)[0]));	
			})		
		}
		$(target).selectpicker('refresh');//selectpicker 不更新顯示不會改變	
	}	
	
	});


})



