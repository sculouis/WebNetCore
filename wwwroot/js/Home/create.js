Vue.component('pr-table', {
    template: "#PRDetailTable",
    props: { open: Boolean, purchaseDatas: Array },
    data: function () {
        return {
            isAllOpen: false
        }
    },
    mounted:function(){
        this.isAllOpen = this.open
    },
    methods: {
        setAllOpenStatus: function () {
            this.isAllOpen = !this.isAllOpen
            //設定明細跟隨isAllOpen的狀態
            var self = this
            this.purchaseDatas.forEach(function (item,index,array) { item.isDetailOpen = self.isAllOpen });
        },
        deliveryChange: function (data, subdata) {  //送貨層任一為false則直屬明細層為false
            if (subdata.raChk === false) {
                data.sel = false
            }
        }
    }
}
    )

Vue.component('po-detail', {
    template: "#PODetailBlock",
    props: { open: Boolean, poDatas: Array },
    data: function () {
        return {
            isAllOpen: false
        }
    },
    mounted: function () {
        this.isAllOpen = this.open
    },
    methods: {
        setAllOpenStatus: function () {
            this.isAllOpen = !this.isAllOpen
            //設定明細跟隨isAllOpen的狀態
            var self = this
            this.poDatas.forEach(function (element) { element.isDetailOpen = self.isAllOpen });
        },
        deliveryChange: function (data, subdata) {  //送貨層任一為false則直屬明細層為false
            if (subdata.raChk === false) {
                data.sel = false
            }
        }
    }
}
    )

var vm = new Vue({
    el: '#InformationSection',
    store: store,
    data: function () {
        return {
            trace: true,
            PO: false,
            PoDate:"2019/10/01",
            PODetail: false,
            isAllOpen: false,
            isPoAllOpen: false,
            supplierResult: false,
            searchResult: false,
            showAddIcon: false,
            showDelIcon: false,
            prNum: "",
            quoteEmp: "",
            invoiceEmpId: "",
            invoiceEmp: "",
            itemDescription: "",
            seletData: "",
            supplier: "",
            supplierName: "",
            searchResultDatas: [],
            dataObj: {}
        }
    },
    mounted: function () {
        //取得供應商資料
        //this.$store.commit('getSupplier')
        // console.log(this.$store.getters.purchaseDatas)
    },
    methods: {
        setPoAllOpenStatus: function () {
            this.isPoAllOpen = !this.isPoAllOpen
            //設定明細跟隨isAllOpen的狀態
            this.noDelDataSelected.forEach(function (element) { element.isDetailOpen = this.isPoAllOpen });
        },
        openRemodal:function(id) {
            var sel = "[data-remodal-id=" + id + "]"
            var obj = $(sel).remodal();
            obj.open();
            },
        addressChange: function (e) {
            if (Number(e) > 0) {
                this.supplierResult = true
                //$.blockUI({ message: "請購報價資料讀取中...." })
                //this.$store.dispatch('searchListDatas')
            } else {
                this.supplierResult = false
                this.searchResult = false
                this.PO = false
                this.PODetail = false
            }
        },
        supplierChange: function (e) {
            // console.log(e)
            this.supplier = e
        },
        invoiceChange: function (e) {
            // console.log(e)
        },
        search: function () {
            //$.blockUI({ message: "請購單資料讀取中...." })
            //this.$store.dispath('getPurchase')
            this.searchResult = true
        },
        addData: function () {

        },
        delData: function () {

        },
        genPo: function () {
            this.PO = true
            this.PODetail = true
            this.searchResult = false
            console.log(this.$store)
        },
        acceptResult: function (e) {
            var self = this
            var sel = this.supplierDatas.find(function(item,index,array) {return item.value ===  self.supplier})
            this.supplierEmpty = false
            this.supplierName = sel.text + "(" + sel.value + ")"
            //console.log(`供應商選擇結果：${sel.value} - ${sel.text}`)
            //$.blockUI({ message: "供應商住址讀取中...." })
            //this.$store.dispatch('getAddress')
        },
        acceptEmpResult: function (e) {
            var self = this
            const sel = this.invoiceDatas.find(function(item) { return item.value === self.invoiceEmpId })
            this.invoiceEmp = sel.text + "(" + sel.value + ")"
            //console.log(`發票管理人選擇結果：${sel.value} - ${sel.text}`)
        },
    },
    //computed:{...mapGetters('po',['purchaseDatas','addressDatas','prDatas','quoteDatas','supplierDatas','invoiceDatas']),
    computed: {
        purchaseDatas:function(){
            return this.$store.getters.purchaseDatas
        },
        addressDatas:function(){
            return this.$store.getters.addressDatas
        },
        prDatas: function () {
            return this.$store.getters.prDatas
        },
        quoteDatas:function(){
            return this.$store.getters.quoteDatas
        },
        supplierDatas:function(){
            return this.$store.getters.supplierDatas
        },
        invoiceDatas:function(){
            return this.$store.getters.invoiceDatas
        },
        noDelDataSelected: function () {  //取得請購明細資料
            const selected = this.$store.getters.purchaseDatas.filter(function (item) { return item.sel === true })
            return selected
        }
    }
}
)