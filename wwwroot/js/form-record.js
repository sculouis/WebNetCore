function switchAuditLogStyle(isShow) {
    if (isShow) {
        $("#record-open-bt").hide(10);
        $("#record-close-bt").show(10);
        $('#RecordCountBody tr').each(function (index, element) {
            if (index > 1) {
                $(element).show(500);
            }
        });
    }
    else {
        $("#record-open-bt").show(10);
        $("#record-close-bt").hide(10);
        $('#RecordCountBody tr').each(function (index, element) {
            if (index > 1) {
                $(element).hide(500);
            }
        });
    }
}

$(function () {
    if ($('#RecordCountBody tr').length > 2) {
        switchAuditLogStyle(false);
    }

    $("#record-open-bt").on("click", function () {
        switchAuditLogStyle(true);
    });
    $("#record-close-bt").on("click", function () {
        switchAuditLogStyle(false);
    });
});