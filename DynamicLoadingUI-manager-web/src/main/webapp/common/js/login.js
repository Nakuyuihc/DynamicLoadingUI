$(function(){
    $("#username").focus();
    $("body").keydown(function(event) {
    	if (event.which == "13") {//keyCode=13是回车键
            login();
        }
    });
});
var number;
function login() {
    var username = $("#username").val();
    var password = $("#password").val();
   // var code = $("#code").val();
    if (username != '' && password != '') {	
    		$.ajax({
    			url : '/gift-fly/cisWeb/weblogin',
    			dataType : "json",
    			type : "post",
    			async: false,
    			data : {
    				name : username,
    				password : password,
    			},
    			success : function(data) {
    				if(data.status == "succeed"){
    					setCookie("username", username, 1);
    					setCookie("authoritylist", data.authoritylist, 1);
    					setCookie("adminid", data.userid, 1);
    					setCookie("orgId", data.orgId, 1);
    					insertLog(data.userid, 2, username+"登录","帐号管理");
    			    	window.location.href = "/gift-fly/index.html";
    			    }else {
    			    	$.messager.alert('提示', data.msg);
    			    }    				
    			},
    			error : function(err){
    				$.messager.alert('提示', '系统异常！','error');
    			}
    		});
    } else {
    	$.messager.alert('提示', '请输入用户名和密码！');
    }
}

//清除登录表单
function cleanForm(){
    $("#username").val("");
    $("#password").val("");
    $("#code").val("");
}
//获取图形验证码
function getImgCode() {
	var code ;
	$.ajax({
		url : 'base/graphicCode',
		dataType : "json",
		type : "post",
		async: false,
		data : {},
		success : function(data) {
				alert(data);
				console.log(data);
		},
		error : function(err){
			$.messager.alert('提示', '系统异常！','error');
		}
	});
}

