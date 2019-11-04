//年度議價協議主檔json全域變數
var BPA;
//特殊合約明細json全域變數
var BPCDetail;
//特殊合約明細搜尋結果json全域變數
var BPCDetailResult;
//綠色採購選項全域變數
var GreenOption = $('<div>');
//供應商
var supplies;

$(function () {
    setFieldStatus($('#P_CurrentStep').val(), $('#P_Status').val());

    $(document).on(
        {
            mouseenter:
                function () {
                    $(this).find('#DeleteThisDetail').show();
                },
            mouseleave:
                function () {
                    $(this).find('#DeleteThisDetail').hide();
                }
        },
        "#bpaDetail tbody"
    )

    //取得後端Model
    BPA = getModel();

    //取得綠色採購
    getGreenCategory();

    //若CID存在，則直接帶入資料，不重新查詢核可的供應商清單(因為特殊合約會隨著時間推移而過期，變成不核可的供應商)
    supplies = BPA.FormStatus != 0 ? getExistSupplies() : getSupplies();

    //Edit or Create頁面處理
    loadFormData();

    //聯絡人onchange事件
    $('#ContactPerson').change(function () {
        BPA.ContactPerson = $(this).val();
    });

    //聯絡人郵件地址onchange事件
    $('#ContactEmail').change(function () {
        BPA.ContactEmail = $(this).val();
    });

    //採購備註onchange事件
    $('#PurchaseRemark').change(function () {
        BPA.PurchaseRemark = $(this).val();
    });

    //供應商發票地點onchange事件
    $('#invoiceAddress').change(function () {
        BPA.VendorSiteId = $(this).val();
        BPA.VendorSiteName = $(this).find('option:selected').text();
    });

    //全選特殊合約明細
    $('#contractDetailAll').change(function () {
        $('.contractDetail').prop('checked', $(this).prop('checked'));
    });

    //年度議價明細刪除
    $(document).on('click', '#bpaDetail .icon-cross', function () {
        if (BPA.YearlyContractDetailList.length > 1) {
            var check = confirm('請確認是否刪除？');
            if (check == true) {
                //var tr = $(this).closest('tr');
                var tr = $(this).parents('tr');
                var CDID = tr.attr('id');
                $.each(BPA.YearlyContractDetailList, function (index, element) {
                    if (element.CDetailID == CDID && !element.IsDelete) {
                        if (element.YCDetailID == 0) {
                            BPA.YearlyContractDetailList.splice(index, 1);
                        }
                        else {
                            element.IsDelete = true;
                            element.DeleteBy = BPA.FillInEmpNum;
                        }
                        return false;
                    }
                });
                BPCDetail.splice(tr.index(), 1);
                tr.remove();
                $('#bpaDetail').find('tr').find('td:first').each(function (index) {
                    $(this).text(index + 1);
                });
            }
        }
        else {
            alertopen("無法再進行刪除!")
        }
    });

    //移除特殊合約 or 供應商
    $(document).on('click', '.glyphicon-remove', function () {
        //var divID = $(this.closest('div .area-fix02-2')).attr('id');
        var divID = $(this).parents('div .area-fix02-2').attr('id');
        switch (divID) {
            case 'suppliesNameLinks':
                resetSuppliesInfo();
                resetContratInfo();
                break;
            case 'contratNoLinks':
                resetContratInfo();
                break;
            case 'invoiceLinks':
                BPA.InvoiceEmpName = null;
                BPA.InvoiceEmpNum = null;
                resetInvoiceEmp();
                break;
        }
        resetSubMenu();
    });

    //開啟供應商視窗前，出現提醒視窗
    $(document).on('click', '#SuppliesOpen', function () {
        if (BPA.VendorNum) {
            confirmopen(
                '修改此欄位會將所有資料清空，是否確認修改',
                function () {
                    resetSuppliesInfo();
                    resetContratInfo();
                    resetSubMenu();
                    setTimeout(function () {
                        openVendorSearchBox();
                    }, 50);
                },
                function () { }
            );
        }
        else {
            openVendorSearchBox();
        }
    });

    //開啟特殊合約明細查詢視窗前，出現提醒視窗
    $(document).on('click', '#ContractOpen', function () {
        if (BPA.CID != '00000000-0000-0000-0000-000000000000') {
            confirmopen(
                '修改此欄位會將所有特定請購資訊清空，是否確認修改',
                function () {
                    resetContratInfo();
                    resetSubMenu();
                    setTimeout(function () {
                        openModalContract();
                    }, 50);
                },
                function () { }
            );
        }
        else {
            openModalContract();
        }
    });

    //單價
    $(document).on('change', '#bpaDetail input:text', function () {
        //var tr = $(this).closest('tr');
        var tr = $(this).parents('tr');
        var CDID = tr.attr('id');
        var bpaPrice = accounting.unformat($(this).val());
        if (bpaPrice <= 0 || accounting.unformat(tr.find('.oriPrice').text()) < bpaPrice) {
            alertopen('議價單價必須大於0，且不可超過報價單價!');
            $(this).val(0);
        }
        else {
            $(this).val(numberNoRightPaddingZeros(bpaPrice, accounting.formatNumber(bpaPrice, BPA.ExtendedPrecision, ',')));
        }

        bpaPrice = accounting.unformat($(this).val());

        $.each(BPA.YearlyContractDetailList, function (index, element) {
            if (element.CDetailID == CDID && !element.IsDelete) {
                element.UnitPrice = bpaPrice;
                return false;
            }
        });
    });

    //是否決行
    $(document).on('change', '#bpaDetail input:radio', function () {
        var check = $(this).val() == 'True' ? true : false;
        //var CDID = $(this).closest('tr').attr('id');
        var CDID = $(this).parents('tr').attr('id');
        $.each(BPA.YearlyContractDetailList, function (index, element) {
            if (element.CDetailID == CDID && !element.IsDelete) {
                element.GeneralFlag = check;
                return false;
            }
        });
    });

    //綠色採購
    $(document).on('change', '#bpaDetail select', function () {
        var option = $(this).val();
        var option_text = $(this).find('option:selected').text();
        //var CDID = $(this).closest('tr').attr('id');
        var CDID = $(this).parents('tr').attr('id');
        $.each(BPA.YearlyContractDetailList, function (index, element) {
            if (element.CDetailID == CDID && !element.IsDelete) {
                element.GreenCategory = option;
                element.GreenCategoryName = option_text;
                return false;
            }
        });
    });

    //合約起始時間
    $('#StartDate').on('dp.change', function () {
        BPA.ContractStartDate = $(this).find('input').val();
        if (!BPA.ContractStartDate) {
            $('#EndDate input').val('').trigger('dp.change');
            return;
        }

        var date = new Date(BPA.ContractStartDate);
        var value = $('#EndDate input').val();
        $('#EndDate').data('DateTimePicker').minDate(date);
        $('#EndDate input').val(value).trigger('dp.change');
        if (BPA.ContractStartDate >= BPA.ContractEndDate) {
            date.setDate(date.getDate() + 1);
            $('#EndDate input').val(convertDateString(date)).trigger('dp.change');
        }
    });

    //合約結束時間
    $('#EndDate').on('dp.change', function () {
        BPA.ContractEndDate = $(this).find('input').val();
    });

    if (BPA.ContractStartDate) {
        $('#StartDate span').trigger('click');
    }
    if (BPA.ContractEndDate) {
        $('#EndDate span').trigger('click');
    }

    //ApplyItem
    initialApplyItem();
});

function openVendorSearchBox() {
    var result = getSupplies();
    openVendor(false, result);
}

//開啟特殊合約查詢
function openModalContract() {
    clearSearchCondition();
    $('#contractNoDrop').selectpicker();
    $('#contractNoDrop').empty();

    $.ajax({
        async: false,
        url: '/BPA/GetContractByVendor',
        dataType: 'json',
        type: 'POST',
        data: { suppliesNum: BPA.VendorNum },
        success: function (data, textStatus, jqXHR) {
            $.each(data, function (index, value) {
                $('#contractNoDrop').append('<option value="' + value.CID + '">' + value.BpcNum + '</option>');
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    $('#contractNoDrop').attr('data-live-search', $('#contractNoDrop option').length > 10 ? 'true' : 'false');
    $('#contractNoDrop').selectpicker('refresh');
    $('[data-remodal-id=modal-contract]').remodal().open();

    var checkBox = $('#searchResult input:checkbox');
    $.each(checkBox, function (index, item) {
        $(item).attr('checked', false);
    });
}

//清除搜尋內容
function clearSearchCondition() {
    $('#contractNoDrop').val('');
    $('#contractNoDrop').selectpicker('refresh');
    $('#purchasePICDrop').val('');
    $('#purchasePICDrop').selectpicker('refresh');
    $('#contractDescribe').val('');
    $('#searchResult').attr('style', 'display:none');
}

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

//搜尋判斷
function searchBtn() {
    var result = getCDetail($('#contractNoDrop').val(), $('#contractDescribe').val(), null);
    if (result) {
        $('#searchResult .popup-tbody ul').empty();
        $.each(result, function (index, value) {
            $('#searchResult .popup-tbody ul').append('<li>\
                            <label class="w100 label-box">\
                                <div class="table-box w5" id="'+ index + '">\
                                    <input name="www" class="contractDetail" type="checkbox">\
                                </div>\
                                <div class="table-box w5">' + (index + 1) + '</div>\
                                <div class="table-box w25">' + value.CategoryName + '</div>\
                                <div class="table-box w25">' + value.ItemDescription + '</div>\
                                <div class="table-box w5">' + value.UomName + '</div>\
                                <div class="table-box w5">' + value.CurrencyName + '</div>\
                                <div class="table-box w10">' + value.Price + '</div>\
                                <div class="table-box w10">' + value.PurchaseEmpName + '(' + value.PurchaseEmpNum + ')</div>\
                                <div class="table-box w10">' + value.InvoiceEmpName + '(' + value.InvoiceEmpNum + ')</div>\
                            </label>\
                        </li>');
        });
    }

    var contractNo = $('#contractNoDrop').val();
    if (contractNo != '') {
        $('#searchResult').attr('style', 'display:block');
    }
    else {
        alert("申請單號為必填")
    }
}

//根據CDetailID進行array排序
function compareCDetailIndex(a, b) {
    if (a.CDetailID < b.CDetailID)
        return -1;
    if (a.CDetailID > b.CDetailID)
        return 1;
    return 0;
}

//清空新增的明細(YCDetailID值為0)，將舊的明細IsDelete設定為true
function resetBPADetail() {
    BPA.YearlyContractDetailList = $.grep(BPA.YearlyContractDetailList, function (item, index) {
        return (item.YCDetailID != 0);
    });
    $.each(BPA.YearlyContractDetailList, function (index, item) {
        item.IsDelete = true;
        item.DeleteBy = BPA.FillInEmpNum;
    });
}

//查詢特殊合約明細後，按下帶入之動作
function appendDetail() {
    //先清空年度議價明細資訊
    resetBPADetail();

    $('#bpaDetail tbody').remove();

    //將核選的明細帶入BPA表單中議價明細
    var checkedList = $('input.contractDetail:checked').parents('li');
    var a = [];
    if (checkedList.length > 0) {
        BPCDetail = [];
        BPA.CID = $('#contractNoDrop').val();
        BPA.InvoiceEmpName = BPCDetailResult[0].InvoiceEmpName;
        BPA.InvoiceEmpNum = BPCDetailResult[0].InvoiceEmpNum;

        $.each(checkedList, function (index, item) {
            var temp = $(item).find('div');
            a.push({ CategoryName: $(temp[2]).text(), ItemDescription: $(temp[3]).text(), UomName: $(temp[4]).text(), Price: $(temp[6]).text(), CDetailID: $(temp[0]).attr('id') })
            BPCDetail.push(BPCDetailResult[$(temp[0]).attr('id')]);
        });
        a.sort(compareCDetailIndex);
        BPCDetail.sort(compareCDetailIndex);
        $.each(a, function (index, item) {
            var detail = {
                "CDetailID": BPCDetail[index].CDetailID,
                "CreateBy": BPA.FillInEmpNum,
                "DeleteBy": null,
                "GeneralFlag": true,    //預設為決行
                "GreenCategory": 'OTHERS',
                "GreenCategoryName": '其他',
                "IsDelete": false,
                "UnitPrice": 0,
                "YCDetailID": 0,
                "YCID": BPA.YCID
            };
            BPA.YearlyContractDetailList.push(detail);
        })

        //特殊合約編號
        contractSelectChange(true);
        //協議明細
        createBpaDetail();

        $('#bpaDetailBlock').show();

        resetSubMenu();
        $('div[data-remodal-id=modal-contract]').remodal().close();
    }
    else {
        alert("至少選擇一個明細");
    }
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
                        <td><input type="text" class="input h30" placeholder="填寫單價"></td>\
                        <td>\
                            <div class="w100 text-box">\
                                <label><input id="' + index + '_Y" name="' + index + '" type="radio" value="True"><span class="success-text">決行</span></label>\
                                <label><input id="' + index + '_N" name="' + index + '" type="radio" value="False"><span class="fail-text">不決行</span></label>\
                            </div>\
                        </td>\
                        <td>\
                            <div class="row">\
                                <div class="col-sm-10 content-box">\
                                    <div class="w90 text-box">\
                                        <select id="basic" class="selectpicker show-tick form-control select-h30" data-live-search="false" title="請選擇">\
                                            '+ GreenOption.html() + '\
                                        </select>\
                                    </div>\
                                </div>\
                                <div class="col-sm-2 content-box">\
                                    <div></div>\
                                    <div class="icon-remove-size" style="display:none" id="DeleteThisDetail" title="刪除欄位"><a class="icon-cross"></a></div>\
                                </div>\
                            </div>\
                        </td>\
                    </tr>'
                  );

        var jsonElement = $.grep(BPA.YearlyContractDetailList, function (element, jsonIndex) {
            return (element.CDetailID == item.CDetailID && !element.IsDelete);
        });
        if (jsonElement.length > 0) {
            //議價單價
            tr.find('input:text').val(numberNoRightPaddingZeros(jsonElement[0].UnitPrice, accounting.formatNumber(jsonElement[0].UnitPrice, BPA.ExtendedPrecision, ',')));

            //是否決行
            if (jsonElement[0].GeneralFlag) {
                tr.find('#' + index + '_Y').prop('checked', true);
            }
            else {
                tr.find('#' + index + '_N').prop('checked', true);
            }

            //綠色採購
            var selectDOM = tr.find('select');
            if ($('#P_CurrentStep').val() != '1' || $('#P_Status').val() == '4') {
                $(selectDOM).append('<option value="' + jsonElement[0].GreenCategory + '">' + jsonElement[0].GreenCategoryName + '</option>')
            }
            $(selectDOM).selectpicker();
            $(selectDOM).val(jsonElement[0].GreenCategory);
            $(selectDOM).selectpicker('refresh');

            if ($('#P_CurrentStep').val() != '1' || $('#P_Status').val() == '4') {
                var select = $(tr).find('select');
                $(tr).children().last().empty().append($('<div class="w100 text-box">').append(select));
                var input = $(tr).find('input').val();
                $(tr).children().eq(5).empty().text(input);
            }
        }
        $('#bpaDetail').append($('<tbody>').append(tr));
    });

    if ($('#P_CurrentStep').val() != '1' || $('#P_Status').val() == '4') {
        //$('#bpaDetail input:text').prop('disabled', true).addClass('input-disable');
        $('#bpaDetail input:radio:not(:checked)').prop('disabled', true);
        $('#bpaDetail select').prop('disabled', true).addClass('input-disable').selectpicker('refresh');
    }
}

//移除or重選供應商
function resetSuppliesInfo() {
    //供應商
    //$('#suppliesNameLinks .no-file-text').show();
    //$('#suppliesNameLinks .Links').hide();
    $('#VendorName').empty().append('<span class="undone-text">請點選右方【選擇】鈕選擇供應商</span>');
    $('#ApplyItem').val('供應商-');
    BPA.VendorName = null;
    BPA.VendorNum = null;
    $('#invoiceAddress').empty().val('').selectpicker('refresh');
    BPA.VendorSiteId = null;
    BPA.VendorSiteName = null;
    $('#ContactPerson').val('');
    BPA.ContactPerson = null;
    $('#ContactEmail').val('');
    BPA.ContactEmail = null;
    //核發資訊隱藏
    $('#bpaContentBlock').hide();
}

//移除or重選發票管理人
function resetInvoiceEmp() {
    if (BPA.InvoiceEmpNum) {
        if ($('#P_CurrentStep').val() == '1' && $('#P_Status').val() != '4') {
            $('#invoiceLinks .no-file-text').hide();
            $('#invoiceLinks span').text(BPA.InvoiceEmpName + '(' + BPA.InvoiceEmpNum + ')');
            $('#invoiceLinks .Links').show();
        }
        else {
            $('#invoiceLinks').text(BPA.InvoiceEmpName + '(' + BPA.InvoiceEmpNum + ')');
        }
    }
    else {
        $('#invoiceLinks .Links').hide();
        $('#invoiceLinks .no-file-text').show();
    }
}

//移除or重選特殊合約編號
function resetContratInfo() {
    //合約編號
    //$('#contratNoLinks .no-file-text').show();
    //$('#contratNoLinks .Links').hide();
    $('#contratNo').empty().append('<span class="undone-text">請點選右方【選擇】鈕選擇合約</span>');
    BPA.CID = '00000000-0000-0000-0000-000000000000';
    //合約申請人
    $('#contratApplicant').empty();
    //發票管理員
    BPA.InvoiceEmpName = null;
    BPA.InvoiceEmpNum = null;
    resetInvoiceEmp();
    //幣別
    $('#currency').text('');
    //匯率
    $('#exchangeRate').text('');
    BPA.ExchangeRate = 0;
    //合約起訖時間
    $('#StartDate input').val('').trigger('dp.change');
    $('#EndDate input').val('').trigger('dp.change');
    //明細資訊
    $('#bpaDetail tbody').remove();
    $('#bpaDetailBlock').hide();
    resetBPADetail();
}

//呼叫FIIS取得綠色採購下拉清單
function getGreenCategory() {
    if ($('#P_CurrentStep').val() == '1' && $('#P_Status').val() != '4') {
        $.ajax({
            async: false,
            url: '/BPA/GetGreenCategory',
            data: { source: 'BPA' },
            dataType: 'json',
            type: 'POST',
            success: function (data, textStatus, jqXHR) {
                $.each(data, function (index, value) {
                    GreenOption.append('<option value="' + value.greenProcureCategory + '">' + value.description + '</option>');
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    }
}

//開啟查詢供應商前，搜尋核可的供應商清單
function getSupplies() {
    var result;
    $.ajax({
        async: false,
        url: '/BPA/GetSupplies',
        dataType: 'json',
        type: 'POST',
        success: function (data, textStatus, jqXHR) {
            result = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            result = null;
        }
    });
    return result;
}

//供應商變更的UI操作
function suppliesUIChange() {
    $('#VendorName').empty().append(BPA.VendorName + '(' + BPA.VendorNum + ')');
    $('#ApplyItem').val('供應商-' + BPA.VendorName);
}

//載入特殊合約明細
function contractSelectChange(loadBySearch) {
    //特殊合約單號
    $('#contratNo').text(BPCDetail[0].BpcNum);

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
    //發票管理人
    resetInvoiceEmp();
    //合約幣別
    $('#currency').text(BPCDetail[0].CurrencyName + '(' + BPCDetail[0].CurrencyCode + ')');

    //匯率
    if ($('#P_CurrentStep').val() == '1' && $('#P_Status').val() != '4') {
        //getExchangeRate(BPCDetail[0].CurrencyCode);
        getCurrencyInfo(BPCDetail[0].CurrencyCode, BPCDetail[0].ExchangeRate);
    }

    $('#exchangeRate').text(BPA.ExchangeRate);

    if (loadBySearch) {
        //合約起訖
        var myDate = new Date(BPCDetail[0].ContractStartDate);
        $('#StartDate input').val(convertDateString(myDate)).trigger('dp.change');
        myDate = new Date(BPCDetail[0].ContractEndDate);
        $('#EndDate input').val(convertDateString(myDate)).trigger('dp.change');
    }
    else {
        var myDate = new Date();
        if (BPA.ContractStartDate) {
            myDate = new Date(BPA.ContractStartDate);
            $('#StartDate input').val(convertDateString(myDate)).trigger('dp.change');
        }

        if (BPA.ContractEndDate) {
            myDate = new Date(BPA.ContractEndDate);
            $('#EndDate input').val(convertDateString(myDate)).trigger('dp.change');
        }
    }
}

//取得幣別匯率
//不用了，改抓特殊合約存的匯率
//以防萬一user機掰又要改回來，留著
//function getExchangeRate(from) {
//    if (from == 'TWD') {
//        BPA.ExchangeRate = 1;
//        BPA.ExtendedPrecision = 0;
//    }
//    else {
//        $.ajax({
//            async: false,
//            url: '/FIIS/GetConversionRate?sourceCode=BPA&fromCurrencyCode=' + from + '&toCurrencyCode=TWD',
//            dataType: 'json',
//            success: function (data, textStatus, jqXHR) {
//                BPA.ExchangeRate = data.conversionRate;
//                BPA.ExtendedPrecision = data.extendedPrecision;
//            },
//            error: function (jqXHR, textStatus, errorThrown) {
//                alert('取得幣別匯率失敗!\n' + errorThrown);
//                BPA.ExchangeRate = 1;
//                BPA.ExtendedPrecision = 0;
//            }
//        });
//    }
//}

//取得幣別資訊
function getCurrencyInfo(from, rate) {
    if (from == 'TWD') {
        BPA.ExchangeRate = 1;
        BPA.ExtendedPrecision = 4;
    }
    else {
        $.ajax({
            cache: false,
            async: false,
            type: 'POST',
            url: '/BPA/GetCurrencyCode',
            data: { code: from },
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                BPA.ExchangeRate = rate;
                BPA.ExtendedPrecision = 4;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('取得幣別資訊失敗!\n' + errorThrown);
                BPA.ExchangeRate = rate;
                BPA.ExtendedPrecision = 4;
            }
        });
    }
}

//Get頁面取得供應商資料並顯示在UI上
function loadSupplies() {
    supplies = $.grep(supplies, function (element, index) {
        return element.VendorNum == BPA.VendorNum;
    });
    if (supplies.length > 0) {
        suppliesUIChange();
        $('#invoiceAddress').val(BPA.VendorSiteId);
        $('#bpaContentBlock').show();
    }
    else {
        alert('特定請購過期!');
        resetSuppliesInfo();
        resetContratInfo();
    }
}

//Get頁面
function loadFormData() {
    var today = new Date();
    if (!BPA.ApplicantName) {
        BPA.ApplicantEmpNum = $('input[name="ApplicantEmpNum"]').val();
        BPA.ApplicantName = $('input[name="ApplicantName"]').val();
        BPA.ApplicantDepName = $('input[name="ApplicantDepName"]').val();
        BPA.ApplicantDepId = $('input[name="ApplicantDepId"]').val();
    }
    if (BPA.BpaNum) {
        if (BPA.VendorNum) {
            loadSupplies();
        }
        if (BPA.PurchaseRemark) {
            $('#PurchaseRemark').val(BPA.PurchaseRemark).text(BPA.PurchaseRemark);
        }
        if (BPA.CID) {
            var idArray = [];
            $.each(BPA.YearlyContractDetailList, function (index, element) {
                idArray.push(element.CDetailID);
            });
            var cDetailIDList = idArray.join();
            BPCDetail = getCDetail(BPA.CID, null, cDetailIDList);
            if (BPCDetail.length) {
                contractSelectChange(false);
                $('#bpaDetailBlock').show();
            }
            if (BPA.YearlyContractDetailList.length > 0) {
                createBpaDetail();
            }
        }
        resetSubMenu();
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

function alertopen(text) {
    /// <summary>偉大的UI/UX說不要用醜醜的原生alert，改用remodal</summary>
    /// <param name="text" type="string or array">你想顯示給北七使用者的文字</param>

    $('#alertText').empty();
    if (typeof (text) != typeof ([])) {
        $('#alertText').text(text);
        $('[data-remodal-id=alert-modal]').remodal().open();
    }
    else {
        if (text.length < 1) {
            return;
        }
        $('#alertText').append(text.join("<br>"));
        $('[data-remodal-id=alert-modal]').remodal().open();
    }
}

function checkContractQuoteAmount() {
    var deferred = $.Deferred();
    $.ajax({
        url: '/BPA/CheckContractQuoteAmount/',
        dataType: 'json',
        type: 'POST',
        data: { cid: BPA.CID, quoteAmount: BPCDetail[0].QuoteAmount, bpcNum: BPCDetail[0].BpcNum, source: 'BPA' },
        success: function (data, textStatus, jqXHR) {
            if (!data) {
                alertopen('核發總金額已大於合約報價金額合計');
                deferred.reject();
            }
            else {
                deferred.resolve();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('取得已核發總金額失敗!\n' + errorThrown);
            deferred.reject();
        }
    });
    return deferred.promise();
}

function checkFieldValid() {
    //欄位資料檢核
    $('div[class="error-text"]').hide();

    var verifyDom = [];

    if (!BPA.VendorNum) {
        verifyDom.push('VendorNum');
    }

    if (!BPA.VendorSiteId) {
        verifyDom.push('VendorSiteId');
    }

    if (BPA.ContactEmail && !validateEmail(BPA.ContactEmail)) {
        verifyDom.push('ContactEmail');
    }

    if (BPA.CID == '00000000-0000-0000-0000-000000000000') {
        verifyDom.push('CID');
    }

    if (!BPA.InvoiceEmpNum) {
        verifyDom.push('InvoiceEmpNum');
    }

    if (!BPA.ContractStartDate) {
        verifyDom.push('StartDate');
    }

    if (!BPA.ContractEndDate) {
        verifyDom.push('EndDate');
    }

    var unSaveRow = $.grep(BPA.YearlyContractDetailList, function (item, index) {
        return !item.IsDelete;
    }).length;

    var invalidRow = $.grep(BPA.YearlyContractDetailList, function (item, index) {
        return (!item.IsDelete && (item.UnitPrice == 0 || item.GreenCategory == -1));
    }).length;

    if (unSaveRow == 0 || invalidRow > 0) {
        verifyDom.push('YearlyContractDetailList');
    }

    $.each(verifyDom, function (index, item) {
        $('div[RequiredField="' + item + '"][class="error-text"]').show();
    });

    if (verifyDom.length > 0) {
        $('html, body').animate({
            scrollTop: ($('div[RequiredField="' + verifyDom[0] + '"][class!="error-text"]').offset().top) - 50
        }, 500);
        return false;
    }
    else {
        return true;
    }
}

//前端欄位檢核卡控
function Verify() {
    var deferred = $.Deferred();

    if (checkFieldValid()) {
        if ($('#P_Status').val() == '0') {
            $.when(checkContractQuoteAmount()).done(function () {
                deferred.resolve();
            }).fail(function () {
                deferred.reject();
            });
        }
        else {
            deferred.resolve();
        }
    }
    else {
        deferred.reject();
    }

    return deferred.promise();
}

function Save() {
    var deferred = $.Deferred();

    var _url = BPA.BpaNum ? '/BPA/Edit' : '/BPA/Create';
    $.ajax({
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: BPA
    }).done(function (data, textStatus, jqXHR) {
        console.log('save finish');
        if (data.Flag) {
            _formInfo.formGuid = data.FormGuid;
            _formInfo.formNum = data.FormNum;
            _formInfo.flag = data.Flag;
        }
        else {
            _formInfo.flag = false;
            alertopen('儲存表單失敗!');
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
    }).always(function () {
        if (_formInfo.flag && _clickButtonType == 3) {
            $.when($.ajax({
                url: '/BPA/FIISCreateBpa/',
                dataType: 'json',
                type: 'POST',
                data: { yearlyContract: BPA, currencyCode: BPCDetailResult[0].CurrencyCode, referenceDocument: BPCDetailResult[0].BpcNum, contractDetailList: BPCDetailResult },
            }).done(function (data, textStatus, jqXHR) {
                console.log('FIISCreateBpa finish : done');
                if (typeof data != 'string') {
                    _formInfo.flag = data;
                }
                else {
                    alertopen(data);
                    _formInfo.flag = false;
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                alertopen(jqXHR.responseText);
                _formInfo.flag = false;
            })).always(function () {
                deferred.resolve();
            });
        }
        else {
            deferred.resolve();
        }
    });

    return deferred.promise();
}

//暫存
function draft() {
    blockPageForJBPMSend();
    var deferred = $.Deferred();
    var _url = BPA.BpaNum ? '/BPA/Edit' : '/BPA/Create';
    return $.ajax({
        cache: false,
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: BPA,
        success: function (data, textStatus, jqXHR) {
            _formInfo.formGuid = data.FormGuid;
            _formInfo.formNum = data.FormNum;
            _formInfo.flag = data.Flag;
            if (!data.Flag) {
                blockPage('');
                alertopen('儲存表單失敗!');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            blockPage('');
            alert(jqXHR.responseText);
            _formInfo.flag = false;
        }
    });
}

//組織樹輸出查詢結果(自行改寫區塊)
function BPAQueryTemp(datas, type, row) {
    BPA.InvoiceEmpName = datas[0].user_name;
    BPA.InvoiceEmpNum = datas[0].user_id;
    resetInvoiceEmp();
}

//確認選擇供應商，更新供應商名稱 & 重設側邊選單
function vendorSelected(vendor) {
    if (vendor) {
        BPA.VendorNum = vendor.supplierNumber;
        BPA.VendorID = vendor.supplierID;
        BPA.VendorName = vendor.supplierName;
        suppliesUIChange();

        $('#invoiceAddress').empty();
        $.each(vendor.supplierSite, function (index, element) {
            $('#invoiceAddress').append($('<option>').val(element.supplierSiteID).text(element.supplierSiteCode));
        });
        $('#invoiceAddress').val('').selectpicker('refresh');

        BPA.VendorSiteId = 0;
        BPA.VendorSiteName = null;

        $('#bpaContentBlock').show();
        resetContratInfo();
        resetSubMenu();
    }
}

//如關卡類別為依表單欄位，各表單需實作特定關卡取得下一關人員清單
function GetPageCustomizedList(stepSequence) {
    if (stepSequence == 3) {
        return { SignedID: [BPA.InvoiceEmpNum], SignedName: [BPA.InvoiceEmpName] };
    }
}

function OverrideOrgPickerSetting(step) {
    /// <summary>提供cbp-SendSetting.js針對「傳送其他主管同仁」按鈕做最後OrgPicker更改機會</summary>
    /// <param name="step" type="number">目前關卡數</param>

    if (step == 1) {
        return {
            allowRole: ["JA18000078"]
        };
    }
    if (step == 2) {
        return {
            allowRole: ["JA18000226"]
        };
    }
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