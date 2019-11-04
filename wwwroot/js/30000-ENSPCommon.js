var _requiredIcon = '<b class="required-icon">*</b>';
var _accountOpenIcon = '<div class="col-sm-2 content-box" id="AccountSelectBtn" style="padding-top:40px"><div class="area-1"><div class="area-btn-right-1"><a id="AccountOpen" class="btn-02-blue btn-left">選擇帳號</a></div></div></div>'
var _autoDoneTextIcon = '<span class="undone-text">系統自動帶入</span>'

var waiting = [];
var _projectCategory;
var _coaCompanyAndDepartmentCollection;
var _coaCompany;
var _certificateObject;
var _coaDepartmentProduct;
//填表人預設成本與利潤中心
var _defaultDepartment;
var _expenseAttribute;
var _previousAmount;
var _moneyChange = false;
var _alerttext = [];

function loadingFiisData(cate) {
    ///<summary>讀取FIIS資料</summary>
    ///<param name="cate">表單種類</param>
    cate = cate.toLocaleLowerCase();
    blockPageForJBPMSend()
    dataLoadingDef('/Project/GetProjectCategoryDropMenu', function (data) { _projectCategory = data })
    dataLoadingDef('/ENP/GetCoaCompanyAndDepartment?enpNum=' + $('#P_SignID').val(), function (data) { _coaCompanyAndDepartmentCollection = data })
    dataLoadingDef('/ENP/GetcoaCompany?enpNum=' + $('#P_SignID').val(), function (data) { _coaCompany = data })
    dataLoadingDef('/ENP/GetBankList?enpNum=' + $('#P_SignID').val(), function (data) {
        $.each(data, function (index, item) {
            $('#BankSelect').append('<option value="' + item.bankNumber + '" bankName="' + item.bankName + '">' + item.bankNumber + ' - ' + item.bankName + '</option>')
        })
        $('#BankSelect').selectpicker('refresh')
    });
    dataLoadingDef('/ENP/GetProduct?enpNum=' + $('#P_SignID').val(), function (data) { _coaDepartmentProduct = data })
    dataLoadingDef('/ENP/GetProductDetail?enpNum=' + $('#P_SignID').val(), function (data) {
        var pdDictionary = []
        $.each(data, function (index, item) {
            pdDictionary.push({
                key: item.productDetail, value: item.productDetallDescription
            })
        })
        _optionList.push({
            key: 'AmortizationDetailProductDetail', value: pdDictionary
        })
    })
    dataLoadingDef('/ENP/GetVatInFormat?enpNum=' + $('#P_SignID').val(), function (data) {
        $.each(data, function (index, item) {
            $('#BTFormatKindSelect').append('<option value="' + item.vatFormatTypeCode + '">' + item.vatFormatTypeCode + ' - ' + item.vatFormatTypeDesc + '</option>')
        })
        $('#BTFormatKindSelect').selectpicker('refresh')
    })
    dataLoadingDef('/ENP/GetCurrency?enpNum=' + $('#P_SignID').val(), function (data) {
        $.each(data, function (index, item) {
            if (item.currencyCode == _currencyData) {
                $('#CurrencySelect').append('<option selected data-subtext="' + item.currencyCode + '" value="' + item.currencyCode + '"> ' + item.currencyName + '</option>')
            } else {
                $('#CurrencySelect').append('<option data-subtext="' + item.currencyCode + '" value="' + item.currencyCode + '"> ' + item.currencyName + '</option>')
            }
            if (_currencyData == "") {
                $('#CurrencySelect option[value="TWD"]').attr('selected', true);
            }
        })
        $('#CurrencySelect').selectpicker('refresh')
        $('#CurrencyDisable').val($('#CurrencySelect option:selected').text())
    })
    dataLoadingDef('/ENP/GetPaymentMethod?enpNum=' + $('#P_SignID').val(), function (data) {
        $.each(data, function (index, item) {
            $('#PaymentMethodSelect').append('<option value="' + item.paymentMethod + '">' + item.paymentMethodDescription + '</option>')
        })
        $('#PaymentMethodSelect').selectpicker('refresh')
    })
    dataLoadingDef('/ENP/GetcostCenter?enpNum=' + $('#P_SignID').val() + '&empNumber=' + $('#LoginEno').val(), function (data) {
        _defaultDepartment = data.department
    })
    dataLoadingDef('/ENP/GetCertificateObject?enpNum=' + $('#P_SignID').val(), function (data) {
        _certificateObject = data;
        $.each(data, function (index, item) {
            $('#VoucherBeauSelect').append('<option \
                    data-subtext="' + item.bANNumber + '" \
                    value="' + item.bANNumber + '" \
                    accountCode="' + item.accountCode + '" \
                    accountName="' + item.accountName + '"\
                    gvDeclaration="' + item.gvDeclaration + '" \
                    isCreditCardOffice="' + item.isCreditCardOffice + '">' + item.businessEntity + '</option>')
        })
        $('#VoucherBeauSelect').val(_voucherObject);
        $('#VoucherBeauSelect').selectpicker('refresh')
    })
    dataLoadingDef('/ENP/GetWtTax?enpNum=' + $('#P_SignID').val(), function (data) {
        var pdDictionary = []
        $.each(data, function (index, item) {
            pdDictionary.push({
                key: item.wtTaxCode, value: item.wtTaxtCodeDescription
            })
            _wtTaxFormat.push({
                key: item.wtTaxCode, value: item.formatCode
            })
        })
        _optionList.push({
            key: 'IncomeCode', value: pdDictionary
        })
    })
    //033
    dataLoadingDef('/ENP/GetWt9bExpenseType?enpNum=' + $('#P_SignID').val(), function (data) {
        $('#WriterIncomeNumSelect').append('<option value>請選擇</option>');
        $.each(data, function (index, item) {
            $('#WriterIncomeNumSelect').append('<option value="' + item.wt9bExpenseType + '">' + item.wt9bExpenseType + ' - ' + item.wt9bExpenseTypeDescription + '</option>')
        });
        $('#WriterIncomeNumSelect').selectpicker('refresh')
    })
    //034
    dataLoadingDef('/ENP/GetWt92PayItem?enpNum=' + $('#P_SignID').val(), function (data) {
        $('#OtherIncomNumSelect').append('<option value>請選擇</option>')
        $.each(data, function (index, item) {
            $('#OtherIncomNumSelect').append('<option value="' + item.wt92PayItem + '">' + item.wt92PayItem + ' - ' + item.wt92PayItemDescription + '</option>')
        });
        $('#OtherIncomNumSelect').selectpicker('refresh')
    })
    //026
    dataLoadingDef('/ENP/GetWt9aPf?enpNum=' + $('#P_SignID').val(), function (data) {
        $('#ProfeesionalKindSelect').append('<option value>請選擇</option>')
        $.each(data, function (index, item) {
            $('#ProfeesionalKindSelect').append('<option value="' + item.wt9aPfType + '">' + item.wt9aPfType + ' - ' + item.wt9aPfTypeDescription + '</option>')
        });
        $('#ProfeesionalKindSelect').selectpicker('refresh')
    })
    //035
    dataLoadingDef('/ENP/GetWt92TaxTreaty?enpNum=' + $('#P_SignID').val(), function (data) {
        $.each(data, function (index, item) {
            $('#LeaseTaxCodeSelect').append('<option value="' + item.wtTaxTreaty + '">' + item.wtTaxTreaty + ' - ' + item.wtTaxTreatyDescription + '</option>')
        });
        $('#LeaseTaxCodeSelect').selectpicker('refresh')
    })
    //037
    dataLoadingDef('/ENP/GetTerritory?enpNum=' + $('#P_SignID').val(), function (data) {
        var pdDictionary = []
        $.each(data, function (index, item) {
            pdDictionary.push({
                key: item.territoryCode, value: item.description
            })
        })
        _optionList.push({
            key: 'CountryCode', value: pdDictionary
        })
    })
    //080
    dataLoadingDef('/ENP/GetwtIdentityType?enpNum=' + $('#P_SignID').val(), function (data) {
        $.each(data, function (index, item) {
            $('#CertficateKindSelect').append('<option value="' + item.identityTypeCode + '" wtCode="' + item.tag + '">' + item.identityTypeCode + ' - ' + item.description + '</option>')
        });
        $('#CertficateKindSelect').val($('#identityFlag').val())
        $('#CertficateKindSelect').selectpicker('refresh')
    })
    //匯出申報性質
    dataLoadingDef('/ENP/GetExportApplyAttribute', function (data) {
        $.each(data, function (key, value) {
            $('#ExportApplyAttributeSelect').append('<option value="' + key + '">' + value + '</option>')
        });
        $('#ExportApplyAttributeSelect').val(_exportApplyAttribute)
        $('#ExportApplyAttributeSelect').selectpicker('refresh')
    })
    //會計項子目
    dataLoadingDef('/ENP/GetCoaAccount?enpNum=' + $('#P_SignID').val(), function (data) {
        var pdDictionary = []
        $.each(data, function (index, item) {
            pdDictionary.push({
                key: item.account, value: item.description
            })
        })
        _optionList.push({
            key: cate + 'AccountingItem', value: pdDictionary
        })
    })
    //卡處稅法分類
    dataLoadingDef('/ENP/GetDeductCategory?enpNum=' + $('#P_SignID').val(), function (data) {
        $.each(data, function (index, item) {
            $('#TaxCategorySelect').append('<option value="' + item.deductCategory + '">' + item.deductCategoryDescription + '</option>')
        });
        $('#TaxCategorySelect').selectpicker('refresh')
    })
    //卡處費用性質
    dataLoadingDef('/ENP/GetExpenseAttribute/', function (data) {
        _expenseAttribute = data;
    })
    GetTwoNhiFlag($('#VendorNumInput').val())
    return $.when.apply(null, waiting).promise();
}
function dataLoadingDef(url, fnAfterDone) {
    ///<summary>Promise物件</summary>
    ///<param name="url">Get Url</param>
    ///<param name="fnAfterDone">Function Done After Success</param>
    var def = $.Deferred();
    waiting.push(def);
    $.ajax({
        cache: false,
        type: 'GET',
        dataType: 'json',
        url: url
    }).done(function (data, textStatus, jqXHR) {
        fnAfterDone(data);
        def.resolve();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        FiisFatalFail()
    }).always(function () {
    })
    return def.promise()
}
function FiisFatalFail() {
    ///<summary>Fiis API連接錯誤處理</summary>
    console.log("FiisAPI連接錯誤")
}
function GetTwoNhiFlag(vendorNum) {
    ///<summary>取得是否扣二代健保</summary>
    ///<param name="vendorNum">供應商編號</param>
    var def = $.Deferred();
    waiting.push(def);
    if (vendorNum == undefined || vendorNum == '') {
        def.resolve()
        return def.promise();
    }
    $.ajax({
        cache: false,
        type: 'GET',
        dataType: 'json',
        url: '/ENP/Get2NHIFlag?enpNum=' + $('#P_SignID').val() + '&vendorNum=' + vendorNum
    }).done(function (data, textStatus, jqXHR) {
        $('#twoNhiFlag').val(data);
        def.resolve()
    }).fail(function (jqXHR, textStatus, errorThrown) {
        FiisFatalFail();
    })
    return def.promise();
}
function alertopen(text) {
    ///<summary>警示視窗Remodal</summary>
    ///<param name="text">警示文字</param>
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
function MathRoundExtension(x, decimalPlaces) {
    ///<summary>四捨五入(擴充)</summary>
    ///<param name="x">原數字</param>
    ///<param name="decimalPlaces">取位數</param>
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
    ///<summary>記錄更改前的金額</summary>
    ///<param name="e">該input Dom物件</param>
    _previousAmount = $(e.target).val();
}
function MoneyChange(e) {
    ///<summary>若input欄位有清空幣別的class，跳出訊息是否清空</summary>
    ///<param name="e">該input Dom物件</param>
    if ($(e.target).attr('class').includes('emptyMoneyField')) {
        var confirmResult = false;
        if (!_moneyChange) {
            return;
        }
        confirmopen("更動此欄位將會清空所有金額相關欄位，是否繼續?",
            function () {
                $('.moneyfield').val(0).text(0);
                _moneyChange = false;
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
            $(e.target).val(_previousAmount);
            return;
        }
    }
}
function MoneyHasBeenChanged() {
    ///<summary>檢測金額是否有被異動過</summary>
    _moneyChange = true;
}
function DisableDOMObject(obj) {
    ///<summary>Disable Dom 元件</summary>
    ///<param name="obj">該Dom物件</param>
    if ($(obj)[0] == undefined) {
        return;
    }
    $(obj).attr('disabled', true);

    if ($(obj)[0].tagName === 'INPUT' && $(obj)[0].className.includes('datetimepicker1')) {
        if ($(obj).data('DateTimePicker') == undefined) {
            return;
        }
        $(obj).data('DateTimePicker').destroy();
    }
    if ($(obj)[0].tagName === 'SELECT' && !$(obj)[0].className.includes('form-control')) {
        $(obj).addClass('input-disable');
        $(obj).selectpicker('refresh');
    };
    if ($(obj)[0].tagName === 'DIV') {
        if ($(obj).data('DateTimePicker') == undefined) {
            return;
        }
        $(obj).data('DateTimePicker').destroy();
        $(obj).find('input').addClass('input-disable')
        $(obj).find('span').addClass('input-disable')
    }
}
function EnableDOMObject(obj) {
    ///<summary>Enable Dom 元件</summary>
    ///<param name="obj">該Dom物件</param>
    if ($(obj)[0] == undefined) {
        return;
    }
    $(obj).attr('disabled', false);
    if ($(obj)[0].tagName === 'INPUT' && $(obj)[0].className.includes('datetimepicker1')) {
        $(obj).datetimepicker({
            format: 'YYYY-MM-DD'
        });
        $(obj).removeClass('input-disable').prop('disabled', false);
    }
    if ($(obj)[0].tagName === 'SELECT' && !$(obj)[0].className.includes('form-control')) {
        $(obj).removeClass('input-disable');
        $(obj).parent('div').removeClass('input-disable');
        $(obj).selectpicker('refresh');
    };
    if ($(obj)[0].tagName === 'DIV') {
        $(obj).datetimepicker({
            format: 'YYYY-MM-DD'
        });
        $(obj).find('input').removeClass('input-disable').prop('disabled', false);
        $(obj).find('span').removeClass('input-disable')
    }
}
function SwitchHideDisplay(hideObj, displayObj) {
    ///<summary>切換隱藏/顯示</summary>
    ///<param name="hideObj">需隱藏的元件</param>
    ///<param name="hideObj">需顯示的元件</param>
    if (hideObj != null) {
        $.each(hideObj, function (index, item) {
            if (item[0] == undefined) {
                return;
            }
            if ($(item)[0].tagName === 'SELECT') {
                if (!$(item)[0].className.includes('form-control')) {
                    $(item).parents('div.bootstrap-select').hide();
                    return;
                }
            }
            $(item).hide();
        });
    }
    if (displayObj != null) {
        $.each(displayObj, function (index, item) {
            if (item[0] == undefined) {
                return;
            }
            if ($(item)[0].tagName === 'SELECT') {
                if (!$(item)[0].className.includes('form-control')) {
                    $(item).parents('div.bootstrap-select').show();
                    return;
                }
            }
            $(item).show();
        });
    }
}
function AccountFormat(e) {
    ///<summary>文字轉金額</summary>
    ///<param name="e">指定轉換的Dom元件</param>
    if (e && e.target && e.type) {
        if (e.target.tagName != "INPUT") {
            $(e.target).text(accounting.format($(e.target).text()))
        }
        else {
            if ($(e.target).val() == 0) {
                $(e.target).val(0);
            } else {
                if (e.target.className && e.target.className.includes('moneyfield')) {
                    $(e.target).val(accounting.formatNumber($(e.target).val(), parseFloat($('input[name="CurrencyPrecise"]').val()), ","))
                } else {
                    $(e.target).val(accounting.format($(e.target).val()))
                }
            }
        }
        return;
    } else if (e) {
        var $e = $(e)
        if ($e.prop("tagName") != "INPUT") {
            $e.text(accounting.format($e.text()))
        }
        else {
            if ($e.val() == 0) {
                $e.val(0);
            } else {
                if ($e.attr('class') && $e.attr('class').includes('moneyfield')) {
                    $e.val(accounting.formatNumber($e.val(), parseFloat($('input[name="CurrencyPrecise"]').val()), ","))
                } else {
                    $e.val(accounting.format($e.val()))
                }
            }
        }
        return;
    }
    $.each($('.accountingfield'), function (index, item) {
        if (item.tagName != "INPUT") {
            $(item).text(accounting.formatNumber($(item).text(), parseFloat($('input[name="CurrencyPrecise"]').val()), ","))
        }
        else {
            $(item).val(accounting.formatNumber($(item).val(), parseFloat($('input[name="CurrencyPrecise"]').val()), ","))
        }
    })
}
function AccountUnFormat(e) {
    ///<summary>金額轉文字</summary>
    ///<param name="e">指定轉換的Dom元件</param>
    if (e && e.target && e.type) {
        if (e.target.tagName != "INPUT") {
            $(e.target).text(accounting.unformat($(e.target).text()))
        }
        else {
            if ($(e.target).val() == 0) {
                $(e.target).val(0);
            } else {
                $(e.target).val(accounting.unformat($(e.target).val()))
            }
        }
        return;
    } else if (e) {
        var $e = $(e)
        if ($e.prop("tagName") != "INPUT") {
            $e.text(accounting.unformat($e.text()))
        }
        else {
            if ($e.val() == 0) {
                $e.val(0);
            } else {
                $e.val(accounting.unformat($e.val()))
            }
        }
        return;
    }
    $.each($('.accountingfield'), function (index, item) {
        if (item.tagName != "INPUT") {
            $(item).text(accounting.unformat($(item).text()))
        }
        else {
            $(item).val(accounting.unformat($(item).val()))
        }
    })
}
function AppendRequired(appendObj) {
    ///<summary>必填新增</summary>
    ///<param name="appendObj">新增必填圖示的元件陣列</param>
    $.each(appendObj, function (index, item) {
        if (!$(item).find('.required-icon').length > 0) {
            $(item).append(_requiredIcon);
        }
    });
}
function RemoveRequired(appendObj) {
    ///<summary>必填移除</summary>
    ///<param name="appendObj">移除必填圖示的元件陣列</param>
    $.each(appendObj, function (index, item) {
        $(item).find('b.required-icon').remove();
    })
}
function EmptyObj(emptyObj) {
    ///<summary>清空欄位</summary>
    ///<param name="emptyObj">清空的欄位陣列</param>
    $.each(emptyObj, function (index, item) {
        $(item).val('');
    });
}
function TableBindingSetting(table, bindingText) {
    ///<summary>重新計數，用於Model Binding</summary>
    ///<param name="table">須重新計數的表格</param>
    ///<param name="bindingText">繫結物件名稱class</param>
    var bindingDetail = [];
    var counting = 0;
    if ($(table).find('tbody') == undefined || $(table).find('tbody').length < 1) {
        return;
    }
    $.each($(table).find('tbody'), function (index, item) {
        bindingDetail.push($(item).find('[name^="' + bindingText + '"]'));
        $.each(bindingDetail[0], function (d_index, d_item) {
            var propName = $(d_item).attr('name').split('.')[1];
            if (propName == "Index") {
                $(d_item).val(counting)
                return;
            }
            if (propName == "Seq") {
                $(d_item).attr('name', bindingText + "[" + counting + "]." + propName)
                $(d_item).val(counting + 1);
                return;
            }
            if (propName == "LineNum" && bindingText == "AmortizationDetail") {
                $(d_item).attr('name', bindingText + "[" + counting + "]." + propName)
                $(d_item).val(counting + 1);
                return;
            }
            $(d_item).attr('name', bindingText + "[" + counting + "]." + propName)
        })
        bindingDetail = [];
        counting++;
    });
}
function RenumberingDetail(renumberingObj, sernoClass) {
    ///<summary>重新計數，用於Model Binding</summary>
    ///<param name="renumberingObj">須重新計數的物件</param>
    ///<param name="sernoClass">須重新計數的物件class</param>

    $.each(renumberingObj, function (index, item) {
        $(item).find('.' + sernoClass).text(index + 1);
    });
}
function checkboxBinding(e) {
    ///<summary>checkBox連動更改input值，用於Model Binding</summary>
    ///<param name="renumberingObj">須連動的物件</param>

    var checkId = $(this).attr('id');
    if ($('[type="text"]#' + checkId).length < 1) {
        return;
    }
    if ($(this).prop('checked')) {
        $('[type="text"]#' + checkId).val("true")
    } else {
        $('[type="text"]#' + checkId).val("false")
    }
}