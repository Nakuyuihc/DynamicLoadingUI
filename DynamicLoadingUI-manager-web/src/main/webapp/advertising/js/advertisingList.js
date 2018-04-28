$(document).ready(function() {
	loginCheck1();
	adcombobox();
	adtypecombobox();
	var adp = $('#adverListDg').datagrid('getPager');
	$(adp).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [ 15, 20, 25 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			let type = $('#cmb_Type').combobox('getValue');
			findAdverList(pageNumber, pageSize, type)
		},
	});
	findAdverList(1, 15, 1);
	uploadupPictureAd();
	//上传进度条
	progressBar();
});
//清除搜索框
function clearSerachbox(value, name) {
	if (value == null || value == "") {
		return;
	}
	$('#searchPromId').searchbox('clear');
}
var adminId = ReadCookie("adminid");
var action_content=null;
var upPictureUrlAd = "";
var image_id;
var adtype = 2;
function adcombobox() {
	$("#cmb_Type").combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		data : [
			{
				"id" : 1,
				"name" : "首页轮播广告",
				"selected" : true
			},
			{
				"id" : 8,
				"name" : "新人专区"
			},
			{
				"id" : 9,
				"name" : "首页公告"
			},
			{
				"id" : 2,
				"name" : "导航推荐广告"
			},
			{
				"id" : 3,
				"name" : "热门活动"
			},
			{
				"id" : 4,
				"name" : "选礼-节日推荐"
			},
			{
				"id" : 5,
				"name" : "选礼-优惠活动"
			} ],
		onChange : function(n, o) {
			findAdverList(1, 20, n);
		}
	});
}
function adtypecombobox() {
	$("#cmb_action_type").combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		data : [
			{
				"id" : 2,
				"name" : "商品信息广告",
				"selected" : true,
			},
			{
				"id" : 3,
				"name" : "促销活动广告"
			}, {
				"id" : 1,
				"name" : "网页跳转"
			}, {
				"id" : 8,
				"name" : "新人专区"
			}, {
				"id" : 9,
				"name" : "首页公告"
			}
		//			,{
		//				"id" : 6,
		//				"name" : "主题活动"
		//			}
		],
		onChange : function(n, o) {
			adtype = n;
			/*action_content = "";
			image_id = "";*/
			if (n == 2) {
				$('#jumpAddress').hide();
				$('.showprod').show();
			} else if (n == 3) {
				findPromInfoAllListByType(1, "");
			} else if (n == 9 || n == 8) {
				$('.showprod').hide();
				$('#jumpAddress').show();
				if (n == 9) {
					queryAllArticleByType(1, "");
				} else {
					findPromInfoAllListByType(2, "");
				}
			} else {
				$('.showprod').hide();
				$('#jumpAddress').hide();
				$('.showprodH').show();
			//findPromInfoAllListByType(1, "");
			}
		}
	});
}

function findPromInfoAllListByType(type, value) {
	$('.showprod').hide();
	$('#jumpAddress').show();
	$('.showprodH').hide();
	//获取所有活动链接
	$.ajax({
		url : '/gift-fly/system/prom/findPromInfoAllList',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			type : type
		},
		success : function(data) {
			$('#action_content').combobox({
				panelHeight : 'auto',
				valueField : 'actionContent',
				textField : 'title',
				data : data.list,
			});
			if (value == "") {
				$('#action_content').combobox('setValue', data.list[0].actionContent);
			} else {
				$('#action_content').combobox('setValue', value);
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
function queryAllArticleByType(type, value) {
	$('.showprod').hide();
	$('#jumpAddress').show();
	$('.showprodH').hide();
	//获取公告
	$.ajax({
		url : '/gift-fly/system/cms/queryAllArticleByType',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			type : type
		},
		success : function(data) {
			if (data.list.length > 0) {
				//for (var i = 0; i < data.list.length; ++i) {
				//	data.list[i].id = '/gift-fly/api/cms/article?id='+data.list[i].id;
				//}
				$('#action_content').combobox({
					panelHeight : 'auto',
					valueField : 'id',
					textField : 'title',
					data : data.list,
				});
				if (value == "") {
					$('#action_content').combobox('setValue', data.list[0].id);
				} else {
					$('#action_content').combobox('setValue', value);
				}
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
var sign = 0;
var adverId = 0;
var adId = 0;
//分页查询
function findAdverList(page, rows, type) {
	let adverService = new AdvrtService();
	adverService.findList(type, page, rows, function(data) {
		if (data.status == "succeed") {
			var pageObjSchool = {
				total : data.total,
				rows : data.list
			};
			if (type == 2 || type == 4 || type == 5) {
				$("#addAdverbuttom").hide();
			} else {
				$("#addAdverbuttom").show();
			}
			$('#adverListDg').datagrid('loaded');
			$("#adverListDg").datagrid('loadData', pageObjSchool);
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
	$('#adverListDg').datagrid('loaded');
	$("#adverListDg").datagrid('loadData', pageObj);
}
function addAdverDialogShow() {
	upPictureUrlAd = "";
	image_id = 0;
	sign = 2;
	$("#showPic img").remove();
	$("#upPicture").textbox("setValue", "");
	$('#cmb_status').combobox('setValue', 1);
	$('#action_content').textbox('setValue', '');
	$('#action_text').textbox('setValue', '');
	$('#start_time').val(formatTime(new Date()));
	$('#end_time').val(formatTime(new Date()));
	$('#sort').numberbox('setValue', 1);
	$('#addAdver').dialog('open');
}
function deleteAdver() {
	var row = $("#adverListDg").datagrid("getSelected");
	if (row) {
		$.messager.confirm('请确认', '即将删除这条广告信息', function(a) {
			if (a) {
				let id = row.id;
				let adverService = new AdvrtService();
				adverService.deleteAdver(id, function(data) {
					if (data.status == "succeed") {
						initDataAdver();
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
function addAdver() {
	if (adtype != 2) {
		action_content = $('#action_content').combobox('getValue');
	}
	if (action_content == '' || action_content == null) {
		action_content = "0";
	}
	let type = $('#cmb_Type').combobox('getValue');
	let typename = $('#cmb_Type').combobox('getText');
	let action_type = $('#cmb_action_type').combobox('getValue');
	let action_text = $('#action_text').val();
	let start_time = $('#start_time').val();
	let end_time = $('#end_time').val();
	let sort = $('#sort').val();
	let adverService = new AdvrtService();
	let status = $('#cmb_status').combobox('getValue');
	if (image_id == '' || image_id == 0) {
		$.messager.alert('提示', "请上传广告图片", '');
		return;
	}
	if (action_type == 1) {
		action_content = $("#action_contentH").val();
	}
	
	if (sign != 1) {
		adId = 0;
	}
	adverService.addOrUpdate(adId, status, image_id,
		type, action_type, action_content, action_text,
		start_time, end_time, sort, function(data) {
			if (data.status == "succeed") {
				$('#addAdver').dialog('close');
				$("#showPic img").remove();
				$("#upPicture").textbox("setValue", "");
				initDataAdver();
				$.messager.show({
					timeout : 500,
					msg : "操作成功！",
					title : "提示"
				});
				// 插入日志
				insertLog(adminId, 1, "新增或修改" + typename + "广告", "广告列表");
			} else {
				$.messager.alert('提示', data.msg, 'warning');
			}
		}, function(data) {
			$.messager.alert('提示', data.msg, 'warning');
		});
}

function showAdverDetailInfo() {
	sign = 1;
	var row = $("#adverListDg").datagrid("getSelected");
	$("#showPic img").remove();
	$("#upPicture").textbox("setValue", "");
	$("#action_contentH").textbox("setValue", "");
	if (row) {
		$('#cmb_status').combobox('setValue', row.status);
		$('#cmb_status').combobox('setValue', row.status);
		$('#cmb_action_type').combobox('setValue', row.action_type);
		$('#action_text').textbox('setValue', row.action_text);
		$('#start_time').val(formatTime(row.start_time));
		$('#end_time').val(formatTime(row.end_time));
		$('#sort').numberbox('setValue', row.sort);
		adId = row.id;
		action_content = row.action_content;
		upPictureUrlAd = row.imageUrl;
		$('#upPicture').textbox('setText', upPictureUrlAd);
		image_id = row.image_id;
		if (row.action_type == 2) {
			$('.showprod').show();
			$('#jumpAddress').hide();
			$('.showprodH').hide();
			$("#prodaddress span").remove();
			$("#prodaddress").append("<span>" + action_content + "</span>");
		} else if (row.action_type == 3) {
			findPromInfoAllListByType(1, row.action_content);
		} else if (row.action_type == 9) {
			queryAllArticleByType(1, row.action_content);
		} else if (row.action_type == 8) {
			findPromInfoAllListByType(2, row.action_content);
		} else {
			$('.showprod').hide();
			$('#jumpAddress').hide();
			$('.showprodH').show();
			$("#action_contentH").textbox("setValue", row.action_content);
		//findPromInfoAllListByType(1, row.action_content);
		}
		//$("#action_content").textbox("setValue", row.action_content);
		if (upPictureUrlAd != null) {
			$("#showPic").append(
				'<img src="' + row.imageUrl + '"style="width:145px;height:100px;">' +
				'<img onclick="delPic()" style="position:absolute;left:145px; top:0;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
		}
		$('#addAdver').dialog('open');
	}
}
function formatterPic(value, row, index) {
	if (value != null && value != "") {
		return '<img class ="imgFt" src="' + value + '"/>';
	} else {
		return '';
	}
}
function formatterChoice(value, row, index) {
	return '<a href="javascript:toChoice();" class="audit">选择</a>';
}
function toChoice() {
	$(".showprod span").remove();
	var row = $("#allProdListDg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要做活动的商品', 'warning');
		return;
	}
	var id = row.id;
	var name = row.kname;
	//image_id = row.imageId;
	var spuId = row.spuId;
	action_content = "https://api.who168.com/gift-fly/dist/#/goodDetail?spuId=" +
		spuId + "&skuId=" + id + "&promId=0";
	$("#prod").append("<span>商品规格编码：" + id + "&nbsp;&nbsp;&nbsp;&nbsp;商品名称：" +
		name + "</span>");
	$("#prodaddress").append("<span>" + action_content + "</span>");
	$("#allProdList").dialog("close");
}
function formatterCZ(value, row, index) {
	if (row.type == 2 || row.type == 4 || row.type == 5) {
		console.log(row.type);
		return '<a href="javascript:showAdverDetailInfo();" class="audit">查看信息</a>&nbsp;&nbsp;&nbsp;&nbsp;';
	} else {
		return '<a href="javascript:showAdverDetailInfo();" class="audit">查看信息</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
			'<a href="javascript:deleteAdver();" class="audit">删除</a>';
	}
}
function formatterZT(value, row, index) {
	//1.已发布；2未发布；3废弃
	if (value == "1") {
		return '已发布';
	} else if (value == "2") {
		return '未发布';
	} else if (value == "3") {
		return '废弃';
	}
}
function formatterType(value, row, index) {
	if (value == "1") {
		return '首页轮播广告';
	} else if (value == "2") {
		return '导航推荐广告';
	} else if (value == "3") {
		return '热门活动';
	} else if (value == "4") {
		return '选礼-节日推荐';
	} else if (value == "5") {
		return '选礼-优惠活动';
	} else if (value == "9") {
		return '首页公告';
	} else if (value == "8") {
		return '新人专区';
	}
}
function initDataAdver() {
	let type = $('#cmb_Type').combobox('getValue');
	var p = $('#adverListDg').datagrid('getPager');
	var options = p.data("pagination").options;
	var rows = options.pageSize;
	findAdverList(1, rows, type)
}
//编辑后的logo上传
function uploadupPictureAd() {
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
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			//post方式    
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			//发送请求    
			xhr.send(formData); //第三步骤    
			//ajax返回    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					$("#showPic img").remove();
					upPictureUrlAd = jQuery.parseJSON(xhr.responseText).url;
					image_id = jQuery.parseJSON(xhr.responseText).id;
					$("#showPic").append(
						'<img src="' + upPictureUrlAd + '"style="width:145px;height:100px;">' +
						'<img onclick="delPicAd()" style="position:absolute;top:0;left:145px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
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
function delPicAd() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : upPictureUrlAd,
			id : image_id,
		},
	});
	$("#showPic img").remove();
	$('#upPicture').textbox('initValue');
}
//接口请求服务
function AdvrtService() {
	// 请求url
	this.selectUrl = "system/ads/findByType";
	this.addOrUpdateUrl = "system/ads/insertOrUpdateAd";
	this.delUrl = "system/ads/deleteAd";
}
;
AdvrtService.prototype = {
	findList : function(type, page, rows, successFun, errorFun) {
		var params = {
			type : type,
			page : page,
			rows : rows
		};
		new RequestService().ajaxRequestPost(this.selectUrl, params,
			successFun, errorFun);
	},
	deleteAdver : function(id, successFun, errorFun) {
		let node = "广告列表";
		var params = {
			adminid : adminId,
			node : node,
			id : id
		};
		new RequestService().ajaxRequestPost(this.delUrl, params,
			successFun, errorFun);
	},
	addOrUpdate : function(id, status, image_id, type, action_type, action_content, action_text, start_time, end_time, sort, successFun, errorFun) {
		let node = "广告列表";
		var params = {
			adminid : adminId,
			node : node,
			id : id,
			status : status,
			image_id : image_id,
			type : type,
			action_type : action_type,
			action_content : action_content,
			action_text : action_text,
			start_time : start_time,
			end_time : end_time,
			sort : sort
		};
		new RequestService().ajaxRequestPost(this.addOrUpdateUrl, params,
			successFun, errorFun);
	},
}