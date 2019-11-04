var ResultData = { Data: [] }
var ReleaseNumArray = Array();

//暫存
function draft() {
    $("input[Amount]").each(function () {
        $(this).val(accounting.unformat($(this).val()))
    })

    let i = 0;
    $("#DetailTable tbody").each(function () {
        $(this).find("input").each(function () {
            $(this).attr("name", "RTDetailList[" + i + "]." + $(this).attr("alt"))
        })
        i += 1;
    })
    /* $(this)._ajax("/RT/Edit", $("form").serialize(), function (data) {
         var rtn = {
             true: ""
         }
         _formInfo.formGuid = data.FormGuid
         _formInfo.formNum = data.FormNum
         _formInfo.flag = data.Flag
         return rtn
     }, "傳送發生錯誤", true, false, 0)*/
    // $("#MainForm").attr("action", "/RT/Edit").submit()
    blockPageForJBPMSend()
    return $.ajax({
        url: '/RT/Edit',
        type: 'POST',
        data: $("form").serialize(),
        //async: false,
        success: function (data, textStatus, jqXHR) {
            // window.location.href = '/PR/Edit/' + data;
            _formInfo.formGuid = data.info.FormGuid
            _formInfo.formNum = data.info.FormNum
            _formInfo.flag = data.info.Flag
            $("#FormTypeName").val("收貨驗收單")
            $("#ApplyItem").val("供應商-" + data.VendorName)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("暫存失敗 " + textStatus)
        }
    })
}

//驗證
function Verify() {
    let draftAjax = $.Deferred()

    setTimeout(function () {
        let rtn = true;

        if ($("#P_CurrentStep").val() == 1) {
            if ($("[name=send-id]").val() == $("#LoginEno").val()) {
                alert("收貨人與驗收人不能相同")
                rtn = false;
            }
        }

        if ($("#DetailTable tbody").not("[alt=deleted]").length == 0) {
            alert("請輸入收貨資訊")
            rtn = false;
        }

        $("[necessary]").each(function () {
            if ($(this).val().trim().length < 1) {
                fun_AddErrMesg($(this), "Err" + $(this).attr("id"), "此為必填欄位")
                rtn = false;
            }
        })

        if (rtn) {
            let Errmsg = "";
            $("#DetailTable tbody").not("[alt=deleted]").each(function (i, o) {
                let type = "PO";
                let DID = $(this).find("input[alt=PODeliveryID]").val()
                let JBPM = $("#JBPM").val()
                let AccountReceivable = 0;
                let DBValue = parseFloat($(this).find("input[alt=Quantity]").attr("DBValue"));//收貨單收貨層數量 *同筆資料需補回
                if ($(this).find("input[alt=YADeliveryID]").val() > 0) {
                    type = "YA";
                    DID = $(this).find("input[alt=YADeliveryID]").val()
                }

                $(this)._ajax("/RT/GetRTAccountReceivable", { Type: type, DID: DID }, function (data) {
                    ajaxrtn = {
                        true: ""
                    }
                    AccountReceivable = data
                    return ajaxrtn
                }, "取得可收貨數失敗", true, false, 0)

                if ($(this).attr("alt") != "CopyDetailtbody" && !isNaN(DBValue)) {
                    AccountReceivable = accounting.toFixed(AccountReceivable + DBValue, 4)
                }
                $(this).find("input[alt=Quantity]").attr("Max", AccountReceivable)
                $(this).find("td").eq(2).text(fun_accountingformatNumberdelzero(AccountReceivable))

                if (AccountReceivable <= 0) {
                    Errmsg = (Errmsg == "") ? "項次" + (i + 1) + "可收貨數量為0" : Errmsg + "<br/>" + "項次" + (i + 1) + "可收貨數量為0"
                    rtn = false
                }
                else {
                    if (!fun_onblurAction($(this).find("input[alt=Quantity]"))) {
                        rtn = false
                    }
                }
            })
            if (Errmsg != "") {
                $("#AlertMessage").html(Errmsg);
                window.location.href = "#modal-added-info-2"
            }
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
            $(this).attr("name", "RTDetailList[" + i + "]." + $(this).attr("alt"))
        })
        i += 1;
    })

    /* $(this)._ajax("/RT/Save", $("form").serialize(), function (data) {
         var rtn = {
             true: ""
         }
         _formInfo.formGuid = data.FormGuid
         _formInfo.formNum = data.FormNum
         _formInfo.flag = data.Flag
         return rtn
     }, "傳送發生錯誤", true, false, 0)*/

    return $.ajax({
        url: '/RT/Save',

        type: 'POST',
        data: $("form").serialize(),

        //async: false,
        success: function (data, textStatus, jqXHR) {
            // window.location.href = '/PR/Edit/' + data;
            _formInfo.formGuid = data.info.FormGuid
            _formInfo.formNum = data.info.FormNum
            _formInfo.flag = data.info.Flag
            $("#FormTypeName").val("收貨驗收單")
            $("#ApplyItem").val("供應商-"+data.VendorName)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("存檔失敗 " + textStatus)
        }
    })
}

$(function () {
    if ($("#P_Status").val() != 2) {
        $("#__FiisStates").hide()
    }

    $("input").on("focus", function () {
        $(this).nextAll("[Errmsg=Y]").remove();
    })

    ///改為後端判斷
    /*  let _ApplicantDepId;
      let _ApplicantDepIdList = $.map(_unitData, function (o) {
          // 6為分行人員
          if (o.unit_level == 6) {
              return o.unit_id
          }
      })
      if (_ApplicantDepIdList.length > 0) {
          _ApplicantDepId = _ApplicantDepIdList[0]
      }
      else {
          _ApplicantDepIdList=  $.map(_unitData, function (o) {
              // 非分行人員從處級往上找
              if (o.unit_level <=4) {
                  return o.unit_id
              }
          })

          _ApplicantDepId = _ApplicantDepIdList[_ApplicantDepIdList.length-1]
      }*/

    let ApplicantEmpNum = $("[name=ApplicantEmpNum]").val()

    $("#DetailTable tbody").each(function () {
        if ($(this).find("[alt=UomCode]").val() != "AMT") {
            $(this).find("[alt=Quantity]").removeAttr("Accuracy")
        }
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
                $(this).closest("tbody").find("[alt=isDeleted]").val(true)
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

        RateDate = $("#_RateDate").text();
        $(".datetimepicker1").data("DateTimePicker").minDate(RateDate).maxDate(new Date())
    }

    $("#ResultArea")._ajax("/RT/GetFisaEmployee", { RTNum: $("#ReceiptNum").val(), employeeNumber: ApplicantEmpNum },
        function (data) {
            var rtn = {
                true: ""
            }
            ResultData.Data = data;

            return rtn
        }

    , "取得收貨清單發生錯誤");

    $("#ReleaseNum").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add');
    $("#ResultArea").find("a").on("click", function () {
        fun_SalesTaxAllCloumn(this)
    });

    if (ResultData.Data.length != null && ResultData.Data.length != 0) {
        $.each(ResultData.Data, function (index, info) {
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
        })
    }
    else {
        if (isNullOrEmpty($("#ReceiptNum").val())) {

            $("#AlertMessage").text("無可供收貨之採購/核發單號");
            window.location.href = "#modal-added-info-2"
        }
        $("#SearchBtn").hide();
    }

    $("#CleanBtn").on("click", function () {
        $("#ResultArea").hide(200);
        $("#SearchArea").find("input").val("")
        $("#ReleaseNum").prop('disabled', true).selectpicker('setStyle', 'input-disable', 'add');
        $("#SearchArea").find("select").val("").selectpicker("refresh")
    })

    //搜尋動作
    $("#SearchBtn").on("click", function () {
        if ($("#ListNUM option:selected").data("EnumFormKind") == "BPA" && $("#ReleaseNum")[0].selectedIndex == 0) {
            $("#AlertMessage").text("當所選單號為年度議價協議時，需選擇核發次數");
            window.location.href = "#modal-added-info-2"
            $("#ResultArea").hide(200);
            return false
        }
        Resultlist = null
        Resultlist = $.extend(true, {}, ResultData)

        //資料篩選
        if ($("#ListNUM").val() != "") {
            Resultlist.Data = $.grep(Resultlist.Data, function (info) {
                if ($("#ListNUM option:selected").data("EnumFormKind") == "BPA") {
                    return info.BpaNum == $("#ListNUM").val()
                }

                if ($("#ListNUM option:selected").data("EnumFormKind") == "PO") {
                    return info.PONum == $("#ListNUM").val()
                }
            })
        }
        if ($("#ReleaseNum").val() != "") {
            Resultlist.Data = $.grep(Resultlist.Data, function (info) {
                return info.ReleaseNum == $("#ReleaseNum").val()
            })
        }
        if ($("#VendorNum").val() != "") {
            Resultlist.Data = $.grep(Resultlist.Data, function (info) {
                return info.VendorNum == $("#VendorNum").val()
            })
        }

        if ($("#ItemDescription").val() != "") {
            Resultlist.Data = $.grep(Resultlist.Data, function (info) {
                return info.ItemDescription.indexOf($("#ItemDescription").val()) > -1
            })
        }
        //資料篩選

        //將資料放進結果表格
        $("#ResultArea table tbody").not("[Nodata]").remove();
        $("#ResultArea table tbody[Nodata]").show()
        $("#GenerateDetail").hide()
        $("#ExpandAllDetail").hide()

        if (Resultlist.Data.length > 0) {
            PONum = "";
            BpaNum = "";
            ReleaseNum = "";
            ItemDescription = "";
            PRNum = "";
            $.each(Resultlist.Data, function (index, info) {
                if (PRNum !=info.PRNum || PONum != info.PONum || BpaNum != info.BpaNum || ReleaseNum != info.ReleaseNum || ItemDescription != info.ItemDescription) {
                    PONum = info.PONum
                    BpaNum = info.BpaNum
                    ReleaseNum = info.ReleaseNum
                    ItemDescription = info.ItemDescription
                    PRNum = info.PRNum
                    obj = $("#CopyResultTbody").clone()
                    obj.find("#CopyResultTR").remove();
                    obj.find("a").on("click", function () {
                        fun_SalesTaxCloumn(this)
                    })

                    obj.find("tr").eq(0).find("td").eq(1).text(info.VendorName)
                    obj.find("tr").eq(0).find("td").eq(2).text(info.CategoryName)
                    obj.find("tr").eq(0).find("td").eq(3).text(info.ItemDescription)
                    obj.find("tr").eq(0).find("td").eq(4).text(info.PRNum)
                    obj.find("[alt=RateDate]").val((info.strRateDate))
                    if (info.PONum.length > 0) {
                        obj.find("tr").eq(0).find("td").eq(5).text(info.PONum)
                        obj.find("tr").eq(0).find("td").eq(6).find("div").eq(0).text("N/A")
                    }
                    else {
                        obj.find("tr").eq(0).find("td").eq(5).text(info.BpaNum)
                        obj.find("tr").eq(0).find("td").eq(6).find("div").eq(0).text(info.ReleaseNum)
                    }

                    $(obj).find("tr[Rowtitle]").find("input[type=checkbox]").on("click", function () {
                        $(this).closest("tbody").find("input[type=checkbox]").prop("checked", $(this).prop("checked"))
                    })

                    $("#ResultArea table").append(obj)
                }

                objtr = $("#CopyResultTR").clone()
                objtr.find("td").eq(0).find("[alt=PODeliveryID]").val(info.PODeliveryID)
                objtr.find("td").eq(0).find("[alt=YADeliveryID]").val(info.YADeliveryID)
                objtr.find("td").eq(0).find("[alt=UomCode]").val(info.UomCode)
                objtr.find("td").eq(0).find("[alt=InvoiceEmpNum]").val(info.InvoiceEmpNum)
                objtr.find("td").eq(0).find("[alt=InvoiceEmpName]").val(info.InvoiceEmpName)
                objtr.find("td").eq(0).find("[alt=extendedPrecision]").val(info.extendedPrecision)

                objtr.find("td").eq(1).text(fun_accountingformatNumberdelzero(info.AccountReceivable))
                objtr.find("td").eq(2).text(info.UomName)
                objtr.find("td").eq(3).text(info.ChargeDeptName)
                objtr.find("td").eq(4).text(info.RcvDeptName)

                $(objtr).find("input[type=checkbox]").on("click", function () {
                    rtn = true;
                    $(this).closest("tbody").find("tr").not("[Rowtitle]").find("input[type=checkbox]").each(function () {
                        rtn = $(this).prop("checked");
                        if (!rtn) return false;
                    })
                    $(this).closest("tbody").find("tr[Rowtitle]").find("input[type=checkbox]").prop("checked", rtn);
                })

                $("#ResultArea table").find("tbody").last().append(objtr)
            })

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

    //明細帶入
    $("#GenerateDetail").find("a").on("click", function () {
        $("[errmsg]").remove()
        i = 0;
        detailList = document.createElement("table")

        ListNum = "";
        ReleaseNum = "";
        RateDate = "";
        VendorName = "";
        PRNUM = "";
        InvoiceEmpNum = "";
        InvoiceEmpName = "";
        rtn = true;

        $("#ResultArea table tbody").not("[Nodata]").find("tr").not("[Rowtitle]").find("input[type=checkbox]").each(function () {
            if ($(this).prop("checked")) {
                if (i == 0) {
                    VendorName = $(this).closest("tbody").find("td").eq(1).text()
                    ListNum = $(this).closest("tbody").find("td").eq(5).text()
                    ReleaseNum = $(this).closest("tbody").find("td").eq(6).text()
                    RateDate = $(this).closest("tbody").find("[alt=RateDate]").val()
                    InvoiceEmpNum = $(this).closest("tbody").find("[alt=InvoiceEmpNum]").val()
                    InvoiceEmpName = $(this).closest("tbody").find("[alt=InvoiceEmpName]").val()
                    extendedPrecision = $(this).closest("tbody").find("[alt=extendedPrecision]").val()//採購或核發的幣別為單一
                }
                else {
                    if (ListNum != $(this).closest("tbody").find("td").eq(5).text() || ReleaseNum != $(this).closest("tbody").find("td").eq(6).text()) {
                        $("#AlertMessage").text("收貨資料不屬同一張採購單或協議核發單，請重新選取");
                        window.location.href = "#modal-added-info-2"
                        rtn = false;
                        return false;
                    }
                }
                i++;

                obj = $("[alt=CopyDetailtbody]").clone()
                obj.attr("alt", "Detailtbody")
                obj.find("input[Amount]").val(accounting.unformat($(this).closest("tr").find("td").eq(1).text())).attr("Max", accounting.unformat($(this).closest("tr").find("td").eq(1).text()))
                obj.find("input[Amount]").on("focus", function () {
                    fun_onfocusAction(this)
                })
                obj.find("input[Amount]").on("blur", function () {
                    fun_onblurAction(this)
                })

                if ($(this).closest("tr").find("[alt=UomCode]").val() == "AMT") {
                    obj.find("[alt=Quantity]").attr("Accuracy", extendedPrecision)
                }

                obj.find("td").eq(0).text(funAddheadZero(1, i))

                obj.find("td").eq(2).text($(this).closest("tr").find("td").eq(1).text())

                obj.find("td").eq(3).text($(this).closest("tr").find("td").eq(2).text())
                obj.find("td").eq(4).text($(this).closest("tr").find("td").eq(3).text())
                obj.find("td").eq(5).text($(this).closest("tr").find("td").eq(4).text())

                obj.find("td").eq(6).text($(this).closest("tbody").find("td").eq(2).text())
                obj.find("td").eq(7).text($(this).closest("tbody").find("td").eq(3).text())
                obj.find("td").eq(8).text($(this).closest("tbody").find("td").eq(4).text())
                obj.find("td").eq(8).append("<div class='icon-remove-size' style='display:none' alt='removebtn' title='刪除欄位'><a class='icon-cross'></a></div>")

                obj.find("input[alt=Quantity]").attr("necessary", "")
                obj.find("input[alt=PODeliveryID]").val($(this).closest("tr").find("[alt=PODeliveryID]").val())
                obj.find("input[alt=YADeliveryID]").val($(this).closest("tr").find("[alt=YADeliveryID]").val())
                obj.find("input[alt=isDeleted]").val(false)

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
            }
        })

        if (rtn) {
            if (i > 0) {
                rtn = true;
                if ($("#DetailTable tbody").not("[alt=deleted]").length > 0) {
                    rtn = confirm("重新載入會將收貨明細清空，是否確認修改")
                }
                if (rtn) {
                    $("#DetailTable tbody[alt=Detailtbody]").remove()
                    $("#DetailTable tbody").not("[alt=Detailtbody]").each(function () {
                        $(this).attr("alt", "deleted")
                        $(this).find("[alt=isDeleted]").val(true)
                        $(this).find("[alt=Quantity]").removeAttr("necessary", "")
                        $(this).find("[alt=Index]").attr("alt", "deleted")

                        $(this).hide()
                    })

                    $("#_ListNUM").text(ListNum);
                    $("#_ReleaseNum").text(ReleaseNum);
                    $("#_RateDate").text(RateDate);
                    $("#_VendorName").text(VendorName);
                    $("#InvoiceEmpNum").val(InvoiceEmpNum);
                    $("#InvoiceEmpName").val(InvoiceEmpName);
                    $("#_InvoiceEmp").text(InvoiceEmpName + "(" + InvoiceEmpNum + ")");
                    $("#DetailTable").append($(detailList).find("tbody"))

                    $(".datetimepicker1").data("DateTimePicker").minDate(RateDate).maxDate(new Date())
                    date = new Date();
                    today = date.getFullYear() + "-" + funAddheadZero(2, date.getMonth() + 1) + "-" + funAddheadZero(2, date.getDate())
                    $("#TransactionDate").val(today)
                    // $("#TransactionDate").val(moment().format("L"))
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
//人員選擇器ACTION
function QueryTempForVendor(datas) {
    var context = "";

    if (datas.length > 0) {
        var context = datas[0].user_name.replace(/\d+/, "").replace(/\s+/, "") + "(" + datas[0].user_id + ")";
        $("#InvoiceEmpNum").val(datas[0].user_id)
        $("#InvoiceEmpName").val(datas[0].user_name)
        $("#_InvoiceEmp").text(datas[0].user_name + "(" + datas[0].user_id + ")")
    }
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

        let Accuracy = $(target).attr("Accuracy")
        let Max = $(target).attr("Max")
        let _targetVal = accounting.unformat($(target).val())

        if (isNaN(Accuracy)) {
            Accuracy = 0;
        }
        else {
            if (Accuracy > 4) Accuracy = 4;//小數點最大四位
        }

        if (_targetVal == 0 && $(target).attr("Amount") != "Zero") {
            fun_AddErrMesg(target, "ErrAmount", "請輸入大於0的數字")
            return false;
        }

        if (regNum(_targetVal, (Accuracy > 0))) {
            if (String(_targetVal).indexOf(".") > 0) {
                if (String(_targetVal).length - (String(_targetVal).indexOf(".") + 1) > Accuracy) {
                    fun_AddErrMesg(target, "ErrAmount", "小數點長度錯誤，最多" + Accuracy + "碼")

                    return false;
                }
            }

            if (!isNaN(parseFloat(Max))) {
                if (_targetVal > parseFloat(Max)) {
                    fun_AddErrMesg(target, "ErrAmount", "不得大於待收數量")
                    return false;
                }
            }

            $(target).val(fun_accountingformatNumberdelzero(_targetVal))
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

    //ajax pluging
    (function ($) {
        var _ajaxdefaults;

        function ErrMessage(errMesg, errStates, xhr, ajaxOptions, thrownError) {
            if (errStates && xhr != null && thrownError != null) {
                alert(errMesg + "：" + xhr.status + "  " + thrownError);
            }
            else {
                alert(errMesg);
            }
        }

        function fun_ajax(URL, Data, seccessfun, option) {
            var _ajaxOption = $.extend(_ajaxdefaults, option);// extend 屬性合併，後蓋前

            ajaxErrorCount = 0;
            ajaxrtn = false;

            xhr = null;
            ajaxOptions = null;
            thrownError = null;

            do {
                $.ajax({
                    url: URL,   //存取Json的網址
                    type: "POST",
                    cache: false,
                    dataType: 'json',
                    async: _ajaxOption.async,
                    timeout: 5000,
                    data: Data,
                    success: function (data) {
                        ajaxrtn = true;

                        var rtn = seccessfun(data);

                        if (rtn != null) {
                            $.each(rtn, function (key, Message) {
                                if (key == "true") {
                                    ajaxrtn = true;
                                }
                                else {
                                    ajaxrtn = false
                                    ajaxErrorCount += 1;
                                }

                                _ajaxOption.Message = Message;
                            })
                        }
                    },

                    error: function (_xhr, _ajaxOptions, _thrownError) {
                        ajaxErrorCount += 1;
                        ajaxrtn = false;
                        xhr = _xhr
                        ajaxOptions = _ajaxOptions
                        thrownError = _thrownError
                    }
                })
            } while (!ajaxrtn && ajaxErrorCount < _ajaxOption.retryCount)

            if (!ajaxrtn) {
                _ajaxOption.errfun(_ajaxOption.Message, _ajaxOption.errStates, xhr, ajaxOptions, thrownError);

                return false
            }
            else {
                return _ajaxOption.Message
            }
        }

        $.fn.extend({
            _ajax: function (URL, Data, seccessfun, errMesg, errStates, async, retryCount, errfun) {
                _ajaxdefaults = {
                    async: false,
                    Message: "ajax異常",
                    retryCount: 3,
                    errfun: ErrMessage,
                    errStates: true
                };

                return this.each(function () {//回傳物件，讓方法可以串接
                    var option = {
                        "async": async, "errfun": errfun, "retryCount": retryCount, "Message": errMesg, "errStates": errStates
                    }

                    fun_ajax(URL, Data, seccessfun, option);
                })
            }
        });
    })(jQuery);
}