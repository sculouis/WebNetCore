var popInvoiceInfo = null
var InvoiceObj = null
var IncomeCodeList
//驗證
function Verify() {
    rtn = true;
    let draftAjax = $.Deferred()

    setTimeout(function () {
        ErrItemArray = [];
        if ($("#P_CurrentStep").val() == 4) {//會計經辦階段審核
            $("#InformationSection").find("[necessary]").each(function () {
                if (String($(this).val()).trim().length < 1) {
                    fun_AddErrMesg($(this), "Err" + $(this).attr("id"), "此為必填欄位")
                    rtn = false;

                    //若為折行顯示則展開
                    if ($(this).closest("tr").is(":hidden")) {
                        $(this).closest("tbody").find("tr").show()
                    }
                }
            })

            if (rtn) {
                //請款明細驗證
                //20190320 太慢了，放棄 經理人交通津貼已死，不必再重複驗證
                /* $("#tab_Invoice").find("tbody").not("[alt=no-data]").each(function () {
                     Index = $(this).find("[alt=Index]").text()

                     //將請款明細資料塞回POP重新驗證 有點慢..

                     fun_popInvoiceInfo($(this), false)
                     necessaryChcek = true;
                     $("#popInvoiceInfo").find("[Errmsg='Y']").remove()
                     //必填欄位判斷
                     $("#popInvoiceInfo").find("[necessary]").each(function () {
                         // console.log($(this).attr("alt"))

                         if ($(this).val() == null || $(this).val().trim().length < 1) {
                             ErrItemArray.push({ key: Index, value: "資料填寫不完整" })
                             necessaryChcek = false
                             return false
                         }
                     })
                     //必填欄位判斷

                     //分攤明細層試算
                     {
                         if (necessaryChcek) {
                             Rate = accounting.unformat($("#Rate").val())
                             AcceptanceAmount = accounting.unformat($("#AcceptanceAmount").text());
                             InvoiceOriginalAmount = accounting.unformat($("#InvoiceOriginalAmount").val());;
                             InvoiceTWDSaleAmount = accounting.unformat($("#InvoiceTWDSaleAmount").text());;
                             InvoiceTWDAmount = accounting.unformat($("#InvoiceTWDAmount").text());;

                             OriginalAmortizationAmountTotal = 0;
                             OriginalAmortizationTWDAmountTotal = 0;
                             maxAmount = 0
                             maxAmountTWD = 0

                             if ($("#tab_InvoiceDetail tbody").not("[alt=no-data]").not("[alt=Delete]").length == 0) {
                                 ErrItemArray.push({ key: Index, value: "分攤明細層至少需輸入一筆資料" })
                             }
                             else {
                                 $("#tab_InvoiceDetail tbody").not("[alt=no-data]").not("[alt=Delete]").each(function () {
                                     OriginalAmortizationAmount = accounting.unformat($(this).find("[alt=OriginalAmortizationAmount]").val());
                                     if (!isNaN(OriginalAmortizationAmount)) {
                                         OriginalAmortizationTWDAmount = parseInt(accounting.toFixed(OriginalAmortizationAmount * Rate));

                                         OriginalAmortizationAmountTotal += OriginalAmortizationAmount;
                                         OriginalAmortizationTWDAmountTotal += OriginalAmortizationTWDAmount;

                                         $(this).find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(OriginalAmortizationTWDAmount))
                                     }
                                 })

                                 if ($("#IsDeduction").text() == "Y") {
                                     maxAmount = AcceptanceAmount;
                                     maxAmountTWD = InvoiceTWDSaleAmount;
                                 }
                                 else {
                                     maxAmount = InvoiceOriginalAmount;
                                     maxAmountTWD = InvoiceTWDAmount;
                                 }

                                 if (!isNaN(OriginalAmortizationAmountTotal) && !isNaN(maxAmount)
                                       && !isNaN(OriginalAmortizationTWDAmountTotal) && !isNaN(maxAmountTWD)) {
                                     if ((parseFloat(accounting.toFixed(maxAmount - OriginalAmortizationAmountTotal, 8))) != 0) {
                                         ErrItemArray.push({ key: Index, value: "金額合計錯誤" })
                                     }
                                 }
                                 else {
                                     ErrItemArray.push({ key: Index, value: "金額驗證錯誤" })
                                 }
                             }
                         }
                     }
                     //分攤明細層試算
                 })*/

                /*if (ErrItemArray.length > 0) {
                    rtn = false
                    $("#AlertMessage").html("")
                    $.each(ErrItemArray, function (index, obj) {
                        $("#AlertMessage").html($("#AlertMessage").html() + "請款明細第" + obj.key + "項資料有誤 " + obj.value + "<br/>");
                    })
                    window.location.href = "#modal-added-info-2"

                    return rtn
                }*/
                //請款明細驗證

                //所得稅驗證
                NoCertificateIncomeAmount = parseInt(accounting.unformat($("#NoCertificateIncomeAmount").text()))
                if (NoCertificateIncomeAmount > 0) {
                    WithholdingTax = parseInt(accounting.unformat($("#WithholdingTax").val()))
                    NetPayment = parseInt(accounting.unformat($("#NetPayment").val()))

                    if (NoCertificateIncomeAmount != (WithholdingTax + NetPayment)) {
                        $("#AlertMessage").html("給付淨額+所扣稅額不等於未取具憑證");
                        window.location.href = "#modal-added-info-2"
                        return false
                    }
                }

                //所得稅驗證

                ErrItemArray = fun_bussiceTaxCheck()

                if (ErrItemArray.length > 0) {
                    rtn = false
                    // alert("營業稅第" + ErrItem + "項資料有誤")
                    $("#AlertMessage").html("");
                    $.each(ErrItemArray, function (index, obj) {
                        $("#AlertMessage").html($("#AlertMessage").html() + "營業稅第" + obj.key + "項資料有誤 " + obj.value + "<br/>");
                    })
                    window.location.href = "#modal-added-info-2"
                }
            }
            else {
                if ($('[Errmsg=Y]').length > 0) {
                    $('html, body').animate({
                        scrollTop: ($('[Errmsg=Y]').first().closest("div .row").offset().top) - 50
                    }, 500);
                }
            }
        }

        (rtn) ? draftAjax.resolve() : draftAjax.reject()
    }, 0)

    return draftAjax.promise()
}

//傳送
function Save() {
    let draftAjax = $.Deferred()


    CertificateAmount = parseFloat(accounting.unformat($("#CertificateAmount").text()))
    if (CertificateAmount > 1000000000) {
        fun_AddErrMesg($("#CertificateAmount"), "ErrCertificateAmount", "超出數字上限")
        $('html, body').animate({
            scrollTop: ($("#CertificateAmount").offset().top) - 50
        }, 500);

        setTimeout(function () { $.unblockUI() }, 2000)

        return draftAjax.reject();
    }

    $("input[Amount]").each(function () {
        $(this).val(accounting.unformat($(this).val()))
    })

    i = 0;
    $("#div_bussiceTax tbody").each(function () {
        $(this).find("[JScontrolName]").each(function () {
            $(this).attr("name", "BusinessTaxList[" + i + "]." + $(this).attr("JScontrolName"))
        })

        i += 1;
    })

    _formInfo.flag = false

    $.ajax({
        type: 'post',
        dataType: 'json',
        // url: '/EMP/Save?clickButtonType=' + _clickButtonType + '&SendType=' + $("[name=SendType]:checked").val(),
        url: '/EMP/Save?clickButtonType=' + _clickButtonType,
        data: $("form").serialize(),
        success: function (data) {
            _formInfo.formGuid = data.FormGuid
            _formInfo.formNum = data.FormNum
            _formInfo.flag = data.Flag

            $("#FormTypeName").val("員工報支(" + $("#ExpenseKindName").text() + ")")
            $("#ApplyItem").val($("#ExpenseKindName").text())

            draftAjax.resolve();
        },
        error: function () {
            draftAjax.reject();
            alert("存檔發生錯誤");
        }
    }
      ).always(function () {
          $("input[Amount]").each(function () {
              $(this).val(fun_accountingformatNumberdelzero($(this).val()))
          })
      })

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

$(function () {
    P_CurrentStep = $("#P_CurrentStep").val();
    $("#CurrentStep").val(P_CurrentStep);

    //金額欄位動作
    $("input[Amount]").on("focus", function () {
        fun_onfocusAction(this);
    })
    $("input[Amount]").on("blur", function () {
        fun_onblurAction(this);
    })
    $.each($("[Amount]"), function () {
        if ($(this).text().length > 0) {
            $(this).text(fun_accountingformatNumberdelzero($(this).text()))
        }
        if ($(this).val().length > 0) {
            $(this).val(fun_accountingformatNumberdelzero($(this).val()))
        }
    })

    //請款明細帶回動作
    $("#popConfirm").on("click", function () {
        rtn = fun_InvoiceDataConfirm()

        if (rtn) {
            InvoiceData = fun_InvoiceDatakeep();

            fun_InvoiceDataPutIn(InvoiceData);
            //側滑關閉動作
            $('.popup-left-addcase').fadeOut(300);
            $('.popup-overlay').fadeOut(100);
            $('.popup-box').animate({ right: "-70%" }, 80);
            $("html, body").css("overflow", "visible");
            event.preventDefault();//取消預設連結至頂動作
            //側滑關閉動作
        }
        else {
            alert("明細資料有誤")
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
                    fun_TransDetailPutIn(Info)
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

    $("input").on("focus", function () {
        $(this).nextAll("[Errmsg=Y]").remove();
    })
    $("select").on("change", function () {
        $(this).nextAll("[Errmsg=Y]").remove();
    })

    //控項控制
    fun_DomControl(P_CurrentStep)
    //控項控制

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

    $("td").each(function () { if ($(this).text() == "null") { $(this).text("") } })

    $("#EstimateVoucherDate").on("blur", function () {
        //檢核[憑證日期]是否合理，依據申報期間來看不可超過兩期，申報期為兩個月一期(1-2,3-4,5-6,7-8,9-10,11-12) 不可大於現在日期
        //跨年度為逾期
        //僅發票需檢核逾期

        let YearVoucher = $("#YearVoucher").val()
        let InvoiceOverDue = $("#InvoiceOverDue").val()
        $("#YearVoucher").removeAttr("necessary").val("")
        $("#divYearVoucher").hide(200)
        $("#divInvoiceOverDue").hide(200)
        $("#InvoiceOverDue").removeAttr("necessary").val("")

        if ($(this).val().trim().length > 0) {
            EstimateVoucherDate = new Date($(this).val().trim())

            if (!isNaN(EstimateVoucherDate.getDate())) {
                $("[alt='ErrEstimateVoucherDate']").remove();

                Overdue = new Date();
                thisYear = Overdue.getFullYear();

                if (EstimateVoucherDate.valueOf() > Overdue.valueOf()) {
                    fun_AddErrMesg($("#EstimateVoucherDate"), "ErrEstimateVoucherDate", "憑證日期大於目前日期")
                    return false
                }
                //檢查是否跨年度
                if (EstimateVoucherDate.getFullYear() != thisYear) {
                    $("#divYearVoucher").show(200)
                    $("#YearVoucher").attr("necessary", "").val(YearVoucher)
                    alert("憑證日期已跨年，請輸入【跨年度傳票編號】。");

                    if ($("#CertificateKind").val() == 1) {
                        $("#divInvoiceOverDue").show(200)
                        $("#InvoiceOverDue").attr("necessary", "").val(InvoiceOverDue)
                        alert("發票已逾期，請傳送至單位最高主管簽核與確認。");
                    }
                }
                else {
                    if ($("#CertificateKind").val() == 1) {
                        Overdue.setDate(1)
                        Overdue.setMonth(Overdue.getMonth() - 2)//往前算一期
                        if ((Overdue.getMonth() + 1) % 2 == 0) Overdue.setMonth(Overdue.getMonth() - 1);//若為偶數月則在減一個月 *月份從0開始

                        int_Overdue = parseInt(String(Overdue.getFullYear()) + funAddheadZero(2, Overdue.getMonth()))
                        int_EstimateVoucherDate = parseInt(String(EstimateVoucherDate.getFullYear()) + funAddheadZero(2, EstimateVoucherDate.getMonth()))

                        if (int_EstimateVoucherDate < int_Overdue) {
                            $("#divInvoiceOverDue").show(200)
                            $("#InvoiceOverDue").attr("necessary", "").val(InvoiceOverDue)
                            alert("發票已逾期，請傳送至單位最高主管簽核與確認。");
                        }
                    }
                }
            }
            else {
                fun_AddErrMesg($(this), "ErrEstimateVoucherDate", "不合法的日期格式")
            }
        }
    })//檢核憑證日期
})

//營業稅Action
function fun_bussiceTaxAction(bussiceTax) {
    $(bussiceTax).find("[alt=Edit] select").not("[JScontrolName=IsDeduction]").on("change", function () {
        $(this).nextAll("[Errmsg=Y]").remove();
        $(this).closest("[alt=Edit]").find("[alt=optionName]").val($("#onlycopy").find("[alt=CopyBusinessNewRow]").find("select[jscontrolname=" + $(this).attr("jscontrolname") + "]").find("option[value=" + $(this).val() + "]").data("text"))
        $(this).closest("[alt=Edit]").find("[alt=optionName]").nextAll("[Errmsg=Y]").remove();
        $(this).closest("[alt=Edit]").find("[alt=optionVal]").val($(this).val())
        $(this).closest("[alt=Edit]").find("[alt=optionVal]").nextAll("[Errmsg=Y]").remove();
    })

    //扣抵否
    $(bussiceTax).find("[JScontrolName=IsDeduction]").on("change", function () {
        tbody = $(this).closest("tbody")
        BusinessNum = $(tbody).find("[JScontrolName=BusinessNum]").val()
        CertificateNum = $(tbody).find("[JScontrolName=CertificateNum]").val()
        CertificateDate = $(tbody).find("[JScontrolName=CertificateDate]").val()
        IsDeduction = $(this).val()

        $("#tab_Invoice tbody tr").each(function () {
            InvoiceJsonData = $(this).find("[name=InvoiceJsonData]").val();
            if (InvoiceJsonData) {
                JsonData = JSON.parse(InvoiceJsonData);
                if (!JsonData.TaxIdNum) JsonData.TaxIdNum = ""
                if (!JsonData.CertificateNum) JsonData.CertificateNum = ""

                if (JsonData.TaxIdNum == BusinessNum &&
                    JsonData.CertificateNum == CertificateNum &&
                    JsonData.strEstimateVoucherDate == CertificateDate) {
                    if (JsonData.IsDeduction == IsDeduction) return true// 可扣相同則跳過

                    JsonData.IsDeduction = IsDeduction;
                    if (JsonData.OriginalTax != 0) {//稅額為0則跳過重新計算
                        NewTWDAmount = JsonData.TWDAmount;
                        NewOriginalAmount = JsonData.OriginalAmount;
                        OldOriginalAmount = JsonData.AcceptanceAmount;

                        if (IsDeduction == "Y") {
                            NewTWDAmount = JsonData.TWDSaleAmount;
                            NewOriginalAmount = JsonData.AcceptanceAmount;
                            OldOriginalAmount = JsonData.OriginalAmount;
                        }

                        TotalAmount = 0
                        TotalTWDAmount = 0;

                        $(JsonData.AmortizationDetailList).each(function () {
                            if (JsonData.IsDelete) return true;

                            //推算分攤比率
                            AmortizationRatio = accounting.toFixed((this.OriginalAmortizationAmount / OldOriginalAmount), 2)

                            this.OriginalAmortizationAmount = accounting.toFixed(NewOriginalAmount * AmortizationRatio, JsonData.CurrencyPrecise)
                            this.OriginalAmortizationTWDAmount = accounting.toFixed(this.OriginalAmortizationAmount * JsonData.Rate)

                            TotalAmount += accounting.unformat(this.OriginalAmortizationAmount)
                            TotalTWDAmount += accounting.unformat(this.OriginalAmortizationTWDAmount)
                        })

                        //重新計算末欄金額
                        if (TotalAmount != NewOriginalAmount || TotalTWDAmount != NewTWDAmount) {
                            if ($(JsonData.AmortizationDetailList).length > 0) {
                                last_AmortizationDetail = $(JsonData.AmortizationDetailList).last()
                                last_AmortizationDetail.OriginalAmortizationAmount += accounting.toFixed(NewOriginalAmount - TotalAmount, JsonData.CurrencyPrecise)
                                last_AmortizationDetail.OriginalAmortizationTWDAmount += (JsonData.TWDAmount - TotalTWDAmount)
                            }
                        }
                    }
                    $(this).find("[name=InvoiceJsonData]").val(JSON.stringify(JsonData))
                }
            }
        })
    })
}

//依營業稅資料重新計算請款明細
//20180705 改成明細回滾營業稅 所已停用了@@
function InvoiceReCalculate(LineNum, IsDeduction, AssetsTaxAmount, TaxAmount) {
    TaxAmount = accounting.unformat(TaxAmount)
    AssetsTaxAmount = accounting.unformat(AssetsTaxAmount)

    InvoiceJsonData = $("#tab_Invoice").find("[name=LineNum][value='" + LineNum + "']").next().val()

    obj = JSON.parse(InvoiceJsonData);
    if (obj) {
        TWDSaleAmount = accounting.unformat(obj.TWDAmount) - AssetsTaxAmount - TaxAmount
        if (TWDSaleAmount > 0 && accounting.unformat(obj.TWDAmount) > (AssetsTaxAmount + TaxAmount)) {
            old_AmortizationTotalAmount = accounting.unformat(obj.OriginalAmount);
            if (obj.IsDeduction == "Y") {
                old_AmortizationTotalAmount = accounting.unformat(obj.AcceptanceAmount);
            }

            old_OriginalTax = accounting.unformat(obj.OriginalTax);

            obj.TWDTaxAmount = fun_accountingformatNumberdelzero((AssetsTaxAmount + TaxAmount))
            obj.TWDSaleAmount = fun_accountingformatNumberdelzero(TWDSaleAmount)
            obj.OriginalTax = fun_accountingformatNumberdelzero(accounting.toFixed(obj.TWDTaxAmount / obj.Rate, obj.CurrencyPrecise))
            obj.AcceptanceAmount = fun_accountingformatNumberdelzero(accounting.toFixed(obj.OriginalAmount - obj.OriginalTax, obj.CurrencyPrecise))

            if (obj.IsDeduction == IsDeduction == "N") {//不需重算分攤層
                return;
            }
            else {
                TotalAmount = 0
                TotalTWDAmount = 0

                obj.IsDeduction = IsDeduction;
                AmortizationAmount = accounting.unformat(obj.OriginalAmount);
                AmortizationTWDAmount = accounting.unformat(obj.TWDAmount);
                if (obj.IsDeduction == "Y") {
                    AmortizationAmount = accounting.unformat(obj.AcceptanceAmount);
                    AmortizationTWDAmount = accounting.unformat(obj.TWDSaleAmount)
                }

                $(obj.AmortizationDetailList).each(function () {
                    if (obj.IsDelete) return true;
                    //推算分攤比率
                    OriginalAmortizationAmount = accounting.unformat(this.OriginalAmortizationAmount);
                    AmortizationRatio = accounting.unformat(accounting.toFixed((OriginalAmortizationAmount / old_AmortizationTotalAmount), 2))

                    this.OriginalAmortizationAmount = fun_accountingformatNumberdelzero(accounting.toFixed(AmortizationAmount * AmortizationRatio, obj.CurrencyPrecise))
                    this.OriginalAmortizationTWDAmount = fun_accountingformatNumberdelzero(accounting.unformat(accounting.toFixed(AmortizationTWDAmount * AmortizationRatio)))

                    TotalAmount += accounting.unformat(this.OriginalAmortizationAmount)
                    TotalTWDAmount += accounting.unformat(this.OriginalAmortizationTWDAmount)
                })

                //重新計算末欄金額
                if (TotalAmount != accounting.unformat(obj.OriginalAmount) || TotalTWDAmount != accounting.unformat(obj.TWDAmount)) {
                    last_AmortizationDetail = $(obj.AmortizationDetailList).last()
                    if (last_AmortizationDetail) {
                        lastAmount = accounting.unformat(last_AmortizationDetail.OriginalAmortizationAmount)
                        lastTwdAmount = accounting.unformat(last_AmortizationDetail.OriginalAmortizationTWDAmount)

                        last_AmortizationDetail.OriginalAmortizationAmount = fun_accountingformatNumberdelzero(lastAmount + accounting.toFixed(obj.OriginalAmount - TotalAmount, obj.CurrencyPrecise))
                        last_AmortizationDetail.OriginalAmortizationTWDAmount = fun_accountingformatNumberdelzero(lastTwdAmount + accounting.toFixed(obj.TWDAmount - TotalTWDAmount))
                    }
                }
                $("#tab_Invoice").find("[name=LineNum][value='" + LineNum + "']").next().val(JSON.stringify(obj))
            }
        }
    }
}

//營業稅檢核
function fun_bussiceTaxCheck() {
    let ErrItemArray = [];

    $("#div_bussiceTax").find("tbody").not("[alt=no-data]").not("[Deleted]").each(function (index) {
        i = index + 1;
        rtn = true
        $(this).find("[necessary]").each(function () {
            if ($(this).val().trim().length < 1) {
                fun_AddErrMesg($(this), "Err" + $(this).attr("id"), "此為必填欄位")
                rtn = false;

                //若為折行顯示則展開
                if ($(this).closest("tr").is(":hidden")) {
                    $(this).closest("tbody").find("tr").show()
                }
            }
        })

        if (!rtn) {
            ErrItemArray.push({ key: i, value: "資料填寫不完整" })

            return true;
        }

        LineNum = $(this).find("[JScontrolName=LineNum]").val()
        CertificateAmount = accounting.unformat($(this).find("[JScontrolName=CertificateAmount]").val())//憑證總額
        IsDeduction = $(this).find("[JScontrolName=IsDeduction]").val()

        AssetsSaleAmount = accounting.unformat($(this).find("[JScontrolName=AssetsSaleAmount]").val())//固定資產(銷售額)
        Taxable = accounting.unformat($(this).find("[JScontrolName=Taxable]").val())//費用(應稅)
        TaxFree = accounting.unformat($(this).find("[JScontrolName=TaxFree]").val())//免稅(銷售額)
        ZeroTax = accounting.unformat($(this).find("[JScontrolName=ZeroTax]").val())//零稅(銷售額)
        OtherAmount = accounting.unformat($(this).find("[JScontrolName=OtherAmount]").val())//其他費用(銷售額)

        AssetsTaxAmount = accounting.unformat($(this).find("[JScontrolName=AssetsTaxAmount]").val())//固定資產(稅額)
        TaxAmount = accounting.unformat($(this).find("[JScontrolName=TaxAmount]").val())//費用 稅額

        BusinessNum = $(this).find("[JScontrolName=BusinessNum]").val()
        CertificateNum = $(this).find("[JScontrolName=CertificateNum]").val()
        CertificateDate = $(this).find("[JScontrolName=CertificateDate]").val()

        /*if (
            //稅額>銷售額
            (AssetsTaxAmount + TaxAmount) > (AssetsSaleAmount + Taxable + TaxFree + ZeroTax + OtherAmount) ||
            //銷售額>總額
            (AssetsSaleAmount + Taxable + TaxFree + ZeroTax + OtherAmount) > CertificateAmount ||
            //總額不相符
            (CertificateAmount - AssetsTaxAmount - TaxAmount - AssetsSaleAmount - Taxable - TaxFree - ZeroTax - OtherAmount != 0)
            ) {
            ErrItem += i + " ";

            return true;
        }*/
        if ((AssetsTaxAmount + TaxAmount) > (AssetsSaleAmount + Taxable + TaxFree + ZeroTax + OtherAmount)) {
            ErrItemArray.push({ key: i, value: "稅額大於銷售額" })

            return true;
        }
        if ((AssetsSaleAmount + Taxable + TaxFree + ZeroTax + OtherAmount) > CertificateAmount) {
            ErrItemArray.push({ key: i, value: "銷售額大於總額" })

            return true;
        }
        if ((CertificateAmount - AssetsTaxAmount - TaxAmount - AssetsSaleAmount - Taxable - TaxFree - ZeroTax - OtherAmount != 0)) {
            ErrItemArray.push({ key: i, value: "總額不相符" })

            return true;
        }

        TWDAmount = 0
        TWDTaxAmount = 0
        $("#tab_Invoice tbody tr").each(function () {
            InvoiceJsonData = $(this).find("[name=InvoiceJsonData]").val();
            if (InvoiceJsonData) {
                JsonData = JSON.parse(InvoiceJsonData);
                if (JsonData.TaxIdNum == BusinessNum &&
                    JsonData.CertificateNum == CertificateNum &&
                    JsonData.strEstimateVoucherDate == CertificateDate) {
                    TWDAmount += JsonData.TWDAmount
                    TWDTaxAmount += JsonData.TWDTaxAmount
                }
            }
        })
        if (TWDAmount != CertificateAmount) {
            ErrItemArray.push({ key: i, value: "憑證總額與請款明細金額(臺幣)加總不相符。請款明細金額(臺幣)加總為 " + fun_accountingformatNumberdelzero(TWDAmount) })

            return true;
        }
        if (TWDTaxAmount != (AssetsTaxAmount + TaxAmount)) {
            ErrItemArray.push({ key: i, value: "稅額與請款明細稅額(臺幣)加總不相符。請款明細稅額(臺幣)加總為 " + fun_accountingformatNumberdelzero(TWDTaxAmount) })

            return true;
        }

        /* if (IsDeduction == "N") {
             if (TaxAmount != 0 || AssetsTaxAmount != 0) {
                 ErrItemArray.push({ key: i, value: "不可扣抵時稅額必須為0" })
                 return true;
             }
         }*/

        //InvoiceReCalculate(LineNum, IsDeduction, AssetsTaxAmount, TaxAmount)
    })

    return ErrItemArray
}

//權限與控項控制
function fun_DomControl(P_CurrentStep) {
    let ApplicantDepId = String($("#ApplicantDepId").val()).split(',')[2]

    subStep = 0;

    if ($("#ExpenseKind").val() == "EMP_TRAVEL_EXP") {//出差
        $("#divTravelNum").show();
    }

    if ($("#ExpenseKind").val() == "EMP_MGR_EXP") {//交通津貼
        if (parseInt(accounting.unformat($("#NoCertificateIncomeAmount").text())) == 0) {
            $("#div_Incometax").hide()
        }

        if ($("#CertficateKind").val()) {
            $(this)._ajax("/EMP/GetCertficateKindInfo", { sourceKeyId: $("#EmpNum").val(), CertficateKind: $("#CertficateKind").val() },
           function (data) {
               if (data) {
                   $("#CertficateKindTag").val(data.tag)
                   $("#divCertficateKind").text(data.identityTypeCode + "-" + data.description)
                   return { true: "" }
               }
               else {
                   return { false: "取得證號別資訊失敗" }
               }
           }, "取得證號別資訊失敗")//取得證號別資訊

            if (__bussiceTax > 0) {
                subStep = 3
            }
            else {
                subStep = 2
            }
        }
        else {
            if (__bussiceTax > 0) {
                subStep = 1
            }
        }
    }
    else {
        $("[alt=TransportationOnly]").remove();

        if (__bussiceTax > 0) {
            subStep = 1
        }
    }

    $(this)._ajax("/EMP/GetFromDataSet", { sourceKeyId: $("#EmpNum").val(), VendorNum: "", CurrentStep: P_CurrentStep, subStep: subStep },
       fun_InfoSet, "表單資料載入失敗")//設定表單資料ajax

    switch (P_CurrentStep) {
        case "1"://起單人
            $("#div_PayAlone").hide()//單獨付款
            break;

        case "2"://請款人
        case "3"://主管覆核
            {
                $("#divExceptedPaymentDate").remove() //承辦單位預計付款日
                $("#lab_Emergency").hide();//是否急件
                $("#div_VoucherMemo").hide();//傳票摘要

                //關卡2 3的畫面與會計階段不同
                $("#CertificateInfo").empty()
                $("#CertificateInfo").append($("#PartialCheckOut_TransApplicant div[alt=CertificateInfo]").html())

                //交通津貼差更多= =
                if ($("#ExpenseKind").val() == "EMP_MGR_EXP") {
                    $("#ApplicantInfoArea div[alt=TransAccountingNoShow]").remove()
                    $("#ApplicantInfoArea").append($("#PartialCheckOut_TransApplicant div[alt=TrnasInfo]").html())

                    $("#PaymentInfoArea").empty()
                    $("#PaymentInfoArea").append($("#PartialCheckOut_TransApplicant div[alt=TrnasPayInfo]").html())

                    $("#tab_Invoice").empty()
                    $("#tab_Invoice").append($("#tab_TrnasInvoiceDetail").html())
                }
                else {
                    $("#PartialCheckOut_TransApplicant").remove();

                    $("div [alt=TransportationOnly]").find("[alt=Edit]").remove()

                    $("#popInvoiceInfo").find("[alt=Edit]").remove()

                    //分攤明細層
                    $("#tab_copyInvoiceDetail div[Edit=Y]").remove()
                    //分攤明細層
                }

                //所得稅申報資料
                $("#div_Incometax [alt=Edit]").remove()
                $("#div_Incometax [alt=accounting-stage-field]").remove()
                $("#div_IncometaxTitle").removeClass("m-top10")
                //所得稅申報資料

                //營業稅申報資料
                $("#div_bussiceTax").remove()
                //營業稅申報資料
            }
            break;

        case "4"://會計經辦
            {
                //承辦單位預計付款日
                $("#divExceptedPaymentDate").show()

                $("#NoEditExceptedPaymentDate").remove()
                today = new Date();

                $("#divExceptedPaymentDate").data("DateTimePicker").minDate(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());

                $("div [alt=TransportationOnly]").find("[alt=NoEdit]").remove()
                $("#Emergency").removeClass("input-disable").addClass("input").prop("disabled", false)//是否急件

                //跨年度傳票編號
                $("#YearVoucher").show()
                $("#NoEditYearVoucher").hide()
                //跨年度傳票編號
                //發票逾期說明
                $("#InvoiceOverDue").show()
                $("#NoEditInvoiceOverDue").hide()
                //發票逾期說明
                //傳票摘要

                $("#VoucherMemo").show()
                $("#NoEditVoucherMemo").hide()
                //傳票摘要

                $("#PartialCheckOut_TransApplicant").remove();
                //明細層
                {
                    $("#tab_copyInvoiceDetail [Edit=N]").remove()
                    $("#popInvoiceInfo").find("[alt=NoEdit]").remove();

                    $("#EstimateVoucherDatePicker").data("DateTimePicker").maxDate(new Date());

                    $("#CertificateKind").on("change", function () {
                        if ($(this).val() == 1) {//發票
                            $("#TaxIdNum").attr("necessary", "")
                            $("#CertificateNum").attr("necessary", "").attr("maxlength", 10)
                            $("#CertificateNum").val($("#CertificateNum").val().substr(0, 10))
                            $("#EstimateVoucherDate").attr("necessary", "")

                            $("#InvoiceOriginalTax").show()
                            $("#InvoiceOriginalTax").removeAttr("readonly", "")
                            $("#NoEditInvoiceOriginalTax").hide()
                            $("#TaxIdNumStarMark").show()
                            $("#CertificateNumStarMark").show();
                            $("#EstimateVoucherDateTitle").html("<b class=\"float-left\">憑證日期</b>  <b class=\"required-icon\">*</b>");
                        }
                        else {
                            $("#TaxIdNum").removeAttr("necessary")
                            $("#CertificateNum").removeAttr("necessary")
                            $("#CertificateNum").attr("maxlength", 15)
                            $("#EstimateVoucherDate").removeAttr("necessary")
                            $("#InvoiceOriginalTax").hide()
                            $("#InvoiceOriginalTax").attr("readonly", "")
                            $("#NoEditInvoiceOriginalTax").show()
                            $("#InvoiceOriginalTax").val(0);
                            $("#NoEditInvoiceOriginalTax span").text(0);
                            $("#TaxIdNumStarMark").hide()
                            $("#CertificateNumStarMark").hide();
                            $("#EstimateVoucherDateTitle").html("<b class=\"float-left\">憑證日期</b>");

                            $("[alt=ErrTaxIdNum]").remove();
                            $("[alt=ErrCertificateNum]").remove();
                            $("[alt=ErrEstimateVoucherDate]").remove();
                            $("[alt=ErrInvoiceOriginalTax]").remove();

                            $("#InvoiceOriginalTax").next("[Errmsg=Y]").remove();
                        }

                        if ($("input#EstimateVoucherDate").val().length > 0) {
                            $("input#EstimateVoucherDate").blur();
                        }
                        fun_InvoiceAmountCalculate(popInvoiceInfo);
                    })//憑證類別更改動作

                    $("#Currency").on("change", function () {
                        $("[alt=ErrRate]").remove()
                        if ($(this).val() == "TWD") {//幣別為台幣不開放編輯
                            $("#Rate").val(1).hide()
                            $("#NoEditExchangeRate").show()
                            $("#NoEditExchangeRate span").text(1)
                            $("#Rate").attr("Accuracy", 0);
                            $("#CurrencyPrecise").text(0)
                            // $("#_OriginalAmount").attr("Accuracy", 0);
                            $("#InvoiceOriginalAmount").attr("Accuracy", 0);
                            $("#InvoiceOriginalTax").attr("Accuracy", 0);
                            $("[alt=OriginalAmortizationAmount]").attr("Accuracy", 0);
                        }
                        else {
                            if ($("#ExpenseKind").val() == "EMP_TRAVEL_EXP") {//出差
                                if ($("#EndTripDate").text().length == 0) {
                                    $("#Rate").val(0)
                                    $("#NoEditExchangeRate span").text(0)
                                    alert("無法依據出差迄日換算美元匯率。");
                                }
                                else {
                                    $("#Rate")._ajax("/EMP/GetEndTripConversionRate", { FromID: $("#EmpNum").val(), CurrencyCode: $(this).val(), EndTripDate: $("#EndTripDate").text() },
                                function (data) {
                                    var rtn = {
                                        true: ""
                                    }
                                    if (data.IsSuccess) {
                                        $("#Rate").val(data.Detail)
                                        $("#NoEditExchangeRate span").text(data.Detail)
                                    }
                                    else {
                                        $("#Rate").val(0)
                                        $("#NoEditExchangeRate span").text(0)

                                        rtn = {
                                            false: data.Message
                                        }
                                    }
                                })
                                }
                            }

                            $("#Rate").show(200)
                            $("#NoEditExchangeRate").hide(200)

                            CurrencyPrecise = $(this).find("option:selected").data("extendedPrecision");
                            $("#CurrencyPrecise").text(CurrencyPrecise)

                            $("#Rate").attr("Accuracy", CurrencyPrecise);
                            $("[alt=OriginalAmortizationAmount]").attr("Accuracy", CurrencyPrecise);
                            $("#InvoiceOriginalAmount").attr("Accuracy", CurrencyPrecise);
                            $("#InvoiceOriginalTax").attr("Accuracy", CurrencyPrecise);
                        }
                        //清空金額欄位

                        $("#AcceptanceAmount").text("");
                        $("#InvoiceOriginalAmount").val("");
                        $("#InvoiceOriginalTax").val(0);
                        $("#NoEditInvoiceOriginalTax span").text(0)
                        $("#InvoiceTWDSaleAmount").text("");
                        $("#InvoiceTWDAmount").text("");
                        $("#InvoiceTWDTaxAmount").text("");
                        $("[alt=OriginalAmortizationAmount]").val("");
                        $("[alt=OriginalAmortizationTWDAmount]").text("");
                        $("[alt=ErrAmount]").remove();
                    })//幣別更換動作

                    $("#Rate").on("change", function () {
                        if ($("#Currency").val() == "TWD") {
                            $("#Rate").val(1)
                            $("#NoEditExchangeRate span").text(1)
                        }

                        $("#AcceptanceAmount").text("");
                        $("#InvoiceOriginalAmount").val("")
                        $("#InvoiceOriginalTax").val(0)
                        $("#NoEditInvoiceOriginalTax span").text(0)
                        $("#InvoiceTWDSaleAmount").text("");
                        $("#InvoiceTWDAmount").text("");
                        $("#InvoiceTWDTaxAmount").text("");
                        $("#detailOriginalAmount").val("")
                        $("#detailTWDAmount").val("");
                        $("[alt=OriginalAmortizationAmount]").val(0)
                        $("[alt=OriginalAmortizationTWDAmount]").text("");
                    })//匯率更換動作

                    $("#InvoiceOriginalAmount").off("blur");//金額(原幣) 失焦動作需自訂
                    $("#InvoiceOriginalAmount").on("blur", function () {
                        if (fun_onblurAction($(this))) {
                            if ($("#CertificateKind").val() == 1) {
                                if (!fun_onblurAction($("#InvoiceOriginalTax"))) {
                                    return false
                                }
                            }

                            if (accounting.unformat($("#InvoiceOriginalAmount").val()) > accounting.unformat($("#InvoiceOriginalTax").val())) {
                                fun_InvoiceAmountCalculate(popInvoiceInfo);
                            }
                            else {
                                fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrInvoiceOriginalAmount", "金額(原幣) 小於 稅額(原幣)");
                            }
                        }
                    })//金額(原幣)更換動作

                    $("#InvoiceOriginalTax").off("blur");//稅額(原幣) 失焦動作需自訂
                    $("#InvoiceOriginalTax").on("blur", function () {
                        if (fun_onblurAction($(this)) && fun_onblurAction($("#InvoiceOriginalAmount"))) {
                            if (accounting.unformat($("#InvoiceOriginalAmount").val()) > accounting.unformat($("#InvoiceOriginalTax").val())) {
                                fun_InvoiceAmountCalculate(popInvoiceInfo);
                            }
                            else {
                                fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrInvoiceOriginalAmount", "金額(原幣) 小於 稅額(原幣)");
                            }
                        }
                    })//稅額(原幣)更換動作

                    $("#addsubInvoiceInfo").show()
                    $("#addsubInvoiceInfo").on("click", function () {
                        tmp = $("#tab_copyInvoiceDetail tbody").clone();
                        $(tmp).find("[alt=OriginalAmortizationAmount]").attr("Accuracy", $("#CurrencyPrecise").text());
                        $(tmp).find("[alt=removesubInvoiceInfo]").on("click", function () {
                            if (confirm("是否確認刪除該筆資料")) {
                                tbody = $(this).closest("tbody");

                                if (tbody.find("[alt=ADetailID]").val() <= 0) {
                                    tbody.remove()
                                }
                                else {
                                    tbody.hide()
                                    tbody.find("[alt=Index]").attr("alt", "Delete")
                                    tbody.attr("alt", "Delete")
                                    tbody.find("[alt=IsDelete]").val(true)
                                }

                                if ($("#tab_InvoiceDetail tbody").not("[alt=no-data]").not("[alt=Delete]").length > 0) {
                                    fun_resetCellIndex($("#tab_InvoiceDetail"), "Index", 4);
                                }
                                else {
                                    $("#tab_InvoiceDetail tbody[alt=no-data]").show();
                                }
                            }
                        })//註冊刪除請款明細分攤層action
                        $(tmp).find("[alt=OriginalAmortizationAmount]").on("focus", function () {
                            fun_onfocusAction(this);
                        })
                        $(tmp).find("[alt=OriginalAmortizationAmount]").on("blur", function () {
                            if (fun_onblurAction(this)) {
                                OriginalAmortizationAmount = accounting.unformat($(this).val());
                                Rate = accounting.unformat($("#Rate").text());
                                if (!isNaN(OriginalAmortizationAmount) && !isNaN(Rate))

                                    $(this).closest("tr").find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(accounting.toFixed(OriginalAmortizationAmount * Rate)))
                            }
                        })
                        /* $(tmp).find("[alt=CostProfitCenter]").on("change", function () {
                             option = $("#tab_copyInvoiceDetail").find("[alt=CostProfitCenter]").find("option[value='" + $(this).val() + "']")
                             if (option.data("isProductRequired") == "Y") {
                                 $(tmp).find("[alt=ProductKind]").attr("necessary", "")
                             }
                             else {
                                 $(tmp).find("[alt=ProductKind]").removeAttr("necessary")
                             }
                         })*/

                        if ($("#default_AccountingCode").val()) {
                            $(tmp).find("[name=AccountingItemCode]").val($("#default_AccountingCode").val())
                            $(tmp).find("[name=AccountingItemName]").val($("#default_AccountingName").val())
                            $(tmp).find("[name=AccountingItem]").text($("#default_AccountingCode").val() + "-" + $("#default_AccountingName").val()).removeClass("undone-text")
                        }

                        $(tmp).find("[alt=CostProfitCenter]").val($("#EmpCostProfitCenter").val())

                        $(tmp).find("[alt=AccountBank]").val($("#Books").val())

                        /*$(tmp).find("[alt=AmortizationDetailAccountingItemCode]").val($("#Books").val())

                        $(tmp).find("[alt=AmortizationDetailAccountingItemName]").val($("#Books").val())*/

                        //計算剩餘金額
                        {
                            MaxAmount = 0
                            MaxTwAmount = 0
                            AcceptanceAmount = accounting.unformat($("#AcceptanceAmount").text());
                            OriginalAmount = accounting.unformat($("#InvoiceOriginalAmount").val());

                            TWDAmount = accounting.unformat($("#InvoiceTWDAmount").text());
                            TWDSaleAmount = accounting.unformat($("#InvoiceTWDSaleAmount").text());

                            if ($("#IsDeduction").text() != "Y") {
                                MaxAmount = OriginalAmount
                                MaxTwAmount = TWDAmount
                            }
                            else {
                                MaxAmount = AcceptanceAmount
                                MaxTwAmount = TWDSaleAmount
                            }

                            $("#tab_InvoiceDetail tbody").not("[alt=no-data]").not("[alt=Delete]").each(function () {
                                OriginalAmortizationAmount = accounting.unformat($(this).find("[alt=OriginalAmortizationAmount]").val());
                                if (!isNaN(OriginalAmortizationAmount)) {
                                    OriginalAmortizationTWDAmount = parseInt(accounting.toFixed(OriginalAmortizationAmount * Rate));

                                    MaxAmount -= OriginalAmortizationAmount;
                                    MaxTwAmount -= OriginalAmortizationTWDAmount;
                                }
                            })
                            $(tmp).find("[alt=OriginalAmortizationAmount]").val(0)
                            $(tmp).find("[alt=OriginalAmortizationTWDAmount]").text(0)
                            if (MaxAmount > 0) {
                                $(tmp).find("[alt=OriginalAmortizationAmount]").val(fun_accountingformatNumberdelzero(MaxAmount))
                            }
                            if (MaxTwAmount > 0) {
                                $(tmp).find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(MaxTwAmount))
                            }
                        }

                        $(tmp).find("select").on("change", function () {
                            $(this).nextAll("[Errmsg=Y]").remove();
                        })
                        $(tmp).mouseenter(function () {
                            $(this).find("[alt=removesubInvoiceInfo]").show();
                        })
                        $(tmp).mouseleave(function () {
                            $(this).find("[alt=removesubInvoiceInfo]").hide();
                        })

                        //selectpicker clone會無法作用 必須移除後再重新渲染 反應會延遲

                        $(tmp).find('.selectpicker').data('selectpicker', null);
                        $(tmp).find('.bootstrap-select').find("button:first").remove();
                        $(tmp).find(".selectpicker").selectpicker("refresh")
                        //selectpicker clone會無法作用 必須移除後再重新渲染

                        $(tmp).find("[alt=CostProfitCenter]").change();
                        $("#tab_InvoiceDetail").append(tmp);
                        fun_resetCellIndex($("#tab_InvoiceDetail"), "Index", 4);

                        $("#tab_InvoiceDetail tbody[alt=no-data]").hide();
                    })//新增請款明細分攤層

                    //費用性質
                    // if (__IsCardEmp == "true" || ApplicantDepId == "0113") {//是否為卡處人員
                    if (__IsCardEmp == "true" || __IsCardEmp == "True") {//是否為卡處人員 *   不判斷會計經辦，實務上不會發生跨部處審核
                        $("#tab_copyInvoiceDetail div[alt=ExpenseAttributeName]").remove()
                        $("#tab_copyInvoiceDetail select[alt=ExpenseAttribute]")._ajax("/EMP/GetExpenseAttributeFullName", { FromID: $("#EmpNum").val() },
                             function (data) {
                                 rtn = {
                                     true: ""
                                 }
                                 if (data.IsSuccess) {
                                     fun_setSelectOption($("#tab_copyInvoiceDetail select[alt=ExpenseAttribute]"), data.Detail, true)
                                 }
                                 else {
                                     rtn = {
                                         false: data.Message
                                     }
                                 }
                             }, "獲取費用性質清單失敗")
                    }
                    else {
                        $("#tab_copyInvoiceDetail select[alt=ExpenseAttribute]").remove()
                    }
                    //費用性質
                }
                //明細層

                if ($("#ExpenseKind").val() == "EMP_MGR_EXP") {
                    //車號與生效日
                    {
                        $("#div_CarContractDate").data("DateTimePicker").maxDate(new Date());
                        /*if ($("#CarNum").val()) {
                            $("#CarContractDate").removeAttr("readonly", "").attr("necessary", "").prop('disabled', false).removeClass("input-disable").next().removeClass("input-disable")
                        }
                        else {
                            $("#CarContractDate").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).addClass("input-disable").val("").next().addClass("input-disable")
                        }
                        $("#CarNum").on("change", function () {
                            if (!$(this).val() || $(this).val().trim().length == 0) {
                                $("#CarContractDate").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).addClass("input-disable").val("").next().addClass("input-disable")
                            }
                            else {
                                $("#CarContractDate").removeAttr("readonly", "").attr("necessary", "").prop('disabled', false).removeClass("input-disable").next().removeClass("input-disable")
                            }
                        })*/
                    }

                    //所得稅申報資料
                    {
                        $("#div_IncometaxBtn").remove()
                        $("#div_IncometaxTitle").removeClass("m-top10")

                        $("#div_Incometax[alt=NoEdit]").remove()

                        $("#div_Incometax div[alt=Edit]").each(function () {
                            Default = $(this).find("[alt=default]").val();
                            if (Default) {
                                $(this).find("select").find("option[value='" + Default + "']").attr("selected", "selected").selectpicker("refresh")
                            }
                        })

                        fun_IncomeCodeChuang($("#IncomeCodeCode").val())

                        //監聽開窗選單動作
                        $(document).on('click', '#optionConfirm', function () {
                            if (_optionPickerCode == "IncomeCode") {
                                fun_IncomeCodeChuang($("#IncomeCodeCode").val())
                            }
                        })

                        $("#div_IncometaxBtn").on("click", function () {
                            if ($("#IsTwoHealthInsurance").val() && $("#IncomeCodeCode").val()) {
                                $(this)._ajax("/EMP/GetValidateWtTax", {
                                    sourceKeyId: $("#EMPNum").val(), wtIdentityType: $("#CertficateKind").val()
                                    , wtTaxCode: $("#IncomeCodeCode").val(), lineAmount: accounting.unformat($("#NoCertificateIncomeAmount").text()), twoNhiYn: $("#IsTwoHealthInsurance").val()
                                },
                             function (data) {
                                 var rtn = {
                                     true: ""
                                 }
                                 if (data && data.returnStatus == "S") {
                                     $("#NetPayment").val(fun_accountingformatNumberdelzero(data.detail[0].payAmount))
                                     $("#WithholdingTax").val(fun_accountingformatNumberdelzero(data.detail[0].wtTax))
                                     $("#SupplementPremium").val(fun_accountingformatNumberdelzero(data.detail[0].twoNhiPremiums))

                                     alert("給付淨額試算完成")
                                 }
                                 else {
                                     rtn = {
                                         false: "給付淨額試算失敗"
                                     }
                                 }
                             }, "給付淨額試算失敗")
                            }
                            else {
                                alert("請先填妥必要項目後再進行金額計算")
                            }
                        })
                    }
                    //所得稅申報資料

                    //交通津貼不開放幣別編輯 *固定為台幣
                    $("select#Currency").selectpicker('setStyle', 'input-disable', 'add').prop("disabled", true).selectpicker("refresh")
                }

                //營業稅
                {
                    $("#div_bussiceTaxBtn").remove()
                    $("#div_bussiceTaxTitle").removeClass("m-top10")

                    $("#div_bussiceTax").find("[alt=NoEdit]").remove()
                    $("#div_bussiceTax").find("[JScontrolName=IsDeduction]").each(function () {
                        setDefaultSelect($(this), $(this).closest("div[alt=Edit]").find("[alt=optionVal]").val())
                    })
                    $("#div_bussiceTax").find("[JScontrolName=FormatKind]").each(function () {
                        setDefaultSelect($(this), $(this).closest("div[alt=Edit]").find("[alt=optionVal]").val())
                        // $(this).closest("div[alt=Edit]").find("[alt=optionName]").val($(this).find("option:selected").text())
                        $(this).closest("div[alt=Edit]").find("[alt=optionName]").val($("#onlycopy").find("[alt=CopyBusinessNewRow]").find("[jscontrolname=FormatKind]").find("option[value=" + $(this).val() + "]").data("text"))
                    })

                    if (__isCreditCardOffice != "Y") {//憑證開立對象 卡處註記
                        $("[JScontrolName=TaxCategory]").closest("div").remove()
                    }
                    else {
                        $("[alt=NoEditTaxCategory]").remove()
                        $(this)._ajax("/EMP/GetDeductCategory", { FromID: $("#EmpNum").val() },
                             function (data) {
                                 var rtn = {
                                     true: ""
                                 }
                                 if (data.IsSuccess) {
                                     fun_setSelectOption($("[JScontrolName=TaxCategory]"), data.Detail, true)
                                 }
                                 else {
                                     rtn = {
                                         false: data.Message
                                     }
                                 }
                             }, "獲取稅法分類清單失敗")

                        $("[JScontrolName=TaxCategory]").each(function () {
                            setDefaultSelect($(this), $(this).closest("div[alt=Edit]").find("[alt=optionVal]").val())
                            $(this).closest("div[alt=Edit]").find("[alt=optionName]").val($(this).find("option:selected").text())
                        })
                    }

                    //營業稅Action
                    $("#div_bussiceTax tbody").each(function () {
                        fun_bussiceTaxAction($(this))
                    })
                }
                //營業稅
            }
            break;

        case "5"://會計主管覆核
        case "6"://真●會計主管覆核
            {
                $("#divExceptedPaymentDate").remove() //承辦單位預計付款日
                // $("#Emergency").removeClass("input-disable").prop("disabled", false)//是否急件

                $("div [alt=TransportationOnly]").find("[alt=Edit]").remove()

                //跨年度傳票編號
                $("#YearVoucher").hide()
                $("#NoEditYearVoucher").show()
                //跨年度傳票編號
                //發票逾期說明
                $("#InvoiceOverDue").hide()
                $("#NoEditInvoiceOverDue").show()
                //發票逾期說明

                //傳票摘要

                $("#VoucherMemo").hide()
                $("#NoEditVoucherMemo").show()
                //傳票摘要

                //分攤明細層
                {
                    $("#popInvoiceInfo").find("[alt=Edit]").remove();
                    $("#tab_copyInvoiceDetail [Edit=Y]").remove()
                }
                //分攤明細層

                //所得稅申報資料
                {
                    $("#div_IncometaxBtn").remove()
                    $("#div_IncometaxTitle").removeClass("m-top10")
                    $("#div_Incometax[alt=Edit]").remove()
                    $("#div_Incometax div[alt=NoEdit]").each(function () {
                        Default = $(this).find("[alt=default]").val();
                        if (Default) {
                            DefaultName = $(this).find("select").find("option[value='" + Default + "']").text();
                            $(this).closest("td").html(Default + "-" + DefaultName)
                        }
                    })
                }
                //所得稅申報資料

                //營業稅
                $("#div_bussiceTaxBtn").remove()
                $("#div_bussiceTaxTitle").removeClass("m-top10")

                $("#div_bussiceTax").find("[alt=Edit]").remove()

                //營業稅
            }
            break;
    }
}

//設定表單資料設定
function fun_InfoSet(data) {
    if (data.CurrencyList) {
        $.each(data.CurrencyList, function (index, value) {
            $("select#Currency").append($("<option></option>").attr("value", value.currencyCode).text(value.currencyName + " " + value.currencyCode).data("text", value.currencyName)
                 .data("extendedPrecision", value.extendedPrecision).data("currencyName", value.currencyName));
        })
        $("select#Currency").selectpicker('refresh');
    }

    //分攤明細層--帳戶行
    if (data.coaCompanyList) {
        //fun_setSelectOption($("#tab_copyInvoiceDetail").find("[alt=AccountBank]"), data.coaCompanyList)
        $.each(data.coaCompanyList, function (index, value) {
            $("#tab_copyInvoiceDetail").find("[alt=AccountBank]").append($("<option></option>").attr("value", value.company).text(value.company + " " + value.description).data("text", value.description)
                  .data("gvDeclaration", value.gvDeclaration));
        })
    }
    /*if (data.VoucherBeauList) {
        $.each(data.VoucherBeauList, function (index, Info) {
            $("#tab_copyInvoiceDetail").find("[alt=AccountBank]").append($("<option ></option>").attr("data-subtext", Info.accountCode).attr("value", Info.accountCode).text(Info.accountName));
        })
    }*/

    //分攤明細層--成本利潤中心
    if (data.DepartmentList) {
        $.each(data.DepartmentList, function (index, value) {
            $("#tab_copyInvoiceDetail").find("[alt=CostProfitCenter]").append($("<option></option>").attr("value", value.department).text(value.department + " " + value.description).data("text", value.description)
                  .data("isProductRequired", value.isProductRequired));
        })

        $("#tab_copyInvoiceDetail").find("[alt=CostProfitCenter]").selectpicker('refresh');
    }

    //分攤明細層--會計項子目
    if (data.CoaAccountList) {
        // fun_setSelectOption($("#tab_copyInvoiceDetail").find("[alt=AccountingItem]"), data.CoaAccountList, true)
        let pdDictionary = []
        $.each(data.CoaAccountList, function (key, value) {
            pdDictionary.push({ key: key, value: value })
        })

        _optionList.push({ key: 'AmortizationDetailAccountingItem', value: pdDictionary })
    }

    //分攤明細層--產品別
    if (data.ProductList) {
        $("#tab_copyInvoiceDetail").find("[alt=ProductKind]").prepend($("<option></option>").attr("value", "").text("請選擇"));
        fun_setSelectOption($("#tab_copyInvoiceDetail").find("[alt=ProductKind]"), data.ProductList, true)
    }

    //分攤明細層--產品明細
    if (data.ProductDetailList) {
        // fun_setSelectOption($("#tab_copyInvoiceDetail").find("[alt=ProductDetail]"), data.ProductDetailList, true)
        let pdDictionary = []
        $.each(data.ProductDetailList, function (key, value) {
            pdDictionary.push({ key: key, value: value })
        })

        _optionList.push({ key: 'AmortizationDetailProductDetail', value: pdDictionary })
    }

    ///營業稅
    //格式別
    if (data.VatInFormat) {
        fun_setSelectOption($("[JScontrolName=FormatKind]"), data.VatInFormat, true)
    }

    ///所得稅
    //所得代碼
    if (data.WtTax) {
        //fun_setSelectOption($("#IncomeCode"), data.WtTax, true)
        let IncomeCode = []
        IncomeCodeList = data.WtTax;
        $.each(data.WtTax, function (index, info) {
            IncomeCode.push({ key: info.wtTaxCode, value: info.wtTaxtCodeDescription })
        })

        _optionList.push({ key: 'IncomeCode', value: IncomeCode })

        if ($("#IncomeCodeCode").val()) {
            valuelist = $.map(data.WtTax, function (info, index) {
                if (info.wtTaxCode == $("#IncomeCodeCode").val()) {
                    return info.wtTaxtCodeDescription
                }
            })

            if (valuelist.length > 0) {
                $("#IncomeCodeName").val(valuelist[0])
                $("#IncomeCodeDisable").html(" <span>" + $("#IncomeCodeCode").val() + "-" + valuelist[0] + "</span>")
            }
        }
    }

    //執行業務別
    if (data.Wt9aPf) {
        fun_setSelectOption($("#ProfeesionalKind"), data.Wt9aPf, true)
    }

    //其他所得
    if (data.Wt92PayItem) {
        fun_setSelectOption($("#OtherIncomNum"), data.Wt92PayItem, true)
    }

    //稿費
    if (data.Wt9bExpenseType) {
        fun_setSelectOption($("#WriterIncomeNum"), data.Wt9bExpenseType, true)
    }
    //租稅協定
    if (data.Wt92TaxTreaty) {
        fun_setSelectOption($("#LeaseTaxCode"), data.Wt92TaxTreaty, true)
    }
    //國別代碼
    if (data.Territory) {
        // fun_setSelectOption($("#CountryCode"), data.Territory, true)
        let CountryCode = []
        $.each(data.Territory, function (key, value) {
            CountryCode.push({ key: key, value: value })
        })

        _optionList.push({ key: 'CountryCode', value: CountryCode })
    }
}

//設定Select預設值
function setDefaultSelect(target, value) {
    $(target).find("option[value='" + value + "']").attr("selected", "selected")
    $(target).selectpicker('refresh');

    // $(target).change()
}

//一般key/value option
function fun_setSelectOption(target, data, subtext) {
    if (target.length > 0) {
        if (subtext) {
            $.each(data, function (key, txt) {
                // $(target).append($("<option></option>").attr("data-subtext", key).attr("value", key).text(txt));
                $(target).append($("<option></option>").attr("value", key).text(key + " " + txt).data("text", txt));
            })
        }
        else {
            $.each(data, function (key, txt) {
                $(target).append($("<option></option>").attr("value", key).text(txt));
            })
        }
        $(target).selectpicker('refresh');
    }
}

//請款明細資料檢核
function fun_InvoiceDataConfirm() {
    $("#popInvoiceInfo").find("[Errmsg='Y']").remove()
    let rtn = true;
    //必填欄位判斷
    $("#popInvoiceInfo").find("[necessary]").each(function () {
        if ($(this).val() == null || $(this).val().trim().length < 1) {
            fun_AddErrMesg($(this), "Err" + $(this).attr("id"), "此為必填欄位")
            rtn = false;

            //若為折行顯示則展開
            if ($(this).closest("tr").is(":hidden")) {
                $(this).closest("tbody").find("tr").show()
            }
        }
    })
    //必填欄位判斷

    if ($("#EstimateVoucherDate").val().trim() != "") {
        EstimateVoucherDate = new Date($("#EstimateVoucherDate").val().trim())
        if (!isNaN(EstimateVoucherDate.getDate())) {
            Overdue = new Date();

            if (EstimateVoucherDate.valueOf() > Overdue.valueOf()) {
                fun_AddErrMesg($("#EstimateVoucherDate"), "ErrEstimateVoucherDate", "憑證日期大於目前日期")
                rtn = false
            }
        }
        else {
            fun_AddErrMesg($("#EstimateVoucherDate"), "ErrEstimateVoucherDate", "日期格式錯誤")
            rtn = false
        }
    }
    //金額欄位判斷
    Rate = 0;

    InvoiceOriginalAmount = 0;

    InvoiceOriginalTax = 0;
    AcceptanceAmount = 0;
    InvoiceTWDAmount = 0;
    InvoiceTWDTaxAmount = 0;
    InvoiceTWDSaleAmount = 0;

    Maxpay = fun_getMaxPay(popInvoiceInfo);

    //統編驗證
    {
        if ($("#TaxIdNum").val().length > 0) {
            TaxIdCheck = TaxIDCheck($("#TaxIdNum").val())
            if (!TaxIdCheck) {
                rtn = false;
                fun_AddErrMesg($("#TaxIdNum"), "ErrTaxIdNum", "內容或格式錯誤，請輸入8碼半形數字")
            }
        }
    }

    {
        if (isNaN($("#Rate").val()) || $("#Rate").val() <= 0) {
            fun_AddErrMesg($("#Rate"), "ErrRate", "匯率異常");
            rtn = false;
        }
        else {
            Rate = $("#Rate").val();
        }
        if (fun_onblurAction($("#InvoiceOriginalAmount"))) {
            InvoiceOriginalAmount = accounting.unformat($("#InvoiceOriginalAmount").val())
        }
        else {
            rtn = false;
        }
        if (!$("#InvoiceOriginalTax")[0].hasAttribute("readonly")) {
            if (fun_onblurAction($("#InvoiceOriginalTax"))) {
                InvoiceOriginalTax = accounting.unformat($("#InvoiceOriginalTax").val())
            }
            else {
                rtn = false;
            }
        }
        else {
            InvoiceOriginalTax = 0;
        }

        if (!isNaN(Rate) && Rate > 0 &&
           !isNaN(InvoiceOriginalAmount) && InvoiceOriginalAmount > 0 &&
           !isNaN(InvoiceOriginalTax) && InvoiceOriginalTax >= 0) {
            if (InvoiceOriginalAmount <= InvoiceOriginalTax) {
                fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrInvoiceOriginalAmount", "金額(原幣) 小於 稅額(原幣)");

                rtn = false;
            }
            else {
                AcceptanceAmount = InvoiceOriginalAmount - InvoiceOriginalTax;
                InvoiceTWDAmount = accounting.toFixed(InvoiceOriginalAmount * Rate, 0)
                InvoiceTWDTaxAmount = accounting.toFixed(InvoiceOriginalTax * Rate, 0)
                InvoiceTWDSaleAmount = InvoiceTWDAmount - InvoiceTWDTaxAmount

                //上限僅警示不檢核
                if (isNaN(MaxPay) || MaxPay < 0) {
                    fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrInvoiceOriginalAmount", "取得請款類別支付上限失敗");
                    // rtn = false;
                }
                else {
                    if ((MaxPay != 0) && (InvoiceTWDAmount > MaxPay)) {
                        fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrInvoiceOriginalAmount", "金額(臺幣)上限為 " + MaxPay + " 已超出金額上限");
                        //   rtn = false;
                    }
                }
            }
        }
        else {
            rtn = false;
        }
    }

    //分攤明細層試算
    {
        OriginalAmortizationAmountTotal = 0;
        OriginalAmortizationTWDAmountTotal = 0;

        if ($("#tab_InvoiceDetail tbody").not("[alt=no-data]").not("[alt=Delete]").length == 0) {
            fun_AddErrMesg($("#tab_InvoiceDetail"), "Errtab_InvoiceDetail", "至少需輸入一筆分攤明細項目");
            rtn = false;
        }
        else {
            $("#tab_InvoiceDetail tbody").not("[alt=no-data]").not("[alt=Delete]").each(function () {
                OriginalAmortizationAmount = accounting.unformat($(this).find("[alt=OriginalAmortizationAmount]").val());
                if (!isNaN(OriginalAmortizationAmount)) {
                    OriginalAmortizationTWDAmount = parseInt(accounting.toFixed(OriginalAmortizationAmount * Rate));

                    OriginalAmortizationAmountTotal += OriginalAmortizationAmount;
                    OriginalAmortizationTWDAmountTotal += OriginalAmortizationTWDAmount;

                    $(this).find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(OriginalAmortizationTWDAmount))
                }
            })

            if ($("#IsDeduction").text() == "Y") {
                maxAmount = AcceptanceAmount;
                maxAmountTWD = InvoiceTWDSaleAmount;
            }
            else {
                maxAmount = InvoiceOriginalAmount;
                maxAmountTWD = InvoiceTWDAmount;
            }

            if (!isNaN(OriginalAmortizationAmountTotal) && !isNaN(maxAmount)
                  && !isNaN(OriginalAmortizationTWDAmountTotal) && !isNaN(maxAmountTWD)) {
                if ((parseFloat(accounting.toFixed(maxAmount - OriginalAmortizationAmountTotal, 8))) != 0) {
                    alert("分攤明細金額加總不相符，自動重新試算末欄金額")
                }

                //避免小數點誤差，自動重新試算末欄金額
                lastAmount = accounting.unformat($("#tab_InvoiceDetail tbody ").not("[alt=no-data]").not("[alt=Delete]").last().find("[alt=OriginalAmortizationAmount]").val());
                lastAmount += parseFloat(accounting.toFixed(maxAmount - OriginalAmortizationAmountTotal, 8));

                $("#tab_InvoiceDetail tbody ").not("[alt=no-data]").not("[alt=Delete]").last().find("[alt=OriginalAmortizationAmount]").val(fun_accountingformatNumberdelzero(lastAmount))

                lastTWDAmount = accounting.unformat($("#tab_InvoiceDetail tbody ").not("[alt=no-data]").not("[alt=Delete]").last().find("[alt=OriginalAmortizationTWDAmount]").text());
                lastTWDAmount += parseFloat(accounting.toFixed(maxAmountTWD - OriginalAmortizationTWDAmountTotal));
                $("#tab_InvoiceDetail tbody ").not("[alt=no-data]").not("[alt=Delete]").last().find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(lastTWDAmount))

                //改完內容後在驗證一次
                if (!fun_onblurAction($("#tab_InvoiceDetail tbody ").not("[alt=no-data]").not("[alt=Delete]").last().find("[alt=OriginalAmortizationAmount]"))) {
                    rtn = false;
                }
            }
            else {
                rtn = false;
                fun_AddErrMesg($("#tab_InvoiceDetail"), "Errtab_InvoiceDetail", "分攤明細金額試算有誤");
            }
        }
    }
    //分攤明細層試算

    //檢核憑證號碼是否重複
    {
        CertificateNum = $("#CertificateNum").val().trim()

        //發票號碼驗證 兩碼英文+8碼數字 OR 十碼英文 *僅檢察憑證類別為發票時
        {
            if ($("#CertificateKind").val() == 1 && $("#CertificateNum").val().length > 0) {
                reg = /^([A-z]){2}[0-9A-z]{8}$/

                if (String($("#CertificateNum").val()).search(reg) != 0) {
                    rtn = false;
                    fun_AddErrMesg($("#CertificateNum"), "ErrCertificateNum", "發票號碼為兩碼英文+八碼英數字(皆為半型)")
                }
            }
        }

        ExpenseKind = $("#ExpenseKind").val()
        EstimateVoucherDate = new Date($("#EstimateVoucherDate").val())
        InvoiceTWDAmount = accounting.unformat($("#InvoiceTWDAmount").text());
        totalUsePay = InvoiceTWDAmount;
        hasCertificateNum = false

        $("#tab_Invoice tbody").not("[EditMark]").not("[alt=no-data]").not("[alt=Delete]").each(function () {
            JsonData = $(this).find("[name=InvoiceJsonData]").val();

            if (JsonData != null) {
                try {
                    InvoiceData = JSON.parse(JsonData);

                    ///20180704 同張單不檢核
                    /* if (!hasCertificateNum && CertificateNum.length > 0 && InvoiceData.CertificateNum == CertificateNum) {
                         hasCertificateNum = true;
                     }*/

                    if (InvoiceData.PaymentMidCategory == popInvoiceInfo.PaymentMidCategory && $("#EstimateVoucherDate").val() == InvoiceData.strEstimateVoucherDate) {
                        totalUsePay += accounting.unformat(InvoiceData.TWDAmount);
                    }
                }
                catch (e) {
                }
            }
        })

        if (hasCertificateNum) {
            fun_AddErrMesg($("#CertificateNum"), "ErrCertificateNum", "發票號碼重覆，不得重覆請款")
            rtn = false;
        }
        else {
            if (CertificateNum.length > 0) {
                UsedCertificateNum = null;
                $(this)._ajax("/EMP/GetCertificateNumUsed", { CertificateNum: CertificateNum, FormID: $("#FormID").val() },
                function (data) {
                    Ajaxrtn = {
                        true: ""
                    }

                    switch (data) {
                        case 0:
                            __UsedCertificateNum = false;
                            break;

                        case 1:
                            __UsedCertificateNum = true;
                            break;

                        default:
                            Ajaxrtn = {
                                false: "檢核憑證號碼失敗"
                            }
                            break;
                    }

                    return Ajaxrtn;
                }, "檢核憑證號碼失敗")

                if (__UsedCertificateNum != null) {
                    if (__UsedCertificateNum) {
                        fun_AddErrMesg($("#CertificateNum"), "ErrCertificateNum", "發票號碼重覆，不得重覆請款")
                        rtn = false;
                    }
                }
                else {
                    rtn = false;
                }
            }
        }
    }
    //檢核憑證號碼是否重複

    // 計算合計是否超出日支額 *僅處理有支出上限的請款種類 ***警示不卡控
    {
        if (MaxPay > 0 && !(isNaN(EstimateVoucherDate.getDate()))) {
            __UsedPay = -1;
            $(this)._ajax("/EMP/GetPaymentMidUseAmount", { EMPNum: $("#VendorNum").val(), EstimateVoucherDate: $("#EstimateVoucherDate").val(), PaymentMidCategory: popInvoiceInfo.PaymentMidCategory, FormID: $("#FormID").val() },
             function (data) {
                 Ajaxrtn = {
                     true: ""
                 }

                 if (data >= 0) {
                     __UsedPay = data
                 }
                 else {
                     __UsedPay = -1;
                     Ajaxrtn = {
                         false: "取得已使用憑證金額失敗",
                     }
                 }
                 return Ajaxrtn;
             }, "取得已使用憑證金額失敗")

            if (__UsedPay < 0) {
                // rtn = false;
            }
            else {
                if (MaxPay - __UsedPay - totalUsePay < 0) {
                    alert("憑證日期" + funAddheadZero(2, (EstimateVoucherDate.getMonth() + 1)) + "月" + funAddheadZero(2, (EstimateVoucherDate.getDate())) + "日，" + $("#PaymentMidCategory option:selected").text() + "日支加總為" + (__UsedPay + totalUsePay) + "元，已超過日支上限" + ((MaxPay - __UsedPay - totalUsePay) * -1) + "元")
                    // rtn = false
                }
            }
        }
    }
    // 計算合計是否超出日支額 *僅處理有支出上限的請款種類

    console.log(rtn)
    return rtn
}

//請款明細資料帶入主頁面
function fun_InvoiceDataPutIn(Data) {
    if (Data != null) {
        //表單資料帶回主頁面
        {
            $("[alt=ErrCertificateAmount]").remove();
            $("#tab_Invoice tbody[alt=no-data]").remove();

            if (InvoiceObj == null) {
                InvoiceObj = $("#tab_copyInvoice tbody").clone();

                $(InvoiceObj).find("td").eq(0).text(funAddheadZero(4, $("#tab_Invoice tbody").not("[alt=no-data]").not("[alt=Delete]").length + 1))
                $("#tab_Invoice").append(InvoiceObj);
                $(InvoiceObj).attr("EditMark", "")

                $(InvoiceObj).mouseenter(function () {
                    $(this).find("[alt=removeInvoice]").show();
                })
                $(InvoiceObj).mouseleave(function () {
                    $(this).find("[alt=removeInvoice]").hide();
                })

                $(InvoiceObj).find("[alt=popInvoiceInfo]").on("click", function () {
                    $(this).closest("table").find("tbody").attr("EditMark", "")
                    $(this).closest("tbody").attr("EditMark", "Y")
                    fun_popInvoiceInfo($(this).closest("tbody"), true);
                })

                $(InvoiceObj).find("[alt=removeInvoice]").on("click", function () {
                    if (confirm("是否確認刪除該筆資料")) {
                        if ($(this).closest("tbody").find("[name=LineNum]").val() <= 0) {
                            $(this).closest("tbody").remove()
                        }
                        else {
                            $(this).closest("tbody").hide()
                            $(this).closest("tbody").attr("alt", "Delete")
                            $(this).closest("tbody").find("[alt=Index]").attr("alt", "Delete")
                            $(this).closest("tbody").find("[name=InvoiceJsonData]").val($(this).closest("tr").find("[name=InvoiceJsonData]").val().replace("\"IsDelete\":false", "\"IsDelete\":true"))
                        }
                        if ($("#tab_Invoice tbody").find("[alt=Index]").length == 0) {
                            $("#tab_Invoice tbody[alt=no-data]").show()
                        }
                        else {
                            fun_resetCellIndex($("#tab_Invoice"), "Index", 4)
                        }
                        //重算主表金額
                        ReCalculate()
                    }
                })
            }
            Data.EstimateVoucherDate = Data.strEstimateVoucherDate;//避免轉換上的時區誤差 直接改成文字日期格式

            $(InvoiceObj).find("[name=InvoiceJsonData]").val(JSON.stringify(Data));

            $(InvoiceObj).find("[name=LineNum]").val(Data.LineNum)
            $(InvoiceObj).find("td").eq(1).text(Data.TaxIdNum)
            $(InvoiceObj).find("td").eq(2).text(Data.VendorName)
            $(InvoiceObj).find("td").eq(3).text(Data.CertificateNum)
            $(InvoiceObj).find("td").eq(4).text(Data.PaymentCategoryName)
            $(InvoiceObj).find("td").eq(5).text(Data.CurrencyName)
            $(InvoiceObj).find("td").eq(6).text(fun_accountingformatNumberdelzero(Data.OriginalAmount))
            if (Data.ExpenseDesc) {
                $(InvoiceObj).find("td").eq(7).text(Data.ExpenseDesc)
            }
            else {
                $(InvoiceObj).find("td").eq(7).text("")
            }

            //主表金額重新計算
            {
                //減舊加新
                if (popInvoiceInfo) {
                    OriginalAmount = accounting.unformat($("#OriginalAmount").text())
                    OriginalAmount -= popInvoiceInfo.OriginalAmount
                    OriginalAmount += Data.OriginalAmount
                    $("#OriginalAmount").text(fun_accountingformatNumberdelzero(OriginalAmount))
                    $("#CertificateAmount").text($("#OriginalAmount").text())

                    TWDAmount = accounting.unformat($("#TWDAmount").text())
                    TWDAmount -= popInvoiceInfo.TWDAmount
                    TWDAmount += Data.TWDAmount
                    $("#TWDAmount").text(fun_accountingformatNumberdelzero(TWDAmount))

                    TWDTaxAmount = accounting.unformat($("#TWDTaxAmount").text())
                    TWDTaxAmount -= popInvoiceInfo.TWDTaxAmount
                    TWDTaxAmount += Data.TWDTaxAmount
                    $("#TWDTaxAmount").text(fun_accountingformatNumberdelzero(TWDTaxAmount))
                    $("#PaymentAmount").text($("#TWDAmount").text())
                }
            }

            if ($("#ExpenseKind").val() == "EMP_MGR_EXP") {
                //交通津貼重算
                fun_TransportationReCalculate()
            }
            //營業稅重算 *明細有修改再動作
            {
                if (popInvoiceInfo) {
                    fun_BussinessTaxReCalculate(popInvoiceInfo.TaxIdNum, popInvoiceInfo.CertificateNum, popInvoiceInfo.strEstimateVoucherDate, popInvoiceInfo.IsDeduction)//修改的新資料

                    if (Data) {
                        fun_BussinessTaxReCalculate(Data.TaxIdNum, Data.CertificateNum, Data.strEstimateVoucherDate, Data.IsDeduction)//修改前的舊資料
                    }
                }
            }
        }
        //表單資料帶回主頁面
    }
}

//建立/載入請款明細
function fun_popInvoiceInfo(target, show) {
    //還原預設值
    {
        $("#tab_InvoiceDetail").find(".list-close-icon").removeClass(".list-close-icon", false).addClass("list-open-icon")
        $('#popInvoiceInfo [Errmsg=Y]').remove()

        $("#City").hide()

        $("#Station").hide()

        $("#divInvoiceOverDue").hide();

        $("#divYearVoucher").hide()

        $("#popInvoiceInfo").find("[alt=Edit]").each(function (i, o) {
            $(o).find("input").val("")
            $(o).find("span").not(".input-group-addon").text("")
        })

        $("#tab_InvoiceDetail tbody").not("[alt=no-data]").remove();//移除分攤項次的內文資料
        $("#tab_InvoiceDetail tbody[alt=no-data]").show();

        $("#tab_InvoiceDetail").find(".list-open-icon")
    }
    //還原預設值

    if ($(target).find("[name=InvoiceJsonData]").val() == null) {
    }
    else {//載入
        InvoiceObj = $(target);
        InvoiceData = JSON.parse($(target).find("[name=InvoiceJsonData]").val());
        popInvoiceInfo = InvoiceData;

        $("#LineNum").val(InvoiceData.LineNum);
        $("#PaymentCategory").text(InvoiceData.PaymentCategoryName);
        $("#PaymentMidCategory").text(InvoiceData.PaymentMidCategoryName);
        $("#ExpenseAttribute").text(InvoiceData.ExpenseAttributeName);

        $("#default_AccountingCode")._ajax("/EMP/GetExpenseStandard", { MaxItemNo: InvoiceData.PaymentCategory, MidItemNo: InvoiceData.PaymentMidCategory },
           function (data) {
               var rtn = {
                   true: ""
               }
               if (data.IsSuccess) {
                   $(data.Detail).each(function (index, info) {
                       if (info.ExpenseKind == InvoiceData.ExpenseAttribute) {
                           $("#default_AccountingCode").val(info.AccountingCode)
                           $("#default_AccountingName").val(info.AccountingName)
                       }
                   })
               }
               else {
                   rtn = {
                       false: data.Message
                   }
               }
           }, "獲取預設會計項子目失敗")

        if (InvoiceData.ExpenseDesc) {
            $("#InvoiceExpenseDesc").text(InvoiceData.ExpenseDesc);
        }
        else {
            InvoiceData.ExpenseDesc = InvoiceData.PaymentMidCategoryName;
            $("#InvoiceExpenseDesc").text(InvoiceData.PaymentMidCategoryName);
        }

        $("span#CertificateKind").text(InvoiceData.CertificateKindName);
        $("span#TaxIdNum").text(InvoiceData.TaxIdNum);
        $("span#VendorName").text(InvoiceData.VendorName);
        $("span#CertificateNum").text(InvoiceData.CertificateNum);
        $("span#EstimateVoucherDate").text(InvoiceData.strEstimateVoucherDate);
        $("span#Currency").text(InvoiceData.CurrencyName);
        $("span#Rate").text(fun_accountingformatNumberdelzero(InvoiceData.Rate));
        $("span#InvoiceOriginalAmount").text(fun_accountingformatNumberdelzero(InvoiceData.OriginalAmount));
        $("span#InvoiceOriginalTax").text(fun_accountingformatNumberdelzero(InvoiceData.OriginalTax));

        if (InvoiceData.NeedCertificate) {
            $("#NeedCertificate").text("Y");
        }
        else {
            $("#NeedCertificate").text("N");
        }
        $("#InvoiceOverDue").val(InvoiceData.InvoiceOverDue);
        $("#YearVoucher").val(InvoiceData.YearVoucher);
        $("#NoEditYearVoucher").text(InvoiceData.InvoiceOverDue);
        $("#NoEditInvoiceOverDue").text(InvoiceData.YearVoucher);

        $("#AcceptanceAmount").text(fun_accountingformatNumberdelzero(InvoiceData.AcceptanceAmount));

        $("#InvoiceTWDSaleAmount").text(fun_accountingformatNumberdelzero(InvoiceData.TWDSaleAmount));
        $("#InvoiceTWDAmount").text(fun_accountingformatNumberdelzero(InvoiceData.TWDAmount));
        $("#InvoiceTWDTaxAmount").text(fun_accountingformatNumberdelzero(InvoiceData.TWDTaxAmount));

        if (InvoiceData.StartStationName) $("#Station").show()
        $("#StartStationCode").text(InvoiceData.StartStationName);
        $("#EndStationCode").text(InvoiceData.EndStationName);

        if (InvoiceData.StartCityName) $("#City").show()
        $("#StartCityCode").text(InvoiceData.StartCityName);
        $("#EndCityCode").text(InvoiceData.EndCityName);

        $("#ProjectCategory").text(InvoiceData.ProjectCategoryName);
        $("#Project").text(InvoiceData.ProjectName);
        $("#ProjectItem").text(InvoiceData.ProjectItemName);

        if (InvoiceData.YearVoucher) {
            $("#divYearVoucher").show();
        }
        if (InvoiceData.InvoiceOverDue) {
            $("#divInvoiceOverDue").show();
        }

        if (InvoiceData.VoucherMemo) {
            $("#VoucherMemo").val(InvoiceData.VoucherMemo);
        }
        else {
            $("#VoucherMemo").val(InvoiceData.ExpenseDesc);
        }
        $("#NoEditVoucherMemo").text(InvoiceData.VoucherMemo);

        $("#IsDeduction").text(InvoiceData.IsDeduction);
        $("#CurrencyPrecise").text(InvoiceData.CurrencyPrecise);

        $("#Rate").attr("accuracy", InvoiceData.CurrencyPrecise);
        $("#InvoiceOriginalAmount").attr("accuracy", InvoiceData.CurrencyPrecise);

        //會計經辦用
        $("select#CertificateKind").val(InvoiceData.CertificateKind).selectpicker("refresh");
        $("select#CertificateKind").change()
        $("input#TaxIdNum").val(InvoiceData.TaxIdNum);
        $("input#VendorName").val(InvoiceData.VendorName);
        $("input#CertificateNum").val(InvoiceData.CertificateNum);
        $("input#EstimateVoucherDate").val(InvoiceData.strEstimateVoucherDate);
        $("select#Currency").val(InvoiceData.Currency).selectpicker("refresh");

        if ($("select#Currency") == "TWD") {
            $("input#Rate").hide()
            $("#NoEditExchangeRate").show()
        }
        else {
            $("input#Rate").show()
            $("#NoEditExchangeRate").hide()
        }

        $("input#Rate").val(fun_accountingformatNumberdelzero(InvoiceData.Rate));
        $("#NoEditExchangeRate span").text(fun_accountingformatNumberdelzero(InvoiceData.Rate));
        $("#NoEditInvoiceOriginalTax span").text(fun_accountingformatNumberdelzero(InvoiceData.InvoiceOriginalTax));

        $("input#InvoiceOriginalAmount").val(fun_accountingformatNumberdelzero(InvoiceData.OriginalAmount));
        $("input#InvoiceOriginalTax").val(fun_accountingformatNumberdelzero(InvoiceData.OriginalTax));
        if (InvoiceData.Currency == "TWD") {
            $("input#Rate").hide();
            $("#NoEditExchangeRate").show();
        }

        //會計經辦用

        // 計算合計是否超出日支額 *僅處理有支出上限的請款種類 ***警示不卡控
        {
            MaxPay = fun_getMaxPay(InvoiceData)
            if (MaxPay > 0) {
                if (InvoiceData.TWDAmount > MaxPay) {
                    fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrInvoiceOriginalAmount", " 金額(臺幣)上限為 " + MaxPay + " 已超出金額上限")
                }
                else {
                    _EstimateVoucherDate = new Date(InvoiceData.strEstimateVoucherDate)
                    if (MaxPay > 0 && !(isNaN(_EstimateVoucherDate.getDate()))) {
                        totalUsePay = 0;

                        $("#tab_Invoice tbody").not("[alt=no-data]").each(function () {
                            JsonData = $(this).find("[name=InvoiceJsonData]").val();

                            if (JsonData != null) {
                                try {
                                    _obj = JSON.parse(JsonData);

                                    if (_obj.PaymentMidCategory == InvoiceData.PaymentMidCategory && _obj.strEstimateVoucherDate == InvoiceData.strEstimateVoucherDate) {
                                        totalUsePay += _obj.TWDAmount;
                                    }
                                }
                                catch (e) {
                                }
                            }
                        })

                        __UsedPay = -1;
                        $(this)._ajax("/EMP/GetPaymentMidUseAmount", { EMPNum: __EMPNum, EstimateVoucherDate: InvoiceData.strEstimateVoucherDate, PaymentMidCategory: InvoiceData.PaymentMidCategory, FormID: $("#FormID").val() },
                         function (data) {
                             if (data >= 0) {
                                 __UsedPay = data
                             }
                         }, "取得已使用憑證金額失敗")

                        if (__UsedPay < 0) {
                            // rtn = false;
                        }
                        else {
                            if (MaxPay - __UsedPay - totalUsePay < 0) {
                                fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrInvoiceOriginalAmount", "憑證日期" + funAddheadZero(2, (_EstimateVoucherDate.getMonth() + 1)) + "月" + funAddheadZero(2, (_EstimateVoucherDate.getDate())) + "日，" + InvoiceData.PaymentMidCategoryName + "日支加總為" + (totalUsePay + __UsedPay) + "元，已超過日支上限" + ((MaxPay - __UsedPay - totalUsePay) * -1) + "元")

                                // rtn = false
                            }
                        }
                    }
                }
            }
        }
        // 出差計算合計是否超出日支額 *僅處理有支出上限的請款種類

        if (InvoiceData.AmortizationDetailList.length > 0) {
            $(InvoiceData.AmortizationDetailList).each(function () {
                tmp = $("#tab_copyInvoiceDetail tbody").clone();

                $(tmp).find("[alt=AccountBankName]").text(this.AccountBank + " " + this.AccountBankName)
                $(tmp).find("[alt=AccountBank]").val(this.AccountBank)

                $(tmp).find("[alt=CostProfitCenterName]").text(this.CostProfitCenter + " " + this.CostProfitCenterName)
                $(tmp).find("[alt=CostProfitCenter]").val(this.CostProfitCenter)

                $(tmp).find("[alt=AccountingItemName]").text(this.AccountingItem + " " + this.AccountingItemName)

                $(tmp).find("[alt=ProductKindName]").text(this.ProductKind + " " + this.ProductKindName)
                $(tmp).find("[alt=ExpenseAttributeName]").text(this.ExpenseAttribute + " " + this.ExpenseAttributeName)

                //$(tmp).find("[alt=AccountingItem]").val(this.AccountingItem)
                $(tmp).find("[alt=ProductKind]").val(this.ProductKind)
                // $(tmp).find("[alt=ProductDetail]").val(this.ProductDetail)
                $(tmp).find("[alt=ExpenseAttribute]").val(this.ExpenseAttribute)

                $(tmp).find("[name=AccountingItemCode]").val(this.AccountingItem)
                $(tmp).find("[name=AccountingItemName]").val(this.AccountingItemName)
                $(tmp).find("[name=AccountingItem]").text(this.AccountingItem + " " + this.AccountingItemName).removeClass("undone-text")

                if (this.ProductDetail) {
                    $(tmp).find("[alt=ProductDetailName]").text(this.ProductDetail + " " + this.ProductDetailName)

                    $(tmp).find("[name=ProductDetailCode]").val(this.ProductDetail)
                    $(tmp).find("[name=ProductDetailName]").val(this.ProductDetailName)
                    $(tmp).find("[name=ProductDetail]").text(this.ProductDetail + " " + this.ProductDetailName).removeClass("undone-text")
                }

                option = $("#tab_copyInvoiceDetail").find("[alt=CostProfitCenter]").find("option[value='" + this.CostProfitCenter + "']")

                if (option.data("isProductRequired") == "Y") {
                    $(tmp).find("[alt=ProductKind]").attr("necessary", "")
                }
                else {
                    $(tmp).find("[alt=ProductKind]").removeAttr("necessary")
                }

                $(tmp).find("[alt=OriginalAmortizationAmount]").text(fun_accountingformatNumberdelzero(this.OriginalAmortizationAmount))
                $(tmp).find("[alt=OriginalAmortizationAmount]").val(fun_accountingformatNumberdelzero(this.OriginalAmortizationAmount))
                $(tmp).find("[alt=OriginalAmortizationAmount]").attr("accuracy", InvoiceData.CurrencyPrecise)
                $(tmp).find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(this.OriginalAmortizationTWDAmount))
                $(tmp).find("[alt=OriginalAmortizationAmount]").on("focus", function () {
                    fun_onfocusAction(this);
                })
                $(tmp).find("[alt=OriginalAmortizationAmount]").on("blur", function () {
                    if (fun_onblurAction(this)) {
                        OriginalAmortizationAmount = accounting.unformat($(this).val());
                        Rate = accounting.unformat($("#Rate").val());
                        if (!isNaN(OriginalAmortizationAmount) && !isNaN(Rate))

                            $(this).closest("tr").find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(accounting.toFixed(OriginalAmortizationAmount * Rate)))
                    }
                })
                $(tmp).find("[alt=ADetailID]").val(this.ADetailID)
                $(tmp).find("[alt=IsDelete]").val(this.IsDelete)

                if (this.IsDelete == "true") {
                    $(tmp).hide()
                    $(tmp).attr("alt", "Delete")
                    $(tmp).find("[alt=Index]").attr("alt", "Delete")
                }

                $(tmp).find("input").on("focus", function () {
                    $(this).nextAll("[Errmsg=Y]").remove();
                })
                $(tmp).find("select").on("change", function () {
                    $(this).nextAll("[Errmsg=Y]").remove();
                })

                $(tmp).mouseenter(function () {
                    $(this).find("[alt=removesubInvoiceInfo]").show();
                })
                $(tmp).mouseleave(function () {
                    $(this).find("[alt=removesubInvoiceInfo]").hide();
                })

                $(tmp).find("[alt=removesubInvoiceInfo]").on("click", function () {
                    if (confirm("是否確認刪除該筆資料")) {
                        tbody = $(this).closest("tbody");

                        if (tbody.find("[alt=ADetailID]").val() <= 0) {
                            tbody.remove()
                        }
                        else {
                            tbody.hide()
                            tbody.find("[alt=Index]").attr("alt", "Delete")
                            tbody.attr("alt", "Delete")
                            tbody.find("[alt=IsDelete]").val(true)
                        }

                        if ($("#tab_InvoiceDetail tbody").not("[alt=no-data]").not("[alt=Delete]").length > 0) {
                            fun_resetCellIndex($("#tab_InvoiceDetail"), "Index", 4);
                        }
                        else {
                            $("#tab_InvoiceDetail tbody[alt=no-data]").show();
                        }
                    }
                })//註冊刪除請款明細分攤層action

                $("#tab_InvoiceDetail").append(tmp);
            })

            //selectpicker clone會無法作用 必須移除後再重新渲染 反應會延遲
            $("#tab_InvoiceDetail tbody").find('.selectpicker').data('selectpicker', null);
            $("#tab_InvoiceDetail tbody").find('.bootstrap-select').find("button:first").remove();
            $("#tab_InvoiceDetail tbody").find(".selectpicker").selectpicker("render")

            //selectpicker clone會無法作用 必須移除後再重新渲染

            if ($("#tab_InvoiceDetail tbody").not("[alt=no-data]").not("[alt=Delete]").length > 0) {
                $("#tab_InvoiceDetail tbody[alt=no-data]").hide()
            }
        }
        $("span").each(function () { if ($(this).text() == "null") { $(this).text("") } })
    }

    if (show) {
        //addcase01 側邊滑欄動畫//
        $('.popup-left-addcase').show(0);
        $('.popup-overlay').fadeIn(0);
        $('.popup-box').animate({ right: "0px" }, 300);
        $("html, body").css("overflow", "hidden");
        //addcase01 側邊滑欄動畫//

        //設AUTO 會被重繪的selectpicker壓在下面
        $('.popup-box').css("z-index", "502")
        $('.popup-overlay').css("z-index", "500")

        //因為可能會跳Alert 所以放最後
        $("#EstimateVoucherDate").blur();//強制觸發blur動作
    }
}

//請款明細資料暫存
function fun_InvoiceDatakeep() {
    InvoiceData = JSON.parse($("#tab_Invoice").find("tbody[EditMark=Y]").find("[name=InvoiceJsonData]").val());

    InvoiceData.VoucherMemo = $("#VoucherMemo").val()
    InvoiceData.YearVoucher = $("#YearVoucher").val()

    InvoiceData.CertificateKind = $("#CertificateKind").val()
    InvoiceData.CertificateKindName = $("#CertificateKind option[selected=selected]").text()
    InvoiceData.CertificateNum = $("#CertificateNum").val()
    InvoiceData.VendorName = $("#VendorName").val()
    InvoiceData.TaxIdNum = $("#TaxIdNum").val()
    InvoiceData.EstimateVoucherDate = $("#EstimateVoucherDate").val()
    InvoiceData.strEstimateVoucherDate = $("#EstimateVoucherDate").val()
    InvoiceData.Currency = $("#Currency").val()
    //InvoiceData.CurrencyName = $("#Currency option[selected=selected]").text()
    InvoiceData.CurrencyName = $("#Currency option[value='" + $("#Currency").val() + "']").data("text") //*避免幣別被disable時取不到值

    InvoiceData.Rate = accounting.unformat($("#Rate").val())
    InvoiceData.CurrencyPrecise = $("#CurrencyPrecise").text()
    InvoiceData.OriginalAmount = accounting.unformat($("#InvoiceOriginalAmount").val())
    InvoiceData.OriginalTax = accounting.unformat($("#InvoiceOriginalTax").val())
    InvoiceData.AcceptanceAmount = accounting.unformat(InvoiceData.OriginalAmount - InvoiceData.OriginalTax)
    InvoiceData.TWDAmount = accounting.unformat($("#InvoiceTWDAmount").text())
    InvoiceData.TWDTaxAmount = accounting.unformat($("#InvoiceTWDTaxAmount").text())
    InvoiceData.TWDSaleAmount = accounting.unformat(InvoiceData.TWDAmount - InvoiceData.TWDTaxAmount)

    InvoiceData.AmortizationDetailList = [];

    $("#tab_InvoiceDetail tbody").not("[alt=no-data]").each(function () {
        obj = {
            ADetailID: $(this).find("[alt=ADetailID]").val(),
            AccountBank: $(this).find("[alt=AccountBank]").val(),
            AccountBankName: $("#tab_copyInvoiceDetail").find("[alt=AccountBank]").find("option[value=" + $(this).find("[alt=AccountBank]").val() + "]").data("text"),
            CostProfitCenter: $(this).find("[alt=CostProfitCenter]").val(),
            CostProfitCenterName: $("#tab_copyInvoiceDetail").find("[alt=CostProfitCenter]").find("option[value=" + $(this).find("[alt=CostProfitCenter]").val() + "]").data("text"),
            AccountingItem: $(this).find("#AmortizationDetailAccountingItemCode").val(),
            AccountingItemName: $(this).find("#AmortizationDetailAccountingItemName").val(),
            OriginalAmortizationAmount: accounting.unformat($(this).find("[alt=OriginalAmortizationAmount]").val()),
            OriginalAmortizationTWDAmount: accounting.unformat($(this).find("[alt=OriginalAmortizationTWDAmount]").text()),
            IsDelete: $(this).find("[alt=IsDelete]").val(),
            ProductKind: $(this).find("[alt=ProductKind]").val(),
            ProductKindName: "",
            ProductDetail: $(this).find("#AmortizationDetailProductDetailCode").val(),
            ProductDetailName: $(this).find("#AmortizationDetailProductDetailName").val(),
            ExpenseAttribute: $(this).find("[alt=ExpenseAttribute]").val(),
            ExpenseAttributeName: ""
        }

        if (obj.ProductKind) {
            obj.ProductKindName = $("#tab_copyInvoiceDetail").find("[alt=ProductKind]").find("option[value=" + obj.ProductKind + "]").data("text")
        }

        if (obj.ExpenseAttribute) {
            obj.ExpenseAttributeName = $("#tab_copyInvoiceDetail").find("[alt=ExpenseAttribute]").find("option[value=" + obj.ExpenseAttribute + "]").data("text")
        }
        else {
            obj.ExpenseAttribute = "";
        }

        InvoiceData.AmortizationDetailList.push(obj)
    })

    /*
    $(InvoiceData.AmortizationDetailList).each(function () {
        obj = $("#tab_InvoiceDetail").find("[alt=ADetailID][value=" + this.ADetailID + "]").closest("tbody")

        this.AccountBank = obj.find("[alt=AccountBank]").val()
        if (this.AccountBank != "") {
            this.AccountBankName = obj.find("[alt=AccountBank]").find("option:selected").text()
        }
        else {
            this.AccountBankName = "";
        }

        this.CostProfitCenter = obj.find("[alt=CostProfitCenter]").val()
        if (this.CostProfitCenter != "") {
            this.CostProfitCenterName = obj.find("[alt=CostProfitCenter]").find("option:selected").text()
        }
        else {
            this.CostProfitCenterName = "";
        }

        this.AccountingItem = obj.find("[name=AccountingItemCode]").val()
        this.AccountingItemName = obj.find("[name=AccountingItemName]").val()

        this.OriginalAmortizationAmount = accounting.unformat(obj.find("[alt=OriginalAmortizationAmount]").val())
        this.OriginalAmortizationTWDAmount = accounting.unformat(obj.find("[alt=OriginalAmortizationTWDAmount]").val())

        this.ProductKind = obj.find("[alt=ProductKind]").val()
        if (this.ProductKind != "") {
            this.ProductKindName = obj.find("[alt=ProductKind]").find("option:selected").text()
        }
        else {
            this.ProductKindName = "";
        }

        this.ProductDetail = obj.find("[name=ProductDetailCode]").val()
        if (this.ProductDetail != "") {
            this.ProductDetailName = obj.find("[name=ProductDetailName]").val()
        }
        else {
            this.ProductDetailName = "";
        }

        this.ExpenseAttribute = obj.find("[alt=ExpenseAttribute]").val()
        if (this.ExpenseAttribute != "") {
            this.ExpenseAttributeName = obj.find("[alt=ExpenseAttribute]").find("option:selected").text()
        }
        else {
            this.ExpenseAttributeName = "";
        }
    })
    */
    $("#tab_Invoice").find("tbody[EditMark=Y]").find("[name=InvoiceJsonData]").val(JSON.stringify(InvoiceData))

    return InvoiceData
}

//所得稅代碼更換動作
function fun_IncomeCodeChuang(val) {
    $("#div_Incometax").find("[alt=accounting-stage-field]").find("[errmsg=Y]").remove()

    $("#ProfeesionalKind").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').val("").selectpicker('refresh');
    $("#WriterIncomeNum").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').val("").selectpicker('refresh');
    $("#OtherIncomNum").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').val("").selectpicker('refresh');
    $("#LeaseTaxCode").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').val("").selectpicker('refresh');

    $("#LeaseCode").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').val("").selectpicker('refresh');
    $("#CountryCode").hide();
    $("#CountryCodeDisable").html("<span class=\"undone-text\"></span>")
    $("#CountryCodeCode").val("")
    $("#LeaseTax").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).addClass("input-disable").val("")
    $("#LeaseAddress").attr("readonly", "").removeAttr("necessary", "").prop('disabled', true).addClass("input-disable").val("")

    formatCode = $(IncomeCodeList).map(function (index, info) {
        if (info.wtTaxCode == val)
            return info.formatCode
    })

    if (formatCode.length > 0) {
        switch (formatCode[0]) {
            case "9A":
                $("#ProfeesionalKind").removeAttr("readonly", "").attr("necessary", "").prop('disabled', false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker('refresh');

                break;
            case "9B":
                $("#WriterIncomeNum").removeAttr("readonly", "").attr("necessary", "").prop('disabled', false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker('refresh');
                break;
            case "92":
                $("#OtherIncomNum").removeAttr("readonly", "").attr("necessary", "").prop('disabled', false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker('refresh');
                break;
            case "53":
                if ($("#CertficateKindTag").val() == "2") {
                    $("#LeaseTaxCode").removeAttr("readonly", "").attr("necessary", "").prop('disabled', false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker('refresh');
                    $("#CountryCodeDisable").html("<span class=\"undone-text\">點選按鈕新增</span>")
                    $("#CountryCode").show();
                }
                break;

            case "51":
            case "51L":
                $("#LeaseTax").removeAttr("readonly", "").attr("necessary", "").prop('disabled', false).removeClass("input-disable");
                $("#LeaseAddress").removeAttr("readonly", "").attr("necessary", "").prop('disabled', false).removeClass("input-disable");;

                break;
        }
    }
}

//交通津貼用請款明細
function fun_TransDetailPutIn(Data) {
    if (Data != null) {
        //表單資料帶回主頁面
        {
            $("#tab_TrnasInvoiceDetail tr[alt=no-data]").remove();

            tr = document.createElement("tr")

            $(tr).append("<td>" + funAddheadZero(4, $("#tab_TrnasInvoiceDetail tr").length) + "</td>");
            $(tr).append("<td>" + Data.PaymentCategoryName + "</td>");
            $(tr).append("<td>" + Data.PaymentMidCategoryName + "</td>");
            $(tr).append("<td>" + Data.StartStationName + "</td>");
            $(tr).append("<td>" + Data.EndStationName + "</td>");
            $(tr).append("<td>" + Data.OriginalAmount + "</td>");

            $("#tab_TrnasInvoiceDetail").append(tr)
        }
        //表單資料帶回主頁面
    }
}

//交通津貼計算
function fun_TransportationReCalculate() {
    if ($("#table_Transportation").length > 0) {
        EMPTransportationMaxPay = accounting.unformat($("#TransportationMaxPay").text())

        if (EMPTransportationMaxPay > 0) {
            let OriginalAmount = 0

            $("#tab_Invoice tbody tr").each(function () {
                OriginalAmount += accounting.unformat($(this).find("td").eq(6).text())
            })

            if (!isNaN(OriginalAmount) && OriginalAmount >= 0) {
                if (OriginalAmount > EMPTransportationMaxPay) {
                    lostPay = 0;
                }
                else {
                    lostPay = EMPTransportationMaxPay - OriginalAmount;
                }

                cost = Math.ceil(lostPay * 0.05)//無條件進位
                target = $("#table_Transportation tbody");
                $(target).find("td").eq(0).text(fun_accountingformatNumberdelzero(EMPTransportationMaxPay))
                $(target).find("td").eq(1).text(fun_accountingformatNumberdelzero(OriginalAmount))
                $(target).find("td").eq(2).text(fun_accountingformatNumberdelzero(lostPay))
                $(target).find("td").eq(3).text(fun_accountingformatNumberdelzero(cost))
                $(target).find("td").eq(4).text(fun_accountingformatNumberdelzero(EMPTransportationMaxPay - cost))

                $("#PaymentAmount").val(EMPTransportationMaxPay - cost)

                $("#NetPayment").val(fun_accountingformatNumberdelzero(lostPay - cost))
                $("#WithholdingTax").val(fun_accountingformatNumberdelzero(cost))
                if (lostPay <= 0) {
                    $("#div_Incometax").hide()
                }
                else {
                    $("#div_Incometax").show()
                }

                rtn = true
            }
            else {
                alert("交通津貼金額試算異常");
            }
        }
        else {
            alert("不符合交通津貼申請規則");
        }
    }
}

//營業稅重新試算
function fun_BussinessTaxReCalculate(TaxIdNum, CertificateNum, EstimateVoucherDate, IsDeduction) {
    try {
        if ($("#GvDeclaration").val() == "403") {
            AmountArray = $("#tab_Invoice tbody tr").map(function () {
                InvoiceJsonData = $(this).find("[name=InvoiceJsonData]").val();
                if (InvoiceJsonData) {
                    JsonData = JSON.parse(InvoiceJsonData);
                    if (JsonData.TaxIdNum == TaxIdNum &&
                        JsonData.CertificateNum == CertificateNum &&
                        JsonData.strEstimateVoucherDate == EstimateVoucherDate) {
                        return { TWDAmount: JsonData.TWDAmount, TWDTaxAmount: JsonData.TWDTaxAmount, }
                    }
                }
            })
            BuisnessTaxArray = []

            if (!TaxIdNum) TaxIdNum = ""
            if (!CertificateNum) CertificateNum = ""

            $("#div_bussiceTax tbody").not("[alt=no-data]").not("[Deleted]").each(function () {
                if ($(this).find("[JScontrolName=IsDelete]").val() != true &&
                  $(this).find("[JScontrolName=BusinessNum]").val() == TaxIdNum &&
                   $(this).find("[JScontrolName=CertificateNum]").val() == CertificateNum &&
                     $(this).find("[JScontrolName=CertificateDate]").val() == EstimateVoucherDate) {
                    BuisnessTaxArray.push($(this))
                }
            })

            if (AmountArray.length > 0) {
                TWDAmount = 0
                TWDTaxAmount = 0
                $(AmountArray).each(function () {
                    TWDAmount += this.TWDAmount
                    TWDTaxAmount += this.TWDTaxAmount
                })

                if (BuisnessTaxArray.length > 0) {
                    $(BuisnessTaxArray)[0].find("[Amount]").val(0)
                    $(BuisnessTaxArray)[0].find("[JScontrolName=BusinessNum]").val(TaxIdNum)
                    $(BuisnessTaxArray)[0].find("[JScontrolName=CertificateNum]").val(CertificateNum)
                    $(BuisnessTaxArray)[0].find("[JScontrolName=CertificateDate]").val(EstimateVoucherDate)
                    $(BuisnessTaxArray)[0].find("[JScontrolName=CertificateAmount]").val(TWDAmount)
                    $(BuisnessTaxArray)[0].find("[JScontrolName=TaxAmount]").val(fun_accountingformatNumberdelzero(TWDTaxAmount))
                    $(BuisnessTaxArray)[0].find("[JScontrolName=Taxable]").val(fun_accountingformatNumberdelzero(TWDAmount - TWDTaxAmount))

                    $(BuisnessTaxArray)[0].find("[alt=BusinessNum]").text(TaxIdNum)
                    $(BuisnessTaxArray)[0].find("[alt=CertificateNum]").text(CertificateNum)
                    $(BuisnessTaxArray)[0].find("[alt=CertificateDate]").text(EstimateVoucherDate)
                    $(BuisnessTaxArray)[0].find("[alt=CertificateAmount]").text(fun_accountingformatNumberdelzero(TWDAmount))

                    $(BuisnessTaxArray)[0].find("[Errmsg=Y]").remove();
                }
                else {
                    NewBTaxobj = $("#onlycopy").find("[alt=CopyBusinessNewRow]").clone();
                    $(NewBTaxobj).find("[Amount]").val(0)
                    $(NewBTaxobj).find("[Amount]").val(0)
                    $(NewBTaxobj).find("[JScontrolName=BusinessNum]").val(TaxIdNum)
                    $(NewBTaxobj).find("[JScontrolName=CertificateNum]").val(CertificateNum)
                    $(NewBTaxobj).find("[JScontrolName=CertificateDate]").val(EstimateVoucherDate)
                    $(NewBTaxobj).find("[JScontrolName=CertificateAmount]").val(TWDAmount)
                    $(NewBTaxobj).find("[JScontrolName=TaxAmount]").val(fun_accountingformatNumberdelzero(TWDTaxAmount))
                    $(NewBTaxobj).find("[JScontrolName=Taxable]").val(fun_accountingformatNumberdelzero(TWDAmount - TWDTaxAmount))
                    $(NewBTaxobj).find("[JScontrolName=IsDeduction]").val(IsDeduction)
                    $(NewBTaxobj).find("[JScontrolName=FormatKind]").val(21)

                    $(NewBTaxobj).find("[JScontrolName=FormatKind]").val(21)
                    divFormatKind = $(NewBTaxobj).find("[JScontrolName=FormatKind]").closest("div[alt=Edit]")
                    $(divFormatKind).find("[alt=optionName]").val($(divFormatKind).find("[JScontrolName=FormatKind]").find("option:selected").text())
                    $(divFormatKind).find("[alt=optionVal]").val(21)

                    $(NewBTaxobj).find("[alt=BusinessNum]").text(TaxIdNum)
                    $(NewBTaxobj).find("[alt=CertificateNum]").text(CertificateNum)
                    $(NewBTaxobj).find("[alt=CertificateDate]").text(EstimateVoucherDate)
                    $(NewBTaxobj).find("[alt=CertificateAmount]").text(fun_accountingformatNumberdelzero(TWDAmount))

                    //selectpicker clone會無法作用 必須移除後再重新渲染 反應會延遲

                    $(NewBTaxobj).find('.selectpicker').data('selectpicker', null);
                    $(NewBTaxobj).find('.bootstrap-select').find("button:first").remove();
                    $(NewBTaxobj).find(".selectpicker").selectpicker("refresh")
                    //selectpicker clone會無法作用 必須移除後再重新渲染
                    $(NewBTaxobj).find("input[Amount]").on("focus", function () {
                        fun_onfocusAction(this);
                    })
                    $(NewBTaxobj).find("input[Amount]").on("blur", function () {
                        fun_onblurAction(this);
                    })
                    fun_bussiceTaxAction($(NewBTaxobj))
                    $("#div_bussiceTax table").append(NewBTaxobj)
                }
            }
            else {
                $(BuisnessTaxArray).each(function () {
                    if (parseInt($(this).find("[JScontrolName=BusinessID]").val()) > 0) {
                        $(this).hide();
                        $(this).attr("Deleted", "").find("[JScontrolName=IsDelete]").val(true);
                        $(this).find("[necessary]").removeAttr("necessary");
                    }
                    else {
                        $(this).remove();
                    }
                })
            }
        }
    }
    catch (e) {
        console.log("營業稅重新試算錯誤==>" + e.message)
    }
}

//請款明細金額試算
function fun_InvoiceAmountCalculate(invoiceData) {
    Rate = accounting.unformat($("#Rate").val())
    InvoiceOriginalAmount = accounting.unformat($("#InvoiceOriginalAmount").val())
    InvoiceOriginalTax = accounting.unformat($("#InvoiceOriginalTax").val())

    if (!isNaN(Rate) && Rate > 0 &&
        !isNaN(InvoiceOriginalAmount) && InvoiceOriginalAmount > 0 &&
        !isNaN(InvoiceOriginalTax) && InvoiceOriginalTax >= 0) {
        AcceptanceAmount = fun_accountingformatNumberdelzero(accounting.toFixed(InvoiceOriginalAmount - InvoiceOriginalTax, 8));
        $("#AcceptanceAmount").text(fun_accountingformatNumberdelzero(AcceptanceAmount))

        InvoiceTWDAmount = accounting.toFixed(InvoiceOriginalAmount * Rate, 0)
        $("#InvoiceTWDAmount").text(fun_accountingformatNumberdelzero(InvoiceTWDAmount))

        InvoiceTWDTaxAmount = accounting.toFixed(InvoiceOriginalTax * Rate, 0)
        $("#InvoiceTWDTaxAmount").text(fun_accountingformatNumberdelzero(InvoiceTWDTaxAmount))

        InvoiceTWDSaleAmount = InvoiceTWDAmount - InvoiceTWDTaxAmount
        $("#InvoiceTWDSaleAmount").text(fun_accountingformatNumberdelzero(InvoiceTWDSaleAmount))

        Maxpay = fun_getMaxPay(invoiceData)

        if (isNaN(MaxPay) || MaxPay < 0) {
            fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrInvoiceOriginalAmount", "取得請款類別支付上限失敗");
        }
        else {
            if ((MaxPay != 0) && (InvoiceTWDAmount > MaxPay)) {
                fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrInvoiceOriginalAmount", "金額(臺幣)上限為 " + MaxPay + " 已超出金額上限");
            }
        }
    }
    else {
        $("#InvoiceTWDAmount").text();
        $("#InvoiceTWDSaleAmount").text();
        $("#InvoiceTWDTaxAmount").text();
        $("#AcceptanceAmount").text();
    }
}

function fun_getMaxPay(InvoiceData) {
    /*101801	膳雜費（國外）
      101802	住宿費（國外）
      101808	膳雜費（國外-大陸地區）
      101809	住宿費（國外-大陸地區）
      101815	膳雜費（國內）
      101816	住宿費（國內）*/

    MaxPay = 0;

    // TripPayType=2
    if (__TripPayType == 0 && __EMP_TW_Food == InvoiceData.PaymentMidCategory) {
        __TripPayType = 1 // 膳雜費（國內）最高500 *同經理
    }

    if (__TripPayType == 0) {//不做檢核
        MaxPay = 0;
    }
    else {
        //國內
        if ($.grep(__EMP_TW.split(","), function (code) {
            return code == InvoiceData.PaymentMidCategory
        }).length > 0) {
            $(this)._ajax("/EMP/GetPayLimit", { PayLv: __TripPayType, MidItemNo: InvoiceData.PaymentMidCategory }, function (data) {
                MaxPay = data;
            }, "獲取國內差旅費失敗")

            if (parseInt(MaxPay) < 0) {
                MaxPay = -1
            }
        }
        //海外膳雜
        if ($.grep(__EMP_OverseaFood.split(","), function (code) {
            return code == InvoiceData.PaymentMidCategory
        }).length > 0) {
            if (isNaN(__TripUSAExchangeRate)) {
                fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrAmount", "查無出差日美元匯率")

                return -1;
            }
            OverseaPayLimit = -1;
            $(this)._ajax("/EMP/GetOverseaPayLimit", { startCityItemNo: InvoiceData.StartCityCode, endCityItemNo: InvoiceData.EndCityCode }, function (data) {
                var rtn = {
                    true: ""
                }
                if (OverseaPayLimit <= 0) {
                    rtn = {
                        false: "獲取國外差旅費失敗"
                    }
                }

                OverseaPayLimit = data;

                return rtn
            }, "獲取國外差旅費失敗")
            if (OverseaPayLimit > 0) {
                MaxPay = parseInt(accounting.toFixed(parseInt(accounting.toFixed((OverseaPayLimit * __TripUSAExchangeRate))) * 0.4))
            }
        }
        //海外住宿
        if ($.grep(__EMP_OverseaHotel.split(","), function (code) {
             return code == InvoiceData.PaymentMidCategory
        }).length > 0) {
            if (isNaN(__TripUSAExchangeRate)) {
                fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrAmount", "查無出差日美元匯率")
                return -1;
            }
            OverseaPayLimit = -1;
            $(this)._ajax("/EMP/GetOverseaPayLimit", { startCityItemNo: InvoiceData.StartCityCode, endCityItemNo: InvoiceData.EndCityCode }, function (data) {
                var rtn = {
                    true: ""
                }
                if (OverseaPayLimit <= 0) {
                    rtn = {
                        false: "獲取國外差旅費失敗"
                    }
                }

                OverseaPayLimit = data;
                return rtn
            }, "獲取國外差旅費失敗")
            if (OverseaPayLimit > 0) {
                MaxPay = parseInt(accounting.toFixed(parseInt(accounting.toFixed((OverseaPayLimit * __TripUSAExchangeRate))) * 0.6))
            }
        }

        /*switch (InvoiceData.PaymentMidCategory) {
            case "101801":
            case "101808":
                if (isNaN(InvoiceData.tripUSAExchangeRate)) {
                    fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrAmount", "查無出差日美元匯率")

                    return -1;
                }
                OverseaPayLimit = -1;
                $(this)._ajax("/EMP/GetOverseaPayLimit", { startCityItemNo: InvoiceData.StartCityCode, endCityItemNo: InvoiceData.EndCityCode }, function (data) {
                    var rtn = {
                        true: ""
                    }
                    if (OverseaPayLimit <= 0) {
                        rtn = {
                            false: "獲取國外差旅費失敗"
                        }
                    }

                    OverseaPayLimit = data;

                    return rtn
                }, "獲取國外差旅費失敗")
                if (OverseaPayLimit > 0) {
                    MaxPay = parseInt(accounting.toFixed(parseInt(accounting.toFixed((OverseaPayLimit * InvoiceData.tripUSAExchangeRate))) * 0.4))
                }
                break;
            case "101802":
            case "101809":
                if (isNaN(InvoiceData.tripUSAExchangeRate)) {
                    fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrAmount", "查無出差日美元匯率")
                    return -1;
                }
                OverseaPayLimit = -1;
                $(this)._ajax("/EMP/GetOverseaPayLimit", { startCityItemNo: InvoiceData.StartCityCode, endCityItemNo: InvoiceData.EndCityCode }, function (data) {
                    var rtn = {
                        true: ""
                    }
                    if (OverseaPayLimit <= 0) {
                        rtn = {
                            false: "獲取國外差旅費失敗"
                        }
                    }

                    OverseaPayLimit = data;
                    return rtn
                }, "獲取國外差旅費失敗")
                if (OverseaPayLimit > 0) {
                    MaxPay = parseInt(accounting.toFixed(parseInt(accounting.toFixed((OverseaPayLimit * InvoiceData.tripUSAExchangeRate))) * 0.6))
                }

                break;
            case "101815":
            case "101816":
                $(this)._ajax("/EMP/GetPayLimit", { PayLv: __TripPayType, MidItemNo: InvoiceData.PaymentMidCategory }, function (data) {
                    MaxPay = data;
                }, "獲取國內差旅費失敗")

                if (parseInt(MaxPay) < 0) {
                    MaxPay = -1
                }

                break;
            default:

                MaxPay = 0 //不檢核
                break;
        }*/

        if (isNaN(parseInt(MaxPay))) {
            MaxPay = -1;
        }

        //console.log("OverseaPayLimit :" + OverseaPayLimit)
        console.log(MaxPay)
    }
    return MaxPay;
}
//公用副程式
{
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

    //控建顯示隱藏的動畫速度
    function fun_controlShow(target) {
        $(target).toggle(200);
    }

    //字串補0
    function funAddheadZero(len, val) {
        val = String(val);
        while (val.length < len) {
            val = "0" + val;
        }

        return val;
    }

    //金額欄位獲得焦點動作
    function fun_onfocusAction(target) {
        $(target).val(accounting.unformat($(target).val()));
        if ($(target).val() == "0") $(target).val("");

        $(target).nextAll("[Errmsg=Y]").remove();
        SelectionRange(target, $(target).val().length, $(target).val().length)
    }

    //金額欄位失去焦點動作
    function fun_onblurAction(target) {
        Accuracy = $(target).attr("Accuracy")
        if (isNaN(Accuracy)) {
            Accuracy = 0;
        }
        else {
            if (Accuracy > 6) { Accuracy = 6 }//最多六位小數 *配合資料庫欄位
        }

        if (accounting.unformat($(target).val()) == 0 && $(target).attr("Amount") != "Zero") {
            fun_AddErrMesg(target, "ErrAmount", "請輸入大於0的數字")
            return false;
        }

        if (regNum(accounting.unformat($(target).val()), (Accuracy > 0))) {
            if ($(target).val().indexOf(".") > 0) {
                if (($(target).val().length - ($(target).val().indexOf(".") + 1)) > Accuracy) {
                    fun_AddErrMesg(target, "ErrAmount", "小數點長度錯誤，最多" + Accuracy + "碼")

                    return false;
                }
            }

            //資料庫只開9碼
            if ($(target).val() > 1000000000) {
                fun_AddErrMesg(target, "ErrAmount", "超出數字上限")
                return false;
            }

            $(target).val(fun_accountingformatNumberdelzero($(target).val()))
            return true;
        }
        else {
            fun_AddErrMesg(target, "ErrAmount", "數字輸入錯誤")
            return false;
        }
    }

    //控制光標位置 *目標,起始點，結束點
    function SelectionRange(target, start, end) {
        if (target.createTextRange) {//IE
            var range = target.createTextRange();

            range.collapse(true);//將指標移動至開頭或結尾 true(開頭)

            range.moveEnd('character', end); //單位有character(字符)、word(單詞)、sentence(段落)

            range.moveStart('character', start);

            range.select();//選取
        }
        else if (target.setSelectionRange) {//Chrome IE 10以上
            //IE 10支援setSelectionRange 但是不支援setcRange...
            //target.setcRange(start, end);
        }
    }

    //新增錯誤訊息
    function fun_AddErrMesg(target, NewElementID, ErrMesg) {
        if ($(target).nextAll("[alt=" + NewElementID + "]").length > 0) {
            $(target).nextAll("[alt=" + NewElementID + "]").html("<span class=\"icon-error icon-error-size\"></span>" + ErrMesg);
        }
        else {
            $(target).after('<div Errmsg="Y"  style="text-align:left" alt="' + NewElementID + '" class="error-text"><span class="icon-error icon-error-size"></span>' + ErrMesg + '</div>')
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

    //數字驗證 *正值
    function regNum(target, hasfloat) {
        if (hasfloat) {
            reg = /^(([0-9]\.[0-9]*)|([1-9][0-9]*\.[0-9]*)|([0-9]\d*))$/
        }
        else {
            reg = /^([0-9]\d*)$/
        }
        if (String(target).search(reg) == 0) {
            return true;
        }
        else {
            return false;
        }
    }

    //重新排號
    function fun_resetCellIndex(targetTable, alttag, len) {
        i = 1;
        $(targetTable).find("[alt='" + alttag + "']").each(function () {
            index = String(i)
            while (index.length < len) {
                index = "0" + index;
            }

            $(this).text(index);
            i++;
        })
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
}