//=====================================================
// 訊息視窗
// 輸入參數text若是array則會多筆顯示
//=====================================================
function alertRemainBudget(text) {
    $('#confirmText').empty();
    if (typeof (text) != typeof ([])) {
        var textSpan = "<span class='popup-text-left'>" + text + "</span>"
        $('[data-remodal-id=confirm-modal]').find('#confirmText').append(textSpan);
        $('[data-remodal-id=confirm-modal]').remodal().open();
    }
    else {
        var textContent = ""
        if (text.length < 1) {
            return;
        } else {
            $.each(text, function (index, value) {
                textContent += "<span class='popup-text-left'>" + value + "</span>"
            });
        }
        $('[data-remodal-id=confirm-modal]').find('#confirmText').append(textContent);
        $('[data-remodal-id=confirm-modal]').remodal().open();
    }
}


//=====================================================
//信用卡預算控管API
//=====================================================
function CreditBudgetSave(FormID) {
    var deferred = $.Deferred();
    //呼叫信用卡預算API，按下的按鈕是1傳送或2銷案才需呼叫
    if (_clickButtonType === 1 || _clickButtonType === 2) {
        var data = {
            FormID: FormID
        }
        var _url = '/PO/CreditBudget';
        if (_clickButtonType === 1) {
            data.Action = 1
        } else if (_clickButtonType === 2) {
            data.Action = 3
        }
        $.ajax({
            url: _url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function (data) {
                if (!data.Status) {
                    if (data.RemainBudget === undefined) {
                        //若無剩餘預算金額欄位，表示是其他錯誤則Show回傳的錯誤訊息
                        alertRemainBudget(data.Message)
                    } else {
                        alertRemainBudget('超過可用預算，剩餘預算金額:' + data.RemainBudget)
                    }
                    deferred.reject(data);
                }
                deferred.resolve(data)
            },
            error: function (data) {
                data.Status = false
                data.Message = data.statusText
                //若無剩餘預算金額欄位，表示是其他錯誤則Show回傳的錯誤訊息
                alertRemainBudget(data.Message)
                deferred.reject(data);
            }
        });
    } else {
        var data = { Status: true, Message: "無需寫入" }
        deferred.resolve(data)
    }

    return deferred.promise();
}

//=====================================================
//信用卡預算控管API-作廢:輸入表單guid及送貨層編號
//=====================================================
function CreditBudgetVoided(FormID, DeliveryNo) {
    var data = {
        FormID: FormID
        , Action: 2
    , DeliveryNo: DeliveryNo
    }
    var _url = '/PO/CreditBudget';
    $.ajax({
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: data,
        success: function (data) {
            if (!data.Status) {
                alertRemainBudget(data.Message)
            }
        },
        error: function (data) {
            alertRemainBudget(data.Message)
        }
    });
}




