//載入請購明細
function openModalDetail() {
    $('[data-remodal-id=modal-detail]').remodal().open();

    var checkBox = $('#searchResult input:checkbox');
    $.each(checkBox, function (index, item) {
        $(item).attr('checked', false);
    });
}

//清除搜尋內容
function clearSearchCondition() {
    $('#prNoDrop').val('');
    $('#prNoDrop').selectpicker('refresh');
    $('#bpaNoDrop').val('');
    $('#bpaNoDrop').selectpicker('refresh');
    $('#purchasePICDrop').val('');
    $('#purchasePICDrop').selectpicker('refresh');
    $('#itemDescribe').val('');
    $('#searchResult').attr('style', 'display:none');
}

//搜尋判斷
function searchBtn() {
    var prNo = $('#prNoDrop').val();
    var bpaNo = $('#bpaNoDrop').val();
    var purchasePIC = $('#purchasePICDrop').val();
    var describe = $('#itemDescribe').val();
    if (!isNullOrEmpty(prNo) || !isNullOrEmpty(bpaNo) || !isNullOrEmpty(purchasePIC) || !isNullOrEmpty(describe)) {
        $('#searchResult').attr('style', 'display:block');
    }
    else {
        alert("請至少選擇一項條件")
    }
}

function isNullOrEmpty(s) {
    return (s == null || s == "");
}

//重新計算總金額
function countTotalAmount() {
    var detailTr = $('#bpaDetail tbody tr');
    if (detailTr.length > 0) {
        $.each(detailTr, function (index, item) {
            var amount = $(item).find('.amount').val();
            var perPrice = $(item).find('.perPrice').text();
            var totalPrice = parseInt(amount) * parseInt(perPrice);
            $(item).find('.totalPrice').text(totalPrice);
            if (index == 0) {
                $('#totalAmount').text(totalPrice);
            }
            else {
                $('#totalAmount').text(parseInt(parseInt($('#totalAmount').text()) + totalPrice));
            }
        })
    } else {
        $('#totalAmount').text('0');
    }
}

//年度議價明細資訊
function appendDetail() {
    //先清空年度議價明細資訊
    $('#bpaDetail tbody').remove();

    //將核選的明細帶入BPR表單中議價明細
    var n = $('input.contractDetail:checked').parents('li');
    var a = [];
    if (n.length > 0) {
        $.each(n, function (index, item) {
            var temp = $(item).find('div');
            a.push({
                purchaseClass: $(temp[3]).text(),
                productName: $(temp[4]).text(),
                amount: $(temp[5]).text(),
                unit: $(temp[6]).text(),
                currency: $(temp[7]).text(),
                perPrice: $(temp[8]).text(),
                suspendUnit: $(temp[9]).text(),
                receiveUnit: $(temp[10]).text(),
            })
        });

        $.each(a, function (index, item) {
            $('#bpaDetail').append(
                    '<tr>\
                        <td>' + (index + 1) + '</td>\
                        <td>1</td>\
                        <td>' + item.purchaseClass + '</td>\
                        <td>' + item.productName + '</td>\
                        <td>' + item.suspendUnit + '</td>\
                        <td>' + item.receiveUnit + '</td>\
                        <td>' + item.unit + '</td>\
                        <td><input type="text" class="input amount" placeholder="數量" value=\"' + item.amount + '\"></td>\
                        <td class="perPrice">' + item.perPrice + '</td>\
                        <td class="totalPrice">' + item.amount * item.perPrice + '</td>\
                        <td>' + $('#modal-prNo').val() + '</td>\
                        <td><div class="icon-cross icon-remove-size"></div></td>\
                    </tr>'
             );
            if (index == 0) {
                $('#totalAmount').text(item.amount * item.perPrice);
            } else {
                $('#totalAmount').text(parseInt(parseInt($('#totalAmount').text()) + (item.amount * item.perPrice)));
            }
        })

        $('#bpaDetail .selectpicker').selectpicker('refresh');
        $('#bpaDetailBlock').attr('style', 'display:block');

        //將共通資訊隱藏欄位資料引入表格
        $('#bpaNo').text($('#modal-bpaNo').val());
        $('#times').text($('#modal-times').val());
        $('#vendorContactPerson').val($('#modal-vendorContactPerson').val());
        $('#vendorMail').val($('#modal-vendorMail').val());
        $('#purchasePIC').text($('#modal-purchasePIC').val());
        $('#invoice .Links').attr('style', 'display:block');
        $('#invoice .Links-peo span').text($('#modal-invoice').val());
        $('#invoice .no-file-text').hide();
        $('#currency').text($('#modal-currency').val());
        $('#exchangeRate').text($('#modal-exchangeRate').val());
    }
    else {
        alert("至少選擇一個明細");
    }
}

$(function () {
    $('.invalid').click(function () {
        var removeAppend = $(this).parents('li').find('.unvalid');
        removeAppend.remove();
        var invalidAppend = $(this).closest('li');

        invalidAppend.append(
             '<label class="w100 label-box unvalid ">\
                    <div class="w80" style="margin:auto">\
                        <textarea class="tt" placeholder="輸入內容"></textarea>\
                        <div class="col-sm-12"><span style="color:red;">*此作廢為永久性作廢，無法取消作廢，請確認後執行</span></div>\
                        <div class="col-sm-12">\
                            <div class="popup-btn-row" style="margin-left: 30%;">\
                            <a  class="remodal-cancel-btn w20 cancelInvaild">取消</a>\
                            <a  class="remodal-confirm-btn w20 confirmInvaild">確定</a>\
                            </div>\
                        </div>\
                    </div>\
                 </label> '
            )
    });

    $(document).on('click', '.cancelInvaild', function () {
        var removeAppend = $(this).parents('li').find('.unvalid');
        removeAppend.remove();
    });

    $(document).on('click', '.confirmInvaild', function () {
        var removeAppend = $(this).parents('li');
        removeAppend.remove();
    });
});

$(function () {
    //刪除明細列, 重新計算總金額
    $(document).on('click', '.icon-cross', function () {
        var check = confirm('請確認是否刪除？');
        if (check == true) {
            var tr = $(this).closest('tr');
            tr.remove();
            $('#bpaDetail').find('tr').find('td:first').each(function (index) {
                $(this).text(index + 1);
            });
        }
        countTotalAmount();
    });
    //更改數量後重新計算總金額
    $(document).on('change', '.amount', function () {
        countTotalAmount();
    });
});