define([
    'jquery',
    'common',
    'modals'
], function($, common, modals) {
    var alerts = modals.alerts;
    'use strict';
    //根据类名，建立排序映射
    var range = {
        "step_1": ".inputs",
        "step_2": ".bindshop",
        "step_3": ".already_open",
    }
    var open_process = {
        step_now: 1,
        page_change: function(page) {
            //页面切换
            var step_past = "step_" + (open_process.step_now);
            open_process.step_now = open_process.step_now + 1;
            var step_next = "step_" + (open_process.step_now);

            $(range[step_past]).fadeOut("fast");
            $(range[step_next]).fadeIn("fast");
            //进度条变化
            $(".topen_step .steps").removeClass(step_past).addClass(step_next);
        },
        oprations: {
            step_1: {
                click_protocol: function() {
                    $(range['step_1']).find('.protocol').toggleClass('selected');
                    open_process.oprations.step_1.isagree();
                },
                isagree: function() {
                    var isagree = $(range['step_1']).find('.protocol').hasClass('selected');
                    if (isagree) {
                        $(range['step_1']).find('.next').removeClass('disable');
                    } else if (!isagree) {
                        $(range['step_1']).find('.next').addClass('disable');
                    }
                },
                check: function() {
                    var data = {};
                    var znames = [];
                    $(".input>input").each(function(index, el) {
                        data[$(el).data('name')] = $(el).val();
                        var value = $(el).val();
                        var zname = $(el).data('zname');
                        if (!value) {
                            znames.push(zname);
                        }
                    })
                    if (znames.length > 0) {
                        alerts(znames + "为必填项");
                        return false;
                    }
                    return data;
                },
                send: function() {
                    var islogin = isUserLogin();
                    if (!islogin) {
                        alerts('请先登录大袜网');
                        return;
                    }
                    var isagree = !$(this).parent('.next').hasClass('disable');
                    var data = open_process.oprations.step_1.check();
                    if (data && isagree) {
                        data.sourcePlatformCode = 2;
                        data = JSON.stringify(data);
                        $.ajax({
                            async: false,
                            type: "POST",
                            url: "/product/memberstoreadd",
                            data: { "memberStore": data },
                            success: function(result) {
                                if (result.success) {
                                    open_process.memberStoreId = result.message;
                                    window.open('http://www.dawawang.com/services/taobao.html')
                                    open_process.page_change();
                                } else {
                                    alerts(result.message)
                                }
                            }
                        });
                    }
                },
                init: function() {
                    var step_1 = this;
                    $(range['step_1']).find('.protocol .iconfont').on('click', step_1.click_protocol);
                    $(range['step_1']).find('.next .next_btn').on("click", step_1.send);
                }
            },
            step_2: {
                pass: function() {
                    if (!$(this).hasClass('disable')) {
                        open_process.page_change();
                    }
                },
                init: function() {
                    $('.bindshop .next .next_btn').on('click', this.pass);
                    var ask_shang = setInterval(function() {
                        if (open_process.memberStoreId) {
                            $.ajax({
                                async: false,
                                type: "POST",
                                url: "/product/selectStoreShang",
                                data: { "memberStoreId": open_process.memberStoreId },
                                success: function(result) {
                                    if (result.success) {
                                        clearInterval(ask_shang);
                                        $('.bindshop .next .next_btn').text('下一步');
                                        $('.bindshop .next').removeClass('disable');
                                    }
                                }
                            })
                        }
                    }, 5000)
                }
            },
            init: function() {
                var opration = this;
                for (var k in opration) {
                    if (k === "init") continue;
                    opration[k].init();
                }
            }
        },
        init: function() {
            this.oprations.init();
            var step_now = "step_1";
            $(range[step_now]).fadeIn("fast");
        }
    }
    open_process.init();
});