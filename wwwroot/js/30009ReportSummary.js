//人員組織資料
var _unitData;

//=====================================================
//取得登入人員的預設主要單位
//_unitData陣列中，單位越小的在越前面
//unit_level = 7：科/組
//unit_level = 6：分行/中心
//unit_level = 5：部
//unit_level = 4：處
//unit_level = 3：總經理室
//利用迴圈排除掉7與5，即可得到預設單位
//=====================================================
function GetMemberDefaultRootUnit() {
    var unit;

    for (index = _unitData.length - 1; index >= 0 ; index--) {
        if (_unitData[index].unit_level != 7 && _unitData[index].unit_level != 5) {
            unit = _unitData[index].unit_id;
            break;
        }
    }

    return unit;
}

//定義請款類別
var ExpenseKindObjs = {
    "PREPAY": { "PREPAY": "預付款" }
                       , "EPO": { "PO_STD": "驗收請款", "PO_CM_RETURN": "退貨折讓"}
                       , "ENP": { "PO_CM_EXP": "一般請款" , "NPO_CM_EXP": "一般折讓", "NPO_DONATE_EXP": "捐贈(贊助)" }
                       , "EMP": { "EMP_TRAVEL_EXP": "出差", "EMP_OTHER_EXP": "其他代墊", "EMP_MGR_EXP": "經理人交通津貼" }
                       , "EEA": { "EA_MISC_EXP": "雜項請款", "EA_SPECIFIC_EXP": "特定用途" }
                       , "ESP": { "ESP_EXP": "一般請款", "ESP_CM_EXP": "一般折讓", "ESP_DONATE_EXP": "捐贈(贊助)" }
}

//定義請款單類別
var KindObjs = {
    "PREPAY":"廠商-預付款",
    "EPO": "廠商請款-請購",
    "ENP": "廠商請款-非請購",
    "EMP":"員工報支",
    "ESP": "會計處專用",
    "EEA": "特殊用途專戶"
}

//ajax post從Server取得資料
function GetPostData(id, serverUrl, inputData) {
    $.ajax({
        async: false,
        type: 'POST',
        dataType: 'json',
        data: inputData,
        url: serverUrl,
        success: function (data) {
            console.log(data)
            BindData(id, data.Detail)
        },
        error: function (data) {
            console.log("錯誤")
        }
    });
}

//ajax GET從Server取得資料
function GetData(id, serverUrl, inputData) {
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        data: inputData,
        url: serverUrl,
        success: function (data) {
            console.log(data)
            BindArrayData(id, data)
        },
        error: function (data) {
            console.log("錯誤")
        }
    });
}

//ajax GET從Server取得資料
function GetDataObj(id, serverUrl, inputData) {
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        data: inputData,
        url: serverUrl,
        success: function (data) {
            console.log(data)
            BindData(id, data)
        },
        error: function (data) {
            console.log("錯誤")
        }
    });
}

//取得請款大類
function GetPaymentCategory(expKind) {
    $.ajax({
        async: true,
        type: 'GET',
        dataType: 'json',
        url: '/Report/GetPaymentCategory?expKind=' + expKind,
        success: function (data) {
            console.log(data)
            let paymentCategorys = []
            $.each(data, function (index, item) {
                paymentCategorys.push({
                    key: item.ItemNo, value: item.ItemName
                })
            })
            BindArrayData("PaymentCategory", paymentCategorys)
        },
        error: function (data) {
            alert("無法取得請款大類");
        }
    })
}

//取得請款中類
function GetPaymentMidCategory(expKind,paymentCategory) {
    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: '/Report/GetPaymentMidCategory?expKind=' + expKind + '&paymentCategory=' + paymentCategory,
        success: function (data) {
            console.log(data)
            let paymentMidCategorys = []
            $.each(data, function (index, item) {
                paymentMidCategorys.push({
                    key: item.ItemNo, value: item.ItemName
                })
            })
            BindArrayData("PaymentMidCategory", paymentMidCategorys)
        },
        error: function (data) {
            alert("無法取得請款中類");
        }
    })
}



//產品明細取得
function GetProductDetail() {
    $.ajax({
        async: true,
        type: 'GET',
        dataType: 'json',
        url: '/ENP/GetProductDetail?enpNum=EMP201806290001',
        success: function (data) {
            console.log(data)
            let pdDictionary = []
            $.each(data, function (index, item) {
                pdDictionary.push({
                    key: item.productDetail, value: item.productDetallDescription
                })
            })
            _optionList.push({
                key: 'productDetail', value: pdDictionary
            })
        },
        error: function (data) {
            FiisFatalFail();
        }
    })
}


//會計項子目取得
function GetCoaAccount() {
    $.ajax({
        async: true,
        type: 'GET',
        dataType: 'json',
        url: '/ENP/GetCoaAccount?enpNum=' + $('#P_SignID').val(),
        success: function (data) {
            let pdDictionary = []
            $.each(data, function (index, item) {
                pdDictionary.push({
                    key: item.account, value: item.description
                })
            })
            _optionList.push({
                key: 'enpAccountingItem', value: pdDictionary
            })
        },
        error: function (data) {
            FiisFatalFail();
        }
    })
}

function FiisFatalFail() {
    console.log("FiisAPI連接錯誤")
}


//綁定代碼類資料By Object
function BindData(id, Detail) {
    id = "#" + id
    $(id).empty().selectpicker("refresh")
    $(id).append("<option>請選擇</option>");
    Object.keys(Detail).forEach(function (item) {
        switch (id) {
            case "#ExpenseAttribute":
                $(id).append('<option value=' + item + '>' + item + ":" + Detail[item] + '</option>');
                break;
            case "#Project":
                $(id).append('<option value=' + Detail[item].ProjectCode + '>' + Detail[item].ProjectName + '</option>');
                break;
            default:
                $(id).append('<option value=' + item + '>' + Detail[item] + '</option>');
                break;
        }
    })
    $(id).selectpicker("refresh");
}

//綁定代碼類資料By Array
function BindArrayData(id, data) {
    id = "#" + id
    $(id).empty().selectpicker("refresh")
    $(id).append("<option>請選擇</option>");
    //$.each(function (data,item) {
    //    var arry = Object.values(item)
    //    $(id).append('<option value=' + arry[0] + '>' + arry[1] + '</option>');
    //})

    //ProductKind
    //CostProfitCenter


    if (id === '#ProductKind' || id === '#CostProfitCenter') {
        $.each(data, function (i, item) {
            $(id).append('<option value=' + item[Object.keys(item)[0]] + '>'  + item[Object.keys(item)[0]] + ":" + item[Object.keys(item)[1]] + '</option>');
        });
    } else {
        $.each(data, function (i, item) {
            $(id).append('<option value=' + item[Object.keys(item)[0]] + '>' + item[Object.keys(item)[1]] + '</option>');
        });

    }

    $(id).selectpicker("refresh");
}


//確認選擇供應商，更新供應商名稱 & 重設側邊選單
function vendorSelected(vendor) {
    if (vendor) {
        suppliesUIChange(vendor.supplierName, vendor.supplierNumber);
    }
}

//移除or重選供應商
function resetSuppliesInfo() {
    //供應商
    $('#VendorName').text('請選擇供應商');
}

//供應商變更的UI操作
function suppliesUIChange(name, number) {
    $('#VendorName').val(name);
    $('#VendorNum').val(number);
    $('#VendorNameAndNum').empty();
    $('#VendorNameAndNum').append('\
        <div class="Links">\
            <div class="Links-n">\
                <span class="file-text">' + name + '(' + number + ')' + '</span>\
                <div class="XX01" onclick="VendorRemove()"><i class="glyphicon glyphicon-remove"></i></div>\
            </div>\
        </div>')
}

///清除選項
function VendorRemove() {
    $('#VendorNameAndNum').empty();
    $('#VendorNameAndNum').append('請點選右方【選擇】鈕選擇供應商')
    $('#VendorName').val(undefined);
    $('#VendorNum').val(undefined);
}


//開啟供應商
$(document).on('click', '#VendorOpen', function () {
    openVendor(true, null);
});


//事件結果
function eventHandler(e) {
    //選定的請款單類別下的請款單類別
    if (e.target.id === "Kind") {
        //$("#ExpenseKind").empty().selectpicker("refresh")
        if (e.target.value !== "請選擇") {
            var expenseKind = ExpenseKindObjs[e.target.value]
            BindData("ExpenseKind", expenseKind)
        } else {
            $("#ExpenseKind").empty().selectpicker("refresh")
        }
    }

    //設定請款大類
    if (e.target.id === "ExpenseKind") {
        $("#PaymentCategory").empty().selectpicker("refresh")
        $("#PaymentMidCategory").empty().selectpicker("refresh")
        if (e.target.value !== "請選擇") {
            GetPaymentCategory(e.target.value)
        }
    }

    //選定的請款大類下的請款中類
    if (e.target.id === "PaymentCategory") {
        $("#PaymentMidCategory").empty().selectpicker("refresh")
        GetPaymentMidCategory($("#ExpenseKind").val(), e.target.value)
        //var data = { CodeKind: 1, ParentItemNo: e.target.value }
        //var url = '/Report/GetCodeitem'
        //GetPostData('PaymentMidCategory', url, data)
    }

}

//設定事件
function SetEvents() {
    //設定Select Change的事件
    $("select").on("change", function (e) {
        //移除錯誤訊息
        var id = "#" + e.target.id
        eventHandler(e)
    })
}


$(document).on("dp.change", ".EXPStartDate", function (e) {
    $('.EXPEndDate').data("DateTimePicker").minDate(e.date);
});
$(document).on("dp.change", "#EXPEndDate", function (e) {
    $('.EXPStartDate').data("DateTimePicker").maxDate(e.date);
});


$(function () {
    //取得登入者單位
    _unitData = getUnitData()
    $("#ApplicantId").val(GetMemberDefaultRootUnit())

    SetEvents()  //設定控制項事件

    //設定請款單類別
    BindData("Kind",KindObjs)

    //==========================================
    // 請款單日期起不可大於迄
    //==========================================
    //取得費用類別(大類)
    //var data = { CodeKind: 0, ParentItemNo: undefined }
    //var url = '/Report/GetCodeitem'
    //GetPostData('PaymentCategory', url, data)

    //取得費用性質
    data = { CodeKind:11, ParentItemNo: undefined }
    url = '/Report/GetCodeitem'
    GetPostData('ExpenseAttribute', url, data) //show 代碼+名稱

    //取得專案
    data = { projectCategoryCode: undefined }
    url = '/Report/GetProject'
    GetDataObj('Project', url, data)

    //取得產品別
    data = { enpNum: undefined }
    url = '/ENP/GetProduct'
    GetData('ProductKind', url, data)  //show 代碼+名稱

    //取得產品明細
    GetProductDetail()

    //取得會計項子目
    GetCoaAccount()

    //取得成本與利潤中心
    data = { enpNum: undefined, company: undefined }
    url = '/ENP/GetCoaCompanyAndDepartment'
    GetData('CostProfitCenter', url, data)  //show 代碼+名稱

    if (typeof (getModel) == "function") {
        $("#EXPNum").val(getModel())
    }

    //產生Xls檔
    $("#genXls").click(function () {
        $("#MainForm").submit()
    })

})

