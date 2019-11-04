var _initialControlexe = false;

function initialControl() {
    var url = location.pathname;
    var stage = parseInt($('#P_CurrentStep').val())
    var $incomeTaxDetail = $('#IncomeTaxTable');

    if (!$('#ApplicantDepId').val().includes("0113")) {
        $('.CreditCardOpen').remove()
    }
    if (url.toLocaleLowerCase().includes("readonly") || $('#P_Status').val() == "4") {
        $('.fieldcon-prodetail').parents('td').find('span').removeClass('col-sm-11')
        $('.fieldcon-prodetail').remove()
        $('.fieldcon-AccountingItem').remove();

        switch (stage) {
            case 1:
                disableAllField();

                $('#CurrencyPrecision').hide()
                $('.VoucherMemo').remove()
                $('#ENPSerno').attr('rowspan', 5)
                break;
            case 2:
                disableAllField()

                $('#CurrencyPrecision').hide()
                $('.VoucherMemo').remove()
                $('#ENPSerno').attr('rowspan', 5)
                break;
            case 3:
                disableAllField();
                if (accounting.unformat($('#WithHoldingAmountInput').val()) != 0) {
                    $('#WithHoldingAccountingAmount').show();
                }
                $('.EmergencyLabel').show()
                $('#ExceptedPaymentDateTitle').show()
                break;
            case 4:
                disableAllField()
                if (accounting.unformat($('#WithHoldingAmountInput').val()) != 0) {
                    $('#WithHoldingAccountingAmount').show();
                }
                roAccountingReview()
                $('#ExceptedPaymentDateTitle').show()
                break;
            case 5:
                disableAllField()
                if (accounting.unformat($('#WithHoldingAmountInput').val()) != 0) {
                    $('#WithHoldingAccountingAmount').show();
                }
                roAccountingReview()
                $('#ExceptedPaymentDateTitle').show()
                break;
            default:
                break;
        }
        if ($('#InvoiceOverdueInput').val() == undefined || $('#InvoiceOverdueInput').val() == "") {
            $('#InvoiceOverdue').hide()
        }
        if ($('#YearVoucherInput').val() == undefined || $('#YearVoucherInput').val() == "") {
            $('#YearVoucher').hide()
        }
        SwitchHideDisplay([$incomeTaxDetail.find('input[id$="Input"]'), $incomeTaxDetail.find('select[id$="Select"]')], [$incomeTaxDetail.find('div[id$="Disable"]')]);
        if ($('#P_Status').val() == "2") {
            $('#sendButton').append('<a class="function-btn" onclick="location.href=\'/ENP/Create/' + $('input[name="FormID"]').val() + '\'">複製</a>')
        }
        return;
    }
    if (url.toLocaleLowerCase().includes("checkout")) {
        switch (stage) {
            case 1:
                openTableEdit()

                $('.fieldcon-AccountingItem').remove()

                $('#CurrencyPrecision').hide()
                $('.VoucherMemo').remove()
                $('#ENPSerno').attr('rowspan', 5)
                if ($('#VendorNumInput').val() && $('#VendorNumInput').val() != "") {
                    $('#PayAlone').prop('disabled', false).removeClass('input-disable nonborder');
                }
                $('[type="text"]#PayAlone').prop('disabled', false).removeClass('input-disable nonborder');

                break;
            case 2:
                disableAllField()

                $('.fieldcon-prodetail').parents('td').find('span').removeClass('col-sm-11')
                $('.fieldcon-prodetail').remove()
                $('.fieldcon-AccountingItem').remove()

                $('#CurrencyPrecision').hide()
                $('.VoucherMemo').remove()
                $('#ENPSerno').attr('rowspan', 5)

                SwitchHideDisplay([$incomeTaxDetail.find('input[id$="Input"]'), $incomeTaxDetail.find('select')], [$incomeTaxDetail.find('div[id$="Disable"]')]);
                break;
            case 3:
                disableAllField();

                openTableEdit("amo")
                openTableEdit("enpd")
                $('.EmergencyLabel').show()

                coAccountingField();
                break;
            case 4:
                disableAllField();

                roAccountingReview()
                $('.fieldcon-prodetail').parents('td').find('span').removeClass('col-sm-11')
                $('.fieldcon-prodetail').remove()
                $('.fieldcon-AccountingItem').remove()
                $('#ExceptedPaymentDateTitle').show()
                if (accounting.unformat($('#WithHoldingAmountInput').val()) != 0) {
                    $('#WithHoldingAccountingAmount').show();
                }
                break;
            case 5:
                disableAllField();

                roAccountingReview()
                $('.fieldcon-prodetail').parents('td').find('span').removeClass('col-sm-11')
                $('.fieldcon-prodetail').remove()
                $('.fieldcon-AccountingItem').remove()
                $('#ExceptedPaymentDateTitle').show()
                if (accounting.unformat($('#WithHoldingAmountInput').val()) != 0) {
                    $('#WithHoldingAccountingAmount').show();
                }
                break;
            default:
                break;
        }
        _initialControlexe = true
        return;
    }
    if (url.toLocaleLowerCase().includes("create") || url.toLocaleLowerCase().includes("edit")) {
        $('#CurrencyPrecision').hide()
        $('.VoucherMemo').remove()
        $('#ENPSerno').attr('rowspan', 5)
        $('.fieldcon-AccountingItem').remove()
        $('#ExpenseKindDisable').hide()
        if ($('#VendorNumInput').val() && $('#VendorNumInput').val() != "") {
            $('#PayAlone').prop('disabled', false).removeClass('input-disable nonborder');
        }
        $('[type="text"]#PayAlone').prop('disabled', false).removeClass('input-disable nonborder');
        openTableEdit();
        return;
    }
}

//==============================================================================================
// 全部可編輯/全部不可編輯
//==============================================================================================
function enableAllField() {
    $.each($('div#InformationSection select'), function (index, item) {
        if ($(item).parents('table').attr('id') == "ENPDetailTable") {
            return;
        }
        EnableDOMObject(item);
    })
    $.each($('div#InformationSection input'), function (index, item) {
        if ($(item).parents('table').attr('id') == "ENPDetailTable") {
            return;
        }
        $(item).attr('disabled', false)
        $(item).removeClass('input-disable nonborder')
    })
    $.each($('div#InformationSection .datetimepicker1'), function (index, item) {
        EnableDOMObject(item);
    })
    $.each($('div#InformationSection textarea'), function (index, item) {
        EnableDOMObject(item);
        $(item).addClass('disable-text nonborder')
    })
}
function disableAllField() {
    $.each($('div#InformationSection select'), function (index, item) {
        if ($(item).parents('table').attr('id') == "ENPDetailTable") {
            return;
        }
        DisableDOMObject(item);
    })
    $.each($('div#InformationSection input'), function (index, item) {
        if ($(item).parents('table').attr('id') == "ENPDetailTable") {
            return;
        }
        $(item).attr('disabled', true)
        $(item).addClass('input-disable nonborder')
    })
    $.each($('div#InformationSection .datetimepicker1'), function (index, item) {
        DisableDOMObject(item);
    })
    $.each($('div#InformationSection textarea'), function (index, item) {
        DisableDOMObject(item);
        $(item).addClass('disable-text nonborder')
    })
    $('#VendorOpen').parents('div.content-box').remove();
    $('#ENPDetailRoot').find('div.title').removeClass('m-top10')
    $('#AmortizationButton').remove();
    $('#AmortizationDetailRoot').find('div.title').removeClass('m-top10')
    $('#ExampleDownload').text("分攤明細");
    $('#PrepaymentRoot').find('div.title').removeClass('m-top10')
    $('#SelectPrepayment').remove();
    $('#PrepaymentRoot').find('div.title').removeClass('m-top10')
    $('b.required-icon').remove();
    $('#AccountSelectBtn').remove()

    SwitchHideDisplay(
        [
            $('#MainInformationBlock').find('input[id$="Input"]'),
            $('#MainInformationBlock').find('select[id$="Select"]'),
            $('#VoucherInfomationBlock').find('input[id$="Input"]'),
            $('#VoucherInfomationBlock').find('select[id$="Select"]'),
            $('#PaymentInfomationBlock').find('input[id$="Input"]'),
            $('#PaymentInfomationBlock').find('select[id$="Select"]'),
        ],
        [
            $('#MainInformationBlock').find('div[id$="Disable"]'),
            $('#VoucherInfomationBlock').find('div[id$="Disable"]'),
            $('#PaymentInfomationBlock').find('div[id$="Disable"]'),
        ]
    )

    var $enpDetail = $('#ENPDetailTable').find('tbody')
    $.each($enpDetail, function (index, item) {
        if ($(item).find('#LineNum').val() != "0") {
            SwitchHideDisplay([$(item).find('input[id$="Input"]'), $(item).find('textarea[id$="Input"]'), $(item).find('select[id$="Select"]'), $(item).find('#enpAmortizationDateEditOpen')], [$(item).find('div[id$="Disable"]'), $(item).find('#enpAmortizationDateEditClose')]);
        } else {
        }
    })

    var $amortizationDetail = $('#AmortizationDetailTable');
    if ($('#P_CurrentStep').val() != "3" || location.pathname.toLocaleLowerCase().includes("readonly")) {
        $('#AppendENPDetail').remove();
        $('#AppendAmortizationDetail').remove();
        SwitchHideDisplay([$amortizationDetail.find('input[id$="Input"]'), $amortizationDetail.find('select[id$="Select"]')], [$amortizationDetail.find('div[id$="Disable"]')]);
    }
    var $prepaymentDetail = $('#PrepaymentTable');
    SwitchHideDisplay([$prepaymentDetail.find('input[id$="Input"]'), $prepaymentDetail.find('select[id$="Select"]')], [$prepaymentDetail.find('div[id$="Disable"]')]);

    var $donateTable = $('#DonateTable');
    SwitchHideDisplay([$donateTable.find('[id$="Input"]'), $donateTable.find('select[id$="Select"]')], [$donateTable.find('div[id$="Disable"]')]);
}
//==============================================================================================
//  CheckOut - 會計經辦關卡 / 會計覆核關卡
//==============================================================================================
function coAccountingField() {
    $('#Emergency').prop('disabled', false).removeClass('input-disable nonborder');
    $('#ForeignLabor').prop('disabled', false).removeClass('input-disable nonborder');
    $('#Deduction').prop('disabled', false).removeClass('input-disable nonborder');
    $('[type="text"]#Emergency').prop('disabled', false).removeClass('input-disable nonborder');
    $('[type="text"]#ForeignLabor').prop('disabled', false).removeClass('input-disable nonborder');
    $('[type="text"]#Deduction').prop('disabled', false).removeClass('input-disable nonborder');
    // 待補憑證/預計補憑日期/憑證(發票)號碼/憑證日期/統一編號身分證號/承辦單位預計付款日期/發票逾期說明/跨年度傳票編號/預扣會計項子目(保證金) {原發票號碼/原發票日期}
    $('input[name="Certificate"]').prop('disabled', false).removeClass('input-disable nonborder');
    SwitchHideDisplay(
        [$('#ExpectedDateDisable'), $('#CertificateNumDisable'), $('#EstimateVoucherDateDisable'), $('#ExceptedPaymentDateDisable'), $('#InvoiceOverdueDisable'), $('#YearVoucherDisable'), $('#TaxCategoryDisable')],
        [$('#EDInput'), $('#CertificateNumInput'), $('#CertificateDateInput'), $('#ExceptedPaymentDateInput'), $('#InvoiceOverdueInput'), $('#YearVoucherInput')]
    )
    EnableDOMObject($('#ExpectedDateInput'));
    $('#CertificateNumInput').prop('disabled', false).removeClass('input-disable nonborder');
    EnableDOMObject($('#EstimateVoucherDateInput'));
    EnableDOMObject($('#ExceptedPaymentDate'));
    if ($('#ExceptedPaymentDateInput').val() != "" && $('#ExceptedPaymentDateInput').val() != undefined) {
        $('#ExceptedPaymentDate').data("DateTimePicker").minDate(new Date())
    } else {
        $('#ExceptedPaymentDate').data("DateTimePicker").minDate(new Date()).clear();
    }
    $('#ExceptedPaymentDateTitle').show()
    $('#InvoiceOverdueInput').prop('disabled', false).removeClass('input-disable nonborder');
    $('#YearVoucherInput').prop('disabled', false).removeClass('input-disable nonborder');
    if (accounting.unformat($('#WithHoldingAmountInput').val()) != 0) {
        $('#WithHoldingAccountingAmount').show();
        $('#WithHoldingAccountingAmountSelectBtn').show();
    }

    //請款明細層 - 所扣欄位/傳票摘要/會計項子目/金額(原幣)/稅額(原幣)
    var $enpDetail = $('#ENPDetailTable');
    $.each($enpDetail.find('tbody'), function (index, item) {
        $(item).find('#enpVoucherMemoInput').prop('disabled', false).removeClass('disable-text nonborder').show();
        $(item).find('#enpVoucherMemoDisable').hide();
        $(item).find('input[name$="AmortizationStartDate"]').removeClass('nonborder');
        $(item).find('input[name$="AmortizationEndDate"]').removeClass('nonborder');
    })
    if ($('#ExpenseKindSelect').val() != "NPO_CM_EXP") {
        SwitchHideDisplay([$enpDetail.find('.enpIsIncomeDeductionDisable'), $enpDetail.find('.enpOriginalAmountDisable'), $enpDetail.find('.enpOriginalTaxDisable')],
            [$enpDetail.find('.enpIsIncomeDeductionSelect'), $enpDetail.find('.enpOriginalAmountInput'), $enpDetail.find('.enpOriginalTaxInput')]);
        EnableDOMObject($enpDetail.find('select.enpIsIncomeDeductionSelect'))
    } else {
        SwitchHideDisplay([$enpDetail.find('.enpOriginalAmountDisable'), $enpDetail.find('.enpOriginalTaxDisable')],
            [$enpDetail.find('.enpOriginalAmountInput'), $enpDetail.find('.enpOriginalTaxInput')]);
    }
    EnableDOMObject($enpDetail.find('.enpOriginalAmountInput'))
    $enpDetail.find('.enpOriginalAmountInput').prop('disabled', false).removeClass('input-disable nonborder');
    EnableDOMObject($enpDetail.find('.enpOriginalTaxInput'))
    $enpDetail.find('.enpOriginalTaxInput').prop('disabled', false).removeClass('input-disable nonborder');
    SwitchHideDisplay([$enpDetail.find('#enpAmortizationDateEditClose')], [$enpDetail.find('.enpAmortizationStartDateInput'), $enpDetail.find('.enpAmortizationEndDateInput'), $enpDetail.find('#enpAmortizationDateEditOpen')])
    EnableDOMObject($enpDetail.find('.enpAmortizationStartDateInput'))
    EnableDOMObject($enpDetail.find('.enpAmortizationEndDateInput'))

    //分攤明細層 - 全開
    var amortizationDetail = $('#AmortizationDetailTable');
    $.each(amortizationDetail.find('tbody'), function (index, item) {
        $(item).find('input').prop('disabled', false).removeClass('input-disable nonborder');
        EnableDOMObject($(item).find('select'));
    });

    //所得稅申報層 -
    var $incomeTaxDetail = $('#IncomeTaxTable');
    $incomeTaxDetail.find('tbody#accounting-stage-field').show();
    SwitchHideDisplay([$incomeTaxDetail.find('div[id$="Disable"]')], [$incomeTaxDetail.find('input[id$="Input"]'), $incomeTaxDetail.find('select[id$="Select"]')]);

    if ($('#IncomeCodeCode').val() != "53" && $('#P_CurrentStep').val() == "3") {
        $('#LeaseTaxCodeDisable').text("");
        $('#LeaseTaxCodeSelect').val("").selectpicker('refresh');
        SwitchHideDisplay([$('#LeaseTaxCodeSelect')], [$('#LeaseTaxCodeDisable')])
    } else {
        SwitchHideDisplay([$('#LeaseTaxCodeDisable')], [$('#LeaseTaxCodeSelect')])
    }

    //二代健保註記disabled
    SwitchHideDisplay([$incomeTaxDetail.find('input[id="TwoHeathInsuranceFlagInput"]')], [$incomeTaxDetail.find('div[id="TwoHeathInsuranceFlagDisable"]')]);
    $incomeTaxDetail.find('input[id$="Input"]').prop('disabled', false).removeClass('input-disable nonborder');
    $incomeTaxDetail.find('div.bs-searchbox input').prop('disabled', false).removeClass('input-disable nonborder')
    EnableDOMObject($incomeTaxDetail.find('select'));

    var $donateDetail = $('#DonateTable');
    SwitchHideDisplay([$donateDetail.find('div[id$="Disable"]')], [$donateDetail.find('input[id$="Input"]'), $donateDetail.find('select[id$="Select"]')]);
    $donateDetail.find('input[id$="Input"]').prop('disabled', false).removeClass('input-disable nonborder');
    $donateDetail.find('div.bs-searchbox input').prop('disabled', false).removeClass('input-disable nonborder')
    $donateDetail.find('#dnReceiptDateInput').show();
    EnableDOMObject($donateDetail.find('select'));
    EnableDOMObject($donateDetail.find('#dnReceiptDateInput'));
    //營業稅申報層
    var gvdeclaration = $('#VoucherBeauSelect').find('option:selected').attr('gvdeclaration');
    $('#BusinessTaxInformation').show();
    $('#gvdeclaration').val(gvdeclaration)
    if (gvdeclaration === "404") {
        return;
    }
    // source ENPLogic
    if (!_initialControlexe) {
        BusinessTax();
    }
    var $businessTaxDetail = $('#BusinessTaxTable');
    $('#BusinessTaxTable').show();
    $('#undone-BusinessTax').hide();
    $businessTaxDetail.find('input[id$="Input"]').prop('disabled', false).removeClass('input-disable nonborder');
    $businessTaxDetail.find('div.bs-searchbox input').prop('disabled', false).removeClass('input-disable nonborder')
    SwitchHideDisplay([$businessTaxDetail.find('#BusinessNumDisable')], [$businessTaxDetail.find('#BusinessNumInput')])
    EnableDOMObject($businessTaxDetail.find('select'));
}
function roAccountingReview() {
    $('.EmergencyLabel').show()
    if ($('input:checkbox#Deduction').prop('checked')) {
        $('#BusinessTaxInformation').show();
    }

    var $amortizationDetail = $('#AmortizationDetailTable');
    SwitchHideDisplay([$amortizationDetail.find('input[id$="Input"]'), $amortizationDetail.find('select[id$="Select"]')], [$amortizationDetail.find('div[id$="Disable"]')]);

    //所得稅申報層
    var $incomeTaxDetail = $('#IncomeTaxTable');
    SwitchHideDisplay([$incomeTaxDetail.find('input[id$="Input"]'), $incomeTaxDetail.find('select[id$="Select"]')], [$incomeTaxDetail.find('div[id$="Disable"]')]);
    $incomeTaxDetail.find('tbody#accounting-stage-field').show();

    var gvdeclaration = $('#VoucherBeauSelect').find('option:selected').attr('gvdeclaration');
    $('#gvdeclaration').val(gvdeclaration)
    $('#BusinessTaxInformation').show();
    if (gvdeclaration === "404") {
        return;
    }
    SwitchHideDisplay([$('#undone-BusinessTax')], [$('#BusinessTaxInformation'), $('#BusinessTaxTable')])
    if (!_initialControlexe) {
        BusinessTax();
    }
    SwitchHideDisplay([$('#BusinessTaxTable').find('input[id$="Input"]'), $('#BusinessTaxTable').find('select')], [$('#BusinessTaxTable').find('div[id$="Disable"]')]);
}
//==============================================================================================
// 表格開啟刪除/新增
//==============================================================================================
function openTableEdit(e) {
    if (e == "amo") {
        $(document).on({
            mouseenter: function () {
                $(this).find('#DeleteThisAmortizationDetail').show();
            },
            mouseleave: function () {
                $(this).find('#DeleteThisAmortizationDetail').hide();
            },
        }, "#AmortizationDetailTable tbody")
        return;
    }
    if (e == "enpd") {
        $(document).on({
            mouseenter: function () {
                $(this).find('#DeleteThisENPDetail').show();
            },
            mouseleave: function () {
                $(this).find('#DeleteThisENPDetail').hide();
            }
        }, "#ENPDetailTable tbody")
        return;
    }
    $(document).on({
        mouseenter: function () {
            $(this).find('#DeleteThisENPDetail').show();
        },
        mouseleave: function () {
            $(this).find('#DeleteThisENPDetail').hide();
        }
    }, "#ENPDetailTable tbody")

    $(document).on({
        mouseenter: function () {
            $(this).find('#DeleteThisAmortizationDetail').show();
        },
        mouseleave: function () {
            $(this).find('#DeleteThisAmortizationDetail').hide();
        },
    }, "#AmortizationDetailTable tbody")
}