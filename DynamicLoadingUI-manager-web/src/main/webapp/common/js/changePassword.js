$(document).ready(function(){
    $('#membername').textbox('setValue',ReadCookie("username"));
    $('#membername').textbox({
		disabled : true
	});
});
/**
 * 两次密码验证扩展
 */
$.extend($.fn.validatebox.defaults.rules, {
    eqPassword : { //扩展验证两次密码 
	validator : function(value, param) {
	    return value == $(param[0]).val();
	},
	message : '密码不一致！'
    }
});
//取消，清除
function cancel(){
    $("#pwd").textbox('setValue','');
    $("#newPassword").textbox('setValue','');
    $("#reNewPassword").textbox('setValue','');
}
//获取修改密码框信息，并提交
function changePassword() {
    //判断表单是否通过验证
    var valid = $('#cpf').form('validate');
    if (!valid) {
	return valid;
    }
    var username = $('#membername').textbox('getValue');
    var password = $('#pwd').textbox('getValue');
    var newPassword = $('#newPassword').textbox('getValue');
    $.ajax({
		url : '/gift-fly/cisWeb/changePW',
		dataType : "json",
		type : "post",
		data : {
			username : username,
			password : password,
			newpw : newPassword,
		},
		success : function(data) {
			if (data.status == "secceesd") {
				$.messager.show({
					timeout : 500,
					msg : "密码修改成功",
					title : "提示",
				});
				cancel();
				delCookie("username");
				delCookie("orgname");
				delCookie("rolecode");
				delCookie("computername");
				delCookie("ip");
				delCookie("authoritylist");
				delCookie("adminid");
				delCookie("orgId");
				window.location.href = "login.html";
			} else {
				$.messager.alert('提示', '修改失败，原始密码错误！', 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}