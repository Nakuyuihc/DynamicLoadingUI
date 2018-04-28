$(document).ready(function() {
	loginCheck1();
});
//升级设置
function upgradeSet() {
	$("#teb1").css({
		background : "#748ccb",
		fontSize : "13px",
		border : "1px solid #fff"
			
	});
	$("#teb2").css({
		background : "#E0ECFF",
		fontSize : "12px",
		border : "1px solid #E0ECFF"
	});
	$("#teb3").css({
		background : "#E0ECFF",
		fontSize : "12px",
		border : "1px solid #E0ECFF"
	});
	$("#upgrade").show();
	$("#search").hide();
	$("#sensitive").hide();
	title = "升级设置";
}
//敏感字符设置
function sensitiveSet() {
	$("#teb2").css({
		background : "#748ccb",
		fontSize : "13px",
		border : "1px solid #fff"
	});
	$("#teb1").css({
		background : "#E0ECFF",
		fontSize : "12px",
		border : "1px solid #E0ECFF"
	});
	$("#teb3").css({
		background : "#E0ECFF",
		fontSize : "12px",
		border : "1px solid #E0ECFF"
	});
	$("#upgrade").hide();
	$("#search").hide();
	$("#sensitive").show();
	title = "sys.cms.敏感词汇";
	selectSensitive(title);
}
//热门搜索
function hotSearch() {
	$("#teb3").css({
		background : "#748ccb",
		fontSize : "13px",
		border : "1px solid #fff"
	});
	$("#teb2").css({
		background : "#E0ECFF",
		fontSize : "12px",
		border : "1px solid #E0ECFF"
	});
	$("#teb1").css({
		background : "#E0ECFF",
		fontSize : "12px",
		border : "1px solid #E0ECFF"
	});
	$("#upgrade").hide();
	$("#search").show();
	$("#sensitive").hide();
	title = "sys.other.热门搜索";
	//查询平台已有的关键词
	selectHotSearch();
}
/**
 * 验证扩展
 */
$.extend($.fn.validatebox.defaults.rules, {
	maxlength : {
		validator : function(value, param) {
			return value.length < param[0] + 1;
		},
		message : "不可超过{0}个字符！"
	}
});
var id;
var settingid;
var title;
var adminid = ReadCookie("adminid");
var senderName = ReadCookie("username");
//根据key查敏感字符
function selectSensitive(title) {
	$("#sensitivemanagr").val("");
	$.ajax({
		url : '/gift-fly/system/params/selectSensitive',
		dataType : "json",
		type : "post",
		data : {
			title : title,
		},
		success : function(data) {
			settingid = data.setting;
			$("#sensitivemanagr").val(data.content);
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//保存敏感字符
function savesensitive() {
	var content =$("#sensitivemanagr").val();
	var type =0;
	$.ajax({
		url : '/gift-fly/system/params/insertSensitive',
		dataType : "json",
		type : "post",
		data : {
			title : title,
			settingid : settingid,
			content : content,
			node : "参数设置",
			adminid : adminid,
		},
		success : function(data) {
			if(data.flag ==1){
				$.messager.show({
					timeout : 500,
					msg : "保存成功！",
					title : "提示"
				});
				//保存日志
				insertLog(adminid,1,"修改"+title+"的数据","参数设置");
			}else if(data.flag ==-1){
				$.messager.alert('提示', data.MSG, 'error');
			}else{
				$.messager.alert('提示', '保存失败', 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//根据key查热门搜索词汇
function selectHotSearch(){
	$(".easyui-textbox").val("");
	$.ajax({
		url : '/gift-fly/system/params/selectHotSearch',
		dataType : "json",
		type : "post",
		async: false,
		data : {
			title : title,
		},
		success : function(data) {
			settingid = data.setting;
			var list = data.content;
			for ( var i = 1; i < list.length+1; i++) {
				$('#'+i).val(list[i-1]);
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//保存热门搜索词汇
function savessearch() {
	var list = [];
	var first = $("#1").val();
	if (first !="") {
		list.push(first);
	}
	var two = $("#2").val();
	if (two !="") {
	list.push(two);
	}
	var th = $("#3").val();
	if (th !="") {
		list.push(th);
	}
	var fr = $("#4").val();
	if (fr !="") {
	list.push(fr);
	}
	var fi = $("#5").val();
	if (fi !="") {
	list.push(fi);
	}
	var sex = $("#6").val();
	if (sex !="") {
	list.push(sex);
	}
	var sev = $("#7").val();
	if (sev !="") {
	list.push(sev);
	}
	var ei = $("#8").val();
	if (ei !="") {
	list.push(ei);
	}
	var ni = $("#9").val();
	if (ni !="") {
	list.push(ni);
	}
	var te = $("#10").val();
	if (te !="") {
	list.push(te);
	}
	 var strlist = JSON.stringify(list);
	$.ajax({
		url : '/gift-fly/system/params/insertHotSearch',
		dataType : "json",
		type : "post",
		data : {
			title : title,
			settingid : settingid,
			content : strlist,
			node : "参数设置",
			adminid : adminid,
		},
		success : function(data) {
			if(data.flag >0){
				$.messager.show({
					timeout : 500,
					msg : "保存成功！",
					title : "提示"
				});
				//保存日志
				insertLog(adminid,1,"修改"+title+"的数据","参数设置");
			}else if(data.flag ==-1){
				$.messager.alert('提示', data.MSG, 'error');
			}else{
				$.messager.alert('提示', '保存失败', 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}