function printDiv(divID) {
    //Get the HTML of div
    var divElements = document.getElementById(divID).innerHTML;
    //Get the HTML of whole page
    var oldPage = document.body.innerHTML;

    //Reset the page's HTML with div's HTML only
    document.body.innerHTML =
        "<html><head><title></title></head><body>" +
        divElements + "</body>";

    //Print Page
    window.print();

    //Restore orignal HTML
    document.body.innerHTML = oldPage;

    //事件需再綁回去
    //直接列印
    $("#printer").click(function () {
        printDiv("expPage")
    })

    //產生PDF檔
    $("#genPdf").click(function () {
        window.location.href = "/Report/GenPdf/" + $("#EXPNum").val()
    })
}

$(function () {
    if (typeof (getModel) == "function") {
        $("#EXPNum").val(getModel())

    }

    //直接列印
    $("#printer").click(function () {
        printDiv("expPage")
    })

    //產生PDF檔
    $("#genPdf").click(function () {
        window.location.href = "/Report/GenPdf/" + $("#EXPNum").val()
    })
})

