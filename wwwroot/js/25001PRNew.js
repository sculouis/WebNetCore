let _previousAmount;
$(function () {
    InitialSet_New();
});

function InitialSet_New() {
    //})
    $(document).on(
        {
            mouseenter:
                function () {
                    $(this).find('#DeleteThisENPDetail').show();
                },
            mouseleave:
                function () {
                    $(this).find('#DeleteThisENPDetail').hide();
                }
        },
        "#ENPDetailTable tbody"
    )
    // $(document).on(
    //    {
    //        mouseenter:
    //            function () {
    //                $(this).find('#DeleteThisENPDetail').show();
    //            },
    //        mouseleave:
    //            function () {
    //                $(this).find('#DeleteThisENPDetail').hide();
    //            }
    //    },
    //    "#PRTableTemplate tbody"
    //)

    $(document).on(
    {
        mouseenter:
            function () {
                if ($("#hidHandType").val() != "ReadOnly") {
                    $(this).find('#DeletePrYcDev').show();
                }
            },
        mouseleave:
            function () {
                $(this).find('#DeletePrYcDev').hide();
            }
    },
    "#PRTableTemplate tbody"
)

    //$(document).on(
    //    {
    //        mouseenter:
    //            function () {
    //                $(this).find('#DeleteThisENPDetail').show();
    //            },
    //        mouseleave:
    //            function () {
    //                $(this).find('#DeleteThisENPDetail').hide();
    //            }
    //    },
    //    "#PROneTimeTableTemplate tbody"
    //)

    $(document).on(
        {
            mouseenter:
                function () {
                    if ($("#hidHandType").val() != "ReadOnly") {
                        $(this).find('#DeletePrOnceDev').show();
                    }
                },
            mouseleave:
                function () {
                    $(this).find('#DeletePrOnceDev').hide();
                }
        },
        "#PROneTimeTableTemplate tbody"
    )

    $(document).on(
      {
          mouseenter:
              function () {
                  $(this).find('#DeleteThisENPDetail').show();
              },
          mouseleave:
              function () {
                  $(this).find('#DeleteThisENPDetail').hide();
              }
      },
     "#PROneTimeDetailTable tbody"
  )

    $(document).on(
        {
            mouseenter:
                function () {
                    $(this).find('#DeleteThisPROneTimeDetail').show();
                },
            mouseleave:
                function () {
                    $(this).find('#DeleteThisPROneTimeDetail').hide();
                }
        },
        "#PROneTimeDetailTable tbody"
    )

    $(document).on(
        {
            mouseenter:
                function () {
                    $(this).find('#DeleteThisAmortizationDetail').show();
                },
            mouseleave:
                function () {
                    $(this).find('#DeleteThisAmortizationDetail').hide();
                }
        },
        "#AmortizationDetailTable tbody"
    )

    // 供應商選擇
    //==========================================
    $(document).on('click', '#VendorConfirm', function () {
        if (vendorOutput == undefined) {
            return;
        }
        //==========================================
        // 供應商所扣
        //==========================================
        $('#AccountSelectBtn').remove();
        let isIncomeDeducation = false;
        if (vendorOutput.IsIncomeDeduction == 'true') {
            isIncomeDeducation = true;
        }
        $('#IsIncomeDeduction').prop('checked', isIncomeDeducation).trigger('change');
        //==========================================
        // 是否為單獨付款
        //==========================================
        let isSinglePayment = false;
        if (vendorOutput.IsSinglePayment == 'true') {
            isSinglePayment = true;
        }
        $('#IsSinglePayment').prop('checked', isSinglePayment);
        //==========================================
        // 付款方式
        //==========================================
        PaymentWayAppend(vendorOutput.VendorType, vendorOutput.VendorNum);
        //==========================================
        // 預付款沖銷
        //==========================================
        if ($('#undone-vendorSelect').length > 0) {
            $('#undone-vendorSelect').remove();
        }
        $('#PrePaymentTable').remove();
        let PrePaymentTable = $('#PrePaymentTableTemplate').clone().attr('id', 'PrePaymentTable');
        $(PrePaymentTable).find('#PrePaymentDetailTemplate').attr('id', 'PrePaymentDetail');
        $('div#PrePaymentRoot').append(PrePaymentTable);
        PrePaymentTableDetail(vendorOutput.VendorNum);
        $('#PrePaymentTable').show();
    })

    $('input[type=radio][name=supplier]').on('change', function () {
        switch ($(this).val()) {
            case 'on':
                $('#NewsupplieUpload').show();
                break;
            case 'off':
                $('#NewsupplieUpload').hide();
                break;
        }
    });

    //==========================================

    //==========================================
    // 新增一次性請購明細
    //==========================================
    $(document).on('click', '#PROneTimeDetailCreate', PROneTimeDetailCreate);

    //==============================
    // 新增一次性請購明細 function-beCalled
    //==============================
    function PROneTimeDetailCreate() {
        let e = $('#PROneTimeDetailCreate');

        let template = $('#PROneTimeDetailTableTemplate').clone().attr('id', 'PROneTimeDetailTable');
        $(template).find('#PROneTimeDetailCloneTemplate').attr('id', 'PROneTimeDetail_0');

        $('#PROneTimeDetailRoot').find('#enpDetail-undone-vendorSelect').hide();
        $(e).parents('div.content-box').append($(template).show())
        $(template).find('.selectpickerInDetail').selectpicker();

        $(e).remove();

        //$("[alt='PRInfoTable']").on("change", "[alt=sel_PRInfoUnit]", function () {
        //    if ($(this).val() == "AMT") {
        //        $(this).closest("td").prev("[name=QuantityPurchase]").children("b").text("1");

        //        fun_ClassReset($(this).closest("td").prev("[name=QuantityPurchase]").children("b"));
        //    }
        //    else {
        //        $(this).closest("td").prev("[name=QuantityPurchase]").children("b").text("0");
        //    }
        //})

        $("[alt='PRInfoTable']").on("click", "[alt=linkpopAddPerson]", function () {
            fun_popAddPerson_Send($(this))
        })
    }

    //==========================================
    // 新增協議請購明細
    //==========================================
    $(document).on('click', '#ENPDetailCreate', CreateENPDetail);

    //==============================
    // 新增協議請購明細 function-beCalled
    //==============================
    function CreateENPDetail() {
        let e = $('#ENPDetailCreate');
        if ($('#PleaseType option:selected').val() == '') {
            alertopen("請先選擇請款類別");
            return;
        }
        let template = $('#ENPDetailTableTemplate').clone().attr('id', 'ENPDetailTable');
        $(template).find('#ENPDetailCloneTemplate').attr('id', 'ENPDetail_0');

        $(template).find('.AmortizationStartDateInput').datetimepicker({ format: 'YYYY-MM-DD' });
        $(template).find('.AmortizationEndDateInput').datetimepicker({ format: 'YYYY-MM-DD' });

        $(template).find('#ENPDetailOriginalAmountInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', recalculateMoney);
        $(template).find('#ENPDetailOriginalTaxInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', recalculateMoney);
        $(e).parents('div.content-box').append($(template).show())
        $(template).find('.selectpickerInDetail').selectpicker();
        $('#enpDetail-undone-vendorSelect').hide();
        $('#amoritizationDetail-undone-vendorSelect').text('請按下【新增分攤明細】鈕或【上傳分攤明細】');
        $(e).remove();

        $("[alt='PRInfoTable']").on("click", "[alt=linkpopPOitemList]", function () {
            fun_popPOitemList_Send($(this))
        })
    }

    //協議採購 展開單筆「Detail明細」..
    $(document).on('click', '#ExpandENPDetail', function () {
        if ($(this).find('.glyphicon-chevron-down').length > 0) {
            SwitchHideDisplay([], [$(this).parents('tbody').find('.ENPDetail')]);
        } else {
            SwitchHideDisplay([$(this).parents('tbody').find('.ENPDetail')], []);
        }
        $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up')
    });

    //一次性採購  展開單筆「Detail明細」..
    $(document).on('click', '#ExpandPROneTimeDetail', function () {
        if ($(this).find('.glyphicon-chevron-down').length > 0) {
            SwitchHideDisplay([], [$(this).parents('tbody').find('.PROneTimeDetail')]);
        } else {
            SwitchHideDisplay([$(this).parents('tbody').find('.PROneTimeDetail')], []);
        }
        $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up')
    });

    //一次性採購  刪除「Detail明細」...
    $(document).on('click', '#DeleteThisPROneTimeDetail', function () {
        if ($(this).find('.list-open-icon').length > 0) {
            SwitchHideDisplay([], [$('.PROneTimeDetail')]);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up')
        } else {
            SwitchHideDisplay([$('.PROneTimeDetail')], []);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
        }
        $(this).find('.toggleArrow').toggleClass('list-close-icon list-open-icon')
    });

    //一次性採購  展開ALL「Detail明細」..
    $(document).on('click', '#ExpandAllOneTimeDetail', function () {
        if ($(this).find('.list-open-icon').length > 0) {
            SwitchHideDisplay([], [$('.PROneTimeDetail')]);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up')
        } else {
            SwitchHideDisplay([$('.PROneTimeDetail')], []);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
        }
        $(this).find('.toggleArrow').toggleClass('list-close-icon list-open-icon')
    });

    //協議採購 展開ALL「Detail明細」..
    $(document).on('click', '#ExpandAllENPDetail', function () {
        if ($(this).find('.list-open-icon').length > 0) {
            SwitchHideDisplay([], [$('.ENPDetail')]);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up')
        } else {
            SwitchHideDisplay([$('.ENPDetail')], []);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
        }
        $(this).find('.toggleArrow').toggleClass('list-close-icon list-open-icon')
    });

    //協議採購 新增「Detail明細」..
    $(document).on('click', '#AppendENPDetail', function () {
        let count = $('#ENPDetailTable tbody').length;
        let template = $('#ENPDetailCloneTemplate').clone().attr('id', 'ENPDetail_' + count);
        $(template).find('td.DetailSerno').text(count + 1);
        $(template).find('.AmortizationStartDateInput').datetimepicker({ format: 'YYYY-MM-DD' });
        $(template).find('.AmortizationEndDateInput').datetimepicker({ format: 'YYYY-MM-DD' });
        $(template).find('.selectpickerInDetail').selectpicker();
        $(template).find('#ENPDetailOriginalAmountInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', recalculateMoney);
        $(template).find('#ENPDetailOriginalTaxInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', recalculateMoney);

        $('#ENPDetailTable').append(template);

        var j = 1;

        $('#ENPDetailTable tbody').children("tr").find('td.DetailSerno').each(function () {
            $(this).text(j);
            j++;
        })

        $("[alt='PRInfoTable']").on("click", "[alt=linkpopPOitemList]", function () {
            fun_popPOitemList_Send($(this))
        })
    });
    //一次性採購 新增一筆Detail明細...
    $(document).on('click', '#AppendPROneTimeDetail', function () {
        let count = $('#PROneTimeDetailTable tbody').length;
        let template = $('#PROneTimeDetailCloneTemplate').clone().attr('id', 'PROneTimeDetail_' + count);
        $(template).find('td.DetailSerno').text(count + 1);
        $(template).find('.selectpickerInDetail').selectpicker();
        $('#PROneTimeDetailTable').append(template);

        //$("[alt='PRInfoTable']").on("change", "[alt=sel_PRInfoUnit]", function () {
        //    if ($(this).val() == "AMT") {
        //        $(this).closest("td").prev("[name=QuantityPurchase]").children("b").text("1");
        //        fun_ClassReset($(this).closest("td").prev("[name=QuantityPurchase]").children("b"));
        //    }
        //    else {
        //        $(this).closest("td").prev("[name=QuantityPurchase]").children("b").text("0");
        //    }
        //})

        var j = 1;

        $('#PROneTimeDetailTable tbody').children("tr").find('td.DetailSerno').each(function () {
            $(this).text(j);
            j++;
        })

        $("[alt='PRInfoTable']").on("click", "[alt=linkpopAddPerson]", function () {
            fun_popAddPerson_Send($(this))
        })
    });

    //協議採購Detail 新增送貨明細...
    $(document).on('click', '#AppendPrDetail', function () {
        let count = $('#PRTableTemplate tbody').length;
        let template = $('#PROneTimeDetailCloneTemplate_Temp').clone().attr('id', 'PRDetail_' + count);
        $(template).find('td.DetailSerno').text(count + 1);

        $(template).find('.selectpickerInDetail').selectpicker();
        template.show();
        $('#PRTableTemplate').append(template);

        var j = 1;
        $('#PRTableTemplate tbody').children("tr").find('td.DetailSerno').each(function () {
            $(this).text(j);
            j++;
        })
    });

    //一次性採購 新增送貨明細...
    $(document).on('click', '#AppendPROneTimePopDetail', function () {
        let count = $('#PROneTimeTableTemplate tbody').length;
        let template = $('#PRDetailCloneTemplate_Temp').clone().attr('id', 'PRDetail_' + count);
        $(template).find('td.DetailSerno').text(count + 1);

        $(template).find('.selectpickerInDetail').selectpicker();
        template.show();
        $('#PROneTimeTableTemplate').append(template);

        var j = 1;
        $('#PROneTimeTableTemplate tbody').children("tr").find('td.DetailSerno').each(function () {
            $(this).text(j);
            j++;
        })
    });

    //協議採購 刪除「Detail明細」...
    $(document).on('click', '#DeleteThisENPDetail', function () {
        if ($(this).parents('table').find('tbody').find('td.DetailSerno').length < 2) {  //.find('#POItemGet')
            // alertopen("無法再進行刪除!")
            //alert("無法再進行刪除!");
            // return;

            $('#ENPDetailTable').remove();

            var strBtn = "  <div class='area-btn-right'><a class='btn-02-blue btn-text4' id='ENPDetailCreate'>新增協議請購明細</a></div>";

            var strLab = "  <div class='disable-text' id='enpDetail-undone-vendorSelect'>請按【新增協議請購明細】按鈕</div> ";

            var divTit = $('#ENPDetailRoot').find('#YcBtnAdd');

            $(divTit).append(strBtn);
            var enpDet = $('#ENPDetailRoot').find('#enpDetail-undone-vendorSelect');

            if (enpDet.length != 0) {
                enpDet.show();
            } else {
                $(divTit).append(strLab);
            }
        } else {
            $(this).parents('tbody').remove();
        }

        var j = 1;
        $('#ENPDetailTable tbody').children("tr").find('td.DetailSerno').each(function () {
            $(this).text(j);
            j++;
        })
    });

    //協議採購 刪除「送貨明細」...
    $(document).on('click', '#DeletePrYcDev', function () {
        if ($(this).parents('table').find('tbody').length < 2) {
            alertopen("無法再進行刪除!")
            return;
        }
        $(this).parents('tbody').remove();

        var j = 1;
        $('#PRTableTemplate tbody').children("tr").find('td.DetailSerno').each(function () {
            $(this).text(j);
            j++;
        })
    });

    //一次性採購 刪除「送貨明細」...
    $(document).on('click', '#DeletePrOnceDev', function () {
        if ($(this).parents('table').find('tbody').length < 2) {
            alertopen("無法再進行刪除!")
            return;
        }
        $(this).parents('tbody').remove();

        var j = 1;
        $('#PROneTimeTableTemplate tbody').children("tr").find('td.DetailSerno').each(function () {
            $(this).text(j);
            j++;
        })
    });
    //一次性採購 刪除 Detail 明細資料...
    $(document).on('click', '#DeleteThisPROneTimeDetail', function () {
        if ($(this).parents('table').find('tbody').find('td.DetailSerno').length < 2) {
            // alertopen("無法再進行刪除!")
            //return;
            $('#PROneTimeDetailTable').remove();

            var strBtn = "  <div class='area-btn-right'> <a class='btn-02-blue btn-text4' id='PROneTimeDetailCreate'>新增一次性請購明細</a></div>";

            var strLab = "  <div class='disable-text' id='enpDetail-undone-vendorSelect'>請按【新增一次性請購明細】按鈕</div> ";

            var divTit = $('#PROneTimeDetailRoot').find('#OnceBtnAdd');

            $(divTit).append(strBtn);
            var enpDet = $('#PROneTimeDetailRoot').find('#enpDetail-undone-vendorSelect');

            if (enpDet.length != 0) {
                enpDet.show();
            } else {
                $(divTit).append(strLab);
            }
        } else {
            $(this).closest('tbody').remove();
        }

        var j = 1;

        $('#PROneTimeDetailTable tbody').children("tr").find('td.DetailSerno').each(function () {
            $(this).text(j);
            j++;
        })
    });

    $(document).on("dp.change", ".AmortizationStartDateInput", function (e) {
        let index = $(this).index('.AmortizationStartDateInput');
        $('.AmortizationEndDateInput').eq(index).data("DateTimePicker").minDate(e.date);
    });
    $(document).on("dp.change", ".AmortizationEndDateInput", function (e) {
        let index = $(this).index('.AmortizationStartEndInput');
        $('.AmortizationStartDateInput').eq(index).data("DateTimePicker").maxDate(e.date);
    });

    //協議採購--新增送貨單位明細
    $(document).on('click', '#AmortizationDetailCreate', function () {
        var HandType = $("#hidHandType").val();
        if (HandType == "ReadOnly") {
            $("#AppendPrDetail").hide();

            $("[name^=DeletePrYcDev]").hide();
        }

        $("#AccountUnit").selectpicker();
        $("#ReviceUnit").selectpicker();

        var twdPri = $(this).closest("tr").find("[name=hidPrice]").val();
        $('#PRTableTemplate thead').children('tr').find("[name=hidTwdPrice]").val(twdPri);

        var DetMainSerNo = $(this).closest("tbody").find('td.DetailSerno').text();
        $('#PRTableTemplate thead').children('tr').find("[name=hidMainSerNo]").val(DetMainSerNo);

        $(this).closest("tbody").find("[name^=trPRDev]").show();

        var tabDevy = $(this).closest("tbody").find("[name=tabDevyDet]");
        if (tabDevy.html().trim() != "") {
            $('#PRTableTemplate').find('#PRSendDetailCloneTemplate').remove();

            $('#PRTableTemplate').find("[name^=PRDvy]").remove();

            $('#PRTableTemplate').find("[id^=PRDetail]").remove();

            var j = 1;
            tabDevy.find("[name=trDevyDet]").each(function () {
                let template = $('#PROneTimeDetailCloneTemplate_Temp').clone();

                $(template).attr('name', 'PRDvy_' + j.toString().trim());
                $(template).children("tr").find('td.DetailSerno').text(j);

                $(template).find("[name=DevQuantity]").val($(this).find("[name=DevQuantity]").text());
                $(template).find("[name=DevAmount]").find('b').text($(this).find("[name=DevAmount]").text());

                var selCha = $(template).find("[name=ChargeDept]");
                var selRcv = $(template).find("[name=RcvDept]");

                setDefaultSelect(selCha, $(this).find("[name=ChargeDept]").text().trim());
                setDefaultSelect(selRcv, $(this).find("[name=RcvDept]").text().trim());

                $(template).find("[name=hidDeliveryIDSet]").val($(this).find("[name=hidPRDeliveryID]").val());

                template.show();
                $('#PRTableTemplate').append(template);
                j++;
            })
        }  //  if (tabDevy.html().trim() != "") {
            //180611....create....begin...
        else {
            $('#PRTableTemplate').find('#PRSendDetailCloneTemplate').remove();

            $('#PRTableTemplate').find("[name^=PRDvy]").remove();

            $('#PRTableTemplate').find("[id^=PRDetail]").remove();

            let template = $('#PROneTimeDetailCloneTemplate_Temp').clone();

            // $(template).attr('name', 'PRDvy_' + j.toString().trim());
            //$(template).children("tr").find('td.DetailSerno').text(j);

            $(template).find("[name=DevQuantity]").val('0');
            $(template).find("[name=DevAmount]").find('b').text('');

            var selCha = $(template).find("[name=ChargeDept]");
            var selRcv = $(template).find("[name=RcvDept]");

            setDefaultSelect(selCha, '');
            setDefaultSelect(selRcv, '');

            $(template).find("[name=hidDeliveryIDSet]").val('');
            template.show();
            $('#PRTableTemplate').append(template);
        }
        ////180611....create....end...

        $(this).closest("tbody").find("[name^=trPRDev]").hide();
        $('[data-remodal-id=PRSendDetailremodal]').remodal().open();
    });

    //YC作廢明細click
    $(document).on('click', '#ViewPRDetialBtn', function () {
        $(this).closest("tbody").find("[name^=trPrCancel]").show();

        var tabCancel = $(this).closest("tbody").find("[name=tabCancelDet]");
        if (tabCancel.html().trim() != "") {
            var YcCancBody = $('#PRTableCancel').find('#PrCanceltBody');

            $(YcCancBody).html('');

            var j = 1;
            tabCancel.find("[name=trCancelDet]").each(function () {
                let template = $(this).clone();
                $(YcCancBody).append(template);
                j++;
            })
        }

        $(this).closest("tbody").find("[name^=trPrCancel]").hide();

        $("#ViewPRDetialRemodal").remodal().open();
    });

    //一次性採購-作廢明細click
    $(document).on('click', '#ViewPROneTimeDetialBtn', function () {
        $(this).closest("tbody").find("[name^=trPrCancel]").show();

        var tabCancel = $(this).closest("tbody").find("[name=tabCancelDet]");
        if (tabCancel.html().trim() != "") {
            var YcCancBody = $('#PRTableCancel').find('#PrCanceltBody');

            $(YcCancBody).html('');

            var j = 1;
            tabCancel.find("[name=trCancelDet]").each(function () {
                let template = $(this).clone();
                $(YcCancBody).append(template);
                j++;
            })
        }

        $(this).closest("tbody").find("[name^=trPrCancel]").hide();

        $("#ViewPROneTimeDetialRemodal").remodal().open();
    });

    ////一次性採購--新增送貨單位明細
    $(document).on('click', '#PROneTimeDetailBtn', function () {
        $("#OneTimeAccountUnit").selectpicker();
        $("#OneTimeReviceUnit").selectpicker();

        var HandType = $("#hidHandType").val();
        if (HandType == "ReadOnly") {
            $("#AppendPROneTimePopDetail").hide();

            $("[name^=DeletePrOnceDev]").hide();
        }

        var txtPrice = $(this).closest("tbody").find("[name=trGreen]").find("[name=Price]").children("b").text();

        var twdPri = txtPrice.trim() == "系統自動帶入" ? "0" : txtPrice;

        $('#PROneTimeTableTemplate thead').children('tr').find("[name=hidTwdPrice]").val(twdPri);
        var DetMainSerNo = $(this).closest("tbody").find('td.DetailSerno').text();

        $('#PROneTimeTableTemplate thead').children('tr').find("[name=hidMainSerNo]").val(DetMainSerNo);

        //180528.....create..begin..

        var DetUomCode = $(this).closest("tbody").find("[name=UomCodeSel]").val();
        $('#PROneTimeTableTemplate thead').children('tr').find("[name=hidUomCode]").val(DetUomCode);

        //180528.....create...end...

        $(this).closest("tbody").find("[name^=trPRDev]").show();

        var tabDevy = $(this).closest("tbody").find("[name=tabDevyDet]");
        if (tabDevy.html().trim() != "") {
            $('#PROneTimeTableTemplate').find('#PROneTimeDetailCloneTemplate').remove();

            $('#PROneTimeTableTemplate').find("[name^=PRDvy]").remove();

            $('#PROneTimeTableTemplate').find("[id^=PRDetail]").remove();

            var j = 1;
            tabDevy.find("[name=trDevyDet]").each(function () {
                let template = $('#PRDetailCloneTemplate_Temp').clone();

                $(template).attr('name', 'PRDvy_' + j.toString().trim());
                $(template).children("tr").find('td.DetailSerno').text(j);

                $(template).find("[name=DevQuantity]").val($(this).find("[name=DevQuantity]").text());
                $(template).find("[name=DevAmount]").find('b').text($(this).find("[name=DevAmount]").text());

                var selCha = $(template).find("[name=ChargeDept]");
                var selRcv = $(template).find("[name=RcvDept]");

                setDefaultSelect(selCha, $(this).find("[name=ChargeDept]").text().trim());
                setDefaultSelect(selRcv, $(this).find("[name=RcvDept]").text().trim());

                $(template).find("[name=hidDeliveryIDSet]").val($(this).find("[name=hidPRDeliveryID]").val());

                template.show();
                $('#PROneTimeTableTemplate').append(template);
                j++;
            })
        }

            //180611....create....begin...
        else {
            $('#PROneTimeTableTemplate').find('#PROneTimeDetailCloneTemplate').remove();

            $('#PROneTimeTableTemplate').find("[name^=PRDvy]").remove();

            $('#PROneTimeTableTemplate').find("[id^=PRDetail]").remove();

            let template = $('#PRDetailCloneTemplate_Temp').clone();

            // $(template).attr('name', 'PRDvy_' + j.toString().trim());
            //$(template).children("tr").find('td.DetailSerno').text("1");

            $(template).find("[name=DevQuantity]").val('0');
            $(template).find("[name=DevAmount]").find('b').text('');

            var selCha = $(template).find("[name=ChargeDept]");
            var selRcv = $(template).find("[name=RcvDept]");

            setDefaultSelect(selCha, '');
            setDefaultSelect(selRcv, '');

            $(template).find("[name=hidDeliveryIDSet]").val('');

            template.show();
            $('#PROneTimeTableTemplate').append(template);
        }
        //180611....create....end...

        $(this).closest("tbody").find("[name^=trPRDev]").hide();

        $('[data-remodal-id=PROneTimeDetailremodal]').remodal().open();
    });

    $(document).on('click', '#ExpandAmortizationDetail', function () {
        if ($(this).find('.glyphicon-chevron-down').length > 0) {
            SwitchHideDisplay([], [$(this).parents('tbody').find('.AmortizationDetail')]);
        } else {
            SwitchHideDisplay([$(this).parents('tbody').find('.AmortizationDetail')], []);
        }
        $(this).find('.toggleArrow').toggleClass('glyphicon-chevron-down glyphicon-chevron-up')
    });
    $(document).on('click', '#ExpandAllAmortizationDetail', function () {
        if ($(this).find('.list-open-icon').length > 0) {
            SwitchHideDisplay([], [$('.AmortizationDetail')]);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up')
        } else {
            SwitchHideDisplay([$('.AmortizationDetail')], []);
            $(this).parents('table').find('tbody .toggleArrow').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
        }
        $(this).find('.toggleArrow').toggleClass('list-open-icon list-close-icon')
    });
    $(document).on('click', '#AppendAmortizationDetail', function () {
        let count = $('#AmortizationDetailTable tbody').length;
        let template = $('#AmortizationDetailCloneTemplate').clone().attr('id', 'AmortizationDetail_' + count);
        $(template).find('td.DetailSerno').text(count + 1);
        $(template).find('.selectpickerInDetail').selectpicker();
        $(template).find('#AmortizationDetailRatioInput').bind('change', recalculateAmortizationRatio);
        $(template).find('#OriginalAmortizationAmountInput').bind('focus', RecordPreviousVal).bind('change', MoneyChange).bind('change', recalculateAmortizationRatiobyMoney);
        $('#AmortizationDetailTable').append(template);
    });
    $(document).on('click', '#DeleteThisAmortizationDetail', function () {
        if ($(this).parents('table').find('tbody').length < 2) {
            alertopen("無法再進行刪除!")
            return;
        }
        $(this).parents('tbody').remove();
        recalculateAmortizationRatio();
    });

    //協議採購-POP送貨層 : 確定 鈕
    $(document).on('click', '#AccountConfirm', function () {
        var b = 10;

        var YnPass = "true";

        var DetMainSN = $('#PRTableTemplate thead').children('tr').find("[name=hidMainSerNo]").val();

        var DetTarSn = $('#ENPDetailTable').children("tbody").find('td.DetailSerno').filter(function () {
            return $(this).text() == DetMainSN
        });

        var DetTarget = DetTarSn.closest('tbody');

        var tabDev = $(DetTarget).children('tr').find("[name=tabDevyDet]");

        var DevId = tabDev.find("[name=hidPRDeliveryID]").val();

        // tabDev.html('');
        var strSec = "";

        var u = 1; var QtySum = 0;
        $('#PRTableTemplate tbody').each(function () {  //  $('#PRTableTemplate thead').children('tr').find("[name=hidMainSerNo]").val(DetMainSerNo);
            var Sn = $(this).children("tr").find('td.DetailSerno').text();

            var ChargeDept = $(this).children("tr").find("[name=ChargeDept]").val();

            var RcvDept = $(this).children("tr").find("[name=RcvDept]").val();

            var Qty = accounting.unformat($(this).children("tr").find("[name=DevQuantity]").val());

            //180528....create....begin....
            if (ChargeDept == "" || RcvDept == "" || Qty <= 0) {
                YnPass = "false";
            }
            //180528....create....end...

            QtySum = parseInt(QtySum) + parseInt(Qty);

            var DvyId = $(this).children("tr").find("[name=hidDeliveryIDSet]").val().trim();

            var amount = $(this).children("tr").find("[name=DevAmount]").find('b').text();

            strSec = strSec + '   <tr name="trDevyDet">\
             <td >' + Sn + ' <input name="hidPRDeliveryID" type="text" value="' + DvyId + '" /> </td>\
            <td name="ChargeDept">' + ChargeDept + '</td>\
            <td name="RcvDept">' + RcvDept + '</td>\
            <td name="DevQuantity">' + Qty + '</td>\
            <td name="DevAmount">' + amount + '</td>\
                           </tr>';
        })

        if (YnPass == "true") {
            DetTarSn.nextAll("[name=QuantityPurchase]").children("b").text(QtySum.toString());
            fun_ClassReset(DetTarSn.nextAll("[name=QuantityPurchase]").children("b"));

            tabDev.html('');    //180604...create....

            $(tabDev).append(strSec);
        } else {
            alert("掛帳單位、收貨單位、數量均為必填欄位，且 數量應填入大於0的數字，請重新建立「協議採購-送貨明細」資料!");
        }
    });

    //一次性採購-POP送貨層 : 確定 鈕
    $(document).on('click', '#OnceDevyConfirm', function () {
        var b = 10;

        var YnPass = "true";

        var DetMainSN = $('#PROneTimeTableTemplate thead').children('tr').find("[name=hidMainSerNo]").val();

        var DetTarSn = $('#PROneTimeDetailTable').children("tbody").find('td.DetailSerno').filter(function () {
            return $(this).text() == DetMainSN
        });

        var DetTarget = DetTarSn.closest('tbody');

        var tabDev = $(DetTarget).children('tr').find("[name=tabDevyDet]");

        var DevId = tabDev.find("[name=hidPRDeliveryID]").val();

        //tabDev.html('');

        // DetTarSn.nextAll("[name=QuantityPurchase]").children("b").text("0");
        var strSec = "";

        var UomCode = DetTarSn.nextAll("[name=UomCodeTd]").find("[name=UomCodeSel]").val();

        var u = 1; var QtySum = 0;
        $('#PROneTimeTableTemplate tbody').each(function () {  //  $('#PRTableTemplate thead').children('tr').find("[name=hidMainSerNo]").val(DetMainSerNo);
            var Sn = $(this).children("tr").find('td.DetailSerno').text();

            var ChargeDept = $(this).children("tr").find("[name=ChargeDept]").val();

            var RcvDept = $(this).children("tr").find("[name=RcvDept]").val();

            var Qty = accounting.unformat($(this).children("tr").find("[name=DevQuantity]").val());

            //180528....create....begin....
            if (ChargeDept == "" || RcvDept == "" || Qty <= 0) {
                YnPass = "false";
            }
                //180528....create....end...
                //180611....create....begin..
            else if (UomCode.toString().trim() != "AMT" && Qty < 1) {
                YnPass = "ErrNum";
            } else { }
            //180611...create....end...

            QtySum = parseFloat(QtySum) + parseFloat(Qty);

            var DvyId = $(this).children("tr").find("[name=hidDeliveryIDSet]").val().trim();

            var amount = $(this).children("tr").find("[name=DevAmount]").find('b').text();

            strSec = strSec + '   <tr name="trDevyDet">\
             <td >' + Sn + ' <input name="hidPRDeliveryID" type="text" value="' + DvyId + '" /> </td>\
            <td name="ChargeDept">' + ChargeDept + '</td>\
            <td name="RcvDept">' + RcvDept + '</td>\
            <td name="DevQuantity">' + Qty + '</td>\
            <td name="DevAmount">' + amount + '</td>\
                           </tr>';
        })

        if (YnPass == "true") {
            if (UomCode.toString().trim() == "AMT") {  //若選擇「金額」，數量固定為1
                if (QtySum != 1) {
                    alert("單位為「金額」，總數量 應為1,請重新建立「一次性採購-送貨明細」資料!");
                } else {
                    DetTarSn.nextAll("[name=QuantityPurchase]").children("b").text("1");
                    fun_ClassReset(DetTarSn.nextAll("[name=QuantityPurchase]").children("b"));
                    tabDev.html('');
                    $(tabDev).append(strSec);
                } // if (QtySum != 1)
            } else {
                DetTarSn.nextAll("[name=QuantityPurchase]").children("b").text(QtySum.toString());
                fun_ClassReset(DetTarSn.nextAll("[name=QuantityPurchase]").children("b"));

                tabDev.html('');

                $(tabDev).append(strSec);
            } //   if (UomCode.toString().trim() == "AMT") {
        } else if (YnPass == "ErrNum") {
            alert("單位 不為「金額」，數量應填入大於 1 的數字，請重新建立「一次性採購-送貨明細」資料!");
        } else {
            alert("掛帳單位、收貨單位、數量均為必填欄位，且 數量應填入大於0的數字，請重新建立「一次性採購-送貨明細」資料!");
        }  //if (YnPass == "true") {
    });

    //報價明細 : 確定 鈕
    $(document).on('click', '#QuoDetConfirm', function () {
        var aGetD = $("#QuotationInfoTable").find("tr[name=QoPrDetID]").each(function () {
            var QurDetClic = $(this).find("[name=QuoDetListClick]");
            fun_QuotationInfo_ResetDetail(QurDetClic);
        })
    });
} //InitialSet_New()==============================end

//==============================
//切換隱藏/顯示DOM元件
//==============================
function SwitchHideDisplay(hideObj, displayObj) {
    if (hideObj != null) {
        $.each(hideObj, function (index, item) {
            if ($(item)[0].tagName === 'SELECT') {
                $(item).parents('div.bootstrap-select').hide();
                return;
            }
            $(item).hide();
        });
    }
    if (displayObj != null) {
        $.each(displayObj, function (index, item) {
            if ($(item)[0].tagName === 'SELECT') {
                $(item).parents('div.bootstrap-select').show();
                return;
            }
            $(item).show();
        });
    }
}

//==============================
// 記錄金額更動前數值
//==============================
function RecordPreviousVal(e) {
    _previousAmount = $(e.target).val();
}

//==============================
// 請款明細層,重新計算金額
//==============================
function recalculateMoney(e) {
    let $this = $(e.target).parents('tr');

    let amount = $this.find('#ENPDetailOriginalAmountInput').val();
    let tax = $this.find('#ENPDetailOriginalTaxInput').val();
    let exchangeRate = $('#ExchangeRateInput').val();

    $this.find('#ENPDetailTWDAmountDisable').text(Math.round(amount * exchangeRate))
    $this.find('#ENPDetailTWDTaxDisable').text(Math.round(tax * exchangeRate))

    let amountTWD = $this.find('#ENPDetailTWDAmountDisable').text();
    let taxTWD = $this.find('#ENPDetailTWDTaxDisable').text();
    $this.find('#ENPDetailTWDSaleAmountDisable').text(parseInt(amountTWD) - parseInt(taxTWD));
    //==============================
    // 將請款明細改變的金額寫至主表單中
    //==============================
    let totalAmountTWD = 0;
    let totalTaxTWD = 0;
    $.each($this.parents('table').find('tbody'), function (index, item) {
        let $currentItem = $(item).find('tr').eq(2);
        totalAmountTWD += parseInt($currentItem.find('#ENPDetailTWDAmountDisable').text());
        totalTaxTWD += parseInt($currentItem.find('#ENPDetailTWDTaxDisable').text());
    });
    $('#TWDAmountMaster').text(totalAmountTWD);
    $('#TWDTaxMaster').text(totalTaxTWD);
    recalculateAmortizationRatio();
    PrePayMentAmountCal();
}

//==============================
//貨幣更動時檢查合理性
//==============================
function MoneyChange(e) {
    if ($(e.target).attr('class').includes('emptyMoneyField')) {
        let confirmResult = false;
        confirmopen("更動此欄位將會清空所有金額相關欄位，是否繼續?",
        function () {
            $('.moneyfield').val(0).text(0);
        },
        function () {
            $(e.target).val(_previousAmount);
            confirmResult = true;
        });
        if (confirmResult) {
            return;
        }
    }
    if (_moneyNegative && $(e.target).val() > 0) {
        alertopen("請款類別為折讓,金額必須小於零");
        $(e.target).val(_previousAmount);
    }
    if (!_moneyNegative && $(e.target).val() < 0) {
        alertopen("請款類別非折讓，金額必須大於零");
        $(e.target).val(_previousAmount);
    }
    if ($('#CurrencyPrecisionDisable').text() == 1) {
        $(e.target).val($(e.target).val().split('.')[0])
        return;
    }
    if ($(e.target).val().split('.')[1] != undefined) {
        if ($(e.target).val().split('.')[1].length > $('#CurrencyPrecisionDisable').text()) {
            alertopen('輸入值不符合幣別精確度');
            $(e.target).val(_previousAmount);
            return;
        }
    }
}