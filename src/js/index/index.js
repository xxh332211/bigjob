
define(['jquery',"swipper","common","doubletwelve","newUser"],function($) {
   

	//banner 
	var banner = function () {
		//轮播图
		var mySwiper = new Swiper('.swiper-container', {
			loop: true,
			pagination: '.swiper-pagination',
			paginationClickable: true,
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev',
			speed:600,
			autoplay : 3000
		});

	}();

    isNewUser();


});