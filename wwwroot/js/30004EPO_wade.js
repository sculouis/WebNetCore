//廠商請款請購主檔json全域變數
var data = [];
var __price = { "Rate": 1, "MARGINAMT": 0 };
var vendorInfo = {}
var cerObject
var CertificateKindList = []
var __Deductible = false
var EPOUnReceiving = [];
var EPODetailTable = [];
//取得後端ModelprepayCodeCom
var EPO = getModel();
var isCardEmp = false
var detailDeferred = $.Deferred();

//FISS資料載入
{
    var CoaCompanyAndDepartment = []
    var CoaCompany = []
    var product = []
    var productDetail = []
    var ExpenseAttribute = []
    var wtIdentityType = []//證號別
    var WtTax = []//所得代碼
    var Wt9bExpenseType = []//稿費
    var Wt92PayItem = [] //其他所得給付項目
    var Wt9aPf = [] //業務別
    var Wt92TaxTreaty = [] //租稅協定代碼
    var Territory = [] //國別
    var CoaAccount = [] //會計項子目
    var VatInFormat = []//格式別
    var DeductCategory = []//稅法分類
    var FiisDataAjax = $.ajax({
        type: 'POST',
        dataType: 'json',
        url: GetFiisDataUrl + "/" + __epoNum,
        success: function (data) {
            CoaCompanyAndDepartment = data.CoaCompanyAndDepartment
            CoaCompany = data.CoaCompany
            product = data.product
            productDetail = data.productDetail
            ExpenseAttribute = data.ExpenseAttributeFullName
            wtIdentityType = data.wtIdentityType
            WtTax = data.WtTax
            Wt9bExpenseType = data.Wt9bExpenseType
            Wt92PayItem = data.Wt92PayItem
            Wt9aPf = data.Wt9aPf
            Wt92TaxTreaty = data.Wt92TaxTreaty
            Territory = data.Territory
            CoaAccount = data.CoaAccount
            VatInFormat = data.VatInFormat
            DeductCategory = data.DeductCategory
        },
        error: function (data) {
            alert("讀取FIIS資料失敗")
        }
    });

    //取得廠商二代健保註記
    function Get2NHIFlag(supplierNum) {
        let twoNhiFlag = "N"
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Get2NHIFlagUrl + '?epoNum=' + __epoNum + "&supplierNum=" + supplierNum,
            async: false,
            success: function (data) {
                twoNhiFlag = data.twoNhiFlag
            }
        });

        return twoNhiFlag
    }
}

//等待頁面可輸入等待訊息
function blockPage(UImessage) {
    if (UImessage == "") {
        _blockstatus = false;
        $.unblockUI();
    } else {
        _blockstatus = true
        $.blockUI({ message: UImessage });
    }
}

//陣列remove的定義
Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

//==========================================
// 預計付款日期
//==========================================
function GetEstimatePayDate(selector) {
    var Today = new Date();
    if (Today.getDate() >= 1 && Today.getDate() <= 6) {
        EPO.EstimatePayDate = Today.getFullYear() + "-" + (Today.getMonth() + 1) + "-" + 14
    } else if (Today.getDate() >= 7 && Today.getDate() <= 20) {
        // selector.text(Today.getFullYear() + '年' + (Today.getMonth() + 1) + '月' + '28日');
        EPO.EstimatePayDate = Today.getFullYear() + "-" + (Today.getMonth() + 1) + "-" + 28
    } else {
        //Today.setMonth(Today.getMonth() + 1)
        // selector.text(Today.getFullYear() + '年' + (Today.getMonth() + 2) + '月' + '14日');
        EPO.EstimatePayDate = Today.getFullYear() + "-" + (Today.getMonth() + 2) + "-" + 14
    }
    selector.text(EPO.EstimatePayDate)
}

//==========================================
// 開啟請款明細內容頁展開
//==========================================
$(document).on('click', '#ExpandEPODetail', function () {
    //if ($(this).find('.glyphicon-chevron-down').length > 0) {
    //    SwitchHideDisplay([], [$(this).parents('tbody').find('.EPODetail')]);
    //} else {
    //    SwitchHideDisplay([$(this).parents('tbody').find('.EPODetail')], []);
    //}
    //取得相關tr的同級元素
    var trChevron = $(this).parents('tr').siblings();
    if ($(this).find('.glyphicon-chevron-down').length > 0) {
        trChevron.each(function () { $(this).show() });
        $(this).parents('tr').nextAll('.ExpandInnerDetail').first().find('span').html('收合')
        //trChevron.find('span').text('收合');
    }
    else if ($(this).find('div.glyphicon-chevron-up').length > 0) {
        trChevron.each(function () { $(this).hide() });
        $(this).parents('tr').nextAll('.ExpandInnerDetail').first().find('span').html('展開')
        //trChevron.hide();
        //$(this).find('span').text('展開');
    }
    //向上或向下的箭頭切換
    $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up')
});

//當請款明細展開時，分攤明細跟著展開
//$(document).on('click', '.ExpandEPODetail', function () {
//    var trChevron = $(this).parents('tr').siblings();
//    if ($(this).find('div.glyphicon-chevron-down').length > 0) {
//        trChevron.show();
//        trChevron.find('.ExpandInnerDetail').parents('tr').nextAll().show();
//        trChevron.find('.ExpandInnerDetail').parents('tr').next().hide();
//        trChevron.find('span').text('收合');
//    }
//    else if ($(this).find('div.glyphicon-chevron-up').length > 0) {
//        trChevron.hide();
//        $(this).find('span').text('展開');
//    }
//    $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
//});

//分攤明細的展開及收合
$(document).on('click', '.ExpandInnerDetail', function () {
    if ($(this).find('span').text() == '展開') {
        $(this).parents('.AmoDetail').next().show(200);
        $(this).find('span').text('收合');
    }
    else if ($(this).find('span').text() == '收合') {
        $(this).parents('.AmoDetail').next().hide(200);
        $(this).find('span').text('展開');
    }
    //$(this).find('span').toggleText('展開', '收合');
});

//table的所有row展開
//const RowsExapndAll = () => {
$(document).on('click', '#ExpandAllEPODetail', function () {
    if ($(this).find('.list-open-icon').length > 0) {
        //SwitchHideDisplay([], [$('.EPODetail')]);
        $('.EPODetail').show()
        $('.AmoDetail').show()
        $(this).closest('table').find(".EPODetailSerno").find(".glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up")
        $(this).closest('table').find(".ExpandInnerDetail a span").text("收合")
    } else {
        //SwitchHideDisplay([$('.EPODetail')], []);
        $('.EPODetail').hide()
        $('.AmoDetail').hide()
        $(this).closest('table').find(".EPODetailSerno").find(".glyphicon-chevron-up").removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
        $(this).closest('table').find(".ExpandInnerDetail a span").text("展開")
    }
    $(this).find('.toggleArrow').toggleClass('list-close-icon list-open-icon')
});

//==============================
//切換隱藏/顯示DOM元件
//==============================
function SwitchHideDisplay(hideObj, displayObj) {
    if (hideObj != null) {
        $.each(hideObj, function (index, item) {
            if ($(item)[0].tagName === 'SELECT') {
                $(item).parents('div.bootstrap-select').hide();
                return;
            }
            $(item).hide();
        });
    }
    if (displayObj != null) {
        $.each(displayObj, function (index, item) {
            if ($(item)[0].tagName === 'SELECT') {
                $(item).parents('div.bootstrap-select').show();
                return;
            }
            $(item).show();
        });
    }
}

//==========================================
// 分攤明細層-動態效果建立/展開收合/新增/刪除
//==========================================
$(document).on('click', '#AmortizationDetailCreate', function () {
    if ($('#PleaseType option:selected').val() == '') {
        alertopen("請先選擇請款類別");
        return;
    }
    if ($('#ENPDetailCreate').length > 0) {
        alertopen('請先完成請款明細之填寫');
        return;
    }
    CreateAmortizationDetail();
});
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
$(document).on('change', 'select[name=ProjectCategory]', function () {
    let Project = $(this).closest("tr").find("select[name=Project]")
    let ProjectItem = $(this).closest("tr").find("select[name=ProjectItem]")

    $(Project).val("").empty()
    $(ProjectItem).val("").empty()
    $(ProjectItem).selectpicker('setStyle', 'input-disable', 'add');
    $(ProjectItem).prop('disabled', true);
    $(Project).next("[Errmsg=Y]").remove()
    $(ProjectItem).next("[Errmsg=Y]").remove()

    if ($(this).val() != "") {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: getProjectUrl + '?projectCategoryCode=' + $(this).val(),
            async: false,
            success: function (data) {
                $.each(data, function (key, txt) {
                    $(Project).append($("<option></option>").attr("value", key).text(txt));
                })

                $(Project).attr("necessary", true)
                $(ProjectItem).attr("necessary", true)

                $(Project).selectpicker('setStyle', 'input-disable', 'remove');
                $(Project).prop('disabled', false);
            },
            error: function (data) {
            }
        });
    }
    else {
        $(Project).removeAttr("necessary")
        $(ProjectItem).removeAttr("necessary")
        $(Project).selectpicker('setStyle', 'input-disable', 'add');
        $(Project).prop('disabled', true);
    }

    $(Project).selectpicker('refresh');
    $(ProjectItem).selectpicker('refresh');
})
$(document).on('change', 'select[name=Project]', function () {
    let ProjectItem = $(this).closest("tr").find("select[name=ProjectItem]")

    $(ProjectItem).val("").empty()
    $(ProjectItem).next("[Errmsg=Y]").remove()
    if ($(this).val() != "") {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: getProjectItemUrl + '?projectCode=' + $(this).val(),
            async: false,
            success: function (data) {
                $.each(data, function (key, txt) {
                    $(ProjectItem).append($("<option></option>").attr("value", key).text(txt));
                })

                $(ProjectItem).selectpicker('setStyle', 'input-disable', 'remove');
                $(ProjectItem).prop('disabled', false);
            },
            error: function (data) {
            }
        });
    }
    else {
        $(ProjectItem).selectpicker('setStyle', 'input-disable', 'add');
        $(ProjectItem).prop('disabled', true);
    }

    $(ProjectItem).selectpicker('refresh');
})

//新增分攤明細
$(document).on('click', '#EPOAmoIN thead [name=addRow]', function () {
    let EPOAmoIN = $(this).closest('#EPOAmoIN')
    let tbody = $(EPOAmoIN).find("tbody").first().clone()
    //let ChargeDept = tbody.find("input[name='ChargeDept']").val()
    tbody.find("[errmsg]").remove()
    let defaultChargeDept = $(tbody).find("input[name=defaultChargeDept]").val()
    tbody.find("input").not("[name=AccountingItem]").not("[name=IsDelete]").val("")

    tbody.find("[name='OriginalAmortizationTWDAmount']").text(0)
    tbody.find("#AmortizationDetailProductDetailDisable").html('<span class="undone-text">點選按鈕新增</span>')

    let AccountingItemCode = tbody.find("#AccountingItemCode").val()
    defaultCoaAccount = $.map(CoaAccount, function (o) { if (o.account == AccountingItemCode) { return o } })
    if (defaultCoaAccount.length > 0) {
        tbody.find("#AccountingItemDisable").html(defaultCoaAccount[0].account + "-" + defaultCoaAccount[0].description)
        tbody.find("#AccountingItemCode").val(defaultCoaAccount[0].account)
        tbody.find("#AccountingItemName").val(defaultCoaAccount[0].description)
    }

    // $(tbody).find('.selectpicker').data('selectpicker', null);
    //$(tbody).find('.bootstrap-select').find("button:first").remove();
    //$(tbody).find(".selectpicker").selectpicker("render")

    //tbody.find("select[name='AccountBank']").val($("#Books").val()).selectpicker("refresh")
    // tbody.find("select[name='CostProfitCenter']").val(__CostProfitCenter).selectpicker("refresh")
    // tbody.find("select[name='CostProfitCenter']").val(defaultChargeDept).selectpicker("refresh")
    let AccountBankSelected = tbody.find("select[name='AccountBank']").find("option[value='" + $("#Books").val() + "']");
    if (AccountBankSelected.length != 0) {
        AccountBankSelected.eq(0).prop("selected", true)
    }
    else {
        tbody.find("select[name='AccountBank']").val("")
    }

    tbody.find("select[name='CostProfitCenter']").find("option[value='" + defaultChargeDept + "']").prop("selected", true)

    $(tbody).mouseenter(function () {
        $(this).find(".icon-remove-size").show();
    })
    $(tbody).mouseleave(function () {
        $(this).find(".icon-remove-size").hide();
    })

    if (isCardEmp) {
        tbody.find("select[name='ExpenseAttribute']").attr("necessary", "").toggleClass("input-disable", false).prop("disabled", false)
    }
    else {
        tbody.find("select[name='ExpenseAttribute']").removeAttr("necessary").toggleClass("input-disable", true).prop("disabled", true).val("")
    }

    $(tbody).find("select").on('change', function (e) {
        $(this).closest("td").find("[Errmsg=Y]").remove()
        eventHandler(e)
    })

    $(tbody).find('input[name=OriginalAmortizationAmount]').on('focus', function (e) {
        $(this).next("[Errmsg=Y]").remove()
    })
    $(tbody).find('input[name=OriginalAmortizationAmount]').on('blur', function (e) {
        eventHandler(e)
    })

    $(tbody).find('input[name=AmortizationRatio]').on('focus', function (e) {
        $(this).next("[Errmsg=Y]").remove()
    })
    $(tbody).find('input[name=AmortizationRatio]').on('blur', function (e) {
        eventHandler(e)
    })

    $(EPOAmoIN).append(tbody)

    //重新計算項次編號
    $(EPOAmoIN).find('tbody').find("td[alt='Index']").each(function (index) {
        $(this).text(index + 1);
    });
});

//刪除分攤明細
$(document).on('click', '#EPOAmoIN .icon-remove-size', function () {
    var check = confirm('請確認是否刪除？');
    if (check) {
        let EPOAmoIN = $(this).closest('#EPOAmoIN')
        var tbody = $(this).closest('tbody');
        let delADetailID = $(tbody).find("input[name=ADetailID]").val()
        if (delADetailID > 0) {
            let finddelobj = false
            $(EPO.EPODetail).each(function (i, o) {
                if (finddelobj) return false

                $(o.AmortizationDetail).each(function (_i, _o) {
                    if (_o.ADetailID == delADetailID) {
                        _o.IsDelete = true
                        finddelobj = true
                        return false
                    }
                })
            })
        }

        tbody.remove();
        //重新計算項次編號
        let tbodylength = 0
        $(EPOAmoIN).find('tbody').find("td[alt='Index']").each(function (index) {
            tbodylength = index + 1
            $(this).text(tbodylength);
        });

        if (tbodylength == 1) {
            $(EPOAmoIN).find('tbody').find(".icon-remove-size").hide()
        }

        //$(EPOAmoIN).find('tbody').last().find("input[name=OriginalAmortizationAmount]").triggerHandler("blur")
        //給個1避免觸發金額檢查失敗
        $(EPOAmoIN).find('tbody').last().find("input[name=OriginalAmortizationAmount]").val(1).blur()
    }
});

//分攤明細展開收合
$(document).on('click', '#EPOAmoIN [name="EPOAmoINDetail"]', function () {
    let tbody = $(this).closest('tbody');
    if ($(this).find(".glyphicon-chevron-down").length > 0) {
        $(tbody).find('tr').not(':first').show()

        $(this).find(".glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up")
    }
    else {
        $(tbody).find('tr').not(':first').hide()

        $(this).find(".glyphicon-chevron-up").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down")
    }
});

//覆寫輸出目標 *對應動態新增表單
$(document).on("click", ".openSearchBox", function () {
    $('#remodal-tempSelected').data("target", $(this).closest("td"))
})

///覆寫選項輸出*對應動態新增表單
function OptionResultOutput() {
    var resultObj = $('#remodal-tempSelected').find('.Links');
    let target = $('#remodal-tempSelected').data("target")
    if (resultObj.length < 1) {
        $(target).find('#' + _optionPickerCode + 'Disable').text('').append('<span class="undone-text">點選按鈕新增</span>');
        $(target).find('#' + _optionPickerCode + 'Name').val('');
        $(target).find('#' + _optionPickerCode + 'Code').val('');
    } else {
        var result = $(resultObj).find('span').text();
        if (result.split(' - ').length < 2) {
            return;
        }
        $(target).find('#' + _optionPickerCode + 'Disable').text(result);
        $(target).find('#' + _optionPickerCode + 'Code').val(result.split(' - ')[0]);
        $(target).find('#' + _optionPickerCode + 'Name').val(result.split(' - ')[1]);
        _optionOutput.key = result.split(' - ')[0];
        _optionOutput.value = result.split(' - ')[1]
    }
    $(target).find('#' + _optionPickerCode + 'Code').trigger('change');
    $('#remodal-tempSelected').empty();
    $('#remodal-tempSelected').append('<div class="no-file-text" style="text-align:center"><b>-尚無項目-</b></div>')
    $('#modal-search-condition').val('')
}

//分攤明細層全展開與收合
$(document).on('click', '#EPOAmoIN [name=ExpandAllEPOAmoINDetail]', function () {
    if ($(this).find('.list-open-icon').length > 0) {
        $(this).closest("table").find("tbody").each(function () {
            $(this).find('.glyphicon-chevron-down').removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up")
            $(this).find("tr").not(":first").show()
        })
        $(this).find('.list-open-icon').removeClass('list-open-icon').addClass('list-close-icon')
    } else {
        $(this).closest("table").find("tbody").each(function () {
            $(this).find('.glyphicon-chevron-up').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down")
            $(this).find("tr").not(":first").hide()
        })
        $(this).find('.list-close-icon').removeClass('list-close-icon').addClass('list-open-icon')
    }
});

//==============================================================================================
//預付款沖銷
//==============================================================================================
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
        url: '/EPO/GetPrepaymentInfo?vendorNum=' + $('#VendorNum').val() + '&applicantUnitCode=' + restrictDept + '&currency=' + EPO.Currency,
        // url: '/EPO/GetPrepaymentInfo?vendorNum=' + 1000 + '&applicantUnitCode=' + '2822' + '&currency=' + 'TWD',
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
                            <div class="table-box w30 popup-PrepayAmount">' + fun_accountingformatNumberdelzero(item.TotalAmount) + '</div>\
                            <div class="table-box w30 popup-PrepayunAmount">' + fun_accountingformatNumberdelzero(item.UnWriteAmount) + '</div>\
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

    let PrepaymentInfo = []
    $.each(selectTarget, function (index, item) {
        var itemRoot = $(item).parents('li');
        let Prepayment = {
            PrepaymentNum: itemRoot.find('.popup-PrepaymentID').text(),
            PrepaymentAmount: itemRoot.find('.popup-PrepayAmount').text(),
            UnWriteOffAmount: itemRoot.find('.popup-PrepayunAmount').text(),
            WriteOffAmount: 0,
        }
        PrepaymentInfo.push(Prepayment)
    })
    CreatePrepaymentTbody(PrepaymentInfo)
})

function CreatePrepaymentTbody(PrepaymentList) {
    if (PrepaymentList.length > 0) {
        CreatePrepaymentTable();
    }
    else {
        $('#PrepaymentTable').remove();
        $('#undone-vendorSelect').show();
        return true
    }

    var existData = "";
    $.each($('table#PrepaymentTable tbody').find('#PrepaymentNumInput'), function (index, item) {
        existData = existData + ',' + $(item).val();
    })
    $.each(PrepaymentList, function (index, item) {
        var itemRoot = $(item).parents('li');
        if (existData != undefined && existData.includes(item.PrepaymentNum)) {
            return;
        }
        var count = $('#PrepaymentTable tbody').length;
        var template = $('#PrepaymentDetailTemplate').clone().attr('id', 'PrepaymentDetail_' + count);
        template.find('#PrepaymentNumDisable').text(item.PrepaymentNum);
        template.find('#PrepaymentNumInput').val(item.PrepaymentNum);
        template.find('#PrepaymentAmountDisable').text(fun_accountingformatNumberdelzero(item.PrepaymentAmount));
        template.find('#PrepaymentAmountInput').val(item.PrepaymentAmount);
        template.find('#UnWriteOffAmountDisable').text(fun_accountingformatNumberdelzero(item.UnWriteOffAmount));
        template.find('#UnWriteOffAmountInput').val(item.UnWriteOffAmount)
        template.find('#WriteOffAmountInput').val(fun_accountingformatNumberdelzero(item.WriteOffAmount)).attr("Amount", "").attr("Zero", false).attr("Max", accounting.unformat(item.UnWriteOffAmount))

        $(template).on("mouseenter", function () {
            $(this).find(".icon-remove-size").show();
        })
        $(template).on("mouseleave", function () {
            $(this).find(".icon-remove-size").hide();
        })

        $(template).find(".icon-remove-size")
      .on("click", function (e) {
          if (confirm('請確認是否刪除？')) {
              $(this).closest("tbody").remove()
              if ($('#PrepaymentTable').find("tbody").length == 0) {
                  $('#PrepaymentTable').remove();
                  $('#undone-vendorSelect').show();
              }
          }
      })

        $(template).find("#WriteOffAmountInput")
       .on("blur", function (e) {
           eventHandler(e)
           let CertificateAmount = accounting.unformat($("#CertificateAmount").text())
           $(e.target).closest("table").find("tbody #WriteOffAmountInput").each(function () {
               CertificateAmount -= accounting.unformat($(this).val())
           })
           if (CertificateAmount < 0) {
               alertopen(errObj.WriteOffAmountOver)
           }
       }).on("focus", function (e) { e.target.value = accounting.unformat(e.target.value) })

        $('#PrepaymentTable').append(template)
    })
    // $('.PrepaymentMoney').on('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', PrepaymentAmountCal);
}

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
//==============================================================================================
// 分攤明細層 - 建立/新增(有無資料)/下拉設定/重新計算分攤金額(分攤比率[M]/分攤金額)
//==============================================================================================
function CreateAmortizationDetail() {
    let template = $('#AmortizationDetailTableTemplate').clone().attr('id', 'AmortizationDetailTable');
    $(template).find('#AmortizationDetailCloneTemplate').attr('id', 'AmortizationDetail_0');
    $('#AmortizationDetailRoot').append($(template).show())

    $.each($(template).find('tbody'), function (index, item) {
        $(item).remove();
    })

    AmortizationDetailAppend();
    recalculateAmortizationRatio();
    $('#AmortizationDetailCreate').remove();
    $('#amoritizationDetail-undone-vendorSelect').hide();
}
function AmortizationDetailAppend(target) {
    let count = $(target).find("tbody").length;
    //$('#amoTbody').clone('id', 'amoTbody_' + count).appendTo($('#AmortizationDetailTableTemplate'))
    var $amo = $('#amoTbody');    // Create your clone

    // Get the number at the end of the ID, increment it, and replace the old id
    var $newAmo = $amo.clone().prop('id', 'amoTbody' + count).show();
    //$newAmo.find('.selectpicker').selectpicker();

    //增加新分攤明細tbody
    $newAmo.appendTo($('#AmortizationDetailTableTemplate'))

    //重新計算項次編號
    $('#AmortizationDetailTableTemplate > tbody').find('tr').find('td:first').each(function (index) {
        $(this).text(index);
    })
}

//寫log在console
function conLog(msg) {
    console.log(msg)
}

//事件結果
function eventHandler(e) {
    let Amountrtn = true
    let CurrencyPrecise = EPO.CurrencyPrecise
    let rate = EPO.Rate
    if (CurrencyPrecise > 6) {
        CurrencyPrecise = 6
    }
    if (e.target.name == "AmortizationRatio") { CurrencyPrecise = 2 }

    function commaFormat(value) { // 加上千分位符號
        return value.toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
            return pre + groupOf3Digital.replace(/\d{3}/g, ',$&');
        })
    }

    //重新計算明細金額

    function EPODetailResultAmountReCount() {
        let DetailList = $.grep(EPO.EPODetail, function (o) { return o.IsDelete != true })
        let AcceptanceAmount = parseFloat($("#AcceptanceAmount").val())
        let Deductible = isDeductible()
        let DetailResultList = $("#EPODetailResult table tbody").not('[alt="amoTbody"]')
        let DetailResult;
        let _OriginalAmount = 0
        let _OriginalTax = 0
        let _TWDAmount = 0
        let _TWDTax = 0

        $.each(DetailList, function (i, o) {
            DetailResult = $(DetailResultList).eq(i)

            let OriginalAmount = accounting.unformat($(DetailResult).find("input[name=_OriginalAmount]").val())
            let OriginalTax = accounting.unformat($(DetailResult).find("input[name=OriginalTax]").val())
            let OriginalSaleAmount = parseFloat(accounting.toFixed(OriginalAmount - OriginalTax, CurrencyPrecise))
            let TWDAmount = Math.round(OriginalAmount * rate)
            let TWDTax = Math.round(OriginalTax * rate)
            let TWDSaleAmount = TWDAmount - TWDTax

            let Detail_OriginalAmount = OriginalAmount
            let Detail_TWDAmount = TWDAmount
            let EPOAmoIN;
            _OriginalAmount += OriginalAmount
            _OriginalTax += OriginalTax
            _TWDAmount += TWDAmount
            _TWDTax += TWDTax

            $(DetailResult).find("td[name=TWDAmount]").text(fun_accountingformatNumberdelzero(TWDAmount))
            $(DetailResult).find("td[name=TWDTax]").text(fun_accountingformatNumberdelzero(TWDTax))
            $(DetailResult).find("td[name=OriginalSaleAmount]").text(fun_accountingformatNumberdelzero(OriginalAmount - OriginalTax))
            $(DetailResult).find("td[name=TWDSaleAmount]").text(fun_accountingformatNumberdelzero(TWDAmount - TWDTax))
            EPOAmoIN = $(DetailResult).find("#EPOAmoIN").eq(0)

            //先依百分比重算金額
            $.each($(EPOAmoIN).find("tbody"), function (i, o) {
                let AmortizationRatio = parseFloat(accounting.toFixed(parseFloat($(o).find("input[name=AmortizationRatio]").val()) / 100, 4))
                let OriginalAmortizationAmount = 0
                let OriginalAmortizationTWDAmount = 0
                if (Deductible) {
                    OriginalAmortizationAmount = parseFloat(accounting.toFixed(OriginalSaleAmount * AmortizationRatio, CurrencyPrecise))
                }
                else {
                    OriginalAmortizationAmount = parseFloat(accounting.toFixed(OriginalAmount * AmortizationRatio, CurrencyPrecise))
                }
                OriginalAmortizationTWDAmount = parseFloat(accounting.toFixed(OriginalAmortizationAmount * rate))

                $(o).find("input[name=OriginalAmortizationAmount]").val(fun_accountingformatNumberdelzero(OriginalAmortizationAmount))

                $(o).find("input[name=OriginalAmortizationTWDAmount]").val(fun_accountingformatNumberdelzero(OriginalAmortizationTWDAmount))
            })

            EPOAmoINResultAmountReCount(EPOAmoIN)
        })
        $("#CertificateAmount").text(fun_accountingformatNumberdelzero(_OriginalAmount))
        $("#OriginalAmount").text(fun_accountingformatNumberdelzero(_OriginalTax))
        $("#TWDAmount").text(fun_accountingformatNumberdelzero(_TWDAmount))
        $("#TWDTaxAmount").text(fun_accountingformatNumberdelzero(_TWDTax))
    }

    //重新計算分攤金額
    function EPOAmoINResultAmountReCount(target) {
        let Detail_OriginalAmount
        let EPOAmoIN = target
        let EdetailTbody = $(EPOAmoIN).closest("tbody");
        let AmoINTbodyList = $(EPOAmoIN).find("tbody")
        // let _proprotion = 1//換算倍率
        let OriginalAmount = accounting.unformat($(EdetailTbody).find("input[name=_OriginalAmount]").val())
        let OriginalTax = accounting.unformat($(EdetailTbody).find("input[name=OriginalTax]").val())
        let OriginalSaleAmount = parseFloat(accounting.toFixed(OriginalAmount - OriginalTax, CurrencyPrecise))
        let TWDAmount = accounting.unformat($(EdetailTbody).find("td[name=TWDAmount]").text())
        let TWDTax = accounting.unformat($(EdetailTbody).find("td[name=TWDAmount]").text())
        let TWDSaleAmount = accounting.unformat($(EdetailTbody).find("td[name=TWDSaleAmount]").text())
        let Deductible = isDeductible()
        let _parsent = 0;
        if (Deductible) {
            Detail_OriginalAmount = OriginalSaleAmount
            Detail_TWDAmount = TWDSaleAmount
        }
        else {
            Detail_OriginalAmount = OriginalAmount
            Detail_TWDAmount = TWDAmount
        }
        if ($(AmoINTbodyList).length == 1) {
            $(EPOAmoIN).find("input[name=OriginalAmortizationAmount]").val(fun_accountingformatNumberdelzero(Detail_OriginalAmount))
            $(EPOAmoIN).find("td[name=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(Detail_TWDAmount))
            $(EPOAmoIN).find("input[name=AmortizationRatio]").val(100)
        }
        else {
            let _OriginalAmortizationAmount = 0
            let _OriginalAmortizationTWDAmount = 0

            console.log("分攤明細循環試算")
            let __AmoINStart = (new Date).getTime();
            $(AmoINTbodyList).each(function (i) {
                let __AmoINIndexStart = (new Date).getTime();

                //  _OriginalAmortizationAmount = parseFloat(accounting.toFixed(accounting.unformat($(this).find("input[name=OriginalAmortizationAmount]").val()) * _proprotion, CurrencyPrecise))
                _OriginalAmortizationAmount = parseFloat(accounting.unformat($(this).find("input[name=OriginalAmortizationAmount]").val()))
                _OriginalAmortizationTWDAmount = parseInt(accounting.toFixed(_OriginalAmortizationAmount * rate))

                if (Math.abs(Detail_OriginalAmount) < Math.abs(_OriginalAmortizationAmount)) {
                    $(this).find("input[name=OriginalAmortizationAmount]").val(fun_accountingformatNumberdelzero(Detail_OriginalAmount))

                    _parsent = (Deductible) ? accounting.toFixed((Detail_OriginalAmount / OriginalSaleAmount) * 100, 2) : accounting.toFixed((Detail_OriginalAmount / OriginalAmount) * 100, 2)
                    $(this).find("input[name=AmortizationRatio]").val(fun_accountingformatNumberdelzero(_parsent))
                    _OriginalAmortizationAmount = Detail_OriginalAmount;
                    Detail_OriginalAmount = 0

                    $(this).find("td[name=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(Detail_TWDAmount))
                    Detail_TWDAmount = 0
                }
                else {
                    Detail_OriginalAmount = accounting.unformat(accounting.toFixed(Detail_OriginalAmount - _OriginalAmortizationAmount, CurrencyPrecise))
                    _parsent = (Deductible) ? accounting.toFixed((_OriginalAmortizationAmount / OriginalSaleAmount) * 100, 2) : accounting.toFixed((_OriginalAmortizationAmount / OriginalAmount) * 100, 2)

                    $(this).find("input[name=OriginalAmortizationAmount]").val(fun_accountingformatNumberdelzero(_OriginalAmortizationAmount))
                    $(this).find("td[name=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(_OriginalAmortizationTWDAmount))
                    $(this).find("input[name=AmortizationRatio]").val(fun_accountingformatNumberdelzero(_parsent))
                    Detail_TWDAmount = Detail_TWDAmount - _OriginalAmortizationTWDAmount
                }

                console.log("分攤明細循環試算 第" + (i + 1) + "筆，花費" + ((new Date).getTime() - __AmoINIndexStart) / 1000 + "秒")
            })

            //試算末欄金額
            if (Detail_TWDAmount != 0 || Detail_OriginalAmount != 0) {
                let lastAmoIn = $(AmoINTbodyList).last()
                lastOriginalAmount = accounting.unformat($(lastAmoIn).find("input[name=OriginalAmortizationAmount]").val())
                lastOriginalAmount = accounting.unformat(accounting.toFixed(lastOriginalAmount + Detail_OriginalAmount, CurrencyPrecise))

                $(lastAmoIn).find("input[name=OriginalAmortizationAmount]").val(fun_accountingformatNumberdelzero(lastOriginalAmount))

                lastOriginalAmortizationTWDAmount = accounting.unformat($(lastAmoIn).find("td[name=OriginalAmortizationTWDAmount]").text())
                $(lastAmoIn).find("td[name=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(lastOriginalAmortizationTWDAmount + Detail_TWDAmount))

                _parsent = (Deductible) ? accounting.toFixed((lastOriginalAmount / OriginalSaleAmount) * 100, 2) : accounting.toFixed((lastOriginalAmount / OriginalAmount) * 100, 2)
                $(lastAmoIn).find("input[name=AmortizationRatio]").val(fun_accountingformatNumberdelzero(_parsent))
            }

            console.log("分攤明細循環試算結束，總花費" + ((new Date).getTime() - __AmoINStart) / 1000 + "秒")
        }
    }

    //金額欄位檢查
    function AmountCheck() {
        let rtn = false
        let Zero = $(e.target).attr("Zero");
        let hasCurrencyPrecise = $(e.target).is("[CurrencyPrecise]");
        let Max = $(e.target).attr("Max");
        let Err = errObj.Amount
        let price = parseFloat(accounting.unformat(e.target.value))
        let abs_price = Math.abs(price)

        if (errObj[e.target.id] != undefined) {
            Err = errObj[e.target.id]
        }

        if (e.target.id != "") {
            if (__price[e.target.id] === undefined) {
                __price[e.target.id] = 0;
            }
        }
        else {
            __price[""] = price;
        }

        if (!isNaN(price)) {
            if (!(String(Zero).toLocaleLowerCase() == "true") && abs_price <= 0) {
                fun_AddErrMesg(e.target, e.target.id, errObj.AmountNoZero)
            }
            else {
                if (!isNaN(Max) && abs_price > Math.abs(Max)) {
                    if (Max > 0) {
                        fun_AddErrMesg(e.target, e.target.id, "數字需小於等於" + fun_accountingformatNumberdelzero(Max))
                    }
                    else {
                        fun_AddErrMesg(e.target, e.target.id, "數字需大於等於" + fun_accountingformatNumberdelzero(Max))
                    }
                }
                else {
                    if (String(price).indexOf(".") > 0) {
                        if (hasCurrencyPrecise) {
                            if ((String(price).length - String(price).indexOf(".") - 1) > CurrencyPrecise) {
                                fun_AddErrMesg(e.target, e.target.id, "小數點不得超過" + CurrencyPrecise + "位")
                            }
                            else {
                                rtn = true
                            }
                        }
                        else {
                            fun_AddErrMesg(e.target, e.target.id, "請輸入整數")
                        }
                    }
                    else {
                        rtn = true
                    }
                }
            }
        }
        else {
            fun_AddErrMesg(e.target, e.target.id, errObj.Amount)
        }

        if (!isNaN(Max)) {
            if (Max < 0) {
                price = abs_price * -1//轉負數
            }
            else {
                price = abs_price//轉正數
            }
        }
        /*if (EPO.ExpenseKind == "PO_CM_RETURN") {
            if (e.target.id == "Rate" || e.target.name == "AmortizationRatio") {
                price = abs_price//轉正數
            }
            else {
                price = abs_price * -1//轉負數
            }
        }
        else {
            price = abs_price//轉正數
        }*/

        if (rtn) {
            if (e.target.id != "") {
                __price[e.target.id] = price
            }
            $(e.target).val(fun_accountingformatNumberdelzero(price));
        }
        else {
            if (e.target.id != "") {
                $(e.target).val(__price[e.target.id]);
            }
            else {
                $(e.target).val(__price[""]);
            }
        }

        return rtn
    }

    /*  switch (e.target.type) {
          case "checkbox":
              //EPO[e.target.id] = e.target.checked
            //  conLog(e.target.id + "-" + e.target.checked)
              //請款明細selected的處理
              if (e.target.id.indexOf('PO') !== -1) {
                  if (e.target.checked === true) {
                      if (data.indexOf(e.target.id) === -1) {
                          data.push(e.target.id)
                      }
                  } else {
                      data.remove(e.target.id)
                  }
              }
              break
          case "text":
              //EPO[e.target.id] = e.target.value
              //$("#" + e.target.id).val(commaFormat(e.target.value))  千分位設定
             // conLog(e.target.id + "-" + e.target.value)
              break
          case "number":
              //$("#" + e.target.id).val(commaFormat(e.target.value))
             // conLog(e.target.id + "-" + e.target.value)
              break
          default:
              //EPO[e.target.id] = e.target.value
            //  conLog(e.target.id + "-" + e.target.value)
              break
      }*/

    //Amount 處理
    if ((e.type == "blur" || e.type == "focusout") && e.target.hasAttribute("Amount")) {
        Amountrtn = AmountCheck()
    }

    switch (e.target.id) {
        case "ForeignLabor":
            {
                if (e.target.checked && (EPO.Currency == "TWD" || EPO.CertificateKind == "I")) {
                    e.target.checked = false
                    alertopen(errObj.ForeignLabor)
                }
            }
            break;

        case "Deduction":
            {
                if (EPO.CertificateKind == "I") {
                    alertopen(errObj.Deduction)
                    e.target.checked = false;
                    return false
                }

                if (e.target.checked) {
                    $("#IncomeTaxTable").find("input").val("")
                    $("#IncomeTaxTable").find("select").val("").selectpicker("refresh")
                    $("#IncomeTaxTable").find("#IncomeCodeDisable").html("<span class=\"undone-text\">點選按鈕新增</span>")
                    $("#IncomeTaxTable").find("#CountryCodeDisable").html("<span class=\"undone-text\">點選按鈕新增</span>")
                    let IncomeTax = {}

                    if (EPO.IncomeTax.IncomeID > 0) {
                        IncomeTax = EPO.IncomeTax
                    }
                    else {
                        if (vendorInfo != undefined) {
                            IncomeTax = {
                                IncomeNum: vendorInfo.vatRegistrationNumber,
                                IncomePerson: vendorInfo.supplierName,
                                IsTwoHealthInsurance: (EPO.AcceptanceAmount >= 20000) ? "Y" : "N",
                                PermanentPostNum: vendorInfo.supplierSite[0].invoiceZipCode,
                                PermanentAddress: vendorInfo.supplierSite[0].invoiceCity + vendorInfo.supplierSite[0].invoiceAddress,
                                ContactPostNum: vendorInfo.supplierSite[0].contactZipCode,
                                ContactAddress: vendorInfo.supplierSite[0].contactCity + vendorInfo.supplierSite[0].contactAddress,
                                CertficateKind: vendorInfo.identityFlag,
                                TwoHeathInsuranceFlag: Get2NHIFlag(vendorInfo.supplierNumber),
                                IncomeCode: vendorInfo.supplierSite[0].taxCode,
                                TaxName: $.map(WtTax, function (o) {
                                    if (o.wtTaxCode == vendorInfo.supplierSite[0].taxCode) {
                                        return o.wtTaxtCodeDescription
                                    }
                                })[0]
                            }
                        }
                    }

                    $.when(FiisDataAjax.promise()).done(function () {
                        putIncomeTaxInformation(IncomeTax)
                        fun_CertficateKindchange("")
                        fun_IncomeCodechange(IncomeTax.IncomeCode)

                        $("#IncomeTaxInformation").show()
                    })
                }
                else {
                    $("#IncomeTaxInformation").hide()
                    Databinding_Prepayment()
                    let PrepaymentAmount = 0
                    if (EPO.Prepayment.length > 0) {
                        PrepaymentAmount = $.map(EPO.Prepayment, function (o) { if (!o.IsDelete) { return o.WriteOffAmount } }).reduce(function (x, y) { return x + y })
                    }
                    let TwdAmount = accounting.unformat($("#TWDAmount").text())
                    let MARGINAMT = accounting.unformat($("#MARGINAMT").val())
                    $("#PaymentAmount").text(fun_accountingformatNumberdelzero(TwdAmount - MARGINAMT - PrepaymentAmount))
                }

                fun_DeductionChuang()
            }
            break;

        case "VoucherBeau":
            {
                console.log("憑證開立對象事件")
                let voucher = $(e.target).find('option:selected')
                $('#textBooks').text(voucher.data("accountCode"));
                $('#VoucherBeauName').val(voucher.text());
                $('#Books').val(voucher.data("accountCode"));
                $('#BooksName').val(voucher.data("accountName"));
                $('#isCreditCardOffice').val(voucher.data("isCreditCardOffice"));
                $('#gvDeclaration').val(voucher.data("gvDeclaration"));
                let selectedOptionIndex = null;
                $("select[name=AccountBank]").each(function (i, o) {
                    if (isNullOrEmpty($(o).val())) {
                        if (selectedOptionIndex != null) {
                            $(o)[0].selectedIndex = selectedOptionIndex
                        }
                        else {
                            let selectedOption = $(o).find("option[value='" + voucher.data("accountCode") + "']")
                            if (selectedOption.length == 0) { return false }
                            else {
                                selectedOption.prop("selected", true)
                                selectedOptionIndex = $(o)[0].selectedIndex
                            }
                        }

                        //$(o).val(voucher.data("accountCode")).selectpicker("refresh")
                    }
                })
                break;
            }
        case "CertificateKind":
            {
                switch (e.target.value) {
                    case "I"://發票
                        if ($("#Deduction").prop("checked")) {
                            alertopen(errObj.Deduction2)
                            $("#CertificateKind").val("").selectpicker("refresh")

                            removeNecessaryColumn("CertificateNum")
                            removeNecessaryColumn("EstimateVoucherDate")
                            removeNecessaryColumn("DiscountInvoice")
                            removeNecessaryColumn("DiscountInvoiceDate")
                            $("#CertificateNum").attr("maxlength", 15)
                            $("[name=OriginalTax]").val(0).addClass("input-disable").prop("disabled", true)
                            return false
                        }

                        necessaryColumn("CertificateNum")
                        necessaryColumn("EstimateVoucherDate")

                        //$("#OriginalAmount").attr("Max", accounting.unformat($("#CertificateAmount").val())).removeClass("input-disable").attr("disabled", false)
                        $("#CertificateNum").attr("maxlength", 10)

                        removeNecessaryColumn("DiscountInvoice")
                        removeNecessaryColumn("DiscountInvoiceDate")
                        $("[name=OriginalTax]").removeClass("input-disable").prop("disabled", false)

                        break;
                    case "C"://折讓
                        //necessaryColumn("DiscountInvoice")
                        //necessaryColumn("DiscountInvoiceDate")
                        //necessaryColumn("EstimateVoucherDate")

                        //$("#OriginalAmount").attr("Max", Math.abs(accounting.unformat($("#CertificateAmount").val())))
                        $("#DiscountInvoice").attr("maxlength", 15)
                        $("[name=OriginalTax]").removeClass("input-disable").prop("disabled", false)
                        removeNecessaryColumn("CertificateNum")
                        break;

                    default:
                        removeNecessaryColumn("CertificateNum")
                        removeNecessaryColumn("EstimateVoucherDate")
                        removeNecessaryColumn("DiscountInvoice")
                        removeNecessaryColumn("DiscountInvoiceDate")
                        // $("#OriginalAmount").attr("Max", 0).val(0).addClass("input-disable").attr("disabled", true).blur()
                        $("#CertificateNum").attr("maxlength", 15)
                        $("[name=OriginalTax]").val(0).addClass("input-disable").prop("disabled", true)

                        break;
                }

                if (detailDeferred.state() == "resolved") {
                    if (__Deductible != isDeductible()) {
                        //表單扣抵否有變動則重算金額
                        __Deductible = !(__Deductible)
                        EPODetailResultAmountReCount()
                    }
                }
                $("#EstimateVoucherDate").triggerHandler("blur")
            }
            break

        case "CertificateNum":
            {
                //處理逸脫字元
                rtn = true;
                if (String(e.target.value).indexOf("\\") != -1) {
                    rtn = false;
                    fun_AddErrMesg(e.target, "ErrCertificateNum", errObj.CertificateNum2)
                }

                if (rtn) {
                    if ($("#CertificateKind").val() == "I") {
                        reg = /^([A-z]){2}[0-9A-z]{8}$/
                    }
                    else {
                        reg = /^[0-9A-z]*$/
                    }

                    if (String(e.target.value).search(reg) != 0) {
                        rtn = false;
                        fun_AddErrMesg(e.target, "ErrCertificateNum", errObj.CertificateNum)
                    }
                    else {
                        if ($("#CertificateKind").val() == "I") {
                            //檢核憑證號碼是否重複
                            {
                                CertificateNum = e.target.value

                                if (CertificateNum.length > 0) {
                                    UsedCertificateNum = null;
                                    $.ajax({
                                        type: 'GET',
                                        url: "/EPO/GetCertificateNumUsed",
                                        data: { CertificateNum: CertificateNum, FormID: __FormID },
                                        async: false,
                                        success: function (data) {
                                            if (data != 0) {
                                                fun_AddErrMesg(e.target, "ErrCertificateNum", "發票號碼重覆")
                                                return false;
                                            }
                                        },
                                        error: function (data) {
                                        }
                                    })
                                }
                            }
                            //檢核憑證號碼是否重複
                        }
                    }
                }
            }
            break;

        case "DiscountInvoice":
            //處理逸脫字元
            rtn = true;

            if (e.target.value.length > 0) {
                $("#DiscountInvoiceDate").toggleClass("input-disable", false).prop("disabled", false)
            }
            else {
                $("#DiscountInvoiceDate").toggleClass("input-disable", true).prop("disabled", true)
                $("#DiscountInvoiceDate").val("");
            }

            break;

        case "EstimateVoucherDate":
            {
                //檢核[憑證日期]是否合理，依據申報期間來看不可超過兩期，申報期為兩個月一期(1-2,3-4,5-6,7-8,9-10,11-12) 不可大於現在日期
                //跨年度為逾期
                //僅發票需檢核逾期  折讓不允許逾期
                //折讓申報期只有一期

                meg = []
                let YearVoucher = $("#YearVoucher").val()
                let InvoiceOverdue = $("#InvoiceOverdue").val()
                removeNecessaryColumn("YearVoucher")
                $("#YearVoucher").val("")
                $("#YearVoucher").closest(".content-box").hide()
                removeNecessaryColumn("InvoiceOverdue")
                $("#InvoiceOverdue").val("")
                $("#InvoiceOverdue").closest(".content-box").hide()

                let edate = new Date(e.target.value)
                let Now = new Date()
                Now.setDate(1)
                if (isNaN(edate.getDate())) {
                    //e.target.value = "";
                }
                else {
                    let int_edate = parseInt(String(edate.getFullYear()) + funAddheadZero(2, edate.getMonth()))
                    let int_Now = parseInt(String(Now.getFullYear()) + funAddheadZero(2, Now.getMonth()))
                    if ((Now.getMonth() + 1) % 2 == 0) Now.setMonth(Now.getMonth() - 1);//若為偶數月則在減一個月 *月份從0開始

                    if ($("#CertificateKind").val() == "C") {
                        if (int_edate < int_Now) {
                            e.target.value = ""
                            meg.push(errObj.EstimateVoucherDate)
                        }
                        else {
                            let DiscountInvoiceDate = new Date($("#DiscountInvoiceDate").val())
                            let EstimateVoucherDate = new Date(e.target.value)

                            if (DiscountInvoiceDate.valueOf() > EstimateVoucherDate.valueOf()) {
                                fun_AddErrMesg(e.target, "ErrEstimateVoucherDate", errObj.EstimateVoucherDate_Err)
                            }
                            else {
                                $("[alt=ErrDiscountInvoiceDate]").remove()
                                $("[alt=ErrEstimateVoucherDate]").remove()
                            }
                        }
                    }
                    else {
                        if (new Date().getFullYear() != edate.getFullYear()) {
                            meg.push(alertMesage.EstimateVoucherDateOverYear)

                            necessaryColumn("YearVoucher")
                            $("#YearVoucher").val(YearVoucher)
                            $("#YearVoucher").closest(".content-box").show()
                            if ($("#CertificateKind").val() == "I" || $("#CertificateKind").val() == "C") {
                                meg.push(alertMesage.EstimateVoucherDateOverMonth)
                                necessaryColumn("InvoiceOverdue")
                                $("#InvoiceOverdue").val(InvoiceOverdue)
                                $("#InvoiceOverdue").closest(".content-box").show()
                            }
                        }
                        else {
                            if ($("#CertificateKind").val() == "I") {
                                Now.setMonth(Now.getMonth() - 2)//往前算一期
                                int_Now = parseInt(String(Now.getFullYear()) + funAddheadZero(2, Now.getMonth()))

                                if (int_edate < int_Now) {
                                    meg.push(alertMesage.EstimateVoucherDateOverMonth)
                                    necessaryColumn("InvoiceOverdue")
                                    $("#InvoiceOverdue").val(InvoiceOverdue)
                                    $("#InvoiceOverdue").closest(".content-box").show()
                                }
                            }
                        }
                    }

                    if (meg.length > 0) {
                        alertopen(meg)
                    }
                }
            }
            break;

        case "DiscountInvoiceDate":
            let DiscountInvoiceDate = new Date(e.target.value)
            let EstimateVoucherDate = new Date($("#EstimateVoucherDate").val())

            if (DiscountInvoiceDate.valueOf() > EstimateVoucherDate.valueOf()) {
                fun_AddErrMesg(e.target, "ErrDiscountInvoiceDate", errObj.DiscountInvoiceDate)
            }
            else {
                $("[alt=ErrDiscountInvoiceDate]").remove()
                $("[alt=ErrEstimateVoucherDate]").remove()
            }

            break;

        case "PaymentMethod":
            $("#PaymentMethodName").val($(e.target).find("option:selected").text())
            if (e.target.value.toLocaleUpperCase() == "WIRE") {//電匯
                $("#AccountNameDisable").show()
                $("#AccountNameInput").hide()
                $("#AccountSelectBtn").show()
            }
            else {
                $("#AccountSelectBtn").hide()
                $("#AccountNameDisable").hide()
                if ($("#AccountNameInput").val() == "") {
                    $("#AccountNameInput").val(vendorInfo.supplierName)
                }
                $("#AccountNameInput").show()

                $('#AccountDescDisable').text("");
                $('#AccountDesc').val("");

                $('#BankAccountId').val("")
                $('#BankNameDisable').text("");
                $('#BankName').val("");
                $('#Bank').val("");

                $('#AccountNumDisable').text("");
                $('#AccountNum').val("");

                $('#AccountNameDisable').text("");
                $('#AccountName').val("");

                $('#BranchNameDisable').text("");
                $('#BranchName').val("");
                $('#Branch').val("");
            }
            break;

        case "Rate":
            if (Amountrtn) {
                let _rate = accounting.unformat(e.target.value)
                if (!isNaN(_rate) && rate > 0) {
                    rate = _rate
                    EPO.Rate = _rate
                }
                else {
                    rate = 1
                    $("#Rate").val(1)
                    EPO.Rate = 1
                }
                EPODetailResultAmountReCount()

                Databinding_Prepayment()
                let PrepaymentAmount = 0
                if (EPO.Prepayment.length > 0) {
                    PrepaymentAmount = $.map(EPO.Prepayment, function (o) { if (!o.IsDelete) { return o.WriteOffAmount } }).reduce(function (x, y) { return x + y })
                }
                let TwdAmount = accounting.unformat($("#TWDAmount").text())
                let WithholdingTax = accounting.unformat($("#WithholdingTaxInput").val())
                let SupplementPremium = accounting.unformat($("#SupplementPremiumInput").val())
                $("#PaymentAmount").text(fun_accountingformatNumberdelzero(TwdAmount - PrepaymentAmount - WithholdingTax - SupplementPremium))
            }
            break;

        case "PayReMark":
            rtn = true;
            if (e.target.value.length > 0) {
                //處理逸脫字元
                if (String(e.target.value).indexOf("\\") != -1) {
                    rtn = false;
                    fun_AddErrMesg(e.target, "ErrCertificateNum", errObj.PayReMark)
                }
                if (EPO.Currency != "TWD") {
                    let reg = /^[0-9A-z(),-.`+ ][0-9A-z(),-.`+: ]*$/
                    if (String(e.target.value).search(reg) != 0) {
                        rtn = false;
                        fun_AddErrMesg(e.target, "ErrPayReMark", errObj.PayReMark)
                    }
                    else {
                        if (String(e.target.value).length > 135) {
                            rtn = false;
                            fun_AddErrMesg(e.target, "ErrPayReMark", "輸入字串超過135半形字，請修正")
                        }
                    }
                }
                else {
                    if (String(e.target.value).indexOf(':') == 0) {
                        rtn = false;
                        fun_AddErrMesg(e.target, "ErrPayReMark", '付款附言第一字不可為":"')
                    }
                    else {
                        if (String(e.target.value).length > 45) {
                            rtn = false;
                            fun_AddErrMesg(e.target, "ErrPayReMark", "輸入字串超過45半形字(每一全形長度為2-3)，請修正")
                        }
                    }
                }
            }
            else {
            }

            break;

        case "IsDeduction":
            EPO.BusinessTax.IsDeduction = e.target.value
            if (__Deductible != isDeductible()) {
                //表單扣抵否有變動則重算金額
                __Deductible = !(__Deductible)
                EPODetailResultAmountReCount()
            }

            break;

        case "WriteOffAmountInput":
        case "MARGINAMT":
        case "SupplementPremiumInput":
        case "WithholdingTaxInput":
            if (Amountrtn) {
                Databinding_Prepayment()
                let PrepaymentAmount = 0
                if (EPO.Prepayment.length > 0) {
                    PrepaymentAmount = $.map(EPO.Prepayment, function (o) { if (!o.IsDelete) { return o.WriteOffAmount } }).reduce(function (x, y) { return x + y })
                }
                let TwdAmount = accounting.unformat($("#TWDAmount").text())
                let WithholdingTax = accounting.unformat($("#WithholdingTaxInput").val())
                let SupplementPremium = accounting.unformat($("#SupplementPremiumInput").val())
                let MARGINAMT = accounting.unformat($("#MARGINAMT").val())
                $("#PaymentAmount").text(fun_accountingformatNumberdelzero(TwdAmount - PrepaymentAmount - WithholdingTax - SupplementPremium - MARGINAMT))
            }
            break;
    }

    switch (e.target.name) {
        case "AccountBank":

            if (__Deductible != isDeductible()) {
                //表單扣抵否有變動則重算金額
                __Deductible = !(__Deductible)
                EPODetailResultAmountReCount()
            }
            break;

        case "CostProfitCenter":
            if ($(e.target).find("option:selected").attr("isProductRequired") == "Y") {
                $(e.target).closest("tbody").find("ProductDetail").attr("necessary", "")
            }
            else {
                $(e.target).closest("tbody").find("ProductDetail").removeAttr("necessary")
            }

            break;

        case "OriginalAmortizationAmount":
            if (Amountrtn) {
                EPOAmoINResultAmountReCount($(e.target).closest("#EPOAmoIN"))
            }
            break;

        case "OriginalTax":
            if (Amountrtn) {
                EPODetailResultAmountReCount()
            }

        case "AmortizationRatio":
            if (Amountrtn) {
                //懶得改太多 直接重算金額之後再丟出去
                let _OriginalAmount = (!isDeductible()) ? parseFloat(accounting.unformat($(e.target).closest("table").closest("tbody").find("[name=_OriginalAmount]").val())) : parseFloat(accounting.unformat($(e.target).closest("table").closest("tbody").find("[name=OriginalSaleAmount]").text()))

                //分攤比率的小數點固定為2，需重新取得正確小數位
                let _CurrencyPrecise = EPO.CurrencyPrecise
                if (_CurrencyPrecise > 4) { _CurrencyPrecise = 4 }

                $(e.target).closest("tr").find("[name=OriginalAmortizationAmount]").val(accounting.toFixed(_OriginalAmount * (e.target.value / 100), _CurrencyPrecise)).blur()
            }

            break;
        case "_OriginalAmount":
            if (Amountrtn) {
                $(e.target).closest("tr").find("[name=OriginalTax]").attr("Max", e.target.value)
                EPODetailResultAmountReCount()

                Databinding_Prepayment()
                let PrepaymentAmount = 0
                if (EPO.Prepayment.length > 0) {
                    PrepaymentAmount = $.map(EPO.Prepayment, function (o) { if (!o.IsDelete) { return o.WriteOffAmount } }).reduce(function (x, y) { return x + y })
                }
                let TwdAmount = accounting.unformat($("#TWDAmount").text())
                let WithholdingTax = accounting.unformat($("#WithholdingTaxInput").val())
                let SupplementPremium = accounting.unformat($("#SupplementPremiumInput").val())
                let MARGINAMT = accounting.unformat($("#MARGINAMT").val())
                $("#PaymentAmount").text(fun_accountingformatNumberdelzero(TwdAmount - PrepaymentAmount - WithholdingTax - SupplementPremium - MARGINAMT))
            }
            break;

            /* case "SelectIsIncomeDeduction":
                 EPODetailResultAmountReCount()

                 break;*/

        case "AmortizationStartDate":
            if (e.target.value != "") {
                let AmortizationEndDate = $(e.target).closest("td").find("[name=AmortizationEndDate]")
                $(AmortizationEndDate).attr("Necessary", true)
                if ($(AmortizationEndDate).val() != "") {
                    let StartDate = new Date(e.target.value)
                    let EndDate = new Date($(AmortizationEndDate).val())

                    if (StartDate.valueOf() > EndDate.valueOf()) {
                        let tmp = e.target.value
                        e.target.value = $(AmortizationEndDate).val()
                        $(AmortizationEndDate).val(tmp)
                    }
                }
            }
            else {
                $(e.target).closest("td").find("[name=AmortizationEndDate]").removeAttr("Necessary")
            }

            break;
        case "AmortizationEndDate":
            if (e.target.value != "") {
                $(e.target).closest("td").find("[name=AmortizationStartDate]").attr("Necessary", true)
                let AmortizationStartDate = $(e.target).closest("td").find("[name=AmortizationStartDate]")
                if ($(AmortizationStartDate).val() != "") {
                    let StartDate = new Date($(AmortizationStartDate).val())
                    let EndDate = new Date(e.target.value)

                    if (StartDate.valueOf() > EndDate.valueOf()) {
                        let tmp = e.target.value
                        e.target.value = $(AmortizationStartDate).val()
                        $(AmortizationStartDate).val(tmp)
                    }
                }
            }
            else {
                $(e.target).closest("td").find("[name=AmortizationStartDate]").removeAttr("Necessary")
            }

            break;
    }
}

//設定事件
function SetEvents() {
    //供應商選擇帶入
    $(document).on('confirmation', '.remodal', function (e) {
        //移除錯誤訊息
        $("#VendorNameAndNum").next(".error-text").remove()

        console.log('confirmation');
    });

    //設定TextBox輸入事件
    $(document).on("blur", "input", function (e) {
        //移除錯誤訊息
        $(e.target).next(".error-text").remove()

        eventHandler(e)
    })

    //設定TextBox輸入事件
    $(document).on("focus", "input", function (e) {
        //移除錯誤訊息
        $(e.target).next(".error-text").remove()

        if (e.target.hasAttribute("Amount")) {
            e.target.value = accounting.unformat(e.target.value)
        }

        //eventHandler(e)
    })

    //設定TextArea輸入事件
    $("textarea").on("input", function (e) {
        //移除錯誤訊息
        var id = "#" + e.target.id
        $(id).next(".error-text").remove()

        eventHandler(e)
    })

    //設定Select Change的事件
    $("select").on("change", function (e) {
        //移除錯誤訊息
        var id = "#" + e.target.id
        $(id).next('.error-text').remove()
        eventHandler(e)
    })

    //設定CheckBox change的事件
    $("input:checkbox").on("change", function (e) {
        //移除錯誤訊息
        var id = "#" + e.target.id
        $(id).next().next(".error-text").remove()

        eventHandler(e)
    })

    //取得憑證開立對象
    cerObject = $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '/EPO/GetCertificateObject?EPONum=' + $('#P_SignID').val(),
        success: function (data) {
            $.each(data, function (key, txt) {
                $('#VoucherBeau').append($("<option></option>").attr("value", txt.bANNumber).text(txt.businessEntity)
                    .attr("data-subtext", txt.bANNumber).data("isCreditCardOffice", txt.isCreditCardOffice).data("gvDeclaration", txt.gvDeclaration).data("accountCode", txt.accountCode).data("accountName", txt.accountName));
            })
            $('#VoucherBeau').selectpicker('refresh');
            $('#VoucherBeau option[value=' + FormData.VoucherBeau + ']').attr("selected", "selected");
            $('#VoucherBeau').selectpicker('refresh');
            _VoucherBeauCollection = data;
        },
        error: function (data) {
        }
    })

    $(document).on('click', '#AccountOpen', function () {
        $('[data-remodal-id=SelectAccount]').remodal().open();
    });

    $('#AccountConfirm').on('click', function () {
        AccountConfirm()
    });
}

function AccountConfirm() {
    var selectTarget = $('input[name="AccountSelector"]:checked').parents('li.AccountSelect');

    if ($(selectTarget).find('div.popup-PaymentDescription').text() != null && $(selectTarget).find('div.popup-PaymentDescription').text() != undefined) {
        $('#AccountDescDisable').text($(selectTarget).find('div.popup-PaymentDescription').text());
        $('#AccountDesc').val($(selectTarget).find('div.popup-PaymentDescription').text());
    }
    $('#BankAccountId').val($(selectTarget).find('input[name="AccountSelector"]:checked').val())
    $('#BankNameDisable').text($(selectTarget).find('div.popup-PaymentBank').text());
    $('#BankName').val($(selectTarget).find('div.popup-PaymentBank').text().replace(/\d+\s+/g, ''));
    $('#Bank').val($(selectTarget).find('div.popup-PaymentBank').text().replace(/\D+/g, ''));

    $('#AccountNumDisable').text($(selectTarget).find('div.popup-PaymentAccount').text());
    $('#AccountNum').val($(selectTarget).find('div.popup-PaymentAccount').text());

    $('#AccountNameDisable').text($(selectTarget).find('div.popup-PaymentName').text());
    $('#AccountNameInput').val($(selectTarget).find('div.popup-PaymentName').text());

    $('#AccountName').val($(selectTarget).find('div.popup-PaymentName').text());

    $('#BranchNameDisable').text($(selectTarget).find('div.popup-PaymentBranch').text());
    $('#BranchName').val($(selectTarget).find('div.popup-PaymentBranch').text().replace(/\d+\s+/g, ''));
    $('#Branch').val($(selectTarget).find('div.popup-PaymentBranch').text().replace(/\D+/g, ''));
}

//日曆控件的事件
$(".datetimepicker1").on("dp.change", function (e) {
    //取得第一個子元件，是日曆控件的input
    //EPO[e.currentTarget.firstElementChild.id] = e.date.format("YYYY-MM-DD")
    //移除錯誤訊息
    /* var id = "#" + e.currentTarget.firstElementChild.id
     $(id).next(".error-text").remove()
     conLog(e.currentTarget.firstElementChild.id + "-" + e.date.format("YYYY-MM-DD"))*/
    $(this).next(".error-text").remove()
})

//載入請款明細
$("#LoadPODetail").on("click", function (e) {
    //設定查詢結果的動作
    function divEPODetailAction() {
        $("#divEPODetail input:checkbox").off("change");
        $("#divEPODetail input:checkbox").on("change", function (e) {
            //移除錯誤訊息
            var id = "#" + e.target.id
            $(id).next(".error-text").remove()
            // eventHandler(e)
        })

        $("#divEPODetail input[Amount]").on("focus", function (e) {
            //移除錯誤訊息
            $(this).next(".error-text").remove()
            $(this).val(accounting.unformat($(this).val()))
        })

        $("#divEPODetail input[Amount]").on("blur", function (e) {
            eventHandler(e)
        })
    }

    //        var fields = ["ExpenseKind","Currency","VendorNum","Rate"]
    //檢查載入請款明細區塊的必填欄位
    var fields = ["search_ExpenseKind", "search_Currency", "VendorInfo"]
    if (verifyFieldsInput(fields, $("#VendorBlock")) === true) {
        $.blockUI({ message: '資料讀取中...' })

        $("#EPODetailBlock").show(200)
        VendorInfo = $("#VendorInfo").data("data")

        //取得請款明細
        vendorInfo = {
            sourceKeyId: __epoNum, EPOExpenseKind: $("#search_ExpenseKind").val(), supplierNumber: VendorInfo.supplierNumber, supplierSiteCode: VendorInfo.supplierSite[0].supplierSiteCode,
            supplierName: VendorInfo.supplierName, Currency: $("#search_Currency").val(), EmpNum: $("#LoginEno").val(), vatRegistrationNumber: VendorInfo.vatRegistrationNumber,
            CurrencyName: $("#search_Currency").find("option:selected").text(), CurrencyPrecise: $("#search_Currency").find("option:selected").data("extendedPrecision"),
            taxCode: VendorInfo.supplierSite[0].taxCode, identityFlag: VendorInfo.supplierSite[0].identityFlag, textExpenseKind: $("#search_ExpenseKind").find("option:selected").text(),
            supplierTypeLookupCode: VendorInfo.supplierTypeLookupCode, supplierID: VendorInfo.supplierID, supplierSite: VendorInfo.supplierSite, supplierBank: VendorInfo.supplierBank,
            EPOID: EPO.FormID
        }
        var epoDetail = ajaxPartialView(url, vendorInfo, function (content) {
            $("#divEPODetail").html(content)

            $("#divEPODetail").find("td[Amount]").each(function (i, o) {
                $(o).text(fun_accountingformatNumberdelzero($(o).text()))
            })
            $("#divEPODetail").find("input[Amount]").each(function (i, o) {
                $(o).val(fun_accountingformatNumberdelzero($(o).val()))
            })

            //之後取得所以需再設定CheckBox change的事件
            divEPODetailAction()
            //將上次的選擇結果移除
            //  data = [];
        })

        //取得已收貨未驗收 *沒有這個

        /*var unAcc = ajaxPartialView(unAcceptanceUrl, vendorInfo, function (content) {
            $("#EPOUnAcceptanceResult").html(content)
        })*/

        //取得未收貨
        var unRec = ajaxPartialView(unReceivingUrl, vendorInfo, function (content) {
            $("#EPOUnReceivingResult").html(content)
        })

        //非同步都做完了才解除讀取中
        $.when(epoDetail.promise(), unRec.promise()).always(function (xhrObject1, xhrObject2) {
            /*$("#EPOUnReceivingResult,#EPODetail").find("td[Amount]").each(function () {
                $(this).text(fun_accountingformatNumberdelzero($(this).text()))
            })*/
            $("[id=__pageDiv").remove()

            EPODetailTable = getDetailModelList()

            //分頁
            let Detailpagediv = writeTablePage(EPODetailTable.length, function (page, pagerow) {
                //取出資料存回EPODetailTable
                $.each($("#divEPODetail table").find(".EPODetailSerno"), function (i, o) {
                    let checkbox = $(o).find(":checkbox")
                    let DiscountQuantity = parseFloat(accounting.unformat($(o).find("input[name=DiscountQuantity]").val()))

                    if (EPODetailTable[$(checkbox).val()] != undefined) {
                        EPODetailTable[$(checkbox).val()].checked = $(checkbox).prop("checked") && DiscountQuantity != 0

                        if (DiscountQuantity > o.AcceptanceQuantity - o.PaymentDiscountQuantity) { DiscountQuantity = o.AcceptanceQuantity - o.PaymentDiscountQuantity }

                        EPODetailTable[$(checkbox).val()].DiscountQuantity = DiscountQuantity
                    }
                })

                let pageArray = EPODetailTable.slice((page - 1) * pagerow, page * pagerow)
                let simple = $("#divEPODetail table").find("tbody").eq(0)
                simple.find(".error-text").remove() //避免複製到錯誤訊息
                simple.find(".EPODetail").hide()

                $("#divEPODetail table").find("tbody").remove();
                $.each(pageArray, function (i, o) {
                    let RateDate = new Date(o.RateDate)
                    let DiscountQuantity = (o.DiscountQuantity == 0) ? o.AcceptanceQuantity - o.PaymentDiscountQuantity : o.DiscountQuantity
                    let checked = (o.checked === true)

                    $(simple).find("td").eq(0).find(":checkbox").val((page - 1) * pagerow + i).prop("checked", checked)
                    $(simple).find("td").eq(1).text(i + 1)
                    $(simple).find("td").eq(2).text(o.PONum)
                    $(simple).find("td").eq(3).text(RateDate.getFullYear() + "-" + funAddheadZero(2, (RateDate.getMonth() + 1)) + "-" + funAddheadZero(2, RateDate.getDate()))
                    $(simple).find("td").eq(4).find("input").val(fun_accountingformatNumberdelzero(DiscountQuantity)).attr("max", o.AcceptanceQuantity - o.PaymentDiscountQuantity)
                    if (o.UomCode == "AMT") {
                        $(simple).find("td").eq(4).find("input").addClass('input-disable').prop("disabled", true)
                        $(simple).find("td").eq(5).text("AMT")
                    }
                    else {
                        $(simple).find("td").eq(4).find("input").removeClass('input-disable').prop("disabled", false)
                        $(simple).find("td").eq(5).text("PCS")
                    }

                    $(simple).find("td").eq(6).text(o.ReceiptNum)
                    $(simple).find("td").eq(7).text(o.RecDeptName).append('<div class="p-right5 btn-01-add" id="ExpandEPODetail"><a><div class="glyphicon glyphicon-chevron-down  toggleArrow"></div></a>')
                    $(simple).find("tr").eq(2).find("td").eq(0).text(o.ItemDescription)
                    $(simple).find("tr").eq(2).find("td").eq(1).text(fun_accountingformatNumberdelzero(o.AcceptanceQuantity))
                    $(simple).find("tr").eq(2).find("td").eq(2).text(fun_accountingformatNumberdelzero(o.PaymentDiscountQuantity))
                    $(simple).find("tr").eq(2).find("td").eq(3).text(fun_accountingformatNumberdelzero(o.UnitPrice))
                    $(simple).find("tr").eq(2).find("td").eq(4).text(fun_accountingformatNumberdelzero(o.AcceptanceAmount))
                    $(simple).find("tr").eq(2).find("td").eq(5).text(o.ChargeDeptName)
                    //退款
                    if (o.AcceptanceQuantity < 0) {
                        $(simple).find("tr").eq(4).find("td").eq(0).text(o.invoiceNum)
                        $(simple).find("tr").eq(4).find("td").eq(1).text(fun_accountingformatNumberdelzero(o.Rate))
                    }

                    $("#divEPODetail table").append($(simple).clone())
                })
                divEPODetailAction()
            })
            $("#divEPODetail").after(Detailpagediv)

            EPOUnReceiving = getEPOUnReceiving()
            let UnReceivingpagediv = writeTablePage(EPOUnReceiving.length, function (page, pagerow) {
                let pageArray = EPOUnReceiving.slice((page - 1) * pagerow, page * pagerow)
                let simple = $("#divEPOUnReceiving table").find(".DetailSerno").closest("tbody").eq(0)
                $("#divEPOUnReceiving table").find(".DetailSerno").closest("tbody").remove();
                $.each(pageArray, function (i, o) {
                    $(simple).find("td").eq(0).text(o.PONum)
                    $(simple).find("td").eq(1).text(o.RecDept)
                    $(simple).find("td").eq(2).text(o.ItemDescription)
                    $(simple).find("td").eq(3).text(fun_accountingformatNumberdelzero(o.DueQuantity))
                    $(simple).find("td").eq(4).text(fun_accountingformatNumberdelzero(o.UnitPrice))
                    $(simple).find("td").eq(5).text(fun_accountingformatNumberdelzero(o.DueAmount))
                    $("#divEPOUnReceiving table").append($(simple).clone())
                })
            })
            $("#divEPOUnReceiving").after(UnReceivingpagediv)
            $.unblockUI(); //解除讀取中狀態
        })
    }
})

//請款明細選擇結果
function SelectEPODetailResult(selectedData) {
    //還原表單資料
    {
        $("#VoucherInfomationBlock,#PurposeBlock,#PaymentInfomationBlock").find("select").val("").selectpicker('refresh')
        $("#VoucherInfomationBlock,#PurposeBlock,#PaymentInfomationBlock").find("input").val("")
        $("#VoucherInfomationBlock,#PurposeBlock,#PaymentInfomationBlock").find(".disable-text").html('<span class="undone-text">系統自動帶入</span>')
        $("#ExpenseDesc").val("")
        $("#PrepaymentRootBlock").hide()
        $('#undone-vendorSelect').show();
        $('#PrepaymentTable').remove();
        $("#IncomeTaxInformation").hide()
        $("#IncomeTaxInformation").hide()
        removeNecessaryColumn("BargainingCode")
        removeNecessaryColumn("ExportApplyAttribute")
        $(".error-text").remove()
    }
    $("#PaymentStatus").html("請款審核中")
    $("#EPODetailBlock").hide(200)
    $("#PurposeBlock").show(100)
    $("#VoucherInfomationBlock").show(100)
    $("#PaymentInfomationBlock").show(100)
    $("#OtherInfoSection").show(100)
    $("#Rate").val(fun_accountingformatNumberdelzero(EPO.Rate))
    //EPO.EPODetail = getEpoDetailModel()   //取得請款明細資料
    //取得請款明細
    //計算預計付款日
    GetEstimatePayDate($('#div_EstimatePayDate'))
    //承辦單位預計付款日 / 支票發票日
    // GetEstimatePayDate($('#ExceptedPaymentDate'))

    //將選擇結果的detail datamode放到EPO.EPODetail
    EPO.EPODetail = $.merge(EPO.EPODetail,
        $.each(selectedData, function (i, o) {
            // o.DiscountQuantity = accounting.unformat($(".EPODetailSerno input:checked[value=" + o.LineNum + "]").closest("tr").find("input[Amount]").val())
            o.AcceptanceAmount = o.DiscountQuantity * o.UnitPrice
            o.OriginalAmount = o.AcceptanceAmount
            o.OriginalSaleAmount = o.AcceptanceAmount
            /* if (isNaN(new Date(o.RateDate).getDate())) {
                  let RateDate = new Date(parseInt(o.RateDate.replace("/Date(", "").replace(")/", "")))
                  o.RateDate = RateDate.getFullYear() + "-" + RateDate.getMonth() + "-" + RateDate.getDate()
             }*/

            o.LineNum = 0

            return o
        }))

    let AcceptanceAmount = 0
    let PaymentAmount = 0
    $.each(EPO.EPODetail, function (i, o) {
        if (!o.IsDelete) {
            AcceptanceAmount += o.AcceptanceAmount

            o.TWDAmount = accounting.toFixed(o.OriginalAmount * EPO.Rate)
            PaymentAmount += parseInt(o.TWDAmount)

            o.TWDSaleAmount = accounting.toFixed(o.AcceptanceAmount * EPO.Rate)
            o.TWDTax = o.TWDAmount - o.TWDSaleAmount
        }
    })

    var sendData = { epoNum: __epoNum, epoDetails: EPO.EPODetail }
    //請款明細選擇結果
    var selectResult = $.ajax({
        url: epoDetailResultUrl,
        type: 'POST',
        data: sendData,
        success: function (content) {
            $("#EPODetailResultBlock").show()
            $("div#EPODetailResult").html(content)
            $('.selectpicker').selectpicker()
            $("#VendorNameAndNum2").text($("#VendorNameAndNum").text())
            $('#ExpenseKind').val(vendorInfo.EPOExpenseKind)
            $('#textExpenseKind').text(vendorInfo.textExpenseKind)
            $('#IDNo').val(vendorInfo.vatRegistrationNumber)
            $('#textIDNo').text(vendorInfo.vatRegistrationNumber)

            $('#LocationID').val(vendorInfo.supplierSite[0].supplierSiteID)
            $('#VendorNum').val(vendorInfo.supplierNumber)
            $('#VendorName').val(vendorInfo.supplierName)
            $("#textCurrencyName").text(vendorInfo.CurrencyName)

            $("#VendorKind").val(vendorInfo.supplierTypeLookupCode)
            $("#VendorID").val(vendorInfo.supplierID)
            $("#VendorAddress").val(vendorInfo.supplierSite[0].invoiceAddress)
            $("#VendorSiteCode").val(vendorInfo.supplierSite[0].supplierSiteCode)
            /*$("#PermanentPostNum").text(vendorInfo.supplierSite.invoiceZipCode)
            $("#PermanentAddress").text(vendorInfo.supplierSite.invoiceAddress)
            $("#ContactPostNum").text(vendorInfo.supplierSite.contactZipCode)
            $("#ContactAddress").text(vendorInfo.supplierSite.contactAddress)*/
            $("#IdentityFlag").val(vendorInfo.supplierSite[0].IdentityFlag)
            $("#CountryCode").val(vendorInfo.supplierSite[0].country)
            $("#IncomeCodeCode").val(vendorInfo.supplierSite[0].taxCode)
            $("#IncomeCodeName").val($.map(WtTax, function (o) {
                if (o.wtTaxCode == vendorInfo.supplierSite[0].taxCode) {
                    return o.wtTaxtCodeDescription
                }
            })[0])

            $("#AcceptanceAmount").val(AcceptanceAmount)
            $("#AcceptanceAmountDisable").text(fun_accountingformatNumberdelzero(AcceptanceAmount))
            $("#PaymentAmount").text(fun_accountingformatNumberdelzero(accounting.toFixed(PaymentAmount)))

            // $("#CertificateAmount").attr("Max", AcceptanceAmount)
            //$("#CertificateAmount").val(AcceptanceAmount).blur()
            // $("#OriginalAmount").val(0).blur()

            PaymentAccount(vendorInfo.supplierBank)

            let defaultvalue = {
                Deduction: (vendorInfo.taxCode != null && vendorInfo.identityFlag != null),
                EPOExpenseKind: vendorInfo.EPOExpenseKind,
                Currency: vendorInfo.Currency,
                PaymentMethod: vendorInfo.supplierSite[0].paymentMethodLookupCode,
                Remittance: vendorInfo.supplierSite[0].paymentReasonCode,
                PayAlone: vendorInfo.supplierSite[0].exclusivePaymentFlag,
                // CostProfitCenter: __CostProfitCenter,
                CertificateKind: ""
            }
            EPO.Currency = vendorInfo.Currency
            EPO.CurrencyName = vendorInfo.CurrencyName
            EPO.CurrencyPrecise = vendorInfo.CurrencyPrecise

            EPODetailResultAction(defaultvalue)

            EPO.IncomeTax.IncomeNum = vendorInfo.vatRegistrationNumber
            EPO.IncomeTax.IncomePerson = vendorInfo.supplierName
            EPO.IncomeTax.IsTwoHealthInsurance = (EPO.AcceptanceAmount >= 20000) ? "Y" : "N"
            EPO.IncomeTax.PermanentPostNum = vendorInfo.supplierSite[0].invoiceZipCode
            EPO.IncomeTax.PermanentAddress = vendorInfo.supplierSite[0].invoiceCity + vendorInfo.supplierSite[0].invoiceAddress
            EPO.IncomeTax.ContactPostNum = vendorInfo.supplierSite[0].contactZipCode
            EPO.IncomeTax.ContactAddress = vendorInfo.supplierSite[0].contactCity + vendorInfo.supplierSite[0].contactAddress
            EPO.IncomeTax.CertficateKind = vendorInfo.supplierSite[0].identityFlag
            EPO.IncomeTax.IncomeCode = vendorInfo.supplierSite[0].taxCode
            EPO.IncomeTax.TwoHeathInsuranceFlag = Get2NHIFlag(vendorInfo.supplierNumber)
            putIncomeTaxInformation(EPO.IncomeTax)
        },
        error: function (data) {
            alert("建立請款明細失敗")
        }
    })
    //都做完了才解除讀取遮罩訊息
    $.when(cerObject.promise(), selectResult.promise()).always(function (xhrObject1, xhrObject2) {
        resetSubMenu()
        blockPage('')  //解除讀取中狀態
        //因為增加明細項，所以要重新bind Object
        //$('#MainForm').bindings('refresh')
    })

    //$("#EPODetailResult").load(epoDetailResultUrl, { FormID: $('#P_SignID').val(), PONums: data }, function (responseTxt, statusTxt, xhr) {
    //    if (statusTxt == "success") {
    //        //成功再Show這個區塊
    //        blockPage('')   //解除資料讀取中狀態
    //        $("#EPODetailResultBlock").show()
    //        $('.selectpicker').selectpicker()
    //    }
    //    if (statusTxt == "error")
    //        alert("Error: " + xhr.status + ": " + xhr.statusText);
    //})
}

//請款明細帶入後的各種判斷
function EPODetailResultAction(Info) {
    EPO.ExpenseKind = Info.EPOExpenseKind

    $("table#EPODetailResult,#EPOAmoIN").find("[Amount]").each(function () {
        $(this).text(fun_accountingformatNumberdelzero($(this).text()))
        $(this).val(fun_accountingformatNumberdelzero($(this).val()))
    })

    $("#CertificateKind").empty()

    if (Info.EPOExpenseKind == "PO_CM_RETURN") {
        //退貨只能選擇折讓
        $.each($.grep(CertificateKindList, function (o) { return o.value == "C" }), function (i, o) {
            $("#CertificateKind").append($("<option></option>").val(o.value).text(o.text))
        })

        $("#CertificateNum").closest(".content-box").hide()
        $("#MARGINAMT").val(0).closest(".content-box").hide()
        $("#DiscountReceive").closest(".content-box").show()
        $("#DiscountInvoice").closest(".content-box").show()
        $("#DiscountInvoiceDate").closest(".content-box").show()
        $("#PrepaymentRootBlock").hide()

        Info.Deduction = false;
        $("#Deduction").closest("label").hide()
    }
    else {
        ///改為同非請購
        /* if ($("#Deduction").prop("checked")) {//有所扣不能選發票
             $.each($.grep(CertificateKindList, function (o) { return (o.value != "D" && o.value != "I") }), function (i, o) {
                 $("#CertificateKind").append($("<option></option>").val(o.value).text(o.text))
             })
         }
         else {
             $.each($.grep(CertificateKindList, function (o) { return o.value != "D" }), function (i, o) {
                 $("#CertificateKind").append($("<option></option>").val(o.value).text(o.text))
             })
         }*/
        $("#CertificateKind").append($("<option></option>").val("").text("請選擇"))
        $.each($.grep(CertificateKindList, function (o) { return o.value != "C" }), function (i, o) {
            $("#CertificateKind").append($("<option></option>").val(o.value).text(o.text))
        })

        $("#PrepaymentRootBlock").show()
        $("#CertificateNum").closest(".content-box").show()
        if (Info.Currency === "TWD") {
            $("#MARGINAMT").closest(".content-box").show()
        }
        else {
            $("#MARGINAMT").val(0).closest(".content-box").hide()
        }

        $("#DiscountInvoice").closest(".content-box").hide()
        $("#DiscountInvoiceDate").closest(".content-box").hide()
        $("#DiscountReceive").closest(".content-box").hide()

        $("#Deduction").closest("label").show()
    }

    if (Info.Deduction) {
        $("#Deduction").prop("checked", true);

        $("#IncomeTaxInformation").show()
        if (EPO.IncomeTax) {
            putIncomeTaxInformation(EPO.IncomeTax)
        }
    }
    else {
        $("#Deduction").prop("checked", false);

        $("#IncomeTaxInformation").hide()
    }

    $("#CertificateKind").val(Info.CertificateKind).selectpicker('refresh')
    $("#CertificateKind").triggerHandler('change')

    $("#RateDisable").remove()
    $("#PaymentMethodDisable").remove()
    $('#PaymentMethod').closest(".bootstrap-select").show()

    if (Info.PaymentMethod != "") {
        $('#PaymentMethod').val(Info.PaymentMethod)
    } else {
        $('#PaymentMethod').val('WIRE')
    }

    $('#PaymentMethod').selectpicker("refresh")

    EPO.Currency = Info.Currency
    if (Info.Currency === "TWD") {
        $('#Rate').hide()
        $('#Rate').closest("div").append('<div class="disable-text" id="RateDisable" style="display: block;">' + fun_accountingformatNumberdelzero(EPO.Rate) + '</div>')
        // EPO.CurrencyPrecise = 0
        $('#Emergency').prop("checked", false)

        $("#ExportApplyAttribute").selectpicker('setStyle', 'input-disable', 'add').prop("disabled", true).val("").selectpicker("refresh")

        $("#BargainingCode").hide()
        if ($("#BargainingCodeDisable").length == 0) {
            $("#BargainingCode").closest("div").append(' <div class="disable-text" id="BargainingCodeDisable" style="display:block"><span class="undone-text"></span></div>')
        }

        removeNecessaryColumn("BargainingCode")
        removeNecessaryColumn("ExportApplyAttribute")
    }
    else {
        $('#Rate').show()

        console.log("判斷如果非台幣，則付款方式為電匯")
        $('#PaymentMethod').val('WIRE').selectpicker('refresh')
        $('#PaymentMethod').closest(".bootstrap-select").hide()
        $('#PaymentMethod').closest(".content-box").append('<div class="disable-text" id="PaymentMethodDisable" style="display: block;">電匯</div>')

        $('#Emergency').prop("checked", true)

        $("#BargainingCode").show()
        necessaryColumn("BargainingCode")
        $("#BargainingCodeDisable").remove()

        $("#ExportApplyAttribute").selectpicker('setStyle', 'input-disable', 'remove').prop("disabled", false).selectpicker("refresh")
        necessaryColumn("ExportApplyAttribute")

        alertopen(alertMesage.NeedBargainingCode)
    }

    ///20190304 退款不能調整匯率 避免退款金額大過請款金額
    if (Info.EPOExpenseKind == "PO_CM_RETURN") {
        $('#Rate').hide()
        $("#RateDisable").remove()

        $('#Rate').closest("div").append('<div class="disable-text" id="RateDisable" style="display: block;">' + fun_accountingformatNumberdelzero(EPO.Rate) + '</div>')
    }

    //  $("#Rate").blur()

    $('#Remittance').val(Info.Remittance).selectpicker('refresh')
    $('#RemittanceDisable').text($('#Remittance').find("option:selected").text())

    //==========================================
    // 是否為單獨付款
    //==========================================
    $('#PayAlone').prop('checked', false);
    if (Info.PayAlone) {
        $('#PayAlone').prop('checked', true);
    }

    //計算金額
    //$("#CertificateAmount").triggerHandler("blur")
    let CertificateAmount = 0
    let OriginalTax = 0
    let totalTWDAmount = 0
    let totalTWDTax = 0
    $.each(EPO.EPODetail, function (i, o) {
        if (o.IsDelete) return true

        o.TWDAmount = Math.round(EPO.Rate * o.OriginalAmount)
        o.TWDTax = Math.round(EPO.Rate * o.OriginalTax)
        o.TWDSaleAmount = o.TWDAmount - o.TWDTax

        CertificateAmount += o.OriginalAmount
        OriginalTax += o.OriginalTax
        totalTWDAmount += o.TWDAmount
        totalTWDTax += o.TWDTax
    })

    $("#CertificateAmount").html(fun_accountingformatNumberdelzero(CertificateAmount))
    $("#OriginalAmount").html(fun_accountingformatNumberdelzero(OriginalTax))
    $("#TWDAmount").html(fun_accountingformatNumberdelzero(totalTWDAmount))
    $("#TWDTaxAmount").html(fun_accountingformatNumberdelzero(totalTWDTax))

    $(".datetimepicker1").datetimepicker({
        format: 'YYYY-MM-DD'
    });

    if (EPO.Step < 3) {
        $('#PaymentMethod').trigger('change')
        $("[VoucherMemo]").remove()
    }
    else {
        $("#PaymentMethodDisable").remove()
    }

    //分攤明細行

    $.when(FiisDataAjax.promise()).done(function () {
        let __epoDetailStart = (new Date).getTime();
        console.log("明細處理開始 ")

        let pdDictionary = []
        $.each(productDetail, function (i, o) {
            pdDictionary.push({ key: o.productDetail, value: o.productDetallDescription })
        })
        _optionList.push({ key: 'AmortizationDetailProductDetail', value: pdDictionary })

        let AccountingItemList = []

        $.each(CoaAccount, function (i, o) {
            AccountingItemList.push({ key: o.account, value: o.description })
        })
        _optionList.push({ key: 'AccountingItem', value: AccountingItemList })

        let tbodyList = $("#EPOAmoIN tbody");

        let AccountBankSelectObj = document.createElement("select");
        $.each(CoaCompany, function (x, o) {
            $(AccountBankSelectObj).append($("<option></option>").attr("value", o.company).text(o.company + " " + o.description)
                .attr("gvdeclaration", o.gvdeclaration).attr("description", o.description))
        })

        let CostProfitCenterSelectObj = document.createElement("select");
        $.each(CoaCompanyAndDepartment, function (x, o) {
            $(CostProfitCenterSelectObj).append($("<option></option>").attr("value", o.department).text(o.department + " " + o.description)
                .attr("taxApplication", o.taxApplication).attr("isProductRequired", o.isProductRequired).attr("description", o.description))
        })

        let ProductSelectObj = document.createElement("select");
        $.each(product, function (x, o) {
            $(ProductSelectObj).append($("<option></option>").attr("value", o.product).text(o.product + "  " + o.description)
                .attr("description", o.description))
        })

        let ExpenseAttributeSelectObj = document.createElement("select");
        $.each(ExpenseAttribute.Detail, function (key, text) {
            $(ExpenseAttributeSelectObj).append($("<option></option>").attr("value", key).text(key + "  " + text)
                .attr("description", text))
        })

        $.each(tbodyList, function (i, tbody) {
            let __EPOAmoINStart = (new Date).getTime();

            let AccountBank = $(tbody).find("select[name=AccountBank]")
            $(AccountBank).html($(AccountBankSelectObj).html())

            let accountBankDefault = "";
            if ($(AccountBank)[0].hasAttribute("default")) {
                accountBankDefault = $(AccountBank).attr("default")
            }
            else {
                accountBankDefault = $("#Books").val()
            }
            let AccountBankSelected = AccountBank.find("option[value='" + accountBankDefault + "']");
            if (AccountBankSelected.length != 0) {
                AccountBankSelected.eq(0).prop("selected", true)
            }
            else {
                $(AccountBank).val("")
            }

            let _AccountingItemCode = $(tbody).find("#AccountingItemCode").val()
            let defaultCoaAccount = $.map(CoaAccount, function (o) { if (o.account == _AccountingItemCode) { return o } })
            if (defaultCoaAccount.length > 0) {
                $(tbody).find("#AccountingItemDisable").html(defaultCoaAccount[0].account + "-" + defaultCoaAccount[0].description)
                $(tbody).find("#AccountingItemCode").val(defaultCoaAccount[0].account)
                $(tbody).find("#AccountingItemName").val(defaultCoaAccount[0].description)
            }

            let CostProfitCenter = $(tbody).find("select[name=CostProfitCenter]")
            $(CostProfitCenter).html($(CostProfitCenterSelectObj).html())
            if ($(CostProfitCenter)[0].hasAttribute("default")) {
                //$(CostProfitCenter).selectpicker('refresh').val($(CostProfitCenter).attr("default")).selectpicker('refresh')
                $(CostProfitCenter).find("option[value='" + $(CostProfitCenter).attr("default") + "']").prop("selected", true)
            }

            $(CostProfitCenter).change(function (e) { eventHandler(e) })

            let Product = $(tbody).find("select[name=ProductKind]")
            $(Product).html($(ProductSelectObj).html())
            if ($(Product)[0].hasAttribute("default")) {
                // $(Product).selectpicker('refresh').val($(Product).attr("default"))
                $(Product).find("option[value='" + $(Product).attr("default") + "']").prop("selected", true)
            }
            //  $(Product).selectpicker('refresh')

            if ($(tbody).find("#AmortizationDetailProductDetailCode").val() == "") {
                $(tbody).find("#AmortizationDetailProductDetailDisable").html(' <span class="undone-text">點選按鈕新增</span>')
            }

            let expenseAttribute = $(tbody).find("select[name=ExpenseAttribute]")
            $(expenseAttribute).html($(ExpenseAttributeSelectObj).html())
            if ($(expenseAttribute)[0].hasAttribute("default")) {
                //$(expenseAttribute).selectpicker('refresh').val($(expenseAttribute).attr("default"))
                $(expenseAttribute).find("option[value=" + $(expenseAttribute).attr("default") + "]").prop("selected", true)
            }
            // $(expenseAttribute).selectpicker('refresh')

            console.log("分攤明細處理第" + (i + 1) + "筆 花費" + ((new Date).getTime() - __EPOAmoINStart) / 1000 + "秒")
        })

        $("table#EPODetailResult").find("[name=ProjectCategory]").change()
        $("table#EPODetailResult").find("[name=Project]").each(function () {
            if ($(this).attr("default") != '') {
                $(this).val($(this).attr("default")).selectpicker('refresh')
                $(this).change()
            }
        })
        $("table#EPODetailResult").find("[name=ProjectItem]").each(function () {
            if ($(this).attr("default") != '') {
                $(this).val($(this).attr("default")).selectpicker('refresh')
            }
        })

        $("table#EPODetailResult #EPOAmoIN").each(function () {
            $(this).find('tbody').find(".icon-remove-size").hide()

            $(this).find('input[Amount]').each(function () {
                $(this).val(fun_accountingformatNumberdelzero($(this).val()))
            })
            $(this).find('text[Amount]').each(function () {
                $(this).text(fun_accountingformatNumberdelzero($(this).text()))
            })

            $(this).find("select").on('change', function (e) {
                $(this).closest("td").find("[Errmsg=Y]").remove()
                eventHandler(e)
            })

            //分攤明細第一欄不可刪
            $(this).find("tbody").not(":first").mouseenter(function () {
                $(this).find(".icon-remove-size").show();
            })
            $(this).find("tbody").not(":first").mouseleave(function () {
                $(this).find(".icon-remove-size").hide();
            })
        })

        if (!isCardEmp) {
            $(tbodyList).find("select[name=ExpenseAttribute]").toggleClass('input-disable', true).removeAttr("necessary", "").prop("disabled", true).val("")
        }

        console.log("分攤明細處理結束 花費" + ((new Date).getTime() - __epoDetailStart) / 1000 + "秒")

        $("div.disable-text").each(function () {
            if ($(this).text() == String(null)) {
                $(this).text("")
            }
        })

        detailDeferred.resolve();
        conLog("detailDeferred resolve!!")
    })
}

//處理所得稅資料
function putIncomeTaxInformation(TaxInfo) {
    $.when(FiisDataAjax.promise()).done(function () {
        let IncomeTaxTable = $("#IncomeTaxTable")
        $(IncomeTaxTable).find("#IncomeNum").val(TaxInfo.IncomeNum)
        $(IncomeTaxTable).find("#IncomePerson").val(TaxInfo.IncomePerson)

        $(IncomeTaxTable).find("#IsTwoHealthInsurance").val(TaxInfo.IsTwoHealthInsurance).selectpicker('refresh')
        //$(IncomeTaxTable).find("#IsTwoHealthInsurance").change()

        $(IncomeTaxTable).find("#PermanentPostNum").val(TaxInfo.PermanentPostNum)
        $(IncomeTaxTable).find("#PermanentAddress").val(TaxInfo.PermanentAddress)
        $(IncomeTaxTable).find("#ContactPostNum").val(TaxInfo.ContactPostNum)
        $(IncomeTaxTable).find("#ContactAddress").val(TaxInfo.ContactAddress)
        $(IncomeTaxTable).find("#TwoHeathInsuranceFlag").text(Get2NHIFlag(vendorInfo.supplierNumber))

        $(IncomeTaxTable).find('#CertficateKind').val(TaxInfo.CertficateKind).selectpicker('refresh')
        $(IncomeTaxTable).find('#WriterIncomeNumSelect').val(TaxInfo.WriterIncomeNum).selectpicker('refresh')
        $(IncomeTaxTable).find('#OtherIncomNumSelect').val(TaxInfo.OtherIncomNum).selectpicker('refresh')
        $(IncomeTaxTable).find('#ProfeesionalKindSelect').val(TaxInfo.ProfeesionalKind).selectpicker('refresh')
        $(IncomeTaxTable).find('#LeaseTaxCodeSelect').val(TaxInfo.LeaseTaxCode).selectpicker('refresh')
        $(IncomeTaxTable).find('#LeaseTax').val(TaxInfo.LeaseTax)
        $(IncomeTaxTable).find('#LeaseAddress').val(TaxInfo.LeaseAddress)

        if (EPO.Step >= 3) {
            if (TaxInfo.CountryCode != null) {
                $(IncomeTaxTable).find('#CountryCodeCode').val(TaxInfo.CountryCode)

                $(IncomeTaxTable).find('#CountryCodeDisable').text(TaxInfo.CountryCode + "-" + $.map(CountryCodeList, function (o) { if (o.key == "AD") { return o.value } })[0])
            }

            if (TaxInfo.IsTwoHealthInsurance == "Y") {
                //二代健保最大金額 一千萬 *1.91%
                $(IncomeTaxTable).find("#SupplementPremiumInput").attr("Max", 10000000 * 0.0191)
                $(IncomeTaxTable).find("#SupplementPremiumInput").removeAttr("Zero").removeAttr("readonly", true).removeClass("input-disable")
            }
            else {
                $(IncomeTaxTable).find("#SupplementPremiumInput").val(0).attr("Zero", true).attr("readonly", true).addClass("input-disable")
            }

            if (TaxInfo.IncomeCode != null) {
                $(IncomeTaxTable).find('#IncomeCodeCode').val(TaxInfo.IncomeCode)
                $(IncomeTaxTable).find('#IncomeCodeName').val(TaxInfo.TaxName)

                $(IncomeTaxTable).find('#IncomeCodeDisable').text(TaxInfo.IncomeCode + "-" + TaxInfo.TaxName)
            }
            fun_IncomeCodechange(TaxInfo.IncomeCode)
            fun_CertficateKindchange(TaxInfo.CertficateKind)

            $(IncomeTaxTable).find('#NetPaymentInput').val(fun_accountingformatNumberdelzero(TaxInfo.NetPayment))
            $(IncomeTaxTable).find('#WithholdingTaxInput').val(fun_accountingformatNumberdelzero(TaxInfo.WithholdingTax))
            $(IncomeTaxTable).find('#SupplementPremiumInput').val(fun_accountingformatNumberdelzero(TaxInfo.SupplementPremium))
        }
    })
}

//證號別更換動作
function fun_CertficateKindchange(val) {
    switch (val) {
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            if (EPO.Step > 1) {
                $("#CountryCodeDisable").html("<span class=\"undone-text\">點選按鈕新增</span>")
                $("#CountryCode").show();
                $("#CountryCodeCode").attr("necessary", "")
            }
            break;

        default:
            $("#CountryCodeDisable").html("<span class=\"undone-text\"></span>")
            $("#CountryCodeCode").val("").removeAttr("necessary", "")
            $("#CountryCode").hide();
            break;
    }
}

//所得稅代碼更換動作
function fun_IncomeCodechange(val) {
    $("#IncomeTaxTable").find("[errmsg=Y]").remove()

    $("#ProfeesionalKindSelect").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').val("").selectpicker('refresh');
    $("#WriterIncomeNumSelect").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').val("").selectpicker('refresh');
    $("#OtherIncomNumSelect").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').val("").selectpicker('refresh');
    $("#LeaseTaxCodeSelect").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').val("").selectpicker('refresh');

    //$("#CountryCodeDisable").html("<span class=\"undone-text\"></span>")
    // $("#CountryCodeCode").val("")
    $("#LeaseTax").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).addClass("input-disable").val("")
    $("#LeaseAddress").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).addClass("input-disable").val("")

    let IncomeCode = $("#IncomeCodeCode").val()

    switch (IncomeCode) {
        case "9A":
            $("#ProfeesionalKindSelect").removeAttr("readonly", "").attr("necessary", "").prop('disabled', false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker('refresh');

            break;
        case "9B":
            $("#WriterIncomeNumSelect").removeAttr("readonly", "").attr("necessary", "").prop('disabled', false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker('refresh');
            break;
        case "92":
            $("#OtherIncomNumSelect").removeAttr("readonly", "").attr("necessary", "").prop('disabled', false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker('refresh');
            break;
        case "53":
            $("#LeaseTaxCodeSelect").removeAttr("readonly", "").prop('disabled', false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker('refresh');

            // if ($("#CertficateKind").find("option:selected").data("wtCode") == "2") {
            //   $("#LeaseTaxCodeSelect").removeAttr("readonly", "").prop('disabled', false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker('refresh');
            // $("#CountryCodeDisable").html("<span class=\"undone-text\">點選按鈕新增</span>")
            //  $("#CountryCode").show();
            // }
            break;

        case "51":
        case "51L":
            $("#LeaseTax").removeAttr("readonly", "").attr("necessary", "").prop('disabled', false).removeClass("input-disable");
            $("#LeaseAddress").removeAttr("readonly", "").attr("necessary", "").prop('disabled', false).removeClass("input-disable");;

            break;
    }
}

//所扣更改動作
function fun_DeductionChuang() {
    if ($("#Deduction").prop("checked")) {
        $("table#EPODetailResult").children("tbody").each(function (i, o) {
            $(o).find("[name=divSelectIsIncomeDeduction]").show()
            $(o).find("[name=SelectIsIncomeDeduction]").val($(o).find("[name=IsIncomeDeduction]").text()).selectpicker("refresh")
            $(o).find("[name=IsIncomeDeduction]").hide()
        })
    }
    else {
        $("table#EPODetailResult").find("[name=divSelectIsIncomeDeduction]").hide()
        $("table#EPODetailResult").find("[name=IsIncomeDeduction]").text("N").show()
    }
}

//計算給付淨額與健保補充保費
function GetValidateWtTax() {
    let wtIdentityType = $("#CertficateKind").val()
    let wtTaxCode = $("#IncomeCodeCode").val()
    let twoNhiYn = $("#IsTwoHealthInsurance").val()
    let TWDAmount = 0

    $("table#EPODetailResult").children("tbody").each(function (i, o) {
        if ($(o).find("[name=SelectIsIncomeDeduction]").val() == "Y") {
            TWDAmount += accounting.unformat($(o).find("[name=TWDAmount]").text())
        }
    })

    if (wtIdentityType == "" || wtTaxCode == "" || twoNhiYn == "") return false

    $.ajax({
        async: false,
        type: 'POST',
        dataType: 'json',
        data: { sourceKeyId: __epoNum, wtIdentityType: wtIdentityType, wtTaxCode: wtTaxCode, twoNhiYn: twoNhiYn, lineAmount: TWDAmount },
        url: '/EPO/GetValidateWtTax/',
        success: function (data) {
            $("#WithholdingTaxInput").val(fun_accountingformatNumberdelzero(data.wtTax))
            $("#NetPaymentInput").val(fun_accountingformatNumberdelzero(data.payAmount))
            $("#SupplementPremiumInput").val(fun_accountingformatNumberdelzero(data.twoNhiPremiums))
        }
    })
}

//處理營業稅資料
function putBusinessTaxInformation(BusinessTax) {
    $.when(FiisDataAjax.promise()).done(function () {
        let BusinessTaxTable = $("#BusinessTaxTable")
        $.each(BusinessTax, function (key, value) {
            if (value == null) return true

            $.each($(BusinessTaxTable).find("[name=" + key + "]"), function (i, o) {
                if ($(o)[0].hasAttribute("amount")) {
                    value = fun_accountingformatNumberdelzero(value)
                }
                if ($(o)[0].hasAttribute("date")) {
                    let _Date = new Date(parseInt(value.replace("/Date(", "").replace(")/", "")))
                    value = _Date.getFullYear() + "-" + (_Date.getMonth() + 1) + "-" + _Date.getDate()
                }

                switch ($(o)[0].tagName) {
                    case "SELECT":
                    case "INPUT":
                        $(o).val(value)
                        break;
                    default:
                        $(o).text(value)
                        break;
                }
            })
        })

        $(BusinessTaxTable).find("select").selectpicker('refresh')
    })
}

//產生請款明細
$("#epoSelectedResult").on("click", function (e) {
    function EPODetailResult() {
        let _rate = 1;
        if ($("#search_ExpenseKind").val() == "PO_CM_RETURN") {
            let RateList = $.map(selectedData, function (o) {
                return o.Rate
            }).reduce(function (a, b) {
                if (a.length == 0 || b !== a[0]) {
                    a.push(b)
                }

                return a
            }, [])

            if (RateList.length != 1) {
                alertopen("不同匯率無法合併退款")
                return false
            }
            else {
                _rate = RateList[0]
            }
        }

        blockPage('資料讀取中...')

        EPO.Rate = _rate;
        SelectEPODetailResult(selectedData)
    }

    //取出資料存回EPODetailTable
    $.each($("#divEPODetail table").find(".EPODetailSerno"), function (i, o) {
        let checkbox = $(o).find(":checkbox")
        let DiscountQuantity = parseFloat(accounting.unformat($(o).find("input[name=DiscountQuantity]").val()))
        let MaxDiscountQuantity = parseFloat(accounting.unformat($(o).find("input[name=DiscountQuantity]").attr("max")))

        if (EPODetailTable[$(checkbox).val()] != undefined) {
            EPODetailTable[$(checkbox).val()].checked = $(checkbox).prop("checked")

            if (MaxDiscountQuantity > 0) {
                if (DiscountQuantity < 0 || DiscountQuantity > MaxDiscountQuantity) DiscountQuantity = MaxDiscountQuantity
            }
            else {
                if (DiscountQuantity > 0 || DiscountQuantity < MaxDiscountQuantity) DiscountQuantity = MaxDiscountQuantity
            }

            EPODetailTable[$(checkbox).val()].DiscountQuantity = DiscountQuantity
        }
    })

    let selectedData = $.grep(EPODetailTable, function (o) {
        return o.checked
    })

    if (selectedData.length > 0) {
        if ($('#ExpenseKind').val() != "") {
            confirmopen("重新產生請款明細將會清空所有表單欄位", function () {
                EPO.EPODetail = $.map(EPO.EPODetail, function (o) {
                    if (o.LineNum > 0) {
                        o.IsDelete = true

                        return o
                    }
                })
                EPODetailResult()
            }, function () { })
        }
        else {
            EPODetailResult()
        }
    } else {
        alertopen("請至少選擇一筆請款明細")
    }
})

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

    /*if (bankInfo.length > 1) {
        $("#AccountSelectBtn").show()
    }
    else {
        $("#AccountSelectBtn").hide()
        $('input[name="AccountSelector"]').eq(0).prop("checked", true)
        AccountConfirm()
    }*/
}

//草稿儲存
function draft() {
    let draftAjax = $.Deferred()
    blockPageForJBPMSend()
    setTimeout(function () {
        Databinding()

        $.ajax({
            // async: false,
            type: 'POST',
            dataType: 'json',
            data: EPO,
            url: '/EPO/Draft/',
            success: function (data) {
                _formInfo = {
                    formGuid: data.FormGuid,
                    formNum: data.FormNum,
                    flag: data.Flag
                }
            },
            error: function (data) {
            }
        }).always(function () {
            draftAjax.resolve();
        });
    }, 0)
    return draftAjax.promise();
}

function Verify() {
    $.blockUI({ message: '資料檢核中...' })
    let draftAjax = $.Deferred()
    let targetList = []
    let err = []
    setTimeout(function () {
        Databinding()

        if (EPO.EPODetail.length == 0) {
            alertopen("未載入請款明細")
            draftAjax.reject();
            return false
        }

        let verifyResult = true;
        targetList.push($("#PurposeBlock"))
        targetList.push($("#VoucherInfomationBlock"))
        targetList.push($("#PaymentInfomationBlock"))
        targetList.push($("table#EPODetailResult"))
        targetList.push($("#PrepaymentTable"))

        $('[Errmsg=Y]').remove()

        if (EPO.needIncomeTax == 1) {
            targetList.push($("#IncomeTaxTable"))
        }
        if (EPO.needBusinessTax == 1) {
            targetList.push($("#BusinessTaxTable"))
        }

        verifyResult = necessaryVerify(targetList)

        if (verifyResult) {
            if ($("#DiscountInvoice").val().length > 0) {
                $("#DiscountInvoice").blur()
            }
            if ($("#CertificateNum").val().length > 0) {
                verifyResult = $("#CertificateNum").blur()
            }
            /* if ($("#EstimateVoucherDate").val().length > 0) {
                 $("#EstimateVoucherDate").blur()
             }*/
            if ($("#DiscountInvoiceDate").val().length > 0) {
                $("#DiscountInvoiceDate").blur()
            }

            //表單總額檢查
            let PaymentAmount = 0
            let PrepaymentAmount = 0
            if (EPO.Prepayment.length > 0) {
                PrepaymentAmount = $.map(EPO.Prepayment, function (o) { if (!o.IsDelete) { return o.WriteOffAmount } }).reduce(function (x, y) { return x + y })
            }

            PaymentAmount = EPO.TWDAmount - EPO.MARGINAMT - PrepaymentAmount - EPO.IncomeTax.WithholdingTax - EPO.IncomeTax.SupplementPremium
            if (PaymentAmount < 0 && EPO.CertificateKind != "C") {//折讓
                verifyResult = false
                err.push("付款金額(臺幣)小於0")
            }
            else {
                EPO.PaymentAmount = PaymentAmount
            }
            $("#PaymentAmount").text(fun_accountingformatNumberdelzero(PaymentAmount))

            //所得稅總額檢查
            // *不檢查了 2018/12/29
            /*if (EPO.needIncomeTax == 1 && EPO.Step == 3) {
                let TaxTWDAmount = 0
                $.each(EPO.EPODetail, function (i, o) {
                    if (o.IsDeduction == "Y") {
                        TaxTWDAmount += o.TWDAmount
                    }
                })

                if (TaxTWDAmount != EPO.IncomeTax.NetPayment + EPO.IncomeTax.WithholdingTax) {
                    verifyResult = false
                    err.push("給付淨額+扣繳稅額不等於需所扣的明細總額")
                }
            }*/

            //營業稅總額檢查
            if (EPO.needBusinessTax == 1) {
                if (EPO.TWDTaxAmount != EPO.BusinessTax.AssetsTaxAmount + EPO.BusinessTax.TaxAmount) {
                    verifyResult = false
                    err.push(errObj.BusinessTaxErr)
                }
                else {
                    if (EPO.BusinessTax.CertificateAmount != EPO.BusinessTax.AssetsTaxAmount + EPO.BusinessTax.TaxAmount
                       + EPO.BusinessTax.AssetsSaleAmount + EPO.BusinessTax.Taxable + EPO.BusinessTax.TaxFree + EPO.BusinessTax.ZeroTax + EPO.BusinessTax.OtherAmount) {
                        verifyResult = false
                        err.push(errObj.BusinessTaxSaleAmountErr)
                    }
                }
            }

            //遠期支票營業日檢查
            if (EPO.PaymentInfo.PaymentMethod == "BILLS_PAYABLE" && EPO.Step == 3) {
                $.ajax({
                    async: false,
                    type: 'POST',
                    //dataType: 'json',
                    data: { ExceptedPaymentDate: EPO.ExceptedPaymentDate },
                    url: GetCheckExpectedDate,
                    success: function (data) {
                        switch (data) {
                            case "Y":
                                break;
                            case "N":
                                verifyResult = false

                                fun_AddErrMesg($("#ExceptedPaymentDate"), "ErrExceptedPaymentDate", "承辦單位預計付款日/支票發票日非營業日")

                                break;
                            case "X":
                                verifyResult = false
                                fun_AddErrMesg($("#ExceptedPaymentDate"), "ErrExceptedPaymentDate", "營業日檢核錯誤")

                                break;
                        }
                    },
                    error: function (data) {
                        verifyResult = false
                        fun_AddErrMesg($("#ExceptedPaymentDate"), "ErrExceptedPaymentDate", "營業日檢核錯誤")
                    }
                });
            }

            //可收退數量檢查
            {
                if (EPO.Step <= 1) {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        dataType: 'json',
                        data: { EPOExpenseKind: EPO.ExpenseKind, sourceKeyId: 'EXP', supplierNumber: EPO.VendorNum, supplierSiteCode: EPO.VendorSiteCode, Currency: EPO.Currency, EmpNum: EPO.FillInEmpNum, EPOID: EPO.FormID },
                        url: GetEPOtransitListUrl,
                        success: function (data) {
                            if (data) {
                                $.each(EPO.EPODetail, function (i, o) {
                                    let DiscountQuantity = $.map(data, function (oo) {
                                        if (oo.rcvTransactionId == o.rcvTransactionId) return oo.DiscountQuantity
                                    })

                                    if (DiscountQuantity.length > 0) {
                                        if (Math.abs(o.DiscountQuantity) > Math.abs(DiscountQuantity[0])) {
                                            verifyResult = false
                                            err.push("請款明細項次 " + (i + 1) + "可收(退)數量為" + DiscountQuantity[0] + ",已超出" + Math.abs(o.DiscountQuantity - DiscountQuantity[0]) + "個")
                                        }
                                    }
                                    else {
                                        verifyResult = false
                                        err.push("請款明細項次 " + (i + 1) + "可收(退)數量為0")
                                    }
                                })
                            }
                            else {
                                verifyResult = false
                                err.push("產品在途數量查詢發生錯誤")
                            }
                        },
                        error: function (data) {
                            verifyResult = false
                            err.push("產品在途數量查詢發生錯誤")
                        }
                    });
                }
            }
        }

        if ($('[Errmsg=Y]').length > 0) {
            verifyResult = false;
            let partent;
            if ($('[Errmsg=Y]').first().parent("div .content-box").length > 0) {
                partent = $('[Errmsg=Y]').first().parent("div .content-box")
            }
            else if ($('[Errmsg=Y]').first().parent("td").length > 0) {
                partent = $('[Errmsg=Y]').first().parent("td")
            }
            else {
                //sele
                partent = $('[Errmsg=Y]').first().parent(".bootstrap-select")
            }

            if (partent.length > 0) {
                if ($(partent).is(":hidden")) {
                    //分攤明細層
                    $(partent).closest("EPOAmoIN").closest("tbody").find('.ExpandInnerDetail').first().find('span').html('收合')
                    $(partent).closest('.AmoDetail').show()
                    $(partent).closest("tr").show();
                }

                $('html, body').animate({
                    scrollTop: (partent.offset().top) - 50
                }, 500);
            }
            else {
                if ($('[Errmsg=Y]').first().offset().top > 100) {
                    $('html, body').animate({
                        scrollTop: ($('[Errmsg=Y]').first().offset().top) - 100
                    }, 500);
                }
                else {
                    alertopen("資料檢核不正確")
                }
            }
        }

        /* if (verifyResult && $("#fileSection").find("tr.fileDetail").length == 0) {
             verifyResult = false
             alertopen("請上傳檔案附件")
         }*/

        $.unblockUI();
        if (verifyResult) {
            draftAjax.resolve();
        }
        else {
            if (err.length > 0) {
                alertopen(err)
            }

            draftAjax.reject();
        }
    }, 500)
    return draftAjax.promise();
}

//欄位檢核
function necessaryVerify(targetList) {
    let rtn = true
    $.each(targetList, function (i, target) {
        $(target).find("[necessary]").each(function () {
            if ($(this).val() == null || String($(this).val()).trim().length < 1) {
                fun_AddErrMesg($(this), "Err" + $(this).attr("id"), "此為必填欄位")
                rtn = false;
            }
        })

        if (rtn) {
            //金額檢查
            // $(target).find("input[Amount]").blur()
            $(target).find("input[Amount]").each(function (i, o) {
                let Amountrtn = true;
                let Zero = $(o).attr("Zero");
                let hasCurrencyPrecise = $(o).is("[CurrencyPrecise]");
                let Max = $(o).attr("Max");
                let price = parseFloat(accounting.unformat(o.value))
                let CurrencyPrecise = (EPO.CurrencyPrecise > 6) ? 6 : EPO.CurrencyPrecise;
                if ($(o).attr("name") == "AmortizationRatio") {
                    CurrencyPrecise = 2;
                }

                if (!isNaN(price)) {
                    if (!(String(Zero).toLocaleLowerCase() == "true") && price == 0) {
                        fun_AddErrMesg(o, $(o).attr("id"), errObj.AmountNoZero)
                        Amountrtn = false
                    }
                    else {
                        if (!isNaN(Max)) {
                            if (Max > 0) {
                                if (price > Max) {
                                    fun_AddErrMesg(o, $(o).attr("id"), "數字需小於等於" + fun_accountingformatNumberdelzero(Max))
                                    Amountrtn = false
                                }

                                if (price < 0) {
                                    fun_AddErrMesg(o, $(o).attr("id"), "不可輸入負數")
                                    Amountrtn = false
                                }
                            }
                            else {
                                if (price < Max) {
                                    fun_AddErrMesg(o, $(o).attr("id"), "數字需大於等於" + fun_accountingformatNumberdelzero(Max))
                                    Amountrtn = false
                                }
                                if (price > 0) {
                                    fun_AddErrMesg(o, $(o).attr("id"), "請輸入負數")
                                    Amountrtn = false
                                }
                            }
                        }
                        else {
                            if (String(price).indexOf(".") > 0) {
                                if (hasCurrencyPrecise) {
                                    if ((String(price).length - String(price).indexOf(".") - 1) > CurrencyPrecise) {
                                        fun_AddErrMesg(o, $(o).attr("id"), "小數點不得超過" + CurrencyPrecise + "位")
                                        Amountrtn = false
                                    }
                                }
                                else {
                                    fun_AddErrMesg(o, $(o).attr("id"), "請輸入整數")
                                    Amountrtn = false
                                }
                            }
                        }
                    }
                }
                else {
                    fun_AddErrMesg(o, $(o).attr("id"), errObj.Amount)
                    Amountrtn = false
                }

                if (rtn) {
                    rtn = Amountrtn
                }
            })
        }
    })
    return rtn
}

function Save() {
    $("[data-remodal-id=modal-sent]").remodal().close()
    $.blockUI({ message: '資料寫入中...' })
    let deferred = $.Deferred();
    setTimeout(function () {
        Databinding()
        $.ajax({
            async: false,
            type: 'POST',
            dataType: 'json',
            data: EPO,
            url: '/EPO/Save/',
            success: function (data) {
                _formInfo = {
                    formGuid: data.FormGuid,
                    formNum: data.FormNum,
                    flag: data.Flag
                }
                //呼叫信用卡預算控管API
                $.when(CreditBudgetSave(data.FormGuid)).always(function (data) {
                    if (data.Status) {
                        deferred.resolve();
                    } else {
                        _formInfo.flag = false
                        deferred.reject();
                    }
                }
                )

                $("#FormTypeName").val("廠商請款請購(" + $('#textExpenseKind').text() + ")")
                $("#ApplyItem").val($('#textExpenseKind').text())

                if (!data.Flag) {
                    alert("存檔發生錯誤")
                    deferred.reject();
                }
                else {
                    deferred.resolve();
                }
            }
        }).fail(function (err, errStates) {
            deferred.reject();
            $.unblockUI();
            alert(errStates)
        });
    }, 500)

    return deferred.promise();
}

function Databinding() {
    Databinding_Master()
    Databinding_PaymentInfo()
    Databinding_EPODetail()
    Databinding_Prepayment()
    Databinding_IncomeTax()
    Databinding_BusinessTax()
}

function Databinding_Master() {
    EPO.ApplicantName = $("#ApplicantName").val()
    EPO.ApplicantEmpNum = $("#ApplicantEmpNum").val()
    EPO.ApplicantDepId = $("#ApplicantDepId").val()
    EPO.ApplicantDepName = $("#ApplicantDepName").val()

    EPO.FillInName = $("#LoginName").val()
    EPO.FillInEmpNum = $("#LoginEno").val()
    EPO.FillInDepName = $("#FillInDepName").val()

    $.each(EPO, function (key, value) {
        if ($("#PurposeBlock , #VoucherInfomationBlock").find("[id=" + key + "]").length > 0) {
            let obj = $("#PurposeBlock , #VoucherInfomationBlock").find("[id=" + key + "]")[0]

            switch (obj.tagName) {
                case "TEXTAREA":
                case "SELECT":
                    EPO[key] = $(obj).val();
                    break;
                case "INPUT":
                    switch ($(obj).attr("type")) {
                        case "checkbox":
                        case "radio":
                            EPO[key] = $(obj).prop("checked");
                            break;

                        default:
                            EPO[key] = $(obj).val();
                            break;
                    }
                    break;

                default:
                    EPO[key] = $(obj).text();
                    break;
            }
            if (obj.hasAttribute("Amount")) {
                EPO[key] = accounting.unformat(EPO[key]);
            }
        }
    })

    EPO.BargainingCode = $("#BargainingCode").val()
    EPO.ExportApplyAttribute = $("#ExportApplyAttribute").val()
    EPO.EstimatePayDate = (EPO.EstimatePayDateToString == "") ? EPO.EstimatePayDate : EPO.EstimatePayDateToString
    EPO.EstimateVoucherDate = (EPO.EstimateVoucherDateTostring == "") ? EPO.EstimateVoucherDate : EPO.EstimateVoucherDateTostring
    // EPO.ExceptedPaymentDate = (EPO.ExceptedPaymentDatetoString == "") ? EPO.ExceptedPaymentDate : EPO.ExceptedPaymentDatetoString

    if (!isNaN(EPO.MARGINAMT) && EPO.MARGINAMT > 0) {
        EPO.WithHoldingAccountingAmount = $("#WithHoldingAccountingAmountCode").val()
        EPO.WithHoldingAccountingAmountName = $("#WithHoldingAccountingAmountName").val()
    }
}

function Databinding_PaymentInfo() {
    EPO.PaymentInfo.FormID = EPO.FormID
    EPO.PaymentInfo.EMPNum = EPO.VendorNum
    EPO.PaymentInfo.EMPName = EPO.VendorName
    EPO.PaymentInfo.AccountDesc = $("#AccountDescDisable").text()
    EPO.PaymentInfo.PaymentMethod = $("#PaymentMethod").val()
    EPO.PaymentInfo.PayReMark = $("#PayReMark").val()
    EPO.PaymentInfo.Remittance = $('#Remittance').val()
    EPO.PaymentInfo.Bank = $("#Bank").val()
    EPO.PaymentInfo.BankName = $("#BankName").val()
    EPO.PaymentInfo.Branch = $("#Branch").val()
    EPO.PaymentInfo.BranchName = $("#BranchName").val()
    EPO.PaymentInfo.AccountNum = $("#AccountNum").val()
    EPO.PaymentInfo.AccountName = $("#AccountNameInput").val()
    EPO.PaymentInfo.PaymentMethodName = $("#PaymentMethod").find("option:selected").text()
    EPO.PaymentInfo.BankAccountId = $("#BankAccountId").val()
}

function Databinding_EPODetail() {
    function Databinding_AMOINDetail(AMOList) {
        let objlist = []
        let obj
        $.each(AMOList, function (i, o) {
            obj = {
                ADetailID: $(o).find("[name=ADetailID]").val(),
                AccountBank: $(o).find("[name=AccountBank]").val(),
                AccountBankName: $(o).find("[name=AccountBank]").find("option:selected").attr("description"),
                AccountingItem: $(o).find("[name=AccountingItem]").val(),
                AmortizationRatio: $(o).find("[name=AmortizationRatio]").val(),
                AccountingItemName: $(o).find("[name=AccountingItemName]").val(),
                CostProfitCenter: $(o).find("[name=CostProfitCenter]").val(),
                CostProfitCenterName: $(o).find("[name=CostProfitCenter]").find("option:selected").attr("description"),
                ProductKind: $(o).find("[name=ProductKind]").val(),
                ProductKindName: $(o).find("[name=ProductKind]").find("option:selected").attr("description"),
                ProductDetail: $(o).find("#AmortizationDetailProductDetailCode").val(),
                ProductDetailName: $(o).find("#AmortizationDetailProductDetailName").val(),
                ExpenseAttribute: $(o).find("[name=ExpenseAttribute]").val(),
                ExpenseAttributeName: ($(o).find("[name=ExpenseAttribute]").val() == "") ? "" : $(o).find("[name=ExpenseAttribute]").find("option:selected").text(),
                OriginalAmortizationAmount: accounting.unformat($(o).find("[name=OriginalAmortizationAmount]").val()),
                OriginalAmortizationTWDAmount: accounting.unformat($(o).find("[name=OriginalAmortizationTWDAmount]").text()),
                IsDelete: $(o).find("[name=IsDelete]").val(),
            }
            objlist.push(obj)
        })

        return objlist
    }

    let tbodyList = $("table#EPODetailResult").children("tbody")

    $.each($.grep(EPO.EPODetail, function (o) { return !o.IsDelete }), function (i, o) {
        o.ProjectCategory = $(tbodyList).eq(i).find("[name=ProjectCategory]").val()
        o.ProjectCategoryName = (o.ProjectCategory != "") ? $(tbodyList).eq(i).find("[name=ProjectCategory] option:selected").text() : ""

        o.Project = $(tbodyList).eq(i).find("[name=Project]").val()
        o.ProjectName = (o.Project != "") ? $(tbodyList).eq(i).find("[name=Project] option:selected").text() : ""

        o.ProjectItem = $(tbodyList).eq(i).find("[name=ProjectItem]").val()
        o.ProjectItemName = (o.ProjectItem != "") ? $(tbodyList).eq(i).find("[name=ProjectItem] option:selected").text() : ""

        /*if (o.Reconcile != "Y") {
            o.AmortizationEndDate = ""
            o.AmortizationStartDate = ""
        }
        else {
            o.AmortizationEndDate = $(tbodyList).eq(i).find("[name=AmortizationEndDate]").val()
            o.AmortizationStartDate = $(tbodyList).eq(i).find("[name=AmortizationStartDate]").val()
        }*/

        o.AmortizationEndDate = $(tbodyList).eq(i).find("[name=AmortizationEndDate]").val()
        o.AmortizationStartDate = $(tbodyList).eq(i).find("[name=AmortizationStartDate]").val()

        if (EPO.Deduction) {
            o.IsIncomeDeduction = ($(tbodyList).eq(i).find("select[name=SelectIsIncomeDeduction]").val() == "Y") ? true : false
        }
        else {
            o.IsIncomeDeduction = false
        }

        o.OriginalAmount = accounting.unformat($(tbodyList).eq(i).find("[name=_OriginalAmount]").val())
        o.OriginalTax = accounting.unformat($(tbodyList).eq(i).find("[name=OriginalTax]").val())
        o.OriginalSaleAmount = accounting.unformat($(tbodyList).eq(i).find("[name=OriginalSaleAmount]").text())
        o.TWDAmount = accounting.unformat($(tbodyList).eq(i).find("[name=TWDAmount]").text())
        o.TWDTax = accounting.unformat($(tbodyList).eq(i).find("[name=TWDTax]").text())
        o.TWDSaleAmount = accounting.unformat($(tbodyList).eq(i).find("[name=TWDSaleAmount]").text())
        o.RateDate = $(tbodyList).eq(i).find("[name=RateDate]").val()
        o.VoucherMemo = $(tbodyList).eq(i).find("[name=VoucherMemo]").val()
        o.AmortizationDetail = $.merge($.grep(o.AmortizationDetail, function (_o) { return _o.IsDelete == true && parseInt(_o.ADetailID) > 0 }),
                             Databinding_AMOINDetail($(tbodyList).eq(i).find("#EPOAmoIN tbody")))
    })
}

function Databinding_Prepayment() {
    let objlist = []
    let obj

    $("#PrepaymentTable tbody").each(function (i, o) {
        let PreID = accounting.unformat($(o).find("#PreID").val()),
        obj = {
            PreID: PreID,
            PrepaymentNum: $(o).find("#PrepaymentNumInput").val(),
            WriteOffAmount: accounting.unformat($(o).find("#WriteOffAmountInput").val()),
            PrepaymentAmount: accounting.unformat($(o).find("#PrepaymentAmountDisable").text()),
            UnWriteOffAmount: accounting.unformat($(o).find("#UnWriteOffAmountDisable").text()),
            IsDelete: false
        }

        objlist.push(obj)
    })

    $.each(EPO.Prepayment, function (i, Pre) {
        if (Pre.PreID == 0) {
            Pre.IsDelete = true
            return true
        }

        PrepaymentFilter = $.grep(objlist, function (o) { return o.PreID == Pre.PreID })
        if (PrepaymentFilter.length > 0) {
            Pre = PrepaymentFilter[0]
        }
        else {
            Pre.IsDelete = true
        }
    })

    EPO.Prepayment = $.merge(EPO.Prepayment, $.grep(objlist, function (o) { return o.PreID == 0 }))
}

function Databinding_IncomeTax() {
    if ($("#Deduction").prop("checked")) {
        EPO.needIncomeTax = 1

        let IncomeTaxTable = $("#IncomeTaxTable")

        EPO.IncomeTax = {
            IncomeID: (isNaN(EPO.IncomeTax.IncomeID)) ? 0 : EPO.IncomeTax.IncomeID,
            IncomeNum: $(IncomeTaxTable).find("#IncomeNum").val(),
            IncomePerson: $(IncomeTaxTable).find("#IncomePerson").val(),
            IsTwoHealthInsurance: $(IncomeTaxTable).find("#IsTwoHealthInsurance").val(),
            LeaseTax: $(IncomeTaxTable).find("#LeaseTax").val(),
            LeaseAddress: $(IncomeTaxTable).find("#LeaseAddress").val(),
            PermanentPostNum: $(IncomeTaxTable).find("#PermanentPostNum").val(),
            PermanentAddress: $(IncomeTaxTable).find("#PermanentAddress").val(),
            ContactPostNum: $(IncomeTaxTable).find("#ContactPostNum").val(),
            ContactAddress: $(IncomeTaxTable).find("#ContactAddress").val(),
            LeaseAddress: $(IncomeTaxTable).find("#LeaseAddress").val(),
            CertficateKind: $(IncomeTaxTable).find("#CertficateKind").val(),
            IncomeCode: $(IncomeTaxTable).find("#IncomeCodeCode").val(),
            TaxName: $(IncomeTaxTable).find("#IncomeCodeName").val(),
            WriterIncomeNum: $(IncomeTaxTable).find("#WriterIncomeNumSelect").val(),
            OtherIncomNum: $(IncomeTaxTable).find("#OtherIncomNumSelect").val(),
            ProfeesionalKind: $(IncomeTaxTable).find("#ProfeesionalKindSelect").val(),
            LeaseTaxCode: $(IncomeTaxTable).find("#LeaseTaxCodeSelect").val(),
            CountryCode: $(IncomeTaxTable).find("#CountryCodeCode").val(),
            NetPayment: accounting.unformat($(IncomeTaxTable).find("#NetPaymentInput").val()),
            WithholdingTax: accounting.unformat($(IncomeTaxTable).find("#WithholdingTaxInput").val()),
            SupplementPremium: accounting.unformat($(IncomeTaxTable).find("#SupplementPremiumInput").val())
        }
    }
    else {
        EPO.IncomeTax.WithholdingTax = 0;
        EPO.IncomeTax.SupplementPremium = 0;
        EPO.needIncomeTax = 0
    }
}

function Databinding_BusinessTax() {
    if ($("#gvDeclaration").val() == "403" && EPO.Step == 3) {
        let BusinessTaxTable = $("#BusinessTaxTable")

        $.each(EPO.BusinessTax, function (key, value) {
            if ($(BusinessTaxTable).find("[name=" + key + "]").length > 0) {
                let obj = $(BusinessTaxTable).find("[name=" + key + "]")[0]
                switch (obj.tagName) {
                    case "SELECT":
                    case "INPUT":
                        EPO.BusinessTax[key] = $(obj).val();
                        break;

                    default:
                        EPO.BusinessTax[key] = $(obj).text();
                        break;
                }
                if (obj.hasAttribute("Amount")) {
                    EPO.BusinessTax[key] = accounting.unformat(EPO.BusinessTax[key]);
                }
            }
        })

        EPO.BusinessTax.FormatKindName = $(BusinessTaxTable).find("[name=FormatKind]").find("option:selected").data("text")

        let twdAmount = 0;
        $.each(EPO.EPODetail, function (i, o) {
            twdAmount += o.TWDAmount
        })
        EPO.BusinessTax.CertificateAmount = twdAmount
        $("#BusinessTaxTable").find("[name=CertificateAmount]").text(
            fun_accountingformatNumberdelzero(twdAmount)
            )

        EPO.needBusinessTax = 1
    }
    else {
        EPO.needBusinessTax = 0
    }
}

function Dataseting() {
    //let __datasetingStart = (new Date).getTime()
    // console.log("Dataseting 開始")

    $.each(EPO, function (key, value) {
        if ($("input[name=" + key + "]").length > 0) {
            if ($("input[name=" + key + "]")[0].hasAttribute("Amount")) {
                $("input[name=" + key + "]").val(fun_accountingformatNumberdelzero(value))
            }
            else {
                $("input[name=" + key + "]").val(value);
            }
        }
        if ($("select[name=" + key + "]").length > 0) {
            $("select[name=" + key + "]").val(value).selectpicker('refresh');
        }
    })

    $("#PaymentAmount").text(fun_accountingformatNumberdelzero($("#PaymentAmount").text()))

    if (EPO.WithHoldingAccountingAmount != null && EPO.WithHoldingAccountingAmount.length > 0) {
        $("#WithHoldingAccountingAmountDisable").html(EPO.WithHoldingAccountingAmount + "-" + EPO.WithHoldingAccountingAmountName)
    }

    $("#ExceptedPaymentDate").val(EPO.ExceptedPaymentDatetoString)

    //$("#CertificateAmount").attr("Max", EPO.AcceptanceAmount)
    //$("#OriginalAmount").attr("Max", EPO.CertificateAmount)
    $("#textIDNo").text(EPO.IDNo)
    $("#VendorNameAndNum2").text(EPO.VendorName + '(' + EPO.VendorNum + ')')
    $("#EstimateVoucherDate").val(EPO.EstimateVoucherDateTostring)
    $("#div_EstimatePayDate").text(EPO.EstimatePayDateToString)
    $("#DiscountInvoiceDate").val(EPO.DiscountInvoiceDateTostring)
    $("#PayAlone").prop("checked", EPO["PayAlone"])
    $("#ForeignLabor").prop("checked", EPO["ForeignLabor"])
    $("#Deduction").prop("checked", EPO["Deduction"])

    if (isNullOrEmpty(EPO.DiscountInvoice)) {
        $("#DiscountInvoiceDate").toggleClass("input-disable", true).prop("disabled", true)
    }

    $("#DiscountReceive").prop("checked", EPO["DiscountReceive"])
    if (EPO.Prepayment.length > 0) {
        CreatePrepaymentTbody(EPO.Prepayment)
    }

    $('#textExpenseKind').text($("#search_ExpenseKind").find("option[value='" + EPO.ExpenseKind + "']").text())
    $('#PaymentMethod').val(EPO.PaymentInfo.PaymentMethod).selectpicker('refresh')
    $('#Remittance').val(EPO.PaymentInfo.Remittance).selectpicker('refresh')
    $('#RemittanceDisable').text($('#Remittance option:selected').text())

    $('#BankAccountId').val(EPO.PaymentInfo.BankAccountId)
    $('#BankNameDisable').text(EPO.PaymentInfo.BankName);
    $('#BankName').val(EPO.PaymentInfo.BankName);
    $('#Bank').val(EPO.PaymentInfo.Bank);

    $('#AccountDescDisable').text(EPO.PaymentInfo.AccountDesc);
    $('#AccountDesc').val(EPO.PaymentInfo.AccountDesc);

    $('#AccountNumDisable').text(EPO.PaymentInfo.AccountNum);
    $('#AccountNum').val(EPO.PaymentInfo.AccountNum);

    $('#AccountNameDisable').text(EPO.PaymentInfo.AccountName);
    $('#AccountNameInput').val(EPO.PaymentInfo.AccountName);
    $('#AccountName').val(EPO.PaymentInfo.AccountName);

    $('#BranchNameDisable').text(EPO.PaymentInfo.BranchName);
    $('#BranchName').val(EPO.PaymentInfo.BranchName);
    $('#Branch').val(EPO.PaymentInfo.Branch);
    $('#PayReMark').val(EPO.PaymentInfo.PayReMark);

    if (EPO.InvoiceOverdue != null && EPO.InvoiceOverdue != "") {
        necessaryColumn("InvoiceOverdue")
        $("#InvoiceOverdue").closest(".content-box").show()
    }
    if (EPO.YearVoucher != null && EPO.YearVoucher != "") {
        necessaryColumn("YearVoucher")
        $("#YearVoucher").closest(".content-box").show()
    }

    let VoucherBeaulist = $.grep(_VoucherBeauCollection, function (o) {
        return (EPO.VoucherBeau == o.bANNumber)
    })

    if (VoucherBeaulist.length > 0) {
        $("#gvDeclaration").val(VoucherBeaulist[0].gvDeclaration)
        $("#isCreditCardOffice").val(VoucherBeaulist[0].isCreditCardOffice)
    }

    //載入明細
    let defaultvalue = {
        Deduction: EPO.Deduction,
        EPOExpenseKind: EPO.ExpenseKind,
        Currency: EPO.Currency,
        PaymentMethod: EPO.PaymentInfo.PaymentMethod,
        Remittance: EPO.PaymentInfo.Remittance,
        PayAlone: EPO.PayAlone,
        // CostProfitCenter: vendorInfo.supplierSite.prepayCodeCombinationDepartment,
        CertificateKind: EPO.CertificateKind,
    }

    //let __EPODetailResultActionTime = (new Date).getTime()
    // console.log("EPODetailResultAction 開始")
    EPODetailResultAction(defaultvalue)
    // console.log("EPODetailResultAction 結束 花費" + ((new Date).getTime() - __EPODetailResultActionTime) / 1000 + "秒")

    $("#Emergency").prop("checked", EPO["Emergency"])
    putIncomeTaxInformation(EPO.IncomeTax)

    $("#VoucherBeau").val(EPO.VoucherBeau).selectpicker('refresh')
    $("#VoucherBeau").change()
    $("#PaymentMethod").val(EPO.PaymentInfo.PaymentMethod).selectpicker('refresh')
    $("#PurposeBlock").show()
    $("#VoucherInfomationBlock").show()
    $("#PaymentInfomationBlock").show()
    $("#EPODetailResultBlock").show()

    // console.log("Dataseting 結束 花費" + ((new Date).getTime() - __datasetingStart) / 1000 + "秒")
}

// A $( document ).ready() block.
$(function () {
    let __loadingStart = (new Date).getTime()
    console.log("載入開始")

    $(document).on('click', '[name=UploadBtn]', function () {
        $('#Aupload').attr("lineNum", $(this).attr('lineNum')).click()
    })

    $(document).on('change', '#Aupload', function () {
        let data = new FormData();

        if ($(this)[0].files.length > 0) {
            let lineNum = parseInt($(this).attr("lineNum"))
            let targetTbody = $("table#EPODetailResult").children("tbody").eq(lineNum);

            //  Databinding_EPODetail()
            data.append("ExpenseKindReturn", (EPO.ExpenseKind == "PO_CM_RETURN"))
            data.append("file", $(this)[0].files[0])
            data.append("isDeductible", isDeductible())
            data.append("isCard", isCardEmp)
            //data.append("OriginalAmount",fun_accountingformatNumberdelzero(EPO.EPODetail[lineNum].OriginalAmount)
            // data.append("OriginalSaleAmount", EPO.EPODetail[lineNum].OriginalSaleAmount)
            data.append("OriginalAmount", accounting.toFixed($(targetTbody).find("input[name=_OriginalAmount]").val()))
            data.append("OriginalSaleAmount", accounting.toFixed($(targetTbody).find("[name=OriginalSaleAmount]").text()))
            data.append("Rate", EPO.Rate)
            data.append("TWDAmount", accounting.toFixed($(targetTbody).find("[name=TWDAmount]").text()))
            data.append("TWDSaleAmount", accounting.toFixed($(targetTbody).find("[name=TWDSaleAmount]").text()))
            data.append("CurrencyPrecise", EPO.CurrencyPrecise)
            $.blockUI({ message: '檔案處理中...' })

            $.ajax({
                type: 'POST',
                data: data,
                dataType: 'json',
                contentType: false,
                processData: false,
                url: '/EPO/UploadAmoritizationDetail/',
            }).done(function (data) {
                if (data.status) {
                    let __startTime = (new Date).getTime()

                    let EPOAmoIN = $(targetTbody).find('#EPOAmoIN')
                    let tmptTbody = $(EPOAmoIN).find("tbody").first().clone()
                    $(tmptTbody).find("[errmsg]").remove()
                    $(tmptTbody).find("input").not("[name=AccountingItem]").not("[name=IsDelete]").val("")
                    $.each($.grep(EPO.EPODetail, function (o) { return !o.IsDelete })[lineNum].AmortizationDetail, function (i, o) {
                        o.IsDelete = true;
                    })
                    $(EPOAmoIN).find("tbody").remove();

                    let startTime = (new Date).getTime()

                    $.each(data.Adetail, function (i, o) {
                        let tbody = $(tmptTbody).clone()

                        console.log("第" + i + "筆，花費 " + (((new Date).getTime() - startTime) / 1000) + " 秒")
                        startTime = (new Date).getTime()

                        if (o.AccountBank.length == 0) {
                            tbody.find("select[name='AccountBank']").val($("#Books").val())
                        }
                        else {
                            tbody.find("select[name='AccountBank']").val(o.AccountBank)
                        }

                        tbody.find("select[name='CostProfitCenter']").val(o.CostProfitCenter)
                        tbody.find("input[name='OriginalAmortizationAmount']").val(fun_accountingformatNumberdelzero(o.OriginalAmortizationAmount))
                        tbody.find("input[name='AmortizationRatio']").val(o.AmortizationRatio)
                        tbody.find("[name='OriginalAmortizationTWDAmount']").text(fun_accountingformatNumberdelzero(o.OriginalAmortizationTWDAmount))

                        let AccountingItemCode = tbody.find("#AccountingItemCode").val()

                        $.each(CoaAccount, function (x, y) {
                            if (y.account == AccountingItemCode) {
                                tbody.find("#AccountingItemDisable").html(y.account + "-" + y.description)
                                tbody.find("#AccountingItemCode").val(y.account)
                                tbody.find("#AccountingItemName").val(y.description)
                                return false
                            }
                        })

                        if (!isNullOrEmpty(o.ProductKind)) { tbody.find("select[name='ProductKind']").val(o.ProductKind) }
                        if (!isNullOrEmpty(o.productDetail)) {
                            tbody.find("#AmortizationDetailProductDetailDisable").html(o.productDetail + "-" + o.ProductDetailName)
                            tbody.find("#AmortizationDetailProductDetailCode").val(o.productDetail)
                            tbody.find("#AmortizationDetailProductDetailName").val(o.ProductDetailName)
                        }
                        else {
                            tbody.find("#AmortizationDetailProductDetailDisable").html('<span class="undone-text">點選按鈕新增</span>')
                        }

                        if (isCardEmp) {
                            $(tbody).find("select[name='CostProfitCenter']").attr("necessary", "").toggleClass("input-disable", false).prop("disabled", false)
                        }
                        else {
                            $(tbody).find("select[name='ExpenseAttribute']").removeAttr("necessary", "").toggleClass("input-disable", true).prop("disabled", true).val("")
                        }

                        $(tbody).find("select").on('change', function (e) {
                            $(this).closest("td").find("[Errmsg=Y]").remove()
                        })

                        $(tbody).find('input[name=OriginalAmortizationAmount]').on('focus', function (e) {
                            $(this).next("[Errmsg=Y]").remove()
                        })
                        $(tbody).find('input[name=OriginalAmortizationAmount]').on('blur', function (e) {
                            eventHandler(e)
                        })

                        $(tbody).find('input[name=AmortizationRatio]').on('focus', function (e) {
                            $(this).next("[Errmsg=Y]").remove()
                        })
                        $(tbody).find('input[name=AmortizationRatio]').on('blur', function (e) {
                            eventHandler(e)
                        })

                        $(tbody).find('select[name=CostProfitCenter]').on('change', function (e) {
                            eventHandler(e)
                        })

                        $(tbody).find('select[name=AccountBank]').on('change', function (e) {
                            eventHandler(e)
                        })

                        $(EPOAmoIN).append(tbody)
                    })

                    $(EPOAmoIN).find("tbody").not(":first").mouseenter(function () {
                        $(this).find(".icon-remove-size").show();
                    })
                    $(EPOAmoIN).find("tbody").not(":first").mouseleave(function () {
                        $(this).find(".icon-remove-size").hide();
                    })
                    //重新計算項次編號
                    $(EPOAmoIN).find('tbody').find("td[alt='Index']").each(function (index) {
                        $(this).text(index + 1);
                    });

                    console.log("總運算秒數 " + (((new Date).getTime() - __startTime) / 1000) + " 秒")
                }
                else {
                    alertopen(data.ErrList)
                }
            }).fail(function (Err) {
                alertopen("檔案上傳發生錯誤")
            }).always(function () {
                $.unblockUI();
            })
        }

        $(this).val("");
    })

    isCardEmp = $.map(_unitData, function (o) {
        if (o.unit_level == 4) { return o.unit_id }
    })[0] == __CreditCardDepId

    //流程切換
    if ($('#P_CurrentStep').val() <= "1" && $('#P_JBPMUID').val() == "" && isCardEmp) {
        _requestGetNextApprover.CustomFlowKey = "EPO_P1_Credit";
        updateCustomFlowKey("EPO_P1_Credit");
        _stageInfo.CustomFlowKey = "EPO_P1_Credit";
        _stageInfo.NextCustomFlowKey = "EPO_P1_Credit"
        $('#P_CustomFlowKey').val("EPO_P1_Credit");
    }

    $("#Emergency").closest('label').hide()
    $("#ForeignLabor").prop("disabled", true)
    $("#Deduction").prop("disabled", true)
    $("#Rate").attr("Amount", "").attr("Zero", false).attr("Max", 9999999999.99999999).attr("CurrencyPrecise", "")
    $("#MARGINAMT").attr("Amount", "").attr("Zero", true).attr("Max", 9999999999.99999999)
    $("#CertificateAmount").attr("Amount", "")
    $("#OriginalAmount").attr("Amount", "")
    $("#TWDAmount").attr("Amount", "")
    $("#TWDTaxAmount").attr("Amount", "")
    $("#ExceptedPaymentDate").closest(".content-box").hide()

    let today = new Date()
    let todaystr = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate()

    $("#EstimateVoucherDate").parent("div").data("DateTimePicker").maxDate(todaystr);
    $("#DiscountInvoiceDate").parent("div").data("DateTimePicker").maxDate(todaystr);
    $("#ExceptedPaymentDate").parent("div").data("DateTimePicker").minDate(todaystr);
    $("#Remittance").closest(".content-box").hide()
    $("#health2Alert").on("click", function () { alertopen(alertMesage.Health2) })

    CertificateKindList = $("#CertificateKind option").map(function (i, o) {
        return { "value": $(o).val(), "text": $(o).text() }
    })
    $("#InvoiceOverdue").closest(".content-box").hide()
    $("#YearVoucher").closest(".content-box").hide()
    $("#DiscountInvoice").closest(".content-box").hide()
    $("#DiscountInvoiceDate").closest(".content-box").hide()
    $("#DiscountReceive").closest(".content-box").hide()
    $("#InvoiceOverdue").attr("maxlength", 30)
    $("#YearVoucher").attr("maxlength", 50)
    $("#ContractNum").attr("maxlength", 20)

    necessaryColumn("HeaderDesc")
    necessaryColumn("VoucherBeau")
    necessaryColumn("CertificateKind")
    //necessaryColumn("CertificateAmount")
    //necessaryColumn("OriginalAmount")
    necessaryColumn("PaymentMethod")

    ajaxPartialView(getCurrencyUrl, { "epoNum": __epoNum }, function (content) {
        $.each(content, function (i, o) {
            $('#search_Currency').append($("<option></option>").attr("data-subtext", o[0]).attr("value", o[0]).text(o[1]).data("extendedPrecision", o[2]))
        })
    }).done(function () {
        //要先refresh 更新清單才能選的到值
        $('#search_Currency').selectpicker('refresh').val("TWD").selectpicker('refresh');
    })

    //控制項bind EPO Model Object
    //$('#MainForm').bindings('create')(EPO)
    //var bindings = $.bindings(EPO)
    //設定各事件
    SetEvents()

    //呈現存檔後Post 回來頁面需Show顯示供應商編號及姓名
    /*if ($('#VendorNum').val() !== "") {
        $('#VendorNameAndNum').text($('#VendorName').val() + '(' + $('#VendorNum').val() + ')');
    }*/

    //所得稅下拉選單設定
    $.when(FiisDataAjax.promise()).done(function () {
        let IncomeTaxTable = $("#IncomeTaxTable")

        $.each(wtIdentityType.Data, function (i, o) {
            $(IncomeTaxTable).find('#CertficateKind').append($('<option value="' + o.identityTypeCode + '">' + o.identityTypeCode + ' - ' + o.description + '</option>').data("text", o.description).data("wtCode", o.tag))
        })
        $(IncomeTaxTable).find('#CertficateKind').selectpicker('refresh')

        $.each(Wt9bExpenseType, function (i, o) {
            $(IncomeTaxTable).find('#WriterIncomeNumSelect').append($('<option value="' + o.wt9bExpenseType + '">' + o.wt9bExpenseTypeDescription + '</option>').data("text", o.description))
        })
        $(IncomeTaxTable).find('#WriterIncomeNumSelect').selectpicker('refresh')

        $.each(Wt92PayItem, function (i, o) {
            $(IncomeTaxTable).find('#OtherIncomNumSelect').append($('<option value="' + o.wt92PayItem + '">' + o.wt92PayItemDescription + '</option>')
            .data("text", o.description))
        })
        $(IncomeTaxTable).find('#OtherIncomNumSelect').selectpicker('refresh')

        $.each(Wt9aPf, function (i, o) {
            $(IncomeTaxTable).find('#ProfeesionalKindSelect').append($('<option value="' + o.wt9aPfType + '">' + o.wt9aPfTypeDescription + '</option>')
            .data("text", o.description))
        })
        $(IncomeTaxTable).find('#ProfeesionalKindSelect').selectpicker('refresh')

        $.each(Wt92TaxTreaty, function (i, o) {
            $(IncomeTaxTable).find('#LeaseTaxCodeSelect').append($('<option value="' + o.wtTaxTreaty + '">' + o.wtTaxTreatyDescription + '</option>')
            .data("text", o.description))
        })
        $(IncomeTaxTable).find('#LeaseTaxCodeSelect').selectpicker('refresh')

        let IncomeCodeList = []

        $.each(WtTax, function (i, o) {
            IncomeCodeList.push({ key: o.wtTaxCode, value: o.wtTaxtCodeDescription })
        })

        _optionList.push({ key: 'IncomeCode', value: IncomeCodeList })

        CountryCodeList = []

        $.each(Territory, function (i, o) {
            CountryCodeList.push({ key: o.territoryCode, value: o.territoryShortCode })
        })
        _optionList.push({ key: 'CountryCode', value: CountryCodeList })
    })

    //有資料時的處理
    if (EPO.EPODetail.length > 0) {
        //呼叫庚漢的廠商資料 取得帳號資訊列表
        optionInput.supplierNumber = EPO.VendorNum;

        $.when(resultOutput(), cerObject.promise(), FiisDataAjax.promise()).always(function () {
            if (_vendor.length > 0) {
                vendorInfo = _vendor[0]
                PaymentAccount(_vendor[0].supplierBank)
                //  $("#VendorInfo").val(vendorInfo.supplierNumber).data("data", vendorInfo)
            }
            Dataseting()
            $.when(detailDeferred).always(function () {
                console.log("處理stageControl")
                stageControl(EPO.Step)
            })
        });
    }
    else {
        console.log("處理stageControl 2")
        stageControl(EPO.Step)
        __Deductible = false
    }

    $.each($("input[Amount]"), function (i, o) {
        $(o).val(fun_accountingformatNumberdelzero($(o).val()))
    })
    $.each($("[Amount]").not("input"), function (i, o) {
        $(o).text(fun_accountingformatNumberdelzero($(o).text()))
    })

    //供應商隱藏欄位的處理
    // suppliesWriteToHiddenControl()

    console.log("載入結束 花費" + ((new Date).getTime() - __loadingStart) / 1000 + "秒")
});

//關卡卡控
function stageControl(step) {
    console.log(detailDeferred.state())
    switch (step) {
        case 1:
        case 2:
            EPO.BusinessTax.IsDeduction = null
            $("[VoucherMemo]").remove()//移除傳票編號
            break;
        case 3:
            {
                if (EPO.CertificateKind == "C") {
                    $("#MARGINAMT").closest(".content-box").hide()
                }
                else {
                    fun_ControlDisable($("#MARGINAMT"), EPO.MARGINAMT)
                    $("#Deduction").removeAttr("disabled")
                }

                if (EPO.PaymentInfo.PaymentMethod == "BILLS_PAYABLE") {//遠期支票
                    necessaryColumn("ExceptedPaymentDate")
                }
                else {
                    removeNecessaryColumn("ExceptedPaymentDate")
                }

                $("#VendorBlock").hide()
                $("#PayAlone").attr("disabled", true)
                $("#ForeignLabor").removeAttr("disabled")

                $("#Emergency").removeAttr("disabled").parent().show()
                fun_ControlDisable($("#HeaderDesc"), EPO.HeaderDesc)
                fun_ControlDisable($("#ExpenseDesc"), EPO.ExpenseDesc)

                $("#ExceptedPaymentDate").closest(".content-box").show()

                if (EPO.MARGINAMT > 0) {
                    $("#divWithHoldingAccountingAmount").show()

                    necessaryColumn("WithHoldingAccountingAmountCode")

                    let WithHoldingAccountingAmountList = []

                    $.each(CoaAccount, function (i, o) {
                        WithHoldingAccountingAmountList.push({ key: o.account, value: o.description })
                    })

                    _optionList.push({ key: 'WithHoldingAccountingAmount', value: WithHoldingAccountingAmountList })
                    $("#WithHoldingAccountingAmountSelectBtn").on("click", function () {
                        $('#remodal-tempSelected').data("target", $("#divWithHoldingAccountingAmount"))
                        OptionSelectOpen('WithHoldingAccountingAmount', 'WithHoldingAccountingAmount', $("#WithHoldingAccountingAmountSelectBtn"))
                    })
                }
                fun_ControlDisable($("#VoucherBeau"), EPO.VoucherBeauName)
                fun_ControlDisable($("#CertificateKind"), $.map(CertificateKindList, function (o) {
                    if (o.value == EPO.CertificateKind) {
                        return o.text
                    }
                })[0])

                fun_ControlDisable($("#ContractNum"), EPO.ContractNum)
                //fun_ControlDisable($("#CertificateAmount"), fun_accountingformatNumberdelzero(EPO.CertificateAmount))
                //fun_ControlDisable($("#OriginalAmount"), fun_accountingformatNumberdelzero(EPO.OriginalAmount))

                fun_ControlDisable($("#PaymentMethod"), EPO.PaymentInfo.PaymentMethodName)
                fun_ControlDisable($("#PayReMark"), EPO.PaymentInfo.PayReMark)
                fun_ControlDisable($("#ExportApplyAttribute"), $("#ExportApplyAttribute").find("option[value='" + EPO.ExportApplyAttribute + "']").text())

                $("[name=VoucherMemo]").attr("necessary", "")

                $("[name=AccountingItem]").attr("necessary", "")
                //預付款沖銷
                $("#PrepaymentRootBlock input#WriteOffAmountInput").each(function () {
                    fun_ControlDisable(this, this.value)
                }
                    )
                $("#PrepaymentRootBlock tbody").off("mouseenter")
                $("#PrepaymentRootBlock tbody").off("mouseleave")
                $("#AccountSelectBtn").hide()
                $("#Prepaymentbtn").hide()
                if ($("#undone-vendorSelect").length > 0) {
                    $("#undone-vendorSelect").text("無資料")
                }

                //所得稅相關
                $("#IsTwoHealthInsurance").attr("necessary", "")
                $("#IncomeCodeCode").attr("necessary", "")
                $("#accounting-stage-field").show()
                $("#IsTwoHealthInsurance").on("change", function () {
                    if (this.value == "Y") {
                        //二代健保最大金額 一千萬 *1.91%
                        $("#IncomeTaxTable").find("#SupplementPremiumInput").attr("Max", 10000000 * 0.0191)
                        $("#IncomeTaxTable").find("#SupplementPremiumInput").removeAttr("Zero").removeAttr("readonly", true).removeClass("input-disable")
                    }
                    else {
                        $("#IncomeTaxTable").find("#SupplementPremiumInput").val(0).attr("Zero", true).attr("readonly", true).addClass("input-disable")
                    }
                })
                fun_DeductionChuang()

                $(document).on("change", "#CertficateKind ,#IncomeCodeCode, #IsTwoHealthInsurance  , [name=SelectIsIncomeDeduction]", GetValidateWtTax)

                //營業稅相關
                {
                    if ($("#gvDeclaration").val() == "403") {
                        __Deductible = isDeductible();

                        if (EPO.BusinessTax.BusinessID == 0) {
                            /* let twdAmount = 0;
                             let twdtaxAmount = 0;

                             $.each(EPO.EPODetail, function (i, o) {
                                 twdAmount += o.TWDAmount
                                 twdtaxAmount += o.TWDTax
                             })*/

                            EPO.BusinessTax.CertificateDate = EPO.EstimateVoucherDate
                            EPO.BusinessTax.CertificateNum = EPO.CertificateNum
                            EPO.BusinessTax.CertificateAmount = EPO.TWDAmount
                            EPO.BusinessTax.BusinessNum = EPO.IDNo
                            EPO.BusinessTax.Taxable = EPO.TWDAmount - EPO.TWDTaxAmount
                            EPO.BusinessTax.TaxAmount = EPO.TWDTaxAmount
                            EPO.BusinessTax.IsDeduction = (__Deductible) ? "Y" : "N"
                            EPO.BusinessTax.FormatKind = (EPO.ExpenseKind == "PO_CM_RETURN") ? 23 : 21
                        }

                        /* if (EPO.ExpenseKind == "PO_CM_RETURN") {
                             EPO.BusinessTax.FormatKind = 22
                             EPO.BusinessTax.Taxable = parseFloat(accounting.toFixed((EPO.TWDAmount) * accounting.toFixed(1 - 0.05 / 1.05,8)))
                             EPO.BusinessTax.TaxAmount = EPO.TWDAmount - EPO.BusinessTax.Taxable
                         }*/

                        $("#BusinessTaxTableResult").show()
                        if ($("#isCreditCardOffice").val() == "Y") {
                            $(".BeauCreditCardOpen").show()

                            $.each(DeductCategory, function (i, o) {
                                $("#TaxCategory").append($("<option></option>").attr("value", o.deductCategory).text(o.deductCategory + "-" + o.deductCategoryDescription));
                            })
                            necessaryColumn("TaxCategory")
                            $("#TaxCategory").selectpicker('refresh');
                        }

                        //憑證號碼連動修改
                        $("#CertificateNum").on("change", function () {
                            $("#BusinessTaxTable").find("div[name=CertificateNum]").text(this.value)
                            $("#BusinessTaxTable").find("input[name=CertificateNum]").val(this.value)
                        })

                        //憑證日期連動修改
                        $("#EstimateVoucherDate").on("blur", function () {
                            $("#BusinessTaxTable").find("div[name=CertificateDate]").text(this.value)
                            $("#BusinessTaxTable").find("input[name=CertificateDate]").val(this.value)
                        })

                        //格式別更改動作
                        /* $("#FormatKind").on("change", function () {
                             if (this.value == 22) {
                                 let Taxable = parseFloat(accounting.toFixed((EPO.TWDAmount) * accounting.toFixed(1 - 0.05 / 1.05, 8)))
                                 $("#Taxable").val(fun_accountingformatNumberdelzero(Taxable))
                                 $("#TaxAmount").val(fun_accountingformatNumberdelzero(EPO.TWDAmount - Taxable))
                             }
                         })*/

                        $.each(VatInFormat, function (i, o) {
                            $("#FormatKind").append($("<option></option>").attr("value", o.vatFormatTypeCode).text(o.vatFormatTypeCode + "-" + o.vatFormatTypeDesc).data("text", o.vatFormatTypeDesc));
                        })
                        $("#FormatKind").selectpicker('refresh');

                        putBusinessTaxInformation(EPO.BusinessTax)
                    }
                }

                $("[name=UploadBtn]").closest("div").remove()
            }
            break;
        default:
            break;
    }
}

//控件不可編輯
function fun_ControlDisable(target, _context) {
    parentObj = $(target).parent()
    intable = ($(target).parents("table").length > 0);
    context = (_context == null) ? "" : _context
    if ($(target).length == 0) {
        return false
    }
    switch ($(target)[0].tagName) {
        case "SELECT":
            parentObj = $(target).closest('.content-box');
            $(target).selectpicker("hide")
            if (intable) {
                $(parentObj).append(context)
            }
            else {
                $(parentObj).append("<div class=\"disable-text\">" + context + "</div>")
            }

            break;

        case "TEXTAREA":
            $(target).hide();
            if (intable) {
                $(parentObj).append(context.replace(/\n/g, "<br/>"))
            }
            else {
                $(parentObj).append("<div class=\"disable-text\">" + context.replace(/\n/g, "<br/>") + "</div>")
            }

            break;
        case "INPUT":
            switch ($(target).attr("type")) {
                case "checkbox":
                case "radio":
                    $(target).toggleClass("input-disable", true).prop("readonly", true).prop("disabled", true)
                    break;

                default:
                    $(target).hide();
                    if (intable) {
                        $(parentObj).append(context)
                    }
                    else {
                        $(parentObj).append("<div class=\"disable-text\">" + context + "</div>")
                    }
                    break;
            }

            break;
        case "TABLE":
            $(target).hide()
            break;
        case "DIV":
            $(target).hide()
            break;
        default:
            $(target).toggleClass("input-disable", true).prop("readonly", true).prop("disabled", true)
            break;
    }

    removeNecessaryColumn_target(target)
}

//計算可扣抵否
function isDeductible() {
    let rtn = false

    if (EPO.BusinessTax.IsDeduction != null) {
        if (EPO.BusinessTax.IsDeduction == "Y") {
            rtn = true;
        }
    }
    else {
        if ($('#gvDeclaration').val() == "403" && $('#CertificateKind').val() == "I"
            && $.grep($("[name=AccountBank]"), function (o) {
                return $(o).find('option:selected').attr("gvdeclaration") != "403"
        }).length == 0) {
            rtn = true
        }
    }

    if (rtn) {
        $("#systemJudgeDeductible").html("可扣抵")
    }
    else {
        $("#systemJudgeDeductible").html("不可扣抵")
    }

    return rtn
}

function OverrideOrgPickerSetting(step) {
    /// <summary>提供cbp-SendSetting.js針對「傳送其他主管同仁」按鈕做最後OrgPicker更改機會</summary>
    /// <param name="step" type="number">目前關卡數</param>
    //  第一關傳其他只能傳送採購經辦群組， 第二關傳其他只能傳送採購覆核群組:

    switch (step) {
        case 3:
            return {
                allowRole: ["JA08000638"]//經辦
            };
            break;
        case 4:

            return {
                allowRole: ["JA08000636"]//覆核
            };
            break;
    }
}