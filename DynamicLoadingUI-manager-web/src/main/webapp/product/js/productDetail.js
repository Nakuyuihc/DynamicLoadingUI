function checkDetail() {
	var row = $("#productdg").datagrid("getSelected");
	if (row == undefined || row == '' || row == null) {
		$.messager.alert('提示', '请选择需要查看的商品', 'warning');
		return;
	}
	id = row.id;
	selectProdDetail(id);
	$("#productDetail").dialog("open");
	$("#productImg").hide();
	$("#prodSpecified").hide();
	$("#prodPack").hide();
	$("#generalInfo").show();
}
var id;
var packids;
function selectProdDetail(id) {
	$.ajax({
		url : '/gift-fly/system/mallWeb/findDitailById',
		dataType : "json",
		type : "post",
		async : false,
		data : {
			id : id,
		},
		success : function(data) {
			if (data.status == "succeed") {
				toUpload(data.entity);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
//加载到页面上
function toUpload(entity) {
	$("#prodname span").remove();
	$("#prodtype span").remove();
	$("#prodsign li").remove();
	$("#prodantistop span").remove();
	$("#packing span").remove();
	packids = entity.packIds;
	$('#qrcode').html("");
	url="https://api.who168.com/gift-fly/dist/index#/goodDetail?promId=0&skuId="+entity.skuId+
	"&spuId="+entity.spuId+"&type="+entity.spuType;	
	$("#qrcode").qrcode({
		width : 120,
		height : 120,
		text : url,
	});
	$("#save").click(function(){ 
		var canvas = $('#qrcode').find("canvas").get(0); 
		var url = canvas.toDataURL('image/jpeg'); 
		$("#download").attr('href', url).get(0).click(); 
		window.location.reload();
		});
	if (entity.spuSeachKey == null || entity.spuSeachKey == '') {
		
		$("#prodname").append('<span>无</span>');
	} else {
		$("#prodantistop").append('<span>' + entity.spuSeachKey + '</span>');

}
	$("#prodname").append('<span>' + entity.spuName + '</span>');
	$("#packing").append('<span>' + entity.packName + '</span>');
	$("#prodtype").append('<span>' + entity.prodCat + '</span>');
	$('#uppricesign').tree({
		animate : true,
		checkbox : true,
		data : entity.prices,
		onLoadSuccess:function(){
			$(this).find('span.tree-checkbox').unbind().click(function(){
			return false;
			});
			}
	});
	$('#upusesign').tree({
		animate : true,
		checkbox : true,
		data : entity.uses,
		onLoadSuccess:function(){
			$(this).find('span.tree-checkbox').unbind().click(function(){
			return false;
			});
			}
	});
	$('#upfestivalsign').tree({
		animate : true,
		checkbox : true,
		data : entity.festervals,
		onLoadSuccess:function(){
			$(this).find('span.tree-checkbox').unbind().click(function(){
			return false;
			});
			}
	});
	$(".tree-indent").remove();
	$(".tree-file").remove();
	$("#proddescription").val(entity.summery);
	editor.html(entity.content);
	var arr = entity.images;
	$("#productImg div").remove();
	$.each(arr, function(n, value) {
		$("#productImg").append('<div id="' + n + '" style="position:relative;float:left;">' +
			'<img id=' + value.id + ' class="upgiftpic" style="width:120px;height:120px;margin:5px 20px;" src="' + value.accessUrl + '"/>' +
			'<img onclick="delProImg(' + n + ',' + value.id + ')" style="position:absolute;right:10px; top:1px;width:16px;height:16px;cursor:pointer;" src="../common/jquery-easyui-1.5.3/themes/icons/cancel.png"/></div>');
	});
}
function delProImg(i, id) {
	var url = $("#" + id).attr("src");
	$.ajax({
		url : '/gift-fly/system/upload/delImg',
		dataType : "json",
		type : "post",
		data : {
			url : url,
			id : id,
		},
		success : function(data) {
			if (data.status == "succeed") {
				$("#" + i).remove();
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
}
function generalInfo() {
	$("#productImg").hide();
	$("#prodSpecified").hide();
	$("#prodPack").hide();
	$("#generalInfo").show();
}
function productImg() {
	$("#productImg").show();
	$("#prodSpecified").hide();
	$("#prodPack").hide();
	$("#generalInfo").hide();
}
function prodSpecified() {
	$('#showgiftspecified').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/mallWeb/findSpeclistById',
		dataType : "json",
		type : "post",
		data : {
			id : id,
		},
		success : function(data) {
			if (data.status == "succeed") {
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#showgiftspecified').datagrid('loaded');
				$("#showgiftspecified").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
	$("#productImg").hide();
	$("#prodSpecified").show();
	$("#prodPack").hide();
	$("#generalInfo").hide();
}
function formatterTP(value,row) {
	return '<img src="'+ value +'"width="80" height="60"/>';
}
function prodPack() {
	$('#prodPackdg').datagrid('loading');
	$.ajax({
		url : '/gift-fly/system/mallWeb/findProdPackById',
		dataType : "json",
		type : "post",
		data : {
			ids : packids,
		},
		success : function(data) {
			if (data.status == "succeed") {
				var obj = {
					total : data.total,
					rows : data.list
				};
				$('#prodPackdg').datagrid('loaded');
				$("#prodPackdg").datagrid('loadData', obj);
			} else {
				$.messager.alert('提示', data.msg, 'error');
			}
		},
		error : function(err) {
			$.messager.alert('提示', err.msg, 'error');
		}
	});
	$("#productImg").hide();
	$("#prodSpecified").hide();
	$("#prodPack").show();
	$("#generalInfo").hide();
}