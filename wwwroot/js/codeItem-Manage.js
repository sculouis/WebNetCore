//儲存原始請款中類
var MidCategory;

//等待頁面可輸入等待訊息
function blockReportPage(UImessage) {
    if (UImessage == "") {
        _blockstatus = false;
        $.unblockUI();
    } else {
        _blockstatus = true
        $.blockUI({ message: UImessage });
    }
}

//ajax GET從Server取得資料
function GetData(id, serverUrl,callBack) {
    var deferred = $.Deferred();
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: serverUrl,
        success: function (data) {
            blockReportPage('')
            console.log(data)
            callBack(id, data)
            deferred.resolve();
        },
        error: function (data) {
            console.log("錯誤")
            deferred.reject();
        }
    });
}

//ajax POST從Server取得資料
function UpdateData(id, serverUrl, updatedata, callBack) {
    var deferred = $.Deferred();
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: serverUrl,
        data:updatedata,
        success: function (data) {
            console.log(data)
            callBack(id, data)
            deferred.resolve();
        },
        error: function (data) {
            console.log("錯誤")
            deferred.reject();
        }
    });
}


//綁定代碼類資料By Object
function BindData(id, Detail) {
    id = "#" + id
    $(id).empty().selectpicker("refresh")
    $(id).append("<option>取消選擇</option>");
    Object.keys(Detail).forEach(function (item) {
        if (id === "#ExpenseAttribute") {
            $(id).append('<option value=' + item + '>' + item + ":" + Detail[item] + '</option>');
        } else {
            $(id).append('<option value=' + item + '>' + Detail[item] + '</option>');
        }
    })
    $(id).selectpicker("refresh");
}

//綁定代碼類資料By Array
function BindArrayData(id, data) {
    id = "#" + id
    $(id).empty().selectpicker("refresh")
    if (id === '#CodeItem') {
        $(id).append("<option value='9999'>取消選擇</option>");
        $.each(data, function (i, item) {
            $(id).append('<option value=' + item[Object.keys(item)[2]] + '>' + item[Object.keys(item)[3]] + ":" + item[Object.keys(item)[2]] + '</option>');
        });
    } else if (id === '#ResultList') {

        //Undescore Template,產生查詢結果
        resultTemp = _.template($("script.template#resultList_tbody").html())

        //var mydata = { result: data };
        $("#SearchResultArea").find("table").append($("script.template#resultList_thead").html())

        ////$("#SearchResultArea").find("table").append($("script.template#resultList_tbody").html())

        $.each(data, function (i, item) {
            //如果是請款中類，則父大類為取請款中類前四碼
            if ($("#Kind").val() === "PaymentMidCategory") {
                item.ParentItemNo = item.ItemNo.substring(0, 4);
            }
            $("#SearchResultArea").find("table").append(resultTemp(item))
        });
    } else if (id === "#PaymentMidList") {
        MidCategory = data;
        //Undescore Template,產生請款中類查詢結果
        resultTemp = _.template($("script.template#midList_tbody").html())

        //表頭
        $("#PaymentMidArea").find("table").append($("script.template#midList_thead").html())

        $.each(data, function (i, item) {
            $("#PaymentMidArea").find("table").append(resultTemp(item))
        });
    }

    $(id).selectpicker("refresh");
}


//綁定請款類別代碼相關資料By Array
function BindExpenseKindData(id, data) {
    id = "#" + id;
    $(id).empty().selectpicker("refresh")

    if (id === '#MaxItem') {
        //請款類別相關的請款大類
        $("#MaxItem").empty().selectpicker("refresh")
        $("#MaxItem").append("<option value='9999'>取消選擇</option>");
        $.each(data, function (i, item) {
            $("#MaxItem").append('<option value=' + item[Object.keys(item)[2]] + '>' + item[Object.keys(item)[3]] + ":" + item[Object.keys(item)[2]] + '</option>');
        });
    } else {
        //請款類別相關代碼
        $.each(data, function (i, item) {
            $("#CodeItem").append('<option value=' + item[Object.keys(item)[3]] + '>' + item[Object.keys(item)[2]] + "-" + item[Object.keys(item)[4]] + '</option>');
        });
    }

    if (id === '#PaymentMidList') {
        //請款類別所屬的請款中類
        $.each(data, function (i, item) {
            $("#CodeItem").append('<option value=' + item[Object.keys(item)[3]] + '>' + item[Object.keys(item)[2]] + "-" + item[Object.keys(item)[4]] + '</option>');
        });
    }

    $(id).selectpicker("refresh");
}

//更新結果CallBack Function
function confirmData(id, data) {
    if (id === "PaymentMidCategory") {
        $("#Search").trigger("click");
        alertOpen("更新成功")
        blockReportPage('')
        console.log(data);
    }
    if (data === 0) {
        alertOpen("刪除失敗")
    } 
    
}

function alertOpen(text) {
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

    //查詢
$(document).on('click', '#Search', function () {
    $('#Create').hide();
    $('#Edit').hide();
    if ($("#Kind").val() === "") {
            alertOpen("類別必輸")
    } else if ($("#Kind").val() === "999") {
        if ($("#CodeItem").val() === "") {
            alertOpen("請類別代碼必輸");
        } else {

            blockReportPage('資料讀取中...')
            GetData("PaymentMidList", "/SYS/GetPaymentMidCategorySet?PaymentKind=" + $("#CodeItem").val() + "&MaxItem=" + $("#MaxItem").val(), BindArrayData);
            $("#PaymentMidArea").show();
            $("#SearchResultArea").hide();
            $('#Edit').hide();
        }
    } else
    {
        blockReportPage('資料讀取中...')
        var itemNo = $("#CodeItem").val();
        if (itemNo === '9999'){
            itemNo = '';
        }
            GetData("ResultList", "/SYS/GetSearchResult?Kind=" + $("#Kind").val() + "&ItemNo=" + itemNo, BindArrayData);
            $("#SearchResultArea").show();
            $('#Edit').hide();
        }
    });


    //顯示修改頁面
    $(document).on('click', '.p-left1', function () {
        console.log($(this).closest('tbody>tr').attr('data-ciid'));
        var codekind = console.log($(this).closest('tbody>tr').attr('data-codekind'));
        var td1 = $(this).closest('tbody').find('td:eq(0)').text();
        var td2 = $(this).closest('tbody').find('td:eq(1)').text();
        var td3 = $(this).closest('tbody').find('td:eq(2)').text();
        console.log(td1);
        console.log(td2);
        console.log(td3);
        $('#SearchResultArea').hide();
        //Undescore EditDetail Template,
        resultTemp = _.template($("script.template#EditDetail").html())

        var item = { ItemNo: td1, ItemName: td2, ParentItemNo: td3 }
        //如果是請款中類，則父大類為取請款中類前四碼
        if ($("#Kind").val() === "PaymentMidCategory") {
            item.ParentItemNo = item.ItemNo.substring(0, 4);
        }

        $("#EditRows").append(resultTemp(item))
        $('#Edit').show();
    });

    //刪除
    $(document).on('click', '.p-left2', function () {
        var ciid = $(this).closest('tbody>tr').attr('data-ciid');
        console.log();
        var td1 = $(this).closest('tbody').find('td:eq(0)').text(); //代碼系統編號
        var td2 = $(this).closest('tbody').find('td:eq(1)').text();
        var td3 = $(this).closest('tbody').find('td:eq(2)').text();
        console.log(td1);
        console.log(td2);
        console.log(td3);
        if (confirm("確定刪除")){
            blockReportPage('刪除中...')
            GetData("ResultList", "/SYS/DeleteCodeItem/" + ciid, callBack);
        }
    });


var callBack = function (id, data) {
    $("#Search").trigger("click");
    if (data === 0) {
        if (id === "#CreateConfirmLink") {
            alertOpen("新增失敗");
        }
    } else {
        if (id === "#CreateConfirmLink") {
            alertOpen("新增成功");
            }
    }
}


//顯示新增作業
$('#CreateLink').click(function (e) {
    $('#SearchResultArea').hide();
    $("#Create").find('.sub-title-flag').text("新增:" + $("#Kind option:selected").text())
    $('#Create').show();
})

//新增確認作業
$('#CreateConfirmLink').click(function (e) {
    if (confirm("確定新增")) {
        var id = '#CreateConfirmLink';
        var serverUrl = '/SYS/CreateCodeItem'
        var data = { CodeKind:$("#Kind").val(), ItemNo: $('#CreateItemNo').val(), ItemName: $('#CreateItemName').val(), ParentItemNo: $('#CreateParentItemNo').val() }
        $.when(UpdateData(id, serverUrl, data, callBack)).done(function () {
            $("#CreatePrevLink").trigger("click");
        });
    }
})

//請款中類更新作業
$('#SaveLink').click(function (e) {
        var SelectedResult = []
        $('#PaymentMidList').find('tbody > tr').each(function (index) {
            if ($(this).find('.MidCheckbox').is(":checked")) {
                //console.log('選擇:' + index)
                //console.log('和原始狀況不同，更新原始狀況')
                var result = _.find(MidCategory, { ItemNo: $(this).find('td:eq(1)').text() })
                if (result.IsExit === 0) {
                    //新增
                    SelectedResult.push({ Action: 0, ItemNo: result.ItemNo, PMCID: result.PMCID,PaymentKind:$("#CodeItem").val() })
                }
            } else {
                //console.log('未選擇:' + index)
                //console.log($(this).find('td:eq(1)').text())
                var result = _.find(MidCategory, { ItemNo: $(this).find('td:eq(1)').text() })
                //console.log('和原始狀況不同，更新原始狀況')
                if (result.IsExit === 1) {
                    //移除
                    SelectedResult.push({ Action: 1, ItemNo: result.ItemNo, PMCID: result.PMCID, PaymentKind: $("#CodeItem").val() })
                }
            }
        });
        if (SelectedResult.length > 0) {
            if (confirm("確定更新")) {
                var id = "PaymentMidCategory";
                var serverUrl = "/SYS/UpdatePaymentMidCategory";
                var postData = { PaymentMidCategory: SelectedResult }
                blockReportPage('更新中...')
                UpdateData(id, serverUrl, postData, confirmData)
                console.log(SelectedResult)
            }
        } else {
            alertOpen("無異動資料需更新")
        }
})



$('#CreateItemNo').on('blur', function () {
    if ($("#Kind").val() === 'PaymentMidCategory') {
        $('#CreateParentItemNo').val($('#CreateItemNo').val().substring(0,4))
    }
})


//更新代碼資料
$('#UpdateLink').click(function () {
    if (confirm("確定更新")) {
        var id = '#UpdateLink';
        var serverUrl = '/SYS/UpdateCodeItem'
        var data = { CodeKind: $("#Kind").val(), ItemNo: $('#ItemNo').text(), ItemName: $('#ItemName').val(), ParentItemNo: $('#ParentItemNo').text() }
        $.when(UpdateData(id, serverUrl, data, callBack)).done(function () {
            $("#EditPrevLink").trigger("click");
        });
    }
})


//回到主頁
$('#CreatePrevLink').click(function (e) {
    $('#CreateItemNo').val("");
    $('#CreateItemName').val("");
    $('#CreateParentItemNo').val("");
    $('#SearchResultArea').show();
    $('#Create').hide();
    $("#Search").trigger("click");
})

//回到主頁
$('#EditPrevLink').click(function (e) {
    $("#CodeItemData").remove();
    $('#SearchResultArea').show();
    $('#Edit').hide();
    $("#Search").trigger("click");
})


//事件結果
function eventHandler(e) {
    if (e.target.id === "Kind") {
        $('#SearchResultArea').hide();
        $("#PaymentMidArea").hide();
        $("#CodeItemBlock div").first().find('b:eq(1)').remove()  //代碼星號移除掉
        //$("#ExpenseKind").empty().selectpicker("refresh")
        if (e.target.value !== "請選擇" && e.target.value !== '999') {
            GetData("CodeItem", "/SYS/GetCodeItem/" + e.target.value, BindArrayData);
            $("#MaxItemBlock").hide();
        } else if (e.target.value === '999') {
            $("#CodeItemBlock div").first().append('<b class="required-icon">*</b>');  //代碼增加必填星號
            $("#MaxItemBlock").show();
            blockReportPage('資料讀取中')
            $.when(GetData("CodeItem", "/SYS/GetExpenseKinds/", BindExpenseKindData)).then(function () {
                blockReportPage('資料讀取中')
                GetData("MaxItem", "/SYS/GetMaxItems/", BindExpenseKindData);
            });
        } else {
            $("#MaxItemBlock").hide();
        }
    }

}

//設定事件
function SetEvents() {
    //設定Select Change的事件
    $("select").on("change", function (e) {
        var id = "#" + e.target.id
        eventHandler(e)
    })
}

$(function () {
    //增加請款類別
    $("#Kind").append('<option value="999">請款類別</option>');
    SetEvents();
})