var _uploadData;

$(function () {
    $('#AmortizationUploadConfirm').on('click', dataConfirm)
    $('#SearchUploadRecord').on('click', getUploadRecordList)
    $(document).on('click', '.UploadDetailView', getUploadDetail)
    $(document).on("dp.change", "#fromDateRoot", function (e) {
        $('#toDateRoot').data("DateTimePicker").minDate(e.date);
    });
    $(document).on("dp.change", "#toDateRoot", function (e) {
        $('#fromDateRoot').data("DateTimePicker").maxDate(e.date);
    });
    $(document).on('click', '.XX01', function () {
        $('#peopleBox').empty()
        $('#uploadEmployee').val("");
        $('#peopleBox').append('<div class="no-file-text"><b>- 選擇1位人員 -</b></div>')
    })
    $(document).on('change', '#projectBudgetUpload', function () {
        var data = new FormData();
        data.append(0, $(this)[0].files[0])
        $.ajax({
            async: false,
            type: 'POST',
            data: data,
            dataType: 'json',
            contentType: false,
            processData: false,
            url: '/Project/AmortizationUpload/',
            success: function (data) {
                console.log(data)
                dataCompare(data)
            },
            error: function (data) {
                data
            }
        })
        $(this).val("");
    })
})
function dataCompare(data) {
    if (data.TransResult) {
        $('#newUploadData tbody').empty()
        _uploadData = data;
        $.each(data.TransData, function (index, item) {
            $('#newUploadData tbody').append("<tr><td>" + item.ExpNum + "</td><td>" + item.ExpDetailNum + "</td><td>" + item.ProjectCode + "</td><td>" + item.ProjectName + "</td><td>" + item.ProjectItemName + "</td><td>" + item.CostAndProfitCenter + " " + item.CostAndProfitCenterName + "</td><td>" + accounting.format(item.AmortizationTWD) + "</td></tr>")
        })
        $('#oldUploadData tbody').empty()
        $.each(data.OldData, function (index, item) {
            $('#oldUploadData tbody').append("<tr><td>" + item.ExpNum + "</td><td>" + item.ExpDetailNum + "</td><td>" + item.ProjectCode + "</td><td>" + item.ProjectName + "</td><td>" + item.ProjectItemName + "</td><td>" + item.CostAndProfitCenter + " " + item.CostAndProfitCenterName + "</td><td>" + accounting.format(item.AmortizationTWD) + "</td></tr>")
        })
        $('[data-remodal-id=compareConfirm-modal]').remodal().open();
    } else {
        alertopen(data.ErrorMsg);
    }
}

function dataConfirm() {
    if (_uploadData) {
        _uploadData.TransBase.UploadEmployee = _loginMbr.EmpID;
        _uploadData.TransBase.UploadEmployeeName = _loginMbr.EmpName;
        $.ajax({
            cache: false,
            type: 'POST',
            data: _uploadData,
            dataType: 'text',
            url: '/Project/InsertProjectAmortizationUploadRecord/',
            success: function (data) {
                alertopen("分攤資料上載成功")
            },
            error: function (data) {
            }
        })
    }
}

function getUploadRecordList() {
    var expNum = $('#ExpNum').val()
    var uploadEmployee = $('#uploadEmployee').val()
    var fromDate = $('#fromDate').val()
    var toDate = $('#toDate').val()
    $('#detailResult').hide(2000)
    $('#SearchResultArea').hide(2000)
    $.ajax({
        cache: false,
        type: 'GET',
        dataType: 'text',
        url: '/Project/GetAmortizationUploadRecordList?expNum=' + expNum + '&uploadEmployee=' + uploadEmployee + '&startDate=' + fromDate + '&endDate=' + toDate,
        success: function (data) {
            data = JSON.parse(data)
            if (data.IsSuccess) {
                $('#searchResultZone').empty()
                $.each(data.Detail, function (idx, item) {
                    $('#searchResultZone').append(
                        '<tr>\
                        <td>' + item.UploadNumber + '</td>\
                        <td>' + item.ExpNum + '</td>\
                        <td>' + accounting.format(item.ExpAmount) + '</td>\
                        <td>' + item.UploadDate.split('T')[0] + '</td>\
                        <td>' + item.ExpApplicantName + '(' + item.ExpApplicant + ')' + '</td><td><div class="icon-edit-bt-s" onclick="getUploadDetail(\'' + item.ExpNum + '\',\'' + item.UploadNumber + '\')"><b class="glyphicon glyphicon-eye-open"></b><span class="p-left2">查看</span></div></td>\
                        </tr>'
                    );
                })
                if (data.Detail.length < 1) {
                    $('#searchResultZone').append('<tr><td colspan="6"><span class="undone-text">查詢無相關資料。</span></td></tr>')
                }
                $('#SearchResultArea').show(200)
            } else {
                alertopen(data.Detail.Message);
            }
        },
        error: function (data) {
        }
    })
}
function getUploadDetail(e, u) {
    $.ajax({
        cache: false,
        type: 'GET',
        dataType: 'text',
        url: '/Project/GetProjectAmortizationUploadRecord?expNum=' + e + '&record=' + u,
        success: function (data) {
            data = JSON.parse(data);
            if (data.IsSuccess) {
                $('#TitleOfUploadNumber').text(data.Detail.UploadNumber)
                $('#UploadEmployeeDisable').text(data.Detail.UploadEmployeeName + "(" + data.Detail.UploadEmployee + ")")
                $('#UploadDateDisable').text(data.Detail.UploadDate.split('T')[0]);
                $('#ExpNumDisable').text(data.Detail.ExpNum);
                $('#ExpApplicantDisable').text(data.Detail.ExpApplicantName + "(" + data.Detail.ExpApplicant + ")")
                $('#ExpAmountDisable').text(accounting.format(data.Detail.ExpAmount));
                $('#ExpDescDisable').text(data.Detail.ExpDesc);

                $('#uploadDetail').empty()
                $.each(data.Detail.Detail, function (idx, item) {
                    $('#uploadDetail').append(
                        '<tr>\
                        <td>'+ item.ExpDetailNum + '</td>\
                        <td>'+ item.ProjectCode + '</td>\
                        <td>'+ item.Project + '</td>\
                        <td>'+ item.ProjectItemName + '</td>\
                        <td>' + item.CostAndProfitCenter + ' ' + item.CostAndProfitCenterName + '</td>\
                        <td>' + accounting.format(item.Amount) + '</td>\
                        </tr>'
                        )
                });
                $('#detailResult').show(200)
            }
            else {
                alertopen("無法取得此筆明細資料。")
            }
        },
        error: function (data) {
        }
    })
}

function QueryTemp(datas) {
    console.log(datas)
    $('#peopleBox').empty();
    $('#uploadEmployee').val("");
    if (datas) {
        $('#peopleBox').append('<div class="Links"><div class="Links-peo"><span>' + datas[0].user_name + '(' + datas[0].user_id + ')</span><div class="XX01"><i class="glyphicon glyphicon-remove orgpick-remove"></i></div><input hidden="" name="sendOther-name" value="方OO"><input hidden="" name="sendOther-id" value="00329"></div></div>')
        $('#uploadEmployee').val(datas[0].user_id);
    }
    else {
        $('#peopleBox').append('<div class="no-file-text"><b>- 選擇1位人員 -</b></div>')
    }

}