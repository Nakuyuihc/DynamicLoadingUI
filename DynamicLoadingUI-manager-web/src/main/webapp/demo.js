
$(document).ready(function() {
	$('#addlogo').filebox({
		buttonText : '选择文件',
		buttonAlign : 'right',
		multiple : true,
		accept:'image/jpeg,image/png',
		onChange : function() {
			 var xhr = new XMLHttpRequest();//第一步    
			 var file = document.getElementById('filebox_file_id_1').files[0];
		     console.log(file.length);    
                 var url = 'http://opengiftfly-1255652370.cos.ap-guangzhou.myqcloud.com/img/201801/26/181025_9828.jpg?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDNFzoBOXigU5Uhj7oKplaN0Qguxscmbpr%26q-sign-time%3D1516961425%3B1516961725%26q-key-time%3D1516961425%3B1516961725%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3D9a85d04f01fafabdf6baea32d5db87c9a01057d9';
                 var xhr = new XMLHttpRequest();
                 xhr.open('PUT', url, true);
                 xhr.send(file);
                 xhr.onload = function () {
                     if (xhr.status === 200 || xhr.status === 206) {
                         var ETag = xhr.getResponseHeader('etag');
                         console.log(null, {url: url, ETag: ETag});
                     } else {
                    	 console.log('文件  上传失败，状态码：' + xhr.status);
                     }
                 };
                 xhr.onerror = function () {
                	 console.log('文件 ' + Key + ' 上传失败，请检查是否没配置 CORS 跨域规则');
                 };
		     //设置超时时间    
		     xhr.timeout = 100000;    
		     xhr.ontimeout = function(event){    
		 　　　　alert('请求超时！');    
		 　　}     
        }
	});
});
function upsptpPreview() {
	/*$("#upsptp").ajaxSubmit({
		type : "post", //提交方式    
		url : "/gift-fly/system/upload/imgUpload", //请求url    
		success : function(data) { //提交成功的回调函数
			alert(data.status);
		}
	});*/
	 var xhr = new XMLHttpRequest();//第一步    
     //定义表单变量    
     var file = document.getElementById('file').files;    
     console.log(file.length);    
     //新建一个FormData对象    
     var formData = new FormData(); //++++++++++    
     //追加文件数据    
     for(i=0;i<file.length;i++){      
          formData.append("file["+i+"]", file[i]); //++++++++++    
     }     
     //formData.append("file", file[0]); //++++++++++    
         
     //post方式    
     xhr.open('POST', '/gift-fly/system/upload/imgUpload'); //第二步骤    
     //发送请求    
     xhr.send(formData);  //第三步骤    
     //ajax返回    
     xhr.onreadystatechange = function(){ //第四步    
 　　　　if ( xhr.readyState == 4 && xhr.status == 200 ) {    
 　　　　　　console.log( xhr.responseText );    
 　　　　}    
 　　};    
     //设置超时时间    
     xhr.timeout = 100000;    
     xhr.ontimeout = function(event){    
 　　　　alert('请求超时！');    
 　　}     
}