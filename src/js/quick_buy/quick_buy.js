define(["common","jquery","modals"],function(common,$,modals){
    var alerts = modals.alerts;
    //选择框选中状态
    $("body").on('click',".product .select_p,.product .select_b",function (event) {
        var hadselected = $(this).parent().hasClass('selected');
        if(hadselected){
            $(this).parent().removeClass('selected');
        }else if(!hadselected){
            $(this).parent().addClass('selected');
        }
    });
    //二次加工选择
    $("body").on('click',".second .select_second",function (event) {
        var hadselected = $(this).parent().hasClass('selected');
        if(hadselected){
            $(this).parent().removeClass('selected');
            //取消是否自供标的选中 隐藏是否自供商标
            $(this).parent().parent().find(".selfbrand").removeClass('selected').addClass("hide");
            //隐藏弹出层
            $(this).parent().find("span").html("选择加工方式");
        }else if(!hadselected){
            $(this).parent().addClass('selected');

            $(this).parent().parent().find(".selfbrand").removeClass('hide');
            //打开弹出层
            $(this).parent().parent().find(".modal_cover_process.hide").addClass('show');
            //渲染二次加工方式  获取选中的加工方式渲染到选择加工方式
            var singleNum = $(this).parent().parent().find(".modal_cover_process .selected .single_num").html();
            singleNum = "已选【" + singleNum + "】";
            $(this).parent().find("span").html(singleNum);
        }
    });
    //全选选中
    $("body").on('click',".selectall i",function (event) {
        var hadselected = $(this).parent().hasClass('selected');
        if(hadselected){
            $(".selectall.selected").each(function (index,el) {
                $(el).removeClass('selected');
            });
            $(".product.selected").each(function (index,el) {
                $(el).removeClass('selected');
            });

        }else if(!hadselected){
            $(".selectall").each(function (index,el) {
                $(el).addClass('selected');
            });
            $(".product").each(function (index,el) {
                $(el).addClass('selected');
            });
        }
    });

    var bindclick = function (dom, callback) {
        $('body').on('click', dom, callback);
    };

    //二次加工选择
    var process_second = {
        body: '.modal_cover_process',
        close: '.modal_cover_process .closes',
        sure: '.modal_cover_process .option .sure',
        single: '.modal_cover_process .single',
        single_num: '.modal_cover_process .single .single_num',
        show_num: '.number_chosed span',
        type: '请选择',
        close_modal: function () {
            $(this).parent().parent().removeClass('show')
            var singleNum = $(this).parent().parent().find(".selected .single_num").html();
            singleNum = "已选【" + singleNum + "】";
            $(this).parent().parent().parent().find(".chose span").html(singleNum);
        },
        sure_modal: function () {
            $(this).parent().parent().parent().parent().removeClass('show')
            var singleNum = $(this).parent().parent().parent().parent().find(".selected .single_num").html();
            singleNum = "已选【" + singleNum + "】";
            $(this).parent().parent().parent().parent().parent().find(".chose span").html(singleNum);
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
            bindclick(process_second.close, process_second.close_modal);
            bindclick(process_second.sure, process_second.sure_modal);
            bindclick(process_second.single, process_second.select_func);
        }
    };
    process_second.init();


    //点击搜索
    $("body").on('click',"form[name='search_form'] .search i",function (event) {
        $("form[name='search_form']").submit();
    })
    //增加数量
    $("body").on('click',".product .control .buy_addNum",function (event) {
        addNum($(this));
    })
    //减少数量
    $("body").on('click',".product .control .buy_substract",function (event) {
        reduceNum($(this));
    })

    //数值更改
    $("body").on('change',".product .control #buy-num",function (event) {
        checknum($(this));
    })

//减少数量
    function reduceNum(obj){
        var t = $(obj).parent().find("#buy-num");//数值输入框
        var countElement =$(obj).parent().find("input[name='number']");//找到number元素
        var productStock = $(obj).parent().data("productstock");//商品库存值
        var flag = $(obj).parent().data("unit");                //售卖单位每手多少双
        productStock = parseInt(productStock)/parseInt(flag);
        var boolFlag = (parseInt($(t).val())-1) >= 1;// 当前值大于2才可以更改显示值
        if(typeof($(this).attr("disabled"))=="undefined" && boolFlag){
            $(t).val(parseInt($(t).val())-1);
            $(countElement).val(parseInt($(t).val())*parseInt(flag));//设置要传递到后台数量的值
        }
    }

//添加数量
    function addNum(obj){
        var t = $(obj).parent().find("#buy-num");//数值输入框
        var countElement = $(obj).parent().find("input[name='number']");//找到number元素
        var productStock = $(obj).parent().data("productstock");//商品库存值
        var flag = $(obj).parent().data("unit");
        productStock = parseInt(productStock)/parseInt(flag);
        var boolFlag = (parseInt($(t).val())+1) <= parseInt(productStock);//不可以比库存数量多，不然货从哪里来
        if(typeof($(this).attr("disabled"))=="undefined" && boolFlag){
            $(t).val(parseInt($(t).val())+1)
            $(countElement).val(parseInt($(t).val())*parseInt(flag));//设置要传递到后台数量的值
        }
    }
    //Math.ceil() 向上取整
    //Math.floor() 向下取整
    //Math.round() 四舍五入
    function checknum(obj){
        checkNumForInput(obj)
        var val = $(obj).val();
        var productStock =  $(obj).parent().data("productstock");//商品库存值
        var countElement = $(obj).parent().find("input[name='number']");//找到number元素
        var flag =  $(obj).parent().data("unit");
        productStock = parseInt(productStock)/parseInt(flag);
        var boolMin = parseInt(val) < 1 ;//如果购买数量小于1，则强制购买数量为1
        var boolMax = parseInt(val) > parseInt(productStock);//如果购买数量大于库存，则强制购买数量为库存
        if(boolMin){
            $(obj).val(1);
            $(countElement).val(parseInt($(obj).val())*parseInt(flag));//设置要传递到后台数量的值
        }else if(boolMax){
            $(obj).val(productStock);
            $(countElement).val(parseInt($(obj).val())*parseInt(flag));//设置要传递到后台数量的值
        }else{
            $(countElement).val(parseInt($(obj).val())*parseInt(flag));//设置要传递到后台数量的值
        }
    }

    //点击添加按钮
    $("body").on('click',".product .add",function (event) {
        //校验是否勾选商品
        var hadSelected = $(this).parent().hasClass("selected");
        if(hadSelected){
            addToCart($(this).parent().parent());
            alerts("温馨提示","该商品已成功加入进货单!可在进货单中查看!",function () {
                window.location.href=domain+"/eosearch.html";
            });

        }else if(!hadSelected){
            alerts("请选择要添加的商品")
        }
    });

    //点击加入进货单
    $("body").on('click',".add_inpaper .sumbitAllCheckbox",function (event) {
        //获取已勾选的商品
        if($(".products .product.selected").length == 0){
            alerts("请添加您要购买的商品。");
            return ;
        }
        $(".products .product.selected").each(function (index, element) {
            addToCart($(element))
        });
        alerts("温馨提示","该商品已成功加入进货单!可在进货单中查看!",function () {
            window.location.href=domain+"/eosearch.html";
        });

    })

//输入格式控制只能输入挣正整数
    function checkNumForInput(obj){
        if(/^\d+$/.test(obj[0].value)){
            obj[0].value = obj[0].value;
        }else{
            obj[0].value = obj[0].value.substring(0,obj[0].value.length-1);
        }
        obj[0].value=/^\d+$/.test(obj[0].value) ? obj[0].value :'1';
    }


//添加到购物车逻辑


    function addToCart(event){
        //数量 商品id 商品skuid 供应商id
        var params = $(event).find(".control input[name='number']").closest("form[name='cartForm']").serialize();
        if($(event).find(".second .selected").length > 1){
            $(event).find(".second .selected").each(function (index,obj) {
                var option = $(obj).data("name");
                var value = $(obj).data("value");
                params  = params + "&"+ option + "=" + value;
            });
        }
        $.ajax({
            type : "POST",
            url :  domain+"/cart/addtocart.html",
            data : params,
            dataType : "json",
            sync: false,
            success : function(data) {
                if(data.success){
                    //jAlert("添加成功xxx！");
                }else{
                    alerts(data.message);
                }
            },
            error : function() {
                alerts("请稍后再试！");
            }
        });

    }


});




