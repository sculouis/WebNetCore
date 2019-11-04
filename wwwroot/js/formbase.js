
var model = {
    data1: {
        val: 1234.123,
        value: "主檔",
        select: "2",
        date: "2019-05-15",
        picker: true
    },
    datas: [
        {
            no: 1,
            title:"標題1",
            val: 1234567890123.123,
            value: "測試TextBox",
            select: "1",
            date: "2019-05-15",
            picker: true,
            checked: true,
            val1: 1234567890123.123,
            value1: "測試TextBox",
            select1: "1",
            date1: "2019-05-15",
            picker1: true,
            subDatas:[{data1:"測試1",data2:"測試2",data3:"測試3"},{data1:"測試1",data2:"測試2",data3:"測試3"}],
            checked1: true,
            isdelete: 0,
            isDetailOpen: true,
            isSubOpen:false,
        },
        {
            no: 2,
            title: "標題2",
            val: 1234567890123.123,
            value: "測試TextBox",
            select: "2",
            date: "2019-05-16",
            picker: false,
            checked: false,
            val1: 1234567890123.123,
            value1: "測試TextBox",
            select1: "1",
            date1: "2019-05-15",
            picker1: true,
            checked1: true,
            subDatas: [{ data1: "測試1", data2: "測試2", data3: "測試3" }, { data1: "測試1", data2: "測試2", data3: "測試3" }],
            isdelete: 0,
            isDetailOpen: true,
            isSubOpen:false,
    },
    ]

}

//指定要使用Vuex
Vue.use(Vuex)
Vue.use(window.vuelidate.default)
var _validators = window.validators
var required = _validators.required

const store = new Vuex.Store({
    state: {
        data:model
    },
    //取得屬性
    getters: {
        noDelData: function(state){
            return state.data.datas.filter(function (item) {
                return item.isdelete === 0
            })
        },
        data1: function (state) {
            return state.data.data1
        }
    },
    //註冊要update值的方法類似event
    mutations: {
        delObject: function (state,no) {
            var delObj = _.find(state.data.datas, function (item) { return item.no == no; })
            delObj.isdelete = 1
        },
        addObject: function (state, obj) {
            state.data.datas.push(obj)
        },
        setIsDetailOpen: function (state,objBool) {
            _.each(state.data.datas,function(item){
                item.isDetailOpen = objBool
            })
        }
    },
    //非同步取得資源放在這，例如呼叫Server WebAPI，用dispatch呼叫
    actions: {

    }
})


var vm = new Vue({
    el: '#formui',
    store: store,
    data: { isAllOpen: true },
    mounted: function () {

    },
    validations: {
        data1: {
            value: { required, }
            },
                val: { required, }
            },
                methods: {
                alertConfirm: function (no) {
                    var text = '是否刪除?'
                    $('#confirmText').empty();
                    $('[data-remodal-id=vue-confirm-modal]').find('#no').val(no)
                    if (typeof (text) != typeof ([])) {
                        var textSpan = "<span class='popup-text-left'>" + text + "</span>"
                        $('[data-remodal-id=vue-confirm-modal]').find('#confirmText').append(textSpan);
                        $('[data-remodal-id=vue-confirm-modal]').remodal().open();
                    }
                    else {
                        var textContent = ""
                        if (text.length < 1) {
                            return;
                        } else {
                            $.each(text, function (index, value) {
                                textContent += "<span class='popup-text-left'>" + value + "</span>"
                            });
                        }
                        $('[data-remodal-id=vue-confirm-modal]').find('#confirmText').append(textContent);
                        $('[data-remodal-id=vue-confirm-modal]').remodal().open();
                    }
                },
                addNewObject: function () {
                    var no = this.$store.state.data.datas.length
                    var dataObj = {
                        no: no,
                        title: "標題",
                        val: 0,
                        value: "",
                        select: "1",
                        date: "2019-05-30",
                        picker: true,
                        checked: true,
                        val1: 0,
                        value1: "測試TextBox",
                        select1: "1",
                        date1: "2019-05-15",
                        picker1: true,
                        checked1: true,
                        isdelete: 0,
                        isDetailOpen: true,
                        subDatas: [{ data1: "測試1", data2: "測試2", data3: "測試3" }, { data1: "測試1", data2: "測試2", data3: "測試3" }],
                        isSubOpen: false,
                    }

                   
                    this.$store.commit('addObject', dataObj)
                },
                delObject: function (no) {
                    this.$store.commit('delObject', no)   //trigger 將該筆註記為刪除
                },
                setAllOpenStatus: function () {
                    this.isAllOpen = !this.isAllOpen
                    this.$store.commit('setIsDetailOpen', this.isAllOpen)   //設定明細跟隨isAllOpen的狀態
                },
                },
    //計算屬性
    computed: {
                    noDelData: function () {
                        return this.$store.getters.noDelData
                    },
                    data1: function () {
                        return this.$store.getters.data1
                    }
    }
})

//=====================================================
// 訊息視窗
// 輸入參數text若是array則會多筆顯示
//=====================================================
$(function () {
    $(document).on('confirmation', '.remodal', function () {
        var no = $('[data-remodal-id=vue-confirm-modal]').find('#no').val()
        vm.delObject(no)
    });
}
)
