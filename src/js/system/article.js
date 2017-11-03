define(["jquery", "common", "modal", "distpicker"], function ($, common, modal, distpicker) {
    $(".sidebar_nav").on("click",".single_nav .title",function () {
        var index = $(this).parent(".single_nav").index();
        $(".single_nav").eq(index).addClass("open").children(".dropdown_title").slideToggle("fast");
        $(".single_nav").eq(index).siblings().removeClass("open").children(".dropdown_title").slideUp("fast");
        $(".single_nav").each(function(idx,el){
            if($(el).hasClass("open")){
                $(el).find("i").text("-");
            }else{
                $(el).find("i").text("+");
            }
        })
    })
    $(".sidebar_nav").on("click",".single_nav .sub_title",function(){
        $(".single_nav .sub_title").removeClass("selected");
        $(this).addClass("selected");
    })
});