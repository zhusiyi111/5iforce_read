

// 加载insert.js
var s = document.createElement('script');
s.src = chrome.extension.getURL('js/clickAds/insert.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);



// 是否已经请求了
var lastImg = '';
var timer = setInterval(function(){
	var isOpened = (function(){
		if( !$('#newadurl').is(':hidden') && $('#newadurl').length!==0){
			return true;
		}else{
			return false;
		}
	})()

	var img = $('.yaoqiu').find('img').eq(0).attr('src');
	if(isOpened && img!==lastImg){
		fillAnswer();
		lastImg = img;
	}
},200);


var colorTimer = setInterval(function(){
	if($('#urlcheck').is('.success') && !$('#urlcheck').is(':hidden')){
		$('#floatWin').removeClass('d-normal').addClass('d-begin');
	}else{
		$('#floatWin').removeClass('d-begin').addClass('d-normal')
	}
},200);

function fillAnswer(){


	var need = $('.yaoqiu').text().replace(/\s/g,''),
		imgs = $('.yaoqiu img') || '',
		lastRequest = $('.lastrequest').text().replace(/\s/g,''),
		imgStr = [];

	imgs.each(function(){
		imgStr.push($(this).attr('src'));
	})
	imgStr = imgStr.join('');



	I.ajax({
		method:'getInfo',
		data:{
			need:need,
			imgStr:imgStr,
			lastRequest:lastRequest
		},
		success:function(data){
			data = JSON.parse(data)[0];
			console.log(data);
			if(data){
				if(data.adUrl){
					$('#newadurl').val(data.adUrl);
					openAd(data.website);
				}
				if(data.adText){
					$('#cktext').val(data.adText)
				}

			}
			
		}
	})

	

	setTimeout(function(){
		if($('#newadurl').val()===''){
			$('#tasklist_dig').siblings('.ui-dialog-titlebar').find('.ui-dialog-titlebar-close').trigger('click');
		}else{
			setTimeout(function(){
				$('#newadurl').trigger('click');
			},8000);
		}
	},1000);


}



// 点过的变绿
$(document).delegate('.zhuanclick','click',function(){
	$(this).find('.title').css('color','green');
	$(this).find('.title').addClass('clicked');
})


// 新建标签
function openAd(url){


	I.ajax({
		method:'createTabThenClose',
		data:{
			url:url,
			delayTime:2000
		},
		success:function(data){

		}
	})

}

// 添加悬浮窗
var floatWin = '<style>'+
					'#floatWin{position:fixed;left:0;top:0;z-index:99999;width:40px;height:40px;}'+
					'.d-normal{background-color:#000;}'+
					'.d-begin{background-color:#ffffff}'+
				'</style>'+
				'<div id="floatWin" class="d-normal"></div>';
$('body').append(floatWin);

// 插入验证码提交表单
var checkCodeHtml = '<style>'+
						'#uploadForm{position:fixed;left:0;top:100px;z-index:99999;}'+
					'</style>'+			
					'<form id= "uploadForm">'+  
						'<input type="hidden" name="username" value="chinaberry">'+
						'<input type="hidden" name="password" value="zhusiyizsy">'+
						'<input type="hidden" name="typeid" value="1030">'+
						'<input type="hidden" name="softid" value="84232">'+
						'<input type="hidden" name="softkey" value="f3233971a6884688a2e94ed75063fb13">'+
						'<input type="file" name="image" filename="1.jpg"/></p>  '+
					     '<input type="button" value="上传" id="uploadBtn"/>  '+
					'</form> '+
					'<div id="checkCodeId"></div>';
$('body').append(checkCodeHtml);




$(document).delegate('#uploadBtn','click',uploadCheckCode);

function uploadCheckCode(){  
	var formData = new FormData($( "#uploadForm" )[0]);  
	$.ajax({  
	  url: 'http://api.ruokuai.com/create.json' ,  
	  type: 'POST',  
	  data: formData,  
	  async: false,  
	  cache: false,  
	  contentType: false,  
	  processData: false,  
	  success: fillCheckCode,  
	  error: function (returndata) {  
	      console.log(returndata);  
	  }  
	});  
}  


// 回填验证码
function fillCheckCode(data){
	$('#yzm').val(data.Result);
	$('#checkCodeId').text(data.Id);
	$('#TijiaoButton').trigger('click');

}



// // 判断答案是否正确，如果不正确或为空，则关闭弹框
var checkTimer = setInterval(function(){
	var text = $('#content_url').text();
	if( ( text==='提交网址或文字为空'||text==='验证网址不通过,请真实去点击广告') && !$('#content_url').is(':hidden') ){
		$('#tasklist_dig').siblings('.ui-dialog-titlebar').find('.ui-dialog-titlebar-close').trigger('click');
	}
},300);



var loopClickTimer = setInterval(function(){

	var flag = true;
	// 弹窗必须是关闭的
	if($('#newadurl').length>0 && !$('#newadurl').is(':hidden')){
		flag = false;
	}
	if(flag==false){
		return;
	}
	var clickItem = $('.zhuanitem').filter(function(){
		var _this = $(this),
			money = _this.find('.txtcg').text()
		if( money<40 || money>80){
			return false;
		}
		if(_this.find('.title').is('.clicked')){
			return false;
		}
		return true;
	})


	if(clickItem.length>0){
		clickItem.eq(0).find('.zhuanclick').trigger('click');
	}else{
		setTimeout(function(){
			  window.location.reload();
		},3000);
	}

},5000);

