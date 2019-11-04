var _autoStart;

$(function () {
    _autoStart = getModel();
    checkIsActive();
    //啟用停用
    $('input:radio').change(function () {
        _autoStart.IsActive = $('input:radio:checked').val() == 'true';
        checkIsActive();
    });

    //週期
    $('select').change(function () {
        _autoStart.CycleDay = $(this).val();
        //重新計算預計執行日&實際執行日
        $.ajax({
            cache: false,
            url: '/EMP/GetNextAutoStartDate',
            type: 'POST',
            data: { day: _autoStart.CycleDay }
        }).done(function (data, textStatus, jqXHR) {
            $('#NextDate').text(data);
            _autoStart.NextDate = data;
            $.ajax({
                cache: false,
                url: '/EMP/GetValidateAutoStartDate',
                type: 'POST',
                data: { date: _autoStart.NextDate }
            }).done(function (data, textStatus, jqXHR) {
                $('#ValidateDate').text(data);
                _autoStart.ValidateDate = data;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                alertopen(errorThrown);
            });
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alertopen(errorThrown);
        });
    });

    //備註
    $('textarea').change(function () {
        _autoStart.Remark = $('<div>').text($(this).val()).html();
    });

    //更新
    $('#btnSave').click(function () {
        blockPage("正在更新設定...");
        $.ajax({
            cache: false,
            url: '/EMP/UpdateAutoStartSetting',
            dataType: 'json',
            type: 'POST',
            data: { setting: _autoStart },
            success: function (data, textStatus, jqXHR) {
                blockPage('');
                if (data) {
                    alertopen('更新成功');
                }
                else {
                    alertopen('更新失敗，請洽系統管理員');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                blockPage('');
                alertopen(errorMessage);
            }
        });
    });
});

function checkIsActive() {
    if (_autoStart.IsActive) {
        EnableDOMObject($('select'));
    }
    else {
        DisableDOMObject($('select'));
    }
}