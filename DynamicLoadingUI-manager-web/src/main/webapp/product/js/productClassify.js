$(document).ready(function() {
	loginCheck1();
	getList();
	uploadImg();
	uploadupLogo();
	//上传进度条
	progressBar();
});
var id;
var parname;
var typesort;
var parentId;
var adminid = ReadCookie("adminid");
var addimgid=0;
var addimgurl=null;
var upimgid=0;
var upimgurl=null;
// 添加对话框
function addType() {
	$("#typename").textbox('setValue', "");
	$("#typesort").textbox('setValue', "");
	$("#addimg").textbox('setValue', "");
	$("#parname").combobox("clear");
	$("#addtype").dialog("open");
}
// 确定添加
function saveType() {
	// 判断表单是否通过验证
	var valid = $('#typeaf').form('validate');
	if (!valid) {
		return valid;
	}
	// 获取表单af中的值并转化
	var afInfo = $("#typeaf").serializeArray();
	var typename = afInfo[0].value;
	var parname = afInfo[1].value;
	if(parname == null || parname == ''){
		parname =0;
	}
	var typesort = afInfo[2].value;
	$.ajax({
		url : '/gift-fly/system/mallWeb/insertProdCat',
		dataType : "json",
		type : "post",
		data : {
			name : typename,
			parentId : parname,
			iconId : addimgid,
			adminid : adminid,
			node : "商品分类",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#addtype").dialog("close");
				// 刷新当前页
				$('#protypedg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "添加成功！",
					title : "提示",
				});
				insertLog(adminid, 1, "新增分类:"+typename, "商品分类");
			} else {
				$('#protypedg').datagrid('loaded');
				$.messager.alert('提示', '添加失败！', 'error');
			}
			getList();
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//编辑对话框
function updateType() {
	$("#showupImg img").remove();
	$("#upimg").textbox('setValue', "");
	$("#upparname").combobox("clear");
	var row = $("#protypedg").datagrid("getSelected");
	if (row) {
		id = row.id;
		parentId = row.parentId;
		upimgurl = row.imagePath;
		upimgid = row.iconId;
		$('#updatatypeform').form('load', {
			typename : row.name,
			parname : parentId,
			typesort : row.deep,
		});
	}else{
		$('#updatatypeform').form('load', {
			typename : parname,
			typesort : typesort,
		});
	}
	if (!(upimgurl == null)) {
		$("#showupImg").append(
		'<img src="'+upimgurl+'"style="width: 145px;height:100px;">'+
		'<img onclick="deluplogo()" style="position:absolute;right:5px; top:5px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
	}
	$("#updatetype").dialog("open");
}
//保存编辑信息
function saveUpdate() {
	var valid = $('#updatatypeform').form('validate');
	if (!valid) {
		return valid;
	}
	var ffInfo = $("#updatatypeform").serializeArray();
	var typename = ffInfo[0].value;
	var parname = ffInfo[1].value;
	if(parname == null || parname == ''){
		parname =0;
	}
	var typesort = ffInfo[2].value;
	$.ajax({
		url : '/gift-fly/system/mallWeb/updateProdCat',
		dataType : "json",
		type : "post",
		data : {
			id : id,
			name : typename,
			parentId : parname,
			adminid : adminid,
			iconId : upimgid,
			node : "商品分类",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#updatetype").dialog("close");
				$('#protypedg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "编辑成功！",
					title : "提示",
				});
				insertLog(adminid, 1, "编辑分类:"+typename, "商品分类");
			} else {
				$('#protypedg').datagrid('loaded');
				$.messager.alert('提示', '添加失败！', 'error');
			}
			getList();
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
// 删除
function delType() {
    // 获得选中的项
    var row = $("#protypedg").datagrid("getSelected");
    if (row) {
    	id = row.id;
	$.messager.confirm('请确认', '您确定要删除该子分类吗？', function(b) {
	    if (b) {
	    	toDelete();
	    }
	});
    } else {
    	$.messager.confirm('请确认', '删除该父分类,其下的所有子分类也将被删除,确定要删除吗？', function(b) {
    	    if (b) {
    	    	toDelete();
    	    }
    	});
    }
}
function toDelete() {
	$.ajax({
		url : '/gift-fly/system/mallWeb/deleteProdCat',
		dataType : "json",
		type : "post",
		data : {
			id : id,
			adminid : adminid,
			node : "商品分类",
		},
		success : function(data) {
			if (data.status == "succeed") {
				$('#protypedg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : '删除成功',
					title : '提示',
				});
				insertLog(adminid, 1, "删除分类:"+typename, "商品分类");
			} else {
				$('#protypedg').datagrid('loaded');
				$.messager.alert('错误', data.msg, 'error');
			}
			getList();
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
// 验证名称是否已存在
function isTure(typename) {
	$.ajax({
		url : '/HRTLWF.APP/service/gifttype/findByName',
		dataType : "json",
		type : "post",
		async: false,
		data : {
			typename : typename,
		},
		success : function(data) {
			if (data.FLAG == 1) {
				verifyName = 1;
				$.messager.show({
					timeout : 1000,
					showType:'show',
					msg : "该类型名称已存在!",
					title : "提示",
					style:{
						 right:'',  
				         bottom:''
						},
				});
			}
		},
		error : function(err) {
		}
	});
	return;
}
/**
 * 验证扩展
 */
$.extend($.fn.validatebox.defaults.rules, {
	maxlength : {
		validator : function(value, param) {
			return value.length < param[0] + 1;
		},
		message : "不可超过{0}个字符！"
	}
});
function getList(){
	var flag = 0;
	typecode = 0;
	$.ajax({
		url : '/gift-fly/system/mallWeb/findAllProdCat',
		dataType : "json",
		type : "post",
		data : {
		},
		success : function(data) {
			if (data.status == "succeed") {
				$('#parlist').tree({  
					animate : true,
					data : data.list,
					onClick : function(node) {
						id = node.id;
						parname = node.text;
						typesort =node.deep;
						parentId = node.parentId;
						upimgid=node.iconId;
						upimgurl=node.imagePath;
						queryChild(id);
					    },
				onSelect:function(node){
					id = node.id;
					parname = node.text;
					typesort =node.deep;
					parentId = node.parentId;
					upimgid=node.iconId;
					upimgurl=node.imagePath;
					queryChild(id);
				},  
		        onLoadSuccess:function(node,data){  
		           $("#parlist li:eq(0)").find("div").addClass("tree-node-selected");   //设置第一个节点高亮  
		           var n = $("#parlist").tree("getSelected");  
		           if(n!=null){  
		                $("#parlist").tree("select",n.target);    //相当于默认点击了一下第一个节点，执行onSelect方法  
		           }  
		        }  
				}); 
				$('#parname').combobox({
					panelHeight : 'auto',
					valueField : 'id',
					textField : 'text',
					data : data.list,
				});
				$('#upparname').combobox({
					panelHeight : 'auto',
					valueField : 'id',
					textField : 'text',
					data : data.list,
				});
			} else {
				$.messager.alert('提示', '请求后台数据出错了!', 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
function queryChild(id) {
	$('#protypedg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/mallWeb/findByParentId',
		dataType : "json",
		type : "post",
		data : {
			page : 1,
			rows : 15,
			id : id,
		},
		success : function(data) {
			if (data.status == "succeed") {
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#protypedg').datagrid('loaded');
				$("#protypedg").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
function formatterYX(value, row, index) {
		return parname;
}
function formatterTP(value, row, index) {
	if (value == null) {
		return '无';
	}else{
		return '<img src="' + value + '"width="100" height="60"/>';
	}
}
//新增的图片上传
function uploadImg() {
	$('#addimg').filebox({
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
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			xhr.send(formData); //第三步骤    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
						$("#showImg img").remove();
					addimgurl = jQuery.parseJSON(xhr.responseText).url; 
					addimgid = jQuery.parseJSON(xhr.responseText).id;
					$("#showImg").append(
							'<img src="'+addimgurl+'"style="width: 145px;height:100px;">'+
					'<img onclick="delimg()" style="position:absolute;right:5px; top:5px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
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
			url : addimgurl,
			id : addimgid,
		},
	});
	$("#showImg img").remove();
	$('#addimg').textbox('initValue');	
}
//编辑后的图片上传
function uploadupLogo() {
	$('#upimg').filebox({
		buttonText : '选择图片',
		buttonAlign : 'right',
		accept : 'image/jpeg,image/png',
		onChange : function() {
			var xhr = new XMLHttpRequest(); //第一步    
			var file = document.getElementById('filebox_file_id_2').files;
			var formData = new FormData();
			for (i = 0; i < file.length; i++) {
				formData.append("file[" + i + "]", file[i]);
			}
			$("#btnID").trigger("click");
			$("#upload-progressbar").window("open");
			xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
			xhr.send(formData); //第三步骤    
			xhr.onreadystatechange = function() { //第四步    
				if (xhr.readyState == 4 && xhr.status == 200) {
					$("#progressBarID").progressbar("setValue", 100);
					$("#upload-progressbar").window("close");
					if (upimgid != null && upimgurl != null) {
						$.ajax({
							url : '/gift-fly/system/upload/delImg',
							dataType : "json",
							type : "post",
							data : {
								url : upimgurl,
								id : upimgid,
							},
						});
						$("#showupImg img").remove();
					}
					upimgurl = jQuery.parseJSON(xhr.responseText).url; 
					upimgid = jQuery.parseJSON(xhr.responseText).id;
					$("#showupImg").append(
							'<img src="'+upimgurl+'"style="width: 145px;height:100px;">'+
					'<img onclick="deluplogo()" style="position:absolute;right:5px; top:5px;width:16px;height:16px;cursor:pointer;" src="/gift-fly/common/jquery-easyui-1.5.3/themes/icons/cancel.png"/>');
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
function deluplogo() {
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : upimgurl,
			id : upimgid,
		},
	});
	$("#showupImg img").remove();
	$('#upimg').textbox('initValue');	
}
