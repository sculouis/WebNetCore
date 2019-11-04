let YnSalesDept;
let SalesDeptNo;
let LoginEno = $("#LoginEno").val().trim();
let ApplicantEmpNum = $("input[name=ApplicantEmpNum]").val().trim();
let ContractTotalAmountFlag = 0;
let PPSOnChange = 0;
let PPLOnchange = 0;
let PPSDefSelectValue = 0;
let PPSChangeSlectValue = 0;
let ChangeState = 0;
let ButtonName;
let hidPPSid = 0;
let btnSubmit = 0;//按下退回鈕
let btnConfirm = 0;

let YNStockholder = false;

let PurchaseSigningLevelIddata =
                   [
                  { key: "1", txt: "管理處科長" },
                  { key: "2", txt: "管理處副理" },
                  { key: "3", txt: "管理處經理" },
                  { key: "4", txt: "管理處處主管" },
                  { key: "5", txt: "執行副總" },
                  { key: "6", txt: "總經理" },
                  { key: "7", txt: "董事長" },
                  { key: "8", txt: "董事會" }
                   ]
var PSLObject = {};
var PPSObject = {};
for (var j = 0; j < PurchaseSigningLevelIddata.length; j++) {
    PSLObject[PurchaseSigningLevelIddata[j].key] = PurchaseSigningLevelIddata[j].txt;
}

let PurchasePriceStardandIddata = [
                  { key: "1", txt: "議價" },
                  { key: "2", txt: "比價" },
                  { key: "3", txt: "招標" }
]
for (var i = 0; i < PurchasePriceStardandIddata.length; i++) {
    PPSObject[PurchasePriceStardandIddata[i].key] = PurchasePriceStardandIddata[i].txt;
}

$(document).ready(function () {
    let P_CustomFlowKey = $('#P_CustomFlowKey').val();  //"BPC_P1-002";
    let P_CurrentStep = $("#P_CurrentStep").val();
    getSaleDep();
    getSaleDepNo();

    if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && String(P_CurrentStep).indexOf("1") > -1) {
        juify();
        fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
    }

    $("#ExchangeRateDef").text(parseFloat($("#ExchangeRateDef").text()))
    $(document).on('blur', '#Subject', function () {
        fun_RemoveErrMesg($("#Subject"), "BPCSubjectErr", "")
        if ($('#Subject').val() != '') {
            fun_RemoveErrMesg($("#Subject"), "BPCSubjectErr", "")
        }
    });
    $(document).on('blur', '#Description', function () {
        fun_RemoveErrMesg($("#Subject"), "BPCSubjectErr", "")
        if ($('#Description').val() != '') {
            fun_RemoveErrMesg($("#Description"), "BPCDescriptionErr", "")
        }
    });

    $(document).on("click", '.function-btn', function () {
        if ($(this).text() == "傳送") {
            btnReturn = 1;
        } else {
            btnReturn = 0;
        }
    })

    $('[data-remodal-id=modal-sent]').on('click', '.remodal-confirm-btn', function () {
        if ($(this).text() == "確認") {
            btnConfirm = 1;
            if (btnReturn == 1) {
            } else {
            }
        } else {
            btnConfirm = 0;
        }
    })

    $(document).on('click', '#SearchEengine', function () {
        fun_PopAddDepartmentSearch($('#inpSearchtext'));
    });
    $(document).on('click', '#PopAddDepartmentSearch', function () {
        fun_PopAddDepartmentSearch($('#inpSearchtext'))
    });
    $(document).on('onfocus', '#inpSearchtext', function () {
        $("#inpSearchtext").searchBoxHide();
    });
    $(document).on('click', '#popAddDepartment', function () {
        $('[data-remodal-id=modal-add-department]').remodal().open();
    });

    $(document).on('click', '#suppliesSearchConfirm', function () {
        fun_popSuppliesSearch();
    });
    $(document).on('click', '#suppliesSearchCancel', function () {
        fun_popSuppliesClear();
    });

    $(document).on('onchange', '.ContractStartDate', function () {
        $('input:hidden[name="ContractStartDate"]').val($(this).val);
    });

    $(document).on('onchange', '.ContractEndDate', function () {
        $('input:hidden[name="ContractEndDate"]').val($(this).val);
    });
    $("#PurchaseEmpNum").change(function () {
        if ($('[alt=PurchaseEmpNumErr]').length > 0) {
            $('[alt=PurchaseEmpNumErr]').remove();
            $('[alt=InvoiceEmpNameErr]').remove();
        }

        var PurchaseEmpNum = $("#PurchaseEmpNum option:selected").val()
        var PurchaseEmpName = $("#PurchaseEmpNum option:selected").text()
        $('input:hidden[name="PurchaseEmpNum"]').val(PurchaseEmpNum);
        $('input:hidden[name="PurchaseEmpName"]').val(PurchaseEmpName);
        ChangeNextEmp($('#P_CustomFlowKey').val(), $("#P_CurrentStep").val());
        var datas = [{ user_id: null, user_name: null }];
        datas[0].user_id = PurchaseEmpNum;
        datas[0].user_name = PurchaseEmpName;
        BPCQueryTemp(datas)
    });

    $(document).on('blur', '#ContractTotalAmount', function () {
        fn_isStockholder();
        $("[alt='PPSErr']").remove();
        var P_CustomFlowKey = $('#P_CustomFlowKey').val();
        var P_CurrentStep = $("#P_CurrentStep").val();

        ChangeState = 1;
        PPSDefSelectValue = 0;
        PPSChangeSlectValue = 0;
        var P_Status = $("#P_Status").val();

        if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && P_CurrentStep == "1" && P_Status != 4) {
            stockholder = YNStockholder;//確認是否利害關係人
            if ($("#ContractTotalAmount").val() != "0") {
                EnableDOMObject("#PurchaseSigningLevelId");
                EnableDOMObject("#PurchasePriceStardandId");
            } else {
                $("#PurchaseSigningLevelId").addClass('input-disable');
                $("#PurchaseSigningLevelId").attr('disabled', 'disabled');
                $("#PurchaseSigningLevelId").val("");
                $("#PurchaseSigningLevelId").selectpicker('refresh');
                $("#PurchasePriceStardandId").addClass('input-disable');
                $("#PurchasePriceStardandId").attr('disabled', 'disabled');
                $("#PurchasePriceStardandId").val("");
                $("#PurchasePriceStardandId").selectpicker('refresh');
                ChangeState = 0;
                $("#hidPurchasePriceStardandId").val(0);
                hidPPSid = 0;
            }
        }

        fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")

        var P_CustomFlowKey = $('#P_CustomFlowKey').val();  //"BPC_P1-002";
        var P_CurrentStep = $("#P_CurrentStep").val();
        var PageType = $("#HeadType").val();

        var ConsultantValue = $('#chkConsultant').is(":checked") == true ? true : false;

        if (isNaN(accounting.unformat(($(this).val())))) {
            $(this).val(0)
        }
        else $(this).val(accounting.unformat(($(this).val())));
        var Amount = accounting.unformat($(this).val());

        if (Amount == 0) {
            $("#PurchaseSigningLevelId").val('');
            $("#PurchasePriceStardandId").val('');
            DisableDOMObject($("#PurchaseSigningLevelId"));
            DisableDOMObject($("#PurchasePriceStardandId"));
            fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "");
            if (P_CustomFlowKey == "BPC_P3_001" && P_CurrentStep == "1") {
                ContractTotalAmountFlag = -1
                //  fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
                $('#ContractTotalAmount').val("")
            }
            else {
                ContractTotalAmountFlag = 0;
                fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
            }
        }
        else {
            ContractTotalAmountFlag = 0;
            fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
        }

        //無勾選聘用僱問 無利害關係人
        if (ConsultantValue == false && stockholder == false) {
            if (!regNumZero(Amount, false)) {
                // fun_AddErrMesg($(this), "ContractTotalAmountErr", "金額不可為0")
                $('#ContractTotalAmount').val("")
            }
            else {
                if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && P_CurrentStep == "1" && PageType == "CheckOut") {
                    fun_PSLevelSet1(Amount);
                }
            }
        }

        //有勾選聘用僱問 無利害關係人
        if (ConsultantValue == true && stockholder == false) {
            if (!regNumZero(Amount, false)) {
                //  fun_AddErrMesg($(this), "ContractTotalAmountErr", "金額不可為0")
                $('#ContractTotalAmount').val("")
            }
            else {
                if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && P_CurrentStep == "1" && PageType == "CheckOut") {
                    fun_PSLevelSet2(Amount);
                }
            }
        }

        //無勾選聘用僱問 有利害關係人
        if (ConsultantValue == false && stockholder == true) {
            if (!regNumZero(Amount, false)) {
                //  fun_AddErrMesg($(this), "ContractTotalAmountErr", "金額不可為0")
                $('#ContractTotalAmount').val("")
            }
            else {
                if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && P_CurrentStep == "1" && PageType == "CheckOut") {
                    fun_PSLevelSet3(Amount);
                }
            }
            //fun_IsStockholder();
        }

        //有勾選聘用僱問 有利害關係人
        if (ConsultantValue == true && stockholder == true) {
            if (!regNumZero(Amount, false)) {
                //   fun_AddErrMesg($(this), "ContractTotalAmountErr", "金額不可為0")
                $('#ContractTotalAmount').val("")
            }
            else {
                if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && P_CurrentStep == "1" && PageType == "CheckOut") {
                    fun_PSLevelSet4(Amount);
                }
            }
        }
    });

    $('#selectDepartmentUnit').on('change', function () {
        fun_PopAddDepartmentSelectChange(this);
    });

    $('input[name="IsNewSupplier"]').change(function () {
        var checkedValue = $('input[name="IsNewSupplier"]:checked').val();
        if (checkedValue == 'on') {
            $("#isNewSupplierError").hide();
            $("#NewsupplieYes").show();
            $("#NewsupplieUpload").hide();
        }
        else {
            $("#NewsupplieUpload").show();
            $("#isNewSupplierError").hide();
            $("#NewsupplieYes").hide();
        }
    })

    $("#ContractTotalAmount").focus(function () {
        if ($("[alt=PRamountErr]").length > 0) {
            $("[alt=PRamountErr]").remove();
        }

        $(this).val(accounting.unformat($(this).val()));
        $(this).attr('maxlength', '11')

        //控制光標位置  *更改輸入框值後光標會移動到前面
        SelectionRange(this, this.value.length, this.value.length)
    })

    $("#textPRamount").focus(function () {
        if ($("[alt=PRamountErr]").length > 0) {
            $("[alt=PRamountErr]").remove();
        }

        //$(this).val(this.value.replace(/\,/g, ''));
        $(this).val(accounting.unformat($(this).val()));
        $(this).attr('maxlength', '11')

        //控制光標位置  *更改輸入框值後光標會移動到前面
        SelectionRange(this, this.value.length, this.value.length)
    })

    $(document).on('focus', '[alt=PriceType]', function () {
        $(this).attr('maxlength', '16')
        $('[alt="BPCPriceErr"]').remove();
        $('[alt="BPCNegotiationPriceErr"]').remove();

        if (!isNaN($(this).val)) {
            $(this).val(parseFloat(accounting.unformat($(this).val())));
        }

        if (!isNaN($(this).val()) && $(this).val() > 99999999999.9999) {
            fun_AddErrMesg($(this), "BPCPriceErr", "欄位金額超過上限");
        } else {
            $(this).val(parseFloat(accounting.unformat($(this).val())));
            if ($(this).val() == 0) {
                $(this).val("");
            }
        }
        //控制光標位置  *更改輸入框值後光標會移動到前面
        SelectionRange(this, this.value.length, this.value.length)
    })

    $(document).on('blur', '[alt=PriceType]', function () {
        $("#ApportionmentDetailTable tbody").find("tr").each(function () {
            if (accounting.unformat($(this).find("td").eq(5).find("input").val()) > accounting.unformat($(this).find("td").eq(4).find("input").val())) {
                $("#AlertMessage").html("議價單價不可大於報價單價");
                window.location.href = "#modal-added-info-2"
                $(this).find("td").eq(5).find("input").val("");
            }
        })
    })

    $(document).on('click', '#chkConsultant', function () {
        fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "");
        var P_CustomFlowKey = $('#P_CustomFlowKey').val();
        var P_CurrentStep = $("#P_CurrentStep").val();
        fun_Consultant($("#textPRamount"));

        fn_isStockholder();//重新判斷是否為利害關係人
        stockholder = YNStockholder;//重新賦與利害關係人值

        var ConsultantValue = $('#chkConsultant').is(":checked") == true ? true : false;
        var Amount = accounting.unformat($("#ContractTotalAmount").val());

        //採購經辦傳送時是合計報價是否為0 如為0不得傳送
        if (Amount == 0) {
            fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
            if (P_CustomFlowKey == "BPC_P3_001" && P_CurrentStep == "1") {
                ContractTotalAmountFlag = -1
                fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
            }
            else {
                ContractTotalAmountFlag = 0;
                fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
            }
        }
        else {
            ContractTotalAmountFlag = 0;
            fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
        }

        if ($('#chkConsultant').is(":checked")) {
            //無勾選聘用僱問 無利害關係人
            fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
            if (ConsultantValue == false && stockholder == false) {
                if (!regNumZero(Amount, false)) {
                    //  fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
                    $('#ContractTotalAmount').val("")
                }
                else {
                    fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                    fun_PSLevelSet1(Amount);
                }
            }

            //有勾選聘用僱問 無利害關係人
            if (ConsultantValue == true && stockholder == false) {
                fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                if (!regNumZero(Amount, false)) {
                    // fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
                    $('#ContractTotalAmount').val("")
                }
                else {
                    fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                    fun_PSLevelSet2(Amount);
                }
            }

            //無勾選聘用僱問 有利害關係人
            if (ConsultantValue == false && stockholder == true) {
                fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                if (!regNumZero(Amount, false)) {
                    // fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
                    $('#ContractTotalAmount').val("")
                }
                else {
                    fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                    fun_PSLevelSet3(Amount);
                }
                //fun_IsStockholder();
            }

            //有勾選聘用僱問 有利害關係人
            if (ConsultantValue == true && stockholder == true) {
                if (!regNumZero(Amount, false)) {
                    //  fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
                    $('#ContractTotalAmount').val("")
                }
                else {
                    fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                    fun_PSLevelSet4(Amount);
                }
            }
        }
        else
            fun_PRamountCheck($("#textPRamount"));

        //請採購程序判定區
        fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")

        fn_isStockholder();//重新判斷是否為利害關係人
        stockholder = YNStockholder;//重新賦與利害關係人值
        var Amount = accounting.unformat($("#ContractTotalAmount").val());
        if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && P_CurrentStep == "1") {
            Amount == 0 ? ContractTotalAmountFlag = -1 : ContractTotalAmountFlag = 0;
        }

        //無勾選聘用僱問 無利害關係人
        if (ConsultantValue == false && stockholder == false) {
            if (!regNumZero(Amount, false)) {
                //   fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
                $('#ContractTotalAmount').val("")
            }
            else {
                fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                fun_PSLevelSet1(Amount);
            }
        }

        //有勾選聘用僱問 無利害關係人
        if (ConsultantValue == true && stockholder == false) {
            if (!regNumZero(Amount, false)) {
                //  fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
                $('#ContractTotalAmount').val("")
            }
            else {
                fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                fun_PSLevelSet2(Amount);
            }
        }

        //無勾選聘用僱問 有利害關係人
        if (ConsultantValue == false && stockholder == true) {
            if (!regNumZero(Amount, false)) {
                //   fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
                $('#ContractTotalAmount').val("")
            }
            else {
                fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                fun_PSLevelSet3(Amount);
            }
            //fun_IsStockholder();
        }

        //有勾選聘用僱問 有利害關係人
        if (ConsultantValue == true && stockholder == true) {
            if (!regNumZero(Amount, false)) {
                // fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
                $('#ContractTotalAmount').val("")
            }
            else {
                fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                fun_PSLevelSet4(Amount);
            }
        }
    })

    $(document).on('blur', '#textPRamount', function () {
        if ($("#HeadType").val() == "ReadOnly") {
            return false;
        } else {
            if ($('#chkConsultant').is(":checked")) {
                fun_Consultant($("#textPRamount"));//有勾選聘用顧問
            }
            else
                fun_PRamountCheck(this);
        }
    })
    if ($("#HeadType").val() == "CheckOut") {
        if ($("#SuppliesOpen").prev("span").text().length == 0) {
            $("#IsStakeholders").text('');
        }
    }

    if (__QuoteAmount != 0) {
        setDefaultValue($("#ContractTotalAmount"), __ContractTotalAmount)
    }

    if (__ContractTotalAmount != 0) {
        setDefaultValue($("#textPRamount"), __textPRamount)
    }

    if (__textPRamount != 0) {
        setDefaultValue($("#textPRamount"), __textPRamount)
    }

    if (__PriceStandardId > 0) {
        setParity($("#divParity"), __PriceStandardId)
    }

    if (__SigningLevelId > 0) {
        setSignLv($("#divSignLv"), __SigningLevelId)
    }

    if (__PurchaseEmpNum != "") {
        setDefaultSelect($("#PurchaseEmpNum"), __PurchaseEmpNum)
    }

    if (__InvoiceEmpNum != "") {
        $("input[name=InvoiceEmpName]").val(__InvoiceEmpName);
        $("input[name=InvoiceEmpNum]").val(__InvoiceEmpNum);
        resetInvoiceEmp();
    }

    if (__CurrencyCode != "")

        setDefaultSelect($("#CurrencyCode"), __CurrencyCode)
    else
        setDefaultSelect($("#CurrencyCode"), "TWD")

    if (__PurchasePriceStardandId != "") {
        setDefaultSelect($("#PurchasePriceStardandId"), __PurchasePriceStardandId)
    }

    if (__PurchaseSigningLevelId != "") {
        setDefaultSelect($("#PurchaseSigningLevelId"), __PurchaseSigningLevelId)
    }

    if ($('#P_CustomFlowKey').val() == "BPC_P2_001" && $("#P_CurrentStep").val() == "1") {
        $("#ApportionmentQuoteDetailTable tbody").find("tr").each(function () {
            var tdtext = $(this).find("td:eq(1)").text().trim().length;
            if (tdtext != 0) {
                var value = $(this).find("td:eq(4)").find("input").val();
                if (value.toUpperCase() == "FALSE") {
                    $(this).find("td:eq(4)").find("input").val("否");
                }
                //$(this).find("td:eq(4)").find();
            }
        });
    }

    //是否新供應商判斷//2.不預設帶是OR否

    if (__IsNewSupplier == 'True') {
        $('input[name=IsNewSupplier][value=on]').prop('checked', true);
        $("#NewsupplieYes").show();
    }

    if (__IsNewSupplier == 'False') {
        $('input[name=IsNewSupplier][value=off]').prop('checked', true);
        $("#NewsupplieUpload").show();
    }

    //是否密件
    if (__IsEncryption != "" || __IsEncryption != undefined) {
        if (__IsEncryption == 'True') {
            $('input[name=IsEncryption][value=on]').prop('checked', true);
        }
        else {
            $('input[name=IsEncryption][value=off]').prop('checked', true);
        }
    }

    //是否報價單
    if (typeof (__HaveQuoteForm) == "undefined" || __HaveQuoteForm == "") {
    } else {
        if (__HaveQuoteForm == 'True') {
            $('input[name=HaveQuoteForm][value=on]').prop('checked', true);
            $("#Must").show();
        }
        else {
            $('input[name=HaveQuoteForm][value=off]').prop('checked', true);
            $("#Must").hide();
        }
    }

    if (__HaveYearlyContract == "True") {
        $("HaveYearlyContract").prop("checked", true);
    }
    function setParity(target, value) {
        switch (value) {
            case "1":
                $(target).text("議價");
                break;
            case "2":
                $(target).text("比價");
                break;
            case "3":
                $(target).text("招標");
                break;
            default:
                $(target).text("");
        }
    }

    function setSignLv(target, value) {
        switch (value) {
            case "1":
                $(target).text("管理處科長");
                break;
            case "2":
                $(target).text("管理處副理");
                break;
            case "3":
                $(target).text("管理處經理");
                break;
            case "4":
                $(target).text("管理處處主管");
                break;
            case "5":
                $(target).text("執行副總");
                break;
            case "6":
                $(target).text("總經理");
                break;
            case "7":
                $(target).text("董事長");
                break;
            case "8":
                $(target).text("董事會");
                break;
        }
    }

    function setDefaultValue(target, value) {
        $(target).val(fun_AddComma(value));
    }

    function setDefaultSelect(target, value) {
        $(target).find("option[value='" + value + "']").attr("selected", "selected")
        $(target).selectpicker('refresh');      
    }

    function setDefaultOption(target, valuedata) {
        if (valuedata == 'True') {
            $("#NewsupplieUpload").show();
            $('input[name=IsNewSupplier][value=on]').prop('checked', true);
        }
        else {
            $("#NewsupplieUpload").hide();
            $('input[name=IsNewSupplier][value=off]').prop('checked', true);
        }
    }

   

    function fun_PRamountCheck(target) {//請購資訊區的簽核層級
        if ($(target).val() == "") {
            $("#divParity").text("");
            $("#divParity").val("");
            $("#divSignLv").text("");
            $("#SigningLevelId").val("");
            return false;
        }
        var amount = accounting.unformat($(target).val()).toString();
        if (regNum(amount, false)) {
            if (amount == 0) {
                $("#divParity").text("");
                $("#divParity").val("");
                $("#divSignLv").text("");
                $("#SigningLevelId").val("");
            }
            if (amount < 5000000 && amount > 0) {
                $("#divParity").text("議價");
            }
            if (amount >= 5000000 && amount < 30000000) {
                $("#divParity").text("比價");
            }
            if (amount >= 30000000) {
                $("#divParity").text("招標");
            }

            if (amount < 20000 && amount > 0) {
                $("#divSignLv").text("管理處科長");
                $("#SigningLevelId").val(0);
            }
            if (amount >= 20000 && amount < 100000) {
                $("#divSignLv").text("管理處副理");
                $("#SigningLevelId").val(1);
            }
            if (amount >= 100000 && amount < 500000) {
                $("#divSignLv").text("管理處經理");
                $("SigningLevelId").val(2);
            }
            if (amount >= 500000 && amount < 3000000) {
                $("#divSignLv").text("管理處處主管")
                $("#SigningLevelId").val(3);
            }

            if (amount >= 3000000 && amount < 10000000) {
                $("#divSignLv").html("<p>執行副總</p>");
                $("#SigningLevelId").val(4);
            }
            if (amount >= 10000000 && amount < 50000000) {
                $("#divSignLv").html("<p>總經理</p>");
                $("#SigningLevelId").val(5);
            }
            if (amount >= 50000000 && amount < 300000000) {
                $("#divSignLv").html("<p>董事長</p>");
                $("#SigningLevelId").val(6);
            }
            if (amount >= 300000000) {
                $("#divSignLv").html("<p>董事會</p>");
                $("#SigningLevelId").val(7);
            }
            amount = fun_accountingformatNumberdelzero(amount)
            $(target).attr("maxlength", amount.length)
            $(target).val(amount);
        }
        else {
            $(target).val(0);//負數小數為零
            return false
        }
    }
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
            target.setSelectionRange(start, end);
        }
    }

    function fun_AddErrMesg(target, NewElementID, ErrMesg) {
        if ($("#" + NewElementID).length > 0) {
            $("#" + NewElementID).text(ErrMesg);
        }
        else {
            $(target).after('<div Errmsg="Y" alt="' + NewElementID + '" class="error-text"><span class="icon-error icon-error-size"></span>' + ErrMesg + '</div>')
        }
    }
    //數字驗證 *正值 得為0  小數點最多四位
    function regNum(target, hasfloat) {
        if (hasfloat) {
            reg = /^(([0-9]\.[0-9]{1,4})|([1-9][0-9]*\.[0-9]{1,4})|([1-9]\d*))$/
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
    //數字驗證 *正值 不得為0  小數點最多四位
    function regNumZero(target, hasfloat) {
        if (hasfloat) {
            reg = /^(([-9]\.[0-9]{1,4})|([1-9][0-9]*\.[0-9]{1,4})|([1-9]\d*))$/
        }
        else {
            reg = /^([1-9]\d*)$/
        }
        if (String(target).search(reg) == 0) {
            return true;
        }
        else {
            return false;
        }
    }

    //千分位
    function fun_AddComma(targetNum) {
        num = targetNum;
        reg = /(\d+)(\d{3})/
        while (reg.test(num)) {
            num = num.replace(reg, "$1,$2")
        }
        return num;
    }
    function fun_setSelectOption(target, data) {
        $.each(data, function (key, txt) {
            $(target).append($("<option></option>").attr("value", key).text(txt));
        })
        $(target).selectpicker('refresh');
    }

    function openModalSent() {
        var isValid = true;
        $('[alt="Required"]').each(function () {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).css({
                    "border": "1px solid red",
                    "background": "#FFCECE"
                });
            }
            else {
                $(this).css({
                    "border": "",
                    "background": ""
                });
            }
        });

        if (isValid == false)
            return false;
        else
            $("#textPRamount").val(accounting.unformat($("#textPRamount").val()));
        if ($("#textPRamount").val(accounting.unformat($("#textPRamount").val())) != 0) {
            if ($("#divParity").text() == '議價')
                $("#PriceStandardId").val("1");
            if ($("#divParity").text() == '比價')
                $("#PriceStandardId").val("2");
            if ($("#divParity").text() == '招標')
                $("#PriceStandardId").val("3");
            if ($("#divSignLv").text() == "管理處科長")
                $("#SigningLevelId").val("1");
            if ($("#divSignLv").text() == "管理處副理")
                $("#SigningLevelId").val("2");
            if ($("#divSignLv").text() == "管理處經理")
                $("#SigningLevelId").val("3");
            if ($("#divSignLv").text() == "管理處處主管")
                $("#SigningLevelId").val("4");
            if ($("#divSignLv").text() == "執行副總")
                $("#SigningLevelId").val("5");
            if ($("#divSignLv").text() == "總經理")
                $("#SigningLevelId").val("6");
            if ($("#divSignLv").text() == "董事長")
                $("#SigningLevelId").val("7");
            if ($("#divSignLv").text() == "董事會")
                $("#SigningLevelId").val("8");
        }
        else {
            $("#divParity").text("");
            $("#PriceStandardId").val("");
            $("#divSignLv").text("");
            $("#SigningLevelId").val("");
        }
    }

    function getSaleDep() {
        $.ajax({
            url: '/BPC/SalesDeptIdyGet',
            dataType: 'json',
            type: 'POST',
            data: { LoginEno: LoginEno },
            success: function (data, textStatus, jqXHR) {
                YnSalesDept = "false";
                if (data == true) YnSalesDept = "true";
                $("#hidYnSalesDept").val(YnSalesDept);
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    }

    function getSaleDepNo() {
        $.ajax({
            url: '/BPC/SalesDeptNobyById',
            dataType: 'json',
            async: false,
            type: 'POST',
            data: { ApplicantEmpNum: ApplicantEmpNum },
            success: function (data, textStatus, jqXHR) {
                if (data != null) {
                    SalesDeptNo = data;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    }
})

function draft() {
    blockPageForJBPMSend();
    var deferred = $.Deferred();
    $('[errmsg="Y"]').remove();
    var data = $("#MainForm").serializeObject();
    setValue();

    data.PriceStandardId = $("#PriceStandardId").val();
    data.SigningLevelId = $("#SigningLevelId").val();
    data.BudgetAmount = accounting.unformat(data.BudgetAmount);
    data.QuoteAmount = accounting.unformat(data.QuoteAmount);
    data.CurrencyName = $("#CurrencyCode option:selected").text().length == 0 ? $("input:hidden[name=CurrencyName]").val() : $("#CurrencyCode option:selected").text();
    data.Subject = $("input[name=Subject]").val();
    data.Description = $("textarea[name=Description]").val();
    data.ExchangeRate = $("#ExchangeRateDef").text().trim();
    var YnIsEncryption = $("input[name='IsEncryption']:checked").val();

    if (YnIsEncryption != undefined) {
        var val = YnIsEncryption.trim() == "on" ? true : false;
    }
    $("input[name='IsEncryption']").val(val);

    var YnHaveQuoteForm = $("input[name='HaveQuoteForm']:checked").val();

    if (typeof ($("input[name='HaveQuoteForm']:checked").val()) != 'undefined') {
        var val = YnHaveQuoteForm.trim() == "on" ? true : false;
        $("input[name='HaveQuoteForm']").val(val);
    }
    // $("input[name='HaveQuoteForm']").val(val);

    var IsInfomationProducts = $("#chk3Citem").prop("checked") == true ? true : false;
    data.IsInfomationProducts = IsInfomationProducts;

    var chkContract = $("#chkContract").prop("checked") == true ? true : false;
    data.HaveContract = chkContract;

    var chkCore = $("#chkCore").prop("checked") == true ? true : false;
    data.IsOutSourcing = chkCore;

    var chkConsultant = $("#chkConsultant").prop("checked") == true ? true : false;
    data.IsConsult = chkConsultant;

    var YnHaveYearlyContract = $("input[name='HaveYearlyContract']:checked").val();

    if (YnHaveYearlyContract != undefined) {
        var val = YnHaveYearlyContract.trim() == "true" ? true : false;
    }
    data.HaveYearlyContract = val;

    //是否為新供應商
    var isNewOption = $("input[name='IsNewSupplier']:checked").val();
    if (isNewOption == undefined) {
        data.IsNewSupplier = null;
    } else {
        if (isNewOption != undefined) {
            var val = isNewOption.trim() == "on" ? true : false;
        }
        $('input[name="IsNewSupplier"]').val(val);
        data.IsNewSupplier = $('input[name="IsNewSupplier"]').val();
    }

    $('#HaveYearlyContract').val(val);
    data.HaveQuoteForm = $('input[name="HaveQuoteForm"]').val();
    data.IsEncryption = $('input[name="IsEncryption"]').val();

    // data.IsNewSupplier = $('input[name="IsNewSupplier"]').val();
    data.DecryptionDate = $("input[name=DecryptionDate]").val();
    var _url = data.BpcNum ? '/BPC/Edit' : '/BPC/Create';

    $.ajax({
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: data,
        // async: false,
        success: function (data, textStatus, jqXHR) {
            if (data) {
                _formInfo.formGuid = data.CID;
                _formInfo.formNum = data.BpcNum;
                _formInfo.flag = true;
                deferred.resolve();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            _formInfo.flag = false;
            deferred.resolve();
        }
    });
    return deferred.promise();
}

function setValue() {
    if ($("#textPRamount").val(accounting.unformat($("#textPRamount").val())) != 0) {
        if ($("#divParity").text() == '議價')
            $("#PriceStandardId").val(1);
        if ($("#divParity").text() == '比價')
            $("#PriceStandardId").val(2);
        if ($("#divParity").text() == '招標')
            $("#PriceStandardId").val(3);
        if ($("#divSignLv").text() == "管理處科長")
            $("#SigningLevelId").val(1);
        if ($("#divSignLv").text() == "管理處副理")
            $("#SigningLevelId").val(2);
        if ($("#divSignLv").text() == "管理處經理")
            $("#SigningLevelId").val(3);
        if ($("#divSignLv").text() == "管理處處主管")
            $("#SigningLevelId").val(4);
        if ($("#divSignLv").text() == "執行副總")
            $("#SigningLevelId").val(5);
        if ($("#divSignLv").text() == "總經理")
            $("#SigningLevelId").val(6);
        if ($("#divSignLv").text() == "董事長")
            $("#SigningLevelId").val(7);
        if ($("#divSignLv").text() == "董事會")
            $("#SigningLevelId").val(8);
        if ($("#divSignLv").text() == "")
            $("#SigningLevelId").val(0);
    }
    else {
        if ($('#textPRamount').val() == "0" && ($('input[name="HaveQuoteForm"]:checked').val() == "false" || $('input[name="HaveQuoteForm"]:checked').val() == "off")) {
            $("#PriceStandardId").val("");
            $("#SigningLevelId").val("");
        }

        var cc = $('#chkConsultant').val();
        if ($('#textPRamount').val() == "0" && ($('input[name="HaveQuoteForm"]:checked').val() == "false" || $('input[name="HaveQuoteForm"]:checked').val() == "off") && ($('#chkConsultant').is(":checked"))) {
            $("#PriceStandardId").val("");
            $("#SigningLevelId").val("");
        }
    }

    $("input:hidden[name='CurrencyCode']").val($("#CurrencyCode option:selected").val());

    $("#PurchaseEmpNum").val($("#PurchaseEmpNum option:selected").val());
}

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

function regNumZero(target, hasfloat) {
    if (hasfloat) {
        reg = /^(([-9]\.[0-9]{1,4})|([1-9][0-9]*\.[0-9]{1,4})|([1-9]\d*))$/
    }
    else {
        reg = /^([1-9]\d*)$/
    }
    if (String(target).search(reg) == 0) {
        return true;
    }
    else {
        return false;
    }
}

function Verify() {
    var deferred = $.Deferred();
    var SubjectFlag = 0;
    var DescriptionFlag = 0;
    var textPRamountFlag = 0;
    var HaveQuoteFormcheckedFlag = 0;
    var ContractFlag = 0;
    var VenderFlag = 0;
    var ContractStartDateFlag = 0;
    var ContractEndDateFlag = 0;
    var PPSDescFlag = 0;
    var PurchaseEmpNumFlag = 0;
    var FileUploadFlag = 0;
    var InvoiceFlag = 0;
    var isStockholderFlag = 0;
    var isUploagFile = 0;
    var isNewSupplierFlag = 0;
    var isHaveQuoteFormNewSupplier = 0;
    var YnHaveQuoteForm = 0;//是否報價單

    var amount = accounting.unformat($("#textPRamount").val()).toString();
    $('[Errmsg=Y]').remove();

    var P_CustomFlowKey = $('#P_CustomFlowKey').val();  //"BPC_P1-002";
    var P_CurrentStep = $("#P_CurrentStep").val();

    if (String(P_CustomFlowKey).indexOf("BPC_P1") > -1 && P_CurrentStep == 1) {
        if ($.trim($("#Subject").val()) == '') {
            fun_AddErrMesg($("#Subject"), "BPCSubjectErr", "請購主旨不可空白");
            SubjectFlag = -1;
        }
        else {
            fun_RemoveErrMesg($("#Subject"), "BPCSubjectErr", "")
            SubjectFlag = 0;
        }
        if ($.trim($("#Description").val()) == '') {
            fun_AddErrMesg($("#Description"), "BPCDescriptionErr", "請購說明不可空白");
            DescriptionFlag = -1;
        }
        else {
            fun_RemoveErrMesg($("#Description"), "BPCSubjectErr", "")
            DescriptionFlag = 0;
        }
    }

    if ($("#QuoteFormText").is(':visible') === true) {
        var file = $('.fileList').find('.fileDetail').find('.fileName').text()
        if (file == "") {
            isUploagFile = -1;
            fun_AddErrMesg($(".dndregion").find('.row'), "unUploadErr", "請上傳檔案");
        }
        else {
            isUploagFile = 0;
            $('.unUploadErr').remove();
        }
    }

    //日期起
    var ContractStartDateLength = $('input[name="ContractStartDate"]').val().length;
    if ($('#HaveYearlyContract').is(":checked")) {
        fun_RemoveErrMesg($('#ContractStartDate'), "BPCContractStartDateErr", "")
        fun_RemoveErrMesg($('#ContractEndDate'), "BPCContractEndDateErr", "")

        if (ContractStartDateLength <= 0) {
            fun_AddErrMesg($('#ContractStartDate'), "BPCContractStartDateErr", "日期不可空白");
            ContractStartDateFlag = -1;
        }
        else {
            fun_RemoveErrMesg($('#ContractStartDate'), "BPCContractStartDateErr", "")
            ContractStartDateFlag = 0;
        }
    }
    //日期迄
    var ContractStartDateLength = $('input[name="ContractEndDate"]').val().length;
    if ($('#HaveYearlyContract').is(":checked")) {
        fun_RemoveErrMesg($('#ContractEndDate'), "BPCContractEndDateErr", "")
        fun_RemoveErrMesg($('#ContractEndDate'), "BPCContractEndDateErr", "")
        if (ContractStartDateLength <= 0) {
            fun_AddErrMesg($('#ContractEndDate'), "BPCContractEndDateErr", "日期不可空白");
            ContractEndDateFlag = -1;
        }
        else {
            fun_RemoveErrMesg($('#ContractEndDate'), "BPCContractEndDateErr", "")
            ContractEndDateFlag = 0;
        }
    }

    var HaveQuoteFormcheckedValue = $('input[name="HaveQuoteForm"]:checked').val()
    if (!(regNum(amount, false))) {
        fun_RemoveErrMesg($("#textPRamount"), "PRamountErr", "");
        fun_AddErrMesg($("#textPRamount"), "PRamountErr", "輸入數字不正確");
        textPRamountFlag = -1;
    }
    else {
        if ($("#textPRamount").val() == 0 && (HaveQuoteFormcheckedValue == "true" || HaveQuoteFormcheckedValue == "on")) {
            fun_RemoveErrMesg($('#textPRamount'), "PRamountErr", "");
            fun_AddErrMesg($("#textPRamount"), "PRamountErr", "請輸入大於0的數字");
            textPRamountFlag = -1;
        }
        else {
            fun_RemoveErrMesg($("#textPRamount"), "PRamountErr", "");
            textPRamountFlag = 0;
        }
    }

    var Amount = accounting.unformat($("#ContractTotalAmount").val());

    var ContractCount = $('#ApportionmentDetailTable tbody tr').length;
    var VenderCount = $('#ApportionmentQuoteDetailTable tbody tr').length;
    var VenderName = $('#ApportionmentQuoteDetailTable tbody tr').find("#SuppliesOpen").prev("span").text().length;

    if (String(P_CustomFlowKey).indexOf("BPC_P1") > -1 && P_CurrentStep >= "1") {
        if (ContractCount == 0) {
            fun_AddErrMesg($('#ApportionmentDetailTable'), "ApportionmentDetailTableErr", "請填寫合約申請明細區")
            ContractFlag = -1;
            return false;
        } else {
            fun_RemoveErrMesg($('#ApportionmentDetailTable'), "ApportionmentDetailTableErr", "")
            ContractFlag = 0;
        }
    }

    //判斷是否有選擇採購經辦
    PurchaseEmpNumFlag = $("#PurchaseEmpNum option:selected").val() == '' ? -1 : 0;

    if (PurchaseEmpNumFlag == -1)
        fun_AddErrMesg($("#PurchaseEmpNum"), "PurchaseEmpNumErr", "請選擇採購經辦");
    else
        $('#PurchaseEmpNumErr').remove();

    //判斷是否有發票管理人

    InvoiceFlag = $('input[name="InvoiceEmpName"]').val() == '' ? -1 : 0;
    if (InvoiceFlag == -1) {
        fun_AddErrMesg($("#invoiceLinks").next(".area-btn-right-1"), "InvoiceEmpNameErr", "請選擇發票管理人");
    }
    else
        $('#InvoiceEmpName').remove();

    //是否為供應商為必填欄位
    if (typeof ($("input[name='IsNewSupplier']:checked").val()) === "undefined") {
        $("#isNewSupplierError").show();
        isNewSupplierFlag = -1;
    }
    else {
        $("#isNewSupplierError").hide();
        isNewSupplierFlag = 0;
    }

    //是否報價單
    if (typeof ($("input[name='HaveQuoteForm']:checked").val()) === "undefined") {
        YnHaveQuoteForm = -1;
        $("#isQuoteFormError").show();
    }
    else {
        YnHaveQuoteForm = 0;
        $("#isQuoteFormError").hide();
    }

    if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && P_CurrentStep == "1") {
        var vendoerAry = [];
        $("#ApportionmentQuoteDetailTable tbody tr").each(function () {
            if ($(this).find('#SuppliesOpen').prev('span').text() == "") {
                vendoerAry.push("venderEmpty");
            }
        })
        fun_RemoveErrMesg($('#ApportionmentQuoteDetailTable'), "ApportionmentQuoteDetailTableErr", "")
        if (vendoerAry.indexOf("venderEmpty") > -1) {
            VenderFlag = -1;
            fun_AddErrMesg($('#ApportionmentQuoteDetailTable'), "ApportionmentQuoteDetailTableErr", "請填寫報價供應商資訊")
        }
        else {
            VenderFlag = 0;
            fun_RemoveErrMesg($('#ApportionmentQuoteDetailTable'), "ApportionmentQuoteDetailTableErr", "")
        }

        //採購經辦傳送時是合計報價是否為0 如為0不得傳送
        if (Amount == 0) {
            ContractTotalAmountFlag = -1;
            fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "請輸入大於0的數字")
        }
        else {
            ContractTotalAmountFlag = 0;
            fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
        }

        //變更作業方式時判斷更改作業方式需必填

        $("[alt=PPSErr]").remove();
        var valPurchasePriceStardandDescription = $.trim($("input[name='PurchasePriceStardandDescription']").val());

        if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && String(P_CurrentStep).indexOf("1") > -1 && $("P_Status").val() != 4)
            $("input[name='PurchasePriceStardandDescription']").removeAttr("readonly");

        if (PPSOnChange != 0) {
            if ($("input[name='PurchasePriceStardandDescription']").val().length == 0) {
                fun_AddErrMesg($("input[name='PurchasePriceStardandDescription']"), "PPSErr", "如更改系統判定之作業方式，請填寫原因");
                PPSDescFlag = -1
            }
        }
        else {
            PPSDescFlag = 0;
        }
    }

    var isHaveQuoteForm = $('input[name="HaveQuoteForm"]:checked').val();
    var IsNewSupplier = $('input[name="IsNewSupplier"]:checked').val();

    if (isHaveQuoteForm == 'on' && IsNewSupplier == 'off') {
        $("#AlertMessage").text("非本行供應商不得提供報價單，請先至供應商資料平台新增供應商");
        window.location.href = "#modal-added-info-2"
        $("#ResultArea").hide(200);
        isHaveQuoteFormNewSupplier = -1;
    }
    else
        isHaveQuoteFormNewSupplier = 0;

    if (P_CustomFlowKey.indexOf("BPC_P3") > -1 && P_CurrentStep >= "1") {
        if (ContractCount == 0) {
            alert("請填寫報價供應商資訊");
            return false;
        }
    }

    //==========================================
    // 合約申請明細區表格是否為空值
    //==========================================
    var selectcCategoryFlag = 0;//採購分類
    var selectcUomFlag = 0;//單位
    var ItemDescriptionFlag = 0;
    var PriceFlag = 0;
    var NegotiationPriceFlag = 0;
    var arrPriceFlag = [];
    var arrNegotiationPriceFlag = [];

    $('#ApportionmentDetailTable tr').not('[alt="hide"]').each(function (index, element) {
        var trPriceFlag = 0;
        var trNegotiationPriceFlag = 0;
        $(this).find('div.error-text').remove();
        fun_RemoveErrMesg($(this), "BPCCategoryErr", "");

        if (index != 0) {
            var selectvalueCategory = $(this).find("td:eq(1)").find("select").val();
            if (selectvalueCategory == '') {
                fun_AddErrMesg($(this).find("td:eq(1)").find('select'), "BPCCategoryErr", "採購分類不可空白");
                selectcCategoryFlag = -1;
            } else {
                fun_RemoveErrMesg($(this).find("td:eq(1)").find('select'), "BPCCategoryErr", "");
                selectcCategoryFlag = 0;
            }

            fun_RemoveErrMesg($(this), "BPCUomErr", "");
            var selectvalueUom = $(this).find("td:eq(3)").find('select').val();
            if (selectvalueUom == '') {
                fun_AddErrMesg($(this).find("td:eq(3)").find('select'), "BPCUomErr", "單位不可空白");
                selectcUomFlag = -1;
            } else {
                fun_RemoveErrMesg($(this).find("td:eq(3)").find('select'), "BPCUomErr", "");
                selectcUomFlag = 0;
            }
            //品名描述

            fun_RemoveErrMesg($(this), "BPCItemDescriptionErr", "");
            var selectvalueDescription = $(this).find("td:eq(2)").find('input').val();
            if ($.trim(selectvalueDescription) == '') {
                fun_AddErrMesg($(this).find("td:eq(2)").find('input'), "BPCItemDescriptionErr", "品名描述不可空白");
                ItemDescriptionFlag = -1;
            } else {
                fun_RemoveErrMesg($(this).find("td:eq(2)").find('input'), "BPCItemDescriptionErr", "");
                ItemDescriptionFlag = 0;
            }

            $('[alt=inputnecessary]').blur(function () {
                fun_RemoveErrMesg($(this), "BPCItemDescriptionErr", "");
                if (inputaValue = $('[alt=inputnecessary]').length == 0) {
                    fun_AddErrMesg($('[alt=inputnecessary]'), "BPCItemDescriptionErr", "品名描述不可空白");
                    ItemDescriptionFlag = -1;
                } else {
                    fun_RemoveErrMesg($('[alt=inputnecessary]'), "BPCItemDescriptionErr", "");
                    ItemDescriptionFlag = 0;
                }
            })

            //報價金額
            inputPrice = accounting.unformat($(this).find("td:eq(4)").find('input').val());//報價金額
            inputNegotiationPrice = accounting.unformat($(this).find("td:eq(5)").find('input').val());//議價金額
            if (inputPrice > 99999999999.9999) {
                fun_AddErrMesg($(this).find("td:eq(4)").find('input'), "BPCPriceErr", "欄位金額超過上限");
                trPriceFlag = -1
                arrPriceFlag[index] = trPriceFlag;
            } else {
                if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && P_CurrentStep == "1") {
                    if (inputPrice == 0) {
                        fun_AddErrMesg($(this).find("td:eq(4)").find('input'), "BPCPriceErr", "欄位金額不可為0");
                        trPriceFlag = -1
                        arrPriceFlag[index] = trPriceFlag;
                    } else {
                        if (inputNegotiationPrice > inputPrice) {
                            alert("議價單價不可大於報價單價")
                            trPriceFlag = -1
                            arrPriceFlag[index] = trPriceFlag;
                        }
                    }
                }
            }

            //議價金額
            if (String(P_CustomFlowKey).indexOf("BPC_P3") > -1 && P_CurrentStep == "1" && !($("#HaveYearlyContract").prop("checked"))) {
                if (!regNum(inputNegotiationPrice, true)) {
                    fun_AddErrMesg($(this).find("td:eq(5)").find('input'), "BPCNegotiationPriceErr", "欄位金額有誤");
                    trNegotiationPriceFlag = -1
                    arrNegotiationPriceFlag[index] = trNegotiationPriceFlag;
                }
                else {
                    if (inputNegotiationPrice == 0) {
                        fun_AddErrMesg($(this).find("td:eq(5)").find('input'), "BPCNegotiationPriceErr", "金額不可為0");
                        trNegotiationPriceFlag = -1
                        arrNegotiationPriceFlag[index] = trNegotiationPriceFlag;
                    }
                    else {
                        if (inputNegotiationPrice > inputPrice) {
                            alert("議價單價不可大於報價單價")
                            trNegotiationPriceFlag = -1
                            arrNegotiationPriceFlag[index] = trNegotiationPriceFlag;
                        }
                    }
                }
            }
        }
    });

    var aryisStockerholder = []
    $('#ApportionmentQuoteDetailTable tbody tr').not('[alt="hide"]').each(function (index) {
        $(this).find('div.error-text').remove();

        var isDelete = $(this).find("td:eq(6)").find("input").val();
        var isstockholer = $(this).find("#IsStakeholders").text();
        var txtStockerholder = $(this).find("td:eq(5)").find("input").val();
        if (isDelete == "False" || isDelete == "") {
            if (isstockholer == "是" && txtStockerholder == "") {
                aryisStockerholder.push("-1");
                fun_AddErrMesg($(this).find("td:eq(5)").find('input'), "BPCisStockholder", "此為必填");
            }
        }
    });
    isStockholderFlag = aryisStockerholder.indexOf("-1") > -1 ? -1 : 0;
    PriceFlag = arrPriceFlag.indexOf(-1) > -1 ? -1 : 0;
    NegotiationPriceFlag = arrNegotiationPriceFlag.indexOf(-1) > -1 ? -1 : 0;

    var inputValue = $(this).find("td:eq(2)").find('input');
    $(inputValue).blur(function () {
        fun_RemoveErrMesg($(this), "BPCItemDescriptionErr", "");
    })
    var rtnFlag = false;
    if (SubjectFlag == -1 || DescriptionFlag == -1 || selectcCategoryFlag == -1 || selectcUomFlag == -1
        || ItemDescriptionFlag == -1 || HaveQuoteFormcheckedFlag == -1 || textPRamountFlag == -1
        || PriceFlag == -1 || NegotiationPriceFlag == -1 || ContractTotalAmountFlag == -1 || ContractFlag == -1
        || VenderFlag == -1 || ContractStartDateFlag == -1 || ContractEndDateFlag == -1
        || PPSDescFlag == -1 || PurchaseEmpNumFlag == -1 || FileUploadFlag == -1 || InvoiceFlag == -1
        || isStockholderFlag == -1 || isUploagFile == -1 || isNewSupplierFlag == -1 || isHaveQuoteFormNewSupplier == -1
        || YnHaveQuoteForm == -1) {
        rtnFlag = false;
    } else {
        rtnFlag = true;
    }
    if (rtnFlag) {
        deferred.resolve()
    } else {
        if ($('[Errmsg=Y]').length > 0) {
            $('html, body').animate({
                scrollTop: ($('.error-text').first().closest("div .row").offset().top) - 50
            }, 500);
        }
        deferred.reject();
    }

    return deferred.promise();
}

function Save() {
    var P_CustomFlowKey = $('#P_CustomFlowKey').val();  //"BPC_P1-002";
    var P_CurrentStep = $("#P_CurrentStep").val();
    $("#ApplyItem").val("請購主旨-" + $("input[name=Subject]").val());

    var deferred = $.Deferred();
    if (($("#P_Status").val() == 4)//加會中也不要做什麼動作了
        || (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 &&
        (P_CurrentStep == "2" || P_CurrentStep == "3" || P_CurrentStep == "4"
        || P_CurrentStep == "5" || P_CurrentStep == "6" || P_CurrentStep == "7"
        || P_CurrentStep == "8" || P_CurrentStep == "9"))//採購經辦之後也什麼都不要做了
        || ((String(P_CustomFlowKey).indexOf("BPC_P3") > -1) && (P_CurrentStep == "2" || P_CurrentStep == "3"))) {
        _formInfo.formGuid = $("#CID").val();
        _formInfo.formNum = $("#BpcNum").val();
        _formInfo.flag = true;
        
        deferred.resolve();
    } else {
        var data = $("#MainForm").serializeObject();
        setValue();
        data.PriceStandardId = $("#PriceStandardId").val();
        data.SigningLevelId = $("#SigningLevelId").val();
        data.BudgetAmount = accounting.unformat(data.BudgetAmount);
        data.QuoteAmount = accounting.unformat(data.QuoteAmount);
        data.CurrencyName = $("#CurrencyCode option:selected").text().length == 0 ? $("input:hidden[name=CurrencyName]").val() : $("#CurrencyCode option:selected").text();

        data.Subject = $("input[name=Subject]").val();

        if ($("textarea[name=Description]").val() == undefined) {
            data.Description = $("input[name=Description]").val();
        } else
            data.Description = $("textarea[name=Description]").val();

        var YnIsEncryption = $("input[name='IsEncryption']:checked").val();
        if (YnIsEncryption != undefined) {
            var val = YnIsEncryption.trim() == "on" ? true : false;
        }

        $("input[name='IsEncryption']").val(val);

        var YnHaveQuoteForm = $("input[name='HaveQuoteForm']:checked").val();//報價單

        if (typeof ($("input[name='HaveQuoteForm']:checked").val()) != 'undefined') {
            var val = YnHaveQuoteForm.trim() == "on" ? true : false;
            $("input[name='HaveQuoteForm']").val(val);
        }

        var HaveYearlyContract = $("#HaveYearlyContract").prop("checked") == true ? true : false;//是否為年度議價協議
        $('#HaveYearlyContract').val(HaveYearlyContract);

        var isNewOption = $("input[name='IsNewSupplier']:checked").val();//是否為新供應商
        if (typeof ($("input[name='IsNewSupplier']:checked").val()) != "undefined") {
            var val = isNewOption.trim() == "on" ? true : false;
            $('input[name="IsNewSupplier"]').val(val);
        }

        var IsInfomationProducts = $("#chk3Citem").prop("checked") == true ? true : false;//資訊產品
        data.IsInfomationProducts = IsInfomationProducts;

        var chkContract = $("#chkContract").prop("checked") == true ? true : false; //是否有合約
        data.HaveContract = chkContract;

        var chkCore = $("#chkCore").prop("checked") == true ? true : false;//是否核心業務委外
        data.IsOutSourcing = chkCore;

        var chkConsultant = $("#chkConsultant").prop("checked") == true ? true : false;
        data.IsConsult = chkConsultant;

        data.IsEncryption = $("input[name='IsEncryption']").val();// 是否解密日期
        data.HaveQuoteForm = $("input[name='HaveQuoteForm']").val();//是否有報價單
        data.HaveYearlyContract = $('#HaveYearlyContract').val();//是否為年度議價協議

        data.IsNewSupplier = $('input[name="IsNewSupplier"]').val();// 是否為新供應商
        // data.ExchangeRate = $("input[name='ExchangeRate']").val();
        data.ExchangeRate = $("#ExchangeRateDef").text().trim();//匯率

        data.DecryptionDate = $("input[name=DecryptionDate]").val();// 解密日期

        GetPageCustomizedList(P_CurrentStep);
        data.BudgetAmount = accounting.unformat(data.BudgetAmount)
        data.QuoteAmount = accounting.unformat(data.QuoteAmount)
        if ($("#MISAgree").val() == "False") {
            if ((P_CustomFlowKey == "BPC_P1_002" && P_CurrentStep == "5")
                || (P_CustomFlowKey == "BPC_P1_004" && P_CurrentStep == "5")) {
                if (btnReturn = 1 && btnReturn == 1) {
                    data.MISAgree = true;
                }
                else {
                    data.MISAgree = false;
                }
            }
            else data.MISAgree = false;
        }

        if (_clickButtonType == 1 || _clickButtonType == 3) {//傳送與結案時
            if (String(P_CustomFlowKey).indexOf("BPC_P1") > -1 && P_CurrentStep == "1") {
                funP1_CustomFlowKeyReSet();
                data.PurchaseSigningLevelId = $("#hidPurchaseSigningLevelId").val();
                data.PurchasePriceStardandId = $("#hidPurchasePriceStardandId").val();
            }

            if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && P_CurrentStep == "1") {
                stepSeq = 1;//設定退回第1關

                var SelectCustomFlowKeyReSet = $("#PurchaseSigningLevelId option:selected").val();

                if (PPLOnchange != 0) {
                    data.PurchaseSigningLevelId = $("#PurchaseSigningLevelId option:selected").val() == "" ? 0 : $("#PurchaseSigningLevelId option:selected").val();
                    data.PurchasePriceStardandId = $("#PurchasePriceStardandId option:selected").val() == "" ? 0 : $("#PurchasePriceStardandId option:selected").val();
                    funP2_CustomFlowKeyReSetChange(SelectCustomFlowKeyReSet);
                } else {
                    data.PurchaseSigningLevelId = $("#PurchaseSigningLevelId option:selected").val() == "" ? 0 : $("#PurchaseSigningLevelId option:selected").val();
                    data.PurchasePriceStardandId = $("#PurchasePriceStardandId option:selected").val() == "" ? 0 : $("#PurchasePriceStardandId option:selected").val();
                    funP2_CustomFlowKeyReSetChange(SelectCustomFlowKeyReSet);
                }
            }
            data.PurchaseSigningLevelId = $("#PurchaseSigningLevelId option:selected").val() == "" ? 0 : $("#PurchaseSigningLevelId option:selected").val();
            data.PurchasePriceStardandId = $("#PurchasePriceStardandId option:selected").val() == "" ? 0 : $("#PurchasePriceStardandId option:selected").val();
        }
        else {
            if (String(P_CustomFlowKey).indexOf("BPC_P1") > -1 && P_CurrentStep == "1") {
                data.PurchaseSigningLevelId = $("#hidPurchaseSigningLevelId").val();
                data.PurchasePriceStardandId = $("#hidPurchasePriceStardandId").val();
            }

            if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && P_CurrentStep == "1") {
                var SelectCustomFlowKeyReSet = $("#PurchaseSigningLevelId option:selected").val() == "" ? 0 : $("#PurchaseSigningLevelId option:selected").val();
                data.PurchaseSigningLevelId = $("#PurchaseSigningLevelId option:selected").val() == "" ? 0 : $("#PurchaseSigningLevelId option:selected").val();
                data.PurchasePriceStardandId = $("#PurchasePriceStardandId option:selected").val() == "" ? 0 : $("#PurchasePriceStardandId option:selected").val();
            }
            data.PurchaseSigningLevelId = $("#PurchaseSigningLevelId option:selected").val() == "" ? 0 : $("#PurchaseSigningLevelId option:selected").val();
            data.PurchasePriceStardandId = $("#PurchasePriceStardandId option:selected").val() == "" ? 0 : $("#PurchasePriceStardandId option:selected").val();
        }
        if (String(P_CustomFlowKey).indexOf("BPC_P3") > -1 && P_CurrentStep == "1") {
            data.PurchaseSigningLevelId = $("#PurchaseSigningLevelId").val();
            data.PurchasePriceStardandId = $("#PurchasePriceStardandId").val();
            data.QuoteAmount = accounting.unformat($("#QuoteAmount").val());
            data.PurchasePriceStardandDescription = $("#PurchasePriceStardandDescription").val()
        }

        var _url = data.BpcNum ? '/BPC/Edit' : '/BPC/Create';
        $.ajax({
            async: false,
            url: _url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function (data, textStatus, jqXHR) {
                _formInfo.formGuid = data.CID;
                _formInfo.formNum = data.BpcNum;
                _formInfo.flag = true;
                deferred.resolve();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("更新失敗!")
                _formInfo.flag = false;
                deferred.resolve();
            }
        });
    }
    return deferred.promise();
}

$.fn.serializeObject = function () {
    var o = {
    };
    $("#ApportionmentDetailList_Temp").remove();
    $("#ApportionmentQuoteDetailTable_Temp").remove();

    $("#ApportionmentQuoteDetailTable tr").find("td:eq(5)").each(function () {
        $(this).find("input").removeAttr("disabled");
    });

    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            if (String([this.name]).substr(22, 5).indexOf("Price") > -1 || String([this.name]).substr(23, 5).indexOf("Price") > -1 || String([this.name]).substr(24, 5).indexOf("Price") > -1
              || String([this.name]).substr(22, 16).indexOf("NegotiationPrice") > -1
              || String([this.name]).substr(23, 16).indexOf("NegotiationPrice") > -1
                | String([this.name]).substr(24, 16).indexOf("NegotiationPrice") > -1) {
                o[this.name] = parseFloat(accounting.unformat(this.value)) || 0;
            } else {
                o[this.name] = this.value || '';
            }
        }
    });
    return o;
};

function GetPageCustomizedList(StepSequence) {
    var P_CustomFlowKey = $('#P_CustomFlowKey').val();  //採購經辦
    var P_CurrentStep = $("#P_CurrentStep").val();
    var InvoiceEmpName = $("input[name=InvoiceEmpName]").val();//發票管理人
    var InvoiceEmpNum = $("input[name=InvoiceEmpNum]").val()//發票管理人
    var PurchaseEmpNo = $("#PurchaseEmpNum").val();//預設採購經辦
    //var PurchaseEmpName = $("#PurchaseEmpNum option:selected").text();//預設採購經辦
    var PurchaseEmpName = $("#PurchaseEmpName").val();
    SalesDeptNo = SalesDeptNo.replace(/\"/g, "");//總務
    var SignedID = SalesDeptNo.trim() + "-JA08000609";//總務
    if (SalesDeptNo != "") {
        if ((StepSequence == 3 || StepSequence == 6) &&
            (P_CustomFlowKey == "BPC_P1_003" || P_CustomFlowKey == "BPC_P1_004")) {
            return {
                SignedID: [SignedID], SignedName: ["總務"]
            };
        }
    }

    //p2流程最後一關  取得下一關人員return值
    if ((P_CustomFlowKey == "BPC_P2_001" && P_CurrentStep == 3) ||
        (P_CustomFlowKey == "BPC_P2_002" && P_CurrentStep == 3) ||
        (P_CustomFlowKey == "BPC_P2_003" && P_CurrentStep == 3) ||
        (P_CustomFlowKey == "BPC_P2_004" && P_CurrentStep == 3) ||
        (P_CustomFlowKey == "BPC_P2_005" && P_CurrentStep == 6) ||
        (P_CustomFlowKey == "BPC_P2_006" && P_CurrentStep == 6) ||
        (P_CustomFlowKey == "BPC_P2_007" && P_CurrentStep == 9)) {
        return {
            SignedID: [PurchaseEmpNo], SignedName: [PurchaseEmpName]
        };
    }
    if (P_CustomFlowKey == "BPC_P3_001" && P_CurrentStep == 2) {
        return {
            SignedID: [InvoiceEmpNum], SignedName: [InvoiceEmpName]
        };
    }

    if ((String(P_CustomFlowKey).indexOf("BPC_P1") > -1) &&
        (StepSequence == 1 || StepSequence == 2 ||
        StepSequence == 4 || StepSequence == 5 ||
        StepSequence == 7 || StepSequence == 8)) {
        return {
            SignedID: [PurchaseEmpNo], SignedName: [PurchaseEmpName]
        };
    }
}

function fun_AddErrMesg(target, NewElementID, ErrMesg) {
    if ($("#" + NewElementID).length > 0) {
        $("#" + NewElementID).text(ErrMesg);
    }
    else {
        $(target).after('<div Errmsg="Y" alt="' + NewElementID + '" class="error-text"><span class="icon-error icon-error-size"></span>' + ErrMesg + '</div>')
    }
}

function fun_RemoveErrMesg(target, NewElementID, ErrMesg) {
    $(target).next('div.error-text').remove();
}

//==========================================
// 設定BPC_P1部份
//==========================================
function funP1_CustomFlowKeyReSet() {
    var P_CustomFlowKey = $('#P_CustomFlowKey').val();  //"PR-P1-002";  //
    P_CurrentStep = $("#P_CurrentStep").val();

    BranchYN = true//是否為總行人員
    YN_0532 = false//是否為資訊處人員

    var MISAgree = $("#MISAgree").val();

    $(_unitData).each(function (index, obj) {
        if (obj.unit_level == 6) BranchYN = false //6 為非總行人員
        if (obj.unit_level == 4 && obj.unit_id == "0532") YN_0532 = true
    })

    var YnMisObj = $("#chk3Citem").prop("checked") == true ? "true" : "false";   //   YnMisObj = "Y";
    if (MISAgree == "True") YnMisObj = "false"
    if ((BranchYN == true && YnMisObj == "false") || (YnMisObj == "true" && YN_0532)) CustomFlowKey = "BPC_P1_001"; //總行
    if (BranchYN == true && YnMisObj == "true" && !YN_0532) CustomFlowKey = "BPC_P1_002";
    if (BranchYN == false && YnMisObj == "false") CustomFlowKey = "BPC_P1_003";//分行
    if (BranchYN == false && YnMisObj == "true") CustomFlowKey = "BPC_P1_004";
    updateCustomFlowKey(CustomFlowKey);
};

//==========================================
// 設當加會完之後BPC_P2部份
//==========================================

function funP2_CustomFlowKeyReSetChange(value) {
    var YnConsultant = $("#chkConsultant").prop("checked") === true ? "true" : "false";//有無勾選聘用顧問類
    fn_isStockholder();//重新判斷是否為利害關係人
    YnStakeHolder = YNStockholder;//重新賦與利害關係人值

    switch (value) {
        case "1":
            if (YnConsultant == "false" && YnStakeHolder == false) {
                CustomFlowKey = "BPC_P2_001";
            }
            break;
        case "2":
            if (YnConsultant == "false" && YnStakeHolder == false) {
                CustomFlowKey = "BPC_P2_002";
            }
            break;
        case "3":
            if (YnConsultant == "false" && YnStakeHolder == false) {
                CustomFlowKey = "BPC_P2_003";
            }
            break;
        case "4":
            if (YnConsultant == "false" && YnStakeHolder == false) {
                CustomFlowKey = "BPC_P2_004";
            }
            break;
        case "5":
            if (YnConsultant == "false" && YnStakeHolder == false) {
                CustomFlowKey = "BPC_P2_005";
            }
            break;

        case "6":
            if ((YnConsultant == "false" && YnStakeHolder == false)
                  || (YnConsultant == "false" && YnStakeHolder == true)
              || (YnConsultant == "true" && YnStakeHolder == false)
                  || (YnConsultant == "true" && YnStakeHolder == true)) {
                CustomFlowKey = "BPC_P2_006";
            }
            break;
        case "7":
            if ((YnConsultant == "false" && YnStakeHolder == false)
            || (YnConsultant == "false" && YnStakeHolder == true)
                || (YnConsultant == "true" && YnStakeHolder == false)
                    || (YnConsultant == "true" && YnStakeHolder == true)
                   ) {
                CustomFlowKey = "BPC_P2_007";
            }
            break;

        case "8":
            if ((YnConsultant == "false" && YnStakeHolder == false)
                || (YnConsultant == "false" && YnStakeHolder == true)
                || (YnConsultant == "true" && YnStakeHolder == false)
            || (YnConsultant == "true" && YnStakeHolder == true)
           ) {
                CustomFlowKey = "BPC_P2_007";
            }
            break;
        default:
            CustomFlowKey = "BPC_P2_001";
    }
    updateCustomFlowKey(CustomFlowKey);
}

//==========================================
// 設定BPC_P3部份
//==========================================
function funP3_CustomFlowKeyReSet() {
    var CustomFlowKey = "";
    var YnHaveYearlyContract = $("#HaveYearlyContract").prop("checked") == true ? "true" : "false";//有無勾選年度議價協議
    if (YnHaveYearlyContract == "false") {
        CustomFlowKey = "BPC_P3_001";
    }
    updateCustomFlowKey(CustomFlowKey);
}

//==========================================
// 勾選聘用顧問類時預設簽核呈級
//==========================================

function fun_Consultant(target) {
    //alert($(target).val())
    fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "");
    var amount = accounting.unformat($("#textPRamount").val());
    if (amount == 0) {
        $("#divParity").text("");
        $("#divParity").val("");
        $("#divSignLv").text("");
        $("#SigningLevelId").val("");
    }

    if (amount < 5000000 && amount > 0) {
        $("#divParity").text("議價");
    }
    if (amount >= 5000000 && amount < 30000000) {
        $("#divParity").text("比價");
    }
    if (amount >= 30000000) {
        $("#divParity").text("招標");
    }

    if (amount < 3000000 && amount > 0) {//勾選聘用顧問類未達300萬
        $("#divSignLv").text("總經理");
        $("#SigningLevelId").val(6);
    }
    if (amount >= 3000000 && amount < 300000000) {//勾選聘用顧問類未達300萬
        $("#divSignLv").text("董事長");
        $("#SigningLevelId").val(7);
    }
    if (amount >= 300000000) {
        $("#divSignLv").text("董事會");
        $("SigningLevelId").val(8);
    }
    amount = fun_accountingformatNumberdelzero(amount)
    $(target).attr("maxlength", amount.length)
    if (amount == 0) {
        $(target).val("");
    }
    // $(target).val(amount);
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

//一般key/value option
function fun_setSelectOptionContract(target, data, subtext) {
    if (subtext) {
        $.each(data, function (key, txt) {
            $(target).append($("<option></option>").attr("data-subtext", key).attr("value", key).text(txt));
        })
    }
    else {
        $.each(data, function (key, txt) {
            $(target).append($("<option></option>").attr("value", key).text(txt));
        })
    }
    $(target).selectpicker('refresh');
}

function fun_PSLevelSet1(Amount, Value) {
    $("#PurchaseSigningLevelId").find('option').remove();
    $("#PurchasePriceStardandId").find('option').remove();
    //簽核層級
    if (Amount < 20000 && Amount > 0) {
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        setDefaultSelect($("#PurchaseSigningLevelId"), 1);
    }
    if (Amount < 100000 && Amount >= 20000) {
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();

        setDefaultSelect($("#PurchaseSigningLevelId"), 2);
    }
    if (Amount < 500000 && Amount >= 100000) {
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 3);
    }
    if (Amount < 3000000 && Amount >= 500000) {
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        $("#PurchaseSigningLevelId option[value='3']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 4);
    }

    if (Amount < 10000000 && Amount >= 3000000) {
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        $("#PurchaseSigningLevelId option[value='3']").hide();
        $("#PurchaseSigningLevelId option[value='4']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 5);
    }

    if (Amount < 50000000 && Amount >= 10000000) {
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        $("#PurchaseSigningLevelId option[value='3']").hide();
        $("#PurchaseSigningLevelId option[value='4']").hide();
        $("#PurchaseSigningLevelId option[value='5']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 6);
    }
    if (Amount < 300000000 && Amount >= 50000000) {
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        $("#PurchaseSigningLevelId option[value='3']").hide();
        $("#PurchaseSigningLevelId option[value='4']").hide();
        $("#PurchaseSigningLevelId option[value='5']").hide();
        $("#PurchaseSigningLevelId option[value='6']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 7);
    }
    if (Amount >= 300000000) {
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        $("#PurchaseSigningLevelId option[value='3']").hide();
        $("#PurchaseSigningLevelId option[value='4']").hide();
        $("#PurchaseSigningLevelId option[value='5']").hide();
        $("#PurchaseSigningLevelId option[value='6']").hide();
        $("#PurchaseSigningLevelId option[value='7']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 8);
    }
    $("#PurchaseSigningLevelId").selectpicker('refresh');

    //作業方式
    fun_setSelectOptionContract($("#PurchasePriceStardandId"), PPSObject, false)
    if (Amount < 5000000) {
        setDefaultSelect($("#PurchasePriceStardandId"), 1);
        PPSDefSelectValue = 1;
        hidPPSid = 1;
    }

    if (Amount >= 5000000 && Amount < 30000000) {
        setDefaultSelect($("#PurchasePriceStardandId"), 2);
        PPSDefSelectValue = 2;
        hidPPSid = 2;
    }
    if (Amount >= 30000000) {
        setDefaultSelect($("#PurchasePriceStardandId"), 3);
        PPSDefSelectValue = 3;
        hidPPSid = 3;
    }
    $("#PurchasePriceStardandId").selectpicker('refresh');
    $("#ContractTotalAmount").val(fun_accountingformatNumberdelzero(Amount))
}

function fun_PSLevelSet2(Amount) {
    $("#PurchaseSigningLevelId").find('option').remove();
    $("#PurchasePriceStardandId").find('option').remove();
    if (Amount < 3000000 && Amount > 0) {//勾選聘用顧問類未達300萬
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        $("#PurchaseSigningLevelId option[value='3']").hide();
        $("#PurchaseSigningLevelId option[value='4']").hide();
        $("#PurchaseSigningLevelId option[value='5']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 6);
    }
    if (Amount < 300000000 && Amount >= 3000000) {//勾選聘用顧問類未達300萬
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        $("#PurchaseSigningLevelId option[value='3']").hide();
        $("#PurchaseSigningLevelId option[value='4']").hide();
        $("#PurchaseSigningLevelId option[value='5']").hide();
        $("#PurchaseSigningLevelId option[value='6']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 7);
    }
    if (Amount >= 300000000) {
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        $("#PurchaseSigningLevelId option[value='3']").hide();
        $("#PurchaseSigningLevelId option[value='4']").hide();
        $("#PurchaseSigningLevelId option[value='5']").hide();
        $("#PurchaseSigningLevelId option[value='6']").hide();
        $("#PurchaseSigningLevelId option[value='7']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 8);
    }
    $("#PurchaseSigningLevelId").selectpicker('refresh');
    //作業方式
    fun_setSelectOptionContract($("#PurchasePriceStardandId"), PPSObject, false)
    if (Amount < 5000000) {
        setDefaultSelect($("#PurchasePriceStardandId"), 1);
        PPSDefSelectValue = 1;
        hidPPSid = 1;
    }
    if (Amount >= 5000000 && Amount < 30000000) {
        setDefaultSelect($("#PurchasePriceStardandId"), 2);
        PPSDefSelectValue = 2;
        hidPPSid = 2;
    }
    if (Amount >= 30000000) {
        setDefaultSelect($("#PurchasePriceStardandId"), 3);
        PPSDefSelectValue = 3;
        hidPPSid = 3;
    }
    $("#PurchasePriceStardandId").selectpicker('refresh');
    $("#ContractTotalAmount").val(fun_accountingformatNumberdelzero(Amount))
}

function fun_PSLevelSet3(Amount) {
    $("#PurchaseSigningLevelId").find('option').remove();
    $("#PurchasePriceStardandId").find('option').remove();
    if (Amount < 50000000 && Amount > 0) {
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        $("#PurchaseSigningLevelId option[value='3']").hide();
        $("#PurchaseSigningLevelId option[value='4']").hide();
        $("#PurchaseSigningLevelId option[value='5']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 6);
    }
    if (Amount >= 50000000) {
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        $("#PurchaseSigningLevelId option[value='3']").hide();
        $("#PurchaseSigningLevelId option[value='4']").hide();
        $("#PurchaseSigningLevelId option[value='5']").hide();
        $("#PurchaseSigningLevelId option[value='6']").hide();
        $("#PurchaseSigningLevelId option[value='7']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 8);
    }

    $("#PurchaseSigningLevelId").selectpicker('refresh');
    //作業方式
    fun_setSelectOptionContract($("#PurchasePriceStardandId"), PPSObject, false)
    if (Amount < 5000000) {
        setDefaultSelect($("#PurchasePriceStardandId"), 1);
        PPSDefSelectValue = 1;
        hidPPSid = 1;
    }
    if (Amount >= 5000000 && Amount < 30000000) {
        setDefaultSelect($("#PurchasePriceStardandId"), 2);
        PPSDefSelectValue = 2;
        hidPPSid = 2;
    }
    if (Amount >= 30000000) {
        setDefaultSelect($("#PurchasePriceStardandId"), 3);
        PPSDefSelectValue = 3;
        hidPPSid = 3;
    }
    $("#PurchasePriceStardandId").selectpicker('refresh');
    $("#ContractTotalAmount").val(fun_accountingformatNumberdelzero(Amount))
}

function fun_PSLevelSet4(Amount) {
    $("#PurchaseSigningLevelId").find('option').remove();
    $("#PurchasePriceStardandId").find('option').remove();
    if (Amount < 3000000 && Amount > 0) {//勾選聘用顧問類未達300萬
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        $("#PurchaseSigningLevelId option[value='3']").hide();
        $("#PurchaseSigningLevelId option[value='4']").hide();
        $("#PurchaseSigningLevelId option[value='5']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 6);
    }
    if (Amount < 50000000 && Amount >= 3000000) {//勾選聘用顧問類未達300萬
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        $("#PurchaseSigningLevelId option[value='3']").hide();
        $("#PurchaseSigningLevelId option[value='4']").hide();
        $("#PurchaseSigningLevelId option[value='5']").hide();
        $("#PurchaseSigningLevelId option[value='6']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 7);
    }
    if (Amount >= 50000000) {
        fun_setSelectOptionContract($("#PurchaseSigningLevelId"), PSLObject, false)
        $("#PurchaseSigningLevelId option[value='1']").hide();
        $("#PurchaseSigningLevelId option[value='2']").hide();
        $("#PurchaseSigningLevelId option[value='3']").hide();
        $("#PurchaseSigningLevelId option[value='4']").hide();
        $("#PurchaseSigningLevelId option[value='5']").hide();
        $("#PurchaseSigningLevelId option[value='6']").hide();
        $("#PurchaseSigningLevelId option[value='7']").hide();
        setDefaultSelect($("#PurchaseSigningLevelId"), 8);
    }

    $("#PurchaseSigningLevelId").selectpicker('refresh');
    //作業方式
    fun_setSelectOptionContract($("#PurchasePriceStardandId"), PPSObject, false)
    if (Amount < 5000000) {
        setDefaultSelect($("#PurchasePriceStardandId"), 1);
        PPSDefSelectValue = 1;
        hidPPSid = 1;
    }
    if (Amount >= 5000000 && Amount < 30000000) {
        setDefaultSelect($("#PurchasePriceStardandId"), 2);
        PPSDefSelectValue = 2;
        hidPPSid = 2;
    }
    if (Amount >= 30000000) {
        setDefaultSelect($("#PurchasePriceStardandId"), 3);
        PPSDefSelectValue = 3;
        hidPPSid = 3;
    }
    $("#PurchasePriceStardandId").selectpicker('refresh');
    $("#ContractTotalAmount").val(fun_accountingformatNumberdelzero(Amount))
}

function setDefaultSelect(target, value) {
    $(target).find("option[value='" + value + "']").attr("selected", "selected")
    $(target).selectpicker('refresh');
    // $(target).change()
}

function resetInvoiceEmp() {
    var InvoiceEmpName = $("input[name=InvoiceEmpName]").val();
    var InvoiceEmpNum = $("input[name=InvoiceEmpNum]").val();
    if (InvoiceEmpName) {
        $('#invoiceLinks .no-file-text').hide();
        $('#invoiceLinks span').text(InvoiceEmpName + '(' + InvoiceEmpNum + ')');
        $('#invoiceLinks .Links').show();
    }
    else {
        $('#invoiceLinks .Links').hide();
        $('#invoiceLinks .no-file-text').show();
    }
}
function ExportReport() {
    // var id = $("#BpcNum").val();
    window.location.href = "/BPC/Report/" + $("#BpcNum").val();
}

//組織樹輸出查詢結果(自行改寫區塊)
function BPCQueryTemp(datas, type, row) {
    $("input[name=InvoiceEmpName]").val(datas[0].user_name)
    $("input[name=InvoiceEmpNum]").val(datas[0].user_id)
    resetInvoiceEmp();
}

//==========================================
// 調整作業方式
//==========================================
function fun_PPSChange(target) {
    $("[alt=PPSErr]").remove();
    var chgvalue = $("#PurchasePriceStardandId option:selected").val();
    PPSOnChange = 1;//變更了了作業方式

    if (chgvalue != PPSDefSelectValue) {
        $("#AlertMessage").html("如更改系統判定之作業方式，請填寫原因");
        window.location.href = "#modal-added-info-2"
        //  alert("如更改系統判定之作業方式，請填寫原因");
        PPSOnChange = 1;
    }
    else {
        PPSOnChange = 0;
    }

    var chgvalue = $("#PurchasePriceStardandId option:selected").val();
}

function fun_msgStockholder() {
    fn_isStockholder();
    if (YNStockholder) {
        $('#IsStockHolderMark').show();
    }
    else {
        $('#IsStockHolderMark').hide();
    }
}

function fun_PSLOnchange() {
    PPLOnchange = PPLOnchange + 1;
}

function fun_PPSOnchangeValue() {
    PPSDefaultValue = $("#PurchasePriceStardandId option:selected").val()
}

function OverrideOrgPickerSetting(step) {
    /// <summary>提供cbp-SendSetting.js針對「傳送其他主管同仁」按鈕做最後OrgPicker更改機會</summary>
    /// <param name="step" type="number">目前關卡數</param>
    //  第一關傳其他只能傳送採購經辦群組， 第二關傳其他只能傳送採購覆核群組:
    var P_CustomFlowKey = $('#P_CustomFlowKey').val();  //"BPC_P1-002";
    var P_CurrentStep = $("#P_CurrentStep").val();

    if (P_CustomFlowKey.indexOf("BPC_P1") > -1 && (P_CurrentStep == 2 || P_CurrentStep == 5 || P_CurrentStep == 8)) {
        return {
            allowRole: ["MGR"], LowestUnitLevel: 5//主管階
        };
    }

    if ((String(P_CustomFlowKey).indexOf("BPC_P2") > -1)) {
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

    if (String(P_CustomFlowKey).indexOf("BPC_P3") > -1) {
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

function orgpickUserbtn() {
    $("[alt=InvoiceEmpNameErr]").remove();
    orgpickUser({
        RootUnitSeq: "0011", allowRole: ['MBR', 'OMG', 'MGR'], outputfunction: "BPCQueryTemp"
    })
}

function ChangeNextEmp(P_CustomFlowKey, P_CurrentStep) {
    if ((String(P_CustomFlowKey).indexOf("BPC_P1") > -1) &&
        (P_CurrentStep == 1 || P_CurrentStep == 2 ||
        P_CurrentStep == 4 || P_CurrentStep == 5 ||
        P_CurrentStep == 7 || P_CurrentStep == 8)) {
        _requestGetNextApprover.SendCase = 1//固定為1 *取得關主
        $.when(GetNextApprover(_requestGetNextApprover, 1)).done(function (data) {
            AppendSend(data);
            $('#SendSection input[value="1"]').attr("checked", true);
        });
    }
    GetPageCustomizedList();
}

function juify() {
    fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "");
    var P_CustomFlowKey = $('#P_CustomFlowKey').val();
    var P_CurrentStep = $("#P_CurrentStep").val();
    fun_Consultant($("#textPRamount"));

    //請採購程序判定區    
    fn_isStockholder();//重新判斷是否為利害關係人
    stockholder = YNStockholder;//重新賦與利害關係人值

    var ConsultantValue = $('#chkConsultant').is(":checked") == true ? true : false;
    var Amount = accounting.unformat($("#ContractTotalAmount").val());

    if ($('#chkConsultant').is(":checked")) {
        //無勾選聘用僱問 無利害關係人
        fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
        if (ConsultantValue == false && stockholder == false) {
            if (!regNumZero(Amount, false)) {
                //fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
                $('#ContractTotalAmount').val("")
            }
            else {
                fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                fun_PSLevelSet1(Amount);
            }
        }

        //有勾選聘用僱問 無利害關係人
        if (ConsultantValue == true && stockholder == false) {
            fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
            if (!regNumZero(Amount, false)) {
                //   fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
                $('#ContractTotalAmount').val("");
            }
            else {
                fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                fun_PSLevelSet2(Amount);
            }
        }

        //無勾選聘用僱問 有利害關係人
        if (ConsultantValue == false && stockholder == true) {
            fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
            if (!regNumZero(Amount, false)) {
                //  fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
                $('#ContractTotalAmount').val("");
            }
            else {
                fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                fun_PSLevelSet3(Amount);
            }
        }

        //有勾選聘用僱問 有利害關係人
        if (ConsultantValue == true && stockholder == true) {
            if (!regNumZero(Amount, false)) {
                // fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
                $('#ContractTotalAmount').val("");
            }
            else {
                fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
                fun_PSLevelSet4(Amount);
            }
        }
    }

    //請採購程序判定區
    fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
    fn_isStockholder();//重新判斷是否為利害關係人
    stockholder = YNStockholder;//重新賦與利害關係人值
    var Amount = accounting.unformat($("#ContractTotalAmount").val());
    if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && P_CurrentStep == "1") {
        Amount == 0 ? ContractTotalAmountFlag = -1 : ContractTotalAmountFlag = 0;
    }

    //無勾選聘用僱問 無利害關係人
    if (ConsultantValue == false && stockholder == false) {
        if (!regNumZero(Amount, false)) {
            //  fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
            $('#ContractTotalAmount').val("");
        }
        else {
            fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
            fun_PSLevelSet1(Amount);
        }
    }

    //有勾選聘用僱問 無利害關係人
    if (ConsultantValue == true && stockholder == false) {
        if (!regNumZero(Amount, false)) {
            //  fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
            $('#ContractTotalAmount').val("");
        }
        else {
            fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
            fun_PSLevelSet2(Amount);
        }
    }

    //無勾選聘用僱問 有利害關係人
    if (ConsultantValue == false && stockholder == true) {
        if (!regNumZero(Amount, false)) {
            // fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
            $('#ContractTotalAmount').val("");
        }
        else {
            fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
            fun_PSLevelSet3(Amount);
        }
    }

    //有勾選聘用僱問 有利害關係人
    if (ConsultantValue == true && stockholder == true) {
        if (!regNumZero(Amount, false)) {
            // fun_AddErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "金額不可為0")
            $('#ContractTotalAmount').val("");
        }
        else {
            fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
            fun_PSLevelSet4(Amount);
        }
    }
}
//判斷報價供應商清冊區是否有利害關係人
function fn_isStockholder() {
    var isStockholder = [];
    $("#ApportionmentQuoteDetailTable tr").not('[alt="hide"]').each(function () {
        var isDelete = $(this).find("td:eq(6)").find("input").val();
        var isstakholder = $(this).find("#IsStakeholders").text()
        if (isDelete != null) {
            if (isDelete == "" || isDelete == "False") {
                if (isstakholder == "是") {
                    isStockholder.push("-1");
                }
            }
        }
    })
    if (isStockholder.indexOf("-1") > -1) {
        YNStockholder = true;
    }
    else {
        YNStockholder = false;
    }
}