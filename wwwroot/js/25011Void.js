//作廢全域變數設定
let dataPurchaseVoid = [];
let objPrNum = [];
let objBpaNum = [];
let objPurchaseName = [];
let CancelBpa = [];
let BpaData = [];
let POData = [];
let EmpNum = $("#EmpID").val();

{
    init();//

    //查詢未核發或未採購之請購單
    $(document).on('click', '#btnSearch', function () {
        var searchNum = $("#searchNum").val() == null ? "" : $("#searchNum").val();
        var VendorName = $("#Vendor").val() == 99 ? "" : $("#Vendor option:selected").text();
        if (VendorName == "請選擇") { VendorName = "" }

        var ItemDescription = $("#ItemDescription").val();
        var ReleaseNum = $("#ReleaseNum").val() == null ? "" : $("#ReleaseNum").val()
        var ApplicationId = $("#EmpID").val();
        //if (searchNum == '' && VendorName == '' && ItemDescription == '' && ReleaseNum == '') {
        //    alert("請輸入一個條件");
        //    return false;
        //}
        // else {
        if ($("#searchNum option:selected").text().substr(0, 2) == "PO") {
            searchResultPO(searchNum, VendorName, ItemDescription, ApplicationId);
        }
        else {
            if (searchNum == "") {
                searchResultBPA(searchNum, ReleaseNum, ItemDescription, VendorName, ApplicationId);
            } else {
                if ($("#searchNum option:selected").text().substr(0, 3) == "BPA") {
                    if (ReleaseNum == "") {
                        $("#AlertMessage").text("當所選單號為年度議價協議時，需選擇核發次數");
                        window.location.href = "#modal-added-info-2"
                        $("#ResultArea").hide(200);
                        return false
                    }
                    else {
                        searchResultBPA(searchNum, ReleaseNum, ItemDescription, VendorName, ApplicationId);
                    }
                }
            }
        }
        //  }
    });

    $("#btnClear").on("click", function () {
        $("#searchNum").val('');
        $("#ReleaseNum").val('');
        $("#Vendor").val('');
        $("#ItemDescription").val('');
        $("select").selectpicker('refresh');
    })

    $('textarea[name=CancelReason]').blur(function () {
        if ($(this).val().replace(/\s/g, '').trim().length > 80) {
            $("#msgError").find("span").text("字數不可超過80個字，目前字數" + $(this).val().replace(/\s/g, '').trim().length + "字");
            $("#msgError").show()
        }
        else $("#msgError").hide()
    });

    $(".tt").focus(function () {
        if ($(this).val().replace(/\s/g, '').trim().length > 80) {
            $("#msgError").show()
        }
        else $("#msgError").hide()
    })

    $(document).on('change', 'select[name=searchNum]', function () {
        fun_ReleaseNumReset();
    })

    $("[data-remodal-id=Void-remodal]").on('click', '.remodal-confirm-btn', function () {
        var PODeliveryID = $(this).parents("[data-remodal-id=Void-remodal]").find("td[name=PODeliveryID]").text();
        var DetailID = $(this).parents("[data-remodal-id=Void-remodal]").find("td[name=PODetailID]").text();
        var Number = $(this).parents("[data-remodal-id=Void-remodal]").find("td[name=PONum]").text();
        var cancelReason = $(this).parents("[data-remodal-id=Void-remodal]").find("textarea[name=CancelReason]").val().replace(/\s/g, '').trim();
        var YADeliveryID = $(this).parents("[data-remodal-id=Void-remodal]").find("td[name=PODeliveryID]").text();
        var ReleaseNum = $(this).parents("[data-remodal-id=Void-remodal]").find("td[name=ReleaseNum]").text();
        var CancelID = $(this).parents("[data-remodal-id=Void-remodal]").find("td[name=CancelID]").text();

        var CancelBy = EmpNum;
        var CancelEmpName = $("#EmpName").val();
        var CBPA = {
            bpaNumber: Number
           , cancelBy: CancelBy
           , cancelDate: null
           , cancelReason: cancelReason
           , lineNumber: parseFloat(YADeliveryID)
           , releaseNumber: ReleaseNum
           , sourceCode: "BPA"
           , CancelEmpName: CancelEmpName
        };
        var CPO = {
            sourceCode: "PO"
         , poNumber: Number
         , lineNumber: parseFloat(DetailID)
         , shipmentNumber: parseFloat(PODeliveryID)
         , cancelDate: null
         , cancelReason: cancelReason
         , cancelBy: CancelBy
         , CancelEmpName: CancelEmpName
        }

        if (CPO.cancelReason != '' && CPO.poNumber.substr(0, 2) == "PO") {
            if (CPO.cancelReason.length <= 80 && CPO.cancelReason.length > 0) {
                CancelPO(CPO, CancelID)
            }
            else {
                alert("請填寫作廢原因");
                return false;
            }
        } else {
            if (CBPA.cancelReason.length <= 80 && CBPA.cancelReason.length > 0) {
                CancelBPR(CBPA, CancelID)
            }
            else {
                alert("請填寫作廢原因");
                return false;
            }
        }

        function CancelBPR(CBPA, CancelID) {
            var deferred = $.Deferred();
            var _url = '/PurchaseVoid/FIISCancelBPR';
            $.ajax({
                //async: false,
                url: _url,
                dataType: 'json',
                type: 'POST',
                data: CBPA,
                success: function (data, textStatus, jqXHR) {
                    var Flag = data;
                    if (Flag) {
                        alert('作廢成功!');
                        closeRemodel(CBPA, CancelID)
                    }
                    deferred.resolve();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('作廢失敗\n' + jqXHR.responseText);
                    //_formInfo.flag = false;
                    // closeRemodel(CBPA, CancelID)
                    deferred.reject();
                }
            })

            return deferred.promise();
        }

        function CancelPO(CPO, CancelID) {
            var deferred = $.Deferred();

            var _url = '/PurchaseVoid/FIISCancelPO';
            $.ajax({
                url: _url,
                dataType: 'json',
                type: 'POST',
                data: CPO,
                success: function (data, textStatus, jqXHR) {
                    var Flag = data;
                    if (Flag) {
                        alert('作廢成功!');
                        closeRemodel(CPO, CancelID)
                    }
                    deferred.resolve();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('作廢明購失敗!\n' + jqXHR.responseText);
                    //closeRemodel(CPO, CancelID)
                    deferred.reject();
                }
            })
            return deferred.promise();
        }
    });

    //欄位全部開啟或關閉
    $(document).on('click', '#ExpandAllDetail', function () {
        if ($(this).find('.list-open-icon').length > 0) {
            SwitchHideDisplay([], [$('.Detail')]);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up')
        } else {
            SwitchHideDisplay([$('.Detail')], []);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
        }
        $(this).find('.toggleArrow').toggleClass('list-close-icon list-open-icon')
    });

    //下拉箭頭開啟單筆明細
    $(document).on('click', '#ExpandDetail', function () {
        if ($(this).find('.glyphicon-chevron-down').length > 0) {
            SwitchHideDisplay([], [$(this).parents('tbody').find('.Detail')]);
        } else {
            SwitchHideDisplay([$(this).parents('tbody').find('.Detail')], []);
        }
        $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up')
    });
}

function closeRemodel(obj, CancelID) {
    $("#ResultList").find("input[name=PODeliveryID]").each(function () {
        if (obj.sourceCode == "PO") {
            if (this.value == obj.shipmentNumber) {
                $(this).parents("tr[name=Purchasedetail]").find("td[name=CancelReason]")
                       .find("input[name=CancelReason]").removeAttr("readonly").attr("value", obj.cancelReason);
            }
        }
        else {
            if (this.value == obj.lineNumber) {
                $(this).parents("tr[name=Purchasedetail]").find("td[name=CancelReason]")
                       .find("input[name=CancelReason]").removeAttr("readonly").attr("value", obj.cancelReason);
            }
        }
    })
    if (obj.sourceCode == "BPA") {
        CreditBudgetVoided(CancelID, obj.lineNumber)
    } else {
        CreditBudgetVoided(CancelID, obj.shipmentNumber)
    }
}

//查詢採購的單
function searchResultPO(SearchID, VendorName, ItemDescription, ApplicationId) {
    var data = {
        POID: SearchID, VendorName: VendorName, ItemDescription: ItemDescription, ApplicationId: ApplicationId
    };
    $.ajax({
        async: false,
        url: '/PurchaseVoid/GetBPAPOVoidByPOID',
        dataType: 'json',
        type: 'POST',
        data: data,
        success: function (data, textStatus, jqXHR) {
            POData = data;
            if (BpaData != null) {
                initDetail(POData);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

//處理單筆作廢資料
function toSignVoid(target, tobdy) {
    var ReleaseNum = $(target).parents("tbody").find("td[name=ReleaseNum]").eq(0).text() == "" ? 0 : $(target).parents("tbody").find("td[name=ReleaseNum]").eq(0).text();
    var PODeliveryID = $(target).parents("tbody").find("input[name=PODeliveryID]").val();
    checkFlag = fn_checkProcess(PODeliveryID, ReleaseNum)
    if (checkFlag) {
        $("#AlertMessage").text("此筆採購明細正在收貨中，無法執行作廢。");
        window.location.href = "#modal-added-info-2"
        return false
    }
    else {
        $("#msgError").hide();
        var CancelReason = $(target).parents("tbody").find("input[name=CancelReason]").val();//判斷作廢條件是已輸入值
        var DeliveryID = $(target).parents("tbody").find("input[name=PODeliveryID]").val();
        var DetailID = $(target).parents("tbody").find("input[name=PODetailID]").val();
        var PONum = $(target).parents("tbody").find("td[name=PONum]").eq(0).text();
        // var ReleaseNum = $(target).parents("tbody").find("td[name=ReleaseNum]").eq(0).text();
        var CancelID = $(target).parents("tbody").find("td[name=CancelID]").eq(0).text();

        if (CancelReason.length == 0 || CancelReason.trim() == '') {
            $("[data-remodal-id=Void-remodal]").find("tbody").find("td[name=PODeliveryID]").text(DeliveryID);
            $("[data-remodal-id=Void-remodal]").find("tbody").find("td[name=PONum]").text(PONum);
            $("[data-remodal-id=Void-remodal]").find("tbody").find("td[name=PODetailID]").text(DetailID);
            $("[data-remodal-id=Void-remodal]").find("tbody").find("textarea[name=CancelReason]").val(CancelReason);
            $("[data-remodal-id=Void-remodal]").find("tbody").find("td[name=ReleaseNum]").text(ReleaseNum);
            $("[data-remodal-id=Void-remodal]").find("tbody").find("td[name=CancelID]").text(CancelID);
            FieldControl($("[data-remodal-id=Void-remodal]").find("tbody").find("textarea[name=CancelReason]"), CancelReason, false)
            $("[data-remodal-id=Void-remodal]").find(".remodal-confirm-btn").show();
            $("[data-remodal-id=Void-remodal]").find(".remodal-cancel-btn").show();
        } else {
            FieldControl($("[data-remodal-id=Void-remodal]").find("tbody").find("textarea[name=CancelReason]"), CancelReason, true)
            $("[data-remodal-id=Void-remodal]").find(".remodal-confirm-btn").hide();
            $("[data-remodal-id=Void-remodal]").find(".remodal-cancel-btn").hide();
        }
        $('[data-remodal-id=Void-remodal]').remodal().open();
    }
}

//初始化查詢畫面
function init() {
    var PRID = $("#PrNum").val() == null ? "" : $("#PrNum").val();
    var YCID = $("#BpaNum").val() == null ? "" : $("#BpaNum").val();
    var VendorNum = $("#Vendor").val() == null ? "" : $("#Vendor").val();
    var ItemDescription = $("#ItemDescription").val();
    var id = $("#EmpID").val();
    // var data = { PRID: PRID, YCID: YCID, PurchaseEmpNum: PurchaseEmpNum, ItemDescription: ItemDescription, EmpNum: VendorNum };

    $.ajax({
        async: false,
        url: '/PurchaseVoid/GetBPAPOVoid',
        dataType: 'json',
        type: 'POST',
        data: { id: id },
        success: function (data, textStatus, jqXHR) {
            // console.log(data[0].BpaNum);
            dataPurchaseVoid = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    //初始化請購單號、年度議價協議單號、採購經辦下拉選單
    initSelectOption($("#searchNum"), dataPurchaseVoid);
    initSelectOption($("#ReleaseNum"), dataPurchaseVoid);
    initSelectOption($("#Vendor"), dataPurchaseVoid);

    // initDetail();
}

function searchResultBPA(SearchID, ReleaseNum, ItemDescription, VendorName, ApplicationId) {
    var data = { YCID: SearchID, ReleaseNum: ReleaseNum, ItemDescription: ItemDescription, VendorName: VendorName, ApplicationId: ApplicationId };
    $.ajax({
        async: false,
        url: '/PurchaseVoid/GetBPAPOVoidByYCID',
        dataType: 'json',
        type: 'POST',
        data: data,
        success: function (data, textStatus, jqXHR) {
            BpaData = data;
            if (BpaData != null) {
                initDetail(BpaData);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function initDetail(data) {
    var usedPRDeliveryID = [];
    var tmp = $('#tmpSearchResult').html();
    $('#ResultList tbody').html("");
    var SearchNum = $("#PrNum option:selected").text();
    $.each(data, function (index, element) {
        var tbody = $(tmp).clone();
        $(tbody).find("td[name=Quantity]").text(fun_accountingformatNumberdelzero(element.ReceiveableQuantity));//待收數量
        $(tbody).find("td[name=UOMName]").text(element.UomName != null ? element.UomName : "");//單位
        $(tbody).find("td[name=ChargeDepName]").text(element.ChargeDeptName);//掛帳單位
        $(tbody).find("td[name=RevDepName]").text(element.RcvDeptName);//收貨單位
        $(tbody).find("td[name=CategoryName]").text(element.CategoryName);//採購分類
        $(tbody).find("td[name=ItemDescription]").text(element.ItemDescription);//品名描述
        $(tbody).find("td[name=PRNum]").text(element.PRNum);//單位
        $(tbody).find("td[name=PONum]").text(element.searchNum);//單位
        $(tbody).find("td[name=ReleaseNum]").text(element.ReleaseNum == -1 ? "" : element.ReleaseNum);//議價單價
        $(tbody).find("td[name=Vonder]").text(element.VendorName).append("<div class='p-right5 btn-01-add'><a onclick=toSignVoid(this,$(this).parents('tbody'))><div class=glyphicon glyphicon-pencil bt-icon-size-1></div><span class=p-left2>作廢</span></a></div>")

        $(tbody).find("td[name=CancelID]").text(element.CancelID);//作廢預算控管guid
        $(tbody).find("input[name=PODeliveryID]").attr("value", element.DeliveryID);
        $(tbody).find("input[name=PODetailID]").attr("value", element.DetailID);
        $('#ResultList').append(tbody);
    })
}
function searchResult(PRID, YCID, PurchaseEmpNum, ItemDescription) {
    var data = { PRID: PRID, YCID: YCID, PurchaseEmpNum: PurchaseEmpNum, ItemDescription: ItemDescription, EmpNum: EmpNum };
    $.ajax({
        async: false,
        url: '/PurchaseVoid/GetBPAPOVoid',
        dataType: 'json',
        type: 'POST',
        data: data,
        success: function (data, textStatus, jqXHR) {
            // console.log(data[0].BpaNum);
            dataPurchaseVoid = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    //初始化請購單號、年度議價協議單號、採購經辦下拉選單
    //initDetail();
}

function initSelectOption(target, data) {
    var tagName = $(target).attr("name");
    var usedNames = [];
    switch (tagName) {
        case "searchNum":
            $(target).html('');
            $(target).append('<option value=0>取消選擇</option>');
            $.each(data, function (index, value) {
                if (usedNames.indexOf(value.searchNum) == -1) {
                    $(target).append('<option value="' + value.searchID + '">' + value.searchNum + '</option>');
                    usedNames.push(value.searchNum);
                }
            })
            break;
        case "ReleaseNum":
            $(target).html('');
            $(target).append('<option value=99>取消選擇</option>');
            $.each(data, function (index, value) {
                if (data[index].ReleaseNum != null) {
                    if (usedNames.indexOf(value.ReleaseNum) == -1) {
                        $(target).append('<option value="' + value.ReleaseNum + '">' + value.ReleaseNum + '</option>');
                        usedNames.push(value.ReleaseNum);
                    }
                }
            })
            break;
        case "Vendor":
            $(target).html('');
            $(target).append('<option value=99>取消選擇</option>');
            $.each(data, function (index, value) {
                if (data[index].VendorNum != null) {
                    if (usedNames.indexOf(value.VendorNum) == -1) {
                        $(target).append('<option value="' + value.VendorNum + '">' + value.VendorName + '</option>');
                        usedNames.push(value.VendorNum);
                    }
                }
            })
            break;
        default:
    }
    $(target).selectpicker('refresh');
}

function fun_ReleaseNumReset() {
    var searchNum = $("#searchNum option:selected").text() == null ? "" : $("#searchNum option:selected").text();
    var SearchID = $("#searchNum").val();
    var ReleaseNum = "";
    var ItemDescription = $("#ItemDescription").val();
    if (searchNum.substr(0, 2) == "PO") {
        $("#ReleaseNum").val("");
        $("#ReleaseNum").toggleClass('selectpicker show-tick select-h38').prop("disabled", true);
        $("#ReleaseNum").parents('div.btn-group').addClass('input-disable');
        $("#ReleaseNum").addClass('input-disable');
    }
    else {
        $("#ReleaseNum option").remove();
        $("#ReleaseNum").toggleClass('selectpicker show-tick select-h38').prop("disabled", false);
        $("#ReleaseNum").parents('div.btn-group').removeClass('input-disable');
        $("#ReleaseNum").removeClass('input-disable');
        var dataReleaseNum = $.grep(dataPurchaseVoid, function (item, index) {
            return item.searchNum == searchNum;
        });
        var usedNames = [];
        $.each(dataReleaseNum, function (index, value) {
            if (dataReleaseNum[index].ReleaseNum != null) {
                if (usedNames.indexOf(value.ReleaseNum) == -1) {
                    $("#ReleaseNum").append('<option value="' + value.ReleaseNum + '">' + value.ReleaseNum + '</option>');
                    usedNames.push(value.ReleaseNum);
                }
            }
        })
    }
    $("#ReleaseNum").selectpicker('refresh');
}

function fn_checkProcess(DeliveryID, ReleaseNum) {
    var data = { DeliveryID: parseInt(DeliveryID), ReleaseNum: parseInt(ReleaseNum) }
    var Flag = false;
    $.ajax({
        async: false,
        url: '/PurchaseVoid/checkDeliveryInProcess',
        // dataType: 'json',
        type: 'POST',
        data: data,
        success: function (data, textStatus, jqXHR) {
            // Flag = data;
            if (data == "True") {
                Flag = true;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    })
    return Flag;
}

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

//欄位唯讀
function FieldControl(target, context, disable) {
    tagName = $(target)[0].tagName
    if (disable) {
        switch (tagName) {
            case "TEXTAREA":
                $("[alt='remodeldisabletext']").remove();
                $(target).after("<div class='disable-text' colspan='4' align='left' alt='remodeldisabletext' >" + context + "</div>");
                $(target).attr("style", "display:none");
                $(target).parents("[data-remodal-id=Void-remodal]").find(".popup-title-center").text("作廢原因")
                break;
            default:
        }
    } else {
        switch (tagName) {
            case "TEXTAREA":
                $("[alt='remodeldisabletext']").remove();
                //$(target).after("<div class='disable-text' colspan='4' align='left' alt='remodeldisabletext' >" + context + "</div>");
                $(target).removeAttr("style");
                $(target).parents("[data-remodal-id=Void-remodal]").find(".popup-title-center").text("編輯作廢原因")
                break;
            default:
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