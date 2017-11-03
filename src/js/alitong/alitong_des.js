define(['jquery','common'],function($,common){
    //根据按了不同的按钮,进入不同的使用说明
        // function preLoadImg(url) { 
        //     var img = new Image(); 
        //     img.src = url; 
        //     return img
        // }
        // var img1 = preLoadImg("../../img/pic/alitong/chose2-b.png");
        // $(".panel .win_yijianpuhuo").hover(function(){
        //     console.log(img1.src);
        //     $(this).css("background","url("+img1.src+") top center no-repeat");
        // })

    var des_chose = {
        obj_o: {
            win_1 : ".panel .win_func_apply .iconfont",
            win_2 : ".panel .win_yijianpuhuo .iconfont",
            win_3 : ".panel .win_yijiandaifa .iconfont"
        },
        obj_m: {
            win_1: ".func_apply",
            win_2: ".yijianpuhuo",
            win_3: ".yijiandaifa"
        },
        func: function(objo,objm){
            for(var k in objo){
                (function(){
                    var p = k
                    $(objo[p]).on("click",function(){
                        $(".main").addClass("temphide");
                        var hide = $(objm[p]).hasClass("temphide")
                        if(hide){
                            swiper.maxindex = $(objm[p]).find(".nav span").length-1;
                            $(objm[p]).removeClass("temphide").siblings().addClass("temphide");
                            swiper.indexcheck();
                        }
                    });
                })();
            }
        },
        init: function(){
            var objo = des_chose.obj_o;
            var objm = des_chose.obj_m
            des_chose.func(objo,objm);
        }
    };
    var swiper = {
        backout: ".insidepage .backout",
        leftarr: ".insidepage .goleft",
        rightarr: ".insidepage .goright",
        goback: ".insidepage .goback",
        box: ".insidepage .box",
        nav: ".insidepage .nav span",
        imgwidth: 1111,
        index: 0,
        maxindex: 0,
        addindex: function(){
            swiper.index = swiper.index+1;
        },
        reindex: function () {
            swiper.index = swiper.index-1;
        },
        setindex: function () {
            $(this).addClass("active").siblings().removeClass("active");
            swiper.index = $(this).index();
            swiper.indexcheck();
            swiper.show();
        },
        setnav: function () {
            
           var the_span =  $(".insidepage").not(".temphide").find('.nav span')[swiper.index]
           $(the_span).addClass("active").siblings().removeClass("active");
        },
        goback_func: function () {
            $(".insidepage").addClass("temphide");
            $(".main").removeClass("temphide");
            swiper.reset();
        },
        cancel_fullscreen: function () {
            if (document.exitFullscreen) {  
                document.exitFullscreen();  
            }  
            else if (document.mozCancelFullScreen) {  
                document.mozCancelFullScreen();  
            }  
            else if (document.webkitCancelFullScreen) {  
                document.webkitCancelFullScreen();  
            }
            else if (document.msExitFullscreen) {
                  document.msExitFullscreen();
            }
        },
        backout_func:function(){
            swiper.cancel_fullscreen()
            var browserName = navigator.appName;
            var browserVer = parseInt(navigator.appVersion);
            //alert(browserName + " : "+browserVer);
    
            //document.getElementById("flashContent").innerHTML = "<br>&nbsp;<font face='Arial' color='blue' size='2'><b> You have been logged out of the Game. Please Close Your Browser Window.</b></font>";
    
            if(browserName == "Microsoft Internet Explorer"){
                var ie7 = (document.all && !window.opera && window.XMLHttpRequest) ? true : false;  
                if (ie7)
                {
                    //This method is required to close a window without any prompt for IE7 & greater versions.
                    window.open('','_parent','');
                    window.close();
                }
                else
                {
                    //This method is required to close a window without any prompt for IE6
                    this.focus();
                    self.opener = this;
                    self.close();
                }
            }else{
                //For NON-IE Browsers except Firefox which doesnt support Auto Close
                try{
                    this.focus();
                    self.opener = this;
                    self.close();
                }
                catch(e){
                    
                }
                try{
                    window.location.href="about:blank";
                    window.close();
                }
                catch(e){
                    
                }
            }
        },
        reset:function(){
            swiper.index = 0;
            swiper.maxindex = 0;
            $(swiper.box).stop().css("left","0px");
            swiper.indexcheck();
            swiper.show();
        },
        indexcheck: function () {
            var index = swiper.index;
            if(index<0){
                index = 0;
            }
            if(index>swiper.maxindex){
                index = swiper.maxindex;
            }
            swiper.index = index;
            if(swiper.index==swiper.maxindex){
                $(".goright").addClass("hide");
                $(".goback").removeClass("hide");
            }
            if(swiper.index<swiper.maxindex){
                $(".goright").removeClass("hide");
                $(".goback").addClass("hide");
            }
            swiper.setnav();
        },
        show: function () {
            var left = -swiper.imgwidth*swiper.index + "px";
            $(swiper.box).stop().animate({"left":left},1000);
        },
        init: function () {
            $(swiper.leftarr).on("click",function(){
                swiper.reindex();
                swiper.indexcheck();
                swiper.show();
            })
            $(swiper.rightarr).on("click",function(){
                swiper.addindex();
                swiper.indexcheck();
                swiper.show();
            })
            $(swiper.nav).on("click",swiper.setindex);
            $(swiper.goback).on("click",function(){
                swiper.goback_func();
            });
            $(swiper.backout).on("click",function(){
                swiper.backout_func();
            })
        }
    };

    swiper.init();
    des_chose.init();
});