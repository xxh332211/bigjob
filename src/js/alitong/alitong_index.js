define(["jquery", 'common', "alitong_operate", "modals"], function ($, common, alitong_operate, modals) {

    for (var key in modals) {
        modals[key].post_flag = false;
    }

    var alitong_apply = modals.alitong_apply_2;
    var alitong_protocol = modals.alitong_protocol_2;
    var alitong_login = modals.alitong_login_2;
    var alitong_register = modals.alitong_register_2;
    var regist_protocol = modals.regist_protocol;
    var regist_protocol_2 = modals.regist_protocol_2;
    var alerts = modals.alerts;
    var modal_login = modals.modal_login;
    var modal_register = modals.modal_register;
    // alerts("提示你","这是一个弹窗");
    //获取手机短信验证码
    function getmobVerify() {
        var obj = $(this);
        var userName = alitong_register.cover.find("div[data-name='username']").find("input");
        var verifyCode = alitong_register.cover.find("div[data-name='verifyCode']").find("input");
        var textBool = obj.text().indexOf("获取验证码") >= 0;
        var mob = userName.val();
        var verifycode = verifyCode.val();
        if (userName && verifyCode && textBool) {
            $.ajax({
                type: 'get',
                url: domain + '/sendVerifySMS.html?mob=' + mob +
                '&verifycode=' + verifycode,
                success: function (e) {
                    if (e.success) {
                        var time = 120;
                        obj.text(time + "秒");
                        time--;
                        obj.data('msgcode', e.data);
                        intervalId = setInterval(function () {
                            obj.text(time + "秒");
                            if (time === 0) {
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
    function checkRegisterParam(params, msgcode) {
        var smsCode = params.smsCode;
        if (msgcode != smsCode) {
            alerts("手机验证码错误");
            return false;
        }
        var password = params.password;
        var repassword = params.repassword;
        if (repassword != password) {
            alerts("两次输入密码不一致");
            return false;
        }
        alitong_register.cover.find(".big").attr("disabled", "disabled");
        return true;
    }

    // alitong_login.showmodal();
    // regist_protocol.showmodal();
    // alitong_register.showmodal();
    // alitong_apply.showmodal();
    //轮播图
    var banner_center = {
        slide: ".banner_center .banner_pics .slide_part",
        single: ".banner_center .banner_pics .slide_part .single",
        tip: ".banner_center .banner_index .main_index .indexs .index",
        index: 0,
        pic_width: 742,
        move_func: function () {
            var index = banner_center.index;
            var width = banner_center.pic_width;
            $(banner_center.slide)
                .stop()
                .animate({
                    left: -index * width + "px"
                }, "fast");
        },
        addindex: function () {
            var index = banner_center.index;
            var limit = $(banner_center.tip).length - 1;
            banner_center.index = ++index;
            if (banner_center.index > limit) {
                banner_center.index = 0;
            }
        },
        tip_hover_in: function () {
            clearInterval(banner_center.timer1);
            banner_center.index = $(this).index();
            banner_center.move_func();
        },
        tip_hover_out: function () {
            banner_center.timer1 = setInterval(function () {
                banner_center.addindex();
                banner_center.move_func();
            }, 2000);
        },
        init: function () {
            banner_center.timer1 = setInterval(function () {
                banner_center.addindex();
                banner_center.move_func();
            }, 2000);
            $(banner_center.tip).hover(banner_center.tip_hover_in, banner_center.tip_hover_out);
        }
    };
    //banner右侧
    var banner_right = {
        title: ".banner_right .apply_guide_step .guide_step_content .step .step_title",
        pic: ".step_content",
        step: ".banner_right .apply_guide_step .guide_step_content .step",
        active_func: function () {
            $(this).parents(".step").addClass('active').siblings('.step').removeClass('active');
        },
        init: function () {
            $(banner_right.title).hover(banner_right.active_func);
        }
    };
    // var today_sell = {
    // 	part: ".today .today_nav .part",
    // 	page: ".today .today_content .content_product",
    // 	index: 0,
    // 	setindex: function (index) {
    // 		today_sell.index = index;
    // 	},
    // 	setactive: function () {
    // 		var index = today_sell.index;
    // 		$(today_sell.part).eq(index).addClass('active').siblings('.part').removeClass('active');
    // 		(today_sell.page).eq(index).addClass('active').siblings('.content_product').removeClass('active');
    // 	},
    // 	addindex: function () {
    // 		today_sell.index = today_sell.index + 1;
    // 	},
    // 	reduceindex: function () {
    // 		today_sell.index = today_sell.index - 1;
    // 	},
    // 	index_cheack: function () {
    // 		var limit = $(today_sell.part).length;
    // 		var index = today_sell.index;
    // 		if(index>limit){
    // 			today_sell.index = limit;
    // 		}
    // 		if(index<0){
    // 			today_sell.index = 0;
    // 		}
    // 	},
    // 	init: function () {
    // 		today_sell.setactive();
    // 	}
    // };


    //阿里通协议逻辑
    alitong_protocol.cover.find('.big').click(function (event) {
        if ($(this).hasClass('disable')) {
            return;
        }
        if (!$(this).hasClass('disable')) {
            alitong_protocol.hidemodal();
            alitong_apply.showmodal();
        }
    });
    //授权完毕，查询商派已授权店铺列表并进行店铺授权关联
    function selectStoreShang(memberStoreId){
        $.ajax({
            async: false,
            type: "POST",
            url: "/product/selectStoreShang",
            data: {"memberStoreId": memberStoreId},
            success: function (result) {
                alerts("提示",result.message);
            }
        });
    }
    //阿里通表单逻辑
    alitong_apply.cover.find('.sure').click(function (event) {
        if (alitong_apply.post_flag) return;
        var cansend = alitong_apply.cansend();
        var memberStore = alitong_apply.getresult();
        if (alitong_apply.uptype == "yijianshangchuan") {
            alitong_apply.post_flag = true;
            //一键上传提交
            if (cansend) {
                //数据通过校验，转换数据格式进行ajax请求
                memberStore = JSON.stringify(memberStore);
                var newWin1 = window.open("http://www.dawawang.com");
                $.ajax({
                    async: true,
                    type: "POST",
                    url: "/product/memberstoreadd",
                    data: {
                        "memberStore": memberStore
                    },
                    success: function (result) {
                        //请求成功，跳转至阿里的铺货授权页面
                        alitong_apply.post_flag = false;
                        if (result.success) {
                            newWin1.location.href = "http://www.dawawang.com/services/alibaba.html";
                            aliStoreModalLoad("yijianpuhuoClick","如果您的授权已完成，请点击继续按钮进行下一步",result.message);
                        }else{
                            alerts(result.message);
                        }
                    }
                });
            } else {
                alerts("填写错误");
                alitong_apply.post_flag = false;
            }
            return;
        }
        if (alitong_apply.uptype == "yijiandaifa") {
            alitong_apply.post_flag = true;
            //一键代发提交
            if (cansend) {
                //数据通过校验，转换数据格式进行ajax请求
                memberStore = JSON.stringify(memberStore);
                $.ajax({
                    async: true,
                    type: "POST",
                    url: "/product/memberstoreadd",
                    data: {
                        "memberStore": memberStore
                    },
                    success: function (result) {
                        //请求成功，跳转至阿里的抓单授权页面
                        alitong_apply.post_flag = false;
                        if (result.success) {
                            newWin1.location.href = "http://www.dawawang.com/services/alibaba.html";
                            window.alert("请先完成信息填写")
                            alerts("消息","请先完成信息填写",selectStoreShang,result)
                        }else{
                            alerts(result.message);
                        }
                    }
                });
            } else {
                alerts("填写错误");
                alitong_apply.post_flag = false;
            }
            return;
        }
    });

    //登录逻辑
    alitong_login.cover.find(".big").click(function () {
        console.log("哈1")
        if (alitong_login.post_flag) return;
        console.log("哈2")
        var result = alitong_login.getresult();
        var cansend = alitong_login.cansend();
        if (cansend) {
            console.log("哈3")
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
                    if (data.success) {
                        //请求成功
                        alitong_login.post_flag = false;
                        alitong_login.hidemodal();
                        alitong_protocol.showmodal();

                    } else {
                        alerts(data.message);
                        alitong_login.post_flag = false;
                    }
                }
            });
        } else {
            console.log("哈4")
            alerts('填写错误');
            alitong_login.post_flag = false;
        }
    });

    //注册页弹出
    alitong_login.cover.find('.login_tag a:last-child').click(function (event) {
        event.preventDefault();
        alitong_login.hidemodal();
        alitong_register.showmodal();
        alitong_register.cover.find("div.fullinput:last").prev().find("span img").attr("src", domain + "/verify.html?d" + new Date().getTime());
    });

    //注册页逻辑
    alitong_register.cover.find('.big').click(function (event) {

        console.log("xiaohaohasss");
        if (alitong_register.post_flag) return;
        /* Act on the event */
        var able = !$(this).hasClass('disable');
        var result = alitong_register.getresult();
        var msg = alitong_register.cover.find('.getcode').data('msgcode');
        var msgcheck = checkRegisterParam(result, msg);
        if (able && msgcheck) {
            alitong_register.post_flag = true;
            result.name = result.username;
            result.lastLoginIp = domain.substring(domain.lastIndexOf('/') + 1);
            result.memberType = 2;
            $.ajax({
                type: "POST",
                url: domain + "/doregister.html",
                dataType: "json",
                async: false,
                data: result,
                success: function (data) {
                    if (data.success) {
                        alitong_register.post_flag = false;
                        alitong_register.hidemodal();
                        alitong_protocol.showmodal();
                    } else {
                        alerts(data.message);
                        alitong_register.post_flag = false;
                    }
                },
                error: function () {
                    alerts("请求出错");
                    alitong_register.post_flag = false;
                }
            });
        }
    });
    //刷新验证码


    alitong_register.cover.find("div.fullinput:last").prev().find("span img").click(function () {
        $(this).attr("src", domain + "/verify.html?d" + new Date().getTime());
    });
    alitong_register.cover.find('.getcode').click(getmobVerify);

    alitong_login.cover.find("div.fullinput:last").find("span img").click(function () {
        $(this).attr("src", domain + "/verify.html?d" + new Date().getTime());
    });

    //绑定业务逻辑
    var procedure = {
        step_1: ".guide_step_content .step:first-child",
        // step_2: ".guide_step_content .step:last-child",
        check_login: isUserLogin,
        step_1_func: function () {
            var _this = this;
            var islogin = procedure.check_login();
            alitong_apply.uptype = "yijianshangchuan";
            if (islogin) { //已登录
                alitong_protocol.showmodal();
            } else {
                // alitong_login.showmodal();
                alitong_login.showmodal();
                alitong_login.cover.find("div.fullinput:last").find("span img").attr("src", domain + "/verify.html?d" + new Date().getTime());
            }
        },
        step_2_func: function () {
            var _this = this;
            var islogin = procedure.check_login();
            alitong_apply.uptype = "yijiandaifa";
            if (islogin) { //已登录
                alitong_protocol.showmodal();
            } else {

                alitong_login.showmodal();
                alitong_login.cover.find("div.fullinput:last").find("span img").attr("src", domain + "/verify.html?d" + new Date().getTime());
            }
        },
        init: function () {
            $(procedure.step_1).click(procedure.step_1_func);
            // $(procedure.step_2).click(procedure.step_2_func);
        }
    };
    procedure.init();
    banner_center.init();
    banner_right.init();

    $(".search_btn").on('click', function () {
        var keyword = $(".search").val();
        window.open(domain + "/" + "search.html?keyword=" + keyword + "&alitong=y") ;
    });


    $(".alitong_login").on("click",function () {
        modal_login.showmodal();
        modal_login.cover.find("div.fullinput:last").find("span img").attr("src", domain + "/verify.html?d" + new Date().getTime());
    })

    $(".alitong_regist").on("click",function () {
        modal_register.showmodal();
        modal_register.cover.find("div.fullinput:last").prev().find("span img").attr("src", domain + "/verify.html?d" + new Date().getTime());
    })


//    分页逻辑
    function filterPage(page) {
        var urlPath = getUrlPath();
        var urlPaths = urlPath.split("-");
        var url = "";
        for(var i=0; i<urlPaths.length; i++) {
            if(i == 2) {
                url += page;
            } else {
                url += urlPaths[i];
            }
            if((i+1) != urlPaths.length) {
                url += "-";
            }
        }
        self.location = domain + url+"?shareChannel=1";
    };

    $(".page_sure").click(function () {
        var pageNumber = $("#pageNum").val();
        var url4page = $("#url4page").val();
        if (url4page){
            self.location = domain + "/" + url4page +pageNumber;
        }else{

            filterPage(pageNumber);
        }
    });
    /*$(".page_prev").click(function(){
     filterPage($(this).data("pagenumber"));
     });
     $(".page_next").click(function(){
     filterPage($(this).data("pagenumber"));
     });*/
    $(".page_select").click(function(){
        filterPage($(this).data("pagenumber"));
    });

    var filter_select = {
        dom : ".filter .filter_single",
        init : function () {
            $(filter_select.dom).click(function(e){
                if(!$(this).hasClass("selected")){
                    $(this).addClass("selected").siblings().removeClass("selected");
                }else{
                    return;
                }
            })
        }
    }
    filter_select.init();
});

//排序
function filterSort(sort) {
    var urlPath = $("#urlPath").val();
    var ejsUrl = $("#urlResources").val();
    var urlPaths = urlPath.split("-");
    var url = "";
    for(var i=0; i<urlPaths.length; i++) {
        if(i == 3) {
            url += sort;
        } else {
            url += urlPaths[i];
        }
        if((i+1) != urlPaths.length) {
            url += "-";
        }
    }
    self.location=ejsUrl + "/"  + url + ".html?shareChannel=1";
}

//solr 排序
function solrSort (type) {
    var priceSort = $('#priceSort');
    var stockSort = $('#stockSort');
    if ( type == 'priceDesc') {
        if (priceSort.val() == 'DESC') {
            priceSort.val('ASC');
        } else {
            priceSort.val('DESC');
        }
        stockSort.val('normal');
    } else if (type == 'priceAsc') {
        if (priceSort.val() == 'ASC') {
            priceSort.val('DESC');
        } else {
            priceSort.val('ASC');
        }
        stockSort.val('normal');
    } else if (type == 'stockAsc') {
        if (stockSort.val() == 'ASC') {
            stockSort.val('DESC');
        } else {
            stockSort.val('ASC');
        }
        priceSort.val('normal');
    } else if (type == 'stockDesc') {
        if (stockSort.val() == 'DESC') {
            stockSort.val('ASC');
        } else {
            stockSort.val('DESC');
        }
        priceSort.val('normal');
    } else {
        priceSort.val('normal');
        stockSort.val('normal');
    }
    $('#search_form').submit();
}


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
$("#aliStoreModal").find("div.modal-footer").find("button[name='yijiandaifaClick']").click(function(){
    selectStoreShang($("#aliStoreModal").find("h4.modal-title").data("memberStoreId"));
});