webpackJsonp([43],{DqDD:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={data:function(){return{mobile:"",code:"",sended:!1,btnText:"获取验证码",checkKey:""}},computed:{isFinish:function(){return!(!this.code||!this.mobile)}},methods:{getSMSCode:function(){var e=this;if(this.sended)return!1;var t={a:1,type:3,mobile:this.mobile};this.$Api.SMSCode(t).then(function(t){if(console.log(t),0==t.q.s){e.sended=!0,e.$toast("发送成功!"),e.checkKey=t.q.checkKey;for(var i=function(t){setTimeout(function(){e.btnText=t+"s",0==t&&(e.btnText="获取验证码",e.sended=!1)},1e3*(10-t-1))},n=10;n>=0;n--)i(n)}else e.$toast(t.q.d)})},submit:function(){var e=this;if(!this.isFinish)return!1;var t={a:2,type:3,mobile:this.mobile,code:this.code};this.$Api.SMSCode(t).then(function(t){0==t.q.s?e.$Api.MobileUpdate(e.mobile,"").then(function(t){console.log(t),0==t.q.s?e.$toast("修改成功"):e.$toast(t.q.d)}):e.$toast(t.q.d)})}}},s={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{attrs:{id:"editPhone"}},[i("common-header",{attrs:{title:"修改手机"}}),e._v(" "),i("div",{staticClass:"input"},[i("input",{directives:[{name:"model",rawName:"v-model",value:e.mobile,expression:"mobile"}],attrs:{type:"text",placeholder:"手机号码"},domProps:{value:e.mobile},on:{input:function(t){t.target.composing||(e.mobile=t.target.value)}}})]),e._v(" "),i("div",{staticClass:"input"},[i("input",{directives:[{name:"model",rawName:"v-model",value:e.code,expression:"code"}],attrs:{type:"text",placeholder:"短信验证码"},domProps:{value:e.code},on:{input:function(t){t.target.composing||(e.code=t.target.value)}}}),e._v(" "),i("span",{staticClass:"btn",class:{sended:e.sended},on:{click:e.getSMSCode}},[e._v(e._s(e.btnText))])]),e._v(" "),i("div",{staticClass:"info"},[e._v("验证码已发送至手机： 138*****888")]),e._v(" "),i("div",{staticClass:"finish__btn",class:{active:e.isFinish},on:{click:e.submit}},[e._v("完成")])],1)},staticRenderFns:[]},o=i("OF7X")(n,s,!1,function(e){i("Ki94")},null,null);t.default=o.exports},Ki94:function(e,t){}});
//# sourceMappingURL=43.9acd02fbef2ba038096d.js.map