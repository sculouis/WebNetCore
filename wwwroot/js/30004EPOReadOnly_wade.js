function Verify() {
    let draftAjax = $.Deferred()

    draftAjax.resolve();

    return draftAjax.promise();
}

function Save() {
    _formInfo = {
        formGuid: __FormGuid,
        formNum: __FormNum,
        flag: true
    }

    let draftAjax = $.Deferred()
    // draftAjax.resolve();
    //呼叫信用卡預算控管API
    $.when(CreditBudgetSave(__FormGuid)).always(function (data) {
        if (data.Status) {
            draftAjax.resolve();
        } else {
            _formInfo.flag = false
            draftAjax.reject();
        }
    }
    )
    return draftAjax.promise();
}

function completedToFiis() {
    let draftAjax = $.Deferred()

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: "/EPO/completedToFiis?id=" + __FormNum + "&FillInEmpNum=" + $("#FillInEmpNum").val(),
        success: function (data) {
            if (data.returnStatus != "S") {
                _formInfo.flag = false

                draftAjax.reject(data.returnMessage);
                // alert("傳送結案資料發生錯誤");
                alert("【傳送結案資料發生錯誤】" + data.returnMessage);
            }
            else {
                draftAjax.resolve();
            }

            console.log(data)
        },
        error: function () {
            draftAjax.reject("傳送結案資料發生錯誤");
            alert("傳送結案資料發生錯誤");
        }
    }
    ).always(function () {
        $("input[Amount]").each(function () {
            $(this).val(fun_accountingformatNumberdelzero($(this).val()))
        })
    })

    return draftAjax.promise()
}

$(function () {
    $("[Amount]").each(function () {
        $(this).text(fun_accountingformatNumberdelzero($(this).text()))
    })

    $(document).on('click', '#ExpandAllEPODetail', function () {
        if ($(this).find('.list-open-icon').length > 0) {
            //SwitchHideDisplay([], [$('.EPODetail')]);
            $('.EPODetail').show()
            $('.AmoDetail').show()
            $(this).closest('table').find(".EPODetailSerno").find(".glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up")
            $(this).closest('table').find(".ExpandInnerDetail a span").text("收合")
        } else {
            //SwitchHideDisplay([$('.EPODetail')], []);
            $('.EPODetail').hide()
            $('.AmoDetail').hide()
            $(this).closest('table').find(".EPODetailSerno").find(".glyphicon-chevron-up").removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
            $(this).closest('table').find(".ExpandInnerDetail a span").text("展開")
        }
        $(this).find('.toggleArrow').toggleClass('list-close-icon list-open-icon')
    });

    $('[name="ExpandEPODetail"]').on('click', function () {
        let tbody = $(this).closest('tbody');
        if ($(this).find(".glyphicon-chevron-down").length > 0) {
            $(tbody).children('tr').not(':first').not().show()

            $(this).find(".glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up")
        }
        else {
            $(tbody).children('tr').not(':first').hide()

            $(this).find(".glyphicon-chevron-up").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down")
        }
    });

    //分攤明細的展開及收合
    $(document).on('click', '.ExpandInnerDetail', function () {
        if ($(this).find('span').text() == '展開') {
            $(this).parents('.AmoDetail').next().show(200);
            $(this).find('span').text('收合');
        }
        else if ($(this).find('span').text() == '收合') {
            $(this).parents('.AmoDetail').next().hide(200);
            $(this).find('span').text('展開');
        }
        //$(this).find('span').toggleText('展開', '收合');
    });

    //分攤明細層全展開與收合
    $(document).on('click', '#EPOAmoIN [name=ExpandAllEPOAmoINDetail]', function () {
        if ($(this).find('.list-open-icon').length > 0) {
            $(this).closest("table").find("tbody").each(function () {
                $(this).find('.glyphicon-chevron-down').removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up")
                $(this).find("tr").not(":first").show()
            })
            $(this).find('.list-open-icon').removeClass('list-open-icon').addClass('list-close-icon')
        } else {
            $(this).closest("table").find("tbody").each(function () {
                $(this).find('.glyphicon-chevron-up').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down")
                $(this).find("tr").not(":first").hide()
            })
            $(this).find('.list-close-icon').removeClass('list-close-icon').addClass('list-open-icon')
        }
    });

    //分攤明細展開收合
    $(document).on('click', '#EPOAmoIN [name="EPOAmoINDetail"]', function () {
        let tbody = $(this).closest('tbody');
        if ($(this).find(".glyphicon-chevron-down").length > 0) {
            $(tbody).find('tr').not(':first').show()

            $(this).find(".glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up")
        }
        else {
            $(tbody).find('tr').not(':first').hide()

            $(this).find(".glyphicon-chevron-up").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down")
        }
    });

    //所得稅欄位抓值
    $("#IncomeTaxTable").find("[GetFiisData]").each(function () {
        if ($(this).text().trim().length > 0) {
            obj = $(this);

            //沿用EMP FUN

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: "/EMP/GetTaxSelectedText",
                async: false,
                data: { sourceKeyId: __FormNum, type: $(this).attr("GetFiisData"), Code: $(this).text().trim() },
                success: function (data) {
                    if (data) {
                        $(obj).append("-" + data)
                    }
                    else {
                        alert("取得FIIS資料失敗")
                    }
                },
                error: function (data) {
                    alert("讀取FIIS資料失敗")
                }
            });
        }
    })
    //所得稅欄位抓值

    if ($("#P_CurrentStep").val() >= 3) {
        $("#accounting-stage-field").show()
    }
})