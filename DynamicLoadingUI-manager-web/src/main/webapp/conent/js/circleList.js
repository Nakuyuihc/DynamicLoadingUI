$(document).ready(function() {
	loginCheck1();
	var p = $('#circleListDg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [ 20, 30, 40 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			let staTime = $("#startTime").val();
			let endTime = $("#endTime").val();
			let nameOrPhone = $("#search_nameOrPhone").val();
			if (staTime != null && staTime != "") {
				staTime = staTime + " 00:00:00";
			}
			if (endTime != null && endTime != "") {
				endTime = endTime + " 23:59:59";
			}
			findCircleList(pageNumber, pageSize, nameOrPhone, staTime, endTime);
		},
	});
	let staTime = "";
	let endTime = "";
	findCircleList(1, 20, "", staTime, endTime)
	$("#search_schoolName").val("");
});
//分页查询
function findCircleList(page, rows, nameOrPhone, staTime, endTime) {
	if (staTime != null && staTime != "") {
		staTime = staTime + " 00:00:00";
	}
	if (endTime != null && endTime != "") {
		endTime = endTime + " 23:59:59";
	}
	var circleListService = new CircleListService();
	circleListService.findList(nameOrPhone, staTime, endTime, page, rows, function(data) {
		if (data.total != null && data.total != "") {
			var pageObjCircle = {
				total : data.total,
				rows : data.list
			};
			$('#circleListDg').datagrid('loaded');
			$("#circleListDg").datagrid('loadData', pageObjCircle);
		} else {
			nullData();
		}

	}, function(data) {
		nullData();
	})
}

function findCircleByNameOrPhone() {
	let staTime = $("#startTime").val();
	let endTime = $("#endTime").val();
	if (staTime != null && staTime != "") {
		staTime = staTime + " 00:00:00";
	}
	if (endTime != null && endTime != "") {
		endTime = endTime + " 23:59:59";
	}
	let nameOrPhone = $("#search_nameOrPhone").val();
	var p = $('#circleListDg').datagrid('getPager');
	var options = p.data("pagination").options;
	var rows = options.pageSize;
	findCircleList(1, rows, nameOrPhone, staTime, endTime);
}

function nullData() {
	var pageObjCircle = {
		total : 0,
		rows : []
	};
	$('#circleListDg').datagrid('loaded');
	$("#circleListDg").datagrid('loadData', pageObjCircle);
}
function circleDetailInfo() {
	var row = $("#circleListDg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的圈子记录', 'warning');
		return;
	}
	let id = row.id;
	var circleListService = new CircleListService();
	circleListService.findCircleDitail(id, function(data) {
		if (data.status == "succeed") {
			if (data.entity) {
				$('#td_userId').html("");
				$('#td_userName').html("");
				$('#td_Mobile').html("");
				$('#td_CreatedAt').html("");
				$('#td_CommentNum').html("");
				$('#td_PraiseNum').html("");
				$('#td_PraiseNum').html("");
				$('#td_GiftNum').html("");
				$('#td_Content').html("");
				$('#commList li').remove();
				$('#img_div1 img').remove();
				$('#img_div2 img').remove();
				$('#img_div3 img').remove();
				$("#authorImg").attr("src", "/gift-fly/common/images/img.jpg");
				let imagePathArray = data.entity.imagePath.split(',');
				let imageDiv1 = "";
				let imageDiv2 = "";
				let imageDiv3 = "";
				//console.log(imagePathArray)
				for (var i = 0; i < imagePathArray.length; i++) {
					if(imagePathArray[i]!="" && imagePathArray[i]!=null){
						if (i < 3) {
							imageDiv1 += '<img class="authorImagePath" alt="" src="' + imagePathArray[i] + '">';
						} else if (i >= 3 && i <= 5) {
							imageDiv2 += '<img class="authorImagePath" alt="" src="' + imagePathArray[i] + '">';
						}else{
							imageDiv3 += '<img class="authorImagePath" alt="" src="' + imagePathArray[i] + '">';
						}
					}
				}
				if(data.entity.authorImagePath!="" && data.entity.authorImagePath!=null){
					$("#authorImg").attr("src", data.entity.authorImagePath);
				}
				$("#img_div1").append(imageDiv1);
				$("#img_div2").append(imageDiv2);
				$("#img_div3").append(imageDiv3);
				$("#td_userId").append(data.entity.authorId);
				$("#td_userName").append(data.entity.authorName);
				$("#td_Mobile").append(data.entity.mobile);
				$("#td_CreatedAt").append(data.entity.createdAt);
				$("#td_CommentNum").append(data.entity.commentNum);
				$("#td_PraiseNum").append(data.entity.praiseNum);
				$("#td_GiftNum").append(data.entity.giftNum);
				$("#td_Content").append(data.entity.content);
				if (data.entity.commList.length > 0) {
					for (var i = 0; i < data.entity.commList.length; i++) {
						let item = data.entity.commList[i];
						var str = "";
						if (item.beUserName != null && item.beUserName != "") {
							str = '@' + item.beUserName + ':' + item.content;
						} else {
							str = item.content;
						}
						$("#commList").append('<li>' +
							'<div style="display: flex;justify-content: space-between;">' +
							'<div style="width: 60px;height: 60px;display: flex;justify-content:center;">' +
							'	<img style="width: 50px;height: 50px;display:inline-block;"alt=""' +
							'		src="'+item.imagePath+'">' +
							'</div>' +
							'<div>' +
							'	<div style="display: flex;justify-content: space-between;">' +
							'		<div>' + item.name + '</div>' +
							'		<div>' + item.comTime + '</div>' +
							'	</div>' +
							'	<div style="width:660px;display:block;word-break: break-all;word-wrap: break-word;">' +
							str +
							'	</div>' +
							'</div>' +
							'</div>' +
							'</li>');
					}

				}
			}
			$("#showCircledetailInfo").dialog("open");
		} else {
			$.messager.alert('提示', '请求出错', 'warning');
		}

	}, function(data) {
		$.messager.alert('提示', '请求出错', 'warning');
	})

}
function deleteCircle() {
	var row = $("#circleListDg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的圈子记录', 'warning');
		return;
	}
	let id = row.id;
	var circleListService = new CircleListService();
	circleListService.deleteCircle(id, function(data) {
		if (data.status == "succeed") {
			$.messager.alert('提示', '删除成功', 'warning');
			initDataCircle();
		}
	}, function(data) {
		$.messager.alert('提示', '请求失败', 'warning');
		initDataCircle();
	});
}
function initDataCircle() {
	var p = $('#circleListDg').datagrid('getPager');
	var options = p.data("pagination").options;
	var rows = options.pageSize;
	let staTime = $("#startTime").val();
	let endTime = $("#endTime").val();
	let nameOrPhone = $("#search_nameOrPhone").val();
	findCircleList(1, rows, nameOrPhone, staTime, endTime)
}
function formatterCZ(value, row, index) {
	return '<a href="javascript:circleDetailInfo();" class="audit">查看信息</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
		'<a href="javascript:deleteCircle();" class="audit">删除</a>';
}
//清除搜索框
function clearSerachbox(value, name) {
	if (value == null || value == "") {
		return;
	}
	$('#search_nameOrPhone').searchbox('clear');
	var p = $('#circleListDg').datagrid('getPager');
	var options = p.data("pagination").options;
	var rows = options.pageSize;
	findCircleList(1, rows, 1, "");
}
//接口请求服务
function CircleListService() {
	// 请求url
	this.selectUrl = "system/wb/findCircleList";
	this.delUrl = "system/wb/deleteCircle";
	this.findDitailUrl = "system/wb/findCircleDitail";
}
CircleListService.prototype = {
	findList : function(nameOrPhone, staTime, endTime, page, rows, successFun, errorFun) {
		var params = {
			nameOrPhone : nameOrPhone,
			stratDate : staTime,
			endDate : endTime,
			page : page,
			rows : rows
		};
		new RequestService().ajaxRequestPost(this.selectUrl, params,
			successFun, errorFun);
	},
	deleteCircle : function(id, successFun, errorFun) {
		let node = "圈子管理";
		let adminId = ReadCookie("adminid");
		var params = {
			node : node,
			adminid : adminId,
			id : id
		};
		new RequestService().ajaxRequestPost(this.delUrl, params,
			successFun, errorFun);
	},
	findCircleDitail : function(id, successFun, errorFun) {
		var params = {
			id : id
		};
		new RequestService().ajaxRequestPost(this.findDitailUrl, params,
			successFun, errorFun);
	},
}