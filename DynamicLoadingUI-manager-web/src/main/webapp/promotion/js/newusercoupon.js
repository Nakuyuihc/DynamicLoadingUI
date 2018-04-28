$(document).ready(function() {
	$('.manzhe').hide();
	loginCheck1();
	uploadImg();
	var p = $('#coupondg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [ 20, 30, 40 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页 共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录 共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findList(pageNumber, pageSize);
		}
	});
	getTotal();
	findList(1, 20);
	//上传进度条
	progressBar();
});
var id;
var total;
var imgid;
var imgurl=null;
var adminid = ReadCookie("adminid");
//获取总数
function getTotal() {
	$.ajax({
		url : '/gift-fly/system/coupon/selectCouponNum',
		dataType : "json",
		type : "post",
		async: false,
		data : {
			isnewuser : 1,
		},
		success : function(data) {
					total = data.total;
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
// 分页查询
function findList(page, rows) {
	$('#coupondg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/coupon/selectCouponList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			isnewuser : 1,
		},
		success : function(data) {
			// 需要传递total总条数和rows列表...
			var obj = {
				total : total,
				rows : data.list
			};
			$('#coupondg').datagrid('loaded');
			$("#coupondg").datagrid('loadData', obj);
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}

//初始化新增框
function cleanInput() {
	imgid =0;
	imgurl=null;
	$("#showimg img").remove();
	$("#name").textbox("setValue", "");
	$("#couponWord").textbox("setValue", "");
	$('#denomination').numberbox("setValue", "");
	$('#minamount').numberbox("setValue", "");
	$('#discount').numberbox('reset');
	$('#mindiscount').numberbox('reset');
	$('#maxpersonal').numberbox('setValue', 1);
	$('#maxcount').numberbox('setValue', 1);
	$('#maxamount').numberbox("setValue", "");
	$('#maxmoney').numberbox("setValue", "");
	$('#startTime').val(formatTime(new Date()));
	$('#endTime').val(formatTime(new Date()));
	$("#remark").textbox("setValue", "");
	$('#expiry').numberbox('setValue', 1);
	$("#couponimg").textbox("setValue", "");
	$("#prodcatids").combobox("clear");
}
//新增对话框
function addCoupon() {
	cleanInput();
	$("#reductiontype").combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		data : [
			{
				"id" : 1,
				"name" : "扣减金额",
				"selected" : true,
			},
			{
				"id" : 2,
				"name" : "折扣"
			}, {
				"id" : 3,
				"name" : "免运费"
			}],
		onChange : function(n, o) {
			if (n == 1) {
				$('.manzhe').hide();
				$('.manjian').show();
			} else if (n == 2) {
				$('.manzhe').show();
				$('.manjian').hide();
			} else {
				$('.manzhe').hide();
				$('.manjian').show();
			}
		}
	});
	$.ajax({
		url : '/gift-fly/system/mallWeb/findAllChildCat',
		dataType : "json",
		type : "post",
		async: false,
		data : {
		},
		success : function(data) {
				$('#prodcatids').combobox({
					valueField : 'id',
					textField : 'name',
					multiple : "true",
					data : data.list,
				});
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
	
	$("#addCouponInfo").dialog("open");
}
//确定保存
function saveInfo() {
	// 判断表单是否通过验证
	/*var valid = $('#newuser_couponfrom').form('validate');
	if (!valid) {
		return valid;
	}*/
	$("#btnID").trigger("click");
	$("#upload-progressbar").window("open");
	// 获取表单af中的值并转化
	/*var afInfo = $("#newuser_couponfrom").serializeArray();*/
	var name = $("#name").val();
	var couponWord = $("#couponWord").val();
	var reductiontype = $("#reductiontype").combobox('getValue');
	var reductiontarget = $("#reductiontarget").combobox('getValue');
	var denomination = $("#denomination").val();
	var minamount = $("#minamount").val();
	if(reductiontype == 2){
		denomination = $("#discount").val();
		minamount = $("#mindiscount").val();
	}
	var maxpersonal = $("#maxpersonal").val();
	var maxcount = $("#maxcount").val();
	var maxamount = $("#maxamount").val();
	var maxmoney = $("#maxmoney").val();
	var scope = $("#scope").val();
	var remark = $("#remark").val();
	var expiry = $("#expiry").val();
	var type = $("#type").combobox('getValue');
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	var prodcatids = $("#prodcatids").combobox("getValues");
	prodcatids = prodcatids.toString();
	$.ajax({
		url : '/gift-fly/system/coupon/insertCoupon',
		dataType : "json",
		type : "post",
		data : {
			name : name,
			type : type,
			imageId : imgid,
			couponWord : couponWord,
			isNewUser : 1,
			reductionType : reductiontype,
			reductionTarget : reductiontarget,
			denomination : denomination,
			remark : remark,
			minOrderAmount : minamount,
			maxOrderCount : maxcount,
			isExclusive : 0,
			maxAmount : maxamount,
			maxPersonalAmount : maxpersonal,
			maxMoney : maxmoney,
			scope : scope,
			prodCatIds : prodcatids,
			startTime : startTime,
			endTime : endTime,
			expiry : expiry,
			adminid : adminid,
			node : "新人优惠券",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#addCouponInfo").dialog("close");
				// 刷新当前页
				$('#coupondg').datagrid('getPager').pagination('select');
				$("#progressBarID").progressbar("setValue", 100);
				$("#upload-progressbar").window("close");
				$.messager.show({
					timeout : 500,
					msg : "添加成功！",
					title : "提示",
				});
				//插入日志
				insertLog(adminid, 1, "新增新人优惠券:" + name, "新人优惠券");
			} else {
				$('#coupondg').datagrid('loaded');
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//查看
function showDetail() {
	var row = $("#coupondg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的新人优惠券！', 'warning');
		return;
	}
	$("#updateAccount span").remove();
	$("#showImage img").remove();
	if(row.reductionType ==1){
		reductionType ="扣减金额";
		$('.manzhe').hide();
		$('.manjian').show();
	}else if(row.reductionType ==2){
		reductionType ="折扣";
		$('.manzhe').show();
		$('.manjian').hide();
	}else{
		reductionType ="免运费";
		$('.manzhe').hide();
		$('.manjian').show();
	}
	if(row.reductionTarget ==1){
		reductionTarget ="扣减总价";
	}else if(row.reductionTarget ==2){
		reductionTarget ="扣减商品价格";
	}else{
		reductionTarget ="扣减运费";
	}
	if(row.type ==1){
		type ="自营";
	}else if(row.reductionTarget ==2){
		type ="第三方";
	}else{
		type ="合作方";
	}
	if(row.imageId > 0){
		$.ajax({
			url : '/gift-fly/system/upload/selectImg',
			dataType : "json",
			type : "post",
			async: false,
			data : {
				id :row.imageId,
			},
			success : function(data) {
				$("#showImage").append(
						'<img src="'+data.entity.accessUrl+'"style="width: 120px;height:100px;">');
			},
			error : function(err) {
				$.messager.alert('提示', '系统异常！', 'error');
			}
		});
	}
	$("#showname").append("<span>" + row.name + "</span>");
	$("#showcouponWord").append("<span>" + row.couponWord + "</span>");
	$("#showreductiontype").append("<span>" + reductionType + "</span>");
	$("#showreductiontarget").append("<span>" + reductionTarget + "</span>");
	$("#showdenomination").append("<span>" + row.denomination  + " 元</span>");
	$("#showminamount").append("<span>" + row.minOrderAmount + " 元</span>");
	$("#showdiscount").append("<span>" +  row.denomination + " 折</span>");
	$("#showmindiscount").append("<span>" + row.minOrderAmount + " 元</span>");
	$("#showmaxpersonal").append("<span>" + row.maxPersonalAmount + " 张</span>");
	$("#showmaxcount").append("<span>" + row.maxOrderCount + " 张</span>");
	$("#showmaxamount").append("<span>" + row.maxAmount + " 张</span>");
	$("#showget").append("<span>" + row.amount + " 张</span>");
	$("#showmaxmoney").append("<span>" + row.maxMoney + " 元</span>");
	$("#showscope").append("<span>" + row.scope + "</span>");
	/*$("#showprodcatids").append("<span>" + row.prodCatIds + "</span>");*/
	$("#showstartTime").append("<span>" + row.startTime + "</span>");
	$("#showendTime").append("<span>" + row.endTime + "</span>");
	$("#showremark").append("<span>" + row.remark + "</span>");
	$("#showexpiry").append("<span>" + row.expiry + " 天</span>");
	$("#showtype").append("<span>" + type + "</span>");
	$("#updateAccount").dialog("open");
}

//删除
function deleted() {
	// 获得选中的项
	var row = $("#coupondg").datagrid("getSelected");
	if (row) {
		$.messager.confirm('请确认', '确定要弃用这个新人优惠券吗？', function(b) {
			if (b) {
				id = row.id;
				$.ajax({
					url : '/gift-fly/system/coupon/deleteInfo',
					dataType : "json",
					type : "post",
					data : {
						id : id,
						adminid : adminid,
						node : "新人优惠券",
					},
					success : function(data) {
						if (data.status == "succeed") {
							$("#coupondg").datagrid('unselectAll');
							$('#coupondg').datagrid('getPager').pagination('select');
							$.messager.show({
								timeout : 500,
								msg : '删除成功',
								title : '提示',
							});
							insertLog(adminid, 1, "删除新人优惠券：" + row.name, "新人优惠券");
						} else {
							$.messager.alert('错误', '删除失败!', 'error');
						}
					},
					error : function(err) {
						$.messager.alert('提示', '系统异常！', 'error');
					}
				});
			}
		});
	} else {
	}
}
function formatterCZ(value, row, index) {
		return '<a href="javascript:showDetail();" class="audit">查看</a>&nbsp;&nbsp;' +
			'<a href="javascript:deleted();" class="audit">废弃</a>' ;
}
function formatterLX(value, row, index) {
	if(value == 1){
		return '自营';
	}else if(value == 2){
		return '第三方';
	}else{
		return '合作方';
	}
}
function formatterME(value, row, index) {
		return value+ ' 元';
}
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
//图片上传
function uploadImg() {
	$('#couponimg').filebox({
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
					if (imgurl != null) {
						$.ajax({
							url : '/gift-fly/system/upload/delImg',
							dataType : "json",
							type : "post",
							data : {
								url : imgurl,
								id : imgid,
							},
						});
						$("#showimg img").remove();
					}
					imgurl = jQuery.parseJSON(xhr.responseText).url; 
					imgid = jQuery.parseJSON(xhr.responseText).id;
					$("#showimg").append(
							'<img src="'+imgurl+'"style="width: 120px;height:100px;">'+
					'<img onclick="delimg()" style="position:absolute;right:0; top:1px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
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
function delimg() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : imgurl,
			id : imgid,
		},
	});
	$("#showimg img").remove();
	$('#couponimg').textbox('initValue');	
}