




var I = function(){

}

I.prototype.ajax = function(args){
	var method = args.method || '',
		data = args.data || {},
		success = args.success || function(){};

	chrome.runtime.sendMessage({
		method:method,
		data:data
	}, success);
}

I.prototype.get = function(method,func){ 

	chrome.runtime.onMessage.addListener(function(data, sender, sendResponse){
		if(data.method===method){
			func(data.data, sender, sendResponse);
			
		}

		return true;
	});

}




window.I = new I();


