//供應商查詢結果全域變數
var supplierResponse;
//證號別
var identity;
//代扣稅率代碼
var wtTax;
//付款方式
var paymentMethod;
//國別
var territory;
//付款群組
var payGroup;
//憑單方式
var wtTaxPrint;
//供應商審查期限
var vendorExp;
//查無資料
var notFound = '<b class="undone-text">查無資料</b>';
//地址選擇編輯區域
var addressLevel = {
    "SupplierNumber": null,
    "DetailID": 0,
    "Level": 0
};
//搜尋供應商條件
var optionInput = {
    'sourceKeyId': null,
    'employeeNumber': null,
    'supplierNumber': null,
    'vatRegistrationNumber': null,
    'supplierName': null,
    'limitCount': 10,
    'offsetNumber': 0,
};
$(function () {
    //取得證號別主檔
    getIdentity();

    //代扣稅率代碼主檔
    getWtTax();

    //付款方式主檔
    getPaymentMethod();

    //國別主檔
    getTerritory();

    //付款群組主檔
    getPayGroup();

    //憑單方式主檔
    getWtTaxPrint();

    //供應商審查期限
    getVendorExp();

    //明細層單一資訊展開
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

    //明細層全部資訊展開
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

    //查詢
    $('#SearchVendor').click(function () {
        $('#supplierName').val($('#supplierName').val().trim());
        $('#vatRegistrationNumber').val($('#vatRegistrationNumber').val().trim());

        if ($('#supplierName').val() != '' || $('#vatRegistrationNumber').val().trim() != '') {
            optionInput.supplierName = $('#supplierName').val();
            optionInput.vatRegistrationNumber = $('#vatRegistrationNumber').val();
            optionInput.limitCount = $('#PageSize').val();
            optionInput.offsetNumber = 0;
            $.when(querySupplier()).then(
                function () {
                    renderPaging();
                });
        }
        else {
            alertopen('請輸入其中一項資訊');
        }
    });

    //查看
    $(document).on('click', '#ResultList tbody .icon-edit-bt-s', function () {
        if ($('#addressTable .list-close-icon').length > 0) {
            $('#addressTable .ExpandAllDetail').trigger('click');
        }

        var id = $(this).attr('id');
        showSupplierInfo(supplierResponse.supplier.find(function (item, index, array) { return item.supplierNumber == id; }));

        if ($('#VendorSection').offset() == undefined) {
            return;
        }
        $(".main-content-box").animate({ scrollTop: $('#VendorSection').offset().top + $('.main-content-box').scrollTop() - 60 }, 300);
        return false;
    });

    //TAB切換
    $('.moving-tab-bt a').click(function () {
        $('.moving-tab-bt a').removeClass('moving-tab-bt-active');
        $(this).addClass('moving-tab-bt-active');
        $('.moving-tab-content').children().hide();
        $('div#' + $(this).attr('id')).show();
    });

    $('div[data-remodal-id="address-level-remodal"] tbody').click(function (event) {
        if (event.target.type != 'checkbox') {
            $(this).find(':checkbox:not(:disabled)').trigger('click');
        }
    });

    $('.pagination').on('click', '.pages:not(.active)', function () {
        var dom = this;
        optionInput.offsetNumber = (Number($(dom).text()) - 1) * optionInput.limitCount;
        $.when(querySupplier()).then(
                function () {
                    $('.changePaging').remove();

                    $('.pagination .active').removeClass('active');
                    $(dom).addClass('active');

                    if ($(dom).text() != '1') {
                        $('.pagination').prepend('<li class="changePaging" id="prevPaging"><a>«</a></li>');
                    }
                    if ($(dom).text() != Math.ceil(supplierResponse.numberOfRecords / optionInput.limitCount)) {
                        $('.pagination').append('<li class="changePaging" id="nextPaging"><a>»</a></li>');
                    }
                });
    });

    $('.pagination').on('click', '.changePaging', function () {
        var activePage = $('.pagination .active');
        var changePage = $(this).attr('id') == 'prevPaging' ? $(activePage).prev('.pages') : $(activePage).next('.pages');
        if (changePage.length > 0) {
            $(changePage).trigger('click')
        }
        else {
            var pagingNumber = $(this).attr('id') == 'prevPaging' ? Number($(activePage).text()) - 2 : Number($(activePage).text());
            optionInput.offsetNumber = pagingNumber * optionInput.limitCount;
            $.when(querySupplier()).then(
                function () {
                    renderPaging();
                });
        }
    });
});

function getIdentity() {
    $.ajax({
        url: '/SP/GetIdentity',
        dataType: 'json',
        type: 'POST',
        success: function (data, textStatus, jqXHR) {
            identity = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function getWtTax() {
    $.ajax({
        url: '/SP/GetWtTax',
        dataType: 'json',
        type: 'POST',
        success: function (data, textStatus, jqXHR) {
            wtTax = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function getPaymentMethod() {
    $.ajax({
        url: '/SP/GetPaymentMethod',
        dataType: 'json',
        type: 'POST',
        success: function (data, textStatus, jqXHR) {
            paymentMethod = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function getTerritory() {
    $.ajax({
        url: '/SP/GetTerritory',
        dataType: 'json',
        type: 'POST',
        success: function (data, textStatus, jqXHR) {
            territory = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function getPayGroup() {
    $.ajax({
        url: '/SP/GetLookUpType',
        dataType: 'json',
        type: 'POST',
        data: { type: 0 },
        success: function (data, textStatus, jqXHR) {
            payGroup = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function getWtTaxPrint() {
    $.ajax({
        url: '/SP/GetLookUpType',
        dataType: 'json',
        type: 'POST',
        data: { type: 1 },
        success: function (data, textStatus, jqXHR) {
            wtTaxPrint = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function getVendorExp() {
    $.ajax({
        url: '/SP/GetLookUpType',
        dataType: 'json',
        type: 'POST',
        data: { type: 2 },
        success: function (data, textStatus, jqXHR) {
            vendorExp = Number(data[0].meaning);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function querySupplier() {
    var deferred = $.Deferred();
    blockPage("正在搜尋供應商...");

    $.ajax({
        url: '/FIIS/GetVendorByFIIS',
        dataType: 'json',
        type: 'POST',
        data: { sourceCode: 'SP', optionInput: optionInput, isSearchAll: false },
        success: function (data, textStatus, jqXHR) {
            supplierResponse = data;
            $('#ResultList').find('tbody').remove();

            if (supplierResponse.supplier.length > 0) {
                renderResult(supplierResponse.supplier);
                $('.pagination').show();
            }
            else {
                $('#ResultList').append($($('#empty_temp_tbody').html()).clone());
                $('.pagination').hide();
            }

            $('#SearchResultArea').show(200)
            $('#VendorSection').hide(200);
            blockPage('');
            deferred.resolve();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#SearchResultArea').hide(200);
            $('#VendorSection').hide(200);
            alert(errorThrown);
            blockPage('');
            deferred.reject();
        }
    });

    return deferred.promise();
}

function renderPaging() {
    $('#totalrow').text(supplierResponse.numberOfRecords);
    $('.pagination').empty();
    var activePage = Number(supplierResponse.offsetNumber / supplierResponse.limitCount);
    var maxPage = Math.ceil(supplierResponse.numberOfRecords / supplierResponse.limitCount);
    for (var currentPage = 0; currentPage < maxPage; currentPage++) {
        if (currentPage + 10 <= activePage) {
            currentPage = currentPage + 9;
            continue;
        }

        if (currentPage + 10 < maxPage) {
            maxPage = currentPage + 10;
        }

        if (currentPage == activePage) {
            $('.pagination').append('<li class="pages active"><a>' + (currentPage + 1) + '</a></li>');
        }
        else {
            $('.pagination').append('<li class="pages"><a>' + (currentPage + 1) + '</a></li>');
        }
    }

    if (activePage != 0) {
        $('.pagination').prepend('<li class="changePaging" id="prevPaging"><a>«</a></li>');
    }

    if (activePage != Math.ceil(supplierResponse.numberOfRecords / supplierResponse.limitCount) - 1) {
        $('.pagination').append('<li class="changePaging" id="nextPaging"><a>»</a></li>');
    }
}

function renderResult(data) {
    var tmp = $('#resultList_temp_tbody').html();

    $.each(data, function (index, element) {
        var tbody = $(tmp).clone();
        var tds = $(tbody).find('td');
        $(tds).eq(0).empty().append(element.supplierName ? element.supplierName : notFound);
        $(tds).eq(1).empty().append(element.supplierNameAlt ? element.supplierNameAlt : notFound);
        $(tds).eq(2).empty().append(element.vatRegistrationNumber ? replaceToAsterisks(element.vatRegistrationNumber, 0.5, true) : notFound);
        $(tds).eq(3).children(':first').attr('id', element.supplierNumber);
        $('#ResultList').append(tbody);
    });
}

function showSupplierInfo(supplier) {
    $('#VendorSection .section-title span').text(supplier.supplierName);
    mainInfo(supplier);
    addressInfo(supplier.supplierSite);
    contactInfo(supplier.supplierContact);
    bankAccountInfo(supplier.supplierBank);
    $('#VendorSection').show(200);
}

function mainInfo(supplier) {
    var mainData = $('.supplierMain');
    $(mainData).eq(0).empty().append(supplier.supplierName); //名稱
    $(mainData).eq(1).empty().append(supplier.supplierNameAlt ? supplier.supplierNameAlt : notFound); //簡稱
    $(mainData).eq(2).empty().append(supplier.supplierNumber); //編號

    $(mainData).eq(3).find('input').prop('checked', false);
    if (supplier.toCardDepartment) {
        $(mainData).eq(3).find('input[value="' + supplier.toCardDepartment + '"]').prop('checked', true); //拋轉卡處
    }

    $(mainData).eq(4).empty().append(getSupplierTypeText(supplier.supplierTypeLookupCode)); //類別
    $(mainData).eq(5).empty().append(supplier.vatRegistrationNumber ? replaceToAsterisks(supplier.vatRegistrationNumber, 0.5, true) : notFound); //統一編號/身分證號
    $(mainData).eq(6).empty().append(supplier.parentCompanyName ? supplier.parentCompanyName : notFound); //母公司名稱
    $(mainData).eq(7).empty().append(supplier.parentCompanyVatNum ? replaceToAsterisks(supplier.parentCompanyVatNum, 0.5, true) : notFound); //母公司統一編號
    $(mainData).eq(8).empty().append(supplier.selfAssessmentFormDate ? convertDateString(new Date(supplier.selfAssessmentFormDate)) : notFound); //供應商企業社會責任自評表提供日
    $(mainData).eq(9).empty().append(supplier.selfAssessmentFormDate ? addYear(new Date(supplier.selfAssessmentFormDate)) : notFound); //供應商企業社會責任自評表到期日
    $(mainData).eq(10).empty().append(supplier.commitmentDocumentDate ? convertDateString(new Date(supplier.commitmentDocumentDate)) : notFound); //人權及環境永續條款承諾書提供日
    $(mainData).eq(11).empty().append(supplier.commitmentDocumentDate ? addYear(new Date(supplier.commitmentDocumentDate)) : notFound); //人權及環境永續條款承諾書到期日

    $('#editMain').attr('onclick', 'clickEditMain(' + supplier.supplierNumber + ')');   //編輯
}

function clickEditMain(supplierNumber) {
    blockPage("檢核中...");
    $.when(checkSigningForms("EditMain", supplierNumber))
        .done(function (result) {
            blockPage("");
            if (result) {
                window.open('/SP/Create?type=EditMain&supplierNumber=' + supplierNumber);
            }
            else {
                alertopen('該供應商尚有其他單據正在進行中，不可編輯供應商主檔');
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            blockPage("");
            alertopen('檢核失敗!');
        });
}

function addressInfo(supplierSite) {
    $('#addressTable').find('thead #AppendDetail a').attr('onclick', 'clickCreateAddress(' + $('#supplierNumber').text() + ')');
    $('#addressTable').find('tbody').remove();
    if (supplierSite && supplierSite.length > 0) {
        var tmp = $('#tabAddress_temp_tbody').html();
        $.each(supplierSite, function (index, element) {
            var tbody = $(tmp).clone();
            var tds = $(tbody).find('tr:even td');
            $(tds).eq(0).append(index + 1);   //編號
            $(tds).eq(1).children(':first').prop('checked', element.activeFlag && element.activeFlag == 'Y' ? true : false);  //生效
            $(tds).eq(2).append(element.supplierSiteCode);   //地址名稱
            $(tds).eq(3).append(element.purchasingSiteFlag == 'Y' && element.paySiteFlag == 'Y' ? '採購/付款' : '僅付款(費用報支)');   //用途
            $(tds).eq(4).append(element.phoneNumber ? replaceToAsterisks(element.phoneNumber, 0.5, true) : notFound);   //主要連絡電話
            $(tds).eq(5).children(':first').append(element.faxNumber ? replaceToAsterisks(element.faxNumber, 0.5, true) : notFound);   //主要傳真電話
            $(tds).eq(5).children(':last').find('a').attr('onclick', 'clickEditAddress(' + $('#supplierNumber').text() + ',this)'); //編輯
            $(tds).eq(6).append(element.country ? showTerritoryText(element.country) : notFound);   //國別

            element.invoiceZipCode = element.invoiceZipCode ? element.invoiceZipCode : '';
            element.invoiceCity = element.invoiceCity ? element.invoiceCity : '';
            element.invoiceAddress = element.invoiceAddress ? element.invoiceAddress : '';
            $(tds).eq(7).append((element.invoiceZipCode + element.invoiceCity + element.invoiceAddress) ? replaceToAsterisks(element.invoiceZipCode + element.invoiceCity + element.invoiceAddress, 0.5, false) : notFound);   //發票戶籍地址

            element.contactZipCode = element.contactZipCode ? element.contactZipCode : '';
            element.contactCity = element.contactCity ? element.contactCity : '';
            element.contactAddress = element.contactAddress ? element.contactAddress : '';
            $(tds).eq(8).append((element.contactZipCode + element.contactCity + element.contactAddress) ? replaceToAsterisks(element.contactZipCode + element.contactCity + element.contactAddress, 0.5, false) : notFound);   //聯絡地址

            $(tds).eq(9).append(element.identityFlag ? showIdentityFlagText(element.identityFlag) : notFound);   //證號別
            $(tds).eq(10).append(element.taxCode ? showWtTaxText(element.taxCode) : notFound);   //代扣稅率代碼
            $(tds).eq(11).append(element.wtTaxPrint ? showWtTaxPrintText(element.wtTaxPrint) : notFound);   //憑單方式
            $(tds).eq(12).append(element.liabilityCodeCombinationCompany + '-' + element.liabilityCodeCombinationAccount + '-' + element.liabilityCodeCombinationDepartment + '-' + element.liabilityCodeCombinationProduct);   //負債科目
            $(tds).eq(13).append(element.prepayCodeCombinationCompany + '-' + element.prepayCodeCombinationAccount + '-' + element.prepayCodeCombinationDepartment + '-' + element.prepayCodeCombinationProduct);   //預付科目
            $(tds).eq(14).append(element.payGroup ? showPayGroupText(element.payGroup) : notFound);   //付款群組
            $(tds).eq(15).append(element.paymentMethodLookupCode ? showPaymentMethodText(element.paymentMethodLookupCode) : notFound);   //付款方式
            $(tds).eq(16).append(element.remitAdviceDeliveryMethod ? showRemitAdviceDeliveryMethodWtTaxPrintText(element.remitAdviceDeliveryMethod) : notFound);   //付款通知方式
            $(tds).eq(17).append(element.remitAdviceEmail ? element.remitAdviceEmail : notFound);   //付款通知郵件地址
            $(tds).eq(18).append(element.paymentReasonCode == '1' ? '內扣' : (element.paymentReasonCode == '2' ? '外加' : notFound));   //匯費
            $(tds).eq(19).append(element.exclusivePaymentFlag == 'Y' ? '是' : (element.exclusivePaymentFlag == 'N' ? '否' : notFound));   //單筆付款
            $(tbody).attr('detailID', element.supplierSiteID);
            $('#addressTable').append(tbody);
        });
    }
    else {
        appendEmptyRow($('#addressTable'));
    }
}

function clickCreateAddress(supplierNumber) {
    blockPage("檢核中...");
    $.when(checkSigningForms("CreateAddress", supplierNumber))
        .done(function (result) {
            blockPage("");
            if (result) {
                window.open('/SP/Create?type=CreateAddress&supplierNumber=' + supplierNumber);
            }
            else {
                alertopen('該供應商尚有其他單據正在進行中，不可編輯地址明細');
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            blockPage("");
            alertopen('檢核失敗!');
        });
}

function clickEditAddress(supplierNumber, DOM) {
    blockPage("檢核中...");
    $.when(checkSigningForms("EditAddress", supplierNumber))
        .done(function (result) {
            blockPage("");
            if (result) {
                clickOpenAddressLevelRemodal(DOM);
            }
            else {
                alertopen('該供應商尚有其他單據正在進行中，不可編輯地址明細');
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            blockPage("");
            alertopen('檢核失敗!');
        });
}

function clickOpenAddressLevelRemodal(DOM) {
    $('[data-remodal-id=address-level-remodal] :checkbox').prop('checked', false);
    addressLevel.SupplierNumber = $('#supplierNumber').text();
    addressLevel.DetailID = $(DOM).parents('tbody').attr('detailID');
    addressLevel.Level = 0;
    $('div[data-remodal-id=address-level-remodal]').remodal().open();
}

function clickLevelConfirm() {
    var v1 = $('#level_1').prop('checked') ? '1' : '0';
    var v2 = $('#level_2').prop('checked') ? '1' : '0';
    var v3 = $('#level_3').prop('checked') ? '1' : '0';
    addressLevel.Level = parseInt(v1 + v2 + v3, 2);
    if (addressLevel.Level != 0) {
        $('div[data-remodal-id=address-level-remodal]').remodal().close();
        window.open('/SP/Create?type=EditAddress&supplierNumber=' + addressLevel.SupplierNumber + '&detailID=' + addressLevel.DetailID + '&siteEditGroup=' + addressLevel.Level);
    }
    else {
        alert('需至少選擇一列進行地址明細編輯!');
    }
}

function contactInfo(supplierContact) {
    $('#contactTable').find('thead a').attr('onclick', 'clickCreateContact(' + $('#supplierNumber').text() + ')');
    $('#contactTable').find('tbody').remove();
    if (supplierContact && supplierContact.length > 0) {
        var tmp = $('#tabContact_temp_tbody').html();
        $.each(supplierContact, function (index, element) {
            var tbody = $(tmp).clone();
            var tds = $(tbody).find('td');
            $(tds).eq(0).append(index + 1);    //編號
            $(tds).eq(1).children(':first').prop('checked', element.activeFlag && element.activeFlag == 'Y' ? true : false);  //生效
            $(tds).eq(2).append(element.supplierContactLastName ? element.supplierContactLastName : notFound);  //姓氏
            $(tds).eq(3).append(element.supplierContactFirstName ? element.supplierContactFirstName : notFound);    //名字
            $(tds).eq(4).append(element.supplierContactPhone ? replaceToAsterisks(element.supplierContactPhone, 0.5, true) : notFound);    //電話
            $(tds).eq(5).append(element.supplierContactEmail ? element.supplierContactEmail : notFound);    //電子郵件
            $(tds).eq(6).children(':first').append(element.contactDescription ? element.contactDescription : notFound);    //聯絡人備註
            $(tds).eq(6).children(':last').find('a').attr('onclick', 'clickEditContact(' + $('#supplierNumber').text() + ',' + element.supplierContactID + ')');   //編輯
            $('#contactTable').append(tbody);
        });
    }
    else {
        appendEmptyRow($('#contactTable'));
    }
}

function clickCreateContact(supplierNumber) {
    blockPage("檢核中...");
    $.when(checkSigningForms("CreateContact", supplierNumber))
        .done(function (result) {
            blockPage("");
            if (result) {
                window.open('/SP/Create?type=CreateContact&supplierNumber=' + supplierNumber);
            }
            else {
                alertopen('該供應商尚有其他單據正在進行中，不可編輯聯絡人明細');
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            blockPage("");
            alertopen('檢核失敗!');
        });
}

function clickEditContact(supplierNumber, detailID) {
    blockPage("檢核中...");
    $.when(checkSigningForms("EditContact", supplierNumber))
        .done(function (result) {
            blockPage("");
            if (result) {
                window.open('/SP/Create?type=EditContact&supplierNumber=' + supplierNumber + '&detailID=' + detailID);
            }
            else {
                alertopen('該供應商尚有其他單據正在進行中，不可編輯聯絡人明細');
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            blockPage("");
            alertopen('檢核失敗!');
        });
}

function bankAccountInfo(supplierBank) {
    $('#bankAccountTable').find('thead #AppendDetail a').attr('onclick', 'clickCreateBankAccount(' + $('#supplierNumber').text() + ')');
    $('#bankAccountTable').find('tbody').remove();
    var tmp = $('#tabBankAccount_temp_tbody').html();

    if (supplierBank && supplierBank.length > 0) {
        $.each(supplierBank, function (index, element) {
            var tbody = $(tmp).clone();
            var tds = $(tbody).find('tr:even td');
            $(tds).eq(0).append(index + 1);    //編號
            $(tds).eq(1).children(':first').prop('checked', element.activeFlag && element.activeFlag == 'Y' ? true : false);  //生效
            $(tds).eq(2).append(element.homeCountry ? showTerritoryText(element.homeCountry) : notFound);  //國別
            $(tds).eq(3).append(element.bankName ? element.bankName : notFound);  //銀行名稱
            $(tds).eq(4).append(element.bankBranchName ? element.bankBranchName : notFound);    //分行名稱
            $(tds).eq(5).children(':first').append(element.eftSwiftCode ? element.eftSwiftCode : notFound);    //SWIFT Code
            $(tds).eq(5).children(':last').find('a').attr('onclick', 'clickEditBankAccount(' + $('#supplierNumber').text() + ',' + element.extBankAccountId + ')');   //編輯
            $(tds).eq(6).append(element.bankAccountName ? element.bankAccountName : notFound);    //戶名
            $(tds).eq(7).append(element.bankAccountNumber ? replaceToAsterisks(element.bankAccountNumber, 0.5, true) : notFound);    //帳號
            $(tds).eq(8).append(element.remitanceCheckCode ? element.remitanceCheckCode : notFound);    //匯款檢查代碼
            $(tds).eq(9).append(element.bankAccountNumRemark ? element.bankAccountNumRemark : notFound);    //帳號備註
            $('#bankAccountTable').append(tbody);
        });
    }
    else {
        appendEmptyRow($('#bankAccountTable'));
    }
}

function clickCreateBankAccount(supplierNumber) {
    blockPage("檢核中...");
    $.when(checkSigningForms("CreateBankAccount", supplierNumber))
        .done(function (result) {
            blockPage("");
            if (result) {
                window.open('/SP/Create?type=CreateBankAccount&supplierNumber=' + supplierNumber);
            }
            else {
                alertopen('該供應商尚有其他單據正在進行中，不可編輯銀行帳號明細');
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            blockPage("");
            alertopen('檢核失敗!');
        });
}

function clickEditBankAccount(supplierNumber, detailID) {
    blockPage("檢核中...");
    $.when(checkSigningForms("EditBankAccount", supplierNumber))
        .done(function (result) {
            blockPage("");
            if (result) {
                window.open('/SP/Create?type=EditBankAccount&supplierNumber=' + supplierNumber + '&detailID=' + detailID);
            }
            else {
                alertopen('該供應商尚有其他單據正在進行中，不可編輯銀行帳號明細');
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            blockPage("");
            alertopen('檢核失敗!');
        });
}

function checkSigningForms(type, supplierNumber) {
    return $.ajax({
        url: '/SP/CheckSigningForms',
        dataType: 'json',
        type: 'POST',
        data: { type: type, supplierNumber: supplierNumber }
    });
}

function appendEmptyRow(table) {
    $(table).append($($('#empty_temp_tbody').html()).clone());
}

function showIdentityFlagText(identityFlag) {
    if (identity) {
        var find = identity.find(function (item, index, array) { return item.identityTypeCode == identityFlag });
        if (find) {
            return identityFlag + ' - ' + find.description;
        }
        else {
            return notFound;
        }
    }
    else {
        return '';
    }
}

function showWtTaxText(taxCode) {
    if (wtTax) {
        var find = wtTax.find(function (item, index, array) { return item.wtTaxCode == taxCode });
        if (find) {
            return taxCode + ' - ' + find.wtTaxtCodeDescription;
        }
        else {
            return notFound;
        }
    }
    else {
        return '';
    }
}

function showPaymentMethodText(paymentMethodLookupCode) {
    if (paymentMethod) {
        var find = paymentMethod.find(function (item, index, array) { return item.paymentMethod == paymentMethodLookupCode });
        if (find) {
            return find.paymentMethodDescription;
        }
        else {
            return notFound;
        }
    }
    else {
        return '';
    }
}

function showTerritoryText(country) {
    if (territory) {
        var find = territory.find(function (item, index, array) { return item.territoryCode == country });
        if (find) {
            return find.description;
        }
        else {
            return notFound;
        }
    }
    else {
        return '';
    }
}

function showWtTaxPrintText(wtTaxPrintCode) {
    if (getWtTaxPrint) {
        var find = wtTaxPrint.find(function (item, index, array) { return item.code == wtTaxPrintCode });
        if (find) {
            return wtTaxPrintCode + ' - ' + find.description;
        }
        else {
            return notFound;
        }
    }
    else {
        return '';
    }
}

function showPayGroupText(payGroupCode) {
    if (payGroup) {
        var find = payGroup.find(function (item, index, array) { return item.code == payGroupCode });
        if (find) {
            return find.description;
        }
        else {
            return notFound;
        }
    }
    else {
        return '';
    }
}

function showRemitAdviceDeliveryMethodWtTaxPrintText(remitAdviceDeliveryMethod) {
    switch (remitAdviceDeliveryMethod) {
        case 'EMAIL':
            return 'E-mail';
        case 'FAX':
            return '傳真';
        default:
            return notFound;
    }
}

function getSupplierTypeText(typeCode) {
    switch (typeCode) {
        case 'VENDOR':
            return '一般廠商';
        case 'SPECIFIC':
            return '特定用途專戶-固定';
        case 'SPECIFIC_NF':
            return '特定用途專戶-非固定';
        default:
            return notFound;
    }
}

function convertDateString(date) {
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

function addYear(date) {
    var dateYear = date.getFullYear();
    var dateMonth = date.getMonth();
    var dateDay = date.getDate();

    return convertDateString(new Date(dateYear + vendorExp, dateMonth, dateDay));
}

function changePageSize() {
    $('#SearchVendor').trigger('click');
}

function replaceToAsterisks(text, percentage, isLeftpad) {
    /// <summary>機敏文字遮罩</summary>
    /// <param name="text" type="string">未遮罩前文字</param>
    /// <param name="percentage" type="number">遮罩百分比浮點數</param>
    /// <param name="isLeftpad" type="boolean">true:遮前，false:遮後</param>

    var length = Math.round(text.length * percentage);
    if (isLeftpad) {
        return text.substring(0, length).replace(/./g, "*") + text.substring(length);
    }
    else {
        return text.substring(0, length) + text.substring(length).replace(/./g, "*");
    }
}