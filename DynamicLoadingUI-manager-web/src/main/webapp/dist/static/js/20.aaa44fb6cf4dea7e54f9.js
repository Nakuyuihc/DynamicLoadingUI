webpackJsonp([20],{Dp9j:function(t,s){},PsQl:function(t,s){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsBAMAAADsqkcyAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAALVBMVEUAAAAzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMAAABonvTaAAAADXRSTlMAEm927fluEZCJBpHuZ3zFZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxIAAAsSAdLdfvwAAABRSURBVCjPY2CgPeC9CwYXiBOmEbiLAfAJDwTgBYbEXRRqVJh0YdTwpKLwRWRhWbjwJWRhW5gwy9V0hGhZrAOUxYGa1CZAhbn2IIueXsBAWwAAMxGNxglj5UgAAAAASUVORK5CYII="},ZtLn:function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var i=e("mvHQ"),a=e.n(i),r=e("c/Tr"),c=e.n(r),A=e("lHA8"),n=e.n(A),o={data:function(){return{searchVal:"",historyArr:[],hotsearch:[]}},components:{SearchHeader:e("NYbx").a},created:function(){var t=localStorage.getItem("searchVal");t&&(this.historyArr=JSON.parse(t)),this.gethotsearch()},methods:{getSearchKey:function(t){this.searchVal=t},searchClick:function(){this.historyArr.push(this.searchVal);var t=new n.a(this.historyArr);this.historyArr=c()(t),localStorage.setItem("searchVal",a()(this.historyArr));localStorage.getItem("searchVal");this.toGoodsList(this.searchVal)},delClick:function(){var t=this;this.$popup({title:"确认删除全部历史记录?",content:""}).then(function(s){console.log(s),"sure"==s&&(t.historyArr=[],localStorage.removeItem("searchVal"))})},gethotsearch:function(){var t=this;this.$Api.getReferenceItemList("sys.other.hotsearch").then(function(s){console.log(s),0==s.q.s&&(t.hotsearch=s.q.items)})},searchKeyClick:function(t){this.toGoodsList(t)},toGoodsList:function(t){var s={a:1,type:1,searchKey:t};1==this.$route.query.id?s.type=2:s.type=1,this.$router.push({name:"GoodsList",query:s})}}},h={render:function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("div",{attrs:{id:"search"}},[i("search-header",{on:{change:t.getSearchKey}},[i("span",{staticClass:"search-btn",attrs:{slot:"icon"},on:{click:t.searchClick},slot:"icon"},[t._v("搜素")])]),t._v(" "),i("div",{staticClass:"search-container"},[i("div",{staticClass:"recent-search"},[i("div",{staticClass:"title"},[i("span",[t._v("最近搜索")]),t._v(" "),i("img",{staticClass:"del-icon",attrs:{src:e("PsQl")},on:{click:t.delClick}})]),t._v(" "),i("div",{staticClass:"recent-list list-wrap"},[i("ul",{staticClass:"clearfix"},t._l(t.historyArr,function(s,e){return i("li",{on:{click:function(e){t.searchKeyClick(s)}}},[t._v(t._s(s))])}))])]),t._v(" "),i("div",{staticClass:"hot-search"},[t._m(0),t._v(" "),i("div",{staticClass:"hot-list list-wrap"},[i("ul",{staticClass:"clearfix"},t._l(t.hotsearch,function(s,e){return i("li",{on:{click:function(e){t.searchKeyClick(s.value)}}},[t._v(t._s(s.value))])}))])])])],1)},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"title"},[s("span",[this._v("热搜")])])}]},l=e("VU/8")(o,h,!1,function(t){e("Dp9j")},null,null);s.default=l.exports}});
//# sourceMappingURL=20.aaa44fb6cf4dea7e54f9.js.map