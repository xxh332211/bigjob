define([
    'jquery'
], function(require, factory) {
    'use strict';
    /*
    css设置：大滑块绝对定位，父盒子相对定位，overflow设置为hidden

    slide_container: 大滑块类名,
    slide: 大滑块里每个div的类名,
    left: 向左按钮类名,
    right: 向右按钮类名,
    navs: index选择器类名
    navs_box: index选择器类外层
    time：间隔时间,
    animate:是否动画，
    interval：是否定时器
    */
    function myslide(obj) {
        this.slides = {
            dom: obj,
            index: 1,
            max: 0,
            distance: 0,
            interval: null,
            time: 1000
        }
    }

    myslide.prototype.addindex = function() {
        var slides = this.slides
        if (!slides.dom.right) return;
        var _this = this;
        $(slides.dom.right).on('click', function() {
            slides.index = slides.index + 1;
            _this.checkindex(slides);
            if (slides.dom.interval) {
                _this.setinter()
            }
        })
    }
    myslide.prototype.reduceindex = function() {
        var slides = this.slides
        if (!slides.dom.left) return;
        var _this = this;
        $(slides.dom.left).on('click', function() {
            slides.index = slides.index - 1;
            _this.checkindex(slides);
            if (slides.dom.interval) {
                _this.setinter()
            }
        })

    }
    myslide.prototype.selecteindex = function() {
        var slides = this.slides;
        if (!slides.dom.navs) return;
        var _this = this;
        $(slides.dom.navs).on('click', function() {
            $(this).addClass('active').siblings().removeClass('active');
            var idx = $(this).index() + 1;
            slides.index = idx;
            var position = -slides.index * slides.distance
            $(slides.dom.slide_container).css({ 'left': position })
            if (slides.dom.interval) {
                _this.setinter()
            }
        });
    }
    myslide.prototype.checkindex = function(slides) {
        var dom = slides.dom;
        var distance = slides.distance;
        var idx = slides.index;
        if (idx < 0) {
            slides.index = 0;
        } else if (idx > slides.max - 1) {
            slides.index = slides.max - 1;
        }
        var position = -slides.index * distance + "px";
        if (slides.dom.animate) {
            $(dom.slide_container).stop().animate({ 'left': position }, 'fast', function() {
                if (idx <= 0) {
                    slides.index = slides.max - 2;
                } else if (idx >= slides.max - 1) {
                    slides.index = 1
                }
                var position = -slides.index * distance + "px";
                $(dom.slide_container).css({ "left": position });
                $(dom.navs).eq(slides.index - 1).addClass("active").siblings().removeClass("active");
            });
        } else {
            $(dom.slide_container).css({ 'left': position });
            if (idx <= 0) {
                slides.index = slides.max - 2;
            } else if (idx >= slides.max - 1) {
                slides.index = 1
            }
            var position = -slides.index * distance + "px";
            $(dom.slide_container).css({ "left": position });
            $(dom.navs).eq(slides.index - 1).addClass("active").siblings().removeClass("active");
        }


    }
    myslide.prototype.setinter = function() {
        var _this = this;
        var slides = _this.slides;
        clearInterval(slides.interval)
        slides.interval = setInterval(function() {
            slides.index = slides.index + 1;
            _this.checkindex(slides);
        }, slides.dom.time);

    }
    myslide.prototype.init = function() {
        var _this = this;
        var slides = this.slides;
        var dom = slides.dom;
        //复制处理节点
        var length = $(dom.slide).length;
        var head = $(dom.slide).eq(0)
        var last = $(dom.slide).eq(length - 1);
        var li_string = "";
        head.clone().appendTo(dom.slide_container);
        last.clone().prependTo(dom.slide_container);
        if (slides.dom.autonav) {
            for (var i = 1; i <= length; i++) {
                li_string = li_string + "<li></li>";
            }
            $(slides.dom.navs_box).html(li_string)
        }
        $(slides.dom.navs).eq(0).addClass('active').siblings().removeClass('active');
        //初始化数据
        slides.max = $(dom.slide).length;
        slides.index = 1;
        slides.distance = $(dom.slide).eq(0).width();
        //css位置复位
        $(slides.dom.slide_container).css({ "left": -slides.distance + "px" })
            //事件绑定
        this.addindex();
        this.reduceindex();
        this.selecteindex();
        if (slides.dom.interval) {
            this.setinter()
        }
    }
    return myslide;
});