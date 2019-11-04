//等待頁面可輸入等待訊息
function blockReportPage(UImessage) {
    if (UImessage == "") {
        _blockstatus = false;
        $.unblockUI();
    } else {
        _blockstatus = true
        $.blockUI({ message: UImessage });
    }
}

function Query() {
        blockReportPage('資料讀取中...')
        var url = "/Report/PartialVoucherData"
        var queryData = { DepId: $("#DepId").val(), Gldate: $("#GlDate").val() }
        //var queryData = { DepId: '86517510', Gldate: '2018-08-08' }
    //取得已入帳傳票明細資料
            $("#VDetail").load(url, queryData , function (responseTxt, statusTxt, xhr) {
                blockReportPage('')
                if (statusTxt == "success") {
                    $('#VoucherData').show();
                    if ($("#NoDataGlDate").is(":visible") === true) {
                        $('#NoDataGlDate').text($("#GlDate").val());
                    }
                }
                if (statusTxt == "error")
                    alertopen("Error: " + xhr.status + ": " + xhr.statusText);
            });
}

function alertopen(text) {
    $('#alertOK').unbind();
    if (typeof (text) != typeof ([])) {
        $('#alertText').text(text);
        $('[data-remodal-id=alert-modal]').remodal().open();
    }
    else {
        if (_alerttext.length < 1) {
            return;
        }
        $('#alertText').text(_alerttext[0]);
        if (_alerttext.length > 0) {
            _alerttext = _alerttext.slice(1, _alerttext.length);
        }
        $('[data-remodal-id=alert-modal]').remodal().open();
        $('#alertOK').on('click', alertopen);
    }
}

//日期格式設定yyyy/MM/dd hh:mm:ss AMPM
function formatDate(dateVal) {
    var newDate = new Date(dateVal);
    var sMonth = padValue(newDate.getMonth() + 1);
    var sDay = padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = padValue(newDate.getHours());
    var sMinute = padValue(newDate.getMinutes());
    var sSecond = padValue(newDate.getSeconds());
    var sAMPM = "AM";
    var iHourCheck = parseInt(sHour);
    if (iHourCheck > 12) {
        sAMPM = "PM";
        sHour = iHourCheck - 12;
    }
    else if (iHourCheck === 0) {
        sHour = "12";
    }
    sHour = padValue(sHour);
    return sYear + "/" + sMonth + "/" + sDay + " " +  + sHour + ":" + sMinute + ":" + sSecond + " " + sAMPM;
}

function padValue(value) {
    return (value < 10) ? "0" + value : value;
}

//報表表頭
function reportHeader() {
    var bankName = "<h2 style='text-align: center;'>玉山銀行</h2>"
    var ReportName = "<h3 style='text-align: center;'>已入帳傳票-請款明細表</h3>"

    //取得登入的相關資訊
    var loginMember = getLoginModel()
    var VoucherBeaus = "";
    if ($("#VoucherBeaus").find("option:selected").text() !== "請選擇") {
        VoucherBeaus = $("#VoucherBeaus").find("option:selected").text()
    }
    var printInfo = "<table class='tableTitle'>" +
    "<tr align='right'>" +
    "<td colspan='2'>列印人員:" + getVoucherUnitName() + " " + loginMember.EmpID + "-" + loginMember.EmpName + "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>憑證開立對象:" + VoucherBeaus  + "</td>" +
    "<td align='right'>列印時間:" + formatDate(Date()) + "</td>" +
    "</tr></table>"
    return bankName +ReportName +printInfo
}

//報表的css
function reportStyle() {
    var content = "<style>" +
    "table {" +
    "border-collapse: collapse;" +
    "}" +
    ".table {" +
        "border: 1px solid black;" +
        "text-align: left;" +
        "text-align: left;" +
        "width:100%;" +
    "}" +
    ".tableTitle {" +
        "border: 0px;" +
        "width:100%;" +
    "}" +
    ".thb,.tdb {" +
        "border: 1px solid black;font-size:small" +
    "}" +
    "</style>"
    return content
}

//報表表身
function reportBody(divID) {
    var content = "<table class='table'>"
    //table表頭部分
    content += "<thead>"
    content += "<tr align='left'>"
    $("#" +divID).find("table").find("thead").find("th").each(function () {
        content += "<th class='thb'>"
        content += $(this).text()
        //console.log($(this).text())
        content += "</th>"
        }
    )
    content += "</tr>"
    content += "</thead>"

        //table表身部分
        content += "<tbody>"
    $("#" +divID).find("table").find("tbody").find("tr").each(function () {
        if ($(this).find("td").length > 1) {  //有資料
            if ($(this).find("td").length === 2) {
                //查無資料的處理
                content += "<tr align='left'>"
                content += "<td class='tdb'>"
                content += $(this).find("td:eq(0)").text()
                content += "</td>"
                content += "<td class='tdb' colspan='5' align='center'>"
                content += $(this).find("td:eq(1)").text()
                content += "</td>"

            }else{
                content += "<tr align='left'>"
                $(this).find("td").each(function () {
                    content += "<td class='tdb'>"
                    content += $(this).text()
                    //console.log($(this).text())
                    content += "</td>"
                })
            }
        } else { //無資料
            content += "<tr align='center'>"
            $(this).find("td").each(function () {
                content += "<td style='font-size:small' colspan='6'>"
                content += $(this).text()
                //console.log($(this).text())
                content += "</td>"
            })
        }
    content += "</tr>"
        }
    )
    content += "</tbody>"
    content += "</table>";
    return content

}

//瀏覽器列印指定的Div，開新視窗然後出現列印控制畫面
function PrintSpecificDiv(divID) {
    var win = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status =0')
    var content = "<html><head>"
    content += reportStyle()
    content += "</head>"
    content += "<body style='font-family: DFKai-sb;' onload=\"window.print(); window.close();\">";
    content += reportHeader()
    content += reportBody(divID)
    content += "</body>";
    content += "</html>";
    //console.log(content)
    win.document.write(content);
    win.document.close();
}

//$(document).on("dp.change", ".GlDate", function (e) {
//});

//綁定代碼類資料By Array
function BindArrayData(id, data) {
    id = "#" + id
    $(id).empty().selectpicker("refresh")
    //$(id).append("<option>請選擇</option>");
    $.each(data, function (i, item) {
        $(id).append('<option value=' + item.bANNumber + '>' + item.businessEntity + " " + item.bANNumber + '</option>');
    });
    $(id).selectpicker("refresh");
}

//ajax GET從Server取得資料
function GetData(id, serverUrl, inputData) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        data: inputData,
        url: serverUrl,
        success: function (data) {
            console.log(data)
            BindArrayData(id, data)
        },
        error: function (data) {
            console.log("錯誤")
        }
    });
}


$("select").on("change", function (e) {
    if (e.target.id === "VoucherBeaus") {
        //設定憑證開立對象
        $("#DepId").val(e.target.value)
    }
})



function DoAction() {
    //取得憑證開立對象
    data = {}
    url = '/Report/GetCertificateObject'
    GetData('VoucherBeaus', url, data)  //show 代碼+名稱


    //傳票入帳日期，可選項為包含系統日期前一日之前的所有日期。
    var date = new Date()
    date.setDate(date.getDate() - 1)
    $('.GlDate').data("DateTimePicker").maxDate(date);

    //查詢
    $("#Query").click(function () {
        if ($("#GlDate").val() === "") {
            alertopen("傳票(入帳)日期必輸")
        } else if ($("#VoucherBeaus").val() === "") {
            alertopen("憑證開立對象必輸")
        } else {
            Query()
        }
    })


    //列印
    $("#Printer").click(function () {
        if ($("#VDetail").find("table").find("tbody").find("tr").length > 0) {
            PrintSpecificDiv("VDetail")
        } else {
            alertopen("尚未查詢!");
        }
    })

    //下載PDF
    $("#GenPDF").click(function () {
        if ($("#VDetail").find("table").find("tbody").find("tr").length > 0) {
            var loginMember = getLoginModel()
            var DepData = $("#DepId").val()
            var GlDate = $("#GlDate").val()
            var VoucherBeaus = $("#VoucherBeaus").find("option:selected").text()
            window.location.href = "/Report/GenVoucherPdf?DepId=" + DepData + "&GlDate=" + GlDate + "&PrintEmpName=" + getVoucherUnitName() + " " + loginMember.EmpID + "-" + loginMember.EmpName + "&VoucherBeaus=" + VoucherBeaus
        } else {
            alertopen("尚未查詢!");
        }
    })
}


$(function () {
    blockReportPage('')
    DoAction()
})
