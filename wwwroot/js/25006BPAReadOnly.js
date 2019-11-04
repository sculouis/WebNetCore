//年度議價協議主檔json全域變數
var BPA;
//特殊合約明細json全域變數
var BPCDetail;
//特殊合約明細搜尋結果json全域變數
var BPCDetailResult;
//供應商
var supplies;

//合約明細查詢Ajax
function getCDetail(cID, itemDescription, cDetailIDList) {
    $.ajax({
        async: false,
        url: '/BPA/GetCDetailByCID',
        dataType: 'json',
        type: 'POST',
        data: { cID: cID, itemDescription: itemDescription, cDetailIDList: cDetailIDList },
        success: function (data, textStatus, jqXHR) {
            BPCDetailResult = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return BPCDetailResult;
}

//建立年度議價協議明細
function createBpaDetail() {
    $.each(BPCDetail, function (index, item) {
        var tr = $(
                    '<tr id="' + item.CDetailID + '">\
                        <td class="text-center">' + (index + 1) + '</td>\
                        <td>' + item.CategoryName + '</td>\
                        <td>' + item.ItemDescription + '</td>\
                        <td>' + item.UomName + '</td>\
                        <td class="oriPrice">' + numberNoRightPaddingZeros(item.Price, accounting.formatNumber(item.Price, BPA.ExtendedPrecision, ',')) + '</td>\
                        <td class="unitPrice"></td>\
                        <td><div class="w100 text-box">\
                            <label><input id="' + index + '_Y" name="' + index + '" type="radio" value="True"><span class="success-text">決行</span></label>\
                            <label><input id="' + index + '_N" name="' + index + '" type="radio" value="False"><span class="fail-text">不決行</span></label>\
                        </td>\
                        <td><div class="w100 text-box">\
                            <select disabled class="input-disable selectpicker show-tick form-control select-h30" data-live-search="false" title="請選擇"></select>\
                        </td>\
                    </tr>'
                  );

        var jsonElement = $.grep(BPA.YearlyContractDetailList, function (element, jsonIndex) {
            return (element.CDetailID == item.CDetailID && !element.IsDelete);
        });
        if (jsonElement.length > 0) {
            //議價單價
            tr.find('.unitPrice').text(numberNoRightPaddingZeros(jsonElement[0].UnitPrice, accounting.formatNumber(jsonElement[0].UnitPrice, BPA.ExtendedPrecision, ',')));

            //是否決行
            if (jsonElement[0].GeneralFlag) {
                tr.find('#' + index + '_Y').prop('checked', true);
                tr.find('#' + index + '_N').prop('disabled', true);
            }
            else {
                tr.find('#' + index + '_N').prop('checked', true);
                tr.find('#' + index + '_Y').prop('disabled', true);
            }

            //綠色採購
            tr.find('select').val(jsonElement[0].GreenCategory);
            tr.find('select').append('<option selected value="' + jsonElement[0].GreenCategory + '">' + jsonElement[0].GreenCategoryName + '</option>')
        }
        $('#bpaDetail').append(tr);
    });
}

//供應商變更的UI操作
function suppliesUIChange() {
    $('#suppliesNameLinks').text(BPA.VendorName + '(' + BPA.VendorNum + ')');
}

//載入特殊合約明細
function contractSelectChange() {
    //特殊合約單號
    $('#contratNoLinks').text(BPCDetail[0].BpcNum);

    //合約申請人
    var depArray = BPCDetail[0].ApplicantDepName.split(',');
    $('#contratApplicant').empty();
    $('#contratApplicant').append('<span class="fL">' + BPCDetail[0].ApplicantName + '(' + BPCDetail[0].ApplicantEmpNum + ')</span>\
                                                <div class="info-note-box">\
                                                  <a class="info-bt icon-info text-blue-link "></a>\
                                                  <span class="info-note">\
                                                    <i></i>\
                                                    <ul class="info-list-text">\
                                                        <li>\
                                                            <span class="icon-account_balance"></span>\
                                                            <span>' + depArray[0] + '</span>\
                                                        </li>\
                                                        <li>\
                                                            <span class="icon-room"></span>\
                                                            <span>' + depArray[1] + '</span>\
                                                        </li>\
                                                        <li>\
                                                            <span class="icon-room"></span>\
                                                            <span>' + depArray[2] + '</span>\
                                                        </li>\
                                                    </ul>\
                                                  </span>\
                                                </div>');
    //合約幣別
    $('#currency').text(BPCDetail[0].CurrencyName + '(' + BPCDetail[0].CurrencyCode + ')');
    //匯率
    $('#exchangeRate').text(BPA.ExchangeRate);

    //合約起訖
    var myDate = new Date(BPA.ContractStartDate);
    $('#StartDate input').val(convertDateString(myDate)).trigger('dp.change');
    myDate = new Date(BPA.ContractEndDate);
    $('#EndDate input').val(convertDateString(myDate)).trigger('dp.change');
}

//Get頁面取得供應商資料並顯示在UI上
function loadSupplies() {
    supplies = $.grep(supplies, function (element, index) {
        return element.VendorNum == BPA.VendorNum;
    });
    if (supplies.length > 0) {
        $('#invoiceAddress').val(BPA.VendorSiteId);
        suppliesUIChange();
        $('#bpaContentBlock').show();
    }
}

//Get頁面
function loadFormData() {
    var today = new Date();
    if (BPA.BpaNum) {
        if (BPA.VendorNum) {
            loadSupplies();
        }
        if (BPA.CID) {
            var idArray = [];
            $.each(BPA.YearlyContractDetailList, function (index, element) {
                idArray.push(element.CDetailID);
            });
            var cDetailIDList = idArray.join();
            BPCDetail = getCDetail(BPA.CID, null, cDetailIDList);
            if (BPCDetail.length) {
                contractSelectChange();
                $('#bpaDetailBlock').show();
            }
            if (BPA.YearlyContractDetailList.length > 0) {
                createBpaDetail();
            }
        }
        resetSubMenu();
    }
    else {
        $('#DocNum').parent().remove();
        $('#CreateTime').text(today.getFullYear() + '/' + (today.getMonth() + 1) + "/" + today.getDate());
    }
}

//若CID存在，則直接帶入資料，不重新查詢核可的供應商清單(因為特殊合約會隨著時間推移而過期，變成不核可的供應商)
function getExistSupplies() {
    var result;
    $.ajax({
        async: false,
        url: '/BPA/GetExistSupplies',
        dataType: 'json',
        type: 'POST',
        data: { cid: BPA.CID, vendorNum: BPA.VendorNum },
        success: function (data, textStatus, jqXHR) {
            result = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            result = null;
        }
    });
    return result;
}

function Save() {
    var _url = BPA.BpaNum ? '/BPA/Edit' : '/BPA/Create';
    $.ajax({
        async: false,
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: BPA,
        success: function (data, textStatus, jqXHR) {
            if (data.Flag) {
                _formInfo.formGuid = data.FormGuid;
                _formInfo.formNum = data.FormNum;
                _formInfo.flag = data.Flag;
            }
            else {
                alert('失敗了!');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function convertDateString(date) {
    /// <summary>將日期轉換成yyyy-MM-dd格式</summary>
    /// <param name="date" type="Date">日期</param>

    var dateYear = date.getFullYear();
    var dateMonth = date.getMonth() + 1;
    if (dateMonth.toString().length < 2) {
        dateMonth = "0" + dateMonth.toString();
    }
    var dateDay = date.getDate();
    if (date.getDate().toString().length < 2) {
        dateDay = "0" + date.getDate().toString();
    }
    return dateYear + "-" + dateMonth + "-" + dateDay;
}

function numberNoRightPaddingZeros(num, formatNum) {
    /// <summary>accounting多餘的0去掉</summary>
    /// <param name="num" type="number">原始數字</param>
    /// <param name="formatNum" type="string">經過account format後的字串(含0)</param>

    var splitNum = num.toString().split(".");
    var splitFormatNum = formatNum.toString().split(".");

    var lengthNum = splitNum.length == 2 ? splitNum[1].length : 0;
    var lengthFormatNum = splitFormatNum.length != 2 ? 0 :
                            lengthNum != 0 ? splitFormatNum[1].length : splitFormatNum[1].length + 1;
    return formatNum.substring(0, formatNum.toString().length - (lengthFormatNum - lengthNum));
}

$(function () {
    //$.blockUI.defaults.css = {};
    //$(document).ajaxStart(function () {
    //    $('body').block({ message: "<h1><img src=\"\\Content\\images\\loading2.gif\" /></h1>" });
    //})
    //$(document).ajaxStop(function () {
    //    $('body').unblock();
    //})

    //取得後端Model
    BPA = getModel();

    //若CID存在，則直接帶入資料，不重新查詢核可的供應商清單(因為特殊合約會隨著時間推移而過期，變成不核可的供應商)
    supplies = getExistSupplies();

    //ReadOnly頁面處理
    loadFormData();

    //ApplyItem
    initialApplyItem();
});