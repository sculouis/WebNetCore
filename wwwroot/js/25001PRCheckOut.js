//NewVersion...begin.....
//Part1流程...設定各關卡的欄位控制...
function funP1_GeneralControl(P_CustomFlowKey, P_CurrentStep, P_Status, YnSalesDept, YnMisObj) {
    if (P_CustomFlowKey.indexOf("PR_P1") > -1 && P_Status.trim() == "4") {
        ReadOnlySet();
    } else if (P_CustomFlowKey.indexOf("PR_P1") > -1 && P_Status.trim() != "4" && (P_CurrentStep == "1" || P_CurrentStep == "2")) {
        if (P_CurrentStep == "1") Role1_Purchaser();   //請購人
        if (P_CurrentStep == "2") Role2_PurchaserManager(); //請購單位主管
    } else if (P_CustomFlowKey == "PR_P1_002") {
        if (P_CurrentStep == "3") Role_MisGenHander();   //資訊單位-總務
        if (P_CurrentStep == "4" || P_CurrentStep == "5") Role_MisManager();  ////資訊單位-經辦、主管
    } else if (P_CustomFlowKey == "PR_P1_003") {
        if (P_CurrentStep == "3") Role_SalesDeptGenHander(); //業管單位-總務
        if (P_CurrentStep == "4" || P_CurrentStep == "5") Role_SalesDeptManager(); //業管單位-經辦、主管
    } else if (P_CustomFlowKey == "PR_P1_004") {
        if (P_CurrentStep == "3") Role_MisGenHander();   //資訊單位-總務
        if (P_CurrentStep == "4" || P_CurrentStep == "5") Role_MisManager();  ////資訊單位-經辦、主管
        if (P_CurrentStep == "6") Role_SalesDeptGenHander(); //業管單位-總務 Role_MisGenHander();
        if (P_CurrentStep == "7" || P_CurrentStep == "8") Role_SalesDeptManager(); //業管單位-經辦、
    }
    else {
        ReadOnlySet();
    }
}
//Part2流程...設定各關卡的欄位控制...
function funP2_GeneralControl(P_CustomFlowKey, P_CurrentStep, P_Status) {
    if (P_Status.trim() == "4") {
        ReadOnlySet();
    } else if (P_CustomFlowKey.indexOf("PR_P2") > -1 && P_Status.trim() != "4" && (P_CurrentStep == "1" || P_CurrentStep == "2")) {
        if (P_CurrentStep == "1") Role_ManaDeptPO();   //管理處採購經辦
        if (P_CurrentStep == "2") Role_ManaDeptPORecheck();   //管理處採購覆核
    } else if (P_CustomFlowKey == "PR_P2_001") {
        if (P_CurrentStep == "3") Role_LastManager();    //管理處科長 --決行主管
    } else if (P_CustomFlowKey == "PR_P2_002") {
        if (P_CurrentStep == "3") Role_LastManager();   //管理處副理-決行主管
    } else if (P_CustomFlowKey == "PR_P2_003") {
        if (P_CurrentStep == "3") Role_LastManager();   //管理處經理-決行主管
    } else if (P_CustomFlowKey == "PR_P2_004") {
        if (P_CurrentStep == "3") Role_LastManager();   //管理處處主管-決行主管
    }
    else if (P_CustomFlowKey == "PR_P2_005") {
        if (P_CurrentStep == "3") Role_LastManager();   //管理處處主管-決行主管
        if (P_CurrentStep == "4") Role_GMGenHander();   //總經理室總務
        if (P_CurrentStep == "5") Role_GMTaker();   //總經理室經辨
        if (P_CurrentStep == "6") Role_LastManager();   //執行副總-決行主管
    }
    else if (P_CustomFlowKey == "PR_P2_006") {
        if (P_CurrentStep == "3") Role_LastManager();   //管理處處主管-決行主管
        if (P_CurrentStep == "4") Role_GMGenHander();   //總經理室總務
        if (P_CurrentStep == "5") Role_GMTaker();   //總經理室經辨
        if (P_CurrentStep == "6") Role_LastManager();   //總經理-決行主管
    }
    else if (P_CustomFlowKey == "PR_P2_007") {
        if (P_CurrentStep == "3") Role_LastManager();   //管理處處主管-決行主管
        if (P_CurrentStep == "4") Role_GMGenHander();   //總經理室總務
        if (P_CurrentStep == "5") Role_GMTaker();   //總經理室經辨
        if (P_CurrentStep == "6") Role_LastManager();   //總經理-決行主管
        if (P_CurrentStep == "7") Role_ChiefGenHander();   //董事長室總務
        if (P_CurrentStep == "8") Role_LastManager();   //董事長室經辦
        if (P_CurrentStep == "9") Role_LastManager();   //董事長
    }
    else {
        ReadOnlySet();
    }
}

//RoleSet...begin....

//part1.Role...begin...
//請購人
function Role1_Purchaser() {
    $('#QuoteInfoSection').hide(); //報價明細區
    $('#POSection').hide(); //請採購程序判定區
}

function Role2_PurchaserManager() { //請購單位主管
    RpTitleSet_Readonly();
}

function Role_MisGenHander() { //資訊單位-總務
    ReadOnlySet();
}

function Role_MisManager() { //資訊單位-經辦、主管
    RpTitleSet_Readonly();
}


function Role_SalesDeptGenHander() { //業管單位-總務
    ReadOnlySet();
}

function Role_SalesDeptManager() { //業管單位-經辦、主管
    RpTitleSet_Readonly();
}

//part1.Role...end...



//part2.Role...begin...

//決行主管
function Role_LastManager() {
    ReadOnlySet();
    $('#QuoteInfoSection').show(); //報價明細區
    $('#POSection').show(); //請採購程序判定區
}

//管理處採購經辦
function Role_ManaDeptPO() {
    RpTitleSet_Readonly();

    $('#QuoteInfoSection').show(); //報價明細區
    $('#POSection').show(); //請採購程序判定區
    $('input[name=checkHaveQuotation]').prop("disabled", true);

    var amount = $("#textPRamount").val();
    amount = fun_accountingformatNumberdelzero(amount)
    $("#textPRamount").attr("maxlength", amount.length)
    $("#textPRamount").val(amount);
    $('#textPRamount').prop("readonly", true);
}

//管理處-採購覆核
function Role_ManaDeptPORecheck() {
    ReadOnlySet();
    $('#QuoteInfoSection').show(); //報價明細區
    $('#POSection').show(); //請採購程序判定區
}

//總經理室總務
function Role_GMGenHander() {
    ReadOnlySet();
    $('#QuoteInfoSection').show(); //報價明細區
    $('#POSection').show(); //請採購程序判定區
}

//總經理室經辨
function Role_GMTaker() {
    ReadOnlySet();
    $('#QuoteInfoSection').show(); //報價明細區
    $('#POSection').show(); //請採購程序判定區
}

//董事長室總務
function Role_ChiefGenHander() {
    ReadOnlySet();
    $('#QuoteInfoSection').show(); //報價明細區
    $('#POSection').show(); //請採購程序判定區
}

//董事長室經辦
function Role_ChiefTaker() {
    ReadOnlySet();
    $('#QuoteInfoSection').show(); //報價明細區
    $('#POSection').show(); //請採購程序判定區
}

//part2.Role...end...

//RoleSet...end....

function RpTitleSet_Readonly() {
    $('#textPRTitle').prop("readonly", true);
    $('#textareaPRExplanation').prop("readonly", true);

    $('input[name=chkConfidential]').prop("disabled", true);
    $('#textDecryptDate').prop("readonly", true);
    $('#textDecryptDate').addClass('input-disable');
    $('#spanCalendar').addClass('input-disable');

    $('#chk3Citem').prop("disabled", true);
   // $('#chkConsultant').prop("disabled", true);
    $('#chkContract').prop("disabled", true);
    $('#chkCore').prop("disabled", true);


    $('#QuoteInfoSection').hide(); //報價明細區
    $('#POSection').hide(); //請採購程序判定區
}

//NewVersion...end.....

//OldVersion...begin.....
//CheckOut關卡設定..OldVersion...begin.....

function fun_DomControl(P_CurrentStep) {
    subStep = 0;

    switch (P_CurrentStep) {
        case "1"://請購人
            QuoteInfoSection(P_CurrentStep)
            break;
        case "2"://請購單位主管
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;

        case "3"://業管單位-總務
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            //  $("#divExceptedPaymentDate").show()
            break;
        case "4"://業管單位-經辨
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;

        case "5"://資訊單位-總務
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;

        case "6"://資訊單位-經辦、資訊單位-主管
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;

        case "7"://加會單位-總務
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;

        case "8"://加會單位-經辦
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;

        case "9"://加會單位-主管
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;

        case "10"://管理處-採購
            MainReadOnlySet(P_CurrentStep);
            break;

        case "11"://管理處-採購覆核
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;

        case "12"://總經理室總務
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;

        case "13"://總經理室經辦
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;
        case "14"://董事長室總務
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;

        case "15"://董事長室經辦
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;

        case "16"://決行主管
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;

        case "17"://決行後-管理處採購
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;

        case "18"://決行後-管理處採購覆核
            MainReadOnlySet(P_CurrentStep);
            QuoteInfoSection(P_CurrentStep)
            break;
    }
}

////Pr主Table-關卡設定....
function MainReadOnlySet(P_CurrentStep) {
    $('#textPRTitle').prop("readonly", true);
    $('#textareaPRExplanation').prop("readonly", true);

    $('input[name=chkConfidential]').prop("disabled", true);
    $('#textDecryptDate').prop("readonly", true);
    $('#textDecryptDate').addClass('input-disable');
    $('#spanCalendar').addClass('input-disable');

    if (P_CurrentStep.trim() == "2" || P_CurrentStep.trim() == "4" || P_CurrentStep.trim() == "6") {
    } else {
        $('#chk3Citem').prop("disabled", true);
        $('#chkConsultant').prop("disabled", true);
        $('#chkContract').prop("disabled", true);
        $('#chkCore').prop("disabled", true);
        $('#SelPrjCat').prop("disabled", true);
        $('#SelPrj').prop("disabled", true);
        $('#SelPrjItem').prop("disabled", true);

        var amount = $("#textPRamount").val();
        amount = fun_accountingformatNumberdelzero(amount)
        $("#textPRamount").attr("maxlength", amount.length)
        $("#textPRamount").val(amount);
        $('#textPRamount').prop("readonly", true);

        $('input[name=checkHaveQuotation]').prop("disabled", true);
        $("input[name=supplier]").prop("disabled", true);
    }
}

////報價明細區-關卡設定....
function QuoteInfoSection(P_CurrentStep) {
    if (P_CurrentStep.trim() == "2") {
    }
    else if (P_CurrentStep.trim() == "3") {
        $('#linkCreatQOInfo').hide();
        $('input[name^=chkQo]').prop("disabled", true);

        $('input[name^=chkQuote]').prop("disabled", true);

        $('#PurchaseDefaultSignLevel').prop("disabled", true);
        $('#PurchaseInquiredBargaining').prop("disabled", true);
        $('#txtPrStandardChgDescription').prop("disabled", true);

        $('#QuoDetConfirm').hide();

        //  $('#chkContract').prop("disabled", true);
    }
    else {
        $('#QuoteInfoSection').hide();
    }
}

//請採購程序判定區-關卡設定....
function POSection(P_CurrentStep) {
    if (P_CurrentStep.trim() == "8") {
        //$('#PurchaseDefaultSignLevel').prop("disabled", false);
        //$('#PurchaseInquiredBargaining').prop("disabled", false);
        //$('#txtPrStandardChgDescription').prop("disabled", false);

        $('#PurchaseDefaultSignLevel').show();
        $('#PurchaseInquiredBargaining').show();
        $('#txtPrStandardChgDescription').show();
    } else {
        //$('#PurchaseDefaultSignLevel').prop("disabled", true);
        //$('#PurchaseInquiredBargaining').prop("disabled", true);
        //$('#txtPrStandardChgDescription').prop("disabled", true);

        $('#PurchaseDefaultSignLevel').hide();
        $('#PurchaseInquiredBargaining').hide();
        $('#txtPrStandardChgDescription').hide();
    }
}

//CheckOut關卡設定..OldVersion...end.....