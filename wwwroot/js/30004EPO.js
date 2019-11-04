//廠商請款請購主檔json全域變數
var EPO;
var data = [];

//等待頁面可輸入等待訊息
function blockPage(UImessage) {
    if (UImessage == "") {
        _blockstatus = false;
        $.unblockUI();
    } else {
        _blockstatus = true
        $.blockUI({ message: UImessage });
    }
}

//陣列remove的定義
Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

//==========================================
// 預計付款日期
//==========================================
function GetEstimatePayDate(selector) {
        var Today = new Date();
        if (Today.getDate() >= 1 && Today.getDate() <= 6) {
            selector.text(Today.getFullYear() + '年' + (Today.getMonth() + 1) + '月' + '14日');
        } else if (Today.getDate() >= 7 && Today.getDate() <= 20) {
            selector.text(Today.getFullYear() + '年' + (Today.getMonth() + 1) + '月' + '28日');
        } else {
            selector.text(Today.getFullYear() + '年' + (Today.getMonth() + 2) + '月' + '14日');
        }
}

//==========================================
// 開啟請款明細內容頁展開
//==========================================
$(document).on('click', '#ExpandEPODetail', function () {
    //if ($(this).find('.glyphicon-chevron-down').length > 0) {
    //    SwitchHideDisplay([], [$(this).parents('tbody').find('.EPODetail')]);
    //} else {
    //    SwitchHideDisplay([$(this).parents('tbody').find('.EPODetail')], []);
    //}
    //取得相關tr的同級元素
    var trChevron = $(this).parents('tr').siblings();
    if ($(this).find('.glyphicon-chevron-down').length > 0) {
        trChevron.each(function () { $(this).show() });
        $(this).parents('tr').nextAll('.AmoDetail').first().find('span').html('收合')
            //trChevron.find('span').text('收合');
        }
        else if ($(this).find('div.glyphicon-chevron-up').length > 0) {
            trChevron.each(function () { $(this).hide() });
            $(this).parents('tr').nextAll('.AmoDetail').first().find('span').html('展開')
            //trChevron.hide();
            //$(this).find('span').text('展開');
        }
        //向上或向下的箭頭切換
        $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up')
});

//當請款明細展開時，分攤明細跟著展開
//$(document).on('click', '.ExpandEPODetail', function () {
//    var trChevron = $(this).parents('tr').siblings();
//    if ($(this).find('div.glyphicon-chevron-down').length > 0) {
//        trChevron.show();
//        trChevron.find('.ExpandInnerDetail').parents('tr').nextAll().show();
//        trChevron.find('.ExpandInnerDetail').parents('tr').next().hide();
//        trChevron.find('span').text('收合');
//    }
//    else if ($(this).find('div.glyphicon-chevron-up').length > 0) {
//        trChevron.hide();
//        $(this).find('span').text('展開');
//    }
//    $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
//});


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


//table的所有row展開
//const RowsExapndAll = () => {
$(document).on('click', '#ExpandAllEPODetail', function () {
    if ($(this).find('.list-open-icon').length > 0) {
        //SwitchHideDisplay([], [$('.EPODetail')]);
        $('.EPODetail').show()
        $('.AmoDetail').show()
        $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up')
    } else {
        //SwitchHideDisplay([$('.EPODetail')], []);
        $('.EPODetail').hide()
        $('.AmoDetail').hide()
        $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
    }
    $(this).find('.toggleArrow').toggleClass('list-close-icon list-open-icon')
});

//==============================
//切換隱藏/顯示DOM元件
//==============================
function SwitchHideDisplay(hideObj, displayObj) {
    if (hideObj != null) {
        $.each(hideObj, function (index, item) {
            if ($(item)[0].tagName === 'SELECT') {
                $(item).parents('div.bootstrap-select').hide();
                return;
            }
            $(item).hide();
        });
    }
    if (displayObj != null) {
        $.each(displayObj, function (index, item) {
            if ($(item)[0].tagName === 'SELECT') {
                $(item).parents('div.bootstrap-select').show();
                return;
            }
            $(item).show();
        });
    }
}

//==========================================
// 分攤明細層-動態效果建立/展開收合/新增/刪除
//==========================================
$(document).on('click', '#AmortizationDetailCreate', function () {
    if ($('#PleaseType option:selected').val() == '') {
        alertopen("請先選擇請款類別");
        return;
    }
    if ($('#ENPDetailCreate').length > 0) {
        alertopen('請先完成請款明細之填寫');
        return;
    }
    CreateAmortizationDetail();
});
$(document).on('click', '#ExpandAmortizationDetail', function () {
    if ($(this).find('.glyphicon-chevron-down').length > 0) {
        SwitchHideDisplay([], [$(this).parents('tbody').find('.AmortizationDetail')]);
    } else {
        SwitchHideDisplay([$(this).parents('tbody').find('.AmortizationDetail')], []);
    }
    $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up')
});
$(document).on('click', '#ExpandAllAmortizationDetail', function () {
    if ($(this).find('.list-open-icon').length > 0) {
        SwitchHideDisplay([], [$('.AmortizationDetail')]);
        $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up')
    } else {
        SwitchHideDisplay([$('.AmortizationDetail')], []);
        $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
    }
    $(this).find('.toggleArrow').toggleClass('list-open-icon list-close-icon')
});

//新增分攤明細
$(document).on('click', '#AppendAmortizationDetail', function () {
    AmortizationDetailAppend();
});

//刪除分攤明細
$(document).on('click', '.icon-cross', function () {
var check = confirm('請確認是否刪除？');
if (check == true) {
    var tr = $(this).closest('tr');
    tr.remove();
    //重新計算項次編號
    $('#AmortizationDetailTableTemplate > tbody').find('tr').find('td:first').each(function (index) {
        $(this).text(index);
        });
    }
});


//==============================================================================================
// 分攤明細層 - 建立/新增(有無資料)/下拉設定/重新計算分攤金額(分攤比率[M]/分攤金額)
//==============================================================================================
function CreateAmortizationDetail() {
    let template = $('#AmortizationDetailTableTemplate').clone().attr('id', 'AmortizationDetailTable');
    $(template).find('#AmortizationDetailCloneTemplate').attr('id', 'AmortizationDetail_0');
    $('#AmortizationDetailRoot').append($(template).show())

    $.each($(template).find('tbody'), function (index, item) {
        $(item).remove();
    })

    AmortizationDetailAppend();
    recalculateAmortizationRatio();
    $('#AmortizationDetailCreate').remove();
    $('#amoritizationDetail-undone-vendorSelect').hide();
}
function AmortizationDetailAppend() {
    let count = $('#AmortizationDetailTableTemplate tbody').length;
    //$('#amoTbody').clone('id', 'amoTbody_' + count).appendTo($('#AmortizationDetailTableTemplate'))
    var $amo = $('#amoTbody');    // Create your clone

    // Get the number at the end of the ID, increment it, and replace the old id
    var $newAmo = $amo.clone().prop('id', 'amoTbody' + count).show();
    //$newAmo.find('.selectpicker').selectpicker();

    //增加新分攤明細tbody
    $newAmo.appendTo($('#AmortizationDetailTableTemplate'))

    //重新計算項次編號
    $('#AmortizationDetailTableTemplate > tbody').find('tr').find('td:first').each(function (index) {
        $(this).text(index);
    })
}

//寫log在console
function conLog(msg)
{
    console.log(msg)
}


//事件結果
function eventHandler(e) {
    function commaFormat(value) { // 加上千分位符號
        return value.toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
            return pre + groupOf3Digital.replace(/\d{3}/g, ',$&');
        })
    }
    switch (e.target.type) {
        case "checkbox":
            //EPO[e.target.id] = e.target.checked
            conLog(e.target.id + "-" + e.target.checked)
            //請款明細selected的處理
            if (e.target.id.indexOf('PO') !== -1) {
                if (e.target.checked === true) {
                    if (data.indexOf(e.target.id) === -1){
                        data.push(e.target.id)
                    }
                } else {
                    data.remove(e.target.id)
                }
            }
            break
        case "text":
            //EPO[e.target.id] = e.target.value
            //$("#" + e.target.id).val(commaFormat(e.target.value))  千分位設定
            conLog(e.target.id + "-" + e.target.value)
            break
        case "number":
            //$("#" + e.target.id).val(commaFormat(e.target.value)) 
            conLog(e.target.id + "-" + e.target.value)
            break
        default:
            //EPO[e.target.id] = e.target.value
            conLog(e.target.id + "-" + e.target.value)
            break
    }
    if (e.target.id === "VoucherBeau") {
        console.log("憑證開立對象事件")
        let voucher = $(this).find('option:selected')
        $('#Books').text(voucher.text());
    }

    if (e.target.id === "Currency") {
        if (e.target.value === "TWD") {
            console.log("判斷如果是台幣，則匯率是1")
            $('#Rate').val(1)
        }
    }

    if (e.target.id === "Deduction") {
        //先remove錯誤訊息
        $("#CertificateKind").next(".error-text").remove()
        if (e.target.checked === true && $("#CertificateKind").val() === "I") {
            console.log("判斷憑證類別等於發票且所扣是Y")
            //沒有錯誤訊息再新增
            if ($("#CertificateKind").next('.error-text').length < 1) {
                errMsg("CertificateKind", errObj["CertificateKind"])
            }
        }
    }

    //請款類別＝［退貨折讓］，則僅能選取折讓
    if (e.target.id === "CertificateKind" || e.target.id === "ExpenseKind") {
        //先remove錯誤訊息
        $("#CertificateKind").next(".error-text").remove()
        if ($("#CertificateKind").val() === "I" && $("#Deduction").prop("checked") === true && $("#ExpenseKind").val() === "PO_STD") {
            console.log("判斷憑證類別等於發票且所扣是Y")
            //沒有錯誤訊息再新增
            if ($("#CertificateKind").next('.error-text').length < 1) {
                errMsg("CertificateKind", errObj["CertificateKind"])
            }
        }

        if ($("#CertificateKind").val() !== "D" && $("#ExpenseKind").val() === "PO_CM_RETURN")
        {
            console.log("請款類別＝［退貨折讓］，則僅能選取折讓")
            if ($("#CertificateKind").next('.error-text').length < 1) {
                errMsg("CertificateKind", errObj["CertificateKind1"])
            }
        } else if ($("#CertificateKind").val() === "D" && $("#ExpenseKind").val() !== "PO_CM_RETURN") {
            console.log("請款類別＝［不是退貨折讓］，不能選取折讓")
            if ($("#CertificateKind").next('.error-text').length < 1) {
                errMsg("CertificateKind", errObj["CertificateKind2"])
            }
        }
    }
}

//設定事件
function SetEvents() {
    //供應商選擇帶入
    $(document).on('confirmation', '.remodal', function (e) {
        //移除錯誤訊息
        $("#VendorNameAndNum").next(".error-text").remove()

        console.log('confirmation');
    });

    //設定TextBox輸入事件
    $("input").on("blur", function (e) {
        //移除錯誤訊息
        var id = "#" + e.target.id
        $(id).next(".error-text").remove()

        eventHandler(e)
    })

    //設定TextBox輸入事件
    $("input").on("input", function (e) {
        //移除錯誤訊息
        var id = "#" + e.target.id
        $(id).next(".error-text").remove()

        eventHandler(e)
    })


    //設定TextArea輸入事件
    $("textarea").on("input", function (e) {
        //移除錯誤訊息
        var id = "#" + e.target.id
        $(id).next(".error-text").remove()

        eventHandler(e)
    })

    //設定Select Change的事件
    $("select").on("change", function (e) {
        //移除錯誤訊息
        var id = "#" + e.target.id
        $(id).next('.error-text').remove()
        eventHandler(e)
    })

    //設定CheckBox change的事件
    $("input:checkbox").on("change", function (e) {
        //移除錯誤訊息
        var id = "#" + e.target.id
        $(id).next().next(".error-text").remove()

        eventHandler(e)
    })
}

    //日曆控件的事件
    $(".datetimepicker1").on("dp.change", function (e) {
        //取得第一個子元件，是日曆控件的input
        //EPO[e.currentTarget.firstElementChild.id] = e.date.format("YYYY-MM-DD")
        //移除錯誤訊息
        var id = "#" + e.currentTarget.firstElementChild.id
        $(id).next(".error-text").remove()
        conLog(e.currentTarget.firstElementChild.id + "-" + e.date.format("YYYY-MM-DD"))
    })
 
    //載入請款明細 
    $("#LoadPODetail").on("click", function (e) {
        //        var fields = ["ExpenseKind","Currency","VendorNum","Rate"]
        //檢查載入請款明細區塊的必填欄位
        var fields = ["ExpenseKind", "Currency", "Rate", "VendorNum"]
        if (verifyFieldsInput(fields, $("#VendorBlock")) === true) {
            $.blockUI({ message: '資料讀取中...' })
            $("#EPODetailBlock").show(200)
            //取得請款明細
            var data = { vendorNo: "test" }
            var epoDetail = ajaxPartialView(url,data,function (content) {
                $("#EPODetail").html(content)
                //之後取得所以需再設定CheckBox change的事件
                $("input:checkbox").unbind("change");
                $("input:checkbox").on("change", function (e) {
                    //移除錯誤訊息
                    var id = "#" + e.target.id
                    $(id).next().next(".error-text").remove()
                    eventHandler(e)
                })
                //將上次的選擇結果移除
                data = [];
            })

            //取得已收貨未驗收
            var unAcc = ajaxPartialView(unAcceptanceUrl,data,function (content) {
                $("#EPOUnAcceptanceResult").html(content)
            })

            //取得未收貨
            var unRec = ajaxPartialView(unReceivingUrl,data,function (content) {
                $("#EPOUnReceivingResult").html(content)
            })

            //非同步都做完了才解除讀取中
            $.when(epoDetail, unAcc, unRec).done(function (xhrObject1, xhrObject2, xhrObject3) {
                $.unblockUI(); //解除讀取中狀態
            })
        }
    })

    //請款明細選擇結果 
    function SelectEPODetailResult() {
        $("#EPODetailBlock").hide(200)
        $("#PurposeBlock").show(100)
        $("#VoucherInfomationBlock").show(100)
        $("#PaymentInfomationBlock").show(100)
        //EPO.EPODetail = getEpoDetailModel()   //取得請款明細資料
        //取得請款明細
        //計算預計付款日
        GetEstimatePayDate($('#EstimatePayDate'))
        //承辦單位預計付款日 / 支票發票日
        GetEstimatePayDate($('#ExceptedPaymentDate'))

        //取得憑證開立對象
        var cerObject = $.ajax({
            type: 'GET',
            dataType: 'json',
            url: '/EPO/GetCertificateObject?EPONum=' + $('#P_SignID').val(),
            success: function (data) {
                $.each(data, function (key, txt) {
                    $('#VoucherBeau').append($("<option></option>").attr("value", txt.accountCode + txt.accountName).text(txt.businessEntity + " " + txt.bANNumber));
                })
                $('#VoucherBeau').selectpicker('refresh');
                $('#VoucherBeau option[value=' + FormData.VoucherBeau + ']').attr("selected", "selected");
                $('#VoucherBeau').selectpicker('refresh');
                _VoucherBeauCollection = data;
            },
            error: function (data) {
            }
        })

        var sendData = { FormID: $('#P_SignID').val(), PONums: data }
        //請款明細選擇結果
        var selectResult = $.ajax({
            url: epoDetailResultUrl,
            type: 'POST',
            data: sendData,
            success: function (content) {
                $("#EPODetailResultBlock").show()
                $("#EPODetailResult").html(content)
                $('.selectpicker').selectpicker()
                //將選擇結果的detail datamode放到EPO.EPODetail
                EPO.EPODetail = getDetailModel()
            },
            error: function (data) {
            }
        })

        //都做完了才解除讀取遮罩訊息
        $.when(cerObject, selectResult).done(function (xhrObject1, xhrObject2) {
            blockPage('')  //解除讀取中狀態
            //因為增加明細項，所以要重新bind Object
            //$('#MainForm').bindings('refresh')
        })


        //$("#EPODetailResult").load(epoDetailResultUrl, { FormID: $('#P_SignID').val(), PONums: data }, function (responseTxt, statusTxt, xhr) {
        //    if (statusTxt == "success") {
        //        //成功再Show這個區塊
        //        blockPage('')   //解除資料讀取中狀態
        //        $("#EPODetailResultBlock").show()
        //        $('.selectpicker').selectpicker()
        //    }
        //    if (statusTxt == "error")
        //        alert("Error: " + xhr.status + ": " + xhr.statusText);
        //})
    }

    $("#epoSelectedResult").on("click", function (e) {
        if ($(".EPODetailSerno input:checked").length > 0) {
            blockPage('資料讀取中...')
            SelectEPODetailResult()
        } else {
            alertopen("請至少選擇一筆請款明細")
        }
    })


    //草稿儲存
    function draft() {
        var form = document.getElementById("MainForm");
        form.action = "/EPO/Draft/";
        form.submit();
    }

    function Verify() {
        let verifyResult = true;
        return verifyResult;
    }

    function Save() {
        blockPage("傳送中....")
        var form = document.getElementById("MainForm");
        $.ajax({
            async: false,
            type: 'POST',
            dataType: 'json',
            data: $(form).serialize(),
            url: '/EPO/Save/',
            success: function (data) {
                _formInfo = {
                    formGuid: data.FormGuid,
                    formNum: data.FormNum,
                    flag: data.Flag
                }
                alert("儲存成功")
            },
            error: function (data) {
                alert("儲存失敗")
            }
        });
    }

    //requiredStart("ExpenseKind")
    //requiredStart("Rate")
    //requiredStart("VendorName")
    //errMsg("ExpenseKind","請款類別必輸")
    //errMsg("Rate", "匯率必輸")
    //errMsg("VendorName", "供應商必輸")
    //errMsg("HeaderDesc", "請款主旨必輸")
    //errMsg("EstimateVoucherDate", "憑證日期必輸")
    //errMsg1("DiscountReceive", "折讓收款必勾選")

    // A $( document ).ready() block.
    $(function () {
        //取得後端Model
        EPO = getModel();
        //控制項bind EPO Model Object
        //$('#MainForm').bindings('create')(EPO)
        //var bindings = $.bindings(EPO)
        //設定各事件
        SetEvents()

        //呈現存檔後Post 回來頁面需Show顯示供應商編號及姓名
        if  ($('#VendorNum').val() !== "") {
            $('#VendorNameAndNum').text($('#VendorName').val() + '(' + $('#VendorNum').val() + ')');
        }

        //供應商隱藏欄位的處理
        suppliesWriteToHiddenControl()

    });
