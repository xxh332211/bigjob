define(['jquery',"modals"], function ($,modals) {
    var alerts = modals.alerts;
    'use strict';
    var banner_center = {
        slide: ".special_ser .content_left .pic_cover .slide",
        single: ".special_ser .content_left .pic_cover .slide .single",
        tip: ".special_ser .content_right .indexs .index",
        index: 0,
        pic_width: 600,
        move_func: function () {
            var index = banner_center.index;
            var width = banner_center.pic_width;
            $(banner_center.slide)
                .stop()
                .animate({
                    left: -index * width + "px"
                }, "normal");
        },

        tip_hover_in: function () {
            clearInterval(banner_center.timer1);
            banner_center.index = $(this).index();
            $(this).addClass("active").siblings(".index").removeClass('active');
            banner_center.move_func();
        },
        init: function () {
            $(banner_center.tip).click(banner_center.tip_hover_in);
        }
    };

    var appoint = {
        startdom: ".open_appointment",
        showdom: ".appointment",
        close:".appointment .appointment_content .close",
        showdom_func:function () {
            $(appoint.startdom).animate({"left":"-220px"},"slow",function(){
                $(appoint.showdom).animate({"left":"0"},"slow");
            });
        },
        hidedom_func: function () {
            $(appoint.showdom).animate({"left":"-100%"},"slow",function(){
                $(appoint.startdom).animate({"left":"0"},"slow");
            });
        },
        init: function() {
            $(appoint.startdom).click(function(){
                appoint.showdom_func();
            })
            $(appoint.close).click(function(){
                appoint.hidedom_func();
            })
        }
    }

    var side_right = {
        box_dom: ".appoint_win",
        holder:".side_right .holder",
        close: ".appoint_win .close",
        init: function () {
            $(side_right.holder).click(function(){
                $(side_right.holder).animate({"right":"-23px"},"slow",function(){
                    $(side_right.box_dom).animate({"right":"20px"},"slow")
                });
            })

            $(side_right.close).click(function(){
                $(side_right.box_dom).animate({"right":"-163px"},"slow",function(){
                    $(side_right.holder).animate({"right":"3px"},"slow");
                })
            })
        }
    }
    side_right.init();
    appoint.init();
    banner_center.init();

    var mPattern = /^1[34578]\d{9}$/;
    //点击预约
    $(".sign_btn").on('click',function () {

        var phoneNum = $(this).siblings(".phoneinput").val();
        var domain = $("input[name=domain]").val();
        console.log(domain);
        if(mPattern.test(phoneNum)){
            //保存预约信息
            $.ajax({
                type:"POST",
                dataType:"json",
                url:domain + "/precontract/create.html",
                data:{phoneNum:phoneNum},
                success:function (data) {
                    if(data.success){
                        alerts("预约成功","阿里通客服会很快与您联系,请保持手机畅通!")
                    }else{
                        alerts("异常信息",data.message);
                    }
                },
                error:function () {
                    alerts("异常","请联系客服或重试");
                }
            })
        }else{
            alerts("号码有误","请输入正确的手机号");
            return;
        }
    })
});

