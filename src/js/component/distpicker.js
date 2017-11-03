/**
 * 省市级联js插件<br>
 * 在引用此js前需要引用JQuery库
 * @author tengfei
 * @param {} options
 */
function AreaSupport(options) {
	var this_ = this;
	if(!options.domain)
		throw new Error('请配置域名');
	var config = {
		//省默认class
		pClass : null,
		//市默认class
		cClass : null,
		//地区默认class
		aClass : null,
		compent : 'userAddress',
		domain : '',
		//默认省
		defaultProvince : null,
		//默认市
		defaultCity : null,
		//默认地区
		defaultArea : null,
		//是否需要加载到市
		cityRequired : true,
		//是否需要加载到地区
		areaRequired : true,
		//要提交的省的name属性
		provinceName : '',
		//要提交的市的name属性
		cityName : '',
		//要提交的地区的name属性
		areaName : '',
		// 省获取数据URL
		provinceURL : options.domain + '/system/getProvince.html',
		// 市获取数据URL
		cityURL : options.domain + '/system/getChildrenArea.html',
		// 地区获取数据URL
		areaURL : options.domain + '/system/getChildrenArea.html'
	};

	$.extend(config, options);
	this.cfg = config;

	this.province = {
		init : function() {
			var select_province="";
            select_province = "<div class='select_head province_' data-value='" + config.defaultProvince +"'>"
					+ config.provinceName +"</div><i class='iconfont'>&#xe631;</i><div class='select_dropdown province_'><ul>";
			$.ajax({
				url : config.provinceURL,
				async : false,
				success : function(e) {
					var data = (eval(e));
					$(data).each(function(index, ele) {
						if (config.defaultProvince
								&& (Number(ele.id) == Number(config.defaultProvince))) {
							select_province += "<li class='selected' data-value='"
									+ ele.id
									+ "'> <i class='iconfont'>&#xe630;</i><span>"
									+ ele.regionName
									+ "</span></li>";
						} else {
                            select_province +="<li data-value='"
                                + ele.id
                                + "'> <i class='iconfont'>&#xe630;</i><span>"
                                + ele.regionName
                                + "</span></li>";
						}
					});
				}
			});
			if(config.cityRequired){
				//监听省地址改变
                $("." + config.compent).children(".select.province_").on('click',".select_dropdown.province_",function () {
					if(initTimeOut){
						clearTimeout(initTimeOut);
					}
                    var initTimeOut = setTimeout(function () {
                        //doLoading('province_',config);
                        this_.city.init();
                        //清空地区选择数据
                        if($("." + config.compent +" .select_dropdown.area_").length > 0){
                            $("." + config.compent +" .select_dropdown.area_").empty();
                            $("." + config.compent +" .select_head.area_").html("选择地区");
                        }
                    },1);
                })
			}

            select_province += "</ul></div>";
			return select_province;
		}
	};
	
	this.city = {
		init : function(def) {
			var parentid= 0;
			if(!def){
                def = config.defaultCity;
			}
			parentid = $("." + config.compent +" .select_dropdown.province_ .selected").attr("data-value");
			var select_city="";
			select_city = "<div class='select_head city_' data-value='" +config.defaultCity
					+"'>" + config.cityName +"</div><i class='iconfont'>&#xe631;</i><div class='select_dropdown city_'><ul>";
			if(parentid)
			$.ajax({
				url : config.cityURL+'?p='+parentid+'&type=2',
				async : false,
				success : function(e) {
					var data = (eval(e));
					$(data).each(function(index, ele) {
						if(def && def == ele.id){

                            select_city += "<li class='selected' data-value='"
                                + ele.id
                                + "'> <i class='iconfont'>&#xe630;</i><span>"
                                + ele.regionName
                                + "</span></li>"
                                ;

						} else{
                            select_city += "<li data-value='"
                                + ele.id
                                + "'> <i class='iconfont'>&#xe630;</i><span>"
                                + ele.regionName
                                + "</span></li>";
						}
					});
				}
			});
			//清空城市选择数据
            //$("#" + config.compent).children(".select.city_").empty();
            //$("#" + config.compent).children(".select.city_").html(select_city);
			//$("'." + config.compent + " .select.city_'").empty();
			//$("'." + config.compent + " .select.city_'").html(select_city);
            select_city += "</ul></div>";
			$("." + config.compent).children(".select.city_").empty();
			$("." + config.compent).children(".select.city_").html(select_city);
			//$(".select.city_").empty();
			//$(".select.city_").html(select_city);
			
			if(config.areaRequired){

                //监听省地址改变
                $("." + config.compent).children(".select.city_").on('click',".select_dropdown.city_",function () {
                    if(initTimeOut){
                        clearTimeout(initTimeOut);
                    }
                    var initTimeOut = setTimeout(function () {
                        //doLoading('province_',config);
                        this_.area.init($(this).data("value"));
                    },1);
                })
			}

			return select_city;
		}
	};
	
	this.area = {
		init : function(def) {
			if(!def)
				def = config.defaultArea;
			var parentid = $("." + config.compent +" .select_dropdown.city_ .selected").attr("data-value");
            var select_area="";
			select_area = "<div class='select_head area_' data-value='" +config.defaultArea
                +"'>" + config.areaName +"</div><i class='iconfont'>&#xe631;</i><div class='select_dropdown area_'><ul>";
            if(parentid)
            $.ajax({
				url : config.areaURL+'?p='+parentid+'&type=3',
				async : false,
				success : function(e) {
					var data = (eval(e));
					$(data).each(function(index, ele) {
						if (def && def == ele.id) {
                            select_area += "<li class='selected' data-value='"
                                + ele.id
                                + "'> <i class='iconfont'>&#xe630;</i><span>"
                                + ele.regionName
                                + "</span></li>";

						} else {
                            select_area += "<li data-value='"
                                + ele.id
                                + "'> <i class='iconfont'>&#xe630;</i><span>"
                                + ele.regionName
                                + "</span></li>";

						}
					});


					//加载完成后去掉loading
					/*if($('#loadingImg_').length > 0){
						$('#loadingImg_').remove();
					}*/
				}
			});
            select_area += "</ul></div>";
            //清空地区选择数据
            $("." + config.compent).children(".select.area_").empty();
            $("." + config.compent).children(".select.area_").html(select_area);

            //监听地区地址改变
            $("." + config.compent).children(".select.area_").on('click',".select_dropdown.area_",function () {
                if(initTimeOut){
                    clearTimeout(initTimeOut);
                }
                var initTimeOut = setTimeout(function () {
                    //doLoading('province_',config);
                    //拼接完整地址
                    var allAddress =  $("." + config.compent +" .select_dropdown.province_ .selected span").html();
                    allAddress += $("." + config.compent +" .select_dropdown.city_ .selected span").html();
                    allAddress += $("." + config.compent +" .select_dropdown.area_ .selected span").html();
                    if(allAddress)
                        $("input[name='"+ config.compent + "']").val(allAddress);
                },1);
            })
			return select_area;
		}

	};
}

function doLoading(o,cfg){
	if(!cfg)
		return;
	var html_ = "<img src='"+cfg.domain
			+"/resources/front/img/loading.gif' style='position: " +
					"absolute;margin-left: 12px;margin-top: 5px;' id='loadingImg_'/>";
	if($('#loadingImg_').length == 0){
		$('#'+o).after(html_);
	}
}

AreaSupport.prototype.getProvince = function() {
	return this.province.init();
}

AreaSupport.prototype.getCity = function(def) {
	return this.city.init(def);
}

AreaSupport.prototype.getArea = function(def) {
	return this.area.init(def);
}
