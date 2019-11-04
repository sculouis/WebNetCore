var project;
var originalProject;
var tablePropertyTemp = $($('#table-property-temp').html()).clone();
var tableItemTemp = $($('#table-item-temp').html()).clone();
$(function () {
    //刪除明細的隱藏XX顯示
    $(document).on(
        {
            mouseenter: function () { $(this).find('.deleteThisDetail').show(); },
            mouseleave: function () { $(this).find('.deleteThisDetail').hide(); }
        },
        "tbody"
    );

    //專案起始日
    $('#ProjectEffectiveDate').on('dp.change', function () {
        project.ProjectEffectiveDate = $(this).find('input').val();
    });
    //專案結束日
    $('#ProjectInEffectiveDate').on('dp.change', function () {
        project.ProjectInEffectiveDate = $(this).find('input').val();
    });

    //專案項目起始日
    $(document).on('dp.change', '.ItemEffectiveDate', function () {
        var tbody = $(this).parents('tbody');
        var index = $('#table-item tbody').index(tbody);
        project.ProjectItemList[index].ProjectEffectiveDate = $(this).find('input').val();
    });
    //專案項目結束日
    $(document).on('dp.change', '.ItemInEffectiveDate', function () {
        var tbody = $(this).parents('tbody');
        var index = $('#table-item tbody').index(tbody);
        project.ProjectItemList[index].ProjectInEffectiveDate = $(this).find('input').val();
    });

    //刪除人員or單位
    $(document).on('click', '.Links .glyphicon-remove', function () {
        var linkDOM = $(this).parents('.Links');
        var domID = $(linkDOM).parent().attr('id');
        var linkID = $(linkDOM).attr('linkID');
        $(linkDOM).remove();
        removeOrgpickItem(domID, linkID);
    });

    //按下【新增明細】以填寫XX明細資訊
    $('.showAppendTable').click(function () {
        var parent = $(this).parents('.content-box');
        $(this).hide();

        $(parent).find('div.disable-text').hide();
        var table = $(parent).find('table');
        $(table).show();
        $(table).find('.appendDetail').trigger('click');
    });

    //新增明細
    $('.appendDetail').click(function () {
        var table = $(this).parents('table');
        addDetailData($(table).attr('id'));
        var tbody = getCloneTbody($(table).attr('id'));

        $(table).append(tbody);
        $(tbody).find('select').selectpicker('refresh');
        $(tbody).find('.datetimepicker1').datetimepicker({ format: 'YYYY-MM-DD' });
        $(tbody).find('.AmortizationRatio').trigger('change');

        resetSerNum(table);
    });

    //新增專案項目分攤明細
    $(document).on('click', '.appendShareDetail', function () {
        var table = $(this).parents('table');
        var tbody = $(this).parents('tbody');
        addShareDetail($(table).find('tbody').index(tbody), $(tbody).attr('detailID'));
        var tr = $(tableItemTemp.clone()).find('.shareDetail').eq(0);
        $(this).parents('tr').before(tr);
        $(tr).find('select').selectpicker('refresh');
        $(tr).find('.AmortizationRatio').trigger('change');
    });

    //刪除明細
    $(document).on('click', '.deleteThisDetail', function () {
        var tbody = $(this).parents('tbody');
        var table = $(this).parents('table');
        //專案項目至少一筆
        if ($(table).attr('id') == 'table-item' && $(table).find('tbody:visible').length == 1) {
            alertopen('專案項目明細必須至少一筆!');
            return;
        }
        if ($(table).find('tbody:visible').length == 1) {
            var parent = $(this).parents('.content-box');
            $(parent).find('.showAppendTable').show();
            $(parent).find('div.disable-text').show();
            $(parent).find('table').hide();
        }
        if ($(tbody).attr('detailID') != '00000000-0000-0000-0000-000000000000') {
            deleteDetailData($(table).attr('id'), $(table).find('tbody').index(tbody), false);
            $(tbody).find('.SerNum').removeClass('SerNum');
            $(tbody).hide();
        }
        else {
            deleteDetailData($(table).attr('id'), $(table).find('tbody').index(tbody), true);
            $(tbody).remove();
        }

        resetSerNum(table);
    });

    //刪除分攤明細
    $(document).on('click', '.deleteShare', function () {
        var tr = $(this).parents('tr.shareDetail');
        var tbody = $(this).parents('tbody');
        var table = $(this).parents('table');
        if ($(tbody).find('tr.shareDetail:visible').length == 1) {
            alertopen('專案項目分攤明細必須至少一筆!');
            return;
        }
        if ($(tr).attr('detailID') != '00000000-0000-0000-0000-000000000000') {
            deleteShareData($(table).find('tbody').index(tbody), $(tbody).find('.shareDetail').index(tr), false);
            $(tr).hide();
        }
        else {
            deleteShareData($(table).find('tbody').index(tbody), $(tbody).find('.shareDetail').index(tr), true);
            $(tr).remove();
        }
    });

    //取得後端Model
    project = getModel();
    project.ModifyBy = getMemberInfo().EmpID;
    project.ModifyByName = getMemberInfo().EmpName;

    originalProject = getModel();
    
    var budgetDOM = $('#BudgetAmount');
    switch ($(budgetDOM).prop('tagName')) {
        case 'INPUT':
            $(budgetDOM).trigger('change');
            break;
        case 'DIV':
            $(budgetDOM).text(accounting.formatNumber(project.BudgetAmount));
            break;
    }

    if (project.ProjectStatus == 0) {
        DisableDOMObject($('#IsVisible'));
    }
});

function alertopen(text) {
    /// <summary>偉大的UI/UX說不要用醜醜的原生alert，改用remodal</summary>
    /// <param name="text" type="string or array">你想顯示給北七使用者的文字</param>

    $('#alertText').empty();
    if (typeof (text) != typeof ([])) {
        $('#alertText').text(text);
        $('[data-remodal-id=alert-modal]').remodal().open();
    }
    else {
        if (text.length < 1) {
            return;
        }
        $('#alertText').append(text.join("<br>"));
        $('[data-remodal-id=alert-modal]').remodal().open();
    }
}

function resetSerNum(table) {
    /// <summary>重新編排table的項次流水號，當列數增減時呼叫此function</summary>
    /// <param name="table" type="DOM">受影響的table</param>

    $.each($(table).find('.SerNum'), function (index, element) {
        $(element).text(index + 1);
    });
}

function deleteDetailData(id, index, isRealDelete) {
    /// <summary>刪除明細的json obj處理</summary>
    /// <param name="id" type="string">table id</param>
    /// <param name="index" type="number">table row index</param>
    /// <param name="isRealDelete" type="bool">True：直接自array移除，False：需將isDelete設為true</param>

    switch (id) {
        case 'table-item':
            removeItemDetail(index, isRealDelete);
            break;
            //case 'table-contact':
            //    removeContactDetail(index, isRealDelete);
            //    break;
        case 'table-property':
            removePropertyDetail(index, isRealDelete);
            break;
    }
}

function removeItemDetail(index, isRealDelete) {
    /// <summary>刪除明細的json obj處理</summary>
    /// <param name="index" type="number">table row index</param>
    /// <param name="isRealDelete" type="bool">True：直接自array移除，False：需將isDelete設為true</param>

    if (isRealDelete) {
        project.ProjectItemList.splice(index, 1);
    }
    else {
        project.ProjectItemList[index].IsDelete = true;
        project.ProjectItemList[index].DeleteBy = getMemberInfo().EmpID;
        project.ProjectItemList[index].ItemShareList = project.ProjectItemList[index].ItemShareList.filter(function (item) {
            return item.PSID != '00000000-0000-0000-0000-000000000000';
        });
        project.ProjectItemList[index].ItemShareList.forEach(function (item) {
            item.IsDelete = true;
            item.DeleteBy = getMemberInfo().EmpID;
        });
    }
}

function removePropertyDetail(index, isRealDelete) {
    /// <summary>刪除明細的json obj處理</summary>
    /// <param name="index" type="number">table row index</param>
    /// <param name="isRealDelete" type="bool">True：直接自array移除，False：需將isDelete設為true</param>

    if (isRealDelete) {
        project.ProjectPropertyList.splice(index, 1);
    }
    else {
        project.ProjectPropertyList[index].IsDelete = true;
        project.ProjectPropertyList[index].DeleteBy = getMemberInfo().EmpID;
    }
}

function deleteShareData(itemIndex, shareIndex, isRealDelete) {
    /// <summary>刪除明細的json obj處理</summary>
    /// <param name="index" type="number">table row index</param>
    /// <param name="index" type="number">share row index</param>
    /// <param name="isRealDelete" type="bool">True：直接自array移除，False：需將isDelete設為true</param>

    if (isRealDelete) {
        project.ProjectItemList[itemIndex].ItemShareList.splice(shareIndex, 1);
    }
    else {
        project.ProjectItemList[itemIndex].ItemShareList[shareIndex].IsDelete = true;
        project.ProjectItemList[itemIndex].ItemShareList[shareIndex].DeleteBy = getMemberInfo().EmpID;
    }
}

function clickSave(action) {
    /// <summary>存檔</summary>

    blockPageForJBPMSend();
    $.when(verify()).done(function () {
        blockPage('');
        saveData(action)
    }).fail(function () {
        blockPage('');
    });
}

function saveData(action) {
    var text = project.ProjectStatus == 0 ? '即將暫存專案，是否確認暫存?' :
        project.ProjectStatus == 1 ? '專案即將進版，是否確認儲存?' :
        project.ProjectStatus == 2 ? '專案即將終止，是否確認儲存?' :
        project.ProjectStatus == 3 ? '專案即將結案，是否確認儲存?' : '即將儲存專案並重新導向頁面，是否確認儲存?'

    confirmopen(
        text,
        function () {
            blockPageForJBPMSend();
            var url = '/Project/' + action;
            $.ajax({
                cache: false,
                url: url,
                dataType: 'json',
                type: 'POST',
                data: { project: project, originalProject: originalProject },
                success: function (data, textStatus, jqXHR) {
                    window.location = '/Project/Edit/' + data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    blockPage('');
                    alertopen('儲存專案時發生錯誤，請洽系統管理員');
                }
            });
        },
        function () { });
}

function verify() {
    $('div.error-text').remove();
    var deferred = $.Deferred();
    $.ajax({
        cache: false,
        url: '/Project/Verify',
        dataType: 'json',
        type: 'POST',
        data: {
            project: project, originalProject: originalProject
        },
        success: function (data, textStatus, jqXHR) {
            if (data == true) {
                deferred.resolve();
            }
            else {
                var alertMsg = [];
                $.each(data, function (index, element) {
                    if (element.ErrKey != 'AlertBox') {
                        $('div[validationKey="' + element.ErrKey + '"]').append('<div class="error-text"><span class="icon-error icon-error-size"></span>' + element.ErrValue + '</div>');
                        if (index == 0) {
                            if ($('div[validationKey="' + element.ErrKey + '"]').offset() == undefined) {
                                return;
                            }
                            $(".main-content-box").animate({
                                scrollTop: $('div[validationKey="' + element.ErrKey + '"]').offset().top + $('.main-content-box').scrollTop() - 60
                            }, 300);
                        }
                    }
                    else {
                        alertMsg.push(element.ErrValue);
                    }
                });
                if (alertMsg.length > 0) {
                    alertopen(alertMsg);
                }
                deferred.reject();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            deferred.reject();
        }
    });
    return deferred.promise();
}

function removeOrgpickItem(id, target) {
    /// <summary>orgpick links移除</summary>
    /// <param name="id">移除對象</param>
    /// <param name="target">人員or單位代號</param>

    switch (id) {
        case 'GodLikeOrgPicker':
            removeGodLikeUser();
            break;
        case 'ManageOrgPicker':
            removeAuthUser(target, 0);
            break;
        case 'ReportOrgPicker':
            removeAuthUser(target, 1);
            break;
        case 'UnitOrgPicker':
            removeUnit();
            break;
    }
}

function removeGodLikeUser() {
    /// <summary>移除專案管理者</summary>

    project.ProjectManager = '';
    project.ProjectManagerName = '';

    $('#GodLikeOrgPicker').append('<div class="no-file-text"><b>- 選擇1位人員 -</b></div>');
}

function removeAuthUser(user, role) {
    /// <summary>移除XX權限者</summary>

    var index = project.ProjectAuthList.findIndex(function (item) {
        return item.EmployeeNo == user && !item.IsDelete && item.ProjectRole == role;
    });

    if (index > -1) {
        if (project.ProjectAuthList[index].PAID == '00000000-0000-0000-0000-000000000000') {
            project.ProjectAuthList.splice(index, 1);
        }
        else {
            project.ProjectAuthList[index].isDelete = true;
            project.ProjectAuthList[index].DeleteBy = getMemberInfo().EmpID;
        }
    }

    var filter = project.ProjectAuthList.filter(function (item) {
        return !item.IsDelete && item.ProjectRole == role;
    });

    if (filter.length == 0) {
        $(role == 0 ? '#ManageOrgPicker' : '#ReportOrgPicker').append('<div class="no-file-text"><b>- 選擇多位人員 -</b></div>');
    }
}

function removeUnit() {
    /// <summary>移除所屬單位</summary>

    project.ProjectOrg = '';
    project.ProjectOrgName = '';

    $('#UnitOrgPicker').append('<div class="no-file-text"><b>- 選擇1個單位 -</b></div>');
}

function changeProjectName(value) {
    /// <summary>專案名稱change event</summary>

    project.ProjectName = value;
}

function changeProjectStatus(selectDOM) {
    /// <summary>專案狀態change event</summary>

    project.ProjectStatus = Number($(selectDOM).val());
    if ($(selectDOM).val() == '1') {
        $('#IsVisible').val('true');
    }
    else {
        $('#IsVisible').val('false');
    }
    $('#IsVisible').selectpicker('refresh');
    $('#IsVisible').trigger('change');
}

function changeIsVisible(selectDOM) {
    /// <summary>費用表單顯示change event</summary>

    project.IsVisible = $(selectDOM).val() == 'true';
}

function queryGodLike(datas, type, row) {
    /// <summary>管理者change event</summary>

    project.ProjectManager = datas[0].user_id;
    project.ProjectManagerName = datas[0].user_name;

    var links = [];
    links.push({
        Name: project.ProjectManagerName, ID: project.ProjectManager
    });
    renderOrgPickeLinks($('#GodLikeOrgPicker'), links);
}

function changeProjectCategory(selectDOM) {
    /// <summary>類別change event</summary>

    project.ProjectCategoryID = $(selectDOM).val();
    project.ProjectCategoryName = $(selectDOM).find('option:selected').text();
}

function queryManager(datas, type, row) {
    /// <summary>管理權限者change event</summary>

    var links = getAuthLinks(datas, 0);
    renderOrgPickeLinks($('#ManageOrgPicker'), links);
}

function queryReport(datas, type, row) {
    /// <summary>報表權限者change event</summary>

    var links = getAuthLinks(datas, 1);
    renderOrgPickeLinks($('#ReportOrgPicker'), links);
}

function getAuthLinks(datas, role) {
    /// <summary>管理權限者change event</summary>
    /// <param name="datas">orgPicker回傳人員資料</param>
    /// <param name="role">0:管理權限者，1:報表權限者</param>

    var links = [];

    for (index = 0; index < datas.length; index++) {
        //檢核現有ProjectAuthList資料是否已存在，若不存在則新增
        var existUser = project.ProjectAuthList.find(function (item) {
            return item.EmployeeNo == datas[index].user_id && !item.IsDelete && item.ProjectRole == role;
        });
        if (!existUser) {
            addAuthDetail(datas[index].user_id, datas[index].user_name, role);
        }
    }

    //篩選出存在的特定角色清單
    var users = project.ProjectAuthList.filter(function (item, index, array) {
        return item.ProjectRole == role && !item.IsDelete
    });

    //push至links array並return，提供UI進行render
    $.each(users, function (index, element) {
        links.push({
            Name: element.EmployeeName, ID: element.EmployeeNo
        });
    });

    //排序
    links.sort(compare);

    return links;
}

function compare(a, b) {
    /// <summary>sort object array by ID</summary>

    if (a.ID < b.ID)
        return -1;
    if (a.ID > b.ID)
        return 1;
    return 0;
}

function addAuthDetail(id, name, role) {
    /// <summary>XX權限者json obj</summary>
    /// <param name="id">員編</param>
    /// <param name="name">姓名</param>
    /// <param name="role">0:管理權限者，1:報表權限者</param>

    var detail = {
        "CreateBy": getMemberInfo().EmpID,
        "CreateTime": null,
        "DeleteBy": '',
        "DeleteTime": null,
        "EmployeeName": name,
        "EmployeeNo": id,
        "IsDelete": false,
        "PAID": "00000000-0000-0000-0000-000000000000",
        "ProjectID": project.ProjectID,
        "ProjectRole": role
    };

    project.ProjectAuthList.push(detail);
}

function queryUnit(datas, type, row) {
    /// <summary>所屬單位change event</summary>

    project.ProjectOrg = datas[0].unit_code;
    project.ProjectOrgName = datas[0].unit_name;

    var links = [];
    links.push({
        Name: project.ProjectOrgName, ID: project.ProjectOrg
    });
    renderOrgPickeLinks($('#UnitOrgPicker'), links);
}

function renderOrgPickeLinks(targetDOM, datas) {
    /// <summary>orgpicker共用function：產生Link DOM</summary>

    targetDOM.empty();
    $.each(datas, function (index, element) {
        var link = $('<div>').addClass('Links').attr('linkID', element.ID).append(
                        $('<div>').addClass('Links-peo')
                            .append('<span>' + element.Name + '(' + element.ID + ')</span>')
                            .append('<div class="XX01"><i class="glyphicon glyphicon-remove"></i></div>')
                    );
        targetDOM.append(link);
    });
}

function changeBudgetAmount(inputDOM) {
    /// <summary>預算總金額change event</summary>

    project.BudgetAmount = accounting.unformat($(inputDOM).val());
    $(inputDOM).val(accounting.formatNumber(project.BudgetAmount));
}

function addDetailData(id) {
    /// <summary>根據table id取得明細層的json obj</summary>
    /// <param name="id" type="string">table id</param>

    switch (id) {
        case 'table-item':
            //地址明細json obj
            addItemDetail();
            addShareDetail(project.ProjectItemList.length - 1, '00000000-0000-0000-0000-000000000000');
            break;
            //case 'table-contact':
            //    //聯絡人明細json obj
            //    addContactDetail();
            //    break;
        case 'table-property':
            //屬性明細json obj
            addPropertyDetail();
            break;
    }
}

function addPropertyDetail() {
    /// <summary>屬性明細json obj</summary>

    var detail = {
        "CIID": "00000000-0000-0000-0000-000000000000",
        "ClassficationName": '',
        "CreateBy": getMemberInfo().EmpID,
        "CreateTime": null,
        "DeleteBy": '',
        "DeleteTime": null,
        "IsDelete": false,
        "PPID": "00000000-0000-0000-0000-000000000000",
        "ProjectID": project.ProjectID,
        "PropertyCode": '',
        "PropertyName": ''
    };

    project.ProjectPropertyList.push(detail);
}

function addItemDetail() {
    /// <summary>項目明細json obj</summary>

    var detail = {
        "CreateBy": getMemberInfo().EmpID,
        "CreateTime": null,
        "DeleteBy": '',
        "DeleteTime": null,
        "IsDelete": false,
        "ItemShareList": [],
        "ProjectEffectiveDate": null,
        "ProjectID": project.ProjectID,
        "ProjectInEffectiveDate": null,
        "ProjectItemID": "00000000-0000-0000-0000-000000000000",
        "ProjectTask": '',
        "ProjectTaskDesc": ''
    };

    project.ProjectItemList.push(detail);
}

function addShareDetail(itemIndex, itemGuid) {
    /// <summary>分攤明細json obj</summary>
    /// <param name="itemIndex" type="String">tbody index</param>
    /// <param name="itemGuid" type="String">tbody detailID</param>

    var detail = {
        "AmortizationRatio": 0,
        "CostProfitCenter": '',
        "CostProfitCenterName": '',
        "CreateBy": getMemberInfo().EmpID,
        "CreateTime": null,
        "DeleteBy": '',
        "DeleteTime": null,
        "IsDelete": false,
        "ProjectItemID": itemGuid,
        "PSID": "00000000-0000-0000-0000-000000000000"
    };

    project.ProjectItemList[itemIndex].ItemShareList.push(detail);
}

function getCloneTbody(id) {
    /// <summary>根據id取得tbody樣版</summary>
    /// <param name="id" type="String">table id</param>

    var tbody;
    switch (id) {
        case 'table-item':
            tbody = tableItemTemp.clone();
            break;
            //case 'table-contact':
            //    tbody = tableContactTemp.clone();
            //    break;
        case 'table-property':
            tbody = tablePropertyTemp.clone();
            break;
    }
    return tbody;
}

function changePropertyCode(selectDOM) {
    /// <summary>專案屬性change event</summary>

    var tbody = $(selectDOM).parents('tbody');
    var index = $('#table-property tbody').index(tbody);
    project.ProjectPropertyList[index].PropertyCode = $(selectDOM).val();
    project.ProjectPropertyList[index].PropertyName = $(selectDOM).find('option:selected').text();
}

function changeClassficationName(inputDOM) {
    /// <summary>專案屬性名稱change event</summary>

    var tbody = $(inputDOM).parents('tbody');
    var index = $('#table-property tbody').index(tbody);
    project.ProjectPropertyList[index].ClassficationName = $(inputDOM).val();
}

function changeProjectTask(inputDOM) {
    /// <summary>專案項目change event</summary>

    var tbody = $(inputDOM).parents('tbody');
    var index = $('#table-item tbody').index(tbody);
    project.ProjectItemList[index].ProjectTask = $(inputDOM).val();
}

function changeProjectTaskDesc(inputDOM) {
    /// <summary>專案項目說明change event</summary>

    var tbody = $(inputDOM).parents('tbody');
    var index = $('#table-item tbody').index(tbody);
    project.ProjectItemList[index].ProjectTaskDesc = $(inputDOM).val();
}

function changeCostProfitCenter(selectDOM) {
    /// <summary>成本利潤中心change event</summary>

    var tbody = $(selectDOM).parents('tbody');
    var itemIndex = $('#table-item tbody').index(tbody);
    var shareIndex = $(tbody).find('.shareDetail').index($(selectDOM).parents('tr.shareDetail'));

    project.ProjectItemList[itemIndex].ItemShareList[shareIndex].CostProfitCenter = $(selectDOM).val();
    project.ProjectItemList[itemIndex].ItemShareList[shareIndex].CostProfitCenterName = $(selectDOM).find('option:selected').attr('description');
}

function changeAmortizationRatio(inputDOM) {
    /// <summary>分攤比例change event</summary>

    var tbody = $(inputDOM).parents('tbody');
    var itemIndex = $('#table-item tbody').index(tbody);
    var shareIndex = $(tbody).find('.shareDetail').index($(inputDOM).parents('tr.shareDetail'));

    project.ProjectItemList[itemIndex].ItemShareList[shareIndex].AmortizationRatio = accounting.unformat($(inputDOM).val());
    $(inputDOM).val(accounting.formatMoney(project.ProjectItemList[itemIndex].ItemShareList[shareIndex].AmortizationRatio, {
        symbol: "%", format: "%v%s", precision: 0
    }));
}

function clickCopyProject() {
    /// <summary>複製專案</summary>

    confirmopen(
        '即將複製專案並重新導向頁面，是否確認複製?',
        function () {
            blockPageForJBPMSend();
            $.ajax({
                cache: false,
                url: '/Project/CopyProject/',
                dataType: 'json',
                type: 'POST',
                data: { project: project },
                success: function (data, textStatus, jqXHR) {
                    window.location = '/Project/Edit/' + data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    blockPage('');
                    alertopen('複製專案時發生錯誤，請洽系統管理員');
                }
            });
        },
        function () { });
}