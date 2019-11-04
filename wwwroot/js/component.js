// 共用模組產生uuid
var myMixin = {
    created: function () {
        this.myid = this.uuid()
    },
    methods: {
        //產生uuid
        uuid: function () {
            var seed = Date.now();
            if (window.performance && typeof window.performance.now === "function") {
                seed += performance.now();
            }

            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (seed + Math.random() * 16) % 16 | 0;
                seed = Math.floor(seed / 16);

                return (c === 'x' ? r : r & (0x3 | 0x8)).toString(16);
            });

            return uuid;
        }
    }
}

//模組處理千分位
var valformatMix = {
    methods: {
        //取得只是純數字的值
        formatValue: function (val) {
            //var formattedValue = val.toString().replace(/^0+(?=\d)|\D*/g, "");
            var formattedValue = val.toString().replace(/[^0-9\.\-]+/g, "");
            return formattedValue;
        },
        //取得小數位數長度，最大4位
        pointerPos: function (val) {
            var afterPointer = 0;
            if (val.indexOf('.') > -1) {
                //如果是浮點數，則小數位數最大4位
                var pointerStart = val.indexOf('.') + 1;
                afterPointer = val.substring(pointerStart).length;
                if (afterPointer > 4) {
                    afterPointer = 4;
                }
            }
            return afterPointer;
        },
        handleChange: function (val) {
            var value = this.formatValue(val);
            value = this.splitNumber(value);
            return value;
        },
        //格式化千分位
        splitNumber: function (num) {
            var afterPointerLen = this.pointerPos(num)
            return accounting.formatNumber(num, afterPointerLen, ",");
        }
    },
}

// 頁面大區塊 
Vue.component('section-edit', {
    props: { title: String },
    template: '#sectionEdit',
})

// 頁面小區塊 
Vue.component('box', {
    props: { title: String },
    template: '#sectionBoxArea',
})

// 文字輸入框 
Vue.component('text-string', {
    template: '#textbox',
    props: ['value', 'smallSize', 'placeHolder'],
    data:function () {
        return {
            val: "",
            small: false
        };
    },
    mounted:function () {
        this.val = this.value;
        this.small = this.smallSize;
    },
    updated:function() {
        this.$emit('input', this.val);  //回寫對應到dataModel
    },
})

//數字輸入框
Vue.component('text-number', {
    template: '#textnumber',
    props: ['value', 'smallSize'],
    data:function() {
        return {
            val: "",
            pattern: "",
            small: false
        };
    },
    mounted:function() {
        this.val = this.value;
        this.small = this.smallSize;
    },
    methods: {
        checkNum:function(event) {
            const char = String.fromCharCode(event.keyCode)
            if (!/[0-9]|\./.test(char)) {
                event.preventDefault()
            }
        }
    },
    computed: {
        numVal: {
            get: function () {
                var unformatValue = this.val.toString().replace(/[^0-9\.\-]+/g, "");
                if (unformatValue.length - 1 === unformatValue.indexOf(".")) {
                    return this.val;
                } else {
                    let l10nEN = new Intl.NumberFormat("en-US");
                    let result = (Number(unformatValue)).toLocaleString('en-US', { maximumFractionDigits: 10 });
                    if (result === "NaN") {
                        return this.val;
                    } else {
                        return (Number(unformatValue)).toLocaleString('en-US', { maximumFractionDigits: 10 });
                    }
                }
            },
            set: function (newVal) {
                if (newVal !== "") {
                    var unformatValue = newVal.toString().replace(/[^0-9\.\-]+/g, "");
                    unformatValue = unformatValue.replace(/[^\d.]/g, ""); //先把非數字的都替換掉，除了數字和. 
                    unformatValue = unformatValue.replace(/^\./g, ""); //必須保證第一個為數字而不是. 
                    unformatValue = unformatValue.replace(/\.{2,}/g, "."); //保證只有出現一個.而沒有多個. 
                    unformatValue = unformatValue.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                    this.$emit("input", Number(unformatValue));
                    // this.val = Number(unformatValue);
                    this.val = unformatValue;
                } else {
                    this.val = ""
                    this.$emit("input", "");
                }
            }
        }
    }
})

//下拉選擇框
Vue.component('selecter', {
    template: '#selectpicker',
    mixins: [myMixin],
    props: { smallSize: Boolean, optionData: Array },
    data:function() {
        return {
            val: "",
            myid: "",
            selectDatas: [],
            small: false,
            items:[],
            selectH30: 'select-h30',
            selectH38: 'select-h38',
        };
    },
    methods: {
        change: function (e) {
            this.$emit('change', event.target.value)
        }
    },
    mounted:function() {
        //console.log($(this.$refs.select).val())
        this.val = this.value
        this.small = this.smallSize
         this.items = this.optionData
        // $("#" + this.myid).val(this.val)
        // $("#" + this.myid).selectpicker('refresh')
    },
    updated:function() {
        this.$emit('input', this.val); //回寫對應到dataModel
        $("#" + this.myid).val(this.val)
        $("#" + this.myid).selectpicker('refresh')
    },
    // computed: {
    //     inputListeners:function() {
    //         var vm = this
    //         // `Object.assign` merges objects together to form a new object
    //         return Object.assign({},
    //             // We add all the listeners from the parent
    //             this.$listeners,
    //             // Then we can add custom listeners or override the
    //             // behavior of some listeners.
    //             {
    //                 // This ensures that the component works with v-model
    //                 change:function(event) {
    //                     vm.$emit('change', event.target.value)
    //                 }
    //             }
    //         )
    //     },
        //items:function() {
        //    // this.selectDatas = this.optionData
        //    return this.optionData
        //}
    }
)

//日期輸入框
Vue.component('date-picker', {
    template: '#datepicker',
    props: {title:String, value:String,smallSize:Boolean},
    mixins: [myMixin],
    data:function() {
        return {
            val: "",
            myid: "",
            small:false
        };
    },
    mounted: function() {
        this.val = this.value
        this.small = this.smallSize
        //為了帶入datepicker的db.change事件必需如此做
        //this 感覺是date-picker這個scope，所以要新增一個scope
        const self = this   
        $(this.$refs.date).datetimepicker({
            format: 'YYYY/MM/DD',
        });    
        $("#" + this.myid).on("dp.change", function (e) {
            //vm.$emit('input', e.currentTarget.firstChild.value);
            self.val = e.currentTarget.firstChild.value
            self.$emit('input', self.val);   //回對datamodel
        })
    }
    }
)

// 選項輸入框 
Vue.component('radio-button', {
    template: '#radiobutton',
    props: { id: String, title: String, value: Boolean },
    mixins: [myMixin],
    data:function() {
        return { val: null, myTitle: "" }
    },
    mounted:function() {
        this.val = this.value
        this.myTitle = this.title
    },
    updated:function() {
        let setResult = (this.val === 'true')
        this.$emit("input", setResult)
    }
})

// 檢查輸入框 
Vue.component('check-box', {
    props: ['id', 'title', 'value'],
    template: '#checkbox',
    mixins: [myMixin],
    data: function () {
        return { val: null,myTitle:"" }
    },
    mounted: function () {
        this.val = this.value
        this.myTitle = this.title
    },
    updated: function () {
        if (this.val === true) {
            this.$emit("input", true)
        } else if (this.val === false) {
            this.$emit("input", false)
        }
    }
})

//按鈕
Vue.component('button-action', {
    template: '#buttonaction',
    props: { iconName: String, bgColor: String },
})

//文字顯示
Vue.component('disable-text', {
    props: { placeHolder: String, text: String },
    template: '#disabletext',
})

//選擇器結果框
Vue.component('links-peo', {
    props: { selText: String },
    template: '#linkspeo',
    data:function() {
        return {
            empty: true
        }
    },
    methods: {
        remove:function() {
            this.empty = !this.empty
        }
    },
    computed: {
        text:function() {
            if (this.selText !== "") {
                this.empty = false
            }
            return this.selText
        }
    }
})


//確認視窗
Vue.component('remodal', {
    props: { remodalId: String, title: String },
    template: '#remodal',
    data: function () {
        return {
            rid: ""
        }
    },
    mounted:function() {
        this.rid = this.remodalId
    },
    methods: {
        confirm:function(e) {
            //console.log(`press confirm button -> remodalId:${this.rid}`)
            console.log(e)
            this.$emit('accept', '選擇結果')
        },
        cancel:function(e) {
            //console.log(`press cancel button -> remodalId:${this.rid}`)
            console.log(e)
        }
    }
})

//顯示全部或隱藏全部
Vue.component('show-all',{
    template: "#showall",
    props: { open: Boolean },
    methods: {
        setAllOpenStatus: function () {
            //console.log(this.allOpen)
            this.$emit("accept")
        },
    }
        }
    )

//顯示明細或隱藏明細
Vue.component('show-detail',{
    template: "#showdetail",
    props: { isDetailOpen: Boolean },
    mounted:function(){
        //console.log(this.isDetailOpen)
    },
    methods: {
        setDetailOpenStatus: function () {
            this.$emit("click")
        },
    }
}
    )

//顯示最底層明細或隱藏最底層明細
Vue.component('show-subdetail', {
    template: "#showsubdetail",
    props: { isSubOpen: Boolean },
    mounted:function(){
        //console.log(this.isSubOpen)
    },
    methods: {
        setSubOpenStatus: function () {
            this.$emit("click")
        },
        }
}
    )
