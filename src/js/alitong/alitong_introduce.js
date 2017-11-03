define(['jquery','common',"bootstrap","alitong_operate","modals","swipper","alitong_index"],function($,common,bootstrap,alitong_operate,modals,swipper,alitong_index){
	for(var key in modals){
        modals[key].post_flag = false;
    }

    var alitong_apply = modals.alitong_apply_2;
    var alitong_protocol = modals.alitong_protocol_2;
    var alitong_login = modals.alitong_login_2;
    var alitong_register = modals.alitong_register_2;
    var regist_protocol = modals.regist_protocol;
    var regist_protocol_2 = modals.regist_protocol_2;
    var alerts = modals.alerts;
    // alerts("提示你","这是一个弹窗");
    //获取手机短信验证码
    function getmobVerify(){
        var obj = $(this);
        var userName = alitong_register.cover.find("div[data-name='username']").find("input");
        var verifyCode = alitong_register.cover.find("div[data-name='verifyCode']").find("input");
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
                        obj.data('msgcode',e.data);
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
        alitong_register.cover.find(".big").attr("disabled","disabled");
        return true;
    }
    //阿里通协议逻辑
    alitong_protocol.cover.find('.big').click(function(event) {
        if($(this).hasClass('disable')){
            return;
        }
        if (!$(this).hasClass('disable')){
            alitong_protocol.hidemodal();
            alitong_apply.showmodal();
        }
    });

    //阿里通表单逻辑
    alitong_apply.cover.find('.sure').click(function(event) {
        if(alitong_apply.post_flag) return;
        var cansend = alitong_apply.cansend();
        var memberStore = alitong_apply.getresult();
        if(alitong_apply.uptype=="yijianshangchuan"){
            alitong_apply.post_flag = true;
            //一键上传提交
            if (cansend) {
                //数据通过校验，转换数据格式进行ajax请求
                memberStore = JSON.stringify(memberStore);
                $.ajax({
                    async: true,
                    type: "POST",
                    url: "/product/memberstoreadd",
                    data: {"memberStore": memberStore},
                    success: function (result) {
                        //请求成功，跳转至阿里的铺货授权页面
                        alitong_apply.post_flag = false;
                        if (result.data) {
                            window.open("http://www.dawawang.com/services/alibaba.html")
                        }
                    }
                });
            }else {
                alerts("填写错误");
            }
            return;
        }
        if(alitong_apply.uptype=="yijiandaifa"){
            alitong_apply.post_flag = true;
            //一键代发提交
            if (cansend) {
                //数据通过校验，转换数据格式进行ajax请求
                memberStore = JSON.stringify(memberStore);
                $.ajax({
                    async: true,
                    type: "POST",
                    url: "/product/memberstoreadd",
                    data: {"memberStore": memberStore},
                    success: function (result) {
                        //请求成功，跳转至阿里的抓单授权页面
                        alitong_apply.post_flag = false;
                        if (result.data) {
                            window.open("http://www.dawawang.com/services/alibaba.html");
                        }
                    }
                });
            }else{
                alerts("填写错误");
            }
            return;
        }
    });

    //登录逻辑
    alitong_login.cover.find(".big").click(function(){
        if(alitong_login.post_flag) return;
        var result = alitong_login.getresult();
        var cansend = alitong_login.cansend();
        if (cansend) {
            //数据通过校验，转换数据格式进行ajax请求
            // result = JSON.stringify(result);
            alitong_login.post_flag = true;
            var params = "";
            params += "name=" + result.username;
            params += "&password=" + result.password;
            params += "&verifyCode=" + result.verifyCode;
            $.ajax({
                async: true,
                type: "POST",
                url: "/dologin.html",
                data: params,
                success: function (data) {
                    if(data.success){
                        //请求成功
                        alitong_login.post_flag = false;
                        alitong_login.hidemodal();
                        alitong_protocol.showmodal();
                    }else {
                        alerts(data.message);
                    }
                }
            });
        }else{
            alerts('填写错误')
        }
    });

    //注册页弹出
    alitong_login.cover.find('.login_tag a:last-child').click(function(event) {
        event.preventDefault();
        alitong_login.hidemodal();
        alitong_register.showmodal();
         alitong_register.cover.find("div.fullinput:last").prev().find("span img").attr("src",domain+"/verify.html?d"+new Date().getTime());
    });

    //注册页逻辑
    alitong_register.cover.find('.big').click(function(event) {
        if(alitong_register.post_flag) return;
		/* Act on the event */
        var able = !$(this).hasClass('disable');
        var result = alitong_register.getresult();
        var msg = alitong_register.cover.find('.getcode').data('msgcode')
        var msgcheck = checkRegisterParam(result,msg);
        if(able&&msgcheck) {
            alitong_register.post_flag = true;
            result.name = result.username;
            result.lastLoginIp=domain.substring(domain.lastIndexOf('/')+1);
            result.memberType = 2;
            $.ajax({
                type:"POST",
                url:domain + "/doregister.html",
                dataType:"json",
                async : false,
                data : result,
                success:function(data){
                    if(data.success){
                        alitong_register.post_flag = false;
                        alitong_register.hidemodal();
                        alitong_protocol.showmodal();
                    }else {
                        alerts(data.message);
                    }
                },
                error:function(){
                    alerts("请求出错")
                }
            });
        }
    });
    //刷新验证码
   

    alitong_register.cover.find("div.fullinput:last").prev().find("span img").click(function(){
        $(this).attr("src",domain+"/verify.html?d"+new Date().getTime());
    });
    alitong_register.cover.find('.getcode').click(getmobVerify);

    alitong_login.cover.find("div.fullinput:last").find("span img").click(function(){
        $(this).attr("src",domain+"/verify.html?d"+new Date().getTime());
    });
    
    //绑定业务逻辑
    var  procedure = {
        step_1 : ".sign_up button:first-child,.apply_upload a",
        step_2 : ".sign_up button:last-child,.apply_send a",
        check_login: isUserLogin,
        step_1_func: function () {
            var _this = this;
            var islogin = procedure.check_login();
            alitong_apply.uptype = "yijianshangchuan"
            if(islogin){ //已登录
                alitong_protocol.showmodal();
            }else {
                // alitong_login.showmodal();
                alitong_login.showmodal();
                alitong_login.cover.find("div.fullinput:last").find("span img").attr("src",domain+"/verify.html?d"+new Date().getTime());
            }
        },
        step_2_func: function () {
            var _this = this;
            var islogin = procedure.check_login();
            alitong_apply.uptype = "yijiandaifa";
            if(islogin){ //已登录
                alitong_protocol.showmodal();
            }else {

                alitong_login.showmodal();
                alitong_login.cover.find("div.fullinput:last").find("span img").attr("src",domain+"/verify.html?d"+new Date().getTime());
            }
        },
        init: function () {
            $(procedure.step_1).click(procedure.step_1_func);
            $(procedure.step_2).click(procedure.step_2_func);
        }
    };
    procedure.init();
    /*搜索商品*/
    $(".search_btn").on('click',function () {
        var keyword = $(".search").val();
        window.location = domain  + "/" + "search.html?keyword=" + keyword +"&alitong=y";
    });
});