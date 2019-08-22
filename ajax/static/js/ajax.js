// 模仿 JQ 封装 Ajax
var ajax = {
    ajax: function (options) {
        var xhr = ajax.createXHT(),
            URL = options.URL, // URL 地址
            method = options.method || 'GET', // 请求方式
            async = typeof (options.async) === "undefined" ? true : options.async, // 同步或者异步
            data = options.data || null, // 传递的数据
            params = '', // 参数
            callback = options.success, // ajax 请求成功的回调函数
            error = options.error;

        // 根据 method 的值改变 URL
        if (method.toUpperCase() === "GET") {
            // 将 data 的对象字面量的形式转换为字符串形式
            if (data) {
                for (var i in data) {
                    params += i + '=' + data[i] + '&';
                }
                params = params.replace(/&$/, '');
            }
            URL += '?' + params;
        } else {
            params = JSON.stringify(data);
        }

        // 响应 XHR 对象变化函数
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status <= 300) || xhr.status === 304) {
                    callback && callback(JSON.parse(xhr.responseText));
                } else {
                    error && error();
                }
            }
        };

        // 创建并发送请求
        xhr.open(method, URL, async);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(params);
    },

    createXHT: function () {
        if (XMLHttpRequest) {
            // IE7 以上版本及其它现代浏览器将 XMLHttpRequest 对象作为本地对象实现，所以这里进行判断
            return new XMLHttpRequest();
        } else if (ActiveXObject) {
            // IE 低版本浏览器判断 ActiveXObject
            // 将所有可能出现的 ActiveXObject 版本放在一个数组中
            var xhrArr = [
                'Microsoft.XMLHTTP',
                'MSXML2.XMLHTTP.6.0',
                'MSXML2.XMLHTTP.5.0',
                'MSXML2.XMLHTTP.4.0',
                'MSXML2.XMLHTTP.3.0',
                'MSXML2.XMLHTTP.2.0'
            ];
            // 遍历创建 XMLHttpRequest 对象
            var len = xhrArr.length;
            for (var i = 0; i < len; i++) {
                try {
                    // 创建 XMLHttpRequest 对象
                    var xhr = new ActiveXObject(xhrArr[i]);
                    break;
                } catch (e) {

                }
            }
            return xhr;
        } else {
            throw new Error("Not support XHR Object.")
        }
    },
};