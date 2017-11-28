
function isUserLogin22() {
	var isLogin = false;
	$.ajax({
		type : "POST",
		url : domain + "/isuserlogin.html",
		async : false,
		success : function(data) {
			if (data.success) {
				if (data.data) {
					isLogin = true;
				} else {
					isLogin = false;
				}
			} else {
				isLogin = false;
			}
		},
		error : function() {
			isLogin = false;
		}
	});
	return isLogin;
}
	
//删除cookie
function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime()-10000);
    document.cookie=name+"=v; expire="+exp.toGMTString()+"; path=/";
}

//操作cookie 获取name=new_user的cookie是否存在 如果存在当前用户可能是新用户,跳转到注册页面或弹出窗口div
function getCookie(name){
    var arr,reg = new RegExp("(^|)"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
    }else{
        return null;
    }
}


function isNewUser(){
	if (isUserLogin22()  || localStorage.getItem("firstView") == "false"){
        return;
	}else{
        localStorage.setItem("firstView", "false");

		setTimeout(function () {
		 $('.redpack').fadeIn('fast');
		 }, 4000);

	}

    //弹出弹窗
   /* $(document).click(function(){
        $(".popup_cover").hide();
        $(".popup_login").hide();
        $(".popup").hide();
    });
    $(".popup").click(function(event){
        event.stopPropagation();
    });
    $(".popup_cover").show();
    $(".popup").show();*/
    //window.open("${(domainUrlUtil.EJS_URL_RESOURCES)!}/register.html");
}

//localStorage.clear();