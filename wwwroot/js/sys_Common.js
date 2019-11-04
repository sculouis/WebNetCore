$.fn.serializeObject = function () {
    var o = {
    };
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//等待頁面可輸入等待訊息
function blockReportPage(UImessage) {
    if (UImessage == "") {
        _blockstatus = false;
        $.unblockUI();
    } else {
        _blockstatus = true
        $.blockUI({ message: UImessage });
    }
}


//ajax GET從Server取得資料
function GetData(id, serverUrl, callBack) {
    var deferred = $.Deferred();
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: serverUrl,
        success: function (data) {
            blockReportPage('')
            //console.log(data)
            callBack(id, data)
            deferred.resolve();
        },
        error: function (data) {
            console.log("錯誤")
            deferred.reject();
        }
    });
    return deferred.promise();  
}

//ajax POST從Server取得資料
function UpdateData(id, serverUrl, updatedata, callBack) {
    var deferred = $.Deferred();
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: serverUrl,
        data: updatedata,
        success: function (data) {
            //console.log(data)
            callBack(id, data)
            deferred.resolve();
        },
        error: function (data) {
            console.log("錯誤")
            deferred.reject();
        }
    });
   return deferred.promise();
}

function alertOpen(text) {
    $('#alertOK').unbind();
    if (typeof (text) != typeof ([])) {
        $('#alertText').text(text);
        $('[data-remodal-id=alert-modal]').remodal().open();
    }
    else {
        if (_alerttext.length < 1) {
            return;
        }
        $('#alertText').text(_alerttext[0]);
        if (_alerttext.length > 0) {
            _alerttext = _alerttext.slice(1, _alerttext.length);
        }
        $('[data-remodal-id=alert-modal]').remodal().open();
        $('#alertOK').on('click', alertopen);
    }
}
