let _requiredIcon = '<b class="required-icon">*</b>';
let _currencyTypeChanged = true;
let _effectiveDate = '';
let _donateInfoSection = $.extend(true, {}, $('#DonateTable'));
let _firstSelectPleaseType = true;
let _isIncomeTaxGenerate = false;
let _moneyNegative = false;
let _previousAmount = 0;
let _alerttext = [];
let _coaDepartmentProduct;
var EPP;
var AmortizationDetailID;

var selectedVendorID;
var selectedVendorSiteID;
var selectedVendorSiteCode;   // 供應商地址代號
var selectedVendorAddress;    // 供應商地址

$(function () {
    var pageLoadCount = 1;
    EPP = getModel();

    DisableDOMObject('#PaymentWaySelect');
    DisableDOMObject($("#CoaAccount"));
    DisableDOMObject($("#IsSinglePayment"));

    $('#PaymentMemoTextArea').bind('change', PaymentMemoChange);

    $('#ExchangeRateInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange);

    //==========================================
    // 幣別選擇
    //==========================================
    $(document).on('change', '#Currency', function () {
        $.ajax({
            async: false,
            url: '/EPP/GetCurrencyList/values?currencyCode=' + $('#Currency option:selected').val(),
            dataType: 'json',
            type: 'GET',
            success: function (data, textStatus, jqXHR) {
                $('#CurrencyPrecisionDisable').text(data[0].extendedPrecision);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('「幣別精確度」取得失敗!');
            }
        });

        if ($('#Currency option:selected').val() != 'TWD') {
            $('#ExchangeRateInput').show();
            $('#ExchangeRate').hide();
        }
    });

    //==========================================
    // 供應商選擇
    //==========================================
    //開啟供應商視窗前，使用ajax取得供應商清單
    $(document).on('click', '#VendorOpen', function () {
        openVendor(true, null);
    });

    if (_vendor.length) {
        $.ajax({
            async: false,
            type: 'GET',
            dataType: 'json',
            url: '/EPP/GetSupplierInfoById?supplierNumber=' + _vendor[0].supplierNumber,    //EPP.VendorNum,
            success: function (data) {
                debugger
                _vendor = data;

                if (!$('#AccountSelectBtn').length) {
                    if (!$('#AccountSelectBtn').length) {
                        $('#AccountDescription').append(
                            '<div class="col-sm-2 content-box" id="AccountSelectBtn" style="padding-top:40px">\
                                <div class="area-1">\
                                    <div class="area-btn-right-1">\
                                        <a id="AccountOpen" class="btn-02-blue btn-left">\
                                            選擇帳號\
                                        </a>\
                                     </div>\
                                    </div>\
                                </div>'
                        );

                        $('#AccountList').append(

                            '<div class="popup-tbody h160 overflow-auto">\
                                        <ul class="w100" id="AccountItem">\
                                        </ul>\
                                    </div>'
                        );

                        for (var i = 0; i < _vendor[0].supplierBank.length; i++) {
                            $('#AccountList').find('ul').eq(1).append(
                                '<li class="AccountSelect AccountItems">\
                                        <label class="w100 label-box">\
                                            <div class="table-box w5">\<input name="AccountSelector" type="radio"></div>\
                                            <div class="table-box w12 popup-PaymentBankAccountId hidden">' + _vendor[i].supplierBank[i].extBankAccountId + '</div>\
                                            <div class="table-box w12 popup-PaymentBank">' + _vendor[0].supplierBank[i].bankNumber + " " + _vendor[0].supplierBank[i].bankName + '</div>\
                                            <div class="table-box w15 popup-PaymentBranch">' + _vendor[0].supplierBank[i].branchNumber + " " + _vendor[0].supplierBank[i].bankBranchName + '</div>\
                                            <div class="table-box w15 popup-PaymentAccount">' + _vendor[0].supplierBank[i].bankAccountNumber + '</div>\
                                            <div class="table-box w20 popup-PaymentName">' + _vendor[0].supplierBank[i].bankAccountName + '</div>\
                                            <div class="table-box w20 popup-PaymentDescription">' + (_vendor[0].supplierBank[i].bankAccountNumRemark == null ? "" : _vendor[0].supplierBank[i].bankAccountNumRemark) + '</div>\
                                        </label>\
                                    </li>');
                        }
                    }
                }
            },
            error: function (data) {
                console.log("「FIIS 供應商」取得失敗!");
            }
        })
    }

    // FIIS 付款方式
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetPaymentMethod?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            FIIS_PaymentMethodOption($("#PaymentWaySelect"), data);

            _coaDepartmentProduct = data;
        },
        error: function (data) {
            console.log('「FIIS 付款方式」取得失敗!');
        }
    })
    $(document).on('change', '#PaymentWaySelect', function () {
        // 付款方式選擇
        if (typeof (vendorItemSelected) == "undefined") {
            $.ajax({
                async: false,
                type: 'GET',
                dataType: 'json',
                url: '/EPP/GetSupplierInfoById?supplierNumber=' + $('#VendorName').val(),
                success: function (data) {
                    debugger
                    _vendor = data;
                    paymentWayUI(_vendor.supplier[0], $("select#PaymentWaySelect").val());
                },
                error: function (data) {
                    console.log('「FIIS 供應商」取得失敗!');
                }
            })
        }
        else {
            paymentWayUI(vendorItemSelected, $("select#PaymentWaySelect").val());
        }
    })
    $(document).on('click', '#VendorConfirm', function () {
        // 依據供應商代出 預設付款方式 預設匯費選項
        WireMethodClear();
        if (_vendor[0].supplierBank.length > 1) {
            AccountSelectedBtn(_vendor[0]);
        }
        else {
            $('.AccountItems').remove();
            $('#AccountSelectBtn').remove();
        }
        // 根據供應商編號取得「採購單號」
        $("#perchaseOrderList option").remove();
        $("#perchaseOrderList").selectpicker('refresh');

        $.ajax({
            async: false,
            type: 'GET',
            dataType: 'json',
            url: '/EPP/GetSuppliersPurchaseOrder?supplierNumber=' + _vendor[0].supplierNumber + '&supplierSiteCode=' + _vendor[0].supplierSite[0].supplierSiteCode,
            success: function (data) {
                FIIS_SuppliersPurchaseOrderOption($("#perchaseOrderList"), data.detail);

                _SuppliersPurchaseOrder = data;
            },
            error: function (data) {
                console.log('依據供應商編號取得「採購單號」失敗!');
            }
        })
        EnableDOMObject($('#perchaseOrderList'));
    });

    $('#TotalPrepaymentsInput').on('change', function () {
        // 預付總額(原幣)*－數字檢核
        if (isNaN($('#TotalPrepaymentsInput').val().replace(/\,/g, ''))) {
            $('#TotalPrepaymentsInput').val(null);

            alertopen("輸入格式不正確，請重新輸入!");
        }
        else {
            $('#apportionmentOriginDollarInput').val(accounting.formatNumber($('#TotalPrepaymentsInput').val()));
        }
    });
    $(document).on('click', '#AccountOpen', function () {
        // 帳號選擇
        $('[data-remodal-id=SelectAccount]').remodal().open();
    });
    $(document).on('click', '#AccountConfirm', function () {
        let selectTarget = $('input[name="AccountSelector"]:checked').parents('li.AccountSelect');

        $('#AccountDescriptionDisable').text(
            $(selectTarget).find('div.popup-PaymentDescription').text() == "null" ? "" : $(selectTarget).find('div.popup-PaymentDescription').text()
        );

        $('#PaymentAccountId').text($(selectTarget).find('div.popup-PaymentBankAccountId').text());

        $('#PaymentBankDisable').text($(selectTarget).find('div.popup-PaymentBank').text());
        $('#PaymentAccountDisable').text($(selectTarget).find('div.popup-PaymentAccount').text());
        $('#PaymentNameDisable').text($(selectTarget).find('div.popup-PaymentName').text());
        $('#PaymentBranchDisable').text($(selectTarget).find('div.popup-PaymentBranch').text());

        $('#PaymentBankDisable').val($(selectTarget).find('div.popup-PaymentBank').text().split(" ")[0]);
        $('#PaymentAccountDisable').val($(selectTarget).find('div.popup-PaymentAccount').text().split(" ")[0]);
        $('#PaymentNameDisable').val($(selectTarget).find('div.popup-PaymentName').text().split(" ")[0]);
        $('#PaymentBranchDisable').val($(selectTarget).find('div.popup-PaymentBranch').text().split(" ")[0]);
    });
    GetProjectCategory();

    $("#VoucherObjectSelect").on("change", function () {
        $("#AccountBankDisable").text($('#VoucherObjectSelect option:selected').val());

        $('#CoaCompany').val($('#VoucherObjectSelect option:selected').val().split(' ')[0]);
        $("#CoaCompany").selectpicker('refresh');
    });
    $("#ProjectTypeSelect").on("change", function () {
        //專案類別更改動作
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
    });
    $("#ProjectNameSelect").on("change", function () {
        //專案更改動作
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
                console.log('「專案項目」取得失敗!');
            }
        });

        $("#ProjectItemSelect").removeAttr("disabled");
        $("#ProjectItemSelect").selectpicker('refresh');

        if ($("#ProjectNameSelect").val() == null) {
            $("#ProjectItemSelect").attr("disabled", "disabled");
            $("#ProjectItemSelect").selectpicker('refresh');
        }
    })
    $("#TotalPrepaymentsInput").on('change', function () {
        //預付總額(原幣)*
        $(this).val(accounting.formatNumber($("#TotalPrepaymentsInput").val()));

        $('#PaymentTWD').text(accounting.formatNumber($('#TotalPrepaymentsInput').val()));
        $('#totalOriginDollar').text(accounting.formatNumber($('#apportionmentOriginDollarInput').val()));
        $('#totalNTDollar').text(accounting.formatNumber($('#apportionmentOriginDollarInput').val()));
    });

    if ($('#suppliesName').text() == '請選擇供應商') {
        $('#perchaseOrderList').addClass('input-disable');
        $('#perchaseOrderList').attr('disabled', true);
    }
    else {
        EnableDOMObject($('#perchaseOrderList'))
    }

    // 幣別選擇
    $.ajax({
        async: false,
        url: '/EPP/GetCurrencyList/values?EppNum=' + $('#P_SignID').val(),
        dataType: 'json',
        type: 'GET',
        success: function (data, textStatus, jqXHR) {
            CurrencyOption($("#Currency"), data);
            result = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('「幣別」取得失敗!');
        }
    });

    $('#Currency option[value = TWD]').attr('selected', 'selected');
    $("#Currency ").selectpicker('refresh');
    DisableDOMObject($('#Currency'));
    LoadEPPFormData(EPP);
    if ($('#AccountDescriptionDisable').text() == 'null') {
        $('#AccountDescriptionDisable').text("");
    }
    if ($('#TotalPrepaymentsInput').val() == 0) {
        $('#TotalPrepaymentsInput').val('');
    }
    if ($('#apportionmentOriginDollarInput').val() == 0) {
        $('#apportionmentOriginDollarInput').val('');
    }

    //根據付款方式 顯示/隱藏 選擇帳號按鈕
    if ($('#PaymentWaySelect').val() == 'WIRE') {
        $.ajax({
            async: false,
            type: 'GET',
            dataType: 'json',
            url: '/EPP/GetSupplierInfoById?supplierNumber=' + $('#VendorName').val(),  // != "" ? _vendor[0].supplierNumber : EPP.VendorNum),
            success: function (data) {
                debugger
                _vendor = data;
                AccountSelectedBtn(_vendor.supplier[0]);
            },
            error: function (data) {
                console.log('「FIIS 供應商」取得失敗!');
            }
        })
    }

    CurrentStepSetting($('#P_CurrentStep').val());
    //判斷是否為加會關卡(加會：P_Status=4)
    if ($('#P_Status').val() == '4') {
        CurrentStepSetting('4');
    }
});

function AccountingCheckpoint() {
    // 所在關卡：第二關卡－會計經辦
    $('.perchaseOrderListSelect').hide();
    $('#perchaseOrderListDisableText').show();
    $('#perchaseOrderListDisableText').text($('#perchaseOrderList').val());

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

    $('.CoaAccount').show();
    $('.VoucherAbstract').show();
    $(function () {
        // 依幣別判斷是否為急件
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

function CurrentStepSetting(currentStep) {
    //各關卡UI顯示/邏輯設定
    debugger
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
    EnableDOMObject($('#IsSinglePayment'));
    $('#IsSinglePayment').removeClass('input-disable');

    $('#IsSinglePayment').removeAttr('disabled');
    $('#IsSinglePayment').selectpicker('refresh');

    if ($('#ApplicantDepId').val().includes("0113")) {
        EnableDOMObject($('#PaymentCategory'));
    }
    else {
        DisableDOMObject($('#PaymentCategory'));
    }

    if ($('#PaymentWaySelect option:selected').val() == 'WIRE') {
        $('.WireInfo').show();
    }
    else {
        $('.WireInfo').hide();
    }

    CaculatePaymentDate();
    //信用卡處 & 會計處 流程分支判別
    $.when(_sendSettingDeferred).done(function () {
        if ($('#P_CurrentStep').val() == "1" && $('#P_JBPMUID').val() == "" && $('#FillInDepName').val().includes("0113")) {
            updateCustomFlowKey("EPP_P1_Credit");
            _stageInfo.CustomFlowKey = "EPP_P1_Credit";
            _stageInfo.NextCustomFlowKey = "EPP_P1_Credit"
            $('#P_CustomFlowKey').val("EPP_P1_Credit");
        }
    })
}
function CaculatePaymentDate() {
    // 預計付款日期
    switch ('Supplier') {
        case "Supplier":
            var Today = new Date();
            if (Today.getDate() >= 1 && Today.getDate() <= 6) {
                $('#expectPaymentDate').text(Today.getFullYear() + '-' + (Today.getMonth() + 1) + '-' + '14');
            } else if (Today.getDate() >= 7 && Today.getDate() <= 20) {
                $('#expectPaymentDate').text(Today.getFullYear() + '-' + (Today.getMonth() + 1) + '-' + '28');
            } else {
                $('#expectPaymentDate').text(Today.getFullYear() + '-' + (Today.getMonth() + 2) + '-' + '14');
            }
            break;
        default:
            break;
    }
}
function CurrentStep2() {
    CaculatePaymentDate();
    // ReadOnly 頁面
    DisableDOMObject($('.selectorReadOnly'));

    $('.inputReadOnly').addClass('input-disable');
    $('.inputReadOnly').attr('disabled', true);
    $('#AccountSelectBtn').hide();

    $('.isUrgency').hide();
    $('.VendorOpen').remove();
}
function CurrentStep3() {
    // ReadOnly 頁面(全鎖)
    DisableDOMObject($('.selectorReadOnly'));
    $('.inputReadOnly').addClass('input-disable');
    $('.inputReadOnly').attr('disabled', true);

    EnableDOMObject($('#CoaCompany'));
    EnableDOMObject($('#ProfitCostCenter'));

    EnableDOMObject($('#ProductCategory'));
    EnableDOMObject($('#ProductDetail'));

    if ($('#ApplicantDepId').val().includes("0113")) {  //  「填表人」為「信用卡處」則開放編輯
        EnableDOMObject($('#PaymentCategory'));
    }
    else {
        DisableDOMObject($('#PaymentCategory'));
    }

    EnableDOMObject($('.accountantDealingInput'));
    $('.accountantDealingInput').addClass('input-disable');
    $('.accountantDealingInput').attr('disabled', true);

    $('.accountantDisDealing').show();
    EnableDOMObject($('#CoaAccount'));
    $('.VoucherAbstract').removeClass('input-disable');
    $('.VoucherAbstract').attr('disabled', false);

    $('#VoucherAbstract').val($('#PaymentRequestAbstractInput').val());    // 分攤明細資訊區的[傳票摘要]請帶入預設值 (帶入[請款主旨]的輸入文字)

    $('.paymentDateInput').show();

    $('.isUrgency').show();
    $('#AccountSelectBtn').hide();

    $('.step3_show').show()

    $('.VendorOpen').remove();
}
function CurrentStep4() {
    // ReadOnly 頁面(全鎖)
    DisableDOMObject($('.selectorReadOnly'));
    DisableDOMObject($('#IsSinglePayment'));
    $('.inputReadOnly').addClass('input-disable');
    $('.inputReadOnly').attr('disabled', true);

    $('.accountantDisDealing').show();
    $('.VoucherAbstract').show();
    $('#VoucherAbstract').addClass('input-disable');
    $('#VoucherAbstract').attr('disabled', true);

    $('.paymentDateInput').show();
    $('.isUrgency').show();

    DisableDOMObject($('#IsUrgency'));
    $('#AccountSelectBtn').hide();

    $('.paymentDateInputDisable').addClass('input-disable');
    $('.paymentDateInputDisable').attr('disabled', true);

    $('.VendorOpen').remove();
}
function CheckOutLoadData(FormNum) {
    var result;
    $.ajax({
        async: false,
        url: '/EPP/GetEPPFormInfo/values?EppNum=' + FormNum,
        dataType: 'json',
        type: 'GET',
        data: { EppNum: FormNum },
        success: function (data, textStatus, jqXHR) {
            result = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            result = null;
        }
    });
    return result;
}
function GetProjectCategory() {
    // 取得專案類別
    var result;
    $.ajax({
        async: false,
        url: '/Project/GetProjectCategoryDropMenu',
        dataType: 'json',
        type: 'GET',
        success: function (data, textStatus, jqXHR) {
            $("#ProjectTypeSelect").append($("<option></option>").attr("value", null).text("請選擇"));

            $.each(data, function (key, txt) {
                $("#ProjectTypeSelect").append($("<option></option>").attr("value", key).text(txt));
            })
            $("#ProjectTypeSelect").selectpicker('refresh');

            result = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('取得 專案類別 失敗了!');
            result = null;
        }
    });
    return result;
}
function getExchangeRate(from) {
    //取得幣別匯率
    var result;
    $.ajax({
        async: false,
        url: '/FIIS/GetConversionRate?sourceCode=EPP&fromCurrencyCode=' + from + '&toCurrencyCode=TWD',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            conversionRate = data;
            result = data.conversionRate;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            result = 0;
        }
    });
    EPP.ExchangeRate = result;
    return result;
}
function FIIS_SuppliersPurchaseOrderOption(target, data) {
    //一般key/value option
    if (data.length) {
        $(target).append($("<option></option>").attr("value", null).text("請選擇"));
    }

    $.each(data, function (key, txt) {
        $(target).append($("<option></option>").attr("value", txt.poHeaderId).text(txt.poNumber));
    })
    $(target).selectpicker('refresh');
}
function FIIS_PaymentMethodOption(target, data) {
    //一般key/value option
    $.each(data, function (key, txt) {
        $(target).append($("<option></option>").attr("value", txt.paymentMethod).text(txt.paymentMethodDescription));
    })
    $(target).selectpicker('refresh');
}
function FIIS_ProductCategoryOption(target, data) {
    //一般key/value option
    $.each(data, function (key, txt) {
        $(target).append($("<option></option>").attr("value", txt.product).text(txt.product + " " + txt.description));
    })
    $(target).selectpicker('refresh');
}

function FIIS_CoaCompanyOption(target, data) {
    //一般key/value option 分攤明細－COA帳務行
    $.each(data, function (key, txt) {
        $(target).append($("<option></option>").attr("value", txt.company).text(txt.company + "  " + txt.description));
    })
    $(target).selectpicker('refresh');
}
function FIIS_CoaAccountOption(target, data) {
    //一般key/value option 分攤明細－COA會計項（子）目
    $.each(data, function (key, txt) {
        $(target).append($("<option></option>").attr("value", txt.account).text(txt.account + " " + txt.description));
    })
    $(target).selectpicker('refresh');
}

function FIIS_CoaCompanyAndDepartmentOption(target, data) {
    //一般key/value option 分攤明細－成本利潤中心
    $.each(data, function (key, txt) {
        $(target).append($("<option></option>").attr("value", txt.department).text(txt.department + " " + txt.description));
    })
    $(target).selectpicker('refresh');
}
function FIIS_ProductDetailOption(target, data) {
    //一般key/value option ProductDetail
    $.each(data.detail, function (key, txt) {
        $(target).append($("<option></option>").attr("value", txt.productDetail).text(txt.productDetail + " " + txt.productDetallDescription));
    })
    $(target).selectpicker('refresh');
}
function CurrencyOption(target, data) {
    //一般key/value option
    $.each(data, function (key, value) {
        $(target).append($("<option></option>").attr("value", value.currencyCode).text(value.currencyName + ' ' + value.currencyCode)
            .data("CurrencyName", value.currencyName).data("ExtendedPrecision", value.extendedPrecision));
    })
    $(target).selectpicker('refresh');
}
function fun_setSelectOption(target, data) {
    //專案類別、專案、專案項目：一般key/value option
    $(target).append($("<option></option>").attr("value", null).text("請選擇"));

    $.each(data, function (key, txt) {
        $(target).append($("<option></option>").attr("value", key).text(txt));
    })
    $(target).selectpicker('refresh');
}
function fun_setSelectedOption(target, data, selected) {
    //一般key/value option
    $.each(data, function (key, txt) {
        $(target).append($("<option></option>").attr("value", key).text(txt));
        $(target).attr("value", selected); //如果要預設為選取時
        $(target).attr("selected", true); //觸發change事件
    })
    $(target).selectpicker('refresh');
}

function ForeignCurrency() {
    // 選取外幣
    SwitchHideDisplay([$('#ExchangeRate'), $('#NegotiatePriceNumDisable'), $('#ExportApplyAttributeDisable')], [$('#ExchangeRateInput'), $('#NegotiatePriceNumInput'), $('#ExportApplyAttributeInput')]);
    AppendRequired($('#NegotiatePriceNumTitle'));
    AppendRequired($('#ExportApplyAttributeTitle'));
    if (_currencyTypeChanged) {
        alertopen("外幣付款請於取得議價編碼當日內，傳送請款單及提交匯出匯款申請書至會計經辦");
        _currencyTypeChanged = false;
    }
}
function nForeignCurrency() {
    // 選取本幣
    SwitchHideDisplay([$('#ExchangeRateInput')], [$('#ExchangeRate')])
    RemoveRequired($('#NegotiatePriceNumTitle'));
    RemoveRequired($('#ExportApplyAttributeTitle'));
    _currencyTypeChanged = true;
}
function EmptyObj(emptyObj) {
    // 清空Input欄位
    $.each(emptyObj, function (index, item) {
        $(item).val('');
    });
}
String.prototype.PaymentMemoLength = function () {
    //付款附言(備註)長度全形半形檢核
    return this.replace(/[^\x00-\xff]/g, "rr").length;
}
function PaymentMemoChange(e) {
    //付款附言(備註)輸入檢核
    var regExp5 = /[\w]\+$/;
    switch ($('#Currency').val()) {
        case "TWD":

            if ($(e.target).val().PaymentMemoLength() > 78) {
                alertopen('輸入格式錯誤! 僅限不得大於39個全形字');
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
function MoneyChange(e) {
    //貨幣更動時檢查合理性
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

    if ($('#CurrencyPrecisionDisable').text() == 1) {
        $(e.target).val($(e.target).val().split('.')[0])
        return;
    }

    if ($('#Currency').val() == 'TWD') {
        if ($(e.target).val().split('.')[1].length > 1) {
            alertopen('輸入值不符合台幣幣別精確度');
            $(e.target).val(0);
            return;
        }
    }
    else if ($(e.target).val().split('.')[1] != undefined) {
        if ($(e.target).val().split('.')[1].length > $('#CurrencyPrecisionDisable').text()) {
            alertopen('輸入值不符合幣別精確度');
            $(e.target).val(0);
            return;
        }
    }
}
function recalculateMoney(e) {
    // 請款明細層,重新計算金額
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
function initPleaseTypeSet() {
    // 請款類別重新選擇時初始化
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
function removeAllData() {
    // 移除請款資訊...等資料
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
function MathRoundExtension(x, decimalPlaces) {
    // 計算金額至幣別精確度小數點位數
    if (decimalPlaces == 1 && parseInt($('#CurrencyPrecisionDisable').text()) == 1) {
        x = Math.round(x);
    } else {
        x = x * Math.pow(10, decimalPlaces);
        x = Math.round(x);
        x = x / Math.pow(10, decimalPlaces);
    }
    return x
}
function RecordPreviousVal(e) {
    // 記錄金額更動前數值
    _previousAmount = $(e.target).val();
}
function SwitchInputToDisableText(ObjInput, ObjDisableText) {
    //使DOM元件失效
    $(ObjInput).hide();
    $(ObjDisableText).text(ObjInput.val());
    $(ObjDisableText).show();
}
function DisableDOMObject(obj) {
    //使DOM元件失效
    $(obj).attr('disabled', true);

    $(obj).addClass('input-disable');
    $(obj).selectpicker('refresh');
}
function EnableDOMObject(obj) {
    //使DOM元件有效
    if ($(obj)[0] != undefined) {
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
}
function SwitchHideDisplay(hideObj, displayObj) {
    //切換隱藏/顯示DOM元件
    $.each(hideObj, function (index, item) {
        $(item).hide();
    })

    $.each(displayObj, function (index, item) {
        $(item).show();
    })
}
function AppendRequired(appendObj) {
    // 必填新增
    $.each(appendObj, function (index, item) {
        if (!$(item).find('.required-icon').length > 0) {
            $(item).append(_requiredIcon);
        }
    });
}
function RemoveRequired(appendObj) {
    // 必填移除
    $.each(appendObj, function (index, item) {
        $(item).find('b.required-icon').remove();
    })
}
function alertopen(text) {
    // Remodal Alert&Confirm
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
function addErrMsg(target, NewElementID, ErrMesg) {
    //新增錯誤訊息
    if ($(target).nextAll("[alt=" + NewElementID + "]").length > 0) {
        $(target).nextAll("[alt=" + NewElementID + "]").html("<span class=\"icon-error icon-error-size\"></span>" + ErrMesg);
    }
    else {
        $(target).after('<div Errmsg="Y"  style="text-align:left" alt="' + NewElementID + '" class="error-text"><span class="icon-error icon-error-size"></span>' + ErrMesg + '</div>')
    }
}
function draft() {
    EPP = TemporaryRepository();
    EPP.EPPNum ? '/EPP/Edit' : '/EPP/Create';
    var _url = EPP.EPPNum ? '/EPP/Edit' : '/EPP/Create';

    return $.ajax({
        url: _url,
        async: false,
        dataType: 'json',
        type: 'POST',
        data: EPP,
        success: function (data, textStatus, jqXHR) {
            if (data.Flag) {
                _formInfo = {
                    formGuid: data.FormGuid,
                    formNum: data.FormNum,
                    flag: data.Flag
                }
                window.location.href = '/EPP/Edit/' + data.FormNum;
                EPP = CheckOutLoadData(data.FormNum);
            }
            else {
                console.log('「暫存」-draft()失敗了!');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('「暫存」-draft()失敗了!');
        }
    }).fail(function (jqXHR, textStatus, errorThrown) { alert("暫存失敗 " + textStatus) });
}
function Verify() {
    //前端欄位檢核卡控
    let draftAjax = $.Deferred();
    $('.error-text').remove();

    var isSuccess = true;
    setTimeout(function () {
        // 「供應商資訊區」卡控
        if ($('#suppliesName').text() == '請選擇供應商') {
            addErrMsg($('#suppliesName'), "err_suppliesName", "請選擇「供應商」");
            isSuccess = false;
        }

        // 「請款資訊區」卡控
        if ($('#VoucherObjectSelect').val() == "" || $('#VoucherObjectSelect').val() == null) {
            addErrMsg($('#VoucherObjectSelect'), "err_VoucherObjectSelect", "請選擇「憑證開立對象」");
            isSuccess = false;
        }

        // 「付款資訊區」卡控
        if ($('#TotalPrepaymentsInput').val().replace(/\,/g, '') == 0) {
            addErrMsg($('#TotalPrepaymentsInput'), "err_TotalPrepaymentsInput", "請輸入「預付總額(原幣)」");
            isSuccess = false;
        }

        if ($('#TotalPrepaymentsInput').val().replace(/\,/g, '') != $('#apportionmentOriginDollarInput').val().replace(/\,/g, '')) {
            addErrMsg($('#TotalPrepaymentsInput'), "err_TotalPrepaymentsInput", "「預付總額(原幣)」與「分攤總額」不符合");
            isSuccess = false;
        }

        if ($('#PaymentRequestAbstractInput').val() == "") {
            addErrMsg($('#PaymentRequestAbstractInput'), "err_PaymentRequestAbstractInput", "請輸入「請款主旨」");
            isSuccess = false;
        }

        if ('WIRE' == $('#PaymentWaySelect').val() && $('#PaymentAccountDisable').text() == "") {
            addErrMsg($('#PaymentAccountDisable'), "err_PaymentAccountDisable", "請點「選擇帳號」帶入付款資訊");
            isSuccess = false;
        }

        // 「分攤明細資訊區」卡控
        if ($('#CoaCompany option:selected').text() == "請選擇" || $('#CoaCompany option:selected').val() == null) {
            addErrMsg($('#CoaCompany'), "err_CoaCompany", "請選擇「帳務行」");
            isSuccess = false;
        }

        if ($('#ProfitCostCenter option:selected').text() == "請選擇") {
            addErrMsg($('#ProfitCostCenter'), "err_ProfitCostCenter", "請選擇「成本與利潤中心」");
            isSuccess = false;
        }

        if ($('#apportionmentOriginDollarInput').val().replace(/\,/g, '') == 0) {
            addErrMsg($('#apportionmentOriginDollarInput'), "err_apportionmentOriginDollarInput", "請輸入「分攤金額(原幣)」");
            isSuccess = false;
        }
        // 第一關－「填表人」卡控
        if ($('#P_CurrentStep').val() == "1") {
            if ($('#ApplicantDepId').val().includes("0113") && $('#PaymentCategory option:selected').text() == "請選擇") {  //  「填表人」為「信用卡處」則開放編輯
                addErrMsg($('#PaymentCategory'), "err_PaymentCategory", "請選擇「費用性質」");
                isSuccess = false;
            }
        }

        // 第三關－「會計經辦」卡控
        if ($('#P_CurrentStep').val() == "3") {
            todayChecked = '';
            todayChecked = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
            var expectedDate = $('#paymentDateInput').val();

            //第三關「遠期支票」邏輯檢核
            if (expectedDate == "" && $('#PaymentWaySelect').val() == 'BILLS_PAYABLE') {
                addErrMsg($('#paymentDateInput'), "err_PaymentDateInput", "請選擇「承辦單位預計付款日期(支票發票日)」");
                isSuccess = false;
            }
            else if (expectedDate != "" && $('#PaymentWaySelect').val() == 'BILLS_PAYABLE') {
                $.ajax({
                    async: false,
                    url: '/EPP/CheckExpectedDate',
                    dataType: 'json',
                    type: 'POST',
                    data: { expectedDate: expectedDate },
                    success: function (data, textStatus, jqXHR) {
                        if (data) {
                            addErrMsg($('#paymentDateInput'), "err_PaymentDateInput", "請選擇「營業日期」");
                            console.log('承辦單位預計付款日期(支票發票日)：' + expectedDate + '非營業日!');
                            isSuccess = false;
                        }
                        else {
                            console.log('承辦單位預計付款日期(支票發票日)：' + expectedDate + '營業日!');
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('自FIIS檢核營業日－CheckExpectedDate() 失敗了!');
                        //isSuccess = false;
                    }
                });
            }
            else {
                console.log('「付款方式」為「即期支票」或「電匯」－承辦單位預計付款日期(支票發票日)為「非必填欄位」');
            }

            //第三關「會計項子目」邏輯檢核
            if ($('#CoaAccount option:selected').text() == "請選擇") {
                addErrMsg($('#CoaAccount'), "err_CoaAccount", "請選擇「會計項子目」");
                isSuccess = false;
            }

            if ($('#VoucherAbstract').val() == "") {
                addErrMsg($('#VoucherAbstract'), "err_VoucherAbstractInput", "請輸入「傳票摘要」");
                isSuccess = false;
            }

            if ($('#ApplicantDepId').val().includes("0113") && $('#PaymentCategory option:selected').text() == "請選擇") {  //  「填表人」為「信用卡處」則開放編輯
                addErrMsg($('#PaymentCategory'), "err_PaymentCategory", "請選擇「費用性質」");
                isSuccess = false;
            }
        }

        if ($('[Errmsg=Y]').length > 0) {
            $('html, body').animate({
                scrollTop: ($('[Errmsg=Y]').first().closest("div .row").offset().top) - 80
            }, 400);
        }
        else {
            //if ($('.fileDetail').length < 1) {
            //    addErrMsg($('#fileRegion'), "err_attachmentGrid", "請上傳「附件檔」");

            //    $('html, body').animate({
            //        scrollTop: ($('[Errmsg=Y]').offset().top)
            //    }, 400);

            //    isSuccess = false;
            //}
        }

        (isSuccess) ? draftAjax.resolve() : draftAjax.reject();
    }, 0);
    return draftAjax.promise();
}
function Save() {
    EPP = TemporaryRepository();

    EPP.EPPNum ? '/EPP/Edit' : '/EPP/Create';

    var _url = EPP.EPPNum ? '/EPP/Edit' : '/EPP/Create';

    return $.ajax({
        async: false,
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: EPP,
        success: function (data, textStatus, jqXHR) {
            _formInfo.formGuid = data.FormGuid;
            _formInfo.formNum = data.FormNum;
            _formInfo.flag = data.Flag;

            $("#FormTypeName").val("廠商預付款(" + $("#ExpenseKind").text() + ")");
            $("#ApplyItem").val($("#ExpenseKind").text() + '－' + $('#suppliesName').text().substring(0, $('#suppliesName').text().lastIndexOf('(')));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('傳送功能－Save()失敗了!');
        }
    });
}
function TemporaryRepository() {
    if ($('#PaymentWaySelect').val() != 'WIRE') {
        $('.WireInfoDisabledText').text("");
        $('.WireInfoDisabledText').val(null);
    }

    EPP.ApplicantEmpNum = $('input[name="ApplicantEmpNum"]').val(); //$('#ApplicantEmpNum').val();
    EPP.ApplicantName = $('#ApplicantName').val();

    EPP.ApplicantDepName = $('#ApplicantDepName').val();
    EPP.ApplicantDepId = $('#ApplicantDepId').val();

    EPP.FillInEmpNum = $('input[name="FillInEmpNum"]').val();

    EPP.FormKind = $('#FormKind').val();

    EPP.EPPID = EPP.EPPID;
    EPP.EPPNum = EPP.EPPNum;
    EPP.PONum = $('#perchaseOrderList').val();
    EPP.ProjectCategory = $('#ProjectTypeSelect').val();
    EPP.Project = $('#ProjectNameSelect').val();
    EPP.ProjectItem = $('#ProjectItemSelect').val();
    EPP.Currency = $('#Currency').val();
    EPP.CurrencyName = $("#Currency").find(":selected").text().split(' ')[0];
    EPP.CurrencyPrecise = $('#CurrencyPrecisionDisable').text() //.val();
    EPP.Rate = $('#ExchangeRateInput').val();
    EPP.BargainingCode = $('#NegotiatePriceNumInput').val();
    EPP.ContractNum = $('#ContractIdInput').val();
    EPP.ExportApplyAttribute = $('#ExportApplyAttributeInput').val();
    EPP.PreAmount = parseFloat($('#TotalPrepaymentsInput').val().replace(/\,/g, '')); //$('#TotalPrepaymentsInput').val();
    EPP.OriginalAmount = $('#apportionmentOriginDollarInput').val().replace(/\,/g, '');
    EPP.TWDAmount = $('#apportionmentOriginDollarInput').val().replace(/\,/g, '');
    EPP.PaymentAmount = $('#apportionmentOriginDollarInput').val().replace(/\,/g, '');

    //EPP.EXPMaster-費用主檔
    EPP.EXPID = EPP.EPPID;
    EPP.ExpenseKind = $('#ExpenseKind').val();

    EPP.VendorNum = $('#VendorName').val(); // == null ? _vendor[0].supplierNumber : $('#VendorSernoInquiredInput').val();
    EPP.VendorID = selectedVendorID;    //vendorItemSelected.supplierID; // 針對拋接所選供應商ID給FIIS
    EPP.IDNo = $('#vatRegistrationNumberDisableText').text();   // 「統一編號/身分證號」欄位
    EPP.LocationID = selectedVendorSiteID;    //vendorItemSelected.supplierSite[0].supplierSiteID;   // 針對拋接所選供應商地址ID給FIIS
    EPP.VendorSiteCode = selectedVendorSiteCode;    //所選供應商地址代號

    EPP.VendorName = $('#VendorName').text();
    EPP.PaymentStatus = $('#PaymentStatus').val();
    EPP.Emergency = $("#IsUrgency").prop("checked");
    EPP.PayAlone = $("#IsSinglePayment").prop("checked");   //$('#IsSinglePayment').val();
    EPP.EstimatePayDate = $('#expectPaymentDate').text();
    EPP.ExceptedPaymentDate = $('#paymentDateInput').val();     //$('#orgnizerExpectPaymentDate').text();
    EPP.VoucherBeau = $('#VoucherObjectSelect option:selected').text().split(' ').pop();   //$('#VoucherObjectSelect').val();
    EPP.VoucherBeauName = $('#VoucherObjectSelect option:selected').text().split(' ' + EPP.VoucherBeau)[0]   //$('#VoucherObjectSelect option:selected').text();
    EPP.Books = $('#AccountBankDisable').text().split(' ')[0];  //$('#CoaCompany').val();
    EPP.BooksName = $('#AccountBankDisable').text().split(' ')[1];  //$('#AccountBankDisable').text();
    EPP.HeaderDesc = $('#PaymentRequestAbstractInput').val();
    EPP.ExpenseDesc = $('#PaymentRequestDiscriptionInput').val();

    //PaymentInfo-付款資訊檔
    EPP.PaymentInfo = {
    };
    EPP.PaymentInfo.FormID = EPP.EPPID;
    EPP.PaymentInfo.EMPNum = $('#VendorNameInput').val();   // 供應商/員工編號
    EPP.PaymentInfo.EMPName = $('#VendorNameInput').val();
    EPP.PaymentInfo.AccountDesc = $('#AccountDescriptionTitle').val();
    EPP.PaymentInfo.PaymentMethod = $('#PaymentWaySelect').val();

    EPP.PaymentInfo.PaymentMethodName = $('#PaymentWaySelect option:selected').text();

    EPP.PaymentInfo.PayReMark = $('#PaymentMemoTextArea').val();
    EPP.PaymentInfo.Remittance = $('#RemmitanceFeeDisable').val();
    EPP.PaymentInfo.BooksName = $('#AccountBankDisable').text();

    EPP.PaymentInfo.Bank = $('#PaymentBankDisable').val();
    EPP.PaymentInfo.BankName = $('#PaymentBankDisable').text().split(' ')[1];

    EPP.PaymentInfo.Branch = $("#PaymentBranchDisable").val();
    EPP.PaymentInfo.BranchName = $('#PaymentBranchDisable').text().split(' ')[1];

    EPP.PaymentInfo.AccountNum = $('#PaymentAccountDisable').text();
    EPP.PaymentInfo.AccountName = $('#PaymentWaySelect').val() == 'WIRE' ? $('#PaymentNameDisable').text() : $('#PaymentNameInput').val();
    EPP.PaymentInfo.AccountDesc = $('#AccountDescriptionDisable').text();

    EPP.PaymentInfo.BankAccountId = $('#PaymentAccountId').text();

    EPP.AmortizationDetail = {};

    EPP.AmortizationDetail.FormID = EPP.EPPID === null ? null : EPP.EPPID;

    AmortizationDetailID = AmortizationDetailID;
    EPP.AmortizationDetail.AccountBank = $('#CoaCompany').val();  //分攤明細－帳務行;
    EPP.AmortizationDetail.AccountBankName = $('#CoaCompany option:selected').data("CoaCompanyName");   //分攤明細－帳務行;
    EPP.AmortizationDetail.AccountingItem = $('#CoaAccount').val(); //分攤明細－會計項子目;
    EPP.AmortizationDetail.AccountingItemName = $('#CoaAccount option:selected').data("CoaAccountName"); //分攤明細－會計項子目;
    EPP.AmortizationDetail.CostProfitCenter = $('#ProfitCostCenter').val(); //分攤明細－成本利潤中心
    EPP.AmortizationDetail.CostProfitCenterName = $('#ProfitCostCenter option:selected').data("ProfitCostCenterName"); //分攤明細－成本利潤中心
    EPP.AmortizationDetail.ProductKind = $('#ProductCategory').val(); //分攤明細－產品別
    EPP.AmortizationDetail.ProductKindName = $('#ProductCategory option:selected').data("ProductCategoryName"); //分攤明細－產品別
    EPP.AmortizationDetail.ProductDetail = $('#ProductDetail').val(); //分攤明細－產品明細
    EPP.AmortizationDetail.ProductDetailName = $('#ProductDetail option:selected').data("ProductDetailName"); //分攤明細－產品明細
    EPP.AmortizationDetail.ExpenseAttribute = $('#PaymentCategory').val(); //分攤明細－費用性質
    EPP.AmortizationDetail.ExpenseAttributeName = $('#PaymentCategory option:selected').text() == '請選擇' ? '' : $('#PaymentCategory option:selected').text(); //分攤明細－費用性質
    EPP.AmortizationDetail.OriginalAmortizationAmount = parseFloat($('#apportionmentOriginDollarInput').val().replace(/\,/g, ''));
    EPP.AmortizationDetail.OriginalAmortizationTWDAmount = parseFloat($('#apportionmentOriginDollarInput').val().replace(/\,/g, '')); //「廠商預付款」目前僅開放台幣使用
    EPP.AmortizationDetail.SummonsDesc = $('#VoucherAbstract').val();

    return EPP;
}
function LoadEPPFormData(FormData) {
    selectedVendorID = FormData.VendorID; // 針對拋接所選供應商ID給FIIS
    selectedVendorSiteID = FormData.LocationID;   // 針對拋接所選供應商地址ID給FIIS
    selectedVendorSiteCode = FormData.VendorSiteCode;   // 所選供應商地址代號

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
    // 根據供應商編號取得「採購單號」
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetSuppliersPurchaseOrder?supplierNumber=' + FormData.VendorNum + '&supplierSiteCode=' + FormData.VendorSiteCode,
        success: function (data) {
            FIIS_SuppliersPurchaseOrderOption($("#perchaseOrderList"), data.detail);

            _SuppliersPurchaseOrder = data;

            if (FormData.VendorNum == null) {
                DisableDOMObject($("#perchaseOrderList"));
            }
            else {
                EnableDOMObject($("#perchaseOrderList"));
                $('#perchaseOrderList').val(FormData.PONum);
                $('#perchaseOrderList').selectpicker('refresh');
            }
        },
        error: function (data) {
            console.log('依據供應商編號取得「採購單號」失敗!');
        }
    })

    $('#ProjectTypeSelect option[value=' + FormData.ProjectCategory + ']').attr("selected", "selected");
    $("#ProjectTypeSelect").selectpicker('refresh');

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
            console.log('「專案項目」取得失敗!');
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
        }
        else {
            $('#ExchangeRate').hide();
            $('#ExchangeRateInput').text($('#ExchangeRate').val());
            $('#ExchangeRateInput').show();
        }
    }

    $('#VendorName').val(FormData.VendorNum);
    $('#VendorName').text(FormData.VendorName == null ? '' : FormData.VendorName);
    $('#ContractIdInput').val(FormData.ContractNum);
    $('#ExportApplyAttributeInput').val(FormData.ExportApplyAttribute);
    $('#TotalPrepaymentsInput').val(accounting.formatNumber(FormData.PreAmount));
    $('#totalOriginDollar').text(accounting.formatNumber(FormData.OriginalAmount));
    $('#totalNTDollar').text(accounting.formatNumber(FormData.TWDAmount));
    $('#PaymentTWD').text(accounting.formatNumber(FormData.PaymentAmount));

    //EPP.EXPMaster-費用主檔
    $('#ExpenseKind').val(FormData.ExpenseKind);
    FormData.VendorName == null ? $('#suppliesName').text('請選擇供應商') : $('#suppliesName').text(FormData.VendorName + '(' + FormData.VendorNum + ')');
    $('#PaymentStatus').val(FormData.PaymentStatus);

    $("#IsUrgency").prop("checked", FormData.Emergency);

    $("#IsSinglePayment").prop("checked", FormData.PayAlone);

    $('#expectPaymentDate').text(FormData.EstimatePayDateToString);

    //日期選擇卡控－無法選擇過去的日期
    $("#divPaymentDate").data("DateTimePicker").minDate(new Date());
    $('#paymentDateInput').val(FormData.ExceptedPaymentDateToString);

    $('#PaymentRequestAbstractInput').val(FormData.HeaderDesc);
    $('#PaymentRequestDiscriptionInput').val(FormData.ExpenseDesc);

    //PaymentInfo-付款資訊檔
    EPP.PaymentInfo.EMPNum = $('#VendorNameInput').val(FormData.PaymentInfo.EMPNum);  // 供應商/員工編號
    $('#VendorNameInput').val(FormData.PaymentInfo.EMPName);
    $('#AccountDescriptionDisable').val(FormData.PaymentInfo.AccountDesc);

    $('#PaymentAccountId').text(FormData.PaymentInfo.BankAccountId);

    if (FormData.PaymentInfo.PaymentMethod != "") {
        $('#PaymentWaySelect option[value=' + FormData.PaymentInfo.PaymentMethod + ']').attr("selected", "selected");
        $("#PaymentWaySelect").selectpicker('refresh');
    }
    $('#PaymentMemoTextArea').val(FormData.PaymentInfo.PayReMark);

    if (EPP.PaymentInfo.BankName != "" && EPP.PaymentInfo.BankName != null) {
        if (FormData.PaymentInfo.Remittance) {
            // 依據供應商代出 預設匯費選項
            switch (FormData.PaymentInfo.Remittance) {
                case "1":
                    $("#RemmitanceFeeDisable").val("1");
                    $("#RemmitanceFeeDisable").text("內扣");
                    break;
                case "2":
                    $("#RemmitanceFeeDisable").val("2");
                    $("#RemmitanceFeeDisable").text("外加");
                    break;
                case "3":
                    $("#RemmitanceFeeDisable").val("3");
                    $("#RemmitanceFeeDisable").text("本行帳戶");
                    break;
                default:
                    console.log("未成功讀取「匯費」資料");
            }
        }

        $('#PaymentBankDisable').val(EPP.PaymentInfo.Bank);
        $('#PaymentBankDisable').text(EPP.PaymentInfo.Bank + ' ' + EPP.PaymentInfo.BankName);
        $('#PaymentBankDisable').show();

        $("#PaymentBranchDisable").val(EPP.PaymentInfo.Branch);
        $('#PaymentBranchDisable').text(EPP.PaymentInfo.Branch + ' ' + EPP.PaymentInfo.BranchName);
        $('#PaymentBranchDisable').show();

        $('#PaymentAccountDisable').text(EPP.PaymentInfo.AccountNum);
        $('#PaymentAccountDisable').show();

        $('#AccountDescriptionDisable').text(EPP.PaymentInfo.AccountDesc);

        if (EPP.PaymentInfo.PaymentMethod == "WIRE") {
            if (EPP.PaymentInfo.AccountName == 'null' || EPP.PaymentInfo.AccountName == null) {
                $('#PaymentNameDisable').text("");
            }
            else {
                $('#PaymentNameDisable').text(EPP.PaymentInfo.AccountName);
            }
        }
        else {
            $('#PaymentNameInput').val(EPP.PaymentInfo.AccountName);

            $('#PaymentNameInput').show();
            $('#PaymentNameDisable').hide();

            $('#AccountSelectBtn').hide();
            $('.WireInfo').hide();

            $("#PaymentWaySelect").selectpicker('refresh');
        }
    }
    else if ($('#suppliesName').text() != "請選擇供應商") {
        if (FormData.PaymentInfo.Remittance) {
            // 依據供應商代出 預設匯費選項
            switch (FormData.PaymentInfo.Remittance) {
                case "1":
                    $("#RemmitanceFeeDisable").val("1");
                    $("#RemmitanceFeeDisable").text("內扣");
                    $('#RemmitanceFeeDisable').show();
                    break;
                case "2":
                    $("#RemmitanceFeeDisable").val("2");
                    $("#RemmitanceFeeDisable").text("外加");
                    $('#RemmitanceFeeDisable').show();
                    break;
                case "3":
                    $("#RemmitanceFeeDisable").val("3");
                    $("#RemmitanceFeeDisable").text("本行帳戶");
                    $('#RemmitanceFeeDisable').show();
                    break;
                default:
                    console.log("未成功讀取「匯費」資料");
            }
        }

        $('#PaymentBankDisable').val(EPP.PaymentInfo.Bank);
        $('#PaymentBankDisable').text(EPP.PaymentInfo.BankName == null ? "" : EPP.PaymentInfo.BankName);
        $('#PaymentBankDisable').show();

        $("#PaymentBranchDisable").val(EPP.PaymentInfo.Branch);
        $('#PaymentBranchDisable').text(EPP.PaymentInfo.BranchName == null ? "" : EPP.PaymentInfo.BranchName);
        $('#PaymentBranchDisable').show();

        $('#PaymentAccountDisable').text(EPP.PaymentInfo.AccountNum == null ? "" : EPP.PaymentInfo.AccountNum); //$('#PaymentAccountInput').val();
        $('#PaymentAccountDisable').show();

        $('#AccountDescriptionDisable').text(EPP.PaymentInfo.AccountDesc);

        if (EPP.PaymentInfo.paymentMethod == "WIRE") {
            if (EPP.PaymentInfo.AccountName == 'null' || EPP.PaymentInfo.AccountName == null) {
                $('#PaymentNameDisable').text("");
            }
            else {
                $('#PaymentNameDisable').text(EPP.PaymentInfo.AccountName);
            }
            $('.WireInfo').show();
        }
        else {
            $('#PaymentNameInput').val(EPP.PaymentInfo.AccountName);
            $('.WireInfo').hide();
        }
    }

    if (FormData.BooksName != "" && FormData.BooksName != null) {
        $('#AccountBank').val(FormData.Books);
        $('#AccountBankDisable').text(FormData.Books + ' ' + FormData.BooksName);
    }

    //取得 憑證開立對象 & 憑證開立對象之帳務行
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetCertificateObject?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            $.each(data, function (key, txt) {
                $('#VoucherObjectSelect').append($("<option></option>").attr("value", txt.accountCode + ' ' + txt.accountName).text(txt.businessEntity + " " + txt.bANNumber));
            })

            $('#VoucherObjectSelect').selectpicker('refresh');
            _VoucherBeauCollection = data;
        },
        error: function (data) {
        }
    })
    $('#VoucherObjectSelect').val(FormData.Books + ' ' + FormData.BooksName);
    $('#VoucherObjectSelect').selectpicker('refresh');
    //分攤明細－AmortizationDetail

    $('#apportionmentOriginDollarInput').val(accounting.formatNumber(FormData.AmortizationDetail.OriginalAmortizationAmount));
    $('#AccountingItemName').val(FormData.AmortizationDetail.AccountingItemName);
    $('#apportionmentTable').val(FormData.AmortizationDetail.apportionmentTable);

    //分攤明細－取得產品別
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetProduct?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            $('#ProductCategory').append($("<option></option>").attr("value", null).text('請選擇'));
            $.each(data, function (key, value) {
                $('#ProductCategory').append($("<option></option>").attr("value", value.product).text(value.product + " " + value.description)
                .data("ProductCategoryName", value.description));
            })
            $('#ProductCategory').selectpicker('refresh');
            $('#ProductCategory option[value=' + FormData.AmortizationDetail.ProductKind + ']').attr("selected", "selected");
            $('#ProductCategory').selectpicker('refresh');
            _coaDepartmentProduct = data;
        },
        error: function (data) {
        }
    })

    //分攤明細－取得產品明細
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetProductDetail?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            $('#ProductDetail').append($("<option></option>").attr("value", null).text('請選擇'));
            $.each(data, function (key, txt) {
                $('#ProductDetail').append($("<option></option>").attr("value", txt.productDetail).text(txt.productDetail + " " + txt.productDetallDescription)
                .data("ProductDetailName", txt.productDetallDescription));
            })
            $('#ProductDetail').selectpicker('refresh');
            $('#ProductDetail option[value=' + FormData.AmortizationDetail.ProductDetail + ']').attr("selected", "selected");
            $('#ProductDetail').selectpicker('refresh');
            _coaDepartmentProduct = data;
        },
        error: function (data) {
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
                $('#PaymentCategory').append($("<option></option>").attr("value", index).text(index + ' ' + value));
            });
            $('#PaymentCategory option[value=' + FormData.AmortizationDetail.ExpenseAttribute + ']').attr("selected", "selected");
            $("#PaymentCategory").selectpicker('refresh');

            _expenseAttributeCollection = data;
        },
        error: function (data) {
            debugger
        }
    })

    //分攤明細－取得成本利潤中心
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetCoaCompanyAndDepartment?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            $.each(data, function (key, value) {
                $("#ProfitCostCenter").append($("<option></option>").attr("value", value.department).text(value.department + " " + value.description)
                .data("ProfitCostCenterName", value.description));
            })
            $("#ProfitCostCenter").selectpicker('refresh');
            $('#ProfitCostCenter option[value=' + FormData.AmortizationDetail.CostProfitCenter + ']').attr("selected", "selected");
            $("#ProfitCostCenter").selectpicker('refresh');

            _coaCompanyAndDepartmentCollection = data;
        },
        error: function (data) {
        }
    })

    //分攤明細－取得填表人所屬的成本利潤中心
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetcostCenter?EmpNum=' + $('#ApplicantEmpNum').val() + '&sourceKeyId=' + $('#DocNum').text() + '&sourceCode=' + 'EPP',
        success: function (data) {
            $('#ProfitCostCenter option[value=' + data.department + ']').attr("selected", "selected");
            $("#ProfitCostCenter").selectpicker('refresh');

            _coaCostCenter = data;
        },
        error: function (data) {
        }
    })

    //分攤明細－取得帳務行
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetCoaCompany?EppNum=' + $('#P_SignID').val(),        //取得 分攤明細層「帳務行」
        success: function (data) {
            $.each(data, function (key, value) {
                //$("#CoaCompany").append($("<option></option>").attr("value", txt.accountCode).text(txt.accountCode + " " + txt.accountName));
                $("#CoaCompany").append($("<option></option>").attr("value", value.company).text(value.company + " " + value.description)
                .data("CoaCompanyName", value.description));
            })
            $("#CoaCompany").selectpicker('refresh');
            $('#CoaCompany').val(FormData.AmortizationDetail.AccountBank);
            $("#CoaCompany").selectpicker('refresh');

            _coaCompanyCollection = data;
        },
        error: function (data) {
        }
    })

    //分攤明細－取得會計項子目
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetCoaAccount?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            $.each(data, function (key, value) {
                $("#CoaAccount").append($("<option></option>").attr("value", value.account).text(value.account + " " + value.description)
                .data("CoaAccountName", value.description));
            })
            $("#CoaAccount").selectpicker('refresh');
            $('#CoaAccount option[value=' + FormData.AmortizationDetail.AccountingItem + ']').attr("selected", "selected");
            $("#CoaAccount").selectpicker('refresh');

            _coaAccountCollection = data;
        },
        error: function (data) {
        }
    })

    $('#apportionmentNTDollar').text($('#apportionmentOriginDollarInput').val());
    $('#VoucherAbstract').val(FormData.AmortizationDetail.SummonsDesc);

    if ($('#suppliesName').text() == '請選擇供應商') {
        $('#PaymentWaySelect').attr('disabled', 'disabled');
    }
    else {
        if ($('#PaymentWaySelect').val() == 'WIRE') {
            $('#AccountSelectBtn').show();
            $('.WireInfo').show();
            $('#PaymentNameDisable').show();
            $('#PaymentNameInput').hide();

            $('.PaymentWaySelect').attr("disabled", true);
            $('#PaymentWaySelect').addClass("input-disable");

            EnableDOMObject($('#PaymentWaySelect'));
        }
        else {
            $('#PaymentNameInput').show();
            $('#PaymentNameDisable').hide();

            $('#AccountSelectBtn').hide();
            $('.WireInfo').hide();

            EnableDOMObject($('#PaymentWaySelect'));
        }
        $('#PaymentWaySelect').removeAttr('disabled');
    }

    if (EPP.PaymentInfo.PaymentMethod == "WIRE") {
        if (EPP.PaymentInfo.AccountName == 'null' || EPP.PaymentInfo.AccountName == null) {
            $('#PaymentNameDisable').text("");
        }
        else {
            $('#PaymentNameDisable').text(EPP.PaymentInfo.AccountName);
        }
        $('.WireInfo').show();
    }
    else {
        $('#PaymentNameInput').val(EPP.PaymentInfo.AccountName);

        $('#PaymentNameInput').show();
        $('#PaymentNameDisable').hide();

        $('#AccountSelectBtn').hide();
        $('.WireInfo').hide();

        $("#PaymentWaySelect").selectpicker('refresh');
    }
}

function vendorSelected(vendor) {
    //確認選擇供應商，更新供應商名稱 & 重設側邊選單
    if (vendor) {
        vendorItemSelected = vendor;
        vendorSelectedInitial(vendorItemSelected);
        suppliesUIChange(vendor.supplierName, vendor.supplierNumber);

        selectedVendorID = vendorItemSelected.supplierID;
        selectedVendorSiteID = vendorItemSelected.supplierSite[0].supplierSiteID;

        selectedVendorSiteCode = vendorItemSelected.supplierSite[0].supplierSiteCode;   //所選供應商地址代號

        $('#vatRegistrationNumberDisableText').text(vendorItemSelected.vatRegistrationNumber == null ? '' : vendorItemSelected.vatRegistrationNumber);

        paymentWaySelected = vendorItemSelected.supplierSite[0].paymentMethodLookupCode;
        vendorRemittance = vendorItemSelected.supplierSite[0].paymentReasonCode;

        $('#PaymentWaySelect').val(vendorItemSelected);

        $('#PaymentWaySelect option[value=' + paymentWayUI(vendorItemSelected, paymentWaySelected) + ']').attr('selected', 'selected');
        $("#PaymentWaySelect").selectpicker('refresh');

        RemittanceDisplay(vendorItemSelected, vendorRemittance);

        resetSubMenu();
    }
    console.log(vendor);
}
function paymentWayUI(vendorItemSelected, paymentWaySelected) {
    //根據指定供應商地址－進行"付款方式UI切換"
    if ('WIRE' == paymentWaySelected) {
        $('.PaymentWaySelect').attr("disabled", true);
        $('#PaymentWaySelect').addClass("input-disable");

        EnableDOMObject($('#PaymentWaySelect'));

        $("#PaymentWaySelect").val(paymentWaySelected);
        $('#PaymentWaySelect option[value=' + paymentWaySelected + ']').attr('selected', 'selected');
        $("#PaymentWaySelect").selectpicker('refresh');

        AccountSelectedBtn(vendorItemSelected);

        $('#AccountSelectBtn').show();
        $('.WireInfo').show();
        $('#PaymentNameDisable').show();
        $('#PaymentNameInput').hide();
    }
    else if ('CHECK' == paymentWaySelected || 'BILLS_PAYABLE' == paymentWaySelected) {
        $('#PaymentNameInput').show();
        $('#PaymentNameDisable').hide();

        $('#AccountSelectBtn').hide();
        $('.WireInfo').hide();
        $('#PaymentNameInput').val(vendorItemSelected.supplierName);

        EnableDOMObject($('#PaymentWaySelect'));

        $("#PaymentWaySelect").val(paymentWaySelected);
        $('#PaymentWaySelect option[value=' + paymentWaySelected + ']').attr('selected', 'selected');
        $("#PaymentWaySelect").selectpicker('refresh');
    }
    else {
        console.log('FIIS 供應商無付款方式');
        console.log(vendorItemSelected);
    }

    return paymentWaySelected;
}
function PaymentWaySelectorSetting(target) {
    $('#PaymentWaySelect').empty();
    $("#PaymentWaySelect").selectpicker('refresh');

    //==========================================
    // FIIS 付款方式
    //==========================================

    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/EPP/GetPaymentMethod?EppNum=' + $('#P_SignID').val(),
        success: function (data) {
            FIIS_PaymentMethodOption($("#PaymentWaySelect"), data);

            _coaDepartmentProduct = data;
        },
        error: function (data) {
            console.log('「FIIS 付款方式」取得失敗!');
        }
    });

    let WIREOption = false, BILLS_PAYABLEOption = false, CHECKOption = false;

    for (var i = 0; i < target.length; i++) {
        if ('WIRE' == target[i].paymentMethodLookupCode) {
            WIREOption = true;
        }

        if ('BILLS_PAYABLE' == target[i].paymentMethodLookupCode) {
            BILLS_PAYABLEOption = true;
        }

        if ('CHECK' == target[i].paymentMethodLookupCode) {
            CHECKOption = true;
        }
    }

    if (!WIREOption) {
        $("#PaymentWaySelect option[value='WIRE']").remove();
    }

    if (!BILLS_PAYABLEOption) {
        $("#PaymentWaySelect option[value='BILLS_PAYABLE']").remove();
    }

    if (!CHECKOption) {
        $("#PaymentWaySelect option[value='CHECK']").remove();
    }
}

function vendorSelectedInitial(vendorItemSelected) {
    //根據指定供應商地址－帶入預設值(單獨付款、會計項子目)
    $('#VendorName').val(vendorItemSelected.supplierNumber);

    if (null != vendorItemSelected.supplierSite[0].prepayCodeCombinationAccount) {
        //分攤明細－根據供應商：預設會計項子目
        $('#CoaAccount option[value=' + vendorItemSelected.supplierSite[0].prepayCodeCombinationAccount + ']').attr('selected', 'selected');
        $("#CoaAccount").selectpicker('refresh');
        $("#CoaAccount").val(vendorItemSelected.supplierSite[0].prepayCodeCombinationAccount);
        DisableDOMObject($("#CoaAccount"));
    }

    IsSinglePayment(vendorItemSelected.supplierSite[0].exclusivePaymentFlag);
}
function IsSinglePayment(IsSinglePaymentFlag) {
    //根據指定供應商地址確認是否"單獨付款"
    if ('Y' == IsSinglePaymentFlag) {
        $('#IsSinglePayment').prop('checked', true);
    }
    else {
        $('#IsSinglePayment').prop('checked', false);
    }
    $('#IsSinglePayment').val(IsSinglePaymentFlag);
}

function RemittanceDisplay(vendorItemSelected, remittance) {
    //根據指定供應商地址顯示"匯費"種類
    if (remittance) {
        // 依據供應商代出 預設匯費選項
        switch (remittance) {
            case "1":
                $("#RemmitanceFeeDisable").val("1");
                $("#RemmitanceFeeDisable").text("內扣");
                break;
            case "2":
                $("#RemmitanceFeeDisable").val("2");
                $("#RemmitanceFeeDisable").text("外加");
                break;
            case "3":
                $("#RemmitanceFeeDisable").val("3");
                $("#RemmitanceFeeDisable").text("本行帳戶");
                break;
            default:
                console.log("FIIS 未提供相對應資料");
        }
    }
    console.log(vendorItemSelected);
}
function AccountSelectedBtn(vendorItemSelected) {
    if ($('#AccountSelectBtn').length == 1 && vendorItemSelected.supplierBank.length > 1) {
        $('.AccountItems').remove();
        for (var i = 0; i < vendorItemSelected.supplierBank.length; i++) {
            $('#AccountList').find('ul').eq(1).append(
                '<li class="AccountSelect AccountItems">\
                <label class="w100 label-box">\
                    <div class="table-box w5">\<input name="AccountSelector" type="radio"></div>\
                    <div class="table-box w12 popup-PaymentBankAccountId hidden">' + vendorItemSelected.supplierBank[i].extBankAccountId + '</div>\
                    <div class="table-box w12 popup-PaymentBank">' + vendorItemSelected.supplierBank[i].bankNumber + " " + vendorItemSelected.supplierBank[i].bankName + '</div>\
                    <div class="table-box w15 popup-PaymentBranch">' + vendorItemSelected.supplierBank[i].branchNumber + " " + vendorItemSelected.supplierBank[i].bankBranchName + '</div>\
                    <div class="table-box w15 popup-PaymentAccount">' + vendorItemSelected.supplierBank[i].bankAccountNumber + '</div>\
                    <div class="table-box w20 popup-PaymentName">' + vendorItemSelected.supplierBank[i].bankAccountName + '</div>\
                    <div class="table-box w20 popup-PaymentDescription">' + (vendorItemSelected.supplierBank[i].bankAccountNumRemark == null ? "" : vendorItemSelected.supplierBank[i].bankAccountNumRemark) + '</div>\
                </label>\
            </li>');
        }

        $('#AccountSelectBtn').show();
    }
    else if ($('#AccountSelectBtn').length == 0 && vendorItemSelected.supplierBank.length >= 1) {
        $('#AccountDescription').append(
            '<div class="col-sm-2 content-box" id="AccountSelectBtn" style="padding-top:40px">\
                <div class="area-1">\
                    <div class="area-btn-right-1">\
                        <a id="AccountOpen" class="btn-02-blue btn-left">\
                            選擇帳號\
                        </a>\
                    </div>\
                </div>\
            </div>'
        );

        $('#AccountList').append(
            '<div class="popup-tbody h160 overflow-auto">\
                <ul class="w100" id="AccountItem">\
                </ul>\
            </div>'
        );

        $('.AccountItems').remove();
        for (var i = 0; i < vendorItemSelected.supplierBank.length; i++) {
            $('#AccountList').find('ul').eq(1).append(
                '<li class="AccountSelect AccountItems">\
                <label class="w100 label-box">\
                    <div class="table-box w5">\<input name="AccountSelector" type="radio"></div>\
                    <div class="table-box w12 popup-PaymentBankAccountId hidden">' + vendorItemSelected.supplierBank[i].extBankAccountId + '</div>\
                    <div class="table-box w12 popup-PaymentBank">' + vendorItemSelected.supplierBank[i].bankNumber + " " + vendorItemSelected.supplierBank[i].bankName + '</div>\
                    <div class="table-box w15 popup-PaymentBranch">' + vendorItemSelected.supplierBank[i].branchNumber + " " + vendorItemSelected.supplierBank[i].bankBranchName + '</div>\
                    <div class="table-box w15 popup-PaymentAccount">' + vendorItemSelected.supplierBank[i].bankAccountNumber + '</div>\
                    <div class="table-box w20 popup-PaymentName">' + vendorItemSelected.supplierBank[i].bankAccountName + '</div>\
                    <div class="table-box w20 popup-PaymentDescription">' + (vendorItemSelected.supplierBank[i].bankAccountNumRemark == null ? "" : vendorItemSelected.supplierBank[i].bankAccountNumRemark) + '</div>\
                </label>\
            </li>');
        }
    }

    $('#AccountOpen').show();
    $('#AccountSelectBtn').show();
}
function suppliesUIChange(name, number) {
    //供應商變更的UI操作
    $('#suppliesName').text(name + '(' + number + ')');
    $('#suppliesSerno').text(number);
    $('#VendorName').text(name);
    $('#VendorName').val(number);
}
function suppliesSetting(vendor, number) {
    //供應商變更的UI操作
    switch (vendor) {
        case "":
            break;
        case "":
            break;

        default:
    }

    $('#suppliesName').text(name + '(' + number + ')');
    $('#suppliesSerno').text(number);
    $('#VendorName').text(name);
    $('#VendorName').val(number);
}
function WireMethodClear() {
    $('#PaymentBankDisable').text('');
    $('#PaymentBranchDisable').text('');
    $('#PaymentAccountDisable').text('');
    $('#PaymentNameDisable').text('');
}
function GetProductDetail(code) {
    // 根據FIIS-取得產品明細
    $("#ProductDetail").on(function () {
        $("#ProductDetail").ajax("/EMP/GetProjectItem", {
            ProjectCode: code
        },
                            function (data) {
                                var rtn = {
                                    true: ""
                                }
                                if (data.IsSuccess) {
                                    $('#ProductDetail option[value=' + code + ']').attr('selected', 'selected');
                                    $("#ProductDetail ").selectpicker('refresh');
                                }
                                else {
                                    rtn = {
                                        false: data.Message
                                    }
                                }
                            }, "獲取產品明細失敗")
    })

    $("#ProductDetail").empty();
    $("#ProductDetail").attr("selectedIndex", 0)

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

    $("#ProductDetail").selectpicker('refresh');
    $("#ProjectItemSelect").selectpicker('refresh');

    $("#ProjectItemSelect").attr("disabled", "disabled");
    $("#ProjectItemSelect").selectpicker('refresh');
}
function completedToFiis() {
    //點選「結案」後，將資料傳入 FIIS
    $.ajax({
        url: '/EPP/ImportToFiis',
        dataType: 'json',
        type: 'POST',
        data: EPP,
        success: function (data, textStatus, jqXHR) {
            _formInfo.formGuid = data.FormGuid;
            _formInfo.formNum = data.FormNum;
            _formInfo.flag = false;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Import To FIIS 失敗了!');
            _formInfo.flag = false;
        }
    });
}