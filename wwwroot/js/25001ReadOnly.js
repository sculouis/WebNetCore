$(function () {
    InitialSet();
});

function InitialSet() {
    ReadOnlySet();
}

function ReadOnlySet() {
    // $('#divEcryptionAlertMessage').hide()
    $('#textDecryptDate').prop("readonly", true);
    $('#textDecryptDate').addClass('input-disable');
    $('#spanCalendar').addClass('input-disable');

    var amount = $("#textPRamount").val();

    amount = fun_accountingformatNumberdelzero(amount)
    $("#textPRamount").attr("maxlength", amount.length)
    $("#textPRamount").val(amount);

    $('#textPRTitle').prop("readonly", true);
    $('#textareaPRExplanation').prop("readonly", true);

    $('#chkConfidential').prop("disabled", true);

    $('#chk3Citem').prop("disabled", true);
    $('#chkConsultant').prop("disabled", true);
    $('#chkContract').prop("disabled", true);
    $('#chkCore').prop("disabled", true);
    $('#SelPrjCat').prop("disabled", true);
    $('#SelPrj').prop("disabled", true);
    $('#SelPrjItem').prop("disabled", true);
    $('#checkHaveQuotation').prop("disabled", true);

    //$('#textPRamount').prop("readonly", true);

    $("input[name=supplier]").prop("disabled", true);

    var amount = fun_accountingformatNumberdelzero($("#divBudgetAmount").text());

    $("#divBudgetAmount").text(amount);
}

function HtmlInitalSet() {
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
    $("#chkConfidential").click(function () {
        if ($(this).prop("checked")) {
            $('#divEcryptionAlertMessage').show()
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

    ////POP 報價單動作

    function fun_onfocusAction(target) {
        $(target).val(accounting.unformat($(target).val()));
        $(target).next("[Errmsg=Y]").remove();
        SelectionRange(target, $(target).val().length, $(target).val().length)
    }

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

    //報價單動作

    $("#linkCreatQOInfo").on("click", function () {
        if ($("[name='chkQuote']:checked").length > 0) {
            QoItem = "";
            $("[name='chkQuote']:checked").each(function () {
                QoItem += ";" + $(this).val()
            })
            $("#QoItem").val(QoItem)
            $(document).on('click', '#linkCreatQOInfo', function () {
                $('[data-remodal-id=modal-QO]').remodal().open();
            });
            //$("#formCreatQoInfo").submit();
        }
        else {
            alert("請先勾選報價品項")
        }
    })

    $("[name='chkQo']").on("click", function () {
        highesthNTD = 0;
        if ($(this).prop("checked") == true) {
            $(this).closest("tr").next("tr[alt=QuotationInfoDetial]").find("tr[alt=ItemQoInfo]").each(function () {
                if ($(this).find("input[type='radio']:checked").val() == "true" && accounting.unformat($(this).find("[alt='ItemNTD']").text()) > highesthNTD) {
                    highesthNTD = accounting.unformat($(this).find("[alt='ItemNTD']").text());
                }
            })
            if (highesthNTD == 0) {
                alert("查無有效報價")
                $(this).prop("checked", false)
            }
            else {
                $(this).closest("tr").find("[alt='highestNTD']").text(fun_accountingformatNumberdelzero(highesthNTD));
                $(this).closest("tr").next("tr[alt=QuotationInfoDetial]").find("tr[alt=ItemQoInfo]").each(function () {
                    $(this).find("input[type='radio']").attr("disabled", "disabled")
                })
            }
        }
        else {
            $(this).closest("tr").find("[alt='highestNTD']").text("");
            $(this).closest("tr").next("tr[alt=QuotationInfoDetial]").find("tr[alt=ItemQoInfo]").each(function () {
                $(this).find("input[type='radio']").removeAttr("disabled")
            })
        }
    })

    //報價單動作

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

    //PrInfo 請購明細動作
    $("[alt='PRInfoTable']").on("change", "[alt=sel_PRInfoUnit]", function () {
        if ($(this).val() == 0) {
            $(this).closest("td").prev("[alt=td_PRInfoUnitpcs]").children("span").show()
            $(this).closest("td").prev("[alt=td_PRInfoUnitpcs]").children("input").hide()
        }
        else {
            $(this).closest("td").prev("[alt=td_PRInfoUnitpcs]").children("span").hide()
            $(this).closest("td").prev("[alt=td_PRInfoUnitpcs]").children("input").show()
        }
    })

    $("[alt='PRInfoTable']").on("click", "[alt=linkpopAddPerson]", function () {
        fun_popAddPerson_Send($(this))
        //alert($(this));
    })

    $("[alt='PRInfoTable']").on("click", "[alt=linkpopPOitemList]", function () {
        fun_popPOitemList_Send($(this))
    })

    ////PrInfo 請購明細動作
}  //function HtmlInitalSet() {....end

//pop 供應商查詢
function fun_popSuppliesSearch() {
    /////
    //list = new Array(3)
    //list[0] = ["103823", "XX股份有限公司", "A123456789"];
    //list[1] = ["103824", "OO實業", ""];
    //list[2] = ["103825", "YY股份有限公司", ""];
    /////

    SuppliesID = $("#inpSuppliesID_SearchBox").val();
    SuppliesName = $("#inpSuppliesName_SearchBox").val();
    SuppliesNumber = $("#inpSuppliesNumber_SearchBox").val();

    var list = new Array()

    if (SuppliesID.length == 0 && SuppliesName.length == 0 && SuppliesNumber.length == 0) {
        alert("請至少輸入一個查詢條件")
        return false;
    }
    else {
        $.ajax({
            type: 'POST',
            url: '/PR/SuppliesListGet',
            data: { SID: SuppliesID, SName: SuppliesName, SNumber: SuppliesNumber },
            success: function (data) {
                if (data.length > 0) {
                    for (var j = 0 ; j < data.length; j++) {
                        list[j] = [data[j].SuppliesID, data[j].SuppliesName, data[j].SuppliesIdNumber, data[j].RatingDate, data[j].CommitmentDate];
                    }
                }

                i = 0;
                searchList = new Array()

                $(list).each(function () {
                    rtn = true;

                    if (SuppliesID.length > 0) {
                        if ($(this)[0].indexOf(SuppliesID) < 0) rtn = false
                    }
                    if (SuppliesName.length > 0) {
                        if ($(this)[1].indexOf(SuppliesName) < 0) rtn = false
                    }
                    if (SuppliesNumber.length > 0) {
                        if ($(this)[2].indexOf(SuppliesNumber) < 0) rtn = false
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
    if (regNum(amount, false)) {
        //var LevelList = new Array();
        for (var j = 0; j <= LevelList.length - 1; j++) {
            if (LevelList[j].PriceKind == "0") {
                if (amount >= parseFloat(LevelList[j].MinAmount) && amount < parseFloat(LevelList[j].MaxAmount)) {
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
                    if (amount >= parseFloat(LevelList[j].MinAmount) && amount < parseFloat(LevelList[j].MaxAmount)) {
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
                    if (amount >= parseFloat(LevelList[j].MinAmount) && amount < parseFloat(LevelList[j].MaxAmount)) {
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

//Html.Initial...Function... 設定.....begin....

//報價單回寫
function fun_QoAdd(PRitemID, QOID, Supplies, SuppliesLocation, SuppliesContacter, Currency, price) {
    if ($("#QuotationInfoTable").find("tr[PRitemID='" + PRitemID + "']").length > 0) {
        rate = 1;
        tmpDate = new Date();
        Month = (tmpDate.getMonth() + 1 > 9) ? (tmpDate.getMonth() + 1) : "0" + (tmpDate.getMonth() + 1)
        Day = (tmpDate.getDate() + 1 > 9) ? (tmpDate.getDate() + 1) : "0" + (tmpDate.getDate() + 1)
        Hours = (tmpDate.getHours() > 9) ? (tmpDate.getHours()) : "0" + (tmpDate.getHours())
        Minutes = (tmpDate.getMinutes() > 9) ? (tmpDate.getMinutes()) : "0" + (tmpDate.getMinutes())
        Now = tmpDate.getFullYear() + "/" + Month + "/" + Day + " " + Hours + ":" + Minutes

        html = " <tr alt=\"ItemQoInfo\">"
        html += "<td  ><span  class=\"note-text-s\" style=\"color:#2eaf92\">" + QOID + "</span></td>"
        html += "<td  ><span  class=\"note-text-s\" style=\"color:#2eaf92\">" + Supplies + "</span></td>"
        html += "<td  ><span  class=\"note-text-s\" style=\"color:#2eaf92\">" + SuppliesLocation + "</span></td>"
        html += "<td ><span  class=\"note-text-s\" style=\"color:#2eaf92\">" + SuppliesContacter + "</span></td>"
        html += "<td  ><span  class=\"note-text-s\" style=\"color:#2eaf92\">" + Currency + "</span></td>"
        html += "<td ><span  class=\"note-text-s\" style=\"color:#2eaf92\">" + rate + "</span></td>"
        html += "<td  ><span  class=\"note-text-s\" style=\"color:#2eaf92\">" + price + "</span></td>"
        html += "<td alt=\"ItemNTD\" ><span  class=\"note-text-s\" style=\"color:#2eaf92\">" + accounting.format(accounting.toFixed(rate * price, 4)) + "</span></td>"
        html += "<td ><span  class=\"note-text-s\" style=\"color:#2eaf92\">" + Now + "</span></td>"
        html += "<td  >"
        html += "<div class=\"cell\" ><label><input checked name=\"radio_" + PRitemID + QOID + "\" type=\"radio\"  value=\"true\"><span  class=\" note-text-s\" style=\"color:#2eaf92\">生效</span></label></div>"
        html += "<div class=\"cell\" ><label><input  name=\"radio_" + PRitemID + QOID + "\" type=\"radio\" value=\"false\"><span  class=\" note-text-s\" style=\"color:#2eaf92\">失效</span></label></div>"
        html += "</td>"
        html += "</tr>"
        $("#QuotationInfoTable").find("tr[PRitemID='" + PRitemID + "']").next("tr").find("tbody").append(html);
    }
}

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

//pop 人員選擇器

//動態綁定回填的欄位
function fun_popAddPerson_Send(target) {
    popAddPerson = $("#popAddperson")
    PRInfoIndex = $(target).attr('PRInfoIndex')

    $(popAddPerson).find(".remodal-confirm-btn").unbind("click");

    $(popAddPerson).find(".remodal-confirm-btn").click(function () {
        if ($(popAddPerson).find("[alt=popWindow_SelectedBox]").find('.Links').length > 0) {
            context = $(popAddPerson).find("[alt=popWindow_SelectedBox]").find('.Links').first().find('span').text()
            $(target).closest("table").find("[alt=PRInfoIndex]").filter(function () {
                return $(this).text() == PRInfoIndex
            }).nextAll("[alt=Addperson]").children("span").text(context)
        }
        else {
            $(target).closest("table").find("[alt=PRInfoIndex]").filter(function () {
                return $(this).text() == PRInfoIndex
            })
            .nextAll("[alt=Addperson]").children("span").text("")
        }
    }
    )
}

//ajax 輸入查詢
function fun_popAddPersonSearch(target) {
    if ($(target).val() == "") {
        alert("請輸入查詢字串")
        return false;
    }
    else {
        /////
        list = new Array(3)
        list[0] = ["王曉明", "16655"];
        list[1] = ["張大毛", "16611"];
        list[2] = ["陳嘿嘿", "16652"];
        /////
        searchList = new Array()

        i = 0;
        if ($("#selPopAddperson_searchtype").val() == 1) {
            $(list).each(function () {
                if ($(this)[1].indexOf($(target).val()) > -1) {
                    searchList[i] = [$(this)[0] + "(" + $(this)[1] + ")", $(this)[1]]
                    i++;
                }
            })
        }
        else {
            $(list).each(function () {
                if ($(this)[0].indexOf($(target).val()) > -1) {
                    searchList[i] = [$(this)[0] + "(" + $(this)[1] + ")", $(this)[1]]
                    i++;
                }
            })
        }
        $(target).setSearchBox(searchList)
    }
}

//pop 商品選擇器

function fun_popPOitemListSearch() {
    /////
    list = new Array(3)
    list[0] = ["飛龍牌原子筆-紅"];
    list[1] = ["飛龍牌原子筆-黑"];
    list[2] = ["飛龍牌原子筆-藍"];
    POitemListSearchBox = $("#inp_POitemListSearchBox").val().trim();
    if (POitemListSearchBox.length == 0) {
        alert("請輸入查詢字串")
        return false;
    }
    else {
        i = 0;
        searchList = new Array()
        $(list).each(function () {
            rtn = true;
            if ($(this)[0].indexOf(POitemListSearchBox) >= 0) {
                searchList[i] = [$(this)[0]]
                i++
            }
        })
        if (searchList.length > 0) {
            $("#div_POitemListSearchedbody").find("ul").html("");
            $(searchList).each(function () {
                $("#div_POitemListSearchedbody").find("ul").append(
                    '<li>\
                        <label class="w100 label-box">\
                        <div class="table-box w5"><input type="radio" name ="POitemArray"></div>\
                        <div class="table-box w10">九成九文具行</div>\
                        <div class="table-box w10">一般辦公用品</div>\
                        <div   name="itemName" class="table-box w20">'+ $(this)[0] + '</div>\
                        <div class="table-box w5">Ea</div>\
                        <div class="table-box w10">8</div>\
                        <div class="table-box w10">BPA17001</div>\
                        <div class="table-box w20">2017/01/01~2017/12/31</div>\
                        <div class="table-box w10">方oo</br>(01ooo)</div>\
                        </label>\
                    </li>\
                ');
            })
            $("#div_POitemNoMatch").hide(200)
            $("#div_POitemListSearchedList").show(200)
        }
        else {
            $("#div_POitemListSearchedList").hide(200)
            $("#div_POitemNoMatch").show(200)
        }
    }
}

//動態綁定回填的欄位
function fun_popPOitemList_Send(target) {
    POitemList = $("#popPOitemList")
    PRInfoIndex = $(target).attr('PRInfoIndex')
    $(POitemList).find(".remodal-confirm-btn").unbind("click");

    $(POitemList).find(".remodal-confirm-btn").click(
        function () {
            if ($(POitemList).find("input[type=radio]:checked").length > 0) {
                context = $(POitemList).find("input[type=radio]:checked").closest("label").children("[name=itemName]").text();
                $(target).closest("table").find("[alt=PRInfoIndex]").filter(function () {
                    return $(this).text() == PRInfoIndex
                })
                    .nextAll("[name=POItem]").children("span").text(context)
            }
            else {
                $(target).closest("table").find("[alt=PRInfoIndex]").filter(function () {
                    return $(this).text() == PRInfoIndex
                })
                .nextAll("[name=POItem]").children("span").text("")
            }
        }
    )
}

//------pop	開窗控制--------
//數量輸入檢查
function fun_pcsOnblur(target) {
    num = $(target).val();
    if (num.length == 0) return false;

    if (regNum($(target).val())) {
        num = fun_accountingformatNumberdelzero(num);
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