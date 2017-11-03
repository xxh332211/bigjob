/*TMODJS:{"version":2,"md5":"05a3406bab4acf5fd89df375c1ed8f73"}*/
template('index/alitong_category',function($data,$filename
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
$out+='.html?shareChannel=1" target="_blank">';
$out+=$escape(val.name);
$out+='</a></li> ';
});
$out+=' </ol> ';
});
$out+=' ';
}
return new String($out);
});