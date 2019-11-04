//採購單主檔json全域變數
var PO;
//幣別精確度
var currency = {
    "currencyCode": null,
    "currencyName": null,
    "currencyDescription": null,
    "extendedPrecision": 0
};

//toggleText extend
$.fn.extend({
    toggleText: function (a, b) {
        return this.text(this.text() == b ? a : b);
    }
});

//列印
function ExportReport() {
    window.location.href = "/PO/Report/" + $("#DocNum").text();
}

//取得有小數位數長度，最大4位
function pointerPos(val) {
    var afterPointer = 0;
    if (val.indexOf('.') > -1) {
        //如果是浮點數，則小數位數最大4位
        var pointerStart = val.indexOf('.') + 1;
        afterPointer = val.substring(pointerStart).length;
        if (afterPointer > 4) {
            afterPointer = 4;
        }
    }
    return afterPointer;
}


//重新計算採購總金額
function reCalculatePoTotalPrice() {
    var sum = 0;
    var afterPointerLen = 0;
    $.each($('.itemTotalPrice'), function (index, element) {
        sum += accounting.unformat($(element).clone().children().remove().end().text());
        afterPointerLen = pointerPos($(element).clone().children().remove().end().text())
    });

    resetTotalPriceUI(sum,afterPointerLen);

    PO.Amount = sum;
}

function resetTotalPriceUI(sum, afterPointerLen) {
    var children = $('#poTotalPrice').children();
    if (sum != 0) {
        $(children).hide();
        //正整數或浮點數的顯示
        if (sum.toString().indexOf('.') > -1) {
            $('#poTotalPrice').text(accounting.formatNumber(sum, afterPointerLen, ",")).append(children);
        } else {
            $('#poTotalPrice').text(accounting.formatNumber(sum)).append(children);
        }
    }
    else {
        $(children).show();
        $('#poTotalPrice').text('').append(children);
    }
}

//重新計算送貨層明細金額
function reCalculateDeliveryPrice(tbody) {
    //var detailObjList = PO.PurchaseOrderDetailList.find(x=>x.QDetailID == $(tbody).attr('QDetailID') && x.IsDelete == false).PurchaseOrderDeliveryList;
    var detailObjList = _.pluck(_.where(PO.PurchaseOrderDetailList, { QDetailID: parseInt($(tbody).attr('QDetailID')), IsDelete: false }), "PurchaseOrderDeliveryList")[0];
    var itemAmout = Number($(tbody).find('td').eq(3).text());
    var itemPrice = accounting.unformat($(tbody).find('.itemPrice').val());
    var sum = 0;
    var allDelivery = $(tbody).find('.InnerDetailShowBar').nextAll();
    $.each(allDelivery, function (index, element) {
        var deliveryPrice = 0;
        if (index + 1 != $(allDelivery).length) {
            var startPointerLen = pointerPos(itemPrice.toString());
            deliveryPrice = MathRoundExtension(Number(accounting.unformat($(element).find('.deliveryAmount').val())) * itemPrice, startPointerLen);
            sum += deliveryPrice;
        }
        else {
            var startPointerLen = pointerPos(itemPrice.toString());
            deliveryPrice = MathRoundExtension(Number(accounting.unformat($(element).find('.deliveryAmount').val())) * itemPrice, startPointerLen);
            sum += deliveryPrice;
            //deliveryPrice = MathRoundExtension(itemAmout * itemPrice - sum, currency.extendedPrecision);
        }
        if (deliveryPrice == 0) {
            detailObjList[index].Amout = 0;
            $(element).find('td').eq(1).empty().append('<b class="undone-text">系統自動帶入</b>');
        }
        else {
            var startPointerLen = pointerPos(deliveryPrice.toString());
            var value = accounting.formatNumber(deliveryPrice, startPointerLen, ",");
            detailObjList[index].Amout = accounting.unformat(value);
            if (itemPrice.toString().indexOf(".") > -1) {
                $(element).find('td').eq(1).text(value);
            } else {
                $(element).find('td').eq(1).text(accounting.formatNumber(deliveryPrice));
            }
        }
    });
}

//浮點數進位顯示
function MathRoundExtension(x, decimalPlaces) {
    x = x * Math.pow(10, decimalPlaces);
    x = Math.round(x);
    x = x / Math.pow(10, decimalPlaces);
    return x
}

//判斷該PR決行層級是否高過董事長
function renderMeetingRecordRow() {
    $.ajax({
        url: '/PO/GetPRSigningLevel',
        dataType: 'json',
        type: 'POST',
        data: { prID: PO.PRID },
        success: function (data, textStatus, jqXHR) {
            if (data) {
                var $radios = $('input:radio[name=www]');
                $radios.filter('[value=true]').prop('checked', true);
                $('#MeetingRecordRow').show();
            }
            else {
                $('#MeetingRecordRow').hide();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function loadFormData() {
    if (PO.PRNum) {
        $('#POResultBlock').show(200);
        $('#PODetailBlock').show(200);
        //供應商
        $('#vendorNameResult').text(PO.VendorName + '(' + PO.VendorNum + ')');
        //發票地點
        $('#invoiceAddressResult').text(PO.VendorSiteName);
        //請購單號PRNum
        $('#PRNum').text(PO.PRNum);
        //報價單號QONum
        $('#QONum').text(PO.QuoteNum);
        //報價單幣別currency，中文名稱
        $('#currency').text(PO.CurrencyName);
        getCurrency(PO.CurrencyCode);
        //是否檢附董事會會議紀錄
        renderMeetingRecordRow();
        if (PO.MeetingRecord != 'null') {
            $('.MeetingRecord[value="' + PO.MeetingRecord + '"]').prop('checked', true);
            $('.MeetingRecord:not(:checked)').prop('disabled', true);
        }
        //總金額
        resetTotalPriceUI(PO.Amount);

        $.each(PO.PurchaseOrderDetailList, function (index, elementDetail) {
            var tmpTbody = $('#resultTmpBody').clone().attr('id', '').attr('QDetailID', elementDetail.QDetailID);
            //var detailRow1TD_search = $(element).find('#detailRow1 td');
            var detailRow1TD_result = $(tmpTbody).find('#detailRow1 td');
            //var detailRow2TD_search = $(element).find('#detailRow2 td');
            var detailRow2TD_result = $(tmpTbody).find('#detailRow2 td');

            //編號
            $(detailRow1TD_result[0]).text(index + 1);
            //採購分類
            $(detailRow1TD_result[1]).text(elementDetail.CategoryName);
            //品名描述
            $(detailRow1TD_result[2]).text(elementDetail.ItemDescription);
            //數量
            $(detailRow2TD_result[2]).text(elementDetail.LineQuantity != 0 ? elementDetail.LineQuantity : '');
            //單位
            $(detailRow2TD_result[3]).text(elementDetail.UomName)

            //議價單價
            $(detailRow2TD_result[1]).find('input').val(elementDetail.UnitPrice != 0 ? elementDetail.UnitPrice : '').addClass('input-disable').prop('disabled', true);
            //明細金額
            if (elementDetail.LineQuantity != 0 && elementDetail.UnitPrice != 0) {
                var price = MathRoundExtension(Number(elementDetail.UnitPrice) * Number(elementDetail.LineQuantity),currency.extendedPrecision);
                $(detailRow1TD_result[4]).text(price)
                var ExpandDetail = '<div class="btn-01-add ExpandDetail"><a><div class="glyphicon glyphicon-chevron-down  toggleArrow"></div></a></div>';
                $(detailRow1TD_result[4]).append(ExpandDetail)
            }
            //原幣報價單價
            var foreignPrice = elementDetail.ForeignPrice.toString();
            if (foreignPrice.indexOf('.') > -1) {
                var afterPointer = pointerPos(foreignPrice);
                foreignPrice = accounting.formatNumber(foreignPrice, afterPointer);  //加上千分位
            } else {
                foreignPrice = accounting.formatNumber(foreignPrice);  //加上千分位
            }
            $(detailRow2TD_result[0]).text(foreignPrice);

            //最低報價
            $(detailRow1TD_result[3]).text(elementDetail.IsMixPrice ? '是' : '否');

            $.each(elementDetail.PurchaseOrderDeliveryList, function (index, elementDelivery) {
                var tmpDeliveryTR = $(tmpTbody).find('#resultTmpDelivery').clone().attr('id', '');
                var deliveryTD_result = $(tmpDeliveryTR).find('td');
                //最高數量
                $(deliveryTD_result[0])
                    .children('input')
                    .attr('max', elementDelivery.MaxQuantity)
                    .attr('placeholder', '請輸入數量(上限' + elementDelivery.MaxQuantity + ')')
                    .text(elementDelivery.MaxQuantity)   //預設帶入上限值
                    .attr('PRDeliveryID', elementDelivery.PRDeliveryID)
                    .val(elementDelivery.Quantity > 0 && elementDelivery.Quantity < 1 ? elementDelivery.Quantity : accounting.unformat(elementDelivery.Quantity))
                    .addClass('input-disable')
                    .prop('disabled', true);

                //掛帳單位
                $(deliveryTD_result[2]).text(elementDelivery.ChargeDeptName);
                //收貨單位
                $(deliveryTD_result[3]).text(elementDelivery.RcvDeptName);
                $(tmpTbody).append(tmpDeliveryTR);
            });
            $(tmpTbody).find('#resultTmpDelivery').remove();
            $('#PODetailBlock table').append($(tmpTbody).show());
        });
        //$('#PODetailBlock tbody[id!="resultTmpBody"] .itemPrice').trigger('change');
        //resetSubMenu();
    }
}

function getCurrency(currencyCode) {
    $.ajax({
        async: false,
        url: '/PO/GetCurrency',
        dataType: 'json',
        type: 'POST',
        data: { currencyCode: currencyCode },
        success: function (data, textStatus, jqXHR) {
            currency = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            currency.extendedPrecision = 0;
            alert(errorThrown);
        }
    });
}

//document ready
$(function () {
    //取得後端Model
    PO = getModel();

    loadFormData();

    //展開
    $(document).on('click', '.ExpandDetail', function () {
        var trChevron = $(this).parents('tr').siblings();
        if ($(this).find('div.glyphicon-chevron-down').length > 0) {
            trChevron.show();
            trChevron.find('.ExpandInnerDetail').parents('tr').nextAll().show();
            trChevron.find('.ExpandInnerDetail').parents('tr').next().hide();
            trChevron.find('span').text('收合');
        }
        else if ($(this).find('div.glyphicon-chevron-up').length > 0) {
            trChevron.hide();
            $(this).find('span').text('展開');
        }
        $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    });
    //展開
    $(document).on('click', '.ExpandInnerDetail', function () {
        if ($(this).find('span').text() == '展開') {
            $(this).parents('tr').nextAll().show();
            $(this).parents('tr').next().hide();
        }
        else if ($(this).find('span').text() == '收合') {
            $(this).parents('tr').nextAll().hide();
            $(this).parents('tr').next().show();
        }
        $(this).find('span').toggleText('展開', '收合');
    });
    //展開
    $('.ExpandAllDetail').click(function () {
        if ($(this).find('div.list-open-icon').length > 0) {
            $(this).parents('table').find('tbody .ExpandDetail').each(function (index, element) {
                if ($(element).find('div.glyphicon-chevron-down').length > 0) {
                    $(element).trigger('click');
                }
            });
            $(this).parents('table').find('tbody .ExpandInnerDetail').each(function (index, element) {
                if ($(element).find('span').text() == '展開') {
                    $(element).trigger('click');
                }
            });
        } else if ($(this).find('div.list-close-icon').length > 0) {
            $(this).parents('table').find('tbody .ExpandDetail').each(function (index, element) {
                if ($(element).find('div.glyphicon-chevron-up').length > 0) {
                    $(element).trigger('click');
                }
            });
        }

        $(this).find('.toggleArrow').toggleClass('list-open-icon list-close-icon');
    });

    ////送貨層數量event
    $('#PODetailBlock').on('change', '.deliveryAmount', function () {
        var tbody = $(this).parents('tbody');
        if ($(tbody).attr('id') != 'resultTmpBody') {
            //var detailObj = PO.PurchaseOrderDetailList.find(x=>x.QDetailID == $(tbody).attr('QDetailID') && x.IsDelete == false);
            //var deliveryObj = detailObj ? detailObj.PurchaseOrderDeliveryList.find(y=>y.PRDeliveryID == $(this).attr('PRDeliveryID') && y.IsDelete == false) : null;
            var detailObj = _.find(PO.PurchaseOrderDetailList, { QDetailID: parseInt($(tbody).attr('QDetailID')), IsDelete: false })
            var deliveryObj = detailObj ? _.find(detailObj.PurchaseOrderDeliveryList, { PRDeliveryID: parseInt($(this).attr('PRDeliveryID')), IsDelete: false }) : null;

            deliveryObj.Quantity = $(this).val();
            var sum = 0;
            $.each($(tbody).find('.InnerDetailShowBar').nextAll(), function (index, element) {
                sum += Number(accounting.unformat($(element).find('.deliveryAmount').val()));
            });
            detailObj.LineQuantity = sum;
            $($(tbody).find('#detailRow2 td')[2]).text(sum > 999 ? accounting.formatNumber(sum) : sum);
            if (Number($(this).val()) > 999) {
                $(this).val(accounting.formatNumber($(this).val()));
            }
            $(tbody).find('.itemPrice').trigger('change');

            //不需檢查是否超過上限 
            //if (Number($(this).val()) > ($(this).attr('max'))) {
            //    alert('超過啦!');
            //    deliveryObj.Quantity = 0;
            //    $(this).val('').trigger('keyup');
            //}
            //else {
            //deliveryObj.Quantity = $(this).val();
            //var sum = 0;
            //$.each($(tbody).find('.InnerDetailShowBar').nextAll(), function (index, element) {
            //    sum += Number($(element).find('.deliveryAmount').val());
            //});
            //detailObj.LineQuantity = sum;
            //$($(tbody).find('#detailRow1 td')[3]).text(sum);
            //$(tbody).find('.itemPrice').trigger('change');
            //}
        }
    });

    //計算明細總金額event
    $('#PODetailBlock').on('change', '.itemPrice', function () {
        var tbody = $(this).parents('tbody');
        var detailRow1TD = $(tbody).find('#detailRow1 td');
        var detailRow2TD = $(tbody).find('#detailRow2 td');
        //var children = $(detailRow2TD[3]).children();
        var QDetailID = $(tbody).attr('QDetailID');
        //var detailObj = PO.PurchaseOrderDetailList.find(x=>x.QDetailID == $(tbody).attr('QDetailID') && x.IsDelete == false);
        var detailObj = _.find(PO.PurchaseOrderDetailList, { QDetailID: parseInt($(tbody).attr('QDetailID')), IsDelete: false })
        if ($(this).val()) {
            if ($(this).val().indexOf('.') > -1) {
                //如果是浮點數，則小數位數最大4位
                var afterPointerLen = pointerPos($(this).val());
                $(this).val(accounting.toFixed($(this).val(), afterPointerLen));
                detailObj.UnitPrice = $(this).val();
                //$(children[0]).hide();
                var price = MathRoundExtension(Number($(this).val()) * Number(accounting.unformat($(detailRow2TD[2]).text())), afterPointerLen);
                if (price.toString().indexOf('.') > -1) {
                    $(detailRow1TD[4]).empty()
                    $(detailRow1TD[4]).text(accounting.formatNumber(price, afterPointerLen)) //加上千分位
                    $(detailRow1TD[4]).append('<div class="btn-01-add ExpandDetail"><a><div class="glyphicon glyphicon-chevron-down  toggleArrow"></div></a></div>')
                } else {
                    $(detailRow1TD[4]).empty()
                    $(detailRow1TD[4]).text(accounting.formatNumber(price)) 
                    $(detailRow1TD[4]).append('<div class="btn-01-add ExpandDetail"><a><div class="glyphicon glyphicon-chevron-down  toggleArrow"></div></a></div>')
                }

                //$(detailRow1TD[3]).append(children);
                $(this).val(accounting.formatNumber($(this).val(), afterPointerLen, ","));
            } else {
                //$(this).val(accounting.toFixed($(this).val(), currency.extendedPrecision));
                detailObj.UnitPrice = $(this).val();
                //$(children[0]).hide();
                var price = Number(accounting.unformat($(this).val())) * Number(accounting.unformat($(detailRow2TD[2]).text()));
                $(detailRow1TD[4]).empty()
                $(detailRow1TD[4]).text(accounting.formatNumber(price))
                $(detailRow1TD[4]).append('<div class="btn-01-add ExpandDetail"><a><div class="glyphicon glyphicon-chevron-down  toggleArrow"></div></a></div>')
                $(this).val(accounting.formatNumber($(this).val()));
                ////$(this).val(accounting.formatNumber($(this).val(), currency.extendedPrecision, ","));
            }
        }
        else {
            detailObj.UnitPrice = 0;
            //$(children[0]).show();
            $(detailRow1TD[4]).text('');
            $(detailRow1TD[4]).append(children);
        }
        reCalculatePoTotalPrice();
        reCalculateDeliveryPrice(tbody);
    });
});

window.onload = function () {
    $('#PODetailBlock .deliveryAmount').trigger('change');
    resetSubMenu();
};