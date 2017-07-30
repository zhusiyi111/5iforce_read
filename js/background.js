chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	if(sender.url.indexOf('www.5iads.cn/zhuan.asp?zhuan=click')!==-1){
		processClickAds(request, sender, sendResponse);
  	}else if(sender.url.indexOf('www.5iads.cn/zhuan.asp?zhuan=search')!==-1){
		processSearchAds(request, sender, sendResponse);
  	}else if(/www\.baidu\.com/.test(sender.url)){
  		processBaidu(request, sender, sendResponse);
  	}else if(/m\.baidu\.com/.test(sender.url)){
		processMBaidu(request, sender, sendResponse);
  	}

  	return true;
  });

function processBaidu(request, sender, sendResponse){
	if(request.J_method==='getNowTask'){
		sendResponse(getNowTask());
	}
}

function processClickAds(request, sender, sendResponse){
	// 获得localStroge中的搜索链接及title
	if(request.J_method==='getAnswer'){
		getAnswer(request, sender, sendResponse);
	}else if(request.J_method==='setNowTask'){
		setNowTask(request, sender, sendResponse);
	}else if(request.J_method==='reFocus'){
		reFocus(request, sender, sendResponse);
	}
}

function processSearchAds(request, sender, sendResponse){
	// 获得localStroge中的搜索链接及title
	if(request.J_method==='getAnswer'){
		getAnswer(request, sender, sendResponse);
	}else if(request.J_method==='setNowTask'){
		setNowTask(request, sender, sendResponse);
	}else if(request.J_method==='reFocus'){
		reFocus(request, sender, sendResponse);
	}
}

function processMBaidu(request, sender, sendResponse){
	if(request.J_method==='getNowTask'){
		sendResponse(getNowTask());
	}
}


// 将当前任务存入localStorage
function setNowTask(request, sender, sendResponse){
	localStorage.setItem('nowTask',request.data);
}

function getNowTask(request, sender, sendResponse){
	return localStorage.getItem('nowTask');
}


// 查询答案
function getAnswer(request, sender, sendResponse){
	
	var data = {
		img:request.data.img,
		keyword:request.data.keyword,
		url:request.data.url
	}
	console.log(request);
	$.ajax({
		url:'http://localhost:3000/task/getAnswer',
		method:'get',
		data:data,
		success:function(data){
			data = JSON.parse(data);
			console.log(data);
			if(data.length){
				sendResponse(data[0]);
			}

			
		}
	});

}

// 重新聚焦
function reFocus(request, sender, sendResponse){

	var delayTime = request.delayTime,
		tabid = sender.tab.id;

	setTimeout(function(){
		chrome.tabs.update(tabid,{'active':true}, function(data){
		});
	},0)
		
}


chrome.commands.onCommand.addListener(function(cmd){
	// 自动点击广告
	if(cmd==='openAd'){
		var task = JSON.parse(getNowTask());
		console.log(task);

		// 打开新页面
		var newWin = window.open('about:blank');
		setTimeout(function(){
			newWin.location.href = task.searchUrl;

			setTimeout(function(){
				newWin.close();
			},17000);
		},1023);
	}
})