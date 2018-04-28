$(document).ready(function() {
	loginCheck1();
	var p = $('#fbDg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [ 20, 30, 40 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页 共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录 共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			let status = $('#cmbStatus').combobox('getValue');
			let staTime = $("#startTime").val();
			let endTime = $("#endTime").val();
			if (staTime != null && staTime != "") {
				staTime = staTime + " 00:00:00";
			}
			if (endTime != null && endTime != "") {
				endTime = endTime + " 23:59:59";
			}
			findFbList(staTime, endTime, status, pageNumber, pageSize);
		}
	});
	let staTime = "";
	let endTime = "";
	findFbList(staTime, endTime, -1, 1, 20);

/*$("#cmbStatus").combobox({
	onChange : function() {
		var status = $('#cmbStatus').combobox('getValue');
		findFbList(status, 1, 20);
	}
})*/
});

function findFbListByStatus() {
	let status = $('#cmbStatus').combobox('getValue');
	let staTime = $("#startTime").val();
	let endTime = $("#endTime").val();
	if (staTime != null && staTime != "") {
		staTime = staTime + " 00:00:00";
	}
	if (endTime != null && endTime != "") {
		endTime = endTime + " 23:59:59";
	}
	findFbList(staTime, endTime, status, 1, 20);
}
// 分页查询
function findFbList(staTime, endTime, status, page, rows) {
	var feefbackService = new FeefbackService();
	feefbackService.findList(staTime, endTime, status, page, rows, function(data) {
		if (data.status == "succeed") {
			var pageObj = {
				total : data.total,
				rows : data.list
			};
			$('#fbDg').datagrid('loaded');
			$("#fbDg").datagrid('loadData', pageObj);
		} else {
			$.messager.alert('提示', '数据库没有数据', 'warning');
			nullData();
		}

	}, function(data) {
		$.messager.alert('提示', '请求后台失败', 'warning');
		nullData();
	})
}

function nullData() {
	var pageObjFb = {
		total : 0,
		rows : []
	};
	$('#fbDg').datagrid('loaded');
	$("#fbDg").datagrid('loadData', pageObjFb);
}
function updateStatus() {
	var row = $("#fbDg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的圈子记录', 'warning');
		return;
	}
	let id = row.id;
	var feefbackService = new FeefbackService();
	feefbackService.updateStatus(id, function(data) {
		if (data.status == "succeed") {
			findFbListByStatus();
			$.messager.alert('提示', '操作成功', 'warning');
		} else {
			$.messager.alert('提示', '操作失败', 'warning');
		}
	}, function(data) {
		$.messager.alert('提示', '请求后台失败', 'warning');
	})
}
function formatterImg(value, row, index) {
	var html = '<div class="imgDiv">'
	if (value != null && value != "") {
		var array = value.split(",");
		for (var i = 0; i < array.length; i++) {
			html += '<img class = "imgFt" src="' + array[i] + '"/>'
		}
	}
	html += '</div>';
	return html;
}
function formatterCZ(value, row, index) {
	if (value == 0) {
		return '<a href="javascript:updateStatus();" class="audit">标志为已读</a>';
	}
	return "";
}
// 接口请求服务
function FeefbackService() {
	// 请求url
	this.selectUrl = "system/cms/feedbackList";
	this.updateUrl = "system/cms/updateFeedbackStatus";
}
;
FeefbackService.prototype = {
	findList : function(staTime, endTime, status, page, rows, successFun, errorFun) {
		var params = {
			staTime : staTime,
			endTime : endTime,
			status : status,
			page : page,
			rows : rows
		};
		new RequestService().ajaxRequestPost(this.selectUrl, params,
			successFun, errorFun);
	},
	updateStatus : function(id, successFun, errorFun) {
		let node = "意见反馈";
		let status = 1;
		let adminId = ReadCookie("adminid");
		var params = {
			adminid : adminId,
			node : node,
			id : id,
			status : status
		};
		new RequestService().ajaxRequestPost(this.updateUrl, params,
			successFun, errorFun);
	}
}