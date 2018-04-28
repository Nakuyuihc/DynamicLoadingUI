$(document).ready(function() {
	loginCheck1();
	var p = $('#evalListDg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [ 20, 30, 40 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			console.log("onSelectPage")
			var searchName = $("#searchName").val();
			var action = $('#cmbAction').combobox('getValue');
			findEvalList(pageNumber, pageSize, action, searchName);
		},
	});
	findEvalList(1, 20, 1, "")
	$("#cmbAction").combobox({
		onChange : function(n, o) {
			if (n == 1) {
				$('#searchName').searchbox({
					prompt : '请输入加盟商名称进行查询'
				});
			} else {
				$('#searchName').searchbox({
					prompt : '请输入商品名称进行查询'
				});
			}
		}
	});
	$('#evalListDg').datagrid({
		checkOnSelect : true,
		singleSelect : false
	})
});
function showOrCloseEval(action) {
	var checkedItems = $('#evalListDg').datagrid('getChecked');
	var names = [];
	$.each(checkedItems, function(index, item) {
		names.push(item.id);
	});
	let ids = names.join(",");
	if (action == 1) {
		showOrClose(ids, 1);
	} else {
		showOrClose(ids, 0);
	}
}
function showOrClose(ids, status) {
	if (ids == undefined || ids == '' || ids == null) {
		$.messager.alert('提示', '请选择需要操作的记录', 'warning');
		return;
	}
	let evaluateListService = new EvaluateListService();
	evaluateListService.updateStatus(ids, status, function(data) {
		if (data.status == "succeed") {
			$.messager.alert('提示', '操作成功', 'warning');
			let p = $('#evalListDg').datagrid('getPager');
			let options = p.data("pagination").options;
			let rows = options.pageSize;
			let page = options.pageNumber;
			let action = $('#cmbAction').combobox('getValue');
			let search_Name = $("#searchName").val();
			findEvalList(page, rows, action, search_Name);
		} else {
			$.messager.alert('提示', '操作失败', 'warning');
		}
	}, function(data) {
		$.messager.alert('提示', '请求后台失败', 'warning');
	})
}
//分页查询
function findEvalList(page, rows, action, name) {
	var evaluateListService = new EvaluateListService();
	evaluateListService.findList(name, action, page, rows, function(data) {
		if (data.status == "succeed") {
			var p = $('#evalListDg').datagrid('getPager');
			$(p).pagination({
				pageNumber : 1,
				pageSize : 20,
				pageList : [ 20, 30, 40 ],
				beforePageText : '第', // 页数文本框前显示的汉字
				afterPageText : '页    共 {pages} 页',
				displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
				onSelectPage : function(pageNumber, pageSize) {
					var searchName = $("#searchName").val();
					var action = $('#cmbAction').combobox('getValue');
					findEvalList(pageNumber, pageSize, action, searchName);
				},
			});
			let pageObj = {
				total : data.total,
				rows : data.list
			};
			$('#evalListDg').datagrid('loaded');
			$("#evalListDg").datagrid('loadData', pageObj);
		} else {
			nullData();
		}

	}, function(data) {
		nullData();
	})
}
function nullData() {
	let pageObj = {
		total : 0,
		rows : []
	};
	$('#evalListDg').datagrid('loaded');
	$("#evalListDg").datagrid('loadData', pageObj);
}

function findEcalListByNameAndAction() {
	let search_Name = $("#searchName").val();
	let action = $('#cmbAction').combobox('getValue');
	let p = $('#evalListDg').datagrid('getPager');
	let options = p.data("pagination").options;
	let rows = options.pageSize;
	findEvalList(1, rows, action, search_Name);
}
function showEvalDetailInfo() {
	var row = $("#evalListDg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要评价记录', 'warning');
		return;
	}
	$("#div_head_image_Path").attr("src", "/gift-fly/common/images/img.jpg");
	if (row.image != null && row.image != "") {
		$("#div_head_image_Path").attr("src", row.image);
	}
	let head = row.nickName + "&nbsp;于 &nbsp;" + formatTime(row.createdAt) + "&nbsp;对&nbsp;" + row.prodName + "&nbsp;发表了评价";
	$('#head').html("");
	$('#div_content').html("");
	$("#head").append(head);
	$("#div_content").append(row.content);
	$("#star1").attr("src", "img/star.png");
	$("#star2").attr("src", "img/star.png");
	$("#star3").attr("src", "img/star.png");
	$("#star4").attr("src", "img/star.png");
	$("#star5").attr("src", "img/star.png");
	if (row.starNum == 1) {
		$("#star1").attr("src", "img/star_red.png"); //第一颗星星亮起来，下面以此类推
	} else if (row.starNum == 2) {
		$("#star1").attr("src", "img/star_red.png");
		$("#star2").attr("src", "img/star_red.png");
	} else if (row.starNum == 3) {
		$("#star1").attr("src", "img/star_red.png");
		$("#star2").attr("src", "img/star_red.png");
		$("#star3").attr("src", "img/star_red.png");
	} else if (row.starNum == 4) {
		$("#star1").attr("src", "img/star_red.png");
		$("#star2").attr("src", "img/star_red.png");
		$("#star3").attr("src", "img/star_red.png");
		$("#star4").attr("src", "img/star_red.png");
		$("#star5").attr("src", "img/star.png");
	} else if (row.starNum == 5) {
		$("#star1").attr("src", "img/star_red.png");
		$("#star2").attr("src", "img/star_red.png");
		$("#star3").attr("src", "img/star_red.png");
		$("#star4").attr("src", "img/star_red.png");
		$("#star5").attr("src", "img/star_red.png");
	}
	$('#showEvalDetailInfo').dialog('open');
}
function updateStatus(status) {
	let row = $("#evalListDg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要评价记录', 'warning');
		return;
	}
	let id = row.id;
	let evaluateListService = new EvaluateListService();
	evaluateListService.updateStatus(id, status, function(data) {
		if (data.status == "succeed") {
			$.messager.alert('提示', '操作成功', 'warning');
			let p = $('#evalListDg').datagrid('getPager');
			let options = p.data("pagination").options;
			let rows = options.pageSize;
			let page = options.pageNumber;
			let action = $('#cmbAction').combobox('getValue');
			let search_Name = $("#searchName").val();
			findEvalList(page, rows, action, search_Name);
		} else {
			$.messager.alert('提示', '操作失败', 'warning');
		}
	}, function(data) {
		$.messager.alert('提示', '请求后台失败', 'warning');
	})
}
//清除搜索框
function clearSerachbox(value, name) {
	if (value == null || value == "") {
		return;
	}
	$('#searchName').searchbox('clear');
	var p = $('#evalListDg').datagrid('getPager');
	var options = p.data("pagination").options;
	var rows = options.pageSize;
	findEvalList(1, rows, 1, "");
}
function formatterZT(value, row, index) {
	if (value == 1) {
		return '隐藏';
	} else {
		return '显示';
	}
}
function formatterCZ(value, row, index) {
	if (value == 1) {
		return '<a href="javascript:showEvalDetailInfo();" class="audit">查看信息</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
			'<a href="javascript:showOrCloseEval(0);" class="audit">显示</a>';
	} else {
		return '<a href="javascript:showEvalDetailInfo();" class="audit">查看信息</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
			'<a href="javascript:showOrCloseEval(1);" class="audit">隐藏</a>';
	}
}
//接口请求服务
function EvaluateListService() {
	// 请求url
	this.selectUrl = "system/cms/findCommentList";
	this.updaUrl = "system/cms/updateStatus";
}
EvaluateListService.prototype = {
	findList : function(name, action, page, rows, successFun, errorFun) {
		var params = {
			name : name,
			action : action,
			page : page,
			rows : rows
		};
		new RequestService().ajaxRequestPost(this.selectUrl, params,
			successFun, errorFun);
	},
	updateStatus : function(ids, status, successFun, errorFun) {
		let node = "用户评价";
		let adminId = ReadCookie("adminid");
		var params = {
			adminid : adminId,
			node : node,
			ids : ids,
			status : status
		};
		new RequestService().ajaxRequestPost(this.updaUrl, params,
			successFun, errorFun);
	},
}