//let _requiredIcon = '<b class="required-icon">*</b>';
let _currencyTypeChanged = true;
let _alerttext = [];
let tabledetailflag = 0;
let PurchaseEmpListSet;
var Itemlist = new Array();
var LevelList = new Array();
var SuppliesList = new Array();
var PR = getModel();
var P_CustomFlowKey = $('#P_CustomFlowKey').val();
var P_CurrentStep = $("#P_CurrentStep").val();
var HandType = $("#hidHandType").val()
let tmpPurReqDetailList = [];
$(function () {
    DisableDOMObject($("#SelPrj"));
    DisableDOMObject($("#SelPrjItem"));

    if (HandType == "ReadOnly") {
        CalculationAmount();
        ReadOnly();
    }

    if (HandType == "CheckOut" && P_CustomFlowKey == "PRD_P1_001" && P_CurrentStep == 1) {
        CalculationAmount();
        EditFieldControl();
    }

    if (HandType == "CheckOut" && P_CurrentStep == 2) {///唯讀全部鎖定
        CalculationAmount();
        ReadOnly();
    }
    if (HandType == "Edit") {
        CalculationAmount();
        $("#ENPDetailTable tbody").each(function () {
            $(this).find("select[name=PurchaseEmpNum]").selectpicker('refresh');
            $(this).find('.Rate').text(parseFloat($(this).find('.Rate').text()));
            if (!isNaN($(this).find('.Currency').text())) {
                $(this).find('.Currency').text(fun_accountingformatNumberdelzero($(this).find('.Currency').text()));
            }
            $(this).find('.description').text(fun_accountingformatNumberdelzero(parseFloat($(this).find('.description').text())));
            $(this).find('.HightPrice').text(fun_accountingformatNumberdelzero($(this).find('.HightPrice').text()));
            $(this).find("#ViewPRDetialBtn").removeAttr("onclick").addClass("input-disable").prop("disabled", true);
            $(this).find('[ViewPRDetialBtn]').attr("class", "input-disable");
        })
    }
    if (HandType == "CheckOut" && String(P_CustomFlowKey).indexOf("PR_P1") > -1 && P_CurrentStep == 1) {
        CalculationAmount();
        $("#ENPDetailTable tbody").each(function () {
            console.log($(this).html());
            $(this).find("select[name=PurchaseEmpNum]").selectpicker('refresh');
        })
    }

    YCDetailTable();
    if ($("#textPRamount").val() != '') {
        $("#textPRamount").val(accounting.unformat($("#textPRamount").val()))//accounting.formatNumber($("#textPRamount").val())
    }

    $(document).on(
         {
             mouseenter:
                 function () {
                     $(this).find('#DeleteThisPRDetail').show();
                 },
             mouseleave:
                 function () {
                     $(this).find('#DeleteThisPRDetail').hide();
                 }
         },
         "#ENPDetailTable tbody"
     )

    $(document).on(
        {
            mouseenter:
                function () {
                    $(this).find('#DeletePopPRDetail').show();
                },
            mouseleave:
                function () {
                    $(this).find('#DeletePopPRDetail').hide();
                }
        },
        "#PRTableTemplate tbody"
    )

    $(document).on(
       {
           mouseenter:
               function () {
                   $(this).find('#DeletePrYcDev').show();
               },
           mouseleave:
               function () {
                   $(this).find('#DeletePrYcDev').hide();
               }
       },
       "#PRTableTemplate tbody"
   )

    //==========================================
    // 設定專案類別、專案、專案項目
    //==========================================
    if (__SelPrjCat != "") {
        setDefaultSelect($("#SelPrjCat"), __SelPrjCat)
    }

    if (__SelPrj != "") {
        setDefaultSelect($("#SelPrj"), __SelPrj)
    }

    if (__SelPrjItem != "") {
        setDefaultSelect($("#SelPrj"), __SelPrjItem)
    }

    if ($("#P_CurrentStep").val() == 2 && $("#P_Status").val() == 2) {
        $.each($(".ViewPRDetail"), function () {
            $(this).removeClass();
        });
    }

    //==========================================
    // 請款明細層
    //==========================================

    $(document).on('click', '#ExpandENPDetail', function () {
        if ($(this).find('.glyphicon-chevron-down').length > 0) {
            SwitchHideDisplay([], [$(this).parents('tbody').find('.ENPDetail')]);
        } else {
            SwitchHideDisplay([$(this).parents('tbody').find('.ENPDetail')], []);
        }
        $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up')
    });

    $(document).on('click', '#ExpandAllENPDetail', function () {
        if ($(this).find('.list-open-icon').length > 0) {
            SwitchHideDisplay([], [$('.ENPDetail')]);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up')
        } else {
            SwitchHideDisplay([$('.ENPDetail')], []);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
        }
        $(this).find('.toggleArrow').toggleClass('list-close-icon list-open-icon')
    });

    if (HandType == "Edit" || HandType == "Create") {
        $(".p-all0").eq(0).trigger('click');//default打開明細層
    }

    if (HandType == "CheckOut" && P_CustomFlowKey == "PRD_P1_001" && P_CurrentStep == 1) {
        $(".p-all0").eq(0).trigger('click');//default打開明細層
    }

    //新增明細
    $(document).on('click', '#AppendENPDetail', function () {
        $("[alt=ENPDetailTableErr]").remove();
        $("[alt=tabDevyDetErr]").remove();
        let count = $('#ENPDetailTable tbody').length;
        let template = $('#ENPDetailCloneTemplate').clone().attr('id', 'ENPDetail_' + count);
        $(template).find('td.DetailSerno').text(count + 1);
        $(template).find(".selectpickerPurchaseEmp").selectpicker();
        $(this).parents('table').append(template);
        var j = 1;

        $('#ENPDetailTable tbody').not('.bodyHide').children("tr").find('td.DetailSerno').each(function () {
            $(this).text(j);
            j++;
        })
    });

    //協議採購 新增送貨明細 掛帳單位那些...第三層
    $(document).on('click', '#AppendPrDetail', function () {
        let count = $('#PRTableTemplate tbody').length;
        let template = $('#PRDetailCloneTemplate_Temp').clone().attr('id', 'PRDetail_' + count);
        $(template).find('td.DetailSerno').text(count + 1);
        $(template).find(".selectpickerInDetail").selectpicker();
        template.show();
        $('#PRTableTemplate').append(template);
        var j = 1;
        $('#PRTableTemplate tbody').not("[alt=PRDvyDel]").children("tr").find('td.DetailSerno').each(function () {
            $(this).text(j);
            j++;
        })
    });

    //協議採購-POP送貨層 : 確定
    $("[data-remodal-id=PRSendDetailremodal]").on('click', '.remodal-confirm-btn', function () {
        var YnPass = "true";
        if ($("#hidHandType").val() != "ReadOnly") {
            var DetMainSN = $('#PRTableTemplate thead').children('tr').find("[name=hidMainSerNo]").val();
            var DetTarSn = $('#ENPDetailTable').children("tbody").find('td.DetailSerno').filter(function () {
                return $(this).text() == DetMainSN
            });

            var DetTarget = DetTarSn.closest('tbody');
            var tabDev = $(DetTarget).children('tr').find("[name=tabDevyDet]");
            var DevId = tabDev.find("[name=hidPRDeliveryID]").val();

            var strSec = "";

            var u = 1; var QtySum = 0;
            $('#PRTableTemplate tbody').each(function () {
                var Sn = $(this).children("tr").find('td.DetailSerno').text();
                var ChargeDept = $(this).children("tr").find("[name=ChargeDept]").val();
                var RcvDept = $(this).children("tr").find("[name=RcvDept]").val();
                var Qty = accounting.unformat($(this).children("tr").find("[name=DevQuantity]").val());
                if (ChargeDept == "" || RcvDept == "" || Qty <= 0) {
                    YnPass = "false";
                }

                var DvyId = $(this).children("tr").find("[name=hidDeliveryIDSet]").val()
                var amount = $(this).children("tr").find("[name=DevAmount]").find('b').text();
                var PRDeliveryDel = $(this).find("input[name=DeliveryIsDelete]").val();

                if (PRDeliveryDel == 0) {
                    QtySum = parseInt(QtySum) + parseInt(Qty);
                }

                strSec = strSec + '   <tr name="trDevyDet" >\
             <td >' + Sn + ' <input name="hidPRDeliveryID" type="text" value="' + DvyId + '" /></td>\
            <td><input name="hidDeliveryIsDelete" type="text" value="' + PRDeliveryDel + '" /></td>\
            <td name="ChargeDept">' + ChargeDept + '</td>\
            <td name="RcvDept">' + RcvDept + '</td>\
            <td name="DevQuantity">' + Qty + '</td>\
            <td name="DevAmount">' + amount + '</td>\
                           </tr>';
            })

            if (YnPass == "true") {
                DetTarSn.not('[alt=PRDvyDel]').nextAll("[name=QuantityPurchase]").children("b").text(fun_accountingformatNumberdelzero(QtySum.toString()));
                DetTarSn.nextAll("[name=QuantityPurchase]").text(fun_accountingformatNumberdelzero(QtySum));

                tabDev.html('');
                $(tabDev).append(strSec);
                CalculationAmount();
            } else {
                alert("掛帳單位、收貨單位、數量均為必填欄位，且 數量應填入大於0的數字，請重新建立「協議採購-送貨明細」資料!");
                return false;
            }
        }
    });

    //檢視明細紀錄
    $(document).on('click', '#ViewPRDetialBtn', function () {
        var PRDetailID = $(this).closest("tbody").find("input[name=hidPRDetailID]").val();
        if ($("#P_CurrentStep").val() == 2 && $("#P_Status").val() == 2) {
            fun_showPRDetial(PRDetailID);
        }
    });

    $(document).on('click', '#DeleteThisPRDetail', function () {
        if ($('#ENPDetailTable').find('tbody').not('.bodyHide').find('td.DetailSerno').text() < 2) {
            alertopen("無法再進行刪除!")
            return;
        }
        var PRNum = $(this).parents('tbody').find('tr').find('input[name=PRNumIsDelete]').val();
        var aa = $(this).parents('tbody').find('tr').find('[alt=PRIsDelete]').val();
        if (PRNum == "") {
            $(this).find("tr[name='trSupplier']").find("td[name='Price']").find(".Currency").text(0);
            $(this).parents('tbody').remove();
            $(this).parents('tbody').find('tr').find('[alt=PRIsDelete]').val(1);
            CalculationAmount();
        }
        else {
            $(this).find("tr[name='trSupplier']").find("td[name='Price']").find(".Currency").text(0);
            $(this).parents('tbody').hide();
            $(this).parents('tbody').find('tr').find('[alt=PRIsDelete]').val(1);
            $(this).parents('tbody').attr('class', 'bodyHide')
            CalculationAmount();
        }
        var j = 1;
        $('#ENPDetailTable tbody').not('.bodyHide').children("tr").find('td.DetailSerno').each(function () {
            $(this).text(j);
            j++;
        })
    });

    $(document).on('click', '#DeletePopPRDetail', function () {
        if ($(this).parents('table').find('tbody').length < 2) {
            alertopen("無法再進行刪除!")
            return;
        }
        $(this).parents('tbody').remove();
        RenumberingDetail($('table#PRTableTemplate tbody'), 'DetailSerno')
    });

    $(document).on('click', '#DeletePrYcDev', function () {
        //if (HandType == "CheckOut" || HandType == "Edit") {
        //    if ($(this).parents('table').find('tbody').not("[alt=PRDvyDel]").length < 2) {
        //       // alertopen("無法再進行刪除!")
        //        return false;
        //    }
        //    var PRDeliveryID = $(this).parents('tbody').find('input[name=PRDeliveryID]').val();
        //    if (PRDeliveryID == "" || PRDeliveryID == 0) {
        //        $(this).parents('tbody').remove();
        //    }
        //    else {
        //        $(this).parents('tbody').find('input[name=DeliveryIsDelete]').val(1);
        //        $(this).parents('tbody').hide();
        //        $(this).parents('tbody').attr("alt", "PRDvyDel")
        //        CalculationAmount();
        //    }
        //}
        //else {
        //    if ($(this).parents('table').find('tbody').length < 2) {
        //       // alertopen("無法再進行刪除!")
        //        return false;
        //    }
        //    var PRDeliveryID = $(this).parents('tbody').find('input[name=PRDeliveryID]').val();
        //    if (PRDeliveryID == "" || PRDeliveryID == 0) {
        //        $(this).parents('tbody').remove();
        //    }
        //    else {
        //        $(this).parents('tbody').find('input[name=DeliveryIsDelete]').val(1);
        //        $(this).parents('tbody').hide();
        //        $(this).parents('tbody').attr("alt", "PRDvyDel")
        //        CalculationAmount();
        //    }
        //}

        var PRDeliveryID = $(this).parents('tbody').find('input[name=PRDeliveryID]').val();
        if (PRDeliveryID == "" || PRDeliveryID == 0) {
            $(this).parents('tbody').remove();
        }
        else {
            $(this).parents('tbody').find('input[name=DeliveryIsDelete]').val(1);
            $(this).parents('tbody').hide();
            $(this).parents('tbody').attr("alt", "PRDvyDel")
            CalculationAmount();
        }

        $('#PRTableTemplate tbody').not("[alt=PRDvyDel]").each(function (index) {
            $(this).children("tr").find('td.DetailSerno').text(index + 1);
        })
    });

    $(document).on('click', '.AmortizationDetailCreate', function () {
        var PurchaseCategory = $(this).parents('tbody').find('.ItemName').text();
        if (PurchaseCategory != "系統自動帶入") {
            var HandType = $("#hidHandType").val();
            if (HandType == "ReadOnly") {
                $("#AppendPrDetail").hide();
                $("div.icon-remove-size").remove();
            }
            if ((String(P_CustomFlowKey).indexOf("PRD_P1") > -1 && String(P_CurrentStep).indexOf("1") > -1)) {
            }
            else {
                $("#AppendPrDetail").hide();
                $("div.icon-remove-size").remove();
            }
            //此處Amount會判斷是不是要把送貨層清空
            var Amount = parseFloat(accounting.unformat($(this).closest("tbody").find('td[name=QuantityPurchase]').text()));
            var twdPri = parseFloat(accounting.unformat($(this).closest("tbody").find("tr").find("td[name=Price]").text()));
            $('#PRTableTemplate thead').children('tr').find("[name=hidTwdPrice]").val(twdPri);
            var DetMainSerNo = $(this).closest("tbody").find('td.DetailSerno').text();
            $('#PRTableTemplate thead').children('tr').find("[name=hidMainSerNo]").val(DetMainSerNo);

            $(this).closest("tbody").find("[name^=trPRDev]").show();
            var tabDevy = $(this).closest("tbody").find("[name=tabDevyDet]");
            if (tabDevy.html().trim() != "") {
                $('#PRTableTemplate').find('#PRSendDetailCloneTemplate').remove();
                $('#PRTableTemplate').find("[name^=PRDvy]").remove();
                $('#PRTableTemplate').find("[id^=PRDetail]").remove();
                var j = 1;

                //此處處理 送貨層 開啟時 送貨單位 收貨單位 數量 金額
                tabDevy.find("[name=trDevyDet]").each(function () {
                    var PRDeliveryId = $(this).find("[name=hidPRDeliveryID]").val();
                    var PRDeliveryDelete = $(this).find("[name=hidDeliveryIsDelete]").val();
                    let template = $('#PRDetailCloneTemplate_Temp').clone();

                    $(template).attr('name', 'PRDvy_' + j.toString().trim());
                    $(template).children("tr").find('td.DetailSerno').text(j);
                    if (PRDeliveryId != "") {
                        if (Amount == 0) {
                            $(template).attr('alt', 'PRDvyDel');
                            $(template).find("input[name=PRDeliveryID]").val(PRDeliveryId);
                            $(template).find("input[name=DeliveryIsDelete]").val(1);
                        }

                        else {
                            if (PRDeliveryDelete == 1) {
                                $(template).attr('alt', 'PRDvyDel');
                                $(template).find("input[name=PRDeliveryID]").val(PRDeliveryId);
                                $(template).find("input[name=DeliveryIsDelete]").val(1);
                            }
                            else {
                                $(template).find("input[name=PRDeliveryID]").val($(this).find("[name=hidPRDeliveryID]").val());
                                $(template).find("input[name=DeliveryIsDelete]").val(0);
                            }
                        }
                    }
                    else {
                        $(template).find("input[name=PRDeliveryID]").val(accounting.unformat($(this).find("[name=hidPRDeliveryID]").val()));
                        $(template).find("input[name=DeliveryIsDelete]").val(0);
                    }
                    if (!isNaN(parseFloat(accounting.unformat($(this).find("[name=DevQuantity]").text())))) {
                        $(this).find("[name=DevQuantity]").text(fun_accountingformatNumberdelzero(($(this).find("[name=DevQuantity]").text())))
                    }

                    if (isNaN(parseFloat(accounting.unformat($(this).find("[name=DevQuantity]").text())))) {
                        $(template).find("[name=DevQuantity]").val(0);
                    }
                    else {
                        $(template).find("[name=DevQuantity]").val(fun_accountingformatNumberdelzero(($(this).find("[name=DevQuantity]").text())));
                    }

                    var devAmount = $(this).find("[name=DevAmount]").text().trim().length == 0 ? "系統自動帶入" : $(this).find("[name=DevAmount]").text()
                    if (isNaN(accounting.unformat(devAmount))) {
                        $(template).find("[name=DevAmount]").find('b').text(0);
                    }
                    else {
                        if (devAmount == 0) {
                            $(template).find("[name=DevAmount]").find('b').text("系統自動帶入");
                        }
                        else {
                            $(template).find("[name=DevAmount]").find('b').text(fun_accountingformatNumberdelzero(devAmount));
                        }
                    }

                    var selCha = $(template).find("[name=ChargeDept]");
                    var selRcv = $(template).find("[name=RcvDept]");
                    setDetailDefaultSelect(selCha, $(this).find("[name=ChargeDept]").text().trim());
                    setDetailDefaultSelect(selRcv, $(this).find("[name=RcvDept]").text().trim());
                    $(template).find("[name=hidDeliveryIDSet]").val($(this).find("[name=hidPRDeliveryID]").val());

                    //唯讀頁跟結案前 送貨層唯讀
                    if (HandType == "ReadOnly" || (HandType == "CheckOut" && P_CurrentStep == 2)) {
                        disFieldControl($(template).find("[name=DevQuantity]"), null, $(this).find("[name=DevQuantity]").text())
                        var txtChargeDept = $(template).find("select").eq(0).find("option:selected").text().trim();
                        var txtRcvDept = $(template).find("select").eq(1).find("option:selected").text().trim();
                        $(template).find("td").eq(1).find("div").eq(2).text(txtChargeDept).removeClass();
                        $(template).find("td").eq(2).text(txtRcvDept).removeClass();
                        $(template).find("td").eq(3).find("div").removeClass();
                        $(template).find("td").eq(4).find("div").find("b").removeClass()
                    }

                    template.show();
                    $('#PRTableTemplate').append(template);
                    j++;
                })
            }
            else {
                $('#PRTableTemplate').find('#PRSendDetailCloneTemplate').remove();
                $('#PRTableTemplate').find("[name^=PRDvy]").remove();
                $('#PRTableTemplate').find("[id^=PRDetail]").remove();

                let template = $('#PRDetailCloneTemplate_Temp').clone();
                $(template).find("[name=DevQuantity]").val("");
                $(template).find("[name=DevAmount]").find('b').text('系統自動帶入');
                var selCha = $(template).find("[name=ChargeDept]");
                var selRcv = $(template).find("[name=RcvDept]");
                setDefaultSelect(selCha, '');
                setDefaultSelect(selRcv, '');
                $(template).find("[name=hidDeliveryIDSet]").val('');
                template.show();
                $('#PRTableTemplate').append(template);
            }

            $(this).closest("tbody").find("[name^=trPRDev]").hide();

            $('#PRTableTemplate').find('[alt=PRDvyDel]').attr('style', 'display:none');

            var tabDevileryCount = $('#PRTableTemplate tbody').not('[alt=PRDvyDel]').length;
            if (tabDevileryCount == 0) {
                let template = $('#PRDetailCloneTemplate_Temp').clone();
                $(template).find("[name=DevQuantity]").val("");
                $(template).find("[name=DevAmount]").find('b').text('系統自動帶入');
                var selCha = $(template).find("[name=ChargeDept]");
                var selRcv = $(template).find("[name=RcvDept]");
                setDefaultSelect(selCha, '');
                setDefaultSelect(selRcv, '');
                $(template).find("[name=hidDeliveryIDSet]").val('');
                template.show();
                $('#PRTableTemplate').append(template);
            }

            $('#PRTableTemplate tbody').not('[alt = PRDvyDel]').find('td.DetailSerno').each(function (index) {
                $(this).text(index + 1)
            });

            if (HandType == "ReadOnly" || (HandType == "CheckOut" && P_CurrentStep == 2)) {
                $('[data-remodal-id=PRSendDetailremodal]').find("a.remodal-confirm-btn").remove();
                $('[data-remodal-id=PRSendDetailremodal]').find("a.remodal-cancel-btn").text("確定");
            }

            $('[data-remodal-id=PRSendDetailremodal]').remodal().open();
        } else {
            alert("請先選擇採購品項");
        }
    });

    $(document).on('click', '#ExpandAmortizationDetail', function () {
        if ($(this).find('.glyphicon-chevron-down').length > 0) {
            SwitchHideDisplay([], [$(this).parents('tbody').find('.AmortizationDetail')]);
        } else {
            SwitchHideDisplay([$(this).parents('tbody').find('.AmortizationDetail')], []);
        }
        $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up')
    });

    $(document).on('click', '#ExpandAllAmortizationDetail', function () {
        if ($(this).find('.list-open-icon').length > 0) {
            SwitchHideDisplay([], [$('.AmortizationDetail')]);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up')
        } else {
            SwitchHideDisplay([$('.AmortizationDetail')], []);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
        }
        $(this).find('.toggleArrow').toggleClass('list-open-icon list-close-icon')
    });

    $(document).on('click', '#POItemGet', function () {
        if ($('#hidHandType').val() == "ReadOnly") {
            if (!(String(P_CustomFlowKey).indexOf("PRD_P1") > -1 && String(P_CurrentStep).indexOf("1") > -1) && $('#hidHandType').val() == "CheckOut") {
                return false;
            }
        }// else
        //   $("#popPOitemList").remodal().open();
    });

    $("[alt='PRInfoTable']").on("click", "[alt=linkpopPOitemList]", function () {
        var trPrDevTable = $(this).closest('tbody').find('tr[name="trPRDev"]').find('table[name="tabDevyDet"]');
        fun_popPOitemListSearch();
        fun_popPOitemList_Send($(this), trPrDevTable);
    });

    //==============================
    // 專案
    //==============================

    $("#SelPrjCat").change(function () {
        $("#SelPrj").setSelectOption($("#SelPrj"), "set", null)
        $("#SelPrj").setSelectOption($("#SelPrjItem"), "set", null)
        DisableDOMObject($("#SelPrj"));
        DisableDOMObject($("#SelPrjItem"));
        var prjCat = $(this).val();
        $.ajax({
            url: '/Project/GetProjectDropMenu',
            data: {
                projectCategoryCode: prjCat
            },
            success: function (data) {
                if (data) {
                    EnableDOMObject($("#SelPrj"));
                    $("select[name=SelPrj]").append($("<option></option>").attr("value", "").text("請選擇"))
                    $.each(data, function (index, obj) {
                        $("select[name=SelPrj]").append($("<option></option>").attr("value", index).text(obj))
                    })
                }
                $("select[name=SelPrj]").selectpicker('refresh');
            }
        });
    })
    //==============================
    // 專案項目
    //==============================

    $("#SelPrj").change(function () {
        $("#SelPrj").setSelectOption($("#SelPrjItem"), "set", null)
        var prjId = $(this).val();
        $.ajax({
            url: '/Project/GetProjectItemDropMenu',
            data: {
                projectID: prjId
            },
            success: function (data) {
                if (data) {
                    EnableDOMObject($("#SelPrjItem"));
                    $("select[name=SelPrjItem]").append($("<option></option>").attr("value", "").text("請選擇"))
                    $.each(data, function (index, obj) {
                        $("select[name=SelPrjItem]").append($("<option></option>").attr("value", index).text(obj))
                    })
                }
                $("select[name=SelPrjItem]").selectpicker('refresh');
            }
        });
    })
});

$(document).on('change', '#chkConfidential', function () {
    if ($(this).prop('checked')) {
        EnableDOMObject($('#divEcryption'));
    } else {
        DisableDOMObject($('#divEcryption'));
    }
});

$(document).on('closed', '#PRSendDetailremodal', function () {
    CalculationAmount()
});

function FieldControl(P_CustomFlowKey, P_CurrentStep) {
    if (String(P_CustomFlowKey).indexOf("PRD_P1") > -1 && String(P_CurrentStep).indexOf("1") > -1) {
        $("#txtSubject").remove();
        $("#txtDescription").remove();
        $("#Subject").show();
        $("#Subject").attr("readonly", false);
        $("#Description").show();
        $("#Description").attr("readonly", false);
        EnableDOMObject($("#SelPrjCat"));
        $("#SelPrj").attr('readonly', false).addClass('input-disable')
        $("#SelPrjItem").attr('readonly', false).addClass('input-disable')
        $("#textPRamount").prop("readonly", true);
        $('#ENPDetailTable tr').each(function (index, element) {
            $("input,textarea").prop("readonly", false);
        });

        $('#PRDetailCloneTemplate_Temp tr').each(function (index, element) {
            $("#ReviceUnit_Temp").attr('disabled', false);
            $("#ReviceUnit_Temp").removeClass('input-disable');
            $("#ReviceUnit_Temp").parent('div').removeClass('input-disable');
            $("#AccountUnit_Temp").attr('disabled', false);
            $("#AccountUnit_Temp").removeClass('input-disable');
            $("#AccountUnit_Temp").parent('div').removeClass('input-disable');
        });
        $(".commentTyping").attr("readonly", false)
    }

    else {
        $("#txtSubject").remove();
        $("#txtDescription").remove();
        $("#Subject").show();
        $("#Subject").attr("readonly", false);
        $("#Description").show();
        $("#Description").attr("readonly", false);
        EnableDOMObject($("#SelPrjCat"));
        $("#SelPrj").attr('readonly', false).addClass('input-disable')
        $("#SelPrjItem").attr('readonly', false).addClass('input-disable')
        $("#textPRamount").prop("readonly", true);
        $('#ENPDetailTable tr').each(function (index, element) {
            $("input,textarea").prop("readonly", false);
        });

        $('#ENPDetailTable tbody').each(function (index, element) {
            console.log($(this).find("select[name=PurchaseEmpNum]").val() + $(this).find("select[name=PurchaseEmpNum] option:selected").text());
            disFieldControl($(this).find("select[name=PurchaseEmpNum]"), $(this).find("select[name=PurchaseEmpNum] option:selected").text(), $(this).find("select[name=PurchaseEmpNum]").val())
        });

        $('#PRDetailCloneTemplate_Temp tr').each(function (index, element) {
            $("#ReviceUnit_Temp").attr('disabled', false);
            $("#ReviceUnit_Temp").removeClass('input-disable');
            $("#ReviceUnit_Temp").parent('div').removeClass('input-disable');
            $("#AccountUnit_Temp").attr('disabled', false);
            $("#AccountUnit_Temp").removeClass('input-disable');
            $("#AccountUnit_Temp").parent('div').removeClass('input-disable');
        });

        $(".commentTyping").attr("readonly", false)
    }
}

//==============================
// 請款明細層建立
//==============================
function YCDetailTable() {
    let e = $('#YCDetailTable');
    let template = $('#ENPDetailTableTemplate').clone().attr('id', 'ENPDetailTable');
    $(template).find('#ENPDetailCloneTemplate').attr('id', 'ENPDetail_0');
    $(template).find('.selectpickerPurchaseEmp').selectpicker();
    $(e).parents('div.content-box').append($(template).show())
    $(e).remove();
}
//==============================
//使DOM元件失效
//==============================
function DisableDOMObject(obj) {
    $(obj).attr('disabled', true);
    if ($(obj)[0] == undefined) {
        return;
    }
    if ($(obj)[0].tagName === 'SELECT') {
        $(obj).addClass('input-disable');
        $(obj).selectpicker('refresh');
    };
    if ($(obj)[0].tagName === 'DIV') {
        $(obj).data('DateTimePicker').destroy();
        $(obj).find('input').addClass('input-disable')
        $(obj).find('span').addClass('input-disable')
    }
}
//==============================
//使DOM元件有效
//==============================
function EnableDOMObject(obj) {
    $(obj).attr('disabled', false);
    if ($(obj)[0].tagName === 'SELECT') {
        $(obj).removeClass('input-disable');
        $(obj).parent('div').removeClass('input-disable');
        $(obj).selectpicker('refresh');
    };
    if ($(obj)[0].tagName === 'DIV') {
        $(obj).datetimepicker({ format: 'YYYY-MM-DD' });

        $(obj).find('input').removeClass('input-disable');
        $(obj).find('input').removeClass('disabled');
        $(obj).find('span').removeClass('input-disable');
    }
}
//==============================
//切換隱藏/顯示DOM元件
//==============================
function SwitchHideDisplay(hideObj, displayObj) {
    if (hideObj != null) {
        $.each(hideObj, function (index, item) {
            if ($(item)[0].tagName === 'SELECT') {
                $(item).parents('div.bootstrap-select').hide();
                return;
            }
            $(item).hide();
        });
    }
    if (displayObj != null) {
        $.each(displayObj, function (index, item) {
            if ($(item)[0].tagName === 'SELECT') {
                $(item).parents('div.bootstrap-select').show();
                return;
            }
            $(item).show();
        });
    }
}
//==============================
// 必填新增
//==============================
//function AppendRequired(appendObj) {
//    $.each(appendObj, function (index, item) {
//        if (!$(item).find('.required-icon').length > 0) {
//            $(item).append(_requiredIcon);
//        }
//    });
//}
//==============================
// 必填移除
//==============================
function RemoveRequired(appendObj) {
    $.each(appendObj, function (index, item) {
        $(item).find('b.required-icon').remove();
    })
}

//==============================
// 重新計數表格
//==============================
function RenumberingDetail(renumberingObj, sernoClass) {
    $.each(renumberingObj, function (index, item) {
        $(item).find('.' + sernoClass).text(index + 1);
    });
}

//==============================
// Remodal Alert&Confirm
//==============================
function alertopen(text) {
    $('#alertOK').unbind();
    if (typeof (text) != typeof ([])) {
        $('#alertText').text(text);
        $('[data-remodal-id=alert-modal]').remodal().open();
    }
    else {
        if (_alerttext.length < 1) {
            return;
        }
        $('#alertText').text(_alerttext[0]);
        if (_alerttext.length > 0) {
            _alerttext = _alerttext.slice(1, _alerttext.length);
        }
        $('[data-remodal-id=alert-modal]').remodal().open();
        $('#alertOK').on('click', alertopen);
    }
}

function fun_popPOitemListSearch(target) {
    if ($("#popPOitemList").remodal().state == "opened") {
        $("#popPOitemList").remodal().close()
    }
    $.blockUI({ message: "搜尋中" });
    var POitemListSearchBox = $("#inp_POitemListSearchBox").val().trim();
    var VendorName = $("#inp_VendorNameSearchBox").val().trim();
    $("#div_POitemMsg").show();
    $("#div_POitemNoMatch").hide();
    $.ajax({
        type: 'POST',
        url: '/PRD/POitemListGet',
        data: { SID: "temp", SName: POitemListSearchBox, VendorName: VendorName },
        success: function (data) {
            if (data.length > 0) {
                for (var j = 0; j < data.length; j++) {
                    Itemlist[j] = [data[j].YCDetailID, data[j].Supplier, data[j].CategoryName, data[j].ItemDescription, data[j].Unit, data[j].ContractPrice, data[j].BpaNum,
                     data[j].ContractPeriod, data[j].PurchaseEmpName, data[j].InvoiceEmpName, , data[j].CurrencyCode, data[j].CurrencyName, data[j].ContactPerson, data[j].GreenCategory
                     , data[j].ExchangeRate, data[j].ForeignPrice, data[j].Price, data[j].UnitPrice, data[j].PurchaseEmpNum, data[j].InvoiceEmpNum, data[j].CID]
                }
            }

            i = 0;
            //searchList = new Array();
            k = 0
            if (data.length > 0) {
                $("#div_POitemListSearchedbody").find("ul").html("");

                $(data).each(function (index, element) {
                    if (element.YCDetailID != 0) {
                        $("#div_POitemListSearchedbody").find("ul").append(
                       '<li>\
                        <label class="w100 label-box">\
                        <div class="table-box w5"><input type="radio" name ="POitemArray"></div>\
                         <div  name="YCDetailID"  style="display:none" >' + element.YCDetailID + '</div>\
                        <div class="table-box w10">' + element.Supplier + '</div>\
                        <div class="table-box w12">' + element.CategoryName + '</div>\
                        <div   name="itemName" class="table-box w13">'+ element.ItemDescription + '</div>\
                        <div class="table-box w5">' + element.Unit + '</div>\
                        <div class="table-box w10">' + fun_accountingformatNumberdelzero(element.UnitPrice) + '</div>\
                        <div class="table-box w12">' + element.BpaNum + '</div>\
                        <div class="table-box w18">' + element.ContractPeriod + '</div>\
                        <div class="table-box w10">' + element.PurchaseEmpName + '(' + element.PurchaseEmpNum + ')</div>\
                        <div  name="CID"  style="display:none" >' + element.CID + '</div>\
                        </label>\
                    </li>\
                ');
                    }
                    else {
                        $("#div_POitemListSearchedbody").find("ul").append(
                            '<li title="協議採購項已超出剩餘合約金額">\
                         <label class="w100 label-box">\
                        <div class="table-box w5"><input type="radio" name ="POitemArray" class="input-disable" disabled></div>\
                         <div  name="YCDetailID"  style="display:none" >' + element.YCDetailID + '</div>\
                        <div class="table-box w10">' + element.Supplier + '</div>\
                        <div class="table-box w12">' + element.CategoryName + '</div>\
                        <div   name="itemName" class="table-box w13">'+ element.ItemDescription + '</div>\
                        <div class="table-box w5">' + element.Unit + '</div>\
                        <div class="table-box w10">' + fun_accountingformatNumberdelzero(element.UnitPrice) + '</div>\
                        <div class="table-box w12">' + element.BpaNum + '</div>\
                        <div class="table-box w18">' + element.ContractPeriod + '</div>\
                        <div class="table-box w10">' + element.PurchaseEmpName + '(' + element.PurchaseEmpNum + ')</div>\
                        <div  name="CID"  style="display:none" >' + element.CID + '</div>\
                        </label>\
                    </li>\
                ');
                    }
                })

                $("#div_POitemMsg").hide();
                $("#div_POitemNoMatch").hide();
                $("#div_POitemListSearchedList").show();
            }
            else {
                $("#div_POitemMsg").hide();
                $("#div_POitemListSearchedList").hide();
                $("#div_POitemNoMatch").show();
            }
            if ($("#popPOitemList").remodal().state == "opening") {
                $("#popPOitemList").remodal().close()
            }
            //  $.unblockUI();
            POitemListSearchBox = "";
        }
    }).always(function () {
        setTimeout(function () {
            $.unblockUI();
            $("#popPOitemList").remodal().open()//避免ajax太快回覆，會導致remodal未關閉就開啟
        }, 500)
    });
    $("#popPOitemList").find("#inp_VendorNameSearchBox").val("")
}

//品名--動態Ｎ定回填的欄位
function fun_popPOitemList_Send(target, trPrDevTable) {
    $("[Errmsg=Y]").remove();
    $("#div_POitemListSearchedList").hide();
    var Amount = $(target).closest('tbody').find('tr').find('td[name="QuantityPurchase"]').find('b.description').text();
    POitemList = $("#popPOitemList");
    var template = $(target).closest("tbody");
    PRInfoIndex = $(template).find('td.DetailSerno').text();
    $("#popPOitemList").find("#inp_VendorNameSearchBox").val("")
    $(POitemList).find(".remodal-confirm-btn").click(function () {
        POitemListSearchBox = "";
    })

    $(POitemList).find(".remodal-confirm-btn").unbind("click");
    $(POitemList).find(".remodal-confirm-btn").click(
        function () {
            if ($(POitemList).find("input[type=radio]:checked").length > 0) {
                Amount = 0;
                context = $(POitemList).find("input[type=radio]:checked").closest("label").children("[name=itemName]").text();
                YCDetailID = $(POitemList).find("input[type=radio]:checked").closest("label").children("[name=YCDetailID]").text().toString();
                CID = $(POitemList).find("input[type=radio]:checked").closest("label").children("[name=CID]").text().toString();
                var ValSet = $(target).closest("tbody").find('td.DetailSerno').filter(function () {
                    return $(this).text() == PRInfoIndex
                });

                //  fun_ClassReset(ValSet.nextAll("[name=POItem]").children("b"));

                ValSet.nextAll("[name=POItem]").children("b").removeClass().addClass("Classification").text(context);  //nextAll( expr ) 找出排在該元素後方的所有同層元素，支援Selector語法篩選
                ValSet.nextAll("[name=POItem]").children("[name=hidYCDetailID]").val(YCDetailID);  //
                ValSet.nextAll("[name=POItem]").children("[name=CID]").val(CID);  //

                var DetSet = ValSet.closest("tr").nextAll("[name=trSupplier]");
                var DetPri = ValSet.closest("tr").nextAll("[name=trPrice]");

                i = 0;
                $(Itemlist).each(function () {
                    if ($(this)[0].toString().indexOf(YCDetailID) >= 0) {
                        ValSet.nextAll("[name=Price]").text(fun_accountingformatNumberdelzero(Itemlist[i][18] * Itemlist[i][15]));//台幣最高報價
                        ValSet.nextAll("[name=CategoryName]").find("b").text(Itemlist[i][2]).removeClass().addClass("ItemName");//年度議價協議.text();
                        ValSet.nextAll("[name=Unit]").text(Itemlist[i][4]);
                        ValSet.nextAll("[name=subAmount]").children("b").removeClass().text("系統自動帶入");
                        ValSet.nextAll("[name=QuantityPurchase]").text("系統自動帶入");
                        DetSet.find("[name=Supplier]").text(Itemlist[i][1]);
                        DetSet.find("[name=ContactPerson]").text(Itemlist[i][13] == null ? "" : Itemlist[i][12]);
                        DetPri.find("[name=GreenCategory]").text(Itemlist[i][14] == "GREEN" ? "綠色採購" : "其它");
                        DetSet.find("[name=CurrencyCode]").text(Itemlist[i][12]);//幣別
                        DetSet.find("[name=BpaNum]").find("b").text(Itemlist[i][6]).removeClass().addClass("BargainingAgreement");//年度議價協議
                        setDetailDefaultSelect(DetPri.find("[name=PurchaseEmpName]").find("select[name=PurchaseEmpNum]"), Itemlist[i][19]);
                        DetSet.find("[name=ForeignPrice]").text(fun_accountingformatNumberdelzero(Itemlist[i][18]));//原幣最高報價
                        ValSet.find("[name=hidPrice]").val(Itemlist[i][17]);
                        DetSet.find("[name=ExchangeRate]").text(fun_accountingformatNumberdelzero(Itemlist[i][15]));
                        DetPri.find("[name=InvoiceEmpName]").text(Itemlist[i][9] + "(" + Itemlist[i][20] + ")");
                    }

                    i++
                })
                $(trPrDevTable).find('tr').each(function () {
                    var PRDeveryID = $(this).find('input[name="hidPRDeliveryID"]').val();;
                    if (Amount == 0) {
                        if (PRDeveryID == "") {
                            $(this).remove();
                        }
                    }
                })

                //if (ValSet.parents("tbody").find(".glyphicon-chevron-down").length >0) {
                //    ValSet.parents("tbody").find(".glyphicon-chevron-down").trigger("click");
                //}
            }
            else {
                var ValSet = $(target).closest("tbody").find('td.DetailSerno').filter(function () {
                    return $(this).text() == PRInfoIndex
                });
                ValSet.nextAll("[name=CategoryName]").children("b").text("系統自動帶入");
                ValSet.nextAll("[name=Unit]").children("b").text("系統自動帶入");
                ValSet.nextAll("[name=CurrencyCode]").children("b").text("系統自動帶入");
                ValSet.nextAll("[name=ExchangeRate]").children("b").text("系統自動帶入");
                DetSet.find("[name=ContactPerson]").children("b").text("系統自動帶入");
                DetSet.find("[name=GreenCategory]").children("b").text("系統自動帶入");
                DetSet.find("[name=BpaNum]").children("b").text("系統自動帶入");
                DetSet.find("[name=PurchaseEmpName]").children("b").text("系統自動帶入");
                DetSet.find("[name=ForeignPrice]").children("b").text("系統自動帶入");
                DetPri.find("[name=Price]").children("b").text("系統自動帶入");
                DetPri.find("[name=hidPrice]").val("系統自動帶入");
                DetSet.find("[name=Price]").children("b").text("系統自動帶入");
                DetSet.find("[name=hidPrice]").val("系統自動帶入");
                DetPri.find("[name=InvoiceEmpName]").children("b").text("系統自動帶入");
            }
            CalculationAmount();
        }

    )
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
        var aa = combStr.trim()
    }
    $(target).attr("class", combStr.trim());
}

function fun_SelectReset(target, value) {
    $.when(PurchaseEmpListSet).always(
           function () {
               $(target).find("select[name=PurchaseEmpNum]").val(value).prop("disabled", false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker("refresh")
           })
}

//------pop	開窗控制--------
//數量輸入檢查
function fun_pcsOnblur(target) {
    num = accounting.unformat($(target).val());
    if (num.length == 0) return false;

    var UomCode = $(target).closest('table').children('thead').children('tr').find("[name=hidUomCode]").val();
    if (UomCode == "AMT") {
        if (!regNum($(target).val(), true)) {
            $(target).val("");
        }
    }
    else if (regNum($(target).val())) {
        var UniPri = accounting.unformat($(target).parents("table").find('thead').find('th').find('input[name=hidTwdPrice]').val());
        var DAm = num * accounting.unformat(UniPri);
        DAm = fun_accountingformatNumberdelzero(DAm);
        $(target).parent("td").next("[name=DevAmount]").find('b').text(fun_accountingformatNumberdelzero(DAm.toString()));
        $(target).val(fun_accountingformatNumberdelzero(num));
    }
    else {
        //  fun_AddErrMesg(target, "pcsErr", "數量輸入不正確")
        $(target).val("");
    }
}

function fun_pcsOnfoucs(target) {
    $("[alt = pcsErr]").remove()
    num = $(target).val();
    if (num.length == 0) return false;
    $(target).val(accounting.unformat($(target).val()));
    $(target).attr('maxlength', '9')

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
        //target.setcRange(start, end);
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

//設定Select預設值
function setDetailDefaultSelect(target, value) {
    $(target).find("option[value='" + value + "']").attr("selected", "selected")
    if (HandType == "ReadOnly" || (HandType == "CheckOut" && P_CurrentStep == 2)) {
    }
    else {
        $(target).removeAttr("disabled");
    }

    $(target).selectpicker('refresh');
    $(target).change();
}

//==========================================
// 共用函數
//==========================================
function setDefaultSelect(target, value) {
    $(target).find("option[value='" + value + "']").attr("selected", "selected")
    $(target).selectpicker("refresh");
    $(target).change();
}

//暫存
function draft() {
    blockPageForJBPMSend();
    if (accounting.unformat($("#textPRamount").val()) > 99999999999) {
        $("#AlertMessage").html("報價金額合計" + $("#textPRamount").val() + "超出系統可處理範圍");
        window.location.href = "#modal-added-info-2"
        verifyDom.push('textPRamount');
        return false;
    }

    var deferred = $.Deferred();
    $.when(form_edit()).always(function () {
        deferred.resolve();
    });
    return deferred.promise();
}

//暫存時 Edit 畫面 回寫Db...
function form_edit() {
    rtn = true;
    DetailYC_JsonSet();
    $("#textPRamount").val(accounting.unformat($("#textPRamount").val()));
    if (rtn == true) {
        var PrNum = $("#PRNum").val();
        var PrData = PRDataSet(PR);
        PrData.BudgetAmount = $("#textPRamount").val();
        var url = PrNum == "" ? "/PRD/Create" : "/PRD/Edit"
        $.ajax({
            async: false,
            url: url,
            dataType: 'json',
            type: 'POST',
            data: PrData,
            success: function (data, textStatus, jqXHR) {
                if (data != null) {
                    _formInfo.formGuid = data.FormGuid;
                    _formInfo.formNum = data.FormNum;
                    _formInfo.flag = data.Flag;
                } else {
                    window.location.href = '/PRD/Edit/' + data.FormNum;
                    alert('資料更新失敗了!');
                    _formInfo.flag = false;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    }
}

//暫存時 Edit 畫面 回寫Db...
function Save() {
    var deferred = $.Deferred();
    $("#ApplyItem").val("請購主旨-" + $("input[name=Subject]").val());
    if (P_CustomFlowKey == "PRD_P1_001" && P_CurrentStep == 2 && HandType == "CheckOut") {
        _formInfo.formGuid = $("#hidPRID").val();
        _formInfo.formNum = $("#PRNum").val();
        _formInfo.flag = true;
        deferred.resolve();
        return deferred.promise();
    }
    else {
        DetailYC_JsonSet();
        $("#textPRamount").val(accounting.unformat($("#textPRamount").val()));
        var PrNum = $("#PRNum").val();
        var PrData = PRDataSet(PR);
        PrData.BudgetAmount = $("#textPRamount").val();
        var _url = PrNum == "" ? "/PRD/Create" : "/PRD/Edit"

        $.ajax({
            async: false,
            url: _url,
            dataType: 'json',
            type: 'POST',
            data: PrData,
            success: function (data, textStatus, jqXHR) {
                _formInfo.formGuid = data.FormGuid;
                _formInfo.formNum = data.FormNum;
                _formInfo.flag = true;
                $.when(CreditBudgetSave(data.FormGuid)).always(function (data) {
                    if (data.Status) {
                        deferred.resolve();
                    } else {
                        _formInfo.flag = false
                        deferred.reject();
                    }
                }
                    )
            },
            error: function (data, textStatus, jqXHR) {
                _formInfo.formGuid = data.FormGuid;
                _formInfo.formNum = data.FormNum;
                _formInfo.flag = true;
                alert("更新失敗!")
                _formInfo.flag = true;
                deferred.resolve();
            }
        });
    }
    return deferred.promise();
}

function CheckOutSave() {
    var deferred = $.Deferred();
    DetailYC_JsonSet();
    $("#textPRamount").val(accounting.unformat($("#textPRamount").val()));
    var PrNum = $("#PRNum").val();
    var PrData = PRDataSet(PR);
    PrData.BudgetAmount = $("#textPRamount").val();
    var _url = "/PRD/CheckOut"

    $.ajax({
        async: false,
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: PrData,
        success: function (data, textStatus, jqXHR) {
            _formInfo.formGuid = data.FormGuid;
            _formInfo.formNum = data.FormNum;
            _formInfo.flag = true;
            Save();
        },
        error: function (data, textStatus, jqXHR) {
            console.log(data);
            _formInfo.formGuid = data.FormGuid;
            _formInfo.formNum = data.FormNum;
            alert("更新失敗456!")
            _formInfo.flag = true;
            deferred.resolve();
        }
    });
    return deferred.promise();
}
function Verify() {
    var deferred = $.Deferred();
    if (checkFieldValid())
        deferred.resolve()
    else
        deferred.reject();
    return deferred.promise()
}

//PR 主table 設定回DataModel...
function PRDataSet(PrData) {
    PrData.Subject = $("#Subject").val();
    PrData.Description = $("#Description").val();
    PrData.PRNum = $("#PRNum").val();
    PrData.PRID = $("#hidPRID").val();
    PrData.FormID = $("#hidPRID").val();
    PrData.BudgetAmount = $("#textPRamount").val(); //long.Parse(collection["textPRamount"]);
    PrData.ProjectCategoryID = $("#SelPrjCat").val();
    PrData.ProjectID = $("#SelPrj").val();
    PrData.ProjectItemID = $("#SelPrjItem").val();
    PrData.hidYCPurDetail = $("#hidYCPurDetail").val();
    PrData.hidYCPurDetail_Log = $("#hidYCPurDetail_Log").val();
    PrData.PurReqDetailList = tmpPurReqDetailList;
    PrData.PurReqDetailList_Log = tmpPurReqDetailList;
    PrData.FillInName = $("#FillInName").val();
    PrData.FillInDepName = $("#FillInDepName").val();
    PrData.FillInEmpNum = $("#FillInEmpNum").val();
    PrData.ApplicantEmpNum = $("#ApplicantEmpNum").val();
    PrData.ApplicantName = $("#ApplicantName").val();
    PrData.ApplicantDepId = $("#ApplicantDepId").val();
    PrData.ApplicantDepName = $("#ApplicantDepName").val();
    return PrData;
}
//請購單..年度議價採購..Detail...寫入Db設定...
function DetailYC_JsonSet() {
    var ArrYCDetMain = new Array();
    var count = 0;
    $("#ENPDetailTable tbody").each(function () {   //#PROneTimeDetailTable
        var i = $(this).find('td.DetailSerno').text()
        var DetPri = $(this).find("[name=trPrice]");
        if (parseInt(i) != null && i != "") {
            var PRDetailID = $(this).find("[name=hidPRDetailID]").val();
            var YCDetailID = $(this).find("[name=hidYCDetailID]").val();//協議採購id
            var YCDetailisDel = $(this).find('[alt="PRIsDelete"]').val();
            var PrQty = $(this).find("[name=QuantityPurchase]").text().trim();
            var DvyPro = DetPri.find("[name=DeliveryPrompt]").val();
            var PurchaseEmpNum = $(this).find("select[name=PurchaseEmpNum]").val();
            var PurchaseEmpName = $(this).find("select[name=PurchaseEmpNum] option:selected").text()
            var j = 0;
            var ArrYCDetDev = new Array();
            $(this).closest("tbody").find("[name^=trPRDev]").show();
            $(this).closest("tbody").find("[name=tabDevyDet]").find("tr[name^=trDevyDet]").each(function () {
                var nObj = new Object();
                var PrDvyId = $(this).find("[name=hidPRDeliveryID]").val().trim();
                nObj.PRDeliveryID = PrDvyId == "" ? "0" : PrDvyId;

                nObj.ChargeDept = $(this).find("[name=ChargeDept]").text();
                nObj.RcvDept = $(this).find("[name=RcvDept]").text();
                isPRDeliveryValue = $(this).find("input[name=hidDeliveryIsDelete]").val() == 1 ? 1 : 0;

                nObj.isDelete = isPRDeliveryValue;
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

            if (YCDetailID != "") {
                tmpPurReqDetailList.push(
              {
                  BpaNum: null,
                  Amount: null,
                  UnitPrice: null,
                  CategoryId: null,
                  CategoryName: null,
                  ChargeDeptSet: null,
                  Confirmed: false,
                  ContactPerson: null,
                  ContractPeriod: null,
                  ContractPrice: null,
                  CreateBy: null,
                  CreateTime: "/Date(-62135596800000)/",
                  CurrencyCode: null,
                  CurrencyName: null,
                  DeleteBy: null,
                  DeleteTime: "/Date(-62135596800000)/",
                  DeliveryPrompt: null,
                  ExchangeRate: 0,
                  ForeignPrice: 0,
                  GreenCategory: 0,
                  GreenPurchaseList: null,
                  InvoiceEmpName: null,
                  InvoiceEmpNum: null,
                  IsDelete: null,
                  ItemDescription: null,
                  NegotiationPrice: 0,
                  POCategoryList: null,
                  PRDetailID: 0,
                  PRID: "00000000-0000-0000-0000-000000000000",
                  Price: 0,
                  PurOrderRecList: null,
                  PurReqDeliveryList: null,
                  PurchaseEmpList: null,
                  PurchaseEmpName: PurchaseEmpName,
                  PurchaseEmpNum: PurchaseEmpNum,
                  Quantity: 0,
                  QuoteEmpName: null,
                  QuoteEmpNum: null,
                  RcvDeptSet: null,
                  StakeHolder: false,
                  Supplier: null,
                  UomCode: null,
                  UomCodeList: null,
                  UomName: null,
                  VID: 0,
                  YCDetailID: 0
              });
            }

            $(this).closest("tbody").find("[name^=trPRDev]").hide();

            var YCObj = new Object();

            var LoginEno = $("#LoginEno").val().trim();
            var LoginName = $("#LoginName").val().trim();

            YCObj.LoginEno = LoginEno;
            YCObj.LoginName = LoginName;
            YCObj.PRDetailID = PRDetailID;
            YCObj.YCDetailID = YCDetailID;
            YCObj.PRDQuantity = accounting.unformat(PrQty);
            YCObj.isDelete = YCDetailisDel;
            YCObj.DvyPro = DvyPro;
            YCObj.DvyCont = ArrYCDetDev;
            if (YCDetailID != "") {
                ArrYCDetMain[count] = YCObj;
                count = count + 1;
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
    $("#hidYCPurDetail_Log").val(jsonText);
}

function checkFieldValid() {
    PR = getModel();

    $('div[class="error-text"]').hide();
    var verifyDom = [];
    var verifyReleaseAmount = [];
    if (accounting.unformat($("#textPRamount").val()) > 99999999999) {
        $("#AlertMessage").html("報價金額合計超出上限99,999,999,999");
        window.location.href = "#modal-added-info-2"
        verifyDom.push('textPRamount');
        return false;
    }

    if ($("#Subject").val() == "") {
        verifyDom.push('Subject');
    }

    if ($("#Description").val() == "") {
        verifyDom.push('Description');
    }
    ;//DetailJson格式判斷年度議價單號是否已超出特殊合約金額
    var alertMsg = ""
    var yErrArray = [];
    var aryisdel = [];
    $("#ENPDetailTable").find('tbody').each(function (index, element) {
        aryisdel = [];
        var tabCategoryName = $(this).find("td[name=CategoryName]").find("b.ItemName").text();
        if (tabCategoryName != null && tabCategoryName != "") {
            var IiteName = $(this).find(".ItemName").text();
            var DetailNumber = $(this).find(".DetailSerno").text();
            if (IiteName == "系統自動帶入") {
                fun_AddErrMesg($(this).find(".ItemName"), "ENPDetailTableErr", "此為必填欄位")
                verifyDom.push('ItemName');
            } else {               
                if ($(this).find("tr[name='trDevyDet']").length == 1) {
                    if ($(this).find("td[name=RcvDept]").text().length == 0) {
                        yErrArray.push("協議採購項次" + DetailNumber + "未輸入送貨單位明細");
                    } else {
                        $(this).find("tr[name='trDevyDet']").each(function (index, element) {
                            if ($(this).find("input[name=hidDeliveryIsDelete]").val() == "" || typeof ($(this).find("input[name=hidDeliveryIsDelete]").val()) == "undefined") {
                                aryisdel.push("0");
                            }
                            else {
                                aryisdel.push($(this).find("input[name=hidDeliveryIsDelete]").val());
                            }
                        })
                        if (!(aryisdel.indexOf("0") > -1)) {
                            yErrArray.push("協議採購項次" + DetailNumber + "未輸入送貨單位明細");
                        }
                    }
                }
                else {
                    $(this).find("tr[name='trDevyDet']").each(function (index, element) {
                        if ($(this).find("input[name=hidDeliveryIsDelete]").val() == "" || typeof ($(this).find("input[name=hidDeliveryIsDelete]").val()) == "undefined") {
                            aryisdel.push("0");
                        }
                        else {
                            aryisdel.push($(this).find("input[name=hidDeliveryIsDelete]").val());
                        }
                    })
                    if (!(aryisdel.indexOf("0") > -1)) {
                        yErrArray.push("協議採購項次" + DetailNumber + "未輸入送貨單位明細");
                    }
                }
            }
            var QuantityPurchase = accounting.unformat($(this).find("td[name=QuantityPurchase]").text())
            var Price = accounting.unformat($(this).find("td[name=Price]").text())
            if (QuantityPurchase > 999999999) {
                yErrArray.push("協議採購項次" + DetailNumber + "數量不得超過999,999,999");
                verifyDom.push('QuantityPurchase');
            }
            if (Price > 99999999999.9999) {
                yErrArray.push("協議採購項次" + DetailNumber + "臺幣議價單價不得超過999,999,999.9999");
                verifyDom.push('Price');
            }
        }
    });
    $.each(yErrArray, function (index, yerr) {
        alertMsg += yerr + "<br>";
    });

    if (alertMsg != "") {
        rtn = false
        $("#AlertMessage").html(alertMsg);
        window.location.href = "#modal-added-info-2"
        verifyDom.push('PRDelivery');
        return false;
    }

    DetailYC(PR);
    if (tabledetailflag == 0) {
        isReleaseAmount(PR);
    }

    $.each(verifyDom, function (index, item) {
        $('div[RequiredField="' + item + '"][class="error-text"]').show();
    });

    //if ($("[alt=ENPDetailTableErr]").length > 0) {
    //    if ($(".p-all0").find(".list-close-icon").length ==0) {
    //        $(".p-all0").trigger("click")
    //    } else {
    //        if ($(".p-all0").find(".list-close-icon").length > 1) {
    //            $(".p-all0").trigger("click")
    //            $(".p-all0").trigger("click")
    //        }
    //    }
    //}

    //if (verifyDom.length > 0) {
    //    $('html, body').animate({
    //        scrollTop: ($('div[RequiredField="' + verifyDom[0] + '"][class!="error-text"]').offset()) - 50
    //    }, 500);
    //    return false;
    //}
    //else {
    //    return true;
    //}

    if (verifyDom.length > 0) {
        $('html, body').animate({
            scrollTop: ($('.error-text').first().closest("div .row").offset().top) - 80
        }, 500);

        return false;
    }
    else {
        return true;
    }

    function isReleaseAmount(PR) {
        var alertMsg = "";
        var usedBpcNum = [];
        var usedAmount = [];
        $.ajax({
            async: false,
            url: '/PRD/IsAmountRelease',
            type: 'POST',
            data: PR,
            success: function (data, textStatus, jqXHR) {
                var yErrArray = [];
                var uniqueData = data;

                $("#ENPDetailTable").find('tbody').each(function (index, element) {
                    var PRIsDelete = $(this).find("td[name=subAmount]").find("[alt=PRIsDelete]").val();
                    if (PRIsDelete == 0) {
                        var itemNo = $(this).find(".DetailSerno").text().trim();
                        var CID = $(this).find("td[name=POItem]").find("input[name=CID]").val()
                        var Amount = accounting.unformat($(this).find("td[name=subAmount]").text());
                        if (CID != null) {
                            var value = $.grep(uniqueData, function (obj) {
                                return obj.CID == CID
                            });

                            if (usedBpcNum.indexOf(CID) == -1) {
                                usedAmount.push({ CID: CID, tmpQuoteAmount: value[0].tmpQuoteAmount - Amount })
                                usedBpcNum.push(CID);
                            }
                            else {
                                $.each(usedAmount, function (index, element) {
                                    if (element.CID == CID) {
                                        element.tmpQuoteAmount = element.tmpQuoteAmount - Amount;
                                    }
                                })
                            }

                            var tmpAmount = $.grep(usedAmount, function (obj) {
                                return obj.CID == CID
                            });
                            if (tmpAmount[0].tmpQuoteAmount < 0) {
                                yErrArray.push("協議採購編號 " + (itemNo) + " 已超出剩餘可核發金額" + tmpAmount[0].tmpQuoteAmount)
                            }
                        }
                    }
                })

                $.each(yErrArray, function (index, yerr) {
                    alertMsg += yerr + "<br>";
                });

                if (alertMsg != "") {
                    rtn = false
                    $("#AlertMessage").html(alertMsg);
                    window.location.href = "#modal-added-info-2"
                    verifyDom.push('ItemOver');
                }
            },
            error: function (data, textStatus, jqXHR) {
                alert(textStatus)
            }
        });
    }
}

//判斷採購明細是否已超出特殊合約扣除fiis回傳之核發金額
function DetailYC(PR) {
    tabledetailflag = 0;
    var deferred = $.Deferred();
    var ArrYCDetail = [];
    var PurReqDetailList = new Array;
    $("#ENPDetailTable").find('td.DetailSerno').each(function (index, element) {
        var BpaNum = $(this).closest("tbody").find("td[name=BpaNum]").find("b").text().trim();

        var Amount = accounting.unformat($(this).closest("tbody").find("td[name=QuantityPurchase]").find("b").text().trim());
        //原幣單價
        var UnitPrice = accounting.unformat($(this).closest("tbody").find("td[name=Price]").find(".Currency").text().trim());
        var ItemDescription = $(this).closest("tbody").find("td[name=POItem]").find(".Classification").text().trim();
        var PRIsDelete = $(this).closest("tbody").find("td[name=subAmount]").find("[alt=PRIsDelete]").val();
        if ((BpaNum == "系統自動帶入" && Amount == "0" && ItemDescription == "系統自動帶入") || (PRIsDelete == "1")) {
            //return false;
            tabledetailflag = -1;
        } else {
            PurReqDetailList.push(
              {
                  BpaNum: BpaNum,
                  Amount: Amount,
                  UnitPrice: UnitPrice,
                  CategoryId: null,
                  CategoryName: null,
                  ChargeDeptSet: null,
                  Confirmed: false,
                  ContactPerson: null,
                  ContractPeriod: null,
                  ContractPrice: null,
                  CreateBy: null,
                  CreateTime: "/Date(-62135596800000)/",
                  CurrencyCode: null,
                  CurrencyName: null,
                  DeleteBy: null,
                  DeleteTime: "/Date(-62135596800000)/",
                  DeliveryPrompt: null,
                  ExchangeRate: 0,
                  ForeignPrice: 0,
                  GreenCategory: 0,
                  GreenPurchaseList: null,
                  InvoiceEmpName: null,
                  InvoiceEmpNum: null,
                  IsDelete: PRIsDelete,
                  ItemDescription: ItemDescription,
                  NegotiationPrice: 0,
                  POCategoryList: null,
                  PRDetailID: 0,
                  PRID: "00000000-0000-0000-0000-000000000000",
                  Price: 0,
                  PurOrderRecList: null,
                  PurReqDeliveryList: null,
                  PurchaseEmpList: null,
                  PurchaseEmpName: null,
                  PurchaseEmpNum: null,
                  Quantity: 0,
                  QuoteEmpName: null,
                  QuoteEmpNum: null,
                  RcvDeptSet: null,
                  StakeHolder: false,
                  Supplier: null,
                  UomCode: null,
                  UomCodeList: null,
                  UomName: null,
                  VID: 0,
                  YCDetailID: 0
              });
            tabledetailflag = 0;
            PR.PurReqDetailList = PurReqDetailList;
        }
    })

    deferred.resolve();
}

function OverrideOrgPickerSetting(step) {
    /// <summary>提供cbp-SendSetting.js針對「傳送其他主管同仁」按鈕做最後OrgPicker更改機會</summary>
    /// <param name="step" type="number">目前關卡數</param>
    //  第一關傳其他只能傳送採購經辦群組， 第二關傳其他只能傳送採購覆核群組:
    var P_CustomFlowKey = $('#P_CustomFlowKey').val();  //"BPC_P1-002";
    var P_CurrentStep = $("#P_CurrentStep").val();

    if (P_CustomFlowKey.indexOf("PRD_P1") > -1 && (P_CurrentStep == 2)) {
        return {
            allowRole: ["MGR", "OMG"]//主管階
        };
    }
}

//==========================================
// 報價金額合計
//==========================================

function CalculationAmount() {
    var textPRamount = 0
    var MaxPrice = 0;
    var PrePurchase = 0;
    var SumQuantity = 0;
    var Total = 0;

    var highPrice = 0;
    $("#ENPDetailTable tbody").not("[alt=PRDvyDel]").each(function (index, element) {
        var i = $(this).find('td.DetailSerno').text();
        var highPrice = accounting.unformat($(this).find("tr").find("td[name=Price]").text());
        var Quantity = accounting.unformat($(this).find("tr").find("td[name='QuantityPurchase']").text());
        var subAmount = highPrice * Quantity
        if (subAmount == 0) {
            $(this).find("tr").find("td[name='subAmount']").find("b").text("系統自動帶入")
        }
        else {
            $(this).find("tr").find("td[name='subAmount']").find("b").text(fun_accountingformatNumberdelzero(subAmount))
        }

        var calculationFlag = $(this).find("tr").find("td[name='subAmount']").find("[alt=PRIsDelete]").val();
        subtotal = 0;
        if (i > 0 && calculationFlag == 0) {
            for (var j = 0; j < i; j++) {
                if (!isNaN(highPrice)) {
                    highPrice = parseFloat(accounting.unformat(highPrice));
                } else {
                    highPrice = 0;
                }

                if (!isNaN(Quantity) && Quantity.length != 0) {
                    Quantity = parseFloat(accounting.unformat(Quantity));
                } else {
                    Quantity = 0;
                }
            }
            subtotal = highPrice * Quantity;
        }
        PrePurchase += subtotal;
    });

    Total += PrePurchase;

    $("#textPRamount").val(fun_accountingformatNumberdelzero(parseInt(Total)));
    $("#txtBudgetAmount").text(fun_accountingformatNumberdelzero($("#textPRamount").val()))
}

function ReadOnly() {
    $("#DeleteThisPRDetail").each(function () {
        $(this).hide();
    })
    if (!(String(P_CustomFlowKey).indexOf("PRD_P1") > -1 && String(P_CurrentStep).indexOf("1") > -1) && HandType == "CheckOut") {
        $("#AppendENPDetail").remove();
        $(".icon-remove-size").remove();
    }
    if ($("#P_Status").val() != 2) {
        $("#ViewPRDetialBtn").removeAttr("onclick").addClass("input-disable").prop("disabled", true)
    }

    $("#Subject").prop("readonly", true);
    $("#Description").prop("readonly", true);
    $("#SelPrjCat").prop('disabled', true).addClass('input-disable')
    $("#SelPrj").prop('disabled', true).addClass('input-disable')
    $("#SelPrjItem").prop('disabled', true).addClass('input-disable')
    $("#textPRamount").prop("readonly", true);
    $('#ENPDetailTable tr').each(function (index, element) {
        $("input,textarea").prop("readonly", true);
    });
    $('#ENPDetailTable tbody').each(function (index, element) {
        disFieldControl($(this).find("input[name=DeliveryPrompt]"), null, $(this).find("input[name=DeliveryPrompt]").val());
        disFieldControl($(this).find("select[name=PurchaseEmpNum]"), $(this).find("select[name=PurchaseEmpNum] option:selected").text(), $(this).find("select[name=PurchaseEmpNum]").val())
        $(this).find("tr.ENPDetail").find("td[name=PurchaseEmpName]").find("div").text($(this).find("tr.ENPDetail").find("td[name=PurchaseEmpName]").find("div").text() + "(" + $(this).find("input[name=PurchaseEmpNum]").val() + ")");
    });
    $('#ENPDetailTable tbody').each(function (index, element) {
        $(this).prev("thead").find('th').eq(1).remove();
        $(this).prev("thead").find('th').eq(2).attr("colspan", 2);
        if ($(this).find("tr").attr("name") != "trDevyDet") {
            $(this).find('td').eq(1).remove();
            $(this).find('td').eq(2).attr("colspan", 2);
        }

        $(this).find('.Rate').text(parseFloat(accounting.unformat($(this).find('.Rate').text())));

        if (!isNaN(accounting.unformat($(this).find('.Currency').text()))) {
            $(this).find('.Currency').text(fun_accountingformatNumberdelzero(parseFloat(accounting.unformat($(this).find('.Currency').text().trim()))));
        }
        $(this).find('.description').text(fun_accountingformatNumberdelzero(parseFloat(accounting.unformat($(this).find('.description').text()))));
        $(this).find('.HightPrice').text(fun_accountingformatNumberdelzero(parseFloat(accounting.unformat($(this).find('.HightPrice').text()))));
    });

    $('#PRDetailCloneTemplate_Temp tr').each(function (index, element) {
        $("#ReviceUnit_Temp").prop('disabled', true).addClass('input-disable')
        $("#AccountUnit_Temp").prop('disabled', true).addClass('input-disable')
    });

    $(".commentTyping").prop("readonly", false)
}

function EditFieldControl() {
    $("#txtSubject").remove();
    $("#txtDescription").remove();
    $("#Subject").removeAttr("style");
    $("#Description").removeAttr("style");

    $("#ENPDetailTable tbody").each(function () {
        $(this).find("select[name=PurchaseEmpNum]").selectpicker();
        $(this).find('.Rate').text(parseFloat($(this).find('.Rate').text()));
        if (!isNaN($(this).find('.Currency').text())) {
            $(this).find('.Currency').text(fun_accountingformatNumberdelzero(parseFloat($(this).find('.Currency').text())));
        }

        $(this).find('.description').text(fun_accountingformatNumberdelzero(parseFloat($(this).find('.description').text())));
        $(this).find('.HightPrice').text(fun_accountingformatNumberdelzero(parseFloat($(this).find('.HightPrice').text())));
    })
}

//採購明細
function fun_showPRDetial(PrdID) {
    $.ajax({
        url: "/PR/Get_PoOrYainfoByPRDetailID/" + PrdID,   //存取Json的網址
        type: "POST",
        cache: false,
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data.length > 0) {
                $("#PR_POInfo").find("tbody[no-data]").hide()
                templateTbody = $("#PR_POInfo").find("tbody[template]").eq(0);
                $("#PR_POInfo").find("tbody").not("[no-data]").not("[template]").remove();
                templateRTtitle = templateTbody.find("tr[RTtitle]").eq(0).clone()
                templateDeltitle = templateTbody.find("tr[Deltitle]").eq(0).clone()
                templateDelrow = templateTbody.find("tr[Delrow]").eq(0).clone()
                templateDelreasonTitle = templateTbody.find("tr[DelreasonTitle]").eq(0).clone()
                templateDelreason = templateTbody.find("tr[Delreason]").eq(0).clone()
                templateRtRow = templateTbody.find("tr[RTrow]").eq(0).clone()
                RTInfoList = []
                DelInfoList = []

                $.each(data, function (index, obj) {
                    tbody = templateTbody.clone()
                    $(tbody).removeAttr("template")
                    $(tbody).find("tr[RTtitle]").remove()
                    $(tbody).find("tr[Deltitle]").remove()
                    $(tbody).find("tr[RTrow]").remove()
                    $(tbody).find("tr[Delrow]").remove()

                    RowtitleTd = $(tbody).find("tr[Rowtitle] td")
                    $(RowtitleTd).eq(0).text(obj.Num)
                    $(RowtitleTd).eq(1).text(fun_accountingformatNumberdelzero(obj.Quantity))
                    $(RowtitleTd).eq(2).text(fun_accountingformatNumberdelzero(obj.UnitPrice))
                    $(RowtitleTd).eq(3).text(obj.CurrencyName + "(" + obj.CurrencyCode + ")")
                    if (obj.RTInfoList) {
                        RTInfoList = $.grep(obj.RTInfoList, function (info) {
                            return (info.ReceiptNum != null)
                        })
                    }

                    if (obj.DelInfoList) {
                        DelInfoList = obj.DelInfoList
                    }

                    if (RTInfoList.length > 0) {
                        $(RowtitleTd).eq(4).find("div").on("click", function () {
                            let tbody = $(this).closest("tbody")
                            $(tbody).find("tr[RTtitle]").toggle(200);
                            $(tbody).find("tr[RTrow]").toggle(200);

                            $(tbody).find("tr[Deltitle]").hide()
                            $(tbody).find("tr[Delrow]").hide()
                            $(tbody).find("tr[delreasontitle]").hide()
                            $(tbody).find("tr[delreason]").hide()
                        })

                        $(tbody).append(templateRTtitle)
                        $.each(RTInfoList, function (x, rtinfo) {
                            rtRow = templateRtRow.clone()
                            rtRow.find("td").eq(1).text(rtinfo.ReceiptNum)
                            rtRow.find("td").eq(2).text(fun_accountingformatNumberdelzero(rtinfo.Quantity))
                            $(tbody).append(rtRow)
                        })
                    }
                    else {
                        $(RowtitleTd).eq(4).html("<span class=\"no-file-text\">目前無明細</span>")
                    }

                    if (DelInfoList.length > 0) {
                        $(RowtitleTd).eq(5).find("div").on("click", function () {
                            let tbody = $(this).closest("tbody")
                            $(tbody).find("tr[RTtitle]").hide()
                            $(tbody).find("tr[RTrow]").hide()

                            $(tbody).find("tr[Deltitle]").toggle(200);
                            $(tbody).find("tr[Delrow]").toggle(200);
                            $(tbody).find("div.toggleArrow").toggleClass("glyphicon-chevron-up", false)
                            $(tbody).find("div.toggleArrow").toggleClass("glyphicon-chevron-down", true)
                            $(tbody).find("tr[delreasontitle]").hide(200);
                            $(tbody).find("tr[delreason]").hide(200);
                        })

                        $(tbody).append(templateDeltitle)
                        $.each(DelInfoList, function (x, delinfo) {
                            delRow = templateDelrow.clone()
                            delRow.find("td").eq(0).text(delinfo.ChargeDeptName)
                            delRow.find("td").eq(1).text(delinfo.RcvDeptName)
                            delRow.find("td").eq(2).text(delinfo.CancelEmpName + "(" + delinfo.CancelBy + ")")
                            delRow.find("td").eq(3).text(delinfo.strCancelDate)
                            delRow.find("td").eq(4).text(delinfo.Quantity)
                            delRow.find("td").eq(5).find("span").text(delinfo.UnitPrice)

                            DelreasonTitle = templateDelreasonTitle.clone()
                            Delreason = templateDelreason.clone()
                            $(Delreason).find(".disable-text").html(delinfo.CancelReason.replace("\r\n", "<br>"))
                            $(tbody).append(delRow)
                            $(tbody).append(DelreasonTitle)
                            $(tbody).append(Delreason)

                            $(delRow).find("div.btn-01-add").on("click", function () {
                                let delTr = $(this).closest("tr")
                                $(delTr).find("div.toggleArrow").eq(0).toggleClass("glyphicon-chevron-up")
                                $(delTr).find("div.toggleArrow").eq(0).toggleClass("glyphicon-chevron-down")
                                $(delTr).next("tr[delreasontitle]").eq(0).toggle(200)
                                $(delTr).nextAll("tr[delreason]").eq(0).toggle(200)
                            })
                        })
                    }
                    else {
                        $(RowtitleTd).eq(5).html("<span class=\"no-file-text\">目前無明細</span>")
                    }

                    $(tbody).show()
                    $("#PR_POInfo").append(tbody)
                })
            }
            else {
                $("#PR_POInfo").find("tbody").hide()
                $("#PR_POInfo").find("tbody[no-data]").show()
            }
        },
        error: function (err) {
            alert("取得請購明細失敗")
        }
    })

    $.ajax({
        url: "/PR/GetPRCancelDataByPRDetailID/" + PrdID,   //存取Json的網址
        type: "POST",
        cache: false,
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data.length > 0) {
                $("#PR_CancelInfo").find("tbody[no-data]").hide()
                templateTbody = $("#PR_CancelInfo").find("tbody[template]").eq(0);
                $("#PR_CancelInfo").find("tbody").not("[no-data]").not("[template]").remove();

                $.each(data, function (index, obj) {
                    tbody = templateTbody.clone()
                    $(tbody).removeAttr("template")
                    $(tbody).find("tr").eq(0).find("td").eq(0).text(obj.ChargeDeptName)
                    $(tbody).find("tr").eq(0).find("td").eq(1).text(obj.RcvDeptName)
                    $(tbody).find("tr").eq(0).find("td").eq(2).text(obj.CancelEmpName + "(" + obj.CancelBy + ")")
                    $(tbody).find("tr").eq(0).find("td").eq(3).text(obj.strCancelDate)
                    $(tbody).find("tr").eq(0).find("td").eq(4).text(fun_accountingformatNumberdelzero(obj.Quantity))
                    $(tbody).find("tr").eq(1).find("div").html(obj.CancelReason.replace("\r\n", "<br>"))
                    $(tbody).find("a").on("click", function (e) {
                        $(this).children("div").toggleClass("glyphicon  glyphicon-chevron-down toggleArrow")
                        $(this).children("div").toggleClass("glyphicon  tglyphicon togglyphicon toggleArrow glyphicon-chevron-up")
                        $(this).closest("tbody").find("tr").eq(1).toggle(200)
                    })
                    $(tbody).show()
                    $("#PR_CancelInfo").append(tbody)
                })
            }
            else {
                $("#PR_CancelInfo").find("tbody").hide()
                $("#PR_CancelInfo").find("tbody[no-data]").show()
            }
        },
        error: function (err) {
            alert("取得作廢紀錄失敗")
        }
    })

    $("#ViewPRDetial").remodal().open()
}

//採購明細
function fun_accountingformatNumberdelzero(val) {
    val = accounting.formatNumber(val, 4)
    reg = /\.[0-9]*0$/
    while (reg.test(val)) {
        val = val.replace(/0$/, '');
    }
    val = val.replace(/\.$/, '');
    return val;
}

function disFieldControl(target, context, value) {
    if ($(target)[0] != null) {
        tagName = $(target)[0].tagName
        targetName = $(target).attr("name");
        inTable = $(target).parents('table').length > 0 ? true : false;
        if (inTable) {
            switch (tagName) {
                case "SELECT":
                    $(target).after("<div>" + context + "</div>");
                    $(target).after("<input type='text' name= " + targetName + " value ='" + value + "' style='display:none' />");
                    $(target).remove();
                    break;
                case "INPUT":
                    $(target).after("<input type='text' name= " + targetName + " value =' " + value + "' style='display:none' />");
                    $(target).after("<div >" + value + "</div>");
                    $(target).remove();
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

                    if (targetName == "DevQuantity") {
                        if (isNaN(accounting.unformat(value))) {
                            value = 0;
                        }
                        $(target).after("<div class='undone-text'>" + value + "</div>");
                    } else {
                        $(target).after("<div >" + value + "</div>");
                    }
                    $(target).after("<input type='text' name= " + targetName + " value = " + value + " style='display:none' />");
                    $(target).remove();
                    break;
                default:
            }
        }
    }
}

$(function () {
    $.fn.extend({
        //設定select 控制器 target:select 控制器,動作,值(text,value)
        setSelectOption: function (target, action, valueList) {
            if (action == "set") {
                $(target).children().remove();

                $(valueList).each(function () {
                    $(target).append($("<option></option>").attr("value", $(this)[1]).text($(this)[0]));
                })
            }
            $(target).selectpicker('refresh');//selectpicker 不更新顯示不會改變
        }
    });
})