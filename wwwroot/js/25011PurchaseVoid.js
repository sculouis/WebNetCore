//作廢全域變數設定
let dataPurchaseVoid = [];
let objPrNum = [];
let objBpaNum = [];
let objPurchaseName = [];
let CancelBpa = [];
let EmpNum = $("#EmpID").val();
let initData = [];
{
    init();//

    //查詢未核發或未採購之請購單
    $(document).on('click', '#btnSearch', function () {
        var PRID = $("#PrNum").val() == null ? "" : $("#PrNum").val();
        var YCID = $("#BpaNum").val() == null ? "" : $("#BpaNum").val();
        var PurchaseEmpNum = $("#PurchaseEmpNum").val() == null ? "" : $("#PurchaseEmpNum").val();
        var ItemDescription = $("#ItemDescription").val();
        if (PRID == 0) PRID = ""; if (YCID == 0) YCID == ""; if (PurchaseEmpNum == 0) PurchaseEmpNum = "";
        
            if (YCID != "") {
                if (YCID == 0) {
                    GetPurchaseVoidByPRID(PRID, YCID, PurchaseEmpNum, ItemDescription);
                } else {
                    GetPurchaseVoidByYCID(PRID, YCID, PurchaseEmpNum, ItemDescription);
                }
            }
            else {
                GetPurchaseVoidByPRID(PRID, YCID, PurchaseEmpNum, ItemDescription);
            }        
            appendDetail();
      
    });

    $("#btnClear").on("click", function () {
        $("#PrNum").val('');
        $("#BpaNum").val('');
        $("#PurchaseEmpNum").val('');
        $("#ItemDescription").val('');
        init();
        $("select").selectpicker('refresh');
    })

    $("select[name=PrNum]").on("change", fun_BpaNumReset)//j重新宣染年度議價協議單號

    $("select[name=BpaNum]").on("change", fun_PRNumReset)//重新宣染請購單號

    $('textarea[name=CancelReason]').blur(function () {
        $(this).attr("value", $(this).val());
    });

    $("[data-remodal-id=Void-remodal]").on('click', '.remodal-confirm-btn', function () {
        var PRDeliveryID = $(this).parents("[data-remodal-id=Void-remodal]").find("td[name=PRDeliveryID]").text();
        var CancelReason = $(this).parents("[data-remodal-id=Void-remodal]").find("tbody").find("textarea[name=CancelReason]").val()
        var BpaNum = $(this).parents("[data-remodal-id=Void-remodal]").find("td[name=BpaNum]").text();
        var ReleaseNum = $(this).parents("[data-remodal-id=Void-remodal]").find("td[name=ReleaseNum]").text();
        var cancelReason = $(this).parents("[data-remodal-id=Void-remodal]").find("textarea[name=CancelReason]").val().replace(/\s/g, '').trim();
        var YADetailID = $(this).parents("[data-remodal-id=Void-remodal]").find("td[name=YADetailID]").text();
        var CancelBy = $("#EmpID").val();
        var CancelEmpName = $("#EmpName").val();
        if (!(cancelReason.length <= 80)) {
            return false;
        } else {
            if (cancelReason != "") {
                var cPrd = {
                    PRDeliveryID: PRDeliveryID,
                    CancelBy: CancelBy,
                    CancelEmpName: CancelEmpName,
                    CancelDate: null,
                    CancelReason: cancelReason,
                    CancelEmpName: CancelEmpName
                };

                if (cPrd.CancelReason.trim() != '') {
                    CancelPRDelivery(cPrd, $(this))
                } else {
                   return  false;
                }
            }
            else {
                alert("請填寫作廢原因");
                return false;
            }
        }
    });

    $('textarea[name=CancelReason]').blur(function () {
        if ($(this).val().replace(/\s/g, '').trim().length > 80) {
            $("#msgError").find("span").text("*字數不可超過80個字,目前" + $(this).val().replace(/\s/g, '').trim().length + "字")
            $("#msgError").show()
        }
        else $("#msgError").hide()
    });

    $(".tt").focus(function () {
        if ($(this).val().replace(/\s/g, '').trim().length > 80) {
            $("#msgError").show()
        }
        else $("#msgError").hide()
        // console.log("onfocus")
    })

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

function CancelPRDelivery(cPrd, obj) {
    var _url = '/PurchaseVoid/CancelPRDelivery';
    $.ajax({
        //async: false,
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: cPrd,
        success: function (data, textStatus, jqXHR) {
            var Flag = data;
            if (Flag == true) {
                alert('作廢請購明購成功!');
                closeRemodel(cPrd)
            } else {
                alert('作廢請購明購失敗!');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('作廢請明購失敗!\n' + jqXHR.responseText);
        }
    })
}

function closeRemodel(obj) {
    $("#ResultList").find("input[name=PRDeliveryID]").each(function () {
        if (this.value == obj.PRDeliveryID) {
            $(this).parents("tr[name=Purchasedetail]").find("td[name=CancelReason]")
                   .find("input[name=CancelReason]").removeAttr("readonly").attr("value", obj.CancelReason);
        }
    })
    var _url = '/PurchaseVoid/GetPRIDbyPRDelivery';
    var PrDeliveryId = obj.PRDeliveryID;
    var objBudget = [];
    $.ajax({
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: { PrDeliveryId: PrDeliveryId },
        success: function (data, textStatus, jqXHR) {
            if (data) {
                CreditBudgetVoided(data.PRID, data.PRDeliveryID)
            }
            else {
                alert("尚無資料")
            }
        },
        error: function (data) {
            alert(data.Message)
        }
    });
    // console.log(PRID);
}

//處理單筆作廢資料
function toSignVoid(target, tbody) {
    // console.log($(tbody).html())
    var CancelBpaNum = $(target).parents("tbody").find("td[name=BpaNum]").text() == "" ? 0 : 1
    var DeliveryID = $(target).parents("tbody").find("input[name=PRDeliveryID]").val();
    
    checkFlag = fn_checkPRProcess(DeliveryID, CancelBpaNum)
    if (checkFlag) {
        $("#AlertMessage").text("此筆請購明細正在採購中，無法執行作廢。");
        window.location.href = "#modal-added-info-2"
        return false
    } else {
        var DetailSerno = $(target).parents("tbody").closest(".DetailSerno").text();
        var CancelReason = $(target).parents("tbody").find("input[name=CancelReason]").val();//判斷作廢條件是已輸入值
        var PRDeliveryID = $(target).parents("tbody").find("input[name=PRDeliveryID]").val();
        var BprNum = $(target).parents("tbody").find("input[name=BprNum]").val();
        var BpaNum = $(target).parents("tbody").find("input[name=BpaNum]").val();
        var ReleaseNum = $(target).parents("tbody").find("input[name=ReleaseNum]").val();
        var YADetailID = $(target).parents("tbody").find("input[name=YADetailID]").val();

        if (CancelReason.length == 0 || CancelReason.trim() == '') {
            $("[data-remodal-id=Void-remodal]").find("tbody").find("td[name=BpaNum]").text(BpaNum);
            $("[data-remodal-id=Void-remodal]").find("tbody").find("td[name=BpaNum]").text(BpaNum);
            $("[data-remodal-id=Void-remodal]").find("tbody").find("td[name=BprNum]").text(BprNum);
            $("[data-remodal-id=Void-remodal]").find("tbody").find("td[name=ReleaseNum]").text(ReleaseNum);
            $("[data-remodal-id=Void-remodal]").find("tbody").find("td[name=PRDeliveryID]").text(PRDeliveryID);
            $("[data-remodal-id=Void-remodal]").find("tbody").find("textarea[name=CancelReason]").val(CancelReason);
            $("[data-remodal-id=Void-remodal]").find("tbody").find("td[name=YADetailID]").text(YADetailID);
            FieldControl($("[data-remodal-id=Void-remodal]").find("tbody").find("textarea[name=CancelReason]"), CancelReason, false)
            $("[data-remodal-id=Void-remodal]").find(".remodal-confirm-btn").show();
            $("[data-remodal-id=Void-remodal]").find(".remodal-cancel-btn").show();
            $("[data-remodal-id=Void-remodal]").find("#msgError").hide();
        } else {
            FieldControl($("[data-remodal-id=Void-remodal]").find("tbody").find("textarea[name=CancelReason]"), CancelReason, true)
            $("[data-remodal-id=Void-remodal]").find(".remodal-confirm-btn").hide();
            $("[data-remodal-id=Void-remodal]").find(".remodal-cancel-btn").hide();
        }
        $('[data-remodal-id=Void-remodal]').remodal().open();
    }
}

function fn_checkPRProcess(DeliveryID, CancelBpaNum) {
    var data = { DeliveryID: DeliveryID, CancelBpaNum: CancelBpaNum }
    var Flag = false;
    $.ajax({
        async: false,
        url: '/PurchaseVoid/checkDeliveryPrInProcess',
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

//初始化查詢畫面
function init() {
    var PRID = $("#PrNum").val() == null ? "" : $("#PrNum").val();
    var YCID = $("#BpaNum").val() == null ? "" : $("#BpaNum").val();
    var PurchaseEmpNum = $("#PurchaseEmpNum").val() == null ? "" : $("#PurchaseEmpNum").val();
    var ItemDescription = $("#ItemDescription").val();
    var data = { PRID: PRID, YCID: YCID, PurchaseEmpNum: PurchaseEmpNum, ItemDescription: ItemDescription, EmpNum: EmpNum };
    $.ajax({
        async: false,
        url: '/PurchaseVoid/GetPurchaseVoid',
        dataType: 'json',
        type: 'POST',
        data: data,
        success: function (data, textStatus, jqXHR) {
            // console.log(data[0].BpaNum);
            dataPurchaseVoid = data;
            initData = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    //初始化請購單號、年度議價協議單號、採購經辦下拉選單
    initSelectOption($("#PrNum"), dataPurchaseVoid);
    initSelectOption($("#BpaNum"), dataPurchaseVoid);
    initSelectOption($("#PurchaseEmpNum"), dataPurchaseVoid);

    // initDetail();
}

function GetPurchaseVoidByPRID(PRID, YCID, PurchaseEmpNum, ItemDescription) {
    var data = { PRID: PRID, YCID: YCID, PurchaseEmpNum: PurchaseEmpNum, ItemDescription: ItemDescription, EmpNum: EmpNum };
    $.ajax({
        async: false,
        url: '/PurchaseVoid/GetPurchaseVoidByPRID',
        dataType: 'json',
        type: 'POST',
        data: data,
        success: function (data, textStatus, jqXHR) {
            // console.log(data[0].BpaNum);
            dataPurchaseVoid = data;
            console.log(dataPurchaseVoid)
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function GetPurchaseVoidByYCID(PRID, YCID, PurchaseEmpNum, ItemDescription) {
    var data = { PRID: PRID, YCID: YCID, PurchaseEmpNum: PurchaseEmpNum, ItemDescription: ItemDescription, EmpNum: EmpNum };
    $.ajax({
        async: false,
        url: '/PurchaseVoid/GetPurchaseVoidByYCID',
        dataType: 'json',
        type: 'POST',
        data: data,
        success: function (data, textStatus, jqXHR) {
            // console.log(data[0].BpaNum);
            dataPurchaseVoid = data;
            console.log(dataPurchaseVoid)
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function appendDetail() {
    var usedPRDeliveryID = [];
    var tmp = $('#tmpSearchResult').html();
    $('#ResultList tbody').html("");
    // console.log(tmp);
    if (dataPurchaseVoid.length == 0) {
        alert("查無資料");
    }
    else {
        var tableNO = 0
        $.each(dataPurchaseVoid, function (index, element) {
            var tbody = $(tmp).clone();
            if (usedPRDeliveryID.indexOf(element.PRDeliveryID) == -1) {
                tableNO += 1;
                console.log(tableNO);
                $(tbody).find(".DetailSerno").text(tableNO);
                $(tbody).find("td[name=PrNum]").text(element.PRNum);//請購單號
                $(tbody).find("td[name=BpaNum]").text(element.BpaNum != null ? element.BpaNum : "");//年度議價協議單號
                // $(tbody).find("td[name=QuoteNum]").text(element.QuoteNum != null ? element.QuoteNum : "");//報價單號
                $(tbody).find("td[name=CategoryName]").text(element.CategoryName);//採購分類
                $(tbody).find("td[name=ItemDescription]").text(element.itemDescription);//品名描述
                $(tbody).find("td[name=Quantity]").append(element.Quantity == null ? 0 : fun_accountingformatNumberdelzero(parseFloat(element.Quantity)));//數量
                $(tbody).find("td[name=UomName]").text(element.UomName);//單位

                $(tbody).find("td[name=ChargeDeptName]").text(element.ChargeDeptName);//掛帳單位
                $(tbody).find("td[name=RcvDeptName]").text(element.RcvDeptName);//收貨單位
                //$(tbody).find("td[name=QuoteEmpName]").text(element.QuoteEmpName == null ? "" : element.QuoteEmpName + "(" + element.QuoteEmpNum + ")");//報價經辦
                $(tbody).find("td[name=PurchaseEmpName]").text(element.PurchaseEmpName == null ? "" : element.PurchaseEmpName + "(" + element.PurchaseEmpNum + ")");//採購經辦
                $(tbody).find("td[name=InvoiceEmpName]").text(element.InvoiceEmpName + "(" + element.InvoiceEmpNum + ")");//發票管理人
                $(tbody).find("input[name=PRDeliveryID]").attr("value", element.PRDeliveryID);//請購單送貨層編號
                $(tbody).find("input[name=CancelReason]").attr("value", element.CancelReason);//作廢原因
                $(tbody).find("input[name=BprNum]").attr("value", element.BprNum);//年度議價核發編號
                $(tbody).find("input[name=BpaNum]").attr("value", element.BpaNum);//年度議價協議編號
                $(tbody).find("input[name=YADetailID]").attr("value", element.YADetailID);//年度議價明細協議編號

                $('#ResultList').append(tbody);
                usedPRDeliveryID.push(element.PRDeliveryID);
            }
        })
    }
}
function searchResult(PRID, YCID, PurchaseEmpNum, ItemDescription) {
    var data = { PRID: PRID, YCID: YCID, PurchaseEmpNum: PurchaseEmpNum, ItemDescription: ItemDescription, EmpNum: EmpNum };
    $.ajax({
        async: false,
        url: '/PurchaseVoid/GetPurchaseVoid',
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
        case "PrNum":
            $(target).html('');
            $(target).append('<option value=0>取消選擇</option>');
            $.each(data, function (index, value) {
                if (data[index].PRNum != null && data[index].BpaNum != '') {
                    if (usedNames.indexOf(value.PRNum) == -1) {
                        $(target).append('<option value="' + value.PRID + '">' + value.PRNum + '</option>');
                        usedNames.push(value.PRNum);
                    }
                }
            })
            break;
        case "BpaNum":
            $(target).html('');
            $(target).append('<option value=0>取消選擇</option>');
            $.each(data, function (index, value) {
                if (data[index].BpaNum != null && data[index].BpaNum != '') {
                    if (usedNames.indexOf(value.BpaNum) == -1) {
                        $(target).append('<option value="' + value.YCID + '">' + value.BpaNum + '</option>');
                        usedNames.push(value.BpaNum);
                    }
                }
            })
            break;
        case "PurchaseEmpNum":
            $(target).html('');
            $(target).append('<option value=0>取消選擇</option>');
            $.each(data, function (index, value) {
                if (data[index].PurchaseEmpNum != null && data[index].PurchaseEmpNum != '') {
                    if (usedNames.indexOf(value.PurchaseEmpNum) == -1) {
                        $(target).append('<option value="' + value.PurchaseEmpNum + '" data-subtext="' + value.PurchaseEmpNum + '">' + value.PurchaseEmpName + '</option>');
                        usedNames.push(value.PurchaseEmpNum);
                    }
                }
            })
            break;
        default:
    }

    $(target).selectpicker("refresh");
}

function fun_PRNumReset() {
    if ($("#BpaNum").val() == 0) {
        initSelectOption($("#PrNum"), initData);
    } else {
        var PRID = $("#PrNum").val() == null ? "" : $("#PrNum").val();
        var YCID = $("#BpaNum").val() == null ? "" : $("#BpaNum").val();
        var PurchaseEmpNum = $("#PurchaseEmpNum").val() == null ? "" : $("#PurchaseEmpNum").val();
        var ItemDescription = $("#ItemDescription").val();     
        var PRID = $("#PrNum").val();
        var dataPrNum = $.grep(initData, function (item, index) {
            return item.YCID == YCID;
        });

        $("#PrNum option").remove();
        initSelectOption($("#PrNum"), dataPrNum);
    }
}

function fun_BpaNumReset() {
    if ($("#PrNum").val() == 0) {
        initSelectOption($("#BpaNum"), initData);
    } else {
        var PRID = $("#PrNum").val() == null ? "" : $("#PrNum").val();
        var YCID = $("#BpaNum").val() == null ? "" : $("#BpaNum").val();
        var PurchaseEmpNum = $("#PurchaseEmpNum").val() == null ? "" : $("#PurchaseEmpNum").val();
        var ItemDescription = $("#ItemDescription").val();
        searchResult(PRID, YCID, PurchaseEmpNum, ItemDescription)
        //$("#ResultList tbody").html("");
        //initDetail();
        var PRID = $("#PrNum").val();
        var dataBpaNum = $.grep(initData, function (item, index) {
            return item.PRID == PRID;
        });

        $("#BpaNum option").remove();
        initSelectOption($("#BpaNum"), dataBpaNum);
    }
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

function CreditBudgetVoided(FormID, DeliveryNo) {
    var data = { FormID: FormID, Action: 2, DeliveryNo: DeliveryNo }
    var _url = '/PO/CreditBudget';
    $.ajax({
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: data,
        success: function (data) {
            if (!data.Status) {
                alert(data.Message)
            }
        },
        error: function (data) {
            alert(data.Message)
        }
    });
}