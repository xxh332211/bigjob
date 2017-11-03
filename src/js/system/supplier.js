define(["jquery", "common", "modal", "distpicker"], function ($, common, modal, distpicker) {
    var select_func = {
        maindom: ".select",
        select_head: ".select .select_head",
        dropdown: ".select .select_dropdown",
        sel_single: ".select .select_dropdown ul li",
        toggle_drop: function (that) {
            $(that).siblings(select_func.dropdown).slideToggle("fast");
        },
        down_drop: function (that) {
            $(that).siblings(select_func.dropdown).slideDown('fast');
        },
        up_drop: function () {
            $(select_func.dropdown).slideUp("fast");
        },
        set_selected: function (that) {
            $(that).addClass('selected').siblings("li").removeClass('selected');
            var selec_text = $(that).find('span').html();

            var value = $(that).data("value");
            $(that).parents(".select").find(".select_head").html(selec_text);
            $(that).parents(".select").attr('data-value', value);
        },
        init: function () {
            $("body").on('click', select_func.select_head, function (event) {
                event.stopPropagation();
                var that = this;
                select_func.toggle_drop(that);
            });
            $("body").click(function (event) {
                /* Act on the event */
                select_func.up_drop();
            });
            $("body").on('click', select_func.sel_single, function (event) {
                var that = this;
                event.preventDefault();
                /* Act on the event */
                select_func.set_selected(that);
            });
        }
    };
    var radio_func = {
        radios: ".row label",
        init: function () {
            $(radio_func.radios).click(function (e) {
                if (!$(this).hasClass("selected")) {
                    $(this).addClass("selected").siblings().removeClass("selected");
                }
            });
        }
    }
    var check_box = {
        dom: 　 ".row .cheackbox",
        doms: ".row .cheackbox .box,.row .cheackbox .content",
        init: function () {
            $(check_box.doms).click(function (e) {
                if ($(check_box.dom).hasClass("checked")) {
                    $(check_box.dom).removeClass("checked");
                } else {
                    $(check_box.dom).addClass("checked");
                }

            });
        }
    }
    check_box.init();
    radio_func.init();
    select_func.init();
});

