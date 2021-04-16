//方法调用事例：
/*    
    myAjax({
        url: "./TestXHR.aspx",              //请求地址
        type: "POST",                       //请求方式
        data: { name: "super", age: 20 },        //请求参数
        success: function (response) {
            // 此处放成功后执行的代码
        },
        error: function (status) {
            // 此处放失败后执行的代码
        }
    });
*/


function myAjax(options) {
    console.log(options.type)
	options = options || {};
	options.type = (options.type || "GET").toUpperCase();
	var params = formatParams(options.data);

	//浏览器兼容
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	} else {
		var xhr = ActiveXObject('Microsoft.XMLHTTP');
	}

	xhr.onreadystatechange = function(data) {
		if (xhr.readyState == 4) {
			if (xhr.status == 200 || xhr.status == 304) {
				options.success && options.success(JSON.parse(xhr.responseText));
			} else {
				options.error && options.error(status);
			}
		}
	}

	//判断时post请求还是get请求
	if (options.type == "GET") {
		xhr.open('get', options.url + '?' + params, true);
		xhr.send(null);
	} else if (options.type == "POST") {
		xhr.open('POST', options.url, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //post要设置请求头
		xhr.send(params);
	}



	//格式化传入的data
	function formatParams(data) {
		var arr = [];
		for (var name in data) {
			arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
		}
		arr.push(("v=" + Math.random()).replace(".", ""));
		return arr.join("&");
	}


}