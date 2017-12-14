define([
    'jquery',
    'common',
    'modals',
    'myslide'
], function($, common, modals, myslide) {
    'use strict';
    var alerts = modals.alerts;
    //初始化轮播图
    var taobao_slide = new myslide({
        slide_container: '.taobao_banner .slides',
        slide: '.taobao_banner .slide',
        left: '.taobao_banner .go_left',
        right: '.taobao_banner .go_right',
        navs_box: '.taobao_banner .slide_nav>ul',
        navs: '.slide_nav>ul>li',
        time: 3000,
        animate: true,
        interval: true,
        autonav: true
    });
    var choice = new myslide({
        slide_container: '.taobao_choice>.products>.main_box',
        slide: '.taobao_choice>.products>.main_box>.box',
        left: '',
        right: '',
        navs_box: '.taobao_choice>.choice_title>ul',
        navs: '.taobao_choice>.choice_title>ul>li',
        time: 3000,
        animate: false,
        interval: false,
        autonav: false
    })
    var star_product = new myslide({
        slide_container: '.taobao_stars .star_product .slides',
        slide: '.taobao_stars .star_product .slides .slide',
        left: '.taobao_stars .control .left',
        right: '.taobao_stars .control .right',
        navs_box: '',
        navs: '',
        time: 3000,
        animate: false,
        interval: false,
        autonav: false
    })
    var maiproduct_1 = new myslide({
        slide_container: '.taobao_mainproduct.pro_1 .slides',
        slide: '.taobao_mainproduct.pro_1 .slides .slide',
        left: '.taobao_mainproduct.pro_1 .control .left',
        right: '.taobao_mainproduct.pro_1 .control .right',
        navs_box: '',
        navs: '',
        time: 3000,
        animate: false,
        interval: false,
        autonav: false
    })
    var maiproduct_2 = new myslide({
        slide_container: '.taobao_mainproduct.pro_2 .slides',
        slide: '.taobao_mainproduct.pro_2 .slides .slide',
        left: '.taobao_mainproduct.pro_2 .control .left',
        right: '.taobao_mainproduct.pro_2 .control .right',
        navs_box: '',
        navs: '',
        time: 3000,
        animate: false,
        interval: false,
        autonav: false
    })
    maiproduct_1.init();
    maiproduct_2.init();
    star_product.init();
    choice.init();
    taobao_slide.init();
});