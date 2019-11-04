$(document).ready(function () {
    var P_CustomFlowKey = $('#P_CustomFlowKey').val();

    var PageType = $('#HeadType').val();


    $("#ApportionmentDetailTable tbody").find("tr").each(function () {
        console.log($(this).find("td").eq(5).find("input").val())
        var value = parseInt($(this).find("td").eq(5).text())

        if (value == 0) { $(this).find("td").eq(5).text(""); }
    })

    $("[amount]").each(function () {
        var value = parseInt($(this).text())
        if (value == 0) { $(this).text(""); }
    })
    


    if (String(P_CustomFlowKey).indexOf("BPC_P3") > -1 && (PageType == "ReadOnly" || PageType == "CheckOut")) {
        $("#box-area-3").parent(".section-box-area").show();
        $("#box-area-4").parent(".section-box-area").show();
    }

    if ($("#EncryptionYn").val() == "true") {
        $("#fileSection").hide();
        $("#SpeechSection").hide();
        $("#RecordSection").hide();

    }


    $("#Subject").prop("readonly", true);
    $("#Description").prop("readonly", true);
    $('input[name="IsEncryption"]').prop("readonly", true);
    $('input[name="IsEncryption"]').prop("disabled", true);
    DisableDOMObject("#txtDecryptionDate");

    $('#chk3Citem').prop("disabled", true);
    $('#chkConsultant').prop("disabled", true);
    $('#chkContract').prop("disabled", true);
    $('#chkCore').prop("disabled", true);

    $('#HaveYearlyContract').prop("disabled", true);
    DisableDOMObject(".ContractStartDateInput");
    $("#ContractStartDate").prop("readonly", true)
    DisableDOMObject(".ContractEndDateInput");
    $("#ContractEndDate").prop("readonly", true)
    $('input[name="HaveQuoteForm"]').prop("disabled", true);

    $("#textPRamount").prop("readonly", true);
    if ($("#textPRamount").val() == 0) {
        $("#textPRamount").val("")
    }

    $('input[name="IsNewSupplier"]').prop("disabled", true);

    $("#ExchangeRateInput").prop("readonly", true);

    $("input[name='PurchasePriceStardandDescription']").prop("readonly", true);

    $("#PurchasePriceStardandId").prop('disabled', true).addClass('input-disable')
    $("#PurchaseSigningLevelId").prop('disabled', true).addClass('input-disable')
    DisableDOMObject($('#CurrencyCode'));
    DisableDOMObject($('#PurchaseEmpNum'));

    $('.area-btn-right-1').hide();

    DisableDOMObject($('[alt="selectCategoryId"]'));
    DisableDOMObject($('[alt="selectUomCode"]'));
    $('[alt = "inputnecessary"]').prop("readonly", true);
    $('[alt = "selectUomCode"]').prop("disabled", true);
    // $("#Price").prop("readonly", true);
    $('[alt="Price"]').prop("readonly", true);
    $("#NegotiationPrice").prop("readonly", true);

    $('#SuppliesOpen').each(function () {
        $(this).hide();
    });

    $('#ApportionmentDetailTable').find('th:eq(6)').attr("style", "display:none");
  
    $("#ApportionmentQuoteDetailTable tr").find('th:eq(6)').remove();

    $('#ApportionmentQuoteDetailTable tr').find('td:eq(6)').each(function () {
        $(this).attr("style", "display:none");
    })




    $("#txtStakeHolderDescription").prop("readonly", true);
    $("#ContractTotalAmountReadOnly").prop("readonly", true);
    $("#PurchasePriceStardandId").prop('disabled', true).addClass('input-disable');
    $("#PurchaseSigningLevelId").prop('disabled', true).addClass('input-disable');
    $("input[name='PurchasePriceStardandDescription']").prop("readonly", true);
    //$("#PurchasePriceStardandDescription").prop("readonly", true);
});

//====================================================================================
//欄位全部鎖定
//====================================================================================

function ReadOnly() {
    //請購資訊區
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