webpackJsonp([9],{OCzD:function(t,i){},eXxw:function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var s=e("C5nv"),l=e("aamZ"),a=e("R4e6"),n=e("emi3"),o=e("yjFE"),c={data:function(){return{imgList:[],imgIdList:[],imgStuList:[],schoolName:"",userName:"",mobile:"",teamer:"",textArea:""}},computed:{isActive:function(){return""!=this.schoolName&&""!=this.userName&&""!=this.mobile&&this.imgList.length>0&&this.imgIdList.length>0&&this.imgStuList.length>0&&this.textArea.length>0}},methods:{getValue:function(t){this.textArea=t},getImgs:function(t){console.log(t),this.imgList=t},getIdImg:function(t){console.log(t),this.imgIdList=t},getStuImg:function(t){console.log(t),this.imgStuList=t},JoinApplySubmit:function(){var t=this,i={action:1,submiterName:this.userName,memberNames:this.teamer,activityOrgName:this.schoolName,applyDesc:this.textArea,tel1:this.mobile,imageIds:this.imgList.length>0?this.imgList.join(","):"",idCardImageIds:this.imgIdList.length>0?this.imgIdList.join(","):"",schoolCardImageIds:this.imgStuList.length>0?this.imgStuList.join(","):""};console.log(i),this.isActive?this.$Api.JoinApplySubmit(i).then(function(i){console.log(i),0==i.q.s?t.$toast("申请成功"):t.$toast(i.q.d)}):this.$toast("请输入完整信息")}},components:{Cell:s.a,MyTextArea:l.a,UploadImg:a.a,UploadImgs:n.a,UploadImgt:o.a}},m={render:function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{attrs:{id:"school__apply"}},[e("common-header",{attrs:{title:"我要申请"}}),t._v(" "),e("Cell",{attrs:{title:"学校名称",type:"input",placeholder:"学校名称"},model:{value:t.schoolName,callback:function(i){t.schoolName=i},expression:"schoolName"}}),t._v(" "),e("Cell",{attrs:{title:"姓名",type:"input",placeholder:"申请人姓名"},model:{value:t.userName,callback:function(i){t.userName=i},expression:"userName"}}),t._v(" "),e("Cell",{attrs:{title:"联系电话",type:"tel",placeholder:"联系电话"},model:{value:t.mobile,callback:function(i){t.mobile=i},expression:"mobile"}}),t._v(" "),e("Cell",{attrs:{title:"队员姓名",type:"input",placeholder:"可不填，队员以逗号分隔"},model:{value:t.teamer,callback:function(i){t.teamer=i},expression:"teamer"}}),t._v(" "),e("div",{staticClass:"apply__text"},[e("div",{staticClass:"apply__text__title title"},[t._v("创业说明")]),t._v(" "),e("my-text-area",{attrs:{maxlength:100,placeholder:"输入您的创业说明"},on:{change:t.getValue}})],1),t._v(" "),e("div",{staticClass:"apply__uploadImg border"},[e("div",{staticClass:"apply__uploadImg__title title"},[t._v("照片")]),t._v(" "),e("UploadImg",{attrs:{maxImgNum:1},on:{getIds:t.getImgs}})],1),t._v(" "),e("div",{staticClass:"apply__identity border"},[e("div",{staticClass:"apply__identity__title title"},[t._v("身份认证")]),t._v(" "),e("div",{staticClass:"apply__identity__upload"},[e("div",{staticClass:"upload"},[e("UploadImgs",{attrs:{maxImgNum:1},on:{getIds:t.getIdImg}}),t._v(" "),e("div",{staticClass:"upload__text"},[t._v("身份证正面照")])],1),t._v(" "),e("div",{staticClass:"upload"},[e("UploadImgt",{attrs:{maxImgNum:1},on:{getIds:t.getStuImg}}),t._v(" "),e("div",{staticClass:"upload__text"},[t._v("学生证")])],1)])]),t._v(" "),t._m(0),t._v(" "),e("div",{staticClass:"apply__submit",class:{active:t.isActive},on:{click:t.JoinApplySubmit}},[t._v("\n    提交申请\n  ")])],1)},staticRenderFns:[function(){var t=this.$createElement,i=this._self._c||t;return i("div",{staticClass:"apply__tips"},[i("p",{staticClass:"apply__tips__text"},[this._v("温馨提示")]),this._v(" "),i("p",{staticClass:"apply__tips__text"},[this._v("1.为了保证您的认证顺利，请保证信息清晰可见。")]),this._v(" "),i("p",{staticClass:"apply__tips__text"},[this._v("2.您提交的信息仅用于申请创业基金认证，请放心上传。")])])}]},r=e("VU/8")(c,m,!1,function(t){e("x3LG")},null,null);i.default=r.exports},emi3:function(t,i,e){"use strict";var s={props:{maxImgNum:{type:Number,default:6}},data:function(){return{imgList:[],fileList:[],urlList:[],upLoadUrlList:[],imgIdList:[]}},computed:{},methods:{selectStar:function(t){this.starIndex=t},uploadImg:function(){var t=this,i=document.getElementById("publish-imgs").files[0],e=i.name;this.fileList.push(i),this.oFile=i;var s={a:1,type:1,filename:e,oFile:i};this.getExternalUploadObject(s);var l=new FileReader;l.readAsDataURL(i),l.onload=function(e){var s=e.currentTarget.result;t.imgList.push(s),i.value="",document.getElementById("publish-imgs").value=""}},delImg:function(t,i){this.imgList.splice(i,1),this.urlList.splice(i,1),this.fileList.splice(i,1),this.imgIdList.splice(i,1)},getExternalUploadObject:function(t){var i=this;this.$Api.getExternalUploadObject(t).then(function(e){if(console.log(t),0==e.q.s){i.cos=e.q.cos;var s={accessUrl:e.q.cos.accessUrl,sourceUrl:e.q.cos.sourceUrl};i.$upLoadToCos(e.q.cos.url,t.oFile),i.getExternalFilesSubmit(s)}})},getExternalFilesSubmit:function(t){var i=this,e=[];e.push(t),console.log(e),this.$Api.getExternalFilesSubmit(1,1,e).then(function(t){if(console.log(t),0==t.q.s){t.q.files.forEach(function(t){console.log(t.id),i.imgIdList.push(t.id)}),i.$emit("getIds",i.imgIdList)}})}}},l={render:function(){var t=this,i=t.$createElement,s=t._self._c||i;return s("div",{staticClass:"clearfix",attrs:{id:"UploadImg"}},["SendGift"==t.$route.name?[s("ul",[t._l(t.imgList,function(i,l){return s("li",[s("img",{staticClass:"publish-icon",staticStyle:{width:"2.8rem",height:"2.8rem"},attrs:{src:i}}),t._v(" "),s("div",{staticClass:"del-btn",on:{click:function(e){t.delImg(i,l)}}},[s("img",{attrs:{src:e("Xmmv")}})])])}),t._v(" "),s("li",{directives:[{name:"show",rawName:"v-show",value:t.imgList.length<t.maxImgNum,expression:"imgList.length<maxImgNum"}]},[s("img",{staticClass:"publish-icon",staticStyle:{width:"2.8rem",height:"2.8rem"},attrs:{src:e("rGQL")}}),t._v(" "),s("input",{ref:"imgInput",staticClass:"publish-img",attrs:{type:"file",accept:"image/*",name:"file[]",id:"publish-imgs"},on:{change:function(i){t.uploadImg(i)}}})])],2)]:[s("ul",[t._l(t.imgList,function(i,l){return s("li",[s("img",{staticClass:"publish-icon",attrs:{src:i}}),t._v(" "),s("div",{staticClass:"del-btn",on:{click:function(e){t.delImg(i,l)}}},[s("img",{attrs:{src:e("Xmmv")}})])])}),t._v(" "),s("li",{directives:[{name:"show",rawName:"v-show",value:t.imgList.length<t.maxImgNum,expression:"imgList.length<maxImgNum"}]},[s("img",{staticClass:"publish-icon",attrs:{src:e("rGQL")}}),t._v(" "),s("input",{ref:"imgInput",attrs:{type:"file",accept:"image/*",name:"file[]",id:"publish-imgs"},on:{change:function(i){t.uploadImg(i)}}})])],2)]],2)},staticRenderFns:[]},a=e("VU/8")(s,l,!1,function(t){e("uMzv")},null,null);i.a=a.exports},uMzv:function(t,i){},x3LG:function(t,i){},yjFE:function(t,i,e){"use strict";var s={props:{maxImgNum:{type:Number,default:6}},data:function(){return{imgList:[],fileList:[],urlList:[],upLoadUrlList:[],imgIdList:[]}},computed:{},methods:{selectStar:function(t){this.starIndex=t},uploadImg:function(){var t=this,i=document.getElementById("publish-imgt").files[0],e=i.name;this.fileList.push(i),this.oFile=i;var s={a:1,type:1,filename:e,oFile:i};this.getExternalUploadObject(s);var l=new FileReader;l.readAsDataURL(i),l.onload=function(e){var s=e.currentTarget.result;t.imgList.push(s),i.value="",document.getElementById("publish-imgt").value=""}},delImg:function(t,i){this.imgList.splice(i,1),this.urlList.splice(i,1),this.fileList.splice(i,1),this.imgIdList.splice(i,1)},getExternalUploadObject:function(t){var i=this;this.$Api.getExternalUploadObject(t).then(function(e){if(console.log(t),0==e.q.s){i.cos=e.q.cos;var s={accessUrl:e.q.cos.accessUrl,sourceUrl:e.q.cos.sourceUrl};i.$upLoadToCos(e.q.cos.url,t.oFile),i.getExternalFilesSubmit(s)}})},getExternalFilesSubmit:function(t){var i=this,e=[];e.push(t),console.log(e),this.$Api.getExternalFilesSubmit(1,1,e).then(function(t){if(console.log(t),0==t.q.s){t.q.files.forEach(function(t){console.log(t.id),i.imgIdList.push(t.id)}),i.$emit("getIds",i.imgIdList)}})}}},l={render:function(){var t=this,i=t.$createElement,s=t._self._c||i;return s("div",{staticClass:"clearfix",attrs:{id:"UploadImg"}},["SendGift"==t.$route.name?[s("ul",[t._l(t.imgList,function(i,l){return s("li",[s("img",{staticClass:"publish-icon",staticStyle:{width:"2.8rem",height:"2.8rem"},attrs:{src:i}}),t._v(" "),s("div",{staticClass:"del-btn",on:{click:function(e){t.delImg(i,l)}}},[s("img",{attrs:{src:e("Xmmv")}})])])}),t._v(" "),s("li",{directives:[{name:"show",rawName:"v-show",value:t.imgList.length<t.maxImgNum,expression:"imgList.length<maxImgNum"}]},[s("img",{staticClass:"publish-icon",staticStyle:{width:"2.8rem",height:"2.8rem"},attrs:{src:e("rGQL")}}),t._v(" "),s("input",{ref:"imgInput",attrs:{type:"file",accept:"image/*",name:"file[]",id:"publish-imgt"},on:{change:function(i){t.uploadImg(i)}}})])],2)]:[s("ul",[t._l(t.imgList,function(i,l){return s("li",[s("img",{staticClass:"publish-icon",attrs:{src:i}}),t._v(" "),s("div",{staticClass:"del-btn",on:{click:function(e){t.delImg(i,l)}}},[s("img",{attrs:{src:e("Xmmv")}})])])}),t._v(" "),s("li",{directives:[{name:"show",rawName:"v-show",value:t.imgList.length<t.maxImgNum,expression:"imgList.length<maxImgNum"}]},[s("img",{staticClass:"publish-icon",attrs:{src:e("rGQL")}}),t._v(" "),s("input",{ref:"imgInput",attrs:{type:"file",accept:"image/*",name:"file[]",id:"publish-imgt"},on:{change:function(i){t.uploadImg(i)}}})])],2)]],2)},staticRenderFns:[]},a=e("VU/8")(s,l,!1,function(t){e("OCzD")},null,null);i.a=a.exports}});
//# sourceMappingURL=9.b98ad3b1c30b2a944f7b.js.map