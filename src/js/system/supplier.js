define(["jquery", "common", "modals", "distpicker"], function ($, common, modals, distpicker) {
    var alerts = modals.alerts;
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



    //进入供应商完善信息页面 渲染地区数据用户地址
    if ($(".supplier_address").length) {
        //加载省市区
        var opt = {
            //默认省
            defaultProvince: $("#provinceId").val(),
            //默认市
            defaultCity: $("#cityId").val(),
            //默认地区
            defaultArea: $("#areaId").val(),
            areaRequired: false,
            domain: domain,
            provinceName: '选择省',
            cityName: '选择市',
            areaName: '选择地区',
            compent: "supplier_address"
        };
        //实例此对象，参数可选
        var area = new AreaSupport(opt);
        //初始化对象并组装DOM添加至给定的选择器对象。注意，此对象的init返回的是JQuery对象
        $('.supplier_address .select.province_').html(area.getProvince());
        //如果希望进入页面加载到市，则可以手动执行此初始化方法
        //area.getCity().appendTo();
        $('.supplier_address .select.city_').html(area.getCity());
        //如果希望进入页面加载到地区，则可以手动执行此初始化方法
        //area.getArea().appendTo();
        //$('.userAddress .select.area_').html(area.getArea());
    }

    //监听用户名输入
    $("body").on('change',".form_list #company",function () {
        if(!$(this).val()){
            alerts("请填写公司名称");
            return;
        }else{
            valiCompany($(this).val())
        }
    });
    //监听用户名输入
    $("body").on('change',".form_list input[name='personPhone']",function () {
        if(!$(this).val()){
            alerts("请填写联系人电话");
            return;
        }else{
            if(!isphone($(this).val())){
                alerts("请输入正确的手机号码");
                return;
            }
        }
    });
    //邮箱输入验证
    $("body").on('change',".form_list input[name='email']",function () {
        if(!$(this).val()){
            alerts("请填写邮箱地址");
            return;
        }else{
            if(!isemail($(this).val())){
                alerts("请输入正确的邮箱地址");
                return;
            }
        }
    });

    function valiCompany(value){
        var flag = false;
        $.post({
            url : domain + "/store/validate.html",
            type: "POST",
            dataType:"json",
            data:{
                "val" : value,
                "type":1
            },
            success :function (data) {
                if(!data){
                    alerts("公司名称已存在");
                }
            }
        })
    }



    $("body").on('change',".form_list input[type='file']",function () {
        $(this).parent().parent().find("input[type='text']").val(this.files[0].name);
    });

    $("body").on('click',".supplier_address .select.city_",function () {
        $("#companyCity").val($(this).data("value"));
        var province = $(this).parent().find(".select.province_").data("value");
        $("#companyProvince").val(province);
    })
    $("body").on('click',".row .saveRegister",function () {
        var canRegister = true;
        if(!$("input[name='company']").val()){
            alerts("公司名称必填");
            canRegister = false;
            return;
        }else{
            valiCompany($("input[name='company']").val());
        }
        if(!$("input[name='telephone']").val()){
            alerts("公司电话必填");
            canRegister = false;
            return;
        }
        if(!$("input[name='legalPerson']").val()){
            alerts("法定代表人必填");
            canRegister = false;
            return;
        }
        if(!$("input[name='personPhone']").val()){
            alerts("联系人电话必填");
            canRegister = false;
            return;
        }else{
            if(!isphone($("input[name='personPhone']").val())){
                alerts("请输入正确的手机号码");
                canRegister = false;
                return;
            }
        }
        if(!$("input[name='email']").val()){
            alerts("邮箱地址必填");
            canRegister = false;
            return;
        }else{
            if(!isemail($("input[name='email']").val())){
                alerts("请输入正确的邮箱地址");
                canRegister = false;
                return;
            }
        }
        if(!$("input[name='engineSum']").val()){
            alerts("拥有机型及台数必填");
            canRegister = false;
            return;
        }
        if(!$("input[name='madePerDay']").val()){
            alerts("日产量必填");
            canRegister = false;
            return;
        }
        if(!$("input[name='employeeSum']").val()){
            alerts("员工数必填");
            canRegister = false;
            return;
        }
        if(!$("input[name='ownCate']").val()){
            alerts("现有品类必填");
            canRegister = false;
            return;
        }
        if(!$("input[name='wellArea']").val()){
            alerts("擅长领域必填");
            canRegister = false;
            return;
        }
        if(!$("input[name='up_taxLicense']").val()){
            alerts("请上传税务登记证");
            canRegister = false;
            return;
        }
        if(!$("input[name='up_organization']").val()){
            alerts("请上传组织机构代码证");
            canRegister = false;
            return;
        }
        if(!$("input[name='up_bussinessLicenseImage']").val()){
            alerts("请上传营业执照");
            canRegister = false;
            return;
        }
        if(!$("input[name='companyProvince']").val() || !$("input[name='companyCity']").val()){
            alerts("公司所在地必填");
            canRegister = false;
            return;
        }
        if(!$("textarea[name='companyAdd']").val()){
            alerts("公司详细地址必填")
            canRegister = false;
            return;
        }
        if(canRegister){
            var params = $("#form_company_info").serialize();
            $('#form_company_info').submit();
        }
    })

});


function isemail(value) {
    if (value.search(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) == -1) {
        return false;
    } else {
        return true;
    }
};

function isphone(value) {
    if (value.search(/^(\+\d{2,3})?\d{11}$/) == -1) {
        return false;
    } else {
        return true;
    }
};