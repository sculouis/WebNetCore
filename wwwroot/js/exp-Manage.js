//儲存原始費用標準
var ExpStandards;

function UIReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var action = arguments[1];
    switch (action.type) {
        case 'Search':
            state = 1;
            break;
        case 'ShowCreate':
            state = 2;
            break;
        case 'AcceptCreate':
            state = 3;
            break;
        case 'ShowEdit':
            state = 4;
            break;
        case 'AcceptEdit':
            state = 5;
            break;
        case 'Delete':
            state = 6;
            break;
        case 'QueryItems':
            state = 7;
            break;
        case 'ActionItems':
            state = 8;
            break;
        default:
            return state;
    }
    var result = { state: state, id: action.id };
    return result;
}


// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
var store = Redux.createStore(UIReducer);

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.
store.subscribe(function () {
    var actionResult = store.getState();
    var bo = new BussinessLogical();
    switch (actionResult.state) {
        case 1:
            bo.Search();
            break;
        case 2:
            bo.ShowCreate();
            break;
        case 3:
            bo.AcceptCreate();
            break;
        case 4:
            bo.ShowEdit(actionResult.id);
            break;
        case 5:
            bo.AcceptEdit();
            break;
        case 6:
            bo.Delete(actionResult.id);
            break;
        case 7:
            bo.QueryItems(actionResult.id);
            break;
        case 8:
            bo.ActionItems(actionResult.id);
            break;
    }
    console.log(store.getState());
});

//業務邏輯
function BussinessLogical() {
    this.PreperData = function (id) {
        var data = $("#" + id).serializeObject();

        //取得碳足跡選擇結果
        var indexs = [0, 1, 2];
        $.each(indexs, function (i) {
            if ($(".CarbonFootPrint:eq(" + i + ")").prop("checked") === true) {
                data.CarbonFootPrint = i + 1
            }
        })
        //取得參考日支數額註記
        indexs = [0, 1];
        $.each(indexs, function (i) {
            if ($(".PayKind:eq(" + i + ")").prop("checked") === true) {
                data.PayKind = i + 1
            }
        })

        //是否需要憑證
        if ($("#NeedCertificate").prop("checked") === true) {
            data.NeedCertificate = true
        } else {
            data.NeedCertificate = false
        }

        //帳本別
        if ($("#BillKind").prop("checked") === true) {
            data.BillKind = true
        } else {
            data.BillKind = false
        }

        //營業稅不得扣抵註記
        if ($("#IsDeduction").prop("checked") === true) {
            data.IsDeduction = true
        } else {
            data.IsDeduction = false
        }
        return data;
    }
}

//查詢
BussinessLogical.prototype.Search = function () {
    $('#Create').hide();
    $('#Edit').hide();
    if ($("#MaxItem").val() === "") {
        alertOpen("請款大類必輸");
    } else {
        blockReportPage('資料讀取中...');
        GetData("SearchResultArea", "/SYS/GetExpenseStandard?MaxItemNo=" + $("#MaxItem").val() + "&MidItemNo=" + $("#MidItem").val(), confirmData);
    }
}

//顯示新增
BussinessLogical.prototype.ShowCreate = function () {
    blockReportPage('資料讀取中...')
    $('#SearchResultArea').hide();
    $("#Edit").hide();
    $("#CreateRows").remove();    //如果已存在先移除
    $("#EditRows").remove();    //如果已存在先移除
    $("#Create").append($("script.template#CreateBlock").html())
    GetData("MaxItemNo", "/SYS/GetCodeItem/0/", BindArrayData);
    $("#MidItemNo").selectpicker("refresh");
    $("#ExpenseKind").selectpicker("refresh");
    $('#Create').show();
}

//新增確認
BussinessLogical.prototype.AcceptCreate = function () {
    var Fields = { MaxItemNo: "請款大類", MidItemNo: "請款中類", ExpenseKind: "費用屬性", AccountingCode: "會計項子目", AccountingName: "會計項子目名稱" }
    var ErrItems = []
    $.each(Object.keys(Fields), function (i, item) {
        if ($("#" + item).val() === "") {
            ErrItems.push(Fields[item])
        }
    }
    )
    if (ErrItems.length > 0) {
        alertOpen(ErrItems.concat() + "皆需輸入")
    } else {
        if (confirm("確認新增")) {
            UpdateData("MainForm", "/SYS/CreateExpenseStandard", this.PreperData("MainForm"), confirmData)
    }
}
}

//顯示編輯
BussinessLogical.prototype.ShowEdit = function (id) {
    $('#SearchResultArea').hide();
    $("#CreateRows").remove();    //如果已存在先移除
    $("#EditRows").remove();    //如果已存在先移除
    var findResult = _.find(ExpStandards, { ESID: id })
    //Undescore Template,產生查詢結果
    var resultTemp = _.template($("script.template#EditBlock").html())
    $("#Edit").append(resultTemp(findResult))
    if (findResult.CarbonFootPrint > 0) {
        $('.CarbonFootPrint:eq(' + (findResult.CarbonFootPrint - 1) + ')').prop('checked', true);
    }
    if (findResult.PayKind > 0) {
        $('.PayKind:eq(' + (findResult.PayKind - 1) + ')').prop('checked', true);
    }
    $("#Edit").show();
    console.log(findResult);
}

//編輯確認
BussinessLogical.prototype.AcceptEdit = function () {
    if (confirm("確認修改")) {
        UpdateData("UpdateForm", "/SYS/UpdateExpenseStandard", this.PreperData("UpdateForm"), confirmData)
    }
}

//確認刪除
BussinessLogical.prototype.Delete = function (id) {
    if (confirm("確定刪除")) {
        GetData("Delete", "/SYS/DeleteExpenseStandard/" + id, confirmData);
    }
}

//查詢區的請款大中類資料讀取
BussinessLogical.prototype.QueryItems = function (id) {
    blockReportPage('資料讀取中...')
    GetData("MidItem", "/SYS/GetMidCodeItem/" + id, BindArrayData);
    $("#MidItemBlock").show();
}

//新增區的請款大中類及費用屬性資料讀取
BussinessLogical.prototype.ActionItems = function (id) {
    blockReportPage('資料讀取中...')
    GetData("MidItemNo", "/SYS/GetMidCodeItem/" + id, BindArrayData)
    blockReportPage('資料讀取中...')
    GetData("ExpenseKind", "/SYS/GetCodeItem/2/", BindArrayData);
}

//綁定代碼類資料By Array
function BindArrayData(id, data) {
    id = "#" + id
    $(id).empty().selectpicker("refresh")
    if (id === '#MidItem') {
        $(id).append("<option value=''>取消選擇</option>");
        $.each(data, function (i, item) {
            $(id).append('<option value=' + item[Object.keys(item)[2]] + '>' + item[Object.keys(item)[3]].trim() + ":" + item[Object.keys(item)[2]] + '</option>');
        });
    } else {
        $.each(data, function (i, item) {
            $(id).append('<option value=' + item[Object.keys(item)[2]] + '>' + item[Object.keys(item)[3]].trim() + ":" + item[Object.keys(item)[2]] + '</option>');
        });
        //console.log(data)
    }
    $(id).selectpicker("refresh");
}

//更新結果CallBack Function
function confirmData(id, data) {
    if (id === "SearchResultArea") {
        ExpStandards = data;  //將查詢結果寫到全域變數
        $("#SearchResultArea").find("table").empty();
        //Undescore Template,產生查詢結果
        resultTemp = _.template($("script.template#resultList_tbody").html())

        //var mydata = { result: data };
        $("#SearchResultArea").find("table").append($("script.template#resultList_thead").html())
        ////$("#SearchResultArea").find("table").append($("script.template#resultList_tbody").html())

        $.each(data, function (i, item) {
            $("#SearchResultArea").find("table").append(resultTemp(item))
        });

        $("#SearchResultArea").show();
        blockReportPage('');
        //console.log(data);
    }
    if (data === 0) {
        switch (id) {
            case "MainForm":
                alertOpen("新增失敗")
                break;
            case "UpdateForm":
                   alertOpen("修改失敗")
                   break;
            case "Delete":
                alertOpen("刪除失敗");
                break;
            default:
                   break;
        }

    } else {
        switch (id) {
            case "MainForm":
                alertOpen("新增成功")
                break;
            case "UpdateForm":
                   alertOpen("修改成功")
                   break;
            case "Delete":
                alertOpen("刪除成功");
                $("#Search").trigger("click");
                break;
            default:
                break;
       }

    }
}


//查詢
$(document).on('click', '#Search', function () {
    store.dispatch({type:'Search'})
});

//顯示新增作業
$('#CreateLink').click(function (e) {
    store.dispatch({type:'ShowCreate'})
})

//按下新增更新
$(document).on('click', '#CreateConfirmLink', function (e) {
    store.dispatch({type:'AcceptCreate'})
})

//顯示修改
$(document).on('click', '.p-left1', function () {
    var esid = $(this).closest('tbody>tr').attr('data-esid');
    store.dispatch({type:'ShowEdit',id:esid})
});

//按下修改更新
$(document).on('click', '#EditConfirmLink', function (e) {
    store.dispatch({type:'AcceptEdit'})
})

//刪除
$(document).on('click', '.p-left2', function () {
    var esid = $(this).closest('tbody>tr').attr('data-esid');
    store.dispatch({ type: 'Delete', id: esid })
});

$(document).on("blur", "input:text", function (e) {
    //console.log(e.target.id)
    if ($(this).val().length > 0) {
        if (e.target.id === "AmountLimitLV1" || e.target.id === "AmountLimitLV2") {
            var r = /^\d+$/;
            if (r.test($(this).val()) === false) {
                $(this).val("");
                alertOpen("只能輸入數字");
            }
        }
    }
})

$(document).on("click", "#CreatePrevLink,#EditPrevLink", function (e) {
    //alertOpen("回前一頁");
    $("#Search").trigger("click");
})


//設定事件
function SetEvents() {
    //設定Select Change的事件
    $(document).on("change", "select", function (e) {
        var id = "#" + e.target.id
        if (e.target.id === "MaxItem") {
            store.dispatch({ type: 'QueryItems',id:e.target.value })
        }
        if (e.target.id === "MaxItemNo") {
            store.dispatch({ type: 'ActionItems', id: e.target.value })
        }
    })
}

$(function () {
    //取得請款大類
    GetData("MaxItem", "/SYS/GetCodeItem/PaymentCategory", BindArrayData);
    SetEvents();
})