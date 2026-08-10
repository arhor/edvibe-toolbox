(function(){var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,a)=>(a=n==null?{}:e(i(n)),c(r||!n||!n.__esModule?t(a,`default`,{value:n,enumerable:!0}):a,n)),u=globalThis,d=u.ShadowRoot&&(u.ShadyCSS===void 0||u.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,f=Symbol(),p=new WeakMap,m=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==f)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(d&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=p.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&p.set(t,e))}return e}toString(){return this.cssText}},h=e=>new m(typeof e==`string`?e:e+``,void 0,f),g=(e,...t)=>new m(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,f),_=(e,t)=>{if(d)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let n of t){let t=document.createElement(`style`),r=u.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},v=d?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return h(t)})(e):e,{is:y,defineProperty:b,getOwnPropertyDescriptor:x,getOwnPropertyNames:S,getOwnPropertySymbols:C,getPrototypeOf:w}=Object,T=globalThis,E=T.trustedTypes,D=E?E.emptyScript:``,O=T.reactiveElementPolyfillSupport,k=(e,t)=>e,A={toAttribute(e,t){switch(t){case Boolean:e=e?D:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},j=(e,t)=>!y(e,t),M={attribute:!0,type:String,converter:A,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol(`metadata`),T.litPropertyMetadata??=new WeakMap;var N=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=M){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&b(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=x(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??M}static _$Ei(){if(this.hasOwnProperty(k(`elementProperties`)))return;let e=w(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(k(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k(`properties`))){let e=this.properties,t=[...S(e),...C(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(v(e))}else e!==void 0&&t.push(v(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?A:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?A:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??j)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};N.elementStyles=[],N.shadowRootOptions={mode:`open`},N[k(`elementProperties`)]=new Map,N[k(`finalized`)]=new Map,O?.({ReactiveElement:N}),(T.reactiveElementVersions??=[]).push(`2.1.2`);var P=globalThis,F=e=>e,I=P.trustedTypes,L=I?I.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,R=`$lit$`,z=`lit$${Math.random().toFixed(9).slice(2)}$`,B=`?`+z,ee=`<${B}>`,V=document,H=()=>V.createComment(``),te=e=>e===null||typeof e!=`object`&&typeof e!=`function`,ne=Array.isArray,re=e=>ne(e)||typeof e?.[Symbol.iterator]==`function`,ie=`[ 	
\f\r]`,ae=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,oe=/-->/g,se=/>/g,ce=RegExp(`>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),le=/'/g,ue=/"/g,de=/^(?:script|style|textarea|title)$/i,U=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),fe=Symbol.for(`lit-noChange`),W=Symbol.for(`lit-nothing`),pe=new WeakMap,me=V.createTreeWalker(V,129);function he(e,t){if(!ne(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return L===void 0?t:L.createHTML(t)}var ge=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=ae;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===ae?c[1]===`!--`?o=oe:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=ce):(de.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=ce):o=se:o===ce?c[0]===`>`?(o=i??ae,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?ce:c[3]===`"`?ue:le):o===ue||o===le?o=ce:o===oe||o===se?o=ae:(o=ce,i=void 0);let d=o===ce&&e[t+1].startsWith(`/>`)?` `:``;a+=o===ae?n+ee:l>=0?(r.push(s),n.slice(0,l)+R+n.slice(l)+z+d):n+z+(l===-2?t:d)}return[he(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},_e=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=ge(t,n);if(this.el=e.createElement(l,r),me.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=me.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(R)){let t=u[o++],n=i.getAttribute(e).split(z),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Se:r[1]===`?`?Ce:r[1]===`@`?we:xe}),i.removeAttribute(e)}else e.startsWith(z)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(de.test(i.tagName)){let e=i.textContent.split(z),t=e.length-1;if(t>0){i.textContent=I?I.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],H()),me.nextNode(),c.push({type:2,index:++a});i.append(e[t],H())}}}else if(i.nodeType===8)if(i.data===B)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(z,e+1))!==-1;)c.push({type:7,index:a}),e+=z.length-1}a++}}static createElement(e,t){let n=V.createElement(`template`);return n.innerHTML=e,n}};function ve(e,t,n=e,r){if(t===fe)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=te(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=ve(e,i._$AS(e,t.values),i,r)),t}var ye=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??V).importNode(t,!0);me.currentNode=r;let i=me.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new be(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Te(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=me.nextNode(),a++)}return me.currentNode=V,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},be=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ve(this,e,t),te(e)?e===W||e==null||e===``?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==fe&&this._(e):e._$litType$===void 0?e.nodeType===void 0?re(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&te(this._$AH)?this._$AA.nextSibling.data=e:this.T(V.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=_e.createElement(he(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new ye(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=pe.get(e.strings);return t===void 0&&pe.set(e.strings,t=new _e(e)),t}k(t){ne(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(H()),this.O(H()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=F(e).nextSibling;F(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},xe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=W}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=ve(this,e,t,0),a=!te(e)||e!==this._$AH&&e!==fe,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=ve(this,r[n+o],t,o),s===fe&&(s=this._$AH[o]),a||=!te(s)||s!==this._$AH[o],s===W?e=W:e!==W&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Se=class extends xe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}},Ce=class extends xe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}},we=class extends xe{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=ve(this,e,t,0)??W)===fe)return;let n=this._$AH,r=e===W&&n!==W||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==W&&(n===W||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Te=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){ve(this,e)}},Ee=P.litHtmlPolyfillSupport;Ee?.(_e,be),(P.litHtmlVersions??=[]).push(`3.3.3`);var De=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new be(t.insertBefore(H(),e),e,void 0,n??{})}return i._$AI(e),i},Oe=globalThis,G=class extends N{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=De(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return fe}};G._$litElement$=!0,G.finalized=!0,Oe.litElementHydrateSupport?.({LitElement:G});var ke=Oe.litElementPolyfillSupport;ke?.({LitElement:G}),(Oe.litElementVersions??=[]).push(`4.2.2`);var Ae=g`
    :host {
        --edvibe-font-family: "Segoe UI", Inter, Arial, system-ui, sans-serif;
        --edvibe-dialog-z-index: 2147483647;
        --edvibe-overlay-background: rgba(15, 23, 42, 0.6);
        --edvibe-surface: #fff;
        --edvibe-text: #1f2937;
        --edvibe-muted-text: #6b7280;
        --edvibe-border: #d9dfe9;
        --edvibe-primary: #4055d3;
        --edvibe-danger: #c93a3a;
        --edvibe-radius: 14px;
    }

    button,
    input,
    textarea,
    select {
        font: inherit;
    }
`,je=g`
    :host {
        font-family: var(--edvibe-font-family);
    }
`,Me=g`
:host {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    font-family: "Segoe UI", Arial, sans-serif;
}

.overlay {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.55);
}

.card {
    width: min(630px, calc(100vw - 32px));
    padding: 24px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.35);
    color: #1f2937;
}

h2 { margin: 0 0 8px; color: #111827; font-size: 20px; line-height: 1.3; }
.status {
    min-height: 40px;
    margin: 0 0 16px;
    color: #4b5563;
    font-size: 14px;
    line-height: 1.4;
    white-space: pre-line;
}
.progress {
    display: block;
    width: 100%;
    height: 12px;
    overflow: hidden;
    border: 0;
    border-radius: 999px;
    background: #e5e7eb;
    appearance: none;
}
.progress::-webkit-progress-bar { background: #e5e7eb; }
.progress::-webkit-progress-value {
    border-radius: 999px;
    background: linear-gradient(90deg, #3498db, #22c55e);
    transition: width 0.25s ease;
}
:host([error]) .progress::-webkit-progress-value { background: #e74c3c; }
.meta {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 10px;
    color: #6b7280;
    font-size: 12px;
}
.close {
    display: none;
    width: 100%;
    margin-top: 18px;
    padding: 9px 12px;
    border: 0;
    border-radius: 8px;
    background: #3498db;
    color: #fff;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
}
:host([complete]) .close,
:host([error]) .close { display: block; }

`,Ne=`edvibe-toolbox-export-progress`,Pe=class extends G{static styles=[Ae,je,Me];static properties={statusText:{state:!0},loadedSections:{state:!0},totalSections:{state:!0},countText:{state:!0},progressState:{state:!0}};constructor(){super(),this.statusText=`Preparing export...`,this.loadedSections=0,this.totalSections=0,this.countText=void 0,this.progressState=`loading`}setProgress(e={}){e=e&&typeof e==`object`?e:{};let{statusText:t=``,loadedSections:n=0,totalSections:r=0,countText:i,state:a=`loading`}=e;return this.statusText=String(t||``),this.loadedSections=Number(n)||0,this.totalSections=Number(r)||0,this.countText=i,this.progressState=String(a||`loading`),this.syncHostState(),this}syncHostState(){let e=this.totalSections>0;this.toggleAttribute(`indeterminate`,!e&&this.progressState===`loading`),this.toggleAttribute(`complete`,this.progressState===`complete`),this.toggleAttribute(`error`,this.progressState===`error`)}complete(e,t){return this.setProgress({statusText:e,loadedSections:t,totalSections:t,state:`complete`})}error(e){return this.setProgress({statusText:e,state:`error`})}dismissAfter(e){let t=Number.isFinite(Number(e))?Math.max(0,Number(e)):0;setTimeout(()=>this.remove(),t)}render(){let e=this.totalSections>0,t=this.progressState===`complete`?100:e?Math.min(100,Math.round(this.loadedSections/this.totalSections*100)):0,n=this.countText??(e?`${this.loadedSections} / ${this.totalSections} sections loaded`:this.progressState===`complete`?`Export complete`:`Discovering sections...`),r=e||this.progressState===`complete`?t:W;return U`
            <div class="overlay">
                <section class="card" role="dialog" aria-modal="true" aria-labelledby="export-progress-title">
                    <h2 id="export-progress-title">Exporting marathon</h2>
                    <p class="status">${this.statusText}</p>
                    <progress class="progress" max="100" value=${r}></progress>
                    <div class="meta">
                        <span class="count">${n}</span>
                        <span class="percent">${t}%</span>
                    </div>
                    <button class="close" type="button" @click=${()=>this.remove()}>Close</button>
                </section>
            </div>
        `}};customElements.get(`edvibe-toolbox-export-progress`)||customElements.define(Ne,Pe);var Fe=g`
:host {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: block;
    font-family: "Segoe UI", Arial, sans-serif;
}

:host([hidden]) {
    display: none !important;
}

:host(.is-running) .edvibe-reset-body {
    display: none;
}

.edvibe-reset-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(15, 23, 42, .6);
    box-sizing: border-box;
}

.edvibe-reset-overlay *,
.edvibe-reset-overlay {
    box-sizing: border-box;
}

[hidden] {
    display: none !important;
}

.edvibe-reset-card {
    display: flex;
    flex-direction: column;
    width: min(760px, calc(100vw - 32px));
    max-height: min(820px, calc(100vh - 32px));
    padding: 24px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 24px 80px rgba(15, 23, 42, .38);
    color: #1f2937;
}

.edvibe-reset-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
}

.edvibe-reset-title {
    margin: 0;
    color: #111827;
    font-size: 21px;
    line-height: 1.3;
}

.edvibe-reset-subtitle {
    margin: 5px 0 0;
    color: #6b7280;
    font-size: 13px;
}

.edvibe-reset-step-indicator {
    margin-right: 8px;
    color: #2563eb;
    font-weight: 700;
}

.edvibe-reset-close {
    border: 0;
    padding: 4px 8px;
    background: transparent;
    color: #6b7280;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
}

.edvibe-reset-body {
    flex: 1 1 auto;
    overflow: auto;
    min-height: 0;
    margin-top: 18px;
}

.edvibe-reset-label {
    display: block;
    margin-bottom: 7px;
    color: #374151;
    font-size: 13px;
    font-weight: 650;
}

.edvibe-reset-search {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    outline: none;
    font: inherit;
}

.edvibe-reset-search:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, .15);
}

.edvibe-reset-list {
    overflow: auto;
    max-height: 250px;
    margin-top: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
}

.edvibe-reset-pupils-shell {
    position: relative;
}

.edvibe-reset-pupils-shell.is-loading {
    min-height: 96px;
}

.edvibe-reset-pupils-shell.is-loading .edvibe-reset-pupils {
    opacity: .45;
    pointer-events: none;
}

.edvibe-reset-pupils-loading {
    position: absolute;
    inset: 10px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 10px;
    background: rgba(255, 255, 255, .48);
    color: #374151;
    font-size: 13px;
    font-weight: 650;
}

.edvibe-reset-spinner {
    width: 22px;
    height: 22px;
    border: 3px solid #bfdbfe;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: edvibe-reset-spinner-rotate .8s linear infinite;
}

.edvibe-reset-row {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 10px;
    padding: 11px 12px;
    border: 0;
    border-bottom: 1px solid #f1f5f9;
    background: #fff;
    color: #1f2937;
    text-align: left;
    cursor: pointer;
}

.edvibe-reset-row:last-child {
    border-bottom: 0;
}

.edvibe-reset-row:hover,
.edvibe-reset-row.is-selected {
    background: #eff6ff;
}

.edvibe-reset-row-copy {
    min-width: 0;
}

.edvibe-reset-row-name,
.edvibe-reset-row-email {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.edvibe-reset-row-name {
    font-size: 14px;
    font-weight: 650;
}

.edvibe-reset-row-email {
    margin-top: 2px;
    color: #6b7280;
    font-size: 12px;
}

.edvibe-reset-select-all {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 650;
}

.edvibe-reset-lesson {
    align-items: flex-start;
    cursor: default;
}

.edvibe-reset-lesson input {
    margin-top: 3px;
}

.edvibe-reset-empty {
    margin: 0;
    padding: 22px;
    color: #6b7280;
    text-align: center;
    font-size: 13px;
}

.edvibe-reset-status {
    min-height: 38px;
    margin: 0;
    color: #4b5563;
    font-size: 13px;
    line-height: 1.4;
    white-space: pre-line;
}

.edvibe-reset-live-region {
    flex: 0 0 auto;
    padding-top: 16px;
}

.edvibe-reset-status.is-error {
    color: #b91c1c;
}

.edvibe-reset-status.is-success {
    color: #15803d;
}

.edvibe-reset-progress {
    display: none;
    width: 100%;
    overflow: hidden;
    height: 11px;
    border: 0;
    margin-top: 10px;
    border-radius: 999px;
    background: #e5e7eb;
    appearance: none;
}

.edvibe-reset-progress.is-visible {
    display: block;
}

.edvibe-reset-progress::-webkit-progress-bar {
    background: #e5e7eb;
}

.edvibe-reset-progress::-webkit-progress-value {
    border-radius: 999px;
    background: linear-gradient(90deg, #e74c3c, #f59e0b);
    transition: width .2s ease;
}

.edvibe-reset-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 18px;
}

.edvibe-reset-button {
    padding: 10px 16px;
    border: 0;
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    font-weight: 650;
    cursor: pointer;
}

.edvibe-reset-button:disabled,
button:disabled,
input:disabled {
    cursor: not-allowed;
    opacity: .58;
}

.edvibe-reset-cancel,
.edvibe-reset-back {
    background: #64748b;
}

.edvibe-reset-next {
    background: #2563eb;
}

.edvibe-reset-submit {
    background: #e74c3c;
}

@keyframes edvibe-reset-progress-slide {
    0% {
        transform: translateX(-120%)
    }

    50% {
        transform: translateX(90%)
    }

    100% {
        transform: translateX(270%)
    }
}

@keyframes edvibe-reset-spinner-rotate {
    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion:reduce) {
    .edvibe-reset-spinner {
        animation: none;
    }
}

`,Ie=`edvibe-toolbox-reset-dialog`,Le=`edvibe-toolbox-reset-overlay`,Re=class extends G{static styles=[Ae,je,Fe];static properties={currentStep:{state:!0},allPupils:{state:!0},pupilTotal:{state:!0},selectedPupil:{state:!0},lessons:{state:!0},selectedLessonIds:{state:!0},locked:{state:!0},loading:{state:!0},finished:{state:!0},pupilPageLoading:{state:!0},appliedSearchQuery:{state:!0},searchDebouncing:{state:!0},suppressPupilPageLoading:{state:!0},searchValue:{state:!0},statusMessage:{state:!0},statusState:{state:!0},progressVisible:{state:!0},progressIndeterminate:{state:!0},progressValue:{state:!0}};constructor(){super(),this.searchDelay=1e3,this.log=()=>{},this.loadLessons=null,this.loadNextPupils=null,this.currentStep=`user`,this.allPupils=[],this.pupilTotal=0,this.selectedPupil=null,this.loadedPupilId=null,this.lessons=[],this.selectedLessonIds=new Set,this.locked=!1,this.loading=!1,this.finished=!1,this.closed=!1,this.pupilPagePromise=null,this.pupilPageLoading=!1,this.searchTimer=null,this.searchGeneration=0,this.appliedSearchQuery=``,this.searchDebouncing=!1,this.suppressPupilPageLoading=!1,this.searchValue=``,this.statusMessage=``,this.statusState=``,this.progressVisible=!1,this.progressIndeterminate=!1,this.progressValue=0,this.elements=null,this.handleKeydownBound=e=>this.handleKeydown(e)}connectedCallback(){super.connectedCallback(),this.id||=Le,this.ownerDocument?.addEventListener(`keydown`,this.handleKeydownBound)}disconnectedCallback(){this.cancelSearch(),this.ownerDocument?.removeEventListener(`keydown`,this.handleKeydownBound),super.disconnectedCallback()}configure(e={}){e=e&&typeof e==`object`?e:{};let{searchDelay:t=1e3,loadLessons:n,loadNextPupils:r,log:i=()=>{}}=e;return this.searchDelay=Number.isFinite(Number(t))?Math.max(0,Number(t)):1e3,this.loadLessons=typeof n==`function`?n:null,this.loadNextPupils=typeof r==`function`?r:null,this.log=typeof i==`function`?i:()=>{},this}updated(){this.cacheElements()}cacheElements(){if(!this.shadowRoot){this.elements=null;return}let e=e=>this.shadowRoot.querySelector(e);this.elements={backdrop:e(`.edvibe-reset-overlay`),search:e(`.edvibe-reset-search`),userStep:e(`.edvibe-reset-user-step`),lessonStep:e(`.edvibe-reset-lesson-step`),pupilsShell:e(`.edvibe-reset-pupils-shell`),pupilsList:e(`.edvibe-reset-pupils`),pupilsLoading:e(`.edvibe-reset-pupils-loading`),lessonsList:e(`.edvibe-reset-lessons`),selectAll:e(`.edvibe-reset-select-all-input`),status:e(`.edvibe-reset-status`),progress:e(`.edvibe-reset-progress`),close:e(`.edvibe-reset-close`),cancel:e(`.edvibe-reset-cancel`),back:e(`.edvibe-reset-back`),next:e(`.edvibe-reset-next`),submit:e(`.edvibe-reset-submit`)}}normalizeSearchQuery(e){return String(e||``).trim().toLowerCase()}filterPupils(e){let t=this.normalizeSearchQuery(e);return t?this.allPupils.filter(e=>String(e.Email||``).toLowerCase().includes(t)):this.allPupils}hasMorePupils(){return this.allPupils.length<this.pupilTotal}hasLoadedLessonsForSelectedPupil(){return!!this.selectedPupil&&this.selectedPupil.PupilId===this.loadedPupilId}isPupilLoadingVisible(){return this.loading||this.pupilPageLoading&&!this.suppressPupilPageLoading}getViewState(){let e=this.loading||this.locked||this.finished;return{showingUsers:this.currentStep===`user`,nextDisabled:e||!this.selectedPupil,backDisabled:this.loading||this.locked,submitDisabled:e||!this.selectedPupil||this.selectedLessonIds.size===0,closeDisabled:this.loading||this.locked}}setStatus(e,t=``){this.statusMessage=String(e||``),this.statusState=t===`error`||t===`success`?t:``}renderState(){this.requestUpdate()}renderPupilLoadingState(){this.requestUpdate()}renderPupils(){this.requestUpdate()}selectPupil(e){this.locked||this.finished||this.isPupilLoadingVisible()||e.PupilId===this.selectedPupil?.PupilId||(e.PupilId!==this.loadedPupilId&&(this.loadedPupilId=null,this.lessons=[],this.selectedLessonIds=new Set),this.selectedPupil=e,this.setStatus(`Выбран пользователь: ${e.Email||`email отсутствует`}`))}renderLessons(){this.requestUpdate()}toggleLesson(e,t){t?this.selectedLessonIds.add(e):this.selectedLessonIds.delete(e),this.requestUpdate()}handleSelectAll(e){let t=e?.currentTarget?.checked??this.elements?.selectAll?.checked;this.selectedLessonIds=t?new Set(this.lessons.map(e=>e.MarathonLessonId)):new Set}handleSearchInput(e){this.searchValue=String(e?.currentTarget?.value??this.searchValue),this.searchGeneration+=1,this.cancelSearchTimer(),this.searchDebouncing=!0,this.suppressPupilPageLoading=!0;let t=this.normalizeSearchQuery(this.searchValue),n=this.searchGeneration;this.searchTimer=globalThis.setTimeout(async()=>{if(!this.isCurrentSearch(n,t))return;this.searchTimer=null;let e=!!(t&&this.filterPupils(t).length===0&&this.hasMorePupils());this.searchDebouncing=!1,(e||!this.pupilPageLoading)&&(this.suppressPupilPageLoading=!1),!(e&&!await this.continueSearch(n,t))&&this.isCurrentSearch(n,t)&&(this.appliedSearchQuery=t)},this.searchDelay)}isCurrentSearch(e,t){return!this.closed&&e===this.searchGeneration&&t===this.normalizeSearchQuery(this.searchValue)}cancelSearchTimer(){this.searchTimer!==null&&(globalThis.clearTimeout(this.searchTimer),this.searchTimer=null)}cancelSearch(){this.searchGeneration+=1,this.cancelSearchTimer()}async continueSearch(e,t){for(;this.isCurrentSearch(e,t)&&this.filterPupils(t).length===0&&this.hasMorePupils();)if(!await this.loadNextPupilPage())return!1;return!0}async loadNextPupilPage(){return this.closed||!this.loadNextPupils||!this.hasMorePupils()?!1:this.pupilPagePromise?this.pupilPagePromise:(this.suppressPupilPageLoading=!1,this.pupilPageLoading=!0,this.pupilPagePromise=(async()=>{try{let e=await this.loadNextPupils();return this.closed?!1:(this.allPupils=Array.isArray(e?.pupils)?e.pupils:[],this.pupilTotal=Number(e?.total)||0,this.currentStep===`user`&&!this.loading&&this.setStatus(`Загружено пользователей: ${this.allPupils.length} из ${this.pupilTotal}`),!0)}catch(e){return!this.closed&&this.currentStep===`user`&&!this.loading&&(this.log(`Failed to load another pupil page (${this.errorType(e)}).`),this.setStatus(e.message,`error`)),!1}finally{this.pupilPagePromise=null,this.pupilPageLoading=!1,this.searchDebouncing||(this.suppressPupilPageLoading=!1)}})(),this.pupilPagePromise)}handlePupilsScroll(e){if(this.searchDebouncing)return;let t=e?.currentTarget||this.elements?.pupilsList;t&&t.scrollHeight-t.scrollTop-t.clientHeight<=24&&this.loadNextPupilPage()}async handleNext(){if(!(this.getViewState().nextDisabled||!this.selectedPupil)){if(this.hasLoadedLessonsForSelectedPupil()){this.currentStep=`lessons`,await this.updateComplete,this.shadowRoot?.querySelector(`.edvibe-reset-lessons`)?.focus();return}if(this.loadLessons)try{this.setLoading(`Загрузка уроков для ${this.selectedPupil.Email}...`);let e=await this.loadLessons(this.selectedPupil);this.showLessons(this.selectedPupil,e)}catch(e){this.loading=!1,this.currentStep=`user`,this.log(`Failed to load lessons for PupilId ${this.selectedPupil.PupilId} (${this.errorType(e)}).`),this.setStatus(e.message,`error`)}}}handleBack(){if(!this.getViewState().backDisabled){if(this.finished){this.resetForAnotherUser();return}this.currentStep=`user`,this.setStatus(`Выбран пользователь: ${this.selectedPupil?.Email||`email отсутствует`}`),this.updateComplete.then(()=>this.shadowRoot?.querySelector(`.edvibe-reset-search`)?.focus())}}handleSubmit(){this.getViewState().submitDisabled||this.dispatchEvent(new CustomEvent(`edvibe-reset-request`,{detail:{pupil:this.selectedPupil,lessons:this.lessons.filter(e=>this.selectedLessonIds.has(e.MarathonLessonId))}}))}handleBackdropClick(e){e.target===e.currentTarget&&this.close()}handleKeydown(e){e.key===`Escape`&&this.close()}close(){this.locked||this.loading||this.closed||(this.closed=!0,this.cancelSearch(),this.dispatchEvent(new CustomEvent(`edvibe-dialog-close`)),this.remove())}resetForAnotherUser(){this.finished=!1,this.currentStep=`user`,this.selectedPupil=null,this.loadedPupilId=null,this.lessons=[],this.selectedLessonIds=new Set,this.searchValue=``,this.appliedSearchQuery=``,this.cancelSearch(),this.searchDebouncing=!1,this.suppressPupilPageLoading=!1,this.progressVisible=!1,this.progressIndeterminate=!1,this.progressValue=0,this.setStatus(`Загружено пользователей: ${this.allPupils.length} из ${this.pupilTotal}`),this.updateComplete.then(()=>this.shadowRoot?.querySelector(`.edvibe-reset-search`)?.focus())}showPupils(e={}){e=e&&typeof e==`object`?e:{};let t=Array.isArray(e.pupils)?e.pupils:[],n=Number.isFinite(Number(e.total))?Number(e.total):t.length;return this.allPupils=t,this.pupilTotal=n,this.currentStep=`user`,this.loading=!1,this.setStatus(`Загружено пользователей: ${t.length} из ${n}`),this.updateComplete.then(()=>this.shadowRoot?.querySelector(`.edvibe-reset-search`)?.focus()),this}showLessons(e,t){if(!e||typeof e!=`object`)return this;t=Array.isArray(t)?t:[];let n=this.loadedPupilId!==e.PupilId;return this.selectedPupil=e,this.loadedPupilId=e.PupilId,this.lessons=t,n&&(this.selectedLessonIds=new Set),this.loading=!1,this.currentStep=`lessons`,this.setStatus(`Загружено уроков: ${t.length}`),this.updateComplete.then(()=>this.shadowRoot?.querySelector(`.edvibe-reset-lessons`)?.focus()),this}setLoading(e){this.loading=!0,this.setStatus(e)}lock(){this.locked=!0,this.classList.toggle(`is-running`,!0)}completeRun(){this.locked=!1,this.finished=!0,this.classList.toggle(`is-running`,!1)}unlockAfterRun(){this.locked=!1,this.finished=!1,this.classList.toggle(`is-running`,!1)}showDiscovery(e){this.setStatus(e),this.progressVisible=!0,this.progressIndeterminate=!0}showProgress(e={}){e=e&&typeof e==`object`?e:{};let t=Number(e.completed)||0,n=Number(e.total)||0,r=e.lesson&&typeof e.lesson==`object`?e.lesson:{},i=e.exerciseId,a=n>0?Math.round(t/n*100):100,o=i?`Упражнение ${i}`:`Удаление запроса урока`;this.setStatus(`${r.Name||``}\n${o} — ${t} / ${n}`),this.progressVisible=!0,this.progressIndeterminate=!1,this.progressValue=a}showComplete(e){this.setStatus(e,`success`),this.progressVisible=!0,this.progressIndeterminate=!1,this.progressValue=100}showError(e){this.locked||(this.loading=!1),this.setStatus(e,`error`),this.progressIndeterminate=!1}errorType(e){return typeof e?.name==`string`?e.name:`Error`}renderPupilRows(){let e=this.filterPupils(this.appliedSearchQuery);if(e.length===0)return U`<p class="edvibe-reset-empty">Пользователи не найдены.</p>`;let t=this.isPupilLoadingVisible();return e.map(e=>{let n=e.PupilId===this.selectedPupil?.PupilId;return U`<button type="button" class=${`edvibe-reset-row${n?` is-selected`:``}`} role="option" aria-selected=${String(n)} ?disabled=${t||this.locked||this.finished} @click=${()=>this.selectPupil(e)}><span class="edvibe-reset-row-copy"><span class="edvibe-reset-row-name">${e.Name||`Без имени`}</span><span class="edvibe-reset-row-email">${e.Email||`Email отсутствует`}</span></span></button>`})}renderLessonRows(e){return this.lessons.length===0?U`<p class="edvibe-reset-empty">Для пользователя нет уроков.</p>`:this.lessons.map(t=>U`<label class="edvibe-reset-row edvibe-reset-lesson"><input type="checkbox" .value=${String(t.MarathonLessonId)} .checked=${this.selectedLessonIds.has(t.MarathonLessonId)} ?disabled=${e} @change=${e=>this.toggleLesson(t.MarathonLessonId,e.currentTarget.checked)}><span class="edvibe-reset-row-copy"><span class="edvibe-reset-row-name">${Number(t.Number)+1}. ${t.Name}</span><span class="edvibe-reset-row-email">${t.LastRequest?`Статус последнего запроса: ${t.LastRequest.Status}`:`Нет запросов на проверку`}</span></span></label>`)}render(){let e=this.getViewState(),t=this.locked||this.loading||this.finished,n=this.isPupilLoadingVisible(),r=this.lessons.length>0&&this.selectedLessonIds.size===this.lessons.length,i=this.selectedLessonIds.size>0&&this.selectedLessonIds.size<this.lessons.length,a=`edvibe-reset-status${this.statusState===`error`?` is-error`:this.statusState===`success`?` is-success`:``}`,o=`edvibe-reset-progress${this.progressVisible?` is-visible`:``}${this.progressIndeterminate?` is-indeterminate`:``}`,s=this.progressIndeterminate?W:this.progressValue,c=this.selectedPupil?`${this.selectedPupil.Name||`Без имени`} — ${this.selectedPupil.Email||``}`:``;return U`
<div class="edvibe-reset-overlay" @click=${this.handleBackdropClick}>
                <div class="edvibe-reset-card" role="dialog" aria-modal="true" aria-labelledby="edvibe-reset-title">
                    <div class="edvibe-reset-header"><div><h2 id="edvibe-reset-title" class="edvibe-reset-title">Сброс уроков</h2><p class="edvibe-reset-subtitle"><span class="edvibe-reset-step-indicator">${e.showingUsers?`Шаг 1 из 2`:`Шаг 2 из 2`}</span><span class="edvibe-reset-step-description">${e.showingUsers?`Выберите пользователя.`:`Выберите уроки для сброса прогресса.`}</span></p></div><button class="edvibe-reset-close" type="button" aria-label="Закрыть" ?disabled=${e.closeDisabled} @click=${()=>this.close()}>&times;</button></div>
                    <div class="edvibe-reset-body">
                        <section class="edvibe-reset-user-step" aria-label="Выбор пользователя" ?hidden=${!e.showingUsers}><label class="edvibe-reset-label" for="edvibe-reset-search">Поиск по email</label><input id="edvibe-reset-search" class="edvibe-reset-search" type="search" placeholder="user@example.com" autocomplete="off" .value=${this.searchValue} ?disabled=${t} @input=${this.handleSearchInput}><div class=${`edvibe-reset-pupils-shell${n?` is-loading`:``}`}><div class="edvibe-reset-list edvibe-reset-pupils" role="listbox" aria-label="Пользователи марафона" aria-busy=${String(n)} .inert=${n} @scroll=${this.handlePupilsScroll}>${this.renderPupilRows()}</div><div class="edvibe-reset-pupils-loading" role="status" aria-live="polite" ?hidden=${!n}><span class="edvibe-reset-spinner" aria-hidden="true"></span><span>Загрузка пользователей...</span></div></div></section>
                        <section class="edvibe-reset-lesson-step" aria-label="Выбор уроков" ?hidden=${e.showingUsers}><div class="edvibe-reset-label edvibe-reset-selected-pupil">${c}</div><label class="edvibe-reset-select-all"><input class="edvibe-reset-select-all-input" type="checkbox" .checked=${r} .indeterminate=${i} ?disabled=${t||this.lessons.length===0} @change=${this.handleSelectAll}>Выбрать все уроки</label><div class="edvibe-reset-list edvibe-reset-lessons" aria-label="Уроки пользователя" tabindex="-1">${this.renderLessonRows(t)}</div></section>
                    </div>
                    <div class="edvibe-reset-live-region"><p class=${a} aria-live="polite">${this.statusMessage}</p><progress class=${o} max="100" value=${s}></progress></div>
                    <div class="edvibe-reset-footer"><button class="edvibe-reset-button edvibe-reset-cancel" type="button" ?disabled=${e.closeDisabled} @click=${()=>this.close()}>Закрыть</button><button class="edvibe-reset-button edvibe-reset-back" type="button" ?hidden=${e.showingUsers} ?disabled=${e.backDisabled} @click=${this.handleBack}>${this.finished?`Сбросить для другого пользователя`:`Назад`}</button><button class="edvibe-reset-button edvibe-reset-next" type="button" ?hidden=${!e.showingUsers} ?disabled=${e.nextDisabled} @click=${this.handleNext}>Далее</button><button class="edvibe-reset-button edvibe-reset-submit" type="button" ?hidden=${e.showingUsers} ?disabled=${e.submitDisabled} @click=${this.handleSubmit}>Сбросить прогресс</button></div>
                </div>
            </div>`}};customElements.get(`edvibe-toolbox-reset-dialog`)||customElements.define(Ie,Re);var ze=new Set([`POPUP`,`MAIN`,`ISOLATED`]);function Be(e){if(!ze.has(e))throw Error(`Unsupported logging world: ${e}`);return function(t){if(t!==void 0&&(typeof t!=`string`||!t.trim()))throw Error(`Component must be a non-empty string.`);let n=`[Edvibe Toolbox][${e}]${t?`[${t.trim()}]`:``}`;return(...e)=>console.log(n,...e)}}var Ve=Object.freeze({START_EXPORT:`START_FULL_AUTOMATION`,OPEN_LESSON_RESET:`OPEN_LESSON_RESET`,OPEN_ACTION_RECORDER:`OPEN_ACTION_RECORDER`,OPEN_BATCH_LESSON_ACCESS:`OPEN_BATCH_LESSON_ACCESS`,OPEN_BATCH_USER_ONBOARDING:`OPEN_BATCH_USER_ONBOARDING`,OPEN_BATCH_USER_MANAGEMENT:`OPEN_BATCH_USER_MANAGEMENT`,OPEN_BATCH_SECTION_CREATION:`OPEN_BATCH_SECTION_CREATION`,OPEN_BATCH_SECTION_DELETION:`OPEN_BATCH_SECTION_DELETION`,OPEN_EXECUTION_HISTORY:`OPEN_EXECUTION_HISTORY`}),K=Object.freeze({START_EXPORT:`EDVIBE_TOOLBOX_START_ALL`,OPEN_LESSON_RESET:`EDVIBE_TOOLBOX_OPEN_RESET`,OPEN_ACTION_RECORDER:`EDVIBE_TOOLBOX_OPEN_RECORDER`,OPEN_BATCH_LESSON_ACCESS:`EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS`,OPEN_BATCH_USER_ONBOARDING:`EDVIBE_TOOLBOX_OPEN_BATCH_USER_ONBOARDING`,OPEN_BATCH_USER_MANAGEMENT:`EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT`,OPEN_BATCH_SECTION_CREATION:`EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION`,OPEN_BATCH_SECTION_DELETION:`EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_DELETION`,OPEN_EXECUTION_HISTORY:`EDVIBE_TOOLBOX_OPEN_EXECUTION_HISTORY`,EXPORT_STATUS:`EDVIBE_TOOLBOX_EXPORT_STATUS`,STORAGE_REQUEST:`EDVIBE_TOOLBOX_STORAGE_REQUEST`,STORAGE_RESPONSE:`EDVIBE_TOOLBOX_STORAGE_RESPONSE`});Object.freeze({EXPORT_STATUS:`EXPORT_STATUS`});var He=Object.freeze({STARTED:`started`,COMPLETE:`complete`,ERROR:`error`}),Ue=Object.freeze({GET:`get`,SET:`set`}),We=Object.freeze({EXECUTION_HISTORY_PREFERENCES:`executionHistoryPreferences`}),Ge=Object.freeze({[Ve.START_EXPORT]:Object.freeze({type:K.START_EXPORT,info:`Automation sequence channeled to page engine.`}),[Ve.OPEN_LESSON_RESET]:Object.freeze({type:K.OPEN_LESSON_RESET,info:`Lesson reset workflow opened.`}),[Ve.OPEN_ACTION_RECORDER]:Object.freeze({type:K.OPEN_ACTION_RECORDER,info:`Action recorder opened.`}),[Ve.OPEN_BATCH_LESSON_ACCESS]:Object.freeze({type:K.OPEN_BATCH_LESSON_ACCESS,info:`Batch lesson access opened.`}),[Ve.OPEN_BATCH_USER_ONBOARDING]:Object.freeze({type:K.OPEN_BATCH_USER_ONBOARDING,info:`Batch user onboarding opened.`}),[Ve.OPEN_BATCH_USER_MANAGEMENT]:Object.freeze({type:K.OPEN_BATCH_USER_MANAGEMENT,info:`Batch user management opened.`}),[Ve.OPEN_BATCH_SECTION_CREATION]:Object.freeze({type:K.OPEN_BATCH_SECTION_CREATION,info:`Batch section creation opened.`}),[Ve.OPEN_BATCH_SECTION_DELETION]:Object.freeze({type:K.OPEN_BATCH_SECTION_DELETION,info:`Batch section deletion opened.`}),[Ve.OPEN_EXECUTION_HISTORY]:Object.freeze({type:K.OPEN_EXECUTION_HISTORY,info:`Execution history opened.`})}),Ke=new Set(Object.values(Ge).map(({type:e})=>e)),qe=new Set(Object.values(He)),Je=new Set(Object.values(Ue)),Ye=new Set(Object.values(We));function Xe(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function Ze(e,t){return Object.keys(e).every(e=>t.has(e))}function Qe(e){return typeof e==`string`&&e.length>0}function $e(e){return!Xe(e)||!Ke.has(e.type)?!1:e.type===K.OPEN_EXECUTION_HISTORY?Ze(e,new Set([`type`,`executionId`]))&&(e.executionId===void 0||e.executionId===null||Qe(e.executionId)):Ze(e,new Set([`type`]))}function et(e,t=``){if(!qe.has(e))throw TypeError(`Unsupported export state: ${String(e)}`);if(typeof t!=`string`)throw TypeError(`Export status message must be a string`);return Object.freeze({type:K.EXPORT_STATUS,state:e,message:t})}function tt({requestId:e,action:t,key:n,value:r}){let i={type:K.STORAGE_REQUEST,requestId:e,action:t,key:n};if(t===Ue.SET&&(i.value=r),!nt(i))throw TypeError(`Invalid storage request`);return Object.freeze(i)}function nt(e){return!Xe(e)||e.type!==K.STORAGE_REQUEST||!Qe(e.requestId)||!Je.has(e.action)||!Ye.has(e.key)||!Ze(e,new Set([`type`,`requestId`,`action`,`key`,`value`]))?!1:e.action===Ue.GET?!Object.prototype.hasOwnProperty.call(e,`value`):Object.prototype.hasOwnProperty.call(e,`value`)&&e.value!==void 0}function rt(e){return!Xe(e)||e.type!==K.STORAGE_RESPONSE||!Qe(e.requestId)||typeof e.ok!=`boolean`||!Ze(e,new Set([`type`,`requestId`,`ok`,`value`,`error`]))?!1:e.ok?!Object.prototype.hasOwnProperty.call(e,`error`):Qe(e.error)&&!Object.prototype.hasOwnProperty.call(e,`value`)}var it=15e3;function at(e,t,n={}){let r=Error(t);r.code=e;for(let e of[`controller`,`method`,`requestId`,`serverErrorCode`,`cause`])n[e]!==void 0&&(r[e]=n[e]);return r}function ot({WebSocketClass:e,cryptoApi:t,requestTimeoutMs:n=it,setTimeoutFn:r=setTimeout,clearTimeoutFn:i=clearTimeout,now:a=Date.now,log:o=()=>{}}){let s=null,c=1,l=0,u=new Map,d=new Set;function f(e){return typeof e==`string`?typeof TextEncoder<`u`?new TextEncoder().encode(e).byteLength:unescape(encodeURIComponent(e)).length:typeof Blob<`u`&&e instanceof Blob?e.size:typeof ArrayBuffer<`u`&&(e instanceof ArrayBuffer||ArrayBuffer.isView(e))?e.byteLength:null}function p(e){return typeof e==`string`?`text`:typeof Blob<`u`&&e instanceof Blob?`blob`:typeof ArrayBuffer<`u`&&(e instanceof ArrayBuffer||ArrayBuffer.isView(e))?`array-buffer`:`other`}function m({direction:e,socketId:t,data:n,origin:r}){if(d.size===0)return;let i=p(n),s={direction:e,socketId:t,capturedAt:a(),dataType:i,byteLength:f(n),origin:r};i===`text`&&(s.data=n);for(let e of[...d])try{e(s)}catch(e){o(`Frame observer failed:`,e)}}function h(e){if(typeof e!=`function`)throw TypeError(`Frame observer must be a function.`);return d.add(e),()=>d.delete(e)}function g(e,n,r,i){return{Controller:e,Method:n,ProjectName:r,RequestId:t.randomUUID(),Value:JSON.stringify(i)}}function _(e,t){let n=null;if(typeof e.data==`string`)try{n=JSON.parse(e.data)}catch{}let r=!!(n?.RequestId&&u.has(n.RequestId));if(m({direction:`inbound`,socketId:t,data:e.data,origin:r?`toolbox`:`page`}),typeof e.data==`string`)try{if(!n||!n.RequestId||!u.has(n.RequestId))return;let e=u.get(n.RequestId);u.delete(n.RequestId),i(e.timeoutId);let t=a()-e.startedAt,r=n.IsSuccess===!0?`success`:`failed (${n.ErrorCode})`;if(o(`← ${e.controller}.${e.method} [${n.RequestId}] ${r} in ${t}ms`),n.IsSuccess!==!0){e.reject(at(`SERVER_REJECTED`,`${n.Class||`Edvibe`}:${n.Method||`request`} failed with ErrorCode ${n.ErrorCode}`,{controller:e.controller,method:e.method,requestId:n.RequestId,serverErrorCode:n.ErrorCode}));return}e.resolve(n)}catch(e){o(`Failed parsing WebSocket frame:`,e)}}function v(t){function n(t,n){o(`Intercepting WebSocket targeting:`,t);let r=n===void 0?new e(t):new e(t,n),i=c;c+=1,s=r;let a=r.send;return r.send=function(e){return m({direction:`outbound`,socketId:i,data:e,origin:l>0?`toolbox`:`page`}),a.call(r,e)},r.addEventListener(`message`,e=>{_(e,i)}),r}n.prototype=e.prototype,t.WebSocket=n}function y(t,n){if(!s||s.readyState!==e.OPEN)throw at(`WS_UNAVAILABLE`,`Active WebSocket connection is missing. Please reload the Edvibe tab context.`,{controller:t,method:n});return s}function b(){return{isOpen:!!(s&&s.readyState===e.OPEN)}}function x(e,t,s,c){return new Promise((d,f)=>{let p;try{p=y(e,t)}catch(e){o(`No active WebSocket connection.`),f(e);return}let m=g(e,t,s,c),h=r(()=>{u.delete(m.RequestId),o(`✕ ${e}.${t} [${m.RequestId}] timed out after ${n}ms`),f(at(`REQUEST_TIMEOUT`,`${e}:${t} timed out after ${n}ms.`,{controller:e,method:t,requestId:m.RequestId}))},n);u.set(m.RequestId,{resolve:d,reject:f,timeoutId:h,controller:e,method:t,startedAt:a()}),o(`→ ${e}.${t} [${m.RequestId}]`);try{l+=1;try{p.send(JSON.stringify(m))}finally{--l}}catch(n){i(h),u.delete(m.RequestId),o(`✕ ${e}.${t} [${m.RequestId}] send failed: ${n.message}`),f(at(`SEND_FAILED`,n.message,{controller:e,method:t,requestId:m.RequestId,cause:n}))}})}function S(e,t,n,r){let i=y(e,t),a=g(e,t,n,r);o(`→ ${e}.${t} [${a.RequestId}] (no response expected)`),l+=1;try{i.send(JSON.stringify(a))}finally{--l}}return{install:v,sendRequest:x,sendWithoutResponse:S,subscribeFrames:h,getConnectionState:b}}function st(){let e=null;return{canStart(){return e===null},activate(t){return e===null?(e=t,!0):!1},release(t){return e===t?(e=null,!0):!1},getActiveOperation(){return e}}}var ct=s({IndexedDbError:()=>lt,createIndexedDb:()=>yt,requestToPromise:()=>ft,transactionToPromise:()=>pt}),lt=class extends Error{constructor(e,t={},n){super(e,n===void 0?void 0:{cause:n}),this.name=`IndexedDbError`,this.context=Object.freeze({...t}),n!==void 0&&this.cause===void 0&&(this.cause=n)}};function ut(e,t){let n=[t.database&&`database=${t.database}`,t.stores&&`stores=${t.stores.join(`,`)}`,t.store&&`store=${t.store}`,t.index&&`index=${t.index}`,t.mode&&`mode=${t.mode}`,t.operation&&`operation=${t.operation}`,t.version&&`version=${t.version}`].filter(Boolean).join(` `);return n?`${e} (${n})`:e}function dt(e,t,n){return n instanceof lt?n:new lt(ut(e,t),t,n)}function ft(e,t={}){return new Promise((n,r)=>{e.onsuccess=()=>n(e.result),e.onerror=()=>r(dt(`IndexedDB request failed`,t,e.error))})}function pt(e,t={}){return new Promise((n,r)=>{e.oncomplete=()=>n(),e.onerror=()=>r(dt(`IndexedDB transaction failed`,t,e.error)),e.onabort=()=>r(dt(`IndexedDB transaction aborted`,t,e.error))})}function mt(e){let t=typeof e==`string`?[e]:Array.from(e||[]);if(t.length===0)throw TypeError(`At least one object store is required`);return t}function ht(e){let t=Array.from(e.migrations||[]).sort((e,t)=>e.version-t.version),n=new Set;for(let r of t){if(!Number.isInteger(r.version)||r.version<1||r.version>e.version)throw TypeError(`Invalid migration version: ${r.version}`);if(n.has(r.version))throw TypeError(`Duplicate migration version: ${r.version}`);if(typeof r.migrate!=`function`)throw TypeError(`Migration ${r.version} must define migrate()`);n.add(r.version)}return t}function gt(e,t,n){let{range:r=null,direction:i=`next`,limit:a=1/0,keysOnly:o=!1,map:s=null}=t||{};if(!Number.isFinite(a)&&a!==1/0)throw TypeError(`Cursor limit must be a finite number or Infinity`);if(a<0)throw RangeError(`Cursor limit cannot be negative`);return a===0?Promise.resolve([]):new Promise((t,c)=>{let l=[],u;try{u=o?e.openKeyCursor(r,i):e.openCursor(r,i)}catch(e){c(dt(`Failed to open IndexedDB cursor`,n,e));return}u.onerror=()=>c(dt(`IndexedDB cursor failed`,n,u.error)),u.onsuccess=()=>{let e=u.result;if(!e||l.length>=a){t(l);return}let n=o?e.primaryKey:e.value;l.push(typeof s==`function`?s(n,e):n),e.continue()}})}function _t(e,t){return{raw:e,get(n){return ft(e.get(n),{...t,operation:`get`})},getKey(n){return ft(e.getKey(n),{...t,operation:`getKey`})},getAll(n=null,r){return ft(e.getAll(n,r),{...t,operation:`getAll`})},getAllKeys(n=null,r){return ft(e.getAllKeys(n,r),{...t,operation:`getAllKeys`})},count(n=null){return ft(e.count(n),{...t,operation:`count`})},iterate(n={}){return gt(e,n,{...t,operation:`iterate`})}}}function vt(e,t){return{..._t(e,t),put(n,r){return ft(e.put(n,r),{...t,operation:`put`})},add(n,r){return ft(e.add(n,r),{...t,operation:`add`})},delete(n){return ft(e.delete(n),{...t,operation:`delete`})},clear(){return ft(e.clear(),{...t,operation:`clear`})},index(n){return _t(e.index(n),{...t,index:n})}}}function yt(e,t={}){if(!e||typeof e.name!=`string`||e.name.length===0)throw TypeError(`Database definition requires a non-empty name`);if(!Number.isInteger(e.version)||e.version<1)throw TypeError(`Database definition requires a positive integer version`);let n=t.indexedDB||globalThis.indexedDB;if(!n||typeof n.open!=`function`)throw TypeError(`An IndexedDB factory is required`);let r=ht(e),i=null,a=null;function o(e){i===e&&(i=null),a=null}function s(){return i?Promise.resolve(i):a||(a=new Promise((s,c)=>{let l,u=!1,d=null;try{l=n.open(e.name,e.version)}catch(t){c(dt(`Failed to open IndexedDB database`,{database:e.name,version:e.version},t));return}let f=e=>{u||(u=!0,d!==null&&clearTimeout(d),a=null,c(e))};l.onblocked=()=>{let n={database:e.name,version:e.version,operation:`open`},r=dt(`IndexedDB upgrade is blocked by another open connection`,n,l.error);typeof t.onBlocked==`function`&&t.onBlocked(r,n),t.blockedTimeoutMs>0&&d===null&&(d=setTimeout(()=>f(r),t.blockedTimeoutMs))},l.onupgradeneeded=t=>{let n=l.result,i=l.transaction;try{for(let e of r)e.version>t.oldVersion&&e.version<=t.newVersion&&e.migrate({db:n,transaction:i,oldVersion:t.oldVersion,newVersion:t.newVersion,version:e.version})}catch(n){try{i.abort()}catch{}f(dt(`IndexedDB migration failed`,{database:e.name,version:t.newVersion,operation:`migrate`},n))}},l.onerror=()=>f(dt(`Failed to open IndexedDB database`,{database:e.name,version:e.version,operation:`open`},l.error)),l.onsuccess=()=>{let n=l.result;if(u){n.close();return}u=!0,d!==null&&clearTimeout(d),i=n,a=null,n.onversionchange=()=>{n.close(),o(n),typeof t.onVersionChange==`function`&&t.onVersionChange({database:e.name,version:n.version})},s(n)}}),a)}async function c(t,n,r,i=`transaction`){let a=mt(t);if(n!==`readonly`&&n!==`readwrite`)throw TypeError(`Unsupported transaction mode: ${n}`);if(typeof r!=`function`)throw TypeError(`Transaction callback must be a function`);let o=await s(),c={database:e.name,stores:a,mode:n,operation:i},l;try{l=o.transaction(a,n)}catch(e){throw dt(`Failed to create IndexedDB transaction`,c,e)}let u=pt(l,c),d=Object.create(null);for(let e of a)d[e]=vt(l.objectStore(e),{...c,store:e});let f;try{f=r({transaction:l,stores:d,store(e){if(!d[e])throw new lt(ut(`Store is not part of this transaction`,{...c,store:e}),{...c,store:e});return d[e]},abort(e){if(e!==void 0&&l.error===null)try{Object.defineProperty(l,"__edvibeAbortReason",{value:e})}catch{}l.abort()}})}catch(e){try{l.abort()}catch{}try{await u}catch{}throw dt(`IndexedDB transaction callback failed`,c,e)}try{let[e]=await Promise.all([Promise.resolve(f),u]);return e}catch(e){throw dt(`IndexedDB transaction did not commit`,c,l.__edvibeAbortReason||e)}}function l(e){return{get(t){return c(e,`readonly`,({store:n})=>n(e).get(t),`get:${e}`)},put(t,n){return c(e,`readwrite`,({store:r})=>r(e).put(t,n),`put:${e}`)},add(t,n){return c(e,`readwrite`,({store:r})=>r(e).add(t,n),`add:${e}`)},delete(t){return c(e,`readwrite`,({store:n})=>n(e).delete(t),`delete:${e}`)},clear(){return c(e,`readwrite`,({store:t})=>t(e).clear(),`clear:${e}`)},count(t=null){return c(e,`readonly`,({store:n})=>n(e).count(t),`count:${e}`)},iterate(t={}){return c(e,`readonly`,({store:n})=>n(e).iterate(t),`iterate:${e}`)},queryIndex(t,n={}){return c(e,`readonly`,({store:r})=>r(e).index(t).iterate(n),`query-index:${e}.${t}`)},newest(e,t={}){return this.queryIndex(e,{...t,direction:`prev`})}}}function u(){if(i){let e=i;i=null,e.close()}a=null}return Object.freeze({name:e.name,version:e.version,open:s,close:u,reset:u,transaction:c,readonly(e,t,n){return c(e,`readonly`,t,n)},readwrite(e,t,n){return c(e,`readwrite`,t,n)},repository:l})}var bt=Object.freeze([`completed`,`completed_with_failures`,`cancelled`,`interrupted`]),xt=Object.freeze([`requested`,`eligible`,`attempted`,`successful`,`noOp`,`skipped`,`failed`,`notAttempted`]),St=new Set([`auth`,`authorization`,`binary`,`bytes`,`cookie`,`credential`,`credentials`,`frame`,`frames`,`image`,`password`,`recording`,`response`,`session`,`token`,`transport`,`websocket`]);function q(e,t=``){let n=TypeError(t?`${e} (${t})`:e);return n.code=`INVALID_EXECUTION_RECORD`,n.path=t,n}function Ct(e,t){if(!e||typeof e!=`object`||Array.isArray(e))throw q(`Expected an object`,t);let n=Object.getPrototypeOf(e);if(n!==Object.prototype&&n!==null)throw q(`Expected a plain object`,t)}function wt(e,t){let n=e instanceof Date?e:new Date(e);if(Number.isNaN(n.getTime()))throw q(`Expected a valid timestamp`,t);return n.toISOString()}function Tt(e,t,n=160){let r=String(e??``).trim();if(!r)throw q(`Expected a non-empty string`,t);if(r.length>n)throw q(`String exceeds ${n} characters`,t);return r}function Et(e,t,n=500){if(e==null||e===``)return null;let r=String(e).trim();if(r.length>n)throw q(`String exceeds ${n} characters`,t);return r||null}function Dt(e,t){let n=Number(e??0);if(!Number.isSafeInteger(n)||n<0)throw q(`Expected a non-negative safe integer`,t);return n}function Ot(e){let t=String(e).replace(/([a-z0-9])([A-Z])/g,`$1_$2`).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);return t.includes(`raw`)||t.some(e=>St.has(e))}function kt(e,t=`value`,n=new WeakSet){if(e===null||typeof e==`string`||typeof e==`boolean`)return e;if(typeof e==`number`){if(!Number.isFinite(e))throw q(`Expected a finite number`,t);return e}if(e===void 0)return null;if(typeof e==`bigint`||typeof e==`function`||typeof e==`symbol`)throw q(`Unsupported JSON value`,t);if(typeof e!=`object`)throw q(`Unsupported value`,t);if(n.has(e))throw q(`Circular values are not supported`,t);n.add(e);try{if(Array.isArray(e))return e.map((e,r)=>kt(e,`${t}[${r}]`,n));Ct(e,t);let r={};for(let[i,a]of Object.entries(e)){if(Ot(i))throw q(`Unsafe field is not allowed`,`${t}.${i}`);r[i]=kt(a,`${t}.${i}`,n)}return r}finally{n.delete(e)}}function At(e={}){Ct(e,`pageContext`);let t=e.marathonId===void 0||e.marathonId===null||e.marathonId===``?null:String(e.marathonId).trim();return Object.freeze({marathonId:t||null,marathonName:Et(e.marathonName,`pageContext.marathonName`,240)})}function jt(e={}){Ct(e,`counts`);let t={};for(let n of xt)t[n]=Dt(e[n],`counts.${n}`);if(t.successful+t.failed>t.attempted)throw q(`Successful and failed counts cannot exceed attempted count`,`counts`);if(t.attempted+t.notAttempted>t.eligible)throw q(`Attempted and not-attempted counts cannot exceed eligible count`,`counts`);return Object.freeze(t)}function Mt(e,t){Ct(e,`results[${t}]`);let n=e.attempts===void 0?1:Dt(e.attempts,`results[${t}].attempts`),r=e.data===void 0?{}:kt(e.data,`results[${t}].data`);return Object.freeze({order:t,itemId:Et(e.itemId,`results[${t}].itemId`,160),label:Tt(e.label??e.itemId??`Item ${t+1}`,`results[${t}].label`,500),status:Tt(e.status,`results[${t}].status`,80),code:Tt(e.code,`results[${t}].code`,120),message:Tt(e.message,`results[${t}].message`,1e3),attempts:n,data:Object.freeze(r)})}function Nt(e,t){let n=Math.random().toString(36).slice(2,10);return`${t}-${e.getTime().toString(36)}-${n}`}function Pt(e,t={}){Ct(e,`record`);let n=t.now instanceof Date?t.now:new Date(t.now||Date.now()),r=Tt(e.operationType,`operationType`,120),i=t.cryptoApi,a=typeof i?.randomUUID==`function`?i.randomUUID():Nt(n,r),o=Tt(e.id||a,`id`,200),s=Tt(e.status,`status`,80);if(!bt.includes(s))throw q(`Unsupported terminal status`,`status`);let c=wt(e.startedAt,`startedAt`),l=wt(e.completedAt??n,`completedAt`);if(new Date(l).getTime()<new Date(c).getTime())throw q(`Completion timestamp cannot precede start timestamp`,`completedAt`);let u=Array.isArray(e.results)?e.results.map(Mt):(()=>{throw q(`Expected an array`,`results`)})(),d={schemaVersion:1,id:o,operationType:r,startedAt:c,completedAt:l,status:s,pageContext:At(e.pageContext||{}),counts:jt(e.counts||{}),results:Object.freeze(u),message:Et(e.message,`message`,1e3)};return Ft(d),Object.freeze(d)}function Ft(e){if(Ct(e,`record`),e.schemaVersion!==1)throw q(`Unsupported execution record schema version`,`schemaVersion`);if(Tt(e.id,`id`,200),Tt(e.operationType,`operationType`,120),wt(e.startedAt,`startedAt`),wt(e.completedAt,`completedAt`),!bt.includes(e.status))throw q(`Unsupported terminal status`,`status`);if(At(e.pageContext||{}),jt(e.counts||{}),!Array.isArray(e.results))throw q(`Expected an array`,`results`);return e.results.forEach((e,t)=>Mt(e,t)),kt(e,`record`),!0}function It(e){return Ft(e),JSON.parse(JSON.stringify(e))}var Lt=`edvibe-toolbox`,Rt=`executionHistory`,zt=Object.freeze({name:Lt,version:1,migrations:Object.freeze([Object.freeze({version:1,migrate({db:e}){if(e.objectStoreNames.contains(`executionHistory`))return;let t=e.createObjectStore(Rt,{keyPath:`id`});t.createIndex(`completedAt`,`completedAt`,{unique:!1}),t.createIndex(`operationType`,`operationType`,{unique:!1}),t.createIndex(`status`,`status`,{unique:!1}),t.createIndex(`marathonId`,`pageContext.marathonId`,{unique:!1})}})])});function Bt(e,t,n=!1){if(!e)return null;let r=String(e),i=/^\d{4}-\d{2}-\d{2}$/.test(r)?new Date(`${r}T${n?`23:59:59.999`:`00:00:00.000`}`):new Date(e);if(Number.isNaN(i.getTime()))throw TypeError(`Invalid ${t}`);return i.getTime()}function Vt(e,t={}){if(t.operationType&&e.operationType!==t.operationType||t.status&&e.status!==t.status||t.marathonId&&String(e.pageContext?.marathonId||``)!==String(t.marathonId))return!1;let n=new Date(e.completedAt).getTime(),r=Bt(t.from,`from`),i=Bt(t.to,`to`,!0);return!(r!==null&&n<r||i!==null&&n>i)}function Ht(e={}){let t=e.indexedDbApi||ct;if(!t?.createIndexedDb)throw TypeError(`IndexedDB API is required`);let n=t.createIndexedDb(zt,{indexedDB:e.indexedDB}),r=n.repository(Rt);return Object.freeze({async persist(e){return Ft(e),await r.put(e),It(e)},async get(e){let t=await r.get(String(e));return t?It(t):null},async list(e={}){return(await r.newest(`completedAt`)).filter(t=>Vt(t,e)).map(It)},async delete(e){await r.delete(String(e))},async clear(){await r.clear()},count(){return r.count()},close(){n.close()}})}var Ut=`executionHistoryPreferences`,Wt=Object.freeze({mode:`limits`,maxCount:100,maxAgeDays:90,autoExport:!1});function Gt(e,t,n){let r=Number(e);if(!Number.isSafeInteger(r)||r<=0){if(e==null||e===``)return t;throw TypeError(`${n} must be a positive integer`)}return r}function Kt(e={}){let t=e.mode===`indefinite`?`indefinite`:`limits`;return Object.freeze({mode:t,maxCount:Gt(e.maxCount,Wt.maxCount,`maxCount`),maxAgeDays:Gt(e.maxAgeDays,Wt.maxAgeDays,`maxAgeDays`),autoExport:!!e.autoExport})}function qt(e){if(!e||typeof e.get!=`function`||typeof e.set!=`function`)throw TypeError(`A storage adapter with get() and set() is required`);return Object.freeze({async get(){return Kt(await e.get(`executionHistoryPreferences`)||{})},async set(t){let n=Kt(t);return await e.set(Ut,n),n}})}async function Jt({repository:e,preferences:t,now:n=new Date,protectedExecutionId:r=null}){let i=Kt(t);if(i.mode===`indefinite`)return Object.freeze({deletedIds:Object.freeze([])});let a=await e.list(),o=n.getTime()-i.maxAgeDays*24*60*60*1e3,s=new Set;a.forEach((e,t)=>{e.id!==r&&(t>=i.maxCount||new Date(e.completedAt).getTime()<o)&&s.add(e.id)});for(let t of s)await e.delete(t);return Object.freeze({deletedIds:Object.freeze([...s])})}function Yt(e){return Ft(e),`${JSON.stringify(e,null,2)}\n`}function Xt(e){if(!Array.isArray(e))throw TypeError(`Records must be an array`);return e.forEach(Ft),`${JSON.stringify(e,null,2)}\n`}function Zt(e){return String(e||`operation`).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-|-$/g,``)||`operation`}function Qt(e){return new Date(e).toISOString().replace(/[-:]/g,``).replace(/\.\d{3}Z$/,`Z`)}function $t(e){return Ft(e),`edvibe-${Zt(e.operationType)}-${Qt(e.completedAt)}-${Zt(e.id).slice(-36)}.json`}function en(e=new Date){return`edvibe-execution-history-${Qt(e)}.json`}function tn(e={}){let t=e.document||globalThis.document,n=e.URL||globalThis.URL,r=e.Blob||globalThis.Blob;return!t?.createElement||!n?.createObjectURL||!r?Object.freeze({download(){throw Error(`Browser download APIs are unavailable`)}}):Object.freeze({download({filename:e,json:i}){let a=new r([i],{type:`application/json;charset=utf-8`}),o=n.createObjectURL(a),s=t.createElement(`a`);s.href=o,s.download=e,s.hidden=!0,(t.body||t.documentElement).append(s);try{s.click()}finally{s.remove(),n.revokeObjectURL(o)}}})}K.STORAGE_REQUEST,K.STORAGE_RESPONSE;function nn(e={}){let t=e.window||globalThis.window,n=e.cryptoApi||globalThis.crypto,r=e.timeoutMs||5e3;if(!t?.postMessage||!t?.addEventListener)throw TypeError(`Window messaging APIs are required`);let i=new Map,a=e=>{if(e.source!==t||!rt(e.data))return;let n=i.get(e.data.requestId);n&&(i.delete(e.data.requestId),clearTimeout(n.timer),e.data.ok?n.resolve(e.data.value):n.reject(Error(e.data.error||`Storage request failed`)))};t.addEventListener(`message`,a);function o(e,a,o){let s=typeof n?.randomUUID==`function`?n.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`,c;try{c=tt({requestId:s,action:e,key:a,value:o})}catch(e){return Promise.reject(e)}return new Promise((e,n)=>{let a=setTimeout(()=>{i.delete(s),n(Error(`Storage request timed out`))},r);i.set(s,{resolve:e,reject:n,timer:a}),t.postMessage(c,`*`)})}return Object.freeze({get(e){return o(Ue.GET,e)},set(e,t){return o(Ue.SET,e,t)},dispose(){t.removeEventListener(`message`,a);for(let e of i.values())clearTimeout(e.timer),e.reject(Error(`Storage bridge disposed`));i.clear()}})}function rn(e){let{repository:t,preferenceStore:n,downloader:r}=e||{};if(!t||!n||!r)throw TypeError(`Repository, preference store, and downloader are required`);let i=e.cryptoApi,a=typeof e.now==`function`?e.now:()=>new Date;async function o(e){let r=Pt(e,{cryptoApi:i,now:a()});try{await t.persist(r)}catch(e){return Object.freeze({stored:!1,record:r,persistenceError:e,retentionError:null,exportError:null})}let o,c=null,l=null;try{o=await n.get(),await Jt({repository:t,preferences:o,now:a(),protectedExecutionId:r.id})}catch(e){c=e,o||=Wt}if(o.autoExport)try{s(r)}catch(e){l=e}return Object.freeze({stored:!0,record:r,persistenceError:null,retentionError:c,exportError:l})}function s(e){r.download({filename:$t(e),json:Yt(e)})}return Object.freeze({persistTerminal:o,get:e=>t.get(e),list:e=>t.list(e),delete:e=>t.delete(e),clear:()=>t.clear(),getPreferences:()=>n.get(),setPreferences:e=>n.set(e),exportRecord:async e=>{let n=await t.get(e);if(!n)throw Error(`Execution record was not found`);return s(n),n},exportFiltered:async(e={})=>{let n=await t.list(e);return r.download({filename:en(a()),json:Xt(n)}),n}})}var an=g`
:host {
    all: initial;
    --history-accent: #5267e8;
    --history-text: #172033;
    --history-muted: #697386;
    --history-border: #dfe4ee;
    --history-surface: #ffffff;
    color: var(--history-text);
    font-family: Inter, "Segoe UI", system-ui, sans-serif;
}

* { box-sizing: border-box; }
button, input, select { font: inherit; }
button { cursor: pointer; }

.overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483646;
    display: grid;
    place-items: center;
    padding: 24px;
    background: rgba(17, 24, 39, 0.62);
    backdrop-filter: blur(5px);
}

.dialog {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    width: min(1180px, 96vw);
    height: min(820px, 94vh);
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.5);
    border-radius: 22px;
    background: #f6f8fc;
    box-shadow: 0 28px 80px rgba(0,0,0,.28);
}

.dialog-header, .dialog-footer {
    padding: 20px 24px;
    background: var(--history-surface);
}
.dialog-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    border-bottom: 1px solid var(--history-border);
}
.eyebrow { margin: 0 0 4px; color: var(--history-accent); font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
h2, h3, h4, p { margin: 0; }
h2 { font-size: 24px; letter-spacing: -.025em; }
.header-copy { margin-top: 5px; color: var(--history-muted); font-size: 13px; }
.icon-button { width: 38px; height: 38px; border: 0; border-radius: 12px; color: var(--history-muted); background: #f2f4f8; font-size: 25px; line-height: 1; }
.icon-button:hover { color: var(--history-text); background: #e9edf5; }

.workspace { display: grid; grid-template-columns: minmax(340px, 40%) minmax(0, 1fr); min-height: 0; }
.browser-panel { display: flex; min-height: 0; flex-direction: column; padding: 18px; border-right: 1px solid var(--history-border); }
.filters { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 14px; border: 1px solid var(--history-border); border-radius: 15px; background: var(--history-surface); }
.filters label, .settings-grid label { display: grid; gap: 5px; color: var(--history-muted); font-size: 11px; font-weight: 700; }
.filters input, .filters select, .settings-grid input { width: 100%; min-width: 0; padding: 9px 10px; border: 1px solid #d7ddea; border-radius: 9px; color: var(--history-text); background: #fff; }
.date-fields { display: grid; grid-column: 1 / -1; grid-template-columns: 1fr 1fr; gap: 10px; }
.filter-actions { display: flex; grid-column: 1 / -1; gap: 8px; }
button { padding: 9px 13px; border: 1px solid var(--history-accent); border-radius: 9px; color: #fff; background: var(--history-accent); font-weight: 700; }
button:hover { filter: brightness(.97); }
button:focus-visible, input:focus-visible, select:focus-visible, summary:focus-visible { outline: 3px solid rgba(82, 103, 232, .25); outline-offset: 2px; }
button.secondary { border-color: #d7ddea; color: #344054; background: #fff; }
button.danger { border-color: #efcaca; color: #a33c3c; }
button.compact { padding: 7px 9px; font-size: 11px; }
.list-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 15px 2px 9px; }
.list-toolbar strong { font-size: 12px; }
.state-card { padding: 22px; border: 1px dashed #cfd6e4; border-radius: 14px; color: var(--history-muted); text-align: center; }
.state-card.is-error, .toast.is-error { color: #9b3030; background: #fff0f0; }
.record-list { min-height: 0; overflow: auto; padding-right: 4px; }
.record-card { display: grid; width: 100%; gap: 5px; margin-bottom: 8px; padding: 13px; border: 1px solid var(--history-border); border-radius: 13px; color: var(--history-text); background: var(--history-surface); text-align: left; }
.record-card:hover, .record-card[aria-pressed="true"] { border-color: #aeb9ee; box-shadow: 0 6px 20px rgba(42, 59, 130, .08); }
.record-heading { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.record-heading strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.status-chip { display: inline-flex; flex: none; padding: 3px 7px; border-radius: 999px; color: #475467; background: #eef1f6; font-size: 10px; font-weight: 800; }
.record-card[data-status="completed"] .status-chip { color: #196b4a; background: #ddf5e9; }
.record-card[data-status="completed_with_failures"] .status-chip { color: #8b5b13; background: #fff0cf; }
.record-card[data-status="interrupted"] .status-chip, .record-card[data-status="cancelled"] .status-chip { color: #943c3c; background: #fde7e7; }
.record-context, .record-outcome, time { color: var(--history-muted); font-size: 11px; }
time { margin-top: 2px; }

.detail-panel { min-width: 0; overflow: auto; padding: 24px; background: #fff; }
.detail-placeholder { display: grid; height: 100%; place-content: center; justify-items: center; color: var(--history-muted); text-align: center; }
.detail-placeholder span { display: grid; width: 52px; height: 52px; place-items: center; margin-bottom: 12px; border-radius: 16px; color: var(--history-accent); background: #eef0ff; font-size: 24px; }
.detail-placeholder h3 { color: var(--history-text); }
.detail-placeholder p { margin-top: 5px; font-size: 12px; }
.detail-header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
.detail-header h3 { font-size: 20px; }
.detail-header p { margin-top: 4px; color: var(--history-muted); font-size: 12px; }
.detail-actions { display: flex; gap: 7px; }
.summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
.summary-grid div { min-width: 0; padding: 12px; border: 1px solid var(--history-border); border-radius: 12px; background: #f9fafc; }
.summary-grid dt { color: var(--history-muted); font-size: 10px; font-weight: 800; text-transform: uppercase; }
.summary-grid dd { overflow-wrap: anywhere; margin: 5px 0 0; font-size: 12px; }
.counts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.counts div { display: grid; gap: 2px; padding: 11px; border-radius: 11px; background: #f1f3f8; }
.counts strong { font-size: 18px; }
.counts span { color: var(--history-muted); font-size: 10px; text-transform: capitalize; }
.outcomes { margin-top: 22px; }
.outcomes h4 { margin-bottom: 10px; }
.outcome-card { margin-bottom: 8px; padding: 12px; border: 1px solid var(--history-border); border-radius: 12px; }
.outcome-card > div { display: flex; justify-content: space-between; gap: 10px; }
.outcome-card p { margin-top: 5px; color: #475467; font-size: 12px; line-height: 1.45; }
.outcome-card small { display: block; margin-top: 6px; color: var(--history-muted); }
.outcome-card details { margin-top: 9px; color: var(--history-muted); font-size: 11px; }
.outcome-card pre { overflow: auto; margin: 7px 0 0; padding: 10px; border-radius: 9px; color: #344054; background: #f5f7fa; font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace; white-space: pre-wrap; }
.muted { color: var(--history-muted); font-size: 12px; }

.dialog-footer { border-top: 1px solid var(--history-border); }
.retention-settings summary { cursor: pointer; color: #475467; font-size: 12px; font-weight: 800; }
.settings-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr 1.5fr auto; gap: 10px; align-items: end; margin-top: 12px; }
.settings-grid label.checkbox { display: flex; align-items: center; gap: 7px; padding-bottom: 9px; }
.settings-grid label.checkbox input { width: auto; }
.footer-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
.toast { margin-top: 10px; padding: 8px 10px; border-radius: 9px; color: #196b4a; background: #e7f6ee; font-size: 11px; }

@media (max-width: 840px) {
    .overlay { padding: 0; }
    .dialog { width: 100vw; height: 100vh; border-radius: 0; }
    .workspace { grid-template-columns: 1fr; overflow: auto; }
    .browser-panel { min-height: 450px; border-right: 0; border-bottom: 1px solid var(--history-border); }
    .detail-panel { min-height: 500px; }
    .settings-grid { grid-template-columns: 1fr 1fr; }
}

@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
}

`,on=`edvibe-toolbox-execution-history-dialog`,sn=Object.freeze({completed:`Completed`,completed_with_failures:`Completed with failures`,cancelled:`Cancelled`,interrupted:`Interrupted`});function cn(e){return sn[e]||String(e||`Unknown`)}function ln(e,t){let n=new Date(e);return Number.isNaN(n.getTime())?String(e||``):new Intl.DateTimeFormat(t||void 0,{dateStyle:`medium`,timeStyle:`short`}).format(n)}function un(e){return Object.freeze({title:e.operationType,subtitle:e.pageContext?.marathonName||(e.pageContext?.marathonId?`Marathon #${e.pageContext.marathonId}`:`No marathon context`),outcome:`${e.counts.successful} successful · ${e.counts.failed} failed · ${e.counts.skipped} skipped`})}var dn=class extends G{static styles=[Ae,je,an];static properties={options:{state:!0},records:{state:!0},selectedRecord:{state:!0},operationTypes:{state:!0},filterOperationType:{state:!0},filterStatus:{state:!0},filterMarathonId:{state:!0},filterFrom:{state:!0},filterTo:{state:!0},listState:{state:!0},listMessage:{state:!0},preferences:{state:!0},toastMessage:{state:!0},toastError:{state:!0}};constructor(){super(),this.options=null,this.records=[],this.selectedRecord=null,this.operationTypes=[],this.filterOperationType=``,this.filterStatus=``,this.filterMarathonId=``,this.filterFrom=``,this.filterTo=``,this.listState=`loading`,this.listMessage=`Loading history…`,this.preferences={mode:`limits`,maxCount:``,maxAgeDays:``,autoExport:!1},this.toastMessage=``,this.toastError=!1,this.initializationPromise=null,this.handleKeydownBound=e=>{e.key===`Escape`&&this.options?.onClose?.()}}configure(e={}){return this.options=e&&typeof e==`object`?e:{},this.isConnected&&this.initialize(),this}connectedCallback(){super.connectedCallback(),this.addEventListener(`keydown`,this.handleKeydownBound),this.initialize()}disconnectedCallback(){this.removeEventListener(`keydown`,this.handleKeydownBound),super.disconnectedCallback()}initialize(){return this.options?(this.initializationPromise||=(async()=>{await this.updateComplete,this.shadowRoot?.querySelector(`[data-action="close"]`)?.focus(),await this.loadPreferences(),await this.loadRecords(),this.options.initialExecutionId&&await this.openRecord(this.options.initialExecutionId)})(),this.initializationPromise):Promise.resolve()}get filters(){let e={operationType:this.filterOperationType,status:this.filterStatus,marathonId:this.filterMarathonId,from:this.filterFrom,to:this.filterTo};return Object.fromEntries(Object.entries(e).filter(([,e])=>e!==``))}setFilter(e,t){let n=String(t||``);e===`operationType`&&(this.filterOperationType=n),e===`status`&&(this.filterStatus=n),e===`marathonId`&&(this.filterMarathonId=n),e===`from`&&(this.filterFrom=n),e===`to`&&(this.filterTo=n)}async loadRecords(){this.listState=`loading`,this.listMessage=`Loading history…`;try{this.records=await this.options.service.list(this.filters),this.operationTypes=[...new Set([...this.operationTypes,...this.records.map(e=>e.operationType)])].sort(),this.listState=this.records.length===0?`empty`:`ready`,this.listMessage=this.records.length===0?`No executions match these filters.`:``}catch(e){this.records=[],this.listState=`error`,this.listMessage=e.message||`Could not load execution history.`}}renderEmptyDetail(){this.selectedRecord=null}async openRecord(e){try{let t=await this.options.service.get(e);if(!t)throw Error(`Execution record was not found.`);this.selectedRecord=t}catch(e){this.showToast(e.message||`Could not open the execution.`,!0)}}async loadPreferences(){try{let e=await this.options.service.getPreferences();this.preferences={mode:e.mode,maxCount:e.maxCount,maxAgeDays:e.maxAgeDays,autoExport:!!e.autoExport}}catch(e){this.showToast(e.message||`Could not load retention settings.`,!0)}}updatePreference(e,t){this.preferences={...this.preferences,[e]:t}}async savePreferences(){let e={mode:this.preferences.mode,maxCount:Number(this.preferences.maxCount),maxAgeDays:Number(this.preferences.maxAgeDays),autoExport:!!this.preferences.autoExport};try{await this.options.service.setPreferences(e),this.showToast(`Retention settings saved.`)}catch(e){this.showToast(e.message||`Could not save retention settings.`,!0)}}async resetFilters(){this.filterOperationType=``,this.filterStatus=``,this.filterMarathonId=``,this.filterFrom=``,this.filterTo=``,await this.loadRecords()}confirm(e){return this.ownerDocument.defaultView.confirm(e)}async runAction(e,t,n){try{await e(),this.showToast(t)}catch(e){this.showToast(e.message||n,!0)}}async runMutation(e,t,n){try{await e(),this.renderEmptyDetail(),await this.loadRecords(),this.showToast(t)}catch(e){this.showToast(e.message||n,!0)}}async handleAction(e){e===`close`&&this.options.onClose?.(),e===`reset-filters`&&await this.resetFilters(),e===`export-filtered`&&await this.runAction(()=>this.options.service.exportFiltered(this.filters),`Filtered history exported.`,`Could not export history.`),e===`download-one`&&this.selectedRecord&&await this.runAction(()=>this.options.service.exportRecord(this.selectedRecord.id),`Execution exported.`,`Could not export execution.`),e===`delete-one`&&this.selectedRecord&&this.confirm(`Delete execution ${this.selectedRecord.id}?`)&&await this.runMutation(()=>this.options.service.delete(this.selectedRecord.id),`Execution deleted.`,`Could not delete the execution.`),e===`clear-all`&&this.confirm(`Clear all execution history? This cannot be undone.`)&&await this.runMutation(()=>this.options.service.clear(),`Execution history cleared.`,`Could not clear execution history.`),e===`save-preferences`&&await this.savePreferences()}showToast(e,t=!1){this.toastMessage=String(e||``),this.toastError=!!t}renderRecord(e){let t=un(e);return U`
            <button type="button" class="record-card" data-execution-id=${e.id}
                data-status=${e.status}
                aria-pressed=${String(this.selectedRecord?.id===e.id)}
                @click=${()=>this.openRecord(e.id)}>
                <span class="record-heading">
                    <strong>${t.title}</strong>
                    <span class="status-chip">${cn(e.status)}</span>
                </span>
                <span class="record-context">${t.subtitle}</span>
                <span class="record-outcome">${t.outcome}</span>
                <time>${ln(e.completedAt)}</time>
            </button>
        `}renderOutcome(e){let t=e.data&&Object.keys(e.data).length>0;return U`
            <article class="outcome-card" data-status=${e.status}>
                <div><strong>${e.label}</strong><span class="status-chip">${e.status}</span></div>
                <p>${e.message}</p>
                <small>${e.code} · ${e.attempts} attempt${e.attempts===1?``:`s`}</small>
                ${t?U`
                    <details><summary>Item details</summary><pre>${JSON.stringify(e.data,null,2)}</pre></details>
                `:``}
            </article>
        `}renderDetail(){let e=this.selectedRecord;if(!e)return U`
                <div class="detail-placeholder">
                    <span aria-hidden="true">↗</span>
                    <h3>Select an execution</h3>
                    <p>Its summary and ordered item outcomes will appear here.</p>
                </div>
            `;let t=[[`Execution ID`,e.id],[`Marathon`,e.pageContext?.marathonName||e.pageContext?.marathonId||`Not recorded`],[`Started`,ln(e.startedAt)],[`Completed`,ln(e.completedAt)]];return U`
            <section class="detail-header">
                <div>
                    <h3>${e.operationType}</h3>
                    <p>${cn(e.status)} · ${ln(e.completedAt)}</p>
                </div>
                <div class="detail-actions">
                    <button type="button" class="secondary" @click=${()=>this.handleAction(`download-one`)}>Download JSON</button>
                    <button type="button" class="danger secondary" @click=${()=>this.handleAction(`delete-one`)}>Delete</button>
                </div>
            </section>
            <dl class="summary-grid">
                ${t.map(([e,t])=>U`<div><dt>${e}</dt><dd>${t}</dd></div>`)}
            </dl>
            <section class="counts">
                ${Object.entries(e.counts).map(([e,t])=>U`
                    <div><strong>${t}</strong><span>${e.replace(/[A-Z]/g,e=>` ${e.toLowerCase()}`)}</span></div>
                `)}
            </section>
            <section class="outcomes">
                <h4>Item outcomes (${e.results.length})</h4>
                ${e.results.length===0?U`<p class="muted">No per-item outcomes were recorded.</p>`:e.results.map(e=>this.renderOutcome(e))}
            </section>
        `}render(){let e=this.listState===`ready`,t=!e,n=`state-card${this.listState===`error`?` is-error`:``}`,r=this.preferences.mode===`indefinite`,i=`toast${this.toastError?` is-error`:``}`;return U`
<div class="overlay">
                <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="history-title">
                    <header class="dialog-header">
                        <div><p class="eyebrow">Edvibe Toolbox</p><h2 id="history-title">Execution history</h2><p class="header-copy">Browse terminal operation reports stored in this browser.</p></div>
                        <button class="icon-button" type="button" data-action="close" aria-label="Close" @click=${()=>this.handleAction(`close`)}>×</button>
                    </header>
                    <div class="workspace">
                        <aside class="browser-panel">
                            <form class="filters" data-role="filters" @submit=${e=>{e.preventDefault(),this.loadRecords()}}>
                                <label>Operation<select name="operationType" .value=${this.filterOperationType} @change=${e=>this.setFilter(`operationType`,e.currentTarget.value)}>
                                    <option value="">All operations</option>
                                    ${this.operationTypes.map(e=>U`<option value=${e}>${e}</option>`)}
                                </select></label>
                                <label>Status<select name="status" .value=${this.filterStatus} @change=${e=>this.setFilter(`status`,e.currentTarget.value)}>
                                    <option value="">All statuses</option><option value="completed">Completed</option><option value="completed_with_failures">Completed with failures</option><option value="cancelled">Cancelled</option><option value="interrupted">Interrupted</option>
                                </select></label>
                                <label>Marathon<input name="marathonId" type="search" inputmode="numeric" placeholder="Any marathon" .value=${this.filterMarathonId} @input=${e=>this.setFilter(`marathonId`,e.currentTarget.value)}></label>
                                <div class="date-fields">
                                    <label>From<input name="from" type="date" .value=${this.filterFrom} @input=${e=>this.setFilter(`from`,e.currentTarget.value)}></label>
                                    <label>To<input name="to" type="date" .value=${this.filterTo} @input=${e=>this.setFilter(`to`,e.currentTarget.value)}></label>
                                </div>
                                <div class="filter-actions"><button type="submit">Apply</button><button type="button" class="secondary" @click=${()=>this.handleAction(`reset-filters`)}>Reset</button></div>
                            </form>
                            <div class="list-toolbar"><strong data-role="record-count">${this.records.length} execution${this.records.length===1?``:`s`}</strong><button type="button" class="secondary compact" @click=${()=>this.handleAction(`export-filtered`)}>Export filtered</button></div>
                            <div class=${n} data-role="state" ?hidden=${!t}>${this.listMessage}</div>
                            <div class="record-list" data-role="record-list" ?hidden=${!e}>${this.records.map(e=>this.renderRecord(e))}</div>
                        </aside>
                        <main class="detail-panel" data-role="detail">${this.renderDetail()}</main>
                    </div>
                    <footer class="dialog-footer">
                        <details class="retention-settings"><summary>Retention & automatic export</summary><div class="settings-grid">
                            <label class="checkbox"><input type="checkbox" name="keepIndefinitely" .checked=${r} @change=${e=>this.updatePreference(`mode`,e.currentTarget.checked?`indefinite`:`limits`)}>Keep indefinitely</label>
                            <label>Newest executions<input type="number" name="maxCount" min="1" step="1" .value=${String(this.preferences.maxCount)} ?disabled=${r} @input=${e=>this.updatePreference(`maxCount`,e.currentTarget.value)}></label>
                            <label>Maximum age, days<input type="number" name="maxAgeDays" min="1" step="1" .value=${String(this.preferences.maxAgeDays)} ?disabled=${r} @input=${e=>this.updatePreference(`maxAgeDays`,e.currentTarget.value)}></label>
                            <label class="checkbox"><input type="checkbox" name="autoExport" .checked=${this.preferences.autoExport} @change=${e=>this.updatePreference(`autoExport`,e.currentTarget.checked)}>Download JSON after persistence</label>
                            <button type="button" @click=${()=>this.handleAction(`save-preferences`)}>Save settings</button>
                        </div></details>
                        <div class="footer-actions"><button type="button" class="danger secondary" @click=${()=>this.handleAction(`clear-all`)}>Clear all history</button><button type="button" @click=${()=>this.handleAction(`close`)}>Close</button></div>
                        <p class=${i} data-role="toast" role="status" ?hidden=${!this.toastMessage}>${this.toastMessage}</p>
                    </footer>
                </section>
            </div>
        `}};customElements.get(`edvibe-toolbox-execution-history-dialog`)||customElements.define(on,dn);var fn=Object.freeze({EXECUTION_HISTORY_DIALOG_TAG:on,ExecutionHistoryDialog:dn,formatExecutionStatus:cn,formatExecutionDate:ln,createSummary:un});globalThis.EdVibeExecutionHistoryDialog=fn;var pn=`edvibe-toolbox-execution-history`;function mn({service:e,canStart:t,onActiveChange:n,createDialog:r,log:i=()=>{}}){let a=!1;function o({executionId:o=null}={}){if(!(a||document.getElementById(`edvibe-toolbox-execution-history`))){if(!t()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}a=!0,n(!0);try{let t=r();t.id=pn,t.configure({service:e,initialExecutionId:o,onClose(){t.remove(),a=!1,n(!1)}}),(document.body||document.documentElement).append(t)}catch(e){a=!1,n(!1),i(`Failed to open execution history:`,e),window.alert(e.message||`Could not open execution history.`)}}}return Object.freeze({open:o})}var hn=l(o(((e,t)=>{(function(n){typeof e==`object`&&t!==void 0?t.exports=n():typeof define==`function`&&define.amd?define([],n):(typeof window<`u`?window:typeof global<`u`?global:typeof self<`u`?self:this).JSZip=n()})(function(){return function e(t,n,r){function i(o,s){if(!n[o]){if(!t[o]){var c=typeof require==`function`&&require;if(!s&&c)return c(o,!0);if(a)return a(o,!0);var l=Error(`Cannot find module '`+o+`'`);throw l.code=`MODULE_NOT_FOUND`,l}var u=n[o]={exports:{}};t[o][0].call(u.exports,function(e){var n=t[o][1][e];return i(n||e)},u,u.exports,e,t,n,r)}return n[o].exports}for(var a=typeof require==`function`&&require,o=0;o<r.length;o++)i(r[o]);return i}({1:[function(e,t,n){"use strict";var r=e(`./utils`),i=e(`./support`),a=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=`;n.encode=function(e){for(var t,n,i,o,s,c,l,u=[],d=0,f=e.length,p=f,m=r.getTypeOf(e)!==`string`;d<e.length;)p=f-d,i=m?(t=e[d++],n=d<f?e[d++]:0,d<f?e[d++]:0):(t=e.charCodeAt(d++),n=d<f?e.charCodeAt(d++):0,d<f?e.charCodeAt(d++):0),o=t>>2,s=(3&t)<<4|n>>4,c=1<p?(15&n)<<2|i>>6:64,l=2<p?63&i:64,u.push(a.charAt(o)+a.charAt(s)+a.charAt(c)+a.charAt(l));return u.join(``)},n.decode=function(e){var t,n,r,o,s,c,l=0,u=0,d=`data:`;if(e.substr(0,d.length)===d)throw Error(`Invalid base64 input, it looks like a data url.`);var f,p=3*(e=e.replace(/[^A-Za-z0-9+/=]/g,``)).length/4;if(e.charAt(e.length-1)===a.charAt(64)&&p--,e.charAt(e.length-2)===a.charAt(64)&&p--,p%1!=0)throw Error(`Invalid base64 input, bad content length.`);for(f=i.uint8array?new Uint8Array(0|p):Array(0|p);l<e.length;)t=a.indexOf(e.charAt(l++))<<2|(o=a.indexOf(e.charAt(l++)))>>4,n=(15&o)<<4|(s=a.indexOf(e.charAt(l++)))>>2,r=(3&s)<<6|(c=a.indexOf(e.charAt(l++))),f[u++]=t,s!==64&&(f[u++]=n),c!==64&&(f[u++]=r);return f}},{"./support":30,"./utils":32}],2:[function(e,t,n){"use strict";var r=e(`./external`),i=e(`./stream/DataWorker`),a=e(`./stream/Crc32Probe`),o=e(`./stream/DataLengthProbe`);function s(e,t,n,r,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=n,this.compression=r,this.compressedContent=i}s.prototype={getContentWorker:function(){var e=new i(r.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new o(`data_length`)),t=this;return e.on(`end`,function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw Error(`Bug : uncompressed data size mismatch`)}),e},getCompressedWorker:function(){return new i(r.Promise.resolve(this.compressedContent)).withStreamInfo(`compressedSize`,this.compressedSize).withStreamInfo(`uncompressedSize`,this.uncompressedSize).withStreamInfo(`crc32`,this.crc32).withStreamInfo(`compression`,this.compression)}},s.createWorkerFrom=function(e,t,n){return e.pipe(new a).pipe(new o(`uncompressedSize`)).pipe(t.compressWorker(n)).pipe(new o(`compressedSize`)).withStreamInfo(`compression`,t)},t.exports=s},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,n){"use strict";var r=e(`./stream/GenericWorker`);n.STORE={magic:`\0\0`,compressWorker:function(){return new r(`STORE compression`)},uncompressWorker:function(){return new r(`STORE decompression`)}},n.DEFLATE=e(`./flate`)},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,n){"use strict";var r=e(`./utils`),i=function(){for(var e,t=[],n=0;n<256;n++){e=n;for(var r=0;r<8;r++)e=1&e?3988292384^e>>>1:e>>>1;t[n]=e}return t}();t.exports=function(e,t){return e!==void 0&&e.length?r.getTypeOf(e)===`string`?function(e,t,n,r){var a=i,o=r+n;e^=-1;for(var s=r;s<o;s++)e=e>>>8^a[255&(e^t.charCodeAt(s))];return-1^e}(0|t,e,e.length,0):function(e,t,n,r){var a=i,o=r+n;e^=-1;for(var s=r;s<o;s++)e=e>>>8^a[255&(e^t[s])];return-1^e}(0|t,e,e.length,0):0}},{"./utils":32}],5:[function(e,t,n){"use strict";n.base64=!1,n.binary=!1,n.dir=!1,n.createFolders=!0,n.date=null,n.compression=null,n.compressionOptions=null,n.comment=null,n.unixPermissions=null,n.dosPermissions=null},{}],6:[function(e,t,n){"use strict";var r=null;r=typeof Promise<`u`?Promise:e(`lie`),t.exports={Promise:r}},{lie:37}],7:[function(e,t,n){"use strict";var r=typeof Uint8Array<`u`&&typeof Uint16Array<`u`&&typeof Uint32Array<`u`,i=e(`pako`),a=e(`./utils`),o=e(`./stream/GenericWorker`),s=r?`uint8array`:`array`;function c(e,t){o.call(this,`FlateWorker/`+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={}}n.magic=`\b\0`,a.inherits(c,o),c.prototype.processChunk=function(e){this.meta=e.meta,this._pako===null&&this._createPako(),this._pako.push(a.transformTo(s,e.data),!1)},c.prototype.flush=function(){o.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},c.prototype.cleanUp=function(){o.prototype.cleanUp.call(this),this._pako=null},c.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var e=this;this._pako.onData=function(t){e.push({data:t,meta:e.meta})}},n.compressWorker=function(e){return new c(`Deflate`,e)},n.uncompressWorker=function(){return new c(`Inflate`,{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,n){"use strict";function r(e,t){var n,r=``;for(n=0;n<t;n++)r+=String.fromCharCode(255&e),e>>>=8;return r}function i(e,t,n,i,o,u){var d,f,p=e.file,m=e.compression,h=u!==s.utf8encode,g=a.transformTo(`string`,u(p.name)),_=a.transformTo(`string`,s.utf8encode(p.name)),v=p.comment,y=a.transformTo(`string`,u(v)),b=a.transformTo(`string`,s.utf8encode(v)),x=_.length!==p.name.length,S=b.length!==v.length,C=``,w=``,T=``,E=p.dir,D=p.date,O={crc32:0,compressedSize:0,uncompressedSize:0};t&&!n||(O.crc32=e.crc32,O.compressedSize=e.compressedSize,O.uncompressedSize=e.uncompressedSize);var k=0;t&&(k|=8),h||!x&&!S||(k|=2048);var A=0,j=0;E&&(A|=16),o===`UNIX`?(j=798,A|=function(e,t){var n=e;return e||(n=t?16893:33204),(65535&n)<<16}(p.unixPermissions,E)):(j=20,A|=function(e){return 63&(e||0)}(p.dosPermissions)),d=D.getUTCHours(),d<<=6,d|=D.getUTCMinutes(),d<<=5,d|=D.getUTCSeconds()/2,f=D.getUTCFullYear()-1980,f<<=4,f|=D.getUTCMonth()+1,f<<=5,f|=D.getUTCDate(),x&&(w=r(1,1)+r(c(g),4)+_,C+=`up`+r(w.length,2)+w),S&&(T=r(1,1)+r(c(y),4)+b,C+=`uc`+r(T.length,2)+T);var M=``;return M+=`
\0`,M+=r(k,2),M+=m.magic,M+=r(d,2),M+=r(f,2),M+=r(O.crc32,4),M+=r(O.compressedSize,4),M+=r(O.uncompressedSize,4),M+=r(g.length,2),M+=r(C.length,2),{fileRecord:l.LOCAL_FILE_HEADER+M+g+C,dirRecord:l.CENTRAL_FILE_HEADER+r(j,2)+M+r(y.length,2)+`\0\0\0\0`+r(A,4)+r(i,4)+g+C+y}}var a=e(`../utils`),o=e(`../stream/GenericWorker`),s=e(`../utf8`),c=e(`../crc32`),l=e(`../signature`);function u(e,t,n,r){o.call(this,`ZipFileWorker`),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=n,this.encodeFileName=r,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}a.inherits(u,o),u.prototype.push=function(e){var t=e.meta.percent||0,n=this.entriesCount,r=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,o.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:n?(t+100*(n-r-1))/n:100}}))},u.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var n=i(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:n.fileRecord,meta:{percent:0}})}else this.accumulate=!0},u.prototype.closedSource=function(e){this.accumulate=!1;var t=this.streamFiles&&!e.file.dir,n=i(e,t,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(n.dirRecord),t)this.push({data:function(e){return l.DATA_DESCRIPTOR+r(e.crc32,4)+r(e.compressedSize,4)+r(e.uncompressedSize,4)}(e),meta:{percent:100}});else for(this.push({data:n.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},u.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var n=this.bytesWritten-e,i=function(e,t,n,i,o){var s=a.transformTo(`string`,o(i));return l.CENTRAL_DIRECTORY_END+`\0\0\0\0`+r(e,2)+r(e,2)+r(t,4)+r(n,4)+r(s.length,2)+s}(this.dirRecords.length,n,e,this.zipComment,this.encodeFileName);this.push({data:i,meta:{percent:100}})},u.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},u.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on(`data`,function(e){t.processChunk(e)}),e.on(`end`,function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end()}),e.on(`error`,function(e){t.error(e)}),this},u.prototype.resume=function(){return!!o.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},u.prototype.error=function(e){var t=this._sources;if(!o.prototype.error.call(this,e))return!1;for(var n=0;n<t.length;n++)try{t[n].error(e)}catch{}return!0},u.prototype.lock=function(){o.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock()},t.exports=u},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,n){"use strict";var r=e(`../compressions`),i=e(`./ZipFileWorker`);n.generateWorker=function(e,t,n){var a=new i(t.streamFiles,n,t.platform,t.encodeFileName),o=0;try{e.forEach(function(e,n){o++;var i=function(e,t){var n=e||t,i=r[n];if(!i)throw Error(n+` is not a valid compression method !`);return i}(n.options.compression,t.compression),s=n.options.compressionOptions||t.compressionOptions||{},c=n.dir,l=n.date;n._compressWorker(i,s).withStreamInfo(`file`,{name:e,dir:c,date:l,comment:n.comment||``,unixPermissions:n.unixPermissions,dosPermissions:n.dosPermissions}).pipe(a)}),a.entriesCount=o}catch(e){a.error(e)}return a}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,n){"use strict";function r(){if(!(this instanceof r))return new r;if(arguments.length)throw Error(`The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.`);this.files=Object.create(null),this.comment=null,this.root=``,this.clone=function(){var e=new r;for(var t in this)typeof this[t]!=`function`&&(e[t]=this[t]);return e}}(r.prototype=e(`./object`)).loadAsync=e(`./load`),r.support=e(`./support`),r.defaults=e(`./defaults`),r.version=`3.10.1`,r.loadAsync=function(e,t){return new r().loadAsync(e,t)},r.external=e(`./external`),t.exports=r},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,n){"use strict";var r=e(`./utils`),i=e(`./external`),a=e(`./utf8`),o=e(`./zipEntries`),s=e(`./stream/Crc32Probe`),c=e(`./nodejsUtils`);function l(e){return new i.Promise(function(t,n){var r=e.decompressed.getContentWorker().pipe(new s);r.on(`error`,function(e){n(e)}).on(`end`,function(){r.streamInfo.crc32===e.decompressed.crc32?t():n(Error(`Corrupted zip : CRC32 mismatch`))}).resume()})}t.exports=function(e,t){var n=this;return t=r.extend(t||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:a.utf8decode}),c.isNode&&c.isStream(e)?i.Promise.reject(Error(`JSZip can't accept a stream when loading a zip file.`)):r.prepareContent(`the loaded zip file`,e,!0,t.optimizedBinaryString,t.base64).then(function(e){var n=new o(t);return n.load(e),n}).then(function(e){var n=[i.Promise.resolve(e)],r=e.files;if(t.checkCRC32)for(var a=0;a<r.length;a++)n.push(l(r[a]));return i.Promise.all(n)}).then(function(e){for(var i=e.shift(),a=i.files,o=0;o<a.length;o++){var s=a[o],c=s.fileNameStr,l=r.resolve(s.fileNameStr);n.file(l,s.decompressed,{binary:!0,optimizedBinaryString:!0,date:s.date,dir:s.dir,comment:s.fileCommentStr.length?s.fileCommentStr:null,unixPermissions:s.unixPermissions,dosPermissions:s.dosPermissions,createFolders:t.createFolders}),s.dir||(n.file(l).unsafeOriginalName=c)}return i.zipComment.length&&(n.comment=i.zipComment),n})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,n){"use strict";var r=e(`../utils`),i=e(`../stream/GenericWorker`);function a(e,t){i.call(this,`Nodejs stream input adapter for `+e),this._upstreamEnded=!1,this._bindStream(t)}r.inherits(a,i),a.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on(`data`,function(e){t.push({data:e,meta:{percent:0}})}).on(`error`,function(e){t.isPaused?this.generatedError=e:t.error(e)}).on(`end`,function(){t.isPaused?t._upstreamEnded=!0:t.end()})},a.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},a.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=a},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,n){"use strict";var r=e(`readable-stream`).Readable;function i(e,t,n){r.call(this,t),this._helper=e;var i=this;e.on(`data`,function(e,t){i.push(e)||i._helper.pause(),n&&n(t)}).on(`error`,function(e){i.emit(`error`,e)}).on(`end`,function(){i.push(null)})}e(`../utils`).inherits(i,r),i.prototype._read=function(){this._helper.resume()},t.exports=i},{"../utils":32,"readable-stream":16}],14:[function(e,t,n){"use strict";t.exports={isNode:typeof Buffer<`u`,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if(typeof e==`number`)throw Error(`The "data" argument must not be a number`);return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&typeof e.on==`function`&&typeof e.pause==`function`&&typeof e.resume==`function`}}},{}],15:[function(e,t,n){"use strict";function r(e,t,n){var r,i=a.getTypeOf(t),s=a.extend(n||{},c);s.date=s.date||new Date,s.compression!==null&&(s.compression=s.compression.toUpperCase()),typeof s.unixPermissions==`string`&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=h(e)),s.createFolders&&(r=m(e))&&g.call(this,r,!0);var d=i===`string`&&!1===s.binary&&!1===s.base64;n&&n.binary!==void 0||(s.binary=!d),(t instanceof l&&t.uncompressedSize===0||s.dir||!t||t.length===0)&&(s.base64=!1,s.binary=!0,t=``,s.compression=`STORE`,i=`string`);var _=null;_=t instanceof l||t instanceof o?t:f.isNode&&f.isStream(t)?new p(e,t):a.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var v=new u(e,_,s);this.files[e]=v}var i=e(`./utf8`),a=e(`./utils`),o=e(`./stream/GenericWorker`),s=e(`./stream/StreamHelper`),c=e(`./defaults`),l=e(`./compressedObject`),u=e(`./zipObject`),d=e(`./generate`),f=e(`./nodejsUtils`),p=e(`./nodejs/NodejsStreamInputAdapter`),m=function(e){e.slice(-1)===`/`&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf(`/`);return 0<t?e.substring(0,t):``},h=function(e){return e.slice(-1)!==`/`&&(e+=`/`),e},g=function(e,t){return t=t===void 0?c.createFolders:t,e=h(e),this.files[e]||r.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function _(e){return Object.prototype.toString.call(e)===`[object RegExp]`}t.exports={load:function(){throw Error(`This method has been removed in JSZip 3.0, please check the upgrade guide.`)},forEach:function(e){var t,n,r;for(t in this.files)r=this.files[t],(n=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(n,r)},filter:function(e){var t=[];return this.forEach(function(n,r){e(n,r)&&t.push(r)}),t},file:function(e,t,n){if(arguments.length!==1)return e=this.root+e,r.call(this,e,t,n),this;if(_(e)){var i=e;return this.filter(function(e,t){return!t.dir&&i.test(e)})}var a=this.files[this.root+e];return a&&!a.dir?a:null},folder:function(e){if(!e)return this;if(_(e))return this.filter(function(t,n){return n.dir&&e.test(t)});var t=this.root+e,n=g.call(this,t),r=this.clone();return r.root=n.name,r},remove:function(e){e=this.root+e;var t=this.files[e];if(t||=(e.slice(-1)!==`/`&&(e+=`/`),this.files[e]),t&&!t.dir)delete this.files[e];else for(var n=this.filter(function(t,n){return n.name.slice(0,e.length)===e}),r=0;r<n.length;r++)delete this.files[n[r].name];return this},generate:function(){throw Error(`This method has been removed in JSZip 3.0, please check the upgrade guide.`)},generateInternalStream:function(e){var t,n={};try{if((n=a.extend(e||{},{streamFiles:!1,compression:`STORE`,compressionOptions:null,type:``,platform:`DOS`,comment:null,mimeType:`application/zip`,encodeFileName:i.utf8encode})).type=n.type.toLowerCase(),n.compression=n.compression.toUpperCase(),n.type===`binarystring`&&(n.type=`string`),!n.type)throw Error(`No output type specified.`);a.checkSupport(n.type),n.platform!==`darwin`&&n.platform!==`freebsd`&&n.platform!==`linux`&&n.platform!==`sunos`||(n.platform=`UNIX`),n.platform===`win32`&&(n.platform=`DOS`);var r=n.comment||this.comment||``;t=d.generateWorker(this,n,r)}catch(e){(t=new o(`error`)).error(e)}return new s(t,n.type||`string`,n.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return(e||={}).type||(e.type=`nodebuffer`),this.generateInternalStream(e).toNodejsStream(t)}}},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,n){"use strict";t.exports=e(`stream`)},{stream:void 0}],17:[function(e,t,n){"use strict";var r=e(`./DataReader`);function i(e){r.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t]}e(`../utils`).inherits(i,r),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),n=e.charCodeAt(1),r=e.charCodeAt(2),i=e.charCodeAt(3),a=this.length-4;0<=a;--a)if(this.data[a]===t&&this.data[a+1]===n&&this.data[a+2]===r&&this.data[a+3]===i)return a-this.zero;return-1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),n=e.charCodeAt(1),r=e.charCodeAt(2),i=e.charCodeAt(3),a=this.readData(4);return t===a[0]&&n===a[1]&&r===a[2]&&i===a[3]},i.prototype.readData=function(e){if(this.checkOffset(e),e===0)return[];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],18:[function(e,t,n){"use strict";var r=e(`../utils`);function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e)},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw Error(`End of data reached (data length = `+this.length+`, asked index = `+e+`). Corrupted zip ?`)},setIndex:function(e){this.checkIndex(e),this.index=e},skip:function(e){this.setIndex(this.index+e)},byteAt:function(){},readInt:function(e){var t,n=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)n=(n<<8)+this.byteAt(t);return this.index+=e,n},readString:function(e){return r.transformTo(`string`,this.readData(e))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i},{"../utils":32}],19:[function(e,t,n){"use strict";var r=e(`./Uint8ArrayReader`);function i(e){r.call(this,e)}e(`../utils`).inherits(i,r),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,n){"use strict";var r=e(`./DataReader`);function i(e){r.call(this,e)}e(`../utils`).inherits(i,r),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],21:[function(e,t,n){"use strict";var r=e(`./ArrayReader`);function i(e){r.call(this,e)}e(`../utils`).inherits(i,r),i.prototype.readData=function(e){if(this.checkOffset(e),e===0)return new Uint8Array;var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,n){"use strict";var r=e(`../utils`),i=e(`../support`),a=e(`./ArrayReader`),o=e(`./StringReader`),s=e(`./NodeBufferReader`),c=e(`./Uint8ArrayReader`);t.exports=function(e){var t=r.getTypeOf(e);return r.checkSupport(t),t!==`string`||i.uint8array?t===`nodebuffer`?new s(e):i.uint8array?new c(r.transformTo(`uint8array`,e)):new a(r.transformTo(`array`,e)):new o(e)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,n){"use strict";n.LOCAL_FILE_HEADER=`PK`,n.CENTRAL_FILE_HEADER=`PK`,n.CENTRAL_DIRECTORY_END=`PK`,n.ZIP64_CENTRAL_DIRECTORY_LOCATOR=`PK\x07`,n.ZIP64_CENTRAL_DIRECTORY_END=`PK`,n.DATA_DESCRIPTOR=`PK\x07\b`},{}],24:[function(e,t,n){"use strict";var r=e(`./GenericWorker`),i=e(`../utils`);function a(e){r.call(this,`ConvertWorker to `+e),this.destType=e}i.inherits(a,r),a.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta})},t.exports=a},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,n){"use strict";var r=e(`./GenericWorker`),i=e(`../crc32`);function a(){r.call(this,`Crc32Probe`),this.withStreamInfo(`crc32`,0)}e(`../utils`).inherits(a,r),a.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e)},t.exports=a},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,n){"use strict";var r=e(`../utils`),i=e(`./GenericWorker`);function a(e){i.call(this,`DataLengthProbe for `+e),this.propName=e,this.withStreamInfo(e,0)}r.inherits(a,i),a.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length}i.prototype.processChunk.call(this,e)},t.exports=a},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,n){"use strict";var r=e(`../utils`),i=e(`./GenericWorker`);function a(e){i.call(this,`DataWorker`);var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type=``,this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=r.getTypeOf(e),t.isPaused||t._tickAndRepeat()},function(e){t.error(e)})}r.inherits(a,i),a.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},a.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,r.delay(this._tickAndRepeat,[],this)),!0)},a.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(r.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},a.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case`string`:e=this.data.substring(this.index,t);break;case`uint8array`:e=this.data.subarray(this.index,t);break;case`array`:case`nodebuffer`:e=this.data.slice(this.index,t)}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=a},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,n){"use strict";function r(e){this.name=e||`default`,this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}r.prototype={push:function(e){this.emit(`data`,e)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit(`end`),this.cleanUp(),this.isFinished=!0}catch(e){this.emit(`error`,e)}return!0},error:function(e){return!this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit(`error`,e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(e,t){if(this._listeners[e])for(var n=0;n<this._listeners[e].length;n++)this._listeners[e][n].call(this,t)},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw Error(`The stream '`+this+`' has already been used.`);this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on(`data`,function(e){t.processChunk(e)}),e.on(`end`,function(){t.end()}),e.on(`error`,function(e){t.error(e)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e)},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,e)&&(this.streamInfo[e]=this.extraStreamInfo[e])},lock:function(){if(this.isLocked)throw Error(`The stream '`+this+`' has already been used.`);this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var e=`Worker `+this.name;return this.previous?this.previous+` -> `+e:e}},t.exports=r},{}],29:[function(e,t,n){"use strict";var r=e(`../utils`),i=e(`./ConvertWorker`),a=e(`./GenericWorker`),o=e(`../base64`),s=e(`../support`),c=e(`../external`),l=null;if(s.nodestream)try{l=e(`../nodejs/NodejsStreamOutputAdapter`)}catch{}function u(e,t){return new c.Promise(function(n,i){var a=[],s=e._internalType,c=e._outputType,l=e._mimeType;e.on(`data`,function(e,n){a.push(e),t&&t(n)}).on(`error`,function(e){a=[],i(e)}).on(`end`,function(){try{n(function(e,t,n){switch(e){case`blob`:return r.newBlob(r.transformTo(`arraybuffer`,t),n);case`base64`:return o.encode(t);default:return r.transformTo(e,t)}}(c,function(e,t){var n,r=0,i=null,a=0;for(n=0;n<t.length;n++)a+=t[n].length;switch(e){case`string`:return t.join(``);case`array`:return Array.prototype.concat.apply([],t);case`uint8array`:for(i=new Uint8Array(a),n=0;n<t.length;n++)i.set(t[n],r),r+=t[n].length;return i;case`nodebuffer`:return Buffer.concat(t);default:throw Error(`concat : unsupported type '`+e+`'`)}}(s,a),l))}catch(e){i(e)}a=[]}).resume()})}function d(e,t,n){var o=t;switch(t){case`blob`:case`arraybuffer`:o=`uint8array`;break;case`base64`:o=`string`}try{this._internalType=o,this._outputType=t,this._mimeType=n,r.checkSupport(o),this._worker=e.pipe(new i(o)),e.lock()}catch(e){this._worker=new a(`error`),this._worker.error(e)}}d.prototype={accumulate:function(e){return u(this,e)},on:function(e,t){var n=this;return e===`data`?this._worker.on(e,function(e){t.call(n,e.data,e.meta)}):this._worker.on(e,function(){r.delay(t,arguments,n)}),this},resume:function(){return r.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(r.checkSupport(`nodestream`),this._outputType!==`nodebuffer`)throw Error(this._outputType+` is not supported by this method`);return new l(this,{objectMode:this._outputType!==`nodebuffer`},e)}},t.exports=d},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,n){"use strict";if(n.base64=!0,n.array=!0,n.string=!0,n.arraybuffer=typeof ArrayBuffer<`u`&&typeof Uint8Array<`u`,n.nodebuffer=typeof Buffer<`u`,n.uint8array=typeof Uint8Array<`u`,typeof ArrayBuffer>`u`)n.blob=!1;else{var r=new ArrayBuffer(0);try{n.blob=new Blob([r],{type:`application/zip`}).size===0}catch{try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(r),n.blob=i.getBlob(`application/zip`).size===0}catch{n.blob=!1}}}try{n.nodestream=!!e(`readable-stream`).Readable}catch{n.nodestream=!1}},{"readable-stream":16}],31:[function(e,t,n){"use strict";for(var r=e(`./utils`),i=e(`./support`),a=e(`./nodejsUtils`),o=e(`./stream/GenericWorker`),s=Array(256),c=0;c<256;c++)s[c]=252<=c?6:248<=c?5:240<=c?4:224<=c?3:192<=c?2:1;s[254]=s[254]=1;function l(){o.call(this,`utf-8 decode`),this.leftOver=null}function u(){o.call(this,`utf-8 encode`)}n.utf8encode=function(e){return i.nodebuffer?a.newBufferFrom(e,`utf-8`):function(e){var t,n,r,a,o,s=e.length,c=0;for(a=0;a<s;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(r=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(r-56320),a++),c+=n<128?1:n<2048?2:n<65536?3:4;for(t=i.uint8array?new Uint8Array(c):Array(c),a=o=0;o<c;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(r=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(r-56320),a++),n<128?t[o++]=n:(n<2048?t[o++]=192|n>>>6:(n<65536?t[o++]=224|n>>>12:(t[o++]=240|n>>>18,t[o++]=128|n>>>12&63),t[o++]=128|n>>>6&63),t[o++]=128|63&n);return t}(e)},n.utf8decode=function(e){return i.nodebuffer?r.transformTo(`nodebuffer`,e).toString(`utf-8`):function(e){var t,n,i,a,o=e.length,c=Array(2*o);for(t=n=0;t<o;)if((i=e[t++])<128)c[n++]=i;else if(4<(a=s[i]))c[n++]=65533,t+=a-1;else{for(i&=a===2?31:a===3?15:7;1<a&&t<o;)i=i<<6|63&e[t++],a--;1<a?c[n++]=65533:i<65536?c[n++]=i:(i-=65536,c[n++]=55296|i>>10&1023,c[n++]=56320|1023&i)}return c.length!==n&&(c.subarray?c=c.subarray(0,n):c.length=n),r.applyFromCharCode(c)}(e=r.transformTo(i.uint8array?`uint8array`:`array`,e))},r.inherits(l,o),l.prototype.processChunk=function(e){var t=r.transformTo(i.uint8array?`uint8array`:`array`,e.data);if(this.leftOver&&this.leftOver.length){if(i.uint8array){var a=t;(t=new Uint8Array(a.length+this.leftOver.length)).set(this.leftOver,0),t.set(a,this.leftOver.length)}else t=this.leftOver.concat(t);this.leftOver=null}var o=function(e,t){var n;for((t||=e.length)>e.length&&(t=e.length),n=t-1;0<=n&&(192&e[n])==128;)n--;return n<0||n===0?t:n+s[e[n]]>t?n:t}(t),c=t;o!==t.length&&(i.uint8array?(c=t.subarray(0,o),this.leftOver=t.subarray(o,t.length)):(c=t.slice(0,o),this.leftOver=t.slice(o,t.length))),this.push({data:n.utf8decode(c),meta:e.meta})},l.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:n.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},n.Utf8DecodeWorker=l,r.inherits(u,o),u.prototype.processChunk=function(e){this.push({data:n.utf8encode(e.data),meta:e.meta})},n.Utf8EncodeWorker=u},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,n){"use strict";var r=e(`./support`),i=e(`./base64`),a=e(`./nodejsUtils`),o=e(`./external`);function s(e){return e}function c(e,t){for(var n=0;n<e.length;++n)t[n]=255&e.charCodeAt(n);return t}e(`setimmediate`),n.newBlob=function(e,t){n.checkSupport(`blob`);try{return new Blob([e],{type:t})}catch{try{var r=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return r.append(e),r.getBlob(t)}catch{throw Error(`Bug : can't construct the Blob.`)}}};var l={stringifyByChunk:function(e,t,n){var r=[],i=0,a=e.length;if(a<=n)return String.fromCharCode.apply(null,e);for(;i<a;)t===`array`||t===`nodebuffer`?r.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+n,a)))):r.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+n,a)))),i+=n;return r.join(``)},stringifyByChar:function(e){for(var t=``,n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return t},applyCanBeUsed:{uint8array:function(){try{return r.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}}(),nodebuffer:function(){try{return r.nodebuffer&&String.fromCharCode.apply(null,a.allocBuffer(1)).length===1}catch{return!1}}()}};function u(e){var t=65536,r=n.getTypeOf(e),i=!0;if(r===`uint8array`?i=l.applyCanBeUsed.uint8array:r===`nodebuffer`&&(i=l.applyCanBeUsed.nodebuffer),i)for(;1<t;)try{return l.stringifyByChunk(e,r,t)}catch{t=Math.floor(t/2)}return l.stringifyByChar(e)}function d(e,t){for(var n=0;n<e.length;n++)t[n]=e[n];return t}n.applyFromCharCode=u;var f={};f.string={string:s,array:function(e){return c(e,Array(e.length))},arraybuffer:function(e){return f.string.uint8array(e).buffer},uint8array:function(e){return c(e,new Uint8Array(e.length))},nodebuffer:function(e){return c(e,a.allocBuffer(e.length))}},f.array={string:u,array:s,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return a.newBufferFrom(e)}},f.arraybuffer={string:function(e){return u(new Uint8Array(e))},array:function(e){return d(new Uint8Array(e),Array(e.byteLength))},arraybuffer:s,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return a.newBufferFrom(new Uint8Array(e))}},f.uint8array={string:u,array:function(e){return d(e,Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:s,nodebuffer:function(e){return a.newBufferFrom(e)}},f.nodebuffer={string:u,array:function(e){return d(e,Array(e.length))},arraybuffer:function(e){return f.nodebuffer.uint8array(e).buffer},uint8array:function(e){return d(e,new Uint8Array(e.length))},nodebuffer:s},n.transformTo=function(e,t){return t||=``,e?(n.checkSupport(e),f[n.getTypeOf(t)][e](t)):t},n.resolve=function(e){for(var t=e.split(`/`),n=[],r=0;r<t.length;r++){var i=t[r];i===`.`||i===``&&r!==0&&r!==t.length-1||(i===`..`?n.pop():n.push(i))}return n.join(`/`)},n.getTypeOf=function(e){return typeof e==`string`?`string`:Object.prototype.toString.call(e)===`[object Array]`?`array`:r.nodebuffer&&a.isBuffer(e)?`nodebuffer`:r.uint8array&&e instanceof Uint8Array?`uint8array`:r.arraybuffer&&e instanceof ArrayBuffer?`arraybuffer`:void 0},n.checkSupport=function(e){if(!r[e.toLowerCase()])throw Error(e+` is not supported by this platform`)},n.MAX_VALUE_16BITS=65535,n.MAX_VALUE_32BITS=-1,n.pretty=function(e){var t,n,r=``;for(n=0;n<(e||``).length;n++)r+=`\\x`+((t=e.charCodeAt(n))<16?`0`:``)+t.toString(16).toUpperCase();return r},n.delay=function(e,t,n){setImmediate(function(){e.apply(n||null,t||[])})},n.inherits=function(e,t){function n(){}n.prototype=t.prototype,e.prototype=new n},n.extend=function(){var e,t,n={};for(e=0;e<arguments.length;e++)for(t in arguments[e])Object.prototype.hasOwnProperty.call(arguments[e],t)&&n[t]===void 0&&(n[t]=arguments[e][t]);return n},n.prepareContent=function(e,t,a,s,l){return o.Promise.resolve(t).then(function(e){return r.blob&&(e instanceof Blob||[`[object File]`,`[object Blob]`].indexOf(Object.prototype.toString.call(e))!==-1)&&typeof FileReader<`u`?new o.Promise(function(t,n){var r=new FileReader;r.onload=function(e){t(e.target.result)},r.onerror=function(e){n(e.target.error)},r.readAsArrayBuffer(e)}):e}).then(function(t){var u=n.getTypeOf(t);return u?(u===`arraybuffer`?t=n.transformTo(`uint8array`,t):u===`string`&&(l?t=i.decode(t):a&&!0!==s&&(t=function(e){return c(e,r.uint8array?new Uint8Array(e.length):Array(e.length))}(t))),t):o.Promise.reject(Error(`Can't read the data of '`+e+`'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?`))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,t,n){"use strict";var r=e(`./reader/readerFor`),i=e(`./utils`),a=e(`./signature`),o=e(`./zipEntry`),s=e(`./support`);function c(e){this.files=[],this.loadOptions=e}c.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw Error(`Corrupted zip or bug: unexpected signature (`+i.pretty(t)+`, expected `+i.pretty(e)+`)`)}},isSignature:function(e,t){var n=this.reader.index;this.reader.setIndex(e);var r=this.reader.readString(4)===t;return this.reader.setIndex(n),r},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=s.uint8array?`uint8array`:`array`,n=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(n)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,n,r=this.zip64EndOfCentralSize-44;0<r;)e=this.reader.readInt(2),t=this.reader.readInt(4),n=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:n}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw Error(`Multi-volumes zip are not supported`)},readLocalFiles:function(){var e,t;for(e=0;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(a.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes()},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER);)(e=new o({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw Error(`Corrupted zip or bug: expected `+this.centralDirRecords+` records in central dir, got `+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);if(e<0)throw this.isSignature(0,a.LOCAL_FILE_HEADER)?Error(`Corrupted zip: can't find end of central directory`):Error(`Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html`);this.reader.setIndex(e);var t=e;if(this.checkSignature(a.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw Error(`Corrupted zip: can't find the ZIP64 end of central directory locator`);if(this.reader.setIndex(e),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,a.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw Error(`Corrupted zip: can't find the ZIP64 end of central directory`);this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var n=this.centralDirOffset+this.centralDirSize;this.zip64&&(n+=20,n+=12+this.zip64EndOfCentralSize);var r=t-n;if(0<r)this.isSignature(t,a.CENTRAL_FILE_HEADER)||(this.reader.zero=r);else if(r<0)throw Error(`Corrupted zip: missing `+Math.abs(r)+` bytes.`)},prepareReader:function(e){this.reader=r(e)},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},t.exports=c},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,t,n){"use strict";var r=e(`./reader/readerFor`),i=e(`./utils`),a=e(`./compressedObject`),o=e(`./crc32`),s=e(`./utf8`),c=e(`./compressions`),l=e(`./support`);function u(e,t){this.options=e,this.loadOptions=t}u.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(e){var t,n;if(e.skip(22),this.fileNameLength=e.readInt(2),n=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(n),this.compressedSize===-1||this.uncompressedSize===-1)throw Error(`Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)`);if((t=function(e){for(var t in c)if(Object.prototype.hasOwnProperty.call(c,t)&&c[t].magic===e)return c[t];return null}(this.compressionMethod))===null)throw Error(`Corrupted zip : compression `+i.pretty(this.compressionMethod)+` unknown (inner file : `+i.transformTo(`string`,this.fileName)+`)`);this.decompressed=new a(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize))},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw Error(`Encrypted zip are not supported`);e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),e==0&&(this.dosPermissions=63&this.externalFileAttributes),e==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!==`/`||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var e=r(this.extraFields[1].value);this.uncompressedSize===i.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===i.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===i.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===i.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4))}},readExtraFields:function(e){var t,n,r,i=e.index+this.extraFieldsLength;for(this.extraFields||={};e.index+4<i;)t=e.readInt(2),n=e.readInt(2),r=e.readData(n),this.extraFields[t]={id:t,length:n,value:r};e.setIndex(i)},handleUTF8:function(){var e=l.uint8array?`uint8array`:`array`;if(this.useUTF8())this.fileNameStr=s.utf8decode(this.fileName),this.fileCommentStr=s.utf8decode(this.fileComment);else{var t=this.findExtraFieldUnicodePath();if(t!==null)this.fileNameStr=t;else{var n=i.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(n)}var r=this.findExtraFieldUnicodeComment();if(r!==null)this.fileCommentStr=r;else{var a=i.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(a)}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=r(e.value);return t.readInt(1)===1&&o(this.fileName)===t.readInt(4)?s.utf8decode(t.readData(e.length-5)):null}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=r(e.value);return t.readInt(1)===1&&o(this.fileComment)===t.readInt(4)?s.utf8decode(t.readData(e.length-5)):null}return null}},t.exports=u},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,n){"use strict";function r(e,t,n){this.name=e,this.dir=n.dir,this.date=n.date,this.comment=n.comment,this.unixPermissions=n.unixPermissions,this.dosPermissions=n.dosPermissions,this._data=t,this._dataBinary=n.binary,this.options={compression:n.compression,compressionOptions:n.compressionOptions}}var i=e(`./stream/StreamHelper`),a=e(`./stream/DataWorker`),o=e(`./utf8`),s=e(`./compressedObject`),c=e(`./stream/GenericWorker`);r.prototype={internalStream:function(e){var t=null,n=`string`;try{if(!e)throw Error(`No output type specified.`);var r=(n=e.toLowerCase())===`string`||n===`text`;n!==`binarystring`&&n!==`text`||(n=`string`),t=this._decompressWorker();var a=!this._dataBinary;a&&!r&&(t=t.pipe(new o.Utf8EncodeWorker)),!a&&r&&(t=t.pipe(new o.Utf8DecodeWorker))}catch(e){(t=new c(`error`)).error(e)}return new i(t,n,``)},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||`nodebuffer`).toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof s&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var n=this._decompressWorker();return this._dataBinary||(n=n.pipe(new o.Utf8EncodeWorker)),s.createWorkerFrom(n,e,t)},_decompressWorker:function(){return this._data instanceof s?this._data.getContentWorker():this._data instanceof c?this._data:new a(this._data)}};for(var l=[`asText`,`asBinary`,`asNodeBuffer`,`asUint8Array`,`asArrayBuffer`],u=function(){throw Error(`This method has been removed in JSZip 3.0, please check the upgrade guide.`)},d=0;d<l.length;d++)r.prototype[l[d]]=u;t.exports=r},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,t,n){(function(e){"use strict";var n,r,i=e.MutationObserver||e.WebKitMutationObserver;if(i){var a=0,o=new i(u),s=e.document.createTextNode(``);o.observe(s,{characterData:!0}),n=function(){s.data=a=++a%2}}else if(e.setImmediate||e.MessageChannel===void 0)n=`document`in e&&`onreadystatechange`in e.document.createElement(`script`)?function(){var t=e.document.createElement(`script`);t.onreadystatechange=function(){u(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(u,0)};else{var c=new e.MessageChannel;c.port1.onmessage=u,n=function(){c.port2.postMessage(0)}}var l=[];function u(){var e,t;r=!0;for(var n=l.length;n;){for(t=l,l=[],e=-1;++e<n;)t[e]();n=l.length}r=!1}t.exports=function(e){l.push(e)!==1||r||n()}}).call(this,typeof global<`u`?global:typeof self<`u`?self:typeof window<`u`?window:{})},{}],37:[function(e,t,n){"use strict";var r=e(`immediate`);function i(){}var a={},o=[`REJECTED`],s=[`FULFILLED`],c=[`PENDING`];function l(e){if(typeof e!=`function`)throw TypeError(`resolver must be a function`);this.state=c,this.queue=[],this.outcome=void 0,e!==i&&p(this,e)}function u(e,t,n){this.promise=e,typeof t==`function`&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),typeof n==`function`&&(this.onRejected=n,this.callRejected=this.otherCallRejected)}function d(e,t,n){r(function(){var r;try{r=t(n)}catch(t){return a.reject(e,t)}r===e?a.reject(e,TypeError(`Cannot resolve promise with itself`)):a.resolve(e,r)})}function f(e){var t=e&&e.then;if(e&&(typeof e==`object`||typeof e==`function`)&&typeof t==`function`)return function(){t.apply(e,arguments)}}function p(e,t){var n=!1;function r(t){n||(n=!0,a.reject(e,t))}function i(t){n||(n=!0,a.resolve(e,t))}var o=m(function(){t(i,r)});o.status===`error`&&r(o.value)}function m(e,t){var n={};try{n.value=e(t),n.status=`success`}catch(e){n.status=`error`,n.value=e}return n}(t.exports=l).prototype.finally=function(e){if(typeof e!=`function`)return this;var t=this.constructor;return this.then(function(n){return t.resolve(e()).then(function(){return n})},function(n){return t.resolve(e()).then(function(){throw n})})},l.prototype.catch=function(e){return this.then(null,e)},l.prototype.then=function(e,t){if(typeof e!=`function`&&this.state===s||typeof t!=`function`&&this.state===o)return this;var n=new this.constructor(i);return this.state===c?this.queue.push(new u(n,e,t)):d(n,this.state===s?e:t,this.outcome),n},u.prototype.callFulfilled=function(e){a.resolve(this.promise,e)},u.prototype.otherCallFulfilled=function(e){d(this.promise,this.onFulfilled,e)},u.prototype.callRejected=function(e){a.reject(this.promise,e)},u.prototype.otherCallRejected=function(e){d(this.promise,this.onRejected,e)},a.resolve=function(e,t){var n=m(f,t);if(n.status===`error`)return a.reject(e,n.value);var r=n.value;if(r)p(e,r);else{e.state=s,e.outcome=t;for(var i=-1,o=e.queue.length;++i<o;)e.queue[i].callFulfilled(t)}return e},a.reject=function(e,t){e.state=o,e.outcome=t;for(var n=-1,r=e.queue.length;++n<r;)e.queue[n].callRejected(t);return e},l.resolve=function(e){return e instanceof this?e:a.resolve(new this(i),e)},l.reject=function(e){var t=new this(i);return a.reject(t,e)},l.all=function(e){var t=this;if(Object.prototype.toString.call(e)!==`[object Array]`)return this.reject(TypeError(`must be an array`));var n=e.length,r=!1;if(!n)return this.resolve([]);for(var o=Array(n),s=0,c=-1,l=new this(i);++c<n;)u(e[c],c);return l;function u(e,i){t.resolve(e).then(function(e){o[i]=e,++s!==n||r||(r=!0,a.resolve(l,o))},function(e){r||(r=!0,a.reject(l,e))})}},l.race=function(e){var t=this;if(Object.prototype.toString.call(e)!==`[object Array]`)return this.reject(TypeError(`must be an array`));var n=e.length,r=!1;if(!n)return this.resolve([]);for(var o=-1,s=new this(i);++o<n;)c=e[o],t.resolve(c).then(function(e){r||(r=!0,a.resolve(s,e))},function(e){r||(r=!0,a.reject(s,e))});var c;return s}},{immediate:36}],38:[function(e,t,n){"use strict";var r={};(0,e(`./lib/utils/common`).assign)(r,e(`./lib/deflate`),e(`./lib/inflate`),e(`./lib/zlib/constants`)),t.exports=r},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,n){"use strict";var r=e(`./zlib/deflate`),i=e(`./utils/common`),a=e(`./utils/strings`),o=e(`./zlib/messages`),s=e(`./zlib/zstream`),c=Object.prototype.toString,l=0,u=-1,d=0,f=8;function p(e){if(!(this instanceof p))return new p(e);this.options=i.assign({level:u,method:f,chunkSize:16384,windowBits:15,memLevel:8,strategy:d,to:``},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg=``,this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var n=r.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(n!==l)throw Error(o[n]);if(t.header&&r.deflateSetHeader(this.strm,t.header),t.dictionary){var m;if(m=typeof t.dictionary==`string`?a.string2buf(t.dictionary):c.call(t.dictionary)===`[object ArrayBuffer]`?new Uint8Array(t.dictionary):t.dictionary,(n=r.deflateSetDictionary(this.strm,m))!==l)throw Error(o[n]);this._dict_set=!0}}function m(e,t){var n=new p(t);if(n.push(e,!0),n.err)throw n.msg||o[n.err];return n.result}p.prototype.push=function(e,t){var n,o,s=this.strm,u=this.options.chunkSize;if(this.ended)return!1;o=t===~~t?t:!0===t?4:0,typeof e==`string`?s.input=a.string2buf(e):c.call(e)===`[object ArrayBuffer]`?s.input=new Uint8Array(e):s.input=e,s.next_in=0,s.avail_in=s.input.length;do{if(s.avail_out===0&&(s.output=new i.Buf8(u),s.next_out=0,s.avail_out=u),(n=r.deflate(s,o))!==1&&n!==l)return this.onEnd(n),!(this.ended=!0);s.avail_out!==0&&(s.avail_in!==0||o!==4&&o!==2)||(this.options.to===`string`?this.onData(a.buf2binstring(i.shrinkBuf(s.output,s.next_out))):this.onData(i.shrinkBuf(s.output,s.next_out)))}while((0<s.avail_in||s.avail_out===0)&&n!==1);return o===4?(n=r.deflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===l):o!==2||(this.onEnd(l),!(s.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e)},p.prototype.onEnd=function(e){e===l&&(this.options.to===`string`?this.result=this.chunks.join(``):this.result=i.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},n.Deflate=p,n.deflate=m,n.deflateRaw=function(e,t){return(t||={}).raw=!0,m(e,t)},n.gzip=function(e,t){return(t||={}).gzip=!0,m(e,t)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,n){"use strict";var r=e(`./zlib/inflate`),i=e(`./utils/common`),a=e(`./utils/strings`),o=e(`./zlib/constants`),s=e(`./zlib/messages`),c=e(`./zlib/zstream`),l=e(`./zlib/gzheader`),u=Object.prototype.toString;function d(e){if(!(this instanceof d))return new d(e);this.options=i.assign({chunkSize:16384,windowBits:0,to:``},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,t.windowBits===0&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&!(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg=``,this.ended=!1,this.chunks=[],this.strm=new c,this.strm.avail_out=0;var n=r.inflateInit2(this.strm,t.windowBits);if(n!==o.Z_OK)throw Error(s[n]);this.header=new l,r.inflateGetHeader(this.strm,this.header)}function f(e,t){var n=new d(t);if(n.push(e,!0),n.err)throw n.msg||s[n.err];return n.result}d.prototype.push=function(e,t){var n,s,c,l,d,f,p=this.strm,m=this.options.chunkSize,h=this.options.dictionary,g=!1;if(this.ended)return!1;s=t===~~t?t:!0===t?o.Z_FINISH:o.Z_NO_FLUSH,typeof e==`string`?p.input=a.binstring2buf(e):u.call(e)===`[object ArrayBuffer]`?p.input=new Uint8Array(e):p.input=e,p.next_in=0,p.avail_in=p.input.length;do{if(p.avail_out===0&&(p.output=new i.Buf8(m),p.next_out=0,p.avail_out=m),(n=r.inflate(p,o.Z_NO_FLUSH))===o.Z_NEED_DICT&&h&&(f=typeof h==`string`?a.string2buf(h):u.call(h)===`[object ArrayBuffer]`?new Uint8Array(h):h,n=r.inflateSetDictionary(this.strm,f)),n===o.Z_BUF_ERROR&&!0===g&&(n=o.Z_OK,g=!1),n!==o.Z_STREAM_END&&n!==o.Z_OK)return this.onEnd(n),!(this.ended=!0);p.next_out&&(p.avail_out!==0&&n!==o.Z_STREAM_END&&(p.avail_in!==0||s!==o.Z_FINISH&&s!==o.Z_SYNC_FLUSH)||(this.options.to===`string`?(c=a.utf8border(p.output,p.next_out),l=p.next_out-c,d=a.buf2string(p.output,c),p.next_out=l,p.avail_out=m-l,l&&i.arraySet(p.output,p.output,c,l,0),this.onData(d)):this.onData(i.shrinkBuf(p.output,p.next_out)))),p.avail_in===0&&p.avail_out===0&&(g=!0)}while((0<p.avail_in||p.avail_out===0)&&n!==o.Z_STREAM_END);return n===o.Z_STREAM_END&&(s=o.Z_FINISH),s===o.Z_FINISH?(n=r.inflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===o.Z_OK):s!==o.Z_SYNC_FLUSH||(this.onEnd(o.Z_OK),!(p.avail_out=0))},d.prototype.onData=function(e){this.chunks.push(e)},d.prototype.onEnd=function(e){e===o.Z_OK&&(this.options.to===`string`?this.result=this.chunks.join(``):this.result=i.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},n.Inflate=d,n.inflate=f,n.inflateRaw=function(e,t){return(t||={}).raw=!0,f(e,t)},n.ungzip=f},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,n){"use strict";var r=typeof Uint8Array<`u`&&typeof Uint16Array<`u`&&typeof Int32Array<`u`;n.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var n=t.shift();if(n){if(typeof n!=`object`)throw TypeError(n+`must be non-object`);for(var r in n)n.hasOwnProperty(r)&&(e[r]=n[r])}}return e},n.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,n,r,i){if(t.subarray&&e.subarray)e.set(t.subarray(n,n+r),i);else for(var a=0;a<r;a++)e[i+a]=t[n+a]},flattenChunks:function(e){var t,n,r,i,a,o;for(t=r=0,n=e.length;t<n;t++)r+=e[t].length;for(o=new Uint8Array(r),t=i=0,n=e.length;t<n;t++)a=e[t],o.set(a,i),i+=a.length;return o}},a={arraySet:function(e,t,n,r,i){for(var a=0;a<r;a++)e[i+a]=t[n+a]},flattenChunks:function(e){return[].concat.apply([],e)}};n.setTyped=function(e){e?(n.Buf8=Uint8Array,n.Buf16=Uint16Array,n.Buf32=Int32Array,n.assign(n,i)):(n.Buf8=Array,n.Buf16=Array,n.Buf32=Array,n.assign(n,a))},n.setTyped(r)},{}],42:[function(e,t,n){"use strict";var r=e(`./common`),i=!0,a=!0;try{String.fromCharCode.apply(null,[0])}catch{i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{a=!1}for(var o=new r.Buf8(256),s=0;s<256;s++)o[s]=252<=s?6:248<=s?5:240<=s?4:224<=s?3:192<=s?2:1;function c(e,t){if(t<65537&&(e.subarray&&a||!e.subarray&&i))return String.fromCharCode.apply(null,r.shrinkBuf(e,t));for(var n=``,o=0;o<t;o++)n+=String.fromCharCode(e[o]);return n}o[254]=o[254]=1,n.string2buf=function(e){var t,n,i,a,o,s=e.length,c=0;for(a=0;a<s;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(i=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(i-56320),a++),c+=n<128?1:n<2048?2:n<65536?3:4;for(t=new r.Buf8(c),a=o=0;o<c;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(i=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(i-56320),a++),n<128?t[o++]=n:(n<2048?t[o++]=192|n>>>6:(n<65536?t[o++]=224|n>>>12:(t[o++]=240|n>>>18,t[o++]=128|n>>>12&63),t[o++]=128|n>>>6&63),t[o++]=128|63&n);return t},n.buf2binstring=function(e){return c(e,e.length)},n.binstring2buf=function(e){for(var t=new r.Buf8(e.length),n=0,i=t.length;n<i;n++)t[n]=e.charCodeAt(n);return t},n.buf2string=function(e,t){var n,r,i,a,s=t||e.length,l=Array(2*s);for(n=r=0;n<s;)if((i=e[n++])<128)l[r++]=i;else if(4<(a=o[i]))l[r++]=65533,n+=a-1;else{for(i&=a===2?31:a===3?15:7;1<a&&n<s;)i=i<<6|63&e[n++],a--;1<a?l[r++]=65533:i<65536?l[r++]=i:(i-=65536,l[r++]=55296|i>>10&1023,l[r++]=56320|1023&i)}return c(l,r)},n.utf8border=function(e,t){var n;for((t||=e.length)>e.length&&(t=e.length),n=t-1;0<=n&&(192&e[n])==128;)n--;return n<0||n===0?t:n+o[e[n]]>t?n:t}},{"./common":41}],43:[function(e,t,n){"use strict";t.exports=function(e,t,n,r){for(var i=65535&e|0,a=e>>>16&65535|0,o=0;n!==0;){for(n-=o=2e3<n?2e3:n;a=a+(i=i+t[r++]|0)|0,--o;);i%=65521,a%=65521}return i|a<<16|0}},{}],44:[function(e,t,n){"use strict";t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,t,n){"use strict";var r=function(){for(var e,t=[],n=0;n<256;n++){e=n;for(var r=0;r<8;r++)e=1&e?3988292384^e>>>1:e>>>1;t[n]=e}return t}();t.exports=function(e,t,n,i){var a=r,o=i+n;e^=-1;for(var s=i;s<o;s++)e=e>>>8^a[255&(e^t[s])];return-1^e}},{}],46:[function(e,t,n){"use strict";var r,i=e(`../utils/common`),a=e(`./trees`),o=e(`./adler32`),s=e(`./crc32`),c=e(`./messages`),l=0,u=4,d=0,f=-2,p=-1,m=4,h=2,g=8,_=9,v=286,y=30,b=19,x=2*v+1,S=15,C=3,w=258,T=w+C+1,E=42,D=113,O=1,k=2,A=3,j=4;function M(e,t){return e.msg=c[t],t}function N(e){return(e<<1)-(4<e?9:0)}function P(e){for(var t=e.length;0<=--t;)e[t]=0}function F(e){var t=e.state,n=t.pending;n>e.avail_out&&(n=e.avail_out),n!==0&&(i.arraySet(e.output,t.pending_buf,t.pending_out,n,e.next_out),e.next_out+=n,t.pending_out+=n,e.total_out+=n,e.avail_out-=n,t.pending-=n,t.pending===0&&(t.pending_out=0))}function I(e,t){a._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,F(e.strm)}function L(e,t){e.pending_buf[e.pending++]=t}function R(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t}function z(e,t){var n,r,i=e.max_chain_length,a=e.strstart,o=e.prev_length,s=e.nice_match,c=e.strstart>e.w_size-T?e.strstart-(e.w_size-T):0,l=e.window,u=e.w_mask,d=e.prev,f=e.strstart+w,p=l[a+o-1],m=l[a+o];e.prev_length>=e.good_match&&(i>>=2),s>e.lookahead&&(s=e.lookahead);do if(l[(n=t)+o]===m&&l[n+o-1]===p&&l[n]===l[a]&&l[++n]===l[a+1]){a+=2,n++;do;while(l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&a<f);if(r=w-(f-a),a=f-w,o<r){if(e.match_start=t,s<=(o=r))break;p=l[a+o-1],m=l[a+o]}}while((t=d[t&u])>c&&--i!=0);return o<=e.lookahead?o:e.lookahead}function B(e){var t,n,r,a,c,l,u,d,f,p,m=e.w_size;do{if(a=e.window_size-e.lookahead-e.strstart,e.strstart>=m+(m-T)){for(i.arraySet(e.window,e.window,m,m,0),e.match_start-=m,e.strstart-=m,e.block_start-=m,t=n=e.hash_size;r=e.head[--t],e.head[t]=m<=r?r-m:0,--n;);for(t=n=m;r=e.prev[--t],e.prev[t]=m<=r?r-m:0,--n;);a+=m}if(e.strm.avail_in===0)break;if(l=e.strm,u=e.window,d=e.strstart+e.lookahead,f=a,p=void 0,p=l.avail_in,f<p&&(p=f),n=p===0?0:(l.avail_in-=p,i.arraySet(u,l.input,l.next_in,p,d),l.state.wrap===1?l.adler=o(l.adler,u,p,d):l.state.wrap===2&&(l.adler=s(l.adler,u,p,d)),l.next_in+=p,l.total_in+=p,p),e.lookahead+=n,e.lookahead+e.insert>=C)for(c=e.strstart-e.insert,e.ins_h=e.window[c],e.ins_h=(e.ins_h<<e.hash_shift^e.window[c+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[c+C-1])&e.hash_mask,e.prev[c&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=c,c++,e.insert--,!(e.lookahead+e.insert<C)););}while(e.lookahead<T&&e.strm.avail_in!==0)}function ee(e,t){for(var n,r;;){if(e.lookahead<T){if(B(e),e.lookahead<T&&t===l)return O;if(e.lookahead===0)break}if(n=0,e.lookahead>=C&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),n!==0&&e.strstart-n<=e.w_size-T&&(e.match_length=z(e,n)),e.match_length>=C)if(r=a._tr_tally(e,e.strstart-e.match_start,e.match_length-C),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=C){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,--e.match_length!=0;);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else r=a._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(r&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=e.strstart<C-1?e.strstart:C-1,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}function V(e,t){for(var n,r,i;;){if(e.lookahead<T){if(B(e),e.lookahead<T&&t===l)return O;if(e.lookahead===0)break}if(n=0,e.lookahead>=C&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=C-1,n!==0&&e.prev_length<e.max_lazy_match&&e.strstart-n<=e.w_size-T&&(e.match_length=z(e,n),e.match_length<=5&&(e.strategy===1||e.match_length===C&&4096<e.strstart-e.match_start)&&(e.match_length=C-1)),e.prev_length>=C&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-C,r=a._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-C),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),--e.prev_length!=0;);if(e.match_available=0,e.match_length=C-1,e.strstart++,r&&(I(e,!1),e.strm.avail_out===0))return O}else if(e.match_available){if((r=a._tr_tally(e,0,e.window[e.strstart-1]))&&I(e,!1),e.strstart++,e.lookahead--,e.strm.avail_out===0)return O}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&=(r=a._tr_tally(e,0,e.window[e.strstart-1]),0),e.insert=e.strstart<C-1?e.strstart:C-1,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}function H(e,t,n,r,i){this.good_length=e,this.max_lazy=t,this.nice_length=n,this.max_chain=r,this.func=i}function te(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=g,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new i.Buf16(2*x),this.dyn_dtree=new i.Buf16(2*(2*y+1)),this.bl_tree=new i.Buf16(2*(2*b+1)),P(this.dyn_ltree),P(this.dyn_dtree),P(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new i.Buf16(S+1),this.heap=new i.Buf16(2*v+1),P(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new i.Buf16(2*v+1),P(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function ne(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=h,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?E:D,e.adler=t.wrap===2?0:1,t.last_flush=l,a._tr_init(t),d):M(e,f)}function re(e){var t=ne(e);return t===d&&function(e){e.window_size=2*e.w_size,P(e.head),e.max_lazy_match=r[e.level].max_lazy,e.good_match=r[e.level].good_length,e.nice_match=r[e.level].nice_length,e.max_chain_length=r[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=C-1,e.match_available=0,e.ins_h=0}(e.state),t}function ie(e,t,n,r,a,o){if(!e)return f;var s=1;if(t===p&&(t=6),r<0?(s=0,r=-r):15<r&&(s=2,r-=16),a<1||_<a||n!==g||r<8||15<r||t<0||9<t||o<0||m<o)return M(e,f);r===8&&(r=9);var c=new te;return(e.state=c).strm=e,c.wrap=s,c.gzhead=null,c.w_bits=r,c.w_size=1<<c.w_bits,c.w_mask=c.w_size-1,c.hash_bits=a+7,c.hash_size=1<<c.hash_bits,c.hash_mask=c.hash_size-1,c.hash_shift=~~((c.hash_bits+C-1)/C),c.window=new i.Buf8(2*c.w_size),c.head=new i.Buf16(c.hash_size),c.prev=new i.Buf16(c.w_size),c.lit_bufsize=1<<a+6,c.pending_buf_size=4*c.lit_bufsize,c.pending_buf=new i.Buf8(c.pending_buf_size),c.d_buf=1*c.lit_bufsize,c.l_buf=3*c.lit_bufsize,c.level=t,c.strategy=o,c.method=n,re(e)}r=[new H(0,0,0,0,function(e,t){var n=65535;for(n>e.pending_buf_size-5&&(n=e.pending_buf_size-5);;){if(e.lookahead<=1){if(B(e),e.lookahead===0&&t===l)return O;if(e.lookahead===0)break}e.strstart+=e.lookahead,e.lookahead=0;var r=e.block_start+n;if((e.strstart===0||e.strstart>=r)&&(e.lookahead=e.strstart-r,e.strstart=r,I(e,!1),e.strm.avail_out===0)||e.strstart-e.block_start>=e.w_size-T&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=0,t===u?(I(e,!0),e.strm.avail_out===0?A:j):(e.strstart>e.block_start&&(I(e,!1),e.strm.avail_out),O)}),new H(4,4,8,4,ee),new H(4,5,16,8,ee),new H(4,6,32,32,ee),new H(4,4,16,16,V),new H(8,16,32,32,V),new H(8,16,128,128,V),new H(8,32,128,256,V),new H(32,128,258,1024,V),new H(32,258,258,4096,V)],n.deflateInit=function(e,t){return ie(e,t,g,15,8,0)},n.deflateInit2=ie,n.deflateReset=re,n.deflateResetKeep=ne,n.deflateSetHeader=function(e,t){return e&&e.state&&e.state.wrap===2?(e.state.gzhead=t,d):f},n.deflate=function(e,t){var n,i,o,c;if(!e||!e.state||5<t||t<0)return e?M(e,f):f;if(i=e.state,!e.output||!e.input&&e.avail_in!==0||i.status===666&&t!==u)return M(e,e.avail_out===0?-5:f);if(i.strm=e,n=i.last_flush,i.last_flush=t,i.status===E)if(i.wrap===2)e.adler=0,L(i,31),L(i,139),L(i,8),i.gzhead?(L(i,+!!i.gzhead.text+(i.gzhead.hcrc?2:0)+(i.gzhead.extra?4:0)+(i.gzhead.name?8:0)+(i.gzhead.comment?16:0)),L(i,255&i.gzhead.time),L(i,i.gzhead.time>>8&255),L(i,i.gzhead.time>>16&255),L(i,i.gzhead.time>>24&255),L(i,i.level===9?2:2<=i.strategy||i.level<2?4:0),L(i,255&i.gzhead.os),i.gzhead.extra&&i.gzhead.extra.length&&(L(i,255&i.gzhead.extra.length),L(i,i.gzhead.extra.length>>8&255)),i.gzhead.hcrc&&(e.adler=s(e.adler,i.pending_buf,i.pending,0)),i.gzindex=0,i.status=69):(L(i,0),L(i,0),L(i,0),L(i,0),L(i,0),L(i,i.level===9?2:2<=i.strategy||i.level<2?4:0),L(i,3),i.status=D);else{var p=g+(i.w_bits-8<<4)<<8;p|=(2<=i.strategy||i.level<2?0:i.level<6?1:i.level===6?2:3)<<6,i.strstart!==0&&(p|=32),p+=31-p%31,i.status=D,R(i,p),i.strstart!==0&&(R(i,e.adler>>>16),R(i,65535&e.adler)),e.adler=1}if(i.status===69)if(i.gzhead.extra){for(o=i.pending;i.gzindex<(65535&i.gzhead.extra.length)&&(i.pending!==i.pending_buf_size||(i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),F(e),o=i.pending,i.pending!==i.pending_buf_size));)L(i,255&i.gzhead.extra[i.gzindex]),i.gzindex++;i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),i.gzindex===i.gzhead.extra.length&&(i.gzindex=0,i.status=73)}else i.status=73;if(i.status===73)if(i.gzhead.name){o=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),F(e),o=i.pending,i.pending===i.pending_buf_size)){c=1;break}c=i.gzindex<i.gzhead.name.length?255&i.gzhead.name.charCodeAt(i.gzindex++):0,L(i,c)}while(c!==0);i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),c===0&&(i.gzindex=0,i.status=91)}else i.status=91;if(i.status===91)if(i.gzhead.comment){o=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),F(e),o=i.pending,i.pending===i.pending_buf_size)){c=1;break}c=i.gzindex<i.gzhead.comment.length?255&i.gzhead.comment.charCodeAt(i.gzindex++):0,L(i,c)}while(c!==0);i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),c===0&&(i.status=103)}else i.status=103;if(i.status===103&&(i.gzhead.hcrc?(i.pending+2>i.pending_buf_size&&F(e),i.pending+2<=i.pending_buf_size&&(L(i,255&e.adler),L(i,e.adler>>8&255),e.adler=0,i.status=D)):i.status=D),i.pending!==0){if(F(e),e.avail_out===0)return i.last_flush=-1,d}else if(e.avail_in===0&&N(t)<=N(n)&&t!==u)return M(e,-5);if(i.status===666&&e.avail_in!==0)return M(e,-5);if(e.avail_in!==0||i.lookahead!==0||t!==l&&i.status!==666){var m=i.strategy===2?function(e,t){for(var n;;){if(e.lookahead===0&&(B(e),e.lookahead===0)){if(t===l)return O;break}if(e.match_length=0,n=a._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,n&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=0,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}(i,t):i.strategy===3?function(e,t){for(var n,r,i,o,s=e.window;;){if(e.lookahead<=w){if(B(e),e.lookahead<=w&&t===l)return O;if(e.lookahead===0)break}if(e.match_length=0,e.lookahead>=C&&0<e.strstart&&(r=s[i=e.strstart-1])===s[++i]&&r===s[++i]&&r===s[++i]){o=e.strstart+w;do;while(r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&i<o);e.match_length=w-(o-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=C?(n=a._tr_tally(e,1,e.match_length-C),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(n=a._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),n&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=0,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}(i,t):r[i.level].func(i,t);if(m!==A&&m!==j||(i.status=666),m===O||m===A)return e.avail_out===0&&(i.last_flush=-1),d;if(m===k&&(t===1?a._tr_align(i):t!==5&&(a._tr_stored_block(i,0,0,!1),t===3&&(P(i.head),i.lookahead===0&&(i.strstart=0,i.block_start=0,i.insert=0))),F(e),e.avail_out===0))return i.last_flush=-1,d}return t===u?i.wrap<=0?1:(i.wrap===2?(L(i,255&e.adler),L(i,e.adler>>8&255),L(i,e.adler>>16&255),L(i,e.adler>>24&255),L(i,255&e.total_in),L(i,e.total_in>>8&255),L(i,e.total_in>>16&255),L(i,e.total_in>>24&255)):(R(i,e.adler>>>16),R(i,65535&e.adler)),F(e),0<i.wrap&&(i.wrap=-i.wrap),i.pending===0?1:d):d},n.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==E&&t!==69&&t!==73&&t!==91&&t!==103&&t!==D&&t!==666?M(e,f):(e.state=null,t===D?M(e,-3):d):f},n.deflateSetDictionary=function(e,t){var n,r,a,s,c,l,u,p,m=t.length;if(!e||!e.state||(s=(n=e.state).wrap)===2||s===1&&n.status!==E||n.lookahead)return f;for(s===1&&(e.adler=o(e.adler,t,m,0)),n.wrap=0,m>=n.w_size&&(s===0&&(P(n.head),n.strstart=0,n.block_start=0,n.insert=0),p=new i.Buf8(n.w_size),i.arraySet(p,t,m-n.w_size,n.w_size,0),t=p,m=n.w_size),c=e.avail_in,l=e.next_in,u=e.input,e.avail_in=m,e.next_in=0,e.input=t,B(n);n.lookahead>=C;){for(r=n.strstart,a=n.lookahead-(C-1);n.ins_h=(n.ins_h<<n.hash_shift^n.window[r+C-1])&n.hash_mask,n.prev[r&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=r,r++,--a;);n.strstart=r,n.lookahead=C-1,B(n)}return n.strstart+=n.lookahead,n.block_start=n.strstart,n.insert=n.lookahead,n.lookahead=0,n.match_length=n.prev_length=C-1,n.match_available=0,e.next_in=l,e.input=u,e.avail_in=c,n.wrap=s,d},n.deflateInfo=`pako deflate (from Nodeca project)`},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,n){"use strict";t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name=``,this.comment=``,this.hcrc=0,this.done=!1}},{}],48:[function(e,t,n){"use strict";t.exports=function(e,t){var n=e.state,r=e.next_in,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T=e.input,E;i=r+(e.avail_in-5),a=e.next_out,E=e.output,o=a-(t-e.avail_out),s=a+(e.avail_out-257),c=n.dmax,l=n.wsize,u=n.whave,d=n.wnext,f=n.window,p=n.hold,m=n.bits,h=n.lencode,g=n.distcode,_=(1<<n.lenbits)-1,v=(1<<n.distbits)-1;e:do{m<15&&(p+=T[r++]<<m,m+=8,p+=T[r++]<<m,m+=8),y=h[p&_];t:for(;;){if(p>>>=b=y>>>24,m-=b,(b=y>>>16&255)==0)E[a++]=65535&y;else{if(!(16&b)){if(!(64&b)){y=h[(65535&y)+(p&(1<<b)-1)];continue t}if(32&b){n.mode=12;break e}e.msg=`invalid literal/length code`,n.mode=30;break e}x=65535&y,(b&=15)&&(m<b&&(p+=T[r++]<<m,m+=8),x+=p&(1<<b)-1,p>>>=b,m-=b),m<15&&(p+=T[r++]<<m,m+=8,p+=T[r++]<<m,m+=8),y=g[p&v];r:for(;;){if(p>>>=b=y>>>24,m-=b,!(16&(b=y>>>16&255))){if(!(64&b)){y=g[(65535&y)+(p&(1<<b)-1)];continue r}e.msg=`invalid distance code`,n.mode=30;break e}if(S=65535&y,m<(b&=15)&&(p+=T[r++]<<m,(m+=8)<b&&(p+=T[r++]<<m,m+=8)),c<(S+=p&(1<<b)-1)){e.msg=`invalid distance too far back`,n.mode=30;break e}if(p>>>=b,m-=b,(b=a-o)<S){if(u<(b=S-b)&&n.sane){e.msg=`invalid distance too far back`,n.mode=30;break e}if(w=f,(C=0)===d){if(C+=l-b,b<x){for(x-=b;E[a++]=f[C++],--b;);C=a-S,w=E}}else if(d<b){if(C+=l+d-b,(b-=d)<x){for(x-=b;E[a++]=f[C++],--b;);if(C=0,d<x){for(x-=b=d;E[a++]=f[C++],--b;);C=a-S,w=E}}}else if(C+=d-b,b<x){for(x-=b;E[a++]=f[C++],--b;);C=a-S,w=E}for(;2<x;)E[a++]=w[C++],E[a++]=w[C++],E[a++]=w[C++],x-=3;x&&(E[a++]=w[C++],1<x&&(E[a++]=w[C++]))}else{for(C=a-S;E[a++]=E[C++],E[a++]=E[C++],E[a++]=E[C++],2<(x-=3););x&&(E[a++]=E[C++],1<x&&(E[a++]=E[C++]))}break}}break}}while(r<i&&a<s);r-=x=m>>3,p&=(1<<(m-=x<<3))-1,e.next_in=r,e.next_out=a,e.avail_in=r<i?i-r+5:5-(r-i),e.avail_out=a<s?s-a+257:257-(a-s),n.hold=p,n.bits=m}},{}],49:[function(e,t,n){"use strict";var r=e(`../utils/common`),i=e(`./adler32`),a=e(`./crc32`),o=e(`./inffast`),s=e(`./inftrees`),c=1,l=2,u=0,d=-2,f=1,p=852,m=592;function h(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function g(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function _(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg=``,t.wrap&&(e.adler=1&t.wrap),t.mode=f,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new r.Buf32(p),t.distcode=t.distdyn=new r.Buf32(m),t.sane=1,t.back=-1,u):d}function v(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,_(e)):d}function y(e,t){var n,r;return e&&e.state?(r=e.state,t<0?(n=0,t=-t):(n=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?d:(r.window!==null&&r.wbits!==t&&(r.window=null),r.wrap=n,r.wbits=t,v(e))):d}function b(e,t){var n,r;return e?(r=new g,(e.state=r).window=null,(n=y(e,t))!==u&&(e.state=null),n):d}var x,S,C=!0;function w(e){if(C){var t;for(x=new r.Buf32(512),S=new r.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(s(c,e.lens,0,288,x,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;s(l,e.lens,0,32,S,0,e.work,{bits:5}),C=!1}e.lencode=x,e.lenbits=9,e.distcode=S,e.distbits=5}function T(e,t,n,i){var a,o=e.state;return o.window===null&&(o.wsize=1<<o.wbits,o.wnext=0,o.whave=0,o.window=new r.Buf8(o.wsize)),i>=o.wsize?(r.arraySet(o.window,t,n-o.wsize,o.wsize,0),o.wnext=0,o.whave=o.wsize):(i<(a=o.wsize-o.wnext)&&(a=i),r.arraySet(o.window,t,n-i,a,o.wnext),(i-=a)?(r.arraySet(o.window,t,n-i,i,0),o.wnext=i,o.whave=o.wsize):(o.wnext+=a,o.wnext===o.wsize&&(o.wnext=0),o.whave<o.wsize&&(o.whave+=a))),0}n.inflateReset=v,n.inflateReset2=y,n.inflateResetKeep=_,n.inflateInit=function(e){return b(e,15)},n.inflateInit2=b,n.inflate=function(e,t){var n,p,m,g,_,v,y,b,x,S,C,E,D,O,k,A,j,M,N,P,F,I,L,R,z=0,B=new r.Buf8(4),ee=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&e.avail_in!==0)return d;(n=e.state).mode===12&&(n.mode=13),_=e.next_out,m=e.output,y=e.avail_out,g=e.next_in,p=e.input,v=e.avail_in,b=n.hold,x=n.bits,S=v,C=y,I=u;e:for(;;)switch(n.mode){case f:if(n.wrap===0){n.mode=13;break}for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(2&n.wrap&&b===35615){B[n.check=0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0),x=b=0,n.mode=2;break}if(n.flags=0,n.head&&(n.head.done=!1),!(1&n.wrap)||(((255&b)<<8)+(b>>8))%31){e.msg=`incorrect header check`,n.mode=30;break}if((15&b)!=8){e.msg=`unknown compression method`,n.mode=30;break}if(x-=4,F=8+(15&(b>>>=4)),n.wbits===0)n.wbits=F;else if(F>n.wbits){e.msg=`invalid window size`,n.mode=30;break}n.dmax=1<<F,e.adler=n.check=1,n.mode=512&b?10:12,x=b=0;break;case 2:for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(n.flags=b,(255&n.flags)!=8){e.msg=`unknown compression method`,n.mode=30;break}if(57344&n.flags){e.msg=`unknown header flags set`,n.mode=30;break}n.head&&(n.head.text=b>>8&1),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0)),x=b=0,n.mode=3;case 3:for(;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.head&&(n.head.time=b),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,B[2]=b>>>16&255,B[3]=b>>>24&255,n.check=a(n.check,B,4,0)),x=b=0,n.mode=4;case 4:for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.head&&(n.head.xflags=255&b,n.head.os=b>>8),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0)),x=b=0,n.mode=5;case 5:if(1024&n.flags){for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.length=b,n.head&&(n.head.extra_len=b),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0)),x=b=0}else n.head&&(n.head.extra=null);n.mode=6;case 6:if(1024&n.flags&&(v<(E=n.length)&&(E=v),E&&(n.head&&(F=n.head.extra_len-n.length,n.head.extra||(n.head.extra=Array(n.head.extra_len)),r.arraySet(n.head.extra,p,g,E,F)),512&n.flags&&(n.check=a(n.check,p,E,g)),v-=E,g+=E,n.length-=E),n.length))break e;n.length=0,n.mode=7;case 7:if(2048&n.flags){if(v===0)break e;for(E=0;F=p[g+E++],n.head&&F&&n.length<65536&&(n.head.name+=String.fromCharCode(F)),F&&E<v;);if(512&n.flags&&(n.check=a(n.check,p,E,g)),v-=E,g+=E,F)break e}else n.head&&(n.head.name=null);n.length=0,n.mode=8;case 8:if(4096&n.flags){if(v===0)break e;for(E=0;F=p[g+E++],n.head&&F&&n.length<65536&&(n.head.comment+=String.fromCharCode(F)),F&&E<v;);if(512&n.flags&&(n.check=a(n.check,p,E,g)),v-=E,g+=E,F)break e}else n.head&&(n.head.comment=null);n.mode=9;case 9:if(512&n.flags){for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(b!==(65535&n.check)){e.msg=`header crc mismatch`,n.mode=30;break}x=b=0}n.head&&(n.head.hcrc=n.flags>>9&1,n.head.done=!0),e.adler=n.check=0,n.mode=12;break;case 10:for(;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}e.adler=n.check=h(b),x=b=0,n.mode=11;case 11:if(n.havedict===0)return e.next_out=_,e.avail_out=y,e.next_in=g,e.avail_in=v,n.hold=b,n.bits=x,2;e.adler=n.check=1,n.mode=12;case 12:if(t===5||t===6)break e;case 13:if(n.last){b>>>=7&x,x-=7&x,n.mode=27;break}for(;x<3;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}switch(n.last=1&b,--x,3&(b>>>=1)){case 0:n.mode=14;break;case 1:if(w(n),n.mode=20,t!==6)break;b>>>=2,x-=2;break e;case 2:n.mode=17;break;case 3:e.msg=`invalid block type`,n.mode=30}b>>>=2,x-=2;break;case 14:for(b>>>=7&x,x-=7&x;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if((65535&b)!=(b>>>16^65535)){e.msg=`invalid stored block lengths`,n.mode=30;break}if(n.length=65535&b,x=b=0,n.mode=15,t===6)break e;case 15:n.mode=16;case 16:if(E=n.length){if(v<E&&(E=v),y<E&&(E=y),E===0)break e;r.arraySet(m,p,g,E,_),v-=E,g+=E,y-=E,_+=E,n.length-=E;break}n.mode=12;break;case 17:for(;x<14;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(n.nlen=257+(31&b),b>>>=5,x-=5,n.ndist=1+(31&b),b>>>=5,x-=5,n.ncode=4+(15&b),b>>>=4,x-=4,286<n.nlen||30<n.ndist){e.msg=`too many length or distance symbols`,n.mode=30;break}n.have=0,n.mode=18;case 18:for(;n.have<n.ncode;){for(;x<3;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.lens[ee[n.have++]]=7&b,b>>>=3,x-=3}for(;n.have<19;)n.lens[ee[n.have++]]=0;if(n.lencode=n.lendyn,n.lenbits=7,L={bits:n.lenbits},I=s(0,n.lens,0,19,n.lencode,0,n.work,L),n.lenbits=L.bits,I){e.msg=`invalid code lengths set`,n.mode=30;break}n.have=0,n.mode=19;case 19:for(;n.have<n.nlen+n.ndist;){for(;A=(z=n.lencode[b&(1<<n.lenbits)-1])>>>16&255,j=65535&z,!((k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(j<16)b>>>=k,x-=k,n.lens[n.have++]=j;else{if(j===16){for(R=k+2;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(b>>>=k,x-=k,n.have===0){e.msg=`invalid bit length repeat`,n.mode=30;break}F=n.lens[n.have-1],E=3+(3&b),b>>>=2,x-=2}else if(j===17){for(R=k+3;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}x-=k,F=0,E=3+(7&(b>>>=k)),b>>>=3,x-=3}else{for(R=k+7;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}x-=k,F=0,E=11+(127&(b>>>=k)),b>>>=7,x-=7}if(n.have+E>n.nlen+n.ndist){e.msg=`invalid bit length repeat`,n.mode=30;break}for(;E--;)n.lens[n.have++]=F}}if(n.mode===30)break;if(n.lens[256]===0){e.msg=`invalid code -- missing end-of-block`,n.mode=30;break}if(n.lenbits=9,L={bits:n.lenbits},I=s(c,n.lens,0,n.nlen,n.lencode,0,n.work,L),n.lenbits=L.bits,I){e.msg=`invalid literal/lengths set`,n.mode=30;break}if(n.distbits=6,n.distcode=n.distdyn,L={bits:n.distbits},I=s(l,n.lens,n.nlen,n.ndist,n.distcode,0,n.work,L),n.distbits=L.bits,I){e.msg=`invalid distances set`,n.mode=30;break}if(n.mode=20,t===6)break e;case 20:n.mode=21;case 21:if(6<=v&&258<=y){e.next_out=_,e.avail_out=y,e.next_in=g,e.avail_in=v,n.hold=b,n.bits=x,o(e,C),_=e.next_out,m=e.output,y=e.avail_out,g=e.next_in,p=e.input,v=e.avail_in,b=n.hold,x=n.bits,n.mode===12&&(n.back=-1);break}for(n.back=0;A=(z=n.lencode[b&(1<<n.lenbits)-1])>>>16&255,j=65535&z,!((k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(A&&!(240&A)){for(M=k,N=A,P=j;A=(z=n.lencode[P+((b&(1<<M+N)-1)>>M)])>>>16&255,j=65535&z,!(M+(k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}b>>>=M,x-=M,n.back+=M}if(b>>>=k,x-=k,n.back+=k,n.length=j,A===0){n.mode=26;break}if(32&A){n.back=-1,n.mode=12;break}if(64&A){e.msg=`invalid literal/length code`,n.mode=30;break}n.extra=15&A,n.mode=22;case 22:if(n.extra){for(R=n.extra;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.length+=b&(1<<n.extra)-1,b>>>=n.extra,x-=n.extra,n.back+=n.extra}n.was=n.length,n.mode=23;case 23:for(;A=(z=n.distcode[b&(1<<n.distbits)-1])>>>16&255,j=65535&z,!((k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(!(240&A)){for(M=k,N=A,P=j;A=(z=n.distcode[P+((b&(1<<M+N)-1)>>M)])>>>16&255,j=65535&z,!(M+(k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}b>>>=M,x-=M,n.back+=M}if(b>>>=k,x-=k,n.back+=k,64&A){e.msg=`invalid distance code`,n.mode=30;break}n.offset=j,n.extra=15&A,n.mode=24;case 24:if(n.extra){for(R=n.extra;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.offset+=b&(1<<n.extra)-1,b>>>=n.extra,x-=n.extra,n.back+=n.extra}if(n.offset>n.dmax){e.msg=`invalid distance too far back`,n.mode=30;break}n.mode=25;case 25:if(y===0)break e;if(E=C-y,n.offset>E){if((E=n.offset-E)>n.whave&&n.sane){e.msg=`invalid distance too far back`,n.mode=30;break}D=E>n.wnext?(E-=n.wnext,n.wsize-E):n.wnext-E,E>n.length&&(E=n.length),O=n.window}else O=m,D=_-n.offset,E=n.length;for(y<E&&(E=y),y-=E,n.length-=E;m[_++]=O[D++],--E;);n.length===0&&(n.mode=21);break;case 26:if(y===0)break e;m[_++]=n.length,y--,n.mode=21;break;case 27:if(n.wrap){for(;x<32;){if(v===0)break e;v--,b|=p[g++]<<x,x+=8}if(C-=y,e.total_out+=C,n.total+=C,C&&(e.adler=n.check=n.flags?a(n.check,m,C,_-C):i(n.check,m,C,_-C)),C=y,(n.flags?b:h(b))!==n.check){e.msg=`incorrect data check`,n.mode=30;break}x=b=0}n.mode=28;case 28:if(n.wrap&&n.flags){for(;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(b!==(4294967295&n.total)){e.msg=`incorrect length check`,n.mode=30;break}x=b=0}n.mode=29;case 29:I=1;break e;case 30:I=-3;break e;case 31:return-4;case 32:default:return d}return e.next_out=_,e.avail_out=y,e.next_in=g,e.avail_in=v,n.hold=b,n.bits=x,(n.wsize||C!==e.avail_out&&n.mode<30&&(n.mode<27||t!==4))&&T(e,e.output,e.next_out,C-e.avail_out)?(n.mode=31,-4):(S-=e.avail_in,C-=e.avail_out,e.total_in+=S,e.total_out+=C,n.total+=C,n.wrap&&C&&(e.adler=n.check=n.flags?a(n.check,m,C,e.next_out-C):i(n.check,m,C,e.next_out-C)),e.data_type=n.bits+(n.last?64:0)+(n.mode===12?128:0)+(n.mode===20||n.mode===15?256:0),(S==0&&C===0||t===4)&&I===u&&(I=-5),I)},n.inflateEnd=function(e){if(!e||!e.state)return d;var t=e.state;return t.window&&=null,e.state=null,u},n.inflateGetHeader=function(e,t){var n;return e&&e.state&&2&(n=e.state).wrap?((n.head=t).done=!1,u):d},n.inflateSetDictionary=function(e,t){var n,r=t.length;return e&&e.state?(n=e.state).wrap!==0&&n.mode!==11?d:n.mode===11&&i(1,t,r,0)!==n.check?-3:T(e,t,r,r)?(n.mode=31,-4):(n.havedict=1,u):d},n.inflateInfo=`pako inflate (from Nodeca project)`},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,n){"use strict";var r=e(`../utils/common`),i=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],a=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],o=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],s=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,n,c,l,u,d,f){var p,m,h,g,_,v,y,b,x,S=f.bits,C=0,w=0,T=0,E=0,D=0,O=0,k=0,A=0,j=0,M=0,N=null,P=0,F=new r.Buf16(16),I=new r.Buf16(16),L=null,R=0;for(C=0;C<=15;C++)F[C]=0;for(w=0;w<c;w++)F[t[n+w]]++;for(D=S,E=15;1<=E&&F[E]===0;E--);if(E<D&&(D=E),E===0)return l[u++]=20971520,l[u++]=20971520,f.bits=1,0;for(T=1;T<E&&F[T]===0;T++);for(D<T&&(D=T),C=A=1;C<=15;C++)if(A<<=1,(A-=F[C])<0)return-1;if(0<A&&(e===0||E!==1))return-1;for(I[1]=0,C=1;C<15;C++)I[C+1]=I[C]+F[C];for(w=0;w<c;w++)t[n+w]!==0&&(d[I[t[n+w]]++]=w);if(v=e===0?(N=L=d,19):e===1?(N=i,P-=257,L=a,R-=257,256):(N=o,L=s,-1),C=T,_=u,k=w=M=0,h=-1,g=(j=1<<(O=D))-1,e===1&&852<j||e===2&&592<j)return 1;for(;;){for(y=C-k,x=d[w]<v?(b=0,d[w]):d[w]>v?(b=L[R+d[w]],N[P+d[w]]):(b=96,0),p=1<<C-k,T=m=1<<O;l[_+(M>>k)+(m-=p)]=y<<24|b<<16|x|0,m!==0;);for(p=1<<C-1;M&p;)p>>=1;if(p===0?M=0:(M&=p-1,M+=p),w++,--F[C]==0){if(C===E)break;C=t[n+d[w]]}if(D<C&&(M&g)!==h){for(k===0&&(k=D),_+=T,A=1<<(O=C-k);O+k<E&&!((A-=F[O+k])<=0);)O++,A<<=1;if(j+=1<<O,e===1&&852<j||e===2&&592<j)return 1;l[h=M&g]=D<<24|O<<16|_-u|0}}return M!==0&&(l[_+M]=C-k<<24|4194304),f.bits=D,0}},{"../utils/common":41}],51:[function(e,t,n){"use strict";t.exports={2:`need dictionary`,1:`stream end`,0:``,"-1":`file error`,"-2":`stream error`,"-3":`data error`,"-4":`insufficient memory`,"-5":`buffer error`,"-6":`incompatible version`}},{}],52:[function(e,t,n){"use strict";var r=e(`../utils/common`),i=0,a=1;function o(e){for(var t=e.length;0<=--t;)e[t]=0}var s=0,c=29,l=256,u=l+1+c,d=30,f=19,p=2*u+1,m=15,h=16,g=7,_=256,v=16,y=17,b=18,x=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],S=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],C=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],w=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],T=Array(2*(u+2));o(T);var E=Array(2*d);o(E);var D=Array(512);o(D);var O=Array(256);o(O);var k=Array(c);o(k);var A,j,M,N=Array(d);function P(e,t,n,r,i){this.static_tree=e,this.extra_bits=t,this.extra_base=n,this.elems=r,this.max_length=i,this.has_stree=e&&e.length}function F(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}function I(e){return e<256?D[e]:D[256+(e>>>7)]}function L(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255}function R(e,t,n){e.bi_valid>h-n?(e.bi_buf|=t<<e.bi_valid&65535,L(e,e.bi_buf),e.bi_buf=t>>h-e.bi_valid,e.bi_valid+=n-h):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=n)}function z(e,t,n){R(e,n[2*t],n[2*t+1])}function B(e,t){for(var n=0;n|=1&e,e>>>=1,n<<=1,0<--t;);return n>>>1}function ee(e,t,n){var r,i,a=Array(m+1),o=0;for(r=1;r<=m;r++)a[r]=o=o+n[r-1]<<1;for(i=0;i<=t;i++){var s=e[2*i+1];s!==0&&(e[2*i]=B(a[s]++,s))}}function V(e){var t;for(t=0;t<u;t++)e.dyn_ltree[2*t]=0;for(t=0;t<d;t++)e.dyn_dtree[2*t]=0;for(t=0;t<f;t++)e.bl_tree[2*t]=0;e.dyn_ltree[2*_]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function H(e){8<e.bi_valid?L(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function te(e,t,n,r){var i=2*t,a=2*n;return e[i]<e[a]||e[i]===e[a]&&r[t]<=r[n]}function ne(e,t,n){for(var r=e.heap[n],i=n<<1;i<=e.heap_len&&(i<e.heap_len&&te(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!te(t,r,e.heap[i],e.depth));)e.heap[n]=e.heap[i],n=i,i<<=1;e.heap[n]=r}function re(e,t,n){var r,i,a,o,s=0;if(e.last_lit!==0)for(;r=e.pending_buf[e.d_buf+2*s]<<8|e.pending_buf[e.d_buf+2*s+1],i=e.pending_buf[e.l_buf+s],s++,r===0?z(e,i,t):(z(e,(a=O[i])+l+1,t),(o=x[a])!==0&&R(e,i-=k[a],o),z(e,a=I(--r),n),(o=S[a])!==0&&R(e,r-=N[a],o)),s<e.last_lit;);z(e,_,t)}function ie(e,t){var n,r,i,a=t.dyn_tree,o=t.stat_desc.static_tree,s=t.stat_desc.has_stree,c=t.stat_desc.elems,l=-1;for(e.heap_len=0,e.heap_max=p,n=0;n<c;n++)a[2*n]===0?a[2*n+1]=0:(e.heap[++e.heap_len]=l=n,e.depth[n]=0);for(;e.heap_len<2;)a[2*(i=e.heap[++e.heap_len]=l<2?++l:0)]=1,e.depth[i]=0,e.opt_len--,s&&(e.static_len-=o[2*i+1]);for(t.max_code=l,n=e.heap_len>>1;1<=n;n--)ne(e,a,n);for(i=c;n=e.heap[1],e.heap[1]=e.heap[e.heap_len--],ne(e,a,1),r=e.heap[1],e.heap[--e.heap_max]=n,e.heap[--e.heap_max]=r,a[2*i]=a[2*n]+a[2*r],e.depth[i]=(e.depth[n]>=e.depth[r]?e.depth[n]:e.depth[r])+1,a[2*n+1]=a[2*r+1]=i,e.heap[1]=i++,ne(e,a,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var n,r,i,a,o,s,c=t.dyn_tree,l=t.max_code,u=t.stat_desc.static_tree,d=t.stat_desc.has_stree,f=t.stat_desc.extra_bits,h=t.stat_desc.extra_base,g=t.stat_desc.max_length,_=0;for(a=0;a<=m;a++)e.bl_count[a]=0;for(c[2*e.heap[e.heap_max]+1]=0,n=e.heap_max+1;n<p;n++)g<(a=c[2*c[2*(r=e.heap[n])+1]+1]+1)&&(a=g,_++),c[2*r+1]=a,l<r||(e.bl_count[a]++,o=0,h<=r&&(o=f[r-h]),s=c[2*r],e.opt_len+=s*(a+o),d&&(e.static_len+=s*(u[2*r+1]+o)));if(_!==0){do{for(a=g-1;e.bl_count[a]===0;)a--;e.bl_count[a]--,e.bl_count[a+1]+=2,e.bl_count[g]--,_-=2}while(0<_);for(a=g;a!==0;a--)for(r=e.bl_count[a];r!==0;)l<(i=e.heap[--n])||(c[2*i+1]!==a&&(e.opt_len+=(a-c[2*i+1])*c[2*i],c[2*i+1]=a),r--)}}(e,t),ee(a,l,e.bl_count)}function ae(e,t,n){var r,i,a=-1,o=t[1],s=0,c=7,l=4;for(o===0&&(c=138,l=3),t[2*(n+1)+1]=65535,r=0;r<=n;r++)i=o,o=t[2*(r+1)+1],++s<c&&i===o||(s<l?e.bl_tree[2*i]+=s:i===0?s<=10?e.bl_tree[2*y]++:e.bl_tree[2*b]++:(i!==a&&e.bl_tree[2*i]++,e.bl_tree[2*v]++),a=i,l=(s=0)===o?(c=138,3):i===o?(c=6,3):(c=7,4))}function oe(e,t,n){var r,i,a=-1,o=t[1],s=0,c=7,l=4;for(o===0&&(c=138,l=3),r=0;r<=n;r++)if(i=o,o=t[2*(r+1)+1],!(++s<c&&i===o)){if(s<l)for(;z(e,i,e.bl_tree),--s!=0;);else i===0?s<=10?(z(e,y,e.bl_tree),R(e,s-3,3)):(z(e,b,e.bl_tree),R(e,s-11,7)):(i!==a&&(z(e,i,e.bl_tree),s--),z(e,v,e.bl_tree),R(e,s-3,2));a=i,l=(s=0)===o?(c=138,3):i===o?(c=6,3):(c=7,4)}}o(N);var se=!1;function ce(e,t,n,i){R(e,(s<<1)+ +!!i,3),function(e,t,n,i){H(e),i&&(L(e,n),L(e,~n)),r.arraySet(e.pending_buf,e.window,t,n,e.pending),e.pending+=n}(e,t,n,!0)}n._tr_init=function(e){se||=(function(){var e,t,n,r,i,a=Array(m+1);for(r=n=0;r<c-1;r++)for(k[r]=n,e=0;e<1<<x[r];e++)O[n++]=r;for(O[n-1]=r,r=i=0;r<16;r++)for(N[r]=i,e=0;e<1<<S[r];e++)D[i++]=r;for(i>>=7;r<d;r++)for(N[r]=i<<7,e=0;e<1<<S[r]-7;e++)D[256+i++]=r;for(t=0;t<=m;t++)a[t]=0;for(e=0;e<=143;)T[2*e+1]=8,e++,a[8]++;for(;e<=255;)T[2*e+1]=9,e++,a[9]++;for(;e<=279;)T[2*e+1]=7,e++,a[7]++;for(;e<=287;)T[2*e+1]=8,e++,a[8]++;for(ee(T,u+1,a),e=0;e<d;e++)E[2*e+1]=5,E[2*e]=B(e,5);A=new P(T,x,l+1,u,m),j=new P(E,S,0,d,m),M=new P([],C,0,f,g)}(),!0),e.l_desc=new F(e.dyn_ltree,A),e.d_desc=new F(e.dyn_dtree,j),e.bl_desc=new F(e.bl_tree,M),e.bi_buf=0,e.bi_valid=0,V(e)},n._tr_stored_block=ce,n._tr_flush_block=function(e,t,n,r){var o,s,c=0;0<e.level?(e.strm.data_type===2&&(e.strm.data_type=function(e){var t,n=4093624447;for(t=0;t<=31;t++,n>>>=1)if(1&n&&e.dyn_ltree[2*t]!==0)return i;if(e.dyn_ltree[18]!==0||e.dyn_ltree[20]!==0||e.dyn_ltree[26]!==0)return a;for(t=32;t<l;t++)if(e.dyn_ltree[2*t]!==0)return a;return i}(e)),ie(e,e.l_desc),ie(e,e.d_desc),c=function(e){var t;for(ae(e,e.dyn_ltree,e.l_desc.max_code),ae(e,e.dyn_dtree,e.d_desc.max_code),ie(e,e.bl_desc),t=f-1;3<=t&&e.bl_tree[2*w[t]+1]===0;t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),o=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=o&&(o=s)):o=s=n+5,n+4<=o&&t!==-1?ce(e,t,n,r):e.strategy===4||s===o?(R(e,2+ +!!r,3),re(e,T,E)):(R(e,4+ +!!r,3),function(e,t,n,r){var i;for(R(e,t-257,5),R(e,n-1,5),R(e,r-4,4),i=0;i<r;i++)R(e,e.bl_tree[2*w[i]+1],3);oe(e,e.dyn_ltree,t-1),oe(e,e.dyn_dtree,n-1)}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,c+1),re(e,e.dyn_ltree,e.dyn_dtree)),V(e),r&&H(e)},n._tr_tally=function(e,t,n){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&n,e.last_lit++,t===0?e.dyn_ltree[2*n]++:(e.matches++,t--,e.dyn_ltree[2*(O[n]+l+1)]++,e.dyn_dtree[2*I(t)]++),e.last_lit===e.lit_bufsize-1},n._tr_align=function(e){R(e,2,3),z(e,_,T),function(e){e.bi_valid===16?(L(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}(e)}},{"../utils/common":41}],53:[function(e,t,n){"use strict";t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg=``,this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,t,n){(function(e){(function(e,t){"use strict";if(!e.setImmediate){var n,r,i,a,o=1,s={},c=!1,l=e.document,u=Object.getPrototypeOf&&Object.getPrototypeOf(e);u=u&&u.setTimeout?u:e,n={}.toString.call(e.process)===`[object process]`?function(e){process.nextTick(function(){f(e)})}:function(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage(``,`*`),e.onmessage=n,t}}()?(a=`setImmediate$`+Math.random()+`$`,e.addEventListener?e.addEventListener(`message`,p,!1):e.attachEvent(`onmessage`,p),function(t){e.postMessage(a+t,`*`)}):e.MessageChannel?((i=new MessageChannel).port1.onmessage=function(e){f(e.data)},function(e){i.port2.postMessage(e)}):l&&`onreadystatechange`in l.createElement(`script`)?(r=l.documentElement,function(e){var t=l.createElement(`script`);t.onreadystatechange=function(){f(e),t.onreadystatechange=null,r.removeChild(t),t=null},r.appendChild(t)}):function(e){setTimeout(f,0,e)},u.setImmediate=function(e){typeof e!=`function`&&(e=Function(``+e));for(var t=Array(arguments.length-1),r=0;r<t.length;r++)t[r]=arguments[r+1];return s[o]={callback:e,args:t},n(o),o++},u.clearImmediate=d}function d(e){delete s[e]}function f(e){if(c)setTimeout(f,0,e);else{var n=s[e];if(n){c=!0;try{(function(e){var n=e.callback,r=e.args;switch(r.length){case 0:n();break;case 1:n(r[0]);break;case 2:n(r[0],r[1]);break;case 3:n(r[0],r[1],r[2]);break;default:n.apply(t,r)}})(n)}finally{d(e),c=!1}}}}function p(t){t.source===e&&typeof t.data==`string`&&t.data.indexOf(a)===0&&f(+t.data.slice(a.length))}})(typeof self>`u`?e===void 0?this:e:self)}).call(this,typeof global<`u`?global:typeof self<`u`?self:typeof window<`u`?window:{})},{}]},{},[10])(10)})}))());function gn(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)n.hasOwnProperty(r)&&(e[r]=n[r])}return e}function _n(e,t){return Array(t+1).join(e)}function vn(e){return e.replace(/^\n*/,``)}function yn(e){for(var t=e.length;t>0&&e[t-1]===`
`;)t--;return e.substring(0,t)}function bn(e){return yn(vn(e))}var xn=`ADDRESS.ARTICLE.ASIDE.AUDIO.BLOCKQUOTE.BODY.CANVAS.CENTER.DD.DIR.DIV.DL.DT.FIELDSET.FIGCAPTION.FIGURE.FOOTER.FORM.FRAMESET.H1.H2.H3.H4.H5.H6.HEADER.HGROUP.HR.HTML.ISINDEX.LI.MAIN.MENU.NAV.NOFRAMES.NOSCRIPT.OL.OUTPUT.P.PRE.SECTION.TABLE.TBODY.TD.TFOOT.TH.THEAD.TR.UL`.split(`.`);function Sn(e){return kn(e,xn)}var Cn=[`AREA`,`BASE`,`BR`,`COL`,`COMMAND`,`EMBED`,`HR`,`IMG`,`INPUT`,`KEYGEN`,`LINK`,`META`,`PARAM`,`SOURCE`,`TRACK`,`WBR`];function wn(e){return kn(e,Cn)}function Tn(e){return An(e,Cn)}var En=[`A`,`TABLE`,`THEAD`,`TBODY`,`TFOOT`,`TH`,`TD`,`IFRAME`,`SCRIPT`,`AUDIO`,`VIDEO`];function Dn(e){return kn(e,En)}function On(e){return An(e,En)}function kn(e,t){return t.indexOf(e.nodeName)>=0}function An(e,t){return e.getElementsByTagName&&t.some(function(t){return e.getElementsByTagName(t).length})}var J={};J.paragraph={filter:`p`,replacement:function(e){return`

`+e+`

`}},J.lineBreak={filter:`br`,replacement:function(e,t,n){return n.br+`
`}},J.heading={filter:[`h1`,`h2`,`h3`,`h4`,`h5`,`h6`],replacement:function(e,t,n){var r=Number(t.nodeName.charAt(1));if(n.headingStyle===`setext`&&r<3){var i=_n(r===1?`=`:`-`,e.length);return`

`+e+`
`+i+`

`}else return`

`+_n(`#`,r)+` `+e+`

`}},J.blockquote={filter:`blockquote`,replacement:function(e){return e=bn(e).replace(/^/gm,`> `),`

`+e+`

`}},J.list={filter:[`ul`,`ol`],replacement:function(e,t){var n=t.parentNode;return n.nodeName===`LI`&&n.lastElementChild===t?`
`+e:`

`+e+`

`}},J.listItem={filter:`li`,replacement:function(e,t,n){var r=n.bulletListMarker+`   `,i=t.parentNode;if(i.nodeName===`OL`){var a=i.getAttribute(`start`),o=Array.prototype.indexOf.call(i.children,t);r=(a?Number(a)+o:o+1)+`.  `}var s=/\n$/.test(e);return e=bn(e)+(s?`
`:``),e=e.replace(/\n/gm,`
`+` `.repeat(r.length)),r+e+(t.nextSibling?`
`:``)}},J.indentedCodeBlock={filter:function(e,t){return t.codeBlockStyle===`indented`&&e.nodeName===`PRE`&&e.firstChild&&e.firstChild.nodeName===`CODE`},replacement:function(e,t,n){return`

    `+t.firstChild.textContent.replace(/\n/g,`
    `)+`

`}},J.fencedCodeBlock={filter:function(e,t){return t.codeBlockStyle===`fenced`&&e.nodeName===`PRE`&&e.firstChild&&e.firstChild.nodeName===`CODE`},replacement:function(e,t,n){for(var r=((t.firstChild.getAttribute(`class`)||``).match(/language-(\S+)/)||[null,``])[1],i=t.firstChild.textContent,a=n.fence.charAt(0),o=3,s=RegExp(`^`+a+`{3,}`,`gm`),c;c=s.exec(i);)c[0].length>=o&&(o=c[0].length+1);var l=_n(a,o);return`

`+l+r+`
`+i.replace(/\n$/,``)+`
`+l+`

`}},J.horizontalRule={filter:`hr`,replacement:function(e,t,n){return`

`+n.hr+`

`}},J.inlineLink={filter:function(e,t){return t.linkStyle===`inlined`&&e.nodeName===`A`&&e.getAttribute(`href`)},replacement:function(e,t){var n=t.getAttribute(`href`);n&&=n.replace(/([()])/g,`\\$1`);var r=jn(t.getAttribute(`title`));return r&&=` "`+r.replace(/"/g,`\\"`)+`"`,`[`+e+`](`+n+r+`)`}},J.referenceLink={filter:function(e,t){return t.linkStyle===`referenced`&&e.nodeName===`A`&&e.getAttribute(`href`)},replacement:function(e,t,n){var r=t.getAttribute(`href`),i=jn(t.getAttribute(`title`));i&&=` "`+i+`"`;var a,o;switch(n.linkReferenceStyle){case`collapsed`:a=`[`+e+`][]`,o=`[`+e+`]: `+r+i;break;case`shortcut`:a=`[`+e+`]`,o=`[`+e+`]: `+r+i;break;default:var s=this.references.length+1;a=`[`+e+`][`+s+`]`,o=`[`+s+`]: `+r+i}return this.references.push(o),a},references:[],append:function(e){var t=``;return this.references.length&&(t=`

`+this.references.join(`
`)+`

`,this.references=[]),t}},J.emphasis={filter:[`em`,`i`],replacement:function(e,t,n){return e.trim()?n.emDelimiter+e+n.emDelimiter:``}},J.strong={filter:[`strong`,`b`],replacement:function(e,t,n){return e.trim()?n.strongDelimiter+e+n.strongDelimiter:``}},J.code={filter:function(e){var t=e.previousSibling||e.nextSibling,n=e.parentNode.nodeName===`PRE`&&!t;return e.nodeName===`CODE`&&!n},replacement:function(e){if(!e)return``;e=e.replace(/\r?\n|\r/g,` `);for(var t=/^`|^ .*?[^ ].* $|`$/.test(e)?` `:``,n="`",r=e.match(/`+/gm)||[];r.indexOf(n)!==-1;)n+="`";return n+t+e+t+n}},J.image={filter:`img`,replacement:function(e,t){var n=jn(t.getAttribute(`alt`)),r=t.getAttribute(`src`)||``,i=jn(t.getAttribute(`title`)),a=i?` "`+i+`"`:``;return r?`![`+n+`](`+r+a+`)`:``}};function jn(e){return e?e.replace(/(\n+\s*)+/g,`
`):``}function Mn(e){for(var t in this.options=e,this._keep=[],this._remove=[],this.blankRule={replacement:e.blankReplacement},this.keepReplacement=e.keepReplacement,this.defaultRule={replacement:e.defaultReplacement},this.array=[],e.rules)this.array.push(e.rules[t])}Mn.prototype={add:function(e,t){this.array.unshift(t)},keep:function(e){this._keep.unshift({filter:e,replacement:this.keepReplacement})},remove:function(e){this._remove.unshift({filter:e,replacement:function(){return``}})},forNode:function(e){if(e.isBlank)return this.blankRule;var t;return(t=Nn(this.array,e,this.options))||(t=Nn(this._keep,e,this.options))||(t=Nn(this._remove,e,this.options))?t:this.defaultRule},forEach:function(e){for(var t=0;t<this.array.length;t++)e(this.array[t],t)}};function Nn(e,t,n){for(var r=0;r<e.length;r++){var i=e[r];if(Pn(i,t,n))return i}}function Pn(e,t,n){var r=e.filter;if(typeof r==`string`){if(r===t.nodeName.toLowerCase())return!0}else if(Array.isArray(r)){if(r.indexOf(t.nodeName.toLowerCase())>-1)return!0}else if(typeof r==`function`){if(r.call(e,t,n))return!0}else throw TypeError("`filter` needs to be a string, array, or function")}function Fn(e){var t=e.element,n=e.isBlock,r=e.isVoid,i=e.isPre||function(e){return e.nodeName===`PRE`};if(!(!t.firstChild||i(t))){for(var a=null,o=!1,s=null,c=Ln(s,t,i);c!==t;){if(c.nodeType===3||c.nodeType===4){var l=c.data.replace(/[ \r\n\t]+/g,` `);if((!a||/ $/.test(a.data))&&!o&&l[0]===` `&&(l=l.substr(1)),!l){c=In(c);continue}c.data=l,a=c}else if(c.nodeType===1)n(c)||c.nodeName===`BR`?(a&&(a.data=a.data.replace(/ $/,``)),a=null,o=!1):r(c)||i(c)?(a=null,o=!0):a&&(o=!1);else{c=In(c);continue}var u=Ln(s,c,i);s=c,c=u}a&&(a.data=a.data.replace(/ $/,``),a.data||In(a))}}function In(e){var t=e.nextSibling||e.parentNode;return e.parentNode.removeChild(e),t}function Ln(e,t,n){return e&&e.parentNode===t||n(t)?t.nextSibling||t.parentNode:t.firstChild||t.nextSibling||t.parentNode}var Rn=typeof window<`u`?window:{};function zn(){var e=Rn.DOMParser,t=!1;try{new e().parseFromString(``,`text/html`)&&(t=!0)}catch{}return t}function Bn(){var e=function(){};return Vn()?e.prototype.parseFromString=function(e){var t=new window.ActiveXObject(`htmlfile`);return t.designMode=`on`,t.open(),t.write(e),t.close(),t}:e.prototype.parseFromString=function(e){var t=document.implementation.createHTMLDocument(``);return t.open(),t.write(e),t.close(),t},e}function Vn(){var e=!1;try{document.implementation.createHTMLDocument(``).open()}catch{Rn.ActiveXObject&&(e=!0)}return e}var Hn=zn()?Rn.DOMParser:Bn();function Un(e,t){var n=typeof e==`string`?Gn().parseFromString(`<x-turndown id="turndown-root">`+e+`</x-turndown>`,`text/html`).getElementById(`turndown-root`):e.cloneNode(!0);return Fn({element:n,isBlock:Sn,isVoid:wn,isPre:t.preformattedCode?Kn:null}),n}var Wn;function Gn(){return Wn||=new Hn,Wn}function Kn(e){return e.nodeName===`PRE`||e.nodeName===`CODE`}function qn(e,t){return e.isBlock=Sn(e),e.isCode=e.nodeName===`CODE`||e.parentNode.isCode,e.isBlank=Jn(e),e.flankingWhitespace=Yn(e,t),e}function Jn(e){return!wn(e)&&!Dn(e)&&/^\s*$/i.test(e.textContent)&&!Tn(e)&&!On(e)}function Yn(e,t){if(e.isBlock||t.preformattedCode&&e.isCode)return{leading:``,trailing:``};var n=Xn(e.textContent);return n.leadingAscii&&Zn(`left`,e,t)&&(n.leading=n.leadingNonAscii),n.trailingAscii&&Zn(`right`,e,t)&&(n.trailing=n.trailingNonAscii),{leading:n.leading,trailing:n.trailing}}function Xn(e){var t=e.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);return{leading:t[1],leadingAscii:t[2],leadingNonAscii:t[3],trailing:t[4],trailingNonAscii:t[5],trailingAscii:t[6]}}function Zn(e,t,n){var r,i,a;return e===`left`?(r=t.previousSibling,i=/ $/):(r=t.nextSibling,i=/^ /),r&&(r.nodeType===3?a=i.test(r.nodeValue):n.preformattedCode&&r.nodeName===`CODE`?a=!1:r.nodeType===1&&!Sn(r)&&(a=i.test(r.textContent))),a}var Qn=Array.prototype.reduce,$n=[[/\\/g,`\\\\`],[/\*/g,`\\*`],[/^-/g,`\\-`],[/^\+ /g,`\\+ `],[/^(=+)/g,`\\$1`],[/^(#{1,6}) /g,`\\$1 `],[/`/g,"\\`"],[/^~~~/g,`\\~~~`],[/\[/g,`\\[`],[/\]/g,`\\]`],[/^>/g,`\\>`],[/_/g,`\\_`],[/^(\d+)\. /g,`$1\\. `]];function er(e){if(!(this instanceof er))return new er(e);var t={rules:J,headingStyle:`setext`,hr:`* * *`,bulletListMarker:`*`,codeBlockStyle:`indented`,fence:"```",emDelimiter:`_`,strongDelimiter:`**`,linkStyle:`inlined`,linkReferenceStyle:`full`,br:`  `,preformattedCode:!1,blankReplacement:function(e,t){return t.isBlock?`

`:``},keepReplacement:function(e,t){return t.isBlock?`

`+t.outerHTML+`

`:t.outerHTML},defaultReplacement:function(e,t){return t.isBlock?`

`+e+`

`:e}};this.options=gn({},t,e),this.rules=new Mn(this.options)}er.prototype={turndown:function(e){if(!ar(e))throw TypeError(e+` is not a string, or an element/document/fragment node.`);if(e===``)return``;var t=tr.call(this,new Un(e,this.options));return nr.call(this,t)},use:function(e){if(Array.isArray(e))for(var t=0;t<e.length;t++)this.use(e[t]);else if(typeof e==`function`)e(this);else throw TypeError(`plugin must be a Function or an Array of Functions`);return this},addRule:function(e,t){return this.rules.add(e,t),this},keep:function(e){return this.rules.keep(e),this},remove:function(e){return this.rules.remove(e),this},escape:function(e){return $n.reduce(function(e,t){return e.replace(t[0],t[1])},e)}};function tr(e){var t=this;return Qn.call(e.childNodes,function(e,n){n=new qn(n,t.options);var r=``;return n.nodeType===3?r=n.isCode?n.nodeValue:t.escape(n.nodeValue):n.nodeType===1&&(r=rr.call(t,n)),ir(e,r)},``)}function nr(e){var t=this;return this.rules.forEach(function(n){typeof n.append==`function`&&(e=ir(e,n.append(t.options)))}),e.replace(/^[\t\r\n]+/,``).replace(/[\t\r\n\s]+$/,``)}function rr(e){var t=this.rules.forNode(e),n=tr.call(this,e),r=e.flankingWhitespace;return(r.leading||r.trailing)&&(n=n.trim()),r.leading+t.replacement(n,e,this.options)+r.trailing}function ir(e,t){var n=yn(e),r=vn(t),i=Math.max(e.length-n.length,t.length-r.length);return n+`

`.substring(0,i)+r}function ar(e){return e!=null&&(typeof e==`string`||e.nodeType&&(e.nodeType===1||e.nodeType===9||e.nodeType===11))}var or=/[\\/:*?"<>|]/g;function sr(e,t=`untitled`){return String(e||``).replace(or,``).replace(/\s+/g,` `).trim().replace(/\.+$/,``)||t}function cr(e,t,n=`untitled`){let r=sr(e,n);if(!t.has(r))return t.add(r),r;let i=2;for(;t.has(`${r} (${i})`);)i+=1;return r=`${r} (${i})`,t.add(r),r}function lr(){let e=new er({headingStyle:`atx`,bulletListMarker:`-`,codeBlockStyle:`fenced`,emDelimiter:`*`,strongDelimiter:`**`,br:`
`});return e.addRule(`stripInlineStyles`,{filter:[`span`,`font`],replacement:e=>e}),e.addRule(`hideExerciseIds`,{filter:e=>e.nodeName===`EM`&&e.classList?.contains(`hide-id-exercise-item`),replacement:()=>``}),e}function ur(e){return e?String(e).replace(/<br\s+style="[^"]*"\s*\/?>/gi,`<br>`).replace(/&nbsp;/gi,` `).replace(/\u00A0/g,` `).replace(/(<br\s*\/?>\s*){3,}/gi,`<br><br>`):``}function dr(e){return e.replace(/[ \t]+\n/g,`
`).replace(/\n{3,}/g,`

`).trim()}function fr(e,t,n){let r=ur(e);if(!r.trim())return``;try{return dr(t.turndown(r))}catch(e){return n(`HTML conversion failed, falling back to plain text:`,e),r.replace(/<[^>]+>/g,``).trim()}}function pr(e){try{let t=new URL(e).pathname.split(`.`).pop()?.toLowerCase();if(t&&/^[a-z0-9]{2,5}$/.test(t))return t}catch{}return`jpg`}async function mr(e,t,n,r,i){if(!e)return null;if(r.has(e))return r.get(e);let a=`${t||`img`}_${crypto.randomUUID().slice(0,8)}.${pr(e)}`,o=`./images/${a}`;try{let t=await fetch(e);if(!t.ok)throw Error(`HTTP ${t.status}`);let i=await t.blob();return n.file(a,i),r.set(e,o),o}catch(t){return i(`Image fetch failed for ${e}:`,t.message),r.set(e,e),e}}async function hr(e,t,n,r){let i=e.UrlFull||e.Url;return i?`![Illustration](${await mr(i,e.ImageId||e.ImageFullId,t,n,r)})`:``}async function gr(e,t){let n=[],r=e.Descriptions||[],i=e.Images||[],a=Math.max(r.length,i.length);for(let e=0;e<a;e+=1){let a=r[e];a&&a.trim()&&n.push(t.htmlToMarkdown(a)),i[e]&&n.push(await hr(i[e],t.imagesFolder,t.urlMap,t.log))}return n.filter(Boolean).join(`

`)}function _r(e,t,n){for(let r of e||[])r.Question&&t.push(n(r.Question)),r.Text&&t.push(n(r.Text))}async function vr(e,t){let n=[];switch(e.Name&&String(e.Name).trim()&&n.push(`### ${t.htmlToMarkdown(e.Name)}`),e.Type){case 27:case 2:n.push(await gr(e,t));break;case 29:if(e.Button?.Link){let r=(e.Button.Text?t.htmlToMarkdown(e.Button.Text):e.Button.Link).replace(/\n+/g,` `).trim()||`Open link`;n.push(`[${r}](${e.Button.Link})`)}break;case 10:case 13:_r(e.QuestionWithCodingTexts,n,t.htmlToMarkdown);break;case 3:for(let r of e.Videos||[]){if(!r.Link)continue;let e=(r.Text?t.htmlToMarkdown(r.Text):`Watch video`).replace(/\n+/g,` `).trim()||`Watch video`;n.push(`[${e}](${r.Link})`)}break;default:_r(e.QuestionWithCodingTexts,n,t.htmlToMarkdown);for(let r of e.Descriptions||[])r&&r.trim()&&n.push(t.htmlToMarkdown(r));if(e.Button?.Link){let r=(e.Button.Text?t.htmlToMarkdown(e.Button.Text):e.Button.Link).replace(/\n+/g,` `).trim()||`Open link`;n.push(`[${r}](${e.Button.Link})`)}for(let t of e.Videos||[])t.Link&&n.push(`[${t.Text||`Watch video`}](${t.Link})`);for(let r of e.Images||[])n.push(await hr(r,t.imagesFolder,t.urlMap,t.log));e.Text&&n.push(t.htmlToMarkdown(e.Text)),n.length===0&&t.log(`Unhandled item Type ${e.Type} (Id: ${e.Id})`);break}for(let t of e.Pdfs||[]){let e=t.Url||t.Link;e&&n.push(`[${t.Name||t.Text||`PDF document`}](${e})`)}return n.filter(Boolean).join(`

`)}function yr(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n)}async function br(e,t={}){let n=t.log||(()=>{});if(!e||!Array.isArray(e.lessons))throw Error(`Invalid backup data: expected an object with a lessons array.`);n(`Starting marathon workspace compilation...`);let r=new hn.default,i=lr(),a=`marathon_${e.marathonId||`export`}`,o=r.folder(a),s=`edvibe_marathon_${e.marathonId||`export`}_backup.json`;o.file(s,JSON.stringify(e,null,2));let c=new Set,l=e.lessons.length;for(let[r,a]of e.lessons.entries()){t.onProgress?.({message:`Processing lesson ${r+1} of ${l}: ${a.name}`,current:r+1,total:l});let e=cr(a.name,c,`lesson_${a.lessonId}`),s=o.folder(e),u=s.folder(`images`),d=new Set,f={turndown:i,imagesFolder:u,urlMap:new Map,log:n,htmlToMarkdown:e=>fr(e,i,n)};a.imageUrl&&await mr(a.imageUrl,`lesson_${a.lessonId}`,u,f.urlMap,n);for(let[e,t]of(a.sections||[]).entries()){let n=`${cr(`${e+1} - ${t.name}`,d,`section_${t.sectionId}`)}.md`,r=[`# ${t.name}`];t.isHomework&&r.push(`> Homework section`),r.push(``);for(let e of t.items||[]){if(e.IsHideExercise)continue;let t=await vr(e,f);t&&(r.push(t),r.push(`---`))}for(;r.length&&r[r.length-1]===`---`;)r.pop();r.length<=2&&r.push(`_No content in this section._`),s.file(n,`${r.join(`

`).trim()}\n`)}}o.file(`_export_meta.json`,JSON.stringify({exportedAt:e.exportedAt,marathonId:e.marathonId,totalLessons:e.totalLessons,compiledAt:new Date().toISOString()},null,2)),t.onProgress?.({message:`Compressing archive...`});let u=await r.generateAsync({type:`blob`,compression:`DEFLATE`,compressionOptions:{level:6}}),d=`edvibe_marathon_${e.marathonId||`export`}_workspace.zip`;return yr(u,d),n(`Marathon workspace archive downloaded:`,d),u}function xr(e){let t=String(e||``).match(/marathon\/(\d+)/);return t?Number(t[1]):null}function Sr(){document.querySelector(Ne)?.remove();let e=document.createElement(Ne);return(document.body||document.documentElement).appendChild(e),e}function Cr({sendRequest:e,wait:t,canStart:n,onActiveChange:r,compileToZip:i=br,notifyStatus:a,createProgressOverlay:o=Sr,getCurrentUrl:s=()=>window.location.href,now:c=()=>new Date().toISOString(),log:l=()=>{}}){async function u(){if(!n()){let e=`Cannot start export while another operation is active.`;l(e),a(`error`,e);return}r(!0);let u=null;try{a(`started`),l(`Starting marathon export...`),u=o(),u.setProgress({statusText:`Finding marathon lessons...`,loadedSections:0,totalSections:0});let n=xr(s());if(!n){u.error(`Failed to find a valid MarathonId in the current page URL.`),a(`error`,`Invalid marathon URL.`);return}let r={exportedAt:c(),marathonId:n,totalLessons:0,lessons:[]},d=(await e(`MarathonLessonWsController`,`GetMarathonLessonsPagination`,`Marathons`,{MarathonId:n,SearchTerm:``,Page:{Skip:0,Take:100}})).Value?.Items||[];r.totalLessons=d.length,u.setProgress({statusText:`Found ${d.length} lessons. Loading lesson sections...`,loadedSections:0,totalSections:0});let f=[],p=0;for(let[t,n]of d.entries()){u.setProgress({statusText:`Loading sections for lesson ${t+1} of ${d.length}: ${n.Name}`,loadedSections:0,totalSections:0});let r=await e(`LessonWsController`,`GetLessonWithId`,`Books`,{LessonId:n.LessonId}),i=[...r.Value?.Sections||[]];r.Value?.HomeworkSection&&i.push(r.Value.HomeworkSection),p+=i.length,f.push({lessonNode:n,lessonStructure:r,sections:i})}u.setProgress({statusText:`Found ${p} sections. Loading exercise assets...`,loadedSections:0,totalSections:p});let m=0;for(let{lessonNode:n,lessonStructure:i,sections:a}of f){let o={lessonId:n.LessonId,marathonLessonId:n.MarathonLessonId,name:n.Name,imageUrl:i.Value?.ImageUrl||n.Image,sections:[]};for(let r of a){u.setProgress({statusText:`Lesson: ${n.Name}\nSection: ${r.Name}`,loadedSections:m,totalSections:p}),await t(300);let i=await e(`GetExerciseWsController`,`LoadExercises`,`Exercises`,{IsTeacher:!0,SectionId:r.Id,LessonId:n.LessonId,LessonSection:0}),a=typeof i.Value==`string`?JSON.parse(i.Value):i.Value;o.sections.push({sectionId:r.Id,name:r.Name,isHomework:r.IsHomework||!1,items:a?.Items||[]}),m+=1,u.setProgress({statusText:`Loaded "${r.Name}" from "${n.Name}".`,loadedSections:m,totalSections:p})}r.lessons.push(o)}u.setProgress({statusText:`All sections loaded.
Processing lesson content and archiving workspace...
Downloading images — this may take a few minutes.`,loadedSections:0,totalSections:0}),await i(r,{onProgress({message:e,current:t,total:n}){let r=e===`Compressing archive...`;u.setProgress({statusText:r?`Processing lesson content and archiving workspace...
Compressing archive...`:`Processing lesson content and archiving workspace...\n${e}`,loadedSections:r?0:t||0,totalSections:r?0:n||0,countText:r?`Compressing archive...`:n?`${t} / ${n} lessons processed`:`Preparing archive...`})}}),u.complete(`ZIP workspace archive downloaded successfully.`,p),u.dismissAfter(3e3),a(`complete`)}catch(e){l(`Export workflow failed:`,e),u?.error(`Export failed: ${e.message}`),a(`error`,e.message)}finally{r(!1)}}return{start:u}}var wr=`edvibe-toolbox-reset-dialog`,Tr=`edvibe-toolbox-reset-overlay`;function Er(e){let t=String(e||``).match(/marathon\/(\d+)/);return t?Number(t[1]):null}function Dr(e){let t=Array.isArray(e?.Sections)?e.Sections.filter(Boolean):[];return e?.HomeworkSection&&t.push(e.HomeworkSection),t}function Or(e){let t=e?.LastRequest?.Status;return!!(e?.LastRequest?.Id&&Number.isFinite(t)&&t!==0)}function kr({marathonId:e,pupilId:t,marathonLessonId:n,sectionId:r}){return{MarathonId:e,LessonId:n,SectionId:r,PupilId:t,IsTeacher:!0,LessonSection:0,Domain:`edvibe.com`}}function Ar({marathonId:e,pupilId:t,lessonId:n,exercise:r}){return{SelfSync:!1,IsReset:!0,ExerciseId:r.id,ExerciseType:r.type,SectionId:r.sectionId,PupilId:t,MarathonId:e,SingleAnswer:{},ManyAnswers:[],RepeatingManyAnswers:[],AnswerErrorsCount:[[]],StatisticsInfo:{CountAnswersTrue:0,CountAnswersFalse:0,CountAnswersPending:0},LessonId:n}}function jr(e,t,n=50){let r=[],i=null,a=null;function o(){return{pupils:[...r],total:i,hasMore:i===null||r.length<i}}async function s(){if(i!==null&&r.length>=i)return o();let a=await e(`MarathonPupilsWsController`,`GetMarathonPupils`,`Marathons`,{MarathonId:t,Skip:r.length,Take:n}),s=a.Value?.Items,c=a.Value?.Page?.Count;if(!Array.isArray(s)||typeof c!=`number`||!Number.isInteger(c)||c<0)throw Error(`GetMarathonPupils returned an invalid response.`);if(s.length===0&&r.length<c)throw Error(`GetMarathonPupils pagination stopped before all pupils were loaded.`);return r=r.concat(s),i=c,o()}return{loadNext(){return a||(a=s().finally(()=>{a=null}),a)},getSnapshot:o}}async function Mr({sendRequest:e,wait:t,marathonId:n,pupilId:r,lessons:i,onDiscovery:a=()=>{},log:o=()=>{}}){let s=[];for(let c of i){o(`Discovering lesson ${c.MarathonLessonId} (LessonId: ${c.LessonId}).`),a(`Loading sections for "${c.Name}"...`);let i=Dr((await e(`LessonWsController`,`GetLessonWithId`,`Books`,{LessonId:c.LessonId})).Value),l=[];o(`Lesson ${c.MarathonLessonId}: ${i.length} section(s) found.`);for(let a of i){await t(300);let i=(await e(`GetExerciseWsController`,`LoadExercises`,`Exercises`,kr({marathonId:n,pupilId:r,marathonLessonId:c.MarathonLessonId,sectionId:a.Id}))).Value?.Items;if(!Array.isArray(i))throw Error(`LoadExercises returned invalid data for "${c.Name}".`);let s=i.filter(e=>Number.isFinite(e.Id)&&Array.isArray(e.AnswerVersion1)&&e.AnswerVersion1.length>0);l.push(...s.map(e=>({id:e.Id,type:e.Type,sectionId:a.Id}))),o(`Lesson ${c.MarathonLessonId}, section ${a.Id}: ${s.length} of ${i.length} exercise(s) have saved answers.`)}s.push({lesson:c,exercises:l,deleteRequestId:Or(c)?c.LastRequest.Id:null}),o(`Lesson ${c.MarathonLessonId}: ${l.length} exercise reset(s), ${Or(c)?`request deletion required`:`no request deletion`}.`)}return s}async function Nr({sendRequest:e,sendWithoutResponse:t,wait:n,marathonId:r,pupilId:i,work:a,onProgress:o,log:s=()=>{}}){let c=a.reduce((e,t)=>e+t.exercises.length,0),l=0;s(`Starting ${c} operation(s) for PupilId ${i} across ${a.length} lesson(s).`);for(let u of a){for(let t of u.exercises){try{if(s(`Resetting exercise ${t.id} for lesson ${u.lesson.MarathonLessonId} (${l+1}/${c}).`),await n(300),await e(`ExerciseAnswerSaveVersion1WsController`,`SaveAnswer`,`ExerciseAnswer`,Ar({marathonId:r,pupilId:i,lessonId:u.lesson.LessonId,exercise:t})),(await e(`MarathonStatisticService`,`DropMarathonExerciseStatistic`,`Statistic`,{MarathondId:r,PupilId:i,ExerciseId:t.id})).Value!==!0)throw Error(`server did not confirm the reset`)}catch(e){throw Error(`Failed in "${u.lesson.Name}", exercise ${t.id}: ${e.message}`,{cause:e})}l+=1,o({completed:l,total:c,lesson:u.lesson,exerciseId:t.id})}u.deleteRequestId&&t(`MarathonLessonWsController`,`DeleteMarathonLessonRequestPupil`,`Marathons`,{RequestId:u.deleteRequestId})}s(`Completed all ${c} operation(s) for PupilId ${i}.`)}function Pr(e){return typeof e?.name==`string`?e.name:`Error`}function Fr({sendRequest:e,sendWithoutResponse:t,wait:n,canStart:r,onActiveChange:i,createDialog:a=()=>document.createElement(wr),log:o=()=>{}}){let s=!1,c=!1;function l(){c&&(c=!1,i(!1))}async function u(){if(document.getElementById(Tr))return;if(!r()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}let u=Er(window.location.href);if(!u){window.alert(`Open an Edvibe marathon page before resetting lessons.`);return}c=!0,i(!0);let d=a();d.addEventListener(`edvibe-dialog-close`,l),d.addEventListener(`edvibe-reset-request`,async r=>{let{pupil:i,lessons:a}=r.detail;if(!window.confirm(`Reset ${a.length} lesson(s) for ${i.Email}?`))return;s=!0,d.lock();let c=!1;try{d.showDiscovery(`Discovering exercises...`);let r=await Mr({sendRequest:e,wait:n,marathonId:u,pupilId:i.PupilId,lessons:a,onDiscovery:e=>d.showDiscovery(e),log:o});await Nr({sendRequest:e,sendWithoutResponse:t,wait:n,marathonId:u,pupilId:i.PupilId,work:r,onProgress:e=>d.showProgress(e),log:o}),d.showComplete(`Selected lesson progress was reset successfully.`),c=!0}catch(e){let t=a.map(e=>e.MarathonLessonId).join(`, `);o(`Reset stopped for PupilId ${i.PupilId}; MarathonLessonIds: ${t} (${Pr(e)}).`),d.showError(e.message)}finally{s=!1,c?d.completeRun():d.unlockAfterRun()}});try{let t=jr(e,u);d.configure({loadNextPupils:()=>t.loadNext(),loadLessons:async t=>{o(`Loading lessons for PupilId ${t.PupilId}.`);let n=await e(`MarathonLessonWsController`,`GetMarathonLessonsForPupil`,`Marathons`,{PupilId:t.PupilId,MarathonId:u,SearchTerm:``,Domain:`edvibe.com`});if(!Array.isArray(n.Value))throw Error(`GetMarathonLessonsForPupil returned invalid data.`);return o(`Loaded ${n.Value.length} lesson(s) for PupilId ${t.PupilId}.`),n.Value},log:o}),(document.body||document.documentElement).appendChild(d),d.setLoading(`Loading marathon pupils...`);let n=await t.loadNext();o(`Loaded ${n.pupils.length} of ${n.total} pupil(s) for MarathonId ${u}.`),d.showPupils({pupils:n.pupils,total:n.total})}catch(e){if(o(`Failed to initialize reset workflow for MarathonId ${u} (${Pr(e)}).`),typeof d.showError==`function`)d.showError(e.message);else throw l(),e}}return{open:u,isRunning:()=>s}}var Ir=Object.freeze({maxFrames:1e3,maxStoredBytes:5*1024*1024,maxDurationMs:600*1e3}),Lr=`[REDACTED_BY_TOOLBOX]`,Rr=new Set([`authorization`,`accesstoken`,`refreshtoken`,`token`,`cookie`,`password`,`secret`]);function zr(e){if(typeof e!=`string`)return{parsed:!1,value:e};try{return{parsed:!0,value:JSON.parse(e)}}catch{return{parsed:!1,value:e}}}function Br(e,t=``,n=[]){if(Array.isArray(e))return e.map((e,r)=>Br(e,`${t}[${r}]`,n));if(!e||typeof e!=`object`)return e;let r={};for(let[i,a]of Object.entries(e)){let e=t?`${t}.${i}`:i;Rr.has(i.toLowerCase())?(r[i]=Lr,n.push(e)):r[i]=Br(a,e,n)}return r}function Vr(e,t){let n=zr(e);if(!n.parsed||!n.value||typeof n.value!=`object`)return{parsed:!1,value:e};let r={...n.value},i=zr(r.Value);return i.parsed&&(r.Value=i.value),{parsed:!0,value:Br(r,``,t)}}function Hr(e,t){let n={};for(let[r,i]of Object.entries(e))t.has(r)||(n[r]=i);return Object.keys(n).length>0?n:void 0}function Ur(e,t){return`${e}:${String(t)}`}function Wr(e){let t=String(e?.pathname||``),n=t.match(/\/marathon\/(\d+)(?:\/|$)/);return{origin:String(e?.origin||``),pathname:t,marathonId:n?Number(n[1]):null}}function Gr(e){return e.replace(/[:.]/g,`-`)}function Kr(e){let t=JSON.stringify(e.requestValue===void 0?null:e.requestValue,null,4);return[`await sendRequest(`,`    ${JSON.stringify(e.controller||``)},`,`    ${JSON.stringify(e.method||``)},`,`    ${JSON.stringify(e.projectName||``)},`,t.split(`
`).map(e=>`    ${e}`).join(`
`),`);`].join(`
`)}function qr(e){let t=e.filter(e=>e.origin===`page`),n=[`// Recorded from Edvibe UI. Review IDs, ordering, and mutation effects before use.`,`// This code is intentionally not executable by the recorder.`,``];return t.forEach((e,r)=>{if(r>0){let i=t[r-1],a=e.startedAfterMs-i.startedAfterMs;a>=250&&n.push(`await wait(${Math.round(a)});`,``)}n.push(Kr(e),``)}),n.join(`
`).trimEnd()}function Jr(e,t){let n=new Blob([t],{type:`application/json;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(r)}function Yr({subscribeFrames:e,createPanel:t,getPageContext:n=()=>Wr(window.location),downloadText:r=Jr,copyText:i=e=>navigator.clipboard.writeText(e),createId:a=()=>crypto.randomUUID(),now:o=Date.now,setTimeoutFn:s=setTimeout,clearTimeoutFn:c=clearTimeout,limits:l=Ir,log:u=()=>{}}){if(typeof e!=`function`)throw Error(`Action recorder requires a frame subscription.`);if(typeof t!=`function`)throw Error(`Action recorder requires a panel factory.`);let d={...Ir,...l},f=`idle`,p=null,m=new Map,h=null,g=null,_=``,v=``;function y(){return{status:f,session:p,copyFallback:_,notice:v,limits:d}}function b(){g?.setState?.(y())}function x(e,t=``){f===`recording`&&(c(h),h=null,f=e,p.stoppedAt=new Date(o()).toISOString(),t&&(p.limits.limitReached=!0,p.limits.reason=t,v=`Recording stopped: ${t}.`),b())}function S(){if(f===`recording`)return;let e=o();f=`recording`,_=``,v=``,m=new Map,p={schemaVersion:1,sessionId:a(),startedAt:new Date(e).toISOString(),stoppedAt:null,page:n(),limits:{maxFrames:d.maxFrames,maxStoredBytes:d.maxStoredBytes,maxDurationMs:d.maxDurationMs,limitReached:!1},frameCount:0,storedBytes:0,operations:[],otherFrames:[],anomalies:[],redactions:[],_startedAtMs:e},h=s(()=>{x(`limit-reached`,`duration limit reached`)},d.maxDurationMs),b()}function C(){x(`stopped`)}function w(){f===`recording`&&(c(h),h=null),f=`idle`,p=null,m=new Map,_=``,v=``,b()}function T(e){return p.frameCount+1>d.maxFrames?`frame limit reached`:p.storedBytes+(e.dataType===`text`?Number(e.byteLength||0):0)>d.maxStoredBytes?`size limit reached`:``}function E(e,t,n){let r={sequence:p.frameCount,direction:e.direction,socketId:e.socketId,origin:e.origin,capturedAfterMs:e.capturedAt-p._startedAtMs,dataType:e.dataType,byteLength:e.byteLength};t!==void 0&&(r.envelope=t),n!==void 0&&(r.rawText=n),p.otherFrames.push(r)}function D(e,t){let n=t.RequestId;if(!(n!==void 0&&(t.Controller!==void 0||t.Method!==void 0||t.ProjectName!==void 0))){E(e,t);return}let r=Ur(e.socketId,n);if(m.has(r)){p.anomalies.push({type:`duplicate-outbound-request`,socketId:e.socketId,requestId:n}),E(e,t);return}let i={sequence:p.operations.length+1,socketId:e.socketId,origin:e.origin,requestId:n,startedAfterMs:e.capturedAt-p._startedAtMs,durationMs:null,controller:t.Controller||``,method:t.Method||``,projectName:t.ProjectName||``,requestValue:t.Value,response:null,extra:Hr(t,new Set([`Controller`,`Method`,`ProjectName`,`RequestId`,`Value`])),_capturedAt:e.capturedAt};p.operations.push(i),m.set(r,i)}function O(e,t){let n=t.RequestId,r=n===void 0?``:Ur(e.socketId,n),i=m.get(r);if(!i){E(e,t);return}i.durationMs=Math.max(0,e.capturedAt-i._capturedAt),i.response={isSuccess:typeof t.IsSuccess==`boolean`?t.IsSuccess:null,errorCode:t.ErrorCode??null,value:t.Value,extra:Hr(t,new Set([`RequestId`,`IsSuccess`,`ErrorCode`,`Value`]))},m.delete(r)}function k(e){if(f!==`recording`||!p)return;let t=T(e);if(t){x(`limit-reached`,t);return}if(p.frameCount+=1,e.dataType===`text`&&(p.storedBytes+=Number(e.byteLength||0)),e.dataType!==`text`){E(e),b();return}let n=[],r=Vr(e.data,n);p.redactions.push(...n.map(e=>({frame:p.frameCount,path:e}))),r.parsed?e.direction===`outbound`?D(e,r.value):O(e,r.value):E(e,void 0,r.value),b()}function A(){return p?{schemaVersion:p.schemaVersion,sessionId:p.sessionId,startedAt:p.startedAt,stoppedAt:p.stoppedAt,page:p.page,limits:p.limits,frameCount:p.frameCount,storedBytes:p.storedBytes,operations:p.operations.map(e=>{let{_capturedAt:t,...n}=e;return n}),otherFrames:p.otherFrames,anomalies:p.anomalies,redactions:p.redactions}:null}function j(){let e=A();if(!e)return;let t=`edvibe-ws-recording-${Gr(e.startedAt)}.json`;r(t,JSON.stringify(e,null,2)),v=`Saved ${t}.`,b()}async function M(e){_=``;try{await i(e),v=`Copied to clipboard.`}catch(t){u(`Clipboard copy failed:`,t),_=e,v=`Clipboard unavailable. Copy the text below.`}b()}function N(e){let t=p?.operations.find(t=>t.sequence===e);return t?M(Kr(t)):Promise.resolve()}function P(){return p?M(qr(p.operations)):Promise.resolve()}function F(){g?.remove?.(),g=null}function I(){g?(g.configure?.(),g.restore?.()):(g=t(),g.configure?.({onStart:S,onStop:C,onClear:w,onExport:j,onCopyRequest:N,onCopyRecipe:P,onClose:F}),g.mount?.()),b()}return e(k),{open:I,start:S,stop:C,clear:w,exportJson:j,copyRequest:N,copyRecipe:P,buildExport:A,getState:y}}var Xr=g`
:host {
    color: #172033;
    font: 13px/1.45 Inter, "Segoe UI", system-ui, sans-serif;
}

* {
    box-sizing: border-box;
}

button,
textarea,
input {
    font: inherit;
}

.recorder-overlay {
    position: fixed;
    z-index: 2147483646;
    inset: 0;
    padding: 28px;
    background: rgba(19, 27, 45, 0.52);
}

.recorder-overlay[hidden],
.recorder-indicator[hidden] {
    display: none;
}

.recorder-panel {
    display: flex;
    width: min(920px, 100%);
    max-height: calc(100vh - 56px);
    margin: 0 auto;
    overflow: hidden;
    flex-direction: column;
    border: 1px solid #dce2ec;
    border-radius: 14px;
    background: #f5f7fb;
    box-shadow: 0 24px 70px rgba(15, 23, 42, 0.3);
}

.recorder-header,
.recorder-toolbar {
    display: flex;
    gap: 18px;
    justify-content: space-between;
    align-items: center;
    padding: 16px 18px;
    border-bottom: 1px solid #e0e5ee;
    background: #fff;
}

.recorder-header h2,
.recorder-header p,
.recorder-body h3,
.recorder-notice {
    margin: 0;
}

.recorder-header h2 {
    font-size: 17px;
}

.recorder-subtitle {
    margin-top: 3px !important;
    color: #687386;
    font-size: 12px;
}

.header-actions,
.toolbar-actions,
.recorder-state,
.recorder-summary {
    display: flex;
    gap: 8px;
    align-items: center;
}

.icon-button {
    width: 31px;
    height: 31px;
    border: 1px solid #d9dfe9;
    border-radius: 7px;
    color: #4e596b;
    background: #fff;
    cursor: pointer;
}

.recorder-toolbar {
    padding-block: 11px;
    background: #fbfcfe;
}

.state-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #9da5b4;
}

.recorder-state[data-status="recording"] .state-dot {
    background: #df3636;
    box-shadow: 0 0 0 4px #fde4e4;
}

.recorder-state[data-status="limit-reached"] .state-dot {
    background: #d58a14;
}

.elapsed {
    min-width: 34px;
    color: #687386;
    font-variant-numeric: tabular-nums;
}

.button {
    padding: 7px 10px;
    border: 1px solid #d5dbe6;
    border-radius: 7px;
    color: #263248;
    background: #fff;
    cursor: pointer;
}

.button.primary {
    border-color: #4055d3;
    color: #fff;
    background: #4055d3;
}

.button.danger {
    border-color: #c93a3a;
    color: #fff;
    background: #c93a3a;
}

.button:disabled {
    color: #9299a7;
    background: #edf0f4;
    cursor: not-allowed;
}

.recorder-body {
    overflow: auto;
    padding: 16px 18px 20px;
}

.privacy-warning {
    padding: 10px 12px;
    border: 1px solid #ecd292;
    border-radius: 8px;
    color: #765313;
    background: #fff8e6;
}

.recorder-summary {
    margin: 13px 0;
    flex-wrap: wrap;
    color: #596579;
}

.recorder-summary > span {
    padding-right: 10px;
    border-right: 1px solid #d9dfe8;
}

.recorder-summary label {
    margin-left: auto;
}

.recorder-notice {
    margin-bottom: 12px;
    padding: 9px 10px;
    border-radius: 7px;
    color: #34503e;
    background: #e6f4eb;
}

.recorder-body h3 {
    margin-bottom: 8px;
    font-size: 13px;
}

.operation-list {
    display: grid;
    gap: 7px;
}

.operation {
    border: 1px solid #dbe1eb;
    border-radius: 9px;
    background: #fff;
}

.operation > summary {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr) 76px 92px;
    gap: 9px;
    align-items: center;
    padding: 11px 12px;
    cursor: pointer;
}

.operation-sequence,
.operation-duration {
    color: #778195;
    font-variant-numeric: tabular-nums;
}

.operation-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.operation-result {
    text-align: right;
    color: #28805a;
}

.operation-result.is-error {
    color: #b42f2f;
}

.operation-content {
    padding: 0 12px 12px;
    border-top: 1px solid #e6eaf1;
}

.operation-content > p {
    color: #697487;
    word-break: break-all;
}

.operation-content strong {
    display: block;
    margin: 10px 0 4px;
}

pre,
textarea {
    width: 100%;
    overflow: auto;
    padding: 10px;
    border: 1px solid #dce2eb;
    border-radius: 7px;
    color: #233048;
    background: #f7f9fc;
    font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
    white-space: pre-wrap;
    word-break: break-word;
}

.empty-operations {
    padding: 28px;
    border: 1px dashed #ccd3df;
    border-radius: 9px;
    color: #788397;
    text-align: center;
    background: #fafbfc;
}

.empty-operations[hidden],
.copy-fallback[hidden],
.recorder-notice[hidden] {
    display: none;
}

.other-section {
    margin-top: 14px;
}

.other-section > summary {
    color: #596579;
    cursor: pointer;
}

.copy-fallback {
    display: block;
    margin-top: 14px;
    color: #765313;
}

.copy-fallback textarea {
    min-height: 150px;
    margin-top: 5px;
}

.recorder-indicator {
    position: fixed;
    z-index: 2147483646;
    right: 20px;
    bottom: 20px;
    display: flex;
    gap: 7px;
    align-items: center;
    padding: 9px 12px;
    border: 1px solid #ccd3df;
    border-radius: 999px;
    color: #38445a;
    background: #fff;
    box-shadow: 0 8px 28px rgba(23, 32, 51, 0.2);
    cursor: pointer;
}

.recorder-indicator > span:first-child {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #9da5b4;
}

.recorder-indicator.is-recording > span:first-child {
    background: #df3636;
    box-shadow: 0 0 0 3px #fde4e4;
}

@media (max-width: 720px) {
    .recorder-overlay {
        padding: 8px;
    }

    .recorder-header,
    .recorder-toolbar {
        align-items: flex-start;
    }

    .recorder-toolbar,
    .toolbar-actions {
        flex-wrap: wrap;
    }

    .operation > summary {
        grid-template-columns: 28px minmax(0, 1fr);
    }

    .operation-duration,
    .operation-result {
        text-align: left;
    }
}

`,Zr=`edvibe-toolbox-action-recorder`,Qr=`edvibe-toolbox-action-recorder`,$r=class extends G{static styles=[Ae,je,Xr];static properties={state:{state:!0},minimized:{state:!0},showToolbox:{state:!0},elapsedLabel:{state:!0}};constructor(){super(),this.callbacks={},this.state={status:`idle`,session:null},this.minimized=!1,this.showToolbox=!1,this.elapsedLabel=``,this.elapsedTimer=null}connectedCallback(){super.connectedCallback(),this.id||=Qr,this.syncElapsedTimer()}disconnectedCallback(){this.stopElapsedTimer(),super.disconnectedCallback()}configure(e={}){e=e&&typeof e==`object`?e:{};for(let t of[`onStart`,`onStop`,`onClear`,`onExport`,`onCopyRequest`,`onCopyRecipe`,`onClose`])typeof e[t]==`function`&&(this.callbacks[t]=e[t]);return this}mount(){!this.isConnected&&globalThis.document?.body&&globalThis.document.body.appendChild(this)}restore(){this.minimized=!1}setState(e){return this.state=e&&typeof e==`object`?e:{status:`idle`,session:null},this.elapsedLabel=this.calculateElapsed(),this.syncElapsedTimer(),this}confirm(e){return globalThis.confirm(e)}handleStart(){this.state.session&&!this.confirm(`Удалить предыдущую запись и начать новую?`)||this.callbacks.onStart?.()}handleClear(){(!this.state.session||this.confirm(`Удалить текущую запись?`))&&this.callbacks.onClear?.()}handleClose(){if(this.state.status===`recording`){this.minimized=!0;return}this.callbacks.onClose?.()}formatBytes(e){return e<1024?`${e} Б`:e<1024*1024?`${(e/1024).toFixed(1)} КиБ`:`${(e/1024/1024).toFixed(1)} МиБ`}operationStatus(e){return e.response?e.response.isSuccess===!0?`Успешно`:e.response.isSuccess===!1?`Ошибка`:`Ответ получен`:`Ожидается`}visibleOperations(){return(this.state.session?.operations||[]).filter(e=>this.showToolbox||e.origin===`page`)}calculateElapsed(){let e=this.state.session?.startedAt;if(!e)return``;let t=Date.parse(e);if(Number.isNaN(t))return``;let n=this.state.session.stoppedAt?Date.parse(this.state.session.stoppedAt):Date.now(),r=Math.max(0,Math.floor((n-t)/1e3));return`${Math.floor(r/60)}:${String(r%60).padStart(2,`0`)}`}syncElapsedTimer(){this.stopElapsedTimer(),!(this.state.status!==`recording`||!this.isConnected)&&(this.elapsedTimer=globalThis.setInterval(()=>{this.elapsedLabel=this.calculateElapsed()},1e3))}stopElapsedTimer(){this.elapsedTimer!==null&&(globalThis.clearInterval(this.elapsedTimer),this.elapsedTimer=null)}renderJsonBlock(e,t){return U`<div><strong>${e}</strong><pre>${JSON.stringify(t,null,2)}</pre></div>`}renderOperation(e){let t=`operation-result is-${e.response?.isSuccess===!1?`error`:`normal`}`;return U`
            <details class="operation">
                <summary>
                    <span class="operation-sequence">${String(e.sequence).padStart(2,`0`)}</span>
                    <strong class="operation-name">${e.controller}.${e.method}</strong>
                    <span class="operation-duration">${e.durationMs===null?`—`:`${e.durationMs} мс`}</span>
                    <span class=${t}>${this.operationStatus(e)}</span>
                </summary>
                <div class="operation-content">
                    <p>${[`Project: ${e.projectName||`—`}`,`RequestId: ${e.requestId}`,`Origin: ${e.origin}`].join(` · `)}</p>
                    ${this.renderJsonBlock(`Запрос Value`,e.requestValue)}
                    ${this.renderJsonBlock(`Ответ`,e.response)}
                    <button type="button" class="button copy-request"
                        @click=${()=>this.callbacks.onCopyRequest?.(e.sequence)}>
                        Копировать запрос
                    </button>
                </div>
            </details>
        `}render(){let e=this.state.status===`recording`,t=!!this.state.session,n=this.state.session?.operations||[],r=this.visibleOperations(),i=this.state.session?.otherFrames||[],a={idle:`Готово к записи`,recording:`Идёт запись`,stopped:`Запись остановлена`,"limit-reached":`Достигнут лимит`},o=`recorder-indicator${e?` is-recording`:``}`,s=String(this.state.copyFallback||``);return U`
            <button class=${o} type="button" ?hidden=${!this.minimized}
                aria-label="Открыть запись WebSocket" title="Открыть запись WebSocket" @click=${()=>this.restore()}>
                <span></span><strong>REC</strong>
                <span class="indicator-count">${r.length}</span>
            </button>
            <div class="recorder-overlay" ?hidden=${this.minimized}>
                <section class="recorder-panel" role="dialog" aria-labelledby="recorder-title">
                    <header class="recorder-header">
                        <div>
                            <h2 id="recorder-title">Запись действий WebSocket</h2>
                            <p class="recorder-subtitle">Выполните одно действие в Edvibe и изучите обмен сообщениями.</p>
                        </div>
                        <div class="header-actions">
                            <button class="icon-button recorder-minimize" type="button" aria-label="Свернуть" @click=${()=>{this.minimized=!0}}>
                                -
                            </button>
                            <button class="icon-button recorder-close" type="button" aria-label="Закрыть" @click=${()=>this.handleClose()}>
                                &times;
                            </button>
                        </div>
                    </header>
                    <div class="recorder-toolbar">
                        <div class="recorder-state" data-status=${this.state.status}>
                            <span class="state-dot"></span>
                            <strong class="state-label">${a[this.state.status]||a.idle}</strong>
                            <span class="elapsed">${this.elapsedLabel}</span>
                        </div>
                        <div class="toolbar-actions">
                            <button class="button primary recorder-start" type="button" ?hidden=${e} @click=${()=>this.handleStart()}>
                                Начать запись
                            </button>
                            <button class="button danger recorder-stop" type="button" ?hidden=${!e} @click=${()=>this.callbacks.onStop?.()}>
                                Остановить
                            </button>
                            <button class="button recorder-clear" type="button" ?disabled=${!t} @click=${()=>this.handleClear()}>
                                Очистить
                            </button>
                            <button class="button recorder-copy" type="button" ?disabled=${!t||n.length===0} @click=${()=>this.callbacks.onCopyRecipe?.()}>
                                Копировать рецепт
                            </button>
                            <button class="button recorder-export" type="button" ?disabled=${!t} @click=${()=>this.callbacks.onExport?.()}>
                                Экспорт JSON
                            </button>
                        </div>
                    </div>
                    <div class="recorder-body">
                        <aside class="privacy-warning">
                            Запись может содержать данные учеников, уроки, ответы и идентификаторы.
                            Проверьте файл перед отправкой или коммитом.
                        </aside>
                        <div class="recorder-summary">
                            <span><strong class="operation-count">${r.length}</strong> операций</span>
                            <span><strong class="frame-count">${this.state.session?.frameCount||0}</strong> кадров</span>
                            <span><strong class="byte-count">${this.formatBytes(this.state.session?.storedBytes||0)}</strong> текста</span>
                            <label>
                                <input class="show-toolbox" type="checkbox" .checked=${this.showToolbox} @change=${e=>{this.showToolbox=e.currentTarget.checked}}>
                                Показать трафик Toolbox
                            </label>
                        </div>
                        <p class="recorder-notice" role="status" ?hidden=${!this.state.notice}>${this.state.notice||``}</p>
                        <section>
                            <h3>Операции</h3>
                            <div class="operation-list">${r.map(e=>this.renderOperation(e))}</div>
                            <p class="empty-operations" ?hidden=${r.length>0}> Запустите запись и выполните действие в Edvibe.</p>
                        </section>
                        <details class="other-section">
                            <summary>Другие кадры (<span class="other-count">${i.length}</span>)</summary>
                            <div class="other-list">${i.map(e=>U`<pre>${JSON.stringify(e,null,2)}</pre>`)}</div>
                        </details>
                        <label class="copy-fallback" ?hidden=${!s}>
                            Скопируйте текст вручную
                            <textarea readonly .value=${s}></textarea>
                        </label>
                    </div>
                </section>
            </div>
        `}};customElements.get(`edvibe-toolbox-action-recorder`)||customElements.define(Zr,$r),globalThis.EdVibeActionRecorderDialog={RECORDER_DIALOG_TAG:Zr,RECORDER_DIALOG_ID:Qr,ActionRecorderDialog:$r};var ei=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,ti=new Set([`WS_UNAVAILABLE`,`REQUEST_TIMEOUT`,`SEND_FAILED`]);function Y(e,t,n={}){let r=Error(t);return r.code=e,Object.assign(r,n),r}function ni(e){let t=String(e||``).match(/\/marathon\/(\d+)(?:\/|$)/);return t?Number(t[1]):null}function ri(e,{includeItems:t=!1}={}){let n=[],r=[],i=[],a=new Set;for(let o of String(e||``).split(/[,;\r\n]+/)){let e=o.trim();if(!e)continue;let s=e.toLowerCase();if(a.has(s))continue;a.add(s);let c=ei.test(e);c?n.push({input:e,normalized:s}):r.push(e),t&&i.push({input:e,normalized:s,isValid:c})}return t?{entries:n,malformed:r,items:i}:{entries:n,malformed:r}}function ii(e,t,n,r,i){if(!Array.isArray(n)||!Number.isInteger(r)||r<0||t!==null&&r!==t||n.length===0&&e.length<r||e.length+n.length>r)throw Y(`INVALID_RESPONSE`,`${i} returned invalid pagination data.`);return{items:e.concat(n),total:r}}function ai(e,t){return ti.has(e?.code)?e.code!==`SEND_FAILED`||!!e.cause&&!t().isOpen:!1}async function oi(e,{wait:t,getConnectionState:n,retryDelays:r=[1e3,3e3]}){let i=0;for(;i<=r.length;){i+=1;try{if(i>1&&!n().isOpen)throw Y(`WS_UNAVAILABLE`,`The Edvibe connection is unavailable.`);return{value:await e(),attempts:i}}catch(e){if(!ai(e,n)||i>r.length)throw e.attempts=i,e;await t(r[i-1])}}throw Y(`INTERNAL_ERROR`,`Retry loop ended unexpectedly.`)}function si(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function ci(e){if(typeof e!=`function`)throw TypeError(`sendRequest is required`);return e}function li(e){if(!si(e))return{items:void 0,total:void 0};let t=si(e.Value)?e.Value:si(e.value)?e.value:null;if(!t)return{items:void 0,total:void 0};let n=si(t.Page)?t.Page:null;return{items:t.Items,total:n?.Count}}async function ui({sendRequest:e,marathonId:t,pageSize:n=50}){let r=ci(e),i=[],a=null;for(;a===null||i.length<a;){let e=li(await r(`MarathonPupilsWsController`,`GetMarathonPupils`,`Marathons`,{MarathonId:t,Skip:i.length,Take:n})),o=ii(i,a,e.items,e.total,`GetMarathonPupils`);i=o.items,a=o.total}return i}async function di({sendRequest:e,marathonId:t,pupilId:n,pageSize:r=20}){let i=ci(e),a=[],o=null;for(;o===null||a.length<o;){let e=li(await i(`MarathonLessonWsController`,`GetMarathonLessonsForPupilPagination`,`Marathons`,{PupilId:n,MarathonId:t,SearchTerm:``,Page:{Skip:a.length,Take:r}})),s=ii(a,o,e.items,e.total,`GetMarathonLessonsForPupilPagination`);a=s.items,o=s.total}return a}async function fi({sendRequest:e,marathonId:t,pageSize:n=100}){let r=ci(e),i=[],a=null;for(;a===null||i.length<a;){let e=li(await r(`MarathonLessonWsController`,`GetMarathonLessonsPagination`,`Marathons`,{MarathonId:t,SearchTerm:``,Page:{Skip:i.length,Take:n}})),o=ii(i,a,e.items,e.total,`GetMarathonLessonsPagination`);i=o.items,a=o.total}return i}async function pi({sendRequest:e,lessonId:t}){let n=await ci(e)(`LessonWsController`,`GetLessonWithId`,`Books`,{LessonId:t});if(!si(n))throw Y(`INVALID_RESPONSE`,`GetLessonWithId returned an invalid response.`);return n}var mi=new Set([...ti,`SERVER_REJECTED`,`INVALID_RESPONSE`]),hi=`edvibe-toolbox-batch-access-dialog`,gi=`edvibe-toolbox-batch-access-overlay`;function _i(e){return e.PupilId===void 0?e.Id:e.PupilId}function vi(e){return e.MarathonPupilId===void 0?e.Id:e.MarathonPupilId}function yi(e,t){let n=new Map;for(let e of t){let t=String(e.Email||``).trim().toLowerCase(),r=n.get(t)||[];r.push(e),n.set(t,r)}let r=[],i=[];for(let t of e){let e=n.get(t.normalized)||[];e.length===1?r.push(e[0]):e.length===0?i.push({type:`missing`,input:t.input,message:`No marathon pupil found for ${t.input}.`}):i.push({type:`ambiguous`,input:t.input,count:e.length,message:`Multiple marathon pupils found for ${t.input}.`})}return{matches:r,errors:i}}function bi({pupils:e,selectedLessonIds:t,lessonsByPupilId:n}){let r=[],i=[],a=[];for(let o of e){let e=_i(o),s=n.get(e)||[],c=new Map,l=new Set;for(let n of s)if(t.includes(n.MarathonLessonId)){if(c.get(n.MarathonLessonId)){l.add(n.MarathonLessonId),a.push(Y(`INVALID_RESPONSE`,`Multiple lesson states were returned for lesson ${n.MarathonLessonId}.`,{email:o.Email,pupilId:e,marathonLessonId:n.MarathonLessonId}));continue}c.set(n.MarathonLessonId,n)}for(let n of t){let t=c.get(n);if(l.has(n))continue;if(!t){a.push(Y(`INVALID_RESPONSE`,`Lesson ${n} was not returned for ${o.Email}.`,{email:o.Email,pupilId:e,marathonLessonId:n}));continue}if(typeof t.IsOpen!=`boolean`){a.push(Y(`INVALID_RESPONSE`,`Lesson ${n} returned an invalid access state.`,{email:o.Email,pupilId:e,marathonLessonId:n}));continue}let s={email:o.Email,pupilId:e,marathonPupilId:vi(o),marathonLessonId:n,lessonNumber:t.Number+1,lessonName:t.Name};t.IsOpen===!0?r.push(s):i.push(s)}}return{alreadyOpen:r,needsOpening:i,errors:a}}function xi({completed:e,total:t,opened:n,failures:r,alreadyOpen:i,item:a}){return Object.freeze({completed:e,total:t,opened:n,failures:r,alreadyOpen:i,current:Object.freeze({email:a.email,lessonName:a.lessonName})})}function Si(e,t,{code:n=t?.code||`UNKNOWN_ERROR`,message:r=t?.message||`The lesson access change failed.`,attempts:i=t?.attempts||1}={}){return{email:e.email,lessonNumber:e.lessonNumber,lessonName:e.lessonName,marathonLessonId:e.marathonLessonId,attempts:i,code:n,message:r}}function Ci({requestedEmails:e,matchedUsers:t,selectedLessons:n,opened:r,alreadyOpen:i,failures:a,attempts:o}){return{requestedEmails:e,matchedUsers:t,selectedLessons:n,opened:r,alreadyOpen:i.length,failures:a,attempts:o}}async function wi({marathonId:e,requestedEmails:t,matchedUsers:n,selectedLessons:r,alreadyOpen:i=[],needsOpening:a=[],sendRequest:o,wait:s,getConnectionState:c,onProgress:l=()=>{}}){let u=[],d=[],f=0;for(let p=0;p<a.length;p+=1){let m=a[p],h=0;try{l(xi({completed:p,total:a.length,opened:u.length,failures:d.length,alreadyOpen:i.length,item:m})),await s(300);try{h=(await oi(async()=>{let t=await o(`MarathonLessonWsController`,`ChangeIsOpenLessonForPupil`,`Marathons`,{IsOpen:!0,MarathonLessonId:m.marathonLessonId,MarathonPupilId:m.marathonPupilId,MarathonId:e});if(t?.Value!==!0)throw Y(`INVALID_RESPONSE`,`The lesson access change was not confirmed.`);return t},{wait:s,getConnectionState:c})).attempts,f+=h,u.push(m)}catch(e){if(h=e.attempts||1,f+=h,!mi.has(e?.code))throw e;d.push(Si(m,e,{attempts:h}))}l(xi({completed:p+1,total:a.length,opened:u.length,failures:d.length,alreadyOpen:i.length,item:m}))}catch(e){throw d.push(Si(m,e,{code:`INTERNAL_ERROR`,message:`An internal error stopped the batch operation.`,attempts:h})),Y(`INTERNAL_ERROR`,`An internal error stopped the batch operation.`,{cause:e,partialResult:Ci({requestedEmails:t,matchedUsers:n,selectedLessons:r,opened:u,alreadyOpen:i,failures:d,attempts:f})})}}return Ci({requestedEmails:t,matchedUsers:n,selectedLessons:r,opened:u,alreadyOpen:i,failures:d,attempts:f})}function Ti(e){let t=[`Requested emails: ${e.requestedEmails.length}`,`Matched users: ${e.matchedUsers}`,`Selected lessons: ${e.selectedLessons}`,`Opened: ${e.opened.length}`,`Already open: ${e.alreadyOpen}`,`Failed: ${e.failures.length}`,`Attempts: ${e.attempts}`];for(let n of e.failures)t.push(`FAILED ${n.email} — ${n.lessonNumber}. ${n.lessonName} — ${n.attempts} attempts — ${n.code}: ${n.message}`);return t.join(`
`)}function Ei(e){return Object.freeze(e.map(e=>Object.freeze({...e})))}function Di({requestedEmails:e,matchedUsers:t,selectedLessonIds:n,alreadyOpen:r,needsOpening:i}){return Object.freeze({requestedEmails:Object.freeze([...e]),matchedUsers:t,selectedLessonIds:Object.freeze([...n]),alreadyOpen:Ei(r),needsOpening:Ei(i)})}function Oi({sendRequest:e,getConnectionState:t,wait:n,canStart:r,onActiveChange:i,createDialog:a=()=>document.createElement(hi),copyText:o=async()=>{},log:s=()=>{}}){let c=!1,l=!1,u=[],d=[],f=null,p=null,m=null,h=null;function g(){c&&(c=!1,i(!1))}function _(){l=!1,u=[],d=[],f=null,p=null,m=null,h=null,g()}function v(e){return typeof e?.code==`string`?e.code:`UNKNOWN_ERROR`}function y(e,t,n){let r=v(e),i=String(t?.Email||``).trim();return Y(r,`Could not load lesson access for ${i||`the selected pupil`} (${r}).`,{email:i,pupilId:n,attempts:e?.attempts||1})}function b(e,t){let n=e.malformed.map(e=>Y(`INVALID_EMAIL`,`Invalid email address: ${e}.`));return e.entries.length===0&&e.malformed.length===0&&n.push(Y(`EMAILS_REQUIRED`,`Enter at least one email address.`)),t.length===0&&n.push(Y(`LESSONS_REQUIRED`,`Select at least one lesson.`)),n}function x(e){p={requestedEmails:[...e.requestedEmails],matchedUsers:e.matchedUsers,selectedLessons:e.selectedLessonIds.length,opened:[],alreadyOpen:e.alreadyOpen.length,failures:[],attempts:0},f=null,h.showComplete(p)}async function S(r){if(l)return;l=!0,f=null,p=null;let i=String(r?.detail?.emailInput||``),a=Object.freeze(Array.isArray(r?.detail?.selectedLessonIds)?[...r.detail.selectedLessonIds]:[]);try{h.showValidation();let r=ri(i),o=b(r,a),c=yi(r.entries,u),l=o.concat(c.errors);if(l.length>0){s(`Batch access validation blocked for MarathonId ${m}; ${l.length} error(s).`),h.showValidationErrors(l);return}let d=new Map,p=[],g=[];for(let r of c.matches){let i=_i(r);try{s(`Loading batch access state for PupilId ${i} in MarathonId ${m}.`);let a=await oi(()=>di({sendRequest:e,marathonId:m,pupilId:i}),{wait:n,getConnectionState:t});d.set(i,a.value),p.push(r),s(`Loaded ${a.value.length} lesson state(s) for PupilId ${i} after ${a.attempts} attempt(s).`)}catch(e){g.push(y(e,r,i)),s(`Batch access state read failed for PupilId ${i} in MarathonId ${m} (${v(e)}).`)}}let _=bi({pupils:p,selectedLessonIds:a,lessonsByPupilId:d}),S=g.concat(_.errors);if(S.length>0){s(`Batch access preflight blocked for MarathonId ${m}; ${S.length} error(s), zero writes issued.`),h.showValidationErrors(S);return}if(f=Di({requestedEmails:r.entries.map(e=>e.input),matchedUsers:c.matches.length,selectedLessonIds:a,alreadyOpen:_.alreadyOpen,needsOpening:_.needsOpening}),s(`Batch access preflight complete for MarathonId ${m}; ${f.needsOpening.length} pending, ${f.alreadyOpen.length} already open.`),f.needsOpening.length===0){x(f);return}h.showConfirmation(Object.freeze({matchedUsers:f.matchedUsers,selectedLessons:f.selectedLessonIds.length,needsOpening:f.needsOpening,alreadyOpen:f.alreadyOpen}))}catch(e){s(`Batch access preflight failed for MarathonId ${m} (${v(e)}).`),h.showValidationErrors([e])}finally{l=!1}}async function C(){if(l||!f)return;l=!0;let r=f;f=null;try{try{p=await wi({marathonId:m,requestedEmails:r.requestedEmails,matchedUsers:r.matchedUsers,selectedLessons:r.selectedLessonIds.length,alreadyOpen:r.alreadyOpen,needsOpening:r.needsOpening,sendRequest:e,wait:n,getConnectionState:t,onProgress:e=>h.showExecution(e)})}catch(e){if(e?.code!==`INTERNAL_ERROR`||!e.partialResult)throw e;p=e.partialResult,s(`Batch access execution stopped for MarathonId ${m}; ${p.opened.length} opened, ${p.failures.length} failed (INTERNAL_ERROR).`)}s(`Batch access execution complete for MarathonId ${m}; ${p.opened.length} opened, ${p.alreadyOpen} already open, ${p.failures.length} failed.`);for(let e of p.failures)s(`Batch access write failed for MarathonLessonId ${e.marathonLessonId} (${e.code}).`);h.showComplete(p)}finally{l=!1}}async function w(){p&&await o(Ti(p))}function T(){f=null,p=null,l=!1}async function E(){if(!(c||document.getElementById(gi))){if(!r()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}if(m=ni(window.location.href),!m){window.alert(`Open an Edvibe marathon page before opening batch lesson access.`);return}c=!0,i(!0);try{if(h=a(),h.addEventListener(`edvibe-dialog-close`,_),h.addEventListener(`edvibe-batch-access-input-change`,e=>{let t=ri(e?.detail?.emailInput);h.setEmailState({validCount:t.entries.length,malformedCount:t.malformed.length})}),h.addEventListener(`edvibe-batch-access-submit`,S),h.addEventListener(`edvibe-batch-access-confirm`,C),h.addEventListener(`edvibe-batch-access-copy-report`,w),h.addEventListener(`edvibe-batch-access-restart`,T),h.configure(),(document.body||document.documentElement).appendChild(h),h.showLoading(),s(`Initializing batch access for MarathonId ${m}.`),u=await ui({sendRequest:e,marathonId:m}),u.length===0)throw Y(`EMPTY_ROSTER`,`No pupils were found in this marathon.`);let t=_i(u[0]);d=await di({sendRequest:e,marathonId:m,pupilId:t}),s(`Initialized batch access for MarathonId ${m}; ${u.length} pupil(s), ${d.length} lesson(s), catalogue PupilId ${t}.`),h.showConfigure({lessons:d})}catch(e){s(`Batch access initialization failed for MarathonId ${m} (${v(e)}).`);try{if(typeof h?.showFatalError==`function`)h.showFatalError(e);else throw e}finally{g()}}}}return{open:E,isRunning:()=>l}}var ki=s({OPERATION_TYPE:()=>Ai,attemptKey:()=>zi,buildObservedPlan:()=>Ji,createCapture:()=>Vi,freezeObject:()=>X,lessonKey:()=>Ri,normalizeEmail:()=>Mi,observeRequest:()=>Ui,recordWriteAttempt:()=>Wi,sanitizeLesson:()=>Ii,sanitizePupil:()=>Fi,splitSubmittedInputs:()=>Li}),Ai=`batch_lesson_access`;function X(e){return Object.freeze({...e})}function ji(e){return Object.freeze(e.map(e=>X(e)))}function Mi(e){return String(e||``).trim().toLowerCase()}function Ni(e){return e?.PupilId??e?.Id??null}function Pi(e){return e?.MarathonPupilId??e?.Id??null}function Fi(e){return X({email:String(e?.Email||``).trim()||null,pupilId:Ni(e),marathonPupilId:Pi(e)})}function Ii(e){let t=Number(e?.Number);return X({marathonLessonId:e?.MarathonLessonId??null,lessonNumber:Number.isFinite(t)?t+1:null,lessonName:String(e?.Name||``).trim()||null,isOpen:typeof e?.IsOpen==`boolean`?e.IsOpen:null})}function Li(e){let t=[],n=new Set;for(let r of String(e||``).split(/[,;\r\n]+/)){let e=r.trim();if(!e)continue;let i=Mi(e);n.has(i)||(n.add(i),t.push(X({submittedInput:e,normalizedEmail:i})))}return Object.freeze(t)}function Ri(e,t){return`${Mi(e)}:${String(t)}`}function zi(e,t){return`${String(e)}:${String(t)}`}function Bi(e,t,n){return X({code:typeof e?.code==`string`?e.code:t,message:String(e?.message||n),email:String(e?.email||``).trim()||null,pupilId:e?.pupilId??null,marathonLessonId:e?.marathonLessonId??null,attempts:Number.isInteger(e?.attempts)?e.attempts:0,type:typeof e?.type==`string`?e.type:null,count:Number.isInteger(e?.count)?e.count:null})}function Vi(){return{pupils:[],lessonsByPupilId:new Map,lessonCatalogue:[],writeAttempts:new Map,attempt:null,sequence:0}}function Hi(e,t,n){t===0&&(e.length=0);for(let r=0;r<n.length;r+=1)e[t+r]=n[r];for(;e.length>0&&e[e.length-1]===void 0;)e.pop()}function Ui(e,t,n,r){if(t===`GetMarathonPupils`){let t=Array.isArray(r?.Value?.Items)?r.Value.Items.map(Fi):[];Hi(e.pupils,Number(n?.Skip)||0,t);return}if(t===`GetMarathonLessonsForPupilPagination`){let t=n?.PupilId??null,i=e.lessonsByPupilId.get(t)||[],a=Array.isArray(r?.Value?.Items)?r.Value.Items.map(Ii):[];Hi(i,Number(n?.Page?.Skip)||0,a),e.lessonsByPupilId.set(t,i)}}function Wi(e,t,n){if(t!==`ChangeIsOpenLessonForPupil`)return;let r=zi(n?.MarathonPupilId,n?.MarathonLessonId);e.writeAttempts.set(r,(e.writeAttempts.get(r)||0)+1)}function Gi({submittedEmailInput:e,pupils:t}){let n=Li(e),r=ri(e),i=new Set(r.malformed.map(Mi)),a=new Map;for(let e of t){let t=Mi(e.email),n=a.get(t)||[];n.push(e),a.set(t,n)}return n.map(e=>{if(i.has(e.normalizedEmail))return X({...e,resolution:`malformed`,resolvedEmail:null,pupilId:null,marathonPupilId:null,code:`USER_INPUT_MALFORMED`,message:`Invalid email address: ${e.submittedInput}.`});let t=a.get(e.normalizedEmail)||[];if(t.length===0)return X({...e,resolution:`missing`,resolvedEmail:null,pupilId:null,marathonPupilId:null,code:`USER_NOT_FOUND`,message:`No marathon pupil found for ${e.submittedInput}.`});if(t.length>1)return X({...e,resolution:`ambiguous`,resolvedEmail:null,pupilId:null,marathonPupilId:null,code:`USER_AMBIGUOUS`,message:`Multiple marathon pupils found for ${e.submittedInput}.`});let n=t[0];return X({...e,resolution:`matched`,resolvedEmail:n.email,pupilId:n.pupilId,marathonPupilId:n.marathonPupilId,code:null,message:null})})}function Ki(e,t){let n=new Map(t.map(e=>[e.marathonLessonId,e]));return ji(e.map(e=>{let t=n.get(e);return{marathonLessonId:e,lessonNumber:t?.lessonNumber??null,lessonName:t?.lessonName||`Lesson ${e}`}}))}function qi(e,t){return e.find(e=>t.pupilId!==null&&e.pupilId===t.pupilId||t.resolvedEmail&&Mi(e.email)===Mi(t.resolvedEmail))}function Ji({submittedEmailInput:e,selectedLessonIds:t,pupils:n,lessonsByPupilId:r,lessonCatalogue:i,errors:a=[]}){let o=Gi({submittedEmailInput:e,pupils:n}),s=Ki(t,i),c=ji(a.map(e=>Bi(e,`LESSON_ACCESS_PREFLIGHT_FAILED`,`The lesson-access preflight failed.`))),l=[],u=[],d=new Set([`INVALID_EMAIL`,`USER_INPUT_MALFORMED`,`USER_NOT_FOUND`,`USER_AMBIGUOUS`]),f=c.filter(e=>!e.email&&e.pupilId===null&&e.marathonLessonId===null&&!e.type&&!d.has(e.code)).map(e=>X({code:e.code,message:e.message,attempts:e.attempts,kind:[`EMAILS_REQUIRED`,`LESSONS_REQUIRED`].includes(e.code)?`input`:`preflight`}));for(let e of o){if(e.resolution!==`matched`)continue;let t=r.get(e.pupilId);if(!Array.isArray(t)){let t=qi(c,e);t&&u.push(X({submittedEmail:e.submittedInput,resolvedEmail:e.resolvedEmail,pupilId:e.pupilId,marathonPupilId:e.marathonPupilId,code:t.code||`LESSON_STATE_DISCOVERY_FAILED`,message:t.message||`Could not load lesson access for ${e.resolvedEmail}.`,attempts:t.attempts||0}));for(let n of s)l.push(X({...e,...n,preflightAccessState:`unknown`,plannedOutcome:`not_attempted`,code:t?`LESSON_STATE_UNAVAILABLE`:`PREFLIGHT_BLOCKED`,message:t?`The lesson state could not be loaded, so this combination was not attempted.`:`Validation stopped before this confirmed user and lesson combination could be prepared.`}));continue}let n=new Map;for(let e of t){let t=n.get(e.marathonLessonId)||[];t.push(e),n.set(e.marathonLessonId,t)}for(let t of s){let r=n.get(t.marathonLessonId)||[];if(r.length===0){l.push(X({...e,...t,preflightAccessState:`unknown`,plannedOutcome:`rejected`,code:`LESSON_NOT_RETURNED`,message:`Lesson ${t.marathonLessonId} was not returned for ${e.resolvedEmail}.`}));continue}if(r.length>1){l.push(X({...e,...t,preflightAccessState:`unknown`,plannedOutcome:`rejected`,code:`LESSON_STATE_AMBIGUOUS`,message:`Multiple lesson states were returned for lesson ${t.marathonLessonId}.`}));continue}let i=r[0];if(typeof i.isOpen!=`boolean`){l.push(X({...e,...t,lessonNumber:i.lessonNumber??t.lessonNumber,lessonName:i.lessonName||t.lessonName,preflightAccessState:`unknown`,plannedOutcome:`rejected`,code:`INVALID_ACCESS_STATE`,message:`Lesson ${t.marathonLessonId} returned an invalid access state.`}));continue}l.push(X({...e,...t,lessonNumber:i.lessonNumber??t.lessonNumber,lessonName:i.lessonName||t.lessonName,preflightAccessState:i.isOpen?`open`:`closed`,plannedOutcome:i.isOpen?`already_open`:`pending`,code:null,message:null}))}}return Object.freeze({identities:ji(o),selectedLessons:s,matrix:ji(l),discoveryFailures:ji(u),operationFailures:ji(f),errors:c})}var Yi=s({buildExecutionHistoryInput:()=>ia}),Xi=new Set([`SERVER_REJECTED`,`INVALID_RESPONSE`]);function Zi(e,t,n,r,i){let a={opened:`success`,already_open:`noop`,rejected:`rejected`,failed:`failed`,not_attempted:`not_attempted`}[t];return X({itemId:Ri(e.resolvedEmail||e.submittedInput,e.marathonLessonId),label:`${e.resolvedEmail||e.submittedInput} — ${e.lessonNumber||`?`}. ${e.lessonName}`,status:a,code:r,message:i,attempts:n,data:X({submittedEmail:e.submittedInput,resolvedEmail:e.resolvedEmail,pupilId:e.pupilId,marathonPupilId:e.marathonPupilId,marathonLessonId:e.marathonLessonId,lessonNumber:e.lessonNumber,lessonName:e.lessonName,preflightAccessState:e.preflightAccessState,outcome:t})})}function Qi(e,t={},n=new Map){let r=new Set((Array.isArray(t.opened)?t.opened:[]).map(e=>Ri(e.email,e.marathonLessonId))),i=new Map;for(let e of Array.isArray(t.failures)?t.failures:[])i.set(Ri(e.email,e.marathonLessonId),e);return e.matrix.map(e=>{if(e.plannedOutcome===`already_open`)return Zi(e,`already_open`,0,`LESSON_ALREADY_OPEN`,`Lesson access was already open.`);if(e.plannedOutcome===`rejected`)return Zi(e,`rejected`,0,e.code,e.message);if(e.plannedOutcome===`not_attempted`)return Zi(e,`not_attempted`,0,e.code,e.message);let t=Ri(e.resolvedEmail,e.marathonLessonId);if(r.has(t))return Zi(e,`opened`,n.get(zi(e.marathonPupilId,e.marathonLessonId))||1,`LESSON_ACCESS_OPENED`,`Lesson access was opened.`);let a=i.get(t);return a?Zi(e,Xi.has(a.code)?`rejected`:`failed`,Number.isInteger(a.attempts)?a.attempts:1,a.code||`LESSON_ACCESS_WRITE_FAILED`,a.message||`The lesson access change failed.`):Zi(e,`not_attempted`,0,`LESSON_ACCESS_NOT_ATTEMPTED`,`The confirmed combination was not attempted.`)})}function $i(e){return e.filter(e=>e.resolution!==`matched`).map(e=>X({itemId:`input:${e.normalizedEmail||e.submittedInput}`,label:e.submittedInput,status:`rejected`,code:e.code,message:e.message,attempts:0,data:X({submittedInput:e.submittedInput,normalizedEmail:e.normalizedEmail,resolution:e.resolution})}))}function ea(e){return e.map((e,t)=>X({itemId:`operation:${t+1}:${e.code}`,label:e.kind===`input`?`Submitted request`:`Lesson-access preflight`,status:e.kind===`input`?`rejected`:`failed`,code:e.code,message:e.message,attempts:e.attempts,data:X({stage:e.kind===`input`?`input_validation`:`preflight`})}))}function ta(e){return e.map(e=>X({itemId:`discovery:${Mi(e.resolvedEmail||e.submittedEmail)}`,label:e.resolvedEmail||e.submittedEmail,status:`failed`,code:e.code,message:e.message,attempts:e.attempts,data:X({submittedEmail:e.submittedEmail,resolvedEmail:e.resolvedEmail,pupilId:e.pupilId,marathonPupilId:e.marathonPupilId,stage:`lesson_state_discovery`})}))}function na(e,t){let n=e.identities.filter(e=>e.resolution===`matched`).length,r=e=>t.filter(t=>t.data.outcome===e).length;return Object.freeze({requestedInputs:e.identities.length,matchedUsers:n,selectedLessons:e.selectedLessons.length,totalCombinations:e.matrix.length,newlyOpened:r(`opened`),alreadyOpen:r(`already_open`),rejected:r(`rejected`),failedWrites:r(`failed`),notAttempted:r(`not_attempted`),inputFailures:e.identities.filter(e=>e.resolution!==`matched`).length,discoveryFailures:e.discoveryFailures.length,operationFailures:e.operationFailures.length})}function ra(e,t){return e===`cancelled`||e===`interrupted`?e:t.rejected>0||t.failedWrites>0||t.notAttempted>0||t.inputFailures>0||t.discoveryFailures>0||t.operationFailures>0?`completed_with_failures`:`completed`}function ia({plan:e,summary:t={},writeAttempts:n=new Map,startedAt:r,completedAt:i,marathonId:a,marathonName:o=null,terminalStatus:s=null}){let c=Qi(e,t,n),l=$i(e.identities),u=ta(e.discoveryFailures),d=ea(e.operationFailures),f=na(e,c),p=f.newlyOpened+f.rejected+f.failedWrites,m=f.rejected+f.failedWrites;return Object.freeze({operationType:Ai,startedAt:r,completedAt:i,status:ra(s,f),pageContext:Object.freeze({marathonId:a,marathonName:o}),counts:Object.freeze({requested:f.requestedInputs,eligible:f.totalCombinations,attempted:p,successful:f.newlyOpened,noOp:f.alreadyOpen,skipped:f.inputFailures+f.discoveryFailures+f.operationFailures,failed:m,notAttempted:f.notAttempted}),results:Object.freeze([...l,...d,...u,...c]),message:JSON.stringify(f)})}var{createCapture:aa,recordWriteAttempt:oa,observeRequest:sa,sanitizeLesson:ca,buildObservedPlan:la}=ki,{buildExecutionHistoryInput:ua}=Yi;function da(e,t,n=!1){let r=e.elements?.status?.textContent||``;e.setStatus?.(`${r}${r?` `:``}${t}`,n?`error`:``)}function fa(e,t,n){e.shadowRoot?.querySelector?.(`.edvibe-batch-access-history`)?.remove?.();let r=(e.ownerDocument||globalThis.document)?.createElement?.(`button`);r&&(r.type=`button`,r.className=`edvibe-batch-access-history`,r.textContent=`Открыть в истории`,r.addEventListener(`click`,()=>{e.close?.(),n(t)}),e.elements?.footer?.appendChild?.(r))}function pa(e={}){let{createFeature:t=Oi,sendRequest:n,createDialog:r,persistExecution:i,openHistory:a=()=>{},getLocationHref:o=()=>``,getMarathonName:s=()=>null,now:c=()=>new Date,log:l=()=>{},...u}=e;if(typeof t!=`function`)throw TypeError(`createFeature is required`);if(typeof n!=`function`)throw TypeError(`sendRequest is required`);if(typeof r!=`function`)throw TypeError(`createDialog is required`);if(typeof i!=`function`)throw TypeError(`persistExecution is required`);let d=null;async function f(e,t,r,i){let a=d;a&&oa(a,t,i);let o=await n(e,t,r,i);return a&&sa(a,t,i,o),o}function p(){let e=r(),t=aa();d=t;let n=e.showConfigure.bind(e),u=e.showConfirmation.bind(e),f=e.showValidationErrors.bind(e),p=e.showComplete.bind(e),m=e.showFatalError.bind(e);function h(n={}){t.sequence+=1,t.writeAttempts.clear(),t.attempt={sequence:t.sequence,startedAt:c().toISOString(),submittedEmailInput:String(n.emailInput||``),selectedLessonIds:Array.isArray(n.selectedLessonIds)?[...n.selectedLessonIds]:[],plan:null,terminal:!1},e.shadowRoot?.querySelector?.(`.edvibe-batch-access-history`)?.remove?.()}function g(e=[]){let n=t.attempt;return n?la({submittedEmailInput:n.submittedEmailInput,selectedLessonIds:n.selectedLessonIds,pupils:t.pupils,lessonsByPupilId:t.lessonsByPupilId,lessonCatalogue:t.lessonCatalogue,errors:e}):null}function _(n,r,u=[]){let d=t.attempt;if(!d||d.terminal)return;d.terminal=!0;let f=d.sequence,p;try{let e=c().toISOString(),i=d.plan||g(u);if(!i)return;p=ua({plan:i,summary:n,writeAttempts:t.writeAttempts,startedAt:d.startedAt,completedAt:e,marathonId:ni(o()),marathonName:s(),terminalStatus:r})}catch(t){da(e,`Экранный результат сохранён, но записать историю не удалось.`,!0),l(`Batch lesson access history record creation failed:`,t);return}Promise.resolve().then(()=>i(p)).then(n=>{f===t.sequence&&(n?.stored?(da(e,`Результат сохранён в истории.`),n.record?.id&&fa(e,n.record.id,a)):(da(e,`Экранный результат сохранён, но записать историю не удалось.`,!0),n?.persistenceError&&l(`Batch lesson access history persistence failed:`,n.persistenceError)))}).catch(n=>{f===t.sequence&&(da(e,`Экранный результат сохранён, но записать историю не удалось.`,!0),l(`Batch lesson access history persistence failed:`,n))})}return e.showConfigure=(e={})=>(t.lessonCatalogue=Array.isArray(e.lessons)?e.lessons.map(ca):[],t.attempt=null,t.sequence+=1,n(e)),e.showConfirmation=(e={})=>(t.attempt&&(t.attempt.plan=g()),u(e)),e.showValidationErrors=(e=[])=>{let n=f(e);return t.attempt&&_({},null,Array.isArray(e)?e:[e]),n},e.showComplete=(e={})=>{let n=p(e);return t.attempt&&(t.attempt.plan||(t.attempt.plan=g()),_(e,(e.failures||[]).some(e=>e?.code===`INTERNAL_ERROR`)?`interrupted`:null)),n},e.showFatalError=e=>{let n=m(e);return t.attempt&&_({},`interrupted`,[e]),n},e.addEventListener(`edvibe-batch-access-submit`,e=>h(e?.detail)),e.addEventListener(`edvibe-batch-access-restart`,()=>{t.sequence+=1,t.attempt=null,e.shadowRoot?.querySelector?.(`.edvibe-batch-access-history`)?.remove?.()}),e.addEventListener(`edvibe-dialog-close`,()=>{t.attempt?.plan&&!t.attempt.terminal&&_({},`cancelled`)}),e}return t({...u,sendRequest:f,createDialog:p,log:l})}var ma=g`
:host {
    all: initial;
}

.edvibe-batch-access-overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
    background: rgba(15, 23, 42, .6);
    color: #1f2937;
    font-family: "Segoe UI", Arial, sans-serif;
}

.edvibe-batch-access-overlay *,
.edvibe-batch-access-overlay *::before,
.edvibe-batch-access-overlay *::after {
    box-sizing: border-box;
}

[hidden] {
    display: none !important;
}

.edvibe-batch-access-card {
    display: flex;
    flex-direction: column;
    width: min(760px, calc(100vw - 32px));
    max-height: min(820px, calc(100vh - 32px));
    padding: 24px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 24px 80px rgba(15, 23, 42, .38);
}

.edvibe-batch-access-header,
.edvibe-batch-access-lesson-heading,
.edvibe-batch-access-selection-actions,
.edvibe-batch-access-email-state,
.edvibe-batch-access-footer {
    display: flex;
    align-items: center;
}

.edvibe-batch-access-header,
.edvibe-batch-access-lesson-heading {
    justify-content: space-between;
    gap: 16px;
}

.edvibe-batch-access-header h2,
.edvibe-batch-access-lesson-heading h3 {
    margin: 0;
    color: #111827;
}

.edvibe-batch-access-header h2 {
    font-size: 21px;
    line-height: 1.3;
}

.edvibe-batch-access-description {
    margin: 5px 0 0;
    color: #6b7280;
    font-size: 13px;
    line-height: 1.4;
}

.edvibe-batch-access-close {
    padding: 4px 8px;
    border: 0;
    background: transparent;
    color: #6b7280;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
}

.edvibe-batch-access-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    margin-top: 18px;
}

.edvibe-batch-access-configure > label,
.edvibe-batch-access-lesson-heading h3 {
    display: block;
    color: #374151;
    font-size: 13px;
    font-weight: 650;
}

.edvibe-batch-access-emails {
    display: block;
    width: 100%;
    min-height: 112px;
    margin-top: 7px;
    padding: 10px 12px;
    resize: vertical;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    color: #111827;
    font: inherit;
    line-height: 1.45;
    outline: none;
}

.edvibe-batch-access-emails:focus,
.edvibe-batch-access-lesson:focus-within,
.edvibe-batch-access-selection-actions button:focus,
.edvibe-batch-access-footer button:focus,
.edvibe-batch-access-close:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, .15);
    outline: none;
}

.edvibe-batch-access-email-state {
    flex-wrap: wrap;
    gap: 8px 16px;
    margin-top: 7px;
    color: #6b7280;
    font-size: 12px;
}

.edvibe-batch-access-lesson-heading {
    margin-top: 20px;
}

.edvibe-batch-access-selection-actions {
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px 12px;
    color: #374151;
    font-size: 13px;
}

.edvibe-batch-access-selection-actions label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
}

.edvibe-batch-access-selection-actions button {
    padding: 0;
    border: 0;
    background: transparent;
    color: #2563eb;
    font: inherit;
    cursor: pointer;
}

.edvibe-batch-access-lessons,
.edvibe-batch-access-errors,
.edvibe-batch-access-summary,
.edvibe-batch-access-failures {
    overflow: auto;
    max-height: 248px;
    margin-top: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
}

.edvibe-batch-access-lesson {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 11px 12px;
    border-bottom: 1px solid #f1f5f9;
    color: #1f2937;
    font-size: 14px;
    line-height: 1.4;
    cursor: pointer;
}

.edvibe-batch-access-lesson:last-child {
    border-bottom: 0;
}

.edvibe-batch-access-lesson:hover {
    background: #eff6ff;
}

.edvibe-batch-access-lesson input {
    flex: 0 0 auto;
    margin-top: 3px;
}

.edvibe-batch-access-empty,
.edvibe-batch-access-error {
    margin: 0;
    padding: 12px;
    font-size: 13px;
    line-height: 1.4;
}

.edvibe-batch-access-empty {
    color: #6b7280;
    text-align: center;
}

.edvibe-batch-access-errors {
    border-color: #fecaca;
    background: #fef2f2;
}

.edvibe-batch-access-error {
    border-bottom: 1px solid #fee2e2;
    color: #b91c1c;
}

.edvibe-batch-access-error:last-child {
    border-bottom: 0;
}

.edvibe-batch-access-failures {
    border-color: #fed7aa;
    background: #fff7ed;
}

.edvibe-batch-access-failure {
    margin: 0;
    padding: 12px;
    border-bottom: 1px solid #ffedd5;
    color: #9a3412;
    font-size: 13px;
    line-height: 1.45;
    overflow-wrap: anywhere;
}

.edvibe-batch-access-failure:last-child {
    border-bottom: 0;
}

.edvibe-batch-access-summary {
    padding: 12px;
    border-color: #bfdbfe;
    background: #eff6ff;
    color: #1e3a8a;
    font-size: 13px;
    line-height: 1.55;
    white-space: pre-line;
}

.edvibe-batch-access-live-region {
    flex: 0 0 auto;
    padding-top: 16px;
}

.edvibe-batch-access-loading-indicator {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 7px;
    border: 2px solid #bfdbfe;
    border-top-color: #2563eb;
    border-radius: 50%;
    vertical-align: -3px;
    animation: edvibe-batch-access-spin .8s linear infinite;
}

@keyframes edvibe-batch-access-spin {
    to {
        transform: rotate(360deg);
    }
}

.edvibe-batch-access-status {
    min-height: 20px;
    margin: 0;
    color: #4b5563;
    font-size: 13px;
    line-height: 1.4;
}

.edvibe-batch-access-status.is-error {
    color: #b91c1c;
}

.edvibe-batch-access-progress {
    display: block;
    width: 100%;
    height: 11px;
    margin-top: 10px;
    overflow: hidden;
    border: 0;
    border-radius: 999px;
    background: #e5e7eb;
    appearance: none;
}

.edvibe-batch-access-progress::-webkit-progress-bar {
    background: #e5e7eb;
}

.edvibe-batch-access-progress::-webkit-progress-value {
    border-radius: 999px;
    background: linear-gradient(90deg, #2563eb, #16a34a);
}

.edvibe-batch-access-footer {
    flex: 0 0 auto;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 18px;
}

.edvibe-batch-access-footer button {
    padding: 10px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    color: #374151;
    font: inherit;
    font-size: 13px;
    font-weight: 650;
    cursor: pointer;
}

.edvibe-batch-access-submit,
.edvibe-batch-access-confirm {
    border-color: #2563eb !important;
    background: #2563eb !important;
    color: #fff !important;
}

.edvibe-batch-access-footer button:disabled,
.edvibe-batch-access-close:disabled,
.edvibe-batch-access-emails:disabled,
.edvibe-batch-access-selection-actions input:disabled {
    cursor: not-allowed;
    opacity: .58;
}

@media (max-width: 560px) {
    .edvibe-batch-access-card {
        width: 100%;
        max-height: calc(100vh - 16px);
        padding: 18px;
        border-radius: 12px;
    }

    .edvibe-batch-access-overlay {
        padding: 8px;
    }

    .edvibe-batch-access-lesson-heading {
        align-items: flex-start;
        flex-direction: column;
    }

    .edvibe-batch-access-selection-actions {
        justify-content: flex-start;
    }

    .edvibe-batch-access-footer button {
        flex: 1 1 180px;
    }
}

`,ha=`edvibe-toolbox-batch-access-dialog`,ga=`edvibe-toolbox-batch-access-overlay`,_a=class extends G{static styles=[Ae,je,ma];static properties={lessons:{state:!0},selectedLessonIds:{state:!0},emailState:{state:!0},emailInput:{state:!0},mode:{state:!0},statusMessage:{state:!0},statusError:{state:!0},errors:{state:!0},summaryLines:{state:!0},failures:{state:!0},progress:{state:!0}};constructor(){super(),this.lessons=[],this.selectedLessonIds=new Set,this.emailState={validCount:0,malformedCount:0},this.emailInput=``,this.mode=`initializing`,this.statusMessage=``,this.statusError=!1,this.errors=[],this.summaryLines=[],this.failures=[],this.progress={visible:!1,indeterminate:!1,completed:0,total:0},this.handleKeydownBound=e=>this.handleKeydown(e)}connectedCallback(){super.connectedCallback(),this.id||=ga,this.ownerDocument?.addEventListener(`keydown`,this.handleKeydownBound)}disconnectedCallback(){this.ownerDocument?.removeEventListener(`keydown`,this.handleKeydownBound),super.disconnectedCallback()}configure(e={}){return e=e&&typeof e==`object`?e:{},(e.lessons!==void 0||e.emailState!==void 0)&&this.showConfigure(e),this}setEmailState(e={}){return e=e&&typeof e==`object`?e:{},this.emailState={validCount:Math.max(0,Number(e.validCount)||0),malformedCount:Math.max(0,Number(e.malformedCount)||0)},this}showConfigure(e={}){return Array.isArray(e)&&(e={lessons:e}),e=e&&typeof e==`object`?e:{},Array.isArray(e.lessons)&&(this.lessons=e.lessons,this.selectedLessonIds=new Set),e.emailInput!==void 0&&(this.emailInput=String(e.emailInput||``)),this.mode=`configure`,this.clearMessages(),this.progress={visible:!1,indeterminate:!1,completed:0,total:0},e.emailState!==void 0&&this.setEmailState(e.emailState),this}showLoading(e=`Загружаем уроки…`){return this.mode=`loading`,this.clearMessages(),this.setStatus(e),this.progress={visible:!0,indeterminate:!0,completed:0,total:0},this}showValidation(e=`Проверяем данные…`){return this.mode=`validating`,this.clearMessages(),this.progress={visible:!1,indeterminate:!1,completed:0,total:0},this.setStatus(e),this}showValidationErrors(e=[]){return this.mode=`validation-error`,this.errors=this.normalizeErrors(e),this.summaryLines=[],this.failures=[],this.progress={visible:!1,indeterminate:!1,completed:0,total:0},this.setStatus(`Исправьте ошибки и повторите проверку.`,`error`),this}showConfirmation(e={}){this.mode=`confirm`,this.clearMessages();let t=this.count(e.needsOpening,e.pendingCount),n=this.count(e.alreadyOpen,e.alreadyOpenCount),r=this.count(e.selectedLessons,e.selectedLessonCount),i=this.count(e.matchedUsers,e.matchedUserCount);return this.summaryLines=[`${i} пользователей сопоставлено`,`${r} уроков выбрано`,`${t} доступов нужно открыть`,`${n} уже открыт${n===1?``:`о`} и будет пропущено`],this.setStatus(`Подтвердите открытие доступа.`),this}showExecution(e={}){this.mode=`executing`;let t=Math.max(0,Number(e.completed)||0),n=Math.max(0,Number(e.total)||0),r=Math.max(0,Number(e.opened)||0),i=Math.max(0,Number(e.failures)||0),a=Math.max(0,Number(e.alreadyOpen)||0);this.progress={visible:!0,indeterminate:!1,completed:t,total:n};let o=e.current?.email&&e.current?.lessonName?` Сейчас: ${e.current.email} — ${e.current.lessonName}.`:``;return this.setStatus(`Выполнено: ${t} из ${n}. Открыто: ${r}. Ошибок: ${i}. Уже открыто: ${a}.${o}`),this}showComplete(e={}){let t=Array.isArray(e.failures)?e.failures:[];return this.mode=t.length?`partial-complete`:`complete`,this.clearMessages(),this.progress={visible:!1,indeterminate:!1,completed:0,total:0},this.summaryLines=[`Email запрошено: ${this.count(e.requestedEmails,e.requestedEmailCount)}`,`Пользователей сопоставлено: ${this.count(e.matchedUsers,e.matchedUserCount)}`,`Уроков выбрано: ${this.count(e.selectedLessons,e.selectedLessonCount)}`,`Доступов открыто: ${this.count(e.opened,e.openedCount)}`,`Уже открыто: ${this.count(e.alreadyOpen,e.alreadyOpenCount)}`,`Ошибок: ${this.count(t,e.failureCount)}`,`Попыток запросов: ${Math.max(0,Number(e.attempts)||0)}`],this.failures=t,this.setStatus(t.length?`Завершено с ошибками. Скопируйте отчёт для подробностей.`:`Готово.`),this}showFatalError(e){return this.mode=`fatal-error`,this.clearMessages(),this.errors=this.normalizeErrors([e]),this.setStatus(`Не удалось подготовить пакетное открытие доступа.`,`error`),this}normalizeErrors(e){return(Array.isArray(e)?e:[e]).map(e=>typeof e==`string`?e:String(e?.message||`Неизвестная ошибка.`))}clearMessages(){this.errors=[],this.summaryLines=[],this.failures=[],this.statusMessage=``,this.statusError=!1}setStatus(e,t=``){this.statusMessage=String(e||``),this.statusError=t===`error`}isEditingLocked(){return[`validating`,`confirm`,`executing`,`fatal-error`].includes(this.mode)}isLessonSelectionLocked(){return this.mode===`loading`||this.isEditingLocked()}canClose(){return[`configure`,`validation-error`,`complete`,`partial-complete`,`fatal-error`].includes(this.mode)}canSubmit(){return(this.mode===`configure`||this.mode===`validation-error`)&&this.emailState.validCount>0&&this.selectedLessonIds.size>0}selectLesson(e,t){if(this.isLessonSelectionLocked())return;let n=new Set(this.selectedLessonIds);t?n.add(e):n.delete(e),this.selectedLessonIds=n}handleInput(e){this.emailInput=String(e.currentTarget.value||``),this.dispatchEvent(new CustomEvent(`edvibe-batch-access-input-change`,{detail:{emailInput:this.emailInput}}))}handleSelectAll(e){this.isLessonSelectionLocked()||(this.selectedLessonIds=e.currentTarget.checked?new Set(this.lessons.map(e=>e.MarathonLessonId)):new Set)}handleClearAll(){this.isLessonSelectionLocked()||(this.selectedLessonIds=new Set)}handleSubmit(){this.canSubmit()&&this.dispatchEvent(new CustomEvent(`edvibe-batch-access-submit`,{detail:{emailInput:this.emailInput,selectedLessonIds:[...this.selectedLessonIds]}}))}handleConfirm(){this.mode===`confirm`&&this.dispatchEvent(new CustomEvent(`edvibe-batch-access-confirm`))}handleCopy(){[`complete`,`partial-complete`].includes(this.mode)&&this.dispatchEvent(new CustomEvent(`edvibe-batch-access-copy-report`))}handleRestart(){[`complete`,`partial-complete`].includes(this.mode)&&(this.mode=`configure`,this.selectedLessonIds=new Set,this.emailInput=``,this.setEmailState({validCount:0,malformedCount:0}),this.clearMessages(),this.progress={visible:!1,indeterminate:!1,completed:0,total:0},this.dispatchEvent(new CustomEvent(`edvibe-batch-access-restart`)))}handleBackdropClick(e){e.target===e.currentTarget&&this.close()}handleKeydown(e){e.key===`Escape`&&this.close()}close(){this.canClose()&&(this.dispatchEvent(new CustomEvent(`edvibe-dialog-close`)),this.remove())}count(e,t){return Array.isArray(e)?e.length:Number.isFinite(Number(e))?Math.max(0,Number(e)):Math.max(0,Number(t)||0)}renderLesson(e,t){let n=e.MarathonLessonId;return U`
            <label class="edvibe-batch-access-lesson">
                ${Number(e.Number)+1}. ${e.Name||`Без названия`}
                <input type="checkbox" .value=${String(n)}
                    .checked=${this.selectedLessonIds.has(n)} ?disabled=${t}
                    @change=${e=>this.selectLesson(n,e.currentTarget.checked)}>
            </label>
        `}renderFailure(e){let t=Math.max(0,Number(e?.lessonNumber)||0),n=Math.max(0,Number(e?.attempts)||0);return U`<p class="edvibe-batch-access-failure">
            ${String(e?.email||`Email отсутствует`)} —
            ${t}. ${String(e?.lessonName||`Урок без названия`)} —
            ${n} попытки — ${String(e?.code||`UNKNOWN_ERROR`)}:
            ${String(e?.message||`Неизвестная ошибка.`)}
        </p>`}render(){let e=this.isEditingLocked(),t=this.isLessonSelectionLocked()||this.mode===`fatal-error`,n=[`complete`,`partial-complete`].includes(this.mode),r=this.selectedLessonIds.size,i=this.lessons.length,a=i>0&&r===i,o=r>0&&r<i,s=this.progress.indeterminate?W:this.progress.completed,c=`edvibe-batch-access-status${this.statusError?` is-error`:``}`;return U`
<div class="edvibe-batch-access-overlay" @click=${this.handleBackdropClick}>
                <section class="edvibe-batch-access-card" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-access-title">
                    <header class="edvibe-batch-access-header">
                        <div><h2 id="edvibe-batch-access-title">Открыть доступ к урокам</h2>
                            <p class="edvibe-batch-access-description">Укажите email учеников и выберите уроки.</p></div>
                        <button class="edvibe-batch-access-close" type="button" aria-label="Закрыть"
                            ?disabled=${!this.canClose()} @click=${()=>this.close()}>&times;</button>
                    </header>
                    <div class="edvibe-batch-access-body">
                        <section class="edvibe-batch-access-configure">
                            <label for="edvibe-batch-access-emails">Email учеников</label>
                            <textarea id="edvibe-batch-access-emails" class="edvibe-batch-access-emails"
                                rows="5" placeholder="user@example.com" .value=${this.emailInput}
                                ?disabled=${e||this.mode===`fatal-error`}
                                @input=${this.handleInput}></textarea>
                            <div class="edvibe-batch-access-email-state" aria-live="polite">
                                <span class="edvibe-batch-access-email-count">Уникальных email: ${this.emailState.validCount}</span>
                                <span class="edvibe-batch-access-malformed-count">Некорректных: ${this.emailState.malformedCount}</span>
                            </div>
                            <div class="edvibe-batch-access-lesson-heading"><h3>Уроки</h3>
                                <div class="edvibe-batch-access-selection-actions">
                                    <label><input class="edvibe-batch-access-select-all" type="checkbox"
                                        .checked=${a} .indeterminate=${o}
                                        ?disabled=${t||i===0}
                                        @change=${this.handleSelectAll}>Выбрать все</label>
                                    <button class="edvibe-batch-access-clear-all" type="button"
                                        ?disabled=${e||r===0}
                                        @click=${this.handleClearAll}>Очистить выбор</button>
                                </div>
                            </div>
                            <div class="edvibe-batch-access-lessons" aria-label="Список уроков">
                                ${i===0?U`<p class="edvibe-batch-access-empty">Уроки не найдены.</p>`:this.lessons.map(e=>this.renderLesson(e,t))}
                            </div>
                        </section>
                        <section class="edvibe-batch-access-errors" aria-live="polite" ?hidden=${this.errors.length===0}>
                            ${this.errors.map(e=>U`<p class="edvibe-batch-access-error">${e}</p>`)}
                        </section>
                        <section class="edvibe-batch-access-summary" aria-live="polite" ?hidden=${this.summaryLines.length===0}>
                            ${this.summaryLines.join(`
`)}
                        </section>
                        <section class="edvibe-batch-access-failures" aria-live="polite" ?hidden=${this.failures.length===0}>
                            ${this.failures.map(e=>this.renderFailure(e))}
                        </section>
                    </div>
                    <div class="edvibe-batch-access-live-region">
                        <span class="edvibe-batch-access-loading-indicator" role="img" aria-label="Загрузка уроков"
                            ?hidden=${this.mode!==`loading`}></span>
                        <p class=${c} role="status" aria-live="polite">${this.statusMessage}</p>
                        <progress class="edvibe-batch-access-progress" max=${this.progress.total}
                            value=${s} ?hidden=${!this.progress.visible}
                            aria-label=${this.progress.indeterminate?`Загрузка уроков`:W}></progress>
                    </div>
                    <footer class="edvibe-batch-access-footer">
                        <button class="edvibe-batch-access-copy" type="button" ?hidden=${!n}
                            ?disabled=${!n} @click=${this.handleCopy}>Копировать отчёт</button>
                        <button class="edvibe-batch-access-restart" type="button" ?hidden=${!n}
                            ?disabled=${!n} @click=${this.handleRestart}>Запустить другую группу</button>
                        <button class="edvibe-batch-access-confirm" type="button" ?hidden=${this.mode!==`confirm`}
                            ?disabled=${this.mode!==`confirm`} @click=${this.handleConfirm}>Подтвердить открытие доступа</button>
                        <button class="edvibe-batch-access-submit" type="button"
                            ?hidden=${![`configure`,`validation-error`].includes(this.mode)}
                            ?disabled=${!this.canSubmit()} @click=${this.handleSubmit}>Проверить и открыть доступ</button>
                    </footer>
                </section>
            </div>
        `}};customElements.get(`edvibe-toolbox-batch-access-dialog`)||customElements.define(ha,_a),globalThis.EdVibeBatchAccessDialogComponent={BATCH_ACCESS_DIALOG_TAG:ha,BATCH_ACCESS_OVERLAY_ID:ga,BatchLessonAccessDialog:_a};var va=`edvibe-toolbox-batch-user-management-dialog`;function ya(e){return ri(e,{includeItems:!0})}function ba(e,t){let n=new Map;for(let e of Array.isArray(t)?t:[]){let t=String(e?.Email||``).trim().toLowerCase(),r=n.get(t)||[];r.push(e),n.set(t,r)}let r=[],i=[];for(let t of Array.isArray(e)?e:[]){let e=n.get(t.normalized)||[];if(e.length===1){r.push({email:t.input,normalizedEmail:t.normalized,pupil:e[0],status:`matched`,message:``});continue}let a=e.length===0?`missing`:`ambiguous`,o=e.length===0?`No marathon pupil found for ${t.input}.`:`Multiple marathon pupils found for ${t.input}.`;r.push({email:t.input,normalizedEmail:t.normalized,pupil:null,status:a,message:o}),i.push({type:a,input:t.input,count:e.length,message:o})}return{rows:r,errors:i}}function xa({rows:e}){return(Array.isArray(e)?e:[]).map(e=>{let t=e.status===`matched`&&e.pupil,n=!!(t&&Array.isArray(e.pupil.Moderators)&&e.pupil.Moderators.length>0);return{email:e.email,normalizedEmail:e.normalizedEmail,pupil:t?e.pupil:null,marathonPupilId:t?e.pupil.MarathonPupilId:null,hasCurator:n,actionable:!!t,status:e.status,message:e.message,unassignSelected:!1,deleteSelected:!1,unassign:null,delete:null,result:{status:`pending`,message:t?`Not started`:e.message}}})}function Sa(e){return{...e,unassign:null,delete:null,result:{...e.result}}}function Ca(e){return{status:`failed`,attempts:e?.attempts||1,code:e?.code||`UNKNOWN_ERROR`,message:e?.message||`The operation failed.`}}function wa(e){return{status:`success`,attempts:e}}function Ta(){return{status:`noop`,attempts:0,message:`No curator was assigned.`}}function Ea(e){return{status:`skipped`,attempts:0,message:e}}function Da(e){let t=[];return e.unassignSelected&&t.push(`unassign`),e.deleteSelected&&t.push(`delete`),t}function Oa(e,t){return t?e===`unassign`?t.status===`noop`?`Curator already absent`:t.status===`success`?`Curator removed`:`Curator removal failed (${t.code||`UNKNOWN_ERROR`}): ${t.message||`The operation failed.`}`:t.status===`success`?`User deleted`:t.status===`skipped`?`Deletion skipped: ${t.message||`The operation was skipped.`}`:`Deletion failed (${t.code||`UNKNOWN_ERROR`}): ${t.message||`The operation failed.`}`:``}function ka(e){let t=Da(e);e.result={status:t.some(t=>e[t]?.status===`failed`)?`failed`:`success`,message:t.map(t=>Oa(t,e[t])).filter(Boolean).join(`; `)}}async function Aa({marathonId:e,rows:t,sendRequest:n,wait:r,getConnectionState:i,onProgress:a=()=>{}}){let o=(Array.isArray(t)?t:[]).filter(e=>e.actionable!==!1&&Da(e).length>0).map(Sa),s=o.length,c=0,l=0,u=0,d=0;function f(e,t){try{a(Object.freeze({completed:c,total:s,successes:l,failures:u,current:Object.freeze({email:e.email,operation:t})}))}catch{}}for(let t of o){let a=Da(t);try{if(t.unassignSelected)if(f(t,`unassign`),!t.hasCurator)t.unassign=Ta();else try{let a=await oi(async()=>{let r=await n(`MarathonPupilsWsController`,`AddModeratorsToPupil`,`Marathons`,{MarathonId:e,MarathonPupilId:t.marathonPupilId,SelectedModeratorsIds:[]});if(r?.Value?.IsSuccess!==!0)throw Y(`INVALID_RESPONSE`,`The curator removal was not confirmed.`);return r},{wait:r,getConnectionState:i});t.unassign=wa(a.attempts),d+=a.attempts}catch(e){t.unassign=Ca(e),d+=t.unassign.attempts}if(t.deleteSelected)if(t.unassign?.status===`failed`)t.delete=Ea(`Skipped because curator removal failed.`);else{f(t,`delete`);try{let e=await oi(async()=>{let e=await n(`MarathonPupilsWsController`,`DeleteMarathonPupil`,`Marathons`,{MarathonPupilId:t.marathonPupilId});if(e?.Value!==t.marathonPupilId)throw Y(`INVALID_RESPONSE`,`The user deletion was not confirmed.`);return e},{wait:r,getConnectionState:i});t.delete=wa(e.attempts),d+=e.attempts}catch(e){t.delete=Ca(e),d+=t.delete.attempts}}}catch(e){let n=t.unassign?.status!==`success`&&t.unassign?.status!==`noop`?`unassign`:`delete`;t[n]||=Ca(e)}ka(t),t.result.status===`failed`?u+=1:l+=1,c+=1,f(t,t.delete?.status===`skipped`?`unassign`:a[a.length-1])}return{rows:o,completed:c,total:s,successes:l,failures:u,attempts:d}}function ja(e){return e.entries.length===0&&e.malformed.length===0?[Y(`EMAILS_REQUIRED`,`Enter at least one email address.`)]:[]}function Ma(e,t){let n=new Map(t.rows.map(e=>[e.normalizedEmail,e]));return e.items.map(e=>e.isValid?n.get(e.normalized):{email:e.input,normalizedEmail:e.normalized,pupil:null,status:`malformed`,message:`Invalid email address: ${e.input}.`})}function Na({sendRequest:e,getConnectionState:t,wait:n,canStart:r,onActiveChange:i,createDialog:a=()=>document.createElement(va),log:o=()=>{}}){let s=!1,c=!1,l=[],u=[],d=null,f=null;function p(){s&&(s=!1,i(!1))}function m(){c=!1,l=[],u=[],d=null,f=null,p()}function h(e){return typeof e?.code==`string`?e.code:`UNKNOWN_ERROR`}function g(e){let t=ya(e?.detail?.emailInput);f.setEmailState({validCount:t.entries.length,malformedCount:t.malformed.length})}function _(e){let t=new Map((Array.isArray(e)?e:[]).map(e=>[e.normalizedEmail,{unassignSelected:!!e.unassignSelected,deleteSelected:!!e.deleteSelected}]));return u.map(e=>({...e,...t.get(e.normalizedEmail)||{unassignSelected:!1,deleteSelected:!1},result:{...e.result}}))}function v(e){let t=new Set(e.filter(e=>e.delete?.status===`success`).map(e=>e.marathonPupilId)),n=new Set(e.filter(e=>e.unassign?.status===`success`||e.unassign?.status===`noop`).map(e=>e.marathonPupilId));l=l.filter(e=>!t.has(e.MarathonPupilId)).map(e=>n.has(e.MarathonPupilId)?{...e,Moderators:[]}:e)}async function y(e){if(!c){c=!0;try{let t=ya(e?.detail?.emailInput),n=ja(t);if(n.length>0){f.showValidationErrors(n);return}f.showChecking(`Проверяем пользователей…`),u=xa({rows:Ma(t,ba(t.entries,l))}),f.showReview({rows:u}),o(`Batch user management checked ${u.length} row(s) for MarathonId ${d}.`)}catch(e){f.showValidationErrors([e])}finally{c=!1}}}function b(e){Array.isArray(e?.detail?.rows)&&(u=_(e.detail.rows))}async function x(r){if(c)return;let i=_(r?.detail?.rows||u);if(i.some(e=>e.actionable!==!1&&(e.unassignSelected||e.deleteSelected))){c=!0;try{let r=await Aa({marathonId:d,rows:i,sendRequest:e,wait:n,getConnectionState:t,onProgress:e=>f.showExecution(e)}),a=new Map(r.rows.map(e=>[e.normalizedEmail,e]));v(r.rows),u=i.map(e=>a.get(e.normalizedEmail)||e),f.showComplete({...r,rows:u})}catch(e){f.showComplete({rows:u,completed:0,total:0,successes:0,failures:1,attempts:e?.attempts||1,error:e})}finally{c=!1}}}function S(){u=[],c=!1}async function C(){if(!(s||document.getElementById(`edvibe-toolbox-batch-user-management-overlay`))){if(!r()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}if(d=ni(window.location.href),!d){window.alert(`Open an Edvibe marathon page before managing users.`);return}s=!0,i(!0);try{if(f=a(),f.addEventListener(`edvibe-dialog-close`,m),f.addEventListener(`edvibe-batch-user-management-input-change`,g),f.addEventListener(`edvibe-batch-user-management-check`,y),f.addEventListener(`edvibe-batch-user-management-selection-change`,b),f.addEventListener(`edvibe-batch-user-management-start`,x),f.addEventListener(`edvibe-batch-user-management-restart`,S),f.configure(),(document.body||document.documentElement).appendChild(f),f.showChecking(`Загружаем пользователей…`),o(`Initializing batch user management for MarathonId ${d}.`),l=await ui({sendRequest:e,marathonId:d}),l.length===0)throw Y(`EMPTY_ROSTER`,`No pupils were found in this marathon.`);f.showConfigure()}catch(e){o(`Batch user management initialization failed for MarathonId ${d} (${h(e)}).`);try{f?.showFatalError?.(e)}catch(e){o(`Batch user management error rendering failed (${h(e)}).`)}finally{p()}}}}return{open:C,isRunning:()=>c}}var Pa=`batch_user_management`,Fa=Object.freeze({unassign:`unassign_curator`,delete:`delete_user`});function Ia(e){let t=String(e||``).match(/\/marathon\/(\d+)(?:\/|$)/);return t?String(t[1]):null}function La(e){let t=[];return e?.unassignSelected&&t.push(Fa.unassign),e?.deleteSelected&&t.push(Fa.delete),t}function Ra(e){let t=e?.pupil||{};return Object.freeze({email:t.Email||e?.normalizedEmail||e?.email||null,displayName:t.DisplayName||t.FullName||t.Name||null,firstName:t.FirstName||null,lastName:t.LastName||null,pupilId:t.PupilId??t.Id??null,marathonPupilId:e?.marathonPupilId??t.MarathonPupilId??null})}function za(e,t){if(!t)return Object.freeze({name:e,status:`not_attempted`,attemptCount:0,code:`NOT_ATTEMPTED`,message:`The operation was not attempted.`,dependency:null});let n=t.status===`skipped`&&/curator removal failed/i.test(t.message||``);return Object.freeze({name:e,status:t.status,attemptCount:Number.isInteger(t.attempts)?t.attempts:0,code:t.code||(n?`DEPENDENCY_FAILED`:null),message:t.message||null,dependency:n?Object.freeze({blockedBy:Fa.unassign}):null})}function Ba(e,t){if(e?.status!==`matched`)return`rejected`;if(t.length===0)return`skipped`;let n=t.map(e=>e.status);return n.includes(`failed`)?`failed`:n.includes(`not_attempted`)?`not_attempted`:n.includes(`skipped`)?`skipped`:n.every(e=>e===`noop`)?`noop`:`success`}function Va(e,t){return t===`rejected`?{malformed:`USER_INPUT_MALFORMED`,missing:`USER_NOT_FOUND`,ambiguous:`USER_AMBIGUOUS`}[e?.status]||`USER_REJECTED`:{success:`USER_OPERATIONS_COMPLETED`,noop:`USER_OPERATIONS_NOOP`,skipped:`USER_OPERATIONS_SKIPPED`,failed:`USER_OPERATIONS_FAILED`,not_attempted:`USER_OPERATIONS_NOT_ATTEMPTED`}[t]}function Ha(e,t,n){if(t===`rejected`)return e?.message||`The submitted user could not be resolved safely.`;if(n.length===0)return`No user-management operation was selected.`;let r=n.map(e=>e.message).filter(Boolean);return r.length>0?r.join(`; `):{success:`All selected operations completed successfully.`,noop:`All selected operations were already satisfied.`,skipped:`One or more selected operations were skipped.`,failed:`One or more selected operations failed.`,not_attempted:`One or more selected operations were not attempted.`}[t]}function Ua(e,t){let n=La(e),r=n.map(t=>t===Fa.unassign?za(t,e?.unassign):za(t,e?.delete)),i=Ba(e,r);return Object.freeze({itemId:e?.normalizedEmail||e?.email||`input-${t+1}`,label:e?.email||e?.normalizedEmail||`Input ${t+1}`,status:i,code:Va(e,i),message:Ha(e,i,r),attempts:r.reduce((e,t)=>e+t.attemptCount,0),data:Object.freeze({submittedInput:e?.email||null,normalizedEmail:e?.normalizedEmail||null,resolution:e?.status||`malformed`,resolutionMessage:e?.message||null,user:e?.status===`matched`?Ra(e):null,curatorPresent:e?.status===`matched`?!!e?.hasCurator:null,selectedOperations:Object.freeze(n),operations:Object.freeze(r)})})}function Wa(e){let t=e.filter(e=>e.data.resolution===`matched`&&e.data.selectedOperations.length>0).length,n=e.filter(e=>e.status===`not_attempted`).length,r=e.filter(e=>e.data.resolution===`matched`&&e.data.selectedOperations.length>0&&e.status!==`not_attempted`).length;return Object.freeze({requested:e.length,eligible:t,attempted:r,successful:e.filter(e=>e.status===`success`).length,noOp:e.filter(e=>e.status===`noop`).length,skipped:e.filter(e=>e.status===`skipped`||e.status===`rejected`).length,failed:e.filter(e=>e.status===`failed`).length,notAttempted:n})}function Ga(e,t){return e?.error?`interrupted`:t.some(e=>e.status===`failed`||e.status===`skipped`||e.status===`rejected`)?`completed_with_failures`:`completed`}function Ka({rows:e,summary:t={},startedAt:n,completedAt:r,marathonId:i,marathonName:a=null}){let o=(Array.isArray(e)?e:[]).map(Ua),s={selected:0,attempted:0,successful:0,noOp:0,skipped:0,failed:0,notAttempted:0};for(let e of o)for(let t of e.data.operations)s.selected+=1,t.status!==`not_attempted`&&(s.attempted+=1),t.status===`success`&&(s.successful+=1),t.status===`noop`&&(s.noOp+=1),t.status===`skipped`&&(s.skipped+=1),t.status===`failed`&&(s.failed+=1),t.status===`not_attempted`&&(s.notAttempted+=1);let c=Wa(o);return Object.freeze({operationType:Pa,startedAt:n,completedAt:r,status:Ga(t,o),pageContext:Object.freeze({marathonId:i,marathonName:a}),counts:c,results:Object.freeze(o),message:JSON.stringify({userCounts:c,operationCounts:s})})}function qa({createDialog:e,persistExecution:t,openHistory:n=()=>{},getLocationHref:r=()=>``,getMarathonName:i=()=>null,now:a=()=>new Date,log:o=()=>{}}){if(typeof e!=`function`)throw TypeError(`createDialog is required`);if(typeof t!=`function`)throw TypeError(`persistExecution is required`);return function(){let s=e(),c=null,l=0,u=s.showComplete.bind(s),d=s.showReview.bind(s),f=s.showConfigure.bind(s);function p(){s.shadowRoot?.querySelector?.(`.edvibe-batch-user-management-history`)?.remove?.()}function m(e){let t=s.elements?.status?.textContent||``;s.setStatus?.(`${t}${t?` `:``}${e}`)}function h(e){p();let t=(s.ownerDocument||globalThis.document)?.createElement?.(`button`);t&&(t.type=`button`,t.className=`edvibe-batch-user-management-history`,t.textContent=`Открыть в истории`,t.addEventListener(`click`,()=>{s.close?.(),n(e)}),s.elements?.footer?.appendChild?.(t),s.elements?.footer||s.shadowRoot?.querySelector?.(`.edvibe-batch-user-management-footer`)?.appendChild?.(t))}return s.showReview=e=>(c=null,l+=1,p(),d(e)),s.showConfigure=(...e)=>(c=null,l+=1,p(),f(...e)),s.addEventListener(`edvibe-batch-user-management-start`,()=>{c=a().toISOString(),l+=1,p()}),s.showComplete=(e={})=>{let n=u(e),d=l,f=a().toISOString(),p=Ka({rows:e.rows||s.rows,summary:e,startedAt:c||f,completedAt:f,marathonId:Ia(r()),marathonName:i()});return Promise.resolve().then(()=>t(p)).then(e=>{d===l&&(e?.stored?(m(`Результат сохранён в истории.`),e.record?.id&&h(e.record.id)):(m(`Экранный результат сохранён, но записать историю не удалось.`),e?.persistenceError&&o(`Batch user management history persistence failed:`,e.persistenceError)))}).catch(e=>{d===l&&(m(`Экранный результат сохранён, но записать историю не удалось.`),o(`Batch user management history persistence failed:`,e))}),n},s}}var Ja=g`
:host {
    all: initial;
}

.edvibe-batch-user-management-overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
    background: rgba(15, 23, 42, .6);
    color: #1f2937;
    font-family: "Segoe UI", Arial, sans-serif;
}

.edvibe-batch-user-management-overlay *,
.edvibe-batch-user-management-overlay *::before,
.edvibe-batch-user-management-overlay *::after {
    box-sizing: border-box;
}

[hidden] {
    display: none !important;
}

.edvibe-batch-user-management-card {
    display: flex;
    flex-direction: column;
    width: min(980px, calc(100vw - 32px));
    max-height: min(820px, calc(100vh - 32px));
    padding: 24px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 24px 80px rgba(15, 23, 42, .38);
}

.edvibe-batch-user-management-header,
.edvibe-batch-user-management-email-state,
.edvibe-batch-user-management-footer {
    display: flex;
    align-items: center;
}

.edvibe-batch-user-management-header {
    justify-content: space-between;
    gap: 16px;
}

.edvibe-batch-user-management-header h2 {
    margin: 0;
    color: #111827;
    font-size: 21px;
    line-height: 1.3;
}

.edvibe-batch-user-management-description {
    margin: 5px 0 0;
    color: #6b7280;
    font-size: 13px;
    line-height: 1.4;
}

.edvibe-batch-user-management-close {
    padding: 4px 8px;
    border: 0;
    background: transparent;
    color: #6b7280;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
}

.edvibe-batch-user-management-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    margin-top: 18px;
}

.edvibe-batch-user-management-configure > label {
    display: block;
    color: #374151;
    font-size: 13px;
    font-weight: 650;
}

.edvibe-batch-user-management-emails {
    display: block;
    width: 100%;
    min-height: 112px;
    margin-top: 7px;
    padding: 10px 12px;
    resize: vertical;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    color: #111827;
    font: inherit;
    line-height: 1.45;
    outline: none;
}

.edvibe-batch-user-management-email-state {
    flex-wrap: wrap;
    gap: 8px 16px;
    margin-top: 7px;
    color: #6b7280;
    font-size: 12px;
}

.edvibe-batch-user-management-table-wrap,
.edvibe-batch-user-management-errors {
    overflow: auto;
    max-height: 350px;
    margin-top: 18px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
}

.edvibe-batch-user-management-table {
    width: 100%;
    border-collapse: collapse;
    color: #1f2937;
    font-size: 13px;
}

.edvibe-batch-user-management-table th,
.edvibe-batch-user-management-table td {
    padding: 11px 12px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
    vertical-align: top;
}

.edvibe-batch-user-management-table th {
    position: sticky;
    top: 0;
    z-index: 1;
    color: #374151;
    background: #f8fafc;
    font-size: 12px;
    font-weight: 700;
}

.edvibe-batch-user-management-table tr:last-child td {
    border-bottom: 0;
}

.edvibe-batch-user-management-table th:nth-child(2),
.edvibe-batch-user-management-table th:nth-child(3),
.edvibe-batch-user-management-table td:nth-child(2),
.edvibe-batch-user-management-table td:nth-child(3) {
    width: 150px;
    text-align: center;
}

.edvibe-batch-user-management-table th button {
    display: block;
    margin: 5px auto 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #2563eb;
    font: inherit;
    font-size: 11px;
    cursor: pointer;
}

.edvibe-batch-user-management-user {
    min-width: 220px;
    overflow-wrap: anywhere;
}

.edvibe-batch-user-management-result {
    min-width: 220px;
    color: #4b5563;
    overflow-wrap: anywhere;
}

.edvibe-batch-user-management-errors {
    border-color: #fecaca;
    background: #fef2f2;
}

.edvibe-batch-user-management-error {
    margin: 0;
    padding: 11px 12px;
    border-bottom: 1px solid #fee2e2;
    color: #b91c1c;
    font-size: 13px;
    line-height: 1.4;
}

.edvibe-batch-user-management-error:last-child {
    border-bottom: 0;
}

.edvibe-batch-user-management-live-region {
    flex: 0 0 auto;
    padding-top: 16px;
}

.edvibe-batch-user-management-status {
    min-height: 20px;
    margin: 0;
    color: #4b5563;
    font-size: 13px;
    line-height: 1.4;
}

.edvibe-batch-user-management-status.is-error {
    color: #b91c1c;
}

.edvibe-batch-user-management-progress {
    display: block;
    width: 100%;
    height: 11px;
    margin-top: 10px;
    overflow: hidden;
    border: 0;
    border-radius: 999px;
    background: #e5e7eb;
    appearance: none;
}

.edvibe-batch-user-management-progress::-webkit-progress-bar {
    background: #e5e7eb;
}

.edvibe-batch-user-management-progress::-webkit-progress-value {
    border-radius: 999px;
    background: linear-gradient(90deg, #2563eb, #dc2626);
}

.edvibe-batch-user-management-footer {
    flex: 0 0 auto;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 18px;
}

.edvibe-batch-user-management-footer button {
    padding: 10px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    color: #374151;
    font: inherit;
    font-size: 13px;
    font-weight: 650;
    cursor: pointer;
}

.edvibe-batch-user-management-check,
.edvibe-batch-user-management-start {
    border-color: #2563eb !important;
    background: #2563eb !important;
    color: #fff !important;
}

.edvibe-batch-user-management-footer button:disabled,
.edvibe-batch-user-management-close:disabled,
.edvibe-batch-user-management-emails:disabled {
    cursor: not-allowed;
    opacity: .58;
}

@media (max-width: 680px) {
    .edvibe-batch-user-management-card {
        width: 100%;
        max-height: calc(100vh - 16px);
        padding: 18px;
        border-radius: 12px;
    }

    .edvibe-batch-user-management-overlay {
        padding: 8px;
    }

    .edvibe-batch-user-management-table {
        min-width: 760px;
    }
}

`,Ya=`edvibe-toolbox-batch-user-management-dialog`,Xa=`edvibe-toolbox-batch-user-management-overlay`,Za=class extends G{static styles=[Ae,je,Ja];static properties={rows:{state:!0},emailState:{state:!0},emailInput:{state:!0},mode:{state:!0},errors:{state:!0},statusMessage:{state:!0},statusError:{state:!0},progress:{state:!0}};constructor(){super(),this.rows=[],this.emailState={validCount:0,malformedCount:0},this.emailInput=``,this.mode=`configure`,this.errors=[],this.statusMessage=``,this.statusError=!1,this.progress={visible:!1,completed:0,total:0},this.handleKeydownBound=e=>this.handleKeydown(e)}connectedCallback(){super.connectedCallback(),this.id||=Xa,this.ownerDocument?.addEventListener(`keydown`,this.handleKeydownBound)}disconnectedCallback(){this.ownerDocument?.removeEventListener(`keydown`,this.handleKeydownBound),super.disconnectedCallback()}configure(){return this}setEmailState(e={}){return this.emailState={validCount:Math.max(0,Number(e?.validCount)||0),malformedCount:Math.max(0,Number(e?.malformedCount)||0)},this}showConfigure(){return this.mode=`configure`,this.clearMessages(),this}showChecking(e=`Проверяем пользователей…`){return this.mode=`checking`,this.clearMessages(),this.setStatus(e),this}showValidationErrors(e=[]){return this.mode=`validation-error`,this.errors=this.normalizeErrors(e),this.progress={visible:!1,completed:0,total:0},this.setStatus(`Исправьте ошибки и повторите проверку.`,`error`),this}showReview({rows:e=[]}={}){return this.mode=`review`,this.rows=this.normalizeRows(e),this.clearMessages(),this.setStatus(`Выберите операции для пользователей.`),this}showExecution(e={}){this.mode=`executing`;let t=Math.max(0,Number(e.completed)||0),n=Math.max(0,Number(e.total)||0),r=Math.max(0,Number(e.successes)||0),i=Math.max(0,Number(e.failures)||0);this.progress={visible:!0,completed:t,total:n};let a=e.current?.email&&e.current?.operation?` Сейчас: ${e.current.email} — ${{unassign:`снятие куратора`,delete:`удаление пользователя`}[e.current.operation]||e.current.operation}.`:``;return this.setStatus(`Выполнено: ${t} из ${n}. Успешно: ${r}. Ошибок: ${i}.${a}`),this}showComplete(e={}){this.rows=this.normalizeRows(Array.isArray(e.rows)?e.rows:this.rows);let t=Math.max(0,Number(e.failures)||0);return this.mode=t>0?`partial-complete`:`complete`,this.clearMessages(),this.setStatus(t>0?`Завершено с ошибками. Успешно: ${Math.max(0,Number(e.successes)||0)}.`:`Готово.`),this}showFatalError(e){return this.mode=`fatal-error`,this.clearMessages(),this.errors=this.normalizeErrors([e]),this.setStatus(`Не удалось загрузить пользователей.`,`error`),this}normalizeRows(e){return e.map(e=>({...e,result:{...e.result||{status:`pending`,message:`Not started`}}}))}normalizeErrors(e){return(Array.isArray(e)?e:[e]).map(e=>typeof e==`string`?e:String(e?.message||`Неизвестная ошибка.`))}selectOperation(e,t,n){this.isLocked()||e.actionable===!1||(this.rows=this.rows.map(r=>r===e?{...r,[`${t}Selected`]:!!n,result:{...r.result||{}}}:r),this.dispatchSelectionChange())}selectAll(e,t){this.isLocked()||(this.rows=this.rows.map(n=>n.actionable===!1?n:{...n,[`${e}Selected`]:!!t,result:{...n.result||{}}}),this.dispatchSelectionChange())}allSelected(e){let t=this.rows.filter(e=>e.actionable!==!1);return t.length>0&&t.every(t=>t[`${e}Selected`])}dispatchSelectionChange(){this.dispatchEvent(new CustomEvent(`edvibe-batch-user-management-selection-change`,{detail:{rows:this.copyRows()}}))}handleInput(e){this.emailInput=String(e.currentTarget.value||``),this.dispatchEvent(new CustomEvent(`edvibe-batch-user-management-input-change`,{detail:{emailInput:this.emailInput}}))}handleCheck(){this.canCheck()&&this.dispatchEvent(new CustomEvent(`edvibe-batch-user-management-check`,{detail:{emailInput:this.emailInput}}))}handleStart(){this.canStart()&&this.dispatchEvent(new CustomEvent(`edvibe-batch-user-management-start`,{detail:{rows:this.copyRows()}}))}handleRestart(){[`complete`,`partial-complete`].includes(this.mode)&&(this.rows=[],this.mode=`configure`,this.emailInput=``,this.setEmailState({validCount:0,malformedCount:0}),this.clearMessages(),this.dispatchEvent(new CustomEvent(`edvibe-batch-user-management-restart`)))}handleBackdropClick(e){e.target===e.currentTarget&&this.close()}handleKeydown(e){e.key===`Escape`&&this.close()}close(){this.canClose()&&(this.dispatchEvent(new CustomEvent(`edvibe-dialog-close`)),this.remove())}copyRows(){return this.rows.map(e=>({...e,result:{...e.result||{}}}))}clearMessages(){this.errors=[],this.progress={visible:!1,completed:0,total:0},this.setStatus(``)}setStatus(e,t=``){this.statusMessage=String(e||``),this.statusError=t===`error`}isLocked(){return[`checking`,`executing`,`complete`,`partial-complete`].includes(this.mode)}canCheck(){return[`configure`,`validation-error`].includes(this.mode)&&this.emailInput.trim().length>0}canStart(){return this.mode===`review`&&this.rows.some(e=>e.actionable!==!1&&(e.unassignSelected||e.deleteSelected))}canClose(){return[`configure`,`validation-error`,`review`,`complete`,`partial-complete`,`fatal-error`].includes(this.mode)}renderRow(e){let t=this.isLocked();return U`
            <tr>
                <td class="edvibe-batch-user-management-user">${e.pupil?.Name?`${e.pupil.Name} — `:``}${e.email}</td>
                <td><input class="operation-unassign" type="checkbox"
                    .checked=${!!e.unassignSelected} ?disabled=${e.actionable===!1||t}
                    @change=${t=>this.selectOperation(e,`unassign`,t.currentTarget.checked)}></td>
                <td><input class="operation-delete" type="checkbox"
                    .checked=${!!e.deleteSelected} ?disabled=${e.actionable===!1||t}
                    @change=${t=>this.selectOperation(e,`delete`,t.currentTarget.checked)}></td>
                <td class="edvibe-batch-user-management-result">${String(e.result?.message||e.message||``)}</td>
            </tr>
        `}render(){let e=[`complete`,`partial-complete`].includes(this.mode),t=this.isLocked(),n=`edvibe-batch-user-management-status${this.statusError?` is-error`:``}`;return U`
<div class="edvibe-batch-user-management-overlay" @click=${this.handleBackdropClick}>
                <section class="edvibe-batch-user-management-card" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-user-management-title">
                    <header class="edvibe-batch-user-management-header">
                        <div><h2 id="edvibe-batch-user-management-title">Управление пользователями</h2>
                            <p class="edvibe-batch-user-management-description">Снимите кураторов и удалите пользователей по списку email.</p></div>
                        <button class="edvibe-batch-user-management-close" type="button" aria-label="Закрыть"
                            ?disabled=${!this.canClose()} @click=${()=>this.close()}>&times;</button>
                    </header>
                    <div class="edvibe-batch-user-management-body">
                        <section class="edvibe-batch-user-management-configure">
                            <label for="edvibe-batch-user-management-emails">Email пользователей</label>
                            <textarea id="edvibe-batch-user-management-emails" class="edvibe-batch-user-management-emails"
                                rows="5" placeholder="user@example.com" .value=${this.emailInput}
                                ?disabled=${t||e||this.mode===`fatal-error`} @input=${this.handleInput}></textarea>
                            <div class="edvibe-batch-user-management-email-state" aria-live="polite">
                                <span class="edvibe-batch-user-management-email-count">Уникальных email: ${this.emailState.validCount}</span>
                                <span class="edvibe-batch-user-management-malformed-count">Некорректных: ${this.emailState.malformedCount}</span>
                            </div>
                        </section>
                        <section class="edvibe-batch-user-management-errors" aria-live="polite" ?hidden=${this.errors.length===0}>
                            ${this.errors.map(e=>U`<p class="edvibe-batch-user-management-error">${e}</p>`)}
                        </section>
                        <section class="edvibe-batch-user-management-table-wrap" ?hidden=${this.rows.length===0}>
                            <table class="edvibe-batch-user-management-table">
                                <thead><tr><th scope="col">Пользователь</th>
                                    <th scope="col">Снять куратора <button class="edvibe-batch-user-management-select-all-unassign" type="button"
                                        ?disabled=${t||this.rows.length===0} @click=${()=>this.selectAll(`unassign`,!this.allSelected(`unassign`))}>Выбрать все</button></th>
                                    <th scope="col">Удалить пользователя <button class="edvibe-batch-user-management-select-all-delete" type="button"
                                        ?disabled=${t||this.rows.length===0} @click=${()=>this.selectAll(`delete`,!this.allSelected(`delete`))}>Выбрать все</button></th>
                                    <th scope="col">Результат</th></tr></thead>
                                <tbody class="edvibe-batch-user-management-table-body">${this.rows.map(e=>this.renderRow(e))}</tbody>
                            </table>
                        </section>
                    </div>
                    <div class="edvibe-batch-user-management-live-region">
                        <p class=${n} role="status" aria-live="polite">${this.statusMessage}</p>
                        <progress class="edvibe-batch-user-management-progress" max=${this.progress.total}
                            value=${this.progress.completed} ?hidden=${!this.progress.visible}></progress>
                    </div>
                    <footer class="edvibe-batch-user-management-footer">
                        <button class="edvibe-batch-user-management-restart" type="button" ?hidden=${!e}
                            ?disabled=${!e} @click=${this.handleRestart}>Запустить другую группу</button>
                        <button class="edvibe-batch-user-management-start" type="button" ?hidden=${this.mode!==`review`}
                            ?disabled=${!this.canStart()} @click=${this.handleStart}>Начать обработку</button>
                        <button class="edvibe-batch-user-management-check" type="button"
                            ?hidden=${![`configure`,`validation-error`].includes(this.mode)} ?disabled=${!this.canCheck()}
                            @click=${this.handleCheck}>Проверить пользователей</button>
                    </footer>
                </section>
            </div>
        `}};customElements.get(`edvibe-toolbox-batch-user-management-dialog`)||customElements.define(Ya,Za),globalThis.EdVibeBatchUserManagementDialog={USER_MANAGEMENT_DIALOG_TAG:Ya,USER_MANAGEMENT_OVERLAY_ID:Xa,BatchUserManagementDialog:Za};var Qa=`edvibe-toolbox-batch-user-onboarding-dialog`,$a=`batch_user_onboarding`,eo=new Set([`SERVER_REJECTED`,`INVALID_RESPONSE`,`REQUEST_TIMEOUT`,`SEND_FAILED`]);function to(e,t,n={}){return Y(e,t,n)}function no(e){if(!e||typeof e!=`object`||Object.isFrozen(e))return e;Object.freeze(e);for(let t of Object.values(e))no(t);return e}function ro(e){let t=Number(e?.Id),n=Number(e?.TeacherId);if(!Number.isSafeInteger(t)||t<=0||!Number.isSafeInteger(n)||n<=0)throw to(`INVALID_MODERATOR_RESPONSE`,`The moderator catalogue contained an invalid identifier.`);return Object.freeze({id:t,teacherId:n,name:String(e?.Name||``).trim()||null,email:String(e?.Email||``).trim()||null})}function io(e){if(!Array.isArray(e))throw to(`INVALID_MODERATOR_RESPONSE`,`The moderator catalogue was not an array.`);let t=e.map(ro),n=new Set,r=new Set;for(let e of t){if(n.has(e.id)||r.has(e.teacherId))throw to(`INVALID_MODERATOR_RESPONSE`,`The moderator catalogue contained ambiguous identifiers.`);n.add(e.id),r.add(e.teacherId)}return Object.freeze(t)}async function ao({sendRequest:e,marathonId:t}){return io((await e(`MarathonModeratorWsController`,`GetMarathonModerators`,`Marathons`,{MarathonId:t}))?.Value?.Items)}function oo(e){return new Map((e||[]).map(e=>[e.teacherId,e]))}function so(e,t){if(!Array.isArray(e))return Object.freeze({safe:!1,moderators:Object.freeze([]),code:`UNSAFE_MODERATOR_REPLACEMENT`,message:`Current curator assignments could not be interpreted safely.`});let n=oo(t),r=[],i=new Set;for(let t of e){let e=Number(t?.TeacherId),a=n.get(e);if(!Number.isSafeInteger(e)||!a||i.has(a.id))return Object.freeze({safe:!1,moderators:Object.freeze([]),code:`UNSAFE_MODERATOR_REPLACEMENT`,message:`Existing curator assignments cannot be preserved without guessing.`});i.add(a.id),r.push(a)}return Object.freeze({safe:!0,moderators:Object.freeze(r),code:null,message:null})}function co(e){return e?Object.freeze({email:String(e.Email||``).trim()||null,name:String(e.Name||e.DisplayName||e.FullName||``).trim()||null,pupilId:Number.isSafeInteger(Number(e.PupilId))?Number(e.PupilId):null,marathonPupilId:Number.isSafeInteger(Number(e.MarathonPupilId))?Number(e.MarathonPupilId):null}):null}function lo(e){let t=new Map;for(let n of Array.isArray(e)?e:[]){let e=String(n?.Email||``).trim().toLowerCase();if(!e)continue;let r=t.get(e)||[];r.push(n),t.set(e,r)}return t}function uo(e,t,n){let r=lo(t),i=[];for(let t of e?.items||[]){if(!t.isValid){i.push(Object.freeze({email:t.input,normalizedEmail:t.normalized,resolution:`invalid`,membership:`unknown`,user:null,currentModerators:Object.freeze([]),moderatorStateSafe:!1,actionable:!1,message:`Invalid email address: ${t.input}.`,addSelected:!1,assignSelected:!1}));continue}let e=r.get(t.normalized)||[];if(e.length>1){i.push(Object.freeze({email:t.input,normalizedEmail:t.normalized,resolution:`ambiguous`,membership:`ambiguous`,user:null,currentModerators:Object.freeze([]),moderatorStateSafe:!1,actionable:!1,message:`Multiple marathon users matched ${t.input}.`,addSelected:!1,assignSelected:!1}));continue}if(e.length===0){i.push(Object.freeze({email:t.input,normalizedEmail:t.normalized,resolution:`resolvable_not_in_marathon`,membership:`not_in_marathon`,user:null,currentModerators:Object.freeze([]),moderatorStateSafe:!0,actionable:!0,message:`Not currently in the marathon; the recorded add-by-email workflow is available.`,addSelected:!1,assignSelected:!1}));continue}let a=so(e[0].Moderators,n);i.push(Object.freeze({email:t.input,normalizedEmail:t.normalized,resolution:`in_marathon`,membership:`in_marathon`,user:co(e[0]),currentModerators:a.moderators,moderatorStateSafe:a.safe,actionable:!0,message:a.safe?`Already in the marathon.`:a.message,addSelected:!1,assignSelected:!1}))}return Object.freeze(i)}function fo(e,t,n,r=null){return Object.freeze({status:e,code:t,message:n,dependency:r})}function po(e,t){let n=Number(t);return(e||[]).find(e=>e.id===n)||null}function mo({rows:e,moderators:t,targetModeratorId:n}){let r=Array.isArray(e)?e:[],i=r.some(e=>!!e.assignSelected),a=i?po(t,n):null;if(i&&!a)throw to(`CURATOR_REQUIRED`,`Select a curator before preparing the execution plan.`);let o=r.map(e=>{let t=!!e.addSelected,n=!!e.assignSelected,r=null,i=null;return t&&(r=e.actionable?e.membership===`in_marathon`?fo(`noop`,`USER_ALREADY_IN_MARATHON`,`User is already in the marathon.`):fo(`pending`,`USER_ADD_PENDING`,`User will be added to the marathon.`):fo(`rejected`,`INVALID_USER_INPUT`,e.message||`The user is not actionable.`)),n&&(i=e.actionable?e.moderatorStateSafe?e.membership===`not_in_marathon`&&!t?fo(`rejected`,`USER_NOT_IN_MARATHON`,`Curator assignment requires adding this user first.`):e.membership===`in_marathon`&&e.currentModerators.some(e=>e.teacherId===a.teacherId)?fo(`noop`,`CURATOR_ALREADY_ASSIGNED`,`Target curator is already assigned.`):fo(`pending`,`CURATOR_ASSIGNMENT_PENDING`,e.membership===`not_in_marathon`?`The curator will be assigned by the recorded add-user request.`:`The curator will be added while preserving all current curators.`,e.membership===`not_in_marathon`?Object.freeze({blockedBy:`add_user`}):null):fo(`rejected`,`UNSAFE_MODERATOR_REPLACEMENT`,`Existing curator assignments cannot be preserved safely.`):fo(`rejected`,`INVALID_USER_INPUT`,e.message||`The user is not actionable.`)),no({itemId:e.normalizedEmail||e.email,email:e.email,normalizedEmail:e.normalizedEmail,resolution:e.resolution,membership:e.membership,user:e.user?{...e.user}:null,currentModerators:(e.currentModerators||[]).map(e=>({...e})),moderatorStateSafe:!!e.moderatorStateSafe,actionable:!!e.actionable,message:e.message||``,selectedOperations:Object.freeze([...t?[`add_user`]:[],...n?[`assign_curator`]:[]]),addSelected:t,assignSelected:n,add:r,assign:i,targetModerator:a?{...a}:null})}),s=e=>o.reduce((t,n)=>t+ +(n.add?.status===e)+ +(n.assign?.status===e),0);return no({rows:o,targetModerator:a?{...a}:null,counts:{requested:o.length,selectedOperations:o.reduce((e,t)=>e+t.selectedOperations.length,0),additions:o.filter(e=>e.addSelected).length,assignments:o.filter(e=>e.assignSelected).length,noOps:s(`noop`),rejectedOperations:s(`rejected`),dependentAssignments:o.filter(e=>e.assign?.dependency?.blockedBy===`add_user`).length}})}function ho(e,t=2){return String(e).padStart(t,`0`)}function go(e){let t=e instanceof Date?e:new Date(e);if(Number.isNaN(t.getTime()))throw to(`INVALID_CLIENT_TIME`,`Could not build the Edvibe client timestamp.`);return`${t.getFullYear()}-${ho(t.getMonth()+1)}-${ho(t.getDate())}T${ho(t.getHours())}:${ho(t.getMinutes())}:${ho(t.getSeconds())}.${ho(t.getMilliseconds(),3)}`}function _o({marathonId:e,emails:t,moderatorIds:n=[],host:r=`edvibe.com`,now:i=new Date,userId:a=null}){let o=(t||[]).map(e=>String(e||``).trim()).filter(Boolean);if(o.length===0)throw to(`EMAILS_REQUIRED`,`At least one email is required for addition.`);let s=String(r||``).trim()||`edvibe.com`,c={MarathonId:e,Emails:o,MailMessageLanguageId:0,ModeratorsIds:[...n],AccessGroups:[],Domain:s,ApiHost:s,ClientTime:go(i),DeviceType:`desktop`},l=Number(a);return Number.isSafeInteger(l)&&l>0&&(c.UserId=l),no({controller:`MarathonPupilsWsController`,method:`AddMarathonPupil`,projectName:`Marathons`,value:c})}function vo({marathonId:e,marathonPupilId:t,existingModeratorIds:n,targetModeratorId:r}){let i=[...new Set([...(n||[]).map(Number),Number(r)])];if(i.some(e=>!Number.isSafeInteger(e)||e<=0))throw to(`UNSAFE_MODERATOR_REPLACEMENT`,`A safe complete curator list could not be constructed.`);return no({controller:`MarathonPupilsWsController`,method:`AddModeratorsToPupil`,projectName:`Marathons`,value:{MarathonId:e,MarathonPupilId:t,SelectedModeratorsIds:i}})}function Z(e,t,n,r=0,i=null){return{status:e,code:t,message:n,attempts:r,dependency:i}}function yo(e){let t=(e,t)=>e?Z(e.status===`pending`?`not_attempted`:e.status,e.status===`pending`?`NOT_ATTEMPTED`:e.code,e.status===`pending`?`${t} has not been attempted yet.`:e.message,0,e.dependency):null;return e.rows.map(e=>({...e,currentModerators:e.currentModerators.map(e=>({...e})),runtimePupil:e.user?{...e.user}:null,addResult:t(e.add,`The addition`),assignResult:t(e.assign,`The curator assignment`)}))}function bo(e){return e?.status===`not_attempted`}function xo(e){return e&&![`rejected`,`failed`,`skipped`].includes(e.status)}function So(e){return(e||[]).map(e=>e.teacherId).sort((e,t)=>e-t)}function Co(e,t){return e.length===t.length&&e.every((e,n)=>e===t[n])}function wo(e,t,n){e.addSelected&&xo(e.addResult)&&(e.addResult=Z(`rejected`,t,n)),e.assignSelected&&xo(e.assignResult)&&(e.assignResult=Z(`rejected`,t,n))}function To({rows:e,pupils:t,moderators:n,targetModerator:r}){let i=lo(t);for(let t of e){if(!t.actionable||t.selectedOperations.length===0)continue;let e=i.get(t.normalizedEmail)||[];if(e.length>1){wo(t,`USER_AMBIGUOUS`,`The user became ambiguous before execution.`);continue}if(t.membership===`in_marathon`){if(e.length!==1||Number(e[0].MarathonPupilId)!==Number(t.user?.marathonPupilId)){wo(t,`STATE_CHANGED`,`Marathon membership changed after preflight.`);continue}let i=e[0];if(t.runtimePupil=co(i),t.addSelected&&xo(t.addResult)&&(t.addResult=Z(`noop`,`USER_ALREADY_IN_MARATHON`,`User is already in the marathon.`)),!t.assignSelected||!xo(t.assignResult))continue;let a=so(i.Moderators,n);if(!a.safe){t.assignResult=Z(`rejected`,a.code,a.message);continue}if(!Co(So(t.currentModerators),So(a.moderators))){t.assignResult=Z(`rejected`,`STATE_CHANGED`,`Current curator assignments changed after preflight.`);continue}t.currentModerators=a.moderators.map(e=>({...e})),t.assignResult=a.moderators.some(e=>e.teacherId===r?.teacherId)?Z(`noop`,`CURATOR_ALREADY_ASSIGNED`,`Target curator is already assigned.`):Z(`not_attempted`,`NOT_ATTEMPTED`,`The curator assignment has not been attempted yet.`);continue}if(t.membership!==`not_in_marathon`||e.length===0)continue;let a=e[0];if(t.runtimePupil=co(a),t.addSelected&&xo(t.addResult)&&(t.addResult=Z(`noop`,`USER_ALREADY_IN_MARATHON`,`User entered the marathon after preflight; no duplicate add was sent.`)),t.assignSelected&&xo(t.assignResult)){let e=so(a.Moderators,n);t.assignResult=e.safe&&e.moderators.some(e=>e.teacherId===r?.teacherId)?Z(`noop`,`CURATOR_ALREADY_ASSIGNED`,`Target curator was assigned after preflight.`):Z(`rejected`,`STATE_CHANGED`,`The user entered the marathon after preflight; curator state was not part of the confirmed plan.`)}}return e}function Eo(e,t){return!e?.code||e.code===`WS_UNAVAILABLE`||e.code===`SEND_FAILED`&&!t().isOpen||!eo.has(e.code)}function Do(e){let t=e.flatMap(e=>[e.addResult,e.assignResult]).filter(Boolean);return{completed:t.filter(e=>e.status!==`not_attempted`).length,total:t.length,successes:t.filter(e=>[`success`,`noop`].includes(e.status)).length,failures:t.filter(e=>[`failed`,`rejected`,`skipped`].includes(e.status)).length}}function Oo(e,t,n=null){try{e?.({...Do(t),current:n})}catch{}}async function ko({rows:e,marathonId:t,targetModerator:n,includeModerator:r,sendRequest:i,wait:a,getConnectionState:o,getRequestContext:s,now:c}){let l=e.filter(e=>bo(e.addResult)&&e.membership===`not_in_marathon`&&!!e.assignSelected===r);if(l.length===0)return{targets:l,confirmed:!1,fatalError:null};let u=s?.()||{},d=_o({marathonId:t,emails:l.map(e=>e.email),moderatorIds:r?[n.id]:[],host:u.host,userId:u.userId,now:c()});try{let e=await oi(async()=>{let e=await i(d.controller,d.method,d.projectName,d.value);if(e?.Value?.IsSuccess!==!0)throw to(`INVALID_RESPONSE`,`User addition was not positively confirmed.`);return e},{wait:a,getConnectionState:o});for(let t of l)t.addRequestAttempts=e.attempts;return{targets:l,confirmed:!0,fatalError:null}}catch(e){for(let t of l)t.addResult=Z(`failed`,e.code||`USER_ADD_FAILED`,e.message||`User addition failed.`,e.attempts||1),bo(t.assignResult)&&(t.assignResult=Z(`skipped`,`ASSIGNMENT_BLOCKED_BY_ADD_FAILURE`,`Curator assignment was skipped because user addition failed.`,0,{blockedBy:`add_user`}));return{targets:l,confirmed:!1,fatalError:Eo(e,o)?e:null}}}function Ao({groups:e,pupils:t,targetModerator:n}){let r=lo(t);for(let t of e.filter(e=>e.confirmed))for(let e of t.targets){let t=r.get(e.normalizedEmail)||[];if(t.length!==1){e.addResult=Z(`failed`,`INVALID_USER_RESPONSE`,t.length===0?`The add request succeeded, but the user was not found in the refreshed marathon roster.`:`The add request succeeded, but the refreshed user identity was ambiguous.`,e.addRequestAttempts||1),bo(e.assignResult)&&(e.assignResult=Z(`skipped`,`ASSIGNMENT_BLOCKED_BY_ADD_FAILURE`,`Curator assignment was skipped because the added user could not be resolved safely.`,0,{blockedBy:`add_user`}));continue}let i=t[0];e.runtimePupil=co(i),e.addResult=Z(`success`,`USER_ADDED`,`User was added to the marathon.`,e.addRequestAttempts||1),bo(e.assignResult)&&e.assignSelected&&(e.assignResult=Array.isArray(i.Moderators)&&i.Moderators.some(e=>Number(e?.TeacherId)===Number(n?.teacherId))?Z(`success`,`CURATOR_ASSIGNED`,`Target curator was assigned during user addition.`,e.addRequestAttempts||1,{blockedBy:`add_user`}):Z(`failed`,`INVALID_MODERATOR_RESPONSE`,`The user was added, but the target curator was not confirmed on the refreshed roster.`,e.addRequestAttempts||1,{blockedBy:`add_user`}))}}function jo(e,t){for(let n of e.filter(e=>e.confirmed))for(let e of n.targets)bo(e.addResult)&&(e.addResult=Z(`failed`,`ADD_VERIFICATION_FAILED`,`The add request was accepted, but per-user verification could not finish: ${t?.message||`operation interrupted`}`,e.addRequestAttempts||1),bo(e.assignResult)&&(e.assignResult=Z(`skipped`,`ASSIGNMENT_BLOCKED_BY_ADD_FAILURE`,`Curator assignment could not be verified because the added user was not safely resolved.`,0,{blockedBy:`add_user`})))}async function Mo({rows:e,marathonId:t,targetModerator:n,sendRequest:r,wait:i,getConnectionState:a,requestDelayMs:o,onProgress:s}){let c=null,l=e.filter(e=>bo(e.assignResult)&&e.membership===`in_marathon`&&e.runtimePupil?.marathonPupilId);for(let[u,d]of l.entries()){if(c)break;let f=vo({marathonId:t,marathonPupilId:d.runtimePupil.marathonPupilId,existingModeratorIds:d.currentModerators.map(e=>e.id),targetModeratorId:n.id});try{d.assignResult=Z(`success`,`CURATOR_ASSIGNED`,`Target curator was assigned while preserving existing curators.`,(await oi(async()=>{let e=await r(f.controller,f.method,f.projectName,f.value);if(e?.Value?.IsSuccess!==!0)throw to(`INVALID_RESPONSE`,`Curator assignment was not positively confirmed.`);return e},{wait:i,getConnectionState:a})).attempts)}catch(e){d.assignResult=Z(`failed`,e.code||`CURATOR_ASSIGNMENT_FAILED`,e.message||`Curator assignment failed.`,e.attempts||1),Eo(e,a)&&(c=e)}Oo(s,e,{email:d.email,operation:`assign_curator`}),u<l.length-1&&o>0&&!c&&await i(o)}return c}function No(e,t=`Not attempted because the operation stopped.`){for(let n of e)bo(n.addResult)&&(n.addResult=Z(`not_attempted`,`NOT_ATTEMPTED`,t)),bo(n.assignResult)&&(n.assignResult=Z(`not_attempted`,`NOT_ATTEMPTED`,t))}function Po(e,t){for(let n of e)wo(n,t?.code||`STATE_CHANGED`,t?.message||`The confirmed plan could not be revalidated.`)}async function Fo({plan:e,marathonId:t,sendRequest:n,wait:r,getConnectionState:i,getRequestContext:a=()=>({host:`edvibe.com`}),now:o=()=>new Date,requestDelayMs:s=250,onProgress:c=()=>{}}){let l=yo(e),u=[],d=null,f=!1;try{let[p,m]=await Promise.all([ui({sendRequest:n,marathonId:t}),ao({sendRequest:n,marathonId:t})]),h=e.targetModerator?po(m,e.targetModerator.id):null;if(e.targetModerator&&(!h||h.teacherId!==e.targetModerator.teacherId))throw to(`STATE_CHANGED`,`The selected curator changed or disappeared after preflight.`);To({rows:l,pupils:p,moderators:m,targetModerator:h}),Oo(c,l,{operation:`revalidate`});for(let e of[!1,!0]){if(!l.some(t=>bo(t.addResult)&&t.membership===`not_in_marathon`&&!!t.assignSelected===e))continue;f=!0;let p=await ko({rows:l,marathonId:t,targetModerator:h,includeModerator:e,sendRequest:n,wait:r,getConnectionState:i,getRequestContext:a,now:o});if(u.push(p),d||=p.fatalError,Oo(c,l,{operation:e?`add_user_with_curator`:`add_user`}),d)break;s>0&&await r(s)}!d&&u.some(e=>e.confirmed)&&(Ao({groups:u,pupils:await ui({sendRequest:n,marathonId:t}),targetModerator:h}),Oo(c,l,{operation:`verify_additions`})),!d&&h&&(l.some(e=>bo(e.assignResult)&&e.membership===`in_marathon`)&&(f=!0),d=await Mo({rows:l,marathonId:t,targetModerator:h,sendRequest:n,wait:r,getConnectionState:i,requestDelayMs:s,onProgress:c}))}catch(e){d=e}return d&&u.some(e=>e.confirmed)&&jo(u,d),d&&!f&&Po(l,d),No(l,d?`Not attempted because the operation stopped.`:`The selected operation was not applicable after revalidation.`),Oo(c,l,null),no({plan:e,rows:l.map(e=>({itemId:e.itemId,email:e.email,normalizedEmail:e.normalizedEmail,resolution:e.resolution,membership:e.membership,user:e.runtimePupil?{...e.runtimePupil}:e.user?{...e.user}:null,currentModerators:e.currentModerators.map(e=>({...e})),targetModerator:e.targetModerator?{...e.targetModerator}:null,selectedOperations:[...e.selectedOperations],addResult:e.addResult?{...e.addResult}:null,assignResult:e.assignResult?{...e.assignResult}:null,message:e.message})),fatalError:d?Object.freeze({code:d.code||`INTERNAL_ERROR`,message:d.message||`The operation stopped unexpectedly.`}):null})}function Io(e){let t=[e.addResult,e.assignResult].filter(Boolean);return e.resolution===`invalid`||e.resolution===`ambiguous`?`rejected`:t.length===0?`skipped`:t.some(e=>e.status===`failed`)?`failed`:t.some(e=>e.status===`not_attempted`)?`not_attempted`:t.some(e=>e.status===`rejected`)?`rejected`:t.some(e=>e.status===`skipped`)?`skipped`:t.every(e=>e.status===`noop`)?`noop`:`success`}function Lo(e){let t=[`Edvibe Toolbox: batch user onboarding`,`Requested users: ${e.plan.counts.requested}`,`Selected additions: ${e.plan.counts.additions}`,`Selected assignments: ${e.plan.counts.assignments}`,e.plan.targetModerator?`Target curator: ${e.plan.targetModerator.name||e.plan.targetModerator.email||e.plan.targetModerator.id}`:`Target curator: not selected`,``];for(let n of e.rows){let e=n.user?.name?`${n.user.name} <${n.email}>`:n.email;t.push(`[${Io(n)}] ${e}`),n.addResult&&t.push(`  add_user: ${n.addResult.status} ${n.addResult.code} — ${n.addResult.message}`),n.assignResult&&t.push(`  assign_curator: ${n.assignResult.status} ${n.assignResult.code} — ${n.assignResult.message}`),!n.addResult&&!n.assignResult&&t.push(`  discovery: ${n.resolution} — ${n.message||`No operation selected.`}`)}return e.fatalError&&t.push(``,`Interrupted: ${e.fatalError.code} — ${e.fatalError.message}`),t.join(`
`)}function Ro(e){let t=e.map(Io);return Object.freeze({requested:e.length,eligible:e.filter(e=>![`invalid`,`ambiguous`].includes(e.resolution)&&e.selectedOperations.length>0).length,attempted:e.filter(e=>[e.addResult,e.assignResult].filter(Boolean).some(e=>![`not_attempted`,`rejected`].includes(e.status))).length,successful:t.filter(e=>e===`success`).length,noOp:t.filter(e=>e===`noop`).length,skipped:t.filter(e=>e===`skipped`||e===`rejected`).length,failed:t.filter(e=>e===`failed`).length,notAttempted:t.filter(e=>e===`not_attempted`).length})}function zo(e,t){return t?Object.freeze({name:e,status:t.status,attemptCount:Number(t.attempts)||0,code:t.code||null,message:t.message||null,dependency:t.dependency?Object.freeze({...t.dependency}):null}):null}function Bo({marathonId:e,marathonName:t=null,startedAt:n,completedAt:r,result:i}){let a=i.rows||[],o=Ro(a),s={selected:0,attempted:0,successful:0,noOp:0,skipped:0,rejected:0,failed:0,notAttempted:0},c=a.map(e=>{let t=[zo(`add_user`,e.addResult),zo(`assign_curator`,e.assignResult)].filter(Boolean);for(let e of t)s.selected+=1,[`not_attempted`,`rejected`].includes(e.status)||(s.attempted+=1),e.status===`success`&&(s.successful+=1),e.status===`noop`&&(s.noOp+=1),e.status===`skipped`&&(s.skipped+=1),e.status===`rejected`&&(s.rejected+=1),e.status===`failed`&&(s.failed+=1),e.status===`not_attempted`&&(s.notAttempted+=1);let n=Io(e);return Object.freeze({itemId:e.itemId,label:e.email,status:n,code:{success:`USER_ONBOARDING_COMPLETED`,noop:`USER_ONBOARDING_NOOP`,skipped:`USER_ONBOARDING_SKIPPED`,rejected:`USER_ONBOARDING_REJECTED`,failed:`USER_ONBOARDING_FAILED`,not_attempted:`NOT_ATTEMPTED`}[n],message:t.map(e=>e.message).filter(Boolean).join(`; `)||e.message||`No operation selected.`,attempts:t.reduce((e,t)=>e+t.attemptCount,0),data:Object.freeze({submittedInput:e.email,normalizedEmail:e.normalizedEmail,resolution:e.resolution,membershipPreflight:e.membership,user:e.user?Object.freeze({...e.user}):null,existingCurators:Object.freeze(e.currentModerators.map(e=>Object.freeze({...e}))),targetCurator:e.targetModerator?Object.freeze({...e.targetModerator}):null,selectedOperations:Object.freeze([...e.selectedOperations]),operations:Object.freeze(t)})})});return no({operationType:$a,startedAt:n,completedAt:r,status:i.fatalError?`interrupted`:o.failed>0||o.skipped>0?`completed_with_failures`:`completed`,pageContext:{marathonId:String(e),marathonName:t},counts:o,results:c,message:JSON.stringify({userCounts:o,operationCounts:s})})}function Vo({sendRequest:e,getConnectionState:t,wait:n,canStart:r,onActiveChange:i,createDialog:a=()=>document.createElement(Qa),copyText:o=e=>navigator.clipboard.writeText(e),persistExecution:s=async()=>Object.freeze({stored:!1}),openHistory:c=()=>{},getLocationHref:l=()=>window.location.href,getMarathonName:u=()=>document.querySelector(`h1`)?.textContent?.trim()||document.title||null,getRequestContext:d=()=>({host:window.location.hostname}),now:f=()=>new Date,log:p=()=>{}}){let m=!1;function h(){m&&(m=!1,i(!1))}async function g(){if(m||!r()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}let g=ni(l());if(!g){window.alert(`Open an Edvibe marathon page before adding users.`);return}m=!0,i(!0);let _=a();(document.body||document.documentElement).appendChild(_);try{_.showLoading?.(`Loading marathon users and curators…`);let[r,i]=await Promise.all([ui({sendRequest:e,marathonId:g}),ao({sendRequest:e,marathonId:g})]),a=[];_.configure({moderators:i,parseEmailInput:ya,onDiscover({emailInput:e}){let t=ya(e);if(t.items.length===0)throw to(`EMAILS_REQUIRED`,`Enter at least one email address.`);return a=uo(t,r,i),a},onPreflight({rows:e,targetModeratorId:t}){let n=new Map((e||[]).map(e=>[e.normalizedEmail,{addSelected:!!e.addSelected,assignSelected:!!e.assignSelected}])),r=mo({rows:a.map(e=>({...e,...n.get(e.normalizedEmail)||{addSelected:!1,assignSelected:!1}})),moderators:i,targetModeratorId:t});if(r.counts.selectedOperations===0)throw to(`OPERATIONS_REQUIRED`,`Select at least one add or curator-assignment operation.`);return r},async onExecute(r,i){let a=f().toISOString(),o=await Fo({plan:r,marathonId:g,sendRequest:e,wait:n,getConnectionState:t,getRequestContext:d,now:f,onProgress:i}),c=Lo(o),l=f().toISOString(),m;try{m=await s(Bo({marathonId:g,marathonName:u(),startedAt:a,completedAt:l,result:o}))}catch(e){m=Object.freeze({stored:!1,persistenceError:e}),p(`Batch user onboarding history persistence failed:`,e)}return{...o,report:c,history:m}},onCopy:o,onOpenHistory(e){_.remove(),h(),c(e)},onClose(){_.remove(),h()}}),_.showConfigure?.(),p(`Batch user onboarding initialized for MarathonId ${g}.`)}catch(e){p(`Batch user onboarding initialization failed (${e.code||`UNKNOWN_ERROR`}).`),_.remove(),h(),window.alert(e.message||`Could not initialize batch user onboarding.`)}}return Object.freeze({open:g})}var Ho=g`
:host {
    all: initial;
}

[hidden] {
    display: none !important;
}

.overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
    background: rgba(15, 23, 42, .62);
    color: #1f2937;
    font-family: "Segoe UI", Arial, sans-serif;
}

.overlay *,
.overlay *::before,
.overlay *::after {
    box-sizing: border-box;
}

.dialog {
    display: flex;
    flex-direction: column;
    width: min(1180px, calc(100vw - 32px));
    max-height: min(880px, calc(100vh - 32px));
    padding: 24px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 24px 80px rgba(15, 23, 42, .38);
}

.header,
.footer,
.email-state,
.review-toolbar,
.result-actions {
    display: flex;
    align-items: center;
}

.header {
    justify-content: space-between;
    gap: 18px;
}

.eyebrow {
    margin: 0 0 4px;
    color: #2563eb;
    font-size: 11px;
    font-weight: 750;
    letter-spacing: .08em;
    text-transform: uppercase;
}

.header h2 {
    margin: 0;
    color: #111827;
    font-size: 21px;
    line-height: 1.3;
}

.description {
    margin: 5px 0 0;
    color: #6b7280;
    font-size: 13px;
    line-height: 1.4;
}

.icon {
    padding: 4px 8px;
    border: 0;
    background: transparent;
    color: #6b7280;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
}

.body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    margin-top: 18px;
}

.configure {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(240px, 1fr);
    gap: 14px 18px;
}

.field {
    display: block;
    color: #374151;
    font-size: 13px;
    font-weight: 650;
}

.field > span {
    display: block;
    margin-bottom: 7px;
}

.field small {
    display: block;
    margin-top: 5px;
    color: #6b7280;
    font-size: 11px;
    font-weight: 400;
}

.emails,
.curator,
.report {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    color: #111827;
    font: inherit;
    line-height: 1.45;
    outline: none;
}

.emails,
.report {
    resize: vertical;
}

.emails {
    min-height: 112px;
}

.report {
    min-height: 190px;
    white-space: pre;
}

.email-state {
    grid-column: 1;
    flex-wrap: wrap;
    gap: 8px 16px;
    margin-top: -8px;
    color: #6b7280;
    font-size: 12px;
}

.curator-field {
    grid-column: 2;
    grid-row: 1 / span 2;
}

.errors {
    margin-top: 14px;
    padding: 10px 12px;
    border: 1px solid #fecaca;
    border-radius: 8px;
    background: #fef2f2;
    color: #b91c1c;
    font-size: 13px;
}

.errors p {
    margin: 0;
}

.review {
    margin-top: 18px;
}

.review-toolbar {
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
    color: #6b7280;
    font-size: 12px;
}

.review-toolbar strong {
    color: #374151;
}

.table-wrap {
    overflow: auto;
    max-height: 390px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
}

table {
    width: 100%;
    min-width: 1020px;
    border-collapse: collapse;
    color: #1f2937;
    font-size: 12px;
}

th,
td {
    padding: 10px 11px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
    vertical-align: top;
}

th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #f8fafc;
    color: #374151;
    font-weight: 700;
}

th:nth-child(4),
th:nth-child(5),
td:nth-child(4),
td:nth-child(5) {
    width: 110px;
    text-align: center;
}

th button {
    display: block;
    margin: 5px auto 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #2563eb;
    font: inherit;
    font-size: 10px;
    cursor: pointer;
}

td strong,
td small {
    display: block;
    overflow-wrap: anywhere;
}

td small {
    margin-top: 3px;
    color: #6b7280;
}

.is-error,
.row-status {
    overflow-wrap: anywhere;
}

.is-error {
    color: #b91c1c;
}

.row-status {
    min-width: 190px;
    color: #4b5563;
}

.preflight,
.result {
    margin-top: 18px;
    padding: 14px;
    border: 1px solid #dbeafe;
    border-radius: 10px;
    background: #f8fbff;
}

.preflight h3 {
    margin: 0 0 7px;
    color: #111827;
    font-size: 15px;
}

.preflight p,
.preflight ul {
    margin: 7px 0 0;
    color: #4b5563;
    font-size: 12px;
    line-height: 1.45;
}

.preflight ul {
    max-height: 190px;
    overflow: auto;
    padding-left: 20px;
}

.result-actions {
    justify-content: flex-end;
    gap: 8px;
    margin-top: 10px;
}

.live-region {
    flex: 0 0 auto;
    padding-top: 14px;
}

.status {
    min-height: 20px;
    margin: 0;
    color: #4b5563;
    font-size: 13px;
    line-height: 1.4;
}

.progress {
    display: block;
    width: 100%;
    height: 10px;
    margin-top: 9px;
}

.footer {
    flex: 0 0 auto;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 9px;
    margin-top: 18px;
}

.footer button,
.result-actions button {
    padding: 9px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font: inherit;
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
}

.primary {
    border-color: #2563eb !important;
    background: #2563eb;
    color: #fff;
}

.secondary {
    background: #fff;
    color: #374151;
}

button:disabled,
textarea:disabled,
select:disabled,
input:disabled {
    cursor: not-allowed;
    opacity: .58;
}

button:focus-visible,
textarea:focus-visible,
select:focus-visible,
input:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
}

@media (max-width: 760px) {
    .overlay {
        padding: 8px;
    }

    .dialog {
        width: 100%;
        max-height: calc(100vh - 16px);
        padding: 18px;
        border-radius: 12px;
    }

    .configure {
        grid-template-columns: 1fr;
    }

    .email-state,
    .curator-field {
        grid-column: 1;
        grid-row: auto;
    }
}
`,Uo=`edvibe-toolbox-batch-user-onboarding-dialog`,Wo=class extends G{static styles=[Ae,je,Ho];static properties={options:{state:!0},rows:{state:!0},plan:{state:!0},mode:{state:!0},executionId:{state:!0},emailInput:{state:!0},targetModeratorId:{state:!0},emailCounts:{state:!0},errors:{state:!0},report:{state:!0},statusMessage:{state:!0},progress:{state:!0}};constructor(){super(),this.options=null,this.rows=[],this.plan=null,this.mode=`loading`,this.executionId=null,this.emailInput=``,this.targetModeratorId=``,this.emailCounts={valid:0,invalid:0},this.errors=[],this.report=``,this.statusMessage=``,this.progress={visible:!1,completed:0,total:1},this.handleKeydownBound=e=>{e.key===`Escape`&&this.close()}}connectedCallback(){super.connectedCallback(),this.ownerDocument?.addEventListener(`keydown`,this.handleKeydownBound)}disconnectedCallback(){this.ownerDocument?.removeEventListener(`keydown`,this.handleKeydownBound),super.disconnectedCallback()}configure(e={}){return this.options=e&&typeof e==`object`?e:{},this}showLoading(e=`Загрузка…`){return this.mode=`loading`,this.showStatus(e),this}showConfigure(){return this.mode=`configure`,this.plan=null,this.executionId=null,this.clearErrors(),this.report=``,this.progress={visible:!1,completed:0,total:1},this.showStatus(`Введите email пользователей и проверьте список.`),this.updateEmailCounts(),this}updateEmailCounts(){if(!this.options?.parseEmailInput)return;let e=this.options.parseEmailInput(this.emailInput);this.emailCounts={valid:e.entries?.length||0,invalid:e.malformed?.length||0}}async discover(){if(!(!this.options?.onDiscover||this.mode===`executing`)){this.clearErrors(),this.mode=`loading`,this.showStatus(`Проверяем пользователей…`);try{let e=await this.options.onDiscover({emailInput:this.emailInput});this.rows=e.map(e=>({...e,addSelected:!1,assignSelected:!1})),this.plan=null,this.mode=`review`,this.showStatus(`Проверьте найденные состояния и выберите операции.`)}catch(e){this.showError(e),this.mode=`configure`}}}canAssign(e){return!e.actionable||!e.moderatorStateSafe?!1:e.membership===`in_marathon`||e.membership===`not_in_marathon`&&!!e.addSelected}setRowSelection(e,t,n){this.mode===`review`&&(this.rows=this.rows.map(r=>{if(r.normalizedEmail!==e)return r;let i={...r,[t]:!!n};return t===`addSelected`&&!n&&r.membership===`not_in_marathon`&&(i.assignSelected=!1),i}),this.plan=null)}selectAll(e){this.mode===`review`&&(this.rows=this.rows.map(t=>e===`addSelected`&&t.actionable?{...t,addSelected:!0}:e===`assignSelected`&&this.canAssign(t)?{...t,assignSelected:!0}:t),this.plan=null)}async preparePlan(){if(!(!this.options?.onPreflight||this.mode!==`review`)){this.clearErrors();try{this.plan=await this.options.onPreflight({rows:this.rows.map(e=>({normalizedEmail:e.normalizedEmail,addSelected:!!e.addSelected,assignSelected:!!e.assignSelected})),targetModeratorId:this.targetModeratorId}),this.mode=`preflight`,this.showStatus(`План зафиксирован. Проверьте его и подтвердите выполнение.`)}catch(e){this.showError(e)}}}returnToReview(){this.mode===`preflight`&&(this.plan=null,this.mode=`review`,this.showStatus(`Измените выбор и подготовьте новый план.`))}async execute(){if(!(!this.plan||!this.options?.onExecute||this.mode!==`preflight`)){this.mode=`executing`,this.showStatus(`Выполняем подтверждённый план…`),this.progress={visible:!0,completed:0,total:1};try{let e=await this.options.onExecute(this.plan,e=>this.showProgress(e));this.report=e.report||``,this.executionId=e.history?.stored&&e.history.record?.id||null,this.mode=e.fatalError?`partial-complete`:`complete`;let t=e.history?.stored?` Результат сохранён в истории.`:e.history?.persistenceError?` Видимый отчёт сохранён, но историю записать не удалось.`:``;this.showStatus(`${e.fatalError?`Операция прервана, частичные результаты сохранены.`:`Обработка завершена.`}${t}`)}catch(e){this.mode=`partial-complete`,this.showError(e)}finally{this.progress={...this.progress,visible:!1}}}}showProgress(e={}){let t=Math.max(0,Number(e.completed)||0),n=Math.max(0,Number(e.total)||0);this.progress={visible:!0,completed:Math.min(t,Math.max(n,1)),total:Math.max(n,1)};let r=e.current?.operation?` Сейчас: ${e.current.email?`${e.current.email}, `:``}${e.current.operation}.`:``;this.showStatus(`Готово операций: ${t}/${n}. Успешных/no-op: ${e.successes||0}. Проблем: ${e.failures||0}.${r}`)}restart(){this.mode!==`executing`&&(this.rows=[],this.plan=null,this.executionId=null,this.emailInput=``,this.targetModeratorId=``,this.report=``,this.mode=`configure`,this.updateEmailCounts(),this.showStatus(`Введите следующую группу пользователей.`))}close(){this.mode===`executing`||this.mode===`loading`||this.options?.onClose?.()}clearErrors(){this.errors=[]}showError(e){let t=e?.message||String(e||`Неизвестная ошибка.`);this.errors=[t],this.showStatus(t)}showStatus(e){this.statusMessage=String(e||``)}membershipLabel(e){return{in_marathon:`В марафоне`,resolvable_not_in_marathon:`Можно добавить по email`,ambiguous:`Неоднозначно`,invalid:`Некорректный email`}[e.resolution]||e.resolution}curatorLabel(e){return!e.moderatorStateSafe&&e.membership===`in_marathon`?`Нельзя безопасно прочитать`:e.currentModerators?.length?e.currentModerators.map(e=>e.name||e.email||`#${e.id}`).join(`, `):`Нет`}renderRow(e){return U`
            <tr data-email=${e.normalizedEmail}>
                <td><strong>${e.user?.name||e.email}</strong><small>${e.user?.name?e.email:``}</small></td>
                <td>${this.membershipLabel(e)}</td>
                <td class=${!e.moderatorStateSafe&&e.membership===`in_marathon`?`is-error`:``}>${this.curatorLabel(e)}</td>
                <td><input class="add-selected" type="checkbox" .checked=${!!e.addSelected}
                    ?disabled=${this.mode!==`review`||!e.actionable}
                    aria-label=${`Добавить ${e.email}`}
                    @change=${t=>this.setRowSelection(e.normalizedEmail,`addSelected`,t.currentTarget.checked)}></td>
                <td><input class="assign-selected" type="checkbox" .checked=${!!e.assignSelected}
                    ?disabled=${this.mode!==`review`||!this.canAssign(e)}
                    aria-label=${`Назначить куратора ${e.email}`}
                    @change=${t=>this.setRowSelection(e.normalizedEmail,`assignSelected`,t.currentTarget.checked)}></td>
                <td class="row-status">${e.message||`Готово к выбору.`}</td>
            </tr>`}renderPreflight(){return this.plan?U`
            <section class="preflight" ?hidden=${![`preflight`,`executing`].includes(this.mode)}>
                <h3>Неизменяемый план</h3>
                <p>Строк: ${this.plan.counts.requested}. Добавлений: ${this.plan.counts.additions}. Назначений: ${this.plan.counts.assignments}. Предсказанных no-op: ${this.plan.counts.noOps}. Отклонённых операций: ${this.plan.counts.rejectedOperations}.</p>
                <ul>${this.plan.rows.map(e=>{let t=[];return e.add&&t.push(`add: ${e.add.status} (${e.add.code})`),e.assign&&t.push(`assign: ${e.assign.status} (${e.assign.code})`),t.length===0&&t.push(e.message||e.resolution),U`<li>${e.email}: ${t.join(`; `)}</li>`})}</ul>
            </section>`:W}render(){let e=[`review`,`preflight`,`executing`,`complete`,`partial-complete`].includes(this.mode)&&this.rows.length>0,t=[`complete`,`partial-complete`].includes(this.mode);return U`
<div class="overlay" @click=${e=>{e.target===e.currentTarget&&this.close()}}>
                <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="batch-user-onboarding-title">
                    <header class="header"><div><p class="eyebrow">Edvibe Toolbox</p><h2 id="batch-user-onboarding-title">Добавить пользователей и назначить куратора</h2><p class="description">Проверьте весь список, подготовьте неизменяемый план и только потом подтвердите запись.</p></div>
                        <button class="icon close" type="button" aria-label="Закрыть" ?disabled=${[`loading`,`executing`].includes(this.mode)} @click=${()=>this.close()}>×</button></header>
                    <main class="body">
                        <section class="configure">
                            <label class="field"><span>Email пользователей</span><textarea class="emails" rows="5" placeholder="user@example.com"
                                .value=${this.emailInput} ?disabled=${this.mode!==`configure`}
                                @input=${e=>{this.emailInput=e.currentTarget.value,this.updateEmailCounts()}}></textarea></label>
                            <div class="email-state" aria-live="polite"><span class="valid-count">Уникальных email: ${this.emailCounts.valid}</span><span class="invalid-count">Некорректных: ${this.emailCounts.invalid}</span></div>
                            <label class="field curator-field"><span>Целевой куратор</span>
                                <select class="curator" .value=${this.targetModeratorId} ?disabled=${![`configure`,`review`].includes(this.mode)}
                                    @change=${e=>{this.targetModeratorId=e.currentTarget.value,this.plan=null}}>
                                    <option value="">Не выбран</option>
                                    ${(this.options?.moderators||[]).map(e=>U`<option value=${String(e.id)}>${e.name?`${e.name}${e.email?` · ${e.email}`:``}`:e.email||`Moderator #${e.id}`}</option>`)}
                                </select><small>Нужен только для строк с операцией назначения.</small></label>
                        </section>
                        <section class="errors" aria-live="polite" ?hidden=${this.errors.length===0}>${this.errors.map(e=>U`<p>${e}</p>`)}</section>
                        <section class="review" ?hidden=${!e}><div class="review-toolbar"><strong class="review-count">${this.rows.length} строк</strong><span>Все операции по умолчанию выключены.</span></div>
                            <div class="table-wrap"><table><thead><tr><th>Пользователь</th><th>Статус</th><th>Текущие кураторы</th><th>Добавить<button class="select-all-add" type="button" ?disabled=${this.mode!==`review`} @click=${()=>this.selectAll(`addSelected`)}>Выбрать все</button></th><th>Назначить<button class="select-all-assign" type="button" ?disabled=${this.mode!==`review`} @click=${()=>this.selectAll(`assignSelected`)}>Выбрать все</button></th><th>Проверка / результат</th></tr></thead><tbody class="rows">${this.rows.map(e=>this.renderRow(e))}</tbody></table></div>
                        </section>
                        ${this.renderPreflight()}
                        <section class="result" ?hidden=${!t}><label class="field"><span>Отчёт</span><textarea class="report" rows="12" readonly .value=${this.report}></textarea></label>
                            <div class="result-actions"><button class="copy secondary" type="button" @click=${()=>this.options?.onCopy?.(this.report)}>Скопировать отчёт</button><button class="history secondary" type="button" ?hidden=${!this.executionId} @click=${()=>this.executionId&&this.options?.onOpenHistory?.(this.executionId)}>Открыть в истории</button></div></section>
                    </main>
                    <div class="live-region"><p class="status" role="status" aria-live="polite">${this.statusMessage}</p><progress class="progress" max=${this.progress.total} value=${this.progress.completed} ?hidden=${!this.progress.visible}></progress></div>
                    <footer class="footer">
                        <button class="restart secondary" type="button" ?hidden=${!t} @click=${this.restart}>Запустить другую группу</button>
                        <button class="edit secondary" type="button" ?hidden=${this.mode!==`preflight`} @click=${this.returnToReview}>Изменить выбор</button>
                        <button class="discover primary" type="button" ?hidden=${this.mode!==`configure`} @click=${this.discover}>Проверить пользователей</button>
                        <button class="prepare primary" type="button" ?hidden=${this.mode!==`review`} @click=${this.preparePlan}>Подготовить план</button>
                        <button class="execute primary" type="button" ?hidden=${this.mode!==`preflight`} @click=${this.execute}>Подтвердить и выполнить</button>
                    </footer>
                </section>
            </div>`}};customElements.get(`edvibe-toolbox-batch-user-onboarding-dialog`)||customElements.define(Uo,Wo);var Go=Object.freeze({BATCH_USER_ONBOARDING_DIALOG_TAG:Uo,BatchUserOnboardingDialog:Wo});globalThis.EdVibeBatchUserOnboardingDialog=Go;var Ko=`edvibe-toolbox-batch-section-creation-dialog`,qo=new Set([...new Set([`WS_UNAVAILABLE`,`REQUEST_TIMEOUT`,`SEND_FAILED`]),`SERVER_REJECTED`,`INVALID_RESPONSE`]),Jo=/\{\{\s*([^{}]+?)\s*\}\}/g;function Yo(e){let t=String(e||``).trim();if(!t)return``;try{let e=new URL(t);return e.protocol===`http:`||e.protocol===`https:`?e.href:``}catch{return``}}function Xo(e,t){let n=String(e?.type||``).trim(),r=String(e?.id||`block-${t+1}`).trim();return Object.freeze(n===`image`?{id:r,type:n,url:String(e?.url||``).trim(),alt:String(e?.alt||``).trim()}:n===`text`?{id:r,type:n,text:String(e?.text||``).trim()}:n===`link`?{id:r,type:n,label:String(e?.label||``).trim(),url:String(e?.url||``).trim()}:{id:r,type:n})}function Zo(e={}){let t=[],n=String(e?.name||``).trim(),r=Array.isArray(e?.blocks)?e.blocks.map(Xo):[],i=new Set;n||t.push(Y(`SECTION_NAME_REQUIRED`,`Section name is required.`)),r.length===0&&t.push(Y(`SECTION_BLOCK_REQUIRED`,`Add at least one section block.`));for(let[e,n]of r.entries())i.has(n.id)&&t.push(Y(`DUPLICATE_BLOCK_ID`,`Block ${e+1} has a duplicate ID.`)),i.add(n.id),n.type===`image`?Yo(n.url)||t.push(Y(`IMAGE_URL_REQUIRED`,`Image block ${e+1} requires an HTTP(S) URL.`)):n.type===`text`?n.text||t.push(Y(`TEXT_REQUIRED`,`Text block ${e+1} cannot be empty.`)):n.type===`link`?(n.label||t.push(Y(`LINK_LABEL_REQUIRED`,`Link block ${e+1} requires a label.`)),Yo(n.url)||t.push(Y(`LINK_URL_REQUIRED`,`Link block ${e+1} requires an HTTP(S) URL.`))):t.push(Y(`UNSUPPORTED_BLOCK_TYPE`,`Block ${e+1} has unsupported type "${n.type||`unknown`}".`));return{definition:Object.freeze({name:n,blocks:Object.freeze(r)}),errors:t}}function Qo(e,t=0){let n=e?.LessonId??e?.lessonId??e?.Id,r=e?.MarathonLessonId??e?.marathonLessonId??e?.Id;return Object.freeze({lessonId:Number(n),marathonLessonId:Number(r),number:Number(e?.Number??e?.number??t)+(e?.Number===void 0?0:1),name:String(e?.Name??e?.name??`Lesson ${t+1}`)})}function $o(e){let t=e?.Value??e;if(!t||!Array.isArray(t.Sections))throw Y(`INVALID_LESSON_RESPONSE`,`The lesson response did not contain a normal sections array.`);return t.Sections}function es(e){return Object.freeze(e.map(e=>Object.freeze({...e})))}function ts({lessons:e,selectedLessonIds:t,definition:n,inspectionsByLessonId:r}){let i=Zo(n);if(i.errors.length>0)throw Y(`INVALID_SECTION_DEFINITION`,`The section definition is invalid.`,{validationErrors:i.errors});let a=new Set((t||[]).map(Number)),o=[],s=[];for(let t of(e||[]).filter(e=>a.has(Number(e.lessonId)))){let e=r.get(Number(t.lessonId));if(!e||e.error){let n=e?.error||Y(`INVALID_LESSON_RESPONSE`,`The lesson was not inspected.`);s.push({...t,code:n.code||`INVALID_LESSON_RESPONSE`,message:n.message||`The lesson could not be inspected.`});continue}try{$o(e.structure).some(e=>String(e?.Name||``).trim()===i.definition.name)?s.push({...t,code:`SECTION_NAME_COLLISION`,message:`A section named "${i.definition.name}" already exists.`}):o.push({...t})}catch(e){s.push({...t,code:e.code||`INVALID_LESSON_RESPONSE`,message:e.message})}}let c=i.definition.blocks.map((e,t)=>Object.freeze({index:t,type:e.type,id:e.id}));return Object.freeze({definition:i.definition,selectedLessonIds:Object.freeze([...a]),eligible:es(o),rejected:es(s),blockSummary:Object.freeze(c)})}function ns(e,t){return String(t||``).split(`.`).filter(Boolean).reduce((e,t)=>e?.[t],e)}function rs(e,t){if(e.startsWith(`generated.`)){let n=e.slice(10),r=t.block?t.blockGenerated:t.generated;return n in r||(r[n]=t.createId()),r[n]}return ns(t,e)}function is(e,t){if(Array.isArray(e))return e.map(e=>is(e,t));if(e&&typeof e==`object`)return Object.fromEntries(Object.entries(e).map(([e,n])=>[e,is(n,t)]));if(typeof e!=`string`)return e;let n=e.match(/^\{\{\s*([^{}]+?)\s*\}\}$/);return n?rs(n[1],t):e.replace(Jo,(e,n)=>{let r=rs(n,t);return r==null?``:String(r)})}function as(e){let t=[];(!e||e.version!==1)&&t.push(Y(`RECIPE_MISSING`,`A version 1 recording recipe is required.`)),e&&e.reviewedDynamicFields!==!0&&t.push(Y(`RECIPE_NOT_REVIEWED`,`The recording recipe must explicitly confirm reviewed dynamic fields.`)),e&&!Array.isArray(e.steps)&&t.push(Y(`RECIPE_STEPS_REQUIRED`,`The recording recipe requires steps.`));for(let n of e?.steps||[])(!n.controller||!n.method||!n.projectName||!n.valueTemplate)&&t.push(Y(`INVALID_RECIPE_STEP`,`Recipe step "${n.id||n.method||`unknown`}" is incomplete.`));return t}function os({recipe:e=null,cryptoApi:t=globalThis.crypto,requestDelayMs:n=300}={}){let r=as(e),i=()=>t?.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`;function a(e,t){let n=[];for(let r=0;r<e.length;){let i=e[r];if(i.forEach!==`blocks`){n.push({step:i,block:null,blockIndex:null}),r+=1;continue}let a=[];for(;r<e.length&&e[r].forEach===`blocks`;)a.push(e[r]),r+=1;t.blocks.forEach((e,t)=>{let r=a.find(t=>!Array.isArray(t.blockTypes)||t.blockTypes.includes(e.type));r&&n.push({step:r,block:e,blockIndex:t})})}return n}async function o({steps:e,marathonId:t,lesson:r,definition:o,sendRequest:s,wait:c,captured:l={},generated:u={}}){let d=new Map,f=a(e,o),p=!1;for(let[e,a]of f.entries()){let m=a.block?d.get(a.block.id)||{}:u;a.block&&d.set(a.block.id,m);let h={marathonId:t,lesson:r,section:o,block:a.block,blockIndex:a.blockIndex,captured:l,generated:u,blockGenerated:m,createId:i};try{let t=await s(a.step.controller,a.step.method,a.step.projectName,is(a.step.valueTemplate,h));for(let[e,n]of Object.entries(a.step.capture||{})){let r=ns(t,n);if(r===void 0)throw Y(`INVALID_RESPONSE`,`Recipe capture "${e}" was missing after ${a.step.id||a.step.method}.`);l[e]=r}a.step.marksSectionCreated===!0&&(p=!0),e<f.length-1&&n>0&&await c(n)}catch(e){throw e.partialCreated=p,e.captured={...l},e.generated={...u},e}}return{captured:{...l},generated:{...u}}}return Object.freeze({isReady:r.length===0,errors:Object.freeze(r),async createSection(t){if(r.length>0)throw Y(`RECIPE_UNAVAILABLE`,r[0].message);return o({...t,steps:e.steps})},async cleanupSection(t){if(!Array.isArray(e?.cleanupSteps)||e.cleanupSteps.length===0)return{attempted:!1,status:`unavailable`};try{return await o({...t,steps:e.cleanupSteps}),{attempted:!0,status:`success`}}catch(e){return{attempted:!0,status:`failed`,code:e.code||`CLEANUP_FAILED`,message:e.message}}}})}async function ss({sendRequest:e,marathonId:t,pageSize:n=100}){return(await fi({sendRequest:e,marathonId:t,pageSize:n})).map(Qo)}async function cs({lessons:e,selectedLessonIds:t,sendRequest:n,wait:r,delayMs:i=300}){let a=new Set((t||[]).map(Number)),o=(e||[]).filter(e=>a.has(Number(e.lessonId))),s=new Map;for(let[e,t]of o.entries()){try{let e=await pi({sendRequest:n,lessonId:t.lessonId});s.set(Number(t.lessonId),{structure:e})}catch(e){s.set(Number(t.lessonId),{error:e})}e<o.length-1&&i>0&&await r(i)}return s}function ls(e,t,n={}){return{lessonId:e.lessonId,marathonLessonId:e.marathonLessonId,lessonNumber:e.number,lessonName:e.name,status:t,...n}}function us(e,t){return e?.code===`WS_UNAVAILABLE`||e?.code===`SEND_FAILED`&&!t().isOpen||!qo.has(e?.code)}async function ds({marathonId:e,plan:t,adapter:n,sendRequest:r,wait:i,getConnectionState:a,lessonDelayMs:o=300,onProgress:s=()=>{}}){if(!n?.isReady)throw Y(`RECIPE_UNAVAILABLE`,n?.errors?.[0]?.message||`Recording recipe unavailable.`);let c=t.rejected.map(e=>ls(e,`rejected`,{code:e.code,message:e.message})),l=0;for(let[u,d]of t.eligible.entries()){s({completed:u,total:t.eligible.length,lesson:d,results:[...c]});try{l+=1;let a=await n.createSection({marathonId:e,lesson:d,definition:t.definition,sendRequest:r,wait:i});c.push(ls(d,`created`,{captured:a.captured,generated:a.generated,attempts:1}))}catch(o){let s=!!o.partialCreated,f=us(o,a),p=null;if(s&&!f&&(p=await n.cleanupSection({marathonId:e,lesson:d,definition:t.definition,sendRequest:r,wait:i,captured:o.captured||{},generated:o.generated||{}})),c.push(ls(d,s?`partially_created`:`failed`,{code:o.code||`UNKNOWN_ERROR`,message:o.message||`Section creation failed.`,captured:o.captured,generated:o.generated,cleanup:p,attempts:o.attempts||1})),f){for(let e of t.eligible.slice(u+1))c.push(ls(e,`not_attempted`,{code:`OPERATION_INTERRUPTED`,message:`Not attempted because the batch operation stopped.`}));throw o.partialResult={definition:t.definition,results:c,attempts:l,fatalError:o},o}}s({completed:u+1,total:t.eligible.length,lesson:d,results:[...c]}),u<t.eligible.length-1&&o>0&&await i(o)}return{definition:t.definition,results:c,attempts:l}}function fs(e){let t=Array.isArray(e?.results)?e.results:[],n=e=>t.filter(t=>t.status===e).length,r=[`Section: ${e?.definition?.name||`Unknown`}`,`Blocks: ${e?.definition?.blocks?.length||0}`,`Created: ${n(`created`)}`,`Rejected in preflight: ${n(`rejected`)}`,`Failed: ${n(`failed`)}`,`Partially created: ${n(`partially_created`)}`,`Not attempted: ${n(`not_attempted`)}`,``];for(let e of t)r.push(`${e.lessonNumber||`?`}. ${e.lessonName} — ${e.status}`+(e.code?` — ${e.code}: ${e.message||``}`:``)),e.captured?.sectionId!==void 0&&r.push(`  Captured sectionId: ${e.captured.sectionId}`),e.cleanup&&r.push(`  Cleanup: ${e.cleanup.status}`);return r.join(`
`).trim()}function ps({sendRequest:e,getConnectionState:t,wait:n,canStart:r,onActiveChange:i,adapter:a,createDialog:o=()=>document.createElement(Ko),copyText:s=async()=>{},log:c=()=>{}}){let l=!1,u=!1,d=null,f=null,p=[],m=null,h=null;function g(){l&&(l=!1,i(!1))}function _(){u=!1,d=null,p=[],m=null,h=null,g()}async function v(t){if(!u){u=!0;try{let r=t?.detail?.definition||{},i=t?.detail?.selectedLessonIds||[],a=Zo(r),o=[...a.errors];if(i.length===0&&o.push(Y(`LESSON_SELECTION_REQUIRED`,`Select at least one lesson.`)),o.length>0){d.showValidationErrors(o);return}d.showLoading(`Проверяем выбранные уроки…`);let s=await cs({lessons:p,selectedLessonIds:i,sendRequest:e,wait:n});m=ts({lessons:p,selectedLessonIds:i,definition:a.definition,inspectionsByLessonId:s}),d.showConfirmation(m)}catch(e){d.showValidationErrors([e])}finally{u=!1}}}async function y(){if(!(u||!m?.eligible?.length)){u=!0;try{h=await ds({marathonId:f,plan:m,adapter:a,sendRequest:e,wait:n,getConnectionState:t,onProgress:e=>d.showExecution(e)}),d.showComplete(h)}catch(e){h=e.partialResult||{definition:m.definition,results:m.rejected,fatalError:e},d.showComplete(h,e)}finally{u=!1}}}async function b(){h&&await s(fs(h))}function x(){m=null,h=null,d.showConfigure({lessons:p,recipeReady:a?.isReady,recipeErrors:a?.errors||[]})}async function S(){if(!(l||document.getElementById(`edvibe-toolbox-batch-section-creation-overlay`))){if(!r()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}if(f=ni(window.location.href),!f){window.alert(`Open an Edvibe marathon page before creating sections.`);return}l=!0,i(!0);try{if(d=o(),d.addEventListener(`edvibe-dialog-close`,_),d.addEventListener(`edvibe-batch-section-preflight`,v),d.addEventListener(`edvibe-batch-section-confirm`,y),d.addEventListener(`edvibe-batch-section-copy`,b),d.addEventListener(`edvibe-batch-section-restart`,x),d.configure(),(document.body||document.documentElement).appendChild(d),d.showLoading(`Загружаем уроки марафона…`),p=await ss({sendRequest:e,marathonId:f}),p.length===0)throw Y(`EMPTY_LESSON_CATALOGUE`,`No lessons were found.`);d.showConfigure({lessons:p,recipeReady:a?.isReady,recipeErrors:a?.errors||[]}),c(`Batch section creation ready for MarathonId ${f}.`)}catch(e){c(`Batch section creation initialization failed (${e.code||`UNKNOWN_ERROR`}).`);try{d?.showFatalError?.(e)}finally{g()}}}}return{open:S,isRunning:()=>u}}var ms=`batch_section_creation`,hs=Object.freeze([`completed`,`completed_with_failures`,`cancelled`,`interrupted`]),gs=Object.freeze([`created`,`failed`,`partially_created`]),_s=Object.freeze([`failed`,`partially_created`]),vs=new Set([`auth`,`authorization`,`cookie`,`credential`,`credentials`,`password`,`response`,`session`,`token`,`transport`,`websocket`]);function ys(e){let t=String(e||``).match(/\/marathon\/(\d+)(?:\/|$)/);return t?String(t[1]):null}function bs(e,t=``,n=4e3){let r=String(e??``).trim();return r?r.length<=n?r:`${r.slice(0,Math.max(0,n-1))}…`:t}function xs(e){let t=bs(e);if(!t)return null;try{let e=new URL(t);return e.protocol===`http:`||e.protocol===`https:`?e.href:null}catch{return null}}function Ss(e,t){return bs(e,``,t).replace(/data:image\/[^;,<>"'\s]+(?:;[^,<>"'\s]+)*;base64,[a-z0-9+/=\r\n]+/gi,`[redacted image data]`)}function Cs(e){return Object.freeze(e.map(e=>Object.freeze(e)))}function ws(e,t){let n=bs(e?.type,`unknown`,80),r={order:t,blockId:bs(e?.id,`block-${t+1}`,160),type:n},i=bs(e?.clientId,``,500);return i&&(r.clientId=i),n===`image`?(r.url=xs(e?.url),r.alt=Ss(e?.alt,1e3)||null):n===`text`?r.content=Ss(e?.text,1e4)||null:n===`link`&&(r.label=Ss(e?.label,1e3)||null,r.url=xs(e?.url)),r}function Ts(e={}){let t=Array.isArray(e?.blocks)?e.blocks.map(ws):[];return Object.freeze({name:bs(e?.name,`Unnamed section`,500),blocks:Cs(t)})}function Es(e){return String(e||``).replace(/([a-z0-9])([A-Z])/g,`$1_$2`).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)}function Ds(e){let t=Es(e.at(-1)),n=e.flatMap(Es);return t.includes(`id`)&&!n.some(e=>vs.has(e))}function Os(e,t,n,r=[],i=0,a=new WeakSet){if(!(e==null||i>5)){if(typeof e!=`object`){if(!Ds(r))return;let i=typeof e==`number`||typeof e==`boolean`?e:bs(e,``,500);if(i===``)return;n.push({source:t,name:r.join(`.`),value:i});return}if(!a.has(e)){a.add(e);try{if(Array.isArray(e)){e.forEach((e,o)=>Os(e,t,n,[...r,String(o)],i+1,a));return}for(let[o,s]of Object.entries(e))Os(s,t,n,[...r,o],i+1,a)}finally{a.delete(e)}}}}function ks(e={}){let t=[];Os(e?.captured,`captured`,t),Os(e?.generated,`generated`,t),Os(e?.blockGenerated,`block_generated`,t);let n=[],r=new Set;for(let e of t){let t=`${e.source}\u0000${e.name}\u0000${String(e.value)}`;r.has(t)||(r.add(t),n.push(e))}return Cs(n)}function As(e={},t=null){let n=e.lessonId??e.LessonId??t,r=e.marathonLessonId??e.MarathonLessonId??null,i=e.lessonNumber??e.number??e.Number??null,a=e.lessonName??e.name??e.Name??null;return Object.freeze({lessonId:n??null,marathonLessonId:r===void 0?null:r,number:i===void 0?null:i,name:bs(a,`Unnamed lesson`,500)})}function js(e){let t=e?.lessonId??e?.LessonId;return t==null?null:String(t)}function Ms(e,t,n){return{lessonId:e?.lessonId??e?.LessonId??null,marathonLessonId:e?.marathonLessonId??e?.MarathonLessonId??null,lessonNumber:e?.lessonNumber??e?.number??e?.Number??null,lessonName:e?.lessonName??e?.name??e?.Name??null,status:e?.status||t,code:e?.code,message:e?.message,attempts:e?.attempts,captured:e?.captured,generated:e?.generated,blockGenerated:e?.blockGenerated,cleanup:e?.cleanup,terminalStatus:n}}function Ns(e={},t={},n=null){let r=new Map;for(let t of e?.rejected||[]){let e=js(t);e!==null&&r.set(e,Ms(t,`rejected`,n))}let i=new Map;for(let e of t?.results||[]){let t=js(e);if(t===null)continue;let a=e?.status||(r.has(t)?`rejected`:null);i.set(t,Ms(e,a,n))}let a=new Map;for(let t of e?.eligible||[]){let e=js(t);e!==null&&a.set(e,t)}let o=Array.isArray(e?.selectedLessonIds)?e.selectedLessonIds.map(String):[],s=[],c=new Set;for(let e of o){let t=i.get(e)||r.get(e);!t&&a.has(e)&&(t=Ms(a.get(e),`not_attempted`,n)),t||=Ms({lessonId:e,lessonName:`Lesson ${e}`},`not_attempted`,n),s.push(t),c.add(e)}for(let e of[...r.values(),...i.values()]){let t=js(e);t!==null&&c.has(t)||(s.push(e),t!==null&&c.add(t))}for(let[e,t]of a.entries())c.has(e)||(s.push(Ms(t,`not_attempted`,n)),c.add(e));return s}function Ps(e){return gs.includes(e)}function Fs(e){return _s.includes(e)}function Is(e,t={}){let n=e.filter(e=>Ps(e.status)).length,r=e.filter(e=>e.status===`not_attempted`).length,i=n+r,a=Array.isArray(t?.eligible)?t.eligible.length:0;return Object.freeze({requested:e.length,eligible:Math.max(a,i),attempted:n,successful:e.filter(e=>e.status===`created`).length,noOp:0,skipped:e.filter(e=>e.status===`rejected`).length,failed:e.filter(e=>Fs(e.status)).length,notAttempted:r})}var Ls=new Set(hs);function Rs(e,t){return e?.code?bs(e.code,`UNKNOWN_ERROR`,120):{created:`SECTION_CREATED`,rejected:`PREFLIGHT_REJECTED`,failed:`SECTION_CREATION_FAILED`,partially_created:`SECTION_PARTIALLY_CREATED`,not_attempted:t===`cancelled`?`OPERATION_CANCELLED`:`OPERATION_INTERRUPTED`}[e?.status]||`UNKNOWN_RESULT`}function zs(e,t){return e?.message?bs(e.message,`No message was provided.`,1e3):{created:`Section created successfully.`,rejected:`The lesson was rejected during preflight.`,failed:`Section creation failed.`,partially_created:`Section creation failed after the section had been created.`,not_attempted:t===`cancelled`?`Not attempted because the confirmed run was cancelled.`:`Not attempted because the confirmed run was interrupted.`}[e?.status]||`The operation produced an unknown result.`}function Bs(e,t){if(e?.status!==`partially_created`)return null;let n=e?.cleanup;if(!n)return Object.freeze({attempted:!1,status:`unavailable`,code:t===`interrupted`?`CLEANUP_UNAVAILABLE_AFTER_INTERRUPTION`:`CLEANUP_UNAVAILABLE`,message:t===`interrupted`?`Cleanup was unavailable after the batch was interrupted.`:`Cleanup was unavailable for this partially created section.`});let r=!!n.attempted,i=[`success`,`failed`,`unavailable`].includes(n.status)?n.status:r?`failed`:`unavailable`;return Object.freeze({attempted:r,status:i,code:n.code?bs(n.code,`CLEANUP_FAILED`,120):i===`success`?`CLEANUP_SUCCEEDED`:i===`unavailable`?`CLEANUP_UNAVAILABLE`:`CLEANUP_FAILED`,message:n.message?bs(n.message,`Cleanup failed.`,1e3):i===`success`?`Cleanup completed successfully.`:i===`unavailable`?`Cleanup was unavailable.`:`Cleanup failed.`})}function Vs(e,t){return Fs(e?.status)?Object.freeze({code:Rs(e,t),message:zs(e,t),attemptCount:Number.isSafeInteger(e?.attempts)&&e.attempts>=0?e.attempts:1}):null}function Hs(e,t,n){let r=As(e),i=bs(e?.status,`not_attempted`,80),a=Number.isSafeInteger(e?.attempts)&&e.attempts>=0?e.attempts:+!!Ps(i),o={...e,status:i},s=Rs(o,n),c=zs(o,n);return Object.freeze({itemId:r.lessonId===null?null:String(r.lessonId),label:`${r.number??`?`}. ${r.name}`,status:i,code:s,message:c,attempts:a,data:Object.freeze({lesson:r,section:t,preflight:Object.freeze({status:i===`rejected`?`rejected`:`eligible`,code:i===`rejected`?s:`PREFLIGHT_ELIGIBLE`,message:i===`rejected`?c:`The lesson passed preflight and was included in the confirmed plan.`}),creationFailure:Vs(o,n),cleanup:Bs(o,n),identifiers:ks(e)})})}function Us(e,t,n){return Ls.has(e)?e:t?`interrupted`:n.some(e=>[`rejected`,`failed`,`partially_created`,`not_attempted`].includes(e.status))?`completed_with_failures`:`completed`}function Ws({plan:e,result:t={},startedAt:n,completedAt:r,marathonId:i,marathonName:a=null,terminalStatus:o=null,fatalError:s=null}){let c=Ls.has(o)?o:s?`interrupted`:null,l=Ts(e?.definition||t?.definition||{}),u=Ns(e,t,c).map(e=>Hs(e,l,c)),d=Us(o,s||t?.fatalError,u),f=Is(u,e);return Object.freeze({operationType:ms,startedAt:n,completedAt:r,status:d,pageContext:Object.freeze({marathonId:i,marathonName:a}),counts:f,results:Object.freeze(u),message:JSON.stringify({sectionName:l.name,blockCount:l.blocks.length,counts:f})})}function Gs(e,t,n=!1){let r=e.elements?.status?.textContent||``;e.setStatus?.(`${r}${r?` `:``}${t}`,n?`error`:``)}function Ks(e,t,n){e.shadowRoot?.querySelector?.(`.edvibe-batch-section-history`)?.remove?.();let r=(e.ownerDocument||globalThis.document)?.createElement?.(`button`);r&&(r.type=`button`,r.className=`edvibe-batch-section-history`,r.textContent=`Открыть в истории`,r.addEventListener(`click`,()=>{e.close?.(),n(t)}),(e.elements?.footer||e.shadowRoot?.querySelector?.(`.edvibe-batch-section-footer`))?.appendChild?.(r))}function qs({createDialog:e,persistExecution:t,openHistory:n=()=>{},getLocationHref:r=()=>``,getMarathonName:i=()=>null,now:a=()=>new Date,log:o=()=>{}}){if(typeof e!=`function`)throw TypeError(`createDialog is required`);if(typeof t!=`function`)throw TypeError(`persistExecution is required`);return function(){let s=e(),c=null,l=null,u=null,d=!1,f=0,p=s.showConfigure.bind(s),m=s.showConfirmation.bind(s),h=s.showExecution.bind(s),g=s.showComplete.bind(s),_=s.showFatalError.bind(s);function v(){s.shadowRoot?.querySelector?.(`.edvibe-batch-section-history`)?.remove?.()}function y(){f+=1,c=null,l=null,u=null,d=!1,v()}function b(e,p=null,m=null){if(!c||d)return;d=!0;let h=f,g;try{let t=a().toISOString();g=Ws({plan:c,result:e||l||{},startedAt:u||t,completedAt:t,marathonId:ys(r()),marathonName:i(),terminalStatus:p,fatalError:m})}catch(e){Gs(s,`Экранный результат сохранён, но записать историю не удалось.`,!0),o(`Batch section creation history record creation failed:`,e);return}Promise.resolve().then(()=>t(g)).then(e=>{h===f&&(e?.stored?(Gs(s,`Результат сохранён в истории.`),e.record?.id&&Ks(s,e.record.id,n)):(Gs(s,`Экранный результат сохранён, но записать историю не удалось.`,!0),e?.persistenceError&&o(`Batch section creation history persistence failed:`,e.persistenceError)))}).catch(e=>{h===f&&(Gs(s,`Экранный результат сохранён, но записать историю не удалось.`,!0),o(`Batch section creation history persistence failed:`,e))})}return s.showConfigure=(...e)=>(y(),p(...e)),s.showConfirmation=e=>{f+=1,v(),c=e,l={definition:e?.definition,results:Array.isArray(e?.rejected)?e.rejected.map(e=>Ms(e,`rejected`)):[]},u=a().toISOString(),d=!1;let t=m(e);return e?.eligible?.length||b(l),t},s.showExecution=(e={})=>(c&&Array.isArray(e?.results)&&(l={definition:c.definition,results:[...e.results]}),h(e)),s.showComplete=(e={},t=null)=>{let n=g(e,t);return l=e,b(e,t?`interrupted`:null,t),n},s.showFatalError=e=>{let t=_(e);return c&&b(l,`interrupted`,e),t},s.addEventListener(`edvibe-batch-section-restart`,y),s.addEventListener(`edvibe-dialog-close`,()=>{c&&!d&&b(l,`cancelled`)}),s}}var Js=g`
:host {
    all: initial;
}

.edvibe-batch-section-overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
    box-sizing: border-box;
    background: rgba(15, 23, 42, .68);
    color: #1f2937;
    font-family: "Segoe UI", Arial, sans-serif;
}

.edvibe-batch-section-overlay *,
.edvibe-batch-section-overlay *::before,
.edvibe-batch-section-overlay *::after {
    box-sizing: border-box;
}

[hidden] {
    display: none !important;
}

.edvibe-batch-section-card {
    display: flex;
    flex-direction: column;
    width: min(1120px, calc(100vw - 36px));
    max-height: min(900px, calc(100vh - 36px));
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, .32);
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 30px 100px rgba(15, 23, 42, .46);
}

.edvibe-batch-section-header,
.edvibe-batch-section-footer,
.edvibe-batch-section-heading-row,
.edvibe-batch-section-selection-actions,
.edvibe-batch-section-block header,
.edvibe-batch-section-block-actions,
.edvibe-batch-section-add-actions {
    display: flex;
    align-items: center;
}

.edvibe-batch-section-header {
    flex: 0 0 auto;
    justify-content: space-between;
    gap: 22px;
    padding: 22px 24px;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(135deg, #f8fafc, #eff6ff);
}

.edvibe-batch-section-eyebrow {
    margin: 0 0 4px;
    color: #2563eb;
    font-size: 11px;
    font-weight: 750;
    letter-spacing: .09em;
    text-transform: uppercase;
}

.edvibe-batch-section-header h2,
.edvibe-batch-section-heading-row h3,
.edvibe-batch-section-preview h3,
.edvibe-batch-section-summary h3,
.edvibe-batch-section-results h3,
.edvibe-batch-section-errors h3 {
    margin: 0;
    color: #111827;
}

.edvibe-batch-section-header h2 {
    font-size: 22px;
    line-height: 1.25;
}

.edvibe-batch-section-description,
.edvibe-batch-section-heading-row p {
    margin: 5px 0 0;
    color: #64748b;
    font-size: 13px;
    line-height: 1.45;
}

.edvibe-batch-section-close {
    flex: 0 0 auto;
    padding: 4px 9px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: #64748b;
    font-size: 25px;
    line-height: 1;
    cursor: pointer;
}

.edvibe-batch-section-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    padding: 22px 24px 0;
}

.edvibe-batch-section-grid {
    display: grid;
    grid-template-columns: minmax(280px, .82fr) minmax(380px, 1.18fr);
    gap: 22px;
}

.edvibe-batch-section-column {
    min-width: 0;
}

.edvibe-batch-section-field {
    display: grid;
    gap: 7px;
    color: #374151;
    font-size: 13px;
    font-weight: 650;
}

.edvibe-batch-section-field input,
.edvibe-batch-section-field textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 9px;
    background: #fff;
    color: #111827;
    font: 400 14px/1.45 "Segoe UI", Arial, sans-serif;
    outline: none;
}

.edvibe-batch-section-field textarea {
    resize: vertical;
    min-height: 92px;
}

.edvibe-batch-section-field input:focus,
.edvibe-batch-section-field textarea:focus,
.edvibe-batch-section-lesson:focus-within,
.edvibe-batch-section-overlay button:focus-visible {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, .14);
    outline: none;
}

.edvibe-batch-section-heading-row {
    justify-content: space-between;
    gap: 14px;
    margin: 20px 0 10px;
}

.edvibe-batch-section-heading-row h3,
.edvibe-batch-section-preview h3 {
    font-size: 14px;
}

.edvibe-batch-section-selection-actions,
.edvibe-batch-section-add-actions {
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
}

.edvibe-batch-section-selection-actions button,
.edvibe-batch-section-add-actions button,
.edvibe-batch-section-block-actions button {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #fff;
    color: #334155;
    font: 650 12px/1.2 "Segoe UI", Arial, sans-serif;
    cursor: pointer;
}

.edvibe-batch-section-selection-actions button,
.edvibe-batch-section-add-actions button {
    padding: 8px 10px;
}

.edvibe-batch-section-add-actions {
    justify-content: flex-start;
    margin-bottom: 10px;
}

.edvibe-batch-section-add-actions button {
    border-color: #bfdbfe;
    background: #eff6ff;
    color: #1d4ed8;
}

.edvibe-batch-section-lessons {
    overflow: auto;
    max-height: 390px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #fff;
}

.edvibe-batch-section-lesson {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 11px 12px;
    border-bottom: 1px solid #f1f5f9;
    color: #1f2937;
    font-size: 13px;
    line-height: 1.4;
    cursor: pointer;
}

.edvibe-batch-section-lesson:last-child {
    border-bottom: 0;
}

.edvibe-batch-section-lesson:hover {
    background: #f8fafc;
}

.edvibe-batch-section-lesson input {
    flex: 0 0 auto;
    margin-top: 2px;
}

.edvibe-batch-section-blocks {
    display: grid;
    gap: 10px;
}

.edvibe-batch-section-block {
    padding: 13px;
    border: 1px solid #dbeafe;
    border-radius: 12px;
    background: #f8fbff;
}

.edvibe-batch-section-block header {
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 11px;
}

.edvibe-batch-section-block strong {
    color: #1e3a8a;
    font-size: 13px;
}

.edvibe-batch-section-block > .edvibe-batch-section-field + .edvibe-batch-section-field {
    margin-top: 10px;
}

.edvibe-batch-section-block-actions {
    gap: 5px;
}

.edvibe-batch-section-block-actions button {
    min-width: 31px;
    padding: 6px 8px;
}

.edvibe-batch-section-block-actions button[data-block-action="remove"] {
    border-color: #fecaca;
    color: #b91c1c;
}

.edvibe-batch-section-preview {
    margin-top: 14px;
    padding: 14px;
    border: 1px dashed #94a3b8;
    border-radius: 12px;
    background: #f8fafc;
}

.edvibe-batch-section-preview-name {
    margin: 8px 0;
    color: #0f172a;
    font-size: 14px;
    font-weight: 700;
}

.edvibe-batch-section-preview ol,
.edvibe-batch-section-summary ul,
.edvibe-batch-section-errors ul {
    margin: 8px 0 0;
    padding-left: 20px;
}

.edvibe-batch-section-preview li,
.edvibe-batch-section-summary li,
.edvibe-batch-section-errors li {
    margin: 4px 0;
    overflow-wrap: anywhere;
}

.edvibe-batch-section-protocol,
.edvibe-batch-section-errors,
.edvibe-batch-section-summary,
.edvibe-batch-section-results {
    margin-top: 18px;
    padding: 14px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 13px;
    line-height: 1.48;
}

.edvibe-batch-section-protocol {
    border-color: #fcd34d;
    background: #fffbeb;
    color: #92400e;
}

.edvibe-batch-section-protocol p {
    margin: 5px 0 0;
}

.edvibe-batch-section-errors {
    border-color: #fecaca;
    background: #fef2f2;
    color: #991b1b;
}

.edvibe-batch-section-summary {
    border-color: #bfdbfe;
    background: #eff6ff;
    color: #1e3a8a;
}

.edvibe-batch-section-summary-group {
    margin-top: 13px;
    padding-top: 11px;
    border-top: 1px solid rgba(37, 99, 235, .18);
}

.edvibe-batch-section-summary-group h4 {
    margin: 0;
    color: #1e3a8a;
    font-size: 13px;
}

.edvibe-batch-section-result-list {
    display: grid;
    gap: 8px;
    margin-top: 12px;
}

.edvibe-batch-section-result {
    display: grid;
    grid-template-columns: minmax(160px, 1fr) auto;
    gap: 4px 12px;
    padding: 11px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #fff;
}

.edvibe-batch-section-result strong {
    color: #111827;
}

.edvibe-batch-section-result > span {
    color: #475569;
    font-weight: 700;
}

.edvibe-batch-section-result p,
.edvibe-batch-section-result small {
    grid-column: 1 / -1;
    margin: 0;
    color: #64748b;
    overflow-wrap: anywhere;
}

.edvibe-batch-section-result.is-created {
    border-color: #bbf7d0;
    background: #f0fdf4;
}

.edvibe-batch-section-result.is-failed,
.edvibe-batch-section-result.is-partially_created {
    border-color: #fed7aa;
    background: #fff7ed;
}

.edvibe-batch-section-result.is-rejected,
.edvibe-batch-section-result.is-not_attempted {
    background: #f8fafc;
}

.edvibe-batch-section-fatal-note {
    margin: 12px 0 0;
    padding: 10px 12px;
    border-radius: 9px;
    background: #fef2f2;
    color: #991b1b;
    font-weight: 650;
}

.edvibe-batch-section-empty {
    margin: 0;
    padding: 14px;
    color: #64748b;
    font-size: 13px;
    text-align: center;
}

.edvibe-batch-section-live-region {
    flex: 0 0 auto;
    padding: 14px 24px 0;
}

.edvibe-batch-section-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 7px;
    border: 2px solid #bfdbfe;
    border-top-color: #2563eb;
    border-radius: 50%;
    vertical-align: -3px;
    animation: edvibe-batch-section-spin .8s linear infinite;
}

@keyframes edvibe-batch-section-spin {
    to {
        transform: rotate(360deg);
    }
}

.edvibe-batch-section-status {
    min-height: 19px;
    margin: 0;
    color: #475569;
    font-size: 13px;
    line-height: 1.4;
}

.edvibe-batch-section-status[data-state="error"] {
    color: #b91c1c;
}

.edvibe-batch-section-status[data-state="warning"] {
    color: #a16207;
}

.edvibe-batch-section-progress {
    display: block;
    width: 100%;
    height: 10px;
    margin-top: 9px;
    overflow: hidden;
    border: 0;
    border-radius: 999px;
    background: #e5e7eb;
    appearance: none;
}

.edvibe-batch-section-progress::-webkit-progress-bar {
    background: #e5e7eb;
}

.edvibe-batch-section-progress::-webkit-progress-value {
    border-radius: 999px;
    background: linear-gradient(90deg, #2563eb, #16a34a);
}

.edvibe-batch-section-footer {
    flex: 0 0 auto;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 10px;
    padding: 18px 24px 22px;
}

.edvibe-batch-section-footer button {
    padding: 10px 16px;
    border: 1px solid #cbd5e1;
    border-radius: 9px;
    background: #fff;
    color: #334155;
    font: 650 13px/1.2 "Segoe UI", Arial, sans-serif;
    cursor: pointer;
}

.edvibe-batch-section-preflight,
.edvibe-batch-section-confirm {
    border-color: #2563eb !important;
    background: #2563eb !important;
    color: #fff !important;
}

.edvibe-batch-section-overlay button:hover:not(:disabled) {
    filter: brightness(.97);
}

.edvibe-batch-section-overlay button:disabled,
.edvibe-batch-section-overlay input:disabled,
.edvibe-batch-section-overlay textarea:disabled {
    cursor: not-allowed;
    opacity: .56;
}

@media (max-width: 820px) {
    .edvibe-batch-section-grid {
        grid-template-columns: 1fr;
    }

    .edvibe-batch-section-lessons {
        max-height: 260px;
    }
}

@media (max-width: 560px) {
    .edvibe-batch-section-overlay {
        padding: 8px;
    }

    .edvibe-batch-section-card {
        width: 100%;
        max-height: calc(100vh - 16px);
        border-radius: 13px;
    }

    .edvibe-batch-section-header,
    .edvibe-batch-section-body,
    .edvibe-batch-section-live-region,
    .edvibe-batch-section-footer {
        padding-left: 16px;
        padding-right: 16px;
    }

    .edvibe-batch-section-heading-row {
        align-items: flex-start;
        flex-direction: column;
    }

    .edvibe-batch-section-selection-actions {
        justify-content: flex-start;
    }

    .edvibe-batch-section-footer button {
        flex: 1 1 170px;
    }

    .edvibe-batch-section-result {
        grid-template-columns: 1fr;
    }
}

`,Ys=g`
.edvibe-batch-section-file-input {
    cursor: pointer;
}

.edvibe-batch-section-file-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 8px;
    color: #64748b;
    font-size: 12px;
    line-height: 1.4;
}

.edvibe-batch-section-file-details button {
    flex: 0 0 auto;
    padding: 6px 9px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #fff;
    color: #334155;
    font: 650 12px/1.2 "Segoe UI", Arial, sans-serif;
    cursor: pointer;
}

.edvibe-batch-section-file-error {
    margin: 8px 0 0;
    color: #b91c1c;
    font-size: 12px;
    line-height: 1.4;
}

.edvibe-batch-section-image-preview {
    display: block;
    width: 100%;
    max-height: 240px;
    margin-top: 10px;
    object-fit: contain;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #f8fafc;
}

`,Xs=`https://media-files-y.edvibe.com/local-upload/`;function Zs(e=globalThis.crypto){return e?.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`}function Qs(e){return`${Xs}${encodeURIComponent(String(e||``))}`}function $s(e){let t=String(e||``);if(!t.startsWith(`https://media-files-y.edvibe.com/local-upload/`))return``;try{return decodeURIComponent(t.slice(46))}catch{return``}}function ec(e){let t=Math.max(0,Number(e)||0);return t<1024?`${t} Б`:t<1024*1024?`${(t/1024).toFixed(1)} КБ`:`${(t/(1024*1024)).toFixed(1)} МБ`}function tc(){let e=new Map;return Object.freeze({register(t,n){t&&n&&e.set(String(t),n)},get(t){return e.get(String(t||``))||null},remove(t){e.delete(String(t||``))},clear(){e.clear()},size(){return e.size}})}function nc(e,t=globalThis.crypto){let n=e?.clientId||$s(e?.url)||Zs(t);return{...e,clientId:n,url:Qs(n),alt:String(e?.alt||``),fileName:String(e?.fileName||``),fileSize:Math.max(0,Number(e?.fileSize)||0),fileType:String(e?.fileType||``),previewUrl:String(e?.previewUrl||``),fileError:String(e?.fileError||``)}}var rc=class{constructor({registry:e=tc(),urlApi:t=globalThis.URL,cryptoApi:n=globalThis.crypto}={}){this.registry=e,this.urlApi=t,this.cryptoApi=n}createBlock(e={}){return nc(e,this.cryptoApi)}hasSelectedFile(e){return!e||e.type!==`image`||!!this.registry.get(e.clientId||$s(e.url))}canSubmit(e=[]){return!e.some(e=>e.type===`image`&&!this.hasSelectedFile(e))}selectFile(e,t){let n=this.releaseBlock(e);if(!t)return n;if(!String(t.type||``).startsWith(`image/`))return{...n,fileError:`Выберите файл изображения.`};let r=n.clientId||Zs(this.cryptoApi),i=this.urlApi?.createObjectURL?.(t)||``;return this.registry.register(r,t),{...n,clientId:r,url:Qs(r),fileName:String(t.name||``),fileSize:Math.max(0,Number(t.size)||0),fileType:String(t.type||``),previewUrl:i,fileError:``}}clearFile(e){return this.releaseBlock(e)}releaseBlock(e){if(!e||e.type!==`image`)return e;let t=e.clientId||$s(e.url);return t&&this.registry.remove(t),e.previewUrl&&this.urlApi?.revokeObjectURL?.(e.previewUrl),{...nc({...e,clientId:t},this.cryptoApi),fileName:``,fileSize:0,fileType:``,previewUrl:``,fileError:``}}releaseAll(e=[]){return e.map(e=>this.releaseBlock(e))}},ic=tc(),ac=new rc({registry:ic}),oc=`edvibe-toolbox-batch-section-creation-dialog`,sc=`edvibe-toolbox-batch-section-creation-overlay`,cc=class extends G{static styles=[Ae,je,Js,Ys];static properties={lessons:{state:!0},selectedLessonIds:{state:!0},blocks:{state:!0},sectionName:{state:!0},mode:{state:!0},recipeReady:{state:!0},recipeErrors:{state:!0},currentPlan:{state:!0},errors:{state:!0},result:{state:!0},fatalResultError:{state:!0},statusMessage:{state:!0},statusState:{state:!0},progress:{state:!0}};constructor(){super(),this.imageController=ac,this.lessons=[],this.selectedLessonIds=new Set,this.blocks=[],this.sectionName=``,this.nextBlockId=1,this.mode=`initializing`,this.recipeReady=!1,this.recipeErrors=[],this.currentPlan=null,this.errors=[],this.result=null,this.fatalResultError=null,this.statusMessage=``,this.statusState=``,this.progress={visible:!1,completed:0,total:0},this.onKeydownBound=e=>this.onKeydown(e)}connectedCallback(){super.connectedCallback(),this.id||=sc,this.ownerDocument?.addEventListener(`keydown`,this.onKeydownBound)}disconnectedCallback(){this.releaseImageFiles(),this.ownerDocument?.removeEventListener(`keydown`,this.onKeydownBound),super.disconnectedCallback()}configure(e={}){return e=e&&typeof e==`object`?e:{},e.imageController&&(this.imageController=e.imageController),this}showLoading(e=`Загрузка…`){return this.mode=`loading`,this.clearMessages(),this.setStatus(e),this}showConfigure({lessons:e=this.lessons,recipeReady:t=!1,recipeErrors:n=[]}={}){return this.mode=`configure`,this.lessons=Array.isArray(e)?e:[],this.recipeReady=!!t,this.recipeErrors=Array.isArray(n)?n:[],this.selectedLessonIds=new Set,this.currentPlan=null,this.progress={visible:!1,completed:0,total:0},this.clearMessages(),this.setStatus(`Настройте раздел и выберите уроки.`),this}showValidationErrors(e=[]){return this.mode=`validation-error`,this.errors=this.normalizeErrors(e),this.currentPlan=null,this.result=null,this.setStatus(`Исправьте ошибки и повторите проверку.`,`error`),this}showConfirmation(e){return this.mode=`confirm`,this.currentPlan=e,this.clearMessages(),this.setStatus(e?.eligible?.length?`Проверка завершена. Подтвердите создание.`:`Нет уроков, подходящих для создания.`,`warning`),this}showExecution(e={}){this.mode=`executing`;let t=Math.max(0,Number(e.completed)||0),n=Math.max(0,Number(e.total)||0);this.progress={visible:!0,completed:t,total:n};let r=e.lesson?` Сейчас: ${e.lesson.number}. ${e.lesson.name}.`:``;return this.setStatus(`Выполнено ${t} из ${n}.${r}`),this}showComplete(e={},t=null){return this.mode=`complete`,this.clearMessages(),this.result=e,this.fatalResultError=t,this.progress={visible:!1,completed:0,total:0},this.setStatus(t?`Операция остановлена. Частичный результат сохранён.`:`Пакетная операция завершена.`,t?`error`:``),this}showFatalError(e){return this.mode=`fatal-error`,this.clearMessages(),this.errors=this.normalizeErrors([e]),this.setStatus(`Не удалось открыть инструмент.`,`error`),this}clearMessages(){this.errors=[],this.result=null,this.fatalResultError=null,this.statusMessage=``,this.statusState=``}normalizeErrors(e){return(Array.isArray(e)?e:[e]).map(e=>({code:e?.code||`ERROR`,message:e?.message||String(e)}))}setStatus(e,t=``){this.statusMessage=String(e||``),this.statusState=String(t||``)}createBlock(e){let t={id:`block-${this.nextBlockId++}`,type:e};return e===`image`?this.imageController.createBlock({...t,url:``,alt:``}):e===`text`?{...t,text:``}:{...t,label:``,url:``}}blockLabel(e){return{image:`Баннер`,text:`Текст`,link:`Ссылка`}[e]||e}collectDefinition(){return{name:this.sectionName,blocks:this.blocks.map(e=>({...e}))}}updateBlock(e,t,n){this.blocks=this.blocks.map(r=>r.id===e?{...r,[t]:n}:r)}replaceBlock(e,t){this.blocks=this.blocks.map(n=>n.id===e?t:n)}onImageFileChange(e,t){let n=t.currentTarget.files?.[0]||null;this.replaceBlock(e.id,this.imageController.selectFile(e,n)),t.currentTarget.value=``}onClearImage(e){this.replaceBlock(e.id,this.imageController.clearFile(e))}releaseImageFiles(){!this.imageController||this.blocks.length===0||(this.blocks=this.imageController.releaseAll(this.blocks))}onLessonChange(e){let t=Number(e.currentTarget.value),n=new Set(this.selectedLessonIds);e.currentTarget.checked?n.add(t):n.delete(t),this.selectedLessonIds=n}onSelectAll(){this.selectedLessonIds=new Set(this.lessons.map(e=>Number(e.lessonId)))}onClearAll(){this.selectedLessonIds=new Set}onAddBlock(e){[`image`,`text`,`link`].includes(e)&&(this.blocks=[...this.blocks,this.createBlock(e)])}onBlockAction(e,t){let n=this.blocks.findIndex(t=>t.id===e);if(n<0)return;let r=[...this.blocks];if(t===`remove`){let[e]=r.splice(n,1);e?.type===`image`&&this.imageController.releaseBlock(e)}else if(t===`up`&&n>0){let[e]=r.splice(n,1);r.splice(n-1,0,e)}else if(t===`down`&&n<r.length-1){let[e]=r.splice(n,1);r.splice(n+1,0,e)}this.blocks=r}canPreflight(){return[`configure`,`validation-error`].includes(this.mode)&&this.selectedLessonIds.size>0&&this.sectionName.trim().length>0&&this.blocks.length>0&&this.imageController.canSubmit(this.blocks)}onPreflight(){this.canPreflight()&&this.dispatchEvent(new CustomEvent(`edvibe-batch-section-preflight`,{bubbles:!0,composed:!0,detail:{definition:this.collectDefinition(),selectedLessonIds:[...this.selectedLessonIds]}}))}onConfirm(){this.dispatchEvent(new CustomEvent(`edvibe-batch-section-confirm`,{bubbles:!0,composed:!0}))}onCopy(){this.dispatchEvent(new CustomEvent(`edvibe-batch-section-copy`,{bubbles:!0,composed:!0}))}onRestart(){this.releaseImageFiles(),this.sectionName=``,this.blocks=[],this.selectedLessonIds=new Set,this.dispatchEvent(new CustomEvent(`edvibe-batch-section-restart`,{bubbles:!0,composed:!0}))}close(){this.releaseImageFiles(),this.dispatchEvent(new CustomEvent(`edvibe-dialog-close`,{bubbles:!0,composed:!0})),this.remove()}onBackdrop(e){e.target===e.currentTarget&&!this.isBusy()&&this.close()}onKeydown(e){e.key===`Escape`&&!this.isBusy()&&this.close()}isBusy(){return[`loading`,`executing`].includes(this.mode)}resultStatusLabel(e){return{created:`Создано`,rejected:`Отклонено`,failed:`Ошибка`,partially_created:`Нужна ручная проверка`,not_attempted:`Не выполнено`}[e]||e}renderLesson(e,t){let n=Number(e.lessonId);return U`
            <label class="edvibe-batch-section-lesson">
                <input type="checkbox" .value=${String(n)}
                    .checked=${this.selectedLessonIds.has(n)}
                    ?disabled=${!t} @change=${this.onLessonChange}>
                <span>${e.number||`?`}. ${e.name}</span>
            </label>
        `}renderBlockField(e,t,n,r,i){return U`
            <label class="edvibe-batch-section-field">
                <span>${t}</span>
                ${r?U`<textarea data-block-field=${n} .value=${e[n]||``}
                        ?disabled=${!i}
                        @input=${t=>this.updateBlock(e.id,n,t.currentTarget.value)}></textarea>`:U`<input type="text" data-block-field=${n} .value=${e[n]||``}
                        ?disabled=${!i}
                        @input=${t=>this.updateBlock(e.id,n,t.currentTarget.value)}>`}
            </label>
        `}renderImageFields(e,t){return U`
            <label class="edvibe-batch-section-field">
                <span>Файл изображения</span>
                <input class="edvibe-batch-section-file-input" type="file" accept="image/*"
                    ?disabled=${!t}
                    @change=${t=>this.onImageFileChange(e,t)}>
            </label>
            ${e.fileName?U`
                <div class="edvibe-batch-section-file-details">
                    <span>${e.fileName} · ${ec(e.fileSize)}</span>
                    <button type="button" ?disabled=${!t}
                        @click=${()=>this.onClearImage(e)}>Убрать файл</button>
                </div>
            `:W}
            ${e.fileError?U`<p class="edvibe-batch-section-file-error">${e.fileError}</p>`:W}
            ${e.previewUrl?U`
                <img class="edvibe-batch-section-image-preview" src=${e.previewUrl}
                    alt=${e.alt||`Предпросмотр изображения`}>
            `:W}
            ${this.renderBlockField(e,`Альтернативный текст`,`alt`,!1,t)}
        `}renderBlock(e,t,n){return U`
            <article class="edvibe-batch-section-block" data-block-id=${e.id}>
                <header>
                    <strong>${t+1}. ${this.blockLabel(e.type)}</strong>
                    <div class="edvibe-batch-section-block-actions">
                        <button type="button" data-block-action="up" ?disabled=${!n||t===0}
                            @click=${()=>this.onBlockAction(e.id,`up`)}>↑</button>
                        <button type="button" data-block-action="down"
                            ?disabled=${!n||t===this.blocks.length-1}
                            @click=${()=>this.onBlockAction(e.id,`down`)}>↓</button>
                        <button type="button" data-block-action="remove" ?disabled=${!n}
                            @click=${()=>this.onBlockAction(e.id,`remove`)}>Удалить</button>
                    </div>
                </header>
                ${e.type===`image`?this.renderImageFields(e,n):e.type===`text`?U`
                        ${this.renderBlockField(e,`Текст или HTML`,`text`,!0,n)}
                    `:U`
                        ${this.renderBlockField(e,`Подпись кнопки`,`label`,!1,n)}
                        ${this.renderBlockField(e,`URL`,`url`,!1,n)}
                    `}
            </article>
        `}previewDetail(e){return e.type===`image`?e.fileName||`Файл не выбран`:e.type===`text`?e.text||`Текст не указан`:`${e.label||`Без подписи`} → ${e.url||`URL не указан`}`}renderRecipeState(){return this.recipeReady?W:U`
            <section class="edvibe-batch-section-protocol">
                <strong>Запись WebSocket ещё не подключена.</strong>
                <p>${this.recipeErrors[0]?.message||`Создание будет заблокировано, пока запись не преобразована в проверенный рецепт.`}</p>
            </section>
        `}renderErrors(){return this.errors.length===0?W:U`
            <section class="edvibe-batch-section-errors" aria-live="polite">
                <h3>Что нужно исправить</h3>
                <ul>${this.errors.map(e=>U`<li>${e.code}: ${e.message}</li>`)}</ul>
            </section>
        `}renderSummaryGroup(e,t,n){return U`
            <div class="edvibe-batch-section-summary-group">
                <h4>${e} (${t.length})</h4>
                <ul>${t.length?t.map(e=>U`<li>${n(e)}</li>`):U`<li>Нет</li>`}</ul>
            </div>
        `}renderPlan(){let e=this.currentPlan;return e?U`
            <section class="edvibe-batch-section-summary" aria-live="polite">
                <h3>Предварительный план</h3>
                <ul>
                    <li>Выбрано уроков: ${e.selectedLessonIds.length}</li>
                    <li>Готово к созданию: ${e.eligible.length}</li>
                    <li>Отклонено проверкой: ${e.rejected.length}</li>
                    <li>Раздел: ${e.definition.name}</li>
                    <li>Блоков: ${e.definition.blocks.length}</li>
                </ul>
                ${this.renderSummaryGroup(`Будут обработаны`,e.eligible,e=>`${e.number}. ${e.name}`)}
                ${this.renderSummaryGroup(`Отклонены`,e.rejected,e=>`${e.number}. ${e.name} — ${e.code}: ${e.message}`)}
            </section>
        `:W}renderResults(){return this.result?U`
            <section class="edvibe-batch-section-results" aria-live="polite">
                <h3>${this.fatalResultError?`Частичный результат`:`Результат`}</h3>
                <div class="edvibe-batch-section-result-list">
                    ${(this.result.results||[]).map(e=>U`
                        <article class=${`edvibe-batch-section-result is-${e.status}`}>
                            <strong>${e.lessonNumber||`?`}. ${e.lessonName}</strong>
                            <span>${this.resultStatusLabel(e.status)}</span>
                            <p>${e.code?`${e.code}: ${e.message||``}`:e.message||`Готово`}</p>
                            ${e.cleanup?U`<small>Очистка: ${e.cleanup.status}</small>`:W}
                        </article>
                    `)}
                </div>
                ${this.fatalResultError?U`
                    <p class="edvibe-batch-section-fatal-note">
                        ${this.fatalResultError.code||`INTERNAL_ERROR`}: ${this.fatalResultError.message}
                    </p>
                `:W}
            </section>
        `:W}render(){let e=[`configure`,`validation-error`].includes(this.mode),t=this.isBusy(),n=this.canPreflight();return U`
<div class="edvibe-batch-section-overlay" @click=${this.onBackdrop}>
                <section class="edvibe-batch-section-card" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-section-title">
                    <header class="edvibe-batch-section-header">
                        <div><p class="edvibe-batch-section-eyebrow">Edvibe Toolbox</p>
                            <h2 id="edvibe-batch-section-title">Создать раздел в нескольких уроках</h2>
                            <p class="edvibe-batch-section-description">Соберите раздел один раз, проверьте план и примените его к выбранным урокам.</p></div>
                        <button class="edvibe-batch-section-close" type="button" aria-label="Закрыть"
                            ?disabled=${t} @click=${()=>this.close()}>&times;</button>
                    </header>
                    <div class="edvibe-batch-section-body">
                        <section class="edvibe-batch-section-configure" ?hidden=${!e}>
                            <div class="edvibe-batch-section-grid">
                                <div class="edvibe-batch-section-column">
                                    <label class="edvibe-batch-section-field"><span>Название раздела</span>
                                        <input class="edvibe-batch-section-name" type="text" maxlength="200"
                                            autocomplete="off" placeholder="Например, Летняя акция"
                                            .value=${this.sectionName} ?disabled=${!e}
                                            @input=${e=>{this.sectionName=e.currentTarget.value}}></label>
                                    <div class="edvibe-batch-section-heading-row"><div><h3>Уроки</h3><p>Выберите все уроки, куда нужно добавить раздел.</p></div>
                                        <div class="edvibe-batch-section-selection-actions">
                                            <button class="edvibe-batch-section-select-all" type="button" ?disabled=${!e} @click=${this.onSelectAll}>Выбрать все</button>
                                            <button class="edvibe-batch-section-clear-all" type="button" ?disabled=${!e} @click=${this.onClearAll}>Очистить</button>
                                        </div></div>
                                    <div class="edvibe-batch-section-lessons" aria-label="Список уроков">
                                        ${this.lessons.length?this.lessons.map(t=>this.renderLesson(t,e)):U`<p class="edvibe-batch-section-empty">Уроки не найдены.</p>`}
                                    </div>
                                </div>
                                <div class="edvibe-batch-section-column">
                                    <div class="edvibe-batch-section-heading-row"><div><h3>Конструктор</h3><p>Порядок блоков сохранится при выполнении.</p></div></div>
                                    <div class="edvibe-batch-section-add-actions" role="group" aria-label="Добавить блок">
                                        ${[[`image`,`+ Баннер`],[`text`,`+ Текст`],[`link`,`+ Ссылка`]].map(([t,n])=>U`
                                            <button type="button" data-add-block=${t} ?disabled=${!e}
                                                @click=${()=>this.onAddBlock(t)}>${n}</button>`)}
                                    </div>
                                    <div class="edvibe-batch-section-blocks">
                                        ${this.blocks.length?this.blocks.map((t,n)=>this.renderBlock(t,n,e)):U`<p class="edvibe-batch-section-empty">Добавьте баннер, текст или ссылку.</p>`}
                                    </div>
                                    <section class="edvibe-batch-section-preview" aria-live="polite">
                                        <h3>Предпросмотр структуры</h3>
                                        <p class="edvibe-batch-section-preview-name">${this.sectionName.trim()||`Название не задано`}</p>
                                        <ol class="edvibe-batch-section-preview-blocks">
                                            ${this.blocks.length?this.blocks.map((e,t)=>U`<li>${t+1}. ${this.blockLabel(e.type)}: ${this.previewDetail(e)}</li>`):U`<li>Блоки не добавлены</li>`}
                                        </ol>
                                    </section>
                                </div>
                            </div>
                        </section>
                        ${this.renderRecipeState()}
                        ${this.renderErrors()}
                        ${this.renderPlan()}
                        ${this.renderResults()}
                    </div>
                    <div class="edvibe-batch-section-live-region">
                        <span class="edvibe-batch-section-spinner" role="img" aria-label="Выполняется операция" ?hidden=${!t}></span>
                        <p class="edvibe-batch-section-status" data-state=${this.statusState} role="status" aria-live="polite">${this.statusMessage}</p>
                        <progress class="edvibe-batch-section-progress" max=${this.progress.total}
                            value=${this.progress.completed} ?hidden=${!this.progress.visible}></progress>
                    </div>
                    <footer class="edvibe-batch-section-footer">
                        <button class="edvibe-batch-section-copy" type="button" ?hidden=${this.mode!==`complete`} @click=${this.onCopy}>Копировать отчёт</button>
                        <button class="edvibe-batch-section-restart" type="button" ?hidden=${this.mode!==`complete`} @click=${this.onRestart}>Создать другой раздел</button>
                        <button class="edvibe-batch-section-confirm" type="button" ?hidden=${this.mode!==`confirm`}
                            ?disabled=${!this.recipeReady||!this.currentPlan?.eligible?.length} @click=${this.onConfirm}>Подтвердить создание</button>
                        <button class="edvibe-batch-section-preflight" type="button" ?hidden=${!e}
                            ?disabled=${!n} @click=${this.onPreflight}>Проверить план</button>
                    </footer>
                </section>
            </div>
        `}};customElements.get(`edvibe-toolbox-batch-section-creation-dialog`)||customElements.define(oc,cc),globalThis.EdVibeBatchSectionCreationDialog={BatchSectionCreationDialog:cc,BATCH_SECTION_DIALOG_TAG:oc,BATCH_SECTION_OVERLAY_ID:sc};var lc=new Date().toISOString(),uc=Object.freeze({version:1,reviewedDynamicFields:!0,steps:Object.freeze([Object.freeze({id:`create-section`,controller:`LessonSectionWsController`,method:`AddStageSection`,projectName:`Books`,valueTemplate:Object.freeze({LessonId:`{{lesson.lessonId}}`,StageSectionName:`{{section.name}}`,SortId:4}),capture:Object.freeze({sectionId:`Value.StageSectionId`}),marksSectionCreated:!0}),Object.freeze({id:`confirm-section-name`,controller:`LessonSectionWsController`,method:`EditStageSection`,projectName:`Books`,valueTemplate:Object.freeze({LessonId:`{{lesson.lessonId}}`,StageSectionId:`{{captured.sectionId}}`,StageSectionName:`{{section.name}}`,SortId:4})}),Object.freeze({id:`save-image`,controller:`SaveExerciseWsController`,method:`SaveExercise`,projectName:`Exercises`,forEach:`blocks`,blockTypes:Object.freeze([`image`]),valueTemplate:Object.freeze({ClassId:null,Domain:`edvibe.com`,ExerciseView:Object.freeze({Id:0,Number:`{{blockIndex}}`,Name:``,IsHidePupil:!1,Type:27,HomeworkLessonId:null,PersonalMaterialId:null,LessonSectionId:`{{captured.sectionId}}`,Descriptions:Object.freeze([``]),ChangeExerciseImages:Object.freeze([Object.freeze({ImageId:687640222,FullImageId:687640223,ImageUrl:`https://media-y.edvibe.com/files/LessonExerciseImages/b455a98f-ef63-49b5-a6f4-2111c7edebc6.png`,FullImageUrl:`https://media-y.edvibe.com/files/LessonExerciseImages/035f9f67-1474-4eb3-8359-5eb93ea68a2e.png`,cropped:!1})])}),AiUsed:!1,UsedNewConstructor:!0,ClientTime:lc,DeviceType:`desktop`})}),Object.freeze({id:`save-cta`,controller:`SaveExerciseWsController`,method:`SaveExercise`,projectName:`Exercises`,forEach:`blocks`,blockTypes:Object.freeze([`link`]),valueTemplate:Object.freeze({ClassId:null,Domain:`edvibe.com`,ExerciseView:Object.freeze({Id:0,Number:`{{blockIndex}}`,Name:``,IsHidePupil:!1,Type:29,HomeworkLessonId:null,PersonalMaterialId:null,LessonSectionId:`{{captured.sectionId}}`,Button:Object.freeze({Link:`{{block.url}}`,Text:`{{block.label}}`})}),AiUsed:!1,UsedNewConstructor:!0,ClientTime:lc,DeviceType:`desktop`})})])}),dc=`https://media-files-y.edvibe.com/api/MediaFile/create-multiple`;function fc(e,t,n={}){let r=Error(t);return r.code=e,Object.assign(r,n),r}function pc(e){let t=String(e||``);if(!t.startsWith(`https://media-files-y.edvibe.com/local-upload/`))return``;try{return decodeURIComponent(t.slice(46))}catch{return``}}function mc(e,t){let n=typeof e==`string`||e instanceof URL?String(e):String(e?.url||``);try{return new URL(n,t||`https://edvibe.com/`)}catch{return null}}function hc(e,t){let n=mc(e,t);return!!n&&n.protocol===`https:`&&(n.hostname===`edvibe.com`||n.hostname.endsWith(`.edvibe.com`))}function gc(e,t,n=globalThis.Headers){if(!e)return``;try{if(n)return new n(e).get(t)||``}catch{}let r=String(t).toLowerCase();if(Array.isArray(e)){let t=e.find(([e])=>String(e).toLowerCase()===r);return t?String(t[1]||``):``}for(let[t,n]of Object.entries(e))if(String(t).toLowerCase()===r)return String(n||``);return``}function _c(e){let t=``,n=e.location?.href||`https://edvibe.com/`,r=e.fetch,i=e.Headers;function a(e,r){if(!hc(e,n))return;let a=gc(r,`authorization`,i);a&&(t=a)}typeof r==`function`&&(e.fetch=function(e,t){return a(e,t?.headers||e?.headers),r.apply(this,arguments)});let o=e.XMLHttpRequest?.prototype;if(o?.open&&o?.setRequestHeader){let e=o.open,r=o.setRequestHeader,i=new WeakMap;o.open=function(t,n){return i.set(this,n),e.apply(this,arguments)},o.setRequestHeader=function(e,a){return String(e).toLowerCase()===`authorization`&&hc(i.get(this),n)&&a&&(t=String(a)),r.apply(this,arguments)}}return Object.freeze({getAuthorization:()=>t,capture:a})}function vc(e){if(!e||!Array.isArray(e.steps))return e;let t=e.steps.map(e=>{if(e.id!==`save-image`)return e;let t=e.valueTemplate?.ExerciseView||{};return Object.freeze({...e,valueTemplate:Object.freeze({...e.valueTemplate,ExerciseView:Object.freeze({...t,ChangeExerciseImages:Object.freeze([Object.freeze({ImageId:`{{block.asset.imageId}}`,FullImageId:`{{block.asset.fullImageId}}`,ImageUrl:`{{block.asset.imageUrl}}`,FullImageUrl:`{{block.asset.fullImageUrl}}`,cropped:!1})])})})})});return Object.freeze({...e,steps:Object.freeze(t)})}async function yc({definition:e,registry:t,authorization:n,fetchFn:r,FormDataCtor:i}){let a=(e?.blocks||[]).filter(e=>e.type===`image`);if(a.length===0)return e;if(!n)throw fc(`AUTH_CONTEXT_UNAVAILABLE`,`Edvibe authorization context is unavailable. Reload the page and try again.`);let o=new i;o.append(`Type`,`8`),o.append(`SaveOriginal`,`true`),o.append(`IsOriginalSizeOutputImage`,`true`);let s=[];a.forEach((e,n)=>{let r=pc(e.url),i=t?.get?.(r);if(!r||!i)throw fc(`IMAGE_FILE_REQUIRED`,`Image block ${n+1} requires a selected file.`);s.push(r),o.append(`Files[${n}]`,i,i.name),o.append(`Selections[${n}].X`,`0`),o.append(`Selections[${n}].Y`,`0`),o.append(`Selections[${n}].Width`,`0`),o.append(`Selections[${n}].Height`,`0`),o.append(`Ids[${n}]`,r)});let c;try{c=await r(dc,{method:`POST`,headers:{accept:`*/*`,authorization:n},body:o,mode:`cors`,credentials:`include`})}catch(e){throw fc(`MEDIA_UPLOAD_FAILED`,`Could not upload the selected image.`,{cause:e})}if(!c?.ok)throw fc(`MEDIA_UPLOAD_FAILED`,`Edvibe image upload failed with HTTP ${c?.status||`unknown`}.`);let l;try{l=await c.json()}catch(e){throw fc(`INVALID_MEDIA_RESPONSE`,`Edvibe returned an invalid image response.`,{cause:e})}if(!l?.IsSuccess)throw fc(`MEDIA_UPLOAD_REJECTED`,l?.ErrorMessage||`Edvibe rejected the selected image.`);if((l?.Data?.ErrorItems||[]).length>0)throw fc(`MEDIA_UPLOAD_PARTIAL`,`Edvibe failed to upload one or more selected images.`,{errorItems:l.Data.ErrorItems});let u=new Map((l?.Data?.Items||[]).map(e=>[String(e.OldId||``),Object.freeze({imageId:e.Id,fullImageId:e.IdFull,imageUrl:e.Url,fullImageUrl:e.UrlFull})]));for(let e of s)if(!u.has(e))throw fc(`INVALID_MEDIA_RESPONSE`,`Edvibe did not return an asset for every selected image.`);let d=e.blocks.map(e=>{if(e.type!==`image`)return e;let t=pc(e.url);return Object.freeze({...e,asset:u.get(t)})});return Object.freeze({...e,blocks:Object.freeze(d)})}function bc({originalFactory:e,registry:t,authorizationCapture:n,fetchFn:r,FormDataCtor:i}){return typeof e==`function`?function(a){let o=e(a),s=new WeakMap;async function c(e){if(!e||typeof e!=`object`)return e;let a=s.get(e);return a||(a=yc({definition:e,registry:t,authorization:n.getAuthorization(),fetchFn:r,FormDataCtor:i}),s.set(e,a)),a}return Object.freeze({...o,async createSection(e){let t=await c(e.definition);return o.createSection({...e,definition:t})},async cleanupSection(e){let t=await c(e.definition);return o.cleanupSection({...e,definition:t})}})}:null}var xc=globalThis.document?_c(globalThis):null,Sc=vc(uc),Cc=xc?bc({originalFactory:os,registry:ic,authorizationCapture:xc,fetchFn:globalThis.fetch.bind(globalThis),FormDataCtor:globalThis.FormData}):os,wc=s({DIALOG_TAG:()=>Tc,buildDeleteRequest:()=>Nc,buildExecutionHistoryInput:()=>Rc,buildExecutionPlan:()=>Mc,createBatchSectionDeletionFeature:()=>zc,executePlan:()=>Ic,extractNormalSections:()=>kc,findExactSectionMatches:()=>Ac,formatReport:()=>Lc,inspectLessonsSequentially:()=>Fc,loadLessonCatalogue:()=>Pc,normalizeLesson:()=>Oc,normalizeSectionName:()=>Dc,parseMarathonId:()=>ni}),Tc=`edvibe-toolbox-batch-section-deletion-dialog`,Ec=new Set([`SERVER_REJECTED`,`INVALID_RESPONSE`,`REQUEST_TIMEOUT`,`SEND_FAILED`,`WS_UNAVAILABLE`]);function Dc(e){let t=String(e||``).trim();if(!t)throw Y(`SECTION_NAME_REQUIRED`,`Enter the exact section name.`);return t}function Oc(e,t=0){let n=Number(e?.LessonId??e?.lessonId??e?.Id);return Object.freeze({lessonId:n,marathonLessonId:Number(e?.MarathonLessonId??e?.marathonLessonId??e?.Id),number:Number(e?.Number??e?.number??t+1),name:String(e?.Name??e?.name??`Lesson ${t+1}`)})}function kc(e){let t=e?.Value??e?.value??e;if(!t||!Array.isArray(t.Sections))throw Y(`INVALID_LESSON_RESPONSE`,`The lesson response did not contain a normal Sections array.`);return t.Sections}function Ac(e,t){let n=Dc(t);if(!Array.isArray(e))throw Y(`INVALID_LESSON_RESPONSE`,`Sections must be an array.`);return e.filter(e=>String(e?.Name??``)===n)}function jc(e,t,n){return Object.freeze({...e,status:`rejected`,code:t,message:n})}function Mc({lessons:e,selectedLessonIds:t,sectionName:n,inspectionsByLessonId:r}){let i=Dc(n),a=new Set((t||[]).map(Number)),o=[],s=[];for(let t of(e||[]).filter(e=>a.has(Number(e.lessonId)))){let e=r.get(Number(t.lessonId));if(!e||e.error){let n=e?.error;s.push(jc(t,n?.code||`INVALID_LESSON_RESPONSE`,n?.message||`The lesson could not be inspected.`));continue}try{let n=Ac(kc(e.response),i);if(n.length===0)s.push(jc(t,`SECTION_NOT_FOUND`,`Section "${i}" was not found.`));else if(n.length>1)s.push(jc(t,`SECTION_NAME_AMBIGUOUS`,`Found ${n.length} sections named "${i}".`));else{let e=Number(n[0]?.Id);!Number.isSafeInteger(e)||e<=0?s.push(jc(t,`UNSUPPORTED_SECTION_TYPE`,`The matching section has no safe normal-section ID.`)):o.push(Object.freeze({...t,sectionName:i,sectionId:e}))}}catch(e){s.push(jc(t,e.code||`INVALID_LESSON_RESPONSE`,e.message))}}return Object.freeze({sectionName:i,selectedCount:a.size,eligible:Object.freeze(o),rejected:Object.freeze(s)})}function Nc(e){return Object.freeze({controller:`LessonSectionWsController`,method:`DeleteStageSection`,projectName:`Books`,value:Object.freeze({StageSectionId:e.sectionId})})}async function Pc({sendRequest:e,marathonId:t,pageSize:n=100}){return(await fi({sendRequest:e,marathonId:t,pageSize:n})).map(Oc)}async function Fc({lessons:e,selectedLessonIds:t,sendRequest:n,wait:r,requestDelayMs:i=250,onProgress:a}){let o=new Set((t||[]).map(Number)),s=e.filter(e=>o.has(Number(e.lessonId))),c=new Map;for(let[e,t]of s.entries()){try{let e=await pi({sendRequest:n,lessonId:t.lessonId});kc(e),c.set(t.lessonId,{response:e})}catch(e){c.set(t.lessonId,{error:Y(e.code||`INVALID_LESSON_RESPONSE`,e.message||`Inspection failed.`)})}a?.({current:e+1,total:s.length,lesson:t}),e<s.length-1&&i>0&&await r(i)}return c}async function Ic({plan:e,sendRequest:t,wait:n,requestDelayMs:r=300,onProgress:i}){let a=e.rejected.map(e=>({...e})),o=null;for(let[s,c]of e.eligible.entries()){if(o){a.push({...c,status:`not_attempted`,code:`OPERATION_INTERRUPTED`,message:`Not attempted because the operation stopped.`});continue}try{let e=Nc(c),n=await t(e.controller,e.method,e.projectName,e.value),r=n?.Value??n?.value;if(n?.IsSuccess===!1||n?.isSuccess===!1||r===!1||r==null)throw Y(`INVALID_RESPONSE`,`Deletion was not positively confirmed.`);a.push({...c,status:`deleted`,code:`DELETED`,message:`Section deleted.`})}catch(e){let t=e.code||`DELETE_FAILED`;a.push({...c,status:`failed`,code:t,message:e.message||`Deletion failed.`}),Ec.has(t)||(o=e)}i?.({current:s+1,total:e.eligible.length,entry:c,results:[...a]}),s<e.eligible.length-1&&r>0&&!o&&await n(r)}return Object.freeze({plan:e,results:Object.freeze(a.map(Object.freeze)),fatalError:o})}function Lc(e){let t=[`Edvibe Toolbox: batch section deletion`,`Section: ${e.plan.sectionName}`,`Selected: ${e.plan.selectedCount}`,`Eligible: ${e.plan.eligible.length}`,`Rejected: ${e.plan.rejected.length}`,``];for(let n of e.results){let e=`#${n.number} ${n.name} (lesson ${n.lessonId})`,r=n.sectionId?`, section ${n.sectionId}`:``;t.push(`[${n.status}] ${e}${r}: ${n.code} — ${n.message}`)}return t.join(`
`)}function Rc({marathonId:e,startedAt:t,completedAt:n,result:r}){let i=r.results.filter(e=>e.status===`deleted`).length,a=r.results.filter(e=>e.status===`failed`).length,o=r.results.filter(e=>e.status===`rejected`).length,s=r.results.filter(e=>e.status===`not_attempted`).length,c=r.fatalError?`interrupted`:a>0||o>0?`completed_with_failures`:`completed`;return Object.freeze({operationType:`batch-section-deletion`,startedAt:t,completedAt:n,status:c,pageContext:Object.freeze({marathonId:e}),counts:Object.freeze({requested:r.plan.selectedCount,eligible:r.plan.eligible.length,attempted:i+a,successful:i,noOp:0,skipped:o,failed:a,notAttempted:s}),results:Object.freeze(r.results.map(e=>Object.freeze({itemId:`lesson-${e.lessonId}`,label:`#${e.number} ${e.name}`,status:e.status,code:e.code,message:e.message,attempts:e.status===`not_attempted`||e.status===`rejected`?0:1,data:Object.freeze({lessonId:e.lessonId,marathonLessonId:e.marathonLessonId,sectionId:e.sectionId||null,sectionName:r.plan.sectionName})})))})}function zc({sendRequest:e,getConnectionState:t,wait:n,canStart:r,onActiveChange:i,createDialog:a,copyText:o,persistExecution:s=async()=>Object.freeze({stored:!1}),openHistory:c=()=>{},log:l=()=>{}}){let u=!1;async function d(){if(u||!r()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}let d=ni(window.location.href);if(!d){window.alert(`Open an Edvibe marathon page first.`);return}if(t?.()?.ready===!1){window.alert(`Edvibe WebSocket connection is not ready.`);return}u=!0,i(!0);let f=a();document.body.append(f);try{let t=await Pc({sendRequest:e,marathonId:d});f.configure({marathonId:d,lessons:t,async onInspect(r){let i=await Fc({lessons:t,selectedLessonIds:r.selectedLessonIds,sendRequest:e,wait:n,onProgress:r.onProgress});return Mc({lessons:t,selectedLessonIds:r.selectedLessonIds,sectionName:r.sectionName,inspectionsByLessonId:i})},async onExecute(t,r){let i=new Date().toISOString(),a=await Ic({plan:t,sendRequest:e,wait:n,onProgress:r}),o=new Date().toISOString(),c;try{c=await s(Rc({marathonId:d,startedAt:i,completedAt:o,result:a}))}catch(e){c=Object.freeze({stored:!1,persistenceError:e}),l(`Batch section deletion history persistence failed:`,e)}return{...a,report:Lc(a),history:c}},onCopy:o,onOpenHistory(e){f.remove(),u=!1,i(!1),c(e)},onClose(){f.remove(),u=!1,i(!1)}})}catch(e){l(`Failed to open batch section deletion:`,e),f.remove(),u=!1,i(!1),window.alert(e.message||`Failed to load lessons.`)}}return Object.freeze({open:d})}var Bc=`batch-section-deletion`,Vc=new Set([`completed`,`completed_with_failures`,`cancelled`,`interrupted`]),Hc=new Set([`deleted`,`failed`]);function Uc(e,t=``,n=1e3){let r=String(e??``).trim();return r?r.length<=n?r:`${r.slice(0,n-1)}…`:t}function Wc(e){let t=String(e||``).match(/\/marathon\/(\d+)(?:\/|$)/);return t?String(t[1]):null}function Gc(e){let t=e?.lessonId??e?.LessonId;return t==null?null:String(t)}function Kc(e={}){return e.discoveryOutcome?Uc(e.discoveryOutcome,`inspection_failed`,120):{SECTION_NOT_FOUND:`not_found`,SECTION_NAME_AMBIGUOUS:`ambiguous`,UNSUPPORTED_SECTION_TYPE:`unsupported_section_type`,INVALID_LESSON_RESPONSE:`invalid_lesson_response`}[e.code]||(e.sectionId?`matched`:`inspection_failed`)}function qc(e={},t=[]){let n=Uc(e.sectionName,`Unnamed section`,500),r=(e.eligible||[]).map(e=>Object.freeze({...e,sectionName:n,sectionType:`normal`,discoveryOutcome:`matched`,matchCount:1})),i=(e.rejected||[]).map(e=>Object.freeze({...e,sectionName:n,sectionId:null,sectionType:null,discoveryOutcome:Kc(e),matchCount:e.code===`SECTION_NOT_FOUND`?0:null,attempts:0}));return Object.freeze({...e,sectionName:n,selectedLessonIds:Object.freeze([...t]),selectedCount:Number.isSafeInteger(e.selectedCount)?e.selectedCount:t.length,eligible:Object.freeze(r),rejected:Object.freeze(i)})}function Jc(e,t){return e.code?Uc(e.code,`UNKNOWN_RESULT`,120):e.status===`deleted`?`DELETED`:e.status===`rejected`?`PREFLIGHT_REJECTED`:e.status===`failed`?`DELETE_FAILED`:t===`cancelled`?`OPERATION_CANCELLED`:`OPERATION_INTERRUPTED`}function Yc(e,t){return e.message?Uc(e.message,`No message was provided.`):e.status===`deleted`?`Section deleted.`:e.status===`rejected`?`The lesson was rejected during discovery.`:e.status===`failed`?`The validated deletion request failed.`:t===`cancelled`?`Not attempted because the confirmed run was cancelled.`:`Not attempted because the confirmed run was interrupted.`}function Xc(e={},t={},n=null){let r=new Map;for(let t of e.rejected||[])r.set(Gc(t),{...t,status:`rejected`,attempts:0});for(let e of t.results||[])r.set(Gc(e),{...e});let i=new Map((e.eligible||[]).map(e=>[Gc(e),e])),a=[],o=new Set;for(let t of e.selectedLessonIds||[]){let n=String(t),s=r.get(n);!s&&i.has(n)&&(s={...i.get(n),status:`not_attempted`,attempts:0}),s||={lessonId:t,name:`Lesson ${t}`,status:`not_attempted`,attempts:0,sectionName:e.sectionName},a.push(s),o.add(n)}for(let e of[...r.values(),...i.values()]){let t=Gc(e);t!==null&&o.has(t)||(a.push(r.get(t)||{...e,status:`not_attempted`,attempts:0}),t!==null&&o.add(t))}return a.map(e=>{let t=Uc(e.status,`not_attempted`,80);return{...e,status:t,attempts:Number.isSafeInteger(e.attempts)&&e.attempts>=0?e.attempts:+!!Hc.has(t),terminalStatus:n}})}function Zc(e){if(Number.isSafeInteger(e.matchCount)&&e.matchCount>=0)return e.matchCount;if(e.sectionId)return 1;if(e.code===`SECTION_NOT_FOUND`)return 0;let t=String(e.message||``).match(/Found (\d+) sections/);return t?Number(t[1]):null}function Qc(e,t,n){let r=e.status,i=Jc(e,n),a=Yc(e,n),o=Kc(e),s=Object.freeze({lessonId:e.lessonId??null,marathonLessonId:e.marathonLessonId??null,number:e.number??null,name:Uc(e.name,`Unnamed lesson`,500)});return Object.freeze({itemId:s.lessonId===null?null:`lesson-${s.lessonId}`,label:`${s.number??`?`}. ${s.name}`,status:r,code:i,message:a,attempts:e.attempts,data:Object.freeze({lesson:s,section:Object.freeze({requestedName:Uc(e.sectionName||t.sectionName,`Unnamed section`,500),matchedId:e.sectionId??null,supportedType:e.sectionId?`normal`:null}),discovery:Object.freeze({outcome:o,code:o===`matched`?`DISCOVERY_MATCHED`:i,message:o===`matched`?`Exactly one supported normal lesson section matched the requested name.`:a,matchCount:Zc(e)}),finalOutcome:r,deletionFailure:r===`failed`?Object.freeze({code:i,message:a,attemptCount:e.attempts}):null})})}function $c(e,t,n){return Vc.has(e)?e:t?`interrupted`:n.some(e=>[`rejected`,`failed`,`not_attempted`].includes(e.status))?`completed_with_failures`:`completed`}function el({plan:e,result:t={},startedAt:n,completedAt:r,marathonId:i,marathonName:a=null,terminalStatus:o=null,fatalError:s=null}){let c=Vc.has(o)?o:s||t.fatalError?`interrupted`:null,l=Xc(e,t,c).map(t=>Qc(t,e,c)),u=$c(o,s||t.fatalError,l),d=l.filter(e=>Hc.has(e.status)).length,f=l.filter(e=>e.status===`not_attempted`).length,p=Object.freeze({requested:l.length,eligible:Math.max(e.eligible?.length||0,d+f),attempted:d,successful:l.filter(e=>e.status===`deleted`).length,noOp:0,skipped:l.filter(e=>e.status===`rejected`).length,failed:l.filter(e=>e.status===`failed`).length,notAttempted:f});return Object.freeze({operationType:Bc,startedAt:n,completedAt:r,status:u,pageContext:Object.freeze({marathonId:i,marathonName:a}),counts:p,results:Object.freeze(l),message:JSON.stringify({sectionName:e.sectionName,counts:p})})}function tl(e,t){let n=e.shadowRoot?.querySelector?.(`.status`)?.textContent||``;e.showStatus?.(`${n}${n?` `:``}${t}`)}function nl(e,t,n){let r=(e.ownerDocument||globalThis.document)?.createElement?.(`button`);r&&(r.type=`button`,r.className=`edvibe-batch-section-deletion-history`,r.textContent=`Open in history`,r.addEventListener(`click`,()=>n?.(t)),e.shadowRoot?.querySelector?.(`footer`)?.appendChild?.(r))}function rl(e={}){let{createFeature:t=zc,createDialog:n,persistExecution:r,getLocationHref:i=()=>``,getMarathonName:a=()=>null,now:o=()=>new Date,log:s=()=>{},...c}=e;if(typeof n!=`function`)throw TypeError(`createDialog is required`);if(typeof r!=`function`)throw TypeError(`persistExecution is required`);function l(){let e=n(),t=e.configure.bind(e),c=null,l=null,u=null,d=!1,f=0;async function p(e,t=null,n=null){let d=f;try{let s=o().toISOString(),p=el({plan:c,result:e||l||{},startedAt:u||s,completedAt:s,marathonId:Wc(i()),marathonName:a(),terminalStatus:t,fatalError:n}),m=await r(p);return d===f?m:Object.freeze({stored:!1,stale:!0})}catch(e){return s(`Batch section deletion history persistence failed:`,e),Object.freeze({stored:!1,persistenceError:e})}}return e.configure=(n={})=>{let r=n.onInspect,i=n.onExecute,a=n.onClose,s=n.onOpenHistory;return t({...n,async onInspect(t){let n=await r(t);return f+=1,c=qc(n,t?.selectedLessonIds||[]),l={plan:c,results:[]},u=o().toISOString(),d=!1,c.eligible.length||(d=!0,p(l).then(t=>{t?.stored?(tl(e,`Result saved to execution history.`),t.record?.id&&nl(e,t.record.id,s)):t?.persistenceError&&tl(e,`The visible preflight is intact, but history could not be saved.`)})),c},async onExecute(e,t){c=qc(e,e.selectedLessonIds||[]),u||=o().toISOString(),d=!1;try{let e=await i(c,(e={})=>{Array.isArray(e.results)&&(l={plan:c,results:[...e.results],fatalError:e.fatalError||null}),t?.(e)});l=e,d=!0;let n=await p(e,e.fatalError?`interrupted`:null,e.fatalError||null);return{...e,history:n}}catch(e){throw d=!0,await p(l,`interrupted`,e),e}},onOpenHistory:s,onClose(){c&&!d&&(d=!0,p(l,`cancelled`)),a?.()}})},e}return t({...c,createDialog:l,log:s})}function il(e=wc){return Object.freeze({...e,createBatchSectionDeletionFeature(t={}){return rl({...t,createFeature:e.createBatchSectionDeletionFeature,getLocationHref:t.getLocationHref||(()=>globalThis.location?.href||``),getMarathonName:t.getMarathonName||(()=>globalThis.document?.querySelector?.(`h1`)?.textContent?.trim()||globalThis.document?.title||null)})}})}function al(e={}){return il(wc).createBatchSectionDeletionFeature(e)}var ol=g`
:host{all:initial;font-family:Inter,system-ui,sans-serif;color:#202124}.overlay{position:fixed;inset:0;z-index:2147483647;background:rgba(16,20,30,.66);display:grid;place-items:center;padding:24px}.dialog{width:min(900px,96vw);max-height:92vh;background:#fff;border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden}.dialog header,.dialog footer{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 22px;border-bottom:1px solid #e6e8ec}.dialog footer{border-bottom:0;border-top:1px solid #e6e8ec;justify-content:flex-end}.dialog h2,.dialog p{margin:0}.dialog p{margin-top:4px;color:#68707d}.dialog main{padding:20px 22px;overflow:auto;display:grid;gap:16px}label{display:grid;gap:6px;font-weight:600}input[type=text]{padding:10px 12px;border:1px solid #b9c0ca;border-radius:8px;font:inherit}.toolbar{display:flex;align-items:center;gap:8px}.selection{margin-left:auto;color:#68707d}.lessons{border:1px solid #dde1e7;border-radius:10px;max-height:280px;overflow:auto}.lesson{display:flex;grid-template-columns:none;align-items:center;gap:10px;padding:10px 12px;font-weight:400;border-bottom:1px solid #edf0f3}.lesson:last-child{border-bottom:0}.status{padding:10px 12px;background:#f3f5f8;border-radius:8px}.preflight,.result{border:1px solid #dde1e7;border-radius:10px;padding:14px}.preflight h3,.preflight h4{margin:0 0 8px}.preflight dl{display:flex;gap:20px;margin:0 0 14px}.preflight dl div{display:flex;gap:6px}.preflight dd{margin:0;font-weight:700}.preflight ul{margin:0 0 14px;padding-left:20px}.result textarea{box-sizing:border-box;width:100%;min-height:220px;resize:vertical;font:12px/1.5 ui-monospace,monospace}.result-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.result-actions .history{background:#315efb;color:#fff}button{border:0;border-radius:8px;padding:9px 13px;font:600 14px/1.2 inherit;background:#eef1f5;color:#222;cursor:pointer}button:hover{filter:brightness(.97)}button:disabled{opacity:.5;cursor:not-allowed}.inspect{background:#315efb;color:#fff}.danger{background:#c62828;color:#fff}.secondary{background:#eef1f5}.icon{font-size:24px;line-height:1;padding:5px 9px;background:transparent}@media(max-width:640px){.overlay{padding:8px}.dialog{max-height:98vh}.dialog header,.dialog footer,.dialog main{padding:14px}.dialog footer{flex-wrap:wrap}.preflight dl{flex-wrap:wrap}}

`,sl=`edvibe-toolbox-batch-section-deletion-dialog`,cl=class extends G{static styles=[Ae,je,ol];static properties={options:{state:!0},sectionName:{state:!0},selectedLessonIds:{state:!0},plan:{state:!0},executionId:{state:!0},busy:{state:!0},statusMessage:{state:!0},statusVisible:{state:!0},resultReport:{state:!0},resultVisible:{state:!0}};constructor(){super(),this.options=null,this.sectionName=``,this.selectedLessonIds=new Set,this.plan=null,this.executionId=null,this.busy=!1,this.statusMessage=``,this.statusVisible=!1,this.resultReport=``,this.resultVisible=!1}configure(e={}){return this.options=e&&typeof e==`object`?e:{},this.selectedLessonIds=new Set,this.plan=null,this.executionId=null,this.resultReport=``,this.resultVisible=!1,this}selectedIds(){return[...this.selectedLessonIds]}setLessonSelected(e,t){if(this.busy)return;let n=new Set(this.selectedLessonIds);t?n.add(Number(e)):n.delete(Number(e)),this.selectedLessonIds=n}selectAll(){this.busy||(this.selectedLessonIds=new Set((this.options?.lessons||[]).map(e=>Number(e.lessonId))))}clearSelection(){this.busy||(this.selectedLessonIds=new Set)}setBusy(e){this.busy=!0,this.showStatus(e)}clearBusy(){this.busy=!1}async inspect(){let e=this.selectedIds();if(!this.sectionName.trim()||e.length===0){this.showStatus(`Enter a section name and select at least one lesson.`);return}this.setBusy(`Inspecting lessons…`);try{this.plan=await this.options.onInspect({sectionName:this.sectionName,selectedLessonIds:e,onProgress:({current:e,total:t})=>this.showStatus(`Inspecting ${e}/${t}…`)})}catch(e){this.showStatus(e.message||`Inspection failed.`)}finally{this.clearBusy()}}async execute(){if(!(!this.plan||this.plan.eligible.length===0)){this.setBusy(`Deleting sections…`);try{let e=await this.options.onExecute(this.plan,({current:e,total:t})=>this.showStatus(`Deleting ${e}/${t}…`));this.resultReport=String(e.report||``),this.resultVisible=!0,this.executionId=e.history?.stored&&e.history.record?.id||null;let t=e.fatalError?`Stopped after an operation-wide error. Partial results retained.`:`Deletion finished.`,n=e.history?.stored?` Saved to execution history.`:e.history?.persistenceError?` The visible report is intact, but history could not be saved.`:``;this.showStatus(`${t}${n}`)}catch(e){this.showStatus(e.message||`Deletion failed.`)}finally{this.clearBusy()}}}showStatus(e){this.statusMessage=String(e||``),this.statusVisible=!0}close(){this.busy||this.options?.onClose?.()}openHistory(){this.executionId&&this.options?.onOpenHistory?.(this.executionId)}renderPlanGroup(e,t,n){return U`
            <h4>${e}</h4>
            <ul>${t.length?t.map(e=>U`<li>${n(e)}</li>`):U`<li>None</li>`}</ul>
        `}renderPlan(){return this.plan?U`
            <section class="preflight">
                <h3>Preflight</h3>
                <dl>
                    <div><dt>Selected</dt><dd>${this.plan.selectedCount}</dd></div>
                    <div><dt>Eligible</dt><dd>${this.plan.eligible.length}</dd></div>
                    <div><dt>Rejected</dt><dd>${this.plan.rejected.length}</dd></div>
                </dl>
                ${this.renderPlanGroup(`Will delete`,this.plan.eligible,e=>`#${e.number} ${e.name} → section ${e.sectionId}`)}
                ${this.renderPlanGroup(`Will not modify`,this.plan.rejected,e=>`#${e.number} ${e.name}: ${e.code} — ${e.message}`)}
            </section>
        `:W}render(){let e=this.options?.lessons||[],t=!!this.plan?.eligible?.length&&!this.resultVisible;return U`
<div class="overlay">
                <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="title">
                    <header>
                        <div><h2 id="title">Delete section from lessons</h2><p>Every lesson is inspected before any deletion.</p></div>
                        <button class="icon close" type="button" aria-label="Close" ?disabled=${this.busy}
                            @click=${()=>this.close()}>×</button>
                    </header>
                    <main>
                        <label>Exact section name<input class="section-name" type="text" autocomplete="off"
                            placeholder="Ogłoszenie" .value=${this.sectionName} ?disabled=${this.busy}
                            @input=${e=>{this.sectionName=e.currentTarget.value}}></label>
                        <div class="toolbar">
                            <button class="select-all" type="button" ?disabled=${this.busy} @click=${this.selectAll}>Select all</button>
                            <button class="clear" type="button" ?disabled=${this.busy} @click=${this.clearSelection}>Clear</button>
                            <span class="selection">${this.selectedLessonIds.size} selected</span>
                        </div>
                        <div class="lessons">
                            ${e.map(e=>U`
                                <label class="lesson">
                                    <input type="checkbox" .value=${String(e.lessonId)}
                                        .checked=${this.selectedLessonIds.has(Number(e.lessonId))}
                                        ?disabled=${this.busy}
                                        @change=${t=>this.setLessonSelected(e.lessonId,t.currentTarget.checked)}>
                                    <span>#${e.number} ${e.name}</span>
                                </label>
                            `)}
                        </div>
                        <div class="status" ?hidden=${!this.statusVisible}>${this.statusMessage}</div>
                        ${this.renderPlan()}
                        <section class="result" ?hidden=${!this.resultVisible}>
                            <textarea readonly .value=${this.resultReport}></textarea>
                            <div class="result-actions">
                                <button class="copy" type="button" ?disabled=${this.busy}
                                    @click=${()=>this.options?.onCopy?.(this.resultReport)}>Copy report</button>
                                <button class="history" type="button" ?hidden=${!this.executionId}
                                    ?disabled=${this.busy} @click=${this.openHistory}>Open in history</button>
                            </div>
                        </section>
                    </main>
                    <footer>
                        <button class="secondary close" type="button" ?disabled=${this.busy}
                            @click=${()=>this.close()}>Cancel</button>
                        <button class="inspect" type="button" ?hidden=${this.resultVisible} ?disabled=${this.busy}
                            @click=${this.inspect}>${this.plan?`Run preflight again`:`Inspect selected lessons`}</button>
                        <button class="danger execute" type="button" ?hidden=${!t} ?disabled=${this.busy}
                            @click=${this.execute}>Confirm deletion</button>
                    </footer>
                </section>
            </div>
        `}};customElements.get(`edvibe-toolbox-batch-section-deletion-dialog`)||customElements.define(sl,cl);var ll=Object.freeze({BATCH_SECTION_DELETION_DIALOG_TAG:sl,BatchSectionDeletionDialog:cl});globalThis.EdVibeBatchSectionDeletionDialog=ll;var Q=Be(`MAIN`),ul=Q();ul(`Initializing Toolbox modules...`);var $=ot({WebSocketClass:window.WebSocket,cryptoApi:window.crypto,log:Q(`Transport`)});$.install(window);var dl=st(),fl=e=>new Promise(t=>setTimeout(t,e)),pl=e=>t=>{t?dl.activate(e):dl.release(e)},ml=nn({window,cryptoApi:window.crypto}),hl=rn({repository:Ht({indexedDbApi:ct,indexedDB:window.indexedDB}),preferenceStore:qt(ml),downloader:tn({document,URL:window.URL,Blob:window.Blob}),cryptoApi:window.crypto}),gl=mn({service:hl,canStart:dl.canStart,onActiveChange:pl(`history`),createDialog:()=>document.createElement(on),log:Q(`History`)});function _l(e,t=``){window.postMessage(et(e,t),`*`)}var vl=Cr({sendRequest:$.sendRequest,wait:fl,canStart:dl.canStart,onActiveChange:pl(`export`),notifyStatus:_l,log:Q(`Export`),compileToZip:(e,t)=>br(e,{...t,log:Q(`Zip`)})}),yl=Fr({sendRequest:$.sendRequest,sendWithoutResponse:$.sendWithoutResponse,wait:fl,canStart:dl.canStart,onActiveChange:pl(`reset`),log:Q(`Reset`)}),bl=!1,xl=Yr({subscribeFrames:$.subscribeFrames,createPanel(){let e=document.createElement(Zr),t=e.configure.bind(e);return e.configure=(e={})=>t({...e,onClose(){try{e.onClose?.()}finally{bl=!1,dl.release(`recording`)}}}),bl=!0,e},log:Q(`Recorder`)}),Sl=pa({createFeature:Oi,sendRequest:$.sendRequest,getConnectionState:$.getConnectionState,wait:fl,canStart:dl.canStart,onActiveChange:pl(`batch-access`),createDialog:()=>document.createElement(ha),copyText:e=>navigator.clipboard.writeText(e),persistExecution:hl.persistTerminal,openHistory:e=>gl.open({executionId:e}),getLocationHref:()=>window.location.href,getMarathonName:()=>document.querySelector(`h1`)?.textContent?.trim()||document.title||null,log:Q(`BatchAccessHistory`)}),Cl=qa({createDialog:()=>document.createElement(Ya),persistExecution:hl.persistTerminal,openHistory:e=>gl.open({executionId:e}),getLocationHref:()=>window.location.href,getMarathonName:()=>document.querySelector(`h1`)?.textContent?.trim()||document.title||null,log:Q(`BatchUserManagementHistory`)}),wl=Na({sendRequest:$.sendRequest,getConnectionState:$.getConnectionState,wait:fl,canStart:dl.canStart,onActiveChange:pl(`batch-user-management`),createDialog:Cl,log:Q(`BatchUserManagement`)}),Tl=Vo({sendRequest:$.sendRequest,getConnectionState:$.getConnectionState,wait:fl,canStart:dl.canStart,onActiveChange:pl(`batch-user-onboarding`),createDialog:()=>document.createElement(Uo),copyText:e=>navigator.clipboard.writeText(e),persistExecution:hl.persistTerminal,openHistory:e=>gl.open({executionId:e}),getLocationHref:()=>window.location.href,getMarathonName:()=>document.querySelector(`h1`)?.textContent?.trim()||document.title||null,getRequestContext:()=>({host:window.location.hostname}),log:Q(`BatchUserOnboarding`)}),El=qs({createDialog:()=>document.createElement(oc),persistExecution:hl.persistTerminal,openHistory:e=>gl.open({executionId:e}),getLocationHref:()=>window.location.href,getMarathonName:()=>document.querySelector(`h1`)?.textContent?.trim()||document.title||null,log:Q(`BatchSectionCreationHistory`)}),Dl=Cc({recipe:Sc,cryptoApi:window.crypto}),Ol=ps({sendRequest:$.sendRequest,getConnectionState:$.getConnectionState,wait:fl,canStart:dl.canStart,onActiveChange:pl(`batch-section-creation`),adapter:Dl,createDialog:El,copyText:e=>navigator.clipboard.writeText(e),log:Q(`BatchSectionCreation`)}),kl=al({sendRequest:$.sendRequest,getConnectionState:$.getConnectionState,wait:fl,canStart:dl.canStart,onActiveChange:pl(`batch-section-deletion`),createDialog:()=>document.createElement(sl),copyText:e=>navigator.clipboard.writeText(e),persistExecution:hl.persistTerminal,openHistory:e=>gl.open({executionId:e}),log:Q(`BatchSectionDeletion`)});function Al(){if(bl)xl.open();else if(dl.activate(`recording`))try{xl.open()}catch(e){throw dl.release(`recording`),e}else window.alert(`Another Edvibe Toolbox operation is already running.`)}var jl=new Map([[K.START_EXPORT,()=>vl.start()],[K.OPEN_LESSON_RESET,()=>yl.open()],[K.OPEN_BATCH_LESSON_ACCESS,()=>Sl.open()],[K.OPEN_BATCH_USER_ONBOARDING,()=>Tl.open()],[K.OPEN_BATCH_USER_MANAGEMENT,()=>wl.open()],[K.OPEN_BATCH_SECTION_CREATION,()=>Ol.open()],[K.OPEN_BATCH_SECTION_DELETION,()=>kl.open()],[K.OPEN_EXECUTION_HISTORY,e=>gl.open({executionId:e.executionId||null})],[K.OPEN_ACTION_RECORDER,Al]]);window.addEventListener(`message`,e=>{e.source!==window||!$e(e.data)||jl.get(e.data.type)?.(e.data)}),ul(`Toolbox modules ready.`)})();