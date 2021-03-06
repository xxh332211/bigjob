define(["jquery",'tpl',"laydate"],function ($,template,laydate) {

	function modal (arr) {
		var _this = this;
		var obj = {};
		$(arr).each(function(index, el) {
			if(!$(el).require){
				$(el).require = "";
			}
		});
		obj.array = arr;
		this.html = template("component/modal",obj);
		this.index = $('.modal_cover').length;
		$("body").append(this.html);
		this.cover = $('.modal_cover').eq(this.index);
		
		this.cover.find('.closes,.cancel').on('click', function(event) {
			_this.hidemodal();
		});
		
		this.cover.find('input[data-cheack]').on('change', function(event) {
			var that = this;
				var check = $(that).data('cheack')?_this.cheack[$(that).data('cheack')]($(that).val()):_this.cheack["default"]("haha")
				var nomatch = $(that).siblings('.nomatch')

				if($(that).hasClass('require')||$(that).val().trim()!=""){
					if (!check) {
						nomatch.fadeIn("fast");
					};
					if (check){
						nomatch.fadeOut("fast");
					}
				};
				if( !$(that).hasClass('require') && $(that).val().trim()=="") {
						nomatch.fadeOut("fast");
				};
				_this.cansend();
		});
		this.cover.find('.checkbox b,.checkbox .iconfont').click(function(event) {
			var iconfont = $(this).parents(".checkbox").find('.iconfont')
			if (iconfont.hasClass('nor')) {
				iconfont.removeClass('nor');
			} else {
				iconfont.addClass('nor');
			}
			var big = _this.cover.find('.big');
			if (big) {
				if(big.hasClass('disable')){
					big.removeClass('disable');
				}else{
					big.addClass('disable');
				}
			}
			
		});
	};
	modal.prototype.cheack = {
		isphone: function (value) {
			if (value.search(/^(\+\d{2,3})?\d{11}$/) == -1){
				return false;
			}
			else{
				return true;
			}
		},
		isusername_ali : function (value) {
			if (value.search(/^[\u4e00-\u9fa5_a-zA-Z0-9_]{1,50}$/) == -1){
				return false;
			}
			else{
				return true;
			}
		},
		isusername: function (value) {
			if (value.search(/^[a-zA-Z0-9_]{3,16}$/  ) == -1){
				return false;
			}
			else{
				return true;
			}
		},
		isemail: function (value) {
			if (value.search(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) == -1){
				return false;
			}
			else{
				return true;
			}
		},
		ispassword: function (value) {
			if (value.search(/^[a-zA-Z0-9_-]{6,20}$/) == -1){
				return false;
			}
			else{
				return true;
			}
		},
		isidcard: function (value) {
			if (value.search(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/) == -1){
				return false;
			}
			else{
				return true;
			}
		},
		isurl: function (value) {
			if (value.search(/^(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig) == -1){
				return false;
			}
			else{
				return true;
			}
		},
		issms: function (value) {
			if (value.search(/^\d{4,}$/) == -1) {
				return false;
			}else{
				return true;
			}
		},
		isnum: function (value) {
			if (value.search(/^[0-9]*$/) == -1) {
				return false;
			}else{
				return true;
			}
		},
		default: function (value) {
			return true;
		}
	};
	modal.prototype.match = function () {
		var cheackmethod = this.cover.data("cheack");
	};
	modal.prototype.sure = function (callback) {
		var that = this;
		this.cover.find('.sure').on('click', function(event) {
			event.preventDefault();
			callback();
		});
	};
	modal.prototype.showmodal = function () {
		this.cover.removeClass('hide');
		// this.cover.fadeIn("fast");
	};
	modal.prototype.hidemodal = function () {
		this.cover.find('input').val("");
		this.cover.find('.sure');
		this.cover.addClass("hide");
		// this.cover.fadeOut("fast");
		
	};
	modal.prototype.cansend = function () {
		var flag = true;
		this.cover.find('.nomatch').each(function(index, el) {
			if($(el).css('display')=="block"){
				flag = false;
			}
		});
		this.cover.find('.require').each(function(index, el) {
			if($(el).val()==""){
				flag = false;
			};
		});
		return flag;
	};
	modal.prototype.getresult = function () {
		var temp = {};
		this.cover.find("[data-name]").each(function(index, el) {
			var _name = $(el).data('name');
			var _child = $(el).find('[data-child]');
			if(temp[_name] && temp[_name] instanceof Array) {
				temp[_name].push(_child.val());
			}else if (temp[_name]&& !(temp[_name] instanceof Array)){
				temp[_name] = [temp[_name]];
				temp[_name].push(_child.val())
			}else if (!temp[_name]){
				temp[_name] = _child.val();
			}
		});
		return temp;
	};

	return modal ;
});