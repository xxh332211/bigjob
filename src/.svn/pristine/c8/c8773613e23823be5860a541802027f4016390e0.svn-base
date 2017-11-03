define(["jquery","common"],function($) {
	//大袜爆款 楼层索引
	var click_eq = 0;
	$(".activity_dawabaokuan_floor .filter .filter_top_content>dl>dd").on('click', function(event) {
		click_eq = $(this).index()-1;
		$(this)
		.parents(".activity_dawabaokuan_floor")
		.children('.activity_product')
		.eq(click_eq)
		.addClass('show')
		.removeClass('hide')
		.siblings(".activity_product")
		.removeClass('show')
		.addClass('hide');
	});
});