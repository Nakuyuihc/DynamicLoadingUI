webpackJsonp([42],{URgi:function(t,s){},"zr3+":function(t,s,i){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var a=i("mvHQ"),e=i.n(a),n=i("woOf"),c=i.n(n),o={data:function(){return{active:"1",value:1,num:1,giftObj:"",giftType:1,goodses:[],PARAMS:{pa:1,li:9999,ob:1}}},created:function(){this.getGiftGoodsList(1)},methods:{changeType:function(t){switch(this.active=t,document.documentElement.scrollTop=0,this.goodses=[],this.PARAMS=c()({},this.PARAMS,{pa:1}),t){case 1:this.getGiftGoodsList(1),this.giftType=1;break;case 2:this.giftType=5,this.getGiftGoodsList(5);break;case 3:this.giftType=21,this.getGiftGoodsList(21)}},valChange:function(t){this.value+=t},getCheckedIndex:function(t){console.log(t)},checked:function(t,s){this.$emit("checked",s),console.log(t,s),this.num=t.num,this.giftObj=t},confirmGift:function(){if(this.giftObj){console.log(this.giftObj),this.$set(this.giftObj,"num",this.value);var t=e()(this.giftObj);this.$router.push({name:"SendGift",query:{giftObj:t,type:this.giftType}})}else this.$toast("请选择礼物!")},getGiftGoodsList:function(t){var s=this;this.$Api.getGiftGoodsList(t,this.PARAMS).then(function(t){console.log(t),0==t.q.s&&(s.goodses=t.q.goodses)})}},components:{Counter:i("iASY").a}},l={render:function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("div",{attrs:{id:"send-gift-list"}},[i("commonHeader",{attrs:{title:"选择礼物"}}),t._v(" "),i("div",{staticClass:"gift__tab"},[i("span",{staticClass:"tab",class:{active:1==t.active},attrs:{"data-id":"1"},on:{click:function(s){t.changeType(1)}}},[t._v("实物礼物")]),t._v(" "),i("span",{staticClass:"tab",class:{active:2==t.active},attrs:{"data-id":"2"},on:{click:function(s){t.changeType(2)}}},[t._v("定制礼物")]),t._v(" "),i("span",{staticClass:"tab",class:{active:3==t.active},attrs:{"data-id":"3"},on:{click:function(s){t.changeType(3)}}},[t._v("虚拟礼物")])]),t._v(" "),0==t.goodses.length?[i("div",[t._v("暂无数据")])]:[i("div",{staticClass:"list-wrap"},t._l(t.goodses,function(s,a){return i("div",{key:a,staticClass:"gift virtual"},[i("div",{staticClass:"gift__check"},[i("input",{staticClass:"radio",attrs:{type:"radio",name:"address"},on:{click:function(i){t.checked(s,a)}}})]),t._v(" "),i("div",{staticClass:"gift__left"},[i("img",{attrs:{src:s.imagePath,alt:""}})]),t._v(" "),i("div",{staticClass:"gift__right"},[i("div",{staticClass:"gift__right__name"},[t._v(t._s(s.name))]),t._v(" "),i("div",{staticClass:"gift__right__bottom"},["3"!=t.active?i("div",{staticClass:"bottom__price"},[t._v("￥"+t._s(s.price))]):t._e(),t._v(" "),i("div",{staticClass:"bottom__info"},["3"!=t.active?i("span",{staticClass:"user"},[t._v("赠送者："+t._s(0==s.senderId?"自购":s.senderName))]):t._e(),t._v(" "),"3"==t.active?i("span",{staticClass:"heart"},[i("span",{staticClass:"heart__icon"}),t._v(" "),i("span",{staticClass:"heart__num"},[t._v(t._s(s.price))])]):t._e(),t._v(" "),i("span",{staticClass:"num"},[t._v("x"+t._s(s.num))])])])])])}))],t._v(" "),i("div",{staticClass:"gift__bottom"},[i("div",{staticClass:"count"},[i("span",{staticClass:"count__text"},[t._v("数量")]),t._v(" "),i("Counter",{attrs:{num:t.value,max:t.num},on:{change:t.valChange}})],1),t._v(" "),i("div",{staticClass:"submit",on:{click:t.confirmGift}},[t._v("确定")])])],2)},staticRenderFns:[]},_=i("VU/8")(o,l,!1,function(t){i("URgi")},null,null);s.default=_.exports}});
//# sourceMappingURL=42.9e992668d66dd37cf75d.js.map