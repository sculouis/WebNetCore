$(function(){
    $('#SuppliesOpen').on('click',function(){
        $('[data-remodal-id=SelectSupplies]').remodal().open();
    });
    $('#SuppliesInquired').on('click',function(){
        var suppliesName = $('#SuppliesNameInquiredInput').val();
        var suppliesID = $('#SuppliesIDInquiredInput').val();
        if(suppliesID == "" && suppliesName == ""){
            alert("請輸入其中一項資訊");
        }
        if(suppliesName == "統一"){
            supplies01append();
        }
    });
    $('#suppliesConfirm').on('click',function(){
        var selectSupplies = $('input[name="suppliesName"]:checked').parents('li');
        if(selectSupplies.length < 1){
            alert("請選擇供應商");
        }else{
            $('#suppliesName').text($(selectSupplies).find('.companyName').text());
            $('#suppliesNameInput').val($(selectSupplies).find('.companyName').text());
            $('#suppliesSerno').text($(selectSupplies).find('.companySerno').text());
            $('#suppliesSernoInput').val($(selectSupplies).find('.companySerno').text());
            perchaseOrderListAppend($('input[name="suppliesName"]:checked').val());
        }
        
    });
});

function emptySuppliesList(){
    $('#SuppliesList').empty();
}
function supplies01append(){
    emptySuppliesList();
    $('#SuppliesList').append(
        '<div class="col-sm-12"> '+
        ' <div class="popup-tr-title">'+
        '<ul class="w100">'+
        '<li>'+
        '<label class="w100 label-box">'+
        '<div class="table-box w15">供應商編號</div>'+
        '<div class="table-box w20">供應商名稱</div>'+
        '<div class="table-box w20">身分證號/統一編號</div>'+
        '<div class="table-box w20">地址</div>'+
        '<div class="table-box w15">員工編號</div>'+
        '</label>'+
        '</li>'+
        '</ui>'+
        '</div>'+
        '<div class="popup-tbody h160 overflow-auto">'+
        '<ul class="w100">'+
        '<li>'+
        '<label class="w100 label-box">'+
        '<div class="table-box w15 companySerno"><input type="radio" value="1" name="suppliesName">11101</div>'+
        '<div class="table-box w20 companyName">統一有限公司</div>'+
        '<div class="table-box w20 companyID">28682266</div>'+
        '<div class="table-box w20 companyAddress">台北市松山區民生東路3段</div>'+
        '<div class="table-box w15 companyENO">00950</div>'+
        '</label>'+
        '</li>'+
        '<li>'+
        '<label class="w100 label-box">'+
        '<div class="table-box w15 companySerno"><input type="radio" value="2" name="suppliesName">11102</div>'+
        '<div class="table-box w20 companyName">統一有限公司</div>'+
        '<div class="table-box w20 companyID">12345678</div>'+
        '<div class="table-box w20 companyAddress">台北市文山區興隆路2段</div>'+
        '<div class="table-box w15 companyENO">12091</div>'+
        '</label>'+
        '</li>'+
        '</ui>'+
        '</div>'+
        '</div>'
    );
}
function perchaseOrderListAppend(selectedSupplies){
    $('#perchaseOrderList').attr('disabled',false);
    $('#perchaseOrderList').selectpicker({title :"請選擇"}).selectpicker('render');//why render
    $('#perchaseOrderList').html('');//why this to change title
    switch (parseInt(selectedSupplies)){
        case 1:
            $('#paymentAccountSelectBtn').show();
            $('#paymentAccountSelectColSelect').removeClass().addClass('col-sm-3 content-box');
            $('#paymentMethod').text('電匯');
            $('#accountDescription').text('請選擇帳號');
            $('#remittanceFee').text('請選擇帳號');
            $('#paymentBank').text('請選擇帳號');
            $('#paymentBranch').text('請選擇帳號');
            $('#paymentAccount').text('請選擇帳號');
            $('#paymentAccountName').text('請選擇帳號');
            $('#perchaseOrderList').append(
                '<option value="1">PO201709211234</option>' +
                '<option value="2">PO201709211235</option>' +
                '<option value="3">PO201709211236</option>' +
                '<option value="4">PO201709211237</option>' +
                '<option value="5">PO201709211238</option>' +
                '<option value="6">PO201709211239</option>' 
            );
        break;
        case 2:
            $('#paymentMethod').text('非電匯');
            $('#paymentAccountSelectBtn').hide();
            $('#paymentAccountSelectColSelect').removeClass().addClass('col-sm-4 content-box');
            $('#accountDescription').text('');
            $('#remittanceFee').text('');
            $('#paymentBank').text('');
            $('#paymentBranch').text('');
            $('#paymentAccount').text('');
            $('#paymentAccountName').text('');
        $('#perchaseOrderList').append(
            '<option value="1">PO201709210857</option>' +
            '<option value="2">PO201709210858</option>' +
            '<option value="3">PO201709210859</option>' 
        );
        break;
        case 3:
        $('#perchaseOrderList').append(
            '<option value="1">PO201709219487</option>' +
            '<option value="2">PO201709219488</option>' +
            '<option value="3">PO201709219489</option>' +
            '<option value="4">PO201709219490</option>' 
        );
        break;
    }
   

    $('#perchaseOrderList').selectpicker('refresh');
}