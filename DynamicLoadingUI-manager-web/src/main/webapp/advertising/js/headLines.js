$(document).ready(function() {
	loginCheck1();
	var adp = $('#noticeListDg').datagrid('getPager');
	$(adp).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [ 15, 20, 25 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findNoticeList(pageNumber, pageSize, 1)
		},
	});
	findNoticeList(1, 15, 1);
	uploadupPicture();
});
//分页查询
function findNoticeList(page, rows, type) {
	let noticeService = new NoticeService();
	noticeService.findNoticeList(type, page, rows, function(data) {
		if (data.status == "succeed") {
			var pageObj = {
				total : data.total,
				rows : data.list
			};
			$('#noticeListDg').datagrid('loaded');
			$("#noticeListDg").datagrid('loadData', pageObj);
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
	$('#noticeListDg').datagrid('loaded');
	$("#noticeListDg").datagrid('loadData', pageObj);
}
function formatterCZ(value, row, index) {
	return '<a href="javascript:updateNoticeDialogShow();" class="audit">查看信息</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
	'<a href="javascript:deleteNotic();" class="audit">删除</a>';
}
var signNotice = 0;
function addNoticeDialogShow() {
	signNotice = 2;
	$("#showPic img").remove();
	$("#upPicture").textbox("setText", "");
	$('#noticeTitle').textbox('setValue', "");
	$('#addNotice').dialog('open');
}
var noticeId = 0;
function updateNoticeDialogShow() {
	signNotice = 1;
	let row = $("#noticeListDg").datagrid("getSelected");
	upPictureUrl = row.imageUrl;
	image_id = row.converedImageId;
	noticeId = row.id;
	$("#showPic img").remove();
	$("#upPicture").textbox("setText", "");
	if (upPictureUrl != null && upPictureUrl != "") {
		$("#upPicture").textbox("setText", upPictureUrl);
		$("#showPic").append(
			'<img src="' + upPictureUrl + '"style="width: 100px;height:100px;">' +
			'<img onclick="delPic()" style="position:absolute;top:10px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
	}
	$('#noticeTitle').textbox('setValue', row.title);
	editor.html(row.content);
	$('#addNotice').dialog('open');
}
function addNotice() {
	let afInfo = $("#addNoticeFrom").serializeArray();
	let title = afInfo[0].value;
	if (title == "" || title == null) {
		$.messager.alert('提示', "标题不能为空", 'warning');
		return;
	}
	let content = editor.html();
	if (content == "" || content == null) {
		$.messager.alert('提示', "内容不能为空", 'warning');
		return;
	}
	let sender_name = ReadCookie("username");
	let convered_image_id = image_id;
	let type = 1;
	let id = 0;
	if (signNotice == 1) {
		id = noticeId;
	}
	let noticeService = new NoticeService();
	noticeService.addOrUpdate(id, title, content, type, sender_name, convered_image_id, function(data) {
		if (data.status == "succeed") {
			$('#addNotice').dialog('close');
			findNoticeList(1, 15, 1);
			$.messager.show({
				timeout : 500,
				msg : "操作成功！",
				title : "提示"
			});
			noticeId = 0;
		}
	}, function(data) {
		$.messager.alert('提示', data.msg, 'warning');
	})
}
function deleteNotic() {
	var row = $("#noticeListDg").datagrid("getSelected");
	if (row) {
		$.messager.confirm('请确认', '即将删除这条公告信息', function(a) {
			if (a) {
				let id = row.id;
				let noticeService = new NoticeService();
				noticeService.deleteNotic(id, function(data) {
					if (data.status == "succeed") {
						findNoticeList(1, 15, 1);
						$.messager.show({
							timeout : 500,
							msg : "删除成功！",
							title : "提示"
						});
					}
				}, function(data) {
					$.messager.alert('提示', data.msg, 'warning');
				})
			}
		})
	} else {
		$.messager.alert('提示', '请选择需要删除的广告信息列', 'warning');
	}
}
var upPictureUrl = "";
var image_id = 0;
//编辑后的logo上传
function uploadupPicture() {
	$('#upPicture').filebox({
		buttonText : '选择图片',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			var xhr = new XMLHttpRequest(); //第一步    
			var file = document.getElementById('filebox_file_id_1').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			//post方式    
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			//发送请求    
			xhr.send(formData); //第三步骤    
			//ajax返回    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					if (upPictureUrl != null) {
						$.ajax({
							url : '/gift-fly/system/upload/delImg',
							dataType : "json",
							type : "post",
							data : {
								url : upPictureUrl,
								id : image_id,
							},
						});
						$("#showPic img").remove();
					}
					upPictureUrl = jQuery.parseJSON(xhr.responseText).url;
					image_id = jQuery.parseJSON(xhr.responseText).id;
					$("#showPic").append(
						'<img src="' + upPictureUrl + '"style="width:145px;height:100px;">' +
						'<img onclick="delPic()" style="position:absolute;top:0;left:145px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
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
function delPic() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : upPictureUrl,
			id : image_id,
		},
	});
	$("#showPic img").remove();
	$('#upPicture').textbox('initValue');
}
//接口请求服务
function NoticeService() {
	// 请求url
	this.selectUrl = "system/cms/queryArticleByType";
	this.addOrUpdateUrl = "system/cms/insertAndUpdateArticle";
	this.delUrl = "system/cms/delArticle";
}
;
NoticeService.prototype = {
	findNoticeList : function(type, page, rows, successFun, errorFun) {
		var params = {
			type : type,
			page : page,
			rows : rows
		};
		new RequestService().ajaxRequestPost(this.selectUrl, params,
			successFun, errorFun);
	},
	deleteNotic : function(id, successFun, errorFun) {
		let adminid = ReadCookie("adminid");
		let node = "公告";
		var params = {
			adminid : adminid,
			node : node,
			id : id
		};
		new RequestService().ajaxRequestPost(this.delUrl, params,
			successFun, errorFun);
	},
	addOrUpdate : function(id, title, content, type, sender_name, convered_image_id, successFun, errorFun) {
		let editor = ReadCookie("username");
		let adminid = ReadCookie("adminid");
		let node = "公告";
		var params = {
			adminid : adminid,
			node : node,
			id : id,
			title : title,
			content : content,
			type : type,
			senderName : sender_name,
			converedImageId : convered_image_id
		};
		new RequestService().ajaxRequestPost(this.addOrUpdateUrl, params,
			successFun, errorFun);
	},
}