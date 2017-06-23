function doExit(){
	window.location.href = "http://10.191.226.162:8080/routing/index.htm";//exit to portal	
}

function $(__id){
	return document.getElementById(__id);
}

function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str,2);	
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}

//获取浏览器版本
function getBrowserType(){
	var ua = navigator.userAgent.toLowerCase();
	return /ipanel/.test(ua) ? 'iPanel'
		: /enrich/.test(ua) ? 'EVM'
		: /wobox/.test(ua) ? 'Inspur'
		: window.ActiveXObject ? 'IE'
		: document.getBoxObjectFor || /firefox/.test(ua) ? 'FireFox'
		: window.openDatabase && !/chrome/.test(ua) ? 'Safari'
		: /opr/.test(ua) ? 'Opera'
		: window.MessageEvent && !document.getBoxObjectFor ? 'Chrome'
		: ''
		;	
}

/*获取URL参数*/
function getUrlParams(_key, _url, _spliter) {
	if (typeof(_url) == "object") {
		var url = _url.location.href;
	} else {
		var url = _url ? _url : window.location.href;
	}
	if (url.indexOf("?") == -1 && url.indexOf("#") == -1) {
		return "";
	}
	var spliter = _spliter || "&";
	var spliter_1 = "#";
	var haveQuery = false;
	var x_0 = url.indexOf(spliter);
	var x_1 = url.indexOf(spliter_1);
	var urlParams;
	if (x_0 != -1 || x_1 != -1 || url.indexOf("?") != -1) {
		if(url.indexOf("?") != -1) urlParams = url.split("?")[1];
		else if(url.indexOf("#") != -1) urlParams = url.split("#")[1];
		else urlParams = url.split(spliter)[1];
		if (urlParams.indexOf(spliter) != -1 || urlParams.indexOf(spliter_1) != -1) {//可能出现 url?a=1&b=3#c=2&d=5 url?a=1&b=2 url#a=1&b=2的情况。
			var v = [];
			if(urlParams.indexOf(spliter_1) != -1){
				v = urlParams.split(spliter_1);
				urlParams = [];
				for(var x = 0; x < v.length; x++){
					urlParams = urlParams.concat(v[x].split(spliter));
				}
			}else{
				urlParams = urlParams.split(spliter);
			}
		} else {
			urlParams = [urlParams];
		}
		haveQuery = true;
	} else {
		urlParams = [url];
	}
	var valueArr = [];
	for (var i = 0, len = urlParams.length; i < len; i++) {
		var params = urlParams[i].split("=");
		if (params[0] == _key) {
			valueArr.push(params[1]);
		}
	}
	if (valueArr.length > 0) {
		if (valueArr.length == 1) {
			return valueArr[0];
		}
		return valueArr;
	}
	return "";
}

/*检查字符串是否为有效值*/
function checkNull(_str){
	iDebug(">>>smile common.js checkNull in _str=" + _str);
	var tmpStr = "";
	if(typeof(_str) == "undefined" || _str == "null" || _str == "undefined"){
		tmpStr = "";
	}else{
		tmpStr = _str;
	}	
	iDebug(">>>smile common.js checkNull out tmpStr=" + tmpStr);
	return tmpStr;
}

/*------------返回字符串汉字长度 英文或特殊字符两个相当于一个汉字---------------------*/
function getStrChineseLen(str,len,suffix){
	if(checkNull(str) == "") return ""; //如果未传入有效的字符串，则直接返回空字符
	iDebug(">>>smile common.js getStrChineseLen in str=" + str + ",len=" + len + ",suffix=" + suffix);
	if(typeof(suffix) == "undefined"){
		suffix = "...";	
	}
	var w = 0;
	str = str.replace(/[ ]*$/g,"");
	var flag0 = 0;//上上个字符是否是双字节
	var flag1 = 0;//上个字符是否是双字节
	var flag2 = 0;//当前字符是否是双字节
	if(getStrChineseLength(str)>len){
		for (var i=0; i<str.length; i++) {
			 var c = str.charCodeAt(i);
			 flag0 = flag1;
			 flag1 = flag2;
			 //单字节加1
			 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			   w++;
			   flag2 = 0;
			 }else {
			   w+=2;
			   flag2 = 1;
			 }
			 if(parseInt((w+1)/2)>len){
				if(typeof(suffix) == "undefined"){
					return str.substring(0,i);
				}
				else if(suffix.length == 1){
					return str.substring(0,i-1)+suffix;
				}
				else if(suffix.length == 2){
					if (flag1 == 1)return str.substring(0,i-1)+suffix;
					else return str.substring(0,i-2)+suffix;
				}
				else{
					if (flag1 == 1)return str.substring(0,i-2)+suffix;
					else{
						var num = flag0 == 1 ? 2 : 3;
						return str.substring(0,i-num)+suffix;
					}
				}
				break;
			 }		 
		} 
	}
	iDebug(">>>smile common.js getStrChineseLen out str=" + str);
	return str; 
}

//返回字符串长度，为汉字长度，即如果字符串为汉字如"字符"，则返回2，如为"zf"，则返回1，英文2个字符等同一个汉字的长度
function getStrChineseLength(str){
	str = str.replace(/[ ]*$/g,"");
	var w = 0;
	for (var i=0; i<str.length; i++) {
     var c = str.charCodeAt(i);
     //单字节加1
     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
       w++;
     }else {
       w+=2;
     }
    } 	
	var length = w % 2 == 0 ? (w/2) : (parseInt(w/2)+1) ;
	return length;
}

function marqueeStr(_str,_len){
	if(checkNull(_str) == "") return ""; //如果未传入有效的字符串，则直接返回空字符
	iDebug(">>>smile common.js marqueeStr in _str=" + _str);
	var marqStr = _str;
	var len = getStrChineseLength(_str);
	if(len > _len){
		marqStr = "<marquee>" + _str + "</marquee>";
	}
	iDebug(">>>smile common.js marqueeStr out marqStr=" + marqStr);
	return marqStr;
}


/************************************** 收视率采集 - start *********************************************/
var collectMsgUrl = "http://10.191.226.161:8080/ars_collect/collect?collect_xml=";//收视率采集的服务器地址

//收视率采集的入口 shouSL("portal","ckapp",""); 第一参数代表应用的标示符  第二个参数写死为ckapp 第三个为空即可
function shouSL(aid,doWhat,info){ 
	iDebug(">>>smile_ssl shouSL in... aid=" + aid);
	var doUrl = collectMsgUrl;
	var obj={uid:"",ut:"",an:"",aid:"",time:"",doWhat:"",info:""};
	//uid:用户id、ut:用户订购属性、an:应用名称、aid:应用id、time:时间、doWhat:一般填ckapp、info:附加信息
	//对于聊城的应用：uid即为卡号；ut固定填1；an和aid可以填写一样的，为应用标示符；time取实时时间；doWhat填ckapp；info不用填
	obj.uid = getCAID();//CA卡号
	obj.ut = 1;
	obj.an = aid;
	obj.aid = aid;
	obj.time = getCollectTime();
	if(obj.doWhat == "")	obj.doWhat = doWhat;
	if(info != "" && info != "undefined"){
		obj.info = info;
	}		
	var postUrl="<EV uid='" + obj.uid + "' ut='" + obj.ut + "' an='"+obj.an + "' aid='" + obj.aid + "' time='"+obj.time + "' do='" + obj.doWhat + "'  info='" + obj.info + "'/>"; 
	doUrl += postUrl;
	iDebug(">>>smile_ssl shouSL out... doUrl=" + doUrl);
	collectAjaxObj(doUrl ,"","","Get","shouSL");	
}

//收视率采集的ajax函数
function collectAjaxObj(url,posturl,callback,type,fun){
	var xmlRequest = null;
	if (window.XMLHttpRequest) { 
	   xmlRequest = new XMLHttpRequest();
	}else if (window.ActiveXObject) { 
		try {
			xmlRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}
	xmlRequest.onreadystatechange = function(){
		iDebug(">>>smile_ssl collectAjaxObj onreadystatechange xmlRequest.readyState=" + xmlRequest.readyState);
		if(xmlRequest.readyState == 4){
			iDebug(">>>smile_ssl collectAjaxObj onreadystatechange xmlRequest.status=" + xmlRequest.status);
			if(xmlRequest.status == 200){
				var requestText = xmlRequest.responseText;
				iDebug(">>>smile_ssl collectAjaxObj onreadystatechange requestText=" + requestText);
			}else {
				iDebug(">>>smile_ssl collectAjaxObj onreadystatechange 网络异常，请求失败！");
			}
		}
	}
	if(type=="POST"){
		xmlRequest.open("POST", url, true);
		xmlRequest.setRequestHeader("Content-type","text/xml; charset=gb2312"); 
		xmlRequest.send(posturl);	
	}else if(type=="Get"){
		xmlRequest.open("Get",url,true);
		xmlRequest.send(null);	
	}
}

//获取采集时间
function getCollectTime(){
	var DateTemp = new Date();
	var day=DateTemp.getFullYear()+"-"+parseInt(DateTemp.getMonth()+1)+"-"+DateTemp.getDate();
	var et=DateTemp.getHours()+":"+DateTemp.getMinutes()+":"+DateTemp.getSeconds();
	return (day+" "+et);	
}

//获取浏览器版本
function getBrowserType(){
	var ua = navigator.userAgent.toLowerCase();
	return /ipanel/.test(ua) ? 'iPanel'
		: /enrich/.test(ua) ? 'EVM'
		: /wobox/.test(ua) ? 'Inspur'
		: window.ActiveXObject ? 'IE'
		: document.getBoxObjectFor || /firefox/.test(ua) ? 'FireFox'
		: window.openDatabase && !/chrome/.test(ua) ? 'Safari'
		: /opr/.test(ua) ? 'Opera'
		: window.MessageEvent && !document.getBoxObjectFor ? 'Chrome'
		: ''
		;	
}

//获取CA卡号
function getCAID(){
	var tmpCardId = "";
	var browserType = getBrowserType();
	if(browserType == "iPanel"){
		tmpCardId = CA.card.serialNumber;
	}else if(browserType == "Inspur"){
		tmpCardId = iSTB.settings.get("sys:ca0:cardnumber");
	}	
	if(tmpCardId == "undefined" || tmpCardId == null){
		tmpCardId = "";
	}
	return tmpCardId;
}

//打印函数
function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str,2);	
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}
}
/************************************** 收视率采集 - end *********************************************/

