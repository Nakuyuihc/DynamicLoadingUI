webpackJsonp([63],{"oES+":function(t,e){},uAa0:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=s("AJcs"),i=s.n(a),n={data:function(){return{name:"",avatar:"",psw:"",hasUpLoad:!1,cos:"",accessUrl:"",sourceUrl:"",oFile:""}},watch:{},computed:{noEmpty:function(){return this.name.length>0}},created:function(){this.psw=this.$route.params.psw},methods:{uploadImg:function(){var t=this;this.hasUpLoad=!0;var e=document.getElementById("image_input").files[0];this.oFile=e;var s=e.name,a=new FileReader,i={a:1,type:1,filename:s,oFile:e};this.getExternalUploadObject(i),a.readAsDataURL(e),a.onload=function(e){t.avatar=e.currentTarget.result,document.getElementById("image_input").value=""}},getExternalUploadObject:function(t){var e=this;this.$Api.getExternalUploadObject(t).then(function(t){console.log(t),0==t.q.s&&(e.cos=t.q.cos,e.accessUrl=t.q.cos.accessUrl,e.sourceUrl=t.q.cos.sourceUrl)})},getExternalFilesSubmit:function(){var t=this,e=[],s={accessUrl:this.accessUrl,sourceUrl:this.sourceUrl};e.push(s),this.$Api.getExternalFilesSubmit(1,1,e).then(function(e){if(console.log(e),0==e.q.s){var s=e.q.files[0].id;t.upLoadToCos(),t.SetImage(s)}})},SetImage:function(t){this.$Api.SetImage(2,t).then(function(t){console.log(t)})},upLoadToCos:function(){var t=this.cos.url,e=this.oFile;this.$upLoadToCos(t,e)},finish:function(){this.hasUpLoad&&this.getExternalFilesSubmit(),this.getUserRegisterSubmit()},getUserRegisterSubmit:function(){var t=this,e={name:this.name,sex:1,password:i()(this.$paykey+i()(this.psw))};this.$Api.UserRegisterSubmit(e).then(function(e){console.log(e),0==e.q.s?t.$router.replace({name:"Index"}):t.$toast(e.q.d)})}}},o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"improve-info"}},[a("div",{staticClass:"main"},[a("img",{staticClass:"login-logo",attrs:{src:s("QQ3S")}}),t._v(" "),a("div",{staticClass:"improve-main"},[a("h3",[t._v("完善信息")]),t._v(" "),a("div",{staticClass:"info-avatar"},[""==t.avatar?a("span",[t._v("头像")]):a("img",{staticClass:"avatar",attrs:{src:t.avatar}}),t._v(" "),a("input",{attrs:{type:"file",accept:"image/*",id:"image_input"},on:{change:t.uploadImg}})]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],staticClass:"bb-ccc",attrs:{type:"text",placeholder:"请输入昵称"},domProps:{value:t.name},on:{input:function(e){e.target.composing||(t.name=e.target.value)}}}),t._v(" "),a("div",{staticClass:"btn",class:{active:t.noEmpty},on:{click:t.finish}},[t._v("完成")])])])])},staticRenderFns:[]},r=s("VU/8")(n,o,!1,function(t){s("oES+")},null,null);e.default=r.exports}});
//# sourceMappingURL=63.ab0fac2d87b94af5f90a.js.map