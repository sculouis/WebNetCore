let P_CustomFlowKey = $('#P_CustomFlowKey').val(); //流程代碼
let P_CurrentStep = $("#P_CurrentStep").val();//關卡數
let P_Status = $("#P_Status").val();//加會結案
let BPC = getModel();
let errVerify = [];
BPC.selectCurrencyCode = [];
BPC.selectgetPurchaseEmp = [];
BPC.ContractDetailList = null ? [] : BPC.ContractDetailList;
BPC.Flag = false;
BPC.ErrSubject = false;
let SalesDeptNo;
let selectCategory = getCategory();
let selectUom = getUom();

Vue.use(window.vuelidate.default);
var _validators = window.validators;
required = _validators.required;
//元件控制顯示控項
let _dataLavel = {
    _inputSubject: true,
    _inputDescription: true,
    _inputDecryptionDate: true,
    _inputContractStartDate: true,
    _inputContractEndDate: true,
    _inputBudgetAmount: true,
    _inputCurrencyCode: true,
    _inputPurchaseEmpNum: true,
    _inputInvoiceEmpNum: true,
    _inputContractDetail: true,
    _sectioninputQuoteSuplier: true,
    _sectioninputPurcaseLave: true,

    _txtSubject: false,
    _txtDescription: false,
    _txtDecryptionDate: false,
    _txtContractStartDate: false,
    _txtContractEndDate: false,
    _txtBudgetAmount: false,
    _txtCurrencyCode: false,
    _txtPurchaseEmpNum: false,
    _txtInvoiceEmpNum: false,
    _txtContractDetail: false,
}

Vue.prototype.$eventHub = new Vue(); // Global event bus

var _Vm = new Vue({
    el: '#formui',
    data: BPC, _dataLavel,
        mounted: function () {
            for (var i = 0; i < BPC.ContractDetailList.length; i++) {
                $(this.$refs.CategoryId).eq(i).selectpicker('refresh').val(BPC.ContractDetailList[i].CategoryId).selectpicker('refresh');
                $(this.$refs.UomCode).eq(i).selectpicker('refresh').val(BPC.ContractDetailList[i].UomCode).selectpicker('refresh');
            }
            this.$eventHub.$emit("addRow", this.addRow);
            $("#CurrencyCode").selectpicker('refresh');
            $(this.$refs.CurrencyCode).selectpicker('refresh').val(BPC.CurrencyCode).selectpicker('refresh');
            $("#PurchaseEmpNum").selectpicker('refresh');
            $(this.$refs.PurchaseEmpNum).selectpicker('refresh').val(BPC.PurchaseEmpNum).selectpicker('refresh');
            $(".datetimepicker1").on("dp.change", function (e) {
                switch (e.currentTarget.id) {
                    case 'txtDecryptionDate':
                        BPC.DecryptionDate = e.currentTarget.firstChild.value;
                        break;
                    case 'ContractStartDate':
                        $(this).data("DateTimePicker").minDate(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate());
                        BPC.ContractStartDate = e.currentTarget.firstChild.value;
                        break;
                    case 'ContractEndDate':
                        ContractStartDate = new Date(new Date(BPC.ContractStartDate));
                        ContractStartDate.setDate(ContractStartDate.getDate() + 1)
                        BPC.ContractStartDate != null ? $(this).data("DateTimePicker").minDate(ContractStartDate.getFullYear() + "/" + (ContractStartDate.getMonth() + 1) + "/" + ContractStartDate.getDate()) : $(this).data("DateTimePicker").minDate(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate());
                        BPC.ContractEndDate = e.currentTarget.firstChild.value;
                        break;
                    default:
                };
            });
            BPC.DecryptionDate = ConverLocalDate(BPC.DecryptionDate);
            //  EnableDOMObject($(_Vm.$refs.txtDecryptionDate));
            BPC.ContractStartDate = ConverLocalDate(BPC.ContractStartDate);
            // EnableDOMObject($(_Vm.$refs.ContractStartDate));
            BPC.ContractEndDate = ConverLocalDate(BPC.ContractEndDate);
            // EnableDOMObject($(_Vm.$refs.ContractStartDate));
            $("#MainForm").on('submit', function () { return false })
        },

    validations: {
        Subject: { required },
                Description: { required},
                        DecryptionDate: { required},
                                ContractStartDate: { required},
                                        ContractEndDate: { required},
        BudgetAmount: { required}
        },

            methods: {
                handle: function (msg) {
                    console.log(msg.id + "-" + msg.value);
                },
                addRow: function (index) {
                    let _vm = this;
                    var row = {
                        CategoryId: 0,
                        CategoryName: null,
                        CDetailID: 0,
                        CID: 00000000 - 0000 - 0000 - 0000 - 000000000000,
                        CreateBy: null,
                        DeleteBy: null,
                        IsDelete: false,
                        ItemDescription: null,
                        NegotiationPrice: null,
                        Price: 0,
                        UomCode: null,
                        UomName: null,
                        selectCategory: selectCategory,
                        selectUom: selectUom,
                    }
                    _vm.ContractDetailList.push(row);
                    this.$nextTick(function () {
                        $(this.$refs.CategoryId).eq(this.$refs.CategoryId.length - 1).selectpicker('refresh');
                        $(this.$refs.UomCode).eq(this.$refs.UomCode.length - 1).selectpicker('refresh');
                        BPC.Flag = false;
                    })
                },
                DeleteRow: function (element, index) {
                    element.IsDelete = true;
                    let _vm = this;
                    let delindex = index;
                    this.ContractDetailList[index].CDetailID == 0 ? _vm.ContractDetailList.splice(delindex, 1) : this.$set(this.ContractDetailList, index, element)
                },
                vue_change(target) {
                    switch (target.id) {
                        case "CurrencyCode":
                            this.CurrencyCode = target.value;
                            this.CurrencyName = target.options[target.selectedIndex].text;
                            break;
                        case "PurchaseEmpNum":
                            this.PurchaseEmpNum = target.value;
                            this.PurchaseEmpName = target.options[target.selectedIndex].text;
                            break;
                        default:
                    }
                },
                vue_selectchange(index, objSelecter, objValue, objName) {
                    switch (objName) {
                        case 'Category':
                            for (var i = 0; i < objSelecter.length; i++) {
                                if (objSelecter[i].Key == this.ContractDetailList[index].CategoryId) {
                                    this.ContractDetailList[index].CategoryName = objSelecter[i].Value
                                }
                            };
                            break;
                        case 'Uom':
                            var selected = objSelecter.filter(function (item, index, array) {
                                return item.Value === objValue;
                            })
                            this.ContractDetailList[index].UomName = selected[0].Key;
                            break;
                        default:
                    }
                },
                resetFlag: function () {
                    return BPC.Flag = false;
                },
                chkValue: function (obj) {
                    BPC.BudgetAmount = accounting.unformat(obj.value);
                }
            },
    watch: {
        IsEncryption: function (val) {
            if (BPC.IsEncryption) {
                EnableDOMObject($(_Vm.$refs.txtDecryptionDate))
            }
            else {
                _Vm.DecryptionDate = "";
                DisableDOMObject($(_Vm.$refs.txtDecryptionDate));
            }
            return this.val;
        },
        HaveYearlyContract: function (val) {
            if (this.HaveYearlyContract) {
                EnableDOMObject($('#ContractStartDate')); EnableDOMObject($('#ContractEndDate'));
            } else {
                this.ContractEndDate = ""; this.ContractStartDate = ""; DisableDOMObject($('#ContractStartDate')); DisableDOMObject($('#ContractEndDate'));
            }
            return this.val;
        },
        Subject: function (val) {
            this.Subject == "" ? errVerify.push("Subject") : errVerify.splice("Subject");
            return this.Subject ? true : this.Subject == "" ? true : false;
        },
        Description: function (val) {
            this.Description == "" ? errVerify.push("Description") : errVerify.splice("Description");
            return this.Description ? true : this.Description == "" ? true : false;
        },
        DecryptionDate: function (val) {
            this.DecryptionDate == "" ? errVerify.push("DecryptionDate") : errVerify.splice("DecryptionDate");
            return this.DecryptionDate ? true : this.DecryptionDate == "" ? true : false;
        },
        ContractStartDate: function (val) {
            this.DecryptionDate == "" ? errVerify.push("DecryptionDate") : errVerify.splice("DecryptionDate")
            return this.ContractStartDate ? true : this.ContractStartDate == "" ? true : false;
        },
        ContractEndDate: function (val) {
            this.ContractEndDate == "" ? errVerify.push("ContractEndDate") : errVerify.splice("ContractEndDate")
            return this.ContractEndDate ? true : this.ContractEndDate == "" ? true : false;
        },
        BudgetAmount: function (val) {
            this.BudgetAmount == "" ? errVerify.push("BudgetAmount") : errVerify.splice("BudgetAmount")
            return this.BudgetAmount ? true : this.BudgetAmount == "" ? true : false;
        },
    },
    //定義事件處理
    created: function () {
        BPC.ApplicantDepId = $("#ApplicantDepId").val();
        BPC.ApplicantDepName = $("#ApplicantDepName").val();
        BPC.ApplicantEmpNum = $("#ApplicantEmpNum").val();
        BPC.ApplicantName = $("#ApplicantName").val();
        BPC.CurrencyCode = BPC.CurrencyCode == null ? "TWD" : BPC.CurrencyCode;
        BPC.selectCurrencyCode = getCurrencyCode();
        BPC.selectgetPurchaseEmp = getPurchaseEmp();

        this.$eventHub.$on("data-msg", this.handle);
        if (BPC.ContractDetailList.length == 0) {
            this.$eventHub.$on("addRow", this.addRow)
        }
        else {
            for (var i = 0; i < BPC.ContractDetailList.length; i++) {
                BPC.ContractDetailList[i].selectCategory = selectCategory;
                BPC.ContractDetailList[i].selectUom = selectUom;
            }
        };
    },
    destory: function () {
        this.$eventHub.$off("data-msg", this.handle);
    },
    //計算屬性
    computed: {
        datas: function () {
            return BPC.ContractDetailList.filter(function (item) {
                return item.IsDelete === false
            })
        },
        BudgetAmountComa: {
            get() {
                return this.BudgetAmount == 0 ? "" : this.BudgetAmount.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            set(val) {
                this.BudgetAmount = val;
            }
        },
    },
})
this.getSaleDepNo();
this.fn_FlowLavel();

//Ajax傳遞

function getUom() {
    var rtn;
    $.ajax({
        async: false,
        url: '/VueBPC/getUom',
        dataType: 'json',
        type: 'POST',
        success: function (data, textStatus, jqXHR) {
            rtn = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("FIIS error");
        }
    });
    return rtn;
}
function getCategory() {
    var rtn;
    $.ajax({
        async: false,
        url: '/VueBPC/getCategory',
        dataType: 'json',
        type: 'POST',
        success: function (data, textStatus, jqXHR) {
            rtn = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("FIIS error");
        }
    });
    return rtn;
}
function getCurrencyCode() {
    var rtn;
    $.ajax({
        async: false,
        url: '/VueBPC/getCurrencyCode',
        dataType: 'json',
        type: 'POST',
        success: function (data, textStatus, jqXHR) {
            rtn = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("FIIS error");
        }
    });
    return rtn;
}
function getPurchaseEmp() {
    var rtn;
    $.ajax({
        async: false,
        url: '/VueBPC/getPurchaseEmp',
        dataType: 'json',
        type: 'POST',
        success: function (data, textStatus, jqXHR) {
            rtn = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("FIIS error");
        }
    });
    return rtn;
}
function getSaleDepNo() {
    $.ajax({
        url: '/BPC/SalesDeptNobyById',
        dataType: 'json',
        async: false,
        type: 'POST',
        data: { ApplicantEmpNum: BPC.ApplicantEmpNum },
        success: function (data, textStatus, jqXHR) {
            if (data != null) {
                SalesDeptNo = data;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}


//關卡流程判定
function fn_FlowLavel() {
    //====================
    //Part1流程設定
    //====================
    if (P_CurrentStep == 1 && (P_CustomFlowKey == "BPC_P1_001" || P_CustomFlowKey == "BPC_P1_002" || P_CustomFlowKey == "BPC_P1_003" || P_CustomFlowKey == "BPC_P1_001")) fnLevel();
    if (P_CurrentStep == 2 && (P_CustomFlowKey == "BPC_P1_001" || P_CustomFlowKey == "BPC_P1_002" || P_CustomFlowKey == "BPC_P1_003" || P_CustomFlowKey == "BPC_P1_004")) fn_DepManger_level1();
    if (P_CurrentStep == 3 && (P_CustomFlowKey == "BPC_P1_002" || P_CustomFlowKey == "BPC_P1_003" || P_CustomFlowKey == "BPC_P1_004")) fn_DepGeneralAffairs();
    if (P_CurrentStep == 4 && (P_CustomFlowKey == "BPC_P1_002" || P_CustomFlowKey == "BPC_P1_003" || P_CustomFlowKey == "BPC_P1_004")) fn_DepManger_level1();
    if (P_CurrentStep == 5 && (P_CustomFlowKey == "BPC_P1_002" || P_CustomFlowKey == "BPC_P1_003" || P_CustomFlowKey == "BPC_P1_004")) fn_DepManger_level1();
    if (P_CurrentStep == 6 && P_CustomFlowKey == "BPC_P1_004") fn_DepGeneralAffairs();
    if (P_CurrentStep == 7 && P_CustomFlowKey == "BPC_P1_004") fn_DepManger_level1();
    if (P_CurrentStep == 8 && P_CustomFlowKey == "BPC_P1_004") fn_DepManger_level1();

    //====================
    //Part2流程設定
    //====================
    if (P_CurrentStep == 1
        && (P_CustomFlowKey == "BPC_P2_001" || P_CustomFlowKey == "BPC_P2_002" || P_CustomFlowKey == "BPC_P2_003"
        || P_CustomFlowKey == "BPC_P2_004" || P_CustomFlowKey == "BPC_P2_005" || P_CustomFlowKey == "BPC_P2_006"
        || P_CustomFlowKey == "BPC_P2_007"))
        fn_DepManger_level2()

    if (P_CurrentStep == 2
        && (P_CustomFlowKey == "BPC_P2_001" || P_CustomFlowKey == "BPC_P2_002" || P_CustomFlowKey == "BPC_P2_003"
        || P_CustomFlowKey == "BPC_P2_004" || P_CustomFlowKey == "BPC_P2_005" || P_CustomFlowKey == "BPC_P2_006"
        || P_CustomFlowKey == "BPC_P2_007"))
        fn_DepMangerGeneralAffairs();

    if (P_CurrentStep == 3
        && (P_CustomFlowKey == "BPC_P2_001" || P_CustomFlowKey == "BPC_P2_002" || P_CustomFlowKey == "BPC_P2_003"
        || P_CustomFlowKey == "BPC_P2_004" || P_CustomFlowKey == "BPC_P2_005" || P_CustomFlowKey == "BPC_P2_006"
        || P_CustomFlowKey == "BPC_P2_007")) fn_DepMangerGeneralAffairs();

    if (P_CurrentStep == 4 && (P_CustomFlowKey == "BPC_P2_005" || P_CustomFlowKey == "BPC_P2_006" && P_CustomFlowKey == "BPC_P2_007")) fn_DepMangerGeneralAffairs();
    if (P_CurrentStep == 5 && (P_CustomFlowKey == "BPC_P2_005" || P_CustomFlowKey == "BPC_P2_006" || P_CustomFlowKey == "BPC_P2_007")) fn_DepMangerGeneralAffairs();
    if (P_CurrentStep == 6 && (P_CustomFlowKey == "BPC_P2_005" || P_CustomFlowKey == "BPC_P2_006" || P_CustomFlowKey == "BPC_P2_007")) fn_DepMangerGeneralAffairs();
    if ((P_CurrentStep == 7 || P_CurrentStep == 8 || P_CurrentStep == 9) && P_CustomFlowKey == "BPC_P2_007") fn_DepMangerGeneralAffairs();

    //====================
    //Part3流程設定
    //====================
    if (P_CustomFlowKey == "BPC_P3_001" && P_CurrentStep == "1") fn_DepMangerPurchase()
    if (P_CustomFlowKey == "BPC_P3_001" && P_CurrentStep == "2") fn_DepMangerGeneralAffairs()
    if (P_CustomFlowKey == "BPC_P3_001" && P_CurrentStep == "3") fn_DepMangerGeneralAffairs()
}

//共用元件使用
{
    function orgpickUserbtn() {
        orgpickUser({ RootUnitSeq: "0011", allowRole: ['MBR', 'OMG', 'MGR'], outputfunction: "BPCQueryTemp" })
    }
    function BPCQueryTemp(datas, type, row) {
        BPC.InvoiceEmpName = datas[0].user_name;
        BPC.InvoiceEmpNum = datas[0].user_id;
        resetInvoiceEmp();
    }
    function resetInvoiceEmp() {
        if (BPC.InvoiceEmpNum) {
            if ($('#P_CurrentStep').val() == '1' && $('#P_Status').val() != '4') {
                $('#invoiceLinks .no-file-text').hide();
                $('#invoiceLinks span').text(BPC.InvoiceEmpName + '(' + BPC.InvoiceEmpNum + ')');
                $('#invoiceLinks .Links').show();
            }
            else {
                $('#invoiceLinks').text(BPC.InvoiceEmpName + '(' + BPC.InvoiceEmpNum + ')');
            }
        }
        else {
            $('#invoiceLinks .Links').hide();
            $('#invoiceLinks .no-file-text').show();
        }
    }
}
//暫存
function draft() {
    blockPageForJBPMSend();
    var deferred = $.Deferred();
    var _url = BPC.BpcNum ? '/VueBPC/Edit' : '/VueBPC/Create';
    $.ajax({
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: BPC,
        async: false,
        success: function (data, textStatus, jqXHR) {
            if (data) {
                _formInfo.formGuid = data.CID;
                _formInfo.formNum = data.BpcNum;
                _formInfo.flag = true;
                deferred.resolve();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            _formInfo.flag = false;
            deferred.resolve();
        }
    });
    return deferred.promise();
}

//檢核
function Verify() {
    blockPageForJBPMSend();
    var deferred = $.Deferred();
    BPC.Flag = true;
    var _aryDetail = [];
    var _flagDetail = false;
    for (var i = 0; i < BPC.ContractDetailList.length; i++) {
        if (BPC.ContractDetailList[i].IsDelete == false && (BPC.ContractDetailList[i].CategoryId == 0
            || BPC.ContractDetailList[i].ItemDescription === null || BPC.ContractDetailList[i].UomCode === null
            || BPC.ContractDetailList[i].NegotiationPrice === null || BPC.ContractDetailList[i].Price == 0)) {
            _aryDetail.push("error");
        }
    }
    _aryDetail.indexOf('error') > -1 ? _flagDetail = true : _flagDetail = false;

    if ((!_flagDetail)
        || (BPC.Subject === null || BPC.Subject == '')
        || (BPC.Description === null || BPC.Description == '')
        || ((BPC.IsEncryption) && (BPC.DecryptionDate === null || bpc.DecryptionDate == '')
        || ((BPC.HaveYearlyContract && (BPC.ContractStartDate === null || BPC.ContractStartDate == '') || (BPC.ContractEndDate === null || BPC.ContractEndDate == ''))
             && ((BPC.HaveYearlyContract && (BPC.ContractStartDate === null || BPC.ContractStartDate == '') && (BPC.ContractEndDate === null || BPC.ContractEndDate == ''))))
        )) {
        deferred.reject();
    }
    else {
        deferred.resolve()
    }
    return deferred.promise();
}
//傳送
function Save() {
    var _url = BPC.BpcNum ? '/VueBPC/Edit' : '/VueBPC/Create';
    var deferred = $.Deferred();
    $.ajax({
        async: false,
        url: _url,
        dataType: 'json',
        type: 'POST',
        data: BPC,
        success: function (data, textStatus, jqXHR) {
            _formInfo.formGuid = data.CID;
            _formInfo.formNum = data.BpcNum;
            _formInfo.flag = true;
            deferred.resolve();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("更新失敗!")
            _formInfo.flag = false;
            deferred.resolve();
        }
    });
    return deferred.promise();
}
function ConverLocalDate(obj) {
    return obj == null ? obj = "" : obj = new Date(obj).getFullYear() + "-" + (new Date(obj).getMonth() + 1) + "-" + new Date(obj).getDate();
}
function fnLevel() {
    _dataLavel._sectioninputQuoteSuplier = false;
    _dataLavel._sectioninputPurcaseLavel = false;
    $('.datetimepicker1').datetimepicker({ format: 'YYYY-MM-DD' });
    BPC.IsEncryption ? EnableDOMObject($(_Vm.$refs.txtDecryptionDate)) : DisableDOMObject($(_Vm.$refs.txtDecryptionDate));
    BPC.HaveYearlyContract ? EnableDOMObject($('#ContractStartDate')) : DisableDOMObject($('#ContractStartDate'));
    BPC.HaveYearlyContract ? EnableDOMObject($('#ContractEndDate')) : DisableDOMObject($('#ContractEndDate'));
}
function fn_DepManger_level1() {
    _dataLavel._inputSubject = false;
    _dataLavel._inputDescription = false;

    _dataLavel._txtSubject = true;
    _dataLavel._txtDescription = true;

    _dataLavel._sectioninputQuoteSuplier = false;
    _dataLavel._sectioninputPurcaseLavel = false;
}

function GetPageCustomizedList(StepSequence) {
    SalesDeptNo = SalesDeptNo.replace(/\"/g, "");//總務
    var SignedID = SalesDeptNo.trim() + "-JA08000609";//總務
    if (SalesDeptNo != "") {
        if ((StepSequence == 3 || StepSequence == 6) &&
            (P_CustomFlowKey == "BPC_P1_003" || P_CustomFlowKey == "BPC_P1_004")) {
            return {
                SignedID: [SignedID], SignedName: ["總務"]
            };
        }
    }

    if ((P_CustomFlowKey == "BPC_P2_001" && P_CurrentStep == 3) ||
        (P_CustomFlowKey == "BPC_P2_002" && P_CurrentStep == 3) ||
        (P_CustomFlowKey == "BPC_P2_003" && P_CurrentStep == 3) ||
        (P_CustomFlowKey == "BPC_P2_004" && P_CurrentStep == 3) ||
        (P_CustomFlowKey == "BPC_P2_005" && P_CurrentStep == 6) ||
        (P_CustomFlowKey == "BPC_P2_006" && P_CurrentStep == 6) ||
        (P_CustomFlowKey == "BPC_P2_007" && P_CurrentStep == 9)) {
        return {
            SignedID: [BPC.PurchaseEmpNum], SignedName: [BPC.PurchaseEmpName]
        };
    }
    if (P_CustomFlowKey == "BPC_P3_001" && P_CurrentStep == 2) {
        return {
            SignedID: [BPC.InvoiceEmpNum], SignedName: [BPC.InvoiceEmpName]
        };
    }

    if ((String(P_CustomFlowKey).indexOf("BPC_P1") > -1) &&
        (StepSequence == 1 || StepSequence == 2 ||
        StepSequence == 4 || StepSequence == 5 ||
        StepSequence == 7 || StepSequence == 8)) {
        return {
            SignedID: [BPC.PurchaseEmpNum], SignedName: [BPC.PurchaseEmpName]
        };
    }
}