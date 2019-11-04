//採購單主檔json全域變數
var BPR;
//幣別精確度
var currency = {
    "currencyCode": null,
    "currencyName": null,
    "currencyDescription": null,
    "extendedPrecision": 4
};

var P_CurrentStep = $("#P_CurrentStep").val();
var P_Status = $("#P_Status").val();

//toggleText extend
$.fn.extend({
    toggleText: function (a, b) {
        return this.text(this.text() == b ? a : b);
    }
});

//重新計算採購總金額
function reCalculatePoTotalPrice() {
    var sum = 0;
    $.each($('.itemTotalPrice'), function (index, element) {
        sum += accounting.unformat($(element).clone().children().remove().end().text());
    });

    resetTotalPriceUI(sum);

    BPR.Amount = sum;
}

function resetTotalPriceUI(sum) {
    var children = $('#poTotalPrice').children();
    if (sum != 0) {
        $(children).hide();
        $('#poTotalPrice').text(accounting.formatNumber(sum, currency.extendedPrecision, ",")).append(children);
    }
    else {
        $(children).show();
        $('#poTotalPrice').text('').append(children);
    }
}

//重新計算送貨層明細金額
function reCalculateDeliveryPrice(tbody) {
    //var detailObjList = BPR.YearlyApprovedDetailList.find(x=>x.QDetailID == $(tbody).attr('QDetailID') && x.IsDelete == false).YearlyApprovedDeliveryList;
    var result = BPR.YearlyApprovedDetailList.find(
        function (x) {
            return x.PRDetailID == $(tbody).attr('PRDetailID') && x.IsDelete == false
        });
    var detailObjList = [];
    var detailObjList = result.YearlyApprovedDeliveryList;

    var itemAmout = Number($(tbody).find('td').eq(3).text());
    var itemPrice = accounting.unformat($(tbody).find('.itemPrice').val());
    var sum = 0;
    var allDelivery = $(tbody).find('.InnerDetailShowBar').nextAll();
    $.each(allDelivery, function (index, element) {
        var deliveryPrice = 0;
        if (index + 1 != $(allDelivery).length) {
            deliveryPrice = MathRoundExtension(Number($(element).find('.deliveryAmount').val()) * itemPrice, currency.extendedPrecision);
            sum += deliveryPrice;
        }
        else {
            deliveryPrice = MathRoundExtension(itemAmout * itemPrice - sum, currency.extendedPrecision);
        }
        if (deliveryPrice == 0) {
            detailObjList[index].Amout = 0;
            $(element).find('td').eq(1).empty().append('<b class="undone-text">系統自動帶入</b>');
        }
        else {
            var value = accounting.formatNumber(deliveryPrice, currency.extendedPrecision, ",");
            detailObjList[index].Amout = accounting.unformat(value);
            $(element).find('td').eq(1).text(value);
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


    function loadFormData() {
        if (P_CurrentStep != '1' || P_Status == '4') {
            $('#PRDetailSearchBlock').remove();
            $('#PRDetailTable').remove();
        }
        if (BPR.PRNum) {
            $('#POResultBlock').show(200);
            $('#BprDetailBlock').show(200);

            //供應商
            $('#vendorNameResult').text(BPR.VendorName + '(' + BPR.VendorNum + ')');
            //發票地點
            $('#invoiceAddressResult').text(BPR.VendorSiteName);
            //請購單號PRNum
            $('#PRNum').text(BPR.PRNum);
            //報價單號QONum
            $('#QONum').text(BPR.QuoteNum);
            //報價單幣別currency
            $('#currency').text(BPR.CurrencyName);
            $('#currencyRate').text(fun_accountingformatNumberdelzero(BPR.ExchangeRate));

            if ($("#P_Status").val() == 2) {
                ReleaseNum = GetReleaseNum(BPR.BprNum)
                $('#ReleaseNum').text(ReleaseNum);
            } else {
                $('#ReleaseNum').text("");
            }

            //總金額
            $("#poTotalPrice").text(fun_accountingformatNumberdelzero(BPR.Amount))
           // resetTotalPriceUI(fun_accountingformatNumberdelzero(BPR.Amount));
            //resetTotalPriceUI();
            $.each(BPR.YearlyApprovedDetailList, function (index, elementDetail) {
                var tmpTbody = $('#resultTmpBody').clone().attr('id', '').attr('QDetailID', elementDetail.QDetailID);
                var detailRow1TD_result = $(tmpTbody).find('#detailRow1 td');
                var detailRow2TD_result = $(tmpTbody).find('#detailRow2 td');

                //編號
                $(detailRow1TD_result[0]).text(index + 1);
                //採購分類
                $(detailRow1TD_result[1]).text(elementDetail.CategoryName);
                //品名描述
                $(detailRow1TD_result[2]).text(elementDetail.ItemDescription);
                //數量
                $(detailRow1TD_result[3]).text(elementDetail.LineQuantity != 0 ?  fun_accountingformatNumberdelzero(elementDetail.LineQuantity) : '');
                //單位
                $(detailRow1TD_result[4]).text(elementDetail.UomName);
                //議價單價
                $(detailRow1TD_result[5]).find('input').val(elementDetail.UnitPrice != 0 ? fun_accountingformatNumberdelzero(elementDetail.UnitPrice) : '').addClass('input-disable').prop('disabled', true);;
                //原幣報價單價
                $(detailRow2TD_result[0]).text(elementDetail.ForigenPrice);
                $(detailRow1TD_result[6]).text(fun_accountingformatNumberdelzero(elementDetail.UnitPrice * elementDetail.Quantity));
                //最低報價           

                var SubAmount = 0;
                $.each(elementDetail.YearlyApprovedDeliveryList, function (index, elementDelivery) {
                    var tmpDeliveryTR = $(tmpTbody).find('#resultTmpDelivery').clone().attr('id', ''); var deliveryTD_result = $(tmpDeliveryTR).find('td');
                    ////最高數量

                    $(deliveryTD_result[0]).text(fun_accountingformatNumberdelzero(elementDelivery.ShipmentQuantity));
                    $(deliveryTD_result[1]).text(fun_accountingformatNumberdelzero(elementDelivery.Amount));
                    //掛帳單位
                    $(deliveryTD_result[2]).text(elementDelivery.ChargeDept);
                    //收貨單位
                    $(deliveryTD_result[3]).text(elementDelivery.RcvDeptName);
                    $(deliveryTD_result[4]).text(elementDelivery.PRNum);
                    $(tmpTbody).append(tmpDeliveryTR);
                    SubAmount += elementDelivery.ShipmentQuantity;
                });

                $(detailRow1TD_result[3]).text(SubAmount != 0 ? fun_accountingformatNumberdelzero(SubAmount) : '');
                $(tmpTbody).find('#resultTmpDelivery').remove();
                $('#BprDetailBlock table').append($(tmpTbody).show());
            });

            if ($('#P_CurrentStep').val() != '1' || $('#P_Status').val() == '4') {
                $('#BprDetailBlock tbody[id!="resultTmpBody"] input').addClass('input-disable').prop('disabled', true);
            }
            resetSubMenu();
        }
    }

function GetReleaseNum(BprNum) {
    let Releasenum = 0;
    $.ajax({
        async: false,
        url: '/BPR/GetReleaseNum',
        dataType: 'json',
        type: 'POST',
        data: {
            BprNum: BprNum
        },
        success: function (data, textStatus, jqXHR) {
            ReleaseNum = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            currency.extendedPrecision = 0;
            alert(errorThrown);
        }
    });
    return ReleaseNum;
}

function getCurrency(currencyCode) {
    $.ajax({
        async: false,
        url: '/BPR/GetCurrency',
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
    $("#invoiceLinks").next(".area-btn-right-1").attr("style", "display:none")
    //取得後端Model
    BPR = getModel();
    loadFormData();

    $(".itemTotalPrice").each(function () {
        var value = $(this).text();
        $(this).text(fun_accountingformatNumberdelzero(value))
    })

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
            $(this).parents('table').find('.ExpandDetail').each(function (index, element) {
                if ($(element).find('div.glyphicon-chevron-down').length > 0) {
                    $(element).trigger('click');
                }
            });
            $(this).parents('table').find('tbody .ExpandInnerDetail').each(function (index, element) {
                if ($(element).find('span').text() == '展開') {
                    $(element).trigger('click');
                }
            });
        }
        else
            if ($(this).find('div.list-close-icon').length > 0) {
                $(this).parents('table').find('.ExpandDetail').each(function (index, element) {
                    if ($(element).find('div.glyphicon-chevron-down').length >= 0) {
                        $(element).trigger('click');
                    }
                });

                $(this).parents('table').find('tbody .ExpandInnerDetail').each(function (index, element) {
                    if ($(element).find('span').text() == '收合') {
                        $(element).trigger('click');
                    }
                });
            }      

        $(this).find('.toggleArrow').toggleClass('list-open-icon list-close-icon');
    });

    //送貨層數量event
    $('#PODetailBlock').on('change', '.deliveryAmount', function () {        
        var Value = $(this).val();
        if ((isNaN(Value) || Value < 0) || String(Value).indexOf('.') > -1) this.value = 0;
        var UnitAmount = $(this).val();
        var UnitPrice = Number($(this).parents('tbody').find('td').eq(5).text());
        var DetailPrice = UnitAmount * UnitPrice
        var sumPrice = 0;
        $(this).parents('tr').find('td').eq(1).text(DetailPrice);
        $(this).parents('tr').find('td').eq(1).attr('class', 'DeliveryPrice');
        $(this).parents('tbody').find('tr').eq(0).find('td').eq(6).attr('class', 'SubDetailPrice');
        var sumAmount = 0;
        $(this).parents('tbody').find('.deliveryAmount').each(function (index, element) {            
            if (!isNaN($(this).val() && $(this).val().length > 0)) {
                sumAmount += Number($(this).val());
            }
        })

        $(this).parents('tbody').find('tr').eq(0).find('td').eq(3).text(sumAmount == 0 ? "系統自動帶入" : sumAmount)
        var SubAmount = Number($(this).parents('tbody').find('td').eq(3).text() == "系統自動帶入" ? 0 : $(this).parents('tbody').find('td').eq(3).text())
        sumPrice = SubAmount * UnitPrice
        $(this).parents('tbody').find('tr').eq(0).find('td').eq(6).text(sumPrice)

        var sumDtail = 0;
        reCalculatePoTotalPrice();
        //設定BPR值
        var tbody = $(this).parents('tbody');

        if ($(tbody).attr('id') != 'resultTmpBody') {
            console.log(($(tbody).attr('PRDetailID')));           
            var detailObj = BPR.YearlyApprovedDetailList.find(function (x) { return x.PRDetailID == $(tbody).attr('PRDetailID') && x.IsDelete == false });

            var deliveryObj = $.find(detailObj.YearlyApprovedDeliveryList, function (y) { return y.PRDeliveryID === $(this).attr('PRDeliveryID') && y.IsDelete == false })
            if (Number($(this).val()) > ($(this).attr('max'))) {
                $(this).val(0);
                $(this).parents('tr').find('td').eq(1).text(0)

                sumAmount = 0;
                $.each($(tbody).find('.InnerDetailShowBar').nextAll(), function (index, element) {
                    sumAmount += Number($(element).find('.deliveryAmount').val());
                });
                alertopen('超過該筆送貨層上限了!');
                deliveryObj.ShipmentQuantity = 0;

                $(this).parents('tbody').find('tr').eq(0).find('td').eq(3).text(sumAmount);
                subUnitPrice = $(this).parents('tbody').find('tr').eq(0).find('td').eq(5).text();
                sumPrice = sumAmount * subUnitPrice;
                $(this).parents('tbody').find('tr').eq(0).find('td').eq(6).text(sumPrice)//明細表金額歸零
                reCalculatePoTotalPrice();
                reCalculateDeliveryPrice(tbody)
            }
            else {                
                var sum = 0;
                $.each($(tbody).find('.InnerDetailShowBar').nextAll(), function (index, element) {
                    sum += Number($(element).find('.deliveryAmount').val());
                });
                
                $($(tbody).find('#detailRow1 td')[3]).text(sum);

                if (detailObj != undefined) {
                    detailObj.UnitPrice = $(tbody).find("#detailRow1").find('td').eq(5).text();
                    detailObj.Amount = Number($(tbody).find("#detailRow1").find('td').eq(3).text());
                }
                reCalculateDeliveryPrice(tbody);
                reCalculatePoTotalPrice();
            }
        }
    });

    //明細金額event
    $('#PODetailBlock').on('change', '.itemPrice', function () {
        var tbody = $(this).parents('tbody');
        //議價金額大於報價金額，不做任何事
        var prices = $(this).parents('tbody');
        if ($(this).val() > prices.Price) {
            $(this).val('');

            alertopen("議價金額不可大於報價金額，請重新輸入");
        } else {
            var detailRow1TD = $(tbody).find('#detailRow1 td');
            var children = $(detailRow1TD[6]).children();            
            var YADetailID = $(tbody).attr('YADetailID');
            var detailObj = $.find(BPR.YearlyApprovedDetailList, function (x) { return x.YADetailID == $(tbody).attr('YADetailID') && x.IsDelete == false })

            if ($(this).val()) {
                $(this).val(accounting.toFixed($(this).val(), currency.extendedPrecision));
                detailObj.UnitPrice = $(this).val();
                $(children[0]).hide();
                var price = MathRoundExtension(Number($(this).val()) * Number($(detailRow1TD[3]).text()), currency.extendedPrecision);
                $(detailRow1TD[6]).text(accounting.formatNumber(price, currency.extendedPrecision, ","));
                $(detailRow1TD[6]).append(children);
                $(this).val(accounting.formatNumber($(this).val(), currency.extendedPrecision, ","));
            }
            else {                
                $(children[0]).show();
                $(detailRow1TD[6]).text('');
                $(detailRow1TD[6]).append(children);
            }
            reCalculatePoTotalPrice();
            reCalculateDeliveryPrice(tbody);
        }
    });
});
function ExportReport() {
    var id = BPR.BprNum;    
    window.location.href = "/BPR/Report/" + BPR.BprNum;
}

function fun_accountingformatNumberdelzero(val) {
    val = accounting.formatNumber(val, 4)
    reg = /\.[0-9]*0$/
    while (reg.test(val)) {
        val = val.replace(/0$/, '');
    }
    val = val.replace(/\.$/, '');
    return val;
}
window.onload = function () {
    $('#PODetailBlock .deliveryAmount').trigger('change');
    resetSubMenu();
};