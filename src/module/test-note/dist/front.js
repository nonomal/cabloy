(()=>{var t={645:(t,e,n)=>{"use strict";function r(t,e,n,r,o,a,i){try{var s=t[a](i),u=s.value}catch(t){return void n(t)}s.done?e(u):Promise.resolve(u).then(r,o)}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function a(t,e,n,r,o,a,i){try{var s=t[a](i),u=s.value}catch(t){return void n(t)}s.done?e(u):Promise.resolve(u).then(r,o)}function i(t,e,n,r,o,a,i){try{var s=t[a](i),u=s.value}catch(t){return void n(t)}s.done?e(u):Promise.resolve(u).then(r,o)}function s(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var a=t.apply(e,n);function s(t){i(a,r,o,s,u,"next",t)}function u(t){i(a,r,o,s,u,"throw",t)}s(void 0)}))}}n.d(e,{Z:()=>c});var u={type:"object",properties:{atomId:{type:"number"},atomName:{type:"string",ebType:"atom",ebTitle:"Note",ebParams:{target:"_self",atomClass:{module:"test-note",atomClassName:"note"},selectOptions:{},atomId:"atomId",mapper:{atomId:"atomId",atomName:"atomName"}}},atomStaticKey:{type:"string"}}};const c={listLayoutCard:{meta:{global:!1},props:{layoutManager:{type:Object},layoutConfig:{type:Object}},data:function(){return{}},created:function(){this.init()},beforeDestroy:function(){this.layoutManager.layout.instance===this&&(this.layoutManager.layout.instance=null)},methods:{init:function(){var t,e=this;return(t=regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.layoutManager.subnavbar_policyDefault(),t.next=3,e.layoutManager.data_providerSwitch({providerName:"continuous",autoInit:"search"!==e.layoutManager.container.scene});case 3:e.layoutManager.layout.instance=e;case 4:case"end":return t.stop()}}),t)})),function(){var e=this,n=arguments;return new Promise((function(o,a){var i=t.apply(e,n);function s(t){r(i,o,a,s,u,"next",t)}function u(t){r(i,o,a,s,u,"throw",t)}s(void 0)}))})()}},render:function(){var t=arguments[0];return t("div",[this.layoutManager.layout_renderBlock({blockName:"items"}),this.layoutManager.data_renderLoadMore()])}},listLayoutBlockCardItems:{meta:{global:!1},props:{layoutManager:{type:Object},layout:{type:Object},blockConfig:{type:Object}},data:function(){return{moduleMarkdownRender:null}},created:function(){this.__init()},methods:{__init:function(){var t,e=this;return(t=regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.$meta.module.use("a-markdownrender");case 2:e.moduleMarkdownRender=t.sent;case 3:case"end":return t.stop()}}),t)})),function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function s(t){a(i,r,o,s,u,"next",t)}function u(t){a(i,r,o,s,u,"throw",t)}s(void 0)}))})()},_getMarkdownHost:function(t){var e=t;return{atomId:e.atomId,atom:e}},_renderListItem:function(t){var e=this.$createElement,n=this.layoutManager.layout_renderBlock({blockName:"item",key:t.atomId,info:{item:t},listItem:!0});return e("f7-card",{key:t.atomId,class:"card-item col-100 medium-50 large-50"},[e("f7-card-header",[e("f7-list",[n])]),e("f7-card-content",{attrs:{padding:!0}},[e("eb-markdown-render",{attrs:{host:this._getMarkdownHost(t),html:t.html}})])])},_renderList:function(){if(!this.moduleMarkdownRender)return null;var t,e=[],n=function(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return o(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,a=function(){};return{s:a,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,s=!0,u=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return s=t.done,t},e:function(t){u=!0,i=t},f:function(){try{s||null==n.return||n.return()}finally{if(u)throw i}}}}(this.layoutManager.data_getItems());try{for(n.s();!(t=n.n()).done;){var r=t.value;e.push(this._renderListItem(r))}}catch(t){n.e(t)}finally{n.f()}return e}},render:function(){var t=arguments[0];return t("div",{class:"atom-list-layout-card-container row"},[this._renderList()])}},widgetNote:{installFactory:function(t){var e=t.prototype.$meta.module.get("a-dashboard").options.mixins.ebDashboardWidgetBase;return{meta:{widget:{schema:{props:u,attrs:null}}},mixins:[e],props:{atomId:{type:Number},atomName:{type:String},atomStaticKey:{type:String}},data:function(){return{item:null}},computed:{widgetTitle:function(){var t=this.$text("Note");return this.item?"".concat(t,": ").concat(this.item.atomName):t}},watch:{atomId:function(){this.__loadItem()}},created:function(){this.__init()},mounted:function(){},beforeDestroy:function(){},methods:{__init:function(){var t=this;return s(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.__loadItem();case 2:case"end":return e.stop()}}),e)})))()},__loadItem:function(){var t=this;return s(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t.atomId){e.next=6;break}return e.next=3,t.$api.post("/a/base/atom/read",{key:{atomId:t.atomId}});case 3:t.item=e.sent,e.next=7;break;case 6:t.item=null;case 7:case"end":return e.stop()}}),e)})))()}},render:function(){var t=arguments[0];return t("f7-card",{class:"demo-widget-note"},[t("f7-card-header",[this.widgetTitle]),t("f7-card-content")])}}}}}},721:(t,e,n)=>{"use strict";n.d(e,{Z:()=>a});var r=[{name:"content"},{name:"default"}],o=[{name:"default"},{name:"content"}];const a={atoms:{note:{render:{list:{info:{layout:{viewSize:{small:[{name:"card"},{name:"list"}],medium:[{name:"card"},{name:"table"}],large:[{name:"card"},{name:"table"}]}}},layouts:{card:{title:"LayoutCard",component:{module:"test-note",name:"listLayoutCard"},blocks:{items:{component:{module:"test-note",name:"listLayoutBlockCardItems"}},item:{component:{module:"a-baselayout",name:"listLayoutBlockListItem"},summary:!1}}}}},item:{info:{layout:{viewSize:{view:{small:r,medium:r,large:r},edit:{small:o,medium:o,large:o}}}},layouts:{default:{title:"LayoutInfo",component:{module:"a-baselayout",name:"itemLayoutDefault"},blocks:{main:{component:{module:"a-cms",name:"itemLayoutBlockMobileMain"},info:!0}}},content:{title:"LayoutContent",component:{module:"a-baselayout",name:"itemLayoutDefault"},blocks:{main:{component:{module:"a-cms",name:"itemLayoutBlockMobileMain"},markdown:!0}}}}}}}}}},933:(t,e,n)=>{"use strict";n.d(e,{Z:()=>r});const r={}},978:(t,e,n)=>{"use strict";n.d(e,{Z:()=>r});const r={Note:"便签",Name:"名称",Description:"描述","Create Note":"新建便签","Select Note":"选择便签"}},137:(t,e,n)=>{"use strict";n.d(e,{Z:()=>r});const r={"en-us":n(933).Z,"zh-cn":n(978).Z}},644:(t,e,n)=>{"use strict";n.d(e,{Z:()=>r});const r=[]},81:(t,e,n)=>{"use strict";function r(t){return{state:{},getters:{},mutations:{},actions:{}}}n.d(e,{Z:()=>r})},891:(t,e,n)=>{var r=n(361)((function(t){return t[1]}));r.push([t.id,"",""]),t.exports=r},361:t=>{"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=t(e);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,r){"string"==typeof t&&(t=[[null,t,""]]);var o={};if(r)for(var a=0;a<this.length;a++){var i=this[a][0];null!=i&&(o[i]=!0)}for(var s=0;s<t.length;s++){var u=[].concat(t[s]);r&&o[u[0]]||(n&&(u[2]?u[2]="".concat(n," and ").concat(u[2]):u[2]=n),e.push(u))}},e}},650:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>r});const r=function(t,e,n,r,o,a,i,s){var u,c="function"==typeof t?t.options:t;if(e&&(c.render=e,c.staticRenderFns=[],c._compiled=!0),c._scopeId="data-v-662422d4",u)if(c.functional){c._injectStyles=u;var l=c.render;c.render=function(t,e){return u.call(e),l(t,e)}}else{var d=c.beforeCreate;c.beforeCreate=d?[].concat(d,u):[u]}return{exports:t,options:c}}({data:function(){return{}}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("eb-page",[n("eb-navbar",{attrs:{title:t.$text("Demo"),"eb-back-link":"Back"}}),t._v(" "),n("f7-block-title",{attrs:{medium:""}}),t._v(" "),n("f7-block",{attrs:{strong:""}})],1)})).exports},824:(t,e,n)=>{var r=n(891);r.__esModule&&(r=r.default),"string"==typeof r&&(r=[[t.id,r,""]]),r.locals&&(t.exports=r.locals),(0,n(159).Z)("3a3f5e9a",r,!0,{})},159:(t,e,n)=>{"use strict";function r(t,e){for(var n=[],r={},o=0;o<e.length;o++){var a=e[o],i=a[0],s={id:t+":"+o,css:a[1],media:a[2],sourceMap:a[3]};r[i]?r[i].parts.push(s):n.push(r[i]={id:i,parts:[s]})}return n}n.d(e,{Z:()=>p});var o="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!o)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var a={},i=o&&(document.head||document.getElementsByTagName("head")[0]),s=null,u=0,c=!1,l=function(){},d=null,m="data-vue-ssr-id",f="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function p(t,e,n,o){c=n,d=o||{};var i=r(t,e);return v(i),function(e){for(var n=[],o=0;o<i.length;o++){var s=i[o];(u=a[s.id]).refs--,n.push(u)}for(e?v(i=r(t,e)):i=[],o=0;o<n.length;o++){var u;if(0===(u=n[o]).refs){for(var c=0;c<u.parts.length;c++)u.parts[c]();delete a[u.id]}}}}function v(t){for(var e=0;e<t.length;e++){var n=t[e],r=a[n.id];if(r){r.refs++;for(var o=0;o<r.parts.length;o++)r.parts[o](n.parts[o]);for(;o<n.parts.length;o++)r.parts.push(h(n.parts[o]));r.parts.length>n.parts.length&&(r.parts.length=n.parts.length)}else{var i=[];for(o=0;o<n.parts.length;o++)i.push(h(n.parts[o]));a[n.id]={id:n.id,refs:1,parts:i}}}}function y(){var t=document.createElement("style");return t.type="text/css",i.appendChild(t),t}function h(t){var e,n,r=document.querySelector("style["+m+'~="'+t.id+'"]');if(r){if(c)return l;r.parentNode.removeChild(r)}if(f){var o=u++;r=s||(s=y()),e=w.bind(null,r,o,!1),n=w.bind(null,r,o,!0)}else r=y(),e=_.bind(null,r),n=function(){r.parentNode.removeChild(r)};return e(t),function(r){if(r){if(r.css===t.css&&r.media===t.media&&r.sourceMap===t.sourceMap)return;e(t=r)}else n()}}var g,b=(g=[],function(t,e){return g[t]=e,g.filter(Boolean).join("\n")});function w(t,e,n,r){var o=n?"":r.css;if(t.styleSheet)t.styleSheet.cssText=b(e,o);else{var a=document.createTextNode(o),i=t.childNodes;i[e]&&t.removeChild(i[e]),i.length?t.insertBefore(a,i[e]):t.appendChild(a)}}function _(t,e){var n=e.css,r=e.media,o=e.sourceMap;if(r&&t.setAttribute("media",r),d.ssrId&&t.setAttribute(m,e.id),o&&(n+="\n/*# sourceURL="+o.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */"),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}},990:t=>{function e(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}e.keys=()=>[],e.resolve=e,e.id=990,t.exports=e},142:(t,e,n)=>{var r={"./demo.vue":650};function o(t){var e=a(t);return n(e)}function a(t){if(!n.o(r,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return r[t]}o.keys=function(){return Object.keys(r)},o.resolve=a,t.exports=o,o.id=142}},e={};function n(r){var o=e[r];if(void 0!==o)return o.exports;var a=e[r]={id:r,exports:{}};return t[r](a,a.exports,n),a.exports}n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var r={};(()=>{"use strict";var t;n.r(r),n.d(r,{default:()=>e}),n(824);const e={install:function(e,r){return t?console.error("already installed."):(t=e,r({routes:n(644).Z,store:n(81).Z(t),config:n(721).Z,locales:n(137).Z,components:n(645).Z}))}}})(),window["test-note"]=r})();