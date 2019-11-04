Vue.component('pop', {
    props: ['mess'],
    template: '#popInvoiceInfo'
})

var _Vue = new Vue({
    el: "#masterForm",
    data: {
        FormData: EMPData,
        AjaxData: {
            ExpenseKind: [],
            TravelNumList: [],
            VoucherBeauList: [],
            BankBranchList: [],
            ProjectCategory: [],
            CurrencyList: [],
            CityLongNameList: [],
            coaCompanyList: [],
            CurrencyList: [],
            // EmpInfo: {},
            DepartmentList: [],
            ProductList: [],
            ProductDetailList: [],
            PaymentCategory: [],
        },
    },

    created: function () {
        if (this.FormData.VendorInfo.EMPNum == null) {
            this.FormData.VendorInfo.EMPNum = document.getElementById("LoginEno").value;
            this.FormData.VendorInfo.EMPName = document.getElementById("LoginName").value;
        }

        this.FormData.EstimatePayDate = fun_DataToString(parseInt(this.FormData.EstimatePayDate.replace('/Date(', '').replace(')/', '')))

        //Dom
        $("#ExpenseKind").data("oldval", this.FormData.ExpenseKind)
        $("#spanEMPName").data("oldval", this.FormData.VendorInfo.EMPName + "(" + this.FormData.VendorInfo.EMPNum + ")")
    },

    mounted: function () {
        //ajax
        $.ajax({
            url: "/EMP/GetFromDataSet",
            dataType: 'json',
            type: 'POST',
            data: { sourceKeyId: this.FormData.EMPNum, VendorNum: this.FormData.VendorInfo.EMPNum },
            success: function (data) {
                if (data != null) {
                    _Vue.AjaxData.ExpenseKind = data.EMPExpenseKindList
                    _Vue.AjaxData.VoucherBeauList = data.VoucherBeauList
                    _Vue.AjaxData.TravelNumList = data.TravelNumList
                    _Vue.AjaxData.BankBranchList = data.BankBranchList
                    _Vue.AjaxData.ProjectCategory = data.ProjectCategory
                    _Vue.AjaxData.CurrencyList = data.CurrencyList
                    _Vue.AjaxData.CityLongNameList = data.CityLongNameList
                    _Vue.AjaxData.CurrencyList = data.CurrencyList
                    //  _Vue.AjaxData.EmpInfo = data.EmpInfo
                    _Vue.AjaxData.coaCompanyList = data.coaCompanyList
                    _Vue.AjaxData.DepartmentList = data.DepartmentList
                    _Vue.AjaxData.ProductList = data.ProductList
                    _Vue.AjaxData.ProductDetailList = data.ProductDetailList
                }
                else {
                    alert(data.Message)
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("【表單資料載入失敗】" + errorThrown)
            }
        }).done(function () {
            setTimeout(function () {
                $("select").selectpicker('refresh')
            }, 0)
        });
    },

    methods: {
        vue_orgpickUser() {
            fun_orgpickUser();
        },

        vue_changeConfirm(target) {
            let targetId = target.attributes["id"].value
            if (!fun_changeConfirm()) {
                let oldval = $(target).data("oldval")
                this.FormData[targetId] = oldval
                $(target).val(oldval).selectpicker('refresh')
            }
            else {
                $(target).data("oldval", target.value)
            }
        },

        vue_VoucherBeauChange(val) {
            let objlist = this.$data.AjaxData.VoucherBeauList.filter(function (o) {
                return o.bANNumber == val
            })

            if (objlist.length > 0) {
                let obj = objlist[0]
                this.$data.FormData.VoucherBeauName = obj.businessEntity
                this.$data.FormData.Books = obj.accountCode
                this.$data.FormData.BooksName = obj.accountName
                this.$data.FormData.isCreditCardOffice = obj.isCreditCardOffice
                this.$data.FormData.gvDeclaration = obj.gvDeclaration
            }
            else {
                this.$data.FormData.VoucherBeauName = null
                this.$data.FormData.Books = null
                this.$data.FormData.BooksName = null
                this.$data.FormData.isCreditCardOffice = null
                this.$data.FormData.gvDeclaration = null
            }
        },
        vue_BranchChange(val) {
            this.$data.FormData.VendorInfo.BranchName = this.$data.AjaxData.BankBranchList[val]
        },

        vue_popDetailShow: function () {
            // this.FormData.DetailList.push(1)
            $.ajax({
                url: "/EMP/GetPaymentCategoryItems",   //存取Json的網址
                type: "POST",
                dataType: 'json',
                data: { PaymentKind: $("#ExpenseKind").val() },
                success: function (data) {
                   // fun_setSelectOption($("#PaymentCategory"), data, false)
                },

                error: function (_xhr, _ajaxOptions, _thrownError) {
                    alert("取得請款大類失敗")
                }
            })

            //addcase01 側邊滑欄動畫//
            $('.popup-left-addcase').show(0);
            $('.popup-overlay').fadeIn(0);
            $('.popup-box').animate({ right: "0px" }, 300);
            $("html, body").css("overflow", "hidden");
            //addcase01 側邊滑欄動畫//
        }
    },

    filters: {
        enumPaymentStatus: function (val) {
            switch (val) {
                case 1:
                    return "請款審核中"
                    break;
            }
        }
    },

    watch: {
        'FormData.VendorInfo.EMPNum': {
            handler: function (val, oldval) {
                if (val == null) return false;
                if (val == oldval) return false;

                if (oldval != null && !fun_changeConfirm()) {
                    this.FormData.VendorInfo.EMPNum = oldval;
                }
                else {
                    watch_EMPNum(val, oldval == null)
                }
            },
            immediate: true
        },
    },

    computed: {
        VoucherBeauChange: function () {
            return this.FormData.VoucherBeau
        }
    }
})

//簽核流程變換 *跳關
function fun_stageChange() {
    _requestGetNextApprover.SendCase = 1//固定為1 *取得關主
    //若申請人與請款人為同一人跳至第二關主管覆核
    //若為卡處人員，使用卡處流程
    if (document.getElementById("P_CurrentStep").value == "1"
        && document.getElementById("P_JBPMUID").value == ""
        && document.getElementById("FillInDepName").value.includes(__CreditCardDepId)) {
        _requestGetNextApprover.CustomFlowKey = "EMP_P1_Credit";
        updateCustomFlowKey("EMP_P1_Credit");
        _stageInfo.CustomFlowKey = "EMP_P1_Credit";
        _stageInfo.NextCustomFlowKey = "EMP_P1_Credit"
        document.getElementById("P_CustomFlowKey").value = "EMP_P1_Credit";
    }

    if (_Vue.FormData.ApplicantEmpNum == _Vue.FormData.VendorInfo.EMPNum) {
        _requestGetNextApprover.AdditionStage = 2;
    }
    else {
        _requestGetNextApprover.AdditionStage = 1;
    }
    $.when(GetNextApprover(_requestGetNextApprover, 1)).done(function (data) {
        AppendSend(data);
        $('#SendSection input[value="1"]').attr("checked", true);
    });
    //console.log(_requestGetNextApprover.AdditionStage)
    //console.log(_requestGetNextApprover)
}

//人員選擇器
function fun_orgpickUser() {
    if (_unitData) {
        //6 為非總行人員 ,非總行則抓至處級 連處都沒有是高官直接抓第一筆
        unit_id = $.map(_unitData, function (obj) {
            if (obj.unit_level == 6)
                return obj.unit_id
        })

        if (unit_id.length == 0) {
            unit_id = $.map(_unitData, function (obj) {
                if (obj.unit_level == 4)
                    return obj.unit_id
            })
        }

        if (unit_id.length == 0) {
            orgpickUser({ RootUnitSeq: _unitData[0].unit_id, outputfunction: "QueryTempForVendor" })
        }
        else {
            orgpickUser({ RootUnitSeq: unit_id[0], outputfunction: "QueryTempForVendor" })
        }
    }
}

//人員選擇器ACTION
function QueryTempForVendor(datas) {
    if (datas.length > 0) {
        rtn = fun_changeConfirm();
        if (rtn) {
            //清空使用者資訊
            _Vue.FormData.AccountNum = "";
            _Vue.FormData.AccountName = "";
            _Vue.FormData.PaymentBranch = "";
            _Vue.FormData.StartTripDate = "";
            _Vue.FormData.EndTripDate = "";
            _Vue.FormData.TripUSAExchangeRate = 0;
            _Vue.FormData.TransportationMaxPay = 0;

            //清空使用者資訊

            _Vue.FormData.VendorInfo.EMPNum = datas[0].user_id
            _Vue.FormData.VendorInfo.EMPName = datas[0].user_name.replace(/\d+/, "").replace(/\s+/, "")

            fun_stageChange();
        }
    }
}

//實際請款員工改變
function watch_EMPNum(val) {
    $.ajax({
        url: "/EMP/GetEmpInfo",
        dataType: 'json',
        type: 'POST',
        data: { EmpNum: this.FormData.EMPNum, VendorNum: val },
        success: function (data) {
            if (data.Detail != null) {
                fun_subVendorNum(data.Detail)
            }
            else {
                alert(data.Message)
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("【獲取員工基本資料失敗】" + errorThrown)
        }
    });

    $.ajax({
        url: "/EMP/GetTravelNumList",
        dataType: 'json',
        type: 'POST',
        data: { EmpNum: _Vue.$data.FormData.EMPNum, VendorNum: val },
        success: function (data) {
            fun_subTravelNum(data.Detail)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("【獲取出差申請單號失敗】" + errorThrown)
        }
    });
}

//確認是否修改關鍵資料
function fun_changeConfirm() {
    rtn = true;

    if (_Vue.FormData.DetailList.length > 0) {
        rtn = confirm("修改此欄位會將請款明細清空，是否確認修改")
    }
    if (rtn) {
        _Vue.FormData.DetailList.forEach((o) => { o.IsDelete = true })
    }

    return rtn
}

//實際請款人資料處理
function fun_subVendorNum(data, AccountInfoReset) {
    _Vue.$data.FormData.VendorInfo.IsCardEmp = data.IsCardEmp
    _Vue.$data.FormData.VendorInfo.TransportationMaxPay = data.TransportationMaxPay
    _Vue.$data.FormData.VendorInfo.TripPayType = data.TripPayType
    _Vue.$data.FormData.VendorInfo.CostProfitCenter = data.CostProfitCenter
    _Vue.$data.FormData.PayAlone = data.PayAlone
    _Vue.$data.FormData.TaxCode = data.TaxInfo.taxCode
    _Vue.$data.FormData.VendorInfo.TaxInfo.IncomeNum = data.TaxInfo.IncomeNum
    _Vue.$data.FormData.VendorInfo.TaxInfo.CertficateKind = data.TaxInfo.CertficateKind
    _Vue.$data.FormData.VendorInfo.TaxInfo.PermanentPostNum = data.TaxInfo.PermanentPostNum
    _Vue.$data.FormData.VendorInfo.TaxInfo.PermanentAddress = data.TaxInfo.PermanentAddress
    _Vue.$data.FormData.VendorInfo.TaxInfo.ContactPostNum = data.TaxInfo.ContactPostNum
    _Vue.$data.FormData.VendorInfo.TaxInfo.ContactAddress = data.TaxInfo.ContactAddress
    _Vue.$data.FormData.VendorInfo.TaxInfo.TwoHeathInsuranceFlag = data.TaxInfo.TwoHeathInsuranceFlag
    _Vue.$data.FormData.VendorInfo.Remittance = data.Remittance
    if (AccountInfoReset) {
        _Vue.$data.FormData.VendorInfo.Branch = data.Branch
        _Vue.$data.FormData.VendorInfo.BranchName = data.BranchName
        _Vue.$data.FormData.VendorInfo.AccountNum = data.AccountNum
        _Vue.$data.FormData.VendorInfo.AccountName = data.AccountName
    }
    _Vue.$data.FormData.VendorInfo.TaxInfo.IncomeCode = data.IncomeCode
    _Vue.$data.FormData.VendorID = data.VendorID
    _Vue.$data.FormData.LocationID = data.VendorSiteId
    _Vue.$data.FormData.VendorSiteCode = data.VendorSiteDesc
    _Vue.$data.FormData.VendorInfo.CarNum = data.CarNum
    _Vue.$data.FormData.VendorInfo.CarContractDate = data.CarContractDate
}

//出差申請單號資料處理
function fun_subTravelNum(data) {
    _Vue.AjaxData.TravelNumList = []
    _Vue.FormData.StartTripDate = null
    _Vue.FormData.EndTripDate = null
    _Vue.FormData.TripUSAExchangeRate = 0

    if ($(data).length > 0) {
        $("#TravelNum").selectpicker({ title: "請選擇出差申請單號" })
        _Vue.AjaxData.TravelNumList.push(data)

        $("#TravelNum").selectpicker('setStyle', 'input-disable', 'remove').prop('disabled', false).selectpicker('refresh');
    }
    else {
        $("#TravelNum").selectpicker({ title: "無可供申請之出差申請單號" }).selectpicker('setStyle', 'input-disable', 'add').prop('disabled', true).selectpicker("refresh")
    }
}

//日期格式轉中文 yyyy-MM-dd
function fun_DataToString(value) {
    strDate = ""

    if (value) {
        DateObj = new Date(value)
        if (!isNaN(DateObj.getDate())) {
            strDate = DateObj.getFullYear() + "-" + funAddheadZero(2, (DateObj.getMonth() + 1)) + "-" + funAddheadZero(2, DateObj.getDate())
        }
    }

    return strDate
}

//字串補0
function funAddheadZero(len, val) {
    val = String(val);
    while (val.length < len) {
        val = "0" + val;
    }

    return val;
}

//依關卡取下一關人員 *僅有起單人非實際請款人時需使用
function GetPageCustomizedList(stepSequence) {
    console.log({ SignedID: $("#VendorNum").val(), SignedName: $("#empName").val() })
    return { SignedID: [_Vue.FormData.VendorInfo.EMPNum], SignedName: [_Vue.FormData.VendorInfo.EMPName] }
}