$(document).ready(function() {
	loginCheck1();
	var p = $('#activitieListDg').datagrid('getPager');
	$(p).pagination({
		pageNumber : 1,
		pageSize : 20,
		pageList : [ 20, 30, 40 ],
		beforePageText : '第', // 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示{from} - {to}条记录   共{total}条数据',
		onSelectPage : function(pageNumber, pageSize) {
			findActivitieList(pageNumber, pageSize)
		},
	});
	$('#waresListDg').datagrid({
		pagination: false
	});
	findActivitieList(1, 20);
	uploadupPicture();
	//上传进度条
	progressBar();
});
