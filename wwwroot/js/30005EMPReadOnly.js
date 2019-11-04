//為了讓加會可以傳送
{
    //驗證
    function Verify() {
      
        return $.Deferred().resolve()
    }

    //傳送
    function Save() {
        let draftAjax = $.Deferred()
        _formInfo.formGuid = $("#FormID").val()
        _formInfo.formNum = $("#EMPNum").val()
        _formInfo.flag = true

        $("#FormTypeName").val("員工報支(" + $("#ExpenseKindName").text() + ")")
        $("#ApplyItem").val($("#ExpenseKindName").text())

        draftAjax.resolve();
        return draftAjax.promise()
    }

    function completedToFiis() {
        let draftAjax = $.Deferred()

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/EMP/sendToFiis/" + $("#EMPNum").val(),
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
        ).always(function () {
            $("input[Amount]").each(function () {
                $(this).val(fun_accountingformatNumberdelzero($(this).val()))
            })
        })

        return draftAjax.promise()
    }

}

$(function () {
    $.each($("[Amount]"), function () {
        if ($(this).text().length > 0) {
            $(this).text(fun_accountingformatNumberdelzero($(this).text()))
        }
    })

    $("#tab_Invoice")._ajax("/EMP/GetEMPDetail", { FormID: $("#FormID").val() }, function (data) {
        var rtn = {
            true: ""
        }
        if (data.IsSuccess) {
            if (data.Detail) {
                $.each(data.Detail, function (Index, Info) {
                    InvoiceObj = null
                    fun_InvoiceDataPutIn(Info)
                })
            }
        }
        else {
            rtn = {
                false: data.Message
            }
        }
        return rtn
    }, "表單明細載入失敗");

    switch ($("#P_CurrentStep").val()) {
        case "4":
        case "5":
        case "6":
            $("#div_BusinessTax").show();
            $("#div_VoucherMemo").show();

            if ($("#ExpenseKind").val() == "EMP_TRAVEL_EXP") {//出差
                $("#divTravelNum").show();
                $("[alt=TransportationOnly]").hide();
            }
            if ($("#ExpenseKind").val() == "EMP_MGR_EXP") {//交通津貼
                $("[alt=TransportationOnly]").show();

             
            }

            //複製紐

            break;

        default:

            break;
    }

    $("td").each(function () { if ($(this).text() == "null") { $(this).text("") } })

    //所得稅欄位抓值
    $("#div_Incometax").find("[GetFiisData]").each(function () {
        if ($(this).text().trim().length > 0) {
            obj = $(this);
            $(this)._ajax("/EMP/GetTaxSelectedText", { sourceKeyId: $("#EMPNum").val(), type: $(this).attr("GetFiisData"), Code: $(this).text().trim() }, function (data) {
                var rtn = {
                    true: ""
                }

                if (data) {
                    $(obj).append("-" + data)
                }
                else {
                    alert("取得FIIS資料失敗")
                }
                return rtn
            }, "取得FIIS資料失敗");
        }
    })
    //所得稅欄位抓值

    if ($("#P_Status").val() == 2) {//已結案
        $("#sendButton").append("<a class=\"function-btn\" id=\"CopyBtn\" href=\"\\EMP\\COPY\\" + $("#EMPNum").val() + "\">複製</a>")
    }
})

//請款明細資料帶入主頁面
function fun_InvoiceDataPutIn(Data) {
    if (Data != null) {
        //表單資料帶回主頁面
        {
            $("#tab_Invoice tbody[alt=no-data]").hide();

            InvoiceObj = $("#tab_copyInvoice tbody").clone();

            $(InvoiceObj).find("td").eq(0).text(funAddheadZero(4, $("#tab_Invoice tbody").not("[alt=no-data]").not("[alt=Delete]").length + 1))
            $("#tab_Invoice").append(InvoiceObj);
            $(InvoiceObj).attr("EditMark", "")

            InvoiceObj.find("[name=InvoiceJsonData]").val(JSON.stringify(Data));

            $(InvoiceObj).find("[name=LineNum]").val(Data.LineNum)
            $(InvoiceObj).find("td").eq(1).text(Data.TaxIdNum)
            $(InvoiceObj).find("td").eq(2).text(Data.VendorName)
            $(InvoiceObj).find("td").eq(3).text(Data.CertificateNum)
            $(InvoiceObj).find("td").eq(4).text(Data.PaymentCategoryName)
            $(InvoiceObj).find("td").eq(5).text(Data.CurrencyName)
            $(InvoiceObj).find("td").eq(6).text(fun_accountingformatNumberdelzero(Data.OriginalAmount))
            $(InvoiceObj).find("td").eq(7).text(Data.ExpenseDesc)
            $(InvoiceObj).find("[alt=popInvoiceInfo]").on("click", function () {
                fun_popInvoiceInfo($(this).closest("tbody"));
            })
        }
        //表單資料帶回主頁面
    }
}

//建立/載入請款明細
function fun_popInvoiceInfo(target) {
    //還原預設值
    {
        $("#tab_InvoiceDetail").find(".list-close-icon").removeClass(".list-close-icon", false).addClass("list-open-icon")

        $("popInvoiceInfo div span").text("")

        $("#City").hide()

        $("#Station").hide()

        $("#divInvoiceOverDue").hide();

        $("#divYearVoucher").hide()

        $("#tab_InvoiceDetail tbody").not("[alt=no-data]").remove();//移除分攤項次的內文資料
    }
    //還原預設值

    if ($(target).find("[name=InvoiceJsonData]").val() == null) {
    }
    else {//載入
        InvoiceObj = $(target);
        InvoiceData = JSON.parse($(target).find("[name=InvoiceJsonData]").val());

        $("#LineNum").val(InvoiceData.LineNum);
        $("#PaymentCategory").text(InvoiceData.PaymentCategoryName);
        $("#PaymentMidCategory").text(InvoiceData.PaymentMidCategoryName);
        $("#ExpenseAttribute").text(InvoiceData.ExpenseAttributeName);

        $("#InvoiceExpenseDesc").text(InvoiceData.ExpenseDesc);

        $("#CertificateKind").text(InvoiceData.CertificateKindName);
        $("#TaxIdNum").text(InvoiceData.TaxIdNum);
        $("#VendorName").text(InvoiceData.VendorName);
        $("#CertificateNum").text(InvoiceData.CertificateNum);
        $("#EstimateVoucherDate").text(InvoiceData.strEstimateVoucherDate);
        if (InvoiceData.InvoiceOverDue) {
            $("#divInvoiceOverDue").show();
            $("#InvoiceOverDue").text(InvoiceData.InvoiceOverDue);
        }
        $("#Currency").text(InvoiceData.CurrencyName);
        if (InvoiceData.NeedCertificate) {
            $("#NeedCertificate").text("Y");
        }
        else {
            $("#NeedCertificate").text("N");
        }

        $("#Rate").text(fun_accountingformatNumberdelzero(InvoiceData.Rate));
        $("#AcceptanceAmount").text(fun_accountingformatNumberdelzero(InvoiceData.AcceptanceAmount));
        $("#InvoiceOriginalAmount").text(fun_accountingformatNumberdelzero(InvoiceData.OriginalAmount));
        $("#InvoiceOriginalTax").text(fun_accountingformatNumberdelzero(InvoiceData.OriginalTax));

        $("#InvoiceTWDSaleAmount").text(fun_accountingformatNumberdelzero(InvoiceData.TWDSaleAmount));
        $("#InvoiceTWDAmount").text(fun_accountingformatNumberdelzero(InvoiceData.TWDAmount));
        $("#InvoiceTWDTaxAmount").text(fun_accountingformatNumberdelzero(InvoiceData.TWDTaxAmount));

        if (InvoiceData.StartStationName) $("#Station").show();
        $("#StartStationCode").text(InvoiceData.StartStationName);
        $("#EndStationCode").text(InvoiceData.EndStationName);

        if (InvoiceData.StartCityName) $("#City").show();
        $("#StartCityCode").text(InvoiceData.StartCityName);
        $("#EndCityCode").text(InvoiceData.EndCityName);

        $("#ProjectCategory").text(InvoiceData.ProjectCategoryName);
        $("#Project").text(InvoiceData.ProjectName);
        $("#ProjectItem").text(InvoiceData.ProjectItemName);

        $("#YearVoucher").text(InvoiceData.YearVoucher);
        if (InvoiceData.YearVoucher) {
            $("#divYearVoucher").show()
        }

        $("#VoucherMemo").text(InvoiceData.VoucherMemo);
        $("#IsDeduction").text(InvoiceData.IsDeduction);
        $("#CurrencyPrecise").text(InvoiceData.CurrencyPrecise);

        if (InvoiceData.AmortizationDetailList.length > 0) {
            $("#tab_InvoiceDetail tbody[alt=no-data]").hide()
            $(InvoiceData.AmortizationDetailList).each(function () {
                tmp = $("#tab_copyInvoiceDetail tbody").clone();
                $(tmp).find("[alt=AccountBank]").text(this.AccountBank + " " + this.AccountBankName)
                $(tmp).find("[alt=AccountingItemName]").text(this.AccountingItem + " " + this.AccountingItemName)
                $(tmp).find("[alt=CostProfitCenter]").text(this.CostProfitCenter + " " + this.CostProfitCenterName)
                $(tmp).find("[alt=ProductKind]").text(this.ProductKind + " " + this.ProductKindName)
                $(tmp).find("[alt=ProductDetail]").text(this.ProductDetail + " " + this.ProductDetailName)
                $(tmp).find("[alt=ExpenseAttribute]").text(this.ExpenseAttribute + " " + this.ExpenseAttributeName)

                $(tmp).find("[alt=OriginalAmortizationAmount]").text(fun_accountingformatNumberdelzero(this.OriginalAmortizationAmount))
                $(tmp).find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(this.OriginalAmortizationTWDAmount))
                $(tmp).find("[alt=ADetailID]").text(this.ADetailID)

                $("#tab_InvoiceDetail").append(tmp);
            })
        }
        $("span").each(function () { if ($(this).text() == "null") { $(this).text("") } })
    }

    //addcase01 側邊滑欄動畫//
    $('.popup-left-addcase').show(0);
    $('.popup-overlay').fadeIn(0);
    $('.popup-box').animate({ right: "0px" }, 300);
    $("html, body").css("overflow", "hidden");
    //addcase01 側邊滑欄動畫//
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

        $(target).closest("table").find("div[arrowicon]").addClass("togglyphicon  toggleArrow glyphicon-chevron-up").attr("title", "全部展開")
        $(target).closest("table").find("div[arrowicon]").removeClass("tglyphicon glyphicon-chevron-down  toggleArrow")

        $(target).children("div").addClass("list-close-icon")
        $(target).children("div").removeClass("list-open-icon")
    }
    else {
        $(target).closest("thead").nextAll("tbody").not("[alt=no-data]").children("tr").not("[Rowtitle]").each(function () {
            $(this).hide(200);
        })
        $(target).closest("table").find("div[arrowicon]").removeClass("togglyphicon  toggleArrow glyphicon-chevron-up")
        $(target).closest("table").find("div[arrowicon]").addClass("tglyphicon glyphicon-chevron-down  toggleArrow").attr("title", "全部收合")

        $(target).children("div").removeClass("list-close-icon")
        $(target).children("div").addClass("list-open-icon")
    }
}
function fun_CloumnControl(target) {
    $(target).closest("tbody").find("tr").not("[Rowtitle]").each(function () {
        fun_controlShow($(this))
    })

    $(target).children("div").toggleClass("tglyphicon glyphicon-chevron-down  toggleArrow")
    $(target).children("div").toggleClass("togglyphicon  toggleArrow glyphicon-chevron-up")
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

//ajax pluging
(function ($) {
    var _ajaxdefaults;

    function ErrMessage(errMesg, errStates, xhr, ajaxOptions, thrownError) {
        if (errStates && xhr != null && thrownError != null) {
            alert(errMesg + "：" + xhr.status + "  " + thrownError);
        }
        else {
            alert(errMesg);
        }
    }

    function fun_ajax(URL, Data, seccessfun, option) {
        var _ajaxOption = $.extend(_ajaxdefaults, option);// extend 屬性合併，後蓋前

        ajaxErrorCount = 0;
        ajaxrtn = false;

        xhr = null;
        ajaxOptions = null;
        thrownError = null;

        do {
            $.ajax({
                url: URL,   //存取Json的網址
                type: "POST",
                cache: false,
                dataType: 'json',
                // async: _ajaxOption.async,
                async: false,//開啟異同步會導致do while無線迴圈
                timeout: 5000,
                data: Data,
                success: function (data) {
                    ajaxrtn = true;

                    var rtn = seccessfun(data);

                    if (rtn != null) {
                        $.each(rtn, function (key, Message) {
                            if (key == "true") {
                                ajaxrtn = true;
                            }
                            else {
                                ajaxrtn = false
                                ajaxErrorCount += 1;
                            }

                            _ajaxOption.Message = Message;
                        })
                    }
                },

                error: function (_xhr, _ajaxOptions, _thrownError) {
                    ajaxErrorCount += 1;
                    ajaxrtn = false;
                    xhr = _xhr
                    ajaxOptions = _ajaxOptions
                    thrownError = _thrownError
                }
            })
        } while (!ajaxrtn && ajaxErrorCount < _ajaxOption.retryCount)

        if (!ajaxrtn) {
            _ajaxOption.errfun(_ajaxOption.Message, _ajaxOption.errStates, xhr, ajaxOptions, thrownError);

            return false
        }
        else {
            return _ajaxOption.Message
        }
    }

    $.fn.extend({
        _ajax: function (URL, Data, seccessfun, errMesg, errStates, async, retryCount, errfun) {
            _ajaxdefaults = {
                async: false,
                Message: "ajax異常",
                retryCount: 3,
                errfun: ErrMessage,
                errStates: true
            };

            return this.each(function () {//回傳物件，讓方法可以串接
                var option = {
                    "async": async, "errfun": errfun, "retryCount": retryCount, "Message": errMesg, "errStates": errStates
                }

                fun_ajax(URL, Data, seccessfun, option);
            })
        }
    });
})(jQuery);