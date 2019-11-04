//採購單主檔json全域變數
var PO;
//定義查詢的請購明細
var PRDetail;

//ajax GET從Server取得資料
function Get(id, serverUrl) {
    var deferred = $.Deferred();
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: encodeURI(serverUrl),
        success: function (data) {
            //console.log(data)
            var response = { id: id, data: data }
            deferred.resolve(response);
        },
        error: function (data) {
            console.log("錯誤")
            deferred.reject(data);
        }
    });
    return deferred.promise();
}

//ajax POST從Server取得資料
function Post(id, serverUrl, updatedata) {
    var deferred = $.Deferred();
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: serverUrl,
        data: updatedata,
        success: function (data) {
            //console.log(data)
            var response = { id: id, data: data }
            deferred.resolve(response);
        },
        error: function (data) {
            console.log("錯誤")
            deferred.reject(data);
        }
    });
    return deferred.promise();
}


function UIReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var action = arguments[1];
    switch (action.type) {
        case 'reCalculatePoTotalPrice':
            state = 1;
            break;
        case 'resetTotalPriceUI':
            state = 2;
            break;
        case 'reCalculateDeliveryPrice':
            state = 3;
            break;
        case 'Thousands':
            state = 4;
            break;
        case 'Response':
            state = 10;
            break;
        default:
            return state;
    }
    var result = { state: state, id: action.id, data: action.data };
    return result;
}

//將Server上取得的資料放到中間層
var FetchData = function (store) {
    return function (next) {
        return function (action) {
            if (action.type === 'Get') {
                $.when(Get(action.id, action.url)).then(function (response) {
                    //console.log(response);
                    action.type = 'GetResult'
                    action.id = action.id
                    action.data = response.data
                    var result = next(action);
                    //console.log('next state', store.getState());
                    return result;
                })
            } else if (action.type === 'Post') {
                $.when(Post(action.id, action.url, action.data)).then(function (response) {
                    //console.log(response);
                    action.type = 'Response'
                    action.id = action.id
                    action.data = response.data
                    var result = next(action);
                    //console.log('next state', store.getState());
                    return result;
                });

            } else if (action.type === 'PostPartial') {
                $.when(PostPartial(action.id, action.url, action.data)).then(function (response) {
                    //console.log(response);
                    action.type = 'RenderPartial'
                    action.id = action.id
                    action.data = response.data
                    var result = next(action);
                    //console.log('next state', store.getState());
                    return result;
                });
            } else {
                var result = next(action);
                console.log('next state', store.getState());
                return result;
            }
        };
    };
};


let fetch = Redux.applyMiddleware(FetchData)

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
var store = Redux.createStore(UIReducer, fetch);

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.
store.subscribe(function () {
    var actionResult = store.getState();
    var bo = new BussinessLogical();
    switch (actionResult.state) {
        case 1:
            bo.reCalculatePoTotalPrice();
            break;
        case 2:
            bo.resetTotalPriceUI(actionResult.data.sum, actionResult.data.afterPointerLen);
            break;
        case 3:
            bo.reCalculateDeliveryPrice(actionResult.data.tbody);
            break;
        case 4:
            bo.Thousands(actionResult.data.selector);
            break;
        case 10:
            bo.Response(actionResult.id, actionResult.data);
            break;
        default:
            break;
    }
    console.log(store.getState());
});

//業務邏輯
function BussinessLogical() {
    this.PreperData = function (id) {
        var data = $("#" + id).serializeObject();
        return data;
    }
}

//重新計算採購總金額
BussinessLogical.prototype.reCalculatePoTotalPrice = function()  {
    var sum = 0;
    var afterPointerLen = 0;

    $.each($('.itemTotalPrice'), function (index, element) {
        var detailPriceElement = $(element).clone();
        $(detailPriceElement).find("b").text();
        var detailPrice = accounting.unformat($(detailPriceElement).text());  //若有千分位還原回來
        sum += Number(detailPrice);
        //因為明細有多筆，若某筆有小數以該筆為此次計算結果的小數位數
        if (afterPointerLen === 0) { 
            afterPointerLen = pointerPos(detailPrice.toString());
        }
        //if (detailPrice.indexOf('.') > -1) {
        //    if (Number.isInteger(sum) && sum > 0) {
        //        sum = accounting.formatNumber(sum, currency.extendedPrecision, ",");
        //    }
        //    sum += Number(detailPrice)
        //} else {
        //    if (!Number.isInteger(sum)) {
        //        sum += accounting.formatNumber(detailPrice, currency.extendedPrecision, ",");
        //    } else {
        //        sum += accounting.unformat(detailPrice);
        //    }
        //}
    });
    //if (_.isString(sum) === true) {
    //    if (sum.indexOf('.') > -1) {
    //        sum = parseFloat(sum)
    //        sum = accounting.formatNumber(sum, currency.extendedPrecision, ",");
    //    } else {
    //        sum = parseInt(sum)
    //    }
    //}
    //resetTotalPriceUI(sum, afterPointerLen);
    //計算採購總金額
    store.dispatch({ type: 'resetTotalPriceUI', data: { sum: sum, afterPointerLen: afterPointerLen } });
    PO.Amount = sum;
}

//請購總金額顯示頁面
BussinessLogical.prototype.resetTotalPriceUI = function(sum, afterPointerLen) {
    var children = $('#poTotalPrice').children();
    if (sum != 0) {
        $(children).hide();
        //正整數或浮點數的顯示
        if (sum.toString().indexOf('.') > -1) {
            $('#poTotalPrice').text(accounting.formatNumber(sum, afterPointerLen, ",")).append(children);
        } else {
            var sumFormat = accounting.formatNumber(sum);
            $('#poTotalPrice').text(sumFormat).append(children);
        }
    }
    else {
        $(children).show();
        $('#poTotalPrice').text('').append(children);
    }
}

//重新計算送貨層明細金額
BussinessLogical.prototype.reCalculateDeliveryPrice = function (tbody) {
    //var detailObjList = PO.PurchaseOrderDetailList.find(x=>x.QDetailID == $(tbody).attr('QDetailID') && x.IsDelete == false).PurchaseOrderDeliveryList;
    var detailObjList = _.pluck(_.where(PO.PurchaseOrderDetailList, { QDetailID: parseInt($(tbody).attr('QDetailID')), IsDelete: false }), "PurchaseOrderDeliveryList")[0];
    var itemAmout = Number(accounting.unformat($(tbody).find('td').eq(3).text()));
    var itemPrice = accounting.unformat($(tbody).find('.itemPrice').val());
    var sum = 0;
    var allDelivery = $(tbody).find('.InnerDetailShowBar').nextAll();
    $.each(allDelivery, function (index, element) {
        var deliveryPrice = 0;
        var startPointerLen = pointerPos(itemPrice.toString());
        if (index + 1 != $(allDelivery).length) {
            deliveryPrice = MathRoundExtension(Number(accounting.unformat($(element).find('.deliveryAmount').val())) * itemPrice, startPointerLen);
            sum += deliveryPrice;
        }
        else {
            ////deliveryPrice = MathRoundExtension(itemAmout * itemPrice - sum, startPointerLen);
            deliveryPrice = MathRoundExtension(Number(accounting.unformat($(element).find('.deliveryAmount').val())) * itemPrice, startPointerLen);
            sum += deliveryPrice;
        }
        if (deliveryPrice == 0) {
            detailObjList[index].Amout = 0;
            $(element).find('td').eq(1).empty().append('<b class="undone-text">系統自動帶入</b>');
        }
        else {
            var startPointerLen = pointerPos(deliveryPrice.toString());
            var value = accounting.formatNumber(deliveryPrice, startPointerLen, ",");
            detailObjList[index].Amout = accounting.unformat(value);
            if (itemPrice.toString().indexOf(".") > -1) {
                $(element).find('td').eq(1).text(value);
            } else {
                $(element).find('td').eq(1).text(accounting.formatNumber(deliveryPrice));
            }
        }
    });
    //reCalculatePoTotalPrice(sum);
    store.dispatch({ type: 'reCalculatePoTotalPrice' })
}

//取得Server相關資料
BussinessLogical.prototype.Response = function (id, data) {
    id = "#" + id;
    if ($(id).is('select')) {   //判斷是Select Tag
        $(id).empty().selectpicker("refresh")
        if (id === "#RcvDept") {
            $.each(data, function (index, obj) {
                $("select[name=RcvDept]").append($("<option></option>").attr("data-subtext", obj.DeptCode).attr("value", obj.DeptCode).text(obj.DeptName))
            })
        }
        //$(id).selectpicker('refersh');
        //$('select').selectpicker();
        setTimeout(function () {
            $('.selectpicker').selectpicker('refresh');
        }, 1000)

    }
}

//設定千分位
BussinessLogical.prototype.Thousands = function (selector) {
    console.log($(selector).val())
    var nativeVal = $(selector).val().toString();
    if (nativeVal !== "") {
        if (nativeVal.indexOf('.') > -1) {
            var afterPointer = pointerPos(nativeVal);
            $(selector).val(accounting.formatNumber(nativeVal, afterPointer)); //加上千分位
        } else {
            $(selector).val(accounting.formatNumber(nativeVal)); //加上千分位
        }
    }
}

//幣別精確度
var currency = {
    "currencyCode": null,
    "currencyName": null,
    "currencyDescription": null,
    "extendedPrecision": 0
};

//如關卡類別為依表單欄位，各表單需實作特定關卡取得下一關人員清單
function GetPageCustomizedList(stepSequence) {
    if (stepSequence == 3) {
        return { SignedID: [PO.InvoiceEmpNum], SignedName: [PO.InvoiceEmpName] };
    }
}

//確認選擇供應商，更新供應商名稱 & 重設側邊選單
function vendorSelected(vendor) {
    if (vendor) {
        suppliesUIChange(vendor.supplierName, vendor.supplierNumber,vendor.supplierID);

        $('#invoiceAddressSearch').empty();
        $.each(vendor.supplierSite, function (index, element) {
            $('#invoiceAddressSearch').append($('<option>').val(element.supplierSiteID).text(element.supplierSiteCode));
        });
        $('#invoiceAddressSearch').val('').selectpicker('refresh');
    }
}

//供應商變更的UI操作
function suppliesUIChange(name, number,id) {
    $('#suppliesName').text(name);
    $('#suppliesSerno').text(number);
    $('#suppliesId').text(id);
    $('#vendorNameSearch').text(name + '(' + number + ')');
}

//toggleText extend
$.fn.extend({
    toggleText: function (a, b) {
        return this.text(this.text() == b ? a : b);
    }
});

//取得已結案&未轉採購的請購單號，以及請購單明細註記的採購經辦
function getPRNumAndPurchaseEmp() {
    $.ajax({
        url: '/PO/GetPRNumAndPurchaseEmp',
        dataType: 'json',
        type: 'POST',
        data:{VendorNum :$('#suppliesSerno').text(),VendorSiteId:$('#invoiceAddressSearch').val()},
        success: function (data, textStatus, jqXHR) {
            $('#prNumSearch,#purchaseEmpSearch').empty();
            //設定請購單號
            var prNums = _.uniq(data, function (item) { return item.PRNum })
            $("#prNumSearch").append($("<option></option>").attr("value", "").text("取消選擇"))
            _.each(prNums, function (item) {
                $('#prNumSearch').append($('<option>').val(item.PRID).text(item.PRNum));
            })

            //報價經辦
            var prEmps = _.uniq(data, function (item) { return item.PurchaseEmpNum })
            $("#purchaseEmpSearch").append($("<option></option>").attr("value", "").text("取消選擇"))
           _.each(prEmps, function (item) {
               $('#purchaseEmpSearch').append($('<option>').val(item.PurchaseEmpNum).text(item.PurchaseEmpName + '(' +item.PurchaseEmpNum + ')'));
           })
            $('#prNumSearch,#purchaseEmpSearch').selectpicker('refresh');
        },
            error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

//查詢尚未轉成採購單的請購單明細join報價單
function getUnTransferPRDetail(vendorNum, vendorSiteID, pRID, purchaseEmpNum, itemDescription) {
    var result;
    $.ajax({
        url: '/PO/GetUnTransferPRDetail',
        dataType: 'json',
        type: 'POST',
        async: false,
        data: { vendorNum: vendorNum, vendorSiteID: vendorSiteID, pRID: pRID, purchaseEmpNum: purchaseEmpNum, itemDescription: itemDescription },
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
        //取得uniq的請購單
        var uniquePRNum = _.uniq(data, function (item) { return item.PRNum })
            //循序取得每筆請購單
        _.each(uniquePRNum, function (prNumItem) {
            //該請購單相關的資料集
            var prGroup = _.where(data, {PRNum:prNumItem.PRNum});
            //該請購單下Uniq的報價單號
            var uniqueQONum = _.uniq(prGroup, function (item) { return item.QuoteNum})
            _.each(uniqueQONum, function (qItem) {
                //循序取得每個報價單的相關資料
                var qoGroup = _.where(prGroup, {QuoteNum:qItem.QuoteNum });
                //每個報價單下的請購明細
                var uniquePRDetail = _.uniq(qoGroup, function (item) { return item.PRDetailID });
                _.each(uniquePRDetail, function (prDetailGroup) {
                    //取得送貨明細
                    var uniquePRDelivery = _.uniq(_.where(data, {PRDetailID:prDetailGroup.PRDetailID}),function(item){return item.PRDeliveryID});
                        //加總送貨層數量
                    var sum = _.chain(uniquePRDelivery)
                              .pluck('Quantity')   //取得數量欄位
                              .reduce(function (memo, no) { return memo + Number(no) }, 0)   //加總
                              .value()

                        //Undescore Template,產生請購明細及送或層查詢結果
                    var prDetailTemp = _.template($("script.template#prDetail").html())
                        //數字千分位
                    var priceLength = prDetailGroup.ForeignPrice.toString().split(".").length
                    if (priceLength === 1) {
                        prDetailGroup.ForeignPrice = accounting.format(prDetailGroup.ForeignPrice)
                    } else {
                        var pointLength = prDetailGroup.ForeignPrice.toString().split(".")[1].length
                        prDetailGroup.ForeignPrice = accounting.format(prDetailGroup.ForeignPrice, pointLength)
                    }
   
                    if (prDetailGroup.UomCode === "AMT") {
                        prDetailGroup.Sum = sum
                    } else {
                        prDetailGroup.Sum = accounting.format(sum)
                        //送貨數量若單位不是金額
                        _.each(uniquePRDelivery, function (item) {
                            if (item.Quantity.toString().split(".").length === 1) {
                                item.Quantity = accounting.format(item.Quantity)
                        }
                        })
                    }
                    prDetailGroup.PRDeliverys = uniquePRDelivery
                        //console.log(prDetailTemp(prDetailGroup))
                    $('#PRDetailTable table').append(prDetailTemp(prDetailGroup));
        });
        });
    });
        //判斷是否為最低報價
        //var uniquePRDetail = [...new Set(data.map(item => item.PRDetailID))];
        var uniquePRDetail = _.uniq(_.pluck(data, "PRDetailID"));
        $.each(uniquePRDetail, function (index, value) {
            var tbodyList = $('#PRDetailTable tbody[prdetailid="' + value + '"]');
            if ($(tbodyList).length > 1) {
                tbodyList = tbodyList.sort(function (a, b) {
                    if (Number($(a).find('.Price').text()) < Number($(b).find('.Price').text())) {
                        return -1;
                }
                    if (Number($(a).find('.Price').text()) > Number($(b).find('.Price').text())) {
                        return 1;
                }
                    return 0;
                });
        }
            $.each(tbodyList, function (index2, element) {
                if (Number($(element).find('.MinPrice').text()) >= Number($(element).find('.Price').text())) {
                    $($(element).find('#detailRow1 td')[7]).empty().append('是<div class="btn-01-add ExpandDetail"><a><div class="glyphicon glyphicon-chevron-down  toggleArrow"></div></a></div>');
                }
                else {
                    $($(element).find('#detailRow1 td')[7]).empty().append('否<div class="btn-01-add ExpandDetail"><a><div class="glyphicon glyphicon-chevron-down  toggleArrow"></div></a></div>');
            }
            });
        });

        $('#GeneratePODetail').show();
        $('#PRDetailTable').show(200);
    }
}

//產生採購明細
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

    //if ($('#PODetailBlock .list-close-icon').length > 0) {
    //    $('#PODetailBlock .ExpandAllDetail').trigger('click');
    //}
    $('tbody#resultTmpBody').nextAll().remove();

    $.each(tbody, function (index, element) {
        var tmpTbody = $('#resultTmpBody').clone().attr('id', '').attr('PRDetailID', $(element).attr('PRDetailID')).attr('QDetailID', $(element).attr('QDetailID'));
        var detailRow1TD_search = $(element).find('#detailRow1 td');
        var detailRow1TD_result = $(tmpTbody).find('#detailRow1 td');
        var detailRow2TD_search = $(element).find('#detailRow2 td');
        var detailRow2TD_result = $(tmpTbody).find('#detailRow2 td');
        var detail = {
            "PODetailID": 0,
            "POID": PO.POID,
            "QDetailID": parseInt($(element).attr('QDetailID')),
            "LineQuantity": 0,
            "UnitPrice": 0,
            "IsMixPrice": $(detailRow1TD_search[7]).text() == '是' ? true : false,
            "CreateBy": PO.FillInEmpNum,
            "IsDelete": false,
            "DeleteBy": null,
            "PurchaseOrderDeliveryList": []
        };
        //編號
        $(detailRow1TD_result[0]).text(index + 1);
        //採購分類
        $(detailRow1TD_result[1]).text($(detailRow1TD_search[3]).text());
        //品名描述
        $(detailRow1TD_result[2]).text($(detailRow1TD_search[4]).text());
        //數量
        $(detailRow2TD_result[2]).text(0);
        //單位
        $(detailRow2TD_result[3]).text($(detailRow1TD_search[6]).text())
        //原幣報價單價
        $(detailRow2TD_result[0]).text($(detailRow2TD_search[1]).text());
        //最低報價
        $(detailRow1TD_result[3]).text($(detailRow1TD_search[7]).text());
        //為了Two Way Bind多定義ID及Name
        //議價單價
        var unitprice = $(detailRow2TD_result[1]).find('input[type=text]');
        $(unitprice).attr("id", "UnitPrice[" + index + "]");
        $(unitprice).attr("name", "UnitPrice[" + index + "]");
        //明細總金額
        var detailAmount = detailRow1TD_result[4];
        $(detailAmount).attr("id", "DetailAmount[" + index + "]");
        $(detailAmount).attr("name", "DetailAmount[" + index + "]");
        //var ExpandDetail = '<div class="btn-01-add ExpandDetail"><a><div class="glyphicon glyphicon-chevron-down  toggleArrow"></div></a></div>';
        //$(detailAmount).append(ExpandDetail);

        $.each($(element).find('.InnerDetailShowBar').nextAll(), function (index, tr) {
            var delivery = {
                "PODeliveryID": 0,
                "PODetailID": 0,
                "PRDeliveryID": parseInt($(tr).attr('PRDeliveryID')),
                "Quantity": 0,
                "Amout": 0,
                "IsDelete": false
            };
            var deliveryTD_search = $(tr).find('td');
            if ($(deliveryTD_search[0]).find('input:checkbox').prop('checked')) {
                var tmpDeliveryTR = $(tmpTbody).find('#resultTmpDelivery').clone().attr('id', '');
                var deliveryTD_result = $(tmpDeliveryTR).find('td');
                if ($(detailRow2TD_result[3]).text() == '金額') {
                    //最高數量
                    $(deliveryTD_result[0]).children('input')
                                            .attr('max', $(deliveryTD_search[0]).text())
                                            .attr('placeholder', '請輸入數量(原送貨數量' + $(deliveryTD_search[0]).text() + ')')
                                            .val($(deliveryTD_search[0]).text())   //預設帶入上限值
                                            .attr('PRDeliveryID', $(tr).attr('PRDeliveryID'));
                    //合計數量
                    var quantity = Number($(detailRow2TD_result[2]).text()) + Number($(deliveryTD_search[0]).text())
                    $(detailRow2TD_result[2]).text(quantity)
                    //$(deliveryTD_result[0]).children('input').val($(deliveryTD_search[0]).text()).addClass('input-disable').attr("readonly", true);
                } else {
                    //最高數量
                    $(deliveryTD_result[0]).children('input')
                                            .attr('max', $(deliveryTD_search[0]).text())
                                            .attr('placeholder', '請輸入數量(上限' + $(deliveryTD_search[0]).text() + ')')
                                            .val($(deliveryTD_search[0]).text())    //預設帶入上限值
                                            .attr('PRDeliveryID', $(tr).attr('PRDeliveryID'));
                    var quantity = Number(accounting.unformat($(detailRow2TD_result[2]).text())) + Number(accounting.unformat($(deliveryTD_search[0]).text()))
                    $(detailRow2TD_result[2]).text(accounting.formatNumber(quantity))
                }
                //Two Way Bind多定義ID及Name
                //送貨數量
                //var quantity = $(deliveryTD_result[0]).find('input[type=text]');
                //$(quantity).attr("id", "Quantity[" + index + "]");
                //$(quantity).attr("name", "Quantity[" + index + "]");
                //送貨層明細金額
                //var amount = deliveryTD_result[1];
                //$(amount).attr("id", "Amount[" + index + "]");
                //$(amount).attr("name", "Amount[" + index + "]");

                //掛帳單位
                $(deliveryTD_result[2]).text($(deliveryTD_search[1]).text());
                //收貨單位
                var rcvDept = $(deliveryTD_search[2]).attr("data-value");
                delivery.RcvDept = rcvDept;
                delivery.RcvDeptName = $(deliveryTD_search[2]).text();
                delivery.Quantity = accounting.unformat($(deliveryTD_search[0]).text())
                setDefaultSelect($(deliveryTD_result[3]).find("select[name=RcvDept]"), rcvDept);

                $(tmpTbody).append(tmpDeliveryTR);
                detail.PurchaseOrderDeliveryList.push(delivery);
            }
        });
        PO.PurchaseOrderDetailList.push(detail);
        $(tmpTbody).find('#resultTmpDelivery').remove();
        $('#PODetailBlock table').append($(tmpTbody).show());
        //$('#PODetailBlock .deliveryAmount').trigger('change');
        //reCalculatePoTotalPrice();
        store.dispatch({ type: 'reCalculatePoTotalPrice' })

    });
}

//alert and show remodal
function alertopen(text) {
    $('#alertOK').unbind();
    $('#alertText').empty();
    if (typeof (text) != typeof ([])) {
        var textSpan = "<span class='popup-text-left'>" + text +  "</span>"
        $('#alertText').append(textSpan);
        $('[data-remodal-id=alert-modal]').remodal().open();
    }
    else {
        var textContent = ""    
        if (text.length < 1) {
            return;
        } else {
            $.each(text, function (index, value) {
                textContent += "<span class='popup-text-left'>" + value + "</span>"
            });
        }
        $('#alertText').append(textContent);
        $('[data-remodal-id=alert-modal]').remodal().open();
        //$('#alertOK').on('click', alertopen);
    }
}

function messageOpen(text) {
    //$('[data-remodal-id=alert-modal]').remove()
    $("#remodelMessageBox").remove()
    $("#remodelConfirmBox").remove()
    var messageTemp = _.template($("script.template#messageBox").html())
    var msgObj = { Title: "輔助說明", ConfirmMessage: false, MessageId: "remodelMessageBox"}
    if (typeof (text) != typeof ([])) {
        msgObj.Texts = [text]
        $("#InformationSection").after(messageTemp(msgObj))
        $('[data-remodal-id=alert-modal]').remodal().open();
    }
    else {
        msgObj.Texts = text
        $("#InformationSection").after(messageTemp(msgObj))
        $('[data-remodal-id=alert-modal]').remodal().open();
        //$('#alertOK').on('click', alertopen);
    }
}

//確認視窗按下確認執行結果
$(document).on('closed', '.remodal', function (e) {
    // Reason: 'confirmation', 'cancellation'
    if($(this).attr("id") === "remodelConfirmBox") {
        if (e.reason === 'confirmation') {
            $("#POResultBlock").hide(200)
            $("#PODetailBlock").hide(200)
            openVendor(true, null)
        }
    }
});

//已有採購資料,確認要覆蓋
$("#vendor").click(function () {
    if (($("#POResultBlock").is(':visible') === true) && ($("#PODetailBlock").is(':visible') === true)) {
        var result = confirm("已有採購資料,確認要覆蓋");
        if (result == true) {
            $("#POResultBlock").hide(200)
            $("#PODetailBlock").hide(200)
            openVendor(true, null)
        }
    } else if ($("#PRDetailTable").is(':visible') === true) {
        var result = confirm("已有請購查詢資料,確認要覆蓋");
        if (result == true) {
            $("#PRDetailTable").hide(200)
            openVendor(true, null)
        }
    } else {
        openVendor(true, null)
    }
})

//清除搜尋內容
$("#clearSearchCondition").click(function () {
    $('#suppliesName').val('');
    $('#suppliesSerno').val('');
    $('#suppliesId').val('');
    $('#vendorNameSearch').text('').append("<span class='undone-text'>請點選右方【選擇】鈕選擇供應商</span>");
    $('#invoiceAddressSearch').val('');
    $('#invoiceAddressSearch').selectpicker('refresh');
    $('#prNumSearch').val('');
    $('#prNumSearch').selectpicker('refresh');
    $('#purchaseEmpSearch').val('');
    $('#purchaseEmpSearch').selectpicker('refresh');
    $('#itemDescriptionSearch').val('');
    $('#PRDetailTable').attr('style', 'display:none');
})

//暫存
function draft() {
        var deferred = $.Deferred();
        var _url = PO.PONum ? '/PO/Edit' : '/PO/Create';
        $.ajax({
            url: _url,
            dataType: 'json',
            type: 'POST',
            data: PO,
            success: function (data, textStatus, jqXHR) {
                if (data.Flag) {
                    window.location.href = '/PO/Edit/' + data.FormNum;
                    _formInfo = {
                        formGuid: data.FormGuid,
                        formNum: data.FormNum,
                        flag: data.Flag
                    }
                     deferred.resolve();
                }
                else {
                    alert('失敗了!');
                    deferred.reject();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                deferred.reject();
            }
        });
        return deferred.promise();
}

//錯誤訊息
function fun_AddErrMesg(target, NewElementID, ErrMesg) {
    if ($("#" +NewElementID).length > 0) {
        $("#" +NewElementID).text(ErrMesg);
    }
    else {
        if ($(target).siblings().length === 0) {
            $(target).after('<div Errmsg="Y" alt="' + NewElementID + '" class="error-text"><span class="icon-error icon-error-size"></span>' + ErrMesg + '</div>')
        }
 }
}

//前端欄位檢核卡控
function Verify() {
    var deferred = $.Deferred();

    //檢查議價單價及送貨數量需輸入
    var chkAry = [];
    var prdeliverys = [];

    if (PO.InvoiceEmpNum === null) {
        chkAry.push("請輸入發票管理員");
    }

    if ($(".MeetingRecord").is(':visible')) {
        if (!$(".MeetingRecord").is(':checked')) {
            chkAry.push("請選擇:是否檢附董事會會議紀錄");
        }
    }
        if (($("#POResultBlock").is(':visible') === false) && ($("#PODetailBlock").is(':visible') === false)) {
            chkAry.push("請購明細相關資料，尚未建立無法傳送");
        }
        $('#resultTmpBody').siblings().each(function (index) {
            if ($(this)[0].tagName === 'TBODY') {
                if(_.isEmpty($(this).find('#detailRow2 input').val())) {
                //console.log("明細編號:" + String(index) + " 議價金額必填")
                chkAry.push("明細編號:" + String(index) + " 議價金額必填")
            } else {
                console.log($(this).find('#detailRow2 input').val())
            }
            var detailIndex = index
            $(this).find('.input.h30.deliveryAmount').each(function (index) {
                if(_.isEmpty($(this).val())) {
                    //console.log("明細編號:" + String(detailIndex) + " - 送貨編號:" + String(index) + "送貨數量必填")
                    chkAry.push("明細編號:" + String(detailIndex) + " - 送貨編號:" + String(index + 1) + " 送貨數量必填")
                }
                //寫入在途表單相關資料,第一關才需要
                if ($('#P_CurrentStep').val() == '1') {
                    var deliveryObj = { "DetailNo": String(detailIndex), "DeliveryNo": String(index + 1), "PRDeliveryID": $(this).attr("prdeliveryid") };
                    prdeliverys.push(deliveryObj);
                }
            })

              //檢查單位是金額時,AMT = 1
            if ($(this).find('#detailRow2>td').eq(3).text() === "金額") {
                if ($(this).find('#detailRow2>td').eq(2).text() != "1") {
                    chkAry.push("明細編號:" + String(detailIndex) + " - 單位是金額時，數量必須等於1")
                }
            }
            }
        })

        //檢查是否上傳董事會會議記錄
        if (_.isNull(PO.MeetingRecord)) {
            PO.MeetingRecord = false
            }
        if (_.isString(PO.MeetingRecord)) {
            PO.MeetingRecord = (PO.MeetingRecord === 'true');
            }
        if (PO.MeetingRecord === true) {
            var file = $('.fileList').find('.fileDetail').find('.fileName').text()
            if (file == "") {
                FileUploadFlag = -1;
                fun_AddErrMesg($(".dndregion").find('.row'), "unUploadErr", "請上傳董事會會議紀錄");
                chkAry.push("請上傳董事會會議紀錄")
            }
            else {
                FileUploadFlag = 0;
                $('.unUploadErr').remove();
                deferred.resolve();
            }
            } else {
            deferred.resolve();
        }

    //檢查送貨層是否被作廢
        if (prdeliverys.length > 0 && $('#P_CurrentStep').val() == '1') {
            $.ajax({
                url: '/PO/GetDeliveryVoided',
                dataType: 'json',
                type: 'POST',
                data: JSON.stringify({ Deliverys: prdeliverys }),
                contentType: "application/json;charset=utf-8",
                success: function (data, textStatus, jqXHR) {
                    var voidedArray = [];
                    $.each(data, function (index, value) {
                        //判斷是否作廢
                        if (data[index].Voided) {
                                    voidedArray.push("明細編號:" + data[index].DetailNo + " - 送貨編號:" + data[index].DeliveryNo + " 已被作廢")
                                }
                    });
                    //將錯誤陣列合併
                    var errArray = _.union(chkAry, voidedArray);
                    if (errArray.length > 0) {
                        messageOpen(errArray)
                        deferred.reject();
                    } else {
                        deferred.resolve();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    deferred.reject();
                }
            });
        } else {
            //將錯誤陣列合併
            if (chkAry.length > 0) {
                messageOpen(chkAry)
                deferred.reject();
            } else {
                deferred.resolve();
            }
        }


    //檢查送貨層是否在途
        if (prdeliverys.length > 0 && $('#P_CurrentStep').val() == '1') {
            $.ajax({
                url: '/PO/GetDeliveryInprogress',
                dataType: 'json',
                type: 'POST',
                data: JSON.stringify({ Deliverys: prdeliverys }),
                contentType: "application/json;charset=utf-8",
                success: function (data, textStatus, jqXHR) {
                    var inPOArray = [];
                    $.each(data, function (index, value) {
                        if (!_.isNull(value.FormNums)) {
                            if (value.FormNums.length > 0) {
                                //判斷不包含目前自己的採購單號
                                var excludeOwner = _.filter(JSON.parse(data[index].FormNums), function (item) { return item.PONUM !== PO.PONum });
                                if (excludeOwner.length > 0) {
                                    inPOArray.push("明細編號:" + data[index].DetailNo + " - 送貨編號:" + data[index].DeliveryNo + " 有在途表單:" + _.pluck(excludeOwner, "PONUM").join())
                                }
                            }
                        }
                    });
                    //將錯誤陣列合併
                    var errArray = _.union(chkAry, inPOArray);
                    if (errArray.length > 0) {
                        messageOpen(errArray)
                        deferred.reject();
                    } else {
                        deferred.resolve();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    deferred.reject();
                }
            });
        } else {
            //將錯誤陣列合併
            if (chkAry.length > 0) {
                messageOpen(chkAry)
                deferred.reject();
            } else {
                deferred.resolve();
            }
        }
        return deferred.promise();
}


//傳送前的儲存
function Save() {
    $("#ApplyItem").val("供應商-" + PO.VendorName);
     var deferred = $.Deferred();
     //傳送需往後端送
     if (_clickButtonType === 1) {
         var _url = PO.PONum ? '/PO/Edit' : '/PO/Create';
         $.ajax({
             url: _url,
             dataType: 'json',
             type: 'POST',
             data: PO,
             success: function (data, textStatus, jqXHR) {
                 if (data.Flag) {
                     _formInfo.formGuid = data.FormGuid;
                     _formInfo.formNum = data.FormNum;
                     _formInfo.flag = data.Flag;
                     //呼叫信用卡預算控管API
                     $.when(CreditBudgetSave(data.FormGuid)).always(function (data) {
                         if (data.Status) {
                             deferred.resolve();
                         } else {
                             _formInfo.flag = false
                             deferred.reject();
                         }
                     }
                     )
                 } else {
                     alert('儲存表單失敗!');
                     deferred.reject();
                 }

             },
             error: function (jqXHR, textStatus, errorThrown) {
                 deferred.reject();
             }
         });
     } else if (_clickButtonType === 2) {
         _formInfo.formGuid = PO.POID;
         _formInfo.formNum = PO.PONum;
         _formInfo.flag = true;
         //銷案時呼叫信用卡預算控管API
         $.when(CreditBudgetSave(_formInfo.formGuid)).always(function (data) {
             if (data.Status) {
                 deferred.resolve();
             } else {
                 _formInfo.flag = false
                 deferred.reject();
             }
         }
         )
     } else {
         _formInfo.formGuid = PO.POID;
         _formInfo.formNum = PO.PONum;
         _formInfo.flag = true;
         deferred.resolve();
     }
        return deferred.promise();
}

//結案後傳FIIS
 var FiisExecuted = false;
 function completedToFiis() {
     var deferred = $.Deferred();
     if (FiisExecuted === false) {
            FiisExecuted = true;
            //執行呼叫FIIS
            if (_formInfo.flag && _clickButtonType == 3) {
                var _url = '/PO/FIISCreatePO';
                $.ajax({
                    url: _url,
                    dataType: 'json',
                    type: 'POST',
                    data: PO,
                    success: function (data, textStatus, jqXHR) {
                        _formInfo.flag = data;
                        deferred.resolve();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('FIIS建立採購單失敗!\n' + jqXHR.responseText);
                        _formInfo.flag = false;
                        deferred.reject();
                    }
                })
            }
     }
        return deferred.promise();
}

 //取得有小數位數長度，最大4位
 function pointerPos(val) {
     var afterPointer = 0;
     if (val.indexOf('.') > -1) {
         //如果是浮點數，則小數位數最大4位
         var pointerStart = val.indexOf('.') + 1;
         afterPointer = val.substring(pointerStart).length;
         if (afterPointer > 4) {
             afterPointer = 4;
         }
     }
     return afterPointer;
 }


//重新計算採購總金額
//function reCalculatePoTotalPrice() {
//    var sum = 0;
//    var afterPointerLen = 0;

//        $.each($('.itemTotalPrice'), function (index, element) {
//            var detailPriceElement = $(element).clone();
//            $(detailPriceElement).find("b").remove();
//            var detailPrice = accounting.unformat($(detailPriceElement).text());  //若有千分位還原回來
//            sum += Number(detailPrice);
//            afterPointerLen = pointerPos(detailPrice.toString());
//            //if (detailPrice.indexOf('.') > -1) {
//            //    if (Number.isInteger(sum) && sum > 0) {
//            //        sum = accounting.formatNumber(sum, currency.extendedPrecision, ",");
//            //    }
//            //    sum += Number(detailPrice)
//            //} else {
//            //    if (!Number.isInteger(sum)) {
//            //        sum += accounting.formatNumber(detailPrice, currency.extendedPrecision, ",");
//            //    } else {
//            //        sum += accounting.unformat(detailPrice);
//            //    }
//            //}
//        });
//        //if (_.isString(sum) === true) {
//        //    if (sum.indexOf('.') > -1) {
//        //        sum = parseFloat(sum)
//        //        sum = accounting.formatNumber(sum, currency.extendedPrecision, ",");
//        //    } else {
//        //        sum = parseInt(sum)
//        //    }
//        //}
//        resetTotalPriceUI(sum,afterPointerLen);
//        PO.Amount = sum;
//        }

    //請購總金額顯示頁面
//    function resetTotalPriceUI(sum, afterPointerLen) {
//            var children = $('#poTotalPrice').children();
//            if (sum != 0) {
//                $(children).hide();
//                //正整數或浮點數的顯示
//                if (sum.toString().indexOf('.') > -1) {
//                    $('#poTotalPrice').text(accounting.formatNumber(sum, afterPointerLen, ",")).append(children);
//                } else {
//                    var sumFormat = accounting.formatNumber(sum);
//                    $('#poTotalPrice').text(sumFormat).append(children);
//                }
//            }
//            else {
//                $(children).show();
//                $('#poTotalPrice').text('').append(children);
//            }
//}

//重新計算送貨層明細金額
    //function reCalculateDeliveryPrice(tbody) {
    //    //var detailObjList = PO.PurchaseOrderDetailList.find(x=>x.QDetailID == $(tbody).attr('QDetailID') && x.IsDelete == false).PurchaseOrderDeliveryList;
    //    var detailObjList = _.pluck(_.where(PO.PurchaseOrderDetailList, { QDetailID: parseInt($(tbody).attr('QDetailID')), IsDelete: false }), "PurchaseOrderDeliveryList")[0];
    //    var itemAmout = Number($(tbody).find('td').eq(3).text());
    //    var itemPrice = accounting.unformat($(tbody).find('.itemPrice').val());
    //    var sum = 0;
    //    var allDelivery = $(tbody).find('.InnerDetailShowBar').nextAll();
    //    $.each(allDelivery, function (index, element) {
    //        var deliveryPrice = 0;
    //        var startPointerLen = pointerPos(itemPrice.toString());
    //        if (index + 1 != $(allDelivery).length) {
    //            deliveryPrice = MathRoundExtension(Number($(element).find('.deliveryAmount').val()) * itemPrice, startPointerLen);
    //            sum += deliveryPrice;
    //        }
    //        else {
    //            ////deliveryPrice = MathRoundExtension(itemAmout * itemPrice - sum, startPointerLen);
    //            deliveryPrice = MathRoundExtension(Number($(element).find('.deliveryAmount').val()) * itemPrice, startPointerLen);
    //            sum += deliveryPrice;
    //    }
    //    if (deliveryPrice == 0) {
    //        detailObjList[index].Amout = 0;
    //        $(element).find('td').eq(1).empty().append('<b class="undone-text">系統自動帶入</b>');
    //    }
    //    else {
    //        var startPointerLen = pointerPos(deliveryPrice.toString());
    //        var value = accounting.formatNumber(deliveryPrice, startPointerLen, ",");
    //        detailObjList[index].Amout = accounting.unformat(value);
    //        if (itemPrice.toString().indexOf(".") > -1) {
    //            $(element).find('td').eq(1).text(value);
    //        } else {
    //            $(element).find('td').eq(1).text(deliveryPrice);
    //        }
    //    }
    //    });
    //    //reCalculatePoTotalPrice(sum);
    //    store.dispatch({ type: 'reCalculatePoTotalPrice' })

    //}

//浮點數進位顯示
function MathRoundExtension(x, decimalPlaces) {
    x = x * Math.pow(10, decimalPlaces);
    x = Math.round(x);
    x = x / Math.pow(10, decimalPlaces);
    return x
}

    //移除or重選發票管理人
function resetInvoiceEmp() {
    if (PO.InvoiceEmpNum) {
        if ($('#P_CurrentStep').val() == '1' && $('#P_Status').val() != '4') {
            $('#invoiceLinks .no-file-text').hide();
            $('#invoiceLinks span').text(PO.InvoiceEmpName + '(' + PO.InvoiceEmpNum + ')');
            $('#invoiceLinks .Links').show();
    }
    else {
        $('#invoiceLinks').text(PO.InvoiceEmpName + '(' + PO.InvoiceEmpNum + ')');
        }
}
else {
    $('#invoiceLinks .Links').hide();
    $('#invoiceLinks .no-file-text').show();
    }
}

    //組織樹輸出查詢結果(自行改寫區塊)
function POQueryTemp(datas, type, row) {
        console.log(datas);
        PO.InvoiceEmpName = datas[0].user_name;
        PO.InvoiceEmpNum = datas[0].user_id;
    resetInvoiceEmp();
}

    //判斷該PR決行層級是否高過董事長
    function renderMeetingRecordRow() {
        $.ajax({
            url: '/PO/GetPRSigningLevel',
        dataType: 'json',
        type: 'POST',
                data: {
        prID: PO.PRID
        },
            success: function (data, textStatus, jqXHR) {
                if (data) {
                //檢附董事會會記錄預設為True
                    var $radios = $('input:radio[name=www]');
                    if (_.isNull(PO.MeetingRecord)) {
                        $radios.filter('[value=true]').prop('checked', true);
                        PO.MeetingRecord = "true";
                    } 
                $('#MeetingRecordRow').show();
            }
            else {
                $('#MeetingRecordRow').hide();
    }
        },
            error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
}
});
}

    //重新帶入請購資訊
    function resetPODetail() {
        PO.PurchaseOrderDetailList = $.grep(PO.PurchaseOrderDetailList, function (item, index) {
            return (item.PODetailID != 0);
    });

    $.each(PO.PurchaseOrderDetailList, function (index, detailItem) {
        detailItem.IsDelete = true;
        detailItem.DeleteBy = PO.FillInEmpNum;
        $.each(detailItem.PurchaseOrderDeliveryList, function (index2, deliveryItem) {
            deliveryItem.IsDelete = true;
});
});
}

function loadFormData() {
    if (!PO.ApplicantName) {
        PO.ApplicantEmpNum = $('input[name="ApplicantEmpNum"]').val();
        PO.ApplicantName = $('input[name="ApplicantName"]').val();
        PO.ApplicantDepName = $('input[name="ApplicantDepName"]').val();
        PO.ApplicantDepId = $('input[name="ApplicantDepId"]').val();
}

    //有PRNum代表暫存過
    if (PO.PRNum) {
        $('#POResultBlock').show(200);
        $('#PODetailBlock').show(200);
        //供應商
        $('#vendorNameResult').text(PO.VendorName + '(' + PO.VendorNum + ')');
        //發票地點
        $('#invoiceAddressResult').text(PO.VendorSiteName);
        //請購單號PRNum
        $('#PRNum').text(PO.PRNum);
        //報價單號QONum
        $('#QONum').text(PO.QuoteNum);
        //報價單幣別currency，中文名稱
        $('#currency').text(PO.CurrencyName);
        getCurrency(PO.CurrencyCode);
        //發票管理人
        resetInvoiceEmp();
        //是否檢附董事會會議紀錄
        renderMeetingRecordRow();
        if (PO.MeetingRecord != 'null') {
            $('.MeetingRecord[value="' + PO.MeetingRecord + '"]').prop('checked', true);
            if ($('#P_CurrentStep').val() != '1' || $('#P_Status').val() == '4') {
                $('.MeetingRecord:not(:checked)').prop('disabled', true);
    }
    }
        //採購備註
        if (PO.Remark) {
            $('#PurchaseRemark').val(PO.Remark).text(PO.Remark);
    }
        //總金額
        //resetTotalPriceUI(PO.Amount);
        store.dispatch({ type: 'resetTotalPriceUI', data: { sum: PO.Amount } });


        $.each(PO.PurchaseOrderDetailList, function (index, elementDetail) {
            var tmpTbody = $('#resultTmpBody').clone().attr('id', '').attr('QDetailID', elementDetail.QDetailID);
            //var detailRow1TD_search = $(element).find('#detailRow1 td');
            var detailRow1TD_result = $(tmpTbody).find('#detailRow1 td');
            //var detailRow2TD_search = $(element).find('#detailRow2 td');
            var detailRow2TD_result = $(tmpTbody).find('#detailRow2 td');

            //編號
            $(detailRow1TD_result[0]).text(index +1);
            //採購分類
            $(detailRow1TD_result[1]).text(elementDetail.CategoryName);
            //品名描述
            $(detailRow1TD_result[2]).text(elementDetail.ItemDescription);
            //數量
            var lineQuantity = elementDetail.LineQuantity != 0 ? elementDetail.LineQuantity : '';
            lineQuantity = accounting.formatNumber(lineQuantity);
            $(detailRow2TD_result[2]).text(lineQuantity);
            //單位
            $(detailRow2TD_result[3]).text(elementDetail.UomName)

            //議價單價
            $(detailRow2TD_result[1]).find('input').val(elementDetail.UnitPrice != 0 ? elementDetail.UnitPrice : '');
            ////明細金額
            //if (elementDetail.LineQuantity != 0 && elementDetail.UnitPrice != 0) {
            //    var price = MathRoundExtension(Number(elementDetail.UnitPrice) * Number(elementDetail.LineQuantity),currency.extendedPrecision);
            //    $(detailRow1TD_result[6]).first().text(price)
            //}
            //原幣報價單價
            var foreignPrice = elementDetail.ForeignPrice.toString();
            if (foreignPrice.indexOf('.') > -1) {
                var afterPointer = pointerPos(foreignPrice);
                foreignPrice = accounting.formatNumber(foreignPrice, afterPointer);  //加上千分位
            } else {
                foreignPrice = accounting.formatNumber(foreignPrice);  //加上千分位
            }
            $(detailRow2TD_result[0]).text(foreignPrice);


            //最低報價
            $(detailRow1TD_result[3]).text(elementDetail.IsMixPrice ? '是' : '否');

            ////明細金額
            //if (elementDetail.LineQuantity != 0 && elementDetail.UnitPrice != 0) {
                //    var price = MathRoundExtension(Number(elementDetail.UnitPrice) * Number(elementDetail.LineQuantity),currency.extendedPrecision);
                //    $(detailRow1TD_result[6]).first().text(price)
                //}


            $.each(elementDetail.PurchaseOrderDeliveryList, function (index, elementDelivery) {
                var tmpDeliveryTR = $(tmpTbody).find('#resultTmpDelivery').clone().attr('id', '');
                var deliveryTD_result = $(tmpDeliveryTR).find('td');
                //最高數量
                $(deliveryTD_result[0])
                    .children('input')
                    .attr('max', elementDelivery.MaxQuantity)
                    .attr('placeholder', '請輸入數量(上限' + elementDelivery.MaxQuantity + ')')
                    .attr('PRDeliveryID', elementDelivery.PRDeliveryID)
                    .val(elementDelivery.Quantity != 0 ? elementDelivery.Quantity : '') 

                var stringAmount = String(elementDelivery.Amout);
                $(deliveryTD_result[1]).first().text(stringAmount);
                if ($(detailRow1TD_result[4]).text() == '金額') {
                    $(deliveryTD_result[0])
                        .children('input')
                        .val(elementDelivery.Quantity != 0 ? elementDelivery.Quantity : '') //預設帶入上限值
                        .attr('placeholder', '請輸入數量')
                }
                //掛帳單位
                $(deliveryTD_result[2]).text(elementDelivery.ChargeDeptName);
                //收貨單位
                setDefaultSelect($(deliveryTD_result[3]).find("select[name=RcvDept]"), elementDelivery.RcvDept);
                $(tmpTbody).append(tmpDeliveryTR);
        });
        $(tmpTbody).find('#resultTmpDelivery').remove();
        $('#PODetailBlock table').append($(tmpTbody).show());
        });
        if ($('#P_CurrentStep').val() != '1' || $('#P_Status').val() == '4') {
            $('#PODetailBlock tbody[id!="resultTmpBody"] input').addClass('input-disable').prop('disabled', true);
        }

            resetSubMenu();
    }
}

        function getCurrency(currencyCode) {
            $.ajax({
            async: false,
                url: '/PO/GetCurrency',
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

    //設定明細金額
function setDetailAmount() {
    var sum = 0
    //取得明細list,不包含template
    var detailRows = $("tbody[id='resultTmpBody']").siblings("tbody")
    $.each(detailRows, function (index, value) {
        //取得每一個td   
        var tds = $(value).find("tr[id='detailRow2']").children()
        if (tds.length > 0) {
            //取得數量個數,去掉千分位
            var quantity = accounting.unformat(tds[2].innerText);
            //取得單價
            var unitPrice
            var tdeliverys = $(value).find("tr[id='detailRow2']").children()
            if (tdeliverys.length > 0) {
                unitPrice = $(tdeliverys[1]).find('input').val()
            }

            var tddetail = $(value).find("tr[id='detailRow1']").children()
            if (unitPrice.toString().indexOf('.') > -1) {
                var afterPointer = pointerPos(unitPrice.toString());
                var price = MathRoundExtension(Number(unitPrice) * Number(quantity), afterPointer);
                if (price.toString().indexOf('.') > -1) {
                    $(tddetail[4]).empty()
                    $(tddetail[4]).text(accounting.formatNumber(price, afterPointer)) //加上千分位
                    $(tddetail[4]).append('<div class="btn-01-add ExpandDetail"><a><div class="glyphicon glyphicon-chevron-down  toggleArrow"></div></a></div>')
                } else {
                    $(tddetail[4]).empty()
                    $(tddetail[4]).text(accounting.formatNumber(price)) //加上千分位
                    $(tddetail[4]).append('<div class="btn-01-add ExpandDetail"><a><div class="glyphicon glyphicon-chevron-down  toggleArrow"></div></a></div>')
                }
                sum = sum + price
            } else {
                quantity = accounting.unformat(quantity);
                var price = Number(unitPrice) * Number(quantity);
                $(tddetail[4]).empty()
                $(tddetail[4]).text(accounting.formatNumber(price, afterPointer)) //加上千分位
                $(tddetail[4]).append('<div class="btn-01-add ExpandDetail"><a><div class="glyphicon glyphicon-chevron-down  toggleArrow"></div></a></div>')
                sum = sum + price
            }
        }
    }
)

    //回傳明細金額加總
    return sum
    ////明細金額擺放位置
    //$(this).parent().siblings()[5].firstChild.nextElementSibling.innerText
    //console.log("明細金額:" + price)
    }

    //document ready
$(function () {
    //取得收貨單位
    //store.dispatch({ type: 'Post', id: 'RcvDept', url: '/PO/GetHrDepartment' });
    //設定某些關卡欄位的顯示狀態
    //setFieldStatus($('#P_CurrentStep').val(), $('#P_Status').val());


        //取得後端Model
        PO = getModel();
     
        //取得收貨單位資料
        initRcvDept()
        loadFormData();
        setFieldStatus($('#P_CurrentStep').val(), $('#P_Status').val());

        //設定明細金額    
        setDetailAmount()

        //地址下拉選單異動
        $('#invoiceAddressSearch').change(function () {
            //取得請購單及採購經辦
            getPRNumAndPurchaseEmp();
            $('#PRSearchRow').show(200);
    });

    //搜尋按鈕
    $('#SearchPRDetailBtn').click(function () {
        //產生搜尋結果畫面            
        var genSearchResult = function () {
            var data = getUnTransferPRDetail(
                $('#suppliesSerno').text(),
                $('#invoiceAddressSearch').val(),
                $('#prNumSearch option:selected').length > 0 ? $('#prNumSearch').val() : null,
                $('#purchaseEmpSearch option:selected').length > 0 ? $('#purchaseEmpSearch').val() : null,
                $('#itemDescriptionSearch').val());
            if (data.length > 0) {
                renderPRDetailView(data);
                resetSubMenu();
            } else {
                $('#PRDetailTable').hide(200);
                messageOpen("查無相關請購明細資料")
            }
        }


        //已有採購資料,確認要覆蓋
        if (($("#POResultBlock").is(':visible') === true) && ($("#PODetailBlock").is(':visible') === true)) {
                var result = confirm("已有採購資料,確認要覆蓋");
                if (result == true) {
                    $("#POResultBlock").hide(200)
                    $("#PODetailBlock").hide(200)
                    genSearchResult()
                }
        } else {
            genSearchResult()
        }
});

    //展開
    $(document).on('click', '.ExpandDetail', function () {
        var trChevron = $(this).parents('tr').siblings();
        if($(this).find('div.glyphicon-chevron-down').length > 0) {
            trChevron.show();
            trChevron.find('.ExpandInnerDetail').parents('tr').nextAll().show();
            trChevron.find('.ExpandInnerDetail').parents('tr').next().hide();
            trChevron.find('.ExpandInnerDetail').find('span').text('收合');
        }
        else if($(this).find('div.glyphicon-chevron-up').length > 0) {
            trChevron.hide();
            $(this).find('span').text('展開');
        }
        $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    });
    //展開
    $(document).on('click', '.ExpandInnerDetail', function () {
        if($(this).find('span').text() == '展開') {
            $(this).parents('tr').nextAll().show();
            $(this).parents('tr').next().hide();
    }
    else if($(this).find('span').text() == '收合') {
        $(this).parents('tr').nextAll().hide();
        $(this).parents('tr').next().show();
        }
        $(this).find('span').toggleText('展開', '收合');
    });
    //展開
    $('.ExpandAllDetail').click(function () {
        if($(this).find('div.list-open-icon').length > 0) {
            $(this).parents('table').find('tbody .ExpandDetail').each(function (index, element) {
                if ($(element).find('div.glyphicon-chevron-down').length > 0) {
                    $(element).trigger('click');
            }
    });
    $(this).parents('table').find('tbody .ExpandInnerDetail').each(function (index, element) {
                if ($(element).find('span').text() == '展開') {
                    $(element).trigger('click');
    }
    });
        } else if($(this).find('div.list-close-icon').length > 0) {
            $(this).parents('table').find('tbody .ExpandDetail').each(function (index, element) {
                if ($(element).find('div.glyphicon-chevron-up').length > 0) {
                    $(element).trigger('click');
            }
    });
        }

        $(this).find('.toggleArrow').toggleClass('list-open-icon list-close-icon');
    });

       //checkbox監聽
        $('#PRDetailTable table').on('change', '.DetailCheckbox', function () {
            $('#PRDetailTable table .InnerDetailCheckbox').unbind('change');
            if($(this).prop('checked')) {
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
            if($(tbody).find('#detailRow1 td').eq(6).text() == '金額') {
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
        //遍歷每個Tbody，取得prNum、qoNum、invoiceEmp唯一值
        var tmpPrNumArray = []
        var tmpQoNumArray = []
        var tmpInvoiceEmpArray =[]
        checkedTbody.each(function (index) {
            tmpPrNumArray.push($(this).find('.prNum').text())
            tmpQoNumArray.push($(this).find('.qoNum').text())
            tmpInvoiceEmpArray.push($(this).find('.invoiceEmp').text())
        })
        var prNumArray = _.uniq(tmpPrNumArray)
        var qoNumArray = _.uniq(tmpQoNumArray)
        var invoiceEmpArray = _.uniq(tmpInvoiceEmpArray)

        //檢查單位是金額，數量小於1的
        //var chkAmts = $(checkedTbody).find("#detailRow1")
        //var equalOne = true
        //chkAmts.each(function (index) {
        //    if ($(this).find("td").eq(6).text() === "金額") {
        //        if (Number($(this).find("td").eq(5).text()) < 1) {
        //            messageOpen('單位是金額，送貨數量不得小於1');
        //            equalOne = false
        //        }
        //    }
        //})

        //if (equalOne) {
            if ($('#PRDetailTable input:checked').length === 0) {
                messageOpen('至少需選擇一筆請購明細');
            } else {
                if (
                    prNumArray.length != 1 || qoNumArray.length != 1 || invoiceEmpArray.length != 1) {
                    messageOpen('請購單號、報價單號及發票管理人必須相同');
                }
                else {
                    resetPODetail();
                    $('#PRDetailTable').hide();
                    $('#POResultBlock').show(200);

                    //供應商
                    $('#vendorNameResult').text($('#suppliesName').text() + '(' + $('#suppliesSerno').text() + ')');
                    PO.VendorName = $('#suppliesName').text();
                    PO.VendorNum = $('#suppliesSerno').text();
                    PO.VendorId = $('#suppliesId').text();

                    //供應商地址
                    $('#invoiceAddressResult').text($('#invoiceAddressSearch > option:selected').text());
                    PO.VendorSiteId = $('#invoiceAddressSearch').val();
                    PO.VendorSiteName = $('#invoiceAddressSearch > option:selected').text();

                    if (checkedTbody.length > 0) {
                        //聯絡人
                        $('#ContactPerson').val($(checkedTbody[0]).attr("data-contactperson"));
                        PO.ContactPerson = $(checkedTbody[0]).attr("data-contactperson");
                        //聯絡人郵件地址
                        $('#ContactEmail').val($(checkedTbody[0]).attr("data-contactemail"));
                        PO.ContactEmail = $(checkedTbody[0]).attr("data-contactemail");
                    }

                    //請購單
                    $('#PRNum').text(prNumArray[0]);
                    PO.PRID = $(checkedTbody).eq(0).find('.prNum').attr('prID');
                    //判斷該PR決行層級是否高過董事長
                    renderMeetingRecordRow();

                    //採購單
                    $('#QONum').text(qoNumArray[0]);

                    //幣別
                    var currencyCode = $(checkedTbody[0]).find('#detailRow2 td:first-child').attr("data-currencyCode");
                    $('#currency').text($(checkedTbody[0]).find('#detailRow2 td:first-child').attr("data-currencyName"));
                    PO.CurrencyCode = currencyCode;
                    PO.CurrencyName = $('#currency').text();
                    getCurrency(PO.CurrencyCode);

                    //發票管理人
                    PO.InvoiceEmpName = $(checkedTbody).eq(0).find('.invoiceEmp').attr('empName');
                    PO.InvoiceEmpNum = $(checkedTbody).eq(0).find('.invoiceEmp').attr('empNum');
                    resetInvoiceEmp();

                    //reset是否檢附董事會會議紀錄
                    PO.MeetingRecord = null;
                    $('.MeetingRecord').prop('checked', false);

                    //採購備註
                    $('#PurchaseRemark').val('');

                    $('#PODetailBlock').show(200);
                    renderPODetailBlock(checkedTbody);
                    //全部展開,第一關才需要
                    if ($('#P_CurrentStep').val() == '1') {
                        if ($('#PODetailBlock').find('div.list-open-icon').length > 0) {
                                $('.ExpandAllDetail').trigger("click");
                            }
                    }
                    resetSubMenu();
                }
            }
        //}
    });
            //送貨層數量event
    $('#PODetailBlock').on('change', '.deliveryAmount', function () {
        //若有千分位先還原
        var nativeVal = $(this).val().toString();
        if (nativeVal.indexOf(',') > -1 && nativeVal !== "") {
            $(this).val(accounting.unformat(nativeVal));
        }
            var unitKind = $(this).closest("tbody").find("#detailRow2 td:eq(3)").text();
            //送貨數量及不得輸入負數及不合法字元
                var r = /^\d+(\.\d+)?$/;
                if ($(this).val() !== "" && unitKind !== "金額" && (r.test($(this).val()) === false || $(this).val().indexOf('.') > -1)) {
                    $(this).val("");
                } else {
                    if (!_.isEmpty($(this).val()) && (Number($(this).val()) <= 0)) {
                        $(this).val("")
                        messageOpen('送貨數量需大於0!');
                } else {
                    var tbody = $(this).parents('tbody');
                    if ($(tbody).attr('id') != 'resultTmpBody') {
                        //var detailObj = PO.PurchaseOrderDetailList.find(x=>x.QDetailID == $(tbody).attr('QDetailID') && x.IsDelete == false);
                        var detailObj = _.find(PO.PurchaseOrderDetailList, {
                                QDetailID: parseInt($(tbody).attr('QDetailID')), IsDelete: false
                    })
                        //var deliveryObj = detailObj ? detailObj.PurchaseOrderDeliveryList.find(y=>y.PRDeliveryID == $(this).attr('PRDeliveryID') && y.IsDelete == false) : null;
                        var deliveryObj = detailObj ? _.find(detailObj.PurchaseOrderDeliveryList, {
                                PRDeliveryID: parseInt($(this).attr('PRDeliveryID')), IsDelete: false
                        }) : null;
                        if (unitKind === "金額") {
                            if ($(this).val().length - $(this).val().indexOf('.') > 3) {
                                messageOpen('單位是金額時，送貨層輸入超過小數兩位!');
                                deliveryObj.Quantity = 0;
                                $(this).val('').trigger('keyup');
                            } else {
                                deliveryObj.Quantity = $(this).val();
                                var sum = 0;
                                var allInput = true;
                                $.each($(tbody).find('.InnerDetailShowBar').nextAll(), function (index, element) {
                                    sum += Number($(element).find('.deliveryAmount').val());
                                    if ($(element).find('.deliveryAmount').val() === "" || Number($(element).find('.deliveryAmount').val()) === 0) {
                                        allInput = false;
                                    }
                                });
                                if (sum > 1) {
                                    messageOpen('送貨層數量加總不得大於1!');
                                    //deliveryObj.Quantity = 0;
                                    detailObj.LineQuantity = 0;
                                    $(this).val('').trigger('keyup');
                                } else if (sum < 1) {
                                    if (allInput) {
                                        $($(tbody).find('#detailRow2 td')[2]).text(sum);
                                        messageOpen('送貨層數量加總不得小於1!');
                                        //deliveryObj.Quantity = 0;
                                        detailObj.LineQuantity = 0;
                                        //$(this).val('').trigger('keyup');
                                    }
                                } else {
                                    //計算數量
                                    detailObj.LineQuantity = sum;
                                    var sumFormat = accounting.formatNumber(sum);
                                    $($(tbody).find('#detailRow2 td')[2]).text(sumFormat);
                                    $(tbody).find('.itemPrice').trigger('change');
                                }
                            }
                        } else {
                            if (Number($(this).val()) > (Number(accounting.unformat($(this).attr('max'))))) {
                                messageOpen('超過該筆送貨層上限了!');
                                deliveryObj.Quantity = 0;
                                $(this).val('').trigger('keyup');
                            }
                            else {
                                //計算數量
                                deliveryObj.Quantity = $(this).val();
                                var sum = 0;
                                $.each($(tbody).find('.InnerDetailShowBar').nextAll(), function (index, element) {
                                    sum += Number(accounting.unformat($(element).find('.deliveryAmount').val()));
                                });
                                detailObj.LineQuantity = sum;
                                var sumFormat = accounting.formatNumber(sum);
                                $($(tbody).find('#detailRow2 td')[2]).text(sumFormat);
                                $(tbody).find('.itemPrice').trigger('change');
                            }
                        }
                    }
        }
        }
        //送貨明細需有千分位
        store.dispatch({ type: 'Thousands', data: { selector: this } });
});

            //$('#PODetailBlock').on('blur', '.deliveryAmount', function () {
            //    if (!_.isEmpty($(this).val()) && (Number($(this).val()) <= 0))  {
            //        $(this).val("")
            //        messageOpen('送貨數量需大於0!');
            //    }
            //})


            //明細議價金額更改event
        $('#PODetailBlock').on('change', '.itemPrice', function () {
            //若有千分位先還原
            var nativeVal = $(this).val().toString();
            if (nativeVal.indexOf(',') > -1 && nativeVal !== "") {
                $(this).val(accounting.unformat(nativeVal));
            }
            //議價單價及不得輸入負數及不合法字元
            var r = /^\d+(\.\d+)?$/;
            if (r.test($(this).val()) === false) {
                $(this).val("");
            } else {
                if (!_.isEmpty($(this).val()) && (Number($(this).val()) <= 0)) {
                    $(this).val("")
                    messageOpen('議價金額需大於0!');
            } else {

                var tbody = $(this).parents('tbody');

                //議價金額大於報價金額，不做任何事，若是Edit頁面則不用檢查
                if ($.type(PRDetail) !== "undefined") {
                    //var prices = PRDetail.find(x=>x.QDetailID == $(tbody).attr('QDetailID'))
                    var prices = _.find(PRDetail, {
                            QDetailID: parseInt($(tbody).attr('QDetailID'))
                    })
                    var foreignPrice = accounting.unformat(prices.ForeignPrice);
                    if ($(this).val() > foreignPrice) {
                        $(this).val('');
                        messageOpen("議價金額不可大於原幣報價金額，請重新輸入");
                    } else {
                        var detailRow1TD = $(tbody).find('#detailRow1 td');
                        var detailRow2TD = $(tbody).find('#detailRow2 td');
                        var children = $(detailRow1TD[4]).children();
                        var QDetailID = $(tbody).attr('QDetailID');
                        //var detailObj = PO.PurchaseOrderDetailList.find(x=>x.QDetailID == $(tbody).attr('QDetailID') && x.IsDelete == false);
                        var detailObj = _.find(PO.PurchaseOrderDetailList, {
                                QDetailID: parseInt($(tbody).attr('QDetailID')), IsDelete: false
                    });

                        if ($(this).val()) {
                            //取得明細數量
                            var detailRow1TD3 = accounting.unformat($(detailRow2TD[2]).text());
                            if ($(this).val().indexOf('.') > -1) {
                                //如果是浮點數，則小數位數最大4位
                                var pointerStart = $(this).val().indexOf('.') + 1;
                                var afterPointerLen = pointerPos($(this).val());
                                $(this).val($(this).val().substring(0, pointerStart + afterPointerLen));
                                detailObj.UnitPrice = $(this).val();
                                $(children[0]).hide();
                                var price = MathRoundExtension(Number($(this).val()) * Number(detailRow1TD3), afterPointerLen);
                                if (price.toString().indexOf('.') > -1) {
                                    $(detailRow1TD[4]).text(accounting.formatNumber(price, afterPointerLen, ","));
                                } else {
                                    $(detailRow1TD[4]).text(accounting.formatNumber(price));
                                }
                                $(detailRow1TD[4]).append(children);
                                $(this).val(accounting.formatNumber($(this).val(), afterPointerLen, ","));
                            } else {
                                //$(this).val(accounting.toFixed($(this).val(), currency.extendedPrecision));
                                detailObj.UnitPrice = $(this).val();
                                $(children[0]).hide();
                                var price = Number($(this).val()) * Number(detailRow1TD3);
                                $(detailRow1TD[4]).text(accounting.formatNumber(price));
                                $(detailRow1TD[4]).append(children);
                                ////$(this).val(accounting.formatNumber($(this).val(), currency.extendedPrecision, ","));
                        }
                        }
                        else {
                            detailObj.UnitPrice = 0;
                            $(children[0]).show();
                            $(detailRow1TD[4]).text('');
                            $(detailRow1TD[4]).append(children);
                    }
                        //計算採購單總金額;
                        store.dispatch({ type: 'reCalculatePoTotalPrice' })
                        //計算送貨層金額;
                        store.dispatch({ type: 'reCalculateDeliveryPrice', data: {tbody:tbody} })

                }
                } else {
                    //Edit頁面若議價單價有變動，則需更改相對的Object欄位值  
                    var detailObj = _.find(PO.PurchaseOrderDetailList, {
                            QDetailID: parseInt($(tbody).attr('QDetailID')), IsDelete: false
                });
                    if (Number($(this).val()) > detailObj.ForeignPrice) {
                        //若大於原幣報價金額則還原回來
                        $(this).val(detailObj.UnitPrice);
                        messageOpen("議價金額不可大於原幣報價金額，請重新輸入");
                    } else {
                        detailObj.UnitPrice = $(this).val();
                        //重新計算明細金額，並回傳加總
                        var sum = setDetailAmount()
                        //顯示重新計算總金額結果
                        //resetTotalPriceUI(sum);
                        store.dispatch({ type: 'resetTotalPriceUI', data: { sum: sum } });
                        PO.Amount = sum;
                        //重新計算送貨層金額
                        //reCalculateDeliveryPrice(tbody);
                        store.dispatch({ type: 'reCalculateDeliveryPrice', data: { tbody: tbody } })
                }
            }
        }
            }
            //議價單價需有千分位
            store.dispatch({ type: 'Thousands', data: { selector: this } });
        });

            //發票管理人xx event
            $(document).on('click', '.glyphicon-remove', function () {
                var divID = $(this).closest('div .area-fix02-2').attr('id');
                switch (divID) {
                    case 'invoiceLinks':
                    PO.InvoiceEmpName = null;
                    PO.InvoiceEmpNum = null;
                        resetInvoiceEmp();
                        break;
        }
            resetSubMenu();
        });

            //聯絡人onchange事件
            $('#ContactPerson').change(function () {
                PO.ContactPerson = $(this).val();
        });

            //聯絡人郵件地址onchange事件
            $('#ContactEmail').change(function () {
                PO.ContactEmail = $(this).val();
        });

            //採購備註onchange事件
            $('#PurchaseRemark').change(function () {
                PO.Remark = $(this).val();
        });

            //是否檢附董事會會議紀錄
            $('.MeetingRecord').change(function () {
                PO.MeetingRecord = $('.MeetingRecord:checked').val();
        });

            //暫存編輯頁採購資訊的供應商及發票地點若有資料，需將結果帶到查詢區
            if (($("#PRDetailSearchBlock").is(":visible") === true) && ($("#POResultBlock").is(":visible") === true)) {
                $('#vendorNameSearch').text(PO.VendorName + '(' + PO.VendorId + ')');
                $('#invoiceAddressSearch').append($('<option>').val(PO.VendorSiteId).text(PO.VendorSiteName));
                $("#invoiceAddressSearch option[value='" + PO.VendorSiteId + "']").attr("selected", "selected");;
                $("#invoiceAddressSearch").selectpicker("refresh");
            }
        //收貨單位
            $(document).on('change','#RcvDept', function () {
                var tbody = $(this).parents('tbody');
                if ($(tbody).attr('id') != 'resultTmpBody') {
                    //var detailObj = PO.PurchaseOrderDetailList.find(x=>x.QDetailID == $(tbody).attr('QDetailID') && x.IsDelete == false);
                    var detailObj = _.find(PO.PurchaseOrderDetailList, {
                        QDetailID: parseInt($(tbody).attr('QDetailID')), IsDelete: false
                    })
                    //var deliveryObj = detailObj ? detailObj.PurchaseOrderDeliveryList.find(y=>y.PRDeliveryID == $(this).attr('PRDeliveryID') && y.IsDelete == false) : null;
                    var deliveryObj = detailObj ? _.find(detailObj.PurchaseOrderDeliveryList, {
                        PRDeliveryID: parseInt($(this).parent().closest("tr").find("input").attr("prdeliveryid")), IsDelete: false
                    }) : null;
                    deliveryObj.RcvDept = $(this).val();
                    deliveryObj.RcvDeptName = $(this).find('option:selected').text();
                }
            });
});

function initRcvDept() {
    thrOneTimeDetail_RcvDept = $.ajax({
        url: "/PO/GetHrDepartment/",   //存取Json的網址
        type: "POST",
        cache: false,
        data: { PRnum: "" },
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data) {
                $.each(data, function (index, obj) {
                    $("select[name=RcvDept]").append($("<option></option>").attr("data-subtext", obj.DeptCode).attr("value", obj.DeptCode).text(obj.DeptName))
                })
                // $("select[name=RcvDept]").selectpicker('render');
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


function setDefaultSelect(target, value) {
    $(target).data('selectpicker', null);
    $(target).find("option[value='" + value + "']").attr("selected", "selected")
    $(target).change();
    $(target).parents(".bootstrap-select").find("button:first").remove();
    $(target).selectpicker('refresh');
}

function OverrideOrgPickerSetting(step) {
    /// <summary>提供cbp-SendSetting.js針對「傳送其他主管同仁」按鈕做最後OrgPicker更改機會</summary>
    /// <param name="step" type="number">目前關卡數</param>
    //  第一關傳其他只能傳送採購經辦群組， 第二關傳其他只能傳送採購覆核群組:
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

//遍歷 Html Dom
function DomIterator(selector) {
    let targetEle = []
    let treeWalker = document.createTreeWalker(
      document.querySelector(selector),
      NodeFilter.SHOW_ALL
    )
    //treeWalker.lastChild()
    while ((node = treeWalker.nextNode())) {
            console.log(node.nodeType + node.nodeName)
            targetEle.push(node)
    }
    for (var i = 0; i < targetEle.length; i++) {

        console.log(targetEle[i].nodeName)

    }
}


window.onload = function () {
    $('#PODetailBlock .deliveryAmount').trigger('change');
    resetSubMenu();
    //全部展開,第一關才需要
    if ($('#P_CurrentStep').val() == '1') {
        if ($('#PODetailBlock').find('div.list-open-icon').length > 0) {
            $('.ExpandAllDetail').trigger("click");
        }
    }

};