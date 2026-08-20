(function(){var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,o)=>(o=n==null?{}:e(i(n)),c(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n)),u=new Set([1,2]),d=Object.freeze([`completed`,`completed_with_failures`,`cancelled`,`interrupted`]),f=Object.freeze([`requested`,`eligible`,`attempted`,`successful`,`noOp`,`skipped`,`failed`,`notAttempted`]),p=new Set([`requestAttempts`]),m=new Set([`correlationId`,`operationName`,`controller`,`method`,`projectName`,`requestId`,`attemptNumber`,`startedAt`,`completedAt`,`durationMs`,`outcome`,`transportCode`,`serverErrorCode`,`serverErrorMessage`,`requestSummary`,`responseSummary`]),h=new Set([`success`,`failure`,`timeout`,`cancelled`,`retry`]);function g(e,t=``){let n=TypeError(t?`${e} (${t})`:e);return n.code=`INVALID_EXECUTION_RECORD`,n.path=t,n}function _(e,t){if(!e||typeof e!=`object`||Array.isArray(e))throw g(`Expected an object`,t);let n=Object.getPrototypeOf(e);if(n!==Object.prototype&&n!==null)throw g(`Expected a plain object`,t)}function v(e,t){let n=e instanceof Date?e:new Date(e);if(Number.isNaN(n.getTime()))throw g(`Expected a valid timestamp`,t);return n.toISOString()}function y(e,t,n=160){let r=String(e??``).trim();if(!r)throw g(`Expected a non-empty string`,t);if(r.length>n)throw g(`String exceeds ${n} characters`,t);return r}function b(e,t,n=500){if(e==null||e===``)return null;let r=String(e).trim();if(r.length>n)throw g(`String exceeds ${n} characters`,t);return r||null}function x(e,t){let n=Number(e??0);if(!Number.isSafeInteger(n)||n<0)throw g(`Expected a non-negative safe integer`,t);return n}function S(e,t,n){for(let r of Object.keys(e))if(!t.has(r))throw g(`Unexpected field is not allowed`,`${n}.${r}`)}function C(e,t,{minimum:n=0}={}){let r=Number(e);if(!Number.isSafeInteger(r)||r<n)throw g(`Expected a safe integer`,t);return r}function w(e,t,n){let r=`results[${n}].diagnostics.requestAttempts[${t}]`;_(e,r),S(e,m,r);let i=v(e.startedAt,`${r}.startedAt`),a=e.completedAt==null?null:v(e.completedAt,`${r}.completedAt`);if(a&&new Date(a)<new Date(i))throw g(`Completion timestamp cannot precede start timestamp`,`${r}.completedAt`);let o=y(e.outcome,`${r}.outcome`,40);if(!h.has(o))throw g(`Unsupported diagnostic outcome`,`${r}.outcome`);let s={correlationId:y(e.correlationId,`${r}.correlationId`,160),operationName:y(e.operationName,`${r}.operationName`,160),controller:b(e.controller,`${r}.controller`,160),method:y(e.method,`${r}.method`,20).toUpperCase(),projectName:b(e.projectName,`${r}.projectName`,240),requestId:b(e.requestId,`${r}.requestId`,160),attemptNumber:C(e.attemptNumber,`${r}.attemptNumber`,{minimum:1}),startedAt:i,completedAt:a,durationMs:e.durationMs==null?null:C(e.durationMs,`${r}.durationMs`),outcome:o,transportCode:b(e.transportCode,`${r}.transportCode`,120),serverErrorCode:b(e.serverErrorCode,`${r}.serverErrorCode`,120),serverErrorMessage:e.serverErrorMessage==null?null:String(e.serverErrorMessage),requestSummary:E(e.requestSummary??null,`${r}.requestSummary`),responseSummary:E(e.responseSummary??null,`${r}.responseSummary`)};return Object.freeze(s)}function T(e,t){let n=`results[${t}].diagnostics`;if(_(e,n),S(e,p,n),!Array.isArray(e.requestAttempts))throw g(`Expected an array`,`${n}.requestAttempts`);return Object.freeze({requestAttempts:Object.freeze(e.requestAttempts.map((e,n)=>w(e,n,t)))})}function E(e,t=`value`,n=new WeakSet){if(e===null||typeof e==`string`||typeof e==`boolean`)return e;if(typeof e==`number`){if(!Number.isFinite(e))throw g(`Expected a finite number`,t);return e}if(e===void 0)return null;if(typeof e==`bigint`||typeof e==`function`||typeof e==`symbol`)throw g(`Unsupported JSON value`,t);if(typeof e!=`object`)throw g(`Unsupported value`,t);if(n.has(e))throw g(`Circular values are not supported`,t);n.add(e);try{if(Array.isArray(e))return e.map((e,r)=>E(e,`${t}[${r}]`,n));_(e,t);let r={};for(let[i,a]of Object.entries(e))r[i]=E(a,`${t}.${i}`,n);return r}finally{n.delete(e)}}function D(e={}){_(e,`pageContext`);let t=e.marathonId===void 0||e.marathonId===null||e.marathonId===``?null:String(e.marathonId).trim();return Object.freeze({marathonId:t||null,marathonName:b(e.marathonName,`pageContext.marathonName`,240)})}function O(e={}){_(e,`counts`);let t={};for(let n of f)t[n]=x(e[n],`counts.${n}`);if(t.successful+t.failed>t.attempted)throw g(`Successful and failed counts cannot exceed attempted count`,`counts`);if(t.attempted+t.notAttempted>t.eligible)throw g(`Attempted and not-attempted counts cannot exceed eligible count`,`counts`);return Object.freeze(t)}function k(e,t){_(e,`results[${t}]`);let n=e.attempts===void 0?1:x(e.attempts,`results[${t}].attempts`),r=e.data===void 0?{}:E(e.data,`results[${t}].data`),i={order:t,itemId:b(e.itemId,`results[${t}].itemId`,160),label:y(e.label??e.itemId??`Item ${t+1}`,`results[${t}].label`,500),status:y(e.status,`results[${t}].status`,80),code:y(e.code,`results[${t}].code`,120),message:y(e.message,`results[${t}].message`,1e3),attempts:n,data:Object.freeze(r)};return e.diagnostics!==void 0&&(i.diagnostics=T(e.diagnostics,t)),Object.freeze(i)}function A(e){return{...e,results:Array.isArray(e.results)?e.results.map(({diagnostics:e,...t})=>t):e.results}}function j(e,t){let n=Math.random().toString(36).slice(2,10);return`${t}-${e.getTime().toString(36)}-${n}`}function M(e,t={}){_(e,`record`),E(A(e),`record`);let n=t.now instanceof Date?t.now:new Date(t.now||Date.now()),r=y(e.operationType,`operationType`,120),i=t.cryptoApi,a=typeof i?.randomUUID==`function`?i.randomUUID():j(n,r),o=y(e.id||a,`id`,200),s=y(e.status,`status`,80);if(!d.includes(s))throw g(`Unsupported terminal status`,`status`);let c=v(e.startedAt,`startedAt`),l=v(e.completedAt??n,`completedAt`);if(new Date(l).getTime()<new Date(c).getTime())throw g(`Completion timestamp cannot precede start timestamp`,`completedAt`);let u=Array.isArray(e.results)?e.results.map(k):(()=>{throw g(`Expected an array`,`results`)})(),f={schemaVersion:2,id:o,operationType:r,startedAt:c,completedAt:l,status:s,pageContext:D(e.pageContext||{}),counts:O(e.counts||{}),results:Object.freeze(u),message:b(e.message,`message`,1e3)};return N(f),Object.freeze(f)}function N(e){if(_(e,`record`),!u.has(e.schemaVersion))throw g(`Unsupported execution record schema version`,`schemaVersion`);if(y(e.id,`id`,200),y(e.operationType,`operationType`,120),v(e.startedAt,`startedAt`),v(e.completedAt,`completedAt`),!d.includes(e.status))throw g(`Unsupported terminal status`,`status`);if(D(e.pageContext||{}),O(e.counts||{}),!Array.isArray(e.results))throw g(`Expected an array`,`results`);return e.results.forEach((e,t)=>k(e,t)),E(A(e),`record`),!0}function P(e){return N(e),JSON.parse(JSON.stringify(e))}function F(e){return`${JSON.stringify(P(e),null,2)}\n`}function I(e){if(!Array.isArray(e))throw TypeError(`Records must be an array`);let t=e.map(P);return`${JSON.stringify(t,null,2)}\n`}function L(e){return String(e||`operation`).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-|-$/g,``)||`operation`}function R(e){return new Date(e).toISOString().replace(/[-:]/g,``).replace(/\.\d{3}Z$/,`Z`)}function z(e){return N(e),`edvibe-${L(e.operationType)}-${R(e.completedAt)}-${L(e.id).slice(-36)}.json`}function B(e=new Date){return`edvibe-execution-history-${R(e)}.json`}function ee(e={}){let t=e.document||globalThis.document,n=e.URL||globalThis.URL,r=e.Blob||globalThis.Blob;return!t?.createElement||!n?.createObjectURL||!r?Object.freeze({download(){throw Error(`Browser download APIs are unavailable`)}}):Object.freeze({download({filename:e,json:i}){let a=new r([i],{type:`application/json;charset=utf-8`}),o=n.createObjectURL(a),s=t.createElement(`a`);s.href=o,s.download=e,s.hidden=!0,(t.body||t.documentElement).append(s);try{s.click()}finally{s.remove(),n.revokeObjectURL(o)}}})}var te=s({IndexedDbError:()=>V,createIndexedDb:()=>le,requestToPromise:()=>U,transactionToPromise:()=>re}),V=class extends Error{constructor(e,t={},n){super(e,n===void 0?void 0:{cause:n}),this.name=`IndexedDbError`,this.context=Object.freeze({...t}),n!==void 0&&this.cause===void 0&&(this.cause=n)}};function ne(e,t){let n=[t.database&&`database=${t.database}`,t.stores&&`stores=${t.stores.join(`,`)}`,t.store&&`store=${t.store}`,t.index&&`index=${t.index}`,t.mode&&`mode=${t.mode}`,t.operation&&`operation=${t.operation}`,t.version&&`version=${t.version}`].filter(Boolean).join(` `);return n?`${e} (${n})`:e}function H(e,t,n){return n instanceof V?n:new V(ne(e,t),t,n)}function U(e,t={}){return new Promise((n,r)=>{e.onsuccess=()=>n(e.result),e.onerror=()=>r(H(`IndexedDB request failed`,t,e.error))})}function re(e,t={}){return new Promise((n,r)=>{e.oncomplete=()=>n(),e.onerror=()=>r(H(`IndexedDB transaction failed`,t,e.error)),e.onabort=()=>r(H(`IndexedDB transaction aborted`,t,e.error))})}function ie(e){let t=typeof e==`string`?[e]:Array.from(e||[]);if(t.length===0)throw TypeError(`At least one object store is required`);return t}function ae(e){let t=Array.from(e.migrations||[]).sort((e,t)=>e.version-t.version),n=new Set;for(let r of t){if(!Number.isInteger(r.version)||r.version<1||r.version>e.version)throw TypeError(`Invalid migration version: ${r.version}`);if(n.has(r.version))throw TypeError(`Duplicate migration version: ${r.version}`);if(typeof r.migrate!=`function`)throw TypeError(`Migration ${r.version} must define migrate()`);n.add(r.version)}return t}function oe(e,t,n){let{range:r=null,direction:i=`next`,limit:a=1/0,keysOnly:o=!1,map:s=null}=t||{};if(!Number.isFinite(a)&&a!==1/0)throw TypeError(`Cursor limit must be a finite number or Infinity`);if(a<0)throw RangeError(`Cursor limit cannot be negative`);return a===0?Promise.resolve([]):new Promise((t,c)=>{let l=[],u;try{u=o?e.openKeyCursor(r,i):e.openCursor(r,i)}catch(e){c(H(`Failed to open IndexedDB cursor`,n,e));return}u.onerror=()=>c(H(`IndexedDB cursor failed`,n,u.error)),u.onsuccess=()=>{let e=u.result;if(!e||l.length>=a){t(l);return}let n=o?e.primaryKey:e.value;l.push(typeof s==`function`?s(n,e):n),e.continue()}})}function se(e,t){return{raw:e,get(n){return U(e.get(n),{...t,operation:`get`})},getKey(n){return U(e.getKey(n),{...t,operation:`getKey`})},getAll(n=null,r){return U(e.getAll(n,r),{...t,operation:`getAll`})},getAllKeys(n=null,r){return U(e.getAllKeys(n,r),{...t,operation:`getAllKeys`})},count(n=null){return U(e.count(n),{...t,operation:`count`})},iterate(n={}){return oe(e,n,{...t,operation:`iterate`})}}}function ce(e,t){return{...se(e,t),put(n,r){return U(e.put(n,r),{...t,operation:`put`})},add(n,r){return U(e.add(n,r),{...t,operation:`add`})},delete(n){return U(e.delete(n),{...t,operation:`delete`})},clear(){return U(e.clear(),{...t,operation:`clear`})},index(n){return se(e.index(n),{...t,index:n})}}}function le(e,t={}){if(!e||typeof e.name!=`string`||e.name.length===0)throw TypeError(`Database definition requires a non-empty name`);if(!Number.isInteger(e.version)||e.version<1)throw TypeError(`Database definition requires a positive integer version`);let n=t.indexedDB||globalThis.indexedDB;if(!n||typeof n.open!=`function`)throw TypeError(`An IndexedDB factory is required`);let r=ae(e),i=null,a=null;function o(e){i===e&&(i=null),a=null}function s(){return i?Promise.resolve(i):a||(a=new Promise((s,c)=>{let l,u=!1,d=null;try{l=n.open(e.name,e.version)}catch(t){c(H(`Failed to open IndexedDB database`,{database:e.name,version:e.version},t));return}let f=e=>{u||(u=!0,d!==null&&clearTimeout(d),a=null,c(e))};l.onblocked=()=>{let n={database:e.name,version:e.version,operation:`open`},r=H(`IndexedDB upgrade is blocked by another open connection`,n,l.error);typeof t.onBlocked==`function`&&t.onBlocked(r,n),t.blockedTimeoutMs>0&&d===null&&(d=setTimeout(()=>f(r),t.blockedTimeoutMs))},l.onupgradeneeded=t=>{let n=l.result,i=l.transaction;try{for(let e of r)e.version>t.oldVersion&&e.version<=t.newVersion&&e.migrate({db:n,transaction:i,oldVersion:t.oldVersion,newVersion:t.newVersion,version:e.version})}catch(n){try{i.abort()}catch{}f(H(`IndexedDB migration failed`,{database:e.name,version:t.newVersion,operation:`migrate`},n))}},l.onerror=()=>f(H(`Failed to open IndexedDB database`,{database:e.name,version:e.version,operation:`open`},l.error)),l.onsuccess=()=>{let n=l.result;if(u){n.close();return}u=!0,d!==null&&clearTimeout(d),i=n,a=null,n.onversionchange=()=>{n.close(),o(n),typeof t.onVersionChange==`function`&&t.onVersionChange({database:e.name,version:n.version})},s(n)}}),a)}async function c(t,n,r,i=`transaction`){let a=ie(t);if(n!==`readonly`&&n!==`readwrite`)throw TypeError(`Unsupported transaction mode: ${n}`);if(typeof r!=`function`)throw TypeError(`Transaction callback must be a function`);let o=await s(),c={database:e.name,stores:a,mode:n,operation:i},l;try{l=o.transaction(a,n)}catch(e){throw H(`Failed to create IndexedDB transaction`,c,e)}let u=re(l,c),d=Object.create(null);for(let e of a)d[e]=ce(l.objectStore(e),{...c,store:e});let f;try{f=r({transaction:l,stores:d,store(e){if(!d[e])throw new V(ne(`Store is not part of this transaction`,{...c,store:e}),{...c,store:e});return d[e]},abort(e){if(e!==void 0&&l.error===null)try{Object.defineProperty(l,"__edvibeAbortReason",{value:e})}catch{}l.abort()}})}catch(e){try{l.abort()}catch{}try{await u}catch{}throw H(`IndexedDB transaction callback failed`,c,e)}try{let[e]=await Promise.all([Promise.resolve(f),u]);return e}catch(e){throw H(`IndexedDB transaction did not commit`,c,l.__edvibeAbortReason||e)}}function l(e){return{get(t){return c(e,`readonly`,({store:n})=>n(e).get(t),`get:${e}`)},put(t,n){return c(e,`readwrite`,({store:r})=>r(e).put(t,n),`put:${e}`)},add(t,n){return c(e,`readwrite`,({store:r})=>r(e).add(t,n),`add:${e}`)},delete(t){return c(e,`readwrite`,({store:n})=>n(e).delete(t),`delete:${e}`)},clear(){return c(e,`readwrite`,({store:t})=>t(e).clear(),`clear:${e}`)},count(t=null){return c(e,`readonly`,({store:n})=>n(e).count(t),`count:${e}`)},iterate(t={}){return c(e,`readonly`,({store:n})=>n(e).iterate(t),`iterate:${e}`)},queryIndex(t,n={}){return c(e,`readonly`,({store:r})=>r(e).index(t).iterate(n),`query-index:${e}.${t}`)},newest(e,t={}){return this.queryIndex(e,{...t,direction:`prev`})}}}function u(){if(i){let e=i;i=null,e.close()}a=null}return Object.freeze({name:e.name,version:e.version,open:s,close:u,reset:u,transaction:c,readonly(e,t,n){return c(e,`readonly`,t,n)},readwrite(e,t,n){return c(e,`readwrite`,t,n)},repository:l})}var ue=`edvibe-toolbox`,de=`executionHistory`,fe=Object.freeze({name:ue,version:1,migrations:Object.freeze([Object.freeze({version:1,migrate({db:e}){if(e.objectStoreNames.contains(`executionHistory`))return;let t=e.createObjectStore(de,{keyPath:`id`});t.createIndex(`completedAt`,`completedAt`,{unique:!1}),t.createIndex(`operationType`,`operationType`,{unique:!1}),t.createIndex(`status`,`status`,{unique:!1}),t.createIndex(`marathonId`,`pageContext.marathonId`,{unique:!1})}})])});function pe(e,t,n=!1){if(!e)return null;let r=String(e),i=/^\d{4}-\d{2}-\d{2}$/.test(r)?new Date(`${r}T${n?`23:59:59.999`:`00:00:00.000`}`):new Date(e);if(Number.isNaN(i.getTime()))throw TypeError(`Invalid ${t}`);return i.getTime()}function me(e,t={}){if(t.operationType&&e.operationType!==t.operationType||t.status&&e.status!==t.status||t.marathonId&&String(e.pageContext?.marathonId||``)!==String(t.marathonId))return!1;let n=new Date(e.completedAt).getTime(),r=pe(t.from,`from`),i=pe(t.to,`to`,!0);return!(r!==null&&n<r||i!==null&&n>i)}function he(e={}){let t=e.indexedDbApi||te;if(!t?.createIndexedDb)throw TypeError(`IndexedDB API is required`);let n=t.createIndexedDb(fe,{indexedDB:e.indexedDB}),r=n.repository(de);return Object.freeze({async persist(e){return N(e),await r.put(e),P(e)},async get(e){let t=await r.get(String(e));return t?P(t):null},async list(e={}){return(await r.newest(`completedAt`)).filter(t=>me(t,e)).map(P)},async delete(e){await r.delete(String(e))},async clear(){await r.clear()},count(){return r.count()},close(){n.close()}})}var ge={START_EXPORT:`START_FULL_AUTOMATION`,OPEN_LESSON_RESET:`OPEN_LESSON_RESET`,OPEN_ACTION_RECORDER:`OPEN_ACTION_RECORDER`,OPEN_BATCH_LESSON_ACCESS:`OPEN_BATCH_LESSON_ACCESS`,OPEN_BATCH_USER_ONBOARDING:`OPEN_BATCH_USER_ONBOARDING`,OPEN_BATCH_USER_MANAGEMENT:`OPEN_BATCH_USER_MANAGEMENT`,OPEN_BATCH_SECTION_CREATION:`OPEN_BATCH_SECTION_CREATION`,OPEN_BATCH_SECTION_DELETION:`OPEN_BATCH_SECTION_DELETION`,OPEN_VIDEO_ATTACHMENT:`OPEN_VIDEO_ATTACHMENT`,OPEN_EXECUTION_HISTORY:`OPEN_EXECUTION_HISTORY`},W={START_EXPORT:`EDVIBE_TOOLBOX_START_ALL`,OPEN_LESSON_RESET:`EDVIBE_TOOLBOX_OPEN_RESET`,OPEN_ACTION_RECORDER:`EDVIBE_TOOLBOX_OPEN_RECORDER`,OPEN_BATCH_LESSON_ACCESS:`EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS`,OPEN_BATCH_USER_ONBOARDING:`EDVIBE_TOOLBOX_OPEN_BATCH_USER_ONBOARDING`,OPEN_BATCH_USER_MANAGEMENT:`EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT`,OPEN_BATCH_SECTION_CREATION:`EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION`,OPEN_BATCH_SECTION_DELETION:`EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_DELETION`,OPEN_VIDEO_ATTACHMENT:`EDVIBE_TOOLBOX_OPEN_VIDEO_ATTACHMENT`,OPEN_EXECUTION_HISTORY:`EDVIBE_TOOLBOX_OPEN_EXECUTION_HISTORY`,EXPORT_STATUS:`EDVIBE_TOOLBOX_EXPORT_STATUS`,STORAGE_REQUEST:`EDVIBE_TOOLBOX_STORAGE_REQUEST`,STORAGE_RESPONSE:`EDVIBE_TOOLBOX_STORAGE_RESPONSE`},_e={STARTED:`started`,COMPLETE:`complete`,ERROR:`error`},ve={GET:`get`,SET:`set`},ye={EXECUTION_HISTORY_PREFERENCES:`executionHistoryPreferences`},be={[ge.START_EXPORT]:{type:W.START_EXPORT,info:`Automation sequence channeled to page engine.`},[ge.OPEN_LESSON_RESET]:{type:W.OPEN_LESSON_RESET,info:`Lesson reset workflow opened.`},[ge.OPEN_ACTION_RECORDER]:{type:W.OPEN_ACTION_RECORDER,info:`Action recorder opened.`},[ge.OPEN_BATCH_LESSON_ACCESS]:{type:W.OPEN_BATCH_LESSON_ACCESS,info:`Batch lesson access opened.`},[ge.OPEN_BATCH_USER_ONBOARDING]:{type:W.OPEN_BATCH_USER_ONBOARDING,info:`Batch user onboarding opened.`},[ge.OPEN_BATCH_USER_MANAGEMENT]:{type:W.OPEN_BATCH_USER_MANAGEMENT,info:`Batch user management opened.`},[ge.OPEN_BATCH_SECTION_CREATION]:{type:W.OPEN_BATCH_SECTION_CREATION,info:`Batch section creation opened.`},[ge.OPEN_BATCH_SECTION_DELETION]:{type:W.OPEN_BATCH_SECTION_DELETION,info:`Batch section deletion opened.`},[ge.OPEN_VIDEO_ATTACHMENT]:{type:W.OPEN_VIDEO_ATTACHMENT,info:`YouTube video attachment opened.`},[ge.OPEN_EXECUTION_HISTORY]:{type:W.OPEN_EXECUTION_HISTORY,info:`Execution history opened.`}},xe=new Set(Object.values(be).map(({type:e})=>e)),Se=new Set(Object.values(_e)),Ce=new Set(Object.values(ve)),we=new Set(Object.values(ye));function Te(e){return new Promise(t=>setTimeout(t,e))}function Ee(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function De(e,t){return Object.keys(e).every(e=>t.has(e))}function Oe(e){return typeof e==`string`&&e.length>0}function ke(e){return e==null||!Ee(e)||!xe.has(e.type)?!1:e.type===W.OPEN_EXECUTION_HISTORY?De(e,new Set([`type`,`executionId`]))&&(e.executionId===void 0||e.executionId===null||Oe(e.executionId)):De(e,new Set([`type`]))}function Ae(e,t=``){if(!Se.has(e))throw TypeError(`Unsupported export state: ${String(e)}`);if(typeof t!=`string`)throw TypeError(`Export status message must be a string`);return Object.freeze({type:W.EXPORT_STATUS,state:e,message:t})}function je({requestId:e,action:t,key:n,value:r}){let i={type:W.STORAGE_REQUEST,requestId:e,action:t,key:n};if(t===ve.SET&&(i.value=r),!Me(i))throw TypeError(`Invalid storage request`);return Object.freeze(i)}function Me(e){return!Ee(e)||e.type!==W.STORAGE_REQUEST||!Oe(e.requestId)||!Ce.has(e.action)||!we.has(e.key)||!De(e,new Set([`type`,`requestId`,`action`,`key`,`value`]))?!1:e.action===ve.GET?!Object.prototype.hasOwnProperty.call(e,`value`):Object.prototype.hasOwnProperty.call(e,`value`)&&e.value!==void 0}function Ne(e){return!Ee(e)||e.type!==W.STORAGE_RESPONSE||!Oe(e.requestId)||typeof e.ok!=`boolean`||!De(e,new Set([`type`,`requestId`,`ok`,`value`,`error`]))?!1:e.ok?!Object.prototype.hasOwnProperty.call(e,`error`):Oe(e.error)&&!Object.prototype.hasOwnProperty.call(e,`value`)}W.STORAGE_REQUEST,W.STORAGE_RESPONSE;function Pe(e={}){let t=e.window||globalThis.window,n=e.cryptoApi||globalThis.crypto,r=e.timeoutMs||5e3;if(!t?.postMessage||!t?.addEventListener)throw TypeError(`Window messaging APIs are required`);let i=new Map,a=e=>{if(e.source!==t||!Ne(e.data))return;let n=i.get(e.data.requestId);n&&(i.delete(e.data.requestId),clearTimeout(n.timer),e.data.ok?n.resolve(e.data.value):n.reject(Error(e.data.error||`Storage request failed`)))};t.addEventListener(`message`,a);function o(e,a,o){let s=typeof n?.randomUUID==`function`?n.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`,c;try{c=je({requestId:s,action:e,key:a,value:o})}catch(e){return Promise.reject(e)}return new Promise((e,n)=>{let a=setTimeout(()=>{i.delete(s),n(Error(`Storage request timed out`))},r);i.set(s,{resolve:e,reject:n,timer:a}),t.postMessage(c,`*`)})}return Object.freeze({get(e){return o(ve.GET,e)},set(e,t){return o(ve.SET,e,t)},dispose(){t.removeEventListener(`message`,a);for(let e of i.values())clearTimeout(e.timer),e.reject(Error(`Storage bridge disposed`));i.clear()}})}var Fe=`executionHistoryPreferences`,Ie=Object.freeze({mode:`limits`,maxCount:100,maxAgeDays:90,autoExport:!1});function Le(e,t,n){let r=Number(e);if(!Number.isSafeInteger(r)||r<=0){if(e==null||e===``)return t;throw TypeError(`${n} must be a positive integer`)}return r}function Re(e={}){let t=e.mode===`indefinite`?`indefinite`:`limits`;return Object.freeze({mode:t,maxCount:Le(e.maxCount,Ie.maxCount,`maxCount`),maxAgeDays:Le(e.maxAgeDays,Ie.maxAgeDays,`maxAgeDays`),autoExport:!!e.autoExport})}function ze(){let e=Pe({window,cryptoApi:window.crypto});if(!e||typeof e.get!=`function`||typeof e.set!=`function`)throw TypeError(`A storage adapter with get() and set() is required`);return Object.freeze({async get(){return Re(await e.get(`executionHistoryPreferences`)||{})},async set(t){let n=Re(t);return await e.set(Fe,n),n}})}async function Be({repository:e,preferences:t,now:n=new Date,protectedExecutionId:r=null}){let i=Re(t);if(i.mode===`indefinite`)return Object.freeze({deletedIds:Object.freeze([])});let a=await e.list(),o=n.getTime()-i.maxAgeDays*24*60*60*1e3,s=new Set;a.forEach((e,t)=>{e.id!==r&&(t>=i.maxCount||new Date(e.completedAt).getTime()<o)&&s.add(e.id)});for(let t of s)await e.delete(t);return Object.freeze({deletedIds:Object.freeze([...s])})}function Ve(e){let{repository:t,preferenceStore:n,downloader:r}=e||{};if(!t||!n||!r)throw TypeError(`Repository, preference store, and downloader are required`);let i=e.cryptoApi,a=typeof e.now==`function`?e.now:()=>new Date;async function o(e){let r=M(e,{cryptoApi:i,now:a()});try{await t.persist(r)}catch(e){return Object.freeze({stored:!1,record:r,persistenceError:e,retentionError:null,exportError:null})}let o,c=null,l=null;try{o=await n.get(),await Be({repository:t,preferences:o,now:a(),protectedExecutionId:r.id})}catch(e){c=e,o||=Ie}if(o.autoExport)try{s(r)}catch(e){l=e}return Object.freeze({stored:!0,record:r,persistenceError:null,retentionError:c,exportError:l})}function s(e){r.download({filename:z(e),json:F(e)})}return Object.freeze({persistTerminal:o,get:e=>t.get(e),list:e=>t.list(e),delete:e=>t.delete(e),clear:()=>t.clear(),getPreferences:()=>n.get(),setPreferences:e=>n.set(e),exportRecord:async e=>{let n=await t.get(e);if(!n)throw Error(`Execution record was not found`);return s(n),n},exportFiltered:async(e={})=>{let n=await t.list(e);return r.download({filename:B(a()),json:I(n)}),n}})}function He(){return Ve({repository:he({indexedDbApi:te,indexedDB:window.indexedDB}),preferenceStore:ze(),downloader:ee({document,URL:window.URL,Blob:window.Blob}),cryptoApi:window.crypto})}var Ue=class{constructor(){this.activeOperation=null,this.canStart=this.canStart.bind(this),this.activate=this.activate.bind(this),this.release=this.release.bind(this),this.guardedActiveChange=this.guardedActiveChange.bind(this)}canStart(){return this.activeOperation===null}activate(e){return this.activeOperation===null&&(this.activeOperation=e,!0)}release(e){return this.activeOperation===e&&(this.activeOperation=null,!0)}guardedActiveChange(e){return t=>{t?this.activate(e):this.release(e)}}},We=15e3;function Ge(e,t,n={}){let r=Error(t);r.code=e;for(let e of[`controller`,`method`,`requestId`,`serverErrorCode`,`diagnostics`,`cause`])n[e]!==void 0&&(r[e]=n[e]);return r}function Ke(e){if(typeof e!=`string`)return null;try{let t=JSON.parse(e);return t&&typeof t==`object`&&!Array.isArray(t)?t:null}catch{return null}}function qe(e){let t=Ke(e);return!t||t.RequestId===void 0||t.RequestId===null?!1:typeof t.Controller==`string`&&typeof t.Method==`string`&&typeof t.ProjectName==`string`}function Je({WebSocketClass:e=window.WebSocket,cryptoApi:t=window.crypto,requestTimeoutMs:n=We,setTimeoutFn:r=setTimeout,clearTimeoutFn:i=clearTimeout,now:a=Date.now,logger:o}){let s=o.createChildLogger(`Transport`),c=null,l=0,u=1,d=new WeakSet,f=new Map,p=new WeakMap,m=new Set;function h(e){return typeof e==`string`?typeof TextEncoder<`u`?new TextEncoder().encode(e).byteLength:unescape(encodeURIComponent(e)).length:typeof Blob<`u`&&e instanceof Blob?e.size:typeof ArrayBuffer<`u`&&(e instanceof ArrayBuffer||ArrayBuffer.isView(e))?e.byteLength:null}function g(e){return typeof e==`string`?`text`:typeof Blob<`u`&&e instanceof Blob?`blob`:typeof ArrayBuffer<`u`&&(e instanceof ArrayBuffer||ArrayBuffer.isView(e))?`array-buffer`:`other`}function _({direction:e,socketId:t,data:n,origin:r}){if(m.size===0)return;let i=g(n),o={direction:e,socketId:t,capturedAt:a(),dataType:i,byteLength:h(n),origin:r};i===`text`&&(o.data=n);for(let e of[...m])try{e(o)}catch(e){s.log(`Frame observer failed:`,e)}}function v(e){if(typeof e!=`function`)throw TypeError(`Frame observer must be a function.`);return m.add(e),()=>m.delete(e)}function y(e,n,r,i){return{Controller:e,Method:n,ProjectName:r,RequestId:t.randomUUID(),Value:JSON.stringify(i)}}function b(e,t,n){return{controller:e.Controller,method:e.Method,projectName:e.ProjectName,requestId:e.RequestId,startedAt:t,value:n}}function x(e){return e?.Message??e?.ErrorMessage??e?.Error?.Message??e?.Error?.message}function S(t){t.socketId<l||(l=t.socketId,t.socket.readyState===e.OPEN&&(c?.socket!==t.socket&&s.log(`Edvibe WebSocket selected: #${t.socketId}`),c=t))}function C(e,t){qe(t)&&S(e)}function w(e,t){let n=null;if(typeof e.data==`string`)try{n=JSON.parse(e.data)}catch{}let r=n?.RequestId?f.get(n.RequestId):null,o=!!(r&&r.socketId===t.socketId);if(_({direction:`inbound`,socketId:t.socketId,data:e.data,origin:o?`toolbox`:`page`}),typeof e.data==`string`)try{if(!n||!r||r.socketId!==t.socketId)return;f.delete(n.RequestId),i(r.timeoutId);let e=a()-r.startedAt,o={requestId:n.RequestId,success:n.IsSuccess===!0,errorCode:typeof n.ErrorCode==`string`||typeof n.ErrorCode==`number`?n.ErrorCode:null,className:typeof n.Class==`string`?n.Class:null,method:typeof n.Method==`string`?n.Method:null,elapsedMs:e};n.IsSuccess===!0?o.value=n.Value:o.serverMessage=x(n);let c={request:r.diagnostics,response:o},l=n.IsSuccess===!0?`success`:`failed (${n.ErrorCode})`;if(s.log(`← ${r.controller}.${r.method} [${n.RequestId}] ${l} in ${e}ms`),n.IsSuccess!==!0){r.reject(Ge(`SERVER_REJECTED`,`${o.className||`Edvibe`}:${o.method||`request`} failed with ErrorCode ${o.errorCode??`unknown`}`,{controller:r.controller,method:r.method,requestId:n.RequestId,serverErrorCode:o.errorCode,diagnostics:c}));return}p.set(n,c),r.resolve(n)}catch(e){s.log(`Failed parsing WebSocket frame:`,e)}}function T(e,t){s.log(`Intercepting WebSocket targeting:`,t);let n=e,r={socket:n,socketId:u};u+=1;let i=n.send;return n.send=function(e){let t=d.has(n)?`toolbox`:`page`;_({direction:`outbound`,socketId:r.socketId,data:e,origin:t});let a=i.call(n,e);return t===`page`&&C(r,e),a},n.addEventListener(`message`,e=>{w(e,r)}),n.addEventListener(`close`,()=>{c?.socket===n&&(c=null,s.log(`Edvibe WebSocket closed: #${r.socketId}`))}),n}let E=new Proxy(e,{construct(e,t,n){return T(Reflect.construct(e,t,n),t[0])}});function D(e){e.WebSocket=E}function O(t,n){if(!c||c.socket.readyState!==e.OPEN)throw Ge(`WS_UNAVAILABLE`,`Active Edvibe WebSocket connection is missing. Please reload the Edvibe tab context.`,{controller:t,method:n});return c}function k(){return{isOpen:!!(c&&c.socket.readyState===e.OPEN)}}function A(e,t,o,c){return new Promise((l,u)=>{let p;try{p=O(e,t)}catch(e){s.log(`No active Edvibe WebSocket connection.`),u(e);return}let m=y(e,t,o,c),h=a(),g=b(m,h,c),_=r(()=>{f.delete(m.RequestId),s.log(`✕ ${e}.${t} [${m.RequestId}] timed out after ${n}ms`),u(Ge(`REQUEST_TIMEOUT`,`${e}:${t} timed out after ${n}ms.`,{controller:e,method:t,requestId:m.RequestId,diagnostics:{request:g}}))},n);f.set(m.RequestId,{resolve:l,reject:u,timeoutId:_,controller:e,method:t,projectName:o,requestId:m.RequestId,socketId:p.socketId,startedAt:h,requestValue:g.value,diagnostics:g}),s.log(`→ ${e}.${t} [${m.RequestId}]`);try{d.add(p.socket);try{p.socket.send(JSON.stringify(m))}finally{d.delete(p.socket)}}catch(n){i(_),f.delete(m.RequestId),s.log(`✕ ${e}.${t} [${m.RequestId}] send failed: ${n.message}`),u(Ge(`SEND_FAILED`,n.message,{controller:e,method:t,requestId:m.RequestId,diagnostics:{request:g},cause:n}))}})}function j(e){return e&&typeof e==`object`?p.get(e):void 0}function M(e,t,n,r){let i=O(e,t),a=y(e,t,n,r);s.log(`→ ${e}.${t} [${a.RequestId}] (no response expected)`),d.add(i.socket);try{i.socket.send(JSON.stringify(a))}finally{d.delete(i.socket)}}return D(window),{install:D,sendRequest:A,sendWithoutResponse:M,subscribeFrames:v,getConnectionState:k,getResponseDiagnostics:j}}var Ye=class{constructor({logger:e,features:t}){this.features=new Map,this.operationGuard=new Ue,this.logger=e,this.transport=Je({logger:e}),this.executionHistoryService=He(),this.register=this.register.bind(this),this.dispatch=this.dispatch.bind(this),t.forEach(e=>this.register(e))}register({type:e,create:t}){if(typeof e!=`string`||typeof t!=`function`)throw TypeError(`Feature definition must provide a type and create function`);if(this.features.has(e))throw TypeError(`Feature "${e}" is already registered`);let n=t({transport:this.transport,operationGuard:this.operationGuard,executionHistoryService:this.executionHistoryService,logger:this.logger,dispatch:this.dispatch});if(typeof n!=`function`)throw TypeError(`Feature "${e}" must create a command handler`);this.features.set(e,n)}dispatch(e){if(!ke(e))return!1;let t=this.features.get(e.type);if(!t)return!1;try{Promise.resolve(t(e)).catch(t=>{this.logger.log(`Feature "${e.type}" failed:`,t)})}catch(t){this.logger.log(`Feature "${e.type}" failed:`,t)}return!0}},Xe=globalThis,Ze=Xe.ShadowRoot&&(Xe.ShadyCSS===void 0||Xe.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,Qe=Symbol(),$e=new WeakMap,et=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==Qe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(Ze&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=$e.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&$e.set(t,e))}return e}toString(){return this.cssText}},tt=e=>new et(typeof e==`string`?e:e+``,void 0,Qe),G=(e,...t)=>new et(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,Qe),nt=(e,t)=>{if(Ze)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let n of t){let t=document.createElement(`style`),r=Xe.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},rt=Ze?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return tt(t)})(e):e,{is:it,defineProperty:at,getOwnPropertyDescriptor:ot,getOwnPropertyNames:st,getOwnPropertySymbols:ct,getPrototypeOf:lt}=Object,ut=globalThis,dt=ut.trustedTypes,ft=dt?dt.emptyScript:``,pt=ut.reactiveElementPolyfillSupport,mt=(e,t)=>e,ht={toAttribute(e,t){switch(t){case Boolean:e=e?ft:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},gt=(e,t)=>!it(e,t),_t={attribute:!0,type:String,converter:ht,reflect:!1,useDefault:!1,hasChanged:gt};Symbol.metadata??=Symbol(`metadata`),ut.litPropertyMetadata??=new WeakMap;var vt=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_t){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&at(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=ot(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_t}static _$Ei(){if(this.hasOwnProperty(mt(`elementProperties`)))return;let e=lt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(mt(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(mt(`properties`))){let e=this.properties,t=[...st(e),...ct(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(rt(e))}else e!==void 0&&t.push(rt(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return nt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?ht:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?ht:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??gt)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};vt.elementStyles=[],vt.shadowRootOptions={mode:`open`},vt[mt(`elementProperties`)]=new Map,vt[mt(`finalized`)]=new Map,pt?.({ReactiveElement:vt}),(ut.reactiveElementVersions??=[]).push(`2.1.2`);var yt=globalThis,bt=e=>e,xt=yt.trustedTypes,St=xt?xt.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,Ct=`$lit$`,wt=`lit$${Math.random().toFixed(9).slice(2)}$`,Tt=`?`+wt,Et=`<${Tt}>`,Dt=document,Ot=()=>Dt.createComment(``),kt=e=>e===null||typeof e!=`object`&&typeof e!=`function`,At=Array.isArray,jt=e=>At(e)||typeof e?.[Symbol.iterator]==`function`,Mt=`[ 	
\f\r]`,Nt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pt=/-->/g,Ft=/>/g,It=RegExp(`>|${Mt}(?:([^\\s"'>=/]+)(${Mt}*=${Mt}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),Lt=/'/g,Rt=/"/g,zt=/^(?:script|style|textarea|title)$/i,K=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),Bt=Symbol.for(`lit-noChange`),q=Symbol.for(`lit-nothing`),Vt=new WeakMap,Ht=Dt.createTreeWalker(Dt,129);function Ut(e,t){if(!At(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return St===void 0?t:St.createHTML(t)}var Wt=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=Nt;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===Nt?c[1]===`!--`?o=Pt:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=It):(zt.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=It):o=Ft:o===It?c[0]===`>`?(o=i??Nt,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?It:c[3]===`"`?Rt:Lt):o===Rt||o===Lt?o=It:o===Pt||o===Ft?o=Nt:(o=It,i=void 0);let d=o===It&&e[t+1].startsWith(`/>`)?` `:``;a+=o===Nt?n+Et:l>=0?(r.push(s),n.slice(0,l)+Ct+n.slice(l)+wt+d):n+wt+(l===-2?t:d)}return[Ut(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Gt=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Wt(t,n);if(this.el=e.createElement(l,r),Ht.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=Ht.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(Ct)){let t=u[o++],n=i.getAttribute(e).split(wt),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Xt:r[1]===`?`?Zt:r[1]===`@`?Qt:Yt}),i.removeAttribute(e)}else e.startsWith(wt)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(zt.test(i.tagName)){let e=i.textContent.split(wt),t=e.length-1;if(t>0){i.textContent=xt?xt.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],Ot()),Ht.nextNode(),c.push({type:2,index:++a});i.append(e[t],Ot())}}}else if(i.nodeType===8){if(i.data===Tt)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(wt,e+1))!==-1;)c.push({type:7,index:a}),e+=wt.length-1}}a++}}static createElement(e,t){let n=Dt.createElement(`template`);return n.innerHTML=e,n}};function Kt(e,t,n=e,r){if(t===Bt)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=kt(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=Kt(e,i._$AS(e,t.values),i,r)),t}var qt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??Dt).importNode(t,!0);Ht.currentNode=r;let i=Ht.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new Jt(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new $t(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=Ht.nextNode(),a++)}return Ht.currentNode=Dt,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},Jt=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Kt(this,e,t),kt(e)?e===q||e==null||e===``?(this._$AH!==q&&this._$AR(),this._$AH=q):e!==this._$AH&&e!==Bt&&this._(e):e._$litType$===void 0?e.nodeType===void 0?jt(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==q&&kt(this._$AH)?this._$AA.nextSibling.data=e:this.T(Dt.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Gt.createElement(Ut(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new qt(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=Vt.get(e.strings);return t===void 0&&Vt.set(e.strings,t=new Gt(e)),t}k(t){At(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(Ot()),this.O(Ot()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=bt(e).nextSibling;bt(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Yt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=q}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=Kt(this,e,t,0),a=!kt(e)||e!==this._$AH&&e!==Bt,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=Kt(this,r[n+o],t,o),s===Bt&&(s=this._$AH[o]),a||=!kt(s)||s!==this._$AH[o],s===q?e=q:e!==q&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Xt=class extends Yt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===q?void 0:e}},Zt=class extends Yt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==q)}},Qt=class extends Yt{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=Kt(this,e,t,0)??q)===Bt)return;let n=this._$AH,r=e===q&&n!==q||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==q&&(n===q||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},$t=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){Kt(this,e)}},en=yt.litHtmlPolyfillSupport;en?.(Gt,Jt),(yt.litHtmlVersions??=[]).push(`3.3.3`);var tn=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new Jt(t.insertBefore(Ot(),e),e,void 0,n??{})}return i._$AI(e),i},nn=globalThis,J=class extends vt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=tn(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Bt}};J._$litElement$=!0,J.finalized=!0,nn.litElementHydrateSupport?.({LitElement:J});var rn=nn.litElementPolyfillSupport;rn?.({LitElement:J}),(nn.litElementVersions??=[]).push(`4.2.2`);var an=G`
    :host {
        color: var(--edvibe-text);
        font-size: 13px;
        line-height: 1.45;
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
        flex-direction: column;
        background: var(--edvibe-surface-app);
    }

    .recorder-header,
    .recorder-toolbar {
        display: flex;
        gap: 18px;
        justify-content: space-between;
        align-items: center;
        padding: 16px 18px;
        border-bottom: 1px solid var(--edvibe-border-subtle);
        background: var(--edvibe-surface);
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
        color: var(--edvibe-text-muted);
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
        width: 36px;
        height: 36px;
        padding: 0;
    }

    .recorder-toolbar {
        padding-block: 11px;
        background: var(--edvibe-surface-subtle);
    }

    .state-dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--edvibe-text-muted);
    }

    .recorder-state[data-status="recording"] .state-dot {
        background: var(--edvibe-danger);
        box-shadow: 0 0 0 4px var(--edvibe-danger-border);
    }

    .elapsed {
        min-width: 34px;
        color: var(--edvibe-text-muted);
        font-variant-numeric: tabular-nums;
    }

    .recorder-body {
        overflow: auto;
        padding: 16px 18px 20px;
    }

    .recorder-summary {
        margin: 13px 0;
        flex-wrap: wrap;
        color: var(--edvibe-text-muted);
    }

    .recorder-summary > span {
        padding-right: 10px;
        border-right: 1px solid var(--edvibe-border-subtle);
    }

    .recorder-summary label {
        margin-left: auto;
    }

    .recorder-notice {
        margin-bottom: 12px;
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
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
        box-shadow: var(--edvibe-shadow-card);
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
        color: var(--edvibe-text-muted);
        font-variant-numeric: tabular-nums;
    }

    .operation-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .operation-result {
        text-align: right;
        color: var(--edvibe-success);
    }

    .operation-result.is-error {
        color: var(--edvibe-danger);
    }

    .operation-content {
        padding: 0 12px 12px;
        border-top: 1px solid var(--edvibe-border-subtle);
    }

    .operation-content > p {
        color: var(--edvibe-text-muted);
        word-break: break-all;
    }

    .operation-content strong {
        display: block;
        margin: 10px 0 4px;
    }

    pre {
        width: 100%;
        overflow: auto;
        padding: 10px;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-control);
        color: var(--edvibe-text);
        background: var(--edvibe-surface-subtle);
        font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
        white-space: pre-wrap;
        word-break: break-word;
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
        color: var(--edvibe-text-muted);
        cursor: pointer;
    }

    .copy-fallback {
        margin-top: 14px;
        color: var(--edvibe-warning);
    }

    .copy-fallback textarea {
        min-height: 150px;
        margin-top: 5px;
        font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
        white-space: pre-wrap;
        word-break: break-word;
    }

    .recorder-indicator {
        position: fixed;
        z-index: var(--edvibe-z-dialog);
        right: 20px;
        bottom: 20px;
        display: flex;
        gap: 7px;
        align-items: center;
        padding: 9px 12px;
        border: 1px solid var(--edvibe-border);
        border-radius: var(--edvibe-radius-pill);
        color: var(--edvibe-text);
        background: var(--edvibe-surface);
        box-shadow: var(--edvibe-shadow-card);
        cursor: pointer;
    }

    .recorder-indicator > span:first-child {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--edvibe-text-muted);
    }

    .recorder-indicator.is-recording > span:first-child {
        background: var(--edvibe-danger);
        box-shadow: 0 0 0 3px var(--edvibe-danger-border);
    }

    @media (max-width: 720px) {
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
`,on=Object.freeze({"--edvibe-font-family":`"Segoe UI", Inter, Arial, system-ui, sans-serif`,"--edvibe-z-dialog":`2147483647`,"--edvibe-overlay":`rgba(15, 23, 42, 0.6)`,"--edvibe-surface":`#fff`,"--edvibe-surface-subtle":`#f8fafc`,"--edvibe-surface-app":`#f4f6fa`,"--edvibe-text":`#1f2937`,"--edvibe-text-strong":`#111827`,"--edvibe-text-muted":`#6b7280`,"--edvibe-border":`#d1d5db`,"--edvibe-border-subtle":`#e5e7eb`,"--edvibe-primary":`#2563eb`,"--edvibe-brand":`#4055d3`,"--edvibe-danger":`#b91c1c`,"--edvibe-danger-surface":`#fef2f2`,"--edvibe-danger-border":`#fecaca`,"--edvibe-warning":`#9a3412`,"--edvibe-warning-surface":`#fff7ed`,"--edvibe-warning-border":`#fed7aa`,"--edvibe-success":`#166534`,"--edvibe-success-surface":`#f0fdf4`,"--edvibe-success-border":`#bbf7d0`,"--edvibe-info":`#1e3a8a`,"--edvibe-info-surface":`#eff6ff`,"--edvibe-info-border":`#bfdbfe`,"--edvibe-focus-outline":`#2563eb`,"--edvibe-focus-halo":`rgba(37, 99, 235, 0.25)`,"--edvibe-radius-control":`8px`,"--edvibe-radius-panel":`10px`,"--edvibe-radius-dialog":`16px`,"--edvibe-radius-pill":`999px`,"--edvibe-shadow-card":`0 2px 7px rgba(30, 42, 70, 0.04)`,"--edvibe-shadow-dialog":`0 24px 80px rgba(15, 23, 42, 0.38)`});function sn(e=on){return Object.entries(e).map(([e,t])=>`${e}: ${t};`).join(`
`)}var cn=G`
    :host {
        ${tt(sn())}
        --edvibe-dialog-z-index: var(--edvibe-z-dialog);
        --edvibe-overlay-background: var(--edvibe-overlay);
        --edvibe-muted-text: var(--edvibe-text-muted);
        --edvibe-radius: var(--edvibe-radius-dialog);
    }

    button,
    input,
    textarea,
    select {
        font: inherit;
    }
`,ln=G`
    :host {
        font-family: var(--edvibe-font-family);
    }
`,un=G`
    [data-part="overlay"] {
        position: fixed;
        inset: 0;
        z-index: var(--edvibe-z-dialog);
        display: grid;
        place-items: center;
        padding: 16px;
        background: var(--edvibe-overlay);
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
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-dialog);
        color: var(--edvibe-text);
        background: var(--edvibe-surface);
        box-shadow: var(--edvibe-shadow-dialog);
    }

    @media (max-width: 640px) {
        [data-part="overlay"] { padding: 0; }
        [data-part="dialog"] {
            max-width: 100vw;
            max-height: 100vh;
            border-radius: 0;
        }
    }
`,dn=G`
    [data-control] {
        min-height: 36px;
        padding: 8px 12px;
        border: 1px solid var(--edvibe-primary);
        border-radius: var(--edvibe-radius-control);
        color: var(--edvibe-surface);
        background: var(--edvibe-primary);
        cursor: pointer;
        font: inherit;
        font-weight: 700;
    }

    [data-control="secondary"] {
        border-color: var(--edvibe-border);
        color: var(--edvibe-text);
        background: var(--edvibe-surface);
    }

    [data-control="danger"] {
        border-color: var(--edvibe-danger-border);
        color: var(--edvibe-danger);
        background: var(--edvibe-surface);
    }

    [data-control]:focus-visible,
    [data-field] :is(input, textarea, select):focus-visible {
        outline: 2px solid var(--edvibe-focus-outline);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px var(--edvibe-focus-halo);
    }

    [data-control]:disabled,
    [data-field] :is(input, textarea, select):disabled {
        color: var(--edvibe-text-muted);
        background: var(--edvibe-surface-subtle);
        cursor: default;
        opacity: .72;
    }

    [data-part="actions"] {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
    }
`,fn=G`
    [data-field] {
        display: grid;
        gap: 4px;
        color: var(--edvibe-text);
        font-size: 13px;
        font-weight: 650;
    }

    [data-field] :is(input, textarea, select) {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        padding: 9px 10px;
        border: 1px solid var(--edvibe-border);
        border-radius: var(--edvibe-radius-control);
        color: var(--edvibe-text);
        background: var(--edvibe-surface);
        font: inherit;
    }

    [data-part="help"] {
        color: var(--edvibe-text-muted);
        font-size: 11px;
        line-height: 1.4;
    }
`,pn=G`
    [data-notice] {
        padding: 10px 12px;
        border: 1px solid var(--edvibe-info-border);
        border-radius: var(--edvibe-radius-control);
        color: var(--edvibe-info);
        background: var(--edvibe-info-surface);
        font-size: 12px;
        line-height: 1.45;
    }

    [data-notice="success"] {
        border-color: var(--edvibe-success-border);
        color: var(--edvibe-success);
        background: var(--edvibe-success-surface);
    }

    [data-notice="warning"] {
        border-color: var(--edvibe-warning-border);
        color: var(--edvibe-warning);
        background: var(--edvibe-warning-surface);
    }

    [data-notice="danger"] {
        border-color: var(--edvibe-danger-border);
        color: var(--edvibe-danger);
        background: var(--edvibe-danger-surface);
    }
`,mn=G`
    [data-part="progress"] {
        accent-color: var(--edvibe-primary);
    }

    [data-part="status"] {
        color: var(--edvibe-text-muted);
        font-size: 12px;
    }
`,hn=G`
    [data-part="empty-state"] {
        padding: 24px;
        border: 1px dashed var(--edvibe-border);
        border-radius: var(--edvibe-radius-panel);
        color: var(--edvibe-text-muted);
        text-align: center;
    }
`,gn=`edvibe-toolbox-action-recorder`,_n=`edvibe-toolbox-action-recorder`,vn=class extends J{static styles=[cn,ln,un,dn,fn,pn,hn,an];static properties={state:{state:!0},minimized:{state:!0},showToolbox:{state:!0},elapsedLabel:{state:!0}};constructor(){super(),this.callbacks={},this.state={status:`idle`,session:null},this.minimized=!1,this.showToolbox=!1,this.elapsedLabel=``,this.elapsedTimer=null}connectedCallback(){super.connectedCallback(),this.id||=_n,this.syncElapsedTimer()}disconnectedCallback(){this.stopElapsedTimer(),super.disconnectedCallback()}configure(e={}){let t=e&&typeof e==`object`?e:{};for(let e of[`onStart`,`onStop`,`onClear`,`onExport`,`onCopyRequest`,`onCopyRecipe`,`onClose`])typeof t[e]==`function`&&(this.callbacks[e]=t[e]);return this}mount(){!this.isConnected&&globalThis.document?.body&&globalThis.document.body.appendChild(this)}restore(){this.minimized=!1}setState(e){return this.state=e&&typeof e==`object`?e:{status:`idle`,session:null},this.elapsedLabel=this.calculateElapsed(),this.syncElapsedTimer(),this}confirm(e){return globalThis.confirm(e)}handleStart(){this.state.session&&!this.confirm(`Удалить предыдущую запись и начать новую?`)||this.callbacks.onStart?.()}handleClear(){(!this.state.session||this.confirm(`Удалить текущую запись?`))&&this.callbacks.onClear?.()}handleClose(){if(this.state.status===`recording`){this.minimized=!0;return}this.callbacks.onClose?.()}formatBytes(e){return e<1024?`${e} Б`:e<1048576?`${(e/1024).toFixed(1)} КиБ`:`${(e/1024/1024).toFixed(1)} МиБ`}operationStatus(e){return e.response?e.response.isSuccess===!0?`Успешно`:e.response.isSuccess===!1?`Ошибка`:`Ответ получен`:`Ожидается`}visibleOperations(){return(this.state.session?.operations||[]).filter(e=>this.showToolbox||e.origin===`page`)}calculateElapsed(){let e=this.state.session?.startedAt;if(!e)return``;let t=Date.parse(e);if(Number.isNaN(t))return``;let n=this.state.session.stoppedAt?Date.parse(this.state.session.stoppedAt):Date.now(),r=Math.max(0,Math.floor((n-t)/1e3));return`${Math.floor(r/60)}:${String(r%60).padStart(2,`0`)}`}syncElapsedTimer(){this.stopElapsedTimer(),!(this.state.status!==`recording`||!this.isConnected)&&(this.elapsedTimer=globalThis.setInterval(()=>{this.elapsedLabel=this.calculateElapsed()},1e3))}stopElapsedTimer(){this.elapsedTimer!==null&&(globalThis.clearInterval(this.elapsedTimer),this.elapsedTimer=null)}renderJsonBlock(e,t){return K`<div><strong>${e}</strong><pre>${JSON.stringify(t,null,2)}</pre></div>`}renderOperation(e){let t=`operation-result is-${e.response?.isSuccess===!1?`error`:`normal`}`;return K`
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
                    <button type="button" class="button copy-request" data-control="secondary"
                        @click=${()=>this.callbacks.onCopyRequest?.(e.sequence)}>
                        Копировать запрос
                    </button>
                </div>
            </details>
        `}render(){let e=this.state.status===`recording`,t=!!this.state.session,n=this.state.session?.operations||[],r=this.visibleOperations(),i=this.state.session?.otherFrames||[],a={idle:`Готово к записи`,recording:`Идёт запись`,stopped:`Запись остановлена`},o=`recorder-indicator${e?` is-recording`:``}`,s=String(this.state.copyFallback||``);return K`
            <button class=${o} type="button" ?hidden=${!this.minimized}
                aria-label="Открыть запись WebSocket" title="Открыть запись WebSocket" @click=${()=>this.restore()}>
                <span></span><strong>REC</strong>
                <span class="indicator-count">${r.length}</span>
            </button>
            <div class="recorder-overlay" data-part="overlay" ?hidden=${this.minimized}>
                <section class="recorder-panel" data-part="dialog" role="dialog" aria-labelledby="recorder-title">
                    <header class="recorder-header">
                        <div>
                            <h2 id="recorder-title">Запись действий WebSocket</h2>
                            <p class="recorder-subtitle">Выполните одно действие в Edvibe и изучите обмен сообщениями.</p>
                        </div>
                        <div class="header-actions" data-part="actions">
                            <button class="icon-button recorder-minimize" data-control="secondary" type="button" aria-label="Свернуть" @click=${()=>{this.minimized=!0}}>
                                -
                            </button>
                            <button class="icon-button recorder-close" data-control="secondary" type="button" aria-label="Закрыть" @click=${()=>this.handleClose()}>
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
                        <div class="toolbar-actions" data-part="actions">
                            <button class="button primary recorder-start" data-control type="button" ?hidden=${e} @click=${()=>this.handleStart()}>
                                Начать запись
                            </button>
                            <button class="button danger recorder-stop" data-control="danger" type="button" ?hidden=${!e} @click=${()=>this.callbacks.onStop?.()}>
                                Остановить
                            </button>
                            <button class="button recorder-clear" data-control="secondary" type="button" ?disabled=${!t} @click=${()=>this.handleClear()}>
                                Очистить
                            </button>
                            <button class="button recorder-copy" data-control="secondary" type="button" ?disabled=${!t||n.length===0} @click=${()=>this.callbacks.onCopyRecipe?.()}>
                                Копировать рецепт
                            </button>
                            <button class="button recorder-export" data-control="secondary" type="button" ?disabled=${!t} @click=${()=>this.callbacks.onExport?.()}>
                                Экспорт JSON
                            </button>
                        </div>
                    </div>
                    <div class="recorder-body">
                        <div class="recorder-summary">
                            <span><strong class="operation-count">${r.length}</strong> операций</span>
                            <span><strong class="frame-count">${this.state.session?.frameCount||0}</strong> кадров</span>
                            <span><strong class="byte-count">${this.formatBytes(this.state.session?.storedBytes||0)}</strong> текста</span>
                            <label>
                                <input class="show-toolbox" type="checkbox" .checked=${this.showToolbox} @change=${e=>{this.showToolbox=e.currentTarget.checked}}>
                                Показать трафик Toolbox
                            </label>
                        </div>
                        <p class="recorder-notice" data-notice="success" role="status" ?hidden=${!this.state.notice}>${this.state.notice||``}</p>
                        <section>
                            <h3>Операции</h3>
                            <div class="operation-list">${r.map(e=>this.renderOperation(e))}</div>
                            <p class="empty-operations" data-part="empty-state" ?hidden=${r.length>0}> Запустите запись и выполните действие в Edvibe.</p>
                        </section>
                        <details class="other-section">
                            <summary>Другие кадры (<span class="other-count">${i.length}</span>)</summary>
                            <div class="other-list">${i.map(e=>K`<pre>${JSON.stringify(e,null,2)}</pre>`)}</div>
                        </details>
                        <label class="copy-fallback" data-field ?hidden=${!s}>
                            Скопируйте текст вручную
                            <textarea readonly .value=${s}></textarea>
                        </label>
                    </div>
                </section>
            </div>
        `}};customElements.define(gn,vn);function yn(e){if(typeof e!=`string`)return{parsed:!1,value:e};try{return{parsed:!0,value:JSON.parse(e)}}catch{return{parsed:!1,value:e}}}function bn(e){let t=yn(e);if(!t.parsed||!t.value||typeof t.value!=`object`)return{parsed:!1,value:e};let n={...t.value},r=yn(n.Value);return r.parsed&&(n.Value=r.value),{parsed:!0,value:n}}function xn(e,t){let n={};for(let[r,i]of Object.entries(e))t.has(r)||(n[r]=i);return Object.keys(n).length>0?n:void 0}function Sn(e,t){return`${e}:${String(t)}`}function Cn(e){let t=String(e?.pathname||``),n=t.match(/\/marathon\/(\d+)(?:\/|$)/);return{origin:String(e?.origin||``),pathname:t,marathonId:n?Number(n[1]):null}}function wn(e){return e.replace(/[:.]/g,`-`)}function Tn(e){let t=JSON.stringify(e.requestValue===void 0?null:e.requestValue,null,4);return[`await sendRequest(`,`    ${JSON.stringify(e.controller||``)},`,`    ${JSON.stringify(e.method||``)},`,`    ${JSON.stringify(e.projectName||``)},`,t.split(`
`).map(e=>`    ${e}`).join(`
`),`);`].join(`
`)}function En(e){let t=e.filter(e=>e.origin===`page`),n=[`// Recorded from Edvibe UI. Review IDs, ordering, and mutation effects before use.`,`// This code is intentionally not executable by the recorder.`,``];return t.forEach((e,r)=>{if(r>0){let i=t[r-1],a=e.startedAfterMs-i.startedAfterMs;a>=250&&n.push(`await wait(${Math.round(a)});`,``)}n.push(Tn(e),``)}),n.join(`
`).trimEnd()}function Dn(e,t){let n=new Blob([t],{type:`application/json;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(r)}function On({transport:e,operationGuard:t,logger:n}){let r=!1,i=An({subscribeFrames:e.subscribeFrames,createPanel(){let e=document.createElement(gn),n=e.configure.bind(e);return e.configure=(e={})=>n({...e,onClose(){try{e.onClose?.()}finally{r=!1,t.release(`recording`)}}}),r=!0,e},logger:n.createChildLogger(`Recorder`)});return{...i,openActionRecorder(){if(r)i.open();else if(t.activate(`recording`))try{i.open()}catch(e){throw t.release(`recording`),e}else window.alert(`Another Edvibe Toolbox operation is already running.`)}}}var kn=Object.freeze({type:W.OPEN_ACTION_RECORDER,create(e){let t=On(e);return()=>t.openActionRecorder()}});function An({subscribeFrames:e,createPanel:t,getPageContext:n=()=>Cn(window.location),downloadText:r=Dn,copyText:i=e=>navigator.clipboard.writeText(e),createId:a=()=>crypto.randomUUID(),now:o=Date.now,logger:s={log(){}}}){if(typeof e!=`function`)throw Error(`Action recorder requires a frame subscription.`);if(typeof t!=`function`)throw Error(`Action recorder requires a panel factory.`);let c=`idle`,l=null,u=new Map,d=null,f=``,p=``;function m(){return{status:c,session:l,copyFallback:f,notice:p}}function h(){d?.setState?.(m())}function g(e){c===`recording`&&(c=e,l.stoppedAt=new Date(o()).toISOString(),h())}function _(){if(c===`recording`)return;let e=o();c=`recording`,f=``,p=``,u=new Map,l={schemaVersion:2,sessionId:a(),startedAt:new Date(e).toISOString(),stoppedAt:null,page:n(),frameCount:0,storedBytes:0,operations:[],otherFrames:[],anomalies:[],_startedAtMs:e},h()}function v(){g(`stopped`)}function y(){c=`idle`,l=null,u=new Map,f=``,p=``,h()}function b(e,t,n){let r={sequence:l.frameCount,direction:e.direction,socketId:e.socketId,origin:e.origin,capturedAfterMs:e.capturedAt-l._startedAtMs,dataType:e.dataType,byteLength:e.byteLength};t!==void 0&&(r.envelope=t),n!==void 0&&(r.rawText=n),l.otherFrames.push(r)}function x(e,t){let n=t.RequestId;if(n===void 0||t.Controller===void 0&&t.Method===void 0&&t.ProjectName===void 0){b(e,t);return}let r=Sn(e.socketId,n);if(u.has(r)){l.anomalies.push({type:`duplicate-outbound-request`,socketId:e.socketId,requestId:n}),b(e,t);return}let i={sequence:l.operations.length+1,socketId:e.socketId,origin:e.origin,requestId:n,startedAfterMs:e.capturedAt-l._startedAtMs,durationMs:null,controller:t.Controller||``,method:t.Method||``,projectName:t.ProjectName||``,requestValue:t.Value,response:null,extra:xn(t,new Set([`Controller`,`Method`,`ProjectName`,`RequestId`,`Value`])),_capturedAt:e.capturedAt};l.operations.push(i),u.set(r,i)}function S(e,t){let n=t.RequestId,r=n===void 0?``:Sn(e.socketId,n),i=u.get(r);if(!i){b(e,t);return}i.durationMs=Math.max(0,e.capturedAt-i._capturedAt),i.response={isSuccess:typeof t.IsSuccess==`boolean`?t.IsSuccess:null,errorCode:t.ErrorCode??null,value:t.Value,extra:xn(t,new Set([`RequestId`,`IsSuccess`,`ErrorCode`,`Value`]))},u.delete(r)}function C(e){if(c!==`recording`||!l)return;if(l.frameCount+=1,e.dataType===`text`&&(l.storedBytes+=Number(e.byteLength||0)),e.dataType!==`text`){b(e),h();return}let t=bn(e.data);t.parsed?e.direction===`outbound`?x(e,t.value):S(e,t.value):b(e,void 0,t.value),h()}function w(){return l?{schemaVersion:l.schemaVersion,sessionId:l.sessionId,startedAt:l.startedAt,stoppedAt:l.stoppedAt,page:l.page,frameCount:l.frameCount,storedBytes:l.storedBytes,operations:l.operations.map(e=>{let{_capturedAt:t,...n}=e;return n}),otherFrames:l.otherFrames,anomalies:l.anomalies}:null}function T(){let e=w();if(!e)return;let t=`edvibe-ws-recording-${wn(e.startedAt)}.json`;r(t,JSON.stringify(e,null,2)),p=`Saved ${t}.`,h()}async function E(e){f=``;try{await i(e),p=`Copied to clipboard.`}catch(t){s.log(`Clipboard copy failed:`,t),f=e,p=`Clipboard unavailable. Copy the text below.`}h()}function D(e){let t=l?.operations.find(t=>t.sequence===e);return t?E(Tn(t)):Promise.resolve()}function O(){return l?E(En(l.operations)):Promise.resolve()}function k(){d?.remove?.(),d=null}function A(){d?(d.configure?.(),d.restore?.()):(d=t(),d.configure?.({onStart:_,onStop:v,onClear:y,onExport:T,onCopyRequest:D,onCopyRecipe:O,onClose:k}),d.mount?.()),h()}return e(C),{open:A,start:_,stop:v,clear:y,exportJson:T,copyRequest:D,copyRecipe:O,buildExport:w,getState:m}}var jn=new Set([`EMAIL_NON_ASCII`,`INVALID_EMAIL_FORMAT`]);function Mn(e,t=[]){let n=String(e||``),r=[],i=0;for(let e of t){let t=Number(e?.index),a=String(e?.character||``);!Number.isInteger(t)||t<i||t>n.length||!a||(t>i&&r.push({text:n.slice(i,t),offending:!1}),r.push({text:n.slice(t,t+a.length),offending:!0}),i=t+a.length)}return i<n.length&&r.push({text:n.slice(i),offending:!1}),r}function Nn(e=[]){let t=(Array.isArray(e)?e:[]).map(e=>{let t=Array.isArray(e?.offendingCharacters)?e.offendingCharacters:[];return{input:String(e?.input||``),code:e?.code,segments:Mn(e?.input,t),descriptions:t.map(({character:e,script:t})=>`«${e}» (${t})`)}});return{entries:t,hasNonAscii:t.some(e=>e.code===`EMAIL_NON_ASCII`)}}function Pn(e=[]){let t=Nn(e);return t.entries.length===0?q:K`
        <section class="email-validation-summary">
            <strong class="email-validation-heading">Некоторые email некорректны:</strong>
            <ul class="email-validation-list">
                ${t.entries.map(e=>K`<li>
                    <span class="email-validation-address">«${e.segments.map(e=>e.offending?K`<span class="email-validation-offending">${e.text}</span>`:e.text)}»</span>
                    — ${e.code===`EMAIL_NON_ASCII`?K`недопустимые символы: ${e.descriptions.join(`, `)}`:`некорректный формат`}
                </li>`)}
            </ul>
            ${t.hasNonAscii?K`<p class="email-validation-guidance">Используйте только латинские буквы, цифры и стандартные символы email.</p>`:q}
        </section>
    `}var Fn=G`
    .email-validation-summary {
        color: var(--edvibe-text);
        display: grid;
        flex: 1 0 100%;
        gap: 6px;
        margin-top: 4px;
        width: 100%;
    }

    .email-validation-heading,
    .email-validation-address {
        color: var(--edvibe-text-strong);
    }

    .email-validation-list {
        display: grid;
        gap: 4px;
        list-style-position: outside;
        margin: 0;
        padding-left: 20px;
    }

    .email-validation-offending {
        color: var(--edvibe-danger);
    }

    .email-validation-guidance {
        margin: 2px 0 0;
    }
`,In=G`
    [hidden] {
        display: none !important;
    }

    .edvibe-batch-access-card {
        display: flex;
        flex-direction: column;
        width: min(760px, calc(100vw - 32px));
        max-height: min(820px, calc(100vh - 32px));
        padding: 24px;
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
        color: var(--edvibe-text-strong);
    }

    .edvibe-batch-access-header h2 {
        font-size: 21px;
        line-height: 1.3;
    }

    .edvibe-batch-access-description {
        margin: 5px 0 0;
        color: var(--edvibe-text-muted);
        font-size: 13px;
        line-height: 1.4;
    }

    .edvibe-batch-access-close {
        min-width: 36px;
        padding: 0;
        font-size: 24px;
        line-height: 1;
    }

    .edvibe-batch-access-body {
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
        margin-top: 18px;
    }

    .edvibe-batch-access-email-field,
    .edvibe-batch-access-lesson-heading h3 {
        color: var(--edvibe-text);
        font-size: 13px;
    }

    .edvibe-batch-access-emails {
        min-height: 112px;
        resize: vertical;
        line-height: 1.45;
    }

    .edvibe-batch-access-email-state {
        flex-wrap: wrap;
        gap: 8px 16px;
    }

    .edvibe-batch-access-email-error {
        flex-basis: 100%;
        color: var(--edvibe-danger);
    }

    .edvibe-batch-access-lesson-heading {
        margin-top: 20px;
    }

    .edvibe-batch-access-selection-actions {
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 8px 12px;
        color: var(--edvibe-text);
        font-size: 13px;
    }

    .edvibe-batch-access-selection-actions label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
    }

    .edvibe-batch-access-clear-all {
        min-height: 32px;
        padding: 5px 9px;
    }

    .edvibe-batch-access-lessons {
        overflow: auto;
        max-height: 248px;
        margin-top: 10px;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    .edvibe-batch-access-errors,
    .edvibe-batch-access-summary,
    .edvibe-batch-access-failures {
        overflow: auto;
        max-height: 248px;
        margin-top: 10px;
    }

    .edvibe-batch-access-lesson {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 11px 12px;
        border-bottom: 1px solid var(--edvibe-border-subtle);
        color: var(--edvibe-text);
        font-size: 14px;
        line-height: 1.4;
        cursor: pointer;
    }

    .edvibe-batch-access-lesson:last-child {
        border-bottom: 0;
    }

    .edvibe-batch-access-lesson:hover {
        background: var(--edvibe-info-surface);
    }

    .edvibe-batch-access-lesson:focus-within {
        outline: 2px solid var(--edvibe-focus-outline);
        outline-offset: -2px;
    }

    .edvibe-batch-access-lesson input {
        flex: 0 0 auto;
        margin-top: 3px;
    }

    .edvibe-batch-access-empty {
        margin: 0;
    }

    .edvibe-batch-access-error,
    .edvibe-batch-access-failure {
        margin: 0;
        color: inherit;
        font-size: 13px;
        line-height: 1.45;
        overflow-wrap: anywhere;
    }

    .edvibe-batch-access-error + .edvibe-batch-access-error,
    .edvibe-batch-access-failure + .edvibe-batch-access-failure {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid currentColor;
    }

    .edvibe-batch-access-summary {
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
        border: 2px solid var(--edvibe-info-border);
        border-top-color: var(--edvibe-primary);
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
        font-size: 13px;
        line-height: 1.4;
    }

    .edvibe-batch-access-status.is-error {
        color: var(--edvibe-danger);
    }

    .edvibe-batch-access-progress {
        display: block;
        width: 100%;
        height: 11px;
        margin-top: 10px;
    }

    .edvibe-batch-access-footer {
        flex: 0 0 auto;
        margin-top: 18px;
    }

    .edvibe-batch-access-selection-actions input:disabled {
        cursor: not-allowed;
        opacity: .58;
    }

    @media (max-width: 560px) {
        .edvibe-batch-access-card {
            width: 100%;
            max-height: 100vh;
            padding: 18px;
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
`,Ln=`edvibe-toolbox-batch-access-dialog`,Rn=`edvibe-toolbox-batch-access-overlay`,zn=class extends J{static styles=[cn,ln,un,dn,fn,pn,mn,hn,Fn,In];static properties={lessons:{state:!0},selectedLessonIds:{state:!0},emailState:{state:!0},emailInput:{state:!0},mode:{state:!0},statusMessage:{state:!0},statusError:{state:!0},errors:{state:!0},summaryLines:{state:!0},failures:{state:!0},progress:{state:!0}};constructor(){super(),this.lessons=[],this.selectedLessonIds=new Set,this.emailState={validCount:0,malformedCount:0,invalidEntries:[]},this.emailInput=``,this.mode=`initializing`,this.statusMessage=``,this.statusError=!1,this.errors=[],this.summaryLines=[],this.failures=[],this.progress={visible:!1,indeterminate:!1,completed:0,total:0},this.handleKeydownBound=e=>this.handleKeydown(e)}connectedCallback(){super.connectedCallback(),this.id||=Rn,this.ownerDocument?.addEventListener(`keydown`,this.handleKeydownBound)}disconnectedCallback(){this.ownerDocument?.removeEventListener(`keydown`,this.handleKeydownBound),super.disconnectedCallback()}configure(e={}){let t=e&&typeof e==`object`?e:{};return(t.lessons!==void 0||t.emailState!==void 0)&&this.showConfigure(t),this}setEmailState(e={}){let t=e&&typeof e==`object`?e:{};return this.emailState={validCount:Math.max(0,Number(t.validCount)||0),malformedCount:Math.max(0,Number(t.malformedCount)||0),invalidEntries:Array.isArray(t.invalidEntries)?[...t.invalidEntries]:[]},this}showConfigure(e={}){let t=Array.isArray(e)?{lessons:e}:e&&typeof e==`object`?e:{};return Array.isArray(t.lessons)&&(this.lessons=t.lessons,this.selectedLessonIds=new Set),t.emailInput!==void 0&&(this.emailInput=String(t.emailInput||``)),this.mode=`configure`,this.clearMessages(),this.progress={visible:!1,indeterminate:!1,completed:0,total:0},t.emailState!==void 0&&this.setEmailState(t.emailState),this}showLoading(e=`Загружаем уроки…`){return this.mode=`loading`,this.clearMessages(),this.setStatus(e),this.progress={visible:!0,indeterminate:!0,completed:0,total:0},this}showValidation(e=`Проверяем данные…`){return this.mode=`validating`,this.clearMessages(),this.progress={visible:!1,indeterminate:!1,completed:0,total:0},this.setStatus(e),this}showValidationErrors(e=[]){this.mode=`validation-error`;let t=Array.isArray(e)?e:[e],n=this.emailState.invalidEntries.length>0?t.filter(e=>!jn.has(e?.code)):t;return this.errors=this.normalizeErrors(n),this.summaryLines=[],this.failures=[],this.progress={visible:!1,indeterminate:!1,completed:0,total:0},this.setStatus(`Исправьте ошибки и повторите проверку.`,`error`),this}showConfirmation(e={}){this.mode=`confirm`,this.clearMessages();let t=this.count(e.needsOpening,e.pendingCount),n=this.count(e.alreadyOpen,e.alreadyOpenCount),r=this.count(e.selectedLessons,e.selectedLessonCount),i=this.count(e.matchedUsers,e.matchedUserCount);return this.summaryLines=[`${i} пользователей сопоставлено`,`${r} уроков выбрано`,`${t} доступов нужно открыть`,`${n} уже открыт${n===1?``:`о`} и будет пропущено`],this.setStatus(`Подтвердите открытие доступа.`),this}showExecution(e={}){this.mode=`executing`;let t=Math.max(0,Number(e.completed)||0),n=Math.max(0,Number(e.total)||0),r=Math.max(0,Number(e.opened)||0),i=Math.max(0,Number(e.failures)||0),a=Math.max(0,Number(e.alreadyOpen)||0);this.progress={visible:!0,indeterminate:!1,completed:t,total:n};let o=e.current?.email&&e.current?.lessonName?` Сейчас: ${e.current.email} — ${e.current.lessonName}.`:``;return this.setStatus(`Выполнено: ${t} из ${n}. Открыто: ${r}. Ошибок: ${i}. Уже открыто: ${a}.${o}`),this}showComplete(e={}){let t=Array.isArray(e.failures)?e.failures:[];return this.mode=t.length?`partial-complete`:`complete`,this.clearMessages(),this.progress={visible:!1,indeterminate:!1,completed:0,total:0},this.summaryLines=[`Email запрошено: ${this.count(e.requestedEmails,e.requestedEmailCount)}`,`Пользователей сопоставлено: ${this.count(e.matchedUsers,e.matchedUserCount)}`,`Уроков выбрано: ${this.count(e.selectedLessons,e.selectedLessonCount)}`,`Доступов открыто: ${this.count(e.opened,e.openedCount)}`,`Уже открыто: ${this.count(e.alreadyOpen,e.alreadyOpenCount)}`,`Ошибок: ${this.count(t,e.failureCount)}`,`Попыток запросов: ${Math.max(0,Number(e.attempts)||0)}`],this.failures=t,this.setStatus(t.length?`Завершено с ошибками. Скопируйте отчёт для подробностей.`:`Готово.`),this}showFatalError(e){return this.mode=`fatal-error`,this.clearMessages(),this.errors=this.normalizeErrors([e]),this.setStatus(`Не удалось подготовить пакетное открытие доступа.`,`error`),this}normalizeErrors(e){return(Array.isArray(e)?e:[e]).map(e=>typeof e==`string`?e:String(e?.message||`Неизвестная ошибка.`))}clearMessages(){this.errors=[],this.summaryLines=[],this.failures=[],this.statusMessage=``,this.statusError=!1}setStatus(e,t=``){this.statusMessage=String(e||``),this.statusError=t===`error`}isEditingLocked(){return[`validating`,`confirm`,`executing`,`fatal-error`].includes(this.mode)}isLessonSelectionLocked(){return this.mode===`loading`||this.isEditingLocked()}canClose(){return[`configure`,`validation-error`,`complete`,`partial-complete`,`fatal-error`].includes(this.mode)}canSubmit(){return(this.mode===`configure`||this.mode===`validation-error`)&&this.emailState.validCount>0&&this.selectedLessonIds.size>0}selectLesson(e,t){if(this.isLessonSelectionLocked())return;let n=new Set(this.selectedLessonIds);t?n.add(e):n.delete(e),this.selectedLessonIds=n}handleInput(e){this.emailInput=String(e.currentTarget.value||``),this.dispatchEvent(new CustomEvent(`edvibe-batch-access-input-change`,{detail:{emailInput:this.emailInput}}))}handleSelectAll(e){this.isLessonSelectionLocked()||(this.selectedLessonIds=e.currentTarget.checked?new Set(this.lessons.map(e=>e.MarathonLessonId)):new Set)}handleClearAll(){this.isLessonSelectionLocked()||(this.selectedLessonIds=new Set)}handleSubmit(){this.canSubmit()&&this.dispatchEvent(new CustomEvent(`edvibe-batch-access-submit`,{detail:{emailInput:this.emailInput,selectedLessonIds:[...this.selectedLessonIds]}}))}handleConfirm(){this.mode===`confirm`&&this.dispatchEvent(new CustomEvent(`edvibe-batch-access-confirm`))}handleCopy(){[`complete`,`partial-complete`].includes(this.mode)&&this.dispatchEvent(new CustomEvent(`edvibe-batch-access-copy-report`))}handleRestart(){[`complete`,`partial-complete`].includes(this.mode)&&(this.mode=`configure`,this.selectedLessonIds=new Set,this.emailInput=``,this.setEmailState({validCount:0,malformedCount:0,invalidEntries:[]}),this.clearMessages(),this.progress={visible:!1,indeterminate:!1,completed:0,total:0},this.dispatchEvent(new CustomEvent(`edvibe-batch-access-restart`)))}handleBackdropClick(e){e.target===e.currentTarget&&this.close()}handleKeydown(e){e.key===`Escape`&&this.close()}close(){this.canClose()&&(this.dispatchEvent(new CustomEvent(`edvibe-dialog-close`)),this.remove())}count(e,t){return Array.isArray(e)?e.length:Number.isFinite(Number(e))?Math.max(0,Number(e)):Math.max(0,Number(t)||0)}renderLesson(e,t){let n=e.MarathonLessonId;return K`
            <label class="edvibe-batch-access-lesson">
                ${Number(e.Number)+1}. ${e.Name||`Без названия`}
                <input type="checkbox" .value=${String(n)}
                    .checked=${this.selectedLessonIds.has(n)} ?disabled=${t}
                    @change=${e=>this.selectLesson(n,e.currentTarget.checked)}>
            </label>
        `}renderFailure(e){let t=Math.max(0,Number(e?.lessonNumber)||0),n=Math.max(0,Number(e?.attempts)||0);return K`<p class="edvibe-batch-access-failure">
            ${String(e?.email||`Email отсутствует`)} —
            ${t}. ${String(e?.lessonName||`Урок без названия`)} —
            ${n} попытки — ${String(e?.code||`UNKNOWN_ERROR`)}:
            ${String(e?.message||`Неизвестная ошибка.`)}
        </p>`}render(){let e=this.isEditingLocked(),t=this.isLessonSelectionLocked()||this.mode===`fatal-error`,n=[`complete`,`partial-complete`].includes(this.mode),r=this.selectedLessonIds.size,i=this.lessons.length,a=i>0&&r===i,o=r>0&&r<i,s=this.progress.indeterminate?q:this.progress.completed,c=`edvibe-batch-access-status${this.statusError?` is-error`:``}`;return K`
            <div class="edvibe-batch-access-overlay" data-part="overlay" @click=${this.handleBackdropClick}>
                <section class="edvibe-batch-access-card" data-part="dialog" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-access-title">
                    <header class="edvibe-batch-access-header">
                        <div><h2 id="edvibe-batch-access-title">Открыть доступ к урокам</h2>
                            <p class="edvibe-batch-access-description">Укажите email учеников и выберите уроки.</p></div>
                        <button class="edvibe-batch-access-close" data-control="secondary" type="button" aria-label="Закрыть"
                            ?disabled=${!this.canClose()} @click=${()=>this.close()}>&times;</button>
                    </header>
                    <div class="edvibe-batch-access-body">
                        <section class="edvibe-batch-access-configure">
                            <div class="edvibe-batch-access-email-field" data-field>
                                <label for="edvibe-batch-access-emails">Email учеников</label>
                                <textarea id="edvibe-batch-access-emails" class="edvibe-batch-access-emails"
                                    rows="5" placeholder="user@example.com" .value=${this.emailInput}
                                    ?disabled=${e||this.mode===`fatal-error`}
                                    @input=${this.handleInput}></textarea>
                                <div class="edvibe-batch-access-email-state" data-part="help" aria-live="polite">
                                    <span class="edvibe-batch-access-email-count">Уникальных email: ${this.emailState.validCount}</span>
                                    <span class="edvibe-batch-access-malformed-count">Некорректных: ${this.emailState.malformedCount}</span>
                                    ${Pn(this.emailState.invalidEntries)}
                                </div>
                            </div>
                            <div class="edvibe-batch-access-lesson-heading"><h3>Уроки</h3>
                                <div class="edvibe-batch-access-selection-actions">
                                    <label><input class="edvibe-batch-access-select-all" type="checkbox"
                                        .checked=${a} .indeterminate=${o}
                                        ?disabled=${t||i===0}
                                        @change=${this.handleSelectAll}>Выбрать все</label>
                                    <button class="edvibe-batch-access-clear-all" data-control="secondary" type="button"
                                        ?disabled=${e||r===0}
                                        @click=${this.handleClearAll}>Очистить выбор</button>
                                </div>
                            </div>
                            <div class="edvibe-batch-access-lessons" aria-label="Список уроков">
                                ${i===0?K`<p class="edvibe-batch-access-empty" data-part="empty-state">Уроки не найдены.</p>`:this.lessons.map(e=>this.renderLesson(e,t))}
                            </div>
                        </section>
                        <section class="edvibe-batch-access-errors" data-notice="danger" aria-live="polite" ?hidden=${this.errors.length===0}>
                            ${this.errors.map(e=>K`<p class="edvibe-batch-access-error">${e}</p>`)}
                        </section>
                        <section class="edvibe-batch-access-summary" data-notice aria-live="polite" ?hidden=${this.summaryLines.length===0}>
                            ${this.summaryLines.join(`
`)}
                        </section>
                        <section class="edvibe-batch-access-failures" data-notice="warning" aria-live="polite" ?hidden=${this.failures.length===0}>
                            ${this.failures.map(e=>this.renderFailure(e))}
                        </section>
                    </div>
                    <div class="edvibe-batch-access-live-region">
                        <span class="edvibe-batch-access-loading-indicator" role="img" aria-label="Загрузка уроков"
                            ?hidden=${this.mode!==`loading`}></span>
                        <p class=${c} data-part="status" role="status" aria-live="polite">${this.statusMessage}</p>
                        <progress class="edvibe-batch-access-progress" data-part="progress" max=${this.progress.total}
                            value=${s} ?hidden=${!this.progress.visible}
                            aria-label=${this.progress.indeterminate?`Загрузка уроков`:q}></progress>
                    </div>
                    <footer class="edvibe-batch-access-footer" data-part="actions">
                        <button class="edvibe-batch-access-copy" data-control="secondary" type="button" ?hidden=${!n}
                            ?disabled=${!n} @click=${this.handleCopy}>Копировать отчёт</button>
                        <button class="edvibe-batch-access-restart" data-control="secondary" type="button" ?hidden=${!n}
                            ?disabled=${!n} @click=${this.handleRestart}>Запустить другую группу</button>
                        <button class="edvibe-batch-access-confirm" data-control type="button" ?hidden=${this.mode!==`confirm`}
                            ?disabled=${this.mode!==`confirm`} @click=${this.handleConfirm}>Подтвердить открытие доступа</button>
                        <button class="edvibe-batch-access-submit" data-control type="button"
                            ?hidden=${![`configure`,`validation-error`].includes(this.mode)}
                            ?disabled=${!this.canSubmit()} @click=${this.handleSubmit}>Проверить и открыть доступ</button>
                    </footer>
                </section>
            </div>
        `}};customElements.get(`edvibe-toolbox-batch-access-dialog`)||customElements.define(Ln,zn);var Bn=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,Vn=/\/marathon\/(\d+)(?:\/|$)/,Hn=/\p{Script=Cyrillic}/u,Un=new Set([`WS_UNAVAILABLE`,`REQUEST_TIMEOUT`,`SEND_FAILED`]);function Y(e,t,n={}){let r=Error(t);return r.code=e,Object.assign(r,n),r}function Wn(e){let t=String(e||``).match(Vn);return t?Number(t[1]):null}function Gn(e){let t=[],n=0;for(let r of e){let e=r.codePointAt(0);e>127&&t.push(Object.freeze({character:r,index:n,codePoint:`U+${e.toString(16).toUpperCase().padStart(4,`0`)}`,script:Hn.test(r)?`кириллица`:`не-ASCII символ`})),n+=r.length}return Object.freeze(t)}function Kn(e){let t=Gn(e);if(t.length>0){let e=t.map(({character:e,script:t})=>`«${e}» (${t})`).join(`, `);return Object.freeze({isValid:!1,code:`EMAIL_NON_ASCII`,message:`Недопустимые символы: ${e}.`,offendingCharacters:t})}return Bn.test(e)?Object.freeze({isValid:!0,code:null,message:null,offendingCharacters:t}):Object.freeze({isValid:!1,code:`INVALID_EMAIL_FORMAT`,message:`Некорректный формат email.`,offendingCharacters:t})}function qn(e,{includeItems:t=!1}={}){let n=[],r=[],i=[],a=[],o=new Set;for(let s of String(e||``).split(/[,;\r\n]+/)){let e=s.trim();if(!e)continue;let c=e.toLowerCase();if(o.has(c))continue;o.add(c);let l=Kn(e);l.isValid?n.push({input:e,normalized:c}):(r.push(e),i.push({input:e,normalized:c,...l})),t&&a.push({input:e,normalized:c,isValid:l.isValid,validation:l})}return t?{entries:n,malformed:r,invalidEntries:i,items:a}:{entries:n,malformed:r,invalidEntries:i}}function Jn(e,t,n,r,i){if(!Array.isArray(n)||!Number.isInteger(r)||r<0||t!==null&&r!==t||n.length===0&&e.length<r||e.length+n.length>r)throw Y(`INVALID_RESPONSE`,`${i} returned invalid pagination data.`);return{items:e.concat(n),total:r}}function Yn(e,t){return Un.has(e?.code)?e.code!==`SEND_FAILED`||!!e.cause&&!t().isOpen:!1}async function Xn(e,{wait:t,getConnectionState:n,retryDelays:r=[1e3,3e3]}){let i=0;for(;i<=r.length;){i+=1;try{if(i>1&&!n().isOpen)throw Y(`WS_UNAVAILABLE`,`The Edvibe connection is unavailable.`);return{value:await e(),attempts:i}}catch(e){if(!Yn(e,n)||i>r.length)throw e.attempts=i,e;await t(r[i-1])}}throw Y(`INTERNAL_ERROR`,`Retry loop ended unexpectedly.`)}function Zn(e){if(typeof e!=`function`)throw TypeError(`sendRequest is required`);return e}function Qn(e){if(!Ee(e))return{items:void 0,total:void 0};let t=Ee(e.Value)?e.Value:Ee(e.value)?e.value:null;if(!t)return{items:void 0,total:void 0};let n=Ee(t.Page)?t.Page:null;return{items:t.Items,total:n?.Count}}async function $n({sendRequest:e,marathonId:t,pageSize:n=50}){let r=Zn(e),i=[],a=null;for(;a===null||i.length<a;){let e=Qn(await r(`MarathonPupilsWsController`,`GetMarathonPupils`,`Marathons`,{MarathonId:t,Skip:i.length,Take:n})),o=Jn(i,a,e.items,e.total,`GetMarathonPupils`);i=o.items,a=o.total}return i}async function er({sendRequest:e,marathonId:t,pupilId:n,pageSize:r=20}){let i=Zn(e),a=[],o=null;for(;o===null||a.length<o;){let e=Qn(await i(`MarathonLessonWsController`,`GetMarathonLessonsForPupilPagination`,`Marathons`,{PupilId:n,MarathonId:t,SearchTerm:``,Page:{Skip:a.length,Take:r}})),s=Jn(a,o,e.items,e.total,`GetMarathonLessonsForPupilPagination`);a=s.items,o=s.total}return a}async function tr({sendRequest:e,marathonId:t,pageSize:n=100}){let r=Zn(e),i=[],a=null;for(;a===null||i.length<a;){let e=Qn(await r(`MarathonLessonWsController`,`GetMarathonLessonsPagination`,`Marathons`,{MarathonId:t,SearchTerm:``,Page:{Skip:i.length,Take:n}})),o=Jn(i,a,e.items,e.total,`GetMarathonLessonsPagination`);i=o.items,a=o.total}return i}async function nr({sendRequest:e,lessonId:t}){let n=await Zn(e)(`LessonWsController`,`GetLessonWithId`,`Books`,{LessonId:t});if(!Ee(n))throw Y(`INVALID_RESPONSE`,`GetLessonWithId returned an invalid response.`);return n}var rr=new Set([...Un,`SERVER_REJECTED`,`INVALID_RESPONSE`]),ir=`edvibe-toolbox-batch-access-dialog`,ar=`edvibe-toolbox-batch-access-overlay`;function or(e){return e.PupilId===void 0?e.Id:e.PupilId}function sr(e){return e.MarathonPupilId===void 0?e.Id:e.MarathonPupilId}function cr(e,t){let n=new Map;for(let e of t){let t=String(e.Email||``).trim().toLowerCase(),r=n.get(t)||[];r.push(e),n.set(t,r)}let r=[],i=[];for(let t of e){let e=n.get(t.normalized)||[];e.length===1?r.push(e[0]):e.length===0?i.push({type:`missing`,input:t.input,message:`No marathon pupil found for ${t.input}.`}):i.push({type:`ambiguous`,input:t.input,count:e.length,message:`Multiple marathon pupils found for ${t.input}.`})}return{matches:r,errors:i}}function lr({pupils:e,selectedLessonIds:t,lessonsByPupilId:n}){let r=[],i=[],a=[];for(let o of e){let e=or(o),s=n.get(e)||[],c=new Map,l=new Set;for(let n of s)if(t.includes(n.MarathonLessonId)){if(c.get(n.MarathonLessonId)){l.add(n.MarathonLessonId),a.push(Y(`INVALID_RESPONSE`,`Multiple lesson states were returned for lesson ${n.MarathonLessonId}.`,{email:o.Email,pupilId:e,marathonLessonId:n.MarathonLessonId}));continue}c.set(n.MarathonLessonId,n)}for(let n of t){let t=c.get(n);if(l.has(n))continue;if(!t){a.push(Y(`INVALID_RESPONSE`,`Lesson ${n} was not returned for ${o.Email}.`,{email:o.Email,pupilId:e,marathonLessonId:n}));continue}if(typeof t.IsOpen!=`boolean`){a.push(Y(`INVALID_RESPONSE`,`Lesson ${n} returned an invalid access state.`,{email:o.Email,pupilId:e,marathonLessonId:n}));continue}let s={email:o.Email,pupilId:e,marathonPupilId:sr(o),marathonLessonId:n,lessonNumber:t.Number+1,lessonName:t.Name};t.IsOpen===!0?r.push(s):i.push(s)}}return{alreadyOpen:r,needsOpening:i,errors:a}}function ur({completed:e,total:t,opened:n,failures:r,alreadyOpen:i,item:a}){return Object.freeze({completed:e,total:t,opened:n,failures:r,alreadyOpen:i,current:Object.freeze({email:a.email,lessonName:a.lessonName})})}function dr(e,t,{code:n=t?.code||`UNKNOWN_ERROR`,message:r=t?.message||`The lesson access change failed.`,attempts:i=t?.attempts||1}={}){return{email:e.email,lessonNumber:e.lessonNumber,lessonName:e.lessonName,marathonLessonId:e.marathonLessonId,attempts:i,code:n,message:r}}function fr({requestedEmails:e,matchedUsers:t,selectedLessons:n,opened:r,alreadyOpen:i,failures:a,attempts:o}){return{requestedEmails:e,matchedUsers:t,selectedLessons:n,opened:r,alreadyOpen:i.length,failures:a,attempts:o}}async function pr({marathonId:e,requestedEmails:t,matchedUsers:n,selectedLessons:r,alreadyOpen:i=[],needsOpening:a=[],sendRequest:o,wait:s,getConnectionState:c,onProgress:l=()=>{}}){let u=[],d=[],f=0;for(let p=0;p<a.length;p+=1){let m=a[p],h=0;try{l(ur({completed:p,total:a.length,opened:u.length,failures:d.length,alreadyOpen:i.length,item:m})),await s(300);try{h=(await Xn(async()=>{let t=await o(`MarathonLessonWsController`,`ChangeIsOpenLessonForPupil`,`Marathons`,{IsOpen:!0,MarathonLessonId:m.marathonLessonId,MarathonPupilId:m.marathonPupilId,MarathonId:e});if(t?.Value!==!0)throw Y(`INVALID_RESPONSE`,`The lesson access change was not confirmed.`);return t},{wait:s,getConnectionState:c})).attempts,f+=h,u.push(m)}catch(e){if(h=e.attempts||1,f+=h,!rr.has(e?.code))throw e;d.push(dr(m,e,{attempts:h}))}l(ur({completed:p+1,total:a.length,opened:u.length,failures:d.length,alreadyOpen:i.length,item:m}))}catch(e){throw d.push(dr(m,e,{code:`INTERNAL_ERROR`,message:`An internal error stopped the batch operation.`,attempts:h})),Y(`INTERNAL_ERROR`,`An internal error stopped the batch operation.`,{cause:e,partialResult:fr({requestedEmails:t,matchedUsers:n,selectedLessons:r,opened:u,alreadyOpen:i,failures:d,attempts:f})})}}return fr({requestedEmails:t,matchedUsers:n,selectedLessons:r,opened:u,alreadyOpen:i,failures:d,attempts:f})}function mr(e){let t=[`Requested emails: ${e.requestedEmails.length}`,`Matched users: ${e.matchedUsers}`,`Selected lessons: ${e.selectedLessons}`,`Opened: ${e.opened.length}`,`Already open: ${e.alreadyOpen}`,`Failed: ${e.failures.length}`,`Attempts: ${e.attempts}`];for(let n of e.failures)t.push(`FAILED ${n.email} — ${n.lessonNumber}. ${n.lessonName} — ${n.attempts} attempts — ${n.code}: ${n.message}`);return t.join(`
`)}function hr(e){return Object.freeze(e.map(e=>Object.freeze({...e})))}function gr({requestedEmails:e,matchedUsers:t,selectedLessonIds:n,alreadyOpen:r,needsOpening:i}){return Object.freeze({requestedEmails:Object.freeze([...e]),matchedUsers:t,selectedLessonIds:Object.freeze([...n]),alreadyOpen:hr(r),needsOpening:hr(i)})}function _r({sendRequest:e,getConnectionState:t,canStart:n,onActiveChange:r,createDialog:i=()=>document.createElement(ir),copyText:a=async()=>{},logger:o={log(){}}}){let s=!1,c=!1,l=[],u=[],d=null,f=null,p=null,m=null;function h(){s&&(s=!1,r(!1))}function g(){c=!1,l=[],u=[],d=null,f=null,p=null,m=null,h()}function _(e){return typeof e?.code==`string`?e.code:`UNKNOWN_ERROR`}function v(e,t,n){let r=_(e),i=String(t?.Email||``).trim();return Y(r,`Could not load lesson access for ${i||`the selected pupil`} (${r}).`,{email:i,pupilId:n,attempts:e?.attempts||1})}function y(e,t){let n=e.invalidEntries.map(e=>Y(e.code,e.message,{email:e.input,offendingCharacters:e.offendingCharacters}));return e.entries.length===0&&e.malformed.length===0&&n.push(Y(`EMAILS_REQUIRED`,`Enter at least one email address.`)),t.length===0&&n.push(Y(`LESSONS_REQUIRED`,`Select at least one lesson.`)),n}function b(e){f={requestedEmails:[...e.requestedEmails],matchedUsers:e.matchedUsers,selectedLessons:e.selectedLessonIds.length,opened:[],alreadyOpen:e.alreadyOpen.length,failures:[],attempts:0},d=null,m.showComplete(f)}async function x(n){if(c)return;c=!0,d=null,f=null;let r=String(n?.detail?.emailInput||``),i=Object.freeze(Array.isArray(n?.detail?.selectedLessonIds)?[...n.detail.selectedLessonIds]:[]);try{m.showValidation();let n=qn(r),a=y(n,i),s=cr(n.entries,l),c=a.concat(s.errors);if(c.length>0){o.log(`Batch access validation blocked for MarathonId ${p}; ${c.length} error(s).`),m.showValidationErrors(c);return}let u=new Map,f=[],h=[];for(let n of s.matches){let r=or(n);try{o.log(`Loading batch access state for PupilId ${r} in MarathonId ${p}.`);let i=await Xn(()=>er({sendRequest:e,marathonId:p,pupilId:r}),{wait:Te,getConnectionState:t});u.set(r,i.value),f.push(n),o.log(`Loaded ${i.value.length} lesson state(s) for PupilId ${r} after ${i.attempts} attempt(s).`)}catch(e){h.push(v(e,n,r)),o.log(`Batch access state read failed for PupilId ${r} in MarathonId ${p} (${_(e)}).`)}}let g=lr({pupils:f,selectedLessonIds:i,lessonsByPupilId:u}),x=h.concat(g.errors);if(x.length>0){o.log(`Batch access preflight blocked for MarathonId ${p}; ${x.length} error(s), zero writes issued.`),m.showValidationErrors(x);return}if(d=gr({requestedEmails:n.entries.map(e=>e.input),matchedUsers:s.matches.length,selectedLessonIds:i,alreadyOpen:g.alreadyOpen,needsOpening:g.needsOpening}),o.log(`Batch access preflight complete for MarathonId ${p}; ${d.needsOpening.length} pending, ${d.alreadyOpen.length} already open.`),d.needsOpening.length===0){b(d);return}m.showConfirmation(Object.freeze({matchedUsers:d.matchedUsers,selectedLessons:d.selectedLessonIds.length,needsOpening:d.needsOpening,alreadyOpen:d.alreadyOpen}))}catch(e){o.log(`Batch access preflight failed for MarathonId ${p} (${_(e)}).`),m.showValidationErrors([e])}finally{c=!1}}async function S(){if(c||!d)return;c=!0;let n=d;d=null;try{try{f=await pr({marathonId:p,requestedEmails:n.requestedEmails,matchedUsers:n.matchedUsers,selectedLessons:n.selectedLessonIds.length,alreadyOpen:n.alreadyOpen,needsOpening:n.needsOpening,sendRequest:e,wait:Te,getConnectionState:t,onProgress:e=>m.showExecution(e)})}catch(e){if(e?.code!==`INTERNAL_ERROR`||!e.partialResult)throw e;f=e.partialResult,o.log(`Batch access execution stopped for MarathonId ${p}; ${f.opened.length} opened, ${f.failures.length} failed (INTERNAL_ERROR).`)}o.log(`Batch access execution complete for MarathonId ${p}; ${f.opened.length} opened, ${f.alreadyOpen} already open, ${f.failures.length} failed.`);for(let e of f.failures)o.log(`Batch access write failed for MarathonLessonId ${e.marathonLessonId} (${e.code}).`);m.showComplete(f)}finally{c=!1}}async function C(){f&&await a(mr(f))}function w(){d=null,f=null,c=!1}async function T(){if(!(s||document.getElementById(ar))){if(!n()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}if(p=Wn(window.location.href),!p){window.alert(`Open an Edvibe marathon page before opening batch lesson access.`);return}s=!0,r(!0);try{if(m=i(),m.addEventListener(`edvibe-dialog-close`,g),m.addEventListener(`edvibe-batch-access-input-change`,e=>{let t=qn(e?.detail?.emailInput);m.setEmailState({validCount:t.entries.length,malformedCount:t.malformed.length,invalidEntries:t.invalidEntries})}),m.addEventListener(`edvibe-batch-access-submit`,x),m.addEventListener(`edvibe-batch-access-confirm`,S),m.addEventListener(`edvibe-batch-access-copy-report`,C),m.addEventListener(`edvibe-batch-access-restart`,w),m.configure(),(document.body||document.documentElement).appendChild(m),m.showLoading(),o.log(`Initializing batch access for MarathonId ${p}.`),l=await $n({sendRequest:e,marathonId:p}),l.length===0)throw Y(`EMPTY_ROSTER`,`No pupils were found in this marathon.`);let t=or(l[0]);u=await er({sendRequest:e,marathonId:p,pupilId:t}),o.log(`Initialized batch access for MarathonId ${p}; ${l.length} pupil(s), ${u.length} lesson(s), catalogue PupilId ${t}.`),m.showConfigure({lessons:u})}catch(e){o.log(`Batch access initialization failed for MarathonId ${p} (${_(e)}).`);try{if(typeof m?.showFatalError==`function`)m.showFatalError(e);else throw e}finally{h()}}}}return{open:T,isRunning:()=>c}}var vr=s({OPERATION_TYPE:()=>yr,attemptKey:()=>Or,buildObservedPlan:()=>Lr,createCapture:()=>Ar,freezeObject:()=>X,lessonKey:()=>Dr,normalizeEmail:()=>xr,observeRequest:()=>Mr,recordWriteAttempt:()=>Nr,serializeLesson:()=>Tr,serializePupil:()=>wr,splitSubmittedInputs:()=>Er}),yr=`batch_lesson_access`;function X(e){return Object.freeze({...e})}function br(e){return Object.freeze(e.map(e=>X(e)))}function xr(e){return String(e||``).trim().toLowerCase()}function Sr(e){return e?.PupilId??e?.Id??null}function Cr(e){return e?.MarathonPupilId??e?.Id??null}function wr(e){return X({email:String(e?.Email||``).trim()||null,pupilId:Sr(e),marathonPupilId:Cr(e)})}function Tr(e){let t=Number(e?.Number);return X({marathonLessonId:e?.MarathonLessonId??null,lessonNumber:Number.isFinite(t)?t+1:null,lessonName:String(e?.Name||``).trim()||null,isOpen:typeof e?.IsOpen==`boolean`?e.IsOpen:null})}function Er(e){let t=[],n=new Set;for(let r of String(e||``).split(/[,;\r\n]+/)){let e=r.trim();if(!e)continue;let i=xr(e);n.has(i)||(n.add(i),t.push(X({submittedInput:e,normalizedEmail:i})))}return Object.freeze(t)}function Dr(e,t){return`${xr(e)}:${String(t)}`}function Or(e,t){return`${String(e)}:${String(t)}`}function kr(e,t,n){return X({code:typeof e?.code==`string`?e.code:t,message:String(e?.message||n),email:String(e?.email||``).trim()||null,pupilId:e?.pupilId??null,marathonLessonId:e?.marathonLessonId??null,attempts:Number.isInteger(e?.attempts)?e.attempts:0,type:typeof e?.type==`string`?e.type:null,count:Number.isInteger(e?.count)?e.count:null})}function Ar(){return{pupils:[],lessonsByPupilId:new Map,lessonCatalogue:[],writeAttempts:new Map,attempt:null,sequence:0}}function jr(e,t,n){t===0&&(e.length=0);for(let r=0;r<n.length;r+=1)e[t+r]=n[r];for(;e.length>0&&e[e.length-1]===void 0;)e.pop()}function Mr(e,t,n,r){if(t===`GetMarathonPupils`){let t=Array.isArray(r?.Value?.Items)?r.Value.Items.map(wr):[];jr(e.pupils,Number(n?.Skip)||0,t);return}if(t===`GetMarathonLessonsForPupilPagination`){let t=n?.PupilId??null,i=e.lessonsByPupilId.get(t)||[],a=Array.isArray(r?.Value?.Items)?r.Value.Items.map(Tr):[];jr(i,Number(n?.Page?.Skip)||0,a),e.lessonsByPupilId.set(t,i)}}function Nr(e,t,n){if(t!==`ChangeIsOpenLessonForPupil`)return;let r=Or(n?.MarathonPupilId,n?.MarathonLessonId);e.writeAttempts.set(r,(e.writeAttempts.get(r)||0)+1)}function Pr({submittedEmailInput:e,pupils:t}){let n=Er(e),r=qn(e),i=new Map(r.invalidEntries.map(e=>[xr(e.input),e])),a=new Map;for(let e of t){let t=xr(e.email),n=a.get(t)||[];n.push(e),a.set(t,n)}return n.map(e=>{if(i.has(e.normalizedEmail)){let t=i.get(e.normalizedEmail);return X({...e,resolution:`malformed`,resolvedEmail:null,pupilId:null,marathonPupilId:null,code:t.code,message:t.message,offendingCharacters:t.offendingCharacters})}let t=a.get(e.normalizedEmail)||[];if(t.length===0)return X({...e,resolution:`missing`,resolvedEmail:null,pupilId:null,marathonPupilId:null,code:`USER_NOT_FOUND`,message:`No marathon pupil found for ${e.submittedInput}.`});if(t.length>1)return X({...e,resolution:`ambiguous`,resolvedEmail:null,pupilId:null,marathonPupilId:null,code:`USER_AMBIGUOUS`,message:`Multiple marathon pupils found for ${e.submittedInput}.`});let n=t[0];return X({...e,resolution:`matched`,resolvedEmail:n.email,pupilId:n.pupilId,marathonPupilId:n.marathonPupilId,code:null,message:null})})}function Fr(e,t){let n=new Map(t.map(e=>[e.marathonLessonId,e]));return br(e.map(e=>{let t=n.get(e);return{marathonLessonId:e,lessonNumber:t?.lessonNumber??null,lessonName:t?.lessonName||`Lesson ${e}`}}))}function Ir(e,t){return e.find(e=>t.pupilId!==null&&e.pupilId===t.pupilId||t.resolvedEmail&&xr(e.email)===xr(t.resolvedEmail))}function Lr({submittedEmailInput:e,selectedLessonIds:t,pupils:n,lessonsByPupilId:r,lessonCatalogue:i,errors:a=[]}){let o=Pr({submittedEmailInput:e,pupils:n}),s=Fr(t,i),c=br(a.map(e=>kr(e,`LESSON_ACCESS_PREFLIGHT_FAILED`,`The lesson-access preflight failed.`))),l=[],u=[],d=new Set([`INVALID_EMAIL`,`EMAIL_NON_ASCII`,`INVALID_EMAIL_FORMAT`,`USER_INPUT_MALFORMED`,`USER_NOT_FOUND`,`USER_AMBIGUOUS`]),f=c.filter(e=>!e.email&&e.pupilId===null&&e.marathonLessonId===null&&!e.type&&!d.has(e.code)).map(e=>X({code:e.code,message:e.message,attempts:e.attempts,kind:[`EMAILS_REQUIRED`,`LESSONS_REQUIRED`].includes(e.code)?`input`:`preflight`}));for(let e of o){if(e.resolution!==`matched`)continue;let t=r.get(e.pupilId);if(!Array.isArray(t)){let t=Ir(c,e);t&&u.push(X({submittedEmail:e.submittedInput,resolvedEmail:e.resolvedEmail,pupilId:e.pupilId,marathonPupilId:e.marathonPupilId,code:t.code||`LESSON_STATE_DISCOVERY_FAILED`,message:t.message||`Could not load lesson access for ${e.resolvedEmail}.`,attempts:t.attempts||0}));for(let n of s)l.push(X({...e,...n,preflightAccessState:`unknown`,plannedOutcome:`not_attempted`,code:t?`LESSON_STATE_UNAVAILABLE`:`PREFLIGHT_BLOCKED`,message:t?`The lesson state could not be loaded, so this combination was not attempted.`:`Validation stopped before this confirmed user and lesson combination could be prepared.`}));continue}let n=new Map;for(let e of t){let t=n.get(e.marathonLessonId)||[];t.push(e),n.set(e.marathonLessonId,t)}for(let t of s){let r=n.get(t.marathonLessonId)||[];if(r.length===0){l.push(X({...e,...t,preflightAccessState:`unknown`,plannedOutcome:`rejected`,code:`LESSON_NOT_RETURNED`,message:`Lesson ${t.marathonLessonId} was not returned for ${e.resolvedEmail}.`}));continue}if(r.length>1){l.push(X({...e,...t,preflightAccessState:`unknown`,plannedOutcome:`rejected`,code:`LESSON_STATE_AMBIGUOUS`,message:`Multiple lesson states were returned for lesson ${t.marathonLessonId}.`}));continue}let i=r[0];if(typeof i.isOpen!=`boolean`){l.push(X({...e,...t,lessonNumber:i.lessonNumber??t.lessonNumber,lessonName:i.lessonName||t.lessonName,preflightAccessState:`unknown`,plannedOutcome:`rejected`,code:`INVALID_ACCESS_STATE`,message:`Lesson ${t.marathonLessonId} returned an invalid access state.`}));continue}l.push(X({...e,...t,lessonNumber:i.lessonNumber??t.lessonNumber,lessonName:i.lessonName||t.lessonName,preflightAccessState:i.isOpen?`open`:`closed`,plannedOutcome:i.isOpen?`already_open`:`pending`,code:null,message:null}))}}return Object.freeze({identities:br(o),selectedLessons:s,matrix:br(l),discoveryFailures:br(u),operationFailures:br(f),errors:c})}var Rr=`1970-01-01T00:00:00.000Z`;function zr(e,t=Rr){return typeof e==`string`&&!Number.isNaN(Date.parse(e))||Number.isFinite(e)?new Date(e).toISOString():t}function Br(e){return e?.diagnostics||e||{}}function Vr(e,{correlationId:t,operationName:n,attemptNumber:r=1,outcome:i}={}){let a=Br(e),o=a.request||{},s=a.response||{},c=zr(o.startedAt),l=Number.isSafeInteger(s.elapsedMs)&&s.elapsedMs>=0?s.elapsedMs:null,u=s.completedAt==null&&l==null?null:zr(s.completedAt??Date.parse(c)+l,c),d=e instanceof Error||s.success===!1;return Object.freeze({correlationId:String(t||o.requestId||e?.requestId||n),operationName:String(n),controller:e?.controller||o.controller||null,method:String(e?.method||o.method||`UNKNOWN`),projectName:e?.projectName||o.projectName||null,requestId:e?.requestId||o.requestId||s.requestId||null,attemptNumber:r,startedAt:c,completedAt:u,durationMs:l,outcome:i||(d?`failure`:`success`),transportCode:d&&e?.code||null,serverErrorCode:e?.serverErrorCode||s.errorCode||null,serverErrorMessage:s.serverMessage||null,requestSummary:o.value??e?.requestValue??null,responseSummary:s.value??null})}function Hr(e){let t=(Array.isArray(e)?e:[]).filter(Boolean);return t.length===0?void 0:Object.freeze({requestAttempts:Object.freeze(t)})}function Ur(e,t={}){return Hr((Array.isArray(e)?e:[e]).filter(Boolean).map((e,n)=>Vr(e,{...t,attemptNumber:t.attemptNumber??n+1})))}function Z(e,t={}){if(!e)return;if(Array.isArray(e.requestAttempts))return Hr(e.requestAttempts);if(e.diagnostics&&Array.isArray(e.diagnostics.requestAttempts))return Hr(e.diagnostics.requestAttempts);let n=e.observations||e.attemptsDiagnostics||e.diagnosticObservations;return n?Ur(n,t):void 0}var Wr=s({buildExecutionHistoryInput:()=>$r}),Gr=new Set([`SERVER_REJECTED`,`INVALID_RESPONSE`]);function Kr(e,t,n,r,i,a=null){let o={opened:`success`,already_open:`noop`,rejected:`rejected`,failed:`failed`,not_attempted:`not_attempted`}[t];return X({itemId:Dr(e.resolvedEmail||e.submittedInput,e.marathonLessonId),label:`${e.resolvedEmail||e.submittedInput} — ${e.lessonNumber||`?`}. ${e.lessonName}`,status:o,code:r,message:i,attempts:n,...Z(a)?{diagnostics:Z(a)}:{},data:X({submittedEmail:e.submittedInput,resolvedEmail:e.resolvedEmail,pupilId:e.pupilId,marathonPupilId:e.marathonPupilId,marathonLessonId:e.marathonLessonId,lessonNumber:e.lessonNumber,lessonName:e.lessonName,preflightAccessState:e.preflightAccessState,outcome:t})})}function qr(e,t={},n=new Map){let r=new Set((Array.isArray(t.opened)?t.opened:[]).map(e=>Dr(e.email,e.marathonLessonId))),i=new Map;for(let e of Array.isArray(t.failures)?t.failures:[])i.set(Dr(e.email,e.marathonLessonId),e);return e.matrix.map(e=>{if(e.plannedOutcome===`already_open`)return Kr(e,`already_open`,0,`LESSON_ALREADY_OPEN`,`Lesson access was already open.`);if(e.plannedOutcome===`rejected`)return Kr(e,`rejected`,0,e.code,e.message);if(e.plannedOutcome===`not_attempted`)return Kr(e,`not_attempted`,0,e.code,e.message);let t=Dr(e.resolvedEmail,e.marathonLessonId);if(r.has(t))return Kr(e,`opened`,n.get(Or(e.marathonPupilId,e.marathonLessonId))||1,`LESSON_ACCESS_OPENED`,`Lesson access was opened.`);let a=i.get(t);return a?Kr(e,Gr.has(a.code)?`rejected`:`failed`,Number.isInteger(a.attempts)?a.attempts:1,a.code||`LESSON_ACCESS_WRITE_FAILED`,a.message||`The lesson access change failed.`,a):Kr(e,`not_attempted`,0,`LESSON_ACCESS_NOT_ATTEMPTED`,`The confirmed combination was not attempted.`)})}function Jr(e){return e.filter(e=>e.resolution!==`matched`).map(e=>X({itemId:`input:${e.normalizedEmail||e.submittedInput}`,label:e.submittedInput,status:`rejected`,code:e.code,message:e.message,attempts:0,data:X({submittedInput:e.submittedInput,normalizedEmail:e.normalizedEmail,resolution:e.resolution,...e.offendingCharacters?.length?{offendingCharacters:e.offendingCharacters}:{}})}))}function Yr(e){return e.map((e,t)=>X({itemId:`operation:${t+1}:${e.code}`,label:e.kind===`input`?`Submitted request`:`Lesson-access preflight`,status:e.kind===`input`?`rejected`:`failed`,code:e.code,message:e.message,attempts:e.attempts,...Z(e)?{diagnostics:Z(e)}:{},data:X({stage:e.kind===`input`?`input_validation`:`preflight`})}))}function Xr(e){return e.map(e=>X({itemId:`discovery:${xr(e.resolvedEmail||e.submittedEmail)}`,label:e.resolvedEmail||e.submittedEmail,status:`failed`,code:e.code,message:e.message,attempts:e.attempts,...Z(e)?{diagnostics:Z(e)}:{},data:X({submittedEmail:e.submittedEmail,resolvedEmail:e.resolvedEmail,pupilId:e.pupilId,marathonPupilId:e.marathonPupilId,stage:`lesson_state_discovery`})}))}function Zr(e,t){let n=e.identities.filter(e=>e.resolution===`matched`).length,r=e=>t.filter(t=>t.data.outcome===e).length;return Object.freeze({requestedInputs:e.identities.length,matchedUsers:n,selectedLessons:e.selectedLessons.length,totalCombinations:e.matrix.length,newlyOpened:r(`opened`),alreadyOpen:r(`already_open`),rejected:r(`rejected`),failedWrites:r(`failed`),notAttempted:r(`not_attempted`),inputFailures:e.identities.filter(e=>e.resolution!==`matched`).length,discoveryFailures:e.discoveryFailures.length,operationFailures:e.operationFailures.length})}function Qr(e,t){return e===`cancelled`||e===`interrupted`?e:t.rejected>0||t.failedWrites>0||t.notAttempted>0||t.inputFailures>0||t.discoveryFailures>0||t.operationFailures>0?`completed_with_failures`:`completed`}function $r({plan:e,summary:t={},writeAttempts:n=new Map,startedAt:r,completedAt:i,marathonId:a,marathonName:o=null,terminalStatus:s=null}){let c=qr(e,t,n),l=Jr(e.identities),u=Xr(e.discoveryFailures),d=Yr(e.operationFailures),f=Zr(e,c),p=f.newlyOpened+f.rejected+f.failedWrites,m=f.rejected+f.failedWrites;return Object.freeze({operationType:yr,startedAt:r,completedAt:i,status:Qr(s,f),pageContext:Object.freeze({marathonId:a,marathonName:o}),counts:Object.freeze({requested:f.requestedInputs,eligible:f.totalCombinations,attempted:p,successful:f.newlyOpened,noOp:f.alreadyOpen,skipped:f.inputFailures+f.discoveryFailures+f.operationFailures,failed:m,notAttempted:f.notAttempted}),results:Object.freeze([...l,...d,...u,...c]),message:JSON.stringify(f)})}var{createCapture:ei,recordWriteAttempt:ti,observeRequest:ni,serializeLesson:ri,buildObservedPlan:ii}=vr,{buildExecutionHistoryInput:ai}=Wr;function oi(e,t,n=!1){let r=e.elements?.status?.textContent||``;e.setStatus?.(`${r}${r?` `:``}${t}`,n?`error`:``)}function si(e,t,n){e.shadowRoot?.querySelector?.(`.edvibe-batch-access-history`)?.remove?.();let r=(e.ownerDocument||globalThis.document)?.createElement?.(`button`);r&&(r.type=`button`,r.className=`edvibe-batch-access-history`,r.textContent=`Открыть в истории`,r.addEventListener(`click`,()=>{e.close?.(),n(t)}),e.elements?.footer?.appendChild?.(r))}function ci({transport:e,operationGuard:t,logger:n,executionHistoryService:r,dispatch:i}){return ui({createFeature:_r,sendRequest:e.sendRequest,getConnectionState:e.getConnectionState,canStart:t.canStart,onActiveChange:t.guardedActiveChange(`batch-access`),createDialog:()=>document.createElement(Ln),copyText:e=>navigator.clipboard.writeText(e),persistExecution:r.persistTerminal,openHistory:e=>i({type:W.OPEN_EXECUTION_HISTORY,executionId:e}),getLocationHref:()=>window.location.href,getMarathonName:()=>document.querySelector(`h1`)?.textContent?.trim()||document.title||null,logger:n.createChildLogger(`BatchAccessHistory`)})}var li=Object.freeze({type:W.OPEN_BATCH_LESSON_ACCESS,create(e){let t=ci(e);return()=>t.open()}});function ui(e={}){let{createFeature:t=_r,sendRequest:n,createDialog:r,persistExecution:i,openHistory:a=()=>{},getLocationHref:o=()=>``,getMarathonName:s=()=>null,now:c=()=>new Date,logger:l={log(){}},...u}=e;if(typeof t!=`function`)throw TypeError(`createFeature is required`);if(typeof n!=`function`)throw TypeError(`sendRequest is required`);if(typeof r!=`function`)throw TypeError(`createDialog is required`);if(typeof i!=`function`)throw TypeError(`persistExecution is required`);let d=null;async function f(e,t,r,i){let a=d;a&&ti(a,t,i);let o=await n(e,t,r,i);return a&&ni(a,t,i,o),o}function p(){let e=r(),t=ei();d=t;let n=e.showConfigure.bind(e),u=e.showConfirmation.bind(e),f=e.showValidationErrors.bind(e),p=e.showComplete.bind(e),m=e.showFatalError.bind(e);function h(n={}){t.sequence+=1,t.writeAttempts.clear(),t.attempt={sequence:t.sequence,startedAt:c().toISOString(),submittedEmailInput:String(n.emailInput||``),selectedLessonIds:Array.isArray(n.selectedLessonIds)?[...n.selectedLessonIds]:[],plan:null,terminal:!1},e.shadowRoot?.querySelector?.(`.edvibe-batch-access-history`)?.remove?.()}function g(e=[]){let n=t.attempt;return n?ii({submittedEmailInput:n.submittedEmailInput,selectedLessonIds:n.selectedLessonIds,pupils:t.pupils,lessonsByPupilId:t.lessonsByPupilId,lessonCatalogue:t.lessonCatalogue,errors:e}):null}function _(n,r,u=[]){let d=t.attempt;if(!d||d.terminal)return;d.terminal=!0;let f=d.sequence,p;try{let e=c().toISOString(),i=d.plan||g(u);if(!i)return;p=ai({plan:i,summary:n,writeAttempts:t.writeAttempts,startedAt:d.startedAt,completedAt:e,marathonId:Wn(o()),marathonName:s(),terminalStatus:r})}catch(t){oi(e,`Экранный результат сохранён, но записать историю не удалось.`,!0),l.log(`Batch lesson access history record creation failed:`,t);return}Promise.resolve().then(()=>i(p)).then(n=>{f===t.sequence&&(n?.stored?(oi(e,`Результат сохранён в истории.`),n.record?.id&&si(e,n.record.id,a)):(oi(e,`Экранный результат сохранён, но записать историю не удалось.`,!0),n?.persistenceError&&l.log(`Batch lesson access history persistence failed:`,n.persistenceError)))}).catch(n=>{f===t.sequence&&(oi(e,`Экранный результат сохранён, но записать историю не удалось.`,!0),l.log(`Batch lesson access history persistence failed:`,n))})}return e.showConfigure=(e={})=>(t.lessonCatalogue=Array.isArray(e.lessons)?e.lessons.map(ri):[],t.attempt=null,t.sequence+=1,n(e)),e.showConfirmation=(e={})=>(t.attempt&&(t.attempt.plan=g()),u(e)),e.showValidationErrors=(e=[])=>{let n=f(e);return t.attempt&&_({},null,Array.isArray(e)?e:[e]),n},e.showComplete=(e={})=>{let n=p(e);return t.attempt&&(t.attempt.plan||(t.attempt.plan=g()),_(e,(e.failures||[]).some(e=>e?.code===`INTERNAL_ERROR`)?`interrupted`:null)),n},e.showFatalError=e=>{let n=m(e);return t.attempt&&_({},`interrupted`,[e]),n},e.addEventListener(`edvibe-batch-access-submit`,e=>h(e?.detail)),e.addEventListener(`edvibe-batch-access-restart`,()=>{t.sequence+=1,t.attempt=null,e.shadowRoot?.querySelector?.(`.edvibe-batch-access-history`)?.remove?.()}),e.addEventListener(`edvibe-dialog-close`,()=>{t.attempt?.plan&&!t.attempt.terminal&&_({},`cancelled`)}),e}return t({...u,sendRequest:f,createDialog:p,logger:l})}var di=G`
    [hidden] {
        display: none !important;
    }

    .edvibe-batch-section-card {
        display: flex;
        flex-direction: column;
        width: min(1120px, calc(100vw - 36px));
        max-height: min(900px, calc(100vh - 36px));
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
        border-bottom: 1px solid var(--edvibe-border-subtle);
        background: var(--edvibe-surface-subtle);
    }

    .edvibe-batch-section-eyebrow {
        margin: 0 0 4px;
        color: var(--edvibe-primary);
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
        color: var(--edvibe-text-strong);
    }

    .edvibe-batch-section-header h2 {
        font-size: 22px;
        line-height: 1.25;
    }

    .edvibe-batch-section-description,
    .edvibe-batch-section-heading-row p {
        margin: 5px 0 0;
        color: var(--edvibe-text-muted);
        font-size: 13px;
        line-height: 1.45;
    }

    .edvibe-batch-section-close {
        flex: 0 0 auto;
        min-width: 36px;
        padding: 0;
        font-size: 25px;
        line-height: 1;
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
        font-size: 13px;
    }

    .edvibe-batch-section-field textarea {
        resize: vertical;
        min-height: 92px;
    }

    .edvibe-batch-section-lesson:focus-within {
        outline: 2px solid var(--edvibe-focus-outline);
        outline-offset: -2px;
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
        gap: 8px;
    }

    .edvibe-batch-section-selection-actions {
        justify-content: flex-end;
    }

    .edvibe-batch-section-add-actions {
        justify-content: flex-start;
        margin-bottom: 10px;
    }

    .edvibe-batch-section-selection-actions button,
    .edvibe-batch-section-add-actions button {
        min-height: 34px;
        padding: 7px 10px;
        font-size: 12px;
    }

    .edvibe-batch-section-lessons {
        overflow: auto;
        max-height: 390px;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    .edvibe-batch-section-lesson {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 11px 12px;
        border-bottom: 1px solid var(--edvibe-border-subtle);
        color: var(--edvibe-text);
        font-size: 13px;
        line-height: 1.4;
        cursor: pointer;
    }

    .edvibe-batch-section-lesson:last-child {
        border-bottom: 0;
    }

    .edvibe-batch-section-lesson:hover {
        background: var(--edvibe-surface-subtle);
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
        border: 1px solid var(--edvibe-info-border);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-info-surface);
    }

    .edvibe-batch-section-block header {
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 11px;
    }

    .edvibe-batch-section-block strong {
        color: var(--edvibe-info);
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
        min-height: 31px;
        padding: 5px 8px;
        font-size: 12px;
    }

    .edvibe-batch-section-preview {
        margin-top: 14px;
        padding: 14px;
        border: 1px dashed var(--edvibe-border);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface-subtle);
    }

    .edvibe-batch-section-preview-name {
        margin: 8px 0;
        color: var(--edvibe-text-strong);
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
    .edvibe-batch-section-summary {
        margin-top: 18px;
    }

    .edvibe-batch-section-protocol p {
        margin: 5px 0 0;
    }

    .edvibe-batch-section-summary-group {
        margin-top: 13px;
        padding-top: 11px;
        border-top: 1px solid currentColor;
    }

    .edvibe-batch-section-summary-group h4 {
        margin: 0;
        color: inherit;
        font-size: 13px;
    }

    .edvibe-batch-section-results {
        margin-top: 18px;
        padding: 14px 16px;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        font-size: 13px;
        line-height: 1.48;
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
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    .edvibe-batch-section-result strong {
        color: var(--edvibe-text-strong);
    }

    .edvibe-batch-section-result > span {
        color: var(--edvibe-text-muted);
        font-weight: 700;
    }

    .edvibe-batch-section-result p,
    .edvibe-batch-section-result small {
        grid-column: 1 / -1;
        margin: 0;
        color: var(--edvibe-text-muted);
        overflow-wrap: anywhere;
    }

    .edvibe-batch-section-result.is-created {
        border-color: var(--edvibe-success-border);
        background: var(--edvibe-success-surface);
    }

    .edvibe-batch-section-result.is-failed,
    .edvibe-batch-section-result.is-partially_created {
        border-color: var(--edvibe-warning-border);
        background: var(--edvibe-warning-surface);
    }

    .edvibe-batch-section-result.is-rejected,
    .edvibe-batch-section-result.is-not_attempted {
        background: var(--edvibe-surface-subtle);
    }

    .edvibe-batch-section-fatal-note {
        margin: 12px 0 0;
        font-weight: 650;
    }

    .edvibe-batch-section-empty {
        margin: 0;
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
        border: 2px solid var(--edvibe-info-border);
        border-top-color: var(--edvibe-primary);
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
        font-size: 13px;
        line-height: 1.4;
    }

    .edvibe-batch-section-status[data-state="error"] {
        color: var(--edvibe-danger);
    }

    .edvibe-batch-section-status[data-state="warning"] {
        color: var(--edvibe-warning);
    }

    .edvibe-batch-section-progress {
        display: block;
        width: 100%;
        height: 10px;
        margin-top: 9px;
    }

    .edvibe-batch-section-footer {
        flex: 0 0 auto;
        padding: 18px 24px 22px;
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
        .edvibe-batch-section-card {
            width: 100%;
            max-height: 100vh;
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
`,fi=`https://media-files-y.edvibe.com/local-upload/`;function pi(e=globalThis.crypto){return e?.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`}function mi(e){return`${fi}${encodeURIComponent(String(e||``))}`}function hi(e){let t=String(e||``);if(!t.startsWith(`https://media-files-y.edvibe.com/local-upload/`))return``;try{return decodeURIComponent(t.slice(46))}catch{return``}}function gi(e){let t=Math.max(0,Number(e)||0);return t<1024?`${t} Б`:t<1048576?`${(t/1024).toFixed(1)} КБ`:`${(t/1048576).toFixed(1)} МБ`}function _i(){let e=new Map;return Object.freeze({register(t,n){t&&n&&e.set(String(t),n)},get(t){return e.get(String(t||``))||null},remove(t){e.delete(String(t||``))},clear(){e.clear()},size(){return e.size}})}function vi(e,t=globalThis.crypto){let n=e?.clientId||hi(e?.url)||pi(t);return{...e,clientId:n,url:mi(n),alt:String(e?.alt||``),fileName:String(e?.fileName||``),fileSize:Math.max(0,Number(e?.fileSize)||0),fileType:String(e?.fileType||``),previewUrl:String(e?.previewUrl||``),fileError:String(e?.fileError||``)}}var yi=class{constructor({registry:e=_i(),urlApi:t=globalThis.URL,cryptoApi:n=globalThis.crypto}={}){this.registry=e,this.urlApi=t,this.cryptoApi=n}createBlock(e={}){return vi(e,this.cryptoApi)}hasSelectedFile(e){return!e||e.type!==`image`||!!this.registry.get(e.clientId||hi(e.url))}canSubmit(e=[]){return!e.some(e=>e.type===`image`&&!this.hasSelectedFile(e))}selectFile(e,t){let n=this.releaseBlock(e);if(!t)return n;if(!String(t.type||``).startsWith(`image/`))return{...n,fileError:`Выберите файл изображения.`};let r=n.clientId||pi(this.cryptoApi),i=this.urlApi?.createObjectURL?.(t)||``;return this.registry.register(r,t),{...n,clientId:r,url:mi(r),fileName:String(t.name||``),fileSize:Math.max(0,Number(t.size)||0),fileType:String(t.type||``),previewUrl:i,fileError:``}}clearFile(e){return this.releaseBlock(e)}releaseBlock(e){if(!e||e.type!==`image`)return e;let t=e.clientId||hi(e.url);return t&&this.registry.remove(t),e.previewUrl&&this.urlApi?.revokeObjectURL?.(e.previewUrl),{...vi({...e,clientId:t},this.cryptoApi),fileName:``,fileSize:0,fileType:``,previewUrl:``,fileError:``}}releaseAll(e=[]){return e.map(e=>this.releaseBlock(e))}},bi=_i(),xi=new yi({registry:bi}),Si=G`
    .edvibe-batch-section-file-input {
        cursor: pointer;
    }

    .edvibe-batch-section-file-details {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 8px;
        color: var(--edvibe-text-muted);
        font-size: 12px;
        line-height: 1.4;
    }

    .edvibe-batch-section-file-details button {
        flex: 0 0 auto;
        min-height: 32px;
        padding: 5px 9px;
        font-size: 12px;
    }

    .edvibe-batch-section-file-error {
        margin: 8px 0 0;
        font-size: 12px;
        line-height: 1.4;
    }

    .edvibe-batch-section-image-preview {
        display: block;
        width: 100%;
        max-height: 240px;
        margin-top: 10px;
        object-fit: contain;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface-subtle);
    }
`,Ci=`edvibe-toolbox-batch-section-creation-dialog`,wi=`edvibe-toolbox-batch-section-creation-overlay`,Ti=class extends J{static styles=[cn,ln,un,dn,fn,pn,mn,hn,di,Si];static properties={lessons:{state:!0},selectedLessonIds:{state:!0},blocks:{state:!0},sectionName:{state:!0},mode:{state:!0},recipeReady:{state:!0},recipeErrors:{state:!0},currentPlan:{state:!0},errors:{state:!0},result:{state:!0},fatalResultError:{state:!0},statusMessage:{state:!0},statusState:{state:!0},progress:{state:!0}};constructor(){super(),this.imageController=xi,this.lessons=[],this.selectedLessonIds=new Set,this.blocks=[],this.sectionName=``,this.nextBlockId=1,this.mode=`initializing`,this.recipeReady=!1,this.recipeErrors=[],this.currentPlan=null,this.errors=[],this.result=null,this.fatalResultError=null,this.statusMessage=``,this.statusState=``,this.progress={visible:!1,completed:0,total:0},this.onKeydownBound=e=>this.onKeydown(e)}connectedCallback(){super.connectedCallback(),this.id||=wi,this.ownerDocument?.addEventListener(`keydown`,this.onKeydownBound)}disconnectedCallback(){this.releaseImageFiles(),this.ownerDocument?.removeEventListener(`keydown`,this.onKeydownBound),super.disconnectedCallback()}configure(e={}){let t=e&&typeof e==`object`?e:{};return t.imageController&&(this.imageController=t.imageController),this}showLoading(e=`Загрузка…`){return this.mode=`loading`,this.clearMessages(),this.setStatus(e),this}showConfigure({lessons:e=this.lessons,recipeReady:t=!1,recipeErrors:n=[]}={}){return this.mode=`configure`,this.lessons=Array.isArray(e)?e:[],this.recipeReady=!!t,this.recipeErrors=Array.isArray(n)?n:[],this.selectedLessonIds=new Set,this.currentPlan=null,this.progress={visible:!1,completed:0,total:0},this.clearMessages(),this.setStatus(`Настройте раздел и выберите уроки.`),this}showValidationErrors(e=[]){return this.mode=`validation-error`,this.errors=this.normalizeErrors(e),this.currentPlan=null,this.result=null,this.setStatus(`Исправьте ошибки и повторите проверку.`,`error`),this}showConfirmation(e){return this.mode=`confirm`,this.currentPlan=e,this.clearMessages(),this.setStatus(e?.eligible?.length?`Проверка завершена. Подтвердите создание.`:`Нет уроков, подходящих для создания.`,`warning`),this}showExecution(e={}){this.mode=`executing`;let t=Math.max(0,Number(e.completed)||0),n=Math.max(0,Number(e.total)||0);this.progress={visible:!0,completed:t,total:n};let r=e.lesson?` Сейчас: ${e.lesson.number}. ${e.lesson.name}.`:``;return this.setStatus(`Выполнено ${t} из ${n}.${r}`),this}showComplete(e={},t=null){return this.mode=`complete`,this.clearMessages(),this.result=e,this.fatalResultError=t,this.progress={visible:!1,completed:0,total:0},this.setStatus(t?`Операция остановлена. Частичный результат сохранён.`:`Пакетная операция завершена.`,t?`error`:``),this}showFatalError(e){return this.mode=`fatal-error`,this.clearMessages(),this.errors=this.normalizeErrors([e]),this.setStatus(`Не удалось открыть инструмент.`,`error`),this}clearMessages(){this.errors=[],this.result=null,this.fatalResultError=null,this.statusMessage=``,this.statusState=``}normalizeErrors(e){return(Array.isArray(e)?e:[e]).map(e=>({code:e?.code||`ERROR`,message:e?.message||String(e)}))}setStatus(e,t=``){this.statusMessage=String(e||``),this.statusState=String(t||``)}createBlock(e){let t={id:`block-${this.nextBlockId++}`,type:e};return e===`image`?this.imageController.createBlock({...t,url:``,alt:``}):e===`text`?{...t,text:``}:{...t,label:``,url:``}}blockLabel(e){return{image:`Баннер`,text:`Текст`,link:`Ссылка`}[e]||e}collectDefinition(){return{name:this.sectionName,blocks:this.blocks.map(e=>({...e}))}}updateBlock(e,t,n){this.blocks=this.blocks.map(r=>r.id===e?{...r,[t]:n}:r)}replaceBlock(e,t){this.blocks=this.blocks.map(n=>n.id===e?t:n)}onImageFileChange(e,t){let n=t.currentTarget.files?.[0]||null;this.replaceBlock(e.id,this.imageController.selectFile(e,n)),t.currentTarget.value=``}onClearImage(e){this.replaceBlock(e.id,this.imageController.clearFile(e))}releaseImageFiles(){!this.imageController||this.blocks.length===0||(this.blocks=this.imageController.releaseAll(this.blocks))}onLessonChange(e){let t=Number(e.currentTarget.value),n=new Set(this.selectedLessonIds);e.currentTarget.checked?n.add(t):n.delete(t),this.selectedLessonIds=n}onSelectAll(){this.selectedLessonIds=new Set(this.lessons.map(e=>Number(e.lessonId)))}onClearAll(){this.selectedLessonIds=new Set}onAddBlock(e){[`image`,`text`,`link`].includes(e)&&(this.blocks=[...this.blocks,this.createBlock(e)])}onBlockAction(e,t){let n=this.blocks.findIndex(t=>t.id===e);if(n<0)return;let r=[...this.blocks];if(t===`remove`){let[e]=r.splice(n,1);e?.type===`image`&&this.imageController.releaseBlock(e)}else if(t===`up`&&n>0){let[e]=r.splice(n,1);r.splice(n-1,0,e)}else if(t===`down`&&n<r.length-1){let[e]=r.splice(n,1);r.splice(n+1,0,e)}this.blocks=r}canPreflight(){return[`configure`,`validation-error`].includes(this.mode)&&this.selectedLessonIds.size>0&&this.sectionName.trim().length>0&&this.blocks.length>0&&this.imageController.canSubmit(this.blocks)}onPreflight(){this.canPreflight()&&this.dispatchEvent(new CustomEvent(`edvibe-batch-section-preflight`,{bubbles:!0,composed:!0,detail:{definition:this.collectDefinition(),selectedLessonIds:[...this.selectedLessonIds]}}))}onConfirm(){this.dispatchEvent(new CustomEvent(`edvibe-batch-section-confirm`,{bubbles:!0,composed:!0}))}onCopy(){this.dispatchEvent(new CustomEvent(`edvibe-batch-section-copy`,{bubbles:!0,composed:!0}))}onRestart(){this.releaseImageFiles(),this.sectionName=``,this.blocks=[],this.selectedLessonIds=new Set,this.dispatchEvent(new CustomEvent(`edvibe-batch-section-restart`,{bubbles:!0,composed:!0}))}close(){this.releaseImageFiles(),this.dispatchEvent(new CustomEvent(`edvibe-dialog-close`,{bubbles:!0,composed:!0})),this.remove()}onBackdrop(e){e.target===e.currentTarget&&!this.isBusy()&&this.close()}onKeydown(e){e.key===`Escape`&&!this.isBusy()&&this.close()}isBusy(){return[`loading`,`executing`].includes(this.mode)}resultStatusLabel(e){return{created:`Создано`,rejected:`Отклонено`,failed:`Ошибка`,partially_created:`Нужна ручная проверка`,not_attempted:`Не выполнено`}[e]||e}renderLesson(e,t){let n=Number(e.lessonId);return K`
            <label class="edvibe-batch-section-lesson">
                <input type="checkbox" .value=${String(n)}
                    .checked=${this.selectedLessonIds.has(n)}
                    ?disabled=${!t} @change=${this.onLessonChange}>
                <span>${e.number||`?`}. ${e.name}</span>
            </label>
        `}renderBlockField(e,t,n,r,i){return K`
            <label class="edvibe-batch-section-field" data-field>
                <span>${t}</span>
                ${r?K`<textarea data-block-field=${n} .value=${e[n]||``}
                        ?disabled=${!i}
                        @input=${t=>this.updateBlock(e.id,n,t.currentTarget.value)}></textarea>`:K`<input type="text" data-block-field=${n} .value=${e[n]||``}
                        ?disabled=${!i}
                        @input=${t=>this.updateBlock(e.id,n,t.currentTarget.value)}>`}
            </label>
        `}renderImageFields(e,t){return K`
            <label class="edvibe-batch-section-field" data-field>
                <span>Файл изображения</span>
                <input class="edvibe-batch-section-file-input" type="file" accept="image/*"
                    ?disabled=${!t}
                    @change=${t=>this.onImageFileChange(e,t)}>
            </label>
            ${e.fileName?K`
                <div class="edvibe-batch-section-file-details">
                    <span>${e.fileName} · ${gi(e.fileSize)}</span>
                    <button type="button" data-control="secondary" ?disabled=${!t}
                        @click=${()=>this.onClearImage(e)}>Убрать файл</button>
                </div>
            `:q}
            ${e.fileError?K`<p class="edvibe-batch-section-file-error" data-notice="danger">${e.fileError}</p>`:q}
            ${e.previewUrl?K`
                <img class="edvibe-batch-section-image-preview" src=${e.previewUrl}
                    alt=${e.alt||`Предпросмотр изображения`}>
            `:q}
            ${this.renderBlockField(e,`Альтернативный текст`,`alt`,!1,t)}
        `}renderBlock(e,t,n){return K`
            <article class="edvibe-batch-section-block" data-block-id=${e.id}>
                <header>
                    <strong>${t+1}. ${this.blockLabel(e.type)}</strong>
                    <div class="edvibe-batch-section-block-actions" data-part="actions">
                        <button type="button" data-control="secondary" data-block-action="up" ?disabled=${!n||t===0}
                            @click=${()=>this.onBlockAction(e.id,`up`)}>↑</button>
                        <button type="button" data-control="secondary" data-block-action="down"
                            ?disabled=${!n||t===this.blocks.length-1}
                            @click=${()=>this.onBlockAction(e.id,`down`)}>↓</button>
                        <button type="button" data-control="danger" data-block-action="remove" ?disabled=${!n}
                            @click=${()=>this.onBlockAction(e.id,`remove`)}>Удалить</button>
                    </div>
                </header>
                ${e.type===`image`?this.renderImageFields(e,n):e.type===`text`?K`
                        ${this.renderBlockField(e,`Текст или HTML`,`text`,!0,n)}
                    `:K`
                        ${this.renderBlockField(e,`Подпись кнопки`,`label`,!1,n)}
                        ${this.renderBlockField(e,`URL`,`url`,!1,n)}
                    `}
            </article>
        `}previewDetail(e){return e.type===`image`?e.fileName||`Файл не выбран`:e.type===`text`?e.text||`Текст не указан`:`${e.label||`Без подписи`} → ${e.url||`URL не указан`}`}renderRecipeState(){return this.recipeReady?q:K`
            <section class="edvibe-batch-section-protocol" data-notice="warning">
                <strong>Запись WebSocket ещё не подключена.</strong>
                <p>${this.recipeErrors[0]?.message||`Создание будет заблокировано, пока запись не преобразована в проверенный рецепт.`}</p>
            </section>
        `}renderErrors(){return this.errors.length===0?q:K`
            <section class="edvibe-batch-section-errors" data-notice="danger" aria-live="polite">
                <h3>Что нужно исправить</h3>
                <ul>${this.errors.map(e=>K`<li>${e.code}: ${e.message}</li>`)}</ul>
            </section>
        `}renderSummaryGroup(e,t,n){return K`
            <div class="edvibe-batch-section-summary-group">
                <h4>${e} (${t.length})</h4>
                <ul>${t.length?t.map(e=>K`<li>${n(e)}</li>`):K`<li>Нет</li>`}</ul>
            </div>
        `}renderPlan(){let e=this.currentPlan;return e?K`
            <section class="edvibe-batch-section-summary" data-notice aria-live="polite">
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
        `:q}renderResults(){return this.result?K`
            <section class="edvibe-batch-section-results" aria-live="polite">
                <h3>${this.fatalResultError?`Частичный результат`:`Результат`}</h3>
                <div class="edvibe-batch-section-result-list">
                    ${(this.result.results||[]).map(e=>K`
                        <article class=${`edvibe-batch-section-result is-${e.status}`}>
                            <strong>${e.lessonNumber||`?`}. ${e.lessonName}</strong>
                            <span>${this.resultStatusLabel(e.status)}</span>
                            <p>${e.code?`${e.code}: ${e.message||``}`:e.message||`Готово`}</p>
                            ${e.cleanup?K`<small>Очистка: ${e.cleanup.status}</small>`:q}
                        </article>
                    `)}
                </div>
                ${this.fatalResultError?K`
                    <p class="edvibe-batch-section-fatal-note" data-notice="danger">
                        ${this.fatalResultError.code||`INTERNAL_ERROR`}: ${this.fatalResultError.message}
                    </p>
                `:q}
            </section>
        `:q}render(){let e=[`configure`,`validation-error`].includes(this.mode),t=this.isBusy(),n=this.canPreflight();return K`
            <div class="edvibe-batch-section-overlay" data-part="overlay" @click=${this.onBackdrop}>
                <section class="edvibe-batch-section-card" data-part="dialog" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-section-title">
                    <header class="edvibe-batch-section-header">
                        <div><p class="edvibe-batch-section-eyebrow">Edvibe Toolbox</p>
                            <h2 id="edvibe-batch-section-title">Создать раздел в нескольких уроках</h2>
                            <p class="edvibe-batch-section-description">Соберите раздел один раз, проверьте план и примените его к выбранным урокам.</p></div>
                        <button class="edvibe-batch-section-close" data-control="secondary" type="button" aria-label="Закрыть"
                            ?disabled=${t} @click=${()=>this.close()}>&times;</button>
                    </header>
                    <div class="edvibe-batch-section-body">
                        <section class="edvibe-batch-section-configure" ?hidden=${!e}>
                            <div class="edvibe-batch-section-grid">
                                <div class="edvibe-batch-section-column">
                                    <label class="edvibe-batch-section-field" data-field><span>Название раздела</span>
                                        <input class="edvibe-batch-section-name" type="text" maxlength="200"
                                            autocomplete="off" placeholder="Например, Летняя акция"
                                            .value=${this.sectionName} ?disabled=${!e}
                                            @input=${e=>{this.sectionName=e.currentTarget.value}}></label>
                                    <div class="edvibe-batch-section-heading-row"><div><h3>Уроки</h3><p>Выберите все уроки, куда нужно добавить раздел.</p></div>
                                        <div class="edvibe-batch-section-selection-actions" data-part="actions">
                                            <button class="edvibe-batch-section-select-all" data-control="secondary" type="button" ?disabled=${!e} @click=${this.onSelectAll}>Выбрать все</button>
                                            <button class="edvibe-batch-section-clear-all" data-control="secondary" type="button" ?disabled=${!e} @click=${this.onClearAll}>Очистить</button>
                                        </div></div>
                                    <div class="edvibe-batch-section-lessons" aria-label="Список уроков">
                                        ${this.lessons.length?this.lessons.map(t=>this.renderLesson(t,e)):K`<p class="edvibe-batch-section-empty" data-part="empty-state">Уроки не найдены.</p>`}
                                    </div>
                                </div>
                                <div class="edvibe-batch-section-column">
                                    <div class="edvibe-batch-section-heading-row"><div><h3>Конструктор</h3><p>Порядок блоков сохранится при выполнении.</p></div></div>
                                    <div class="edvibe-batch-section-add-actions" data-part="actions" role="group" aria-label="Добавить блок">
                                        ${[[`image`,`+ Баннер`],[`text`,`+ Текст`],[`link`,`+ Ссылка`]].map(([t,n])=>K`
                                            <button type="button" data-control="secondary" data-add-block=${t} ?disabled=${!e}
                                                @click=${()=>this.onAddBlock(t)}>${n}</button>`)}
                                    </div>
                                    <div class="edvibe-batch-section-blocks">
                                        ${this.blocks.length?this.blocks.map((t,n)=>this.renderBlock(t,n,e)):K`<p class="edvibe-batch-section-empty" data-part="empty-state">Добавьте баннер, текст или ссылку.</p>`}
                                    </div>
                                    <section class="edvibe-batch-section-preview" aria-live="polite">
                                        <h3>Предпросмотр структуры</h3>
                                        <p class="edvibe-batch-section-preview-name">${this.sectionName.trim()||`Название не задано`}</p>
                                        <ol class="edvibe-batch-section-preview-blocks">
                                            ${this.blocks.length?this.blocks.map((e,t)=>K`<li>${t+1}. ${this.blockLabel(e.type)}: ${this.previewDetail(e)}</li>`):K`<li>Блоки не добавлены</li>`}
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
                        <p class="edvibe-batch-section-status" data-part="status" data-state=${this.statusState} role="status" aria-live="polite">${this.statusMessage}</p>
                        <progress class="edvibe-batch-section-progress" data-part="progress" max=${this.progress.total}
                            value=${this.progress.completed} ?hidden=${!this.progress.visible}></progress>
                    </div>
                    <footer class="edvibe-batch-section-footer" data-part="actions">
                        <button class="edvibe-batch-section-copy" data-control="secondary" type="button" ?hidden=${this.mode!==`complete`} @click=${this.onCopy}>Копировать отчёт</button>
                        <button class="edvibe-batch-section-restart" data-control="secondary" type="button" ?hidden=${this.mode!==`complete`} @click=${this.onRestart}>Создать другой раздел</button>
                        <button class="edvibe-batch-section-confirm" data-control type="button" ?hidden=${this.mode!==`confirm`}
                            ?disabled=${!this.recipeReady||!this.currentPlan?.eligible?.length} @click=${this.onConfirm}>Подтвердить создание</button>
                        <button class="edvibe-batch-section-preflight" data-control type="button" ?hidden=${!e}
                            ?disabled=${!n} @click=${this.onPreflight}>Проверить план</button>
                    </footer>
                </section>
            </div>
        `}};customElements.get(`edvibe-toolbox-batch-section-creation-dialog`)||customElements.define(Ci,Ti);var Ei=`batch_section_creation`,Di=Object.freeze([`completed`,`completed_with_failures`,`cancelled`,`interrupted`]),Oi=Object.freeze([`created`,`failed`,`partially_created`]),ki=Object.freeze([`failed`,`partially_created`]);function Ai(e){let t=String(e||``).match(/\/marathon\/(\d+)(?:\/|$)/);return t?String(t[1]):null}function ji(e,t=``){return String(e??``).trim()||t}function Mi(e){let t=ji(e);if(!t)return null;try{let e=new URL(t);return e.protocol===`http:`||e.protocol===`https:`?e.href:null}catch{return null}}function Ni(e){return ji(e)}function Pi(e){return Object.freeze(e.map(e=>Object.freeze(e)))}function Fi(e,t){let n=ji(e?.type,`unknown`,80),r={order:t,blockId:ji(e?.id,`block-${t+1}`,160),type:n},i=ji(e?.clientId,``,500);return i&&(r.clientId=i),n===`image`?(r.url=Mi(e?.url),r.alt=Ni(e?.alt,1e3)||null):n===`text`?r.content=Ni(e?.text,1e4)||null:n===`link`&&(r.label=Ni(e?.label,1e3)||null,r.url=Mi(e?.url)),r}function Ii(e={}){let t=Array.isArray(e?.blocks)?e.blocks.map(Fi):[];return Object.freeze({name:ji(e?.name,`Unnamed section`,500),blocks:Pi(t)})}function Li(e){return String(e||``).replace(/([a-z0-9])([A-Z])/g,`$1_$2`).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)}function Ri(e){return Li(e.at(-1)).includes(`id`)}function zi(e,t,n,r=[],i=new WeakSet){if(e!=null){if(typeof e!=`object`){if(!Ri(r))return;let i=typeof e==`number`||typeof e==`boolean`?e:ji(e,``,500);if(i===``)return;n.push({source:t,name:r.join(`.`),value:i});return}if(!i.has(e)){i.add(e);try{if(Array.isArray(e)){e.forEach((e,a)=>zi(e,t,n,[...r,String(a)],i));return}for(let[a,o]of Object.entries(e))zi(o,t,n,[...r,a],i)}finally{i.delete(e)}}}}function Bi(e={}){let t=[];zi(e?.captured,`captured`,t),zi(e?.generated,`generated`,t),zi(e?.blockGenerated,`block_generated`,t);let n=[],r=new Set;for(let e of t){let t=`${e.source}\u0000${e.name}\u0000${String(e.value)}`;r.has(t)||(r.add(t),n.push(e))}return Pi(n)}function Vi(e={},t=null){let n=e.lessonId??e.LessonId??t,r=e.marathonLessonId??e.MarathonLessonId??null,i=e.lessonNumber??e.number??e.Number??null,a=e.lessonName??e.name??e.Name??null;return Object.freeze({lessonId:n??null,marathonLessonId:r===void 0?null:r,number:i===void 0?null:i,name:ji(a,`Unnamed lesson`,500)})}function Hi(e){let t=e?.lessonId??e?.LessonId;return t==null?null:String(t)}function Ui(e,t,n){return{lessonId:e?.lessonId??e?.LessonId??null,marathonLessonId:e?.marathonLessonId??e?.MarathonLessonId??null,lessonNumber:e?.lessonNumber??e?.number??e?.Number??null,lessonName:e?.lessonName??e?.name??e?.Name??null,status:e?.status||t,code:e?.code,message:e?.message,attempts:e?.attempts,captured:e?.captured,generated:e?.generated,blockGenerated:e?.blockGenerated,cleanup:e?.cleanup,terminalStatus:n}}function Wi(e={},t={},n=null){let r=new Map;for(let t of e?.rejected||[]){let e=Hi(t);e!==null&&r.set(e,Ui(t,`rejected`,n))}let i=new Map;for(let e of t?.results||[]){let t=Hi(e);if(t===null)continue;let a=e?.status||(r.has(t)?`rejected`:null);i.set(t,Ui(e,a,n))}let a=new Map;for(let t of e?.eligible||[]){let e=Hi(t);e!==null&&a.set(e,t)}let o=Array.isArray(e?.selectedLessonIds)?e.selectedLessonIds.map(String):[],s=[],c=new Set;for(let e of o){let t=i.get(e)||r.get(e);!t&&a.has(e)&&(t=Ui(a.get(e),`not_attempted`,n)),t||=Ui({lessonId:e,lessonName:`Lesson ${e}`},`not_attempted`,n),s.push(t),c.add(e)}for(let e of[...r.values(),...i.values()]){let t=Hi(e);t!==null&&c.has(t)||(s.push(e),t!==null&&c.add(t))}for(let[e,t]of a.entries())c.has(e)||(s.push(Ui(t,`not_attempted`,n)),c.add(e));return s}function Gi(e){return Oi.includes(e)}function Ki(e){return ki.includes(e)}function qi(e,t={}){let n=e.filter(e=>Gi(e.status)).length,r=e.filter(e=>e.status===`not_attempted`).length,i=n+r,a=Array.isArray(t?.eligible)?t.eligible.length:0;return Object.freeze({requested:e.length,eligible:Math.max(a,i),attempted:n,successful:e.filter(e=>e.status===`created`).length,noOp:0,skipped:e.filter(e=>e.status===`rejected`).length,failed:e.filter(e=>Ki(e.status)).length,notAttempted:r})}var Ji=new Set(Di);function Yi(e,t){return e?.code?ji(e.code,`UNKNOWN_ERROR`,120):{created:`SECTION_CREATED`,rejected:`PREFLIGHT_REJECTED`,failed:`SECTION_CREATION_FAILED`,partially_created:`SECTION_PARTIALLY_CREATED`,not_attempted:t===`cancelled`?`OPERATION_CANCELLED`:`OPERATION_INTERRUPTED`}[e?.status]||`UNKNOWN_RESULT`}function Xi(e,t){return e?.message?ji(e.message,`No message was provided.`,1e3):{created:`Section created successfully.`,rejected:`The lesson was rejected during preflight.`,failed:`Section creation failed.`,partially_created:`Section creation failed after the section had been created.`,not_attempted:t===`cancelled`?`Not attempted because the confirmed run was cancelled.`:`Not attempted because the confirmed run was interrupted.`}[e?.status]||`The operation produced an unknown result.`}function Zi(e,t){if(e?.status!==`partially_created`)return null;let n=e?.cleanup;if(!n)return Object.freeze({attempted:!1,status:`unavailable`,code:t===`interrupted`?`CLEANUP_UNAVAILABLE_AFTER_INTERRUPTION`:`CLEANUP_UNAVAILABLE`,message:t===`interrupted`?`Cleanup was unavailable after the batch was interrupted.`:`Cleanup was unavailable for this partially created section.`});let r=!!n.attempted,i=[`success`,`failed`,`unavailable`].includes(n.status)?n.status:r?`failed`:`unavailable`;return Object.freeze({attempted:r,status:i,code:n.code?ji(n.code,`CLEANUP_FAILED`,120):i===`success`?`CLEANUP_SUCCEEDED`:i===`unavailable`?`CLEANUP_UNAVAILABLE`:`CLEANUP_FAILED`,message:n.message?ji(n.message,`Cleanup failed.`,1e3):i===`success`?`Cleanup completed successfully.`:i===`unavailable`?`Cleanup was unavailable.`:`Cleanup failed.`})}function Qi(e,t){return Ki(e?.status)?Object.freeze({code:Yi(e,t),message:Xi(e,t),attemptCount:Number.isSafeInteger(e?.attempts)&&e.attempts>=0?e.attempts:1}):null}function $i(e,t,n){let r=Vi(e),i=ji(e?.status,`not_attempted`,80),a=Number.isSafeInteger(e?.attempts)&&e.attempts>=0?e.attempts:+!!Gi(i),o={...e,status:i},s=Yi(o,n),c=Xi(o,n);return Object.freeze({itemId:r.lessonId===null?null:String(r.lessonId),label:`${r.number??`?`}. ${r.name}`,status:i,code:s,message:c,attempts:a,...Z(e)?{diagnostics:Z(e)}:{},data:Object.freeze({lesson:r,section:t,preflight:Object.freeze({status:i===`rejected`?`rejected`:`eligible`,code:i===`rejected`?s:`PREFLIGHT_ELIGIBLE`,message:i===`rejected`?c:`The lesson passed preflight and was included in the confirmed plan.`}),creationFailure:Qi(o,n),cleanup:Zi(o,n),identifiers:Bi(e)})})}function ea(e,t,n){return Ji.has(e)?e:t?`interrupted`:n.some(e=>[`rejected`,`failed`,`partially_created`,`not_attempted`].includes(e.status))?`completed_with_failures`:`completed`}function ta({plan:e,result:t={},startedAt:n,completedAt:r,marathonId:i,marathonName:a=null,terminalStatus:o=null,fatalError:s=null}){let c=Ji.has(o)?o:s?`interrupted`:null,l=Ii(e?.definition||t?.definition||{}),u=Wi(e,t,c).map(e=>$i(e,l,c)),d=ea(o,s||t?.fatalError,u),f=qi(u,e);return Object.freeze({operationType:Ei,startedAt:n,completedAt:r,status:d,pageContext:Object.freeze({marathonId:i,marathonName:a}),counts:f,results:Object.freeze(u),message:JSON.stringify({sectionName:l.name,blockCount:l.blocks.length,counts:f})})}function na(e,t,n=!1){let r=e.elements?.status?.textContent||``;e.setStatus?.(`${r}${r?` `:``}${t}`,n?`error`:``)}function ra(e,t,n){e.shadowRoot?.querySelector?.(`.edvibe-batch-section-history`)?.remove?.();let r=(e.ownerDocument||globalThis.document)?.createElement?.(`button`);r&&(r.type=`button`,r.className=`edvibe-batch-section-history`,r.textContent=`Открыть в истории`,r.addEventListener(`click`,()=>{e.close?.(),n(t)}),(e.elements?.footer||e.shadowRoot?.querySelector?.(`.edvibe-batch-section-footer`))?.appendChild?.(r))}function ia({createDialog:e,persistExecution:t,openHistory:n=()=>{},getLocationHref:r=()=>``,getMarathonName:i=()=>null,now:a=()=>new Date,logger:o={log(){}}}){if(typeof e!=`function`)throw TypeError(`createDialog is required`);if(typeof t!=`function`)throw TypeError(`persistExecution is required`);return function(){let s=e(),c=null,l=null,u=null,d=!1,f=0,p=s.showConfigure.bind(s),m=s.showConfirmation.bind(s),h=s.showExecution.bind(s),g=s.showComplete.bind(s),_=s.showFatalError.bind(s);function v(){s.shadowRoot?.querySelector?.(`.edvibe-batch-section-history`)?.remove?.()}function y(){f+=1,c=null,l=null,u=null,d=!1,v()}function b(e,p=null,m=null){if(!c||d)return;d=!0;let h=f,g;try{let t=a().toISOString();g=ta({plan:c,result:e||l||{},startedAt:u||t,completedAt:t,marathonId:Ai(r()),marathonName:i(),terminalStatus:p,fatalError:m})}catch(e){na(s,`Экранный результат сохранён, но записать историю не удалось.`,!0),o.log(`Batch section creation history record creation failed:`,e);return}Promise.resolve().then(()=>t(g)).then(e=>{h===f&&(e?.stored?(na(s,`Результат сохранён в истории.`),e.record?.id&&ra(s,e.record.id,n)):(na(s,`Экранный результат сохранён, но записать историю не удалось.`,!0),e?.persistenceError&&o.log(`Batch section creation history persistence failed:`,e.persistenceError)))}).catch(e=>{h===f&&(na(s,`Экранный результат сохранён, но записать историю не удалось.`,!0),o.log(`Batch section creation history persistence failed:`,e))})}return s.showConfigure=(...e)=>(y(),p(...e)),s.showConfirmation=e=>{f+=1,v(),c=e,l={definition:e?.definition,results:Array.isArray(e?.rejected)?e.rejected.map(e=>Ui(e,`rejected`)):[]},u=a().toISOString(),d=!1;let t=m(e);return e?.eligible?.length||b(l),t},s.showExecution=(e={})=>(c&&Array.isArray(e?.results)&&(l={definition:c.definition,results:[...e.results]}),h(e)),s.showComplete=(e={},t=null)=>{let n=g(e,t);return l=e,b(e,t?`interrupted`:null,t),n},s.showFatalError=e=>{let t=_(e);return c&&b(l,`interrupted`,e),t},s.addEventListener(`edvibe-batch-section-restart`,y),s.addEventListener(`edvibe-dialog-close`,()=>{c&&!d&&b(l,`cancelled`)}),s}}var aa=new Date().toISOString(),oa=Object.freeze({version:1,reviewedDynamicFields:!0,steps:Object.freeze([Object.freeze({id:`create-section`,controller:`LessonSectionWsController`,method:`AddStageSection`,projectName:`Books`,valueTemplate:Object.freeze({LessonId:`{{lesson.lessonId}}`,StageSectionName:`{{section.name}}`,SortId:4}),capture:Object.freeze({sectionId:`Value.StageSectionId`}),marksSectionCreated:!0}),Object.freeze({id:`confirm-section-name`,controller:`LessonSectionWsController`,method:`EditStageSection`,projectName:`Books`,valueTemplate:Object.freeze({LessonId:`{{lesson.lessonId}}`,StageSectionId:`{{captured.sectionId}}`,StageSectionName:`{{section.name}}`,SortId:4})}),Object.freeze({id:`save-image`,controller:`SaveExerciseWsController`,method:`SaveExercise`,projectName:`Exercises`,forEach:`blocks`,blockTypes:Object.freeze([`image`]),valueTemplate:Object.freeze({ClassId:null,Domain:`edvibe.com`,ExerciseView:Object.freeze({Id:0,Number:`{{blockIndex}}`,Name:``,IsHidePupil:!1,Type:27,HomeworkLessonId:null,PersonalMaterialId:null,LessonSectionId:`{{captured.sectionId}}`,Descriptions:Object.freeze([``]),ChangeExerciseImages:Object.freeze([Object.freeze({ImageId:687640222,FullImageId:687640223,ImageUrl:`https://media-y.edvibe.com/files/LessonExerciseImages/b455a98f-ef63-49b5-a6f4-2111c7edebc6.png`,FullImageUrl:`https://media-y.edvibe.com/files/LessonExerciseImages/035f9f67-1474-4eb3-8359-5eb93ea68a2e.png`,cropped:!1})])}),AiUsed:!1,UsedNewConstructor:!0,ClientTime:aa,DeviceType:`desktop`})}),Object.freeze({id:`save-cta`,controller:`SaveExerciseWsController`,method:`SaveExercise`,projectName:`Exercises`,forEach:`blocks`,blockTypes:Object.freeze([`link`]),valueTemplate:Object.freeze({ClassId:null,Domain:`edvibe.com`,ExerciseView:Object.freeze({Id:0,Number:`{{blockIndex}}`,Name:``,IsHidePupil:!1,Type:29,HomeworkLessonId:null,PersonalMaterialId:null,LessonSectionId:`{{captured.sectionId}}`,Button:Object.freeze({Link:`{{block.url}}`,Text:`{{block.label}}`})}),AiUsed:!1,UsedNewConstructor:!0,ClientTime:aa,DeviceType:`desktop`})})])}),sa=`https://media-files-y.edvibe.com/api/MediaFile/create-multiple`;function ca(e,t,n={}){let r=Error(t);return r.code=e,Object.assign(r,n),r}function la(e){let t=String(e||``);if(!t.startsWith(`https://media-files-y.edvibe.com/local-upload/`))return``;try{return decodeURIComponent(t.slice(46))}catch{return``}}function ua(e,t){let n=typeof e==`string`||e instanceof URL?String(e):String(e?.url||``);try{return new URL(n,t||`https://edvibe.com/`)}catch{return null}}function da(e,t){let n=ua(e,t);return!!n&&n.protocol===`https:`&&(n.hostname===`edvibe.com`||n.hostname.endsWith(`.edvibe.com`))}function fa(e,t,n=globalThis.Headers){if(!e)return``;try{if(n)return new n(e).get(t)||``}catch{}let r=String(t).toLowerCase();if(Array.isArray(e)){let t=e.find(([e])=>String(e).toLowerCase()===r);return t?String(t[1]||``):``}for(let[t,n]of Object.entries(e))if(String(t).toLowerCase()===r)return String(n||``);return``}function pa(e){let t=``,n=e.location?.href||`https://edvibe.com/`,r=e.fetch,i=e.Headers;function a(e,r){if(!da(e,n))return;let a=fa(r,`authorization`,i);a&&(t=a)}typeof r==`function`&&(e.fetch=function(e,t){return a(e,t?.headers||e?.headers),r.apply(this,arguments)});let o=e.XMLHttpRequest?.prototype;if(o?.open&&o?.setRequestHeader){let e=o.open,r=o.setRequestHeader,i=new WeakMap;o.open=function(t,n){return i.set(this,n),e.apply(this,arguments)},o.setRequestHeader=function(e,a){return String(e).toLowerCase()===`authorization`&&da(i.get(this),n)&&a&&(t=String(a)),r.apply(this,arguments)}}return Object.freeze({getAuthorization:()=>t,capture:a})}function ma(e){if(!e||!Array.isArray(e.steps))return e;let t=e.steps.map(e=>{if(e.id!==`save-image`)return e;let t=e.valueTemplate?.ExerciseView||{};return Object.freeze({...e,valueTemplate:Object.freeze({...e.valueTemplate,ExerciseView:Object.freeze({...t,ChangeExerciseImages:Object.freeze([Object.freeze({ImageId:`{{block.asset.imageId}}`,FullImageId:`{{block.asset.fullImageId}}`,ImageUrl:`{{block.asset.imageUrl}}`,FullImageUrl:`{{block.asset.fullImageUrl}}`,cropped:!1})])})})})});return Object.freeze({...e,steps:Object.freeze(t)})}async function ha({definition:e,registry:t,authorization:n,fetchFn:r,FormDataCtor:i}){let a=(e?.blocks||[]).filter(e=>e.type===`image`);if(a.length===0)return e;if(!n)throw ca(`AUTH_CONTEXT_UNAVAILABLE`,`Edvibe authorization context is unavailable. Reload the page and try again.`);let o=new i;o.append(`Type`,`8`),o.append(`SaveOriginal`,`true`),o.append(`IsOriginalSizeOutputImage`,`true`);let s=[];a.forEach((e,n)=>{let r=la(e.url),i=t?.get?.(r);if(!r||!i)throw ca(`IMAGE_FILE_REQUIRED`,`Image block ${n+1} requires a selected file.`);s.push(r),o.append(`Files[${n}]`,i,i.name),o.append(`Selections[${n}].X`,`0`),o.append(`Selections[${n}].Y`,`0`),o.append(`Selections[${n}].Width`,`0`),o.append(`Selections[${n}].Height`,`0`),o.append(`Ids[${n}]`,r)});let c;try{c=await r(sa,{method:`POST`,headers:{accept:`*/*`,authorization:n},body:o,mode:`cors`,credentials:`include`})}catch(e){throw ca(`MEDIA_UPLOAD_FAILED`,`Could not upload the selected image.`,{cause:e})}if(!c?.ok)throw ca(`MEDIA_UPLOAD_FAILED`,`Edvibe image upload failed with HTTP ${c?.status||`unknown`}.`);let l;try{l=await c.json()}catch(e){throw ca(`INVALID_MEDIA_RESPONSE`,`Edvibe returned an invalid image response.`,{cause:e})}if(!l?.IsSuccess)throw ca(`MEDIA_UPLOAD_REJECTED`,l?.ErrorMessage||`Edvibe rejected the selected image.`);if((l?.Data?.ErrorItems||[]).length>0)throw ca(`MEDIA_UPLOAD_PARTIAL`,`Edvibe failed to upload one or more selected images.`,{errorItems:l.Data.ErrorItems});let u=new Map((l?.Data?.Items||[]).map(e=>[String(e.OldId||``),Object.freeze({imageId:e.Id,fullImageId:e.IdFull,imageUrl:e.Url,fullImageUrl:e.UrlFull})]));for(let e of s)if(!u.has(e))throw ca(`INVALID_MEDIA_RESPONSE`,`Edvibe did not return an asset for every selected image.`);let d=e.blocks.map(e=>{if(e.type!==`image`)return e;let t=la(e.url);return Object.freeze({...e,asset:u.get(t)})});return Object.freeze({...e,blocks:Object.freeze(d)})}function ga({originalFactory:e,registry:t,authorizationCapture:n,fetchFn:r,FormDataCtor:i}){return typeof e==`function`?function(a){let o=e(a),s=new WeakMap;async function c(e){if(!e||typeof e!=`object`)return e;let a=s.get(e);return a||(a=ha({definition:e,registry:t,authorization:n.getAuthorization(),fetchFn:r,FormDataCtor:i}),s.set(e,a)),a}return Object.freeze({...o,async createSection(e){let t=await c(e.definition);return o.createSection({...e,definition:t})},async cleanupSection(e){let t=await c(e.definition);return o.cleanupSection({...e,definition:t})}})}:null}var _a=globalThis.document?pa(globalThis):null,va=ma(oa),ya=_a?ga({originalFactory:Pa,registry:bi,authorizationCapture:_a,fetchFn:globalThis.fetch.bind(globalThis),FormDataCtor:globalThis.FormData}):Pa,ba=`edvibe-toolbox-batch-section-creation-dialog`,xa=new Set([...new Set([`WS_UNAVAILABLE`,`REQUEST_TIMEOUT`,`SEND_FAILED`]),`SERVER_REJECTED`,`INVALID_RESPONSE`]),Sa=/\{\{\s*([^{}]+?)\s*\}\}/g;function Ca(e){let t=String(e||``).trim();if(!t)return``;try{let e=new URL(t);return e.protocol===`http:`||e.protocol===`https:`?e.href:``}catch{return``}}function wa(e,t){let n=String(e?.type||``).trim(),r=String(e?.id||`block-${t+1}`).trim();return Object.freeze(n===`image`?{id:r,type:n,url:String(e?.url||``).trim(),alt:String(e?.alt||``).trim()}:n===`text`?{id:r,type:n,text:String(e?.text||``).trim()}:n===`link`?{id:r,type:n,label:String(e?.label||``).trim(),url:String(e?.url||``).trim()}:{id:r,type:n})}function Ta(e={}){let t=[],n=String(e?.name||``).trim(),r=Array.isArray(e?.blocks)?e.blocks.map(wa):[],i=new Set;n||t.push(Y(`SECTION_NAME_REQUIRED`,`Section name is required.`)),r.length===0&&t.push(Y(`SECTION_BLOCK_REQUIRED`,`Add at least one section block.`));for(let[e,n]of r.entries())i.has(n.id)&&t.push(Y(`DUPLICATE_BLOCK_ID`,`Block ${e+1} has a duplicate ID.`)),i.add(n.id),n.type===`image`?Ca(n.url)||t.push(Y(`IMAGE_URL_REQUIRED`,`Image block ${e+1} requires an HTTP(S) URL.`)):n.type===`text`?n.text||t.push(Y(`TEXT_REQUIRED`,`Text block ${e+1} cannot be empty.`)):n.type===`link`?(n.label||t.push(Y(`LINK_LABEL_REQUIRED`,`Link block ${e+1} requires a label.`)),Ca(n.url)||t.push(Y(`LINK_URL_REQUIRED`,`Link block ${e+1} requires an HTTP(S) URL.`))):t.push(Y(`UNSUPPORTED_BLOCK_TYPE`,`Block ${e+1} has unsupported type "${n.type||`unknown`}".`));return{definition:Object.freeze({name:n,blocks:Object.freeze(r)}),errors:t}}function Ea(e,t=0){let n=e?.LessonId??e?.lessonId??e?.Id,r=e?.MarathonLessonId??e?.marathonLessonId??e?.Id;return Object.freeze({lessonId:Number(n),marathonLessonId:Number(r),number:Number(e?.Number??e?.number??t)+(e?.Number===void 0?0:1),name:String(e?.Name??e?.name??`Lesson ${t+1}`)})}function Da(e){let t=e?.Value??e;if(!t||!Array.isArray(t.Sections))throw Y(`INVALID_LESSON_RESPONSE`,`The lesson response did not contain a normal sections array.`);return t.Sections}function Oa(e){return Object.freeze(e.map(e=>Object.freeze({...e})))}function ka({lessons:e,selectedLessonIds:t,definition:n,inspectionsByLessonId:r}){let i=Ta(n);if(i.errors.length>0)throw Y(`INVALID_SECTION_DEFINITION`,`The section definition is invalid.`,{validationErrors:i.errors});let a=new Set((t||[]).map(Number)),o=[],s=[];for(let t of(e||[]).filter(e=>a.has(Number(e.lessonId)))){let e=r.get(Number(t.lessonId));if(!e||e.error){let n=e?.error||Y(`INVALID_LESSON_RESPONSE`,`The lesson was not inspected.`);s.push({...t,code:n.code||`INVALID_LESSON_RESPONSE`,message:n.message||`The lesson could not be inspected.`});continue}try{Da(e.structure).some(e=>String(e?.Name||``).trim()===i.definition.name)?s.push({...t,code:`SECTION_NAME_COLLISION`,message:`A section named "${i.definition.name}" already exists.`}):o.push({...t})}catch(e){s.push({...t,code:e.code||`INVALID_LESSON_RESPONSE`,message:e.message})}}let c=i.definition.blocks.map((e,t)=>Object.freeze({index:t,type:e.type,id:e.id}));return Object.freeze({definition:i.definition,selectedLessonIds:Object.freeze([...a]),eligible:Oa(o),rejected:Oa(s),blockSummary:Object.freeze(c)})}function Aa(e,t){return String(t||``).split(`.`).filter(Boolean).reduce((e,t)=>e?.[t],e)}function ja(e,t){if(e.startsWith(`generated.`)){let n=e.slice(10),r=t.block?t.blockGenerated:t.generated;return n in r||(r[n]=t.createId()),r[n]}return Aa(t,e)}function Ma(e,t){if(Array.isArray(e))return e.map(e=>Ma(e,t));if(e&&typeof e==`object`)return Object.fromEntries(Object.entries(e).map(([e,n])=>[e,Ma(n,t)]));if(typeof e!=`string`)return e;let n=e.match(/^\{\{\s*([^{}]+?)\s*\}\}$/);return n?ja(n[1],t):e.replace(Sa,(e,n)=>{let r=ja(n,t);return r==null?``:String(r)})}function Na(e){let t=[];(!e||e.version!==1)&&t.push(Y(`RECIPE_MISSING`,`A version 1 recording recipe is required.`)),e&&e.reviewedDynamicFields!==!0&&t.push(Y(`RECIPE_NOT_REVIEWED`,`The recording recipe must explicitly confirm reviewed dynamic fields.`)),e&&!Array.isArray(e.steps)&&t.push(Y(`RECIPE_STEPS_REQUIRED`,`The recording recipe requires steps.`));for(let n of e?.steps||[])(!n.controller||!n.method||!n.projectName||!n.valueTemplate)&&t.push(Y(`INVALID_RECIPE_STEP`,`Recipe step "${n.id||n.method||`unknown`}" is incomplete.`));return t}function Pa({recipe:e=null,cryptoApi:t=globalThis.crypto,requestDelayMs:n=300}={}){let r=Na(e),i=()=>t?.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`;function a(e,t){let n=[];for(let r=0;r<e.length;){let i=e[r];if(i.forEach!==`blocks`){n.push({step:i,block:null,blockIndex:null}),r+=1;continue}let a=[];for(;r<e.length&&e[r].forEach===`blocks`;)a.push(e[r]),r+=1;t.blocks.forEach((e,t)=>{let r=a.find(t=>!Array.isArray(t.blockTypes)||t.blockTypes.includes(e.type));r&&n.push({step:r,block:e,blockIndex:t})})}return n}async function o({steps:e,marathonId:t,lesson:r,definition:o,sendRequest:s,wait:c,captured:l={},generated:u={}}){let d=new Map,f=a(e,o),p=!1;for(let[e,a]of f.entries()){let m=a.block?d.get(a.block.id)||{}:u;a.block&&d.set(a.block.id,m);let h={marathonId:t,lesson:r,section:o,block:a.block,blockIndex:a.blockIndex,captured:l,generated:u,blockGenerated:m,createId:i};try{let t=await s(a.step.controller,a.step.method,a.step.projectName,Ma(a.step.valueTemplate,h));for(let[e,n]of Object.entries(a.step.capture||{})){let r=Aa(t,n);if(r===void 0)throw Y(`INVALID_RESPONSE`,`Recipe capture "${e}" was missing after ${a.step.id||a.step.method}.`);l[e]=r}a.step.marksSectionCreated===!0&&(p=!0),e<f.length-1&&n>0&&await c(n)}catch(e){throw e.partialCreated=p,e.captured={...l},e.generated={...u},e}}return{captured:{...l},generated:{...u}}}return Object.freeze({isReady:r.length===0,errors:Object.freeze(r),async createSection(t){if(r.length>0)throw Y(`RECIPE_UNAVAILABLE`,r[0].message);return o({...t,steps:e.steps})},async cleanupSection(t){if(!Array.isArray(e?.cleanupSteps)||e.cleanupSteps.length===0)return{attempted:!1,status:`unavailable`};try{return await o({...t,steps:e.cleanupSteps}),{attempted:!0,status:`success`}}catch(e){return{attempted:!0,status:`failed`,code:e.code||`CLEANUP_FAILED`,message:e.message}}}})}async function Fa({sendRequest:e,marathonId:t,pageSize:n=100}){return(await tr({sendRequest:e,marathonId:t,pageSize:n})).map(Ea)}async function Ia({lessons:e,selectedLessonIds:t,sendRequest:n,wait:r,delayMs:i=300}){let a=new Set((t||[]).map(Number)),o=(e||[]).filter(e=>a.has(Number(e.lessonId))),s=new Map;for(let[e,t]of o.entries()){try{let e=await nr({sendRequest:n,lessonId:t.lessonId});s.set(Number(t.lessonId),{structure:e})}catch(e){s.set(Number(t.lessonId),{error:e})}e<o.length-1&&i>0&&await r(i)}return s}function La(e,t,n={}){return{lessonId:e.lessonId,marathonLessonId:e.marathonLessonId,lessonNumber:e.number,lessonName:e.name,status:t,...n}}function Ra(e,t){return e?.code===`WS_UNAVAILABLE`||e?.code===`SEND_FAILED`&&!t().isOpen||!xa.has(e?.code)}async function za({marathonId:e,plan:t,adapter:n,sendRequest:r,wait:i,getConnectionState:a,lessonDelayMs:o=300,onProgress:s=()=>{}}){if(!n?.isReady)throw Y(`RECIPE_UNAVAILABLE`,n?.errors?.[0]?.message||`Recording recipe unavailable.`);let c=t.rejected.map(e=>La(e,`rejected`,{code:e.code,message:e.message})),l=0;for(let[u,d]of t.eligible.entries()){s({completed:u,total:t.eligible.length,lesson:d,results:[...c]});try{l+=1;let a=await n.createSection({marathonId:e,lesson:d,definition:t.definition,sendRequest:r,wait:i});c.push(La(d,`created`,{captured:a.captured,generated:a.generated,attempts:1}))}catch(o){let s=!!o.partialCreated,f=Ra(o,a),p=null;if(s&&!f&&(p=await n.cleanupSection({marathonId:e,lesson:d,definition:t.definition,sendRequest:r,wait:i,captured:o.captured||{},generated:o.generated||{}})),c.push(La(d,s?`partially_created`:`failed`,{code:o.code||`UNKNOWN_ERROR`,message:o.message||`Section creation failed.`,captured:o.captured,generated:o.generated,cleanup:p,attempts:o.attempts||1})),f){for(let e of t.eligible.slice(u+1))c.push(La(e,`not_attempted`,{code:`OPERATION_INTERRUPTED`,message:`Not attempted because the batch operation stopped.`}));throw o.partialResult={definition:t.definition,results:c,attempts:l,fatalError:o},o}}s({completed:u+1,total:t.eligible.length,lesson:d,results:[...c]}),u<t.eligible.length-1&&o>0&&await i(o)}return{definition:t.definition,results:c,attempts:l}}function Ba(e){let t=Array.isArray(e?.results)?e.results:[],n=e=>t.filter(t=>t.status===e).length,r=[`Section: ${e?.definition?.name||`Unknown`}`,`Blocks: ${e?.definition?.blocks?.length||0}`,`Created: ${n(`created`)}`,`Rejected in preflight: ${n(`rejected`)}`,`Failed: ${n(`failed`)}`,`Partially created: ${n(`partially_created`)}`,`Not attempted: ${n(`not_attempted`)}`,``];for(let e of t)r.push(`${e.lessonNumber||`?`}. ${e.lessonName} — ${e.status}`+(e.code?` — ${e.code}: ${e.message||``}`:``)),e.captured?.sectionId!==void 0&&r.push(`  Captured sectionId: ${e.captured.sectionId}`),e.cleanup&&r.push(`  Cleanup: ${e.cleanup.status}`);return r.join(`
`).trim()}function Va({transport:e,operationGuard:t,logger:n,executionHistoryService:r,dispatch:i}){let a=ia({createDialog:()=>document.createElement(Ci),persistExecution:r.persistTerminal,openHistory:e=>i({type:W.OPEN_EXECUTION_HISTORY,executionId:e}),getLocationHref:()=>window.location.href,getMarathonName:()=>document.querySelector(`h1`)?.textContent?.trim()||document.title||null,logger:n.createChildLogger(`BatchSectionCreationHistory`)}),o=ya({recipe:va,cryptoApi:window.crypto});return Ua({sendRequest:e.sendRequest,getConnectionState:e.getConnectionState,canStart:t.canStart,onActiveChange:t.guardedActiveChange(`batch-section-creation`),adapter:o,createDialog:a,copyText:e=>navigator.clipboard.writeText(e),logger:n.createChildLogger(`BatchSectionCreation`)})}var Ha=Object.freeze({type:W.OPEN_BATCH_SECTION_CREATION,create(e){let t=Va(e);return()=>t.open()}});function Ua({sendRequest:e,getConnectionState:t,canStart:n,onActiveChange:r,adapter:i,createDialog:a=()=>document.createElement(ba),copyText:o=async()=>{},logger:s={log(){}}}){let c=!1,l=!1,u=null,d=null,f=[],p=null,m=null;function h(){c&&(c=!1,r(!1))}function g(){l=!1,u=null,f=[],p=null,m=null,h()}async function _(t){if(!l){l=!0;try{let n=t?.detail?.definition||{},r=t?.detail?.selectedLessonIds||[],i=Ta(n),a=[...i.errors];if(r.length===0&&a.push(Y(`LESSON_SELECTION_REQUIRED`,`Select at least one lesson.`)),a.length>0){u.showValidationErrors(a);return}u.showLoading(`Проверяем выбранные уроки…`);let o=await Ia({lessons:f,selectedLessonIds:r,sendRequest:e,wait:Te});p=ka({lessons:f,selectedLessonIds:r,definition:i.definition,inspectionsByLessonId:o}),u.showConfirmation(p)}catch(e){u.showValidationErrors([e])}finally{l=!1}}}async function v(){if(!(l||!p?.eligible?.length)){l=!0;try{m=await za({marathonId:d,plan:p,adapter:i,sendRequest:e,wait:Te,getConnectionState:t,onProgress:e=>u.showExecution(e)}),u.showComplete(m)}catch(e){m=e.partialResult||{definition:p.definition,results:p.rejected,fatalError:e},u.showComplete(m,e)}finally{l=!1}}}async function y(){m&&await o(Ba(m))}function b(){p=null,m=null,u.showConfigure({lessons:f,recipeReady:i?.isReady,recipeErrors:i?.errors||[]})}async function x(){if(!(c||document.getElementById(`edvibe-toolbox-batch-section-creation-overlay`))){if(!n()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}if(d=Wn(window.location.href),!d){window.alert(`Open an Edvibe marathon page before creating sections.`);return}c=!0,r(!0);try{if(u=a(),u.addEventListener(`edvibe-dialog-close`,g),u.addEventListener(`edvibe-batch-section-preflight`,_),u.addEventListener(`edvibe-batch-section-confirm`,v),u.addEventListener(`edvibe-batch-section-copy`,y),u.addEventListener(`edvibe-batch-section-restart`,b),u.configure(),(document.body||document.documentElement).appendChild(u),u.showLoading(`Загружаем уроки марафона…`),f=await Fa({sendRequest:e,marathonId:d}),f.length===0)throw Y(`EMPTY_LESSON_CATALOGUE`,`No lessons were found.`);u.showConfigure({lessons:f,recipeReady:i?.isReady,recipeErrors:i?.errors||[]}),s.log(`Batch section creation ready for MarathonId ${d}.`)}catch(e){s.log(`Batch section creation initialization failed (${e.code||`UNKNOWN_ERROR`}).`);try{u?.showFatalError?.(e)}finally{h()}}}}return{open:x,isRunning:()=>l}}var Wa=G`
    .dialog {
        display: flex;
        flex-direction: column;
        width: min(900px, 96vw);
        max-height: 92vh;
    }

    .dialog header,
    .dialog footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 18px 22px;
        border-bottom: 1px solid var(--edvibe-border-subtle);
    }

    .dialog footer {
        border-bottom: 0;
        border-top: 1px solid var(--edvibe-border-subtle);
    }

    .dialog h2,
    .dialog p {
        margin: 0;
    }

    .dialog header p {
        margin-top: 4px;
        color: var(--edvibe-text-muted);
    }

    .icon {
        min-width: 36px;
        padding: 0;
        font-size: 24px;
        line-height: 1;
    }

    .dialog main {
        display: grid;
        gap: 16px;
        overflow: auto;
        padding: 20px 22px;
    }

    .toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .selection {
        margin-left: auto;
        color: var(--edvibe-text-muted);
    }

    .lessons {
        max-height: 280px;
        overflow: auto;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    .lesson {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-bottom: 1px solid var(--edvibe-border-subtle);
        font-weight: 400;
    }

    .lesson:last-child {
        border-bottom: 0;
    }

    .preflight,
    .result {
        padding: 14px;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
    }

    .preflight {
        border: 0;
    }

    .preflight h3,
    .preflight h4 {
        margin: 0 0 8px;
    }

    .preflight dl {
        display: flex;
        gap: 20px;
        margin: 0 0 14px;
    }

    .preflight dl div {
        display: flex;
        gap: 6px;
    }

    .preflight dd {
        margin: 0;
        font-weight: 700;
    }

    .preflight ul {
        margin: 0 0 14px;
        padding-left: 20px;
    }

    .result textarea {
        min-height: 220px;
        resize: vertical;
        font: 12px/1.5 ui-monospace, monospace;
    }

    .result-actions {
        margin-top: 8px;
    }

    @media(max-width:640px) {
        .dialog {
            max-height: 100vh;
        }

        .dialog header,
        .dialog footer,
        .dialog main {
            padding: 14px;
        }

        .preflight dl {
            flex-wrap: wrap;
        }
    }
`,Ga=`edvibe-toolbox-batch-section-deletion-dialog`,Ka=class extends J{static styles=[cn,ln,un,dn,fn,pn,Wa];static properties={options:{state:!0},sectionName:{state:!0},selectedLessonIds:{state:!0},plan:{state:!0},executionId:{state:!0},busy:{state:!0},statusMessage:{state:!0},statusVisible:{state:!0},resultReport:{state:!0},resultVisible:{state:!0}};constructor(){super(),this.options=null,this.sectionName=``,this.selectedLessonIds=new Set,this.plan=null,this.executionId=null,this.busy=!1,this.statusMessage=``,this.statusVisible=!1,this.resultReport=``,this.resultVisible=!1}configure(e={}){return this.options=e&&typeof e==`object`?e:{},this.selectedLessonIds=new Set,this.plan=null,this.executionId=null,this.resultReport=``,this.resultVisible=!1,this}selectedIds(){return[...this.selectedLessonIds]}setLessonSelected(e,t){if(this.busy)return;let n=new Set(this.selectedLessonIds);t?n.add(Number(e)):n.delete(Number(e)),this.selectedLessonIds=n}selectAll(){this.busy||(this.selectedLessonIds=new Set((this.options?.lessons||[]).map(e=>Number(e.lessonId))))}clearSelection(){this.busy||(this.selectedLessonIds=new Set)}setBusy(e){this.busy=!0,this.showStatus(e)}clearBusy(){this.busy=!1}async inspect(){let e=this.selectedIds();if(!this.sectionName.trim()||e.length===0){this.showStatus(`Enter a section name and select at least one lesson.`);return}this.setBusy(`Inspecting lessons…`);try{this.plan=await this.options.onInspect({sectionName:this.sectionName,selectedLessonIds:e,onProgress:({current:e,total:t})=>this.showStatus(`Inspecting ${e}/${t}…`)})}catch(e){this.showStatus(e.message||`Inspection failed.`)}finally{this.clearBusy()}}async execute(){if(!(!this.plan||this.plan.eligible.length===0)){this.setBusy(`Deleting sections…`);try{let e=await this.options.onExecute(this.plan,({current:e,total:t})=>this.showStatus(`Deleting ${e}/${t}…`));this.resultReport=String(e.report||``),this.resultVisible=!0,this.executionId=e.history?.stored&&e.history.record?.id||null;let t=e.fatalError?`Stopped after an operation-wide error. Partial results retained.`:`Deletion finished.`,n=e.history?.stored?` Saved to execution history.`:e.history?.persistenceError?` The visible report is intact, but history could not be saved.`:``;this.showStatus(`${t}${n}`)}catch(e){this.showStatus(e.message||`Deletion failed.`)}finally{this.clearBusy()}}}showStatus(e){this.statusMessage=String(e||``),this.statusVisible=!0}close(){this.busy||this.options?.onClose?.()}openHistory(){this.executionId&&this.options?.onOpenHistory?.(this.executionId)}renderPlanGroup(e,t,n){return K`
            <h4>${e}</h4>
            <ul>${t.length?t.map(e=>K`<li>${n(e)}</li>`):K`<li>None</li>`}</ul>
        `}renderPlan(){return this.plan?K`
            <section class="preflight" data-notice>
                <h3>Preflight</h3>
                <dl>
                    <div><dt>Selected</dt><dd>${this.plan.selectedCount}</dd></div>
                    <div><dt>Eligible</dt><dd>${this.plan.eligible.length}</dd></div>
                    <div><dt>Rejected</dt><dd>${this.plan.rejected.length}</dd></div>
                </dl>
                ${this.renderPlanGroup(`Will delete`,this.plan.eligible,e=>`#${e.number} ${e.name} → section ${e.sectionId}`)}
                ${this.renderPlanGroup(`Will not modify`,this.plan.rejected,e=>`#${e.number} ${e.name}: ${e.code} — ${e.message}`)}
            </section>
        `:q}render(){let e=this.options?.lessons||[],t=!!this.plan?.eligible?.length&&!this.resultVisible;return K`
            <div class="overlay" data-part="overlay">
                <section class="dialog" data-part="dialog" role="dialog" aria-modal="true" aria-labelledby="title">
                    <header>
                        <div><h2 id="title">Delete section from lessons</h2><p>Every lesson is inspected before any deletion.</p></div>
                        <button class="icon close" data-control="secondary" type="button" aria-label="Close" ?disabled=${this.busy}
                            @click=${()=>this.close()}>×</button>
                    </header>
                    <main>
                        <label data-field>Exact section name<input class="section-name" type="text" autocomplete="off"
                            placeholder="Ogłoszenie" .value=${this.sectionName} ?disabled=${this.busy}
                            @input=${e=>{this.sectionName=e.currentTarget.value}}></label>
                        <div class="toolbar" data-part="actions">
                            <button class="select-all" data-control="secondary" type="button" ?disabled=${this.busy} @click=${this.selectAll}>Select all</button>
                            <button class="clear" data-control="secondary" type="button" ?disabled=${this.busy} @click=${this.clearSelection}>Clear</button>
                            <span class="selection">${this.selectedLessonIds.size} selected</span>
                        </div>
                        <div class="lessons">
                            ${e.map(e=>K`
                                <label class="lesson">
                                    <input type="checkbox" .value=${String(e.lessonId)}
                                        .checked=${this.selectedLessonIds.has(Number(e.lessonId))}
                                        ?disabled=${this.busy}
                                        @change=${t=>this.setLessonSelected(e.lessonId,t.currentTarget.checked)}>
                                    <span>#${e.number} ${e.name}</span>
                                </label>
                            `)}
                        </div>
                        <div class="status" data-notice ?hidden=${!this.statusVisible}>${this.statusMessage}</div>
                        ${this.renderPlan()}
                        <section class="result" ?hidden=${!this.resultVisible}>
                            <label data-field><span>Report</span><textarea readonly .value=${this.resultReport}></textarea></label>
                            <div class="result-actions" data-part="actions">
                                <button class="copy" data-control="secondary" type="button" ?disabled=${this.busy}
                                    @click=${()=>this.options?.onCopy?.(this.resultReport)}>Copy report</button>
                                <button class="history" data-control type="button" ?hidden=${!this.executionId}
                                    ?disabled=${this.busy} @click=${this.openHistory}>Open in history</button>
                            </div>
                        </section>
                    </main>
                    <footer data-part="actions">
                        <button class="secondary close" data-control="secondary" type="button" ?disabled=${this.busy}
                            @click=${()=>this.close()}>Cancel</button>
                        <button class="inspect" data-control type="button" ?hidden=${this.resultVisible} ?disabled=${this.busy}
                            @click=${this.inspect}>${this.plan?`Run preflight again`:`Inspect selected lessons`}</button>
                        <button class="danger execute" data-control="danger" type="button" ?hidden=${!t} ?disabled=${this.busy}
                            @click=${this.execute}>Confirm deletion</button>
                    </footer>
                </section>
            </div>
        `}};customElements.get(`edvibe-toolbox-batch-section-deletion-dialog`)||customElements.define(Ga,Ka);var qa=s({DIALOG_TAG:()=>Ja,buildDeleteRequest:()=>no,buildExecutionHistoryInput:()=>so,buildExecutionPlan:()=>to,createBatchSectionDeletionFeature:()=>co,executePlan:()=>ao,extractNormalSections:()=>Qa,findExactSectionMatches:()=>$a,formatReport:()=>oo,inspectLessonsSequentially:()=>io,loadLessonCatalogue:()=>ro,normalizeLesson:()=>Za,normalizeSectionName:()=>Xa,parseMarathonId:()=>Wn}),Ja=`edvibe-toolbox-batch-section-deletion-dialog`,Ya=new Set([`SERVER_REJECTED`,`INVALID_RESPONSE`,`REQUEST_TIMEOUT`,`SEND_FAILED`,`WS_UNAVAILABLE`]);function Xa(e){let t=String(e||``).trim();if(!t)throw Y(`SECTION_NAME_REQUIRED`,`Enter the exact section name.`);return t}function Za(e,t=0){let n=Number(e?.LessonId??e?.lessonId??e?.Id);return Object.freeze({lessonId:n,marathonLessonId:Number(e?.MarathonLessonId??e?.marathonLessonId??e?.Id),number:Number(e?.Number??e?.number??t+1),name:String(e?.Name??e?.name??`Lesson ${t+1}`)})}function Qa(e){let t=e?.Value??e?.value??e;if(!t||!Array.isArray(t.Sections))throw Y(`INVALID_LESSON_RESPONSE`,`The lesson response did not contain a normal Sections array.`);return t.Sections}function $a(e,t){let n=Xa(t);if(!Array.isArray(e))throw Y(`INVALID_LESSON_RESPONSE`,`Sections must be an array.`);return e.filter(e=>String(e?.Name??``)===n)}function eo(e,t,n){return Object.freeze({...e,status:`rejected`,code:t,message:n})}function to({lessons:e,selectedLessonIds:t,sectionName:n,inspectionsByLessonId:r}){let i=Xa(n),a=new Set((t||[]).map(Number)),o=[],s=[];for(let t of(e||[]).filter(e=>a.has(Number(e.lessonId)))){let e=r.get(Number(t.lessonId));if(!e||e.error){let n=e?.error;s.push(eo(t,n?.code||`INVALID_LESSON_RESPONSE`,n?.message||`The lesson could not be inspected.`));continue}try{let n=$a(Qa(e.response),i);if(n.length===0)s.push(eo(t,`SECTION_NOT_FOUND`,`Section "${i}" was not found.`));else if(n.length>1)s.push(eo(t,`SECTION_NAME_AMBIGUOUS`,`Found ${n.length} sections named "${i}".`));else{let e=Number(n[0]?.Id);!Number.isSafeInteger(e)||e<=0?s.push(eo(t,`UNSUPPORTED_SECTION_TYPE`,`The matching section has no safe normal-section ID.`)):o.push(Object.freeze({...t,sectionName:i,sectionId:e}))}}catch(e){s.push(eo(t,e.code||`INVALID_LESSON_RESPONSE`,e.message))}}return Object.freeze({sectionName:i,selectedCount:a.size,eligible:Object.freeze(o),rejected:Object.freeze(s)})}function no(e){return Object.freeze({controller:`LessonSectionWsController`,method:`DeleteStageSection`,projectName:`Books`,value:Object.freeze({StageSectionId:e.sectionId})})}async function ro({sendRequest:e,marathonId:t,pageSize:n=100}){return(await tr({sendRequest:e,marathonId:t,pageSize:n})).map(Za)}async function io({lessons:e,selectedLessonIds:t,sendRequest:n,wait:r,requestDelayMs:i=250,onProgress:a}){let o=new Set((t||[]).map(Number)),s=e.filter(e=>o.has(Number(e.lessonId))),c=new Map;for(let[e,t]of s.entries()){try{let e=await nr({sendRequest:n,lessonId:t.lessonId});Qa(e),c.set(t.lessonId,{response:e})}catch(e){c.set(t.lessonId,{error:Y(e.code||`INVALID_LESSON_RESPONSE`,e.message||`Inspection failed.`)})}a?.({current:e+1,total:s.length,lesson:t}),e<s.length-1&&i>0&&await r(i)}return c}async function ao({plan:e,sendRequest:t,wait:n,requestDelayMs:r=300,onProgress:i}){let a=e.rejected.map(e=>({...e})),o=null;for(let[s,c]of e.eligible.entries()){if(o){a.push({...c,status:`not_attempted`,code:`OPERATION_INTERRUPTED`,message:`Not attempted because the operation stopped.`});continue}try{let e=no(c),n=await t(e.controller,e.method,e.projectName,e.value),r=n?.Value??n?.value;if(n?.IsSuccess===!1||n?.isSuccess===!1||r===!1||r==null)throw Y(`INVALID_RESPONSE`,`Deletion was not positively confirmed.`);a.push({...c,status:`deleted`,code:`DELETED`,message:`Section deleted.`})}catch(e){let t=e.code||`DELETE_FAILED`;a.push({...c,status:`failed`,code:t,message:e.message||`Deletion failed.`,diagnosticObservations:[e]}),Ya.has(t)||(o=e)}i?.({current:s+1,total:e.eligible.length,entry:c,results:[...a]}),s<e.eligible.length-1&&r>0&&!o&&await n(r)}return Object.freeze({plan:e,results:Object.freeze(a.map(Object.freeze)),fatalError:o})}function oo(e){let t=[`Edvibe Toolbox: batch section deletion`,`Section: ${e.plan.sectionName}`,`Selected: ${e.plan.selectedCount}`,`Eligible: ${e.plan.eligible.length}`,`Rejected: ${e.plan.rejected.length}`,``];for(let n of e.results){let e=`#${n.number} ${n.name} (lesson ${n.lessonId})`,r=n.sectionId?`, section ${n.sectionId}`:``;t.push(`[${n.status}] ${e}${r}: ${n.code} — ${n.message}`)}return t.join(`
`)}function so({marathonId:e,startedAt:t,completedAt:n,result:r}){let i=r.results.filter(e=>e.status===`deleted`).length,a=r.results.filter(e=>e.status===`failed`).length,o=r.results.filter(e=>e.status===`rejected`).length,s=r.results.filter(e=>e.status===`not_attempted`).length,c=r.fatalError?`interrupted`:a>0||o>0?`completed_with_failures`:`completed`;return Object.freeze({operationType:`batch-section-deletion`,startedAt:t,completedAt:n,status:c,pageContext:Object.freeze({marathonId:e}),counts:Object.freeze({requested:r.plan.selectedCount,eligible:r.plan.eligible.length,attempted:i+a,successful:i,noOp:0,skipped:o,failed:a,notAttempted:s}),results:Object.freeze(r.results.map(e=>Object.freeze({itemId:`lesson-${e.lessonId}`,label:`#${e.number} ${e.name}`,status:e.status,code:e.code,message:e.message,attempts:e.status===`not_attempted`||e.status===`rejected`?0:1,...Z(e,{correlationId:`delete-section:${e.lessonId}`,operationName:`delete_section`})?{diagnostics:Z(e,{correlationId:`delete-section:${e.lessonId}`,operationName:`delete_section`})}:{},data:Object.freeze({lessonId:e.lessonId,marathonLessonId:e.marathonLessonId,sectionId:e.sectionId||null,sectionName:r.plan.sectionName})})))})}function co({sendRequest:e,getConnectionState:t,canStart:n,onActiveChange:r,createDialog:i,copyText:a,persistExecution:o=async()=>Object.freeze({stored:!1}),openHistory:s=()=>{},logger:c={log(){}}}){let l=!1;async function u(){if(l||!n()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}let u=Wn(window.location.href);if(!u){window.alert(`Open an Edvibe marathon page first.`);return}if(t?.()?.ready===!1){window.alert(`Edvibe WebSocket connection is not ready.`);return}l=!0,r(!0);let d=i();document.body.append(d);try{let t=await ro({sendRequest:e,marathonId:u});d.configure({marathonId:u,lessons:t,async onInspect(n){let r=await io({lessons:t,selectedLessonIds:n.selectedLessonIds,sendRequest:e,wait:Te,onProgress:n.onProgress});return to({lessons:t,selectedLessonIds:n.selectedLessonIds,sectionName:n.sectionName,inspectionsByLessonId:r})},async onExecute(t,n){let r=new Date().toISOString(),i=await ao({plan:t,sendRequest:e,wait:Te,onProgress:n}),a=new Date().toISOString(),s;try{s=await o(so({marathonId:u,startedAt:r,completedAt:a,result:i}))}catch(e){s=Object.freeze({stored:!1,persistenceError:e}),c.log(`Batch section deletion history persistence failed:`,e)}return{...i,report:oo(i),history:s}},onCopy:a,onOpenHistory(e){d.remove(),l=!1,r(!1),s(e)},onClose(){d.remove(),l=!1,r(!1)}})}catch(e){c.log(`Failed to open batch section deletion:`,e),d.remove(),l=!1,r(!1),window.alert(e.message||`Failed to load lessons.`)}}return Object.freeze({open:u})}var lo=`batch-section-deletion`,uo=new Set([`completed`,`completed_with_failures`,`cancelled`,`interrupted`]),fo=new Set([`deleted`,`failed`]);function po(e,t=``,n=1e3){let r=String(e??``).trim();return r?r.length<=n?r:`${r.slice(0,n-1)}…`:t}function mo(e){let t=String(e||``).match(/\/marathon\/(\d+)(?:\/|$)/);return t?String(t[1]):null}function ho(e){let t=e?.lessonId??e?.LessonId;return t==null?null:String(t)}function go(e={}){return e.discoveryOutcome?po(e.discoveryOutcome,`inspection_failed`,120):{SECTION_NOT_FOUND:`not_found`,SECTION_NAME_AMBIGUOUS:`ambiguous`,UNSUPPORTED_SECTION_TYPE:`unsupported_section_type`,INVALID_LESSON_RESPONSE:`invalid_lesson_response`}[e.code]||(e.sectionId?`matched`:`inspection_failed`)}function _o(e={},t=[]){let n=po(e.sectionName,`Unnamed section`,500),r=(e.eligible||[]).map(e=>Object.freeze({...e,sectionName:n,sectionType:`normal`,discoveryOutcome:`matched`,matchCount:1})),i=(e.rejected||[]).map(e=>Object.freeze({...e,sectionName:n,sectionId:null,sectionType:null,discoveryOutcome:go(e),matchCount:e.code===`SECTION_NOT_FOUND`?0:null,attempts:0}));return Object.freeze({...e,sectionName:n,selectedLessonIds:Object.freeze([...t]),selectedCount:Number.isSafeInteger(e.selectedCount)?e.selectedCount:t.length,eligible:Object.freeze(r),rejected:Object.freeze(i)})}function vo(e,t){return e.code?po(e.code,`UNKNOWN_RESULT`,120):e.status===`deleted`?`DELETED`:e.status===`rejected`?`PREFLIGHT_REJECTED`:e.status===`failed`?`DELETE_FAILED`:t===`cancelled`?`OPERATION_CANCELLED`:`OPERATION_INTERRUPTED`}function yo(e,t){return e.message?po(e.message,`No message was provided.`):e.status===`deleted`?`Section deleted.`:e.status===`rejected`?`The lesson was rejected during discovery.`:e.status===`failed`?`The validated deletion request failed.`:t===`cancelled`?`Not attempted because the confirmed run was cancelled.`:`Not attempted because the confirmed run was interrupted.`}function bo(e={},t={},n=null){let r=new Map;for(let t of e.rejected||[])r.set(ho(t),{...t,status:`rejected`,attempts:0});for(let e of t.results||[])r.set(ho(e),{...e});let i=new Map((e.eligible||[]).map(e=>[ho(e),e])),a=[],o=new Set;for(let t of e.selectedLessonIds||[]){let n=String(t),s=r.get(n);!s&&i.has(n)&&(s={...i.get(n),status:`not_attempted`,attempts:0}),s||={lessonId:t,name:`Lesson ${t}`,status:`not_attempted`,attempts:0,sectionName:e.sectionName},a.push(s),o.add(n)}for(let e of[...r.values(),...i.values()]){let t=ho(e);t!==null&&o.has(t)||(a.push(r.get(t)||{...e,status:`not_attempted`,attempts:0}),t!==null&&o.add(t))}return a.map(e=>{let t=po(e.status,`not_attempted`,80);return{...e,status:t,attempts:Number.isSafeInteger(e.attempts)&&e.attempts>=0?e.attempts:+!!fo.has(t),terminalStatus:n}})}function xo(e){if(Number.isSafeInteger(e.matchCount)&&e.matchCount>=0)return e.matchCount;if(e.sectionId)return 1;if(e.code===`SECTION_NOT_FOUND`)return 0;let t=String(e.message||``).match(/Found (\d+) sections/);return t?Number(t[1]):null}function So(e,t,n){let r=e.status,i=vo(e,n),a=yo(e,n),o=go(e),s=Object.freeze({lessonId:e.lessonId??null,marathonLessonId:e.marathonLessonId??null,number:e.number??null,name:po(e.name,`Unnamed lesson`,500)});return Object.freeze({itemId:s.lessonId===null?null:`lesson-${s.lessonId}`,label:`${s.number??`?`}. ${s.name}`,status:r,code:i,message:a,attempts:e.attempts,...Z(e)?{diagnostics:Z(e)}:{},data:Object.freeze({lesson:s,section:Object.freeze({requestedName:po(e.sectionName||t.sectionName,`Unnamed section`,500),matchedId:e.sectionId??null,supportedType:e.sectionId?`normal`:null}),discovery:Object.freeze({outcome:o,code:o===`matched`?`DISCOVERY_MATCHED`:i,message:o===`matched`?`Exactly one supported normal lesson section matched the requested name.`:a,matchCount:xo(e)}),finalOutcome:r,deletionFailure:r===`failed`?Object.freeze({code:i,message:a,attemptCount:e.attempts}):null})})}function Co(e,t,n){return uo.has(e)?e:t?`interrupted`:n.some(e=>[`rejected`,`failed`,`not_attempted`].includes(e.status))?`completed_with_failures`:`completed`}function wo({plan:e,result:t={},startedAt:n,completedAt:r,marathonId:i,marathonName:a=null,terminalStatus:o=null,fatalError:s=null}){let c=uo.has(o)?o:s||t.fatalError?`interrupted`:null,l=bo(e,t,c).map(t=>So(t,e,c)),u=Co(o,s||t.fatalError,l),d=l.filter(e=>fo.has(e.status)).length,f=l.filter(e=>e.status===`not_attempted`).length,p=Object.freeze({requested:l.length,eligible:Math.max(e.eligible?.length||0,d+f),attempted:d,successful:l.filter(e=>e.status===`deleted`).length,noOp:0,skipped:l.filter(e=>e.status===`rejected`).length,failed:l.filter(e=>e.status===`failed`).length,notAttempted:f});return Object.freeze({operationType:lo,startedAt:n,completedAt:r,status:u,pageContext:Object.freeze({marathonId:i,marathonName:a}),counts:p,results:Object.freeze(l),message:JSON.stringify({sectionName:e.sectionName,counts:p})})}function To(e,t){let n=e.shadowRoot?.querySelector?.(`.status`)?.textContent||``;e.showStatus?.(`${n}${n?` `:``}${t}`)}function Eo(e,t,n){let r=(e.ownerDocument||globalThis.document)?.createElement?.(`button`);r&&(r.type=`button`,r.className=`edvibe-batch-section-deletion-history`,r.textContent=`Open in history`,r.addEventListener(`click`,()=>n?.(t)),e.shadowRoot?.querySelector?.(`footer`)?.appendChild?.(r))}function Do(e={}){let{createFeature:t=co,createDialog:n,persistExecution:r,getLocationHref:i=()=>``,getMarathonName:a=()=>null,now:o=()=>new Date,logger:s={log(){}},...c}=e;if(typeof n!=`function`)throw TypeError(`createDialog is required`);if(typeof r!=`function`)throw TypeError(`persistExecution is required`);function l(){let e=n(),t=e.configure.bind(e),c=null,l=null,u=null,d=!1,f=0;async function p(e,t=null,n=null){let d=f;try{let s=o().toISOString(),p=wo({plan:c,result:e||l||{},startedAt:u||s,completedAt:s,marathonId:mo(i()),marathonName:a(),terminalStatus:t,fatalError:n}),m=await r(p);return d===f?m:Object.freeze({stored:!1,stale:!0})}catch(e){return s.log(`Batch section deletion history persistence failed:`,e),Object.freeze({stored:!1,persistenceError:e})}}return e.configure=(n={})=>{let r=n.onInspect,i=n.onExecute,a=n.onClose,s=n.onOpenHistory;return t({...n,async onInspect(t){let n=await r(t);return f+=1,c=_o(n,t?.selectedLessonIds||[]),l={plan:c,results:[]},u=o().toISOString(),d=!1,c.eligible.length||(d=!0,p(l).then(t=>{t?.stored?(To(e,`Result saved to execution history.`),t.record?.id&&Eo(e,t.record.id,s)):t?.persistenceError&&To(e,`The visible preflight is intact, but history could not be saved.`)})),c},async onExecute(e,t){c=_o(e,e.selectedLessonIds||[]),u||=o().toISOString(),d=!1;try{let e=await i(c,(e={})=>{Array.isArray(e.results)&&(l={plan:c,results:[...e.results],fatalError:e.fatalError||null}),t?.(e)});l=e,d=!0;let n=await p(e,e.fatalError?`interrupted`:null,e.fatalError||null);return{...e,history:n}}catch(e){throw d=!0,await p(l,`interrupted`,e),e}},onOpenHistory:s,onClose(){c&&!d&&(d=!0,p(l,`cancelled`)),a?.()}})},e}return t({...c,createDialog:l,logger:s})}function Oo(e=qa){return Object.freeze({...e,createBatchSectionDeletionFeature(t={}){return Do({...t,createFeature:e.createBatchSectionDeletionFeature,getLocationHref:t.getLocationHref||(()=>globalThis.location?.href||``),getMarathonName:t.getMarathonName||(()=>globalThis.document?.querySelector?.(`h1`)?.textContent?.trim()||globalThis.document?.title||null)})}})}function ko({transport:e,operationGuard:t,logger:n,executionHistoryService:r,dispatch:i}){return jo({sendRequest:e.sendRequest,getConnectionState:e.getConnectionState,canStart:t.canStart,onActiveChange:t.guardedActiveChange(`batch-section-deletion`),createDialog:()=>document.createElement(Ga),copyText:e=>navigator.clipboard.writeText(e),persistExecution:r.persistTerminal,openHistory:e=>i({type:W.OPEN_EXECUTION_HISTORY,executionId:e}),logger:n.createChildLogger(`BatchSectionDeletion`)})}var Ao=Object.freeze({type:W.OPEN_BATCH_SECTION_DELETION,create(e){let t=ko(e);return()=>t.open()}});function jo(e={}){return Oo(qa).createBatchSectionDeletionFeature(e)}var Mo=G`
    [hidden] {
        display: none !important;
    }

    .edvibe-batch-user-management-card {
        display: flex;
        flex-direction: column;
        width: min(980px, calc(100vw - 32px));
        max-height: min(820px, calc(100vh - 32px));
        padding: 24px;
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
        color: var(--edvibe-text-strong);
        font-size: 21px;
        line-height: 1.3;
    }

    .edvibe-batch-user-management-description {
        margin: 5px 0 0;
        color: var(--edvibe-text-muted);
        font-size: 13px;
        line-height: 1.4;
    }

    .edvibe-batch-user-management-close {
        min-width: 36px;
        padding: 0;
        font-size: 24px;
        line-height: 1;
    }

    .edvibe-batch-user-management-body {
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
        margin-top: 18px;
    }

    .edvibe-batch-user-management-email-field {
        font-size: 13px;
    }

    .edvibe-batch-user-management-emails {
        min-height: 112px;
        resize: vertical;
        line-height: 1.45;
    }

    .edvibe-batch-user-management-email-state {
        flex-wrap: wrap;
        gap: 8px 16px;
    }

    .edvibe-batch-user-management-email-error {
        flex-basis: 100%;
        color: var(--edvibe-danger);
    }

    .edvibe-batch-user-management-table-wrap {
        overflow: auto;
        max-height: 350px;
        margin-top: 18px;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    .edvibe-batch-user-management-table {
        width: 100%;
        border-collapse: collapse;
        color: var(--edvibe-text);
        font-size: 13px;
    }

    .edvibe-batch-user-management-table th,
    .edvibe-batch-user-management-table td {
        padding: 11px 12px;
        border-bottom: 1px solid var(--edvibe-border-subtle);
        text-align: left;
        vertical-align: top;
    }

    .edvibe-batch-user-management-table th {
        position: sticky;
        top: 0;
        z-index: 1;
        color: var(--edvibe-text);
        background: var(--edvibe-surface-subtle);
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
        min-height: 28px;
        margin: 5px auto 0;
        padding: 4px 8px;
        font-size: 11px;
    }

    .edvibe-batch-user-management-user {
        min-width: 220px;
        overflow-wrap: anywhere;
    }

    .edvibe-batch-user-management-result {
        min-width: 220px;
        color: var(--edvibe-text-muted);
        overflow-wrap: anywhere;
    }

    .edvibe-batch-user-management-errors {
        overflow: auto;
        max-height: 350px;
        margin-top: 18px;
    }

    .edvibe-batch-user-management-error {
        margin: 0;
        color: inherit;
        font-size: 13px;
        line-height: 1.4;
    }

    .edvibe-batch-user-management-error + .edvibe-batch-user-management-error {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid currentColor;
    }

    .edvibe-batch-user-management-live-region {
        flex: 0 0 auto;
        padding-top: 16px;
    }

    .edvibe-batch-user-management-status {
        min-height: 20px;
        margin: 0;
        font-size: 13px;
        line-height: 1.4;
    }

    .edvibe-batch-user-management-status.is-error {
        color: var(--edvibe-danger);
    }

    .edvibe-batch-user-management-progress {
        display: block;
        width: 100%;
        height: 11px;
        margin-top: 10px;
    }

    .edvibe-batch-user-management-footer {
        flex: 0 0 auto;
        margin-top: 18px;
    }

    @media (max-width: 680px) {
        .edvibe-batch-user-management-card {
            width: 100%;
            max-height: 100vh;
            padding: 18px;
        }

        .edvibe-batch-user-management-table {
            min-width: 760px;
        }
    }
`,No=`edvibe-toolbox-batch-user-management-dialog`,Po=`edvibe-toolbox-batch-user-management-overlay`,Fo=class extends J{static styles=[cn,ln,un,dn,fn,pn,mn,Fn,Mo];static properties={rows:{state:!0},emailState:{state:!0},emailInput:{state:!0},mode:{state:!0},errors:{state:!0},statusMessage:{state:!0},statusError:{state:!0},progress:{state:!0}};constructor(){super(),this.rows=[],this.emailState={validCount:0,malformedCount:0,invalidEntries:[]},this.emailInput=``,this.mode=`configure`,this.errors=[],this.statusMessage=``,this.statusError=!1,this.progress={visible:!1,completed:0,total:0},this.handleKeydownBound=e=>this.handleKeydown(e)}connectedCallback(){super.connectedCallback(),this.id||=Po,this.ownerDocument?.addEventListener(`keydown`,this.handleKeydownBound)}disconnectedCallback(){this.ownerDocument?.removeEventListener(`keydown`,this.handleKeydownBound),super.disconnectedCallback()}configure(){return this}setEmailState(e={}){return this.emailState={validCount:Math.max(0,Number(e?.validCount)||0),malformedCount:Math.max(0,Number(e?.malformedCount)||0),invalidEntries:Array.isArray(e?.invalidEntries)?[...e.invalidEntries]:[]},this}showConfigure(){return this.mode=`configure`,this.clearMessages(),this}showChecking(e=`Проверяем пользователей…`){return this.mode=`checking`,this.clearMessages(),this.setStatus(e),this}showValidationErrors(e=[]){return this.mode=`validation-error`,this.errors=this.normalizeErrors(e),this.progress={visible:!1,completed:0,total:0},this.setStatus(`Исправьте ошибки и повторите проверку.`,`error`),this}showReview({rows:e=[]}={}){return this.mode=`review`,this.rows=this.normalizeRows(e),this.clearMessages(),this.setStatus(`Выберите операции для пользователей.`),this}showExecution(e={}){this.mode=`executing`;let t=Math.max(0,Number(e.completed)||0),n=Math.max(0,Number(e.total)||0),r=Math.max(0,Number(e.successes)||0),i=Math.max(0,Number(e.failures)||0);this.progress={visible:!0,completed:t,total:n};let a=e.current?.email&&e.current?.operation?` Сейчас: ${e.current.email} — ${{unassign:`снятие куратора`,delete:`удаление пользователя`}[e.current.operation]||e.current.operation}.`:``;return this.setStatus(`Выполнено: ${t} из ${n}. Успешно: ${r}. Ошибок: ${i}.${a}`),this}showComplete(e={}){this.rows=this.normalizeRows(Array.isArray(e.rows)?e.rows:this.rows);let t=Math.max(0,Number(e.failures)||0);return this.mode=t>0?`partial-complete`:`complete`,this.clearMessages(),this.setStatus(t>0?`Завершено с ошибками. Успешно: ${Math.max(0,Number(e.successes)||0)}.`:`Готово.`),this}showFatalError(e){return this.mode=`fatal-error`,this.clearMessages(),this.errors=this.normalizeErrors([e]),this.setStatus(`Не удалось загрузить пользователей.`,`error`),this}normalizeRows(e){return e.map(e=>({...e,result:{...e.result||{status:`pending`,message:`Not started`}}}))}normalizeErrors(e){return(Array.isArray(e)?e:[e]).map(e=>typeof e==`string`?e:String(e?.message||`Неизвестная ошибка.`))}selectOperation(e,t,n){this.isLocked()||e.actionable===!1||(this.rows=this.rows.map(r=>r===e?{...r,[`${t}Selected`]:!!n,result:{...r.result||{}}}:r),this.dispatchSelectionChange())}selectAll(e,t){this.isLocked()||(this.rows=this.rows.map(n=>n.actionable===!1?n:{...n,[`${e}Selected`]:!!t,result:{...n.result||{}}}),this.dispatchSelectionChange())}allSelected(e){let t=this.rows.filter(e=>e.actionable!==!1);return t.length>0&&t.every(t=>t[`${e}Selected`])}dispatchSelectionChange(){this.dispatchEvent(new CustomEvent(`edvibe-batch-user-management-selection-change`,{detail:{rows:this.copyRows()}}))}handleInput(e){this.emailInput=String(e.currentTarget.value||``),this.dispatchEvent(new CustomEvent(`edvibe-batch-user-management-input-change`,{detail:{emailInput:this.emailInput}}))}handleCheck(){this.canCheck()&&this.dispatchEvent(new CustomEvent(`edvibe-batch-user-management-check`,{detail:{emailInput:this.emailInput}}))}handleStart(){this.canStart()&&this.dispatchEvent(new CustomEvent(`edvibe-batch-user-management-start`,{detail:{rows:this.copyRows()}}))}handleRestart(){[`complete`,`partial-complete`].includes(this.mode)&&(this.rows=[],this.mode=`configure`,this.emailInput=``,this.setEmailState({validCount:0,malformedCount:0,invalidEntries:[]}),this.clearMessages(),this.dispatchEvent(new CustomEvent(`edvibe-batch-user-management-restart`)))}handleBackdropClick(e){e.target===e.currentTarget&&this.close()}handleKeydown(e){e.key===`Escape`&&this.close()}close(){this.canClose()&&(this.dispatchEvent(new CustomEvent(`edvibe-dialog-close`)),this.remove())}copyRows(){return this.rows.map(e=>({...e,result:{...e.result||{}}}))}clearMessages(){this.errors=[],this.progress={visible:!1,completed:0,total:0},this.setStatus(``)}setStatus(e,t=``){this.statusMessage=String(e||``),this.statusError=t===`error`}isLocked(){return[`checking`,`executing`,`complete`,`partial-complete`].includes(this.mode)}canCheck(){return[`configure`,`validation-error`].includes(this.mode)&&this.emailInput.trim().length>0}canStart(){return this.mode===`review`&&this.rows.some(e=>e.actionable!==!1&&(e.unassignSelected||e.deleteSelected))}canClose(){return[`configure`,`validation-error`,`review`,`complete`,`partial-complete`,`fatal-error`].includes(this.mode)}renderRow(e){let t=this.isLocked();return K`
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
        `}render(){let e=[`complete`,`partial-complete`].includes(this.mode),t=this.isLocked(),n=`edvibe-batch-user-management-status${this.statusError?` is-error`:``}`;return K`
            <div class="edvibe-batch-user-management-overlay" data-part="overlay" @click=${this.handleBackdropClick}>
                <section class="edvibe-batch-user-management-card" data-part="dialog" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-user-management-title">
                    <header class="edvibe-batch-user-management-header">
                        <div><h2 id="edvibe-batch-user-management-title">Управление пользователями</h2>
                            <p class="edvibe-batch-user-management-description">Снимите кураторов и удалите пользователей по списку email.</p></div>
                        <button class="edvibe-batch-user-management-close" data-control="secondary" type="button" aria-label="Закрыть"
                            ?disabled=${!this.canClose()} @click=${()=>this.close()}>&times;</button>
                    </header>
                    <div class="edvibe-batch-user-management-body">
                        <section class="edvibe-batch-user-management-configure">
                            <div class="edvibe-batch-user-management-email-field" data-field>
                                <label for="edvibe-batch-user-management-emails">Email пользователей</label>
                                <textarea id="edvibe-batch-user-management-emails" class="edvibe-batch-user-management-emails"
                                    rows="5" placeholder="user@example.com" .value=${this.emailInput}
                                    ?disabled=${t||e||this.mode===`fatal-error`} @input=${this.handleInput}></textarea>
                                <div class="edvibe-batch-user-management-email-state" data-part="help" aria-live="polite">
                                    <span class="edvibe-batch-user-management-email-count">Уникальных email: ${this.emailState.validCount}</span>
                                    <span class="edvibe-batch-user-management-malformed-count">Некорректных: ${this.emailState.malformedCount}</span>
                                    ${Pn(this.emailState.invalidEntries)}
                                </div>
                            </div>
                        </section>
                        <section class="edvibe-batch-user-management-errors" data-notice="danger" aria-live="polite" ?hidden=${this.errors.length===0}>
                            ${this.errors.map(e=>K`<p class="edvibe-batch-user-management-error">${e}</p>`)}
                        </section>
                        <section class="edvibe-batch-user-management-table-wrap" ?hidden=${this.rows.length===0}>
                            <table class="edvibe-batch-user-management-table">
                                <thead><tr><th scope="col">Пользователь</th>
                                    <th scope="col">Снять куратора <button class="edvibe-batch-user-management-select-all-unassign" data-control="secondary" type="button"
                                        ?disabled=${t||this.rows.length===0} @click=${()=>this.selectAll(`unassign`,!this.allSelected(`unassign`))}>Выбрать все</button></th>
                                    <th scope="col">Удалить пользователя <button class="edvibe-batch-user-management-select-all-delete" data-control="secondary" type="button"
                                        ?disabled=${t||this.rows.length===0} @click=${()=>this.selectAll(`delete`,!this.allSelected(`delete`))}>Выбрать все</button></th>
                                    <th scope="col">Результат</th></tr></thead>
                                <tbody class="edvibe-batch-user-management-table-body">${this.rows.map(e=>this.renderRow(e))}</tbody>
                            </table>
                        </section>
                    </div>
                    <div class="edvibe-batch-user-management-live-region">
                        <p class=${n} data-part="status" role="status" aria-live="polite">${this.statusMessage}</p>
                        <progress class="edvibe-batch-user-management-progress" data-part="progress" max=${this.progress.total}
                            value=${this.progress.completed} ?hidden=${!this.progress.visible}></progress>
                    </div>
                    <footer class="edvibe-batch-user-management-footer" data-part="actions">
                        <button class="edvibe-batch-user-management-restart" data-control="secondary" type="button" ?hidden=${!e}
                            ?disabled=${!e} @click=${this.handleRestart}>Запустить другую группу</button>
                        <button class="edvibe-batch-user-management-start" data-control type="button" ?hidden=${this.mode!==`review`}
                            ?disabled=${!this.canStart()} @click=${this.handleStart}>Начать обработку</button>
                        <button class="edvibe-batch-user-management-check" data-control type="button"
                            ?hidden=${![`configure`,`validation-error`].includes(this.mode)} ?disabled=${!this.canCheck()}
                            @click=${this.handleCheck}>Проверить пользователей</button>
                    </footer>
                </section>
            </div>
        `}};customElements.define(No,Fo);var Io=`batch_user_management`,Lo=Object.freeze({unassign:`unassign_curator`,delete:`delete_user`});function Ro(e){let t=String(e||``).match(/\/marathon\/(\d+)(?:\/|$)/);return t?String(t[1]):null}function zo(e){let t=[];return e?.unassignSelected&&t.push(Lo.unassign),e?.deleteSelected&&t.push(Lo.delete),t}function Bo(e){let t=e?.pupil||{};return Object.freeze({email:t.Email||e?.normalizedEmail||e?.email||null,displayName:t.DisplayName||t.FullName||t.Name||null,firstName:t.FirstName||null,lastName:t.LastName||null,pupilId:t.PupilId??t.Id??null,marathonPupilId:e?.marathonPupilId??t.MarathonPupilId??null})}function Vo(e,t){if(!t)return Object.freeze({name:e,status:`not_attempted`,attemptCount:0,code:`NOT_ATTEMPTED`,message:`The operation was not attempted.`,dependency:null});let n=t.status===`skipped`&&/curator removal failed/i.test(t.message||``);return Object.freeze({name:e,status:t.status,attemptCount:Number.isInteger(t.attempts)?t.attempts:0,code:t.code||(n?`DEPENDENCY_FAILED`:null),message:t.message||null,dependency:n?Object.freeze({blockedBy:Lo.unassign}):null,...Z(t)?{diagnostics:Z(t)}:{}})}function Ho(e,t){if(e?.status!==`matched`)return`rejected`;if(t.length===0)return`skipped`;let n=t.map(e=>e.status);return n.includes(`failed`)?`failed`:n.includes(`not_attempted`)?`not_attempted`:n.includes(`skipped`)?`skipped`:n.every(e=>e===`noop`)?`noop`:`success`}function Uo(e,t){return t===`rejected`?{malformed:e?.validationCode||`USER_INPUT_MALFORMED`,missing:`USER_NOT_FOUND`,ambiguous:`USER_AMBIGUOUS`}[e?.status]||`USER_REJECTED`:{success:`USER_OPERATIONS_COMPLETED`,noop:`USER_OPERATIONS_NOOP`,skipped:`USER_OPERATIONS_SKIPPED`,failed:`USER_OPERATIONS_FAILED`,not_attempted:`USER_OPERATIONS_NOT_ATTEMPTED`}[t]}function Wo(e,t,n){if(t===`rejected`)return e?.message||`The submitted user could not be resolved safely.`;if(n.length===0)return`No user-management operation was selected.`;let r=n.map(e=>e.message).filter(Boolean);return r.length>0?r.join(`; `):{success:`All selected operations completed successfully.`,noop:`All selected operations were already satisfied.`,skipped:`One or more selected operations were skipped.`,failed:`One or more selected operations failed.`,not_attempted:`One or more selected operations were not attempted.`}[t]}function Go(e,t){let n=zo(e),r=n.map(t=>t===Lo.unassign?Vo(t,e?.unassign):Vo(t,e?.delete)),i=Ho(e,r),a=Hr(r.flatMap(e=>Z(e)?.requestAttempts||[]));return Object.freeze({itemId:e?.normalizedEmail||e?.email||`input-${t+1}`,label:e?.email||e?.normalizedEmail||`Input ${t+1}`,status:i,code:Uo(e,i),message:Wo(e,i,r),attempts:r.reduce((e,t)=>e+t.attemptCount,0),...a?{diagnostics:a}:{},data:Object.freeze({submittedInput:e?.email||null,normalizedEmail:e?.normalizedEmail||null,resolution:e?.status||`malformed`,validationCode:e?.validationCode||null,resolutionMessage:e?.message||null,...e?.offendingCharacters?.length?{offendingCharacters:Object.freeze([...e.offendingCharacters])}:{},user:e?.status===`matched`?Bo(e):null,curatorPresent:e?.status===`matched`?!!e?.hasCurator:null,selectedOperations:Object.freeze(n),operations:Object.freeze(r)})})}function Ko(e){let t=e.filter(e=>e.data.resolution===`matched`&&e.data.selectedOperations.length>0).length,n=e.filter(e=>e.status===`not_attempted`).length,r=e.filter(e=>e.data.resolution===`matched`&&e.data.selectedOperations.length>0&&e.status!==`not_attempted`).length;return Object.freeze({requested:e.length,eligible:t,attempted:r,successful:e.filter(e=>e.status===`success`).length,noOp:e.filter(e=>e.status===`noop`).length,skipped:e.filter(e=>e.status===`skipped`||e.status===`rejected`).length,failed:e.filter(e=>e.status===`failed`).length,notAttempted:n})}function qo(e,t){return e?.error?`interrupted`:t.some(e=>e.status===`failed`||e.status===`skipped`||e.status===`rejected`)?`completed_with_failures`:`completed`}function Jo({rows:e,summary:t={},startedAt:n,completedAt:r,marathonId:i,marathonName:a=null}){let o=(Array.isArray(e)?e:[]).map(Go),s={selected:0,attempted:0,successful:0,noOp:0,skipped:0,failed:0,notAttempted:0};for(let e of o)for(let t of e.data.operations)s.selected+=1,t.status!==`not_attempted`&&(s.attempted+=1),t.status===`success`&&(s.successful+=1),t.status===`noop`&&(s.noOp+=1),t.status===`skipped`&&(s.skipped+=1),t.status===`failed`&&(s.failed+=1),t.status===`not_attempted`&&(s.notAttempted+=1);let c=Ko(o);return Object.freeze({operationType:Io,startedAt:n,completedAt:r,status:qo(t,o),pageContext:Object.freeze({marathonId:i,marathonName:a}),counts:c,results:Object.freeze(o),message:JSON.stringify({userCounts:c,operationCounts:s})})}function Yo({createDialog:e,persistExecution:t,openHistory:n=()=>{},getLocationHref:r=()=>``,getMarathonName:i=()=>null,now:a=()=>new Date,logger:o={log(){}}}){if(typeof e!=`function`)throw TypeError(`createDialog is required`);if(typeof t!=`function`)throw TypeError(`persistExecution is required`);return function(){let s=e(),c=null,l=0,u=s.showComplete.bind(s),d=s.showReview.bind(s),f=s.showConfigure.bind(s);function p(){s.shadowRoot?.querySelector?.(`.edvibe-batch-user-management-history`)?.remove?.()}function m(e){let t=s.elements?.status?.textContent||``;s.setStatus?.(`${t}${t?` `:``}${e}`)}function h(e){p();let t=(s.ownerDocument||globalThis.document)?.createElement?.(`button`);t&&(t.type=`button`,t.className=`edvibe-batch-user-management-history`,t.textContent=`Открыть в истории`,t.addEventListener(`click`,()=>{s.close?.(),n(e)}),s.elements?.footer?.appendChild?.(t),s.elements?.footer||s.shadowRoot?.querySelector?.(`.edvibe-batch-user-management-footer`)?.appendChild?.(t))}return s.showReview=e=>(c=null,l+=1,p(),d(e)),s.showConfigure=(...e)=>(c=null,l+=1,p(),f(...e)),s.addEventListener(`edvibe-batch-user-management-start`,()=>{c=a().toISOString(),l+=1,p()}),s.showComplete=(e={})=>{let n=u(e),d=l,f=a().toISOString(),p=Jo({rows:e.rows||s.rows,summary:e,startedAt:c||f,completedAt:f,marathonId:Ro(r()),marathonName:i()});return Promise.resolve().then(()=>t(p)).then(e=>{d===l&&(e?.stored?(m(`Результат сохранён в истории.`),e.record?.id&&h(e.record.id)):(m(`Экранный результат сохранён, но записать историю не удалось.`),e?.persistenceError&&o.log(`Batch user management history persistence failed:`,e.persistenceError)))}).catch(e=>{d===l&&(m(`Экранный результат сохранён, но записать историю не удалось.`),o.log(`Batch user management history persistence failed:`,e))}),n},s}}function Xo(e){return qn(e,{includeItems:!0})}function Zo(e,t){let n=new Map;for(let e of Array.isArray(t)?t:[]){let t=String(e?.Email||``).trim().toLowerCase(),r=n.get(t)||[];r.push(e),n.set(t,r)}let r=[],i=[];for(let t of Array.isArray(e)?e:[]){let e=n.get(t.normalized)||[];if(e.length===1){r.push({email:t.input,normalizedEmail:t.normalized,pupil:e[0],status:`matched`,message:``});continue}let a=e.length===0?`missing`:`ambiguous`,o=e.length===0?`No marathon pupil found for ${t.input}.`:`Multiple marathon pupils found for ${t.input}.`;r.push({email:t.input,normalizedEmail:t.normalized,pupil:null,status:a,message:o}),i.push({type:a,input:t.input,count:e.length,message:o})}return{rows:r,errors:i}}function Qo({rows:e}){return(Array.isArray(e)?e:[]).map(e=>{let t=e.status===`matched`&&e.pupil,n=!!(t&&Array.isArray(e.pupil.Moderators)&&e.pupil.Moderators.length>0);return{email:e.email,normalizedEmail:e.normalizedEmail,pupil:t?e.pupil:null,marathonPupilId:t?e.pupil.MarathonPupilId:null,hasCurator:n,actionable:!!t,status:e.status,message:e.message,unassignSelected:!1,deleteSelected:!1,unassign:null,delete:null,result:{status:`pending`,message:t?`Not started`:e.message}}})}function $o(e){return{...e,unassign:null,delete:null,result:{...e.result}}}function es(e){return{status:`failed`,attempts:e?.attempts||1,code:e?.code||`UNKNOWN_ERROR`,message:e?.message||`The operation failed.`}}function ts(e){return{status:`success`,attempts:e}}function ns(){return{status:`noop`,attempts:0,message:`No curator was assigned.`}}function rs(e){return{status:`skipped`,attempts:0,message:e}}function is(e){let t=[];return e.unassignSelected&&t.push(`unassign`),e.deleteSelected&&t.push(`delete`),t}function as(e,t){return t?e===`unassign`?t.status===`noop`?`Curator already absent`:t.status===`success`?`Curator removed`:`Curator removal failed (${t.code||`UNKNOWN_ERROR`}): ${t.message||`The operation failed.`}`:t.status===`success`?`User deleted`:t.status===`skipped`?`Deletion skipped: ${t.message||`The operation was skipped.`}`:`Deletion failed (${t.code||`UNKNOWN_ERROR`}): ${t.message||`The operation failed.`}`:``}function os(e){let t=is(e);e.result={status:t.some(t=>e[t]?.status===`failed`)?`failed`:`success`,message:t.map(t=>as(t,e[t])).filter(Boolean).join(`; `)}}async function ss({marathonId:e,rows:t,sendRequest:n,wait:r,getConnectionState:i,onProgress:a=()=>{}}){let o=(Array.isArray(t)?t:[]).filter(e=>e.actionable!==!1&&is(e).length>0).map($o),s=o.length,c=0,l=0,u=0,d=0;function f(e,t){try{a(Object.freeze({completed:c,total:s,successes:l,failures:u,current:Object.freeze({email:e.email,operation:t})}))}catch{}}for(let t of o){let a=is(t);try{if(t.unassignSelected){if(f(t,`unassign`),!t.hasCurator)t.unassign=ns();else try{let a=await Xn(async()=>{let r=await n(`MarathonPupilsWsController`,`AddModeratorsToPupil`,`Marathons`,{MarathonId:e,MarathonPupilId:t.marathonPupilId,SelectedModeratorsIds:[]});if(r?.Value?.IsSuccess!==!0)throw Y(`INVALID_RESPONSE`,`The curator removal was not confirmed.`);return r},{wait:r,getConnectionState:i});t.unassign=ts(a.attempts),d+=a.attempts}catch(e){t.unassign=es(e),d+=t.unassign.attempts}}if(t.deleteSelected){if(t.unassign?.status===`failed`)t.delete=rs(`Skipped because curator removal failed.`);else{f(t,`delete`);try{let e=await Xn(async()=>{let e=await n(`MarathonPupilsWsController`,`DeleteMarathonPupil`,`Marathons`,{MarathonPupilId:t.marathonPupilId});if(e?.Value!==t.marathonPupilId)throw Y(`INVALID_RESPONSE`,`The user deletion was not confirmed.`);return e},{wait:r,getConnectionState:i});t.delete=ts(e.attempts),d+=e.attempts}catch(e){t.delete=es(e),d+=t.delete.attempts}}}}catch(e){let n=t.unassign?.status!==`success`&&t.unassign?.status!==`noop`?`unassign`:`delete`;t[n]||=es(e)}os(t),t.result.status===`failed`?u+=1:l+=1,c+=1,f(t,t.delete?.status===`skipped`?`unassign`:a[a.length-1])}return{rows:o,completed:c,total:s,successes:l,failures:u,attempts:d}}function cs(e){return e.entries.length===0&&e.malformed.length===0?[Y(`EMAILS_REQUIRED`,`Enter at least one email address.`)]:[]}function ls(e,t){let n=new Map(t.rows.map(e=>[e.normalizedEmail,e]));return e.items.map(e=>e.isValid?n.get(e.normalized):{email:e.input,normalizedEmail:e.normalized,pupil:null,status:`malformed`,validationCode:e.validation?.code||`INVALID_EMAIL_FORMAT`,offendingCharacters:e.validation?.offendingCharacters||[],message:e.validation?.message||`Некорректный формат email.`})}function us({transport:e,operationGuard:t,logger:n,executionHistoryService:r,dispatch:i}){let a=Yo({createDialog:()=>document.createElement(No),persistExecution:r.persistTerminal,openHistory:e=>i({type:W.OPEN_EXECUTION_HISTORY,executionId:e}),getLocationHref:()=>window.location.href,getMarathonName:()=>document.querySelector(`h1`)?.textContent?.trim()||document.title||null,logger:n.createChildLogger(`BatchUserManagementHistory`)});return fs({sendRequest:e.sendRequest,getConnectionState:e.getConnectionState,canStart:t.canStart,onActiveChange:t.guardedActiveChange(`batch-user-management`),createDialog:a,logger:n.createChildLogger(`BatchUserManagement`)})}var ds=Object.freeze({type:W.OPEN_BATCH_USER_MANAGEMENT,create(e){let t=us(e);return()=>t.open()}});function fs({sendRequest:e,getConnectionState:t,canStart:n,onActiveChange:r,createDialog:i=()=>document.createElement(No),logger:a={log(){}}}){let o=!1,s=!1,c=[],l=[],u=null,d=null;function f(){o&&(o=!1,r(!1))}function p(){s=!1,c=[],l=[],u=null,d=null,f()}function m(e){return typeof e?.code==`string`?e.code:`UNKNOWN_ERROR`}function h(e){let t=Xo(e?.detail?.emailInput);d.setEmailState({validCount:t.entries.length,malformedCount:t.malformed.length,invalidEntries:t.invalidEntries})}function g(e){let t=new Map((Array.isArray(e)?e:[]).map(e=>[e.normalizedEmail,{unassignSelected:!!e.unassignSelected,deleteSelected:!!e.deleteSelected}]));return l.map(e=>({...e,...t.get(e.normalizedEmail)||{unassignSelected:!1,deleteSelected:!1},result:{...e.result}}))}function _(e){let t=new Set(e.filter(e=>e.delete?.status===`success`).map(e=>e.marathonPupilId)),n=new Set(e.filter(e=>e.unassign?.status===`success`||e.unassign?.status===`noop`).map(e=>e.marathonPupilId));c=c.filter(e=>!t.has(e.MarathonPupilId)).map(e=>n.has(e.MarathonPupilId)?{...e,Moderators:[]}:e)}async function v(e){if(!s){s=!0;try{let t=Xo(e?.detail?.emailInput),n=cs(t);if(n.length>0){d.showValidationErrors(n);return}d.showChecking(`Проверяем пользователей…`),l=Qo({rows:ls(t,Zo(t.entries,c))}),d.showReview({rows:l}),a.log(`Batch user management checked ${l.length} row(s) for MarathonId ${u}.`)}catch(e){d.showValidationErrors([e])}finally{s=!1}}}function y(e){Array.isArray(e?.detail?.rows)&&(l=g(e.detail.rows))}async function b(n){if(s)return;let r=g(n?.detail?.rows||l);if(r.some(e=>e.actionable!==!1&&(e.unassignSelected||e.deleteSelected))){s=!0;try{let n=await ss({marathonId:u,rows:r,sendRequest:e,wait:Te,getConnectionState:t,onProgress:e=>d.showExecution(e)}),i=new Map(n.rows.map(e=>[e.normalizedEmail,e]));_(n.rows),l=r.map(e=>i.get(e.normalizedEmail)||e),d.showComplete({...n,rows:l})}catch(e){d.showComplete({rows:l,completed:0,total:0,successes:0,failures:1,attempts:e?.attempts||1,error:e})}finally{s=!1}}}function x(){l=[],s=!1}async function S(){if(!(o||document.getElementById(`edvibe-toolbox-batch-user-management-overlay`))){if(!n()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}if(u=Wn(window.location.href),!u){window.alert(`Open an Edvibe marathon page before managing users.`);return}o=!0,r(!0);try{if(d=i(),d.addEventListener(`edvibe-dialog-close`,p),d.addEventListener(`edvibe-batch-user-management-input-change`,h),d.addEventListener(`edvibe-batch-user-management-check`,v),d.addEventListener(`edvibe-batch-user-management-selection-change`,y),d.addEventListener(`edvibe-batch-user-management-start`,b),d.addEventListener(`edvibe-batch-user-management-restart`,x),d.configure(),(document.body||document.documentElement).appendChild(d),d.showChecking(`Загружаем пользователей…`),a.log(`Initializing batch user management for MarathonId ${u}.`),c=await $n({sendRequest:e,marathonId:u}),c.length===0)throw Y(`EMPTY_ROSTER`,`No pupils were found in this marathon.`);d.showConfigure()}catch(e){a.log(`Batch user management initialization failed for MarathonId ${u} (${m(e)}).`);try{d?.showFatalError?.(e)}catch(e){a.log(`Batch user management error rendering failed (${m(e)}).`)}finally{f()}}}}return{open:S,isRunning:()=>s}}function ps(e,t,n={}){return Y(e,t,n)}function ms(e){if(!e||typeof e!=`object`||Object.isFrozen(e))return e;Object.freeze(e);for(let t of Object.values(e))ms(t);return e}function hs(e){let t=Number(e?.Id),n=Number(e?.TeacherId);if(!Number.isSafeInteger(t)||t<=0||!Number.isSafeInteger(n)||n<=0)throw ps(`INVALID_MODERATOR_RESPONSE`,`The moderator catalogue contained an invalid identifier.`);return Object.freeze({id:t,teacherId:n,name:String(e?.Name||``).trim()||null,email:String(e?.Email||``).trim()||null})}function gs(e){if(!Array.isArray(e))throw ps(`INVALID_MODERATOR_RESPONSE`,`The moderator catalogue was not an array.`);let t=e.map(hs),n=new Set,r=new Set;for(let e of t){if(n.has(e.id)||r.has(e.teacherId))throw ps(`INVALID_MODERATOR_RESPONSE`,`The moderator catalogue contained ambiguous identifiers.`);n.add(e.id),r.add(e.teacherId)}return Object.freeze(t)}async function _s({sendRequest:e,marathonId:t}){return gs((await e(`MarathonModeratorWsController`,`GetMarathonModerators`,`Marathons`,{MarathonId:t}))?.Value?.Items)}function vs(e){return new Map((e||[]).map(e=>[e.teacherId,e]))}function ys(e,t){if(!Array.isArray(e))return Object.freeze({safe:!1,moderators:Object.freeze([]),code:`UNSAFE_MODERATOR_REPLACEMENT`,message:`Current curator assignments could not be interpreted safely.`});let n=vs(t),r=[],i=new Set;for(let t of e){let e=Number(t?.TeacherId),a=n.get(e);if(!Number.isSafeInteger(e)||!a||i.has(a.id))return Object.freeze({safe:!1,moderators:Object.freeze([]),code:`UNSAFE_MODERATOR_REPLACEMENT`,message:`Existing curator assignments cannot be preserved without guessing.`});i.add(a.id),r.push(a)}return Object.freeze({safe:!0,moderators:Object.freeze(r),code:null,message:null})}function bs(e){return e?Object.freeze({email:String(e.Email||``).trim()||null,name:String(e.Name||e.DisplayName||e.FullName||``).trim()||null,pupilId:Number.isSafeInteger(Number(e.PupilId))?Number(e.PupilId):null,marathonPupilId:Number.isSafeInteger(Number(e.MarathonPupilId))?Number(e.MarathonPupilId):null}):null}function xs(e){let t=new Map;for(let n of Array.isArray(e)?e:[]){let e=String(n?.Email||``).trim().toLowerCase();if(!e)continue;let r=t.get(e)||[];r.push(n),t.set(e,r)}return t}function Ss(e,t){let n=Number(t);return(e||[]).find(e=>e.id===n)||null}function Cs(e,t,n){let r=e?.diagnostics||{};return{operation:t,attempt:n,code:e?.code,controller:e?.controller||r.request?.controller,method:e?.method||r.request?.method,requestId:e?.requestId||r.request?.requestId,serverErrorCode:e?.serverErrorCode||r.response?.errorCode,serverMessage:r.response?.serverMessage,startedAt:r.request?.startedAt,elapsedMs:r.response?.elapsedMs,requestSummary:r.request?.value,responseSummary:r.response?.value}}function ws(e,t){return t.length?{operation:e,attempts:t}:null}function Ts(e,t,n){let r=xs(t),i=[];for(let t of e?.items||[]){if(!t.isValid){i.push(Object.freeze({email:t.input,normalizedEmail:t.normalized,resolution:`invalid`,membership:`unknown`,user:null,currentModerators:Object.freeze([]),moderatorStateSafe:!1,actionable:!1,validationCode:t.validation?.code||`INVALID_EMAIL_FORMAT`,offendingCharacters:t.validation?.offendingCharacters||Object.freeze([]),message:t.validation?.message||`Некорректный формат email.`,addSelected:!1,assignSelected:!1}));continue}let e=r.get(t.normalized)||[];if(e.length>1){i.push(Object.freeze({email:t.input,normalizedEmail:t.normalized,resolution:`ambiguous`,membership:`ambiguous`,user:null,currentModerators:Object.freeze([]),moderatorStateSafe:!1,actionable:!1,message:`Multiple marathon users matched ${t.input}.`,addSelected:!1,assignSelected:!1}));continue}if(e.length===0){i.push(Object.freeze({email:t.input,normalizedEmail:t.normalized,resolution:`resolvable_not_in_marathon`,membership:`not_in_marathon`,user:null,currentModerators:Object.freeze([]),moderatorStateSafe:!0,actionable:!0,message:`Not currently in the marathon; the recorded add-by-email workflow is available.`,addSelected:!1,assignSelected:!1}));continue}let a=ys(e[0].Moderators,n);i.push(Object.freeze({email:t.input,normalizedEmail:t.normalized,resolution:`in_marathon`,membership:`in_marathon`,user:bs(e[0]),currentModerators:a.moderators,moderatorStateSafe:a.safe,actionable:!0,message:a.safe?`Already in the marathon.`:a.message,addSelected:!1,assignSelected:!1}))}return Object.freeze(i)}function Es(e,t,n,r=null){return Object.freeze({status:e,code:t,message:n,dependency:r})}function Ds({rows:e,moderators:t,targetModeratorId:n}){let r=Array.isArray(e)?e:[],i=r.some(e=>!!e.assignSelected),a=i?Ss(t,n):null;if(i&&!a)throw ps(`CURATOR_REQUIRED`,`Select a curator before preparing the execution plan.`);let o=r.map(e=>{let t=!!e.addSelected,n=!!e.assignSelected,r=null,i=null;return t&&(r=e.actionable?e.membership===`in_marathon`?Es(`noop`,`USER_ALREADY_IN_MARATHON`,`User is already in the marathon.`):Es(`pending`,`USER_ADD_PENDING`,`User will be added to the marathon.`):Es(`rejected`,`INVALID_USER_INPUT`,e.message||`The user is not actionable.`)),n&&(i=e.actionable?e.moderatorStateSafe?e.membership===`not_in_marathon`&&!t?Es(`rejected`,`USER_NOT_IN_MARATHON`,`Curator assignment requires adding this user first.`):e.membership===`in_marathon`&&e.currentModerators.some(e=>e.teacherId===a.teacherId)?Es(`noop`,`CURATOR_ALREADY_ASSIGNED`,`Target curator is already assigned.`):Es(`pending`,`CURATOR_ASSIGNMENT_PENDING`,e.membership===`not_in_marathon`?`The curator will be assigned by the recorded add-user request.`:`The curator will be added while preserving all current curators.`,e.membership===`not_in_marathon`?Object.freeze({blockedBy:`add_user`}):null):Es(`rejected`,`UNSAFE_MODERATOR_REPLACEMENT`,`Existing curator assignments cannot be preserved safely.`):Es(`rejected`,`INVALID_USER_INPUT`,e.message||`The user is not actionable.`)),ms({itemId:e.normalizedEmail||e.email,email:e.email,normalizedEmail:e.normalizedEmail,resolution:e.resolution,membership:e.membership,user:e.user?{...e.user}:null,currentModerators:(e.currentModerators||[]).map(e=>({...e})),moderatorStateSafe:!!e.moderatorStateSafe,actionable:!!e.actionable,validationCode:e.validationCode||null,offendingCharacters:e.offendingCharacters||Object.freeze([]),message:e.message||``,selectedOperations:Object.freeze([...t?[`add_user`]:[],...n?[`assign_curator`]:[]]),addSelected:t,assignSelected:n,add:r,assign:i,targetModerator:a?{...a}:null})}),s=e=>o.reduce((t,n)=>t+ +(n.add?.status===e)+ +(n.assign?.status===e),0);return ms({rows:o,targetModerator:a?{...a}:null,counts:{requested:o.length,selectedOperations:o.reduce((e,t)=>e+t.selectedOperations.length,0),additions:o.filter(e=>e.addSelected).length,assignments:o.filter(e=>e.assignSelected).length,noOps:s(`noop`),rejectedOperations:s(`rejected`),dependentAssignments:o.filter(e=>e.assign?.dependency?.blockedBy===`add_user`).length}})}function Os(e,t=2){return String(e).padStart(t,`0`)}function ks(e){let t=e instanceof Date?e:new Date(e);if(Number.isNaN(t.getTime()))throw ps(`INVALID_CLIENT_TIME`,`Could not build the Edvibe client timestamp.`);return`${t.getFullYear()}-${Os(t.getMonth()+1)}-${Os(t.getDate())}T${Os(t.getHours())}:${Os(t.getMinutes())}:${Os(t.getSeconds())}.${Os(t.getMilliseconds(),3)}`}function As({marathonId:e,emails:t,moderatorIds:n=[],host:r=`edvibe.com`,now:i=new Date,userId:a=null}){let o=(t||[]).map(e=>String(e||``).trim()).filter(Boolean);if(o.length===0)throw ps(`EMAILS_REQUIRED`,`At least one email is required for addition.`);let s=String(r||``).trim()||`edvibe.com`,c={MarathonId:e,Emails:o,MailMessageLanguageId:0,ModeratorsIds:[...n],AccessGroups:[],Domain:s,ApiHost:s,ClientTime:ks(i),DeviceType:`desktop`},l=Number(a);return Number.isSafeInteger(l)&&l>0&&(c.UserId=l),ms({controller:`MarathonPupilsWsController`,method:`AddMarathonPupil`,projectName:`Marathons`,value:c})}function js({marathonId:e,marathonPupilId:t,existingModeratorIds:n,targetModeratorId:r}){let i=[...new Set([...(n||[]).map(Number),Number(r)])];if(i.some(e=>!Number.isSafeInteger(e)||e<=0))throw ps(`UNSAFE_MODERATOR_REPLACEMENT`,`A safe complete curator list could not be constructed.`);return ms({controller:`MarathonPupilsWsController`,method:`AddModeratorsToPupil`,projectName:`Marathons`,value:{MarathonId:e,MarathonPupilId:t,SelectedModeratorsIds:i}})}var Ms=new Set([`SERVER_REJECTED`,`INVALID_RESPONSE`,`REQUEST_TIMEOUT`,`SEND_FAILED`]);function Q(e,t,n,r=0,i=null,a=null){return{status:e,code:t,message:n,attempts:r,dependency:i,diagnostics:a}}function Ns(e){let t=(e,t)=>e?Q(e.status===`pending`?`not_attempted`:e.status,e.status===`pending`?`NOT_ATTEMPTED`:e.code,e.status===`pending`?`${t} has not been attempted yet.`:e.message,0,e.dependency):null;return e.rows.map(e=>({...e,currentModerators:e.currentModerators.map(e=>({...e})),runtimePupil:e.user?{...e.user}:null,addResult:t(e.add,`The addition`),assignResult:t(e.assign,`The curator assignment`)}))}function Ps(e){return e?.status===`not_attempted`}function Fs(e){return e&&![`rejected`,`failed`,`skipped`].includes(e.status)}function Is(e){return(e||[]).map(e=>e.teacherId).sort((e,t)=>e-t)}function Ls(e,t){return e.length===t.length&&e.every((e,n)=>e===t[n])}function Rs(e,t,n){e.addSelected&&Fs(e.addResult)&&(e.addResult=Q(`rejected`,t,n)),e.assignSelected&&Fs(e.assignResult)&&(e.assignResult=Q(`rejected`,t,n))}function zs({rows:e,pupils:t,moderators:n,targetModerator:r}){let i=xs(t);for(let t of e){if(!t.actionable||t.selectedOperations.length===0)continue;let e=i.get(t.normalizedEmail)||[];if(e.length>1){Rs(t,`USER_AMBIGUOUS`,`The user became ambiguous before execution.`);continue}if(t.membership===`in_marathon`){if(e.length!==1||Number(e[0].MarathonPupilId)!==Number(t.user?.marathonPupilId)){Rs(t,`STATE_CHANGED`,`Marathon membership changed after preflight.`);continue}let i=e[0];if(t.runtimePupil=bs(i),t.addSelected&&Fs(t.addResult)&&(t.addResult=Q(`noop`,`USER_ALREADY_IN_MARATHON`,`User is already in the marathon.`)),!t.assignSelected||!Fs(t.assignResult))continue;let a=ys(i.Moderators,n);if(!a.safe){t.assignResult=Q(`rejected`,a.code,a.message);continue}if(!Ls(Is(t.currentModerators),Is(a.moderators))){t.assignResult=Q(`rejected`,`STATE_CHANGED`,`Current curator assignments changed after preflight.`);continue}t.currentModerators=a.moderators.map(e=>({...e})),t.assignResult=a.moderators.some(e=>e.teacherId===r?.teacherId)?Q(`noop`,`CURATOR_ALREADY_ASSIGNED`,`Target curator is already assigned.`):Q(`not_attempted`,`NOT_ATTEMPTED`,`The curator assignment has not been attempted yet.`);continue}if(t.membership!==`not_in_marathon`||e.length===0)continue;let a=e[0];if(t.runtimePupil=bs(a),t.addSelected&&Fs(t.addResult)&&(t.addResult=Q(`noop`,`USER_ALREADY_IN_MARATHON`,`User entered the marathon after preflight; no duplicate add was sent.`)),t.assignSelected&&Fs(t.assignResult)){let e=ys(a.Moderators,n);t.assignResult=e.safe&&e.moderators.some(e=>e.teacherId===r?.teacherId)?Q(`noop`,`CURATOR_ALREADY_ASSIGNED`,`Target curator was assigned after preflight.`):Q(`rejected`,`STATE_CHANGED`,`The user entered the marathon after preflight; curator state was not part of the confirmed plan.`)}}return e}function Bs(e,t){return!e?.code||e.code===`WS_UNAVAILABLE`||e.code===`SEND_FAILED`&&!t().isOpen||!Ms.has(e.code)}function Vs(e){let t=e.flatMap(e=>[e.addResult,e.assignResult]).filter(Boolean);return{completed:t.filter(e=>e.status!==`not_attempted`).length,total:t.length,successes:t.filter(e=>[`success`,`noop`].includes(e.status)).length,failures:t.filter(e=>[`failed`,`rejected`,`skipped`].includes(e.status)).length}}function Hs(e,t,n=null){try{e?.({...Vs(t),current:n})}catch{}}async function Us({rows:e,marathonId:t,targetModerator:n,includeModerator:r,sendRequest:i,wait:a,getConnectionState:o,getRequestContext:s,now:c}){let l=e.filter(e=>Ps(e.addResult)&&e.membership===`not_in_marathon`&&!!e.assignSelected===r);if(l.length===0)return{targets:l,confirmed:!1,fatalError:null};let u=r?`add-group-with-curator`:`add-group`;for(let e of l)e.addDiagnosticRef=u;let d=s?.()||{},f=As({marathonId:t,emails:l.map(e=>e.email),moderatorIds:r?[n.id]:[],host:d.host,userId:d.userId,now:c()}),p=[];try{let e=await Xn(async()=>{try{let e=await i(f.controller,f.method,f.projectName,f.value);if(e?.Value?.IsSuccess!==!0)throw ps(`INVALID_RESPONSE`,`User addition was not positively confirmed.`);return e}catch(e){throw p.push(Cs(e,`add_user`,p.length+1)),e}},{wait:a,getConnectionState:o});for(let t of l)t.addRequestAttempts=e.attempts;return{targets:l,confirmed:!0,fatalError:null,diagnosticId:u,diagnostics:ws(`add_user`,p)}}catch(e){let t=ws(`add_user`,p);for(let t of l)t.addResult=Q(`failed`,e.code||`USER_ADD_FAILED`,e.message||`User addition failed.`,e.attempts||1,null,{reference:u}),Ps(t.assignResult)&&(t.assignResult=Q(`skipped`,`ASSIGNMENT_BLOCKED_BY_ADD_FAILURE`,`Curator assignment was skipped because user addition failed.`,0,{blockedBy:`add_user`}));return{targets:l,confirmed:!1,diagnosticId:u,fatalError:Bs(e,o)?Object.assign(e,{diagnostics:t}):null,diagnostics:t}}}function Ws({groups:e,pupils:t,targetModerator:n}){let r=xs(t);for(let t of e.filter(e=>e.confirmed))for(let e of t.targets){let t=r.get(e.normalizedEmail)||[];if(t.length!==1){e.addResult=Q(`failed`,`INVALID_USER_RESPONSE`,t.length===0?`The add request succeeded, but the user was not found in the refreshed marathon roster.`:`The add request succeeded, but the refreshed user identity was ambiguous.`,e.addRequestAttempts||1,null,{reference:e.addDiagnosticRef}),Ps(e.assignResult)&&(e.assignResult=Q(`skipped`,`ASSIGNMENT_BLOCKED_BY_ADD_FAILURE`,`Curator assignment was skipped because the added user could not be resolved safely.`,0,{blockedBy:`add_user`}));continue}let i=t[0];e.runtimePupil=bs(i),e.addResult=Q(`success`,`USER_ADDED`,`User was added to the marathon.`,e.addRequestAttempts||1,null,{reference:e.addDiagnosticRef}),Ps(e.assignResult)&&e.assignSelected&&(e.assignResult=Array.isArray(i.Moderators)&&i.Moderators.some(e=>Number(e?.TeacherId)===Number(n?.teacherId))?Q(`success`,`CURATOR_ASSIGNED`,`Target curator was assigned during user addition.`,e.addRequestAttempts||1,{blockedBy:`add_user`}):Q(`failed`,`INVALID_MODERATOR_RESPONSE`,`The user was added, but the target curator was not confirmed on the refreshed roster.`,e.addRequestAttempts||1,{blockedBy:`add_user`}))}}function Gs(e,t){for(let n of e.filter(e=>e.confirmed))for(let e of n.targets)Ps(e.addResult)&&(e.addResult=Q(`failed`,`ADD_VERIFICATION_FAILED`,`The add request was accepted, but per-user verification could not finish: ${t?.message||`operation interrupted`}`,e.addRequestAttempts||1,null,{reference:e.addDiagnosticRef}),Ps(e.assignResult)&&(e.assignResult=Q(`skipped`,`ASSIGNMENT_BLOCKED_BY_ADD_FAILURE`,`Curator assignment could not be verified because the added user was not safely resolved.`,0,{blockedBy:`add_user`})))}async function Ks({rows:e,marathonId:t,targetModerator:n,sendRequest:r,wait:i,getConnectionState:a,requestDelayMs:o,onProgress:s}){let c=null,l=e.filter(e=>Ps(e.assignResult)&&e.membership===`in_marathon`&&e.runtimePupil?.marathonPupilId);for(let[u,d]of l.entries()){if(c)break;let f=js({marathonId:t,marathonPupilId:d.runtimePupil.marathonPupilId,existingModeratorIds:d.currentModerators.map(e=>e.id),targetModeratorId:n.id}),p=[];try{d.assignResult=Q(`success`,`CURATOR_ASSIGNED`,`Target curator was assigned while preserving existing curators.`,(await Xn(async()=>{try{let e=await r(f.controller,f.method,f.projectName,f.value);if(e?.Value?.IsSuccess!==!0)throw ps(`INVALID_RESPONSE`,`Curator assignment was not positively confirmed.`);return e}catch(e){throw p.push(Cs(e,`assign_curator`,p.length+1)),e}},{wait:i,getConnectionState:a})).attempts,null,ws(`assign_curator`,p))}catch(e){d.assignResult=Q(`failed`,e.code||`CURATOR_ASSIGNMENT_FAILED`,e.message||`Curator assignment failed.`,e.attempts||1,null,ws(`assign_curator`,p)),Bs(e,a)&&(c=Object.assign(e,{diagnostics:ws(`assign_curator`,p)}))}Hs(s,e,{email:d.email,operation:`assign_curator`}),u<l.length-1&&o>0&&!c&&await i(o)}return c}function qs(e,t=`Not attempted because the operation stopped.`){for(let n of e)Ps(n.addResult)&&(n.addResult=Q(`not_attempted`,`NOT_ATTEMPTED`,t)),Ps(n.assignResult)&&(n.assignResult=Q(`not_attempted`,`NOT_ATTEMPTED`,t))}function Js(e,t){for(let n of e){Rs(n,t?.code||`STATE_CHANGED`,t?.message||`The confirmed plan could not be revalidated.`);let e=ws(`revalidate`,[Cs(t,`revalidate`,1)]);n.addResult?.status===`rejected`&&(n.addResult.diagnostics=e),n.assignResult?.status===`rejected`&&(n.assignResult.diagnostics=e)}}async function Ys({plan:e,marathonId:t,sendRequest:n,wait:r,getConnectionState:i,getRequestContext:a=()=>({host:`edvibe.com`}),now:o=()=>new Date,requestDelayMs:s=250,onProgress:c=()=>{}}){let l=Ns(e),u=[],d=null,f=!1,p=`revalidate`;try{let[m,h]=await Promise.all([$n({sendRequest:n,marathonId:t}),_s({sendRequest:n,marathonId:t})]),g=e.targetModerator?Ss(h,e.targetModerator.id):null;if(e.targetModerator&&(!g||g.teacherId!==e.targetModerator.teacherId))throw ps(`STATE_CHANGED`,`The selected curator changed or disappeared after preflight.`);zs({rows:l,pupils:m,moderators:h,targetModerator:g}),Hs(c,l,{operation:`revalidate`});for(let e of[!1,!0]){if(!l.some(t=>Ps(t.addResult)&&t.membership===`not_in_marathon`&&!!t.assignSelected===e))continue;f=!0,p=e?`add_user_with_curator`:`add_user`;let m=await Us({rows:l,marathonId:t,targetModerator:g,includeModerator:e,sendRequest:n,wait:r,getConnectionState:i,getRequestContext:a,now:o});if(u.push(m),d||=m.fatalError,Hs(c,l,{operation:e?`add_user_with_curator`:`add_user`}),d)break;s>0&&await r(s)}!d&&u.some(e=>e.confirmed)&&(p=`verify_additions`,Ws({groups:u,pupils:await $n({sendRequest:n,marathonId:t}),targetModerator:g}),Hs(c,l,{operation:`verify_additions`})),!d&&g&&(p=`assign_curator`,l.some(e=>Ps(e.assignResult)&&e.membership===`in_marathon`)&&(f=!0),d=await Ks({rows:l,marathonId:t,targetModerator:g,sendRequest:n,wait:r,getConnectionState:i,requestDelayMs:s,onProgress:c}))}catch(e){d=Object.assign(e,{diagnostics:e?.diagnostics?.attempts?e.diagnostics:ws(p,[Cs(e,p,1)])})}return d&&u.some(e=>e.confirmed)&&Gs(u,d),d&&!f&&Js(l,d),qs(l,d?`Not attempted because the operation stopped.`:`The selected operation was not applicable after revalidation.`),Hs(c,l,null),ms({plan:e,diagnostics:u.map(e=>e.diagnostics?{id:e.diagnosticId,...e.diagnostics}:null).filter(Boolean),rows:l.map(e=>({itemId:e.itemId,email:e.email,normalizedEmail:e.normalizedEmail,resolution:e.resolution,membership:e.membership,user:e.runtimePupil?{...e.runtimePupil}:e.user?{...e.user}:null,currentModerators:e.currentModerators.map(e=>({...e})),targetModerator:e.targetModerator?{...e.targetModerator}:null,selectedOperations:[...e.selectedOperations],addResult:e.addResult?{...e.addResult}:null,assignResult:e.assignResult?{...e.assignResult}:null,message:e.message})),fatalError:d?Object.freeze({code:d.code||`INTERNAL_ERROR`,message:d.message||`The operation stopped unexpectedly.`,diagnostics:d.diagnostics||ws(`fatal`,[Cs(d,`fatal`,1)])}):null})}var Xs=`batch_user_onboarding`;function Zs(e){let t=[e.addResult,e.assignResult].filter(Boolean);return e.resolution===`invalid`||e.resolution===`ambiguous`?`rejected`:t.length===0?`skipped`:t.some(e=>e.status===`failed`)?`failed`:t.some(e=>e.status===`not_attempted`)?`not_attempted`:t.some(e=>e.status===`rejected`)?`rejected`:t.some(e=>e.status===`skipped`)?`skipped`:t.every(e=>e.status===`noop`)?`noop`:`success`}function Qs(e,t,n){for(let r of t?.attempts||[]){let t=[r.controller,r.method].filter(Boolean).join(`.`),i=[`attempt ${r.attempt}`,t,r.requestId?`request ${r.requestId}`:null,r.serverErrorCode==null?null:`server ${r.serverErrorCode}`,r.serverMessage,r.elapsedMs==null?null:`${r.elapsedMs}ms`].filter(Boolean);i.length>1&&e.push(`${n}diagnostic: ${i.join(` | `)}`)}}function $s(e){let t=new Map((e.diagnostics||[]).map(e=>[e.id,e])),n=[`Edvibe Toolbox: batch user onboarding`,`Requested users: ${e.plan.counts.requested}`,`Selected additions: ${e.plan.counts.additions}`,`Selected assignments: ${e.plan.counts.assignments}`,e.plan.targetModerator?`Target curator: ${e.plan.targetModerator.name||e.plan.targetModerator.email||e.plan.targetModerator.id}`:`Target curator: not selected`,``];for(let t of e.rows){let e=t.user?.name?`${t.user.name} <${t.email}>`:t.email;n.push(`[${Zs(t)}] ${e}`),t.addResult&&(n.push(`  add_user: ${t.addResult.status} ${t.addResult.code} — ${t.addResult.message}`),t.addResult.diagnostics?.reference||Qs(n,t.addResult.diagnostics,`    `)),t.assignResult&&(n.push(`  assign_curator: ${t.assignResult.status} ${t.assignResult.code} — ${t.assignResult.message}`),Qs(n,t.assignResult.diagnostics,`    `)),!t.addResult&&!t.assignResult&&n.push(`  discovery: ${t.resolution} — ${t.message||`No operation selected.`}`)}for(let[e,r]of t)n.push(``,`Shared request diagnostic: ${e}`),Qs(n,r,`  `);return e.fatalError&&(n.push(``,`Interrupted: ${e.fatalError.code} — ${e.fatalError.message}`),Qs(n,e.fatalError.diagnostics,`  `)),n.join(`
`)}function ec(e){let t=e.map(Zs);return Object.freeze({requested:e.length,eligible:e.filter(e=>![`invalid`,`ambiguous`].includes(e.resolution)&&e.selectedOperations.length>0).length,attempted:e.filter(e=>[e.addResult,e.assignResult].filter(Boolean).some(e=>![`not_attempted`,`rejected`].includes(e.status))).length,successful:t.filter(e=>e===`success`).length,noOp:t.filter(e=>e===`noop`).length,skipped:t.filter(e=>e===`skipped`||e===`rejected`).length,failed:t.filter(e=>e===`failed`).length,notAttempted:t.filter(e=>e===`not_attempted`).length})}function tc(e,t){return t?Object.freeze({name:e,status:t.status,attemptCount:Number(t.attempts)||0,code:t.code||null,message:t.message||null,dependency:t.dependency?Object.freeze({...t.dependency}):null,diagnostics:t.diagnostics?ms(t.diagnostics):null}):null}function nc({marathonId:e,marathonName:t=null,startedAt:n,completedAt:r,result:i}){let a=i.rows||[],o=ec(a),s={selected:0,attempted:0,successful:0,noOp:0,skipped:0,rejected:0,failed:0,notAttempted:0},c=a.map(e=>{let t=[tc(`add_user`,e.addResult),tc(`assign_curator`,e.assignResult)].filter(Boolean);for(let e of t)s.selected+=1,[`not_attempted`,`rejected`].includes(e.status)||(s.attempted+=1),e.status===`success`&&(s.successful+=1),e.status===`noop`&&(s.noOp+=1),e.status===`skipped`&&(s.skipped+=1),e.status===`rejected`&&(s.rejected+=1),e.status===`failed`&&(s.failed+=1),e.status===`not_attempted`&&(s.notAttempted+=1);let n=Zs(e);return Object.freeze({itemId:e.itemId,label:e.email,status:n,code:e.resolution===`invalid`&&e.validationCode?e.validationCode:{success:`USER_ONBOARDING_COMPLETED`,noop:`USER_ONBOARDING_NOOP`,skipped:`USER_ONBOARDING_SKIPPED`,rejected:`USER_ONBOARDING_REJECTED`,failed:`USER_ONBOARDING_FAILED`,not_attempted:`NOT_ATTEMPTED`}[n],message:t.map(e=>e.message).filter(Boolean).join(`; `)||e.message||`No operation selected.`,attempts:t.reduce((e,t)=>e+t.attemptCount,0),data:Object.freeze({submittedInput:e.email,normalizedEmail:e.normalizedEmail,resolution:e.resolution,validationCode:e.validationCode,offendingCharacters:e.offendingCharacters,membershipPreflight:e.membership,user:e.user?Object.freeze({...e.user}):null,existingCurators:Object.freeze(e.currentModerators.map(e=>Object.freeze({...e}))),targetCurator:e.targetModerator?Object.freeze({...e.targetModerator}):null,selectedOperations:Object.freeze([...e.selectedOperations]),operations:Object.freeze(t)})})});return ms({operationType:Xs,startedAt:n,completedAt:r,status:i.fatalError?`interrupted`:o.failed>0||o.skipped>0?`completed_with_failures`:`completed`,pageContext:{marathonId:String(e),marathonName:t},counts:o,results:c,diagnostics:Object.freeze((i.diagnostics||[]).map(e=>ms(e))),fatalError:i.fatalError?ms(i.fatalError):null,message:JSON.stringify({userCounts:o,operationCounts:s})})}var rc=G`
    [hidden] {
        display: none !important;
    }

    .dialog {
        display: flex;
        flex-direction: column;
        width: min(1180px, calc(100vw - 32px));
        max-height: min(880px, calc(100vh - 32px));
        padding: 24px;
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
        color: var(--edvibe-primary);
        font-size: 11px;
        font-weight: 750;
        letter-spacing: .08em;
        text-transform: uppercase;
    }

    .header h2 {
        margin: 0;
        color: var(--edvibe-text-strong);
        font-size: 21px;
        line-height: 1.3;
    }

    .description {
        margin: 5px 0 0;
        color: var(--edvibe-text-muted);
        font-size: 13px;
        line-height: 1.4;
    }

    .icon {
        min-width: 36px;
        padding: 0;
        font-size: 24px;
        line-height: 1;
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
        font-size: 13px;
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
    }

    .email-error {
        flex-basis: 100%;
        color: var(--edvibe-danger);
    }

    .curator-field {
        grid-column: 2;
        grid-row: 1 / span 2;
    }

    .errors {
        margin-top: 14px;
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
        color: var(--edvibe-text-muted);
        font-size: 12px;
    }

    .review-toolbar strong {
        color: var(--edvibe-text);
    }

    .table-wrap {
        overflow: auto;
        max-height: 390px;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    table {
        width: 100%;
        min-width: 1020px;
        border-collapse: collapse;
        color: var(--edvibe-text);
        font-size: 12px;
    }

    th,
    td {
        padding: 10px 11px;
        border-bottom: 1px solid var(--edvibe-border-subtle);
        text-align: left;
        vertical-align: top;
    }

    th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: var(--edvibe-surface-subtle);
        color: var(--edvibe-text);
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
        min-height: 28px;
        margin: 5px auto 0;
        padding: 4px 8px;
        font-size: 10px;
    }

    td strong,
    td small {
        display: block;
        overflow-wrap: anywhere;
    }

    td small {
        margin-top: 3px;
        color: var(--edvibe-text-muted);
    }

    .is-error,
    .row-status {
        overflow-wrap: anywhere;
    }

    .is-error {
        color: var(--edvibe-danger);
    }

    .row-status {
        min-width: 190px;
        color: var(--edvibe-text-muted);
    }

    .preflight,
    .result {
        margin-top: 18px;
        padding: 14px;
        border: 1px solid var(--edvibe-info-border);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-info-surface);
    }

    .preflight h3 {
        margin: 0 0 7px;
        color: var(--edvibe-text-strong);
        font-size: 15px;
    }

    .preflight p,
    .preflight ul {
        margin: 7px 0 0;
        color: var(--edvibe-text-muted);
        font-size: 12px;
        line-height: 1.45;
    }

    .preflight ul {
        max-height: 190px;
        overflow: auto;
        padding-left: 20px;
    }

    .result-actions {
        margin-top: 10px;
    }

    .live-region {
        flex: 0 0 auto;
        padding-top: 14px;
    }

    .status {
        min-height: 20px;
        margin: 0;
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
        margin-top: 18px;
    }

    @media (max-width: 760px) {
        .dialog {
            width: 100%;
            max-height: 100vh;
            padding: 18px;
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
`,ic=`edvibe-toolbox-batch-user-onboarding-dialog`,ac=class extends J{static styles=[cn,ln,un,dn,fn,pn,mn,Fn,rc];static properties={options:{state:!0},rows:{state:!0},plan:{state:!0},mode:{state:!0},executionId:{state:!0},emailInput:{state:!0},targetModeratorId:{state:!0},emailCounts:{state:!0},errors:{state:!0},report:{state:!0},statusMessage:{state:!0},progress:{state:!0}};constructor(){super(),this.options=null,this.rows=[],this.plan=null,this.mode=`loading`,this.executionId=null,this.emailInput=``,this.targetModeratorId=``,this.emailCounts={valid:0,invalid:0,invalidEntries:[]},this.errors=[],this.report=``,this.statusMessage=``,this.progress={visible:!1,completed:0,total:1},this.handleKeydownBound=e=>{e.key===`Escape`&&this.close()}}connectedCallback(){super.connectedCallback(),this.ownerDocument?.addEventListener(`keydown`,this.handleKeydownBound)}disconnectedCallback(){this.ownerDocument?.removeEventListener(`keydown`,this.handleKeydownBound),super.disconnectedCallback()}configure(e={}){return this.options=e&&typeof e==`object`?e:{},this}showLoading(e=`Загрузка…`){return this.mode=`loading`,this.showStatus(e),this}showConfigure(){return this.mode=`configure`,this.plan=null,this.executionId=null,this.clearErrors(),this.report=``,this.progress={visible:!1,completed:0,total:1},this.showStatus(`Введите email пользователей и проверьте список.`),this.updateEmailCounts(),this}updateEmailCounts(){if(!this.options?.parseEmailInput)return;let e=this.options.parseEmailInput(this.emailInput);this.emailCounts={valid:e.entries?.length||0,invalid:e.malformed?.length||0,invalidEntries:Array.isArray(e.invalidEntries)?[...e.invalidEntries]:[]}}async discover(){if(!(!this.options?.onDiscover||this.mode===`executing`)){this.clearErrors(),this.mode=`loading`,this.showStatus(`Проверяем пользователей…`);try{let e=await this.options.onDiscover({emailInput:this.emailInput});this.rows=e.map(e=>({...e,addSelected:!1,assignSelected:!1})),this.plan=null,this.mode=`review`,this.showStatus(`Проверьте найденные состояния и выберите операции.`)}catch(e){this.showError(e),this.mode=`configure`}}}canAssign(e){return!e.actionable||!e.moderatorStateSafe?!1:e.membership===`in_marathon`||e.membership===`not_in_marathon`&&!!e.addSelected}setRowSelection(e,t,n){this.mode===`review`&&(this.rows=this.rows.map(r=>{if(r.normalizedEmail!==e)return r;let i={...r,[t]:!!n};return t===`addSelected`&&!n&&r.membership===`not_in_marathon`&&(i.assignSelected=!1),i}),this.plan=null)}selectAll(e){this.mode===`review`&&(this.rows=this.rows.map(t=>e===`addSelected`&&t.actionable?{...t,addSelected:!0}:e===`assignSelected`&&this.canAssign(t)?{...t,assignSelected:!0}:t),this.plan=null)}async preparePlan(){if(!(!this.options?.onPreflight||this.mode!==`review`)){this.clearErrors();try{this.plan=await this.options.onPreflight({rows:this.rows.map(e=>({normalizedEmail:e.normalizedEmail,addSelected:!!e.addSelected,assignSelected:!!e.assignSelected})),targetModeratorId:this.targetModeratorId}),this.mode=`preflight`,this.showStatus(`План зафиксирован. Проверьте его и подтвердите выполнение.`)}catch(e){this.showError(e)}}}returnToReview(){this.mode===`preflight`&&(this.plan=null,this.mode=`review`,this.showStatus(`Измените выбор и подготовьте новый план.`))}async execute(){if(!(!this.plan||!this.options?.onExecute||this.mode!==`preflight`)){this.mode=`executing`,this.showStatus(`Выполняем подтверждённый план…`),this.progress={visible:!0,completed:0,total:1};try{let e=await this.options.onExecute(this.plan,e=>this.showProgress(e));this.report=e.report||``,this.executionId=e.history?.stored&&e.history.record?.id||null,this.mode=e.fatalError?`partial-complete`:`complete`;let t=e.history?.stored?` Результат сохранён в истории.`:e.history?.persistenceError?` Видимый отчёт сохранён, но историю записать не удалось.`:``;this.showStatus(`${e.fatalError?`Операция прервана, частичные результаты сохранены.`:`Обработка завершена.`}${t}`)}catch(e){this.mode=`partial-complete`,this.showError(e)}finally{this.progress={...this.progress,visible:!1}}}}showProgress(e={}){let t=Math.max(0,Number(e.completed)||0),n=Math.max(0,Number(e.total)||0);this.progress={visible:!0,completed:Math.min(t,Math.max(n,1)),total:Math.max(n,1)};let r=e.current?.operation?` Сейчас: ${e.current.email?`${e.current.email}, `:``}${e.current.operation}.`:``;this.showStatus(`Готово операций: ${t}/${n}. Успешных/no-op: ${e.successes||0}. Проблем: ${e.failures||0}.${r}`)}restart(){this.mode!==`executing`&&(this.rows=[],this.plan=null,this.executionId=null,this.emailInput=``,this.targetModeratorId=``,this.report=``,this.mode=`configure`,this.updateEmailCounts(),this.showStatus(`Введите следующую группу пользователей.`))}close(){this.mode!==`executing`&&this.mode!==`loading`&&this.options?.onClose?.()}clearErrors(){this.errors=[]}showError(e){let t=e?.message||String(e||`Неизвестная ошибка.`);this.errors=[t],this.showStatus(t)}showStatus(e){this.statusMessage=String(e||``)}membershipLabel(e){return{in_marathon:`В марафоне`,resolvable_not_in_marathon:`Можно добавить по email`,ambiguous:`Неоднозначно`,invalid:`Некорректный email`}[e.resolution]||e.resolution}curatorLabel(e){return!e.moderatorStateSafe&&e.membership===`in_marathon`?`Нельзя безопасно прочитать`:e.currentModerators?.length?e.currentModerators.map(e=>e.name||e.email||`#${e.id}`).join(`, `):`Нет`}renderRow(e){return K`
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
            </tr>`}renderPreflight(){return this.plan?K`
            <section class="preflight" ?hidden=${![`preflight`,`executing`].includes(this.mode)}>
                <h3>Неизменяемый план</h3>
                <p>Строк: ${this.plan.counts.requested}. Добавлений: ${this.plan.counts.additions}. Назначений: ${this.plan.counts.assignments}. Предсказанных no-op: ${this.plan.counts.noOps}. Отклонённых операций: ${this.plan.counts.rejectedOperations}.</p>
                <ul>${this.plan.rows.map(e=>{let t=[];return e.add&&t.push(`add: ${e.add.status} (${e.add.code})`),e.assign&&t.push(`assign: ${e.assign.status} (${e.assign.code})`),t.length===0&&t.push(e.message||e.resolution),K`<li>${e.email}: ${t.join(`; `)}</li>`})}</ul>
            </section>`:q}render(){let e=[`review`,`preflight`,`executing`,`complete`,`partial-complete`].includes(this.mode)&&this.rows.length>0,t=[`complete`,`partial-complete`].includes(this.mode);return K`
            <div class="overlay" data-part="overlay" @click=${e=>{e.target===e.currentTarget&&this.close()}}>
                <section class="dialog" data-part="dialog" role="dialog" aria-modal="true" aria-labelledby="batch-user-onboarding-title">
                    <header class="header"><div><p class="eyebrow">Edvibe Toolbox</p><h2 id="batch-user-onboarding-title">Добавить пользователей и назначить куратора</h2><p class="description">Проверьте весь список, подготовьте неизменяемый план и только потом подтвердите запись.</p></div>
                        <button class="icon close" data-control="secondary" type="button" aria-label="Закрыть" ?disabled=${[`loading`,`executing`].includes(this.mode)} @click=${()=>this.close()}>×</button></header>
                    <main class="body">
                        <section class="configure">
                            <label class="field" data-field><span>Email пользователей</span><textarea class="emails" rows="5" placeholder="user@example.com"
                                .value=${this.emailInput} ?disabled=${this.mode!==`configure`}
                                @input=${e=>{this.emailInput=e.currentTarget.value,this.updateEmailCounts()}}></textarea></label>
                            <div class="email-state" data-part="help" aria-live="polite"><span class="valid-count">Уникальных email: ${this.emailCounts.valid}</span><span class="invalid-count">Некорректных: ${this.emailCounts.invalid}</span>${Pn(this.emailCounts.invalidEntries)}</div>
                            <label class="field curator-field" data-field><span>Целевой куратор</span>
                                <select class="curator" .value=${this.targetModeratorId} ?disabled=${![`configure`,`review`].includes(this.mode)}
                                    @change=${e=>{this.targetModeratorId=e.currentTarget.value,this.plan=null}}>
                                    <option value="">Не выбран</option>
                                    ${(this.options?.moderators||[]).map(e=>K`<option value=${String(e.id)}>${e.name?`${e.name}${e.email?` · ${e.email}`:``}`:e.email||`Moderator #${e.id}`}</option>`)}
                                </select><small data-part="help">Нужен только для строк с операцией назначения.</small></label>
                        </section>
                        <section class="errors" data-notice="danger" aria-live="polite" ?hidden=${this.errors.length===0}>${this.errors.map(e=>K`<p>${e}</p>`)}</section>
                        <section class="review" ?hidden=${!e}><div class="review-toolbar"><strong class="review-count">${this.rows.length} строк</strong><span>Все операции по умолчанию выключены.</span></div>
                            <div class="table-wrap"><table><thead><tr><th>Пользователь</th><th>Статус</th><th>Текущие кураторы</th><th>Добавить<button class="select-all-add" data-control="secondary" type="button" ?disabled=${this.mode!==`review`} @click=${()=>this.selectAll(`addSelected`)}>Выбрать все</button></th><th>Назначить<button class="select-all-assign" data-control="secondary" type="button" ?disabled=${this.mode!==`review`} @click=${()=>this.selectAll(`assignSelected`)}>Выбрать все</button></th><th>Проверка / результат</th></tr></thead><tbody class="rows">${this.rows.map(e=>this.renderRow(e))}</tbody></table></div>
                        </section>
                        ${this.renderPreflight()}
                        <section class="result" ?hidden=${!t}><label class="field" data-field><span>Отчёт</span><textarea class="report" rows="12" readonly .value=${this.report}></textarea></label>
                            <div class="result-actions" data-part="actions"><button class="copy secondary" data-control="secondary" type="button" @click=${()=>this.options?.onCopy?.(this.report)}>Скопировать отчёт</button><button class="history secondary" data-control="secondary" type="button" ?hidden=${!this.executionId} @click=${()=>this.executionId&&this.options?.onOpenHistory?.(this.executionId)}>Открыть в истории</button></div></section>
                    </main>
                    <div class="live-region"><p class="status" data-part="status" role="status" aria-live="polite">${this.statusMessage}</p><progress class="progress" data-part="progress" max=${this.progress.total} value=${this.progress.completed} ?hidden=${!this.progress.visible}></progress></div>
                    <footer class="footer" data-part="actions">
                        <button class="restart secondary" data-control="secondary" type="button" ?hidden=${!t} @click=${this.restart}>Запустить другую группу</button>
                        <button class="edit secondary" data-control="secondary" type="button" ?hidden=${this.mode!==`preflight`} @click=${this.returnToReview}>Изменить выбор</button>
                        <button class="discover primary" data-control type="button" ?hidden=${this.mode!==`configure`} @click=${this.discover}>Проверить пользователей</button>
                        <button class="prepare primary" data-control type="button" ?hidden=${this.mode!==`review`} @click=${this.preparePlan}>Подготовить план</button>
                        <button class="execute primary" data-control type="button" ?hidden=${this.mode!==`preflight`} @click=${this.execute}>Подтвердить и выполнить</button>
                    </footer>
                </section>
            </div>`}};customElements.get(`edvibe-toolbox-batch-user-onboarding-dialog`)||customElements.define(ic,ac);var oc=`edvibe-toolbox-batch-user-onboarding-dialog`;function sc(e){return qn(e,{includeItems:!0})}function cc({transport:e,operationGuard:t,logger:n,executionHistoryService:r,dispatch:i}){return uc({sendRequest:e.sendRequest,getConnectionState:e.getConnectionState,canStart:t.canStart,onActiveChange:t.guardedActiveChange(`batch-user-onboarding`),createDialog:()=>document.createElement(ic),copyText:e=>navigator.clipboard.writeText(e),persistExecution:r.persistTerminal,openHistory:e=>i({type:W.OPEN_EXECUTION_HISTORY,executionId:e}),getLocationHref:()=>window.location.href,getMarathonName:()=>document.querySelector(`h1`)?.textContent?.trim()||document.title||null,getRequestContext:()=>({host:window.location.hostname}),logger:n.createChildLogger(`BatchUserOnboarding`)})}var lc=Object.freeze({type:W.OPEN_BATCH_USER_ONBOARDING,create(e){let t=cc(e);return()=>t.open()}});function uc({sendRequest:e,getConnectionState:t,canStart:n,onActiveChange:r,createDialog:i=()=>document.createElement(oc),copyText:a=e=>navigator.clipboard.writeText(e),persistExecution:o=async()=>Object.freeze({stored:!1}),openHistory:s=()=>{},getLocationHref:c=()=>window.location.href,getMarathonName:l=()=>document.querySelector(`h1`)?.textContent?.trim()||document.title||null,getRequestContext:u=()=>({host:window.location.hostname}),now:d=()=>new Date,logger:f={log(){}}}){let p=!1;function m(){p&&(p=!1,r(!1))}async function h(){if(p||!n()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}let h=Wn(c());if(!h){window.alert(`Open an Edvibe marathon page before adding users.`);return}p=!0,r(!0);let g=i();(document.body||document.documentElement).appendChild(g);try{g.showLoading?.(`Loading marathon users and curators…`);let[n,r]=await Promise.all([$n({sendRequest:e,marathonId:h}),_s({sendRequest:e,marathonId:h})]),i=[];g.configure({moderators:r,parseEmailInput:sc,onDiscover({emailInput:e}){let t=sc(e);if(t.items.length===0)throw Y(`EMAILS_REQUIRED`,`Enter at least one email address.`);return i=Ts(t,n,r),i},onPreflight({rows:e,targetModeratorId:t}){let n=new Map((e||[]).map(e=>[e.normalizedEmail,{addSelected:!!e.addSelected,assignSelected:!!e.assignSelected}])),a=Ds({rows:i.map(e=>({...e,...n.get(e.normalizedEmail)||{addSelected:!1,assignSelected:!1}})),moderators:r,targetModeratorId:t});if(a.counts.selectedOperations===0)throw Y(`OPERATIONS_REQUIRED`,`Select at least one add or curator-assignment operation.`);return a},async onExecute(n,r){let i=d().toISOString(),a=await Ys({plan:n,marathonId:h,sendRequest:e,wait:Te,getConnectionState:t,getRequestContext:u,now:d,onProgress:r}),s=$s(a),c=d().toISOString(),p;try{p=await o(nc({marathonId:h,marathonName:l(),startedAt:i,completedAt:c,result:a}))}catch(e){p=Object.freeze({stored:!1,persistenceError:e}),f.log(`Batch user onboarding history persistence failed:`,e)}return{...a,report:s,history:p}},onCopy:a,onOpenHistory(e){g.remove(),m(),s(e)},onClose(){g.remove(),m()}}),g.showConfigure?.(),f.log(`Batch user onboarding initialized for MarathonId ${h}.`)}catch(e){f.log(`Batch user onboarding initialization failed (${e.code||`UNKNOWN_ERROR`}).`),g.remove(),m(),window.alert(e.message||`Could not initialize batch user onboarding.`)}}return Object.freeze({open:h})}var dc=G`
    :host {
        --history-accent: var(--edvibe-primary);
        --history-text: var(--edvibe-text);
        --history-muted: var(--edvibe-text-muted);
        --history-border: var(--edvibe-border-subtle);
        --history-surface: var(--edvibe-surface);
        color: var(--history-text);
    }

    .overlay {
        backdrop-filter: blur(5px);
    }

    .dialog {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr) auto;
        width: min(1180px, 96vw);
        height: min(820px, 94vh);
        background: var(--edvibe-surface-app);
    }

    .dialog-header,
    .dialog-footer {
        padding: 20px 24px;
        background: var(--history-surface);
    }

    .dialog-header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        border-bottom: 1px solid var(--history-border);
    }

    .eyebrow {
        margin: 0 0 4px;
        color: var(--history-accent);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .12em;
        text-transform: uppercase;
    }

    h2,
    h3,
    h4,
    p {
        margin: 0;
    }

    h2 {
        font-size: 24px;
        letter-spacing: -.025em;
    }

    .header-copy {
        margin-top: 5px;
        color: var(--history-muted);
        font-size: 13px;
    }

    .icon-button {
        width: 38px;
        height: 38px;
        padding: 0;
        font-size: 25px;
        line-height: 1;
    }

    .workspace {
        display: grid;
        grid-template-columns: minmax(340px, 40%) minmax(0, 1fr);
        min-height: 0;
    }

    .browser-panel {
        display: flex;
        min-height: 0;
        flex-direction: column;
        padding: 18px;
        border-right: 1px solid var(--history-border);
    }

    .filters {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 14px;
        border: 1px solid var(--history-border);
        border-radius: var(--edvibe-radius-panel);
        background: var(--history-surface);
    }

    .filters [data-field],
    .settings-grid [data-field] {
        font-size: 11px;
    }

    .date-fields {
        display: grid;
        grid-column: 1 / -1;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }

    .filter-actions {
        grid-column: 1 / -1;
        justify-content: flex-start;
    }

    button.compact {
        min-height: 32px;
        padding: 6px 9px;
        font-size: 11px;
    }

    .list-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 15px 2px 9px;
    }

    .list-toolbar strong {
        font-size: 12px;
    }

    .state-card {
        margin: 0;
    }

    .state-card.is-error {
        border-color: var(--edvibe-danger-border);
        color: var(--edvibe-danger);
        background: var(--edvibe-danger-surface);
    }

    .record-list {
        min-height: 0;
        overflow: auto;
        padding-right: 4px;
    }

    .record-card {
        display: grid;
        width: 100%;
        gap: 5px;
        margin-bottom: 8px;
        padding: 13px;
        border: 1px solid var(--history-border);
        border-radius: var(--edvibe-radius-card);
        color: var(--history-text);
        background: var(--history-surface);
        font: inherit;
        text-align: left;
        cursor: pointer;
    }

    .record-card:hover,
    .record-card[aria-pressed="true"] {
        border-color: var(--edvibe-info-border);
        box-shadow: var(--edvibe-shadow-card);
    }

    .record-card:focus-visible,
    summary:focus-visible {
        outline: 3px solid var(--edvibe-focus-outline);
        outline-offset: 2px;
    }

    .record-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }

    .record-heading strong {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .status-chip {
        display: inline-flex;
        flex: none;
        padding: 3px 7px;
        border-radius: var(--edvibe-radius-pill);
        color: var(--history-muted);
        background: var(--edvibe-surface-subtle);
        font-size: 10px;
        font-weight: 800;
    }

    .record-card[data-status="completed"] .status-chip {
        color: var(--edvibe-success);
        background: var(--edvibe-success-surface);
    }

    .record-card[data-status="completed_with_failures"] .status-chip {
        color: var(--edvibe-warning);
        background: var(--edvibe-warning-surface);
    }

    .record-card[data-status="interrupted"] .status-chip,
    .record-card[data-status="cancelled"] .status-chip {
        color: var(--edvibe-danger);
        background: var(--edvibe-danger-surface);
    }

    .record-context,
    .record-outcome,
    time {
        color: var(--history-muted);
        font-size: 11px;
    }

    time {
        margin-top: 2px;
    }

    .detail-panel {
        min-width: 0;
        overflow: auto;
        padding: 24px;
        background: var(--history-surface);
    }

    .detail-placeholder {
        display: grid;
        height: 100%;
        place-content: center;
        justify-items: center;
    }

    .detail-placeholder span {
        display: grid;
        width: 52px;
        height: 52px;
        place-items: center;
        margin-bottom: 12px;
        border-radius: var(--edvibe-radius-panel);
        color: var(--history-accent);
        background: var(--edvibe-info-surface);
        font-size: 24px;
    }

    .detail-placeholder h3 {
        color: var(--history-text);
    }

    .detail-placeholder p {
        margin-top: 5px;
        font-size: 12px;
    }

    .detail-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: flex-start;
    }

    .detail-header h3 {
        font-size: 20px;
    }

    .detail-header p {
        margin-top: 4px;
        color: var(--history-muted);
        font-size: 12px;
    }

    .detail-actions {
        flex-wrap: nowrap;
    }

    .summary-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin: 20px 0;
    }

    .summary-grid div {
        min-width: 0;
        padding: 12px;
        border: 1px solid var(--history-border);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface-subtle);
    }

    .summary-grid dt {
        color: var(--history-muted);
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
    }

    .summary-grid dd {
        overflow-wrap: anywhere;
        margin: 5px 0 0;
        font-size: 12px;
    }

    .counts {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
    }

    .counts div {
        display: grid;
        gap: 2px;
        padding: 11px;
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface-subtle);
    }

    .counts strong {
        font-size: 18px;
    }

    .counts span {
        color: var(--history-muted);
        font-size: 10px;
        text-transform: capitalize;
    }

    .outcomes {
        margin-top: 22px;
    }

    .outcomes h4 {
        margin-bottom: 10px;
    }

    .outcome-card {
        margin-bottom: 8px;
        padding: 12px;
        border: 1px solid var(--history-border);
        border-radius: var(--edvibe-radius-panel);
    }

    .outcome-card > div {
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }

    .outcome-card p {
        margin-top: 5px;
        color: var(--edvibe-text-muted);
        font-size: 12px;
        line-height: 1.45;
    }

    .outcome-card small {
        display: block;
        margin-top: 6px;
        color: var(--history-muted);
    }

    .outcome-card details {
        margin-top: 9px;
        color: var(--history-muted);
        font-size: 11px;
    }

    .outcome-card pre {
        overflow: auto;
        margin: 7px 0 0;
        padding: 10px;
        border-radius: var(--edvibe-radius-control);
        color: var(--history-text);
        background: var(--edvibe-surface-subtle);
        font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
        white-space: pre-wrap;
    }

    .interruptions {
        margin-bottom: 22px;
        padding: 14px;
        border: 1px solid var(--edvibe-danger-border);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-danger-surface);
    }

    .interruptions > .muted {
        margin: -4px 0 10px;
    }

    .diagnostics > summary {
        cursor: pointer;
        color: var(--edvibe-text-muted);
        font-weight: 800;
    }

    .diagnostic-attempts {
        display: grid;
        gap: 10px;
        margin-top: 9px;
    }

    .diagnostic-attempt {
        min-width: 0;
        padding: 11px;
        border: 1px solid var(--history-border);
        border-radius: var(--edvibe-radius-control);
        background: var(--edvibe-surface-subtle);
    }

    .diagnostic-metadata {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        margin: 0;
    }

    .diagnostic-metadata div {
        min-width: 0;
    }

    .diagnostic-metadata dt,
    .diagnostic-message strong,
    .diagnostic-summaries h5 {
        color: var(--history-muted);
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
    }

    .diagnostic-metadata dd {
        overflow-wrap: anywhere;
        margin: 2px 0 0;
        color: var(--history-text);
    }

    .diagnostic-message {
        margin-top: 10px;
    }

    .diagnostic-message p {
        overflow-wrap: anywhere;
        margin-top: 3px;
    }

    .diagnostic-summaries {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        margin-top: 10px;
    }

    .diagnostic-summaries section {
        min-width: 0;
    }

    .diagnostic-summaries h5 {
        margin: 0;
    }

    .diagnostic-summaries pre {
        max-width: 100%;
        max-height: 240px;
        overflow: auto;
        overflow-wrap: anywhere;
        word-break: break-word;
        white-space: pre-wrap;
    }

    .muted {
        color: var(--history-muted);
        font-size: 12px;
    }

    .dialog-footer {
        border-top: 1px solid var(--history-border);
    }

    .retention-settings summary {
        cursor: pointer;
        color: var(--edvibe-text-muted);
        font-size: 12px;
        font-weight: 800;
    }

    .settings-grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr 1fr 1.5fr auto;
        gap: 10px;
        align-items: end;
        margin-top: 12px;
    }

    .settings-grid label.checkbox {
        display: flex;
        align-items: center;
        gap: 7px;
        padding-bottom: 9px;
        color: var(--history-muted);
        font-size: 11px;
        font-weight: 700;
    }

    .settings-grid label.checkbox input {
        width: auto;
    }

    .footer-actions {
        margin-top: 14px;
    }

    .toast {
        margin-top: 10px;
        font-size: 11px;
    }

    @media (max-width: 840px) {
        .dialog {
            width: 100vw;
            height: 100vh;
        }

        .workspace {
            grid-template-columns: 1fr;
            overflow: auto;
        }

        .browser-panel {
            min-height: 450px;
            border-right: 0;
            border-bottom: 1px solid var(--history-border);
        }

        .detail-panel {
            min-height: 500px;
        }

        .diagnostic-metadata,
        .diagnostic-summaries {
            grid-template-columns: 1fr;
        }

        .settings-grid {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            scroll-behavior: auto !important;
            transition: none !important;
        }
    }
`,fc=`edvibe-toolbox-execution-history-dialog`,pc=Object.freeze({completed:`Completed`,completed_with_failures:`Completed with failures`,cancelled:`Cancelled`,interrupted:`Interrupted`});function mc(e){return pc[e]||String(e||`Unknown`)}function hc(e,t){let n=new Date(e);return Number.isNaN(n.getTime())?String(e||``):new Intl.DateTimeFormat(t||void 0,{dateStyle:`medium`,timeStyle:`short`}).format(n)}function gc(e){return Object.freeze({title:e.operationType,subtitle:e.pageContext?.marathonName||(e.pageContext?.marathonId?`Marathon #${e.pageContext.marathonId}`:`No marathon context`),outcome:`${e.counts.successful} successful · ${e.counts.failed} failed · ${e.counts.skipped} skipped`})}var _c=new Set([`failed`,`rejected`,`interrupted`]);function vc(e){return e==null?`Not available`:JSON.stringify(e,null,2)}function yc(e){return _c.has(e.status)&&!e.itemId}var bc=class extends J{static styles=[cn,ln,un,dn,fn,pn,hn,dc];static properties={options:{state:!0},records:{state:!0},selectedRecord:{state:!0},operationTypes:{state:!0},filterOperationType:{state:!0},filterStatus:{state:!0},filterMarathonId:{state:!0},filterFrom:{state:!0},filterTo:{state:!0},listState:{state:!0},listMessage:{state:!0},preferences:{state:!0},toastMessage:{state:!0},toastError:{state:!0}};constructor(){super(),this.options=null,this.records=[],this.selectedRecord=null,this.operationTypes=[],this.filterOperationType=``,this.filterStatus=``,this.filterMarathonId=``,this.filterFrom=``,this.filterTo=``,this.listState=`loading`,this.listMessage=`Loading history…`,this.preferences={mode:`limits`,maxCount:``,maxAgeDays:``,autoExport:!1},this.toastMessage=``,this.toastError=!1,this.initializationPromise=null,this.handleKeydownBound=e=>{e.key===`Escape`&&this.options?.onClose?.()}}configure(e={}){return this.options=e&&typeof e==`object`?e:{},this.isConnected&&this.initialize(),this}connectedCallback(){super.connectedCallback(),this.addEventListener(`keydown`,this.handleKeydownBound),this.initialize()}disconnectedCallback(){this.removeEventListener(`keydown`,this.handleKeydownBound),super.disconnectedCallback()}initialize(){return this.options?(this.initializationPromise||=(async()=>{await this.updateComplete,this.shadowRoot?.querySelector(`[data-action="close"]`)?.focus(),await this.loadPreferences(),await this.loadRecords(),this.options.initialExecutionId&&await this.openRecord(this.options.initialExecutionId)})(),this.initializationPromise):Promise.resolve()}get filters(){let e={operationType:this.filterOperationType,status:this.filterStatus,marathonId:this.filterMarathonId,from:this.filterFrom,to:this.filterTo};return Object.fromEntries(Object.entries(e).filter(([,e])=>e!==``))}setFilter(e,t){let n=String(t||``);e===`operationType`&&(this.filterOperationType=n),e===`status`&&(this.filterStatus=n),e===`marathonId`&&(this.filterMarathonId=n),e===`from`&&(this.filterFrom=n),e===`to`&&(this.filterTo=n)}async loadRecords(){this.listState=`loading`,this.listMessage=`Loading history…`;try{this.records=await this.options.service.list(this.filters),this.operationTypes=[...new Set([...this.operationTypes,...this.records.map(e=>e.operationType)])].sort(),this.listState=this.records.length===0?`empty`:`ready`,this.listMessage=this.records.length===0?`No executions match these filters.`:``}catch(e){this.records=[],this.listState=`error`,this.listMessage=e.message||`Could not load execution history.`}}renderEmptyDetail(){this.selectedRecord=null}async openRecord(e){try{let t=await this.options.service.get(e);if(!t)throw Error(`Execution record was not found.`);this.selectedRecord=t}catch(e){this.showToast(e.message||`Could not open the execution.`,!0)}}async loadPreferences(){try{let e=await this.options.service.getPreferences();this.preferences={mode:e.mode,maxCount:e.maxCount,maxAgeDays:e.maxAgeDays,autoExport:!!e.autoExport}}catch(e){this.showToast(e.message||`Could not load retention settings.`,!0)}}updatePreference(e,t){this.preferences={...this.preferences,[e]:t}}async savePreferences(){let e={mode:this.preferences.mode,maxCount:Number(this.preferences.maxCount),maxAgeDays:Number(this.preferences.maxAgeDays),autoExport:!!this.preferences.autoExport};try{await this.options.service.setPreferences(e),this.showToast(`Retention settings saved.`)}catch(e){this.showToast(e.message||`Could not save retention settings.`,!0)}}async resetFilters(){this.filterOperationType=``,this.filterStatus=``,this.filterMarathonId=``,this.filterFrom=``,this.filterTo=``,await this.loadRecords()}confirm(e){return this.ownerDocument.defaultView.confirm(e)}async runAction(e,t,n){try{await e(),this.showToast(t)}catch(e){this.showToast(e.message||n,!0)}}async runMutation(e,t,n){try{await e(),this.renderEmptyDetail(),await this.loadRecords(),this.showToast(t)}catch(e){this.showToast(e.message||n,!0)}}async handleAction(e){e===`close`&&this.options.onClose?.(),e===`reset-filters`&&await this.resetFilters(),e===`export-filtered`&&await this.runAction(()=>this.options.service.exportFiltered(this.filters),`Filtered history exported.`,`Could not export history.`),e===`download-one`&&this.selectedRecord&&await this.runAction(()=>this.options.service.exportRecord(this.selectedRecord.id),`Execution exported.`,`Could not export execution.`),e===`delete-one`&&this.selectedRecord&&this.confirm(`Delete execution ${this.selectedRecord.id}?`)&&await this.runMutation(()=>this.options.service.delete(this.selectedRecord.id),`Execution deleted.`,`Could not delete the execution.`),e===`clear-all`&&this.confirm(`Clear all execution history? This cannot be undone.`)&&await this.runMutation(()=>this.options.service.clear(),`Execution history cleared.`,`Could not clear execution history.`),e===`save-preferences`&&await this.savePreferences()}showToast(e,t=!1){this.toastMessage=String(e||``),this.toastError=!!t}renderRecord(e){let t=gc(e);return K`
            <button type="button" class="record-card" data-execution-id=${e.id}
                data-status=${e.status}
                aria-pressed=${String(this.selectedRecord?.id===e.id)}
                @click=${()=>this.openRecord(e.id)}>
                <span class="record-heading">
                    <strong>${t.title}</strong>
                    <span class="status-chip">${mc(e.status)}</span>
                </span>
                <span class="record-context">${t.subtitle}</span>
                <span class="record-outcome">${t.outcome}</span>
                <time>${hc(e.completedAt)}</time>
            </button>
        `}renderOutcome(e){let t=e.data&&Object.keys(e.data).length>0;return K`
            <article class="outcome-card" data-status=${e.status}>
                <div><strong>${e.label}</strong><span class="status-chip">${e.status}</span></div>
                <p>${e.message}</p>
                <small>${e.code} · ${e.attempts} attempt${e.attempts===1?``:`s`}</small>
                ${t?K`
                    <details><summary>Item details</summary><pre>${JSON.stringify(e.data,null,2)}</pre></details>
                `:``}
                ${_c.has(e.status)?this.renderDiagnostics(e.diagnostics):``}
            </article>
        `}renderDiagnostics(e){return e?.requestAttempts?.length?K`
            <details class="diagnostics">
                <summary>Request diagnostics</summary>
                <div class="diagnostic-attempts">
                    ${e.requestAttempts.map(e=>K`
                        <section class="diagnostic-attempt" aria-label=${`Request attempt ${e.attemptNumber}`}>
                            <dl class="diagnostic-metadata">
                                <div><dt>Endpoint</dt><dd>${e.method} · ${[e.projectName,e.controller,e.operationName].filter(Boolean).join(` / `)}</dd></div>
                                <div><dt>Request ID</dt><dd>${e.requestId||`Not available`}</dd></div>
                                <div><dt>Attempt</dt><dd>${e.attemptNumber}</dd></div>
                                <div><dt>Duration</dt><dd>${e.durationMs==null?`Not available`:`${e.durationMs} ms`}</dd></div>
                                <div><dt>Transport code</dt><dd>${e.transportCode||`Not available`}</dd></div>
                                <div><dt>Server code</dt><dd>${e.serverErrorCode||`Not available`}</dd></div>
                            </dl>
                            <div class="diagnostic-message"><strong>Server message</strong><p>${e.serverErrorMessage||`Not available`}</p></div>
                            <div class="diagnostic-summaries">
                                <section aria-label="Request summary"><h5>Request summary</h5><pre>${vc(e.requestSummary)}</pre></section>
                                <section aria-label="Response summary"><h5>Response summary</h5><pre>${vc(e.responseSummary)}</pre></section>
                            </div>
                        </section>
                    `)}
                </div>
            </details>
        `:``}renderDetail(){let e=this.selectedRecord;if(!e)return K`
                <div class="detail-placeholder" data-part="empty-state">
                    <span aria-hidden="true">↗</span>
                    <h3>Select an execution</h3>
                    <p>Its summary and ordered item outcomes will appear here.</p>
                </div>
            `;let t=[[`Execution ID`,e.id],[`Marathon`,e.pageContext?.marathonName||e.pageContext?.marathonId||`Not recorded`],[`Started`,hc(e.startedAt)],[`Completed`,hc(e.completedAt)]],n=e.results.filter(yc),r=e.results.filter(e=>!yc(e));return K`
            <section class="detail-header">
                <div>
                    <h3>${e.operationType}</h3>
                    <p>${mc(e.status)} · ${hc(e.completedAt)}</p>
                </div>
                <div class="detail-actions" data-part="actions">
                    <button type="button" class="secondary" data-control="secondary" @click=${()=>this.handleAction(`download-one`)}>Download JSON</button>
                    <button type="button" class="danger secondary" data-control="danger" @click=${()=>this.handleAction(`delete-one`)}>Delete</button>
                </div>
            </section>
            <dl class="summary-grid">
                ${t.map(([e,t])=>K`<div><dt>${e}</dt><dd>${t}</dd></div>`)}
            </dl>
            <section class="counts">
                ${Object.entries(e.counts).map(([e,t])=>K`
                    <div><strong>${t}</strong><span>${e.replace(/[A-Z]/g,e=>` ${e.toLowerCase()}`)}</span></div>
                `)}
            </section>
            <section class="outcomes">
                ${n.length?K`
                    <section class="interruptions" aria-labelledby="interruption-heading">
                        <h4 id="interruption-heading">Execution interruption</h4>
                        <p class="muted">Failures that stopped the execution before they could be associated with an item.</p>
                        ${n.map(e=>this.renderOutcome(e))}
                    </section>
                `:``}
                <h4>Item outcomes (${r.length})</h4>
                ${r.length===0?K`<p class="muted">No per-item outcomes were recorded.</p>`:r.map(e=>this.renderOutcome(e))}
            </section>
        `}render(){let e=this.listState===`ready`,t=!e,n=`state-card${this.listState===`error`?` is-error`:``}`,r=this.preferences.mode===`indefinite`,i=`toast${this.toastError?` is-error`:``}`;return K`
            <div class="overlay" data-part="overlay">
                <section class="dialog" data-part="dialog" role="dialog" aria-modal="true" aria-labelledby="history-title">
                    <header class="dialog-header">
                        <div><p class="eyebrow">Edvibe Toolbox</p><h2 id="history-title">Execution history</h2><p class="header-copy">Browse terminal operation reports stored in this browser.</p></div>
                        <button class="icon-button" data-control="secondary" type="button" data-action="close" aria-label="Close" @click=${()=>this.handleAction(`close`)}>×</button>
                    </header>
                    <div class="workspace">
                        <aside class="browser-panel">
                            <form class="filters" data-role="filters" @submit=${e=>{e.preventDefault(),this.loadRecords()}}>
                                <label data-field>Operation<select name="operationType" .value=${this.filterOperationType} @change=${e=>this.setFilter(`operationType`,e.currentTarget.value)}>
                                    <option value="">All operations</option>
                                    ${this.operationTypes.map(e=>K`<option value=${e}>${e}</option>`)}
                                </select></label>
                                <label data-field>Status<select name="status" .value=${this.filterStatus} @change=${e=>this.setFilter(`status`,e.currentTarget.value)}>
                                    <option value="">All statuses</option><option value="completed">Completed</option><option value="completed_with_failures">Completed with failures</option><option value="cancelled">Cancelled</option><option value="interrupted">Interrupted</option>
                                </select></label>
                                <label data-field>Marathon<input name="marathonId" type="search" inputmode="numeric" placeholder="Any marathon" .value=${this.filterMarathonId} @input=${e=>this.setFilter(`marathonId`,e.currentTarget.value)}></label>
                                <div class="date-fields">
                                    <label data-field>From<input name="from" type="date" .value=${this.filterFrom} @input=${e=>this.setFilter(`from`,e.currentTarget.value)}></label>
                                    <label data-field>To<input name="to" type="date" .value=${this.filterTo} @input=${e=>this.setFilter(`to`,e.currentTarget.value)}></label>
                                </div>
                                <div class="filter-actions" data-part="actions"><button data-control type="submit">Apply</button><button data-control="secondary" type="button" class="secondary" @click=${()=>this.handleAction(`reset-filters`)}>Reset</button></div>
                            </form>
                            <div class="list-toolbar"><strong data-role="record-count">${this.records.length} execution${this.records.length===1?``:`s`}</strong><button type="button" data-control="secondary" class="secondary compact" @click=${()=>this.handleAction(`export-filtered`)}>Export filtered</button></div>
                            <div class=${n} data-part="empty-state" data-role="state" ?hidden=${!t}>${this.listMessage}</div>
                            <div class="record-list" data-role="record-list" ?hidden=${!e}>${this.records.map(e=>this.renderRecord(e))}</div>
                        </aside>
                        <main class="detail-panel" data-role="detail">${this.renderDetail()}</main>
                    </div>
                    <footer class="dialog-footer">
                        <details class="retention-settings"><summary>Retention & automatic export</summary><div class="settings-grid">
                            <label class="checkbox"><input type="checkbox" name="keepIndefinitely" .checked=${r} @change=${e=>this.updatePreference(`mode`,e.currentTarget.checked?`indefinite`:`limits`)}>Keep indefinitely</label>
                            <label data-field>Newest executions<input type="number" name="maxCount" min="1" step="1" .value=${String(this.preferences.maxCount)} ?disabled=${r} @input=${e=>this.updatePreference(`maxCount`,e.currentTarget.value)}></label>
                            <label data-field>Maximum age, days<input type="number" name="maxAgeDays" min="1" step="1" .value=${String(this.preferences.maxAgeDays)} ?disabled=${r} @input=${e=>this.updatePreference(`maxAgeDays`,e.currentTarget.value)}></label>
                            <label class="checkbox"><input type="checkbox" name="autoExport" .checked=${this.preferences.autoExport} @change=${e=>this.updatePreference(`autoExport`,e.currentTarget.checked)}>Download JSON after persistence</label>
                            <button type="button" data-control @click=${()=>this.handleAction(`save-preferences`)}>Save settings</button>
                        </div></details>
                        <div class="footer-actions" data-part="actions"><button type="button" data-control="danger" class="danger secondary" @click=${()=>this.handleAction(`clear-all`)}>Clear all history</button><button type="button" data-control @click=${()=>this.handleAction(`close`)}>Close</button></div>
                        <p class=${i} data-notice=${this.toastError?`danger`:`success`} data-role="toast" role="status" ?hidden=${!this.toastMessage}>${this.toastMessage}</p>
                    </footer>
                </section>
            </div>
        `}};customElements.get(`edvibe-toolbox-execution-history-dialog`)||customElements.define(fc,bc);var xc=`edvibe-toolbox-execution-history`;function Sc({operationGuard:e,logger:t,executionHistoryService:n}){return Cc({service:n,canStart:e.canStart,onActiveChange:e.guardedActiveChange(`history`),createDialog:()=>document.createElement(fc),logger:t.createChildLogger(`History`)})}function Cc({service:e,canStart:t,onActiveChange:n,createDialog:r,logger:i={log(){}}}){let a=!1;function o({executionId:o=null}={}){if(!(a||document.getElementById(`edvibe-toolbox-execution-history`))){if(!t()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}a=!0,n(!0);try{let t=r();t.id=xc,t.configure({service:e,initialExecutionId:o,onClose(){t.remove(),a=!1,n(!1)}}),(document.body||document.documentElement).append(t)}catch(e){a=!1,n(!1),i.log(`Failed to open execution history:`,e),window.alert(e.message||`Could not open execution history.`)}}}return Object.freeze({open:o,service:e})}var wc=Object.freeze({type:W.OPEN_EXECUTION_HISTORY,create(e){let t=Sc(e);return({executionId:e})=>t.open({executionId:e??null})}}),Tc=l(o(((e,t)=>{(function(n){typeof e==`object`&&t!==void 0?t.exports=n():typeof define==`function`&&define.amd?define([],n):(typeof window<`u`?window:typeof global<`u`?global:typeof self<`u`?self:this).JSZip=n()})(function(){return function e(t,n,r){function i(o,s){if(!n[o]){if(!t[o]){var c=typeof require==`function`&&require;if(!s&&c)return c(o,!0);if(a)return a(o,!0);var l=Error(`Cannot find module '`+o+`'`);throw l.code=`MODULE_NOT_FOUND`,l}var u=n[o]={exports:{}};t[o][0].call(u.exports,function(e){var n=t[o][1][e];return i(n||e)},u,u.exports,e,t,n,r)}return n[o].exports}for(var a=typeof require==`function`&&require,o=0;o<r.length;o++)i(r[o]);return i}({1:[function(e,t,n){"use strict";var r=e(`./utils`),i=e(`./support`),a=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=`;n.encode=function(e){for(var t,n,i,o,s,c,l,u=[],d=0,f=e.length,p=f,m=r.getTypeOf(e)!==`string`;d<e.length;)p=f-d,i=m?(t=e[d++],n=d<f?e[d++]:0,d<f?e[d++]:0):(t=e.charCodeAt(d++),n=d<f?e.charCodeAt(d++):0,d<f?e.charCodeAt(d++):0),o=t>>2,s=(3&t)<<4|n>>4,c=1<p?(15&n)<<2|i>>6:64,l=2<p?63&i:64,u.push(a.charAt(o)+a.charAt(s)+a.charAt(c)+a.charAt(l));return u.join(``)},n.decode=function(e){var t,n,r,o,s,c,l=0,u=0,d=`data:`;if(e.substr(0,d.length)===d)throw Error(`Invalid base64 input, it looks like a data url.`);var f,p=3*(e=e.replace(/[^A-Za-z0-9+/=]/g,``)).length/4;if(e.charAt(e.length-1)===a.charAt(64)&&p--,e.charAt(e.length-2)===a.charAt(64)&&p--,p%1!=0)throw Error(`Invalid base64 input, bad content length.`);for(f=i.uint8array?new Uint8Array(0|p):Array(0|p);l<e.length;)t=a.indexOf(e.charAt(l++))<<2|(o=a.indexOf(e.charAt(l++)))>>4,n=(15&o)<<4|(s=a.indexOf(e.charAt(l++)))>>2,r=(3&s)<<6|(c=a.indexOf(e.charAt(l++))),f[u++]=t,s!==64&&(f[u++]=n),c!==64&&(f[u++]=r);return f}},{"./support":30,"./utils":32}],2:[function(e,t,n){"use strict";var r=e(`./external`),i=e(`./stream/DataWorker`),a=e(`./stream/Crc32Probe`),o=e(`./stream/DataLengthProbe`);function s(e,t,n,r,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=n,this.compression=r,this.compressedContent=i}s.prototype={getContentWorker:function(){var e=new i(r.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new o(`data_length`)),t=this;return e.on(`end`,function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw Error(`Bug : uncompressed data size mismatch`)}),e},getCompressedWorker:function(){return new i(r.Promise.resolve(this.compressedContent)).withStreamInfo(`compressedSize`,this.compressedSize).withStreamInfo(`uncompressedSize`,this.uncompressedSize).withStreamInfo(`crc32`,this.crc32).withStreamInfo(`compression`,this.compression)}},s.createWorkerFrom=function(e,t,n){return e.pipe(new a).pipe(new o(`uncompressedSize`)).pipe(t.compressWorker(n)).pipe(new o(`compressedSize`)).withStreamInfo(`compression`,t)},t.exports=s},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,n){"use strict";var r=e(`./stream/GenericWorker`);n.STORE={magic:`\0\0`,compressWorker:function(){return new r(`STORE compression`)},uncompressWorker:function(){return new r(`STORE decompression`)}},n.DEFLATE=e(`./flate`)},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,n){"use strict";var r=e(`./utils`),i=function(){for(var e,t=[],n=0;n<256;n++){e=n;for(var r=0;r<8;r++)e=1&e?3988292384^e>>>1:e>>>1;t[n]=e}return t}();t.exports=function(e,t){return e!==void 0&&e.length?r.getTypeOf(e)===`string`?function(e,t,n,r){var a=i,o=r+n;e^=-1;for(var s=r;s<o;s++)e=e>>>8^a[255&(e^t.charCodeAt(s))];return-1^e}(0|t,e,e.length,0):function(e,t,n,r){var a=i,o=r+n;e^=-1;for(var s=r;s<o;s++)e=e>>>8^a[255&(e^t[s])];return-1^e}(0|t,e,e.length,0):0}},{"./utils":32}],5:[function(e,t,n){"use strict";n.base64=!1,n.binary=!1,n.dir=!1,n.createFolders=!0,n.date=null,n.compression=null,n.compressionOptions=null,n.comment=null,n.unixPermissions=null,n.dosPermissions=null},{}],6:[function(e,t,n){"use strict";var r=null;r=typeof Promise<`u`?Promise:e(`lie`),t.exports={Promise:r}},{lie:37}],7:[function(e,t,n){"use strict";var r=typeof Uint8Array<`u`&&typeof Uint16Array<`u`&&typeof Uint32Array<`u`,i=e(`pako`),a=e(`./utils`),o=e(`./stream/GenericWorker`),s=r?`uint8array`:`array`;function c(e,t){o.call(this,`FlateWorker/`+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={}}n.magic=`\b\0`,a.inherits(c,o),c.prototype.processChunk=function(e){this.meta=e.meta,this._pako===null&&this._createPako(),this._pako.push(a.transformTo(s,e.data),!1)},c.prototype.flush=function(){o.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},c.prototype.cleanUp=function(){o.prototype.cleanUp.call(this),this._pako=null},c.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var e=this;this._pako.onData=function(t){e.push({data:t,meta:e.meta})}},n.compressWorker=function(e){return new c(`Deflate`,e)},n.uncompressWorker=function(){return new c(`Inflate`,{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,n){"use strict";function r(e,t){var n,r=``;for(n=0;n<t;n++)r+=String.fromCharCode(255&e),e>>>=8;return r}function i(e,t,n,i,o,u){var d,f,p=e.file,m=e.compression,h=u!==s.utf8encode,g=a.transformTo(`string`,u(p.name)),_=a.transformTo(`string`,s.utf8encode(p.name)),v=p.comment,y=a.transformTo(`string`,u(v)),b=a.transformTo(`string`,s.utf8encode(v)),x=_.length!==p.name.length,S=b.length!==v.length,C=``,w=``,T=``,E=p.dir,D=p.date,O={crc32:0,compressedSize:0,uncompressedSize:0};t&&!n||(O.crc32=e.crc32,O.compressedSize=e.compressedSize,O.uncompressedSize=e.uncompressedSize);var k=0;t&&(k|=8),h||!x&&!S||(k|=2048);var A=0,j=0;E&&(A|=16),o===`UNIX`?(j=798,A|=function(e,t){var n=e;return e||(n=t?16893:33204),(65535&n)<<16}(p.unixPermissions,E)):(j=20,A|=function(e){return 63&(e||0)}(p.dosPermissions)),d=D.getUTCHours(),d<<=6,d|=D.getUTCMinutes(),d<<=5,d|=D.getUTCSeconds()/2,f=D.getUTCFullYear()-1980,f<<=4,f|=D.getUTCMonth()+1,f<<=5,f|=D.getUTCDate(),x&&(w=r(1,1)+r(c(g),4)+_,C+=`up`+r(w.length,2)+w),S&&(T=r(1,1)+r(c(y),4)+b,C+=`uc`+r(T.length,2)+T);var M=``;return M+=`
\0`,M+=r(k,2),M+=m.magic,M+=r(d,2),M+=r(f,2),M+=r(O.crc32,4),M+=r(O.compressedSize,4),M+=r(O.uncompressedSize,4),M+=r(g.length,2),M+=r(C.length,2),{fileRecord:l.LOCAL_FILE_HEADER+M+g+C,dirRecord:l.CENTRAL_FILE_HEADER+r(j,2)+M+r(y.length,2)+`\0\0\0\0`+r(A,4)+r(i,4)+g+C+y}}var a=e(`../utils`),o=e(`../stream/GenericWorker`),s=e(`../utf8`),c=e(`../crc32`),l=e(`../signature`);function u(e,t,n,r){o.call(this,`ZipFileWorker`),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=n,this.encodeFileName=r,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}a.inherits(u,o),u.prototype.push=function(e){var t=e.meta.percent||0,n=this.entriesCount,r=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,o.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:n?(t+100*(n-r-1))/n:100}}))},u.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var n=i(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:n.fileRecord,meta:{percent:0}})}else this.accumulate=!0},u.prototype.closedSource=function(e){this.accumulate=!1;var t=this.streamFiles&&!e.file.dir,n=i(e,t,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(n.dirRecord),t)this.push({data:function(e){return l.DATA_DESCRIPTOR+r(e.crc32,4)+r(e.compressedSize,4)+r(e.uncompressedSize,4)}(e),meta:{percent:100}});else for(this.push({data:n.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},u.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var n=this.bytesWritten-e,i=function(e,t,n,i,o){var s=a.transformTo(`string`,o(i));return l.CENTRAL_DIRECTORY_END+`\0\0\0\0`+r(e,2)+r(e,2)+r(t,4)+r(n,4)+r(s.length,2)+s}(this.dirRecords.length,n,e,this.zipComment,this.encodeFileName);this.push({data:i,meta:{percent:100}})},u.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},u.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on(`data`,function(e){t.processChunk(e)}),e.on(`end`,function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end()}),e.on(`error`,function(e){t.error(e)}),this},u.prototype.resume=function(){return!!o.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},u.prototype.error=function(e){var t=this._sources;if(!o.prototype.error.call(this,e))return!1;for(var n=0;n<t.length;n++)try{t[n].error(e)}catch{}return!0},u.prototype.lock=function(){o.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock()},t.exports=u},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,n){"use strict";var r=e(`../compressions`),i=e(`./ZipFileWorker`);n.generateWorker=function(e,t,n){var a=new i(t.streamFiles,n,t.platform,t.encodeFileName),o=0;try{e.forEach(function(e,n){o++;var i=function(e,t){var n=e||t,i=r[n];if(!i)throw Error(n+` is not a valid compression method !`);return i}(n.options.compression,t.compression),s=n.options.compressionOptions||t.compressionOptions||{},c=n.dir,l=n.date;n._compressWorker(i,s).withStreamInfo(`file`,{name:e,dir:c,date:l,comment:n.comment||``,unixPermissions:n.unixPermissions,dosPermissions:n.dosPermissions}).pipe(a)}),a.entriesCount=o}catch(e){a.error(e)}return a}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,n){"use strict";function r(){if(!(this instanceof r))return new r;if(arguments.length)throw Error(`The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.`);this.files=Object.create(null),this.comment=null,this.root=``,this.clone=function(){var e=new r;for(var t in this)typeof this[t]!=`function`&&(e[t]=this[t]);return e}}(r.prototype=e(`./object`)).loadAsync=e(`./load`),r.support=e(`./support`),r.defaults=e(`./defaults`),r.version=`3.10.1`,r.loadAsync=function(e,t){return new r().loadAsync(e,t)},r.external=e(`./external`),t.exports=r},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,n){"use strict";var r=e(`./utils`),i=e(`./external`),a=e(`./utf8`),o=e(`./zipEntries`),s=e(`./stream/Crc32Probe`),c=e(`./nodejsUtils`);function l(e){return new i.Promise(function(t,n){var r=e.decompressed.getContentWorker().pipe(new s);r.on(`error`,function(e){n(e)}).on(`end`,function(){r.streamInfo.crc32===e.decompressed.crc32?t():n(Error(`Corrupted zip : CRC32 mismatch`))}).resume()})}t.exports=function(e,t){var n=this;return t=r.extend(t||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:a.utf8decode}),c.isNode&&c.isStream(e)?i.Promise.reject(Error(`JSZip can't accept a stream when loading a zip file.`)):r.prepareContent(`the loaded zip file`,e,!0,t.optimizedBinaryString,t.base64).then(function(e){var n=new o(t);return n.load(e),n}).then(function(e){var n=[i.Promise.resolve(e)],r=e.files;if(t.checkCRC32)for(var a=0;a<r.length;a++)n.push(l(r[a]));return i.Promise.all(n)}).then(function(e){for(var i=e.shift(),a=i.files,o=0;o<a.length;o++){var s=a[o],c=s.fileNameStr,l=r.resolve(s.fileNameStr);n.file(l,s.decompressed,{binary:!0,optimizedBinaryString:!0,date:s.date,dir:s.dir,comment:s.fileCommentStr.length?s.fileCommentStr:null,unixPermissions:s.unixPermissions,dosPermissions:s.dosPermissions,createFolders:t.createFolders}),s.dir||(n.file(l).unsafeOriginalName=c)}return i.zipComment.length&&(n.comment=i.zipComment),n})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,n){"use strict";var r=e(`../utils`),i=e(`../stream/GenericWorker`);function a(e,t){i.call(this,`Nodejs stream input adapter for `+e),this._upstreamEnded=!1,this._bindStream(t)}r.inherits(a,i),a.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on(`data`,function(e){t.push({data:e,meta:{percent:0}})}).on(`error`,function(e){t.isPaused?this.generatedError=e:t.error(e)}).on(`end`,function(){t.isPaused?t._upstreamEnded=!0:t.end()})},a.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},a.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=a},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,n){"use strict";var r=e(`readable-stream`).Readable;function i(e,t,n){r.call(this,t),this._helper=e;var i=this;e.on(`data`,function(e,t){i.push(e)||i._helper.pause(),n&&n(t)}).on(`error`,function(e){i.emit(`error`,e)}).on(`end`,function(){i.push(null)})}e(`../utils`).inherits(i,r),i.prototype._read=function(){this._helper.resume()},t.exports=i},{"../utils":32,"readable-stream":16}],14:[function(e,t,n){"use strict";t.exports={isNode:typeof Buffer<`u`,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if(typeof e==`number`)throw Error(`The "data" argument must not be a number`);return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&typeof e.on==`function`&&typeof e.pause==`function`&&typeof e.resume==`function`}}},{}],15:[function(e,t,n){"use strict";function r(e,t,n){var r,i=a.getTypeOf(t),s=a.extend(n||{},c);s.date=s.date||new Date,s.compression!==null&&(s.compression=s.compression.toUpperCase()),typeof s.unixPermissions==`string`&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=h(e)),s.createFolders&&(r=m(e))&&g.call(this,r,!0);var d=i===`string`&&!1===s.binary&&!1===s.base64;n&&n.binary!==void 0||(s.binary=!d),(t instanceof l&&t.uncompressedSize===0||s.dir||!t||t.length===0)&&(s.base64=!1,s.binary=!0,t=``,s.compression=`STORE`,i=`string`);var _=null;_=t instanceof l||t instanceof o?t:f.isNode&&f.isStream(t)?new p(e,t):a.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var v=new u(e,_,s);this.files[e]=v}var i=e(`./utf8`),a=e(`./utils`),o=e(`./stream/GenericWorker`),s=e(`./stream/StreamHelper`),c=e(`./defaults`),l=e(`./compressedObject`),u=e(`./zipObject`),d=e(`./generate`),f=e(`./nodejsUtils`),p=e(`./nodejs/NodejsStreamInputAdapter`),m=function(e){e.slice(-1)===`/`&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf(`/`);return 0<t?e.substring(0,t):``},h=function(e){return e.slice(-1)!==`/`&&(e+=`/`),e},g=function(e,t){return t=t===void 0?c.createFolders:t,e=h(e),this.files[e]||r.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function _(e){return Object.prototype.toString.call(e)===`[object RegExp]`}t.exports={load:function(){throw Error(`This method has been removed in JSZip 3.0, please check the upgrade guide.`)},forEach:function(e){var t,n,r;for(t in this.files)r=this.files[t],(n=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(n,r)},filter:function(e){var t=[];return this.forEach(function(n,r){e(n,r)&&t.push(r)}),t},file:function(e,t,n){if(arguments.length!==1)return e=this.root+e,r.call(this,e,t,n),this;if(_(e)){var i=e;return this.filter(function(e,t){return!t.dir&&i.test(e)})}var a=this.files[this.root+e];return a&&!a.dir?a:null},folder:function(e){if(!e)return this;if(_(e))return this.filter(function(t,n){return n.dir&&e.test(t)});var t=this.root+e,n=g.call(this,t),r=this.clone();return r.root=n.name,r},remove:function(e){e=this.root+e;var t=this.files[e];if(t||=(e.slice(-1)!==`/`&&(e+=`/`),this.files[e]),t&&!t.dir)delete this.files[e];else for(var n=this.filter(function(t,n){return n.name.slice(0,e.length)===e}),r=0;r<n.length;r++)delete this.files[n[r].name];return this},generate:function(){throw Error(`This method has been removed in JSZip 3.0, please check the upgrade guide.`)},generateInternalStream:function(e){var t,n={};try{if((n=a.extend(e||{},{streamFiles:!1,compression:`STORE`,compressionOptions:null,type:``,platform:`DOS`,comment:null,mimeType:`application/zip`,encodeFileName:i.utf8encode})).type=n.type.toLowerCase(),n.compression=n.compression.toUpperCase(),n.type===`binarystring`&&(n.type=`string`),!n.type)throw Error(`No output type specified.`);a.checkSupport(n.type),n.platform!==`darwin`&&n.platform!==`freebsd`&&n.platform!==`linux`&&n.platform!==`sunos`||(n.platform=`UNIX`),n.platform===`win32`&&(n.platform=`DOS`);var r=n.comment||this.comment||``;t=d.generateWorker(this,n,r)}catch(e){(t=new o(`error`)).error(e)}return new s(t,n.type||`string`,n.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return(e||={}).type||(e.type=`nodebuffer`),this.generateInternalStream(e).toNodejsStream(t)}}},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,n){"use strict";t.exports=e(`stream`)},{stream:void 0}],17:[function(e,t,n){"use strict";var r=e(`./DataReader`);function i(e){r.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t]}e(`../utils`).inherits(i,r),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),n=e.charCodeAt(1),r=e.charCodeAt(2),i=e.charCodeAt(3),a=this.length-4;0<=a;--a)if(this.data[a]===t&&this.data[a+1]===n&&this.data[a+2]===r&&this.data[a+3]===i)return a-this.zero;return-1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),n=e.charCodeAt(1),r=e.charCodeAt(2),i=e.charCodeAt(3),a=this.readData(4);return t===a[0]&&n===a[1]&&r===a[2]&&i===a[3]},i.prototype.readData=function(e){if(this.checkOffset(e),e===0)return[];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],18:[function(e,t,n){"use strict";var r=e(`../utils`);function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e)},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw Error(`End of data reached (data length = `+this.length+`, asked index = `+e+`). Corrupted zip ?`)},setIndex:function(e){this.checkIndex(e),this.index=e},skip:function(e){this.setIndex(this.index+e)},byteAt:function(){},readInt:function(e){var t,n=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)n=(n<<8)+this.byteAt(t);return this.index+=e,n},readString:function(e){return r.transformTo(`string`,this.readData(e))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i},{"../utils":32}],19:[function(e,t,n){"use strict";var r=e(`./Uint8ArrayReader`);function i(e){r.call(this,e)}e(`../utils`).inherits(i,r),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,n){"use strict";var r=e(`./DataReader`);function i(e){r.call(this,e)}e(`../utils`).inherits(i,r),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],21:[function(e,t,n){"use strict";var r=e(`./ArrayReader`);function i(e){r.call(this,e)}e(`../utils`).inherits(i,r),i.prototype.readData=function(e){if(this.checkOffset(e),e===0)return new Uint8Array;var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,n){"use strict";var r=e(`../utils`),i=e(`../support`),a=e(`./ArrayReader`),o=e(`./StringReader`),s=e(`./NodeBufferReader`),c=e(`./Uint8ArrayReader`);t.exports=function(e){var t=r.getTypeOf(e);return r.checkSupport(t),t!==`string`||i.uint8array?t===`nodebuffer`?new s(e):i.uint8array?new c(r.transformTo(`uint8array`,e)):new a(r.transformTo(`array`,e)):new o(e)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,n){"use strict";n.LOCAL_FILE_HEADER=`PK`,n.CENTRAL_FILE_HEADER=`PK`,n.CENTRAL_DIRECTORY_END=`PK`,n.ZIP64_CENTRAL_DIRECTORY_LOCATOR=`PK\x07`,n.ZIP64_CENTRAL_DIRECTORY_END=`PK`,n.DATA_DESCRIPTOR=`PK\x07\b`},{}],24:[function(e,t,n){"use strict";var r=e(`./GenericWorker`),i=e(`../utils`);function a(e){r.call(this,`ConvertWorker to `+e),this.destType=e}i.inherits(a,r),a.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta})},t.exports=a},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,n){"use strict";var r=e(`./GenericWorker`),i=e(`../crc32`);function a(){r.call(this,`Crc32Probe`),this.withStreamInfo(`crc32`,0)}e(`../utils`).inherits(a,r),a.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e)},t.exports=a},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,n){"use strict";var r=e(`../utils`),i=e(`./GenericWorker`);function a(e){i.call(this,`DataLengthProbe for `+e),this.propName=e,this.withStreamInfo(e,0)}r.inherits(a,i),a.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length}i.prototype.processChunk.call(this,e)},t.exports=a},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,n){"use strict";var r=e(`../utils`),i=e(`./GenericWorker`);function a(e){i.call(this,`DataWorker`);var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type=``,this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=r.getTypeOf(e),t.isPaused||t._tickAndRepeat()},function(e){t.error(e)})}r.inherits(a,i),a.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},a.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,r.delay(this._tickAndRepeat,[],this)),!0)},a.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(r.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},a.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case`string`:e=this.data.substring(this.index,t);break;case`uint8array`:e=this.data.subarray(this.index,t);break;case`array`:case`nodebuffer`:e=this.data.slice(this.index,t)}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=a},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,n){"use strict";function r(e){this.name=e||`default`,this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}r.prototype={push:function(e){this.emit(`data`,e)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit(`end`),this.cleanUp(),this.isFinished=!0}catch(e){this.emit(`error`,e)}return!0},error:function(e){return!this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit(`error`,e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(e,t){if(this._listeners[e])for(var n=0;n<this._listeners[e].length;n++)this._listeners[e][n].call(this,t)},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw Error(`The stream '`+this+`' has already been used.`);this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on(`data`,function(e){t.processChunk(e)}),e.on(`end`,function(){t.end()}),e.on(`error`,function(e){t.error(e)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e)},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,e)&&(this.streamInfo[e]=this.extraStreamInfo[e])},lock:function(){if(this.isLocked)throw Error(`The stream '`+this+`' has already been used.`);this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var e=`Worker `+this.name;return this.previous?this.previous+` -> `+e:e}},t.exports=r},{}],29:[function(e,t,n){"use strict";var r=e(`../utils`),i=e(`./ConvertWorker`),a=e(`./GenericWorker`),o=e(`../base64`),s=e(`../support`),c=e(`../external`),l=null;if(s.nodestream)try{l=e(`../nodejs/NodejsStreamOutputAdapter`)}catch{}function u(e,t){return new c.Promise(function(n,i){var a=[],s=e._internalType,c=e._outputType,l=e._mimeType;e.on(`data`,function(e,n){a.push(e),t&&t(n)}).on(`error`,function(e){a=[],i(e)}).on(`end`,function(){try{n(function(e,t,n){switch(e){case`blob`:return r.newBlob(r.transformTo(`arraybuffer`,t),n);case`base64`:return o.encode(t);default:return r.transformTo(e,t)}}(c,function(e,t){var n,r=0,i=null,a=0;for(n=0;n<t.length;n++)a+=t[n].length;switch(e){case`string`:return t.join(``);case`array`:return Array.prototype.concat.apply([],t);case`uint8array`:for(i=new Uint8Array(a),n=0;n<t.length;n++)i.set(t[n],r),r+=t[n].length;return i;case`nodebuffer`:return Buffer.concat(t);default:throw Error(`concat : unsupported type '`+e+`'`)}}(s,a),l))}catch(e){i(e)}a=[]}).resume()})}function d(e,t,n){var o=t;switch(t){case`blob`:case`arraybuffer`:o=`uint8array`;break;case`base64`:o=`string`}try{this._internalType=o,this._outputType=t,this._mimeType=n,r.checkSupport(o),this._worker=e.pipe(new i(o)),e.lock()}catch(e){this._worker=new a(`error`),this._worker.error(e)}}d.prototype={accumulate:function(e){return u(this,e)},on:function(e,t){var n=this;return e===`data`?this._worker.on(e,function(e){t.call(n,e.data,e.meta)}):this._worker.on(e,function(){r.delay(t,arguments,n)}),this},resume:function(){return r.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(r.checkSupport(`nodestream`),this._outputType!==`nodebuffer`)throw Error(this._outputType+` is not supported by this method`);return new l(this,{objectMode:this._outputType!==`nodebuffer`},e)}},t.exports=d},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,n){"use strict";if(n.base64=!0,n.array=!0,n.string=!0,n.arraybuffer=typeof ArrayBuffer<`u`&&typeof Uint8Array<`u`,n.nodebuffer=typeof Buffer<`u`,n.uint8array=typeof Uint8Array<`u`,typeof ArrayBuffer>`u`)n.blob=!1;else{var r=new ArrayBuffer(0);try{n.blob=new Blob([r],{type:`application/zip`}).size===0}catch{try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(r),n.blob=i.getBlob(`application/zip`).size===0}catch{n.blob=!1}}}try{n.nodestream=!!e(`readable-stream`).Readable}catch{n.nodestream=!1}},{"readable-stream":16}],31:[function(e,t,n){"use strict";for(var r=e(`./utils`),i=e(`./support`),a=e(`./nodejsUtils`),o=e(`./stream/GenericWorker`),s=Array(256),c=0;c<256;c++)s[c]=252<=c?6:248<=c?5:240<=c?4:224<=c?3:192<=c?2:1;s[254]=s[254]=1;function l(){o.call(this,`utf-8 decode`),this.leftOver=null}function u(){o.call(this,`utf-8 encode`)}n.utf8encode=function(e){return i.nodebuffer?a.newBufferFrom(e,`utf-8`):function(e){var t,n,r,a,o,s=e.length,c=0;for(a=0;a<s;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(r=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(r-56320),a++),c+=n<128?1:n<2048?2:n<65536?3:4;for(t=i.uint8array?new Uint8Array(c):Array(c),a=o=0;o<c;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(r=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(r-56320),a++),n<128?t[o++]=n:(n<2048?t[o++]=192|n>>>6:(n<65536?t[o++]=224|n>>>12:(t[o++]=240|n>>>18,t[o++]=128|n>>>12&63),t[o++]=128|n>>>6&63),t[o++]=128|63&n);return t}(e)},n.utf8decode=function(e){return i.nodebuffer?r.transformTo(`nodebuffer`,e).toString(`utf-8`):function(e){var t,n,i,a,o=e.length,c=Array(2*o);for(t=n=0;t<o;)if((i=e[t++])<128)c[n++]=i;else if(4<(a=s[i]))c[n++]=65533,t+=a-1;else{for(i&=a===2?31:a===3?15:7;1<a&&t<o;)i=i<<6|63&e[t++],a--;1<a?c[n++]=65533:i<65536?c[n++]=i:(i-=65536,c[n++]=55296|i>>10&1023,c[n++]=56320|1023&i)}return c.length!==n&&(c.subarray?c=c.subarray(0,n):c.length=n),r.applyFromCharCode(c)}(e=r.transformTo(i.uint8array?`uint8array`:`array`,e))},r.inherits(l,o),l.prototype.processChunk=function(e){var t=r.transformTo(i.uint8array?`uint8array`:`array`,e.data);if(this.leftOver&&this.leftOver.length){if(i.uint8array){var a=t;(t=new Uint8Array(a.length+this.leftOver.length)).set(this.leftOver,0),t.set(a,this.leftOver.length)}else t=this.leftOver.concat(t);this.leftOver=null}var o=function(e,t){var n;for((t||=e.length)>e.length&&(t=e.length),n=t-1;0<=n&&(192&e[n])==128;)n--;return n<0||n===0?t:n+s[e[n]]>t?n:t}(t),c=t;o!==t.length&&(i.uint8array?(c=t.subarray(0,o),this.leftOver=t.subarray(o,t.length)):(c=t.slice(0,o),this.leftOver=t.slice(o,t.length))),this.push({data:n.utf8decode(c),meta:e.meta})},l.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:n.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},n.Utf8DecodeWorker=l,r.inherits(u,o),u.prototype.processChunk=function(e){this.push({data:n.utf8encode(e.data),meta:e.meta})},n.Utf8EncodeWorker=u},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,n){"use strict";var r=e(`./support`),i=e(`./base64`),a=e(`./nodejsUtils`),o=e(`./external`);function s(e){return e}function c(e,t){for(var n=0;n<e.length;++n)t[n]=255&e.charCodeAt(n);return t}e(`setimmediate`),n.newBlob=function(e,t){n.checkSupport(`blob`);try{return new Blob([e],{type:t})}catch{try{var r=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return r.append(e),r.getBlob(t)}catch{throw Error(`Bug : can't construct the Blob.`)}}};var l={stringifyByChunk:function(e,t,n){var r=[],i=0,a=e.length;if(a<=n)return String.fromCharCode.apply(null,e);for(;i<a;)t===`array`||t===`nodebuffer`?r.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+n,a)))):r.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+n,a)))),i+=n;return r.join(``)},stringifyByChar:function(e){for(var t=``,n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return t},applyCanBeUsed:{uint8array:function(){try{return r.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}}(),nodebuffer:function(){try{return r.nodebuffer&&String.fromCharCode.apply(null,a.allocBuffer(1)).length===1}catch{return!1}}()}};function u(e){var t=65536,r=n.getTypeOf(e),i=!0;if(r===`uint8array`?i=l.applyCanBeUsed.uint8array:r===`nodebuffer`&&(i=l.applyCanBeUsed.nodebuffer),i)for(;1<t;)try{return l.stringifyByChunk(e,r,t)}catch{t=Math.floor(t/2)}return l.stringifyByChar(e)}function d(e,t){for(var n=0;n<e.length;n++)t[n]=e[n];return t}n.applyFromCharCode=u;var f={};f.string={string:s,array:function(e){return c(e,Array(e.length))},arraybuffer:function(e){return f.string.uint8array(e).buffer},uint8array:function(e){return c(e,new Uint8Array(e.length))},nodebuffer:function(e){return c(e,a.allocBuffer(e.length))}},f.array={string:u,array:s,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return a.newBufferFrom(e)}},f.arraybuffer={string:function(e){return u(new Uint8Array(e))},array:function(e){return d(new Uint8Array(e),Array(e.byteLength))},arraybuffer:s,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return a.newBufferFrom(new Uint8Array(e))}},f.uint8array={string:u,array:function(e){return d(e,Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:s,nodebuffer:function(e){return a.newBufferFrom(e)}},f.nodebuffer={string:u,array:function(e){return d(e,Array(e.length))},arraybuffer:function(e){return f.nodebuffer.uint8array(e).buffer},uint8array:function(e){return d(e,new Uint8Array(e.length))},nodebuffer:s},n.transformTo=function(e,t){return t||=``,e?(n.checkSupport(e),f[n.getTypeOf(t)][e](t)):t},n.resolve=function(e){for(var t=e.split(`/`),n=[],r=0;r<t.length;r++){var i=t[r];i===`.`||i===``&&r!==0&&r!==t.length-1||(i===`..`?n.pop():n.push(i))}return n.join(`/`)},n.getTypeOf=function(e){return typeof e==`string`?`string`:Object.prototype.toString.call(e)===`[object Array]`?`array`:r.nodebuffer&&a.isBuffer(e)?`nodebuffer`:r.uint8array&&e instanceof Uint8Array?`uint8array`:r.arraybuffer&&e instanceof ArrayBuffer?`arraybuffer`:void 0},n.checkSupport=function(e){if(!r[e.toLowerCase()])throw Error(e+` is not supported by this platform`)},n.MAX_VALUE_16BITS=65535,n.MAX_VALUE_32BITS=-1,n.pretty=function(e){var t,n,r=``;for(n=0;n<(e||``).length;n++)r+=`\\x`+((t=e.charCodeAt(n))<16?`0`:``)+t.toString(16).toUpperCase();return r},n.delay=function(e,t,n){setImmediate(function(){e.apply(n||null,t||[])})},n.inherits=function(e,t){function n(){}n.prototype=t.prototype,e.prototype=new n},n.extend=function(){var e,t,n={};for(e=0;e<arguments.length;e++)for(t in arguments[e])Object.prototype.hasOwnProperty.call(arguments[e],t)&&n[t]===void 0&&(n[t]=arguments[e][t]);return n},n.prepareContent=function(e,t,a,s,l){return o.Promise.resolve(t).then(function(e){return r.blob&&(e instanceof Blob||[`[object File]`,`[object Blob]`].indexOf(Object.prototype.toString.call(e))!==-1)&&typeof FileReader<`u`?new o.Promise(function(t,n){var r=new FileReader;r.onload=function(e){t(e.target.result)},r.onerror=function(e){n(e.target.error)},r.readAsArrayBuffer(e)}):e}).then(function(t){var u=n.getTypeOf(t);return u?(u===`arraybuffer`?t=n.transformTo(`uint8array`,t):u===`string`&&(l?t=i.decode(t):a&&!0!==s&&(t=function(e){return c(e,r.uint8array?new Uint8Array(e.length):Array(e.length))}(t))),t):o.Promise.reject(Error(`Can't read the data of '`+e+`'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?`))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,t,n){"use strict";var r=e(`./reader/readerFor`),i=e(`./utils`),a=e(`./signature`),o=e(`./zipEntry`),s=e(`./support`);function c(e){this.files=[],this.loadOptions=e}c.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw Error(`Corrupted zip or bug: unexpected signature (`+i.pretty(t)+`, expected `+i.pretty(e)+`)`)}},isSignature:function(e,t){var n=this.reader.index;this.reader.setIndex(e);var r=this.reader.readString(4)===t;return this.reader.setIndex(n),r},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=s.uint8array?`uint8array`:`array`,n=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(n)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,n,r=this.zip64EndOfCentralSize-44;0<r;)e=this.reader.readInt(2),t=this.reader.readInt(4),n=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:n}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw Error(`Multi-volumes zip are not supported`)},readLocalFiles:function(){var e,t;for(e=0;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(a.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes()},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER);)(e=new o({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw Error(`Corrupted zip or bug: expected `+this.centralDirRecords+` records in central dir, got `+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);if(e<0)throw this.isSignature(0,a.LOCAL_FILE_HEADER)?Error(`Corrupted zip: can't find end of central directory`):Error(`Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html`);this.reader.setIndex(e);var t=e;if(this.checkSignature(a.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw Error(`Corrupted zip: can't find the ZIP64 end of central directory locator`);if(this.reader.setIndex(e),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,a.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw Error(`Corrupted zip: can't find the ZIP64 end of central directory`);this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var n=this.centralDirOffset+this.centralDirSize;this.zip64&&(n+=20,n+=12+this.zip64EndOfCentralSize);var r=t-n;if(0<r)this.isSignature(t,a.CENTRAL_FILE_HEADER)||(this.reader.zero=r);else if(r<0)throw Error(`Corrupted zip: missing `+Math.abs(r)+` bytes.`)},prepareReader:function(e){this.reader=r(e)},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},t.exports=c},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,t,n){"use strict";var r=e(`./reader/readerFor`),i=e(`./utils`),a=e(`./compressedObject`),o=e(`./crc32`),s=e(`./utf8`),c=e(`./compressions`),l=e(`./support`);function u(e,t){this.options=e,this.loadOptions=t}u.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(e){var t,n;if(e.skip(22),this.fileNameLength=e.readInt(2),n=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(n),this.compressedSize===-1||this.uncompressedSize===-1)throw Error(`Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)`);if((t=function(e){for(var t in c)if(Object.prototype.hasOwnProperty.call(c,t)&&c[t].magic===e)return c[t];return null}(this.compressionMethod))===null)throw Error(`Corrupted zip : compression `+i.pretty(this.compressionMethod)+` unknown (inner file : `+i.transformTo(`string`,this.fileName)+`)`);this.decompressed=new a(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize))},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw Error(`Encrypted zip are not supported`);e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),e==0&&(this.dosPermissions=63&this.externalFileAttributes),e==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!==`/`||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var e=r(this.extraFields[1].value);this.uncompressedSize===i.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===i.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===i.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===i.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4))}},readExtraFields:function(e){var t,n,r,i=e.index+this.extraFieldsLength;for(this.extraFields||={};e.index+4<i;)t=e.readInt(2),n=e.readInt(2),r=e.readData(n),this.extraFields[t]={id:t,length:n,value:r};e.setIndex(i)},handleUTF8:function(){var e=l.uint8array?`uint8array`:`array`;if(this.useUTF8())this.fileNameStr=s.utf8decode(this.fileName),this.fileCommentStr=s.utf8decode(this.fileComment);else{var t=this.findExtraFieldUnicodePath();if(t!==null)this.fileNameStr=t;else{var n=i.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(n)}var r=this.findExtraFieldUnicodeComment();if(r!==null)this.fileCommentStr=r;else{var a=i.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(a)}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=r(e.value);return t.readInt(1)===1&&o(this.fileName)===t.readInt(4)?s.utf8decode(t.readData(e.length-5)):null}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=r(e.value);return t.readInt(1)===1&&o(this.fileComment)===t.readInt(4)?s.utf8decode(t.readData(e.length-5)):null}return null}},t.exports=u},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,n){"use strict";function r(e,t,n){this.name=e,this.dir=n.dir,this.date=n.date,this.comment=n.comment,this.unixPermissions=n.unixPermissions,this.dosPermissions=n.dosPermissions,this._data=t,this._dataBinary=n.binary,this.options={compression:n.compression,compressionOptions:n.compressionOptions}}var i=e(`./stream/StreamHelper`),a=e(`./stream/DataWorker`),o=e(`./utf8`),s=e(`./compressedObject`),c=e(`./stream/GenericWorker`);r.prototype={internalStream:function(e){var t=null,n=`string`;try{if(!e)throw Error(`No output type specified.`);var r=(n=e.toLowerCase())===`string`||n===`text`;n!==`binarystring`&&n!==`text`||(n=`string`),t=this._decompressWorker();var a=!this._dataBinary;a&&!r&&(t=t.pipe(new o.Utf8EncodeWorker)),!a&&r&&(t=t.pipe(new o.Utf8DecodeWorker))}catch(e){(t=new c(`error`)).error(e)}return new i(t,n,``)},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||`nodebuffer`).toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof s&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var n=this._decompressWorker();return this._dataBinary||(n=n.pipe(new o.Utf8EncodeWorker)),s.createWorkerFrom(n,e,t)},_decompressWorker:function(){return this._data instanceof s?this._data.getContentWorker():this._data instanceof c?this._data:new a(this._data)}};for(var l=[`asText`,`asBinary`,`asNodeBuffer`,`asUint8Array`,`asArrayBuffer`],u=function(){throw Error(`This method has been removed in JSZip 3.0, please check the upgrade guide.`)},d=0;d<l.length;d++)r.prototype[l[d]]=u;t.exports=r},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,t,n){(function(e){"use strict";var n,r,i=e.MutationObserver||e.WebKitMutationObserver;if(i){var a=0,o=new i(u),s=e.document.createTextNode(``);o.observe(s,{characterData:!0}),n=function(){s.data=a=++a%2}}else if(e.setImmediate||e.MessageChannel===void 0)n=`document`in e&&`onreadystatechange`in e.document.createElement(`script`)?function(){var t=e.document.createElement(`script`);t.onreadystatechange=function(){u(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(u,0)};else{var c=new e.MessageChannel;c.port1.onmessage=u,n=function(){c.port2.postMessage(0)}}var l=[];function u(){var e,t;r=!0;for(var n=l.length;n;){for(t=l,l=[],e=-1;++e<n;)t[e]();n=l.length}r=!1}t.exports=function(e){l.push(e)!==1||r||n()}}).call(this,typeof global<`u`?global:typeof self<`u`?self:typeof window<`u`?window:{})},{}],37:[function(e,t,n){"use strict";var r=e(`immediate`);function i(){}var a={},o=[`REJECTED`],s=[`FULFILLED`],c=[`PENDING`];function l(e){if(typeof e!=`function`)throw TypeError(`resolver must be a function`);this.state=c,this.queue=[],this.outcome=void 0,e!==i&&p(this,e)}function u(e,t,n){this.promise=e,typeof t==`function`&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),typeof n==`function`&&(this.onRejected=n,this.callRejected=this.otherCallRejected)}function d(e,t,n){r(function(){var r;try{r=t(n)}catch(t){return a.reject(e,t)}r===e?a.reject(e,TypeError(`Cannot resolve promise with itself`)):a.resolve(e,r)})}function f(e){var t=e&&e.then;if(e&&(typeof e==`object`||typeof e==`function`)&&typeof t==`function`)return function(){t.apply(e,arguments)}}function p(e,t){var n=!1;function r(t){n||(n=!0,a.reject(e,t))}function i(t){n||(n=!0,a.resolve(e,t))}var o=m(function(){t(i,r)});o.status===`error`&&r(o.value)}function m(e,t){var n={};try{n.value=e(t),n.status=`success`}catch(e){n.status=`error`,n.value=e}return n}(t.exports=l).prototype.finally=function(e){if(typeof e!=`function`)return this;var t=this.constructor;return this.then(function(n){return t.resolve(e()).then(function(){return n})},function(n){return t.resolve(e()).then(function(){throw n})})},l.prototype.catch=function(e){return this.then(null,e)},l.prototype.then=function(e,t){if(typeof e!=`function`&&this.state===s||typeof t!=`function`&&this.state===o)return this;var n=new this.constructor(i);return this.state===c?this.queue.push(new u(n,e,t)):d(n,this.state===s?e:t,this.outcome),n},u.prototype.callFulfilled=function(e){a.resolve(this.promise,e)},u.prototype.otherCallFulfilled=function(e){d(this.promise,this.onFulfilled,e)},u.prototype.callRejected=function(e){a.reject(this.promise,e)},u.prototype.otherCallRejected=function(e){d(this.promise,this.onRejected,e)},a.resolve=function(e,t){var n=m(f,t);if(n.status===`error`)return a.reject(e,n.value);var r=n.value;if(r)p(e,r);else{e.state=s,e.outcome=t;for(var i=-1,o=e.queue.length;++i<o;)e.queue[i].callFulfilled(t)}return e},a.reject=function(e,t){e.state=o,e.outcome=t;for(var n=-1,r=e.queue.length;++n<r;)e.queue[n].callRejected(t);return e},l.resolve=function(e){return e instanceof this?e:a.resolve(new this(i),e)},l.reject=function(e){var t=new this(i);return a.reject(t,e)},l.all=function(e){var t=this;if(Object.prototype.toString.call(e)!==`[object Array]`)return this.reject(TypeError(`must be an array`));var n=e.length,r=!1;if(!n)return this.resolve([]);for(var o=Array(n),s=0,c=-1,l=new this(i);++c<n;)u(e[c],c);return l;function u(e,i){t.resolve(e).then(function(e){o[i]=e,++s!==n||r||(r=!0,a.resolve(l,o))},function(e){r||(r=!0,a.reject(l,e))})}},l.race=function(e){var t=this;if(Object.prototype.toString.call(e)!==`[object Array]`)return this.reject(TypeError(`must be an array`));var n=e.length,r=!1;if(!n)return this.resolve([]);for(var o=-1,s=new this(i);++o<n;)c=e[o],t.resolve(c).then(function(e){r||(r=!0,a.resolve(s,e))},function(e){r||(r=!0,a.reject(s,e))});var c;return s}},{immediate:36}],38:[function(e,t,n){"use strict";var r={};(0,e(`./lib/utils/common`).assign)(r,e(`./lib/deflate`),e(`./lib/inflate`),e(`./lib/zlib/constants`)),t.exports=r},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,n){"use strict";var r=e(`./zlib/deflate`),i=e(`./utils/common`),a=e(`./utils/strings`),o=e(`./zlib/messages`),s=e(`./zlib/zstream`),c=Object.prototype.toString,l=0,u=-1,d=0,f=8;function p(e){if(!(this instanceof p))return new p(e);this.options=i.assign({level:u,method:f,chunkSize:16384,windowBits:15,memLevel:8,strategy:d,to:``},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg=``,this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var n=r.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(n!==l)throw Error(o[n]);if(t.header&&r.deflateSetHeader(this.strm,t.header),t.dictionary){var m;if(m=typeof t.dictionary==`string`?a.string2buf(t.dictionary):c.call(t.dictionary)===`[object ArrayBuffer]`?new Uint8Array(t.dictionary):t.dictionary,(n=r.deflateSetDictionary(this.strm,m))!==l)throw Error(o[n]);this._dict_set=!0}}function m(e,t){var n=new p(t);if(n.push(e,!0),n.err)throw n.msg||o[n.err];return n.result}p.prototype.push=function(e,t){var n,o,s=this.strm,u=this.options.chunkSize;if(this.ended)return!1;o=t===~~t?t:!0===t?4:0,s.input=typeof e==`string`?a.string2buf(e):c.call(e)===`[object ArrayBuffer]`?new Uint8Array(e):e,s.next_in=0,s.avail_in=s.input.length;do{if(s.avail_out===0&&(s.output=new i.Buf8(u),s.next_out=0,s.avail_out=u),(n=r.deflate(s,o))!==1&&n!==l)return this.onEnd(n),!(this.ended=!0);s.avail_out!==0&&(s.avail_in!==0||o!==4&&o!==2)||(this.options.to===`string`?this.onData(a.buf2binstring(i.shrinkBuf(s.output,s.next_out))):this.onData(i.shrinkBuf(s.output,s.next_out)))}while((0<s.avail_in||s.avail_out===0)&&n!==1);return o===4?(n=r.deflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===l):o!==2||(this.onEnd(l),!(s.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e)},p.prototype.onEnd=function(e){e===l&&(this.result=this.options.to===`string`?this.chunks.join(``):i.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},n.Deflate=p,n.deflate=m,n.deflateRaw=function(e,t){return(t||={}).raw=!0,m(e,t)},n.gzip=function(e,t){return(t||={}).gzip=!0,m(e,t)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,n){"use strict";var r=e(`./zlib/inflate`),i=e(`./utils/common`),a=e(`./utils/strings`),o=e(`./zlib/constants`),s=e(`./zlib/messages`),c=e(`./zlib/zstream`),l=e(`./zlib/gzheader`),u=Object.prototype.toString;function d(e){if(!(this instanceof d))return new d(e);this.options=i.assign({chunkSize:16384,windowBits:0,to:``},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,t.windowBits===0&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&!(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg=``,this.ended=!1,this.chunks=[],this.strm=new c,this.strm.avail_out=0;var n=r.inflateInit2(this.strm,t.windowBits);if(n!==o.Z_OK)throw Error(s[n]);this.header=new l,r.inflateGetHeader(this.strm,this.header)}function f(e,t){var n=new d(t);if(n.push(e,!0),n.err)throw n.msg||s[n.err];return n.result}d.prototype.push=function(e,t){var n,s,c,l,d,f,p=this.strm,m=this.options.chunkSize,h=this.options.dictionary,g=!1;if(this.ended)return!1;s=t===~~t?t:!0===t?o.Z_FINISH:o.Z_NO_FLUSH,p.input=typeof e==`string`?a.binstring2buf(e):u.call(e)===`[object ArrayBuffer]`?new Uint8Array(e):e,p.next_in=0,p.avail_in=p.input.length;do{if(p.avail_out===0&&(p.output=new i.Buf8(m),p.next_out=0,p.avail_out=m),(n=r.inflate(p,o.Z_NO_FLUSH))===o.Z_NEED_DICT&&h&&(f=typeof h==`string`?a.string2buf(h):u.call(h)===`[object ArrayBuffer]`?new Uint8Array(h):h,n=r.inflateSetDictionary(this.strm,f)),n===o.Z_BUF_ERROR&&!0===g&&(n=o.Z_OK,g=!1),n!==o.Z_STREAM_END&&n!==o.Z_OK)return this.onEnd(n),!(this.ended=!0);p.next_out&&(p.avail_out!==0&&n!==o.Z_STREAM_END&&(p.avail_in!==0||s!==o.Z_FINISH&&s!==o.Z_SYNC_FLUSH)||(this.options.to===`string`?(c=a.utf8border(p.output,p.next_out),l=p.next_out-c,d=a.buf2string(p.output,c),p.next_out=l,p.avail_out=m-l,l&&i.arraySet(p.output,p.output,c,l,0),this.onData(d)):this.onData(i.shrinkBuf(p.output,p.next_out)))),p.avail_in===0&&p.avail_out===0&&(g=!0)}while((0<p.avail_in||p.avail_out===0)&&n!==o.Z_STREAM_END);return n===o.Z_STREAM_END&&(s=o.Z_FINISH),s===o.Z_FINISH?(n=r.inflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===o.Z_OK):s!==o.Z_SYNC_FLUSH||(this.onEnd(o.Z_OK),!(p.avail_out=0))},d.prototype.onData=function(e){this.chunks.push(e)},d.prototype.onEnd=function(e){e===o.Z_OK&&(this.result=this.options.to===`string`?this.chunks.join(``):i.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},n.Inflate=d,n.inflate=f,n.inflateRaw=function(e,t){return(t||={}).raw=!0,f(e,t)},n.ungzip=f},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,n){"use strict";var r=typeof Uint8Array<`u`&&typeof Uint16Array<`u`&&typeof Int32Array<`u`;n.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var n=t.shift();if(n){if(typeof n!=`object`)throw TypeError(n+`must be non-object`);for(var r in n)n.hasOwnProperty(r)&&(e[r]=n[r])}}return e},n.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,n,r,i){if(t.subarray&&e.subarray)e.set(t.subarray(n,n+r),i);else for(var a=0;a<r;a++)e[i+a]=t[n+a]},flattenChunks:function(e){var t,n,r,i,a,o;for(t=r=0,n=e.length;t<n;t++)r+=e[t].length;for(o=new Uint8Array(r),t=i=0,n=e.length;t<n;t++)a=e[t],o.set(a,i),i+=a.length;return o}},a={arraySet:function(e,t,n,r,i){for(var a=0;a<r;a++)e[i+a]=t[n+a]},flattenChunks:function(e){return[].concat.apply([],e)}};n.setTyped=function(e){e?(n.Buf8=Uint8Array,n.Buf16=Uint16Array,n.Buf32=Int32Array,n.assign(n,i)):(n.Buf8=Array,n.Buf16=Array,n.Buf32=Array,n.assign(n,a))},n.setTyped(r)},{}],42:[function(e,t,n){"use strict";var r=e(`./common`),i=!0,a=!0;try{String.fromCharCode.apply(null,[0])}catch{i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{a=!1}for(var o=new r.Buf8(256),s=0;s<256;s++)o[s]=252<=s?6:248<=s?5:240<=s?4:224<=s?3:192<=s?2:1;function c(e,t){if(t<65537&&(e.subarray&&a||!e.subarray&&i))return String.fromCharCode.apply(null,r.shrinkBuf(e,t));for(var n=``,o=0;o<t;o++)n+=String.fromCharCode(e[o]);return n}o[254]=o[254]=1,n.string2buf=function(e){var t,n,i,a,o,s=e.length,c=0;for(a=0;a<s;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(i=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(i-56320),a++),c+=n<128?1:n<2048?2:n<65536?3:4;for(t=new r.Buf8(c),a=o=0;o<c;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(i=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(i-56320),a++),n<128?t[o++]=n:(n<2048?t[o++]=192|n>>>6:(n<65536?t[o++]=224|n>>>12:(t[o++]=240|n>>>18,t[o++]=128|n>>>12&63),t[o++]=128|n>>>6&63),t[o++]=128|63&n);return t},n.buf2binstring=function(e){return c(e,e.length)},n.binstring2buf=function(e){for(var t=new r.Buf8(e.length),n=0,i=t.length;n<i;n++)t[n]=e.charCodeAt(n);return t},n.buf2string=function(e,t){var n,r,i,a,s=t||e.length,l=Array(2*s);for(n=r=0;n<s;)if((i=e[n++])<128)l[r++]=i;else if(4<(a=o[i]))l[r++]=65533,n+=a-1;else{for(i&=a===2?31:a===3?15:7;1<a&&n<s;)i=i<<6|63&e[n++],a--;1<a?l[r++]=65533:i<65536?l[r++]=i:(i-=65536,l[r++]=55296|i>>10&1023,l[r++]=56320|1023&i)}return c(l,r)},n.utf8border=function(e,t){var n;for((t||=e.length)>e.length&&(t=e.length),n=t-1;0<=n&&(192&e[n])==128;)n--;return n<0||n===0?t:n+o[e[n]]>t?n:t}},{"./common":41}],43:[function(e,t,n){"use strict";t.exports=function(e,t,n,r){for(var i=65535&e|0,a=e>>>16&65535|0,o=0;n!==0;){for(n-=o=2e3<n?2e3:n;a=a+(i=i+t[r++]|0)|0,--o;);i%=65521,a%=65521}return i|a<<16|0}},{}],44:[function(e,t,n){"use strict";t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,t,n){"use strict";var r=function(){for(var e,t=[],n=0;n<256;n++){e=n;for(var r=0;r<8;r++)e=1&e?3988292384^e>>>1:e>>>1;t[n]=e}return t}();t.exports=function(e,t,n,i){var a=r,o=i+n;e^=-1;for(var s=i;s<o;s++)e=e>>>8^a[255&(e^t[s])];return-1^e}},{}],46:[function(e,t,n){"use strict";var r,i=e(`../utils/common`),a=e(`./trees`),o=e(`./adler32`),s=e(`./crc32`),c=e(`./messages`),l=0,u=4,d=0,f=-2,p=-1,m=4,h=2,g=8,_=9,v=286,y=30,b=19,x=2*v+1,S=15,C=3,w=258,T=w+C+1,E=42,D=113,O=1,k=2,A=3,j=4;function M(e,t){return e.msg=c[t],t}function N(e){return(e<<1)-(4<e?9:0)}function P(e){for(var t=e.length;0<=--t;)e[t]=0}function F(e){var t=e.state,n=t.pending;n>e.avail_out&&(n=e.avail_out),n!==0&&(i.arraySet(e.output,t.pending_buf,t.pending_out,n,e.next_out),e.next_out+=n,t.pending_out+=n,e.total_out+=n,e.avail_out-=n,t.pending-=n,t.pending===0&&(t.pending_out=0))}function I(e,t){a._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,F(e.strm)}function L(e,t){e.pending_buf[e.pending++]=t}function R(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t}function z(e,t){var n,r,i=e.max_chain_length,a=e.strstart,o=e.prev_length,s=e.nice_match,c=e.strstart>e.w_size-T?e.strstart-(e.w_size-T):0,l=e.window,u=e.w_mask,d=e.prev,f=e.strstart+w,p=l[a+o-1],m=l[a+o];e.prev_length>=e.good_match&&(i>>=2),s>e.lookahead&&(s=e.lookahead);do if(l[(n=t)+o]===m&&l[n+o-1]===p&&l[n]===l[a]&&l[++n]===l[a+1]){a+=2,n++;do;while(l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&a<f);if(r=w-(f-a),a=f-w,o<r){if(e.match_start=t,s<=(o=r))break;p=l[a+o-1],m=l[a+o]}}while((t=d[t&u])>c&&--i!=0);return o<=e.lookahead?o:e.lookahead}function B(e){var t,n,r,a,c,l,u,d,f,p,m=e.w_size;do{if(a=e.window_size-e.lookahead-e.strstart,e.strstart>=m+(m-T)){for(i.arraySet(e.window,e.window,m,m,0),e.match_start-=m,e.strstart-=m,e.block_start-=m,t=n=e.hash_size;r=e.head[--t],e.head[t]=m<=r?r-m:0,--n;);for(t=n=m;r=e.prev[--t],e.prev[t]=m<=r?r-m:0,--n;);a+=m}if(e.strm.avail_in===0)break;if(l=e.strm,u=e.window,d=e.strstart+e.lookahead,f=a,p=void 0,p=l.avail_in,f<p&&(p=f),n=p===0?0:(l.avail_in-=p,i.arraySet(u,l.input,l.next_in,p,d),l.state.wrap===1?l.adler=o(l.adler,u,p,d):l.state.wrap===2&&(l.adler=s(l.adler,u,p,d)),l.next_in+=p,l.total_in+=p,p),e.lookahead+=n,e.lookahead+e.insert>=C)for(c=e.strstart-e.insert,e.ins_h=e.window[c],e.ins_h=(e.ins_h<<e.hash_shift^e.window[c+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[c+C-1])&e.hash_mask,e.prev[c&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=c,c++,e.insert--,!(e.lookahead+e.insert<C)););}while(e.lookahead<T&&e.strm.avail_in!==0)}function ee(e,t){for(var n,r;;){if(e.lookahead<T){if(B(e),e.lookahead<T&&t===l)return O;if(e.lookahead===0)break}if(n=0,e.lookahead>=C&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),n!==0&&e.strstart-n<=e.w_size-T&&(e.match_length=z(e,n)),e.match_length>=C){if(r=a._tr_tally(e,e.strstart-e.match_start,e.match_length-C),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=C){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,--e.match_length!=0;);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask}else r=a._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(r&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=e.strstart<C-1?e.strstart:C-1,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}function te(e,t){for(var n,r,i;;){if(e.lookahead<T){if(B(e),e.lookahead<T&&t===l)return O;if(e.lookahead===0)break}if(n=0,e.lookahead>=C&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=C-1,n!==0&&e.prev_length<e.max_lazy_match&&e.strstart-n<=e.w_size-T&&(e.match_length=z(e,n),e.match_length<=5&&(e.strategy===1||e.match_length===C&&4096<e.strstart-e.match_start)&&(e.match_length=C-1)),e.prev_length>=C&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-C,r=a._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-C),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),--e.prev_length!=0;);if(e.match_available=0,e.match_length=C-1,e.strstart++,r&&(I(e,!1),e.strm.avail_out===0))return O}else if(e.match_available){if((r=a._tr_tally(e,0,e.window[e.strstart-1]))&&I(e,!1),e.strstart++,e.lookahead--,e.strm.avail_out===0)return O}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&=(r=a._tr_tally(e,0,e.window[e.strstart-1]),0),e.insert=e.strstart<C-1?e.strstart:C-1,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}function V(e,t,n,r,i){this.good_length=e,this.max_lazy=t,this.nice_length=n,this.max_chain=r,this.func=i}function ne(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=g,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new i.Buf16(2*x),this.dyn_dtree=new i.Buf16(2*(2*y+1)),this.bl_tree=new i.Buf16(2*(2*b+1)),P(this.dyn_ltree),P(this.dyn_dtree),P(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new i.Buf16(S+1),this.heap=new i.Buf16(2*v+1),P(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new i.Buf16(2*v+1),P(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function H(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=h,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?E:D,e.adler=t.wrap===2?0:1,t.last_flush=l,a._tr_init(t),d):M(e,f)}function U(e){var t=H(e);return t===d&&function(e){e.window_size=2*e.w_size,P(e.head),e.max_lazy_match=r[e.level].max_lazy,e.good_match=r[e.level].good_length,e.nice_match=r[e.level].nice_length,e.max_chain_length=r[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=C-1,e.match_available=0,e.ins_h=0}(e.state),t}function re(e,t,n,r,a,o){if(!e)return f;var s=1;if(t===p&&(t=6),r<0?(s=0,r=-r):15<r&&(s=2,r-=16),a<1||_<a||n!==g||r<8||15<r||t<0||9<t||o<0||m<o)return M(e,f);r===8&&(r=9);var c=new ne;return(e.state=c).strm=e,c.wrap=s,c.gzhead=null,c.w_bits=r,c.w_size=1<<c.w_bits,c.w_mask=c.w_size-1,c.hash_bits=a+7,c.hash_size=1<<c.hash_bits,c.hash_mask=c.hash_size-1,c.hash_shift=~~((c.hash_bits+C-1)/C),c.window=new i.Buf8(2*c.w_size),c.head=new i.Buf16(c.hash_size),c.prev=new i.Buf16(c.w_size),c.lit_bufsize=1<<a+6,c.pending_buf_size=4*c.lit_bufsize,c.pending_buf=new i.Buf8(c.pending_buf_size),c.d_buf=1*c.lit_bufsize,c.l_buf=3*c.lit_bufsize,c.level=t,c.strategy=o,c.method=n,U(e)}r=[new V(0,0,0,0,function(e,t){var n=65535;for(n>e.pending_buf_size-5&&(n=e.pending_buf_size-5);;){if(e.lookahead<=1){if(B(e),e.lookahead===0&&t===l)return O;if(e.lookahead===0)break}e.strstart+=e.lookahead,e.lookahead=0;var r=e.block_start+n;if((e.strstart===0||e.strstart>=r)&&(e.lookahead=e.strstart-r,e.strstart=r,I(e,!1),e.strm.avail_out===0)||e.strstart-e.block_start>=e.w_size-T&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=0,t===u?(I(e,!0),e.strm.avail_out===0?A:j):(e.strstart>e.block_start&&(I(e,!1),e.strm.avail_out),O)}),new V(4,4,8,4,ee),new V(4,5,16,8,ee),new V(4,6,32,32,ee),new V(4,4,16,16,te),new V(8,16,32,32,te),new V(8,16,128,128,te),new V(8,32,128,256,te),new V(32,128,258,1024,te),new V(32,258,258,4096,te)],n.deflateInit=function(e,t){return re(e,t,g,15,8,0)},n.deflateInit2=re,n.deflateReset=U,n.deflateResetKeep=H,n.deflateSetHeader=function(e,t){return e&&e.state&&e.state.wrap===2?(e.state.gzhead=t,d):f},n.deflate=function(e,t){var n,i,o,c;if(!e||!e.state||5<t||t<0)return e?M(e,f):f;if(i=e.state,!e.output||!e.input&&e.avail_in!==0||i.status===666&&t!==u)return M(e,e.avail_out===0?-5:f);if(i.strm=e,n=i.last_flush,i.last_flush=t,i.status===E){if(i.wrap===2)e.adler=0,L(i,31),L(i,139),L(i,8),i.gzhead?(L(i,+!!i.gzhead.text+(i.gzhead.hcrc?2:0)+(i.gzhead.extra?4:0)+(i.gzhead.name?8:0)+(i.gzhead.comment?16:0)),L(i,255&i.gzhead.time),L(i,i.gzhead.time>>8&255),L(i,i.gzhead.time>>16&255),L(i,i.gzhead.time>>24&255),L(i,i.level===9?2:2<=i.strategy||i.level<2?4:0),L(i,255&i.gzhead.os),i.gzhead.extra&&i.gzhead.extra.length&&(L(i,255&i.gzhead.extra.length),L(i,i.gzhead.extra.length>>8&255)),i.gzhead.hcrc&&(e.adler=s(e.adler,i.pending_buf,i.pending,0)),i.gzindex=0,i.status=69):(L(i,0),L(i,0),L(i,0),L(i,0),L(i,0),L(i,i.level===9?2:2<=i.strategy||i.level<2?4:0),L(i,3),i.status=D);else{var p=g+(i.w_bits-8<<4)<<8;p|=(2<=i.strategy||i.level<2?0:i.level<6?1:i.level===6?2:3)<<6,i.strstart!==0&&(p|=32),p+=31-p%31,i.status=D,R(i,p),i.strstart!==0&&(R(i,e.adler>>>16),R(i,65535&e.adler)),e.adler=1}}if(i.status===69){if(i.gzhead.extra){for(o=i.pending;i.gzindex<(65535&i.gzhead.extra.length)&&(i.pending!==i.pending_buf_size||(i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),F(e),o=i.pending,i.pending!==i.pending_buf_size));)L(i,255&i.gzhead.extra[i.gzindex]),i.gzindex++;i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),i.gzindex===i.gzhead.extra.length&&(i.gzindex=0,i.status=73)}else i.status=73}if(i.status===73){if(i.gzhead.name){o=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),F(e),o=i.pending,i.pending===i.pending_buf_size)){c=1;break}c=i.gzindex<i.gzhead.name.length?255&i.gzhead.name.charCodeAt(i.gzindex++):0,L(i,c)}while(c!==0);i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),c===0&&(i.gzindex=0,i.status=91)}else i.status=91}if(i.status===91){if(i.gzhead.comment){o=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),F(e),o=i.pending,i.pending===i.pending_buf_size)){c=1;break}c=i.gzindex<i.gzhead.comment.length?255&i.gzhead.comment.charCodeAt(i.gzindex++):0,L(i,c)}while(c!==0);i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),c===0&&(i.status=103)}else i.status=103}if(i.status===103&&(i.gzhead.hcrc?(i.pending+2>i.pending_buf_size&&F(e),i.pending+2<=i.pending_buf_size&&(L(i,255&e.adler),L(i,e.adler>>8&255),e.adler=0,i.status=D)):i.status=D),i.pending!==0){if(F(e),e.avail_out===0)return i.last_flush=-1,d}else if(e.avail_in===0&&N(t)<=N(n)&&t!==u)return M(e,-5);if(i.status===666&&e.avail_in!==0)return M(e,-5);if(e.avail_in!==0||i.lookahead!==0||t!==l&&i.status!==666){var m=i.strategy===2?function(e,t){for(var n;;){if(e.lookahead===0&&(B(e),e.lookahead===0)){if(t===l)return O;break}if(e.match_length=0,n=a._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,n&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=0,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}(i,t):i.strategy===3?function(e,t){for(var n,r,i,o,s=e.window;;){if(e.lookahead<=w){if(B(e),e.lookahead<=w&&t===l)return O;if(e.lookahead===0)break}if(e.match_length=0,e.lookahead>=C&&0<e.strstart&&(r=s[i=e.strstart-1])===s[++i]&&r===s[++i]&&r===s[++i]){o=e.strstart+w;do;while(r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&i<o);e.match_length=w-(o-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=C?(n=a._tr_tally(e,1,e.match_length-C),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(n=a._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),n&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=0,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}(i,t):r[i.level].func(i,t);if(m!==A&&m!==j||(i.status=666),m===O||m===A)return e.avail_out===0&&(i.last_flush=-1),d;if(m===k&&(t===1?a._tr_align(i):t!==5&&(a._tr_stored_block(i,0,0,!1),t===3&&(P(i.head),i.lookahead===0&&(i.strstart=0,i.block_start=0,i.insert=0))),F(e),e.avail_out===0))return i.last_flush=-1,d}return t===u?i.wrap<=0?1:(i.wrap===2?(L(i,255&e.adler),L(i,e.adler>>8&255),L(i,e.adler>>16&255),L(i,e.adler>>24&255),L(i,255&e.total_in),L(i,e.total_in>>8&255),L(i,e.total_in>>16&255),L(i,e.total_in>>24&255)):(R(i,e.adler>>>16),R(i,65535&e.adler)),F(e),0<i.wrap&&(i.wrap=-i.wrap),i.pending===0?1:d):d},n.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==E&&t!==69&&t!==73&&t!==91&&t!==103&&t!==D&&t!==666?M(e,f):(e.state=null,t===D?M(e,-3):d):f},n.deflateSetDictionary=function(e,t){var n,r,a,s,c,l,u,p,m=t.length;if(!e||!e.state||(s=(n=e.state).wrap)===2||s===1&&n.status!==E||n.lookahead)return f;for(s===1&&(e.adler=o(e.adler,t,m,0)),n.wrap=0,m>=n.w_size&&(s===0&&(P(n.head),n.strstart=0,n.block_start=0,n.insert=0),p=new i.Buf8(n.w_size),i.arraySet(p,t,m-n.w_size,n.w_size,0),t=p,m=n.w_size),c=e.avail_in,l=e.next_in,u=e.input,e.avail_in=m,e.next_in=0,e.input=t,B(n);n.lookahead>=C;){for(r=n.strstart,a=n.lookahead-(C-1);n.ins_h=(n.ins_h<<n.hash_shift^n.window[r+C-1])&n.hash_mask,n.prev[r&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=r,r++,--a;);n.strstart=r,n.lookahead=C-1,B(n)}return n.strstart+=n.lookahead,n.block_start=n.strstart,n.insert=n.lookahead,n.lookahead=0,n.match_length=n.prev_length=C-1,n.match_available=0,e.next_in=l,e.input=u,e.avail_in=c,n.wrap=s,d},n.deflateInfo=`pako deflate (from Nodeca project)`},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,n){"use strict";t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name=``,this.comment=``,this.hcrc=0,this.done=!1}},{}],48:[function(e,t,n){"use strict";t.exports=function(e,t){var n=e.state,r=e.next_in,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T=e.input,E;i=r+(e.avail_in-5),a=e.next_out,E=e.output,o=a-(t-e.avail_out),s=a+(e.avail_out-257),c=n.dmax,l=n.wsize,u=n.whave,d=n.wnext,f=n.window,p=n.hold,m=n.bits,h=n.lencode,g=n.distcode,_=(1<<n.lenbits)-1,v=(1<<n.distbits)-1;e:do{m<15&&(p+=T[r++]<<m,m+=8,p+=T[r++]<<m,m+=8),y=h[p&_];t:for(;;){if(p>>>=b=y>>>24,m-=b,(b=y>>>16&255)==0)E[a++]=65535&y;else{if(!(16&b)){if(!(64&b)){y=h[(65535&y)+(p&(1<<b)-1)];continue t}if(32&b){n.mode=12;break e}e.msg=`invalid literal/length code`,n.mode=30;break e}x=65535&y,(b&=15)&&(m<b&&(p+=T[r++]<<m,m+=8),x+=p&(1<<b)-1,p>>>=b,m-=b),m<15&&(p+=T[r++]<<m,m+=8,p+=T[r++]<<m,m+=8),y=g[p&v];r:for(;;){if(p>>>=b=y>>>24,m-=b,!(16&(b=y>>>16&255))){if(!(64&b)){y=g[(65535&y)+(p&(1<<b)-1)];continue r}e.msg=`invalid distance code`,n.mode=30;break e}if(S=65535&y,m<(b&=15)&&(p+=T[r++]<<m,(m+=8)<b&&(p+=T[r++]<<m,m+=8)),c<(S+=p&(1<<b)-1)){e.msg=`invalid distance too far back`,n.mode=30;break e}if(p>>>=b,m-=b,(b=a-o)<S){if(u<(b=S-b)&&n.sane){e.msg=`invalid distance too far back`,n.mode=30;break e}if(w=f,(C=0)===d){if(C+=l-b,b<x){for(x-=b;E[a++]=f[C++],--b;);C=a-S,w=E}}else if(d<b){if(C+=l+d-b,(b-=d)<x){for(x-=b;E[a++]=f[C++],--b;);if(C=0,d<x){for(x-=b=d;E[a++]=f[C++],--b;);C=a-S,w=E}}}else if(C+=d-b,b<x){for(x-=b;E[a++]=f[C++],--b;);C=a-S,w=E}for(;2<x;)E[a++]=w[C++],E[a++]=w[C++],E[a++]=w[C++],x-=3;x&&(E[a++]=w[C++],1<x&&(E[a++]=w[C++]))}else{for(C=a-S;E[a++]=E[C++],E[a++]=E[C++],E[a++]=E[C++],2<(x-=3););x&&(E[a++]=E[C++],1<x&&(E[a++]=E[C++]))}break}}break}}while(r<i&&a<s);r-=x=m>>3,p&=(1<<(m-=x<<3))-1,e.next_in=r,e.next_out=a,e.avail_in=r<i?i-r+5:5-(r-i),e.avail_out=a<s?s-a+257:257-(a-s),n.hold=p,n.bits=m}},{}],49:[function(e,t,n){"use strict";var r=e(`../utils/common`),i=e(`./adler32`),a=e(`./crc32`),o=e(`./inffast`),s=e(`./inftrees`),c=1,l=2,u=0,d=-2,f=1,p=852,m=592;function h(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function g(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function _(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg=``,t.wrap&&(e.adler=1&t.wrap),t.mode=f,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new r.Buf32(p),t.distcode=t.distdyn=new r.Buf32(m),t.sane=1,t.back=-1,u):d}function v(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,_(e)):d}function y(e,t){var n,r;return e&&e.state?(r=e.state,t<0?(n=0,t=-t):(n=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?d:(r.window!==null&&r.wbits!==t&&(r.window=null),r.wrap=n,r.wbits=t,v(e))):d}function b(e,t){var n,r;return e?(r=new g,(e.state=r).window=null,(n=y(e,t))!==u&&(e.state=null),n):d}var x,S,C=!0;function w(e){if(C){var t;for(x=new r.Buf32(512),S=new r.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(s(c,e.lens,0,288,x,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;s(l,e.lens,0,32,S,0,e.work,{bits:5}),C=!1}e.lencode=x,e.lenbits=9,e.distcode=S,e.distbits=5}function T(e,t,n,i){var a,o=e.state;return o.window===null&&(o.wsize=1<<o.wbits,o.wnext=0,o.whave=0,o.window=new r.Buf8(o.wsize)),i>=o.wsize?(r.arraySet(o.window,t,n-o.wsize,o.wsize,0),o.wnext=0,o.whave=o.wsize):(i<(a=o.wsize-o.wnext)&&(a=i),r.arraySet(o.window,t,n-i,a,o.wnext),(i-=a)?(r.arraySet(o.window,t,n-i,i,0),o.wnext=i,o.whave=o.wsize):(o.wnext+=a,o.wnext===o.wsize&&(o.wnext=0),o.whave<o.wsize&&(o.whave+=a))),0}n.inflateReset=v,n.inflateReset2=y,n.inflateResetKeep=_,n.inflateInit=function(e){return b(e,15)},n.inflateInit2=b,n.inflate=function(e,t){var n,p,m,g,_,v,y,b,x,S,C,E,D,O,k,A,j,M,N,P,F,I,L,R,z=0,B=new r.Buf8(4),ee=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&e.avail_in!==0)return d;(n=e.state).mode===12&&(n.mode=13),_=e.next_out,m=e.output,y=e.avail_out,g=e.next_in,p=e.input,v=e.avail_in,b=n.hold,x=n.bits,S=v,C=y,I=u;e:for(;;)switch(n.mode){case f:if(n.wrap===0){n.mode=13;break}for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(2&n.wrap&&b===35615){B[n.check=0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0),x=b=0,n.mode=2;break}if(n.flags=0,n.head&&(n.head.done=!1),!(1&n.wrap)||(((255&b)<<8)+(b>>8))%31){e.msg=`incorrect header check`,n.mode=30;break}if((15&b)!=8){e.msg=`unknown compression method`,n.mode=30;break}if(x-=4,F=8+(15&(b>>>=4)),n.wbits===0)n.wbits=F;else if(F>n.wbits){e.msg=`invalid window size`,n.mode=30;break}n.dmax=1<<F,e.adler=n.check=1,n.mode=512&b?10:12,x=b=0;break;case 2:for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(n.flags=b,(255&n.flags)!=8){e.msg=`unknown compression method`,n.mode=30;break}if(57344&n.flags){e.msg=`unknown header flags set`,n.mode=30;break}n.head&&(n.head.text=b>>8&1),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0)),x=b=0,n.mode=3;case 3:for(;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.head&&(n.head.time=b),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,B[2]=b>>>16&255,B[3]=b>>>24&255,n.check=a(n.check,B,4,0)),x=b=0,n.mode=4;case 4:for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.head&&(n.head.xflags=255&b,n.head.os=b>>8),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0)),x=b=0,n.mode=5;case 5:if(1024&n.flags){for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.length=b,n.head&&(n.head.extra_len=b),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0)),x=b=0}else n.head&&(n.head.extra=null);n.mode=6;case 6:if(1024&n.flags&&(v<(E=n.length)&&(E=v),E&&(n.head&&(F=n.head.extra_len-n.length,n.head.extra||(n.head.extra=Array(n.head.extra_len)),r.arraySet(n.head.extra,p,g,E,F)),512&n.flags&&(n.check=a(n.check,p,E,g)),v-=E,g+=E,n.length-=E),n.length))break e;n.length=0,n.mode=7;case 7:if(2048&n.flags){if(v===0)break e;for(E=0;F=p[g+E++],n.head&&F&&n.length<65536&&(n.head.name+=String.fromCharCode(F)),F&&E<v;);if(512&n.flags&&(n.check=a(n.check,p,E,g)),v-=E,g+=E,F)break e}else n.head&&(n.head.name=null);n.length=0,n.mode=8;case 8:if(4096&n.flags){if(v===0)break e;for(E=0;F=p[g+E++],n.head&&F&&n.length<65536&&(n.head.comment+=String.fromCharCode(F)),F&&E<v;);if(512&n.flags&&(n.check=a(n.check,p,E,g)),v-=E,g+=E,F)break e}else n.head&&(n.head.comment=null);n.mode=9;case 9:if(512&n.flags){for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(b!==(65535&n.check)){e.msg=`header crc mismatch`,n.mode=30;break}x=b=0}n.head&&(n.head.hcrc=n.flags>>9&1,n.head.done=!0),e.adler=n.check=0,n.mode=12;break;case 10:for(;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}e.adler=n.check=h(b),x=b=0,n.mode=11;case 11:if(n.havedict===0)return e.next_out=_,e.avail_out=y,e.next_in=g,e.avail_in=v,n.hold=b,n.bits=x,2;e.adler=n.check=1,n.mode=12;case 12:if(t===5||t===6)break e;case 13:if(n.last){b>>>=7&x,x-=7&x,n.mode=27;break}for(;x<3;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}switch(n.last=1&b,--x,3&(b>>>=1)){case 0:n.mode=14;break;case 1:if(w(n),n.mode=20,t!==6)break;b>>>=2,x-=2;break e;case 2:n.mode=17;break;case 3:e.msg=`invalid block type`,n.mode=30}b>>>=2,x-=2;break;case 14:for(b>>>=7&x,x-=7&x;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if((65535&b)!=(b>>>16^65535)){e.msg=`invalid stored block lengths`,n.mode=30;break}if(n.length=65535&b,x=b=0,n.mode=15,t===6)break e;case 15:n.mode=16;case 16:if(E=n.length){if(v<E&&(E=v),y<E&&(E=y),E===0)break e;r.arraySet(m,p,g,E,_),v-=E,g+=E,y-=E,_+=E,n.length-=E;break}n.mode=12;break;case 17:for(;x<14;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(n.nlen=257+(31&b),b>>>=5,x-=5,n.ndist=1+(31&b),b>>>=5,x-=5,n.ncode=4+(15&b),b>>>=4,x-=4,286<n.nlen||30<n.ndist){e.msg=`too many length or distance symbols`,n.mode=30;break}n.have=0,n.mode=18;case 18:for(;n.have<n.ncode;){for(;x<3;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.lens[ee[n.have++]]=7&b,b>>>=3,x-=3}for(;n.have<19;)n.lens[ee[n.have++]]=0;if(n.lencode=n.lendyn,n.lenbits=7,L={bits:n.lenbits},I=s(0,n.lens,0,19,n.lencode,0,n.work,L),n.lenbits=L.bits,I){e.msg=`invalid code lengths set`,n.mode=30;break}n.have=0,n.mode=19;case 19:for(;n.have<n.nlen+n.ndist;){for(;A=(z=n.lencode[b&(1<<n.lenbits)-1])>>>16&255,j=65535&z,!((k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(j<16)b>>>=k,x-=k,n.lens[n.have++]=j;else{if(j===16){for(R=k+2;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(b>>>=k,x-=k,n.have===0){e.msg=`invalid bit length repeat`,n.mode=30;break}F=n.lens[n.have-1],E=3+(3&b),b>>>=2,x-=2}else if(j===17){for(R=k+3;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}x-=k,F=0,E=3+(7&(b>>>=k)),b>>>=3,x-=3}else{for(R=k+7;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}x-=k,F=0,E=11+(127&(b>>>=k)),b>>>=7,x-=7}if(n.have+E>n.nlen+n.ndist){e.msg=`invalid bit length repeat`,n.mode=30;break}for(;E--;)n.lens[n.have++]=F}}if(n.mode===30)break;if(n.lens[256]===0){e.msg=`invalid code -- missing end-of-block`,n.mode=30;break}if(n.lenbits=9,L={bits:n.lenbits},I=s(c,n.lens,0,n.nlen,n.lencode,0,n.work,L),n.lenbits=L.bits,I){e.msg=`invalid literal/lengths set`,n.mode=30;break}if(n.distbits=6,n.distcode=n.distdyn,L={bits:n.distbits},I=s(l,n.lens,n.nlen,n.ndist,n.distcode,0,n.work,L),n.distbits=L.bits,I){e.msg=`invalid distances set`,n.mode=30;break}if(n.mode=20,t===6)break e;case 20:n.mode=21;case 21:if(6<=v&&258<=y){e.next_out=_,e.avail_out=y,e.next_in=g,e.avail_in=v,n.hold=b,n.bits=x,o(e,C),_=e.next_out,m=e.output,y=e.avail_out,g=e.next_in,p=e.input,v=e.avail_in,b=n.hold,x=n.bits,n.mode===12&&(n.back=-1);break}for(n.back=0;A=(z=n.lencode[b&(1<<n.lenbits)-1])>>>16&255,j=65535&z,!((k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(A&&!(240&A)){for(M=k,N=A,P=j;A=(z=n.lencode[P+((b&(1<<M+N)-1)>>M)])>>>16&255,j=65535&z,!(M+(k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}b>>>=M,x-=M,n.back+=M}if(b>>>=k,x-=k,n.back+=k,n.length=j,A===0){n.mode=26;break}if(32&A){n.back=-1,n.mode=12;break}if(64&A){e.msg=`invalid literal/length code`,n.mode=30;break}n.extra=15&A,n.mode=22;case 22:if(n.extra){for(R=n.extra;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.length+=b&(1<<n.extra)-1,b>>>=n.extra,x-=n.extra,n.back+=n.extra}n.was=n.length,n.mode=23;case 23:for(;A=(z=n.distcode[b&(1<<n.distbits)-1])>>>16&255,j=65535&z,!((k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(!(240&A)){for(M=k,N=A,P=j;A=(z=n.distcode[P+((b&(1<<M+N)-1)>>M)])>>>16&255,j=65535&z,!(M+(k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}b>>>=M,x-=M,n.back+=M}if(b>>>=k,x-=k,n.back+=k,64&A){e.msg=`invalid distance code`,n.mode=30;break}n.offset=j,n.extra=15&A,n.mode=24;case 24:if(n.extra){for(R=n.extra;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.offset+=b&(1<<n.extra)-1,b>>>=n.extra,x-=n.extra,n.back+=n.extra}if(n.offset>n.dmax){e.msg=`invalid distance too far back`,n.mode=30;break}n.mode=25;case 25:if(y===0)break e;if(E=C-y,n.offset>E){if((E=n.offset-E)>n.whave&&n.sane){e.msg=`invalid distance too far back`,n.mode=30;break}D=E>n.wnext?(E-=n.wnext,n.wsize-E):n.wnext-E,E>n.length&&(E=n.length),O=n.window}else O=m,D=_-n.offset,E=n.length;for(y<E&&(E=y),y-=E,n.length-=E;m[_++]=O[D++],--E;);n.length===0&&(n.mode=21);break;case 26:if(y===0)break e;m[_++]=n.length,y--,n.mode=21;break;case 27:if(n.wrap){for(;x<32;){if(v===0)break e;v--,b|=p[g++]<<x,x+=8}if(C-=y,e.total_out+=C,n.total+=C,C&&(e.adler=n.check=n.flags?a(n.check,m,C,_-C):i(n.check,m,C,_-C)),C=y,(n.flags?b:h(b))!==n.check){e.msg=`incorrect data check`,n.mode=30;break}x=b=0}n.mode=28;case 28:if(n.wrap&&n.flags){for(;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(b!==(4294967295&n.total)){e.msg=`incorrect length check`,n.mode=30;break}x=b=0}n.mode=29;case 29:I=1;break e;case 30:I=-3;break e;case 31:return-4;case 32:default:return d}return e.next_out=_,e.avail_out=y,e.next_in=g,e.avail_in=v,n.hold=b,n.bits=x,(n.wsize||C!==e.avail_out&&n.mode<30&&(n.mode<27||t!==4))&&T(e,e.output,e.next_out,C-e.avail_out)?(n.mode=31,-4):(S-=e.avail_in,C-=e.avail_out,e.total_in+=S,e.total_out+=C,n.total+=C,n.wrap&&C&&(e.adler=n.check=n.flags?a(n.check,m,C,e.next_out-C):i(n.check,m,C,e.next_out-C)),e.data_type=n.bits+(n.last?64:0)+(n.mode===12?128:0)+(n.mode===20||n.mode===15?256:0),(S==0&&C===0||t===4)&&I===u&&(I=-5),I)},n.inflateEnd=function(e){if(!e||!e.state)return d;var t=e.state;return t.window&&=null,e.state=null,u},n.inflateGetHeader=function(e,t){var n;return e&&e.state&&2&(n=e.state).wrap?((n.head=t).done=!1,u):d},n.inflateSetDictionary=function(e,t){var n,r=t.length;return e&&e.state?(n=e.state).wrap!==0&&n.mode!==11?d:n.mode===11&&i(1,t,r,0)!==n.check?-3:T(e,t,r,r)?(n.mode=31,-4):(n.havedict=1,u):d},n.inflateInfo=`pako inflate (from Nodeca project)`},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,n){"use strict";var r=e(`../utils/common`),i=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],a=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],o=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],s=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,n,c,l,u,d,f){var p,m,h,g,_,v,y,b,x,S=f.bits,C=0,w=0,T=0,E=0,D=0,O=0,k=0,A=0,j=0,M=0,N=null,P=0,F=new r.Buf16(16),I=new r.Buf16(16),L=null,R=0;for(C=0;C<=15;C++)F[C]=0;for(w=0;w<c;w++)F[t[n+w]]++;for(D=S,E=15;1<=E&&F[E]===0;E--);if(E<D&&(D=E),E===0)return l[u++]=20971520,l[u++]=20971520,f.bits=1,0;for(T=1;T<E&&F[T]===0;T++);for(D<T&&(D=T),C=A=1;C<=15;C++)if(A<<=1,(A-=F[C])<0)return-1;if(0<A&&(e===0||E!==1))return-1;for(I[1]=0,C=1;C<15;C++)I[C+1]=I[C]+F[C];for(w=0;w<c;w++)t[n+w]!==0&&(d[I[t[n+w]]++]=w);if(v=e===0?(N=L=d,19):e===1?(N=i,P-=257,L=a,R-=257,256):(N=o,L=s,-1),C=T,_=u,k=w=M=0,h=-1,g=(j=1<<(O=D))-1,e===1&&852<j||e===2&&592<j)return 1;for(;;){for(y=C-k,x=d[w]<v?(b=0,d[w]):d[w]>v?(b=L[R+d[w]],N[P+d[w]]):(b=96,0),p=1<<C-k,T=m=1<<O;l[_+(M>>k)+(m-=p)]=y<<24|b<<16|x|0,m!==0;);for(p=1<<C-1;M&p;)p>>=1;if(p===0?M=0:(M&=p-1,M+=p),w++,--F[C]==0){if(C===E)break;C=t[n+d[w]]}if(D<C&&(M&g)!==h){for(k===0&&(k=D),_+=T,A=1<<(O=C-k);O+k<E&&!((A-=F[O+k])<=0);)O++,A<<=1;if(j+=1<<O,e===1&&852<j||e===2&&592<j)return 1;l[h=M&g]=D<<24|O<<16|_-u|0}}return M!==0&&(l[_+M]=C-k<<24|4194304),f.bits=D,0}},{"../utils/common":41}],51:[function(e,t,n){"use strict";t.exports={2:`need dictionary`,1:`stream end`,0:``,"-1":`file error`,"-2":`stream error`,"-3":`data error`,"-4":`insufficient memory`,"-5":`buffer error`,"-6":`incompatible version`}},{}],52:[function(e,t,n){"use strict";var r=e(`../utils/common`),i=0,a=1;function o(e){for(var t=e.length;0<=--t;)e[t]=0}var s=0,c=29,l=256,u=l+1+c,d=30,f=19,p=2*u+1,m=15,h=16,g=7,_=256,v=16,y=17,b=18,x=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],S=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],C=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],w=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],T=Array(2*(u+2));o(T);var E=Array(2*d);o(E);var D=Array(512);o(D);var O=Array(256);o(O);var k=Array(c);o(k);var A,j,M,N=Array(d);function P(e,t,n,r,i){this.static_tree=e,this.extra_bits=t,this.extra_base=n,this.elems=r,this.max_length=i,this.has_stree=e&&e.length}function F(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}function I(e){return e<256?D[e]:D[256+(e>>>7)]}function L(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255}function R(e,t,n){e.bi_valid>h-n?(e.bi_buf|=t<<e.bi_valid&65535,L(e,e.bi_buf),e.bi_buf=t>>h-e.bi_valid,e.bi_valid+=n-h):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=n)}function z(e,t,n){R(e,n[2*t],n[2*t+1])}function B(e,t){for(var n=0;n|=1&e,e>>>=1,n<<=1,0<--t;);return n>>>1}function ee(e,t,n){var r,i,a=Array(m+1),o=0;for(r=1;r<=m;r++)a[r]=o=o+n[r-1]<<1;for(i=0;i<=t;i++){var s=e[2*i+1];s!==0&&(e[2*i]=B(a[s]++,s))}}function te(e){var t;for(t=0;t<u;t++)e.dyn_ltree[2*t]=0;for(t=0;t<d;t++)e.dyn_dtree[2*t]=0;for(t=0;t<f;t++)e.bl_tree[2*t]=0;e.dyn_ltree[2*_]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function V(e){8<e.bi_valid?L(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function ne(e,t,n,r){var i=2*t,a=2*n;return e[i]<e[a]||e[i]===e[a]&&r[t]<=r[n]}function H(e,t,n){for(var r=e.heap[n],i=n<<1;i<=e.heap_len&&(i<e.heap_len&&ne(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!ne(t,r,e.heap[i],e.depth));)e.heap[n]=e.heap[i],n=i,i<<=1;e.heap[n]=r}function U(e,t,n){var r,i,a,o,s=0;if(e.last_lit!==0)for(;r=e.pending_buf[e.d_buf+2*s]<<8|e.pending_buf[e.d_buf+2*s+1],i=e.pending_buf[e.l_buf+s],s++,r===0?z(e,i,t):(z(e,(a=O[i])+l+1,t),(o=x[a])!==0&&R(e,i-=k[a],o),z(e,a=I(--r),n),(o=S[a])!==0&&R(e,r-=N[a],o)),s<e.last_lit;);z(e,_,t)}function re(e,t){var n,r,i,a=t.dyn_tree,o=t.stat_desc.static_tree,s=t.stat_desc.has_stree,c=t.stat_desc.elems,l=-1;for(e.heap_len=0,e.heap_max=p,n=0;n<c;n++)a[2*n]===0?a[2*n+1]=0:(e.heap[++e.heap_len]=l=n,e.depth[n]=0);for(;e.heap_len<2;)a[2*(i=e.heap[++e.heap_len]=l<2?++l:0)]=1,e.depth[i]=0,e.opt_len--,s&&(e.static_len-=o[2*i+1]);for(t.max_code=l,n=e.heap_len>>1;1<=n;n--)H(e,a,n);for(i=c;n=e.heap[1],e.heap[1]=e.heap[e.heap_len--],H(e,a,1),r=e.heap[1],e.heap[--e.heap_max]=n,e.heap[--e.heap_max]=r,a[2*i]=a[2*n]+a[2*r],e.depth[i]=(e.depth[n]>=e.depth[r]?e.depth[n]:e.depth[r])+1,a[2*n+1]=a[2*r+1]=i,e.heap[1]=i++,H(e,a,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var n,r,i,a,o,s,c=t.dyn_tree,l=t.max_code,u=t.stat_desc.static_tree,d=t.stat_desc.has_stree,f=t.stat_desc.extra_bits,h=t.stat_desc.extra_base,g=t.stat_desc.max_length,_=0;for(a=0;a<=m;a++)e.bl_count[a]=0;for(c[2*e.heap[e.heap_max]+1]=0,n=e.heap_max+1;n<p;n++)g<(a=c[2*c[2*(r=e.heap[n])+1]+1]+1)&&(a=g,_++),c[2*r+1]=a,l<r||(e.bl_count[a]++,o=0,h<=r&&(o=f[r-h]),s=c[2*r],e.opt_len+=s*(a+o),d&&(e.static_len+=s*(u[2*r+1]+o)));if(_!==0){do{for(a=g-1;e.bl_count[a]===0;)a--;e.bl_count[a]--,e.bl_count[a+1]+=2,e.bl_count[g]--,_-=2}while(0<_);for(a=g;a!==0;a--)for(r=e.bl_count[a];r!==0;)l<(i=e.heap[--n])||(c[2*i+1]!==a&&(e.opt_len+=(a-c[2*i+1])*c[2*i],c[2*i+1]=a),r--)}}(e,t),ee(a,l,e.bl_count)}function ie(e,t,n){var r,i,a=-1,o=t[1],s=0,c=7,l=4;for(o===0&&(c=138,l=3),t[2*(n+1)+1]=65535,r=0;r<=n;r++)i=o,o=t[2*(r+1)+1],++s<c&&i===o||(s<l?e.bl_tree[2*i]+=s:i===0?s<=10?e.bl_tree[2*y]++:e.bl_tree[2*b]++:(i!==a&&e.bl_tree[2*i]++,e.bl_tree[2*v]++),a=i,l=(s=0)===o?(c=138,3):i===o?(c=6,3):(c=7,4))}function ae(e,t,n){var r,i,a=-1,o=t[1],s=0,c=7,l=4;for(o===0&&(c=138,l=3),r=0;r<=n;r++)if(i=o,o=t[2*(r+1)+1],!(++s<c&&i===o)){if(s<l)for(;z(e,i,e.bl_tree),--s!=0;);else i===0?s<=10?(z(e,y,e.bl_tree),R(e,s-3,3)):(z(e,b,e.bl_tree),R(e,s-11,7)):(i!==a&&(z(e,i,e.bl_tree),s--),z(e,v,e.bl_tree),R(e,s-3,2));a=i,l=(s=0)===o?(c=138,3):i===o?(c=6,3):(c=7,4)}}o(N);var oe=!1;function se(e,t,n,i){R(e,(s<<1)+ +!!i,3),function(e,t,n,i){V(e),i&&(L(e,n),L(e,~n)),r.arraySet(e.pending_buf,e.window,t,n,e.pending),e.pending+=n}(e,t,n,!0)}n._tr_init=function(e){oe||=(function(){var e,t,n,r,i,a=Array(m+1);for(r=n=0;r<c-1;r++)for(k[r]=n,e=0;e<1<<x[r];e++)O[n++]=r;for(O[n-1]=r,r=i=0;r<16;r++)for(N[r]=i,e=0;e<1<<S[r];e++)D[i++]=r;for(i>>=7;r<d;r++)for(N[r]=i<<7,e=0;e<1<<S[r]-7;e++)D[256+i++]=r;for(t=0;t<=m;t++)a[t]=0;for(e=0;e<=143;)T[2*e+1]=8,e++,a[8]++;for(;e<=255;)T[2*e+1]=9,e++,a[9]++;for(;e<=279;)T[2*e+1]=7,e++,a[7]++;for(;e<=287;)T[2*e+1]=8,e++,a[8]++;for(ee(T,u+1,a),e=0;e<d;e++)E[2*e+1]=5,E[2*e]=B(e,5);A=new P(T,x,l+1,u,m),j=new P(E,S,0,d,m),M=new P([],C,0,f,g)}(),!0),e.l_desc=new F(e.dyn_ltree,A),e.d_desc=new F(e.dyn_dtree,j),e.bl_desc=new F(e.bl_tree,M),e.bi_buf=0,e.bi_valid=0,te(e)},n._tr_stored_block=se,n._tr_flush_block=function(e,t,n,r){var o,s,c=0;0<e.level?(e.strm.data_type===2&&(e.strm.data_type=function(e){var t,n=4093624447;for(t=0;t<=31;t++,n>>>=1)if(1&n&&e.dyn_ltree[2*t]!==0)return i;if(e.dyn_ltree[18]!==0||e.dyn_ltree[20]!==0||e.dyn_ltree[26]!==0)return a;for(t=32;t<l;t++)if(e.dyn_ltree[2*t]!==0)return a;return i}(e)),re(e,e.l_desc),re(e,e.d_desc),c=function(e){var t;for(ie(e,e.dyn_ltree,e.l_desc.max_code),ie(e,e.dyn_dtree,e.d_desc.max_code),re(e,e.bl_desc),t=f-1;3<=t&&e.bl_tree[2*w[t]+1]===0;t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),o=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=o&&(o=s)):o=s=n+5,n+4<=o&&t!==-1?se(e,t,n,r):e.strategy===4||s===o?(R(e,2+ +!!r,3),U(e,T,E)):(R(e,4+ +!!r,3),function(e,t,n,r){var i;for(R(e,t-257,5),R(e,n-1,5),R(e,r-4,4),i=0;i<r;i++)R(e,e.bl_tree[2*w[i]+1],3);ae(e,e.dyn_ltree,t-1),ae(e,e.dyn_dtree,n-1)}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,c+1),U(e,e.dyn_ltree,e.dyn_dtree)),te(e),r&&V(e)},n._tr_tally=function(e,t,n){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&n,e.last_lit++,t===0?e.dyn_ltree[2*n]++:(e.matches++,t--,e.dyn_ltree[2*(O[n]+l+1)]++,e.dyn_dtree[2*I(t)]++),e.last_lit===e.lit_bufsize-1},n._tr_align=function(e){R(e,2,3),z(e,_,T),function(e){e.bi_valid===16?(L(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}(e)}},{"../utils/common":41}],53:[function(e,t,n){"use strict";t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg=``,this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,t,n){(function(e){(function(e,t){"use strict";if(!e.setImmediate){var n,r,i,a,o=1,s={},c=!1,l=e.document,u=Object.getPrototypeOf&&Object.getPrototypeOf(e);u=u&&u.setTimeout?u:e,n={}.toString.call(e.process)===`[object process]`?function(e){process.nextTick(function(){f(e)})}:function(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage(``,`*`),e.onmessage=n,t}}()?(a=`setImmediate$`+Math.random()+`$`,e.addEventListener?e.addEventListener(`message`,p,!1):e.attachEvent(`onmessage`,p),function(t){e.postMessage(a+t,`*`)}):e.MessageChannel?((i=new MessageChannel).port1.onmessage=function(e){f(e.data)},function(e){i.port2.postMessage(e)}):l&&`onreadystatechange`in l.createElement(`script`)?(r=l.documentElement,function(e){var t=l.createElement(`script`);t.onreadystatechange=function(){f(e),t.onreadystatechange=null,r.removeChild(t),t=null},r.appendChild(t)}):function(e){setTimeout(f,0,e)},u.setImmediate=function(e){typeof e!=`function`&&(e=Function(``+e));for(var t=Array(arguments.length-1),r=0;r<t.length;r++)t[r]=arguments[r+1];return s[o]={callback:e,args:t},n(o),o++},u.clearImmediate=d}function d(e){delete s[e]}function f(e){if(c)setTimeout(f,0,e);else{var n=s[e];if(n){c=!0;try{(function(e){var n=e.callback,r=e.args;switch(r.length){case 0:n();break;case 1:n(r[0]);break;case 2:n(r[0],r[1]);break;case 3:n(r[0],r[1],r[2]);break;default:n.apply(t,r)}})(n)}finally{d(e),c=!1}}}}function p(t){t.source===e&&typeof t.data==`string`&&t.data.indexOf(a)===0&&f(+t.data.slice(a.length))}})(typeof self>`u`?e===void 0?this:e:self)}).call(this,typeof global<`u`?global:typeof self<`u`?self:typeof window<`u`?window:{})},{}]},{},[10])(10)})}))(),1);function Ec(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)n.hasOwnProperty(r)&&(e[r]=n[r])}return e}function Dc(e,t){return Array(t+1).join(e)}function Oc(e){return e.replace(/^\n*/,``)}function kc(e){for(var t=e.length;t>0&&e[t-1]===`
`;)t--;return e.substring(0,t)}function Ac(e){return kc(Oc(e))}var jc=`ADDRESS.ARTICLE.ASIDE.AUDIO.BLOCKQUOTE.BODY.CANVAS.CENTER.DD.DIR.DIV.DL.DT.FIELDSET.FIGCAPTION.FIGURE.FOOTER.FORM.FRAMESET.H1.H2.H3.H4.H5.H6.HEADER.HGROUP.HR.HTML.ISINDEX.LI.MAIN.MENU.NAV.NOFRAMES.NOSCRIPT.OL.OUTPUT.P.PRE.SECTION.TABLE.TBODY.TD.TFOOT.TH.THEAD.TR.UL`.split(`.`);function Mc(e){return zc(e,jc)}var Nc=[`AREA`,`BASE`,`BR`,`COL`,`COMMAND`,`EMBED`,`HR`,`IMG`,`INPUT`,`KEYGEN`,`LINK`,`META`,`PARAM`,`SOURCE`,`TRACK`,`WBR`];function Pc(e){return zc(e,Nc)}function Fc(e){return Bc(e,Nc)}var Ic=[`A`,`TABLE`,`THEAD`,`TBODY`,`TFOOT`,`TH`,`TD`,`IFRAME`,`SCRIPT`,`AUDIO`,`VIDEO`];function Lc(e){return zc(e,Ic)}function Rc(e){return Bc(e,Ic)}function zc(e,t){return t.indexOf(e.nodeName)>=0}function Bc(e,t){return e.getElementsByTagName&&t.some(function(t){return e.getElementsByTagName(t).length})}var $={};$.paragraph={filter:`p`,replacement:function(e){return`

`+e+`

`}},$.lineBreak={filter:`br`,replacement:function(e,t,n){return n.br+`
`}},$.heading={filter:[`h1`,`h2`,`h3`,`h4`,`h5`,`h6`],replacement:function(e,t,n){var r=Number(t.nodeName.charAt(1));if(n.headingStyle===`setext`&&r<3){var i=Dc(r===1?`=`:`-`,e.length);return`

`+e+`
`+i+`

`}return`

`+Dc(`#`,r)+` `+e+`

`}},$.blockquote={filter:`blockquote`,replacement:function(e){return e=Ac(e).replace(/^/gm,`> `),`

`+e+`

`}},$.list={filter:[`ul`,`ol`],replacement:function(e,t){var n=t.parentNode;return n.nodeName===`LI`&&n.lastElementChild===t?`
`+e:`

`+e+`

`}},$.listItem={filter:`li`,replacement:function(e,t,n){var r=n.bulletListMarker+`   `,i=t.parentNode;if(i.nodeName===`OL`){var a=i.getAttribute(`start`),o=Array.prototype.indexOf.call(i.children,t);r=(a?Number(a)+o:o+1)+`.  `}var s=/\n$/.test(e);return e=Ac(e)+(s?`
`:``),e=e.replace(/\n/gm,`
`+` `.repeat(r.length)),r+e+(t.nextSibling?`
`:``)}},$.indentedCodeBlock={filter:function(e,t){return t.codeBlockStyle===`indented`&&e.nodeName===`PRE`&&e.firstChild&&e.firstChild.nodeName===`CODE`},replacement:function(e,t,n){return`

    `+t.firstChild.textContent.replace(/\n/g,`
    `)+`

`}},$.fencedCodeBlock={filter:function(e,t){return t.codeBlockStyle===`fenced`&&e.nodeName===`PRE`&&e.firstChild&&e.firstChild.nodeName===`CODE`},replacement:function(e,t,n){for(var r=((t.firstChild.getAttribute(`class`)||``).match(/language-(\S+)/)||[null,``])[1],i=t.firstChild.textContent,a=n.fence.charAt(0),o=3,s=RegExp(`^`+a+`{3,}`,`gm`),c;c=s.exec(i);)c[0].length>=o&&(o=c[0].length+1);var l=Dc(a,o);return`

`+l+r+`
`+i.replace(/\n$/,``)+`
`+l+`

`}},$.horizontalRule={filter:`hr`,replacement:function(e,t,n){return`

`+n.hr+`

`}},$.inlineLink={filter:function(e,t){return t.linkStyle===`inlined`&&e.nodeName===`A`&&e.getAttribute(`href`)},replacement:function(e,t){var n=t.getAttribute(`href`);n&&=n.replace(/([()])/g,`\\$1`);var r=Vc(t.getAttribute(`title`));return r&&=` "`+r.replace(/"/g,`\\"`)+`"`,`[`+e+`](`+n+r+`)`}},$.referenceLink={filter:function(e,t){return t.linkStyle===`referenced`&&e.nodeName===`A`&&e.getAttribute(`href`)},replacement:function(e,t,n){var r=t.getAttribute(`href`),i=Vc(t.getAttribute(`title`));i&&=` "`+i+`"`;var a,o;switch(n.linkReferenceStyle){case`collapsed`:a=`[`+e+`][]`,o=`[`+e+`]: `+r+i;break;case`shortcut`:a=`[`+e+`]`,o=`[`+e+`]: `+r+i;break;default:var s=this.references.length+1;a=`[`+e+`][`+s+`]`,o=`[`+s+`]: `+r+i}return this.references.push(o),a},references:[],append:function(e){var t=``;return this.references.length&&(t=`

`+this.references.join(`
`)+`

`,this.references=[]),t}},$.emphasis={filter:[`em`,`i`],replacement:function(e,t,n){return e.trim()?n.emDelimiter+e+n.emDelimiter:``}},$.strong={filter:[`strong`,`b`],replacement:function(e,t,n){return e.trim()?n.strongDelimiter+e+n.strongDelimiter:``}},$.code={filter:function(e){var t=e.previousSibling||e.nextSibling,n=e.parentNode.nodeName===`PRE`&&!t;return e.nodeName===`CODE`&&!n},replacement:function(e){if(!e)return``;e=e.replace(/\r?\n|\r/g,` `);for(var t=/^`|^ .*?[^ ].* $|`$/.test(e)?` `:``,n="`",r=e.match(/`+/gm)||[];r.indexOf(n)!==-1;)n+="`";return n+t+e+t+n}},$.image={filter:`img`,replacement:function(e,t){var n=Vc(t.getAttribute(`alt`)),r=t.getAttribute(`src`)||``,i=Vc(t.getAttribute(`title`)),a=i?` "`+i+`"`:``;return r?`![`+n+`](`+r+a+`)`:``}};function Vc(e){return e?e.replace(/(\n+\s*)+/g,`
`):``}function Hc(e){for(var t in this.options=e,this._keep=[],this._remove=[],this.blankRule={replacement:e.blankReplacement},this.keepReplacement=e.keepReplacement,this.defaultRule={replacement:e.defaultReplacement},this.array=[],e.rules)this.array.push(e.rules[t])}Hc.prototype={add:function(e,t){this.array.unshift(t)},keep:function(e){this._keep.unshift({filter:e,replacement:this.keepReplacement})},remove:function(e){this._remove.unshift({filter:e,replacement:function(){return``}})},forNode:function(e){if(e.isBlank)return this.blankRule;var t;return(t=Uc(this.array,e,this.options))||(t=Uc(this._keep,e,this.options))||(t=Uc(this._remove,e,this.options))?t:this.defaultRule},forEach:function(e){for(var t=0;t<this.array.length;t++)e(this.array[t],t)}};function Uc(e,t,n){for(var r=0;r<e.length;r++){var i=e[r];if(Wc(i,t,n))return i}}function Wc(e,t,n){var r=e.filter;if(typeof r==`string`){if(r===t.nodeName.toLowerCase())return!0}else if(Array.isArray(r)){if(r.indexOf(t.nodeName.toLowerCase())>-1)return!0}else if(typeof r==`function`){if(r.call(e,t,n))return!0}else throw TypeError("`filter` needs to be a string, array, or function")}function Gc(e){var t=e.element,n=e.isBlock,r=e.isVoid,i=e.isPre||function(e){return e.nodeName===`PRE`};if(!(!t.firstChild||i(t))){for(var a=null,o=!1,s=null,c=qc(s,t,i);c!==t;){if(c.nodeType===3||c.nodeType===4){var l=c.data.replace(/[ \r\n\t]+/g,` `);if((!a||/ $/.test(a.data))&&!o&&l[0]===` `&&(l=l.substr(1)),!l){c=Kc(c);continue}c.data=l,a=c}else if(c.nodeType===1)n(c)||c.nodeName===`BR`?(a&&(a.data=a.data.replace(/ $/,``)),a=null,o=!1):r(c)||i(c)?(a=null,o=!0):a&&(o=!1);else{c=Kc(c);continue}var u=qc(s,c,i);s=c,c=u}a&&(a.data=a.data.replace(/ $/,``),a.data||Kc(a))}}function Kc(e){var t=e.nextSibling||e.parentNode;return e.parentNode.removeChild(e),t}function qc(e,t,n){return e&&e.parentNode===t||n(t)?t.nextSibling||t.parentNode:t.firstChild||t.nextSibling||t.parentNode}var Jc=typeof window<`u`?window:{};function Yc(){var e=Jc.DOMParser,t=!1;try{new e().parseFromString(``,`text/html`)&&(t=!0)}catch{}return t}function Xc(){var e=function(){};return Zc()?e.prototype.parseFromString=function(e){var t=new window.ActiveXObject(`htmlfile`);return t.designMode=`on`,t.open(),t.write(e),t.close(),t}:e.prototype.parseFromString=function(e){var t=document.implementation.createHTMLDocument(``);return t.open(),t.write(e),t.close(),t},e}function Zc(){var e=!1;try{document.implementation.createHTMLDocument(``).open()}catch{Jc.ActiveXObject&&(e=!0)}return e}var Qc=Yc()?Jc.DOMParser:Xc();function $c(e,t){var n=typeof e==`string`?tl().parseFromString(`<x-turndown id="turndown-root">`+e+`</x-turndown>`,`text/html`).getElementById(`turndown-root`):e.cloneNode(!0);return Gc({element:n,isBlock:Mc,isVoid:Pc,isPre:t.preformattedCode?nl:null}),n}var el;function tl(){return el||=new Qc,el}function nl(e){return e.nodeName===`PRE`||e.nodeName===`CODE`}function rl(e,t){return e.isBlock=Mc(e),e.isCode=e.nodeName===`CODE`||e.parentNode.isCode,e.isBlank=il(e),e.flankingWhitespace=al(e,t),e}function il(e){return!Pc(e)&&!Lc(e)&&/^\s*$/i.test(e.textContent)&&!Fc(e)&&!Rc(e)}function al(e,t){if(e.isBlock||t.preformattedCode&&e.isCode)return{leading:``,trailing:``};var n=ol(e.textContent);return n.leadingAscii&&sl(`left`,e,t)&&(n.leading=n.leadingNonAscii),n.trailingAscii&&sl(`right`,e,t)&&(n.trailing=n.trailingNonAscii),{leading:n.leading,trailing:n.trailing}}function ol(e){var t=e.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);return{leading:t[1],leadingAscii:t[2],leadingNonAscii:t[3],trailing:t[4],trailingNonAscii:t[5],trailingAscii:t[6]}}function sl(e,t,n){var r,i,a;return e===`left`?(r=t.previousSibling,i=/ $/):(r=t.nextSibling,i=/^ /),r&&(r.nodeType===3?a=i.test(r.nodeValue):n.preformattedCode&&r.nodeName===`CODE`?a=!1:r.nodeType===1&&!Mc(r)&&(a=i.test(r.textContent))),a}var cl=Array.prototype.reduce,ll=[[/\\/g,`\\\\`],[/\*/g,`\\*`],[/^-/g,`\\-`],[/^\+ /g,`\\+ `],[/^(=+)/g,`\\$1`],[/^(#{1,6}) /g,`\\$1 `],[/`/g,"\\`"],[/^~~~/g,`\\~~~`],[/\[/g,`\\[`],[/\]/g,`\\]`],[/^>/g,`\\>`],[/_/g,`\\_`],[/^(\d+)\. /g,`$1\\. `]];function ul(e){if(!(this instanceof ul))return new ul(e);var t={rules:$,headingStyle:`setext`,hr:`* * *`,bulletListMarker:`*`,codeBlockStyle:`indented`,fence:"```",emDelimiter:`_`,strongDelimiter:`**`,linkStyle:`inlined`,linkReferenceStyle:`full`,br:`  `,preformattedCode:!1,blankReplacement:function(e,t){return t.isBlock?`

`:``},keepReplacement:function(e,t){return t.isBlock?`

`+t.outerHTML+`

`:t.outerHTML},defaultReplacement:function(e,t){return t.isBlock?`

`+e+`

`:e}};this.options=Ec({},t,e),this.rules=new Hc(this.options)}ul.prototype={turndown:function(e){if(!hl(e))throw TypeError(e+` is not a string, or an element/document/fragment node.`);if(e===``)return``;var t=dl.call(this,new $c(e,this.options));return fl.call(this,t)},use:function(e){if(Array.isArray(e))for(var t=0;t<e.length;t++)this.use(e[t]);else if(typeof e==`function`)e(this);else throw TypeError(`plugin must be a Function or an Array of Functions`);return this},addRule:function(e,t){return this.rules.add(e,t),this},keep:function(e){return this.rules.keep(e),this},remove:function(e){return this.rules.remove(e),this},escape:function(e){return ll.reduce(function(e,t){return e.replace(t[0],t[1])},e)}};function dl(e){var t=this;return cl.call(e.childNodes,function(e,n){n=new rl(n,t.options);var r=``;return n.nodeType===3?r=n.isCode?n.nodeValue:t.escape(n.nodeValue):n.nodeType===1&&(r=pl.call(t,n)),ml(e,r)},``)}function fl(e){var t=this;return this.rules.forEach(function(n){typeof n.append==`function`&&(e=ml(e,n.append(t.options)))}),e.replace(/^[\t\r\n]+/,``).replace(/[\t\r\n\s]+$/,``)}function pl(e){var t=this.rules.forNode(e),n=dl.call(this,e),r=e.flankingWhitespace;return(r.leading||r.trailing)&&(n=n.trim()),r.leading+t.replacement(n,e,this.options)+r.trailing}function ml(e,t){var n=kc(e),r=Oc(t),i=Math.max(e.length-n.length,t.length-r.length);return n+`

`.substring(0,i)+r}function hl(e){return e!=null&&(typeof e==`string`||e.nodeType&&(e.nodeType===1||e.nodeType===9||e.nodeType===11))}var gl=G`
    .card {
        width: min(630px, calc(100vw - 32px));
        padding: 24px;
    }

    h2 {
        margin: 0 0 8px;
        color: var(--edvibe-text-strong);
        font-size: 20px;
        line-height: 1.3;
    }

    .status {
        min-height: 40px;
        margin: 0 0 16px;
        font-size: 14px;
        line-height: 1.4;
        white-space: pre-line;
    }

    .progress {
        height: 12px;
    }

    :host([error]) .progress {
        accent-color: var(--edvibe-danger);
    }

    .meta {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin-top: 10px;
        color: var(--edvibe-text-muted);
        font-size: 12px;
    }

    .close {
        display: none;
        width: 100%;
        margin-top: 18px;
        font-size: 13px;
    }

    :host([complete]) .close,
    :host([error]) .close {
        display: block;
    }
`,_l=`edvibe-toolbox-export-progress`,vl=class extends J{static styles=[cn,ln,un,dn,mn,gl];static properties={statusText:{state:!0},loadedSections:{state:!0},totalSections:{state:!0},countText:{state:!0},progressState:{state:!0}};constructor(){super(),this.statusText=`Preparing export...`,this.loadedSections=0,this.totalSections=0,this.countText=void 0,this.progressState=`loading`}setProgress(e={}){let{statusText:t=``,loadedSections:n=0,totalSections:r=0,countText:i,state:a=`loading`}=e&&typeof e==`object`?e:{};return this.statusText=String(t||``),this.loadedSections=Number(n)||0,this.totalSections=Number(r)||0,this.countText=i,this.progressState=String(a||`loading`),this.syncHostState(),this}syncHostState(){let e=this.totalSections>0;this.toggleAttribute(`indeterminate`,!e&&this.progressState===`loading`),this.toggleAttribute(`complete`,this.progressState===`complete`),this.toggleAttribute(`error`,this.progressState===`error`)}complete(e,t){return this.setProgress({statusText:e,loadedSections:t,totalSections:t,state:`complete`})}error(e){return this.setProgress({statusText:e,state:`error`})}dismissAfter(e){let t=Number.isFinite(Number(e))?Math.max(0,Number(e)):0;setTimeout(()=>this.remove(),t)}render(){let e=this.totalSections>0,t=this.progressState===`complete`?100:e?Math.min(100,Math.round(this.loadedSections/this.totalSections*100)):0,n=this.countText??(e?`${this.loadedSections} / ${this.totalSections} sections loaded`:this.progressState===`complete`?`Export complete`:`Discovering sections...`),r=e||this.progressState===`complete`?t:q;return K`
            <div class="overlay" data-part="overlay">
                <section class="card" data-part="dialog" role="dialog" aria-modal="true" aria-labelledby="export-progress-title">
                    <h2 id="export-progress-title">Exporting marathon</h2>
                    <p class="status" data-part="status">${this.statusText}</p>
                    <progress class="progress" data-part="progress" max="100" value=${r}></progress>
                    <div class="meta">
                        <span class="count">${n}</span>
                        <span class="percent">${t}%</span>
                    </div>
                    <button class="close" data-control type="button" @click=${()=>this.remove()}>Close</button>
                </section>
            </div>
        `}};customElements.get(`edvibe-toolbox-export-progress`)||customElements.define(_l,vl);var yl=/[\\/:*?"<>|]/g;function bl(e,t=`untitled`){return String(e||``).replace(yl,``).replace(/\s+/g,` `).trim().replace(/\.+$/,``)||t}function xl(e,t,n=`untitled`){let r=bl(e,n);if(!t.has(r))return t.add(r),r;let i=2;for(;t.has(`${r} (${i})`);)i+=1;return r=`${r} (${i})`,t.add(r),r}function Sl(){let e=new ul({headingStyle:`atx`,bulletListMarker:`-`,codeBlockStyle:`fenced`,emDelimiter:`*`,strongDelimiter:`**`,br:`
`});return e.addRule(`stripInlineStyles`,{filter:[`span`,`font`],replacement:e=>e}),e.addRule(`hideExerciseIds`,{filter:e=>e.nodeName===`EM`&&e.classList?.contains(`hide-id-exercise-item`),replacement:()=>``}),e}function Cl(e){return e?String(e).replace(/<br\s+style="[^"]*"\s*\/?>/gi,`<br>`).replace(/&nbsp;/gi,` `).replace(/\u00A0/g,` `).replace(/(<br\s*\/?>\s*){3,}/gi,`<br><br>`):``}function wl(e){return e.replace(/[ \t]+\n/g,`
`).replace(/\n{3,}/g,`

`).trim()}function Tl(e,t,n){let r=Cl(e);if(!r.trim())return``;try{return wl(t.turndown(r))}catch(e){return n.log(`HTML conversion failed, falling back to plain text:`,e),r.replace(/<[^>]+>/g,``).trim()}}function El(e){try{let t=new URL(e).pathname.split(`.`).pop()?.toLowerCase();if(t&&/^[a-z0-9]{2,5}$/.test(t))return t}catch{}return`jpg`}async function Dl(e,t,n,r,i){if(!e)return null;if(r.has(e))return r.get(e);let a=`${t||`img`}_${crypto.randomUUID().slice(0,8)}.${El(e)}`,o=`./images/${a}`;try{let t=await fetch(e);if(!t.ok)throw Error(`HTTP ${t.status}`);let i=await t.blob();return n.file(a,i),r.set(e,o),o}catch(t){return i.log(`Image fetch failed for ${e}:`,t.message),r.set(e,e),e}}async function Ol(e,t,n,r){let i=e.UrlFull||e.Url;return i?`![Illustration](${await Dl(i,e.ImageId||e.ImageFullId,t,n,r)})`:``}async function kl(e,t){let n=[],r=e.Descriptions||[],i=e.Images||[],a=Math.max(r.length,i.length);for(let e=0;e<a;e+=1){let a=r[e];a&&a.trim()&&n.push(t.htmlToMarkdown(a)),i[e]&&n.push(await Ol(i[e],t.imagesFolder,t.urlMap,t.logger))}return n.filter(Boolean).join(`

`)}function Al(e,t,n){for(let r of e||[])r.Question&&t.push(n(r.Question)),r.Text&&t.push(n(r.Text))}async function jl(e,t){let n=[];switch(e.Name&&String(e.Name).trim()&&n.push(`### ${t.htmlToMarkdown(e.Name)}`),e.Type){case 27:case 2:n.push(await kl(e,t));break;case 29:if(e.Button?.Link){let r=(e.Button.Text?t.htmlToMarkdown(e.Button.Text):e.Button.Link).replace(/\n+/g,` `).trim()||`Open link`;n.push(`[${r}](${e.Button.Link})`)}break;case 10:case 13:Al(e.QuestionWithCodingTexts,n,t.htmlToMarkdown);break;case 3:for(let r of e.Videos||[]){if(!r.Link)continue;let e=(r.Text?t.htmlToMarkdown(r.Text):`Watch video`).replace(/\n+/g,` `).trim()||`Watch video`;n.push(`[${e}](${r.Link})`)}break;default:Al(e.QuestionWithCodingTexts,n,t.htmlToMarkdown);for(let r of e.Descriptions||[])r&&r.trim()&&n.push(t.htmlToMarkdown(r));if(e.Button?.Link){let r=(e.Button.Text?t.htmlToMarkdown(e.Button.Text):e.Button.Link).replace(/\n+/g,` `).trim()||`Open link`;n.push(`[${r}](${e.Button.Link})`)}for(let t of e.Videos||[])t.Link&&n.push(`[${t.Text||`Watch video`}](${t.Link})`);for(let r of e.Images||[])n.push(await Ol(r,t.imagesFolder,t.urlMap,t.logger));e.Text&&n.push(t.htmlToMarkdown(e.Text)),n.length===0&&t.logger.log(`Unhandled item Type ${e.Type} (Id: ${e.Id})`)}for(let t of e.Pdfs||[]){let e=t.Url||t.Link;e&&n.push(`[${t.Name||t.Text||`PDF document`}](${e})`)}return n.filter(Boolean).join(`

`)}function Ml(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n)}async function Nl(e,t={}){let n=t.logger||{log(){}};if(!e||!Array.isArray(e.lessons))throw Error(`Invalid backup data: expected an object with a lessons array.`);n.log(`Starting marathon workspace compilation...`);let r=new Tc.default,i=Sl(),a=`marathon_${e.marathonId||`export`}`,o=r.folder(a),s=`edvibe_marathon_${e.marathonId||`export`}_backup.json`;o.file(s,JSON.stringify(e,null,2));let c=new Set,l=e.lessons.length;for(let[r,a]of e.lessons.entries()){t.onProgress?.({message:`Processing lesson ${r+1} of ${l}: ${a.name}`,current:r+1,total:l});let e=xl(a.name,c,`lesson_${a.lessonId}`),s=o.folder(e),u=s.folder(`images`),d=new Set,f={turndown:i,imagesFolder:u,urlMap:new Map,logger:n,htmlToMarkdown:e=>Tl(e,i,n)};a.imageUrl&&await Dl(a.imageUrl,`lesson_${a.lessonId}`,u,f.urlMap,n);for(let[e,t]of(a.sections||[]).entries()){let n=`${xl(`${e+1} - ${t.name}`,d,`section_${t.sectionId}`)}.md`,r=[`# ${t.name}`];t.isHomework&&r.push(`> Homework section`),r.push(``);for(let e of t.items||[]){if(e.IsHideExercise)continue;let t=await jl(e,f);t&&(r.push(t),r.push(`---`))}for(;r.length&&r[r.length-1]===`---`;)r.pop();r.length<=2&&r.push(`_No content in this section._`),s.file(n,`${r.join(`

`).trim()}\n`)}}o.file(`_export_meta.json`,JSON.stringify({exportedAt:e.exportedAt,marathonId:e.marathonId,totalLessons:e.totalLessons,compiledAt:new Date().toISOString()},null,2)),t.onProgress?.({message:`Compressing archive...`});let u=await r.generateAsync({type:`blob`,compression:`DEFLATE`,compressionOptions:{level:6}}),d=`edvibe_marathon_${e.marathonId||`export`}_workspace.zip`;return Ml(u,d),n.log(`Marathon workspace archive downloaded:`,d),u}function Pl(e){let t=String(e||``).match(/marathon\/(\d+)/);return t?Number(t[1]):null}function Fl(){document.querySelector(_l)?.remove();let e=document.createElement(_l);return(document.body||document.documentElement).appendChild(e),e}function Il({transport:e,operationGuard:t,logger:n}){return Rl({sendRequest:e.sendRequest,canStart:t.canStart,onActiveChange:t.guardedActiveChange(`export`),notifyStatus:(e,t=``)=>{window.postMessage(Ae(e,t),`*`)},logger:n.createChildLogger(`Export`),compileToZip:(e,t)=>Nl(e,{...t,logger:n.createChildLogger(`Zip`)})})}var Ll=Object.freeze({type:W.START_EXPORT,create(e){let t=Il(e);return()=>t.start()}});function Rl({sendRequest:e,canStart:t,onActiveChange:n,compileToZip:r=Nl,notifyStatus:i,createProgressOverlay:a=Fl,getCurrentUrl:o=()=>window.location.href,now:s=()=>new Date().toISOString(),logger:c={log(){}}}){async function l(){if(!t()){let e=`Cannot start export while another operation is active.`;c.log(e),i(`error`,e);return}n(!0);let l=null;try{i(`started`),c.log(`Starting marathon export...`),l=a(),l.setProgress({statusText:`Finding marathon lessons...`,loadedSections:0,totalSections:0});let t=Pl(o());if(!t){l.error(`Failed to find a valid MarathonId in the current page URL.`),i(`error`,`Invalid marathon URL.`);return}let n={exportedAt:s(),marathonId:t,totalLessons:0,lessons:[]},u=(await e(`MarathonLessonWsController`,`GetMarathonLessonsPagination`,`Marathons`,{MarathonId:t,SearchTerm:``,Page:{Skip:0,Take:100}})).Value?.Items||[];n.totalLessons=u.length,l.setProgress({statusText:`Found ${u.length} lessons. Loading lesson sections...`,loadedSections:0,totalSections:0});let d=[],f=0;for(let[t,n]of u.entries()){l.setProgress({statusText:`Loading sections for lesson ${t+1} of ${u.length}: ${n.Name}`,loadedSections:0,totalSections:0});let r=await e(`LessonWsController`,`GetLessonWithId`,`Books`,{LessonId:n.LessonId}),i=[...r.Value?.Sections||[]];r.Value?.HomeworkSection&&i.push(r.Value.HomeworkSection),f+=i.length,d.push({lessonNode:n,lessonStructure:r,sections:i})}l.setProgress({statusText:`Found ${f} sections. Loading exercise assets...`,loadedSections:0,totalSections:f});let p=0;for(let{lessonNode:t,lessonStructure:r,sections:i}of d){let a={lessonId:t.LessonId,marathonLessonId:t.MarathonLessonId,name:t.Name,imageUrl:r.Value?.ImageUrl||t.Image,sections:[]};for(let n of i){l.setProgress({statusText:`Lesson: ${t.Name}\nSection: ${n.Name}`,loadedSections:p,totalSections:f}),await Te(300);let r=await e(`GetExerciseWsController`,`LoadExercises`,`Exercises`,{IsTeacher:!0,SectionId:n.Id,LessonId:t.LessonId,LessonSection:0}),i=typeof r.Value==`string`?JSON.parse(r.Value):r.Value;a.sections.push({sectionId:n.Id,name:n.Name,isHomework:n.IsHomework||!1,items:i?.Items||[]}),p+=1,l.setProgress({statusText:`Loaded "${n.Name}" from "${t.Name}".`,loadedSections:p,totalSections:f})}n.lessons.push(a)}l.setProgress({statusText:`All sections loaded.
Processing lesson content and archiving workspace...
Downloading images — this may take a few minutes.`,loadedSections:0,totalSections:0}),await r(n,{onProgress({message:e,current:t,total:n}){let r=e===`Compressing archive...`;l.setProgress({statusText:r?`Processing lesson content and archiving workspace...
Compressing archive...`:`Processing lesson content and archiving workspace...\n${e}`,loadedSections:r?0:t||0,totalSections:r?0:n||0,countText:r?`Compressing archive...`:n?`${t} / ${n} lessons processed`:`Preparing archive...`})}}),l.complete(`ZIP workspace archive downloaded successfully.`,f),l.dismissAfter(3e3),i(`complete`)}catch(e){c.log(`Export workflow failed:`,e),l?.error(`Export failed: ${e.message}`),i(`error`,e.message)}finally{n(!1)}}return{start:l}}var zl=G`
    :host([hidden]) {
        display: none !important;
    }

    :host(.is-running) .edvibe-reset-body {
        display: none;
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
    }

    .edvibe-reset-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
    }

    .edvibe-reset-title {
        margin: 0;
        color: var(--edvibe-text-strong);
        font-size: 21px;
        line-height: 1.3;
    }

    .edvibe-reset-subtitle {
        margin: 5px 0 0;
        color: var(--edvibe-text-muted);
        font-size: 13px;
    }

    .edvibe-reset-step-indicator {
        margin-right: 8px;
        color: var(--edvibe-primary);
        font-weight: 700;
    }

    .edvibe-reset-close {
        min-width: 36px;
        padding: 0;
        font-size: 24px;
        line-height: 1;
    }

    .edvibe-reset-body {
        flex: 1 1 auto;
        overflow: auto;
        min-height: 0;
        margin-top: 18px;
    }

    .edvibe-reset-search-field {
        font-size: 13px;
    }

    .edvibe-reset-label {
        display: block;
        margin-bottom: 7px;
        color: var(--edvibe-text);
        font-size: 13px;
        font-weight: 650;
    }

    .edvibe-reset-list {
        overflow: auto;
        max-height: 250px;
        margin-top: 10px;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
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
        border-radius: var(--edvibe-radius-panel);
        background: color-mix(in srgb, var(--edvibe-surface) 72%, transparent);
        color: var(--edvibe-text);
        font-size: 13px;
        font-weight: 650;
    }

    .edvibe-reset-spinner {
        width: 22px;
        height: 22px;
        border: 3px solid var(--edvibe-info-border);
        border-top-color: var(--edvibe-primary);
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
        border-bottom: 1px solid var(--edvibe-border-subtle);
        background: var(--edvibe-surface);
        color: var(--edvibe-text);
        font: inherit;
        text-align: left;
        cursor: pointer;
    }

    .edvibe-reset-row:last-child {
        border-bottom: 0;
    }

    .edvibe-reset-row:hover,
    .edvibe-reset-row.is-selected {
        background: var(--edvibe-info-surface);
    }

    .edvibe-reset-row:focus-visible {
        outline: 3px solid var(--edvibe-focus-outline);
        outline-offset: -3px;
    }

    .edvibe-reset-row:disabled {
        cursor: not-allowed;
        opacity: .58;
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
        color: var(--edvibe-text-muted);
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

    .edvibe-reset-select-all input:disabled {
        cursor: not-allowed;
        opacity: .58;
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
    }

    .edvibe-reset-status {
        min-height: 38px;
        margin: 0;
        font-size: 13px;
        line-height: 1.4;
        white-space: pre-line;
    }

    .edvibe-reset-live-region {
        flex: 0 0 auto;
        padding-top: 16px;
    }

    .edvibe-reset-status.is-error {
        color: var(--edvibe-danger);
    }

    .edvibe-reset-status.is-success {
        color: var(--edvibe-success);
    }

    .edvibe-reset-progress {
        display: none;
        height: 11px;
        margin-top: 10px;
        accent-color: var(--edvibe-danger);
    }

    .edvibe-reset-progress.is-visible {
        display: block;
    }

    .edvibe-reset-footer {
        margin-top: 18px;
    }

    .edvibe-reset-button {
        font-size: 13px;
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
`,Bl=`edvibe-toolbox-reset-dialog`,Vl=`edvibe-toolbox-reset-overlay`,Hl=class extends J{static styles=[cn,ln,un,dn,fn,mn,hn,zl];static properties={currentStep:{state:!0},allPupils:{state:!0},pupilTotal:{state:!0},selectedPupil:{state:!0},lessons:{state:!0},selectedLessonIds:{state:!0},locked:{state:!0},loading:{state:!0},finished:{state:!0},pupilPageLoading:{state:!0},appliedSearchQuery:{state:!0},searchDebouncing:{state:!0},suppressPupilPageLoading:{state:!0},searchValue:{state:!0},statusMessage:{state:!0},statusState:{state:!0},progressVisible:{state:!0},progressIndeterminate:{state:!0},progressValue:{state:!0}};constructor(){super(),this.searchDelay=1e3,this.logger={log(){}},this.loadLessons=null,this.loadNextPupils=null,this.currentStep=`user`,this.allPupils=[],this.pupilTotal=0,this.selectedPupil=null,this.loadedPupilId=null,this.lessons=[],this.selectedLessonIds=new Set,this.locked=!1,this.loading=!1,this.finished=!1,this.closed=!1,this.pupilPagePromise=null,this.pupilPageLoading=!1,this.searchTimer=null,this.searchGeneration=0,this.appliedSearchQuery=``,this.searchDebouncing=!1,this.suppressPupilPageLoading=!1,this.searchValue=``,this.statusMessage=``,this.statusState=``,this.progressVisible=!1,this.progressIndeterminate=!1,this.progressValue=0,this.elements=null,this.handleKeydownBound=e=>this.handleKeydown(e)}connectedCallback(){super.connectedCallback(),this.id||=Vl,this.ownerDocument?.addEventListener(`keydown`,this.handleKeydownBound)}disconnectedCallback(){this.cancelSearch(),this.ownerDocument?.removeEventListener(`keydown`,this.handleKeydownBound),super.disconnectedCallback()}configure(e={}){let{searchDelay:t=1e3,loadLessons:n,loadNextPupils:r,logger:i={log(){}}}=e&&typeof e==`object`?e:{};return this.searchDelay=Number.isFinite(Number(t))?Math.max(0,Number(t)):1e3,this.loadLessons=typeof n==`function`?n:null,this.loadNextPupils=typeof r==`function`?r:null,this.logger=typeof i?.log==`function`?i:{log(){}},this}updated(){this.cacheElements()}cacheElements(){if(!this.shadowRoot){this.elements=null;return}let e=e=>this.shadowRoot.querySelector(e);this.elements={backdrop:e(`.edvibe-reset-overlay`),search:e(`.edvibe-reset-search`),userStep:e(`.edvibe-reset-user-step`),lessonStep:e(`.edvibe-reset-lesson-step`),pupilsShell:e(`.edvibe-reset-pupils-shell`),pupilsList:e(`.edvibe-reset-pupils`),pupilsLoading:e(`.edvibe-reset-pupils-loading`),lessonsList:e(`.edvibe-reset-lessons`),selectAll:e(`.edvibe-reset-select-all-input`),status:e(`.edvibe-reset-status`),progress:e(`.edvibe-reset-progress`),close:e(`.edvibe-reset-close`),cancel:e(`.edvibe-reset-cancel`),back:e(`.edvibe-reset-back`),next:e(`.edvibe-reset-next`),submit:e(`.edvibe-reset-submit`)}}normalizeSearchQuery(e){return String(e||``).trim().toLowerCase()}filterPupils(e){let t=this.normalizeSearchQuery(e);return t?this.allPupils.filter(e=>String(e.Email||``).toLowerCase().includes(t)):this.allPupils}hasMorePupils(){return this.allPupils.length<this.pupilTotal}hasLoadedLessonsForSelectedPupil(){return!!this.selectedPupil&&this.selectedPupil.PupilId===this.loadedPupilId}isPupilLoadingVisible(){return this.loading||this.pupilPageLoading&&!this.suppressPupilPageLoading}getViewState(){let e=this.loading||this.locked||this.finished;return{showingUsers:this.currentStep===`user`,nextDisabled:e||!this.selectedPupil,backDisabled:this.loading||this.locked,submitDisabled:e||!this.selectedPupil||this.selectedLessonIds.size===0,closeDisabled:this.loading||this.locked}}setStatus(e,t=``){this.statusMessage=String(e||``),this.statusState=t===`error`||t===`success`?t:``}renderState(){this.requestUpdate()}renderPupilLoadingState(){this.requestUpdate()}renderPupils(){this.requestUpdate()}selectPupil(e){this.locked||this.finished||this.isPupilLoadingVisible()||e.PupilId===this.selectedPupil?.PupilId||(e.PupilId!==this.loadedPupilId&&(this.loadedPupilId=null,this.lessons=[],this.selectedLessonIds=new Set),this.selectedPupil=e,this.setStatus(`Выбран пользователь: ${e.Email||`email отсутствует`}`))}renderLessons(){this.requestUpdate()}toggleLesson(e,t){t?this.selectedLessonIds.add(e):this.selectedLessonIds.delete(e),this.requestUpdate()}handleSelectAll(e){let t=e?.currentTarget?.checked??this.elements?.selectAll?.checked;this.selectedLessonIds=t?new Set(this.lessons.map(e=>e.MarathonLessonId)):new Set}handleSearchInput(e){this.searchValue=String(e?.currentTarget?.value??this.searchValue),this.searchGeneration+=1,this.cancelSearchTimer(),this.searchDebouncing=!0,this.suppressPupilPageLoading=!0;let t=this.normalizeSearchQuery(this.searchValue),n=this.searchGeneration;this.searchTimer=globalThis.setTimeout(async()=>{if(!this.isCurrentSearch(n,t))return;this.searchTimer=null;let e=!!(t&&this.filterPupils(t).length===0&&this.hasMorePupils());this.searchDebouncing=!1,(e||!this.pupilPageLoading)&&(this.suppressPupilPageLoading=!1),!(e&&!await this.continueSearch(n,t))&&this.isCurrentSearch(n,t)&&(this.appliedSearchQuery=t)},this.searchDelay)}isCurrentSearch(e,t){return!this.closed&&e===this.searchGeneration&&t===this.normalizeSearchQuery(this.searchValue)}cancelSearchTimer(){this.searchTimer!==null&&(globalThis.clearTimeout(this.searchTimer),this.searchTimer=null)}cancelSearch(){this.searchGeneration+=1,this.cancelSearchTimer()}async continueSearch(e,t){for(;this.isCurrentSearch(e,t)&&this.filterPupils(t).length===0&&this.hasMorePupils();)if(!await this.loadNextPupilPage())return!1;return!0}async loadNextPupilPage(){return this.closed||!this.loadNextPupils||!this.hasMorePupils()?!1:this.pupilPagePromise?this.pupilPagePromise:(this.suppressPupilPageLoading=!1,this.pupilPageLoading=!0,this.pupilPagePromise=(async()=>{try{let e=await this.loadNextPupils();return!this.closed&&(this.allPupils=Array.isArray(e?.pupils)?e.pupils:[],this.pupilTotal=Number(e?.total)||0,this.currentStep===`user`&&!this.loading&&this.setStatus(`Загружено пользователей: ${this.allPupils.length} из ${this.pupilTotal}`),!0)}catch(e){return!this.closed&&this.currentStep===`user`&&!this.loading&&(this.logger.log(`Failed to load another pupil page (${this.errorType(e)}).`),this.setStatus(e.message,`error`)),!1}finally{this.pupilPagePromise=null,this.pupilPageLoading=!1,this.searchDebouncing||(this.suppressPupilPageLoading=!1)}})(),this.pupilPagePromise)}handlePupilsScroll(e){if(this.searchDebouncing)return;let t=e?.currentTarget||this.elements?.pupilsList;t&&t.scrollHeight-t.scrollTop-t.clientHeight<=24&&this.loadNextPupilPage()}async handleNext(){if(!(this.getViewState().nextDisabled||!this.selectedPupil)){if(this.hasLoadedLessonsForSelectedPupil()){this.currentStep=`lessons`,await this.updateComplete,this.shadowRoot?.querySelector(`.edvibe-reset-lessons`)?.focus();return}if(this.loadLessons)try{this.setLoading(`Загрузка уроков для ${this.selectedPupil.Email}...`);let e=await this.loadLessons(this.selectedPupil);this.showLessons(this.selectedPupil,e)}catch(e){this.loading=!1,this.currentStep=`user`,this.logger.log(`Failed to load lessons for PupilId ${this.selectedPupil.PupilId} (${this.errorType(e)}).`),this.setStatus(e.message,`error`)}}}handleBack(){if(!this.getViewState().backDisabled){if(this.finished){this.resetForAnotherUser();return}this.currentStep=`user`,this.setStatus(`Выбран пользователь: ${this.selectedPupil?.Email||`email отсутствует`}`),this.updateComplete.then(()=>this.shadowRoot?.querySelector(`.edvibe-reset-search`)?.focus())}}handleSubmit(){this.getViewState().submitDisabled||this.dispatchEvent(new CustomEvent(`edvibe-reset-request`,{detail:{pupil:this.selectedPupil,lessons:this.lessons.filter(e=>this.selectedLessonIds.has(e.MarathonLessonId))}}))}handleBackdropClick(e){e.target===e.currentTarget&&this.close()}handleKeydown(e){e.key===`Escape`&&this.close()}close(){this.locked||this.loading||this.closed||(this.closed=!0,this.cancelSearch(),this.dispatchEvent(new CustomEvent(`edvibe-dialog-close`)),this.remove())}resetForAnotherUser(){this.finished=!1,this.currentStep=`user`,this.selectedPupil=null,this.loadedPupilId=null,this.lessons=[],this.selectedLessonIds=new Set,this.searchValue=``,this.appliedSearchQuery=``,this.cancelSearch(),this.searchDebouncing=!1,this.suppressPupilPageLoading=!1,this.progressVisible=!1,this.progressIndeterminate=!1,this.progressValue=0,this.setStatus(`Загружено пользователей: ${this.allPupils.length} из ${this.pupilTotal}`),this.updateComplete.then(()=>this.shadowRoot?.querySelector(`.edvibe-reset-search`)?.focus())}showPupils(e={}){let t=e&&typeof e==`object`?e:{},n=Array.isArray(t.pupils)?t.pupils:[],r=Number.isFinite(Number(t.total))?Number(t.total):n.length;return this.allPupils=n,this.pupilTotal=r,this.currentStep=`user`,this.loading=!1,this.setStatus(`Загружено пользователей: ${n.length} из ${r}`),this.updateComplete.then(()=>this.shadowRoot?.querySelector(`.edvibe-reset-search`)?.focus()),this}showLessons(e,t){if(!e||typeof e!=`object`)return this;let n=Array.isArray(t)?t:[],r=this.loadedPupilId!==e.PupilId;return this.selectedPupil=e,this.loadedPupilId=e.PupilId,this.lessons=n,r&&(this.selectedLessonIds=new Set),this.loading=!1,this.currentStep=`lessons`,this.setStatus(`Загружено уроков: ${n.length}`),this.updateComplete.then(()=>this.shadowRoot?.querySelector(`.edvibe-reset-lessons`)?.focus()),this}setLoading(e){this.loading=!0,this.setStatus(e)}lock(){this.locked=!0,this.classList.toggle(`is-running`,!0)}completeRun(){this.locked=!1,this.finished=!0,this.classList.toggle(`is-running`,!1)}unlockAfterRun(){this.locked=!1,this.finished=!1,this.classList.toggle(`is-running`,!1)}showDiscovery(e){this.setStatus(e),this.progressVisible=!0,this.progressIndeterminate=!0}showProgress(e={}){let t=e&&typeof e==`object`?e:{},n=Number(t.completed)||0,r=Number(t.total)||0,i=t.lesson&&typeof t.lesson==`object`?t.lesson:{},a=t.exerciseId,o=r>0?Math.round(n/r*100):100,s=a?`Упражнение ${a}`:`Удаление запроса урока`;this.setStatus(`${i.Name||``}\n${s} — ${n} / ${r}`),this.progressVisible=!0,this.progressIndeterminate=!1,this.progressValue=o}showComplete(e){this.setStatus(e,`success`),this.progressVisible=!0,this.progressIndeterminate=!1,this.progressValue=100}showError(e){this.locked||(this.loading=!1),this.setStatus(e,`error`),this.progressIndeterminate=!1}errorType(e){return typeof e?.name==`string`?e.name:`Error`}renderPupilRows(){let e=this.filterPupils(this.appliedSearchQuery);if(e.length===0)return K`<p class="edvibe-reset-empty" data-part="empty-state">Пользователи не найдены.</p>`;let t=this.isPupilLoadingVisible();return e.map(e=>{let n=e.PupilId===this.selectedPupil?.PupilId;return K`<button type="button" class=${`edvibe-reset-row${n?` is-selected`:``}`} role="option" aria-selected=${String(n)} ?disabled=${t||this.locked||this.finished} @click=${()=>this.selectPupil(e)}><span class="edvibe-reset-row-copy"><span class="edvibe-reset-row-name">${e.Name||`Без имени`}</span><span class="edvibe-reset-row-email">${e.Email||`Email отсутствует`}</span></span></button>`})}renderLessonRows(e){return this.lessons.length===0?K`<p class="edvibe-reset-empty" data-part="empty-state">Для пользователя нет уроков.</p>`:this.lessons.map(t=>K`<label class="edvibe-reset-row edvibe-reset-lesson"><input type="checkbox" .value=${String(t.MarathonLessonId)} .checked=${this.selectedLessonIds.has(t.MarathonLessonId)} ?disabled=${e} @change=${e=>this.toggleLesson(t.MarathonLessonId,e.currentTarget.checked)}><span class="edvibe-reset-row-copy"><span class="edvibe-reset-row-name">${Number(t.Number)+1}. ${t.Name}</span><span class="edvibe-reset-row-email">${t.LastRequest?`Статус последнего запроса: ${t.LastRequest.Status}`:`Нет запросов на проверку`}</span></span></label>`)}render(){let e=this.getViewState(),t=this.locked||this.loading||this.finished,n=this.isPupilLoadingVisible(),r=this.lessons.length>0&&this.selectedLessonIds.size===this.lessons.length,i=this.selectedLessonIds.size>0&&this.selectedLessonIds.size<this.lessons.length,a=`edvibe-reset-status${this.statusState===`error`?` is-error`:this.statusState===`success`?` is-success`:``}`,o=`edvibe-reset-progress${this.progressVisible?` is-visible`:``}${this.progressIndeterminate?` is-indeterminate`:``}`,s=this.progressIndeterminate?q:this.progressValue,c=this.selectedPupil?`${this.selectedPupil.Name||`Без имени`} — ${this.selectedPupil.Email||``}`:``;return K`
            <div class="edvibe-reset-overlay" data-part="overlay" @click=${this.handleBackdropClick}>
                <div class="edvibe-reset-card" data-part="dialog" role="dialog" aria-modal="true" aria-labelledby="edvibe-reset-title">
                    <div class="edvibe-reset-header"><div><h2 id="edvibe-reset-title" class="edvibe-reset-title">Сброс уроков</h2><p class="edvibe-reset-subtitle"><span class="edvibe-reset-step-indicator">${e.showingUsers?`Шаг 1 из 2`:`Шаг 2 из 2`}</span><span class="edvibe-reset-step-description">${e.showingUsers?`Выберите пользователя.`:`Выберите уроки для сброса прогресса.`}</span></p></div><button class="edvibe-reset-close" data-control="secondary" type="button" aria-label="Закрыть" ?disabled=${e.closeDisabled} @click=${()=>this.close()}>&times;</button></div>
                    <div class="edvibe-reset-body">
                        <section class="edvibe-reset-user-step" aria-label="Выбор пользователя" ?hidden=${!e.showingUsers}><div class="edvibe-reset-search-field" data-field><label class="edvibe-reset-label" for="edvibe-reset-search">Поиск по email</label><input id="edvibe-reset-search" class="edvibe-reset-search" type="search" placeholder="user@example.com" autocomplete="off" .value=${this.searchValue} ?disabled=${t} @input=${this.handleSearchInput}></div><div class=${`edvibe-reset-pupils-shell${n?` is-loading`:``}`}><div class="edvibe-reset-list edvibe-reset-pupils" role="listbox" aria-label="Пользователи марафона" aria-busy=${String(n)} .inert=${n} @scroll=${this.handlePupilsScroll}>${this.renderPupilRows()}</div><div class="edvibe-reset-pupils-loading" role="status" aria-live="polite" ?hidden=${!n}><span class="edvibe-reset-spinner" aria-hidden="true"></span><span>Загрузка пользователей...</span></div></div></section>
                        <section class="edvibe-reset-lesson-step" aria-label="Выбор уроков" ?hidden=${e.showingUsers}><div class="edvibe-reset-label edvibe-reset-selected-pupil">${c}</div><label class="edvibe-reset-select-all"><input class="edvibe-reset-select-all-input" type="checkbox" .checked=${r} .indeterminate=${i} ?disabled=${t||this.lessons.length===0} @change=${this.handleSelectAll}>Выбрать все уроки</label><div class="edvibe-reset-list edvibe-reset-lessons" aria-label="Уроки пользователя" tabindex="-1">${this.renderLessonRows(t)}</div></section>
                    </div>
                    <div class="edvibe-reset-live-region"><p class=${a} data-part="status" aria-live="polite">${this.statusMessage}</p><progress class=${o} data-part="progress" max="100" value=${s}></progress></div>
                    <div class="edvibe-reset-footer" data-part="actions"><button class="edvibe-reset-button edvibe-reset-cancel" data-control="secondary" type="button" ?disabled=${e.closeDisabled} @click=${()=>this.close()}>Закрыть</button><button class="edvibe-reset-button edvibe-reset-back" data-control="secondary" type="button" ?hidden=${e.showingUsers} ?disabled=${e.backDisabled} @click=${this.handleBack}>${this.finished?`Сбросить для другого пользователя`:`Назад`}</button><button class="edvibe-reset-button edvibe-reset-next" data-control type="button" ?hidden=${!e.showingUsers} ?disabled=${e.nextDisabled} @click=${this.handleNext}>Далее</button><button class="edvibe-reset-button edvibe-reset-submit" data-control="danger" type="button" ?hidden=${e.showingUsers} ?disabled=${e.submitDisabled} @click=${this.handleSubmit}>Сбросить прогресс</button></div>
                </div>
            </div>`}};customElements.get(`edvibe-toolbox-reset-dialog`)||customElements.define(Bl,Hl);var Ul=`edvibe-toolbox-reset-overlay`;function Wl(e){let t=String(e||``).match(/marathon\/(\d+)/);return t?Number(t[1]):null}function Gl(e){let t=Array.isArray(e?.Sections)?e.Sections.filter(Boolean):[];return e?.HomeworkSection&&t.push(e.HomeworkSection),t}function Kl(e){let t=e?.LastRequest?.Status;return!!(e?.LastRequest?.Id&&Number.isFinite(t)&&t!==0)}function ql({marathonId:e,pupilId:t,marathonLessonId:n,sectionId:r}){return{MarathonId:e,LessonId:n,SectionId:r,PupilId:t,IsTeacher:!0,LessonSection:0,Domain:`edvibe.com`}}function Jl({marathonId:e,pupilId:t,lessonId:n,exercise:r}){return{SelfSync:!1,IsReset:!0,ExerciseId:r.id,ExerciseType:r.type,SectionId:r.sectionId,PupilId:t,MarathonId:e,SingleAnswer:{},ManyAnswers:[],RepeatingManyAnswers:[],AnswerErrorsCount:[[]],StatisticsInfo:{CountAnswersTrue:0,CountAnswersFalse:0,CountAnswersPending:0},LessonId:n}}function Yl(e,t,n=50){let r=[],i=null,a=null;function o(){return{pupils:[...r],total:i,hasMore:i===null||r.length<i}}async function s(){if(i!==null&&r.length>=i)return o();let a=await e(`MarathonPupilsWsController`,`GetMarathonPupils`,`Marathons`,{MarathonId:t,Skip:r.length,Take:n}),s=a.Value?.Items,c=a.Value?.Page?.Count;if(!Array.isArray(s)||typeof c!=`number`||!Number.isInteger(c)||c<0)throw Error(`GetMarathonPupils returned an invalid response.`);if(s.length===0&&r.length<c)throw Error(`GetMarathonPupils pagination stopped before all pupils were loaded.`);return r=r.concat(s),i=c,o()}return{loadNext(){return a||(a=s().finally(()=>{a=null}),a)},getSnapshot:o}}async function Xl({sendRequest:e,wait:t,marathonId:n,pupilId:r,lessons:i,onDiscovery:a=()=>{},logger:o={log(){}}}){let s=[];for(let c of i){o.log(`Discovering lesson ${c.MarathonLessonId} (LessonId: ${c.LessonId}).`),a(`Loading sections for "${c.Name}"...`);let i=Gl((await e(`LessonWsController`,`GetLessonWithId`,`Books`,{LessonId:c.LessonId})).Value),l=[];o.log(`Lesson ${c.MarathonLessonId}: ${i.length} section(s) found.`);for(let a of i){await t(300);let i=(await e(`GetExerciseWsController`,`LoadExercises`,`Exercises`,ql({marathonId:n,pupilId:r,marathonLessonId:c.MarathonLessonId,sectionId:a.Id}))).Value?.Items;if(!Array.isArray(i))throw Error(`LoadExercises returned invalid data for "${c.Name}".`);let s=i.filter(e=>Number.isFinite(e.Id)&&Array.isArray(e.AnswerVersion1)&&e.AnswerVersion1.length>0);l.push(...s.map(e=>({id:e.Id,type:e.Type,sectionId:a.Id}))),o.log(`Lesson ${c.MarathonLessonId}, section ${a.Id}: ${s.length} of ${i.length} exercise(s) have saved answers.`)}s.push({lesson:c,exercises:l,deleteRequestId:Kl(c)?c.LastRequest.Id:null}),o.log(`Lesson ${c.MarathonLessonId}: ${l.length} exercise reset(s), ${Kl(c)?`request deletion required`:`no request deletion`}.`)}return s}async function Zl({sendRequest:e,sendWithoutResponse:t,wait:n,marathonId:r,pupilId:i,work:a,onProgress:o,logger:s={log(){}}}){let c=a.reduce((e,t)=>e+t.exercises.length,0),l=0;s.log(`Starting ${c} operation(s) for PupilId ${i} across ${a.length} lesson(s).`);for(let u of a){for(let t of u.exercises){try{if(s.log(`Resetting exercise ${t.id} for lesson ${u.lesson.MarathonLessonId} (${l+1}/${c}).`),await n(300),await e(`ExerciseAnswerSaveVersion1WsController`,`SaveAnswer`,`ExerciseAnswer`,Jl({marathonId:r,pupilId:i,lessonId:u.lesson.LessonId,exercise:t})),(await e(`MarathonStatisticService`,`DropMarathonExerciseStatistic`,`Statistic`,{MarathondId:r,PupilId:i,ExerciseId:t.id})).Value!==!0)throw Error(`server did not confirm the reset`)}catch(e){throw Error(`Failed in "${u.lesson.Name}", exercise ${t.id}: ${e.message}`,{cause:e})}l+=1,o({completed:l,total:c,lesson:u.lesson,exerciseId:t.id})}u.deleteRequestId&&t(`MarathonLessonWsController`,`DeleteMarathonLessonRequestPupil`,`Marathons`,{RequestId:u.deleteRequestId})}s.log(`Completed all ${c} operation(s) for PupilId ${i}.`)}function Ql(e){return typeof e?.name==`string`?e.name:`Error`}function $l({transport:e,operationGuard:t,logger:n}){return tu({sendRequest:e.sendRequest,sendWithoutResponse:e.sendWithoutResponse,canStart:t.canStart,onActiveChange:t.guardedActiveChange(`reset`),logger:n.createChildLogger(`Reset`)})}var eu=Object.freeze({type:W.OPEN_LESSON_RESET,create(e){let t=$l(e);return()=>t.open()}});function tu({sendRequest:e,sendWithoutResponse:t,canStart:n,onActiveChange:r,createDialog:i=()=>document.createElement(Bl),logger:a={log(){}}}){let o=!1,s=!1;function c(){s&&(s=!1,r(!1))}async function l(){if(document.getElementById(Ul))return;if(!n()){window.alert(`Another Edvibe Toolbox operation is already running.`);return}let l=Wl(window.location.href);if(!l){window.alert(`Open an Edvibe marathon page before resetting lessons.`);return}s=!0,r(!0);let u=i();u.addEventListener(`edvibe-dialog-close`,c),u.addEventListener(`edvibe-reset-request`,async n=>{let{pupil:r,lessons:i}=n.detail;if(!window.confirm(`Reset ${i.length} lesson(s) for ${r.Email}?`))return;o=!0,u.lock();let s=!1;try{u.showDiscovery(`Discovering exercises...`);let n=await Xl({sendRequest:e,wait:Te,marathonId:l,pupilId:r.PupilId,lessons:i,onDiscovery:e=>u.showDiscovery(e),logger:a});await Zl({sendRequest:e,sendWithoutResponse:t,wait:Te,marathonId:l,pupilId:r.PupilId,work:n,onProgress:e=>u.showProgress(e),logger:a}),u.showComplete(`Selected lesson progress was reset successfully.`),s=!0}catch(e){let t=i.map(e=>e.MarathonLessonId).join(`, `);a.log(`Reset stopped for PupilId ${r.PupilId}; MarathonLessonIds: ${t} (${Ql(e)}).`),u.showError(e.message)}finally{o=!1,s?u.completeRun():u.unlockAfterRun()}});try{let t=Yl(e,l);u.configure({loadNextPupils:()=>t.loadNext(),loadLessons:async t=>{a.log(`Loading lessons for PupilId ${t.PupilId}.`);let n=await e(`MarathonLessonWsController`,`GetMarathonLessonsForPupil`,`Marathons`,{PupilId:t.PupilId,MarathonId:l,SearchTerm:``,Domain:`edvibe.com`});if(!Array.isArray(n.Value))throw Error(`GetMarathonLessonsForPupil returned invalid data.`);return a.log(`Loaded ${n.Value.length} lesson(s) for PupilId ${t.PupilId}.`),n.Value},logger:a}),(document.body||document.documentElement).appendChild(u),u.setLoading(`Loading marathon pupils...`);let n=await t.loadNext();a.log(`Loaded ${n.pupils.length} of ${n.total} pupil(s) for MarathonId ${l}.`),u.showPupils({pupils:n.pupils,total:n.total})}catch(e){if(a.log(`Failed to initialize reset workflow for MarathonId ${l} (${Ql(e)}).`),typeof u.showError==`function`)u.showError(e.message);else throw c(),e}}return{open:l,isRunning:()=>o}}var nu=G`
    .dialog {
        display: flex;
        flex-direction: column;
        width: min(760px, 96vw);
        max-height: 92vh;
    }

    .dialog header,
    .dialog footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 18px 22px;
        border-bottom: 1px solid var(--edvibe-border-subtle);
    }

    .dialog footer {
        border-bottom: 0;
        border-top: 1px solid var(--edvibe-border-subtle);
    }

    .dialog h2,
    .dialog h3,
    .dialog p {
        margin: 0;
    }

    .dialog header p,
    .selection-header p {
        margin-top: 4px;
        color: var(--edvibe-text-muted);
    }

    .icon {
        min-width: 36px;
        padding: 0;
        font-size: 24px;
        line-height: 1;
    }

    .dialog main {
        display: grid;
        gap: 16px;
        overflow: auto;
        padding: 20px 22px;
    }

    .selection-panel {
        overflow: hidden;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    .selection-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 14px 16px;
        border-bottom: 1px solid var(--edvibe-border-subtle);
    }

    .selection-header h3 {
        font-size: 14px;
    }

    .selection-header p {
        max-width: 560px;
        font-size: 12px;
        line-height: 1.4;
    }

    .selection-header strong {
        flex: none;
        color: var(--edvibe-text-muted);
        font-size: 12px;
    }

    .lesson-tree,
    .section-list {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .lesson-tree {
        max-height: 420px;
        overflow: auto;
    }

    .lesson-node + .lesson-node {
        border-top: 1px solid var(--edvibe-border-subtle);
    }

    .lesson-row {
        display: grid;
        grid-template-columns: 32px minmax(0, 1fr) auto;
        align-items: center;
        min-height: 44px;
        padding: 4px 12px 4px 8px;
    }

    .expander {
        width: 28px;
        height: 28px;
        padding: 0;
        border: 0;
        border-radius: var(--edvibe-radius-control);
        color: var(--edvibe-text-muted);
        background: transparent;
        cursor: pointer;
        font: inherit;
        font-size: 20px;
        line-height: 1;
    }

    .expander:hover:not(:disabled) {
        background: var(--edvibe-surface-subtle);
    }

    .expander:focus-visible {
        outline: 2px solid var(--edvibe-focus-outline);
        outline-offset: 2px;
    }

    .lesson-check,
    .section-check {
        display: flex;
        align-items: center;
        gap: 9px;
        min-width: 0;
        cursor: pointer;
    }

    .lesson-check input,
    .section-check input {
        flex: none;
        margin: 0;
        accent-color: var(--edvibe-primary);
    }

    .lesson-title,
    .section-check span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .lesson-title {
        font-weight: 650;
    }

    .lesson-meta {
        margin-left: 12px;
        color: var(--edvibe-text-muted);
        font-size: 11px;
    }

    .lesson-children {
        padding: 0 12px 10px 40px;
    }

    .section-list {
        border-left: 1px solid var(--edvibe-border-subtle);
        padding-left: 14px;
    }

    .section-check {
        min-height: 34px;
        padding: 3px 0;
        color: var(--edvibe-text);
        font-size: 12px;
    }

    .tree-message {
        padding: 10px 12px;
        color: var(--edvibe-text-muted);
        font-size: 12px;
    }

    .tree-error {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    @media(max-width:640px) {
        .dialog {
            max-height: 100vh;
        }

        .dialog header,
        .dialog footer,
        .dialog main {
            padding: 14px;
        }

        .selection-header {
            display: grid;
        }

        .lesson-row {
            padding-right: 8px;
        }

        .lesson-children {
            padding-left: 32px;
        }
    }
`,ru=`edvibe-toolbox-video-attachment-dialog`;function iu(e){return Object.freeze({...e,expanded:!1,loading:!1,error:``,sections:null,selectedSectionIds:Object.freeze([])})}var au=class extends J{static styles=[cn,ln,un,dn,fn,pn,nu];static properties={options:{state:!0},lessons:{state:!0},loadingLessons:{state:!0},loadError:{state:!0},videoUrl:{state:!0},busy:{state:!0},statusMessage:{state:!0},statusKind:{state:!0}};constructor(){super(),this.options=null,this.lessons=[],this.loadingLessons=!1,this.loadError=``,this.videoUrl=``,this.busy=!1,this.statusMessage=``,this.statusKind=``,this.sectionLoadPromises=new Map}configure(e={}){return this.options=e&&typeof e==`object`?e:{},this.lessons=(this.options.lessons||[]).map(iu),this.loadingLessons=!!this.options.loadingLessons,this.loadError=``,this.videoUrl=``,this.busy=!1,this.statusMessage=``,this.statusKind=``,this.sectionLoadPromises.clear(),this}setLessons(e){this.lessons=(e||[]).map(iu),this.loadingLessons=!1,this.loadError=``}setLoadError(e){this.loadingLessons=!1,this.loadError=e?.message||`Failed to load marathon lessons.`}showStatus(e,t=``){this.statusMessage=String(e||``),this.statusKind=t}getLesson(e){return this.lessons.find(t=>t.lessonId===Number(e))}updateLesson(e,t){let n=Number(e);this.lessons=this.lessons.map(e=>{if(e.lessonId!==n)return e;let r=typeof t==`function`?t(e):{...e,...t};return Object.freeze(r)})}async ensureSections(e){let t=this.getLesson(e);if(t?.sections)return t.sections;if(this.sectionLoadPromises.has(e))return this.sectionLoadPromises.get(e);this.updateLesson(e,e=>({...e,loading:!0,error:``}));let n=Promise.resolve(this.options?.onLoadSections?.(e)).then(t=>{let n=Object.freeze((t||[]).map(Object.freeze));return this.updateLesson(e,e=>({...e,loading:!1,error:``,sections:n})),n}).catch(t=>{throw this.updateLesson(e,e=>({...e,loading:!1,error:t?.message||`Failed to load lesson sections.`,sections:null})),t}).finally(()=>{this.sectionLoadPromises.delete(e)});return this.sectionLoadPromises.set(e,n),n}async toggleExpanded(e){if(this.busy)return;let t=this.getLesson(e);if(!t)return;let n=!t.expanded;if(this.updateLesson(e,{...t,expanded:n}),n&&!t.sections)try{await this.ensureSections(e)}catch{}}async setLessonSelected(e,t){if(!this.busy){if(!t){this.updateLesson(e,e=>({...e,selectedSectionIds:Object.freeze([])}));return}try{let t=await this.ensureSections(e);this.updateLesson(e,e=>({...e,selectedSectionIds:pu(t)}))}catch{this.showStatus(`Could not select the lesson because its sections failed to load.`,`danger`)}}}setSectionSelected(e,t,n){if(this.busy)return;let r=Number(t);this.updateLesson(e,e=>{let t=new Set(e.selectedSectionIds);return n?t.add(r):t.delete(r),{...e,selectedSectionIds:Object.freeze([...t])}})}selectedTargets(){return this.lessons.flatMap(e=>{let t=new Set(e.selectedSectionIds);return(e.sections||[]).filter(({sectionId:e})=>t.has(e)).map(t=>Object.freeze({lessonId:e.lessonId,lessonNumber:e.number,lessonName:e.name,sectionId:t.sectionId,sectionName:t.name}))})}applyResult(e){let t=new Set((e?.results||[]).filter(e=>e.status===`attached`).map(e=>e.sectionId));t.size!==0&&(this.lessons=this.lessons.map(e=>Object.freeze({...e,selectedSectionIds:Object.freeze(e.selectedSectionIds.filter(e=>!t.has(e)))})))}async attach(){if(this.busy)return;let e=this.selectedTargets();if(!this.videoUrl.trim()){this.showStatus(`Enter a YouTube video URL.`,`danger`);return}if(e.length===0){this.showStatus(`Select at least one lesson section.`,`danger`);return}this.busy=!0,this.showStatus(`Attaching video to ${e.length} section${e.length===1?``:`s`}…`);try{let t=await this.options?.onAttach?.({youtubeUrl:this.videoUrl,targets:e,onProgress:({current:e,total:t})=>{this.showStatus(`Attaching video ${e}/${t}…`)}});this.applyResult(t);let n=t?.summary||{};(n.failed||0)===0&&(n.notAttempted||0)===0?this.showStatus(`Video attached to ${n.successful||0} section${n.successful===1?``:`s`}.`,`success`):this.showStatus(`Attached: ${n.successful||0}. Failed: ${n.failed||0}. Not attempted: ${n.notAttempted||0}. Failed targets remain selected.`,`warning`)}catch(e){this.showStatus(e.message||`Failed to attach the video.`,`danger`)}finally{this.busy=!1}}close(){this.busy||this.options?.onClose?.()}renderLesson(e){let t=fu(e.sections||[],e.selectedSectionIds),n=Array.isArray(e.sections);return K`
            <li class="lesson-node">
                <div class="lesson-row">
                    <button class="expander" type="button"
                        aria-label=${e.expanded?`Collapse lesson`:`Expand lesson`}
                        aria-expanded=${String(e.expanded)}
                        ?disabled=${this.busy}
                        @click=${()=>this.toggleExpanded(e.lessonId)}>
                        ${e.expanded?`⌄`:`›`}
                    </button>
                    <label class="lesson-check">
                        <input type="checkbox"
                            .checked=${t.checked}
                            .indeterminate=${t.indeterminate}
                            ?disabled=${this.busy||e.loading||n&&t.sectionCount===0}
                            @change=${t=>{this.setLessonSelected(e.lessonId,t.currentTarget.checked)}}>
                        <span class="lesson-title">#${e.number} ${e.name}</span>
                    </label>
                    ${e.loading?K`<span class="lesson-meta">Loading…</span>`:n?K`<span class="lesson-meta">${t.selectedCount}/${t.sectionCount}</span>`:q}
                </div>
                ${e.expanded?K`
                    <div class="lesson-children">
                        ${e.loading?K`<p class="tree-message">Loading sections…</p>`:e.error?K`
                                    <div class="tree-error" data-notice="danger">
                                        <span>${e.error}</span>
                                        <button data-control="secondary" type="button" ?disabled=${this.busy}
                                            @click=${()=>this.ensureSections(e.lessonId).catch(()=>{})}>
                                            Retry
                                        </button>
                                    </div>
                                `:n&&e.sections.length===0?K`<p class="tree-message">No sections in this lesson.</p>`:K`
                                        <ul class="section-list">
                                            ${(e.sections||[]).map(t=>K`
                                                <li>
                                                    <label class="section-check">
                                                        <input type="checkbox"
                                                            .checked=${e.selectedSectionIds.includes(t.sectionId)}
                                                            ?disabled=${this.busy}
                                                            @change=${n=>this.setSectionSelected(e.lessonId,t.sectionId,n.currentTarget.checked)}>
                                                        <span>${t.name}</span>
                                                    </label>
                                                </li>
                                            `)}
                                        </ul>
                                    `}
                    </div>
                `:q}
            </li>
        `}render(){let e=this.selectedTargets().length;return K`
            <div class="overlay" data-part="overlay">
                <section class="dialog" data-part="dialog" role="dialog" aria-modal="true" aria-labelledby="title">
                    <header>
                        <div>
                            <h2 id="title">Attach YouTube video</h2>
                            <p>Add the same video to selected sections across marathon lessons.</p>
                        </div>
                        <button class="icon" data-control="secondary" type="button" aria-label="Close"
                            ?disabled=${this.busy} @click=${()=>this.close()}>×</button>
                    </header>
                    <main>
                        <label data-field>
                            <span>YouTube video URL</span>
                            <input type="url" inputmode="url" autocomplete="off"
                                placeholder="https://youtu.be/…"
                                .value=${this.videoUrl}
                                ?disabled=${this.busy}
                                @input=${e=>{this.videoUrl=e.currentTarget.value}}>
                            <span data-part="help">The original YouTube URL is attached to every selected section.</span>
                        </label>

                        <section class="selection-panel">
                            <div class="selection-header">
                                <div>
                                    <h3>Lessons and sections</h3>
                                    <p>Selecting a lesson selects all of its sections. Expand a lesson to choose individual sections.</p>
                                </div>
                                <strong>${e} selected</strong>
                            </div>

                            ${this.loadingLessons?K`<p class="tree-message">Loading marathon lessons…</p>`:this.loadError?K`<div data-notice="danger">${this.loadError}</div>`:K`
                                        <ul class="lesson-tree">
                                            ${this.lessons.map(e=>this.renderLesson(e))}
                                        </ul>
                                    `}
                        </section>

                        <div data-notice=${this.statusKind||`info`} role="status" aria-live="polite"
                            ?hidden=${!this.statusMessage}>${this.statusMessage}</div>
                    </main>
                    <footer data-part="actions">
                        <button data-control="secondary" type="button" ?disabled=${this.busy}
                            @click=${()=>this.close()}>Close</button>
                        <button data-control type="button"
                            ?disabled=${this.busy||!this.videoUrl.trim()||e===0}
                            @click=${()=>this.attach()}>
                            ${this.busy?`Attaching…`:`Attach to ${e||0} section${e===1?``:`s`}`}
                        </button>
                    </footer>
                </section>
            </div>
        `}};customElements.get(`edvibe-toolbox-video-attachment-dialog`)||customElements.define(ru,au);var ou=new Set([`SERVER_REJECTED`,`INVALID_RESPONSE`,`REQUEST_TIMEOUT`,`SEND_FAILED`]);function su(e){let t=Number(e);return Number.isSafeInteger(t)&&t>0?t:null}function cu(e,t=0){let n=su(e?.LessonId??e?.lessonId??e?.Id);if(!n)throw Y(`INVALID_LESSON`,`Edvibe returned a lesson without a valid ID.`);return Object.freeze({lessonId:n,marathonLessonId:su(e?.MarathonLessonId??e?.marathonLessonId??e?.Id),number:Number(e?.Number??e?.number??t+1),name:String(e?.Name??e?.name??`Lesson ${t+1}`)})}function lu(e){let t=e?.Value??e?.value??e;if(!t||!Array.isArray(t.Sections))throw Y(`INVALID_LESSON_RESPONSE`,`The lesson response did not contain a normal Sections array.`);return Object.freeze(t.Sections.map((e,t)=>{let n=su(e?.Id??e?.id);if(!n)return null;let r=Number(e?.SortId??e?.sortId??t);return Object.freeze({sectionId:n,name:String(e?.Name??e?.name??`Section ${t+1}`),sortId:Number.isFinite(r)?r:t})}).filter(Boolean).sort((e,t)=>e.sortId-t.sortId||e.sectionId-t.sectionId))}async function uu({sendRequest:e,marathonId:t,pageSize:n=100}){let r=await tr({sendRequest:e,marathonId:t,pageSize:n});return Object.freeze(r.map(cu))}async function du({sendRequest:e,lessonId:t}){return lu(await nr({sendRequest:e,lessonId:t}))}function fu(e=[],t=[]){let n=new Set((e||[]).map(({sectionId:e})=>Number(e))),r=(t||[]).filter(e=>n.has(Number(e))).length,i=n.size;return Object.freeze({checked:i>0&&r===i,indeterminate:r>0&&r<i,selectedCount:r,sectionCount:i})}function pu(e=[]){return Object.freeze((e||[]).map(({sectionId:e})=>Number(e)))}function mu(e){let t=String(e||``).trim();if(!t)throw Y(`VIDEO_URL_REQUIRED`,`Enter a YouTube video URL.`);let n;try{n=new URL(t)}catch{throw Y(`INVALID_VIDEO_URL`,`Enter a valid YouTube video URL.`)}if(n.protocol!==`https:`&&n.protocol!==`http:`)throw Y(`INVALID_VIDEO_URL`,`YouTube video URL must use HTTP or HTTPS.`);let r=n.hostname.toLowerCase(),i=r===`youtu.be`||r===`www.youtu.be`,a=r===`youtube.com`||r.endsWith(`.youtube.com`),o=n.pathname.split(`/`).filter(Boolean);if(!(i?o[0]:a&&(n.pathname===`/watch`&&n.searchParams.get(`v`)||[`embed`,`live`,`shorts`].includes(o[0])&&o[1])))throw Y(`INVALID_VIDEO_URL`,`Enter a direct YouTube video link.`);return t}function hu({sectionId:e,youtubeUrl:t,clientTime:n=new Date().toISOString()}){let r=su(e);if(!r)throw Y(`INVALID_SECTION_ID`,`The target lesson section ID is invalid.`);let i=mu(t);return Object.freeze({controller:`SaveExerciseWsController`,method:`SaveExercise`,projectName:`Exercises`,value:Object.freeze({ClassId:null,Domain:`edvibe.com`,ExerciseView:Object.freeze({Id:0,Number:0,Name:``,IsHidePupil:!1,Type:3,HomeworkLessonId:null,PersonalMaterialId:null,LessonSectionId:r,Videos:Object.freeze([Object.freeze({Link:i,Text:``})])}),AiUsed:!1,UsedNewConstructor:!0,ClientTime:String(n),DeviceType:`desktop`})})}async function gu({sendRequest:e,sectionId:t,youtubeUrl:n,clientTime:r}){if(typeof e!=`function`)throw TypeError(`sendRequest is required.`);let i=hu({sectionId:t,youtubeUrl:n,clientTime:r}),a=await e(i.controller,i.method,i.projectName,i.value),o=a?.Value??a?.value,s=su(o?.Id??o?.id),c=su(o?.LessonSectionId??o?.lessonSectionId);if(!o||Number(o?.Type??o?.type)!==3||!s||c!==i.value.ExerciseView.LessonSectionId)throw Y(`INVALID_RESPONSE`,`Edvibe did not confirm the created video exercise.`);return Object.freeze({exerciseId:s,sectionId:c,youtubeUrl:i.value.ExerciseView.Videos[0].Link})}function _u(e){let t=[],n=new Set;for(let r of e||[]){let e=su(r?.lessonId),i=su(r?.sectionId);if(!e||!i)throw Y(`INVALID_TARGET`,`Every selected target must contain valid lesson and section IDs.`);n.has(i)||(n.add(i),t.push(Object.freeze({lessonId:e,lessonNumber:Number(r?.lessonNumber??0),lessonName:String(r?.lessonName??`Lesson ${e}`),sectionId:i,sectionName:String(r?.sectionName??`Section ${i}`)})))}if(t.length===0)throw Y(`TARGET_REQUIRED`,`Select at least one lesson section.`);return Object.freeze(t)}function vu(e,t){return e?.code===`WS_UNAVAILABLE`||e?.code===`SEND_FAILED`&&(!t||!t().isOpen)||!ou.has(e?.code)}async function yu({targets:e,youtubeUrl:t,sendRequest:n,wait:r=async()=>{},getConnectionState:i,requestDelayMs:a=250,onProgress:o=()=>{}}){let s=mu(t),c=_u(e),l=[],u=null;for(let[e,t]of c.entries()){if(u){l.push(Object.freeze({...t,status:`not_attempted`,code:`OPERATION_INTERRUPTED`,message:`Not attempted because the batch operation stopped.`}));continue}try{let e=await gu({sendRequest:n,sectionId:t.sectionId,youtubeUrl:s});l.push(Object.freeze({...t,...e,status:`attached`,code:`ATTACHED`,message:`Video attached.`}))}catch(e){l.push(Object.freeze({...t,status:`failed`,code:e.code||`ATTACH_FAILED`,message:e.message||`Failed to attach the video.`})),vu(e,i)&&(u=e)}o({current:e+1,total:c.length,target:t,results:[...l]}),e<c.length-1&&a>0&&!u&&await r(a)}let d=l.filter(e=>e.status===`attached`).length,f=l.filter(e=>e.status===`failed`).length,p=l.filter(e=>e.status===`not_attempted`).length;return Object.freeze({youtubeUrl:s,targets:c,results:Object.freeze(l),fatalError:u,summary:Object.freeze({requested:c.length,successful:d,failed:f,notAttempted:p})})}function bu({transport:e,operationGuard:t,logger:n}){return Su({sendRequest:e.sendRequest,getConnectionState:e.getConnectionState,canStart:t.canStart,onActiveChange:t.guardedActiveChange(`video-attachment`),createDialog:()=>document.createElement(ru),getLocationHref:()=>window.location.href,appendDialog:e=>document.body.append(e),alertUser:e=>window.alert(e),logger:n.createChildLogger(`VideoAttachment`)})}var xu=Object.freeze({type:W.OPEN_VIDEO_ATTACHMENT,create(e){let t=bu(e);return()=>t.open()}});function Su({sendRequest:e,getConnectionState:t,canStart:n=()=>!0,onActiveChange:r=()=>{},createDialog:i,getLocationHref:a=()=>globalThis.location?.href||``,appendDialog:o=e=>globalThis.document?.body?.append(e),alertUser:s=e=>globalThis.alert?.(e),logger:c={log(){}}}){let l=!1;function u(e){e?.remove?.(),l&&(l=!1,r(!1))}function d(){if(l||!n()){s(`Another Edvibe Toolbox operation is already running.`);return}let d=Wn(a());if(!d){s(`Open an Edvibe marathon page first.`);return}l=!0,r(!0);let f;try{f=i(),f.configure({marathonId:d,lessons:[],loadingLessons:!0,async onLoadSections(t){return du({sendRequest:e,lessonId:t})},async onAttach({youtubeUrl:n,targets:r,onProgress:i}){let a=await yu({targets:r,youtubeUrl:n,sendRequest:e,getConnectionState:t,wait:Te,onProgress:i});return c.log(`Attached YouTube video to ${a.summary.successful}/${a.summary.requested} selected sections.`),a},onClose(){u(f)}}),o(f),uu({sendRequest:e,marathonId:d}).then(e=>{l&&f.setLessons(e)}).catch(e=>{l&&f.setLoadError(e)})}catch(e){throw u(f),e}}return Object.freeze({open:d})}var Cu=[kn,li,Ha,Ao,ds,lc,wc,Ll,eu,xu],wu=class e{constructor({namespace:e,namespaces:t=null}){this.namespaces=t??[Tu(e)],this.log=this.log.bind(this),this.createChildLogger=this.createChildLogger.bind(this)}log(...e){console.log(this.namespaces.map(e=>`[${e}]`).join(``),...e)}createChildLogger(t){return new e({namespaces:[...this.namespaces,Tu(t)]})}};function Tu(e){if(typeof e!=`string`||!e.trim())throw Error(`Namespace must be a non-empty string.`);return e}var Eu=new wu({namespace:`MAIN`});Eu.log(`Initializing Toolbox modules...`);var Du=new Ye({logger:Eu,features:Cu});window.addEventListener(`message`,({source:e,data:t})=>{e===window&&Du.dispatch(t)}),Eu.log(`Toolbox modules ready.`)})();