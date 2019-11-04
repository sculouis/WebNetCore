var _currencyTypeChanged = true;
var _effectiveDate = '';
var _donateInfoSection = $.extend(true, {}, $('#DonateTable'));
var _firstSelectPleaseType = true;
var _isIncomeTaxGenerate = false;
var _moneyNegative = false;
var _amortizationTemplate;
var _pleaseType;
var _tempFlag = false;
var _foriegnPayMethod = false;
var _paymentCateCollection;
//分攤明細層是否使用匯入方法匯入
var _amImport = false;
//會計經辦關卡時，修改請款明細及分攤明細，重算憑證總額控制
var _businessTaxReCal = false;
//是否為第一次選擇憑證開立對象，若是的話會將分攤明細的帳務行重置
var _firstVoucherBeau = true;
//所得代碼的格式，用以判斷下方何為必填
var _wtTaxFormat = [];
//整張表單的發票可不可扣抵邏輯
//可扣抵:使用銷售額，不可扣抵:使用原金額
//憑證開立對象對應的帳務行稅額申報方式:404不可扣抵 in EXCG055_2
//403檢核明細層
//判定費用項目貼標是否為不可扣抵 in DB
//判定分攤層成本與利潤中心對應的帳務行是否為404 in EXCG055_2
//成本利潤中心是否貼標為不可扣抵 in _coaCompanyAndDepartmentCollection
// 2018-05-21邏輯更新
// 判定請款明細大中項之貼標
// 分攤明細帳務行之貼標
var _invoiceCanBeDeductible = true;
// 營業稅申報層最高判定別 0:不判定,1:可扣抵,2:不可扣抵
var _invoiceCanBeDeductibleTopAuth = 0;
//供應商查詢結果檢視
var vendorOutput;

$(window).on('load.bs.select.data-api', function () {
    $.when(loadingFiisData("enp")).done(function () {
        console.time("totalTime")
        _amortizationTemplate = AmortizationTemplateDropSet($('#AmortizationDetailCloneTemplate'))
        //==========================================
        // 針對請款類別載入設定
        //==========================================
        if ($('#ExpenseKindSelect').val() != "" && $('#ExpenseKindSelect').val() != undefined) {
            _tempFlag = true;
            initPleaseTypeSet();
        }
        if (_certificateKind != "" && _certificateKind != undefined) {
            $('#CertificateKindSelect').val(_certificateKind);
            $('#CertificateKindSelect').selectpicker('refresh').trigger('change');
        }
        if (_currencyData != "TWD" && _currencyData != "") {
            _currencyTypeChanged = false;
            ForeignCurrency()
            if ($('input[type="text"]#Emergency').val() == "False") {
                $('#Emergency').prop('checked', false)
            }
        }
        else {
            _currencyTypeChanged = false;
            nForeignCurrency()
        }

        if ($('input[name="Books"]').val() != '' && $('input[name="Books"]').val() != undefined) {
            _firstVoucherBeau = false;
        }
        if ($('#WithHoldingAccountingAmountCode').val() != undefined && $('#WithHoldingAccountingAmountCode').val() != '') {
            $('#WithHoldingAccountingAmountDisable').text($('#WithHoldingAccountingAmountCode').val() + ' - ' + CodeGetOptionText('enpAccountingItem', $('#WithHoldingAccountingAmountCode').val()))
        }
        //==========================================
        // 針對供應商載入設定
        //==========================================
        if ($('#VendorNumInput').val() != "" && $('#VendorNumInput').val() != undefined) {
            $('#undone-GenerateIncomeTax').text("此供應商及付款資訊不需產生所扣資料")
            //==========================================
            // 供應商銀行帳號
            //==========================================
            optionInput.supplierNumber = $('#VendorNumInput').val();
            $.when(resultOutput()).always(function () { PaymentAccount(_vendor[0].supplierBank) });
            //==========================================
            // 供應商所扣
            //==========================================
            $('#Deduction').trigger('change');
            if ($('#undone-vendorSelect').text() != "無資料") {
                $('#undone-vendorSelect').text("請點選上方【選擇預付單】");
            }
            if ($('div#SelectPrepayment').length < 1) {
                $('div#PrepaymentRoot div.title').prepend('<div class="area-btn-right" id="SelectPrepayment"><a class="btn-02-blue btn-text4">選擇預付單</a></div>')
            }
            SwitchHideDisplay([], [$('#PaymentInfomationBlock')])
            $('#PaymentMethodSelect').val(_paymentMethod);
            $('#PaymentMethodSelect').selectpicker('refresh');
            $('#RemittanceSelect').selectpicker('refresh');
            //==========================================
            // 付款方式判定
            //==========================================
            if ($('#PaymentMethodSelect').val() == 'WIRE') {
                if ($('#VendorKind').val() != "ONE TIME") {
                    generalWire()
                    if ($('#paymentReasonCode').val() == null || $('#paymentReasonCode').val() == "") {
                        SwitchHideDisplay([$('#RemittanceDisable')], [$('#RemittanceSelect')]);
                        EnableDOMObject($('#RemittanceSelect'));
                    } else {
                        $('#RemittanceSelect').selectpicker('refresh').selectpicker('hide');
                        $('#RemittanceDisable').show()
                    }
                    if ($('#BankInput').val() != "" && $('#BankInput').val() != undefined) {
                        $('#BankSelect').val($('#BankInput').val());
                        $('#BankSelect').selectpicker('refresh');
                    }
                    if ($('#BranchInput').val() != "" && $('#BranchInput').val() != undefined) {
                        $('#BranchSelect').val($('#BranchInput').val())
                        $('#BranchSelect').selectpicker('refresh');
                    }
                }
                else {
                    onceTimeWire()
                }
            }
            else {
                nonWire()
            }
            if ($('#RemittanceTempInput').val() != "" && $('#RemittanceTempInput').val() != undefined) {
                $('#RemittanceSelect').val($('#RemittanceTempInput').val());
                $('#RemittanceSelect').selectpicker('refresh')
            }
        }
        ////==========================================
        //// 針對請款明細層、分攤明細層、預付款充銷進行資料的載入
        ////==========================================
        var enpDetail = _enpDetail;
        if (enpDetail.length > 0) {
            $('#ENPDetailTable tbody').remove();
            $.each(enpDetail, function (index, item) {
                ENPDetailDataAppend(item);
            });
            _firstSelectPleaseType = false;
        }
        var amortizationDetail = _amortizationDetail;
        if (amortizationDetail.length > 0) {
            CreateAmortizationDetail();
            $('#AmortizationDetailTable tbody').remove();
            console.time("amortization Loading")
            $.each(amortizationDetail, function (index, item) {
                AmortizationDetailDataAppend(item)
            });
            console.timeEnd("amortization Loading")
        }
        var prepaymentDetail = _prepaymentDetail;
        if ($('#P_CurrentStep').val() != "1") {
            $('#undone-vendorSelect').text("無資料");
        }
        if (prepaymentDetail.length > 0) {
            CreatePrepaymentTable();
            $.each(prepaymentDetail, function (index, item) {
                PrepaymentDetailAppend(item);
            })
        }
        var incomeTax = _incomeDetail
        if (incomeTax != null && incomeTax.IncomeID != 0) {
            IncomeTaxDataLoading(incomeTax);
        }
        var donateInfo = _donateDetail
        if (donateInfo != null) {
            DonateDataLoading(donateInfo);
        }
        if ($('#InformationZone').length < 1) {
            $('#MainForm').append('<div id="#InformationZone"></div>');
        }
        judgeInvoiceDeductible(false);
        //==========================================
        // 欄位事件綁定
        //==========================================
        $(document).on({ change: MoneyHasBeenChanged }, '.moneyfield')
        $(document).on({ change: CertificateAndTax }, '.taxfield')
        $(document).on('change', '#BankSelect', function () {
            var $selectedOption = $(this).find('option:selected');
            var bankName = $selectedOption.attr('bankName');
            var bankNumber = $selectedOption.val();
            var branchdefault = ""
            $('#BankInput').val(bankNumber);
            $('#BankNameInput').val(bankName);
            $('#BranchSelect').find('option').remove();
            $.ajax({
                async: false,
                type: 'GET',
                dataType: 'json',
                url: '/ENP/GetBranchList?enpNum=' + $('#P_SignID').val() + '&bankNumber=' + bankNumber,
                success: function (data) {
                    $.each(data, function (index, item) {
                        $('#BranchSelect').append('<option value="' + item.branchNumber + '" branchName="' + item.branchName + '">' + item.branchNumber + ' - ' + item.branchName + '</option>')
                    })
                },
                error: function (data) {
                    FiisFatalFail()
                }
            })
            $('#BranchSelect').selectpicker('refresh')
            EnableDOMObject($('#BranchSelect'));
        })
        $(document).on('change', '#BranchSelect', function () {
            var $selectedOption = $(this).find('option:selected');
            var branchName = $selectedOption.attr('branchName');
            var branchNumber = $selectedOption.val();
            $('#BranchInput').val(branchNumber);
            $('#BranchNameInput').val(branchName);
        })
        $(document).on({
            focus: AccountUnFormat,
            change: AccountFormat,
            focusout: AccountFormat
        }, '.accountingfield');
        $(document).on({
            focus: RecordPreviousVal,
            change: MoneyChange
        }, '.businessTaxMoney');
        $(document).on('change', 'select.AmortizationDetailAccountBankSelect', function () {
            var detailIndex = 'input[name="' + $(this).attr('name').split('.')[0] + '.AccountBankName"]';
            if (typeof (Array.prototype.find) == "function") {
                var selectAccount = $(this).val()
                $('#AmortizationDetailTable').find(detailIndex).val(_coaCompany.find(function (element) {
                    return element.company == selectAccount
                }).description)
            }
        })
        $(document).on('change', 'select.AmortizationDetailCostProfitCenterSelect', function () {
            var detailIndex = 'input[name="' + $(this).attr('name').split('.')[0] + '.CostProfitCenterName"]';
            if (typeof (Array.prototype.find) == "function") {
                var selectCostProfit = $(this).val()
                $('#AmortizationDetailTable').find(detailIndex).val(_coaCompanyAndDepartmentCollection.find(function (element) { return element.department == selectCostProfit }).description)
            }
        })
        $(document).on('change', 'select.AmortizationDetailProductKindSelect', function () {
            var detailIndex = 'input[name="' + $(this).attr('name').split('.')[0] + '.ProductKindName"]';
            if (typeof (Array.prototype.find) == "function") {
                var selectProductKind = $(this).val()
                $('#AmortizationDetailTable').find(detailIndex).val(_coaDepartmentProduct.find(function (element) { return element.product == selectProductKind }).description)
            }
        })
        $(document).on('change', 'select.amortizationDetailExpenseAttributeSelect', function () {
            $(this).parents('tr').find('AmortizationDetailExpenseAttributeNameInput').val($(this).find('option:selected').text())
        })

        //==========================================
        // 每次改動表單欄位判斷可不可扣抵
        //==========================================
        $(document).on('change', 'select.AmortizationDetailCostProfitCenterSelect', judgeInvoiceDeductible);
        $(document).on('change', 'select.AmortizationDetailAccountBankSelect', judgeInvoiceDeductible);
        $(document).on('change', '#VoucherBeauSelect', judgeInvoiceDeductible);
        $(document).on('change', 'select.enpExpenseAttributeSelect', judgeInvoiceDeductible);
        $(document).on('change', ':checkbox', checkboxBinding);
        $(document).on({ change: IsDeductionHighAuthChange }, '#BTIsDeductionSelect')
        $(document).on('change', '#Aupload', function () {
            AmortizationUpload(this);
            //IE11 bug: Reset input file by script will trigger its change function, cause multiple alert.
            var explorerDetect = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent)
            //將檔案放入FormData後初始化input file,需判斷是否為IE11,IE11重製會造成trigger
            if (explorerDetect != undefined && parseFloat(explorerDetect[1]) == 11.0) {
            } else {
                this.value = "";
            }
        })
        //==========================================
        // 每次改動明細所扣欄位重新計算所扣金額
        //==========================================
        $(document).on('change', '#ENPDetailTable tbody #enpIsIncomeDeductionSelect', IncomeTaxCal);
        $(document).on('change', '#ENPDetailTable tbody #enpOriginalAmountInput', IncomeTaxCal);
        $(document).on('change', '#ENPDetailTable tbody #enpOriginalTaxInput', IncomeTaxCal);
        $(document).on('change', '#IsTwoHealthInsuranceSelect', IncomeTaxCal);
        $(document).on('change', '#CertficateKindSelect', IncomeTaxCal);
        $(document).on('change', '#IncomeCodeCode', IncomeTaxCal);
        $(document).on('change', '#IncomeCodeCode', IncomeCodeFormat);

        if ($('#BankInput').val() != "" && $('#BankSelect').css('display') == "block") {
            $('#BankSelect').val($('#BankInput').val()).trigger('change')
        }
        if ($('#BranchInput').val() != "" && $('#BranchSelect').css('display') == "block") {
            $('#BranchSelect').val($('#BranchInput').val())
            $('#BranchSelect').selectpicker('refresh');
        }
        InputTransDisable();
        IncomeTaxCal();
        calculatePaymentAmount()
        AccountFormat();

        initialControl()
        $.when(_sendSettingDeferred).done(function () {
            if ($('#P_CurrentStep').val() == "1" && $('#P_JBPMUID').val() == "" && $('#FillInDepName').val().includes("0113")) {
                updateCustomFlowKey("ENP_P1_Credit");
                _stageInfo.CustomFlowKey = "ENP_P1_Credit";
                _stageInfo.NextCustomFlowKey = "ENP_P1_Credit"
                $('#P_CustomFlowKey').val("ENP_P1_Credit");
            }
        })
        console.timeEnd("totalTime")
    }).always(function () {
        blockPage("")
    })
});

$(function () {
    DisableDOMObject($('#ExpectedDateInput'));
    DisableDOMObject($('#BranchSelect'));
    DisableDOMObject($('#CertificateKindSelect'));
    DisableDOMObject($('#EstimateVoucherDateInput'));
    DisableDOMObject($('#ExportApplyAttributeSelect'));
    $(document).on('dp.change', '#EstimateVoucherDateInput', EstimateVoucherDateChange);
    //====================================================================================
    // 請款類別設定/修改所扣欄位/修改購買國外勞務欄位/修改統編欄位/修改憑證號碼欄/更改憑證日期欄/計算付款金額
    //====================================================================================
    $(document).on('change', '#ExpenseKindSelect', function () {
        if (_firstSelectPleaseType) {
            _tempFlag = false;
            initPleaseTypeSet();
            _firstSelectPleaseType = false;
            CreateENPDetail();
            CreateAmortizationDetail();
            return;
        }
        confirmopen('修改此欄位會將所有資料清空，是否確認修改', initPleaseTypeSet, function () {
            $('#ExpenseKindSelect option[value="' + _pleaseType + '"]').prop('selected', true);
            $('#ExpenseKindSelect').selectpicker('refresh');
        });
    });
    $(document).on('change', '#Deduction', function () {
        if ($('#ExpenseKindSelect').val() == "NPO_CM_EXP") {
            return;
        }
        if ($('#CertificateKindSelect').val() == "I" && $(this).prop('checked')) {
            alertopen("憑證類別為【發票】不得修改所扣")
            $(this).prop('checked', false);
            return;
        }
        $('#IncomeTaxTable input[id$="Input"]').val("");
        $('#IncomeTaxTable select[id$="Select"]').val("");
        $('#IncomeTaxTable div[id$="Disable"]').text("");
        if ($(this).prop('checked')) {
            $('.enpIsIncomeDeductionDisable').text("Y")
            $('.enpIsIncomeDeductionSelect').val("true");
            $('#ENPDetailTable .enpIsIncomeDeductionSelect').selectpicker('refresh');

            SwitchHideDisplay([$('#undone-GenerateIncomeTax')], [$('#IncomeTaxTable')])
            var $IncomeTable = $('#IncomeTaxInformation');
            SwitchHideDisplay([$IncomeTable.find('div[id$="Disable"]')], [$IncomeTable.find('input[id$="Input"]'), $IncomeTable.find('select[id$="Select"]')])

            if ($('#VendorKind').val() == "ONE TIME") {
                $IncomeTable.find('select[id$="Select"]').selectpicker()
                $IncomeTable.find('div#TwoHeathInsuranceFlagDisable').text($('#twoNhiFlag').val())
                $IncomeTable.find('input#TwoHeathInsuranceFlagInput').val($('#twoNhiFlag').val());
            } else {
                $IncomeTable.find('div#IncomeNumDisable').text($('#IDNoInput').val())
                $IncomeTable.find('input#IncomeNumInput').val($('#IDNoInput').val());

                $IncomeTable.find('div#IncomePersonDisable').text($('#VendorNameInput').val())
                $IncomeTable.find('input#IncomePersonInput').val($('#VendorNameInput').val());

                $IncomeTable.find('select#CertficateKindSelect').val($('#identityFlag').val());
                $IncomeTable.find('select#CertficateKindSelect').selectpicker('refresh')
                $IncomeTable.find('div#CertficateKindDisable').text($IncomeTable.find('select#CertficateKindSelect option:selected').text())

                if ($('#taxCode').val() != "" || $('#taxCode').val() != undefined) {
                    $IncomeTable.find('#IncomeCodeCode').val($('#taxCode').val());
                    $IncomeTable.find('#IncomeCodeDisable').text($('#taxCode').val() + ' - ' + CodeGetOptionText('IncomeCode', $('#taxCode').val()))
                } else {
                    $IncomeTable.find('#IncomeCodeCode').val("");
                    $IncomeTable.find('#IncomeCodeDisable').text("")
                }

                if ($('#identityFlag').val() == "" || $('#identityFlag').val() == undefined) {
                    $IncomeTable.find('div#CertficateKindDisable').text("")
                } else {
                    $IncomeTable.find('div#CertficateKindDisable').text($IncomeTable.find('select#CertficateKindSelect option:selected').text())
                }

                SwitchHideDisplay(
                    [$IncomeTable.find('#IsTwoHealthInsuranceDisable'), $IncomeTable.find('#LeaseTaxDisable'), $IncomeTable.find('#LeaseAddressDisable')]
                    , [$IncomeTable.find('#IsTwoHealthInsuranceSelect'), $IncomeTable.find('#LeaseTaxInput'), $IncomeTable.find('#LeaseAddressInput')]
                )
                $IncomeTable.find('#IsTwoHealthInsuranceSelect').selectpicker()

                $IncomeTable.find('div#TwoHeathInsuranceFlagDisable').text($('#twoNhiFlag').val())
                $IncomeTable.find('input#TwoHeathInsuranceFlagInput').val($('#twoNhiFlag').val());

                $IncomeTable.find('div#PermanentPostNumDisable').text($('#PermeanentPostNum').val())
                $IncomeTable.find('input#PermanentPostNumInput').val($('#PermeanentPostNum').val());

                $IncomeTable.find('div#PermanentAddressDisable').text($('#PermanentAddress').val())
                $IncomeTable.find('input#PermanentAddressInput').val($('#PermanentAddress').val());

                $IncomeTable.find('div#ContactPostNumDisable').text($('#ContactPostNum').val())
                $IncomeTable.find('input#ContactPostNumInput').val($('#ContactPostNum').val());

                $IncomeTable.find('div#ContactAddressDisable').text($('#ContactAddress').val())
                $IncomeTable.find('input#ContactAddressInput').val($('#ContactAddress').val());
                IncomeTaxCal()
            }
        } else {
            $('.enpIsIncomeDeductionDisable').text("N")
            $('.enpIsIncomeDeductionSelect').val("false");
            $('#ENPDetailTable .enpIsIncomeDeductionSelect').selectpicker('refresh');
            SwitchHideDisplay([$('#IncomeTaxTable')], [$('#undone-GenerateIncomeTax')])
        }
    });
    $(document).on('change', '#ForeignLabor', function () {
        if ($('select[name="Currency"]').val() == "TWD" || $('select[name="CertificateKind"]').val() == "I") {
            alertopen("請注意若幣別為台幣或憑證類別為發票，此選項不得勾選。")
            $(this).attr("checked", false)
            $('input[name="ForeignLabor"]').val(false);
        }
    })
    $(document).on('change', '#IDNoInput', function () {
        var idNo = $(this).val();
        $('#BusinessNumDisable').text(idNo);
        $('#BusinessNumInput').val(idNo);
        $('#IncomeNumDisable').text(idNo);
        $('#IncomeNumInput').val(idNo);
    })
    $(document).on('change', '#CertificateNumInput', function () {
        var CertificateNum = $(this).val();
        $('#BTCertificateNumDisable').text(CertificateNum);
        $('#BTCertificateNumInput').val(CertificateNum);
    })
    $(document).on('dp.change', $('#EstimateVoucherDateInput'), function () {
        var CertificateDate = $('#CertificateDateInput').val();
        $('#BTCertificateDateDisable').text(CertificateDate)
        $('#BTCertificateDateInput').val(CertificateDate)
    })
    $(document).on('change', '.PaymentAmountCalculate', calculatePaymentAmount)
    //==========================================
    // 幣別選擇/匯率更動檢核
    //==========================================
    $(document).on('change', '#CurrencySelect', function () {
        $('.moneyfield').val(0).text(0);
        switch ($(this).val()) {
            case "TWD":
                $('#CurrencyPrecisionDisable').text("0");
                $('input[name="CurrencyPrecise"]').val(0);
                $('#RateDisable').text("1");
                $('#RateInput').val(1);
                //購買國外勞務清空
                $('input#ForeignLabor').attr("checked", false)
                $('input[name="ForeignLabor"]').val(false);
                nForeignCurrency();
                break;
            default:
                $('#RateInput').val("");
                $.ajax({
                    async: false,
                    type: 'GET',
                    dataType: 'json',
                    url: '/ENP/GetCurrency?enpNum=' + $('#P_SignID').val() + '&currencyCode=' + $(this).val(),
                    success: function (data) {
                        $.each(data, function (index, item) {
                            if (index > 0) {
                                console.log("取回指定幣別數量>0，請檢查FIIS API");
                                return;
                            }
                            $('#CurrencyPrecisionDisable').text(item.extendedPrecision);
                            $('input[name="CurrencyPrecise"]').val(item.extendedPrecision);
                        })
                    },
                    error: function (data) {
                    }
                });
                ForeignCurrency();
                break;
        }
        $('#CurrencyNameInput').val($('#CurrencySelect option:selected').text())
    });
    $('#RateInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange).on('change', function () {
        var exchangeRate = $(this).val();
        if (exchangeRate <= 0) {
            alertopen("匯率不得小於零或等於零");
            $(this).val(_previousAmount);
            return;
        }
        if ($(this).val().split('.')[1] != undefined) {
            if ($(this).val().split('.')[1].length > $('#CurrencyPrecisionDisable').text()) {
                alertopen('輸入值不符合幣別精確度');
                $(this).val(_previousAmount);
                return;
            }
        }
    });
    //==========================================
    // 選擇憑證開立對象/憑證類別選擇/檢核預計補憑日期
    //==========================================
    $('#VoucherBeauSelect').on('change', function () {
        var $voucher = $(this).find('option:selected')
        $('#AccountBankDisable').text($voucher.attr('accountCode'));
        $('input[name="Books"]').val($voucher.attr('accountCode'));
        $('input[name="BooksName"]').val($voucher.attr('accountName'));
        $('input[name="VoucherBeauName"]').val($voucher.text())
        if (_firstVoucherBeau) {
            $('#AmortizationDetailTable').find('select.AmortizationDetailAccountBankSelect').val($voucher.attr('accountCode'))
            try {
                if (typeof (Array.prototype.find) == "function") {
                    $('#AmortizationDetailTable').find('.AmortizationDetailAccountBankNameInput').val(_coaCompany.find(function (element) {
                        return element.company == $voucher.attr('accountCode')
                    }).description)
                }
            } catch (e) {
                console.log("無相對應之分攤帳務行");
            }
            _firstVoucherBeau = false;
        }
    })
    $(document).on('change', '#CertificateKindSelect', CertificateKindChange);
    $(document).on('change', 'input[name="Certificate"]', function () {
        if ($(this).val() == "true") {
            $('#ExpectedDate').show(200)
            EnableDOMObject($('#ExpectedDateInput'));
            $('#ExpectedDateInput').data("DateTimePicker").minDate(new Date());
            AppendRequired($('#ExpectedDateTitle'))
        } else {
            $('#ExpectedDate').hide(200)
            DisableDOMObject($('#ExpectedDateInput'));
            RemoveRequired($('#ExpectedDateTitle'))
        }
    });
    //==========================================
    // 付款方式選擇/帳號選擇開窗/帳號選擇完畢
    //==========================================
    $('#PaymentMethodSelect').on('change', function () {
        emptyPaymentInfo()
        $('#AccountSelectBtn').remove();
        switch ($(this).val()) {
            case 'WIRE':
                {
                    $('#AccountNameInput').val()
                    if ($('#VendorKind').val() != "ONE TIME") {
                        $('#AccountNameDisable').empty().append(_autoDoneTextIcon);
                        generalWire()
                        if ($('#paymentReasonCode').val() == null || $('#paymentReasonCode').val() == "") {
                            SwitchHideDisplay([$('#RemittanceDisable')], [$('#RemittanceSelect')]);
                            $('#RemittanceSelect').val('')
                            $('#RemittanceSelect').selectpicker('refresh');
                            EnableDOMObject($('#RemittanceSelect'));
                        } else {
                            $('#RemittanceSelect').val($('#paymentReasonCode').val());
                            $('#RemittanceSelect').selectpicker('refresh').selectpicker('hide');
                            $('#RemittanceDisable').text($('#RemittanceSelect option:selected').text()).show();
                        }
                    }
                    else {
                        onceTimeWire();
                    }
                    break;
                }
            case 'BILLS_PAYABLE':
            case 'CHECK':
            default:
                {
                    nonWire()
                    $('#AccountNameInput').val($('#VendorNameInput').val())
                    $('#AccountNameDisable').text($('#VendorNameInput').val());
                    break;
                }
        }
        $('#PaymentMethodNameInput').val($('#PaymentMethodSelect option:selected').text())
        $('#PaymentMethodDisable').text($('#PaymentMethodSelect option:selected').text())
    });
    $(document).on('click', '#AccountOpen', function () {
        $('[data-remodal-id=SelectAccount]').remodal().open();
    });
    $(document).on('click', '#AccountConfirm', function () {
        var selectTarget = $('input[name="AccountSelector"]:checked').parents('li.AccountSelect');

        if ($(selectTarget).find('div.popup-PaymentDescription').text() != null && $(selectTarget).find('div.popup-PaymentDescription').text() != undefined) {
            $('#AccountDescDisable').text($(selectTarget).find('div.popup-PaymentDescription').text());
            $('#AccountDescInput').val($(selectTarget).find('div.popup-PaymentDescription').text());
        }
        $('#BankAccountId').val($(selectTarget).find('input[name="AccountSelector"]:checked').val())
        $('#BankNameDisable').text($(selectTarget).find('div.popup-PaymentBank').text());
        $('#BankNameInput').val($(selectTarget).find('div.popup-PaymentBank').text().replace(/\d+\s+/g, ''));
        $('#BankInput').val($(selectTarget).find('div.popup-PaymentBank').text().replace(/\D+/g, ''));

        $('#AccountNumDisable').text($(selectTarget).find('div.popup-PaymentAccount').text());
        $('#AccountNumInput').val($(selectTarget).find('div.popup-PaymentAccount').text());

        $('#AccountNameDisable').text($(selectTarget).find('div.popup-PaymentName').text());
        $('#AccountNameInput').val($(selectTarget).find('div.popup-PaymentName').text());

        $('#BranchNameDisable').text($(selectTarget).find('div.popup-PaymentBranch').text());
        $('#BranchNameInput').val($(selectTarget).find('div.popup-PaymentBranch').text().replace(/\d+\s+/g, ''));
        $('#BranchInput').val($(selectTarget).find('div.popup-PaymentBranch').text().replace(/\D+/g, ''));
    });
    //==========================================
    // 請款明細層-動態效果/建立/展開收合/新增/刪除/各項連動
    //==========================================
    $(document).on('click', '#ExpandENPDetail', function () {
        if ($(this).find('.glyphicon-chevron-down').length > 0) {
            SwitchHideDisplay([], [$(this).parents('tbody').find('.ENPDetail')]);
        } else {
            SwitchHideDisplay([$(this).parents('tbody').find('.ENPDetail')], []);
        }
        $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up')
    });
    $(document).on('click', '#ExpandAllENPDetail', function () {
        if ($(this).find('.list-open-icon').length > 0) {
            SwitchHideDisplay([], [$('.ENPDetail')]);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up')
        } else {
            SwitchHideDisplay([$('.ENPDetail')], []);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
        }
        $(this).find('.toggleArrow').toggleClass('list-close-icon list-open-icon')
    });
    $(document).on('click', '#AppendENPDetail', function () {
        ENPDetailAppend();
    });
    $(document).on('click', '#DeleteThisENPDetail', function () {
        if ($(this).parents('table').find('tbody').length < 2) {
            alertopen("無法再進行刪除!")
            return;
        }
        var removeTarget = $(this).parents('tbody');
        if (removeTarget.find('#LineNum').val() != 0) {
            $('#InformationZone').append('<input type="hidden" name="ENPDetail.Index" value="' + removeTarget.find('#LineNum').val() + '">')
            $('#InformationZone').append('<input type="text" hidden name="ENPDetail[' + removeTarget.find('#LineNum').val() + '].LineNum" value="' + removeTarget.find('#LineNum').val() + '">')
            $('#InformationZone').append('<input type="text" hidden name="ENPDetail[' + removeTarget.find('#LineNum').val() + '].IsDelete" value="true">')
        }

        $(this).parents('tbody').remove();
        RenumberingDetail($('table#ENPDetailTable tbody'), 'DetailSerno')
        deletedRecalculateMoney($(this).parents('tbody'))
    });
    $(document).on('click', 'button[data-id="enpPaymentCategorySelect"]', function () {
        var target = $(this).siblings('#enpPaymentCategorySelect')
        if (target.find('option').length < 2) {
            LoadingPaymentCategory(target)
        }
    })
    $(document).on('change', "select.enpPaymentCategorySelect", function () {
        var $value = $(this).val();
        var $midCategory = $(this).parents('tr').find('select.enpPaymentMidCategorySelect');
        LoadingPaymentMidCategory($midCategory, $value)
    })
    $(document).on('change', "select.enpPaymentMidCategorySelect", function () {
        var $catValue = $(this).parents('tr').find('select.enpPaymentCategorySelect').val()
        var $midValue = $(this).val()
        var $expense = $(this).parents('tr').find('select.enpExpenseAttributeSelect');
        LoadingExpenseAttribute($expense, $catValue, $midValue)
    })
    $(document).on('change', "select.enpExpenseAttributeSelect", function () {
        var $catValue = $(this).parents('tr').find('select.enpPaymentCategorySelect').val()
        var $midValue = $(this).parents('tr').find('select.enpPaymentMidCategorySelect').val()
        var $expenseValue = $(this).val();
        LoadingAccountingItem($(this), $catValue, $midValue, $expenseValue)
    })
    $(document).on('click', 'button[data-id="enpProjectCategorySelect"]', function () {
        var target = $(this).siblings('#enpProjectCategorySelect')
        if (target.find('option').length < 2) {
            LoadingProjectCategory(target)
        }
    })
    $(document).on('change', "select.enpProjectCategorySelect", function () {
        var $value = $(this).val();
        var $Project = $(this).parents('tr').find('select.enpProjectSelect');
        LoadingProject($Project, $value)
    });
    $(document).on('change', "select.enpProjectSelect", function () {
        var $value = $(this).val();
        var $ProjectItem = $(this).parents('tr').find('select.enpProjectItemSelect');
        LoadingProjectItem($ProjectItem, $value)
    })
    //==========================================
    // 分攤明細層-動態效果建立/展開收合/新增/刪除
    //==========================================
    $(document).on('click', '#ExpandAmortizationDetail', function () {
        if ($(this).find('.glyphicon-chevron-down').length > 0) {
            SwitchHideDisplay([], [$(this).parents('tbody').find('.AmortizationDetail')]);
        } else {
            SwitchHideDisplay([$(this).parents('tbody').find('.AmortizationDetail')], []);
        }
        $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up')
    });
    $(document).on('click', '#ExpandAllAmortizationDetail', function () {
        if ($(this).find('.list-open-icon').length > 0) {
            SwitchHideDisplay([], [$('.AmortizationDetail')]);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up')
        } else {
            SwitchHideDisplay([$('.AmortizationDetail')], []);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
        }
        $(this).find('.toggleArrow').toggleClass('list-open-icon list-close-icon')
    });
    $(document).on('click', '#AppendAmortizationDetail', function () {
        AmortizationDetailAppend();
    });
    $(document).on('click', '#DeleteThisAmortizationDetail', function () {
        if ($(this).parents('table').find('tbody').length < 2) {
            alertopen("無法再進行刪除!")
            return;
        }
        var removeTarget = $(this).parents('tbody');
        if (removeTarget.find('#ADetailID').val() != 0) {
            $('#InformationZone').append('<input type="hidden" name="AmortizationDetail.Index" value="' + removeTarget.find('#ADetailID').val() + '">')
            $('#InformationZone').append('<input type="text" hidden name="AmortizationDetail[' + removeTarget.find('#ADetailID').val() + '].ADetailID" value="' + removeTarget.find('#ADetailID').val() + '">')
            $('#InformationZone').append('<input type="text" hidden name="AmortizationDetail[' + removeTarget.find('#ADetailID').val() + '].IsDelete" value="true">')
        }

        $(this).parents('tbody').remove();
        TableBindingSetting($('#AmortizationDetailTable'), 'AmortizationDetail');
        recalculateAmortizationRatiobyMoney();
    });
    //==========================================
    // 預付款充銷層-開窗/選擇完畢
    //==========================================
    $(document).on('click', '#SelectPrepayment', function () {
        var restrictDept = "";
        if (_unitData == undefined) {
            return;
        }
        var unitData = _unitData.slice().reverse();
        $.each(unitData, function (index, item) {
            if (item.unit_level == 7 || item.unit_level == 5 || restrictDept != "") {
                return;
            }
            restrictDept = item.unit_id;
        })
        $.ajax({
            async: false,
            type: 'GET',
            dataType: 'json',
            url: '/ENP/GetPrepaymentInfo?vendorNum=' + $('#VendorNumInput').val() + '&applicantUnitCode=' + restrictDept + '&currency=' + $('#CurrencySelect').val(),
            success: function (data) {
                $('#PrepaymentSelectList div.popup-tbody ul').empty();
                if (data.length < 1) {
                    $('#PrepaymentSelectList div.popup-tbody ul').append('<li class="AccountSelect">\
                        <label class="w100 label-box">\
                            <div class="table-box w100 popup-PrepaymentID">未有可沖銷之預付單</div>\
                        </label>\
                    </li>');
                }
                $.each(data, function (index, item) {
                    $('#PrepaymentSelectList div.popup-tbody ul').append(
                    '<li class="AccountSelect">\
                        <label class="w100 label-box">\
                            <div class="table-box w10"><input name="PrepaymentSelector" class="PrepaymentSelector" type="checkbox"></div>\
                            <div class="table-box w30 popup-PrepaymentID">' + item.EPPNum + '</div>\
                            <div class="table-box w30 popup-PrepayAmount">' + item.TotalAmount + '</div>\
                            <div class="table-box w30 popup-PrepayunAmount">'+ item.UnWriteAmount + '</div>\
                        </label>\
                    </li>\
                ');
                })
            },
            error: function (data) {
                alertopen("取得預付資料失敗");
            }
        })
        $('[data-remodal-id=SelectPrepayment]').remodal().open();
    })
    $('#PrepaymentConfirm').on('click', function () {
        var selectTarget = $('#PrepaymentSelect').find('input.PrepaymentSelector:checked');
        if (selectTarget.length > 0) {
            CreatePrepaymentTable();
        }
        var existData = "";
        $.each($('table#PrepaymentTable tbody').find('#PrepaymentNumInput'), function (index, item) {
            existData = existData + ',' + $(item).val();
        })
        $.each(selectTarget, function (index, item) {
            var itemRoot = $(item).parents('li');
            if (existData != undefined && existData.includes(itemRoot.find('.popup-PrepaymentID').text())) {
                return;
            }
            var count = $('#PrepaymentTable tbody').length;
            var $template = $('#PrepaymentDetailTemplate').clone().attr('id', 'PrepaymentDetail_' + count);
            $template.find('#PrepaymentNumDisable').text(itemRoot.find('.popup-PrepaymentID').text());
            $template.find('#PrepaymentNumInput').val(itemRoot.find('.popup-PrepaymentID').text());
            $template.find('#PrepaymentAmountDisable').text(itemRoot.find('.popup-PrepayAmount').text());
            $template.find('#PrepaymentAmountInput').val(itemRoot.find('.popup-PrepayAmount').text());
            $template.find('#UnWriteOffAmountDisable').text(itemRoot.find('.popup-PrepayunAmount').text());
            $template.find('#UnWriteOffAmountInput').val(itemRoot.find('.popup-PrepayunAmount').text());
            $('#PrepaymentTable').append($template);
        })
        TableBindingSetting($('#PrepaymentTable'), 'Prepayment');
        AccountFormat();
        $('.PrepaymentMoney').on('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', PrepaymentAmountCal);
    })
});

//==============================================================================================
// 供應商選擇完畢/付款金額計算
//==============================================================================================
function vendorSelected(vendor) {
    vendorOutput = vendor;
    $('#VendorNumAndName').text(vendorOutput.supplierName + "(" + vendor.supplierNumber + ")")
    $('#VendorNumInput').val(vendorOutput.supplierNumber);
    $('#VendorNameInput').val(vendorOutput.supplierName);
    $('#undone-GenerateIncomeTax').text("此供應商及付款資訊不需產生所扣資料")
    var supplierSite = vendorOutput.supplierSite[0];
    if (supplierSite == undefined) {
        console.log("此筆供應商資訊有誤")
        return;
    }
    // 供應商類別
    $('#VendorKind').val(vendor.supplierTypeLookupCode)
    // 供應商流水號
    $('#VendorID').val(vendor.supplierID)
    // 供應商統編/所得人統編
    $('#IDNoDisable').text(vendor.vatRegistrationNumber)
    $('#IDNoInput').val(vendor.vatRegistrationNumber)
    // 供應商地址/連絡地址郵遞區號/連絡地址/地址代號
    $('#VendorAddress').val(supplierSite.invoiceAddress)
    $('#ContactPostNum').val(supplierSite.contactZipCode)
    var contactInfo = "";
    if (!isNullOrEmpty(supplierSite.contactCity)) {
        contactInfo = contactInfo + supplierSite.contactCity;
    }
    if (!isNullOrEmpty(supplierSite.contactAddress)) {
        contactInfo = contactInfo + supplierSite.contactAddress;
    }

    $('#ContactAddress').val(contactInfo)
    $('#supplierSiteCode').val(supplierSite.supplierSiteCode)
    // 戶籍地址郵遞區號/所得人連絡地址/發票地址
    $('#PermeanentPostNum').val(supplierSite.invoiceZipCode)
    var invoiceInfo = "";
    if (!isNullOrEmpty(supplierSite.invoiceCity)) {
        invoiceInfo = invoiceInfo + supplierSite.invoiceCity;
    }
    if (!isNullOrEmpty(supplierSite.invoiceAddress)) {
        invoiceInfo = invoiceInfo + supplierSite.invoiceAddress;
    }
    $('#PermanentAddress').val(invoiceInfo)
    // 國別/稅率代碼/稅率/憑單方式
    $('#taxCode').val(supplierSite.taxCode)
    $('#taxRate').val(supplierSite.taxRate)
    $('wtTaxPrint').val(supplierSite.wtTaxPrint);
    // 證號別
    $('#identityFlag').val(supplierSite.identityFlag)
    $('#locationID').val(supplierSite.supplierSiteID)
    // 供應商匯費,
    $('#paymentReasonCode').val(supplierSite.paymentReasonCode)

    //==========================================
    // 供應商所扣
    // 若證號別及稅率代碼都有，申請人起單階段即開放所得稅申報資料區塊
    //==========================================
    var isIncomeDeducation = false;
    if (supplierSite.taxCode != null && supplierSite.identityFlag != null) {
        isIncomeDeducation = true;
    }
    $('#CertificateKindSelect').val('').selectpicker('refresh')
    $('#Deduction').prop('checked', isIncomeDeducation).trigger('change');
    //==========================================
    // 是否為單獨付款
    //==========================================
    var isSinglePayment = false;
    if (supplierSite.exclusivePaymentFlag == 'Y') {
        isSinglePayment = true;
    }
    $('#PayAlone').prop('checked', isSinglePayment).trigger('change');
    $('#PayAlone').prop('disabled', false)
    //==========================================
    // 付款方式
    //==========================================
    SwitchHideDisplay([], [$('#PaymentInfomationBlock')])
    PaymentAccount(vendorOutput.supplierBank);
    _paymentMethod = supplierSite.paymentMethodLookupCode;
    if (!_foriegnPayMethod) {
        $('#PaymentMethodSelect').val(supplierSite.paymentMethodLookupCode).trigger('change').selectpicker('refresh')
    } else {
        $('#PaymentMethodSelect').val('WIRE').trigger('change').selectpicker('refresh')
    }
    //==========================================
    // 預付款沖銷
    //==========================================
    $('#undone-vendorSelect').text("請點選上方【選擇預付單】");
    if ($('div#SelectPrepayment').length < 1) {
        $('div#PrepaymentRoot div.title').prepend('<div class="area-btn-right" id="SelectPrepayment"><a class="btn-02-blue btn-text4">選擇預付單</a></div>')
    }
    GetTwoNhiFlag($('#VendorNumInput').val());
    console.log(vendor);
}
function calculatePaymentAmount() {
    var totalPayment = 0;
    var withholdingTax = 0;
    var supplementPremium = 0;
    var withholdingAmount = 0;
    var prepayMoney = 0;
    try {
        totalPayment = accounting.unformat($('input#TWDAmountInput').val())
        withholdingTax = accounting.unformat($('#WithholdingTaxInput').val())
        supplementPremium = accounting.unformat($('#SupplementPremiumInput').val())
        withholdingAmount = accounting.unformat($('#WithHoldingAmountInput').val())
        $.each($('#PrepaymentTable').find('input.PrepaymentMoney'), function (index, item) {
            var writeoffMoney = parseFloat(accounting.unformat($(item).val()));
            prepayMoney += writeoffMoney
        })
    } catch (e) {
    }

    $('#PaymentAmountInput').val(totalPayment - withholdingTax - supplementPremium - withholdingAmount - prepayMoney)
    $('#PaymentAmountDisable').text(totalPayment - withholdingTax - supplementPremium - withholdingAmount - prepayMoney)
    AccountFormat($('#PaymentAmountInput'))
    AccountFormat($('#PaymentAmountDisable'))
}
//==============================================================================================
// 付款方式欄位控制
//==============================================================================================
function nonWire() {
    SwitchHideDisplay(
        [$('#AccountNameDisable'), $('#AccountDescInput'), $('#RemittanceSelect'), $('#BankSelect'), $('#BranchSelect'), $('#AccountNumInput')],
[$('#AccountNameInput'), $('#AccountDescDisable'), $('#RemittanceDisable'), $('#BankNameDisable'), $('#BranchNameDisable'), $('#AccountNumDisable')]
)
}
function generalWire() {
    $('#AccountRegion').append(_accountOpenIcon);
    SwitchHideDisplay(
      [$('#AccountNameInput'), $('#AccountDescInput'), $('#RemittanceSelect'), $('#BankSelect'), $('#BranchSelect'), $('#AccountNumInput')],
      [$('#AccountNameDisable'), $('#AccountDescDisable'), $('#RemittanceDisable'), $('#BankNameDisable'), $('#BranchNameDisable'), $('#AccountNumDisable')]
    );
}
function onceTimeWire() {
    SwitchHideDisplay(
      [$('#AccountNameDisable'), $('#AccountDescDisable'), $('#RemittanceDisable'), $('#BankNameDisable'), $('#BranchNameDisable'), $('#AccountNumDisable')],
      [$('#AccountNameInput'), $('#AccountDescInput'), $('#RemittanceSelect'), $('#BankSelect'), $('#BranchSelect'), $('#AccountNumInput')]
    );
    EnableDOMObject($('#RemittanceSelect'))
}
//==============================================================================================
// 請款類別設定 - 一般請款/一般折讓/捐贈/初始化
//==============================================================================================
function PleasePaymentSet() {
    DisableDOMObject($('#DiscountReceive'));
    $('#Deduction').parent('label').show();

    SwitchHideDisplay(
        [
        $('#DiscountInvoiceTitle').parents('div.content-box'),
        $('#DiscountInvoiceDateTitle').parents('div.content-box'),
        $('#DiscountReceive').parents('div.content-box'),
        $('#donateInformation'),
        $('#ExpectedDate')
        ],
    [
        $('#CertificateNum'),
        $('#IncomeTaxInformation'),
        $('#PrepaymentRoot')
    ]);
    RemoveRequired($('#ExpectedDateTitle'));
    RemoveRequired($('#DiscountInvoiceDateTitle'));
    RemoveRequired($('#DiscountInvoiceTitle'));
    if ($('#CurrencySelect').val() == "TWD") {
        $('#WithHoldingAmount').show(200)
    }
    EnableDOMObject('#CertificateKindSelect');
    $('#CertificateKindSelect').selectpicker({ title: '請選擇' }).selectpicker('render');
    $('#CertificateKindSelect option').remove();
    $('#CertificateKindSelect').append($('<option>', {
        value: 'I', text: '發票'
    }), $('<option>', {
        value: 'R', text: '收據'
    }), $('<option>', {
        value: 'O', text: '其他'
    }));
    $('#CertificateKindSelect').selectpicker('refresh');

    if ($('input[name="Certificate"]:checked').val() == "true" && _tempFlag) {
        $('#CertificateTrue input').prop('checked', true).trigger('change');
    }

    _moneyNegative = false;
}
function DiscountSet() {
    EnableDOMObject($('#DiscountReceive'));
    $('#Deduction').parent('label').hide();

    SwitchHideDisplay(
        [
            $('#WithHoldingAmount'),
            $('#CertificateNum'),
            $('#PrepaymentRoot'),
            $('#IncomeTaxInformation'),
            $('#donateInformation'),
            $('#ExpectedDate')
        ],
        [
            $('#undone-vendorSelect'),
            $('#DiscountInvoiceTitle').parents('div.content-box'),
            $('#DiscountInvoiceDateTitle').parents('div.content-box'),
            $('#DiscountReceive').parents('div.content-box')
        ]);
    $('#PrepaymentTable').remove();
    RemoveRequired($('#ExpectedDateTitle'));
    AppendRequired($('#DiscountInvoiceDateTitle'));
    AppendRequired($('#DiscountInvoiceTitle'));

    _moneyNegative = true;
    EnableDOMObject('#CertificateKindSelect');
    $('#CertificateKindSelect option').remove();
    $('#CertificateKindSelect').selectpicker({
        title: '請選擇'
    }).selectpicker('render');
    $('#CertificateKindSelect').append($('<option>', {
        value: 'C', text: '折讓'
    }));

    if ($('input[name="Certificate"]:checked').val() == "true" && _tempFlag) {
        $('#CertificateTrue input').prop('checked', true).trigger('change');
    }
    $('#CertificateKindSelect').selectpicker('refresh');
}
function DonateSet() {
    DisableDOMObject($('#DiscountReceive'));
    $('#Deduction').parent('label').show();

    $('#CertificateTrue input').prop('checked', true).trigger('change');
    SwitchHideDisplay(
        [
            $('#DiscountInvoiceTitle').parents('div.content-box'),
            $('#DiscountInvoiceDateTitle').parents('div.content-box'),
            $('#DiscountReceive').parents('div.content-box')
        ],
        [
            $('#CertificateNum'),
            $('#IncomeTaxInformation'),
            $('#donateInformation'),
            $('#PrepaymentRoot'),
            $('#ExpectedDate')
        ]);
    if ($('#CurrencySelect').val() == "TWD") {
        $('#WithHoldingAmount').show(200)
    }
    AppendRequired($('#ExpectedDateTitle'));
    RemoveRequired($('#DiscountInvoiceDateTitle'));
    RemoveRequired($('#DiscountInvoiceTitle'));

    EnableDOMObject('#CertificateKindSelect');
    _moneyNegative = false;
    $('#CertificateKindSelect option').remove();
    $('#CertificateKindSelect').selectpicker({ title: '請選擇' }).selectpicker('render');
    $('#CertificateKindSelect').append($('<option>', {
        value: 'I', text: '發票'
    }), $('<option>', {
        value: 'R', text: '收據'
    }), $('<option>', {
        value: 'O', text: '其他'
    }));

    $('#CertificateKindSelect').selectpicker('refresh');
}
function initPleaseTypeSet() {
    var e = $('#ExpenseKindSelect')
    $('div.error-text').remove();
    _pleaseType = $(e).val();
    removeAllData();
    if ($(e).val() != "") {
        $.ajax({
            async: false,
            type: 'GET',
            dataType: 'json',
            url: '/ENP/GetPaymentCategory?expenseKind=' + $(e).val(),
            success: function (data) {
                _paymentCateCollection = data;
            },
            error: function (data) {
                FiisFatalFail()
            }
        })
    }
    switch ($(e).val()) {
        case 'PO_CM_EXP':
            PleasePaymentSet();
            break;
        case 'NPO_CM_EXP':
            DiscountSet();
            break;
        case 'NPO_DONATE_EXP':
            DonateSet();
            break;
    }
    if ($('#ExpenseKindSelect').val() != "" && $('#ExpenseKindSelect').val() != undefined) {
        SwitchHideDisplay([], [$('#ENPInfomationBlock'), $('#VoucherInfomationBlock')]);
    }

    RemoveRequired($('#CertificateNumTitle'));
    if (!_tempFlag) {
        DisableDOMObject($('#EstimateVoucherDateInput'));
        SwitchHideDisplay([$('#CertificateNumInput')], [$('#CertificateNumDisable')])
        $('#EstimateVoucherDateInput').find('input').val('');
        $('#InvoiceOverdueInput').val('');
        $('#YearVoucherInput').val('');
        $('#ExportApplyAttributeSelect').val('').selectpicker('refresh');
        $('#VoucherBeauSelect').val('').selectpicker('refresh')
        $('#AccountBankDisable').text('');
        $('input[name="Books"]').val('')
        $('input[name="BooksName"]').val('')
        $('input[name="ContractNum"]').val('')
        $('input[name="CertificateAmount"]').val('')
        $('input[name="OriginalAmount"]').val('')

        EmptyObj([$('#CertificateNumInput')]);
    }
}
//==============================================================================================
// 請款明細層 - 建立/新增(有無資料)/請款大類/請款中類/費用屬性/專案類別/專案/專案項目/重新計算金額/刪除後重新計算金額
//==============================================================================================
function CreateENPDetail() {
    if ($('#ENPDetailTable').length < 1) {
        var template = $('#ENPDetailTableTemplate').clone().attr('id', 'ENPDetailTable');
        $(template).find('tbody').remove();
        $('#ENPDetailRoot').append($(template).show())
        ENPDetailAppend();
    }
}
function ENPDetailAppend() {
    var count = $('#ENPDetailTable tbody').length;
    var $template = $('#ENPDetailCloneTemplate').clone().attr('id', 'ENPDetail_' + count);

    DisableDOMObject($template.find('select.enpPaymentMidCategorySelect'));
    DisableDOMObject($template.find('select.enpExpenseAttributeSelect'));
    DisableDOMObject($template.find('select.enpProjectSelect'));
    DisableDOMObject($template.find('select.enpProjectItemSelect'));

    $template.find('td.DetailSerno').text(count + 1);
    $template.find('.enpAmortizationStartDateInput').datetimepicker({
        format: 'YYYY-MM-DD'
    });
    $template.find('.enpAmortizationEndDateInput').datetimepicker({
        format: 'YYYY-MM-DD'
    });

    $template.find('#enpOriginalAmountInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', recalculateMoney);
    $template.find('#enpOriginalTaxInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', recalculateMoney);
    $('#ENPDetailTable').append($template);

    TableBindingSetting($('#ENPDetailTable'), 'ENPDetail');
    $template.find('.selectpickerInDetail').selectpicker();
    if ($('#P_CurrentStep').val() == "3") {
        $template.find('div.enpIsIncomeDeductionDisable').hide()
        var YorN = $('#Deduction').prop('checked') ? "true" : "false";
        $template.find('select.enpIsIncomeDeductionSelect').val(YorN)
        $template.find('select.enpIsIncomeDeductionSelect').selectpicker('refresh')
    } else {
        $template.find('div.enpIsIncomeDeductionSelect').hide()
    }
    judgeInvoiceDeductible(false);
}
function ENPDetailDataAppend(data) {
    var count = $('#ENPDetailTable tbody').length;
    var $template = $('#ENPDetailCloneTemplate').clone().attr('id', 'ENPDetail_' + count);

    DisableDOMObject($template.find('select.enpPaymentMidCategorySelect'));
    DisableDOMObject($template.find('select.enpExpenseAttributeSelect'));
    DisableDOMObject($template.find('select.enpProjectSelect'));
    DisableDOMObject($template.find('select.enpProjectItemSelect'));

    //Setting Value
    //Table Layer 1
    $template.find('td.DetailSerno').text(count + 1);
    $template.find('#LineNum').val(data.LineNum);
    $template.find('.enpAmortizationStartDateInput').datetimepicker({
        format: 'YYYY-MM-DD', date: data.AmortizationStartDate
    });

    $template.find('.enpAmortizationEndDateInput').datetimepicker({
        format: 'YYYY-MM-DD', date: data.AmortizationEndDate
    })

    var amortizationDateStart = $template.find('.enpAmortizationStartDateInput').val() == "" ? "無攤銷起日" : $template.find('.enpAmortizationStartDateInput').val();
    var amortizationDateEnd = $template.find('.enpAmortizationEndDateInput').val() == "" ? "無攤銷迄日" : $template.find('.enpAmortizationEndDateInput').val();
    $template.find('.enpAmortizationDateDisable').text(amortizationDateStart + ' - ' + amortizationDateEnd);

    LoadingPaymentCategory($template.find('#enpPaymentCategorySelect'), data.PaymentCategory);
    LoadingPaymentMidCategory($template.find('#enpPaymentMidCategorySelect'), $template.find('#enpPaymentCategorySelect').val(), data.PaymentMidCategory);
    LoadingExpenseAttribute($template.find('#enpExpenseAttributeSelect'), $template.find('#enpPaymentCategorySelect').val(), $template.find('#enpPaymentMidCategorySelect').val(), data.ExpenseAttribute)
    if (data.AccountingItem != null) {
        $template.find('#enpAccountingItemDisable').text(data.AccountingItem + ' - ' + data.AccountingItemName)
        $template.find('#enpAccountingItemCode').val(data.AccountingItem);
        $template.find('#enpAccountingItemName').val(data.AccountingItemName);
    }
    //Table Layer 2

    $template.find('#enpOriginalAmountInput').val(data.OriginalAmount);
    $template.find('#enpOriginalAmountDisable').text(data.OriginalAmount);
    $template.find('#enpOriginalTaxInput').val(data.OriginalTax);
    $template.find('#enpOriginalTaxDisable').text(data.OriginalTax);
    $template.find('#enpOriginalSaleAmountDisable').text(data.OriginalSaleAmount);
    $template.find('#enpOriginalSaleAmountInput').val(data.OriginalSaleAmount);
    $template.find('#enpTWDAmountDisable').text(data.TWDAmount);
    $template.find('#enpTWDAmountInput').val(data.TWDAmount);
    $template.find('#enpTWDTaxDisable').text(data.TWDTax);
    $template.find('#enpTWDTaxInput').val(data.TWDTax);
    $template.find('#enpTWDSaleAmountDisable').text(data.TWDSaleAmount);
    $template.find('#enpTWDSaleAmountInput').val(data.TWDSaleAmount);
    //Table Layer3
    $template.find('#enpIsIncomeDeductionSelect').selectpicker()
    $template.find('#enpIsIncomeDeductionSelect').val(data.IsIncomeDeduction.toString());
    $template.find('#enpIsIncomeDeductionSelect').selectpicker('refresh')
    if (data.IsIncomeDeduction) {
        $template.find('#enpIsIncomeDeductionDisable').text("Y");
    } else {
        $template.find('#enpIsIncomeDeductionDisable').text("N");
    }
    LoadingProjectCategory($template.find('#enpProjectCategorySelect'), data.ProjectCategory);
    LoadingProject($template.find('#enpProjectSelect'), $template.find('#enpProjectCategorySelect').val(), data.Project);
    LoadingProjectItem($template.find('#enpProjectItemSelect'), $template.find('#enpProjectSelect').val(), data.ProjectItem)
    //Setting Value End

    //Table Layer4
    if (data.VoucherMemo == undefined || data.VoucherMemo == "") {
        $template.find('#enpVoucherMemoInput').val($('#HeaderDescInput').val());
        $template.find('#enpVoucherMemoDisable').text($('#HeaderDescInput').val());
    } else {
        $template.find('#enpVoucherMemoInput').val(data.VoucherMemo);
        $template.find('#enpVoucherMemoDisable').text(data.VoucherMemo);
    }

    //Setting Value End
    $template.find('#enpOriginalAmountInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', recalculateMoney);
    $template.find('#enpOriginalTaxInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', recalculateMoney);
    $('#ENPDetailTable').append($template);

    TableBindingSetting($('#ENPDetailTable'), 'ENPDetail');
    $template.find('.selectpickerInDetail').selectpicker();
    $template.find('div.enpIsIncomeDeductionSelect').hide()
}
function LoadingPaymentCategory(target, defaultValue) {
    target.empty();
    $.each(_paymentCateCollection, function (index, item) {
        target.append('<option value="' + item.PaymentCategoryKey + '">' + item.PaymentCategoryValue + '</option>');
    })
    target.prepend('<option value selected>請選擇</option>');
    target.selectpicker();
    if (defaultValue != undefined && defaultValue != null) {
        target.val(defaultValue)
        $(target).parents('td').find('#enpPaymentCategoryDisable').text($(target).find('option:selected').text());
    }
    target.selectpicker('refresh');
}
function LoadingPaymentMidCategory(target, parentValue, defaultValue) {
    target.find('option').remove();

    $.each(_paymentCateCollection, function (index, item) {
        if (item.PaymentCategoryKey == parentValue) {
            $.each(item.MidCategory, function (midIndex, midItem) {
                target.append('<option value="' + midItem.PaymentMidCategoryKey + '">' + midItem.PaymentMidCategoryValue + '</option>')
            })
        }
    });
    target.prepend('<option value selected>請選擇</option>');
    target.selectpicker();
    EnableDOMObject(target);

    if (defaultValue != undefined && defaultValue != null) {
        target.val(defaultValue);
        target.selectpicker('refresh');
        $(target).parents('td').find('#enpPaymentMidCategoryDisable').text($(target).find('option:selected').text());
    }

    var $expenseAttribute = $(target).parents('tr').find('select.enpExpenseAttributeSelect');
    $expenseAttribute.empty();
    $expenseAttribute.selectpicker({ title: '請選擇' }).selectpicker('render');
    DisableDOMObject($expenseAttribute);

    var $enpAccountingItemDisable = $(target).parents('tr').find('.enpAccountingItemDisable');
    var $AccountingItemInput = $(target).parents('tr').find('input.enpAccountingItemInput');
    var $AccountiingItemNameInput = $(target).parents('tr').find('input.enpAccountingItemNameInput');
    $enpAccountingItemDisable.empty()
    $enpAccountingItemDisable.append('<b class="undone-text">系統自動帶入</b>')
    $AccountingItemInput.val('');
    $AccountiingItemNameInput.val('')
    if (parentValue == "" || parentValue == null) {
        DisableDOMObject(target)
        return;
    }
}
function LoadingExpenseAttribute(target, firstParentValue, secondParentValue, defaultValue) {
    target.find('option').remove();
    $.each(_paymentCateCollection, function (index, item) {
        if (item.PaymentCategoryKey == firstParentValue) {
            $.each(item.MidCategory, function (midIndex, midItem) {
                if (midItem.PaymentMidCategoryKey == secondParentValue) {
                    $.each(midItem.PaymentAttribute, function (expenseIndex, expenseItem) {
                        target.append('<option value="' + expenseItem.AttributeValue + '">' + expenseItem.AttributeValue + '</option>')
                    })
                }
            })
        }
    });
    target.prepend('<option value selected>請選擇</option>');

    var $enpAccountingItemDisable = target.parents('tr').find('.enpAccountingItemDisable');
    var $AccountingItemInput = target.parents('tr').find('input.AccountingItemInput');
    var $AccountiingItemNameInput = $(target).parents('tr').find('input.AccountingItemNameInput');
    $enpAccountingItemDisable.empty()
    $enpAccountingItemDisable.append('<b class="undone-text">系統自動帶入</b>')
    $AccountingItemInput.val('');
    $AccountiingItemNameInput.val('')

    target.selectpicker();
    EnableDOMObject(target);

    if (defaultValue != undefined && defaultValue != null) {
        target.val(defaultValue);
        target.selectpicker('refresh');
        $(target).parents('td').find('#enpExpenseAttributeDisable').text($(target).find('option:selected').text());
        LoadingAccountingItem(target, firstParentValue, secondParentValue, defaultValue)
    }
    if (firstParentValue == "" || firstParentValue == null || secondParentValue == "" || secondParentValue == null) {
        DisableDOMObject(target)
        return;
    }
}
function LoadingAccountingItem(target, firstParentValue, secondParentValue, thirdParentValue) {
    var $enpAccountingItemDisable = target.parents('tr').find('.enpAccountingItemDisable');
    var $AccountingItemInput = target.parents('tr').find('input.enpAccountingItemInput');
    var $AccountiingItemNameInput = $(target).parents('tr').find('input.enpAccountingItemNameInput');
    var $enpNeedCertificateDisable = target.parents('tbody').find('.enpNeedCertificateDisable');
    var $enpNeedCertificateInput = target.parents('tbody').find('input.enpNeedCertificateInput');
    var $Deductible = target.parents('tbody').find('input#Deductible');

    $.each(_paymentCateCollection, function (index, item) {
        if (item.PaymentCategoryKey == firstParentValue) {
            $.each(item.MidCategory, function (midIndex, midItem) {
                if (midItem.PaymentMidCategoryKey == secondParentValue) {
                    $.each(midItem.PaymentAttribute, function (expenseIndex, expenseItem) {
                        if (expenseItem.AttributeValue == thirdParentValue) {
                            $enpAccountingItemDisable.empty();
                            $enpAccountingItemDisable.append(expenseItem.AccountingValue + ' - ' + expenseItem.AccountingName);
                            $AccountingItemInput.val(expenseItem.AccountingValue);
                            $AccountiingItemNameInput.val(expenseItem.AccountingName)
                            if (expenseItem.NeedCertificate) {
                                $enpNeedCertificateInput.val("Y")
                                $enpNeedCertificateDisable.text("Y")
                            } else {
                                $enpNeedCertificateInput.val("N")
                                $enpNeedCertificateDisable.text("N")
                            }
                            if (expenseItem.IsDeduction) {
                                $Deductible.val("true");
                            } else {
                                $Deductible.val("false");
                            }
                        }
                    })
                }
            })
        }
    })
    if (firstParentValue == "" || firstParentValue == null || secondParentValue == "" || secondParentValue == null || thirdParentValue == "" || thirdParentValue == null) {
        $enpNeedCertificateInput.val("")
        $enpNeedCertificateDisable.empty().append(_autoDoneTextIcon)
        $enpAccountingItemDisable.append(_autoDoneTextIcon)
        $AccountingItemInput.val('');
        $AccountiingItemNameInput.val('')
        return;
    }
}
function LoadingProjectCategory(target, defaultValue) {
    target.empty();
    $.each(_projectCategory, function (key, value) {
        target.append('<option value="' + key + '">' + value + '</option>');
    })
    target.prepend('<option value selected>請選擇</option>');
    target.selectpicker();
    if (defaultValue != undefined && defaultValue != null) {
        target.val(defaultValue);
        $(target).parents('td').find('#enpProjectCategoryDisable').text($(target).find('option:selected').text())
    }
    target.selectpicker('refresh');
}
function LoadingProject(target, parentValue, defaultValue) {
    target.find('option').remove();
    if (parentValue != "" && parentValue != null) {
        $.ajax({
            async: false,
            type: 'GET',
            dataType: 'json',
            url: '/Project/GetProjectDropMenu?projectCategoryCode=' + parentValue,
            success: function (data) {
                $.each(data, function (key, value) {
                    target.append('<option value="' + key + '">' + value + '</option>');
                })
                target.prepend('<option value selected>請選擇</option>');
                target.selectpicker();
                EnableDOMObject(target);
            },
            error: function (data) {
            }
        })
        if (defaultValue != undefined && defaultValue != null) {
            target.val(defaultValue);
            target.selectpicker('refresh');
            $(target).parents('td').find('#enpProjectDisable').text($(target).find('option:selected').text())
        }
    } else {
        var $project = $(target).parents('tr').find('select.enpProjectSelect');
        $project.empty();
        $project.selectpicker({
            title: '請選擇'
        }).selectpicker('render');
        DisableDOMObject($project);
    }
    var $projectItem = $(target).parents('tr').find('select.enpProjectItemSelect');
    $projectItem.empty();
    $projectItem.selectpicker({ title: '請選擇' }).selectpicker('render');
    DisableDOMObject($projectItem);
}
function LoadingProjectItem(target, parentValue, defaultValue) {
    target.find('option').remove();
    if (parentValue != "" && parentValue != null) {
        $.ajax({
            async: false,
            type: 'GET',
            dataType: 'json',
            url: '/Project/GetProjectItemDropMenu?ProjectID=' + parentValue,
            success: function (data) {
                $.each(data, function (key, value) {
                    target.append('<option value="' + key + '">' + value + '</option>');
                })
                target.prepend('<option value selected>請選擇</option>');
                target.selectpicker();
                EnableDOMObject(target);
            },
            error: function (data) {
            }
        })
    } else {
        var $projectItem = $(target).parents('tr').find('select.enpProjectItemSelect');
        $projectItem.empty();
        $projectItem.selectpicker({
            title: '請選擇'
        }).selectpicker('render');
        DisableDOMObject($projectItem);
    }
    if (defaultValue != undefined && defaultValue != null) {
        target.val(defaultValue);
        target.selectpicker('refresh');
        $(target).parents('td').find('#enpProjectItemDisable').text($(target).find('option:selected').text())
    }
}
function recalculateMoney(e) {
    AccountUnFormat()
    var $this = $('#ENPDetailTable tbody')
    $.each($this, function (index, item) {
        var amount = $(item).find('#enpOriginalAmountInput').val();
        var tax = $(item).find('#enpOriginalTaxInput').val();
        var exchangeRate = $('#RateInput').val();
        $(item).find('#enpOriginalSaleAmountDisable').text(MathRoundExtension(amount - tax, $('#CurrencyPrecisionDisable').text()))
        $(item).find('#enpOriginalSaleAmountInput').val(MathRoundExtension(amount - tax, $('#CurrencyPrecisionDisable').text()))
        $(item).find('#enpTWDAmountDisable').text(Math.round(amount * exchangeRate))
        $(item).find('#enpTWDAmountInput').val(Math.round(amount * exchangeRate))
        $(item).find('#enpTWDTaxDisable').text(Math.round(tax * exchangeRate))
        $(item).find('#enpTWDTaxInput').val(Math.round(tax * exchangeRate))
        var amountTWD = $(item).find('#enpTWDAmountDisable').text();
        var taxTWD = $(item).find('#enpTWDTaxDisable').text();
        $(item).find('#enpTWDSaleAmountDisable').text(parseInt(amountTWD) - parseInt(taxTWD));
        $(item).find('#enpTWDSaleAmountInput').val(parseInt(amountTWD) - parseInt(taxTWD));
    })

    //==============================
    // 將請款明細改變的金額寫至主表單中
    //==============================
    var totalAmountTWD = 0;
    var totalTaxTWD = 0;
    var totalAmount = 0;
    var totalTax = 0;
    $.each($('#ENPDetailTable tbody'), function (index, item) {
        var $currentItem = $(item).find('tr').eq(2);
        totalAmountTWD += parseInt($currentItem.find('#enpTWDAmountDisable').text());
        totalTaxTWD += parseInt($currentItem.find('#enpTWDTaxDisable').text());
        totalAmount += parseFloat($currentItem.find('#enpOriginalAmountInput').val());
        totalTax += parseFloat($currentItem.find('#enpOriginalTaxInput').val());
    });
    $('#TWDAmountDisable').text(totalAmountTWD);
    $('#TWDPayAmountDisable').text(totalTaxTWD);
    $('input#TWDPayAmountInput').val(totalTaxTWD);
    $('input#TWDAmountInput').val(totalAmountTWD);
    $('#CertificateAmountDisable').text(totalAmount);
    $('#OriginalAmountDisable').text(totalTax);
    $('input[name="CertificateAmount"]').val(totalAmount);
    $('input[name="OriginalAmount"]').val(totalTax);
    if (e != undefined) {
        var isTax = $(e.currentTarget).attr('name').includes('Tax');
        var amountMargin = $(e.target).val() - _previousAmount;;
        var fixedAmount = [];
        var amortizationDetail = $('#AmortizationDetailTable').find('tbody')
        $.each(amortizationDetail, function (index, item) {
            if (index == amortizationDetail.length - 1) {
                $.each(fixedAmount, function (index, item) {
                    amountMargin -= item;
                })
                fixedAmount.push(amountMargin);
                return;
            }
            var ratio = $(item).find('#AmortizationDetailRatioInput').val();
            var tempAmount = MathRoundExtension(amountMargin * (ratio / 100), parseInt($('#CurrencyPrecisionDisable').text()))
            fixedAmount.push(tempAmount);
        })
        if (isTax) {
            if (_invoiceCanBeDeductible) {
                $.each(amortizationDetail, function (index, item) {
                    $(item).find('#OriginalAmortizationAmountInput').val(parseFloat($(item).find('#OriginalAmortizationAmountInput').val()) - fixedAmount[index]);
                })
            }
        } else {
            $.each(amortizationDetail, function (index, item) {
                $(item).find('#OriginalAmortizationAmountInput').val(parseFloat($(item).find('#OriginalAmortizationAmountInput').val()) + fixedAmount[index]);
            })
        }
        _previousAmount = $(e.target).val();
    }
    recalculateAmortizationRatiobyMoney();
    calculatePaymentAmount()
    _businessTaxReCal = true;
    BusinessTax();
    AccountFormat()
}
function deletedRecalculateMoney(tbodyOfDeleteItem) {
    AccountUnFormat()
    var $this = $('#ENPDetailTable tbody')
    $.each($this, function (index, item) {
        var amount = $(item).find('#enpOriginalAmountInput').val();
        var tax = $(item).find('#enpOriginalTaxInput').val();
        var exchangeRate = $('#RateInput').val();
        $(item).find('#enpOriginalSaleAmountDisable').text(MathRoundExtension(amount - tax, $('#CurrencyPrecisionDisable').text()))
        $(item).find('#enpOriginalSaleAmountInput').val(MathRoundExtension(amount - tax, $('#CurrencyPrecisionDisable').text()))
        $(item).find('#enpTWDAmountDisable').text(Math.round(amount * exchangeRate))
        $(item).find('#enpTWDAmountInput').val(Math.round(amount * exchangeRate))
        $(item).find('#enpTWDTaxDisable').text(Math.round(tax * exchangeRate))
        $(item).find('#enpTWDTaxInput').val(Math.round(tax * exchangeRate))
        var amountTWD = $(item).find('#enpTWDAmountDisable').text();
        var taxTWD = $(item).find('#enpTWDTaxDisable').text();
        $(item).find('#enpTWDSaleAmountDisable').text(parseInt(amountTWD) - parseInt(taxTWD));
        $(item).find('#enpTWDSaleAmountInput').val(parseInt(amountTWD) - parseInt(taxTWD));
    })

    //==============================
    // 將請款明細改變的金額寫至主表單中
    //==============================
    var totalAmountTWD = 0;
    var totalTaxTWD = 0;
    var totalAmount = 0;
    var totalTax = 0;
    $.each($('#ENPDetailTable tbody'), function (index, item) {
        var $currentItem = $(item).find('tr').eq(2);
        totalAmountTWD += parseInt($currentItem.find('#enpTWDAmountDisable').text());
        totalTaxTWD += parseInt($currentItem.find('#enpTWDTaxDisable').text());
        totalAmount += parseFloat($currentItem.find('#enpOriginalAmountInput').val());
        totalTax += parseFloat($currentItem.find('#enpOriginalTaxInput').val());
    });
    $('#TWDAmountDisable').text(totalAmountTWD);
    $('#TWDPayAmountDisable').text(totalTaxTWD);
    $('input#TWDPayAmountInput').val(totalTaxTWD);
    $('input#TWDAmountInput').val(totalAmountTWD);
    $('#CertificateAmountDisable').text(totalAmount);
    $('#OriginalAmountDisable').text(totalTax);
    $('input[name="CertificateAmount"]').val(totalAmount);
    $('input[name="OriginalAmount"]').val(totalTax);

    var amountMargin = _invoiceCanBeDeductible ? parseFloat(accounting.unformat($(tbodyOfDeleteItem).find('#enpOriginalSaleAmountInput').val())) : parseFloat(accounting.unformat($(tbodyOfDeleteItem).find('#enpOriginalAmountInput').val()));
    var fixedAmount = [];
    var amortizationDetail = $('#AmortizationDetailTable').find('tbody')
    $.each(amortizationDetail, function (index, item) {
        if (index == amortizationDetail.length - 1) {
            $.each(fixedAmount, function (index, item) {
                amountMargin -= item;
            })
            fixedAmount.push(amountMargin);
            return;
        }
        var ratio = $(item).find('#AmortizationDetailRatioInput').val();
        var tempAmount = MathRoundExtension(amountMargin * (ratio / 100), parseInt($('#CurrencyPrecisionDisable').text()))
        fixedAmount.push(tempAmount);
    })
    $.each(amortizationDetail, function (index, item) {
        $(item).find('#OriginalAmortizationAmountInput').val(parseFloat($(item).find('#OriginalAmortizationAmountInput').val()) - fixedAmount[index]);
    })

    recalculateAmortizationRatiobyMoney();

    var twd = accounting.unformat($('input#TWDAmountInput').val())
    var twdTax = accounting.unformat($('input#TWDPayAmountInput').val())
    AccountFormat($('#TaxableInput').val(twd - twdTax));
    AccountFormat($('#TaxAmountInput').val(twdTax));
    AccountFormat($('#TaxableDisable').text(twd - twdTax));
    AccountFormat($('#TaxAmountDisable').text(twdTax));

    $('#BTCertificateAmountDisable').text(twd)
    $('#BTCertificateAmountInput').val(twd)

    AccountFormat()
}
//==============================================================================================
// 分攤明細層 - 建立/新增(有無資料)/下拉設定/重新計算分攤金額(分攤比率[M]/分攤金額)/查詢帳務行/上載
//==============================================================================================
function CreateAmortizationDetail() {
    if ($('#AmortizationDetailTable').length < 1) {
        var template = $('#AmortizationDetailTableTemplate').clone().attr('id', 'AmortizationDetailTable');
        $(template).find('tbody').remove();
        $('#AmortizationDetailRoot').append($(template).show())
        AmortizationDetailAppend();
        recalculateAmortizationRatiobyMoney();
    }
}
function AmortizationDetailAppend() {
    var count = $('#AmortizationDetailTable tbody').length;
    var $template = _amortizationTemplate.clone().attr('id', 'AmortizationDetail_' + count);
    if (count == 0) {
        $template.find('#AmortizationDetailRatioInput').val(100);
    }
    $template.find('td.DetailSerno').text(count + 1);
    $template.find('#AmortizationDetailAccountBankSelect').val($('input#BooksInput').val())
    $template.find('#AmortizationDetailCostProfitCenterSelect').val(_defaultDepartment)
    $template.find('#AmortizationDetailRatioInput').bind('change', recalculateAmortizationRatio);
    $template.find('#OriginalAmortizationAmountInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', recalculateAmortizationRatiobyMoney);
    $('#AmortizationDetailTable').append($template);

    TableBindingSetting($('#AmortizationDetailTable'), 'AmortizationDetail');
    judgeInvoiceDeductible(false);
}
function AmortizationDetailDataAppend(data) {
    if (data == undefined) {
        return;
    }
    var count = $('#AmortizationDetailTable tbody').length;
    var $template = _amortizationTemplate.clone().attr('id', 'AmortizationDetail_' + count);
    if (count == 0) {
        $template.find('#AmortizationDetailRatioInput').val(100);
        $template.find('#AmortizationDetailRatioInput').val(100);
    }
    //Setting Value
    //Table Layer 1
    $template.find('#ADetailID').val(data.ADetailID);
    $template.find('td.DetailSerno').text(count + 1);
    $template.find('#AmortizationDetailRatioInput').val(data.AmortizationRatio);
    $template.find('#AmortizationDetailRatioDisable').text(data.AmortizationRatio);
    $template.find('#OriginalAmortizationAmountInput').val(data.OriginalAmortizationAmount)
    $template.find('#OriginalAmortizationAmountDisable').text(data.OriginalAmortizationAmount);
    $template.find('#OriginalAmortizationTWDAmountDisable').text(data.OriginalAmortizationTWDAmount);
    $template.find('#OriginalAmortizationTWDAmountInput').val(data.OriginalAmortizationTWDAmount);
    $template.find('#AmortizationDetailAccountBankSelect').val(data.AccountBank);
    $template.find('#AmortizationDetailAccountBankDisable').text($template.find('#AmortizationDetailAccountBankSelect option:selected').text());
    $template.find('#AmortizationDetailAccountBankNameInput').val(data.AccountBankName)
    $template.find('#AmortizationDetailCostProfitCenterSelect').val(data.CostProfitCenter);
    $template.find('#AmortizationDetailCostProfitCenterDisable').text($template.find('#AmortizationDetailCostProfitCenterSelect option:selected').text());
    $template.find('#AmortizationDetailCostProfitCenterNameInput').val(data.CostProfitCenterName)

    //Table Layer 2
    $template.find('#AmortizationDetailProductKindSelect').val(data.ProductKind);
    if (data.ProductKind != null) {
        $template.find('#AmortizationDetailProductKindDisable').text($template.find('#AmortizationDetailProductKindSelect option:selected').text())
        $template.find('#AmortizationDetailProductKindNameInput').val($template.find('#AmortizationDetailProductKindSelect option:selected').attr('description'))
    } else {
        $template.find('#AmortizationDetailProductKindDisable').text("無資料")
    }
    if (data.ProductDetail != undefined && data.ProductDetail != "") {
        if (_amImport) {
            var check = CodeGetOptionText("AmortizationDetailProductDetail", data.ProductDetail);
            if (check != undefined) {
                $template.find('#AmortizationDetailProductDetailDisable').text(data.ProductDetail + ' - ' + check);
                $template.find('#AmortizationDetailProductDetailCode').val(data.ProductDetail);
                $template.find('#AmortizationDetailProductDetailName').val(check);
                _amImport = false;
            }
        } else {
            $template.find('#AmortizationDetailProductDetailDisable').text(data.ProductDetail + ' - ' + data.ProductDetailName);
            $template.find('#AmortizationDetailProductDetailCode').val(data.ProductDetail);
            $template.find('#AmortizationDetailProductDetailName').val(data.ProductDetailName);
        }
    } else {
        $template.find('#AmortizationDetailProductDetailDisable').text("無資料")
    }

    if (data.ExpenseAttribute != null) {
        $template.find('#AmortizationDetailExpenseAttributeSelect').val(data.ExpenseAttribute);
        $template.find('#AmortizationDetailExpenseAttributeNameInput').val($template.find('#AmortizationDetailExpenseAttributeSelect option:selected').text())
        $template.find('#AmortizationDetailExpenseAttributeDisable').text($template.find('#AmortizationDetailExpenseAttributeSelect option:selected').text());
    } else {
        $template.find('#AmortizationDetailExpenseAttributeDisable').text("無資料")
    }

    //Setting Value End

    $template.find('#AmortizationDetailRatioInput').bind('change', recalculateAmortizationRatio);
    $template.find('#OriginalAmortizationAmountInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', recalculateAmortizationRatiobyMoney);
    $('#AmortizationDetailTable').append($template);

    TableBindingSetting($('#AmortizationDetailTable'), 'AmortizationDetail');
}
function AmortizationTemplateDropSet(template) {
    $.each(_coaCompanyAndDepartmentCollection, function (index, item) {
        template.find('#AmortizationDetailCostProfitCenterSelect').append('<option value="' + item.department + '" taxApplication="' + item.taxApplication + '">' + item.department + ' ' + item.description + '</option>')
    })
    if (typeof (Array.prototype.find) == "function") {
        try {
            template.find('#AmortizationDetailCostProfitCenterNameInput').val(_coaCompanyAndDepartmentCollection.find(function (element) {
                return element.department == template.find('#AmortizationDetailCostProfitCenterSelect').val()
            }).description)
        } catch (e) {
        }
    }

    $.each(_coaCompany, function (index, item) {
        template.find('#AmortizationDetailAccountBankSelect').append('<option \
                    value="' + item.company + '" \
                    gvDeclaration="' + item.gvdeclaration + '">' + item.company + ' ' + item.description + '</option>')
    })
    if (typeof (Array.prototype.find) == "function") {
        try {
            template.find('#AmortizationDetailAccountBankNameInput').val(_coaCompany.find(function (element) { return element.company == template.find('#AmortizationDetailAccountBankSelect').val() }).description)
        } catch (e) {
        }
    }
    $.each(_coaDepartmentProduct, function (index, item) {
        template.find('#AmortizationDetailProductKindSelect').append('<option value="' + item.product + '" description="' + item.description + '">' + item.product + ' ' + item.description + '</option>')
    })
    template.find('#AmortizationDetailProductKindSelect').prepend('<option value selected>請選擇</option>')
    if (!(template.find('#AmortizationDetailExpenseAttributeSelect') == undefined)) {
        $.each(_expenseAttribute, function (index, item) {
            template.find('#AmortizationDetailExpenseAttributeSelect').append('<option value="' + index + '">' + index + ' ' + item + '</option>')
        })
    }
    return template;
}
function recalculateAmortizationRatio(e) {
    AccountUnFormat()
    var $this;
    if ($('#AmortizationDetailTable').length < 1) {
        AccountFormat()
        return;
    }
    if (e == undefined) {
        $this = $('#AmortizationDetailTable')
    } else {
        $this = $(e.target).parents('table');
    }
    //==========================================
    // 計算分攤比率總合為100
    //==========================================
    var maxAmortizationRatio = 100;
    var countAmortizationDetail = $this.find('tbody').length;
    $($this.find('.AmortizationRatioCal')[countAmortizationDetail - 1]).val(0);
    $.each($this.find('.AmortizationRatioCal'), function (index, item) {
        if ($(item).val() > 100 || $(item).val() < 0) {
            alertopen('分攤比率輸入錯誤');
            $(item).val(0)
            return;
        }
        if (maxAmortizationRatio - $(item).val() < 0) {
            alertopen("分攤比率已大於100,請重新分配");
            $(item).val(0);
            return;
        }
        if (index + 1 == countAmortizationDetail) {
            $(item).val(MathRoundExtension(maxAmortizationRatio, 2));
        } else {
            $(item).val(MathRoundExtension($(item).val(), 2));
            maxAmortizationRatio -= $(item).val();
        }
    })
    var ENPDetail = $('#ENPDetailTable').find('tbody');

    //==========================================
    // 分攤明細金額異動
    //==========================================
    //不可扣抵:依照原金額
    if (!_invoiceCanBeDeductible) {
        var OriginalAmount = [];
        var TWDAmount = [];
        var OriginalAmountTotal = 0;
        var TWDAmountTotal = 0;
        $.each(ENPDetail, function (index, item) {
            OriginalAmount.push(parseFloat($(item).find('#enpOriginalAmountInput').val()));
            TWDAmount.push(parseInt($(item).find('#enpTWDAmountDisable').text()));
            OriginalAmountTotal += OriginalAmount[index];
            TWDAmountTotal += TWDAmount[index];
        });
        $.each($this.find('tbody'), function (index, item) {
            var AmortizationAmount = 0;
            var AmortizationTWDAmount = 0;
            if (index + 1 == countAmortizationDetail) {
                $(item).find('#OriginalAmortizationAmountInput').val(MathRoundExtension(OriginalAmountTotal, parseInt($('#CurrencyPrecisionDisable').text())));
                $(item).find('#OriginalAmortizationTWDAmountDisable').text(TWDAmountTotal)
                $(item).find('#OriginalAmortizationTWDAmountInput').val(TWDAmountTotal);
                return;
            }
            for (var i = 0; i < ENPDetail.length; i++) {
                AmortizationAmount += OriginalAmount[i] * ($(item).find('#AmortizationDetailRatioInput').val() / 100);
                AmortizationTWDAmount += TWDAmount[i] * ($(item).find('#AmortizationDetailRatioInput').val() / 100);
                AmortizationTWDAmount = Math.round(AmortizationTWDAmount)
            }
            OriginalAmountTotal -= MathRoundExtension(AmortizationAmount, parseInt($('#CurrencyPrecisionDisable').text()));
            TWDAmountTotal -= AmortizationTWDAmount;
            $(item).find('#OriginalAmortizationAmountInput').val(MathRoundExtension(AmortizationAmount, parseInt($('#CurrencyPrecisionDisable').text())));
            $(item).find('#OriginalAmortizationTWDAmountDisable').text(AmortizationTWDAmount);
            $(item).find('#OriginalAmortizationTWDAmountInput').val(AmortizationTWDAmount);
        });
    }
        //可扣抵:依照銷售額
    else {
        var OriginalSaleAmount = [];
        var TWDSaleAmount = [];
        var OriginalSaleAmountTotal = 0;
        var TWDSaleAmountTotal = 0;
        $.each(ENPDetail, function (index, item) {
            OriginalSaleAmount.push(parseFloat($(item).find('#enpOriginalSaleAmountDisable').text()));
            TWDSaleAmount.push(parseInt($(item).find('#enpTWDSaleAmountDisable').text()));
            OriginalSaleAmountTotal += OriginalSaleAmount[index];
            TWDSaleAmountTotal += TWDSaleAmount[index];
        });
        $.each($this.find('tbody'), function (index, item) {
            var AmortizationAmount = 0;
            var AmortizationTWDSaleAmount = 0;
            if (index + 1 == countAmortizationDetail) {
                $(item).find('#OriginalAmortizationAmountDisable').val(MathRoundExtension(OriginalSaleAmountTotal, parseInt($('#CurrencyPrecisionDisable').text())));
                $(item).find('#OriginalAmortizationAmountInput').val(MathRoundExtension(OriginalSaleAmountTotal, parseInt($('#CurrencyPrecisionDisable').text())));
                $(item).find('#OriginalAmortizationTWDAmountDisable').text(TWDSaleAmountTotal)
                $(item).find('#OriginalAmortizationTWDAmountInput').val(TWDSaleAmountTotal);
                return;
            }
            for (var i = 0; i < ENPDetail.length; i++) {
                AmortizationAmount += OriginalSaleAmount[i] * ($(item).find('#AmortizationDetailRatioInput').val() / 100);
                AmortizationTWDSaleAmount += Math.round(TWDSaleAmount[i] * ($(item).find('#AmortizationDetailRatioInput').val() / 100));
                AmortizationTWDSaleAmount = Math.round(AmortizationTWDSaleAmount)
            }
            OriginalSaleAmountTotal -= MathRoundExtension(AmortizationAmount, parseInt($('#CurrencyPrecisionDisable').text()));
            TWDSaleAmountTotal -= AmortizationTWDSaleAmount;
            $(item).find('#OriginalAmortizationAmountDisable').text(MathRoundExtension(AmortizationAmount, parseInt($('#CurrencyPrecisionDisable').text())));
            $(item).find('#OriginalAmortizationAmountInput').val(MathRoundExtension(AmortizationAmount, parseInt($('#CurrencyPrecisionDisable').text())));
            $(item).find('#OriginalAmortizationTWDAmountDisable').text(AmortizationTWDSaleAmount);
            $(item).find('#OriginalAmortizationTWDAmountInput').val(AmortizationTWDSaleAmount);
        });
    }
    AccountFormat()
}
function recalculateAmortizationRatiobyMoney(e) {
    AccountUnFormat()
    var $this;
    if ($('#AmortizationDetailTable').length < 1) {
        AccountFormat()
        return;
    }
    if (e == undefined) {
        $this = $('#AmortizationDetailTable')
    } else {
        $this = $(e.target).parents('table');
    }
    var ENPDetail = $('#ENPDetailTable').find('tbody');
    var AmortizationDetail = $('#AmortizationDetailTable').find('tbody');
    //不可扣抵:依照原金額
    if (!_invoiceCanBeDeductible) {
        var totalAmountInENPDetail = 0;
        var totalAmountInAmoritization = 0;
        var totalTWDAmountInENPDetail = 0;
        var totalTWDAmountInAmoritization = 0;

        $.each(ENPDetail, function (index, item) {
            totalAmountInENPDetail += parseFloat($(item).find('#enpOriginalAmountInput').val());
            totalTWDAmountInENPDetail += parseInt($(item).find('#enpTWDAmountInput').val());
        });
        if (!_moneyNegative && e != undefined && $(e.target).val() > totalAmountInENPDetail) {
            alertopen('錯誤：輸入金額大於請款明細層金額總計，請重新輸入');
            $(e.target).val(_previousAmount);
            AccountFormat()
            return;
        }
        if (_moneyNegative && e != undefined && $(e.target).val() < totalAmountInENPDetail) {
            alertopen('錯誤：輸入金額大於請款明細層金額總計，請重新輸入');
            $(e.target).val(_previousAmount);
            AccountFormat()
            return;
        }
        //計算各明細之分攤比率
        totalAmountInAmoritization = totalAmountInENPDetail;
        totalTWDAmountInAmoritization = totalTWDAmountInENPDetail;

        $.each(AmortizationDetail, function (index, item) {
            if (index + 1 == AmortizationDetail.length) {
                $(item).find('#OriginalAmortizationAmountInput').val(totalAmountInAmoritization);
                $(item).find('#OriginalAmortizationTWDAmountDisable').text(totalTWDAmountInAmoritization)
                $(item).find('#OriginalAmortizationTWDAmountInput').val(totalTWDAmountInAmoritization);
                $(item).find('#AmortizationDetailRatioInput').val(MathRoundExtension(totalAmountInAmoritization * 100 / totalAmountInENPDetail, 2));
                return;
            }
            if (!_moneyNegative && totalAmountInAmoritization - $(item).find('#OriginalAmortizationAmountInput').val() < 0) {
                alertopen('錯誤：分攤金額總和已大於請款明細層金額總計，請調整各項金額後再輸入');
                $(item).find('#OriginalAmortizationAmountInput').val(0)
                $(item).find('#AmortizationDetailRatioInput').val(0)
                return;
            }
            if (_moneyNegative && totalAmountInAmoritization - $(item).find('#OriginalAmortizationAmountInput').val() > 0) {
                alertopen('錯誤：分攤金額總和已大於請款明細層金額總計，請調整各項金額後再輸入');
                $(item).find('#OriginalAmortizationAmountInput').val(0)
                $(item).find('#AmortizationDetailRatioInput').val(0)
                return;
            }
            var thisValue = $(item).find('#OriginalAmortizationAmountInput').val();
            var thisAmortizationRatio = MathRoundExtension(thisValue * 100 / totalAmountInENPDetail, 2);
            var thisTWDValue = Math.round(totalTWDAmountInENPDetail * (thisValue / totalAmountInENPDetail))

            $(item).find('#OriginalAmortizationAmountDisable').text(thisValue);
            $(item).find('#OriginalAmortizationTWDAmountDisable').text(thisTWDValue);
            $(item).find('#OriginalAmortizationTWDAmountInput').val(thisTWDValue);

            totalAmountInAmoritization -= thisValue;
            totalTWDAmountInAmoritization -= thisTWDValue
            $(item).find('#AmortizationDetailRatioInput').val(thisAmortizationRatio);
        });
    }
        //可扣抵:依照銷售額
    else {
        var totalSaleAmountInENPDetail = 0;
        var totalSaleAmountInAmoritization = 0;
        var totalTWDSaleAmountInENPDetail = 0;
        var totalTWDSaleAmountInAmoritization = 0;

        $.each(ENPDetail, function (index, item) {
            totalSaleAmountInENPDetail += parseFloat($(item).find('#enpOriginalSaleAmountDisable').text());
            totalTWDSaleAmountInENPDetail += parseInt($(item).find('#enpTWDSaleAmountDisable').text());
        });
        if (!_moneyNegative && e != undefined && $(e.target).val() > totalSaleAmountInENPDetail) {
            alertopen('錯誤：輸入金額大於請款明細層金額總計，請重新輸入');
            $(e.target).val(_previousAmount);
            AccountFormat()
            return;
        }
        if (_moneyNegative && e != undefined && $(e.target).val() < totalSaleAmountInENPDetail) {
            alertopen('錯誤：輸入金額大於請款明細層金額總計，請重新輸入');
            $(e.target).val(_previousAmount);
            AccountFormat()
            return;
        }
        //計算各明細之分攤比率
        totalSaleAmountInAmoritization = totalSaleAmountInENPDetail;
        totalTWDSaleAmountInAmoritization = totalTWDSaleAmountInENPDetail;

        $.each(AmortizationDetail, function (index, item) {
            if (index + 1 == AmortizationDetail.length) {
                $(item).find('#OriginalAmortizationAmountInput').val(totalSaleAmountInAmoritization);
                $(item).find('#OriginalAmortizationTWDAmountDisable').text(totalTWDSaleAmountInAmoritization);
                $(item).find('#OriginalAmortizationTWDAmountInput').val(totalTWDSaleAmountInAmoritization);
                $(item).find('#AmortizationDetailRatioInput').val(MathRoundExtension(totalSaleAmountInAmoritization * 100 / totalSaleAmountInENPDetail, 2));
                return;
            }
            if (!_moneyNegative && totalSaleAmountInAmoritization - $(item).find('#OriginalAmortizationAmountInput').val() < 0) {
                alertopen('錯誤：分攤金額總和已大於請款明細層金額總計，請調整各項金額後再輸入');
                $(item).find('#OriginalAmortizationAmountInput').val(0)
                $(item).find('#AmortizationDetailRatioInput').val(0)
                return;
            }
            if (_moneyNegative && totalSaleAmountInAmoritization - $(item).find('#OriginalAmortizationAmountInput').val() > 0) {
                alertopen('錯誤：分攤金額總和已大於請款明細層金額總計，請調整各項金額後再輸入');
                $(item).find('#OriginalAmortizationAmountInput').val(0)
                $(item).find('#AmortizationDetailRatioInput').val(0)
                return;
            }
            var thisValue = $(item).find('#OriginalAmortizationAmountInput').val();
            var thisAmortizationRatio = MathRoundExtension(thisValue * 100 / totalSaleAmountInENPDetail, 2);
            var thisTWDValue = Math.round(totalTWDSaleAmountInENPDetail * (thisValue / totalSaleAmountInENPDetail));

            $(item).find('#OriginalAmortizationAmountDisable').text(thisValue);
            $(item).find('#OriginalAmortizationTWDAmountDisable').text(thisTWDValue);
            $(item).find('#OriginalAmortizationTWDAmountInput').val(thisTWDValue);

            totalSaleAmountInAmoritization -= thisValue;
            totalTWDSaleAmountInAmoritization -= thisTWDValue;

            $(item).find('#AmortizationDetailRatioInput').val(thisAmortizationRatio);
        });
    }
    AccountFormat()
}
function AmortizationUpload(e) {
    if (e.target != undefined) {
        e = e.target;
    }
    var data = new FormData();
    data.append(0, $(e)[0].files[0])

    //請款明細層各項明細判定是否有貼標為不可扣抵之項目
    var detailDeductible = true;
    $.each($('#ENPDetailTable tbody'), function (index, item) {
        //判定費用項目是否被貼標為不可扣抵
        if ($(item).find('input#Deductible').val() == "false") {
            detailDeductible = false;
        }
    })
    //金額(含稅)
    var amountWithTax = accounting.unformat($('#CertificateAmountInput').val());
    //金額(不含稅)
    var amountWithoutTax = accounting.unformat($('#CertificateAmountInput').val()) - accounting.unformat($('#OriginalAmountInput').val())

    $.ajax({
        headers: {
            "detailDeductible": detailDeductible,
            "amountWithTax": amountWithTax,
            "amountWithoutTax": amountWithoutTax,
            "amountNegative": _moneyNegative
        },
        async: false,
        type: 'POST',
        data: data,
        dataType: 'json',
        contentType: false,
        processData: false,
        url: '/Import/UploadAmoritizationDetail/',
        success: function (data) {
            if (data.ajaxResult && data.ajaxReturn.length > 0) {
                $.each($('#AmortizationDetailTable tbody'), function (index, item) {
                    if ($(item).find('#ADetailID').val() != 0) {
                        $('#InformationZone').append('<input type="hidden" name="AmortizationDetail.Index" value="' + $(item).find('#ADetailID').val() + '">')
                        $('#InformationZone').append('<input type="text" hidden name="AmortizationDetail[' + $(item).find('#ADetailID').val() + '].ADetailID" value="' + $(item).find('#ADetailID').val() + '">')
                        $('#InformationZone').append('<input type="text" hidden name="AmortizationDetail[' + $(item).find('#ADetailID').val() + '].IsDelete" value="true">')
                    }
                })
                $('#AmortizationDetailTable tbody').remove();
                $.each(data.ajaxReturn, function (index, item) {
                    _amImport = true;
                    AmortizationDetailDataAppend(item)
                })
                var ratioTotal = 0;
                $.each($('.AmortizationRatioCal'), function (index, item) {
                    ratioTotal += $(item).val()
                })
                judgeInvoiceDeductible(false)
                ratioTotal != 0 ? recalculateAmortizationRatio() : recalculateAmortizationRatiobyMoney()
            }
            if (!data.ajaxResult) {
                alertopen(data.ajaxReturn);
            }
        },
        error: function (data) {
            console.log(data);
        }
    })
}
//==============================================================================================
// 預付款充銷層 - 建立/新增(有資料)/金額計算
//==============================================================================================
function CreatePrepaymentTable() {
    if ($('#undone-vendorSelect').length > 0) {
        $('#undone-vendorSelect').hide();
        $('#PrepaymentTable').remove();
        var $template = $('#PrepaymentTableTemplate').clone().attr('id', 'PrepaymentTable');
        $template.find('tbody').remove()
        $('div#PrepaymentRoot').append($template);
        $('#PrepaymentTable').show();
    }
}
function PrepaymentDetailAppend(data) {
    var count = $('#PrepaymentTable tbody').length;
    var $template = $('#PrepaymentDetailTemplate').clone().attr('id', 'PrepaymentDetail_' + count);

    //Setting Value
    //Table Layer 1
    $template.find('#PreID').val(data.PreID);

    $template.find('#PrepaymentNumDisable').text(data.PrepaymentNum);
    $template.find('#PrepaymentNumInput').val(data.PrepaymentNum);

    $template.find('#PrepaymentAmountDisable').text(data.PrepaymentAmount);
    $template.find('#PrepaymentAmountInput').val(data.PrepaymentAmount);

    $template.find('#UnWriteOffAmountDisable').text(data.UnWriteOffAmount);
    $template.find('#UnWriteOffAmountInput').val(data.UnWriteOffAmount);

    $template.find('#WriteOffAmountDisable').text(data.WriteOffAmount);
    $template.find('#WriteOffAmountInput').val(data.WriteOffAmount);

    //Setting Value End

    $('#PrepaymentTable').append($template);
    $('.PrepaymentMoney').on('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', PrepaymentAmountCal);
    TableBindingSetting($('#PrepaymentTable'), 'Prepayment');
}
function PrepaymentAmountCal(e) {
    AccountUnFormat()
    if (e == undefined) {
        return;
    }
    var $this = $(e.target).parents('tr');
    if ($(e.target).val() < 0) {
        alertopen('沖銷金額不得小於零');
        $(e.target).val(_previousAmount);
        AccountFormat()
        return;
    }
    if (MathRoundExtension($($this).find('#UnWriteOffAmountDisable').text(), parseInt($('#CurrencyPrecisionDisable').text())) < MathRoundExtension($(e.target).val(), parseInt($('#CurrencyPrecisionDisable').text()))) {
        alertopen("沖銷金額不得大於未沖銷金額，請修正");
        $(e.target).val(_previousAmount);
        AccountFormat()
        return;
    }
    var enpDetail = $('#ENPDetailTable');
    var enpDetailTotalAmount = 0;
    var prepaymentReverseTotal = 0;
    $.each($('#PrepaymentTable tbody #WriteOffAmountInput'), function (index, item) {
        prepaymentReverseTotal += MathRoundExtension(parseFloat($(item).val()), parseInt($('#CurrencyPrecisionDisable').text()));
    })

    $.each($(enpDetail).find('tbody'), function (index, item) {
        enpDetailTotalAmount += MathRoundExtension(parseFloat($(item).find('#enpOriginalAmountInput').val()), parseInt($('#CurrencyPrecisionDisable').text()));
    });
    if (prepaymentReverseTotal > enpDetailTotalAmount) {
        alertopen('沖銷金額總和不可大於請款明細層總和，請修正')
        $(e.target).val(_previousAmount);
    }
    AccountFormat();
}
//==============================================================================================
// 所得稅申報層 - 資料載入/資料載入判斷/金額計算/更改所得代碼，帶出其性值判斷何為必填
//==============================================================================================
function IncomeTaxDataLoading(data) {
    //Setting Value
    //Table Layer 1
    $('#IncomeID').val(data.IncomeID)
    $('#IncomeNumDisable').text(data.IncomeNum);
    $('#IncomeNumInput').val(data.IncomeNum);
    $('#IncomePersonDisable').text(data.IncomePerson);
    $('#IncomePersonInput').val(data.IncomePerson);
    $('#IsTwoHealthInsuranceDisable').text(data.IsTwoHealthInsurance)
    $('#IsTwoHealthInsuranceSelect').selectpicker('refresh');
    $('#IsTwoHealthInsuranceSelect').val(data.IsTwoHealthInsurance);
    $('#IsTwoHealthInsuranceSelect').selectpicker('refresh');
    judgeIncomeTableValue(data.LeaseTax, 'LeaseTaxDisable', 'LeaseTaxInput');
    judgeIncomeTableValue(data.LeaseAddress, 'LeaseAddressDisable', 'LeaseAddressInput');

    //Table Layer 2
    judgeIncomeTableValue(data.PermanentPostNum, 'PermanentPostNumDisable', 'PermanentPostNumInput');
    judgeIncomeTableValue(data.PermanentAddress, 'PermanentAddressDisable', 'PermanentAddressInput');
    judgeIncomeTableValue(data.ContactPostNum, 'ContactPostNumDisable', 'ContactPostNumInput');
    judgeIncomeTableValue(data.ContactAddress, 'ContactAddressDisable', 'ContactAddressInput');

    //Table Layer 3、4、5、6
    judgeIncomeTableValue(data.CertficateKind, 'CertficateKindDisable', 'CertficateKindSelect');
    $('#CertficateKindSelect').selectpicker('refresh');
    if (data.IncomeCode != null) {
        judgeIncomeTableValue(data.IncomeCode, 'IncomeCodeDisable', 'IncomeCodeCode');
        $('#IncomeCodeDisable').text(data.IncomeCode + ' - ' + CodeGetOptionText('IncomeCode', data.IncomeCode))
    } else {
        judgeIncomeTableValue($('#taxCode').val(), 'IncomeCodeDisable', 'IncomeCodeCode');
        $('#IncomeCodeDisable').text($('#taxCode').val() + ' - ' + CodeGetOptionText('IncomeCode', $('#taxCode').val()))
    }
    judgeIncomeTableValue(data.TwoHeathInsuranceFlag, 'TwoHeathInsuranceFlagDisable', 'TwoHeathInsuranceFlagInput')
    IncomeCodeFormat();
    judgeIncomeTableValue(data.WriterIncomeNum, 'WriterIncomeNumDisable', 'WriterIncomeNumSelect');
    $('#WriterIncomeNumSelect').selectpicker('refresh');
    judgeIncomeTableValue(data.OtherIncomNum, 'OtherIncomNumDisable', 'OtherIncomNumSelect');
    $('#OtherIncomNumSelect').selectpicker('refresh');
    judgeIncomeTableValue(data.ProfeesionalKind, 'ProfeesionalKindDisable', 'ProfeesionalKindSelect');
    $('#ProfeesionalKindSelect').selectpicker('refresh');

    //Table Layer 7、8
    judgeIncomeTableValue(data.LeaseTaxCode, 'LeaseTaxCodeDisable', 'LeaseTaxCodeSelect');
    $('#LeaseTaxCodeSelect').selectpicker('refresh');
    if (data.CountryCode != null) {
        judgeIncomeTableValue(data.CountryCode, 'CountryCodeDisable', 'CountryCodeCode');
        $('#CountryCodeDisable').text(data.CountryCode + ' - ' + CodeGetOptionText('CountryCode', data.CountryCode))
    } else {
        $('#CountryCodeDisable').text("無資料")
    }

    $('#NetPaymentDisable').text(data.NetPayment);
    $('#NetPaymentInput').val(data.NetPayment);
    $('#WithholdingTaxDisable').text(data.WithholdingTax)
    $('#WithholdingTaxInput').val(data.WithholdingTax);
    $('#SupplementPremiumDisable').text(data.SupplementPremium);
    $('#SupplementPremiumInput').val(data.SupplementPremium);
}
function judgeIncomeTableValue(data, disableTag, inputTag) {
    if (data != null) {
        $('#' + inputTag).val(data);
        if (inputTag.includes("Select")) {
            $('#' + disableTag).text($('#' + inputTag).find('option:selected').text());
        } else {
            $('#' + disableTag).text(data);
        }
    } else {
        $('#' + disableTag).text('無資料');
    }
}
function IncomeTaxCal() {
    if ($('#P_CurrentStep').val() != "3" || !$('#Deduction').prop('checked')) {
        return;
    }

    AccountUnFormat()
    var wtTax = {
        sourceCode: "ENP",
        sourceKeyId: $('#DocNum').text(),
        wtIdentityType: $('#CertficateKindSelect').val(),
        wtTaxCode: $('#IncomeCodeCode').val(),
        detail: []
    }
    var $enpDetail = $('#ENPDetailTable').find('tbody');
    //var detailNeedcal = [];
    $.each($enpDetail, function (index, item) {
        if ($(item).find('#enpIsIncomeDeductionSelect').val() != "true") {
            return;
        }
        var enpdetailData = {
            lineNumber: 0,
            lineAmount: 0,
            lineWTFlag: "N",
            twoNhiYn: $('#IsTwoHealthInsuranceSelect').val()
        };
        enpdetailData.lineWTFlag = "Y"
        enpdetailData.lineNumber = parseInt($(item).find("#LineNum").val());
        enpdetailData.lineAmount = $(item).find('#enpTWDAmountInput').val();
        wtTax.detail.push(enpdetailData);
    })
    $.ajax({
        async: false,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(wtTax),
        contentType: "application/json",
        url: '/ENP/validateWtTax/',
        success: function (data) {
            $('#WithholdingTaxInput').val(data.wt);
            $('#NetPaymentInput').val(data.pa);
            $('#SupplementPremiumInput').val(data.tnp)
        },
        error: function (data) {
            FiisFatalFail();
        }
    })

    var CerficateKind = $('#CertficateKindSelect').val();
    if (CerficateKind == "5" || CerficateKind == "6" || CerficateKind == "7" || CerficateKind == "8" || CerficateKind == "9") {
        $('#CountryCode').show()
    } else {
        $('#CountryCode').hide()
        $('#CountryCodeDisable').text("無資料");
        $('#CountryCodeCode').val("")
    }

    AccountFormat()
}
function IncomeCodeFormat() {
    var incomeCode = $('#IncomeCodeCode').val();
    if (incomeCode == undefined || incomeCode == "") {
        return;
    }
    $.each(_wtTaxFormat, function (index, item) {
        if (item.key == incomeCode) {
            if (item.value != null) {
                $('#IncomeCodeFormat').val(item.value)
            } else {
                $('#IncomeCodeFormat').val("")
            }
        }
    })
    if (incomeCode != "53" && $('#P_CurrentStep').val() == "3") {
        $('#LeaseTaxCodeDisable').text("");
        $('#LeaseTaxCodeSelect').val("").selectpicker('refresh');
        SwitchHideDisplay([$('#LeaseTaxCodeSelect')], [$('#LeaseTaxCodeDisable')])
    } else {
        SwitchHideDisplay([$('#LeaseTaxCodeDisable')], [$('#LeaseTaxCodeSelect')])
    }
}
//==============================================================================================
// 營業稅申報區塊 新增欄位/將資料載入/判定扣抵否改變
//==============================================================================================
function BusinessTax() {
    AccountUnFormat();
    $('#BTCertificateAmountDisable').text($('input#TWDAmountInput').val());
    $('#BTCertificateAmountInput').val($('input#TWDAmountInput').val());
    var twd = accounting.unformat($('input#TWDAmountInput').val())
    var twdTax = accounting.unformat($('input#TWDPayAmountInput').val())
    AccountFormat($('#TaxableInput').val(twd - twdTax));
    AccountFormat($('#TaxAmountInput').val(twdTax));
    AccountFormat($('#TaxableDisable').text(twd - twdTax));
    AccountFormat($('#TaxAmountDisable').text(twdTax));
    if (_businessTaxReCal) {
        _businessTaxReCal = false;
        return;
    }
    $('#BusinessNumDisable').text($('#IDNoInput').val());
    $('#BusinessNumInput').val($('#IDNoInput').val())
    $('#BTCertificateNumDisable').text($('#CertificateNumInput').val());
    $('#BTCertificateNumInput').val($('#CertificateNumInput').val());
    $('#BTCertificateDateDisable').text($('#EstimateVoucherDateInput').find('input').val());
    $('#BTCertificateDateInput').val($('#EstimateVoucherDateInput').find('input').val());
    if ($('#BTIsDeductionSelect').val() == "") {
        if (_invoiceCanBeDeductible) {
            $('#BTIsDeductionSelect').val('Y')
            _invoiceCanBeDeductibleTopAuth = 1;
        } else {
            $('#BTIsDeductionSelect').val('N')
            _invoiceCanBeDeductibleTopAuth = 2
        }
    }
    //非折讓類預設格式別21，折讓類預設23
    if ($('#ExpenseKindSelect').val() != 'NPO_CM_EXP') {
        $('#BTFormatKindSelect').val(21)
    } else {
        $('#BTFormatKindSelect').val(23)
    }
    $('#BTFormatKindSelect').selectpicker('refresh');
    //若格式別不為22，費用(銷售額)為總額-稅額，費用(稅額)為稅額。若為22，費用(銷售額)為總額*(1-0.05/1.05)，稅額為總額-應稅
    if (parseInt(($('#BTFormatKindSelect').val())) != 22) {
        var twd = accounting.unformat($('input#TWDAmountInput').val())
        var twdTax = accounting.unformat($('input#TWDPayAmountInput').val())
        AccountFormat($('#TaxableInput').val(twd - twdTax));
        AccountFormat($('#TaxAmountInput').val(twdTax));
        AccountFormat($('#TaxableDisable').text(twd - twdTax));
        AccountFormat($('#TaxAmountDisable').text(twdTax));
    } else {
        var twd = accounting.unformat($('input#TWDAmountInput').val())
        var twdcal = Math.round(twd * (1 - 0.05 / 1.05));
        AccountFormat($('#TaxableInput').val(twdcal));
        AccountFormat($('#TaxAmountInput').val(twd - twdcal));
        AccountFormat($('#TaxableDisable').text(twdcal));
        AccountFormat($('#TaxAmountDisable').text(twd - twdcal));
    }
    $('#BTIsDeductionSelect').selectpicker('refresh');
    var iscreditcardoffice = $('#VoucherBeauSelect option:selected').attr('iscreditcardoffice')
    if (iscreditcardoffice == 'Y') {
        $('#isCreditCardOffice').val(iscreditcardoffice);
        $('.BeauCreditCardOpen').show()
    }
    var businessTax = _businessDetail
    if (businessTax != null && businessTax.BusinessID != 0) {
        BusinessTaxDataLoading(businessTax);
    }
}
function BusinessTaxDataLoading(data) {
    //Table Layer 1
    $('#BusinessID').val(data.BusinessID)
    if (data.BusinessNum != null) {
        $('#BusinessNumInput').val(data.BusinessNum);
        $('#BusinessNumDisable').text(data.BusinessNum)
    }
    if (data.IsDeduction != null) {
        $('#systemJudgeDeductibleInput').val(data.IsDeduction)
        $('#BTIsDeductionDisable').text(data.IsDeduction)
        $('#BTIsDeductionSelect').val(data.IsDeduction)
        if (data.IsDeduction == "Y") {
            _invoiceCanBeDeductibleTopAuth = 1;
        } else {
            _invoiceCanBeDeductibleTopAuth = 2;
        }
        $('#BTIsDeductionSelect').selectpicker('refresh')
        judgeInvoiceDeductible(false)
    }
    var twd = accounting.unformat($('input#TWDAmountInput').val())
    var twdTax = accounting.unformat($('input#TWDPayAmountInput').val())
    //若其於稅額有值，則為更動過的資料，改為DB來源
    if (data.AssetsSaleAmount != 0 || data.AssetsTaxAmount != 0 || data.TaxFree != 0 || data.ZeroTax != 0 || data.OtherAmount != 0) {
        $('#AssetsSaleAmountDisable').text(data.AssetsSaleAmount);
        $('#AssetsSaleAmountInput').val(data.AssetsSaleAmount)
        $('#AssetsTaxAmountDisable').text(data.AssetsTaxAmount);
        $('#AssetsTaxAmountInput').val(data.AssetsTaxAmount)
        //Table Layer 2
        $('#TaxableDisable').text(data.Taxable);
        $('#TaxableInput').val(data.Taxable)
        $('#TaxAmountDisable').text(data.TaxAmount);
        $('#TaxAmountInput').val(data.TaxAmount)
        $('#TaxFreeDisable').text(data.TaxFree);
        $('#TaxFreeInput').val(data.TaxFree)
        $('#ZeroTaxDisable').text(data.ZeroTax);
        $('#ZeroTaxInput').val(data.ZeroTax)
        $('#OtherAmountDisable').text(data.OtherAmount);
        $('#OtherAmountInput').val(data.OtherAmount)
    }
    if (data.FormatKind != null) {
        $('#BTFormatKindSelect').val(data.FormatKind);
        $('#BTFormatKindSelect').selectpicker('refresh');
        $('#BTFormatKindDisable').text($('#BTFormatKindSelect option:selected').text());
    }
    //Table Layer3
    if (data.TaxCategory != null) {
        $('#TaxCategorySelect').val(data.TaxCategory)
        $('#TaxCategorySelect').selectpicker('refresh');
        $('#TaxCategoryDisable').text($('#TaxCategorySelect option:selected').text())
    }

    IsDeductionHighAuthChange();
    AccountFormat();
}
function IsDeductionHighAuthChange(e) {
    var isDeduction = $('#BTIsDeductionSelect').val();
    if (isDeduction == "Y") {
        _invoiceCanBeDeductibleTopAuth = 1
    } else {
        _invoiceCanBeDeductibleTopAuth = 2
    }
    if (e != undefined && $(e.currentTarget).attr('id') == 'BTIsDeductionSelect') {
        judgeInvoiceDeductible();
    }
}
//==============================================================================================
// 捐贈/贊助區塊 資料載入
//==============================================================================================
function DonateDataLoading(data) {
    var $donateTable = $('#DonateTable');
    //Table Layer 1
    if (data.ReceiveDepName != null) {
        $donateTable.find('#dnReceiveDepNameInput').val(data.ReceiveDepName);
        $donateTable.find('#dnReceiveDepNameDisable').text(data.ReceiveDepName);
    } else {
        $donateTable.find('#dnReceiveDepNameDisable').text("無資料");
    }
    if (data.ReceiveAddress != null) {
        $donateTable.find('#dnReceiveAddressInput').val(data.ReceiveAddress);
        $donateTable.find('#dnReceiveAddressDisable').text(data.ReceiveAddress);
    } else {
        $donateTable.find('#dnReceiveAddressDisable').text("無資料");
    }
    if (data.ReceiveNum != null) {
        $donateTable.find('#dnReceiveNumInput').val(data.ReceiveNum);
        $donateTable.find('#dnReceiveNumDisable').text(data.ReceiveNum);
    } else {
        $donateTable.find('#dnReceiveNumDisable').text("無資料");
    }
    if (data.ApprovedDate != null) {
        $donateTable.find('#dnApprovedDateInput').val(data.ApprovedDate);
        $donateTable.find('#dnApprovedDateDisable').text(data.ApprovedDate);
    } else {
        $donateTable.find('#dnApprovedDateDisable').text("無資料");
    }
    //End Setting
    //Table Layer 2
    if (data.ReceiveRegistered != null) {
        $donateTable.find('#dnReceiveRegisteredInput').val(data.ReceiveRegistered);
        $donateTable.find('#dnReceiveRegisteredDisable').text(data.ReceiveRegistered);
    } else {
        $donateTable.find('#dnReceiveRegisteredDisable').text("無資料");
    }
    if (data.ReceiptNum != null) {
        $donateTable.find('#dnReceiptNumInput').val(data.ReceiptNum);
        $donateTable.find('#dnReceiptNumDisable').text(data.ReceiptNum);
    } else {
        $donateTable.find('#dnReceiptNumDisable').text("無資料");
    }

    $donateTable.find('#dnRDInput').datetimepicker({
        format: 'YYYY-MM-DD', date: data.ReceiptDate
    })
    $donateTable.find('#dnReceiptDateDisable').text($('#dnRDInput').val());
    //End Setting
}
//==============================================================================================
// 幣別種類更換 - 外幣/本幣
//==============================================================================================
function ForeignCurrency() {
    SwitchHideDisplay([$('#RateDisable'), $('#BargainingCodeDisable'), $('#WithHoldingAmount'), $('#PaymentMethodSelect')], [$('#RateInput'), $('#BargainingCodeInput'), $('#PaymentMethodDisable')]);
    EnableDOMObject($('#ExportApplyAttributeSelect'));
    AppendRequired($('#BargainingCodeTitle'));
    AppendRequired($('#ExportApplyAttributeTitle'));
    _foriegnPayMethod = true;
    if (_currencyTypeChanged) {
        alertopen("外幣付款請於取得議價編碼當日內，傳送請款單及提交匯出匯款申請書至會計經辦");
        _currencyTypeChanged = false;
        if (_foriegnPayMethod) {
            $('#PaymentMethodSelect').val('WIRE').trigger('change')
        }
    }
    $('#WithHoldingAmountInput').val('');
    $('input[type="checkbox"]#Emergency').prop('checked', true).trigger('change');
}
function nForeignCurrency() {
    if (_currencyTypeChanged) {
        $('input[type="checkbox"]#Emergency').prop('checked', false).trigger('change');
        $('#PaymentMethodSelect').val(_paymentMethod).trigger('change')
    }
    SwitchHideDisplay([$('#RateInput'), $('#BargainingCodeInput'), $('#PaymentMethodDisable')], [$('#RateDisable'), $('#BargainingCodeDisable'), $('#PaymentMethodSelect')])
    if ($('#ExpenseKindSelect').val() != "NPO_CM_EXP") {
        $('#WithHoldingAmount').show(200)
    }
    _foriegnPayMethod = false;
    $('#ExportApplyAttributeSelect').val('');
    DisableDOMObject($('#ExportApplyAttributeSelect'));
    RemoveRequired($('#BargainingCodeTitle'));
    RemoveRequired($('#ExportApplyAttributeTitle'));
    _currencyTypeChanged = true;
}
//==============================================================================================
// 憑證 - 類別改變/計算有效期/憑證類別不為發票時，稅額=0/憑證日期判斷
//==============================================================================================
function CertificateKindChange() {
    $('#InvoiceOverdue').hide(200)
    $('#YearVoucher').hide(200)
    if ($('#CertificateKindSelect option:selected').val() === 'I' && $('#Deduction').prop('checked') && $('#P_CurrentStep').val() == "1") {
        alertopen('請修正：請檢核憑證類別是否輸入錯誤，此為代扣所得稅供應商');
        $('#CertificateKindSelect option[class="bs-title-option"]').prop('selected', true)
        DisableDOMObject($('#EstimateVoucherDateInput'));
        $('#CertificateKindSelect').selectpicker('refresh');
        return;
    }
    var nowMonth = $('#DataTime').val().split('-')[1];

    switch ($('#CertificateKindSelect option:selected').val()) {
        case 'I':
            SwitchHideDisplay([$('#CertificateNumDisable')], [$('#CertificateNumInput')])
            AppendRequired($('#CertificateNumTitle'));
            AppendRequired($('#EstimateVoucherDateTitle'));
            CalEffectiveDate(nowMonth, 'invoice');

            //購買國外勞務清空
            $('input#ForeignLabor').attr("checked", false)
            $('input[name="ForeignLabor"]').val(false);
            break;

        case 'C':
            SwitchHideDisplay([$('#CertificateNumInput')], [$('#CertificateNumDisable')])
            RemoveRequired($('#CertificateNumTitle'));
            RemoveRequired($('#EstimateVoucherDateTitle'));
            CalEffectiveDate(nowMonth, 'discount');
            if (_tempFlag && $('#P_CurrentStep').val() == "1") {
                alertopen("若該折讓需進行收款，請勾選折讓收款");
            }
            $('#InvoiceOverdueInput').val('')
            break;
        default:
            var enpDetail = $('#ENPDetailTable').find('tbody');
            $('.taxfield').val(0);
            $('.taxfield').text(0);
            $.each(enpDetail, function (index, item) {
                $(item).find('#enpOriginalSaleAmountDisable').text($('#enpOriginalAmountInput').val())
                $(item).find('#enpOriginalSaleAmountInput').val($('#enpOriginalAmountInput').val())
                $(item).find('#enpTWDSaleAmountDisable').text($('#enpTWDAmountInput').val())
                $(item).find('#enpTWDSaleAmountInput').val($('#enpTWDAmountInput').val())
            })
            SwitchHideDisplay([$('#CertificateNumDisable')], [$('#CertificateNumInput')])
            RemoveRequired($('#CertificateNumTitle'));
            RemoveRequired($('#EstimateVoucherDateTitle'));
            $('#InvoiceOverdueInput').val('')
    }
    EnableDOMObject($('#EstimateVoucherDateInput'))
    $('#EstimateVoucherDateInput').data("DateTimePicker").maxDate(new Date());
    recalculateAmortizationRatiobyMoney();
    EstimateVoucherDateChange()
    judgeInvoiceDeductible();
}
function CalEffectiveDate(nowMonth, type) {
    if (type == 'invoice') {
        switch (nowMonth) {
            case '01':
            case '02':
                _effectiveDate = '01,02,11,12'
                break;
            case '03':
            case '04':
                _effectiveDate = '01,02,03,04'
                break;
            case '05':
            case '06':
                _effectiveDate = '03,04,05,06'
                break;
            case '07':
            case '08':
                _effectiveDate = '05,06,07,08'
                break;
            case '09':
            case '10':
                _effectiveDate = '07,08,09,10'
                break;
            case '11':
            case '12':
                _effectiveDate = '09,10,11,12'
                break;
        }
    } else {
        switch (nowMonth) {
            case '01':
            case '02':
                _effectiveDate = '01,02'
                break;
            case '03':
            case '04':
                _effectiveDate = '03,04'
                break;
            case '05':
            case '06':
                _effectiveDate = '05,06'
                break;
            case '07':
            case '08':
                _effectiveDate = '07,08'
                break;
            case '09':
            case '10':
                _effectiveDate = '09,10'
                break;
            case '11':
            case '12':
                _effectiveDate = '11,12'
                break;
        }
    }
}
function CertificateAndTax(target) {
    var certificateKind = $('#CertificateKindSelect').val();
    if (certificateKind == "I" || certificateKind == "C") {
        return;
    }
    $(target.target).val(0);
    alertopen("憑證類別不為【發票】時，稅額為0")
    recalculateMoney()
}
function EstimateVoucherDateChange() {
    var selectDate = $('#EstimateVoucherDateInput').find('input').val();
    if (selectDate == undefined || selectDate == "") {
        return;
    }
    var year = selectDate.split('-')[0];
    var month = selectDate.split('-')[1];
    var nowYear = $('#DataTime').val().split('-')[0];
    var expiredAlert = false;
    $('#expiredInvoice').val("false")
    $('#crossYearInvoice').val("false")
    switch ($('#CertificateKind option:selected').val()) {
        case 'I':
            if (year.toString() != nowYear) {
                _alerttext.push('憑證日期已跨年，請輸入【跨年度傳票編號】');
                $('#YearVoucher').show(200)
                $('#crossYearInvoice').val("true")
                AppendRequired($('#YearVoucherTitle'));
            } else {
                RemoveRequired($('#YearVoucherTitle'));
                $('#YearVoucherInput').val('')
                $('#YearVoucher').hide(200)
                $('#crossYearInvoice').val("false")
            }
            if (!(_effectiveDate.includes(month))) {
                _alerttext.push('發票已逾申報期，請輸入發票逾期說明欄位，並傳送至單位最高主管簽核與確認。');
                $('#InvoiceOverdue').show(200)
                AppendRequired($('#InvoiceOverdueTitle'));
                $('#expiredInvoice').val("true")
                expiredAlert = true;
            }
            else {
                RemoveRequired($('#InvoiceOverdueTitle'));
                $('#InvoiceOverdue').hide(200)
                $('#expiredInvoice').val("false")
            }
            if (year.toString() != nowYear) {
                if (!(year.toString() == nowYear && (month == 11 || month == 12)) && !expiredAlert) {
                    _alerttext.push('發票已逾申報期，請輸入發票逾期說明欄位，並傳送至單位最高主管簽核與確認。');
                    AppendRequired($('#InvoiceOverdueTitle'));
                    $('#InvoiceOverdue').show(200)
                    $('#expiredInvoice').val("true")
                }
            }

            break;
        case 'C':
            if ((!_effectiveDate.includes(month) || year.toString() != nowYear) && !_tempFlag) {
                alertopen('折讓已逾申報期，請確認日期或重新開立折讓單。')
                $('#EstimateVoucherDateInput').find('input').val($('#DataTime').val());
            }
            break;
        default:
            RemoveRequired($('#CertificateNumTitle'));
            break;
    }
    if (_alerttext.length > 0 && $('#P_CurrentStep').val() == "1" && !location.pathname.toLowerCase().includes("readonly") && $('#P_Status').val() != 4) {
        alertopen(_alerttext);
    } else {
        _alerttext = [];
    }
}
//==============================================================================================
// 付款資訊區 - 帳號帶入/清空付款資訊
//==============================================================================================
function PaymentAccount(bankInfo) {
    var $AccountList = $('div#AccountSelectRemodal div#AccountList div.popup-tbody')
    $AccountList.empty();
    $.each(bankInfo, function (index, item) {
        if (item.bankAccountNumRemark == null) {
            item.bankAccountNumRemark = "　";
        }
        $AccountList.append('<li class="AccountSelect">\
                        <label class="w100 label-box">\
                            <div class="table-box w5"><input name="AccountSelector" type="radio" value="'+ item.extBankAccountId + '"></div>\
                            <div class="table-box w25 popup-PaymentDescription">' + item.bankAccountNumRemark + '</div>\
                            <div class="table-box w15 popup-PaymentBank">' + item.bankNumber + ' ' + item.bankName + '</div>\
                            <div class="table-box w10 popup-PaymentBranch">' + item.branchNumber + ' ' + item.bankBranchName + '</div>\
                            <div class="table-box w20 popup-PaymentAccount">' + item.bankAccountNumber + '</div>\
                            <div class="table-box w20 popup-PaymentName">' + item.bankAccountName + '</div>\
                        </label>\
                    </li>')
    });
}
function emptyPaymentInfo() {
    $('#RemittanceDisable').empty().append(_autoDoneTextIcon);
    $('#RemittanceSelect').val("");

    $('#BankNameDisable').empty().append(_autoDoneTextIcon);
    $('#BankNameInput').val("")
    $('#BankInput').val("")

    $('#BranchNameDisable').empty().append(_autoDoneTextIcon);
    $('#BranchNameInput').val("")
    $('#BranchInput').val("")

    $('#AccountNumDisable').empty().append(_autoDoneTextIcon);
    $('#AccountNumInput').val("")

    $('#AccountNameDisable').empty().append(_autoDoneTextIcon);
    $('#AccountDescInput').val("")

    $('#AccountDescDisable').empty().append(_autoDoneTextIcon);
    $('#AccountDescInput').val("")

    $('#BankAccountId').val("")
}

//==============================================================================================
// 表單邏輯 - 判定發票可不可扣抵邏輯
//==============================================================================================
function judgeInvoiceDeductible(e) {
    var invoiceDeductibleOri = $('#systemJudgeDeductibleInput').val()
    _invoiceCanBeDeductible = true;
    if (_invoiceCanBeDeductibleTopAuth == 1) {
        _invoiceCanBeDeductible = true;
    }
    else if (_invoiceCanBeDeductibleTopAuth == 2) {
        _invoiceCanBeDeductible = false;
    }
    else {
        if ($('#CertificateKindSelect').val() != "I") {
            _invoiceCanBeDeductible = false;
        }
        //判定憑證開立對象對應的帳務行是否為404, 2018-05-21，目前剔除此邏輯
        //if ($('#VoucherBeauSelect option:selected').attr('gvdeclaration') == "404" && false) {
        //    _invoiceCanBeDeductible = false;
        //}
        //請款明細層可不可扣抵判定
        $.each($('#ENPDetailTable tbody'), function (index, item) {
            //判定費用項目是否被貼標為不可扣抵
            if ($(item).find('input#Deductible').val() == "false") {
                _invoiceCanBeDeductible = false;
            }
        })
        //分攤明細層可不可扣抵判定
        $.each($('#AmortizationDetailTable tbody'), function (index, item) {
            //判定分攤層成本利潤中心對應帳務行是否為404
            if ($(item).find('#AmortizationDetailAccountBankSelect option:selected').attr('gvdeclaration') == "404") {
                _invoiceCanBeDeductible = false;
            }
            //判定成本利潤中心是否貼標為不可扣抵, 2018-05-21，目前剔除此邏輯
            //if ($amortizationDetail.find('#AmortizationDetailCostProfitCenterSelect option:selected').attr('taxapplication') == "N" && false) {
            //    _invoiceCanBeDeductible = false;
            //}
        })
    }
    if (!_invoiceCanBeDeductible) {
        $('#systemJudgeDeductible').text("不可扣抵")
        $('#systemJudgeDeductibleInput').val("N")
    } else {
        $('#systemJudgeDeductible').text("可扣抵")
        $('#systemJudgeDeductibleInput').val("Y")
    }
    if (typeof (e) == "boolean" && !e) {
        return;
    }
    if (invoiceDeductibleOri != $('#systemJudgeDeductibleInput').val()) {
        AccountUnFormat();
        var ratio = [];
        var amortizationTable = $('#AmortizationDetailTable tbody');
        var precision = parseInt($('#CurrencyPrecisionInput').val())
        $.each(amortizationTable, function (index, item) {
            ratio.push(parseFloat($(item).find('#AmortizationDetailRatioInput').val()));
        })
        var totalTax = 0;
        $.each($('#ENPDetailTable tbody'), function (index, item) {
            totalTax += parseFloat($(item).find('#enpOriginalTaxInput').val());
        })
        var balance = totalTax;
        if (_invoiceCanBeDeductible) {
            $.each(amortizationTable, function (index, item) {
                if (index == amortizationTable.length - 1) {
                    $(item).find('#OriginalAmortizationAmountInput').val(parseFloat($(item).find('#OriginalAmortizationAmountInput').val()) - balance);
                    return;
                }
                var taxMargin = MathRoundExtension(totalTax * (ratio[index] / 100), precision);
                $(item).find('#OriginalAmortizationAmountInput').val(parseFloat($(item).find('#OriginalAmortizationAmountInput').val()) - taxMargin);
                balance -= taxMargin;
            })
        } else {
            $.each(amortizationTable, function (index, item) {
                if (index == amortizationTable.length - 1) {
                    $(item).find('#OriginalAmortizationAmountInput').val(parseFloat($(item).find('#OriginalAmortizationAmountInput').val()) + balance);
                    return;
                }
                var taxMargin = MathRoundExtension(totalTax * (ratio[index] / 100), precision);
                $(item).find('#OriginalAmortizationAmountInput').val(parseFloat($(item).find('#OriginalAmortizationAmountInput').val()) + taxMargin);
                balance -= taxMargin;
            })
        }
        AccountFormat()
    }
    recalculateAmortizationRatiobyMoney()
}

//==============================
// 移除請款資訊...等資料
//==============================
function removeAllData() {
    var enpTable = $('#ENPDetailTable')
    $.each(enpTable.find('tbody'), function (index, item) {
        if ($(item).find('#LineNum').val() != 0) {
            $('#InformationZone').append('<input type="hidden" name="ENPDetail.Index" value="' + $(item).find('#LineNum').val() + '">')
            $('#InformationZone').append('<input type="text" hidden name="ENPDetail[' + $(item).find('#LineNum').val() + '].LineNum" value="' + $(item).find('#LineNum').val() + '">')
            $('#InformationZone').append('<input type="text" hidden name="ENPDetail[' + $(item).find('#LineNum').val() + '].IsDelete" value="true">')
        }
    })
    enpTable.remove();

    var amoritizationTable = $('#AmortizationDetailTable');
    $.each(amoritizationTable.find('tbody'), function (index, item) {
        if ($(item).find('#ADetailID').val() != 0) {
            $('#InformationZone').append('<input type="hidden" name="AmortizationDetail.Index" value="' + $(item).find('#ADetailID').val() + '">')
            $('#InformationZone').append('<input type="text" hidden name="AmortizationDetail[' + $(item).find('#ADetailID').val() + '].ADetailID" value="' + $(item).find('#ADetailID').val() + '">')
            $('#InformationZone').append('<input type="text" hidden name="AmortizationDetail[' + $(item).find('#ADetailID').val() + '].IsDelete" value="true">')
        }
    })
    amoritizationTable.remove();
    $.each($('#DonateTable').find('input'), function (index, item) {
        $(item).val('');
    });
    //清空欄位資料
    if (!_tempFlag) {
        $('#WithHoldingAmountInput').val('');
    }
    CreateENPDetail();
    CreateAmortizationDetail();
}

//==============================
// 將Select或Input值傳入Disable欄位中供顯示
//==============================
function InputTransDisable() {
    $('#CurrencyDisable').text($('#CurrencySelect option:selected').text() + ' ' + $('#CurrencySelect option:selected').val())

    $('#VoucherBeauDisable').text($('#VoucherBeauSelect option:selected').text())
    $('#VoucherBeauDisable').attr('title', $('#VoucherBeauSelect option:selected').val());
    $('#CertificateKindDisable').text($('#CertificateKindSelect option:selected').text());

    $('#PaymentMethodDisable').text($('#PaymentMethodSelect option:selected').text());
    if ($('#ExportApplyAttributeSelect option:selected').val() != '') {
        $('#ExportApplyAttributeDisable').text($('#ExportApplyAttributeSelect option:selected').text())
    }
    if ($('#RemittanceSelect option:selected').val() != "") {
        $('#RemittanceDisable').text($('#RemittanceSelect option:selected').text());
    }
}

//*********************************************************************************************************************************************