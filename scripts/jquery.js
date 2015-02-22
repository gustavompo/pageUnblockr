(function(n){"use strict";var e=+new Date,f=!0,r="string",i=function(n,t){return typeof n===t},u={isFunction:function(n){return!!n&&i(n,"function")},lastArgumentCallback:function(n,t){var i=n[n.length-1];return u.isFunction(i)?(t&&i(),i):undefined},extend:function(n){return Array.prototype.slice.call(arguments,1).forEach(function(t){for(var i in t)t[i]!==undefined&&(n[i]=t[i])}),n}},o=function(){for(var i=[JSON,document.querySelectorAll,n.XMLHttpRequest],t=0;t<i.length;t++)if(!i[t])return!1;return!0},t=function(n){return new t.fn.init(n)};t.fn=t.prototype={constructor:t,init:function(n){if(!o())throw"Error: Cannot load psQuery. Required browser features are not available.";try{if(n)!n.nodeType||n.nodeType!==1&&n.nodeType!==9?i(n,r)&&(this.els=document.querySelectorAll(n)):this.els=[n];else throw"Error: Invalid selector";if(this.length=this.els.length,this.length===0)throw"Error: No elements found with that selector.";return this}catch(t){if(f)throw t;else return undefined}},each:function(n){var r=this.els,i=0,t,f;if(!u.isFunction(n))throw"Error: no function supplied to loop.";for(t=0,f=r.length;t<f;t++)n.call(r[t],t)===!1?i--:i++;return i},nth:function(n){var i=n<0?this.els.length+n:n;return t.fn.init(this.els[i])},get:function(n){return this.nth(n)},first:function(){return this.nth(0)},last:function(){return this.nth(-1)},parent:function(){return t(this.els[0])},children:function(){},val:function(n){if(n)this.each(function(){this.value=n});else return this.els[0].value},html:function(n){return i(n,r)?(this.each(function(){this.innerHTML=n}),this):this.els[0].innerHTML},text:function(n){return i(n,r)?(this.each(function(){this.innerText=n}),this):this.els[0].innerText},hide:function(){var n=function(){this.style.display="none"};this.each(n)},show:function(){var n=function(){this.style.display=""};this.each(n)},remove:function(){return this.each(function(){this.parentElement.removeChild(this)}),this},hasClass:function(n){n=n.trim();var t=this.each(function(){return this.className.indexOf(n)>-1});return t+this.length>0},toggleClass:function(n){return n=n.trim(),this.each(function(){var t=$(this);t.hasClass(n)?t.removeClass(n):t.addClass(n)}),this},addClass:function(n){var t=function(){for(var u,f=(this.className+" "+n.trim()).split(" "),e={},o=[],t=0,s=f.length;t<s;t++)e[f[t]]=!0;for(u in e)i(u,r)&&o.push(u);this.className=o.join(" ").trim()};return i(n,r)&&this.each(t),this},removeClass:function(n){var t=function(){for(var t=this.className+"",r=n.trim().split(" "),i=0;i<r.length;i++)t=t.replace(r[i],"");this.className=t};return this.each(t),this},css:function(n){var t=function(){return undefined};if(n)this.each(t);else return"";return this},click:function(n){this.on("click",n)},on:function(n){var i=u.lastArgumentCallback(arguments),t=n.split(" ");return this.each(function(){for(var n=0;n<t.length;n++)this.addEventListener(t[n],i,!1)}),this},off:function(n){var i=u.lastArgumentCallback(arguments),t=n.split(" ");return this.each(function(){for(var n=0;n<t.length;n++)this.removeEventListener(t[n],i,!1)}),this},data:function(){},attr:function(n,t){if(t&&i(t,r))this.each(function(){this.setAttribute(n,t)});else return this.els[0].getAttribute(n);return this}};t.ajax=function(n,t){var e=arguments,o,h,c,s;t=e.length===1?e[0]:e[1];o=function(){};h={url:e.length===2&&i(n,r)?n:".",cache:!0,data:{},headers:{},context:null,type:"GET",success:o,error:o,complete:o};t=u.extend(h,t||{});c={"application/json":"json","text/html":"html","text/plain":"text"};t.cache||(t.url=t.url+(t.url.indexOf("?")?"&":"?")+"noCache="+Math.floor(Math.random()*9e9));var a=function(n,t,i){var r="success";i.success.call(i.context,n,r,t);l(r,t,i)},v=function(n,t,i,r){r.error.call(r.context,i,t,n);l(t,i,r)},l=function(n,t,i){i.complete.call(i.context,t,n)},f=new XMLHttpRequest;f.addEventListener("readystatechange",function(){var n,i,r;if(f.readyState===4){if(f.status>=200&&f.status<300||f.status===304){r=f.getResponseHeader("content-type");i=c[r]||"text";n=f.responseText;try{i==="json"&&(n=JSON.parse(n));a(n,f,t);return}catch(u){}}v(null,"error",f,t);return}},!1);f.open(t.type,t.url);t.type==="POST"&&(t.headers=u.extend(t.headers,{"X-Requested-With":"XMLHttpRequest","Content-type":"application/x-www-form-urlencoded"}));for(s in t.headers)f.setRequestHeader(s,t.headers[s]);return f.send(t.data),this};t.fn.init.prototype=t.fn;n.psQuery=t;n.$||(n.$=t);f&&(n.utils=u);n.ps=n.ps||{};n.ps.timings=n.ps.timings||{};n.ps.timings.psQuery={start:e,end:+new Date}})(this);$=ps;
