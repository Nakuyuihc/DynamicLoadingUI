var orgid;
var id;
//账户
function account() {
	var row = $("#merchantListdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的加盟商', 'warning');
		return;
	}
	orgid = row.id;
	dispostData(orgid);
	$("#merchantAccount").dialog("open");
}
//加载数据
function dispostData(orgid) {
	$('#merchantaccountdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/fina/findMerchantAccount',
		dataType : "json",
		type : "post",
		data : {
			orgid : orgid,
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#merchantaccountdg').datagrid('loaded');
				$("#merchantaccountdg").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
//操作
function formatterACZ() {
	return '<a href="javascript:editAccount();" class="audit">编辑</a>&nbsp;&nbsp;' +
		'<a href="javascript:delAccount();" class="audit">删除</a>';
}
function addAccount() {
	$("#branchName").textbox('setValue', "");
	$("#accountIdCode").textbox('setValue', "");
	$("#accountName").textbox('setValue', "");
	$("#usermobile").textbox('setValue', "");
	//获取银行下拉列表
	$.ajax({
		url : '/gift-fly/system/fina/findBankList',
		dataType : "json",
		type : "post",
		async : false,
		data : {},
		success : function(data) {
			$('#bankname').combobox({
				panelHeight : 'auto',
				valueField : 'id',
				textField : 'name',
				data : data,
				onLoadSuccess : function() {
					var data = $('#bankname').combobox('getData');
					if (data.length > 0) {
						$('#bankname').combobox('select', data[0].id);
					}
				}
			});
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
	$("#addMaccount").dialog("open");
}
function savemaccountInfo() {
	// 判断表单是否通过验证
	var valid = $('#addMaccountfrom').form('validate');
	if (!valid) {
		return valid;
	}
	// 获取表单af中的值并转化
	var afInfo = $("#addMaccountfrom").serializeArray();
	var bankName = afInfo[0].value;
	var branchName = afInfo[1].value;
	var accountIdcode = afInfo[2].value;
	var accountName = afInfo[3].value;
	var mobile = afInfo[4].value;
	$.ajax({
		url : '/gift-fly/system/fina/insertOrgAccount',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			userId : orgid,
			userType : 2,
			accountName : accountName,
			accountBankId : bankName,
			branchName : branchName,
			accountIdcode : accountIdcode,
			mobile : mobile,
			adminid : adminid,
			node : "加盟商列表",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#addMaccount").dialog("close");
				$.messager.show({
					timeout : 500,
					msg : "添加成功！",
					title : "提示"
				});
				// 插入日志
				insertLog(adminid, 1, "新增加盟商银行帐号:" + accountIdcode, "加盟商列表");
			}
			dispostData(orgid);
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
function editAccount() {
	var row = $("#merchantaccountdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要编辑的银行帐号信息', 'warning');
		return;
	}
	$.ajax({
		url : '/gift-fly/system/fina/findBankList',
		dataType : "json",
		type : "post",
		async : false,
		data : {},
		success : function(data) {
			$('#upbankname').combobox({
				panelHeight : 'auto',
				valueField : 'id',
				textField : 'name',
				data : data,
			});
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
	id = row.id;
	$('#upMaccountfrom').form('load', {
		bankname : row.bankId,
		branchName : row.branchName,
		accountIdCode : row.accountIdCode,
		accountName : row.accountName,
		usermobile : row.mobile,
	});
	$("#updateMaccount").dialog("open");
}
function updatemaccountInfo() {
	// 判断表单是否通过验证
	var valid = $('#upMaccountfrom').form('validate');
	if (!valid) {
		return valid;
	}
	// 获取表单af中的值并转化
	var afInfo = $("#upMaccountfrom").serializeArray();
	var bankName = afInfo[0].value;
	var branchName = afInfo[1].value;
	var accountIdcode = afInfo[2].value;
	var accountName = afInfo[3].value;
	var mobile = afInfo[4].value;
	$.ajax({
		url : '/gift-fly/system/fina/updateOrgAccount',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			id : id,
			userType : 2,
			accountName : accountName,
			accountBankId : bankName,
			branchName : branchName,
			accountIdcode : accountIdcode,
			mobile : mobile,
			adminid : adminid,
			node : "加盟商列表",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#updateMaccount").dialog("close");
				$.messager.show({
					timeout : 500,
					msg : "编辑成功！",
					title : "提示"
				});
				dispostData(orgid);
				// 插入日志
				insertLog(adminid, 1, "编辑加盟商银行帐号:" + accountIdcode, "加盟商列表");
			}else{
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
function delAccount() {
	// 获得选中的项
	var row = $("#merchantaccountdg").datagrid("getSelected");
	if (row) {
		$.messager.confirm('请确认', '删除后加盟商将无法正常使用该卡!', function(b) {
			if (b) {
				id = row.id;
				$.ajax({
					url : '/gift-fly/system/fina/delOrgAccount',
					dataType : "json",
					type : "post",
					data : {
						id : id,
						adminid : adminid,
						node : "加盟商列表",
					},
					success : function(data) {
						if (data.status == "succeed") {
							$.messager.show({
								timeout : 500,
								msg : '删除成功',
								title : '提示',
							});
							dispostData(orgid);
							insertLog(adminid, 1, "删除加盟商银行帐号：" + row.accountIdcode, "加盟商列表");
						} else {
							$("#merchantaccountdg").datagrid('rejectChanges');
							$.messager.alert('错误', data.msg, 'error');
						}
					},
					error : function(err) {
						$.messager.alert('提示', '系统异常！', 'error');
					}
				});
			}
		});
	} else {
		$.messager.alert('提示', '请选择要删除的加盟商账户', 'warning');
	}
}