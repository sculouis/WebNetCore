var ProjectCategoryArray = [];
var ProjectArray = [];

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

//ajax POST 取得partial view html
function PostPartial(id, serverUrl, updatedata) {
    var deferred = $.Deferred();
    $.ajax({
        type: 'POST',
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

//處理預作業的輸入參數
function UIReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var action = arguments[1];
    var result = { state: action.type, id: action.id, data: action.data, selector: action.selector };
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

//中間層在處理傳送參數
let fetch = Redux.applyMiddleware(FetchData)

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
var store = Redux.createStore(UIReducer, fetch);

// You can use subscribe() to update the UI in response to state changes.
store.subscribe(function () {
    var actionResult = store.getState();
    var bo = new BussinessLogical();
    switch (actionResult.state) {
        case 'Search':
            bo.Search();
            break;
        case 'ShowDetail':
            bo.ShowDetail();
            break;
        case 'ShowSourceAndProject':
            bo.ShowSourceAndProject(actionResult.id);
            break;
        case 'PrevPage':     //回上一頁
            bo.PrevPage(actionResult.id);
            break;
        case 'RenderPartial':     //渲染PartialView
            bo.RenderPartial(actionResult.id, actionResult.data);
            break;
        case 'GetResult':     //取得Select的資料
            bo.GetResult(actionResult.id, actionResult.data);
            break;
        case 'GenXLS':     //產生XLS報表
            bo.GenXLS();
            break;
        case 'GenReportDataXls':     //產生費用明細XLS報表
            bo.GenReportDataXls();
            break;
        case 'ShowProjectCode':     //show 專案代碼
            bo.ShowProjectCode(actionResult.id);
            break;
        case 'ShowOrgResult':     //show 組織樹選擇結果
            bo.ShowOrgResult(actionResult.id, actionResult.data);
            break;
        case 'Response':
            bo.Response(actionResult);
            break;
        case 'RemoveMember':  //人員移除
            bo.RemoveMember(actionResult.selector);
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

//show 專案來源
BussinessLogical.prototype.ShowSourceAndProject = function (id) {
    var projectCategory = _.find(ProjectCategoryArray, { ProjectCategoryID: id });
    $("#ProjectSource").text(projectCategory.Source)
    $("#ProjectCode").empty();

    blockReportPage('資料讀取中...')
    //呼叫後端資料庫取得專案資料
    store.dispatch({ type: 'Get', id: "ProjectID", url: "/Project/GetProjectList?id=" + $("#ProjectCategoryID").val() + "&LoginMember=" + $("#LoginMember").val() })
}

//show 專案代碼
BussinessLogical.prototype.ShowProjectCode = function (id) {
    var project = _.find(ProjectArray, { ProjectID: id });
    $("#ProjectCode").text(project.ProjectCode);
}

//回上一頁
BussinessLogical.prototype.PrevPage = function (id) {
    $("#DetailResult").hide();
    $("#Search").show();
    $("#SearchProjectBtn").trigger('click');
    setTimeout(function () {
        blockReportPage('');
    }, 200)
}

//Get Server資料渲染Select
BussinessLogical.prototype.GetResult = function (id, data) {
    id = "#" + id
    if ($(id).is('select')) {   //判斷是Select Tag
        $(id).empty().selectpicker("refresh")
        if (id === '#ProjectCategoryID') {
            ProjectCategoryArray = data;  //將專案類別存到全域變數
            $.each(data, function (i, item) {
                $(id).append('<option value=' + item.ProjectCategoryID + '>' + item.Name + '</option>');
            });
        } else if (id === '#ProjectID') {
            ProjectArray = data;  //將專案存到全域變數
            $.each(data, function (i, item) {
                $(id).append('<option value=' + item.ProjectID + '>' + item.ProjectName + '</option>');
            });
        } else {
            $.each(data, function (i, item) {
                $(id).append('<option value=' + item[Object.keys(item)[2]] + '>' + item[Object.keys(item)[3]].trim() + ":" + item[Object.keys(item)[2]] + '</option>');
            });
            //console.log(data)
        }
        $(id).selectpicker("refresh");
    }
    setTimeout(function () {
        blockReportPage('');
    }, 200)
}

//渲染PartialView結果
BussinessLogical.prototype.RenderPartial = function (id, data) {
    id = "#" + id
    if (id === '#SearchResultArea') {
        $("#ResultBlock").remove();  //移除已經存在的查詢結果
        $("#SearchResultArea").append(data);
        $("#SearchResultArea").show();
    }
    else if (id === '#Detail') {
        $("#DetailResult").empty();
        $("#DetailResult").append(data);
        $("#Search").hide();
        $("#SearchResultArea").hide();
        $("#DetailResult").show();
    }

    //清除凍結畫面
    setTimeout(function () {
        blockReportPage('');
    }, 200)
}

//產生專案動支記錄
BussinessLogical.prototype.GenXLS = function () {
    $("#MainForm").attr('action', "/Project/GenPRReportXls").submit()

    //清除凍結畫面
    setTimeout(function () {
        blockReportPage('');
    }, 2000)
}

//產生專案費用明細表XLS
BussinessLogical.prototype.GenReportDataXls = function () {
    $('#MainForm').attr('action', "/Project/GenProjectReportXls").submit();
    //清除凍結畫面
    setTimeout(function () {
        blockReportPage('');
    }, 2000)
}

//組織樹選擇結果
BussinessLogical.prototype.ShowOrgResult = function (id, data) {
    id = '#' + id;
    if (data.length > 0) {
        $(id).text(data[0].user_name + '(' + data[0].user_id + ')');
        //寫入隱藏欄位為了Sumit對應
        var code = id.replace("Name", "");
        $(code).val(data[0].user_id);
        console.log($(id).closest("div.Links").is("visible"));
        var divLinks = $(id).closest("div.Links");
        if (!divLinks.is("visible")) {
            var divNoText = $(id).closest("div").parent().siblings();
            divNoText.hide();
            divLinks.show()
        }
    }
    //清除凍結畫面
    setTimeout(function () {
        blockReportPage('');
    }, 200)
}

//組織樹人員移除
BussinessLogical.prototype.RemoveMember = function (selector) {
    var divID = $(selector).closest('div .area-1');
    $(divID).find('.Links').hide();
    $(divID).find('.no-file-text').show();
    $(divID).find('input').val('');
}

//組織樹選擇結果回呼函數-專案管理者
function ResultProjectManager(datas, type, row) {
    console.log(datas);
    blockReportPage('資料讀取中...')
    store.dispatch({ type: 'ShowOrgResult', id: "ProjectManagerName", data: datas })
}

//組織樹選擇結果回呼函數-專案申請者
function ResultProjectApplicant(datas, type, row) {
    console.log(datas);
    blockReportPage('資料讀取中...')
    store.dispatch({ type: 'ShowOrgResult', id: "ProjectApplicantName", data: datas })
}

//組織樹選擇結果回呼函數-專案所屬單位
function ResultProjectOrg(datas, type, row) {
    console.log(datas);
    blockReportPage('資料讀取中...')
    store.dispatch({ type: 'ShowOrgResult', id: "ProjectOrgName", data: datas })
}

//取得條件選擇結果
function GetConds() {
    var formData = {};
    formData.ProjectCategoryID = $("#ProjectCategoryID").val();
    formData.ProjectID = $("#ProjectID").val();
    formData.ProjectStatus = $("#ProjectStatus").val();
    formData.AmountFrom = $("#AmountFrom").val();
    formData.AmountTo = $("#AmountTo").val();
    formData.ProjectManager = $("#ProjectManager").val();
    formData.ProjectApplicant = $("#ProjectApplicant").val();
    formData.ProjectOrg = $("#ProjectOrg").val();
    formData.LoginMember = $("#LoginMember").val();
    return formData;
}

//設定控件DOM事件
function SetEvents() {
    //變更專案類別選項
    $(document).on("change", "#ProjectCategoryID", function () {
        blockReportPage('資料讀取中...')
        store.dispatch({ type: 'ShowSourceAndProject', id: $("#ProjectCategoryID").val() });
    })
    //變更專案類別選項
    $(document).on("change", "#ProjectID", function () {
        store.dispatch({
            type: 'ShowProjectCode', id: $("#ProjectID").val()
        });
    })

    //呼叫專案查詢結果Partial View
    $(document).on("click", "#SearchProjectBtn", function () {
        blockReportPage('資料讀取中...')
        store.dispatch({
            type: 'PostPartial', id: "SearchResultArea", url: "/Project/SearchProjectList", data: GetConds()
        })
    })

    //顯示檢視頁面
    $(document).on('click', '.detail-view', function () {
        var projectID = $(this).closest('tbody>tr').attr('data-projectID');
        console.log(projectID);
        blockReportPage('資料讀取中...')
        store.dispatch({
            type: 'PostPartial', id: "Detail", url: "/Project/PartialDetail/" + projectID, data: ""
        })
    });
    //回到上一頁
    $(document).on('click', '#PrevPage', function () {
        blockReportPage('回上一頁...')
        store.dispatch({ type: 'PrevPage', id: "PrevPage" });
    });
  
    //產生信用卡專案動支記錄檔
    $(document).on('click', '#CreditExportBtn', function (e) {
        e.preventDefault()
        $("#MainForm").attr('action', "/Project/GenCreditBudgetXls").submit()
    });


    //產生專案動支記錄檔
    $(document).on('click', '#ExportBtn', function () {
        store.dispatch({ type: 'GenXLS', url: "/Project/GenPRReportXls" });
    });

    //產生專案明細表
    $(document).on('click', '#ReportBtn', function () {
        store.dispatch({ type: 'GenReportDataXls', url: "/Project/GenProjectReportXls" });
    });

    //發票管理人xx event
    $(document).on('click', '.glyphicon-remove', function () {
        store.dispatch({ type: 'RemoveMember', selector: this });
    });
}

$(function () {
    //取得專案類別
    blockReportPage('資料讀取中...')
    store.dispatch({ type: 'Get', id: "ProjectCategoryID", url: "/Project/GetProjectCategorys/" + $("#LoginMember").val() });
    SetEvents();
})