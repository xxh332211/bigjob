define(['jquery','common','laydate','modal'],function ($,common,laydate,modal) {
	$("body").on('click', '.tab_single', function(event) {
		if(!$(this).hasClass('active')) {
			$(this).addClass('active').siblings('.tab_single').removeClass('active')
		}
	});
	var apply_open = new modal([
			{name:"水电费地方",type:"title",content:"申请开通"},
			// {name:"xx23h",type:"alert",content: "ssss"},
			// {name:"xx23h",type:"note",content:data.words},
			{name:"link",text:"店铺链接",type: "input",holder:"请输入店铺链接",cheack:"isphone",tip:"电话号"},
			{name:"name",text:"公司名称",type: "input",holder:"请输入公司全称",cheack:"isphone",tip:"电话号"},
			{name:"pep",text:"联系人",type: "input",holder:"请输入联系人名称"},
			{name:"tel",text:"电话",type: "input",holder:"请输入联系人电话"},
			{name:"wangwang",text:"旺旺",type: "input",holder:"请输入旺旺号"},
			{name:"co儿li",type: "option",sub:"cancel,sure",text:'购买'},
			// {name:"col融入i",type: "option",sub:"big"},
		]);

	var appointment = new modal([
			{name:"水电费地方",type:"title",content:"预约培训"},
			{name:'name',type:'input',text:"姓名",holder:"请输入姓名"},
			{name:'tel',type:'input',text:"联系电话",holder:"请输入联系电话"},
			{name:'time',type:'date',text:"预约时间",holder:"请输入预约时间"},
			{name:"co儿li",type: "option",sub:"cancel,sure",text:'确定'}
		]);
//弹出框出现
$(".order_training span").on('click', function (event) {
	appointment.showmodal();
});
$('.apply').on('click', function (event) {
	apply_open.showmodal();
});
	//确定按钮的回调函数
	apply_open.sure(function(){
		apply_open.hidemodal();
	});
	appointment.sure(function() {
		appointment.hidemodal();
	});
});