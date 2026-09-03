(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=Object.freeze({"--toolfox-font-family":`"Segoe UI", Inter, Arial, system-ui, sans-serif`,"--toolfox-z-dialog":`2147483647`,"--toolfox-overlay":`rgba(15, 23, 42, 0.6)`,"--toolfox-surface":`#fff`,"--toolfox-surface-subtle":`#f8fafc`,"--toolfox-surface-app":`#f4f6fa`,"--toolfox-text":`#1f2937`,"--toolfox-text-strong":`#111827`,"--toolfox-text-muted":`#6b7280`,"--toolfox-border":`#d1d5db`,"--toolfox-border-subtle":`#e5e7eb`,"--toolfox-primary":`#2563eb`,"--toolfox-brand":`#4055d3`,"--toolfox-danger":`#b91c1c`,"--toolfox-danger-surface":`#fef2f2`,"--toolfox-danger-border":`#fecaca`,"--toolfox-warning":`#9a3412`,"--toolfox-warning-surface":`#fff7ed`,"--toolfox-warning-border":`#fed7aa`,"--toolfox-success":`#166534`,"--toolfox-success-surface":`#f0fdf4`,"--toolfox-success-border":`#bbf7d0`,"--toolfox-info":`#1e3a8a`,"--toolfox-info-surface":`#eff6ff`,"--toolfox-info-border":`#bfdbfe`,"--toolfox-focus-outline":`#2563eb`,"--toolfox-focus-halo":`rgba(37, 99, 235, 0.25)`,"--toolfox-radius-control":`8px`,"--toolfox-radius-panel":`10px`,"--toolfox-radius-dialog":`16px`,"--toolfox-radius-pill":`999px`,"--toolfox-shadow-card":`0 2px 7px rgba(30, 42, 70, 0.04)`,"--toolfox-shadow-dialog":`0 24px 80px rgba(15, 23, 42, 0.38)`});function t(t,n=e){for(let[e,r]of Object.entries(n))t.style.setProperty(e,r)}var n=globalThis,r=n.ShadowRoot&&(n.ShadyCSS===void 0||n.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,i=Symbol(),a=new WeakMap,o=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(r&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=a.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&a.set(t,e))}return e}toString(){return this.cssText}},s=e=>new o(typeof e==`string`?e:e+``,void 0,i),c=(e,...t)=>new o(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,i),l=(e,t)=>{if(r)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let r of t){let t=document.createElement(`style`),i=n.litNonce;i!==void 0&&t.setAttribute(`nonce`,i),t.textContent=r.cssText,e.appendChild(t)}},u=r?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return s(t)})(e):e,{is:d,defineProperty:ee,getOwnPropertyDescriptor:te,getOwnPropertyNames:ne,getOwnPropertySymbols:re,getPrototypeOf:ie}=Object,f=globalThis,p=f.trustedTypes,ae=p?p.emptyScript:``,oe=f.reactiveElementPolyfillSupport,m=(e,t)=>e,h={toAttribute(e,t){switch(t){case Boolean:e=e?ae:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},g=(e,t)=>!d(e,t),se={attribute:!0,type:String,converter:h,reflect:!1,useDefault:!1,hasChanged:g};Symbol.metadata??=Symbol(`metadata`),f.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=se){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&ee(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=te(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??se}static _$Ei(){if(this.hasOwnProperty(m(`elementProperties`)))return;let e=ie(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(m(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m(`properties`))){let e=this.properties,t=[...ne(e),...re(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(u(e))}else e!==void 0&&t.push(u(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return l(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?h:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?h:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??g)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:`open`},_[m(`elementProperties`)]=new Map,_[m(`finalized`)]=new Map,oe?.({ReactiveElement:_}),(f.reactiveElementVersions??=[]).push(`2.1.2`);var v=globalThis,ce=e=>e,y=v.trustedTypes,b=y?y.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,x=`$lit$`,S=`lit$${Math.random().toFixed(9).slice(2)}$`,le=`?`+S,ue=`<${le}>`,C=document,w=()=>C.createComment(``),T=e=>e===null||typeof e!=`object`&&typeof e!=`function`,E=Array.isArray,de=e=>E(e)||typeof e?.[Symbol.iterator]==`function`,D=`[ 	
\f\r]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,fe=/-->/g,pe=/>/g,k=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),me=/'/g,he=/"/g,A=/^(?:script|style|textarea|title)$/i,j=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),M=Symbol.for(`lit-noChange`),N=Symbol.for(`lit-nothing`),P=new WeakMap,F=C.createTreeWalker(C,129);function ge(e,t){if(!E(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return b===void 0?t:b.createHTML(t)}var _e=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=O;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===O?c[1]===`!--`?o=fe:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=k):(A.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=k):o=pe:o===k?c[0]===`>`?(o=i??O,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?k:c[3]===`"`?he:me):o===he||o===me?o=k:o===fe||o===pe?o=O:(o=k,i=void 0);let d=o===k&&e[t+1].startsWith(`/>`)?` `:``;a+=o===O?n+ue:l>=0?(r.push(s),n.slice(0,l)+x+n.slice(l)+S+d):n+S+(l===-2?t:d)}return[ge(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},I=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=_e(t,n);if(this.el=e.createElement(l,r),F.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=F.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(x)){let t=u[o++],n=i.getAttribute(e).split(S),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?ye:r[1]===`?`?be:r[1]===`@`?xe:z}),i.removeAttribute(e)}else e.startsWith(S)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(A.test(i.tagName)){let e=i.textContent.split(S),t=e.length-1;if(t>0){i.textContent=y?y.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],w()),F.nextNode(),c.push({type:2,index:++a});i.append(e[t],w())}}}else if(i.nodeType===8){if(i.data===le)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(S,e+1))!==-1;)c.push({type:7,index:a}),e+=S.length-1}}a++}}static createElement(e,t){let n=C.createElement(`template`);return n.innerHTML=e,n}};function L(e,t,n=e,r){if(t===M)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=T(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=L(e,i._$AS(e,t.values),i,r)),t}var ve=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??C).importNode(t,!0);F.currentNode=r;let i=F.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new R(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Se(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=F.nextNode(),a++)}return F.currentNode=C,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},R=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=N,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=L(this,e,t),T(e)?e===N||e==null||e===``?(this._$AH!==N&&this._$AR(),this._$AH=N):e!==this._$AH&&e!==M&&this._(e):e._$litType$===void 0?e.nodeType===void 0?de(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==N&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=I.createElement(ge(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new ve(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=P.get(e.strings);return t===void 0&&P.set(e.strings,t=new I(e)),t}k(t){E(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(w()),this.O(w()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=ce(e).nextSibling;ce(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},z=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=N,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=N}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=L(this,e,t,0),a=!T(e)||e!==this._$AH&&e!==M,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=L(this,r[n+o],t,o),s===M&&(s=this._$AH[o]),a||=!T(s)||s!==this._$AH[o],s===N?e=N:e!==N&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===N?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},ye=class extends z{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===N?void 0:e}},be=class extends z{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==N)}},xe=class extends z{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=L(this,e,t,0)??N)===M)return;let n=this._$AH,r=e===N&&n!==N||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==N&&(n===N||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Se=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){L(this,e)}},Ce=v.litHtmlPolyfillSupport;Ce?.(I,R),(v.litHtmlVersions??=[]).push(`3.3.3`);var we=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new R(t.insertBefore(w(),e),e,void 0,n??{})}return i._$AI(e),i},B=globalThis,V=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=we(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};V._$litElement$=!0,V.finalized=!0,B.litElementHydrateSupport?.({LitElement:V});var Te=B.litElementPolyfillSupport;Te?.({LitElement:V}),(B.litElementVersions??=[]).push(`4.2.2`);var H=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})},Ee={attribute:!0,type:String,converter:h,reflect:!1,hasChanged:g},De=(e=Ee,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function U(e){return(t,n)=>typeof n==`object`?De(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function W(e){return U({...e,state:!0,attribute:!1})}var Oe={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ke=e=>(...t)=>({_$litDirective$:e,values:t}),Ae=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},je=ke(class extends Ae{constructor(e){if(super(e),e.type!==Oe.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter(t=>e[t]).join(` `)+` `}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter(e=>e!==``)));for(let e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return M}}),Me=c`
    :host {
        display: block;
    }

    .app-header {
        display: flex;
        gap: 11px;
        align-items: center;
        padding: 18px 18px 15px;
        background: var(--toolfox-surface);
        border-bottom: 1px solid var(--toolfox-border-subtle);
    }

    .app-mark {
        display: grid;
        width: 36px;
        height: 36px;
        flex: 0 0 36px;
        place-items: center;
        border-radius: var(--toolfox-radius-panel);
        color: var(--toolfox-surface);
        background: linear-gradient(
            145deg,
            color-mix(in srgb, var(--toolfox-brand) 85%, var(--toolfox-surface)),
            color-mix(in srgb, var(--toolfox-brand) 85%, var(--toolfox-text-strong))
        );
        box-shadow: 0 5px 12px color-mix(in srgb, var(--toolfox-brand) 22%, transparent);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.04em;
    }

    h1,
    p {
        margin: 0;
    }

    .app-header h1 {
        color: var(--toolfox-text-strong);
        font-size: 16px;
        line-height: 1.25;
        letter-spacing: -0.01em;
    }

    .app-header p {
        margin-top: 2px;
        color: var(--toolfox-text-muted);
        font-size: 12px;
    }

    main {
        padding: 14px;
    }

    .page-context {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        min-height: 54px;
        padding: 11px 12px;
        border: 1px solid var(--toolfox-border);
        border-radius: var(--toolfox-radius-panel);
        background: var(--toolfox-surface);
    }

    .context-indicator {
        width: 8px;
        height: 8px;
        flex: 0 0 8px;
        margin-top: 5px;
        border-radius: 50%;
        background: var(--toolfox-text-muted);
        box-shadow: 0 0 0 3px var(--toolfox-surface-subtle);
    }

    .page-context.is-marathon .context-indicator {
        background: var(--toolfox-success);
        box-shadow: 0 0 0 3px var(--toolfox-success-surface);
    }

    .page-context.is-edvibe .context-indicator {
        background: var(--toolfox-warning);
        box-shadow: 0 0 0 3px var(--toolfox-warning-surface);
    }

    .page-context strong,
    .page-context span {
        display: block;
    }

    .page-context strong {
        color: var(--toolfox-text-strong);
        font-size: 13px;
        line-height: 1.35;
    }

    .page-context div > span {
        margin-top: 2px;
        color: var(--toolfox-text-muted);
        font-size: 11px;
        line-height: 1.35;
    }

    .tool-groups {
        display: grid;
        gap: 15px;
        margin-top: 17px;
    }

    .popup-status {
        margin-top: 12px;
        padding: 9px 10px;
        border: 1px solid var(--toolfox-success-border);
        border-radius: var(--toolfox-radius-control);
        color: var(--toolfox-success);
        background: var(--toolfox-success-surface);
        font-size: 11px;
        line-height: 1.4;
    }

    .popup-status.is-error {
        border-color: var(--toolfox-danger-border);
        color: var(--toolfox-danger);
        background: var(--toolfox-danger-surface);
    }
`,G={START_EXPORT:`START_FULL_AUTOMATION`,OPEN_LESSON_RESET:`OPEN_LESSON_RESET`,OPEN_ACTION_RECORDER:`OPEN_ACTION_RECORDER`,OPEN_BATCH_LESSON_ACCESS:`OPEN_BATCH_LESSON_ACCESS`,OPEN_BATCH_USER_ONBOARDING:`OPEN_BATCH_USER_ONBOARDING`,OPEN_BATCH_USER_MANAGEMENT:`OPEN_BATCH_USER_MANAGEMENT`,OPEN_BATCH_SECTION_CREATION:`OPEN_BATCH_SECTION_CREATION`,OPEN_BATCH_SECTION_DELETION:`OPEN_BATCH_SECTION_DELETION`,OPEN_VIDEO_ATTACHMENT:`OPEN_VIDEO_ATTACHMENT`,OPEN_EXECUTION_HISTORY:`OPEN_EXECUTION_HISTORY`,OPEN_TELEGRAM_GROUP_BROWSER:`OPEN_TELEGRAM_GROUP_BROWSER`},K={START_EXPORT:`TOOLFOX_START_ALL`,OPEN_LESSON_RESET:`TOOLFOX_OPEN_RESET`,OPEN_ACTION_RECORDER:`TOOLFOX_OPEN_RECORDER`,OPEN_BATCH_LESSON_ACCESS:`TOOLFOX_OPEN_BATCH_LESSON_ACCESS`,OPEN_BATCH_USER_ONBOARDING:`TOOLFOX_OPEN_BATCH_USER_ONBOARDING`,OPEN_BATCH_USER_MANAGEMENT:`TOOLFOX_OPEN_BATCH_USER_MANAGEMENT`,OPEN_BATCH_SECTION_CREATION:`TOOLFOX_OPEN_BATCH_SECTION_CREATION`,OPEN_BATCH_SECTION_DELETION:`TOOLFOX_OPEN_BATCH_SECTION_DELETION`,OPEN_VIDEO_ATTACHMENT:`TOOLFOX_OPEN_VIDEO_ATTACHMENT`,OPEN_EXECUTION_HISTORY:`TOOLFOX_OPEN_EXECUTION_HISTORY`,OPEN_TELEGRAM_GROUP_BROWSER:`TOOLFOX_OPEN_TELEGRAM_GROUP_BROWSER`,EXPORT_STATUS:`TOOLFOX_EXPORT_STATUS`,STORAGE_REQUEST:`TOOLFOX_STORAGE_REQUEST`,STORAGE_RESPONSE:`TOOLFOX_STORAGE_RESPONSE`},Ne={EXPORT_STATUS:`EXPORT_STATUS`},q={STARTED:`started`,COMPLETE:`complete`,ERROR:`error`},Pe={GET:`get`,SET:`set`},Fe={EXECUTION_HISTORY_PREFERENCES:`executionHistoryPreferences`},Ie={[G.START_EXPORT]:{type:K.START_EXPORT,info:`Automation sequence channeled to page engine.`},[G.OPEN_LESSON_RESET]:{type:K.OPEN_LESSON_RESET,info:`Lesson reset workflow opened.`},[G.OPEN_ACTION_RECORDER]:{type:K.OPEN_ACTION_RECORDER,info:`Action recorder opened.`},[G.OPEN_BATCH_LESSON_ACCESS]:{type:K.OPEN_BATCH_LESSON_ACCESS,info:`Batch lesson access opened.`},[G.OPEN_BATCH_USER_ONBOARDING]:{type:K.OPEN_BATCH_USER_ONBOARDING,info:`Batch user onboarding opened.`},[G.OPEN_BATCH_USER_MANAGEMENT]:{type:K.OPEN_BATCH_USER_MANAGEMENT,info:`Batch user management opened.`},[G.OPEN_BATCH_SECTION_CREATION]:{type:K.OPEN_BATCH_SECTION_CREATION,info:`Batch section creation opened.`},[G.OPEN_BATCH_SECTION_DELETION]:{type:K.OPEN_BATCH_SECTION_DELETION,info:`Batch section deletion opened.`},[G.OPEN_VIDEO_ATTACHMENT]:{type:K.OPEN_VIDEO_ATTACHMENT,info:`YouTube video attachment opened.`},[G.OPEN_EXECUTION_HISTORY]:{type:K.OPEN_EXECUTION_HISTORY,info:`Execution history opened.`},[G.OPEN_TELEGRAM_GROUP_BROWSER]:{type:K.OPEN_TELEGRAM_GROUP_BROWSER,info:`Telegram owned-group browser opened.`}};new Set(Object.values(Ie).map(({type:e})=>e));var Le=new Set(Object.values(q));new Set(Object.values(Pe)),new Set(Object.values(Fe));function Re(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function ze(e,t){return Object.keys(e).every(e=>t.has(e))}function Be(e){return typeof e==`string`&&Object.hasOwn(Ie,e)}function Ve(e){return typeof e==`string`&&Le.has(e)}function He(e){return Re(e)&&ze(e,new Set([`action`]))&&Be(e.action)}function Ue(e){return Re(e)&&ze(e,new Set([`action`,`state`,`message`]))&&e.action===Ne.EXPORT_STATUS&&Ve(e.state)&&(e.message===void 0||typeof e.message==`string`)}function We(e){return Object.freeze({...e,tools:Object.freeze(e.tools.map(e=>Object.freeze(e)))})}function Ge(e){return Object.freeze(e.map(We))}var Ke=Ge([{id:`history`,title:`История`,tools:[{id:`execution-history`,title:`История операций`,description:`Просмотреть, отфильтровать и скачать сохранённые отчёты.`,command:G.OPEN_EXECUTION_HISTORY,requirement:`edvibe`,busyLabel:`Открывается…`,closeOnSuccess:!0}]},{id:`export`,title:`Экспорт`,tools:[{id:`marathon-export`,title:`Экспорт марафона`,description:`Скачать уроки, материалы и резервный JSON.`,command:G.START_EXPORT,requirement:`marathon`,busyLabel:`Экспортируется…`}]},{id:`management`,title:`Управление`,tools:[{id:`lesson-reset`,title:`Сброс прогресса учеников`,description:`Очистить сохранённые ответы в выбранных уроках.`,command:G.OPEN_LESSON_RESET,requirement:`marathon`,busyLabel:`Открывается…`,appearance:`danger`,closeOnSuccess:!0},{id:`batch-lesson-access`,title:`Открыть доступ к урокам`,description:`Открыть выбранные уроки для списка учеников.`,command:G.OPEN_BATCH_LESSON_ACCESS,requirement:`marathon`,busyLabel:`Открывается…`,closeOnSuccess:!0},{id:`batch-user-onboarding`,title:`Добавить пользователей`,description:`Добавить пользователей и назначить выбранного куратора по списку email.`,command:G.OPEN_BATCH_USER_ONBOARDING,requirement:`marathon`,busyLabel:`Открывается…`,closeOnSuccess:!0},{id:`batch-section-creation`,title:`Создать раздел в уроках`,description:`Добавить один раздел в несколько выбранных уроков.`,command:G.OPEN_BATCH_SECTION_CREATION,requirement:`marathon`,busyLabel:`Открывается…`,closeOnSuccess:!0},{id:`youtube-video-attachment`,title:`Добавить YouTube-видео`,description:`Прикрепить одно видео к выбранным разделам выбранных уроков.`,command:G.OPEN_VIDEO_ATTACHMENT,requirement:`marathon`,busyLabel:`Открывается…`,closeOnSuccess:!0},{id:`batch-section-deletion`,title:`Удалить раздел из уроков`,description:`Безопасно удалить раздел с точным именем из выбранных уроков.`,command:G.OPEN_BATCH_SECTION_DELETION,requirement:`marathon`,busyLabel:`Открывается…`,appearance:`danger`,closeOnSuccess:!0},{id:`batch-user-management`,title:`Управление пользователями`,description:`Снять кураторов и удалить пользователей по списку email.`,command:G.OPEN_BATCH_USER_MANAGEMENT,requirement:`marathon`,busyLabel:`Открывается…`,appearance:`danger`,closeOnSuccess:!0}]},{id:`telegram`,title:`Telegram`,tools:[{id:`telegram-owned-groups`,title:`Мои группы`,description:`Показать группы, созданные текущим Telegram-аккаунтом.`,command:G.OPEN_TELEGRAM_GROUP_BROWSER,requirement:`telegram`,busyLabel:`Открывается…`,closeOnSuccess:!0}]},{id:`development`,title:`Разработка`,tools:[{id:`action-recorder`,title:`Запись действий WebSocket`,description:`Записать запросы и ответы выполненного действия.`,command:G.OPEN_ACTION_RECORDER,requirement:`edvibe`,busyLabel:`Открывается…`,closeOnSuccess:!0}]}]),qe=Object.freeze({loading:Object.freeze({title:`Проверяем страницу…`,description:`Определяем доступные инструменты`}),edvibe:Object.freeze({title:`Страница Edvibe`,description:`Откройте страницу марафона для работы с инструментами`}),"telegram-web-k":Object.freeze({title:`Telegram Web K`,description:`Инструменты Telegram доступны для текущего аккаунта`}),unsupported:Object.freeze({title:`Неподдерживаемая страница`,description:`Toolfox работает на Edvibe и Telegram Web K`}),unavailable:Object.freeze({title:`Страница недоступна`,description:`Не удалось определить активную вкладку`})});function Je(e){if(!e?.id||!e.url)return{type:`unavailable`};let t;try{t=new URL(e.url)}catch{return{type:`unsupported`,tabId:e.id}}if(t.hostname===`web.telegram.org`&&(t.pathname===`/k`||t.pathname.startsWith(`/k/`)))return{type:`telegram-web-k`,tabId:e.id};if(!(t.hostname===`edvibe.com`||t.hostname.endsWith(`.edvibe.com`)))return{type:`unsupported`,tabId:e.id};let n=t.pathname.match(/\/marathon\/(\d+)(?:\/|$)/);return n?{type:`marathon`,marathonId:n[1],tabId:e.id}:{type:`edvibe`,tabId:e.id}}function Ye(e){return e?.type===`marathon`?{title:`Марафон #${e.marathonId}`,description:`Инструменты марафона доступны`}:e?.type===`loading`||e?.type===`edvibe`||e?.type===`telegram-web-k`||e?.type===`unsupported`||e?.type===`unavailable`?qe[e.type]:qe.unavailable}function J(e,t){return e.requirement===`edvibe`?t.type===`edvibe`||t.type===`marathon`?``:`Откройте страницу Edvibe.`:e.requirement===`marathon`?t.type===`marathon`?``:`Откройте страницу марафона.`:t.type===`telegram-web-k`?``:`Откройте Telegram Web K.`}function Xe(e){for(let t of Ke){let n=t.tools.find(t=>t.id===e);if(n)return n}}function Ze(e,{pageContext:t,exportInProgress:n,pendingToolId:r}){let i=J(e,t),a=e.id===`marathon-export`&&n,o=r===e.id,s=(n||r!==null)&&!a&&!o;return{...e,disabled:!!(i||a||o||s),reason:i||(s?`Дождитесь завершения другого инструмента.`:``),busy:a||o}}var Y=c`
    :host,
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }
`;function Qe(e,t){return t.type===`telegram-web-k`?e.requirement===`telegram`:t.type===`edvibe`||t.type===`marathon`?e.requirement===`edvibe`||e.requirement===`marathon`:!1}function $e(e,t){return e.filter(e=>Qe(e,t))}function et(e,t){return e.flatMap(e=>{let n=$e(e.tools,t);return n.length===0?[]:[Object.freeze({...e,tools:Object.freeze([...n])})]})}var tt=c`
    :host {
        display: block;
    }

    .tool-group-title {
        margin: 0 0 7px 2px;
        color: var(--toolfox-text-muted);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.07em;
        text-transform: uppercase;
    }

    .tool-list {
        display: grid;
        gap: 8px;
    }
`,nt=c`
    :host {
        display: block;
    }

    button {
        display: block;
        width: 100%;
        margin: 0;
        padding: 13px;
        border: 1px solid var(--toolfox-border);
        border-radius: var(--toolfox-radius-panel);
        color: var(--toolfox-text);
        background: var(--toolfox-surface);
        box-shadow: var(--toolfox-shadow-card);
        cursor: pointer;
        font: inherit;
        text-align: left;
        transition: border-color 120ms ease, background 120ms ease,
            box-shadow 120ms ease, transform 120ms ease;
    }

    button:hover:not(:disabled) {
        border-color: color-mix(in srgb, var(--toolfox-brand) 45%, var(--toolfox-border));
        box-shadow: 0 4px 12px color-mix(in srgb, var(--toolfox-text-strong) 9%, transparent);
        transform: translateY(-1px);
    }

    button:focus-visible {
        outline: 2px solid var(--toolfox-focus-outline);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px var(--toolfox-focus-halo);
    }

    button:disabled {
        color: var(--toolfox-text-muted);
        background: var(--toolfox-surface-subtle);
        box-shadow: none;
        cursor: default;
        opacity: .72;
    }

    button:disabled .tool-title {
        color: var(--toolfox-text-muted);
    }

    button[data-danger="true"]:not(:disabled) {
        border-color: var(--toolfox-danger-border);
    }

    button[data-danger="true"]:not(:disabled) .tool-title {
        color: var(--toolfox-danger);
    }

    button[data-danger="true"]:hover:not(:disabled) {
        border-color: var(--toolfox-danger);
        background: var(--toolfox-danger-surface);
    }

    .tool-card-header {
        display: flex;
        gap: 12px;
        justify-content: space-between;
        align-items: flex-start;
    }

    .tool-copy {
        display: block;
        min-width: 0;
    }

    .tool-title {
        margin: 0;
        color: var(--toolfox-text-strong);
        font-size: 13px;
        line-height: 1.35;
    }

    .tool-description,
    .tool-requirement {
        display: block;
        margin-top: 4px;
        color: var(--toolfox-text-muted);
        font-size: 11px;
        line-height: 1.4;
    }

    .tool-requirement {
        color: var(--toolfox-warning);
    }

    .tool-busy {
        display: block;
        margin-top: 5px;
        color: var(--toolfox-brand);
        font-size: 11px;
        font-weight: 650;
        line-height: 1.4;
    }
`;function X(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var rt=`popup-tool-card`,Z=class extends V{constructor(...e){super(...e),this.tool={},this.pageContext={type:`loading`},this.exportInProgress=!1,this.pendingToolId=null}static{this.styles=[Y,nt]}get toolViewModel(){return Ze(this.tool,{pageContext:this.pageContext,exportInProgress:this.exportInProgress,pendingToolId:this.pendingToolId})}activate(){let{id:e,disabled:t}=this.toolViewModel;t||!e||this.dispatchEvent(new CustomEvent(`popup-tool-activate`,{detail:{toolId:e},bubbles:!0,composed:!0}))}render(){let{id:e,title:t,description:n,appearance:r,busyLabel:i,disabled:a,reason:o,busy:s}=this.toolViewModel;return j`
            <button
                type="button"
                data-tool-id=${e}
                data-danger=${r===`danger`?`true`:N}
                ?disabled=${a}
                @click=${this.activate}
            >
                <span class="tool-card-header">
                    <span class="tool-copy">
                        <strong class="tool-title">${t}</strong>
                        <span class="tool-description">${n}</span>

                        ${o?j`<span class="tool-requirement">${o}</span>`:N}

                        ${s?j`<span class="tool-busy">${i}</span>`:N}
                    </span>
                </span>
            </button>
        `}};X([U({attribute:!1})],Z.prototype,`tool`,void 0),X([U({attribute:!1})],Z.prototype,`pageContext`,void 0),X([U({type:Boolean})],Z.prototype,`exportInProgress`,void 0),X([U({attribute:!1})],Z.prototype,`pendingToolId`,void 0),Z=X([H(rt)],Z);var it=`popup-tool-group`,Q=class extends V{constructor(...e){super(...e),this.title=``,this.tools=[],this.pageContext={type:`loading`},this.exportInProgress=!1,this.pendingToolId=null}static{this.styles=[Y,tt]}render(){return j`
            <h2 class="tool-group-title">${this.title}</h2>
            <div class="tool-list">
                ${this.tools.map(e=>j`
                    <popup-tool-card
                        .tool=${e}
                        .pageContext=${this.pageContext}
                        .exportInProgress=${this.exportInProgress}
                        .pendingToolId=${this.pendingToolId}
                    ></popup-tool-card>
                `)}
            </div>
        `}};X([U({type:String})],Q.prototype,`title`,void 0),X([U({attribute:!1})],Q.prototype,`tools`,void 0),X([U({attribute:!1})],Q.prototype,`pageContext`,void 0),X([U({type:Boolean})],Q.prototype,`exportInProgress`,void 0),X([U({attribute:!1})],Q.prototype,`pendingToolId`,void 0),Q=X([H(it)],Q);async function at(){let[e]=await chrome.tabs.query({active:!0,currentWindow:!0});return Je(e)}async function ot(){return!!(await chrome.storage.local.get(`exportInProgress`)).exportInProgress}function st(e,t){let n={action:t};return He(n)?new Promise((t,r)=>{chrome.tabs.sendMessage(e,n,e=>{chrome.runtime.lastError?r(Error(chrome.runtime.lastError.message)):t(e)})}):Promise.reject(Error(`Unsupported Toolfox command.`))}function ct(e){let t=t=>{Ue(t)&&e(t)};return chrome.runtime.onMessage.addListener(t),()=>chrome.runtime.onMessage.removeListener(t)}var lt=`popup-app`,$=class extends V{constructor(...e){super(...e),this.pageContext={type:`loading`},this.initialized=!1,this.exportInProgress=!1,this.pendingToolId=null,this.status=null,this.connectionVersion=0,this.exportStatusObserved=!1,this.unsubscribeFromExportStatus=null}static{this.styles=[Y,Me]}connectedCallback(){super.connectedCallback();let e=++this.connectionVersion;this.exportStatusObserved=!1,this.unsubscribeFromExportStatus=ct(e=>this.handleExportStatus(e)),this.initialize(e)}disconnectedCallback(){this.connectionVersion+=1,this.unsubscribeFromExportStatus?.(),this.unsubscribeFromExportStatus=null,super.disconnectedCallback()}async initialize(e){let[t,n]=await Promise.allSettled([at(),ot()]);e!==this.connectionVersion||!this.isConnected||(this.pageContext=t.status===`fulfilled`?t.value:{type:`unavailable`},n.status===`fulfilled`&&!this.exportStatusObserved&&(this.exportInProgress=n.value),this.initialized=!0)}handleExportStatus(e){switch(this.exportStatusObserved=!0,this.exportInProgress=e.state===q.STARTED,e.state){case q.COMPLETE:this.status={message:`Экспорт завершён.`,isError:!1};break;case q.ERROR:this.status={message:e.message||`Не удалось экспортировать марафон.`,isError:!0}}}async executeTool(e){let t=Xe(e),n=`tabId`in this.pageContext?this.pageContext.tabId:void 0;if(!t||J(t,this.pageContext)||n===void 0||this.exportInProgress||this.pendingToolId!==null)return;this.status=null,this.pendingToolId=t.id,t.id===`marathon-export`&&(this.exportInProgress=!0);let r=this.connectionVersion;try{if(await st(n,t.command),r!==this.connectionVersion||!this.isConnected)return;this.pendingToolId=null,t.closeOnSuccess&&window.close()}catch(e){if(r!==this.connectionVersion||!this.isConnected)return;t.id===`marathon-export`&&(this.exportInProgress=!1),this.pendingToolId=null,this.status={message:e instanceof Error?e.message:`Не удалось запустить инструмент.`,isError:!0}}}handleToolActivate(e){this.executeTool(e.detail.toolId)}render(){let e=Ye(this.pageContext),t=et(Ke,this.pageContext);return j`
            <header class="app-header">
                <div class="app-mark" aria-hidden="true">TF</div>
                <div>
                    <h1>Toolfox</h1>
                    <p>Инструменты для текущей страницы</p>
                </div>
            </header>

            <main @popup-tool-activate=${this.handleToolActivate}>
                <section class="page-context is-${this.pageContext.type}" aria-live="polite">
                    <span class="context-indicator" aria-hidden="true"></span>
                    <div>
                        <strong>${e.title}</strong>
                        <span>${e.description}</span>
                    </div>
                </section>

                ${this.initialized&&t.length>0?j`
                    <div class="tool-groups">
                        ${t.map(e=>j`
                            <popup-tool-group
                                .title=${e.title}
                                .tools=${e.tools}
                                .pageContext=${this.pageContext}
                                ?exportInProgress=${this.exportInProgress}
                                .pendingToolId=${this.pendingToolId}
                            ></popup-tool-group>
                        `)}
                    </div>
                `:N}

                ${this.status?j`
                    <p class="popup-status ${je({"is-error":this.status.isError})}" role="status">
                        ${this.status.message}
                    </p>
                `:N}
            </main>
        `}};X([W()],$.prototype,`pageContext`,void 0),X([W()],$.prototype,`initialized`,void 0),X([W()],$.prototype,`exportInProgress`,void 0),X([W()],$.prototype,`pendingToolId`,void 0),X([W()],$.prototype,`status`,void 0),$=X([H(lt)],$),t(document.documentElement);