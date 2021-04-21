var app=function(){"use strict";function e(){}function s(e){return e()}function t(){return Object.create(null)}function l(e){e.forEach(s)}function a(e){return"function"==typeof e}function n(e,s){return e!=e?s==s:e!==s||e&&"object"==typeof e||"function"==typeof e}function o(e,s){e.appendChild(s)}function r(e,s,t){e.insertBefore(s,t||null)}function i(e){e.parentNode.removeChild(e)}function c(e){return document.createElement(e)}function u(){return e=" ",document.createTextNode(e);var e}function v(e,s,t){null==t?e.removeAttribute(s):e.getAttribute(s)!==t&&e.setAttribute(s,t)}function d(e,s,t){e.classList[t?"add":"remove"](s)}let h;function f(e){h=e}const g=[],m=[],p=[],x=[],b=Promise.resolve();let y=!1;function $(e){p.push(e)}let w=!1;const j=new Set;function k(){if(!w){w=!0;do{for(let e=0;e<g.length;e+=1){const s=g[e];f(s),_(s.$$)}for(f(null),g.length=0;m.length;)m.pop()();for(let e=0;e<p.length;e+=1){const s=p[e];j.has(s)||(j.add(s),s())}p.length=0}while(g.length);for(;x.length;)x.pop()();y=!1,w=!1,j.clear()}}function _(e){if(null!==e.fragment){e.update(),l(e.before_update);const s=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,s),e.after_update.forEach($)}}const L=new Set;function C(e,s){e&&e.i&&(L.delete(e),e.i(s))}function T(e,s,t,l){if(e&&e.o){if(L.has(e))return;L.add(e),undefined.c.push((()=>{L.delete(e),l&&(t&&e.d(1),l())})),e.o(s)}}function M(e){e&&e.c()}function A(e,t,n,o){const{fragment:r,on_mount:i,on_destroy:c,after_update:u}=e.$$;r&&r.m(t,n),o||$((()=>{const t=i.map(s).filter(a);c?c.push(...t):l(t),e.$$.on_mount=[]})),u.forEach($)}function E(e,s){const t=e.$$;null!==t.fragment&&(l(t.on_destroy),t.fragment&&t.fragment.d(s),t.on_destroy=t.fragment=null,t.ctx=[])}function I(e,s){-1===e.$$.dirty[0]&&(g.push(e),y||(y=!0,b.then(k)),e.$$.dirty.fill(0)),e.$$.dirty[s/31|0]|=1<<s%31}function S(s,a,n,o,r,c,u=[-1]){const v=h;f(s);const d=s.$$={fragment:null,ctx:null,props:c,update:e,not_equal:r,bound:t(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(v?v.$$.context:a.context||[]),callbacks:t(),dirty:u,skip_bound:!1};let g=!1;if(d.ctx=n?n(s,a.props||{},((e,t,...l)=>{const a=l.length?l[0]:t;return d.ctx&&r(d.ctx[e],d.ctx[e]=a)&&(!d.skip_bound&&d.bound[e]&&d.bound[e](a),g&&I(s,e)),t})):[],d.update(),g=!0,l(d.before_update),d.fragment=!!o&&o(d.ctx),a.target){if(a.hydrate){const e=function(e){return Array.from(e.childNodes)}(a.target);d.fragment&&d.fragment.l(e),e.forEach(i)}else d.fragment&&d.fragment.c();a.intro&&C(s.$$.fragment),A(s,a.target,a.anchor,a.customElement),k()}f(v)}class B{$destroy(){E(this,1),this.$destroy=e}$on(e,s){const t=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return t.push(s),()=>{const e=t.indexOf(s);-1!==e&&t.splice(e,1)}}$set(e){var s;this.$$set&&(s=e,0!==Object.keys(s).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function P(s){let t,l,a,n,h,f,g,m;return{c(){t=c("div"),l=c("nav"),l.innerHTML='<a href="#0" class="logo svelte-ox1222"><img src="../images/logo.svg" alt="logo" class="svelte-ox1222"/></a> \n        <a href="#0" class="hamburger svelte-ox1222"><img src="../images/icon-hamburger.svg" alt="hamburger" class="svelte-ox1222"/></a>         \n        <a href="#0" class="close svelte-ox1222"><img src="../images/icon-close.svg" alt="close" class="svelte-ox1222"/></a>                \n        <ul class="svelte-ox1222"><li class="svelte-ox1222"><a href="#0" class="product svelte-ox1222">Product\n                    <img src="../images/icon-arrow-light.svg" alt="arrow" class="arrow-light svelte-ox1222"/> \n                    <img src="../images/icon-arrow-dark.svg" alt="arrow" class="arrow-dark svelte-ox1222"/> \n                    <div class="dropdown-product svelte-ox1222"><li class="svelte-ox1222"><a href="#0" class="svelte-ox1222">Overview</a></li> \n                        <li class="svelte-ox1222"><a href="#0" class="svelte-ox1222">Pricing</a></li> \n                        <li class="svelte-ox1222"><a href="#0" class="svelte-ox1222">Marketplace</a></li> \n                        <li class="svelte-ox1222"><a href="#0" class="svelte-ox1222">Features</a></li> \n                        <li class="svelte-ox1222"><a href="#0" class="svelte-ox1222">Integrations</a></li></div></a></li> \n            <li class="svelte-ox1222"><a href="#0" class="company svelte-ox1222">Company\n                    <img src="../images/icon-arrow-light.svg" alt="arrow" class="arrow-light svelte-ox1222"/> \n                    <img src="../images/icon-arrow-dark.svg" alt="arrow" class="arrow-dark svelte-ox1222"/> \n                    <div class="dropdown-company svelte-ox1222"><a href="#0" class="svelte-ox1222">About</a> \n                        <a href="#0" class="svelte-ox1222">Team</a> \n                        <a href="#0" class="svelte-ox1222">Blog</a> \n                        <a href="#0" class="svelte-ox1222">Careers</a></div></a></li> \n            <li class="svelte-ox1222"><a href="#0" class="connect svelte-ox1222">Connect\n                    <img src="../images/icon-arrow-light.svg" alt="arrow" class="arrow-light svelte-ox1222"/> \n                    <img src="../images/icon-arrow-dark.svg" alt="arrow" class="arrow-dark svelte-ox1222"/> \n                    <div class="dropdown-connect svelte-ox1222"><a href="#0" class="svelte-ox1222">Contact</a> \n                        <a href="#0" class="svelte-ox1222">Newsletter</a> \n                        <a href="#0" class="svelte-ox1222">Linkedin</a></div></a></li></ul> \n        <div class="btn-nav svelte-ox1222"><button class="svelte-ox1222"><a href="#0" class="svelte-ox1222">Login</a></button> \n            <button class="svelte-ox1222"><a href="#0" class="svelte-ox1222">Sign Up</a></button></div>',a=u(),n=c("main"),n.innerHTML='<h1 class="svelte-ox1222">A modern publishing platform</h1> \n        <p class="svelte-ox1222">Grow your audience and build your online brand</p>',h=u(),f=c("div"),f.innerHTML='<button class="svelte-ox1222"><a href="#0" class="svelte-ox1222">Start for Free</a></button> \n        <button class="svelte-ox1222"><a href="#0" class="svelte-ox1222">Learn More</a></button>',v(l,"class","svelte-ox1222"),d(l,"active",s[0]),v(n,"class","svelte-ox1222"),v(f,"class","btn-botton svelte-ox1222"),v(t,"class","container svelte-ox1222")},m(e,i){var c,u,v,d;r(e,t,i),o(t,l),o(t,a),o(t,n),o(t,h),o(t,f),g||(c=l,u="click",v=s[1],c.addEventListener(u,v,d),m=()=>c.removeEventListener(u,v,d),g=!0)},p(e,[s]){1&s&&d(l,"active",e[0])},i:e,o:e,d(e){e&&i(t),g=!1,m()}}}function F(e,s,t){let l=!1;return[l,()=>t(0,l=!l)]}class H extends B{constructor(e){super(),S(this,e,F,P,n,{})}}function N(s){let t;return{c(){t=c("div"),t.innerHTML='<h1 class="head-line svelte-1a8s3sh">Designed for the future</h1> \n    <div class="content-1 svelte-1a8s3sh"><h2 class="svelte-1a8s3sh">Introducing an extensible editor</h2> \n        <p class="svelte-1a8s3sh">Blogr features an exceedingly intuitive interface which lets you focus on one thing: creating content. The editor supports management of mutiple blogs and allows easy manipulation of embeds such as images, videos, and Markdown. Extensibility with plugins and themes provide easy ways to add functionality or change the looks of a blog.</p></div> \n    <div class="content-2 svelte-1a8s3sh"><h2 class="svelte-1a8s3sh">Robust content management</h2> \n        <p class="svelte-1a8s3sh">Flexible content management enables users to easily move through posts. Increase the usability of your blog by adding customized categories, sections, format, or flow. With this functionslity, you&#39;re in full control.</p></div> \n    <img class="img-editor svelte-1a8s3sh" src="./images/illustration-editor-desktop.svg" alt="editor"/> \n    <img class="img-editor-mb svelte-1a8s3sh" src="./images/illustration-editor-mobile.svg" alt="editor"/>     \n    <div class="infrastructure svelte-1a8s3sh"></div> \n    <div class="img-phones svelte-1a8s3sh"><img src="./images/illustration-phones.svg" alt="phones" class="svelte-1a8s3sh"/></div> \n\n    <div class="content-3 svelte-1a8s3sh"><h1 class="svelte-1a8s3sh">State of the Art Infrastructure</h1> \n        <p class="svelte-1a8s3sh">With reliability and speed in mind, wordwide data centers provide the backbone for ultra-fast connectivity. This ensures your site will load instantly, no matter where your  readers are, keeping your site competitive.</p></div>  \n    <img class="img-laptop svelte-1a8s3sh" src="./images/illustration-laptop-desktop.svg" alt="laptop"/> \n    <div class="content-4 svelte-1a8s3sh"><h2 class="svelte-1a8s3sh">Free, open, simple</h2> \n        <p class="svelte-1a8s3sh">Blogr is a free and open source application backed by a large community of helpful developers. It supports features such as code syntax highlightind, RSS feeds, social media integration, third-party commenting tools, and works seamlessly with Google Analytics. The architecture is clean and is relatively easy to learn.</p></div> \n    <div class="content-5 svelte-1a8s3sh"><h2 class="svelte-1a8s3sh">Powerful tooling</h2> \n        <p class="svelte-1a8s3sh">Batteries included. We built a simple and straightforward CLI tool that makes customization and deployment a breeze, but capable of producing even the most complicated sites.</p></div>',v(t,"class","container svelte-1a8s3sh")},m(e,s){r(e,t,s)},p:e,i:e,o:e,d(e){e&&i(t)}}}class O extends B{constructor(e){super(),S(this,e,null,N,n,{})}}function z(s){let t;return{c(){t=c("div"),t.innerHTML='<img src="./images/logo.svg" alt="logo" class="logo svelte-113e6jl"/> \n    <ul class="svelte-113e6jl"><li class="svelte-113e6jl"><a href="#0" class="product svelte-113e6jl"><h3 class="svelte-113e6jl">Product</h3>  \n                <li class="svelte-113e6jl"><a href="#0" class="svelte-113e6jl">Overview</a></li> \n                <li class="svelte-113e6jl"><a href="#0" class="svelte-113e6jl">Pricing</a></li> \n                <li class="svelte-113e6jl"><a href="#0" class="svelte-113e6jl">Marketplace</a></li> \n                <li class="svelte-113e6jl"><a href="#0" class="svelte-113e6jl">Features</a></li> \n                <li class="svelte-113e6jl"><a href="#0" class="svelte-113e6jl">Integrations</a></li></a></li> \n        <li class="svelte-113e6jl"><a href="#0" class="company svelte-113e6jl"><h3 class="svelte-113e6jl">Company</h3>                 \n                <li class="svelte-113e6jl"><a href="#0" class="svelte-113e6jl">About</a></li> \n                <li class="svelte-113e6jl"><a href="#0" class="svelte-113e6jl">Team</a></li> \n                <li class="svelte-113e6jl"><a href="#0" class="svelte-113e6jl">Blog</a></li> \n                <li class="svelte-113e6jl"><a href="#0" class="svelte-113e6jl">Careers</a></li></a></li> \n        <li class="svelte-113e6jl"><a href="#0" class="connect svelte-113e6jl"><h3 class="svelte-113e6jl">Connect</h3>  \n                <li class="svelte-113e6jl"><a href="#0" class="svelte-113e6jl">Contact</a></li> \n                <li class="svelte-113e6jl"><a href="#0" class="svelte-113e6jl">Newsletter</a></li> \n                <li class="svelte-113e6jl"><a href="#0" class="svelte-113e6jl">Linkedin</a></li></a></li></ul>',v(t,"class","container svelte-113e6jl")},m(e,s){r(e,t,s)},p:e,i:e,o:e,d(e){e&&i(t)}}}class W extends B{constructor(e){super(),S(this,e,null,z,n,{})}}function G(s){let t,l,a,n,v,d,h;return l=new H({}),n=new O({}),d=new W({}),{c(){t=c("main"),M(l.$$.fragment),a=u(),M(n.$$.fragment),v=u(),M(d.$$.fragment)},m(e,s){r(e,t,s),A(l,t,null),o(t,a),A(n,t,null),o(t,v),A(d,t,null),h=!0},p:e,i(e){h||(C(l.$$.fragment,e),C(n.$$.fragment,e),C(d.$$.fragment,e),h=!0)},o(e){T(l.$$.fragment,e),T(n.$$.fragment,e),T(d.$$.fragment,e),h=!1},d(e){e&&i(t),E(l),E(n),E(d)}}}return new class extends B{constructor(e){super(),S(this,e,null,G,n,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
