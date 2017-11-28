define(['jquery', 'swipper', 'common', 'modal', "tpl", "alitong_operate", "lazyload", "jqueryzoom"], function ($, swipper, common, modal, template, alitong_operate, lazyload, jqueryzoom) {
    $(function () {
        $(".detail_pic img").lazyload();
        $(".big_pic").jqueryzoom({
            xzoom: 350,
            yzoom: 350,
            offset: 20
        });
    });
    //实例化登录弹出框

    var login_modal = new modal([{
            name: "title",
            type: "title",
            content: "用户登录"
        },
        {
            name: "username",
            type: "fullinput",
            holder: "请输入账号",
            icon: "&#xe61f;",
            cheack: "isphone",
            tip: "请输入注册手机号"
        },
        {
            name: "password",
            type: "fullinput",
            holder: "请输入密码",
            icon: "&#xe624;",
            sub: 'password',
            cheack: "ispassword",
            tip: "请输入4-20位密码"
        },
        {
            name: "verifyCode",
            type: "fullinput",
            holder: "请输入验证码",
            icon: "&#xe622;",
            sub: 'identify',
            cheack: "issms",
            tip: "请输入正确格式的验证码"
        },
        {
            name: "col融入i",
            type: "option",
            sub: "big,login",
            link1: domain + "/forgetpassword.html",
            link2: domain + "/register.html",
            text: '点击登录'
        }
    ]);
    //异常信息窗口
    var errorMess_modal = new modal([{
            name: "title",
            type: "title",
            content: "异常提示"
        },
        {
            name: "xx23h",
            type: "note",
            content: "数据加载失败"
        },
        {
            name: "col融入i",
            type: "option",
            sub: "sure",
            link1: '22222',
            link2: '23231',
            text: '确定'
        }
    ]);
    //添加成功窗口
    var succ = new modal([{
            name: "title",
            type: "title",
            content: "提示"
        },
        {
            name: "xx23h",
            type: "note",
            content: "添加成功"
        },
        {
            name: "col融入i",
            type: "option",
            sub: "sure",
            link1: '22222',
            link2: '23231',
            text: '确定'
        }
    ]);

    var bindclick = function (dom, callback) {
        $('body').on('click', dom, callback);
    };
    var bindchange = function (dom, callback) {
        $("body").on('keyup', dom, callback);
    };

    var add_selected = function () {
        $(this).siblings().removeClass('selected');
        if (!$(this).hasClass('selected')) {
            $(this).addClass('selected');
        }
        skuselect.match();
    };
    var add_active = function () {
        $(this).siblings().removeClass('selected')
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        }
    };
    var stoppop = function (dom) {
        $("body").on('click', dom, function (event) {
            event.stopPropagation();
        });
    };
    //已选清单中对象删除
    var delobj = function () {
        var delpid = $(this).parents(".selected_list_row").data("pid");
        var nowpid = skuselect.getpid();
        if (delpid == nowpid) {
            $("input.num").val(0);
        }
        skuselect.del(delpid);
    };
    //sku点击选择
    bindclick(".sku_option .pic:not(.disable),.sku_option .single_option", add_selected);
    bindclick(".share .download", add_active);
    bindclick(".selected_list_detail .selected_list_row .td_num .delobj", delobj);
    stoppop(".share .download span");
    bindclick(".already_selected .selected_list", add_active);
    stoppop(".already_selected .selected_list .selected_list_detail");

    //生成已选清单对象
    var skuselect = {
        selected: {},
        getpid: function () {
            var pid = "";
            $(".sku_box .selected").each(function (index, el) {
                pid += $(el).data('value');
            });
            return pid;
        },
        creat: function () {
            var rate = $(".able_sell .hands").data('hands');
            var obj = {};
            obj.num = $(".able_sell .num").val();
            obj.pair = obj.num * rate;
            $(".sku_box .selected").each(function (index, el) {
                obj[$(el).data('name')] = $(el).data('value');
                obj["text" + index] = $(el).find("span").html();
                if ($(el).data("ostock")) {
                    obj.ostock = $(el).data('ostock');
                }
                if ($(el).data('stock')) {
                    obj.stock = $(el).data('stock');
                }
            });
            return obj;
        },
        pushin: function () {
            var pid = skuselect.getpid();
            var single = skuselect.creat();
            skuselect.selected[pid] = single;
            skuselect.getlist();
        },
        del: function (pid) {
            pid = pid + "";
            var delpid = skuselect.selected[pid];
            var pics = $(".sku_row:first-child .sku_option .pic");
            var rate = $(".able_sell .hands").data('hands');
            pics.each(function(index,el){
               if(pid.indexOf($(el).data("value"))>-1){
                    var stock = $(el).data("stock");
                    var num = skuselect.selected[pid].num;
                    stock = stock + num*rate
                    $(el).data("stock",stock)
                    $(el).attr("data-stock",stock);
                    delete skuselect.selected[pid];
               }
            })
            skuselect.getlist();
        },
        match: function () {
            var pid = skuselect.getpid();
            if (skuselect.selected[pid]) {
                var num = skuselect.selected[pid].num;
                $(num_set.num).val(num);
            } else {
                $(num_set.num).val(0);
            }
        },
        getlist: function () {
            var unit = $(".able_sell .hands").data('unit');

            var data1 = {
                rate: $(".able_sell .hands").data('hands'),
                data2: []
            };
            for (var key in skuselect.selected) {
                skuselect.selected[key].pid = key;
                data1.data2.push(skuselect.selected[key]);
            };

            data1.data2.unit = unit;
            var _html = template("detail/detail_list", data1);
            $(".selected_list_detail").html(_html);
            $(".total_price span").eq(0).html(skuselect.num_count() + "<b>" + unit + "</b>");
            $(".total_price span").eq(1).html((skuselect.price_count() / 1).toFixed(2) + "<b>元</b>");
        },
        getresult: function () {
            var data1 = {
                data2: []
            };
            for (var key in skuselect.selected) {
                skuselect.selected[key].pid = key;
                data1.data2.push(skuselect.selected[key]);
            }
            return data1.data2;
        },
        num_count: function () {
            var list = [];
            var rate = $(".able_sell .hands").data('hands');
            var total_num = 0;
            for (var key in skuselect.selected) {
                list.push(skuselect.selected[key]);
            }
            $(list).each(function (index, el) {
                total_num += el.num * rate;
            });
            return total_num;
        },
        price_count: function () {
            var type = $(".databox").data("type");
            var num = skuselect.num_count();
            var total_price = 0;
            //假如是阶梯价
            if (type == "stage") {
                var p1 = $(".databox").data('price1');
                var p2 = $(".databox").data('price2');
                var p3 = $(".databox").data('price3');
                var s1 = $(".databox").data('stage1');
                var s2 = $(".databox").data('stage2');
                var s3 = $(".databox").data('stage3');
                if (num > s1 && s2 >= num) {
                    total_price = num * p1;
                }
                if (num > s2 && s3 >= num) {
                    total_price = num * p2;
                }
                if (num > s3) {
                    total_price = num * p3;
                }
                return total_price;
            }
            if (type == "normal") {
                var p1 = $(".product_special .price .td").not(".hide").find("b").html();
                total_price = p1 * num;
                return total_price;
            }
            if (type == "allbox") {
                var p1 = $(".databox").data('price1');
                var p2 = $(".databox").data('price2');
                var s1 = $(".databox").data('boxnum');
                if (num < s1 ) {
                    total_price = p2 * num;
                    return total_price;
                }
                if (num >= s1) {
                    total_price = (num - num % s1) * p1 + (num % s1 * p2)
                    /*total_price = s1 * p1 + (num - s1) * p2*/
                    return total_price;
                }
            }
        }
    };
    //数量选择
    var num_set = {
        reduce: ".set_num .reduce",
        num: '.set_num .num',
        add: ".set_num .add",
        clean: ".set_num .clean",
        add_func: function () {
            var stocktemp;
            var ostock;
            var rate = $(".able_sell .hands").data('hands');
            $(".sku_box .selected").each(function (index, el) {
                if ($(el).data('ostock')) {
                    stocktemp = $(el).data('stock');
                    ostock = $(el).data('ostock');
                }
            });
            var pid = skuselect.getpid();
            var temp = $(num_set.num).val();
            temp++;
            if (stocktemp == "0") {
                $("input.add").addClass("disable");
            } else {
                $(num_set.num).val(temp);
                $("input.add").removeClass("disable");
                $("input.reduce").removeClass("disable")
            }
            stocktemp = stocktemp - rate;
            skuselect.pushin();
            if (stocktemp < 0) {
                stocktemp = 0;
            }
            if (stocktemp > ostock) {
                stocktemp = ostock;
            }
            $(".sku_box .selected").each(function (index, el) {
                if ($(el).data('stock')) {
                    $(el).data('stock', stocktemp);
                    $(el).attr('data-stock', stocktemp);
                }
            });
            if ($(num_set.num).val() == "0") {
                skuselect.del(skuselect.getpid());
            }
        },
        reduce_func: function () {
            var stocktemp;
            var ostock;
            var rate = $(".able_sell .hands").data('hands');
            $(".sku_box .selected").each(function (index, el) {
                if ($(el).data('ostock')) {
                    stocktemp = $(el).data('stock');
                    ostock = $(el).data('ostock');
                }
            });
            if ($(num_set.num).val() > 0) {
                var temp = $(num_set.num).val();
                temp--;
                stocktemp = stocktemp / 1 + rate / 1;
                $(num_set.num).val(temp);
                $("input.add").removeClass("disable");
                $("input.reduce").removeClass("disable")
            }
            skuselect.pushin();
            if (stocktemp < 0) {
                stocktemp = 0;
            }
            if (stocktemp > ostock) {
                stocktemp = ostock;
            }
            $(".sku_box .selected").each(function (index, el) {
                if ($(el).data('ostock')) {
                    $(el).attr('data-stock', stocktemp);
                    $(el).data('stock', stocktemp);
                }
            });
            if ($(num_set.num).val() == "0") {
                skuselect.del(skuselect.getpid());
                $("input.reduce").addClass("disable");
            }

        },
        num_check: function () {
            clearTimeout(skuselect.checktimeout)
            var temp = $(num_set.num).val();
            skuselect.checktimeout = setTimeout(function () {
                temp = Math.ceil(temp);
                if (!temp) {
                    temp = 0;
                }
                $(num_set.num).val(temp);
                var pid = skuselect.getpid();
                var stock;
                var ostock;
                var pair;
                var rate = $(".able_sell .hands").data('hands');
                if (skuselect.selected[pid]) {
                    pair = skuselect.selected[pid].pair
                } else {
                    pair = "0";
                }
                $(".sku_box .selected").each(function (index, el) {
                    if ($(el).data('ostock')) {
                        stock = $(el).data('stock');
                        ostock = $(el).data('ostock');
                    }
                });
                if (temp < 0) {
                    $(num_set.num).val(0);
                    stock = stock / 1 + pair / 1;
                } else if (temp > (ostock / rate)) {

                    $(num_set.num).val(ostock / rate);
                    stock = "0";
                } else {

                    $(num_set.num).val(temp);
                    stock = stock - (temp * rate - pair);
                }
                if ($(num_set.num).val() == "0") {
                    skuselect.del(skuselect.getpid());
                } else {
                    skuselect.pushin();
                }
                if (stock < 0) {
                    stock = 0;
                }
                if (stock > stock) {
                    stock = ostock;
                }
                $(".sku_box .selected").each(function (index, el) {
                    if ($(el).data('ostock')) {
                        $(el).attr('data-stock', stock);
                        $(el).data('stock', stock);
                    }
                });
            }, 500);

        },
        clean_func: function () {
            skuselect.selected = {};
            var rate = $(".able_sell .hands").data('hands');
            var pids = skuselect.getpid();
            $(".sku_box .pic").each(function (index, el) {
                if ($(el).data('stock') >= 0) {
                    var obj = {},
                        pid = "";
                    obj[$(el).data('name')] = $(el).data('value');
                    obj["text0"] = $(el).find("span").html();
                    obj["text1"] = $("#productType").val();
                    obj.ostock = $(el).data('ostock');
                    pid = $(el).data("value") + "0";
                    obj.num = (obj.ostock) / rate;
                    obj.pair = obj.num * rate;
                    skuselect.selected[pid] = obj;
                }

            });
            var num_toset
            if (skuselect.selected[pids]) {
                num_toset = skuselect.selected[pids].num;
            } else {
                num_toset = 0;
            }
            $(num_set.num).val(num_toset);
            skuselect.getlist();
            $(".sku_box div[data-stock]").each(function (index, el) {
                $(el).data('stock', "0");
                $(el).attr('data-stock', "0");
            });
        },
        get_num: function () {
            return $(this.num).val();
        },
        init: function () {
            bindclick(this.add, this.add_func);
            bindclick(this.reduce, this.reduce_func);
            bindchange(this.num, this.num_check);
            bindclick(this.clean, this.clean_func);
        }
    };
    //左侧图片
    var left_pic = {
        big_pic: ".show_pic .big_pic",
        smallpic_pics: ".small_pics .pics ul li",
        smallpic_ul: ".small_pics .pics ul",
        left: ".small_pics .turn_left",
        right: ".small_pics .turn_right",
        index: 0,
        view_mid: 2,
        move_length: 65,
        position: 0,
        addindex: function () {
            left_pic.index = ++left_pic.index;
            left_pic.indexcheack();

            left_pic.showchange();
            left_pic.move();
        },
        reduceindex: function () {
            left_pic.index = --left_pic.index;
            left_pic.indexcheack();

            left_pic.showchange();
            left_pic.move();
        },
        setindex: function () {
            left_pic.index = $(this).index();
            left_pic.showchange();
        },
        indexcheack: function () {
            if (left_pic.index < 0) {
                left_pic.index = 0;
            }
            if (left_pic.index > $(left_pic.smallpic_pics).length - 1) {
                left_pic.index = $(left_pic.smallpic_pics).length - 1;
            }
        },
        showchange: function () {
            //添加激活类名
            $(left_pic.smallpic_pics).eq(left_pic.index).addClass('active').siblings().removeClass('active');
            var src = $(left_pic.smallpic_pics).eq(left_pic.index).find('img').attr('src');
            $(left_pic.big_pic).find('img').attr('src', src);
            $(left_pic.big_pic).find('img').attr('jqimg', src);
        },
        move: function () {
            if (left_pic.index > left_pic.view_mid + 2) {
                left_pic.position = left_pic.position - left_pic.move_length;
                left_pic.view_mid++;
            } else if (left_pic.index < left_pic.view_mid - 2) {
                left_pic.position = left_pic.position + left_pic.move_length;
                left_pic.view_mid--;
            }
            $(left_pic.smallpic_ul).css('left', left_pic.position + "px");
        },
        init: function () {
            bindclick(this.right, this.addindex);
            bindclick(this.left, this.reduceindex);
            bindclick(this.smallpic_pics, this.setindex);
        }
    };
    //右侧
    var hot_sell = {
        group: ".content_r .content_r_product .group",
        left: ".content_r .content_right_controller .goleft",
        right: ".content_r .content_right_controller .goright",
        ctl_li: ".content_r .content_right_controller ul li",
        index: 0,
        addindex: function () {
            hot_sell.index = ++hot_sell.index;
            hot_sell.indexcheack();
            hot_sell.showchange();
        },
        reduce: function () {
            hot_sell.index = --hot_sell.index;
            hot_sell.indexcheack();
            hot_sell.showchange();
        },
        indexcheack: function () {
            if (hot_sell.index < 0) {
                hot_sell.index = $(hot_sell.ctl_li).length - 1;
            }
            if (hot_sell.index > $(hot_sell.ctl_li).length - 1) {
                hot_sell.index = 0;
            }
        },
        setindex: function () {
            hot_sell.index = $(this).index();
            hot_sell.showchange();
        },
        showchange: function () {
            $(hot_sell.group).eq(hot_sell.index).addClass('showtop').siblings().removeClass('showtop');
            $(hot_sell.ctl_li).eq(hot_sell.index).addClass('active').siblings().removeClass('active');
        },
        init: function () {
            bindclick(hot_sell.ctl_li, hot_sell.setindex);
            bindclick(hot_sell.left, hot_sell.reduce);
            bindclick(hot_sell.right, hot_sell.addindex);
        }
    };
    //二次加工选择
    var process_second = {
        body: '.modal_cover_process',
        close: '.modal_cover_process .close',
        single: '.modal_cover_process .single',
        single_num: '.modal_cover_process .single .single_num',
        show_num: '.number_chosed span',
        type: '请选择',
        close_modal: function () {
            $(".modal_cover_process").removeClass('show')
        },
        show_modal: function () {
            $(".modal_cover_process").addClass('show')
        },
        select_func: function () {
            if ($(this).hasClass('selected')) {

            } else if (!$(this).hasClass('selected')) {
                $(this).addClass('selected').siblings('.single').removeClass('selected');
                process_second.type = $(this).find('.single_num').html();
                process_second.set_type();
            }
        },
        set_type: function () {
            $(process_second.show_num).html(process_second.type);
        },
        init: function () {
            $(process_second.show_num).html(process_second.type);
            bindclick('.single_option.seconedtime', process_second.show_modal);
            bindclick(process_second.close, process_second.close_modal);
            bindclick(process_second.single, process_second.select_func);
        }
    };
    process_second.init();
    left_pic.init();
    num_set.init();
    hot_sell.init();
    //渲染热卖推荐和商品推荐
    cataTopAjax();
    bindSeconed();
    //库存为0禁用商品数字更改
    if ($(".sku_option .default_dis").length) {
        disableInput();
    }
    var productId = $("#productId").val();
    var sellerId = $("#sellerId").val();
    if (!sellerId) {
        sellerId = 0;
    }

    //加载商品优惠信息
    showProductActInfo(productId, sellerId);
    showProductFlashSaleInfo(productId);


    //保存商品浏览记录
    $.ajax({
        type:'GET',
        dataType:"json",
        async:false,
        url:domain + "/product_look_log.html?memberId=" + memberId + '&productId=' + productId,
        success:function (data) {

        }
    });
    //点击商品sku图片,显示对应库存,价格
    $(".sku_option .pic").on('click', function (event) {
        //当前价格类型
        var pricestate = $("#pricestate").val();
        //当前点击sku的索引
        var index1 = $(this).index();
        if (pricestate == 1) {
            //获取所有价格的数组
            $(".price").children('div.td').each(function (index, el) {
                if (index == index1)
                    $(el).addClass("show").removeClass("hide");
                else
                    $(el).addClass("hide").removeClass("show");
            });
        }
        $(".sku_row_stock").find('div.able_sell').each(function (index, el) {
            if (index == index1)
                $(el).addClass("show").removeClass("hide");
            else
                $(el).addClass("hide").removeClass("show");
        });
        //当前对象下面的图片
        var img = $(this).children('img').attr("src");
        //更改显示图片
        $('.big_pic > img').attr("src", img);
        $('.big_pic > img').attr("jqimg", img);


        //获取当前sku的库存
        if ($(this).data("stock") >= 0) {
            //启用商品选择数量
            upInput();
        }
    });

    //点击收藏商品
    $(".collectProduct").on('click', function (event) {
        if (!isUserLogin()) {
            //弹出登录框
            login_modal.showmodal();

            $("div.fullinput:last span img").attr("src", domain + "/verify.html");
            return;
        }

        $.ajax({
            type: 'GET',
            dataType: 'json',
            async: false,
            data: {
                productId: productId
            },
            url: domain + '/member/docollectproduct.html',
            success: function (data) {
                if (data.success) {
                    $(".collectProduct").html("<i class='iconfont shoucang'>&#xe60f;</i><b>已收藏</b>")
                } else {
                    alert(data.message);
                }
            }
        });
    });

    //二次加工点击关闭
    $(".modal_cover_process .closes").on('click', function () {
        $(".modal_cover_process").removeClass("show");
    });

    //二次加工点击确定
    $(".modal_cover_process .sure").on('click', function () {
        //获取选择的加工方式id 价钱
        var pkaid = $(".modal_cover_process .selected").data("pkaid");
        var pkaprice = $(".modal_cover_process .selected").data("pkaprice");

        //渲染到二次加工按钮
        $(".seconedtime").data("value", pkaid);
        //渲染到二次加工价钱
        $(".second_process").find("b").html(pkaprice);
        //关闭弹出层
        $(".modal_cover_process").removeClass("show");
        skuselect.match();
    });

    var skuSelect_flag = false;
    //点击立即订购
    $(".buy_now").on('click', function () {
        if(skuSelect_flag) return;
        if (!isUserLogin()) {
            //弹出登录框
            login_modal.showmodal();
            $("div.fullinput:last span img").attr("src", domain + "/verify.html");
            return;
        }
        if (skuselect.getresult().length > 0) {
            skuSelect_flag = true;
            for (var int = 0; int < skuselect.getresult().length; int++) {
                var ppid = skuselect.getresult()[int].productPackageId ? skuselect.getresult()[int].productPackageId : '';
                var pgid = skuselect.getresult()[int].productGoodId ? skuselect.getresult()[int].productGoodId : '';
                var num = skuselect.getresult()[int].pair ? skuselect.getresult()[int].pair : '';

                if (!ppid) {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: domain + "/cart/addtocart.html",
                        data: {
                            productId: productId,
                            productGoodId: parseInt(pgid),
                            number: parseInt(num),
                        },
                        success: function (data) {
                            if (data.success) {

                                succ.showmodal();
                                $(".sure").on('click', function () {
                                    succ.hidemodal();
                                    //跳转结算页面
                                    window.location.href = domain + "/cart/detail.html";
                                });
                                window.location.href = domain + "/cart/detail.html";
                            } else {
                                var elseMess = new modal([{
                                        name: "title",
                                        type: "title",
                                        content: "异常提示"
                                    },
                                    {
                                        name: "xx23h",
                                        type: "note",
                                        content: data.message
                                    },
                                    {
                                        name: "col融入i",
                                        type: "option",
                                        sub: "sure",
                                        link1: '22222',
                                        link2: '23231',
                                        text: '确定'
                                    }
                                ]);
                                /*elseMess.showmodal();
                                $(".sure").on('click', function () {
                                    elseMess.hidemodal();
                                    //跳转结算页面
                                    window.location.href = domain + "/cart/detail.html";
                                });*/
                                window.location.href = domain + "/cart/detail.html";
                            }
                        },
                        error: function () {
                            errorMess_modal.showmodal();
                            $(".sure").on('click', function () {
                                errorMess_modal.hidemodal();
                            });
                        }
                    });
                } else {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: domain + "/cart/addtocart.html",
                        data: {
                            productId: productId,
                            productGoodId: parseInt(pgid),
                            number: parseInt(num),
                            productPackageId: parseInt(ppid),
                            dabiaowaFlag: 0,
                            isSelfLabel: 0
                        },
                        success: function (data) {
                            if (data.success) {
                                succ.showmodal();
                                $(".sure").on('click', function () {
                                    succ.hidemodal();
                                    //跳转结算页面
                                    window.location.href = domain + "/cart/detail.html";
                                });
                                window.location.href = domain + "/cart/detail.html";
                            } else {
                                var elseMess = new modal([{
                                        name: "title",
                                        type: "title",
                                        content: "异常提示"
                                    },
                                    {
                                        name: "xx23h",
                                        type: "note",
                                        content: data.message
                                    },
                                    {
                                        name: "col融入i",
                                        type: "option",
                                        sub: "sure",
                                        link1: '22222',
                                        link2: '23231',
                                        text: '确定'
                                    }
                                ]);
                                elseMess.showmodal();
                                $(".sure").on('click', function () {
                                    elseMess.hidemodal();
                                    //跳转结算页面
                                    window.location.href = domain + "/cart/detail.html";
                                });
                            }
                        },
                        error: function () {
                            errorMess_modal.showmodal();
                            $(".sure").on('click', function () {
                                errorMess_modal.hidemodal();
                            });
                        }
                    });
                }

            }
        } else {
            var errorMess = new modal([{
                    name: "title",
                    type: "title",
                    content: "提示"
                },
                {
                    name: "xx23h",
                    type: "note",
                    content: "请添加您要购买该商品的数量。"
                },
                {
                    name: "col融入i",
                    type: "option",
                    sub: "sure",
                    link1: '22222',
                    link2: '23231',
                    text: '确定'
                }
            ]);
            errorMess.showmodal();
            $(".sure").on('click', function () {
                errorMess.hidemodal();
            });
        }

    })


    //点击加入进货单
    $(".add_inpaper").on('click', function () {
        if(skuSelect_flag) return;
        if (!isUserLogin()) {
            //弹出登录框
            login_modal.showmodal();
            $("div.fullinput:last span img").attr("src", domain + "/verify.html");
            return;
        }
        if (skuselect.getresult().length > 0) {
            skuSelect_flag = true;
            for (var int = 0; int < skuselect.getresult().length; int++) {
                var ppid = skuselect.getresult()[int].productPackageId ? skuselect.getresult()[int].productPackageId : '';
                var pgid = skuselect.getresult()[int].productGoodId ? skuselect.getresult()[int].productGoodId : '';
                var num = skuselect.getresult()[int].pair ? skuselect.getresult()[int].pair : '';

                if (!ppid) {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: domain + "/cart/addtocart.html",
                        data: {
                            productId: productId,
                            productGoodId: parseInt(pgid),
                            number: parseInt(num),
                        },
                        success: function (data) {
                            if (data.success) {
                                succ.showmodal();
                                $(".sure").on('click', function () {
                                    succ.hidemodal();
                                    //跳转结算页面
                                    window.location.reload(true);
                                });
                                window.location.reload(true);
                            } else {
                                var elseMess = new modal([{
                                        name: "title",
                                        type: "title",
                                        content: "异常提示"
                                    },
                                    {
                                        name: "xx23h",
                                        type: "note",
                                        content: data.message
                                    },
                                    {
                                        name: "col融入i",
                                        type: "option",
                                        sub: "sure",
                                        link1: '22222',
                                        link2: '23231',
                                        text: '确定'
                                    }
                                ]);
                                elseMess.showmodal();
                                $(".sure").on('click', function () {
                                    elseMess.hidemodal();
                                    //跳转结算页面
                                    window.location.href = domain + "/cart/detail.html";
                                });

                            }
                        },
                        error: function () {
                            errorMess_modal.showmodal();
                            $(".sure").on('click', function () {
                                errorMess_modal.hidemodal();
                            });
                        }
                    });
                } else {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: domain + "/cart/addtocart.html",
                        data: {
                            productId: productId,
                            productGoodId: parseInt(pgid),
                            number: parseInt(num),
                            productPackageId: parseInt(ppid),
                            dabiaowaFlag: 0,
                            isSelfLabel: 0
                        },
                        success: function (data) {
                            if (data.success) {

                                succ.showmodal();
                                $(".sure").on('click', function () {
                                    succ.hidemodal();
                                    //跳转结算页面
                                    window.location.reload(true);
                                });
                                window.location.reload(true);
                            } else {
                                var elseMess = new modal([{
                                        name: "title",
                                        type: "title",
                                        content: "异常提示"
                                    },
                                    {
                                        name: "xx23h",
                                        type: "note",
                                        content: data.message
                                    },
                                    {
                                        name: "col融入i",
                                        type: "option",
                                        sub: "sure",
                                        link1: '22222',
                                        link2: '23231',
                                        text: '确定'
                                    }
                                ]);
                                elseMess.showmodal();
                                $(".sure").on('click', function () {
                                    elseMess.hidemodal();
                                    //跳转结算页面
                                    window.location.href = domain + "/cart/detail.html";
                                });

                            }
                        },
                        error: function () {
                            errorMess_modal.showmodal();
                            $(".sure").on('click', function () {
                                errorMess_modal.hidemodal();
                            });
                        }
                    });
                }

            }
        } else {
            var errorMess = new modal([{
                    name: "title",
                    type: "title",
                    content: "提示"
                },
                {
                    name: "xx23h",
                    type: "note",
                    content: "请添加您要购买该商品的数量。"
                },
                {
                    name: "col融入i",
                    type: "option",
                    sub: "sure",
                    link1: '22222',
                    link2: '23231',
                    text: '确定'
                }
            ]);
            errorMess.showmodal();
            $(".sure").on('click', function () {
                errorMess.hidemodal();
            });
        }
    })

    //点击验证码,更换验证码
    $("div.fullinput:last span").on('click', function (event) {
        $("div.fullinput:last span img").attr("src", domain + "/verify.html?d" + new Date().getTime());
    });

    //登录弹出框点击登录按钮

    login_modal.cover.on('click',".big", function (event) {
        if (login_modal.cansend()) {
            $(".big").attr("disabled", "disabled");
            var params = "";

            // name=1111&password=111111&verifyCode=5174
            params += "name=" + login_modal.getresult().username;
            params += "&password=" + login_modal.getresult().password;
            params += "&verifyCode=" + login_modal.getresult().verifyCode;
            //用户登录
            $.ajax({
                type: "POST",
                url: domain + "/dodialoglogin.html",
                dataType: "json",
                async: false,
                data: params,
                success: function (data) {
                    if (data.success) {
                        login_modal.hidemodal();
                        location.reload();
                    } else {
                        var mess = new modal([{
                                name: "title",
                                type: "title",
                                content: "提示信息"
                            },
                            {
                                name: "xx23h",
                                type: "note",
                                content: data.message
                            },
                            {
                                name: "col融入i",
                                type: "option",
                                sub: "sure",
                                link1: '22222',
                                link2: '23231',
                                text: '确定'
                            }
                        ]);
                        mess.showmodal();
                        //$(".sure").click(mess.hidemodal());
                        $(".sure").on('click', function () {
                            mess.hidemodal();
                        });
                        $("div.fullinput:last span img").attr("src", domain + "/verify.html?d" + new Date().getTime());
                        $(".big").removeAttr("disabled", "disabled");
                    }

                },
                error: function () {
                    var errorMess = new modal([{
                            name: "title",
                            type: "title",
                            content: "异常提示"
                        },
                        {
                            name: "xx23h",
                            type: "note",
                            content: "异常,请重试!"
                        },
                        {
                            name: "col融入i",
                            type: "option",
                            sub: "sure",
                            link1: '22222',
                            link2: '23231',
                            text: '确定'
                        }
                    ]);
                    errorMess.showmodal();
                    $(".sure").on('click', function () {
                        mess.hidemodal();
                        $(".big").removeAttr("disabled", "disabled");
                    });
                },
            });
        }

    });

    //进入页面绑定二次加工价格
    function bindSeconed() {
        var pkaid = $(".modal_cover_process .selected").data("pkaid");
        $(".seconedtime").data("value", pkaid);
    }
    //如果库存为0禁用输入框
    function disableInput() {
        $(".set_num").find("input").each(function (index, el) {
            $(el).attr("disabled", true);
        })
    }

    //库存大于0 启用输入框
    function upInput() {
        $(".set_num").find("input").each(function (index, el) {
            $(el).removeAttr("disabled");
        })
    }




    //渲染精品推荐和热卖推荐
    function cataTopAjax() {
        var productId = $("#productId").val();
        ajaxRecommendRight($(".content_r_product"), 805, 15, productId);
        ajaxRecommendLeft($(".product_content"), 804, 5, productId);
    }

    function ajaxRecommendLeft(obj, id, size, productId) {
        var cateTopHtml = "";
        var m_price = "";
        var url = $("#urlResources").val();
        var imgUrl = $("#imgResources").val();
        $.ajax({
            type: "get",
            url: url + "/recommend.html?q_recommendType=" + id + "&q_size=" + size + "&q_product_id=" + productId,
            dataType: "json",
            cache: false,
            success: function (data) {
                if (data.success) {
                    $.each(data.rows, function (i, recommend) {
                        var product = recommend.product;
                        m_price = product.mallPcPrice;
                        cateTopHtml += "<div class='product'><a href='" + url + "/product/" + product.id + ".html'>";
                        cateTopHtml += "<div class='pic'><img src='" + imgUrl + product.masterImg + "'>";
                        cateTopHtml += "<div class='notice'>" + product.name1 + "</div></div></a>";
                        cateTopHtml += "<div class='price'>" + "&yen;" + m_price + "</div></div>";
                    })
                    cateTopHtml += "</div>";
                    obj.append(cateTopHtml);
                }
            }
        });
        return cateTopHtml;
    }

    function ajaxRecommendRight(obj, id, size, productId) {
        var cateTopHtml = "";
        var m_price = "";
        var url = $("#urlResources").val();
        var imgUrl = $("#imgResources").val();
        var ul_li_html = "";
        var ul_li = $(".content_right_controller").find("ul");
        $.ajax({
            type: "get",
            url: url + "/recommend.html?q_recommendType=" + id + "&q_size=" + size + "&q_product_id=" + productId,
            dataType: "json",
            cache: false,
            success: function (data) {
                if (data.success) {
                    if (data)
                        for (var i = 0; i < data.rows.length - 2; i++) {
                            if (i == 0) {
                                cateTopHtml = "<div class='group showtop'>"
                                cateTopHtml += "<a href='" + url + "/product/" + data.rows[i].product.id + ".html'>";
                                cateTopHtml += "<div class='pic'><img src='" + imgUrl + data.rows[i].product.masterImg + "'>";
                                cateTopHtml += "<div class='price'>&yen;" + data.rows[i].product.mallPcPrice + "</div></div></a>";
                                cateTopHtml += "<a href='" + url + "/product/" + data.rows[1].product.id + ".html'>";
                                cateTopHtml += "<div class='pic'><img src='" + imgUrl + data.rows[1].product.masterImg + "'>";
                                cateTopHtml += "<div class='price'>&yen;" + data.rows[1].product.mallPcPrice + "</div></div></a>";
                                cateTopHtml += "<a href='" + url + "/product/" + data.rows[2].product.id + ".html'>";
                                cateTopHtml += "<div class='pic'><img src='" + imgUrl + data.rows[2].product.masterImg + "'>";
                                cateTopHtml += "<div class='price'>&yen;" + data.rows[2].product.mallPcPrice + "</div></div></a></div>";
                                ul_li_html = "<li class='active'></li>";
                            }
                            if (i % 3 == 0 && i != 0 && data.rows.length > 6) {
                                cateTopHtml += "<div class='group'>"
                                cateTopHtml += "<a href='" + url + "/product/" + data.rows[i].product.id + ".html'>";
                                cateTopHtml += "<div class='pic'><img src='" + imgUrl + data.rows[i].product.masterImg + "'>";
                                cateTopHtml += "<div class='price'>&yen;" + data.rows[i].product.mallPcPrice + "</div></div></a>";
                                cateTopHtml += "<a href='" + url + "/product/" + data.rows[i + 1].product.id + ".html'>";
                                cateTopHtml += "<div class='pic'><img src='" + imgUrl + data.rows[i + 1].product.masterImg + "'>";
                                cateTopHtml += "<div class='price'>&yen;" + data.rows[i + 1].product.mallPcPrice + "</div></div></a>";
                                cateTopHtml += "<a href='" + url + "/product/" + data.rows[i + 2].product.id + ".html'>";
                                cateTopHtml += "<div class='pic'><img src='" + imgUrl + data.rows[i + 2].product.masterImg + "'>";
                                cateTopHtml += "<div class='price'>&yen;" + data.rows[i + 2].product.mallPcPrice + "</div></div></a></div>";
                                ul_li_html += "<li></li>";
                            }
                        }
                    obj.append(cateTopHtml);
                    ul_li.append(ul_li_html);
                }
            }
        });
        return cateTopHtml;
    }




    //加载商品优惠信息
    // 异步加载商品促销信息
    function showProductActInfo(productId, sellerId) {
        var stockNums = $("#stockNums").val();
        $.ajax({
            type: "POST",
            url: domain + "/getproductactinfo.html",
            data: {
                productId: productId,
                sellerId: sellerId
            },
            dataType: "json",
            success: function (data) {
                if (data.success && data.data != null) {
                    var productActVO = data.data;
                    // 加载单品立减和满减
                    if (productActVO.actSingle == null && productActVO.actFull == null) {
                        // 都是空不作操作
                    } else {
                        var actHtml = '<div class="promotion"><div class="th">促销 </div>';
                        actHtml += '<div class="td_full">';
                        var actSingle = productActVO.actSingle;
                        if (actSingle != null) {
                            actHtml += '<span>';
                            if (actSingle.type == 1) {
                                actHtml += '		立减</span><span>(下单即享' + actSingle.discount + '元优惠';
                            } else if (actSingle.type == 2) {
                                //	var dis = parseInt(parseFloat(actSingle.discount)*10);
                                var dis = parseInt(parseFloat(actSingle.discount) * parseInt(stockNums));
                                actHtml += '		立减</span><span>( 下单即享' + dis + '折优惠';
                            }
                            actHtml += '	</span></div>';
                        }
                        var actFull = productActVO.actFull;
                        if (actFull != null) {
                            actHtml += '	<span >';
                            actHtml += '		满减</span><span> ';
                            // 满999.00减10.00，满4999.00减100.00，满12999.00减300.00
                            if (actFull.firstFull != null && actFull.firstFull > 0) {
                                actHtml += '满' + actFull.firstFull + '减' + actFull.firstDiscount;
                            }
                            if (actFull.secondFull != null && actFull.secondFull > 0) {
                                actHtml += '，满' + actFull.secondFull + '减' + actFull.secondDiscount;
                            }
                            if (actFull.thirdFull != null && actFull.thirdFull > 0) {
                                actHtml += '，满' + actFull.thirdFull + '减' + actFull.thirdDiscount;
                            }
                            actHtml += '	</span></div>';
                        }
                        actHtml += '</div>';
                        $(".product_special").append(actHtml);
                        //倒计时效果=========================
                        /* endTime = new Date(Date.parse(actSingle.endTime.replace(/-/g, "/")));
                         var daojishiHtml = "";
                         daojishiHtml += "<div id=\"daojishiDiv\" style=\"position: absolute;top:6px;right: 155px;color:#222;\">";
                         daojishiHtml += "<span class=\"fa fa-clock-o\"><span>&#12288;剩余<strong id=\"RemainD\"></strong>天<strong id=\"RemainH\"></strong>时<strong id=\"RemainM\"></strong>分<strong id=\"RemainS\"></strong>秒";
                         daojishiHtml += "</div>";
                         $("#promotion").append(daojishiHtml);
                         var timer_rt = window.setInterval("GetRTime()", 1000);*/
                        //倒计时效果=========================
                    }

                } else {

                }
            }
        });
    }


    // 异步加载限时抢购活动信息
    function showProductFlashSaleInfo(productId) {
        $.ajax({
            type: "POST",
            url: domain + "/getproductflashinfo.html",
            data: {
                productId: productId
            },
            dataType: "json",
            success: function (data) {
                if (data.success && data.data != null) {
                    var productActVO = data.data;
                    // 加载限时抢购信息
                    if (productActVO.actFlashSaleProduct != null) {
                        var actFlashSaleProduct = productActVO.actFlashSaleProduct;
                        var flashHtml = '<div class="promotion"><div class="th">促销：</div>';
                        flashHtml += '<div class="td_full">';
                        flashHtml += '<span>整点秒杀</span><span>';
                        var stageType = productActVO.stageType;
                        // 如果是正在进行
                        if (stageType == 2) {
                            flashHtml += actFlashSaleProduct.price + '元秒杀正在进行中&nbsp;&nbsp;';
                            flashHtml += '<a href="javascript:;" class="J-open-tb receive" onclick="gotoFlashSale()">我要秒杀</a></span>';
                        } else if (stageType == 3) {
                            // 如果是即将开始
                            flashHtml += actFlashSaleProduct.price + '元秒杀即将开始&nbsp;&nbsp;';
                            flashHtml += '<a href="javascript:;" class="J-open-tb receive" onclick="gotoFlashSale()">去看看</a></span>';
                        } else if (stageType == 1) {
                            // 如果是已经结束
                            flashHtml += actFlashSaleProduct.price + '元秒杀结束了~~~&nbsp;&nbsp;';
                            flashHtml += '<a href="javascript:;" class="J-open-tb receive" onclick="gotoFlashSale()">去看看</a></span>';
                        }
                        flashHtml += '</div></div>';
                        $(".product_special").append(flashHtml);
                    }
                }
            }
        });
    }

    // 跳转到限时抢购页面
    function gotoFlashSale() {
        window.location.href = domain + "/product/" + productId + ".html?type=1";
    }
})