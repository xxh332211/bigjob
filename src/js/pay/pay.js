define(["common","jquery","modals"],function(common,$,modals){
    var alerts = modals.alerts;
    $(".pay_content .online_pay .row.special").on("click",function(){
        var _this = $(this);
        $(".pay_content .online_pay .row.special").each(function (idnex, el) {
            $(this).removeClass("selected");
        });
         _this.addClass("selected");

    });
    $(".pay_content .online_pay .row.balance i").on("click",function(){
        var _this = $(this);
        var amount = _this.parent().find(".price.fr span").html();
        var realAmount = $(".pay_state .price span").html();
        if(_this.parent().hasClass("selected")){
            _this.parent().removeClass("selected");
            $(".pay_content .online_pay .row.special .price span").each(function (idnex, el) {
                $(this).html(realAmount);
            });
        }else{
            _this.parent().addClass("selected");
            $(".pay_content .online_pay .row.special .price span").each(function (idnex, el) {
                $(this).html(realAmount - amount);
            });
        }
    });

    $(".pay_content .online_pay #PayButton").on('click',function () {
        if($(".pay_content .online_pay .selected").data("pattern") == 'balance'){
            var balancePwd = $("#balancePassword").val();
            if(!balancePwd){
                alerts("密码不能为空");
                $("#balancePassword").focus();
                return false;
            }
            //验证支付密码
            var checkpwd = checkBalancePwd(balancePwd);
            if(!checkpwd){
                return false;
            }
            var backgroung = $("#balancePassword");
            $("#payForm").append(backgroung);

            var selectOrderBalance = $("<input type='hidden' name='selectOrderBalance'/>")
            selectOrderBalance.attr('value',"on");
            $("#payForm").append(selectOrderBalance);
            var optionsRadios = $("<input type='hidden' name='optionsRadios'/>")
            optionsRadios.attr('value',"alipay");
            $("#payForm").append(optionsRadios);
        }else{
            var optionsRadios = $("<input type='hidden' name='optionsRadios'/>")
            optionsRadios.attr('value',$(".pay_content .online_pay .selected").data("pattern"));
            $("#payForm").append(optionsRadios);
        }

        $("#payForm").attr('action',domain +'/payindex.html').attr('method','GET').submit();

    });



    //验证支付密码
    function checkBalancePwd(balancePwd){
        var correct = false;
        $.ajax({
            type : "GET",
            url :  domain+"/order/checkbalancepwd.html",
            data : {balancePwd:balancePwd},
            dataType : "json",
            async:false,
            success : function(data) {
                if(data.success){
                    correct = data.data.correct;
                    var errcount = parseInt(data.data.pwdErrCount);
                    if(errcount>=6){
                        alerts("支付密码输错超过6次,请用其他方式支付");
                        $(".toggle-title").click();
                        return false;
                    }
                    if(!correct){
                        alerts("支付密码不正确，您最多还可以输入"+(6-errcount)+"次");
                        return false;
                    }
                }else {
                    alerts(data.message);
                    return false;
                }
            },
            error : function() {
                alerts("验证密码失败！");
            }
        });
        return correct;
    }

$(function () {
    setTimeout(ajaxstatus, 1000);
});



    var orderNo = $(".order_num span").html();
    var url = domain;
    function ajaxstatus() {
        $.ajax({
            url: url+"/wx/returnUrl.html",
            type: "GET",
            dataType:"json",
            async : false,
            cache:false,
            data: {orderNo:orderNo},
            success: function (data, textStatus) {
                if (data.data) {
                    window.location.href = url+"/wx/returnUrlSuccess.html?orderNo="+orderNo;
                }
                else
                    setTimeout(ajaxstatus, 3000);
            }
        });
    }



});

