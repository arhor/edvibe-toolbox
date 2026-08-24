(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=Object.freeze({"--edvibe-font-family":`"Segoe UI", Inter, Arial, system-ui, sans-serif`,"--edvibe-z-dialog":`2147483647`,"--edvibe-overlay":`rgba(15, 23, 42, 0.6)`,"--edvibe-surface":`#fff`,"--edvibe-surface-subtle":`#f8fafc`,"--edvibe-surface-app":`#f4f6fa`,"--edvibe-text":`#1f2937`,"--edvibe-text-strong":`#111827`,"--edvibe-text-muted":`#6b7280`,"--edvibe-border":`#d1d5db`,"--edvibe-border-subtle":`#e5e7eb`,"--edvibe-primary":`#2563eb`,"--edvibe-brand":`#4055d3`,"--edvibe-danger":`#b91c1c`,"--edvibe-danger-surface":`#fef2f2`,"--edvibe-danger-border":`#fecaca`,"--edvibe-warning":`#9a3412`,"--edvibe-warning-surface":`#fff7ed`,"--edvibe-warning-border":`#fed7aa`,"--edvibe-success":`#166534`,"--edvibe-success-surface":`#f0fdf4`,"--edvibe-success-border":`#bbf7d0`,"--edvibe-info":`#1e3a8a`,"--edvibe-info-surface":`#eff6ff`,"--edvibe-info-border":`#bfdbfe`,"--edvibe-focus-outline":`#2563eb`,"--edvibe-focus-halo":`rgba(37, 99, 235, 0.25)`,"--edvibe-radius-control":`8px`,"--edvibe-radius-panel":`10px`,"--edvibe-radius-dialog":`16px`,"--edvibe-radius-pill":`999px`,"--edvibe-shadow-card":`0 2px 7px rgba(30, 42, 70, 0.04)`,"--edvibe-shadow-dialog":`0 24px 80px rgba(15, 23, 42, 0.38)`});function t(t,n=e){for(let[e,r]of Object.entries(n))t.style.setProperty(e,r)}var n=globalThis,r=n.ShadowRoot&&(n.ShadyCSS===void 0||n.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,i=Symbol(),a=new WeakMap,o=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(r&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=a.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&a.set(t,e))}return e}toString(){return this.cssText}},s=e=>new o(typeof e==`string`?e:e+``,void 0,i),c=(e,...t)=>new o(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,i),l=(e,t)=>{if(r)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let r of t){let t=document.createElement(`style`),i=n.litNonce;i!==void 0&&t.setAttribute(`nonce`,i),t.textContent=r.cssText,e.appendChild(t)}},u=r?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return s(t)})(e):e,{is:d,defineProperty:ee,getOwnPropertyDescriptor:te,getOwnPropertyNames:ne,getOwnPropertySymbols:re,getPrototypeOf:ie}=Object,f=globalThis,p=f.trustedTypes,ae=p?p.emptyScript:``,oe=f.reactiveElementPolyfillSupport,m=(e,t)=>e,h={toAttribute(e,t){switch(t){case Boolean:e=e?ae:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},g=(e,t)=>!d(e,t),_={attribute:!0,type:String,converter:h,reflect:!1,useDefault:!1,hasChanged:g};Symbol.metadata??=Symbol(`metadata`),f.litPropertyMetadata??=new WeakMap;var v=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&ee(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=te(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_}static _$Ei(){if(this.hasOwnProperty(m(`elementProperties`)))return;let e=ie(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(m(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m(`properties`))){let e=this.properties,t=[...ne(e),...re(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(u(e))}else e!==void 0&&t.push(u(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return l(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?h:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?h:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??g)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};v.elementStyles=[],v.shadowRootOptions={mode:`open`},v[m(`elementProperties`)]=new Map,v[m(`finalized`)]=new Map,oe?.({ReactiveElement:v}),(f.reactiveElementVersions??=[]).push(`2.1.2`);var y=globalThis,b=e=>e,x=y.trustedTypes,S=x?x.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,C=`$lit$`,w=`lit$${Math.random().toFixed(9).slice(2)}$`,T=`?`+w,se=`<${T}>`,E=document,D=()=>E.createComment(``),O=e=>e===null||typeof e!=`object`&&typeof e!=`function`,k=Array.isArray,ce=e=>k(e)||typeof e?.[Symbol.iterator]==`function`,A=`[ 	
\f\r]`,j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,N=/>/g,P=RegExp(`>|${A}(?:([^\\s"'>=/]+)(${A}*=${A}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),le=/'/g,ue=/"/g,F=/^(?:script|style|textarea|title)$/i,I=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),L=Symbol.for(`lit-noChange`),R=Symbol.for(`lit-nothing`),z=new WeakMap,B=E.createTreeWalker(E,129);function V(e,t){if(!k(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return S===void 0?t:S.createHTML(t)}var de=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=j;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===j?c[1]===`!--`?o=M:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=P):(F.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=P):o=N:o===P?c[0]===`>`?(o=i??j,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?P:c[3]===`"`?ue:le):o===ue||o===le?o=P:o===M||o===N?o=j:(o=P,i=void 0);let d=o===P&&e[t+1].startsWith(`/>`)?` `:``;a+=o===j?n+se:l>=0?(r.push(s),n.slice(0,l)+C+n.slice(l)+w+d):n+w+(l===-2?t:d)}return[V(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},H=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=de(t,n);if(this.el=e.createElement(l,r),B.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=B.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(C)){let t=u[o++],n=i.getAttribute(e).split(w),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?pe:r[1]===`?`?me:r[1]===`@`?he:G}),i.removeAttribute(e)}else e.startsWith(w)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(F.test(i.tagName)){let e=i.textContent.split(w),t=e.length-1;if(t>0){i.textContent=x?x.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],D()),B.nextNode(),c.push({type:2,index:++a});i.append(e[t],D())}}}else if(i.nodeType===8){if(i.data===T)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(w,e+1))!==-1;)c.push({type:7,index:a}),e+=w.length-1}}a++}}static createElement(e,t){let n=E.createElement(`template`);return n.innerHTML=e,n}};function U(e,t,n=e,r){if(t===L)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=O(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=U(e,i._$AS(e,t.values),i,r)),t}var fe=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??E).importNode(t,!0);B.currentNode=r;let i=B.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new W(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new ge(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=B.nextNode(),a++)}return B.currentNode=E,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},W=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=R,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=U(this,e,t),O(e)?e===R||e==null||e===``?(this._$AH!==R&&this._$AR(),this._$AH=R):e!==this._$AH&&e!==L&&this._(e):e._$litType$===void 0?e.nodeType===void 0?ce(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==R&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=H.createElement(V(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new fe(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=z.get(e.strings);return t===void 0&&z.set(e.strings,t=new H(e)),t}k(t){k(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(D()),this.O(D()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=b(e).nextSibling;b(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},G=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=R,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=R}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=U(this,e,t,0),a=!O(e)||e!==this._$AH&&e!==L,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=U(this,r[n+o],t,o),s===L&&(s=this._$AH[o]),a||=!O(s)||s!==this._$AH[o],s===R?e=R:e!==R&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===R?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},pe=class extends G{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===R?void 0:e}},me=class extends G{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==R)}},he=class extends G{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=U(this,e,t,0)??R)===L)return;let n=this._$AH,r=e===R&&n!==R||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==R&&(n===R||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ge=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){U(this,e)}},_e=y.litHtmlPolyfillSupport;_e?.(H,W),(y.litHtmlVersions??=[]).push(`3.3.3`);var ve=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new W(t.insertBefore(D(),e),e,void 0,n??{})}return i._$AI(e),i},K=globalThis,q=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ve(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}};q._$litElement$=!0,q.finalized=!0,K.litElementHydrateSupport?.({LitElement:q});var ye=K.litElementPolyfillSupport;ye?.({LitElement:q}),(K.litElementVersions??=[]).push(`4.2.2`);var be=c`
    :host {
        display: block;
    }

    .app-header {
        display: flex;
        gap: 11px;
        align-items: center;
        padding: 18px 18px 15px;
        background: var(--edvibe-surface);
        border-bottom: 1px solid var(--edvibe-border-subtle);
    }

    .app-mark {
        display: grid;
        width: 36px;
        height: 36px;
        flex: 0 0 36px;
        place-items: center;
        border-radius: var(--edvibe-radius-panel);
        color: var(--edvibe-surface);
        background: linear-gradient(
            145deg,
            color-mix(in srgb, var(--edvibe-brand) 85%, var(--edvibe-surface)),
            color-mix(in srgb, var(--edvibe-brand) 85%, var(--edvibe-text-strong))
        );
        box-shadow: 0 5px 12px color-mix(in srgb, var(--edvibe-brand) 22%, transparent);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.04em;
    }

    h1,
    p {
        margin: 0;
    }

    .app-header h1 {
        color: var(--edvibe-text-strong);
        font-size: 16px;
        line-height: 1.25;
        letter-spacing: -0.01em;
    }

    .app-header p {
        margin-top: 2px;
        color: var(--edvibe-text-muted);
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
        border: 1px solid var(--edvibe-border);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    .context-indicator {
        width: 8px;
        height: 8px;
        flex: 0 0 8px;
        margin-top: 5px;
        border-radius: 50%;
        background: var(--edvibe-text-muted);
        box-shadow: 0 0 0 3px var(--edvibe-surface-subtle);
    }

    .page-context.is-marathon .context-indicator {
        background: var(--edvibe-success);
        box-shadow: 0 0 0 3px var(--edvibe-success-surface);
    }

    .page-context.is-edvibe .context-indicator {
        background: var(--edvibe-warning);
        box-shadow: 0 0 0 3px var(--edvibe-warning-surface);
    }

    .page-context strong,
    .page-context span {
        display: block;
    }

    .page-context strong {
        color: var(--edvibe-text-strong);
        font-size: 13px;
        line-height: 1.35;
    }

    .page-context div > span {
        margin-top: 2px;
        color: var(--edvibe-text-muted);
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
        border: 1px solid var(--edvibe-success-border);
        border-radius: var(--edvibe-radius-control);
        color: var(--edvibe-success);
        background: var(--edvibe-success-surface);
        font-size: 11px;
        line-height: 1.4;
    }

    .popup-status.is-error {
        border-color: var(--edvibe-danger-border);
        color: var(--edvibe-danger);
        background: var(--edvibe-danger-surface);
    }
`,J={START_EXPORT:`START_FULL_AUTOMATION`,OPEN_LESSON_RESET:`OPEN_LESSON_RESET`,OPEN_ACTION_RECORDER:`OPEN_ACTION_RECORDER`,OPEN_BATCH_LESSON_ACCESS:`OPEN_BATCH_LESSON_ACCESS`,OPEN_BATCH_USER_ONBOARDING:`OPEN_BATCH_USER_ONBOARDING`,OPEN_BATCH_USER_MANAGEMENT:`OPEN_BATCH_USER_MANAGEMENT`,OPEN_BATCH_SECTION_CREATION:`OPEN_BATCH_SECTION_CREATION`,OPEN_BATCH_SECTION_DELETION:`OPEN_BATCH_SECTION_DELETION`,OPEN_VIDEO_ATTACHMENT:`OPEN_VIDEO_ATTACHMENT`,OPEN_EXECUTION_HISTORY:`OPEN_EXECUTION_HISTORY`},Y={START_EXPORT:`EDVIBE_TOOLBOX_START_ALL`,OPEN_LESSON_RESET:`EDVIBE_TOOLBOX_OPEN_RESET`,OPEN_ACTION_RECORDER:`EDVIBE_TOOLBOX_OPEN_RECORDER`,OPEN_BATCH_LESSON_ACCESS:`EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS`,OPEN_BATCH_USER_ONBOARDING:`EDVIBE_TOOLBOX_OPEN_BATCH_USER_ONBOARDING`,OPEN_BATCH_USER_MANAGEMENT:`EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT`,OPEN_BATCH_SECTION_CREATION:`EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION`,OPEN_BATCH_SECTION_DELETION:`EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_DELETION`,OPEN_VIDEO_ATTACHMENT:`EDVIBE_TOOLBOX_OPEN_VIDEO_ATTACHMENT`,OPEN_EXECUTION_HISTORY:`EDVIBE_TOOLBOX_OPEN_EXECUTION_HISTORY`,EXPORT_STATUS:`EDVIBE_TOOLBOX_EXPORT_STATUS`,STORAGE_REQUEST:`EDVIBE_TOOLBOX_STORAGE_REQUEST`,STORAGE_RESPONSE:`EDVIBE_TOOLBOX_STORAGE_RESPONSE`},xe={EXPORT_STATUS:`EXPORT_STATUS`},X={STARTED:`started`,COMPLETE:`complete`,ERROR:`error`},Se={GET:`get`,SET:`set`},Ce={EXECUTION_HISTORY_PREFERENCES:`executionHistoryPreferences`},Z={[J.START_EXPORT]:{type:Y.START_EXPORT,info:`Automation sequence channeled to page engine.`},[J.OPEN_LESSON_RESET]:{type:Y.OPEN_LESSON_RESET,info:`Lesson reset workflow opened.`},[J.OPEN_ACTION_RECORDER]:{type:Y.OPEN_ACTION_RECORDER,info:`Action recorder opened.`},[J.OPEN_BATCH_LESSON_ACCESS]:{type:Y.OPEN_BATCH_LESSON_ACCESS,info:`Batch lesson access opened.`},[J.OPEN_BATCH_USER_ONBOARDING]:{type:Y.OPEN_BATCH_USER_ONBOARDING,info:`Batch user onboarding opened.`},[J.OPEN_BATCH_USER_MANAGEMENT]:{type:Y.OPEN_BATCH_USER_MANAGEMENT,info:`Batch user management opened.`},[J.OPEN_BATCH_SECTION_CREATION]:{type:Y.OPEN_BATCH_SECTION_CREATION,info:`Batch section creation opened.`},[J.OPEN_BATCH_SECTION_DELETION]:{type:Y.OPEN_BATCH_SECTION_DELETION,info:`Batch section deletion opened.`},[J.OPEN_VIDEO_ATTACHMENT]:{type:Y.OPEN_VIDEO_ATTACHMENT,info:`YouTube video attachment opened.`},[J.OPEN_EXECUTION_HISTORY]:{type:Y.OPEN_EXECUTION_HISTORY,info:`Execution history opened.`}};new Set(Object.values(Z).map(({type:e})=>e));var we=new Set(Object.values(X));new Set(Object.values(Se)),new Set(Object.values(Ce));function Te(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function Q(e,t){return Object.keys(e).every(e=>t.has(e))}function Ee(e){return typeof e==`string`&&Object.prototype.hasOwnProperty.call(Z,e)?Z[e]:null}function De(e){return Te(e)&&Q(e,new Set([`action`]))&&Ee(e.action)!==null}function Oe(e){return Te(e)&&Q(e,new Set([`action`,`state`,`message`]))&&e.action===xe.EXPORT_STATUS&&we.has(e.state)&&(e.message===void 0||typeof e.message==`string`)}function ke(e){return Object.freeze({...e,tools:Object.freeze(e.tools.map(Object.freeze))})}var Ae=Object.freeze([{id:`history`,title:`История`,tools:[{id:`execution-history`,title:`История операций`,description:`Просмотреть, отфильтровать и скачать сохранённые отчёты.`,command:J.OPEN_EXECUTION_HISTORY,requirement:`edvibe`,busyLabel:`Открывается…`,closeOnSuccess:!0}]},{id:`export`,title:`Экспорт`,tools:[{id:`marathon-export`,title:`Экспорт марафона`,description:`Скачать уроки, материалы и резервный JSON.`,command:J.START_EXPORT,requirement:`marathon`,busyLabel:`Экспортируется…`}]},{id:`management`,title:`Управление`,tools:[{id:`lesson-reset`,title:`Сброс прогресса учеников`,description:`Очистить сохранённые ответы в выбранных уроках.`,command:J.OPEN_LESSON_RESET,requirement:`marathon`,busyLabel:`Открывается…`,appearance:`danger`,closeOnSuccess:!0},{id:`batch-lesson-access`,title:`Открыть доступ к урокам`,description:`Открыть выбранные уроки для списка учеников.`,command:J.OPEN_BATCH_LESSON_ACCESS,requirement:`marathon`,busyLabel:`Открывается…`,closeOnSuccess:!0},{id:`batch-user-onboarding`,title:`Добавить пользователей`,description:`Добавить пользователей и назначить выбранного куратора по списку email.`,command:J.OPEN_BATCH_USER_ONBOARDING,requirement:`marathon`,busyLabel:`Открывается…`,closeOnSuccess:!0},{id:`batch-section-creation`,title:`Создать раздел в уроках`,description:`Добавить один раздел в несколько выбранных уроков.`,command:J.OPEN_BATCH_SECTION_CREATION,requirement:`marathon`,busyLabel:`Открывается…`,closeOnSuccess:!0},{id:`youtube-video-attachment`,title:`Добавить YouTube-видео`,description:`Прикрепить одно видео к выбранным разделам выбранных уроков.`,command:J.OPEN_VIDEO_ATTACHMENT,requirement:`marathon`,busyLabel:`Открывается…`,closeOnSuccess:!0},{id:`batch-section-deletion`,title:`Удалить раздел из уроков`,description:`Безопасно удалить раздел с точным именем из выбранных уроков.`,command:J.OPEN_BATCH_SECTION_DELETION,requirement:`marathon`,busyLabel:`Открывается…`,appearance:`danger`,closeOnSuccess:!0},{id:`batch-user-management`,title:`Управление пользователями`,description:`Снять кураторов и удалить пользователей по списку email.`,command:J.OPEN_BATCH_USER_MANAGEMENT,requirement:`marathon`,busyLabel:`Открывается…`,appearance:`danger`,closeOnSuccess:!0}]},{id:`development`,title:`Разработка`,tools:[{id:`action-recorder`,title:`Запись действий WebSocket`,description:`Записать запросы и ответы выполненного действия.`,command:J.OPEN_ACTION_RECORDER,requirement:`edvibe`,busyLabel:`Открывается…`,closeOnSuccess:!0}]}].map(ke)),je=Object.freeze({loading:Object.freeze({title:`Проверяем страницу…`,description:`Определяем доступные инструменты`}),edvibe:Object.freeze({title:`Страница Edvibe`,description:`Откройте страницу марафона для работы с инструментами`}),unsupported:Object.freeze({title:`Не страница Edvibe`,description:`Toolbox работает на страницах edvibe.com`}),unavailable:Object.freeze({title:`Страница недоступна`,description:`Не удалось определить активную вкладку`})});function Me(e){if(!e?.id||!e.url)return{type:`unavailable`};let t;try{t=new URL(e.url)}catch{return{type:`unsupported`,tabId:e.id}}if(!(t.hostname===`edvibe.com`||t.hostname.endsWith(`.edvibe.com`)))return{type:`unsupported`,tabId:e.id};let n=t.pathname.match(/\/marathon\/(\d+)(?:\/|$)/);return n?{type:`marathon`,marathonId:n[1],tabId:e.id}:{type:`edvibe`,tabId:e.id}}function Ne(e){return e?.type===`marathon`?{title:`Марафон #${e.marathonId}`,description:`Инструменты марафона доступны`}:je[e?.type]||je.unavailable}function Pe(e,t){return e.requirement===`edvibe`?t.type===`edvibe`||t.type===`marathon`?``:`Откройте страницу Edvibe.`:e.requirement!==`marathon`||t.type===`marathon`?``:`Откройте страницу марафона.`}function Fe(e){for(let t of Ae){let n=t.tools.find(t=>t.id===e);if(n)return n}}function Ie(e,{pageContext:t,exportInProgress:n,pendingToolId:r}){let i=Pe(e,t),a=e.id===`marathon-export`&&n,o=r===e.id,s=(n||r!==null)&&!a&&!o;return{...e,disabled:!!(i||a||o||s),reason:i||(s?`Дождитесь завершения другого инструмента.`:``),busy:a||o}}var $=c`
    :host,
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }
`,Le=c`
    :host {
        display: block;
    }

    .tool-group-title {
        margin: 0 0 7px 2px;
        color: var(--edvibe-text-muted);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.07em;
        text-transform: uppercase;
    }

    .tool-list {
        display: grid;
        gap: 8px;
    }
`,Re=c`
    :host {
        display: block;
    }

    button {
        display: block;
        width: 100%;
        margin: 0;
        padding: 13px;
        border: 1px solid var(--edvibe-border);
        border-radius: var(--edvibe-radius-panel);
        color: var(--edvibe-text);
        background: var(--edvibe-surface);
        box-shadow: var(--edvibe-shadow-card);
        cursor: pointer;
        font: inherit;
        text-align: left;
        transition: border-color 120ms ease, background 120ms ease,
            box-shadow 120ms ease, transform 120ms ease;
    }

    button:hover:not(:disabled) {
        border-color: color-mix(in srgb, var(--edvibe-brand) 45%, var(--edvibe-border));
        box-shadow: 0 4px 12px color-mix(in srgb, var(--edvibe-text-strong) 9%, transparent);
        transform: translateY(-1px);
    }

    button:focus-visible {
        outline: 2px solid var(--edvibe-focus-outline);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px var(--edvibe-focus-halo);
    }

    button:disabled {
        color: var(--edvibe-text-muted);
        background: var(--edvibe-surface-subtle);
        box-shadow: none;
        cursor: default;
        opacity: .72;
    }

    button:disabled .tool-title {
        color: var(--edvibe-text-muted);
    }

    button[data-danger="true"]:not(:disabled) {
        border-color: var(--edvibe-danger-border);
    }

    button[data-danger="true"]:not(:disabled) .tool-title {
        color: var(--edvibe-danger);
    }

    button[data-danger="true"]:hover:not(:disabled) {
        border-color: var(--edvibe-danger);
        background: var(--edvibe-danger-surface);
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
        color: var(--edvibe-text-strong);
        font-size: 13px;
        line-height: 1.35;
    }

    .tool-description,
    .tool-requirement {
        display: block;
        margin-top: 4px;
        color: var(--edvibe-text-muted);
        font-size: 11px;
        line-height: 1.4;
    }

    .tool-requirement {
        color: var(--edvibe-warning);
    }

    .tool-busy {
        display: block;
        margin-top: 5px;
        color: var(--edvibe-brand);
        font-size: 11px;
        font-weight: 650;
        line-height: 1.4;
    }
`,ze=`popup-tool-card`,Be=class extends q{static styles=[$,Re];static properties={tool:{attribute:!1},pageContext:{attribute:!1},exportInProgress:{type:Boolean},pendingToolId:{attribute:!1}};constructor(){super(),this.tool={},this.pageContext={type:`loading`},this.exportInProgress=!1,this.pendingToolId=null}get toolViewModel(){return Ie(this.tool,{pageContext:this.pageContext,exportInProgress:this.exportInProgress,pendingToolId:this.pendingToolId})}activate(){let{id:e,disabled:t}=this.toolViewModel;t||!e||this.dispatchEvent(new CustomEvent(`popup-tool-activate`,{detail:{toolId:e},bubbles:!0,composed:!0}))}render(){let{id:e,title:t,description:n,appearance:r,busyLabel:i,disabled:a,reason:o,busy:s}=this.toolViewModel;return I`
            <button
                type="button"
                data-tool-id=${e}
                data-danger=${r===`danger`?`true`:R}
                ?disabled=${a}
                @click=${this.activate}
            >
                <span class="tool-card-header">
                    <span class="tool-copy">
                        <strong class="tool-title">${t}</strong>
                        <span class="tool-description">${n}</span>

                        ${o?I`<span class="tool-requirement">${o}</span>`:R}

                        ${s?I`<span class="tool-busy">${i}</span>`:R}
                    </span>
                </span>
            </button>
        `}};customElements.define(ze,Be);var Ve=`popup-tool-group`,He=class extends q{static styles=[$,Le];static properties={title:{type:String},tools:{attribute:!1},pageContext:{attribute:!1},exportInProgress:{type:Boolean},pendingToolId:{attribute:!1}};constructor(){super(),this.title=``,this.tools=[],this.pageContext={type:`loading`},this.exportInProgress=!1,this.pendingToolId=null}render(){return I`
            <h2 class="tool-group-title">${this.title}</h2>
            <div class="tool-list">
                ${this.tools.map(e=>I`
                    <popup-tool-card
                        .tool=${e}
                        .pageContext=${this.pageContext}
                        .exportInProgress=${this.exportInProgress}
                        .pendingToolId=${this.pendingToolId}
                    ></popup-tool-card>
                `)}
            </div>
        `}};customElements.define(Ve,He);async function Ue(){let[e]=await chrome.tabs.query({active:!0,currentWindow:!0});return Me(e)}async function We(){return!!(await chrome.storage.local.get(`exportInProgress`)).exportInProgress}function Ge(e,t){let n={action:t};return De(n)?new Promise((t,r)=>{chrome.tabs.sendMessage(e,n,e=>{chrome.runtime.lastError?r(Error(chrome.runtime.lastError.message)):t(e)})}):Promise.reject(Error(`Unsupported Toolbox command.`))}function Ke(e){let t=t=>{Oe(t)&&e(t)};return chrome.runtime.onMessage.addListener(t),()=>chrome.runtime.onMessage.removeListener(t)}var qe=`popup-app`,Je=class extends q{static styles=[$,be];static properties={pageContext:{state:!0},initialized:{state:!0},exportInProgress:{state:!0},pendingToolId:{state:!0},status:{state:!0}};constructor(){super(),this.pageContext={type:`loading`},this.initialized=!1,this.exportInProgress=!1,this.pendingToolId=null,this.status=null,this.connectionVersion=0,this.exportStatusObserved=!1,this.unsubscribeFromExportStatus=null}connectedCallback(){super.connectedCallback();let e=++this.connectionVersion;this.exportStatusObserved=!1,this.unsubscribeFromExportStatus=Ke(e=>{this.handleExportStatus(e)}),this.initialize(e)}disconnectedCallback(){this.connectionVersion+=1,this.unsubscribeFromExportStatus?.(),this.unsubscribeFromExportStatus=null,super.disconnectedCallback()}async initialize(e){let[t,n]=await Promise.allSettled([Ue(),We()]);e!==this.connectionVersion||!this.isConnected||(this.pageContext=t.status===`fulfilled`?t.value:{type:`unavailable`},n.status===`fulfilled`&&!this.exportStatusObserved&&(this.exportInProgress=n.value),this.initialized=!0)}handleExportStatus(e){this.exportStatusObserved=!0,this.exportInProgress=e.state===X.STARTED,e.state===X.COMPLETE?this.status={message:`Экспорт завершён.`,isError:!1}:e.state===X.ERROR&&(this.status={message:e.message||`Не удалось экспортировать марафон.`,isError:!0})}async executeTool(e){let t=Fe(e);if(!t||Pe(t,this.pageContext)||!this.pageContext.tabId||this.exportInProgress||this.pendingToolId!==null)return;this.status=null,this.pendingToolId=t.id,t.id===`marathon-export`&&(this.exportInProgress=!0);let n=this.connectionVersion;try{if(await Ge(this.pageContext.tabId,t.command),n!==this.connectionVersion||!this.isConnected)return;this.pendingToolId=null,t.closeOnSuccess&&window.close()}catch(e){if(n!==this.connectionVersion||!this.isConnected)return;t.id===`marathon-export`&&(this.exportInProgress=!1),this.pendingToolId=null,this.status={message:e.message||`Не удалось запустить инструмент.`,isError:!0}}}handleToolActivate(e){this.executeTool(e.detail.toolId)}render(){let e=Ne(this.pageContext);return I`
            <header class="app-header">
                <div class="app-mark" aria-hidden="true">ET</div>
                <div>
                    <h1>Edvibe Toolbox</h1>
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

                ${this.initialized?I`
                    <div class="tool-groups">
                        ${Ae.map(e=>I`
                            <popup-tool-group
                                .title=${e.title}
                                .tools=${e.tools}
                                .pageContext=${this.pageContext}
                                ?exportInProgress=${this.exportInProgress}
                                .pendingToolId=${this.pendingToolId}
                            ></popup-tool-group>
                        `)}
                    </div>
                `:R}

                ${this.status?I`
                    <p class="popup-status ${this.status.isError?`is-error`:``}" role="status">
                        ${this.status.message}
                    </p>
                `:R}
            </main>
        `}};customElements.define(qe,Je),t(document.documentElement);