//儲存原始海外差旅日支限額標準
var OverseaPayLimits

//ajax GET從Server取得資料
function Get(id, serverUrl) {
    var deferred = $.Deferred();
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: encodeURI(serverUrl),
        success: function (data) {
            //console.log(data)
            var response = {id:id, data:data}
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
        case 'CityItems':
            state = 9;
            break;
        case 'Response':
            state = 10;
            break;
        default:
            return state;
    }
    var result = { state: state, id: action.id,data:action.data };
    return result;
}

//將Server上取得的資料放到中間層
var FetchData = function(store) {
    return function (next) {
        return function (action) {
            if (action.type === 'Get') {
                $.when(Get(action.id, action.url)).then(function (response) {
                    //console.log(response);
                    action.type = 'Response'
                    action.id = action.id
                    action.data = response.data
                    var result = next(action);
                    //console.log('next state', store.getState());
                    return result;
                })
            } else if (action.type === 'Post') {
                $.when(Post(action.id, action.url, action.data)).then(function (response){
                    //console.log(response);
                    action.type = 'Response'
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
var store = Redux.createStore(UIReducer,fetch);

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
        case 9:
            bo.CityItems(actionResult.id);
            break;
        case 10:
            bo.Response(actionResult);
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

//查詢
BussinessLogical.prototype.Search = function () {
    $('#Create').hide();
    $('#Edit').hide();
    if ($("#AreaItem").val() === ""){
        alertOpen("地區必輸");
    } else if ($("#CountryItem").val() === "") {
        alertOpen("國家必輸");
    } else {
        blockReportPage('資料讀取中...');
        var url = "/SYS/GetOverseaPayLimitItems?AreaItemNo=" + $("#AreaItem").val() + "&CountryItemNo=" + $("#CountryItem").val();
        store.dispatch({ type: 'Get',id:"SearchResultArea", url:url  })
        $("#SearchResultArea").show();

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
    blockReportPage('資料讀取中...');
    store.dispatch({ type: 'Get', id: "AreaItemNo", url: "/SYS/GetCodeItem/6/" })
    $("#CountryItemNo").selectpicker("refresh");
    $("#CityItemNo").selectpicker("refresh");
    $('#Create').show();
}

//新增確認
BussinessLogical.prototype.AcceptCreate = function () {
    var Fields = { AreaItemNo: "地區", CountryItemNo: "國家", CityItemNo: "城市", PayAmount: "日支數額"}
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
            blockReportPage('資料讀取中...')
            store.dispatch({ type: 'Post', id: "MainForm", url: "/SYS/CreateOverseaPayLimit", data: this.PreperData("MainForm") })
        }
    }

}

//顯示編輯
BussinessLogical.prototype.ShowEdit = function (id) {
    $('#SearchResultArea').hide();
    $("#CreateRows").remove();    //如果已存在先移除
    $("#EditRows").remove();    //如果已存在先移除
    var findResult = _.find(OverseaPayLimits, { OPLID: id })
    //Undescore Template,產生查詢結果
    var resultTemp = _.template($("script.template#EditBlock").html())
    $("#Edit").append(resultTemp(findResult))
    $("#Edit").show();
    console.log(findResult);
}

//編輯確認
BussinessLogical.prototype.AcceptEdit = function () {
    if (confirm("確認修改")) {
        blockReportPage('資料讀取中...')
        store.dispatch({ type: 'Post', id: "UpdateForm", url: "/SYS/UpdateOverseaPayLimit", data: this.PreperData("UpdateForm") })
    }
}

//確認刪除
BussinessLogical.prototype.Delete = function (id) {
    if (confirm("確定刪除")) {
        blockReportPage('資料讀取中...')
        //store.dispatch({ type: 'Get', id: 'Delete', url: "/SYS/DeleteOverseaPayLimit/" + id })
        store.dispatch({ type: 'Get', id: "Delete", url: "/SYS/DeleteOverseaPayLimit/" + id })
    }
}

//查詢區的地區及國家資料讀取
BussinessLogical.prototype.QueryItems = function (id) {
    blockReportPage('資料讀取中...')
    store.dispatch({ type: 'Get', id: "CountryItem", url: "/SYS/GetSubCodeItems?Kind=7&ParentItemNo=" + id })
    $("#CountryBlock").show();
}

//新增區的國家資料讀取
BussinessLogical.prototype.ActionItems = function (id) {
    blockReportPage('資料讀取中...')
    store.dispatch({ type: 'Get', id: "CountryItemNo", url: "/SYS/GetSubCodeItems?Kind=7&ParentItemNo=" + id })
}

//新增區的城市資料讀取
BussinessLogical.prototype.CityItems = function (id) {
    blockReportPage('資料讀取中...')
    store.dispatch({ type: 'Get', id: "CityItemNo", url: "/SYS/GetSubCodeItems?Kind=8&ParentItemNo=" + id })
}

//代碼類資料
BussinessLogical.prototype.Response = function (result) {
    var id = "#" + result.id
    var data = result.data;
    if ($(id).is('select')) {
        $(id).empty().selectpicker("refresh")
        if (id === '#CountryItem') {
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
    } else {
        if (id === "#SearchResultArea") {
            OverseaPayLimits = data;  //將查詢結果寫到全域變數
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
        }
        if (data === 0) {
            switch (id) {
                case "#MainForm":
                    alertOpen("新增失敗!")
                    break;
                case "#UpdateForm":
                    alertOpen("修改失敗!")
                    break;
                case "#Delete":
                    alertOpen("刪除失敗!");
                    break;
                default:
                    break;
            }

        } else {
            switch (id) {
                case "#MainForm":
                    alertOpen("新增成功")
                    break;
                case "#UpdateForm":
                    alertOpen("修改成功")
                    break;
                case "#Delete":
                    alertOpen("刪除成功");
                    $("#Search").trigger("click");
                    break;
                default:
                    break;
            }
        }
    }
    blockReportPage('')
}

//查詢
$(document).on('click', '#Search', function () {
    store.dispatch({ type: 'Search' })
});

//顯示新增作業
$('#CreateLink').click(function (e) {
    store.dispatch({ type: 'ShowCreate' })
})

//按下新增更新
$(document).on('click', '#CreateConfirmLink', function (e) {
    store.dispatch({ type: 'AcceptCreate' })
})

//顯示修改
$(document).on('click', '.p-left1', function () {
    var oplid = $(this).closest('tbody>tr').attr('data-oplid');
    store.dispatch({ type: 'ShowEdit', id: oplid })
});

//按下修改更新
$(document).on('click', '#EditConfirmLink', function (e) {
    store.dispatch({ type: 'AcceptEdit' })
})

//刪除
$(document).on('click', '.p-left2', function () {
    var oplid = $(this).closest('tbody>tr').attr('data-oplid');
    store.dispatch({ type: 'Delete', id: oplid })
});

$(document).on("blur", "input:text", function (e) {
    //console.log(e.target.id)
    if ($(this).val().length > 0) {
        if (e.target.id === "PayAmount") {
            var r = /^\d+(\.\d{0,2})?$/;
            if (r.test($(this).val()) === false) {
                $(this).val("");
                alertOpen("只能輸入數字或含小數兩位數字");
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
        if (e.target.id === "AreaItem") {
            store.dispatch({ type: 'QueryItems', id: e.target.value })
        }
        if (e.target.id === "AreaItemNo") {
            store.dispatch({ type: 'ActionItems', id: e.target.value })
        }
        if (e.target.id === "CountryItemNo") {
            store.dispatch({ type: 'CityItems', id: e.target.value })
        }
    })
}

$(function () {
    //取得地區
    blockReportPage('資料讀取中...')
    store.dispatch({ type: 'Get', id: "AreaItem", url: "/SYS/GetCodeItem/Area" })
    SetEvents();
})
