$(function () {
    $('#ExchangeRateInput').on('change', function () {
        $('.moneyfield').val(0).text(0);
    })
    $('#Currency').on('change', function () {
        $('.moneyfield').val(0).text(0);
        switch ($(this).val()) {
            case "USD":
                $('#CurrencyAcc').text("2");
                $('#CurrencyAccInput').val(2);
                $('#ExchangeRate').attr('style', 'display:none');
                $('#ExchangeRateInput').val(30.28);
                $('#ExchangeRateInput').attr('style', 'display:block');
                break;
            case "JPY":
                $('#CurrencyAcc').text("4");
                $('#CurrencyAccInput').val(4);
                $('#ExchangeRate').attr('style', 'display:none');
                $('#ExchangeRateInput').val(0.2687);
                $('#ExchangeRateInput').attr('style', 'display:block');
                break;
            case "EUR":
                $('#CurrencyAcc').text("2");
                $('#CurrencyAccInput').val(2);
                $('#ExchangeRate').attr('style', 'display:none');
                $('#ExchangeRateInput').val(35.87);
                $('#ExchangeRateInput').attr('style', 'display:block');
                break;
            case "GBP":
                $('#CurrencyAcc').text("2");
                $('#CurrencyAccInput').val(2);
                $('#ExchangeRate').attr('style', 'display:none');
                $('#ExchangeRateInput').val(39.89);
                $('#ExchangeRateInput').attr('style', 'display:block');
                break;
            case "CNY":
                $('#CurrencyAcc').text("2");
                $('#CurrencyAccInput').val(2);
                $('#ExchangeRate').attr('style', 'display:none');
                $('#ExchangeRateInput').val(4.59);
                $('#ExchangeRateInput').attr('style', 'display:block');
                break;
            case "NTD":
                $('#CurrencyAcc').text("1");
                $('#CurrencyAccInput').val(1);
                $('#ExchangeRate').text("1");
                $('#ExchangeRate').attr('style', 'display:block');
                $('#ExchangeRateInput').val(1);
                $('#ExchangeRateInput').attr('style', 'display:none');

                break;
            default:
                break;
        }
    });

});