var Global = new Map()
Global.set("RTRNum", $("#RTRNum").val())
Global.set("UserID", $('#LoginEno').val())
Global.set("ApplicantDepId", "")
//Global.set("DBValue", [])
var ResultData
var ReleaseNumArray = Array();
today = new Date();

//暫存
function draft() {
    $("input[Amount]").each(function () {
        $(this).val(accounting.unformat($(this).val()))
    })

    let i = 0;
    $("#DetailTable tbody").each(function () {
        $(this).find("input").each(function () {
            $(this).attr("name", "RTRDList[" + i + "]." + $(this).attr("alt"))
        })
        i += 1;
    })
    _formInfo.flag = false;
    blockPageForJBPMSend()
    return $.ajax({
        url: '/RTR/Edit',
        dataType: 'json',
        type: 'POST',
        //async: false,
        data: $("form").serialize(),
        success: function (data, textStatus, jqXHR) {
            _formInfo.formGuid = data.info.FormGuid
            _formInfo.formNum = data.info.FormNum
            _formInfo.flag = data.info.Flag
            $("#FormTypeName").val("收貨退回單")
            $("#ApplyItem").val("供應商-" + data.VendorName)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("傳送發生錯誤")
        }
    });
}

//驗證
function Verify() {
    let rtn = true;
    let draftAjax = $.Deferred()

    $("[Errmsg]").remove()

    setTimeout(function () {
        if ($("#DetailTable tbody").not("[alt=deleted]").length == 0) {
            alert("請輸入退貨資訊")
            rtn = false
        }

        $("#InformationSection [necessary]").each(function () {
            if ($(this).val().trim().length < 1) {
                fun_AddErrMesg($(this), "Err" + $(this).attr("id"), "此為必填欄位")
                rtn = false;
            }
        })

        if (rtn) {
            $("#DetailTable tbody").not("[alt=deleted]").each(function () {
                let index = $(this).find("[alt=Index]").text()
                let Quantity = accounting.unformat($(this).find("[alt=Quantity]").val())
                if (Quantity <= 0) {
                    fun_AddErrMesg($(this).find("[alt=Quantity]"), "Err" + $(this).find("[alt=Quantity]").attr("id"), "請輸入大於0的數字")

                    rtn = false;
                }

                if (rtn) {
                    $.ajax({
                        url: '/RTR/GetRTRAccountReceivable',
                        dataType: 'json',
                        type: 'POST',
                        async: false,
                        data: { RTRNum: Global.get("RTRNum"), RDetailID: $(this).find("[alt=RDetailID]").val() },
                        success: function (data, textStatus, jqXHR) {
                            if (data > 0) {
                                if (data < Quantity) {
                                    alert("退貨項次" + index + " 可退貨數量為" + data + "，請重新查詢")
                                    rtn = false;
                                }
                            }
                            else {
                                rtn = false;
                                alert("退貨項次" + index + " 可退貨數量為0，請重新查詢")
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            rtn = false;
                            alert("退貨項次" + index + " 取得可退貨數量失敗")
                        }
                    });

                    if (!rtn) {
                        // GetRTRList(Global.get("RTRNum"), Global.get("UserID"), Global.get("ApplicantDepId"), $("#RT_SDate").val(), $("#RT_EDate").val())

                        //更新退貨資訊
                        GetRTRList(Global.get("RTRNum"), Global.get("UserID"), $("#RT_SDate").val(), $("#RT_EDate").val())
                        return false;
                    }
                }
            })
        }

        if (!rtn) {
            if ($('[Errmsg=Y]').length > 0) {
                $('html, body').animate({
                    scrollTop: ($('[Errmsg=Y]').first().closest("div .row").offset().top) - 50
                }, 500);
            }
        }

        (rtn) ? draftAjax.resolve() : draftAjax.reject();
    }, 0)

    return draftAjax.promise()
}

//傳送
function Save() {
    _formInfo.flag = false

    $("input[Amount]").each(function () {
        $(this).val(accounting.unformat($(this).val()))
    })

    let i = 0;
    $("#DetailTable tbody").each(function () {
        $(this).find("input").each(function () {
            $(this).attr("name", "RTRDList[" + i + "]." + $(this).attr("alt"))
        })
        i += 1;
    })

    _formInfo.flag = false

    return $.ajax({
        url: '/RTR/Save',
        dataType: 'json',
        type: 'POST',
        // async: false,
        data: $("form").serialize(),
        success: function (data, textStatus, jqXHR) {
            _formInfo.formGuid = data.info.FormGuid
            _formInfo.formNum = data.info.FormNum
            _formInfo.flag = data.info.Flag
            $("#FormTypeName").val("收貨退回單")
            $("#ApplyItem").val("供應商-" + data.VendorName)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("傳送發生錯誤")
        }
    });
}

$(function () {
    if ($("#P_Status").val() != 2) {
        $("#__FiisStates").hide()
    }

    /*ApplicantDepList = $.map(_unitData, function (obj) { if (obj.unit_level == 4) { return obj.unit_id } })
    if (ApplicantDepList.length > 0) {
        Global.set("ApplicantDepId", ApplicantDepList[0])
    }
    else {
        Global.set("ApplicantDepId", _unitData[_unitData.length - 1].unit_id)
    }*/

    $("#DetailTable tbody").each(function () {
        dbobj = { RDetailID: $(this).find("[alt=RDetailID]").val(), Quantity: $(this).find("[alt=Quantity]").val() }
        // Global.get("DBValue").push(dbobj)

        if ($(this).find("[alt=UomCode]").val() != "AMT") {
            $(this).find("[alt=Quantity]").removeAttr("Accuracy")
        }
        $(this).find("[alt=Quantity]").attr("Max", $(this).find("[alt=RTDQuantity]").val())
        $(this).find("[alt=Quantity]").val(fun_accountingformatNumberdelzero($(this).find("[alt=Quantity]").val()))
        $(this).find("[alt=Quantity]").on("focus", function () {
            fun_onfocusAction(this)
        })
        $(this).find("[alt=Quantity]").on("blur", function () {
            fun_onblurAction(this)
        })

        $(this).mouseenter(function () {
            $(this).find("[alt=removebtn]").show();
        })
        $(this).mouseleave(function () {
            $(this).find("[alt=removebtn]").hide();
        })

        $(this).find("[alt=removebtn]").on("click", function () {
            if (confirm("是否確認刪除該筆資料")) {
                $(this).closest("tbody").hide();
                $(this).closest("tbody").find("[alt=Index]").attr("alt", "deleted")
                $(this).closest("tbody").find("[alt=IsDelete]").val(true)
                $(this).closest("tbody").attr("alt", "deleted")
                $(this).closest("tbody").find("[alt=Quantity]").removeAttr("necessary", "")

                if ($("#DetailTable tbody").not("[alt=deleted]").length == 0) {
                    $("#DetailArea").hide(200);
                }
                else {
                    fun_resetCellIndex($("#DetailTable"), "Index", 1)
                }
            }
        })
    })

    if ($("#DetailTable tbody").length > 0) {
        fun_resetCellIndex($("#DetailTable"), "Index", 1)

        $("#DetailArea").show(200)

        $("#ResultArea").hide(200)

        RTTransactionDate = $("#strRTTransactionDate").val();
        if (new Date(RTTransactionDate).getFullYear()) {
            $("#divTransactionDate").data("DateTimePicker").minDate(RTTransactionDate).maxDate(new Date())
        }
    }

    $("#ReleaseNum").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add');
    $("#ResultArea").find("a").on("click", function () {
        fun_SalesTaxAllCloumn(this)
    });

    $("#divRT_SDate").data("DateTimePicker").maxDate(new Date())
    $("#divRT_EDate").data("DateTimePicker").maxDate(new Date())

    $("#RT_SDate").val(String(today.getFullYear() - 1) + "-" + funAddheadZero(2, today.getMonth() + 1) + "-" + funAddheadZero(2, today.getDate()))
    $("#RT_EDate").val(String(today.getFullYear()) + "-" + funAddheadZero(2, today.getMonth() + 1) + "-" + funAddheadZero(2, today.getDate()))
    $("#_RT_SDate").text($("#RT_SDate").val())
    $("#_RT_EDate").text($("#RT_EDate").val())

    //  GetRTRList(Global.get("RTRNum"), Global.get("UserID"), Global.get("ApplicantDepId"), $("#RT_SDate").val(), $("#RT_EDate").val())
    GetRTRList(Global.get("RTRNum"), Global.get("UserID"), $("#RT_SDate").val(), $("#RT_EDate").val())
    $("#RTDateEditBtn").on("click", function () {
        $(this).hide(200);
        $("#_RT_SDate").hide(200);
        $("#_RT_EDate").hide(200);
        $("#div_RTSearch").hide(200);

        $("#RTDateSearchBtn").show(200);
        $("#divRT_SDate").show(200);
        $("#divRT_EDate").show(200);
    })

    $("#RTDateSearchBtn").on("click", function () {
        RT_SDate = new Date($("#RT_SDate").val())
        RT_EDate = new Date($("#RT_EDate").val())

        if (isNaN(RT_SDate.getDate()) || isNaN(RT_EDate.getDate())) {
            $("#AlertMessage").text("請輸入收貨起迄日");
            window.location.href = "#modal-added-info-2"
            return false;
        }
        else {
            if (RT_SDate.valueOf() > RT_EDate.valueOf()) {
                $("#RT_SDate").val([$("#RT_EDate").val(), $("#RT_EDate").val($("#RT_SDate").val())][0])
            }
            $("#_RT_SDate").text($("#RT_SDate").val())
            $("#_RT_EDate").text($("#RT_EDate").val());
        }

        $(this).hide(200);

        $("#divRT_SDate").hide(200);
        $("#divRT_EDate").hide(200);

        $("#RTDateEditBtn").show(200);
        $("#_RT_SDate").show(200);
        $("#_RT_EDate").show(200);
        $("#div_RTSearch").show(200);

        // GetRTRList(Global.get("RTRNum"), Global.get("UserID"), Global.get("ApplicantDepId"), $("#RT_SDate").val(), $("#RT_EDate").val())
        GetRTRList(Global.get("RTRNum"), Global.get("UserID"), $("#RT_SDate").val(), $("#RT_EDate").val())
    })

    $("#CleanBtn").on("click", function () {
        $("#ResultArea").hide(200);
        $("#ReleaseNum").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add');
        $("#SearchArea").find("select").val("").selectpicker("refresh")
    })

    $("#SearchBtn").on("click", function () {
        if ($("#ListNUM option:selected").data("EnumFormKind") == "BPA" && $("#ReleaseNum")[0].selectedIndex == 0) {
            $("#AlertMessage").text("當所選單號為年度議價協議時，需選擇核發次數");
            window.location.href = "#modal-added-info-2"
            $("#ResultArea").hide(200);
            return false
        }
        Resultlist = { Data: Global.get("ResultData") }
        Resultlist = $.extend(true, {}, Resultlist)

        //資料篩選
        if ($("#ListNUM").val() && $("#ListNUM").val() != "") {
            Resultlist.Data = $.grep(Resultlist.Data, function (info) {
                if ($("#ListNUM option:selected").data("EnumFormKind") == "BPA") {
                    return info.BpaNum == $("#ListNUM").val()
                }

                if ($("#ListNUM option:selected").data("EnumFormKind") == "PO") {
                    return info.PONum == $("#ListNUM").val()
                }
            })
        }

        if ($("#ReleaseNum").val() && $("#ReleaseNum").val() != "") {
            Resultlist.Data = $.grep(Resultlist.Data, function (info) {
                return info.ReleaseNum == $("#ReleaseNum").val()
            })
        }
        if ($("#VendorNum").val() && $("#VendorNum").val() != "") {
            Resultlist.Data = $.grep(Resultlist.Data, function (info) {
                return info.VendorNum == $("#VendorNum").val()
            })
        }

        if ($("#RTNum").val() && $("#RTNum").val() != "") {
            Resultlist.Data = $.grep(Resultlist.Data, function (info) {
                return info.ReceiptNum == $("#RTNum").val()
            })
        }
        //資料篩選

        //將資料放進結果表格
        $("#ResultArea table tbody").not("[Nodata]").remove();
        $("#ResultArea table tbody[Nodata]").show()
        $("#GenerateDetail").hide()
        $("#ExpandAllDetail").hide()

        if (Resultlist.Data != null && Resultlist.Data.length > 0) {
            ReceiptNum = "";

            PRDetailID = "";
            cancelRow = null;
            obj = null;
            $.each(Resultlist.Data, function (index, info) {
                if (ReceiptNum != info.ReceiptNum || PRDetailID != info.PRDetailID) {
                    if (cancelRow && obj != null) {
                        $(obj).find("tr[Rowtitle]").find("input[type=checkbox]").addClass("input-disable").prop("disabled", true)
                        $(obj).attr("title", "此筆收貨之採購資料已作廢，故無法執行退貨作業，如有疑問請洽管理處採購科")
                    }

                    ReceiptNum = info.ReceiptNum
                    PRDetailID = info.PRDetailID
                    obj = $("#CopyResultTbody").clone()
                    cancelRow = true;
                    obj.removeAttr("id");
                    obj.find("#CopyResultTR").remove();
                    obj.find("a").on("click", function () {
                        fun_SalesTaxCloumn(this)
                    })

                    obj.find("tr").eq(0).find("td").eq(1).text(info.VendorName)
                    obj.find("tr").eq(0).find("td").eq(2).text(info.CategoryName)
                    obj.find("tr").eq(0).find("td").eq(3).text(info.ItemDescription)
                    obj.find("tr").eq(0).find("td").eq(4).text(info.ReceiptNum)
                    obj.find("input[alt=RID]").val((info.RID))
                    obj.find("input[alt=InvoiceEmpName]").val((info.InvoiceEmpName))
                    obj.find("input[alt=InvoiceEmpNum]").val((info.InvoiceEmpNum))
                    obj.find("input[alt=UomCode]").val((info.UomCode))
                    obj.find("input[alt=extendedPrecision]").val((info.extendedPrecision))
                    obj.find("input[alt=RTTransactionDate]").val(info.RTTransactionDate)

                    if (info.PONum.length > 0) {
                        obj.find("tr").eq(0).find("td").eq(5).text(info.PONum)
                        obj.find("tr").eq(0).find("td").eq(6).find("div").eq(0).text("N/A")
                    }
                    else {
                        obj.find("tr").eq(0).find("td").eq(5).text(info.BpaNum)
                        obj.find("tr").eq(0).find("td").eq(6).find("div").eq(0).text(info.ReleaseNum)
                    }

                    $(obj).find("tr[Rowtitle]").find("input[type=checkbox]").on("click", function () {
                        $(this).closest("tbody").find("input[type=checkbox]").not(":disabled").prop("checked", $(this).prop("checked"))
                    })

                    $("#ResultArea table").append(obj)
                }

                objtr = $("#CopyResultTR").clone()
                objtr.removeAttr("id");
                objtr.find("td").eq(0).find("input[alt=RDetailID]").val(info.RDetailID)

                objtr.find("td").eq(1).text(fun_accountingformatNumberdelzero(info.Quantity))
                objtr.find("td").eq(2).text(info.UomName)
                objtr.find("td").eq(3).text(info.ChargeDeptName)
                objtr.find("td").eq(4).text(info.RcvDeptName)

                if (isNullOrEmpty(info.cancelDate)) {
                    cancelRow = false;
                    $(objtr).find("input[type=checkbox]").on("click", function () {
                        rtn = true;
                        $(this).closest("tbody").find("tr").not("[Rowtitle]").find("input[type=checkbox]").each(function () {
                            rtn = $(this).prop("checked");
                            if (!rtn) return false;
                        })
                        $(this).closest("tbody").find("tr[Rowtitle]").find("input[type=checkbox]").prop("checked", rtn);
                    })
                }
                else {
                    $(objtr).find("input[type=checkbox]").addClass("input-disable").prop("disabled", true)
                    $(objtr).attr("title", "此筆收貨之採購資料已作廢，故無法執行退貨作業，如有疑問請洽管理處採購科")
                }

                $("#ResultArea table").find("tbody").last().append(objtr)
            })

            if (cancelRow && obj != null) {
                $(obj).find("tr[Rowtitle]").find("input[type=checkbox]").addClass("input-disable").prop("disabled", true)
                $(obj).attr("title", "此筆收貨之採購資料已作廢，故無法執行退貨作業，如有疑問請洽管理處採購科")
            }

            $("#ResultArea table tbody[Nodata]").hide()
            $("#GenerateDetail").show()
            $("#ExpandAllDetail").show()
        }

        $("#ResultArea").show(200);
        //將資料放進結果表格
    })

    $("#ListNUM").on("change", function () {
        $("#ReleaseNum").empty();
        if ($(this).find("option:selected").data("EnumFormKind") == "BPA") {
            /*$("#ReleaseNum option").each(function () {
                if ($(this).data("BpaNum") == $("#ListNUM").val()) {
                    $(this).show()
                }
                else {
                    $(this).hide()
                }
            })*/
            $.each(ReleaseNumArray[$(this).val()], function () {
                if ($("#ReleaseNum option[value='" + this + "']").length == 0) {
                    $("#ReleaseNum").append($("<option></option>").attr("value", this).text(this))
                }
            })

            $("#ReleaseNum").prop('disabled', false).selectpicker('setStyle', 'input-disable', 'remove').selectpicker("refresh");
        }
        else {
            $("#ReleaseNum").val("")
            $("#ReleaseNum").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add').selectpicker("refresh");
        }
    })

    $("#GenerateDetail").find("a").on("click", function () {
        detailList = document.createElement("table")

        ListNum = "";
        ReleaseNum = "";
        InvoiceEmpName = "";
        InvoiceEmpNum = "";
        VendorName = "";
        UomName = "";
        CategoryName = "";
        ItemDescription = "";
        RTNum = "";
        rtn = true;
        RTTransactionDate = ""
        RID = "";

        $("#ResultArea table tbody").not("[Nodata]").find("tr").not("[Rowtitle]").find("input[type=checkbox]:checked").each(function (i, o) {
            if (i == 0) {
                VendorName = $(this).closest("tbody").find("td").eq(1).text()
                ListNum = $(this).closest("tbody").find("td").eq(5).text()
                ReleaseNum = $(this).closest("tbody").find("td").eq(6).text()
                InvoiceEmpName = $(this).closest("tbody").find("input[alt=InvoiceEmpName]").val()
                InvoiceEmpNum = $(this).closest("tbody").find("input[alt=InvoiceEmpNum]").val()
                RTNum = $(this).closest("tbody").find("td").eq(4).text()
                RTTransactionDate = $(this).closest("tbody").find("input[alt=RTTransactionDate]").val()
                extendedPrecision = $(this).closest("tbody").find("input[alt=extendedPrecision]").val()//退貨單的幣別一致
                RID = $(this).closest("tbody").find("input[alt=RID]").val()
                $("#sentdropbox").empty();
                $("#sentdropbox").append($("<option></option>").attr("value", InvoiceEmpNum).text(InvoiceEmpName + "(" + InvoiceEmpNum + ")")).selectpicker("refresh")
            }
            else {
                if (RID != $(this).closest("tbody").find("input[alt=RID]").val()) {
                    $("#AlertMessage").text("退貨資料不屬同一張收貨驗收單，請重新選取");
                    window.location.href = "#modal-added-info-2"
                    rtn = false;
                    return false;
                }
            }
            obj = $("#CopyDetailtbody").clone()
            obj.attr("alt", "Detailtbody").removeAttr("id")
            obj.find("input[alt=RDetailID]").val($(this).closest("tr").find("input[alt=RDetailID]").val())
            obj.find("input[alt=Quantity]").attr("Max", accounting.unformat($(this).closest("tr").find("td").eq(1).text()))
            obj.find("input[alt=Quantity]").on("focus", function () {
                fun_onfocusAction(this)
            })
            obj.find("input[alt=Quantity]").on("blur", function () {
                fun_onblurAction(this)
            })

            obj.find("td").eq(0).text(funAddheadZero(1, i + 1))
            obj.find("td").eq(2).text($(this).closest("tr").find("td").eq(1).text())

            obj.find("td").eq(3).text($(this).closest("tr").find("td").eq(2).text())
            obj.find("td").eq(4).text($(this).closest("tr").find("td").eq(3).text())
            obj.find("td").eq(5).text($(this).closest("tr").find("td").eq(4).text())

            obj.find("td").eq(6).text($(this).closest("tbody").find("td").eq(2).text())
            obj.find("td").eq(7).find("span").text($(this).closest("tbody").find("td").eq(3).text())

            if ($(this).closest("tbody").find("[alt=UomCode]").val() == "AMT") {
                obj.find("[alt=Quantity]").attr("Accuracy", extendedPrecision)
            }

            $(obj).mouseenter(function () {
                $(this).find("[alt=removebtn]").show();
            })
            $(obj).mouseleave(function () {
                $(this).find("[alt=removebtn]").hide();
            })

            $(obj).find("[alt=removebtn]").on("click", function () {
                if (confirm("是否確認刪除該筆資料")) {
                    $(this).closest("tbody").remove();

                    if ($("#DetailTable tbody").not("[alt=deleted]").length == 0) {
                        $("#DetailArea").hide(200);
                    }
                    else {
                        fun_resetCellIndex($("#DetailTable"), "Index", 1)
                    }
                }
            })

            $(detailList).append(obj)
        })

        if (rtn) {
            if ($("#ResultArea table tbody").not("[Nodata]").find("tr").not("[Rowtitle]").find("input[type=checkbox]:checked").length > 0) {
                rtn = true;
                if ($("#DetailTable tbody").find("tr").length > 0) {
                    rtn = confirm("重新載入會將退貨明細清空，是否確認修改")
                }
                if (rtn) {
                    $("#DetailTable tbody[alt=Detailtbody]").remove()
                    $("#DetailTable tbody").not("[alt=Detailtbody]").each(function () {
                        $(this).attr("alt", "deleted")
                        $(this).find("[alt=IsDelete]").val(true)
                        $(this).find("[alt=Quantity]").removeAttr("necessary", "")
                        $(this).find("[alt=Index]").attr("alt", "deleted")

                        $(this).hide()
                    })

                    $("#_ListNUM").text(ListNum);
                    $("#_ReleaseNum").text(ReleaseNum);
                    $("#_InvoiceEmpName").text(InvoiceEmpName + "(" + InvoiceEmpNum + ")");
                    $("#InvoiceEmpNum").val(InvoiceEmpNum);
                    $("#InvoiceEmpName").val(InvoiceEmpName);
                    $("#RID").val(RID);
                    $("#_RTNum").text(RTNum);
                    $("#_VendorName").text(VendorName);
                    $("#DetailTable").append($(detailList).find("tbody"))

                    $("#divTransactionDate").data("DateTimePicker").minDate(RTTransactionDate).maxDate(new Date())
                    date = new Date();
                    today = date.getFullYear() + "-" + funAddheadZero(2, date.getMonth() + 1) + "-" + funAddheadZero(2, date.getDate())
                    $("#TransactionDate").val(today)

                    $("#DetailArea").show(200)
                }
                $("#ResultArea").hide(200)
            }
            else {
                $("#AlertMessage").text("請選擇帶入的明細");
                window.location.href = "#modal-added-info-2"
            }
        }
    });

    $("a[alt=Addperson]").on("click", function () {
        //限縮發票人員在總經理室 限縮該單位的MBR、OMG、MGR
        orgpickUser({
            RootUnitSeq: "0011", outputfunction: "QueryTempForVendor", allowRole: ["MBR", "OMG", "MGR"]
        })
    })

    $("td[Amount]").each(function (i, o) {
        $(o).text(fun_accountingformatNumberdelzero($(o).text()))
    })
})

function QueryTempForVendor(datas) {
    $("#sentdropbox").empty();
    if (datas.length > 0) {
        $("#InvoiceEmpNum").val(datas[0].user_id)
        $("#InvoiceEmpName").val(datas[0].user_name)
        $("#_InvoiceEmpName").text(datas[0].user_name + "(" + datas[0].user_id + ")")

        $("#sentdropbox").append($("<option></option>").attr("value", datas[0].user_id).text(datas[0].user_name + "(" + datas[0].user_id + ")"))
    }
    $("#sentdropbox").selectpicker("refresh")
}

function GetRTRList(RTRNum, employeeNumber, startDate, endDate) {
    $("#ListNUM").empty()
    $("#ReleaseNum").empty().prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add');
    $("#VendorNum").empty()
    $("#RTNum").empty()

    $.ajax({
        url: '/RTR/GetRTRList',
        dataType: 'json',
        type: 'POST',
        async: false,
        data: { RTRNum: RTRNum, employeeNumber: employeeNumber, startDate: startDate, endDate: endDate },
        success: function (data, textStatus, jqXHR) {
            if (data.length > 0) {
                $.each(data, function (index, info) {
                    //若有明細資料需將數量加回
                    /*  $.each(Global.get("DBValue"), function (i, DBValueinfo) {
                          if (DBValueinfo.RDetailID == info.RDetailID) {
                              info.Quantity += parseFloat(DBValueinfo.Quantity)
                          }
                      })*/

                    if (info.Quantity <= 0) return true

                    if (info.PONum.length > 0) {
                        if ($("#ListNUM option[value='" + info.PONum + "']").length == 0) {
                            $("#ListNUM").append($("<option></option>").attr("value", info.PONum).text(info.PONum).data("EnumFormKind", "PO"))
                        }
                    }
                    if (info.BpaNum.length > 0) {
                        if ($("#ListNUM option[value='" + info.BpaNum + "']").length == 0) {
                            $("#ListNUM").append($("<option></option>").attr("value", info.BpaNum).text(info.BpaNum).data("EnumFormKind", "BPA"))
                            ReleaseNumArray[info.BpaNum] = Array();
                        }

                        // $("#ReleaseNum").append($("<option></option>").attr("value", info.ReleaseNum).text(info.ReleaseNum).data("BpaNum", info.BpaNum))
                        ReleaseNumArray[info.BpaNum].push(info.ReleaseNum)
                    }

                    if ($("#VendorNum option[value='" + info.VendorNum + "']").length == 0) {
                        $("#VendorNum").append($("<option></option>").attr("data-subtext", info.VendorNum).attr("value", info.VendorNum).text(info.VendorName))
                    }

                    if ($("#RTNum option[value='" + info.ReceiptNum + "']").length == 0) {
                        $("#RTNum").append($("<option></option>").attr("value", info.ReceiptNum).text(info.ReceiptNum))
                    }
                })

                data = $.grep(data, function (info) {
                    return info.Quantity > 0
                })

                Global.set("ResultData", data)

                if (data.length == 0) {
                    alert("查無可退貨資訊")
                }
            }
            else {
                Global.delete("ResultData")
                alert("查無可退貨資訊")
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Global.delete("ResultData")
            alert("取得可退貨資訊失敗")
        }
    });

    $("#ListNUM").selectpicker("refresh");
    $("#VendorNum").selectpicker("refresh");
    $("#RTNum").selectpicker("refresh");
}

function fun_SalesTaxAllCloumn(target) {
    if ($(target).children("div").attr("class") == "toggleIcon toggleArrow list-open-icon") {
        $(target).closest("thead").nextAll("tbody").children("tr").not("[Rowtitle]").each(function () {
            $(this).show(200);
        })

        $(target).closest("table").find("div[arrowicon]").addClass("togglyphicon  toggleArrow glyphicon-chevron-up").attr("title", "全部展開")
        $(target).closest("table").find("div[arrowicon]").removeClass("tglyphicon glyphicon-chevron-down  toggleArrow")

        $(target).children("div").addClass("toggleIcon toggleArrow list-close-icon")
        $(target).children("div").removeClass("toggleIcon toggleArrow list-open-icon")
    }
    else {
        $(target).closest("thead").nextAll("tbody").children("tr").not("[Rowtitle]").each(function () {
            $(this).hide(200);
        })
        $(target).closest("table").find("div[arrowicon]").removeClass("togglyphicon  toggleArrow glyphicon-chevron-up")
        $(target).closest("table").find("div[arrowicon]").addClass("tglyphicon glyphicon-chevron-down  toggleArrow").attr("title", "全部收合")

        $(target).children("div").removeClass("toggleIcon toggleArrow list-close-icon")
        $(target).children("div").addClass("toggleIcon toggleArrow list-open-icon")
    }
}
function fun_SalesTaxCloumn(target) {
    $(target).closest("tbody").find("tr").not("[Rowtitle]").each(function () {
        fun_controlShow($(this))
    })

    $(target).children("div").toggleClass("tglyphicon glyphicon-chevron-down  toggleArrow")
    $(target).children("div").toggleClass("togglyphicon  toggleArrow glyphicon-chevron-up")
}

function GetPageCustomizedList(stepSequence) {
    if ($("#InvoiceEmpNum").val() == "") {
        return { SignedID: [], SignedName: [] }
    }
    else {
        console.log({ SignedID: $("#InvoiceEmpNum").val(), SignedName: $("#InvoiceEmpName").val() })

        return { SignedID: [$("#InvoiceEmpNum").val()], SignedName: [$("#InvoiceEmpName").val()] }
    }
}

//公用副程式
{
    //控建顯示隱藏的動畫速度
    function fun_controlShow(target) {
        $(target).toggle(200);
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
        if ($(target).val() == "") return true

        Accuracy = $(target).attr("Accuracy")
        Max = $(target).attr("Max")

        if (isNaN(Accuracy)) {
            Accuracy = 0;
        }
        else {
            if (Accuracy > 4) Accuracy = 4;//小數點最大四位
        }

        if (accounting.unformat($(target).val()) == 0 && $(target).attr("Amount") != "Zero") {
            fun_AddErrMesg(target, "ErrAmount", "請輸入大於0的數字")
            return false;
        }

        if (regNum(accounting.unformat($(target).val()), (Accuracy > 0))) {
            if ($(target).val().indexOf(".") > 0) {
                if (($(target).val().length - ($(target).val().indexOf(".") + 1)) > Accuracy) {
                    fun_AddErrMesg(target, "ErrAmount", "小數點長度錯誤，最多" + Accuracy + "碼")

                    return false;
                }
            }

            if (!isNaN(parseFloat(Max))) {
                if ($(target).val() > parseFloat(Max)) {
                    fun_AddErrMesg(target, "ErrAmount", "不得大於收貨數量")
                    return false;
                }
            }

            $(target).val(fun_accountingformatNumberdelzero($(target).val()))
            return true;
        }
        else {
            fun_AddErrMesg(target, "ErrAmount", "數字輸入錯誤")
            return false;
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
            // target.setcRange(start, end);
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

    //數字驗證 *正值 不得為0
    function regNum(target, hasfloat) {
        if (hasfloat) {
            reg = /^(([0-9]\.[0-9]*)|([1-9][0-9]*\.[0-9]*)|([1-9]\d*))$/
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