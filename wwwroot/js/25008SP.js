//供應商
var supplier;
//證號別
var identity;
//代扣稅率代碼
var wtTax = [];
//代扣稅率百分比
var wtTaxRate;
//付款方式
var paymentMethod;
//國別
//var territory;
//付款群組
var payGroup;
//憑單方式
var wtTaxPrint;
//銀行
//var bank;
//template tbody
var tableAddressTemp = $($('#table-address-temp').html()).clone();
var tableContactTemp = $($('#table-contact-temp').html()).clone();
var tableBankAccountTemp = $($('#table-bank-account-temp').html()).clone();
//_tdTemp
var _tdTemp;

$(function () {
    //當表單用途為「修改」類別，必須顯示編輯前的舊資料

    //開啟「查閱前次紀錄」
    $("#open-recode-01").on("click", function () {
        $('#recode-box-01').show(20);
    });

    //關閉「查閱前次紀錄」
    $("#close-recode-01").on("click", function () {
        $('#recode-box-01').hide(20);
    });
});

$(function () {
    //刪除明細的隱藏XX顯示
    $(document).on(
        {
            mouseenter: function () { $(this).find('.DeleteThisDetail').show(); },
            mouseleave: function () { $(this).find('.DeleteThisDetail').hide(); }
        },
        "tbody"
    );

    //展開table單一列資料
    $(document).on('click', '.ExpandDetail', function () {
        var trChevron = $(this).parents('tr').siblings();
        if ($(this).find('div.glyphicon-chevron-down').length > 0) {
            trChevron.show();
        }
        else if ($(this).find('div.glyphicon-chevron-up').length > 0) {
            trChevron.hide();
        }
        $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    });

    //展開table全部列資料
    $('.ExpandAllDetail').click(function () {
        if ($(this).find('div.list-open-icon').length > 0) {
            $(this).parents('table').find('tbody .ExpandDetail').each(function (index, element) {
                if ($(element).find('div.glyphicon-chevron-down').length > 0) {
                    $(element).trigger('click');
                }
            });
        } else if ($(this).find('div.list-close-icon').length > 0) {
            $(this).parents('table').find('tbody .ExpandDetail').each(function (index, element) {
                if ($(element).find('div.glyphicon-chevron-up').length > 0) {
                    $(element).trigger('click');
                }
            });
        }

        $(this).find('.toggleArrow').toggleClass('list-open-icon list-close-icon');
    });

    //供應商企業社會責任自評表提供日變更時，需要立即計算供應商企業社會責任自評表到期日
    $('#selfAssessmentFrom').on('dp.change', function () {
        $('#selfAssessmentTo').removeClass('undone-text').text(addYear(new Date($(this).find('input').val())));
        supplier.SelfAssessmentformDate = $(this).find('input').val();
    });

    //人權及環境永續條款承諾書提供日變更時，需要立即計算人權及環境永續條款承諾書到期日
    $('#commitmentDocumentFrom').on('dp.change', function () {
        $('#commitmentDocumentTo').removeClass('undone-text').text(addYear(new Date($(this).find('input').val())));
        supplier.CommitmentDocDate = $(this).find('input').val();
    });

    //刪除明細
    $(document).on('click', '.DeleteThisDetail', function () {
        var tbody = $(this).parents('tbody');
        var table = $(this).parents('table');
        //供應商地址必須至少一筆
        if ($(table).attr('id') == 'table-address' && $(table).find('tbody:visible').length == 1) {
            alertopen('供應商地址明細必須至少一筆!');
            return;
        }
        //供應商聯絡人必須至少一筆
        if ($(table).attr('id') == 'table-contact' && $(table).find('tbody:visible').length == 1) {
            alertopen('供應商聯絡人明細必須至少一筆!');
            return;
        }
        if ($(table).find('tbody:visible').length == 1) {
            var parent = $(this).parents('.content-box');
            $(parent).find('.showAppendTable').show();
            $(parent).find('div.disable-text').show();
            $(parent).find('table').hide();
        }
        if ($(tbody).attr('detailID') != '0') {
            deleteDetailData($(table).attr('id'), $(table).find('tbody').index(tbody), false);
            $(tbody).find('.SerNum').removeClass('SerNum');
            $(tbody).hide();
        }
        else {
            deleteDetailData($(table).attr('id'), $(table).find('tbody').index(tbody), true);
            $(tbody).remove();
        }

        resetSerNum(table);
    });

    //按下【新增明細】以填寫XX明細資訊
    $('.showAppendTable').click(function () {
        var parent = $(this).parents('.content-box');
        $(this).hide();

        $(parent).find('div.disable-text').hide();
        var table = $(parent).find('table');
        $(table).show();
        $(table).find('.AppendDetail').trigger('click');
    });

    //新增明細
    $('.AppendDetail').click(function () {
        var table = $(this).parents('table');
        addDetailData($(table).attr('id'));
        var tbody = getCloneTbody($(table).attr('id'));

        switch ($(table).attr('id')) {
            case 'table-address':
                tbody = setAddressViewValue(tbody, supplier.SiteList[supplier.SiteList.length - 1]);
                break;
            case 'table-contact':
                tbody = setContactViewValue(tbody, supplier.ContactList[supplier.ContactList.length - 1]);
                break;
            case 'table-bank-account':
                tbody = setBankAccountViewValue(tbody, supplier.AccountList[supplier.AccountList.length - 1]);
                break;
        }

        $(tbody).find('select').selectpicker('refresh');
        $(table).append(tbody);
        //// test
        $(tbody).find('input').trigger('change');
        $(tbody).find('select').trigger('change');
        ////
        $(tbody).find('.ExpandDetail').trigger('click');
        resetSerNum(table);
    });

    //負債科目or預付科目搜尋條件change事件
    $('#combinationSearchtype').change(function () {
        $('div[data-remodal-id="combination-search-option"] .popup-box-area').hide();
        $('div[data-remodal-id="combination-search-option"] .popup-box-area#' + $(this).val()).show();
    });

    //負債科目or預付科目選項選擇後的change事件
    $(document).on('change', 'input.combinationOption:radio', function () {
        $('#remodal-select-result #' + $('#combinationSearchtype').val()).text($(this).val());
    });

    //取得後端Model
    supplier = getModel();

    //取得表單欄位控制設定
    getControlSetting();

    //取得證號別主檔
    getIdentity();

    //代扣稅率代碼主檔
    getWtTax();

    //代扣稅率百分比主檔
    getWtTaxRate();

    //付款方式主檔
    getPaymentMethod();

    //國別主檔
    getTerritory();

    //付款群組主檔
    getPayGroup();

    //憑單方式主檔
    getWtTaxPrint();

    //帳務行
    getDocumentaryEvidenceCompany();

    //會計項子目
    getCoaAccount();

    //成本與利潤中心
    getDepartmentList();

    //產品別
    getProduct();

    //郵遞區號
    getPostal();

    //設定表單欄位控制設定
    setControlSetting();

    //載入資料
    loadFormData();

    //載入FIIS資料
    loadFiisData();

    //預設開啟tr
    $('.ExpandAllDetail').trigger('click');
});

function OverrideOrgPickerSetting(step) {
    /// <summary>提供cbp-SendSetting.js針對「傳送其他主管同仁」按鈕做最後OrgPicker更改機會</summary>
    /// <param name="step" type="number">目前關卡數</param>

    switch (step) {
        case 2:
            switch (_currentSetting.FlowKey) {
                case 'SP_P1_07':
                case 'SP_P1_08':
                    return {
                        allowRole: ["JA08000635"]
                    };
                    break;
                case 'SP_P1_01':
                case 'SP_P1_02':
                case 'SP_P1_04':
                case 'SP_P1_09':
                case 'SP_P1_10':
                case 'SP_P1_11':
                case 'SP_P1_12':
                case 'SP_P1_14':
                case 'SP_P1_15':
                    return {
                        allowRole: ["JA18000078"]
                    };
                    break;
                case 'SP_P1_05':
                case 'SP_P1_06':
                case 'SP_P1_13':
                    return {
                        allowRole: ["JA18000073"]
                    };
                    break;
            }
            break;
        case 3:
            switch (_currentSetting.FlowKey) {
                case 'SP_P1_01':
                case 'SP_P1_11':
                case 'SP_P1_12':
                case 'SP_P1_15':
                    return {
                        allowRole: ["JA08000635"]
                    };
                    break;
                case 'SP_P1_08':
                case 'SP_P1_10':
                    return {
                        allowRole: ["JA18000073"]
                    };
                    break;
            }
            break;
        case 4:
            switch (_currentSetting.FlowKey) {
                case 'SP_P1_01':
                case 'SP_P1_12':
                case 'SP_P1_15':
                    return {
                        allowRole: ["JA18000073"]
                    };
                    break;
            }
            break;
    }
}

function getCloneTbody(id) {
    /// <summary>根據id取得tbody樣版</summary>
    /// <param name="id" type="String">table id</param>

    var tbody;
    switch (id) {
        case 'table-address':
            tbody = tableAddressTemp.clone();
            break;
        case 'table-contact':
            tbody = tableContactTemp.clone();
            break;
        case 'table-bank-account':
            tbody = tableBankAccountTemp.clone();
            break;
    }

    $(tbody).find('select').selectpicker('refresh');

    return tbody;
}

function getControlSetting() {
    ///<summary>根據流程代號 & 關卡數，取得表單欄位顯示設定</summary>

    //若當下頁面為ReadOnly、或表單狀態非暫存及非進行中，則當下關卡數為-1。其他條件則參考P_CurrentStep取得目前關卡數
    var currentStep = window.location.pathname.toLowerCase().includes('readonly') || ($('#P_Status').val() != '0' && $('#P_Status').val() != '1') ? -1 : Number($('#P_CurrentStep').val());

    //_controlSetting定義在25008SPControlSetting.js
    _currentSetting = _controlSetting.find(function (item, index, array) {
        return item.FlowKey == $('#P_CustomFlowKey').val() && item.CurrentStep == currentStep;
    });
}

function setControlSetting() {
    ///<summary>根據_currentSetting，設定表單各區塊顯示</summary>

    //主檔
    resetMainViewLayout();
    //地址明細
    resetAddressViewLayout();
    //聯絡人明細
    resetContactViewLayout();
    //銀行帳號明細
    resetBankAccountViewLayout();
    //根據_currentSetting去除不需要顯示的區域
    resetSectionBoxArea();
}

function resetSectionBoxArea() {
    ///<summary>根據_currentSetting去除不需要顯示的區域</summary>

    if (_currentSetting.Site.length == 0) {
        $('div[validationKey="SiteDetail"]').parent().hide();
    }
    if (_currentSetting.Contact.length == 0) {
        $('div[validationKey="ContactDetail"]').parent().hide();
    }
    if (_currentSetting.BankAccount.length == 0) {
        $('div[validationKey="BankAccountDetail"]').parent().hide();
    }
    if (_currentSetting.Site.length == 0 && _currentSetting.Contact.length == 0 && _currentSetting.BankAccount.length == 0) {
        $('#box-area-2').parent().hide();
    }
    else {
        $('#box-area-2').parent().find('.row:not(:first)').addClass('m-top10');
    }
}

function resetMainViewLayout() {
    ///<summary>根據_currentSetting.controlName去除不同的fieldStatus</summary>

    $.each(_currentSetting.Main, function (index, element) {
        $('[controlName="' + element.controlName + '"][fieldStatus!="' + element.fieldStatus + '"]').remove();
    });
}

function resetAddressViewLayout() {
    ///<summary>根據_currentSetting.controlName去除不同的fieldStatus</summary>

    $.each(_currentSetting.Site, function (index, element) {
        $(tableAddressTemp).find('[controlName="' + element.controlName + '"][fieldStatus!="' + element.fieldStatus + '"]').remove();
    });
}

function resetContactViewLayout() {
    ///<summary>根據_currentSetting.controlName去除不同的fieldStatus</summary>

    $.each(_currentSetting.Contact, function (index, element) {
        $(tableContactTemp).find('[controlName="' + element.controlName + '"][fieldStatus!="' + element.fieldStatus + '"]').remove();
    });
}

function resetBankAccountViewLayout() {
    ///<summary>根據_currentSetting.controlName去除不同的fieldStatus</summary>

    $.each(_currentSetting.BankAccount, function (index, element) {
        $(tableBankAccountTemp).find('[controlName="' + element.controlName + '"][fieldStatus!="' + element.fieldStatus + '"]').remove();
    });
}

function loadFormData() {
    ///<summary>載入Model資料至View</summary>

    //進入Create頁面並無此資料，將利用隱藏input取得申請人組織資料
    if (!supplier.ApplicantName) {
        supplier.ApplicantEmpNum = $('input[name="ApplicantEmpNum"]').val();
        supplier.ApplicantName = $('input[name="ApplicantName"]').val();
        supplier.ApplicantDepName = $('input[name="ApplicantDepName"]').val();
        supplier.ApplicantDepId = $('input[name="ApplicantDepId"]').val();
    }

    //設定主檔資料顯示
    setMainViewValue();

    //設定地址明細顯示資料
    if (supplier.SiteList.length > 0) {
        $.each(supplier.SiteList, function (index, element) {
            var tbody = setAddressViewValue(getCloneTbody('table-address'), element);
            $(tbody).find('select').selectpicker('refresh');
            $('#table-address').append(tbody);
            $(tbody).find('input').trigger('change');
            $(tbody).find('select').trigger('change');
        });
        //重設表格序號
        resetSerNum($('#table-address'));
    }

    //設定聯絡人明細顯示資料
    if (supplier.ContactList.length > 0) {
        $('#table-contact').show();
        $.each(supplier.ContactList, function (index, element) {
            $('#table-contact').append(setContactViewValue(getCloneTbody('table-contact'), element));
        });
        //重設表格序號
        resetSerNum($('#table-contact'));
    }

    //設定銀行帳號明細顯示資料
    if (supplier.AccountList.length > 0) {
        $('#table-bank-account').show();
        $.each(supplier.AccountList, function (index, element) {
            var tbody = setBankAccountViewValue(getCloneTbody('table-bank-account'), element);
            $(tbody).find('select').selectpicker('refresh');
            $('#table-bank-account').append(tbody);
        });
        //重設表格序號
        resetSerNum($('#table-bank-account'));
    }

    //設定ApplyItem
    $('#ApplyItem').val(getApplyItemPrefixText() + '-' + supplier.VendorName);
    //設定FormTypeName
    $('#FormTypeName').val(getFormTypeName());
}

function loadFiisData() {
    ///<summary>載入Model.fiisSupplier資料至View</summary>

    switch (supplier.Purpose) {
        case 1:
            //供應商主檔維護單
            //Razor無法處裡的通通丟這啦
            setFiisMainViewValue();
            break;
    }
}

function draft() {
    ///<summary>暫存</summary>

    blockPageForJBPMSend();
    var deferred = $.Deferred();
    $.when(saveAndReturn()).always(function () {
        deferred.resolve();
    });
    return deferred.promise();
}

function Save() {
    ///<summary>傳送前的表單資料儲存</summary>
    var deferred = $.Deferred();

    //如果按鈕屬於結案，需要傳送資料至FIIS
    if (_clickButtonType == 3) {
        changeBlockText('正在傳送資料至FIIS...');
        $.ajax({
            cache: false,
            url: '/SP/PostToFiis/',
            dataType: 'json',
            type: 'POST',
            data: {
                supplier: supplier
            }
        }).done(function (data, textStatus, jqXHR) {
            if (typeof data != 'string') {
                supplier = data;
                $.when(saveAndReturn()).always(function () {
                    deferred.resolve();
                });
            }
            else {
                $.when(saveAndReturn()).always(function () {
                    alertopen(data);
                    _formInfo.flag = false;
                    deferred.resolve();
                });
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alertopen(jqXHR.responseText);
            _formInfo.flag = false;
            deferred.resolve();
        });
    }
    else {
        $.when(saveAndReturn()).always(function () {
            deferred.resolve();
        });
    }

    return deferred.promise();
}

function saveAndReturn() {
    /// <summary>儲存表單資料</summary>

    //設定ApplyItem
    $('#ApplyItem').val(getApplyItemPrefixText() + '-' + supplier.VendorName);
    //設定FormTypeName
    $('#FormTypeName').val(getFormTypeName());

    var _url = supplier.SPNum ? '/SP/Edit' : '/SP/Create';
    return $.ajax({
        cache: false,
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: supplier,
        success: function (data, textStatus, jqXHR) {
            _formInfo.formGuid = data.FormGuid;
            _formInfo.formNum = data.FormNum;
            _formInfo.flag = data.Flag;
            if (!data.Flag) {
                blockPage('');
                alertopen('儲存表單失敗!');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            blockPage('');
            alert(jqXHR.responseText);
            _formInfo.flag = false;
        }
    });
}

function Verify() {
    /// <summary>檢核表單資料</summary>
    var deferred = $.Deferred();
    $('div.error-text').remove();

    $.ajax({
        url: '/SP/Verify',
        dataType: 'json',
        type: 'POST',
        data: {
            currentStep: _currentSetting.CurrentStep, supplier: supplier
        },
        success: function (data, textStatus, jqXHR) {
            if (data == true) {
                deferred.resolve();
            }
            else {
                var alertMsg = [];
                $.each(data, function (index, element) {
                    if (element.ErrKey != 'AlertBox') {
                        $('div[validationKey="' + element.ErrKey + '"]').append('<div class="error-text"><span class="icon-error icon-error-size"></span>' + element.ErrValue + '</div>');
                        if (index == 0) {
                            scrollTo($('div[validationKey="' + element.ErrKey + '"]'));
                        }
                    }
                    else {
                        alertMsg.push(element.ErrValue);
                    }
                });
                if (alertMsg.length > 0) {
                    alertopen(alertMsg);
                }
                deferred.reject();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            deferred.reject();
        }
    });

    return deferred.promise();
}

function deleteDetailData(id, index, isRealDelete) {
    /// <summary>刪除明細的json obj處理</summary>
    /// <param name="id" type="string">table id</param>
    /// <param name="index" type="number">table row index</param>
    /// <param name="isRealDelete" type="bool">True：直接自array移除，False：需將isDelete設為true</param>

    switch (id) {
        case 'table-address':
            removeAddressDetail(index, isRealDelete);
            break;
        case 'table-contact':
            removeContactDetail(index, isRealDelete);
            break;
        case 'table-bank-account':
            removeBankAccountDetail(index, isRealDelete);
            break;
    }
}

function removeAddressDetail(index, isRealDelete) {
    /// <summary>刪除明細的json obj處理</summary>
    /// <param name="index" type="number">table row index</param>
    /// <param name="isRealDelete" type="bool">True：直接自array移除，False：需將isDelete設為true</param>

    if (isRealDelete) {
        supplier.SiteList.splice(index, 1);
    }
    else {
        supplier.SiteList[index].IsDelete = true;
    }
}

function removeContactDetail(index, isRealDelete) {
    /// <summary>刪除明細的json obj處理</summary>
    /// <param name="index" type="number">table row index</param>
    /// <param name="isRealDelete" type="bool">True：直接自array移除，False：需將isDelete設為true</param>

    if (isRealDelete) {
        supplier.ContactList.splice(index, 1);
    }
    else {
        supplier.ContactList[index].IsDelete = true;
    }
}

function removeBankAccountDetail(index, isRealDelete) {
    /// <summary>刪除明細的json obj處理</summary>
    /// <param name="index" type="number">table row index</param>
    /// <param name="isRealDelete" type="bool">True：直接自array移除，False：需將isDelete設為true</param>

    if (isRealDelete) {
        supplier.AccountList.splice(index, 1);
    }
    else {
        supplier.AccountList[index].IsDelete = true;
    }
}

function setMainViewValue() {
    ///<summary>設定主檔資料顯示</summary>

    setDOMValue($('[controlName="VendorDescription"]'), '', supplier.VendorDescription);
    setDOMValue($('[controlName="VendorName"]'), '', supplier.VendorName);
    setDOMValue($('[controlName="VendorNameAlt"]'), '', supplier.VendorNameAlt);
    setDOMValue($('[controlName="ToCardDepartment"]'), '', supplier.ToCardDepartment);
    setDOMValue($('[controlName="VendorTypeLookupCode"]'), supplier.VendorTypeLookupCode, supplier.VendorTypeLookupName);
    setDOMValue($('[controlName="VatRegistrationNum"]'), '', supplier.VatRegistrationNum);
    setDOMValue($('[controlName="ParentCompanyName"]'), '', supplier.ParentCompanyName);
    setDOMValue($('[controlName="ParentCompanyVatNum"]'), '', supplier.ParentCompanyVatNum);
    supplier.SelfAssessmentformDate ? setDOMValue($('[controlName="SelfAssessmentformDate"]'), '', convertDateString(new Date(supplier.SelfAssessmentformDate))) : '';
    supplier.SelfAssessmentformDate ? setDOMValue($('[controlName="selfAssessmentTo"][fieldStatus="disable"]'), '', addYear(new Date(supplier.SelfAssessmentformDate))) : '';
    supplier.CommitmentDocDate ? setDOMValue($('[controlName="CommitmentDocDate"]'), '', convertDateString(new Date(supplier.CommitmentDocDate))) : '';
    supplier.CommitmentDocDate ? setDOMValue($('[controlName="commitmentDocumentTo"][fieldStatus="disable"]'), '', addYear(new Date(supplier.CommitmentDocDate))) : '';
}

function setFiisMainViewValue() {
    ///<summary>處理主檔舊資料UI呈現</summary>

    //Razor處理這段有點麻煩，丟在這邊
    supplier.FiisSupplier.toCardDepartment == 'Y' ? $('.old_ToCardDepartment[value="true"]').prop('checked', true) : (supplier.FiisSupplier.toCardDepartment == 'N' ? $('.old_ToCardDepartment[value="false"]').prop('checked', true) : '');
    if (supplier.FiisSupplier.toCardDepartment == null) {
        $('.old_ToCardDepartment').parents('label').addClass('bg-change');
    }
    else if (supplier.ToCardDepartment != (supplier.FiisSupplier.toCardDepartment == 'Y' ? true : false)) {
        $('.old_ToCardDepartment[value="' + !supplier.ToCardDepartment + '"]').parents('label').addClass('bg-change');
    }
}

function setAddressViewValue(tbodyDOM, element) {
    ///<summary>利用object資料丟入setDOMValue function自動判定顯示方式</summary>
    /// <param name="tbodyDOM" type="DOM">table DOM</param>
    /// <param name="element" type="json obj">明細的json obj</param>

    setDOMValue($(tbodyDOM).find('[controlName="ActiveFlag"]'), '', element.ActiveFlag);
    setDOMValue($(tbodyDOM).find('[controlName="VendorSiteCode"]'), '', element.VendorSiteCode);
    setDOMValue($(tbodyDOM).find('[controlName="SitePurpose"]'), element.SitePurpose, element.SitePurpose);
    setDOMValue($(tbodyDOM).find('[controlName="PhoneNumber"]'), '', element.PhoneNumber);
    setDOMValue($(tbodyDOM).find('[controlName="FaxNumber"]'), '', element.FaxNumber);
    setDOMValue($(tbodyDOM).find('[controlName="PostalCode1"]'), element.PostalCode1, element.PostalCode1 ? element.PostalCode1 + ' ' + element.City1 : '');
    setDOMValue($(tbodyDOM).find('[controlName="Address1"]'), '', element.Address1);
    setDOMValue($(tbodyDOM).find('[controlName="PostCode2"]'), element.PostCode2, element.PostCode2 ? element.PostCode2 + ' ' + element.City2 : '');
    setDOMValue($(tbodyDOM).find('[controlName="Address2"]'), '', element.Address2);
    setDOMValue($(tbodyDOM).find('[controlName="Country"]'), element.Country, element.CountryName);
    setDOMValue($(tbodyDOM).find('[controlName="IdentifyType"]'), element.IdentifyType, element.IdentifyType + ' - ' + element.IdentifyTypeName);
    setDOMValue($(tbodyDOM).find('[controlName="TaxCode"]'), element.TaxCode, element.TaxCode ? element.TaxCode + ' - ' + element.TaxCodeName : '');
    setDOMValue($(tbodyDOM).find('[controlName="TaxPrint"]'), element.TaxPrint, element.TaxPrint + ' - ' + element.TaxPrintName);
    setDOMValue($(tbodyDOM).find('[controlName="LiabilityCode"]'), element.LiabilityCodeCombinationCompany, element.LiabilityCodeCombinationCompany ? element.LiabilityCodeCombinationCompany + '-' + element.LiabilityCodeCombinationAccount + '-' + element.LiabilityCodeCombinationDepartment + '-' + element.LiabilityCodeCombinationProduct : '');
    setDOMValue($(tbodyDOM).find('[controlName="PrepayCode"]'), element.PrepayCodeCombinationCompany, element.PrepayCodeCombinationCompany ? element.PrepayCodeCombinationCompany + '-' + element.PrepayCodeCombinationAccount + '-' + element.PrepayCodeCombinationDepartment + '-' + element.PrepayCodeCombinationProduct : '');
    setDOMValue($(tbodyDOM).find('[controlName="PayGroupLookupCode"]'), element.PayGroupLookupCode, element.PayGroupLookupName);
    setDOMValue($(tbodyDOM).find('[controlName="PaymentMethodLookupCode"]'), element.PaymentMethodLookupCode, element.PaymentMethodLookupCodeName);
    setDOMValue($(tbodyDOM).find('[controlName="RemitAdviceDeliveryMethod"]'), element.RemitAdviceDeliveryMethod, element.RemitAdviceDeliveryMethod ? element.RemitAdviceDeliveryMethodName : '');
    setDOMValue($(tbodyDOM).find('[controlName="RemitAdviceEmail"]'), '', element.RemitAdviceEmail);
    setDOMValue($(tbodyDOM).find('[controlName="PaymentReasonCode"]'), element.PaymentReasonCode, element.PaymentReasonCode == '1' ? '內扣' : (element.PaymentReasonCode == '2' ? '外加' : ''));
    setDOMValue($(tbodyDOM).find('[controlName="PayAlone"]'), element.PayAlone, element.PayAlone == 'Y' ? '是' : (element.PayAlone == 'N' ? '否' : '請選擇'));

    $(tbodyDOM).attr('detailID', element.SPSID);
    return tbodyDOM;
}

function setContactViewValue(tbodyDOM, element) {
    ///<summary>利用object資料丟入setDOMValue function自動判定顯示方式</summary>
    /// <param name="tbodyDOM" type="DOM">table DOM</param>
    /// <param name="element" type="json obj">明細的json obj</param>

    setDOMValue($(tbodyDOM).find('[controlName="ActiveFlag"]'), '', element.ActiveFlag);
    setDOMValue($(tbodyDOM).find('[controlName="PersonLastName"]'), '', element.PersonLastName);
    setDOMValue($(tbodyDOM).find('[controlName="PersonFirstName"]'), '', element.PersonFirstName);
    setDOMValue($(tbodyDOM).find('[controlName="PhoneNumber"]'), '', element.PhoneNumber);
    setDOMValue($(tbodyDOM).find('[controlName="EmailAddress"]'), '', element.EmailAddress);
    setDOMValue($(tbodyDOM).find('[controlName="ContactDescription"]'), '', element.ContactDescription);
    $(tbodyDOM).attr('detailID', element.SPCID);
    return tbodyDOM;
}

function setBankAccountViewValue(tbodyDOM, element) {
    ///<summary>利用object資料丟入setDOMValue function自動判定顯示方式</summary>
    /// <param name="tbodyDOM" type="DOM">table DOM</param>
    /// <param name="element" type="json obj">明細的json obj</param>

    setDOMValue($(tbodyDOM).find('[controlName="ActiveFlag"]'), '', element.ActiveFlag);
    setDOMValue($(tbodyDOM).find('[controlName="BankCountry"]'), element.BankCountry, element.BankCountryName);
    setDOMValue($(tbodyDOM).find('[controlName="BankNumber"]'), element.BankNumber, element.BankName);
    setDOMValue($(tbodyDOM).find('[controlName="BranchNumber"]'), element.BranchNumber, element.BranchName);
    setDOMValue($(tbodyDOM).find('[controlName="SwiftCode"]'), '', element.SwiftCode);
    setDOMValue($(tbodyDOM).find('[controlName="BankAccountName"]'), '', element.BankAccountName);
    setDOMValue($(tbodyDOM).find('[controlName="BankAccountNumber"]'), '', element.BankAccountNumber);
    setDOMValue($(tbodyDOM).find('[controlName="RemittanceCheckCode"]'), '', element.RemittanceCheckCode);
    setDOMValue($(tbodyDOM).find('[controlName="BankAccountDescription"]'), '', element.BankAccountDescription);
    $(tbodyDOM).attr('detailID', element.SPAID);

    return tbodyDOM;
}

function setDOMValue(DOM, key, value) {
    /// <summary>設定欄位資料顯示</summary>
    /// <param name="DOM" type="object">要設定顯示值的DOM元件</param>
    /// <param name="key" type="string">內存值</param>
    /// <param name="value" type="string">外顯值</param>

    //若傳入之DOM元件為陣列型態，則使用遞迴呼叫
    if ($(DOM).length > 1) {
        $.each(DOM, function (index, element) {
            setDOMValue(element, key, value);
        });
        return;
    }

    //若傳入之DOM元件不存在則離開function
    if (!DOM) {
        return;
    }

    //取得DOM元件的tag類型
    var tagName = $(DOM).prop('tagName');
    switch (tagName) {
        case 'INPUT':
            //若tag為input元件，需要細部判定type

            if ($(DOM).prop('type') == 'text') {
                //type為text，直接設定value
                $(DOM).val(value);
            }
            else if ($(DOM).prop('type') == 'radio' && value != null && $(DOM).prop('value') == value.toString()) {
                //type為radio，需要判斷value，若相符才checked = true
                $(DOM).prop('checked', true);
            }
            else if ($(DOM).prop('type') == 'checkbox' && value.toString() == 'true') {
                //type為checkbox，需要判斷value，若相符才checked = true
                $(DOM).prop('checked', true);
            }

            //bootstrap的datetime欄位很機掰，input tag設定value沒有用，必須直接判別controlName進行trigger觸發
            if ($(DOM).attr('controlName') == 'SelfAssessmentformDate' || $(DOM).attr('controlName') == 'CommitmentDocDate') {
                $(DOM).parent().trigger('dp.change');
            }

            break;
        case 'SELECT':
            //若tag為select元件，則使用.selectpicker('refresh')觸發bootstrap建立下拉選單元件
            $(DOM).selectpicker('refresh');
            //bootstrap的select元件很機掰，畫面須產生元件後才能設定value
            if (key) {
                $(DOM).val(key);
            }
            else if (value) {
                $(DOM).find('option:contains("' + value + '")').prop('selected', true);
            }
            //設定好value又要.selectpicker('refresh')，真的很機掰
            $(DOM).selectpicker('refresh');

            //如果設定元件對象是「銀行國別」，必須利用此代號查詢銀行清單
            if ($(DOM).attr('controlName') == 'BankCountry') {
                getBank(key, $(DOM).parents('tr').find('#bankNumber'));
            }

            //如果設定元件對象是「銀行代號」，必須利用此代號的名稱查詢分行清單
            if ($(DOM).attr('controlName') == 'BankNumber') {
                getBankBranch(value, $(DOM).parents('tr').find('#branchNumber'));
            }

            //如果設定元件對象是「地址層的國別」且不為TW，則disable郵遞區號
            if ($(DOM).attr('controlName') == 'Country' && $(DOM).val() != 'TW') {
                DisableDOMObject($(DOM).parents('tbody').find('#postalCode1'));
                DisableDOMObject($(DOM).parents('tbody').find('#postCode2'));
            }

            break;
        case 'DIV':
            //若tag為div元件，通常是唯讀顯示用
            //一堆哩哩叩叩因為DOM階層的關係所做的hard code，呵呵
            if ($(DOM).hasClass('disable-text')) {
                $(DOM).text(value ? value : '');
            }
            if ($(DOM).attr('controlName') == 'TaxCode' || $(DOM).attr('controlName') == 'LiabilityCode' || $(DOM).attr('controlName') == 'PrepayCode' || $(DOM).attr('controlName') == 'IdentifyType') {
                if (!key) {
                    $(DOM).hide();
                }
                else {
                    $(DOM).prev('.undone-text').remove();
                }
            }
            if ($(DOM).attr('controlName') == 'TaxCode' && key) {
                $(DOM).parent().nextAll('#taxCodeCode').val(key);
                $(DOM).parent().nextAll('#taxCodeName').val(value.split(' - ')[1]);
            }
            if ($(DOM).parents('tbody').length > 0) {
                $(DOM).removeClass('disable-text');
            }

            if ($(DOM).attr('controlName') == 'SwiftCode' && value) {
                $(DOM).prev('.undone-text').hide();
            }
            break;
    }
}

function addDetailData(id) {
    /// <summary>根據table id取得明細層的json obj</summary>
    /// <param name="id" type="string">table id</param>

    switch (id) {
        case 'table-address':
            //地址明細json obj
            addAddressDetail();
            break;
        case 'table-contact':
            //聯絡人明細json obj
            addContactDetail();
            break;
        case 'table-bank-account':
            //銀行帳號明細json obj
            addBankAccountDetail();
            break;
    }
}

function addAddressDetail() {
    /// <summary>地址明細json obj</summary>

    var detail = {
        "ActiveFlag": true,
        "Address1": null,
        "Address2": null,
        "AddressLastUpdateDate": convertDateString(new Date()),
        "City1": null,
        "City2": null,
        "Country": "TW",
        "CountryName": null,
        "FaxNumber": null,
        "IdentifyType": null,
        "IdentifyTypeName": null,
        "IsDelete": false,
        "LiabilityCodeCombinationAccount": "230136001",
        "LiabilityCodeCombinationCompany": "0006",
        "LiabilityCodeCombinationDepartment": "8080Z003",
        "LiabilityCodeCombinationProduct": "00000",
        "OrgID": 81,
        "PayAlone": "N",
        "PayGroupLookupCode": null,
        "PayGroupLookupName": null,
        "PaymentMethodLookupCode": "WIRE",
        "PaymentMethodLookupCodeName": null,
        "PaymentReasonCode": "1",
        "PhoneNumber": null,
        "PostalCode1": null,
        "PostCode2": null,
        "PrepayCodeCombinationAccount": "195033001",
        "PrepayCodeCombinationCompany": "0006",
        "PrepayCodeCombinationDepartment": "8080Z003",
        "PrepayCodeCombinationProduct": "00000",
        "RemitAdviceDeliveryMethod": null,
        "RemitAdviceDeliveryMethodName": null,
        "RemitAdviceEmail": null,
        "SitePurpose": "採購/付款",
        "SPID": supplier.SPID,
        "SPSID": 0,
        "TaxCode": null,
        "TaxCodeName": null,
        "TaxPrint": "3",
        "TaxPrintName": null,
        "TaxRate": 0,
        "VendorSiteCode": "",
        "VendorSiteID": 0
    };

    supplier.SiteList.push(detail);
}

function addContactDetail() {
    /// <summary>聯絡人明細json obj</summary>

    var detail = {
        "ActiveDate": convertDateString(new Date()),
        "ActiveFlag": true,
        "ContactDescription": null,
        "EmailAddress": null,
        "IsDelete": false,
        "PersonFirstName": null,
        "PersonLastName": null,
        "PhoneNumber": null,
        "SPCID": 0,
        "SPID": supplier.SPID,
        "VendorContractID": 0
    };

    supplier.ContactList.push(detail);
}

function addBankAccountDetail() {
    /// <summary>銀行帳號明細json obj</summary>

    var detail = {
        "ActiveDate": convertDateString(new Date()),
        "ActiveFlag": true,
        "BankAccountDescription": null,
        "BankAccountName": null,
        "BankAccountNumber": null,
        "BankCountry": "TW",
        "BankCountryName": null,
        "SwiftCode": null,
        "BankName": null,
        "BankNumber": null,
        "BranchName": null,
        "BranchNumber": null,
        "IsDelete": false,
        "RemittanceCheckCode": null,
        "SPAID": 0,
        "SPID": supplier.SPID,
        "VendorBankAcctID": 0
    };

    supplier.AccountList.push(detail);
}

function alertopen(text) {
    /// <summary>偉大的UI/UX說不要用醜醜的原生alert，改用remodal</summary>
    /// <param name="text" type="string or array">你想顯示給北七使用者的文字</param>

    //$('#alertOK').unbind();
    $('#alertText').empty();
    if (typeof (text) != typeof ([])) {
        $('#alertText').text(text);
        $('[data-remodal-id=alert-modal]').remodal().open();
    }
    else {
        if (text.length < 1) {
            return;
        }
        $('#alertText').append(text.join("<br>"));

        $('[data-remodal-id=alert-modal]').remodal().open();
        //$('#alertOK').on('click', alertopen);
    }
}

function resetSerNum(table) {
    /// <summary>重新編排table的項次流水號，當列數增減時呼叫此function</summary>
    /// <param name="table" type="DOM">受影響的table</param>

    $.each($(table).find('.SerNum'), function (index, element) {
        $(element).text(index + 1);
    });
}

function getIdentity() {
    /// <summary>取得證號別清單，並儲存至樣版下拉選單中</summary>

    //若非編輯狀態，則只需要外顯字即可，不需撈資料
    if (_currentSetting.Site.find(function (item, index, array) {
return item.controlName == 'IdentifyType' && item.fieldStatus == 'edit'
    })) {
        $.ajax({
            url: '/SP/GetIdentity',
            async: false,
            dataType: 'json',
            type: 'POST',
            success: function (data, textStatus, jqXHR) {
                identity = data;
                var select = $(tableAddressTemp).find('#identifyType');
                $.each(identity, function (index, element) {
                    select.append($('<option>').val(element.identityTypeCode).text(element.identityTypeCode + ' - ' + element.description).attr('optionText', element.description).attr('tag', element.tag));
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    }
}

function getWtTax() {
    /// <summary>取得代扣稅率代碼清單，並儲存至全域變數_optionList，提供cbp-OptionSelect.js實作開窗選擇項目</summary>

    //若非編輯狀態，則只需要外顯字即可，不需撈資料
    if (_currentSetting.Site.find(function (item, index, array) {
    return item.controlName == 'TaxCode' && item.fieldStatus == 'edit'
    })) {
        $.ajax({
            url: '/SP/GetWtTax',
            async: false,
            dataType: 'json',
            type: 'POST',
            success: function (data, textStatus, jqXHR) {
                $.each(data, function (index, element) {
                    wtTax.push({
                        key: element.wtTaxCode, value: element.wtTaxtCodeDescription
                    });
                });
                _optionList.push({
                    key: 'taxCode', value: wtTax.slice(0)
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    }
}

function getWtTaxRate() {
    /// <summary>取得取得代扣稅率百分比清單</summary>

    //若非編輯狀態，則此資料已記錄至Model中，不需撈資料
    if (_currentSetting.Site.find(function (item, index, array) {
    return item.controlName == 'TaxCode' && item.fieldStatus == 'edit'
    })) {
        $.ajax({
            url: '/SP/GetWtTaxRate',
            async: false,
            dataType: 'json',
            type: 'POST',
            success: function (data, textStatus, jqXHR) {
                wtTaxRate = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    }
}

function getPaymentMethod() {
    /// <summary>取得付款方式清單，並儲存至樣版下拉選單中</summary>

    //若非編輯狀態，則只需要外顯字即可，不需撈資料
    if (_currentSetting.Site.find(function (item, index, array) {
    return item.controlName == 'PaymentMethodLookupCode' && item.fieldStatus == 'edit'
    })) {
        $.ajax({
            url: '/SP/GetPaymentMethod',
            async: false,
            dataType: 'json',
            type: 'POST',
            success: function (data, textStatus, jqXHR) {
                paymentMethod = data;
                var select = $(tableAddressTemp).find('#paymentMethodLookupCode');
                $.each(paymentMethod, function (index, element) {
                    select.append($('<option>').val(element.paymentMethod).text(element.paymentMethodDescription));
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    }
}

function getTerritory() {
    /// <summary>取得國別清單，並儲存至樣版下拉選單中</summary>

    var counrtyControl = [];
    counrtyControl.push(_currentSetting.Site.find(function (item, index, array) {
        return item.controlName == 'Country' && item.fieldStatus == 'edit'
    }));

    counrtyControl.push(_currentSetting.BankAccount.find(function (item, index, array) {
        return item.controlName == 'BankCountry' && item.fieldStatus == 'edit'
    }));

    //若非編輯狀態，則只需要外顯字即可，不需撈資料
    if (counrtyControl.length > 0) {
        $.ajax({
            url: '/SP/GetTerritory',
            async: false,
            dataType: 'json',
            type: 'POST',
            success: function (data, textStatus, jqXHR) {
                if ($.inArray('Country', counrtyControl)) {
                    var select = $(tableAddressTemp).find('#country');
                    $.each(data, function (index, element) {
                        select.append($('<option>').val(element.territoryCode).text(element.description).attr('data-subtext', element.territoryCode));
                    });
                }
                if ($.inArray('BankCountry', counrtyControl)) {
                    var select = $(tableBankAccountTemp).find('#bankCountry');
                    $.each(data, function (index, element) {
                        select.append($('<option>').val(element.territoryCode).text(element.description).attr('data-subtext', element.territoryCode));
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    }
}

function getPayGroup() {
    /// <summary>取得國別付款群組清單，並儲存至樣版下拉選單中</summary>

    //若非編輯狀態，則只需要外顯字即可，不需撈資料
    if (_currentSetting.Site.find(function (item, index, array) {
    return item.controlName == 'PayGroupLookupCode' && item.fieldStatus == 'edit'
    })) {
        $.ajax({
            url: '/SP/GetLookUpType',
            async: false,
            dataType: 'json',
            type: 'POST',
            data: {
                type: 0
            },
            success: function (data, textStatus, jqXHR) {
                payGroup = data;
                var select = $(tableAddressTemp).find('#payGroupLookupCode');
                $.each(payGroup, function (index, element) {
                    select.append($('<option>').val(element.code).text(element.description));
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    }
}

function getWtTaxPrint() {
    /// <summary>取得憑單方式清單，並儲存至樣版下拉選單中</summary>

    //若非編輯狀態，則只需要外顯字即可，不需撈資料
    if (_currentSetting.Site.find(
        function (item, index, array) {
return item.controlName == 'TaxPrint' && item.fieldStatus == 'edit';
    })) {
        $.ajax({
            url: '/SP/GetLookUpType',
            async: false,
            dataType: 'json',
            type: 'POST',
            data: {
                type: 1
            },
            success: function (data, textStatus, jqXHR) {
                wtTaxPrint = data;
                var select = $(tableAddressTemp).find('#taxPrint');
                $.each(wtTaxPrint, function (index, element) {
                    select.append($('<option>').val(element.code).text(element.code + ' - ' + element.description).attr('optionText', element.description));
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    }
}

function getDocumentaryEvidenceCompany() {
    /// <summary>取得憑開立對象清單，並儲存至remodal清單中</summary>

    //若非編輯狀態，則只需要外顯字即可，不需撈資料
    if (_currentSetting.Site.find(function (item, index, array) {
return item.controlName == 'LiabilityCode' && item.fieldStatus == 'edit'
    })) {
        $.ajax({
            url: '/SP/GetCertificateObject',
            dataType: 'json',
            type: 'POST',
            success: function (data, textStatus, jqXHR) {
                var ul = $('.popup-box-area#EXCG-055_2 .popup-tbody ul');
                $.each(data, function (index, element) {
                    var li = $($('#type-option-temp').html()).clone();
                    var input = $(li).find('input').attr('name', 'EXCG-055_2').val(element.accountCode);
                    $(li).find('.table-box').text(element.accountCode + ' - ' + element.accountName).prepend(input);
                    ul.append(li);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    }
}

function getCoaAccount() {
    /// <summary>取得會計項子目清單，並儲存至remodal清單中</summary>

    //若非編輯狀態，則只需要外顯字即可，不需撈資料
    if (_currentSetting.Site.find(function (item, index, array) {
return item.controlName == 'LiabilityCode' && item.fieldStatus == 'edit'
    })) {
        $.ajax({
            url: '/SP/GetCoaAccount',
            dataType: 'json',
            type: 'POST',
            success: function (data, textStatus, jqXHR) {
                var ul = $('.popup-box-area#EXCG-056 .popup-tbody ul');
                $.each(data, function (index, element) {
                    var li = $($('#type-option-temp').html()).clone();
                    var input = $(li).find('input').attr('name', 'EXCG-056').val(element.account);
                    $(li).find('.table-box').text(element.account + ' - ' + element.description).prepend(input);
                    ul.append(li);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    }
}

function getDepartmentList() {
    /// <summary>取得成本利潤中心清單，並儲存至remodal清單中</summary>

    //若非編輯狀態，則只需要外顯字即可，不需撈資料
    if (_currentSetting.Site.find(function (item, index, array) {
return item.controlName == 'LiabilityCode' && item.fieldStatus == 'edit'
    })) {
        $.ajax({
            url: '/SP/GetDepartmentList',
            dataType: 'json',
            type: 'POST',
            success: function (data, textStatus, jqXHR) {
                var ul = $('.popup-box-area#EXCG-057 .popup-tbody ul');
                $.each(data, function (index, element) {
                    var li = $($('#type-option-temp').html()).clone();
                    var input = $(li).find('input').attr('name', 'EXCG-057').val(element.department);
                    $(li).find('.table-box').text(element.department + ' - ' + element.description).prepend(input);
                    ul.append(li);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    }
}

function getProduct() {
    /// <summary>取得產品別清單，並儲存至remodal清單中</summary>

    //若非編輯狀態，則只需要外顯字即可，不需撈資料
    if (_currentSetting.Site.find(function (item, index, array) {
return item.controlName == 'LiabilityCode' && item.fieldStatus == 'edit'
    })) {
        $.ajax({
            url: '/SP/GetProduct',
            dataType: 'json',
            type: 'POST',
            success: function (data, textStatus, jqXHR) {
                var ul = $('.popup-box-area#EXCG-058 .popup-tbody ul');
                $.each(data, function (index, element) {
                    var li = $($('#type-option-temp').html()).clone();
                    var input = $(li).find('input').attr('name', 'EXCG-058').val(element.product);
                    $(li).find('.table-box').text(element.product + ' - ' + element.description).prepend(input);
                    ul.append(li);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    }
}

function getBank(bankCountry, select) {
    /// <summary>取得銀行清單，並儲存至樣版下拉選單中</summary>
    /// <param name="bankCountry" type="string">銀行國別</param>
    /// <param name="select" type="DOM">要載入清單的下拉選單元件</param>

    //若銀行國別還沒選(無值)，則disable銀行下拉選單
    if (!bankCountry) {
        select.val('');
        DisableDOMObject(select);
        return;
    }

    $.ajax({
        url: '/SP/GetBankListAll',
        async: false,
        dataType: 'json',
        type: 'POST',
        data: {
            bankCountry: bankCountry
        },
        success: function (data, textStatus, jqXHR) {
            $(select).val('').empty();
            $.each(data, function (index, element) {
                select.append($('<option>').val(element.bankNumber ? element.bankNumber : '').text(element.bankName).attr('data-subtext', element.bankNumber ? element.bankNumber : ''));
            });
            EnableDOMObject(select);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
        }
    });
}

function getBankBranch(bankName, select) {
    /// <summary>當銀行選單有異動時，立即查詢特定銀行的分行資訊</summary>
    /// <param name="bankName" type="string">銀行名稱</param>
    /// <param name="select" type="DOM">要載入清單的下拉選單元件</param>

    //若銀行代號還沒選(無值)，則disable分行下拉選單
    if (!bankName) {
        select.val('');
        DisableDOMObject(select);
        return;
    }

    $.ajax({
        url: '/SP/GetBankBranchListAll',
        async: false,
        dataType: 'json',
        type: 'POST',
        data: {
            bankName: bankName
        },
        success: function (data, textStatus, jqXHR) {
            $(select).val('').empty();
            $.each(data, function (index, element) {
                select.append($('<option>').val(element.branchNumber ? element.branchNumber : '').text(element.branchName).attr('eftSwiftCode', element.eftSwiftCode).attr('data-subtext', element.branchNumber ? element.branchNumber : ''));
            });
            EnableDOMObject(select);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
        }
    });
}

function getPostal() {
    /// <summary>取得郵遞區號清單，並儲存至樣版下拉選單中</summary>

    //若非編輯狀態，則只需要外顯字即可，不需撈資料
    if (_currentSetting.Site.find(function (item, index, array) {
return item.controlName == 'PostalCode1' && item.fieldStatus == 'edit'
    })) {
        $.ajax({
            url: '/SP/GetPostal',
            async: false,
            dataType: 'json',
            type: 'POST',
            success: function (data, textStatus, jqXHR) {
                var select1 = $(tableAddressTemp).find('#postalCode1');
                var select2 = $(tableAddressTemp).find('#postCode2');

                select1.append($('<option>').val('').text('請選擇').attr('CityName', '').attr('PostalName', ''));
                select2.append($('<option>').val('').text('請選擇').attr('CityName', '').attr('PostalName', ''));

                $.each(data, function (index, element) {
                    select1.append($('<option>').val(element.PostalCode).text(element.PostalCode + ' ' + element.CityName + element.PostalName).attr('CityName', element.CityName).attr('PostalName', element.PostalName));
                    select2.append($('<option>').val(element.PostalCode).text(element.PostalCode + ' ' + element.CityName + element.PostalName).attr('CityName', element.CityName).attr('PostalName', element.PostalName));
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    }
}

function addYear(date) {
    /// <summary>將特定日期增加「供應商審查期限」年數，並回傳字串</summary>
    /// <param name="date" type="Date">欲增加年數的日期</param>

    var dateYear = date.getFullYear();
    var dateMonth = date.getMonth();
    var dateDay = date.getDate();

    return convertDateString(new Date(dateYear + supplier.LimitYear, dateMonth, dateDay));
}

function convertDateString(date) {
    /// <summary>將日期轉換成yyyy-MM-dd格式</summary>
    /// <param name="date" type="Date">日期</param>

    var dateYear = date.getFullYear();
    var dateMonth = date.getMonth() + 1;
    if (dateMonth.toString().length < 2) {
        dateMonth = "0" + dateMonth.toString();
    }
    var dateDay = date.getDate();
    if (date.getDate().toString().length < 2) {
        dateDay = "0" + date.getDate().toString();
    }
    return dateYear + "-" + dateMonth + "-" + dateDay;
}

//==============================================
//供應商主檔欄位異動事件
function changeVendorName(value) {
    supplier.VendorName = value;
}

function changeVendorNameAlt(value) {
    supplier.VendorNameAlt = value;
}

function changeVendorDescription(value) {
    supplier.VendorDescription = value;
}

function changeToCardDepartment(value) {
    supplier.ToCardDepartment = value;
}

function changeVendorType(selectDOM) {
    supplier.VendorTypeLookupCode = $(selectDOM).val();
    supplier.VendorTypeLookupName = $(selectDOM).find('option:selected').text();
}

function changeVatRegistrationNum(value) {
    supplier.VatRegistrationNum = value;
}

function changeParentCompanyName(value) {
    supplier.ParentCompanyName = value;
}

function changeParentCompanyVatNum(value) {
    supplier.ParentCompanyVatNum = value;
}
//==============================================

//==============================================
//地址明細欄位異動事件
function changeAddressActiveFlag(inputDOM) {
    var index = $('#table-address tbody').index($(inputDOM).parents('tbody'));
    supplier.SiteList[index].ActiveFlag = $(inputDOM).prop('checked');
    supplier.SiteList[index].AddressLastUpdateDate = convertDateString(new Date());
}

function changeVendorSiteCode(inputDOM) {
    $(inputDOM).val($(inputDOM).val().trim());
    supplier.SiteList[$('#table-address tbody').index($(inputDOM).parents('tbody'))].VendorSiteCode = $(inputDOM).val();
}

function changeSitePurpose(selectDOM) {
    supplier.SiteList[$('#table-address tbody').index($(selectDOM).parents('tbody'))].SitePurpose = $(selectDOM).val();
}

function changeAddressPhoneNumber(inputDOM) {
    supplier.SiteList[$('#table-address tbody').index($(inputDOM).parents('tbody'))].PhoneNumber = $(inputDOM).val();
}

function changeFaxNumber(inputDOM) {
    supplier.SiteList[$('#table-address tbody').index($(inputDOM).parents('tbody'))].FaxNumber = $(inputDOM).val();
}

function changeCountry(selectDOM) {
    var tbody = $(selectDOM).parents('tbody');
    var index = $('#table-address tbody').index(tbody);
    supplier.SiteList[index].Country = $(selectDOM).val();
    supplier.SiteList[index].CountryName = $(selectDOM).find('option:selected').text();
    if ($(selectDOM).val() != 'TW') {
        $(tbody).find('#postalCode1').val('').trigger('change');
        DisableDOMObject($(tbody).find('#postalCode1'));

        $(tbody).find('#postCode2').val('').trigger('change');
        DisableDOMObject($(tbody).find('#postCode2'));
    }
    else {
        EnableDOMObject($(tbody).find('#postalCode1'));
        EnableDOMObject($(tbody).find('#postCode2'));
    }
}

function changeIdentifyType(selectDOM) {
    var tbody = $(selectDOM).parents('tbody');
    var index = $('#table-address tbody').index(tbody);
    supplier.SiteList[index].IdentifyType = $(selectDOM).val();
    supplier.SiteList[index].IdentifyTypeName = $(selectDOM).find('option:selected').attr('optionText');
    var rate = findWtTaxRate($(tbody).find('#taxCodeCode').val(), $(selectDOM).find('option:selected').attr('tag'));
    supplier.SiteList[index].TaxRate = $.isNumeric(rate) ? rate : supplier.SiteList[index].TaxRate;
}

function changeTaxPrint(selectDOM) {
    var index = $('#table-address tbody').index($(selectDOM).parents('tbody'));
    supplier.SiteList[index].TaxPrint = $(selectDOM).val();
    supplier.SiteList[index].TaxPrintName = $(selectDOM).find('option:selected').attr('optionText');
}

function changePayGroupLookupCode(selectDOM) {
    var index = $('#table-address tbody').index($(selectDOM).parents('tbody'));
    supplier.SiteList[index].PayGroupLookupCode = $(selectDOM).val();
    supplier.SiteList[index].PayGroupLookupName = $(selectDOM).val() ? $(selectDOM).find('option:selected').text() : '';
}

function changePaymentMethodLookupCode(selectDOM) {
    var index = $('#table-address tbody').index($(selectDOM).parents('tbody'));
    supplier.SiteList[index].PaymentMethodLookupCode = $(selectDOM).val();
    supplier.SiteList[index].PaymentMethodLookupCodeName = $(selectDOM).find('option:selected').text();
}

function changeRemitAdviceDeliveryMethod(selectDOM) {
    var index = $('#table-address tbody').index($(selectDOM).parents('tbody'));
    supplier.SiteList[index].RemitAdviceDeliveryMethod = $(selectDOM).val();
    supplier.SiteList[index].RemitAdviceDeliveryMethodName = $(selectDOM).val() ? $(selectDOM).find('option:selected').text() : '';
}

function changeRemitAdviceEmail(inputDOM) {
    supplier.SiteList[$('#table-address tbody').index($(inputDOM).parents('tbody'))].RemitAdviceEmail = $(inputDOM).val();
}

function changePaymentReasonCode(selectDOM) {
    supplier.SiteList[$('#table-address tbody').index($(selectDOM).parents('tbody'))].PaymentReasonCode = $(selectDOM).val();
}

function changePayAlone(selectDOM) {
    supplier.SiteList[$('#table-address tbody').index($(selectDOM).parents('tbody'))].PayAlone = $(selectDOM).val();
}

function clickMultiOptionSearch(aDOM) {
    $('div[data-remodal-id="combination-search-option"] #modal1Title').text($(aDOM).attr('id') == 'liability' ? '負債科目' : '預付科目');
    $('div[data-remodal-id="combination-search-option"]').remodal().open();
    _tdTemp = $(aDOM).parents('td');
}

function changeTaxCode(inputDOM) {
    if (((_currentSetting.FlowKey == 'SP_P1_01' || _currentSetting.FlowKey == 'SP_P1_11' || _currentSetting.FlowKey == 'SP_P1_12' || _currentSetting.FlowKey == 'SP_P1_15') && (_currentSetting.CurrentStep == 1 || _currentSetting.CurrentStep == 3))
        || ((_currentSetting.FlowKey == 'SP_P1_07' || _currentSetting.FlowKey == 'SP_P1_08') && (_currentSetting.CurrentStep == 1 || _currentSetting.CurrentStep == 3))) {
        var tbody = $(inputDOM).parents('tbody');
        var index = $('#table-address tbody').index(tbody);
        supplier.SiteList[index].TaxCode = $(inputDOM).val();
        supplier.SiteList[index].TaxCodeName = $(inputDOM).next().val();
        var rate = findWtTaxRate($(inputDOM).val(), $(tbody).find('#identifyType option:selected').attr('tag'));
        supplier.SiteList[index].TaxRate = $.isNumeric(rate) ? rate : supplier.SiteList[index].TaxRate;
    }
}

function findWtTaxRate(code, foreigner) {
    /// <summary>從代扣稅率清單中尋找特定的代扣稅率代碼，再藉由「是否為本國人」取得不同稅率</summary>
    /// <param name="code" type="string">代扣稅率代碼</param>
    /// <param name="foreigner" type="string">是否為本國人，1：本國人，2：外國人</param>

    //若稅率百分比主檔不存在，表示該階段不可編輯並回傳null，表示保持原單據所儲存的百分比
    if (!wtTaxRate) {
        return null;
    }

    var find = wtTaxRate.find(function (item, index, array) {
        return item.taxCode == code
    });
    if (find) {
        if (foreigner == '1') {
            return find.nativeWtRate;
        }
        else if (foreigner == '2') {
            return find.alienWtRate;
        }
        else {
            return 0;
        }
    }

    return 0;
}

function changeSameAddress(inputDOM) {
    var tbody = $(inputDOM).parents('tbody');
    var postCode2 = $(tbody).find('#postCode2');
    var address2 = $(tbody).find('#address2');

    if ($(inputDOM).prop('checked')) {
        $(postCode2).val($(tbody).find('#postalCode1').val()).trigger('change');
        $(address2).val($(tbody).find('#address1').val()).trigger('change');
        DisableDOMObject(postCode2);
        DisableDOMObject(address2);
    }
    else {
        if ($(tbody).find('#country').val() == 'TW') {
            EnableDOMObject(postCode2);
        }
        EnableDOMObject(address2);
    }
}

function changeAddress1(inputDOM) {
    supplier.SiteList[$('#table-address tbody').index($(inputDOM).parents('tbody'))].Address1 = $(inputDOM).val();

    if ($(inputDOM).parents('tr').next().find('#sameAddress').prop('checked')) {
        $(inputDOM).parents('tr').next().next().find('#address2').val($(inputDOM).val()).trigger('change');
    }
}

function changePostalCode1(selectDOM) {
    var index = $('#table-address tbody').index($(selectDOM).parents('tbody'));
    var option = $(selectDOM).find('option:selected');
    if (option) {
        supplier.SiteList[index].PostalCode1 = $(selectDOM).val();
        supplier.SiteList[index].City1 = $(selectDOM).val() ? option.attr('CityName') + option.attr('PostalName') : '';

        if ($(selectDOM).parents('tr').next().find('#sameAddress').prop('checked')) {
            $(selectDOM).parents('tr').next().next().find('#postCode2').val($(selectDOM).val()).trigger('change');
        }
    }
}

function changeAddress2(inputDOM) {
    supplier.SiteList[$('#table-address tbody').index($(inputDOM).parents('tbody'))].Address2 = $(inputDOM).val();
}

function changePostCode2(selectDOM) {
    var index = $('#table-address tbody').index($(selectDOM).parents('tbody'));
    var option = $(selectDOM).find('option:selected');
    if (option) {
        supplier.SiteList[index].PostCode2 = $(selectDOM).val();
        supplier.SiteList[index].City2 = $(selectDOM).val() ? option.attr('CityName') + option.attr('PostalName') : '';
    }
}
//==============================================

//==============================================
//聯絡人明細欄位異動事件
function changeContactActiveFlag(inputDOM) {
    var index = $('#table-contact tbody').index($(inputDOM).parents('tbody'));
    supplier.ContactList[index].ActiveFlag = $(inputDOM).prop('checked');
    supplier.ContactList[index].ActiveDate = convertDateString(new Date());
}

function changePersonLastName(inputDOM) {
    $(inputDOM).val($(inputDOM).val().trim());
    supplier.ContactList[$('#table-contact tbody').index($(inputDOM).parents('tbody'))].PersonLastName = $(inputDOM).val();
}

function changePersonFirstName(inputDOM) {
    $(inputDOM).val($(inputDOM).val().trim());
    supplier.ContactList[$('#table-contact tbody').index($(inputDOM).parents('tbody'))].PersonFirstName = $(inputDOM).val();
}

function changeContactPhoneNumber(inputDOM) {
    $(inputDOM).val($(inputDOM).val().trim());
    supplier.ContactList[$('#table-contact tbody').index($(inputDOM).parents('tbody'))].PhoneNumber = $(inputDOM).val();
}

function changeEmailAddress(inputDOM) {
    supplier.ContactList[$('#table-contact tbody').index($(inputDOM).parents('tbody'))].EmailAddress = $(inputDOM).val();
}

function changeContactDescription(inputDOM) {
    supplier.ContactList[$('#table-contact tbody').index($(inputDOM).parents('tbody'))].ContactDescription = $(inputDOM).val();
}
//==============================================

//==============================================
//銀行帳號明細欄位異動事件
function changeAccountActiveFlag(inputDOM) {
    var index = $('#table-bank-account tbody').index($(inputDOM).parents('tbody'));
    supplier.AccountList[index].ActiveFlag = $(inputDOM).prop('checked');
    supplier.AccountList[index].ActiveDate = convertDateString(new Date());
}

function changeBankCountry(selectDOM) {
    var tbody = $(selectDOM).parents('tbody');
    var index = $('#table-bank-account tbody').index(tbody);
    supplier.AccountList[index].BankCountry = $(selectDOM).val();
    supplier.AccountList[index].BankCountryName = $(selectDOM).val() ? $(selectDOM).find('option:selected').text() : '';
    getBank($(selectDOM).val(), $(tbody).find('#bankNumber'));
    $(tbody).find('#bankNumber').trigger('change');
}

function changeBankNumber(selectDOM) {
    var tbody = $(selectDOM).parents('tbody');
    var index = $('#table-bank-account tbody').index(tbody);
    supplier.AccountList[index].BankNumber = $(selectDOM).val();
    supplier.AccountList[index].BankName = $(selectDOM).find('option:selected').text() != '請選擇' ? $(selectDOM).find('option:selected').text() : '';
    getBankBranch(supplier.AccountList[index].BankName, $(tbody).find('#branchNumber'));
    $(tbody).find('#branchNumber').trigger('change');
}

function changeBranchNumber(selectDOM) {
    var tbody = $(selectDOM).parents('tbody');
    var index = $('#table-bank-account tbody').index(tbody);
    supplier.AccountList[index].BranchNumber = $(selectDOM).val();
    supplier.AccountList[index].BranchName = $(selectDOM).find('option:selected').text() != '請選擇' ? $(selectDOM).find('option:selected').text() : '';
    supplier.AccountList[index].SwiftCode = supplier.AccountList[index].BranchName ? $(selectDOM).find('option:selected').attr('eftSwiftCode') : '';
    if (supplier.AccountList[index].SwiftCode) {
        $(tbody).find('[controlName="GetSwiftCode"]').hide();
    }
    else {
        $(tbody).find('[controlName="GetSwiftCode"]').show();
    }
    $(tbody).find('#swiftCode').text(supplier.AccountList[index].SwiftCode);
}

function changeBankAccountName(inputDOM) {
    supplier.AccountList[$('#table-bank-account tbody').index($(inputDOM).parents('tbody'))].BankAccountName = $(inputDOM).val();
}

function changeBankAccountNumber(inputDOM) {
    $(inputDOM).val($(inputDOM).val().trim());
    supplier.AccountList[$('#table-bank-account tbody').index($(inputDOM).parents('tbody'))].BankAccountNumber = $(inputDOM).val();
}

function changeRemittanceCheckCode(inputDOM) {
    supplier.AccountList[$('#table-bank-account tbody').index($(inputDOM).parents('tbody'))].RemittanceCheckCode = $(inputDOM).val();
}

function changeBankAccountDescription(inputDOM) {
    supplier.AccountList[$('#table-bank-account tbody').index($(inputDOM).parents('tbody'))].BankAccountDescription = $(inputDOM).val();
}
//==============================================

//==============================================
//負債&預付科目查詢異動事件
function changeCombinationInput(value) {
    $('.combinationInput').hide();
    $('.combinationInput#input' + value).show();
}

function clickSearchCombination() {
    searchCondition($('.combinationInput:visible').val());
}

function keyupToSearch(event) {
    if (event.keyCode === 13) {
        searchCondition($('.combinationInput:visible').val());
    }
}

function searchCondition(value) {
    $('#' + $('#combinationSearchtype').val()).find('.popup-tbody input').prop('checked', false);
    if (value) {
        $('#' + $('#combinationSearchtype').val()).find('.popup-tbody li:contains("' + value + '")').show();
        $('#' + $('#combinationSearchtype').val()).find('.popup-tbody li:not(:contains("' + value + '"))').hide();
    }
    else {
        $('#' + $('#combinationSearchtype').val()).find('.popup-tbody li').show();
    }
    $('#remodal-select-result #' + $('#combinationSearchtype').val()).text('');
}

function clickConfirm() {
    var excg_055_2 = $('div.disable-text#EXCG-055_2').text();
    var excg_056 = $('div.disable-text#EXCG-056').text();
    var excg_057 = $('div.disable-text#EXCG-057').text();
    var excg_058 = $('div.disable-text#EXCG-058').text();
    var span = $(_tdTemp).children('span');
    if (!(excg_055_2 && excg_056 && excg_057 && excg_058)) {
        alert('請輸入完整科目組合!');
        return;
        //excg_055_2 = excg_056 = excg_057 = excg_058 = null;
        //$(span).text('').append('<span class="undone-text">點選按鈕新增</span>');
    }
    else {
        $(span).text(excg_055_2 + '-' + excg_056 + '-' + excg_057 + '-' + excg_058);
        $('div[data-remodal-id="combination-search-option"]').remodal().close();
    }

    setCombinationData(_tdTemp, excg_055_2, excg_056, excg_057, excg_058);
}

function setCombinationData(td, company, account, department, product) {
    var index = $('#table-address tbody').index($(td).parents('tbody'));
    switch ($(td).attr('id')) {
        case 'liabilityCodeCombination':
            supplier.SiteList[index].LiabilityCodeCombinationCompany = company;
            supplier.SiteList[index].LiabilityCodeCombinationAccount = account;
            supplier.SiteList[index].LiabilityCodeCombinationDepartment = department;
            supplier.SiteList[index].LiabilityCodeCombinationProduct = product;
            break;
        case 'prepayCodeCombination':
            supplier.SiteList[index].PrepayCodeCombinationCompany = company;
            supplier.SiteList[index].PrepayCodeCombinationAccount = account;
            supplier.SiteList[index].PrepayCodeCombinationDepartment = department;
            supplier.SiteList[index].PrepayCodeCombinationProduct = product;
            break;
    }
}
//==============================================

function isNumberKey(evt) {
    /// <summary>只允許純數字，可套用到任何input的onkeypress事件</summary>

    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}