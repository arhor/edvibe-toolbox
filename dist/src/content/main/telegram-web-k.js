(function(){var e={START_EXPORT:`START_FULL_AUTOMATION`,OPEN_LESSON_RESET:`OPEN_LESSON_RESET`,OPEN_ACTION_RECORDER:`OPEN_ACTION_RECORDER`,OPEN_BATCH_LESSON_ACCESS:`OPEN_BATCH_LESSON_ACCESS`,OPEN_BATCH_USER_ONBOARDING:`OPEN_BATCH_USER_ONBOARDING`,OPEN_BATCH_USER_MANAGEMENT:`OPEN_BATCH_USER_MANAGEMENT`,OPEN_BATCH_SECTION_CREATION:`OPEN_BATCH_SECTION_CREATION`,OPEN_BATCH_SECTION_DELETION:`OPEN_BATCH_SECTION_DELETION`,OPEN_VIDEO_ATTACHMENT:`OPEN_VIDEO_ATTACHMENT`,OPEN_EXECUTION_HISTORY:`OPEN_EXECUTION_HISTORY`,OPEN_TELEGRAM_GROUP_BROWSER:`OPEN_TELEGRAM_GROUP_BROWSER`},t={START_EXPORT:`TOOLFOX_START_ALL`,OPEN_LESSON_RESET:`TOOLFOX_OPEN_RESET`,OPEN_ACTION_RECORDER:`TOOLFOX_OPEN_RECORDER`,OPEN_BATCH_LESSON_ACCESS:`TOOLFOX_OPEN_BATCH_LESSON_ACCESS`,OPEN_BATCH_USER_ONBOARDING:`TOOLFOX_OPEN_BATCH_USER_ONBOARDING`,OPEN_BATCH_USER_MANAGEMENT:`TOOLFOX_OPEN_BATCH_USER_MANAGEMENT`,OPEN_BATCH_SECTION_CREATION:`TOOLFOX_OPEN_BATCH_SECTION_CREATION`,OPEN_BATCH_SECTION_DELETION:`TOOLFOX_OPEN_BATCH_SECTION_DELETION`,OPEN_VIDEO_ATTACHMENT:`TOOLFOX_OPEN_VIDEO_ATTACHMENT`,OPEN_EXECUTION_HISTORY:`TOOLFOX_OPEN_EXECUTION_HISTORY`,OPEN_TELEGRAM_GROUP_BROWSER:`TOOLFOX_OPEN_TELEGRAM_GROUP_BROWSER`,EXPORT_STATUS:`TOOLFOX_EXPORT_STATUS`,STORAGE_REQUEST:`TOOLFOX_STORAGE_REQUEST`,STORAGE_RESPONSE:`TOOLFOX_STORAGE_RESPONSE`},n={STARTED:`started`,COMPLETE:`complete`,ERROR:`error`},r={GET:`get`,SET:`set`},i={EXECUTION_HISTORY_PREFERENCES:`executionHistoryPreferences`},a={[e.START_EXPORT]:{type:t.START_EXPORT,info:`Automation sequence channeled to page engine.`},[e.OPEN_LESSON_RESET]:{type:t.OPEN_LESSON_RESET,info:`Lesson reset workflow opened.`},[e.OPEN_ACTION_RECORDER]:{type:t.OPEN_ACTION_RECORDER,info:`Action recorder opened.`},[e.OPEN_BATCH_LESSON_ACCESS]:{type:t.OPEN_BATCH_LESSON_ACCESS,info:`Batch lesson access opened.`},[e.OPEN_BATCH_USER_ONBOARDING]:{type:t.OPEN_BATCH_USER_ONBOARDING,info:`Batch user onboarding opened.`},[e.OPEN_BATCH_USER_MANAGEMENT]:{type:t.OPEN_BATCH_USER_MANAGEMENT,info:`Batch user management opened.`},[e.OPEN_BATCH_SECTION_CREATION]:{type:t.OPEN_BATCH_SECTION_CREATION,info:`Batch section creation opened.`},[e.OPEN_BATCH_SECTION_DELETION]:{type:t.OPEN_BATCH_SECTION_DELETION,info:`Batch section deletion opened.`},[e.OPEN_VIDEO_ATTACHMENT]:{type:t.OPEN_VIDEO_ATTACHMENT,info:`YouTube video attachment opened.`},[e.OPEN_EXECUTION_HISTORY]:{type:t.OPEN_EXECUTION_HISTORY,info:`Execution history opened.`},[e.OPEN_TELEGRAM_GROUP_BROWSER]:{type:t.OPEN_TELEGRAM_GROUP_BROWSER,info:`Telegram owned-group browser opened.`}},o=new Set(Object.values(a).map(({type:e})=>e));new Set(Object.values(n)),new Set(Object.values(r)),new Set(Object.values(i));function s(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function c(e,t){return Object.keys(e).every(e=>t.has(e))}function l(e){return typeof e==`string`&&e.length>0}function u(e){return!s(e)||typeof e.type!=`string`||!o.has(e.type)?!1:e.type===t.OPEN_EXECUTION_HISTORY?c(e,new Set([`type`,`executionId`]))&&(e.executionId===void 0||e.executionId===null||l(e.executionId)):c(e,new Set([`type`]))}var d=class{constructor({context:e,features:t=[]}={}){if(!e||typeof e!=`object`)throw TypeError(`context is required`);if(typeof e.logger?.createChildLogger!=`function`)throw TypeError(`context must provide a logger`);if(typeof e.registerDispatch!=`function`)throw TypeError(`context must provide dispatch registration`);if(!Array.isArray(t))throw TypeError(`features must be an array`);this.features=new Map,this.context=e,this.logger=e.logger.createChildLogger(`FeatureDispatcher`),this.register=this.register.bind(this),this.dispatch=this.dispatch.bind(this),e.registerDispatch(this.dispatch),t.forEach(this.register)}register({type:e,create:t}){if(typeof e!=`string`||typeof t!=`function`)throw TypeError(`Feature definition must provide a type and create function`);if(this.features.has(e))throw TypeError(`Feature "${e}" is already registered`);let n=t(this.context);if(typeof n!=`function`)throw TypeError(`Feature "${e}" must create a command handler`);this.features.set(e,n)}dispatch(e){if(!u(e))return!1;let t=this.features.get(e.type);if(!t)return!1;try{Promise.resolve(t(e)).catch(t=>{this.logger.log(`Feature "${e.type}" failed:`,t)})}catch(t){this.logger.log(`Feature "${e.type}" failed:`,t)}return!0}},f=Object.freeze({DELETED:`deleted`,DELETING:`deleting`,FAILED:`failed`,NOT_ATTEMPTED:`not-attempted`,PENDING:`pending`}),ee=new Set([`AUTH_KEY_UNREGISTERED`,`SESSION_EXPIRED`,`SESSION_REVOKED`,`TELEGRAM_WEB_K_OPERATION_UNAVAILABLE`,`TELEGRAM_WEB_K_UNSUPPORTED_RUNTIME`]);function te(e){return Object.freeze({code:typeof e?.code==`string`?e.code:`TELEGRAM_DELETE_FAILED`,message:e instanceof Error||typeof e?.message==`string`?e.message:`Не удалось удалить группу.`})}function ne(e){let t=typeof e?.code==`string`?e.code:``;return ee.has(t)||t===`AUTH_KEY_DUPLICATED`||t.startsWith(`FLOOD_WAIT_`)}function p(e,t,n=null){let r=n?te(n):null;return Object.freeze({errorCode:r?.code||null,errorMessage:r?.message||null,kind:e.kind,peerId:e.peerId,status:t,title:e.title})}function re(e){let t=Object.freeze(Array.from(e||[])),n=Object.freeze({deleted:t.filter(({status:e})=>e===f.DELETED).length,failed:t.filter(({status:e})=>e===f.FAILED).length,notAttempted:t.filter(({status:e})=>e===f.NOT_ATTEMPTED).length,pending:t.filter(({status:e})=>e===f.PENDING||e===f.DELETING).length,total:t.length});return Object.freeze({counts:n,results:t})}function m(e,t){if(typeof e==`function`)try{e(re(t))}catch{}}async function ie(e,t,{confirmed:n=!1,onProgress:r}={}){if(!e||typeof e.deleteGroup!=`function`)throw TypeError(`Telegram adapter with deleteGroup() is required.`);let i=Array.from(t||[]);if(i.length===0)throw TypeError(`At least one Telegram group must be selected for deletion.`);if(n!==!0)throw TypeError(`Explicit confirmation is required before deleting Telegram groups.`);let a=i.map(e=>p(e,f.PENDING));m(r,a);for(let t=0;t<i.length;t+=1){let n=i[t];a[t]=p(n,f.DELETING),m(r,a);try{await e.deleteGroup(n.peerId,n.kind),a[t]=p(n,f.DELETED),m(r,a)}catch(e){if(a[t]=p(n,f.FAILED,e),ne(e)){for(let n=t+1;n<i.length;n+=1)a[n]=p(i[n],f.NOT_ATTEMPTED,{code:e.code||`TELEGRAM_DELETE_INTERRUPTED`,message:`Не выполнено: очередь остановлена после общей ошибки Telegram.`});m(r,a);break}m(r,a)}}return re(a)}function ae(e,t){let n=new Set(Array.from(t||[]).filter(({status:e})=>e===f.DELETED).map(({peerId:e})=>Number(e)));return Object.freeze(Array.from(e||[]).filter(({peerId:e})=>!n.has(Number(e))))}var h=globalThis,g=h.ShadowRoot&&(h.ShadyCSS===void 0||h.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,_=Symbol(),oe=new WeakMap,se=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==_)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(g&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=oe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&oe.set(t,e))}return e}toString(){return this.cssText}},ce=e=>new se(typeof e==`string`?e:e+``,void 0,_),v=(e,...t)=>new se(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,_),le=(e,t)=>{if(g)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let n of t){let t=document.createElement(`style`),r=h.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},ue=g?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return ce(t)})(e):e,{is:de,defineProperty:fe,getOwnPropertyDescriptor:pe,getOwnPropertyNames:me,getOwnPropertySymbols:he,getPrototypeOf:ge}=Object,y=globalThis,b=y.trustedTypes,_e=b?b.emptyScript:``,ve=y.reactiveElementPolyfillSupport,x=(e,t)=>e,S={toAttribute(e,t){switch(t){case Boolean:e=e?_e:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},ye=(e,t)=>!de(e,t),be={attribute:!0,type:String,converter:S,reflect:!1,useDefault:!1,hasChanged:ye};Symbol.metadata??=Symbol(`metadata`),y.litPropertyMetadata??=new WeakMap;var C=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=be){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&fe(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=pe(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??be}static _$Ei(){if(this.hasOwnProperty(x(`elementProperties`)))return;let e=ge(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(x(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(x(`properties`))){let e=this.properties,t=[...me(e),...he(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(ue(e))}else e!==void 0&&t.push(ue(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return le(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?S:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?S:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??ye)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};C.elementStyles=[],C.shadowRootOptions={mode:`open`},C[x(`elementProperties`)]=new Map,C[x(`finalized`)]=new Map,ve?.({ReactiveElement:C}),(y.reactiveElementVersions??=[]).push(`2.1.2`);var w=globalThis,xe=e=>e,T=w.trustedTypes,Se=T?T.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,Ce=`$lit$`,E=`lit$${Math.random().toFixed(9).slice(2)}$`,we=`?`+E,Te=`<${we}>`,D=document,O=()=>D.createComment(``),k=e=>e===null||typeof e!=`object`&&typeof e!=`function`,A=Array.isArray,Ee=e=>A(e)||typeof e?.[Symbol.iterator]==`function`,j=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,De=/-->/g,Oe=/>/g,N=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),ke=/'/g,Ae=/"/g,je=/^(?:script|style|textarea|title)$/i,P=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),F=Symbol.for(`lit-noChange`),I=Symbol.for(`lit-nothing`),Me=new WeakMap,L=D.createTreeWalker(D,129);function Ne(e,t){if(!A(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return Se===void 0?t:Se.createHTML(t)}var Pe=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=M;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===M?c[1]===`!--`?o=De:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=N):(je.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=N):o=Oe:o===N?c[0]===`>`?(o=i??M,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?N:c[3]===`"`?Ae:ke):o===Ae||o===ke?o=N:o===De||o===Oe?o=M:(o=N,i=void 0);let d=o===N&&e[t+1].startsWith(`/>`)?` `:``;a+=o===M?n+Te:l>=0?(r.push(s),n.slice(0,l)+Ce+n.slice(l)+E+d):n+E+(l===-2?t:d)}return[Ne(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},R=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Pe(t,n);if(this.el=e.createElement(l,r),L.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=L.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(Ce)){let t=u[o++],n=i.getAttribute(e).split(E),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Ie:r[1]===`?`?Le:r[1]===`@`?Re:V}),i.removeAttribute(e)}else e.startsWith(E)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(je.test(i.tagName)){let e=i.textContent.split(E),t=e.length-1;if(t>0){i.textContent=T?T.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],O()),L.nextNode(),c.push({type:2,index:++a});i.append(e[t],O())}}}else if(i.nodeType===8){if(i.data===we)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(E,e+1))!==-1;)c.push({type:7,index:a}),e+=E.length-1}}a++}}static createElement(e,t){let n=D.createElement(`template`);return n.innerHTML=e,n}};function z(e,t,n=e,r){if(t===F)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=k(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=z(e,i._$AS(e,t.values),i,r)),t}var Fe=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??D).importNode(t,!0);L.currentNode=r;let i=L.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new B(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new ze(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=L.nextNode(),a++)}return L.currentNode=D,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},B=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=I,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=z(this,e,t),k(e)?e===I||e==null||e===``?(this._$AH!==I&&this._$AR(),this._$AH=I):e!==this._$AH&&e!==F&&this._(e):e._$litType$===void 0?e.nodeType===void 0?Ee(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==I&&k(this._$AH)?this._$AA.nextSibling.data=e:this.T(D.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=R.createElement(Ne(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Fe(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=Me.get(e.strings);return t===void 0&&Me.set(e.strings,t=new R(e)),t}k(t){A(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(O()),this.O(O()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=xe(e).nextSibling;xe(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},V=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=I,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=I}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=z(this,e,t,0),a=!k(e)||e!==this._$AH&&e!==F,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=z(this,r[n+o],t,o),s===F&&(s=this._$AH[o]),a||=!k(s)||s!==this._$AH[o],s===I?e=I:e!==I&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===I?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Ie=class extends V{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===I?void 0:e}},Le=class extends V{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==I)}},Re=class extends V{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=z(this,e,t,0)??I)===F)return;let n=this._$AH,r=e===I&&n!==I||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==I&&(n===I||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ze=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){z(this,e)}},Be=w.litHtmlPolyfillSupport;Be?.(R,B),(w.litHtmlVersions??=[]).push(`3.3.3`);var Ve=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new B(t.insertBefore(O(),e),e,void 0,n??{})}return i._$AI(e),i},H=globalThis,U=class extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ve(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};U._$litElement$=!0,U.finalized=!0,H.litElementHydrateSupport?.({LitElement:U});var He=H.litElementPolyfillSupport;He?.({LitElement:U}),(H.litElementVersions??=[]).push(`4.2.2`);var Ue=v`
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

    .group-browser {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr) auto;
        gap: 12px;
        min-height: 220px;
    }

    .toolbar {
        display: grid;
        gap: 8px;
    }

    .toolbar-controls {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: end;
        gap: 10px;
    }

    .sort-button {
        white-space: nowrap;
    }

    .group-list-region {
        min-height: 0;
    }

    .group-list,
    .result-list,
    .review-list {
        display: grid;
        gap: 10px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .group-card {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 14px 16px;
        border: 1px solid var(--toolfox-border-subtle);
        border-radius: var(--toolfox-radius-panel);
        background: var(--toolfox-surface-subtle);
    }

    .group-card.is-selected {
        border-color: var(--toolfox-primary);
        background: var(--toolfox-primary-surface, var(--toolfox-surface-subtle));
    }

    .selection-control {
        display: grid;
        place-items: center;
        flex: 0 0 auto;
        min-width: 24px;
        min-height: 24px;
        cursor: pointer;
    }

    .selection-control input {
        width: 18px;
        height: 18px;
        margin: 0;
        accent-color: var(--toolfox-primary);
        cursor: pointer;
    }

    .group-body {
        display: grid;
        flex: 1 1 auto;
        gap: 9px;
        min-width: 0;
    }

    .group-heading,
    .result-heading {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
    }

    .group-heading strong,
    .result-heading strong {
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

    .group-actions,
    .selection-actions {
        margin-top: 0;
        padding-top: 14px;
        border-top: 1px solid var(--toolfox-border-subtle);
    }

    .group-actions {
        justify-content: flex-end;
    }

    .selection-actions {
        justify-content: space-between;
    }

    .operation-panel {
        display: grid;
        gap: 16px;
    }

    .operation-panel h3,
    .operation-copy {
        margin: 0;
    }

    .operation-copy {
        margin-top: 5px;
        color: var(--toolfox-text-muted);
        font-size: 12px;
        line-height: 1.45;
    }

    .review-list li,
    .result-card {
        display: grid;
        gap: 5px;
        padding: 11px 13px;
        border: 1px solid var(--toolfox-border-subtle);
        border-radius: var(--toolfox-radius-control);
        background: var(--toolfox-surface-subtle);
    }

    .review-list li {
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: baseline;
    }

    .review-list span,
    .result-heading span {
        color: var(--toolfox-text-muted);
        font-size: 11px;
        font-weight: 700;
    }

    .result-deleted {
        border-color: var(--toolfox-success-border);
    }

    .result-failed {
        border-color: var(--toolfox-danger-border);
    }

    .result-not-attempted {
        border-color: var(--toolfox-warning-border);
    }

    .result-deleting {
        border-color: var(--toolfox-primary);
    }

    .result-error {
        margin: 0;
        color: var(--toolfox-text-muted);
        font-size: 11px;
        line-height: 1.4;
        overflow-wrap: anywhere;
    }

    @media (max-width: 640px) {
        .dialog {
            width: 100vw;
            height: 100vh;
        }

        .content {
            max-height: none;
        }

        .toolbar-controls {
            grid-template-columns: 1fr;
        }

        .sort-button {
            width: 100%;
        }
    }
`,We=`supported`,Ge=new Set([`group`,`supergroup`]),W=Object.freeze({NEWEST_FIRST:`newest-first`,OLDEST_FIRST:`oldest-first`});function Ke(e){if(!e)return null;let t=Date.parse(e);return Number.isFinite(t)?t:null}function qe(e){return!e||!e.isActive||!e.isCreator||!Ge.has(e.groupType)||!Number.isFinite(Number(e.peerId))?null:Object.freeze({canSendText:typeof e.canSendText==`boolean`?e.canSendText:null,isCreator:!0,kind:e.groupType,lastActivityAt:e.lastActivityAt||null,peerId:Number(e.peerId),title:String(e.title||``).trim()||`Без названия`})}function Je(e,t,n=W.NEWEST_FIRST){let r=Ke(e?.lastActivityAt),i=Ke(t?.lastActivityAt);if(r!==i)return r===null?1:i===null?-1:n===W.OLDEST_FIRST?r-i:i-r;let a=String(e?.title||``).toLowerCase(),o=String(t?.title||``).toLowerCase();return a===o?Number(e?.peerId)-Number(t?.peerId):a<o?-1:1}function Ye(e,t=W.NEWEST_FIRST){return Object.freeze(Array.from(e||[]).sort((e,n)=>Je(e,n,t)))}function Xe(e,t=``){let n=Array.from(e||[]),r=String(t||``).trim().toLowerCase();return Object.freeze(r?n.filter(e=>String(e?.title||``).toLowerCase().includes(r)):n)}function Ze(e){return new Set(Array.from(e||[]).map(e=>Number(e)).filter(Number.isFinite))}function Qe(e,t,n){let r=Number(t),i=Ze(e);return Number.isFinite(r)&&((typeof n==`boolean`?n:!i.has(r))?i.add(r):i.delete(r)),Object.freeze([...i])}function G(e,t){let n=Ze(t);return Object.freeze(Array.from(e||[]).filter(({peerId:e})=>n.has(Number(e))))}function $e(e,t=``,n=W.NEWEST_FIRST){let r=Array.from(e||[]);if(r.length===0)return Object.freeze({groups:Object.freeze([]),state:`empty`});let i=Ye(Xe(r,t),n);return Object.freeze({groups:i,state:i.length===0?`filtered-empty`:`ready`})}function et(e){return Object.freeze({groups:Object.freeze([]),reason:e?.reason||`unsupported-runtime`,state:`unsupported`})}async function tt(e,{pageSize:t=100}={}){if(!e||typeof e.getCompatibility!=`function`)throw TypeError(`Telegram adapter is required.`);let n=e.getCompatibility();if(n?.state!==We)return et(n);let r=new Map,i=new Set,a=0;for(;a!==null;){if(i.has(a))throw Error(`Telegram dialog pagination repeated an offset.`);i.add(a);let n=await e.listDialogs({limit:t,offset:a});for(let t of n.items||[]){if(!Number.isFinite(Number(t.peerId))||Number(t.peerId)>=0)continue;let n=qe(await e.resolveGroupCandidate(t));n&&r.set(n.peerId,n)}a=n.nextOffset}let o=Ye(r.values());return Object.freeze({groups:o,reason:null,state:o.length===0?`empty`:`ready`})}var nt=Object.freeze({"--toolfox-font-family":`"Segoe UI", Inter, Arial, system-ui, sans-serif`,"--toolfox-z-dialog":`2147483647`,"--toolfox-overlay":`rgba(15, 23, 42, 0.6)`,"--toolfox-surface":`#fff`,"--toolfox-surface-subtle":`#f8fafc`,"--toolfox-surface-app":`#f4f6fa`,"--toolfox-text":`#1f2937`,"--toolfox-text-strong":`#111827`,"--toolfox-text-muted":`#6b7280`,"--toolfox-border":`#d1d5db`,"--toolfox-border-subtle":`#e5e7eb`,"--toolfox-primary":`#2563eb`,"--toolfox-brand":`#4055d3`,"--toolfox-danger":`#b91c1c`,"--toolfox-danger-surface":`#fef2f2`,"--toolfox-danger-border":`#fecaca`,"--toolfox-warning":`#9a3412`,"--toolfox-warning-surface":`#fff7ed`,"--toolfox-warning-border":`#fed7aa`,"--toolfox-success":`#166534`,"--toolfox-success-surface":`#f0fdf4`,"--toolfox-success-border":`#bbf7d0`,"--toolfox-info":`#1e3a8a`,"--toolfox-info-surface":`#eff6ff`,"--toolfox-info-border":`#bfdbfe`,"--toolfox-focus-outline":`#2563eb`,"--toolfox-focus-halo":`rgba(37, 99, 235, 0.25)`,"--toolfox-radius-control":`8px`,"--toolfox-radius-panel":`10px`,"--toolfox-radius-dialog":`16px`,"--toolfox-radius-pill":`999px`,"--toolfox-shadow-card":`0 2px 7px rgba(30, 42, 70, 0.04)`,"--toolfox-shadow-dialog":`0 24px 80px rgba(15, 23, 42, 0.38)`});function rt(e=nt){return Object.entries(e).map(([e,t])=>`${e}: ${t};`).join(`
`)}var it=v`
    :host {
        ${ce(rt())}
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
`,at=v`
    :host {
        font-family: var(--toolfox-font-family);
    }
`,ot=v`
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
`,st=v`
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
`,ct=v`
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
`,lt=v`
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
`;v`
    [data-part="progress"] {
        accent-color: var(--toolfox-primary);
    }

    [data-part="status"] {
        color: var(--toolfox-text-muted);
        font-size: 12px;
    }
`,v`
    [data-part="empty-state"] {
        padding: 24px;
        border: 1px dashed var(--toolfox-border);
        border-radius: var(--toolfox-radius-panel);
        color: var(--toolfox-text-muted);
        text-align: center;
    }
`;var ut=`toolfox-telegram-owned-groups-dialog`;function dt(e){if(!e)return`нет данных`;let t=new Date(e);return Number.isNaN(t.getTime())?`нет данных`:new Intl.DateTimeFormat(void 0,{dateStyle:`medium`,timeStyle:`short`}).format(t)}function ft(e){return e===`supergroup`?`Супергруппа`:`Группа`}function pt(e){return e===!0?`Можно отправлять сообщения`:e===!1?`Отправка сообщений недоступна`:`Возможность отправки неизвестна`}function mt(e){switch(e){case`deleted`:return`Удалена`;case`deleting`:return`Удаляется…`;case`failed`:return`Ошибка`;case`not-attempted`:return`Не выполнено`;default:return`Ожидает`}}var ht=class extends U{static styles=[it,at,ot,st,ct,lt,Ue];static properties={options:{state:!0},groups:{state:!0},viewState:{state:!0},message:{state:!0},filterQuery:{state:!0},sortOrder:{state:!0},actionStage:{state:!0},selectionAction:{state:!0},selectedPeerIds:{state:!0},deleteProgress:{state:!0},operationError:{state:!0}};constructor(){super(),this.options=null,this.groups=[],this.viewState=`loading`,this.message=`Загружаем группы текущего аккаунта…`,this.filterQuery=``,this.sortOrder=W.NEWEST_FIRST,this.actionStage=`browse`,this.selectionAction=null,this.selectedPeerIds=[],this.deleteProgress=null,this.operationError=``,this.loadPromise=null,this.handleKeydownBound=e=>{if(e.key===`Escape`&&this.actionStage!==`running`){if(this.actionStage===`confirm`){this.cancelConfirmation();return}if(this.actionStage===`select`){this.cancelSelection();return}if(this.actionStage===`results`){this.finishDeleteResults();return}this.close()}}}configure(e={}){return this.options=e&&typeof e==`object`?e:{},this.isConnected&&this.load(),this}connectedCallback(){super.connectedCallback(),this.ownerDocument?.addEventListener(`keydown`,this.handleKeydownBound),this.load()}disconnectedCallback(){this.ownerDocument?.removeEventListener(`keydown`,this.handleKeydownBound),super.disconnectedCallback()}resetActionState(){this.actionStage=`browse`,this.selectionAction=null,this.selectedPeerIds=[],this.deleteProgress=null,this.operationError=``}async load(){if(!this.options?.onLoad||this.loadPromise)return this.loadPromise;this.viewState=`loading`,this.groups=[],this.message=`Загружаем группы текущего аккаунта…`,this.resetActionState(),this.loadPromise=(async()=>{try{let e=await this.options.onLoad();this.groups=[...e?.groups||[]],this.viewState=e?.state||(this.groups.length>0?`ready`:`empty`),this.message=this.viewState===`unsupported`?`Текущая версия Telegram Web K не предоставляет ожидаемый runtime-интерфейс.`:this.viewState===`empty`?`У текущего аккаунта не найдено созданных им активных групп.`:``}catch(e){this.groups=[],this.viewState=`error`,this.message=e instanceof Error?e.message:`Не удалось загрузить группы Telegram.`}finally{this.loadPromise=null}})(),await this.loadPromise,await this.updateComplete,this.shadowRoot?.querySelector(`[data-action="close"]`)?.focus()}retry(){this.load()}close(){this.actionStage!==`running`&&this.options?.onClose?.()}handleFilterInput(e){this.filterQuery=e.currentTarget?.value||``}toggleSortOrder(){this.sortOrder=this.sortOrder===W.NEWEST_FIRST?W.OLDEST_FIRST:W.NEWEST_FIRST}startSelection(e){this.selectionAction=e,this.selectedPeerIds=[],this.actionStage=`select`,this.deleteProgress=null,this.operationError=``}cancelSelection(){this.resetActionState()}handleSelectionChange(e,t){this.selectedPeerIds=Qe(this.selectedPeerIds,t,!!e.currentTarget?.checked)}requestDeleteConfirmation(){this.selectionAction===`delete`&&G(this.groups,this.selectedPeerIds).length!==0&&(this.actionStage=`confirm`)}cancelConfirmation(){this.actionStage=`select`}async confirmDelete(){let e=G(this.groups,this.selectedPeerIds);if(e.length!==0&&typeof this.options?.onDelete==`function`){this.actionStage=`running`,this.operationError=``;try{let t=await this.options.onDelete(e,{confirmed:!0,onProgress:e=>{this.deleteProgress=e}});this.deleteProgress=t,this.groups=[...ae(this.groups,t.results)]}catch(e){this.operationError=e instanceof Error?e.message:`Не удалось выполнить удаление групп.`}finally{this.selectedPeerIds=[],this.actionStage=`results`}}}finishDeleteResults(){this.resetActionState(),this.viewState=this.groups.length>0?`ready`:`empty`,this.viewState===`empty`&&(this.message=`У текущего аккаунта не найдено созданных им активных групп.`)}renderState(){let e=this.viewState===`error`,t=e||this.viewState===`unsupported`,n=this.viewState===`loading`?`Загрузка…`:this.viewState===`empty`?`Групп пока нет`:e?`Не удалось загрузить группы`:`Telegram Web K несовместим`;return P`
            <div class="state-card ${e?`is-error`:``}" data-part="empty-state" aria-live="polite">
                <h3>${n}</h3>
                <p>${this.message}</p>
                ${t?P`
                    <button type="button" data-control @click=${this.retry}>Повторить</button>
                `:I}
            </div>
        `}renderFilterEmptyState(){return P`
            <div class="state-card filter-empty-state" data-part="filter-empty-state" aria-live="polite">
                <h3>Ничего не найдено</h3>
                <p>Измените фильтр, чтобы снова увидеть подходящие группы.</p>
            </div>
        `}renderGroup(e,{selectable:t=!1}={}){let n=this.selectedPeerIds.includes(e.peerId);return P`
            <li class="group-card ${n?`is-selected`:``}" data-peer-id=${String(e.peerId)}>
                ${t?P`
                    <label class="selection-control">
                        <input
                            type="checkbox"
                            .checked=${n}
                            aria-label=${`Выбрать ${e.title}`}
                            @change=${t=>this.handleSelectionChange(t,e.peerId)}
                        >
                    </label>
                `:I}
                <div class="group-body">
                    <div class="group-heading">
                        <strong>${e.title}</strong>
                        <span class="kind">${ft(e.kind)}</span>
                    </div>
                    <div class="metadata">
                        <span>Последняя активность: ${dt(e.lastActivityAt)}</span>
                        <span>${pt(e.canSendText)}</span>
                    </div>
                </div>
            </li>
        `}renderFilterToolbar(e){let t=this.filterQuery.trim()!==``,n=this.selectedPeerIds.length,r=t?`Показано: ${e.groups.length} из ${this.groups.length}`:`Найдено групп: ${this.groups.length}`,i=this.actionStage===`select`?`Выбрано: ${n} · ${r}`:r,a=this.sortOrder===W.NEWEST_FIRST?`Новые → старые`:`Старые → новые`;return P`
            <div class="toolbar">
                <div class="toolbar-controls">
                    <label class="filter-field" data-field>
                        <span>Фильтр по названию</span>
                        <input
                            type="search"
                            placeholder="Начните вводить название…"
                            .value=${this.filterQuery}
                            @input=${this.handleFilterInput}
                        >
                    </label>
                    <button
                        class="sort-button"
                        type="button"
                        data-control="secondary"
                        aria-label="Изменить порядок сортировки по последней активности"
                        @click=${this.toggleSortOrder}
                    >${a}</button>
                </div>
                <p class="summary" aria-live="polite">${i}</p>
            </div>
        `}renderBrowseActions(){return P`
            <footer class="group-actions" data-part="actions">
                <button
                    type="button"
                    data-control="danger"
                    @click=${()=>this.startSelection(`delete`)}
                >Удалить группы</button>
            </footer>
        `}renderSelectionActions(){let e=this.selectedPeerIds.length;return P`
            <footer class="selection-actions" data-part="actions">
                <button type="button" data-control="secondary" @click=${this.cancelSelection}>Отмена</button>
                <button
                    type="button"
                    data-control="danger"
                    ?disabled=${e===0}
                    @click=${this.requestDeleteConfirmation}
                >Проверить удаление (${e})</button>
            </footer>
        `}renderDeleteConfirmation(){let e=G(this.groups,this.selectedPeerIds);return P`
            <div class="operation-panel confirmation-panel">
                <div data-notice="danger">
                    <strong>Необратимое действие.</strong>
                    Эти группы будут удалены для всех участников. Уже удалённую группу нельзя восстановить через Toolfox.
                </div>
                <div>
                    <h3>Удалить групп: ${e.length}?</h3>
                    <p class="operation-copy">Проверьте список перед подтверждением.</p>
                </div>
                <ul class="review-list">
                    ${e.map(e=>P`
                        <li>
                            <strong>${e.title}</strong>
                            <span>${ft(e.kind)}</span>
                        </li>
                    `)}
                </ul>
                <div data-part="actions">
                    <button type="button" data-control="secondary" @click=${this.cancelConfirmation}>Назад</button>
                    <button type="button" data-control="danger" @click=${this.confirmDelete}>
                        Да, удалить ${e.length}
                    </button>
                </div>
            </div>
        `}renderDeleteResultItem(e){let t=e.status===`failed`||e.status===`not-attempted`;return P`
            <li class="result-card result-${e.status}">
                <div class="result-heading">
                    <strong>${e.title}</strong>
                    <span>${mt(e.status)}</span>
                </div>
                ${t?P`
                    <p class="result-error">
                        ${e.errorCode?`${e.errorCode}: `:``}${e.errorMessage||`Неизвестная ошибка.`}
                    </p>
                `:I}
            </li>
        `}renderDeleteProgress(){let e=this.deleteProgress,t=this.actionStage===`running`,n=e?.counts||{deleted:0,failed:0,notAttempted:0,pending:0,total:0};return P`
            <div class="operation-panel" aria-live="polite">
                <div>
                    <h3>${t?`Удаляем группы…`:`Удаление завершено`}</h3>
                    <p class="operation-copy">
                        Удалено: ${n.deleted} · Ошибок: ${n.failed} · Не выполнено: ${n.notAttempted} · Всего: ${n.total}
                    </p>
                </div>
                ${this.operationError?P`
                    <div data-notice="danger">${this.operationError}</div>
                `:I}
                ${e?.results?.length?P`
                    <ul class="result-list">
                        ${e.results.map(e=>this.renderDeleteResultItem(e))}
                    </ul>
                `:I}
                ${t?I:P`
                    <div data-part="actions">
                        <button type="button" data-control @click=${this.finishDeleteResults}>Вернуться к группам</button>
                    </div>
                `}
            </div>
        `}renderGroupList(){let e=$e(this.groups,this.filterQuery,this.sortOrder),t=this.actionStage===`select`;return P`
            <div class="group-browser">
                ${this.renderFilterToolbar(e)}
                <div class="group-list-region">
                    ${e.state===`filtered-empty`?this.renderFilterEmptyState():P`
                        <ul class="group-list">
                            ${e.groups.map(e=>this.renderGroup(e,{selectable:t}))}
                        </ul>
                    `}
                </div>
                ${t?this.renderSelectionActions():this.renderBrowseActions()}
            </div>
        `}renderReady(){return this.actionStage===`confirm`?this.renderDeleteConfirmation():this.actionStage===`running`||this.actionStage===`results`?this.renderDeleteProgress():this.renderGroupList()}render(){let e=this.viewState===`ready`;return P`
            <div class="overlay" data-part="overlay">
                <section class="dialog" data-part="dialog" role="dialog" aria-modal="true" aria-labelledby="telegram-groups-title">
                    <header class="dialog-header">
                        <div>
                            <p class="eyebrow">Toolfox · Telegram</p>
                            <h2 id="telegram-groups-title">Мои группы</h2>
                            <p class="header-copy">Только активные группы, создателем которых является текущий Telegram-аккаунт.</p>
                        </div>
                        <button
                            class="icon-button"
                            data-control="secondary"
                            type="button"
                            data-action="close"
                            aria-label="Закрыть"
                            ?disabled=${this.actionStage===`running`}
                            @click=${this.close}
                        >×</button>
                    </header>
                    <div class="content">
                        ${e?this.renderReady():this.renderState()}
                    </div>
                </section>
            </div>
        `}};customElements.define(ut,ht);function gt({adapter:e,documentApi:t=globalThis.document,logger:n={log(){}}}){if(!e)throw TypeError(`Telegram adapter is required.`);if(!t?.createElement)throw TypeError(`Document API is required.`);let r=null;function i(){r?.remove(),r=null}function a(){return r?.isConnected?(r.load?.(),r):(r=t.createElement(ut),r.configure({onClose:i,onDelete:(t,n)=>ie(e,t,n),onLoad:()=>tt(e)}),(t.body||t.documentElement).append(r),n.log(`Telegram owned-group browser opened.`),r)}return Object.freeze({close:i,open:a})}var _t=Object.freeze({type:t.OPEN_TELEGRAM_GROUP_BROWSER,create(e){let t=gt({adapter:e.telegramWeb,logger:e.logger.createChildLogger(`TelegramOwnedGroups`)});return()=>t.open()}}),K=Object.freeze({EDVIBE:`edvibe`,TELEGRAM_WEB_K:`telegram-web-k`,UNSUPPORTED:`unsupported`});function vt(e){return String(e||``).toLowerCase().replace(/\.$/,``)}function yt(e=globalThis.location){let t=vt(e?.hostname),n=String(e?.pathname||`/`);return t===`edvibe.com`||t.endsWith(`.edvibe.com`)?K.EDVIBE:t===`web.telegram.org`&&(n===`/k`||n.startsWith(`/k/`))?K.TELEGRAM_WEB_K:K.UNSUPPORTED}var q=Object.freeze({SUPPORTED:`supported`,UNSUPPORTED:`unsupported`}),bt=Object.freeze({MANAGER_FACTORY_UNAVAILABLE:`manager-factory-unavailable`,MANAGER_FACADE_UNAVAILABLE:`manager-facade-unavailable`}),J=class extends Error{constructor(e,{code:t,cause:n,compatibility:r,operation:i}={}){super(e,{cause:n}),this.name=`TelegramWebKRuntimeError`,this.code=t,this.compatibility=r,this.operation=i}};function Y(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function X(e){if(e==null||e===``)return null;let t=Number(e);return Number.isFinite(t)?t:null}function xt(e){let t=Number.parseInt(String(e||`1`),10);return t>=1&&t<=4?t:1}function St(e=globalThis.location){try{return xt(new URL(e?.href||`https://web.telegram.org/k/`).searchParams.get(`account`))}catch{return 1}}function Z(e,t){return Object.freeze({accountNumber:t,reason:e,state:q.UNSUPPORTED})}function Ct(e){return Object.freeze({accountNumber:e,reason:null,state:q.SUPPORTED})}function wt({globalObject:e=globalThis,location:t=globalThis.location}={}){let n=St(t);return typeof e?.createProxiedManagersForAccount==`function`?Ct(n):Z(bt.MANAGER_FACTORY_UNAVAILABLE,n)}function Tt(e){if(!Y(e))return null;let t=X(e.peerId);if(t===null)return null;let n=X(e.top_message);return Object.freeze({peerId:t,topMessageId:n})}function Et(e){return e?._===`chat`?`group`:e?._===`channel`&&e.pFlags?.megagroup?`supergroup`:e?._===`channel`?`channel`:e?._===`user`?`user`:`unknown`}function Dt(e,t){if(t!==`group`&&t!==`supergroup`)return!1;let n=e?.pFlags||{};return n.left||n.deactivated?!1:!(t===`group`&&e?.migrated_to)}function Ot(e,t){if(!Y(t))return Object.freeze({isActive:!1,isBroadcast:!1,isCreator:!1,isGroup:!1,peerId:e,title:``,type:`unknown`});let n=Et(t);return Object.freeze({isActive:Dt(t,n),isBroadcast:n===`channel`&&!!t.pFlags?.broadcast,isCreator:!!t.pFlags?.creator,isGroup:n===`group`||n===`supergroup`,peerId:e,title:typeof t.title==`string`?t.title:``,type:n})}function kt({canSendText:e=null,dialog:t,lastActivityAt:n=null,peer:r}){return!r?.isGroup||!t?null:Object.freeze({canSendText:typeof e==`boolean`?e:null,groupType:r.type,isActive:!!r.isActive,isCreator:r.isCreator,lastActivityAt:n,peerId:r.peerId,title:r.title})}function At(e){let t=X(e?.date);return t===null||t<0?null:new Date(t*1e3).toISOString()}function jt(e){for(let t of[e?.type,e?.error_message,e?.code])if(typeof t==`string`&&/^[A-Z][A-Z0-9_]*(?:_\d+)?$/.test(t))return t;return null}function Q(e,t){return new J(`Telegram Web K operation "${e}" failed.`,{cause:t,code:jt(t)||`TELEGRAM_WEB_K_RUNTIME_CALL_FAILED`,operation:e})}function Mt(e){return new J(`Telegram Web K operation "${e}" is unavailable in the current runtime.`,{code:`TELEGRAM_WEB_K_OPERATION_UNAVAILABLE`,operation:e})}var Nt=class{constructor({globalObject:e=globalThis,location:t=globalThis.location}={}){this.globalObject=e,this.location=t,this.cachedManagers=null,this.cachedAccountNumber=null,this.cachedManagerFactory=null}getCompatibility(){return wt({globalObject:this.globalObject,location:this.location})}getManagers(){let e=this.getCompatibility();if(e.state!==q.SUPPORTED)throw new J(`Telegram Web K runtime adapter is unavailable.`,{code:`TELEGRAM_WEB_K_UNSUPPORTED_RUNTIME`,compatibility:e,operation:`resolve-runtime`});let t=this.globalObject.createProxiedManagersForAccount;if(this.cachedManagers&&this.cachedAccountNumber===e.accountNumber&&this.cachedManagerFactory===t)return this.cachedManagers;let n;try{n=t(e.accountNumber)}catch(e){throw Q(`resolve-runtime`,e)}if(!n||typeof n!=`object`&&typeof n!=`function`)throw new J(`Telegram Web K manager facade is unavailable.`,{code:`TELEGRAM_WEB_K_UNSUPPORTED_RUNTIME`,compatibility:Z(bt.MANAGER_FACADE_UNAVAILABLE,e.accountNumber),operation:`resolve-runtime`});return this.cachedManagers=n,this.cachedAccountNumber=e.accountNumber,this.cachedManagerFactory=t,n}async listDialogs({limit:e=50,offset:t=0}={}){let n=Math.max(1,Math.trunc(e)),r=Math.max(0,Math.trunc(t));try{let e=await this.getManagers().dialogsStorage.getDialogs({limit:n,offsetIndex:r});if(!Y(e)||!Array.isArray(e.dialogs))throw TypeError(`Unexpected Telegram dialog page shape.`);let t=e.dialogs.length,i=e.dialogs.map(Tt).filter(Boolean),a=X(e.count),o=t===0||a!==null&&r+t>=a?null:r+t;return Object.freeze({count:a,items:Object.freeze(i),nextOffset:o})}catch(e){throw e instanceof J?e:Q(`list-dialogs`,e)}}async resolvePeer(e){let t=X(e);if(t===null)throw TypeError(`peerId must be a finite number`);try{return Ot(t,await this.getManagers().appPeersManager.getPeer(t))}catch(e){throw e instanceof J?e:Q(`resolve-peer`,e)}}async getLastActivity({peerId:e,topMessageId:t}){if(t==null)return null;try{return At(await this.getManagers().appMessagesManager.getMessageByPeer(e,t))}catch(e){throw e instanceof J?e:Q(`get-last-activity`,e)}}async canSendText(e){let t=X(e);if(t===null||t>=0)return!1;try{return!!await this.getManagers().appChatsManager.hasRights(Math.abs(t),`send_plain`)}catch(e){throw e instanceof J?e:Q(`check-send-text`,e)}}async resolveGroupCandidate(e){let t=await this.resolvePeer(e.peerId);if(!t.isGroup)return null;if(!t.isActive||!t.isCreator)return kt({dialog:e,peer:t});let[n,r]=await Promise.all([this.getLastActivity(e),this.canSendText(e.peerId)]);return kt({canSendText:r,dialog:e,lastActivityAt:n,peer:t})}async deleteGroup(e,t){let n=X(e);if(n===null||n>=0)throw TypeError(`peerId must identify a Telegram group`);if(t!==`group`&&t!==`supergroup`)throw TypeError(`kind must be "group" or "supergroup"`);let r=t===`supergroup`?`delete-supergroup`:`delete-group`;try{let e=this.getManagers().appChatsManager,i=t===`supergroup`?`deleteChannel`:`deleteChat`;if(typeof e?.[i]!=`function`)throw Mt(r);return await e[i](Math.abs(n)),Object.freeze({ok:!0})}catch(e){throw e instanceof J?e:Q(r,e)}}async sendText(e,t){let n=X(e);if(n===null)throw TypeError(`peerId must be a finite number`);if(typeof t!=`string`||t.trim()===``)throw TypeError(`text must be a non-empty string`);try{return await this.getManagers().appMessagesManager.sendText({peerId:n,text:t}),Object.freeze({ok:!0})}catch(e){throw e instanceof J?e:Q(`send-text`,e)}}async probe(){let e=this.getCompatibility();if(e.state!==q.SUPPORTED)return e;try{let t=await this.listDialogs({limit:1,offset:0});if(t.items.length>0){let e=t.items[0];await this.resolvePeer(e.peerId),await this.getLastActivity(e)}return Object.freeze({...e,capabilities:Object.freeze({dialogDiscovery:!0,lastActivity:!0,peerResolution:!0}),requiresLiveValidation:Object.freeze([`deleteGroup`,`sendText`])})}catch(t){return Object.freeze({accountNumber:e.accountNumber,reason:`runtime-contract-rejected`,state:q.UNSUPPORTED,errorCode:t?.code||`TELEGRAM_WEB_K_RUNTIME_CALL_FAILED`})}}};function Pt(e){return new Nt(e)}var Ft=class{constructor({globalObject:e=globalThis,location:t=globalThis.location,logger:n}){this.logger=n,this.telegramWeb=Pt({globalObject:e,location:t}),this.dispatch=null,this.registerDispatch=this.registerDispatch.bind(this)}registerDispatch(e){if(typeof e!=`function`)throw TypeError(`dispatch must be a function`);if(this.dispatch!==null)throw Error(`dispatch is already registered`);this.dispatch=e}},It=class e{constructor({namespace:e,namespaces:t=null}){this.namespaces=t??[Lt(e)],this.log=this.log.bind(this),this.createChildLogger=this.createChildLogger.bind(this)}log(...e){console.log(this.namespaces.map(e=>`[${e}]`).join(``),...e)}createChildLogger(t){return new e({namespaces:[...this.namespaces,Lt(t)]})}};function Lt(e){if(typeof e!=`string`||!e.trim())throw Error(`Namespace must be a non-empty string.`);return e}var $=new It({namespace:`MAIN:TELEGRAM_WEB_K`});if(yt(window.location)===K.TELEGRAM_WEB_K){let e=new d({context:new Ft({globalObject:window,location:window.location,logger:$}),features:[_t]});window.addEventListener(`message`,({source:t,data:n})=>{t===window&&e.dispatch(n)}),$.log(`Toolfox Telegram Web K runtime ready.`)}else $.log(`Telegram Web K MAIN entry loaded on an unsupported page.`)})();