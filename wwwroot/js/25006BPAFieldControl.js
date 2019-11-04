function setFieldStatus(P_CurrentStep, P_Status) {
    var rows = $('#box-area-1').next().find('.row');
    ctrlBoxArea1_Row1(P_CurrentStep, P_Status, $(rows).eq(0).children());
    ctrlBoxArea1_Row2(P_CurrentStep, P_Status, $(rows).eq(1).children());

    rows = $('#box-area-2').next().find('.row');
    ctrlBoxArea2_Row1(P_CurrentStep, P_Status, $(rows).eq(0).children());
    ctrlBoxArea2_Row2(P_CurrentStep, P_Status, $(rows).eq(1).children());
    ctrlBoxArea2_Row3(P_CurrentStep, P_Status, $(rows).eq(2).children());
}

function ctrlBoxArea1_Row1(P_CurrentStep, P_Status, divs) {
    if (P_CurrentStep != '1' || P_Status == '4') {
        //供應商
        $(divs).eq(0).addClass('col-sm-4').removeClass('col-sm-3');
        $(divs).eq(0).find('div').eq(1).empty();
        //選擇按鈕
        $(divs).eq(1).remove();
        //地址下拉選單
        $(divs).eq(2).find('select').prop('disabled', true).addClass('input-disable');
    }
}

function ctrlBoxArea1_Row2(P_CurrentStep, P_Status, divs) {
    if (P_CurrentStep != '1' || P_Status == '4') {
        //聯絡人
        var value = $(divs).eq(0).children().eq(1).val();
        $(divs).eq(0).children().eq(1).replaceWith('<div class="disable-text" id="ContactPerson">' + value + '</div>');
        //聯絡人郵件地址
        value = $(divs).eq(1).children().eq(1).val();
        $(divs).eq(1).children().eq(1).replaceWith('<div class="disable-text" id="ContactEmail">' + value + '</div>');
    }
}

function ctrlBoxArea2_Row1(P_CurrentStep, P_Status, divs) {
    if (P_CurrentStep != '1' || P_Status == '4') {
        //特殊合約單號
        $(divs).eq(0).addClass('col-sm-4').removeClass('col-sm-3');
        $(divs).eq(0).find('div').eq(1).empty();
        //選擇按鈕
        $(divs).eq(1).remove();
        //發票管理人
        $(divs).eq(3).children().eq(1).replaceWith('<div class="disable-text" id="invoiceLinks"></div>');
    }
}

function ctrlBoxArea2_Row2(P_CurrentStep, P_Status, divs) {
    if (P_CurrentStep != '1' || P_Status == '4') {
        //合約起始時間
        $(divs).eq(2).children().eq(1).removeClass('datetimepicker1').children().addClass('input-disable').prop('readonly', true);
        //合約結束時間
        $(divs).eq(3).children().eq(1).removeClass('datetimepicker1').children().addClass('input-disable').prop('readonly', true);
    }
}

function ctrlBoxArea2_Row3(P_CurrentStep, P_Status, divs) {
    if (P_CurrentStep != '1' || P_Status == '4') {
        //採購備註
        $(divs).eq(0).children().eq(1).replaceWith('<div class="disable-text" style="white-space:pre-line" id="PurchaseRemark"></div>');
    }
}