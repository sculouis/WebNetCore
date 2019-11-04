var _initialControlexe = false;

function initialControl() {
    var url = location.pathname;
    var stage = parseInt($('#P_CurrentStep').val())

    if (!$('#ApplicantDepId').val().includes("0113")) {
        $('.CreditCardOpen').remove()
    }
    if (url.toLocaleLowerCase().includes("readonly") || $('#P_Status').val() == "4") {
        switch (stage) {
            case 1:
                var $incomeTaxDetail = $('#IncomeTaxTable');
                disableAllField()
                $('.fieldcon-prodetail').parents('td').find('span').removeClass('col-sm-11')
                $('.fieldcon-prodetail').remove()
                $('.fieldcon-AccountingItem').remove();
                var $incomeTaxDetailAccounting = $('#IncomeTaxTable').find('tbody#accounting-stage-field')
                $('#WithHoldingAccountingAmountSelectBtn').hide();
                $('#IDNo').addClass('col-sm-3').removeClass('col-sm-2');
                $incomeTaxDetailAccounting.show();
                $('#ESPSerno').attr('rowspan', 5)

                SwitchHideDisplay([$incomeTaxDetail.find('input[id$="Input"]'), $incomeTaxDetail.find('select[id$="Select"]')], [$incomeTaxDetail.find('div[id$="Disable"]')]);
                break;
            case 2:
                accountingReviewer()
                break;
            case 3:
                accountingReviewer()
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
        if ($('#P_Status').val() == "2") {
            $('#sendButton').append('<a class="function-btn" onclick="location.href=\'/ESP/Create/' + $('input[name="FormID"]').val() + '\'">複製</a>')
        }
        return;
    }
    if (url.toLocaleLowerCase().includes("checkout")) {
        switch (stage) {
            case 1:
                var $incomeTaxDetailAccounting = $('#IncomeTaxTable').find('tbody#accounting-stage-field')
                openTableEdit()
                $('#ESPSerno').attr('rowspan', 5)
                LeaseTaxCodeEdit()

                $incomeTaxDetailAccounting.show();
                SwitchHideDisplay([$incomeTaxDetailAccounting.find('div[id$="Disable"]')], [$incomeTaxDetailAccounting.find('input[id$="Input"]'), $incomeTaxDetailAccounting.find('select[id$="Select"]')]);
                SwitchHideDisplay([$incomeTaxDetailAccounting.find('#TwoHeathInsuranceFlagInput')], [$incomeTaxDetailAccounting.find('#TwoHeathInsuranceFlagDisable')])
                break;
            case 2:
                accountingReviewer()
                break;
            case 3:
                accountingReviewer()
                break;
            default:
                break;
        }
        _initialControlexe = true
        return;
    }
    if (url.toLocaleLowerCase().includes("create") || url.toLocaleLowerCase().includes("edit")) {
        var $incomeTaxDetailAccounting = $('#IncomeTaxTable').find('tbody#accounting-stage-field')
        $incomeTaxDetailAccounting.show();

        SwitchHideDisplay([$incomeTaxDetailAccounting.find('div[id$="Disable"]')], [$incomeTaxDetailAccounting.find('input[id$="Input"]'), $incomeTaxDetailAccounting.find('select[id$="Select"]')]);
        SwitchHideDisplay([$incomeTaxDetailAccounting.find('#TwoHeathInsuranceFlagInput')], [$incomeTaxDetailAccounting.find('#TwoHeathInsuranceFlagDisable')])
        LeaseTaxCodeEdit()

        $('#ESPSerno').attr('rowspan', 5)
        openTableEdit();
        return;
    }
}

//==============================================================================================
// 全部可編輯/全部不可編輯/會計覆核及fiis狀態
//==============================================================================================
function enableAllField() {
    $.each($('div#InformationSection select'), function (index, item) {
        EnableDOMObject(item);
    })
    $.each($('div#InformationSection input'), function (index, item) {
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
        DisableDOMObject(item);
    })
    $.each($('div#InformationSection input'), function (index, item) {
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
    $('#ESPDetailRoot').find('div.title').removeClass('m-top10')
    $('#AppendESPDetail').remove();
    $('#AmortizationDetailRoot').find('div.title').removeClass('m-top10')
    $('#AppendAmortizationDetail').remove();
    $('#AmortizationButton').remove()
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

    var $espDetail = $('#ESPDetailTable');
    SwitchHideDisplay([$espDetail.find('input[id$="Input"]'), $espDetail.find('textarea[id$="Input"]'), $espDetail.find('select[id$="Select"]'), $espDetail.find('#espAmortizationDateEditOpen')], [$espDetail.find('div[id$="Disable"]'), $espDetail.find('#espAmortizationDateEditClose')]);

    var $amortizationDetail = $('#AmortizationDetailTable');
    SwitchHideDisplay([$amortizationDetail.find('input[id$="Input"]'), $amortizationDetail.find('textarea[id$="Input"]'), $amortizationDetail.find('select[id$="Select"]')], [$amortizationDetail.find('div[id$="Disable"]')]);

    var $prepaymentDetail = $('#PrepaymentTable');
    SwitchHideDisplay([$prepaymentDetail.find('input[id$="Input"]'), $prepaymentDetail.find('select[id$="Select"]')], [$prepaymentDetail.find('div[id$="Disable"]')]);

    var $donateTable = $('#DonateTable');
    SwitchHideDisplay([$donateTable.find('[id$="Input"]'), $donateTable.find('select[id$="Select"]')], [$donateTable.find('div[id$="Disable"]')]);

    var gvdeclaration = $('#VoucherBeauSelect').find('option:selected').attr('gvdeclaration');
    if (gvdeclaration === "404") {
        return;
    }
    SwitchHideDisplay([$('#BusinessTaxTable').find('input[id$="Input"]'), $('#BusinessTaxTable').find('select')], [$('#BusinessTaxTable').find('div[id$="Disable"]')]);
}
function accountingReviewer() {
    var $incomeTaxDetail = $('#IncomeTaxTable');
    var $incomeTaxDetailAccounting = $('#IncomeTaxTable').find('tbody#accounting-stage-field')

    $('.fieldcon-prodetail').parents('td').find('span').removeClass('col-sm-11')
    $('.fieldcon-prodetail').remove()
    $('.fieldcon-AccountingItem').remove();
    disableAllField()

    $('#WithHoldingAccountingAmountSelectBtn').hide();
    $('#IDNo').addClass('col-sm-3').removeClass('col-sm-2');
    $incomeTaxDetailAccounting.show();

    $('#ESPSerno').attr('rowspan', 5)
    SwitchHideDisplay([$incomeTaxDetail.find('input[id$="Input"]'), $incomeTaxDetail.find('select[id$="Select"]')], [$incomeTaxDetail.find('div[id$="Disable"]')]);
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
    if (e == "espd") {
        $(document).on({
            mouseenter: function () {
                $(this).find('#DeleteThisESPDetail').show();
            },
            mouseleave: function () {
                $(this).find('#DeleteThisESPDetail').hide();
            }
        }, "#ESPDetailTable tbody")
        return;
    }
    $(document).on({
        mouseenter: function () {
            $(this).find('#DeleteThisESPDetail').show();
        },
        mouseleave: function () {
            $(this).find('#DeleteThisESPDetail').hide();
        }
    }, "#ESPDetailTable tbody")

    $(document).on({
        mouseenter: function () {
            $(this).find('#DeleteThisAmortizationDetail').show();
        },
        mouseleave: function () {
            $(this).find('#DeleteThisAmortizationDetail').hide();
        },
    }, "#AmortizationDetailTable tbody")
}