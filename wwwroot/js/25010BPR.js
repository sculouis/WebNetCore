//採購單主檔json全域變數
var BPR;
//定義查詢的請購明細
var PRDetail;
//定義查詢後年度議價協議明細
var PRYCDetail;
//定議核發次數
var ReleaseNum;
//幣別精確度
var currency = {
    "currencyCode": null,
    "currencyName": null,
    "currencyDescription": null,
    "extendedPrecision": 0
};
var checkReleaseAmount;
let btnSubmit = 0;//按下銷案
let btnConfirm = 0;
//如關卡類別為依表單欄位，各表單需實作特定關卡取得下一關人員清單
function GetPageCustomizedList(stepSequence) {
    if (stepSequence == 3) {
        return { SignedID: [BPR.InvoiceEmpNum], SignedName: [BPR.InvoiceEmpName] };
    }
}

//確認選擇供應商，更新供應商名稱 & 重設側邊選單
function vendorSelected(vendor) {
    if (vendor) {
        suppliesUIChange(vendor.supplierName, vendor.supplierNumber);
        $("#prNumSearch").val("").selectpicker("refresh");
        $("#ycNumSearch").val("").selectpicker("refresh");
        $("#purchaseEmpSearch").val("").selectpicker("refresh");
        $('#invoiceAddressSearch').empty();
        $.each(vendor.supplierSite, function (index, element) {
            $('#invoiceAddressSearch').append($('<option>').val(element.supplierSiteID).text(element.supplierSiteCode));
        });
        $('#invoiceAddressSearch').val('').selectpicker('refresh');
    }
}

//供應商變更的UI操作
function suppliesUIChange(name, number) {
    $('#suppliesName').text(name);
    $('#suppliesSerno').text(number);
    $('#vendorNameSearch').text(name + '(' + number + ')');
}

//toggleText extend
$.fn.extend({
    toggleText: function (a, b) {
        return this.text(this.text() == b ? a : b);
    }
});

//清除搜尋內容
$("#clearSearchCondition").click(function () {
    restSearchOption();
})

function restSearchOption() {
    $('#suppliesName').val('');
    $('#suppliesSerno').val('');
    $('#vendorNameSearch').text('').append("<span class='undone-text'>請點選右方【選擇】鈕選擇供應商</span>");
    $('#invoiceAddressSearch').val('');
    $('#invoiceAddressSearch').empty();
    $('#invoiceAddressSearch').selectpicker('refresh');
    $('#prNumSearch').val('');
    $('#prNumSearch').empty();
    $('#prNumSearch').selectpicker('refresh');
    $('#purchaseEmpSearch').val('');
    $('#purchaseEmpSearch').empty();
    $('#purchaseEmpSearch').selectpicker('refresh');
    $('#ycNumSearch').val('');
    $('#ycNumSearch').empty();
    $('#ycNumSearch').selectpicker('refresh');
    $('#itemDescriptionSearch').val('');
    $('#PRDetailTable').attr('style', 'display:none');
}

function GetPRYCDByVendor(VendorNum, VendorSiteId) {
    $.ajax({
        url: '/BPR/GetPRNumYCNumByVendor',
        dataType: 'json',
        async: false,
        data: { VendorNum: VendorNum, VendorSiteId: VendorSiteId },
        type: 'POST',
        success: function (data, textStatus, jqXHR) {
            $("#prNumSearch").val("");
            $("#ycNumSearch").val("");
            $("#purchaseEmpSearch").val("");

            if (data.length != 0) {
                PRYCDetail = data;
                //var uniquePRNum = [...new Set(data.map(item => item.PRNUM))];
                var flag = [], uniquePRNum = [];
                for (var i = 0; i < data.length; i++) {
                    if (flag[data[i].PRNUM]) continue;
                    flag[data[i].PRNUM] = true;
                    uniquePRNum.push(data[i].PRNUM)
                }

                $("#prNumSearch").append($("<option></option>").attr("value", "").text("取消選擇"))

                $.each(uniquePRNum, function (index, value) {
                    var uniquePRID = $.grep(data, function (item, index) {
                        return item.PRNUM == value
                    });
                    $('#prNumSearch').append($('<option>').val(uniquePRID[0].PRID).text(value));
                });

                var flag = [], uniqueYCNum = [];
                for (var i = 0; i < data.length; i++) {
                    if (flag[data[i].BpaNum]) continue;
                    flag[data[i].BpaNum] = true;
                    uniqueYCNum.push(data[i].BpaNum)
                }

                //var uniqueYCNum = [...new Set(data.map(item => item.BpaNum))];
                $("#ycNumSearch").append($("<option></option>").attr("value", "").text("取消選擇"))
                $.each(uniqueYCNum, function (index, value) {
                    var uniqueYCID = $.grep(data, function (item, index) { return item.BpaNum == value });
                    $('#ycNumSearch').append($('<option>').val(uniqueYCID[0].YCID).text(value));
                });

                // var uniqueEmpNum = [...new Set(data.map(item => item.PurchaseEmpNum))];

                var flag = [], uniqueEmpNum = [];
                for (var i = 0; i < data.length; i++) {
                    if (flag[data[i].PurchaseEmpNum]) continue;
                    flag[data[i].PurchaseEmpNum] = true;
                    uniqueEmpNum.push(data[i].PurchaseEmpNum)
                }

                $("#purchaseEmpSearch").append($("<option></option>").attr("value", "").text("取消選擇"))
                $.each(uniqueEmpNum, function (index, value) {
                    var uniqueEmpName = $.grep(data, function (item, index) { return item.PurchaseEmpNum == value });
                    $('#purchaseEmpSearch').append($('<option>').val(value).text(uniqueEmpName[0].PurchaseEmpName + '(' + value + ')'));
                });
                $('#prNumSearch,#purchaseEmpSearch,#ycNumSearch').selectpicker('refresh');
            }
            else {
                $("#prNumSearch").val("");
                $("#prNumSearch option").remove();
                $("#prNumSearch").selectpicker("refresh")
                $("#ycNumSearch").val("");
                $("#ycNumSearch option").remove();
                $("#ycNumSearch").selectpicker("refresh")
                $("#purchaseEmpSearch").val("");
                $("#purchaseEmpSearch option").remove();
                $("#purchaseEmpSearch").selectpicker("refresh")
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

//查詢尚未轉成採購單的請購單明細join報價單
function getUnTransferPRDetail(vendorNum, vendorSiteID, pRID, yCID, purchaseEmpNum, itemDescription) {
    var result;
    $.ajax({
        url: '/BPR/GetUnTransferPRYCDetail',
        dataType: 'json',
        type: 'POST',
        async: false,
        data: { vendorNum: vendorNum, vendorSiteID: vendorSiteID, pRID: pRID, yCID: yCID, purchaseEmpNum: purchaseEmpNum, itemDescription: itemDescription },
        success: function (data, textStatus, jqXHR) {
            //console.log(data);
            if ($('#PRDetailTable .list-close-icon').length > 0) {
                $('#PRDetailTable .ExpandAllDetail').trigger('click');
            }
            $('tbody#searchResultTmpBody').nextAll().remove();
            $('#GeneratePODetail').hide();
            PRDetail = data;    //存下請購單查詢結果
            result = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
    return result;
}

//查詢後的畫面處裡
function renderPRDetailView(data) {
    if (data.length > 0) {
        //顯示請購明細&送貨層

        var flag = [], uniquePRNum = [];
        for (var i = 0; i < data.length; i++) {
            if (flag[data[i].PRNUM]) continue;
            flag[data[i].PRNUM] = true;
            uniquePRNum.push(data[i].PRNUM)
        }

        $.each(uniquePRNum, function (index, value) {
            var prGroup = $.grep(data, function (item, index) {
                return item.PRNUM == value;
            });

            var flag = [], uniqueQONum = [];
            for (var i = 0; i < prGroup.length; i++) {
                if (flag[prGroup[i].QuoteNum]) continue;
                flag[prGroup[i].QuoteNum] = true;
                uniqueQONum.push(prGroup[i].QuoteNum)
            }

            $.each(uniqueQONum, function (index2, value2) {
                var qoGroup = $.grep(prGroup, function (item, index) {
                    return item.QuoteNum == value2;
                });

                var flag = [], uniquePRDetail = [];
                for (var i = 0; i < qoGroup.length; i++) {
                    if (flag[qoGroup[i].PRDetailID]) continue;
                    flag[qoGroup[i].PRDetailID] = true;
                    uniquePRDetail.push(qoGroup[i].PRDetailID)
                }

                $.each(uniquePRDetail, function (index3, value3) {
                    var prDetailGroup = $.grep(qoGroup, function (item, index) {
                        return item.PRDetailID == value3;
                    });

                    var tmpTbody = $('#searchResultTmpBody').clone().attr('id', '');
                    var detailRowOneTD = $(tmpTbody).find('#detailRow1 td');
                    $(detailRowOneTD[0]).find('#YCID').val(prDetailGroup[0].YCID);
                    $(detailRowOneTD[1]).text(prDetailGroup[0].PRNUM).attr('prID', prDetailGroup[0].PRID);
                    $(detailRowOneTD[2]).text(prDetailGroup[0].BpaNum);
                    $(detailRowOneTD[3]).text(prDetailGroup[0].CategoryName);
                    $(detailRowOneTD[4]).text(prDetailGroup[0].ItemDescription);
                    $(detailRowOneTD[6]).text(prDetailGroup[0].UomName);
                    $(detailRowOneTD[7]).text(fun_accountingformatNumberdelzero(prDetailGroup[0].UnitPrice))
                    $(detailRowOneTD[9]).text(prDetailGroup[0].Price) //台幣價格隱藏欄位
                    var detailRowTwoTD = $(tmpTbody).find('#detailRow2 td');
                    $(detailRowTwoTD[0]).text(prDetailGroup[0].CurrencyName);//幣別
                    $(detailRowTwoTD[4]).text(prDetailGroup[0].ExchangeRate);//匯率
                    $(detailRowTwoTD[2]).text(prDetailGroup[0].ContactPerson);//聯絡人
                    $(detailRowTwoTD[3]).text(prDetailGroup[0].ContactEmail);//聯絡人Email
                    $(detailRowTwoTD[5]).text(prDetailGroup[0].PurchaseEmpName + '(' + prDetailGroup[0].PurchaseEmpNum + ')');
                    $(detailRowTwoTD[6]).text(prDetailGroup[0].InvoiceEmpName + '(' + prDetailGroup[0].InvoiceEmpNum + ')')
                        .attr('empName', prDetailGroup[0].InvoiceEmpName)
                        .attr('empNum', prDetailGroup[0].InvoiceEmpNum);

                    var flag = [], uniquePRDelivery = [];
                    for (var i = 0; i < prDetailGroup.length; i++) {
                        if (flag[prDetailGroup[i].PRDeliveryID]) continue;
                        flag[prDetailGroup[i].PRDeliveryID] = true;
                        uniquePRDelivery.push(prDetailGroup[i].PRDeliveryID)
                    }

                    var sum = 0;
                    $.each(uniquePRDelivery, function (index4, value4) {
                        var prDeliveryGroup = $.grep(prDetailGroup, function (item, index) {
                            return item.PRDeliveryID == value4;
                        });

                        var tmpDeliveryTR = $(tmpTbody).find('#searchResultTmpDelivery').clone().attr('id', '').attr('PRDeliveryID', prDeliveryGroup[0].PRDeliveryID);
                        var deliveryTD = $(tmpDeliveryTR).find('td');
                        sum += Number(prDeliveryGroup[0].Quantity);
                        $(deliveryTD[0]).append('<input type="checkbox" class="InnerDetailCheckbox" />' + fun_accountingformatNumberdelzero(prDeliveryGroup[0].Quantity));
                        $(deliveryTD[1]).text(prDeliveryGroup[0].ChargeDeptName);
                        $(deliveryTD[2]).text(prDeliveryGroup[0].RcvDeptName);
                        $(deliveryTD[3]).text(prDeliveryGroup[0].RcvDept);
                        $(tmpTbody).append(tmpDeliveryTR);
                    });
                    $(detailRowOneTD[5]).text(fun_accountingformatNumberdelzero(sum)); //加總送貨層數量
                    $(detailRowOneTD[8]).text(fun_accountingformatNumberdelzero(parseInt(prDetailGroup[0].UnitPrice) * sum)).append("<div class='btn-01-add ExpandDetail'><a><div class='glyphicon glyphicon-chevron-down  toggleArrow'></div></a></div>");;
                    $(tmpTbody).find('#searchResultTmpDelivery').remove();
                    $(tmpTbody).attr('PRDetailID', prDetailGroup[0].PRDetailID).attr('YADetailID', prDetailGroup[0].YADetailID).attr('YCDetailID', prDetailGroup[0].YCDetailID);
                    $('#PRDetailTable table').append($(tmpTbody).show());
                });
            });
        });

        $('#GeneratePODetail').show();
        $('#PRDetailTable').show(200);
    }
    else {
        alertopen("查無相關資訊");
    }
}

function renderPODetailBlock(tbody) {
    tbody = tbody.sort(function (a, b) {
        if (Number($(a).attr('prdetailid')) < Number($(b).attr('prdetailid'))) {
            return -1;
        }
        if (Number($(a).attr('prdetailid')) > Number($(b).attr('prdetailid'))) {
            return 1;
        }
        return 0;
    });

    $('tbody#resultTmpBody').nextAll().remove();
    var usedItem = [];
    var count = 0;
    var aryycdetailid = [];
    $.each(tbody, function (index, element) {
        var tmpTbody = $('#resultTmpBody').clone().attr('id', '').attr('PRDetailID', $(element).attr('PRDetailID')).attr('YADetailID', $(element).attr('YADetailID'));
        var detailRow1TD_search = $(element).find('#detailRow1 td');
        var detailRow1TD_result = $(tmpTbody).find('#detailRow1 td');
        var detailRow2TD_search = $(element).find('#detailRow2 td');
        var detailRow2TD_result = $(tmpTbody).find('#detailRow2 td');
        var tmpPRDetail = $(tmpTbody).attr("PRDetailID");
        var tmpUnitPrice = accounting.unformat($(this).eq(index).find("tr").find("td:eq(7)").html());

        if (usedItem.indexOf($(this).attr("ycdetailid")) == -1) {//如果沒有協議明細編號
            aryycdetailid.push({ tmpPRDetail: tmpPRDetail, tmpycdetailid: $(this).attr("ycdetailid") })
            usedItem.push($(this).attr("ycdetailid"));

            var detail = {
                "YADetailID": 0,
                "YAID": BPR.YAID,
                "PRDetailID": $(element).attr('PRDetailID'),
                "IsDelete": false,
                "CreateTime": null,
                "DeleteTime": null,
                "CreateBy": BPR.FillInEmpNum,
                "DeleteBy": null,
                "Amount": 0,
                "UnitPrice": accounting.unformat($(detailRow1TD_search[7]).text()),
                "Quantity": 0,
                "YearlyApprovedDeliveryList": []
            };
            count += 1;
            //編號
            $(detailRow1TD_result[0]).text(count);
            //採購分類
            $(detailRow1TD_result[1]).text($(detailRow1TD_search[3]).text());
            //品名描述
            $(detailRow1TD_result[2]).text($(detailRow1TD_search[4]).text());
            //數量
            $(detailRow1TD_result[3]).append("<b class=undone-text>系統自動帶入123</b>");
            //單位
            $(detailRow1TD_result[4]).text($(detailRow1TD_search[6]).text());
            //議價單價
            $(detailRow1TD_result[5]).text($(detailRow1TD_search[7]).text());

            //原幣報價單價
            $(detailRow2TD_result[0]).text($(detailRow2TD_search[8]).text());
            //最低報價
            $(detailRow2TD_result[1]).text($(detailRow1TD_search[9]).text());
            var tmpPRNum = $(detailRow1TD_search[1]).text();

            var tbodyQuantity = 0;

            $.each($(element).find('.InnerDetailShowBar').nextAll(), function (index, tr) {
                var deliveryTD_search = $(tr).find('td');
                tbodyQuantity += accounting.unformat($(deliveryTD_search[0]).text())

                if ($(deliveryTD_search[0]).find('input:checkbox').prop('checked')) {
                    var tmpDeliveryTR = $(tmpTbody).find('#resultTmpDelivery').clone().attr('id', '');
                    var deliveryTD_result = $(tmpDeliveryTR).find('td');
                    //最高數量
                    $(deliveryTD_result[0]).children('input').attr('max', $(deliveryTD_search[0]).text())
                                           .attr('placeholder', '請輸入數量(上限' + $(deliveryTD_search[0]).text() + ')')
                                           .attr('PRDeliveryID', $(tr).attr('PRDeliveryID')).val(fun_accountingformatNumberdelzero($(deliveryTD_search[0]).text()));
                    if ($(detailRow1TD_result[4]).text() == '金額') {
                        $(deliveryTD_result[0]).children('input').val($(deliveryTD_search[0]).text()).addClass('input-disable').attr("readonly", true);
                    }
                    //掛帳單位
                    $(deliveryTD_result[2]).text($(deliveryTD_search[1]).text());
                    //收貨單位
                    setDefaultSelect($(deliveryTD_result[3]).find("select[name=RcvDept]"), $(deliveryTD_search[3]).text());
                    $(deliveryTD_result[4]).text(tmpPRNum);
                    $(tmpTbody).append(tmpDeliveryTR);

                    var delivery = {
                        "YADeliveryID": 0,
                        "YADetailId": 0,
                        "PRDeliveryID": $(tr).attr('PRDeliveryID'),
                        "ShipmentQuantity": accounting.unformat($(deliveryTD_search[0]).text()),
                        "Amount": accounting.unformat($(deliveryTD_search[0]).text()) * accounting.unformat($(detailRow1TD_search[7]).text()),
                        "CancelDate": null,
                        "CancelReason": null,
                        "CancelBy": null,
                        "IsDelete": false,
                        "RcvDept": $(deliveryTD_search[3]).text(),
                        "RcvDeptName": $(deliveryTD_search[2]).text(),
                        "MaxQuantity": 0,
                    };

                    detail.YearlyApprovedDeliveryList.push(delivery);
                }
                detail.Quantity = tbodyQuantity;
            });

            BPR.YearlyApprovedDetailList.push(detail);
            $(tmpTbody).find('#resultTmpDelivery').remove();
            $('#BprDetailBlock table').append($(tmpTbody).show());
            $('#BprDetailBlock .deliveryAmount').trigger('change');
            reCalculatePoTotalPrice();
        }
        else {
            var tmpPRNum = $(detailRow1TD_search[1]).text();
            var tmpprdetail = $(this).attr("prdetailid")
            var tmpycdetailid = $(this).attr("ycdetailid")
            var prdetail;
            var useditemdescription = [];
            $("#PRDetailTable table").find("tbody").each(function (index, element) {
                var DetailCheckbox = false;
                var aryDetailCheckbox = [];
                $(element).find(".InnerDetailCheckbox").each(function (index) {
                    var flag = $(this).prop('checked');
                    if (flag) {
                        useditemdescription.push({ NO: $(this).parents("tbody").attr("prdetailid"), ycdetailid: $(this).parents("tbody").attr("ycdetailid") })
                    }
                });
            })

            var usedprdetail = $.grep(useditemdescription, function (obj) {
                return obj.ycdetailid == tmpycdetailid
            })
            prdetail = usedprdetail[0].NO;
            var detail = BPR.YearlyApprovedDetailList.find(function (x) {
                return x.PRDetailID == prdetail && x.IsDelete == false
            });

            var qq = 0;
            $.each($(element).find('.InnerDetailShowBar').nextAll(), function (index, tr) {
                var deliveryTD_search = $(tr).find('td');

                if ($(deliveryTD_search[0]).find('input:checkbox').prop('checked')) {
                    qq += accounting.unformat($(deliveryTD_search[0]).text());
                    var tmpDeliveryTR = $(tmpTbody).find('#resultTmpDelivery').clone().attr('id', '');
                    var deliveryTD_result = $(tmpDeliveryTR).find('td');
                    //最高數量
                    $(deliveryTD_result[0]).children('input').attr('max', $(deliveryTD_search[0]).text())
                                           .attr('placeholder', '請輸入數量(上限' + $(deliveryTD_search[0]).text() + ')')
                                           .attr('PRDeliveryID', $(tr).attr('PRDeliveryID')).attr('value', $(deliveryTD_search[0]).text());
                    if ($(detailRow1TD_result[4]).text() == '金額') {
                        $(deliveryTD_result[0]).children('input').val($(deliveryTD_search[0]).text()).addClass('input-disable').attr("readonly", true);
                    }
                    //掛帳單位
                    $(deliveryTD_result[2]).text($(deliveryTD_search[1]).text());
                    //收貨單位
                    setDefaultSelect($(deliveryTD_result[3]).find("select[name=RcvDept]"), $(deliveryTD_search[3]).text());
                    //請購單號
                    $(deliveryTD_result[4]).text(tmpPRNum);
                    var tmp = $(tmpTbody).find('tr:last').html()
                    $(tmpTbody).append(tmpDeliveryTR);
                    var delivery = {
                        "YADeliveryID": 0,
                        "YADetailId": 0,
                        "PRDeliveryID": $(tr).attr('PRDeliveryID'),
                        "ShipmentQuantity": accounting.unformat($(deliveryTD_search[0]).text()),
                        "Amount": accounting.unformat($(deliveryTD_search[0]).text()) * accounting.unformat($(detailRow1TD_search[7]).text()),
                        "CancelDate": null,
                        "CancelReason": null,
                        "CancelBy": null,
                        "IsDelete": false,
                        "RcvDept": $(deliveryTD_search[3]).text(),
                        "RcvDeptName": $(deliveryTD_search[2]).text(),
                        "MaxQuantity": 0,
                    };
                    detail.Quantity = qq;
                    detail.YearlyApprovedDeliveryList.push(delivery);
                    var tmp = $(tmpTbody).find('tr:last').html();
                    var tmp1 = $(tmpTbody).find('tr:last').clone();

                    $('#BprDetailBlock table').find("tbody").each(function () {
                        if ($(this).attr("prdetailid") == prdetail) {
                            $(this).find("tr:last").after("<tr >" + $(tmp1).html() + "</tr>");
                            setDefaultSelect($(this).find("tr:last").find("select[name=RcvDept]"), $(deliveryTD_search[3]).text());
                        }
                    })
                }
            });
            $(tmpTbody).find('#resultTmpDelivery').remove();
        }
        fn_accountTbodyAmountQuanity()
    });
    fn_accountTbodyAmountQuanity()
}

function fn_accountTbodyAmountQuanity() {
    var Amount = 0;
    $.each($("#BprDetailBlock").find("tbody").not("#resultTmpBody"), function (index, element) {
        var unitPrice = accounting.unformat($(element).find("td:eq(5)").text());
        var quantity = 0;
        $.each($(element).find('.deliveryAmount'), function (index) {
            quantity += parseInt(accounting.unformat($(this).val()));
            $(this).parents("tr").find("td:eq(1)").text(fun_accountingformatNumberdelzero(accounting.unformat($(this).val() * unitPrice)))
            $('#BprDetailBlock .deliveryAmount').trigger('blur');
        });
        $(this).find("tr#detailRow1").find("td:eq(3)").text(fun_accountingformatNumberdelzero(quantity))
        $(this).find("tr#detailRow1").find("td:eq(6)").text(fun_accountingformatNumberdelzero(accounting.unformat($(this).find("tr#detailRow1").find("td:eq(3)").text()) * accounting.unformat($(this).find("tr#detailRow1").find("td:eq(5)").text())))
        Amount += accounting.unformat($(this).find("tr#detailRow1").find("td:eq(6)").text());
        $('#BprDetailBlock .deliveryAmount').trigger('change');
    });
    $('#BprDetailBlock .deliveryAmount').trigger('change');
    $("#poTotalPrice").text(fun_accountingformatNumberdelzero(Amount))
}

//alert and show remodal
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

function draft() {
    ///<summary>暫存</summary>
    var deferred = $.Deferred();
    $.when(saveAndReturn()).always(function () {
        deferred.resolve();
    });
    return deferred.promise();
}

//暫存
function saveAndReturn() {
    console.log(BPR)

    var _url = BPR.BprNum ? '/BPR/Edit' : '/BPR/Create';
    if ($("#BprDetailBlock").is(':visible') === false) {
        resultBPRModel(BPR);
    }
    BPR.Amount = accounting.unformat($("#poTotalPrice").text());
    $.ajax({
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: BPR,
        async: false,
        success: function (data, textStatus, jqXHR) {
            if (data.Flag) {
                _formInfo.formGuid = data.FormGuid;
                _formInfo.formNum = data.FormNum;
                _formInfo.flag = data.Flag;

                //window.location.href = '/BPR/Edit/' + data.FormNum;
            }
            else {
                alert('失敗了!');
                window.location.href = '/BPR/Create';
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            _formInfo.flag = false;
        }
    });
}

//前端欄位檢核卡控
function Verify() {
    var deferred = $.Deferred();
    var aryFlag = [];
    if ($("#P_CurrentStep").val() == '1') {
        var Flag = true;
        $("[Errmsg=Y]").remove();
        if (!$("#vendorNameResult").text()) {
            alertopen("請選擇供應商");
            Flag = false;
        } else {
            $('.InnerDetailShowBar').parents('tbody').find('.deliveryAmount').each(function () {
                if ($(this).parents('tbody').attr('id') != "resultTmpBody") {
                    if ($(this).val() == 0) {
                        fun_AddErrMesg($(this), "deliveryAmountErr", "數量不可為0");
                        aryFlag.push("-1");
                    }
                    else {
                        aryFlag.push(0);
                    }
                }
            })
            var InvoiceValue = $("#invoiceLinks").find(".Links-peo").find("span").text();
            if (InvoiceValue == "") {
                fun_AddErrMesg($("#invoiceLinks").parents(".area-1"), "invoiceLinksErr", "請選擇發票管理人");
                Flag = false;
                aryFlag.push("-1");
            }

            var rtnValue = GetBPCReleaseAmountValue($("#QONum").text(), $("#poTotalPrice").text().trim());
            var rtn = rtnValue - accounting.unformat($("#poTotalPrice").text().trim()) >= 0 ? true : false;
            if (!rtn) {
                alertopen("已超出剩餘可核發金額!");//卡是否超過合約效期
                Flag = false;
                aryFlag.push("-1");
            }
            if ($("#P_Status").val() == 0) {//起點階段才檢查是否在途
                var rtnInproess = GetBPRInpressByPRDeliveryID();
                if (rtnInproess) {
                    aryFlag.push("-1")
                }
                else {
                    var flag = GetBPRIsVoidByPRDeliveryID()
                    if (flag) {
                        aryFlag.push("-1")
                    }
                };
            }
        }
        $(".ExpandInnerDetail").parents('tr').nextAll().show();
        $(".ExpandInnerDetail").parents('tr').next().hide();
    }
    Flag = aryFlag.indexOf("-1") > -1 ? false : true;

    if (Flag) {
        deferred.resolve();
    } else {
        deferred.reject();
    }
    return deferred.promise();
}

function resultBPRModel() {
    BPR = getModel();
}

function GetBPCReleaseAmountValue(id, Value) {
    var checkValue = 0;
    var _url = BPR.BprNum ? '/BPR/GetTotalReleaseAmountNotInByBPR' : '/BPR/GetBPCReleaseAmountValue';

    $.ajax({
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: {
            id: id, Value: Value, BprNum: $("#DocNum").text()
        },
        async: false,
        success: function (data, textStatus, jqXHR) {
            checkValue = data;
            console.log(checkValue);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            _formInfo.flag = false;
        }
    });

    return checkValue;
}

function GetBPRInpressByPRDeliveryID() {
    var YearlyApprovedDeliveryList = [];
    var checkValue = false;
    $('#resultTmpBody').siblings().each(function (index) {
        var detailIndex = index
        $(this).find('.deliveryAmount').each(function (index) {
            var PRDeliveryID = $(this).attr("prdeliveryid");
            var delivery = {
                "DetailNo": detailIndex,
                "DeliveryNo": index + 1,
                "PRDeliveryID": PRDeliveryID,
                "FormNo": null,
            };
            YearlyApprovedDeliveryList.push(delivery);
        })
    });

    var BprNum = $("#BprNum").val();

    if ($('#P_CurrentStep').val() == '1') {
        $.ajax({
            url: '/BPR/GetBPRInpressByPRDeliveryID',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify(YearlyApprovedDeliveryList),
            contentType: "application/json",
            async: false,
            success: function (data, textStatus, jqXHR) {
                var inPOArray = [];
                var strFormNo = "";
                var yErrArray = [];
                var alertMsg = "";
                var ID = $("#DocNum").text();
                $.each(data, function (index, value) {
                    var FormNos = JSON.parse(data[index].FormNo);
                    if (FormNos != null) {
                        for (var i = 0; i < FormNos.length; i++) {
                            strFormNo += FormNos[i].BprNum;
                        }
                        if (strFormNo != "") {
                            yErrArray.push("明細編號:" + data[index].DetailNo + " - 送貨編號:" + data[index].DeliveryNo + " 有在途表單:" + strFormNo)
                        }
                        $.each(yErrArray, function (index, yerr) {
                            alertMsg += yerr + "<br>";
                        });

                        if (alertMsg != "") {
                            $("#alertText").html(alertMsg);
                            $('[data-remodal-id=alert-modal]').remodal().open();
                            checkValue = true;
                        }//沒有在途超過合約問題再來判斷是不是已經被作廢了
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
                _formInfo.flag = false;
            }
        });

        return checkValue;
    }
}
function GetBPRIsVoidByPRDeliveryID() {
    var YearlyApprovedDeliveryList = [];
    var checkValue = false;
    $('#resultTmpBody').siblings().each(function (index) {
        var detailIndex = index
        $(this).find('.deliveryAmount').each(function (index) {
            var PRDeliveryID = $(this).attr("prdeliveryid");
            var delivery = {
                "DetailNo": detailIndex,
                "DeliveryNo": index + 1,
                "PRDeliveryID": PRDeliveryID,
                "FormNo": null,
            };
            YearlyApprovedDeliveryList.push(delivery);
        })
    });
    $.ajax({
        url: '/BPR/GetBPRIsVoidByPRDeliveryID',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(YearlyApprovedDeliveryList),
        contentType: "application/json",
        async: false,
        success: function (data, textStatus, jqXHR) {
            var inPOArray = [];
            var strFormNo = "";
            var yErrArray = [];
            var alertMsg = "";
            $.each(data, function (index, value) {
                var FormNos = JSON.parse(data[index].FormNo);
                if (FormNos != null) {
                    for (var i = 0; i < FormNos.length; i++) {
                        strFormNo += FormNos[i].PRDeliveryID;
                    }
                    if (strFormNo != "") {
                        yErrArray.push("明細編號:" + data[index].DetailNo + " - 送貨編號:" + data[index].DeliveryNo + "已作廢不可傳送")
                    }
                    $.each(yErrArray, function (index, yerr) {
                        alertMsg += yerr + "<br>";
                    });

                    if (alertMsg != "") {
                        $("#alertText").html(alertMsg);
                        $('[data-remodal-id=alert-modal]').remodal().open();
                        checkValue = true;
                    }//沒有在途超過合約問題再來判斷是不是已經被作廢了
                }
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            _formInfo.flag = false;
        }
    });
    return checkValue;
}

function fun_AddErrMesg(target, NewElementID, ErrMesg) {
    if ($("#" + NewElementID).length > 0) {
        $("#" + NewElementID).text(ErrMesg);
    }
    else {
        $(target).after('<div Errmsg="Y" alt="' + NewElementID + '" class="error-text"><span class="icon-error icon-error-size"></span>' + ErrMesg + '</div>')
    }
}

//傳送前的儲存
function Save() {
    $("#ApplyItem").val("供應商-" + BPR.VendorName);
    var _url = BPR.BprNum ? '/BPR/Edit' : '/BPR/Create';
    //console.log(BPR);
    BPR.Amount = accounting.unformat($("#poTotalPrice").text());
    var deferred = $.Deferred();
    if (btnReturn == 1 && btnConfirm == 1) {
        _formInfo.formGuid = BPR.YAID;
        _formInfo.formNum = BPR.BprNum;
        _formInfo.flag = true;

        if ($(".function-btn#Cancel").text() == "銷案") {
            $.when(CreditBudgetSave(_formInfo.formGuid)).always(function (data) {
                if (data.Status) {
                    deferred.resolve();
                } else {
                    _formInfo.flag = false
                    deferred.reject();
                }
            }
        )
        }
        else {
            deferred.resolve();
        }
    }
    else {
        $.ajax({
            async: false,
            url: _url,
            dataType: 'json',
            type: 'POST',
            data: BPR,
            success: function (data, textStatus, jqXHR) {
                if (data.Flag) {
                    _formInfo.formGuid = data.FormGuid;
                    _formInfo.formNum = data.FormNum;
                    _formInfo.flag = data.Flag;
                    $.when(CreditBudgetSave(data.FormGuid)).always(function (data) {
                        if (data.Status) {
                            deferred.resolve();
                        } else {
                            _formInfo.flag = false
                            deferred.reject();
                        }
                    }
                   )
                }
                else {
                    alert('儲存表單失敗!');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                _formInfo.flag = false;
            }
        });
        return deferred.promise();
    }

    return deferred.promise();
}

function ExportReport() {
    var id = BPR.BprNum;
    window.location.href = "/BPR/Report/" + BPR.BprNum;
}

//重新計算採購總金額
var SubTotal = 0;
function reCalculatePoTotalPrice() {
    var sumDetail = 0;
    $('.SubDetailPrice').each(function () {
        if (!isNaN(accounting.unformat($(this).text()))) {
            sumDetail += Number(accounting.unformat($(this).text()))
        }
    })

    $('#poTotalPrice').text(fun_accountingformatNumberdelzero(sumDetail));
    if (!isNaN($('#poTotalPrice').text())) {
        BPR.Amount = accounting.formatNumber($('#poTotalPrice').text());
    } else
        BPR.Amount = 0;
}

function resetTotalPriceUI(sum) {
    var children = $('#poTotalPrice').children();
    if (sum != 0) {
        $(children).hide();
        $('#poTotalPrice').text(accounting.formatNumber(sum, currency.extendedPrecision, ",")).append(children);
    }
    else {
        $(children).show();
        $('#poTotalPrice').text('').append(children);
    }
}

//重新計算送貨層明細金額
function reCalculateDeliveryPrice(tbody) {
    var result = BPR.YearlyApprovedDetailList.find(
        function (x) {
            return x.PRDetailID == $(tbody).attr('PRDetailID') && x.IsDelete == false
        });
    var detailObjList = [];
    var detailObjList = result.YearlyApprovedDeliveryList;
    $(detailObjList).each(function (index) {
        detailObjList[index].Amount = accounting.unformat($(this).find("tr").find('SubDetailPrice').text());
    })

    var sum = 0;
    var itemShipmentQuantity = 0;
    var allDelivery = $(tbody).find('input').find('.deliveryAmount').nextAll();

    $(tbody).find('.deliveryAmount').each(function (index) {
        detailObjList[index].ShipmentQuantity = accounting.unformat($(this).val());
        detailObjList[index].Amount = accounting.unformat($(this).parents('tr').find('td:eq(1)').text())
        detailObjList[index].RcvDept = $(this).parents('tr').find("select[name=RcvDept]").val();
        detailObjList[index].RcvDeptName = $(this).parents('tr').find("select[name=RcvDept] option:selected").text();
    })
}

//浮點數進位顯示
function MathRoundExtension(x, decimalPlaces) {
    x = x * Math.pow(10, decimalPlaces);
    x = Math.round(x);
    x = x / Math.pow(10, decimalPlaces);
    return x
}

//移除or重選發票管理人
function resetInvoiceEmp() {
    if (BPR.InvoiceEmpNum) {
        if ($('#P_CurrentStep').val() == '1' && $('#P_Status').val() != '4') {
            $('#invoiceLinks .no-file-text').hide();
            $('#invoiceLinks span').text(BPR.InvoiceEmpName + '(' + BPR.InvoiceEmpNum + ')');
            $('#invoiceLinks .Links').show();
        }
        else {
            $('#invoiceLinks').text(BPR.InvoiceEmpName + '(' + BPR.InvoiceEmpNum + ')');
        }
    }
    else {
        $('#invoiceLinks .Links').hide();
        $('#invoiceLinks span').text("");
        $('#invoiceLinks .no-file-text').show();
    }
}

//組織樹輸出查詢結果(自行改寫區塊)
function BprQueryTemp(datas, type, row) {
    BPR.InvoiceEmpName = datas[0].user_name;
    BPR.InvoiceEmpNum = datas[0].user_id;
    resetInvoiceEmp();
}

//重新帶入請購資訊
function resetPODetail() {
    BPR.YearlyApprovedDetailList = $.grep(BPR.YearlyApprovedDetailList, function (item, index) {
        return (item.YADetailID != 0);
    });
    $.each(BPR.YearlyApprovedDetailList, function (index, detailItem) {
        detailItem.IsDelete = true;
        detailItem.DeleteBy = BPR.FillInEmpNum;
        $.each(detailItem.YearlyApprovedDeliveryList, function (index2, deliveryItem) {
            deliveryItem.IsDelete = true;
        });
    });
}

function loadFormData() {
    if (!BPR.ApplicantName) {
        BPR.ApplicantEmpNum = $('input[name="ApplicantEmpNum"]').val();
        BPR.ApplicantName = $('input[name="ApplicantName"]').val();
        BPR.ApplicantDepName = $('input[name="ApplicantDepName"]').val();
        BPR.ApplicantDepId = $('input[name="ApplicantDepId"]').val();
    }

    if (BPR.PRNum) {
        $('#POResultBlock').show(200);
        $('#BprDetailBlock').show(200);
        //供應商
        $('#vendorNameResult').text(BPR.VendorName + '(' + BPR.VendorNum + ')');
        //發票地點
        $('#invoiceAddressResult').text(BPR.VendorSiteName);
        //請購單號PRNum
        $('#PRNum').text(BPR.PRNum);
        //報價單號QONum
        $('#QONum').text(BPR.BpaNum);
        //報價單幣別currency
        $('#currency').text(BPR.CurrencyName);
        $('#currencyRate').text(BPR.ExchangeRate);
        //核發次數
        $('#ReleaseNum').text("");
        //發票管理人
        resetInvoiceEmp();
        //採購備註
        if (BPR.Remark) {
            $('#PurchaseRemark').val(BPR.Remark).text(BPR.Remark);
        }
        //總金額
        $("#poTotalPrice").text(fun_accountingformatNumberdelzero(BPR.Amount))

        $.each(BPR.YearlyApprovedDetailList, function (index, elementDetail) {
            var tmpTbody = $('#resultTmpBody').clone().attr('id', '').attr('PRDetailID', elementDetail.PRDetailID);
            var detailRow1TD_result = $(tmpTbody).find('#detailRow1 td');
            //編號
            $(detailRow1TD_result[0]).text(index + 1);
            //採購分類
            $(detailRow1TD_result[1]).text(elementDetail.CategoryName);
            //品名描述
            $(detailRow1TD_result[2]).text(elementDetail.ItemDescription);
            //數量
            $(detailRow1TD_result[3]).text(elementDetail.Quantity != 0 ? fun_accountingformatNumberdelzero(elementDetail.Quantity) : '');
            //單位
            $(detailRow1TD_result[4]).text(elementDetail.UomName);
            //議價單價
            $(detailRow1TD_result[5]).text(fun_accountingformatNumberdelzero(elementDetail.UnitPrice));
            $(detailRow1TD_result[6]).text(fun_accountingformatNumberdelzero(elementDetail.UnitPrice * elementDetail.Quantity));

            $.each(elementDetail.YearlyApprovedDeliveryList, function (index, elementDelivery) {
                var tmpDeliveryTR = $(tmpTbody).find('#resultTmpDelivery').clone().attr('id', '');
                var deliveryTD_result = $(tmpDeliveryTR).find('td');
                //最高數量
                $(deliveryTD_result[0])
                    .children('input')
                    .attr('max', elementDelivery.MaxQuantity)
                    .attr('placeholder', '請輸入數量(上限' + elementDelivery.MaxQuantity + ')')
                    .attr('PRDeliveryID', elementDelivery.PRDeliveryID).attr('Amount', '')
                    .val(elementDelivery.ShipmentQuantity != 0 ? fun_accountingformatNumberdelzero(elementDelivery.ShipmentQuantity) : '');
                if ($(detailRow1TD_result[4]).text() == '金額') {
                    $(deliveryTD_result[0]).children('input').val(elementDelivery.ShipmentQuantity).addClass('input-disable');
                }
                $(deliveryTD_result[1]).text(fun_accountingformatNumberdelzero(elementDelivery.Amount))
                //掛帳單位
                $(deliveryTD_result[2]).text(elementDelivery.ChargeDept);
                //收貨單位
                setDefaultSelect($(deliveryTD_result[3]).find("select[name=RcvDept]"), elementDelivery.RcvDept);
                $(deliveryTD_result[4]).text(elementDelivery.PRNum);
                $(tmpTbody).append(tmpDeliveryTR);
            });

            $(tmpTbody).find('#resultTmpDelivery').remove();
            $('#BprDetailBlock table').append($(tmpTbody).show());
        });
        if ($('#P_CurrentStep').val() != '1' || $('#P_Status').val() == '4') {
            $('#BprDetailBlock tbody[id!="resultTmpBody"] input').addClass('input-disable').prop('disabled', true);
        }
        resetSubMenu();//設定側邊欄位目錄
    }
}
//取得目前匯率
function getCurrency(currencyCode) {
    $.ajax({
        async: false,
        url: '/BPR/GetCurrency',
        dataType: 'json',
        type: 'POST',
        data: {
            currencyCode: currencyCode
        },
        success: function (data, textStatus, jqXHR) {
            currency = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            currency.extendedPrecision = 0;
            alert(errorThrown);
        }
    });
}

//document ready
$(function () {
    setFieldStatus($('#P_CurrentStep').val(), $('#P_Status').val());
    $("[invoice]").hide();
    //取得後端Model
    BPR = getModel();
    initRcvDept();
    loadFormData();
    setFieldStatus($('#P_CurrentStep').val(), $('#P_Status').val());
    if ($("#P_CurrentStep").val() == 2 || $("#P_CurrentStep").val() == 3) {
        $("#invoiceLinks").text(BPR.InvoiceEmpName + "(" + BPR.InvoiceEmpNum + ")")
        $("#invoiceLinks").next("div").find("a").remove();
    }

    $(document).on("click", '.function-btn', function () {
        console.log($(this).text());
        if ($(this).text() == "銷案" || $(this).text() == "退回填表人" || $(this).text() == "退回") {
            btnReturn = 1;
            //  console.log("按了銷案或退回")
        } else {
            btnReturn = 0;
            //  console.log("銷案或退回")
        }
        // console.log(btnReturn);
    })

    $('[data-remodal-id=modal-sent]').on('click', '.remodal-confirm-btn', function () {
        if ($(this).text() == "確認") {
            btnConfirm = 1;
            //  console.log("按了確認")
            if (btnReturn == 1) {
                //    console.log("按了銷案確認")
            } else {
                //  console.log("按了銷案取消")
            }
        } else {
            btnConfirm = 0;
        }
    })

    //地址下拉選單異動
    $('#invoiceAddressSearch').change(function () {
        GetPRYCDByVendor($('#suppliesSerno').text(), $('#invoiceAddressSearch').val());
        $('#PRSearchRow').show(200);
    });

    $(document).on('click', '#Vender', function () {
        if ($(".prNum").text().length != 0) {
            if ($("#POResultBlock").is(':visible') && $("#BprDetailBlock").is(':visible')) {
                var ConfirmYN = confirm("重新選擇供應商將清除採購資訊區及採購明細區資訊");
            } else {
                var ConfirmYN = confirm("重新選擇供應商將清除查詢結果區資訊");
            }
            if (ConfirmYN) {
                restSearchOption();
                $("#PRDetailTable").hide();
                $("#POResultBlock").hide();
                $("#BprDetailBlock").hide();
                $(".prNum").text("");
                $("#PRNum").text("");
                openVendor(true, null);
            }
            else
                return false;
        }
        else {
            $("#prNumSearch").empty();
            $("#ycNumSearch").empty();
            $("#purchaseEmpSearch").empty();
            $('#invoiceAddressSearch').empty();
            openVendor(true, null);
        }
    });

    //下拉選單連動請購單號年度議價協議
    $('#prNumSearch').change(function () {
        var text = $(this).children('option').filter(':selected').text();
        $('#ycNumSearch').html('');
        if (text != '取消選擇') {
            var uniqueYCNum = PRYCDetail.map(function (item) {
                return { PRNUM: item.PRNUM, BpaNum: item.BpaNum, YCID: item.YCID }
            });

            var uniqueYCID = $.grep(uniqueYCNum, function (item, index) {
                return item.PRNUM === text;
            });
            $("#ycNumSearch").append($('<option>').val("").text("取消選擇"));

            $.each(uniqueYCID, function (index, value) {
                $('#ycNumSearch').append($('<option>').val(uniqueYCID[index].YCID).text(uniqueYCID[index].BpaNum));
            });

            $('#ycNumSearch option').each(function () {
                text = $(this).text();
                if ($("#ycNumSearch option:contains(" + text + ")").length > 1)
                    $("#ycNumSearch option:contains(" + text + "):gt(0)").remove();
            })
        }
        else {
            var uniqueYCNum = PRYCDetail.map(function (item) {
                return item.BpaNum
            })

            $("#ycNumSearch").append($("<option></option>").attr("value", "").text("取消選擇"))
            $.each(uniqueYCNum, function (index, value) {
                var uniqueYCID = $.grep(PRYCDetail, function (item, index) {
                    return item.BpaNum == value
                });
                $('#ycNumSearch').append($('<option>').val(uniqueYCID[0].YCID).text(value));
            });
        }
        $("#ycNumSearch").selectpicker('refresh');
    });

    function unique(array) {
        return array.filter(function (el, index, arr) {
            return index == arr.indexOf(el);
        });
    }

    $('#ycNumSearch').change(function () {
        var text = $(this).children('option').filter(':selected').text();
        $('#prNumSearch').html('');
        if (text != '取消選擇') {
            var uniquePRNum = PRYCDetail.map(function (item) {
                return item.PRNum
            })
            var uniquePRID = $.grep(PRYCDetail, function (item, index) {
                return item.BpaNum === text;
            });
            $("#prNumSearch").append($("<option></option>").attr("value", "").text("取消選擇"))
            $.each(uniquePRID, function (index, value) {
                $('#prNumSearch').append($('<option>').val(uniquePRID[index].PRID).text(uniquePRID[index].PRNUM));
            });

            $('#prNumSearch option').each(function () {
                text = $(this).text();
                if ($("#prNumSearch option:contains(" + text + ")").length > 1)
                    $("#prNumSearch option:contains(" + text + "):gt(0)").remove();
            })
        }
        else {
            var uniquePRNum = PRYCDetail.map(function (item) {
                return item.PRNUM
            });

            $("#prNumSearch").append($("<option></option>").attr("value", "").text("取消選擇"))
            $.each(uniquePRNum, function (index, value) {
                var uniquePRID = $.grep(PRYCDetail, function (item, index) {
                    return item.PRNUM == value
                })

                $('#prNumSearch').append($('<option>').val(uniquePRID[0]).text(value));
            });
        }
        $("#prNumSearch").selectpicker('refresh');
    });

    //查詢按鈕
    $('#SearchPRDetailBtn').click(function () {
        if ($("#PRNum").text() != "") {
            if ($("#POResultBlock").is(':visible') && $("#BprDetailBlock").is(':visible')) {
                var ConfirmYN = confirm("重新選擇供應商將清除採購資訊區及採購明細區資訊");
            } else {
                var ConfirmYN = confirm("重新選擇供應商將清除查詢結果區資訊");
            }
            if (ConfirmYN) {
                restSearchOption();
                $("#POResultBlock").hide();
                $("#BprDetailBlock").hide();
                $("#PRNum").text("");
                $(".prNum").text("");
            }
            else
                return false;
        } else {
            var data = getUnTransferPRDetail(
                $('#suppliesSerno').text(),
                $('#invoiceAddressSearch').val(),
                $('#prNumSearch option:selected').length > 0 ? $('#prNumSearch').val() : null,
                $('#ycNumSearch option:selected').length > 0 ? $('#ycNumSearch').val() : null,
                $('#purchaseEmpSearch option:selected').length > 0 ? $('#purchaseEmpSearch').val() : null,
                $('#itemDescriptionSearch').val());
            renderPRDetailView(data);
            resetSubMenu();
        }
    });

    //展開
    $(document).on('click', '.ExpandDetail', function () {
        var trChevron = $(this).parents('tr').siblings();
        if ($(this).find('div.glyphicon-chevron-down').length > 0) {
            trChevron.show();
            trChevron.find('.ExpandInnerDetail').parents('tr').nextAll().show();
            trChevron.eq(0).hide();
            trChevron.eq(1).hide();
            trChevron.find('.ExpandInnerDetail').parents('tr').next().hide();
            trChevron.find('.ExpandInnerDetail').find('span').text('收合');
        }
        else if ($(this).find('div.glyphicon-chevron-up').length > 0) {
            trChevron.hide();
            $(this).find('span').text('展開');
        }
        $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    });
    //展開
    $(document).on('click', '.ExpandInnerDetail', function () {
        if ($(this).find('span').text() == '展開') {
            $(this).parents('tr').nextAll().show();
            $(this).parents('tr').next().hide();
        }
        else if ($(this).find('span').text() == '收合') {
            $(this).parents('tr').nextAll().hide();
            $(this).parents('tr').next().show();
        }
        $(this).find('span').toggleText('展開', '收合');
    });
    //展開
    $('.ExpandAllDetail').click(function () {
        if ($(this).find('div.list-open-icon').length > 0) {
            $(this).parents('table').find('.ExpandDetail').each(function (index, element) {
                if ($(element).find('div.glyphicon-chevron-down').length > 0) {
                    $(element).trigger('click');
                }
            });
            $(this).parents('table').find('tbody .ExpandInnerDetail').each(function (index, element) {
                if ($(element).find('span').text() == '展開') {
                    $(element).trigger('click');
                }
            });
        }
        else
            if ($(this).find('div.list-close-icon').length > 0) {
                $(this).parents('table').find('.ExpandDetail').each(function (index, element) {
                    if ($(element).find('div.glyphicon-chevron-down').length >= 0) {
                        $(element).trigger('click');
                    }
                });

                $(this).parents('table').find('tbody .ExpandInnerDetail').each(function (index, element) {
                    if ($(element).find('span').text() == '收合') {
                        $(element).trigger('click');
                    }
                });
            }

        $(this).find('.toggleArrow').toggleClass('list-open-icon list-close-icon');
    });

    //checkbox監聽
    $('#PRDetailTable table').on('change', '.DetailCheckbox', function () {
        $('#PRDetailTable table .InnerDetailCheckbox').unbind('change');
        if ($(this).prop('checked')) {
            $(this).parents('tbody').find('.InnerDetailCheckbox').prop('checked', true);
        }
        else {
            $(this).parents('tbody').find('.InnerDetailCheckbox').prop('checked', false);
        }
        $('#PRDetailTable table .InnerDetailCheckbox').bind('change');
    });
    //checkbox監聽
    $('#PRDetailTable table').on('change', '.InnerDetailCheckbox', function () {
        var tbody = $(this).parents('tbody');
        if ($(tbody).find('#detailRow1 td').eq(6).text() == '金額') {
            $(tbody).find('.DetailCheckbox').prop('checked', $(this).prop('checked'));
            $(tbody).find('.DetailCheckbox').trigger('change');
        }
        else {
            var innerCheckbox = $(tbody).find('.InnerDetailCheckbox');
            var checkedCount = $.grep(innerCheckbox, function (element, index) {
                return $(element).prop('checked');
            });
            if (innerCheckbox.length == checkedCount.length) {
                $(tbody).find('.DetailCheckbox').prop('checked', true);
            }
            else {
                $(tbody).find('.DetailCheckbox').prop('checked', false);
            }
        }
    });

    //建立明細
    $('#GeneratePODetail').click(function () {
        var checkedTbody = $('.InnerDetailCheckbox:checked').parents('tbody');

        var prNumArray = checkedTbody.map(function () { return $(this).find('.prNum').text(); }).toArray().filter(function (element, index, arr) {
            return checkedTbody.map(function () { return $(this).find('.prNum').text(); }).toArray().indexOf(element) === index;
        });
        var qoNumArray = checkedTbody.map(function () { return $(this).find('.qoNum').text(); }).toArray().filter(function (element, index, arr) {
            return checkedTbody.map(function () { return $(this).find('.qoNum').text(); }).toArray().indexOf(element) === index;
        });
        var invoiceEmpArray = checkedTbody.map(function () { return $(this).find('.invoiceEmp').text(); }).toArray().filter(function (element, index, arr) {
            return checkedTbody.map(function () { return $(this).find('.invoiceEmp').text(); }).toArray().indexOf(element) === index;
        });
        var YCIDArray = checkedTbody.map(function () { return $(this).find('#YCID').val(); }).toArray().filter(function (element, index, arr) {
            return checkedTbody.map(function () { return $(this).find('.YCID').text(); }).toArray().indexOf(element) === index;
        });

        if (qoNumArray.length != 1 || invoiceEmpArray.length != 1) {
            alertopen('年度協議單號必須相同');
        }
        else {
            resetPODetail();
            $('#PRDetailTable').hide();
            $('#POResultBlock').show(200);

            //供應商
            $('#vendorNameResult').text($('#suppliesName').text() + '(' + $('#suppliesSerno').text() + ')');
            BPR.VendorName = $('#suppliesName').text();
            BPR.VendorNum = $('#suppliesSerno').text();
            //供應商地址
            $('#invoiceAddressResult').text($('#invoiceAddressSearch > option:selected').text());
            BPR.VendorSiteId = $('#invoiceAddressSearch').val();
            BPR.VendorSiteName = $('#invoiceAddressSearch > option:selected').text();
            //聯絡人
            $('#ContactPerson').val($(checkedTbody[0]).find('#detailRow2').find("td:eq(2)").text() == "null" ? "" : $(checkedTbody[0]).find('#detailRow2').find("td:eq(2)").text())
            BPR.ContactPerson = $('#ContactPerson').val()
            BPR.YCID = $(checkedTbody).find('#YCID').val();

            //聯絡人郵件地址
            $('#ContactEmail').val($(checkedTbody[0]).find('#detailRow2').find("td:eq(3)").text() == "null" ? "" : $(checkedTbody[0]).find('#detailRow2').find("td:eq(3)").text())
            BPR.ContactEmail = $('#ContactEmail').val();
            //請購單
            $('#PRNum').text(prNumArray[0]);
            BPR.PRID = $(checkedTbody).eq(0).find('.prNum').attr('prID');
            //匯率
            $('#currencyRate').text($(checkedTbody[0]).find('#detailRow2').find("td:eq(4)").text())
            BPR.ExchangeRate = $('#currencyRate').text();
            //採購單
            $('#QONum').text(qoNumArray[0]);
            //幣別
            $('#currency').text($(checkedTbody[0]).find('#detailRow2 td:first-child').text());
            BPR.CurrencyCode = $('#currency').text();

            //發票管理人
            BPR.InvoiceEmpName = $(checkedTbody).eq(0).find('.invoiceEmp').attr('empName');
            BPR.InvoiceEmpNum = $(checkedTbody).eq(0).find('.invoiceEmp').attr('empNum');
            resetInvoiceEmp();

            ////核發次數
            $('#ReleaseNum').text("");
            //採購備註
            $('#PurchaseRemark').val('');

            $('#BprDetailBlock').show(200);
            renderPODetailBlock(checkedTbody);//建立明細表
            if ($("#BprDetailBlock").find('div.list-open-icon').length > 0) {
                $('.ExpandAllDetail').trigger("click");
            }
            resetSubMenu();
        }
    });

    $('#BprDetailBlock').on('change', '#selRcvDept', function () {
        var tbody = $(this).parents('tbody');
        reCalculateDeliveryPrice(tbody);
    })

    $('#BprDetailBlock').on('fcous', '.deliveryAmount', function () {
        return accounting.unformat($(this).val())
    })

    //送貨層數量event
    $('#BprDetailBlock').on('blur', '.deliveryAmount', function () {
        var value = accounting.unformat($(this).val());
        if (value <= 0) {
            $(this).val("");
        }
        else {
            $(this).val(accounting.unformat(($(this).val())));
            if (isNaN($(this).val())) {
                $(this).val(0);
            }
            else {
                $(this).val(fun_accountingformatNumberdelzero($(this).val()));
            }
        }
        if (parseInt($(this).val()) == 0) {
            $(this).val("");
        }

        var UnitAmount = accounting.unformat($(this).val());
        var UnitPrice = Number(accounting.unformat($(this).parents('tbody').find('td').eq(5).text()));
        var DetailPrice = UnitAmount * UnitPrice
        var sumPrice = 0;
        $(this).parents('tr').find('td').eq(1).text(fun_accountingformatNumberdelzero(DetailPrice));
        $(this).parents('tr').find('td').eq(1).attr('class', 'DeliveryPrice');
        $(this).parents('tbody').find('tr').eq(0).find('td').eq(6).attr('class', 'SubDetailPrice');
        var sumAmount = 0;
        $(this).parents('tbody').find('.deliveryAmount').each(function (index, element) {
            if (!isNaN($(this).val() && $(this).val().length > 0)) {
                sumAmount += Number(accounting.unformat($(this).val()));
            }
        })

        $(this).parents('tbody').find('tr').eq(0).find('td').eq(3).text(sumAmount == 0 ? "系統自動帶入" : fun_accountingformatNumberdelzero(sumAmount))
        var SubAmount = accounting.unformat($(this).parents('tbody').find('td').eq(3).text()) == "系統自動帶入" ? 0 : accounting.unformat($(this).parents('tbody').find('td').eq(3).text())
        sumPrice = SubAmount * UnitPrice
        $(this).parents('tbody').find('tr').eq(0).find('td').eq(6).text(fun_accountingformatNumberdelzero(sumPrice))

        var sumDtail = 0;
        reCalculatePoTotalPrice();
        //設定BPR值
        var tbody = $(this).parents('tbody');

        if ($(tbody).attr('id') != 'resultTmpBody') {
            console.log(($(tbody).attr('PRDetailID')));
            var detailObj = BPR.YearlyApprovedDetailList.find(function (x) {
                return x.PRDetailID == $(tbody).attr('PRDetailID') && x.IsDelete == false
            });

            var deliveryObj = $.find(detailObj.YearlyApprovedDeliveryList, function (y) {
                return y.PRDeliveryID === $(this).attr('PRDeliveryID') && y.IsDelete == false
            })
            if (Number($(this).val()) > ($(this).attr('max'))) {
                $(this).val(0);
                $(this).parents('tr').find('td').eq(1).text(0)

                sumAmount = 0;
                $.each($(tbody).find('.InnerDetailShowBar').nextAll(), function (index, element) {
                    sumAmount += Number($(element).find('.deliveryAmount').val());
                });
                alertopen('超過該筆送貨層上限了!');
                $(this).val("");
                deliveryObj.ShipmentQuantity = 0;

                $(this).parents('tbody').find('tr').eq(0).find('td').eq(3).text(sumAmount);
                subUnitPrice = accounting.unformat($(this).parents('tbody').find('tr').eq(0).find('td').eq(5).text());
                sumPrice = sumAmount * subUnitPrice;
                $(this).parents('tbody').find('tr').eq(0).find('td').eq(6).text(sumPrice)//明細表金額歸零
                reCalculatePoTotalPrice();
                reCalculateDeliveryPrice(tbody)
            }
            else {
                var sum = 0;
                $.each($(tbody).find('.InnerDetailShowBar').nextAll(), function (index, element) {
                    sum += Number(accounting.unformat($(element).find('.deliveryAmount').val()));
                });

                if (detailObj != undefined) {
                    detailObj.UnitPrice = accounting.unformat($(tbody).find("#detailRow1").find('td').eq(5).text());
                    detailObj.Amount = accounting.unformat($(tbody).find("#detailRow1").find('td').eq(6).text());
                    detailObj.Quantity = accounting.unformat($(tbody).find("#detailRow1").find('td').eq(3).text());
                }
                reCalculateDeliveryPrice(tbody);
                reCalculatePoTotalPrice();
            }
        }
    })

    //明細議價金額event
    $('#BprDetailBlock').on('change', '.itemPrice', function () {
        var tbody = $(this).parents('tbody');

        //議價金額大於報價金額，不做任何事
        var prices = $(this).parents('tbody');
        if ($(this).val() > prices.Price) {
            $(this).val('');

            alertopen("議價金額不可大於報價金額，請重新輸入");
        } else {
            var detailRow1TD = $(tbody).find('#detailRow1 td');
            var children = $(detailRow1TD[6]).children();
            var YADetailID = $(tbody).attr('YADetailID');

            var detailObj = $.find(BPR.YearlyApprovedDetailList, function (x) {
                return x.YADetailID == $(tbody).attr('YADetailID') && x.IsDelete == false
            })

            if ($(this).val()) {
                $(this).val(accounting.toFixed($(this).val(), currency.extendedPrecision));
                detailObj.UnitPrice = $(this).val();
                $(children[0]).hide();
                var price = MathRoundExtension(Number($(this).val()) * Number($(detailRow1TD[3]).text()), currency.extendedPrecision);
                $(detailRow1TD[6]).text(accounting.formatNumber(price, currency.extendedPrecision, ","));
                $(detailRow1TD[6]).append(children);
                $(this).val(accounting.formatNumber($(this).val(), currency.extendedPrecision, ","));
            }
            else {
                $(children[0]).show();
                $(detailRow1TD[6]).text('');
                $(detailRow1TD[6]).append(children);
            }
            reCalculatePoTotalPrice();
            reCalculateDeliveryPrice(tbody);
        }
    });

    //發票管理人xx event
    $(document).on('click', '.glyphicon-remove', function () {
        var divID = $(this.closest('div .area-fix02-2')).attr('id');
        switch (divID) {
            case 'invoiceLinks':
                BPR.InvoiceEmpName = null;
                BPR.InvoiceEmpNum = null;
                resetInvoiceEmp();
                break;
        }
        resetSubMenu();
    });

    //聯絡人onchange事件
    $('#ContactPerson').change(function () {
        BPR.ContactPerson = $(this).val();
    });

    //聯絡人郵件地址onchange事件
    $('#ContactEmail').change(function () {
        BPR.ContactEmail = $(this).val();
    });

    //採購備註onchange事件
    $('#PurchaseRemark').change(function () {
        BPR.Remark = $(this).val();
    });
});

function initRcvDept() {
    thrOneTimeDetail_RcvDept = $.ajax({
        url: "/PR/GetHrDepartment/",   //存取Json的網址
        type: "POST",
        cache: false,
        data: {
            PRnum: $("hidPRNum").val()
        },
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data) {
                $.each(data, function (index, obj) {
                    $("select[name=RcvDept]").append($("<option></option>").attr("data-subtext", obj.DeptCode).attr("value", obj.DeptCode).text(obj.DeptName))
                })
            }
            else {
                //  $("#popPROneTimeDetail").find("tbody[dataloading]").find("span").text("取得收貨單位失敗")
            }
        },
        error: function (err) {
            $("#popPROneTimeDetail").find("tbody[dataloading]").find("span").text("取得收貨單位失敗")
        }
    })
}

function OverrideOrgPickerSetting(step) {
    switch (step) {
        case 1:
            return {
                allowRole: ["JA18000078"]
            };
            break;
        case 2:
            return {
                allowRole: ["JA18000226"]
            };
            break;
    }
}
//結案後傳FIIS
var FiisExecuted = false;
function completedToFiis() {
    var deferred = $.Deferred();
    if (FiisExecuted === false) {
        // FiisExecuted = true;
        //執行呼叫FIIS
        if (_clickButtonType == 3) {
            var _url = '/BPR/FIISCreateBPR';
            $.ajax({
                //async: false,
                url: _url,
                dataType: 'json',
                type: 'POST',
                data: BPR,
                success: function (data, textStatus, jqXHR) {
                    _formInfo.flag = data;
                    deferred.resolve();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('FIIS建立年度議價核發單失敗!\n' + jqXHR.responseText);
                    _formInfo.flag = false;
                    deferred.reject();
                }
            })
        }
    }
    return deferred.promise();
}

function setDefaultSelect(target, value) {
    $(target).data('selectpicker', null);
    $(target).find("option[value='" + value + "']").attr("selected", "selected")
    $(target).change();
    $(target).parents(".bootstrap-select").find("button:first").remove();
    $(target).selectpicker('refresh');
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

window.onload = function () {
    $('#BprDetailBlock .deliveryAmount').trigger('change');
    resetSubMenu();
};