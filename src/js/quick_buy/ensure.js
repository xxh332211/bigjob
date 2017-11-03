define(["jquery","common","modals","distpicker"],function ($,common,modals,distpicker) {

    var alerts = modals.alerts;
    var select_func = {
        maindom: ".select",
        select_head: ".select .select_head",
        dropdown: ".select .select_dropdown",
        sel_single: ".select .select_dropdown ul li",
        toggle_drop: function (that) {
            $(that).siblings(select_func.dropdown).slideToggle("fast");
        },
        down_drop: function (that) {
            $(that).siblings(select_func.dropdown).slideDown('fast');
        },
        up_drop: function () {
            $(select_func.dropdown).slideUp("fast");
        },
        set_selected: function (that) {
            $(that).addClass('selected').siblings("li").removeClass('selected');
            var selec_text = $(that).find('span').html();

            var value = $(that).data("value");
            $(that).parents(".select").find(".select_head").html(selec_text);
            $(that).parents(".select").attr('data-value', value);
        },
        init: function () {
            $("body").on('click', select_func.select_head, function (event) {
                event.stopPropagation();
                var that = this;
                select_func.toggle_drop(that);
            });
            $("body").click(function (event) {
                /* Act on the event */
                select_func.up_drop();
            });
            $("body").on('click', select_func.sel_single, function (event) {
                var that = this;
                event.preventDefault();
                /* Act on the event */
                select_func.set_selected(that);
            });
        }
    };
    var chose_func = {
        row: ".main_part .row",
        box: ".main_part .row .chose_box",
        init: function () {
            $(chose_func.box).click(function(){
                $(this).addClass("selected").siblings().removeClass("selected");
            });
        }
    }
    var checkbox = {
        click_box: ".middle_part .checkbox_check",
        box: ".middle_part .checkbox",
        init: function () {
            $(checkbox.click_box).click(function(){
                var box = $(this).parents(checkbox.box);
                console.log(box);
                if(box.hasClass("selected")){
                    box.removeClass("selected");
                }else {
                    box.addClass("selected");
                }
            })
        }
    }



    //初始化设置
    var initarr = [select_func,chose_func,checkbox];
    var init = function (initarr) {
        for (var k in initarr){
            initarr[k].init();
        }
    }
    init(initarr);

    //点击物流中转
    $("body").on('click',".main_part .chose_box.logistics",function (event) {
            initpeisongrow();
            //显示对应信息
            $(".main_part .peisongrow.logisticsrow").each(function (index, el) {
                $(el).removeClass("hide");
            });
        editpeisong($(this).data("value"));

    })
    //点击大唐自提
    $("body").on('click',".main_part .chose_box.bigtang",function (event) {

        var hadSelected = $(this).hasClass("selected");
        if(hadSelected){
            initpeisongrow();
            //显示对应信息
            $(".main_part .peisongrow.bigtangrow").each(function (index, el) {
                $(el).removeClass("hide");
            });
            editpeisong($(this).data("value"));
        }

    })

    //点击千禧路自提
    $("body").on('click',".main_part .chose_box.qianxiroad",function (event) {

        var hadSelected = $(this).hasClass("selected");
        if(hadSelected){
            initpeisongrow();
            //显示对应信息
            $(".main_part .peisongrow.qianxiroadrow").each(function (index, el) {
                $(el).removeClass("hide");
            });
            editpeisong($(this).data("value"));
        }

    })
    //点击送货上门
    $("body").on('click',".main_part .chose_box.gohome",function (event) {

        var hadSelected = $(this).hasClass("selected");
        if(hadSelected){
            initpeisongrow();
            //显示对应信息
            $(".main_part .peisongrow.gohomerow").each(function (index, el) {
                $(el).removeClass("hide");
            });
            editpeisong($(this).data("value"));
        }

    })
    //点击快递配送
    $("body").on('click',".main_part .chose_box.express",function (event) {

        var hadSelected = $(this).hasClass("selected");
        if(hadSelected){
            initpeisongrow();
            //显示对应信息
            $(".main_part .peisongrow.expressrow").each(function (index, el) {
                $(el).removeClass("hide");
            });
            editpeisong($(this).data("value"));
        }

    })
    //修改收货地址
    $("body").on('click',".main_part .adress_box .addOrEditAddress",function (event) {

       addOrEditAddress($(this).data("addressid"));

    });
    //更换收货地址
    $("body").on('click',".main_part .replace .replace_address",function (event) {
        $(".main_part .content.addressinfo.hide").each(function (index, el) {
            $(el).removeClass("hide");
        })


    });
    //点击快递公司重新计算运费
    $("body").on('click',".expressrow .chose_box",function (event) {
        //计算运费
        var transporttype = $(this).data("transporttype");
        var addressid = $(".main_part .addressinfo .selected").parent().data("value");
        countShipFee(addressid,transporttype);

    })
    //提交订单
    $("body").on('click',".total_price .apply #order-submit",function (event) {
       submitOrder();

    })

    //为收货地址更改绑定计算计算运费时间
    $("body").on('click',".main_part .addressinfo .chose_box",function (event) {
        //取消其它选中
        $(".main_part .addressinfo .chose_box").each(function (index, ele) {
            var hadSelected = $(ele).hasClass("selected");
            if(hadSelected){
                $(ele).removeClass("selected");
            }

        });
        $(this).addClass("selected");
        //更改表单地址id
        $("#addressId").val($(this).data("value"));
        //判断是否选中快递配送
       var hadSelected = $(".main_part .chose_box.express").hasClass("selected");
       var hadExpressrow  = false;
       var transportType = 0;
      $(".main_part .expressrow .chose_box").each(function (index, ele) {
          var hasClass = $(ele).hasClass("selected");
          if(hasClass){
              hadExpressrow = true;
              transportType = $(ele).data("transporttype");
          }
      });
        if(hadSelected && hadExpressrow){
            var addreessid = $(this).parent().data("value");
            countShipFee(addreessid,transportType);
        }
    })

    function editpeisong(obj){
        $("#transportType").val(obj);
    }
    function countShipFee(newAddressId, val) {
        $.ajax({
            type : "POST",
            url :  domain+"/order/calculateTransFee.html",
            data : {addressId:newAddressId,transportType:val},
            dataType : "json",
            success : function(data) {
                if (data.success) {
                    setSumPrice(data.data.finalAmount);
                    //运费渲染到页面
                    $("#shipfee").html(" + "+data.data.logisticsFeeAmount);
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
        $(".total_price .price_left").data("sumpaypricehidden",productFee);
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
        } catch(e) {
            return 0;
        }
    }

    function countCreditUse(obj) {
        //如果余额小于等于0 那么不允许选中
        //用户当前余额
        var balance = parseFloat($("#memberBalance").val());
        //可用赊账
        var memberCreditSurplus = parseFloat($("#memberCreditSurplus").val());
        if (memberBalance <=0 || memberCreditSurplus <= 0) $(obj).prop("checked", false);

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
                    if ($(obj).siblings("span").length>0) {
                        $(obj).siblings("span").remove();
                    }
                    $(obj).parent().append("<span style='color: red;'>您的账户可赊账<b>" + memberCreditSurplus + "</b>元，使用余额支付后，您的账户会产生欠款，请在规定时间内还清欠款。</span>");
                    creditAmount = Number(orderTotalPrice);
                    $("#creditPriceListDiv").show();
                    $("#creditPay").html(creditAmount);
                    $("#usedCreditHidden").val(creditAmount);
                } else if(memberCreditSurplus < Number(orderTotalPrice)){
                    $(obj).siblings("span").remove();
                    $(obj).parent().append("<span style='color: red;'>您的账户余额（包含赊账）可使用总额为<b>"+memberCreditSurplus+
                        "</b>元，其中余额欠款<b>"+userblanance+"</b>元，赊账剩余额度<b>" + memberCreditSurplus + "</b>元，不足以支付当前订单，请充值或还清欠款。</span>");
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
            }
            else {
                $("#balancePay").html(0);
                //隐藏域赋值
                $("#balance").val(balance);
            }
            //金额计算显示
            $("#balancePriceListDiv").show();
            $("#isBalancePay").val('true');
        }
        else {
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
    function submitOrder(){
        //为用户提示说明要选择一种配送方式，不要选错了。
        var userTip = $(".main_part .peisong .selected").data("value");
        var sendType = $("#sendType").val();
        var flag = $("#flag").val();
        //设置地址id
        $("#addressId").val($(".main_part .addressinfo .selected").parent().data("value"));
        if(sendType == 1 && flag == 1 ){
            alerts("一件代发暂不支持二次加工商品！");
            return;
        }
        if(!userTip && sendType == 0){
            // alerts("请选择配送方式");
            alerts("提示","请选择配送方式");
            //跳转到顶部
            window.scrollTo(0,0);
            return false;
        }else if((userTip==6 || userTip==7)  && sendType == 0){
            //自提时则要求用户真实姓名不为空
            var realName = $("#realName").val();
            if(realName == ""){
                //如果真实姓名为空则跳转到个人资料完善页面
                alerts('提示','尊敬的用户,即将跳转个人资料,请完善您的真实姓名,谢谢', function(){
                    window.location.href=domain+"/member/info.html"
                });
                return false;
            }
        }
        else if (userTip == 1  && sendType == 0) {
            var val = $(".main_part .expressrow .selected").data("transporttype");
            if (typeof(val) == "undefined" && sendType == 0) {
                //运送方式
                alerts("请选择快递方式");
                //跳转到顶部
                window.scrollTo(0,0);
                return false;
            }
        }
        //end
        var orderType = $(".main_part .expressrow .selected").data("transporttype");
        //送货上门时判断配送地址是否已经选择
        if(orderType == 5  && sendType == 0){
            var sendArea = $('.gohomerow .select_dropdown .selected').data("value");
            //送货上门时判断地址是否为浙江地区
            var selectaddressAll = $(".main_part .addressinfo .selected").parent().data("addll");
            if(selectaddressAll.indexOf("浙江")<0){
                alerts("送货上门只针对特定区域，请重新选择收货地址或者更改配送方式");
                $('#sendArea').focus();
                return;
            }
            if(sendArea == 1 && sendType == 0){
                alerts("请选择详细配送地区和收货地址");
                $('#sendArea').focus();
                return;
            }else{
                //送货上门的时候需要进行特殊处理，配送方式加配送地区
                $('#transportType').val(orderType+''+sendArea);
            }
        }
        //判断收货地址是否存在,除去自提点提货的单子不需要校验
        if(orderType != 6 && orderType != 7  && sendType == 0){
            if(isEmpty($("#addressId").val())){
                alerts("请添加或选择收货地址");
                return false;
            }
        }
//	var temp = $("input[name='transportType']:checked").val();
//	$("#transportType").val(temp);
        var servicePrice = $("#servicePrice").val();
        if(servicePrice>0){
            orderType = 5;
        }else{
            orderType = 1;
        }
        var actionUrl = domain + "/order/ordercommit.html?ordersType="+orderType;
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
        $("#order-submit").attr("disabled",true);
        // 提交loading
        // $('body').append("<div id='submit_loading' class='purchase-loading'><div class='loading-cont'></div></div>");
        var  tzm_ttfee = $("input[name='tzm_ttfee']");
        var tzm_ttfee_bool = false;
        tzm_ttfee.each(function(i){
            if(parseFloat($(this).val()) > 0 ){//如果有套餐费，则此订单存在二次加工
                tzm_ttfee_bool = true;
            }
        })
        if(tzm_ttfee_bool){
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
            type : "POST",
            dataType : "json",
            url : actionUrl,
            data : param,
            async:false,
            success : function(result) {
                if (result.success) {
                    var data = result.data;
                    var paySessionstr = data.paySessionstr;
                    var goJumpPayfor = data.goJumpPayfor;
                    var relationOrderSn = data.relationOrderSn;
                    var payAmount = data.payAmount;

                    //跳转到成功页面
                    if (goJumpPayfor) {
                        successUrl = domain+"/order/pay.html";
                        newurl = successUrl + "?relationOrderSn=" + relationOrderSn +
                            "&paySessionstr="+paySessionstr+"&rid=" + Math.random();
                        window.setTimeout('window.location.href=newurl;', 450);
                        return;
                    } else {
                        successUrl = domain+"/order/success.html";
                        window.location.href = successUrl+"?relationOrderSn="+relationOrderSn+"&rd="+Math.random();
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
            error : function(error) {
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
    function isEmpty(value){
        if(value == null || value == "" || value == "undefined" || value == undefined || value == "null"){
            return true;
        }
        else{
            value = value.replace(/\s/g,"");
            if(value == ""){
                return true;
            }
            return false;
        }
    }


//验证支付密码
    function checkBalancePwd(balancePwd){
        var correct = false;
        $.ajax({
            type : "GET",
            url :  domain+"/order/checkbalancepwd.html",
            data : {balancePwd:balancePwd},
            dataType : "json",
            async:false,
            success : function(data) {
                if(data.success){
                    correct = data.data.correct;
                    var errcount = parseInt(data.data.pwdErrCount);
                    if(errcount>=6){
                        alerts("支付密码输错超过6次,请用其他方式支付");
                        // $(".toggle-title").click();
                        return false;
                    }
                    if(!correct){
                        alerts("支付密码不正确，您最多还可以输入"+(6-errcount)+"次");
                        return false;
                    }
                }else {
                    alerts(data.message);
                    return false;
                }
            },
            error : function() {
                alerts("验证密码失败！");
            }
        });
        return correct;
    }


    $(".modal_adress").on('click', ".close", function () {
        $(".modal_adress").addClass("hide");
    })


    function initpeisongrow() {
        $(".main_part .peisongrow").each(function (index,el) {
            var hadClass = $(el).hasClass("hide");
            if(!hadClass){
                $(el).addClass("hide");
            }
        })
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
            success: function (data) {

                $(".modal_adress").html(data);
                if (initTimeOut) {
                    clearTimeout(initTimeOut);
                }
                var initTimeOut = setTimeout(function () {
                    //doLoading('province_',config);
                    editDeliveryAddress();
                }, 1);
            },
            error: function () {
                alerts("异常，请重试！");
            }
        });

        $(".modal_adress").on('click', ".close", function () {
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
            $(".saveConsigneeButton").on('click', function () {
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
        var id = $("#newAddressId").val();
        //获得省市区中文并拼接
        var addall = $("input[name='editDeliveryAddress']").val();

        if (!addall) {
            addall += $(".editDeliveryAddress .select_head.province_").html();
            addall += $(".editDeliveryAddress .select_head.city_").html();
            addall += $(".editDeliveryAddress .select_head.area_").html();
        }

        var zipCode = $("#consigneeZipcode").val();
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
        if (zipCode == null || zipCode == '') {
            $("#consignee_zipcode").val("000000");
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
        params += "&zipCode=" + zipCode;
        $.ajax({
            type: "POST",
            url: domain + "/member/saveaddress.html",
            dataType: "json",
            data: params,
            success: function (data) {
                if (data.success) {
                    window.location.reload();
                } else {
                    $("#saveConsigneeButton").removeAttr("disabled");
                    alerts(data.message);

                }
            },
            error: function () {
                $("#saveConsigneeButton").removeAttr("disabled");
                alerts("异常，请重试！");

            }
        });
    }




})