var DeptList = new Array();
var Itemlist = new Array();
var LevelList = new Array();
var SuppliesList = new Array();

var PR;

$(function () {
    InitialSet();
});
function InitialSet() {
    //取得後端Model
    PR = getModel();

    //$("#divEcryption").data("DateTimePicker").minDate(new Date());

    var HandType = $("#hidHandType").val();
    if (HandType == "Edit" || HandType == "CheckOut") {
        EditSet();
    } else if (HandType == "ReadOnly") {
        EditSet();
        ReadOnlySet();
    }
    else { }

    ObjEventSet();
    AjaxListGet();
    HtmlInitalSet();

    if (HandType == "Edit") {
        $('#QuoteInfoSection').hide(); //報價明細區
        $('#POSection').hide(); //請採購程序判定區
    }

    //part1.......begin...

    P_CustomFlowKey = $('#P_CustomFlowKey').val();  //"PR_P2_007";  //
    P_Status = $('#P_Status').val(); // "1";  //
    P_CurrentStep = $("#P_CurrentStep").val();  //  "2";  //

   // alert(P_CustomFlowKey);
    //  alert(P_Status);
    //alert(P_CurrentStep);

    YnMisObj = $("#chk3Citem").prop("checked") == true ? "true" : "false";   //   YnMisObj = "Y"; //
    var LoginEno = $("#LoginEno").val().trim();

    //part2.......begin...
    if (P_CustomFlowKey.indexOf("PR_P2") > -1) { //part2
        if (HandType == "CheckOut") {  //        if (HandType == "Edit") {  //
            funP2_GeneralControl(P_CustomFlowKey, P_CurrentStep, P_Status);
        }
    }
    //part2.......end...
    //part1.......begin...
    if (P_CustomFlowKey.indexOf("PR_P1") > -1) { //part1:判斷 是否業管
        $.ajax({
            url: '/PR/SalesDeptIdyGet',
            dataType: 'json',
            type: 'POST',
            data: { LoginEno: LoginEno },
            success: function (data, textStatus, jqXHR) {
                YnSalesDept = "false";
                if (data == true) YnSalesDept = "true";

                $("#hidYnSalesDept").val(YnSalesDept);

                if (HandType == "CheckOut") {  //      if (HandType == "Edit") {  //
                    funP1_GeneralControl(P_CustomFlowKey, P_CurrentStep, P_Status, YnSalesDept, YnMisObj);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    }
    //part1.......end...

    //original.....begin..
    //if (HandType == "CheckOut") {
    //    P_CurrentStep = $("#P_CurrentStep").val();
    //    fun_DomControl(P_CurrentStep);    //控項控制
    //}
    //original.....end..

    var QuoAmt = parseFloat($("#ContractTotalAmount").text());
    var YnStaHoder = $("#hidQuoYnStakeHolder").val();
    if (QuoAmt > 0) {
        var selJobWay = $("#PurchaseInquiredBargaining");
        var StandId = $("#hidPurchaseInquiredBargaining").val();
        setDefaultSelect(selJobWay, StandId);

        QuoAmt = fun_accountingformatNumberdelzero(QuoAmt)
        $("#ContractTotalAmount").text(QuoAmt);
    }
    //180514....create....begin...
    var prjVal = $('#SelPrj').val();
    if (prjVal == null) $('#SelPrj').prop("disabled", true);

    var prjItemVal = $('#SelPrjItem').val();
    if (prjItemVal == null) $('#SelPrjItem').prop("disabled", true);
    //180514....create...end...
}

//重設part1 流程.......
function funP1_CustomFlowKeyReSet()  //CustomFlowKey
{
    var P_CustomFlowKey = $('#P_CustomFlowKey').val();  //"PR-P1-002";  //

    var YnSalesDept = $("#hidYnSalesDept").val();
    var YnMisObj = $("#chk3Citem").prop("checked") == true ? "true" : "false";   //   YnMisObj = "Y";
    if (YnSalesDept == "false" && YnMisObj == "false") P_CustomFlowKey = "PR_P1_001";
    if (YnSalesDept == "false" && YnMisObj == "true") P_CustomFlowKey = "PR_P1_002";
    if (YnSalesDept == "true" && YnMisObj == "false") P_CustomFlowKey = "PR_P1_003";
    if (YnSalesDept == "true" && YnMisObj == "true") P_CustomFlowKey = "PR_P1_004";

    //
    updateCustomFlowKey(P_CustomFlowKey);     // set_stageInfo_value("NextCustomFlowKey", P_CustomFlowKey);

    // alert("funP1_CustomFlowKeyReSet:" + P_CustomFlowKey);
    // $('#P_CustomFlowKey').val(P_CustomFlowKey);
}
//重設part2 流程.......
function funP2_CustomFlowKeyReSet()  //CustomFlowKey
{
    var YnConSut = $("#chkConsultant").prop("checked") == true ? "true" : "false";   //   聘用顧問類

    var YnStakeHolder = $("#hidQuoYnStakeHolder").val();   //   利害關係人

    var ToAmt = $("#ContractTotalAmount").text();
    var amount = 0;
    if (ToAmt != undefined) {
        amount = ToAmt == "" ? 0 : accounting.unformat($("#ContractTotalAmount").text());
    } else {
        amount = 0;
    }

    if (YnConSut == "false" && YnStakeHolder == "false" && ToAmt < 20000) P_CustomFlowKey = "PR_P2_001";
    if (YnConSut == "false" && YnStakeHolder == "false" && (amount >= 20000 && amount < 100000)) P_CustomFlowKey = "PR_P2_002";
    if (YnConSut == "false" && YnStakeHolder == "false" && (amount >= 100000 && amount < 500000)) P_CustomFlowKey = "PR_P2_003";
    if (YnConSut == "false" && YnStakeHolder == "false" && (amount >= 500000 && amount < 3000000)) P_CustomFlowKey = "PR_P2_004";
    if (YnConSut == "false" && YnStakeHolder == "false" && (amount >= 3000000 && amount < 10000000)) P_CustomFlowKey = "PR_P2_005";

    if ((YnConSut == "false" && YnStakeHolder == "false" && (amount >= 10000000 && amount < 50000000)) ||
        (YnConSut == "false" && YnStakeHolder == "true" && amount < 50000000) ||
         (YnConSut == "true" && YnStakeHolder == "false" && amount < 5000000) ||
         (YnConSut == "true" && YnStakeHolder == "true" && amount < 5000000)
        ) { P_CustomFlowKey = "PR_P2_006"; }

    if ((YnConSut == "false" && YnStakeHolder == "false" && (amount >= 50000000 && amount < 300000000)) ||
      (YnConSut == "false" && YnStakeHolder == "false" && amount >= 300000000) ||
       (YnConSut == "false" && YnStakeHolder == "true" && amount >= 50000000) ||
       (YnConSut == "true" && YnStakeHolder == "false" && (amount >= 5000000 && amount < 300000000)) ||
       (YnConSut == "true" && YnStakeHolder == "false" && amount >= 300000000) ||
       (YnConSut == "true" && YnStakeHolder == "true" && (amount >= 5000000 && amount < 50000000)) ||
       (YnConSut == "true" && YnStakeHolder == "true" && amount >= 50000000)
      ) { P_CustomFlowKey = "PR_P2_007"; }

    updateCustomFlowKey(P_CustomFlowKey); // set_stageInfo_value("NextCustomFlowKey", P_CustomFlowKey);  // $('#P_CustomFlowKey').val(P_CustomFlowKey);
    //  alert("funP2_CustomFlowKeyReSet:" + P_CustomFlowKey);
}

//暫存時 Edit 畫面 回寫Db...
function form_edit() {
    //   if (idx == "1") {
    rtn = true;
    //  var YnPass = fun_formCheck();
    //rtn = YnPass;

    DetailYC_JsonSet();
    DetailOnce_JsonSet();

    $("#textPRamount").val(accounting.unformat($("#textPRamount").val()));

    // $("#hidSendMessage").val($("#SendMessage").val());

    if (rtn == true) {
        // $("#PurEditForm").submit();

        var PrNum = $("#hidPRNum").val();
        var PRData = PRDataSet(PR);

        $.ajax({
            url: '/PR/Edit',
            dataType: 'json',
            type: 'POST',
            data: PRData,
            success: function (data, textStatus, jqXHR) {
                if (data == "true") {
                    window.location.href = '/PR/Edit/' + PrNum;
                    // alert('資料更新成功!');
                } else {
                    window.location.href = '/PR/Edit/' + PrNum;
                    alert('資料更新失敗了!');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    }

    //  return rtn;
    // }
}

//暫存
function draft() {
    var HandType = $("#hidHandType").val();
    var PRNum = $("#hidPRNum").val();

    if (PRNum.trim() != "") {
        //if (HandType == "Edit") {
        form_edit();
    } else {
        form_save();
    }
}

//驗證
function Verify() {
    rtn = true;
    var YnPass = fun_formCheck();
    rtn = YnPass;

    var P_CustomFlowKey = $('#P_CustomFlowKey').val();  //"PR-P1-002";  //
    var P_CurrentStep = $("#P_CurrentStep").val();

    var ToAmt = $("#ContractTotalAmount").text();
    var amount = 0;
    if (ToAmt != undefined) {
        amount = ToAmt == "" ? 0 : accounting.unformat($("#ContractTotalAmount").text());
    } else {
        amount = 0;
    }

    if (P_CustomFlowKey.indexOf("PR_P2") > -1 && P_CurrentStep == "1" && amount == 0) {
        rtn = false;
        alert('請先進行報價確認!');
    }

    if (rtn == true) {
        var FormId = $("#hidFormId").val();
        var PRNum = $("#hidPRNum").val();

        if (PRNum.trim() == "") {
            DetailYC_JsonSet();
            DetailOnce_JsonSet();

            $("#textPRamount").val(accounting.unformat($("#textPRamount").val()));

            var PRData = PRDataSet(PR);

            $.ajax({
                url: '/PR/CreatePost',
                dataType: 'json',
                type: 'POST',
                data: PRData,
                success: function (data, textStatus, jqXHR) {
                    if (data != null && data != "") {
                        PRNum = data.split(',')[0].toString();
                        FormId = data.split(',')[1].toString();

                        $("#hidFormId").val(FormId);

                        $("#hidPRNum").val(PRNum);
                    } else {
                        alert('資料傳送失敗了!');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        } else {
            DetailYC_JsonSet();
            DetailOnce_JsonSet();
            $("#textPRamount").val(accounting.unformat($("#textPRamount").val()));

            var PRData = PRDataSet(PR);

            $.ajax({
                url: '/PR/Edit',
                dataType: 'json',
                type: 'POST',
                data: PRData,
                success: function (data, textStatus, jqXHR) {
                    if (data == "true") {
                        $("#hidFormId").val(FormId);
                        $("#hidPRNum").val(PRNum);
                    } else {
                        // window.location.href = '/PR/Edit/' + PrNum;
                        alert('資料傳送失敗了!');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        }
    }

    return rtn;
    //return true
}

//傳送
function Save() {
    var P_CustomFlowKey = $('#P_CustomFlowKey').val();  //"PR-P1-002";  //
    var P_CurrentStep = $("#P_CurrentStep").val();

    if (P_CustomFlowKey.indexOf("PR_P1") > -1 && P_CurrentStep == "1") {
        funP1_CustomFlowKeyReSet();
    }

    if (P_CustomFlowKey.indexOf("PR_P2") > -1 && P_CurrentStep == "1") {
        funP2_CustomFlowKeyReSet();
    }

    var FormId = $("#hidFormId").val();
    var PRNum = $("#hidPRNum").val();

//    alert(FormId);

    _formInfo.formGuid = FormId;
    _formInfo.formNum = PRNum;
    _formInfo.flag = true;
}
//PR 主table 設定回DataModel...
function PRDataSet(PrData) {
    PrData.Subject = $("#textPRTitle").val();
    PrData.Description = $("#textareaPRExplanation").val();

    PrData.PRNum = $("#hidPRNum").val();
    PrData.PRID = $("#hidPRID").val();
    PrData.FormID = $("#hidPRID").val();

    var YnConf = $("input[name=chkConfidential]:checked").val();
    if (YnConf != undefined) {
        PrData.IsEncryption = YnConf.trim() == "on" ? "1" : "0";
    }

    var DecDate = $("input[name=textDecryptDate]").val();

    if (DecDate == "") {
        PrData.DecryptionDate = "3000/12/31";   // $("input[name=textDecryptDate]").val();
    } else {
        PrData.DecryptionDate = DecDate;   // $("input[name=textDecryptDate]").val();
    }

    if ($("#chk3Citem").prop("checked")) {
        PrData.IsInformationProducts = "1";
    } else {
        PrData.IsInformationProducts = "0";
    }

    if ($("#chkContract").prop("checked")) {
        PrData.HaveContract = "1";
    }
    else {
        PrData.HaveContract = "0";
    }

    if ($("#chkConsultant").prop("checked")) {
        PrData.IsConsult = "1";
    }
    else {
        PrData.IsConsult = "0";
    }

    if ($("#chkCore").prop("checked")) {
        PrData.IsOutSourcing = "1";
    }
    else {
        PrData.IsOutSourcing = "0";
    }

    var YnQuo = $("input[name=checkHaveQuotation]:checked").val();

    if (YnQuo != undefined) {
        PrData.HaveQuoteForm = YnQuo.trim() == "on" ? "1" : "0";
    }

    PrData.BudgetAmount = $("#textPRamount").val(); //long.Parse(collection["textPRamount"]);
    PrData.PriceStandardId = $("#hidParity").val(); // int.Parse(collection["hidParity"]);
    PrData.SigningLevelId = $("#hidSignLv").val(); // int.Parse(collection["hidSignLv"]);

    PrData.ProjectCategoryID = $("#SelPrjCat").val();
    PrData.ProjectID = $("#SelPrj").val();
    PrData.ProjectItemID = $("#SelPrjItem").val();

    var YnNewSup = $("input[name=supplier]:checked").val();  //$("#supplier").val();
    if (YnNewSup != undefined) {
        PrData.IsNewSupplier = YnNewSup.trim() == "on" ? "1" : "0";
    }

    PrData.hidOncePurDetail = $("#hidOncePurDetail").val();
    PrData.hidOncePurDetail_Log = $("#hidOncePurDetail_Log").val();
    PrData.hidYCPurDetail = $("#hidYCPurDetail").val();
    PrData.hidYCPurDetail_Log = $("#hidYCPurDetail_Log").val();

    var ToAmt = $("#ContractTotalAmount").text();
    if (ToAmt != undefined) {
        var QoAmt = ToAmt == "" ? 0 : accounting.unformat($("#ContractTotalAmount").text());
        if (parseFloat(QoAmt) > 0) {
            PrData.QuoteAmount = QoAmt;
            PrData.PurchasePriceStardandId = $("#PurchaseInquiredBargaining").val();
            PrData.PurchasePriceStardandDescription = $("#txtPrStandardChgDescription").val();
            PrData.PurchaseSigningLevelId = $("#PurchaseDefaultSignLevel").val();
        }
    }
    return PrData;
}

//表單檢核
function form_save() {
    rtn = true;

    //  var YnPass = fun_formCheck();
    //rtn = YnPass;

    DetailYC_JsonSet();

    DetailOnce_JsonSet();

    $("#textPRamount").val(accounting.unformat($("#textPRamount").val()));

    if (rtn == true) {
        var PRData = PRDataSet(PR);

        $.ajax({
            url: '/PR/Create',
            dataType: 'json',
            type: 'POST',
            data: PRData,
            success: function (data, textStatus, jqXHR) {
                if (data != null && data != "") {
                    window.location.href = '/PR/Edit/' + data;
                } else {
                    window.location.href = '/PR/Create/';
                    alert('Insert 資料失敗了!');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    } else {
        //alert('資料檢核失敗-請重新檢查「必填欄位」或「欄位格式」!');
    }

    // $("#PurMainForm").submit();
    //$("select[name^=ChargeDe]").each(function () {         //$("td[alt^=PRInfoIndex]").each(function () {
    //    alert($(this).val());
    //})
    // return rtn;
}

function ReadOnlySet() {
    // $('#divEcryptionAlertMessage').hide()

    $('#textPRTitle').prop("readonly", true);
    $('#textareaPRExplanation').prop("readonly", true);

    $('input[name=chkConfidential]').prop("disabled", true);
    $('#textDecryptDate').prop("readonly", true);
    $('#textDecryptDate').addClass('input-disable');
    $('#spanCalendar').addClass('input-disable');

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

    //var amount = fun_accountingformatNumberdelzero($("#divBudgetAmount").text());

    //$("#divBudgetAmount").text(amount);

    //Detail-YCSet....begin..
    // $('#POItemGet').hide();   //.prop("disabled", true); //帶入品項

    $('[name^=POItemGet]').hide();   //.prop("disabled", true); //帶入品項

    $('[name^=DeliveryPrompt]').prop("disabled", true);

    // $('#DeleteThisENPDetail').prop("disabled", true); //刪除欄位
    $('[name^=DeleteThisENPDetail]').prop("disabled", true); //刪除欄位

    $('[name^=DeletePrYcDev]').prop("disabled", true); //刪除欄位

    $('#AppendENPDetail').hide(); //新增欄位
    $('#AppendPrDetail').hide(); //新增明細單位

    //$('#AmortizationDetailCreate').children("span").text("送貨單位明細");
    $('[name^=AmortizationDetailCreate]').children("span").text("送貨單位明細");
    //Detail-YCSet....end...

    //Detail-Once....begin..
    $('[name^=CategorySel]').prop("disabled", true);
    $('[name^=ItemDescription]').prop("disabled", true);
    $('[name^=UomCodeSel]').prop("disabled", true);

    $('[name^=GreenPurchasing]').prop("disabled", true);
    $('[name^=PurchaseSel]').prop("disabled", true);

    $('[name^=AddPersonGet]').hide();

    //$('#PROneTimeDetailBtn').children("span").text("送貨單位明細");
    $('[name^=PROneTimeDetailBtn]').children("span").text("送貨單位明細");

    $('#AppendPROneTimeDetail').hide(); //新增欄位
    $('#AppendPROneTimePopDetail').hide(); //新增明細單位

    //$('#DeleteThisPROneTimeDetail').prop("disabled", true); //刪除欄位
    $('[name^=DeleteThisPROneTimeDetail]').prop("disabled", true); //刪除欄位
    $('[name^=DeletePrOnceDev]').prop("disabled", true); //刪除欄位

    //Detail-Once....end...

    //Delivery-Set.....
    $('[name^=ChargeDept]').prop("disabled", true);
    $('[name^=RcvDept]').prop("disabled", true);
    $('input[name^=DevQuantity]').prop("disabled", true);
    $('#AccountConfirm').hide(); //YC-Delivery確定
    $('#OnceDevyConfirm').hide(); //Once-Delivery確定

    //Delivery-Set.....

    ////報價明細區-begin...

    $('#linkCreatQOInfo').hide();
    $('input[name^=chkQo]').prop("disabled", true);
    $('input[name^=chkQuote]').prop("disabled", true);
    $('#QuoDetConfirm').hide(); //報價查詢-確定鈕

    $('#QuoteInfoSection').hide(); //報價明細區

    ////報價明細區-end....

    //請採購程序判定區-begin.....//

    $('#PurchaseDefaultSignLevel').prop("disabled", true);
    $('#PurchaseInquiredBargaining').prop("disabled", true);
    $('#txtPrStandardChgDescription').prop("disabled", true);

    $('#POSection').hide(); //請採購程序判定區-

    //請採購程序判定區-end.....
}

//報價單回寫DB..與..DB撈取..begin....
function QuoteData_JsonSet() {
    // var ArrQoMain = new Array();

    var SupNum = $("#SuppliesSelectOption").val();

    var VendorSiteName = $("#SuppliesSelectOption").find("option:selected").text();

    var SupLoc = $("#selSuppliesLocation").val();

    var InvoiceAddress = $("#selSuppliesLocation").find("option:selected").text();

    var SupCtr = $("#textSuppliesContacter").val();
    var CtrEmail = $("#textSuppliesEmail").val();
    var CurrencyCode = $("#selCurrency").val();

    var isStakeHolder = $("#isStakeHolder").text().trim();
    var StakeholdersReason = $("#textStakeholders").val().trim();

    var LoginEno = $("#LoginEno").val().trim();
    var LoginName = $("#LoginName").val().trim();

    var PrNum = $("#hidPRNum").val();

    var j = 0;
    var ArrQoDet = new Array();
    $("#QuoteTrAppend").find("tr[name=QuotrData]").each(function () { // var ObjPr = $(this).parents("tbody[alt=NewPRInfoCell]").next("[alt=PRInfoDetail]").html();
        var objQuo = $(this).find("[name=QuoPrice]");
        var nObj = new Object();

        nObj.Price = objQuo.val();
        nObj.PRDetailId = objQuo.attr('pritemid');

        ArrQoDet[j] = nObj;
        j++;
    })

    var QoObj = new Object();

    QoObj.PRNum = PrNum;
    QoObj.VendorNum = SupNum;
    QoObj.VendorSiteName = VendorSiteName;

    QoObj.LoginEno = LoginEno;
    QoObj.LoginName = LoginName;

    QoObj.VendorSiteId = SupLoc;
    QoObj.InvoiceAddress = InvoiceAddress;

    QoObj.ContactPerson = SupCtr;
    QoObj.ContactEmail = CtrEmail;
    QoObj.CurrencyCode = CurrencyCode;
    QoObj.isStakeHolder = isStakeHolder;
    QoObj.StakeholdersReason = StakeholdersReason;

    QoObj.QoDet = ArrQoDet;

    var jsonText = "";
    if (SupNum != "") {
        jsonText = JSON.stringify(QoObj);
    } else {
        jsonText = "";
    }

    //if (ArrQoMain.length > 0) {
    //    jsonText = JSON.stringify(ArrQoMain);
    //}
    //else {
    //    jsonText = "";
    //}
    return jsonText;
}

function fun_QuoteDbAdd() {
    rtn = true;

    var InsData = QuoteData_JsonSet();

    $.ajax({
        type: 'POST',
        url: '/PR/QuoteDbAdd',
        data: {
            InsertData: InsData
        },
        success: function (data) {
            if (data != null) {
                var aGetD = $("#QuotationInfoTable").find("tr[name=QoPrDetID]").each(function () {
                    var QurDetClic = $(this).find("[name=QuoDetListClick]");
                    fun_QuotationInfo_ResetDetail(QurDetClic);
                })
            }
        }
, error: function (xhr) {
    alert('報價新增,發生錯誤!');
}
    });

    return rtn;
}

//重設定 「請購單」本頁 報價資料...
function fun_QuotationInfo_ResetDetail(target) {
    $(this).closest("tbody").find("[name^=trQuoSet]").show();

    var QuotationInfoDetial = $(target).closest('tr').next(["alt=QuotationInfoDetial"]);

    var trPRDetailID = $(target).next(["name=hidQuoPRDetailID"]).val();
    var QdetTab = $(target).closest('tr').next(["alt=QuotationInfoDetial"]).find("tbody");

    QuoName = $(this).find("[name='hidQuoteEmp']").val();

    var chkQoObj = $(target).closest('tr').find("[name=chkQo]");
    //if ($(chkQoObj).prop("checked") == true) {
    //    var testStr = "";
    //}

    $(QdetTab).html('');

    var strSec = '';

    strSec = '        <tr>\
      <th class="th-title-1 note-text-s" style="color: #2eaf92">報價編號</th>\
    <th class="th-title-1 note-text-s" style="color: #2eaf92">供應商</th>\
    <th class="th-title-1 note-text-s" style="color: #2eaf92">供應商發票地點</th>\
    <th class="th-title-1 note-text-s" style="color: #2eaf92">聯絡人</th>\
    <th class="th-title-1 note-text-s" style="color: #2eaf92">幣別</th>\
    <th class="th-title-1 note-text-s" style="color: #2eaf92">匯率</th>\
    <th class="th-title-1 note-text-s" style="color: #2eaf92">原幣報價單價</th>\
    <th class="th-title-1 note-text-s" style="color: #2eaf92">台幣報價單價</th>\
    <th class="th-title-1 note-text-s" style="color: #2eaf92">報價日期</th>\
    <th class="th-title-1 note-text-s" style="color: #2eaf92"></th>\
                            </tr>';

    //====================================================================================

    $.ajax({
        type: 'POST',
        url: '/PR/QuoteDetailListGet',
        data: {
            PRDetailID: trPRDetailID
        },
        success: function (data) {
            if (data.length > 0) {
                var ValidY = ""; var ValidN = "";
                for (var j = 0; j < data.length; j++) {
                    if (data[j].IsEnabled == true) {
                        ValidY = "checked";
                        ValidN = "";
                    } else {
                        ValidY = "";
                        ValidN = "checked";
                    }
                    strSec = strSec + '  <tr alt="ItemQoInfo">\
                        <td alt="QDetailID"> <div class="Links"><div class="Links-n"><a name="QDid" href="#" target="_blank">' + data[j].QDetailID + '</a></div></div></td>\
                        <td><span class="note-text-s" style="color: #2eaf92">' + data[j].VendorSiteName + '</span></td>\
                        <td><span class="note-text-s" style="color: #2eaf92">' + data[j].InvoiceAddress + '</span></td>\
                        <td><span class="note-text-s" style="color: #2eaf92">' + data[j].ContactPerson + '</span>\
                              <input name="hidQuoteEmp" type="hidden" value="' + data[j].QuoteEmpName.trim() + '(' + data[j].QuoteEmpNum.trim() + ')" />\
                               <input name="hidStakeHolder" type="hidden" value="' + data[j].StakeHolder + '"/> </td>\
                        <td alt="ItemCurCode"><span class="note-text-s" style="color: #2eaf92">' + data[j].CurrencyCode + '</span></td>\
                        <td alt="ItemExcRate"><span class="note-text-s" style="color: #2eaf92">' + data[j].ExchangeRate + '</span></td>\
                        <td alt="ItemForPri"><span class="note-text-s" style="color: #2eaf92">' + data[j].ForigenPrice + '</span></td>\
                        <td alt="ItemNTD"><span class="note-text-s" style="color: #2eaf92">' + data[j].Price + '</span></td>\
                        <td><span class="note-text-s" style="color: #2eaf92">' + data[j].strCreateTime + '</span></td>\
                        <td>\
                            <div class="cell">\
                                <label>\
                                    <input ' + ValidY + '  name="QuotationInfoDetial_radion_' + trPRDetailID + '_' + data[j].QDetailID + '" type="radio" value="true"><span class="note-text-s" style="color: #2eaf92">生效</span>\
                                </label>\
                            </div>\
                            <div class="cell">\
                                <label>\
                                    <input ' + ValidN + ' name="QuotationInfoDetial_radion_' + trPRDetailID + '_' + data[j].QDetailID + '" type="radio" value="false"><span class="note-text-s" style="color: #2eaf92">失效</span>\
                                </label>\
                            </div>\
                        </td>\
                    </tr>';
                }  //  for (var j = 0 ; j < data.length; j++) {
                $(QdetTab).append(strSec);

                var RstHigSet = fun_QuoteHighestSet(chkQoObj);      //重新檢查-最高報價...
            } else {  //            if (data.length > 0) {
                strSec = '       <tr>\
                <td colspan="10"><span class="note-text-s" style="color: #2eaf92">無相關報價明細資料</span></td>\
                 </tr>';

                $(QdetTab).append(strSec);
            }   //            if (data.length > 0) {....end

            $(this).closest("tbody").find("[name^=trQuoSet]").hide();
        }
    });
    // }

    //=====================================================================================
}

//最高報價..資料設定..begin........
function fun_QuoteHighestSet(target) {
    highesthNTD = 0;

    $(this).closest("tbody").find("[name^=trQuoSet]").show();

    var PrDetId = $(target).closest("tr").attr("pritemid");
    var higCurcode = ""; var higExcRate = 0; var higForPri = 0; var QuoEmp = ""; var StaHol = "False";

    if ($(target).prop("checked") == true) {
        $(target).closest("tr").next("tr[alt=QuotationInfoDetial]").find("tr[alt=ItemQoInfo]").each(function () {
            if ($(this).find("input[type='radio']:checked").val() == "true" && accounting.unformat($(this).find("[alt='ItemNTD']").text()) > highesthNTD) {
                highesthNTD = accounting.unformat($(this).find("[alt='ItemNTD']").text());
                higCurcode = $(this).find("[alt='ItemCurCode']").text();
                higExcRate = $(this).find("[alt='ItemExcRate']").text();
                higForPri = $(this).find("[alt='ItemForPri']").text();
                QuoEmp = $(this).find("[name='hidQuoteEmp']").val();
                StaHol = $(this).find("[name='hidStakeHolder']").val();
            }
        })

        if (highesthNTD == 0) {
            //  alert("查無有效報價")
            ////   $(target).prop("checked", false)
        }
        else {
            $(target).closest("tr").find("[name=highestNTD]").text(fun_accountingformatNumberdelzero(highesthNTD));
            $(target).closest("tr").find("[name=QryCurrencyCode]").text(higCurcode);
            $(target).closest("tr").find("[name=QryExchangeRate]").text(higExcRate);

            $(target).closest("tr").find("[name=QuoEmpName]").text(QuoEmp);

            $(target).closest("tr").find("[name=hidPriStakeHolder]").val(StaHol);

            $(target).closest("tr").next("tr[alt=QuotationInfoDetial]").find("tr[alt=ItemQoInfo]").each(function () {
                $(this).find("input[type='radio']").attr("disabled", "disabled")
            })

            //回寫 PROnceDetail....

            $("#PROneTimeDetailTable").find('td.DetailSerno').each(function () {   //#PROneTimeDetailTable
                // $("table[name=OnceDetailTable]").find("[alt=PRInfoIndex]").each(function () {
                var hidPRDetId = $(this).nextAll("[name=POItem]").children("[name=hidPRDetailID]").val();

                if (PrDetId == hidPRDetId) {
                    //$(this).parents("tbody[alt=NewPRInfoCell]").next("[alt=PRInfoDetail]").find("tr[name=trGreen]").children("td[name=CurrencyCode]").children("span").text(higCurcode);
                    //$(this).parents("tbody[alt=NewPRInfoCell]").next("[alt=PRInfoDetail]").find("tr[name=trGreen]").children("td[name=ExchangeRate]").children("span").text(higExcRate);
                    //$(this).parents("tbody[alt=NewPRInfoCell]").next("[alt=PRInfoDetail]").find("tr[name=trGreen]").children("td[name=ForeignPrice]").children("span").text(higForPri);
                    //$(this).parents("tbody[alt=NewPRInfoCell]").next("[alt=PRInfoDetail]").find("tr[name=trPrice]").children("td[name=Price]").children("span").text(highesthNTD);

                    var trGreen = $(this).closest("tr").nextAll("[name=trGreen]");
                    //  var trPro = $(this).closest("tr").nextAll("[name=trRecPrompt]");

                    fun_ClassReset($(this).nextAll("[name=CurrencyCode]").children("b"));
                    fun_ClassReset($(this).nextAll("[name=ExchangeRate]").children("b"));
                    fun_ClassReset(trGreen.find("[name=ForeignPrice]").children("b"));
                    fun_ClassReset(trGreen.find("[name=Price]").children("b"));

                    var CurrencyCode = $(this).nextAll("[name=CurrencyCode]").children("b").text(higCurcode);
                    var ExchangeRate = $(this).nextAll("[name=ExchangeRate]").children("b").text(higExcRate);
                    var ForeignPrice = trGreen.find("[name=ForeignPrice]").children("b").text(higForPri);
                    var Price = trGreen.find("[name=Price]").children("b").text(highesthNTD);
                }   // if (PrDetId == hidPRDetId) {................
            })  //    $("#PROneTimeDetailTable").find('td.DetailSerno').each(function () {   //#PROneTimeDetailTable
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/PR/QuoteToPurDet',
                data: {
                    PrDetId: PrDetId, highesthNTD: highesthNTD, Curcode: higCurcode, ExcRate: higExcRate, ForPri: higForPri, QuoEmp: QuoEmp, StakeHolder: StaHol
                },
                success: function (data) {
                    if (data == "true") {
                        // alert("Update-DBPr報價成功!");
                    } else {
                        //  alert("Update-DBPr報價失敗!");
                    }
                }
            });
        }
    }
    else {
        $(target).closest("tr").find("[name=highestNTD]").text("");
        $(target).closest("tr").find("[name=QryCurrencyCode]").text("");
        $(target).closest("tr").find("[name=QryExchangeRate]").text("");

        $(target).closest("tr").find("[name=QuoEmpName]").text("");
        $(target).closest("tr").find("[name=hidPriStakeHolder]").val("");

        $(target).closest("tr").next("tr[alt=QuotationInfoDetial]").find("tr[alt=ItemQoInfo]").each(function () {
            $(this).find("input[type='radio']").removeAttr("disabled")
        })

        $("#PROneTimeDetailTable").find('td.DetailSerno').each(function () {   //#PROneTimeDetailTable
            // $("table[name=OnceDetailTable]").find("[alt=PRInfoIndex]").each(function () {
            var hidPRDetId = $(this).nextAll("[name=POItem]").children("[name=hidPRDetailID]").val();

            if (PrDetId == hidPRDetId) {
                var trGreen = $(this).closest("tr").nextAll("[name=trGreen]");

                var CurrencyCode = $(this).nextAll("[name=CurrencyCode]").children("b").text('系統自動帶入');
                var ExchangeRate = $(this).nextAll("[name=ExchangeRate]").children("b").text('系統自動帶入');
                var ForeignPrice = trGreen.find("[name=ForeignPrice]").children("b").text('系統自動帶入');
                var Price = trGreen.find("[name=Price]").children("b").text('系統自動帶入');
            }   // if (PrDetId == hidPRDetId) {................
        })  //    $("#PROneTimeDetailTable").find('td.DetailSerno').each(function () {   //#PROneTimeDetailTable
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/PR/QuoteToPurDet',
            data: {
                PrDetId: PrDetId, highesthNTD: highesthNTD, Curcode: higCurcode, ExcRate: higExcRate, ForPri: higForPri, QuoEmp: QuoEmp
            },
            success: function (data) {
                if (data == "true") {
                    //  alert("Update-DB報價取消成功!");
                } else {
                    //  alert("Update-DB報價取消失敗!");
                }
            }
        });
    }

    $(this).closest("tbody").find("[name^=trQuoSet]").hide();
    return highesthNTD;
}

//「請購單」本頁 --已報價明細..內容...
function fun_QuotationInfo_GetDetail(target) {
    $(this).closest("tbody").find("[name^=trQuoSet]").show();
    var QuotationInfoDetial = $(target).closest('tr').next(["alt=QuotationInfoDetial"]);

    var chkQoObj = $(target).closest('tr').find("[name=chkQo]");
    var YnDisabled = "";

    if ($(chkQoObj).prop("checked") == true) {
        YnDisabled = "disabled";
    }

    var chkQoObj = $(target).closest('tr').find("[name=chkQo]");
    //if ($(chkQoObj).prop("checked") == true) {
    //    var testStr = "";
    //}

    var trPRDetailID = $(target).next(["name=hidQuoPRDetailID"]).val();
    // var QdetTab = $(target).closest('tr').next(["alt=QuotationInfoDetial"]).find("tbody");

    var QdetTab = $("#QuotationInforemodal").find("tbody");

    $(QdetTab).html('');

    var strSec = '';

    strSec = '        <tr>\
     <th class="th-title">報價編號</th>\
    <th class="th-title">供應商</th>\
   <th class="th-title">供應商發票地點</th>\
   <th class="th-title">聯絡人</th>\
  <th class="th-title">幣別</th>\
   <th class="th-title">匯率</th>\
   <th class="th-title">原幣報價單價</th>\
  <th class="th-title">台幣報價單價</th>\
    <th class="th-title">報價日期</th>\
  <th class="th-title">\
    <input name="hidQoPrDetID" type="hidden" value="' + trPRDetailID + '" /></th>\
                            </tr>';

    //====================================================================================
    //if ($(QuotationInfoDetial).is(':visible')) {
    //    $(QuotationInfoDetial).hide(200)
    //}
    //else {
    $.ajax({
        type: 'POST',
        url: '/PR/QuoteDetailListGet',
        data: {
            PRDetailID: trPRDetailID
        },
        success: function (data) {
            if (data.length > 0) {
                var ValidY = ""; var ValidN = "";
                for (var j = 0; j < data.length; j++) {
                    if (data[j].IsEnabled == true) {
                        ValidY = "checked";
                        ValidN = "";
                    } else {
                        ValidY = "";
                        ValidN = "checked";
                    }
                    strSec = strSec + '  <tr alt="ItemQoInfo">\
                     <td alt="QDetailID"> <div class="Links"><a  name="QDid"  href="#" target="_blank">' + data[j].QDetailID + '</a></div></td>\
                        <td>' + data[j].VendorSiteName + '</td>\
                        <td>' + data[j].InvoiceAddress + '</td>\
                        <td>' + data[j].ContactPerson + '\
                                <input name="hidQuoteEmp" type="hidden" value="' + data[j].QuoteEmpName.trim() + '(' + data[j].QuoteEmpNum.trim() + ')" /> </td>\
                        <td alt="ItemCurCode">' + data[j].CurrencyCode + '</td>\
                        <td alt="ItemExcRate">' + data[j].ExchangeRate + '</td>\
                        <td alt="ItemForPri">' + data[j].ForigenPrice + '</td>\
                        <td alt="ItemNTD">' + data[j].Price + '</td>\
                        <td>' + data[j].strCreateTime + '</td>\
                        <td>\
                            <div class="cell">\
                                <label>\
                                    <input ' + ValidY + ' onchange="UpdQuoEnb(this)"   name="QuotDetChang_' + trPRDetailID + '_' + data[j].QDetailID + '" type="radio" ' + YnDisabled + ' value="true"><span class="success-text">生效</span>\
                                </label>\
                            </div>\
                            <div class="cell">\
                                <label>\
                                    <input ' + ValidN + '  onchange="UpdQuoEnb(this)"  name="QuotDetChang_' + trPRDetailID + '_' + data[j].QDetailID + '" type="radio" ' + YnDisabled + ' value="false"><span class="success-text">失效</span>\
                                </label>\
                            </div>\
                        </td>\
                    </tr>';
                }  //  for (var j = 0 ; j < data.length; j++) {
                $(QdetTab).append(strSec);

                $("#QuotationInforemodal").remodal().open();
            } else {  //            if (data.length > 0) {
                strSec = '       <tr>\
                <td colspan="10"><span class="success-text">無相關報價明細資料</span></td>\
                 </tr>';
                // strSec = strSec + '</tbody>';
                $(QdetTab).append(strSec);
                $("#QuotationInforemodal").remodal().open();
            }   //            if (data.length > 0) {....end
        }
    });
    // }  //if ($(QuotationInfoDetial).is(':visible')) {
    $(this).closest("tbody").find("[name^=trQuoSet]").hide();

    //=====================================================================================
}

//「請購單」本頁 --已報價明細...生失效 修改回傳...
function UpdQuoEnb(target) {
    var i = 0;

    var QuoTab = $(target).closest("tr");
    QDetailID = $(QuoTab).find('a[name=QDid]').text();

    QdEnbSel = $(QuoTab).find('[name^=QuotDetChang]:checked').val();

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/PR/QuoteToEnable',
        data: {
            QDetailID: QDetailID, IsEnabled: QdEnbSel
        },
        success: function (data) {
            if (data == "true") {
                // alert("生失效update成功!");
            } else {
                // alert("生失效update失敗!");
            }
        }
    });

    //var QdetTab = $("#QuotationInforemodal").find("tbody");
}

//報價單回寫DB..與..DB撈取.....end....

//page_load  的 預設change -ajax 設定.....begin....
function ObjEventSet() {
    $("#SuppliesSelectOption").change(function () {
        $("#SuppliesSelectOption").setSelectOption($("#selSuppliesLocation"), "set", null)
        var supplierNumber = $(this).val();
        if (supplierNumber != "" && supplierNumber != null) {
            $.ajax({
                type: 'POST',
                url: '/PR/SuppliesListGet',
                data: {
                    SupplierNumber: supplierNumber, SName: '', SuppliesIdNumber: ''
                },
                success: function (data) {
                    var Itmlist = new Array();
                    if (data.length > 0) {
                        var ArrSuppSite = data[0].SupplierSiteList;

                        var isStakeHolder = data[0].isStakeHolder;

                        $("#isStakeHolder").text(isStakeHolder);

                        for (var h = 0; h < ArrSuppSite.length; h++) {
                            Itmlist[h] = [ArrSuppSite[h].invoiceAddress, ArrSuppSite[h].locationID];
                        }

                        $("#SuppliesSelectOption").setSelectOption($("#selSuppliesLocation"), "set", Itmlist)
                    }
                }
            });
        }
    })

    $("#SelPrjCat").change(function () {
        $("#SelPrjCat").setSelectOption($("#SelPrj"), "set", null)
        $("#SelPrj").setSelectOption($("#SelPrjItem"), "set", null)
        var prjCat = $(this).val();
        $.ajax({
            type: 'POST',
            url: '/PR/ProjectListGet',
            data: {
                ProjectCategoryID: prjCat
            },
            success: function (data) {
                list = new Array()
                i = 0;
                if (data.length > 0) {
                    for (var j = 0; j < data.length; j++) {
                        list[i] = [data[j].ProjectName, data[j].ProjectID]
                        i++;
                    }
                    $('#SelPrj').prop("disabled", false);
                    $('#SelPrjItem').prop("disabled", true);
                    $("#SelPrjCat").setSelectOption($("#SelPrj"), "set", list);
                } else {
                    alert("無相關「專案」資料!");
                }
            }
        });
    })

    $("#SelPrj").change(function () {
        $("#SelPrj").setSelectOption($("#SelPrjItem"), "set", null)
        var prjId = $(this).val();
        $.ajax({
            type: 'POST',
            url: '/PR/ProjectItemListGet',
            data: {
                ProjectID: prjId
            },
            success: function (data) {
                var Itmlist = new Array();
                if (data.length > 0) {
                    for (var j = 0; j < data.length; j++) {
                        Itmlist[j] = [data[j].ProjectTask, data[j].ProjectItemID]
                    }
                    $('#SelPrjItem').prop("disabled", false);
                    $("#SelPrj").setSelectOption($("#SelPrjItem"), "set", Itmlist);
                } else {
                    alert("無相關「專案項目」資料!");
                }
            }
        });
    })

    $("#chkConsultant").click(function () {
        $("#textPRamount").val(accounting.unformat($("#textPRamount").val()));
        $("#textPRamount").attr('maxlength', '13');
        fun25001_PRamountCheck($("#textPRamount"));

        var QuoAmt = parseFloat(accounting.unformat($("#ContractTotalAmount").text()));
        var YnStaHoder = $("#hidQuoYnStakeHolder").val();
        if (QuoAmt > 0) {
            fun25001_POAmountCheck(QuoAmt, YnStaHoder, 'set');
        }
    })

    $("a[name^=InvalidPRitemList]").on("click", function () {
        var PrIdVal = $(this).next("[name=hidPRDeliveryID]").val();  //60;

        $.ajax({
            type: 'POST',
            url: '/PR/InvalidPRitemListGet',
            data: {
                PRDeliveryID: PrIdVal
            },
            success: function (data) {
                list = new Array()
                i = 0;
                if (data.length > 0) {
                    for (var j = 0; j < data.length; j++) {
                        list[i] = [data[j].ChargeDept, data[j].RcvDept, data[j].CancelEmpName, data[j].strCancelDate, data[j].Quantity, data[j].CancelReason]
                        i++;
                    }

                    if (list.length > 0) {
                        $("#trInvalidPR").html("");

                        $(list).each(function () {
                            $("#trInvalidPR").append(
                         '  <tr>\
                            <td>' + $(this)[0] + '</td>\
                            <td>' + $(this)[1] + '</td>\
                           <td>' + $(this)[2] + '</td>\
                             <td>' + $(this)[3] + '</td>\
                             <td>' + $(this)[4] + '</td>\
                             <td>' + $(this)[5] + '</td>\
                    </tr>\
                ');
                        })
                    }
                }  //if (data.length > 0) {
            }
        });

        $('[data-remodal-id=InvalidPRitemList]').remodal().open();
    })

    $("a[name^=InvalidPOitemList]").on("click", function () {
        var POIdVal = $(this).next("[name=hidPODeliveryID]").val();  //5:

        $.ajax({
            type: 'POST',
            url: '/PR/InvalidPOitemListGet',
            data: {
                PODeliveryID: POIdVal
            },
            success: function (data) {
                list = new Array()
                i = 0;
                if (data.length > 0) {
                    for (var j = 0; j < data.length; j++) {
                        list[i] = [data[j].ChargeDept, data[j].RcvDept, data[j].CancelEmpName, data[j].strCancelDate, data[j].Quantity,
                           data[j].UnitPrice, data[j].CancelReason]
                        i++;
                    }

                    if (list.length > 0) {
                        $("#trInvalidPO").html("");

                        $(list).each(function () {
                            $("#trInvalidPO").append(
                         '  <tr>\
                            <td>' + $(this)[0] + '</td>\
                            <td>' + $(this)[1] + '</td>\
                           <td>' + $(this)[2] + '</td>\
                             <td>' + $(this)[3] + '</td>\
                             <td>' + $(this)[4] + '</td>\
                             <td>' + $(this)[5] + '</td>\
                              <td>' + $(this)[6] + '</td>\
                    </tr>\
                ');
                        })
                    }
                }  //if (data.length > 0) {
            }
        });

        $('[data-remodal-id=InvalidPOitemList]').remodal().open();
    })

    $(document).on('click', '#POItemGet', function () {
        $("#popPOitemList").remodal().open();
    });

    $(document).on('click', '#AddPersonGet', function () {
        $("#popAddperson").remodal().open();
    });

    $(document).on('click', '#SuppliesQry', function () {
        $('[data-remodal-id=SearchSupplies]').remodal().open();

        // $("#SearchSupplies").remodal().open();
    });
}   //function ObjEventSet() {......

//人員選擇器ACTION
function QueryTempForVendor(datas) {
    var context = "";

    if (datas.length > 0) {
        var PeoNum = $("#hidPeopleNum").val();

        var context = datas[0].user_name.replace(/\d+/, "").replace(/\s+/, "") + "(" + datas[0].user_id + ")";

        $("#PROneTimeDetailTable").children('tbody').find('.DetailSerno').filter(function () {
            return $(this).text() == PeoNum
        }).closest('tr').nextAll('tr[name=trGreen]').children("[alt=Addperson]").children("span").text(context);
    }
}

function setPicker(target) {
    var filtnum = $(target).closest('tbody').find('.DetailSerno').text();

    $("#hidPeopleNum").val(filtnum);
}

function CategoryChange(target) {
    var CatSel = $(target).val();

    $.ajax({
        type: 'POST',
        url: '/PR/POCategoryListGet',
        data: {
            CategoryId: CatSel
        },
        success: function (data) {
            list = new Array()
            i = 0;
            var EmpNum = ""; var EmpName = "";
            if (data.length > 0) {
                for (var j = 0; j < data.length; j++) {
                    if (data[j].CategoryId == CatSel) {
                        EmpNum = data[j].PurchaseEmpNum;
                        EmpName = data[j].PurchaseEmpName;
                    }
                }
                // var selRcv = $(target).parents("td[name=CategoryName]").nextAll("td[name=PurchaseTd]").find("[name=PurchaseSel]");

                var selRcv = $(target).closest("tr").nextAll("tr[name=trGreen]").children("td[name=PurchaseTd]").find("[name=PurchaseSel]");

                setDefaultSelect(selRcv, EmpNum);

                EmpName = EmpName + "(" + EmpNum + ")";
                $(target).closest('tr').nextAll('tr[name=trGreen]').children("[alt=Addperson]").children("span").text(EmpName);

                fun_ClassReset($(target).closest('tr').nextAll('tr[name=trGreen]').children("[alt=Addperson]").children("span"));
            }
        }
    });
}

//page_load  的 ajax 預設設定.....begin....
function AjaxListGet() {
    $.ajax({
        type: 'Post',
        url: '/PR/PriceStandardListGet',
        data: {
            PriceKind: ''
        },
        success: function (data) {
            if (data.length > 0) {
                for (var j = 0; j < data.length; j++) {
                    var nObj = new Object();
                    nObj.PriceKind = data[j].PriceKind;
                    nObj.ItemNo = data[j].ItemNo;
                    nObj.ItemName = data[j].ItemName;
                    nObj.MinAmount = data[j].MinAmount;
                    nObj.MaxAmount = data[j].MaxAmount;
                    LevelList[j] = nObj;
                    // LevelList[j] = [data[j].PriceKind, data[j].ItemNo, data[j].ItemName, data[j].MinAmount, data[j].MaxAmount];
                }
            }
        }
    });

    $.ajax({
        type: 'POST',
        url: '/PR/DeptListGet',
        data: {
            name: 'John', location: 'Boston'
        },
        success: function (data) {
            if (data.length > 0) {
                for (var j = 0; j < data.length; j++) {
                    DeptList[j] = [data[j].DeptName, data[j].DeptCode, data[j].DeptBelong];
                }
            }
        }
    });

    var token = "j";
}

//ajax 設定.....end....

//進入Edit,ReadOnly,CheckOut 時畫面設定...
function EditSet() {
    ////核選方塊----------begin.......
    // if ($("#chkConfidential").prop("checked")) {//
    var YnQuo = $("input[name=chkConfidential]:checked").val();
    if (YnQuo != undefined) {
        if (YnQuo == "on") {
            $('#divEcryptionAlertMessage').show()

            var txtDate = $('#textDecryptDate').val();

            if (txtDate.indexOf('3000') > -1) {
                $('#textDecryptDate').val('');
            }

            $('#textDecryptDate').prop("readonly", false);
            $('#textDecryptDate').removeClass('input-disable');

            $('#spanCalendar').removeClass('input-disable');
        }
        else {
            $('#divEcryptionAlertMessage').hide()
            $('#textDecryptDate').prop("readonly", true);
            $('#textDecryptDate').addClass('input-disable');
            $('#spanCalendar').addClass('input-disable');
        }
    }

    var amount = $("#textPRamount").val();

    amount = fun_accountingformatNumberdelzero(amount)
    $("#textPRamount").attr("maxlength", amount.length)
    $("#textPRamount").val(amount);

    var n = 0;

    $("tr[alt^=NewDeliveryCell]").each(function () {
        var nDcom = $(this).find($("td[name=DevAmount]"));
        nDcom.text(fun_accountingformatNumberdelzero(nDcom.text()));

        var selChar = $(this).find("[name=ChargeDept]");
        var hidChar = $(this).find("[name=hidChargeDept]");
        setDefaultSelect(selChar, hidChar.val());

        var selRcv = $(this).find("[name=RcvDept]");
        var hidRcv = $(this).find("[name=hidRcvDept]");
        setDefaultSelect(selRcv, hidRcv.val());
    })

    $("tbody[alt^=NewPRInfoCell]").each(function () {
        var selChar = $(this).find("[name=CategorySel]");
        var hidChar = $(this).find("[name=hidCategorySel]");
        setDefaultSelect(selChar, hidChar.val());

        var selCode = $(this).find("[name=UomCodeSel]");
        var hidCode = $(this).find("[name=hidUomCodeSel]");
        setDefaultSelect(selCode, hidCode.val());

        if (hidCode.val() == 'AMT') {
            // if (hidCode.val() == '0') {
            $(selCode).closest("td").prev("[alt=td_PRInfoUnitpcs]").children("span").show()
            $(selCode).closest("td").prev("[alt=td_PRInfoUnitpcs]").children("input").hide()
        } else {
            $(selCode).closest("td").prev("[alt=td_PRInfoUnitpcs]").children("span").hide()
            $(selCode).closest("td").prev("[alt=td_PRInfoUnitpcs]").children("input").show()
        }

        var selRcv = $(this).find("[name=PurchaseSel]");
        var hidRcv = $(this).find("[name=hidPurchaseSel]");
        setDefaultSelect(selRcv, hidRcv.val());

        var selGreen = $(this).find("[name=GreenPurchasing]");
        var hidGreen = $(this).find("[name=hidGreenCategory]");
        setDefaultSelect(selGreen, hidGreen.val());
    })

    //$("[alt='PRInfoTable']").on("click", "[alt=linkpopPOitemList]", function () {
    //    fun_popPOitemList_Send($(this))
    //})
}

//設定Select預設值
function setDefaultSelect(target, value) {
    $(target).find("option[value='" + value + "']").attr("selected", "selected")
    $(target).selectpicker('refresh');
    $(target).change()
}

//請購單..年度議價採購..Detail...寫入Db設定...
function DetailYC_JsonSet() {
    var ArrYCDetMain = new Array();

    $("#ENPDetailTable").find('td.DetailSerno').each(function () {   //#PROneTimeDetailTable
        var i = $(this).text();

        var DetPri = $(this).closest("tr").nextAll("[name=trPrice]");

        if (parseInt(i) > 0) {
            var PRDetailID = $(this).nextAll("[name=POItem]").children("[name=hidPRDetailID]").val();

            var YCDetailID = $(this).nextAll("[name=POItem]").children("[name=hidYCDetailID]").val();
            var PrQty = $(this).nextAll("[name=QuantityPurchase]").children("b").text();

            var DvyPro = DetPri.find("[name=DeliveryPrompt]").val();

            var j = 0;

            var ArrYCDetDev = new Array();

            $(this).closest("tbody").find("[name^=trPRDev]").show();
            $(this).closest("tbody").find("[name=tabDevyDet]").find("tr[name^=trDevyDet]").each(function () {
                var nObj = new Object();

                var PrDvyId = $(this).find("[name=hidPRDeliveryID]").val().trim();
                nObj.PRDeliveryID = PrDvyId == "" ? "0" : PrDvyId;

                nObj.ChargeDept = $(this).find("[name=ChargeDept]").text();
                nObj.RcvDept = $(this).find("[name=RcvDept]").text();
                var DevQty = $(this).find("[name=DevQuantity]").text();
                if (DevQty.trim() != "0") {
                    nObj.Quantity = accounting.unformat($(this).find("[name=DevQuantity]").text());
                    nObj.Amount = accounting.unformat($(this).find("td[name=DevAmount]").text());
                } else {
                    nObj.Quantity = "0";
                    nObj.Amount = "0";
                }

                ArrYCDetDev[j] = nObj;
                j++;
            })

            $(this).closest("tbody").find("[name^=trPRDev]").hide();

            var YCObj = new Object();

            var LoginEno = $("#LoginEno").val().trim();
            var LoginName = $("#LoginName").val().trim();

            YCObj.LoginEno = LoginEno;
            YCObj.LoginName = LoginName;

            YCObj.PRDetailID = PRDetailID;
            YCObj.YCDetailID = YCDetailID;

            YCObj.PRDQuantity = accounting.unformat(PrQty);
            YCObj.DvyPro = DvyPro;
            YCObj.DvyCont = ArrYCDetDev;
            if (YCDetailID != "") {
                ArrYCDetMain[i - 1] = YCObj;
            }
        }
    })

    var jsonText = "";

    if (ArrYCDetMain.length > 0) {
        jsonText = JSON.stringify(ArrYCDetMain);
    }
    else {
        jsonText = "";
    }

    $("#hidYCPurDetail").val(jsonText);
}

//請購單..一次性採購..Detail...寫入Db設定...
function DetailOnce_JsonSet() {
    var ArrOnceDetMain = new Array();
    // $("table[name=OnceDetailTable]").find('td.DetailSerno').each(function () {   //#PROneTimeDetailTable
    $("#PROneTimeDetailTable").find('td.DetailSerno').each(function () {   //#PROneTimeDetailTable
        var trGreen = $(this).closest("tr").nextAll("[name=trGreen]");

        var trPro = $(this).closest("tr").nextAll("[name=trRecPrompt]");

        var i = $(this).text();

        var CategoryId = $(this).nextAll("[name=CategoryName]").find("[name=CategorySel]").val();
        if (parseInt(i) > 0 && CategoryId != null) {
            var CategoryName = $(this).nextAll("[name=CategoryName]").find("[name=CategorySel]").find("option:selected").text();
            var PRDetailID = $(this).nextAll("[name=POItem]").children("[name=hidPRDetailID]").val();
            // var YCDetailID = $(this).nextAll("[name=POItem]").children("[name=hidYCDetailID]").val();

            var ItemDescription = $(this).nextAll("[name=POItem]").children("[name=ItemDescription]").val();

            //var PrQty = $(this).nextAll("[alt=td_PRInfoUnitpcs]").children("[name=QuantityPurchase]").val();
            var PrQty = $(this).nextAll("[name=QuantityPurchase]").children("b").text();

            var UomCode = $(this).nextAll("[name=UomCodeTd]").find("[name=UomCodeSel]").val();
            var UomName = $(this).nextAll("[name=UomCodeTd]").find("[name=UomCodeSel]").find("option:selected").text();

            if (UomName == "請選擇") {
                UomName = "";
            }

            var CurrencyCode = $(this).nextAll("[name=CurrencyCode]").children("b").text();
            var ExchangeRate = $(this).nextAll("[name=ExchangeRate]").children("b").text();

            var GreenPur = trGreen.find("[name=GreenPurchasing]").val();

            var PurchaseEmpNum = trGreen.find("[name=PurchaseSel]").val();
            var PurchaseEmpName = trGreen.find("[name=PurchaseSel]").find("option:selected").text();
            var InvoiceNam = trGreen.find("[alt=Addperson]").children("span").text().trim();

            var ForeignPrice = trGreen.find("[name=ForeignPrice]").children("b").text();
            var Price = trGreen.find("[name=Price]").children("b").text();

            var DvyPro = trPro.find("[name=DeliveryPrompt]").val();

            var j = 0;

            var tmpPrQty = 0;
            var ArrYCDetDev = new Array();

            $(this).closest("tbody").find("[name^=trPRDev]").show();
            $(this).closest("tbody").find("[name=tabDevyDet]").find("tr[name^=trDevyDet]").each(function () {
                var nObj = new Object();

                var PrDvyId = $(this).find("[name=hidPRDeliveryID]").val().trim();
                nObj.PRDeliveryID = PrDvyId == "" ? "0" : PrDvyId;

                nObj.ChargeDept = $(this).find("[name=ChargeDept]").text();
                nObj.RcvDept = $(this).find("[name=RcvDept]").text();
                var DevQty = $(this).find("[name=DevQuantity]").text();
                if (DevQty.trim() != "0") {
                    nObj.Quantity = accounting.unformat($(this).find("[name=DevQuantity]").text());
                    nObj.Amount = accounting.unformat($(this).find("td[name=DevAmount]").text());
                    tmpPrQty = tmpPrQty + accounting.unformat($(this).find("[name=DevQuantity]").text());
                } else {
                    nObj.Quantity = "0";
                    nObj.Amount = "0";
                }

                ArrYCDetDev[j] = nObj;
                j++;
            })

            $(this).closest("tbody").find("[name^=trPRDev]").hide();

            if (UomCode.toString().trim() == "AMT") {  //若選擇「金額」，數量固定為1
                PrQty = 1;
            } else {
                PrQty = tmpPrQty;
            }

            var YCObj = new Object();

            var LoginEno = $("#LoginEno").val().trim();
            var LoginName = $("#LoginName").val().trim();
            YCObj.LoginEno = LoginEno;
            YCObj.LoginName = LoginName;

            YCObj.PRDetailID = PRDetailID;
            YCObj.CategoryId = CategoryId;
            YCObj.CategoryName = CategoryName;
            YCObj.ItemDescription = ItemDescription;
            YCObj.Quantity = accounting.unformat(PrQty);
            YCObj.UomCode = UomCode;
            YCObj.UomName = UomName;
            YCObj.PurchaseEmpNum = PurchaseEmpNum;
            YCObj.PurchaseEmpName = PurchaseEmpName;
            YCObj.InvoiceEmp = InvoiceNam;
            YCObj.GreenCategory = GreenPur;

            if (CurrencyCode.trim() == "系統自動帶入") CurrencyCode = "";
            if (ExchangeRate.trim() == "系統自動帶入") ExchangeRate = "0";
            if (ForeignPrice.trim() == "系統自動帶入") ForeignPrice = "0";
            if (Price.trim() == "系統自動帶入") Price = "0";

            YCObj.CurrencyCode = CurrencyCode;
            YCObj.ExchangeRate = accounting.unformat(ExchangeRate);
            YCObj.ForeignPrice = ForeignPrice;
            YCObj.Price = Price;
            YCObj.DeliveryPrompt = DvyPro;

            YCObj.DvyCont = ArrYCDetDev;

            ArrOnceDetMain[i - 1] = YCObj;
        }
    })

    var jsonText = "";

    if (ArrOnceDetMain.length > 0) {
        jsonText = JSON.stringify(ArrOnceDetMain);
    }
    else {
        jsonText = "";
    }

    $("#hidOncePurDetail").val(jsonText);
}

function HtmlInitalSet() {
    $("textarea[name^=DeliveryPrompt]").focus(function () {
        $(this).val('');
    })

    $("#textPRTitle").focus(function () {
        if ($("[alt=PRTitleErr]").length > 0) {
            $("[alt=PRTitleErr]").remove();
        }
    })

    $("#textareaPRExplanation").focus(function () {
        if ($("[alt=PRExplanationErr]").length > 0) {
            $("[alt=PRExplanationErr]").remove();
        }
    })

    $("#checkHaveQuotation").click(function () {
        if (this.checked) {
            $("[alt=divRedstart]").show()
        }
        else {
            $("[alt=divRedstart]").hide()
        }
    })

    ////核選方塊----------begin.......
    //$("#chkConfidential").click(function () {
    //    if ($(this).prop("checked")) {
    //        $('#divEcryptionAlertMessage').show()
    //        $('#textDecryptDate').prop("readonly", false);
    //        $('#textDecryptDate').removeClass('input-disable');
    //        $('#spanCalendar').removeClass('input-disable');
    //    }
    //    else {
    //        $('#divEcryptionAlertMessage').hide()
    //        $('#textDecryptDate').prop("readonly", true);
    //        $('#textDecryptDate').addClass('input-disable');
    //        $('#spanCalendar').addClass('input-disable');
    //    }
    //})

    $("input[name=chkConfidential]").click(function () {
        //   $("#chkConf").click(function () {
        if ($(this).val() == "on") {
            $('#divEcryptionAlertMessage').show()
            $('#textDecryptDate').prop("readonly", false);
            $('#textDecryptDate').removeClass('input-disable');
            $('#spanCalendar').removeClass('input-disable');
            $('#EcryptionNote').show();

            //  $("#divEcryption").data("DateTimePicker").minDate(new Date());
        }
        else {
            $('#divEcryptionAlertMessage').hide()
            $('#textDecryptDate').prop("readonly", true);
            $('#textDecryptDate').addClass('input-disable');
            $('#spanCalendar').addClass('input-disable');
            $('#EcryptionNote').hide();
        }
    })

    $("#chkContract").click(function () {
        if ($(this).prop("checked")) {
            $(this).addSelTotarget($("#divCountersignature"), "法務處", "Low")
            $(this).addSelTotarget($("#div_Adddepartment_SelectedBox"), "法務處", "Low")
        }
        else {
            $("#divCountersignature").find(".Links-n").find("[val=Low]").closest(".Links").remove();
            $("#div_Adddepartment_SelectedBox").find(".Links-n").find("[val=Low]").closest(".Links").remove();
        }
    })

    $("#chkCore").click(function () {
        if ($(this).prop("checked")) {
            $(this).addSelTotarget($("#divCountersignature"), "個金處", "Money")
            $(this).addSelTotarget($("#div_Adddepartment_SelectedBox"), "個金處", "Money")
        }
        else {
            $("#divCountersignature").find(".Links-n").find("[val=Money]").closest(".Links").remove();
            $("#div_Adddepartment_SelectedBox").find(".Links-n").find("[val=Money]").closest(".Links").remove();
        }
    })
    //核選方塊

    ////預審金額欄位動作
    $("#textPRamount").focus(function () {
        if ($("[alt=PRamountErr]").length > 0) {
            $("[alt=PRamountErr]").remove();
        }

        //$(this).val(this.value.replace(/\,/g, ''));
        $(this).val(accounting.unformat($(this).val()));

        $(this).attr('maxlength', '13')

        //控制光標位置  *更改輸入框值後光標會移動到前面
        SelectionRange(this, this.value.length, this.value.length)
    })

    $("#textPRamount").blur(function () {
        fun25001_PRamountCheck(this)
    })
    ////預審金額欄位動作

    ////POP 報價單動作....begin...

    function fun_onfocusAction(target) {
        $(target).val(accounting.unformat($(target).val()));
        $(target).next("[Errmsg=Y]").remove();
        SelectionRange(target, $(target).val().length, $(target).val().length)
    }

    //報價單 計算總金額...
    function fun_Subtotal(target) {
        sourceCell = $(target).closest("tr")
        moneytype = $("#selCurrency").val();
        Price = accounting.unformat(sourceCell.find("td[alt='QOprice']").find("input").val());
        pcs = accounting.unformat(sourceCell.find("td[alt='QOItemPcs']").text());

        if (regNum(Price, true)) {
            sourceCell.find("td[alt='QOSubtotal']").text(fun_accountingformatNumberdelzero(accounting.toFixed((Price * pcs), 4)))
            fun_totalCount();
            $(target).val(fun_accountingformatNumberdelzero($(target).val()))
        }
        else {
            sourceCell.find("td[alt='QOSubtotal']").text("NaN")
            $("#textTotalCount").val("NaN");
            fun_AddErrMesg(target, "ErrNum", "數字輸入錯誤")
        }
    }

    function fun_totalCount() {
        total = 0;
        hasErr = false
        $("#tabQOItemList").find("[alt='QOSubtotal']").each(function () {
            subtotal = accounting.unformat($(this).text())
            if (regNum(subtotal, true)) {
                total = parseFloat(accounting.toFixed(total + subtotal, 4)) //accounting.toFixed 出來是字串
            }
            else {
                hasErr = true
                return false;
            }
        })
        if (!hasErr) {
            $("#textTotalCount").val(fun_accountingformatNumberdelzero(total));
        }
        else $("#textTotalCount").val("NaN");
    }
    //產生報價單時 之 Initial 設定.....
    $("#linkCreatQOInfo").on("click", function () {
        if ($("[name='chkQuote']:checked").length > 0) {
            QoItem = "";
            var ArrQuotDet = new Array();

            var j = 0;

            $("#QuoteTrAppend").html("");

            $("#QuoteTrAppend").append(
                 '    <tr>\
                    <th class="th-title-1 note-text-s" style="color: #2eaf92">編號</th>\
                    <th class="th-title-1 note-text-s" style="color: #2eaf92">採購分類</th>\
                    <th class="th-title-1 note-text-s" style="color: #2eaf92">品名描述</th>\
                    <th class="th-title-1 note-text-s" style="color: #2eaf92">需求數量</th>\
                    <th class="th-title-1 note-text-s" style="color: #2eaf92">單位</th>\
                    <th class="th-title-1 note-text-s" style="color: #2eaf92">原幣報價單價</th>\
                    <th class="th-title-1 note-text-s" style="color: #2eaf92">明細金額</th>\
                </tr>'
                    );

            $("[name='chkQuote']:checked").each(function () {
                QoItem += ";" + $(this).val();
                var PRDetailID = $(this).val();
                var QryRanID = $(this).closest("tr").find("[name=QryRanID]").text();
                var QryCategoryName = $(this).closest("tr").find("[name=QryCategoryName]").text();
                var QryItemDescription = $(this).closest("tr").find("[name=QryItemDescription]").text();
                var QryQuantity = $(this).closest("tr").find("[name=QryQuantity]").text();
                var QryUomName = $(this).closest("tr").find("[name=QryUomName]").text();
                var QryCurrencyCode = $(this).closest("tr").find("[name=QryCurrencyCode]").text();
                var QryExchangeRate = $(this).closest("tr").find("[name=QryExchangeRate]").text();
                var QryPurchaseEmpName = $(this).closest("tr").find("[name=QryPurchaseEmpName]").text();

                $("#QuoteTrAppend").append(  //產生報價單之「報價明細」
                 '  <tr name="QuotrData">\
                        <td><span class="note-text-s" style="color: #2eaf92">' + QryRanID + '</span></td>\
                        <td><span class="note-text-s" style="color: #2eaf92">' + QryCategoryName + '</span></td>\
                        <td><span class="note-text-s" style="color: #2eaf92">' + QryItemDescription + '</span></td>\
                       <td alt="QOItemPcs"><span class="note-text-s" style="color: #2eaf92">' + QryQuantity + '</span></td>\
                       <td><span class="note-text-s" style="color: #2eaf92">' + QryUomName + '</span></td>\
                        <td alt="QOprice">   <span class="note-text-s" style="color: #2eaf92">\
                       <input type="text" class="input" name="QuoPrice" value="" pritemid=' + PRDetailID + ' /></span></td>\
                     <td alt="QOSubtotal"><span class="note-text-s" style="color: #2eaf92">NaN</span></td> \
                    </tr>\
                ');

                j++;
            })
            $("#QoItem").val(QoItem)

            $(document).on('click', '#linkCreatQOInfo', function () {
                //報價明細動作
                $("#tabQOItemList").find("input").on("focus", function () {
                    $(this).next("[Errmsg='Y']").remove()
                    $(this).val(accounting.unformat($(this).val()))
                    SelectionRange(this, $(this).val().length, $(this).val().length)
                })

                $("#tabQOItemList").find("input").on("blur", function () {
                    fun_Subtotal(this)
                })
                //報價明細動作

                //供應商..資料取得...begin...

                $.ajax({
                    type: 'POST',
                    url: '/PR/SuppliesListGet',
                    data: {
                        SID: '', SName: '', SNumber: ''
                    },
                    success: function (data) {
                        var Itmlist = new Array();
                        if (data.length > 0) {
                            $("#SuppliesSelectOption").setSelectOption($("#SuppliesSelectOption"), "set", null)
                            for (var j = 0; j < data.length; j++) {
                                //Itmlist[j] = [data[j].SuppliesName, data[j].SuppliesID]

                                Itmlist[j] = [data[j].SuppliesName, data[j].SupplierNumber]
                            }
                            $("#SuppliesSelectOption").setSelectOption($("#SuppliesSelectOption"), "set", Itmlist)
                        }
                    }
                });

                //供應商..資料取得...end....

                //幣別..資料取得...begin...
                $.ajax({
                    type: 'POST',
                    url: '/PR/CurrencyListGet',
                    data: {
                        currencyCode: ''
                    },
                    success: function (data) {
                        var Itmlist = new Array();
                        if (data.length > 0) {
                            $("#selCurrency").setSelectOption($("#selCurrency"), "set", null)
                            for (var j = 0; j < data.length; j++) {
                                Itmlist[j] = [data[j].currencyName, data[j].currencyCode]
                            }
                            $("#selCurrency").setSelectOption($("#selCurrency"), "set", Itmlist)
                        }
                    }
                });

                //幣別..資料取得...end...
                $('[data-remodal-id=modal-QO]').remodal().open();

                //$('[data-remodal-id=SelectSupplies]').remodal().open();

                //$(document).on('click', '#suppliesConfirm', function () {
                //    //var remodelTemplete = $('[data-remodal-id=modal-QO]').find('div#Information').html();
                //    var selectSupplies = $('input[name="suppliesSelect"]:checked').parents('li');
                //    if (selectSupplies.length < 1) {
                //        alert("請選擇供應商")
                //    } else {
                //        resultOutput();
                //        BindingRemodel();
                //    }
                //});

                //$(document).on('closed', '[data-remodal-id=SelectSupplies]', function () {
                //    $('[data-remodal-id=modal-QO]').remodal().open();
                //});
            });
            //$("#formCreatQoInfo").submit();
        }
        else {
            alert("請先勾選報價品項")
        }
    })

    $("[name='chkQo']").on("click", function () {
        highesthNTD = 0;

        var RstHigSet = fun_QuoteHighestSet(this);

        if ($(this).prop("checked") == true && RstHigSet == 0) {
            alert("查無有效報價")
            $(this).prop("checked", false)
        }

        else {
            var YnAllChkd = true;

            var QuoAmt = 0;

            var YnStaHoder = "false";

            $("[name^='chkQo']").each(function () {
                if ($(this).prop('checked') == false) {
                    YnAllChkd = false;
                } else {
                    sourceCell = $(this).closest("tr")
                    var Qty = accounting.unformat(sourceCell.find("td[name='QryQuantity']").text());
                    var Price = accounting.unformat(sourceCell.find("td[name='highestNTD']").text());

                    if (YnStaHoder == "false") {
                        YnStaHoder = sourceCell.find("[name='hidPriStakeHolder']").val();
                    }

                    var MutPri = 0;
                    if (regNum(Price, true)) {
                        MutPri = accounting.toFixed((Price * Qty), 4);
                    } else {
                        fun_AddErrMesg(this, "ErrNum", "台幣最高報價單價 輸入錯誤")
                    }
                    QuoAmt = parseFloat(QuoAmt) + parseFloat(MutPri);
                }
            })  //  $("[name^='chkQo']").each(function () {
            if (YnAllChkd == true) {
                QuoAmt = accounting.toFixed(QuoAmt, 0);

                if (YnStaHoder == "") YnStaHoder = "false";
                fun25001_POAmountCheck(QuoAmt, YnStaHoder, 'set');

                QuoAmt = fun_accountingformatNumberdelzero(QuoAmt)
                $("#ContractTotalAmount").text(QuoAmt);
            } else {
                fun25001_POAmountCheck(0, "false", 'set');
                $("#ContractTotalAmount").text('0');
            }
        }

        var chk = $(this).parents('tr').find('td').find('input[type="checkbox"][name="chkQuote"]');
        if ($(this).prop('checked')) {
            $(chk).attr('disabled', 'disabled');
            $(chk).attr('checked', false);
        }
        else {
            $(chk).removeAttr('disabled', 'disabled');
        }
    })  //  $("[name='chkQo']").on("click", function () {
    //POP 報價單動作....end...

    $("#selNewsupplier").change(function () {
        if ($(this).val() == "Y") {
            $("#divShowNewsupplierMesg").css('visibility', '');
            $("[alt=NewsupplieUpload]").show(200)
        }
        else {
            $("#divShowNewsupplierMesg").css('visibility', 'hidden');
            $("[alt=NewsupplieUpload]").hide(200)
        }
    })

    $("[alt=NewsupplieUpload]").hide()

    $("#selpriceComparisonKind").on("change", function () {
        textpriceComparisonChange();
    })

    ////單位別異動...之連動...
    //$("[alt='PRInfoTable']").on("change", "[alt=sel_PRInfoUnit]", function () {
    //    if ($(this).val() == "AMT") {
    //        $(this).closest("td").prev("[name=QuantityPurchase]").children("b").text("1");
    //        fun_ClassReset($(this).closest("td").prev("[name=QuantityPurchase]").children("b"));
    //    }
    //})

    $("[alt='PRInfoTable']").on("click", "[alt=linkpopAddPerson]", function () {
        fun_popAddPerson_Send($(this))
        //alert($(this));
    })

    $("[alt='PRInfoTable']").on("click", "[alt=linkpopPOitemList]", function () {
        fun_popPOitemList_Send($(this))
    })

    //$("#ENPDetailCloneTemplate").on("click", "[alt=linkpopPOitemList]", function () {
    //    fun_popPOitemList_Send($(this))
    //})

    ////PrInfo 請購明細動作
}  //function HtmlInitalSet() {....end

//Function........UpdateBegin....

//請採購程序判定
function fun25001_POAmountCheck(amount, YnStaHoder, setType) {
    //if ($(target).val() == "" || $(target).val() == "0") return false;
    //amount = $(target).val()
    //amount = accounting.unformat(amount);

    if (YnStaHoder == "true") {
        $("#StaHodMsg").show();
    } else {
        $("#StaHodMsg").hide();
    }

    $("#PurchaseDefaultSignLevel").setSelectOption($("#PurchaseDefaultSignLevel"), "set", null)
    var DefSigLev = "0";
    if (amount > 0) {
        var Itmlist = new Array();
        var u = 0;
        for (var j = 0; j <= LevelList.length - 1; j++) {
            if (LevelList[j].PriceKind == "1") {
                if ($("#chkConsultant").prop("checked") == false && YnStaHoder == "false") {  //1.	若無勾選請購單表頭”聘用顧問類交易”且”無任何報價單上之供應商為利害關係人”
                    if (amount < 20000 && parseInt(LevelList[j].ItemNo) >= 1) {
                        DefSigLev = "1";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else if (amount >= 20000 && amount < 100000 && parseInt(LevelList[j].ItemNo) >= 2) {
                        DefSigLev = "2";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else if (amount >= 100000 && amount < 500000 && parseInt(LevelList[j].ItemNo) >= 3) {
                        DefSigLev = "3";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else if (amount >= 500000 && amount < 3000000 && parseInt(LevelList[j].ItemNo) >= 4) {
                        DefSigLev = "4";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else if (amount >= 3000000 && amount < 10000000 && parseInt(LevelList[j].ItemNo) >= 5) {
                        DefSigLev = "5";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else if (amount >= 10000000 && amount < 50000000 && parseInt(LevelList[j].ItemNo) >= 6) {
                        DefSigLev = "6";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else if (amount >= 50000000 && amount < 300000000 && parseInt(LevelList[j].ItemNo) >= 7) {
                        DefSigLev = "7";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else if (amount >= 300000000 && parseInt(LevelList[j].ItemNo) >= 8) {
                        DefSigLev = "8";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else {
                    }
                    if (DefSigLev != "0") {
                        u++;
                    }
                } else if ($("#chkConsultant").prop("checked") == true && YnStaHoder == "false") {
                    if (amount < 5000000 && parseInt(LevelList[j].ItemNo) >= 6) {
                        DefSigLev = "6";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else if (amount >= 5000000 && amount < 300000000 && parseInt(LevelList[j].ItemNo) >= 7) {
                        DefSigLev = "7";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else if (amount >= 300000000 && parseInt(LevelList[j].ItemNo) >= 8) {
                        DefSigLev = "8";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else {
                    }
                    if (DefSigLev != "0") {
                        u++;
                    }
                } else if ($("#chkConsultant").prop("checked") == false && YnStaHoder == "true") {
                    if (amount < 50000000 && parseInt(LevelList[j].ItemNo) >= 6) {
                        DefSigLev = "6";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else if (amount >= 50000000 && parseInt(LevelList[j].ItemNo) >= 8) {
                        DefSigLev = "8";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else {
                    }
                    if (DefSigLev != "0") {
                        u++;
                    }
                } else if ($("#chkConsultant").prop("checked") == true && YnStaHoder == "true") {
                    if (amount < 5000000 && parseInt(LevelList[j].ItemNo) >= 6) {
                        DefSigLev = "6";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else if (amount >= 5000000 && amount < 50000000 && parseInt(LevelList[j].ItemNo) >= 7) {
                        DefSigLev = "7";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else if (amount >= 50000000 && parseInt(LevelList[j].ItemNo) >= 8) {
                        DefSigLev = "8";
                        Itmlist[u] = [LevelList[j].ItemName, LevelList[j].ItemNo];
                    } else {
                    }
                    if (DefSigLev != "0") {
                        u++;
                    }
                } else {
                }
            } //    if (LevelList[j].PriceKind == "1") {
        }//  for (var j = 0; j <= LevelList.length - 1; j++) {
        $("#PurchaseDefaultSignLevel").setSelectOption($("#PurchaseDefaultSignLevel"), "set", Itmlist)

        var selSignLevel = $("#PurchaseDefaultSignLevel");
        setDefaultSelect(selSignLevel, DefSigLev);
    }//  if (amount > 0)

    var StandId = "0";
    var selJobWay = $("#PurchaseInquiredBargaining");
    if (regNum(amount, false)) {
        for (var j = 0; j <= LevelList.length - 1; j++) {
            if (LevelList[j].PriceKind == "0") {
                if (amount >= parseFloat(LevelList[j].MinAmount) && amount < parseFloat(LevelList[j].MaxAmount)) {
                    StandId = LevelList[j].ItemNo;
                } else if (amount >= parseFloat(LevelList[j].MinAmount) && LevelList[j].ItemName == "招標") {
                    StandId = LevelList[j].ItemNo;
                } else {
                }
            }
        }
    }
    $("#hidPurchaseInquiredBargaining").val(StandId);
    setDefaultSelect(selJobWay, StandId);

    if (setType.trim() != '') {
        var PrNum = $("#hidPRNum").val();

        var PrStandardChgDescription = $("#txtPrStandardChgDescription").val();

        $.ajax({
            type: 'POST',
            url: '/PR/QuoteAmountSet',
            data: {
                PrNum: PrNum, QuoteAmount: amount, PurchasePriceStardandId: StandId, PrStandardChgDescription: PrStandardChgDescription, PurchaseSigningLevelId: DefSigLev
            },
            success: function (data) {
                var Itmlist = new Array();
                if (data.length > 0) {
                }
            }
        });
    }
}   //    function fun25001_POAmountCheck(amount, YnStaHoder) {
//明細-傳送檢查....
function Detail_PostCheck() {
    rtn = true;
    var OnceCou = $("#PROneTimeDetailTable").find('td.DetailSerno');

    var EnpCou = $("#ENPDetailTable").find('td.DetailSerno');

    var ErrMsg = "";

    if (OnceCou.length == 0 && EnpCou.length == 0) {
        ErrMsg = ErrMsg + "應填寫任一筆請購明細後，始可以傳送表單!\n";
        //  rtn = false;
    } else {
        $("#ENPDetailTable").find('td.DetailSerno').each(function () {   //#PROneTimeDetailTable
            var i = $(this).text();
            if (parseInt(i) > 0) {
                var PrQty = $(this).nextAll("[name=QuantityPurchase]").children("b").text();
                var YCDetailID = $(this).nextAll("[name=POItem]").children("[name=hidYCDetailID]").val();

                if (YCDetailID.trim() == "") ErrMsg = ErrMsg + "協議採購 第" + i.toString() + "筆，請先「查詢」品名，帶入資料!\n";

                if (PrQty.trim() == "0") {
                    ErrMsg = ErrMsg + "協議採購 第" + i.toString() + "筆，應新增「送貨明細」後，始可以傳送表單!\n";
                }  //     if (PrQty.trim() == "0") {
            } //  if (parseInt(i) > 0) {
        })  //     $("#ENPDetailTable").find('td.DetailSerno').each(function () {   //#PROneTimeDetailTable
        $("#PROneTimeDetailTable").find('td.DetailSerno').each(function () {   //#PROneTimeDetailTable
            var i = $(this).text();
            var CategoryId = $(this).nextAll("[name=CategoryName]").find("[name=CategorySel]").val();
            var ItemDescription = $(this).nextAll("[name=POItem]").children("[name=ItemDescription]").val();
            var UomCode = $(this).nextAll("[name=UomCodeTd]").find("[name=UomCodeSel]").val();
            var trGreen = $(this).closest("tr").nextAll("[name=trGreen]");
            var GreenPur = trGreen.find("[name=GreenPurchasing]").val();
            var PurchaseEmpNum = trGreen.find("[name=PurchaseSel]").val();

            if (CategoryId == "" || ItemDescription == "" || UomCode == "" || GreenPur == "" || PurchaseEmpNum == "") {
                ErrMsg = ErrMsg + "一次性採購 第" + i.toString() + "筆，「採購分類、品名描述、單位、綠色採購分類、預設採購經辦」為必填欄位!\n";
            }

            if (parseInt(i) > 0 && CategoryId != "") {
                var UomCode = $(this).nextAll("[name=UomCodeTd]").find("[name=UomCodeSel]").val();

                var PrQty = $(this).nextAll("[name=QuantityPurchase]").children("b").text();

                if (PrQty.trim() == "0") {
                    ErrMsg = ErrMsg + "一次性採購 第" + i.toString() + "筆，應新增「送貨明細」後，始可以傳送表單!\n";
                }
                else if (UomCode.toString().trim() == "AMT") {  //若選擇「金額」，數量固定為1
                    if (PrQty.trim() != "1") {
                        ErrMsg = ErrMsg + "一次性採購 第" + i.toString() + "筆，若選擇「金額」，數量總和 應為1!\n";
                    }
                } else {
                }
            } //  if (parseInt(i) > 0 && CategoryId != null) {
        })//     $("#PROneTimeDetailTable").find('td.DetailSerno').each(function () {   //#PROneTimeDetailTable
    }  //   if (OnceCou.length == 0 && EnpCou.length == 0) {
    // return rtn;
    return ErrMsg;
}

//表單檢核
function fun_formCheck() {
    rtn = true;

    var ErrMsg = "";  //Detail_PostCheck();

    $("[Errmsg=Y]").remove() //先移除所有警告訊息

    if ($("#textPRTitle").val().length == 0) {
        fun_AddErrMesg($("#textPRTitle"), "PRTitleErr", "此欄為必填欄位")
        //rtn = false
        ErrMsg = ErrMsg + "「請購主旨」欄位為必填欄位!\n";
    }
    if ($("#textareaPRExplanation").val().length == 0) {
        fun_AddErrMesg($("#textareaPRExplanation"), "PRExplanationErr", "此欄為必填欄位")
        //rtn = false
        ErrMsg = ErrMsg + "「請購說明」欄位為必填欄位!\n";
    }

    //180525....create...begin..
    var DecDate = $("input[name=textDecryptDate]").val();

    var YnConf = $("input[name=chkConfidential]:checked").val();

    if (DecDate != "" && YnConf != undefined) {
        tmpDate = new Date();
        Month = (tmpDate.getMonth() + 1 > 9) ? (tmpDate.getMonth() + 1) : "0" + (tmpDate.getMonth() + 1)
        Day = (tmpDate.getDate() > 9) ? tmpDate.getDate() : "0" + tmpDate.getDate();
        Now = tmpDate.getFullYear() + "/" + Month + "/" + Day;

        var FixDecDate = DecDate.split('-')[0] + "/" + DecDate.split('-')[1] + "/" + DecDate.split('-')[2];
        if (FixDecDate < Now) {
            ErrMsg = ErrMsg + "密件日期不可選擇今天以前!\n";
        }
    }

    //180525....create...end...

    //是否有報價單
    if ($("#checkHaveQuotation").prop("checked")) {
        if ($("#textPRamount").val().length == 0) {
            fun_AddErrMesg($("#textPRamount"), "PRamountErr", "此欄為必填欄位,不可輸入0或負值!")
            ErrMsg = ErrMsg + "勾選有報價單，「預計採購金額」欄位為必填欄位!\n";
            //rtn = false
        }
        else {
            if (!fun25001_PRamountCheck($("#textPRamount"))) {
                ErrMsg = ErrMsg + "「預計採購金額」欄位格式有誤!\n";
                //  rtn = false;
            }
        }
    }

    ErrMsg = ErrMsg + Detail_PostCheck();

    if (ErrMsg.trim() != "") {
        rtn = false;
        alert(ErrMsg);
    }

    return rtn;
}

//pop 供應商查詢
function fun_popSuppliesSearch() {
    /////
    //list = new Array(3)
    //list[0] = ["103823", "XX股份有限公司", "A123456789"];
    //list[1] = ["103824", "OO實業", ""];
    //list[2] = ["103825", "YY股份有限公司", ""];
    /////

    SupplierNumber = $("#inpSuppliesID_SearchBox").val();
    SuppliesName = $("#inpSuppliesName_SearchBox").val();
    SuppliesIdNumber = $("#inpSuppliesNumber_SearchBox").val();

    var list = new Array()

    if (SupplierNumber.length == 0 && SuppliesName.length == 0 && SuppliesIdNumber.length == 0) {
        alert("請至少輸入一個查詢條件")
        return false;
    }
    else {
        $.ajax({
            type: 'POST',
            url: '/PR/SuppliesListGet',
            data: {
                SupplierNumber: SupplierNumber, SName: SuppliesName, SuppliesIdNumber: SuppliesIdNumber
            },
            success: function (data) {
                if (data.length > 0) {
                    for (var j = 0; j < data.length; j++) {
                        list[j] = [data[j].SupplierNumber, data[j].SuppliesName, data[j].SuppliesIdNumber, data[j].RatingDate, data[j].CommitmentDate];
                    }
                }

                i = 0;
                searchList = new Array()

                $(list).each(function () {
                    rtn = true;

                    if (SupplierNumber.length > 0) {
                        if ($(this)[0].indexOf(SupplierNumber) < 0) rtn = false
                    }
                    if (SuppliesName.length > 0) {
                        if ($(this)[1].indexOf(SuppliesName) < 0) rtn = false
                    }
                    if (SuppliesIdNumber.length > 0) {
                        if ($(this)[2].indexOf(SuppliesIdNumber) < 0) rtn = false
                    }

                    if (rtn) {
                        searchList[i] = [$(this)[0], $(this)[1], $(this)[2], $(this)[3], $(this)[4]]
                        i++
                    }
                })

                if (searchList.length > 0) {
                    $("#divPopSuppliesSearchbody").find("ul").html("");

                    $(searchList).each(function () {
                        $("#divPopSuppliesSearchbody").find("ul").append(
                                           ' <li>\
                                    <label class="w100 label-box">\
                                    <div class="table-box w25">'+ $(this)[0] + '</div>\
									<div class="table-box w25">'+ $(this)[1] + '</div>\
									<div class="table-box w20">' + $(this)[3] + '</div>\
									<div class="table-box w20">' + $(this)[4] + '</div>\
                                    </label>\
									</li>  ');
                    })
                    $("#spanPopSuppliesNomatch").hide(200)
                    $("#divPopSuppliesSearchList").show(200)
                    $("#divPopSuppliesSearchbody").show(200)
                }
                else {
                    $("#divPopSuppliesSearchbody").hide(200)
                    $("#divPopSuppliesSearchList").hide(200)
                    $("#spanPopSuppliesNomatch").show(200)
                }
            }

            , error: function (xhr) {
                alert('Ajax request 發生錯誤');
                // $(e.target).attr('disabled', false);
            }
        });
    }
}

function fun_popSuppliesClear() {
    $("#inpSuppliesID_SearchBox").val("");
    $("#inpSuppliesName_SearchBox").val("");
    $("#inpSuppliesNumber_SearchBox").val("");
    $("#tabPopSuppliesSearchList").hide()
    $("#spanPopSuppliesNomatch").hide()
}

//預計採購金額檢查
function fun25001_PRamountCheck(target) {
    if ($(target).val() == "" || $(target).val() == "0") return false;
    amount = $(target).val()

    amount = accounting.unformat(amount);
    // $("#textPRamount").val(accounting.unformat($("#textPRamount").val()));

    var YnQuo = $("input[name=checkHaveQuotation]:checked").val();

    $("#divParity").text('');
    $("#hidParity").val('');

    $("#divSignLv").html('');
    $("#hidSignLv").val('');

    if (YnQuo != undefined) {
        //PrData.HaveQuoteForm = YnQuo.trim() == "on" ? "1" : "0";
        if (YnQuo.trim() == "on") {
            if (amount <= 0) {
                $("#textPRamount").val('0');
                // fun_AddErrMesg($("#textPRamount"), "PRamountErr", "此欄為必填欄位,不可輸入0或負值!")
                alert("預計採購金額，不可輸入0或負值!");
                return false;
            }
        } else {
            if (amount < 0) {
                $("#textPRamount").val('0');
                alert("預計採購金額，不可輸入負值!");
                return false;
            }
        }
    } else {
        if (amount < 0) {
            $("#textPRamount").val('0');
            alert("預計採購金額，不可輸入負值!");
            return false;
        }
    }

    if (regNum(amount, false)) {
        //var LevelList = new Array();
        for (var j = 0; j <= LevelList.length - 1; j++) {
            if (LevelList[j].PriceKind == "0") {
                if (amount >= parseFloat(LevelList[j].MinAmount) && amount <= parseFloat(LevelList[j].MaxAmount)) {
                    $("#divParity").text(LevelList[j].ItemName);
                    $("#hidParity").val(LevelList[j].ItemNo);
                } else if (amount >= parseFloat(LevelList[j].MinAmount) && LevelList[j].ItemName == "招標") {
                    $("#divParity").text(LevelList[j].ItemName);
                    $("#hidParity").val(LevelList[j].ItemNo);
                } else {
                }
            }

            if ($("#chkConsultant").prop("checked")) {
                if (LevelList[j].PriceKind == "2") {
                    if (amount >= parseFloat(LevelList[j].MinAmount) && amount <= parseFloat(LevelList[j].MaxAmount)) {
                        $("#divSignLv").html("<p>" + LevelList[j].ItemName + "</p>");
                        $("#hidSignLv").val(LevelList[j].ItemNo);
                    } else if (amount >= parseFloat(LevelList[j].MinAmount) && LevelList[j].ItemName.indexOf("董事會") > -1) {
                        $("#divSignLv").html("<p>" + LevelList[j].ItemName + "</p>");
                        $("#hidSignLv").val(LevelList[j].ItemNo);
                    } else {
                    }
                }
            } else {
                if (LevelList[j].PriceKind == "1") {
                    if (amount >= parseFloat(LevelList[j].MinAmount) && amount <= parseFloat(LevelList[j].MaxAmount)) {
                        if (LevelList[j].ItemName.indexOf("執行副總") > -1 || LevelList[j].ItemName.indexOf("總經理") > -1 || LevelList[j].ItemName.indexOf("董事長") > -1 ||
                            LevelList[j].ItemName.indexOf("董事會") > -1) {
                            $("#divSignLv").html("<p>" + LevelList[j].ItemName + "</p>");
                            $("#hidSignLv").val(LevelList[j].ItemNo);
                        } else {
                            $("#divSignLv").text(LevelList[j].ItemName);
                            $("#hidSignLv").val(LevelList[j].ItemNo);
                        }
                    } else if (amount >= parseFloat(LevelList[j].MinAmount) && LevelList[j].ItemName.indexOf("董事會") > -1) {
                        $("#divSignLv").html("<p>" + LevelList[j].ItemName + "</p>");
                        $("#hidSignLv").val(LevelList[j].ItemNo);
                    } else {
                    }
                }
            }
        }
        amount = fun_accountingformatNumberdelzero(amount)
        $(target).attr("maxlength", amount.length)
        $(target).val(amount);
        return true
    }
    else {
        // fun_AddErrMesg(target, "PRamountErr", "輸入數字不正確");
        return false
    }
}

//<!--POPUP-選擇單位-->輸入查詢....begin...
function fun_PopAddDepartmentSearch(target) {
    if ($(target).val().trim() == "") {
        alert("請輸入查詢字串")
        return false;
    }
    else {
        searchList = new Array()
        i = 0;
        $(DeptList).each(function () {
            if ($(this)[0].indexOf($(target).val()) > -1) {
                searchList[i] = [$(this)[0] + "(" + $(this)[1] + ")", $(this)[1]]
                i++;
            }
        })
        $(target).setSearchBox(searchList)
    }
}

//父選擇器動作
function fun_PopAddDepartmentSelectChange(target) {
    list = new Array()
    i = 0;
    $(DeptList).each(function () {
        if ($(this)[2].indexOf($(target).val()) > -1) {
            list[i] = [$(this)[0] + "(" + $(this)[1] + ")", $(this)[1]]
            i++;
        }
    })

    $(target).setSelectOption($("#selPopAdddepartment_Children"), "set", list)
}

//<!--POPUP-選擇單位-->輸入查詢....end...

//Function........UpdateEnd....

//Html.Initial...Function... 設定.....begin....

//------pop	開窗控制--------
//pop 單位選擇開窗
//ajax 輸入查詢
//function fun_PopAddDepartmentSearch(target) {
//    if ($(target).val().trim() == "") {
//        alert("請輸入查詢字串")
//        return false;
//    }
//    else {
//        list = new Array(3)
//        list[0] = [$(target).val() + "a", $(target).val() + "1"];
//        list[1] = [$(target).val() + "b", $(target).val() + "2"];
//        list[2] = [$(target).val() + "c", $(target).val() + "3"]
//        $(target).setSearchBox(list)
//    }
//}

////父選擇器動作
//function fun_PopAddDepartmentSelectChange(target) {
//    list = new Array(3)
//    list[0] = [$(target).val() + "a", $(target).val() + "1"];
//    list[1] = [$(target).val() + "b", $(target).val() + "2"];
//    list[2] = [$(target).val() + "c", $(target).val() + "3"]
//    $(target).setSelectOption($("#selPopAdddepartment_Children"), "set", list)
//}

//pop 商品選擇器

function fun_popPOitemListSearch() {
    POitemListSearchBox = $("#inp_POitemListSearchBox").val().trim();

    if (POitemListSearchBox.length == 0) {
        alert("請輸入查詢字串");
        return false;
    }
    else {
        $("#div_POitemMsg").show();

        $.ajax({
            type: 'POST',
            url: '/PR/POitemListGet',
            data: {
                SID: "temp", SName: POitemListSearchBox
            },
            success: function (data) {
                if (data.length > 0) {
                    for (var j = 0; j < data.length; j++) {
                        Itemlist[j] = [data[j].YCDetailID, data[j].Supplier, data[j].CategoryName, data[j].ItemDescription, data[j].Unit, data[j].ContractPrice, data[j].BpaNum,
                         data[j].ContractPeriod, data[j].PurchaseEmpName, data[j].InvoiceEmpName, data[j].CurrencyCode, data[j].ContactPerson, data[j].GreenCategory
                         , data[j].ExchangeRate, data[j].ForeignPrice, data[j].Price, data[j].UnitPrice];
                    }
                }

                i = 0;
                searchList = new Array();
                k = 0
                $(Itemlist).each(function () {
                    rtn = true;
                    if ($(this)[3] != null) {
                        if ($(this)[3].indexOf(POitemListSearchBox) >= 0) {
                            searchList[i] = [Itemlist[k][0], Itemlist[k][1], Itemlist[k][2], Itemlist[k][3], Itemlist[k][4], Itemlist[k][5], Itemlist[k][6]
                                , Itemlist[k][7], Itemlist[k][8], Itemlist[k][9], Itemlist[k][10], Itemlist[k][11]];

                            i++
                        }
                    }

                    k++
                })
                if (searchList.length > 0) {
                    $("#div_POitemListSearchedbody").find("ul").html("");

                    $(searchList).each(function () {
                        $("#div_POitemListSearchedbody").find("ul").append(
                            '<li>\
                        <label class="w100 label-box">\
                        <div class="table-box w5"><input type="radio" name ="POitemArray"></div>\
                         <div  name="YCDetailID"  style="display:none" >' + $(this)[0] + '</div>\
                        <div class="table-box w10">' + $(this)[1] + '</div>\
                        <div class="table-box w10">' + $(this)[2] + '</div>\
                        <div   name="itemName" class="table-box w20">'+ $(this)[3] + '</div>\
                        <div class="table-box w5">' + $(this)[4] + '</div>\
                        <div class="table-box w10">' + $(this)[5] + '</div>\
                        <div class="table-box w10">' + $(this)[6] + '</div>\
                        <div class="table-box w20">' + $(this)[7] + '</div>\
                        <div class="table-box w10">' + $(this)[8] + '</br>(01ooo)</div>\
                        </label>\
                    </li>\
                ');
                    })

                    $("#div_POitemMsg").hide();

                    $("#div_POitemNoMatch").hide(200);
                    $("#div_POitemListSearchedList").show(200);
                }
                else {
                    $("#div_POitemMsg").hide();

                    $("#div_POitemListSearchedList").hide(200);
                    $("#div_POitemNoMatch").show(200);
                }

                //--Original.......end...
            }  // success:
        });
    }
}

function fun_ClassReset(target) {
    var CatNamClass = $(target).attr("class");

    var ArrCnc = new Array();
    ArrCnc = CatNamClass.split(' ');
    var combStr = "";
    for (var v = 0; v <= ArrCnc.length - 1; v++) {
        var clval = ArrCnc[v];
        if (clval != "undone-text") {
            combStr = clval + " ";
        }
    }
    $(target).attr("class", combStr.trim());
}

//品名--動態綁定回填的欄位
function fun_popPOitemList_Send(target) {
    POitemList = $("#popPOitemList");

    var template = $(target).closest("tbody");

    PRInfoIndex = $(template).find('td.DetailSerno').text();

    $(POitemList).find(".remodal-confirm-btn").unbind("click");

    $(POitemList).find(".remodal-confirm-btn").click(
        function () {
            if ($(POitemList).find("input[type=radio]:checked").length > 0) {
                context = $(POitemList).find("input[type=radio]:checked").closest("label").children("[name=itemName]").text();

                YCDetailID = $(POitemList).find("input[type=radio]:checked").closest("label").children("[name=YCDetailID]").text().toString();

                var ValSet = $(target).closest("tbody").find('td.DetailSerno').filter(function () {
                    return $(this).text() == PRInfoIndex
                });

                fun_ClassReset(ValSet.nextAll("[name=POItem]").children("b"));

                ValSet.nextAll("[name=POItem]").children("b").text(context);  //nextAll( expr ) 找出排在該元素後方的所有同層元素，支援Selector語法篩選
                ValSet.nextAll("[name=POItem]").children("[name=hidYCDetailID]").val(YCDetailID);  //

                var DetSet = ValSet.closest("tr").nextAll("[name=trSupplier]");
                var DetPri = ValSet.closest("tr").nextAll("[name=trPrice]");

                i = 0;
                $(Itemlist).each(function () {
                    if ($(this)[0].toString().indexOf(YCDetailID) >= 0) {
                        fun_ClassReset(ValSet.nextAll("[name=CategoryName]").children("b"));
                        fun_ClassReset(ValSet.nextAll("[name=Unit]").children("b"));
                        fun_ClassReset(ValSet.nextAll("[name=CurrencyCode]").children("b"));
                        fun_ClassReset(ValSet.nextAll("[name=ExchangeRate]").children("b"));
                        fun_ClassReset(ValSet.nextAll("[name=QuantityPurchase]").children("b"));
                        fun_ClassReset(DetSet.find("[name=Supplier]").children("b"));
                        fun_ClassReset(DetSet.find("[name=ContactPerson]").children("b"));
                        fun_ClassReset(DetSet.find("[name=GreenCategory]").children("b"));
                        fun_ClassReset(DetSet.find("[name=BpaNum]").children("b"));
                        fun_ClassReset(DetSet.find("[name=PurchaseEmpName]").children("b"));
                        fun_ClassReset(DetSet.find("[name=ForeignPrice]").children("b"));
                        fun_ClassReset(DetSet.find("[name=Price]").children("b"));
                        fun_ClassReset(DetPri.find("[name=InvoiceEmpName]").children("b"));

                        ValSet.nextAll("[name=CategoryName]").children("b").text(Itemlist[i][2]);
                        ValSet.nextAll("[name=Unit]").children("b").text(Itemlist[i][4]);
                        ValSet.nextAll("[name=CurrencyCode]").children("b").text(Itemlist[i][10]);
                        ValSet.nextAll("[name=ExchangeRate]").children("b").text(Itemlist[i][13]);
                        ValSet.nextAll("[name=QuantityPurchase]").children("b").text("0");
                        DetSet.find("[name=Supplier]").children("b").text(Itemlist[i][1]);

                        DetSet.find("[name=ContactPerson]").children("b").text(Itemlist[i][11]);
                        DetSet.find("[name=GreenCategory]").children("b").text(Itemlist[i][12]);
                        DetSet.find("[name=BpaNum]").children("b").text(Itemlist[i][6]);
                        DetSet.find("[name=PurchaseEmpName]").children("b").text(Itemlist[i][8]);
                        DetSet.find("[name=ForeignPrice]").children("b").text(Itemlist[i][14]);
                        DetSet.find("[name=Price]").children("b").text(Itemlist[i][15]);
                        DetSet.find("[name=hidPrice]").val(Itemlist[i][15]);
                        DetPri.find("[name=InvoiceEmpName]").children("b").text(Itemlist[i][9]);
                    }
                    i++
                })
            }
            else {
                var ValSet = $(target).closest("tbody").find('td.DetailSerno').filter(function () {
                    return $(this).text() == PRInfoIndex
                });

                // ValSet.nextAll("[name=POItem]").children("span").text("系統自動帶入");  //nextAll( expr ) 找出排在該元素後方的所有同層元素，支援Selector語法篩選

                ValSet.nextAll("[name=CategoryName]").children("b").text("系統自動帶入");
                ValSet.nextAll("[name=Unit]").children("b").text("系統自動帶入");
                ValSet.nextAll("[name=CurrencyCode]").children("b").text("系統自動帶入");
                ValSet.nextAll("[name=ExchangeRate]").children("b").text("系統自動帶入");

                DetSet.find("[name=Supplier]").children("b").text("系統自動帶入");
                DetSet.find("[name=ContactPerson]").children("b").text("系統自動帶入");
                DetSet.find("[name=GreenCategory]").children("b").text("系統自動帶入");
                DetSet.find("[name=BpaNum]").children("b").text("系統自動帶入");
                DetSet.find("[name=PurchaseEmpName]").children("b").text("系統自動帶入");
                // DetSet.find("[name=InvoiceEmpName]").children("b").text("系統自動帶入");
                DetSet.find("[name=ForeignPrice]").children("b").text("系統自動帶入");

                // DetPri.find("[name=Price]").children("b").text("系統自動帶入");
                // DetPri.find("[name=hidPrice]").val("系統自動帶入");

                DetSet.find("[name=Price]").children("b").text("系統自動帶入");
                DetSet.find("[name=hidPrice]").val("系統自動帶入");
                DetPri.find("[name=InvoiceEmpName]").children("b").text("系統自動帶入");
            }
        }
    )
}

//------pop	開窗控制--------
//數量輸入檢查
function fun_pcsOnblur(target) {
    num = $(target).val();
    if (num.length == 0) return false;

    var UomCode = $(target).closest('table').children('thead').children('tr').find("[name=hidUomCode]").val();
    if (UomCode == "AMT") {
        if (!regNum($(target).val(), true)) {
            fun_AddErrMesg(target, "pcsErr", "數量輸入不正確")
        }
    }

    else if (regNum($(target).val())) {
        //   var UniPri = $(target).parents("tr[alt=DeliveryList]").prev("[alt=TrUnitPrice]").find("[name=hidPrice]").val();

        var UniPri = $(target).closest('table').children('thead').children('tr').find("[name=hidTwdPrice]").val();

        var DAm = num * parseFloat(UniPri);

        num = fun_accountingformatNumberdelzero(num);

        DAm = fun_accountingformatNumberdelzero(DAm);

        $(target).parent("td").next("[name=DevAmount]").find('b').text(DAm.toString());

        $(target).val(num);
    }
    else {
        fun_AddErrMesg(target, "pcsErr", "數量輸入不正確")
    }
}

function fun_pcsOnfoucs(target) {
    ErrMesg = $(target).next();
    if ($(ErrMesg).attr("alt") == "pcsErr") $(ErrMesg).remove();

    num = $(target).val();
    if (num.length == 0) return false;
    //$(target).val(target.value.replace(/\,/g, ''));
    $(target).val(accounting.unformat($(target).val()));
    $(target).attr('maxlength', '7')

    //控制光標位置  *更改輸入框值後光標會移動到前面
    SelectionRange(target, target.value.length, target.value.length)
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
        target.setcRange(start, end);
    }
}

//新增錯誤訊息
function fun_AddErrMesg(target, NewElementID, ErrMesg) {
    if ($("#" + NewElementID).length > 0) {
        $("#" + NewElementID).text(ErrMesg);
    }
    else {
        $(target).after('<div Errmsg="Y" alt="' + NewElementID + '" class="error-text"><span class="icon-error icon-error-size"></span>' + ErrMesg + '</div>')
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

//數字驗證 *正值 不得為0  小數點最多四位
//function regNum(target, hasfloat) {
//    if (hasfloat) {
//        reg = /^(([0-9]\.[0-9]{1,4})|([1-9][0-9]*\.[0-9]{1,4})|([1-9]\d*))$/
//    }
//    else {
//        reg = /^([1-9]\d*)$/
//    }
//    if (target.search(reg) == 0) {
//        return true;
//    }
//    else {
//        return false;
//    }
//}

//數字驗證 *正值 不得為0
function regNum(target, hasfloat) {
    if (hasfloat) {
        reg = /^(([0-9]\.[0-9]{1,4})|([1-9][0-9]*\.[0-9]{1,4})|([1-9]\d*))$/
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

//Html.Initial...Function... 設定.....end....

//pop 人員選擇器..........begin.......

//動態綁定回填的欄位
function fun_popAddPerson_Send(target) {
    popAddPerson = $("#popAddperson")
    // PRInfoIndex = $(target).attr('PRInfoIndex')
    //   $('[data-remodal-id=InvalidPRitemList]').remodal().open();
    var template = $(target).closest("tbody");
    PRInfoIndex = $(template).find('td.DetailSerno').text();

    $(popAddPerson).find(".remodal-confirm-btn").unbind("click");

    $(popAddPerson).find(".remodal-confirm-btn").click(function () {
        if ($(popAddPerson).find("[alt=popWindow_SelectedBox]").find('.Links').length > 0) {
            context = $(popAddPerson).find("[alt=popWindow_SelectedBox]").find('.Links').first().find('span').text()

            $(target).closest("table").children('tbody').find('.DetailSerno').filter(function () {
                return $(this).text() == PRInfoIndex
            }).closest('tr').nextAll('tr[name=trGreen]').children("[alt=Addperson]").children("span").text(context)
        }
        else {
            $(target).closest("table").children('tbody').find('.DetailSerno').filter(function () {
                return $(this).text() == PRInfoIndex
            }).closest('tr').nextAll('tr[name=trGreen]').children("[alt=Addperson]").children("span").text("")
        }
    })
}

//ajax 輸入查詢-//用員編.or 姓名.查
function fun_popAddPersonSearch(target) {
    if ($(target).val() == "") {
        alert("請輸入查詢字串")
        return false;
    }
    else {
        ///new-add....
        var PersonList = new Array();
        $.ajax({
            type: 'POST',
            url: '/PR/PersonSearchGet',
            data: {
                DeptCode: '', JobeRole: ''
            },
            success: function (data) {
                if (data.length > 0) {
                    for (var j = 0; j < data.length; j++) {
                        PersonList[j] = [data[j].EmpName, data[j].EmpNum];
                    }
                    searchList = new Array()
                    i = 0;
                    if ($("#selPopAddperson_searchtype").val() == 1) {  //用員編..查
                        $(PersonList).each(function () {
                            if ($(this)[1].indexOf($(target).val()) > -1) {
                                searchList[i] = [$(this)[0] + "(" + $(this)[1] + ")", $(this)[1]]
                                i++;
                            }
                        })
                    }
                    else {
                        $(PersonList).each(function () {    //用 姓名..查
                            if ($(this)[0].indexOf($(target).val()) > -1) {
                                searchList[i] = [$(this)[0] + "(" + $(this)[1] + ")", $(this)[1]]
                                i++;
                            }
                        })
                    }
                    $(target).setSearchBox(searchList)
                }
            }  //success: function (data) {
        });
        ///new-add....end...
    }
}

//選擇事業群-->選擇單位
function fun_PopAddManDept1(target) {
    $(target).setSelectOption($("#ManDept1"), "set", null)
    list = new Array()
    i = 0;
    $(DeptList).each(function () {
        if ($(this)[2].indexOf($(target).val()) > -1) {
            list[i] = [$(this)[0] + "(" + $(this)[1] + ")", $(this)[1]]
            i++;
        }
    })
    $(target).setSelectOption($("#ManDept1"), "set", list)
}

function fun_PopAddManDept2(target) {
    $(target).setSelectOption($("#ManDept2"), "set", null)
    list = new Array()
    i = 0;
    $(DeptList).each(function () {
        if ($(this)[2].indexOf($(target).val()) > -1) {
            list[i] = [$(this)[0] + "(" + $(this)[1] + ")", $(this)[1]]
            i++;
        }
    })
    $(target).setSelectOption($("#ManDept2"), "set", list)
}

function fun_PopAddManDept3(target) {
    $(target).setSelectOption($("#ManDept3"), "set", null)
    list = new Array()
    i = 0;
    $(DeptList).each(function () {
        if ($(this)[2].indexOf($(target).val()) > -1) {
            list[i] = [$(this)[0] + "(" + $(this)[1] + ")", $(this)[1]]
            i++;
        }
    })
    $(target).setSelectOption($("#ManDept3"), "set", list)
}

function fun_PopAddManRole(target) {
    $(target).setSelectOption($("#ManRole"), "set", null)
    list = new Array()
    i = 0;
    $(DeptList).each(function () {
        if ($(this)[2].indexOf($(target).val()) > -1) {
            list[i] = [$(this)[0] + "(" + $(this)[1] + ")", $(this)[1]]
            i++;
        }
    })
    $(target).setSelectOption($("#ManRole"), "set", list)
}

function fun_PopAddManName(target) {
    $(target).setSelectOption($("#ManName"), "set", null)

    var dept = $("#ManDept3").val();
    var role = $("#ManRole").val();

    var PersonList = new Array();
    $.ajax({
        type: 'POST',
        url: '/PR/PersonSearchGet',
        data: {
            DeptCode: dept, JobRole: role
        },
        success: function (data) {
            if (data.length > 0) {
                for (var j = 0; j < data.length; j++) {
                    PersonList[j] = [data[j].EmpName + "(" + data[j].EmpNum + ")", data[j].EmpNum];
                }
                $(target).setSelectOption($("#ManName"), "set", PersonList)
            }
        }  //success: function (data) {
    });

    //list = new Array()
    //i = 0;
    //$(DeptList).each(function () {
    //    if ($(this)[2].indexOf($(target).val()) > -1) {
    //        list[i] = [$(this)[0] + "(" + $(this)[1] + ")", $(this)[1]]
    //        i++;
    //    }
    //})
    //$(target).setSelectOption($("#ManRole"), "set", list)
}

//pop 人員選擇器..........end.......