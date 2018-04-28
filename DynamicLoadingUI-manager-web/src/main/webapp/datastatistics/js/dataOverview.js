$(document).ready(function() {
	finddata();
});
//获取数据
function finddata() {
	$.ajax({
		url : '/gift-fly/system/stat/findData',
		dataType : "json",
		type : "post",
		data : {
			orgId : -1,
		},
		success : function(data) {
			if (data.status == "succeed") {
				linechart(data.entity)
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}

function monthOrderNum() {
	type = 1;
	uploadData();
}
function monthOrderMoney() {
	type = 2;
	uploadData();
}
function monthNewUser() {
	type = 3;
	uploadData();
}
// 数据加载显示
function linechart(entity) {
	$("#divtop span").remove();
	$("#today-order").append('<span>' + entity.todayorder + '</span>');
	$("#month-order").append('<span>' + entity.monthorder + '</span>');
	$("#today-money").append('<span>' + entity.todaymoney + '</span>');
	$("#month-money").append('<span>' + entity.monthmoney + '</span>');
	$("#today-new-user").append('<span>' + entity.todaynewuser + '</span>');
	$("#month-new-user").append('<span>' + entity.monthnewuser + '</span>');
	showHighChars(entity);
}
//highchars数据加载
function uploadData() {
	$.ajax({
		url : '/gift-fly/system/stat/findHighCharsData',
		dataType : "json",
		type : "post",
		data : {
			type : type,	
		},
		success : function(data) {
			if (data.status == "succeed") {
				showHighChars(data.entity)
			}
		},
		error : function(err) {
			$.messager.alert('提示', '系统异常！', 'error');
		}
	});
}
//highchars数据显示
function showHighChars(entity) {
	var highchart = {
			title : {
				text : entity.list.name,
				align : 'center',
				x : 0
			},
			xAxis : {
				categories: entity.list.xdata,
	            tickmarkPlacement : 'on', //设置节点位于刻度线的正上方
			},
			yAxis : {
				title : {
					text : ''
				},
			},
			credits : {
				enabled : false
			},
			tooltip : {
				headerFormat : '{point.x}<br>',
				valueSuffix : ''
			},
			plotOptions: {
	            series: {
	                pointPlacement: 'on'
	            }
	        },
	        legend: {
	            enabled: false
	        },
			series : [ {
				name : entity.yname,
				data : entity.list.ydata,
					}]
		};
		$('#linechartofdata').highcharts(highchart);
}