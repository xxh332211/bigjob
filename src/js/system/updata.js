define(["jquery", "common", "nano"], function ($, common, nano) {
    //滚动条
    // $(".nano").nanoScroller();

    $(".updata_window .close").click(function(e){
        $(".updata_window").fadeOut();
    });
    $(".updata_pic").click(function(e){
        $(".updata_window").fadeIn();
    });
});