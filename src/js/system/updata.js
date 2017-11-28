define(["jquery", "common", "nano","page"], function ($, common, nano,Page) {
    //滚动条
    // $(".nano").nanoScroller();

    $(".updata .close").click(function (e) {
        $(this).parent().fadeOut();
    });
    $(".updata_pic").click(function(e){
        $(".updata_window").fadeIn();
    });

    //可拖动,传入类名
    //dragele为拖动元素,moveele为对应的移动的元素
    function drag (dragele,moveele) {
        var status = 0;  //状态,值为0或者1,0为不可拖动,1为可拖动.
        var difX,difY,nX,nY,mX,mY;  //初始,现在,移动

        $('body').on('mousedown', dragele, function (e) {
            var e = e || window.event;
            status = 1;
            difX = e.clientX - $(moveele)[0].offsetLeft;
            difY = e.clientY - $(moveele)[0].offsetTop;
        })
        $('body').on('mouseup', function (e) {
            status = 0;
        });
       $('body').on('mousemove', function (e) {
            var e = e || window.event;
            if(status===0){
                return;
            }else if (status===1){
                nX = e.clientX;
                nY = e.clientY;
                var left = nX - difX;
                var top = nY - difY;
                left = left +'px';
                top = top +'px';
                $(moveele).css({
                    "left":left,
                    "top":top
                });
            }
        })
    }

    $('body').on('click','.updata .messge',function(){
        var text = $(this).text();
        $(".copywindow textarea").text(text);
        $(".copywindow").fadeIn();
    })
    $('.copywindow .copy_btn input').click(function(){
        $('.copywindow textarea')[0].select(); // 选择对象
        document.execCommand("Copy");
        $('.copy_notice').fadeIn();
        clearTimeout(timeoutcopy);
        var timeoutcopy = setTimeout(function(){
            $('.copy_notice').fadeOut();
        }, 1000);
    })
    function resetpage () {
        Page({
            num: 7, //页码数
            startnum: 6, //指定页码
            elem: $('#page2'), //指定的元素
            callback: function (n) { //回调函数
                console.log(n);
            }
        });
    }
    function init () {
        //拖动
        drag(".updata_window .drag",".updata_window");
        drag(".copy_drag", ".copywindow");
        resetpage();
    }
    //初始化
    init();
});