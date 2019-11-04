//指定要使用Vuex
Vue.use(Vuex)
//測試資料
//供應商資料
supplierDatasTest = [{ value: 1, text: "瑱下雜誌" }, { value: 2, text: "蝴蝶蘭供私" }]
//供應商住址資料
addressDatasTest = [{ value: 1, text: "台北市中山北路一段10號" }, { value: 2, text: "新北市忠孝路二段10號" }]
//請購單編號資料
prDatasTest = [{ value: 1, text: "PR201910280001" }, { value: 2, text: "PR201910280002" }]
//報價經辦資料
quoteDatasTest = [{ value: 1, text: "張三豐" }, { value: 2, text: "裏四西" }]
//發票管理人資料
invoiceDatasTest = [{ value: 1, text: "照前孫" }, { value: 2, text: "週五王" }]

prdataTest = [{
    _id : "5dae9bc4038135702f0ccf5d",
    sel : false,
    prNum : "PR20191021001",
    quoteNum : "Q20191021001",
    category : "辦公室用具",
    itemDescription : "桌子",
    amount : 60,
    unitName : "打",
    minQuote : true,
    unitAmount : "123",
    currency : "TWD",
    originalQuote : "123456",
    quoteEmp : "游OO(17962)",
    invoiceEmp : "黃OO(17845)",
    isdelete : 0,
    isDetailOpen : true,
    isSubOpen : false,
    subDatas:[{
        raChk : false,
        receiveAmount : 6,
    paymentDep : "1399-XX分行",
    receiveDep : "1399-XX分行"
},{
raChk : false,
receiveAmount : 10,
paymentDep : "1399-XX分行",
receiveDep : "1399-XX分行"
}]
},
{
    _id: "5dae9bc4038135702f0ccf5d",
    sel: false,
    prNum: "PR20191021002",
    quoteNum: "Q20191021002",
    category: "辦公室用具",
    itemDescription: "電腦",
    amount: 6,
    unitName: "台",
    minQuote: true,
    unitAmount: "123",
    currency: "TWD",
    originalQuote: "123456",
    quoteEmp: "游OO(17962)",
    invoiceEmp: "黃OO(17845)",
    isdelete: 0,
    isDetailOpen: true,
    isSubOpen: false,
    subDatas: [{
        raChk: false,
        receiveAmount: 2,
        paymentDep: "1399-XX分行",
        receiveDep: "1399-XX分行"
    }, {
        raChk: false,
        receiveAmount: 9,
        paymentDep: "1399-XX分行",
        receiveDep: "1399-XX分行"
    }]
}
]
const store = new Vuex.Store({
    state: {
        model: prdataTest,
        addressDatas: addressDatasTest,
        prDatas: prDatasTest ,
        quoteDatas: quoteDatasTest,
        supplierDatas: supplierDatasTest,
        invoiceDatas: invoiceDatasTest
    },
    //取得屬性
    getters: {
        dataLength: function (state) {
            return state.model.length + 1
        },
        purchaseDatas: function (state) {
            //明細選擇後送貨層資料全部選擇
            state.model.forEach(function(element) {
                if (element.sel === true) {
                    element.subDatas.forEach(function (item) { item.raChk = true })
                }
            });
            return state.model.filter(function (item) { return item.isdelete === 0 })
            // return state.model
        },
        //供應商資料
        supplierDatas: function (state) {
            return state.supplierDatas
        },
        //供應商住址資料
        addressDatas: function (state) {
            return state.addressDatas
        },
        //請購單編號資料
        prDatas: function (state) {
            return state.prDatas
        },
        //報價經辦資料
        quoteDatas: function (state) {
            return state.quoteDatas
        },
        //發票管理人資料
        invoiceDatas: function (state) {
            return state.invoiceDatas
        }
    },
    //註冊要update值的方法類似event,用commit呼叫
    //mutations: {
    //    //請購單資料填入
    //    purchaseData: function (state, res) {
    //        state.model = res.data
    //        $.unblockUI('')
    //    },
    //    //供應商資料
    //    supplier: function (state, res) {
    //        state.supplierDatas = res.data
    //        $.unblockUI('')
    //    },
    //    //供應商住址
    //    address: function (state, res) {
    //        state.addressDatas = res.data
    //        $.unblockUI('')
    //    },
    //    //請購單編號
    //    prNums: function (state, res) {
    //        state.prDatas = res.data
    //    },
    //    //報價經辦
    //    quote: function (state, res) {
    //        state.quoteDatas = res.data
    //        $.unblockUI('')
    //    },
    //    //發票管理人
    //    invoice: function (state, res) {
    //        state.invoiceDatas = res.data
    //    }
    //},
    //actions: {
    //    //取得查詢(ajax從server取得)請購單資料
    //    getPurchase: function (context) {
    //        axios.get(urlPrResult)
    //        .then(response => {
    //            context.commit("purchaseData", response)
    //        })
    //        .catch(err => console.log(err))
    //    },
    //    getSupplier: function (context) {
    //        //供應商
    //        axios.get(urlCodeResult + '?kind=supplier')
    //        .then(response => {
    //            context.commit("supplier", response)
    //        })
    //        .catch(err => console.log(err))
    //    },
    //    getAddress: function (context) {
    //        //供應商住址
    //        axios.get(urlCodeResult + '?kind=address')
    //        .then(response => {
    //            context.commit("address", response)
    //        })
    //        .catch(err => console.log(err))
    //    },
    //    //取得查詢List資料
    //    searchListDatas: function (context) {
    //        //請購單編號    
    //        axios.get(urlCodeResult + '?kind=prNum')
    //        .then(response => {
    //            context.commit("prNums", response)
    //        })
    //        .catch(err => console.log(err))
    //        //報價經辦
    //        axios.get(urlCodeResult + '?kind=quote')
    //        .then(response => {
    //            context.commit("quote", response)
    //        })
    //        .catch(err => console.log(err))
    //        //發票管理人
    //        axios.get(urlCodeResult + '?kind=invoice')
    //        .then(response => {
    //            context.commit("invoice", response)
    //        })
    //        .catch(err => console.log(err))
    //    }
    //}
}
)