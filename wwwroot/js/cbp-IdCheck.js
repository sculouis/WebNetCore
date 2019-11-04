function IdCardNumberCheck(id) {
    var city = new Array(1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11, 20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30);
    id = id.toUpperCase();
    // 使用「正規表達式」檢驗格式
    if (!id.match(/^[A-Z]\d{9}$/) && !id.match(/^[A-Z][A-D]\d{8}$/)) {
        document.getElementById("PointMsg").innerHTML = "<span style='color:red; font-style:italic'>請輸入正確身分證字號格式</span>";
        document.getElementById("IdCardText").value = "";
    }
    else {
        var total = 0;
        if (id.match(/^[A-Z]\d{9}$/)) { //身分證字號
            //將字串分割為陣列(IE必需這麼做才不會出錯)
            id = id.split('');
            //計算總分
            total = city[id[0].charCodeAt(0) - 65];
            for (var i = 1; i <= 8; i++) {
                total += eval(id[i]) * (9 - i);
            }
        } else { // 外來人口統一證號
            //將字串分割為陣列(IE必需這麼做才不會出錯)
            id = id.split('');
            //計算總分
            total = city[id[0].charCodeAt(0) - 65];
            // 外來人口的第2碼為英文A-D(10~13)，這裡把他轉為區碼並取個位數，之後就可以像一般身分證的計算方式一樣了。
            id[1] = id[1].charCodeAt(0) - 65;
            for (var i = 1; i <= 8; i++) {
                total += eval(id[i]) * (9 - i);
            }
        }
        //補上檢查碼(最後一碼)
        total += eval(id[9]);
        //檢查比對碼(餘數應為0);
        if (total % 10 == 0) {
            document.getElementById("PointMsg").innerHTML = "<span style='color:red; font-style:italic'></span>";
        }
        else {
            document.getElementById("PointMsg").innerHTML = "<span style='color:red; font-style:italic'>驗證錯誤，請輸入正確的身分證字號</span>";
            document.getElementById("IdCardText").value = "";
        }
    }
}

function IdTaxNumberCheck() {
    var invalidList = "00000000,11111111";
    if (/^\d{8}$/.test(id) == false || invalidList.indexOf(id) != -1) {
        document.getElementById("PointMsg").innerHTML = "<span style='color:red; font-style:italic'>請輸入正確統一編號格式</span>";
        document.getElementById("IdTaxText").value = "";
    }

    var validateOperator = [1, 2, 1, 2, 1, 2, 4, 1],
        sum = 0,
        calculate = function (product) { // 個位數 + 十位數
            var ones = product % 10,
                tens = (product - ones) / 10;
            return ones + tens;
        };
    for (var i = 0; i < validateOperator.length; i++) {
        sum += calculate(id[i] * validateOperator[i]);
    }

    if (sum % 10 == 0 || (id[6] == "7" && (sum + 1) % 10 == 0)) {
        document.getElementById("PointMsg").innerHTML = "<span style='color:red; font-style:italic'></span>";
    } else {
        document.getElementById("PointMsg").innerHTML = "<span style='color:red; font-style:italic'>驗證失敗，請輸入正確統一編號格式</span>";
        document.getElementById("IdTaxText").value = "";
    }
}