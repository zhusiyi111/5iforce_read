

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
})


var colorTimer = setInterval(function(){
	if($('#urlcheck').is('.success') && !$('#urlcheck').is(':hidden')){
		$('#floatWin').removeClass('d-normal').addClass('d-begin');
	}else{
		$('#floatWin').removeClass('d-begin').addClass('d-normal')
	}
},200);

function fillAnswer(){
	var url = $('#workUrl').val(),	//搜索引擎
		img = $('.yaoqiu').find('img').eq(0).attr('src'),	//图片
		stepText = $('.yaoqiu').text();

	//提取搜索关键字
	var keyword = '';
	try{
		var text = stepText;
		text = text.replace(/\s/g,'#');
		text = text.replace(/((百度一下)|(输入关键词)|(搜索关键词)|(搜索)|(搜素)|(搜索#)|(输入))(:|：|\s|#)/g,'searchBegin');
		text = text.match(/(searchBegin)[\u4e00-\u9fa5a-zA-Z0-9“”"]+/)[0];
		keyword = text.replace(/searchBegin/g,"");
	}catch(e){

	}

	

	chrome.runtime.sendMessage({
		J_method:'getAnswer',
		data:{
			url:url,
			img:img,
			keyword:keyword
		}
	}, function(res) {
		// 将当前信息存入localStorage
		if(res){
			setNowTask(res);
			console.log(res);
			// 填充答案
			$('#newadurl').val(res.answer);


			

			// openAd(res);
		}
	});
	setTimeout(function(){
		$('#newadurl').trigger('click');
	},8000);


}




function setNowTask(data){
	// localStorage只能存字符串
	data = JSON.stringify(data);
	chrome.runtime.sendMessage({
		J_method:'setNowTask',
		data:data
	}, function(res) {

	});
}

// 点过的变绿
$(document).delegate('.zhuanclick','click',function(){
	$(this).find('.title').css('color','green');
	$(this).find('.title').addClass('clicked');
})


// 自动刷广告
function openAd(res){

	// 重新聚焦
	chrome.runtime.sendMessage({
		J_method:'reFocus',
		data:{
			delayTime:0
		}
	}, function(res) {
		
	})

	// 打开新页面
	var newWin = window.open('about:blank');
	setTimeout(function(){
		newWin.location.href = res.searchUrl;

		setTimeout(function(){
			newWin.close();
		},17000);
	},1023);
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

// 判断答案是否正确，如果不正确或为空，则关闭弹框
var checkTimer = setInterval(function(){
	var text = $('#content_url').text();
	if( ( text==='提交网址或文字为空'||text==='验证网址不通过,请真实去点击广告') && !$('#content_url').is(':hidden') ){
		$('#tasklist_dig').siblings('.ui-dialog-titlebar').find('.ui-dialog-titlebar-close').trigger('click');
	}
},300);



var loopClickTimer = setInterval(function(){console.log(cickItem)
	var flag = true;
	// 弹窗必须是关闭的
	if($('#newadurl').length>0 && !$('#newadurl').is(':hidden')){
		flag = false;
	}
	if(flag==false){
		return;
	}
	var cickItem = $('.zhuanitem').filter(function(){
		var _this = $(this),
			money = _this.find('.txtcg').text()
		if( money>=80 || money<=70){
			return false;
		}
		if(_this.find('.title').is('.clicked')){
			return false;
		}
		return true;
	})

	if(cickItem.length>0){
		cickItem.eq(0).find('.zhuanclick').trigger('click');
	}else{
		setTimeout(function(){
			  window.location.reload();
		},3000);
	}

},5000);

