webpackJsonp([9],{PgLB:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("aamZ"),n={components:{UploadImg:i("R4e6").a,MyTextArea:s.a}},a={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"feedback"}},[e("common-header",{attrs:{title:"意见反馈"}}),this._v(" "),e("MyTextArea",{attrs:{placeholder:"您在使用的过程中还满意吗？如果您觉得有任何问题，可以向我们反馈，我们会根据您的问题尽快优化我们的产品，谢谢您的支持！"}}),this._v(" "),e("div",{staticClass:"upload"},[e("UploadImg")],1),this._v(" "),e("div",{staticClass:"finish__btn",class:{active:!1},staticStyle:{"margin-top":"0"}},[this._v("提交反馈")])],1)},staticRenderFns:[]},l=i("OF7X")(n,a,!1,function(t){i("yw3Q")},null,null);e.default=l.exports},R4e6:function(t,e,i){"use strict";var s={data:function(){return{imgList:[],fileList:[],urlList:[],upLoadUrlList:[],imgIdList:[]}},computed:{},methods:{selectStar:function(t){this.starIndex=t},uploadImg:function(){var t=this,e=document.getElementById("publish-img").files[0],i=e.name;this.fileList.push(e),this.oFile=e,this.filename=i;var s={a:1,type:1,filename:i,oFile:e};this.getExternalUploadObject(s);var n=new FileReader;n.readAsDataURL(e),n.onload=function(i){var s=i.currentTarget.result;t.imgList.push(s),e.value="",document.getElementById("publish-img").value=""}},delImg:function(t,e){this.imgList.splice(e,1),this.urlList.splice(e,1),this.fileList.splice(e,1)},getExternalUploadObject:function(t){var e=this;this.$Api.getExternalUploadObject(t).then(function(t){if(console.log(t),0==t.q.s){e.cos=t.q.cos;var i={accessUrl:t.q.cos.accessUrl,sourceUrl:t.q.cos.sourceUrl};console.log(i),e.urlList.push(i),e.upLoadUrlList.push(t.q.cos.url)}})},getExternalFilesSubmit:function(){var t=this,e=this,i=[];this.urlList.forEach(function(t){var e={accessUrl:t.accessUrl,sourceUrl:t.sourceUrl};i.push(e)}),console.log(i),this.$Api.getExternalFilesSubmit(1,1,i).then(function(i){if(console.log(i),0==i.q.s){i.q.files.forEach(function(e){console.log(e.id),t.imgIdList.push(e.id)});for(var s=0;s<t.fileList.length;s++)e.$upLoadToCos(t.upLoadUrlList[s],t.fileList[s]);t.getCommentSubmit()}})},commentSubmit:function(){this.isComplete&&this.getExternalFilesSubmit()},getCommentSubmit:function(){var t=this.$route.params.id,e=[],i={userId:0,starNum:this.starIndex,content:this.textValue,imageIds:this.imgIdList};e.push(i),this.$Api.CommentSubmit(11,t,e).then(function(t){console.log(t)})}}},n={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"clearfix",attrs:{id:"UploadImg"}},[s("ul",[t._l(t.imgList,function(e,n){return s("li",[s("img",{staticClass:"publish-icon",attrs:{src:e}}),t._v(" "),s("div",{staticClass:"del-btn",on:{click:function(i){t.delImg(e,n)}}},[s("img",{attrs:{src:i("Xmmv")}})])])}),t._v(" "),s("li",{directives:[{name:"show",rawName:"v-show",value:t.imgList.length<6,expression:"imgList.length<6"}]},[s("img",{staticClass:"publish-icon",attrs:{src:i("rGQL")}}),t._v(" "),s("input",{ref:"imgInput",attrs:{type:"file",accept:"image/*",name:"file[]",id:"publish-img"},on:{change:function(e){t.uploadImg(e)}}})])],2)])},staticRenderFns:[]},a=i("OF7X")(s,n,!1,function(t){i("UNHm")},null,null);e.a=a.exports},UNHm:function(t,e){},aamZ:function(t,e,i){"use strict";var s={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"refund-text",attrs:{id:"textArea"}},[i("textarea",{directives:[{name:"model",rawName:"v-model",value:t.value,expression:"value"}],ref:"textArea",attrs:{name:"refund",placeholder:t.placeholder,maxlength:t.maxlength},domProps:{value:t.value},on:{input:[function(e){e.target.composing||(t.value=e.target.value)},t.getTextarea]}}),t._v(" "),t.maxlength?i("span",[t._v(t._s(t.value.length)+"/"+t._s(t.maxlength))]):t._e()])},staticRenderFns:[]},n=i("OF7X")({props:["maxlength","placeholder"],data:function(){return{value:""}},methods:{getTextarea:function(t){this.$emit("change",this.value)}}},s,!1,function(t){i("p+0C")},null,null);e.a=n.exports},"p+0C":function(t,e){},yw3Q:function(t,e){}});
//# sourceMappingURL=9.3fc4799e5e57dc1500e0.js.map