/*TMODJS:{"version":14,"md5":"ee84f7af45b1289c69b69a99ecd3dc25"}*/
template('index/category',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,data=$data.data,$each=$utils.$each,value=$data.value,i=$data.i,$escape=$utils.$escape,val=$data.val,num=$data.num,domain=$data.domain,$out='';if(data){
$out+=' ';
$each(data,function(value,i){
$out+=' <ol class="clearfix"> <div class="first">';
$out+=$escape(value.name);
$out+='</div> ';
$each(value.childList,function(val,num){
$out+=' <li><a href="';
$out+=$escape(domain);
$out+='/0-1-0-0-0-0-0-0-0-0-';
$out+=$escape(val.id);
$out+='_';
$out+=$escape(num);
$out+='.html" target="_blank">';
$out+=$escape(val.name);
$out+='</a></li> ';
});
$out+=' </ol> ';
});
$out+=' ';
}
$out+=' ';
return new String($out);
});