document.onirkeypress = grabEvent;
document.onkeydown = grabEvent;
function grabEvent(event){
	var keyval = event.which;
//	iDebug(">>>smile grabEvent keyval=" + keyval);
	switch(keyval){	
		case 3:
		case 37:
			leftAndRight(-1);
			return false;
			break;
		case 4:
		case 39:
			leftAndRight(1);
			return false;
			break;
		case 33:
			changePlayProgress(-30);			//快退
			return false;
			break;
		case 34:	
			changePlayProgress(30);				//快进	
			return false;
			break;
		case 339:
		case 27:
			exitPage();
			return false;
			break;
		case 340:
		case 8:
			exitPage();
			return false;
			break;
		case 13:
			uiOnOff();
			return false;
			break;
		case 19:
			doSelect();
			return false;
			break;
	}
}
 	var playProgressTimer
	var uistate = 1; //进度条状态  1：显示；0；异常
	var ct;
	var playing = 1; //播发状态 1；播放
	var elapsed;//当前时长
	var duration;//总时长
//	var ff = 1
function init(){
	var playUrl = $("#currTime").attr("goUrl");
	openVideo(playUrl);
	iSTB.player.set_volume(8); 
}

function leftAndRight(_num){
	valeue = iSTB.player.get_volume();
	valeue = valeue+_num;
	if(valeue<1)valeue=1;
	if(valeue>31)valeue=31;
	iSTB.player.set_volume(valeue); 
	$(".volumeUi").show();
	$(".volumeUi").html("当前音量"+" "+valeue); 
	clearTimeout(ct);
	ct = setTimeout(function(){$(".volumeUi").hide();}, 1200 );
}
function changePlayProgress(_num){
	clearTimeout(playProgressTimer);
	if((elapsed+_num > duration)||(elapsed+_num<0)) {return;}
	elapsed+=_num;
	iSTB.player.seek(elapsed);
	if(_num>0){
		var tt = "<div style='line-height:30px; padding-top:20px;'>快进<br/>"+checkNum(Math.floor(parseInt(elapsed,10)/3600))+":"+checkNum(Math.floor((parseInt(elapsed,10)%3600)/60))+":"+ checkNum(parseInt(elapsed,10)%60)+"/"+checkNum(Math.floor(parseInt(duration,10)/3600))+":"+checkNum(Math.floor((parseInt(duration,10)%3600)/60))+":"+ checkNum(parseInt(duration,10)%60)+"</div>";
	}else{
		var tt = "<div style='line-height:30px; padding-top:20px;'>快退<br/>"+checkNum(Math.floor(parseInt(elapsed,10)/3600))+":"+checkNum(Math.floor((parseInt(elapsed,10)%3600)/60))+":"+ checkNum(parseInt(elapsed,10)%60)+"/"+checkNum(Math.floor(parseInt(duration,10)/3600))+":"+checkNum(Math.floor((parseInt(duration,10)%3600)/60))+":"+ checkNum(parseInt(duration,10)%60)+"</div>";
	}
	$(".volumeUi").html(tt); 	
	$(".volumeUi").show();
	playProgressTimer=setTimeout(function(){volumeUiClear();},1200);	
}
function openVideo(_url){
		iSTB.player.set_video_window(0, 0, 1280, 720);
		iSTB.player.play(_url);
		iSTB.player.seek(10);
}
function doSelect(){
	if(playing==1){
		iSTB.player.pause();
		playing = 0;
		$(".volumeUi").html("暂停"); 	
		$(".volumeUi").show();
	}else{
		iSTB.player.resume();
		playing = 1;
		$(".volumeUi").html(""); 	
		$(".volumeUi").hide();
	}
}
function closeVideo(){
	iSTB.player.stop();
}

function volumeUiClear(){
	$(".volumeUi").html("");
	$(".volumeUi").hide();
}
function getDuration(){
	duration = parseInt(iSTB.player.get_duration(),10);
	document.getElementById("endTime").innerHTML = checkNum(Math.floor(parseInt(duration,10)/3600))+":"+checkNum(Math.floor((parseInt(duration,10)%3600)/60))+":"+ checkNum(parseInt(duration,10)%60);
}
function checkNum(_num){
	return _num<10?"0"+_num:_num;
}
//进度条
function playProcess(){
	elapsed = parseInt(iSTB.player.get_position(),10);
	if(parseInt(elapsed,10) < 2){
		elapsed = 1;
	}
	else if(parseInt(elapsed,10) > parseInt(duration,10)){
		elapsed = parseInt(duration,10);
	}
	document.getElementById("currTime").innerHTML = checkNum(Math.floor(parseInt(elapsed,10)/3600))+":"+checkNum(Math.floor((parseInt(elapsed,10)%3600)/60))+":"+ checkNum(parseInt(elapsed,10)%60);
	var currProcess = Math.floor(parseInt(elapsed)/parseInt(duration)*800);
	document.getElementById("bftr").style.width = currProcess + "px";

	setTimeout(function(){playProcess();},1000);	
}

function exitPage(){
	closeVideo();
	history.back();
}
function uiOnOff(){
 	if(uistate==1){
		$(".top").animate({top:"-60px"});
		$(".bottom").animate({bottom:"-60px"});
		uistate=0;
	}else{
		$(".top").animate({top:"0px"});
		$(".bottom").animate({bottom:"0px"});
		setTimeout(function(){uiOnOff();},2000);
		uistate=1;
	}
 }
 $(function(){init();});
iSTB.evt.set_event_callback("eventCallback");
	function eventCallback(type,event_name,event_type,event_value){
		switch(event_name){
			case  "PLAYER_BUFFERING_END":
				iSTB.player.seek(0);
				volumeUiClear();
				getDuration();
				playProcess();
				setTimeout(function(){uiOnOff();}, 5000);
				break;
			case "PLAYER_FINISH":
				exitPage();
				break;
		}
	}
