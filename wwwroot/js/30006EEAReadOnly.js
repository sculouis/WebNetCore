var Global = {
    EEAModel: getModel()
}

{
    //驗證
    function Verify() {
        return $.Deferred().resolve()
    }

    //傳送
    function Save() {
        let draftAjax = $.Deferred()
        _formInfo.formGuid = Global.EEAModel.FormID
        _formInfo.formNum = Global.EEAModel.EEANum
        _formInfo.flag = true

        $("#FormTypeName").val("特殊用途專戶(" + $("#ExpenseKindName").text() + ")")
        $("#ApplyItem").val($("#ExpenseKindName").text())

        draftAjax.resolve();
        return draftAjax.promise()
    }

    function completedToFiis() {
        let draftAjax = $.Deferred()

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/EEA/sendToFiis/" + Global.EEAModel.EEANum,
            data: { FillInName: $("#FillInName").val(), FillInEmpNum: $("#FillInEmpNum").val() },
            success: function (data) {
                if (data.returnStatus != "S") {
                    _formInfo.flag = false

                    draftAjax.reject("傳送結案資料發生錯誤");
                    alert("傳送結案資料發生錯誤");
                }
                else {
                    draftAjax.resolve();
                }

                console.log(data)
            },
            error: function () {
                draftAjax.reject("傳送結案資料發生錯誤");
                alert("傳送結案資料發生錯誤");
            }
        }
        )

        return draftAjax.promise()
    }
}

$(function () {
    $.each($("[Amount]"), function () {
        if ($(this).text().length > 0) {
            $(this).text(fun_accountingformatNumberdelzero($(this).text()))
        }
    })

    P_CustomFlowKey = $('#P_CustomFlowKey').val();
    P_CurrentStep = $("#P_CurrentStep").val();

    $("td").each(function () { if ($(this).text() == "null") { $(this).text("") } })

    $("#popDetail").find("#Btn_Edit").hide()
    $("#popDetail").find("#Btn_readonly").show()

    stageControl($('#P_CustomFlowKey').val(), $("#P_CurrentStep").val())
})

//請款明細視窗開啟與資料載入
function popDetailLoading(lineNum) {
    let detail = $.grep(Global.EEAModel.EEADetail, function (o) {
        return o.LineNum == lineNum
    })[0]

    let pop = $("#popDetail")
    $(pop).find("[alt=disableText]").remove()
    $(pop).find(".required-icon").remove()
    $(pop).find(".added-info").remove()
    $(pop).find(".list-close-icon").addClass("list-open-icon").removeClass("list-close-icon")
    $("#disableOriginalTax").hide()
    $("#divInvoiceOverDue").hide()
    $("#divYearVoucher").hide()
    $("#addsubInvoiceInfo").hide()

    //明細層處理
    {
        fun_ControlDisable($(pop).find("#PaymentCategory"), detail.PaymentCategoryName)
        fun_ControlDisable($(pop).find("#PaymentMidCategory"), detail.PaymentMidCategoryName)
        fun_ControlDisable($(pop).find("#ExpenseAttribute"), detail.ExpenseAttributeName)
        fun_ControlDisable($(pop).find("#NeedCertificate"), detail.NeedCertificate)
        fun_ControlDisable($(pop).find("#ExpenseDesc"), detail.ExpenseDesc)
        fun_ControlDisable($(pop).find("#ProjectCategory"), detail.ProjectCategoryName)
        fun_ControlDisable($(pop).find("#Project"), detail.ProjectName)
        fun_ControlDisable($(pop).find("#ProjectItem"), detail.ProjectItemName)

        fun_ControlDisable($(pop).find("#CertificateKind"), $(pop).find("#CertificateKind").find("option[value='" + detail.CertificateKind + "']").text())
        fun_ControlDisable($(pop).find("#TaxIdNum"), detail.TaxIdNum)
        fun_ControlDisable($(pop).find("#VendorName"), detail.VendorName)
        fun_ControlDisable($(pop).find("#CertificateNum"), detail.CertificateNum)
        fun_ControlDisable($(pop).find("#EstimateVoucherDatePicker"), detail.strEstimateVoucherDate)
        fun_ControlDisable($(pop).find("[name=IsDeduction]"), detail.IsDeduction)
        $(pop).find("[name=CurrencyName]").text(Global.EEAModel.Currency + " " + Global.EEAModel.CurrencyName)
        $(pop).find("[name=Rate]").text(Global.EEAModel.Rate)
        $(pop).find("[name=CurrencyPrecise]").text(Global.EEAModel.CurrencyPrecise)
        fun_ControlDisable($(pop).find("#OriginalAmount"), fun_accountingformatNumberdelzero(detail.OriginalAmount))
        fun_ControlDisable($(pop).find("#OriginalTax"), fun_accountingformatNumberdelzero(detail.OriginalTax))
        /*fun_ControlDisable($(pop).find("#AcceptanceAmount"), detail.AcceptanceAmount)
        fun_ControlDisable($(pop).find("#TWDAmount"), detail.TWDAmount)
        fun_ControlDisable($(pop).find("#TWDTaxAmount"), detail.TWDTaxAmount)
        fun_ControlDisable($(pop).find("#TWDSaleAmount"), detail.TWDSaleAmount)*/
        $(pop).find("span[name=AcceptanceAmount]").text(fun_accountingformatNumberdelzero(detail.AcceptanceAmount))
        $(pop).find("span[name=TWDAmount]").text(fun_accountingformatNumberdelzero(detail.TWDAmount))
        $(pop).find("span[name=TWDTaxAmount]").text(fun_accountingformatNumberdelzero(detail.TWDTaxAmount))
        $(pop).find("span[name=TWDSaleAmount]").text(fun_accountingformatNumberdelzero(detail.TWDSaleAmount))

        fun_ControlDisable($(pop).find("#VoucherMemo"), detail.VoucherMemo)
        fun_ControlDisable($(pop).find("#YearVoucher"), detail.YearVoucher)
        fun_ControlDisable($(pop).find("#InvoiceOverDue"), detail.InvoiceOverDue)

        if (!isNullOrEmpty(detail.YearVoucher)) {
            $(pop).find("#YearVoucher").show()
        }
        if (!isNullOrEmpty(detail.InvoiceOverDue)) {
            $(pop).find("#InvoiceOverDue").show()
        }

        //分攤明細層處理
        {
            $(pop).find("#tab_InvoiceDetail tbody").remove()

            $.each(detail.AmortizationDetailList, function (index, AmortizationDetail) {
                pop_AddAmortizationDetail(AmortizationDetail)
            })
        }
    }

    $('.popup-left-addcase').show(0);
    $('.popup-overlay').fadeIn(0);
    $('.popup-box').animate({ right: "0px" }, 300);
    $("html, body").css("overflow", "hidden");
}

//新增分攤明細
function pop_AddAmortizationDetail(AmortizationDetail) {
    let pop = $("#popDetail")

    let tbody = $("#tab_copyInvoiceDetail").find("tbody").eq(0).clone()
    $(tbody).find('.selectpicker').data('selectpicker', null);
    $(tbody).find('.bootstrap-select').find("button:first").remove();
    $(tbody).find(".selectpicker").selectpicker("render")
    $(pop).find("#tab_InvoiceDetail").append(tbody)

    fun_ControlDisable($(tbody).find("[name=AccountBank]"), AmortizationDetail.AccountBank + "-" + AmortizationDetail.AccountBankName)
    fun_ControlDisable($(tbody).find("[name=CostProfitCenter]"), AmortizationDetail.CostProfitCenter + "-" + AmortizationDetail.CostProfitCenterName)
    fun_ControlDisable($(tbody).find("[name=divAmortizationDetailAccountingItem]"), AmortizationDetail.AccountingItem + "-" + AmortizationDetail.AccountingItemName)
    fun_ControlDisable($(tbody).find("[name=OriginalAmortizationAmount]"), fun_accountingformatNumberdelzero(AmortizationDetail.OriginalAmortizationAmount))

    $(tbody).find("[name=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(AmortizationDetail.OriginalAmortizationTWDAmount))

    if (isNullOrEmpty(AmortizationDetail.ProductKind)) {
        fun_ControlDisable($(tbody).find("[name=ProductKind]"), "")
    }
    else {
        fun_ControlDisable($(tbody).find("[name=ProductKind]"), AmortizationDetail.ProductKind + "-" + AmortizationDetail.ProductKindName)
    }

    if (isNullOrEmpty(AmortizationDetail.ProductDetail)) {
        fun_ControlDisable($(tbody).find("[name=divAmortizationDetailProductDetail]"), "")
    }
    else {
        fun_ControlDisable($(tbody).find("[name=divAmortizationDetailProductDetail]"), AmortizationDetail.ProductDetail + "-" + AmortizationDetail.ProductDetailName)
    }

    if (isNullOrEmpty(AmortizationDetail.ExpenseAttribute)) {
        fun_ControlDisable($(tbody).find("[name=ExpenseAttribute]"), "")
    }
    else {
        fun_ControlDisable($(tbody).find("[name=ExpenseAttribute]"), AmortizationDetail.ExpenseAttribute + "-" + AmortizationDetail.ExpenseAttributeName)
    }

    $(tbody).find("[arrowicon]").on("click", function () {
        fun_CloumnControl(this)
    })
}

//控建顯示隱藏的動畫速度
function fun_controlShow(target) {
    $(target).toggle(200);
}
function fun_AllCloumnControl(target) {
    if ($(target).children("div").hasClass("list-open-icon")) {
        $(target).closest("thead").nextAll("tbody").not("[alt=no-data]").children("tr").not("[Rowtitle]").each(function () {
            $(this).show(200);
        })

        $(target).closest("table").find("a[arrowicon] div").addClass("glyphicon-chevron-up")
        $(target).closest("table").find("a[arrowicon] div").removeClass("glyphicon-chevron-down")

        $(target).children("div").addClass("list-close-icon").attr("title", "全部收合")
        $(target).children("div").removeClass("list-open-icon")
    }
    else {
        $(target).closest("thead").nextAll("tbody").not("[alt=no-data]").children("tr").not("[Rowtitle]").each(function () {
            $(this).hide(200);
        })
        $(target).closest("table").find("a[arrowicon] div").removeClass("glyphicon-chevron-up")
        $(target).closest("table").find("a[arrowicon] div").addClass("glyphicon-chevron-down")

        $(target).children("div").removeClass("list-close-icon")
        $(target).children("div").addClass("list-open-icon").attr("title", "全部展開")
    }
}
function fun_CloumnControl(target) {
    $(target).closest("tbody").find("tr").not("[Rowtitle]").each(function () {
        fun_controlShow($(this))
    })

    $(target).find("div").toggleClass("glyphicon-chevron-down")
    $(target).find("div").toggleClass("glyphicon-chevron-up")
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

//控件不可編輯
function fun_ControlDisable(target, _context) {
    ///<summary>控件不可編輯</summary>
    ///<param name="_context">取代的顯示文字</param>

    parentObj = $(target).parent()
    intable = ($(target).parents("table").length > 0);
    // context = (_context == null) ? "" : _context
    $(target).removeAttr("necessary")

    //
    if (_context == null) _context = "";

    if ($(target).length == 0) {
        return false
    }
    switch ($(target)[0].tagName) {
        case "SELECT":

            if ($(target).closest('.bootstrap-select').parent().length > 0) {
                parentObj = $(target).closest('.bootstrap-select').parent();
            }

            $(target).selectpicker("hide")

            break;

        case "TEXTAREA":
            $(target).hide();

            break;
        case "INPUT":
            switch ($(target).attr("type")) {
                case "checkbox":
                case "radio":
                    $(target).toggleClass("input-disable", true).prop("readonly", true).prop("disabled", true)
                    break;

                default:
                    $(target).hide();

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
    if (_context != null) {
        if (intable) {
            $(parentObj).append("<div alt='disableText'>" + _context + "</div>")
        }
        else {
            $(parentObj).append("<div alt='disableText' class=\"disable-text\">" + _context + "</div>")
        }
    }
}

//關卡卡控
function stageControl(key, step) {
    if (key == 'EEA_P1_01' || key == 'EEA_P1_Credit') {
        switch (step) {
            case "1":
            case "2":
            case "3":
            case "4":
                $(".EmergencyLabel").hide();
                break;
            case "5":
            case "6":
            case "7":
                $(".EmergencyLabel").show();
                $("#BusinessTaxTableResult").show();
                $("#BusinessTaxTable").find("input").each(function (i, o) {
                    fun_ControlDisable(o, $(o).val())
                })

                //等待selectpick宣染，不然值會抓錯
                setTimeout(function () {
                    $("#BusinessTaxTable").find("select,input").each(function (i, o) {
                        if (!isNullOrEmpty($(o).val())) {
                            fun_ControlDisable(o, $(o).find("option:selected").text())
                        }
                        else {
                            fun_ControlDisable(o, "")
                        }
                    })
                }, 500)

                break;
        }
    }
    else {
        switch (step) {
            case "1":
            case "2":
                $(".EmergencyLabel").hide();
                break;
            case "3":
            case "4":
            case "5":
                $(".EmergencyLabel").show();
                $("#BusinessTaxTableResult").show();
                $("#BusinessTaxTable").find("input").each(function (i, o) {
                    fun_ControlDisable(o, $(o).val())
                })

                //等待selectpick宣染，不然值會抓錯
                setTimeout(function () {
                    $("#BusinessTaxTable").find("select,input").each(function (i, o) {
                        if (!isNullOrEmpty($(o).val())) {
                            fun_ControlDisable(o, $(o).find("option:selected").text())
                        }
                        else {
                            fun_ControlDisable(o, "")
                        }
                    })
                }, 500)

                break;
        }
    }
}

function GetPageCustomizedList(stepSequence) {
    let _SignedID = []
    let _SignedName = []

    if ($('#P_CustomFlowKey').val() == 'EEA_P1_01' || $('#P_CustomFlowKey').val() == 'EEA_P1_Credit') {
        switch (stepSequence) {
            case 3:
                $.ajax({
                    cache: false,
                    url: '/EEA/GetEEAAccountList/' + Global.EEAModel.VendorNum,
                    dataType: 'json',
                    type: 'POST',
                    async: false,
                    success: function (data) {
                        $.each(data, function (key, txt) {
                            _SignedID.push(key)
                            _SignedName.push(txt)
                        })
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("取得管理人清單失敗!!")
                    }
                });
                break;
            case 4:
                $.ajax({
                    cache: false,
                    url: '/EEA/GetEEAReviewList/' + Global.EEAModel.VendorNum,
                    dataType: 'json',
                    type: 'POST',
                    async: false,
                    success: function (data) {
                        $.each(data, function (key, txt) {
                            _SignedID.push(key)
                            _SignedName.push(txt)
                        })
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("取得覆核人員清單失敗!!")
                    }
                });
                break;
        }
    }

    return { SignedID: _SignedID, SignedName: _SignedName }
}