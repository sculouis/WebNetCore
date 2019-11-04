let OpenIndex;
let PricePrecision = 4;
//let isStakeholders = false;
let aryStakeholers = [];
var currency = {
    "currencyCode": null,
    "currencyName": null,
    "currencyDescription": null,
    "extendedPrecision": 4
};

$(document).ready(function () {
    $("#MainForm").on('submit', function (e) {
        return false;
    })
   

    $("[alt=PriceType]").each(function () {
        $(this).val(fun_accountingformatNumberdelzero($(this).val()))
        $("#ApportionmentDetailTable tbody").find("tr").each(function () {
            if (isNaN($(this).find("td").eq(5).find("input").val())) {
                var value = parseInt($(this).find("td").eq(5).find("input").val())
            }
            else {
                if (value == 0 || value == "NaN") { $(this).find("td").eq(5).find("input").val(""); }
            }
        })
    })

    InitialSetForm();
    getSelectdata();
    fun_msgStockholder();
    if ((($("#HeadType").val() == "ReadOnly") || ($("#HeadType").val() == "CheckOut")) &&
        $("#EncryptionYn").val() == "true") {
        $("#SpeechSection").hide();
        $("#RecordSection").hide();
    }

    if ($("#HeadType").val() != "ReadOnly") {
        if ($("#selectCategoryId_0").val() == null) {
            setDefaultSelect($("#selectCategoryId_1"), null)
        //    alert("採購分類FIIS資料取得失敗");
        };

        if ($("#selectUomCode_0").val() == null) {
            setDefaultSelect($("#selectUomCode_1"), null)
          //  alert("單位FIIS資料取得失敗");
        };
    }

    $('input[name="DecryptionDate"]').prop("readonly", true)

    var P_CustomFlowKey = $('#P_CustomFlowKey').val();  //"BPC_P1-002";
    var P_CurrentStep = $("#P_CurrentStep").val();
    if (String(P_CustomFlowKey).indexOf("BPC_P1") > -1 && P_CurrentStep == 1) {
        if ($("#HaveYearlyContract").is(":checked")) {
            $('.ContractStartDateInput').find('input').removeClass('input-disable');
            $('.ContractStartDateInput').find('span').removeClass('input-disable');
            $('.ContractStartDateInput').find('input').attr('readonly', false)
            $('.ContractEndDateInput').find('input').removeClass('input-disable');
            $('.ContractEndDateInput').find('span').removeClass('input-disable');
            $('.ContractEndDateInput').find('input').attr('readonly', false)
        } else {
            $('.ContractStartDateInput').find('input').addClass('input-disable');
            $('.ContractStartDateInput').find('span').addClass('input-disable');
            $('input[name="ContractStartDate"').val("");
            $('.ContractStartDateInput').find('input').attr('readonly', true)
            $('.ContractEndDateInput').find('input').addClass('input-disable');
            $('.ContractEndDateInput').find('span').addClass('input-disable');
            $('input[name="ContractEndDate"').val("");
            $('.ContractEndDateInput').find('input').attr('readonly', true)
        }
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

    if ($("[name='IsEncryption']").eq(0).prop("checked")) {
        $("#EcryptionNote").show();
        EnableDOMObject($("#txtDecryptionDate"))
        $("input[name='DecryptionDate']").prop("readonly", false)
    } else {
        $("#EcryptionNote").hide();
        DisableDOMObject($("#txtDecryptionDate"));
        $("input[name='DecryptionDate']").prop("readonly", true)
        $('input[name="DecryptionDate"').val("")
    }

    $('[amount]').each(function () {
        $(this).text(fun_accountingformatNumberdelzero(accounting.formatNumber($(this).text(), PricePrecision)));
    })

    $(document).on('click', '#HaveYearlyContract', function () {
        $('[alt="BPCContractStartDateErr"]').remove();
        $('[alt="BPCContractEndDateErr"]').remove();

        if ($("#HaveYearlyContract").is(":checked")) {
            $('.ContractStartDateInput').find('input').removeClass('input-disable');
            $('.ContractStartDateInput').find('span').removeClass('input-disable');
            $('.ContractStartDateInput').find('input').attr('readonly', false)
            $('.ContractEndDateInput').find('input').removeClass('input-disable');
            $('.ContractEndDateInput').find('span').removeClass('input-disable');
            $('.ContractEndDateInput').find('input').attr('readonly', false)
        } else {
            $('.ContractStartDateInput').find('input').addClass('input-disable');
            $('.ContractStartDateInput').find('span').addClass('input-disable');
            $('input[name="ContractStartDate"').val("");
            $('.ContractStartDateInput').find('input').attr('readonly', true)
            $('.ContractEndDateInput').find('input').addClass('input-disable');
            $('.ContractEndDateInput').find('span').addClass('input-disable');
            $('input[name="ContractEndDate"').val("");
            $('.ContractEndDateInput').find('input').attr('readonly', true)
        }
    });

    //==========================================
    // 有合約
    //==========================================
    $("#chkContract").click(function () {
        if ($(this).is(":checked")) {
            QueryTempForCounterSignUnits([{ unit_name: "法律事務處", unit_id: "0028" }])
        }
    })

    //==========================================
    // 有核心委外
    //==========================================
    $("#chkCore").click(function () {
        if ($(this).is(":checked")) {
            QueryTempForCounterSignUnits([{ unit_name: "個人金融事業處", unit_id: "0055" }])
        }
    })

    //==========================================
    // 為年度議價合約日期起不可為空白
    //==========================================
    $(document).on('blur', '#ContractStartDate', function () {
        fun_RemoveErrMesg($('#ContractStartDate'), "BPCContractStartDateErr", "")
        var ContractStartDateLength = $(this).val().length;
        if ($('#HaveYearlyContract').is(":checked")) {
            if (ContractStartDateLength <= 0) {
                fun_AddErrMesg($('#ContractStartDate'), "BPCContractStartDateErr", "日期不可空白");
                console.log($("#ContractStartDate").val());
                var mindate = new Date(new Date().getTime() + 86400000);
                var yy = mindate.getFullYear() + "/" + (mindate.getMonth() + 1) + "/" + mindate.getDate();
                console.log(yy);
                if (!$("#ContractStartDate").val()) {
                    $('.ContractEndDateInput').data("DateTimePicker").minDate(yy);
                }
            }
            else {
                fun_RemoveErrMesg($('#ContractStartDate'), "BPCContractStartDateErr", "")
                fun_RemoveErrMesg($('#ContractEndDate'), "BPCContractStartDateErr", "")
            }
        }
    });

    //==========================================
    // 為年度議價合約日期迄不可為空白
    //==========================================
    $(document).on('blur', '#ContractEndDate', function () {
        fun_RemoveErrMesg($('#ContractEndDate'), "BPCContractEndDateErr", "")
        var ContractStartDateLength = $(this).val().length;
        if ($('#HaveYearlyContract').is(":checked")) {
            if (ContractStartDateLength <= 0) {
                fun_AddErrMesg($('#ContractEndDate'), "BPCContractEndDateErr", "日期不可空白");
            }
            else {
                fun_RemoveErrMesg($('#ContractEndDate'), "BPCContractEndDateErr", "")
            }
        }
    });

    //==========================================
    // 合約日期起不可大於迄
    //==========================================

    $(document).on("dp.change", ".ContractStartDateInput", function (e) {
        $('.ContractStartDateInput').data("DateTimePicker").minDate(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate());
        var newdate = new Date(e.date);
        newdate.setTime(newdate.getTime() + 86400000)
        console.log(newdate.getTime())
        $('.ContractEndDateInput').data("DateTimePicker").minDate(newdate);
    });

    $(document).on("dp.change", ".ContractEndDateInput", function (e) {
        console.log($("#ContractStartDate").val());
        var mindate = new Date(new Date().getTime() + 86400000);
        var yy = mindate.getFullYear() + "/" + (mindate.getMonth() + 1) + "/" + mindate.getDate();
        console.log(yy);
        if (!$("#ContractStartDate").val()) {
            $('.ContractEndDateInput').data("DateTimePicker").minDate(yy);
        }
    });

    //==========================================
    // 有報價單預計採購金額必填
    //==========================================
    $(document).on('blur', '#textPRamount', function () {//預計採購金額欄位
        var HaveQuoteFormlength = $(this).val();
        fun_RemoveErrMesg($('#textPRamount'), "PRamountErr", "")
        var HaveQuoteFormcheckedValue = $('input[name="HaveQuoteForm"]:checked').val()
        if (HaveQuoteFormcheckedValue == "on" || HaveQuoteFormcheckedValue == "true") {
            if (HaveQuoteFormlength == 0) {
                $("#Must").show()
                //  fun_AddErrMesg($('#textPRamount'), "PRamountErr", "金額不可為0");
                $(this).val("");
            }
            else {
                if ($(this).val() == 0) {
                    $(this).val("");
                }
            }
        }
        else {
            $("#Must").hide()
            if ($(this).val() == 0) {
                $(this).val("");
            }
        }
    });

    //==========================================
    // HaveQuoteForm onclick有報價單預計採購金額必填
    //==========================================
    $(document).on('click', 'input[name="HaveQuoteForm"]', function () {//是否為有報價單時
        $("#isQuoteFormError").hide();
        var HaveQuoteFormlength = $('#textPRamount').val();
        fun_RemoveErrMesg($('#textPRamount'), "PRamountErr", "")
        var HaveQuoteFormcheckedValue = $('input[name="HaveQuoteForm"]:checked').val()
        if (HaveQuoteFormcheckedValue == "on" || HaveQuoteFormcheckedValue == "true") {
            $("#Must").show();
            $("#QuoteFormText").show();           
        }
        else {
            $("#Must").hide();
            $("#QuoteFormText").hide();
        }
    });

    $(document).on('blur', '[alt="PriceType"]', function (e) {
        $('[alt="BPCPriceErr"]').remove();
        $('[alt="BPCNegotiationPriceErr"]').remove();
        var PriceValue = parseFloat(accounting.unformat($(this).val()));
        if (isNaN(PriceValue)) {
            $(this).val(0);
        } else {
            if (!isNaN(PriceValue) && PriceValue > 0) {
                $('[alt="BPCPriceErr"]').remove();
                $('[alt="BPCNegotiationPriceErr"]').remove();
                if (!isNaN(PriceValue) && PriceValue > 99999999999.9999) {
                    fun_AddErrMesg($(this), "BPCPriceErr", "欄位金額超過上限");
                } else {
                    $(this).val(fun_accountingformatNumberdelzero($(this).val()))
                    $('[alt="BPCPriceErr"]').remove();
                    $('[alt="BPCNegotiationPriceErr"]').remove();
                }
            } else {
                $(this).val(0);
                $('[alt="BPCPriceErr"]').remove();
                $('[alt="BPCNegotiationPriceErr"]').remove();
            }
        }

        $("#ApportionmentDetailTable tbody").find("tr").each(function () {
            console.log($(this).find("td").eq(5).find("input").val())
            var value = parseInt($(this).find("td").eq(5).find("input").val())
            if (value == 0) { $(this).find("td").eq(5).find("input").val(""); }
        })
    });

    $(document).on('click', '#SuppliesOpen', function (e) {
        var result = getSupplies();
        openVendor(true, null);
        OpenIndex = getSuppliesNumber($(this));
        vendorSelected(result);
    });

    $(document).on('click', '#SupplierSearch', function (e) {//新供應商查詢
        var result = getSupplies();
        openVendor(true, null);
        $("#AddVendor").find(".remodal-cancel-btn").remove();
        $("#AddVendor").find(".remodal-confirm-btn").remove();
        OpenIndex = getSuppliesNumber($(this));
        vendorSelected(result, target);
    });

    //==========================================
    // 密件開啟解密日期欄位
    //==========================================
    $("input[name='IsEncryption']").click(function () {
        var radioVale = $('input[name="IsEncryption"]:checked').val();
        if (radioVale == "on") {
            $("#EcryptionNote").show();
            EnableDOMObject($("#txtDecryptionDate"))
            $("input[name='DecryptionDate']").prop("readonly", false)
            dateDOMObject();
            $('input[name="DecryptionDate"').val("")
        } else {
            $("#EcryptionNote").hide();
            DisableDOMObject($("#txtDecryptionDate"));
            $("input[name='DecryptionDate']").prop("readonly", true)
            $('input[name="DecryptionDate"').val("")
        }
    })

    $("#CurrencyCode").on('change', function () {
        var CurrencyCode = $("#CurrencyCode").val();
        var result;
        $("input:hidden[name='CurrencyCode']").val($('#CurrencyCode option:selected').val());
        if (CurrencyCode == "TWD") {
            $("#ExchangeRateInput").val("1");
            $("#ExchangeRateDef").text(1);
        }
        else {
            $.ajax({
                async: false,
                url: '/BPC/GetCurrencyRate',
                dataType: 'json',
                type: 'POST',
                data: {
                    source: CurrencyCode
                },
                success: function (data, textStatus, jqXHR) {
                    result = data;
                    PricePrecision = 4;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("FIIS查無匯率資料");
                    $("#CurrencyCode").selectpicker();
                    $("#CurrencyCode").val("TWD");
                }
            });
            if (result == null) {
                $("#ExchangeRateInput").val("1");
            } else {
                $("#ExchangeRateDef").text(result.conversionRate);
                $("#ExchangeRateInput").val(result.conversionRate);
            }
        }
    });

    //移除發票管理人
    $(document).on('click', '.glyphicon-remove', function () {
        var divID = $(this).closest('div .area-fix02-2').attr('id');
        switch (divID) {
            case 'invoiceLinks':
                $("input[name=InvoiceEmpName]").val("");
                $("input[name=InvoiceEmpNum]").val("");
                resetInvoiceEmp();
                break;
        }
    });

    //新增合約申請明細
    $('#ApportionmentDetailTable').on('click', '.addButton', function () {
        var P_CustomFlowKey = $('#P_CustomFlowKey').val();  //"BPC_P1-002";
        var P_CurrentStep = $("#P_CurrentStep").val();
        var HeadType = $("#HeadType").val();
        if ($("#HeadType").val() != "Create") {
            count = $('#ApportionmentDetailTable tbody tr').length
            let template = $('#ApportionmentDetailList_Temp tr').clone().attr('id', 'ApportionmentDetail_' + (count));
            $(template).find('td.apportionmentCount').text(count + 1);
            $(template).find('td:eq(1)').find('input').eq(1).attr('name', 'ContractDetailList[' + (count) + '].CDetailID');
            $(template).find('td:eq(1)').find('select').attr('name', 'ContractDetailList[' + (count) + '].CategoryId');
            $(template).find('td:eq(1)').find('input').eq(0).attr('name', 'ContractDetailList[' + (count) + '].CategoryName');
            $(template).find('td:eq(2)').find('input').attr('name', 'ContractDetailList[' + (count) + '].ItemDescription');
            $(template).find('td:eq(3)').find('select').attr('name', 'ContractDetailList[' + (count) + '].UomCode');
            $(template).find('td:eq(3)').find('input').attr('name', 'ContractDetailList[' + (count) + '].UomName');
            $(template).find('td:eq(4)').find('input').attr('name', 'ContractDetailList[' + (count) + '].Price');
            $(template).find('td:eq(6)').find('input').attr('name', 'ContractDetailList[' + (count) + '].IsDelete');
            if (P_CustomFlowKey.indexOf("BPC_P3") > -1) {
                $(template).find('td:eq(5)').find('input').attr('name', 'ContractDetailList[' + (count) + '].NegotiationPrice');
                $(template).find('td:eq(5)').find('input').removeAttr("readonly");
            }
            else {
                $(template).find('td:eq(5)').find('input').attr('name', 'ContractDetailList[' + (count) + '].NegotiationPrice');
                $(template).find('td:eq(5)').find('input').removeClass();
            }
            $(template).find('.selectpickerInDetail').selectpicker();
            template.show();
            $('#ApportionmentDetailTable').append(template);
            $('#ApportionmentDetailTable tbody tr').not('[alt="hide"]').each(function (index) {
                $(this).find('.apportionmentCount').html(index + 1);
            });
        }
        else {
            count = $('#ApportionmentDetailTable tbody tr').length;
            let template = $('#ApportionmentDetailList_Temp tr').clone().attr('id', 'ApportionmentDetail_' + (count));
            $(template).find('td.apportionmentCount').text(count + 1);
            $(template).find('td:eq(1)').find('input').eq(1).attr('name', 'ContractDetailList[' + (count) + '].CDetailID');
            $(template).find('td:eq(1)').find('select').attr('name', 'ContractDetailList[' + (count) + '].CategoryId');
            $(template).find('td:eq(1)').find('input').eq(0).attr('name', 'ContractDetailList[' + (count) + '].CategoryName');
            $(template).find('td:eq(2)').find('input').attr('name', 'ContractDetailList[' + (count) + '].ItemDescription');
            $(template).find('td:eq(3)').find('select').attr('name', 'ContractDetailList[' + (count) + '].UomCode');
            $(template).find('td:eq(3)').find('input').attr('name', 'ContractDetailList[' + (count) + '].UomName');
            $(template).find('td:eq(4)').find('input').attr('name', 'ContractDetailList[' + (count) + '].Price');
            $(template).find('td:eq(6)').find('input').attr('name', 'ContractDetailList[' + (count) + '].IsDelete');
            if (P_CustomFlowKey.indexOf("BPC_P3") > -1) {
                $(template).find('td:eq(5)').find('input').attr('name', 'ContractDetailList[' + (count) + '].NegotiationPrice');
                $(template).find('td:eq(5)').find('input').removeAttr("readonly");
            }
            else {
                $(template).find('td:eq(5)').find('input').attr('name', 'ContractDetailList[' + (count) + '].NegotiationPrice');
            }
            $(template).find('.selectpickerInDetail').selectpicker();
            template.show();
            $('#ApportionmentDetailTable').append(template);

            $('#ApportionmentDetailTable tbody tr').not('[alt="hide"]').each(function (index) {
                $(this).find('.apportionmentCount').html(index + 1);
            });
        }
        $("#ApportionmentDetailTable tbody").find("tr").each(function () {
            console.log($(this).find("td").eq(5).find("input").val())
            var value = parseInt($(this).find("td").eq(5).find("input").val())

            if (value == 0) { $(this).find("td").eq(5).find("input").val(""); }
        })
    });

    //刪除合約申請明細
    $('#ApportionmentDetailTable').on('click', '.icon-cross', function () {
        var length = $('#ApportionmentDetailTable tbody').find('tr').not('[alt=hide]').length;
        if (length < 2) {
            alert("無法再進行刪除!")
            return;
        }

        var check = confirm('請確定是否刪除？');
        if (check == true) {
            var tr = $(this).parents('tr');
            var tdCDetailID = tr.find('[alt= "CDetailID"]').val();

            if (tdCDetailID == 0 || tdCDetailID.length >= 0) {
                $(tr).find("input:last").val("True");
                tr.attr("alt", "hide").hide().find('.apportionmentCount').text("");
            } else {
                $(tr).find("input:last").val("True");
                tr.attr("alt", "hide").hide().find('.apportionmentCount').text("");
            }
            var i = 0;
            var leng = $('#ApportionmentDetailTable tbody tr').not('[alt="hide"]').length;
            $('#ApportionmentDetailTable tbody tr').not('[alt="hide"]').each(function (index) {
                $(this).find('.apportionmentCount').html(index + 1);
                i++;
            });
            $('#ApportionmentDetailTable tbody tr').not('[alt="hide"]').each(function () {
                var serNo = $(this).find(".apportionmentCount").text()
                if (serNo == 1) {
                    var SelectVal = $(this).find("td:eq(1)").find("div").find(":selected").val();
                    if (SelectVal.length != 0) {
                        GetPurchasePerson(SelectVal);
                    }
                }
            })
        }
    });

    //新增報價供應商清冊
    $('#ApportionmentQuoteDetailTable').on('click', '.addButton', function () {
        let count = $('#ApportionmentQuoteDetailTable tbody tr').length;
        var template = $('#ApportionmentQuoteDetailList_Temp tr').clone().attr('id', 'ApportionmentQuoteDetailListDetail_' + count);
        $(template).find('td.apportionmentQuoteCount').text(count + 1);
        $(template).find('td:eq(1)').find("#VendorNum").attr('name', 'ContractVendorList[' + (count) + '].VendorNum');
        $(template).find('td:eq(1)').find("#Name").attr('name', 'ContractVendorList[' + (count) + '].Name');
        $(template).find('td:eq(2)').find("input").attr('name', 'ContractVendorList[' + (count) + '].RatingDate');
        $(template).find('td:eq(3)').find("input").attr('name', 'ContractVendorList[' + (count) + '].CommitmentDate');
        $(template).find('td:eq(4)').find("input").attr('name', 'ContractVendorList[' + (count) + '].StakeHolder');
        $(template).find('td:eq(5)').find("input").attr('name', 'ContractVendorList[' + (count) + '].StakeHolderDescription').attr("readonly", true);
        $(template).find('td:eq(6)').find("input").attr('name', 'ContractVendorList[' + (count) + '].IsDelete');

        template.show();
        $('#ApportionmentQuoteDetailTable').append(template);
        var i = 0;
        var leng = $('#ApportionmentQuoteDetailTable tbody tr').not('[alt="hide"]').length;
        $('#ApportionmentQuoteDetailTable tbody tr').not('[alt="hide"]').each(function (index) {
            $(this).find('.apportionmentQuoteCount').html(index + 1);
            i++;
        });
        $("#ContractTotalAmount").trigger('blur');
        fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
    });

    //刪除報價供應商清冊
    $('#ApportionmentQuoteDetailTable').on('click', '.icon-cross', function () {
        var length = $('#ApportionmentQuoteDetailTable tbody').find('tr').not('[alt=hide]').length;
        if (length < 2) {
            alert("無法再進行刪除!")
            return;
        }
        var check = confirm('請確定是否刪除？');

        if (check == true) {
            var tr = $(this).parents('tr');
            var tdVendorNum = tr.find('td').find("#VendorNum").val();
            if (tdVendorNum.length <= 0) {
                $(tr).remove();
            } else {
                $(tr).find("input:last").val("True");
                tr.attr("alt", "hide").hide().find('.apportionmentQuoteCount').text("");
            }
            fun_msgStockholder();

            $("#ContractTotalAmount").trigger('blur');
            var i = 0;
            var leng = $('#ApportionmentQuoteDetailTable tbody tr').not('[alt="hide"]').length;
            $('#ApportionmentQuoteDetailTable tbody tr').not('[alt="hide"]').each(function (index) {
                $(this).find('.apportionmentQuoteCount').html(index + 1);
                i++;
            });
        }
    });

    function InitialSetForm() {      
       
        if ($("#textPRamount").val() == 0) {
            $("#textPRamount").val("")
        }
        $("#ApportionmentDetailTable tbody").find("tr").each(function () {
            console.log($(this).find("td").eq(5).find("input").val())
            var value = parseInt($(this).find("td").eq(5).find("input").val())
            if (value == 0) { $(this).find("td").eq(5).find("input").val(""); }
        })
        var P_CustomFlowKey = $('#P_CustomFlowKey').val();
        var P_CurrentStep = $("#P_CurrentStep").val();
        var PageType = $('#HeadType').val();
        $("#Comusterkey").val(P_CustomFlowKey);
        $("#step").val(P_CurrentStep);

        if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1) {
            $("#box-area-3").parent("section-box-area").show();
            $("#box-area-4").parent("section-box-area").show();
        }
        else {
            $("#box-area-3").parent(".section-box-area").hide();
            $("#box-area-4").parent(".section-box-area").hide();
        }

        if (String(P_CustomFlowKey).indexOf("BPC_P3") > -1 && (PageType == "CheckOut" || PageType == "ReadOnly")) {
            $("#box-area-3").parent("section-box-area").show();
            $("#box-area-4").parent("section-box-area").show();
        }

        $('#ApportionmentDetailTable tr').each(function (index, element) {
            if ((String(P_CustomFlowKey).indexOf("BPC_P1") > -1 && (P_CurrentStep == "1" || P_CurrentStep == "2" || P_CurrentStep == "4" || P_CurrentStep == "5" || P_CurrentStep == "7" || P_CurrentStep == "8")) ||
                (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && (P_CurrentStep == "1"))) {
                $('#ApportionmentDetailTable tr').eq(index).find('th').eq(6).removeAttr("style", "display:none")
                $('#ApportionmentDetailTable tr').eq(index).find('td').eq(6).removeAttr("style", "display:none")
            }
            else {
                $('#ApportionmentDetailTable tr').eq(index).find('th').eq(6).attr("style", "display:none")
                $('#ApportionmentDetailTable tr').eq(index).find('td').eq(6).attr("style", "display:none")
            }
        })

        $('#ApportionmentQuoteDetailTable tr').each(function (index, element) {
            if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && P_CurrentStep == "1") {
                $('#ApportionmentQuoteDetailTable tr').eq(index).find('th').eq(6).removeAttr("style", "display:none")
                $('#ApportionmentQuoteDetailTable tr').eq(index).find('td').eq(6).removeAttr("style", "display:none")
            }
            else {
                $('#ApportionmentQuoteDetailTable tr').eq(index).find('th').eq(6).attr("style", "display:none")
                $('#ApportionmentQuoteDetailTable tr').eq(index).find('td').eq(6).attr("style", "display:none")
            }
        })

        var P_Status = $("#P_Status").val()
        if (String(P_CustomFlowKey).indexOf("BPC_P2") > -1 && P_CurrentStep == "1" && P_Status != 4) {//當為各關卡採購經辦的時候開啟該欄位
            if ($("#ContractTotalAmount").val() != 0) {
                EnableDOMObject("#PurchaseSigningLevelId");
                EnableDOMObject("#PurchasePriceStardandId");
            } else {
                $("#PurchaseSigningLevelId").addClass('input-disable');
                $("#PurchaseSigningLevelId").val("");
                $("#PurchaseSigningLevelId").selectpicker('refresh');
                $("#PurchasePriceStardandId").addClass('input-disable');
                $("#PurchasePriceStardandId").val("");
                $("#PurchasePriceStardandId").selectpicker('refresh');
            }
        }
    }
    function fun_accountingformatNumberdelzero(val) {
        val = accounting.formatNumber(val, 4)

        reg = /\.[0-9]*0$/
        while (reg.test(val)) {
            val = val.replace(/0$/, '');
        }
        val = val.replace(/\.$/, '');
        return val;
    }
});

function extendedPrecision() {
    var CurrencyCode = "";
    if ($("#HeadType").val() == "ReadOnly") {
        CurrencyCode = $('#CurrencyCode').text()
    } else { CurrencyCode = $('#CurrencyCode option:selected').val() }

    if (CurrencyCode != "TWD") {
        $.ajax({
            async: false,
            url: '/BPC/GetCurrencyRate',
            dataType: 'json',
            type: 'POST',
            data: {
                source: CurrencyCode
            },
            success: function (data, textStatus, jqXHR) {
                result = data;
                PricePrecision = 4
            },
            error: function (jqXHR, textStatus, errorThrown) {
                PricePrecision = 4;
            }
        });
    } else
        PricePrecision = 4;
}
//==========================================
// 議價單價金額欄位判定
//==========================================
function fun_NegotiationPriceJudgment(target) {
    fun_RemoveErrMesg($(target), "BPCNegotiationPriceErr", "")
    var Price = $(target).val();
    var NegotiationPrice = $(target).parents('tr').find('td:eq(4)').find('input').val();

    if (!regNum(Price, true)) {
        // fun_AddErrMesg($(target), "BPCNegotiationPriceErr", "欄位金額有誤");
        return false;
    } else {
        fun_RemoveErrMesg($(target), "BPCNegotiationPriceErr", "")
        if (Price > NegotiationPrice) {
            alert("議價單價輸入金額不可高於報價單價");
            return false;
        }
        else
            return true;
    }
}

//==========================================
// 報價單價金額欄位 判定
//==========================================
function fun_PriceJudgment(target) {
    fun_RemoveErrMesg($(target), "BPCPriceErr", "")
    var Price = $(target).parents('tr').find('td:eq(5)').find('input').val();
    var NegotiationPrice = $(target).val();
    if (!regNum(NegotiationPrice, true)) {
        // fun_AddErrMesg($(target), "BPCPriceErr", "欄位金額有誤");
        return false;
    }
    else {
        fun_RemoveErrMesg($(target), "BPCPriceErr", "")
        if (Price > NegotiationPrice) {
            alert("議價單價輸入金額不可高於報價單價");
            return false;
        } else
            return true;
    }
}

//數字驗證 *正值 得為0
function regNum(target, hasfloat) {
    if (hasfloat) {
        reg = /^(([0-9]\.[0-9]{1,4})|([1-9][0-9]*\.[0-9]{1,4})|([1-9]\d*))$/
    }
    else {
        reg = /^([1-9]\d*)$/
    }
    if (target.search(reg) == 0) {
        return true;
    }
    else {
        return false;
    }
}

function fun_SetSelectText(target) {
    var SelectContext = $(target).find(":selected").text();
    $(target).parents("div").next("[alt='SelectText']").find("input").val(SelectContext);
    $(target).next('.error-text').remove();
}

//==========================================
// 合約明細第一筆採購分類採購經辦
//==========================================

function fun_setPurchaseEmp(target) {
    $(target).next('.error-text').remove();
    var SelectContext = $(target).find(":selected").text();
    $(target).parents("div").next("[alt='SelectText']").find("input").val(SelectContext);
    var apportionmentCount = $(target).parents("tr").find("td").eq(0).text();
    if (apportionmentCount.trim() == '1') {
        var selectValue = $(target).val();
        GetPurchasePerson(selectValue);
    }
}

function setDefaultSelect(target, value) {
    $(target).find("option[value='" + value + "']").attr("selected", "selected")
    $(target).selectpicker('refresh');
    $(target).change()
}

function GetPurchasePerson(CategoryId) {
    var arr = [];

    $.ajax({
        async: false,
        url: '/BPC/GetCateGoryDefByCategoryId',
        dataType: 'json',
        type: 'POST',
        data: {
            CategoryId: CategoryId
        },
        success: function (data, textStatus, jqXHR) {
            var Result = JSON.parse(data);
            if (Result) {
                fn_PurchaseEmpNum(Result);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("FIIS資料無法取得採購分類經辦")
        }
    });
}

function fn_PurchaseEmpNum(Result) {//判斷是否有對應的採購經辦人員
    var options = $("#PurchaseEmpNum option");
    var values = $.map(options, function (options) {
        return options.value
    })
    var Flag = values.indexOf(Result[0].defaultBuyerEmployeeNumber) > -1 ? true : false;
    if (Flag) {
        $("select[name=PurchaseEmpNum]").val(Result[0].defaultBuyerEmployeeNumber).selectpicker("refresh")
        $("select[name=PurchaseEmpNum]").change()
        $('#Invoice .no-file-text').attr('style', 'display: none;');
        $('#Invoice .Links-peo').remove();
        ChangeNextEmp($('#P_CustomFlowKey').val(), $("#P_CurrentStep").val());
        var datas = [];
        if (Result) {
            datas.push({ user_id: $("select[name=PurchaseEmpNum]").val(), user_name: $("#PurchaseEmpNum option:selected").text() });
        }
        BPCQueryTemp(datas)
    }
    else {
        alert("該採購分類無對應採購經辦人員，請聯繫管理處採購科，謝謝。")
    }
}

function getSuppliesNumber(target) {
    getSuppliesOpenNumber = $(target).parents("tr").find(".apportionmentQuoteCount").text();
    return getSuppliesOpenNumber;
}

function getSupplies() {
    var result;
    $.ajax({
        async: false,
        url: '/BPA/GetSupplies',
        dataType: 'json',
        type: 'POST',
        success: function (data, textStatus, jqXHR) {
            result = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            result = null;
        }
    });
    return result;
}

function vendorSelected(data) {
    fun_AddSupplies(OpenIndex, data);
}

function suppliesUIChange(name, number) {
    $('#suppliesName').text(name);
    $('#suppliesSerno').text(number);
    $('#vendorNameSearch').text(name + '(' + number + ')');
}

function fun_AddSupplies(indexNum, VendorObject) {
    if ($('input[name="VendorSelect"]:checked').length > 0) {
        var selectVendor = $('input[name="VendorSelect"]:checked').parents('li');
        context = $(selectVendor).find($("div:nth-child(3)")).text();
        Name = $(selectVendor).find($("div:nth-child(3)")).text();
        VendorNumber = $(selectVendor).find($("div:nth-child(2)")).text();
        promisEffectDate = $(selectVendor).find($("div:nth-child(5)")).text();
        sefEffectiveDate = $(selectVendor).find($("div:nth-child(6)")).text();
        VendorID = $(selectVendor).find($("div:nth-child(4)")).text();
        isStakeholders = fn_ajaStockholders(VendorID);
        if (isStakeholders == "False") {
            isStakeholdersNamestr = "否";
        } else {
            isStakeholdersNamestr = "是";
        }

        $("#ApportionmentQuoteDetailTable tr").each(function (index, element) {
            console.log(index)
            var targetNum = $(this).find(".apportionmentQuoteCount").text();
            if (targetNum == indexNum) {
                $(this).find("#Name").val(Name);
                $(this).find("#VendorNum").val(VendorNumber);
                $(this).find("#SuppliesOpen").prev("span").text(context);
                $(this).find("#SuppliesOpen").next("input").val(context);
                $(this).find("#selfEvaluationDate").text(promisEffectDate);
                $(this).find("#selfEvaluationDate").next("input").val(promisEffectDate);
                $(this).find("#commitmentDate").text(sefEffectiveDate);
                $(this).find("#commitmentDate").next("input").val(sefEffectiveDate)
                $(this).find("#IsStakeholders").text(isStakeholdersNamestr);
                $(this).find("#IsStakeholders").next("input").val(isStakeholders)
                if (isStakeholdersNamestr == "是") {
                    $(this).find("td:eq(5)").find("input").removeAttr("style").removeClass().addClass("input h30").removeAttr("disabled").removeAttr("readonly").val("");
                }
                else {
                    $(this).find("td:eq(5)").find("input").attr("style", "border:none").removeClass().addClass("disable-text").val("").attr("disabled", "disabled");
                }
                $("[alt='ApportionmentQuoteDetailTableErr']").remove();
            }
        })

        fun_msgStockholder();
        $("#ContractTotalAmount").trigger('blur');
        fun_RemoveErrMesg($('#ContractTotalAmount'), "ContractTotalAmountErr", "")
    }
    else {
        $(this).find("#SuppliesOpen").prev("span").text("");
        $(this).find("#selfEvaluationDate").text("");
        $(this).find("#selfEvaluationDate").next("input").val("");
        $(this).find("#commitmentDate").text("");
        $(this).find("#commitmentDate").next("input").val("")
        $(this).find("#IsStakeholders").text("");
    }
    fun_msgStockholder();
}

function fn_ajaStockholders(id) {
    let rtn;
    $.ajax({
        url: '/BPC/CheckIsInvolvedParties',
        //dataType: 'json',
        type: 'POST',
        data: { id: id },
        async: false,
        success: function (data, textStatus, jqXHR) {
            rtn = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
        }
    });
    return rtn;
}

function QueryUser(datas, type, row) {
    var div = $('<div>').attr('class', 'Links-peo');
    div.append('<span>' + datas[0].user_name.replace(/\d+/, "").replace(/\s+/, "") + '(' + datas[0].user_id + ')</span>')
    .append('<div class="XX01"><i class="glyphicon glyphicon-remove orgpick-remove"></i></div>')

    $('#Invoice').append(div);
    $('#Invoice .Links').hide();
    $('input[name="InvoiceEmpName"]').val(datas[0].user_name);
    $('input[name="InvoiceEmpNum"]').val(datas[0].user_id);
}

function BPCQueryTemp(datas, type, row) {
    if (datas) {
        $('#Invoice .no-file-text').hide();
        $('#Invoice span').text(datas[0].user_name + '(' + datas[0].user_id + ')');
        $('#Invoice .Links').show();
        $('input[name="InvoiceEmpName"]').val(datas[0].user_name);
        $('input[name="InvoiceEmpNum"]').val(datas[0].user_id);
    }
    else {
        $('#Invoice .Links').hide();
        $('#Invoice .no-file-text').show();
    }
}

function getSelectdata() {
    var data;
    var Purchasedata = [];
    $.ajax({
        url: '/BPC/GetInvocieDefault',
        type: 'POST',
        data: '',
        success: function (data) {
            if (data != "") {
                var obj = $.parseJSON(data);
                fun_setSelectOption($('#PurchaseEmpNum'), obj)
            }
        },
        error: function () {
            alert('error occured');
        }
    });
}

function fun_setSelectOption(target, data) {
    $(target).selectpicker('refresh');
}

//==============================
//使日期不可大於今日
//==============================
function dateDOMObject() {
    $('#txtDecryptionDate').data("DateTimePicker").minDate(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate());
}
function fun_AddComma(targetNum) {
    num = targetNum;
    reg = /(\d+)(\d{3})/
    while (reg.test(num)) {
        num = num.replace(reg, "$1,$2")
    }
    return num;
}

function fun_accountingformatNumberdelzero(val) {
    val = accounting.formatNumber(val, 4)
    reg = /\.[0-9]*0$/
    while (reg.test(val)) {
        val = val.replace(/0$/, '');
    }
    val = val.replace(/\.$/, '');
    return val;
}