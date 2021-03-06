define(["jquery", "common", "modals", "distpicker"], function($, common, modals, distpicker) {

    var alerts = modals.alerts;
    var select_func = {
        maindom: ".select",
        select_head: ".select .select_head",
        dropdown: ".select .select_dropdown",
        sel_single: ".modal_adress .select .select_dropdown ul li",
        sel_single_gohome: ".select .select_dropdown.gohome ul li",
        sel_single_coupon: ".select .select_dropdown.coupon ul li",
        toggle_drop: function(that) {
            $(that).siblings(select_func.dropdown).slideToggle("fast");
        },
        down_drop: function(that) {
            $(that).siblings(select_func.dropdown).slideDown('fast');
        },
        up_drop: function() {
            $(select_func.dropdown).slideUp("fast");
        },
        set_selected: function(that) {
            $(that).addClass('selected').siblings("li").removeClass('selected');
            var selec_text = $(that).find('span').html();

            var value = $(that).data("value");
            $(that).parents(".select").find(".select_head").html(selec_text);
            $(that).parents(".select").attr('data-value', value);
        },
        init: function() {

            $("body").on('click', select_func.select_head, function(event) {
                event.stopPropagation();
                var that = this;
                select_func.toggle_drop(that);

            });
            $("body").click(function(event) {
                /* Act on the event */
                select_func.up_drop();
            });
            $("body").on('click', select_func.sel_single_gohome, function(event) {
                var that = this;
                event.preventDefault();
                /* Act on the event */
                select_func.set_selected(that);
                $('#transportType').val(5);
                $("#shipfee").html("+ 0.00");
                changeTransportFee();
                countFee();
            });
            $("body").on('click', select_func.sel_single_coupon, function(event) {
                var that = this;
                event.preventDefault();
                /* Act on the event */
                select_func.set_selected(that);
                if ($(".middle_part .order_coupon  #couponNum").length) {
                    countCoupon(this);
                }
            });
            $("body").on('click', select_func.sel_single, function(event) {
                var that = this;
                event.preventDefault();
                /* Act on the event */
                select_func.set_selected(that);
                console.log('哈哈哈哈')
            });
        }
    };
    var chose_func = {
        row: ".main_part .row",
        box: ".main_part .row .chose_box",
        init: function() {
            $(chose_func.box).click(function() {
                $(this).addClass("selected").siblings().removeClass("selected");
            });
        }
    }
    var checkbox = {
        click_box: ".middle_part .checkbox_check",
        box: ".middle_part .checkbox",
        init: function() {
            $(checkbox.click_box).click(function() {
                var box = $(this).parents(checkbox.box);
                // console.log(box);
                if (box.hasClass("selected")) {
                    box.removeClass("selected");
                    if ($("#usedRebate").length) {
                        $("#usedRebate").val(0);
                        usedRebateKeyup($("#usedRebate"));
                    }
                    if ($("#couponNum").length) {
                        $("#couponNum").val(0);
                        $("#coupon").val(0);
                        checkMaxUseCoupon($("#couponNum"));
                    }
                } else {
                    box.addClass("selected");
                    if ($(this).hasClass("rebate_input")) {
                        if ($("#usedRebate").length) {
                            if (!useRebateClick($(this))) {
                                box.removeClass("selected");
                            }
                        }
                    }
                }
            })
        }
    }



    //初始化设置
    var initarr = [select_func, chose_func, checkbox];
    var init = function(initarr) {
        for (var k in initarr) {
            initarr[k].init();
        }
    }
    init(initarr);

    //初始化优惠券信息
    findWholeCoupon();

    //点击物流中转
    $("body").on('click', ".main_part .chose_box.logistics", function(event) {
            initpeisongrow();
            //显示对应信息
            $(".main_part .peisongrow.logisticsrow").each(function(index, el) {
                $(el).removeClass("hide");
            });
            editpeisong($(this).data("value"));

        })
        //点击大唐自提
    $("body").on('click', ".main_part .chose_box.bigtang", function(event) {

        var hadSelected = $(this).hasClass("selected");
        if (hadSelected) {
            initpeisongrow();
            //显示对应信息
            $(".main_part .peisongrow.bigtangrow").each(function(index, el) {
                $(el).removeClass("hide");
            });
            editpeisong($(this).data("value"));
        }

    })

    //点击千禧路自提
    $("body").on('click', ".main_part .chose_box.qianxiroad", function(event) {

            var hadSelected = $(this).hasClass("selected");
            if (hadSelected) {
                initpeisongrow();
                //显示对应信息
                $(".main_part .peisongrow.qianxiroadrow").each(function(index, el) {
                    $(el).removeClass("hide");
                });
                editpeisong($(this).data("value"));
            }

        })
        //点击送货上门
    $("body").on('click', ".main_part .chose_box.gohome", function(event) {

            var hadSelected = $(this).hasClass("selected");
            if (hadSelected) {
                initpeisongrow();
                //显示对应信息
                $(".main_part .peisongrow.gohomerow").each(function(index, el) {
                    $(el).removeClass("hide");
                });
                editpeisong($(this).data("value"));
            }

        })
        //点击快递配送
    $("body").on('click', ".main_part .chose_box.express", function(event) {

            var hadSelected = $(this).hasClass("selected");
            if (hadSelected) {
                initpeisongrow();
                //显示对应信息
                $(".main_part .peisongrow.expressrow").each(function(index, el) {
                    $(el).removeClass("hide");
                });
                editpeisong($(this).data("value"));
            }

        })
        //修改收货地址
    $("body").on('click', ".main_part .adress_box .addOrEditAddress", function(event) {

        addOrEditAddress($(this).data("addressid"));

    });
    //更换收货地址
    $("body").on('click', ".main_part .replace .replace_address", function(event) {
        if ($(".main_part .content.addressinfo.hide").length > 0) {
            $(".main_part .content.addressinfo.hide").each(function(index, el) {
                $(el).removeClass("hide");
            })
        } else {
            $(".main_part .content.addressinfo").each(function(index, el) {
                $(el).addClass("hide");
            });

            $(".main_part .content.addressinfo .selected").parent().removeClass("hide");
        }



    });
    //点击快递公司重新计算运费
    $("body").on('click', ".expressrow .chose_box", function(event) {
            //计算运费
            var transporttype = $(this).data("transporttype");
            $("#transportType").val(transporttype);
            var addressid = $(".main_part .addressinfo .selected").parent().data("value");
            countShipFee(addressid, transporttype);

        })
        //点券输入完成
    $('body').on('keyup', ".middle_part .rebate_input  #usedRebate", function(event) {
            usedRebateKeyup($(this));
        })
        //优惠券输入完成
    $('body').on('keyup', ".middle_part .order_coupon  #couponNum", function(event) {

        countCoupon(this);
    });

    function countCoupon(obj) {
        if (!$(".order_coupon_select .selected").data("value")) {
            // $("#couponNum").val(0);
            alerts("请选择需要使用的优惠券类型");
        } else {
            var obj = $(".order_coupon_select .selected");
            var value = obj.data("value");
            //Terry 双十二活动针对猫头鹰活动使用点券
            var couponSn = obj.data("couponsn");
            $("#useCouponSellerIds").val(1);
            $("#couponSn1").val(couponSn);
            $("#couponValue1").val(value);
            //Terry end
            /*
             //更改选中的面额

             //更改选中的数量
             $("#coupon").val($("#couponNum").val());
             */
            $("#selectCouponValue").val(value);
            $("#couponNum").val("1");
            checkMaxUseCoupon($(obj));
        }
    }

    //点击送货上门更改运费及总价
    /* $("body").on('click',".gohomerow .select_dropdown li",function (event) {
     $('#transportType').val(5);
     })*/


    //提交订单
    $("body").on('click', ".total_price .apply #order-submit", function(event) {
        submitOrder();

    })

    //为收货地址更改绑定计算计算运费时间
    $("body").on('click', ".main_part .addressinfo .chose_box", function(event) {
        //取消其它选中
        $(".main_part .addressinfo .chose_box").each(function(index, ele) {
            var hadSelected = $(ele).hasClass("selected");
            if (hadSelected) {
                $(ele).removeClass("selected");
            }

        });
        $(this).addClass("selected");
        //更改表单地址id
        $("#addressId").val($(this).data("value"));
        //判断是否选中快递配送
        var hadSelected = $(".main_part .chose_box.express").hasClass("selected");
        var hadExpressrow = false;
        var transportType = 0;
        $(".main_part .expressrow .chose_box").each(function(index, ele) {
            var hasClass = $(ele).hasClass("selected");
            if (hasClass) {
                hadExpressrow = true;
                transportType = $(ele).data("transporttype");
            }
        });
        if (hadSelected && hadExpressrow) {
            var addreessid = $(this).parent().data("value");
            countShipFee(addreessid, transportType);
        }
    })

    function editpeisong(obj) {
        $("#transportType").val(obj);
    }

    function countShipFee(newAddressId, val) {
        $.ajax({
            type: "POST",
            url: domain + "/order/calculateTransFee.html",

            data: { addressId: newAddressId, transportType: val },
            dataType: "json",
            success: function(data) {
                if (data.success) {
                    setSumPrice(data.data.finalAmount);
                    //运费渲染到页面
                    $("#shipfee").html(" + " + data.data.logisticsFeeAmount);
                    countFee();
                }
            }
        });
    }

    //如果当前数字小于零，则将数字赋为零
    function checkIfZero(val) {
        return val < 0 ? 0 : val;
    }

    //最后调用计算逻辑
    function countFee() {
        //$("#creditPay").html("0.00");
        //var productFee = countTotalFee();
        //如果使用余额调用余额计算逻辑
        //countCreditUse("#selectOrderBalance");
        var productFee = countTotalFee();

        /*//赊账
         var creditPay = onlyDecimal("creditPay");
         productFee -= creditPay;*/

        productFee = productFee.toFixed(2);
        setSumPrice(productFee);
    }

    function setSumPrice(productFee) {
        //更改应付总额
        $("#payPriceId").html(productFee);
        $(".total_price .price_left").data("sumpaypricehidden", productFee);
    }


    //重新计算应付总金额 = 商品原价 - (单品立减 - 订单满减) - 积分 - 点券 - 优惠券（优惠券） + 加工费 + 辅料费 + 运费
    //单品立减、订单满减 = 优惠券金额（活动节省）
    function countTotalFee() {
        //商品原价
        var productFee = onlyDecimal("warePriceId");

        //活动节省
        var discountFee = onlyDecimal("discountPriceId");
        productFee -= discountFee;

        //积分支付
        if (productFee > 0) {
            var integralFee = onlyDecimal("integralPay");
            productFee = checkIfZero(productFee - integralFee);
        }

        //大袜点券
        if (productFee > 0) {
            var rebateMoney = onlyDecimal("rebateMoney");
            productFee = checkIfZero(productFee - rebateMoney);
        }

        //优惠券（优惠券）
        if (productFee > 0) {
            var couponFee = onlyDecimal("couponPriceId");
            productFee = checkIfZero(productFee - couponFee);
        }

        //加工费
        var serviceFee = onlyDecimal("packagePriceId");
        productFee += serviceFee;

        //辅料费
        var labelFee = onlyDecimal("labelPriceId");
        productFee += labelFee;

        //运费
        var logistiscFee = onlyDecimal("shipfee");
        productFee += logistiscFee;

        setSumPrice(productFee);
        return productFee;
    }

    /**
     * 只获取数字和小数
     */
    function onlyDecimal(id) {
        try {
            var val = $("#" + id).html();
            var result = parseFloat(val.replace(/[^\d.]/g, '').replace(/(^\s*)|(\s*$)/g, ''));
            if (isNaN(result)) result = 0;
            return result;
        } catch (e) {
            return 0;
        }
    }
    //输入格式控制只能输入挣正整数
    function checkNumForInput(obj) {
        if (/^\d+$/.test(obj[0].value)) {
            obj[0].value = obj[0].value;
        } else {
            obj[0].value = obj[0].value.substring(0, obj[0].value.length - 1);
        }
        obj[0].value = /^\d+$/.test(obj[0].value) ? obj[0].value : '';
    }



    function countCreditUse(obj) {
        //如果余额小于等于0 那么不允许选中
        //用户当前余额
        var balance = parseFloat($("#memberBalance").val());
        //可用赊账
        var memberCreditSurplus = parseFloat($("#memberCreditSurplus").val());
        if (memberBalance <= 0 || memberCreditSurplus <= 0) $(obj).prop("checked", false);

        //订单金额
        var orderTotalPrice = $("#sumPayPriceHidden").val();

        if ($(obj).prop("checked")) {
            $("#balance_pwd_div").show();
            // 计算账户余额及订单金额  订单金额 = 订单金额-优惠 -使用余额
            // 1、订单金额小于或等于余额 则余额使用显示订单金额 ，
            // 2、订单金额大于余额，则余额使用显示余额金额

            //赊账金额
            var creditAmount = 0;
            if (memberCreditSurplus > 0) {
                //只有余额小于订单金额且可支付余额大于等于订单金额时才会使用赊账
                if (Number(balance) < Number(orderTotalPrice) && memberCreditSurplus >= Number(orderTotalPrice)) {
                    if ($(obj).siblings("span").length > 0) {
                        $(obj).siblings("span").remove();
                    }
                    $(obj).parent().append("<span style='color: red;'>您的账户可赊账<b>" + memberCreditSurplus + "</b>元，使用余额支付后，您的账户会产生欠款，请在规定时间内还清欠款。</span>");
                    creditAmount = Number(orderTotalPrice);
                    $("#creditPriceListDiv").show();
                    $("#creditPay").html(creditAmount);
                    $("#usedCreditHidden").val(creditAmount);
                } else if (memberCreditSurplus < Number(orderTotalPrice)) {
                    $(obj).siblings("span").remove();
                    $(obj).parent().append("<span style='color: red;'>您的账户余额（包含赊账）可使用总额为<b>" + memberCreditSurplus +
                        "</b>元，其中余额欠款<b>" + userblanance + "</b>元，赊账剩余额度<b>" + memberCreditSurplus + "</b>元，不足以支付当前订单，请充值或还清欠款。</span>");
                    $(obj).prop("checked", false);
                    $("#balance_pwd_div").hide();
                    return;
                }
            }

            var usedBalanceHidden = balance;
            //订单金额
            var sumPayPrice = (memberCreditSurplus - orderTotalPrice).toFixed(2);
            if (sumPayPrice <= 0) {
                sumPayPrice = 0.00;
                usedBalanceHidden = orderTotalPrice;
            }
            $("#usedBalanceHidden").val(usedBalanceHidden);

            if (orderTotalPrice <= balance) {
                $("#balancePay").html(orderTotalPrice);
                //隐藏域赋值
                $("#balance").val(orderTotalPrice);
            } else {
                $("#balancePay").html(0);
                //隐藏域赋值
                $("#balance").val(balance);
            }
            //金额计算显示
            $("#balancePriceListDiv").show();
            $("#isBalancePay").val('true');
        } else {
            if (memberCreditSurplus > 0) {
                $(obj).siblings("span").remove();
                $("#creditPriceListDiv").hide();
            }

            // 不使用余额，把余额加回去
            var usedBalanceHidden = $("#usedBalanceHidden").val();
            orderTotalPrice = parseFloat(orderTotalPrice) + parseFloat(usedBalanceHidden);
            $("#balance_pwd_div").hide();
            $("#balancePriceListDiv").hide();
            //不选中 密码清空
            $("#balancePassword").val('');
            //隐藏域清空
            $("#balance").val('');
            $("#creditPay").html("0");
            $("#isBalancePay").val('false');
            $("#usedBalanceHidden").val(0);
        }
    }

    //提交订单
    function submitOrder() {
        //如果用户勾选了使用优惠券,判断是否有选择优惠券类型和数量
        if ($(".middle_part .content .order_coupon").hasClass('selected')) {
            if (!$(".order_coupon_select .selected").data("value")) {
                alerts("请选择需要使用的优惠券类型");
                return;
            } else {
                //设置优惠券使用信息
                $("#coupon").val($("#couponNum").val());
            }
        }

        //如果用户勾选了使用点券,判断是否有输入正确的点券数量



        //为用户提示说明要选择一种配送方式，不要选错了。
        var userTip = $(".main_part .peisong .selected").data("value");
        var sendType = $("#sendType").val();
        var flag = $("#flag").val();
        //设置地址id
        $("#addressId").val($(".main_part .addressinfo .selected").parent().data("value"));
        if (sendType == 1 && flag == 1) {
            alerts("一件代发暂不支持二次加工商品！");
            return;
        }
        if (!userTip && sendType == 0) {
            // alerts("请选择配送方式");
            alerts("提示", "请选择配送方式");
            //跳转到顶部
            window.scrollTo(0, 0);
            return false;
        } else if ((userTip == 6 || userTip == 7) && sendType == 0) {
            //自提时则要求用户真实姓名不为空
            var realName = $("#realName").val();
            if (realName == "") {
                //如果真实姓名为空则跳转到个人资料完善页面
                alerts('提示', '尊敬的用户,即将跳转个人资料,请完善您的真实姓名,谢谢', function() {
                    window.location.href = domain + "/member/info.html"
                });
                return false;
            }
        } else if (userTip == 1 && sendType == 0) {
            var val = $(".main_part .expressrow .selected").data("transporttype");
            if (typeof(val) == "undefined" && sendType == 0) {
                //运送方式
                alerts("请选择快递方式");
                //跳转到顶部
                window.scrollTo(0, 0);
                return false;
            }
        }
        //end
        var orderType = $(".main_part .peisong .selected").data("value");
        //送货上门时判断配送地址是否已经选择
        if (orderType == 5 && sendType == 0) {
            var sendArea = $('.gohomerow .select_dropdown .selected').data("value");
            //送货上门时判断地址是否为浙江地区
            var selectaddressAll = $(".main_part .addressinfo .selected").parent().data("addll");
            if (selectaddressAll.indexOf("浙江") < 0) {
                alerts("送货上门只针对特定区域，请重新选择收货地址或者更改配送方式");
                $('#sendArea').focus();
                return;
            }
            if (sendArea == 1 && sendType == 0) {
                alerts("请选择详细配送地区和收货地址");
                $('#sendArea').focus();
                return;
            } else {
                //送货上门的时候需要进行特殊处理，配送方式加配送地区
                $('#transportType').val(orderType + '' + sendArea);
            }
        }
        //判断收货地址是否存在,除去自提点提货的单子不需要校验
        if (orderType != 6 && orderType != 7 && sendType == 0) {
            if (isEmpty($("#addressId").val())) {
                alerts("请添加或选择收货地址");
                return false;
            }
        }
        //	var temp = $("input[name='transportType']:checked").val();
        //	$("#transportType").val(temp);
        var servicePrice = $("#servicePrice").val();
        if (servicePrice > 0) {
            orderType = 5;

        } else {
            orderType = 1;
        }
        var actionUrl = domain + "/order/ordercommit.html?ordersType=" + orderType;
        var param = "";

        //判断是否使用余额支付  异步调用账户密码
        /*var balance = $("#selectOrderBalance");
         var balancePwd = $("#balancePassword").val();
         $("#balancePwd").val(balancePwd);
         if($(balance).prop("checked")){
         if(isEmpty(balancePwd)){
         alerts("密码不能为空");
         $("#balancePassword").focus();
         return false;
         }
         //验证支付密码
         var checkpwd = checkBalancePwd(balancePwd);
         if(!checkpwd){
         return false;
         }
         }*/
        //提交订单按钮屏蔽，避免重复提交
        $("#order-submit").attr("disabled", true);
        // 提交loading
        // $('body').append("<div id='submit_loading' class='purchase-loading'><div class='loading-cont'></div></div>");
        var tzm_ttfee = $("input[name='tzm_ttfee']");
        var tzm_ttfee_bool = false;
        tzm_ttfee.each(function(i) {
            if (parseFloat($(this).val()) > 0) { //如果有套餐费，则此订单存在二次加工
                tzm_ttfee_bool = true;
            }
        })
        if (tzm_ttfee_bool) {
            //设置为1代表次订单为二次加工订单，后台做特殊处理
            $("#tzm_twoJG").val("1");
        }

        //设置点券使用数量订单备注
        //设置支付方式
        $("#paymentCode").val($(".main_part .payment_code .selected").data("code"));
        $("#paymentName").val($(".main_part .payment_code .selected").data("name"));
        $("#remark").val($(".main_part .order_remark .selected").data("remark"));
        param = $("#invoiceForm").serialize();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: actionUrl,
            data: param,
            async: false,
            success: function(result) {
                if (result.success) {
                    var data = result.data;
                    var paySessionstr = data.paySessionstr;
                    var goJumpPayfor = data.goJumpPayfor;
                    var relationOrderSn = data.relationOrderSn;
                    var payAmount = data.payAmount;

                    //跳转到成功页面
                    if (goJumpPayfor) {
                        successUrl = domain + "/order/pay.html";
                        newurl = successUrl + "?relationOrderSn=" + relationOrderSn +
                            "&paySessionstr=" + paySessionstr + "&rid=" + Math.random();
                        window.setTimeout('window.location.href=newurl;', 450);
                        return;
                    } else {
                        successUrl = domain + "/order/success.html";
                        window.location.href = successUrl + "?relationOrderSn=" + relationOrderSn + "&rd=" + Math.random();
                        return;
                    }

                } else {
                    // 更新token值
                    $("input[name='CSRFToken']").val(result.csrfToken);
                    $("#order-submit").removeAttr("disabled");
                    if (result.message != null) {
                        $("#submit_loading").remove();
                        alerts(result.message);
                        return;
                    } else {
                        $("#submit_loading").remove();
                        alerts("系统出错了~~~, 请稍后重试...");
                        return;
                    }
                }
            },
            error: function(error) {
                $("#order-submit").removeAttr("disabled");
                $("#submit_loading").remove();
                alerts("亲爱的用户请不要频繁点击, 请稍后重试...");
            }
        });

    }

    /**
     * 判断是否是空
     * @param value
     */
    function isEmpty(value) {
        if (value == null || value == "" || value == "undefined" || value == undefined || value == "null") {
            return true;
        } else {
            value = value.replace(/\s/g, "");
            if (value == "") {
                return true;
            }
            return false;
        }
    }


    function changeTransportFee() {
        var sendArea = $(".gohomerow .select_dropdown .selected").data("value");
        var totalCartAmount = $('#totalCartAmount').val();
        var box_amount = parseFloat(totalCartAmount / 500).toFixed(2);
        var arr_am = box_amount.split('.');
        var t = parseFloat(arr_am[0]);
        var transportFee = 0.00;
        if (arr_am[1] > 0) {
            t += 1;
        }
        //一区运费计算
        if (sendArea == 2) {
            transportFee = t * 4;
            if (transportFee < 20) {
                transportFee = 20;
            }
            if (totalCartAmount >= 1000) {
                transportFee = 0.00;
            }
        }
        //二区运费计算
        if (sendArea == 3) {
            transportFee = t * 4.5;
            if (transportFee < 180) {
                transportFee = 180;
            }
            if (totalCartAmount >= 5000) {
                transportFee = 0.00;
            }
        }
        //三区运费计算
        if (sendArea == 4) {
            transportFee = t * 5.5;
            if (transportFee < 330) {
                transportFee = 330;
            }
            if (totalCartAmount >= 20000) {
                transportFee = 0.00;
            }
        }
        //四区运费计算
        if (sendArea == 5) {
            transportFee = t * 5;
            if (transportFee < 250) {
                transportFee = 250;
            }
            if (totalCartAmount >= 20000) {
                transportFee = 0.00;
            }
        }
        $('#sendArea1').val(sendArea);
        //先将运费清0
        $("#shipfee").html("+ " + transportFee);
        countFee();
    }




    //验证支付密码
    function checkBalancePwd(balancePwd) {
        var correct = false;
        $.ajax({
            type: "GET",
            url: domain + "/order/checkbalancepwd.html",
            data: { balancePwd: balancePwd },
            dataType: "json",
            async: false,
            success: function(data) {
                if (data.success) {
                    correct = data.data.correct;
                    var errcount = parseInt(data.data.pwdErrCount);
                    if (errcount >= 6) {
                        alerts("支付密码输错超过6次,请用其他方式支付");
                        // $(".toggle-title").click();
                        return false;
                    }
                    if (!correct) {
                        alerts("支付密码不正确，您最多还可以输入" + (6 - errcount) + "次");
                        return false;
                    }
                } else {
                    alerts(data.message);
                    return false;
                }
            },
            error: function() {
                alerts("验证密码失败！");
            }
        });
        return correct;
    }


    $(".modal_adress").on('click', ".close", function() {
        $(".modal_adress").addClass("hide");
    })


    function initpeisongrow() {
        $(".main_part .peisongrow").each(function(index, el) {
            var hadClass = $(el).hasClass("hide");
            if (!hadClass) {
                $(el).addClass("hide");
            }
        })
    }

    //点击使用点券
    function useRebateClick(obj) {
        //如果点券小于等于0或者可使用点券的金额小于等于0 那么不允许勾选
        var rebateIntegral = parseInt($(obj).parent().find(".checkbox_input").data("value"));
        var canUseRebateAmount = $(obj).parent().data("canuserebateamount");
        if (canUseRebateAmount <= 0) {
            $("#usedRebate").attr("disabled", true);
            alerts("对不起,该订单商品不支持点券购买");
            return false;
        } else if (rebateIntegral <= 0) {
            $("#usedRebate").attr("disabled", false);
            alerts("亲,可用点券不足");
            return false;
        }
        $("#usedRebate").attr("disabled", false);

        if (!$(obj).parent().hasClass("selected")) {
            $("#usedRebate").val("");
            $("#usedRebate").attr("disabled", true);
        }
        return true;
    }


    /**
     * 检查最大使用优惠券数量
     */
    function checkMaxUseCoupon(obj) {
        checkNumForInput(obj);
        var couponNum = parseInt($("#couponNum").val());
        if (isNaN(couponNum)) {
            couponNum = 0;
            //return;
        }
        var couponMaxUse = parseInt($("#coupon_max_use").text());
        if (isNaN(couponMaxUse)) return;
        var currUse = 0; //text框使用的优惠券
        if (couponMaxUse < couponNum)
            currUse = couponMaxUse;
        else
            currUse = couponNum;
        if (currUse == 0) {
            $("#couponNum").val("");
            $("#coupon").val("");
        } else {
            $("#couponNum").val(currUse);
            $("#coupon").val(currUse);
        }



        //计算总金额 数量 * 面值
        var orderCouponSelectVal = parseFloat($(".order_coupon_select .selected").data("value"));
        var couponVal = orderCouponSelectVal * currUse; //总共使用优惠券金额
        $("#couponPriceId").html(couponVal);
        countFee();
    }




    //点券输入完成
    function usedRebateKeyup(obj) {
        checkNumForInput(obj);
        //获取可使用点券商品金额
        var canUseRebateAmount = $(obj).parent().parent().data("canuserebateamount");
        //获取用户拥有的点券
        var hasRebate = parseInt($(obj).parent().data("value"));
        //求出可使用点券的最大值
        var max = hasRebate - canUseRebateAmount * 100 >= 0 ? canUseRebateAmount * 100 : hasRebate;
        //获取当前商品总计金额
        var amount = $(".total_price .price_left").data("sumpaypricehidden");
        //获取输入的点券值
        var usedRebate = $("#usedRebate").val();
        if (max < usedRebate) {
            $("#usedRebate").val(max.toFixed(0));
        }
        //更改点券抵扣值
        usedRebate = $("#usedRebate").val();
        $("#rebateMoney").html(usedRebate / 100);
        amount = (amount - usedRebate / 100).toFixed(2);
        //更改应付总额
        $("#sumPayPriceId").html("¥" + amount);
        //更改使用点券数量
        $("#usedRebateNum").val(usedRebate);

        changeMaxCouponByRebate();
        countFee();
    }
    //新增或编辑收货地址
    function addOrEditAddress(id) {
        $(".modal_adress").removeClass("hide");
        $.ajax({
            type: "GET",
            url: domain + "/member/editaddress.html",
            dataType: "html",
            data: {
                id: id
            },
            success: function(data) {

                $(".modal_adress").html(data);
                if (initTimeOut) {
                    clearTimeout(initTimeOut);
                }
                var initTimeOut = setTimeout(function() {
                    //doLoading('province_',config);
                    editDeliveryAddress();
                }, 1);
            },
            error: function() {
                alerts("异常，请重试！");
            }
        });

        $(".modal_adress").on('click', ".close", function() {
            $(".modal_adress").addClass("hide");
        })

        /*  $(".modal_adress").ajaxComplete(function () {
         editDeliveryAddress();
         })*/

    }




    function editDeliveryAddress() {
        //编辑用户地址
        if ($(".modal_adress .editDeliveryAddress").length) {
            //加载省市区
            var opt = {
                //默认省
                defaultProvince: $("#provinceId").val(),
                //默认市
                defaultCity: $("#cityId").val(),
                //默认地区
                defaultArea: $("#areaId").val(),
                areaRequired: true,
                domain: domain,
                provinceName: '请选择',
                cityName: '请选择',
                areaName: '请选择',
                compent: "editDeliveryAddress"
            };
            //实例此对象，参数可选
            var area = new AreaSupport(opt);
            //初始化对象并组装DOM添加至给定的选择器对象。注意，此对象的init返回的是JQuery对象
            $('.editDeliveryAddress .select.province_').html(area.getProvince());
            //如果希望进入页面加载到市，则可以手动执行此初始化方法
            //area.getCity().appendTo();
            $('.editDeliveryAddress .select.city_').html(area.getCity());
            //如果希望进入页面加载到地区，则可以手动执行此初始化方法
            //area.getArea().appendTo();
            $('.editDeliveryAddress .select.area_').html(area.getArea());
            $("." + opt.compent + " .select_head.province_").html($("." + opt.compent + " .select_dropdown.province_ .selected span").html());
            $("." + opt.compent + " .select_head.city_").html($("." + opt.compent + " .select_dropdown.city_ .selected span").html());
            $("." + opt.compent + " .select_head.area_").html($("." + opt.compent + " .select_dropdown.area_ .selected span").html());


            //修改用户收货地址
            $(".saveConsigneeButton").on('click', function() {
                editConsignee();
            });


        }
    }




    //修改用户收货地址信息
    function editConsignee() {
        var provinceId = $('.editDeliveryAddress .province_ .selected').data("value");
        var cityId = $('.editDeliveryAddress .city_ .selected').data("value");
        var areaId = $('.editDeliveryAddress .area_ .selected').data("value");
        var memberName = $("#consigneeName").val();
        var addressInfo = $("#consigneeAddress").val();
        var mobile = $("#consigneeMobile").val();
        var zipCode = $("#consigneeZipcode").val();
        var email = $("#consigneeEmail").val();
        var id = $("#newAddressId").val();
        //获得省市区中文并拼接
        var addall = $("input[name='editDeliveryAddress']").val();

        if (!addall) {
            addall += $(".editDeliveryAddress .select_head.province_").html();
            addall += $(".editDeliveryAddress .select_head.city_").html();
            addall += $(".editDeliveryAddress .select_head.area_").html();
        }

        if (!memberName) {
            alerts("收货人姓名必填");
            return;
        }
        if (!provinceId || !cityId || !areaId) {
            alerts("请选择详细的所在地区");
            return;
        }
        if (!addressInfo) {
            alerts("详细地址必填");
            return;
        }
        if (!mobile) {
            alerts("手机号码必填");
            return;
        }
        if (isphone(mobile)) {

        } else {
            alerts("亲,请输入正确的手机号");
            return;
        }
        if (email.length) {
            if (isemail(email)) {

            } else {
                alert("亲,请输入正确的邮箱地址");
                return;
            }
        }
        if (zipCode == null || zipCode == '' || zipCode.length != 6) {
            $("#consignee_zipcode").val("000000");
            zipCode = "000000";
        }

        $(".saveConsigneeButton").attr("disabled", "disabled");
        var params = "";
        params += "addAll=" + addall;
        params += "&id=" + id + "&memberName=" + memberName;
        params += "&provinceId=" + provinceId;
        params += "&cityId=" + cityId;
        params += "&areaId=" + areaId;
        params += "&addressInfo=" + addressInfo;
        params += "&mobile=" + mobile;
        params += "&email=" + email;
        params += "&zipCode=" + zipCode;
        $.ajax({
            type: "POST",
            url: domain + "/member/saveaddress.html",
            dataType: "json",
            data: params,
            success: function(data) {
                if (data.success) {
                    window.location.reload();
                } else {
                    $("#saveConsigneeButton").removeAttr("disabled");
                    alerts(data.message);

                }
            },
            error: function() {
                $("#saveConsigneeButton").removeAttr("disabled");
                alerts("异常，请重试！");

            }
        });
    }

    //获取10不限制满减元优惠券集合
    /*function findWholeCoupon() {

     $.ajax({
     type : "GET",
     url :  domain+"/order/getsellercoupon.html",
     data : {sellerId:0},
     dataType : "json",
     success : function(data) {
     if (data.success) {
     var totalCouponNum = 0;				//优惠券总数量
     var totalCouponFee = 0;			//优惠券总金额
     var couponValue = 0;					//优惠券面值
     var selectOption = '<li class="selected" data-value="-1"><i class="iconfont">&#xe630;</i><span>请选择</span></li>'
     var selectOption = ''
     if(data.data.length==0){
     if (totalCouponNum == 0) $(".order_coupon").hide();
     }
     else {
     $.each(data.data, function(i, couponUser) {
     couponValue = couponUser.couponValue;							//优惠券面值
     if (couponValue != null) {
     var canUse = couponUser.canUse;									//可使用次数
     selectOption += '<li  data-value="' + couponValue + '" ><i class="iconfont">&#xe630;</i><span>' + couponValue + "元优惠券" + "</span></li>";
     totalCouponNum = totalCouponNum + canUse;						//
     totalCouponFee = totalCouponFee + couponValue * canUse;			//
     }
     else {
     couponValue = 10;
     }
     });
     }
     var afterDiscount = onlyDecimal("discountAmountPriceId");			//订单满减、单品立减后金额
     var diff  = afterDiscount - parseFloat(totalCouponFee);
     var totalCanUseCoupon = 0;
     if (diff >= 0) {
     totalCanUseCoupon = totalCouponFee / couponValue;
     }
     else {
     totalCanUseCoupon = afterDiscount / couponValue;
     }
     if (Math.ceil(totalCanUseCoupon) > 0) {
     $("#coupon_max_use").html(Math.ceil(totalCanUseCoupon));
     $("#totalCouponNum").val(totalCouponNum);
     $(".select_dropdown .order_coupon_select").append(selectOption);
     $(".order_coupon").show();
     }
     }
     }
     });
     }*/
    //获取限制满减优惠券集合
    function findWholeCoupon() {
        // var totalWarePrice = $("#tzm_warePriceId").val();
        //Terry 双十二活动针对猫头鹰活动使用点券
        var totalWarePrice = 0;
        var obj = $(".priceAfterDiscount1");
        if (obj.length > 0) {
            obj.each(function() {
                //console.log("........ " + $(this).val());
                totalWarePrice = totalWarePrice + parseFloat($(this).val());
            });
        }
        //Terry end
        $.ajax({
            type: "GET",
            url: domain + "/order/getsellercoupon.html",
            data: { sellerId: 1, totalWarePrice: totalWarePrice },
            dataType: "json",
            success: function(data) {
                if (data.success) {
                    var totalCouponNum = 0; //优惠券总数量
                    var totalCouponFee = 0; //优惠券总金额
                    var couponValue = 0; //优惠券面值
                    var selectOption = '<li class="selected" data-value="-1"><i class="iconfont">&#xe630;</i><span>请选择</span></li>'
                    var selectOption = ''
                    if (data.data.length == 0) {
                        if (totalCouponNum == 0) $(".order_coupon").hide();
                    } else {
                        $.each(data.data, function(i, couponUser) {
                            couponValue = couponUser.couponValue; //优惠券面值
                            couponName = couponUser.couponName;
                            couponSn = couponUser.couponSn;
                            if (couponValue != null) {
                                var canUse = couponUser.canUse; //可使用次数
                                selectOption += '<li data-couponsn="' + couponSn + '" data-value="' + couponValue + '" ><i class="iconfont">&#xe630;</i><span>' + couponName + "</span></li>";
                                totalCouponNum = totalCouponNum + canUse; //
                                totalCouponFee = totalCouponFee + couponValue * canUse; //
                            } else {
                                couponValue = 10;
                            }
                        });
                    }
                    var afterDiscount = onlyDecimal("discountAmountPriceId"); //订单满减、单品立减后金额
                    var diff = afterDiscount - parseFloat(totalCouponFee);
                    var totalCanUseCoupon = 0;
                    if (diff >= 0) {
                        totalCanUseCoupon = totalCouponFee / couponValue;
                    } else {
                        totalCanUseCoupon = afterDiscount / couponValue;
                    }
                    if (Math.ceil(totalCanUseCoupon) > 0) {
                        // $("#coupon_max_use").html(Math.ceil(totalCanUseCoupon));
                        $("#coupon_max_use").html(Math.ceil(1));
                        $(".select_dropdown .order_coupon_select").append(selectOption);
                        $(".order_coupon").show();
                    }
                }
            }
        });
    }

    function changeMaxCouponByRebate() {
        var afterDiscount = onlyDecimal("discountAmountPriceId"); //订单满减、单品立减后金额
        //已使用点券金额
        var rebateMoney = onlyDecimal("rebateMoney");
        //优惠券总金额
        var coupon_max_use = onlyDecimal("coupon_max_use");
        //优惠券面值
        var orderCouponSelectVal = parseFloat($(".select_dropdown .order_coupon_select .selected").data("value"));
        var totalCouponFee = orderCouponSelectVal * coupon_max_use; //总共可使用优惠券金额

        //大袜点券
        if (afterDiscount > 0) {
            var diff = afterDiscount - rebateMoney;
            var totalCanUseCoupon = 0;
            if (diff >= 0) totalCanUseCoupon = diff / orderCouponSelectVal;
            // $("#coupon_max_use").html(Math.ceil(totalCanUseCoupon));
            $("#coupon_max_use").html(Math.ceil(1));
        } else {
            $(".order_coupon").hide();
        }
    }

    function isphone(value) {
        if (value.search(/^(\+\d{2,3})?\d{11}$/) == -1) {
            return false;
        } else {
            return true;
        }
    };

    function isemail(value) {
        if (value.search(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) == -1) {
            return false;
        } else {
            return true;
        }
    }

    //添加收货地址
    $("#addButton").on('click', function(event) {
        $(".modal_adress").removeClass("hide");
        editDeliveryAddress();
    });

    $(".modal_adress").on('click', ".close", function() {
        $(".modal_adress").addClass("hide");
        $(".modal_adress input").val("");
        $(".modal_adress textarea").val("");
    });



})