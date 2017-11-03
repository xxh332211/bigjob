define(["jquery", "common", "modal", "distpicker"], function ($, common, modal, distpicker) {
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
    notice("哈哈哈")
    protocol_interactive.init();
})