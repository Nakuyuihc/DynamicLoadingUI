webpackJsonp([37],{QXYs:function(t,s){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAbCAYAAAB1NA+iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADIWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlDNjk0MEE4NkMzNTExRTdCOUVGRTcxM0UwODgwOEI5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlDNjk0MEE5NkMzNTExRTdCOUVGRTcxM0UwODgwOEI5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUM2OTQwQTY2QzM1MTFFN0I5RUZFNzEzRTA4ODA4QjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUM2OTQwQTc2QzM1MTFFN0I5RUZFNzEzRTA4ODA4QjkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7t5cYzAAABvklEQVQ4T5WUzytlYRyH3+sPsBBJkpSMLETzDygLTEJC05SFjYWFjcWEBQtiYaOxYGFl4SYWt0nIGL+ThSz4NyS/Z0Q8n+/rcHHvPfc+9XTfz6nv55zznnNPJLoYcxmSj1HsxZMsHcmAAtzCGvyLVZkUFKKGyy05l43F6RYUoYbLLDl3j20YS6egGLex1JJz/7AFfyuEFZSghvUrblHDK5YgVYHOqGFdgdBwE65ZeiFZwRfUPevexQ1+ww1LcSQq0C5vonZdXGED6mo+8bGgAnVmPW9xgRretZSA+IJK1LDeNKHhOty3lISgoBp1f3mWnDvHWjy0lAIVfMU/mKsDcIYaPrIUggrGMMeSZwaP/TIcFbTjgSVPP/b4ZTgq0GbV454OQASnUH/XUIJNvEQ9rh1LvmQS+yylICgQ16gSvUQBE/jTLxMTXyD0vjfiuiXPOA745Wc+FgiVNOOqJc8oDvnlexIViDvU33bZkmcYR/zyjWQF4j+2YvxXdxB1S6+kKhD6dHXgkiWPNlWba4QVCJV8xwVLHj1ePeZIOgXiAX/gvCWPXrRf6RaIR+zEOUvOPeFpJgVCJV04i93OuelnkWROOxjvVgwAAAAASUVORK5CYII="},mcZN:function(t,s,i){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var a=i("AJcs"),e=i.n(a),n={data:function(){return{amount:this.$route.query.realAmount,showPaw:!1,paypsw:"",wxPayObj:"",isPaypw:""}},watch:{},created:function(){this.getUserDetails()},methods:{hidden:function(){this.showPaw=!1},forgetPsw:function(){this.$router.push({name:"EditPay"})},showRemind:function(){this.$popup({title:"",content:""}).then(function(t){console.log(t)})},payment:function(t){var s=this;1==t?this.getPaySubmit(11):2==t&&(1==this.isPaypw?this.showPaw=!0:this.$popup({title:"设置密码",content:"请先设置支付密码"}).then(function(t){console.log(t),"sure"==t&&s.$router.push({name:"EditPay",query:{type:1}})}))},getUserDetails:function(){var t=this;this.$Api.UserDetails(0).then(function(s){console.log(s),0==s.q.s&&(t.isPaypw=s.q.user.isPaypw)})},getPaySubmit:function(t){var s=this,i={};if(3==t){if(!(this.paypsw.length>0))return void this.$toast("请输入密码");i={a:0,payment:t,amount:this.amount,orderId:this.$route.query.orderId,psw:e()(this.$paykey+e()(this.paypsw))}}else 11==t&&(i={a:0,payment:t,amount:this.amount,orderId:this.$route.query.orderId});this.$Api.PaySubmit(i).then(function(i){console.log(i),s.paypsw="",0==i.q.s?3==t?s.$router.replace({name:"PaySuccess"}):11==t&&(s.wxPayObj=JSON.parse(i.q.wxPay),s.onBridgeReady()):s.$toast(i.q.d)})},onBridgeReady:function(){var t=this;console.log(this.wxPayObj),WeixinJSBridge.invoke("getBrandWCPayRequest",{appId:this.wxPayObj.appId,timeStamp:this.wxPayObj.timeStamp,nonceStr:this.wxPayObj.nonceStr,package:this.wxPayObj.package,signType:this.wxPayObj.signType,paySign:this.wxPayObj.paySign},function(s){console.log(s),"get_brand_wcpay_request:ok"==s.err_msg&&t.$router.replace({name:"PaySuccess"})})},wxPay:function(){wx.chooseWXPay({timestamp:this.wxPayObj.timestamp,nonceStr:this.wxPayObj.nonceStr,package:this.wxPayObj.package,signType:this.wxPayObj.signType,paySign:this.wxPayObj.paySign,success:function(t){console.log(t)},error:function(t){this.isPay=!0}})}}},c={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{attrs:{id:"cashier"}},[a("commonHeader",{attrs:{title:"收银台"}}),t._v(" "),a("div",{staticClass:"cell bg-fff bor-none mb-20"},[t._v("\n\t\t订单金额\n\t\t"),a("span",{staticClass:"fl-right",staticStyle:{color:"#fe4436"}},[t._v("￥"+t._s(t.amount))])]),t._v(" "),a("div",{staticClass:"cell bg-fff"},[t._v("选择付款方式")]),t._v(" "),a("div",{staticClass:"cell bg-fff",staticStyle:{height:"1.87rem"},on:{click:function(s){t.payment(1)}}},[t._m(0)]),t._v(" "),a("div",{staticClass:"cell bg-fff",staticStyle:{height:"1.87rem"},on:{click:function(s){t.payment(2)}}},[t._m(1)]),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:t.showPaw,expression:"showPaw"}],staticClass:"shadow"},[a("div",{staticClass:"psw-wrap"},[a("div",{staticClass:"title"},[a("img",{staticClass:"lt-arrow",attrs:{src:i("QXYs")},on:{click:t.hidden}}),t._v(" 请输入支付密码\n\t\t\t")]),t._v(" "),a("div",{staticClass:"content"},[a("div",{staticClass:"psw-input"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.paypsw,expression:"paypsw"}],attrs:{type:"password",name:"",placeholder:"支付密码"},domProps:{value:t.paypsw},on:{input:function(s){s.target.composing||(t.paypsw=s.target.value)}}}),a("span",{staticClass:"payment-btn active",on:{click:function(s){t.getPaySubmit(3)}}},[t._v("付款")])])])])])],1)},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"weixin"},[s("span",{staticClass:"pay-type"},[this._v("微信支付")]),this._v(" "),s("span",{staticClass:"pay-remind"},[this._v("推荐使用")]),this._v(" "),s("img",{staticClass:"arrow_gray",attrs:{src:i("R8dh")}})])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"wallet"},[s("span",{staticClass:"pay-type"},[this._v("我的钱包")]),this._v(" "),s("span",{staticClass:"pay-remind"},[this._v("使用钱包余额支付")]),this._v(" "),s("img",{staticClass:"arrow_gray",attrs:{src:i("R8dh")}})])}]},o=i("VU/8")(n,c,!1,function(t){i("vtDN")},null,null);s.default=o.exports},vtDN:function(t,s){}});
//# sourceMappingURL=37.cd92eef1d27e7e9819f4.js.map