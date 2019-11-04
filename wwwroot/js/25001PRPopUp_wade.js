//供應商查詢表單Action
function vendorSelected(data) {
}
/* $("#PopSuppliesSearchResult").hide();
 $("#suppliesConfirm").on('click', function () {
     SupplierNumber = $("#inpSuppliesID_SearchBox").val();
     SuppliesName = $("#inpSuppliesName_SearchBox").val();
     SuppliesIdNumber = $("#inpSuppliesNumber_SearchBox").val();

     if (SupplierNumber.length == 0 && SuppliesName.length == 0 && SuppliesIdNumber.length == 0) {
         alert("請至少輸入一個查詢條件")
         return false;
     }
     else {
         $("#PopSuppliesSearchResult").hide();

         $.ajax({
             type: 'POST',
             url: '/PR/SuppliesListGet',
             data: {
                 SupplierNumber: SupplierNumber, SName: SuppliesName, SuppliesIdNumber: SuppliesIdNumber
             },
             async: false,
             success: function (data) {
                 $("#divPopSuppliesSearchbody ul").find("li[CopyTarget=N]").remove();

                 $.each(data, function (index, obj) {
                     NewRow = $("#divPopSuppliesSearchbody ul").find("li[CopyTarget=Y]").clone()
                     NewRow.attr("CopyTarget", "N")
                     NewRow.find("div").eq(0).text(obj.SupplierNumber)
                     NewRow.find("div").eq(1).text(obj.SuppliesName)
                     NewRow.find("div").eq(2).text(obj.RatingDate)
                     NewRow.find("div").eq(3).text(obj.CommitmentDate)
                     NewRow.show()
                     $("#divPopSuppliesSearchbody ul").append(NewRow);
                 })

                 if ($("#divPopSuppliesSearchbody ul").find("li[CopyTarget=N]").length==0) {
                     $("#spanPopSuppliesNomatch").show()
                     $("#divPopSuppliesSearchList").hide()
                 }
                 else {
                     $("#spanPopSuppliesNomatch").hide()
                     $("#divPopSuppliesSearchList").show()
                 }

                 $("#PopSuppliesSearchResult").show()
             }

             , error: function (xhr) {
                 alert('Ajax request 發生錯誤' + xhr);
                 // $(e.target).attr('disabled', false);
             }
         });
     }
     $("#PopSuppliesSearchResult").show();
 })

 $("#suppliesCancel").on('click', function () {
     $("#inpSuppliesID_SearchBox").val("");
     $("#inpSuppliesName_SearchBox").val("");
     $("#inpSuppliesNumber_SearchBox").val("");
     $("#PopSuppliesSearchResult").hide();
 })*/
//供應商查詢表單Action

//pop品名跳窗 Action
{
    $(function () {
        $("#popPOitemList").find("a[alt=btnSearch]").on("click", function () {
            if ($("#popPOitemList").remodal().state == "opened") {
                $("#popPOitemList").remodal().close()
            }
            $.blockUI({ message: "搜尋中" });
            let keyWord = $("#inp_POitemListSearchBox").val().trim();
            let VendorName = $("#inp_VendorNameSearchBox").val().trim();
            $("#popPOitemList").find("#div_POitemListSearchedbody").find("li").not("[alt=template]").remove();

            $.ajax({
                type: 'POST',
                url: '/PR/POitemListGet',
                data: {
                    SName: keyWord,
                    VendorName: VendorName
                },
                async: true,
                success: function (data) {
                    if (data) {
                        $.each(data, function (index, obj) {
                            row = $("#popPOitemList").find("#div_POitemListSearchedbody").find("li[alt=template]").eq(0).clone()
                            $(row).attr("alt", "")
                            if (obj.QuoteAmount - obj.usedTwdQuoteAmount - obj.UnitTwdPrice >= 0) {//可用餘額減產品單價大於0才顯示
                                $(row).find("input:radio").data("obj", obj);
                            }
                            else {
                                $(row).attr("title", "協議採購項已超出剩餘合約金額")
                                $(row).find("input:radio").addClass("input-disable").prop("disabled", true)
                            }

                            $(row).find("div").eq(1).text(obj.VendorName)
                            $(row).find("div").eq(2).text(obj.CategoryName)
                            $(row).find("div").eq(3).text(obj.ItemDescription)
                            $(row).find("div").eq(4).text(obj.UomName)
                            $(row).find("div").eq(5).text(fun_accountingformatNumberdelzero(obj.UnitPrice))
                            $(row).find("div").eq(6).text(obj.BpaNum)
                            $(row).find("div").eq(7).text(obj.strContractStartDate + " ~ " + obj.strContractEndDate)
                            $(row).find("div").eq(8).text(obj.PurchaseEmpName + "(" + obj.PurchaseEmpNum + ")")

                            $(row).show()
                            $("#popPOitemList").find("#div_POitemListSearchedbody ul").append(row)
                        })
                    }

                    if ($("#popPOitemList").find("#div_POitemListSearchedbody").find("li").not("[alt=template]").length == 0) {
                        $("#popPOitemList").find("#div_POitemListSearchedbody ul").append("<li> <label class=\"w100 label-box\"><div  class=\"table-box w100\">查無資料</div></label></li>")
                        $("#popPOitemList").find("[alt=btnZone]").hide();
                    }
                    else {
                        $("#popPOitemList").find("[alt=btnZone]").show();
                    }

                    $("#popPOitemList").find("#div_POitemListSearchedList").show();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(errorThrown)
                }
            }).always(function () {
                setTimeout(function () {
                    $.unblockUI();
                    $("#popPOitemList").remodal().open()//避免ajax太快回覆，會導致remodal未關閉就開啟
                }, 500)
            });
        })
        $("#popPOitemList").find("a[data-remodal-action=confirm]").on("click", function () {
            $("#popPOitemList").find("input:radio").each(function () {
                if ($(this).prop("checked")) {
                    obj = $(this).data("obj")
                    return false
                }
            })
            if (obj) {
                target = $("#popPOitemList").data("target")
                popPOitem_inputData(obj, target)

                $(target).find("[Errmsg=Y]").remove();
            }
            else {
                alert("請選擇一樣品項")
                return false;
            }
        })
    })

    function popPOitem_inputData(obj, target) {
        $(target).data("obj", obj)
        $(target).find("[name=DeliveryPrompt]").val("")
        $(target).data("DeliveryList", null)//更換商品時清空送貨層
        $(target).find("[name=Quantity]").html("<span>  <b class=\"Classification undone-text\">0</b></span>")//數量歸零
        $(target).find("[tag]").each(function () {
            tag = $(this).attr("tag")
            if (obj[tag]) {
                if ($(this).is("[value]")) {
                    $(this).val(obj[tag])
                }
                else {
                    if ($(this).is("[Amount]")) {
                        $(this).text(fun_accountingformatNumberdelzero(obj[tag]))
                    }
                    else {
                        $(this).text(obj[tag])
                    }
                }
            }
            else {
                $(this).text("")
            }
        })

        $.when(th_PurchaseEmpListSet).always(
            function () {
                $(target).find("select[name=PurchaseEmpNum]").eq(0).val(obj.PurchaseEmpNum).prop("disabled", false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker("refresh")
                GetFirstPurchaseEmpNum()
            })
    }

    function popPOitemList_reset() {
        $("#inp_POitemListSearchBox").val("")
        $("#popPOitemList").find("#div_POitemListSearchedList").hide();
        $("#popPOitemList").find("#div_POitemListSearchedbody").find("li").not("[template]").remove();
        $("#popPOitemList").find("[alt=btnZone]").hide();
    }
}
//pop品名跳窗 Action

//送貨單位明細 Action
{
    $(function () {
        $("#popPROneTimeDetail").on("reset", function (evet, ReadOnly) {
            $.when(thrOneTimeDetail_ChargeDept, thrOneTimeDetail_RcvDept).done(function () {
                $("#popPROneTimeDetail").find("tbody[dataloading]").remove();
                $("#popPROneTimeDetail").find("[alt=add]").show();
                $("#popPROneTimeDetail").find("[alt=add]").off("click")
                $("#popPROneTimeDetail").find("[alt=add]").on("click", function () {
                    fun_addDeliveryRow(null, UomCode)
                })
                $("#popPROneTimeDetail").find("#OnceDevyConfirm").off("click")
                $("#popPROneTimeDetail").find("#OnceDevyConfirm").on("click", function () {
                    $("#popPROneTimeDetail").trigger("Confirm")
                })

                $("#popPROneTimeDetail").find("tbody").not("[dataloading]").not("[template]").remove();

                target = $("#popPROneTimeDetail").data("target")
                UomCode = $(target).find("[name=UomCode]").val()

                if (ReadOnly == 1) {
                    $("#popPROneTimeDetail").find("#OnceDevyConfirm").hide()
                    $("#popPROneTimeDetail").find("[alt=add]").hide()
                    $("#popPROneTimeDetail").find("a[alt=cancel]").text("確認")
                    if (target.data("DeliveryList") && target.data("DeliveryList").length > 0) {
                        $.each($.map(target.data("DeliveryList"), function (o) { if (!o.IsDelete) { return o } }), function (index, info) {
                            fun_addDeliveryReadonlyRow(info)
                        })
                    }
                }
                else {
                    $("#popPROneTimeDetail").find("#OnceDevyConfirm").show()
                    $("#popPROneTimeDetail").find("[alt=add]").show()
                    $("#popPROneTimeDetail").find("a[alt=cancel]").text("取消")

                    if (target.data("DeliveryList") && target.data("DeliveryList").length > 0) {
                        DeliveryList = target.data("DeliveryList")

                        $.each(DeliveryList, function (index, info) {
                            fun_addDeliveryRow(info, UomCode)
                        })
                    }
                    else {
                        fun_addDeliveryRow(null, UomCode)
                    }
                }
            }).fail(function () {
                alert("FIIS資料異常")
            })
        })
        $("#popPROneTimeDetail").on("Confirm", function () {
            $("#popPROneTimeDetail").find("[Errmsg=Y]").remove();
            target = $("#popPROneTimeDetail").data("target")
            let rtn = true;
            if (target) {
                let UomCode = $(target).find("[name=UomCode]").val()

                totalQuantity = 0;
                DeliveryList = [];
                PRDetailID = $(this).find("[name=PRDeliveryID]").val()
                $("#popPROneTimeDetail").find("tbody").not("[dataloading]").not("[template]").each(function () {
                    PurReqDelivery =
                    {
                        ChargeDeptName: $(this).find("[name=ChargeDept]").find("option:selected").text(),
                        RcvDeptName: $(this).find("[name=RcvDept]").find("option:selected").text(),
                        PRDeliveryID: $(this).find("[name=PRDeliveryID]").val(),
                        PRDetailID: PRDetailID,
                        Quantity: accounting.unformat($(this).find("[name=DevQuantity]").val()),
                        Amount: accounting.unformat($(this).find("[name=DevAmount]").text()),
                        TranferStatus: 0,
                        ChargeDept: $(this).find("[name=ChargeDept]").val(),
                        RcvDept: $(this).find("[name=RcvDept]").val(),
                        IsDelete: ($(this).find("[name=IsDelete]").val() == "1")
                    }
                    DeliveryList.push(PurReqDelivery)
                    if (!PurReqDelivery.IsDelete) {
                        if (!fun_basicVerify(this)) {
                            rtn = false
                        }
                        totalQuantity += PurReqDelivery.Quantity
                    }
                })

                if (rtn && UomCode == "AMT") {
                    if ($.map(DeliveryList, function (o) { return o.Quantity }).reduce(function (a, b) {
                        return a + b
                    }) != 1) {
                        rtn = false;
                        alert("數量總合不等於1")
                    }
                }

                if (rtn) {
                    let UnitTwdPrice = accounting.unformat((target).find("[tag=UnitTwdPrice]").text())

                    $(target).data("DeliveryList", DeliveryList)
                    $(target).find("[name=Quantity]").text(fun_accountingformatNumberdelzero(totalQuantity))
                    $(target).find("[name=totalTwdAmount]").text(fun_accountingformatNumberdelzero(accounting.toFixed(totalQuantity * UnitTwdPrice, 4)))
                    $("#popPROneTimeDetail").remodal().close()
                }
            }
        })

        thrOneTimeDetail_ChargeDept = $.ajax({
            url: "/PR/GetDepartmentList/",   //存取Json的網址
            type: "POST",
            cache: false,
            data: { PRnum: $("hidPRNum").val() },
            dataType: 'json',
            async: true,
            success: function (data) {
                if (data) {
                    $.each(data, function (index, obj) {
                        $("#popPROneTimeDetail").find("select[name=ChargeDept]").append($("<option></option>").attr("data-subtext", obj.DeptCode).attr("value", obj.DeptCode).text(obj.DeptName))
                    })

                    $("#popPROneTimeDetail").find("select[name=ChargeDept]").selectpicker('refresh');
                }
                else {
                    $("#popPROneTimeDetail").find("tbody[dataloading]").find("span").text("取得掛帳單位失敗")
                }
            },
            error: function (err) {
                $("#popPROneTimeDetail").find("tbody[dataloading]").find("span").text("取得掛帳單位失敗")
            }
        })

        thrOneTimeDetail_RcvDept = $.ajax({
            url: "/PR/GetHrDepartment/",   //存取Json的網址
            type: "POST",
            cache: false,
            data: { PRnum: $("hidPRNum").val() },
            dataType: 'json',
            async: true,
            success: function (data) {
                if (data) {
                    $.each(data, function (index, obj) {
                        $("#popPROneTimeDetail").find("select[name=RcvDept]").append($("<option></option>").attr("data-subtext", obj.DeptCode).attr("value", obj.DeptCode).text(obj.DeptName))
                    })
                    $("#popPROneTimeDetail").find("select[name=RcvDept]").selectpicker('refresh');
                }
                else {
                    $("#popPROneTimeDetail").find("tbody[dataloading]").find("span").text("取得收貨單位失敗")
                }
            },
            error: function (err) {
                $("#popPROneTimeDetail").find("tbody[dataloading]").find("span").text("取得收貨單位失敗")
            }
        })
    })

    function fun_addDeliveryRow(info, UomCode) {
        obj = $("#popPROneTimeDetail tbody[template]").eq(0).clone()
        $(obj).removeAttr("template");
        $(obj).find("[alt=template]").attr("alt", "Index")

        $(obj).find('.selectpicker').data('selectpicker', null);
        $(obj).find('.bootstrap-select').find("button:first").remove();
        $(obj).find(".selectpicker").selectpicker("render")

        if (UomCode == "AMT") {
            $(obj).find("[name=DevQuantity]").attr("Accuracy", "2").attr("MaxValue", 1)
        }
        else {
            $(obj).find("[name=DevQuantity]").attr("MaxValue", "999999999").removeAttr("Accuracy")
        }

        $(obj).find("input[Amount]").on("focus", function () {
            fun_onfocusAction(this);
        })
        $(obj).find("input[Amount]").on("blur", function () {
            target = $("#popPROneTimeDetail").data("target")
            inpValue = $(this).val()

            if (fun_onblurAction(this) && $(target).data("obj")) {
                $(this).closest("tbody").find("[name=DevAmount]").html(fun_accountingformatNumberdelzero(accounting.toFixed(inpValue * $(target).data("obj").UnitTwdPrice, 4)))
            }
            else {
                $(this).closest("tbody").find("[name=DevAmount]").html("<b class=\"ItemName undone-text\">系統自動帶入</b>")
            }
        })
        $(obj).find("[alt=remove]").on("click", function () {
            fun_DelDeliveryRow($(this).closest("tbody"));
        })

        $(obj).mouseenter(function () {
            $(this).find("[alt=remove]").show();
        })
        $(obj).mouseleave(function () {
            $(this).find("[alt=remove]").hide();
        })
        $(obj).show()
        if (info) {
            target = $("#popPROneTimeDetail").data("target")

            $(obj).find("select[name=ChargeDept]").val(info.ChargeDept).selectpicker("refresh")
            $(obj).find("select[name=RcvDept]").val(info.RcvDept).selectpicker("refresh")
            $(obj).find("input[name=DevQuantity]").val(info.Quantity)
            if (fun_onblurAction($(obj).find("input[name=DevQuantity]")) && $(target).data("obj")) {
                $(obj).find("div[name=DevAmount]").html(fun_accountingformatNumberdelzero(info.Amount))
            }
            $(obj).find("input[name=PRDeliveryID]").val(info.PRDeliveryID)
            $(obj).find("input[name=IsDelete]").val(info.IsDelete)
            if (info.IsDelete) {
                fun_DelDeliveryRow(obj)
            }
            else {
                fun_basicVerify(obj)
            }
        }

        $("#popPROneTimeDetail").find("table").append(obj)

        fun_resetCellIndex($("#popPROneTimeDetail"), "Index", 1)
    }

    function fun_addDeliveryReadonlyRow(info) {
        obj = $("#popPROneTimeDetail tbody[template]").eq(0).clone()
        $(obj).removeAttr("template");
        $(obj).find("[alt=template]").attr("alt", "Index")

        $(obj).find("td").eq(1).html("").text(info.ChargeDeptName)
        $(obj).find("td").eq(2).html("").text(info.RcvDeptName)
        $(obj).find("td").eq(3).html("").text(fun_accountingformatNumberdelzero(info.Quantity))
        $(obj).find("td").eq(4).html("").text(fun_accountingformatNumberdelzero(info.Amount))
        $(obj).show()
        $("#popPROneTimeDetail").find("table").append(obj)

        fun_resetCellIndex($("#popPROneTimeDetail"), "Index", 3)
    }

    function fun_DelDeliveryRow(target) {
        if ($(target).find("input[name=PRDeliveryID]").val() != "") {
            $(target).find("input[name=IsDelete]").val(1)
            $(target).hide();
            $(target).find("[alt=Index]").attr("alt", "deleted")
        }
        else {
            $(target).remove()
        }
        fun_resetCellIndex($("#popPROneTimeDetail"), "Index", 1)
    }
}
//送貨單位明細 Action

//新增報價單 Action
{
    $(function () {
        $("#popQuote").on("reset", function () {
            $.when(thrCurrencyCode).done(function () {
                $("#popQuote").find("input").val("");
                $("#popQuote").find("select").val("").selectpicker('refresh');
                $("#popQuote").find("[Errmsg=Y]").remove();
                $("#popQuote").find("select[name=VendorSiteId] option").remove()
                $("#popQuote").find("td[name=subTotal]").text("")
                $("#popQuote").find("select[name=CurrencyCode]").val("TWD").selectpicker('refresh')

                $("#popQuote").find("input[name=CurrencyName]").val($("#popQuote").find("select[name=CurrencyCode]").find("option[value=TWD]").text())
                $("#popQuote").find("input[name=ForeignPrice]").attr("accuracy", $("#popQuote").find("select[name=CurrencyCode]").find("option[value=TWD]").attr("extendedPrecision"))
                PRDList = $("#popQuote").data("PRDList")
                VID = $("#popQuote").data("VID")

                if (!VID) { alert("請選擇供應商"); return false }
                if (!PRDList) { alert("請選擇報價商品"); return false }

                StakeHolder = { flag: false }

                $.ajax({
                    url: "/PR/SuppliesListGet/",   //存取Json的網址
                    type: "POST",
                    cache: false,
                    dataType: 'json',
                    data: { SupplierNumber: VID },
                    async: false,
                    success: function (data) {
                        if (data) {
                            $("#popQuote").find("[name=supplierName]").text(data.supplierName)

                            $.each(data.supplierSite, function (index, obj) {
                                $("#popQuote").find("select[name=VendorSiteId]").append($("<option></option>").attr("value", obj.supplierSiteID).text(obj.supplierSiteCode))
                            })
                            $("#popQuote").find("select[name=VendorSiteId]").selectpicker('refresh');

                            $("#popQuote").find("input[name=VendorNum]").val(VID)
                            $("#popQuote").find("input[name=VendorSiteName]").val(data.supplierName)

                            StakeHolder = fun_StakeHolder(data.vatRegistrationNumber, data.supplierName)
                        }
                    },
                    error: function (err) {
                        alert("FIIS 供應商資料異常")
                    }
                })

                $.each(PRDList, function (index, obj) {
                    TrObj = $("#tabQOItemList").find("tr[Datarow]").eq(0).clone();
                    if (index == 0) {
                        $("#tabQOItemList").find("tr[Datarow]").remove();
                    }

                    $(TrObj).find("td[tag]").each(function () {
                        tag = $(this).attr("tag")
                        if (obj[tag]) {
                            if ($(this).is("[Amount]")) {
                                $(this).text(fun_accountingformatNumberdelzero(obj[tag]))
                            }
                            else {
                                $(this).text(obj[tag])
                            }
                        }
                    })
                    $(TrObj).find("[name=PRDetailId]").val(obj.PRDetailID)

                    $(TrObj).find("input[name=ForeignPrice]").on("focus", function () {
                        fun_onfocusAction(this);
                    })

                    $(TrObj).find("input[name=ForeignPrice]").on("blur", function () {
                        if (fun_onblurAction(this)) {
                            ForeignPrice = accounting.unformat($(this).val())
                            Quantity = accounting.unformat($(this).closest("tr").find("[tag=Quantity]").text())
                            subTotal = accounting.toFixed(Quantity * ForeignPrice, 4);
                            $(this).closest("tr").find("[name=subTotal]").text(fun_accountingformatNumberdelzero(subTotal))

                            TotalAmount = 0
                            $("#tabQOItemList").find("tr[Datarow]").each(function () {
                                subTotal = accounting.unformat($(this).closest("tr").find("[name=subTotal]").text())
                                if (subTotal == 0) {
                                    TotalAmount = 0;
                                    return false
                                }
                                else {
                                    TotalAmount += accounting.unformat(subTotal)
                                }
                            })
                            if (TotalAmount <= 0) {
                                $("#QuoteDetail").find("[name=TotalAmount]").val("")
                            }
                            else {
                                $("#QuoteDetail").find("[name=TotalAmount]").val(fun_accountingformatNumberdelzero(TotalAmount))
                            }
                        }
                        else {
                            $(this).closest("tr").find("[name=subTotal]").text("")
                            $("#QuoteDetail").find("[name=TotalAmount]").val("")
                        }
                    })

                    $("#tabQOItemList").append(TrObj)
                })

                fun_resetCellIndex($("#tabQOItemList"), "Index", 1)

                if (StakeHolder.flag) {
                    if (String(StakeHolder.IsInvolvedParties).toLocaleLowerCase() == "false") {
                        $("#popQuote").find("[name=divStakeHolderDescription]").hide();
                        $("#popQuote").find("[name=StakeHolderDescription]").removeAttr("necessary")
                        $("#popQuote").find("[name=strStakeHolder]").text("否")
                        $("#popQuote").find("input[name=StakeHolder]").val(false);
                    }
                    else {
                        $("#popQuote").find("[name=divStakeHolderDescription]").show();
                        $("#popQuote").find("[name=StakeHolderDescription]").attr("necessary", "")
                        $("#popQuote").find("[name=strStakeHolder]").text("是")
                        $("#popQuote").find("input[name=StakeHolder]").val(true);
                    }
                }
                else {
                    alert("檢核是否為利害關係人時發生錯誤")

                    return false
                }

                $("#QuotefileSection").empty("")
                let objitem = Q_FileUploadReset(false)

                $("#QuotefileSection").append($(objitem))

                window.location.href = "#modal-QO"
            })
        })

        $("#popQuote").find("a[Confirm]").on("click", function () {
            if (fun_basicVerify($("#popQuote"))) {
                Quoteinfo = {
                    // PurchaseEmpNum: $("#FillInEmpNum").val(),
                    // PurchaseEmpName: $("#FillInName").val(),
                    QuoteEmpNum: $("#FillInEmpNum").val(),
                    QuoteEmpName: $("#FillInName").val(),
                    VendorNum: $("#popQuote").find("input[name=VendorNum]").val(),
                    VendorSiteId: $("#popQuote").find("select[name=VendorSiteId]").val(),
                    ContactPerson: $("#popQuote").find("input[name=ContactPerson]").val(),
                    ContactEmail: $("#popQuote").find("input[name=ContactEmail]").val(),
                    StakeHolder: $("#popQuote").find("input[name=StakeHolder]").val(),
                    StakeHolderDescription: $("#popQuote").find("input[name=StakeHolderDescription]").val(),
                    CurrencyCode: $("#popQuote").find("select[name=CurrencyCode]").val(),
                    VendorSiteName: $("#popQuote").find("input[name=VendorSiteName]").val(),
                    InvoiceAddress: $("#popQuote").find("input[name=InvoiceAddress]").val(),
                    CurrencyName: $("#popQuote").find("input[name=CurrencyName]").val(),
                    supplierName: $("#popQuote").find("div[name=supplierName]").text(),
                    QuoDetailList: []
                }

                $("#tabQOItemList").find("tr[Datarow]").each(function () {
                    Quoteinfo.QuoDetailList.push({
                        PRDetailId: $(this).find("[name=PRDetailId]").val(), ForeignPrice: accounting.unformat($(this).find("[name=ForeignPrice]").val())
                         , Quantity: accounting.unformat($(this).find("[tag=Quantity]").text())
                    })
                })

                $.ajax({
                    url: "/PR/QuoteDbAdd/",   //存取Json的網址
                    type: "POST",
                    cache: false,
                    dataType: 'json',
                    data: { QuoObj: Quoteinfo },
                    async: false,
                    success: function (data) {
                        if (!data || data.FormGuid == "" || data.FormGuid == null) {
                            if (!(data.FormNum == "" || data.FormNum == null)) {
                                alert(data.FormNum)//拿來存錯誤訊息
                            }
                            else {
                                alert("合格供應商檢查失敗!!")
                            }
                            return false
                        }
                        else {
                            QsaveFileInfo(data.FormGuid);

                            $("#popQuote").remodal().close()
                        }
                    },
                    error: function (err) {
                        alert("報價單存檔失敗!!")
                        return false
                    }
                })
            }
            else {
                return false
            }
        })

        $("#popQuote").find("select[name=CurrencyCode]").on("change", function () {
            $("#popQuote").find("input[name=CurrencyName]").val($(this).find("option:selected").text())
            /* if ($(this).val() == "TWD") {
                 $("#popQuote").find("input[name=ForeignPrice]").attr("Accuracy", 0)
             }
             else {
                 let extendedPrecision = parseInt($(this).find("option:selected").attr("extendedPrecision"))
                 extendedPrecision = (extendedPrecision > 4) ? 4 : extendedPrecision //小數點最多四位

                 $("#popQuote").find("input[name=ForeignPrice]").attr("Accuracy", extendedPrecision)
             }*/
            let extendedPrecision = parseInt($(this).find("option:selected").attr("extendedPrecision"))
            extendedPrecision = (extendedPrecision > 4) ? 4 : extendedPrecision //小數點最多四位

            $("#popQuote").find("input[name=ForeignPrice]").attr("Accuracy", extendedPrecision)

            fun_onblurAction($("#popQuote").find("input[name=ForeignPrice]").eq(0))
            $("#popQuote").find("input[name=ForeignPrice]").eq(0).blur()
        })
        $("#popQuote").find("select[name=VendorSiteId]").on("change", function () {
            $("#popQuote").find("input[name=InvoiceAddress]").val($(this).find("option:selected").text())
        })

        thrCurrencyCode = $.ajax({
            url: "/PR/CurrencyListGet/",   //存取Json的網址
            type: "POST",
            cache: false,
            dataType: 'json',
            async: true,
            success: function (data) {
                if (data) {
                    $.each(data, function (index, obj) {
                        $("#popQuote").find("select[name=CurrencyCode]").append($("<option></option>").attr("data-subtext", obj.currencyCode).attr("value", obj.currencyCode).text(obj.currencyName).attr("extendedPrecision", obj.extendedPrecision))
                    })
                    $("#popQuote").find("select[name=CurrencyCode]").selectpicker('refresh');
                }
            },
            error: function (err) {
            }
        })
    })

    //利害關係人檢核
    function fun_StakeHolder(uid, name) {
        let rtn = { flag: false }

        $.ajax({
            url: "/PR/CheckIsInvolvedParties/",   //存取Json的網址
            type: "POST",
            data: { uid: uid, name: name },
            cache: false,
            async: false,
            success: function (data) {
                rtn = { flag: true, IsInvolvedParties: data }
            }
        })

        return rtn
    }
}
//新增報價單 Action

//報價明細 Action
{
    $("#QuotationInforemodal").on("reset", function (event, option) {
        $.ajax({
            url: "/PR/QuoteDetailListGet/",   //存取Json的網址
            type: "POST",
            cache: false,
            dataType: 'json',
            data: { PRDetailID: option.PRDetailID },
            async: false,
            success: function (data) {
                if (data) {
                    if ($(data).length == 0) {
                        alert("查無可用報價")
                        return
                    }

                    $.each(data, function (index, obj) {
                        TrObj = $("#tab_QuotationInfo").find("tr[Datarow]").eq(0).clone();
                        if (index == 0) {
                            $("#tab_QuotationInfo").find("tr[Datarow]").remove();
                        }

                        $(TrObj).find("[tag]").each(function () {
                            $(this).text("")
                            tag = $(this).attr("tag")
                            if (obj[tag]) {
                                if ($(this).is("[Amount]")) {
                                    $(this).text(fun_accountingformatNumberdelzero(obj[tag]))
                                }
                                else {
                                    $(this).text(obj[tag])
                                }
                            }
                        })

                        if (obj.IsEnabled) {
                            $(TrObj).find("[alt=IsEnabled][value=true]").prop("checked", true)
                            $(TrObj).find("[alt=IsEnabled][value=false]").prop("checked", false)
                        }
                        else {
                            $(TrObj).find("[alt=IsEnabled][value=true]").prop("checked", false)
                            $(TrObj).find("[alt=IsEnabled][value=false]").prop("checked", true)
                        }

                        if (option.Confirmed) {
                            $(TrObj).find("[alt=IsEnabled][value=true]").prop("disabled", true).addClass("input-disable")
                            $(TrObj).find("[alt=IsEnabled][value=false]").prop("disabled", true).addClass("input-disable")
                            $("#QuoDetConfirm").hide()
                        }
                        else {
                            $(TrObj).find("[alt=IsEnabled][value=true]").prop("disabled", false).removeClass("input-disable")
                            $(TrObj).find("[alt=IsEnabled][value=false]").prop("disabled", false).removeClass("input-disable")
                            $("#QuoDetConfirm").show()
                        }

                        $(TrObj).find("[alt=IsEnabled]").attr("name", "radion_IsEnabled" + index)
                        $(TrObj).find("input[name=QDetailID]").val(obj.QDetailID)

                        $(TrObj).find("a[tag=QuoteNum]").on("click", function () {
                            $.ajax({
                                url: "/PR/GetQuoteInfo/" + $(this).text(),   //存取Json的網址
                                type: "POST",
                                cache: false,
                                dataType: 'json',
                                async: false,
                                success: function (data) {
                                    if (data && data.Detail) {
                                        $("#QuoteInfoArea").find("[tag]").each(function () {
                                            $(this).text("")
                                            tag = $(this).attr("tag")
                                            if (data.Detail[tag]) {
                                                if ($(this).is("[Amount]")) {
                                                    $(this).text(fun_accountingformatNumberdelzero(data.Detail[tag]))
                                                }
                                                else {
                                                    $(this).text(data.Detail[tag])
                                                }
                                            }
                                        })
                                        if (data.Detail.StakeHolder) {
                                            $("#QuoteInfoArea").find("[name=strStakeHolder]").text("是")
                                        }
                                        else {
                                            $("#QuoteInfoArea").find("[name=strStakeHolder]").text("否")
                                        }

                                        TotalAmount = 0
                                        $.each(data.Detail.QuoDetailList, function (index, QD) {
                                            TrObj = $("#tabQOItemReadOnlyList").find("tr[Datarow]").eq(0).clone();
                                            if (index == 0) {
                                                $("#tabQOItemReadOnlyList").find("tr[Datarow]").remove();
                                            }
                                            $(TrObj).find("[tag=ForeignPrice]").text(fun_accountingformatNumberdelzero(QD.ForeignPrice))

                                            $.ajax({
                                                url: "/PR/GetPRDetailByPRDetailId/" + $(this).text(),   //存取Json的網址
                                                type: "POST",
                                                cache: false,
                                                dataType: 'json',
                                                data: { PRDetailId: QD.PRDetailId },
                                                async: false,
                                                success: function (PRDdata) {
                                                    if (PRDdata && PRDdata.Detail) {
                                                        subTotal = parseFloat(accounting.toFixed((QD.ForeignPrice * PRDdata.Detail.Quantity), 4))
                                                        TotalAmount += subTotal
                                                        $(TrObj).find("[tag=CategoryName]").text(PRDdata.Detail.CategoryName)
                                                        $(TrObj).find("[tag=ItemDescription]").text(PRDdata.Detail.ItemDescription)
                                                        $(TrObj).find("[tag=Quantity]").text(fun_accountingformatNumberdelzero(PRDdata.Detail.Quantity))
                                                        $(TrObj).find("[tag=UomName]").text(PRDdata.Detail.UomName)
                                                        $(TrObj).find("[name=subTotal]").text(fun_accountingformatNumberdelzero(subTotal))
                                                    }
                                                }
                                            })

                                            $("#tabQOItemReadOnlyList tbody").append(TrObj)
                                        })
                                        $("#popQuoteReadonly").find("[name=TotalAmount]").val(fun_accountingformatNumberdelzero(TotalAmount))
                                        fun_resetCellIndex($("#tabQOItemReadOnlyList"), "Index", 1)

                                        //檔案上傳區塊
                                        $("#QuoteReadonlyfileSection").empty().append(Q_FileUploadReset(true))
                                        QgetFileInfo(data.Detail["QID"], $("#QuoteReadonlyfileSection")).then(function () {
                                            $("#QuoteReadonlyfileSection").find("a.deleteFile").remove()
                                            $("#QuoteReadonlyfileSection").html($("#QuoteReadonlyfileSection").html().replace(/downloadFileHandler/g, "QdownloadFileHandler"))
                                        })

                                        //檔案上傳區塊

                                        $("#popQuoteReadonly").remodal().open()
                                    }
                                    else {
                                        alert("報價單載入失敗!!")
                                    }
                                },
                                error: function (err) {
                                    alert("報價單載入失敗!!")
                                }
                            })
                        })

                        $("#tab_QuotationInfo tbody").append(TrObj)
                    })

                    window.location.href = "#QuotationInforemodal"
                }
                else {
                    alert("取得報價明細失敗")
                }
            },
            error: function (err) {
                alert("取得報價明細失敗")
            }
        })
    })

    $("#QuoDetConfirm").on("click", function () {
        QDlist = []

        $("#tab_QuotationInfo tr[Datarow]").each(function () {
            QDlist.push({
                QDetailID: $(this).find("input[name=QDetailID]").val(),
                IsEnabled: $(this).find("[alt=IsEnabled]:checked").val()
            })
        })

        $.ajax({
            url: "/PR/QuoteToEnable/",   //存取Json的網址
            type: "POST",
            cache: false,
            dataType: 'json',
            data: { QDlist: QDlist },
            async: false,
            success: function (data) {
                if (!data) {
                    alert("更新報價狀態失敗")
                }
            },
            error: function (err) {
                alert("更新報價狀態失敗")
            }
        })
    })
}
//報價明細 Action

//報價上傳 Action
{
    var Q_existData = []

    function Q_FileUploadReset(readonly) {
        Q_existData = []
        let Qesunfile = {}
        let QfileSectionitem = $('#QfileSection').clone();

        Qesunfile = $(QfileSectionitem).find("div.QesunfileList")
        $(Qesunfile).empty()

        var temp = $.extend(true, {}, $(Qesunfile)).attr('id');
        html = ""
        if (readonly) {
            html = fileZoneReadOnlyTemplate(temp, Qesunfile, index);
        } else {
            html = fileZoneEditTemplate(temp, Qesunfile, index);
        }

        //避免被主單的JS控制到
        html = html.replace(/dndregion/g, "Qdndregion")
        html = html.replace(/fileUploadBtn/g, "QfileUploadBtn")
        html = html.replace(/chageDescription/g, "QchageDescription")
        html = html.replace(/<div class="file-table-area text-center">/, "<div class=\"file-table-area text-center\" style=\"text-align:center\">")
        html = html.replace(/<div class="icon-cloud_upload upload-icon-size">/, "<div class=\"icon-cloud_upload upload-icon-size\" style=\"text-align:center\">")

        //避免被主單的JS控制到

        $(Qesunfile).append(html)

        //拖曳上傳功能
        $(Qesunfile).find('.Qdndregion').on({
            'dragenter':
                function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $(this).css('border', '2px solid #0B85A1');
                },
            'dragover':
                function (e) {
                    $(this).css('border', '2px solid #0B85A1');
                    e.stopPropagation();
                    e.preventDefault();
                },
            'drop':
                function (e) {
                    e.preventDefault();
                    $(this).css('border', '');
                    var files = e.originalEvent.dataTransfer.files;
                    if (files.length > 0) {
                        Q_existData = QuploadFileHandler(files, $(this), Q_existData);
                    }
                }
        });
        //監聽上傳按鈕是否有選擇檔案
        $(Qesunfile).find(".QfileUploadBtn").on('change', function () {
            Q_existData = QuploadFileHandler($(this)[0].files, $(this).parents('.box'), Q_existData);
            //將檔案放入FormData後初始化input file
            $(this).val("");
        });

        $(Qesunfile).find('.selectAllFile').on('click', function () {
            $(this).parents('.box').find('.selectFileDetail').prop('checked', $(this).prop('checked'));
        });

        //刪除按鈕
        $(Qesunfile).find(".deleteFile").off('click');
        $(Qesunfile).find(".deleteFile").on('click', '.deleteFile', QdeleteFileHandler);
        $(QfileSectionitem).show()

        return QfileSectionitem
    }

    //==============================================================================================
    // 檔案上傳 / 檔案下載 / 刪除檔案 / 存檔 / 取得現有檔案
    //==============================================================================================
    function QuploadFileHandler(files, appendRoot, dataList) {
        var data = new FormData();
        var uploadCount = 0;
        var existFileName = "";

        $.each(files, function (index, item) {
            uploadCount++;
            data.append(index, item);
            //若檔案清單已有檔案，則檢查是否有重複上傳的檔
            if ($(appendRoot).find('tr.fileDetail').length > 0) {
                $.each($(appendRoot).find('tr.fileDetail a.fileName'), function (existIndex, existItem) {
                    if (item.name == $(existItem).text()) {
                        delete (data[index]);
                        existFileName = existFileName + "\n" + item.name + " 已經存在";
                        uploadCount--;
                    }
                })
            }
        });
        //若無重複上傳，則回傳0筆失敗
        if (existFileName == "") {
            existFileName = "0筆";
        }
        var uploadResult;
        if (uploadCount > 0) {
            $.when(
                $.ajax({
                    headers: { FormType: "QO", UserID: $('#LoginEno').val() },
                    type: 'POST',
                    data: data,
                    async: true,
                    cache: false,
                    contentType: false,
                    processData: false,
                    url: '/CBP/Upload/',
                    success: function (data1, param, param1) {
                        uploadResult = data1;
                    },
                    error: function (data1, param, param1) {
                        alert("檔案上傳失敗")
                    }
                })
                ).then(
                    function () {
                        blockPage('')
                        if (uploadResult.length > 0) {
                            alert("成功上傳：" + uploadResult.length + "筆檔案\n" + "失敗：" + existFileName)
                            dataList = QsetFileData(uploadResult, appendRoot, dataList)
                        }
                    }
                )
        } else {
            // alert(existFileName)
        }

        return dataList
    }
    function QdeleteFileHandler(e) {
        var alertMsg = "";
        var root = $(e.target).parents('.box');
        var deleteGroup = $(root).find('input[type="checkbox"][class="selectFileDetail"]:checked').parents('tr.fileDetail');
        if (deleteGroup.length < 1) {
            alert("請勾選要刪除的檔案");
        } else {
            $.each($(deleteGroup).find('.fileName'), function (index, item) {
                alertMsg = alertMsg + $(item).text() + '\n'
            })
            var noSernoDelete = [];
            alertMsg = alertMsg + "即將被刪除，請確認是否刪除"
            if (confirm(alertMsg)) {
                $(root).find('.selectAllFile').prop('checked', false);
                $.each(deleteGroup, function (index, item) {
                    Q_existData.find(function myfunction(x, index) {
                        if ($(item).find('input[type="checkbox"]').attr('id').split('_')[1] == 0) {
                            if (x.file.FileName == $(item).find('a.fileName').text()) {
                                x.fileStatus = 99;
                            }
                        }
                        if (x.Serno == $(item).find('input[type="checkbox"]').attr('id').split('_')[1] && x.Serno != 0) {
                            x.fileStatus = 2;
                        }
                    })
                })
                deleteGroup.remove();
                if ($(root).find('.fileDetail').length < 1) {
                    $(root).find('.deleteFile').remove();
                    $(root).find('.downloadFile').remove();
                    $(root).find('tbody').append('<tr class="unUpload"><td colspan="5" class="text-center"><div class="file-table-area text-center"><div class="icon-cloud_upload upload-icon-size"></div>\
                        <b>請將檔案拖曳至此或點【上傳檔案】按鈕</b></div></td></tr>');
                }
            }
        }
    }
    function QsaveFileInfo(formGuid) {
        if (Q_existData.length > 0) {
            $.ajax({
                async: true,
                type: 'POST',
                data: JSON.stringify(Q_existData),
                contentType: "application/json",
                url: '/CBP/SaveFile/' + formGuid,
                error: function (data) {
                    alert(data.responseText)
                }
            })
        }
    }
    function QgetFileInfo(formGuid, target) {
        return $.ajax({
            async: true,
            type: 'GET',
            contentType: "application/json",
            url: '/CBP/GetFile/' + formGuid,
            success: function (data) {
                if (data != undefined && data.length > 0) {
                    $.each(data, function (index, item) {
                        item.fileStatus = 0;
                    })
                    Q_existData = QsetFileData(data, target, Q_existData)
                }
            },
            error: function (data) {
                alert(data.responseText)
            }
        })
    }
    function QdownloadFileHandler(specificFile) {
        var downLoadData = [];
        if (typeof (specificFile) == "undefined") {
            return;
        } else if (typeof (specificFile) == "object") {
            Q_existData.find(function (element) {
                if (element.fileStatus != 2 && element.fileStatus != 99) {
                    downLoadData.push(element)
                }
            })
            //$.each(specificFile, function (index, item) {
            //    downLoadData.push(_existData.find(function (element) {
            //        return element.file.FileName == item
            //    }))
            //})
        } else {
            downLoadData.push(Q_existData.find(function (element) {
                return element.file.FileName == specificFile
            }))
        }
        //判斷是否為IE11,因IE11不支援使用FetchAPI
        if (rv != undefined && parseFloat(rv[1]) == 11.0) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/CBP/Download', true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                if (this.status === 200) {
                    var filename = xhr.getResponseHeader('x-filename') == null ? "attechment.zip" : xhr.getResponseHeader('x-filename');
                    var disposition = filename;
                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        var matches = filenameRegex.exec(disposition);
                        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                    }
                    var type = xhr.getResponseHeader('Content-Type');
                    var blob = typeof File === 'function'
                        ? new File([this.response], filename, { type: type })
                        : new Blob([this.response], { type: type });
                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        window.navigator.msSaveBlob(blob, filename);
                    } else {
                        var URL = window.URL || window.webkitURL;
                        var downloadUrl = URL.createObjectURL(blob);

                        if (filename) {
                            var a = document.createElement("a");
                            if (typeof a.download === 'undefined') {
                                window.location = downloadUrl;
                            } else {
                                a.href = downloadUrl;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.click();
                            }
                        } else {
                            window.location = downloadUrl;
                        }

                        setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
                    }
                }
            };
            xhr.setRequestHeader('content-type', 'application/json');
            xhr.send(JSON.stringify(downLoadData));
        } else {
            var fileName = "default";
            fetch('/CBP/Download', {
                body: JSON.stringify(downLoadData),
                method: 'POST',
                mode: 'cors',
                headers: {
                    'content-type': 'application/json'
                }
            }).then(function (response) {
                fileName = decodeURI(response.headers.get('x-fileName')) == "null" ? decodeURI(response.headers.get('content-disposition').split('=')[1]) : decodeURI(response.headers.get('x-fileName'))
                return response.blob();
            }).then(function (blob) {
                saveAs(blob, fileName);
            })
        }
    }

    //==============================================================================================
    // 處理檔案區的各式樣板功能
    //==============================================================================================
    function QsetFileData(fileData, appendRoot, dataList) {
        var appendTarget = $(appendRoot).find('tbody.fileList');
        if (typeof (fileData) != "object" || fileData == null || fileData.length < 1) {
            return;
        }
        //加入刪除及下載鈕
        if ($(appendRoot).find('.fileBtnArea').find('.deleteFile').length < 1) {
            $(appendRoot).find('.fileBtnArea').append('<a class="btn-02-gray btn-text4 deleteFile"> <div class="glyphicon glyphicon-trash bt-icon-size"></div>刪除檔案</a>');
        }
        if ($(appendRoot).find('.fileBtnArea').find('.downloadFile').length < 1) {
            $(appendRoot).find('.fileBtnArea').append('<a class="btn-02-yellow btn-text4 downloadFile" onclick=\'QdownloadFileHandler([])\'><div class="glyphicon glyphicon-save bt-icon-size"></div>全部下載</a>');
        }
        $.each(fileData, function (index, item) {
            item.fileSeq = dataList.length + 1;
            dataList.push(item);
            _peopleInfoTemplate = peopleInfoTemplate(item.uploaderID, item.uploaderName, item.uploaderDept)
            item.Serno == 0 ? $(appendTarget).append(fileDescriptionOpenTemplate(item).replace(/downloadFileHandler/g, "QdownloadFileHandler").replace(/chageDescription/g, "QchageDescription")) :
            item.uploaderID == $('#LoginEno').val() ? $(appendTarget).append(fileDeleteOpenTemplate(item)) : (appendTarget).append(fileDefaultTemplate(item));
        });

        // $(appendTarget).html($(appendTarget).html().replace(/downloadFileHandler/g, "QdownloadFileHandler"))
        // $(appendTarget).html($(appendTarget).html().replace(/chageDescription/g, "QchageDescription"))

        $(appendTarget).find('tr.unUpload').remove();
        if (urlParam[1].toLocaleLowerCase() == "readonly") {
            $('input.selectFileDetail').remove()
        }

        return dataList
    }
    function QchageDescription(e) {
        var description = $(e).val();
        Q_existData.find(function myfunction(x, index) { if ($(e).parents('tr').find('a.fileName').text() == x.file.FileName) { x.fileDescription = description } })
    }
}

//報價上傳 Action