webpackJsonp([8],{"1XSb":function(t,i,s){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var e=s("IHPB"),n=s.n(e),a=s("i2Wk"),c=s("3EJX"),o={data:function(){return{isLoading:!0,loadingText:!1,isEmpty:!1,tabIndex:1,comments:[{id:1,name:"评论人",facePath:"/static/img/pic.603b63b.png",content:"内容",comTime:"2018-01-26",images:[{id:1,imagePath:"/static/img/pic.603b63b.png"}],starNum:5}],starType:0,imageType:0,pa:1,li:10,ob:1,ot:1}},created:function(){this.getCommentList()},methods:{changeRang:function(t){this.tabIndex=t,this.pa=1,this.starType=t-1,this.imageType=0,this.isLoading=!0,5==t&&(this.starType=0,this.imageType=1),this.getCommentList()},preview:function(){Object(c.ImagePreview)(["/static/img/pic.603b63b.png"])},loadMore:function(){this.isLoading||(this.isLoading=!0,this.pa+=1,this.getCommentList())},getCommentList:function(){var t=this,i=this.$route.params.id,s=this.starType,e=this.imageType,a={pa:this.pa,li:this.li,ob:this.ob,ot:this.ot};this.loadingText=!0,this.$Api.getCommentList(i,s,e,a).then(function(i){if(0==i.q.s){t.loadingText=!1;var s=t.comments;s.push.apply(s,n()(i.q.comments)),t.comments=s,i.q.total>t.pa*t.li?t.isLoading=!1:t.isLoading=!0}})}},components:{CommonHeader:a.a}},r={render:function(){var t=this,i=t.$createElement,s=t._self._c||i;return s("div",{attrs:{id:"comment"}},[s("common-header",{attrs:{title:"用户评价"}}),t._v(" "),s("div",{staticClass:"header"},[s("div",{class:{active:1==t.tabIndex},on:{click:function(i){t.changeRang(1)}}},[s("div",[t._v("全部评价")]),t._v(" "),s("div",{staticClass:"num"},[t._v("2560")])]),t._v(" "),s("div",{class:{active:2==t.tabIndex},on:{click:function(i){t.changeRang(2)}}},[s("div",[t._v("好评")]),t._v(" "),s("div",{staticClass:"num"},[t._v("2560")])]),t._v(" "),s("div",{class:{active:3==t.tabIndex},on:{click:function(i){t.changeRang(3)}}},[s("div",[t._v("中评")]),t._v(" "),s("div",{staticClass:"num"},[t._v("2560")])]),t._v(" "),s("div",{class:{active:4==t.tabIndex},on:{click:function(i){t.changeRang(4)}}},[s("div",[t._v("差评")]),t._v(" "),s("div",{staticClass:"num"},[t._v("2560")])]),t._v(" "),s("div",{class:{active:5==t.tabIndex},on:{click:function(i){t.changeRang(5)}}},[s("div",[t._v("晒图")]),t._v(" "),s("div",{staticClass:"num"},[t._v("2560")])])]),t._v(" "),t.comments.length>0?[s("div",{directives:[{name:"infinite-scroll",rawName:"v-infinite-scroll",value:t.loadMore,expression:"loadMore"}],staticClass:"comment-list",attrs:{"infinite-scroll-disabled":"loading","infinite-scroll-distance":"10"}},t._l(t.comments,function(i,e){return s("div",{staticClass:"list-wrap"},[s("div",{staticClass:"list-item clearfix"},[s("div",{staticClass:"item-img fl-left"},[s("img",{attrs:{src:i.facePath,alt:""}})]),t._v(" "),s("div",{staticClass:"item-info fl-left"},[s("h4",{staticClass:"text-over"},[t._v(t._s(i.name))]),t._v(" "),s("p",[t._v(t._s(i.comTime))]),t._v(" "),s("div",{staticClass:"start_sel"},[s("div",{staticClass:"star",class:"star-"+parseInt(i.starNum)})])])]),t._v(" "),s("p",{staticClass:"comment-desc"},[t._v(t._s(i.content))]),t._v(" "),i.images.length>0?s("div",{staticClass:"comment-imgs clearfix"},t._l(i.images,function(t,i){return s("img",{staticClass:"img-item",attrs:{src:t.imagePath,alt:""}})})):t._e()])}))]:[s("div",{staticClass:"remind-text"},[t._v("\n        "+t._s(t.loadingText?"加载中...":"暂无相关数据")+"\n      ")])]],2)},staticRenderFns:[]},l=s("OF7X")(o,r,!1,function(t){s("9/AF")},null,null);i.default=l.exports},"7n7e":function(t,i,s){s("wCtA"),s("PgA/"),t.exports=s("UusJ").Array.from},"9/AF":function(t,i){},IHPB:function(t,i,s){"use strict";i.__esModule=!0;var e=function(t){return t&&t.__esModule?t:{default:t}}(s("kfHR"));i.default=function(t){if(Array.isArray(t)){for(var i=0,s=Array(t.length);i<t.length;i++)s[i]=t[i];return s}return(0,e.default)(t)}},"PgA/":function(t,i,s){"use strict";var e=s("W0SX"),n=s("MITN"),a=s("NUpW"),c=s("iQda"),o=s("nR03"),r=s("sSQC"),l=s("cdm/"),d=s("X6b2");n(n.S+n.F*!s("A91l")(function(t){Array.from(t)}),"Array",{from:function(t){var i,s,n,v,m=a(t),u="function"==typeof this?this:Array,f=arguments.length,g=f>1?arguments[1]:void 0,h=void 0!==g,_=0,p=d(m);if(h&&(g=e(g,f>2?arguments[2]:void 0,2)),void 0==p||u==Array&&o(p))for(s=new u(i=r(m.length));i>_;_++)l(s,_,h?g(m[_],_):m[_]);else for(v=p.call(m),s=new u;!(n=v.next()).done;_++)l(s,_,h?c(v,g,[n.value,_],!0):n.value);return s.length=_,s}})},"cdm/":function(t,i,s){"use strict";var e=s("qRYU"),n=s("+BLA");t.exports=function(t,i,s){i in t?e.f(t,i,n(0,s)):t[i]=s}},kfHR:function(t,i,s){t.exports={default:s("7n7e"),__esModule:!0}}});
//# sourceMappingURL=8.56f173028e035b2e29fc.js.map