//插入日志
function insertLog(adminId,type,content,object) {
		    $.ajax({
				url : '/gift-fly/system/log/insertLog',
				dataType : "json",
				type : "post",
				data :{
					adminId:adminId,
					type : type,
					content : content,
					object:object,
					systemType:1,
					orgId:0,
				    },
				async: false,
				success : function(data){
				},
				error : function(err){
				}
			    });
		}
