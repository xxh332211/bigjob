define(["common","jquery","modals"],function(common,$,modals){
    var alerts = modals.alerts;

    $("body").on('click',".inpaper_title .allpick i",function (event) {
        var hadselected = $(this).hasClass('selected');
        if(hadselected){
            $(".inpaper_single .selected").each(function (index,el) {
                $(el).removeClass('selected');
            });
            //
            $(".allpick .selected").each(function (index,el) {
                $(el).removeClass('selected');
            });
            $(".selectall.selected").each(function (index,el) {
                $(el).removeClass('selected');
            });
            checkedChangeAll(0);
        }else if(!hadselected){
            $(".allpick i").each(function (index,el) {
                $(el).addClass('selected');
            });
            $(".selectall").each(function (index,el) {
                $(el).addClass('selected');
            });

            $(".single .check").each(function (index,el) {
                $(el).addClass('selected');
            });
            checkedChangeAll(1);
        }
    })
    $("body").on('click',".main_panel .selectall  i",function (event) {
        var hadselected = $(this).parent().hasClass('selected');
        if(hadselected){
            $(".inpaper_single .selected").each(function (index,el) {
                $(el).removeClass('selected');
            });
            //
            $(".allpick .selected").each(function (index,el) {
                $(el).removeClass('selected');
            });
            $(".selectall.selected").each(function (index,el) {
                $(el).removeClass('selected');
            });

        }else if(!hadselected){
            $(".allpick i").each(function (index,el) {
                $(el).addClass('selected');
            });
            $(".selectall").each(function (index,el) {
                $(el).addClass('selected');
            });

            $(".single .check").each(function (index,el) {
                $(el).addClass('selected');
            });

        }
    })
    $("body").on('click',".inpaper_single .check",function (event) {
        var hadselected = $(this).hasClass('selected');
        var id = $(this).parent().data("cartid");
        if(hadselected){
            $(this).removeClass('selected');
            var checked = 0;
            checkedChange(checked,id);
        }else if(!hadselected){
            $(this).addClass('selected');
            var checked = 1;
            checkedChange(checked,id);
        }
    })
    $("body").on('click',".inpaper_single .delete",function (event) {
        var id = $(this).parent().data("cartid");
        deleteSingle(id);
    })

    //数量减少操作
    $("body").on('click',".inpaper_single .decrement",function (event) {
        decrement($(this));
    })


    $("body").on('click',".inpaper_single .increment",function (event) {
        increment($(this));
    })

    $("body").on('change',".inpaper_single .buy_num",function (event) {
        numchange($(this));
    })
    //点击结算
    $("body").on('click',".add_inpaper .goorderinfo",function (event) {
        goorderinfo();
    })
//单条选中
    function checkedChange(checked,id){
        $.ajax({
            type : "GET",
            url :  domain+"/cart/cartchecked.html",
            data : {id:id,checked:checked},
            dataType : "json",
            success : function(data) {
                if(data.success){
                    //重新加载单品信息
                    window.location.href=domain+"/cart/detail.html";
                }else {
                    alerts(data.message);
                }
            },
            error : function() {
                alerts("操作失败！");
            }
        });
    }



    //全部选中
    function checkedChangeAll(checked){
        $.ajax({
            type : "GET",
            url :  domain+"/cart/cartcheckedall.html",
            data : {checked:checked},
            dataType : "json",
            success : function(data) {
                if(data.success){
                    //重新加载单品信息
                    window.location.href=domain+"/cart/detail.html";
                }else {
                    alerts(data.message);
                }
            },
            error : function() {
                alerts("操作失败！");
            }
        });
    }
    //删除
    function deleteSingle(id){
        if(confirm("确认删除该商品吗？删除后该商品将移除。")){
            $.ajax({
                type : "GET",
                url :  domain+"/cart/deleteCartById.html",
                data : {id:id},
                dataType : "json",
                success : function(data) {
                    if(data.success){
                        window.location.href=domain+"/cart/detail.html";
                    }else {
                        alerts("删除失败");
                    }
                },
                error : function() {
                    alerts("数据加载失败！");
                }
            });
        }
    }
    /**
     * 异步加载货品信息
     */
    function getNewCartInfo(){
        $.ajax({
            type : "POST",
            url  : domain+"/cart/getcartinfo.html?rd=" + Math.random(),
            async:false,
            success : function(data) {
                $("#cart-list-ajax").empty();
                $("#cart-list-ajax").append(data);
                $("#totalCount").html($("#totalNumber").val());

                $("img").lazyload({
                    effect:'fadeIn'
                });
            }
        });
    }

    /**
     * 数量增加
     */
    function increment(obj){
        var stockNums = parseInt($(obj).parent().children("#stockNums").val());
        //数量增加操作 ,计算 小计
        var buynum = $(obj).parent().find(".buy_num");
        buynum.val(parseInt(buynum.val())+stockNums);
        checknum(buynum, stockNums);
    }
    /**
     * 数量减少操作
     */
    function decrement(obj){
        var stockNums = parseInt($(obj).parent().children("#stockNums").val());//库存
        var buynum = $(obj).parent().find(".buy_num");
        buynum.val(parseInt(buynum.val())-stockNums);
        checknum(buynum, stockNums);
    }
    function numchange(obj){
        var stockNums = parseInt($(obj).parent().children("#stockNums").val());
        //只允许10的倍数
        var val_ = Number($(obj).val());
        if(val_ % stockNums != 0){
            var mod = val_ % stockNums;
            var floorVal = Number(val_ - mod);
            var remainder_ = Number(stockNums - mod);
            //四舍五入
            if(mod >= (stockNums/2)){
                $(obj).val(val_ + remainder_);
            } else{
                $(obj).val(floorVal);
            }
        }

        //判断是否大于库存量
        var productStock = $(obj).parent().find(".productStock");
        if(productStock){
            var pstock = $(productStock).html();
            if(parseInt(val_) > parseInt(pstock)){
                $(obj).val(pstock);
            }
        }

        //更新进货单数据
        //获得进货单id
        var cartId = $(obj).siblings('.cartId').val();
        updateSingle(cartId,$(obj).val());
        //重新加载单品信息
    }
    /**
     * 输入购买数量后进行校验
     */
    function checknum(obj, stockNums){
        var val = $(obj).val();
        var datanow = $(obj).attr("data-now");
        //判断是否为正整数
        if(!isIntege1(val)){
            $(obj).val(datanow);
            return false;
        }
        //如果值为1 不能点-
        var decrement = $(obj).parent().find(".decrement");
        if (parseInt(val) == stockNums){
            $(decrement).attr('disabled',true);
        } else if(parseInt(val) < stockNums){
            $(decrement).attr('disabled',true);
            val = stockNums;
            $(obj).val(val);
            return false;
        } else{
            $(decrement).removeAttr("disabled");
        }
        //判断是否大于库存量
        var productStock = $(obj).parent().find(".productStock");
        if(productStock){
            var pstock = $(productStock).val();
            if(parseInt(val)>parseInt(pstock)){
                alerts("库存量不足");
                //val = pstock;
                $(obj).val(datanow);
                return false;
            }
        }else{
            alerts("库存量不足，不能购买");
            return false;
        }
        $(obj).attr("data-now",val);

        //更新购物车数据
        //获得购物车id
        var cartId = $(obj).siblings('.cartId').val();
        updateSingle(cartId,val);

        //重新加载单品信息
    }

    //更新进货单某某件商品的数量
    function updateSingle(id,count){
        $.ajax({
            type : "POST",
            url :  domain+"/cart/updateCartById.html",
            data : {id:id,count:count},
            dataType : "json",
            async:false,
            success : function(data) {
                window.location.href=domain+"/cart/detail.html";
            },
            error : function() {
                alerts("数据加载失败！");
            }
        });
    }

    /**
     * 判断是正整数 不包括0
     */
    function isIntege1(value){
        var re =  /^[1-9]\d*$/;
        if(isEmpty(value)){
            return false;
        }

        return re.test(value);
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

    function goorderinfo(){
        var t_id = $("#productId_T").val();
        var p_id = $("#productId_P").val();
        if(t_id == 10 && p_id == 0){
            alerts("很抱歉，进货单中存在一分钱体验支付商品，\n该商品不能参与正常订单的购买流程，请单独购买1分钱体验商品。");
            return;
        }
        var submitable = true;
        var tFlag;
        $(".inpaper_single").each(function(){
            var prolist = $(this).find(".check.selected");
            prolist.each(function(idx_,this_){
                //先做购买数校验
                var inputstock_ = Number($(this).parent().find(".buy_num").val());
                var maxStock_ = Number($(this).parent().find("input[type='hidden'][name='maxStock']").val());
                var pname_ = $(this).parent().find("div.content_title").html();
                var norm_ = $(this).parent().find(".p-props").html();
                var productId = Number($(this).parent().find("input[type='hidden'][name='productId']").val());
                var productGoodsId = Number($(this).parent().find("input[type='hidden'][name='productGoodsId']").val());
                //进行限购校验  add by lushuai 2017-02-16
                tFlag = checklimitations(productId,inputstock_,productGoodsId);
                if(inputstock_ > maxStock_){
                    submitable = false;
                    var msg = "很抱歉，商品【"+ pname_ +"("+norm_+")】目前允许您最多只能购买"+maxStock_+
                        "双，系统将会修改您下单的数量，是否继续提交？";
                    if(confirm(msg)){
                        $(this).find(".buy_num").val(maxStock_);
                        //更新进货单某某件商品的数量
                        var cartId_ = $(this).parent().find(".cartId").val();
                        $.ajax({
                            type : "POST",
                            url :  domain+"/cart/updateCartById.html",
                            data : {
                                id:cartId_,
                                count:maxStock_
                            },
                            dataType : "json",
                            async:false,
                            success : function(data) {
                                submitable = true;
                            },
                            error : function() {
                                alerts("数据加载失败！");
                            }
                        });
                    } else{
                        submitable = false;
                        return false;
                    }
                }
            });
        });
        if(submitable && tFlag){
            location.href = domain +"/order/info.html";
        }

    }

    function checklimitations(productId,num,productGoodsId){
        var tFlag = true;
        $.ajax({
            type : "GET",
            url :  domain+"/cart/checklimitations.html",
            data : {
                productId:productId,
                productGoodsId:productGoodsId,
                number:num
            },
            async:false,
            dataType : "json",
            success : function(data) {
                var msg = data.message;
                if(msg != '' && msg != null){
                    msg = msg.replace('双', '组');			//terry 20170516迎合9.9me样品销售活动
                    alerts(msg);
                    tFlag = false;
                }
            },
            error : function() {
                alerts("校验限购商品数据失败！");
                tFlag = false;
            }
        });
        return tFlag;
    }





});




