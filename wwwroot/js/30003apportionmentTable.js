$(function () {
    $('#apportionmentTable .apportionmentDetail').attr('style', 'display:none');
    $('#apportionmentTable .icon-arrow-up').attr('class', 'icon-arrow-down bt-icon-size-1');
    $(document).on('change', '.apportionmentOriginDollarInput', function () {
        if ($(this).val() == "") {
            $(this).val(0);
        }
        var OriginDollarRegular = $(this).val().split('.')[1];

        if (OriginDollarRegular == undefined || OriginDollarRegular.length != $(CurrencyPrecisionDisable).text()) {
            if (!(OriginDollarRegular == undefined && $(CurrencyPrecisionDisable).text() != 1)) {
                $(this).val(0);
                alertopen("小數位數不符合幣別精確度長度")
            }
        }

        $(this).parents('tr').find('.apportionmentNTDollar').removeClass('undone-text').text(Math.round($(this).val() * $('#ExchangeRateInput').val()));
        var totalOriginDollar = 0, totalNTDollar = 0;
        //$.each($('.apportionmentOriginDollarInput'), function (index, item) {
        //    totalOriginDollar = totalOriginDollar + parseFloat($(item).val());
        //    totalNTDollar = totalNTDollar + parseInt($(item).parents('tr').find('.apportionmentNTDollar').text());
        //    $('#totalOriginDollar').text(accounting.formatNumber(totalOriginDollar));
        //    $('#totalNTDollar').text(accounting.formatNumber(totalNTDollar));
        //    $('#PaymentTWD').text($('#totalNTDollar').text());  //更新付款金額(臺幣TWD)                        
        //});
        debugger

        $('#apportionmentOriginDollarInput').val(accounting.formatNumber($('#apportionmentOriginDollarInput').val()));
        $('#apportionmentNTDollar').val(accounting.formatNumber(($('#apportionmentOriginDollarInput').val())));
        $('#apportionmentNTDollar').text(accounting.formatNumber(($('#apportionmentOriginDollarInput').val())));

        //$('#PaymentTWD').text(accounting.formatNumber($('#apportionmentOriginDollarInput').val()));
        $('#PaymentTWD').text(accounting.formatNumber($('#TotalPrepaymentsInput').val()));
        $('#totalOriginDollar').text(accounting.formatNumber($('#apportionmentOriginDollarInput').val()));
        $('#totalNTDollar').text(accounting.formatNumber($('#apportionmentOriginDollarInput').val()));
    })
});
function expandDetail(target) {
    if ($(target).find('.icon-arrow-up').length > 0) {
        $(target).parents('tbody').find('.apportionmentDetail').hide(200);
        $(target).find('.icon-arrow-up').toggleClass('icon-arrow-up icon-arrow-down');
    } else {
        $(target).parents('tbody').find('.apportionmentDetail').show(200);
        $(target).find('.icon-arrow-down').toggleClass('icon-arrow-down icon-arrow-up');
    }
}

function appendApportionment() {
    var count = $('.apportionmentCount').length;
    $('#apportionmentTable').append(
        '<tbody>' +
        '<tr>' +
        '<td class="w5"><div class="p-right5 btn-01-add" onclick="expandDetail(this)"><a><div class="icon-arrow-down bt-icon-size-1"></div></a></div></td>' +
        '<td class="apportionmentCount">' + apportionmentCountPaddingLeft(count + 1) + '</td>' +
        '<td>C105</td>' +
        '<td>'+
        '<select id="AccountingItemName" class="selectpicker show-tick form-control select-h30 AccountingItemNameDisableText" title="請選擇" data-live-search="true">' +
        '<option>0313011電腦</option>' +
        '<option>180313011機械及電腦設備－電腦設備</option>' +
        '<option>9563011機械設備</option>' +
        '</select>' +
        '</td>' +
        '<td>' +
        '<select id="ProfitCostCenter" class="selectpicker show-tick form-control select-h30 ProfitCostCenterDisableText" title="請先選擇此項目" data-live-search="true">' +
        '<option selected>C105</option>' +
        '</select>' +
        '</td>' +
        '<td>' +
        '<select id="ProductCategory" class="selectpicker show-tick form-control select-h30" title="請選擇" data-live-search="true">' +
        '<option>產品別1</option>' +
        '<option>產品別2</option>' +
        '</select>' +
        '</td>' +
        '<td>' +
        '<select id="ProductDetail" class="selectpicker show-tick form-control select-h30" title="請選擇" data-live-search="true">' +
        '<option>產品明細1</option>' +
        '<option>產品明細2</option>' +
        ' </select></td>' +
        '<td><div class="icon-cross icon-remove-size" onclick="removeApportionment(this)"></div></td>' +
        '</tr>' +
        '<tr class="apportionmentDetail" style="display:none">' +
        '<th class="th-title-1"></th>' +
        '<th class="th-title-1" colspan="2">費用性質</th>' +
        '<th class="th-title-1" colspan="2">分攤金額(原幣)</th>' +
        '<th class="th-title-1">分攤金額(臺幣)</th>' +
        '<th class="th-title-1"><span class="VoucherAbstract" style="display:none">傳票摘要</span></th>' +
        '<th class="th-title-1"></th>' +
        '</tr>' +
        '<tr class="apportionmentDetail" style="display:none">' +
        '<td></td>' +
        '<td colspan="2">' +
        '<select id="PaymentCategory" class="selectpicker show-tick form-control select-h30" title="請選擇" data-live-search="true">' +
        '<option selected>B.卡片活動：銀行卡</option>' +
        '<option selected>B.卡片活動：電子票證</option>' +
        '<option selected>B.卡片活動：聯名卡</option>' +
        '<option selected>C.卡片回饋：銀行卡</option>' +
        '<option selected>C.卡片回饋：電子票證</option>' +
        '<option selected>C.卡片回饋：聯名卡</option>' +
        '<option selected>H.公益支出：卡片</option>' +
        '<option selected>H.公益支出：其他</option>' +
        '</select>' +
        '</td>' +
        '<td colspan="2">' +
        '<input class="input h30 apportionmentOriginDollar apportionmentOriginDollarInput moneyfield" type="number" value="0" placeholder="填寫內容">' +
        '<span class="moneyfield apportionmentOriginDollarText" style="display:none">0</span>' +
        '</td>' +
        '<td colspan="1">' +
        '<span class="apportionmentNTDollar moneyfield">0</span>' +
        '</td>' +
        '<td colspan="1">' +
        '<input class="input h30 VoucherAbstract" type="text" style="display:none" placeholder="填寫內容">' +
        '</td>' +
        '<td colspan="2"></td>' +
        '</tr>' +
        '</tbody>'
        );
    $('.selectpicker').selectpicker();
}
function removeApportionment(target) {
    $(target).parents('tbody').remove();
    $.each($('.apportionmentCount'), function (index, item) {
        $(item).text(apportionmentCountPaddingLeft(index + 1));
    });
}
function apportionmentCountPaddingLeft(count) {
    if (count.length >= 4) {
        return count;
    }
    else {
        return apportionmentCountPaddingLeft("0" + count);
    }
}
