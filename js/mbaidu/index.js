// chrome.runtime.onMessage.addListener(function(data, sender, sendResponse){
// 	console.log(data);
// })

var timer = setInterval(function(){
	if($('.c-container').length!==0){
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
		res = JSON.parse(res).title;
		var target = $('h3').filter(function(){
			var _this = $(this);
			if(_this.text().indexOf(res)!==-1 || res.indexOf(_this.text())!==-1 ){
				return true;
			}
			return false;
		});
		if(target.length){
			setTimeout(function(){
				target.trigger('click')
			},2154);
		}

	

	});
}


