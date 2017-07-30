// chrome.runtime.onMessage.addListener(function(data, sender, sendResponse){
// 	console.log(data);
// })

var timer = setInterval(function(){
	if($('#content_left').length!==0){
		init();
		clearInterval(timer);
	}	
})


$(document).delegate('.t','click',function(){

	var item = $(this).closest('.result'),
		title = item.find('.t a[data-click]').text(),
		website = item.find('.c-showurl').text();

	// 提取“/”之前的
	website = website.match(/[^\/]+/)[0];

	var data = {
		INTERFACE:'addTitleAndWebsite',
		title:title,
		website:website
	};

	chrome.runtime.sendMessage(data, function(response){

	});

	var url = $(this).find('a[data-click]').attr('href'); 
	setTimeout(function(){
		window.location.href = url;
	},5000);
	
	return false;
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
		}).find('a');
		if(target.length){
			var url = target.attr('href'); 
			setTimeout(function(){
				window.location.href = url;
			},2154);
		}

	

	});
}
