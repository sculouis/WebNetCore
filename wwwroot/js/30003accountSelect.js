$(function () {

    $('#AccountOpen').on('click', function () {
        $('[data-remodal-id=SelectAccount]').remodal().open();
    });
    $('#accountConfirm').on('click', function () {
        var selectTarget = $('input[name="AccountGroup"]:checked')
        $('#accountDescription').text($(selectTarget).parents('label').find('.accountDescription').text());
        $('#remittanceFee').text($(selectTarget).parents('label').find('.remittanceFee').text());
        $('#paymentBank').text($(selectTarget).parents('label').find('.paymentBank').text());
        $('#paymentBranch').text($(selectTarget).parents('label').find('.paymentBranch').text());
        $('#paymentAccount').text($(selectTarget).parents('label').find('.paymentAccount').text());
        $('#paymentAccountName').text($(selectTarget).parents('label').find('.paymentAccountName').text());

    })
});