function ExportReport() {
    window.location.href = "/PR/Report/" + $("#PRNum").val();
}

function OverrideOrgPickerSetting(step) {
    /// <summary>提供cbp-SendSetting.js針對「傳送其他主管同仁」按鈕做最後OrgPicker更改機會</summary>
    /// <param name="step" type="number">目前關卡數</param>
    //  第一關傳其他只能傳送採購經辦群組， 第二關傳其他只能傳送採購覆核群組:
    P_CustomFlowKey = $('#P_CustomFlowKey').val();
    if (P_CustomFlowKey.indexOf("PR_P2") > -1) {
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

function Verify() {
    // return true
    let draftAjax = $.Deferred()

    draftAjax.resolve()

    return draftAjax.promise();
}

//傳送
function Save() {
    _formInfo.formGuid = $("#PRID").val()
    _formInfo.formNum = $("#PRNum").val()
    _formInfo.flag = true
   
    let draftAjax = $.Deferred()

    //draftAjax.resolve();
    $.when(CreditBudgetSave(_formInfo.formGuid)).always(function (data) {
        if (data.Status) {
            draftAjax.resolve();
        } else {
            _formInfo.flag = false
            alert("信用卡處預算回寫失敗")
            draftAjax.reject();
        }
    }
                 )

    return draftAjax.promise();
}

$(function () {
    // ----------------
    $("#__CustomFlowKey").val($('#P_CustomFlowKey').val())
    $("#__CurrentStep").val($("#P_CurrentStep").val())
    // ----------------
    $("#FormTypeName").val("一般請購單")
    $("#ApplyItem").val("請購主旨-" + $("#Subject").text())

    if ($("div#Encryption").length > 0) {
        $("#fileSection").hide()
        $("#SpeechSection").hide()
        $("#RecordSection").hide()
    }

    $("input[name=DeliveryList]").each(function () {
        tbody = $(this).closest("tbody")
        $(tbody).data("DeliveryList", JSON.parse($(this).val()))
    })

    $("a[alt=Delivery]").on("click", function () {
        tbody = $(this).closest("tbody")
        $("#popPROneTimeDetail").data("target", tbody)
        $("#popPROneTimeDetail").trigger("reset")//觸發重新繪製的動作
    })

    if ($("#P_Status").val() != 2) {
        $("a[alt=showDetail]").removeAttr("onclick").addClass("input-disable").prop("disabled", true)
    }

    $("[Amount]").each(function () {
        let amount = fun_accountingformatNumberdelzero($(this).text())
        if (amount == "0") {
            $(this).text("")
        }
        else {
            $(this).text(fun_accountingformatNumberdelzero($(this).text()))
        }
    })

    $("table[name=OnceDetailTable] tbody").each(function (i, o) {
        let tbody = $(this)
        YCDetailID = $(this).find("input[name=YCDetailID]").val()
        POItem = $(this).find("input[name=ItemDescription]").val()
        //忘了為甚麼要用這種神奇的寫法?? *應該是沿用mike
        /* $.ajax({
             type: 'POST',
             url: '/PR/POitemListGet',
             data: {
                 SName: POItem
             },
             async: false,
             success: function (data) {
                 if (data) {
                     Itemobj = $.grep(data, function (info) {
                         return (info.YCDetailID == YCDetailID)
                     })

                     if (Itemobj.length > 0) {
                         $(tbody).find("td[tag=VendorName]").text(Itemobj[0].VendorName)
                         $(tbody).find("td[tag=ContactPerson]").text((Itemobj[0].ContactPerson) ? Itemobj[0].ContactPerson : "")
                         $(tbody).find("td[tag=BpaNum]").text(Itemobj[0].BpaNum)
                         $(tbody).find("td[tag=GreenCategoryName]").text(Itemobj[0].GreenCategoryName)
                     }
                 }
             }
         });*/
        $.ajax({
            type: 'POST',
            url: '/PR/GetYearlyContractDetailInfo/' + YCDetailID,

            async: false,
            success: function (data) {
                if (data) {
                    $(tbody).find("td[tag=VendorName]").text(data.VendorName)
                    $(tbody).find("td[tag=ContactPerson]").text((data.ContactPerson) ? data.ContactPerson : "")
                    $(tbody).find("td[tag=BpaNum]").text(data.BpaNum)
                    $(tbody).find("td[tag=GreenCategoryName]").text(data.GreenCategoryName)
                }
            }
        });
    })

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
                            tag = $(this).attr("tag")
                            $(this).text("")
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
                                        })

                                        //檔案上傳區塊
                                    }
                                    else {
                                        alert("報價單載入失敗!!")
                                    }
                                },
                                error: function (err) {
                                    alert("報價單載入失敗!!")
                                }
                            })

                            $("#popQuoteReadonly").remodal().open()
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

    if ($("#BudgetAmount").text() == "0") {
        $("#BudgetAmount").text("")
    }

    let P_CustomFlowKey = $('#P_CustomFlowKey').val()
    let P_CurrentStep = $('#P_CurrentStep').val()

    //會計覆核關卡後請採購程序判定區要往前提
    if (String(P_CustomFlowKey).includes("PR_P2") == P_CurrentStep > 1) {
        let PriceStandardSectionObj = $("#PriceStandardSection")
        $("#newAreaPriceStandardSection").append(PriceStandardSectionObj)
    }
})

//收貨明細層
{
    $(function () {
        $("#popPROneTimeDetail").on("reset", function () {
            $("#popPROneTimeDetail").find("tbody").not("[template]").remove();
            target = $("#popPROneTimeDetail").data("target")
            DeliveryList = target.data("DeliveryList")

            $("#popPROneTimeDetail").find("#OnceDevyConfirm").remove()
            $("#popPROneTimeDetail").find("a[alt=cancel]").text("確認")

            $.each(DeliveryList, function (index, info) {
                fun_addDeliveryReadonlyRow(info)
            })
        })
    })
    function fun_addDeliveryReadonlyRow(info) {
        obj = $("#popPROneTimeDetail tbody[template]").eq(0).clone()
        $(obj).removeAttr("template");
        $(obj).find("[alt=template]").attr("alt", "Index")

        $(obj).find("td").eq(1).html("").text(info.ChargeDeptName)
        $(obj).find("td").eq(2).html("").text(info.RcvDeptName)
        $(obj).find("td").eq(3).html("").text(fun_accountingformatNumberdelzero(info.Quantity))
        $(obj).find("td").eq(4).html("").text((fun_accountingformatNumberdelzero(info.Amount) == "0") ? "" : fun_accountingformatNumberdelzero(info.Amount))
        $(obj).show()
        $("#popPROneTimeDetail").find("table").append(obj)

        fun_resetCellIndex($("#popPROneTimeDetail"), "Index", 1)
    }
}

//採購明細
{
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
                                $(tbody).find("tr[delreasontitle]").hide();
                                $(tbody).find("tr[delreason]").hide();
                            })

                            $(tbody).append(templateRTtitle)
                            $.each(RTInfoList, function (x, rtinfo) {
                                rtRow = templateRtRow.clone()
                                //  rtRow.find("td").eq(0).text(funAddheadZero(3, x))
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
                            $(this).children("div").toggleClass("glyphicon-chevron-down")
                            $(this).children("div").toggleClass("glyphicon-chevron-up")
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
}
//採購明細

//報價上傳 Action
{
    var Q_existData = []

    function Q_FileUploadReset(readonly) {
        Q_existData = []

        let QfileSectionitem = $('#QfileSection').clone();
        Qesunfile = $(QfileSectionitem).find("div.QesunfileList").eq(0)
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

        //避免被主單的JS控制到

        $(Qesunfile).append(html)

        //拖曳上傳功能
        /* $(Qesunfile).find('.Qdndregion').on({
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
         });*/
        //監聽上傳按鈕是否有選擇檔案
        /*$(Qesunfile).find(".QfileUploadBtn").on('change', function () {
            Q_existData = QuploadFileHandler($(this)[0].files, $(this).parents('.box'), Q_existData);
            //將檔案放入FormData後初始化input file
            $(this).val("");
        });

        $(Qesunfile).find('.selectAllFile').on('click', function () {
            $(this).parents('.box').find('.selectFileDetail').prop('checked', $(this).prop('checked'));
        });*/

        //刪除按鈕
        $(Qesunfile).find(".deleteFile").off('click');
        //$(Qesunfile).find(".deleteFile").on('click', '.deleteFile', QdeleteFileHandler);
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
            alert(existFileName)
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
        var fileName = "default";
        fetch('/CBP/Download', {
            body: JSON.stringify(downLoadData),
            method: 'POST',
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            }
        }).then(function (response) {
            fileName = decodeURI(response.headers.get('x-fileName'))
            return response.blob();
        }).then(function (blob) {
            saveAs(blob, fileName);
        })
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
            item.Serno == 0 ? $(appendTarget).append(fileDescriptionOpenTemplate(item).replace(/downloadFileHandler/g, "QdownloadFileHandler")) :
            item.uploaderID == $('#LoginEno').val() ? $(appendTarget).append(fileDeleteOpenTemplate(item)) : (appendTarget).append(fileDefaultTemplate(item));
        });
        // $(appendTarget).html($(appendTarget).html().replace(/downloadFileHandler/g, "QdownloadFileHandler"))

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

//全部展開收合Action
function fun_toggleAllCloumn(target) {
    if ($(target).children("div").hasClass("list-open-icon")) {
        $(target).closest("thead").nextAll("tbody").not("[alt=no-data]").children("tr").not("[Rowtitle]").each(function () {
            $(this).show(200);
        })

        $(target).closest("table").find("div[arrowicon]").addClass("glyphicon-chevron-up").attr("title", "全部展開")
        $(target).closest("table").find("div[arrowicon]").removeClass("glyphicon-chevron-down")

        $(target).children("div").addClass("list-close-icon")
        $(target).children("div").removeClass("list-open-icon")
    }
    else {
        $(target).closest("thead").nextAll("tbody").not("[alt=no-data]").children("tr").not("[Rowtitle]").each(function () {
            $(this).hide(200);
        })
        $(target).closest("table").find("div[arrowicon]").removeClass("glyphicon-chevron-up")
        $(target).closest("table").find("div[arrowicon]").addClass("glyphicon-chevron-down").attr("title", "全部收合")

        $(target).children("div").removeClass("list-close-icon")
        $(target).children("div").addClass("list-open-icon")
    }
}

//單一列展開收合Action
function fun_toggleCloumn(target) {
    $(target).closest("tbody").find("tr").not("[Rowtitle]").each(function () {
        $(this).toggle(200);
    })

    $(target).children("div").toggleClass("glyphicon-chevron-down")
    $(target).children("div").toggleClass("glyphicon-chevron-up")
}

function fun_basicVerify(target) {
    rtn = true;

    return rtn
}
//公用副程式
{
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
        Accuracy = $(target).attr("Accuracy")
        MaxValue = $(target).attr("MaxValue")
        Amount = accounting.unformat($(target).val())
        if (isNaN(Accuracy)) {
            Accuracy = 0;
        }
        if (isNaN(MaxValue)) {
            MaxValue = -1;
        }

        if (Amount == 0 && $(target).attr("Amount") != "Zero") {
            fun_AddErrMesg(target, "ErrAmount", "請輸入大於0的數字")
            return false;
        }

        if (regNum(Amount, (Accuracy > 0))) {
            if (String(Amount).indexOf(".") > 0) {
                if ((String(Amount).length - (String(Amount).indexOf(".") + 1)) > Accuracy) {
                    fun_AddErrMesg(target, "ErrAmount", "小數點長度錯誤，最多" + Accuracy + "碼")

                    return false;
                }
            }

            if (MaxValue > 0 && Amount > MaxValue) {
                fun_AddErrMesg(target, "ErrAmount", "數字不可大於 " + MaxValue)
                return false;
            }

            //資料庫只開8碼
            /*if (Amount > 10000000) {
                fun_AddErrMesg(target, "ErrAmount", "超出數字上限")
                return false;
            }*/
            $(target).val(fun_accountingformatNumberdelzero(Amount))

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
            //target.setcRange(start, end);
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

    //數字驗證 *正值
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