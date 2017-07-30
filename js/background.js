


I.get('getInfo',function(data,sender,sendResponse){
	$.ajax({
		url:'http://localhost:3002/task/getInfo',
		data:data,
		success:function(data){
			sendResponse(data);
		}
	});	
})

I.get('createTabThenClose',function(data,sender,sendResponse){
	chrome.tabs.create({active:false,selected:false}, function(tab){
		setTimeout(function(){
			chrome.tabs.update(tab.id, {url:data.url}, function(data){})
			setTimeout(function(){
				chrome.tabs.remove(tab.id, function(data){

				});
			},20000)
		},data.delayTime || 0);
	})
})




// chrome.commands.onCommand.addListener(function(cmd){
// 	// 自动点击广告
// 	if(cmd==='openAd'){
// 		var task = JSON.parse(getNowTask());
// 		console.log(task);

// 		// 打开新页面
// 		var newWin = window.open('about:blank');
// 		setTimeout(function(){
// 			newWin.location.href = task.searchUrl;

// 			setTimeout(function(){
// 				newWin.close();
// 			},17000);
// 		},1023);
// 	}
// })