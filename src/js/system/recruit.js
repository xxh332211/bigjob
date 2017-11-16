define(["jquery", "common"], function ($, common, nano) {
    $('.single_single .subtitle').click(function () {
        console.log($(this).parents('.single_single'));
        $(this).siblings('.words').slideToggle();
        $(this).siblings('.icon').toggleClass('open');
        $(this).siblings('.icon').toggleClass('close');
        $(this).parents('.single_single').siblings(".single_single").find('.words').slideUp();
        $(this).parents('.single_single').siblings(".single_single").find('.icon').removeClass('open').addClass('close');
    });

    //模块切换
    $('.title .items').click(function () {
        var index = $(this).index()-1;
        $(this).addClass('selected').siblings().removeClass('selected');
        $('.cases .single').eq(index).addClass('selected').siblings('.single').removeClass('selected');
        console.log($('.cases .single').eq(index))
    })
});