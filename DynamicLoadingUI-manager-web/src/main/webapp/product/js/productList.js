$(document).ready(function() {
	loginCheck1();
	protype();
	prostatus();
	cleardata();
	var p = $('#productdg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 15,
		pageList : [15,20,25],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findProdList(pageNumber, pageSize, catId,seachKey,isUp);
		},
	});
	findProdList(1, 15, catId,seachKey,isUp);
});
var catId;
var seachKey = null;
var isUp;
var adminid = ReadCookie("adminid");
var lognote;
function queryInfo() {
	var p = $('#productdg').datagrid('getPager');
	var options = p.data("pagination").options;
	var page = options.pageNumber;
	var rows = options.pageSize;
	catId = $('#protype').combobox('getValue');
	seachKey = $("#product").val();
	isUp = $('#prostatus').combobox('getValue');
	findProdList(page, rows,catId,seachKey,isUp);
}
// 分页查询
function findProdList(page, rows, catId,seachKey,isUp) {
	$('#productdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/mallWeb/findProdList',
		dataType : "json",
		type : "post",
		data : {
			page : page,
			rows : rows,
			cId : catId,
			seachKey : seachKey,
			isUp : isUp,
			spuType : 1,
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 需要传递total总条数和rows列表...
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#productdg').datagrid('loaded');
				$("#productdg").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示',  err.msg, 'error');
		}
	});
}
//清除数据缓存
function cleardata() {
	$("#product").val("");
	$("#protype").combobox('clear');
	$("#prostatus").combobox('clear');
	seachKey = null;
}
function formatterZT(value, row, index) {
	if (value == 1) {
		return '出售中';
	} else {
		return '已下架';
	}
}
function formatterCZ(value, row, index) {
	if (row.isUp == 1) {
		return  '<a href="javascript:checkDetail();" class="audit1">查看</a>&nbsp;&nbsp;&nbsp;&nbsp'+
		'<a href="javascript:isdown();" class="audit1">下架</a>';
	} else {
		return  '<a href="javascript:checkDetail();" class="audit1">查看</a>&nbsp;&nbsp;&nbsp;&nbsp'+
		'<a href="javascript:isup();" class="audit1">上架</a>';
	}
}
//商品分类
function protype() {
	$.ajax({
		url : '/gift-fly/system/mallWeb/findAllChildCat',
		dataType : "json",
		type : "post",
		async: false,
		data : {
		},
		success : function(data) {
				$('#protype').combobox({
					valueField : 'id',
					textField : 'name',
					data : data.list,
				});
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}

//状态下拉列表
function prostatus() {
	$('#prostatus').combobox({
		panelHeight : 'auto',
		valueField : 'id',
		textField : 'name',
		value:'全部',
		data : [{    
		    "id":"1",    
		    "name":"出售中", 
		},{    
		    "id":"0",    
		    "name":"已下架"   
		}]
	});
}
//批量处理上架
function isup() {
	var row = $("#productdg").datagrid("getSelections");
	if (row.length == 0) {
		$.messager.alert('提示', '请选择需要上架的商品！', 'warning');
		return;
	}
	var ids = [];
	for ( var i = 0; i < row.length; i++) {
		ids.push(row[i].id);
	}
	lognote ="将"+ids+"的状态改为上架";
	toDispost(ids.toString(),1,lognote);
}
//批量处理下架
function isdown() {
	var row = $("#productdg").datagrid("getSelections");
	if (row.length == 0) {
		$.messager.alert('提示', '请选择需要下架的商品！', 'warning');
		return;
	}
	var ids = [];
	for ( var i = 0; i < row.length; i++) {
		ids.push(row[i].id);
	}
	lognote ="将"+ids+"的状态改为下架";
	toDispost(ids.toString(),0,lognote);
}
function toDispost(ids,status,lognote) {
	$.ajax({
		url : '/gift-fly/system/mallWeb/updateIsUp',
		dataType : "json",
		type : "post",
		data : {
			ids : ids,
			isup : status,
			adminid : adminid,
			node : '商品列表',
		},
		success : function(data) {
			if (data.status == "succeed") {
				// 刷新当前页
				$('#productdg').datagrid('getPager').pagination('select');
				$.messager.show({
					timeout : 500,
					msg : "修改成功！",
					title : "提示"
				});
				insertLog(adminid, 1, lognote, "商品列表");
			} else {
				$('#selfgiftdg').datagrid('loaded');
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示',  err.msg, 'error');
		}
	});
}