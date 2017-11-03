define(['jquery', 'bootstrap', 'modals'], function ($, bootstrap,modals) {

    var alerts = modals.alerts;
    //点击一键代发授权提交,点击一键铺货授权提交
    modals.alitong_apply.cover.find(".sure").click(function(){
        if(modals.alitong_apply.protocolType == "yijianpuhuo"){
            if (modals.alitong_apply.cansend()) {
                //数据通过校验，转换数据格式进行ajax请求
                var memberStore = JSON.stringify(modals.alitong_apply.getresult());
                var newWin1 = window.open("http://www.dawawang.com");
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/product/memberstoreadd",
                    data: {"memberStore": memberStore},
                    success: function (result) {
                        //请求成功，跳转至阿里的一键铺货授权页面
                        if (result.success) {
                            //newWin1.location.href = "http://www.dawawang.com/services/alibaba_product.html";
                            newWin1.location.href = "http://www.dawawang.com/services/alibaba.html";
                            //打开对接弹窗
                            //modals.alitong_apply.hidemodal();
                            modals.alitong_apply.protocolType = "yijiandaifa";
                            modals.alitong_apply.cover.find(".title").html("对接平台：阿里(授权一键代发)");
                            //modals.alitong_apply.cover.find('input').attr('readonly','readonly');
                            //modals.alitong_apply.showmodal();
                            aliStoreModalLoad("yijianpuhuoClick","如果您的授权已完成，请点击继续按钮进行下一步",result.message);
                        }else{
                            alerts(result.message);
                            newWin1.close();
                        }
                    }
                });
            }
        };

    });
    //同意阿里通授权协议
    modals.alitong_protocol.cover.find(".big").click(function(){
        if($(this).attr('class').indexOf('disable')== -1){
            modals.alitong_protocol.hidemodal();
            //打开对接弹窗
            modals.alitong_apply.protocolType = "yijianpuhuo";
            modals.alitong_apply.cover.find("div.title").html("对接平台：阿里(授权一键铺货)");
            modals.alitong_apply.showmodal();
        }
    });
    //点击免费注册（此时进行商城，阿里通一并注册流程）
    modals.alitong_login.cover.find(".login_tag a:last-child").click(function(event){
        event.preventDefault();
        //关闭登录弹窗
        modals.alitong_login.hidemodal();
        //打开注册商城用户弹窗
        modals.alitong_register.showmodal();
        //请求验证码
        modals.alitong_register.cover.find("div.fullinput:last").prev().find("span img").attr("src",domain+"/verify.html?d"+new Date().getTime());
    });
    //点击注册提交审核
    modals.alitong_register.cover.find(".big").click(function(){
        if($(this).attr('class').indexOf('disable')== -1){
            //进行注册操作
            if(modals.alitong_register.cansend()){
                //收集注册信息进行初步验证
                var b = checkRegisterParam(modals.alitong_register.getresult(),modals.alitong_register.cover.find("span.getcode").data('msgCode'));
                if(b){
                    //信息正确进行注册
                    var resB = register(modals.alitong_register.getresult());
                    if(resB.success){
                        //注册成功进入授权流程,注册modal隐藏
                        modals.alitong_register.hidemodal();
                        //进入阿里通授权流程
                        shouquanProtocol();
                    }else{
                        alerts(resB.message);
                    };
                }
            }
        }
    });
    //点击登录进入登录验证流程
    modals.alitong_login.cover.find(".big").click(function(event){
        event.stopPropagation();
        //登录弹出框点击登录按钮
        if(modals.alitong_login.cansend()) {
            $(".big").attr("disabled", "disabled");
            var params = "";
            params += "name=" + modals.alitong_login.getresult().username;
            params += "&password=" + modals.alitong_login.getresult().password;
            params += "&verifyCode=" + modals.alitong_login.getresult().verifyCode;
            //用户登录
            $.ajax({
                type: "POST",
                url: domain + "/dodialoglogin.html",
                dataType: "json",
                async: false,
                data: params,
                success: function (data) {
                    if (data.success) {
                        //刷新页面登录信息
                        //location.reload();
                        //关闭登录弹窗
                        modals.alitong_login.hidemodal();
                        getMemberStores();
                    }else{
                        modals.alerts(data.message);
                    }
                }
            });
        }
    });
    //阿里授权协议点击关闭按钮刷型当前页面
    modals.alitong_protocol.cover.find(".closes").click(function(){
        window.location.reload();
    });
    //点击获取手机验证码事件
    modals.alitong_register.cover.find("span.getcode").click(function(){
        if(modals.alitong_register.cansend()){
            getmobVerify(this);
        }
    });
    //刷新注册验证码
    modals.alitong_register.cover.find("div.fullinput:last").prev().find("span img").click(function(event){
        event.stopPropagation();
        $(this).attr("src",domain+"/verify.html?d"+new Date().getTime());
    });
    //刷新登录验证码
    modals.alitong_login.cover.find("div.fullinput:last span img").click(function(event){
        event.stopPropagation();
        $(this).attr("src",domain+"/verify.html?d"+new Date().getTime());
    });
    //阿里通授权流程
    function shouquanProtocol(){
        modals.alitong_protocol.showmodal();
    }
    //授权完毕，查询商派已授权店铺列表并进行店铺授权关联
    function selectStoreShang(memberStoreId){
        $.ajax({
            async: false,
            type: "POST",
            url: "/product/selectStoreShang",
            data: {"memberStoreId": memberStoreId},
            success: function (result) {
                modals.alitong_apply.cover.find('input').removeAttr('readonly');
                modals.alitong_apply.hidemodal();
                aliStoreModalLoad2(result.message);
            }
        });
    }
    //获取手机短信验证码
    function getmobVerify(this_){
        var obj = $(this_);
        var userName = modals.alitong_register.cover.find("div[data-name='username']").find("input");
        var verifyCode = modals.alitong_register.cover.find("div[data-name='verifyCode']").find("input");
        var textBool = obj.text().indexOf("获取验证码")>=0;
        var mob = userName.val();
        var verifycode = verifyCode.val();
        if(userName && verifyCode && textBool){
            $.ajax({
                type : 'get',
                url : domain + '/sendVerifySMS.html?mob=' + mob
                + '&verifycode=' + verifycode,
                success : function(e) {
                    if (e.success) {
                        var time = 120;
                        obj.text(time + "秒");
                        time--;
                        obj.data('msgCode',e.data);
                        intervalId = setInterval(function() {
                            obj.text(time + "秒");
                            if (time <= 0) {
                                clearInterval(intervalId);
                                obj.text("获取验证码");
                            }
                            time--;
                        }, 1000);
                    } else {
                        alert(e.message);
                    }
                }
            });
        }
    }
    //验证验证码和手机验证码
    function checkRegisterParam(params,msgcode){
        var smsCode = params.smsCode;
        if(msgcode != smsCode){
            alerts("手机验证码错误");
            return false;
        }
        var password = params.password;
        var repassword = params.repassword;
        if (repassword != password) {
            alerts("两次输入密码不一致");
            return false;
        }
        modals.alitong_register.cover.find(".big").attr("disabled","disabled");
        return true;
    }
    //注册函数
    function register (params){
        params.name = params.username;
        params.lastLoginIp=domain.substring(domain.lastIndexOf('/')+1);
        params.memberType = 2;
        var resultB;
        $.ajax({
            type:"POST",
            url:domain + "/doregister.html",
            dataType:"json",
            async : false,
            data : params,
            success:function(data){
                resultB = data;
            },
            error:function(){
                alerts("服务异常，请稍后重试！");
                resultB = false;
                //$("#registerBtn").removeAttr("disabled");
            }
        });
        return resultB;
    };
    //用户未登录流程
    function alitongLogin(){
        //弹出登录框
        modals.alitong_login.showmodal();
        //请求登录验证码
        modals.alitong_login.cover.find("div.fullinput:last span img").attr("src",domain+"/verify.html?d"+new Date().getTime());
    }


    //阿里通铺货流程
    //全局变量
    // productId,sessionKey,omsImgs
    var productId;//3121
    var specPrices;
    var priceRanges;
    var retailpriceType2;
    var aliproductedi = {
        // productId : "",
        // sessionKey : "",
        // imgMainUrls : new Object(),
        // aliimgMainUrls : new Array(),
        // imgDesUrls : new Object(),
        // aliimgDesUrls : new Array(),
        // skuImgUrls : new Object(),
        // aliskuImgUrls : new Array(),
        // spuId : "",
        // albumId : "",
        // freightTempId:"",
        // addressId:"",
        // batchNumber:"",
        // companyCode:"",
        // periodOfValidity :"",
        // unit:"",
        // itemAlibabaId:"",
        // skuIds:new Object()
    };
    //设置一个变量存储进度条的进度信息
    var jinduTemp = 0;
    //获取下载数据包的提交按钮
    var submit0 = $("#aliModal").find("button[name='submit0']");
    //获取一键铺货的提交按钮
    var submit1 = $("#aliModal").find("button[name='submit1']");
    //一口价的table
    var specPricesDom = $("#productToAliForm").find("div.specPricesBySkuClass");
    //阶梯价的table
    var priceRangeDom = $("#productToAliForm").find("div.priceRangesBySkuNum");
    //店铺下拉框
    var selectChoose = $("#productToAliForm").find("select[name='storeidforproduct']");
    //入口函数
    $(function () {
        //获取下载数据包的提交按钮
        var submit0 = $("#aliModal").find("button[name='submit0']");
        //获取一键铺货的提交按钮
        var submit1 = $("#aliModal").find("button[name='submit1']");
        //店铺下拉框
        var selectChoose = $("#productToAliForm").find("select[name='storeidforproduct']");
        //一口价的table
        var specPricesDom = $("#productToAliForm").find("div.specPricesBySkuClass");
        //阶梯价的table
        var priceRangeDom = $("#productToAliForm").find("div.priceRangesBySkuNum");
    });
    //初始化bootstrap提示框
    function aliStoreModalLoad(name,text,memberStoreId){
        $("#aliStoreModal").find("div.modal-footer").find("button[name='close']").hide();
        if(name == "yijianpuhuoClick"){
            $("#aliStoreModal").find("div.modal-footer").find("button[name='yijiandaifaClick']").show();
            $("#aliStoreModal").find("div.modal-footer").find("button[name='yijianpuhuoClick']").hide();
        }
        $("#aliStoreModal").find("div.modal-footer").show();
        $("#aliStoreModal").find("h4.modal-title").html("提示");
        $("#aliStoreModal").find("div.modal-body").html(text);
        $("#aliStoreModal").find("h4.modal-title").data("memberStoreId",memberStoreId);
        $("#aliStoreModal").modal("show");
    }
    function aliStoreModalLoad2(text){
        $("#aliStoreModal").find("div.modal-footer").find("button[name='close']").show();
        $("#aliStoreModal").find("div.modal-footer").find("button[name='yijianpuhuoClick']").hide();
        $("#aliStoreModal").find("div.modal-footer").find("button[name='yijiandaifaClick']").hide();
        $("#aliStoreModal").find("div.modal-footer").show();
        $("#aliStoreModal").find("h4.modal-title").html("提示");
        $("#aliStoreModal").find("div.modal-body").html(text);
        $("#aliStoreModal").modal("show");
    }
    //绑定alimodal的关闭按钮的关闭方法
    $("#aliModal").find("button[name='close']").click(function () {
        $("#aliModal").modal('hide');
    });
    //点击一件代发
    $("#aliStoreModal").find("div.modal-footer").find("button[name='yijiandaifaClick']").click(function(){
        selectStoreShang($("#aliStoreModal").find("h4.modal-title").data("memberStoreId"));
    });
    //点击一键铺货弹出弹框,渲染店铺列表和商品sku信息
    $(".producttoali").click(function(){
        //初始化所有上传参数
        //通过按钮绑定的productid给全局变量productId赋值
        productId = $(this).data("productid");
        aliproductedi.productId = productId;
        specPrices = new Object();
        priceRanges = new Object();
        retailpriceType2 = "";
        aliproductedi = {
            productId : "",
            sessionKey : "",
            imgMainUrls : new Object(),
            aliimgMainUrls : new Array(),
            imgDesUrls : new Object(),
            aliimgDesUrls : new Array(),
            skuImgUrls : new Object(),
            aliskuImgUrls : new Array(),
            spuId : "",
            albumId : "",
            freightTempId:"",
            addressId:"",
            batchNumber:"",
            companyCode:"",
            periodOfValidity :"",
            unit:"",
            itemAlibabaId:"",
            skuIds:new Object()
        };
        var loginType = isUserLogin();
        if(!loginType){
            alitongLogin();
            return;
        }
        selectChoose.html("");
        //获取店铺提点信息
        getMemberStores();

    });
    //切换不同店铺
    selectChoose.change(function(){
        scale = Number(selectChoose.find("option:selected").data("scale"));
        aliproductedi.sessionKey = selectChoose.val();
        getSkuClass(productId, specPricesDom,scale);
        showPriceRanges(productId, priceRangeDom,scale);
        $('#aliModal').modal('show');
    });
    //绑定上传至阿里的提交方法(test)
    $("#aliModal").find("button[name='submit1']").click(function () {
        //进行表单验证
        //报价方式
        var quoteType = $("#productToAliForm").find("select[name='quoteType']").val();
        if (quoteType == 1) {
            //按规格报价，封装一口价信息
            var specPriceDom = $("#productToAliForm").find("div.specPricesBySkuClass");
            var result = getSpecPrices(specPriceDom);
            if (result.success) {
                specPrices = result.data;
            } else {
                alert(result.message);
                return;
            }
        }else if (quoteType == 2) {
            //按数量报价，检测建议零售价
            var retailprice = $("#productToAliForm").find("input[name='retailprice']").val();
            if ($.trim(retailprice) == "" || retailprice == null || Number(retailprice) <= 0) {
                alert("建议零售价必填并且不能小于0");
                return;
            }else{
                retailpriceType2 = retailprice;
            }
            //封装阶梯价信息
            var priceRangeDom = $("#productToAliForm").find("div.priceRangesBySkuNum");
            var result = getPriceRanges(priceRangeDom);
            if (result.success) {
                priceRanges = result.data;
            } else {
                alert(result.message);
                return;
            }
        }
        //对表单进行初始化操作并隐藏modal
        $("#productToAliForm")[0].reset();
        //获取相册空间，开始进行连续发送铺货请求
        $("#aliModal").modal("hide");
        jindutiaoNumber("正在验证相册信息",0,0);
        $('#aliStoreModal').modal('show');
        getPhotoSpace();
        // $("#aliModal").modal("hide");
        //进度条取消用户手动取消权限
        $('#aliStoreModal').modal({backdrop: 'static', keyboard: false});
    });
    //正确获取阿里店铺信息（用户已登录，并且获取了该用户的阿里店铺集合）进行弹出框数据填充
    function successAliModal(result,productId,specPricesDom,priceRangeDom,selectChoose){
        //newWin.close();
        var optionHtml = "";
        var options = result.data;
        for (var i = 0; i < options.length; i++) {
            optionHtml += "<option data-scale=" + options[i].scale + " value=" + options[i].memberStore.storeIdProduct + ">" + options[i].memberStore.storeName + "</option>"
        }
        selectChoose.html(optionHtml);
        var scale = Number(selectChoose.find("option:selected").data("scale"));
        aliproductedi.sessionKey = selectChoose.val();
        getSkuClass(productId, specPricesDom,scale);
        showPriceRanges(productId, priceRangeDom,scale);
        $('#aliModal').modal('show');
    }
    //查询当前商品的sku信息渲染规格报价
    function getSkuClass(productId, specPricesDom,scale) {
        specPricesDom.html();
        $.ajax({
            async: false,
            type: "POST",
            url: "/product/storeGoods",
            data: {"productId": productId},
            success: function (result) {
                if (result.message == "success") {
                    specPricesDom.html("");
                    var skuHtml = " <table class='table table-bordered table-condensed'><thead><tr><th>大袜价格</th><th>阿里单价</th><th>建议零售价</th></tr></thead><tbody>"
                    var productGoods = result.data;
                    for (var i = 0; i < productGoods.length; i++) {
                        if(i == 0){
                            skuHtml += "<tr class='specPrice'>" +
                                "<td><input  name='skucode' type='hidden' value=" + productGoods[i].sku + ">" +
                                "<span style='display: none'>" + productGoods[i].normName.substring(productGoods[i].normName.indexOf(',') + 1, productGoods[i].normName.length) + "</span>" +
                                "<input  style='width:112px;border:1px solid #D7D7D7;' name='dawaPrice' type='number' value=" + productGoods[i].mallPcPrice + " readonly='readonly'>" +
                                "</td>" +
                                "<td><input data-scale=" + parseInt((productGoods[i].mallPcPrice + productGoods[i].mallPcPrice*scale/100)*100)/100 + " style='width:112px;border:1px solid #D7D7D7;' name='price' type='number'>" +
                                "</td>" +
                                "<td><input style='width:112px;border:1px solid #D7D7D7;' type='number' name='retailprice'></td></tr>";
                        }else{
                            skuHtml += "<tr class='specPrice' style='display:none;'>" +
                                "<td><input  name='skucode' type='hidden' value=" + productGoods[i].sku + ">" +
                                "<span style='display: none'>" + productGoods[i].normName.substring(productGoods[i].normName.indexOf(',') + 1, productGoods[i].normName.length) + "</span>" +
                                "<input style='width:112px;border:1px solid #D7D7D7;' name='dawaPrice' type='number' value=" + productGoods[i].mallPcPrice + "readonly='readonly'>" +
                                "</td>" +
                                "<td><input data-scale=" + parseInt((productGoods[i].mallPcPrice + productGoods[i].mallPcPrice*scale/100)*100)/100 + " style='width:112px;border:1px solid #D7D7D7;' name='price' type='number'></td>" +
                                "<td><input style='width:112px;border:1px solid #D7D7D7;' type='number' name='retailprice'></td></tr>";
                        }
                    }
                    skuHtml += "</tbody></table><div style='font-size: x-small;color: red;width:256px;height:17px'></div>";
                    specPricesDom.html(skuHtml);
                    //报价方式的select赋值，并更改为不可编辑
                    $("#productToAliForm").find("select[name='quoteType']").val(1);
                    $("#productToAliForm").find("select[name='quoteType']").prop("disabled", true);
                    //按照sku规格
                    $("#productToAliForm").find("div.priceRangesBySkuNum").hide();
                    $("#productToAliForm").find("div.specPricesBySkuClass").show();
                    //绑定price失去焦点时对比提点价格做出提示
                    specPricesDom.find("input[name='price']").focusout(function(){
                        var pricescale = $(this).data("scale");
                        var price = $(this).val();
                        if(price != "" && Number(price) <= Number(pricescale)){
                            $(this).parent().parent().parent().parent().next().html("您设置的价格低于计算提点后的成本价("+pricescale+")");
                        }else if(price == "" || Number(price) > Number(pricescale)){
                            $(this).parent().parent().parent().parent().next().html("");
                        }
                    })

                }
            }
        });
    };
    //查询当前商品的阶梯价信息渲染
    function showPriceRanges(productId, priceRangeDom,scale) {
        var priceRangeDoms = priceRangeDom.find("tr[class='priceRange']");
        $.ajax({
            async: false,
            type: "POST",
            url: "/product/PriceRange",
            data: {"productId": productId},
            success: function (result) {
                if (result.message == "success") {
                    var productPrice = result.data;
                    for (var i = 0; i < priceRangeDoms.length; i++) {
                        var price = "price" + (i + 1);
                        var priceS = price + "S";
                        if (i > 0) {
                            $(priceRangeDoms[i]).find("input[name='startQuantity']").val(productPrice[priceS]);
                            $(priceRangeDoms[i]).find("input[name='dawaPrice']").val(productPrice[price]);
                            $(priceRangeDoms[i]).find("input[name='price']").attr("data-scale",parseInt((productPrice[price]+productPrice[price]*scale/100)*100)/100);
                        } else {
                            $(priceRangeDoms[i]).find("input[name='startQuantity']").val(result.total);
                            $(priceRangeDoms[i]).find("input[name='dawaPrice']").val(productPrice[price]);
                            $(priceRangeDoms[i]).find("input[name='price']").attr("data-scale",parseInt((productPrice[price]+productPrice[price]*scale/100)*100)/100);
                        }
                        //报价方式的select赋值，并更改为不可编辑
                        $("#productToAliForm").find("select[name='quoteType']").val(2);
                        $("#productToAliForm").find("select[name='quoteType']").prop("disabled", true);
                        //按照sku数量阶梯价
                        $("#productToAliForm").find("div.specPricesBySkuClass").hide();
                        $("#productToAliForm").find("div.priceRangesBySkuNum").show();
                    }
                    //绑定price失去焦点时对比提点价格做出提示
                    priceRangeDoms.find("input[name='price']").focusout(function(){
                        var pricescale = $(this).data("scale");
                        var price = $(this).val();
                        if(price != "" && Number(price) <= Number(pricescale)){
                            $(this).parent().parent().next().children().children().html("您设置的价格低于计算提点后的成本价("+pricescale+")")
                            $(this).parent().parent().next().show();
                        }else if(price == "" ||  Number(price) > Number(pricescale)){
                            $(this).parent().parent().next().children().children().html("");
                            $(this).parent().parent().next().hide();
                        }
                    })
                }
            }
        });
    }
    //封装数量报价对象
    function getPriceRanges(priceRangeDom) {
        var result = {
            success: true,
            message: "",
            data: {}
        };
        var priceRangeDoms = priceRangeDom.find("tr[class='priceRange']");
        var priceRanges = [];
        for (var i = 0; i < priceRangeDoms.length; i++) {
            var priceRange = {};
            priceRange.startQuantity = $(priceRangeDoms[i]).find("input[name='startQuantity']").val();
            if ($.trim(priceRange.startQuantity) == "" || priceRange.startQuantity == null || Number($.trim(priceRange.startQuantity)) <= 0) {
                result.success = false;
                result.message = "起订量必填并且不能小于0";
                return result;
            }
            priceRange.price = $(priceRangeDoms[i]).find("input[name='price']").val();
            if ($.trim(priceRange.price) == "" || priceRange.price == null || Number(priceRange.price) <= 0) {
                result.success = false;
                result.message = "阿里卖价必填并且不能小于0";
                return result;
            }
            priceRanges.push(priceRange);
        }
        //检测价格区间
        var start1 = Number(priceRanges[0].startQuantity);
        var price1 = Number(priceRanges[0].price);
        var start2 = Number(priceRanges[1].startQuantity);
        var price2 = Number(priceRanges[1].price);
        var start3 = Number(priceRanges[2].startQuantity);
        var price3 = Number(priceRanges[2].price);
        result.success = start1 > start2 ? price1 < price2 : price1 > price2;
        result.success = start1 > start3 ? price1 < price3 : price1 > price3;
        result.success = start2 > start3 ? price2 < price3 : price2 > price3;
        if (result.success == false) {
            result.message = "价格区间信息错误";
        }
        result.data = priceRanges;
        return result;
    }
    //封装规格报价对象
    function getSpecPrices(specPriceDom) {
        var result = {
            success: true,
            message: "",
            data: {}
        };
        var specPriceDoms = specPriceDom.find("tr[class='specPrice']");
        var specPriceDomsShow = specPriceDom.find("tr[class='specPrice']:visible");
        var showPrice = $(specPriceDomsShow[0]).find("input[name='price']").val();
        if ($.trim(showPrice) == "" || showPrice == null || Number(showPrice) <= 0) {
            result.success = false;
            result.message = "产品阿里单价必填并且不能小于0";
            return result;
        }
        var showRetailprice = $(specPriceDomsShow[0]).find("input[name='retailprice']").val();
        if ($.trim(showRetailprice) == "" || showRetailprice == null || Number(showRetailprice) <= 0) {
            result.success = false;
            result.message = "产品建议零售价必填并且不能小于0";
            return result;
        }
        var specPrices = [];
        for (var i = 0; i < specPriceDoms.length; i++) {
            var specPrice = {};
            specPrice.skucode = $(specPriceDoms[i]).find("input[name='skucode']").val();
            specPrice.price = showPrice;
            specPrice.retailprice = showRetailprice;
            specPrices.push(specPrice);
        }
        result.data = specPrices;
        return result;
    }
    //渲染指定位置的进度条（----------------------------------------------------------------------------------------）
    function jindutiaoNumber(message, jinduNumStart,jinduNumEnd,callback,nowNum) {
        //发布中的进度条开始展示
        clearInterval(timeInterval1);
        var jinduHtml = "<div class='progress progress-striped active'>" +
            "<div class='progress-bar  progress-bar-info' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='width: " + jinduNumStart + "%;'>" +
            "</div></div>";
        $("#aliStoreModal").find("div.modal-footer").hide();
        $("#aliStoreModal").find("div.modal-header").find("button.close").hide();
        $("#aliStoreModal").find("h4.modal-title").html(message);
        $("#aliStoreModal").find("div.modal-body").html(jinduHtml);
        var timeInterval1 = window.setInterval(function () {
            //计算 “步长"=（属性目标值-盒子原本样式属性的值）/10；”步长越来越小“
            var current1 =  $("#aliStoreModal").find("div.modal-body").find("div.progress-bar").css("width");
            var current2 =  $("#aliStoreModal").find("div.modal-body").find("div.progress-striped").css("width");
            var current = parseInt(current1)/parseInt(current2)*100;
            var jinduStep=(jinduNumEnd-current)/30;
            //因为”步长“有可能除不尽，所以最终可能造成误差，所以根据目标值向上或向下取整
            jinduStep=Math.ceil(jinduStep);
            if(jinduStep <= 0){
                jinduStep = 0;
                window.clearInterval(timeInterval1);
                var widthTemp = jinduNumEnd + '%';
                $("#aliStoreModal").find("div.modal-body").find("div.progress-bar").css("width", widthTemp);
                if(callback){
                    if(nowNum || nowNum>=0){
                        callback(nowNum);
                    }else{
                        callback();
                    }
                }
            }else{
                var widthTemp = (current+jinduStep) + '%';
                $("#aliStoreModal").find("div.modal-body").find("div.progress-bar").css("width", widthTemp);
            }
        }, 500);
    }
    //渲染指定位置的进度条（test----------------------------------------------------------------------------------------）
    // function jindutiaoNumber(message, jinduNumStart,jinduNumEnd,callback,nowNum) {
    //     //发布中的进度条开始展示
    //     // clearInterval(timeInterval1);
    //     var jinduHtml = "<div class='progress progress-striped active'>" +
    //         "<div class='progress-bar  progress-bar-info' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='width: " + jinduNumEnd + "%;'>" +
    //         "</div></div>";
    //     $("#aliStoreModal").find("div.modal-footer").hide();
    //     $("#aliStoreModal").find("div.modal-header").find("button.close").hide();
    //     $("#aliStoreModal").find("h4.modal-title").html(message);
    //     $("#aliStoreModal").find("div.modal-body").html(jinduHtml);
    //     if(callback) {
    //         if (nowNum || nowNum >= 0) {
    //             callback(nowNum);
    //         } else {
    //             callback();
    //         }
    //     }
    // }
    //进度条的显示方法
    function jindutiao(type, message, jinduNum) {
        var result = {};
        if (type == 1) {
            //发布中的进度条开始展示
            var jinduHtml = "<div class='progress progress-striped active'>" +
                "<div class='progress-bar  progress-bar-info' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='width: " + jinduNum + "%;'>" +
                "</div></div>";
            $("#aliStoreModal").find("div.modal-footer").hide();
            $("#aliStoreModal").find("div.modal-header").find("button.close").hide();
            $("#aliStoreModal").find("h4.modal-title").html("发布中");
            $("#aliStoreModal").find("div.modal-body").html(jinduHtml);
            var timeInterval1 = window.setInterval(function () {
                if (jinduNum < 95) {
                    jinduNum++;
                }
                var widthTemp = jinduNum + '%';
                $("#aliStoreModal").find("div.modal-body").find("div.progress-bar").css("width", widthTemp);
                return timeIntervalCallback(jinduNum);
            }, 1000);
            return timeInterval1;
        } else if (type == 2) {
            //发布完成后进度条开始加速展示
            var jinduHtml = "<div class='progress progress-striped active'>" +
                "<div class='progress-bar  progress-bar-info' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='width: " + jinduNum + "%;'>" +
                "</div></div>";
            $("#aliStoreModal").find("div.modal-footer").hide();
            $("#aliStoreModal").find("div.modal-header").find("button.close").hide();
            $("#aliStoreModal").find("h4.modal-title").html("发布中");
            $("#aliStoreModal").find("div.modal-body").html(jinduHtml);
            var timeInterval2 = window.setInterval(function () {
                jinduNum++;
                var widthTemp = jinduNum + '%';
                $("#aliStoreModal").find("div.modal-body").find("div.progress-bar").css("width", widthTemp);
                if (jinduNum >= 110) {
                    window.clearInterval(timeInterval2);
                    $("#aliStoreModal").find("div.modal-footer").show();
                    $("#aliStoreModal").find("h4.modal-title").html("提示");
                    $("#aliStoreModal").find("div.modal-body").html(message);
                    $("#aliStoreModal").modal("show");
                }
                ;
                return timeIntervalCallback(jinduNum);
            }, 100);
            return timeInterval2;
        }
    }
    //进度条定时器回调方法，给全局变量中的进度条变量赋值
    function timeIntervalCallback(jinduNum) {
        jinduTemp = jinduNum;
    }
    //判断用户是否有授权店铺
    function getMemberStores(){
        $.ajax({
            async: false,
            type: "POST",
            url: "/product/memberstores",
            data: {"memberId": memberId},
            success: function (result) {
                if(result.message == "4"){
                    //弹出商派阿里通授权协议（此时进行阿里通授权流程）
                    modals.alitong_protocol.showmodal();
                    shouquanProtocol();
                    return;
                }else if(result.message == "6"){
                    //弹出警示信息，关闭弹窗时刷新当前页面
                    $("#aliStoreModal").find("h4.modal-title").html("系统提示");
                    $("#aliStoreModal").find("div.modal-body").html("店铺请求提点信息失败，请去oms设置提点信息。");
                    $('#aliStoreModal').modal('show');
                    return;
                }else if(result.message == "5"){
                    successAliModal(result,productId,specPricesDom,priceRangeDom,selectChoose);
                    submit0.hide();
                    submit1.show();
                    if ($("#productToAliForm").find("select[name='quoteType']").val() == 1) {
                        //按照sku规格（一口价）
                        $("#productToAliForm").find("div.priceRangesBySkuNum").hide();
                        $("#productToAliForm").find("div.specPricesBySkuClass").show();
                    } else if ($("#productToAliForm").find("select[name='quoteType']").val() == 2) {
                        //按照sku数量（阶梯价）
                        $("#productToAliForm").find("div.specPricesBySkuClass").hide();
                        $("#productToAliForm").find("div.priceRangesBySkuNum").show();
                    }
                    //报价方式的div
                    $("#productToAliForm").find("div.quoteDiv").show();
                    //获取该商品主图，描述图，sku图片信息
                    getOmsImages(productId);
                    return;
                }
            }
        });
    }
    //（获取商品的sku图片，主图，描述图）
    function getOmsImages(productId){
        $.ajax({
            async: false,
            type: "POST",
            url: "/product/getOmsImages",
            data: {"productId":productId},
            success: function (result) {
                if(result.success){
                    aliproductedi.imgMainUrls = result.data.imgMainUrls;
                    aliproductedi.imgDesUrls = result.data.imgDesUrls;
                    aliproductedi.skuImgUrls = result.data.skuImgUrls;
                    aliproductedi.spuId = result.data.spuId;
                    aliproductedi.batchNumber = result.data.batchNumber;
                    aliproductedi.companyCode = result.data.companyCode;
                    aliproductedi.periodOfValidity = result.data.periodOfValidity;
                    aliproductedi.unit = result.data.unit;
                    aliproductedi.itemAlibabaId = result.data.itemAlibabaId;
                    aliproductedi.skuIds = result.data.skuIds;
                }else{
                    successOrerrorModal(result.message);
                }
            }
        });
    }
    //获取相册空间，相册列表，创建相册
    function getPhotoSpace(){
        $.ajax({
            async: true,
            type: "POST",
            url: "/product/getPhotoSpace",
            data: {"spuId":aliproductedi.spuId,"sessionKey":aliproductedi.sessionKey,"skuIds":JSON.stringify(aliproductedi.skuIds)},
            success: function (result) {
                if(result.success){
                    aliproductedi.albumId = result.data.albumId;
                    jindutiaoNumber("正在验证相册信息",0,5,getFreightTemp);
                }else{
                    successOrerrorModal(result.message);
                }
            }
        });
    }
    //获取运费模版
    function getFreightTemp(){
        $.ajax({
            async: false,
            type: "POST",
            url: "/product/getFreightTemp",
            data: {"sessionKey":aliproductedi.sessionKey},
            success: function (result) {
                if(result.success){
                    aliproductedi.freightTempId = result.data.freightId;
                    aliproductedi.addressId = result.data.addressId;
                    jindutiaoNumber("正在验证运费模版以及发货地址",5,7,upImg,0);
                }else{
                    successOrerrorModal(result.message);
                }
            }
        });
    }
    //上传图片
    function upImg(nowNum){
        var imgType;
        var totalNum = aliproductedi.imgMainUrls.length + aliproductedi.imgDesUrls.length+ aliproductedi.skuImgUrls.length;
            var i=nowNum;
            if(i < aliproductedi.imgMainUrls.length){
                imgType = 2;
                imgName = "mainUrl";
                imgUrl = aliproductedi.imgMainUrls[i];
            }else if((i - aliproductedi.imgMainUrls.length) < aliproductedi.imgDesUrls.length){
                imgType = 0;
                imgName = "desUrl";
                imgUrl = aliproductedi.imgDesUrls[(i - aliproductedi.imgMainUrls.length)];
            }else{
                imgType = 1;
                k = i-(aliproductedi.imgMainUrls.length+aliproductedi.imgDesUrls.length);
                imgName = aliproductedi.skuImgUrls[k].attributeValue;
                imgUrl = aliproductedi.skuImgUrls[k].skuImageUrl;
            }
            $.ajax({
                async: false,
                type: "POST",
                url: "/product/upImg",
                data: {"albumId":aliproductedi.albumId,"sessionKey":aliproductedi.sessionKey,"desc":imgType,"number":nowNum,"imgName":imgName,"imgUrl":imgUrl},
                success: function (result) {
                    if(result.success){
                        nowNum++;
                        if(result.data.type == 0){
                            aliproductedi.aliimgDesUrls.push(result.data.aliImgUrl);
                        }else if(result.data.type == 1){
                            aliproductedi.aliskuImgUrls.push({"skuName":imgName,"skuImgUrl":result.data.aliImgUrl})
                        }else if(result.data.type == 2){
                            aliproductedi.aliimgMainUrls.push(result.data.aliImgUrl);
                        }
                        if(nowNum == totalNum){
                            jindutiaoNumber("正在上传图片"+(nowNum)+"/"+totalNum,7+(80/totalNum)*(nowNum-1),7+(80/totalNum)*(nowNum),upProduct);
                        }else{
                            jindutiaoNumber("正在上传图片"+(nowNum)+"/"+totalNum,7+(80/totalNum)*(nowNum-1),7+(80/totalNum)*(nowNum),upImg,nowNum);
                        }
                    }else{
                        successOrerrorModal(result.message);
                    }
                }
            });
    }
    //发布商品
    function upProduct(){
        var aliResult = finalProductJson();
        $.ajax({
            async: false,
            type: "POST",
            url: "/product/upProduct",
            data: {"freightId":aliproductedi.freightTempId,"addressId":aliproductedi.addressId,"byCargoNumber":aliproductedi.spuId,"dataType": 1,"sessionKey":aliproductedi.sessionKey, "productId": productId, "aliResult": JSON.stringify(aliResult)},
            success: function (result) {
                if(result.success){
                    jindutiaoNumber("正在整合信息并发布商品",90,95,downUpOms,result.data.productID);
                }else{
                    successOrerrorModal(result.message);
                }
            }
        });
    }
    //下载铺货（回传阿里店铺上传商品信息至oms）
    function downUpOms(aliProductId){
        var aliResult = finalProductJson();
        $.ajax({
            async: false,
            type: "POST",
            url: "/product/downUpOms",
            data: {"quoteType":aliResult.quoteType,"freightId":aliproductedi.freightTempId,"addressId":aliproductedi.addressId,"cargoNumber":aliproductedi.spuId,"dataType": 1,"sessionKey":aliproductedi.sessionKey, "aliProductId": aliProductId,"itemAlibabaId":aliproductedi.itemAlibabaId},
            success: function (result) {
                if(result.success){
                    jindutiaoNumber("正在建立商品对应关系",95,100,successOrerrorModal,result.data.successMessage);
                }else{
                    successOrerrorModal(result.message);
                }
            }
        });
    }
    // 组装最终发布商品的数据
    function finalProductJson() {
        //报价方式
        var quoteType = $("#productToAliForm").find("select[name='quoteType']").val();
        //阿里商铺id
        var storeidforproduct = $("#productToAliForm").find("select[name='storeidforproduct']").val();
        if (quoteType == 1) {
            //按规格报价，封装一口价信息
            var aliResult = {
                "specPrices": specPrices,
                "quoteType": quoteType,
                "storeId": storeidforproduct,
                "type": 1,
                "batchNumber": aliproductedi.batchNumber,
                "companyCode":  aliproductedi.companyCode,
                "periodOfValidity":  aliproductedi.periodOfValidity,
                "spuCode":  aliproductedi.spuId,
                "unit":  aliproductedi.unit,
                "imgMainUrls":  aliproductedi.aliimgMainUrls,
                "imgDesUrls": aliproductedi.aliimgDesUrls,
                "imgSkuUrls": aliproductedi.aliskuImgUrls
            };
            return aliResult;
        } else if (quoteType == 2) {
            //按数量报价，检测建议零售价
            var aliResult = {
                "retailprice": retailpriceType2,
                "quoteType": quoteType,
                "storeId": storeidforproduct,
                "priceRanges": priceRanges,
                "type": 1,
                "batchNumber": aliproductedi.batchNumber,
                "companyCode":  aliproductedi.companyCode,
                "periodOfValidity":  aliproductedi.periodOfValidity,
                "spuCode":  aliproductedi.spuId,
                "unit":  aliproductedi.unit,
                "imgMainUrls":  aliproductedi.aliimgMainUrls,
                "imgDesUrls": aliproductedi.aliimgDesUrls,
                "imgSkuUrls": aliproductedi.aliskuImgUrls
            };
            return aliResult;
            // $.ajax({
            //     type: "POST",
            //     url: "/product/productToAli",
            //     data: {"dataType": 1, "productId": productId, "aliResult": JSON.stringify(aliResult)},
            //     success: function (msg) {
            //         window.clearInterval(timeinterval1);
            //         //打印铺货请求的失败或成功信息到控制台
            //         console.log(msg.data);
            //         console.log(msg.backUrl);
            //         if (msg.success) {
            //             jindutiao(2, msg.message, jinduTemp);
            //         } else {
            //             successOrerrorModal(msg.message);
            //         }
            //     }
            // });
        }
    };
    function successOrerrorModal(message){
        $("#aliStoreModal").find("div.modal-footer").show();
        $("#aliStoreModal").find("h4.modal-title").html("提示");
        $("#aliStoreModal").find("div.modal-body").html(message);
        $("#aliStoreModal").modal("show");
    }
});