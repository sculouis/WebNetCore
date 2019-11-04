var _sendSectionTemplate = '<div class="section-edit section-area" id="SendSection">\<div class="section-title"><div class="point">●</div><span>傳送設定</span></div>\<div class="box"><div class="row"></div></div>\</div>';
var dateTime = new Date();
var RootUnit = null;
var stepSeq;
var _sendSettingDeferred = $.Deferred();
//取得下一關人員回傳值
var _responseGetNextApprover;
//取得下一關人員所有回傳值(包含傳送, 傳送其他主管同仁, 加會)
var _responseGetNextApproverList = [];
//取得退回人員回傳值
var _responseGetBackApprover;
//取得下一關加會人員回傳值
var _responseGetNextApproverCounterSigned;
//人員組織資料
let _unitData = new Array();
//指定的退回關卡
var _stageDesignate = 0;
//Save物件
var _formInfo = {
    formGuid: "00000000-0000-0000-0000-000000000000",
    formNum: "",
    flag: true,
    source: "draft"
}

//表單按鈕
var _clickButtonType = 1

//傳送物件
var _stageInfo =
{
    FormNum: _formInfo.formNum,
    Description: $('#remodalSendDescription').val(),
    CustomFlowKey: $('#P_CustomFlowKey').val(),
    NextCustomFlowKey: $('#P_CustomFlowKey').val(),
    AllowAgent: $('#P_AllowAgent').val(),
    CurrentEno: $('#LoginEno').val(),
    CurrentName: $('#LoginName').val(),
    TaskOwnerEno: "",
    TaskOwnerName: "",
    CurrentStep: 1,
    CounterSignList: [],
    NextStep: 2,
    ClickButtomType: _clickButtonType,
    SendType: "people",
    AutoStart: "N",
    ExpireTime: 3,
    JBPMUid: $('#P_JBPMUID').val(),
    ApplicantEmpNum: $('input[name="ApplicantEmpNum"]').val(),
    ApplicantEmpName: $('input[name="ApplicantName"]').val(),
    CreateTime: "2018-03-21", //未設
    FormKind: $('#FormKind').val(),
    FillInEmpNum: "",
    FillInEmpName: "",
    FormId: _formInfo.formGuid,
    TaskId: 0,
    ApplyItem: '',
    FormTypeName: '',
    SignedTitle: ''
}

//取得下一關人員入參
var _requestGetNextApprover =
{
    StepFrom: $('#P_CurrentStep').val(),
    CustomFlowKey: $('#P_CustomFlowKey').val(),
    AdditionStage: 1,
    ExecutorUnitCode: "2531", //尚未用到
    SendCase: 1,
    SignID: !isNullOrEmpty($('#P_JBPMUID').val()) ? $('#P_SignID').val() : "", //可從頁面取值,得判斷有無UID(草稿有SIGNID但無UID)
    LoginENO: $('#LoginEno').val()
}

//取得下一關加會人員入參
var _requestGetNextApproverCounterSigned =
{
    TaskName: "countersign04",
    LoginEno: "00000",
    IsStay: false
}

$(function () {
    $(document).one('click', '#FormSubmit', formSubmit);

    //傳送區塊選擇控制
    $(document).on('change', '.SendType', function () {
        switch (this.value) {
            case '1':
                getSpecifiedResponseNextApprover(1).SignedType == 3 ? $('#orgTreeMember').next().show() : EnableDOMObject($('#sentdropbox'));
                $('#otherMember').next().hide();
                if ($('#counterSign').length > 0) {
                    DisableDOMObject($('#countersigndropbox'));
                }
                break;
            case '8':
                if ($('.SendType[value="1"]').length > 0) {
                    getSpecifiedResponseNextApprover(1).SignedType == 3 ? $('#orgTreeMember').next().hide() : DisableDOMObject($('#sentdropbox'));
                }
                $('#otherMember').next().show();
                if ($('#counterSign').length > 0) {
                    DisableDOMObject($('#countersigndropbox'));
                }
                break;
            case '9':
                if ($('.SendType[value="1"]').length > 0) {
                    getSpecifiedResponseNextApprover(1).SignedType == 3 ? $('#orgTreeMember').next().hide() : DisableDOMObject($('#sentdropbox'));
                }
                $('#otherMember').next().hide();
                EnableDOMObject($('#countersigndropbox'));
                break;
            case '6':
                $('#otherMember').next().hide();
                taskName == 'countersign01' ? $('#orgTreeMember').next().show() : EnableDOMObject($('#sentdropbox'));
                break;
            case '11':
                if ($('.SendType[value="6"]').length > 0) {
                    taskName == 'countersign01' ? $('#orgTreeMember').next().hide() : DisableDOMObject($('#sentdropbox'));
                }
                $('#otherMember').next().show();
                break;
        }
        $('#sentdropbox').selectpicker('refresh');
    });

    //移除選擇人員
    $(document).on('click', '.orgpick-remove', function () {
        var $LinkPeoArea = $(this).parents('.area-fix02-2');
        $(this).parents('.Links').remove();
        if ($LinkPeoArea.find('.Links').length == 0) {
            $LinkPeoArea.find('.no-file-text').attr('style', 'display:block;');
        }
    });

    //等待_FlowInformation.cshtml的script跑完
    $.when(_flowInformationDeferred).done(function () {
        var $_sendType = $('.sendOption');
        if ($_sendType.length > 0) {
            //組出傳送區塊
            $('div.section-info').after(_sendSectionTemplate);
            var tmpCSUnit = $('<div>').addClass('box').append('<div class="row">\
                                      <div class="col-sm-8 content-box">\
                                            <div class="title"><label><input type="radio" class="SendType" name="SendType" value="9" hidden>加會單位</label></div>\
                                                <div class="area-1">\
                                                    <div class="area-fix02-2" id="counterSignUnits">\
                                                      <div class="no-file-text">\
                                                           <b>- 請選擇單位 -</b>\
                                                      </div>\
                                                    </div>\
                                                <div class="area-btn-right-1"><a onclick=' + 'orgpickMultipleUnit({outputfunction:\"QueryTempForCounterSignUnits\",RootUnitSeq:\"0011\",HighestUnitLevel:3,LowestUnitLevel:4});' + ' class="btn-02-blue btn-left"><div class="icon-plus bt-icon-size"></div>選擇單位</a></div>\
                                            </div>\
                                      </div>\
                                </div>');
            //加會單位
            if ($('#P_Status').val() == '4' || $('#P_AuthAddCSUnit').val() != 'True') {
                $(tmpCSUnit).hide();
            }

            $('#SendSection').append(tmpCSUnit);

            $.when(renderBySendType($_sendType)).done(function () {
                //傳送區塊初始化
                initailize();
                //將第一個預設選取
                $('#SendSection .content-box')
                    .first()
                    .find('input:radio')
                    .prop('checked', true)
                    .trigger('change');
                blockPage('');
                _sendSettingDeferred.resolve().promise()
            });
        }
        else {
            blockPage('');
            _sendSettingDeferred.resolve().promise()
        }
    });
})
//按傳送按鈕

//檢核
var selectedVerify = {
    result: null,
    message: null
};
//=====================================================
//檢核是否有選取傳送人員(含傳送/傳送其他主管/加會) / 取得關卡資訊 / 設定關卡資訊
//=====================================================
function checkSelected() {
    var $radioSendType = $('#SendSection input[class="SendType"]:checked').val();
    var UnitsSelectedCount = $('#counterSignUnits').find('.Links').length;
    var counterSignBtn = $('#counterSign').length;

    if (_clickButtonType == 1) {
        if (counterSignBtn == 0) {
            checkSendSelected($radioSendType);
        } else {
            if (UnitsSelectedCount > 0) {
                selectedVerify.message = '請選擇「加會單位」';
                return;
            }
            else {
                checkSendSelected($radioSendType);
            }
        }
    }
    if (_clickButtonType == 8) {
        checkSendSelected($radioSendType);
    }
    if (_clickButtonType == 9) {
        if (UnitsSelectedCount < 1) {
            selectedVerify.message = '無加會單位，請選擇「下一關人員」';
            return;
        }
        selectedVerify.result = true;
    }
}

function checkSendSelected(radioSendType) {
    var anyoneSelected;

    if (radioSendType == 1 && getSpecifiedResponseNextApprover(1).SignedType != 3) {
        anyoneSelected = !isNullOrEmpty($('#sentdropbox').val()) ? true : false;
    }

    if (radioSendType == 1 && getSpecifiedResponseNextApprover(1).SignedType == 3) {
        anyoneSelected = !isNullOrEmpty($('#orgTreeMember').find('input[name="send-id"]').val()) ? true : false;
    }

    if (radioSendType == 8 || radioSendType == 11) {
        anyoneSelected = !isNullOrEmpty($('#otherMember').find('input[name="sendOther-id"]').val()) ? true : false;
    }

    if (radioSendType == 6 && (taskName == 'countersign01' || taskName == 'countersign02')) {
        anyoneSelected = !isNullOrEmpty($('#orgTreeMember').find('input[name="send-id"]').val()) ? true : false;
    }

    selectedVerify.result = anyoneSelected;
}

function resetSelectedVerify() {
    selectedVerify.result = false;
    selectedVerify.message = '未選擇傳送人員';
}

function get_StageInfo() {
    return _stageInfo;
}
function set_StageInfo(obj) {
    _stageInfo = obj;
}
function set_stageInfo_value(key, value) {
    if (_stageInfo.hasOwnProperty(key)) {
        _stageInfo[key] = value;
    }
}

//=====================================================
//Prepare StartProcess&checkIn() Common Parameters
//=====================================================
function prepareStageInfo() {
    var deferred = $.Deferred();
    var $radioSendType = $('#SendSection input[class="SendType"]:checked').val();
    set_stageInfo_value("ClickButtomType", _clickButtonType);
    set_stageInfo_value("CurrentStep", $('#P_CurrentStep').val());
    set_stageInfo_value("TaskId", $('#P_TaskId').val());
    set_stageInfo_value("JBPMUid", $('#P_JBPMUID').val());
    set_stageInfo_value("ApplyItem", $('#ApplyItem').val());
    set_stageInfo_value("FormTypeName", $('#FormTypeName').val());
    set_stageInfo_value("Description", $('<div />').text($('#remodalSendDescription').val()).html());

    getCounterSignList();
    set_stageInfo_value("CounterSignList", $('#P_CounterSignList').val().split(","));

    //取得按鈕動作對應的「下一關人員」資訊
    _responseGetNextApprover = getSpecifiedResponseNextApprover(parseInt($radioSendType));

    switch (_clickButtonType) {
        case 1:
        case 8:
            //傳送, 傳送其他主管同仁
            {
                set_stageInfo_value("NextStep", _responseGetNextApprover.StepSequence);
                set_stageInfo_value("ExpireTime", _responseGetNextApprover.OverdueDays);
                set_stageInfo_value("NextCustomFlowKey", _responseGetNextApprover.CustomFlowKey);
                set_stageInfo_value("SendType", _responseGetNextApprover.SignedType == 1 || _responseGetNextApprover.SignedType == 13 ? 'role' : 'people');
                set_stageInfo_value("SignedTitle", _responseGetNextApprover.SignedTitle)

                if ($radioSendType == 1) {
                    if (_responseGetNextApprover.SignedType == 3) {
                        set_stageInfo_value("FillInEmpName", $("#orgTreeMember").find('input[name="send-name"]').val());
                        set_stageInfo_value("FillInEmpNum", $('#orgTreeMember').find('input[name="send-id"]').val());
                    } else {
                        set_stageInfo_value("FillInEmpName", $("#sentdropbox").find(":selected").text().replace(/\d+/, "").replace(/\(.*\)/, ""));
                        set_stageInfo_value("FillInEmpNum", $('#sentdropbox').find(":selected").val());
                    }
                }
                else if ($radioSendType == 8) {
                    set_stageInfo_value("SendType", 'people');
                    set_stageInfo_value("FillInEmpName", $("#otherMember").find('input[name="sendOther-name"]').val());
                    set_stageInfo_value("FillInEmpNum", $('#otherMember').find('input[name="sendOther-id"]').val());
                }
                deferred.resolve();
            }
            break;
        case 4:
        case 7:
            //退回
            {
                set_stageInfo_value("NextStep", _responseGetBackApprover.StepSequence);
                set_stageInfo_value("ExpireTime", _responseGetBackApprover.OverdueDays);
                set_stageInfo_value("NextCustomFlowKey", _responseGetBackApprover.CustomFlowKey);
                set_stageInfo_value("SendType", _responseGetBackApprover.SignedType == 1 ? 'role' : 'people');
                set_stageInfo_value("FillInEmpName", _responseGetBackApprover.SignedName);
                set_stageInfo_value("FillInEmpNum", _responseGetBackApprover.SignedID);

                deferred.resolve();
            }
            break;
        case 6:
            ////加會關卡1,2傳送
            {
                set_stageInfo_value("FillInEmpName", $("#orgTreeMember").find('input[name="send-name"]').val());
                set_stageInfo_value("FillInEmpNum", $('#orgTreeMember').find('input[name="send-id"]').val());
                deferred.resolve();
            }
            break;
        case 9:
            //加會
            {
                set_stageInfo_value("NextStep", _responseGetNextApprover.StepSequence);
                set_stageInfo_value("ExpireTime", _responseGetNextApprover.OverdueDays);
                set_stageInfo_value("NextCustomFlowKey", _responseGetNextApprover.CustomFlowKey);
                set_stageInfo_value("SendType", _responseGetNextApprover.SignedType == 1 ? 'role' : 'people');
                if (_responseGetNextApprover.SignedType == 3) {
                    set_stageInfo_value("FillInEmpName", $("#orgTreeCounterSignExist").find('input[name="countersignexist-name"]').val());
                    set_stageInfo_value("FillInEmpNum", $('#orgTreeCounterSignExist').find('input[name="countersignexist-id"]').val());
                } else {
                    set_stageInfo_value("FillInEmpName", $("#countersigndropbox").find(":selected").text().replace(/\d+/, "").replace(/\(.*\)/, ""));
                    set_stageInfo_value("FillInEmpNum", $('#countersigndropbox').find(":selected").val());
                }
                deferred.resolve();
            }
            break;
        case 10:
            //加會關卡3傳送
            {
                deferred.resolve();
            }
            break;
        case 11:
            //加會關卡2傳送其他主管同仁
            {
                set_stageInfo_value("FillInEmpName", $("#otherMember").find('input[name="sendOther-name"]').val());
                set_stageInfo_value("FillInEmpNum", $('#otherMember').find('input[name="sendOther-id"]').val());
                deferred.resolve();
            }
            break;
        case 12:
            //加會關卡3中退回
            {
                set_stageInfo_value("FillInEmpName", _responseGetBackApprover.SignedName);
                set_stageInfo_value("FillInEmpNum", _responseGetBackApprover.SignedID);
                deferred.resolve();
            }
            break;
        case 87:
            //傳入FIIS
            {
                _requestGetNextApprover.SendCase = 1;
                _requestGetNextApprover.StepFrom = $('#P_CurrentStep').val();
                $.when(GetNextApprover(_requestGetNextApprover, 87))
                    .done(function (data) {
                        _responseGetNextApprover = data;
                    }).always(function () {
                        _responseGetNextApprover = getSpecifiedResponseNextApprover(87);
                        set_stageInfo_value("FillInEmpName", $('#FillInName').val());
                        set_stageInfo_value("FillInEmpNum", $('#FillInEmpNum').val());
                        set_stageInfo_value("NextStep", _responseGetNextApprover.StepSequence);
                        set_stageInfo_value("ExpireTime", _responseGetNextApprover.OverdueDays);
                        set_stageInfo_value("NextCustomFlowKey", _responseGetNextApprover.CustomFlowKey);
                        set_stageInfo_value("SendType", _responseGetNextApprover.SignedType == 1 ? 'role' : 'people');
                        deferred.resolve();
                    });
            }
            break
        default:
            //結案, 銷案
            deferred.resolve();
            break;
    }
    return deferred.promise();
}

//=====================================================
//取得加會單位清單
//=====================================================
function getCounterSignList() {
    var counterSignCount = $('#counterSignUnits').find('.Links');
    $('#P_CounterSignList').val("");
    if (counterSignCount.length > 0) {
        $.each(counterSignCount, function (index, item) {
            var itemVal = $(item).find('span').text();
            index == 0 ? $('#P_CounterSignList').val(itemVal) : $('#P_CounterSignList').val($('#P_CounterSignList').val() + "," + itemVal);
        });
    }
}

//依據頁面按鈕組出對應傳送畫面
function renderBySendType($_sendType) {
    var waiting = [];
    $.each($_sendType, function (index, item) {
        var def = $.Deferred();

        $selectedType = $(this).attr('id');
        var tmp;
        switch ($selectedType) {
            case 'Send':
                _requestGetNextApprover.SendCase = 1;
                $.when(GetNextApprover(_requestGetNextApprover, 1))
                    .done(function (data) {
                        _responseGetNextApprover = data;
                    }).always(function () {
                        AppendSend(_responseGetNextApprover);
                        def.resolve();
                    });
                break;
            case 'sendOthers':
                _requestGetNextApprover.SendCase = 3;
                $.when(GetNextApprover(_requestGetNextApprover, 8))
                    .done(function (data) {
                        tmp = data;
                    }).always(function () {
                        index == 0 ? _responseGetNextApprover = tmp : null;
                        AppendSendOthers(8, {
                            SignedID: [3, 7], SignedName: ["MBR", "OMG", "MGR"]
                        });
                        def.resolve();
                    });
                break;
            case 'counterSign':
                changeBlockText('正在查詢流程設定資訊...');
                if ($('#P_CurrentStep').val() != $('#P_CounterSignExist').val()) {
                    $.when(GetBackApprover($('#P_SignID').val(), $('#P_CounterSignExist').val(), false, 9))
                        .always(function (data) {
                            AppendCounterSignApprover(data);
                            def.resolve();
                        });
                }
                else {
                    $.when(GetNextApprover(_requestGetNextApprover, 9)).always(function (data) {
                        data.SignedID = [$('#LoginEno').val()];
                        data.SignedName = [$('#LoginName').val()];
                        data.SignedType = 2;
                        $.each(_responseGetNextApproverList, function (index, item) {
                            if (item.key == 9) {
                                item.value = data;
                            }
                        });
                        AppendCounterSignApprover(data);
                        def.resolve();
                    });
                }
                break;
            case 'countersignsend':
                _requestGetNextApproverCounterSigned.TaskName = taskName;
                _requestGetNextApproverCounterSigned.LoginEno = $('#LoginEmployee').val();
                _requestGetNextApproverCounterSigned.IsStay = 0;
                $.when(GetNextApproverCounterSigned(_requestGetNextApproverCounterSigned))
                    .always(function () {
                        AppendCounterSignSend(_responseGetNextApproverCounterSigned);
                        if (taskName == 'countersign01') {
                            AppendOrgPicker(6, {
                                SignedID: [2, 7], SignedName: ["MBR", "OMG", "MGR"]
                            });
                        }
                        if (taskName == 'countersign02') {
                            AppendOrgPicker(6, {
                                SignedID: [2, 5], SignedName: ["MGR"]
                            });
                        }
                        def.resolve();
                    });
                break;
            case 'countersignother':
                _requestGetNextApproverCounterSigned.TaskName = taskName;
                _requestGetNextApproverCounterSigned.LoginEno = $('#LoginEmployee').val();
                _requestGetNextApproverCounterSigned.IsStay = 1;
                AppendSendOthersRestrict(11, taskName, { SignedID: [], SignedName: [] });
                def.resolve();
                break;

            default:
                break;
        }
        waiting.push(def);
    });

    return $.when.apply(null, waiting).promise();
}

//=====================================================
// 表單傳送/執行起單或傳送
//=====================================================
function openModalSent(clickType) {
    if ($.isFunction(window.VerifyMsgBoard) && !VerifyMsgBoard()) {
        alert('意見溝通內容尚未送出!');
        scrollTo($('#SpeechSection'));
        blockPage('');
        return;
    }

    resetSelectedVerify();
    var $radioSendType = $('#SendSection input[class="SendType"]:checked').val();
    clickType = $radioSendType == '8' && clickType == 1 ? parseInt($radioSendType) : clickType;
    switch (clickType) {
        case 1:
            //傳送
            _clickButtonType = parseInt($radioSendType);
            blockPage('資料檢核中...');
            $.when(Verify()).done(function () {
                checkSelected();
                if (!selectedVerify.result) {
                    alert(selectedVerify.message);
                }
                else {
                    openSentBox('您的單據將進行傳送。');
                }
            }).fail(function () {
            }).always(function () {
                blockPage('');
            });
            break;
        case 8:
            //傳送其他主管同仁
            _clickButtonType = clickType;
            confirmopen('請問是否經檢核後再進行傳送？', sendOtherVerifyConfirm, sendOtherVerifyReject, "是", "否");
            break;
        case 2:
            //銷案
            _clickButtonType = clickType;
            openSentBox('您的單據將進行銷案。');
            break;
        case 3:
            //結案
            _clickButtonType = clickType;
            blockPage('資料檢核中...');
            $.when(Verify()).done(function () {
                openSentBox('您的單據將進行結案。');
            }).fail(function () {
            }).always(function () {
                blockPage('');
            });
            break;
        case 4:
            //退回
            _clickButtonType = clickType;
            changeBlockText('正在查詢流程設定資訊...');
            $.when(GetBackApprover($('#P_SignID').val(), _stageDesignate, false, 4)).always(function (data) {
                blockPage('');
                _responseGetBackApprover = data
                var previousEmp = '【' + _responseGetBackApprover.SignedTitle + '】'
                    + _responseGetBackApprover.SignedName
                    + '(' + _responseGetBackApprover.SignedID + ')';
                openSentBox('您的單據將退回給' + previousEmp + '。');
            });
            break;
        case 6:
        case 11:
            //加會關卡1,2, 加會關卡2傳送其他主管同仁
            _clickButtonType = parseInt($radioSendType);
            checkSendSelected($radioSendType);
            if (!selectedVerify.result) {
                alert(selectedVerify.message);
                return;
            }
            openSentBox('您的單據將進行傳送。');
            break;
        case 7:
            //退回填表人
            _clickButtonType = clickType;
            changeBlockText('正在查詢流程設定資訊...');
            $.when(GetBackApprover($('#P_SignID').val(), _stageDesignate, true, 7)).always(function (data) {
                blockPage('');
                _responseGetBackApprover = data
                var previousEmp = '【' + _responseGetBackApprover.SignedTitle + '】'
                    + _responseGetBackApprover.SignedName
                    + '(' + _responseGetBackApprover.SignedID + ')';
                openSentBox('您的單據將退回給' + previousEmp + '。');
            });
            break;
        case 9:
            //加會
            _clickButtonType = parseInt($radioSendType);
            blockPage('資料檢核中...');
            $.when(Verify()).done(function () {
                checkSelected();
                if (!selectedVerify.result) {
                    alert(selectedVerify.message);
                }
                else {
                    openSentBox('您的單據將進行加會。');
                }
            }).fail(function () {
            }).always(function () {
                blockPage('');
            });
            break;
        case 10:
            //加會結束
            _clickButtonType = parseInt(clickType);
            openSentBox('您的單據將結束加會。');
            break;
        case 12:
            //加會主管退回經辦
            _clickButtonType = clickType;
            changeBlockText('正在查詢流程設定資訊...');
            $.when(GetCounterSignBackApprover($('#P_JBPMUID').val(), $('#P_TaskId').val())).always(function (data) {
                blockPage('');
                _responseGetBackApprover = data
                var previousEmp = _responseGetBackApprover.SignedName + '(' + _responseGetBackApprover.SignedID + ')';
                openSentBox('您的單據將退回給' + previousEmp + '。');
            });
            break;
        case 87:
            //傳入FIIS
            _clickButtonType = clickType;
            blockPage('資料檢核中...');
            $.when(Verify()).done(function () {
                openSentBox('您的單據將傳入FIIS。');
            }).fail(function () {
            }).always(function () {
                blockPage('');
            });
            break;
    }
}
function sendOtherVerifyConfirm() {
    blockPage('資料檢核中...');
    $.when(Verify()).done(function () {
        checkSelected();
        if (!selectedVerify.result) {
            alert(selectedVerify.message);
        }
        else {
            setTimeout(function () {
                openSentBox('您的單據將進行傳送。');
            }, 50);
        }
    }).fail(function () {
    }).always(function () {
        blockPage('');
    });
}
function sendOtherVerifyReject() {
    checkSelected();
    if (!selectedVerify.result) {
        alert(selectedVerify.message);
    }
    else {
        setTimeout(function () {
            openSentBox('您的單據將進行傳送。');
        }, 50);
    }
}
function openSentBox(title) {
    $('#SendTitle').text(title);
    $('[data-remodal-id=modal-sent]').remodal().open();
}
function formSubmit() {
    $('#FormSubmit').unbind('click')
    blockPage('資料儲存中...');
    //各表單各自實作Save()，並將存檔結果存入變數_formInfo，請將目光移至檔案最下方
    $.when(Save()).always(function () {
        if ((_clickButtonType == 87 || _clickButtonType == 3) && typeof (completedToFiis) == "function") {
            $.when(completedToFiis()).always(function () {
                doCheckInOrStartProcess();
            });
        }
        else {
            doCheckInOrStartProcess();
        }
    });
}
function doCheckInOrStartProcess() {
    if (_formInfo.flag) {
        _formInfo.source = "send";
        $.when(saveFileInfo()).always(function () {
            set_stageInfo_value("FormNum", _formInfo.formNum);
            set_stageInfo_value("FormId", _formInfo.formGuid);
            var jbpmUid = $('#P_JBPMUID').val();
            if (jbpmUid == "" || jbpmUid == undefined || jbpmUid == "noMeaningTemp") {
                $('#P_JBPMUID').val("");
                startProcess();
            }
            else {
                if (_clickButtonType == 87) {
                    $.ajax({
                        cache: false,
                        type: 'GET',
                        dataType: 'json',
                        url: '/ENP/UpdateEXPFlowStatus?expId=' + _formInfo.formGuid + '&status=0'
                    }).always(function () {
                        checkIn();
                    });
                }
                else {
                    checkIn();
                }
            }
        });
    }
    else {
        blockPage('');
    }
}
//=====================================================
// 起單
//=====================================================
function startProcess() {
    $.when(prepareStageInfo()).always(function () {
        $('[data-remodal-id=modal-sent]').remodal().close();
        blockPageForJBPMSend();

        $.ajax({
            cache: false,
            type: 'POST',
            data: _stageInfo,
            dataType: 'text',
            url: '/Flow/StartProcess',
            traditional: true,
            success: function (data) {
                if (data == "Success") {
                    location.href = "/Flow/ResultPage/true/startprocess/" + _formInfo.formNum;
                }
            },
            error: function (data) {
                blockPage('');
                alert("傳送資料失敗");
                $('#FormSubmit').bind('click', formSubmit);
            }
        });
    });
}
//=====================================================
// 簽入
//=====================================================
function checkIn() {
    $.when(prepareStageInfo()).always(function () {
        blockPageForJBPMSend();

        $.ajax({
            cache: false,
            type: 'POST',
            data: _stageInfo,
            dataType: 'text',
            url: '/Flow/CheckIn',
            success: function (data) {
                if (data == "Success") {
                    switch (_stageInfo.ClickButtomType) {
                        case 1:
                            location.href = "/Flow/ResultPage/true/sendnext/" + $('#P_SignID').val();
                            break;
                        case 2:
                            location.href = "/Flow/ResultPage/true/cancel/" + $('#P_SignID').val();
                            break;
                        case 3:
                            location.href = "/Flow/ResultPage/true/complete/" + $('#P_SignID').val();
                            break;
                        case 4:
                            location.href = "/Flow/ResultPage/true/reject/" + $('#P_SignID').val();
                            break;
                        case 6:
                            location.href = "/Flow/ResultPage/true/countersignsend/" + $('#P_SignID').val();
                            break;
                        case 7:
                            location.href = "/Flow/ResultPage/true/reject/" + $('#P_SignID').val();
                            break;
                        case 8:
                            location.href = "/Flow/ResultPage/true/sendothers/" + $('#P_SignID').val();
                            break
                        case 9:
                            location.href = "/Flow/ResultPage/true/countersign/" + $('#P_SignID').val();
                            break;
                        case 10:
                            location.href = "/Flow/ResultPage/true/countersignend/" + $('#P_SignID').val();
                            break;
                        case 11:
                            location.href = "/Flow/ResultPage/true/countersignother/" + $('#P_SignID').val();
                            break;
                        case 12:
                            location.href = "/Flow/ResultPage/true/countersignreject/" + $('#P_SignID').val();
                            break;
                        case 87:
                            $.when(autoCheckOut()).done(function () {
                                location.href = "/Flow/ResultPage/true/importToFiis" + $('#P_SignID').val();
                            });
                        default:
                            location.href = "/Flow/ResultPage/true/sendnext/" + $('#P_SignID').val();
                            break;
                    }
                }
            },
            error: function (data) {
                blockPage('');
                alert("傳送資料失敗");
                $('#FormSubmit').bind('click', formSubmit);
            }
        });
    });
}
//=====================================================
// 草稿匯入
//=====================================================
function draftImportPortal() {
    set_stageInfo_value("FormNum", _formInfo.formNum);
    set_stageInfo_value("FormId", _formInfo.formGuid);

    return $.ajax({
        cache: false,
        type: 'POST',
        data: _stageInfo,
        dataType: 'text',
        url: '/Flow/DraftImport',
        traditional: true
    });
}

//=====================================================
// 組出傳送區塊畫面 A.下一關人員
//=====================================================
function AppendSend(responseGetNextApprover) {
    //先清空下一關人員區塊
    $(':radio.SendType[value="1"]').parents('.content-box').remove();
    $('#SendSection .row').eq(0).prepend('<div class="col-sm-4 content-box">\
                                            <div class="title"><label><input type="radio" class="SendType" name="SendType" value="1">下一關人員</label></div>\
                                       </div>');

    switch (responseGetNextApprover.SignedType) {
        case 3:
            AppendOrgPicker(1, responseGetNextApprover);
            break;
        case 5:     //這個是依表單欄位(人員專用)
        case 13:    //新增簽核類別：依表單欄位(角色專用)
            AppendPageCustomized(responseGetNextApprover, 1);
            break;
        default:
            AppendNextApproverList(responseGetNextApprover, 1);
            break;
    }
}

//=====================================================
// 組出傳送區塊畫面 B.傳送其他主管同仁(主流程使用)
//=====================================================
function AppendSendOthers(val, nextApprover) {
    let orgParam = ParseOrgPickerSettingParam(nextApprover);
    $('#SendSection .row').eq(0).append('<div class="col-sm-4 content-box">\
                                        <div class="title"><label><input type="radio" class="SendType" name="SendType" value="'+ val + '">傳送其他主管同仁</label></div>\
                                            <div class="area-1">\
                                                <div class="area-fix02-2" id="otherMember">\
                                                    <div class="no-file-text"><b>- 選擇1位人員 -</b></div>\
                                                </div>\
                                                <div class="area-btn-right-1" onclick="openOrgTree(' + val + ',' + JSON.stringify(orgParam).replace(/\"/g, "\'") + ');" style="display:none"><a class="btn-02-blue btn-left"><div class="icon-plus bt-icon-size"></div>選擇人員</a>\
                                                </div>\
                                        </div>\
                                   </div>');
}

//=====================================================
// 組出傳送區塊畫面 B.傳送其他主管同仁(加會子流程使用)
//=====================================================
function AppendSendOthersRestrict(val, taskName, nextApprover) {
    if (taskName == 'countersign02') {
        nextApprover.SignedID.push(2);
        nextApprover.SignedID.push(7);
        nextApprover.SignedName.push('MBR');
        nextApprover.SignedName.push('OMG');
        nextApprover.SignedName.push('MGR');
    }
    else if (taskName == 'countersign03') {
        nextApprover.SignedID.push(2);
        nextApprover.SignedID.push(5);
        nextApprover.SignedName.push('MGR');
    }

    let orgParam = ParseOrgPickerSettingParam(nextApprover);
    $('#SendSection .row').eq(0).append('<div class="col-sm-4 content-box">\
                                        <div class="title"><label><input type="radio" class="SendType" name="SendType" value="'+ val + '">傳送其他主管同仁</label></div>\
                                            <div class="area-1">\
                                                <div class="area-fix02-2" id="otherMember">\
                                                    <div class="no-file-text"><b>- 選擇1位人員 -</b></div>\
                                                </div>\
                                                <div class="area-btn-right-1" onclick="openOrgTree(' + val + ',' + JSON.stringify(orgParam).replace(/\"/g, "\'") + ');" style="display:none"><a class="btn-02-blue btn-left"><div class="icon-plus bt-icon-size"></div>選擇人員</a>\
                                                </div>\
                                        </div>\
                                   </div>');
}

//=====================================================
// 組出傳送區塊畫面 C.加會出口人員
//=====================================================
function AppendCounterSignApprover(responseGetBackApprover) {
    $('.counterSignExist').parents('.content-box').remove();
    $(':radio[value=9]').show();
    $(':radio[value=9]').parents('.row')
        .append('<div class="col-sm-4 content-box"><div class="title counterSignExist">加會出口人員</div></div>');

    $('#SendSection input[value="9"]')
.parents('.content-box')
.next()
.append('<select id="countersigndropbox" data-live-search="true" data-hide-disabled="true" data-size="5" tabindex="-98" class="selectpicker show-tick select-h38 form-control" title="請選擇">\</select></div>');

    if (responseGetBackApprover) {
        $('#countersigndropbox').append('<option value="' + responseGetBackApprover.SignedID[0] + '" selected>' + responseGetBackApprover.SignedName[0] + '(' + responseGetBackApprover.SignedID[0] + ')</option>');
    }

    $('#countersigndropbox').selectpicker('refresh');
    //switch (responseGetNextApprover.SignedType) {
    //    case 3:
    //        AppendOrgPickerCounterSignExist(responseGetNextApprover);
    //        break;
    //    case 5:     //這個是依表單欄位(人員專用)
    //    case 13:    //新增簽核類別：依表單欄位(角色專用)
    //        AppendPageCustomized(responseGetNextApprover, 9);
    //        break;
    //    default:
    //        AppendCounterSignExistApproverList(responseGetNextApprover);
    //        break;
    //}
};

//=====================================================
// 組出傳送區塊畫面 D.加會關卡中的下一關人員
//=====================================================
function AppendCounterSignSend(responseGetNextApproverCounterSigned) {
    $('#SendSection .row').eq(0).prepend('<div class="col-sm-4 content-box">\
                                            <div class="title"><label><input type="radio" class="SendType" name="SendType" value="6">下一關人員</label></div>\
                                       </div>');
}

//=====================================================
// 傳送區塊初始值 => 1. 如果有加會單位會帶出
//=====================================================
function initailize() {
    //1. 如果有加會單位會帶出
    var counterSign = $('#P_CounterSignList').val();
    var counterSignList = [];
    if (!isNullOrEmpty(counterSign)) {
        counterSignList = counterSign.split(",");
        $('#counterSignUnits .no-file-text').attr('style', 'display: none;');
        $.each(counterSignList, function (index, item) {
            var div = $('<div>').attr('class', 'Links-peo');
            div.append('<span>' + item + '</span>')
                .append('<div class="XX01"><i class="glyphicon glyphicon-remove orgpick-remove"></i></div>')
            $('#counterSignUnits').append($('<div>').attr('class', 'Links').append(div));
        });
    }
}

//=====================================================
// 取得退回關卡 FlowStage API
//=====================================================
function GetBackApprover(signID, stageDesignate, toApplicant, btnType) {
    var url = '/Flow/GetBackApprover';
    return $.ajax({
        type: 'GET',
        cache: false,
        url: url,
        data: {
            signID: signID, stageDesignate: stageDesignate, toApplicant: toApplicant
        },
        success: function (data) {
            var keyExist = false;
            $.each(_responseGetNextApproverList, function (index, item) {
                if (item.key == btnType) {
                    keyExist = true;
                    item.value = data;
                }
            })
            if (!keyExist) {
                _responseGetNextApproverList.push({
                    key: btnType,
                    value: data
                });
            }
        },
        error: function () {
            alert('取得下一關人員失敗');
        }
    });
}

//=====================================================
// 取得退回關卡 FlowStage API
//=====================================================
function GetCounterSignBackApprover(uid, task_id) {
    var url = '/Flow/GetCounterSignBackApprover';
    return $.ajax({
        type: 'GET',
        url: url,
        cache: false,
        data: {
            uid: uid, task_id: task_id
        },
        success: function (data) {
        },
        error: function () {
            alert('取得下一關人員失敗');
        }
    });
}

//=====================================================
// 取得下一關人員 FlowStage API
// 參數說明：1. _responseGetNextApproverList -> 存放所有回傳值(包括 1傳送, 8傳送其他主管同仁, 9加會)
//　 　　　　2. keyExist -> 判斷是否存在key(適用情況：當表單有跳關需求，需自行覆寫傳送下一關之回傳參數)
//=====================================================
function GetNextApprover(requestGetNextApprover, btnType) {
    var deferred = $.Deferred();
    var url = '/Flow/GetNextApprover';
    $.ajax({
        cache: false,
        type: 'POST',
        url: url,
        data: requestGetNextApprover,
        success: function (data) {
            var keyExist = false;
            $.each(_responseGetNextApproverList, function (index, item) {
                if (item.key == btnType) {
                    keyExist = true;
                    item.value = data;
                }
            });
            if (!keyExist) {
                _responseGetNextApproverList.push({
                    key: btnType,
                    value: data
                });
            }
            deferred.resolve(data);
        },
        error: function () {
            alert('取得下一關人員失敗');
            deferred.reject();
        }
    });
    return deferred.promise();
}

//=====================================================
// 進入加會流程
// 取得下一關加會人員FlowStage API
//=====================================================
function GetNextApproverCounterSigned(requestGetNextApproverCounterSigned) {
    return $.ajax({
        cache: false,
        type: 'POST',
        url: '/Flow/GetNextApproverCounterSigned',
        data: requestGetNextApproverCounterSigned,
        success: function (data) {
            _responseGetNextApproverCounterSigned = data;
        },
        error: function () {
            alert('取得下一關人員失敗');
        }
    });
}

//=====================================================
//列出下一關人員清單, 排除SignType非組織樹(SignedType != 3)
//=====================================================
function AppendNextApproverList(responseGetNextApprover, btnType) {
    $('#SendSection input[value="' + btnType + '"]').parents('.title').after('<select id="sentdropbox" data-live-search="true" data-hide-disabled="true" data-size="5" tabindex="-98" class="selectpicker show-tick select-h38 form-control" title="請選擇">\</select></div>');
    var SignedID = responseGetNextApprover.SignedID;
    var SignedName = responseGetNextApprover.SignedName;

    $.each(SignedID, function (index, item) {
        //如只有單選項，直接預設選取; 如多選項，下拉選取
        if (SignedID.length == 1) {
            $('#sentdropbox').append('<option value="' + SignedID[0] + '" selected>' + SignedName[0] + '(' + SignedID[0] + ')</option>');
        } else {
            $('#sentdropbox').append('<option value="' + SignedID[index] + '">' + SignedName[index] + '(' + SignedID[index] + ')</option>');
        }
    });
    $('#sentdropbox').selectpicker('refresh');
};

//=====================================================
//列出加會出口人員清單, 排除SignType非組織樹(SignedType != 3)
//=====================================================
function AppendCounterSignExistApproverList(responseGetNextApprover) {
    $('#SendSection input[value="9"]')
.parents('.content-box')
.next()
.append('<select id="countersigndropbox" data-live-search="true" data-hide-disabled="true" data-size="5" tabindex="-98" class="selectpicker show-tick select-h38 form-control" title="請選擇">\</select></div>');

    var SignedID = responseGetNextApprover.SignedID;
    var SignedName = responseGetNextApprover.SignedName;

    $.each(SignedID, function (index, item) {
        //如只有單選項，直接預設選取; 如多選項，下拉選取
        if (SignedID.length == 1) {
            $('#countersigndropbox').append('<option value="' + SignedID[0] + '" selected>' + SignedName[0] + '(' + SignedID[0] + ')</option>');
        } else {
            $('#countersigndropbox').append('<option value="' + SignedID[index] + '">' + SignedName[index] + '(' + SignedID[index] + ')</option>');
        }
    });
    $('#countersigndropbox').selectpicker('refresh');
};

//=====================================================
//列出下一關人員清單, 如SignType為「依表單欄位」(SignedType=5)
//=====================================================
function AppendPageCustomized(responseGetNextApprover, btnType) {
    // GetPageCustomizedList(stepSequence)
    // 表單各自實作，入參：本關卡數，請將目光移至檔案最下方
    // return值為_nextApproverList = { SignedID: ["13169", "17838"], SignedName: ["陳OO", "張OO"] }
    if ($.isFunction(window.GetPageCustomizedList)) {
        var _nextApproverList = GetPageCustomizedList(responseGetNextApprover.StepSequence, responseGetNextApprover.CustomFlowKey);
        responseGetNextApprover.SignedID = _nextApproverList.SignedID;
        responseGetNextApprover.SignedName = _nextApproverList.SignedName;

        if (btnType == 1) {
            AppendNextApproverList(responseGetNextApprover, 1)
        };
        if (btnType == 9) {
            AppendCounterSignExistApproverList(responseGetNextApprover)
        };
    } else {
        alert("下一關為依表單欄位取得人員，請實作！")
    }
};

//=====================================================
//組織樹
//目前適用：1.主流程SignType為「組織樹」(SignedType=3)
//        2.加會關卡1 & 2
//=====================================================
function AppendOrgPicker(val, nextApprover) {
    let orgParam = ParseOrgPickerSettingParam(nextApprover);

    $('#SendSection input[value="' + val + '"]')
        .parents('.title')
        .after('<div class="area-1">\
                      <div class="area-fix02-2" id="orgTreeMember">\
                           <div class="no-file-text"><b>- 選擇1位人員 -</b></div>\
                      </div>\
                      <div class="area-btn-right-1" onclick="openOrgTree(' + val + ',' + JSON.stringify(orgParam).replace(/\"/g, "\'") + ');" style="display:block">\
                          <a class="btn-02-blue btn-left">\<div class="icon-plus bt-icon-size"></div>選擇人員</a>\
                      </div>\
                </div>');
}

//=====================================================
//加會出口人員 SignType為「組織樹」
//=====================================================
//function AppendOrgPickerCounterSignExist(nextApprover) {
//    let orgParam = ParseOrgPickerSettingParam(nextApprover);
//    $('#SendSection input[value="9"]')
//        .parents('.content-box')
//        .next()
//        .append('<div class="area-1">\
//                      <div class="area-fix02-2" id="orgTreeCounterSignExist">\
//                           <div class="no-file-text"><b>- 選擇1位人員 -</b></div>\
//                      </div>\
//                      <div class="area-btn-right-1" onclick="openOrgTree(' + 9 + ',' + JSON.stringify(orgParam).replace(/\"/g, "\'") + ')" style="display:block">\
//                          <a class="btn-02-blue btn-left">\<div class="icon-plus bt-icon-size"></div>選擇人員</a>\
//                      </div>\
//                </div>');
//}

//=====================================================
//OrgPicker參數儲存在responseGetNextApprover的SignedID及SignedName，利用此function組合格式
//=====================================================
function ParseOrgPickerSettingParam(settingForOrgPicker) {
    let setting = {
    };
    setting.RootUnitSeq = GetMemberDefaultRootUnit();
    setting.HighestUnitLevel = Number(settingForOrgPicker.SignedID[0]);
    setting.LowestUnitLevel = Number(settingForOrgPicker.SignedID[1]);
    setting.allowRole = settingForOrgPicker.SignedName;

    return setting;
}

//=====================================================
//取得登入人員的預設主要單位
//_unitData陣列中，單位越小的在越前面
//unit_level = 7：科/組
//unit_level = 6：分行/中心
//unit_level = 5：部
//unit_level = 4：處
//unit_level = 3：總經理室
//利用迴圈排除掉7與5，即可得到預設單位
//=====================================================
function GetMemberDefaultRootUnit() {
    var unit;

    for (index = _unitData.length - 1; index >= 0 ; index--) {
        if (_unitData[index].unit_level != 8 && _unitData[index].unit_level != 7 && _unitData[index].unit_level != 5) {
            unit = _unitData[index].unit_id;
            break;
        }
    }

    return unit;
}

//=====================================================
//傳送其他主管同仁(同關卡)：選擇人員回傳資料
//=====================================================
function QueryTempForSendOther(datas) {
    $('#otherMember .no-file-text').attr('style', 'display: none;');
    $('#otherMember .Links').remove();
    var div = $('<div>').attr('class', 'Links-peo');
    div.append('<span>' + datas[0].user_name.replace(/\d+/, "").replace(/\s+/, "") + '(' + datas[0].user_id + ')</span>')
        .append('<div class="XX01"><i class="glyphicon glyphicon-remove orgpick-remove"></i></div>')
    .append('<input hidden name="sendOther-name" value="' + datas[0].user_name.replace(/\d+/, "").replace(/\s+/, "") + '" />')
.append('<input hidden name="sendOther-id" value="' + datas[0].user_id + '" />');
    $('#otherMember').append($('<div>').attr('class', 'Links').append(div));
}

//=====================================================
//傳送下一關人員組織樹：選擇人員回傳資料
//=====================================================
function QueryTempForSend(datas) {
    $('#orgTreeMember .no-file-text').attr('style', 'display: none;');
    $('#orgTreeMember .Links').remove();
    var div = $('<div>').attr('class', 'Links-peo');
    div.append('<span>' + datas[0].user_name.replace(/\d+/, "").replace(/\s+/, "") + '(' + datas[0].user_id + ')</span>')
.append('<div class="XX01"><i class="glyphicon glyphicon-remove orgpick-remove"></i></div>')
.append('<input hidden name="send-name" value="' + datas[0].user_name.replace(/\d+/, "").replace(/\s+/, "") + '" />')
.append('<input hidden name="send-id" value="' + datas[0].user_id + '" />');
    $('#orgTreeMember').append($('<div>').attr('class', 'Links').append(div));
}

//=====================================================
//傳送加會出口人員員組織樹：選擇人員回傳資料
//=====================================================
function QueryTempForCounterSignExist(datas) {
    $('#orgTreeCounterSignExist .no-file-text').attr('style', 'display: none;');
    $('#orgTreeCounterSignExist .Links').remove();
    var div = $('<div>').attr('class', 'Links-peo');
    div.append('<span>' + datas[0].user_name.replace(/\d+/, "").replace(/\s+/, "") + '(' + datas[0].user_id + ')</span>')
        .append('<div class="XX01"><i class="glyphicon glyphicon-remove orgpick-remove"></i></div>')
        .append('<input hidden name="countersignexist-name" value="' + datas[0].user_name.replace(/\d+/, "").replace(/\s+/, "") + '" />')
            .append('<input hidden name="countersignexist-id" value="' + datas[0].user_id + '" />');
    $('#orgTreeCounterSignExist').append($('<div>').attr('class', 'Links').append(div));
}

//=====================================================
//加會單位：選擇單位回傳資料(防止加入重複單位)
//=====================================================
function QueryTempForCounterSignUnits(datas) {
    $('#counterSignUnits .no-file-text').attr('style', 'display: none;');
    var unitText = $('#counterSignUnits').find('.Links').text();
    $.each(datas, function (index, item) {
        if (unitText.indexOf(item.unit_id) < 0) {
            var div = $('<div>').attr('class', 'Links-peo');
            div.append('<span>' + item.unit_name + '(' + item.unit_id + ')</span>')
                .append('<div class="XX01"><i class="glyphicon glyphicon-remove orgpick-remove"></i></div>')
            $('#counterSignUnits').append($('<div>').attr('class', 'Links').append(div));
        } else {
            alert("加會單位已包含" + item.unit_name + '(' + item.unit_id + ')');
        }
    });
}

//=====================================================
// 取得按扭動作對應之responseGetNextApprover
//=====================================================
function getSpecifiedResponseNextApprover(sendType) {
    var tmp;
    $.each(_responseGetNextApproverList, function (index, item) {
        if (item.key == sendType) {
            tmp = item.value;
        }
    })
    return tmp;
}

//=====================================================
//更新CustomFlowKey
//適用情況：提供給各表單切換流程使用
//=====================================================
function updateCustomFlowKey(CustomFlowKey) {
    $.each(_responseGetNextApproverList, function (index, item) {
        item.value.CustomFlowKey = CustomFlowKey;
    })
}

//=====================================================
//更新組織樹起始節點(包含：傳送、傳送其他主管同仁、加會出口人員、stage1傳送、stage2傳送其他主管同仁)
//=====================================================
function openOrgTree(btnType, orgSetting) {
    switch (btnType) {
        case 1:
        case 6:
            orgSetting.outputfunction = 'QueryTempForSend';
            break;
        case 9:
            orgSetting.outputfunction = 'QueryTempForCounterSignExist';
            break;
        case 8:
            //當按下「傳送其他主管同仁」時，OverrideOrgPickerSetting提供各表單重新覆寫OrgPicker設定，詳細說明請將目光移至檔案最下方
            if ($.isFunction(window.OverrideOrgPickerSetting)) {
                stepSeq = getSpecifiedResponseNextApprover(btnType).StepSequence;
                let overrideSetting = OverrideOrgPickerSetting(stepSeq);
                for (var key in overrideSetting) {
                    eval("orgSetting." + key + " = overrideSetting." + key);
                }
            }
        case 11:
            orgSetting.outputfunction = 'QueryTempForSendOther';
            break;
    }
    orgpickUser(orgSetting);
}
function autoCheckOut() {
    var deferred = $.Deferred();
    $.ajax({
        cache: false,
        type: 'GET',
        dataType: 'json',
        async: false,
        url: '/Flow/CheckOutAuth/' + $('#LoginEno').val() + '/' + $('#P_JBPMUID').val()
    }).done(function (data, jqXHR, textStatus) {
        set_stageInfo_value("FormNum", $('#P_SignID').val());
        set_stageInfo_value("TaskId", data.TaskId);
        set_stageInfo_value("JBPMUid", $('#P_JBPMUID').val());
        set_stageInfo_value("CurrentEno", $('#LoginEno').val());
    }).fail(function (jqXHR, textStatus, errorThrown) { })
    .always(function () {
        $.when(
            $.ajax({
                cache: false,
                type: 'POST',
                data: _stageInfo,
                dataType: 'json',
                url: '/Flow/CheckOut',
                traditional: true
            })
        ).done(function (data, jqXHR, textStatus) {
            console.log("success chcekout")
            deferred.resolve();
        });
    })
    return deferred.promise();
}

//=====================================================
//各表單需實做function
//=====================================================
//1. Verify() => 檢核表單邏輯
//2. Save() => 儲存表單，結束後需將表單的GUID和FormNum傳回並存入變數_formInfo
//   $.ajax(.....,
//              success : function(data){
//                 _formInfo.formGuid = data.FormGuid;  //表單GUID
//                 _formInfo.formNum = data.FormNum;    //表單代號
//                 _formInfo.flag = data.Flag;          //存檔成功/失敗
//          }
//3. GetPageCustomizedList(stepSequence, customFlowKey) => 如「關卡類別」為依表單欄位，各表單需實作取得下一關人員清單，並照以下範例return
//   function GetPageCustomizedList(stepSequence, customFlowKey) {
//        Tip1: 入參stepSequence為下一關卡， 提供給各表單應用於區分同個流程中不同關卡「依表單欄位」取值
//        Tip2: 入參customflowkey為下一關卡的流程代號，提供給各表單進行實作
//        return { SignedID: ["13169", "17838"], SignedName: ["測試A", "測試B"] };
//   }
//4. OverrideOrgPickerSetting(stepSeq) => 更新「傳送其他主管同仁」的組織樹相關設定，並照已下範例return
//   funtion OverrideOrgPickerSetting(stepSequence){
//        Tip1: 入參stepSequence 提供給各表單應用於區分同個流程中不同關卡「組織樹」根結點
//        Tip2: 如表單有切流程需求，請再自行多判斷customflowkey
//        Tip3: 以下參數不需要全部都傳，可視需求只放部分參數
//        return { allowRole:["OMG","MBR"], LowestUnitLevel:7, RootUnitSeq:"0011;0532", HighestUnitLevel:4};
//   }