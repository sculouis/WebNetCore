//資料變數採用大駝峰，一般變數採用小駝峰
//錯誤訊息定義
var errObj = {
    ExpenseKind: "請款類別未選",
    VendorNameAndNum: "供應商未選",
    VendorNum: "供應商未選",
    Currency: "幣別未選",
    Rate: "匯率未輸入",
    CertificateKind: "請修正：請檢核憑證類別是否輸入錯誤，此為代扣所得稅供應商",
    CertificateKind1: "請款類別＝［退貨折讓］，則僅能選取折讓",
    CertificateKind2: "請款類別＝［不是退貨折讓］，不能選取折讓",
    EPODetailCreate: "請款明細未選",
    OriginalAmountInput: "折讓時憑證總額(原幣)必須輸入負值",
    OriginalTaxInput: "折讓時憑證稅額(原幣)必須輸入負值",
    AcceptanceAmount: "驗收金額小於憑證金額，請再確認",
    CertificateKindCheck: "非發票類之請款項目，稅額應為0",
    CrossYear: "已跨年請輸入跨年度傳票編號",
    DiscountAmountCheck: "折讓金額必須輸入負值",
    NotDiscountAmountCheck: "憑證金額必須輸入正值",
    AcceptanceOriginalAmountCheck: "折讓金額小於驗退金額，請再確認"
}

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

//確認選擇供應商，更新供應商名稱 & 重設側邊選單
function vendorSelected(vendor) {
    if (vendor) {
        suppliesUIChange(vendor.supplierName, vendor.supplierNumber);
    }
}

//移除or重選供應商
function resetSuppliesInfo() {
    //供應商
    $('#VendorName').text('請選擇供應商');
}

//供應商變更的UI操作
function suppliesUIChange(name, number) {
    //隱藏欄位需呼叫.triggerHandler('change')，才會觸發事件
    $('#VendorName').val(name).triggerHandler('change');
    $('#VendorNum').val(number).triggerHandler('change');
    $('#VendorNameAndNum').text(name + '(' + number + ')').triggerHandler('change');
    suppliesWriteToHiddenControl();  //供應商隱藏欄位的處理
}

//供應商隱藏欄位處理
function suppliesWriteToHiddenControl() {
    if (_vendor.length > 0) {
        $('#BankName').find("span").html(_vendor[0].supplierBank[0].bankName)
        $('#PaymentInfo_BankName').val(_vendor[0].supplierBank[0].bankNumber)
        $('#PaymentInfo_BranchName').val(_vendor[0].supplierBank[0].bankBranchName)
        $('#PaymentInfo_Branch').val(_vendor[0].supplierBank[0].branchNumber)
        $('#PaymentInfo_AccountName').val(_vendor[0].supplierBank[0].bankAccountName)
        $('#PaymentInfo_AccountNum').val(_vendor[0].supplierBank[0].bankAccountNumber)
        $('#PaymentInfo_AccountDesc').val(_vendor[0].supplierBank[0].bankAccountNumRemark)
        $('#PaymentInfo_AccountDesc').val(_vendor[0].supplierBank[0].bankAccountNumRemark)

        $("input[id$='PaymentInfo_BankName']").val(_vendor[0].supplierBank[0].bankName)
        $("input[id$='PaymentInfo_BranchName']").val(_vendor[0].supplierBank[0].bankBranchName)
        $("input[id$='PaymentInfo_Branch']").val(_vendor[0].supplierBank[0].branchNumber)
        $("input[id$='PaymentInfo_AccountName']").val(_vendor[0].supplierBank[0].bankAccountName)
        $("input[id$='PaymentInfo_AccountNum']").val(_vendor[0].supplierBank[0].bankAccountNumber)
        $("input[id$='PaymentInfo_AccountDesc']").val(_vendor[0].supplierBank[0].bankAccountNumRemark)
        $("input[id$='PaymentInfo_AccountDesc']").val(_vendor[0].supplierBank[0].bankAccountNumRemark)
    }

}

//移除特殊合約 or 供應商
$(document).on('click', '.glyphicon-remove', function () {
    var divID = $(this.closest('div .area-fix02-2')).attr('id');
    switch (divID) {
        case 'suppliesNameLinks':
            resetSuppliesInfo();
            break;
    }
});

//開啟供應商
$(document).on('click', '#VendorOpen', function () {
    openVendor(true, null);
});

//綁定代碼類資料By Object
function BindData(id, Detail) {
    id = "#" + id
    $(id).empty().selectpicker("refresh")
    $(id).append("<option>請選擇</option>");
    Object.keys(Detail).forEach(function (item) {
        if (id === "#ExpenseAttribute") {
            $(id).append('<option value=' + item + '>' + item + ":" + Detail[item] + '</option>');
        } else {
            $(id).append('<option value=' + item + '>' + Detail[item] + '</option>');
        }
    })
    $(id).selectpicker("refresh");
}


//設定必填星號
var requiredStart = function (id) {
    var startHtml = '<b class="required-icon">*</b></div>'
    id = "#" + id
    $(id).prev().append(requiredStart)
}

//設定錯誤訊息
var errMsg = function (id, msg) {
    var errmsg = _.template('<div class="error-text"><span class="icon-error icon-error-size"></span><%= errMsg %></div>')
    $("#" + id).after(errmsg({ errMsg: msg }))
}

//設定檢核控項錯誤訊息
var errMsg1 = function (id, msg) {
    var errmsg = '<div class="error-text"><span class="icon-error icon-error-size"></span>'
    var errmsg = errmsg + msg + '</div>'
    $("#" + id).next().next().after(errmsg)
}

//檢查請款明細查詢條件是否皆有輸入
function verifyFieldsInput(fields,selector) {
    var result = true;
    var showErr = function (id) {
        //供應商控件特別處理
        if (id === "VendorNum") {
            id = "VendorNameAndNum"
        }
        //判斷沒有錯誤訊息再新增
        if ($("#" + id).next('.error-text').length < 1) {
            errMsg(id, errObj[id])
        }
    }

    _.each(fields, function (id) {
        var ctrlValue = $(selector).find("#" + id).val()
        console.log(ctrlValue)
        if (_.isNull(ctrlValue) === true) {
            showErr(id)
            result = false
        } else if (ctrlValue === "999") {
            //控件值請選擇
            showErr(id)
            result = false
        } else if (_.isString(ctrlValue) === true && _.isEmpty(ctrlValue) === true) {
            //控件值是字串的處理
            showErr(id)
            result = false
        } else if (_.isNumber(ctrlValue) === true) {
            if (ctrlValue === 0) {
                //控件值是數值的處理
                showErr(id)
                result = false
            }
        }
    })
    return result;
}

//ajax Post get partial View
var ajaxPartialView = function (url,data,fuc) {
    $.ajax({
        url: url,
        async: true,
        type: 'POST',
        data: data,
        contentType: 'application/html',
        success: function (content) {
            fuc(content)
        },
        error: function (data) {
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        }
    })
}


