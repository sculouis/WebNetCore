var Global = {
    EEAModel: getModel(),
    FiisData: getFissData(),
    supplierTypeLookupCode: "",
    isCardEmp: false,
    popDetailInfo: {},
    bankInfo: {},
    ExpenseKind: "",
    Rate: 1,
    Currency: "",
    today: new Date(new Date().setHours(new Date().getHours() + 8)).toISOString().substring(0, 10),
    flowPart: 1,
    SupplierList: [],
    isCreditCardOffice: false
}

//暫存
function draft() {
    blockPageForJBPMSend()

    let ErrMsg = [];
    return $.ajax({
        url: '/EEA/Edit',
        dataType: 'json',
        type: 'POST',
        data: Global.EEAModel,
        success: function (data, textStatus, jqXHR) {
            if (data.FormGuid === undefined) {
                _formInfo.flag = false;

                $.each(data, function (index, item) {
                    if (item.MemberNames[0] == "alert") {
                        ErrMsg.push(item.ErrorMessage)
                    }
                    else {
                        fun_AddErrMesg($("[id=" + item.MemberNames[0] + "]"), "Err_" + item.MemberNames[0], item.ErrorMessage)
                    }
                })
            }
            else {
                _formInfo.formGuid = data.FormGuid
                _formInfo.formNum = data.FormNum
                _formInfo.flag = data.Flag
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            ErrMsg.push("暫存失敗 " + textStatus)
        }
    }).always(function () {
        if (ErrMsg.length > 0) {
            $.unblockUI();
            alertopen(ErrMsg)
        }
    });
}

//驗證
function Verify() {
    blockPageForJBPMSend()

    //切流程
    if ($("#P_CurrentStep").val() == "1") {
        if (!Global.isCardEmp && Global.EEAModel.ExpenseKind == "EA_SPECIFIC_EXP") {
            $("#P_CustomFlowKey").val("EEA_P1_01")
            updateCustomFlowKey("EEA_P1_01");
            _stageInfo.CustomFlowKey = "EEA_P1_01";
        }
        if (Global.isCardEmp && Global.EEAModel.ExpenseKind == "EA_SPECIFIC_EXP") {
            $("#P_CustomFlowKey").val("EEA_P1_Credit")
            updateCustomFlowKey("EEA_P1_Credit");
            _stageInfo.CustomFlowKey = "EEA_P1_Credit";
        }
        if (!Global.isCardEmp && Global.EEAModel.ExpenseKind == "EA_MISC_EXP") {
            $("#P_CustomFlowKey").val("EEA_P2_01")
            updateCustomFlowKey("EEA_P2_01");
            _stageInfo.CustomFlowKey = "EEA_P2_01";
        }
        if (Global.isCardEmp && Global.EEAModel.ExpenseKind == "EA_MISC_EXP") {
            $("#P_CustomFlowKey").val("EEA_P2_Credit")
            updateCustomFlowKey("EEA_P2_Credit");
            _stageInfo.CustomFlowKey = "EEA_P2_Credit";
        }
    }

    let draftAjax = $.Deferred()

    setTimeout(function () {
        let rtn = false;
        let ErrMsg = [];

        let targetList = [{
            view: $("#MainInformationBlock"),
            model: Global.EEAModel
        }, {
            view: $("#PayInfo"),
            model: Global.EEAModel
        }]

        if (Global.flowPart == 2) {
            let TaxList = $.grep(Global.EEAModel.BusinessTaxList, function (o) {
                return !o.IsDelete
            })

            $.each($("#BusinessTaxTable tbody").not("[alt=no-data]"), function (i, o) {
                targetList.push({
                    view: $(o),
                    model: TaxList[i]
                })
            })
        }

        if (necessaryVerify(targetList)) {
            if ($.grep(Global.EEAModel.EEADetail, function (o) { return !o.IsDelete }).length > 0) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: { p_key: $("#P_CustomFlowKey").val(), currentStep: $("#P_CurrentStep").val(), eeaMaster: Global.EEAModel },
                    url: '/EEA/Verify'
                }).done(function (data, textStatus, jqXHR) {
                    if (data.length == 0) {
                        rtn = true;
                    } else {
                        $.each(data, function (index, item) {
                            if (item.MemberNames[0] == "alert") {
                                ErrMsg.push(item.ErrorMessage)
                            }
                            else {
                                fun_AddErrMesg($("[id=" + item.MemberNames[0] + "]"), "Err_" + item.MemberNames[0], item.ErrorMessage)
                            }
                        })
                    }
                }).fail(function (err) {
                    rtn = false;
                    ErrMsg.push("資料驗證發生錯誤")
                })
            }
            else {
                rtn = false;
                ErrMsg.push("請至少輸入一筆請款明細")
            }
        }

        if (rtn) {
            draftAjax.resolve()
        }
        else {
            draftAjax.reject()
            if (ErrMsg.length > 0) {
                alertopen(ErrMsg)
            }

            if ($('[Errmsg=Y]').length > 0) {
                $('html, body').animate({
                    scrollTop: ($('[Errmsg=Y]').first().closest("div .row").offset().top) - 50
                }, 500);
            }
        }

        $.unblockUI();
    }, 500)

    return draftAjax.promise();
}

//傳送
function Save() {
    _formInfo.flag = false
    let ErrMsg = [];
    blockPageForJBPMSend()
    return $.ajax({
        url: '/EEA/Save',
        dataType: 'json',
        type: 'POST',
        data: Global.EEAModel,
        success: function (data) {
            if (data.FormGuid === undefined) {
                $.each(data, function (index, item) {
                    if (item.MemberNames[0] == "alert") {
                        ErrMsg.push(item.ErrorMessage)
                    }
                    else {
                        fun_AddErrMesg($("[id=" + item.MemberNames[0] + "]"), "Err_" + item.MemberNames[0], item.ErrorMessage)
                    }
                })
            }
            else {
                _formInfo.formGuid = data.FormGuid
                _formInfo.formNum = data.FormNum
                _formInfo.flag = data.Flag

                let ExpenseKindName = (Global.EEAModel.ExpenseKind == "EA_SPECIFIC_EXP") ? "特定用途" : "雜項請款";

                $("#FormTypeName").val("特殊用途專戶(" + ExpenseKindName + ")")
                $("#ApplyItem").val(ExpenseKindName)
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            ErrMsg.push("存檔失敗 " + textStatus)
            $.unblockUI();
        }
    }).always(function () {
        if (ErrMsg.length > 0) {
            alertopen(ErrMsg)
        }
    });;
}

$(function () {
    $.each(Global.FiisData.VoucherBeauList, function (i, o) {
        $("#VoucherBeau").append($("<option></option>").val(o.bANNumber).text(o.bANNumber + " " + o.businessEntity))
    })
    $("#VoucherBeau").selectpicker("refresh")

    Global.ExpenseKind = Global.EEAModel.ExpenseKind
    Global.isCardEmp = $.map(_unitData, function (o) {
        if (o.unit_level == 4) { return o.unit_id }
    })[0] == __CreditCardDepId
    Global.Rate = Global.EEAModel.Rate
    Global.Currency = Global.EEAModel.Currency

    popControlAction()

    $("input[Amount]").on("focus", function () {
        fun_onfocusAction(this)
    })
    $("input[Amount]").on("blur", function () {
        // fun_onblurAction(this)
        $(this).val(fun_accountingformatNumberdelzero($(this).val()))
    })
    $("#InformationSection").find("input,select,textarea").on("change", function (e) {
        $(this).nextAll("[Errmsg=Y]").remove();
        ControltoModel(Global.EEAModel, e.target)
        ControlAction(Global.EEAModel, e)
    })
    $("#popDetail").find("input,select,textarea").on("change", function (e) {
        $(this).nextAll("[Errmsg=Y]").remove();
        ControltoModel(Global.popDetailInfo, e.target)
        popDetailControlAction(Global.popDetailInfo, e)
    })

    $("#BusinessTaxTable").find("input,select,textarea").on("change", function (e) {
        $(this).nextAll("[Errmsg=Y]").remove();
        let BusinessID = $(this).closest("tbody").find("[name=BusinessID]").eq(0).text();
        let BusinessTax = $.grep(Global.EEAModel.BusinessTaxList, function (o) { return o.BusinessID == BusinessID })
        if (BusinessTax.length > 0) {
            ControltoModel(BusinessTax[0], e.target)
            businessTaxControlAction(BusinessTax[0], e)
        }
    })

    $("#datetimepicker_ExceptedPaymentDate").data("DateTimePicker").minDate(Global.today);
    $("#datetimepicker_ExpectedDate").data("DateTimePicker").minDate(Global.today);
    //日期控件特殊處理
    $("#ExpectedDate").on("blur", function (e) {
        ControltoModel(Global.EEAModel, e.target)
        ControlAction(Global.EEAModel, e)
    })
    $("#ExceptedPaymentDate").on("blur", function (e) {
        ControltoModel(Global.EEAModel, e.target)
        ControlAction(Global.EEAModel, e)
    })
    $("#EstimateVoucherDate").on("blur", function (e) {
        ControltoModel(Global.popDetailInfo, e.target)
        popDetailControlAction(Global.popDetailInfo, e)
    })

    $("#VendorOpen").on("click", function () {
        if (Global.supplierTypeLookupCode == "") {
            alertopen("請先選擇請款類別")
            return false
        }
        else {
            openVendor(true, null)
        }
    })

    $("#Btn_CreatDetail").on("click", function () {
        $(Global.EEAModel.EEADetail).each(function (i, o) {
            o.edit = false;
        })
        let obj = {
            ExpenseKind: Global.EEAModel.ExpenseKind,
            CurrencyName: Global.EEAModel.Currency + "-" + Global.EEAModel.CurrencyName,
            CurrencyPrecise: Global.EEAModel.CurrencyPrecise,
            Rate: Global.EEAModel.Rate
        }

        popDetailLoading(obj)
    })

    //設太大會蓋住訊息視窗 *設AUTO會被重繪的selectpicker 壓在下面
    $('.popup-box').css("z-index", "502")
    $('.popup-overlay').css("z-index", "500")

    $(document).on('click', '#AccountOpen', function () {
        $('[data-remodal-id=SelectAccount]').remodal().open();
    });

    $('#AccountConfirm').on('click', function () {
        let index = $("#AccountSelectRemodal").find('input[name="AccountSelector"]:checked').parents('li.AccountSelect').attr("index");
        AccountConfirm(Global.bankInfo[parseInt(index)])
    });

    $("[amount]").each(function (i, o) {
        $(this).text(fun_accountingformatNumberdelzero($(this).text()))
        $(this).val(fun_accountingformatNumberdelzero($(this).val()))
    })

    if ($("#P_CurrentStep").val() == "1") {
        GetEEASupplierList()
    }

    DataLoadingControl()
    stageControl($('#P_CustomFlowKey').val(), $("#P_CurrentStep").val())
})

function DataLoadingControl() {
    ///<summary>頁面資料載入時控項控制</summary>

    //日期塞回日期字串
    Global.EEAModel.EstimatePayDate = Global.EEAModel.EstimatePayDateToString
    Global.EEAModel.ExceptedPaymentDate = Global.EEAModel.ExceptedPaymentDateToString
    Global.EEAModel.ExpectedDate = Global.EEAModel.ExpectedDateToString

    if (Global.EEAModel.ExpenseKind != null) {
        $("#ExpenseKind").change()
    }

    if (Global.EEAModel.VoucherBeau != null && Global.EEAModel.Books != null) {
        $.each(Global.FiisData.VoucherBeauList, function (i, o) {
            if (o.bANNumber == Global.EEAModel.VoucherBeau && o.accountCode == Global.EEAModel.Books) {
                $("#VoucherBeau")[0].selectedIndex = i + 1;//多一個請選擇
                $("#VoucherBeau").selectpicker('refresh')

                if (o.isCreditCardOffice == "Y") { Global.isCreditCardOffice = true }
            }
        })

        if (!Global.isCreditCardOffice) {
            $("#BusinessTaxTable").find("select[name=TaxCategory]").prop("disabled", true).selectpicker('setStyle', 'input-disable', 'add').removeAttr("necessary")
        }
        else {
            $("#BusinessTaxTable").find("select[name=TaxCategory]").attr("necessary", true)
        }
    }

    if (Global.EEAModel.Currency == 'TWD') {
        $("#BargainingCode_star").hide()
        $("#ExportApplyAttribute_star").hide()
        $("#Rate").prop("disabled", true).addClass("input-disable").removeAttr("necessary")
        $("#BargainingCode").prop("disabled", true).addClass("input-disable").removeAttr("necessary")
        $("#ExportApplyAttribute").prop("disabled", true).selectpicker('setStyle', 'input-disable', 'add').removeAttr("necessary")
    }
    else {
        $("#BargainingCode_star").show()
        $("#ExportApplyAttribute_star").show()
        $("#BargainingCode").attr("necessary", "").prop("disabled", false).removeClass("input-disable")
        $("#ExportApplyAttribute").attr("necessary", "").selectpicker('setStyle', 'input-disable', 'remove').prop("disabled", false).selectpicker("refresh")
    }

    if (!isNullOrEmpty(Global.EEAModel.VendorID) && !isNullOrEmpty(Global.EEAModel.VendorSiteCode) && !isNullOrEmpty(Global.EEAModel.VendorNum)) {
        if (Global.supplierTypeLookupCode == "SPECIFIC") {
            fun_AppendNextApproverList()
        }

        //$("#VendorNumAndName").html(Global.EEAModel.VendorName + "(" + Global.EEAModel.VendorID + ")")
        optionInput.supplierNumber = Global.ExpenseKind.VendorNum;

        $.when(resultOutput()).always(function () {
            if (_vendor.length > 0) {
                PaymentAccount(_vendor[0].supplierBank)
                $("#PayInfo").show()
                $("#PayMentInfoArea").show()
            }
            else {
                alertopen("查無該供應商的資訊!!")
            }
        });

        if (Global.EEAModel.EEADetail != null && Global.EEAModel.EEADetail.length > 0) {
            $(Global.EEAModel.EEADetail).each(function (i, o) {
                o.EstimateVoucherDate = o.strEstimateVoucherDate

                tab_InvoiceInput($.extend(o, {
                    ExpenseKind: Global.EEAModel.ExpenseKind,
                    CurrencyName: Global.EEAModel.Currency + "-" + Global.EEAModel.CurrencyName,
                    CurrencyPrecise: Global.EEAModel.CurrencyPrecise,
                    Rate: Global.EEAModel.Rate,
                }))
            })
        }

        if (Global.EEAModel.BusinessTaxList != null && Global.EEAModel.BusinessTaxList.length > 0) {
            $(Global.EEAModel.BusinessTaxList).each(function (i, o) {
                o.CertificateDate = fun_DataToString(o.CertificateDate)
            })
        }

        $("#PayInfo").show()
        $("#PayMentInfoArea").show()
    }
}

function ControltoModel(model, target) {
    ///<summary>單向綁定到資料模組</summary>
    ///<param name="model">繫結的class</param>
    ///<param name="target">觸發動作的控件</param>
    let val = target.value
    if ($(target).is("[Amount]")) {
        val = accounting.unformat(target.value)
        if (target.tagName == "INPUT") {
            if (!fun_onblurAction(target)) {
                val = 0
            }
        }
    }
    if (target.type == "checkbox") {
        val = $(target).prop("checked")
    }

    let nodeList = target.name.split(".")
    let endNode = model;
    reg = /\[[0-9]{1,}\]/

    for (i = 0; i < nodeList.length ; i++) {
        if (reg.test(nodeList[i])) {
            //陣列
            ArrayNode = nodeList[i].substr(0, nodeList[i].indexOf("["))
            len = nodeList[i].substr(nodeList[i].indexOf("[") + 1, nodeList[i].indexOf("]") - nodeList[i].indexOf("[") - 1)
            if (endNode[ArrayNode][len] === undefined) {
                break;
            }

            if (i == nodeList.length - 1) {
                endNode[ArrayNode][len] = val
            }
            else {
                endNode = endNode[ArrayNode][len]
            }
        }
        else {
            if (endNode[nodeList[i]] === undefined) {
                break;
            }

            if (i == nodeList.length - 1) {
                endNode[nodeList[i]] = val
            }
            else {
                endNode = endNode[nodeList[i]]
            }
        }
    }
}
function ControlAction(model, e) {
    ///<summary>控建動作</summary>
    ///<param name="model">繫結的class</param>
    ///<param name="target">觸發動作</param>
    function ExpenseKindChange() {
        ///<summary>請款類別更改動作</summary>
        ///<param name="model">繫結的class</param>

        Global.ExpenseKind = model.ExpenseKind
        $("#sentdropbox").empty().selectpicker('refresh')

        if (model.ExpenseKind == 'EA_MISC_EXP') {
            //雜項
            Global.supplierTypeLookupCode = "SPECIFIC"

            $("#divIsToBeCertificate").hide()
            $("#divExpectedDate").hide()
            $("#ExpectedDate").val("")
            $("[name=Certificate]").each(function (i, o) {
                if (String($(o).val()).toLocaleLowerCase() == "false") {
                    $(o).prop("checked", true)
                }
                else {
                    $(o).prop("checked", false)
                }
            })

            $("[name=Certificate]").removeAttr("necessary")
            $("#ExpectedDate").removeAttr("necessary")

            model.Certificate = false
            model.ExpectedDate = null
        }

        else {
            //特定
            Global.supplierTypeLookupCode = "SPECIFIC_NF"

            $("#divIsToBeCertificate").show()
            $("[name=Certificate]").attr("necessary", "")

            fun_AppendNextApproverList()
        }
    }

    function CurrencyChange() {
        let selectdCurrency = $.grep(Global.FiisData.CurrencyList, function (o) {
            return o.currencyCode == e.target.value
        })
        if (selectdCurrency.length > 0) {
            model.CurrencyPrecise = (selectdCurrency[0].extendedPrecision > 6) ? 6 : selectdCurrency[0].extendedPrecision
            model.CurrencyName = selectdCurrency[0].currencyName
        }

        if (e.target.value == 'TWD') {
            model.BargainingCode = null
            model.ExportApplyAttribute = null
            model.Rate = 1
            model.CurrencyPrecise = 0
            Global.Rate = 1
            $("#Rate").prop("disabled", true).addClass("input-disable").removeAttr("necessary").val("1")
            $("#Rate").next("[errmsg]").remove()
            $("#BargainingCode").prop("disabled", true).addClass("input-disable").removeAttr("necessary").val("")
            $("#ExportApplyAttribute").prop("disabled", true).selectpicker('setStyle', 'input-disable', 'add').removeAttr("necessary").val("")
            $("#BargainingCode_star").hide()
            $("#ExportApplyAttribute_star").hide()
        }
        else {
            $("#Rate").prop("disabled", false).removeClass("input-disable").attr("necessary", "")
            $("#BargainingCode").prop("disabled", false).removeClass("input-disable").attr("necessary", "")
            $("#ExportApplyAttribute").prop("disabled", false).selectpicker('setStyle', 'input-disable', 'remove').attr("necessary", "").selectpicker("refresh")
            $("#BargainingCode_star").show()
            $("#ExportApplyAttribute_star").show()
        }
    }

    switch (e.target.name) {
        case "ExpenseKind":
            {
                if (!isNullOrEmpty(model.VendorID) && e.target.value != Global.ExpenseKind) {
                    confirmopen("修改此欄位會將所有資料清空，是否確認修改",
                    function () {
                        //清空供應商資訊
                        model.VendorID = null
                        model.VendorKind = null
                        model.VendorName = null
                        model.VendorNum = null
                        model.VendorAddress = null
                        model.VendorSiteCode = null
                        model.ContactPostNum = null
                        model.ContactAddress = null
                        model.LocationID = null
                        model.PaymentInfo.Remittance = null
                        $("#VendorNumAndName").html('<span class="undone-text">請點選右方【選擇】鈕選擇付款對象</span>')
                        //清空供應商資訊

                        //清空帳戶資訊
                        model.PaymentInfo.AccountDesc = null
                        model.PaymentInfo.AccountName = null
                        model.PaymentInfo.AccountNum = null
                        model.PaymentInfo.BankAccountId = null
                        model.PaymentInfo.Branch = null
                        model.PaymentInfo.BranchName = null
                        $("#PaymentInfo_AccountDesc").html('<span class="undone-text">系統自動帶入</span>')
                        $("#PaymentInfo_AccountNum").html('<span class="undone-text">系統自動帶入</span>')
                        $("#PaymentInfo_AccountName").html('<span class="undone-text">系統自動帶入</span>')
                        $("#PaymentInfo_BranchName").html('<span class="undone-text">系統自動帶入</span>')
                        //清空帳戶資訊

                        //清空明細
                        $(model.EEADetail).each(function (i, o) { o.IsDelete = true });
                        $("#tab_Invoice tbody").not("[alt=no-data]").remove();
                        $("#tab_Invoice tbody[alt=no-data]").show();
                        //清空明細

                        $("#PayInfo").hide()
                        $("#PayMentInfoArea").hide()

                        ExpenseKindChange()
                    },
                    function () {
                        Global.EEAModel.ExpenseKind = Global.ExpenseKind;
                        $("#ExpenseKind").val(Global.EEAModel.ExpenseKind).selectpicker("refresh")

                        change = false
                    })
                }
                else {
                    ExpenseKindChange()
                }
            }

            break;

        case "Certificate":
            {
                if (String(e.target.value).toLocaleLowerCase() == "true") {
                    model.Certificate = true
                    $("#divExpectedDate").show()
                    $("#ExpectedDate").attr("necessary", "")
                }
                else {
                    model.Certificate = false
                    $("#divExpectedDate").hide()
                    $("#ExpectedDate").removeAttr("necessary")
                    $("#ExpectedDate").val("")
                    model.ExpectedDate = null
                }
            }
            break;

        case "Currency":
            {
                if (model.EEADetail != null && $.grep(Global.EEAModel.EEADetail, function (o) { return (!o.IsDelete) }).length > 0 && e.target.value != Global.Currency) {
                    confirmopen("修改此欄位會將所有明細資料清空，是否確認修改",
                    function () {
                        //清空明細
                        $(model.EEADetail).each(function (i, o) { o.IsDelete = true });
                        $("#tab_Invoice tbody").not("[alt=no-data]").remove();
                        $("#tab_Invoice tbody[alt=no-data]").show();
                        //清空明細
                        model.TWDAmount = 0
                        model.TWDPayAmount = 0
                        model.PaymentAmount = 0
                        model.CertificateAmount = 0
                        model.OriginalAmount = 0

                        $("[name=CertificateAmount]").text(0)
                        $("[name=OriginalAmount]").text(0)
                        $("[name=TWDAmount]").text(0)
                        $("[name=TWDPayAmount]").text(0)
                        $("[name=PaymentAmount]").text(0)

                        CurrencyChange()
                    },
                    function () {
                        Global.EEAModel.Currency = Global.Currency;
                        $("#Currency").val(Global.EEAModel.Currency).selectpicker("refresh")
                    })
                }
                else {
                    CurrencyChange()
                }
            }
            break;
        case "VoucherBeau":
            {
                //KEY Value 會重覆..
                /*  let selectdVoucherBeau = $.grep(Global.FiisData.VoucherBeauList, function (o) {
                      return o.bANNumber == e.target.value
                  })
                  if (selectdVoucherBeau.length > 0) {
                      model.VoucherBeauName = selectdVoucherBeau[0].businessEntity
                      model.Books = selectdVoucherBeau[0].accountCode
                      model.BooksName = selectdVoucherBeau[0].accountName
                      model.gvdeclaration = selectdVoucherBeau[0].gvDeclaration
                      model.iscreditcardoffice = selectdVoucherBeau[0].isCreditCardOffice
                      $("[name=Books]").text(model.Books + " " + model.BooksName)
                  }*/

                selectdVoucherBeau = Global.FiisData.VoucherBeauList[e.target.selectedIndex - 1]
                model.VoucherBeauName = selectdVoucherBeau.businessEntity
                model.Books = selectdVoucherBeau.accountCode
                model.BooksName = selectdVoucherBeau.accountName
                model.gvdeclaration = selectdVoucherBeau.gvDeclaration
                model.iscreditcardoffice = selectdVoucherBeau.isCreditCardOffice
                $("[name=Books]").text(model.Books + " " + model.BooksName)
            }
            break;
        case "PaymentInfo.Branch":
            {
                let selectdBranch = $.grep(Global.FiisData.BranchList, function (o) {
                    return o.branchNumber == e.target.value
                })
                if (selectdBranch.length > 0) {
                    model.PaymentInfo.BranchName = selectdBranch[0].branchName
                }
            }
            break;

        case "Rate":
            {
                if (model.EEADetail != null && $.grep(Global.EEAModel.EEADetail, function (o) { return (!o.IsDelete) }).length > 0 && e.target.value != Global.Rate) {
                    confirmopen("修改此欄位會將所有明細資料清空，是否確認修改",
                    function () {
                        //清空明細
                        $(model.EEADetail).each(function (i, o) { o.IsDelete = true });
                        $("#tab_Invoice tbody").not("[alt=no-data]").remove();
                        $("#tab_Invoice tbody[alt=no-data]").show();
                        //清空明細
                        model.TWDAmount = 0
                        model.TWDPayAmount = 0
                        model.PaymentAmount = 0
                        model.CertificateAmount = 0
                        model.OriginalAmount = 0

                        $("[name=CertificateAmount]").text(0)
                        $("[name=OriginalAmount]").text(0)
                        $("[name=TWDAmount]").text(0)
                        $("[name=TWDPayAmount]").text(0)
                        $("[name=PaymentAmount]").text(0)
                    },
                    function () {
                        Global.EEAModel.Rate = Global.Rate;
                        $("#Rate").val(Global.EEAModel.Rate)

                        /*
                        model.TWDAmount = parseInt(accounting.toFixed(model.Rate * model.CertificateAmount))
                        model.TWDPayAmount = parseInt(accounting.toFixed(model.Rate * model.OriginalAmount))
                        model.PaymentAmount = model.TWDAmount
                        $("[name=TWDAmount]").text(fun_accountingformatNumberdelzero(model.TWDAmount))
                        $("[name=TWDPayAmount]").text(fun_accountingformatNumberdelzero(model.TWDPayAmount))
                        $("[name=PaymentAmount]").text(fun_accountingformatNumberdelzero(model.PaymentAmount))*/
                    })
                }
            }
            break;

        case "ExportApplyAttribute":
            Global.EEAModel.ExportApplyAttributeName = $(e.target).find("option:selected").text()

            break;

        case "BargainingCode":
            if (e.target.value.length > 0) {
                let reg = /^[a-zA-Z0-9]*$/
                if (!reg.test(e.target.value)) {
                    Global.EEAModel.BargainingCode = null;
                    fun_AddErrMesg(e.target, "err_BargainingCode", "議價編碼限填入英數字")
                }
            }

            break;
    }
}
function popDetailControlAction(model, e) {
    ///<summary>popDetail控建動作</summary>
    ///<param name="model">繫結的class</param>
    ///<param name="target">觸發動作</param>

    switch (e.target.name) {
        case "PaymentCategory":
            model.PaymentCategoryName = $(e.target).find("option:selected").text()
            model.PaymentMidCategory = null
            model.PaymentMidCategoryName = null
            model.ExpenseAttribute = null
            model.ExpenseAttributeName = null

            pop_PaymentCategoryChange(e.target.value)
            break;

        case "PaymentMidCategory":
            model.PaymentMidCategoryName = $(e.target).find("option:selected").text()
            if (isNullOrEmpty(model.ExpenseDesc)) {
                model.ExpenseDesc = model.PaymentMidCategoryName
                $("#popDetail").find("#ExpenseDesc").val(model.PaymentMidCategoryName)
            }
            model.ExpenseAttribute = null
            model.ExpenseAttributeName = null
            pop_PaymentMidCategoryChange(e.target.value)
            break;

        case "ExpenseAttribute":
            model.ExpenseAttributeName = $(e.target).find("option:selected").text()
            model.NeedCertificate = ($(e.target).find("option:selected").data("NeedCertificate") == "Y")
            let AccountingItem = $(e.target).find("option:selected").data("AccountingCode")
            let AccountingItemName = $(e.target).find("option:selected").data("AccountingName")
            $("[alt=ErrAmortizationDetailAccountingItemCode]").remove();
            $("#tab_InvoiceDetail tbody").each(function (i, target) {
                if (isNullOrEmpty($(target).find("[name=AccountingItem]").val())) {
                    $(target).find("#AmortizationDetailAccountingItemCode").val(AccountingItem)
                    $(target).find("#AmortizationDetailAccountingItemName").val(AccountingItemName)
                    $(target).find("#AmortizationDetailAccountingItemDisable").text(AccountingItem + "-" + AccountingItemName)
                }
            })

            $.each(model.AmortizationDetailList, function (i, o) {
                if (isNullOrEmpty(o.AccountingItem)) {
                    o.AccountingItem = AccountingItem
                    o.AccountingItemName = AccountingItemName
                }
            })

            break;
        case "EstimateVoucherDate":
            model.strEstimateVoucherDate = e.target.value
            if (isNullOrEmpty(e.target.value)) {
                model.EstimateVoucherDate = null
            }
            pop_EstimateVoucherDateChange(e.target.value)
            break;

        case "CertificateKind":

            model.CertificateKindName = $(e.target).find("option:selected").text()
            pop_CertificateNumChange(e.target.value)

            break;
        case "TaxIdNum":
            {
                if (isNullOrEmpty(e.target.value)) {
                    break;
                }
                if (!TaxIDCheck(e.target.value)) {
                    fun_AddErrMesg($("#TaxIdNum"), "ErrTaxIdNum", "內容或格式錯誤，請輸入8碼半形數字")
                }
            }
            break;

        case "CertificateNum":
            {
                if (isNullOrEmpty(e.target.value)) {
                    break;
                }
                if (model.CertificateKind == "1") {
                   // model.CertificateNum = model.CertificateNum.toLocaleUpperCase()
                   // e.target.value = e.target.value.toLocaleUpperCase()
                    if (!CertificateNumCheck(e.target.value)) {
                        //  fun_AddErrMesg($("#CertificateNum"), "ErrCertificateNum", "發票號碼為2~3碼英文+數字(總長十碼，皆為半型)")
                        fun_AddErrMesg($("#CertificateNum"), "ErrCertificateNum", "發票號碼為2碼英文+8碼英數字(皆為半型)")
                    }
                    else {
                        CertificateNumUesd(e.target.value)
                    }
                }
            }
            break;

        case "OriginalAmount":
            model.AcceptanceAmount = parseFloat(accounting.toFixed(model.OriginalAmount - model.OriginalTax, model.CurrencyPrecise))
            model.TWDAmount = parseInt(accounting.toFixed(model.OriginalAmount * model.Rate))
            model.TWDSaleAmount = model.TWDAmount - model.TWDTaxAmount
            $("#OriginalTax").attr("MaxValue", model.OriginalAmount)
            $("[name=AcceptanceAmount]").text(fun_accountingformatNumberdelzero(model.AcceptanceAmount))
            $("[name=TWDAmount]").text(fun_accountingformatNumberdelzero(model.TWDAmount))
            $("[name=TWDSaleAmount]").text(fun_accountingformatNumberdelzero(model.TWDSaleAmount))
            if (model.OriginalAmount < model.OriginalTax) {
                fun_AddErrMesg($("#OriginalTax"), "ErrOriginalTax", "稅額(原幣)不得大於金額(原幣)")
            }
            else {
                fun_popDetailAmountCalculate()
            }
            break;
        case "OriginalTax":
            model.AcceptanceAmount = parseFloat(accounting.toFixed(model.OriginalAmount - model.OriginalTax, model.CurrencyPrecise))
            model.TWDTaxAmount = parseInt(accounting.toFixed(model.OriginalTax * model.Rate))
            model.TWDSaleAmount = model.TWDAmount - model.TWDTaxAmount
            $("[name=AcceptanceAmount]").text(fun_accountingformatNumberdelzero(model.AcceptanceAmount))
            $("[name=TWDTaxAmount]").text(fun_accountingformatNumberdelzero(model.TWDTaxAmount))
            $("[name=TWDSaleAmount]").text(fun_accountingformatNumberdelzero(model.TWDSaleAmount))
            if (model.OriginalTax > model.OriginalAmount) {
                fun_AddErrMesg(e.target, "ErrOriginalTax", "稅額(原幣)不得大於金額(原幣)")
            }
            else {
                fun_popDetailAmountCalculate()
            }
            break;

        case "ProjectCategory":
            model.Project = null
            model.ProjectItem = null

            pop_ProjectCategoryChange(e.target.value)
            break;

        case "Project":
            model.ProjectItem = null
            pop_ProjectChange(e.target.value)
            break;
        default:

            break;
    }

    if (e.target.hasAttribute("alt")) {
        let len = parseInt(e.target.name.substr(e.target.name.indexOf("[") + 1, e.target.name.indexOf("]") - e.target.name.indexOf("[") - 1))
        switch (e.target.attributes.alt.value) {
            case "AccountBank":
                model.AmortizationDetailList[len].AccountBankName = $.grep(Global.FiisData.CoaCompany, function (o) {
                    return o.company == e.target.value
                })[0].description

                break;
            case "CostProfitCenter":
                model.AmortizationDetailList[len].CostProfitCenterName = $.grep(Global.FiisData.DepartmentList, function (o) {
                    return o.department == e.target.value
                })[0].description
                break;

            case "AccountingItem":
                model.AmortizationDetailList[len].AccountingItemName = $(e.target).next("#AmortizationDetailAccountingItemName").val()

                break;
            case "ProductKind":
                model.AmortizationDetailList[len].ProductKindName = $.grep(Global.FiisData.ProductList, function (o) {
                    return o.product == e.target.value
                })[0].description
                break;
            case "ProductDetail":
                model.AmortizationDetailList[len].ProductDetailName = $(e.target).next("#AmortizationDetailProductDetailName").val()

                break;

            case "ExpenseAttribute":
                model.AmortizationDetailList[len].ExpenseAttributeName = $(e.target).find("option:selected").text()

                break;

            case "OriginalAmortizationAmount":
                model.AmortizationDetailList[len].OriginalAmortizationTWDAmount = parseInt(accounting.toFixed(model.AmortizationDetailList[len].OriginalAmortizationAmount * model.Rate))
                $(e.target).closest("tbody").find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(model.AmortizationDetailList[len].OriginalAmortizationTWDAmount))
                fun_popDetailAmountCalculate()
                break;
        }
    }
}
function businessTaxControlAction(model, e) {
    switch (e.target.name) {
        case "FormatKind":
            model.FormatKindName = $(e.target).find("option:selected").text()
            break;
        case "TaxCategory":
            model.TaxCategoryName = $(e.target).find("option:selected").text()
            break;
        case "IsDeduction":
            $.each(Global.EEAModel.EEADetail, function (i, o) {
                if (!o.IsDelete
                    && ((model.CertificateNum == null) ? "" : model.CertificateNum) == ((o.CertificateNum == null) ? "" : o.CertificateNum)
                               && ((model.CertificateDate == null) ? "" : model.CertificateDate) == ((o.EstimateVoucherDate == null) ? "" : o.EstimateVoucherDate)
                               && ((model.BusinessNum == null) ? "" : model.BusinessNum) == ((o.TaxIdNum == null) ? "" : o.TaxIdNum)
                     ) {
                    if (o.IsDeduction != model.IsDeduction) {
                        o.IsDeduction = model.IsDeduction;

                        let parsent = 1;
                        if (o.IsDeduction == "Y") {
                            parsent = parseFloat(accounting.toFixed((o.OriginalAmount - o.OriginalTax) / o.OriginalAmount, 2))
                        }
                        else {
                            parsent = parseFloat(accounting.toFixed(o.OriginalAmount / (o.OriginalAmount - o.OriginalTax), 2))
                        }

                        $.each(o.AmortizationDetailList, function (x, y) {
                            if (!y.IsDelete) {
                                //按比例重算
                                y.OriginalAmortizationAmount = parseFloat(accounting.toFixed(y.OriginalAmortizationAmount * parsent, Global.EEAModel.CurrencyPrecise))
                                y.OriginalAmortizationTWDAmount = parseInt(accounting.toFixed(y.OriginalAmortizationAmount * o.Rate))
                          
                            }
                        })

                        fun_AmountCalculate(o)
                    }
                }
            })

            model.TaxCategoryName = $(e.target).find("option:selected").text()
            break;
    }
}

//取得登入者能使用之雜項請款帳戶
function GetEEASupplierList() {
    $.ajax({
        cache: false,
        url: '/EEA/GetEEASupplierList/' + $("#ApplicantEmpNum").val(),
        dataType: 'json',
        type: 'POST',
        async: false,
        success: function (data) {
            Global.SupplierList = data
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("取得可用雜項帳戶清單失敗!!")
        }
    });
}
//覆寫供應商跳窗function
function resultOutput() {
    $('#AddVendor').block({ message: '正在搜尋供應商' });
    return $.ajax({
        cache: false,
        url: '/FIIS/GetVendorByFIIS',
        dataType: 'json',
        type: 'POST',
        data: { sourceCode: 'EEA', optionInput: optionInput },
        success: function (data, textStatus, jqXHR) {
            _vendor = $.grep(data.supplier, function (o) { return o.supplierTypeLookupCode == Global.supplierTypeLookupCode })
            $('#VendorList').empty();

            $.each(_vendor, function (index, element) {
                $.each(element.supplierSite, function (index, innerElement) {
                    //  if ((Global.supplierTypeLookupCode == "SPECIFIC" &&  Global.SupplierList.includes(element.supplierNumber)) IE不支援includes 
                    if ((Global.supplierTypeLookupCode == "SPECIFIC" && $.grep(Global.SupplierList, function (o) {return  o == element.supplierNumber }).length>0)
                        || Global.supplierTypeLookupCode == "SPECIFIC_NF") {
                        var li = $('#li_tmp').clone();
                        $(li).attr('id', element.supplierNumber).show();
                        var divList = $(li).find('div');
                        $(divList[0]).find('input').val(element.supplierNumber);
                        $(divList[1]).text(element.supplierNumber);
                        $(divList[2]).text(element.supplierName);
                        $(divList[3]).text(element.vatRegistrationNumber ? element.vatRegistrationNumber : '-');
                        $(divList[4]).text(innerElement.supplierSiteCode).attr('id', innerElement.supplierSiteID).addClass('supplierSiteID');
                        $('#VendorList').append(li);
                    }
                });
            });
            $('#AddVendor').unblock();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
            $('#AddVendor').unblock();
        }
    });
}
//供應商選擇完動作
function vendorSelected(vendors) {
    Global.EEAModel.VendorID = vendors.supplierID
    Global.EEAModel.VendorKind = vendors.supplierTypeLookupCode
    Global.EEAModel.VendorName = vendors.supplierName
    Global.EEAModel.VendorNum = vendors.supplierNumber
    Global.EEAModel.IDNo = vendors.vatRegistrationNumber
    Global.EEAModel.LocationID = vendors.supplierSite[0].supplierSiteID
    Global.EEAModel.VendorAddress = vendors.supplierSite[0].invoiceCity + " " + vendors.supplierSite[0].invoiceZipCode + " " + vendors.supplierSite[0].invoiceAddress
    Global.EEAModel.VendorSiteCode = vendors.supplierSite[0].supplierSiteCode
    Global.EEAModel.ContactPostNum = vendors.supplierSite[0].contactZipCode
    Global.EEAModel.ContactAddress = vendors.supplierSite[0].contactCity + " " + vendors.supplierSite[0].contactZipCode + " " + vendors.supplierSite[0].contactAddress
    Global.EEAModel.IdentityFlag = vendors.supplierSite[0].IdentityFlag
    Global.EEAModel.PaymentInfo.Remittance = isNullOrEmpty(vendors.supplierSite[0].paymentReasonCode) ? " " : vendors.supplierSite[0].paymentReasonCode
    Global.EEAModel.PayAlone = (vendors.supplierSite[0].exclusivePaymentFlag == "Y")

    //固定為電匯
    //Global.EEAModel.PaymentInfo.PaymentMethod= vendorInfo.supplierSite[0].paymentMethodLookupCode

    Global.EEAModel.PaymentInfo.EMPName = Global.EEAModel.VendorName
    Global.EEAModel.PaymentInfo.EMPNum = Global.EEAModel.VendorNum
    $("#VendorNumAndName").html(Global.EEAModel.VendorName + "(" + Global.EEAModel.VendorNum + ")")
    $("#PayAlone").prop("checked", Global.EEAModel.PayAlone)

    switch (Global.EEAModel.PaymentInfo.Remittance) {
        case "1":
            $("#PaymentInfo_Remittance").html("內扣")
            break;
        case "2":
            $("#PaymentInfo_Remittance").html("外加")
            break;
        default:
            $("#PaymentInfo_Remittance").html(Global.EEAModel.PaymentInfo.Remittance)
            break;
    }

    $("#PayInfo").show()
    $("#PayMentInfoArea").show()

    PaymentAccount(vendors.supplierBank)

    //清空帳戶資訊
    Global.EEAModel.PaymentInfo.AccountDesc = null
    Global.EEAModel.PaymentInfo.AccountName = null
    Global.EEAModel.PaymentInfo.AccountNum = null
    Global.EEAModel.PaymentInfo.BankAccountId = null
    Global.EEAModel.PaymentInfo.Branch = null
    Global.EEAModel.PaymentInfo.BranchName = null

    $("#PaymentInfo_AccountDesc").html('<span class="undone-text">系統自動帶入</span>')
    $("#PaymentInfo_AccountNum").html('<span class="undone-text">系統自動帶入</span>')
    $("#PaymentInfo_AccountName").html('<span class="undone-text">系統自動帶入</span>')
    $("#PaymentInfo_BranchName").html('<span class="undone-text">系統自動帶入</span>')

    if (Global.supplierTypeLookupCode == "SPECIFIC") {
        fun_AppendNextApproverList()
    }
}

//重繪下一關人員
function fun_AppendNextApproverList() {
    if ($("#P_CurrentStep").val() != "1") return false;

    //等待第一次渲染下一關人員後再動作
    if ($('#sentdropbox').length == 0) {
        setTimeout(fun_AppendNextApproverList, 500)
        return false
    }
    blockPageForJBPMSend()

    if (Global.supplierTypeLookupCode == "SPECIFIC_NF") {
        $('#sentdropbox').empty().selectpicker('refresh');
        let requestGetNextApprover = {
            StepFrom: 1,
            CustomFlowKey: "EEA_P1_01",//卡處與非卡處都是傳給主管，所以不用另外處理,
            AdditionStage: 1,
            ExecutorUnitCode: "2531", //尚未用到
            SendCase: 1,//下一關人員
            SignID: !isNullOrEmpty($('#P_JBPMUID').val()) ? $('#P_SignID').val() : "", //可從頁面取值,得判斷有無UID(草稿有SIGNID但無UID)
            LoginENO: $('#LoginEno').val()
        }

        $.when(GetNextApprover(requestGetNextApprover, 1)).done(function (data) {
            let SignedID = data.SignedID;
            let SignedName = data.SignedName;

            $.each(SignedID, function (index, item) {
                //如只有單選項，直接預設選取; 如多選項，下拉選取
                if (SignedID.length == 1) {
                    $('#sentdropbox').append('<option value="' + SignedID[0] + '" selected>' + SignedName[0] + '(' + SignedID[0] + ')</option>');
                } else {
                    $('#sentdropbox').append('<option value="' + SignedID[index] + '">' + SignedName[index] + '(' + SignedID[index] + ')</option>');
                }
            });
            $('#sentdropbox').selectpicker('refresh');
        }).always(function () {
            $.unblockUI();
        })
    }
    else {
        $('#sentdropbox').empty()
        $.ajax({
            cache: false,
            url: '/EEA/GetEEAReviewList/' + Global.EEAModel.VendorNum,
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                $.each(data, function (key, txt) {
                    if (data.length == 1) {
                        $('#sentdropbox').append('<option value="' + key + '" selected>' + txt + '(' + key + ')</option>');
                    } else {
                        $('#sentdropbox').append('<option value="' + key + '">' + txt + '(' + key + ')</option>');
                    }
                })
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("取得覆核人員清單失敗!!")
            }
        }).always(function () {
            $('#sentdropbox').selectpicker('refresh');
            $.unblockUI();
        });
    }
}

//下一關人員實作
function GetPageCustomizedList(stepSequence) {
    let SignedID = [];
    let SignedName = [];

    //資料載入的時候會在重繪一次，不用重覆作業
    /*$.ajax({
        cache: false,
        url: '/EEA/GetEEAReviewList/' + Global.EEAModel.VendorNum,
        dataType: 'json',
        type: 'POST',
        async:true,
        success: function (data) {
            $.each(data, function (key, txt) {
                SignedID.push(key);
                SignedName.push(txt);
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("取得覆核人員清單失敗!!")
        }
    });*/

    return { SignedID: [SignedID], SignedName: [SignedName] }
}

//重繪供應商的帳戶資訊跳窗資料
function PaymentAccount(bankInfo) {
    //////假
    bankInfo.push({
        "activeFlag": "Y",
        "extBankAccountId": 281,
        "bankNumber": "000",
        "bankName": "中央銀行國庫局",
        "homeCountry": "TW",
        "branchNumber": "0022",
        "bankBranchName": "國庫局",
        "eftSwiftCode": null,
        "bankAccountName": "AA0014(測試用)",
        "bankAccountNumber": "AA0014(測試用)",
        "bankAccountNumRemark": "AA0014(測試用)",
        "remitanceCheckCode": "AA0014(測試用)"
    })

    bankInfo.push({
        "activeFlag": "Y",
        "extBankAccountId": 281,
        "bankNumber": "808",
        "bankName": "玉山銀行國庫局",
        "homeCountry": "TW",
        "branchNumber": "0022",
        "bankBranchName": "國庫局",
        "eftSwiftCode": null,
        "bankAccountName": "AA0014(測試用)",
        "bankAccountNumber": "AA0014(測試用)",
        "bankAccountNumRemark": "AA0014(測試用)",
        "remitanceCheckCode": "AA0014(測試用)"
    })
    bankInfo.push({
        "activeFlag": "Y",
        "extBankAccountId": 281,
        "bankNumber": "808",
        "bankName": "玉山銀行國庫局",
        "homeCountry": "TW",
        "branchNumber": "0021",
        "bankBranchName": "國庫局1",
        "eftSwiftCode": null,
        "bankAccountName": "AA0014(測屁測)",
        "bankAccountNumber": "AA0014(測屁測)",
        "bankAccountNumRemark": "AA0014(測屁測)",
        "remitanceCheckCode": "AA0014(測屁測)"
    })
    //////假

    let AccountList = $('div#AccountSelectRemodal div#AccountList div.popup-tbody')
    AccountList.empty();
    Global.bankInfo = bankInfo
    $.each(bankInfo, function (index, item) {
        if (item.bankNumber != "808") return true //僅載入玉山銀行的資料

        if (item.bankAccountNumRemark == null) {
            item.bankAccountNumRemark = "　";
        }
        AccountList.append('<li class="AccountSelect" index="' + index + '">\
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

//供應商帳戶選擇完動作
function AccountConfirm(bankinfo) {
    Global.EEAModel.PaymentInfo.AccountDesc = bankinfo.bankAccountNumRemark
    Global.EEAModel.PaymentInfo.AccountName = bankinfo.bankAccountName
    Global.EEAModel.PaymentInfo.AccountNum = bankinfo.bankAccountNumber
    Global.EEAModel.PaymentInfo.BankAccountId = bankinfo.extBankAccountId
    //固定為玉山銀行
    //Global.EEAModel.PaymentInfo.Bank = bankinfo.bankNumber
    //Global.EEAModel.PaymentInfo.BankName = bankinfo.bankName
    Global.EEAModel.PaymentInfo.Branch = bankinfo.branchNumber
    Global.EEAModel.PaymentInfo.BranchName = bankinfo.bankBranchName

    $("#PaymentInfo_AccountDesc").html(Global.EEAModel.PaymentInfo.AccountDesc)
    $("#PaymentInfo_AccountNum").html(Global.EEAModel.PaymentInfo.AccountNum)
    $("#PaymentInfo_AccountName").html(Global.EEAModel.PaymentInfo.AccountName)
    $("#PaymentInfo_BranchName").html(Global.EEAModel.PaymentInfo.Branch + " " + Global.EEAModel.PaymentInfo.BranchName)
}

//請款明細視窗開啟與資料載入
function popDetailLoading(detail) {
    if (isNullOrEmpty(detail.ExpenseKind) || isNullOrEmpty(detail.CurrencyName) || isNullOrEmpty(detail.Rate)) {
        alertopen("請先選擇請款類別與幣別匯率")
        return false;
    }

    $("#divInvoiceOverDue").hide()
    $("#divYearVoucher").hide()
    $("#InvoiceOverDue").removeAttr("necessary").val("")
    $("#YearVoucher").removeAttr("necessary").val("")

    Global.popDetailInfo = $.extend(getEEADetailModel(), detail);
    Global.popDetailInfo.EstimateVoucherDate = Global.popDetailInfo.strEstimateVoucherDate
    let pop = $("#popDetail")
    $(pop).find(".list-close-icon").addClass("list-open-icon").removeClass("list-close-icon")
    //移除所有錯誤訊息
    $(pop).find("[errmsg]").remove()

    //明細層處理
    {
        if (Global.flowPart == 2) {//會計經辦
            fun_ControlDisable($(pop).find("#PaymentCategory"), Global.popDetailInfo.PaymentCategoryName)
            fun_ControlDisable($(pop).find("#PaymentMidCategory"), Global.popDetailInfo.PaymentMidCategoryName)
            fun_ControlDisable($(pop).find("#ExpenseAttribute"), Global.popDetailInfo.ExpenseAttributeName)
            fun_ControlDisable($(pop).find("#ExpenseDesc"), Global.popDetailInfo.ExpenseDesc)
            fun_ControlDisable($(pop).find("#ProjectCategory"), Global.popDetailInfo.ProjectCategoryName)
            fun_ControlDisable($(pop).find("#Project"), Global.popDetailInfo.ProjectName)
            fun_ControlDisable($(pop).find("#ProjectItem"), Global.popDetailInfo.ProjectItemName)
        }
        else {
            $(pop).find("#PaymentCategory").empty().selectpicker("refresh")
            //載入請款大類
            $.ajax({
                url: ajaxUrl_GetPaymentCategoryItems,
                dataType: 'json',
                type: 'POST',
                async: false,
                data: { PaymentKind: Global.EEAModel.ExpenseKind },
                success: function (data) {
                    $.each(data, function (key, value) {
                        $(pop).find("#PaymentCategory").append($("<option></option>").attr("value", key).text(value))
                    });
                    $(pop).find("#PaymentCategory").selectpicker("refresh")
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("讀取請款大類發生問題");
                    return false
                }
            });
        }
        $.each(Object.keys(Global.popDetailInfo), function (i, o) {
            let target = $(pop).find("[name=" + o + "]")
            if (target.length > 0) {
                switch ($(target)[0].tagName) {
                    case "SELECT":
                        $(target).eq(0).val(Global.popDetailInfo[o]).selectpicker("refresh")
                        break;
                    case "TEXTAREA":
                        $(target).eq(0).val(Global.popDetailInfo[o])
                        break;
                    case "INPUT":
                        $(target).eq(0).val(Global.popDetailInfo[o])
                        if ($(target)[0].type == "checkbox") {
                            if (Global.popDetailInfo[o]) {
                                $(target).eq(0).prop("checked", true)
                            }
                            else {
                                $(target).eq(0).prop("checked", false)
                            }
                        }

                        break;
                    default:
                        $(target).eq(0).text(Global.popDetailInfo[o])
                        break;
                }
            }
            $(pop).find("[amount]").each(function (i, o) {
                $(this).val(fun_accountingformatNumberdelzero($(this).val()))
                $(this).text(fun_accountingformatNumberdelzero($(this).text()))
            })
        })

        //多層選單連動處理
        {
            pop_PaymentCategoryChange(Global.popDetailInfo.PaymentCategory)
            $(pop).find("#PaymentMidCategory").val(Global.popDetailInfo.PaymentMidCategory).selectpicker("refresh")
            pop_PaymentMidCategoryChange(Global.popDetailInfo.PaymentMidCategory)
            $(pop).find("#ExpenseAttribute").val(Global.popDetailInfo.ExpenseAttribute).selectpicker("refresh")
            pop_ProjectCategoryChange(Global.popDetailInfo.ProjectCategory)
            $(pop).find("#Project").val(Global.popDetailInfo.Project).selectpicker("refresh")
            pop_ProjectChange(Global.popDetailInfo.Project)
            $(pop).find("#ProjectItem").val(Global.popDetailInfo.ProjectItem).selectpicker("refresh")
        }

        $("#popDetail").find("select").selectpicker("refresh")

        // pop_EstimateVoucherDateChange(Global.popDetailInfo.EstimateVoucherDate) *pop_CertificateNumChange 會再觸發pop_EstimateVoucherDateChange
    }

    //分攤明細層處理
    {
        $(pop).find("#tab_InvoiceDetail tbody").remove()

        let AmortizationDetailList = Global.popDetailInfo.AmortizationDetailList;

        Global.popDetailInfo.AmortizationDetailList = [];
        $.each(AmortizationDetailList, function (i, o) {
            Global.popDetailInfo.AmortizationDetailList.push($.extend(null, o))
        })

        if (Global.popDetailInfo.AmortizationDetailList.length == 0) {
            let ADetai = getAmortizationDetailModel()
            ADetai.AccountBank = Global.EEAModel.Books
            if (!isNullOrEmpty(ADetai.AccountBank)) {
                ADetai.AccountBankName = $.grep(Global.FiisData.CoaCompany, function (o) {
                    return o.company == ADetai.AccountBank
                })[0].description
            }

            ADetai.CostProfitCenter = __CostProfitCenter

            if (!isNullOrEmpty(ADetai.CostProfitCenter)) {
                ADetai.CostProfitCenterName = $.grep(Global.FiisData.DepartmentList, function (o) {
                    return o.department == ADetai.CostProfitCenter
                })[0].description
            }
            ADetai.AccountingItem = $("#popDetail").find("#ExpenseAttribute").find("option:selected").data("AccountingCode")
            ADetai.AccountingItemName = $("#popDetail").find("#ExpenseAttribute").find("option:selected").data("AccountingName")
            Global.popDetailInfo.AmortizationDetailList.push(ADetai)
        }

        $.each(Global.popDetailInfo.AmortizationDetailList, function (index, AmortizationDetail) {
            if (AmortizationDetail.IsDelete) {
                return true
            }
            pop_AddAmortizationDetail(AmortizationDetail, index)
        })
    }
    pop_CertificateNumChange(Global.popDetailInfo.CertificateKind)
    $('.popup-left-addcase').show(0);
    $('.popup-overlay').fadeIn(0);
    $('.popup-box').animate({ right: "0px" }, 300);
    $("html, body").css("overflow", "hidden");
}

//請款明細層相關連動程式
{
    //請款明細的初始控件動作
    function popControlAction() {
        let popDetail = $("#popDetail")

        $(popDetail).find(".added-info").on("click", function () {
            alertopen("當憑證類別為發票時，發票號碼組成規則為兩碼英文字軌+八碼數字流水號(皆為半型)。&&  例如：DH46956905、BJ09651811")
        })

        $(popDetail).find("#EstimateVoucherDatePicker").data("DateTimePicker").maxDate(Global.today);

        $(popDetail).find("#addsubInvoiceInfo").on("click", function () {
            let ADetai = getAmortizationDetailModel()
            let ExpenseAttributeInfo = pop_ExpenseAttributeInfo()

            ADetai.AccountBank = Global.EEAModel.Books
            ADetai.AccountBankName = Global.EEAModel.BooksName
            ADetai.CostProfitCenter = __CostProfitCenter
            ADetai.CostProfitCenterName = $.map(Global.FiisData.DepartmentList, function (o) { if (o.department == __CostProfitCenter) return o.description })[0]
            ADetai.AccountingItem = (ExpenseAttributeInfo.length > 0) ? ExpenseAttributeInfo[0].AccountingCode : null
            ADetai.AccountingItemName = (ExpenseAttributeInfo.length > 0) ? ExpenseAttributeInfo[0].AccountingName : null
            Global.popDetailInfo.AmortizationDetailList.push(ADetai)
            pop_AddAmortizationDetail(ADetai, Global.popDetailInfo.AmortizationDetailList.length - 1)
        })

        let tbody = $("#tab_copyInvoiceDetail").find("tbody").eq(0)

        let AccountBank = $(tbody).find("[name=AccountBank]")
        let CostProfitCenter = $(tbody).find("[name=CostProfitCenter]")
        let ProductKind = $(tbody).find("[name=ProductKind]")
        let ExpenseAttribute = $(tbody).find("[name=ExpenseAttribute]")

        $.each(Global.FiisData.CoaCompany, function (i, value) {
            $(AccountBank).append($("<option></option>").attr("value", value.company).text(value.company + " " + value.description))
        })
        $.each(Global.FiisData.DepartmentList, function (i, value) {
            $(CostProfitCenter).append($("<option></option>").attr("value", value.department).text(value.department + " " + value.description))
        })
        $(ProductKind).prepend($("<option></option>").attr("value", "").text("請選擇"))
        $.each(Global.FiisData.ProductList, function (i, value) {
            $(ProductKind).append($("<option></option>").attr("value", value.product).text(value.product + " " + value.description));
        })

        let pdDictionary = []
        $.each(Global.FiisData.ProductDetailList, function (i, o) {
            pdDictionary.push({ key: o.productDetail, value: o.productDetallDescription })
        })
        _optionList.push({ key: 'AmortizationDetailProductDetail', value: pdDictionary })

        let CoaAccountDictionary = []
        $.each(Global.FiisData.CoaAccount, function (i, o) {
            CoaAccountDictionary.push({ key: o.account, value: o.description })
        })
        _optionList.push({ key: 'AmortizationDetailAccountingItem', value: CoaAccountDictionary })

        $(popDetail).find("#popConfirm").on("click", function () {
            if (popDetailVerify()) {
                let len = -1
                $.each(Global.EEAModel.EEADetail, function (i, o) {
                    if (o.edit) {
                        len = i
                        return false;
                    }
                })
                if (len > -1) {
                    //營業稅處理
                    if (Global.flowPart == 2 && Global.EEAModel.gvdeclaration == "403") {
                        let hasTax = false;
                        let oldBusinexeInfo = null;
                        let NewBusinexeInfo = null;
                        //扣除舊明細的金額
                        $.each(Global.EEAModel.BusinessTaxList, function (i, o) {
                            if (!o.IsDelete
                                && ((o.CertificateNum == null) ? "" : o.CertificateNum) == ((Global.EEAModel.EEADetail[len].CertificateNum == null) ? "" : Global.EEAModel.EEADetail[len].CertificateNum)
                                && ((o.CertificateDate == null) ? "" : o.CertificateDate) == ((Global.EEAModel.EEADetail[len].strEstimateVoucherDate == null) ? "" : Global.EEAModel.EEADetail[len].strEstimateVoucherDate)
                                && ((o.BusinessNum == null) ? "" : o.BusinessNum) == ((Global.EEAModel.EEADetail[len].TaxIdNum == null) ? "" : Global.EEAModel.EEADetail[len].TaxIdNum)
                                ) {
                                // o.Taxable -= Global.EEAModel.EEADetail[len].TWDSaleAmount;
                                //  o.TaxAmount -= Global.EEAModel.EEADetail[len].TWDTaxAmount;
                                o.CertificateAmount -= Global.EEAModel.EEADetail[len].TWDAmount;
                                oldBusinexeInfo = o;
                                return false
                            }
                        })

                        //加上新明細的金額
                        $.each(Global.EEAModel.BusinessTaxList, function (i, o) {
                            if (!o.IsDelete
                                && ((o.CertificateNum == null) ? "" : o.CertificateNum) == ((Global.popDetailInfo.CertificateNum == null) ? "" : Global.popDetailInfo.CertificateNum)
                                && ((o.CertificateDate == null) ? "" : o.CertificateDate) == ((Global.popDetailInfo.strEstimateVoucherDate == null) ? "" : Global.popDetailInfo.strEstimateVoucherDate)
                                && ((o.BusinessNum == null) ? "" : o.BusinessNum) == ((Global.popDetailInfo.TaxIdNum == null) ? "" : Global.popDetailInfo.TaxIdNum)
                                ) {
                                //  o.Taxable += Global.popDetailInfo.TWDSaleAmount;
                                //  o.TaxAmount += Global.popDetailInfo.TWDTaxAmount;
                                o.CertificateAmount += Global.popDetailInfo.TWDAmount;
                                if (Global.popDetailInfo.IsDeduction == "N") {
                                    o.IsDeduction = "N";
                                }
                                hasTax = true
                                NewBusinexeInfo = o;
                                return false
                            }
                        })
                        //若查無資料則新增該營業稅資料
                        if (!hasTax) {
                            let Newtax = getBusinessTaxModel();
                            Newtax.CertificateNum = Global.popDetailInfo.CertificateNum
                            Newtax.CertificateDate = (isNullOrEmpty(Global.popDetailInfo.strEstimateVoucherDate)) ? null : Global.popDetailInfo.strEstimateVoucherDate
                            Newtax.BusinessNum = Global.popDetailInfo.TaxIdNum
                            Newtax.Taxable = Global.popDetailInfo.TWDSaleAmount;
                            Newtax.TaxAmount = Global.popDetailInfo.TWDTaxAmount;
                            Newtax.CertificateAmount = Global.popDetailInfo.TWDAmount;
                            Newtax.FormatKind = 21;
                            Newtax.IsDeduction = (isDeductible(Global.popDetailInfo)) ? "Y" : "N"
                            Global.EEAModel.BusinessTaxList.push(Newtax)
                            NewBusinexeInfo = Newtax;
                        }

                        //更新頁面上的欄位，總額若為0則移除該營業稅資料
                        let hasTaxRow = false
                        $.each($("#BusinessTaxTable tbody").not("[alt=no-data]"), function (i, o) {
                            let BusinessNum = $(o).find("[name=BusinessNum]").text()
                            let CertificateNum = $(o).find("[name=CertificateNum]").text()
                            let CertificateDate = $(o).find("[name=CertificateDate]").text()

                            if (oldBusinexeInfo != null) {
                                if (BusinessNum == ((oldBusinexeInfo.BusinessNum == null) ? "" : oldBusinexeInfo.BusinessNum) &&
                              CertificateNum == ((oldBusinexeInfo.CertificateNum == null) ? "" : oldBusinexeInfo.CertificateNum) &&
                              CertificateDate == ((oldBusinexeInfo.CertificateDate == null) ? "" : oldBusinexeInfo.CertificateDate)
                              ) {
                                    if (oldBusinexeInfo.CertificateAmount == 0) {
                                        oldBusinexeInfo.IsDelete = true;
                                        $(o).remove()
                                    }
                                    else {
                                        $(o).find("[name=CertificateAmount]").text(fun_accountingformatNumberdelzero(oldBusinexeInfo.CertificateAmount))
                                    }
                                }
                            }

                            if (BusinessNum == ((NewBusinexeInfo.BusinessNum == null) ? "" : NewBusinexeInfo.BusinessNum) &&
                               CertificateNum == ((NewBusinexeInfo.CertificateNum == null) ? "" : NewBusinexeInfo.CertificateNum) &&
                               CertificateDate == ((NewBusinexeInfo.CertificateDate == null) ? "" : NewBusinexeInfo.CertificateDate)
                               ) {
                                if ($(o).find("[name=IsDeduction]").val() == "Y" && NewBusinexeInfo.IsDeduction == "N") {
                                    $(o).find("[name=IsDeduction]").val(NewBusinexeInfo.IsDeduction).selectpicker("refresh")
                                }
                                $(o).find("[name=CertificateAmount]").text(fun_accountingformatNumberdelzero(NewBusinexeInfo.CertificateAmount))
                                hasTaxRow = true;
                            }
                        })

                        //比對不到資料則新增
                        if (!hasTaxRow) {
                            putBusinessTaxInformation(NewBusinexeInfo)
                        }
                    }

                    Global.EEAModel.EEADetail[len] = Global.popDetailInfo
                }
                else {
                    Global.EEAModel.EEADetail.push(Global.popDetailInfo)
                }

                //重算主表金額
                {
                    let AmountObj = $.map(Global.EEAModel.EEADetail, function (o) {
                        if (!o.IsDelete) {
                            return {
                                CertificateAmount: o.OriginalAmount,
                                OriginalAmount: o.OriginalTax,
                                TWDAmount: o.TWDAmount,
                                TWDPayAmount: o.TWDTaxAmount
                            }
                        }
                    }).reduce(function (a, b) {
                        return {
                            CertificateAmount: parseFloat(accounting.toFixed(a.CertificateAmount + b.CertificateAmount, Global.EEAModel.CurrencyPrecise)),
                            OriginalAmount: parseFloat(accounting.toFixed(a.OriginalAmount + b.OriginalAmount, Global.EEAModel.CurrencyPrecise)),
                            TWDAmount: a.TWDAmount + b.TWDAmount,
                            TWDPayAmount: a.TWDPayAmount + b.TWDPayAmount
                        }
                    })

                    Global.EEAModel.CertificateAmount = AmountObj.CertificateAmount
                    Global.EEAModel.OriginalAmount = AmountObj.OriginalAmount
                    Global.EEAModel.TWDAmount = AmountObj.TWDAmount
                    Global.EEAModel.TWDPayAmount = AmountObj.TWDPayAmount
                    Global.EEAModel.PaymentAmount = AmountObj.TWDAmount
                    MasterAmountControlChange()
                }
                //重算主表金額

                tab_InvoiceInput(Global.popDetailInfo)

                //側滑關閉動作
                $('.popup-left-addcase').fadeOut(300);
                $('.popup-overlay').fadeOut(100);
                $('.popup-box').animate({ right: "-70%" }, 80);
                $("html, body").css("overflow", "visible");
                event.preventDefault();//取消預設連結至頂動作
                //側滑關閉動作
            }
        })
    }

    //請款大類變動
    function pop_PaymentCategoryChange(val) {
        $("#PaymentMidCategory").empty();
        $("#ExpenseAttribute").empty();

        $("#PaymentMidCategory").selectpicker('setStyle', 'input-disable', 'add').prop("disabled", true);
        $("#ExpenseAttribute").selectpicker('setStyle', 'input-disable', 'add').prop("disabled", true);

        if (!isNullOrEmpty(val)) {
            $.ajax({
                url: ajaxUrl_GetPaymentMidCategoryItems,
                dataType: 'json',
                type: 'POST',
                async: false,
                data: { PaymentKind: Global.EEAModel.ExpenseKind, PaymentCategory: val },
                success: function (data) {
                    $.each(data, function (key, value) {
                        $("#PaymentMidCategory").append($("<option></option>").attr("value", key).text(value))
                    });
                    $("#PaymentMidCategory").selectpicker('setStyle', 'input-disable', 'remove').prop("disabled", false);
                    $("#PaymentMidCategory").selectpicker("refresh")
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("讀取請款中類發生問題");
                    return false
                }
            });
        }
    }

    //請款中類變動
    function pop_PaymentMidCategoryChange(val) {
        $("#ExpenseAttribute").empty();
        $("#ExpenseAttribute").selectpicker('setStyle', 'input-disable', 'add').prop("disabled", true);

        if (!isNullOrEmpty(val)) {
            $.ajax({
                url: ajaxUrl_GetExpenseStandard,
                dataType: 'json',
                type: 'POST',
                async: false,
                data: { MaxItemNo: Global.popDetailInfo.PaymentCategory, MidItemNo: val },
                success: function (data) {
                    $(data.Detail).each(function (index, info) {
                        $("#ExpenseAttribute").append($("<option></option>").attr("value", info.ExpenseKind).text(info.ExpenseKindName)
                            .data("AccountingCode", info.AccountingCode).data("AccountingName", info.AccountingName).data("NeedCertificate", info.NeedCertificate)
                            .data("BillKind", info.BillKind).data("IsDeduction", info.IsDeduction)
                            .data("PayKind", info.PayKind)
                            );
                    })

                    $("#ExpenseAttribute").selectpicker('setStyle', 'input-disable', 'remove').prop("disabled", false);
                    $("#ExpenseAttribute").selectpicker("refresh")
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("讀取費用屬性發生問題");
                    return false
                }
            });
        }
    }

    //請得請款費用資訊
    function pop_ExpenseAttributeInfo() {
        let ExpenseKindInfo = []
        if (!isNullOrEmpty(Global.popDetailInfo.PaymentCategory) && !isNullOrEmpty(Global.popDetailInfo.PaymentMidCategory) && !isNullOrEmpty(Global.popDetailInfo.ExpenseAttribute)) {
            $.ajax({
                url: ajaxUrl_GetExpenseStandard,
                dataType: 'json',
                type: 'POST',
                async: false,
                data: { MaxItemNo: Global.popDetailInfo.PaymentCategory, MidItemNo: Global.popDetailInfo.PaymentMidCategory },
                success: function (data) {
                    ExpenseKindInfo = $.grep(data.Detail, function (o) {
                        return o.ExpenseKind == Global.popDetailInfo.ExpenseAttribute
                    })
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    ExpenseKindInfo = [];
                }
            });
        }

        return ExpenseKindInfo;
    }

    //憑證類別更改動作
    function pop_CertificateNumChange(val) {
        if (val == "1") {//發票
            $("#TaxIdNum").attr("necessary", "")
            $("#CertificateNum").attr("necessary", "").attr("maxlength", 10)
            $("#CertificateNum").val($("#CertificateNum").val().substr(0, 10))

            $("#EstimateVoucherDate").attr("necessary", "")
            $("#OriginalTax").attr("necessary", "").attr("MaxValue", Global.popDetailInfo.OriginalAmount).show()
            $("#disableOriginalTax").hide()
            $("#TaxIdNumStarMark").show()
            $("#CertificateNumStarMark").show();
            $("#EstimateVoucherDateStarMark").show();

            $("#TaxIdNum").change()
            $("#CertificateNum").change()
        }
        else {
            Global.popDetailInfo.OriginalTax = 0

            $("#TaxIdNum").removeAttr("necessary")
            $("#CertificateNum").removeAttr("necessary")
            $("#EstimateVoucherDate").removeAttr("necessary")
            $("#CertificateNum").attr("maxlength", 15)
            $("#OriginalTax").hide().removeAttr("necessary").val(0);
            $("#disableOriginalTax").show()
            $("#TaxIdNumStarMark").hide()
            $("#CertificateNumStarMark").hide();
            $("#EstimateVoucherDateStarMark").hide();

            $("#TaxIdNum").next("[Errmsg=Y]").remove();
            $("#CertificateNum").next("[Errmsg=Y]").remove();
            $("#EstimateVoucherDate").next("[Errmsg=Y]").remove();
            $("#OriginalTax").next("[Errmsg=Y]").remove();

            $("#OriginalTax").change()
            $("#TaxIdNum").change()
        }

        if ($("#EstimateVoucherDate").val().length > 0) {
            $("#EstimateVoucherDate").blur();
        }

        fun_popDetailAmountCalculate()
    }

    //憑證日期更改動作
    function pop_EstimateVoucherDateChange(_Date) {
        $("#divInvoiceOverDue").hide()
        $("#divYearVoucher").hide()
        $("#InvoiceOverDue").removeAttr("necessary").val("")
        $("#YearVoucher").removeAttr("necessary").val("")

        let InvoiceOverDue = Global.popDetailInfo.InvoiceOverDue;
        Global.popDetailInfo.InvoiceOverDue = "";
        let YearVoucher = Global.popDetailInfo.YearVoucher;
        Global.popDetailInfo.YearVoucher = "";

        //檢核[憑證日期]是否合理，依據申報期間來看不可超過兩期，申報期為兩個月一期(1-2,3-4,5-6,7-8,9-10,11-12) 不可大於現在日期
        //跨年度為逾期
        //僅發票需處理逾期
        if (_Date != null && _Date.length > 0) {
            EstimateVoucherDate = new Date(_Date.trim())
            let err = []
            if (!isNaN(EstimateVoucherDate.getDate())) {
                $("[alt='ErrEstimateVoucherDate']").remove();

                Overdue = new Date();
                thisYear = Overdue.getFullYear();

                if (EstimateVoucherDate.valueOf() > Overdue.valueOf()) {
                    fun_AddErrMesg($("#EstimateVoucherDate"), "ErrEstimateVoucherDate", "發票日期大於目前日期")
                    return false
                }

                //檢查是否跨年度
                if (EstimateVoucherDate.getFullYear() != thisYear) {
                    $("#YearVoucher").attr("necessary", "")
                    $("#divYearVoucher").show(200)

                    if (isNullOrEmpty(YearVoucher)) {
                        err.push("憑證日期已跨年，請輸入【跨年度傳票編號】");
                    }
                    else {
                        Global.popDetailInfo.YearVoucher = YearVoucher
                        $("#YearVoucher").val(Global.popDetailInfo.YearVoucher)
                    }
                    if (Global.popDetailInfo.CertificateKind == "1") {
                        $("#divInvoiceOverDue").show(200)
                        $("#InvoiceOverDue").attr("necessary", "")

                        if (isNullOrEmpty(InvoiceOverDue)) {
                            err.push("發票已逾申報期，請輸入發票逾期說明欄位，並傳送至單位最高主管簽核與確認。");
                        }
                        else {
                            Global.popDetailInfo.InvoiceOverDue = InvoiceOverDue
                            $("#InvoiceOverDue").val(Global.popDetailInfo.InvoiceOverDue)
                        }
                    }
                }
                else {
                    if (Global.popDetailInfo.CertificateKind == "1") {
                        Global.popDetailInfo.YearVoucher = null
                        Overdue.setDate(1)
                        Overdue.setMonth(Overdue.getMonth() - 2)//往前算一期
                        if ((Overdue.getMonth() + 1) % 2 == 0) Overdue.setMonth(Overdue.getMonth() - 1);//若為偶數月則在減一個月 *月份從0開始

                        int_Overdue = parseInt(String(Overdue.getFullYear()) + funAddheadZero(2, Overdue.getMonth()))
                        int_EstimateVoucherDate = parseInt(String(EstimateVoucherDate.getFullYear()) + funAddheadZero(2, EstimateVoucherDate.getMonth()))

                        if (int_EstimateVoucherDate < int_Overdue) {
                            $("#divInvoiceOverDue").show(200)
                            $("#InvoiceOverDue").attr("necessary", "")
                            if (isNullOrEmpty(InvoiceOverDue)) {
                                err.push("發票已逾申報期，請輸入發票逾期說明欄位，並傳送至單位最高主管簽核與確認。");
                            }
                            else {
                                Global.popDetailInfo.InvoiceOverDue = InvoiceOverDue
                                $("#InvoiceOverDue").val(Global.popDetailInfo.InvoiceOverDue)
                            }
                        }
                    }
                }

                alertopen(err);
            }
            else {
                fun_AddErrMesg($("#EstimateVoucherDate"), "ErrEstimateVoucherDate", "不合法的日期格式")
            }
        }
    }

    //專案類別更改動作
    function pop_ProjectCategoryChange(val) {
        $("#Project").empty();
        $("#Project").attr("selectedIndex", 0)

        $("#Project").selectpicker('setStyle', 'input-disable', 'add');
        $("#Project").prop('disabled', true);

        $("#ProjectItem").empty();
        $("#ProjectItem").attr("selectedIndex", 0)
        $("#ProjectItem").selectpicker('setStyle', 'input-disable', 'add');
        $("#ProjectItem").prop('disabled', true);

        if (!isNullOrEmpty(val)) {
            $("#Project").attr("necessary", "")
            $("#ProjectItem").attr("necessary", "")

            $.ajax({
                url: ajaxUrl_GetProject,
                dataType: 'json',
                type: 'POST',
                async: false,
                data: { ProjectCategoryCode: val },
                success: function (data) {
                    $.each(data, function (key, value) {
                        $("#Project").append($("<option></option>").attr("value", key).text(value))
                    });

                    $("#Project").selectpicker('setStyle', 'input-disable', 'remove');
                    $("#Project").prop('disabled', false);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("獲取專案清單失敗");
                    return false
                }
            });
        }
        else {
            $("#Project").removeAttr("necessary")
            $("#ProjectItem").removeAttr("necessary")
            $("#Project").nextAll("[Errmsg=Y]").remove();
            $("#ProjectItem").nextAll("[Errmsg=Y]").remove();
        }

        $("#Project").selectpicker('refresh')
        $("#ProjectItem").selectpicker('refresh')
    }

    //專案更改動作
    function pop_ProjectChange(val) {
        $("#ProjectItem").empty();
        $("#ProjectItem").attr("selectedIndex", 0)
        $("#ProjectItem").selectpicker('setStyle', 'input-disable', 'add');
        $("#ProjectItem").prop('disabled', true);

        if (!isNullOrEmpty(val)) {
            $("#ProjectItem").attr("necessary", "")

            $.ajax({
                url: ajaxUrl_GetProjectItem,
                dataType: 'json',
                type: 'POST',
                async: false,
                data: { projectID: val },
                success: function (data) {
                    $.each(data, function (key, value) {
                        $("#ProjectItem").append($("<option></option>").attr("value", key).text(value))
                    });

                    $("#ProjectItem").selectpicker('setStyle', 'input-disable', 'remove');
                    $("#ProjectItem").prop('disabled', false);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("獲取專案項目清單失敗");
                    return false
                }
            });
        }
        else {
            $("#ProjectItem").removeAttr("necessary")
            $("#ProjectItem").nextAll("[Errmsg=Y]").remove();
        }

        $("#ProjectItem").selectpicker('refresh')
    }

    //新增分攤明細
    function pop_AddAmortizationDetail(AmortizationDetail, index) {
        let pop = $("#popDetail")

        let tbody = $("#tab_copyInvoiceDetail").find("tbody").eq(0).clone()

        $(tbody).find('.selectpicker').data('selectpicker', null);
        $(tbody).find('.bootstrap-select').find("button:first").remove();
        $(tbody).find(".selectpicker").selectpicker("render")

        $.each(Object.keys(AmortizationDetail), function (i, o) {
            let target = $(tbody).find("[name=" + o + "]")
            if (target.length > 0) {
                switch ($(target)[0].tagName) {
                    case "SELECT":
                    case "TEXTAREA":
                        $(target).eq(0).val(AmortizationDetail[o])
                        break;
                    case "INPUT":
                        $(target).eq(0).val(AmortizationDetail[o])
                        break;
                    default:
                        $(target).eq(0).text(AmortizationDetail[o])
                        break;
                }
            }
        })

        if (!isNullOrEmpty(AmortizationDetail.AccountingItem)) {
            $(tbody).find("#AmortizationDetailAccountingItemDisable").text(AmortizationDetail.AccountingItem + "-" + AmortizationDetail.AccountingItemName)
        }
        if (!isNullOrEmpty(AmortizationDetail.ProductDetail)) {
            $(tbody).find("#AmortizationDetailProductDetailDisable").text(AmortizationDetail.ProductDetail + "-" + AmortizationDetail.ProductDetailName)
        }

        $(tbody).find("[arrowicon]").on("click", function () {
            fun_CloumnControl(this)
        })
        $(tbody).find("input,select").on("change", function (e) {
            ControltoModel(Global.popDetailInfo, e.target)
            popDetailControlAction(Global.popDetailInfo, e)
        })
        $(tbody).find("[amount]").each(function (i, o) {
            $(this).val(fun_accountingformatNumberdelzero($(this).val()))
            $(this).text(fun_accountingformatNumberdelzero($(this).text()))
        })
        $(tbody).find("[alt=removesubInvoiceInfo]").on("click", function () {
            if (confirm("是否確認刪除該筆資料")) {
                Global.popDetailInfo.AmortizationDetailList[index].IsDelete = true
                tbody = $(this).closest("tbody");
                tbody.remove()
            }
        })
        $(tbody).find("[alt=OriginalAmortizationAmount]").on("focus", function () {
            fun_onfocusAction(this);
        })
        $(tbody).find("[alt=OriginalAmortizationAmount]").on("blur", function () {
            $(this).val(fun_accountingformatNumberdelzero($(this).val()))
            /*if (fun_onblurAction(this)) {
                OriginalAmortizationAmount = accounting.unformat($(this).val());
                $(this).closest("tbody").find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(accounting.toFixed(OriginalAmortizationAmount * Global.EEAModel.Rate)))
            }*/
        })
        $(tbody).find("select").on("change", function () {
            $(this).nextAll("[Errmsg=Y]").remove();
        })
        if (Global.isCardEmp) {
            $(tbody).find("#ExpenseAttribute").prop("disabled", false).selectpicker('setStyle', 'input-disable', 'remove');
            $(tbody).find("#ExpenseAttribute").attr("necessary", "")
        }
        else {
            $(tbody).find("#ExpenseAttribute").prop("disabled", true).selectpicker('setStyle', 'input-disable', 'add');
            $(tbody).find("#ExpenseAttribute").removeAttr("necessary")
        }
        $(tbody).find("select").selectpicker("refresh")

        //第一筆不能刪除
        if ($(pop).find("#tab_InvoiceDetail tbody").length > 0) {
            $(tbody).mouseenter(function () {
                $(this).find("[alt=removesubInvoiceInfo]").show();
            })
            $(tbody).mouseleave(function () {
                $(this).find("[alt=removesubInvoiceInfo]").hide();
            })
        }

        $(tbody).find("[name]").each(function (i, o) {
            $(o).attr("name", "AmortizationDetailList[" + index + "]." + $(o).attr("name"))
        })
        $(tbody).find("[alt=index]").val(index)

        $(pop).find("#tab_InvoiceDetail").append(tbody)
    }

    //開窗請款明細試算
    function fun_popDetailAmountCalculate() {
        if (Global.popDetailInfo.AmortizationDetailList.length == 0) return false
        fun_AmountCalculate(Global.popDetailInfo)

        AmortizationDetailTable = $("#tab_InvoiceDetail tbody")
        $(AmortizationDetailTable).find("[alt=ErrAmount]").remove();
        $(AmortizationDetailTable).each(function (i, o) {
            let index = $(o).find("[alt=index]").val()
            $(o).find("[alt=OriginalAmortizationAmount]").val(fun_accountingformatNumberdelzero(Global.popDetailInfo.AmortizationDetailList[index].OriginalAmortizationAmount))
            $(o).find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(Global.popDetailInfo.AmortizationDetailList[index].OriginalAmortizationTWDAmount))
        })
    }

    //請款明細分攤金額試算
    function fun_AmountCalculate(_Detail) {
        if (_Detail.AmortizationDetailList.length == 0) return false

        let AmountO = _Detail.OriginalAmount
        let AmountT = _Detail.TWDAmount
        if (isDeductible(_Detail)) {//可扣抵
            AmountO = _Detail.AcceptanceAmount
            AmountT = _Detail.TWDSaleAmount
        }

        let _AmountO = AmountO
        let _AmountT = AmountT

        if (_Detail.AmortizationDetailList.length == 1) {
            _Detail.AmortizationDetailList[0].OriginalAmortizationAmount = AmountO
            _Detail.AmortizationDetailList[0].OriginalAmortizationTWDAmount = AmountT
        }
        else {
            $.each(_Detail.AmortizationDetailList, function (i, o) {
                if (o.IsDelete) return true
                if (_AmountO)

                    if (o.OriginalAmortizationAmount > _AmountO) {
                        o.OriginalAmortizationAmount = _AmountO
                    }
                if (o.OriginalAmortizationTWDAmount > _AmountT) {
                    o.OriginalAmortizationTWDAmount = _AmountT
                }

                _AmountO = parseFloat(accounting.toFixed(_AmountO - o.OriginalAmortizationAmount, _Detail.CurrencyPrecise))
                _AmountT -= o.OriginalAmortizationTWDAmount
            })

            let sumAmount = ($.map(_Detail.AmortizationDetailList, function (o) {
                if (!o.IsDelete) {
                    return { OriginalAmortizationAmount: o.OriginalAmortizationAmount, OriginalAmortizationTWDAmount: o.OriginalAmortizationTWDAmount }
                }
            })).reduce(function (a, b) {
                return {
                    OriginalAmortizationAmount: parseFloat(accounting.toFixed(a.OriginalAmortizationAmount + b.OriginalAmortizationAmount, Global.EEAModel.CurrencyPrecise)),
                    OriginalAmortizationTWDAmount: a.OriginalAmortizationTWDAmount + b.OriginalAmortizationTWDAmount,
                }
            }
                , { OriginalAmortizationAmount: 0, OriginalAmortizationTWDAmount: 0 })

            if (sumAmount.OriginalAmortizationAmount != AmountO || sumAmount.OriginalAmortizationTWDAmount != AmountT) {
                for (i = _Detail.AmortizationDetailList.length - 1; i >= 0; i--) {
                    if (_Detail.AmortizationDetailList[i].IsDelete) { continue }
                    else {
                        _Detail.AmortizationDetailList[i].OriginalAmortizationAmount = parseFloat(accounting.toFixed(_Detail.AmortizationDetailList[i].OriginalAmortizationAmount + AmountO - sumAmount.OriginalAmortizationAmount, Global.EEAModel.CurrencyPrecise))
                        _Detail.AmortizationDetailList[i].OriginalAmortizationTWDAmount += (AmountT - sumAmount.OriginalAmortizationTWDAmount)

                        break;
                    }
                }
            }
        }

        AmortizationDetailTable = $("#tab_InvoiceDetail tbody")
        $(AmortizationDetailTable).find("[alt=ErrAmount]").remove();
        $(AmortizationDetailTable).each(function (i, o) {
            let index = $(o).find("[alt=index]").val()
            $(o).find("[alt=OriginalAmortizationAmount]").val(fun_accountingformatNumberdelzero(Global.popDetailInfo.AmortizationDetailList[index].OriginalAmortizationAmount))
            $(o).find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(Global.popDetailInfo.AmortizationDetailList[index].OriginalAmortizationTWDAmount))
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
                //console.log(NumArray[i] + " * " + CheckArray[i] + " = " + tmp)
                if (tmp >= 10) {
                    sum += Math.floor(tmp / 10)
                    sum += (tmp % 10)
                }
                else {
                    sum += tmp
                }
            }
            //  console.log(sum)
            if (sum % 10 == 0 || (sum % 10 == 9 && NumArray[6] == 7)) rtn = true
            else rtn = false
        }

        return rtn;
    }

    //發票號碼驗證
    function CertificateNumCheck(CertificateNum) {
        // reg = /^([A-z]{2}[0-9]{8}|[A-z]{3}[0-9]{7})$/
        reg = /^[A-z]{2}[A-z0-9]{8}$/
        if (String(CertificateNum).search(reg) != 0) {
            return false;
        }
        else {
            return true;
        }
    }

    //檢核憑證號碼是否重複
    function CertificateNumUesd(CertificateNum) {
        let rtn

        $.ajax({
            url: ajaxUrl_GetCertificateNumUsed,
            dataType: 'json',
            type: 'POST',
            async: false,
            data: { certificateNum: CertificateNum, formId: Global.EEAModel.FormID },
            success: function (data) {
                switch (String(data).toLocaleLowerCase()) {
                    case "false":
                        rtn = false;
                        break;

                    default:
                        fun_AddErrMesg($("#CertificateNum"), "ErrCertificateNum", "發票號碼重覆，不得重覆請款")
                        rtn = true;
                        break;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alertopen("發票重覆判斷發生問題");
                rtn = true
            }
        })

        return rtn
    }

    //計算可扣抵否
    function isDeductible(DetailInfo) {
        //先判斷營業稅中的是否可扣抵
        //若未產生營業稅再判斷憑證開立對象與明細的費用性質及分攤明細

        let rtn = false

        let IsDeductionlist = $.map(Global.EEAModel.BusinessTaxList, function (o) {
            if (
                ((DetailInfo.CertificateNum == null) ? "" : DetailInfo.CertificateNum) == ((o.CertificateNum == null) ? "" : o.CertificateNum)
                               && ((DetailInfo.EstimateVoucherDate == null) ? "" : DetailInfo.EstimateVoucherDate) == ((o.CertificateDate == null) ? "" : o.CertificateDate)
                               && ((DetailInfo.TaxIdNum == null) ? "" : DetailInfo.TaxIdNum) == ((o.BusinessNum == null) ? "" : o.BusinessNum)
                    ) {
                return o.IsDeduction
            }
        })

        if (IsDeductionlist.length > 0) {
            rtn = (IsDeductionlist[0] == "Y")
        }
        else {
            if (Global.EEAModel.gvdeclaration == "403") {
                let ExpenseKindIsDeduction = []

                $.ajax({
                    url: ajaxUrl_GetExpenseStandard,
                    dataType: 'json',
                    type: 'POST',
                    async: false,
                    data: { MaxItemNo: DetailInfo.PaymentCategory, MidItemNo: DetailInfo.PaymentMidCategory },
                    success: function (data) {
                        ExpenseKindIsDeduction = $.map(data.Detail, function (o) {
                            if (o.ExpenseKind == DetailInfo.ExpenseAttribute) {
                                return o.IsDeduction
                            }
                        })
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log("讀取費用屬性發生問題");
                    }
                });

                if (ExpenseKindIsDeduction.length > 0 && ExpenseKindIsDeduction[0]) {
                    rtn = $.grep(DetailInfo.AmortizationDetailList, function (o) {
                        let Department = $.grep(Global.FiisData.CoaCompany, function (x) { return x.company == o.AccountBank })
                        if (Department.length > 0 && Department[0].gvdeclaration != "403") {
                            return o
                        }
                    }).length == 0
                }
            }
        }

        DetailInfo.IsDeduction = (rtn) ? "Y" : "N"

        return rtn
    }

    //明細驗證
    function popDetailVerify() {
        let rtn = true
        let targetList = [{
            view: $("#popDetail"),
            model: Global.popDetailInfo
        }]
        rtn = necessaryVerify(targetList)

        if (rtn) {
            if (Global.popDetailInfo.CertificateKind == "1") {
                if (!CertificateNumCheck(Global.popDetailInfo.CertificateNum)) {
                    rtn = false
                    //fun_AddErrMesg($("#CertificateNum"), "ErrCertificateNum", "發票號碼為2~3碼英文+數字(總長十碼，皆為半型)")
                    fun_AddErrMesg($("#CertificateNum"), "ErrCertificateNum", "發票號碼為2碼英文+8碼英數字(皆為半型)")
                }
                else {
                    if (CertificateNumUesd(Global.popDetailInfo.CertificateNum)) {
                        rtn = false
                    }
                }
            }
            if (!isNullOrEmpty(Global.popDetailInfo.TaxIdNum)) {
                if (!TaxIDCheck(Global.popDetailInfo.TaxIdNum)) {
                    rtn = false
                    fun_AddErrMesg($("#TaxIdNum"), "ErrTaxIdNum", "內容或格式錯誤，請輸入8碼半形數字")
                }
            }

            if (!isNullOrEmpty(Global.popDetailInfo.EstimateVoucherDate)) {
                let EstimateVoucherDate = new Date(Global.popDetailInfo.EstimateVoucherDate.trim())
                if (isNaN(EstimateVoucherDate.getDate())) {
                    fun_AddErrMesg($("#EstimateVoucherDate"), "ErrEstimateVoucherDate", "非法日期格式")
                    rtn = false
                }
                else {
                    if (EstimateVoucherDate.valueOf() > new Date().valueOf()) {
                        rtn = false
                        fun_AddErrMesg($("#EstimateVoucherDate"), "ErrEstimateVoucherDate", "憑證日期大於目前日期")
                    }
                }
            }

            let OriginalAmount = parseFloat(Global.popDetailInfo.OriginalAmount)
            let OriginalTax = parseFloat(Global.popDetailInfo.OriginalTax)
            if (Number(Global.popDetailInfo.OriginalAmount) > 0) {
                if (!isNaN(Global.popDetailInfo.OriginalTax)) {
                    if (Global.popDetailInfo.OriginalAmount >= Global.popDetailInfo.OriginalTax) {
                        let TotalOriginalAmortizationAmount = $.map(Global.popDetailInfo.AmortizationDetailList, function (o) {
                            if (!o.IsDelete) {
                                return o.OriginalAmortizationAmount
                            }
                        }).reduce(function (a, b) {
                            return parseFloat(accounting.toFixed(a + b, Global.EEAModel.CurrencyPrecise))
                        }, 0)
                        let TotalOriginalAmortizationTWDAmount = $.map(Global.popDetailInfo.AmortizationDetailList, function (o) {
                            if (!o.IsDelete) {
                                return o.OriginalAmortizationTWDAmount
                            }
                        }).reduce(function (a, b) {
                            return a + b
                        }, 0)

                        if (isDeductible(Global.popDetailInfo)) {
                            if (TotalOriginalAmortizationAmount != Global.popDetailInfo.AcceptanceAmount || TotalOriginalAmortizationTWDAmount != Global.popDetailInfo.TWDSaleAmount) {
                                // alert("分攤明細金額加總不正確")
                                //差額計入末項
                                let lastAmortizationDetail = $($.grep(Global.popDetailInfo.AmortizationDetailList, function (o) {
                                    return !o.IsDelete
                                })).last()[0]
                                lastAmortizationDetail.OriginalAmortizationAmount += parseFloat(accounting.toFixed(Global.popDetailInfo.AcceptanceAmount - TotalOriginalAmortizationAmount, Global.EEAModel.CurrencyPrecise))
                                lastAmortizationDetail.OriginalAmortizationTWDAmount += (Global.popDetailInfo.TWDSaleAmount - TotalOriginalAmortizationTWDAmount)

                                $("#tab_InvoiceDetail").find("tbody").last().find("[alt=OriginalAmortizationAmount]").val(fun_accountingformatNumberdelzero(lastAmortizationDetail.OriginalAmortizationAmount))
                                $("#tab_InvoiceDetail").find("tbody").last().find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(lastAmortizationDetail.OriginalAmortizationTWDAmount))

                                if (lastAmortizationDetail.OriginalAmortizationAmount <= 0 || lastAmortizationDetail.OriginalAmortizationTWDAmount <= 0) {
                                    rtn = false
                                    fun_AddErrMesg($("#tab_InvoiceDetail").find("tbody").last().find("[alt=OriginalAmortizationAmount]"), "Err_OriginalAmortizationAmount", "末項金額調整後小於等於0")
                                }
                            }
                        }
                        else {
                            if (TotalOriginalAmortizationAmount != Global.popDetailInfo.OriginalAmount || TotalOriginalAmortizationTWDAmount != Global.popDetailInfo.TWDAmount) {
                                // alert("分攤明細金額加總不正確")
                                //差額計入末項
                                let lastAmortizationDetail = $($.grep(Global.popDetailInfo.AmortizationDetailList, function (o) {
                                    return !o.IsDelete
                                })).last()[0]
                                lastAmortizationDetail.OriginalAmortizationAmount += parseFloat(accounting.toFixed(Global.popDetailInfo.OriginalAmount - TotalOriginalAmortizationAmount, Global.EEAModel.CurrencyPrecise))
                                lastAmortizationDetail.OriginalAmortizationTWDAmount += (Global.popDetailInfo.TWDAmount - TotalOriginalAmortizationTWDAmount)

                                $("#tab_InvoiceDetail").find("tbody").last().find("[alt=OriginalAmortizationAmount]").val(fun_accountingformatNumberdelzero(lastAmortizationDetail.OriginalAmortizationAmount))
                                $("#tab_InvoiceDetail").find("tbody").last().find("[alt=OriginalAmortizationTWDAmount]").text(fun_accountingformatNumberdelzero(lastAmortizationDetail.OriginalAmortizationTWDAmount))

                                if (lastAmortizationDetail.OriginalAmortizationAmount <= 0 || lastAmortizationDetail.OriginalAmortizationTWDAmount <= 0) {
                                    rtn = false
                                    fun_AddErrMesg($("#tab_InvoiceDetail").find("tbody").last().find("[alt=OriginalAmortizationAmount]"), "Err_OriginalAmortizationAmount", "末項金額調整後小於等於0")
                                }
                            }
                        }
                    }
                    else {
                        rtn = false
                        fun_AddErrMesg($("#OriginalTax"), "ErrOriginalTax", "稅額(原幣)不得大於金額(原幣)")
                    }
                }
                else {
                    rtn = false
                    fun_AddErrMesg($("#OriginalTax"), "ErrOriginalTax", "請輸入正確金額")
                }
            }
            else {
                rtn = false
                fun_AddErrMesg($("#OriginalAmount"), "ErrOriginalAmount", "請輸入正確金額")
            }
        }
        else {
            alertopen("明細檢核有誤")
        }
        return rtn
    }
}

//請款明細帶回主頁面
function tab_InvoiceInput(DetaiInfo) {
    if (DetaiInfo != null) {
        //表單資料帶回主頁面
        {
            $("#tab_Invoice tbody[alt=no-data]").hide();
            let InvoiceObj = null
            if (!DetaiInfo.edit) {
                InvoiceObj = $("#tab_copyInvoice tbody").clone();
                $("#tab_Invoice").append(InvoiceObj)
                $(InvoiceObj).find("td").eq(0).text(funAddheadZero(3, $("#tab_Invoice tbody").not("[alt=no-data]").length))

                $(InvoiceObj).mouseenter(function () {
                    $(this).find("[alt=removeInvoice]").show();
                })
                $(InvoiceObj).mouseleave(function () {
                    $(this).find("[alt=removeInvoice]").hide();
                })
            }
            else {
                InvoiceObj = $("#tab_Invoice tbody[edit]").eq(0)
            }

            $(InvoiceObj).find("[alt=popInvoiceInfo]").off("click")
            $(InvoiceObj).find("[alt=popInvoiceInfo]").on("click", function () {
                $(Global.EEAModel.EEADetail).each(function (i, o) {
                    o.edit = false;
                })

                $("#tab_Invoice tbody[edit]").removeAttr("edit")

                $(this).closest("tbody").attr("edit", "");
                DetaiInfo.edit = true
                popDetailLoading(DetaiInfo)
            })
            $(InvoiceObj).find("[alt=removeInvoice]").off("click")
            $(InvoiceObj).find("[alt=removeInvoice]").on("click", function () {
                if (confirm("是否確認刪除該筆資料")) {
                    $(this).closest("tbody").remove()
                    DetaiInfo.IsDelete = true

                    if ($("#tab_Invoice tbody").not("[alt=no-data]").length == 0) {
                        $("#tab_Invoice tbody[alt=no-data]").show()
                    }
                    else {
                        fun_resetCellIndex($("#tab_Invoice"), "Index", 3)
                    }
                    Global.EEAModel.CertificateAmount = parseFloat(accounting.toFixed(Global.EEAModel.CertificateAmount - DetaiInfo.OriginalAmount, Global.EEAModel.CurrencyPrecise))
                    Global.EEAModel.OriginalAmount = parseFloat(accounting.toFixed(Global.EEAModel.OriginalAmount - DetaiInfo.OriginalTax, Global.EEAModel.CurrencyPrecise))
                    Global.EEAModel.TWDAmount -= DetaiInfo.TWDAmount
                    Global.EEAModel.TWDPayAmount -= DetaiInfo.TWDTaxAmount
                    Global.EEAModel.PaymentAmount = Global.EEAModel.TWDAmount
                    MasterAmountControlChange()
                }
            })

            if (InvoiceObj != null) {
                $(InvoiceObj).find("[name=LineNum]").val(DetaiInfo.LineNum)
                $(InvoiceObj).find("td").eq(1).text(DetaiInfo.TaxIdNum)
                $(InvoiceObj).find("td").eq(2).text(DetaiInfo.VendorName)
                $(InvoiceObj).find("td").eq(3).text(DetaiInfo.CertificateNum)
                $(InvoiceObj).find("td").eq(4).text(DetaiInfo.PaymentCategoryName)
                $(InvoiceObj).find("td").eq(5).text(fun_accountingformatNumberdelzero(DetaiInfo.OriginalAmount))
                $(InvoiceObj).find("td").eq(6).text(DetaiInfo.ExpenseDesc)
            }
            $(InvoiceObj).find("td").each(function (i, o) {
                if ($(o).text() == "null") { $(o).text("") }
            })
        }
        //表單資料帶回主頁面
    }
}

//新增營業稅資料
function putBusinessTaxInformation(BusinessTaxInfo) {
    let BusinessTaxTable = $("#BusinessTaxTable")
    $(BusinessTaxTable).find("tbody[alt=no-data]").hide()

    let BusinessTaxtmp = $("#BusinessBodyCopy tbody").eq(0).clone()

    $.each(BusinessTaxInfo, function (key, value) {
        if (value == null) return true

        $.each($(BusinessTaxtmp).find("[name=" + key + "]"), function (i, o) {
            if ($(o)[0].hasAttribute("amount")) {
                value = fun_accountingformatNumberdelzero(value)
            }
            /*  if ($(o)[0].hasAttribute("date")) {
                  let _Date = new Date(parseInt(value.replace("/Date(", "").replace(")/", "")))
                  value = _Date.toISOString().substring(0, 10)
              }*/

            switch ($(o)[0].tagName) {
                case "SELECT":
                    $(o).selectpicker("val", value)
                    break;
                case "INPUT":
                    $(o).val(value)
                    break;
                default:
                    $(o).text(value)
                    break;
            }
        })
    })

    $(BusinessTaxtmp).find('.selectpicker').data('selectpicker', null);
    $(BusinessTaxtmp).find('.bootstrap-select').find("button:first").remove();
    $(BusinessTaxtmp).find(".selectpicker").selectpicker("render")
    $(BusinessTaxtmp).find("input[Amount]").on("focus", function () {
        fun_onfocusAction(this)
    })
    $(BusinessTaxtmp).find("input[Amount]").on("blur", function () {
        // fun_onblurAction(this)
        $(this).val(fun_accountingformatNumberdelzero($(this).val()))
    })

    if (!Global.isCreditCardOffice) {
        $(BusinessTaxtmp).find("select[name=TaxCategory]").prop("disabled", true).selectpicker('setStyle', 'input-disable', 'add').removeAttr("necessary")
    }

    $(BusinessTaxtmp).find("input,select,textarea").on("change", function (e) {
        $(this).nextAll("[Errmsg=Y]").remove();
        ControltoModel(BusinessTaxInfo, e.target)
        businessTaxControlAction(BusinessTaxInfo, e)
    })

    $(BusinessTaxTable).append(BusinessTaxtmp)
}

//更動主畫面金額欄位數字
function MasterAmountControlChange() {
    $("#MainInformationBlock").find("[name=CertificateAmount]").text(fun_accountingformatNumberdelzero(Global.EEAModel.CertificateAmount))
    $("#MainInformationBlock").find("[name=OriginalAmount]").text(fun_accountingformatNumberdelzero(Global.EEAModel.OriginalAmount))
    $("#MainInformationBlock").find("[name=TWDAmount]").text(fun_accountingformatNumberdelzero(Global.EEAModel.TWDAmount))
    $("#MainInformationBlock").find("[name=TWDPayAmount]").text(fun_accountingformatNumberdelzero(Global.EEAModel.TWDPayAmount))
    $("#PayInfo").find("[name=PaymentAmount]").text(fun_accountingformatNumberdelzero(Global.EEAModel.PaymentAmount))
}

//欄位檢核
function necessaryVerify(targetList) {
    let rtn = true
    let reg = /\[[0-9]{1,}\]/
    let val = null;
    $.each(targetList, function (i, target) {
        $(target.view).find("[errmsg]").remove()

        $(target.view).find("[necessary]").each(function () {
            let nodeList = $(this).attr("name").split(".")
            let endNode = target.model;

            for (i = 0; i < nodeList.length ; i++) {
                if (reg.test(nodeList[i])) {
                    //陣列
                    ArrayNode = nodeList[i].substr(0, nodeList[i].indexOf("["))
                    len = nodeList[i].substr(nodeList[i].indexOf("[") + 1, nodeList[i].indexOf("]") - nodeList[i].indexOf("[") - 1)
                    if (endNode[ArrayNode][len] === undefined) {
                        break;
                    }

                    if (i == nodeList.length - 1) {
                        val = endNode[ArrayNode][len]
                    }
                    else {
                        endNode = endNode[ArrayNode][len]
                    }
                }
                else {
                    if (endNode[nodeList[i]] === undefined) {
                        // break;
                        val = null
                    }

                    if (i == nodeList.length - 1) {
                        val = endNode[nodeList[i]]
                    }
                    else {
                        endNode = endNode[nodeList[i]]
                    }
                }
            }

            if (val == null || val.length == 0) {
                // if (isNullOrEmpty(val)) {  *0會判斷成 true
                fun_AddErrMesg($(this), "Err" + $(this).attr("id"), "此為必填欄位")
                rtn = false;

                //若為折行顯示則展開
                if ($(this).closest("tr").is(":hidden")) {
                    $(this).closest("tbody").find("tr").show()
                }
            }
            else {
                if ($(this).is("[amount]")) {
                    if (!fun_onblurAction($(this))) {
                        rtn = false

                        //若為折行顯示則展開
                        if ($(this).closest("tr").is(":hidden")) {
                            $(this).closest("tbody").find("tr").show()
                        }
                    }
                }
            }
        })
    })
    return rtn
}

//關卡卡控
function stageControl(key, step) {
    //起單人關卡卡控
    function flowPart1Control() {
        Global.EEAModel.ApplicantEmpNum = $("#ApplicantEmpNum").val()
        Global.EEAModel.ApplicantName = $("#ApplicantName").val()
        Global.EEAModel.ApplicantDepId = $("#ApplicantDepId").val()
        Global.EEAModel.ApplicantDepName = $("#ApplicantDepName").val()

        $("#AmortizationDetailAccountingItemDisable span").text("請選擇請款類別")
        $("#AmortizationDetailAccountingItem").hide()
        $(".EmergencyLabel").hide();
        fun_ControlDisable($("#datetimepicker_ExceptedPaymentDate"), "")

        //清空營業稅資料
        $.each(Global.EEAModel.BusinessTaxList, function (i, o) {
            Global.EEAModel.BusinessTaxList[i].IsDelete = true
        })
    }
    //會計經辦關卡卡控
    function flowPart2Control() {
        $("#VendorOpen").hide();
        $("#PayAlone").prop("disabled", true).addClass("input-disable")
        fun_ControlDisable($("#ExpenseKind"), $("#ExpenseKind").find("option:selected").text())
        fun_ControlDisable($("#HeaderDesc"), Global.EEAModel.HeaderDesc)
        if (Global.EEAModel.ExpenseDesc != null) {
            fun_ControlDisable($("#ExpenseDesc"), Global.EEAModel.ExpenseDesc.replace("\n", "<br>"))
        }
        else {
            fun_ControlDisable($("#ExpenseDesc"), "")
        }

        fun_ControlDisable($("#Currency"), $("#Currency").find("option:selected").text())
        fun_ControlDisable($("#Rate"), Global.EEAModel.Rate)
        fun_ControlDisable($("#VoucherBeau"), $("#VoucherBeau").find("option:selected").text())
        $("[name=Certificate]").prop("disabled", true).addClass("input-disable")
        $("#AccountOpen").hide();
        fun_ControlDisable($("#PaymentInfo_PayReMark"), (isNullOrEmpty(Global.EEAModel.PaymentInfo.PayReMark)) ? "" : Global.EEAModel.PaymentInfo.PayReMark)
        fun_ControlDisable($("#BargainingCode"), (isNullOrEmpty(Global.EEAModel.BargainingCode)) ? "" : Global.EEAModel.BargainingCode)
        fun_ControlDisable($("#ExportApplyAttribute"), (isNullOrEmpty(Global.EEAModel.ExportApplyAttributeName)) ? "" : Global.EEAModel.ExportApplyAttributeName)
        $("#Btn_CreatDetail").hide();
        fun_ControlDisable($("#datetimepicker_ExpectedDate"), Global.EEAModel.ExpectedDateToString)
        $("#MainInformationBlock,#PayInfo").find(".required-icon").remove()
        $("#tab_Invoice").find("div[alt=removeInvoice]").remove()

        $.each(Global.EEAModel.EEADetail, function (i, o) {
            if (o.VoucherMemo === null) {
                o.VoucherMemo = Global.EEAModel.HeaderDesc
            }
        })

        if (Global.EEAModel.gvdeclaration == "403") {
            $("#BusinessTaxTableResult").show()
            if (Global.EEAModel.BusinessTaxList.length == 0) {
                //自動生成營業稅資訊
                $.each(Global.EEAModel.EEADetail, function (i, DetailInfo) {
                    let hasTax = false
                    $.each(Global.EEAModel.BusinessTaxList, function (i, o) {
                        if (!o.IsDelete
                              && ((o.CertificateNum == null) ? "" : o.CertificateNum) == ((DetailInfo.CertificateNum == null) ? "" : DetailInfo.CertificateNum)
                              && ((o.CertificateDate == null) ? "" : o.CertificateDate) == ((DetailInfo.strEstimateVoucherDate == null) ? "" : DetailInfo.strEstimateVoucherDate)
                              && ((o.BusinessNum == null) ? "" : o.BusinessNum) == ((DetailInfo.TaxIdNum == null) ? "" : DetailInfo.TaxIdNum)
                              ) {
                            o.Taxable += DetailInfo.TWDSaleAmount;
                            o.TaxAmount += DetailInfo.TWDTaxAmount;
                            o.CertificateAmount += DetailInfo.TWDAmount;
                            if (DetailInfo.IsDeduction == "N") {
                                o.IsDeduction = "N"
                            }

                            hasTax = true
                            return false
                        }
                    })

                    if (!hasTax) {
                        let Newtax = getBusinessTaxModel();
                        Newtax.CertificateNum = DetailInfo.CertificateNum
                        Newtax.CertificateDate = (isNullOrEmpty(DetailInfo.strEstimateVoucherDate)) ? null : DetailInfo.strEstimateVoucherDate
                        Newtax.BusinessNum = DetailInfo.TaxIdNum
                        Newtax.Taxable = DetailInfo.TWDSaleAmount;
                        Newtax.TaxAmount = DetailInfo.TWDTaxAmount;
                        Newtax.FormatKind = 21;
                        Newtax.CertificateAmount = DetailInfo.TWDAmount;
                        Newtax.IsDeduction = (isDeductible(DetailInfo)) ? "Y" : "N"
                        Global.EEAModel.BusinessTaxList.push(Newtax)
                    }
                })

                $.each(Global.EEAModel.BusinessTaxList, function (i, o) {
                    putBusinessTaxInformation(o)
                })
            }
        }

        Global.flowPart = 2
    }

    if (key == 'EEA_P1_01' || key == 'EEA_P1_Credit') {
        switch (step) {
            case "1":
                flowPart1Control()
                break;

            case "5":
                flowPart2Control()
                break;
        }
    }
    else {
        switch (step) {
            case "1":
                flowPart1Control()
                break;

            case "3":
                flowPart2Control()
                break;
        }
    }
}

//公用副程式
{
    //控件不可編輯
    function fun_ControlDisable(target, _context) {
        ///<summary>控件不可編輯</summary>
        ///<param name="_context">取代的顯示文字</param>

        parentObj = $(target).parent()
        intable = ($(target).parents("table").length > 0);
        // context = (_context == null) ? "" : _context
        $(target).removeAttr("necessary")

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

        $(parentObj).find("div[ControlDisable]").remove()

        if (_context != null) {
            if (intable) {
                $(parentObj).append("<div ControlDisable >" + _context + "</div>")
            }
            else {
                $(parentObj).append("<div class=\"disable-text\" ControlDisable >" + _context + "</div>")
            }
        }
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

    //日期格式轉中文 yyyy-MM-dd
    function fun_DataToString(value) {
        strDate = ""

        /*if (value) {
            DateObj = new Date(value)
            if (!isNaN(DateObj.getDate())) {
                strDate = DateObj.getFullYear() + "-" + funAddheadZero(2, (DateObj.getMonth() + 1)) + "-" + funAddheadZero(2, DateObj.getDate())
            }
        }*/

        if (value) {
            DateObj = new Date(parseInt(value.replace("/Date(", "").replace(")/", "")))
            if (!isNaN(DateObj.getDate())) {
                strDate = new Date(DateObj.setHours(DateObj.getHours() + 8)).toISOString().substring(0, 10)//+8小時轉臺灣時間
            }
        }

        return strDate
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
        //Accuracy = $(target).attr("Accuracy")
        Accuracy = Global.EEAModel.CurrencyPrecise
        MaxValue = $(target).attr("MaxValue")
        Amount = accounting.unformat($(target).val())
        if (isNaN(Accuracy)) {
            Accuracy = 0;
        }
        if (isNaN(MaxValue)) {
            MaxValue = -1;
        }

        if (Amount == 0 && !$(target).is("[zero]")) {
            fun_AddErrMesg(target, "ErrAmount", "請輸入大於0的數字")
            return false;
        }

        if (regNum(Amount, (Accuracy >= 0))) {
            if (String(Amount).indexOf(".") > 0) {
                if ((String(Amount).length - (String(Amount).indexOf(".") + 1)) > Accuracy) {
                    fun_AddErrMesg(target, "ErrAmount", "小數點長度錯誤，最多" + Accuracy + "碼")

                    return false;
                }
            }

            if (MaxValue > 0 && Amount > MaxValue) {
                fun_AddErrMesg(target, "ErrAmount", "數字不可大於 " + MaxValue)
                return false;
            }

            //資料庫只開8碼
            /*if (Amount > 10000000) {
                fun_AddErrMesg(target, "ErrAmount", "超出數字上限")
                return false;
            }*/

            $(target).val(fun_accountingformatNumberdelzero(Amount))
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
            $(this).toggle(200);
        })

        $(target).find("div").toggleClass("glyphicon-chevron-down")
        $(target).find("div").toggleClass("glyphicon-chevron-up")
    }
}