define(["jquery", "common"], function ($, common) {
    $('.redpack .center .close').click(function(){
        $('.redpack').fadeOut('fast');
    });
    /*setTimeout(function () {
        $('.redpack').fadeIn('fast');
    }, 4000);*/

    $(".getpack .content .close").click(function(){
        $('.getpack').fadeOut('fast');
    })
    /*setTimeout(function () {
        $('.getpack').fadeIn('fast');
    }, 4000);*/

})