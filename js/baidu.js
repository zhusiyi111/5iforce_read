// chrome.runtime.onMessage.addListener(function(data, sender, sendResponse){
// 	console.log(data);
// })

var timer = setInterval(function(){
	if($('#content_left').length!==0){
		init();
		clearInterval(timer);
	}	
})




function init(){

	autoClick();


	
}

function autoClick(){

	chrome.runtime.sendMessage({
		J_method:'getNowTask'
	}, function(res) {
		res = JSON.prase(res).title;
		console.log(res);
		var target = $('h3').filter(function(){
			var _this = $(this);
			if(_this.text().indexOf(res)!==-1){
				return true;
			}
			return false;
		}).find('a');
		target.trigger('click');

	});
}
