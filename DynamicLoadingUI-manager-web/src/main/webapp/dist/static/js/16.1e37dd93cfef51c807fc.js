webpackJsonp([16],{TlrB:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var A=s("AJcs"),o=s.n(A),i={data:function(){return{psw:"",tabIndex:1,showPsw:!1,showForget:!1,showReset:!1,login:{mobile:"",password:""},forget:{mobile:"",code:"",count:0,isSend:!1,password:""},register:{mobile:"",code:"",password:"",isSend:!1,count:0,checkKey:""}}},watch:{},computed:{loginActive:function(){return 11==this.login.mobile.length&&this.login.password.length>=6},forgetActive:function(){return 11==this.forget.mobile.length&&this.forget.code.length>0},registerActive:function(){var e=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;return console.log(e.test(this.register.password)),!!(e.test(this.register.password)&&11==this.register.mobile.length&&this.register.code.length>=6)},finishActive:function(){var e=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;return console.log(e.test(this.forget.password)),!!e.test(this.forget.password)}},methods:{changeType:function(e){this.tabIndex=e,this.showForget=!1},changeShow:function(){this.showPsw=!this.showPsw},resetPsw:function(){this.showForget=!0},nextStep:function(){this.forgetActive&&this.submitForgetCode()},finish:function(){this.getUserResetPassword()},loginSubmit:function(){var e=this,t={a:1,name:this.login.mobile,password:o()(this.login.password)};this.$Api.UserLogin(t).then(function(t){console.log(t),0==t.q.s?e.$router.replace({name:"Index"}):e.$toast("登录失败")})},forgetCode:function(){if(11==this.forget.mobile.length){if(console.log(this.forget.count),this.forget.count>0)return;this.forget.count=60,this.forget.isSend=!0,this.forgetCountDown(),this.getForgetCode()}else this.$toast("请输入正确手机号")},phoneCode:function(){if(11==this.register.mobile.length){if(console.log(this.register.count),this.register.count>0)return;this.register.count=60,this.register.isSend=!0,this.countDown(),this.getSMSCode()}else this.$toast("请输入正确手机号")},forgetCountDown:function(){var e=this,t=setInterval(function(){e.forget.count--,e.forget.count<=0&&(e.forget.count=0,clearInterval(t))},1e3)},countDown:function(){var e=this,t=setInterval(function(){e.register.count--,e.register.count<=0&&(e.register.count=0,clearInterval(t))},1e3)},getUserResetPassword:function(){var e=this,t={name:this.forget.mobile,password:o()(this.forget.password)},s=this.forget.checkKey;this.$Api.UserResetPassword(t,s).then(function(t){console.log(t),0==t.q.s?e.$popup({showCancel:!1,sureText:"确定",title:"设置成功",content:"新密码设置成功,请重新登录"}).then(function(t){"sure"==t&&(e.showForget=!1,e.showReset=!1,e.forget={mobile:"",code:"",count:0,isSend:!1,password:""})}):e.$toast("重置失败")})},hidePhone:function(){this.register.isSend=!1,this.forget.isSend=!1},getSMSCode:function(){var e=this,t={a:1,type:1,mobile:this.register.mobile};this.$Api.SMSCode(t).then(function(t){console.log(t),0==t.q.s?(e.$toast("发送成功!"),e.register.checkKey=t.q.checkKey):e.$toast(t.q.d)})},getForgetCode:function(){var e=this,t={a:1,type:2,mobile:this.forget.mobile};this.$Api.SMSCode(t).then(function(t){console.log(t),0==t.q.s?(e.$toast("发送成功!"),e.forget.checkKey=t.q.checkKey):e.$toast(t.q.d)})},submitSmsCode:function(){var e=this,t={a:2,type:1,mobile:this.register.mobile,checkKey:this.register.checkKey,code:this.register.code};this.$Api.SMSCode(t).then(function(t){console.log(t),0==t.q.s?e.$router.push({name:"ImproveInformation",params:{psw:e.register.password}}):e.$toast("手机验证码出错")})},submitForgetCode:function(){var e=this,t={a:2,type:2,mobile:this.forget.mobile,checkKey:this.forget.checkKey,code:this.forget.code};this.$Api.SMSCode(t).then(function(t){console.log(t),0==t.q.s?e.showReset=!0:e.$toast("手机验证码出错")})}}},c={render:function(){var e=this,t=e.$createElement,A=e._self._c||t;return A("div",{attrs:{id:"register"}},[A("div",{staticClass:"main"},[A("img",{staticClass:"login-logo",attrs:{src:s("QQ3S")}}),e._v(" "),A("div",{staticClass:"register-main"},[A("div",{staticClass:"title"},[A("span",{class:{active:1==e.tabIndex},on:{click:function(t){e.changeType(1)}}},[e._v("登录")]),e._v(" "),A("span",{class:{active:2==e.tabIndex},on:{click:function(t){e.changeType(2)}}},[e._v("注册")])]),e._v(" "),A("div",{directives:[{name:"show",rawName:"v-show",value:1==e.tabIndex,expression:"tabIndex == 1"}],staticClass:"login-wrap"},[A("div",{directives:[{name:"show",rawName:"v-show",value:!e.showForget,expression:"!showForget"}],staticClass:"login-mian"},[A("input",{directives:[{name:"model",rawName:"v-model",value:e.login.mobile,expression:"login.mobile"}],staticClass:"bb-ccc",attrs:{type:"tel",maxlength:"11",placeholder:"请输入手机号码"},domProps:{value:e.login.mobile},on:{input:function(t){t.target.composing||e.$set(e.login,"mobile",t.target.value)}}}),e._v(" "),A("div",{staticClass:"psw-wrap"},[e.showPsw?e._e():A("input",{directives:[{name:"model",rawName:"v-model",value:e.login.password,expression:"login.password"}],staticClass:"bb-ccc",attrs:{type:"password",placeholder:"请输入登录密码"},domProps:{value:e.login.password},on:{input:function(t){t.target.composing||e.$set(e.login,"password",t.target.value)}}}),e._v(" "),e.showPsw?A("input",{directives:[{name:"model",rawName:"v-model",value:e.login.password,expression:"login.password"}],staticClass:"bb-ccc",attrs:{type:"text",placeholder:"请输入登录密码"},domProps:{value:e.login.password},on:{input:function(t){t.target.composing||e.$set(e.login,"password",t.target.value)}}}):e._e(),e._v(" "),e.showPsw?e._e():A("img",{staticClass:"eye-img",attrs:{src:s("tRbp")},on:{click:e.changeShow}}),e._v(" "),e.showPsw?A("img",{staticClass:"eye-img",attrs:{src:s("fyHS")},on:{click:e.changeShow}}):e._e()]),e._v(" "),A("div",{staticClass:"forget-text",on:{click:e.resetPsw}},[e._v("忘记密码？")]),e._v(" "),A("div",{staticClass:"login-btn btn",class:{active:e.loginActive},on:{click:e.loginSubmit}},[e._v("登录")])]),e._v(" "),A("div",{directives:[{name:"show",rawName:"v-show",value:e.showForget,expression:"showForget"}],staticClass:"login-forget"},[A("div",{directives:[{name:"show",rawName:"v-show",value:!e.showReset,expression:"!showReset"}]},[A("input",{directives:[{name:"model",rawName:"v-model",value:e.forget.mobile,expression:"forget.mobile"}],staticClass:"bb-ccc",attrs:{type:"tel",maxlength:"11",placeholder:"请输入手机号码"},domProps:{value:e.forget.mobile},on:{input:[function(t){t.target.composing||e.$set(e.forget,"mobile",t.target.value)},e.hidePhone]}}),e._v(" "),A("div",{staticClass:"phone-code bb-ccc"},[A("input",{directives:[{name:"model",rawName:"v-model",value:e.forget.code,expression:"forget.code"}],staticClass:"bb-ccc input-code",attrs:{type:"text",maxlength:"6",placeholder:"请输入短信验证码"},domProps:{value:e.forget.code},on:{input:function(t){t.target.composing||e.$set(e.forget,"code",t.target.value)}}}),e._v(" "),A("div",{staticClass:"get-code",class:{"c-999":e.forget.count>0},on:{click:e.forgetCode}},[e._v(e._s(e.forget.count>0?"("+e.forget.count+"s)":"获取验证码"))]),e._v(" "),e.forget.isSend?A("p",{staticClass:"remind"},[e._v("验证码已发送至手机："+e._s(e.forget.mobile))]):e._e()]),e._v(" "),A("div",{staticClass:"forget-btn btn",class:{active:e.forgetActive},on:{click:e.nextStep}},[e._v("下一步")])]),e._v(" "),A("div",{directives:[{name:"show",rawName:"v-show",value:e.showReset,expression:"showReset"}]},[A("input",{directives:[{name:"model",rawName:"v-model",value:e.forget.password,expression:"forget.password"}],staticClass:"bb-ccc",attrs:{type:"password",placeholder:"请设置密码（6-16位字母和数字组合）"},domProps:{value:e.forget.password},on:{input:function(t){t.target.composing||e.$set(e.forget,"password",t.target.value)}}}),e._v(" "),A("div",{staticClass:"btn",class:{active:e.finishActive},on:{click:e.finish}},[e._v("完成")])])])]),e._v(" "),A("div",{directives:[{name:"show",rawName:"v-show",value:2==e.tabIndex,expression:"tabIndex == 2"}],staticStyle:{"margin-top":"0.4rem"}},[A("input",{directives:[{name:"model",rawName:"v-model",value:e.register.mobile,expression:"register.mobile"}],staticClass:"bb-ccc",attrs:{type:"tel",maxlength:"11",placeholder:"请输入手机号码"},domProps:{value:e.register.mobile},on:{input:[function(t){t.target.composing||e.$set(e.register,"mobile",t.target.value)},e.hidePhone]}}),e._v(" "),A("div",{staticClass:"phone-code bb-ccc"},[A("input",{directives:[{name:"model",rawName:"v-model",value:e.register.code,expression:"register.code"}],staticClass:"bb-ccc input-code",attrs:{type:"text",placeholder:"请输入短信验证码"},domProps:{value:e.register.code},on:{input:function(t){t.target.composing||e.$set(e.register,"code",t.target.value)}}}),e._v(" "),A("div",{staticClass:"get-code",class:{"c-999":e.register.count>0},on:{click:e.phoneCode}},[e._v(e._s(e.register.count>0?"("+e.register.count+"s)":"获取验证码"))])]),e._v(" "),A("input",{directives:[{name:"model",rawName:"v-model",value:e.register.password,expression:"register.password"}],staticClass:"bb-ccc",attrs:{type:"password",placeholder:"请设置密码（6-16位字母和数字组合）"},domProps:{value:e.register.password},on:{input:function(t){t.target.composing||e.$set(e.register,"password",t.target.value)}}}),e._v(" "),e.register.isSend?A("p",{staticClass:"remind"},[e._v("验证码已发送至手机："+e._s(e.register.mobile))]):e._e(),e._v(" "),A("div",{staticClass:"btn",class:{active:e.registerActive},on:{click:e.submitSmsCode}},[e._v("下一步")]),e._v(" "),e._m(0)])])])])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("p",{staticClass:"agreement"},[this._v("已阅读并同意"),t("span",[this._v("《礼物飞注册协议》")])])}]},n=s("VU/8")(i,c,!1,function(e){s("bWmU")},null,null);t.default=n.exports},bWmU:function(e,t){},fyHS:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAYCAMAAACoeN87AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA3lBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACpNbQVAAAASXRSTlMABC9XcXx6aFMJsvOzDYDwXuv+5xCp1V0PDh3UkdAXHN2X2grR45ybSDc/0xqQJ+E8+7Fpcuop/fZiWSrPmAZwDM5vpujx38orYleyDgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAEUSURBVCjPrZLbUsIwEIa3JEWxFGgRioggtqgg5wqC5VTwxPu/kNbupoty44x7lf/LN5lNNgB/Ky0lpJ4+OU1px/cz4szYYxlZkfklmLn8/qDyOfPQKFi4YxeLNi6tAhPOS0jLTgXgwiljLFXIqF4iqmGbWg3BVT0GjWsEzeTcJqKbRpRcD2PLTRS3hdCL4C3dQef960TvAO7VNdtcaRO1O/CglC5Xugp70FPrPlf6CvfAHNBacEUQHXw98nCEYcyVMcLRMEp+0piqDk3Bj/Mj5smUjOkkJk8+EWeG051/T0Cb49Rnz8m5wYKaW0q5pAssAt7dak2/QZW1Xv34UxsZciGUm2NfM9juwhfj9e19t/2A/65PHs1gpkeKVHwAAAAASUVORK5CYII="},tRbp:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAYCAMAAACoeN87AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB2lBMVEUAAADNzc3Nzc3Nzc3MzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzNzc3Nzc3Nzc3MzMzMzMzMzMzMzMzMzMzNzc3Nzc3Nzc3MzMzMzMzMzMzMzMzMzMzNzc3Nzc3MzMzMzMzMzMzMzMzMzMzNzc3Nzc3MzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzNzc3Nzc3MzMzMzMzMzMzMzMzNzc3Nzc3Nzc3MzMzMzMzMzMzMzMzMzMzMzMzNzc3Nzc3Nzc3Nzc3MzMzMzMzMzMzMzMzMzMzNzc3Nzc3Nzc3MzMzNzc3Nzc3Nzc3MzMzNzc3Nzc3Nzc3MzMzMzMzMzMzNzc3Nzc3Nzc3MzMzMzMzNzc3Nzc3Nzc3MzMzNzc3Nzc3Nzc3Nzc3MzMzMzMzMzMzNzc3Nzc3Nzc3MzMzMzMzNzc3Nzc3Nzc3Nzc3MzMzMzMzMzMzNzc3Nzc3MzMzMzMzMzMzMzMzNzc3MzMzMzMzMzMzMzMzMzMzMzMzNzc3Nzc3MzMzMzMzMzMzMzMzNzc3Nzc3Nzc3MzMzMzMzNzc3Nzc3Nzc3Nzc3MzMzMzMzMzMzNzc3Nzc3Nzc3Nzc3MzMzMzMzMzMzMzMzMzMzNzc3Nzc3Nzc3Nzc3MzMwAAACFuKviAAAAnHRSTlMABmYBBC9XcXx6aFOu/T4JsvOzTrD8YQ2A8PVIsl9e6/7nR7ZejhCp1V0PDspGt1ybHdSRCbhZndAXHN2XCrn7V6DaCtHjvfpUnL/5UzcLwVE/0xoMwk2QJw7DS+EPxfhJPPuxx/dIaekbyfVHcuo7y0Qp/fY6zVRiWSrP6M5Gt5gGLs/0RbhwFdDyPYnODBbU8TtvpvHfKynZOgQUAhOGAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAY5JREFUKM9jYMAJGJmYMQVZWNnYOTi5uFlZQCp4ePnQ5PnZBATnQIGgkDCjiKgYqgJxCck5SEBKWkZUFlWFnDxUTkFRUQGoQklZVEVVDkmBmjpUgYamFgODtqaOrp6ovsGcOepaMBWGRlAVxiwQARNTUTNzkICFJUTAyhqqwgaqxdbO3sERIuRkBRJwdoGqcHWGqnBz93B2hQq6gAQ9Yb7ggKrw8vZhYOCAiRowMEjDPeoLVuHn7x0ApHxhogqBDEFwJcEgFSGh3mEgOhgu7MIQDmdHAGUio7yjwYZFwIXDGcRjYGw2BobYuPgEiIvYYKIx4gwMiUlQTjJDbEpqGtTjyVDBpEQQLx3Ky8jMys6BqghUgAqmQ/i5YH5efkF2IVRFUR5EQXE6LAY0S4BmlJZl55SDY4ClAhrrJZWIeKyqrimtza6rnxPTwM7eAPNAdRVyYmhsam5pbUNOMXPk2xtR0ktHZ1d3D7KCXvY+1BTVP2HiJKB1k6f01ghOnaYzZfJ0jHQ9Y+YsBkJgNh45AHyd1NTdhs1jAAAAAElFTkSuQmCC"}});
//# sourceMappingURL=16.1e37dd93cfef51c807fc.js.map