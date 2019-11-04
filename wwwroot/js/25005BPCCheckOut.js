let P_CustomFlowKey = $('#P_CustomFlowKey').val();
let P_CurrentStep = $("#P_CurrentStep").val();

$(document).ready(function () {
    if ($("#P_Status").val() == 4) {
        ReadOnly();
    } else {
        PurchaseJudgment(P_CustomFlowKey)

        //=====================
        //Part1流程設定
        //=====================

        if ((P_CustomFlowKey == "BPC_P1_001" && P_CurrentStep == "2") || (P_CustomFlowKey == "BPC_P1_002" && P_CurrentStep == "2")
            || (P_CustomFlowKey == "BPC_P1_003" && P_CurrentStep == "2") || (P_CustomFlowKey == "BPC_P1_004" && P_CurrentStep == "2")) {
            fn_DepManger(P_CustomFlowKey);
        }

        if ((P_CustomFlowKey == "BPC_P1_002" && P_CurrentStep == "3") || (P_CustomFlowKey == "BPC_P1_003" && P_CurrentStep == "3")
            || (P_CustomFlowKey == "BPC_P1_004" && P_CurrentStep == "3")) {
            fn_DepGeneralAffairs();
        }
        if ((P_CustomFlowKey == "BPC_P1_002" && P_CurrentStep == "4") || (P_CustomFlowKey == "BPC_P1_003" && P_CurrentStep == "4")
           || (P_CustomFlowKey == "BPC_P1_004" && P_CurrentStep == "4")) {
            fn_DepManger(P_CustomFlowKey);
        }

        if ((P_CustomFlowKey == "BPC_P1_002" && P_CurrentStep == "5") || (P_CustomFlowKey == "BPC_P1_003" && P_CurrentStep == "5")
           || (P_CustomFlowKey == "BPC_P1_004" && P_CurrentStep == "5")) {
            fn_DepManger(P_CustomFlowKey);
        }

        if (P_CustomFlowKey == "BPC_P1_004" && P_CurrentStep == "6") {
            fn_DepGeneralAffairs(P_CustomFlowKey);
        }

        if (P_CustomFlowKey == "BPC_P1_004" && P_CurrentStep == "7") {
            fn_DepManger(P_CustomFlowKey);
        }

        if (P_CustomFlowKey == "BPC_P1_004" && P_CurrentStep == "8") {
            fn_DepManger(P_CustomFlowKey);
        }
        

        if ((P_CustomFlowKey == "BPC_P2_001" && P_CurrentStep == "1") || (P_CustomFlowKey == "BPC_P2_002" && P_CurrentStep == "1")
          || (P_CustomFlowKey == "BPC_P2_003" && P_CurrentStep == "1") || (P_CustomFlowKey == "BPC_P2_004" && P_CurrentStep == "1")
           || (P_CustomFlowKey == "BPC_P2_005" && P_CurrentStep == "1") || (P_CustomFlowKey == "BPC_P2_006" && P_CurrentStep == "1")
           || (P_CustomFlowKey == "BPC_P2_007" && P_CurrentStep == "1")) {
            fn_DepManger(P_CustomFlowKey); //採購經辦在請購資訊區的編輯權限請比照申請人單位主管
        }

        if ((P_CustomFlowKey == "BPC_P2_001" && P_CurrentStep == "2") || (P_CustomFlowKey == "BPC_P2_002" && P_CurrentStep == "2")
          || (P_CustomFlowKey == "BPC_P2_003" && P_CurrentStep == "2") || (P_CustomFlowKey == "BPC_P2_004" && P_CurrentStep == "2")
           || (P_CustomFlowKey == "BPC_P2_005" && P_CurrentStep == "2") || (P_CustomFlowKey == "BPC_P2_006" && P_CurrentStep == "2")
           || (P_CustomFlowKey == "BPC_P2_007" && P_CurrentStep == "2")) {
            fn_DepMangerGeneralAffairs(P_CustomFlowKey)
        }

        if ((P_CustomFlowKey == "BPC_P2_001" && P_CurrentStep == "3") || (P_CustomFlowKey == "BPC_P2_002" && P_CurrentStep == "3")
          || (P_CustomFlowKey == "BPC_P2_003" && P_CurrentStep == "3") || (P_CustomFlowKey == "BPC_P2_004" && P_CurrentStep == "3")
           || (P_CustomFlowKey == "BPC_P2_005" && P_CurrentStep == "3") || (P_CustomFlowKey == "BPC_P2_006" && P_CurrentStep == "3")
           || (P_CustomFlowKey == "BPC_P2_007" && P_CurrentStep == "3")) {
            fn_DepMangerGeneralAffairs(P_CustomFlowKey)
        }

        if ((P_CustomFlowKey == "BPC_P2_005" && P_CurrentStep == "4") || (P_CustomFlowKey == "BPC_P2_006" && P_CurrentStep == "4")
           || (P_CustomFlowKey == "BPC_P2_007" && P_CurrentStep == "4")) {
            fn_DepMangerGeneralAffairs(P_CustomFlowKey)
        }

        if ((P_CustomFlowKey == "BPC_P2_005" && P_CurrentStep == "5") || (P_CustomFlowKey == "BPC_P2_006" && P_CurrentStep == "5")
          || (P_CustomFlowKey == "BPC_P2_007" && P_CurrentStep == "5")) {
            fn_DepMangerGeneralAffairs(P_CustomFlowKey)
        }

        if ((P_CustomFlowKey == "BPC_P2_005" && P_CurrentStep == "6") || (P_CustomFlowKey == "BPC_P2_006" && P_CurrentStep == "6")
           || (P_CustomFlowKey == "BPC_P2_007" && P_CurrentStep == "6")) {
            fn_DepMangerGeneralAffairs(P_CustomFlowKey)//總經理是什麼層級
        }

        if (P_CustomFlowKey == "BPC_P2_007" && P_CurrentStep == "7") {
            fn_DepMangerGeneralAffairs(P_CustomFlowKey)
        }

        if (P_CustomFlowKey == "BPC_P2_007" && P_CurrentStep == "8") {
            fn_DepMangerGeneralAffairs(P_CustomFlowKey)
        }

        if (P_CustomFlowKey == "BPC_P2_007" && P_CurrentStep == "9") {
            fn_DepMangerGeneralAffairs(P_CustomFlowKey)
        }

        //====================
        //Part3流程設定
        //====================
        if (P_CustomFlowKey == "BPC_P3_001" && P_CurrentStep == "1") fn_DepMangerPurchase(P_CustomFlowKey)
        if (P_CustomFlowKey == "BPC_P3_001" && P_CurrentStep == "2") fn_DepMangerGeneralAffairs(P_CustomFlowKey)
        if (P_CustomFlowKey == "BPC_P3_001" && P_CurrentStep == "3") fn_DepMangerGeneralAffairs(P_CustomFlowKey)
    }
});
function InitialSet() {
}

//====================================================================================
//型別一、請購單位主管、資訊單位-經辦、資訊單位-主管、業管單位-經辦、業管單位-主管
//====================================================================================

function fn_DepManger(P_CustomFlowKey) {
    if ($("#textPRamount").val() == 0) {
        $("#textPRamount").val("");
    }
    if (String(P_CustomFlowKey).indexOf("BPC_P1") > -1 && P_CurrentStep == "1") {
        $("#hidSubject").remove();
        $("#txtSubject").remove();
        $("#hidDescription").remove();
        $("#txtDescription").remove();
    } else {
        $("#Subject").remove();
        $("#hidSubject").hide();
        $("#Description").remove();
        $("#hidDescription").hide();
    }

    $('input[name="IsEncryption"]').prop("disabled", true);//是否密件

    $('#DecryptionDate').prop("readonly", true);    //解密日期
    $('#txtDecryptionDate').find('input').addClass('input-disable') //解密日期
    $('#txtDecryptionDate').find('span').addClass('input-disable') //解密日期

    $('.ContractStartDateInput').find('input').addClass('input-disable').attr('readonly', true)//報價起
    $('.ContractStartDateInput').find('span').addClass('input-disable')//報價起

    $('.ContractEndDateInput').find('input').addClass('input-disable').attr('readonly', true)//報價迄
    $('.ContractEndDateInput').find('span').addClass('input-disable')//報價迄

    if ($("#HaveYearlyContract").is(":checked")) {//勾年度議價協議 判斷報價起迄開啟或關閉////////////
        $('.ContractStartDateInput').find('input').removeClass('input-disable').attr('readonly', false)
        $('.ContractStartDateInput').find('span').removeClass('input-disable')

        $('.ContractEndDateInput').find('input').removeClass('input-disable').attr('readonly', false)
        $('.ContractEndDateInput').find('span').removeClass('input-disable')
    } else {
        $('.ContractStartDateInput').find('input').addClass('input-disable').attr('readonly', true)
        $('.ContractStartDateInput').find('span').addClass('input-disable')

        $('.ContractEndDateInput').find('input').addClass('input-disable').attr('readonly', true)
        $('.ContractEndDateInput').find('span').addClass('input-disable')
    }

    $('#chk3Citem').prop("disabled", true);//資訊產品
    $('#chkContract').prop("disabled", true);//有合約
    $('#chkCore').prop("disabled", true);//核心業務委外

    if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && String(P_CurrentStep).indexOf("1") > -1 && $("P_Status").val() != 4)
        $("input[name='PurchasePriceStardandDescription']").removeAttr("readonly");

    $('#Price').each(function () { //報價單價
        $(this).prop("readonly", false)
    })
    $('#ApportionmentDetailTable').find('tr').each(function () {
        $(this).find('td:eq(4)').find('input').prop("readonly", false)
    })
}

//====================================================================================
//型別二、資訊單位-總務、業管單位-總務、加會單位-總務、加會單位-經辦、加會單位-主管
//====================================================================================

function fn_DepGeneralAffairs(P_CustomFlowKey) {
    ReadOnly();

    PurchaseJudgment(P_CustomFlowKey)
}

//====================================================================================
//型別三、管理處-採購覆核、總經理室總務、總經理室經辦、董事長室總務、董事長室經辦、
//      決行主管、決行後-管理處採購覆核、發票管理人
//===================================================================================
function fn_DepMangerGeneralAffairs(P_CustomFlowKey) {
    ReadOnly();
    //Excel上傳合約明細
}

//====================================================================================
//型別四、決行後-管理處採購
//===================================================================================
function fn_DepMangerPurchase(P_CustomFlowKey) {
    ReadOnly();
    //Excel上傳合約明細
    $("NegotiationPrice").prop("readonly", false)

    $('#ApportionmentDetailTable').find('tr').each(function (index) {
        if (index != 0) {
            //議價單價
            // $(this).find('td:eq(5)').find("input").attr("class", "input h30");
            if ($("#HaveYearlyContract").prop("checked")) {
                $(this).find('td:eq(5)').find("input").removeClass("input").attr("style", "border:0;min-height:30px;").attr("readonly",true);//預算金額
                $(this).find('td:eq(5)').find("input").next("div").remove();
            }
            else {
                $(this).find('td:eq(5)').find("input").attr("class", "input h30");
                $(this).find('td:eq(5)').find("input").next("div").remove();
            }
        }
    })
    $('.area-btn-right-1').show();
    PurchaseJudgment(P_CustomFlowKey)
}

//====================================================================================
//型別五、管理處-採購
//===================================================================================
function fn_DepAdmPurchase(P_CustomFlowKey) {
    $("#Subject").remove();
    $("#Description").remove();

    $('input[name="IsEncryption"]').prop("disabled", true);//是否密件

    $('#DecryptionDate').prop("readonly", true);//密件日期

    $('#txtDecryptionDate').find('input').addClass('input-disable')//密件日期
    $('#txtDecryptionDate').find('span').addClass('input-disable')//密件日期
    $('#chk3Citem').prop("disabled", true);//資訊產品
    $('#chkContract').prop("disabled", true);//是否有合約
    $('#chkCore').prop("disabled", true);//核心委外

    if ($("#HaveYearlyContract").is(":checked")) {//勾年度議價協議 判斷報價起迄開啟或關閉
        $('.ContractStartDateInput').find('input').removeClass('input-disable').attr('readonly', false)
        $('.ContractStartDateInput').find('span').removeClass('input-disable')

        $('.ContractEndDateInput').find('input').removeClass('input-disable').attr('readonly', false)
        $('.ContractEndDateInput').find('span').removeClass('input-disable')
    } else {
        $('.ContractStartDateInput').find('input').addClass('input-disable').attr('readonly', true)
        $('.ContractStartDateInput').find('span').addClass('input-disable')

        $('.ContractEndDateInput').find('input').addClass('input-disable').attr('readonly', false)
        $('.ContractEndDateInput').find('span').addClass('input-disable')
    }

    $('input[name="HaveQuoteForm"]').prop("disabled", true);//報價單
    $('#textPRamount').prop("readonly", true).removeClass("input").attr("style", "border:0;min-height:30px;");//預算金額
    $('#ApportionmentDetailTable').find('tr').each(function (index) {
        if (index != 0) {
            //議價單價
            targetContext = $(this).find('td:eq(5)').find("input").val();
            FieldControl($(this).find('td:eq(5)').find("input"), targetContext, null);
        }
    })

    PurchaseJudgment(P_CustomFlowKey)

    //Excel上傳合約明細
}

//====================================================================================
//欄位全部鎖定
//====================================================================================

function ReadOnly() {
    //請購資訊區
    if ($("#textPRamount").val() == 0) {
        $("#textPRamount").val("");
    }
    $("#Subject").remove();
    $("#Description").remove();

    $('input[name="IsEncryption"]').prop("readonly", true);//是否解密
    $('input[name="IsEncryption"]').prop("disabled", true);
    $('#DecryptionDate').prop("readonly", true);//解密日期

    $('#txtDecryptionDate').find('input').addClass('input-disable')//解密日期
    $('#txtDecryptionDate').find('span').addClass('input-disable')//解密日期

    $('#chk3Citem').prop("disabled", true);//資訊產品
    $('#chkConsultant').prop("disabled", true);//是否聘用顧問類交易
    $('#chkContract').prop("disabled", true);//是否有合約
    $('#chkCore').prop("disabled", true);//是否核心委外

    $('#HaveYearlyContract').prop("disabled", true);//屬年度議價協議
    $('.ContractStartDateInput').find('input').addClass('input-disable').attr('readonly', true)//報價起
    $('#ContractStartDate').removeClass("input").addClass('input input-disable');

    $('.ContractStartDateInput').find('span').addClass('input-disable')

    $('.ContractEndDateInput').find('input').addClass('input-disable').attr('readonly', true)//報價迄
    $("#ContractEndDate").removeClass("input").addClass('input input-disable');
    $('.ContractEndDateInput').find('span').addClass('input-disable')

    $('input[name="HaveQuoteForm"]').prop("disabled", true);//是否有報價單
    $("#textPRamount").prop("readonly", true).removeClass("input").attr("style", "border:0;min-height:30px;");//預算金額

    $('input[name="IsNewSupplier"]').prop("readonly", true);//是否新供應商
    $('input[name="IsNewSupplier"]').prop("disabled", true);//是否新供應商

    FieldControl($('#CurrencyCode'), $('#CurrencyCode option:selected').text(), $('#CurrencyCode option:selected').val(), null);

    FieldControl($('#PurchaseEmpNum'), $('#PurchaseEmpNum option:selected').text(), $('#PurchaseEmpNum option:selected').val(), null);
    var purchaseempnum = $('#PurchaseEmpNum').val();
    var purchaeempname= $("#PurchaseEmpNum").next(".disable-text").text()
    $("#PurchaseEmpNum").next(".disable-text").text(purchaeempname + "(" + purchaseempnum + ")");

    FieldControl($('input[name=PurchasePriceStardandDescription]'), $('input[name=PurchasePriceStardandDescription]').val(), $('input[name=PurchasePriceStardandDescription]').val())
    FieldControl($("input[name=QuoteAmount]"), $("input[name=QuoteAmount]").val(), accounting.unformat($("input[name=QuoteAmount]").val()))

    $('.area-btn-right-1').hide();
    $('.glyphicon-remove').remove();
    $('#ApportionmentQuoteDetailTable').find('tr').each(function () {//報價清冊
        $(this).find('#SuppliesOpen').prev('span').removeClass().addClass('disable-text');
        $(this).find('#SuppliesOpen').attr('style', 'display:none');
        $(this).find('th').eq(6).remove();//表頭增加欄
        $(this).find('td').eq(6).remove()//刪除欄
    })

    $('#ApportionmentDetailTable').find('tr').each(function (index) {
        $(this).find('th').eq(6).remove();//表頭增加欄

        if (index != 0) {
            //採購分類
            targetName = $(this).find('td:eq(1)').find("select").attr("id");
            targetContext = $(this).find('td:eq(1)').find("select").find("option:selected").text();
            targetvalue = $(this).find('td:eq(1)').find("select").find("option:selected").val();
            FieldControl($("#" + targetName), targetContext, targetvalue);
            //單位
            targetName = $(this).find('td:eq(3)').find("select").attr("id");
            targetContext = $(this).find('td:eq(3)').find("select").find("option:selected").text();
            targetvalue = $(this).find('td:eq(3)').find("select").find("option:selected").val();
            FieldControl($("#" + targetName), targetContext, targetvalue);

            //品名描述
            targetContext = $(this).find('td:eq(2)').find("input").val();
            FieldControl($(this).find('td:eq(2)').find("input"), targetContext, null);
            //報價單價
            targetContext = $(this).find('td:eq(4)').find("input").val();
            FieldControl($(this).find('td:eq(4)').find("input"), targetContext, null);
            //議價單價
            targetContext = $(this).find('td:eq(5)').find("input").val();

            if ($('#P_CustomFlowKey').val() == "BPC_P3_001" && $("#P_CurrentStep").val() == 1) {
                $(this).find('td').eq(6).remove()//刪除欄
                if ($(this).find('td:eq(5)').find("input").val() == 0) {
                    $(this).find('td:eq(5)').find("input").val("");
                    $(this).find('td:eq(5)').find("input").attr("readonly", false);
                }
            }
            else {
                FieldControl($(this).find('td:eq(5)').find("input"), targetContext, null);
                $(this).find('td').eq(6).remove()//刪除欄
            }
        }
    })

    $("#txtStakeHolderDescription").prop("readonly", true);//利害關係人說明

    $("#ContractTotalAmount").prop("readonly", true).removeClass("input").attr("style", "border:0;min-height:38px;")//報價金額合計

    //簽核層級
    FieldControl($("#PurchasePriceStardandId"), $('#PurchasePriceStardandId option:selected').text(), $('#PurchasePriceStardandId option:selected').val());
    //作業方式
    FieldControl($("#PurchaseSigningLevelId"), $('#PurchaseSigningLevelId option:selected').text(), $('#PurchaseSigningLevelId option:selected').val());

    $('#ApportionmentDetailTable tr').each(function (index, element) {// 合約申請明細增加與刪除
        $(this).find('.icon-plus bt-icon-size-1').remove();
        $(this).find('.icon-cross icon-remove-size').remove();
    })
}

//====================================================================================
//欄位全部開啟
//====================================================================================

function ReadOnlyOpen() {
    $("#MainForm :input,textarea").prop("readonly", false).attr("style", "border");
    $("#MainForm :checkbox,").prop("disabled", false);
    $("#MainForm :select,").removeAttr("disabled");
    $("#MainForm :radio,").prop("disabled", false);
}

function PurchaseJudgment(P_CustomFlowKey) {
    P_CurrentStep = $("#P_CurrentStep").val();

    var PageType = $("#HeadType").val();
    if (P_CustomFlowKey == "BPC_P3_001" && P_CurrentStep == "1" && !($("#HaveYearlyContract").prop("checked"))) {//決行後採購經辦編輯功能
        $('#ApportionmentDetailTable tr').not('[alt="hide"]').each(function (index, element) {
            $(this).find("td:eq(5)").find('input').removeAttr("readonly").removeAttr("style");//移除議價只可編輯
            $(this).find("td:eq(5)").find('input').eq(1).remove();
        });
    }

    if (P_CustomFlowKey == "BPC_P1_001")
        $("#box-area-4").parent(".section-box-area").hide();

    if (P_CustomFlowKey == "BPC_P2_001" && P_CurrentStep == "1") {
        $("#ContractTotalAmount").removeAttr("readonly");
        $("#PurchasePriceStardandId").prop("readonly", false)
        $("#PurchaseSigningLevelId").prop("readonly", false);

        $("#PurchasePriceStardandDescription").prop("readonly", true).removeClass("input").attr("style", "border:0;min-height:38px;");
        $("#box-area-4").parent(".section-box-area").show();
    }
    if (String(P_CustomFlowKey).indexOf("BPC_P3") > -1 && (PageType == "ReadOnly" || PageType == "CheckOut")) {
        $("#box-area-3").parent(".section-box-area").show();
        $("#box-area-4").parent(".section-box-area").show();
    }
    if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 || String(P_CustomFlowKey).indexOf("BPC_P3") > -1) {
        $("#PurcahsePriceMust").removeAttr("style").attr("style", "color:#ff7373");
    }

    if ($("#P_Status").val() == 4) {
        $("#Subject").remove();
        $("#hidSubject").hide();
        $("#Description").remove();
        $("#hidDescription").hide();
        ReadOnly();

        $("#ContractTotalAmount").prop("readonly", true).removeClass("input").attr("style", "border:0;min-height:38px;");

        FieldControl($("#PurchasePriceStardandId"), $('#PurchasePriceStardandId option:selected').text(), $('#PurchasePriceStardandId option:selected').val());
        FieldControl($("#PurchaseSigningLevelId"), $('#PurchaseSigningLevelId option:selected').text(), $('#PurchaseSigningLevelId option:selected').val());
        if ($("input[name=PurchasePriceStardandDescription]").val().length == 0) {
            $("input[name=PurchasePriceStardandDescription]").removeAttr("placeholder");
        }
        $("input[name='PurchasePriceStardandDescription']").prop("readonly", true).removeClass("input").attr("style", "border:0;min-height:38px;");
        $('#ApportionmentDetailTable').find('th:eq(6)').attr("style", "display:none");
        $('#ApportionmentDetailTable tr').find('td:eq(6)').each(function () {
            $(this).attr("style", "display:none");
        })
        $("#ApportionmentQuoteDetailTable").find('th:eq(6)').remove();

        $('#ApportionmentQuoteDetailTable').find('tr').each(function () {
            $(this).find("td:eq(6)").attr("style", "display:none");
        })
    } else {
        if (String(P_CustomFlowKey).indexOf("BPC_P1") > -1 && P_CurrentStep == "1") {
            $("#hidSubject").remove();
            $("#txtSubject").remove();
            $("#hidDescription").remove();
            $("#txtDescription").remove();
        } else {
            $("#Subject").remove();
            $("#hidSubject").hide();
            $("#Description").remove();
            $("#hidDescription").hide();
        }
    }
}

//欄位唯讀
function FieldControl(target, context, value) {
    tagName = $(target)[0].tagName
    targetName = $(target).attr("name");
    inTable = $(target).parents('table').length > 0 ? true : false;
    if (inTable) {
        switch (tagName) {
            case "SELECT":
                $(target).after("<div>" + context + "</div>");

                $(target).after("<input type='text' name= " + targetName + " value = " + value + " style='display:none' />");
                $(target).remove();
                break;
            case "INPUT":

                if (String(targetName).substr(22, 5).indexOf("Price") > -1 || String(targetName).substr(23, 5).indexOf("Price") > -1 || String(targetName).substr(24, 5).indexOf("Price") > -1
              || String(targetName).substr(22, 16).indexOf("NegotiationPrice") > -1
              || String(targetName).substr(23, 16).indexOf("NegotiationPrice") > -1
                | String(targetName).substr(24, 16).indexOf("NegotiationPrice") > -1) {
                    if (!isNaN(context)) {
                        context = fun_accountingformatNumberdelzero(context)
                        if (context == 0) {
                            context = "";
                        }
                    }
                }

                $(target).attr("style", "display:none");
                $(target).after("<div >" + context + "</div>");
                $(target).after("<input type='text' name= " + targetName + " value = '" + context + "' style='display:none' />");
                break;
            default:
        }
    }
    else {
        switch (tagName) {
            case "SELECT":
                $(target).after("<div class='disable-text' >" + context + "</div>");
                $(target).after("<input type='text' id= " + targetName + " value = " + value + " style='display:none' />");
                $("select[name=" + targetName + "]").parent("div").removeClass();
                $("[data-id=" + targetName + "]").remove();
                $("select[name=" + targetName + "]").remove();
                break;
            case "INPUT":
                $(target).after("<div class='disable-text'>" + context + "</div>");
                if (value == "") {
                    $(target).after("<input type='text' id= " + targetName + " style='display:none' />");
                }
                else {
                    $(target).after("<input type='text' id= " + targetName + " value = " + value + " style='display:none' />");
                }

                $("input[name=" + targetName + "]").remove();
                break;
            default:
        }
    }
}