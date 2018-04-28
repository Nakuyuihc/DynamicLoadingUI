$.ajaxSetup({ 
　　　　error: function (XMLHttpRequest, textStatus, errorThrown){
　　　　　　if(XMLHttpRequest.status==403){
　　　　　　　　$.messager.alert('提示', '您没有权限访问此资源或进行此操作！');
　　　　　　　　return false;
　　　　　　}
　　　　}, 
　　　　complete:function(XMLHttpRequest,textStatus){ 
　　　　　　var sessionstatus=XMLHttpRequest.getResponseHeader("sessionstatus"); //通过XMLHttpRequest取得响应头,sessionstatus， 
　　　　　　if(sessionstatus=='timeout'){ 
　　　　　　　　//如果超时就处理 ，指定要跳转的页面 
　　　　　　　　var top = getTopWinow(); //获取当前页面的顶层窗口对象
　　　　　　　　$.messager.alert('提示', '登录超时-请重新登录！');
　　　　　　　　top.location.href = "//"+window.location.host+"/HRTLWF.APP/login.html"; //跳转到登陆页面 对多服务器同样适用
　　　　　　} 
　　　　} 
});

/** 
* 在页面中任何嵌套层次的窗口中获取顶层窗口 
* @return 当前页面的顶层窗口对象 
*/
function getTopWinow(){ 
	var p = window; 
　　　while(p != p.parent){ 
　　　	p = p.parent; 
　　　} 
　　　return p; 
}

/**
 * 获取当天日期
 * @returns
 */
function today(){
    var today=new Date();
    var h=today.getFullYear();
    var m=today.getMonth()+1;
    var d=today.getDate();
    m= m<10?"0"+m:m;   //  这里判断月份是否<10,如果是在月份前面加'0'
    d= d<10?"0"+d:d;        //  这里判断日期是否<10,如果是在日期前面加'0'
    return h+"-"+m+"-"+d;
}

/**
 * 获取当天日期
 * @returns
 */
function todayBySeconds(){
    var today=new Date();
    var h=today.getFullYear();
    var m=today.getMonth()+1;
    var d=today.getDate();
    var H=today.getHours();
    var M=today.getMinutes();
    var s=today.getSeconds();
    m= m<10?"0"+m:m;   //  这里判断月份是否<10,如果是在月份前面加'0'
    d= d<10?"0"+d:d;        //  这里判断日期是否<10,如果是在日期前面加'0'
    H= H<10?'0'+H:H;
    M= M<10?'0'+M:M;
    s= s<10?'0'+s:s;
    return h+"-"+m+"-"+d+" "+H+":"+M+":"+s;
}


/**
 * 将datagrid的数据设为0
 */
function clearDatagrid(id){
	$(id).datagrid('loadData', {total : 0,rows : []});
}

$.extend($.fn.datagrid.methods, {
	// 自动合并单元格
    autoMergeCells: function(jq, fields) {
        return jq.each(function() {
            var target = $(this);
            if (!fields) {
                fields = target.datagrid("getColumnFields");
            }
            var rows = target.datagrid("getRows");
            var i = 0,
            j = 0,
            temp = {};
            for (i; i < rows.length; i++) {
                var row = rows[i];
                j = 0;
                for (j; j < fields.length; j++) {
                    var field = fields[j];
                    var tf = temp[field];
                    if (!tf) {
                        tf = temp[field] = {};
                        tf[row[field]] = [i];
                    } else {
                        var tfv = tf[row[field]];
                        if (tfv) {
                            tfv.push(i);
                        } else {
                            tfv = tf[row[field]] = [i];
                        }
                    }
                }
            }
            
//            temp['source']['/']={};
            $.each(temp,
            function(field, colunm) {
                $.each(colunm,
                function() {
                    var group = this;

                    if (group.length > 1) {
                        var before, after, megerIndex = group[0];
                        for (var i = 0; i < group.length; i++) {
                            before = group[i];
                            after = group[i + 1];
                            if (after && (after - before) == 1) {
                                continue;
                            }
                            var rowspan = before - megerIndex + 1;
                            if (rowspan > 1) {
                                target.datagrid('mergeCells', {
                                    index: megerIndex,
                                    field: field,
                                    rowspan: rowspan
                                });
                            }
                            if (after && (after - before) != 1) {
                                megerIndex = after;
                            }
                        }
                    }
                });
            });
        });
    }
});

/**
 * 设置区域高度自适应
 * @param container 容器 （例如：body|#id）
 * @param region 区域
 * @returns
 */
function setRegionHeight(container,region){
	var c = $(container);
	var p = c.layout('panel',region);	// get the north panel
	var oldHeight = p.panel('panel').outerHeight();
	p.panel('resize', {height:'auto'});
	var newHeight = p.panel('panel').outerHeight();
	c.layout('resize',{
		height: (c.height() + newHeight - oldHeight)
	});
}

/**
 * 验证扩展
 */
$.extend($.fn.validatebox.defaults.rules, {
	
	length: { 
		validator: function (value, param) {
	        var len = $.trim(value).length;
	        return len >= param[0] && len <= param[1];
		},
        message: "输入内容长度必须介于{0}和{1}之间！"
    },
    maxlength: { 
		validator: function (value, param) {
			 return value.length < param[0]+1;
		},
        message: "不可超过{0}个字符！"
    },
    numberLength :{
		validator : function(value, param) {
			var v_name = '^[0-9]{'+param[0]+','+param[1]+'}$';
		    return value.match(v_name);
		},
		message : '必须为{0}-{1}位的数字！'    	
    },
	
    numberLetterLength :{
		validator : function(value, param) {
			var v_name = '^[A-Za-z0-9]{'+param[0]+','+param[1]+'}$';
		    return value.match(v_name);
		},
		message : '必须是{0}-{1}位数字或字母！'    	
    },
    
    eqPassword : {/* 扩展验证两次密码 */
		validator : function(value, param) {
		    return value == $(param[0]).val();
		},
		message : '密码不一致！'
    },
    
    notEqPassword: {/* 扩展验证新旧密码 */
		validator : function(value, param) {
		    return value != $(param[0]).val();
		},
		message : '新旧密码相同！'
    },
    
/*    password :{
		validator : function(value, param) {
			
			if (value.length>param[1] || value.length<param[0])
			  {
			    return false;
			  }
			  if(/^\d+$/.test(value))
			  {
			    return false;//全数字
			  }
			  if(/^[a-z]+$/i.test(value))
			  {
			    return false;//全字母
			  }
			  if(!/^[A-Za-z0-9]+$/.test(value))
			  {
			    return false;//有数字有字母 ";
			  }

		    return true;
		},
		message : '密码须由字母、数字组成，{0}-{1}位！'    	
    },*/

    password :{
		validator : function(value, param) {
			
			if (value.length>param[1] || value.length<param[0])
			  {
			    return false;
			  }
			var ls = 0; 
			if(value.match(/([a-z])+/)){   
			    ls++;   
			}   
			if(value.match(/([0-9])+/)){   
			    ls++;     
			}   
			if(value.match(/([A-Z])+/)){   
			    ls++;   
			}   
			if(value.match(/[^a-zA-Z0-9]+/)){ 
			    ls++;   
			}  
			return ls==3;
		},
		message : '密码须由大小写字母、数字组成，{0}-{1}位！'    	
    }
});

/**
 * 判断是否手机号
 * @param mobile
 * @returns
 */
function isMobile(mobile){
	var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
	return !myreg.test(mobile)?false:true;
}

/**
 * 
 * trimToNull(null)          = null
 * trimToNull("")            = null
 * trimToNull("     ")       = null
 * trimToNull("abc")         = "abc"
 * trimToNull("    abc    ") = "abc"
 * @param str
 * @returns
 */
function trimToNull(str){
	var ts = $.trim(str);
	if(ts == null || ts.length == 0){
		return null;
	}else{
		return ts;
	}
}