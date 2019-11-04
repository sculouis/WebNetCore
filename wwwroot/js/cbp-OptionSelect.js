var _optionCurrentData;
var _optionDataTarget;
var _optionPickerCode;
var _optionOutput = {
    key: "",
    value: "",
};
var _optionList = []

$(function () {
    $(document).on('click', '.openSearchBox', function () {
        OptionSelectOpen($(this).attr('id'), $(this).attr('id'), $(this).parents('td'));
    });

    $(document).on('change', 'input[name="remodalOption"]', function () {
        $('#remodal-tempSelected').empty();
        $('#remodal-tempSelected').append('\
        <div class="Links">\
            <div class="Links-n">\
                <span class="file-text">'+ $(this).parent('div').text() + '</span>\
                <div class="XX01" onclick="OptionRemove()"><i class="glyphicon glyphicon-remove"></i></div>\
            </div>\
        </div>')
    })
    $(document).on('click', '#modal-search-icon', OptionSearching)
    $('#modal-search-condition').keyup(function (event) {
        if (event.keyCode === 13) {
            OptionSearching()
        }
    });
    $(document).on('click', '#optionConfirm', OptionResultOutput)
    $(document).on('click', '#optionCancel', function () {
        $('#remodal-tempSelected').empty();
        $('#remodal-tempSelected').append('<div class="no-file-text" style="text-align:center"><b>-尚無項目-</b></div>')
        $('#modal-search-condition').val('')
    })
})
//展開選擇的Remodal(選取下拉項目,輸出欄位前綴詞,輸出欄位根結點 )
function OptionSelectOpen(pickerCate, outputPrefixCode, outputTarget) {
    if (pickerCate == undefined || outputTarget == undefined || outputPrefixCode == undefined) {
        return;
    }
    console.log(pickerCate);
    OptionLoading(_optionList.find(function (element) { return element.key == pickerCate }).value, outputPrefixCode, outputTarget);
    $('[data-remodal-id=modal-search-option]').remodal().open();
}
///讀取選項清單
function OptionLoading(data, pickerCode, target) {
    if ($('[data-remodal-id=modal-search-option]') < 1 || data == undefined) {
        return;
    }
    if (data.length < 1) {
        return;
    }
    _optionCurrentData = data;
    _optionPickerCode = pickerCode;
    _optionDataTarget = target;

    OptionDetailAppend(_optionCurrentData);
}
///依條件搜尋
function OptionSearching() {
    var condition = $('#modal-search-condition').val();
    if (condition == "") {
        OptionDetailAppend(_optionCurrentData);
        return;
    }
    var searchResult = _optionCurrentData.filter(function (x) {
        return x.key.includes(condition) || x.value.includes(condition)
    })

    OptionDetailAppend(searchResult);
}

function OptionDetailAppend(data) {
    $('#remodal-option-list').empty();
    var optionGroup = [];
    $.each(data, function (index, item) {
        $('#remodal-option-list').append('<li><label class="w100 label-box"><div class="w100 table-box"><input name="remodalOption" type="radio" value="' + item.key + '">' + item.key + ' - ' + item.value + '</div></label></li>');
    })
}
///清除選項
function OptionRemove() {
    $('#remodal-tempSelected').empty();
    $('#remodal-tempSelected').append('<div class="no-file-text" style="text-align:center"><b>-尚無項目-</b></div>')
    $('input[name="remodalOption"]:checked').attr('checked', false)
}
///選項輸出
function OptionResultOutput() {
    var resultObj = $('#remodal-tempSelected').find('.Links');
    if (resultObj.length < 1) {
        $(_optionDataTarget).find('#' + _optionPickerCode + 'Disable').text('').append('<span class="undone-text">點選按鈕新增</span>');
        $(_optionDataTarget).find('#' + _optionPickerCode + 'Name').val('');
        $(_optionDataTarget).find('#' + _optionPickerCode + 'Code').val('');
    } else {
        var result = $(resultObj).find('span').text();
        if (result.split(' - ').length < 2) {
            return;
        }
        $(_optionDataTarget).find('#' + _optionPickerCode + 'Disable').text(result);
        $(_optionDataTarget).find('#' + _optionPickerCode + 'Code').val(result.split(' - ')[0]);
        $(_optionDataTarget).find('#' + _optionPickerCode + 'Name').val(result.split(' - ')[1]);
        _optionOutput.key = result.split(' - ')[0];
        _optionOutput.value = result.split(' - ')[1]
    }
    $(_optionDataTarget).find('#' + _optionPickerCode + 'Code').trigger('change');
    $('#remodal-tempSelected').empty();
    $('#remodal-tempSelected').append('<div class="no-file-text" style="text-align:center"><b>-尚無項目-</b></div>')
    $('#modal-search-condition').val('')
}
function CodeGetOptionText(data, code) {
    try {
        var t = _optionList.find(function (element) {
            return element.key == data
        }).value.filter(function (x) {
            return x.key == code
        });
        if (t.length > 0) {
            return t[0].value;
        }
    } catch (e) {
        console.log('option error:  ' + data)
    }
}