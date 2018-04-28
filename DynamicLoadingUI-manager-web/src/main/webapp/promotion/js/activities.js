//分页查询
function findActivitieList(page, rows) {
	let activitieService = new ActivitieService();
	activitieService.findList(page, rows, function(data) {
		if (data.status == "succeed") {
			var pageObj = {
				total : data.total,
				rows : data.list
			};
			$('#activitieListDg').datagrid('loaded');
			$("#activitieListDg").datagrid('loadData', pageObj);
		} else {
			$.messager.alert('提示', '后台没有数据', 'warning');
			nullData();
		}

	}, function(data) {
		$.messager.alert('提示', '请求后台失败', 'warning');
		nullData();
	})
}
function nullData() {
	let pageObj = {
		total : 0,
		rows : []
	};
	$('#activitieListDg').datagrid('loaded');
	$("#activitieListDg").datagrid('loadData', pageObj);
}
//分页查询
function findSkuList(seachKey, page, rows) {
	let activitieService = new ActivitieService();
	activitieService.findSkuList(seachKey, page, rows, function(data) {
		if (data.status == "succeed") {
			var pageObj = {
				total : data.total,
				rows : data.list
			};
			$('#allProdListDg').datagrid('loaded');
			$("#allProdListDg").datagrid('loadData', pageObj);
		} else {
			$.messager.alert('提示', '后台没有数据', 'warning');
		}

	}, function(data) {
		$.messager.alert('提示', '请求后台失败', 'warning');
	})
}
var activitieId = 0;
function addActivitieDialogShow() {
	activitieId = 0;
	$("#showPic img").remove();
	$('#upPicture').textbox('initValue');
	$('#title').textbox('setValue', '');
	$('#actionContent').textbox('setValue', '');
	$('#description').textbox('setValue', '');
	$('#publicAt').val(formatTime(new Date()));
	$('#expireAt').val(formatTime(new Date()));
	$('#acceptAt').val(formatTime(new Date()));
	$('#deadlineAt').val(formatTime(new Date()));
	let pageObj = {
		total : 0,
		rows : []
	};
	$('#waresListDg').datagrid('loaded');
	$("#waresListDg").datagrid('loadData', pageObj);
	$('#addActivities').dialog('open');
}
function upActivitieShow() {
	var row = $("#activitieListDg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要编辑的记录', 'warning');
		return;
	}
	signAct = 1;
	activitieId = row.id;
	$("#showPic img").remove();
	$('#upPicture').textbox('setText', row.imageUrl);
	$("#showPic").append(
		'<img src="' + row.imageUrl + '"style="width: 100px;height:100px;">' +
		'<img onclick="delPic()" style="position:absolute;top:10px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
	$('#title').textbox('setValue', row.title);
	$('#actionContent').textbox('setValue', row.actionContent);
	$('#description').textbox('setValue', row.description);
	$('#cmbType').combobox('setValue', row.type);
	$('#publicAt').val(formatTime(row.publicAt));
	$('#expireAt').val(formatTime(row.expireAt));
	$('#acceptAt').val(formatTime(row.acceptAt));
	$('#deadlineAt').val(formatTime(row.deadlineAt));

	/*$('#add_Activitiesfrom').form('load', {
		title : row.title,
		dept : row.type,
		publicAt : row.publicAt,
		expireAt : row.expireAt,
		acceptAt : row.acceptAt,
		deadlineAt : row.deadlineAt,
		actionContent : row.deadlineAt,
	});*/
	upPictureUrl = row.imageUrl;
	imageId = row.imageId;
	var p = $('#waresListDg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10, 20, 30 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			waresList(activitieId, pageNumber, pageSize);
		},
	});
	waresList(activitieId, 1, 10);
	$('#addActivities').dialog('open');
	id = row.id;
}
function waresList(prid, page, rows) {
	let pageObj = {
		total : 0,
		rows : []
	};
	$('#waresListDg').datagrid('loaded');
	$("#waresListDg").datagrid('loadData', pageObj);
	let activitieService = new ActivitieService();
	activitieService.findSkuListByPid(prid, page, rows, function(data) {
		if (data.status == "succeed") {
			for (var i = 0; i < data.list.length; i++) {
				data.list[i].id = data.list[i].kid;
				data.list[i].priceDiscount = data.list[i].activityPrice;
			}
			pageObj.total = data.total;
			pageObj.rows = data.list;
		} else {
			$.messager.alert('提示', '查询失败', 'warning');
		}
		$('#waresListDg').datagrid('loaded');
		$("#waresListDg").datagrid('loadData', pageObj);
	}, function(data) {
		$.messager.alert('提示', '请求后台失败', 'warning');
	})
}
function addProd() {
	// 判断表单是否通过验证
	var valid = $('#add_Activitiesfrom').form('validate');
	if (!valid) {
		return valid;
	}
	// 获取表单af中的值并转化
	var afInfo = $("#add_Activitiesfrom").serializeArray();
	var title = afInfo[0].value;
	var type = afInfo[1].value;
	var publicAt = afInfo[2].value;
	var expireAt = afInfo[3].value;
	var acceptAt = afInfo[4].value;
	var deadlineAt = afInfo[5].value;
	var actionContent = afInfo[6].value;
	var description = afInfo[7].value;
	var adjustType = afInfo[8].value;
	var adjustprice = afInfo[9].value;
	var rows = $("#waresListDg").datagrid("getRows");
	let skuList = JSON.stringify(rows);
	if (publicAt == "" || publicAt == null) {
		$.messager.alert('提示', '请选择公布时间', '');
		return;
	}
	if (expireAt == "" || expireAt == null) {
		$.messager.alert('提示', '请选择过期时间', '');
		return;
	}
	if (acceptAt == "" || acceptAt == null) {
		$.messager.alert('提示', '请选择开始时间', '');
		return;
	}
	if (deadlineAt == "" || deadlineAt == null) {
		$.messager.alert('提示', '请选择截止时间', '');
		return;
	}
	let id = 0;
	if (signAct = 1) {
		id = activitieId;
	}

	let activitieService = new ActivitieService();
	activitieService.addOrUpdate(skuList, id, title, actionContent, description, type, imageId, publicAt, expireAt, acceptAt, deadlineAt, adjustType, adjustprice, function(data) {
		if (data.status == "succeed") {
			$('#addActivities').dialog('close');
			$('#activitieListDg').datagrid('getPager').pagination('select');
			$.messager.show({
				timeout : 500,
				msg : "操作成功！",
				title : "提示"
			});
			let adminId = ReadCookie("adminid");
			// 插入日志
			insertLog(adminId, 1, "操作活动" + title, "专区活动");

		} else {
			$.messager.alert('提示', data.msg, 'warning');
		}
	}, function(data) {
		$.messager.alert('提示', '请求后台失败', 'warning');
	})
}
function deleteProm() {
	var row = $("#activitieListDg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要删除的记录', 'warning');
		return;
	}
	$.messager.confirm('请确认', '你确定要删除这条记录吗？', function(b) {
		if (b) {
			let id = row.id;
			var activitieService = new ActivitieService();
			activitieService.del(id, function(data) {
				if (data.status == "succeed") {
					$('#activitieListDg').datagrid('getPager').pagination('select');
					$.messager.show({
						timeout : 500,
						msg : "操作成功！",
						title : "提示"
					});
					let adminId = ReadCookie("adminid");
					// 插入日志
					insertLog(adminId, 1, "删除活动" + row.title, "专区活动");
				} else {
					$.messager.alert('提示', data.msg, 'warning');
				}
			}, function(data) {
				$.messager.alert('提示', '请求后台失败', 'warning');
			})
		}
	});
}
function deleteSku() {
	let row = $("#waresListDg").datagrid('getSelected');
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要删除的记录', 'warning');
		return;
	}
	$.messager.confirm('请确认', '你确定要删除这条记录吗？', function(b) {
		if (b) {
			let promId = activitieId;
			let k = $('#waresListDg').datagrid('getRowIndex', row);
			if (promId > 0) {
				let skuId = row.id;
				var activitieService = new ActivitieService();
				activitieService.delSku(promId, skuId, function(data) {
					if (data.status == "succeed") {
						$('#activitieListDg').datagrid('getPager').pagination('select');
						$.messager.show({
							timeout : 500,
							msg : "操作成功！",
							title : "提示"
						});
						$("#waresListDg").datagrid('deleteRow', k); //根据索引删除对应的行。
						let adminId = ReadCookie("adminid");
						// 插入日志
						insertLog(adminId, 1, "删除" + promId + "的活动商品:" + skuId, "专区活动");
					} else {
						$.messager.alert('提示', data.msg, 'warning');
					}
				}, function(data) {
					$.messager.alert('提示', '请求后台失败', 'warning');
				})
			} else {
				$("#waresListDg").datagrid('deleteRow', k); //根据索引删除对应的行。
			}
		}
	});

}
function allProdDialogShow() {
	$('#allProdList').dialog('open');
	var p = $('#allProdListDg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10, 20, 30 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			let seachKey = $("#searchPromId").val();
			findSkuList(seachKey, pageNumber, pageSize);
		},
	});
	findSkuList("", 1, 10);
}
function findPromById() {
	let seachKey = $("#searchPromId").val();
	if (seachKey == null || seachKey == "") {
		return;
	}
	findSkuList(seachKey, 1, 10);
}
function confirChoice() {
	var checkedItems = $('#allProdListDg').datagrid('getChecked');
	var names = [];
	$.each(checkedItems, function(index, item) {
		//names.push(item);
		console.log(item);
	});
	var rows = $("#waresListDg").datagrid("getRows");
	let arrayItems = checkedItems.concat(rows);
	arrayItems = arrayItems.distinct(); //再引用上面的任意一个去重方法
	/*let ids = names.join(",");*/
	let pageObj = {
		total : arrayItems.length,
		rows : arrayItems
	};
	$('#waresListDg').datagrid({
		pagination : false
	});
	$('#waresListDg').datagrid('loaded');
	$("#waresListDg").datagrid('loadData', pageObj);
	$('#allProdList').dialog('close');
}
Array.prototype.distinct = function() {
	var arr = this,
		result = [],
		i,
		j,
		len = arr.length;
	for (i = 0; i < len; i++) {
		for (j = i + 1; j < len; j++) {
			if (arr[i].id == arr[j].id) {
				j = ++i;
			}
		}
		result.push(arr[i]);
	}
	return result;
}
function formatterCZ(value, row, index) {
	return '<a href="javascript:upActivitieShow();" class="audit">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
		'<a href="javascript:deleteProm();" class="audit">删除</a>';
}
function formatterPCZ(value, row, index) {
	return '<a href="javascript:deleteSku();" class="audit">删除</a>';
}
;
function formatterZT(value, row, index) {
	if (value == 1) {
		return "上架状态";
	} else {
		return "下架状态";
	}
}
;
//清除搜索框
function clearSerachbox(value, name) {
	if (value == null || value == "") {
		return;
	}
	$('#searchPromId').searchbox('clear');
	findSkuList("", 1, 10);
}
;
var upPictureUrl = "";
var imageId = "";
//编辑后的logo上传
function uploadupPicture() {
	$('#upPicture').filebox({
		buttonText : '选择图片',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			var xhr = new XMLHttpRequest(); //第一步    
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			var file = document.getElementById('filebox_file_id_1').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			xhr.send(formData); //第三步骤    
			//ajax返回    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					/*if (upPictureUrl != null && imageId != null) {
						$.ajax({
							url : '/gift-fly/system/upload/delImg',
							dataType : "json",
							type : "post",
							data : {
								url : upPictureUrl,
								id : imageId,
							},
						});
					}*/
					$("#showPic img").remove();
					upPictureUrl = jQuery.parseJSON(xhr.responseText).url;
					imageId = jQuery.parseJSON(xhr.responseText).id;
					$("#showPic").append(
						'<img src="' + upPictureUrl + '"style="width: 135px;height:90px;">' +
						'<img onclick="delPic()" style="position:absolute;top:2px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
				}
			};
			//设置超时时间    
			xhr.timeout = 6000;
			xhr.ontimeout = function(event) {
				alert('请求超时！');
			}
		}
	});
}
;
function delPic() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : upPictureUrl,
			id : imageId,
		},
	});
	$("#showPic img").remove();
	$('#upPicture').textbox('initValue');
}
;
//接口请求服务
function ActivitieService() {
	// 请求url
	this.selectUrl = "system/prom/findPromInfoList";
	this.selectSkuUrl = "system/mallWeb/getSkuList";
	this.selectSkuListByPromIdUrl = "system/mallWeb/getSkuListByProm";
	this.addOrUpdateUrl = "system/prom/addOrUpdatePromInfo";
	this.delUrl = "system/prom/delete";
	this.delSkuUrl = "system/prom/deleteSku";
}
;
ActivitieService.prototype = {
	findList : function(page, rows, successFun, errorFun) {
		var params = {
			page : page,
			rows : rows
		};
		new RequestService().ajaxRequestPost(this.selectUrl, params,
			successFun, errorFun);
	},
	findSkuList : function(seachKey, page, rows, successFun, errorFun) {
		//var orgId = ReadCookie("orgId");
		var params = {
			page : page,
			rows : rows,
			skuIdList : seachKey
		};
		new RequestService().ajaxRequestPost(this.selectSkuUrl, params,
			successFun, errorFun);
	},
	findSkuListByPid : function(promId, page, rows, successFun, errorFun) {
		//var orgId = ReadCookie("orgId");
		var params = {
			page : page,
			rows : rows,
			promId : promId
		};
		new RequestService().ajaxRequestPost(this.selectSkuListByPromIdUrl, params,
			successFun, errorFun);
	},
	addOrUpdate : function(skuList, id, title, actionContent, description, type, imageId, publicAt, expireAt, acceptAt, deadlineAt, adjustType, adjustprice, successFun, errorFun) {
		let node = "专区活动";
		let adminId = ReadCookie("adminid");
		var params = {
			node : node,
			adminid : adminId,
			skuList : skuList,
			id : id,
			title : title,
			actionContent : actionContent,
			description : description,
			type : type,
			imageId : imageId,
			publicAt : publicAt,
			expireAt : expireAt,
			acceptAt : acceptAt,
			deadlineAt : deadlineAt,
			adjustType : adjustType,
			adjustprice : adjustprice
		};
		new RequestService().ajaxRequestPost(this.addOrUpdateUrl, params,
			successFun, errorFun);
	},
	del : function(id, successFun, errorFun) {
		let node = "专区活动";
		let adminId = ReadCookie("adminid");
		var params = {
			adminid : adminId,
			node : node,
			id : id
		};
		new RequestService().ajaxRequestPost(this.delUrl, params,
			successFun, errorFun);
	},
	delSku : function(promId, skuId, successFun, errorFun) {
		let node = "专区活动";
		let adminId = ReadCookie("adminid");
		var params = {
			adminid : adminId,
			node : node,
			promId : promId,
			skuId : skuId
		};
		new RequestService().ajaxRequestPost(this.delSkuUrl, params,
			successFun, errorFun);
	}
};
/**
 * 验证扩展
 */
$.extend($.fn.validatebox.defaults.rules, {
	length : {
		validator : function(value, param) {
			var len = $.trim(value).length;
			return len >= param[0] && len <= param[1];
		},
		message : "输入内容长度必须介于{0}和{1}之间！"
	},
	maxlength : {
		validator : function(value, param) {
			return value.length < param[0] + 1;
		},
		message : "不可超过{0}个字符！"
	}
});