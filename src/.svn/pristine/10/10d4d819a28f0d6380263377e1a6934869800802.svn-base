/*TMODJS:{"version":9,"md5":"60f2ac287ecf2a5e0458509dacd8c801"}*/
template('detail/detail_list',function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,data2=$data.data2,value=$data.value,key=$data.key,$escape=$utils.$escape,rate=$data.rate,$out='';$each(data2,function(value,key){
$out+=' <div class="selected_list_row clearfix" data-pid=';
$out+=$escape(value.pid);
$out+='> <div class="td_name"> ';
$out+=$escape(value.text0);
$out+=' </div> <div class="td_type"> ';
$out+=$escape(value.text1);
$out+=' </div> <div class="td_num"> ';
$out+=$escape(value.num*rate);
$out+=$escape(data2.unit);
$out+=' <i class="iconfont delobj">&#xe633;</i> </div> </div> ';
});
return new String($out);
});