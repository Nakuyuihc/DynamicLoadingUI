webpackJsonp([14],{BO1k:function(t,e,s){t.exports={default:s("fxRn"),__esModule:!0}},fxRn:function(t,e,s){s("+tPU"),s("zQR9"),t.exports=s("g8Ux")},g8Ux:function(t,e,s){var r=s("77Pl"),i=s("3fs2");t.exports=s("FeBl").getIterator=function(t){var e=i(t);if("function"!=typeof e)throw TypeError(t+" is not iterable!");return r(e.call(t))}},wIaJ:function(t,e){},z0Uk:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=s("mvHQ"),i=s.n(r),o=s("BO1k"),a=s.n(o),n={data:function(){return{itemList:[{text:"存入礼物包",id:1},{text:"实物发货",id:0}],showType:!0,showOrderType:!1,orderType:1,orderList:[],shopPrices:[],couponPrices:[],inputs:[],payment:0,confirmAddress:"",goodsAmount:0,reductionAmount:0,realAmount:0,orderId:"",action:this.$route.query.action,type:this.$route.query.type}},watch:{},components:{BottomPopup:s("VO0z").a},computed:{getMobile:function(){if(this.confirmAddress){var t=this.confirmAddress.mobile.toString();return t.substring(0,3)+"****"+t.substring(7,11)}},totalPrices:function(){var t=0,e=!0,s=!1,r=void 0;try{for(var i,o=a()(this.shopPrices);!(e=(i=o.next()).done);e=!0){t+=i.value}}catch(t){s=!0,r=t}finally{try{!e&&o.return&&o.return()}finally{if(s)throw r}}return t},totalCoupon:function(){var t=0,e=!0,s=!1,r=void 0;try{for(var i,o=a()(this.couponPrices);!(e=(i=o.next()).done);e=!0){t+=i.value}}catch(t){s=!0,r=t}finally{try{!e&&o.return&&o.return()}finally{if(s)throw r}}return t}},created:function(){this.initOrderType(),this.initOrderList(),this.initInput(),this.getOrderSubmit(2,1),this.newGetsubmit()},mounted:function(){this.initAddress()},methods:{newGetsubmit:function(){var t=JSON.parse(localStorage.getItem("goods")),e=(JSON.parse(localStorage.getItem("goodsImmediately")),{a:1,type:5,sendType:0,addresId:0,shops:[{orgId:t.orgSummery.orgId,note:"",coupons:"",goodsList:[{skuId:t.skuId,spuId:t.spuId,num:parseInt(this.$route.query.num),promId:0,customId:parseInt(this.$route.query.id),storeId:0,packingId:0}]}]});console.log(e),this.$Api.getOrderSubmit1(e).then(function(t){console.log(t.q.d)})},showOT:function(){this.showOrderType=!0},initOrderList:function(){var t=this,e=JSON.parse(localStorage.getItem("goods")),s=JSON.parse(localStorage.getItem("item")),r=JSON.parse(localStorage.getItem("List"));this.orderList=[{orgId:e.orgSummery.orgId,orgName:e.orgSummery.orgName,directSale:1,total:2,goodFreeShipping:0,cartInfos:[{id:0,spuId:e.spuId,skuId:e.skuId,customId:this.$route.query.id,promId:0,packing:{id:88,name:"大幅度",price:2,packingUnit:2},name:e.name,productSize:"",buyNum:this.$route.query.num,originalPrice:100,discountPrice:s.price,packPrice:0,imagePath:r[0].image.imagePath,inventory:2992,isInvalid:0,commentId:0,isChecked:!0}],isChecked:!1}],this.orderList.forEach(function(e){var s=0;e.cartInfos.forEach(function(t){t.packPrice&&t.packPrice>0?s+=t.buyNum*t.discountPrice+t.packPrice:s+=t.buyNum*t.discountPrice}),t.shopPrices.push(s)})},initOrderType:function(){if(localStorage.getItem("orderType")){var t=localStorage.getItem("orderType");this.orderType=parseInt(t)}},initAddress:function(){var t=this;if(localStorage.getItem("confirmAddress")){var e=JSON.parse(localStorage.getItem("confirmAddress"));this.confirmAddress=e,console.log(e)}else this.$Api.getShippingAddressList().then(function(e){if(console.log(e),0==e.q.s&&e.q.total>0){e.q.addresses.forEach(function(e){1==e.selected&&(console.log(e),t.confirmAddress=e)})}})},initInput:function(){localStorage.getItem("inputs")&&(this.inputs=JSON.parse(localStorage.getItem("inputs")))},setInputValue:function(){var t=this,e=this.$refs.input;this.inputs=[],e.forEach(function(e){t.inputs.push(e.value)});var s=i()(this.inputs);localStorage.setItem("inputs",s)},clearStorage:function(){localStorage.removeItem("orderType"),localStorage.removeItem("orderList"),localStorage.removeItem("confirmAddress"),localStorage.removeItem("inputs"),localStorage.removeItem("giftObj")},getBottomPopup:function(t){localStorage.removeItem("orderType"),"cancel"!=t&&(this.orderTypeText=t.text,this.orderType=t.id,localStorage.setItem("orderType",t.id)),this.showOrderType=!1},getOrderSubmit:function(t,e){var s=this,r=[];this.orderList.forEach(function(t,e){var i=[],o={};o.orgId=t.orgId,o.note=s.inputs[e],o.coupons="",t.cartInfos.forEach(function(t,e){var s={};s.skuId=t.skuId,s.spuId=t.spuId,s.num=t.buyNum,s.promId=t.promId,s.customId=t.customId,s.packingId=t.packing.id,s.storeId=t.storeId,i.push(s)}),o.goodsList=i,r.push(o)}),console.log(r);var i={a:t,t:e,sendType:this.orderType,addresId:"1"==this.orderType?"0":this.confirmAddress.id,shops:r};console.log(i),this.$Api.getOrderSubmit(i).then(function(t){if(0==t.q.s){if(s.goodsAmount=t.q.goodsAmount,s.realAmount=t.q.realAmount,s.reductionAmount=t.q.reductionAmount,s.orderId=t.q.orderId,1==i.a||3==i.a)if(s.clearStorage(),s.$call.testType().wechat)s.$router.replace({name:"Cashier",query:{orderId:s.orderId,realAmount:s.realAmount}});else{var e={action:0,amount:s.realAmount,orderId:s.orderId};checkOutCounter(e)}}else s.$toast(t.q.d)})},linkToCashier:function(){this.action,this.type;0==this.orderType?this.confirmAddress.id?this.getOrderSubmit(this.action,this.type):this.$toast("请填写完整的地址信息"):1==this.orderType&&this.getOrderSubmit(this.action,this.type),this.setInputValue()}}},c={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"confirm-order"}},[r("common-header",{attrs:{title:"确认定制"}}),t._v(" "),t.showType?r("div",{staticClass:"cell bg-fff",on:{click:t.showOT}},[t._v("\n      赠礼类型\n      "),r("span",{directives:[{name:"show",rawName:"v-show",value:1===t.orderType,expression:"orderType===1"}],staticClass:"fl-right"},[t._v("存入礼物包")]),t._v(" "),r("span",{directives:[{name:"show",rawName:"v-show",value:0===t.orderType,expression:"orderType===0"}],staticClass:"fl-right"},[t._v("实物发货")]),t._v(" "),r("img",{staticClass:"arrow_gray",attrs:{src:s("R8dh")}})]):t._e(),t._v(" "),t.showType?t._e():r("div",{staticClass:"cell bg-fff"},[t._v("赠礼类型\n      "),r("span",{directives:[{name:"show",rawName:"v-show",value:1===t.orderType,expression:"orderType===1"}],staticClass:"fl-right"},[t._v("存入礼物包")])]),t._v(" "),r("div",{directives:[{name:"show",rawName:"v-show",value:0===t.orderType,expression:"orderType===0"}],staticClass:"order-address bg-fff",on:{click:function(e){t.linkTo("ConfirmAddress")}}},[r("div",{staticClass:"address-info"},[t.confirmAddress?[r("div",{staticClass:"name-phone clearfix"},[r("span",{staticClass:"fl-left"},[t._v("收货人："+t._s(t.confirmAddress.name))]),t._v(" "),r("span",{staticClass:"fl-right"},[t._v(t._s(t.getMobile))])]),t._v(" "),r("div",{staticClass:"address-detail"},[t._v("\n\t          "+t._s(t.confirmAddress.regionInfo[0].region.name)+t._s(t.confirmAddress.regionInfo[1].region.name)+t._s(t.confirmAddress.regionInfo[2].region.name)+t._s(t.confirmAddress.street)+"\n\t        ")]),t._v(" "),r("img",{staticClass:"arrow_gray",attrs:{src:s("R8dh")}})]:[t._v("未选择")]],2),t._v(" "),r("img",{staticClass:"address-bor",attrs:{src:s("9JnP")}})]),t._v(" "),r("div",{staticClass:"order-detail"},t._l(t.orderList,function(e,i){return r("div",{staticClass:"detail-shop bg-fff"},[r("div",{staticClass:"cell text-over"},[t._v(t._s(e.orgName))]),t._v(" "),r("div",{staticClass:"good-list"},[t._l(e.cartInfos,function(e,s){return r("div",{staticClass:"list-item clearfix"},[r("div",{staticClass:"item-img fl-left"},[r("img",{attrs:{src:e.imagePath,alt:""}})]),t._v(" "),r("div",{staticClass:"item-info fl-left"},[r("div",{staticClass:"title"},[t._v(t._s(e.name))]),t._v(" "),r("div",{staticClass:"goods-prices"},[r("span",{staticClass:"price"},[r("em",{staticStyle:{"font-size":"0.32rem"}},[t._v("￥")]),t._v(t._s(e.discountPrice))]),t._v(" "),r("span",{staticClass:"item-count fl-right"},[t._v("x"+t._s(e.buyNum))])])])])}),t._v(" "),r("div",{staticClass:"cell bg-fff",on:{click:function(e){t.linkTo("ConfirmCoupon")}}},[r("span",[t._v("优惠券")]),t._v(" "),r("span",{staticClass:"span-tag"},[t._v("0张可用")]),t._v(" "),r("span",{staticClass:"fl-right"},[t._v("未选择")]),t._v(" "),r("img",{staticClass:"arrow_gray",attrs:{src:s("R8dh")}})]),t._v(" "),r("div",{staticClass:"cell bg-fff"},[t._v("\n            买家留言\n            "),r("input",{ref:"input",refInFor:!0,staticClass:"order-msg fl-right",attrs:{type:"text",placeholder:"选填"},domProps:{value:t.inputs[i]},on:{input:t.setInputValue}})]),t._v(" "),r("div",{staticClass:"cell bg-fff",staticStyle:{border:"none"}},[r("span",{staticClass:"fl-right",staticStyle:{"margin-right":"0"}},[t._v("合计： "),r("em",{staticStyle:{color:"#fe4436"}},[t._v("￥"+t._s(t.shopPrices[i]))])])])],2)])})),t._v(" "),r("div",{staticClass:"detail-shop order-price bg-fff"},[r("div",{staticStyle:{"margin-bottom":"0.32rem"}},[t._v("总金额"),r("span",{staticClass:"fl-right",staticStyle:{color:"#fe4436"}},[t._v(t._s(t.shopPrices[0]))])]),t._v(" "),r("div",[t._v("优惠券"),r("span",{staticClass:"fl-right",staticStyle:{color:"#fe4436"}},[t._v(" -￥"+t._s(t.reductionAmount))])])]),t._v(" "),r("div",{staticClass:"footer"},[r("div",{staticClass:"fl-right"},[r("span",{staticClass:"total-price"},[t._v("实付款：")]),t._v(" "),r("span",{staticClass:"price"},[t._v("￥"+t._s(t.shopPrices[0]))]),t._v(" "),r("span",{staticClass:"goods-account",on:{click:t.linkToCashier}},[t._v("提交订单")])])]),t._v(" "),t.showOrderType?r("div",{staticClass:"shadow"},[r("BottomPopup",{attrs:{itemList:t.itemList},on:{selItem:t.getBottomPopup}})],1):t._e()],1)},staticRenderFns:[]},d=s("VU/8")(n,c,!1,function(t){s("wIaJ")},null,null);e.default=d.exports}});
//# sourceMappingURL=14.4378ae63346208419ba6.js.map