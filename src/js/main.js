
	requirejs.config({
		urlArgs: 'ver=2.0.4',
		baseUrl:"/resources/frontV1/js",
		//路径
		paths: {
			"jquery": "lib/jquery.min",
			"bootstrap":"lib/bootstrap.min",
            "common": "common",
			"index":"index/index",
			"wjhs":"activity/wjhs",				//哇聚划算
			"swipper" : "lib/swiper-3.4.2.min",
			"laydate" : "lib/laydate/laydate",
			"tpl": "tpl/template",
			"activity":"activity/activity",
			"list_page":'product/list_page',
			"detail":"detail/detail",
			"alitong_activity":"alitong/alitong_activity",
			"alitong_guide":"alitong/alitong_guide",
			"alitong_operate":"alitong/alitong_operate",
			"modal":"component/modal",
			"modals":"component/modals",
			"jAlert":"lib/jquery.alerts",
			"lazyload":"lib/jquery.lazyload.min",
			"jqueryzoom":"lib/jquery.jqzoom",
			"alitong_introduce": "alitong/alitong_introduce",
			"alitong_index":"alitong/alitong_index",
			"user_center": "user/user_center",
			"alitong_index_pre": "alitong/alitong_index_pre",
			"alitong_des":"alitong/alitong_des",
			"distpicker":"component/distpicker",
			"pay":"pay/pay",
			"quick_buy":"quick_buy/quick_buy",
			"ensure":"quick_buy/ensure",
			"inpaper":"quick_buy/inpaper",
			"login":"system/login",
			"supplier":"system/supplier",
			"article": "system/article",
			"up_data": "system/updata",
			"nano": 'component/jquery.nanoscroller',
			"recruit": 'system/recruit'
		},
		//非amd依赖
		shim:{
			"jquery": {
				exports:'jquery'
			},
			"swipper": {
				deps: ['jquery'],
				exports: 'Swiper'
			},
			"nano": {
				deps: ['jquery'],
				export: "nano"
			},
			"laydate2":{
				deps:["jquery"],
				exports:"laydate"
			},
			"laydate" : {
				deps: ['jquery'],
				exports: 'laydate'
			},
			"bootstrap": {
				deps: ["jquery"],
				exports: 'bootstrap'
			},
			"lazyload": {
				deps: ["jquery"],
				exports: 'lazyload'
			},
			"jAlert":{
				deps: ["jquery"],
				exports:'jAlert'
			},
			"jqueryzoom":{
				deps: ["jquery"],
				exports:'jqueryzoom'
			}
		}
	});