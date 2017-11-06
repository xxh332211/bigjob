function getHostName() {
    var host_name = window.location.host;
    var host_protocol = window.location.protocol;
    var url = host_protocol + "//" + host_name;
    // url = http://127.0.0.1
    // var host_port = window.location.port;
    // if (host_port != "80" && host_port != "")
    //     return url + ":" + host_port;
    // else
    return url;
}
//点击收藏商品,立即订购,加入进货单,一键清仓,判断是否已登录
function isUserLogin(){
    var isLogin = false;
    $.ajax({
        type : "POST",
        url  : domain + "/isuserlogin.html",
        async : false,
        success : function (data) {
            if(data.success){
                if(data.data){
                    isLogin = true;
                }else{
                    isLogin = false;
                }
            }else{
                isLogin = false;
            }
        },
        error : function(){
            isLogin = false;
        }
    });
    return isLogin;
}
function getUrlPath() {
    return window.location.pathname;
}




var domain = getHostName();
var domainImg = "http://images.dawawang.com";
var memberId = 0;

define(["jquery",'tpl'],function ($,template) {
    $('head').append('<meta http-equiv="X-UA-Compatible" content="IE=edge">');
    $('head').append('<meta name="renderer" content="webkit|ie-comp|ie-stand">');
    $('head').append('<meta name="baidu-site-verification" content="CJMyuRcuPq">');
    //css版本控制
    var vision = "2.0.2";
    $("link[rel=stylesheet]").each(function(index, el) {
        var csssrc = $(el).attr("href");
        csssrc = csssrc+"?"+vision;
        /*$(el).attr("href",csssrc);*/
    });
    $(function () {
        searchKeyword();
        getProductTypes();
        getProductTypesForAli();
        checkLogin();
        getNewsList();

        $(document).on('click', '.member_center', function () {
            location.href = "/member/info.html";
        });

        $(document).on('click', '.member_logout', function () {
            if(!$("#alitongIndex").val())
                location.href = "/logout.html";
            else
                location.href = "/alitongLogout.html";
        });

        $(document).on('click', '.btn_go_cart_list', function () {
            location.href = "/cart/detail.html";
        });

        $(".login_in").click(function () {
            location.href = "/login.html";
        });

        $(".register_in").click(function () {
            location.href = "/register.html";
        });

    });

    //header
    var head = function () {
        //头部广告关闭
        $('.headadv .icon_close').on('click', function(event) {
            $('.headadv').addClass('hide')
            clearInterval( headadv.inter);
        });
        var dropdown_dom = [$('.head_content_r>ul>li').eq(0),$('.head_content_r>ul>li').eq(1),$('.head_content_r>ul>li').eq(3)];
        //绑定下拉框
        $(dropdown_dom).each(function(index, el) {
            el.children('.dropdown').slideUp('fast');
            el.hover(function() {
                el.children('.dropdown').slideDown('fast');
            },function () {
                el.children('.dropdown').slideUp('fast');
            });
        });
        $(".logo_cube").hover(function() {
            $(this).children('.icon_fast_nor').addClass('icon_fast_click').removeClass('icon_fast_nor');
            $(this).children('.icon_list_nor').addClass('icon_list_click').removeClass('icon_list_nor');
        }, function() {
            $(this).children('.icon_list_click').addClass('icon_list_nor').removeClass('icon_list_click');
            $(this).children('.icon_fast_click').addClass('icon_fast_nor').removeClass('icon_fast_click');
        });

    }();

    //头部广告轮播
    var headadv = {
        back : ".headadv",
        slidebox : ".headadv .slide_box",
        slides : ".headadv .slide_box a",
        cover : ".headadv .headnav_pic",
        distance : "100",
        index: "0",
        length:"0",
        inter: "",
        set: function (){
            headadv.inter = setInterval (function(){
                headadv.addindex();
            },6000);
        },
        addindex : function () {
            headadv.index = ++headadv.index;
            headadv.index_check();
        },
        setback: function () {
            var bac = headadv.back;
            var idx = headadv.index;
            var slides = headadv.slides;
            var color = $($(slides)[idx]).attr("data-color");
            // $(bac).animate({background:color},"slow");
            $(bac).css({background:color});
        },
        index_check : function () {
            var idx = headadv.index;
            var length = headadv.length;
            var box = $(headadv.slidebox);
            if(idx == length){
                headadv.index = "0";
                box.css({top:0});
                // box.animate({ top: "0px" }, "0");
            }
            headadv.move();
            headadv.setback();
        },
        move : function () {
            var box = $(headadv.slidebox);
            var index = headadv.index;
            var topnum = -index*headadv.distance+"px";
            box.animate({ top: topnum }, "slow")
        },
        reset: function () {
            var slides = headadv.slides;
            var first = $(slides)[0];
            $(first).clone().appendTo(headadv.slidebox);
            headadv.length = $(slides).length;
            headadv.setback();
        },
        init : function () {
            headadv.reset();
            headadv.set();
        }
    }
    headadv.init();


    /**
     * 获取用户是否已登录信息
     */
    function checkLogin() {
        if ($(".login_info").length == 0) return;
        $.ajax({
            type: "POST",
            url: domain + "/getloginuser.html",
            success: function (data) {
                if (data.success) {
                    if (data.data != null && data.data.name != null) {
                        memberId = data.data.id;
                        var loginInfoHtml = "<dd><a class='user_info member_center' href='###'>" + data.data.name + "</a></dd>";
                        loginInfoHtml += "<dd><a class='user_info member_logout' href='###'>退出</a></dd>";
                        $(".login_info").hide();
                        $(".login_info").next().hide();
                        $(".login_info").after(loginInfoHtml);
                        handleIndexLogin(data.data.name);
                        previewMyCart();
                    }else{
                        $(".bigdrop").html(cartIsEmpty);
                    }
                    getBrowserInfo();
                }else {
                    $(".bigdrop").html(cartIsEmpty);
                }
            },
            error: function () {
                $(".bigdrop").html(cartIsEmpty);
            }
        });
    }


    function handleIndexLogin(userName) {
        $(".login_info_index_top").html("<p>" + userName + "</p><p>欢迎来到大袜网</p>");
        $(".login_info_index").html("<input type='button' style='margin-right:9px;' class='btn_sign member_center' value='会员中心'><input type='button' class='btn_sign member_logout' value='退出'>");
    }

    /**
     * 获取底部新闻信息
     */
    function getNewsList() {
        $.ajax({
            url: domain + '/news/footerNews.html',
            dataType: "json",
            cache: false,
            type: "get",
            success: function (data) {
                if (data.success) {
                    handleIndexBanner(data.data.newstypesList);
                    handleFooter(data.data.newstypesList);
                }
            }
        });
    }

    /**
     * 处理首页banner右侧新闻信息
     * newtype 排序第五个以后，为活动，公告咨询
     */
    function handleIndexBanner(newstypesList) {
        if ($(".banner_news_info").length == 0) return;
        $.each(newstypesList, function (i, newstype) {
            //因为轮播部分 新加了三个活动，公告和资讯，因此底部只能显示前五个，
            if (newstype.id > 5) {
                var html = "<div class='news fl";
                if (newstype.id > 6)
                    html += " hide";
                html += "'><ul class='clearfix'>";

                var i = 1;
                $.each(newstype.news, function (nidx, nw) {
                    if (i < 5) {
                        html += "<li><a href='" + domain + "/news/" + nw.id + ".html' target='_blank' title='" + nw.title + "'>" + nw.title + "</a></li>";
                    }
                    i++;
                });
                html += "</ul></div>";
                $(".banner_news_info").after(html);
                //return false;
            }
        });
        /*    var newDataStr = data.data.dataStr.split("_");
         for(var i = 0;i < newDataStr.length; i++){
         var htmlStr = newDataStr[i];
         if(i == 1){
         htmlStr = htmlStr + "款";
         }else{
         htmlStr = htmlStr + "家";
         }
         document.getElementById("data"+i).innerHTML = htmlStr;
         }*/
    }

    $(".banner_news_info div").click(function () {
        var index = $(".banner_news_info div").index(this);
        $(".banner_news_info div span").removeClass("tab_selected");
        $(this).children("span").addClass("tab_selected");
        $(".news").each(function (i) {
            if (i == index)
                $(this).show();
            else
                $(this).hide();
        });
    });

    //侧边栏
    $(".inpaper,.inpaper_list").hover(function() {
        $('.inpaper_list').stop().show('400');
    }, function() {
        $('.inpaper_list,.inpaper_list').stop().hide('400');
    });

    $(".backtotop_btn,.backtotop_btn info_box").on('click', function(event) {
        $("body").animate({scrollTop: 0,},"400", function() {
        });
        $("html").animate({scrollTop: 0,},"400", function() {
        });
    });





    /**
     * 处理首页banner右侧新闻信息
     * newtype 排序第五个以前，为底部文章信息
     */
    function handleFooter(newstypesList) {
        if ($(".foot_top_content").length == 0) return;
        $.each(newstypesList, function (i, newstype) {
            if (i < 5) {
                var html = "<dl><dt>" + newstype.name + "</dt>";
                $.each(newstype.news, function (nidx, nw) {
                    html += "<dd><a href='" + domain + "/news/" + nw.id + ".html' target='_blank' title='" + nw.title + "'>" + nw.title + "</a></dd>";
                });
                html += "</dl>";
                $(".foot_news_info").append(html);
            }
        });
    }

    //头部三级导航模板渲染
    function getProductTypes() {
        $.ajax({
            url : domain + "/productTypes.html",
            async : false,
            dataType : "json",
            success : function(data) {
                data.domain = domain;
                var headnav_tpl = template("index/category", data);
                $('.second_cat.index').html(headnav_tpl);
            },
            error : function() {
            }
        });
    }
    //头部三级导航模板渲染
    function getProductTypesForAli() {
        $.ajax({
            url : domain + "/productTypes.html",
            async : false,
            dataType : "json",
            success : function(data) {
                data.domain = domain;
                var headnav_tpl = template("index/alitong_category", data);
                $('.second_cat.al_index').html(headnav_tpl);
            },
            error : function() {
            }
        });
    }

    /**
     * 查看购物车
     */
    var cartIsEmpty = '<div class="no_cargo"><i class="icon_car_northing"></i><p>进货单为空,快去挑选货品吧!</p></div>';
    function previewMyCart() {
        $.ajax({
            url : domain + "/previewCart.html",
            async : false,
            dataType : "json",
            success : function(data) {
                if (data.success) {
                    var sellerCartList = data.data.cartListVOs;
                    if (sellerCartList != "") {
                        var totalNumber = data.data.totalNumber < 999 ?  data.data.totalNumber : "99+";
                        $(".cart_total_number").text(totalNumber);
                        var html = "<div class='has_cargo'><p>你最近添加的商品</p><ul class='clearfix'>";
                        $.each(sellerCartList, function(i, scl) {
                            $.each(scl.cartList, function (i, cl) {
                                html += "<li class='clearfix'><div class='pic fl'><img src='" + domainImg + cl.product.masterImg + "' alt='" + cl.product.name1 + "'></div>";
                                html += "<div class='product fl'><div class='product_l fl'><div class='title fl'>" + cl.product.name1 + "</div>";
                                html += "<div class='sku fl'><span>" + cl.specInfo + "</span></div>";
                                html += "<div class='type fl'> </div></div>";         //品牌名称
                                //增加价格开始
                                html += "<div class='product_r fr'><div class='price'><span>¥ " + cl.product.mallPcPrice + " 元</span><span> × " + cl.count + "</span>";
                                html += "</div><div class='del'><a href='javascript:void(0)'> </a></div></div>";        //删除
                                //添加价格结束
                                html += "</div></li>";
                            });
                        });
                        html += "</ul><div class='pannel'><span>共<b>" + data.data.totalNumber + "</b>件商品</span><!--<span>共计:<b>¥ + data.data.checkedDiscountedCartAmount +  元 </b></span>--><input class='btn_go_cart_list' type='button' value='去结算'></div></div>";
                        $(".bigdrop").append(html);
                    }
                    else {
                        $(".bigdrop").html(cartIsEmpty);
                    }
                } else {
                    $(".bigdrop").html(cartIsEmpty);
                }
            },
            error : function() {
                $(".bigdrop").html(cartIsEmpty);
            }
        });
    }

    function searchKeyword() {
        $.ajax({
            url: '/searchKeyword.html',
            dataType: "json",
            cache: false,
            type: "get",
            success: function (data) {
                if (data.success) {
                    var html = "";
                    $.each(data.data, function (i, kd) {
                        if (i == 8) return false;
                        html += "<dd><a href='" + domain + "/search.html?keyword=" + kd + "' target='_blank'>" + kd + "</a></dd>";
                    });
                    $(".quick_search").html(html);
                }
            }
        });
    }

    //记录浏览界面
    function getBrowserInfo() {
        var agent = navigator.userAgent.toLowerCase() ;
        var regStr_ie = /msie [\d.]+;/gi;
        var regStr_ff = /firefox\/[\d.]+/gi;
        var regStr_chrome = /chrome\/[\d.]+/gi;
        var regStr_saf = /safari\/[\d.]+/gi;
        var browser = "";

        if(agent.indexOf("msie") > 0) {
            browser = agent.match(regStr_ie) ;
        }

        //firefox
        else if(agent.indexOf("firefox") > 0) {
            browser = agent.match(regStr_ff) ;
        }

        //Chrome
        else if(agent.indexOf("chrome") > 0) {
            browser = agent.match(regStr_chrome);
        }

        //Safari
        else if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
            browser = agent.match(regStr_saf) ;
        }
        var verinfo = (browser+"").replace(/[^0-9.]/ig,"");


        var ref = document.referrer;
        var hrf = window.location.href;
        $(document.body).append('<img style="position:absolute;display:none" src="' + domain + '/browse_Logs.html?ref='+ref+'&hrf='+ hrf + '&memberId='+ memberId + '&browser='+ browser + '&verinfo=' + verinfo + '" />');
    }
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?50d790313a84dc94cb0679d47f0d9e0d";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();

    var _hmt1 = _hmt1 || [];
    (function() {
        var hm1 = document.createElement("script");
        hm1.src = "https://hm.baidu.com/hm.js?912e00ea123f9214eec282071cf03f78";
        var s1 = document.getElementsByTagName("script")[0];
        s1.parentNode.insertBefore(hm1, s1);
    })();

    //控制进入移动端还是h5
    var domains = $("mobiledata").data('domain');
    var msgcode;
    var intervalId;
    if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE|HTC/.test(navigator.userAgent))){
        if(window.location.href.indexOf("?mobile")<0){
            try{
                var url = location.href;
                var sp = url.split("?");
                var mobileUrl = $("mobiledata").data('mobileUrl')+ sp[1];
                var mobileUrl1 = $("mobiledata").data('mobileUrl1');
                if(/iPad|Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
                    if (sp.length > 1){
                        window.location = mobileUrl;
                    }else{
                        window.location = mobileUrl1;
                    }
                }else{
                    if (sp.length > 1){
                        window.location = mobileUrl;
                    }else{
                        window.location = mobileUrl1;
                    }
                }
            }catch(e){}
        }
    }

    var sUserAgent = navigator.userAgent;
    if (sUserAgent.indexOf('Android') > -1
        || sUserAgent.indexOf('iPhone') > -1
        || sUserAgent.indexOf('iPad') > -1
        || sUserAgent.indexOf('iPod') > -1
        || sUserAgent.indexOf('Symbian') > -1) {
        location.href = 'http://m.dawawang.com';
    }
});



