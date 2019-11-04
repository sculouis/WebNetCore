var InvoiceObj = null; //請款明細物件
var InvoiceData = null; //請款明細跳窗資料暫存
var __UsedPay = -1;
var __UsedCertificateNum = false;

//暫存
function draft() {
    let draftAjax = $.Deferred()

    CertificateAmount = parseFloat($("#CertificateAmount").val())
    if (CertificateAmount > 1000000000) {
        fun_AddErrMesg($("#divCertificateAmount"), "ErrCertificateAmount", "超出數字上限")
        $.unblockUI();
        $('html, body').animate({
            scrollTop: ($("#divCertificateAmount").offset().top) - 50
        }, 500);
        return draftAjax.reject();
    }

    fun_SetTransValue()
    _formInfo.flag = false
    $("input[Amount]").each(function () {
        $(this).val(accounting.unformat($(this).val()))
    })
    // $("#MainForm").attr("action", "/EMP/Edit").submit()
    blockPageForJBPMSend()
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: '/EMP/Edit',
        data: $("form").serialize(),
        success: function (data) {
            _formInfo.formGuid = data.FormGuid
            _formInfo.formNum = data.FormNum
            _formInfo.flag = data.Flag

            draftAjax.resolve();
        },
        error: function (data) {
            draftAjax.reject();
            alert("暫存發生錯誤")
        }
    }).always(function () {
        $.unblockUI();
    })

    return draftAjax.promise()
}

//驗證
function Verify() {
    let draftAjax = $.Deferred()

    setTimeout(function () {
        rtn = fun_MasterFormDataConfirm();

        if (rtn) {
            // CertificateAmount = accounting.unformat($("[name=CertificateAmount]").text())

            if ($("#ExpenseKind").val() != "EMP_MGR_EXP") {
                if ($("#tab_Invoice").find("tbody").not("[alt=no-data]").not("[alt=Delete]").length > 0) {
                    //ErrIndex = "";
                    //將請款明細資料塞回POP重新驗證 有點慢..
                    //20190320 太慢了，放棄 經理人交通津貼已死，不必再重複驗證
                    /*$("#tab_Invoice").find("tbody").not("[alt=no-data]").not("[alt=Delete]").each(function () {
                        Index = $(this).find("[alt=Index]").text()
                        // CertificateAmount = accounting.toFixed(CertificateAmount - accounting.unformat($(this).find("td").eq(6).text()), 8)

                         console.log(CertificateAmount)
                        fun_popInvoiceInfo($(this), true)
                        if (!fun_InvoiceDataConfirm()) {
                            ErrIndex += Index + " "
                        }
                    })

                    if (ErrIndex != "") {
                        alert("請款明細項次" + ErrIndex + "資料有誤")
                        rtn = false;
                    }*/
                }
                else {
                    alert("請至少輸入一筆請款明細")
                    // fun_AddErrMesg($("#tab_Invoice"), "Errtab_Invoice", "請至少輸入一筆請款明細")
                    rtn = false;
                }
            }
            else {
                TransAllowanceDateUsed = false

                $(this)._ajax("/EMP/GetTransAllowanceDateChcek", {
                    VendorNum: $("#VendorNum").val(), EMPNum: $("#EMPNum").val(), TransAllowanceDate: $("#TransAllowanceDate").val()
                }, function (data) {
                    let ajaxrtn = {
                        true: ""
                    }
                    if (data > 0) {
                        TransAllowanceDateUsed = true
                    }

                    return ajaxrtn
                }, "傳送發生錯誤", true, false, 0)

                if (TransAllowanceDateUsed) {
                    alert("已申請該月份之交通津貼，不得重複申請")
                    rtn = false
                }

                let Err = fun_TransportationCheck();
                if (Err != "") {
                    alert(Err)
                    rtn = false;
                }
            }
        }

        if (!rtn) {
            if ($('[Errmsg=Y]').length > 0) {
                $('html, body').animate({
                    scrollTop: ($('[Errmsg=Y]').first().closest("div .row").offset().top) - 50
                }, 500);
            }
        }

        if (rtn) {
            draftAjax.resolve();
        }
        else {
            draftAjax.reject();
        }
    }, 0)
    return draftAjax.promise();
}

//傳送
function Save() {
    let draftAjax = $.Deferred()
    let _url;
    CertificateAmount = parseFloat($("#CertificateAmount").val())
    if (CertificateAmount > 1000000000) {
        fun_AddErrMesg($("#divCertificateAmount"), "ErrCertificateAmount", "超出數字上限")
        $('html, body').animate({
            scrollTop: ($("#divCertificateAmount").offset().top) - 50
        }, 500);

        setTimeout(function () { $.unblockUI() }, 2000)

        return draftAjax.reject();
    }

    fun_SetTransValue()

    $("input[Amount]").each(function () {
        $(this).val(accounting.unformat($(this).val()))
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

            $("#FormTypeName").val("員工報支(" + $("#ExpenseKind").find("option:selected").text() + ")")
            $("#ApplyItem").val($("#ExpenseKind").find("option:selected").text())

            draftAjax.resolve();
        },
        error: function () {
            alert("傳送發生錯誤")
            draftAjax.reject();
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
    //ApplicantDepId = String($("#ApplicantDepId").val()).split(',')[2]

    fun_DefaultValue(true);
    fun_EMPMasterStartAction();
    fun_PopInvoiceInfoStartAction();

    if ($("#orgpickUser")) {
        $("#orgpickUser").on("click", fun_orgpickUser)
    }

    $("#EstimateVoucherDatePicker").data("DateTimePicker").maxDate(new Date());
    $("#TransAllowanceDate").closest("div").data("DateTimePicker").maxDate(new Date());

    if ($("#VendorNum").val() == "") {
        $("#VendorNum").val($("#LoginEno").val())//登入者ID
        $("#empName").val($("#LoginName").val())
        $("#spanEMPName").text($("#LoginName").val() + "(" + $("#LoginEno").val() + ")")
    }

    $(this)._ajax("/EMP/GetFromDataSet", { sourceKeyId: $("#EmpNum").val(), VendorNum: $("#VendorNum").val() },
      fun_InfoSet, "表單資料載入失敗")//設定表單資料ajax

    if ($("#FormID").val() != "") {
        $("#tab_Invoice")._ajax("/EMP/GetEMPDetail", { FormID: $("#FormID").val() }, function (data) {
            var rtn = {
                true: ""
            }
            if (data.IsSuccess) {
                if (data.Detail) {
                    $.each(data.Detail, function (Index, Info) {
                        InvoiceObj = null
                        //  Info.EstimateVoucherDate = Info.strEstimateVoucherDate
                        if (__ExpenseKind == "EMP_MGR_EXP") {
                            fun_TransDetail(Info)
                        }
                        else {
                            fun_InvoiceDataPutIn(Info)
                        }
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
    }

    $("#ExpenseKind").data('oldIndex', $("#ExpenseKind").val());//selectpicker 無法取得焦點跟click，所以先抓預設值
    $("#VoucherBeau").data('oldIndex', $("#VoucherBeau").val()).data('oldIndexBooks', $("#Books").val());//selectpicker 無法取得焦點跟click，所以先抓預設值
    $("#VendorNum").data('oldIndex', $("#VendorNum").val());//selectpicker 無法取得焦點跟click，所以先抓預設值
    $("#TravelNum").data('oldIndex', $("#TravelNum").val());//selectpicker 無法取得焦點跟click，所以先抓預設值

    $("input").on("focus", function () {
        $(this).nextAll("[Errmsg=Y]").remove();
    })
    $("select").on("change", function () {
        $(this).nextAll("[Errmsg=Y]").remove();
    })

    $("[Alert]").on("click", function () {
        $("#AlertMessage").html($(this).attr("Alert").replace("&&", "<br\>"));
    })
    //金額欄位動作
    $("input[Amount]").on("focus", function () {
        fun_onfocusAction(this);
    })
    $("input[Amount]").on("blur", function () {
        fun_onblurAction(this);
    })

    $.each($("[Amount]"), function () {
        if ($(this).val().length > 0) {
            $(this).val(fun_accountingformatNumberdelzero($(this).val()))
        }
        if ($(this).text().length > 0) {
            $(this).text(fun_accountingformatNumberdelzero($(this).text()))
        }
    })

    if ($("#ExpenseKind").val() == "EMP_MGR_EXP" && $("#OriginalSubTotalAmount").text != "0") {
        $("#divTransportation").show();
    }

    fun_stageChange()//判斷關卡

    //設AUTO 會被重繪的selectpicker壓在下面
    $('.popup-box').css("z-index", "502")
    $('.popup-overlay').css("z-index", "500")
})

//簽核流程變換 *跳關
function fun_stageChange() {
    _requestGetNextApprover.SendCase = 1//固定為1 *取得關主
    //若申請人與請款人為同一人跳至第二關主管覆核
    //若為卡處人員，使用卡處流程
    if ($('#P_CurrentStep').val() == "1" && $('#P_JBPMUID').val() == "" && $('#FillInDepName').val().includes(__CreditCardDepId)) {
        _requestGetNextApprover.CustomFlowKey = "EMP_P1_Credit";
        updateCustomFlowKey("EMP_P1_Credit");
        _stageInfo.CustomFlowKey = "EMP_P1_Credit";
        _stageInfo.NextCustomFlowKey = "EMP_P1_Credit"
        $('#P_CustomFlowKey').val("EMP_P1_Credit");
    }

    if ($("#ApplicantEmpNum").val() == $("#VendorNum").val()) {
        _requestGetNextApprover.AdditionStage = 2;
    }
    else {
        _requestGetNextApprover.AdditionStage = 1;
    }
    $.when(GetNextApprover(_requestGetNextApprover, 1)).done(function (data) {
        AppendSend(data);
        $('#SendSection input[value="1"]').attr("checked", true);
    });
    //console.log(_requestGetNextApprover.AdditionStage)
    //console.log(_requestGetNextApprover)
}

//依關卡取下一關人員 *僅有起單人非實際請款人時需使用
function GetPageCustomizedList(stepSequence) {
    console.log({ SignedID: $("#VendorNum").val(), SignedName: $("#empName").val() })
    return { SignedID: [$("#VendorNum").val()], SignedName: [$("#empName").val()] }
}

//表單資料設定
function fun_InfoSet(data) {
    if (data.EMPExpenseKindList) {
        fun_setSelectOption($("#ExpenseKind"), data.EMPExpenseKindList)
    }

    /* if (data.EmpList) {
         fun_setSelectOption($("#VendorNum"), data.EmpList)
     }*/

    if (data.VoucherBeauList) {
        fun_VoucherBeau(data.VoucherBeauList)
    }

    if (data.TravelNumList) {
        fun_subTravelNum(data.TravelNumList)
    }
    else {
        $("#TravelNum").empty();
        $("#TravelNum").selectpicker({ title: "無可供申請之出差申請單號" }).selectpicker('setStyle', 'input-disable', 'add').prop("disabled", true).selectpicker("refresh")
    }

    if (data.BankBranchList) {
        fun_setSelectOption($("#PaymentBranch"), data.BankBranchList, true)
    }

    if (data.ProjectCategory) {
        fun_setSelectOption($("#ProjectCategory"), data.ProjectCategory)
        $("#ProjectCategory").prepend($("<option></option>").attr("value", "").text("請選擇")).selectpicker('refresh');
    }
    if (data.CurrencyList) {
        $.each(data.CurrencyList, function (index, value) {
            $("#Currency").append($("<option></option>").attr("value", value.currencyCode).text(value.currencyName + " " + value.currencyCode).data("text", value.currencyName)
                 .data("extendedPrecision", value.extendedPrecision).data("currencyName", value.currencyName));
        })
        $("#Currency").selectpicker('refresh');
    }
    if (data.CityLongNameList) {
        fun_setSelectOption($("#StartCityCode"), data.CityLongNameList, true)
        fun_setSelectOption($("#EndCityCode"), data.CityLongNameList, true)
    }

    if (data.EmpInfo) {
        fun_subVendorNum(data.EmpInfo, isNullOrEmpty($("#FormID").val()))
    }
    else {
        alert("查無員編" + $("#VendorNum").val() + "之員工資料")
    }

    if (__ExpenseKind != "") {
        setDefaultSelect($("#ExpenseKind"), __ExpenseKind)
        fun_GetPaymentCategoryItems()
        fun_ExpenseKindChange(__ExpenseKind)
    }

    //分攤明細層--帳戶行
    if (data.coaCompanyList) {
        //fun_setSelectOption($("#tab_copyInvoiceDetail").find("[alt=AccountBank]"), data.coaCompanyList)
        $.each(data.coaCompanyList, function (index, value) {
            $("#tab_copyInvoiceDetail").find("[alt=AccountBank]").append($("<option></option>").attr("value", value.company).text(value.company + " " + value.description).data("text", value.description)
                  .data("gvDeclaration", value.gvdeclaration));
        })
    }

    //分攤明細層--成本利潤中心
    if (data.DepartmentList) {
        $.each(data.DepartmentList, function (index, value) {
            $("#tab_copyInvoiceDetail").find("[alt=CostProfitCenter]").append($("<option></option>").attr("value", value.department).text(value.department + " " + value.description).data("text", value.description)
                  .data("IsDeduction", value.taxApplication).data("isProductRequired", value.isProductRequired));
        })

        $("#tab_copyInvoiceDetail").find("[alt=CostProfitCenter]").selectpicker('refresh');
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

    if (__VoucherBeau != "") {
        /*會有重複的索引值，要再多比對帳戶行資訊*/
        // setDefaultSelect($("#VoucherBeau"), __VoucherBeau)
        $.each($("#VoucherBeau").find("option[value='" + __VoucherBeau + "']"), function (i, o) {
            if ($(o).data("Books") == __Books) {
                $(o).attr("selected", "selected")
                $("#VoucherBeau").selectpicker('refresh');
                return false
            }
        })
    }

    if (__TravelNum != "") {
        setDefaultSelect($("#TravelNum"), __TravelNum)
        fun_TravelNumChange()
    }

    if (__PaymentBranch != "") {
        setDefaultSelect($("#PaymentBranch"), __PaymentBranch)
    }
}

//設定Select預設值
function setDefaultSelect(target, value) {
    $(target).find("option[value='" + value + "']").attr("selected", "selected")
    $(target).selectpicker('refresh');
    // $(target).change()
}

///---主檔動作----

//報支單主檔Action
function fun_EMPMasterStartAction() {
    $("#ExpenseKind").on('change', function () {
        rtn = confirm("修改此欄位會將所有資料清空，是否確認修改")
        if (rtn) {
            $("#TripUSAExchangeRate").val(0)
            $("#CertificateAmount").val(0)
            $("#span_CertificateAmount").text(0)

            $(this).data('oldIndex', $(this).val());//更新選取值

            //清空表單資料

            $("div[alt=VendorInfoArea]").find("select").not("#ExpenseKind").not("#VendorNum").val("").selectpicker('refresh');
            $("div[alt=VendorInfoArea]").find("input").val("");
            $("div[alt=VendorInfoArea]").find("textarea").val("");

            // $("#MasterInfo").find("div .disable-text").not("#EstimatePayDate").text("")
            $("[Errmsg='Y']").remove()

            $("#tab_Invoice tbody").not("[alt=no-data]").each(function () {
                if ($(this).find("[name=LineNum]").val() <= 0) {
                    $(this).remove()
                }
                else {
                    $(this).hide()
                    $(this).find("[alt=Index]").attr("alt", "Delete")
                    $(this).attr("alt", "Delete")
                    $(this).find("[name=InvoiceJsonData]").val($(this).find("[name=InvoiceJsonData]").val().replace("\"IsDelete\":false", "\"IsDelete\":true"))
                }
            })
            //$("#tab_InvoiceDetail tbody").not("[alt=no-data]").remove();//移除分攤項次的內文資料

            $("#tab_Invoice tbody[alt=no-data]").show()

            $("#tab_TrnasInvoiceDetail tbody tr").not("[alt=no-data]").each(function () {
                if ($(this).find("[alt=LineNum]").val() <= 0) {
                    $(this).remove()
                }
                else {
                    $(this).hide()
                    $(this).find("[alt=Index]").attr("alt", "Delete")
                    $(this).find("[alt=IsDelete]").val(true)
                }
            })
            $("#tab_TrnasInvoiceDetail tr[alt=no-data]").show()
            //清空表單資料

            fun_DefaultValue(false);
            fun_GetPaymentCategoryItems()
            fun_ExpenseKindChange($("#ExpenseKind").val())
        }
        else {
            $(this).val($(this).data('oldIndex')).selectpicker('refresh');//還原選取
            return false;
        }
    })//請款類別更換動作

    $("#link_Transportation").on('click', function () {
        Err = fun_TransportationCheck();
        if (Err != "") {
            alert(Err)
        }
        else {
            alert("試算完成")
        }
    })//交通津貼試算

    $("[popInvoiceInfo]").on('click', function () {
        fun_popInvoiceInfo($(this));
    })//請款明細POP視窗

    $("#VoucherBeau").on("change", function () {
        let rtn = fun_changeConfirm();
        $("#VoucherBeau").nextAll("[Errmsg=Y]").remove();

        if (rtn) {
            $(this).data('oldIndex', $(this).val());//更新選取值
            $("#VoucherBeauName").val($("#VoucherBeau option:selected").data("text"))
            Books = $(this).find("option:selected").data("Books")
            BooksName = $(this).find("option:selected").data("BooksName")
            isCreditCardOffice = $(this).find("option:selected").data("isCreditCardOffice")
            GvDeclaration = $(this).find("option:selected").data("gvDeclaration")

            if (Books != null && isCreditCardOffice != null && GvDeclaration != null) {
                $("#isCreditCardOffice").val(isCreditCardOffice)
                $("#GvDeclaration").val(GvDeclaration)
                $("#Books").val(Books)
                $("#BooksName").val(BooksName)
                $("#_Books").text(Books + " " + BooksName)
                $("#_Books").removeClass("undone-text")
            }
            else {
                $("#isCreditCardOffice").val("")
                $("#GvDeclaration").val("")
                $("#Books").val("")
                $("#BooksName").val("")
                $("#_Books").text("系統自動帶入")
                $("#_Books").addClass("undone-text")
                //alert("憑證開立對象資訊有誤");
                fun_AddErrMesg($("#VoucherBeau"), "Err_VoucherBeau", "憑證開立對象資訊有誤");
            }
        }
        else {
            if ($(this).attr("ID") == "VoucherBeau") {
                $.each($(this).find("option[value='" + $(this).data('oldIndex') + "']"), function (i, o) {
                    if ($(o).data("Books") == $("#VoucherBeau").data('oldIndexBooks')) {
                        $(o).attr("selected", "selected")
                        $("#VoucherBeau").selectpicker('refresh');
                        return false
                    }
                })
            }
            else {
                $(this).val($(this).data('oldIndex')).selectpicker('refresh');//還原選取
            }

            return false;
        }
    })//憑證開立對象更換動作

    $("#TravelNum").on("change", function () {
        rtn = fun_changeConfirm();
        $(this).nextAll("[Errmsg=Y]").remove();
        if (rtn) {
            fun_TravelNumChange()
        }
        else {
            $(this).val($(this).data('oldIndex')).selectpicker('refresh');//還原選取
            return false;
        }
    })//出差申請單號更換動作

    $("#PaymentBranch").on("change", function () {
        $("#BranchName").val($("#PaymentBranch").find("option:selected").data("text"))
    })//分行更換動作
}

function fun_changeConfirm() {
    rtn = true;
    if ($("#tab_Invoice tbody").not("[alt=no-data]").not("[alt=Delete]").length > 0 || $("#tab_TrnasInvoiceDetail tbody tr").not("[alt=no-data]").not("[alt=Delete]").length > 0) {
        rtn = confirm("修改此欄位會將請款明細清空，是否確認修改")
    }
    if (rtn) {
        //$("#tab_Invoice tbody tr").not("[alt=no-data]").not("[alt=Delete]").remove();//移除請款明細的內文資料
        $("#tab_Invoice tbody").not("[alt=no-data]").not("[alt=Delete]").each(function () {
            if ($(this).find("[name=LineNum]").val() <= 0) {
                $(this).remove()
            }
            else {
                $(this).hide()
                $(this).find("[alt=Index]").attr("alt", "Delete")
                $(this).attr("alt", "Delete")
                $(this).find("[name=InvoiceJsonData]").val($(this).find("[name=InvoiceJsonData]").val().replace("\"IsDelete\":false", "\"IsDelete\":true"))
            }
        })
        //$("#tab_InvoiceDetail tbody").not("[alt=no-data]").remove();//移除分攤項次的內文資料

        $("#tab_Invoice tbody[alt=no-data]").show()

        $("#tab_TrnasInvoiceDetail tbody tr").not("[alt=no-data]").not("[alt=Delete]").each(function () {
            if ($(this).find("[alt=LineNum]").val() <= 0) {
                $(this).remove()
            }
            else {
                $(this).hide()
                $(this).find("[alt=Index]").attr("alt", "Delete")
                $(this).find("[alt=IsDelete]").val(true)
            }
        })
        $("#tab_TrnasInvoiceDetail tr[alt=no-data]").show()

        ReCalculate()
    }

    return rtn
}

//特定欄位填入預設字樣
function fun_DefaultValue(ValueCheck) {
    if (ValueCheck) {
        if ($("#_StartTripDate").text().trim().length == 0) {
            $("#_StartTripDate").text("系統自動代入")
            $("#_StartTripDate").addClass("undone-text")
        }
        if ($("#_EndTripDate").text().trim().length == 0) {
            $("#_EndTripDate").text("系統自動代入")
            $("#_EndTripDate").addClass("undone-text")
        }
        if ($("#_Books").text().trim().length == 0) {
            $("#_Books").text("系統自動代入")
            $("#_Books").addClass("undone-text")
        }
    }
    else {
        $("#_StartTripDate").text("系統自動代入")
        $("#_EndTripDate").text("系統自動代入")
        $("#_Books").text("系統自動代入")
        //$("#_Remittance").text("系統自動代入")

        $("#_StartTripDate").addClass("undone-text")
        $("#_EndTripDate").addClass("undone-text")
        $("#_Books").addClass("undone-text")
        // $("#_Remittance").addClass("undone-text")
    }

    // $("#_OriginalAmount").text("0")
    $("#_TWDAmount").text("0")
    // $("#_TWDTaxAmount").text("0")
    $("#PaymentAmount").val("0")
    $("#div_PaymentAmount").text("0")
}

//取得請款大類
function fun_GetPaymentCategoryItems() {
    $.ajax({
        url: "/EMP/GetPaymentCategoryItems",   //存取Json的網址
        type: "POST",
        cache: false,
        async: false,
        dataType: 'json',
        timeout: 5000,
        data: { PaymentKind: $("#ExpenseKind").val() },
        success: function (data) {
            fun_setSelectOption($("#PaymentCategory"), data, false)
        },

        error: function (_xhr, _ajaxOptions, _thrownError) {
            alert("取得請款大類失敗")
        }
    })
}

//一般key/value option
function fun_setSelectOption(target, data, subtext) {
    $(target).empty()
    if (subtext) {
        $.each(data, function (key, txt) {
            // $(target).append($("<option></option>").attr("data-subtext", key).attr("value", key).text(key + " " + txt));
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

//實際請款人清單資訊處理
function fun_ParseEmpList(data) {
    fun_setSelectOption($("#VendorNum"), data)
}

//人員選擇器
function fun_orgpickUser() {
    if (_unitData) {
        //6 為非總行人員 ,非總行則抓至處級 連處都沒有是高官直接抓第一筆
        unit_id = $.map(_unitData, function (obj) {
            if (obj.unit_level == 6)
                return obj.unit_id
        })

        if (unit_id.length == 0) {
            unit_id = $.map(_unitData, function (obj) {
                if (obj.unit_level == 4)
                    return obj.unit_id
            })
        }

        if (unit_id.length == 0) {
            orgpickUser({ RootUnitSeq: _unitData[0].unit_id, outputfunction: "QueryTempForVendor" })
        }
        else {
            orgpickUser({ RootUnitSeq: unit_id[0], outputfunction: "QueryTempForVendor" })
        }
    }
}

//人員選擇器ACTION
function QueryTempForVendor(datas) {
    if (datas.length > 0) {
        rtn = fun_changeConfirm();
        if (rtn) {
            //清空使用者資訊
            $("#AccountNum").val("");
            $("#AccountName").val("");
            $("#PaymentBranch").attr("selectedIndex", 0).selectpicker('refresh')
            $("#TravelNum").empty();
            $("#StartTripDate").val("")
            $("#EndTripDate").val("")
            $("#_StartTripDate").text("系統自動帶入")
            $("#_EndTripDate").text("系統自動帶入")
            $("#TripUSAExchangeRate").val(0)
            $("#TransportationMaxPay").val(0)
            target = $("#table_Transportation tbody");
            $(target).find("td").eq(0).text(0)
            $(target).find("td").eq(1).text(0)
            $(target).find("td").eq(2).text(0)
            $(target).find("td").eq(3).text(0)
            $(target).find("td").eq(4).text(0)
            //清空使用者資訊

            $("#VendorNum").val(datas[0].user_id)
            $("#empName").val(datas[0].user_name.replace(/\d+/, "").replace(/\s+/, ""))

            $("#spanEMPName").text(datas[0].user_name.replace(/\d+/, "").replace(/\s+/, "") + "(" + datas[0].user_id + ")")

            fun_stageChange();

            $("#empName")._ajax("/EMP/GetEmpInfo", { EmpNum: $("EmpNum").val(), VendorNum: datas[0].user_id }, function (data) {
                var rtn = {
                    true: ""
                }
                if (data.IsSuccess) {
                    fun_subVendorNum(data.Detail)
                }
                else {
                    rtn = {
                        false: data.Message
                    }
                }
                return rtn
            }, "查無員編" + $("#VendorNum").val() + "之員工資料")//憑證開立對象ajax

            $("#TravelNum")._ajax("/EMP/GetTravelNumList", { EmpNum: $("EmpNum").val(), VendorNum: datas[0].user_id }, function (data) {
                var rtn = {
                    true: ""
                }
                if (data.IsSuccess) {
                    fun_subTravelNum(data.Detail)
                }
                else {
                    rtn = {
                        false: data.Message
                    }
                }
                return rtn
            }, "獲取出差申請單號失敗")//出差申請單號ajax
        }
    }
}

//請款類別控制
function fun_ExpenseKindChange(val) {
    switch (val) {
        case "EMP_TRAVEL_EXP"://出差
            //$("#Rate").attr("readonly", "").addClass("input-disable").prop('disabled', true);
            //$("#NoEditExchangeRate").show();
            // $("#Rate").hide();
            $("#TravelNum").attr("necessary", "")
            $("#divTravelNum").show(200);

            break;
        case "EMP_OTHER_EXP"://其他代墊

            //$("#ExchangeRate").removeAttr("readonly", "").removeClass("input-disable").prop('disabled', false);
            // $("#NoEditExchangeRate").hide();
            // $("#Rate").show();
            $("#TravelNum").removeAttr("necessary")
            $("#divTravelNum").hide(200);
            break;
        case "EMP_MGR_EXP"://經理人交通津貼

            //  $("#ExchangeRate").removeAttr("readonly", "").removeClass("input-disable").prop('disabled', false);
            // $("#NoEditExchangeRate").hide();
            // $("#Rate").show();
            $("#TravelNum").removeAttr("necessary")
            $("#divTravelNum").hide(200);
            break;
    }

    fun_TransControl(val)
}

//交通津貼專用區
{
    //請款類別切換 交通津貼控制項控制
    function fun_TransControl(val) {
        if (val == "EMP_MGR_EXP") {
            $("[alt=TransportationOnly]").show();
            $("[alt=TransportationNoShow]").hide();

            $("#TransAllowanceDate").attr("necessary", "")

            $("#HeaderDesc").removeAttr("necessary", "")
            //  $("#CertificateAmount").removeAttr("necessary", "")
            //  $("#CertificateAmount").attr("name", "nouse")
            //$("#VoucherBeau").removeAttr("necessary", "")

            Err = fun_TransportationCheck()
            if (Err != "") {
                alert(Err)
            }
        }
        else {
            $("[alt=TransportationOnly]").hide();
            $("[alt=TransportationNoShow]").show();

            $("#TransAllowanceDate").removeAttr("necessary", "")

            $("#HeaderDesc").attr("necessary", "")
            //$("#CertificateAmount").attr("necessary", "")
            // $("#CertificateAmount").attr("name", "CertificateAmount")
            $("#VoucherBeau").attr("necessary", "")

            $("#tab_TrnasInvoiceDetail tbody tr").not("[alt=no-data]").not("[alt=Delete]").each(function () {
                if ($(this).find("[alt=LineNum]").val() <= 0) {
                    $(this).remove()
                }
                else {
                    $(this).hide()
                    $(this).find("[alt=Index]").attr("alt", "Delete")
                    $(this).find("[alt=IsDelete]").val(true)
                }
            })
            $("#tab_TrnasInvoiceDetail tr[alt=no-data]").show()
        }
    }

    //交通津貼請款明細載入
    function fun_TransDetail(Data) {
        if (Data != null) {
            $("#tab_TrnasInvoiceDetail tbody tr[alt=no-data]").hide();
            let obj = $("#Copy_tab_TrnasInvoiceDetail").find("[alt=CopyTr]").clone();
            $(obj).find("[alt=Index]").text(funAddheadZero(4, $("#tab_TrnasInvoiceDetail tbody tr").not("[alt=no-data]").length + 1))

            $(obj).find("[alt=LineNum]").val(Data.LineNum)

            $(obj).find("[alt=OriginalAmount]").val(Data.OriginalAmount)
            $(obj).find("[alt=Currency]").val(Data.Currency)
            $(obj).find("[alt=CurrencyName]").val(Data.CurrencyName)
            $(obj).find("[alt=Rate]").val(Data.Rate)
            $(obj).find("[alt=AcceptanceAmount]").val(Data.AcceptanceAmount)
            $(obj).find("[alt=TWDAmount]").val(Data.TWDAmount)
            $(obj).find("[alt=TWDSaleAmount]").val(Data.TWDSaleAmount)

            $(obj).find("[alt=PaymentCategory]").html($("#PaymentCategory").html())
            $(obj).find('.selectpicker').data('selectpicker', null);
            $(obj).find('.bootstrap-select').find("button:first").remove();
            $(obj).find(".selectpicker").selectpicker("refresh")

            $(obj).find("[alt=PaymentMidCategory]").empty().attr("selectedIndex", 0).prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').selectpicker('refresh');
            $(obj).find("[alt=StartStationCode]").removeAttr("necessary", "").empty().attr("selectedIndex", 0).prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').selectpicker('refresh');
            $(obj).find("[alt=EndStationCode]").removeAttr("necessary", "").empty().attr("selectedIndex", 0).prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').selectpicker('refresh');

            fun_TransControlAction(obj)

            if (Data.PaymentCategory) {
                $(obj).find("[alt=PaymentCategory]").val(Data.PaymentCategory).selectpicker("refresh");
                $(obj).find("[alt=PaymentCategory]").change();
            }
            $(obj).find("[alt=PaymentCategory]").find(".selectpicker").selectpicker("refresh")

            if (Data.PaymentMidCategory) {
                $(obj).find("[alt=PaymentMidCategory]").val(Data.PaymentMidCategory).selectpicker("refresh");
                $(obj).find("[alt=PaymentMidCategory]").change();
            }
            if (Data.StartStationCode) {
                $(obj).find("[alt=StartStationCode]").val(Data.StartStationCode).selectpicker("refresh");
                $(obj).find("[alt=StartStationCode]").change();
            }
            if (Data.EndStationCode) {
                $(obj).find("[alt=EndStationCode]").val(Data.EndStationCode).selectpicker("refresh");
                $(obj).find("[alt=EndStationCode]").change();
            }

            $("#tab_TrnasInvoiceDetail tbody").append(obj);
        }
    }

    //交通津貼計算
    function fun_TransportationCheck() {
        Err = "";
        EMPTransportationMaxPay = parseInt($("#TransportationMaxPay").val())
        target = $("#table_Transportation tbody");
        $(target).find("td").eq(0).text(0)
        $(target).find("td").eq(1).text(0)
        $(target).find("td").eq(2).text(0)
        $(target).find("td").eq(3).text(0)
        $(target).find("td").eq(4).text(0)

        $("#PaymentAmount").val(0)

        if (EMPTransportationMaxPay > 0) {
            let OriginalAmount = 0

            $("#tab_TrnasInvoiceDetail tbody tr").not("[alt=no-data]").not("[alt=Deleted]").each(function () {
                OriginalAmount += accounting.unformat($(this).find("[alt=OriginalAmount]").val())
            })

            if (!isNaN(OriginalAmount) && OriginalAmount >= 0) {
                if (OriginalAmount > EMPTransportationMaxPay) {
                    lostPay = 0;
                }
                else {
                    lostPay = EMPTransportationMaxPay - OriginalAmount;
                }

                cost = Math.ceil(lostPay * 0.05)//無條件進位
                $(target).find("td").eq(0).text(fun_accountingformatNumberdelzero(EMPTransportationMaxPay))
                $(target).find("td").eq(1).text(fun_accountingformatNumberdelzero(OriginalAmount))
                $(target).find("td").eq(2).text(fun_accountingformatNumberdelzero(lostPay))
                $(target).find("td").eq(3).text(fun_accountingformatNumberdelzero(cost))
                $(target).find("td").eq(4).text(fun_accountingformatNumberdelzero(EMPTransportationMaxPay - cost))

                $("#PaymentAmount").val(EMPTransportationMaxPay - cost)
            }
            else {
                Err = "金額試算異常";
            }
        }
        else {
            Err = "不符合交通津貼申請規則";
        }

        return Err;
    }

    //新增請款明細
    function fun_AddTransDetail() {
        let obj = $("#Copy_tab_TrnasInvoiceDetail").find("[alt=CopyTr]").clone();
        obj.find("[alt=PaymentCategory]").html($("#PaymentCategory").html())
        obj.find("[alt=PaymentCategory]").val("")

        obj.find('.selectpicker').data('selectpicker', null);
        obj.find('.bootstrap-select').find("button:first").remove();
        obj.find(".selectpicker").selectpicker("refresh")

        fun_TransControlAction(obj)

        $(obj).find("[alt=PaymentMidCategory]").empty().attr("selectedIndex", 0).prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').selectpicker('refresh');
        $(obj).find("[alt=StartStationCode]").removeAttr("necessary", "").empty().attr("selectedIndex", 0).prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').selectpicker('refresh');
        $(obj).find("[alt=EndStationCode]").removeAttr("necessary", "").empty().attr("selectedIndex", 0).prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').selectpicker('refresh');

        $("#tab_TrnasInvoiceDetail tbody").find("tr[alt=no-data]").hide();
        $("#tab_TrnasInvoiceDetail tbody").append(obj);

        fun_resetCellIndex($("#tab_TrnasInvoiceDetail"), "Index", 4)
    }

    //移除請款明細
    function fun_RemoveTransDetail(target) {
        if (confirm("是否確認刪除該筆資料")) {
            amount = accounting.unformat($(target).closest("tr").find("[alt=OriginalAmount]").val())

            if ($(target).closest("tr").find("[alt=LineNum]").val() == 0) {
                $(target).closest("tr").remove();
            }
            else {
                $(target).closest("tr").attr("alt", "Deleted")
                $(target).closest("tr").find("[alt=Index]").attr("alt", "Deleted")
                $(target).closest("tr").find("[alt=IsDelete]").val(true)
                $(target).closest("tr").hide()
            }

            if ($("#tab_TrnasInvoiceDetail tbody tr").not("[alt=no-data]").not("[alt=Deleted]").length == 0) {
                $("#tab_TrnasInvoiceDetail tbody tr[alt=no-data]").show();
            }
            else {
                fun_resetCellIndex($("#tab_TrnasInvoiceDetail"), "Index", 4)
            }

            CertificateAmount = $("input[name=CertificateAmount]").val()
            $("input[name=CertificateAmount]").val(CertificateAmount - amount)
            $("#span_CertificateAmount").text(fun_accountingformatNumberdelzero(CertificateAmount - amount))
        }
    }

    //填值換名稱
    function fun_SetTransValue() {
        let i = 0
        $("#tab_TrnasInvoiceDetail tbody tr").not("[alt=no-data]").each(function () {
            $(this).find("input").each(function () {
                $(this).attr("name", "DetailList[" + i + "]." + $(this).attr("alt"));
            })
            $(this).find("select").each(function () {
                $(this).attr("name", "DetailList[" + i + "]." + $(this).attr("alt"));
            })
            $(this).find("[alt=PaymentCategoryName]").val($(this).find("[alt=PaymentCategory]").find("option:selected").text())
            $(this).find("[alt=PaymentMidCategoryName]").val($(this).find("[alt=PaymentMidCategory]").find("option:selected").text())
            if ($(this).find("[alt=StartStationCode]").val() != "") {
                $(this).find("[alt=StartStationName]").val($(this).find("[alt=StartStationCode]").find("option:selected").text())
            }
            if ($(this).find("[alt=EndStationCode]").val() != "") {
                $(this).find("[alt=EndStationName]").val($(this).find("[alt=EndStationCode]").find("option:selected").text())
            }
            OriginalAmount = accounting.unformat($(this).find("[alt=OriginalAmount]").val())
            $(this).find("[alt=AcceptanceAmount]").val(OriginalAmount)
            $(this).find("[alt=TWDAmount]").val(OriginalAmount)
            $(this).find("[alt=TWDSaleAmount]").val(OriginalAmount)
            i += 1;
        })
    }

    //綁定控項動作
    function fun_TransControlAction(target) {
        //金額欄位動作
        $(target).find("input[Amount]").on("focus", function () {
            fun_onfocusAction(this);

            amount = accounting.unformat($(this).val())
            CertificateAmount = accounting.unformat($("input[name=CertificateAmount]").val())
            $("input[name=CertificateAmount]").val(CertificateAmount - amount)
            $("#span_CertificateAmount").text(fun_accountingformatNumberdelzero(CertificateAmount - amount))
        })
        $(target).find("input[Amount]").on("blur", function () {
            fun_onblurAction(this);

            amount = accounting.unformat($(this).val())
            CertificateAmount = accounting.unformat($("input[name=CertificateAmount]").val())
            $("input[name=CertificateAmount]").val(CertificateAmount + amount)
            $("#span_CertificateAmount").text(fun_accountingformatNumberdelzero(CertificateAmount + amount))
        })

        $(target).find("[alt=PaymentCategory]").on("change", function () {
            $(this).nextAll("[Errmsg=Y]").remove();
            let obj = $(this).closest("tr")

            $(obj).find("[alt=PaymentCategoryName]").val($(this).find("option:selected").text())
            $(obj).find("[alt=PaymentMidCategoryName]").val("")
            $(obj).find("[alt=ExpenseAttribute]").val("")
            $(obj).find("[alt=ExpenseAttributeName]").val("")
            $(obj).find("[alt=StartStationName]").val("")
            $(obj).find("[alt=EndStationName]").val("")

            $(obj).find("[alt=StartStationCode]").removeAttr("necessary", "").empty().attr("selectedIndex", 0).prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').selectpicker('refresh');
            $(obj).find("[alt=EndStationCode]").removeAttr("necessary", "").empty().attr("selectedIndex", 0).prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').selectpicker('refresh');

            $(obj).find("[alt=PaymentMidCategory]").empty();
            $(obj).find("[alt=PaymentMidCategory]").attr("selectedIndex", 0)
            $(obj).find("[alt=PaymentMidCategory]").selectpicker('setStyle', 'input-disable', 'add');
            $(obj).find("[alt=aymentMidCategory]").prop('disabled', true);

            $(obj).find("[alt=StartStationCode]").nextAll("[Errmsg='Y']").remove()
            $(obj).find("[alt=EndStationCode]").nextAll("[Errmsg='Y']").remove()

            $(obj).find("[alt=PaymentCategory]")._ajax("/EMP/GetPaymentMidCategoryItems", { PaymentKind: $("#ExpenseKind").val(), PaymentCategory: $(this).val() },
            function (data) {
                var rtn = {
                    true: ""
                }
                if (data) {
                    fun_setSelectOption($(obj).find("[alt=PaymentMidCategory]"), data)
                    $(obj).find("[alt=PaymentMidCategory]").selectpicker('setStyle', 'input-disable', 'remove')
                    $(obj).find("[alt=PaymentMidCategory]").prop('disabled', false).selectpicker('refresh');;
                }
                else {
                    rtn = {
                        false: "獲取請款中類清單失敗"
                    }
                }
            }, "獲取請款中類清單失敗")

            $(obj).find("[alt=PaymentMidCategory]").selectpicker('refresh')
        })//請款大類更改動作

        $(target).find("[alt=PaymentMidCategory]").on("change", function () {
            $(this).nextAll("[Errmsg=Y]").remove();
            let obj = $(this).closest("tr")

            $(obj).find("[alt=PaymentMidCategoryName]").val($(this).find("option:selected").text())
            $(obj).find("[alt=ExpenseAttribute]").val("")
            $(obj).find("[alt=ExpenseAttributeName]").val("")
            $(obj).find("[alt=StartStationName]").val("")
            $(obj).find("[alt=EndStationName]").val("")
            $(obj).find("[alt=NeedCertificate]").val("")

            let paymentCategoryt = $(obj).find("[alt=PaymentCategory]").val()
            $(obj).find("[alt=StartStationCode]").removeAttr("necessary", "").empty().attr("selectedIndex", 0).prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').selectpicker('refresh');
            $(obj).find("[alt=EndStationCode]").removeAttr("necessary", "").empty().attr("selectedIndex", 0).prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').selectpicker('refresh');
            $(obj).find("[alt=StartStationCode]").nextAll("[Errmsg='Y']").remove()
            $(obj).find("[alt=EndStationCode]").nextAll("[Errmsg='Y']").remove()

            $(obj)._ajax("/EMP/GetExpenseStandard", { MaxItemNo: paymentCategoryt, MidItemNo: $(this).val() },
                 function (data) {
                     var rtn = {
                         true: ""
                     }
                     if (data.IsSuccess) {
                         $(data.Detail).each(function (index, info) {
                             $(obj).find("[alt=ExpenseAttribute]").val(info.ExpenseKind)
                             $(obj).find("[alt=ExpenseAttributeName]").val(info.ExpenseKindName)
                             $(obj).find("[alt=NeedCertificate]").val(info.NeedCertificate)
                             if (!(info.CarbonFootPrint == null || info.CarbonFootPrint == 0)) {
                                 console.log(info.CarbonFootPrint)
                                 $(obj).find("[alt=StartStationCode]")._ajax("/EMP/GetCodeitem", { CodeKind: 9, ParentItemNo: info.CarbonFootPrint },
                                 function (data) {
                                     var rtn = {
                                         true: ""
                                     }
                                     if (data.IsSuccess) {
                                         fun_setSelectOption($(obj).find("[alt=StartStationCode]"), data.Detail, true)
                                         fun_setSelectOption($(obj).find("[alt=EndStationCode]"), data.Detail, true)
                                     }
                                     else {
                                         rtn = {
                                             false: data.Message
                                         }
                                     }
                                 }, "獲取站名清單失敗")

                                 $(obj).find("[alt=StartStationCode]").attr("necessary", "").removeAttr("readonly", "").prop("disabled", false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker("refresh")
                                 $(obj).find("[alt=EndStationCode]").attr("necessary", "").removeAttr("readonly", "").prop("disabled", false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker("refresh")
                             }

                             return false
                         })
                     }
                     else {
                         rtn = {
                             false: data.Message
                         }
                     }
                 }, "獲取費用性質清單失敗")
        })//請款中類更改動作

        $(target).find("[alt=StartStationCode]").on("change", function () {
            $(this).nextAll("[Errmsg=Y]").remove();
            let obj = $(this).closest("tr")
            $(obj).find("[alt=StartStationName]").val($(this).find("option:selected").text())
        })//站名起更改動作

        $(target).find("[alt=EndStationCode]").on("change", function () {
            $(this).nextAll("[Errmsg=Y]").remove();
            let obj = $(this).closest("tr")
            $(obj).find("[alt=EndStationName]").val($(this).find("option:selected").text())
        })//站名起更改動作
    }
}

//實際請款人資料處理
function fun_subVendorNum(data, _AccountInfoReset) {
    //$("#empName").val(data.EMPName)
    let AccountInfoReset = true
    if (typeof (_AccountInfoReset) == "boolean") { AccountInfoReset = _AccountInfoReset }

    $("#IsCardEmp").val(data.IsCardEmp);
    $("#TransportationMaxPay").val(data.TransportationMaxPay);
    $("#TripPayType").val(data.TripPayType);
    $("#EmpCostProfitCenter").val(data.CostProfitCenter);
    $("#PayAlone").prop("checked", data.PayAlone)
    $("#taxCode").val(data.TaxInfo.taxCode);
    $("#IncomeNum").val(data.TaxInfo.IncomeNum);
    $("#CertficateKind").val(data.TaxInfo.CertficateKind);
    $("#PermanentPostNum").val(data.TaxInfo.PermanentPostNum);
    $("#PermanentAddress").val(data.TaxInfo.PermanentAddress);
    $("#ContactPostNum").val(data.TaxInfo.ContactPostNum);
    $("#ContactAddress").val(data.TaxInfo.ContactAddress);
    //$("#LeaseCode").val(data.TaxInfo.LeaseCode);
    //$("#LeaseAddress").val(data.TaxInfo.LeaseAddress);
    $("#TwoHeathInsuranceFlag").val(data.TaxInfo.TwoHeathInsuranceFlag);
    $("#Remittance").val(data.Remittance);
    if (AccountInfoReset) {
        $("#PaymentBranch").val(data.Branch).selectpicker('refresh');
        $("#BranchName").val(data.BranchName)
        $("#AccountName").val(data.AccountName);
        $("#AccountNum").val(data.AccountNum);
    }
    $("#IncomeCode").val(data.TaxInfo.IncomeCode);

    $("#VendorID").val(data.VendorID)
    $("#LocationID").val(data.VendorSiteId);
    $("#VendorSiteCode").val(data.VendorSiteDesc);
    $("#CarNum").val(data.CarNum);

    $("#CarContractDate").val(data.CarContractDate)

    $("#PaymentBranch").nextAll("[Errmsg=Y]").remove();
    $("#AccountName").nextAll("[Errmsg=Y]").remove();
    $("#AccountNum").nextAll("[Errmsg=Y]").remove();

    //分攤明細層資料處理
    $("select[alt=ExpenseAttribute]").empty()
    //$("#tab_copyInvoiceDetail").find("[alt=CostProfitCenter]").find("option[value='" + data.CostProfitCenter + "']").prop("selected", true).selectpicker('refresh');
    //$("#tab_copyInvoiceDetail").find("[alt=AccountBank]").find("option[value='" + data.CostProfitCenter + "']").prop("selected", true).selectpicker('refresh');

    console.log("CostProfitCenter:" + data.CostProfitCenter)

    //是否為卡處人員
    if (data.IsCardEmp) {
        //分攤層費用性質開放

        $("select[alt=ExpenseAttribute]")._ajax("/EMP/GetExpenseAttributeFullName", { FromID: $("#EmpNum").val() },
           function (data) {
               var rtn = {
                   true: ""
               }
               if (data.IsSuccess) {
                   fun_setSelectOption($("select[alt=ExpenseAttribute]"), data.Detail, true)
               }
               else {
                   rtn = {
                       false: data.Message
                   }
               }
           }, "獲取費用性質清單失敗")

        $("select[alt=ExpenseAttribute]").attr("necessary", "")
        $("select[alt=ExpenseAttribute]").removeAttr("readonly", "")
        $("select[alt=ExpenseAttribute]").selectpicker('setStyle', 'input-disable', 'remove');
        //  $("select[alt=ExpenseAttribute]").removeClass('input-disable');
        $("select[alt=ExpenseAttribute]").prop('disabled', false);
    }
    else {
        $("select[alt=ExpenseAttribute]").removeAttr("necessary", "")
        $("select[alt=ExpenseAttribute]").attr("readonly", "")
        // $("select[alt=ExpenseAttribute]").addClass('input-disable');
        $("select[alt=ExpenseAttribute]").prop('disabled', true);
        $("select[alt=ExpenseAttribute]").selectpicker('setStyle', 'input-disable', 'add');
    }

    if ($("#ExpenseKind").val() == "EMP_MGR_EXP") {
        Err = fun_TransportationCheck()
        if (Err != "") {
            alert(Err)
        }
    }
}

//憑證開立對象資料處理
function fun_VoucherBeau(data) {
    $.each(data, function (index, Info) {
        $("#VoucherBeau").append($("<option ></option>").attr("value", Info.bANNumber).text(Info.bANNumber + " " + Info.businessEntity).data("text", Info.businessEntity)
                           .data("Books", Info.accountCode).data("BooksName", Info.accountName).data("isCreditCardOffice", Info.isCreditCardOffice).data("gvDeclaration", Info.gvDeclaration));
    })
    $("#VoucherBeau").selectpicker('refresh');
}

//出差申請單號資料處理
function fun_subTravelNum(data) {
    $("#TravelNum").empty();
    $("#StartTripDate").val("")
    $("#EndTripDate").val("")
    $("#_StartTripDate").text("系統自動帶入")
    $("#_EndTripDate").text("系統自動帶入")
    $("#TripUSAExchangeRate").val(0)

    //console.log(JSON.stringify(data))

    if ($(data).length > 0) {
        $("#TravelNum").selectpicker({ title: "請選擇出差申請單號" })
        $.each(data, function (Index, Info) {
            $("#TravelNum").append($("<option></option>").attr("value", Info.businessTripApplicationNumber).text(Info.businessTripApplicationNumber)
                    .data("StartTripDate", Info.Date_businessTripFromDate).data("EndTripDate", Info.Date_businessTripEndDate));
        });

        $("#TravelNum").selectpicker('setStyle', 'input-disable', 'remove').prop('disabled', false).selectpicker('refresh');
    }
    else {
        $("#TravelNum").selectpicker({ title: "無可供申請之出差申請單號" }).selectpicker('setStyle', 'input-disable', 'add').prop('disabled', true).selectpicker("refresh")
    }
}

function fun_TravelNumChange() {
    StartTripDate = $("#TravelNum").find("option:selected").data("StartTripDate")
    EndTripDate = $("#TravelNum").find("option:selected").data("EndTripDate")

    if (StartTripDate != null && EndTripDate != null) {
        $("#StartTripDate").val(StartTripDate)
        $("#EndTripDate").val(EndTripDate)

        $("#_StartTripDate").text(StartTripDate)
        $("#_EndTripDate").text(EndTripDate)
        $("#_StartTripDate").removeClass("undone-text")
        $("#_EndTripDate").removeClass("undone-text")

        $(this)._ajax("/EMP/GetEndTripConversionRate", { FromID: $("#EmpNum").val(), CurrencyCode: "USD", EndTripDate: EndTripDate },
            function (data) {
                var rtn = {
                    true: ""
                }
                if (data.IsSuccess) {
                    $("#TripUSAExchangeRate").val(data.Detail)
                }
                else {
                    $("#TripUSAExchangeRate").val(0)
                    rtn = {
                        false: data.Message
                    }
                }
                return rtn
            }, "獲取出差日美元匯率失敗")

        havetrip = false;
    }
    else {
        fun_AddErrMesg($("#TravelNum"), "Err_TravelNum", "出差單號資訊有誤");
        $("#StartTripDate").val("")
        $("#EndTripDate").val("")

        $("#_StartTripDate").text("系統自動帶入")
        $("#_EndTripDate").text("系統自動帶入")
        $("#_StartTripDate").addClass("undone-text")
        $("#_EndTripDate").addClass("undone-text")
        $("#TripUSAExchangeRate").val(0);
    }
}

///請款明細跳窗

//請款明細初始設定
function fun_PopInvoiceInfoStartAction() {
    $("#PaymentCategory").on("change", function () {
        $("#NeedCertificate").addClass("undone-text").text("系統自動帶入");
        $("#Station").hide(200);
        $("#StartStationCode").val("").removeAttr("necessary", "").selectpicker('refresh')
        $("#EndStationCode").val("").removeAttr("necessary", "").selectpicker('refresh')
        $("#City").hide(200)
        $("#EndCityCode").val("").removeAttr("necessary", "").selectpicker('refresh')
        $("#StartCityCode").val("").removeAttr("necessary", "").selectpicker('refresh')

        $("#PaymentMidCategory").empty();
        $("#PaymentMidCategory").attr("selectedIndex", 0)
        $("#PaymentMidCategory").selectpicker('setStyle', 'input-disable', 'add');
        $("#PaymentMidCategory").prop('disabled', true);

        $("#ExpenseAttribute").empty();
        $("#ExpenseAttribute").attr("selectedIndex", 0)
        $("#ExpenseAttribute").selectpicker('setStyle', 'input-disable', 'add');
        $("#ExpenseAttribute").prop('disabled', true);

        $("#PaymentMidCategory")._ajax("/EMP/GetPaymentMidCategoryItems", { PaymentKind: $("#ExpenseKind").val(), PaymentCategory: $(this).val() },
             function (data) {
                 var rtn = {
                     true: ""
                 }
                 if (data) {
                     fun_setSelectOption($("#PaymentMidCategory"), data)
                     $("#PaymentMidCategory").selectpicker('setStyle', 'input-disable', 'remove')
                     $("#PaymentMidCategory").prop('disabled', false).selectpicker('refresh');;
                 }
                 else {
                     rtn = {
                         false: "獲取請款中類清單失敗"
                     }
                 }
             }, "獲取請款中類清單失敗")

        $("#PaymentMidCategory").selectpicker('refresh')
        $("#ExpenseAttribute").selectpicker('refresh')
    })//請款大類更改動作

    $("#PaymentMidCategory").on("change", function () {
        $("#NeedCertificate").addClass("undone-text").text("系統自動帶入");
        $("#Station").hide(200);
        $("#StartStationCode").val("").removeAttr("necessary", "").selectpicker('refresh')
        $("#EndStationCode").val("").removeAttr("necessary", "").selectpicker('refresh')
        $("#City").hide(200)
        $("#EndCityCode").val("").removeAttr("necessary", "").selectpicker('refresh')
        $("#StartCityCode").val("").removeAttr("necessary", "").selectpicker('refresh')

        if ($("#InvoiceExpenseDesc").val().length == 0) {
            $("#InvoiceExpenseDesc").val($("#PaymentMidCategory").find("option:selected").text())
        }

        $("#ExpenseAttribute").empty();
        $("#ExpenseAttribute").selectpicker('setStyle', 'input-disable', 'add');
        $("#ExpenseAttribute").prop('disabled', true);
        $("#ExpenseAttribute").attr("selectedIndex", 0)
        $("#ExpenseAttribute")._ajax("/EMP/GetExpenseStandard", { MaxItemNo: $("#PaymentCategory").val(), MidItemNo: $(this).val() },
             function (data) {
                 var rtn = {
                     true: ""
                 }
                 if (data.IsSuccess) {
                     $(data.Detail).each(function (index, info) {
                         $("#ExpenseAttribute").append($("<option></option>").attr("value", info.ExpenseKind).text(info.ExpenseKindName)
                             .data("AccountingCode", info.AccountingCode).data("AccountingName", info.AccountingName).data("NeedCertificate", info.NeedCertificate)
                             .data("CarbonFootPrint", info.CarbonFootPrint).data("BillKind", info.BillKind).data("IsDeduction", info.IsDeduction)
                             .data("PayKind", info.PayKind).data("AmountLimitLV1", info.AmountLimitLV1).data("AmountLimitLV2", info.AmountLimitLV2)
                             );
                     })

                     $("#ExpenseAttribute").selectpicker('setStyle', 'input-disable', 'remove').selectpicker('refresh');
                     $("#ExpenseAttribute").prop('disabled', false);
                 }
                 else {
                     rtn = {
                         false: data.Message
                     }
                 }
             }, "獲取費用性質清單失敗")

        $("#ExpenseAttribute").selectpicker('refresh')
    })//請款中類更改動作

    $("#ExpenseAttribute").on("change", function () {
        $("#StartStationCode").empty();
        $("#EndStationCode").empty();
        $("#StartCityCode").val("").selectpicker('refresh')
        $("#EndCityCode").val("").selectpicker('refresh')

        selectedOption = $(this).find("option:selected");

        $("[alt=AccountingItem]").val($(selectedOption).data("AccountingCode"))
        $("[alt=AccountingItemName]").text($(selectedOption).data("AccountingName"))

        if ($(selectedOption).data("NeedCertificate")) $("#NeedCertificate").removeClass("undone-text").text("Y")
        else $("#NeedCertificate").removeClass("undone-text").text("N")
        if (!($(selectedOption).data("CarbonFootPrint") == null || $(selectedOption).data("CarbonFootPrint") == 0)) {
            $("#Station")._ajax("/EMP/GetCodeitem", { CodeKind: 9, ParentItemNo: $(selectedOption).data("CarbonFootPrint") },
             function (data) {
                 var rtn = {
                     true: ""
                 }
                 if (data.IsSuccess) {
                     fun_setSelectOption($("#StartStationCode"), data.Detail, true)
                     fun_setSelectOption($("#EndStationCode"), data.Detail, true)
                 }
                 else {
                     rtn = {
                         false: data.Message
                     }
                 }
             }, "獲取站名清單失敗")

            $("#Station").show(200);
            $("#StartStationCode").attr("necessary", "")
            //$("#StartStationtitle").html("<b class=\"float-left\">站名(起)</b>  <b class=\"required-icon\">*</b>");
            $("#EndStationCode").attr("necessary", "")
            // $("#EndStationtitle").html("<b class=\"float-left\">站名(迄)</b>  <b class=\"required-icon\">*</b>");
        }
        else {
            $("#Station").hide(200);
            $("#StartStationCode").removeAttr("necessary", "")
            // $("#StartStationtitle").html("<b class=\"float-left\">站名(起)</b>");
            $("#EndStationCode").removeAttr("necessary", "")
            //$("#EndStationtitle").html("<b class=\"float-left\">站名(迄)</b>");
        }

        if (!($(selectedOption).data("PayKind") == null || $(selectedOption).data("PayKind") == 0)) {
            $("#StartCityCode").attr("necessary", "")
            //  $("#StartCitytitle").html("<b class=\"float-left\">城市(起)</b>  <b class=\"required-icon\">*</b>");
            $("#EndCityCode").attr("necessary", "")
            //   $("#EndCitytitle").html("<b class=\"float-left\">城市(迄)</b>  <b class=\"required-icon\">*</b>");
            $("#City").show(200)
        }
        else {
            $("#StartCityCode").removeAttr("necessary", "")
            // $("#StartCitytitle").html("<b class=\"float-left\">城市(起)</b>");

            $("#EndCityCode").removeAttr("necessary", "")
            // $("#EndCitytitle").html("<b class=\"float-left\">城市(迄)</b>");
            $("#City").hide(200)
        }
    })//屬性項目更改動作

    $("#CertificateKind").on("change", function () {
        if ($(this).val() == 1) {//發票
            $("#TaxIdNum").attr("necessary", "")
            $("#CertificateNum").attr("necessary", "").attr("maxlength", 10)
            $("#CertificateNum").val($("#CertificateNum").val().substr(0, 10))

            $("#EstimateVoucherDate").attr("necessary", "")
            /*
             $("#InvoiceOriginalTax").removeClass("input-disable");
             $("#InvoiceOriginalTax").prop("disabled", false)*/
            $("#InvoiceOriginalTax").show()
            $("#InvoiceOriginalTax").removeAttr("readonly", "")
            $("#NoEditInvoiceOriginalTax").hide()
            // $("#TaxIdNumTitle").html("<b class=\"float-left\">銷售(賣)方統一編號</b>  <b class=\"required-icon\">*</b>");
            $("#TaxIdNumStarMark").show()
            // $("#CertificateNumtitle").html("<b class=\"float-left\">憑證(發票)號碼</b>  <b class=\"required-icon\">*</b>");
            $("#CertificateNumStarMark").show();
            $("#EstimateVoucherDateTitle").html("<b class=\"float-left\">憑證日期</b>  <b class=\"required-icon\">*</b>");
        }
        else {
            $("#TaxIdNum").removeAttr("necessary")
            $("#CertificateNum").removeAttr("necessary")
            $("#EstimateVoucherDate").removeAttr("necessary")
            $("#CertificateNum").attr("maxlength", 15)

            /* $("#InvoiceOriginalTax").prop("disabled", true)
             $("#InvoiceOriginalTax").addClass("input-disable")*/
            $("#InvoiceOriginalTax").hide()
            $("#InvoiceOriginalTax").attr("readonly", "")
            $("#NoEditInvoiceOriginalTax").show()
            $("#InvoiceOriginalTax").val(0);
            $("#NoEditInvoiceOriginalTax span").text(0);

            // $("#TaxIdNumTitle").html("<b class=\"float-left\">銷售(賣)方統一編號</b>");
            $("#TaxIdNumStarMark").hide()
            // $("#CertificateNumtitle").html("<b class=\"float-left\">憑證(發票)號碼</b>");
            $("#CertificateNumStarMark").hide();
            $("#EstimateVoucherDateTitle").html("<b class=\"float-left\">憑證日期</b>");

            $("[alt=ErrTaxIdNum]").remove();
            $("[alt=ErrCertificateNum]").remove();
            $("[alt=ErrEstimateVoucherDate]").remove();
            $("[alt=ErrInvoiceOriginalTax]").remove();

            $("#InvoiceOriginalTax").next("[Errmsg=Y]").remove();
        }

        if ($("#EstimateVoucherDate").val().length > 0) {
            $("#EstimateVoucherDate").blur();
        }

        fun_InvoiceAmountCalculate()
    })//憑證類別更改動作

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

    $("#Currency").on("change", function () {
        $("[alt=ErrRate]").remove()
        if ($(this).val() == "TWD") {//幣別為台幣不開放編輯
            $("#Rate").val(1).hide(200)
            $("#NoEditExchangeRate").show(200)
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
                if ($("#EndTripDate").val().length == 0) {
                    $("#Rate").val(0)
                    $("#NoEditExchangeRate span").text(0)
                    alert("無法依據出差迄日換算匯率，請選擇正確之出差申請單號。");
                }
                else {
                    $("#Rate")._ajax("/EMP/GetEndTripConversionRate", { FromID: $("#EmpNum").val(), CurrencyCode: $(this).val(), EndTripDate: $("#EndTripDate").val() },
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
        $("#OriginalAmount").val(0)
        $("#TWDAmount").val(0);
        $("#TWDTaxAmount").val(0);
        // $("#_OriginalAmount").val("");
        $("#_TWDAmount").val("");
        //$("#_TWDTaxAmount").val("");
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

        //清空金額欄位
        $("#OriginalAmount").val(0)
        $("#TWDAmount").val(0);
        $("#TWDTaxAmount").val(0);
        //$("#_OriginalAmount").val("").attr("Accuracy", CurrencyPrecise);
        $("#_TWDAmount").val("");
        // $("#_TWDTaxAmount").val("");

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
                fun_InvoiceAmountCalculate();
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
                fun_InvoiceAmountCalculate();
            }
            else {
                fun_AddErrMesg($("#InvoiceOriginalAmount"), "ErrInvoiceOriginalAmount", "金額(原幣) 小於 稅額(原幣)");
            }
        }
    })//稅額(原幣)更換動作

    $("#ProjectCategory").on("change", function () {
        $("#Project").empty();
        $("#Project").attr("selectedIndex", 0)

        $("#Project").selectpicker('setStyle', 'input-disable', 'add');
        $("#Project").prop('disabled', true);

        $("#ProjectItem").empty();
        $("#ProjectItem").attr("selectedIndex", 0)
        $("#ProjectItem").selectpicker('setStyle', 'input-disable', 'add');
        $("#ProjectItem").prop('disabled', true);

        if ($(this).val()) {
            $("#Project").attr("necessary", "")
            $("#ProjectItem").attr("necessary", "")

            $("#Project")._ajax("/Project/GetProjectDropMenu", { ProjectCategoryCode: $(this).val() },
                function (data) {
                    var rtn = {
                        true: ""
                    }
                    if (data) {
                        fun_setSelectOption($("#Project"), data)
                        $("#Project").selectpicker('setStyle', 'input-disable', 'remove');
                        $("#Project").prop('disabled', false);
                    }
                }, "獲取專案清單失敗")
        }
        else {
            $("#Project").removeAttr("necessary")
            $("#ProjectItem").removeAttr("necessary")
            $("#Project").nextAll("[Errmsg=Y]").remove();
            $("#ProjectItem").nextAll("[Errmsg=Y]").remove();
        }

        $("#Project").selectpicker('refresh')
        $("#ProjectItem").selectpicker('refresh')
    })//專案類別更改動作

    $("#Project").on("change", function () {
        $("#ProjectItem").empty();
        $("#ProjectItem").attr("selectedIndex", 0)
        $("#ProjectItem").selectpicker('setStyle', 'input-disable', 'add');
        $("#ProjectItem").prop('disabled', true);

        $("#Project")._ajax("/Project/GetProjectItemDropMenu", { ProjectID: $(this).val() },
            function (data) {
                var rtn = {
                    true: ""
                }
                if (data) {
                    fun_setSelectOption($("#ProjectItem"), data)
                    $("#ProjectItem").selectpicker('setStyle', 'input-disable', 'remove');
                    $("#ProjectItem").prop('disabled', false);
                }
            }, "獲取專案項目清單失敗")

        $("#ProjectItem").selectpicker('refresh')
    })//專案更改動作

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
                Rate = accounting.unformat($("#Rate").val());
                if (!isNaN(OriginalAmortizationAmount) && !isNaN(Rate))

                    $(this).closest("tr").find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(accounting.toFixed(OriginalAmortizationAmount * Rate)))
            }
        })

        //$(tmp).find("[alt=AccountingItem]").find("option[value='" + $("#ExpenseAttribute").find("option:selected").data("AccountingItem") + "']").prop("selected", true)
        $(tmp).find("[alt=CostProfitCenter]").val($("#EmpCostProfitCenter").val())

        $(tmp).find("[alt=AccountBank]").val($("#VoucherBeau").find("option:selected").data("Books"))

        $(tmp).find("select").on("change", function () {
            $(this).nextAll("[Errmsg=Y]").remove();
        })
        $(tmp).mouseenter(function () {
            $(this).find("[alt=removesubInvoiceInfo]").show();
        })
        $(tmp).mouseleave(function () {
            $(this).find("[alt=removesubInvoiceInfo]").hide();
        })

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

        //selectpicker clone會無法作用 必須移除後再重新渲染 反應會延遲

        $(tmp).find('.selectpicker').data('selectpicker', null);
        $(tmp).find('.bootstrap-select').find("button:first").remove();
        $(tmp).find(".selectpicker").selectpicker("render")
        //selectpicker clone會無法作用 必須移除後再重新渲染

        if ($(tmp).find("select[alt=ExpenseAttribute]").prop('disabled')) {
            $(tmp).find("select[alt=ExpenseAttribute]").selectpicker('setStyle', 'input-disable', 'add');
        }
        else {
            $(tmp).find("select[alt=ExpenseAttribute]").selectpicker('setStyle', 'input-disable', 'remove');
        }

        $(tmp).find("[alt=CostProfitCenter]").change();
        $("#tab_InvoiceDetail").append(tmp);
        fun_resetCellIndex($("#tab_InvoiceDetail"), "Index", 4);

        $("#tab_InvoiceDetail tbody[alt=no-data]").hide();
    })//新增請款明細分攤層

    $("#popConfirm").on("click", function () {
        rtn = fun_InvoiceDataConfirm()

        if (rtn) {
            fun_InvoiceDatakeep(rtn);

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
    })//帶入
}

//建立/載入請款明細
function fun_popInvoiceInfo(target, popNoshow) {
    if (!fun_MasterFormDataConfirm()) {
        alert("請填妥必要資訊後，再新增請款明細。");
        $('html, body').animate({
            scrollTop: ($('[Errmsg=Y]').first().closest("div .row").offset().top) - 50
        }, 500);

        return false;
    }

    //還原預設值
    {
        $("#tab_InvoiceDetail").find(".list-close-icon").removeClass(".list-close-icon", false).addClass("list-open-icon")
        $("#PaymentCategory").selectpicker().selectpicker("refresh")
        $("#PaymentMidCategory").empty();
        $("#PaymentMidCategory").selectpicker('setStyle', 'input-disable', 'add');
        $("#PaymentMidCategory").prop('disabled', true);

        $("#ExpenseAttribute").empty();
        $("#ExpenseAttribute").selectpicker('setStyle', 'input-disable', 'add');
        $("#ExpenseAttribute").prop('disabled', true);

        $("#Project").empty()
        $("#Project").prop('disabled', true);
        $("#Project").selectpicker('setStyle', 'input-disable', 'add');
        $("#Project").removeAttr("necessary")

        $("#ProjectItem").empty()
        $("#ProjectItem").prop('disabled', true);
        $("#ProjectItem").selectpicker('setStyle', 'input-disable', 'add');
        $("#ProjectItem").removeAttr("necessary")

        $("#popInvoiceInfo select").each(function () {
            $(this).find("option").eq(0).prop("selected", true)
        }).selectpicker('refresh');

        $("#City").hide()
        $("#StartCityCode").removeAttr("necessary", "")
        $("#EndCityCode").removeAttr("necessary", "")

        $("#Station").hide()
        $("#StartStationCode").removeAttr("necessary")
        //$("#StartStationtitle").html("<b class=\"float-left\">站名(起)</b> ");
        $("#EndStationCode").removeAttr("necessary")
        //$("#EndStationtitle").html("<b class=\"float-left\">站名(迄)</b> ");

        $("#TaxIdNum").removeAttr("necessary")
        $("#CertificateNum").removeAttr("necessary")
        $("#EstimateVoucherDate").removeAttr("necessary")

        $("#InvoiceOriginalTax").val(0).hide();
        $("#NoEditInvoiceOriginalTax span").text(0);
        $("#NoEditInvoiceOriginalTax span").show()

        //$("#TaxIdNumTitle").html("<b class=\"float-left\">銷售(賣)方統一編號</b>");
        $("#TaxIdNumStarMark").hide()
        //$("#CertificateNumtitle").html("<b class=\"float-left\">憑證(發票)號碼</b>");
        $("#CertificateNumStarMark").hide()
        $("#EstimateVoucherDateTitle").html("<b class=\"float-left\">憑證日期</b>");

        $("#popInvoiceInfo input").val("");
        $("#popInvoiceInfo textarea").val("");
        $("#popInvoiceInfo").find("[Errmsg='Y']").remove();
        $("#InvoiceOverDue").removeAttr("necessary")
        //$("#InvoiceOverDuetitle").html("<b class=\"float-left\">發票逾期說明</b>");
        $("#divInvoiceOverDue").hide();

        $("#divYearVoucher").hide()

        $("#popInvoiceInfo .disable-text span").text("0");

        $("#tab_InvoiceDetail tbody").not("[alt=no-data]").remove();//移除分攤項次的內文資料

        $("#LineNum").val("0");
        $("#InvoiceOriginalTax").hide();
        $("#NoEditInvoiceOriginalTax").show()
        $("#IsDeduction").addClass("undone-text").text("系統自動帶入");
        $("#NeedCertificate").addClass("undone-text").text("系統自動帶入");
        $("#AccountingItemName").text("系統代入")

        $("#Currency").val("TWD").selectpicker('refresh');
        $("#Currency").change();
    }
    //還原預設值

    $("#tab_Invoice tbody").removeAttr("EditMark");

    if ($(target).find("[name=InvoiceJsonData]").val() == null) {//新增
        InvoiceObj = null;
        InvoiceData = null;
        $("#VoucherMemo").val($("#HeaderDesc").val())
        $("#InvoiceOriginalTax").val(0)
        $("#NoEditInvoiceOriginalTax span").text(0)
        $("#tab_InvoiceDetail tbody[alt=no-data]").show()
        $("#addsubInvoiceInfo").click()//預設新增一筆分攤明細
    }
    else {//載入
        InvoiceObj = $(target);
        InvoiceData = JSON.parse($(target).find("[name=InvoiceJsonData]").val());

        $(target).attr("EditMark", "")

        $("#LineNum").val(InvoiceData.LineNum);
        $("#PaymentCategory").find("option[value='" + InvoiceData.PaymentCategory + "']").prop("selected", true);
        $("#PaymentCategory").change();//強制觸發change動作
        $("#PaymentMidCategory").find("option[value='" + InvoiceData.PaymentMidCategory + "']").prop("selected", true);
        $("#PaymentMidCategory").change();//強制觸發change動作
        $("#ExpenseAttribute").find("option[value='" + InvoiceData.ExpenseAttribute + "']").prop("selected", true);
        $("#ExpenseAttribute").change();//強制觸發change動作

        $("#InvoiceExpenseDesc").val(InvoiceData.ExpenseDesc);
        $("#CertificateKind").find("option[value='" + InvoiceData.CertificateKind + "']").prop("selected", true);
        $("#CertificateKind").change();//強制觸發change動作
        $("#TaxIdNum").val(InvoiceData.TaxIdNum);
        //$("#VendorName").val(InvoiceData.VendorName);
        $("#CertificateNum").val(InvoiceData.CertificateNum);
        // $("#EstimateVoucherDate").val(InvoiceData.EstimateVoucherDate);
        $("#EstimateVoucherDate").val(InvoiceData.strEstimateVoucherDate);
        $("#InvoiceOverDue").val(InvoiceData.InvoiceOverDue);
        $("#Currency").find("option[value='" + InvoiceData.Currency + "']").prop("selected", true);
        if (InvoiceData.Currency != "TWD") {
            $("#Rate").show(200)
            $("#NoEditExchangeRate").hide(200)
        }
        //$("#Currency").change();//強制觸發change動作
        $("#Rate").val(fun_accountingformatNumberdelzero(InvoiceData.Rate));

        $("#NoEditExchangeRate span").text(fun_accountingformatNumberdelzero(InvoiceData.Rate));
        $("#AcceptanceAmount").text(fun_accountingformatNumberdelzero(InvoiceData.AcceptanceAmount));
        $("#InvoiceOriginalAmount").val(fun_accountingformatNumberdelzero(InvoiceData.OriginalAmount));
        $("#InvoiceOriginalTax").val(fun_accountingformatNumberdelzero(InvoiceData.OriginalTax));
        $("#NoEditInvoiceOriginalTax span").text(fun_accountingformatNumberdelzero(InvoiceData.OriginalTax));

        $("#InvoiceTWDSaleAmount").text(fun_accountingformatNumberdelzero(InvoiceData.TWDSaleAmount));
        $("#InvoiceTWDAmount").text(fun_accountingformatNumberdelzero(InvoiceData.TWDAmount));
        $("#InvoiceTWDTaxAmount").text(fun_accountingformatNumberdelzero(InvoiceData.TWDTaxAmount));
        $("#StartStationCode").find("option[value='" + InvoiceData.StartStationCode + "']").prop("selected", true);
        $("#EndStationCode").find("option[value='" + InvoiceData.EndStationCode + "']").prop("selected", true);
        $("#StartCityCode").find("option[value='" + InvoiceData.StartCityCode + "']").prop("selected", true);
        $("#EndCityCode").find("option[value='" + InvoiceData.EndCityCode + "']").prop("selected", true);

        if (InvoiceData.ProjectCategory != "" && $("#ProjectCategory").find("option[value='" + InvoiceData.ProjectCategory + "']").length > 0) {
            $("#ProjectCategory").find("option[value='" + InvoiceData.ProjectCategory + "']").prop("selected", true);
            $("#ProjectCategory").change();//強制觸發change動作
        }

        if (InvoiceData.Project != "" && $("#Project").find("option[value='" + InvoiceData.Project + "']").length > 0) {
            $("#Project").find("option[value='" + InvoiceData.Project + "']").prop("selected", true);
            $("#Project").change();//強制觸發change動作
        }

        if (InvoiceData.ProjectItem != "" && $("#ProjectItem").find("option[value='" + InvoiceData.ProjectItem + "']").length > 0) {
            $("#ProjectItem").find("option[value='" + InvoiceData.ProjectItem + "']").prop("selected", true);
        }

        $("#YearVoucher").val(InvoiceData.YearVoucher);

        $("#VoucherMemo").val(InvoiceData.VoucherMemo);
        $("#IsDeduction").text(InvoiceData.IsDeduction);
        $("#IsDeduction").removeClass("undone-text");
        $("#CurrencyPrecise").text(InvoiceData.CurrencyPrecise);
        $("#InvoiceOriginalAmount").attr("Accuracy", InvoiceData.CurrencyPrecise);
        $("#InvoiceOriginalTax").attr("Accuracy", InvoiceData.CurrencyPrecise);
        $("#Rate").attr("Accuracy", InvoiceData.CurrencyPrecise);
        $("#popInvoiceInfo select").selectpicker('refresh');

        // 計算合計是否超出日支額 *僅處理有支出上限的請款種類 ***警示不卡控
        {
            MaxPay = fun_getMaxPay()
            if (MaxPay > 0) {
                if (InvoiceData.TWDAmount > MaxPay) {
                    fun_AddErrMesg($("#InvoiceOriginalAmount"), "overPay", " 金額(臺幣)上限為 " + MaxPay + " 已超出金額上限")
                }
                else {
                    _EstimateVoucherDate = new Date(InvoiceData.strEstimateVoucherDate)
                    if (MaxPay > 0 && !(isNaN(_EstimateVoucherDate.getDate()))) {
                        totalUsePay = 0;

                        $("#tab_Invoice tbody").not("[EditMark]").not("[alt=no-data]").not("[alt=Delete]").each(function () {
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
                        $(this)._ajax("/EMP/GetPaymentMidUseAmount", { EMPNum: $("#VendorNum").val(), EstimateVoucherDate: InvoiceData.strEstimateVoucherDate, PaymentMidCategory: InvoiceData.PaymentMidCategory, FormID: $("#FormID").val() },
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
                                fun_AddErrMesg($("#InvoiceOriginalAmount"), "overPay", "憑證日期" + funAddheadZero(2, (_EstimateVoucherDate.getMonth() + 1)) + "月" + funAddheadZero(2, (_EstimateVoucherDate.getDate())) + "日，" + InvoiceData.PaymentMidCategoryName + "日支加總為" + (totalUsePay + __UsedPay) + "元，已超過日支上限" + ((MaxPay - __UsedPay - totalUsePay) * -1) + "元")

                                // rtn = false
                            }
                        }
                    }
                }
            }
        }
        // 出差計算合計是否超出日支額 *僅處理有支出上限的請款種類

        if (InvoiceData.AmortizationDetailList.length > 0) {
            $("#tab_InvoiceDetail tbody[alt=no-data]").hide()
            $(InvoiceData.AmortizationDetailList).each(function () {
                tmp = $("#tab_copyInvoiceDetail tbody").clone();

                $(tmp).find("[alt=OriginalAmortizationAmount]").attr("Accuracy", InvoiceData.CurrencyPrecise);
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
                        Rate = accounting.unformat($("#Rate").val());
                        if (!isNaN(OriginalAmortizationAmount) && !isNaN(Rate))

                            $(this).closest("tbody").find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(accounting.toFixed(OriginalAmortizationAmount * Rate)))
                    }
                })

                $(tmp).find("[alt=AccountBank]").find("option[value='" + this.AccountBank + "']").prop("selected", true);
                //  $(tmp).find("[alt=AccountingItem]").find("option[value='" + this.AccountingItem + "']").prop("selected", true);
                $(tmp).find("[alt=AccountingItem]").text(this.AccountingItem);
                $(tmp).find("[alt=CostProfitCenter]").find("option[value='" + this.CostProfitCenter + "']").prop("selected", true);
                $(tmp).find("[alt=CostProfitCenter]").change();
                $(tmp).find("[alt=ProductKind]").find("option[value='" + this.ProductKind + "']").prop("selected", true);
                // $(tmp).find("[alt=ProductDetail]").find("option[value='" + this.ProductDetail + "']").prop("selected", true);
                if (this.ProductDetail != null && this.ProductDetail != "") {
                    $(tmp).find("[name=ProductDetail]").text(this.ProductDetail + "-" + this.ProductDetailName).removeClass("undone-text");
                    $(tmp).find("[name=ProductDetailCode]").val(this.ProductDetail);
                    $(tmp).find("[name=ProductDetailName]").val(this.ProductDetailName);
                }

                $(tmp).find("[alt=ExpenseAttribute]").find("option[value='" + this.ExpenseAttribute + "']").prop("selected", true);
                $(tmp).find("[alt=OriginalAmortizationAmount]").val(fun_accountingformatNumberdelzero(this.OriginalAmortizationAmount))
                $(tmp).find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(this.OriginalAmortizationTWDAmount))
                $(tmp).find("[alt=ADetailID]").val(this.ADetailID)
                $(tmp).find("[alt=IsDelete]").val(this.IsDelete)

                $(tmp).find("select").on("change", function () {
                    $(this).nextAll("[Errmsg=Y]").remove();
                })

                $(tmp).mouseenter(function () {
                    $(this).find("[alt=removesubInvoiceInfo]").show();
                })
                $(tmp).mouseleave(function () {
                    $(this).find("[alt=removesubInvoiceInfo]").hide();
                })

                if (this.IsDelete == 'true') {
                    tmp.hide()
                    tmp.find("[alt=Index]").attr("alt", "Delete")
                    tmp.attr("alt", "Delete")
                }

                $(tmp).find("[alt=CostProfitCenter]").change();
                $("#tab_InvoiceDetail").append(tmp);
            })
            //selectpicker clone會無法作用 必須移除後再重新渲染 反應會延遲
            $("#tab_InvoiceDetail tbody").not("[alt=Delete]").find('.selectpicker').data('selectpicker', null);
            $("#tab_InvoiceDetail tbody").not("[alt=Delete]").find('.bootstrap-select').find("button:first").remove();
            $("#tab_InvoiceDetail tbody").not("[alt=Delete]").find(".selectpicker").selectpicker("render")
            //selectpicker clone會無法作用 必須移除後再重新渲染
            if ($("#tab_InvoiceDetail tbody").not("[alt=Delete]").find("select[alt=ExpenseAttribute]").prop('disabled')) {
                $("#tab_InvoiceDetail tbody").not("[alt=Delete]").find("select[alt=ExpenseAttribute]").selectpicker('setStyle', 'input-disable', 'add');
            }
            else {
                $("#tab_InvoiceDetail tbody").not("[alt=Delete]").find("select[alt=ExpenseAttribute]").selectpicker('setStyle', 'input-disable', 'remove');
            }

            if ($("#tab_InvoiceDetail tbody").not("[alt=no-data]").not("[alt=Delete]").length > 0) {
                fun_resetCellIndex($("#tab_InvoiceDetail"), "Index", 4);
            }
            else {
                $("#tab_InvoiceDetail tbody[alt=no-data]").show();
            }
        }
    }

    if (!popNoshow) {
        //addcase01 側邊滑欄動畫//
        $('.popup-left-addcase').show(0);
        $('.popup-overlay').fadeIn(0);
        $('.popup-box').animate({ right: "0px" }, 300);
        $("html, body").css("overflow", "hidden");
        //addcase01 側邊滑欄動畫//

        //因為可能會跳Alert 所以放最後
        $("#EstimateVoucherDate").blur();//強制觸發blur動作
    }
}

//請款明細金額試算
function fun_InvoiceAmountCalculate() {
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

        Maxpay = fun_getMaxPay()

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

//請款明細資料暫存
function fun_InvoiceDatakeep(states) {
    LineNum = $("#LineNum").val();
    PaymentCategory = $("#PaymentCategory").val();
    PaymentCategoryName = "";
    if ($("#PaymentCategory").val() != "") {
        PaymentCategoryName = $("#PaymentCategory option:selected").text();
    }

    PaymentMidCategory = $("#PaymentMidCategory").val();
    PaymentMidCategoryName = "";
    if ($("#PaymentMidCategory").val() != "") {
        PaymentMidCategoryName = $("#PaymentMidCategory option:selected").text();
    }
    ExpenseAttribute = $("#ExpenseAttribute").val();
    ExpenseAttributeName = "";
    if ($("#ExpenseAttribute").val() != "") {
        ExpenseAttributeName = $("#ExpenseAttribute option:selected").text();
    }
    if ($("#NeedCertificate").text() == "Y") NeedCertificate = true;
    else NeedCertificate = false;

    ExpenseDesc = $("#InvoiceExpenseDesc").val();
    CertificateKind = $("#CertificateKind").val();
    TaxIdNum = $("#TaxIdNum").val();
    //VendorName = $("#VendorName").val();
    CertificateNum = $("#CertificateNum").val();
    EstimateVoucherDate = $("#EstimateVoucherDate").val();
    strEstimateVoucherDate = $("#EstimateVoucherDate").val();

    InvoiceOverDue = $("#InvoiceOverDue").val();
    Currency = $("#Currency").val();
    CurrencyName = "";
    if ($("#Currency").val() != "") {
        CurrencyName = $("#Currency option:selected").data("text");
    }
    Rate = accounting.unformat($("#Rate").val());
    AcceptanceAmount = accounting.unformat($("#AcceptanceAmount").text());
    OriginalAmount = accounting.unformat($("#InvoiceOriginalAmount").val());
    OriginalTax = accounting.unformat($("#InvoiceOriginalTax").val());
    TWDSaleAmount = accounting.unformat($("#InvoiceTWDSaleAmount").text());
    TWDAmount = accounting.unformat($("#InvoiceTWDAmount").text());
    TWDTaxAmount = accounting.unformat($("#InvoiceTWDTaxAmount").text());
    StartStationCode = $("#StartStationCode").val();
    EndStationCode = $("#EndStationCode").val();

    StartCityCode = $("#StartCityCode").val();
    EndCityCode = $("#EndCityCode").val()
    ProjectCategory = $("#ProjectCategory").val();
    Project = $("#Project").val();
    ProjectItem = $("#ProjectItem").val();
    YearVoucher = $("#YearVoucher").val();
    VoucherMemo = $("#VoucherMemo").val();
    IsDeduction = $("#IsDeduction").text();
    CurrencyPrecise = parseInt($("#CurrencyPrecise").text());
    StartStationName = ""
    if ($("#StartStationCode").val() != "") {
        StartStationName = $("#StartStationCode option:selected").data("text");
    }
    EndStationName = ""
    if ($("#EndStationCode").val() != "") {
        EndStationName = $("#EndStationCode option:selected").data("text");
    }

    StartCityName = ""
    if ($("#StartCityCode").val() != "") {
        StartCityName = $("#StartCityCode option:selected").data("text");
    }
    EndCityName = ""
    if ($("#EndCityCode").val() != "") {
        EndCityName = $("#EndCityCode option:selected").data("text");
    }
    ProjectCategoryName = ""
    if ($("#ProjectCategory").val() != "") {
        ProjectCategoryName = $("#ProjectCategory option:selected").text();
    }
    ProjectName = ""
    if ($("#Project").val() != "") {
        ProjectName = $("#Project option:selected").text();
    }
    ProjectItemName = ""
    if ($("#ProjectItem").val() != "") {
        ProjectItemName = $("#ProjectItem option:selected").text();
    }

    i = 0;
    InvoiceDetailArray = new Array()

    $("#tab_InvoiceDetail tbody").not("[alt=no-data]").each(function () {
        _index = $(this).find("[alt=index]").val()
        _AccountBank = $(this).find("[alt=AccountBank]").val()
        _AccountBankName = $("#tab_copyInvoiceDetail").find("[alt=AccountBank]").find("option[value=" + _AccountBank + "]").data("text")

        _AccountingItemName = $(this).find("[alt=AccountingItemName]").text()
        _AccountingItem = $(this).find("[alt=AccountingItem]").val()
        _CostProfitCenter = $(this).find("[alt=CostProfitCenter]").val()
        _CostProfitCenterName = $("#tab_copyInvoiceDetail").find("[alt=CostProfitCenter]").find("option[value=" + _CostProfitCenter + "]").data("text")
        _ProductKind = $(this).find("[alt=ProductKind]").val()
        _ProductKindName = "";
        if (_ProductKind != "") {
            _ProductKindName = $("#tab_copyInvoiceDetail").find("[alt=ProductKind]").find("option[value=" + _ProductKind + "]").data("text")
        }

        _ProductDetail = $(this).find("[name=ProductDetailCode]").val()
        _ProductDetailName = $(this).find("[name=ProductDetailName]").val()

        _ExpenseAttribute = $(this).find("[alt=ExpenseAttribute]").val()
        _ExpenseAttributeName = ""
        if (_ExpenseAttribute != "") {
            _ExpenseAttributeName = $("#tab_copyInvoiceDetail").find("[alt=ExpenseAttribute]").find("option[value=" + _ExpenseAttribute + "]").data("text")
        }

        _OriginalAmortizationAmount = accounting.unformat($(this).find("[alt=OriginalAmortizationAmount]").val())
        _OriginalAmortizationTWDAmount = accounting.unformat($(this).find("[alt=OriginalAmortizationTWDAmount]").text())
        _IsDelete = $(this).find("[alt=IsDelete]").val()

        _ADetailID = $(this).find("[alt=ADetailID]").val()
        tmp = {
            index: _index, AccountBank: _AccountBank, AccountBankName: _AccountBankName, AccountingItem: _AccountingItem, AccountingItemName: _AccountingItemName,
            CostProfitCenter: _CostProfitCenter, CostProfitCenterName: _CostProfitCenterName, ProductKind: _ProductKind, ProductKindName: _ProductKindName,
            ProductDetail: _ProductDetail, ProductDetailName: _ProductDetailName, ExpenseAttribute: _ExpenseAttribute, ExpenseAttributeName: _ExpenseAttributeName, OriginalAmortizationAmount: _OriginalAmortizationAmount,
            OriginalAmortizationTWDAmount: _OriginalAmortizationTWDAmount, IsDelete: _IsDelete, ADetailID: _ADetailID
        }

        InvoiceDetailArray[i] = tmp;
        i++;
    })

    InvoiceDetail = InvoiceDetailArray;

    InvoiceData = {
        LineNum: LineNum, states: states, PaymentCategory: PaymentCategory, PaymentCategoryName: PaymentCategoryName, PaymentMidCategory: PaymentMidCategory, PaymentMidCategoryName: PaymentMidCategoryName,
        ExpenseAttribute: ExpenseAttribute, ExpenseAttributeName: ExpenseAttributeName, NeedCertificate: NeedCertificate,
        ExpenseDesc: ExpenseDesc, CertificateKind: CertificateKind, TaxIdNum: TaxIdNum, VendorName: "", CertificateNum: CertificateNum,
        EstimateVoucherDate: EstimateVoucherDate, strEstimateVoucherDate: strEstimateVoucherDate, InvoiceOverDue: InvoiceOverDue, Currency: Currency, CurrencyName: CurrencyName, Rate: Rate, AcceptanceAmount: AcceptanceAmount,
        OriginalAmount: OriginalAmount, OriginalTax: OriginalTax, TWDAmount: TWDAmount, TWDSaleAmount: TWDSaleAmount, TWDTaxAmount: TWDTaxAmount, StartStationCode: StartStationCode, EndStationCode: EndStationCode,
        /*StartAreaCode: StartAreaCode, EndAreaCode: EndAreaCode, StartCountryCode: StartCountryCode, EndCountryCode: EndCountryCode,*/
        StartCityCode: StartCityCode, EndCityCode: EndCityCode,
        ProjectCategory: ProjectCategory, Project: Project, ProjectItem: ProjectItem, YearVoucher: YearVoucher, VoucherMemo: VoucherMemo, IsDeduction: IsDeduction,
        CurrencyPrecise: CurrencyPrecise, AmortizationDetailList: InvoiceDetail, IsDelete: false,
        StartStationName: StartStationName, EndStationName: EndStationName,
        /* StartAreaName: StartAreaName, EndAreaName: EndAreaName, StartCountryName: StartCountryName, EndCountryName: EndCountryName,*/
        StartCityName: StartCityName, EndCityName: EndCityName, ProjectCategoryName: ProjectCategoryName, ProjectName: ProjectName, ProjectItemName: ProjectItemName
    }
}

//表單明細取得最大可支出金額
function fun_getMaxPay() {
    /*101801	膳雜費（國外）
      101802	住宿費（國外）
      101808	膳雜費（國外-大陸地區）
      101809	住宿費（國外-大陸地區）
      101815	膳雜費（國內）
      101816	住宿費（國內）*/

    PaymentMidCategory = $("#PaymentMidCategory").val()
    TripPayType = $("#TripPayType").val()
    // PayKind = $("#ExpenseAttribute").find("option:selected").data("PayKind")
    StartCityCode = $("#StartCityCode").val();
    EndCityCode = $("#EndCityCode").val();
    MaxPay = 0;
    tripUSAExchangeRate = $("#TripUSAExchangeRate").val()
    console.log("TripPayType " + TripPayType)
    // console.log("PayKind " + PayKind)
    console.log("StartCityCode " + StartCityCode)
    console.log("EndCityCode " + EndCityCode)
    console.log("tripUSAExchangeRate " + tripUSAExchangeRate)
    // TripPayType = 2
    if (TripPayType == 0 && __EMP_TW_Food == PaymentMidCategory) {
        TripPayType = 1 // 膳雜費（國內）最高500 *同經理
    }

    if (TripPayType == 0) {//不做檢核
        MaxPay = 0;
    }
    else {
        //國內
        if ($.grep(__EMP_TW.split(","), function (code) {
            return code == PaymentMidCategory
        }).length > 0) {
            if (TripPayType == 1) { MaxPay = $("#ExpenseAttribute").find("option:selected").data("AmountLimitLV2") }
            if (TripPayType == 2) { MaxPay = $("#ExpenseAttribute").find("option:selected").data("AmountLimitLV1") }
        }
        //海外膳雜
        if ($.grep(__EMP_OverseaFood.split(","), function (code) {
            return code == PaymentMidCategory
        }).length > 0) {
            if (tripUSAExchangeRate <= 0) {
                alert("出差日美元匯率有誤")
                return false;
            }
            OverseaPayLimit = -1;
            $(this)._ajax("/EMP/GetOverseaPayLimit", { startCityItemNo: StartCityCode, endCityItemNo: EndCityCode }, function (data) {
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
                MaxPay = parseInt(accounting.toFixed(parseInt(accounting.toFixed((OverseaPayLimit * tripUSAExchangeRate))) * 0.4))
            }
        }
        //海外住宿
        if ($.grep(__EMP_OverseaHotel.split(","), function (code) {
             return code == PaymentMidCategory
        }).length > 0) {
            if (tripUSAExchangeRate <= 0) {
                alert("出差日美元匯率有誤")
                return false;
            }
            OverseaPayLimit = -1;
            $(this)._ajax("/EMP/GetOverseaPayLimit", { startCityItemNo: StartCityCode, endCityItemNo: EndCityCode }, function (data) {
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
                MaxPay = parseInt(accounting.toFixed(parseInt(accounting.toFixed((OverseaPayLimit * tripUSAExchangeRate))) * 0.6))
            }
        }

        if (isNaN(parseInt(MaxPay))) {
            MaxPay = -1;
        }
    }
    return MaxPay;
}

//主檔資料檢核
function fun_MasterFormDataConfirm() {
    rtn = true;
    $("#InformationSection").find("[necessary]").each(function () {
        if (String($(this).val()).trim().length < 1) {
            fun_AddErrMesg($(this), "Err" + $(this).attr("id"), "此為必填欄位")
            rtn = false;
        }
    })

    //付款帳號檢核 僅能輸入英數字
    if ($("#AccountNum").val().length > 0) {
        reg = /^([A-Z]|[a-z]|[0-9])*$/

        if (String($("#AccountNum").val()).search(reg) != 0) {
            rtn = false;
            fun_AddErrMesg($("#AccountNum"), "ErrAccountNum", "格式錯誤，請輸入半形英文或數字")
        }
    }

    return rtn
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

    Maxpay = fun_getMaxPay();

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

    //可扣底否判斷
    IsDeduction = true;
    {
        //金額欄位判斷
        //可扣底否判斷
        //檢查憑證是否為發票、憑證開立對象的營業稅類別為403且判定費用項目之貼標是否為可扣抵 (費用屬性可得)
        // 判定成本與利潤中心(分攤層)：該成本與利潤中心對應的帳本，稅額申報方式為 404，則為不可扣抵。 2/13 與ERP顧問 理查確認改統一以 貼標判斷
        // 20180510 又改成判斷分攤明細層帳務行，不理會成本與利潤中心

        //20180521 新版規則 *憑證須為發票
        //1.  「請款明細」請款大類、中類 →費用報支平台開帳資料維護
        //2.  「分攤明細」帳務行 →FIIS來源API（下拉選單來源EXCG-55_1，另呼叫EXCG-39檢核）

        //  console.log("憑證種類：" + $("#CertificateKind").val())
        // console.log("憑證開立對象的營業稅類別：" + $("#GvDeclaration").val())
        console.log("費用項目之貼標：" + $("#ExpenseAttribute").find("option:selected").data("IsDeduction"))

        //console.log($("#CertificateKind").val() == 1 && $("#GvDeclaration").val() == "403" && $("#ExpenseAttribute").find("option:selected").data("IsDeduction"))

        if ($("#CertificateKind").val() == 1 && $("#ExpenseAttribute").find("option:selected").data("IsDeduction")) {
            $("#tab_InvoiceDetail").find("[alt=AccountBank]").each(function () {
                //console.log($("#tab_copyInvoiceDetail").find("[alt=AccountBank]").find("option[value='" + $(this).val() + "']").data("gvDeclaration"))

                if ($("#tab_copyInvoiceDetail").find("[alt=AccountBank]").find("option[value='" + $(this).val() + "']").data("gvDeclaration") != "403") {
                    IsDeduction = false;
                    console.log("成本與利潤中心(分攤層)之貼標：" + $(this).val() + "  " + $("#tab_copyInvoiceDetail").find("[alt=AccountBank]").find("option[value='" + $(this).val() + "']").data("gvDeclaration"))

                    return false
                }
            }
            )
        }
        else {
            IsDeduction = false;
        }
        console.log("是否可扣抵：" + IsDeduction)

        if (IsDeduction) {
            $("#IsDeduction").text("Y");
        }
        else {
            $("#IsDeduction").text("N");
        }
    }
    //可扣底否判斷

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

            if (IsDeduction) {
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
        PaymentMidCategory = $("#PaymentMidCategory").val()
        EstimateVoucherDate = new Date($("#EstimateVoucherDate").val())
        InvoiceTWDAmount = accounting.unformat($("#InvoiceTWDAmount").text());
        totalUsePay = InvoiceTWDAmount;
        hasCertificateNum = false

        $("#tab_Invoice tbody").not("[EditMark]").not("[alt=no-data]").not("[alt=Delete]").each(function () {
            JsonData = $(this).find("[name=InvoiceJsonData]").val();

            if (JsonData != null) {
                try {
                    InvoiceData = JSON.parse(JsonData);

                    if (InvoiceData.PaymentMidCategory == PaymentMidCategory && $("#EstimateVoucherDate").val() == InvoiceData.strEstimateVoucherDate) {
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
            $(this)._ajax("/EMP/GetPaymentMidUseAmount", { EMPNum: $("#VendorNum").val(), EstimateVoucherDate: $("#EstimateVoucherDate").val(), PaymentMidCategory: PaymentMidCategory, FormID: $("#FormID").val() },
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
            $("#tab_Invoice tbody[alt=no-data]").hide();
            $("[alt=ErrCertificateAmount]").remove();

            if (InvoiceObj == null) {
                InvoiceObj = $("#tab_copyInvoice tbody").clone();

                $(InvoiceObj).find("td").eq(0).text(funAddheadZero(4, $("#tab_Invoice tbody").not("[alt=no-data]").not("[alt=Delete]").length + 1))
                $("#tab_Invoice").append(InvoiceObj);
                $(InvoiceObj).attr("EditMark", "")

                $(InvoiceObj).find("[alt=popInvoiceInfo]").on("click", function () {
                    fun_popInvoiceInfo($(this).closest("tbody"));
                })

                $(InvoiceObj).mouseenter(function () {
                    $(this).find("[alt=removeInvoice]").show();
                })
                $(InvoiceObj).mouseleave(function () {
                    $(this).find("[alt=removeInvoice]").hide();
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
            InvoiceObj.find("[name=InvoiceJsonData]").val(JSON.stringify(Data));

            $(InvoiceObj).find("[name=LineNum]").val(Data.LineNum)
            $(InvoiceObj).find("td").eq(1).text(Data.TaxIdNum)
            //$(InvoiceObj).find("td").eq(2).text(Data.VendorName)
            $(InvoiceObj).find("td").eq(3).text(Data.CertificateNum)
            $(InvoiceObj).find("td").eq(4).text(Data.PaymentCategoryName)
            $(InvoiceObj).find("td").eq(5).text(Data.CurrencyName)
            $(InvoiceObj).find("td").eq(6).text(fun_accountingformatNumberdelzero(Data.OriginalAmount))
            $(InvoiceObj).find("td").eq(7).text(Data.ExpenseDesc)
        }
        //表單資料帶回主頁面

        //重算主表金額
        ReCalculate()
    }
}
//重算主表金額
function ReCalculate() {
    //重算主表金額
    {
        OriginalAmount = 0;
        TWDAmount = 0;
        TWDTaxAmount = 0;

        states = true;

        $("#tab_Invoice tbody").not("[alt=no-data]").not("[alt=Delete]").each(function () {
            info = $(this).find("[name=InvoiceJsonData]").val();
            if (info != "") {
                infoData = JSON.parse(info);

                OriginalAmount += infoData.OriginalAmount
                TWDAmount += infoData.TWDAmount
                TWDTaxAmount += infoData.TWDTaxAmount
            }
            else {
                states = false;
                return false;
            }
        })

        if (states) {
            // $("#_OriginalAmount").text(fun_accountingformatNumberdelzero(OriginalAmount))
            $("#_TWDAmount").text(fun_accountingformatNumberdelzero(TWDAmount))
            // $("#_TWDTaxAmount").text(fun_accountingformatNumberdelzero(TWDTaxAmount))

            $("#OriginalAmount").val(OriginalAmount)
            $("#span_CertificateAmount").text(OriginalAmount)

            $("#TWDAmount").val(TWDAmount)
            $("#TWDTaxAmount").val(TWDTaxAmount)
            $("#PaymentAmount").val(TWDAmount)
            $("#div_PaymentAmount").text(fun_accountingformatNumberdelzero(TWDAmount))
            $("input[name=CertificateAmount]").val(OriginalAmount)
            $("#span_CertificateAmount").text(fun_accountingformatNumberdelzero(OriginalAmount));
        }
        else {
            // $("#_OriginalAmount").val(0);
            $("#_TWDAmount").val(0);
            // $("#_TWDTaxAmount").val(0);

            $("#OriginalAmount").val(0);
            $("#TWDAmount").val(0);
            $("#TWDTaxAmount").val(0);
            $("#PaymentAmount").val(0);
            $("#div_PaymentAmount").text(0);
            $("#span_CertificateAmount").text(0);

            $("input[name=CertificateAmount]").val(0)
        }
    }
    //重算主表金額
}

//公用副程式
{
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