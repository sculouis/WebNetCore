let _requiredIcon = '<b class="required-icon">*</b>';
let _currencyTypeChanged = true;
let _effectiveDate = '';
let _donateInfoSection = $.extend(true, {}, $('#DonateTable'));
let _firstSelectPleaseType = true;
let _isIncomeTaxGenerate = false;
let _moneyNegative = false;
let _previousAmount = 0;
let _alerttext = [];
var EPP;
//EPP.EPPNum;

$(function () {
    //$.blockUI.defaults.css = {};
    var pageLoadCount = 1;
    //$(document).ajaxStart(function () {
    //    $('body').block({
    //        message: "<h1><img src=\"\\Content\\images\\loading2.gif\" /></h1>"
    //    });
    //})
    //$(document).ajaxStop(function () {
    //    $('body').unblock();
    //})

    EPP = getModel();

    $('.PaymentWaySelect').attr("disabled", true);
    $('#PaymentWaySelect').addClass("input-disable");

    $('#PaymentMemoTextArea').bind('change', PaymentMemoChange);

    $('#ExchangeRateInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange);
    //$('#OriginalAmountInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange);
    //$('#OriginalTaxInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange);

    //==========================================
    // 幣別選擇
    //==========================================
    $(document).on('change', '#Currency', function () {
        $('.moneyfield').val(0).text(0);
        switch ($(this).val()) {
            case "USD":
                $('#CurrencyPrecisionDisable').text("2");
                $('#ExchangeRateInput').val(30.28);
                ForeignCurrency();
                break;
            case "JPY":
                $('#CurrencyPrecisionDisable').text("4");
                $('#ExchangeRateInput').val(0.2687);
                ForeignCurrency();
                break;
            case "EUR":
                $('#CurrencyPrecisionDisable').text("2");
                $('#ExchangeRateInput').val(35.87);
                ForeignCurrency();
                break;
            case "GBP":
                $('#CurrencyPrecisionDisable').text("2");
                $('#ExchangeRateInput').val(39.89);
                ForeignCurrency();
                break;
            case "CNY":
                $('#CurrencyPrecisionDisable').text("2");
                $('#ExchangeRateInput').val(4.59);
                ForeignCurrency();
                break;
            case "TWD":
                $('#CurrencyPrecisionDisable').text("1");
                $('#ExchangeRate').text("1");
                $('#ExchangeRateInput').val(1);
                nForeignCurrency();
                break;
            default:
                break;
        }
    });
    //==========================================
    // 供應商選擇
    //==========================================
    $(document).on('click', '#VendorConfirm', function () {
        if (vendorOutput == undefined) {
            return;
        }
        else {
            $('#VendorName').text(vendorOutput.VendorName);
            return;
        }

        //==========================================
        // 供應商所扣
        //==========================================
        $('#AccountSelectBtn').remove();
        let isIncomeDeducation = false;
        if (vendorOutput.IsIncomeDeduction == 'true') {
            isIncomeDeducation = true;
        }
        $('#IsIncomeDeduction').prop('checked', isIncomeDeducation).trigger('change');
        //==========================================
        // 是否為單獨付款
        //==========================================
        let isSinglePayment = false;
        if (vendorOutput.IsSinglePayment == 'true') {
            isSinglePayment = true;
        }
        $('#IsSinglePayment').prop('checked', isSinglePayment);
        //==========================================
        // 付款方式
        //==========================================
        PaymentWayAppend(vendorOutput.VendorType, vendorOutput.VendorNum);
    })

    //==========================================
    // 預付總額(原幣)*－數字檢核
    //==========================================
    $('#TotalPrepaymentsInput').on('change', function () {
        if (isNaN($('#TotalPrepaymentsInput').val())) {
            $('#TotalPrepaymentsInput').val(null);
            alertopen("輸入格式不正確，請重新輸入!");
        }
    });
    //==========================================
    // 帳號選擇
    //==========================================
    $(document).on('click', '#AccountOpen', function () {
        $('[data-remodal-id=SelectAccount]').remodal().open();
    });
    $(document).on('click', '#AccountConfirm', function () {
        let selectTarget = $('input[name="AccountSelector"]:checked').parents('li.AccountSelect');
        $('#RemmitanceFeeDisable').text($(selectTarget).find('div.popup-PaymentRemmitanceFee').text());
        $('#AccountDescriptionDisable').text($(selectTarget).find('div.popup-PaymentDescription').text());
        $('#PaymentBankDisable').text($(selectTarget).find('div.popup-PaymentBank').text());
        $('#PaymentAccountDisable').text($(selectTarget).find('div.popup-PaymentAccount').text());
        $('#PaymentNameDisable').text($(selectTarget).find('div.popup-PaymentName').text());
        $('#PaymentBranchDisable').text($(selectTarget).find('div.popup-PaymentBranch').text());
    });

    GetProjectCategory();

    //專案類別更改動作
    $("#ProjectTypeSelect").on("change", function () {
        $("#ProjectNameSelect").empty();
        $("#ProjectNameSelect").attr("selectedIndex", 0)

        $("#ProjectItemSelect").empty();
        $("#ProjectItemSelect").attr("selectedIndex", 0)

        $.ajax({
            url: '/Project/GetProjectDropMenu?ProjectCategoryCode=' + $("#ProjectTypeSelect").val(),
            dataType: 'json',
            type: 'GET',
            success: function (data, textStatus, jqXHR) {
                fun_setSelectOption($("#ProjectNameSelect"), data);
                result = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('「專案」取得失敗!');
            }
        });

        $("#ProjectNameSelect").selectpicker('refresh');
        $("#ProjectItemSelect").selectpicker('refresh');

        $("#ProjectItemSelect").attr("disabled", "disabled");
        $("#ProjectItemSelect").selectpicker('refresh');
    })

    //專案更改動作
    $("#ProjectNameSelect").on("change", function () {
        $("#ProjectItemSelect").empty();
        $("#ProjectItemSelect").attr("selectedIndex", 0)

        $.ajax({
            url: '/Project/GetProjectItemDropMenu?ProjectID=' + $("#ProjectNameSelect").val(),
            dataType: 'json',
            type: 'GET',
            success: function (data, textStatus, jqXHR) {
                fun_setSelectOption($("#ProjectItemSelect"), data);
                result = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('「專案項目」取得失敗!');
            }
        });

        $("#ProjectItemSelect").removeAttr("disabled");
        $("#ProjectItemSelect").selectpicker('refresh');

        if ($("#ProjectNameSelect").val() == null) {
            $("#ProjectItemSelect").attr("disabled", "disabled");
            $("#ProjectItemSelect").selectpicker('refresh');
        }
    })

    //==========================================
    // 分攤明細－帳務行
    //==========================================

    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetCoaCompany?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            FIIS_CoaCompanyOption($("#CoaCompany"), data);
            _coaDepartmentProduct = data;
        },
        error: function (data) {
            alert('「分攤明細－帳務行」取得失敗!');
        }
    })

    //==========================================
    // 分攤明細－會計項子目
    //==========================================

    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetCoaAccount?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            FIIS_CoaAccountOption($("#CoaAccount"), data);
            _coaDepartmentProduct = data;
        },
        error: function (data) {
            alert('「分攤明細－會計項子目」取得失敗!');
        }
    })

    //預付總額(原幣)*
    $("#TotalPrepaymentsInput").on('change', function () {
        $(this).val(accounting.formatNumber($("#TotalPrepaymentsInput").val()));
    });

    LoadEPPFormData(EPP);

    PaymentWayUISetting(EPP.PaymentInfo.PaymentMethod);
    DisableDOMObject($(".inputReadOnly"));
});

function PaymentWayUISetting(paymentWaySelected) {
    if ('WIRE' == paymentWaySelected) {
        $('.WireInfo').show();
    }
    else if ('BILLS_PAYABLE' == paymentWaySelected || 'CHECK' == paymentWaySelected) {
        $('.WireInfo').hide();
    }
    else {
        console.log('填表人是否選擇「付款方式」，「付款方式」為空');
    }
}

//==========================================
// 所在關卡：第二關卡－會計經辦
//==========================================
function AccountingCheckpoint() {
    $('.perchaseOrderListSelect').hide();
    $('#perchaseOrderListDisableText').show();

    if ($('#perchaseOrderListDisableText').text() == 'null') {
        $('#perchaseOrderListDisableText').text('');
    }

    //$('#perchaseOrderListDisableText').text($('#perchaseOrderList').val() == null ? '' : $('#perchaseOrderList').val());

    $('.ProjectTypeSelect').hide();
    $('#ProjectTypeDisableText').show();
    $('#ProjectTypeDisableText').text($('#ProjectTypeSelect').val());

    $('.ProjectNameSelect').hide();
    $('#ProjectNameDisableText').show();
    $('#ProjectNameDisableText').text($('#ProjectNameSelect').val());

    $('.ProjectItemSelect').hide();
    $('#ProjectItemDisableText').show();
    $('#ProjectItemDisableText').text($('#ProjectItemSelect').val());

    DisableDOMObject($('#IsSinglePayment'));

    $('.VoucherObjectSelect').hide();
    $('#VoucherObjectDisableText').show();
    $('#VoucherObjectDisableText').text($('#VoucherObjectSelect').val());

    SwitchInputToDisableText($('#PaymentRequestAbstractInput'), $('#PaymentRequestAbstractDisableText'));
    SwitchInputToDisableText($('#PaymentRequestDiscriptionInput'), $('#PaymentRequestDiscriptionDisableText'));

    $('#VendorOpen').hide();
    $('#UrgentDocument').show();

    $('#VendorName').removeClass("no-file-text").addClass("disable-text");

    $('#ExchangeRateInput').addClass("disable-text");
    DisableDOMObject($('#ExchangeRateInput'));

    DisableDOMObject($('#Currency'));

    SwitchInputToDisableText($('#ContractIdInput'), $('#ContractIdDisableText'));
    SwitchInputToDisableText($('#TotalPrepaymentsInput'), $('#TotalPrepaymentsDisableText'));
    SwitchInputToDisableText($('#PaymentMemoTextArea'), $('#PaymentMemoDisableText'));
    SwitchInputToDisableText($('#NegotiatePriceNumInput'), $('#NegotiatePriceNumDisableText'));
    SwitchInputToDisableText($('#ExportApplyAttributeInput'), $('#ExportApplyAttributeDisableText'));

    $('.AccountingItemNameDisableText').attr('disabled', true);
    $('.AccountingItemNameDisableText').addClass('input-disable');
    $('.AccountingItemNameDisableText').selectpicker('refresh');

    $('.ProfitCostCenterDisableText').attr('disabled', true);
    $('.ProfitCostCenterDisableText').addClass('input-disable');
    $('.ProfitCostCenterDisableText').selectpicker('refresh');

    $('.apportionmentOriginDollarInput').hide();
    $('.apportionmentOriginDollarInput').each(function (index, item) {
        $(this).siblings(".apportionmentOriginDollarText").text($(this).val()).show();
    });

    $('#appendApportionmentRow').hide();
    $('.icon-remove-size').hide();

    $('.VoucherAbstract').show();

    //==========================================
    // 依幣別判斷是否為急件
    //==========================================
    $(function () {
        switch ($('#Currency').val()) {
            case "TWD":
                $('#IsUrgency').attr('checked', false);
                break;

            default:
                $("#Currency").attr("checked", true);
                break;
        }
    });
}

//==========================================
// 取得專案類別
//=========================================
function GetProjectCategory() {
    var result;
    $.ajax({
        async: false,
        url: '/Project/GetProjectCategoryDropMenu',
        dataType: 'json',
        type: 'GET',
        success: function (data, textStatus, jqXHR) {
            fun_setSelectOption($("#ProjectTypeSelect"), data);
            result = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('取得 專案類別 失敗了!');
            result = null;
        }
    });
    return result;
}

//一般key/value option
function fun_setSelectOption(target, data) {
    //$(target).append($("<option></option>").attr("value", null).text("請選擇"));

    $.each(data, function (key, txt) {
        $(target).append($("<option></option>").attr("value", key).text(txt));
    })
    $(target).selectpicker('refresh');
}

//一般key/value option
function fun_setSelectedOption(target, data, selected) {
    $.each(data, function (key, txt) {
        $(target).append($("<option></option>").attr("value", key).text(txt));
        $(target).attr("value", selected); //如果要預設為選取時
        $(target).attr("selected", true); //觸發change事件
    })
    $(target).selectpicker('refresh');

    //var newOption = “新增選項”; //設定在選單中呈現的值
    //$(“#SelectOption”).append(newOption); //設定選取時的值
    //$(target).attr("value", selected); //如果要預設為選取時
    //$(target).attr("selected",true); //觸發change事件
    //$(“#SelectOption”).trigger(“change”);
}

//==============================
// 選取外幣
//==============================
function ForeignCurrency() {
    SwitchHideDisplay([$('#ExchangeRate'), $('#NegotiatePriceNumDisable'), $('#ExportApplyAttributeDisable')], [$('#ExchangeRateInput'), $('#NegotiatePriceNumInput'), $('#ExportApplyAttributeInput')]);
    AppendRequired($('#NegotiatePriceNumTitle'));
    AppendRequired($('#ExportApplyAttributeTitle'));
    if (_currencyTypeChanged) {
        alertopen("外幣付款請於取得議價編碼當日內，傳送請款單及提交匯出匯款申請書至會計經辦");
        _currencyTypeChanged = false;
    }
}
//==============================
// 選取本幣
//==============================
function nForeignCurrency() {
    SwitchHideDisplay([$('#ExchangeRateInput')], [$('#ExchangeRate')])
    RemoveRequired($('#NegotiatePriceNumTitle'));
    RemoveRequired($('#ExportApplyAttributeTitle'));
    _currencyTypeChanged = true;
}
//==============================
// 清空Input欄位
//==============================
function EmptyObj(emptyObj) {
    $.each(emptyObj, function (index, item) {
        $(item).val('');
    });
}
//==============================
// 重新計數表格
//==============================
//function RenumberingDetail(renumberingObj, sernoClass) {
//    $.each(renumberingObj, function (index, item) {
//        $(item).find('.' + sernoClass).text(index + 1);
//    });
//}

//==============================
//付款附言(備註)長度全形半形檢核
//==============================
String.prototype.PaymentMemoLength = function () {
    return this.replace(/[^\x00-\xff]/g, "rr").length;
}

//==============================
//付款附言(備註)輸入檢核
//==============================
function PaymentMemoChange(e) {
    var regExp5 = /[\w]\+$/;

    $('.moneyfield').val(0).text(0);

    switch ($('#Currency').val()) {
        case "TWD":

            if ($(e.target).val().PaymentMemoLength() > 39) {
                alertopen('輸入格式錯誤! 僅限不得大於39個半形字');
                $(e.target).val("");
                return;
            }
            break;

        default:

            var regExp = /^[\s\dA-Za-z0-9]*$/
            var regExp_1stChar = /^:/

            if (regExp.test($(e.target).val())) {
            }
            else {
                alertopen('輸入格式錯誤!  僅接受半形英文字母、數字、空白、(、)、,、.、-、:、+、’。(第一字元不可為:)');
                $(e.target).val("");
                return;
            }

            if (regExp_1stChar.test($(e.target).val())) {
                alertopen('輸入格式錯誤!  僅接受半形英文字母、數字、空白、(、)、,、.、-、:、+、’。(第一字元不可為:)');
                $(e.target).val("");
                return;
            }

            if ($(e.target).val().length > 136) {
                alertopen('輸入格式錯誤! 僅限不得大於136個半形字');
                $(e.target).val("");
                return;
            }

            break;
    }
}

//==============================
//貨幣更動時檢查合理性
//==============================
function MoneyChange(e) {
    if ($(e.target).attr('class').includes('emptyMoneyField')) {
        let confirmResult = false;
        confirmopen("更動此欄位將會清空所有金額相關欄位，是否繼續?",
        function () {
            $('.moneyfield').val(0).text(0);
        },
        function () {
            $(e.target).val(_previousAmount);
            confirmResult = true;
        });
        if (confirmResult) {
            return;
        }
    }
    if (_moneyNegative && $(e.target).val() > 0) {
        alertopen("請款類別為折讓,金額必須小於零");
        $(e.target).val(_previousAmount);
    }
    if (!_moneyNegative && $(e.target).val() < 0) {
        alertopen("請款類別非折讓，金額必須大於零");
        $(e.target).val(_previousAmount);
    }
    if ($('#CurrencyPrecisionDisable').text() == 1) {
        $(e.target).val($(e.target).val().split('.')[0])
        return;
    }
    if ($(e.target).val().split('.')[1] != undefined) {
        if ($(e.target).val().split('.')[1].length > $('#CurrencyPrecisionDisable').text()) {
            alertopen('輸入值不符合幣別精確度');
            $(e.target).val(0);
            return;
        }
    }
}
//==============================
// 請款明細層,重新計算金額
//==============================
function recalculateMoney(e) {
    let $this = $(e.target).parents('tr');

    let amount = $this.find('#ENPDetailOriginalAmountInput').val();
    let tax = $this.find('#ENPDetailOriginalTaxInput').val();
    let exchangeRate = $('#ExchangeRateInput').val();
    $this.find('#ENPDetailOriginalSaleAmountDisable').text(MathRoundExtension(amount - tax, $('#CurrencyPrecisionDisable').text()))
    $this.find('#ENPDetailTWDAmountDisable').text(Math.round(amount * exchangeRate))
    $this.find('#ENPDetailTWDTaxDisable').text(Math.round(tax * exchangeRate))

    let amountTWD = $this.find('#ENPDetailTWDAmountDisable').text();
    let taxTWD = $this.find('#ENPDetailTWDTaxDisable').text();
    $this.find('#ENPDetailTWDSaleAmountDisable').text(parseInt(amountTWD) - parseInt(taxTWD));
    //==============================
    // 將請款明細改變的金額寫至主表單中
    //==============================
    let totalAmountTWD = 0;
    let totalTaxTWD = 0;
    $.each($this.parents('table').find('tbody'), function (index, item) {
        let $currentItem = $(item).find('tr').eq(2);
        totalAmountTWD += parseInt($currentItem.find('#ENPDetailTWDAmountDisable').text());
        totalTaxTWD += parseInt($currentItem.find('#ENPDetailTWDTaxDisable').text());
    });
    $('#TWDAmountMaster').text(totalAmountTWD);
    $('#TWDTaxMaster').text(totalTaxTWD);
    recalculateAmortizationRatio();
    PrePayMentAmountCal();
}

//==============================
// 請款類別重新選擇時初始化
//==============================
function initPleaseTypeSet() {
    let e = $('#PleaseType')
    removeAllData();
    switch ($(e).val()) {
        case 'PleasePayment':
            PleasePaymentSet();
            break;
        case 'Discount':
            DiscountSet();
            break;
        case 'Donate':
            DonateSet();
            break;
    }
    if ($('#CertificateDate').data('DateTimePicker') != null) {
        DisableDOMObject($('#CertificateDate'));
    }
    $('#CertificateDateInput').val('');
    $('#InvoiceExpiredDescriptionInput').val('');
    $('#CrossYearVoucherNumInput').val('');
    $('#ExportApplyAttributeInput').val('');

    SwitchHideDisplay([$('#CertificateNumInput')], [$('#CertificateNumDisable')])
    RemoveRequired($('#CertificateNumTitle'));
    EmptyObj([$('#CertificateNumInput')]);
}
//==============================
// 移除請款資訊...等資料
//==============================
function removeAllData() {
    $('#ENPDetailTable').remove();
    $('#AmortizationDetailTable').remove();
    $.each($('#DonateTable').find('input'), function (index, item) {
        $(item).val('');
    });
    if ($('#AmortizationDetailCreate').length < 1) {
        $('#AmortizationDetailRoot').append(
            '<div class="area-btn-center-box" id="AmortizationDetailCreate">\
                <div class="area-btn-center">\
                    <b class="w100"><a>按此新增分攤明細或上傳分攤明細</a></b>\
                </div>\
            </div>'
        );
    };

    if ($('#ENPDetailCreate').length < 1) {
        $('#ENPDetailRoot').append(
            '<div class="area-btn-center-box" id="ENPDetailCreate">\
                <div class="area-btn-center">\
                    <b class="w100"><a>按此新增請款明細</a></b>\
                </div>\
            </div>'
        );
    }
}
//==============================
// 計算金額至幣別精確度小數點位數
//==============================
function MathRoundExtension(x, decimalPlaces) {
    if (decimalPlaces == 1 && parseInt($('#CurrencyPrecisionDisable').text()) == 1) {
        x = Math.round(x);
    } else {
        x = x * Math.pow(10, decimalPlaces);
        x = Math.round(x);
        x = x / Math.pow(10, decimalPlaces);
    }
    return x
}
//==============================
// 記錄金額更動前數值
//==============================
function RecordPreviousVal(e) {
    _previousAmount = $(e.target).val();
}
//==============================
//使DOM元件失效
//==============================
function SwitchInputToDisableText(ObjInput, ObjDisableText) {
    $(ObjInput).hide();
    $(ObjDisableText).text(ObjInput.val());
    $(ObjDisableText).show();
}
//==============================
//使DOM元件失效
//==============================
function DisableDOMObject(obj) {
    $(obj).attr('disabled', true);
    if ($(obj)[0].tagName === 'SELECT') {
        $(obj).addClass('input-disable');
        $(obj).selectpicker('refresh');
    };
    if ($(obj)[0].tagName === 'DIV') {
        $(obj).data('DateTimePicker').destroy();
        $(obj).find('input').addClass('input-disable')
        $(obj).find('span').addClass('input-disable')
    }
}
//==============================
//使DOM元件有效
//==============================
function EnableDOMObject(obj) {
    $(obj).attr('disabled', false);
    if ($(obj)[0].tagName === 'SELECT') {
        $(obj).removeClass('input-disable');
        $(obj).parent('div').removeClass('input-disable');
        $(obj).selectpicker('refresh');
    };
    if ($(obj)[0].tagName === 'DIV') {
        $(obj).datetimepicker({
            format: 'YYYY-MM-DD'
        });
        $(obj).find('input').removeClass('input-disable')
        $(obj).find('span').removeClass('input-disable')
    }
}
//==============================
//切換隱藏/顯示DOM元件
//==============================
function SwitchHideDisplay(hideObj, displayObj) {
    $.each(hideObj, function (index, item) {
        $(item).hide();
    })

    $.each(displayObj, function (index, item) {
        $(item).show();
    })
}
//==============================
// 必填新增
//==============================
function AppendRequired(appendObj) {
    $.each(appendObj, function (index, item) {
        if (!$(item).find('.required-icon').length > 0) {
            $(item).append(_requiredIcon);
        }
    });
}
//==============================
// 必填移除
//==============================
function RemoveRequired(appendObj) {
    $.each(appendObj, function (index, item) {
        $(item).find('b.required-icon').remove();
    })
}
//==============================
// 付款方式案例
//==============================
function PaymentWayAppend(type, num) {
    let PaymentWaySelect = $('#PaymentWaySelect');
    AppendRequired([$('#PaymentWaySelectTitle')])
    $('#PaymentWaySelect option').remove();
    if (type == 'GeneralSupplier') {
        $(PaymentWaySelect).append(
            $('<option>', { value: 'wireTransfer', text: '電匯' }),
                $('<option>', {
                    value: 'check', text: '支票'
                })
        );
        $(PaymentWaySelect).selectpicker({ title: '請選擇' }).selectpicker('render');
        EnableDOMObject($(PaymentWaySelect));
    }
    else {
        switch (num) {
            case '103823':
                $(PaymentWaySelect).append($('<option>', {
                    value: 'wireTransfer', text: '電匯', selected: true
                }));
                $(PaymentWaySelect).selectpicker({ title: '請選擇' }).selectpicker('render');
                DisableDOMObject($(PaymentWaySelect));
                $(PaymentWaySelect).trigger('change');
                break;
            case '103824':
                $(PaymentWaySelect).append($('<option>', {
                    value: 'check', text: '支票', selected: true
                }));
                $(PaymentWaySelect).selectpicker({ title: '請選擇' }).selectpicker('render');
                DisableDOMObject($(PaymentWaySelect));
                $(PaymentWaySelect).trigger('change');
                break;
        }
    }
}
//==============================
// Remodal Alert&Confirm
//==============================
function alertopen(text) {
    $('#alertOK').unbind();
    if (typeof (text) != typeof ([])) {
        $('#alertText').text(text);
        $('[data-remodal-id=alert-modal]').remodal().open();
    }
    else {
        if (_alerttext.length < 1) {
            return;
        }
        $('#alertText').text(_alerttext[0]);
        if (_alerttext.length > 0) {
            _alerttext = _alerttext.slice(1, _alerttext.length);
        }
        $('[data-remodal-id=alert-modal]').remodal().open();
        $('#alertOK').on('click', alertopen);
    }
}

function LoadEPPFormData(FormData) {
    $('#perchaseOrderList').val(FormData.PONum);

    $('#vatRegistrationNumberDisableText').text(FormData.IDNo == null ? '' : FormData.IDNo);

    switch (FormData.PaymentStatus) {
        case 0:
        case 1:
            $('#PaymentStatus').text('請款審核中');
            break;
        case 2:
            $('#PaymentStatus').text('已放行等待付款');
            break;
        case 3:
            $('#PaymentStatus').text('已付款');
            break;
        case 4:
            $('#PaymentStatus').text('已結案');
            break;
        case 5:
            $('#PaymentStatus').text('已退回');
            break;

        default:
    }

    $('#ProjectTypeSelect option[value=' + FormData.ProjectCategory + ']').attr("selected", "selected");
    $("#ProjectTypeSelect").selectpicker('refresh');

    ////////////////////////////////////////////////////////////
    ///////////////////////取得專案/////////////////////////////
    ////////////////////////////////////////////////////////////

    $("#ProjectNameSelect").empty();
    $("#ProjectNameSelect").attr("selectedIndex", 0)

    $("#ProjectItemSelect").empty();
    $("#ProjectItemSelect").attr("selectedIndex", 0)

    //let ProjectSelectedValue = "";

    $.ajax({
        url: '/Project/GetProjectDropMenu?ProjectCategoryCode=' + $("#ProjectTypeSelect").val(),
        dataType: 'json',
        type: 'GET',
        success: function (data, textStatus, jqXHR) {
            fun_setSelectOption($("#ProjectNameSelect"), data);
            result = data;
            $('#ProjectNameSelect option[value=' + FormData.Project + ']').attr("selected", "selected");
            $("#ProjectNameSelect").selectpicker('refresh');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('「專案」取得失敗!');
        }
    });

    $("#ProjectNameSelect").selectpicker('refresh');
    $("#ProjectItemSelect").selectpicker('refresh');

    $("#ProjectItemSelect").attr("disabled", "disabled");
    $("#ProjectItemSelect").selectpicker('refresh');

    ////////////////////////////////////////////////////////////////
    ///////////////////////取得專案項目/////////////////////////////
    ////////////////////////////////////////////////////////////////

    $("#ProjectItemSelect").empty();
    $("#ProjectItemSelect").attr("selectedIndex", 0)

    $.ajax({
        url: '/Project/GetProjectItemDropMenu?ProjectID=' + FormData.Project,
        dataType: 'json',
        type: 'GET',
        success: function (data, textStatus, jqXHR) {
            fun_setSelectOption($("#ProjectItemSelect"), data);
            result = data;

            $('#ProjectItemSelect option[value=' + FormData.ProjectItem + ']').attr("selected", "selected");
            $("#ProjectItemSelect").selectpicker('refresh');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('「專案項目」取得失敗!');
        }
    });

    $("#ProjectItemSelect").removeAttr("disabled");
    $("#ProjectItemSelect").selectpicker('refresh');

    if ($("#ProjectNameSelect").val() == null) {
        $("#ProjectItemSelect").attr("disabled", "disabled");
        $("#ProjectItemSelect").selectpicker('refresh');
    }

    if (EPP.EPPNum != null) {
        $('#Currency').val(FormData.Currency);
        $('#CurrencyPrecisionDisable').text(FormData.CurrencyPrecise);
        $('#ExchangeRateInput').val(FormData.Rate);

        if (FormData.Currency == 'TWD') {
            SwitchInputToDisableText($('#ExchangeRateInput'), $('#ExchangeRate'));

            //$(ObjInput).hide();
            //$(ObjDisableText).text(ObjInput.val());
            //$(ObjDisableText).show();
        }
        else {
            $('#ExchangeRate').hide();
            $('#ExchangeRateInput').text($('#ExchangeRate').val());
            $('#ExchangeRateInput').show();
        }
    }

    $('#ContractIdInput').val(FormData.ContractNum);
    $('#ExportApplyAttributeInput').val(FormData.ExportApplyAttribute);
    $('#TotalPrepaymentsInput').val(FormData.PreAmount);
    $('#totalOriginDollar').text(accounting.formatNumber(FormData.OriginalAmount));
    $('#totalNTDollar').text(accounting.formatNumber(FormData.TWDAmount));
    $('#PaymentTWD').text(accounting.formatNumber(FormData.PaymentAmount));

    //EPP.EXPMaster-費用主檔

    //EPP.EXPID  = $('#').val(FormData.);
    $('#ExpenseKind').val(FormData.ExpenseKind);
    //$('#VendorName').text(FormData.VendorName);
    $('#suppliesName').text(FormData.VendorName + '(' + FormData.VendorNum + ')');
    $('#PaymentStatus').val(FormData.PaymentStatus);
    debugger
    $("#IsUrgency").prop("checked", FormData.Emergency);

    $("#IsSinglePayment").prop("checked", FormData.PayAlone);

    $('#expectPaymentDate').text(FormData.EstimatePayDateToString);
    $('#paymentDateInput').val(FormData.ExceptedPaymentDateToString);
    $('#VoucherObjectSelect').val(FormData.VoucherBeau);

    //$('#accpaymentDate').val(FormData.Books);
    //$('#accpaymentDate').val(FormData.BooksName);

    $('#PaymentRequestAbstractInput').val(FormData.HeaderDesc);
    $('#PaymentRequestDiscriptionInput').val(FormData.ExpenseDesc);

    $('#VoucherObjectDisableText').text(FormData.VoucherBeauName + ' ' + FormData.VoucherBeau);  //憑證開立對象

    $("#AccountBankDisable").text(FormData.Books + ' ' + FormData.BooksName);  //憑證開立對象的「帳務行」

    //PaymentInfo-付款資訊檔
    //EPP.PaymentInfo.FormID = $('#VendorNameInput').val(FormData.PaymentInfo.FormID);
    //EPP.PaymentInfo.EMPNum = $('#VendorNameInput').val(FormData.PaymentInfo.EMPNum);
    $('#VendorNameInput').val(FormData.PaymentInfo.EMPName);
    $('#AccountDescriptionTitle').val(FormData.PaymentInfo.AccountDesc);

    if (FormData.PaymentInfo.PaymentMethod != "") {
        $.ajax({
            async: false,
            type: 'GET',
            dataType: 'json',
            url: '/EPP/GetPaymentMethod?EppNum=' + $('#P_SignID').val(),
            success: function (data) {
                $.each(data, function (key, txt) {
                    $("#PaymentWaySelect").append($("<option></option>").attr("value", txt.paymentMethod).text(txt.paymentMethodDescription));
                })
                $("#PaymentWaySelect").selectpicker('refresh');

                $('#PaymentWaySelect').val(FormData.PaymentInfo.PaymentMethod);
                $('#PaymentWaySelect option[value=' + FormData.PaymentInfo.PaymentMethod + ']').attr('selected', 'selected');
                $("#PaymentWaySelect ").selectpicker('refresh');

                _coaDepartmentProduct = data;
            },
            error: function (data) {
                alert('「FIIS 付款方式」取得失敗!');
            }
        })

        DisableDOMObject($('#PaymentWaySelect'));
    }

    $('#PaymentMemoTextArea').val(FormData.PaymentInfo.PayReMark);

    switch (FormData.PaymentInfo.Remittance) {
        case '1':
            $('#RemmitanceFeeDisable').text('內扣');
            break;
        case '2':
            $('#RemmitanceFeeDisable').text('外加');
            break;
        default:
    }

    if (_vendor.length != 0) {
        $('#PaymentBankDisable').val(EPP.PaymentInfo.Bank);
        $('#PaymentBankDisable').text(EPP.PaymentInfo.Bank + ' ' + EPP.PaymentInfo.BankName);

        $("#PaymentBranchDisable").val(EPP.PaymentInfo.Branch);
        $('#PaymentBranchDisable').text(EPP.PaymentInfo.Branch + ' ' + EPP.PaymentInfo.BranchName);

        $('#PaymentAccountDisable').text(EPP.PaymentInfo.AccountNum); //$('#PaymentAccountInput').val();
        $('#PaymentNameDisable').text(EPP.PaymentInfo.AccountName);
    }
    else if ($('#VendorName').text() != "請選擇供應商") {
        $('#PaymentBankDisable').val(EPP.PaymentInfo.Bank);
        $('#PaymentBankDisable').text(EPP.PaymentInfo.Bank + ' ' + EPP.PaymentInfo.BankName);

        $("#PaymentBranchDisable").val(EPP.PaymentInfo.Branch);
        $('#PaymentBranchDisable').text(EPP.PaymentInfo.Branch + ' ' + EPP.PaymentInfo.BranchName);

        $('#PaymentAccountDisable').text(EPP.PaymentInfo.AccountNum); //$('#PaymentAccountInput').val();
        $('#PaymentNameDisable').text(EPP.PaymentInfo.AccountName);
    }

    $('#apportionmentOriginDollarDisableText').text(accounting.formatNumber(FormData.AmortizationDetail.OriginalAmortizationAmount));
    $('#apportionmentNTDDollarDisableText').text(accounting.formatNumber(FormData.AmortizationDetail.OriginalAmortizationAmount));

    $('#VoucherAbstract').val(FormData.AmortizationDetail.SummonsDesc);

    debugger

    //分攤明細－取得帳務行

    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetCertificateObject?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            $.each(data, function (key, txt) {
                $("#CoaCompany").append($("<option></option>").attr("value", txt.accountCode).text(txt.accountCode + " " + txt.accountName));
            })

            $('#CoaCompany').val(FormData.AmortizationDetail.AccountBank);
            $('#CoaCompany').selectpicker('refresh');

            //$("#AccountBankDisable").text($('#VoucherObjectSelect option:selected').val());

            _coaCompany = data;
        },
        error: function (data) {
            alert('「分攤明細－帳務行」取得失敗!');
        }
    })

    //分攤明細－取得會計項子目
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetCoaAccount?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            $.each(data, function (key, txt) {
                $("#CoaAccount").append($("<option></option>").attr("value", txt.account).text(txt.account + " " + txt.description));
            })
            $("#CoaAccount").selectpicker('refresh');
            $('#CoaAccount option[value=' + FormData.AmortizationDetail.AccountingItem + ']').attr("selected", "selected");
            $("#CoaAccount").selectpicker('refresh');

            _coaAccountCollection = data;
        },
        error: function (data) {
            console.log('「分攤明細－會計項子目」取得失敗!');
        }
    })

    //分攤明細－取得費用性質
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetExpenseAttributeFullName?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            $.each(data, function (index, value) {
                $("#PaymentCategory").append($("<option></option>").attr("value", index).text(index + ' ' + value));
            })

            $('#PaymentCategory option[value=' + FormData.AmortizationDetail.ExpenseAttribute + ']').attr("selected", "selected");
            $("#PaymentCategory").selectpicker('refresh');

            _expenseAttributeCollection = data;
        },
        error: function (data) {
            console.log('「分攤明細－費用性質」取得失敗!');
        }
    })

    //取得成本利潤中心
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetCoaCompanyAndDepartment?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            $.each(data, function (key, txt) {
                $("#ProfitCostCenter").append($("<option></option>").attr("value", txt.department).text(txt.department + " " + txt.description));
            })
            $("#ProfitCostCenter").selectpicker('refresh');
            $('#ProfitCostCenter option[value=' + FormData.AmortizationDetail.CostProfitCenter + ']').attr("selected", "selected");

            _coaCompanyAndDepartmentCollection = data;
        },
        error: function (data) {
        }
    })

    //取得產品別
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetProduct?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            $.each(data, function (key, txt) {
                $('#ProductCategory').append($("<option></option>").attr("value", txt.product).text(txt.product + " " + txt.description));
            })
            $('#ProductCategory').selectpicker('refresh');
            $('#ProductCategory option[value=' + FormData.AmortizationDetail.ProductKind + ']').attr("selected", "selected");
            _coaDepartmentProduct = data;
        },
        error: function (data) {
            console.log('「分攤明細－產品別」取得失敗!');
        }
    })

    //取得產品明細
    $.ajax({
        async: false,
        url: '/EPP/GetProductDetail?EppNum=' + $('#P_SignID').val(),
        dataType: 'json',
        type: 'GET',
        success: function (data, textStatus, jqXHR) {
            $.each(data, function (key, txt) {
                $("#ProductDetail").append($("<option></option>").attr("value", txt.productDetail).text(txt.productDetail + " " + txt.productDetallDescription));
            })
            $("#ProductDetail").selectpicker('refresh');
            $('#ProductDetail option[value=' + FormData.AmortizationDetail.ProductDetail + ']').attr("selected", "selected");

            result = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('「分攤明細－產品明細」取得失敗!');
        }
    });
    $("#ProductDetail").selectpicker('refresh');

    // 所在關卡：第二關卡－會計經辦 ( ReadyOnly 頁面 )
    ReadyOnly();
}

//==========================================
// 所在關卡：第二關卡－會計經辦 ( ReadyOnly 頁面 )
//==========================================
function ReadyOnly() {
    $('.perchaseOrderListSelect').hide();

    $('#perchaseOrderListDisableText').show();

    debugger
    $('#perchaseOrderListDisableText').text(EPP.PONum);
    if ($('#perchaseOrderListDisableText').text() == 'null') {
        $('#perchaseOrderListDisableText').text('');
    }
    //$('#perchaseOrderListDisableText').text($('#perchaseOrderList option[value=' + $('#perchaseOrderList').val() + ']').text());

    $('#perchaseOrderList').selectpicker('destroy');

    $('.ProjectTypeSelect').hide();
    $('#ProjectTypeDisableText').show();
    $('#ProjectTypeDisableText').text($('#ProjectTypeSelect option[value=' + EPP.ProjectCategory + ']').text());

    if ($('#ProjectTypeSelect option[value=' + EPP.ProjectCategory + ']').text() == '') {
        $('.ProjectType').hide();
    }

    $('.ProjectNameSelect').hide();
    $('#ProjectNameDisableText').show();

    $.ajax({
        async: false,
        url: '/EPP/GetProjectByCode/values?code=' + EPP.Project,
        dataType: 'json',
        type: 'GET',
        success: function (data, textStatus, jqXHR) {
            ProjectName = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('「專案」取得失敗!');
            alert("專案取得失敗，表單載入錯誤");
        }
    });

    if (ProjectName == null) {
        $('.ProjectName').hide();
    }
    else {
        $('#ProjectNameDisableText').show();
        $('#ProjectNameDisableText').text(ProjectName);
    }

    $.ajax({
        async: false,
        url: '/EPP/GetProjectItemByCode/values?code=' + EPP.ProjectItem,
        dataType: 'json',
        type: 'GET',
        success: function (data, textStatus, jqXHR) {
            ProjectItem = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('「專案項目」取得失敗!');
        }
    });

    $('.ProjectItemSelect').hide();

    if (ProjectItem == null) {
        $('.ProjectItem').hide();
    }
    else {
        $('#ProjectItemDisableText').show();
        $('#ProjectItemDisableText').text(ProjectItem);
    }

    DisableDOMObject($('#IsSinglePayment'));
    DisableDOMObject($('#IsUrgency'));

    $('#VoucherObjectDisableText').show();

    $('#VoucherObjectSelect').selectpicker('destroy');
    $('#VoucherObjectSelect').hide();

    SwitchInputToDisableText($('#PaymentRequestAbstractInput'), $('#PaymentRequestAbstractDisableText'));
    SwitchInputToDisableText($('#PaymentRequestDiscriptionInput'), $('#PaymentRequestDiscriptionDisableText'));

    $('.VendorOpen').hide();

    $('#UrgentDocument').show();

    $('#VendorName').removeClass("no-file-text").addClass("disable-text");

    $('#ExchangeRateInput').addClass("disable-text");
    DisableDOMObject($('#ExchangeRateInput'));

    DisableDOMObject($('#Currency'));

    //$('.CurrencySelect').attr("disabled", true);
    //$('#CurrencySelect').addClass("input-disable");

    //$('.CurrencySelect').hide();
    //$('#CurrencyDisableText').show();
    //$('#CurrencyDisableText').text($('#Currency').val());

    SwitchInputToDisableText($('#ContractIdInput'), $('#ContractIdDisableText'));

    SwitchInputToDisableText($('#TotalPrepaymentsInput'), $('#TotalPrepaymentsDisableText'));
    $('#TotalPrepaymentsDisableText').text(accounting.formatNumber(+($('#TotalPrepaymentsDisableText').text())));

    SwitchInputToDisableText($('#PaymentMemoTextArea'), $('#PaymentMemoDisableText'));
    SwitchInputToDisableText($('#NegotiatePriceNumInput'), $('#NegotiatePriceNumDisableText'));
    SwitchInputToDisableText($('#ExportApplyAttributeInput'), $('#ExportApplyAttributeDisableText'));

    $('.AccountingItemNameDisableText').attr('disabled', true);
    $('.AccountingItemNameDisableText').addClass('input-disable');
    $('.AccountingItemNameDisableText').selectpicker('refresh');

    $('.ProfitCostCenterDisableText').attr('disabled', true);
    $('.ProfitCostCenterDisableText').addClass('input-disable');
    $('.ProfitCostCenterDisableText').selectpicker('refresh');

    $('.ProductCategory').attr('disabled', true);
    $('.ProductCategory').addClass('input-disable');
    $('.ProductCategory').selectpicker('refresh');

    $('.CoaCompany').attr('disabled', true);
    $('.CoaCompany').addClass('input-disable');
    $('.CoaCompany').selectpicker('refresh');

    $('.CoaAccount').attr('disabled', true);
    $('.CoaAccount').addClass('input-disable');
    $('.CoaAccount').selectpicker('refresh');

    $('.ProductDetail').attr('disabled', true);
    $('.ProductDetail').addClass('input-disable');
    $('.ProductDetail').selectpicker('refresh');

    $('.apportionmentOriginDollarInput').hide();
    $('#apportionmentOriginDollarDisableText').show();

    $('#apportionmentNTDollar').text($('#apportionmentOriginDollarDisableText').text())

    $('#appendApportionmentRow').hide();
    $('.icon-remove-size').hide();

    $('.VoucherAbstract').show();
    $('#VoucherAbstract').attr('disabled', true);
    $('#VoucherAbstract').addClass('input-disable');
    $('#VoucherAbstract').selectpicker('refresh');

    $('.selectorReadOnly').attr('disabled', true);
    $('.selectorReadOnly').addClass('input-disable');
    $('.selectorReadOnly').selectpicker('refresh');

    //==========================================
    // 依幣別判斷是否為急件
    //==========================================
    //$(function () {
    //    switch ($('#Currency').val()) {
    //        case "TWD":
    //            $('#IsUrgency').attr('checked', false);
    //            break;

    //        default:
    //            $("#Currency").attr("checked", true);
    //            break;
    //    }
    //});

    CurrentStepSetting($('#P_CurrentStep').val());
}

//各關卡UI顯示/邏輯設定
function CurrentStepSetting(currentStep) {
    switch (currentStep) {
        case '1':
            CurrentStep1();
            break;
        case '2':
            CurrentStep2();
            break;

        case '3':
            CurrentStep3();
            break;

        case '4':
            CurrentStep4();
            break;

        case '5':
            CurrentStep4();
            break;
        default:
    }
}

function CurrentStep1() {
    CaculatePaymentDate();
    $('.VoucherAbstract').hide();
}

//==========================================
// 預計付款日期
//==========================================
function CaculatePaymentDate() {
    switch ('Supplier') {
        case "Supplier":
            var Today = new Date();
            if (Today.getDate() >= 1 && Today.getDate() <= 6) {
                $('#paymentDateInput').text(Today.getFullYear() + '-' + (Today.getMonth() + 1) + '-' + '14');
                $('#expectPaymentDate').text(Today.getFullYear() + '-' + (Today.getMonth() + 1) + '-' + '14');
            } else if (Today.getDate() >= 7 && Today.getDate() <= 20) {
                $('#paymentDateInput').text(Today.getFullYear() + '-' + (Today.getMonth() + 1) + '-' + '28');
                $('#expectPaymentDate').text(Today.getFullYear() + '-' + (Today.getMonth() + 1) + '-' + '28');
            } else {
                $('#paymentDateInput').text(Today.getFullYear() + '-' + (Today.getMonth() + 2) + '-' + '14');
                $('#expectPaymentDate').text(Today.getFullYear() + '-' + (Today.getMonth() + 2) + '-' + '14');
            }
            break;
        default:
            break;
    }
}

function CurrentStep2() {
    // ReadOnly 頁面
    $('.selectorReadOnly').prop('disabled', 'disabled');
    $('.selectorReadOnly').attr('disabled', true);
    $('.selectorReadOnly').selectpicker('refresh');

    //DisableDOMObject($('.inputReadOnly'));
    //另一種 Input Disable 樣式
    $('.inputReadOnly').prop('disabled', true);
    $('.inputReadOnly').selectpicker('refresh');

    $('.isUrgency').hide();
    $('#VendorOpen').hide();
    $('.VoucherAbstract').hide();

    CaculatePaymentDate();
}

function CurrentStep3() {
    // ReadOnly 頁面(全鎖)
    //DisableDOMObject($('.selectorReadOnly'));
    //另一種 Selector Disabled 樣式
    $('.readOnly').prop('disabled', 'disabled');
    $('.readOnly').selectpicker('refresh');
    //DisableDOMObject($('.inputReadOnly'));
    //另一種 Input Disable 樣式
    $('.inputReadOnly').prop('disabled', true);
    $('.inputReadOnly').selectpicker('refresh');

    $('.VoucherAbstract').hide();
    //$('.VoucherAbstract').show();

    //EnableDOMObject($('.accountantDealingSelector'));
    //另一種 Selector Enable 樣式
    $('.accountantDealingSelector').prop('disabled', true);
    $('.accountantDealingSelector').selectpicker('refresh');

    //EnableDOMObject($('.accountantDealingInput'));
    $('.accountantDealingInput').prop('disabled', true);
    $('.inputReadOnly').selectpicker('refresh');

    $('.accountantDisDealing').show();
    $('.paymentDateInput').show();
    //$('.paymentDateInput').prop('disabled', true);
    //$('.paymentDateInput').selectpicker('refresh');

    //$('.paymentDateInputDisable').addClass('input-disable');
    //$('.paymentDateInputDisable').attr('disabled', true);

    //$('.paymentDateInput').show();
    //$('.paymentDateInputDisable').addClass('input-disable');
    //$('.paymentDateInputDisable').attr('disabled', true);
    //$('.paymentDateInputDisable').selectpicker('refresh');

    //DisableDOMObject($('.paymentDateInput'));

    $('.isUrgency').show();
    $('.VoucherAbstract').show();
    $('#VendorOpen').hide();
}

function CurrentStep4() {
    // ReadOnly 頁面(全鎖)
    DisableDOMObject($('.inputReadOnly'));
    //另一種 Input Disable 樣式
    //$('.inputReadOnly').prop('disabled', true);
    //$('.inputReadOnly').selectpicker('refresh');

    $('.paymentDateInput').show();

    $('.VoucherAbstract').show();

    $('.accountantDisDealing').show();

    $('.isUrgency').show();
    $('#VendorOpen').hide();
}

//一般key/value option 分攤明細－COA帳務行
function FIIS_CoaCompanyOption(target, data) {
    $.each(data, function (key, txt) {
        $(target).append($("<option></option>").attr("value", txt.company).text(txt.company + "  " + txt.description));
    })
    $(target).selectpicker('refresh');
}

//一般key/value option 分攤明細－COA會計項（子）目
function FIIS_CoaAccountOption(target, data) {
    $.each(data, function (key, txt) {
        $(target).append($("<option></option>").attr("value", txt.account).text(txt.account + " " + txt.description));
    })
    $(target).selectpicker('refresh');
}