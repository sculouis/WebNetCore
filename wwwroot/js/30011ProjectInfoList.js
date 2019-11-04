var infoSearch;

$(function () {
    //版本選擇
    $('.LatestVersion').change(function () {
        infoSearch.LatestVersion = $(this).val() == 'true' ? true : null;
    });

    //刪除人員or單位
    $(document).on('click', '.Links .glyphicon-remove', function () {
        var linkDOM = $(this).parents('.Links');
        var domID = $(linkDOM).parent().attr('id');
        var linkID = $(linkDOM).attr('linkID');
        $(linkDOM).remove();
        removeOrgpickItem(domID, linkID);
    });

    //分頁頁數click
    $('.main-table-pager').on('click', '.pages:not(.active)', function () {
        infoSearch.PageNo = Number($(this).text());
        $('#searchProject').trigger('click');
    });

    //分頁上一頁/下一頁click
    $('.main-table-pager').on('click', '.changePaging', function () {
        var activePage = $('.main-table-pager .active');
        infoSearch.PageNo = $(this).attr('id') == 'prevPaging' ? Number($(activePage).text()) - 1 : Number($(activePage).text()) + 1;
        $('#searchProject').trigger('click');
    });

    //查詢
    $('#searchProject').click(function () {
        blockPageForJBPMSend();
        $.ajax({
            url: '/Project/InfoSearchResult',
            dataType: 'JSON',
            type: 'POST',
            data: { search: infoSearch },
            success: function (data, textStatus, jqXHR) {
                //tbody
                $.ajax({
                    url: '/Project/RenderSearchResult',
                    dataType: 'html',
                    type: 'POST',
                    data: { projectList: data.ProjectList },
                    success: function (data, textStatus, jqXHR) {
                        $('#SearchResultArea').show();
                        $('#ResultList tbody').remove();
                        $('#ResultList').append(data);
                        $('#ResultList tbody').show(200);
                        blockPage('');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(errorThrown);
                        blockPage('');
                    }
                });
                //paging
                $('#totalrow').text(data.TotalCount);
                $.ajax({
                    url: '/Project/RenderSearchResultPaging',
                    dataType: 'html',
                    type: 'POST',
                    data: { response: data },
                    success: function (data, textStatus, jqXHR) {
                        $('.main-table-pager').empty().append(data);
                        blockPage('');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(errorThrown);
                        blockPage('');
                    }
                });
                //reset
                infoSearch.PageNo = 1;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
                blockPage('');
            }
        });
    });

    infoSearch = getModel();
});

function removeOrgpickItem(id, target) {
    /// <summary>orgpick links移除</summary>
    /// <param name="id">移除對象</param>
    /// <param name="target">人員or單位代號</param>

    switch (id) {
        case 'UnitOrgPicker':
            removeUnit();
            break;
    }
}

function removeUnit() {
    /// <summary>移除所屬單位</summary>

    infoSearch.ProjectOrg = null;
    $('#UnitOrgPicker').append('<div class="no-file-text"><b>- 選擇1個單位 -</b></div>');
}

function changeProjectCode(value) {
    infoSearch.ProjectCode = value;
}

function changeProjectName(value) {
    infoSearch.ProjectName = value;
}

function changeProjectStatus(selectDOM) {
    infoSearch.ProjectStatus = $(selectDOM).val() != '-1' ? $(selectDOM).val() : null;
}

function changeProjectCategory(selectDOM) {
    infoSearch.ProjectCategoryID = $(selectDOM).val() != '-1' ? $(selectDOM).val() : null;
}

function queryUnit(datas, type, row) {
    /// <summary>所屬單位change event</summary>

    infoSearch.ProjectOrg = datas[0].unit_code;

    var links = [];
    links.push({
        Name: datas[0].unit_name, ID: infoSearch.ProjectOrg
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

function changePageSize(selectDOM) {
    infoSearch.PageNo = 1;
    infoSearch.PageSize = $(selectDOM).val();
    $('#searchProject').trigger('click');
}

function clickDeleteProject(aDOM) {
    confirmopen(
        '即將刪除暫存專案，是否確認刪除?',
        function () {
            blockPageForJBPMSend();
            $.ajax({
                cache: false,
                url: '/Project/Delete/',
                dataType: 'json',
                type: 'POST',
                data: { projectID: $(aDOM).parents('tbody').attr('id') },
                success: function (data, textStatus, jqXHR) {
                    blockPage('');
                    if (data == true) {
                        $('#searchProject').trigger('click');
                    }
                    else {
                        alertopen('刪除專案時發生錯誤，請洽系統管理員');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    blockPage('');
                    alertopen('刪除專案時發生錯誤，請洽系統管理員');
                }
            });
        },
        function () { });
}