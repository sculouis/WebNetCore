///==============================================================================================
// 表單動作 - 草稿/儲存/傳送至FIIS/驗證/共用儲存
//==============================================================================================
function draft() {
    ///<summary>暫存</summary>
    var deferred = $.Deferred();
    blockPageForJBPMSend()
    $.when(ajaxSave()).always(function () {
        deferred.resolve();
    });
    return deferred.promise();
}

function Save() {
    ///<summary>傳送前的表單儲存</summary>
    var deferred = $.Deferred();

    //考慮到第一關尚未有UID就需存取請款彙總明細表的狀況，這邊塞入一個無意義值給JBPMUID，進行完StartProcess後再統一由共用區更新
    if ($('#P_JBPMUID').val() == "") {
        $('#P_JBPMUID').val("noMeaningTemp")
    }
    $.when(ajaxSave()).always(function () {
        $.when(
            CreditBudgetSave(_formInfo.formGuid)
                .done(function () {
                    deferred.resolve();
                })
                .fail(function () {
                    deferred.reject();
                })
            )
    });
    return deferred.promise();
}
function completedToFiis() {
    ///<summary>結案前傳入FIIS平台</summary>
    var form = document.getElementById("MainForm");
    var deferred = $.Deferred();
    $.when(
        $.ajax({
            cache: false,
            type: 'POST',
            dataType: 'json',
            data: $(form).serialize(),
            url: '/ESP/ImportToFiis/'
        }).done(function (data, textStatus, jqXHR) {
            if (data.returnStatus != "S") {
                _formInfo.flag = false;
                alertopen("傳入FIIS失敗");
                initialControl();
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            _formInfo.flag = false;
            alertopen("傳入FIIS失敗");
            initialControl();
        })
    ).always(deferred.resolve())

    return deferred.promise();
}
function Verify() {
    ///<summary>驗證</summary>
    var deferred = $.Deferred();

    var url = location.pathname;
    var verifyResult = false;

    AccountUnFormat();
    if (!url.toLocaleLowerCase().includes("create") && !url.toLocaleLowerCase().includes("edit")) {
        enableAllField();
    }
    var form = document.getElementById("MainForm");
    $.ajax({
        cache: false,
        type: 'POST',
        dataType: 'json',
        data: $(form).serialize(),
        url: '/ESP/Verify?currentStep=' + $('#P_CurrentStep').val()
    }).done(function (data, textStatus, jqXHR) {
        $('div.error-text').remove();
        if (data == true) {
            verifyResult = true;
        } else {
            $.each(data, function (index, item) {
                $('div#' + item.ErrKey).append('<div class="error-text"><span class="icon-error icon-error-size"></span>' + item.ErrValue + '</div>');
            })
            if ($("div#" + data[0].ErrKey).offset() != undefined) {
                $("html, body").animate({ scrollTop: $("div#" + data[0].ErrKey).offset().top - 50 }, 500);
                console.log(data)
                deferred.reject();
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        deferred.reject();
    }).always(function () {
        if (verifyResult) {
            deferred.resolve();
        }
        AccountFormat()
        if (!url.toLocaleLowerCase().includes("create") && !url.toLocaleLowerCase().includes("edit")) {
            initialControl();
        }
    })

    return deferred.promise();
}
function ajaxSave() {
    ///<summary>表單儲存Ajax</summary>

    //欄位全開
    AccountUnFormat();
    enableAllField();
    //列表顯示名稱塞入
    $('#FormTypeName').val("會計處專用(" + $('select#ExpenseKindSelect option:selected').text() + ")");
    $('#ApplyItem').val($('select#ExpenseKindSelect option:selected').text() + "-" + $('#VendorNameInput').val());

    var form = document.getElementById("MainForm");
    return $.ajax({
        cache: false,
        type: 'POST',
        dataType: 'json',
        data: $(form).serialize(),
        url: '/ESP/Save/'
    }).done(function (data, textStatus, jqXHR) {
        _formInfo = {
            formGuid: data.FormGuid,
            formNum: data.FormNum,
            flag: data.Flag
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        initialControl();
    })
}