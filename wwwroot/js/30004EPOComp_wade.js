//資料變數採用大駝峰，一般變數採用小駝峰
//錯誤訊息定義
var errObj = {
    ExpenseKind: "請款類別未選",
    VendorNameAndNum: "供應商未選",
    VendorNum: "供應商未選",
    search_Currency: "幣別未選",
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
    AcceptanceOriginalAmountCheck: "折讓金額小於驗退金額，請再確認",
    CurrencyPrecise: "輸入值不符合幣別精確度",
    Rate: "匯率不得小於零或等於零",
    MARGINAMT: "付款預扣不得小於零",
    Amount: "數字輸入錯誤",
    AmountNoZero: "數字不可為零",
    CertificateAmount: "憑證總額(原幣)不可大於驗收總額(原幣)",
    OriginalAmount: "憑證稅額(原幣)不可大於憑證總額(原幣)",
    WriteOffAmountOver: "沖銷金額總和不可大於憑證總額(原幣)，請修正",
    CertificateNum: "發票號碼為兩碼英文+八碼英數字(皆為半型)",
    CertificateNum2: "憑證號碼限填入英數字",
    PayReMark: "不可輸入中文。僅接受英文字母、數字、空白、(、)、,、.、-、:、+、’。(第一字元不可為:)",
    EstimateVoucherDate: "折讓已逾申報期，請確認日期或重新開立折讓單",
    DiscountInvoiceDate: "原發票日期不得大於憑證日期",
    EstimateVoucherDate_Err: "憑證日期不得小於原發票日期",
    ForeignLabor: "請注意若幣別為台幣或憑證類別為發票，此選項不得勾選。",
    Deduction: "憑證類別為【發票】不得修改所扣",
    CertificateAmountErr: "給付淨額加扣繳稅額不等於金額總計",
    BusinessTaxErr: "營業稅額加總與稅額總計(臺幣)不相符",
    BusinessTaxSaleAmountErr: "營業稅銷售額加總與銷售額總計(臺幣)不相符",
    Deduction2: "請修正：請檢核憑證類別是否輸入錯誤，此為代扣所得稅供應商"
}

var alertMesage = {
    EstimateVoucherDateOverYear: "憑證日期已跨年，請輸入【跨年度傳票編號】",
    EstimateVoucherDateOverMonth: "發票已逾申報期，請輸入發票逾期說明欄位，並傳送至單位最高主管簽核與確認。",
    NeedBargainingCode: "外幣付款請於取得議價編碼當日內，傳送請款單及提交匯出匯款申請書至會計經辦。",
    Health2: "扣費義務人給付全民健康保險法第三十一條第一項各類所得時，其單次給付金額達新臺幣二萬元者，應按規定之補充保險費率扣取補充保險費。 但若符合免扣取補充保險費身分者，【是否扣二代健保】欄位選取「N」，並檢附相關證明文件。"
}

function alertopen(text) {
    if (typeof (text) != typeof ([])) {
        $('#alertText').text(text);
        $('[data-remodal-id=alert-modal]').remodal().open();
    }
    else {
        if (text.length < 1) {
            return;
        }
        txt = "";
        for (i = 0; i < text.length; i++) {
            txt = txt.concat(text[i] + "<br\>");
        }

        $('#alertText').html(txt);
        $('[data-remodal-id=alert-modal]').remodal().open();
    }
}

//確認選擇供應商，更新供應商名稱 & 重設側邊選單
function vendorSelected(vendor) {
    if (vendor) {
        suppliesUIChange(vendor);
    }
}

//移除or重選供應商
function resetSuppliesInfo() {
    //供應商
    $('#VendorNameAndNum').text('請選擇供應商');
}

//供應商變更的UI操作
function suppliesUIChange(vendor) {
    //隱藏欄位需呼叫.triggerHandler('change')，才會觸發事件
    $('#VendorNameAndNum').text(vendor.supplierName + '(' + vendor.supplierNumber + ')').triggerHandler('change');
    $("#VendorInfo").val(vendor.supplierNumber).data("data", vendor)
    //suppliesWriteToHiddenControl();  //供應商隱藏欄位的處理
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

var necessaryColumn = function (id) {
    if (!$("#" + id)[0].hasAttribute("necessary")) {
        $("#" + id).attr("necessary", true)
        requiredStart(id)
    }
}

//設定必填星號
var requiredStart = function (id) {
    var startHtml = '<b class="required-icon">*</b></div>'
    id = "#" + id
    // $(id).prev().append(requiredStart)
    $(id).closest(".content-box").find(".title").append('<b class="required-icon">*</b></div>')
}

var removeNecessaryColumn = function (id) {
    $("#" + id).removeAttr("necessary", true)
    removeRequiredStart(id)
}

var removeRequiredStart = function (id) {
    var startHtml = '<b class="required-icon">*</b></div>'
    id = "#" + id
    // $(id).prev().append(requiredStart)
    $(id).closest(".content-box").find("b.required-icon").remove()
}

var necessaryColumn_target = function (target) {
    if (!$(target)[0].hasAttribute("necessary")) {
        $(target).attr("necessary", true)
        requiredStart_target(target)
    }
}

var requiredStart_target = function (target) {
    let startHtml = '<b class="required-icon">*</b></div>'
    $(target).closest(".content-box").find(".title").append(startHtml)
}

var removeNecessaryColumn_target = function (target) {
    $(target).removeAttr("necessary", true)
    removeRequiredStart_target(target)
}
var removeRequiredStart_target = function (target) {
    $(target).closest(".content-box").find("b.required-icon").remove()
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
function verifyFieldsInput(fields, selector) {
    var result = true;
    var showErr = function (id) {
        //供應商控件特別處理
        if (id === "VendorInfo") {
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
var ajaxPartialView = function (url, Postdata, fuc) {
    return $.ajax({
        url: url,
        async: true,
        type: 'POST',
        data: Postdata,
        //  contentType: 'application/html',
        success: function (content) {
            fuc(content)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error: " + textStatus);
        }
    })
}

//新增錯誤訊息
function fun_AddErrMesg(target, NewElementID, ErrMesg) {
    if (NewElementID == "") {
        $(target).nextAll("[Errmsg=Y]").remove()
        $(target).after('<div Errmsg="Y"  style="text-align:left"  class="error-text"><span class="icon-error icon-error-size"></span>' + ErrMesg + '</div>')
    }
    else {
        if ($(target).nextAll("[alt=" + NewElementID + "]").length > 0) {
            $(target).nextAll("[alt=" + NewElementID + "]").html("<span class=\"icon-error icon-error-size\"></span>" + ErrMesg);
        }
        else {
            $(target).after('<div Errmsg="Y"  style="text-align:left" alt="' + NewElementID + '" class="error-text"><span class="icon-error icon-error-size"></span>' + ErrMesg + '</div>')
        }
    }
}

//去除 accounting.format 的尾數0
function fun_accountingformatNumberdelzero(val) {
    val = accounting.formatNumber(val, 6)

    reg = /\.[0-9]*0$/

    while (reg.test(val)) {
        val = val.replace(/0$/, '');
    }
    val = val.replace(/\.$/, '');
    return val;
}

//字串補0
function funAddheadZero(len, val) {
    val = String(val);
    while (val.length < len) {
        val = "0" + val;
    }

    return val;
}

//統一編號驗證
function TaxIDCheck(TaxID) {
    //八碼數字
    //各數字依序承上1、2、1、2、1、2、4、1
    //將十位數與個位數個別加總
    //總數可被10整除表示正確
    //總數除10後餘9且第七碼為7時亦正確

    let rtn = true;

    reg = /^([0-9]{8})$/
    TaxID = String(TaxID)
    if (!TaxID.search(reg) == 0) {
        rtn = false;
    }
    else {
        sum = 0;
        CheckArray = [1, 2, 1, 2, 1, 2, 4, 1]
        NumArray = TaxID.split("")

        for (i = 0; i < 8; i++) {
            tmp = NumArray[i] * CheckArray[i]
            console.log(NumArray[i] + " * " + CheckArray[i] + " = " + tmp)
            if (tmp >= 10) {
                sum += Math.floor(tmp / 10)
                sum += (tmp % 10)
            }
            else {
                sum += tmp
            }
        }
        console.log(sum)
        if (sum % 10 == 0 || (sum % 10 == 9 && NumArray[6] == 7)) rtn = true
        else rtn = false
    }

    return rtn;
}

//==========================================
// 分頁功能
//_datacount:資料筆數 _page:現在頁面 _onePageRow:單頁顯示筆數 _maxPagecount:最大顯示頁碼數(建議為奇數) ,clickAction 換頁觸發的fun *入參 跳轉頁數,單頁顯示筆數
//==========================================
function writeTablePage(_datacount, clickAction, _page, _onePageRow, _maxPagecount) {
    /// <summary>
    /// 分頁功能FIIS
    /// </summary>
    /// <param name="_datacount">資料筆數</param>
    /// <param name="clickAction">換頁觸發的fun *入參 跳轉頁數,單頁顯示筆數</param>
    /// <param name="_page">現在頁面</param>
    /// <param name="_onePageRow">單頁顯示筆數</param>
    /// <param name="_maxPagecount">最大顯示頁碼數(建議為奇數)</param>

    let datacount = (!isNaN(parseInt(_datacount)) && parseInt(_datacount) > 0) ? parseInt(_datacount) : 0;
    let page = (!isNaN(parseInt(_page)) && parseInt(_page) > 0) ? parseInt(_page) : 1;
    let onePageRow = (!isNaN(parseInt(_onePageRow)) && parseInt(_onePageRow) > 0) ? parseInt(_onePageRow) : 20;
    let maxPagecount = (!isNaN(parseInt(_maxPagecount)) && parseInt(_maxPagecount) > 0) ? parseInt(_maxPagecount) : 9;
    let maxPage = 0
    let pageObj = document.createElement("div")
    let startPage = 0;

    function changepage(e) {
        if (typeof (clickAction) === "function") {
            clickAction(parseInt($(e.target).attr("page")), onePageRow)
        }
        $(e.target).closest(".col-sm-12").replaceWith(writeTablePage(datacount, clickAction, parseInt($(e.target).attr("page")), onePageRow, maxPagecount))
    }

    maxPage = parseInt(datacount / onePageRow)
    if (datacount % onePageRow > 0) { maxPage += 1; }
    if (datacount > 0 && maxPage > 1) {
        $(pageObj).attr("id", "__pageDiv")

        $(pageObj).addClass("col-sm-12").append($("<div class='main-table-pager text-center'></div>"))

        let ul = document.createElement("ul")
        $(ul).addClass("pagination")

        if (page > maxPage) { page = maxPage; }

        if (page >= ((maxPagecount + 1) / 2)) {
            $(ul).append($("<li></li>").append($("<a>«</a>").attr("page", 1).on("click", changepage)))//回到第一頁
        }
        if (page - maxPagecount > 0) {
            $(ul).append($("<li></li>").append($("<a>‹</a>").attr("page", page - maxPagecount).on("click", changepage)))//往前翻一頁
        }
        startPage = (page - (parseInt((maxPagecount + 1) / 2) - 1))
        startPage = (maxPage - startPage < maxPagecount) ? (maxPage - maxPagecount) + 1 : startPage
        startPage = (startPage > 0) ? startPage : 1;

        let i = 0;
        for (i = startPage; i < (startPage + maxPagecount) ; i++) {
            if (i > maxPage) break;

            if (i == page) {
                $(ul).append($("<li class='active'></li>").append($("<a>" + i + "</a>").attr("page", i).on("click", changepage)))
            }
            else {
                $(ul).append($("<li ></li>").append($("<a>" + i + "</a>").attr("page", i).on("click", changepage)))
            }
        }

        if (page + maxPagecount < maxPage) {
            $(ul).append($("<li></li>").append($("<a>›</a>").attr("page", page + maxPagecount).on("click", changepage)))//往後翻一頁
        }
        if (i < maxPage) {
            $(ul).append($("<li></li>").append($("<a>»</a>").attr("page", maxPage).on("click", changepage)))//到尾頁
        }
        $(pageObj).find("div").append(ul)
    }
    return pageObj
}