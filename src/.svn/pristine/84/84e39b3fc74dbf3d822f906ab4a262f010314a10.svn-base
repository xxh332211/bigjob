define(["jquery", "common", "modal","modals", "distpicker"], function ($, common, modal, modals,distpicker) {
    var alerts = modals.alerts;
    var modal = modal;
    //用户服务协议
    var protocol = new modal([{
            name: "水电费地方",
            type: "title",
            content: "大袜网用户服务协议"
        },
        {
            name: "xx23h",
            type: "protocol",
            content: "login"
        },
        {
            name: "sdfsd",
            type: "option",
            sub: "big",
            text: "同意并继续"
        }
    ]);
    //委托付款三方协议
    var protocol_2 = new modal([{
            name: "水电费地方",
            type: "title",
            content: "委托付款三方协议"
        },
        {
            name: "xx23h",
            type: "protocol",
            content: "third"
        },
        {
            name: "sdfsd",
            type: "option",
            sub: "big",
            text: "同意并继续"
        }
    ]);
    //注册协议逻辑
    protocol.cover.find('.big').click(function (event) {
        /* Act on the event */
        protocol.hidemodal();
        $(".check_protocol").addClass("selected");
        $(".login_btn").removeClass('disable');
    });
    protocol_2.cover.find('.big').click(function (event) {
        /* Act on the event */
        protocol_2.hidemodal();
        $(".check_protocol").addClass("selected");
        $(".login_btn").removeClass('disable');
    });
    //协议弹窗跳出交互
    var protocol_interactive = {
        pro1_dom: ".login_form .protocol_1",
        pro2_dom: ".login_form .protocol_2",
        bind: function () {
            var _this = this;
            var pro1 = _this.pro1_dom
            var pro2 = _this.pro2_dom;
            $(pro1).click(function(){
                protocol.showmodal();
            })
            $(pro2).click(function(){
                protocol_2.showmodal();
            })
        },
        init: function(){
            protocol_interactive.bind();
        }
    }
    $(".check_protocol .iconfont").click(function(){
        $(".check_protocol").toggleClass("selected");
        $(".login_btn").toggleClass('disable');
    });

    var notice = (function (){
        var noticlock;
        var notic = function (content) {
            clearTimeout(noticlock)
            $(".notice .word").html(content);
            $(".notice").fadeIn("fast");
            noticlock = setTimeout(function(){
                $(".notice").fadeOut("fast")
            },3000);
        };
        return notic;
    })();
    protocol_interactive.init();

    //判断当前页面是登陆还是重置
    $("body").on('change',".register #userName",function () {
        if (!isphone($(this).val())) {
            notice("亲,请输入正确的手机号");
            return ;
        }else{
            if(!nameIsNotExist($(this).val())){
                notice("您好,此用户名已存在");
                return;
            }
        }
    })
    $("body").on('change',".register #password",function () {
        if (!ispassword($(this).val())) {
            notice("亲,请输入6-20位的英文字母或数字");
            return ;
        }
    })

    $("body").on('change',".register #repassword",function () {
        if ($(".register #password").val() != $(this).val()) {
            notice("亲,两次密码输入不一致");
        }
    })
    $("body").on('click',".double_title .buyer_title",function () {
        if(!$(this).hasClass("selected")){
            $(this).addClass("selected");
            $(this).parent().find(".supplyer_title").removeClass("selected");
            $(".register #memberType").val(2);
        }
    });
    $("body").on('click',".double_title .supplyer_title",function () {
        if(!$(this).hasClass("selected")){
            $(this).addClass("selected");
            $(this).parent().find(".buyer_title").removeClass("selected");
            $(".register #memberType").val(1);
        }
    });
    $("body").on('click',".register .huoqu",function () {
        getmobVerify($(this));
    });
    $("body").on('click',".reset .getcode .mobverify",function () {
        getResetMobVerify($(this));
    });


    if($("#resetButton").length > 0){
        notice("验证后可重置密码");
    }else{
        var alert = $("#dreferrer").val();
        if(alert){
            notice(alert);
            $("#dreferrer").val("");
        }
    }
    //点击重置
    $("#resetButton").click(function () {
        var params = $('#resetForm').serialize();
        $.ajax({
            type : "POST",
            url : domain + "/doforgetpassword.html",
            dataType : "json",
            async : false,
            data : params,
            success : function(data) {
                if (data.success) {
                    alerts( '提示',data.data, function() {
                        window.location = domain + "/login.html?dreferrer=" + "密码重置成功，请查收短信";
                    });
                } else {
                    alerts(data.message);
                    refreshCode();
                    //刷新验证码
                }
            }
        });
    })







    $("body").on('click',".login_btn  #registerButton",function () {
        var canRegister = true;
        if($(this).parent().hasClass("disable")) {
            canRegister = false;
            notice("请阅读并勾选平台用户服务协议");
            return;
        }
        if(!$(".register #userName").val() || !isphone($(".register #userName").val())){
            canRegister = false;
            notice("请输入正确的手机号");
            return;
        }else{
            if(!nameIsNotExist($(".register #userName").val())){
                notice("您好,此用户名已存在");
                canRegister = false;
                return;
            }
        }
        if(!$(".register #password").val() || !ispassword($(".register #password").val())){
            canRegister = false;
            notice("密码需为6-20位的字符或数字");
            return;
        }
        if(!$(".register #repassword").val() || $(".register #password").val() != $(".register #repassword").val() ){
            canRegister = false;
            notice("两次密码输入不一致");
            return;
        }

        if(canRegister){
            var params = $('#register').serialize();
            $.ajax({
                type : "POST",
                url : domain + "/doregister.html",
                dataType : "json",
                async : false,
                data : params,
                success : function(data) {
                    if (data.success) {
                        var BackUrl= "/store/step2.html";
                        if(data.backUrl.trim() !="" ){
                            alerts('提示', '验证通过！请完善企业相关资料', function() {
                                window.location.href = domain + BackUrl;
                            });
                        }else{
                            alerts('提示','注册成功！请先完善您的个人资料',  function() {
                                window.location.href = domain + "/member/info.html";//+"/member/index.html";window.location.href = domain + "/member/info.html";
                            });
                            /*jAlert('注册成功！注册有礼，大袜哥已将优惠券偷偷塞给您。快去查看吧', '提示', function() {
                             window.location = domain + '/member/coupon-use.html';
                             });*/
                        }
                    } else {
                        alerts(data.message);
                        refreshCode();// 刷新验证码
                    }
                },
                error : function() {
                    alerts("异常，请重试！");
                }
            });

        }

    })
//给立即登入绑定事件
    $("#loginButton").click(function(){
        if(!$("#name").val()){
            notice("用户名必填");
            return;
        }
        if(!$("#password").val()){
            notice("密码必填");
            return;
        }
        if(!$("input[name='verifyCode']").val()){
            notice("验证码必填");
            return;
        }
            var params = $("#loginForm").serialize();
            $.ajax({
                type:"POST",
                url:domain+"/dologin.html",
                dataType:"json",
                async : false,
                data : params,
                success:function(data){
                    if(data.success){
                        var boolRealnametrue = (data.data.realName==null) || (data.data.realName=="");
                        var boolRealnamefalse = (data.data.realName!=null) && (data.data.realName!="");
                        if(boolRealnametrue){
                            window.location.href=domain+"/member/info.html";
                        }
                        if(boolRealnamefalse){
                            var dreferrer = $("#dreferrer").val();
                            if (dreferrer != "")
                                window.location.href=dreferrer;
                            else
                                window.location.href=domain+"/index.html";
                        }
                    }else{
                        notice(data.message);
                        //刷新验证码
                        refreshCode();
                    }
                },
                error:function(){
                    notice("异常，请重试！");
                }
            });
    });

    //监听回车事件  不起作用
    function keyDownSubmit(e){
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if(code == 13){
            $("#loginButton").click();
        }
    }
    document.onkeydown = keyDownSubmit;

    //获取手机验证码校验
    function getmobVerify(this_){
        var obj = $(this_);
        var userName = $(".register #userName").val();
        if(!userName){
            notice("手机号码必填");
            return;
        }else{
            if(!isphone(userName)){
                notice("请输入正确的手机号码");
                return;
            }
        }
        var verifyCode = $(".register #verifyCode").val();
        if(!verifyCode){
            notice("数字验证码必填");
            return;
        }

        var textBool = obj.text().indexOf("获取验证码")>=0;
        var mob = userName;
        if(userName && verifyCode && textBool){
            $.ajax({
                type : 'get',
                url : domain + '/sendVerifySMS.html?mob=' + mob
                + '&verifycode=' + verifyCode,
                success : function(e) {
                    if (e.success) {
                        var time = 120;
                        obj.text(time + "秒");
                        time--;
                        intervalId = setInterval(function() {
                            obj.text(time + "秒");
                            if (time == 0) {
                                clearInterval(intervalId);
                                obj.text("获取验证码");
                            }
                            time--;
                        }, 1000);
                    } else {
                        alerts(e.message);
                    }
                }
            });
        }
    }
    //获取手机验证码校验
    function getResetMobVerify(this_){
        var obj = $(this_);
        var userName = $(".reset #name").val();
        if(!userName){
            notice("手机号码必填");
            return;
        }else{
            if(!isphone(userName)){
                alerts("请输入正确的手机号码");
                return;
            }
        }
        var textBool = obj.text().indexOf("获取验证码")>=0;
        var mob = userName;
        if(userName && textBool){
            $.ajax({
                type : 'get',
                url : domain + '/mobVerify.html?mob=' + mob,
                success : function(e) {
                    if (e.success) {
                        var time = 120;
                        obj.text(time + "秒后重新获取");
                        time--;
                        intervalId = setInterval(function() {
                            obj.text(time + "秒后重新获取");
                            if (time == 0) {
                                clearInterval(intervalId);
                                obj.text("获取验证码");
                            }
                            time--;
                        }, 1000);
                    } else {
                        alerts(e.message);
                    }

                }
            });
        }
    }
    //验证用户名是否已存在
    function nameIsNotExist(value){
        var nameIsNotExist = false;
        $.ajax({
            type:"GET",
            url:domain+"/nameIsExist.html",
            dataType:"json",
            async : false,
            data : {name:value},
            success:function(data){
                if(data.success){
                    nameIsNotExist = true;
                } else {
                    alerts(data.message);
                }
            }
        });

        return nameIsNotExist;
    }
})
//刷新验证码
function refreshCode(){
    jQuery("#code_img").attr("src", domain + "/verify.html?d"+new Date().getTime());
}

function ispassword(value) {
    if (value.search(/^[a-zA-Z0-9_-]{6,20}$/) == -1) {
        return false;
    } else {
        return true;
    }
}


function isphone(value) {
    if (value.search(/^(\+\d{2,3})?\d{11}$/) == -1) {
        return false;
    } else {
        return true;
    }
};