function queryUserDetail() {
	let userIdList = $('.sessinfo');
	if (userIdList.length > 0) {
		let useridList =[];
		for (var i = 0; i < userIdList.length; i++) {
			let userId = userIdList[i].getAttribute("id");
			console.log(userId)
			useridList.push(userId.split("IM")[1]);
		}
		console.log(useridList)
		$.ajax({
			url : '/gift-fly/cisWeb/queryUserDetailList',
			type : "post",
			data : {
				useridList : useridList.toString()
			},
			success : function(data) {
				if (data.status == "succeed") {
					console.log(data)
					return;
					var key = "C2C_IM" + data.userid;
					infoMap[key] = {
						'name' : data.nickname,
						'image' : "http://opengiftfly-1255652370.file.myqcloud.com/img/201802/06/151137_4127.png"
					};
					let to_id = "IM" + data.userid;
					$("#faceImg_" + to_id).attr("src", "http://opengiftfly-1255652370.file.myqcloud.com/img/201802/06/151137_4127.png");
					$('#nameDiv_' + to_id).html(data.nickname);

				} else {

				}
			},
			error : function(err) {}
		});
	}
}