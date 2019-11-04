var JsonData = getModel()
var PriceStandardList;
var th_PriceStandard;
var th_ProjectCategory;
var DocumentReady = $.Deferred();
var stage = "C"
var QuoteList = [];
var _ClickSend = false
var JsonDataAsync = $.Deferred()

function ExportReport() {
    window.location.href = "/PR/Report/" + $("#DocNum").text()
}

//權限判斷
function fun_stage() {
    P_CustomFlowKey = $('#P_CustomFlowKey').val();
    P_CurrentStep = $("#P_CurrentStep").val();

    if (
        (P_CustomFlowKey == "PR_P1_001" && P_CurrentStep == "1")
        || (P_CustomFlowKey == "PR_P1_002" && P_CurrentStep == "1")
         || (P_CustomFlowKey == "PR_P1_003" && P_CurrentStep == "1")
         || (P_CustomFlowKey == "PR_P1_004" && P_CurrentStep == "1")
        ) {
        return "C"
    }

    if (
        (P_CustomFlowKey == "PR_P1_001" && P_CurrentStep == "2")
        || (P_CustomFlowKey == "PR_P1_002" && P_CurrentStep == "2")
        || (P_CustomFlowKey == "PR_P1_002" && P_CurrentStep == "4")
        || (P_CustomFlowKey == "PR_P1_002" && P_CurrentStep == "5")
         || (P_CustomFlowKey == "PR_P1_003" && P_CurrentStep == "2")
        || (P_CustomFlowKey == "PR_P1_003" && P_CurrentStep == "4")
        || (P_CustomFlowKey == "PR_P1_003" && P_CurrentStep == "5")
         || (P_CustomFlowKey == "PR_P1_004" && P_CurrentStep == "2")
         || (P_CustomFlowKey == "PR_P1_004" && P_CurrentStep == "4")
        || (P_CustomFlowKey == "PR_P1_004" && P_CurrentStep == "5")
         || (P_CustomFlowKey == "PR_P1_004" && P_CurrentStep == "7")
        || (P_CustomFlowKey == "PR_P1_004" && P_CurrentStep == "8")
        ) {
        return "M"
    }

    if (
        (P_CustomFlowKey == "PR_P2_001" && P_CurrentStep == "1")
        || (P_CustomFlowKey == "PR_P2_002" && P_CurrentStep == "1")
        || (P_CustomFlowKey == "PR_P2_003" && P_CurrentStep == "1")
        || (P_CustomFlowKey == "PR_P2_004" && P_CurrentStep == "1")
        || (P_CustomFlowKey == "PR_P2_005" && P_CurrentStep == "1")
        || (P_CustomFlowKey == "PR_P2_006" && P_CurrentStep == "1")
        || (P_CustomFlowKey == "PR_P2_007" && P_CurrentStep == "1")
        ) {
        return "B"
    }
}

//關卡流程判斷
function fun_CustomFlowKey() {
    P_CustomFlowKey = $('#P_CustomFlowKey').val();
    P_CurrentStep = $("#P_CurrentStep").val();

    YN = true//是否為總行人員
    YN_0532 = false//是否為資訊處人員

    $(_unitData).each(function (index, obj) {
        if (obj.unit_level == 6) YN = false //6 為非總行人員
        if (obj.unit_level == 4 && obj.unit_id == "0532") YN_0532 = true
    })

    if (P_CurrentStep == "1") {
        switch (stage) {
            case "C"://起單階段
                let IsInformationProducts = JsonData.IsInformationProducts;

                //資訊處只簽一遍，簽過就當非資訊產品處理
                if (JsonData.isSigntoInformation == 1) {
                    IsInformationProducts = 0;
                }

                //申請人為資訊處人員不必加會資訊處、資訊處簽核過後不用在簽資訊處 *資訊處為總行人員

                if ((IsInformationProducts == 0 || (IsInformationProducts == 1 && YN_0532)) && YN) {
                    $("#P_CustomFlowKey").val("PR_P1_001")
                    updateCustomFlowKey("PR_P1_001");
                    _stageInfo.CustomFlowKey = "PR_P1_001";
                    return false;
                }

                if ((IsInformationProducts == 1 && !YN_0532) && YN) {
                    $("#P_CustomFlowKey").val("PR_P1_002")
                    updateCustomFlowKey("PR_P1_002");
                    _stageInfo.CustomFlowKey = "PR_P1_002";
                    return false;
                }
                if (IsInformationProducts == 0 && !YN) {
                    $("#P_CustomFlowKey").val("PR_P1_003")
                    updateCustomFlowKey("PR_P1_003");
                    _stageInfo.CustomFlowKey = "PR_P1_003";
                    return false;
                }
                if (IsInformationProducts == 1 && !YN) {
                    $("#P_CustomFlowKey").val("PR_P1_004")
                    updateCustomFlowKey("PR_P1_004");
                    _stageInfo.CustomFlowKey = "PR_P1_004";
                    return false;
                }

                break;

            case "B"://採購經辦階段

                if (JsonData.QuoteAmount > 0) {
                    switch (JsonData.PurchasePriceStardandId) {
                        case "11":
                            $("#P_CustomFlowKey").val("PR_P2_001")
                            updateCustomFlowKey("PR_P2_001");
                            _stageInfo.CustomFlowKey = "PR_P2_001";
                            break;
                        case "12":
                            $("#P_CustomFlowKey").val("PR_P2_002")
                            updateCustomFlowKey("PR_P2_002");
                            _stageInfo.CustomFlowKey = "PR_P2_002";
                            break;
                        case "13":
                            $("#P_CustomFlowKey").val("PR_P2_003")
                            updateCustomFlowKey("PR_P2_003");
                            _stageInfo.CustomFlowKey = "PR_P2_003";
                            break;
                        case "14":
                            $("#P_CustomFlowKey").val("PR_P2_004")
                            updateCustomFlowKey("PR_P2_004");
                            _stageInfo.CustomFlowKey = "PR_P2_004";
                            break;
                        case "15":
                            $("#P_CustomFlowKey").val("PR_P2_005")
                            updateCustomFlowKey("PR_P2_005");
                            _stageInfo.CustomFlowKey = "PR_P2_005";
                            break;
                        case "16":
                        case "21":
                        case "31":
                        case "41":
                            $("#P_CustomFlowKey").val("PR_P2_006")
                            updateCustomFlowKey("PR_P2_006");
                            _stageInfo.CustomFlowKey = "PR_P2_006";
                            break;
                        case "17":
                        case "18"://董事會屬於線外作業
                        case "22":
                        case "23"://董事會屬於線外作業
                        case "32":
                        case "33"://董事會屬於線外作業
                        case "42"://董事會屬於線外作業
                            $("#P_CustomFlowKey").val("PR_P2_007")
                            updateCustomFlowKey("PR_P2_007");
                            _stageInfo.CustomFlowKey = "PR_P2_007";
                            break;
                    }
                }

                break;
        }
    }
}

//下一關人員調整
function GetPageCustomizedList(stepSequence) {
    //改後端判斷
    /* obj = $(_unitData).map(function () {
         if (this.unit_level == 4) {
             return { unit_id: this.unit_id, unit_name: this.unit_name };
         }
     })

     console.log({ SignedID: obj[0].unit_id, SignedName: obj[0].unit_name })
     return { SignedID: [obj[0].unit_id + "-JA08000609"], SignedName: [obj[0].unit_name + "總務股長"] }*/
    P_CustomFlowKey = $('#P_CustomFlowKey').val();
    P_CurrentStep = $("#P_CurrentStep").val();

    rtn = GetFirstPurchaseEmpNum()
    if (rtn.rtn) {
        return { SignedID: [rtn.SignedID], SignedName: [rtn.SignedName] }
    }
    else {
        if (parseInt(RoleMemberCount) > 0) {
            return { SignedID: [SignedID], SignedName: [SignedName] }
        }
        else {
            alert("查無人員")
        }
    }
}

function OverrideOrgPickerSetting(step) {
    /// <summary>提供cbp-SendSetting.js針對「傳送其他主管同仁」按鈕做最後OrgPicker更改機會</summary>
    /// <param name="step" type="number">目前關卡數</param>
    //  第一關傳其他只能傳送採購經辦群組， 第二關傳其他只能傳送採購覆核群組:
    P_CustomFlowKey = $('#P_CustomFlowKey').val();
    if (P_CustomFlowKey.indexOf("PR_P1") > -1) {
        switch (step) {
            case 2:
            case 5:
            case 8:
                return {
                    allowRole: ["MGR"],//主管階
                    LowestUnitLevel: 6
                };
                break;
        }
    }

    if (P_CustomFlowKey.indexOf("PR_P2") > -1) {
        switch (step) {
            case 1:
                return {
                    allowRole: ["JA18000078"]//採購經辦
                };
                break;
            case 2:
                return {
                    allowRole: ["JA18000226"]//採購覆核
                };
                break;
        }
    }
}

//取得第一個明細的採購經辦
function GetFirstPurchaseEmpNum() {
    let SignedID = "";
    let SignedName = "";
    rtn = { rtn: false, SignedID: "", SignedName: "" }

    //第一階段最後一關需抓第一個明細的採購經辦當下一關關主
    if ((P_CustomFlowKey == "PR_P1_001" && P_CurrentStep == 2) ||
        (P_CustomFlowKey == "PR_P1_002" && P_CurrentStep == 5) ||
         (P_CustomFlowKey == "PR_P1_003" && P_CurrentStep == 5) ||
         (P_CustomFlowKey == "PR_P1_004" && P_CurrentStep == 8)) {
        $("#YCDetailTable tbody").not("[alt=deleted]").find("[name=PurchaseEmpNum]").each(function (i, o) {
            if (!isNullOrEmpty($(o).val())) {
                SignedID = $(o).val();
                SignedName = $(o).find("option:selected").text()

                return false
            }
        })

        if (isNullOrEmpty(SignedID)) {
            $("#PROneTimeDetailTable tbody").not("[alt=deleted]").find("[name=PurchaseEmpNum]").each(function (i, o) {
                if (!isNullOrEmpty($(o).val())) {
                    SignedID = $(o).val();
                    SignedName = $(o).find("option:selected").text()

                    return false
                }
            })
        }

        if ($('#sentdropbox').length > 0) {
            $('#sentdropbox').empty()
            $('#sentdropbox').append('<option value="' + SignedID + '" selected>' + SignedName + '(' + SignedID + ')</option>').selectpicker('refresh');
        }
        rtn.rtn = true

        rtn.SignedID = SignedID
        rtn.SignedName = SignedName
    }
    else {
        rtn.rtn = false;
    }

    return rtn
}

//暫存
function draft() {
    let draftAjax = $.Deferred()
    blockPageForJBPMSend()
    fun_JsonDataUpdate();

    return $.ajax({
        url: '/PR/Edit',
        dataType: 'json',
        type: 'POST',
        data: JsonData,
        //async: false,
        success: function (data, textStatus, jqXHR) {
            // window.location.href = '/PR/Edit/' + data;
            _formInfo.formGuid = data.FormGuid
            _formInfo.formNum = data.FormNum
            _formInfo.flag = data.Flag
            if (!data.Flag && data.Err != undefined) {
                let ErrorMessage = "";
                $.each(data.Err, function (i, Err) {
                    ErrorMessage += Err.ErrorMessage + "<br>"
                })

                $.unblockUI();
                $("#AlertMessage").html(ErrorMessage);
                window.location.href = "#modal-added-info-2"
                draftAjax.reject;
            }
            else {
                draftAjax.resolve();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            alert("暫存失敗 " + textStatus)
        }
    });

    return draftAjax.promise()
}

//驗證
function Verify() {
    $("[errmsg]").remove()

    let draftAjax = $.Deferred()

    setTimeout(function () {
        fun_JsonDataUpdate();

        let alertMsg = "";

        let rtn = true
        let isHaveQuote = true

        if (JsonData.HaveQuoteForm == 1 && $("#fileSection").find("tr.fileDetail").length == 0) {
            isHaveQuote = false;
            fun_AddErrMesg($("tbody.fileList").closest("table"), null, "請上傳報價單")
        }

        if (fun_basicVerify($("#InformationSection")) && isHaveQuote) {
            hasDetail = false
            yErrArray = [];//協議的錯誤
            pErrArray = [];//一次性的錯誤
            BpcNumList = [];//協議金額陣列
            if (JsonData.PurReqDetailList && JsonData.PurReqDetailList.length > 0) {
                $.each(JsonData.PurReqDetailList, function (index, obj) {
                    if (obj.IsDelete != "true") {
                        YCD = false
                        if (obj.YCDetailID && obj.YCDetailID != 0) {
                            YCD = true
                        }

                        hasDetail = true
                        if (!obj.PurReqDeliveryList || obj.PurReqDeliveryList.length == 0) {
                            if (YCD) {
                                yErrArray.push("協議採購項次 " + obj.Index + " 未輸入送貨單位明細")
                            }
                            else {
                                pErrArray.push("一次性採購項次 " + obj.Index + " 未輸入送貨單位明細")
                            }
                            return true
                        }
                        else {
                            rtn = fun_DeliveryVerify(obj.PurReqDeliveryList, (obj.UomCode == "AMT"))
                            obj.Quantity = rtn.Quantity;
                            if (!rtn.result) {
                                if (YCD) {
                                    yErrArray.push("協議採購項次 " + obj.Index + " " + rtn.ErrMsg)
                                }
                                else {
                                    pErrArray.push("一次性採購項次 " + obj.Index + " " + rtn.ErrMsg)
                                }
                            }
                            else {
                                if (YCD) {//檢核是否超過核發金額
                                    bpcObj = $.grep(BpcNumList, function (bobj) {
                                        return bobj.BpcNum == obj.BpcNum
                                    })
                                    if (bpcObj.length == 0) {
                                        tmp = { BpcNum: obj.BpcNum, QuoteAmount: (obj.QuoteAmount - obj.usedTwdQuoteAmount) }
                                        BpcNumList.push(tmp)
                                        bpcObj.push(tmp)
                                    }

                                    bpcObj[0].QuoteAmount -= (obj.UnitTwdPrice * obj.Quantity)
                                    if (bpcObj[0].QuoteAmount < 0) {
                                        yErrArray.push("協議採購項次 " + obj.Index + " 已超出剩餘可核發金額")
                                    }
                                }
                            }
                        }
                    }
                })
            }

            if (!hasDetail) {
                alertMsg = "請至少輸入一筆採購資料";
            }

            $.each(yErrArray, function (index, yerr) {
                alertMsg += yerr + "<br>";
            })

            if (alertMsg != "") { alertMsg += "<br>"; }
            $.each(pErrArray, function (index, perr) {
                alertMsg += perr + "<br>";
            })

            //20190318 新增 是否有報價單=”是” 且 是否為本行供應商=”否”時，卡控表單無法傳送
            if (JsonData.HaveQuoteForm == 1 && JsonData.IsNewSupplier == 0) {
                if (alertMsg != "") { alertMsg += "<br>"; }
                alertMsg += "非本行供應商不得提供報價單，請先至供應商資料平台新增供應商";
            }

            if (alertMsg != "") {
                rtn = false
                $("#AlertMessage").html(alertMsg);
                window.location.href = "#modal-added-info-2"
            }
            else {
                if (stage == "B") {//採購經辦階段檢核
                    rtn = fun_QuoteVerify()

                    if (rtn && _clickButtonType != 8) {
                        if (isNaN(parseInt($("#QuoteAmount").val())) || parseInt($("#QuoteAmount").val()) <= 0) {
                            rtn = false;
                            $("#AlertMessage").html("請採購程序尚未填寫");
                            window.location.href = "#modal-added-info-2"

                            $('html, body').animate({
                                scrollTop: ($("#PriceStandardSection").offset().top) - 50
                            }, 500);
                        }
                    }
                }
            }
        }
        else {
            rtn = false
            if ($('[Errmsg=Y]').length > 0) {
                $('html, body').animate({
                    scrollTop: ($('[Errmsg=Y]').first().closest("div .row").offset().top) - 50
                }, 500);
            }
        }

        if (rtn) {
            $.ajax({
                url: '/PR/ApiAmountMaxValueCheck',
                dataType: 'json',
                type: 'POST',
                data: JsonData,
                async: false,
                success: function (data) {
                    if (data) {
                        let ErrorMessage = "";
                        $.each(data, function (i, Err) {
                            ErrorMessage += Err.ErrorMessage + "<br>"
                        })

                        $("#AlertMessage").html(ErrorMessage);
                        window.location.href = "#modal-added-info-2"

                        draftAjax.reject();
                    }
                    else {
                        draftAjax.resolve();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    draftAjax.reject();
                    alert("金額檢核發生異常 " + textStatus)
                }
            })
        }
        else {
            draftAjax.reject()
        }
    }, 0)

    return draftAjax.promise();
}

//基本驗證
function fun_basicVerify(target) {
    rtn = true;
    $(target).find("[Errmsg=Y]").remove();
    $(target).find("[necessary]").each(function () {
        if ($(this).parents("[alt=deleted]").length == 0) {
            if ($(this).val() == null || String($(this).val()).trim().length < 1) {
                fun_AddErrMesg($(this), null, "此為必填欄位")
                rtn = false;
            }
        }
    })

    $(target).find("input[Amount]").each(function () {
        if (!fun_onblurAction(this)) {
            rtn = false;
        }
    })

    return rtn
}

//送貨層驗證
function fun_DeliveryVerify(DeliveryList, isAMT) {
    rtn = { result: true, Quantity: 0, ErrMsg: "" }
    hasDelivery = false;
    hasDeliveryErr = false;
    Quantity = 0

    $.each(DeliveryList, function (devindex, devObj) {
        if (!devObj.IsDelete) {
            hasDelivery = true
            if (devObj.ChargeDept == "" || devObj.RcvDept == "" || devObj.Quantity <= 0) {
                hasDeliveryErr = true;
            }
            else {
                Quantity += devObj.Quantity;
                if (!isAMT) {
                    if (devObj.Quantity != parseInt(devObj.Quantity)) {
                        hasDeliveryErr = true;
                        return false
                    }
                }
                else {
                    if (Quantity > 1) {
                        hasDeliveryErr = true;
                        return false
                    }
                }
            }
        }
    })

    Err = "";

    if (!hasDelivery) { Err = "未輸入送貨單位明細" }
    if (hasDeliveryErr) { Err = "送貨單位明細有誤" }
    if (isAMT && Quantity != 1) { Err = "單位為金額時數量需等於1" }

    rtn.result = (Err == "");
    rtn.Quantity = Quantity;
    rtn.ErrMsg = Err;

    return rtn
}

//報價驗證
function fun_QuoteVerify() {
    rtn = true

    if (_clickButtonType == 8) {//傳送其他主管，只需完成部份報價
        $.each($("#QuoteInfoTable").find("tbody"), function (index, tbody) {
            if ($(tbody).find("input[name=Confirmed]").length > 0 && !$(tbody).find("input[name=Confirmed]").prop("checked")) {
                /*   $('html, body').animate({
                       scrollTop: ($("#QuoteInfoTable").closest("div .row").offset().top) - 50
                   }, 500);*/

                $("#AlertMessage").html("尚有報價商品未確認報價");

                rtn = false
                window.location.href = "#modal-added-info-2"
                return false
            }
        })
    }
    else {//傳送下一關，需完成全部報價
        $.each($("#PROneTimeDetailTable").find("tbody").not("[alt=deleted]"), function (index, tbody) {
            if ($(tbody).find("input[name=Confirmed]").val() != "true") {
                /* $('html, body').animate({
                     scrollTop: ($("#PROneTimeDetailTable").closest("div .row").offset().top) - 50
                 }, 500);*/

                $("#AlertMessage").html("尚有一次性採購商品未確認報價");
                rtn = false
                window.location.href = "#modal-added-info-2"
                return false
            }
        })
    }

    return rtn
}

//傳送
function Save() {
    _formInfo.flag = false
    fun_CustomFlowKey();

    //送其他不會跑驗證，只好再組一次
    fun_JsonDataUpdate();

    //判斷的資訊處主管簽核流程
    {
        P_CustomFlowKey = $('#P_CustomFlowKey').val();
        P_CurrentStep = $("#P_CurrentStep").val();
        if ((P_CustomFlowKey == "PR_P1_002" && P_CurrentStep == "5")
            || (P_CustomFlowKey == "PR_P1_004" && P_CurrentStep == "5")) {
            if (_clickButtonType == 1 || _clickButtonType == 9) {//1 傳送  9 加會
                JsonData.isSigntoInformation = 1;
            }
        }
    }
    let deferred = $.Deferred();

    $.ajax({
        url: '/PR/Save?clickButtonType=' + _clickButtonType,
        dataType: 'json',
        type: 'POST',
        data: JsonData,
        // async: false,
        success: function (data) {
            _formInfo.formGuid = data.FormGuid
            _formInfo.formNum = data.FormNum
            _formInfo.flag = data.Flag
            $("#FormTypeName").val("一般請購單")
            $("#ApplyItem").val("請購主旨-" + JsonData.Subject)

            if (!data.Flag) {
                let ErrorMessage = "";
                if (data.Err != undefined) {
                    $.each(data.Err, function (i, Err) {
                        ErrorMessage += Err.ErrorMessage + "<br>"
                    })
                }
                else {
                    let ErrorMessage = "存檔發生錯誤";
                }

                $("#AlertMessage").html(ErrorMessage);
                window.location.href = "#modal-added-info-2"

                deferred.reject();
            }
            else {
                $.when(CreditBudgetSave(data.FormGuid)).always(function (data) {
                    if (data.Status) {
                        deferred.resolve();
                    } else {
                        _formInfo.flag = false
                        $("#AlertMessage").html("信用卡處預算回寫失敗");
                        window.location.href = "#modal-added-info-2"
                        deferred.reject();
                    }
                }
                 )
                // deferred.resolve();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("新增失敗 " + textStatus)
        }
    }).always(function () {
        $("[Amount]").each(function () {
            $(this).val(fun_accountingformatNumberdelzero($(this).val()))
            $(this).text(fun_accountingformatNumberdelzero($(this).text()))
        })
    });

    return deferred.promise();
}

$(function () {
    stage = fun_stage()

    // ----------------
    $("#__CustomFlowKey").val($('#P_CustomFlowKey').val())
    $("#__CurrentStep").val($("#P_CurrentStep").val())
    // ----------------

    //判斷的資訊處主管簽核流程
    {
        P_CustomFlowKey = $('#P_CustomFlowKey').val();
        P_CurrentStep = $("#P_CurrentStep").val();
        /*  if ((P_CustomFlowKey == "PR_P1_002" && P_CurrentStep == "5")
              || (P_CustomFlowKey == "PR_P1_004" && P_CurrentStep == "5")) {
              sendButtonAction()
          }*/
    }

    DocumentReady.resolve();

    fun_AjaxDataLoading()

    $("#divEcryption").data("DateTimePicker").minDate(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate());
    //控件Acton綁定
    {
        $("input[Amount]").on("focus", function () {
            fun_onfocusAction(this);
        })
        $("input[Amount]").on("blur", function () {
            fun_onblurAction(this);
        })
        $("[name=IsEncryptionYN]").on("click", fun_IsEncryptionAction)
        $("[name=HaveQuoteFormYN]").on("click", fun_HaveQuoteFormAction)
        $("[name=IsNewSupplierYN]").on("click", fun_IsNewSupplierAction)
        $("[name=isInstallmentYN]").on("click", fun_isInstallmentAction)

        $("[name=HaveQuoteFormYN]").on("change", fun_PriceStandard)
        $("[name=BudgetAmount]").on("blur", fun_PriceStandard)
        $("[name=IsConsult]").on("change", fun_PriceStandard)

        $("select[name=ProjectCategoryID]").on("change", fun_ProjectCategoryChange)
        $("select[name=ProjectID]").on("change", fun_ProjectChange)

        $("#AddNewYCDetail").on("click", function () {
            fun_YCDetailCreate()
        })

        $("#PROneTimeDetailCreate").on("click", function () {
            fun_PROneTimeDetailCreate()
        })

        $("#chkHaveContract").on("click", function () {
            if ($(this).prop("checked")) {
                QueryTempForCounterSignUnits([{ unit_name: "法律事務處", unit_id: "0028" }])
            }
        })

        $("#chkIsOutSourcing").on("click", function () {
            if ($(this).prop("checked")) {
                QueryTempForCounterSignUnits([{ unit_name: "個人金融事業處", unit_id: "0055" }])
            }
        })
    }

    //塞資料進表單
    if (JsonData) {
        setTimeout(function () {
            $.each(JsonData, function (key, value) {
                DomObj = $("#InformationSection_Master").find("[name=" + key + "]")

                if ($(DomObj).length > 0) {
                    switch ($(DomObj)[0].tagName) {
                        case "SELECT":
                            //選單連動也很機車 拉到後面處理
                            break;
                        case "TEXTAREA":
                            $(DomObj).val(value)
                            break;
                        case "INPUT":
                            switch ($(DomObj).attr("type")) {
                                case "checkbox":
                                    if (value == 1) { $(DomObj).prop("checked", true) }
                                    else { $(DomObj).prop("checked", false) }
                                    break;
                                case "hidden":
                                    if ($("#InformationSection_Master").find("[name=" + key + "YN]").length > 0) {
                                        $(DomObj).val(value)

                                        if (value == 1) { $("#InformationSection_Master").find("[name=" + key + "YN]").eq(0).prop("checked", true) }
                                        else { $("#InformationSection_Master").find("[name=" + key + "YN]").eq(1).prop("checked", true) }
                                    }
                                    else {
                                        $(DomObj).val(value)
                                    }

                                    break;

                                default:
                                    $(DomObj).val(value)
                                    break;
                            }

                            break;
                    }
                }

                //日期格式比較機車
                if (key == "DecryptionDate") {
                    $("#InformationSection_Master").find("[name=DecryptionDate]").val(fun_DataToString(value))
                }
            })

            if (JsonData.PurReqDetailList) {
                $.each(JsonData.PurReqDetailList, function (index, obj) {
                    if (obj.YCDetailID != 0) {//協議
                        target = fun_YCDetailCreate()
                        $(target).find("[name=PRDetailID]").val(obj.PRDetailID)
                        //用YCDetailID回查品項
                        if (obj.YCDetailID > 0) {
                            $.ajax({
                                type: 'POST',
                                url: '/PR/GetYearlyContractDetailInfo/' + obj.YCDetailID,

                                async: false,
                                success: function (data) {
                                    if (data) {
                                        data.PurchaseEmpName = obj.PurchaseEmpName
                                        data.PurchaseEmpNum = obj.PurchaseEmpNum
                                        popPOitem_inputData(data, target)
                                    }
                                }
                            });

                            target.find("td[name=Quantity]").text(fun_accountingformatNumberdelzero(obj.Quantity))
                            target.find("input[name=DeliveryPrompt]").val(obj.DeliveryPrompt)
                            $(target).data("DeliveryList", obj.PurReqDeliveryList)
                            $(target).find("span[name=totalTwdAmount]").eq(0).text(fun_accountingformatNumberdelzero(accounting.toFixed(obj.Price * obj.Quantity, 4)))
                        }
                    }
                    else {//一次性
                        fun_PROneTimeDetailCreate(obj)
                    }
                })
            }
            fun_IsEncryptionAction()

            fun_ProjectSet(JsonData.ProjectCategoryID, JsonData.ProjectID, JsonData.ProjectItemID)

            //是否為新供應商預設是/否皆不勾選
            if (JsonData.IsNewSupplier == null) {
                $("[name=IsNewSupplierYN]").prop("checked", false)
            }
            else {
                fun_IsNewSupplierAction()
            }

            //是否為新供應商預設是/否皆不勾選
            if (JsonData.IsNewSupplier == null) {
                $("[name=IsNewSupplierYN]").prop("checked", false)
            }
            else {
                fun_IsNewSupplierAction()
            }

            //是否為分期付款預設是/否皆不勾選
            if (JsonData.isInstallment == null) {
                $("[name=isInstallmentYN]").prop("checked", false)
            }
            else {
                fun_isInstallmentAction()
            }

            //是否有報價單預設是/否皆不勾選
            if (JsonData.HaveQuoteForm == null) {
                $("[name=HaveQuoteFormYN]").prop("checked", false)
            }
            else {
                fun_HaveQuoteFormAction()
            }

            JsonDataAsync.resolve()
        }, 0)
    }
    else {
        JsonDataAsync.resolve()
    }

    $.when(JsonDataAsync.promise()).always(function () {
        fun_PriceStandard()
        $("input").on("focus", function () {
            $(this).nextAll("[Errmsg=Y]").remove();
        })
        $("textarea").on("focus", function () {
            $(this).nextAll("[Errmsg=Y]").remove();
        })
        $("select").on("change", function () {
            $(this).nextAll("[Errmsg=Y]").remove();
        })

        stageControl(stage)

        GetFirstPurchaseEmpNum()
    })
})

//權限控制
{
    function stageControl(stage) {
        //C --起單人 *除報價單、請採購程序判定區外都可控 報價單需清空
        //M --主管、經辦 *除報價單、請採購程序判定區與請購資訊區部分欄位外都可控 報價單需清空
        //B --採購 *請購資訊區部分欄位外都可控
        //R --唯讀
        switch (stage) {
            case "C":
                fun_ControlDisable($("#QuoteInfoSection"), null)
                fun_ControlDisable($("#PriceStandardSection"), null)
                fun_ControlDisable($("#PROneTimeDetailCloneTemplate").find("[PRDConform]"), null)
                fun_ControlDisable($("#PROneTimeDetailCloneTemplate").find("[ReQO]"), null)
                break;

            case "M":
                fun_ControlDisable($("[name=Subject]"), JsonData.Subject)
                fun_ControlDisable($("[name=Description]"), JsonData.Description)
                fun_ControlDisable($("[name=IsEncryptionYN]"), null)
                $("#spanCalendar").hide()
                // fun_ControlDisable($("[name=isInstallmentYN]"), null)
                fun_ControlDisable($("[name=DecryptionDate]"), fun_DataToString(JsonData.DecryptionDate))
                fun_ControlDisable($("#PROneTimeDetailCloneTemplate").find("[ReQO]"), null)
                fun_ControlDisable($("[name=IsInformationProducts]"), null)
                fun_ControlDisable($("[name=HaveContract]"), null)
                fun_ControlDisable($("[name=IsOutSourcing]"), null)
                fun_ControlDisable($("#QuoteInfoSection"), null)
                fun_ControlDisable($("#PriceStandardSection"), null)
                fun_ControlDisable($("#PROneTimeDetailCloneTemplate").find("[PRDConform]"), null)
                fun_ControlDisable($("#PROneTimeDetailCloneTemplate").find("[ReQO]"), null)
                break;
            case "B":
                fun_ControlDisable($("[name=Subject]"), JsonData.Subject)
                fun_ControlDisable($("[name=Description]"), JsonData.Description)
                fun_ControlDisable($("[name=IsEncryptionYN]"), null)
                $("#spanCalendar").hide()
                // fun_ControlDisable($("[name=isInstallmentYN]"), null)
                fun_ControlDisable($("[name=DecryptionDate]"), fun_DataToString(JsonData.DecryptionDate))

                fun_ControlDisable($("[name=IsInformationProducts]"), null)
                fun_ControlDisable($("[name=HaveContract]"), null)
                fun_ControlDisable($("[name=IsOutSourcing]"), null)
                // fun_ControlDisable($("[name=HaveQuoteFormYN]"), null)
                // fun_ControlDisable($("[name=BudgetAmount]"), fun_accountingformatNumberdelzero(JsonData.BudgetAmount))

                break;
            case "R":
                break;
        }
    }

    function fun_ControlDisable(target, context) {
        parentObj = $(target).parent();
        intable = ($(target).parents("table").length > 0);
        if ($(target).length == 0) {
            return false
        }
        switch ($(target)[0].tagName) {
            case "SELECT":

                $(target).remove();
                if (intable) {
                    $(parentObj).append(context)
                }
                else {
                    $(parentObj).append("<div class=\"disable-text\">" + context + "</div>")
                }

                break;

            case "TEXTAREA":
                $(target).remove();
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
                        $(target).remove();
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
                $(target).remove()
                break;
            case "DIV":
                $(target).remove()
                break;
            default:
                $(target).toggleClass("input-disable", true).prop("readonly", true).prop("disabled", true)
                break;
        }
    }
}

//控項的Action
{
    //是否為密件
    function fun_IsEncryptionAction() {
        if ($("[name=IsEncryptionYN]").eq(0).prop("checked")) {
            $("[name=IsEncryption]").val(1)
            $("#textDecryptDate").toggleClass("input-disable", false).prop("readonly", false)
            $("#spanCalendar").toggleClass("input-disable", false)
            $("#EcryptionNote").show()
        }
        else {
            $("[name=IsEncryption]").val(0)
            $("#textDecryptDate").val("").toggleClass("input-disable", true).prop("readonly", true)
            $("#spanCalendar").toggleClass("input-disable", true)
            $("#EcryptionNote").hide()
        }
    }

    // 是否有報價單
    function fun_HaveQuoteFormAction() {
        $("input[name=HaveQuoteForm]").nextAll("[Errmsg=Y]").remove();
        if ($("[name=HaveQuoteFormYN]").eq(0).prop("checked")) {
            $("[name=HaveQuoteForm]").val(1)
            $("[name=BudgetAmount]").attr("necessary", "").attr("Amount", "")
            $("#start_BudgetAmount").show()
            $("#QuoteFormText").show()
        }
        else {
            $("[name=HaveQuoteForm]").val(0)
            $("[name=BudgetAmount]").removeAttr("necessary").attr("Amount", "Zero")
            $("#start_BudgetAmount").hide()
            $("#QuoteFormText").hide()
        }
        // $("[name=BudgetAmount]").trigger('focus');
        //  $("[name=BudgetAmount]").trigger('blur');
    }

    //新供應商判定 *改為是否為本行供應商
    function fun_IsNewSupplierAction() {
        $("input[name=IsNewSupplier]").nextAll("[Errmsg=Y]").remove();
        if ($("[name=IsNewSupplierYN]").eq(0).prop("checked")) {
            $("[name=IsNewSupplier]").val(1)
            $("#mesIsNewSupplierY").show()
            $("#mesIsNewSupplierN").hide()
        }
        else {
            $("[name=IsNewSupplier]").val(0)
            $("#mesIsNewSupplierN").show()
            $("#mesIsNewSupplierY").hide()
        }
    }

    //是否分期
    function fun_isInstallmentAction() {
        $("input[name=isInstallment]").nextAll("[Errmsg=Y]").remove();
        if ($("[name=isInstallmentYN]").eq(0).prop("checked")) {
            $("[name=isInstallment]").val(1)
        }
        else {
            $("[name=isInstallment]").val(0)
        }
    }

    function fun_ProjectCategoryChange() {
        $("select[name=ProjectID]").empty();
        $("select[name=ProjectID]").attr("selectedIndex", 0)
        $("select[name=ProjectID]").selectpicker('setStyle', 'input-disable', 'add');
        $("select[name=ProjectID]").prop('disabled', true);
        $("select[name=ProjectID]").removeAttr("necessary")
        $("select[name=ProjectID]").nextAll("[Errmsg=Y]").remove();

        $("select[name=ProjectItemID]").empty();
        $("select[name=ProjectItemID]").attr("selectedIndex", 0)
        $("select[name=ProjectItemID]").selectpicker('setStyle', 'input-disable', 'add');
        $("select[name=ProjectItemID]").prop('disabled', true);
        $("select[name=ProjectItemID]").removeAttr("necessary")
        $("select[name=ProjectItemID]").nextAll("[Errmsg=Y]").remove();

        if ($("select[name=ProjectCategoryID]").val()) {
            $("select[name=ProjectID]").attr("necessary", "")
            $("select[name=ProjectItemID]").attr("necessary", "")
            $("select[name=ProjectID]").selectpicker('setStyle', 'input-disable', 'remove');
            $("select[name=ProjectID]").prop('disabled', false);

            $.ajax({
                url: "/Project/GetProjectDropMenu/",
                type: "POST",
                cache: false,
                dataType: 'json',
                async: false,
                data: { projectCategoryCode: $("select[name=ProjectCategoryID]").val() },
                success: function (data) {
                    if (data) {
                        $.each(data, function (index, obj) {
                            $("select[name=ProjectID]").append($("<option></option>").attr("value", index).text(obj))
                        })
                    }
                }
            })
        }
        $("select[name=ProjectID]").selectpicker('refresh');
        $("select[name=ProjectItemID]").selectpicker('refresh');
    }

    function fun_ProjectChange() {
        $("select[name=ProjectItemID]").empty();
        $("select[name=ProjectItemID]").attr("selectedIndex", 0)
        $("select[name=ProjectItemID]").selectpicker('setStyle', 'input-disable', 'add');
        $("select[name=ProjectItemID]").prop('disabled', true);

        if ($("select[name=ProjectID]").val()) {
            $("select[name=ProjectItemID]").selectpicker('setStyle', 'input-disable', 'remove');
            $("select[name=ProjectItemID]").prop('disabled', false);

            $.ajax({
                url: "/Project/GetProjectItemDropMenu/",
                type: "POST",
                cache: false,
                dataType: 'json',
                async: false,
                data: { ProjectID: $("select[name=ProjectID]").val() },
                success: function (data) {
                    if (data) {
                        $.each(data, function (index, obj) {
                            $("select[name=ProjectItemID]").append($("<option></option>").attr("value", index).text(obj))
                        })
                    }
                }
            })
            $("select[name=ProjectItemID]").selectpicker('refresh');
        }
    }
}

//協議採購區Action
{
    //產生表樣
    function fun_YCDetailCreate() {
        $("#nodata_YCDetail").hide();
        $("#AddNewYCDetail").hide();

        if ($("#YCDetailTable").length == 0) {
            obj = $("#YCDetailTableTemplate").clone()
            obj.attr("id", "YCDetailTable")
            $(obj).find("a[toggleArrow]").on("click", function () {
                fun_toggleAllCloumn($(this))
            })
            $(obj).find("a[addRow]").on("click", function () {
                fun_YCDetailAddNewRow($(this).closest("table"))
            })

            $(obj).find("tbody").remove();
            $("#div_YCDetail").append(obj)
        }
        else {
            obj = $("#YCDetailTable");
        }
        $(obj).show()

        return fun_YCDetailAddNewRow(obj)
    }

    //新增協議採購明細
    function fun_YCDetailAddNewRow(target) {
        tbody = $("#YCDetailTableTemplate").find("tbody").eq(0).clone();
        $(tbody).find("a[toggleArrow]").on("click", function () {
            fun_toggleCloumn($(this))
        })

        $(tbody).find("a[alt=linkpopPOitemList]").on("click", function () {
            $("#inp_POitemListSearchBox").val("")
            $("#popPOitemList").find("a[alt=btnSearch]").click()//預設展示全品項
            $("#popPOitemList").data("target", $(this).closest("tbody"))//指定品名查詢的跳窗要回寫的物件
        })

        $(tbody).find("a[alt=showDetail]").addClass("input-disable")

        $(tbody).find("a[alt=addDelivery]").on("click", function () {
            if ($(this).closest("tbody").data("obj")) {
                $(this).closest("tbody").find("input[name=UomCode]").val($(this).closest("tbody").data("obj").UomCode)
                $("#popPROneTimeDetail").data("target", $(this).closest("tbody"))//指定新增明細跳窗要回寫的物件

                $("#popPROneTimeDetail").trigger("reset", $(this).closest("tbody").find("input[name=ReadOnly]").val())//觸發重新繪製的動作
            }
            else {
                alert("請先選擇採購品項")
                return false
            }
        })

        $(tbody).find("[removeBtn]").on("click", function () {
            table = $(this).closest("table")
            PRDetailID = parseInt($(this).closest("tbody").find("[name=PRDetailID]").val())
            if (PRDetailID > 0) {
                $(this).closest("tbody").attr("alt", "deleted")
                $(this).closest("tbody").find("td[alt=Index]").attr("alt", "deleted")
                $(this).closest("tbody").find("[name=IsDelete]").val(true)
                $(this).closest("tbody").hide()
            }
            else {
                $(this).closest("tbody").remove()
            }

            if ($(table).find("tbody").not("[alt=deleted]").length > 0) {
                fun_resetCellIndex(table, "Index", 1)
            }
            else {
                $("#nodata_YCDetail").show();
                $("#AddNewYCDetail").show();
                $(table).hide();
            }

            GetFirstPurchaseEmpNum()
        })

        $(tbody).on("mouseenter", function () {
            $(this).find("[removeBtn]").show();
        })
        $(tbody).on("mouseleave", function () {
            $(this).find("[removeBtn]").hide();
        })

        $(tbody).find("select[name=PurchaseEmpNum]").on("change", function () {
            GetFirstPurchaseEmpNum()
        })

        $(tbody).find('.selectpicker').data('selectpicker', null);
        $(tbody).find('.bootstrap-select').find("button:first").remove();
        $(tbody).find(".selectpicker").selectpicker("render")
        $(tbody).find('.selectpicker').selectpicker('setStyle', 'input-disable', 'add')

        target.append(tbody)

        fun_resetCellIndex(target, "Index", 1)

        return tbody
    }
}

//一次性採購區Action
{
    var VendortargetRow = null

    //產生表樣
    function fun_PROneTimeDetailCreate(defalutInfo) {
        $.when(th_POCategorySet, th_UomList, th_GreenCategory, th_PurchaseEmpListSet).always(function () {
            $("#nodata_PROneTimeDetail").hide();
            $("#PROneTimeDetailCreate").hide();
            $("#CategoryExcelDL").show();

            if ($("#PROneTimeDetailTable").length == 0) {
                obj = $("#PROneTimeDetailTableTemplate").clone()
                obj.attr("id", "PROneTimeDetailTable")
                $(obj).find("a[toggleArrow]").on("click", function () {
                    fun_toggleAllCloumn($(this))
                })
                $(obj).find("a[addRow]").on("click", function () {
                    fun_PROneTimeAddNewRow($(this).closest("table"))
                })

                $(obj).find("tbody").remove();
                $("#div_PROneTimeDetail").append(obj)
            }
            else {
                obj = $("#PROneTimeDetailTable");
            }
            $(obj).show()

            target = fun_PROneTimeAddNewRow(obj)

            //有DB資料
            if (defalutInfo && target) {
                $(target).find("[name]").each(function () {
                    name = $(this).attr("name");

                    if (!defalutInfo[name]) return
                    value = defalutInfo[name]
                    if ($(this).is("[amount]")) {
                        value = fun_accountingformatNumberdelzero(value)
                    }

                    switch ($(this)[0].tagName) {
                        case "SELECT":
                            $(this).val(value).selectpicker('refresh');

                            break;
                        case "INPUT":
                        case "TEXTAREA":
                            $(this).val(value);
                            break;

                        default:
                            $(this).text(value).removeClass("undone-text");
                            break;
                    }
                })

                if (defalutInfo.InvoiceEmpName) {
                    $(target).find("[name=InvoiceEmptext]").text(defalutInfo.InvoiceEmpName + "(" + defalutInfo.InvoiceEmpNum + ")")
                }
                if (stage == "B") {
                    let hasQuote = false

                    $.ajax({
                        url: "/PR/QuoteDetailListGet/",
                        type: "POST",
                        cache: false,
                        dataType: 'json',
                        data: { PRDetailID: defalutInfo.PRDetailID },
                        async: false,
                        success: function (data) {
                            if (data.length > 0) {
                                hasQuote = true
                            }
                        }
                    })

                    //有報價單
                    if (hasQuote) {
                        $(tbody).find("input").prop("disabled", true).addClass("input-disable")
                        $(tbody).find("select").prop("disabled", true).selectpicker('setStyle', 'input-disable', 'add');
                        $(tbody).find("[removeBtn]").hide();
                        $(tbody).find("[PRDConform]").hide();
                        $(tbody).find("a[alt=Addperson]").hide();

                        $(tbody).off("mouseenter")
                        $(tbody).off("mouseleave")
                        $(tbody).on("mouseenter", function () {
                            $(this).find("[ReQO]").show();
                        })
                        $(tbody).on("mouseleave", function () {
                            $(this).find("[ReQO]").hide();
                        })

                        $(tbody).find("input[name=ReadOnly]").val(1)
                        //生成報價單
                        fun_QuoteRowAddNew(defalutInfo)

                        $(tbody).find("span[name=totalTwdAmount]").text(fun_accountingformatNumberdelzero(accounting.toFixed(defalutInfo.Price * defalutInfo.Quantity, 4)))
                    }
                }

                $(target).data("DeliveryList", defalutInfo.PurReqDeliveryList)

                return target
            }
        }).fail(function () {
            alert("FIIS資料異常")
        })
    }

    //新增一次性採購明細
    function fun_PROneTimeAddNewRow(target) {
        tbody = $("#PROneTimeDetailTableTemplate").find("tbody").eq(0).clone();
        $(tbody).removeAttr("id");
        $(tbody).find("a[toggleArrow]").on("click", function () {
            fun_toggleCloumn($(this))
        })

        $(tbody).find("a[alt=showDetail]").addClass("input-disable")

        if ($("[name=isInstallment]").val() == 1) {
            $(tbody).find("select[name=UomCode]").val("AMT").selectpicker("refresh")
        }

        $(tbody).find("a[alt=addDelivery]").on("click", function () {
            $("#popPROneTimeDetail").data("target", $(this).closest("tbody"))//指定新增明細跳窗要回寫的物件

            ReadOnly = $(this).closest("tbody").find("input[name=ReadOnly]").val()

            $("#popPROneTimeDetail").trigger("reset", ReadOnly)//觸發重新繪製的動作
        })

        $(tbody).find("select[name=CategoryId]").on("change", function () {
            defaultBuyerEmployeeNumber = $("#PROneTimeDetailCloneTemplate").find("option[value=" + $(this).val() + "]").data("defaultBuyerEmployeeNumber")
            if (defaultBuyerEmployeeNumber) {
                $(this).closest("tbody").find("select[name=PurchaseEmpNum]").nextAll("[Errmsg=Y]").remove();
                if ($(this).closest("tbody").find("select[name=PurchaseEmpNum]").find("option[value='" + defaultBuyerEmployeeNumber + "']").length > 0) {
                    $(this).closest("tbody").find("select[name=PurchaseEmpNum]").val(defaultBuyerEmployeeNumber).selectpicker("refresh")
                    $(this).closest("tbody").find("select[name=PurchaseEmpNum]").change()
                }
                else {
                    alert("該採購分類無對應採購經辦人員，請聯繫管理處採購科，謝謝。")
                }
            }
        })

        $(tbody).find("select[name=PurchaseEmpNum]").on("change", function () {
            /*if ($(this).closest("tbody").find("span[name=InvoiceEmptext]").text() == "") {
                $(this).closest("tbody").find("span[name=InvoiceEmptext]").text($(this).find("option:selected").text() + "(" + $(this).val() + ")")
                $(this).closest("tbody").find("input[name=InvoiceEmpNum]").val($(this).val())
                $(this).closest("tbody").find("input[name=InvoiceEmpName]").val($(this).find("option:selected").text())
            }*/
            $(this).closest("tbody").find("span[name=InvoiceEmptext]").text($(this).find("option:selected").text() + "(" + $(this).val() + ")")
            $(this).closest("tbody").find("input[name=InvoiceEmpNum]").val($(this).val())
            $(this).closest("tbody").find("input[name=InvoiceEmpName]").val($(this).find("option:selected").text())

            GetFirstPurchaseEmpNum()
        })

        $(tbody).find("a[alt=Addperson]").on("click", function () {
            VendortargetRow = $(this).closest("tbody")
            //限縮發票人員在總經理室 限縮該單位的MBR、OMG、MGR
            orgpickUser({
                RootUnitSeq: "0011", outputfunction: "QueryTempForVendor", allowRole: ["MBR", "OMG", "MGR"]
            })
        })

        //重新報價
        $(tbody).find("[ReQO]").on("click", function () {
            tbody = $(this).closest("tbody")

            let PRDetailID = parseInt($(tbody).find("input[name=PRDetailID]").val())

            $.ajax({
                url: "/PR/QuoteDetailListGet/",   //存取Json的網址
                type: "POST",
                cache: false,
                dataType: 'json',
                data: { PRDetailID: PRDetailID },
                async: false,
                success: function (data) {
                    if (data && data.length > 0) {
                        EmpNum = data[0].QuoteEmpNum

                        /* if (!confirm("重新報價會導致經辦 " + data[0].QuoteEmpName + "(" + EmpNum + ")所建立之所有報價單及相關資料被一併刪除。是否確認重新報價")) {
                             return false;
                         }*/
                        if (!confirm("請購調整會導致與該明細相關之所有報價單及資料被一併刪除。是否確認")) {
                            return false;
                        }
                        else {
                            $.ajax({
                                // url: "/PR/DelQuoteByCreateBy/",   //存取Json的網址
                                url: "/PR/DelQuoteByPRDetail/",   //存取Json的網址
                                type: "POST",
                                cache: false,
                                dataType: 'json',
                                data: { PRDID: PRDetailID, FillinEmpNum: $("#LoginEno").val() },
                                async: false,
                                success: function (data) {
                                    if (data.length > 0) {
                                        $("#PROneTimeDetailTable").find("tbody").each(function () {
                                            if (data.includes(parseInt($(this).find("input[name=PRDetailID]").val()))) {
                                                $(this).find("input[name=CurrencyCode]").val("")
                                                $(this).find("input[name=CurrencyName]").val("")
                                                $(this).find("input[name=ExchangeRate]").val(0)
                                                $(this).find("input[name=ForeignPrice]").val(0)
                                                $(this).find("input[name=Price]").val(0)
                                                $(this).find("input[name=Confirmed]").val(false)
                                                $(this).find("input[name=QuoteEmpNum]").val("")

                                                $(this).find("td[name=CurrencyName]").html("<b class=\"undone-text\">系統自動帶入</b>")
                                                $(this).find("td[name=ExchangeRate]").text("系統自動帶入").addClass("undone-text")
                                                $(this).find("td[name=ForeignPrice]").html("<b class=\"undone-text\">系統自動帶入</b>")
                                                $(this).find("td[name=Price]").html("<b class=\"undone-text\">系統自動帶入</b>")
                                                $(this).find("span[name=totalTwdAmount]").html("<b class=\"undone-text\">系統自動帶入</b>")
                                            }
                                        })
                                        $("#QuoteInfoTable").find("tbody").each(function () {
                                            if (data.includes($(this).find("input[name=PRDetailID]").val()) && $(this).find("input[name=Confirmed]").prop("checked")) {
                                                $(tbody).find("input[name=Confirmed]").prop("disabled", false).removeClass("input-disable").trigger("click")
                                            }
                                        })
                                    }
                                },
                                error: function () {
                                    alert("刪除報價發生錯誤")
                                    return false;
                                }
                            })
                        }
                    }

                    $("#QuoteInfoTable").find("input[name=PRDetailID][value=" + PRDetailID + "]").closest("tbody").remove()

                    if ($("#QuoteInfoTable").find("tbody").length == 1) {
                        $("#QuoteInfoSection").hide()
                    }
                    else {
                        fun_resetCellIndex($("#QuoteInfoTable"), "Index", 1)
                    }

                    $(tbody).find("input[name=ReadOnly]").val(0)

                    $(tbody).find("input").prop("disabled", false).removeClass("input-disable")
                    $(tbody).find("select").prop("disabled", false).selectpicker('setStyle', 'input-disable', 'remove');
                    $(tbody).find("[removeBtn]").hide();
                    $(tbody).find("[PRDConform]").hide();
                    $(tbody).find("[ReQO]").hide();
                    $(tbody).find("a[alt=Addperson]").show();
                    (tbody).find("input:hidden").each(function () {
                        name = $(this).attr("name")
                        if (name == "CurrencyCode" ||
                            name == "CurrencyName" ||
                           name == "ExchangeRate" ||
                           name == "ForeignPrice" ||
                           name == "Price" ||
                           name == "Confirmed" ||
                            name == "QuoteEmpNum" ||
                            name == "QuoteEmpName" ||
                            name == "StakeHolder"
                            ) {
                            $(this).val("")

                            return true
                        }

                        if (name == "ReadOnly") {
                            $(this).val(0)

                            return true
                        }
                    })

                    $(tbody).off("mouseenter")
                    $(tbody).off("mouseleave")
                    $(tbody).on("mouseenter", function () {
                        $(this).find("[removeBtn]").show();
                        $(this).find("[PRDConform]").show();
                    })
                    $(tbody).on("mouseleave", function () {
                        $(this).find("[removeBtn]").hide();
                        $(this).find("[PRDConform]").hide();
                    })
                },
                error: function () {
                    alert("查詢報價單失敗")
                }
            })
        })

        //移除請購項目
        $(tbody).find("[removeBtn]").on("click", function () {
            table = $(this).closest("table")
            PRDetailID = parseInt($(this).closest("tbody").find("input[name=PRDetailID]").val())
            if (PRDetailID > 0) {
                $(this).closest("tbody").attr("alt", "deleted")
                $(this).closest("tbody").find("td[alt=Index]").attr("alt", "deleted")
                $(this).closest("tbody").find("[name=IsDelete]").val(true)
                $(this).closest("tbody").hide()
            }
            else {
                $(this).closest("tbody").remove()
            }

            if ($(table).find("tbody").not("[alt=deleted]").length > 0) {
                fun_resetCellIndex(table, "Index", 1)
            }
            else {
                $("#nodata_PROneTimeDetail").show();
                $("#PROneTimeDetailCreate").show();
                $("#CategoryExcelDL").hide();
                $(table).hide();
            }
            GetFirstPurchaseEmpNum()
        })

        //確認請購項目
        $(tbody).find("[PRDConform]").on("click", function () {
            tbody = $(this).closest("tbody")
            let rtn = fun_basicVerify(tbody)
            if (!rtn) {
                alert("請檢核輸入資料完整性")
                return
            }

            if (!$(tbody).data("DeliveryList") || $(tbody).data("DeliveryList").length == 0) {
                alert("請輸入送貨單位明細")

                return
            }
            else {
                rtn = fun_DeliveryVerify($(tbody).data("DeliveryList"), ($(tbody).find("select[name=UomCode]").val() == "AMT"))
                if (!rtn.result) {
                    alert("送貨層資料有誤")
                    return
                }
            }

            Detail = fun_PROneTimeDetailtoJson(tbody)

            $.extend(Detail, { PRID: JsonData.FormID, CreateBy: $("#FillInEmpNum").val() })

            result = false

            //先存檔確認報價單可以取得正確的資料
            $.ajax({
                url: "/PR/ModifyPRD/",   //存取Json的網址
                type: "POST",
                cache: false,
                data: { PRD: Detail },
                dataType: 'json',
                async: false,
                success: function (data) {
                    if (data && data.Detail) {
                        $.each(data.Detail, function (k, v) {
                            $(tbody).find("input[name=PRDetailID]").val(k)
                            $(tbody).data("DeliveryList", v)
                        })

                        result = true
                    }
                    else {
                        if (data.Err) {
                            alert(data.Err)
                        }
                        else {
                            alert("採購明細更新失敗")
                        }
                    }
                },
                error: function (err) {
                    alert("採購明細更新失敗")
                }
            })

            if (!result) return false

            json = fun_PROneTimeDetailtoJson(tbody)
            fun_QuoteRowAddNew(json)

            $(tbody).find("input").prop("disabled", true).addClass("input-disable")
            $(tbody).find("select").prop("disabled", true).selectpicker('setStyle', 'input-disable', 'add');
            $(tbody).find("[removeBtn]").hide();
            $(tbody).find("[PRDConform]").hide();
            $(tbody).find("a[alt=Addperson]").hide();

            $(tbody).off("mouseenter")
            $(tbody).off("mouseleave")
            $(tbody).on("mouseenter", function () {
                $(this).find("[ReQO]").show();
            })
            $(tbody).on("mouseleave", function () {
                $(this).find("[ReQO]").hide();
            })

            $(tbody).find("input[name=ReadOnly]").val(1)

            GetFirstPurchaseEmpNum()
        })

        $(tbody).on("mouseenter", function () {
            $(this).find("[removeBtn]").show();
            $(this).find("[PRDConform]").show();
        })
        $(tbody).on("mouseleave", function () {
            $(this).find("[removeBtn]").hide();
            $(this).find("[PRDConform]").hide();
        })

        $(tbody).find('.selectpicker').data('selectpicker', null);
        $(tbody).find('.bootstrap-select').find("button:first").remove();
        $(tbody).find(".selectpicker").selectpicker("render")

        $(tbody).find("input").on("focus", function () {
            $(this).nextAll("[Errmsg=Y]").remove();
        })

        $(tbody).find("select").on("change", function () {
            $(this).nextAll("[Errmsg=Y]").remove();
        })

        target.append(tbody)

        fun_resetCellIndex(target, "Index", 1)

        return tbody
    }

    //人員選擇器ACTION
    function QueryTempForVendor(datas) {
        var context = "";

        if (datas.length > 0) {
            if (VendortargetRow) {
            }
            var context = datas[0].user_name.replace(/\d+/, "").replace(/\s+/, "") + "(" + datas[0].user_id + ")";
            $(VendortargetRow).find("[name=InvoiceEmpNum]").val(datas[0].user_id)
            $(VendortargetRow).find("[name=InvoiceEmpName]").val(datas[0].user_name)
            $(VendortargetRow).find("[name=InvoiceEmptext]").text(datas[0].user_name + "(" + datas[0].user_id + ")")
        }
    }
}

//報價區Action
{
    $(function () {
        $("#linkCreatQOInfo").on("click", function () {
            PRDList = $.map($("#QuoteInfoTable").find("tbody"), function (QoTbody) {
                if ($(QoTbody).find("[name=QoItem]").prop("checked")) {
                    PRDObj = {
                        PRDetailID: $(QoTbody).find("[name=PRDetailID]").val(),
                        CategoryName: $(QoTbody).find("[tag=CategoryName]").text(),
                        ItemDescription: $(QoTbody).find("[tag=ItemDescription]").text(),
                        Quantity: $(QoTbody).find("[tag=Quantity]").text(),
                        UomName: $(QoTbody).find("[tag=UomName]").text()
                    }

                    return PRDObj
                }
            })

            if (PRDList.length == 0) {
                alert("請選擇報價品項")
            }
            else {
                openVendor(true, null)
                $("#AddVendor").data("PRDList", PRDList)
                $("#AddVendor").find("a#VendorConfirm").one("click", function () {
                    VID = $('#VendorList input[name="VendorSelect"]:checked').val()
                    if (VID) {
                        $("#popQuote").data("PRDList", $("#AddVendor").data("PRDList")).data("VID", VID)
                        setTimeout(function () {
                            $("#popQuote").trigger("reset")
                        }, 0)
                    }
                })
            }
        })
    })

    function fun_QuoteRowAddNew(PODetail) {
        if ($("#QuoteInfoTable")) {
            let tbody = $("#QuoteTemplate").find("tbody").eq(0).clone();

            $(tbody).find("[tag]").each(function () {
                tag = $(this).attr("tag")
                $(this).text("")

                if (PODetail[tag]) {
                    value = PODetail[tag]
                    if ($(this).is("[Amount]")) {
                        value = fun_accountingformatNumberdelzero(value)
                    }

                    if ($(this)[0].tagName == "INPUT") {
                        $(this).val(value)
                    }
                    else {
                        $(this).text(value)
                    }
                }
            })

            $(tbody).find("[name=Confirmed]").on("click", function () {
                tbody = $(this).closest("tbody")
                PRDetailID = $(tbody).find("input[name=PRDetailID]").val()
                if ($(this).prop("checked")) {
                    ForeignPrice = 0
                    Price = 0
                    ExchangeRate = 0
                    CurrencyCode = ""
                    CurrencyName = ""
                    QDetailID = 0
                    StakeHolder = 0

                    $.ajax({
                        url: "/PR/QuoteDetailListGet/",   //存取Json的網址
                        type: "POST",
                        cache: false,
                        dataType: 'json',
                        data: { PRDetailID: PRDetailID },
                        async: false,
                        success: function (data) {
                            $.each(data, function (index, obj) {
                                if (obj.IsEnabled && obj.Price > Price) {
                                    QDetailID = obj.QDetailID
                                    ForeignPrice = obj.ForeignPrice
                                    Price = obj.Price
                                    ExchangeRate = obj.ExchangeRate
                                    CurrencyCode = obj.CurrencyCode
                                    CurrencyName = obj.CurrencyName

                                    StakeHolder = obj.StakeHolder
                                }
                            })
                        },
                        error: function () {
                            alert("查詢報價單失敗")
                        }
                    })

                    if (Price > 0) {
                        $(tbody).find("[name=QoItem]").prop("checked", false).prop("disabled", true).addClass("input-disable")
                        $(tbody).find("[name=CurrencyName]").text(CurrencyName)
                        $(tbody).find("[name=ExchangeRate]").text(fun_accountingformatNumberdelzero(ExchangeRate))
                        $(tbody).find("[name=Price]").text(fun_accountingformatNumberdelzero(Price, 4))
                        $(tbody).find("span[name=QuoteEmpName]").text($("#FillInName").val())
                        $(tbody).find("span[name=QuoteEmpNum]").text($("#FillInEmpNum").val())
                        $(tbody).find("input[name=QuoteEmpNum]").val($("#FillInEmpNum").val())
                        $(tbody).find("input[name=StakeHolder]").val(StakeHolder)
                        $("#PROneTimeDetailTable").find("input[name=PRDetailID]").each(function () {
                            if ($(this).val() == PRDetailID) {
                                let DeliveryList = $(this).closest("tbody").data("DeliveryList")
                                let totalTwdAmount = 0;
                                $(DeliveryList).each(function (i, o) {
                                    o.UnitPrice = Price
                                    o.Amount = accounting.unformat(accounting.toFixed(Price * o.Quantity, 4))
                                    totalTwdAmount = parseFloat(accounting.toFixed(totalTwdAmount + o.Amount, 4))
                                })

                                $(this).closest("tbody").find("td[name=CurrencyName]").text(CurrencyName)
                                $(this).closest("tbody").find("td[name=ExchangeRate]").text(fun_accountingformatNumberdelzero(ExchangeRate))
                                $(this).closest("tbody").find("td[name=ForeignPrice]").text(fun_accountingformatNumberdelzero(ForeignPrice))
                                $(this).closest("tbody").find("td[name=Price]").text(fun_accountingformatNumberdelzero(Price))
                                $(this).closest("tbody").find("span[name=totalTwdAmount]").text(fun_accountingformatNumberdelzero(totalTwdAmount))

                                $(this).closest("tbody").find("input[name=CurrencyCode]").val(CurrencyCode)
                                $(this).closest("tbody").find("input[name=CurrencyName]").val(CurrencyName)
                                $(this).closest("tbody").find("input[name=ExchangeRate]").val(ExchangeRate)
                                $(this).closest("tbody").find("input[name=ForeignPrice]").val(ForeignPrice)
                                $(this).closest("tbody").find("input[name=Price]").val(Price)
                                $(this).closest("tbody").find("input[name=Confirmed]").val(true)
                                $(this).closest("tbody").find("input[name=QuoteEmpName]").val($("#FillInName").val())
                                $(this).closest("tbody").find("input[name=QuoteEmpNum]").val($("#FillInEmpNum").val())
                                $(this).closest("tbody").find("input[name=StakeHolder]").val(StakeHolder)

                                return false
                            }
                        })
                    }
                    else {
                        alert("查無有效報價資料")
                        $(this).prop("checked", false)
                    }
                }
                else {
                    $(tbody).find("[name=QoItem]").prop("checked", false).prop("disabled", false).removeClass("input-disable")
                    $(tbody).find("[name=CurrencyName]").html("<b class=\"undone-text\">系統帶入</b>")
                    $(tbody).find("[name=ExchangeRate]").html("<b class=\"undone-text\">系統帶入</b>")
                    $(tbody).find("[name=Price]").html("<b class=\"undone-text\">系統帶入</b>")
                    $(tbody).find("[name=QuoteEmpName]").empty()
                    $(tbody).find("[name=QuoteEmpNum]").html("<b class=\"undone-text\">系統自動帶入</b>")
                    $(tbody).find("input[name=QuoteEmpNum]").val("")
                    $("#PROneTimeDetailTable").find("input[name=PRDetailID]").each(function () {
                        if ($(this).val() == PRDetailID) {
                            $(this).closest("tbody").find("td[name=CurrencyName]").html("<b class=\"undone-text\">系統自動帶入</b>")
                            $(this).closest("tbody").find("td[name=ExchangeRate]").html("<b class=\"undone-text\">系統自動帶入</b>")
                            $(this).closest("tbody").find("td[name=ForeignPrice]").html("<b class=\"undone-text\">系統自動帶入</b>")
                            $(this).closest("tbody").find("td[name=Price]").html("<b class=\"undone-text\">系統自動帶入</b>")
                            $(this).closest("tbody").find("span[name=totalTwdAmount]").html("<b class=\"undone-text\">系統自動帶入</b>")

                            $(this).closest("tbody").find("input[name=CurrencyCode]").val("")
                            $(this).closest("tbody").find("input[name=CurrencyName]").val("")
                            $(this).closest("tbody").find("input[name=ExchangeRate]").val("")
                            $(this).closest("tbody").find("input[name=ForeignPrice]").val("")
                            $(this).closest("tbody").find("input[name=Price]").val("")
                            $(this).closest("tbody").find("input[name=Confirmed]").val(false)
                            $(this).closest("tbody").find("input[name=QuoteEmpName]").val("")
                            $(this).closest("tbody").find("input[name=QuoteEmpNum]").val("")
                            $(this).closest("tbody").find("input[name=StakeHolder]").val(0)
                            return false
                        }
                    })
                }
            })

            $(tbody).find("[name=QuoDetail]").on("click", function () {
                PRDetailID = $(this).closest("tbody").find("input[name=PRDetailID]").val()
                Confirmed = $(this).closest("tbody").find("input[name=Confirmed]").prop("checked")
                $("#QuotationInforemodal").trigger("reset", { PRDetailID: PRDetailID, Confirmed: Confirmed })
            })

            if (PODetail.Confirmed) {
                //$(tbody).find("[name=Confirmed]").prop("checked", true).prop("disabled", true).addClass("input-disable")
                $(tbody).find("[name=Confirmed]").prop("checked", true)
                $(tbody).find("[name=CurrencyName]").text(PODetail.CurrencyName)
                $(tbody).find("[name=ExchangeRate]").text(fun_accountingformatNumberdelzero(PODetail.ExchangeRate))
                $(tbody).find("[name=Price]").text(fun_accountingformatNumberdelzero(PODetail.Price))
                $(tbody).find("span[name=QuoteEmpName]").text(PODetail.QuoteEmpName)
                $(tbody).find("span[name=QuoteEmpNum]").text(PODetail.QuoteEmpNum)
                $(tbody).find("input[name=StakeHolder]").val(PODetail.StakeHolder)
                $(tbody).find("[name=QoItem]").prop("checked", false).prop("disabled", true).addClass("input-disable")
            }

            $("#QuoteInfoTable").append(tbody)
            fun_resetCellIndex($("#QuoteInfoTable"), "Index", 1)

            $("#QuoteInfoSection").show()
        }
    }

    function fun_QuoteRowDeltet(target) {
        $(target).remove();
        fun_resetCellIndex($("#QuoteInfoTable"), "Index", 1)
    }
}

//請採購程序判定區Action
{
    $(function () {
        if (fun_stage() == "B" && JsonData.PurchasePriceStardandId != 0 && JsonData.PurchaseSigningLevelId != 0 &&
            JsonData.PurReqDetailList != null && JsonData.PurReqDetailList.length > 0) {
            $.when(JsonDataAsync.promise(), th_POCategorySet, th_UomList, th_GreenCategory, th_PurchaseEmpListSet).done(function () {
                let AllConfirmed = true;
                //會計經辦階段時如果載入時已經全部報價完成則自動展開請採購程序判定區
                if ($.map(JsonData.PurReqDetailList, function (o) {
                    //抓出一次性未確認資料
                     if (!o.Confirmed && o.YCDetailID == 0) { return o.Confirmed }
                }).length == 0) {
                    setTimeout(function () {
                        fun_PriceStandardShow(JsonData.QuoteAmount)
                        $("input[name=PurchasePriceStardandDescription]").val(JsonData.PurchasePriceStardandDescription)
                        $("select[name=PurchasePriceStardandId]").val(JsonData.PurchasePriceStardandId).selectpicker('refresh');
                        $("select[name=PurchaseSigningLevelId]").val(JsonData.PurchaseSigningLevelId).selectpicker('refresh');
                        $("#PurchaseSigningLevelId").change()
                    }, 100)
                }
            })
        }

        $("#CreatePriceStandard").on("click", function () {
            totalAmount = fun_GetTotalAmount()
            if (totalAmount <= 0) {
                alert("請完成所有明細報價與確認")
                return false;
            }
            else {
                $("input[name=PurchasePriceStardandDescription]").removeAttr("necessary", "")
                $("#satrMark_PurchasePriceStardandDescription").hide()
                fun_PriceStandardShow(totalAmount)
            }
        })

        $("#CancelPriceStandard").on("click", function () {
            $("select[name=PurchaseSigningLevelId]").removeAttr("necessary", "")
            $("select[name=PurchasePriceStardandId]").removeAttr("necessary", "")
            $("input[name=PurchasePriceStardandDescription]").val("").removeAttr("necessary", "")
            $("#ContractTotalAmount").text(0)
            $("#QuoteAmount").val(0)

            $("#chkIsConsult").removeClass("input-disable").removeAttr("readonly").prop("disabled", false)

            $("#AddNewYCDetail").show();
            $("#YCDetailTable").find("a[addRow]").show();
            $("#YCDetailTable").find("a[alt=linkpopPOitemList]").show();
            //$("#YCDetailTable").find("input[name=ReadOnly]").val(0);
            $("#YCDetailTable").find("input[name=DeliveryPrompt]").addClass("input-disable").prop("disabled", true)
            $("#YCDetailTable").find("tbody").on("mouseenter", function () {
                $(this).find("[removeBtn]").show();
            })
            $("#YCDetailTable").find("tbody").on("mouseleave", function () {
                $(this).find("[removeBtn]").hide();
            })

            $("#PROneTimeDetailCreate").show();
            $("#PROneTimeDetailTable").find("a[addRow]").show();
            //$("#PROneTimeDetailTable").find("input[name=ReadOnly]").val(0);
            $("#PROneTimeDetailTable").find("tbody").on("mouseenter", function () {
                $(this).find("[ReQO]").show();
            })
            $("#PROneTimeDetailTable").find("tbody").on("mouseleave", function () {
                $(this).find("[ReQO]").hide();
            })

            $("#QuoteInfoTable").find("input:checkbox[name=Confirmed]").removeClass("input-disable").prop("disabled", false)
            $("#linkCreatQOInfo").show()

            $(this).hide()
            $("#PriceStandardArea").hide()
            $("#CreatePriceStandard").show()
        })

        $(document).on("change", "#PurchaseSigningLevelId", function () {
            $("input[name=PurchasePriceStardandDescription]").next("[Errmsg=Y]").remove()

            if ($("#PurchaseSigningLevelId option:selected").is("[default]")) {//預設選項
                $("input[name=PurchasePriceStardandDescription]").removeAttr("necessary", "")
                $("#satrMark_PurchasePriceStardandDescription").hide()
            }
            else {
                $("input[name=PurchasePriceStardandDescription]").attr("necessary", "")
                $("#satrMark_PurchasePriceStardandDescription").show()
            }
        })

        $("[name=IsConsult]").on("change", function () {
            $("select[name=PurchasePriceStardandId]").empty()
            ContractTotalAmount = parseInt(accounting.unformat($("#ContractTotalAmount").text()))
            $.each(PriceStandardList, function (index, option) {
                if (($("[name=IsConsult]").prop("checked") && option.PriceKind == 2) || (!$("[name=IsConsult]").prop("checked") && option.PriceKind == 1)) {
                    Obj = $("<option></option>").val(option.ItemNo).text(option.ItemName).data("MaxAmount", option.MaxAmount).data("MinAmount", option.MinAmount)
                    if (option.MaxAmount > ContractTotalAmount) {
                        $("select[name=PurchasePriceStardandId]").append(Obj)
                    }
                }
            })

            $("select[name=PurchasePriceStardandId] option").eq(0).attr("selected", "")
            $("select[name=PurchasePriceStardandId]").selectpicker('refresh');
        })
    })

    function fun_PriceStandardShow(totalAmount) {
        $.when(th_PriceStandard).done(function () {
            $("select[name=PurchaseSigningLevelId]").empty()
            $("select[name=PurchasePriceStardandId]").empty()

            $("#ContractTotalAmount").text(fun_accountingformatNumberdelzero(totalAmount))
            $("#QuoteAmount").val(totalAmount)
            if (PriceStandardList) {
                PriceStandard = $.grep(PriceStandardList, function (obj) {
                    return (obj.MaxAmount >= totalAmount || obj.PriceKind == 0)
                  
                })

                IsConsult = $(":checkbox[name=IsConsult]").prop("checked")
                StakeHolder = false;
                if ($("#QuoteInfoTable").find("input[name=StakeHolder][value=1]").length > 0) {
                    $("#haveStakeHolder").show()
                    StakeHolder = true
                }
                else {
                    $("#haveStakeHolder").hide()
                }

                SigningLevelId = "";
                PriceKind = 1

                if (!IsConsult && !StakeHolder) {
                    PriceKind = 1//沒顧問類沒利害關係
                }
                else if (IsConsult && !StakeHolder) {
                    PriceKind = 2//有顧問類沒利害關係
                }
                else if (IsConsult && StakeHolder) {
                    PriceKind = 3//有顧問類有利害關係
                }
                else {
                    PriceKind = 4//沒顧問類有利害關係
                }

                $.each(PriceStandard, function (index, option) {
                    if (option.PriceKind == 0) {
                        $("select[name=PurchaseSigningLevelId]").append($("<option></option>").val(option.ItemNo).text(option.ItemName).data("MaxAmount", option.MaxAmount).data("MinAmount", option.MinAmount))
                        if (totalAmount >= option.MinAmount && totalAmount <= option.MaxAmount) SigningLevelId = option.ItemNo

                    }
                    if ((option.PriceKind == PriceKind)) {
                        $("select[name=PurchasePriceStardandId]").append($("<option></option>").val(option.ItemNo).text(option.ItemName).data("MaxAmount", option.MaxAmount).data("MinAmount", option.MinAmount))
                    }
                })

                $("select[name=PurchaseSigningLevelId] option[value=" + SigningLevelId + "]").attr("selected", "selected").attr("default", "")
                $("select[name=PurchasePriceStardandId] option").eq(0).attr("selected", "selected")

                $("select[name=PurchaseSigningLevelId]").selectpicker('refresh');
                $("select[name=PurchasePriceStardandId]").selectpicker('refresh');
            }

            $("select[name=PurchaseSigningLevelId]").attr("necessary", "")
            $("select[name=PurchasePriceStardandId]").attr("necessary", "")

            $("#chkIsConsult").addClass("input-disable").attr("readonly", "").prop("disabled", true)

            $("#AddNewYCDetail").hide();
            $("#YCDetailTable").find("a[addRow]").hide();
            $("#YCDetailTable").find("a[alt=linkpopPOitemList]").hide();
            $("#YCDetailTable").find("input[name=ReadOnly]").val(1);
            $("#YCDetailTable").find("input[name=DeliveryPrompt]").addClass("input-disable").prop("disabled", true)
            $("#YCDetailTable").find("tbody").off("mouseenter")
            $("#YCDetailTable").find("tbody").off("mouseleave")

            $("#PROneTimeDetailCreate").hide();
            $("#PROneTimeDetailTable").find("a[addRow]").hide();
            $("#PROneTimeDetailTable").find("input[name=ReadOnly]").val(1);
            $("#PROneTimeDetailTable").find("input").addClass("input-disable").prop("disabled", true)
            $("#PROneTimeDetailTable").find("select").selectpicker('setStyle', 'input-disable', 'add').prop("disabled", true);
            $("#PROneTimeDetailTable").find("a[alt=Addperson]").hide();
            $("#PROneTimeDetailTable").find("tbody").off("mouseenter")
            $("#PROneTimeDetailTable").find("tbody").off("mouseleave")

            $("#QuoteInfoTable").find("input:checkbox").addClass("input-disable").prop("disabled", true)
            $("#linkCreatQOInfo").hide()

            $("#CreatePriceStandard").hide()
            $("#PriceStandardArea").show()
            $("#CancelPriceStandard").show()
        })
    }

    function fun_GetTotalAmount() {
        totalAmount = 0;

        if (fun_basicVerify($("#YCDetailTable").find("tbody")) &&
            fun_basicVerify($("#PROneTimeDetailTable").find("tbody"))) {
            $.each($("#YCDetailTable").find("tbody").not("[alt=deleted]"), function (index, tbody) {
                Quantity = parseInt(accounting.unformat($(tbody).find("td[name=Quantity]").text()))
                UnitTwdPrice = accounting.unformat($(tbody).find("span[tag=UnitTwdPrice]").text())
                if (Quantity > 0 && UnitTwdPrice > 0) {
                    totalAmount += Quantity * UnitTwdPrice
                }
                else {
                    totalAmount = -1
                    return false;
                }
            })

            if (totalAmount < 0) return false;

            $.each($("#PROneTimeDetailTable").find("tbody").not("[alt=deleted]"), function (index, tbody) {
                Quantity = parseInt(accounting.unformat($(tbody).find("td[name=Quantity]").text()))
                UnitTwdPrice = accounting.unformat($(tbody).find("td[name=Price]").text())
                if (Quantity > 0 && UnitTwdPrice > 0) {
                    totalAmount += Quantity * UnitTwdPrice
                }
                else {
                    totalAmount = -1
                    return false;
                }
            })
        }
        else {
            totalAmount = -1
        }

        totalAmount = Math.round(totalAmount)
        if (totalAmount <= 0) { totalAmount = -1; }

        return totalAmount
    }
}

//初始頁面 ajax載入資料
function fun_AjaxDataLoading() {
    //抓取簽核層級對照表資料
    th_PriceStandard = $.ajax({
        url: "/PR/PriceStandardListGet/",   //存取Json的網址
        type: "POST",
        cache: false,
        dataType: 'json',
        async: true,
        success: function (data) {
            PriceStandardList = data
        }
    })

    //抓取專案類別資料
    th_ProjectCategory = $.ajax({
        url: "/Project/GetProjectCategoryDropMenu/",
        cache: false,
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data) {
                $("select[name=ProjectCategoryID]").append($("<option></option>").attr("value", "").text("請選擇"))
                $.each(data, function (index, obj) {
                    $("select[name=ProjectCategoryID]").append($("<option></option>").attr("value", index).text(obj))
                })
                $("select[name=ProjectCategoryID]").selectpicker('refresh');
            }
        }
    })

    //抓取採購分類
    th_POCategorySet = $.ajax({
        url: "/PR/POCategorySet/",
        type: "POST",
        cache: false,
        data: { PRnum: $("#DocNum").text() },
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data) {
                $.each(data, function (index, obj) {
                    $("#PROneTimeDetailCloneTemplate").find("select[name=CategoryId]").append($("<option></option>").data("defaultBuyerEmployeeNumber", obj.defaultBuyerEmployeeNumber).attr("value", obj.categoryId).text(obj.category))
                })
                $("select[name=CategoryId]").selectpicker('refresh');
            }
        }
    })

    //抓取商品單位分類
    th_UomList = $.ajax({
        url: "/PR/GetUomList/",
        type: "POST",
        cache: false,
        data: { PRnum: $("#DocNum").text() },
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data) {
                $.each(data, function (key, value) {
                    $("#PROneTimeDetailCloneTemplate").find("select[name=UomCode]").append($("<option></option>").attr("value", key).text(value))
                })
                $("select[name=UomCode]").selectpicker('refresh');
            }
        }
    })

    //抓取綠色採購分類
    th_GreenCategory = $.ajax({
        url: "/PR/GetGreenCategory/",
        type: "POST",
        cache: false,
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data) {
                $.each(data, function (index, obj) {
                    $("#PROneTimeDetailCloneTemplate").find("select[name=GreenCategory]").append($("<option></option>").attr("value", obj.greenProcureCategory).text(obj.description))
                })
                $("select[name=GreenCategory]").selectpicker('refresh');
            }
        }
    })

    //抓取採購經辦名單
    th_PurchaseEmpListSet = $.ajax({
        url: "/PR/PurchaseEmpListSet/",
        type: "POST",
        cache: false,
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data) {
                $.each(data, function (key, value) {
                    // $("#PROneTimeDetailCloneTemplate").find("select[name=PurchaseEmpNum]").append($("<option></option>").attr("data-subtext", key).attr("value", key).text(value))
                    $("select[name=PurchaseEmpNum]").append($("<option></option>").attr("data-subtext", key).attr("value", key).text(value))
                })
                $("select[name=PurchaseEmpNum]").selectpicker('refresh');
            }
        }
    })
}

//設定專案
function fun_ProjectSet(ProjectCategoryID, ProjectID, ProjectItemID) {
    $.when(th_ProjectCategory).done(function () {
        $("select[name=ProjectCategoryID]").val(ProjectCategoryID).selectpicker('refresh');
        fun_ProjectCategoryChange()
        $("select[name=ProjectID]").val(ProjectID).selectpicker('refresh');
        fun_ProjectChange()
        $("select[name=ProjectItemID]").val(ProjectItemID).selectpicker('refresh');
    })
}

//判斷預設簽核層級
function fun_PriceStandard() {
    $("#divParity span").toggleClass("undone-text", true).text("系統自動帶入");
    $("#divSignLv span").toggleClass("undone-text", true).text("系統自動帶入");
    $("input[name=PriceStandardId]").val(-1)
    $("input[name=SigningLevelId]").val(-1)

    $.when(th_PriceStandard, DocumentReady).done(function () {
        if (PriceStandardList) {
            BudgetAmount = accounting.unformat($("input[name=BudgetAmount]").val())
            if (BudgetAmount == 0) {
                return false
            }

            IsConsult = $(":checkbox[name=IsConsult]").prop("checked")

            Info = $.grep(PriceStandardList, function (obj) {
                return (obj.MaxAmount >= BudgetAmount && obj.MinAmount <= BudgetAmount)
            })

            if (Info) {
                $.each(Info, function () {
                    if (this.PriceKind == 0) {
                        $("#divParity span").toggleClass("undone-text", false).text(this.ItemName);
                        $("input[name=PriceStandardId]").val(this.ItemNo)
                    }
                    if ((IsConsult && this.PriceKind == 2) || (!IsConsult && this.PriceKind == 1)) {
                        $("#divSignLv span").toggleClass("undone-text", false).text(this.ItemName);
                        $("input[name=SigningLevelId]").val(this.ItemNo)
                    }
                })
            }
        }
    })
}

//將表單資料更新回JsonData
function fun_JsonDataUpdate() {
    if (JsonData) {
        JsonData.FillInEmpNum = $("#LoginEno").val()

        $("input[Amount]").each(function () {
            $(this).val(accounting.unformat($(this).val()))
        })

        $.each(JsonData, function (key, value) {
            DomObj = $("#InformationSection_Master , #PriceStandardSection").find("[name=" + key + "]")

            if ($(DomObj).length > 0) {
                switch ($(DomObj)[0].tagName) {
                    case "SELECT":
                    case "TEXTAREA":
                        JsonData[key] = $(DomObj).val();
                        break;
                    case "INPUT":
                        switch ($(DomObj).attr("type")) {
                            case "checkbox":
                                if ($(DomObj).prop("checked")) {
                                    JsonData[key] = 1
                                }
                                else {
                                    JsonData[key] = 0;
                                }

                                break;

                            default:
                                JsonData[key] = $(DomObj).val();
                                break;
                        }

                        break;
                    case "DIV":
                        JsonData[key] = $(DomObj).text();
                        break;
                }
            }
        })

        PurReqDetailList = [];
        $("#YCDetailTable tbody").each(function () {
            Detail = { Index: "000", PRDetailID: 0, Quantity: 0, DeliveryPrompt: "", IsDelete: false, ForeignPrice: 0, Price: 0, PurReqDeliveryList: [] }
            if ($(this).data("DeliveryList")) Detail.PurReqDeliveryList = $(this).data("DeliveryList");
            Detail.PRDetailID = $(this).find("[name=PRDetailID]").val()
            Detail.DeliveryPrompt = $(this).find("[name=DeliveryPrompt]").val()
            Detail.Quantity = accounting.unformat($(this).find("[name=Quantity]").text())
            Detail.Index = $(this).find("[alt=Index]").text()
            Detail.IsDelete = $(this).find("[name=IsDelete]").val()

            if ($(this).data("obj")) {
                Detail.ForeignPrice = $(this).data("obj").UnitPrice
                Detail.Price = $(this).data("obj").UnitTwdPrice
                $.extend(Detail, $(this).data("obj"));
            }
            Detail.PurchaseEmpNum = $(this).find("select[name=PurchaseEmpNum]").val()
            if (!isNullOrEmpty(Detail.PurchaseEmpNum)) {
                //避免存到請選擇
                Detail.PurchaseEmpName = $(this).find("select[name=PurchaseEmpNum]").find("option:selected").text()
            }
            if (!Detail.YCDetailID || Detail.YCDetailID <= 0) {
                Detail.YCDetailID = -1 //避免未選品項就暫存時無法分辨是ㄧ次或協議
            }
            PurReqDetailList.push(Detail)
        })

        $("#PROneTimeDetailTable tbody").each(function () {
            Detail = fun_PROneTimeDetailtoJson(this)
            PurReqDetailList.push(Detail)
        })

        JsonData.PurReqDetailList = PurReqDetailList

        JsonData.FillInEmpNum = $("#LoginEno").val();
        JsonData.FillInName = $("#LoginName").val();
        //只有起單會寫入
        JsonData.ApplicantEmpNum = $("#ApplicantEmpNum").val();
        JsonData.ApplicantName = $("#ApplicantName").val();
        JsonData.ApplicantDepId = $("#ApplicantDepId").val();
        JsonData.ApplicantDepName = $("#ApplicantDepName").val();
    }
}

function fun_PROneTimeDetailtoJson(tbody) {
    Detail = {
        Index: $(tbody).find("[alt=Index]").text(),
        PRDetailID: $(tbody).find("[name=PRDetailID]").val(),
        CategoryId: $(tbody).find("[name=CategoryId]").val(),
        CategoryName: $(tbody).find("[name=CategoryId]").find("option:selected").text(),
        ItemDescription: $(tbody).find("[name=ItemDescription]").val(),
        Quantity: accounting.unformat($(tbody).find("[name=Quantity]").text()),
        UomCode: $(tbody).find("[name=UomCode]").val(),
        UomName: $(tbody).find("[name=UomCode]").find("option:selected").text(),
        PurchaseEmpNum: $(tbody).find("[name=PurchaseEmpNum]").val(),
        PurchaseEmpName: $(tbody).find("[name=PurchaseEmpNum]").find("option:selected").text(),
        InvoiceEmpNum: $(tbody).find("[name=InvoiceEmpNum]").val(),
        InvoiceEmpName: $(tbody).find("[name=InvoiceEmpName]").val(),
        GreenCategory: $(tbody).find("[name=GreenCategory]").val(),
        DeliveryPrompt: $(tbody).find("[name=DeliveryPrompt]").val(),
        IsDelete: $(tbody).find("[name=IsDelete]").val(),

        CurrencyCode: $(tbody).find("input[name=CurrencyCode]").val(),
        CurrencyName: $(tbody).find("input[name=CurrencyName]").val(),
        ExchangeRate: $(tbody).find("input[name=ExchangeRate]").val(),
        ForeignPrice: accounting.unformat($(tbody).find("input[name=ForeignPrice]").val()),
        Price: accounting.unformat($(tbody).find("input[name=Price]").val()),
        QuoteEmpNum: $(tbody).find("input[name=QuoteEmpNum]").val(),
        QuoteEmpName: $(tbody).find("input[name=QuoteEmpName]").val(),
        Confirmed: $(tbody).find("input[name=Confirmed]").val(),
        StakeHolder: $(tbody).find("input[name=StakeHolder]").val(),
        PurReqDeliveryList: []
    }

    if (isNullOrEmpty(Detail.UomCode)) { Detail.UomName = "" }
    if (isNullOrEmpty(Detail.PurchaseEmpNum)) { Detail.PurchaseEmpName = "" }
    if (isNullOrEmpty(Detail.CategoryId)) { Detail.CategoryName = "" }

    if ($(tbody).data("DeliveryList")) Detail.PurReqDeliveryList = $(tbody).data("DeliveryList");

    return Detail
}

//全部展開收合Action
function fun_toggleAllCloumn(target) {
    if ($(target).children("div").hasClass("list-open-icon")) {
        $(target).closest("thead").nextAll("tbody").not("[alt=no-data]").children("tr").not("[Rowtitle]").each(function () {
            $(this).show(200);
        })

        $(target).closest("table").find("div[Arrow]").addClass("glyphicon-chevron-up").attr("title", "全部展開")
        $(target).closest("table").find("div[Arrow]").removeClass("glyphicon-chevron-down")

        $(target).children("div").addClass("list-close-icon")
        $(target).children("div").removeClass("list-open-icon")
    }
    else {
        $(target).closest("thead").nextAll("tbody").not("[alt=no-data]").children("tr").not("[Rowtitle]").each(function () {
            $(this).hide(200);
        })
        $(target).closest("table").find("div[Arrow]").removeClass("glyphicon-chevron-up")
        $(target).closest("table").find("div[Arrow]").addClass("glyphicon-chevron-down").attr("title", "全部收合")

        $(target).children("div").removeClass("list-close-icon")
        $(target).children("div").addClass("list-open-icon")
    }
}

//單一列展開收合Action
function fun_toggleCloumn(target) {
    $(target).closest("tbody").find("tr").not("[Rowtitle]").each(function () {
        $(this).toggle(200);
    })

    $(target).children("div").toggleClass("glyphicon-chevron-down")
    $(target).children("div").toggleClass("glyphicon-chevron-up")
}

//公用副程式
{
    //日期格式轉中文 yyyy-MM-dd
    function fun_DataToString(value) {
        strDate = ""

        if (value) {
            DateObj = new Date(value)
            if (!isNaN(DateObj.getDate())) {
                strDate = DateObj.getFullYear() + "-" + funAddheadZero(2, (DateObj.getMonth() + 1)) + "-" + funAddheadZero(2, DateObj.getDate())
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
        Accuracy = parseInt($(target).attr("Accuracy"))
        MaxValue = $(target).attr("MaxValue")
        Amount = accounting.unformat($(target).val())
        if (isNaN(Accuracy)) {
            Accuracy = 0;
        }
        else {
            if (Accuracy > 4) Accuracy = 4;//小數點最大四位
        }

        if (isNaN(MaxValue)) {
            MaxValue = -1;
        }

        if (Amount == 0 && $(target).attr("Amount") != "Zero") {
            fun_AddErrMesg(target, "ErrAmount", "請輸入大於0的數字")
            return false;
        }

        if (regNum(Amount, (Accuracy > 0))) {
            if (String(Amount).indexOf(".") > 0) {
                if ((String(Amount).length - (String(Amount).indexOf(".") + 1)) > Accuracy) {
                    // fun_AddErrMesg(target, "ErrAmount", "小數點長度錯誤，最多" + Accuracy + "碼")

                    // return false;
                    Amount = parseFloat(String(Amount).substring(0, String(Amount).indexOf(".") + Accuracy + 1))//自動截斷
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

            if (target.id == "textBudgetAmount" && Amount == 0) {
                $(target).val("")//針對BudgetAmount 的特殊處理
            }
            else {
                $(target).val(fun_accountingformatNumberdelzero(Amount))
            }
            return true;
        }
        else {
            if (regNum(Amount, true)) {
                Amount = parseInt(Amount)
                $(target).val(fun_accountingformatNumberdelzero(Amount))
                return true;
            }
            else {
                fun_AddErrMesg(target, "ErrAmount", "數字輸入錯誤")
                return false;
            }
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
        val = accounting.formatNumber(val, 4)

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
}