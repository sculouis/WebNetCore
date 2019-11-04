function setFieldStatus(P_CurrentStep, P_Status) {
    if (P_CurrentStep != '1' || P_Status == '4') {
        $('#PRDetailSearchBlock').remove();
        $('#PRDetailTable').remove();
        $('.box').find('select').each(function (index, element) {
            if (index>0) {
                var value = $(this).find('option:selected').text();
                $(this).after("<div>" + value + "</div>");
                $(this).siblings("button").attr("style", "display:none");
                $(this).parents("div.btn-group").removeClass();
            }
        })
    }
    var rows = $('#box-area-3').next().find('.row');
    ctrlBoxArea3_Row2(P_CurrentStep, P_Status, $(rows).eq(1).children());
    ctrlBoxArea3_Row3(P_CurrentStep, P_Status, $(rows).eq(2).children());
    ctrlBoxArea3_Row5(P_CurrentStep, P_Status, $(rows).eq(4).children());
   
}

function ctrlBoxArea3_Row2(P_CurrentStep, P_Status, divs) {
    if (P_CurrentStep != '1' || P_Status == '4') {
        //聯絡人
        var value = $(divs).eq(0).find('input').val();
        $(divs).eq(0).find('input').replaceWith('<div class="disable-text">' + value + '</div>');
        //聯絡人郵件地址
        var value = $(divs).eq(1).find('input').val();
        $(divs).eq(1).find('input').replaceWith('<div class="disable-text">' + value + '</div>');
    }
}

function ctrlBoxArea3_Row3(P_CurrentStep, P_Status, divs) {
    if (P_CurrentStep != '1' || P_Status == '4') {
        //發票管理人
        var invoiceName = $(divs).eq(3).children().eq(1).children().eq(0).text();
        $(divs).eq(3).children().eq(1).replaceWith('<div class="disable-text" id="invoiceLinks">' + invoiceName + '</div>');

        var DocNum = $("#DocNum").text();
        if (DocNum.substr(0, 3) == "BPR") {
            invoiceName = $("#invoiceLinks").find(".Links-peo").find("span").text()
            $(divs).eq(2).find(".area-1").replaceWith('<div class="disable-text" id="invoiceLinks">' + invoiceName + '</div>');
        }
    }
}

function ctrlBoxArea3_Row5(P_CurrentStep, P_Status, divs) {
    if (P_CurrentStep != '1' || P_Status == '4') {
        //採購備註
        var purchaseRemark = $('#PurchaseRemark').val();
        $(divs).eq(0).children().eq(1).replaceWith('<div class="disable-text" style="white-space:pre-line" id="PurchaseRemark">' + purchaseRemark + '</div>');
    }
}

//欄位唯讀
function FieldControl(target, context, value) {
    tagName = $(target)[0].tagName
    targetName = $(target).attr("name");    
        switch (tagName) {
            case "SELECT":
                $(target).after("<div>" + context + "</div>");
                $(target).after("<input type='text' name= " + targetName + " value = " + value + " style='display:none' />");
                $(target).remove();
                break;            
            default:
        }
}