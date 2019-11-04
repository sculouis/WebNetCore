$(suppliesTemplate());

function suppliesTemplate() {
    $('body').append(
    '<div class="remodal" data-remodal-id="SelectAccount" role="dialog" aria-labelledby="SelectAccountTitle" aria-describedby="SelectAccountDesc">'+
    '<button data-remodal-action="close" class="remodal-close" aria-label="Close"></button>'+
    '<div class="col-sm-12"><span id="SelectAccountTitle" class="popup-title-center">機房編號</span></div>'+
    '<div class="popup-box">'+
        '<div class="col-sm-12 text-left border">'+
            '<div class="col-sm-12">'+
                '<div class="popup-tr-title">'+
                    '<ul class="w100">'+
                        '<li>'+
                            '<label class="w100 label-box">'+
                                '<div class="table-box w30">帳號說明</div>'+
								'<div class="table-box w10">匯費</div>'+
                                '<div class="table-box w10">收款銀行</div>'+
								'<div class="table-box w20">收款分行</div>'+
                                '<div class="table-box w10">收款戶名</div>'+
								'<div class="table-box w20">收款帳號</div>'+
                            '</label>' +
                    '</ul>' +
                '</div>' +
                '<div class="popup-tbody h160 overflow-auto">' +
                    '<ul class="w100">' +
                        '<li>' +
                            '<label class="w100 label-box">' +
                                '<div class="table-box w30 accountDescription"><input name="AccountGroup" type="radio">說明一</div>' +
                                '<div class="table-box w10 remittanceFee">內扣</div>' +
                                '<div class="table-box w10 paymentBank">玉山</div>' +
                                '<div class="table-box w20 paymentBranch">民生東分行</div>' +
                                '<div class="table-box w10 paymentAccountName">黃玉山</div>' +
                                '<div class="table-box w20 paymentAccount">12345678901234</div>' +
                            '</label>' +
                        '</li>' +
                        '<li>' +
                            '<label class="w100 label-box">' +
                                '<div class="table-box w30 accountDescription"><input name="AccountGroup" type="radio">說明二</div>' +
                                '<div class="table-box w10 remittanceFee">內扣</div>' +
                                '<div class="table-box w10 paymentBank">富邦</div>' +
                                '<div class="table-box w20 paymentBranch">復興分行</div>' +
                                '<div class="table-box w10 paymentAccountName">王富邦</div>' +
                                '<div class="table-box w20 paymentAccount">23456789012345</div>' +
                            '</label>' +
                        '</li>' +
                        '<li>' +
                            '<label class="w100 label-box">' +
                                '<div class="table-box w30 accountDescription"><input name="AccountGroup" type="radio">說明三</div>' +
                                '<div class="table-box w10 remittanceFee">外加</div>' +
                                '<div class="table-box w10 paymentBank">國泰</div>' +
                                '<div class="table-box w20 paymentBranch">忠孝分行</div>' +
                                '<div class="table-box w10 paymentAccountName">陳國泰</div>' +
                                '<div class="table-box w20 paymentAccount">34567890123456</div>' +
                            '</label>' +
                        '</li>' +
                    '</ul>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div><!--box-->' +
    '<div class="col-sm-12">' +
        '<div class="popup-btn-row">' +
            '<a data-remodal-action="cancel" class="remodal-cancel-btn">取消</a>' +
            '<a data-remodal-action="confirm" class="remodal-confirm-btn" id="accountConfirm">帶入</a>' +
        '</div>' +
    '</div>' +
    '</div>'
)
}