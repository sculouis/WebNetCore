var OrgpickParam = {
    URL: "",
    tempdatas: new Array(),
    RootUnitSeq: "",
    allowRole: new Array(),
    HighestUnitLevel: 2,//預設2(公司)
    LowestUnitLevel: 7,//預設7(科/組)
    multiple: false,
    OrgShowDis: false,
    orgpicktype: "user",
    IsAuthorityCHG: false,
    outputfunction: null,
    CurEmpList: new Array(),
    index: "",
}

OrgpickParam.URL = ""; //在此輸入URL參考來源，未輸入則自動判斷

function SetOrgpickParam(option) {

    if (OrgpickParam.URL == "") {
        var url = window.location.href;
        if (url.includes(".esunbank.com")) {
            OrgpickParam.URL = "https://oaportal.esunbank.com.tw/";
        } else if (url.includes("uat.testesunbank.com")) {
            OrgpickParam.URL = "https://oaportaluat.testesunbank.com.tw/";
        } else if (url.includes("sit.testesunbank.com")) {
            OrgpickParam.URL = "https://oaportalsit.testesunbank.com.tw/";
        } else {
            OrgpickParam.URL = "https://oaportaldev.testesunbank.com.tw/";
        }
    }

    OrgpickParam.RootUnitSeq = "";
    OrgpickParam.allowRole = new Array();
    OrgpickParam.HighestUnitLevel = 2;//預設2(公司)
    OrgpickParam.LowestUnitLevel = 7;//預設7(科/組)
    OrgpickParam.outputfunction = null;
    OrgpickParam.CurEmpList = new Array();
    OrgpickParam.index = "";

    for (var i in option) {
        eval("OrgpickParam." + i + "=option." + i);
    }

    OrgpickParam.tempdatas = new Array();
}

function orgpickUnit(option) {
    SetOrgpickParam(option);

    OrgpickParam.multiple = false;
    OrgpickParam.OrgShowDis = false;
    OrgpickParam.orgpicktype = 'unit';
    OrgpickParam.IsAuthorityCHG = false;

    openorgpicker();
}
function orgpickRole(option) {
    SetOrgpickParam(option);

    OrgpickParam.multiple = false;
    OrgpickParam.OrgShowDis = false;
    OrgpickParam.orgpicktype = 'role';
    OrgpickParam.IsAuthorityCHG = false;

    openorgpicker();
}
function orgpickUser(option) {
    SetOrgpickParam(option);

    OrgpickParam.multiple = false;
    OrgpickParam.OrgShowDis = false;
    OrgpickParam.orgpicktype = 'user';
    OrgpickParam.IsAuthorityCHG = false;

    openorgpicker();
}
function orgpickMultipleUnit(option) {
    SetOrgpickParam(option);

    OrgpickParam.multiple = true;
    OrgpickParam.OrgShowDis = false;
    OrgpickParam.orgpicktype = 'unit';
    OrgpickParam.IsAuthorityCHG = false;

    openorgpicker();
}
function orgpickMultipleRole(option) {
    SetOrgpickParam(option);

    OrgpickParam.multiple = true;
    OrgpickParam.OrgShowDis = false;
    OrgpickParam.orgpicktype = 'role';
    OrgpickParam.IsAuthorityCHG = false;

    openorgpicker();
}
function orgpickMultipleUser(option) {
    SetOrgpickParam(option);

    OrgpickParam.multiple = true;
    OrgpickParam.OrgShowDis = false;
    OrgpickParam.orgpicktype = 'user';
    OrgpickParam.IsAuthorityCHG = false;

    openorgpicker();
}
function orgpickAuthorityCHG(option) {
    SetOrgpickParam(option);

    OrgpickParam.multiple = false;
    OrgpickParam.OrgShowDis = false;
    OrgpickParam.orgpicktype = 'user';
    OrgpickParam.IsAuthorityCHG = true;

    if (OrgpickParam.CurEmpList == null || OrgpickParam.CurEmpList.length < 1) {
        alert("無法取得目前處理人");
        return false;
    }
    openorgpicker();
}

function openorgpicker() {

    var selectlist = [];
    if (OrgpickParam.orgpicktype == "unit") {
        $('body').append('<div class="remodal remodal-small orgpickdialog" data-remodal-id="modal-Orgpicker" role="dialog" aria-labelledby="modal1Title" aria-describedby="modal1Desc"><div class="se-pre-con-inform-loading" style="display:none"></div><button data-remodal-action="close" class="remodal-close" aria-label="Close"></button><div class="col-sm-12"><span id="modal1Title" class="popup-title-center">選擇單位</span></div><div class="col-sm-12"><div class="popup-input-title">快速查詢</div></div><div class="col-sm-12 content-box m-bottom10"><div class="search-select-box"><select id="searchtype" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38"><option value="unit_name">單位名稱</option><option value="unit_code">單位代號</option></select></div><div class="search-input-box-2"><input class="input" id="searchbox"><div class="cr-search-box search-bt"><a class="icon-search3" id="searchbutton"></a></div></div><div class="cr-search-over-box search-over-box"><ul></ul></div></div><div id="treearea"><div class="col-sm-12"><div class="popup-input-title" id="selectTitle">選擇單位</div></div></div><div class="col-sm-12 m-top20"><div class="line-x"></div></div><div class="col-sm-12 content-box m-top10"><div class="popup-input-title">您所選擇的單位</div><div class="box-area area-fix02"><div class="no-file-text"><b>-尚無單位-</b></div></div></div><div class="col-sm-12 content-box"><div class="popup-btn-row"><a data-remodal-action="cancel" class="remodal-cancel-btn">取消</a><a class="remodal-confirm-btn">確認</a></div></div>');
    }
    else if (OrgpickParam.orgpicktype == "role") {
        selectlist = ["ES_role"];
        $('body').append('<div class="remodal remodal-small orgpickdialog" data-remodal-id="modal-Orgpicker" role="dialog" aria-labelledby="modal1Title" aria-describedby="modal1Desc"><div class="se-pre-con-inform-loading" style="display:none"></div><button data-remodal-action="close" class="remodal-close" aria-label="Close"></button><div class="col-sm-12"><span id="modal1Title" class="popup-title-center">選擇角色</span></div><div class="col-sm-12"><div class="popup-input-title">快速查詢</div></div><div class="col-sm-12 content-box m-bottom10"><div class="search-select-box"><select id="searchtype" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38"><option value="role_name">角色名稱</option><option value="role_id">角色編號</option></select></div><div class="search-input-box-2"><input class="input" id="searchbox"><div class="cr-search-box search-bt"><a class="icon-search3" id="searchbutton"></a></div></div><div class="cr-search-over-box search-over-box"><ul></ul></div></div><div id="treearea"><div class="col-sm-12"><div class="popup-input-title" id="selectTitle">選擇角色</div></div></div><div class="col-sm-12 m-top20"><div class="line-x"></div></div><div class="col-sm-12 content-box m-top10"><div class="popup-input-title">您所選擇的角色</div><div class="box-area area-fix02"><div class="no-file-text"><b>-尚無角色-</b></div></div></div><div class="col-sm-12 content-box"><div class="popup-btn-row"><a data-remodal-action="cancel" class="remodal-cancel-btn">取消</a><a class="remodal-confirm-btn">確認</a></div></div>');
    }
    else if (OrgpickParam.orgpicktype == "user" && OrgpickParam.IsAuthorityCHG == false) {
        selectlist = ["ES_role", "ES_user"];
        $('body').append('<div class="remodal remodal-small orgpickdialog" data-remodal-id="modal-Orgpicker" role="dialog" aria-labelledby="modal1Title" aria-describedby="modal1Desc"><div class="se-pre-con-inform-loading" style="display:none"></div><button data-remodal-action="close" class="remodal-close" aria-label="Close"></button><div class="col-sm-12"><span id="modal1Title" class="popup-title-center">選擇人員</span></div><div class="col-sm-12"><div class="popup-input-title">快速查詢</div></div><div class="col-sm-12 content-box m-bottom10"><div class="search-select-box"><select id="searchtype" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38"><option value="user_name">員工姓名</option><option value="user_id">員工編號</option></select></div><div class="search-input-box-2"><input class="input" id="searchbox"><div class="cr-search-box search-bt"><a class="icon-search3" id="searchbutton"></a></div></div><div class="cr-search-over-box search-over-box"><ul></ul></div></div><div id="treearea"><div class="col-sm-12"><div class="popup-input-title" id="selectTitle">選擇人員</div></div></div><div class="col-sm-12 m-top20"><div class="line-x"></div></div>' +
        '<div class="col-sm-12 content-box m-top10"><div class="popup-input-title">您所選擇的人員</div><div class="box-area area-fix02"><div class="no-file-text"><b>-尚無人員-</b></div></div></div>' +
        '<div class="col-sm-12 content-box"><div class="popup-btn-row"><a data-remodal-action="cancel" class="remodal-cancel-btn">取消</a><a class="remodal-confirm-btn">確認</a></div></div>');
    }
    else if (OrgpickParam.orgpicktype == "user" && OrgpickParam.IsAuthorityCHG == true && OrgpickParam.CurEmpList.length > 0) {
        selectlist = ["ES_role", "ES_user"];
        $('body').append('<div class="remodal remodal-small orgpickdialog" data-remodal-id="modal-Orgpicker" role="dialog" aria-labelledby="modal1Title" aria-describedby="modal1Desc"><div class="se-pre-con-inform-loading" style="display:none"></div><button data-remodal-action="close" class="remodal-close" aria-label="Close"></button><div class="col-sm-12"><span id="modal1Title" class="popup-title-center">處理權移轉</span></div><div class="col-sm-12"><div class="popup-input-title">快速查詢</div></div><div class="col-sm-12 content-box m-bottom10"><div class="search-select-box"><select id="searchtype" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38"><option value="user_name">員工姓名</option><option value="user_id">員工編號</option></select></div><div class="search-input-box-2"><input class="input" id="searchbox"><div class="cr-search-box search-bt"><a class="icon-search3" id="searchbutton"></a></div></div><div class="cr-search-over-box search-over-box"><ul></ul></div></div><div id="treearea"><div class="col-sm-12"><div class="popup-input-title" id="selectTitle">選擇人員</div></div></div><div class="col-sm-12 m-top20"><div class="line-x"></div></div>' +
        '<div class="col-sm-6 content-box m-top10"><div class="popup-input-title">被處理權移轉人</div><select id="OldCurEmp" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38"></select></div>' +
        '<div class="col-sm-6 content-box m-top10"><div class="popup-input-title">新處理人員</div><div class="box-area area-fix02"><div class="no-file-text"><b>-尚無人員-</b></div></div></div>' +
        '<div class="col-sm-12 content-box"><div class="popup-btn-row"><a data-remodal-action="cancel" class="remodal-cancel-btn">取消</a><a class="remodal-confirm-btn">確認</a></div></div>');
        SetAuthorityCHG(OrgpickParam.CurEmpList);
    }

    var inst = $('[data-remodal-id=modal-Orgpicker]').remodal();
    inst.open();

    var orgRange = 0;

    //合併unit_level=5&unit_level=6
    switch (OrgpickParam.LowestUnitLevel) {
        case 5:
        case 6:
            OrgpickParam.LowestUnitLevel = 6;
            orgRange = 5;
            break;
        case 7:
            orgRange = 6;
            break;
        default:
            orgRange = OrgpickParam.LowestUnitLevel
    }

    if (OrgpickParam.HighestUnitLevel == 6) {
        OrgpickParam.HighestUnitLevel = 5;
    }

    var orgUnit = new Array();
    if (OrgpickParam.RootUnitSeq != null && OrgpickParam.RootUnitSeq != "") { //if 有預設ROOT
        OrgpickParam.RootUnitSeq = OrgpickParam.RootUnitSeq.split(";");
        orgUnit = getRoot(OrgpickParam.RootUnitSeq);
        //計算orgRange
        switch (orgUnit[0].unit_level) {
            case 5:
            case 6:
                orgRange = orgRange - 5;
                break;
            case 7:
                orgRange = orgRange - 6;
                break;
            default:
                orgRange = orgRange - orgUnit[0].unit_level;
        }

        if (orgRange < 0) {
            alert("參數錯誤");
            setTimeout(function () {
                inst.close();
            }, 500);
            return;
        }

        switch (orgUnit[0].unit_level) {
            case 1: //Root(同預設)
                var DeptList = ["ES_Company", "ES_Dir", "ES_Div", "ES_Dept", "ES_section"];
                createselect(selectlist, DeptList, orgRange);
                OrgpickParam.RootUnitSeq = "";
                getunitchild("org_hr", OrgpickParam.orgpicktype, "ES_Company");
                break;
            case 2: //公司
                var DeptList = ["ES_Company", "ES_Dir", "ES_Div", "ES_Dept", "ES_section"];
                createselect(selectlist, DeptList, orgRange);
                showUnitlist(orgUnit, "ES_Company");
                break;
            case 3://董總
                var DeptList = ["ES_Dir", "ES_Div", "ES_Dept", "ES_section"];
                createselect(selectlist, DeptList, orgRange);
                showUnitlist(orgUnit, "ES_Dir");
                break;
            case 4: //處
                var DeptList = ["ES_Div", "ES_Dept", "ES_section"];
                createselect(selectlist, DeptList, orgRange);
                showUnitlist(orgUnit, "ES_Div");
                break;
            case 5://部門or中心
            case 6://分行
                var DeptList = ["ES_Dept", "ES_section"];
                createselect(selectlist, DeptList, orgRange);
                showUnitlist(orgUnit, "ES_Dept");
                break;
            case 7://科or組
                var DeptList = ["ES_section"];
                createselect(selectlist, DeptList, orgRange);
                showUnitlist(orgUnit, "ES_section");
                break;
        }

        if (OrgpickParam.orgpicktype == "unit") {
            tempUnits(orgUnit);  //父節點加入暫存
        }
    }
    else {
        orgRange = orgRange - 2;//2為公司unit_level
        var DeptList = ["ES_Company", "ES_Dir", "ES_Div", "ES_Dept", "ES_section"];
        createselect(selectlist, DeptList, orgRange);
        OrgpickParam.RootUnitSeq = "";
        getunitchild("org_hr", OrgpickParam.orgpicktype, "ES_Company");
    }

    $('#ES_Company').change(function () {  //母下拉選單選擇後產生子結果
        $('#ES_Dir').empty(); $('#ES_Div').empty(); $('#ES_Dept').empty(); $('#ES_section').empty(); $('#ES_role').empty(); $('#ES_user').empty();
        addcancelchoice("ES_Company");
        var val = (this.value);
        var name = $("#ES_Company option:selected").text();
        var seq = $("#ES_Company option:selected")[0].id;

        if (seq != "" && (OrgpickParam.LowestUnitLevel > 2 || OrgpickParam.orgpicktype != 'unit')) {
            getunitchild(seq, OrgpickParam.orgpicktype, "ES_Dir");
        }
        else if (val != "" && OrgpickParam.orgpicktype == 'unit') {//select unit
            CreateLabel(val, name);
        }
        else if ($("#ES_Company [name='cancelchoice']").length > 0) {//取消
            $("#ES_Company [name='cancelchoice']").remove();
            setTimeout(function () {
                $('.orgpickdialog .selectpicker').selectpicker('refresh');
            }, 500);
        }
    });



    $('#ES_Dir').change(function () {
        addcancelchoice("ES_Dir");
        var val = (this.value);
        var name = $("#ES_Dir option:selected").text();
        var seq = $("#ES_Dir option:selected")[0].id;
        if ($("#ES_Dir option:selected").attr('class') == "parentchoice" || (OrgpickParam.LowestUnitLevel <= 3 && OrgpickParam.orgpicktype == 'unit')) {//select unit or parentunit
            CreateLabel(val, name);
        }
        else {
            $('#ES_Div').empty(); $('#ES_Dept').empty(); $('#ES_section').empty(); $('#ES_role').empty(); $('#ES_user').empty();
            if (seq != "" && (OrgpickParam.LowestUnitLevel > 3 || OrgpickParam.orgpicktype != 'unit')) {
                getunitchild(seq, OrgpickParam.orgpicktype, "ES_Div");
            }
            else if ($("#ES_Company option:selected").attr('id') != null && $("#ES_Company option:selected").attr('id') != '') {//取消選擇抓上層值且重新查詢組織
                $('#ES_Dir').empty();
                getunitchild($("#ES_Company option:selected")[0].id, OrgpickParam.orgpicktype, "ES_Dir");
            }
            else {
                $("#ES_Dir [name='cancelchoice']").remove();
                setTimeout(function () {
                    $('.orgpickdialog .selectpicker').selectpicker('refresh');
                }, 500);
            }
        }


    });

    $('#ES_Div').change(function () {
        addcancelchoice("ES_Div");
        var val = (this.value);
        var name = $("#ES_Div option:selected").text();
        var seq = $("#ES_Div option:selected")[0].id;
        if ($("#ES_Div option:selected").attr('class') == "parentchoice" || (OrgpickParam.LowestUnitLevel <= 4 && OrgpickParam.orgpicktype == 'unit')) {
            CreateLabel(val, name);
        }
        else {
            $('#ES_Dept').empty(); $('#ES_section').empty(); $('#ES_role').empty(); $('#ES_user').empty();
            if (seq != "" && (OrgpickParam.LowestUnitLevel > 4 || OrgpickParam.orgpicktype != 'unit')) {
                getunitchild(seq, OrgpickParam.orgpicktype, "ES_Dept");
            }
            else if ($("#ES_Dir option:selected").attr('id') != null && $("#ES_Dir option:selected").attr('id') != '') {
                $('#ES_Div').empty();
                getunitchild($("#ES_Dir option:selected")[0].id, OrgpickParam.orgpicktype, "ES_Div");
            }
            else if ($("#ES_Company option:selected").attr('id') != null && $("#ES_Company option:selected").attr('id') != '') {
                $('#ES_Dir').empty(); $('#ES_Div').empty();
                getunitchild($("#ES_Company option:selected")[0].id, OrgpickParam.orgpicktype, "ES_Dir");
            }
            else {
                $("#ES_Div [name='cancelchoice']").remove();
                setTimeout(function () {
                    $('.orgpickdialog .selectpicker').selectpicker('refresh');
                }, 500);
            }
        }
    });

    $('#ES_Dept').change(function () {
        addcancelchoice("ES_Dept");
        var val = (this.value);
        var name = $("#ES_Dept option:selected").text();
        var seq = $("#ES_Dept option:selected")[0].id;
        if ($("#ES_Dept option:selected").attr('class') == "parentchoice" || (OrgpickParam.LowestUnitLevel <= 6 && OrgpickParam.orgpicktype == 'unit')) {
            CreateLabel(val, name);
        }
        else {
            $('#ES_section').empty(); $('#ES_role').empty(); $('#ES_user').empty();
            if (seq != "" && (OrgpickParam.LowestUnitLevel > 6 || OrgpickParam.orgpicktype != 'unit')) {
                getunitchild(seq, OrgpickParam.orgpicktype, "ES_section");
            }
            else if ($("#ES_Div option:selected").attr('id') != null && $("#ES_Div option:selected").attr('id') != '') {
                $('#ES_Dept').empty();
                getunitchild($("#ES_Div option:selected")[0].id, OrgpickParam.orgpicktype, "ES_Dept");
            }
            else if ($("#ES_Dir option:selected").attr('id') != null && $("#ES_Dir option:selected").attr('id') != '') {
                $('#ES_Div').empty(); $('#ES_Dept').empty();
                getunitchild($("#ES_Dir option:selected")[0].id, OrgpickParam.orgpicktype, "ES_Div");
            }
            else if ($("#ES_Company option:selected").attr('id') != null && $("#ES_Company option:selected").attr('id') != '') {
                $('#ES_Dir').empty(); $('#ES_Div').empty(); $('#ES_Dept').empty();
                getunitchild($("#ES_Company option:selected")[0].id, OrgpickParam.orgpicktype, "ES_Dir");
            }
            else {
                $("#ES_Dept [name='cancelchoice']").remove();
                setTimeout(function () {
                    $('.orgpickdialog .selectpicker').selectpicker('refresh');
                }, 500);
            }
        }
    });

    $('#ES_section').change(function () {
        addcancelchoice("ES_section");
        var val = (this.value);
        var name = $("#ES_section option:selected").text();
        var seq = $("#ES_section option:selected")[0].id;
        if (val != "" && OrgpickParam.orgpicktype == 'unit') {
            CreateLabel(val, name);
        }
        else {
            $('#ES_role').empty(); $('#ES_user').empty();
            if (seq != "" && OrgpickParam.orgpicktype != "unit") {
                getunitchild(seq, OrgpickParam.orgpicktype, "ES_role");
            }
            else if ($("#ES_Dept option:selected").attr('id') != null && $("#ES_Dept option:selected").attr('id') != '') {
                $('#ES_section').empty();
                getunitchild($("#ES_Dept option:selected")[0].id, OrgpickParam.orgpicktype, "ES_section");
            }
            else if ($("#ES_Div option:selected").attr('id') != null && $("#ES_Div option:selected").attr('id') != '') {
                $('#ES_Dept').empty(); $('#ES_section').empty();
                getunitchild($("#ES_Div option:selected")[0].id, OrgpickParam.orgpicktype, "ES_Dept");
            }
            else if ($("#ES_Dir option:selected").attr('id') != null && $("#ES_Dir option:selected").attr('id') != '') {
                $('#ES_Div').empty(); $('#ES_Dept').empty(); $('#ES_section').empty();
                getunitchild($("#ES_Dir option:selected")[0].id, OrgpickParam.orgpicktype, "ES_Div");
            }
            else if ($("#ES_Company option:selected").attr('id') != null && $("#ES_Company option:selected").attr('id') != '') {
                $('#ES_Dir').empty(); $('#ES_Div').empty(); $('#ES_Dept').empty(); $('#ES_section').empty();
                getunitchild($("#ES_Company option:selected")[0].id, OrgpickParam.orgpicktype, "ES_Dir");
            }
            else {
                $("#ES_section [name='cancelchoice']").remove();
                setTimeout(function () {
                    $('.orgpickdialog .selectpicker').selectpicker('refresh');
                }, 500);
            }
        }
    });

    $('#ES_role').change(function () {
        $('#ES_user').empty();
        addcancelchoice("ES_role");
        var val = (this.value);
        var name = $("#ES_role option:selected").text();
        var seq = $("#ES_role option:selected")[0].id;
        if (seq != "" && OrgpickParam.orgpicktype == "user") {
            getrolechild(seq, OrgpickParam.orgpicktype, "ES_user");
        }
        else if (OrgpickParam.orgpicktype == "role") {
            CreateLabel(val, name);
            setTimeout(function () {
                $('.orgpickdialog .selectpicker').selectpicker('refresh');
            }, 500);
        }
        else {
            $("#ES_role [name='cancelchoice']").remove();
            setTimeout(function () {
                $('.orgpickdialog .selectpicker').selectpicker('refresh');
            }, 500);
        }
    });

    $('#ES_user').change(function () {
        addcancelchoice("ES_user");
        var val = (this.value); //員編
        var name = $("#ES_user option:selected").text();//姓名(員編)
        if (val != "") {
            CreateLabel(val, name);
            setTimeout(function () {
                $('.orgpickdialog .selectpicker').selectpicker('refresh');
            }, 500);
        }
        else {
            $("#ES_user [name='cancelchoice']").remove();
            setTimeout(function () {
                $('.orgpickdialog .selectpicker').selectpicker('refresh');
            }, 500);
        }
    });

    var OldCurEmpId = ""; OldCurEmpName = "";
    $('#OldCurEmp').change(function () {
        OldCurEmpId = this.value; //員編
        OldCurEmpName = $("#OldCurEmp option:selected")[0].attributes[1].value;//姓名(員編)
    }).change();

    //模糊查詢選擇
    var fuzzytemp = "";
    $("#searchtype").on('change', function () {
        $('#searchbox').attr('placeholder', "請輸入" + $("#searchtype option:selected")[0].innerText);
        fuzzytemp = "";
    }).change();

    //模糊查詢(Enter)
    $('#searchbox').keypress(function (e) {
        $(".cr-search-over-box").hide();
        code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            FuzzyClick();
        }
    })
    //模糊查詢(button)
    $("#searchbutton").on("click", function () {
        FuzzyClick();
    });

    function FuzzyClick() {
        var value = $.trim($('#searchbox').val());
        if (value != fuzzytemp && value != "") {
            fuzzytemp = value;
            var querytype = $('#searchtype option:selected').val();//id or name
            FuzzyQuery(value, querytype, OrgpickParam.RootUnitSeq, OrgpickParam.orgpicktype);
        }
        else if (!($('.cr-search-over-box li').length > 0)) {
            alert("沒有對應資料");
            $(".cr-search-over-box").hide();
        }
        else {
            $(".cr-search-over-box").show();
        }
    }

    //游標點擊隱藏模糊查詢結果區塊
    var isOnFuzzyQuery = false;
    $(".cr-search-over-box").mouseenter(function () { isOnFuzzyQuery = true; });
    $(".cr-search-over-box").mouseleave(function () { isOnFuzzyQuery = false; });
    $(".orgpickdialog").mouseup(function () {
        if (isOnFuzzyQuery === true) {
            // 不隱藏
        }
        else {
            $(".cr-search-over-box").hide();
        }
    });

    //確認輸出,可自行修改QueryTemp傳出參數
    $('.orgpickdialog .remodal-confirm-btn').click(function () {
        var buttons = $('[orgpick-id]');
        if (buttons.length > 0) {
            var datas = new Array();
            for (i = 0; i < buttons.length; i++) {
                datas[i] = OrgpickParam.tempdatas[buttons[i].attributes[1].value];
            }
            if (OrgpickParam.IsAuthorityCHG == true) {//處理權移轉
                var AUTPerson = new Array();
                AUTPerson["OldPerson"] = { id: OldCurEmpId, value: OldCurEmpName };
                AUTPerson["NewPerson"] = { id: datas[0].user_id, value: datas[0].user_name };
                orgpickResultforAuthorityCHG(AUTPerson);
            }
            else if (OrgpickParam.outputfunction != null && OrgpickParam.outputfunction != "") {//自訂outputfunction
                eval(OrgpickParam.outputfunction + "(datas,OrgpickParam.orgpicktype,OrgpickParam.index);");
            }
            else {
                QueryTemp(datas, OrgpickParam.orgpicktype, OrgpickParam.index);
            }
            inst.close();
        }
        else {
            alert("請至少選擇一項單位/角色/人員");
            //inst.close();
        }
    });

    $(document).on('closed', '.remodal', function (e) {
        inst.destroy();
    });
    setTimeout(function () {
        $('.selectpicker').selectpicker();
    }, 500);

}
//---------------function openorgpicker END--------------

//設定處理權移轉被移轉人選項
function SetAuthorityCHG(CurEmpList) {
    for (var i = 0; i < CurEmpList.length; i++) {
        $('#OldCurEmp').append("<option value='" + CurEmpList[i].id + "' name='" + CurEmpList[i].value + "'>" + CurEmpList[i].value + "&nbsp(" + CurEmpList[i].id + ")</option>");
    }
}

//動態產生下拉按鈕
function createselect(list, DeptList, orgRange) {
    for (var i = 0; i < orgRange + 1; i++) {
        list.splice(i, 0, DeptList[i]);
    }
    switch (list.length) {
        case 1:
            $('#treearea').append('<div class="col-sm-12 content-box m-top10"><select id="' + list[0] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>');
            break;
        case 2:
            $('#treearea').append('<div class="col-sm-6 content-box m-top10"><select id="' + list[0] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-6 content-box m-top10"><select id="' + list[1] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>');
            break;
        case 3:
            $('#treearea').append('<div class="col-sm-4 content-box m-top10"><select id="' + list[0] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-4 content-box m-top10"><select id="' + list[1] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-4 content-box m-top10"><select id="' + list[2] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>');
            break;
        case 4:
            $('#treearea').append('<div class="col-sm-6 content-box m-top10"><select id="' + list[0] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-6 content-box m-top10"><select id="' + list[1] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-6 content-box m-top10"><select id="' + list[2] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-6 content-box m-top10"><select id="' + list[3] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>');
            break;
        case 5:
            $('#treearea').append('<div class="col-sm-12 content-box m-top10"><select id="' + list[0] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-4 content-box m-top10"><select id="' + list[1] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-4 content-box m-top10"><select id="' + list[2] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-4 content-box m-top10"><select id="' + list[3] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-12 content-box m-top10"><select id="' + list[4] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>');
            break;
        case 6:
            $('#treearea').append('<div class="col-sm-6 content-box m-top10"><select id="' + list[0] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-6 content-box m-top10"><select id="' + list[1] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-6 content-box m-top10"><select id="' + list[2] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-6 content-box m-top10"><select id="' + list[3] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-6 content-box m-top10"><select id="' + list[4] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-6 content-box m-top10"><select id="' + list[5] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>');
            break;
        case 7:
            $('#treearea').append('<div class="col-sm-6 content-box m-top10"><select id="' + list[0] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-6 content-box m-top10"><select id="' + list[1] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-4 content-box m-top10"><select id="' + list[2] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-4 content-box m-top10"><select id="' + list[3] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-4 content-box m-top10"><select id="' + list[4] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-6 content-box m-top10"><select id="' + list[5] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>' +
                                  '<div class="col-sm-6 content-box m-top10"><select id="' + list[6] + '" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38 "></select></div>');
            break;
    }
    $("#ES_Company").attr("title", "選擇公司");
    $("#ES_Dir").attr("title", "選擇董總");
    $("#ES_Div").attr("title", "選擇單位").attr("data-live-search", "true");
    $("#ES_Dept").attr("title", "選擇部門/中心/分行").attr("data-live-search", "true");
    $("#ES_section").attr("title", "選擇科/組").attr("data-live-search", "true");
    $("#ES_role").attr("title", "選擇角色").attr("data-live-search", "true");
    $("#ES_user").attr("title", "選擇人員").attr("data-live-search", "true");
}

function getRoot(RootUnitSeq) {  //撈取父部門
    $('.se-pre-con-inform-loading').show();
    var datas = new Array();
    for (var i = 0; i < RootUnitSeq.length; i++) {
        $.ajax({
            url: OrgpickParam.URL + 'OrgTree/GetRootOrChild?Type=unit&Sequence=' + RootUnitSeq[i],
            dataType: 'json',
            async: false,
            success: function (data) {
                datas[i] = data.data;
                $('.se-pre-con-inform-loading').hide();
            },
            error: function (data) {
                alert(data.responseText);
                $('.se-pre-con-inform-loading').hide();
            },
        });
    }
    return datas
}

function getunitchild(seq, type, root) {  //撈取部門下子部門及角色排列組織
    var orgUnit = new Array();
    var orgRole = new Array();
    $('.se-pre-con-inform-loading').show();
    $.ajax({
        url: OrgpickParam.URL + 'OrgTree/GetRootOrChild?Type=unit&Sequence=' + encodeURIComponent(seq) + '&NeedGetChild=true',
        dataType: 'json',
        async: true,
        success: function (data) {
            orgUnit = data.data.unit;
            orgRole = data.data.role;
            if (type == "unit") {
                tempUnits(orgUnit);
            }
            else if (type == "role") {
                tempRoles(orgRole);
            }
            showUnitlist(orgUnit, root, seq);
            showRolelist(orgRole)
            $('.se-pre-con-inform-loading').hide();
        },
        error: function (data) {
            alert(data.responseText);
            $('.se-pre-con-inform-loading').hide();
        },
    });
}

function getrolechild(seq, type) { //撈取角色下人員排列組織
    var orgUser = new Array();
    $('.se-pre-con-inform-loading').show();
    $.ajax({
        url: OrgpickParam.URL + 'OrgTree/GetRootOrChild?Type=role&Sequence=' + encodeURIComponent(seq) + '&NeedGetChild=true',
        dataType: 'json',
        async: true,
        success: function (data) {
            orgUser = data.data.user;
            showUserlist(orgUser);
            if (type == "user") {
                tempUsers(orgUser);
            }
            $('.se-pre-con-inform-loading').hide();
        },
        error: function (data) {
            alert(data.responseText);
            $('.se-pre-con-inform-loading').hide();
        },
    });
}

function FuzzyQuery(value, queryname, RootUnitSeq, type) { //單獨模糊查詢
    var datas = [];
    var FuzzyURL;
    $('.se-pre-con-inform-loading').show();
    if (RootUnitSeq != "") {
        var num = 0;
        for (var i = 0; i < RootUnitSeq.length; i++) {
            FuzzyURL = OrgpickParam.URL + 'OrgTree/FuzzyQuery/?Type=' + type + '&Sequence=' + RootUnitSeq[i];
            $.ajax({
                url: FuzzyURL,
                dataType: 'json',
                async: true,
                success: function (data) {
                    if (data.data[type] != null && data.data[type].length > 0) {
                        for (var i = 0; i < data.data[type].length; i++) {
                            if (data.data[type][i][queryname].indexOf(value) >= 0) {
                                datas.push(data.data[type][i]);
                            }
                        }
                    }
                    num++;
                },
                error: function (data) {
                    alert(data.responseText);
                    $(".cr-search-over-box").hide();
                    $('.se-pre-con-inform-loading').hide();
                },
            });
        }
        function waitFuzzyQuery() {
            if (num == RootUnitSeq.length && datas != null) {
                showfuzzylist(datas, type);
                $(".cr-search-over-box").show();
                $('.se-pre-con-inform-loading').hide();
            }
            else {
                setTimeout(function () {
                    waitFuzzyQuery();
                }, 500);
            }
        }
        waitFuzzyQuery();
    }
    else {
        FuzzyURL = OrgpickParam.URL + 'OrgTree/FuzzyQuery/?Type=' + type + '&QueryName=' + queryname + '&Value=' + encodeURIComponent(value);
        $.ajax({
            url: FuzzyURL,
            dataType: 'json',
            async: true,
            success: function (data) {
                datas = data.data[type];
                if (datas != null) {
                    showfuzzylist(datas, type);
                }
                $(".cr-search-over-box").show();
                $('.se-pre-con-inform-loading').hide();
            },
            error: function (data) {
                alert(data.responseText);
                $(".cr-search-over-box").hide();
                $('.se-pre-con-inform-loading').hide();
            },
        });
    }
}
//加入母單位選項
function addparentchoice(root, seq) {
    if (seq != "" && seq != "org_hr" && OrgpickParam.orgpicktype == 'unit') {
        var parentunit = OrgpickParam.tempdatas[seq];
        if (parentunit != null && parentunit.unit_level >= OrgpickParam.HighestUnitLevel) {
            $('#' + root).append("<option id='' value='" + parentunit.unit_id + "' class='parentchoice'>選擇&nbsp" + parentunit.unit_name + "(" + parentunit.unit_code + ")</option>");
        }
    }
}
//加入取消選擇選項
function addcancelchoice(id) {
    selecter = "#" + id + " [name='cancelchoice']";
    if ($(selecter).length < 1) {
        $('#' + id).prepend("<option name='cancelchoice' value=''>取消選擇</option>");
    }
}
//刪除欲查詢標籤
function orgpickerDel(ele) {
    ele.parent().parent().parent().remove();
    if ($('.orgpickdialog .Links').length == 0) {
        switch (OrgpickParam.orgpicktype) {
            case "unit":
                $('.orgpickdialog .box-area').append("<div class=\"no-file-text\"><b>-尚無單位-</b></div>");
                break;
            case "role":
                $('.orgpickdialog .box-area').append("<div class=\"no-file-text\"><b>-尚無角色-</b></div>");
                break;
            case "user":
                $('.orgpickdialog .box-area').append("<div class=\"no-file-text\"><b>-尚無人員-</b></div>");
                break;
        }
    }
}

function tempUnits(orgUnit) {
    for (var i = 0; i < orgUnit.length; i++) {
        OrgpickParam.tempdatas[orgUnit[i].unit_id] = orgUnit[i];
    }
}

function tempRoles(orgRole) {
    for (var i = 0; i < orgRole.length; i++) {
        OrgpickParam.tempdatas[orgRole[i].role_id] = orgRole[i];
    }
}

function tempUsers(orgUser) {
    for (var i = 0; i < orgUser.length; i++) {
        OrgpickParam.tempdatas[orgUser[i].user_id] = orgUser[i];
    }
}

function showUnitlist(orgUnit, root, seq) {
    if (orgUnit != null && orgUnit.length > 0) {
        addparentchoice(root, seq);
        $.each(orgUnit, function (i) {
            switch (orgUnit[i].unit_level) {
                case 2:
                    $("#ES_Company").append("<option id=\"" + orgUnit[i].seq + "\" orgstatu=\"" + orgUnit[i].status + "\" value=\"" + orgUnit[i].unit_id + "\">" + orgUnit[i].unit_name + "(" + orgUnit[i].unit_code + ")</option>");
                    break;
                case 3:
                    $("#ES_Dir").append("<option id=\"" + orgUnit[i].seq + "\" orgstatu=\"" + orgUnit[i].status + "\" value=\"" + orgUnit[i].unit_id + "\">" + orgUnit[i].unit_name + "(" + orgUnit[i].unit_code + ")</option>");
                    break;
                case 4:
                    $("#ES_Div").append("<option id=\"" + orgUnit[i].seq + "\" orgstatu=\"" + orgUnit[i].status + "\" value=\"" + orgUnit[i].unit_id + "\">" + orgUnit[i].unit_name + "(" + orgUnit[i].unit_code + ")</option>");
                    break;
                case 5:
                case 6:
                    $("#ES_Dept").append("<option id=\"" + orgUnit[i].seq + "\" orgstatu=\"" + orgUnit[i].status + "\" value=\"" + orgUnit[i].unit_id + "\">" + orgUnit[i].unit_name + "(" + orgUnit[i].unit_code + ")</option>");
                    break;
                case 7:
                    $("#ES_section").append("<option id=\"" + orgUnit[i].seq + "\" orgstatu=\"" + orgUnit[i].status + "\" value=\"" + orgUnit[i].unit_id + "\">" + orgUnit[i].unit_name + "(" + orgUnit[i].unit_code + ")</option>");
                    break;
            }
            //$('#' + root).append("<option id=\"" + orgUnit[i].seq + "\" orgstatu=\"" + orgUnit[i].status + "\" value=\"" + orgUnit[i].unit_id + "\">" + orgUnit[i].unit_name + "(" + orgUnit[i].unit_code + ")</option>");
        });
        if (OrgpickParam.OrgShowDis == false) {
            $("[orgstatu='disabled']").remove();
        }
    }
    else if (OrgpickParam.orgpicktype == 'unit' && OrgpickParam.tempdatas[seq].unit_level >= OrgpickParam.HighestUnitLevel) {
        CreateLabel(seq, OrgpickParam.tempdatas[seq].unit_name);
    }
    setTimeout(function () {
        $('.orgpickdialog .selectpicker').selectpicker('refresh');
    }, 500);
}

function showRolelist(orgRole) {
    if (orgRole != null && orgRole.length > 0) {
        if (OrgpickParam.allowRole.length > 0) {
            $.each(orgRole, function (i) {
                for (var k = 0; k < OrgpickParam.allowRole.length; k++) {
                    if (orgRole[i].role_id.indexOf(OrgpickParam.allowRole[k]) > 0) {
                        $('#ES_role').append("<option id=\"" + orgRole[i].seq + "\" orgstatu=\"" + orgRole[i].status + "\" value=\"" + orgRole[i].role_id + "\">" + orgRole[i].role_name + "(" + orgRole[i].role_id + ")</option>");
                        break;
                    }
                }
            });
        }
        else {
            $.each(orgRole, function (i) {
                $('#ES_role').append("<option id=\"" + orgRole[i].seq + "\" orgstatu=\"" + orgRole[i].status + "\" value=\"" + orgRole[i].role_id + "\">" + orgRole[i].role_name + "(" + orgRole[i].role_id + ")</option>");
            });
        }
        if (OrgpickParam.OrgShowDis == false) {
            $("#ES_role [orgstatu='disabled']").remove();
        }
    }
    setTimeout(function () {
        $('.orgpickdialog .selectpicker').selectpicker('refresh');
    }, 500);
}

function showUserlist(orgUser) {
    $.each(orgUser, function (i) {
        $('#ES_user').append("<option id=\"" + orgUser[i].seq + "\" orgstatu=\"" + orgUser[i].status + "\" value=\"" + orgUser[i].user_id + "\">" + orgUser[i].user_name + "(" + orgUser[i].user_id + ")</option>");
    });
    if (OrgpickParam.OrgShowDis == false) {
        $("#ES_user [orgstatu='disabled']").remove();
    }
    if ($('#ES_user option').length < 1 && OrgpickParam.orgpicktype == "user") {
        alert("此角色沒有人員，請選擇其他角色");
        $('#ES_user').empty();
    }
    setTimeout(function () {
        $('.orgpickdialog .selectpicker').selectpicker('refresh');
    }, 500);
}

function showfuzzylist(datas, type) {  //更新模糊查詢列表
    $('.cr-search-over-box ul').empty();
    if (datas != null && datas.length > 0) {
        if (type == "unit") {
            tempUnits(datas);
            $.each(datas, function (i) {
                if (datas[i].unit_level >= OrgpickParam.HighestUnitLevel && datas[i].unit_level <= OrgpickParam.LowestUnitLevel) {
                    $('.cr-search-over-box ul').append("<li orgstatu='" + datas[i].status + "' onclick=CreateLabel('" + datas[i].unit_id + "','" + datas[i].unit_name + "(" + datas[i].unit_code + ")')>" + datas[i].unit_name + "(" + datas[i].unit_code + ")</li>");
                }
            });
        }
        else if (type == "role") {
            tempRoles(datas);
            if (OrgpickParam.allowRole.length > 0) {
                $.each(datas, function (i) {
                    for (var k = 0; k < OrgpickParam.allowRole.length; k++) {
                        if (datas[i].role_id.indexOf(OrgpickParam.allowRole[k]) > 0) {
                            $('.cr-search-over-box ul').append("<li orgstatu='" + datas[i].status + "' onclick=CreateLabel('" + datas[i].role_id + "','" + datas[i].role_name + "(" + datas[i].role_id + ")')>" + datas[i].role_name + "(" + datas[i].role_id + ")</li>");
                            break;
                        }
                    }
                });
            }
            else {
                $.each(datas, function (i) {
                    $('.cr-search-over-box ul').append("<li orgstatu='" + datas[i].status + "' onclick=CreateLabel('" + datas[i].role_id + "','" + datas[i].role_name + "(" + datas[i].role_id + ")')>" + datas[i].role_name + "(" + datas[i].role_id + ")</li>");
                });
            }
        }
        else if (type == "user") {
            tempUsers(datas);
            if (OrgpickParam.allowRole.length > 0) {//篩選符合角色的人員加入
                $.each(datas, function (i) {
                    $.ajax({
                        url: OrgpickParam.URL + 'OrgTree/GetRootOrChild?Type=user&Sequence=' + encodeURIComponent(datas[i].user_id),
                        dataType: 'json',
                        async: false,
                        success: function (data) {
                            allowUserpush(data.data);
                        },
                        error: function (data) {
                            alert(data.responseText);
                            $(".cr-search-over-box").hide();
                            $('.se-pre-con-inform-loading').hide();
                        },
                    });

                });
                $(".cr-search-over-box").show();
                $('.se-pre-con-inform-loading').hide();
            }
            else {//直接加入人員
                $.each(datas, function (i) {
                    $('.cr-search-over-box ul').append("<li orgstatu='" + datas[i].status + "' onclick=CreateLabel('" + datas[i].user_id + "','" + datas[i].user_name + "(" + datas[i].user_id + ")')>" + datas[i].user_name + "(" + datas[i].user_id + ")&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + datas[i].primary_role_name + "</li>");
                });
            }
        }
        if (OrgpickParam.OrgShowDis == false) {
            $(".cr-search-over-box [orgstatu='disabled']").remove();
        }
    }
    if (!($('.cr-search-over-box li').length > 0)) {
        alert("沒有對應資料");
        $(".cr-search-over-box").hide();
    }
}
//篩選符合角色的人員
function allowUserpush(data) {
    var userRole = data.role;
    for (var j = 0; j < userRole.length; j++) {
        for (var k = 0; k < OrgpickParam.allowRole.length; k++) {
            if (userRole[j].role_id.indexOf(OrgpickParam.allowRole[k]) > 0) {
                $('.cr-search-over-box ul').append("<li orgstatu='" + data.status + "' onclick=CreateLabel('" + data.user_id + "','" + data.user_name + "(" + data.user_id + ")')>" + data.user_name + "(" + data.user_id + ")&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + data.primary_role_name + "</li>");
                return;
            }
        }
    }
}
//產生欲查詢標籤
function CreateLabel(val, name) {
    name = name.replace("選擇", "").trim();
    if (val != null && val != "" && name != null && name != "") {
        if (OrgpickParam.multiple == false) {
            $('.orgpickdialog .box-area').empty();
        }
        $('.orgpickdialog .no-file-text').remove();
        if ($("[orgpick-id=" + val + "]").length == 0) {
            if (OrgpickParam.orgpicktype == 'unit' && OrgpickParam.tempdatas[val].unit_level >= OrgpickParam.HighestUnitLevel && OrgpickParam.tempdatas[val].unit_level <= OrgpickParam.LowestUnitLevel) {
                $('.orgpickdialog .box-area').append("<div class=\"Links\" orgpick-id=\"" + val + "\"><div class=\"Links-peo\"><span>" + name + "</span><div class=\"XX01\"><i class=\"glyphicon glyphicon-remove\" onclick=\"orgpickerDel($(this))\"></i></div></div></div>");
            }
            else if (OrgpickParam.orgpicktype != 'unit') {
                $('.orgpickdialog .box-area').append("<div class=\"Links\" orgpick-id=\"" + val + "\"><div class=\"Links-peo\"><span>" + name + "</span><div class=\"XX01\"><i class=\"glyphicon glyphicon-remove\" onclick=\"orgpickerDel($(this))\"></i></div></div></div>");
            }
        }
        else {
            alert(name + " 已存在");
        }
    }
    $(".cr-search-over-box").hide();
    setTimeout(function () {
        $('.orgpickdialog .selectpicker').selectpicker('refresh');
    }, 500);
}
//輸出查詢結果(自行改寫區塊，也可自訂議outputfunction參數輸出)
function QueryTemp(datas, type, index) {
    console.log(datas);
    $("#searchresults").empty().append(JSON.stringify(datas, null, 2));
}
//可自定義outputfunction名稱
function outputfunctionName(datas, type, index) {
    console.log(datas);
    $("#searchresults").empty().append(JSON.stringify(datas, null, 2));
}
//處理權移轉輸出結果
function orgpickResultforAuthorityCHG(datas) {
    console.log(datas);
}

//$('').append('<div class="remodal remodal-small orgpickdialog" data-remodal-id="modal-Orgpicker" role="dialog" aria-labelledby="modal1Title" aria-describedby="modal1Desc">' +
//                             '<div class="se-pre-con-inform-loading" style="display:none"></div>' +
//                             '<button data-remodal-action="close" class="remodal-close" aria-label="Close"></button>' +
//                             '<div class="col-sm-12"><span id="modal1Title" class="popup-title-center">選擇單位/角色/人員</span></div>' +
//                             '<div class="col-sm-12"><div class="popup-input-title">快速查詢</div></div>' +
//                             '<div class="col-sm-12 content-box m-bottom10">' +
//                                 '<div class="search-select-box"><select id="searchtype" data-hide-disabled="true" data-size="5" tabindex="-98" class="select-text-center selectpicker show-tick select-h38">' +
//                                     '<option value="unit_code">單位代號</option>' +
//                                     '<option value="unit_name">單位名稱</option></select>' +
//                                     '<option value="role_id">角色編號</option>' +
//                                     '<option value="role_name">角色名稱</option></select>' +
//                                     '<option value="user_id">員工編號</option>' +
//                                     '<option value="user_name">員工名稱</option></select>' +
//                                 '</div>' +
//                                 '<div class="search-input-box-2"><input class="input" id="searchbox"><div class="cr-search-box search-bt"><a class="icon-search3" id="searchbutton"></a></div></div>' +
//                                 '<div class="cr-search-over-box search-over-box"><ul></ul></div>' +
//                             '</div>' +
//                             '<div id="treearea">'+
//                             '<div class="col-sm-12"><div class="popup-input-title" id="selectTitle">選擇單位/角色/人員</div></div>'+
//                             '</div>' +
//                             '<div class="col-sm-12 m-top20"><div class="line-x"></div></div>' +
//                             '<div class="col-sm-12 content-box m-top10"><div class="popup-input-title">您所選擇的單位/角色/人員</div><div class="box-area area-fix02"><div class="no-file-text"><b>-尚無單位/角色/人員-</b></div></div></div>' +
//                             '<div class="col-sm-12 content-box"><div class="popup-btn-row"><a data-remodal-action="cancel" class="remodal-cancel-btn">取消</a><a class="remodal-confirm-btn">確認</a></div></div>' +
//                         '</div>');

