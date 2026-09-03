(function(){var e={START_EXPORT:`START_FULL_AUTOMATION`,OPEN_LESSON_RESET:`OPEN_LESSON_RESET`,OPEN_ACTION_RECORDER:`OPEN_ACTION_RECORDER`,OPEN_BATCH_LESSON_ACCESS:`OPEN_BATCH_LESSON_ACCESS`,OPEN_BATCH_USER_ONBOARDING:`OPEN_BATCH_USER_ONBOARDING`,OPEN_BATCH_USER_MANAGEMENT:`OPEN_BATCH_USER_MANAGEMENT`,OPEN_BATCH_SECTION_CREATION:`OPEN_BATCH_SECTION_CREATION`,OPEN_BATCH_SECTION_DELETION:`OPEN_BATCH_SECTION_DELETION`,OPEN_VIDEO_ATTACHMENT:`OPEN_VIDEO_ATTACHMENT`,OPEN_EXECUTION_HISTORY:`OPEN_EXECUTION_HISTORY`,OPEN_TELEGRAM_GROUP_BROWSER:`OPEN_TELEGRAM_GROUP_BROWSER`},t={START_EXPORT:`TOOLFOX_START_ALL`,OPEN_LESSON_RESET:`TOOLFOX_OPEN_RESET`,OPEN_ACTION_RECORDER:`TOOLFOX_OPEN_RECORDER`,OPEN_BATCH_LESSON_ACCESS:`TOOLFOX_OPEN_BATCH_LESSON_ACCESS`,OPEN_BATCH_USER_ONBOARDING:`TOOLFOX_OPEN_BATCH_USER_ONBOARDING`,OPEN_BATCH_USER_MANAGEMENT:`TOOLFOX_OPEN_BATCH_USER_MANAGEMENT`,OPEN_BATCH_SECTION_CREATION:`TOOLFOX_OPEN_BATCH_SECTION_CREATION`,OPEN_BATCH_SECTION_DELETION:`TOOLFOX_OPEN_BATCH_SECTION_DELETION`,OPEN_VIDEO_ATTACHMENT:`TOOLFOX_OPEN_VIDEO_ATTACHMENT`,OPEN_EXECUTION_HISTORY:`TOOLFOX_OPEN_EXECUTION_HISTORY`,OPEN_TELEGRAM_GROUP_BROWSER:`TOOLFOX_OPEN_TELEGRAM_GROUP_BROWSER`,EXPORT_STATUS:`TOOLFOX_EXPORT_STATUS`,STORAGE_REQUEST:`TOOLFOX_STORAGE_REQUEST`,STORAGE_RESPONSE:`TOOLFOX_STORAGE_RESPONSE`},n={STARTED:`started`,COMPLETE:`complete`,ERROR:`error`},r={GET:`get`,SET:`set`},i={EXECUTION_HISTORY_PREFERENCES:`executionHistoryPreferences`},a={[e.START_EXPORT]:{type:t.START_EXPORT,info:`Automation sequence channeled to page engine.`},[e.OPEN_LESSON_RESET]:{type:t.OPEN_LESSON_RESET,info:`Lesson reset workflow opened.`},[e.OPEN_ACTION_RECORDER]:{type:t.OPEN_ACTION_RECORDER,info:`Action recorder opened.`},[e.OPEN_BATCH_LESSON_ACCESS]:{type:t.OPEN_BATCH_LESSON_ACCESS,info:`Batch lesson access opened.`},[e.OPEN_BATCH_USER_ONBOARDING]:{type:t.OPEN_BATCH_USER_ONBOARDING,info:`Batch user onboarding opened.`},[e.OPEN_BATCH_USER_MANAGEMENT]:{type:t.OPEN_BATCH_USER_MANAGEMENT,info:`Batch user management opened.`},[e.OPEN_BATCH_SECTION_CREATION]:{type:t.OPEN_BATCH_SECTION_CREATION,info:`Batch section creation opened.`},[e.OPEN_BATCH_SECTION_DELETION]:{type:t.OPEN_BATCH_SECTION_DELETION,info:`Batch section deletion opened.`},[e.OPEN_VIDEO_ATTACHMENT]:{type:t.OPEN_VIDEO_ATTACHMENT,info:`YouTube video attachment opened.`},[e.OPEN_EXECUTION_HISTORY]:{type:t.OPEN_EXECUTION_HISTORY,info:`Execution history opened.`},[e.OPEN_TELEGRAM_GROUP_BROWSER]:{type:t.OPEN_TELEGRAM_GROUP_BROWSER,info:`Telegram owned-group browser opened.`}},o=new Set(Object.values(a).map(({type:e})=>e));new Set(Object.values(n)),new Set(Object.values(r)),new Set(Object.values(i));function s(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function c(e,t){return Object.keys(e).every(e=>t.has(e))}function l(e){return typeof e==`string`&&e.length>0}function u(e){return!s(e)||typeof e.type!=`string`||!o.has(e.type)?!1:e.type===t.OPEN_EXECUTION_HISTORY?c(e,new Set([`type`,`executionId`]))&&(e.executionId===void 0||e.executionId===null||l(e.executionId)):c(e,new Set([`type`]))}var d=class{constructor({context:e,features:t=[]}={}){if(!e||typeof e!=`object`)throw TypeError(`context is required`);if(typeof e.logger?.createChildLogger!=`function`)throw TypeError(`context must provide a logger`);if(typeof e.registerDispatch!=`function`)throw TypeError(`context must provide dispatch registration`);if(!Array.isArray(t))throw TypeError(`features must be an array`);this.features=new Map,this.context=e,this.logger=e.logger.createChildLogger(`FeatureDispatcher`),this.register=this.register.bind(this),this.dispatch=this.dispatch.bind(this),e.registerDispatch(this.dispatch),t.forEach(this.register)}register({type:e,create:t}){if(typeof e!=`string`||typeof t!=`function`)throw TypeError(`Feature definition must provide a type and create function`);if(this.features.has(e))throw TypeError(`Feature "${e}" is already registered`);let n=t(this.context);if(typeof n!=`function`)throw TypeError(`Feature "${e}" must create a command handler`);this.features.set(e,n)}dispatch(e){if(!u(e))return!1;let t=this.features.get(e.type);if(!t)return!1;try{Promise.resolve(t(e)).catch(t=>{this.logger.log(`Feature "${e.type}" failed:`,t)})}catch(t){this.logger.log(`Feature "${e.type}" failed:`,t)}return!0}},f=globalThis,p=f.ShadowRoot&&(f.ShadyCSS===void 0||f.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,m=Symbol(),ee=new WeakMap,te=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==m)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(p&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=ee.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&ee.set(t,e))}return e}toString(){return this.cssText}},ne=e=>new te(typeof e==`string`?e:e+``,void 0,m),h=(e,...t)=>new te(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,m),re=(e,t)=>{if(p)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let n of t){let t=document.createElement(`style`),r=f.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},g=p?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return ne(t)})(e):e,{is:ie,defineProperty:ae,getOwnPropertyDescriptor:oe,getOwnPropertyNames:se,getOwnPropertySymbols:ce,getPrototypeOf:le}=Object,_=globalThis,ue=_.trustedTypes,de=ue?ue.emptyScript:``,fe=_.reactiveElementPolyfillSupport,v=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?de:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},pe=(e,t)=>!ie(e,t),me={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:pe};Symbol.metadata??=Symbol(`metadata`),_.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=me){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&ae(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=oe(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??me}static _$Ei(){if(this.hasOwnProperty(v(`elementProperties`)))return;let e=le(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v(`properties`))){let e=this.properties,t=[...se(e),...ce(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(g(e))}else e!==void 0&&t.push(g(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return re(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?y:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?y:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??pe)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};b.elementStyles=[],b.shadowRootOptions={mode:`open`},b[v(`elementProperties`)]=new Map,b[v(`finalized`)]=new Map,fe?.({ReactiveElement:b}),(_.reactiveElementVersions??=[]).push(`2.1.2`);var x=globalThis,he=e=>e,S=x.trustedTypes,C=S?S.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,w=`$lit$`,T=`lit$${Math.random().toFixed(9).slice(2)}$`,E=`?`+T,ge=`<${E}>`,D=document,O=()=>D.createComment(``),k=e=>e===null||typeof e!=`object`&&typeof e!=`function`,A=Array.isArray,_e=e=>A(e)||typeof e?.[Symbol.iterator]==`function`,j=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ve=/-->/g,ye=/>/g,N=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),be=/'/g,xe=/"/g,P=/^(?:script|style|textarea|title)$/i,F=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),I=Symbol.for(`lit-noChange`),L=Symbol.for(`lit-nothing`),R=new WeakMap,z=D.createTreeWalker(D,129);function B(e,t){if(!A(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return C===void 0?t:C.createHTML(t)}var Se=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=M;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===M?c[1]===`!--`?o=ve:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=N):(P.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=N):o=ye:o===N?c[0]===`>`?(o=i??M,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?N:c[3]===`"`?xe:be):o===xe||o===be?o=N:o===ve||o===ye?o=M:(o=N,i=void 0);let d=o===N&&e[t+1].startsWith(`/>`)?` `:``;a+=o===M?n+ge:l>=0?(r.push(s),n.slice(0,l)+w+n.slice(l)+T+d):n+T+(l===-2?t:d)}return[B(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},V=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Se(t,n);if(this.el=e.createElement(l,r),z.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=z.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(w)){let t=u[o++],n=i.getAttribute(e).split(T),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?we:r[1]===`?`?Te:r[1]===`@`?Ee:W}),i.removeAttribute(e)}else e.startsWith(T)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(P.test(i.tagName)){let e=i.textContent.split(T),t=e.length-1;if(t>0){i.textContent=S?S.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],O()),z.nextNode(),c.push({type:2,index:++a});i.append(e[t],O())}}}else if(i.nodeType===8){if(i.data===E)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(T,e+1))!==-1;)c.push({type:7,index:a}),e+=T.length-1}}a++}}static createElement(e,t){let n=D.createElement(`template`);return n.innerHTML=e,n}};function H(e,t,n=e,r){if(t===I)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=k(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=H(e,i._$AS(e,t.values),i,r)),t}var Ce=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??D).importNode(t,!0);z.currentNode=r;let i=z.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new U(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new De(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=z.nextNode(),a++)}return z.currentNode=D,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},U=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=H(this,e,t),k(e)?e===L||e==null||e===``?(this._$AH!==L&&this._$AR(),this._$AH=L):e!==this._$AH&&e!==I&&this._(e):e._$litType$===void 0?e.nodeType===void 0?_e(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==L&&k(this._$AH)?this._$AA.nextSibling.data=e:this.T(D.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=V.createElement(B(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Ce(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=R.get(e.strings);return t===void 0&&R.set(e.strings,t=new V(e)),t}k(t){A(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(O()),this.O(O()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=he(e).nextSibling;he(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},W=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=L,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=L}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=H(this,e,t,0),a=!k(e)||e!==this._$AH&&e!==I,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=H(this,r[n+o],t,o),s===I&&(s=this._$AH[o]),a||=!k(s)||s!==this._$AH[o],s===L?e=L:e!==L&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},we=class extends W{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===L?void 0:e}},Te=class extends W{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==L)}},Ee=class extends W{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=H(this,e,t,0)??L)===I)return;let n=this._$AH,r=e===L&&n!==L||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==L&&(n===L||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},De=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){H(this,e)}},Oe=x.litHtmlPolyfillSupport;Oe?.(V,U),(x.litHtmlVersions??=[]).push(`3.3.3`);var ke=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new U(t.insertBefore(O(),e),e,void 0,n??{})}return i._$AI(e),i},G=globalThis,K=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ke(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}};K._$litElement$=!0,K.finalized=!0,G.litElementHydrateSupport?.({LitElement:K});var Ae=G.litElementPolyfillSupport;Ae?.({LitElement:K}),(G.litElementVersions??=[]).push(`4.2.2`);var je=h`
    .dialog {
        width: min(720px, calc(100vw - 32px));
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
    }

    .dialog-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        padding: 20px 22px 16px;
        border-bottom: 1px solid var(--toolfox-border-subtle);
    }

    .dialog-header h2,
    .dialog-header p {
        margin: 0;
    }

    .eyebrow {
        margin-bottom: 4px !important;
        color: var(--toolfox-primary);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
    }

    .header-copy {
        margin-top: 6px !important;
        color: var(--toolfox-text-muted);
        font-size: 13px;
        line-height: 1.45;
    }

    .icon-button {
        width: 36px;
        min-width: 36px;
        padding: 0;
        font-size: 22px;
        line-height: 1;
    }

    .content {
        min-height: 220px;
        max-height: min(620px, calc(100vh - 150px));
        overflow: auto;
        padding: 18px 22px 22px;
    }

    .state-card {
        display: grid;
        place-items: center;
        gap: 10px;
        min-height: 180px;
        padding: 26px;
        border: 1px dashed var(--toolfox-border);
        border-radius: var(--toolfox-radius-panel);
        color: var(--toolfox-text-muted);
        text-align: center;
    }

    .state-card h3,
    .state-card p {
        margin: 0;
    }

    .state-card.is-error {
        border-color: var(--toolfox-danger-border);
        color: var(--toolfox-danger);
        background: var(--toolfox-danger-surface);
    }

    .filter-empty-state {
        min-height: 140px;
    }

    .toolbar {
        display: grid;
        gap: 8px;
        margin-bottom: 12px;
    }

    .group-list {
        display: grid;
        gap: 10px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .group-card {
        display: grid;
        gap: 9px;
        padding: 14px 16px;
        border: 1px solid var(--toolfox-border-subtle);
        border-radius: var(--toolfox-radius-panel);
        background: var(--toolfox-surface-subtle);
    }

    .group-heading {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
    }

    .group-heading strong {
        min-width: 0;
        overflow-wrap: anywhere;
        font-size: 14px;
    }

    .kind {
        flex: 0 0 auto;
        color: var(--toolfox-text-muted);
        font-size: 11px;
        font-weight: 700;
    }

    .metadata {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 14px;
        color: var(--toolfox-text-muted);
        font-size: 12px;
    }

    .summary {
        margin: 0;
        color: var(--toolfox-text-muted);
        font-size: 12px;
    }

    @media (max-width: 640px) {
        .dialog {
            width: 100vw;
            height: 100vh;
        }

        .content {
            max-height: none;
        }
    }
`,Me=`supported`,Ne=new Set([`group`,`supergroup`]);function Pe(e){if(!e)return null;let t=Date.parse(e);return Number.isFinite(t)?t:null}function Fe(e){return!e||!e.isActive||!e.isCreator||e.canSendText===!1||!Ne.has(e.groupType)||!Number.isFinite(Number(e.peerId))?null:Object.freeze({canSendText:typeof e.canSendText==`boolean`?e.canSendText:null,isCreator:!0,kind:e.groupType,lastActivityAt:e.lastActivityAt||null,peerId:Number(e.peerId),title:String(e.title||``).trim()||`Без названия`})}function Ie(e,t){let n=Pe(e?.lastActivityAt),r=Pe(t?.lastActivityAt);if(n!==r)return n===null?1:r===null?-1:r-n;let i=String(e?.title||``).toLowerCase(),a=String(t?.title||``).toLowerCase();return i===a?Number(e?.peerId)-Number(t?.peerId):i<a?-1:1}function Le(e){return Object.freeze(Array.from(e||[]).sort(Ie))}function Re(e,t=``){let n=Array.from(e||[]),r=String(t||``).trim().toLowerCase();return Object.freeze(r?n.filter(e=>String(e?.title||``).toLowerCase().includes(r)):n)}function ze(e,t=``){let n=Array.from(e||[]);if(n.length===0)return Object.freeze({groups:Object.freeze([]),state:`empty`});let r=Re(n,t);return Object.freeze({groups:r,state:r.length===0?`filtered-empty`:`ready`})}function Be(e){return Object.freeze({groups:Object.freeze([]),reason:e?.reason||`unsupported-runtime`,state:`unsupported`})}async function Ve(e,{pageSize:t=100}={}){if(!e||typeof e.getCompatibility!=`function`)throw TypeError(`Telegram adapter is required.`);let n=e.getCompatibility();if(n?.state!==Me)return Be(n);let r=new Map,i=new Set,a=0;for(;a!==null;){if(i.has(a))throw Error(`Telegram dialog pagination repeated an offset.`);i.add(a);let n=await e.listDialogs({limit:t,offset:a});for(let t of n.items||[]){if(!Number.isFinite(Number(t.peerId))||Number(t.peerId)>=0)continue;let n=Fe(await e.resolveGroupCandidate(t));n&&r.set(n.peerId,n)}a=n.nextOffset}let o=Le(r.values());return Object.freeze({groups:o,reason:null,state:o.length===0?`empty`:`ready`})}var He=Object.freeze({"--toolfox-font-family":`"Segoe UI", Inter, Arial, system-ui, sans-serif`,"--toolfox-z-dialog":`2147483647`,"--toolfox-overlay":`rgba(15, 23, 42, 0.6)`,"--toolfox-surface":`#fff`,"--toolfox-surface-subtle":`#f8fafc`,"--toolfox-surface-app":`#f4f6fa`,"--toolfox-text":`#1f2937`,"--toolfox-text-strong":`#111827`,"--toolfox-text-muted":`#6b7280`,"--toolfox-border":`#d1d5db`,"--toolfox-border-subtle":`#e5e7eb`,"--toolfox-primary":`#2563eb`,"--toolfox-brand":`#4055d3`,"--toolfox-danger":`#b91c1c`,"--toolfox-danger-surface":`#fef2f2`,"--toolfox-danger-border":`#fecaca`,"--toolfox-warning":`#9a3412`,"--toolfox-warning-surface":`#fff7ed`,"--toolfox-warning-border":`#fed7aa`,"--toolfox-success":`#166534`,"--toolfox-success-surface":`#f0fdf4`,"--toolfox-success-border":`#bbf7d0`,"--toolfox-info":`#1e3a8a`,"--toolfox-info-surface":`#eff6ff`,"--toolfox-info-border":`#bfdbfe`,"--toolfox-focus-outline":`#2563eb`,"--toolfox-focus-halo":`rgba(37, 99, 235, 0.25)`,"--toolfox-radius-control":`8px`,"--toolfox-radius-panel":`10px`,"--toolfox-radius-dialog":`16px`,"--toolfox-radius-pill":`999px`,"--toolfox-shadow-card":`0 2px 7px rgba(30, 42, 70, 0.04)`,"--toolfox-shadow-dialog":`0 24px 80px rgba(15, 23, 42, 0.38)`});function Ue(e=He){return Object.entries(e).map(([e,t])=>`${e}: ${t};`).join(`
`)}var We=h`
    :host {
        ${ne(Ue())}
        --toolfox-dialog-z-index: var(--toolfox-z-dialog);
        --toolfox-overlay-background: var(--toolfox-overlay);
        --toolfox-muted-text: var(--toolfox-text-muted);
        --toolfox-radius: var(--toolfox-radius-dialog);
    }

    button,
    input,
    textarea,
    select {
        font: inherit;
    }
`,Ge=h`
    :host {
        font-family: var(--toolfox-font-family);
    }
`,Ke=h`
    [data-part="overlay"] {
        position: fixed;
        inset: 0;
        z-index: var(--toolfox-z-dialog);
        display: grid;
        place-items: center;
        padding: 16px;
        background: var(--toolfox-overlay);
        box-sizing: border-box;
    }

    [data-part="overlay"] *,
    [data-part="overlay"] *::before,
    [data-part="overlay"] *::after {
        box-sizing: border-box;
    }

    [data-part="dialog"] {
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 32px);
        overflow: hidden;
        border: 1px solid var(--toolfox-border-subtle);
        border-radius: var(--toolfox-radius-dialog);
        color: var(--toolfox-text);
        background: var(--toolfox-surface);
        box-shadow: var(--toolfox-shadow-dialog);
    }

    @media (max-width: 640px) {
        [data-part="overlay"] { padding: 0; }
        [data-part="dialog"] {
            max-width: 100vw;
            max-height: 100vh;
            border-radius: 0;
        }
    }
`,qe=h`
    [data-control] {
        min-height: 36px;
        padding: 8px 12px;
        border: 1px solid var(--toolfox-primary);
        border-radius: var(--toolfox-radius-control);
        color: var(--toolfox-surface);
        background: var(--toolfox-primary);
        cursor: pointer;
        font: inherit;
        font-weight: 700;
    }

    [data-control="secondary"] {
        border-color: var(--toolfox-border);
        color: var(--toolfox-text);
        background: var(--toolfox-surface);
    }

    [data-control="danger"] {
        border-color: var(--toolfox-danger-border);
        color: var(--toolfox-danger);
        background: var(--toolfox-surface);
    }

    [data-control]:focus-visible,
    [data-field] :is(input, textarea, select):focus-visible {
        outline: 2px solid var(--toolfox-focus-outline);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px var(--toolfox-focus-halo);
    }

    [data-control]:disabled,
    [data-field] :is(input, textarea, select):disabled {
        color: var(--toolfox-text-muted);
        background: var(--toolfox-surface-subtle);
        cursor: default;
        opacity: .72;
    }

    [data-part="actions"] {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
    }
`,Je=h`
    [data-field] {
        display: grid;
        gap: 4px;
        color: var(--toolfox-text);
        font-size: 13px;
        font-weight: 650;
    }

    [data-field] :is(input, textarea, select) {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        padding: 9px 10px;
        border: 1px solid var(--toolfox-border);
        border-radius: var(--toolfox-radius-control);
        color: var(--toolfox-text);
        background: var(--toolfox-surface);
        font: inherit;
    }

    [data-part="help"] {
        color: var(--toolfox-text-muted);
        font-size: 11px;
        line-height: 1.4;
    }
`;h`
    [data-notice] {
        padding: 10px 12px;
        border: 1px solid var(--toolfox-info-border);
        border-radius: var(--toolfox-radius-control);
        color: var(--toolfox-info);
        background: var(--toolfox-info-surface);
        font-size: 12px;
        line-height: 1.45;
    }

    [data-notice="success"] {
        border-color: var(--toolfox-success-border);
        color: var(--toolfox-success);
        background: var(--toolfox-success-surface);
    }

    [data-notice="warning"] {
        border-color: var(--toolfox-warning-border);
        color: var(--toolfox-warning);
        background: var(--toolfox-warning-surface);
    }

    [data-notice="danger"] {
        border-color: var(--toolfox-danger-border);
        color: var(--toolfox-danger);
        background: var(--toolfox-danger-surface);
    }
`,h`
    [data-part="progress"] {
        accent-color: var(--toolfox-primary);
    }

    [data-part="status"] {
        color: var(--toolfox-text-muted);
        font-size: 12px;
    }
`,h`
    [data-part="empty-state"] {
        padding: 24px;
        border: 1px dashed var(--toolfox-border);
        border-radius: var(--toolfox-radius-panel);
        color: var(--toolfox-text-muted);
        text-align: center;
    }
`;var Ye=`toolfox-telegram-owned-groups-dialog`;function Xe(e){if(!e)return`нет данных`;let t=new Date(e);return Number.isNaN(t.getTime())?`нет данных`:new Intl.DateTimeFormat(void 0,{dateStyle:`medium`,timeStyle:`short`}).format(t)}function Ze(e){return e===`supergroup`?`Супергруппа`:`Группа`}function Qe(e){return e===!0?`Можно отправлять сообщения`:e===!1?`Отправка сообщений недоступна`:`Возможность отправки неизвестна`}var $e=class extends K{static styles=[We,Ge,Ke,qe,Je,je];static properties={options:{state:!0},groups:{state:!0},viewState:{state:!0},message:{state:!0},filterQuery:{state:!0}};constructor(){super(),this.options=null,this.groups=[],this.viewState=`loading`,this.message=`Загружаем группы текущего аккаунта…`,this.filterQuery=``,this.loadPromise=null,this.handleKeydownBound=e=>{e.key===`Escape`&&this.close()}}configure(e={}){return this.options=e&&typeof e==`object`?e:{},this.isConnected&&this.load(),this}connectedCallback(){super.connectedCallback(),this.ownerDocument?.addEventListener(`keydown`,this.handleKeydownBound),this.load()}disconnectedCallback(){this.ownerDocument?.removeEventListener(`keydown`,this.handleKeydownBound),super.disconnectedCallback()}async load(){if(!this.options?.onLoad||this.loadPromise)return this.loadPromise;this.viewState=`loading`,this.groups=[],this.message=`Загружаем группы текущего аккаунта…`,this.loadPromise=(async()=>{try{let e=await this.options.onLoad();this.groups=[...e?.groups||[]],this.viewState=e?.state||(this.groups.length>0?`ready`:`empty`),this.message=this.viewState===`unsupported`?`Текущая версия Telegram Web K не предоставляет ожидаемый runtime-интерфейс.`:this.viewState===`empty`?`У текущего аккаунта не найдено созданных им активных групп.`:``}catch(e){this.groups=[],this.viewState=`error`,this.message=e instanceof Error?e.message:`Не удалось загрузить группы Telegram.`}finally{this.loadPromise=null}})(),await this.loadPromise,await this.updateComplete,this.shadowRoot?.querySelector(`[data-action="close"]`)?.focus()}retry(){this.load()}close(){this.options?.onClose?.()}handleFilterInput(e){this.filterQuery=e.currentTarget?.value||``}renderState(){let e=this.viewState===`error`,t=e||this.viewState===`unsupported`,n=this.viewState===`loading`?`Загрузка…`:this.viewState===`empty`?`Групп пока нет`:e?`Не удалось загрузить группы`:`Telegram Web K несовместим`;return F`
            <div class="state-card ${e?`is-error`:``}" data-part="empty-state" aria-live="polite">
                <h3>${n}</h3>
                <p>${this.message}</p>
                ${t?F`
                    <button type="button" data-control @click=${this.retry}>Повторить</button>
                `:L}
            </div>
        `}renderFilterEmptyState(){return F`
            <div class="state-card filter-empty-state" data-part="filter-empty-state" aria-live="polite">
                <h3>Ничего не найдено</h3>
                <p>Измените фильтр, чтобы снова увидеть подходящие группы.</p>
            </div>
        `}renderGroup(e){return F`
            <li class="group-card" data-peer-id=${String(e.peerId)}>
                <div class="group-heading">
                    <strong>${e.title}</strong>
                    <span class="kind">${Ze(e.kind)}</span>
                </div>
                <div class="metadata">
                    <span>Последняя активность: ${Xe(e.lastActivityAt)}</span>
                    <span>${Qe(e.canSendText)}</span>
                </div>
            </li>
        `}renderReady(){let e=ze(this.groups,this.filterQuery),t=this.filterQuery.trim()===``?`Найдено групп: ${this.groups.length}`:`Показано: ${e.groups.length} из ${this.groups.length}`;return F`
            <div class="toolbar">
                <label data-field>
                    <span>Фильтр по названию</span>
                    <input
                        type="search"
                        placeholder="Начните вводить название…"
                        .value=${this.filterQuery}
                        @input=${this.handleFilterInput}
                    >
                </label>
                <p class="summary" aria-live="polite">${t}</p>
            </div>
            ${e.state===`filtered-empty`?this.renderFilterEmptyState():F`
                <ul class="group-list">
                    ${e.groups.map(e=>this.renderGroup(e))}
                </ul>
            `}
        `}render(){let e=this.viewState===`ready`;return F`
            <div class="overlay" data-part="overlay">
                <section class="dialog" data-part="dialog" role="dialog" aria-modal="true" aria-labelledby="telegram-groups-title">
                    <header class="dialog-header">
                        <div>
                            <p class="eyebrow">Toolfox · Telegram</p>
                            <h2 id="telegram-groups-title">Мои группы</h2>
                            <p class="header-copy">Только активные группы, создателем которых является текущий Telegram-аккаунт.</p>
                        </div>
                        <button class="icon-button" data-control="secondary" type="button" data-action="close" aria-label="Закрыть" @click=${this.close}>×</button>
                    </header>
                    <div class="content">
                        ${e?this.renderReady():this.renderState()}
                    </div>
                </section>
            </div>
        `}};customElements.define(Ye,$e);function et({adapter:e,documentApi:t=globalThis.document,logger:n={log(){}}}){if(!e)throw TypeError(`Telegram adapter is required.`);if(!t?.createElement)throw TypeError(`Document API is required.`);let r=null;function i(){r?.remove(),r=null}function a(){return r?.isConnected?(r.load?.(),r):(r=t.createElement(Ye),r.configure({onClose:i,onLoad:()=>Ve(e)}),(t.body||t.documentElement).append(r),n.log(`Telegram owned-group browser opened.`),r)}return Object.freeze({close:i,open:a})}var tt=Object.freeze({type:t.OPEN_TELEGRAM_GROUP_BROWSER,create(e){let t=et({adapter:e.telegramWeb,logger:e.logger.createChildLogger(`TelegramOwnedGroups`)});return()=>t.open()}}),q=Object.freeze({EDVIBE:`edvibe`,TELEGRAM_WEB_K:`telegram-web-k`,UNSUPPORTED:`unsupported`});function nt(e){return String(e||``).toLowerCase().replace(/\.$/,``)}function rt(e=globalThis.location){let t=nt(e?.hostname),n=String(e?.pathname||`/`);return t===`edvibe.com`||t.endsWith(`.edvibe.com`)?q.EDVIBE:t===`web.telegram.org`&&(n===`/k`||n.startsWith(`/k/`))?q.TELEGRAM_WEB_K:q.UNSUPPORTED}var J=Object.freeze({SUPPORTED:`supported`,UNSUPPORTED:`unsupported`}),it=Object.freeze({MANAGER_FACTORY_UNAVAILABLE:`manager-factory-unavailable`,MANAGER_FACADE_UNAVAILABLE:`manager-facade-unavailable`}),Y=class extends Error{constructor(e,{code:t,cause:n,compatibility:r,operation:i}={}){super(e,{cause:n}),this.name=`TelegramWebKRuntimeError`,this.code=t,this.compatibility=r,this.operation=i}};function X(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function Z(e){if(e==null||e===``)return null;let t=Number(e);return Number.isFinite(t)?t:null}function at(e){let t=Number.parseInt(String(e||`1`),10);return t>=1&&t<=4?t:1}function ot(e=globalThis.location){try{return at(new URL(e?.href||`https://web.telegram.org/k/`).searchParams.get(`account`))}catch{return 1}}function st(e,t){return Object.freeze({accountNumber:t,reason:e,state:J.UNSUPPORTED})}function ct(e){return Object.freeze({accountNumber:e,reason:null,state:J.SUPPORTED})}function lt({globalObject:e=globalThis,location:t=globalThis.location}={}){let n=ot(t);return typeof e?.createProxiedManagersForAccount==`function`?ct(n):st(it.MANAGER_FACTORY_UNAVAILABLE,n)}function ut(e){if(!X(e))return null;let t=Z(e.peerId);if(t===null)return null;let n=Z(e.top_message);return Object.freeze({peerId:t,topMessageId:n})}function dt(e){return e?._===`chat`?`group`:e?._===`channel`&&e.pFlags?.megagroup?`supergroup`:e?._===`channel`?`channel`:e?._===`user`?`user`:`unknown`}function ft(e,t){if(t!==`group`&&t!==`supergroup`)return!1;let n=e?.pFlags||{};return n.left||n.deactivated?!1:!(t===`group`&&e?.migrated_to)}function pt(e,t){if(!X(t))return Object.freeze({isActive:!1,isBroadcast:!1,isCreator:!1,isGroup:!1,peerId:e,title:``,type:`unknown`});let n=dt(t);return Object.freeze({isActive:ft(t,n),isBroadcast:n===`channel`&&!!t.pFlags?.broadcast,isCreator:!!t.pFlags?.creator,isGroup:n===`group`||n===`supergroup`,peerId:e,title:typeof t.title==`string`?t.title:``,type:n})}function mt({canSendText:e=null,dialog:t,lastActivityAt:n=null,peer:r}){return!r?.isGroup||!t?null:Object.freeze({canSendText:typeof e==`boolean`?e:null,groupType:r.type,isActive:!!r.isActive,isCreator:r.isCreator,lastActivityAt:n,peerId:r.peerId,title:r.title})}function ht(e){let t=Z(e?.date);return t===null||t<0?null:new Date(t*1e3).toISOString()}function Q(e,t){return new Y(`Telegram Web K operation "${e}" failed.`,{cause:t,code:`TELEGRAM_WEB_K_RUNTIME_CALL_FAILED`,operation:e})}var gt=class{constructor({globalObject:e=globalThis,location:t=globalThis.location}={}){this.globalObject=e,this.location=t,this.cachedManagers=null,this.cachedAccountNumber=null,this.cachedManagerFactory=null}getCompatibility(){return lt({globalObject:this.globalObject,location:this.location})}getManagers(){let e=this.getCompatibility();if(e.state!==J.SUPPORTED)throw new Y(`Telegram Web K runtime adapter is unavailable.`,{code:`TELEGRAM_WEB_K_UNSUPPORTED_RUNTIME`,compatibility:e,operation:`resolve-runtime`});let t=this.globalObject.createProxiedManagersForAccount;if(this.cachedManagers&&this.cachedAccountNumber===e.accountNumber&&this.cachedManagerFactory===t)return this.cachedManagers;let n;try{n=t(e.accountNumber)}catch(e){throw Q(`resolve-runtime`,e)}if(!n||typeof n!=`object`&&typeof n!=`function`)throw new Y(`Telegram Web K manager facade is unavailable.`,{code:`TELEGRAM_WEB_K_UNSUPPORTED_RUNTIME`,compatibility:st(it.MANAGER_FACADE_UNAVAILABLE,e.accountNumber),operation:`resolve-runtime`});return this.cachedManagers=n,this.cachedAccountNumber=e.accountNumber,this.cachedManagerFactory=t,n}async listDialogs({limit:e=50,offset:t=0}={}){let n=Math.max(1,Math.trunc(e)),r=Math.max(0,Math.trunc(t));try{let e=await this.getManagers().dialogsStorage.getDialogs({limit:n,offsetIndex:r});if(!X(e)||!Array.isArray(e.dialogs))throw TypeError(`Unexpected Telegram dialog page shape.`);let t=e.dialogs.length,i=e.dialogs.map(ut).filter(Boolean),a=Z(e.count),o=t===0||a!==null&&r+t>=a?null:r+t;return Object.freeze({count:a,items:Object.freeze(i),nextOffset:o})}catch(e){throw e instanceof Y?e:Q(`list-dialogs`,e)}}async resolvePeer(e){let t=Z(e);if(t===null)throw TypeError(`peerId must be a finite number`);try{return pt(t,await this.getManagers().appPeersManager.getPeer(t))}catch(e){throw e instanceof Y?e:Q(`resolve-peer`,e)}}async getLastActivity({peerId:e,topMessageId:t}){if(t==null)return null;try{return ht(await this.getManagers().appMessagesManager.getMessageByPeer(e,t))}catch(e){throw e instanceof Y?e:Q(`get-last-activity`,e)}}async canSendText(e){let t=Z(e);if(t===null||t>=0)return!1;try{return!!await this.getManagers().appChatsManager.hasRights(Math.abs(t),`send_plain`)}catch(e){throw e instanceof Y?e:Q(`check-send-text`,e)}}async resolveGroupCandidate(e){let t=await this.resolvePeer(e.peerId);if(!t.isGroup)return null;if(!t.isActive||!t.isCreator)return mt({dialog:e,peer:t});let[n,r]=await Promise.all([this.getLastActivity(e),this.canSendText(e.peerId)]);return mt({canSendText:r,dialog:e,lastActivityAt:n,peer:t})}async sendText(e,t){let n=Z(e);if(n===null)throw TypeError(`peerId must be a finite number`);if(typeof t!=`string`||t.trim()===``)throw TypeError(`text must be a non-empty string`);try{return await this.getManagers().appMessagesManager.sendText({peerId:n,text:t}),Object.freeze({ok:!0})}catch(e){throw e instanceof Y?e:Q(`send-text`,e)}}async probe(){let e=this.getCompatibility();if(e.state!==J.SUPPORTED)return e;try{let t=await this.listDialogs({limit:1,offset:0});if(t.items.length>0){let e=t.items[0];await this.resolvePeer(e.peerId),await this.getLastActivity(e)}return Object.freeze({...e,capabilities:Object.freeze({dialogDiscovery:!0,lastActivity:!0,peerResolution:!0}),requiresLiveValidation:Object.freeze([`sendText`])})}catch(t){return Object.freeze({accountNumber:e.accountNumber,reason:`runtime-contract-rejected`,state:J.UNSUPPORTED,errorCode:t?.code||`TELEGRAM_WEB_K_RUNTIME_CALL_FAILED`})}}};function _t(e){return new gt(e)}var vt=class{constructor({globalObject:e=globalThis,location:t=globalThis.location,logger:n}){this.logger=n,this.telegramWeb=_t({globalObject:e,location:t}),this.dispatch=null,this.registerDispatch=this.registerDispatch.bind(this)}registerDispatch(e){if(typeof e!=`function`)throw TypeError(`dispatch must be a function`);if(this.dispatch!==null)throw Error(`dispatch is already registered`);this.dispatch=e}},yt=class e{constructor({namespace:e,namespaces:t=null}){this.namespaces=t??[bt(e)],this.log=this.log.bind(this),this.createChildLogger=this.createChildLogger.bind(this)}log(...e){console.log(this.namespaces.map(e=>`[${e}]`).join(``),...e)}createChildLogger(t){return new e({namespaces:[...this.namespaces,bt(t)]})}};function bt(e){if(typeof e!=`string`||!e.trim())throw Error(`Namespace must be a non-empty string.`);return e}var $=new yt({namespace:`MAIN:TELEGRAM_WEB_K`});if(rt(window.location)===q.TELEGRAM_WEB_K){let e=new d({context:new vt({globalObject:window,location:window.location,logger:$}),features:[tt]});window.addEventListener(`message`,({source:t,data:n})=>{t===window&&e.dispatch(n)}),$.log(`Toolfox Telegram Web K runtime ready.`)}else $.log(`Telegram Web K MAIN entry loaded on an unsupported page.`)})();