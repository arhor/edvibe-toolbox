(function() {
	//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	//#endregion
	//#region node_modules/@lit/reactive-element/css-tag.js
	/**
	* @license
	* Copyright 2019 Google LLC
	* SPDX-License-Identifier: BSD-3-Clause
	*/
	var t$1 = globalThis;
	var e$2 = t$1.ShadowRoot && (void 0 === t$1.ShadyCSS || t$1.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
	var s$2 = Symbol();
	var o$3 = /* @__PURE__ */ new WeakMap();
	var n$2 = class {
		constructor(t, e, o) {
			if (this._$cssResult$ = !0, o !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
			this.cssText = t, this.t = e;
		}
		get styleSheet() {
			let t = this.o;
			const s = this.t;
			if (e$2 && void 0 === t) {
				const e = void 0 !== s && 1 === s.length;
				e && (t = o$3.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), e && o$3.set(s, t));
			}
			return t;
		}
		toString() {
			return this.cssText;
		}
	};
	var r$2 = (t) => new n$2("string" == typeof t ? t : t + "", void 0, s$2);
	var i$3 = (t, ...e) => {
		return new n$2(1 === t.length ? t[0] : e.reduce((e, s, o) => e + ((t) => {
			if (!0 === t._$cssResult$) return t.cssText;
			if ("number" == typeof t) return t;
			throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
		})(s) + t[o + 1], t[0]), t, s$2);
	};
	var S$1 = (s, o) => {
		if (e$2) s.adoptedStyleSheets = o.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
		else for (const e of o) {
			const o = document.createElement("style"), n = t$1.litNonce;
			void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
		}
	};
	var c$2 = e$2 ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((t) => {
		let e = "";
		for (const s of t.cssRules) e += s.cssText;
		return r$2(e);
	})(t) : t;
	//#endregion
	//#region node_modules/@lit/reactive-element/reactive-element.js
	/**
	* @license
	* Copyright 2017 Google LLC
	* SPDX-License-Identifier: BSD-3-Clause
	*/ var { is: i$2, defineProperty: e$1, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$1, getOwnPropertySymbols: o$2, getPrototypeOf: n$1 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t, s) => t, u$1 = {
		toAttribute(t, s) {
			switch (s) {
				case Boolean:
					t = t ? l$1 : null;
					break;
				case Object:
				case Array: t = null == t ? t : JSON.stringify(t);
			}
			return t;
		},
		fromAttribute(t, s) {
			let i = t;
			switch (s) {
				case Boolean:
					i = null !== t;
					break;
				case Number:
					i = null === t ? null : Number(t);
					break;
				case Object:
				case Array: try {
					i = JSON.parse(t);
				} catch (t) {
					i = null;
				}
			}
			return i;
		}
	}, f$1 = (t, s) => !i$2(t, s), b$1 = {
		attribute: !0,
		type: String,
		converter: u$1,
		reflect: !1,
		useDefault: !1,
		hasChanged: f$1
	};
	Symbol.metadata ??= Symbol("metadata"), a$1.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
	var y$1 = class extends HTMLElement {
		static addInitializer(t) {
			this._$Ei(), (this.l ??= []).push(t);
		}
		static get observedAttributes() {
			return this.finalize(), this._$Eh && [...this._$Eh.keys()];
		}
		static createProperty(t, s = b$1) {
			if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
				const i = Symbol(), h = this.getPropertyDescriptor(t, i, s);
				void 0 !== h && e$1(this.prototype, t, h);
			}
		}
		static getPropertyDescriptor(t, s, i) {
			const { get: e, set: r } = h$1(this.prototype, t) ?? {
				get() {
					return this[s];
				},
				set(t) {
					this[s] = t;
				}
			};
			return {
				get: e,
				set(s) {
					const h = e?.call(this);
					r?.call(this, s), this.requestUpdate(t, h, i);
				},
				configurable: !0,
				enumerable: !0
			};
		}
		static getPropertyOptions(t) {
			return this.elementProperties.get(t) ?? b$1;
		}
		static _$Ei() {
			if (this.hasOwnProperty(d$1("elementProperties"))) return;
			const t = n$1(this);
			t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
		}
		static finalize() {
			if (this.hasOwnProperty(d$1("finalized"))) return;
			if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
				const t = this.properties, s = [...r$1(t), ...o$2(t)];
				for (const i of s) this.createProperty(i, t[i]);
			}
			const t = this[Symbol.metadata];
			if (null !== t) {
				const s = litPropertyMetadata.get(t);
				if (void 0 !== s) for (const [t, i] of s) this.elementProperties.set(t, i);
			}
			this._$Eh = /* @__PURE__ */ new Map();
			for (const [t, s] of this.elementProperties) {
				const i = this._$Eu(t, s);
				void 0 !== i && this._$Eh.set(i, t);
			}
			this.elementStyles = this.finalizeStyles(this.styles);
		}
		static finalizeStyles(s) {
			const i = [];
			if (Array.isArray(s)) {
				const e = new Set(s.flat(Infinity).reverse());
				for (const s of e) i.unshift(c$2(s));
			} else void 0 !== s && i.push(c$2(s));
			return i;
		}
		static _$Eu(t, s) {
			const i = s.attribute;
			return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
		}
		constructor() {
			super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
		}
		_$Ev() {
			this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
		}
		addController(t) {
			(this._$EO ??= /* @__PURE__ */ new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
		}
		removeController(t) {
			this._$EO?.delete(t);
		}
		_$E_() {
			const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
			for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
			t.size > 0 && (this._$Ep = t);
		}
		createRenderRoot() {
			const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
			return S$1(t, this.constructor.elementStyles), t;
		}
		connectedCallback() {
			this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
		}
		enableUpdating(t) {}
		disconnectedCallback() {
			this._$EO?.forEach((t) => t.hostDisconnected?.());
		}
		attributeChangedCallback(t, s, i) {
			this._$AK(t, i);
		}
		_$ET(t, s) {
			const i = this.constructor.elementProperties.get(t), e = this.constructor._$Eu(t, i);
			if (void 0 !== e && !0 === i.reflect) {
				const h = (void 0 !== i.converter?.toAttribute ? i.converter : u$1).toAttribute(s, i.type);
				this._$Em = t, null == h ? this.removeAttribute(e) : this.setAttribute(e, h), this._$Em = null;
			}
		}
		_$AK(t, s) {
			const i = this.constructor, e = i._$Eh.get(t);
			if (void 0 !== e && this._$Em !== e) {
				const t = i.getPropertyOptions(e), h = "function" == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : u$1;
				this._$Em = e;
				const r = h.fromAttribute(s, t.type);
				this[e] = r ?? this._$Ej?.get(e) ?? r, this._$Em = null;
			}
		}
		requestUpdate(t, s, i, e = !1, h) {
			if (void 0 !== t) {
				const r = this.constructor;
				if (!1 === e && (h = this[t]), i ??= r.getPropertyOptions(t), !((i.hasChanged ?? f$1)(h, s) || i.useDefault && i.reflect && h === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
				this.C(t, s, i);
			}
			!1 === this.isUpdatePending && (this._$ES = this._$EP());
		}
		C(t, s, { useDefault: i, reflect: e, wrapped: h }, r) {
			i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), !0 !== h || void 0 !== r) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), !0 === e && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
		}
		async _$EP() {
			this.isUpdatePending = !0;
			try {
				await this._$ES;
			} catch (t) {
				Promise.reject(t);
			}
			const t = this.scheduleUpdate();
			return null != t && await t, !this.isUpdatePending;
		}
		scheduleUpdate() {
			return this.performUpdate();
		}
		performUpdate() {
			if (!this.isUpdatePending) return;
			if (!this.hasUpdated) {
				if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
					for (const [t, s] of this._$Ep) this[t] = s;
					this._$Ep = void 0;
				}
				const t = this.constructor.elementProperties;
				if (t.size > 0) for (const [s, i] of t) {
					const { wrapped: t } = i, e = this[s];
					!0 !== t || this._$AL.has(s) || void 0 === e || this.C(s, void 0, i, e);
				}
			}
			let t = !1;
			const s = this._$AL;
			try {
				t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((t) => t.hostUpdate?.()), this.update(s)) : this._$EM();
			} catch (s) {
				throw t = !1, this._$EM(), s;
			}
			t && this._$AE(s);
		}
		willUpdate(t) {}
		_$AE(t) {
			this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
		}
		_$EM() {
			this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
		}
		get updateComplete() {
			return this.getUpdateComplete();
		}
		getUpdateComplete() {
			return this._$ES;
		}
		shouldUpdate(t) {
			return !0;
		}
		update(t) {
			this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
		}
		updated(t) {}
		firstUpdated(t) {}
	};
	y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1?.({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ??= []).push("2.1.2");
	//#endregion
	//#region node_modules/lit-html/lit-html.js
	/**
	* @license
	* Copyright 2017 Google LLC
	* SPDX-License-Identifier: BSD-3-Clause
	*/
	var t = globalThis;
	var i$1 = (t) => t;
	var s$1 = t.trustedTypes;
	var e = s$1 ? s$1.createPolicy("lit-html", { createHTML: (t) => t }) : void 0;
	var h = "$lit$";
	var o$1 = `lit$${Math.random().toFixed(9).slice(2)}$`;
	var n = "?" + o$1;
	var r = `<${n}>`;
	var l = document;
	var c = () => l.createComment("");
	var a = (t) => null === t || "object" != typeof t && "function" != typeof t;
	var u = Array.isArray;
	var d = (t) => u(t) || "function" == typeof t?.[Symbol.iterator];
	var f = "[ 	\n\f\r]";
	var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
	var _ = /-->/g;
	var m = />/g;
	var p = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g");
	var g = /'/g;
	var $ = /"/g;
	var y = /^(?:script|style|textarea|title)$/i;
	var x = (t) => (i, ...s) => ({
		_$litType$: t,
		strings: i,
		values: s
	});
	var b = x(1);
	var E = Symbol.for("lit-noChange");
	var A = Symbol.for("lit-nothing");
	var C = /* @__PURE__ */ new WeakMap();
	var P = l.createTreeWalker(l, 129);
	function V(t, i) {
		if (!u(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
		return void 0 !== e ? e.createHTML(i) : i;
	}
	var N = (t, i) => {
		const s = t.length - 1, e = [];
		let n, l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "", c = v;
		for (let i = 0; i < s; i++) {
			const s = t[i];
			let a, u, d = -1, f = 0;
			for (; f < s.length && (c.lastIndex = f, u = c.exec(s), null !== u);) f = c.lastIndex, c === v ? "!--" === u[1] ? c = _ : void 0 !== u[1] ? c = m : void 0 !== u[2] ? (y.test(u[2]) && (n = RegExp("</" + u[2], "g")), c = p) : void 0 !== u[3] && (c = p) : c === p ? ">" === u[0] ? (c = n ?? v, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? p : "\"" === u[3] ? $ : g) : c === $ || c === g ? c = p : c === _ || c === m ? c = v : (c = p, n = void 0);
			const x = c === p && t[i + 1].startsWith("/>") ? " " : "";
			l += c === v ? s + r : d >= 0 ? (e.push(a), s.slice(0, d) + h + s.slice(d) + o$1 + x) : s + o$1 + (-2 === d ? i : x);
		}
		return [V(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : 3 === i ? "</math>" : "")), e];
	};
	var S = class S {
		constructor({ strings: t, _$litType$: i }, e) {
			let r;
			this.parts = [];
			let l = 0, a = 0;
			const u = t.length - 1, d = this.parts, [f, v] = N(t, i);
			if (this.el = S.createElement(f, e), P.currentNode = this.el.content, 2 === i || 3 === i) {
				const t = this.el.content.firstChild;
				t.replaceWith(...t.childNodes);
			}
			for (; null !== (r = P.nextNode()) && d.length < u;) {
				if (1 === r.nodeType) {
					if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(h)) {
						const i = v[a++], s = r.getAttribute(t).split(o$1), e = /([.?@])?(.*)/.exec(i);
						d.push({
							type: 1,
							index: l,
							name: e[2],
							strings: s,
							ctor: "." === e[1] ? I : "?" === e[1] ? L : "@" === e[1] ? z : H
						}), r.removeAttribute(t);
					} else t.startsWith(o$1) && (d.push({
						type: 6,
						index: l
					}), r.removeAttribute(t));
					if (y.test(r.tagName)) {
						const t = r.textContent.split(o$1), i = t.length - 1;
						if (i > 0) {
							r.textContent = s$1 ? s$1.emptyScript : "";
							for (let s = 0; s < i; s++) r.append(t[s], c()), P.nextNode(), d.push({
								type: 2,
								index: ++l
							});
							r.append(t[i], c());
						}
					}
				} else if (8 === r.nodeType) if (r.data === n) d.push({
					type: 2,
					index: l
				});
				else {
					let t = -1;
					for (; -1 !== (t = r.data.indexOf(o$1, t + 1));) d.push({
						type: 7,
						index: l
					}), t += o$1.length - 1;
				}
				l++;
			}
		}
		static createElement(t, i) {
			const s = l.createElement("template");
			return s.innerHTML = t, s;
		}
	};
	function M(t, i, s = t, e) {
		if (i === E) return i;
		let h = void 0 !== e ? s._$Co?.[e] : s._$Cl;
		const o = a(i) ? void 0 : i._$litDirective$;
		return h?.constructor !== o && (h?._$AO?.(!1), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? (s._$Co ??= [])[e] = h : s._$Cl = h), void 0 !== h && (i = M(t, h._$AS(t, i.values), h, e)), i;
	}
	var R = class {
		constructor(t, i) {
			this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
		}
		get parentNode() {
			return this._$AM.parentNode;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		u(t) {
			const { el: { content: i }, parts: s } = this._$AD, e = (t?.creationScope ?? l).importNode(i, !0);
			P.currentNode = e;
			let h = P.nextNode(), o = 0, n = 0, r = s[0];
			for (; void 0 !== r;) {
				if (o === r.index) {
					let i;
					2 === r.type ? i = new k(h, h.nextSibling, this, t) : 1 === r.type ? i = new r.ctor(h, r.name, r.strings, this, t) : 6 === r.type && (i = new Z(h, this, t)), this._$AV.push(i), r = s[++n];
				}
				o !== r?.index && (h = P.nextNode(), o++);
			}
			return P.currentNode = l, e;
		}
		p(t) {
			let i = 0;
			for (const s of this._$AV) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
		}
	};
	var k = class k {
		get _$AU() {
			return this._$AM?._$AU ?? this._$Cv;
		}
		constructor(t, i, s, e) {
			this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = e?.isConnected ?? !0;
		}
		get parentNode() {
			let t = this._$AA.parentNode;
			const i = this._$AM;
			return void 0 !== i && 11 === t?.nodeType && (t = i.parentNode), t;
		}
		get startNode() {
			return this._$AA;
		}
		get endNode() {
			return this._$AB;
		}
		_$AI(t, i = this) {
			t = M(this, t, i), a(t) ? t === A || null == t || "" === t ? (this._$AH !== A && this._$AR(), this._$AH = A) : t !== this._$AH && t !== E && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : d(t) ? this.k(t) : this._(t);
		}
		O(t) {
			return this._$AA.parentNode.insertBefore(t, this._$AB);
		}
		T(t) {
			this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
		}
		_(t) {
			this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t : this.T(l.createTextNode(t)), this._$AH = t;
		}
		$(t) {
			const { values: i, _$litType$: s } = t, e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = S.createElement(V(s.h, s.h[0]), this.options)), s);
			if (this._$AH?._$AD === e) this._$AH.p(i);
			else {
				const t = new R(e, this), s = t.u(this.options);
				t.p(i), this.T(s), this._$AH = t;
			}
		}
		_$AC(t) {
			let i = C.get(t.strings);
			return void 0 === i && C.set(t.strings, i = new S(t)), i;
		}
		k(t) {
			u(this._$AH) || (this._$AH = [], this._$AR());
			const i = this._$AH;
			let s, e = 0;
			for (const h of t) e === i.length ? i.push(s = new k(this.O(c()), this.O(c()), this, this.options)) : s = i[e], s._$AI(h), e++;
			e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
		}
		_$AR(t = this._$AA.nextSibling, s) {
			for (this._$AP?.(!1, !0, s); t !== this._$AB;) {
				const s = i$1(t).nextSibling;
				i$1(t).remove(), t = s;
			}
		}
		setConnected(t) {
			void 0 === this._$AM && (this._$Cv = t, this._$AP?.(t));
		}
	};
	var H = class {
		get tagName() {
			return this.element.tagName;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		constructor(t, i, s, e, h) {
			this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(/* @__PURE__ */ new String()), this.strings = s) : this._$AH = A;
		}
		_$AI(t, i = this, s, e) {
			const h = this.strings;
			let o = !1;
			if (void 0 === h) t = M(this, t, i, 0), o = !a(t) || t !== this._$AH && t !== E, o && (this._$AH = t);
			else {
				const e = t;
				let n, r;
				for (t = h[0], n = 0; n < h.length - 1; n++) r = M(this, e[s + n], i, n), r === E && (r = this._$AH[n]), o ||= !a(r) || r !== this._$AH[n], r === A ? t = A : t !== A && (t += (r ?? "") + h[n + 1]), this._$AH[n] = r;
			}
			o && !e && this.j(t);
		}
		j(t) {
			t === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
		}
	};
	var I = class extends H {
		constructor() {
			super(...arguments), this.type = 3;
		}
		j(t) {
			this.element[this.name] = t === A ? void 0 : t;
		}
	};
	var L = class extends H {
		constructor() {
			super(...arguments), this.type = 4;
		}
		j(t) {
			this.element.toggleAttribute(this.name, !!t && t !== A);
		}
	};
	var z = class extends H {
		constructor(t, i, s, e, h) {
			super(t, i, s, e, h), this.type = 5;
		}
		_$AI(t, i = this) {
			if ((t = M(this, t, i, 0) ?? A) === E) return;
			const s = this._$AH, e = t === A && s !== A || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, h = t !== A && (s === A || e);
			e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
		}
		handleEvent(t) {
			"function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
		}
	};
	var Z = class {
		constructor(t, i, s) {
			this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		_$AI(t) {
			M(this, t);
		}
	};
	var B = t.litHtmlPolyfillSupport;
	B?.(S, k), (t.litHtmlVersions ??= []).push("3.3.3");
	var D = (t, i, s) => {
		const e = s?.renderBefore ?? i;
		let h = e._$litPart$;
		if (void 0 === h) {
			const t = s?.renderBefore ?? null;
			e._$litPart$ = h = new k(i.insertBefore(c(), t), t, void 0, s ?? {});
		}
		return h._$AI(t), h;
	};
	//#endregion
	//#region node_modules/lit-element/lit-element.js
	/**
	* @license
	* Copyright 2017 Google LLC
	* SPDX-License-Identifier: BSD-3-Clause
	*/ var s = globalThis;
	var i = class extends y$1 {
		constructor() {
			super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
		}
		createRenderRoot() {
			const t = super.createRenderRoot();
			return this.renderOptions.renderBefore ??= t.firstChild, t;
		}
		update(t) {
			const r = this.render();
			this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = D(r, this.renderRoot, this.renderOptions);
		}
		connectedCallback() {
			super.connectedCallback(), this._$Do?.setConnected(!0);
		}
		disconnectedCallback() {
			super.disconnectedCallback(), this._$Do?.setConnected(!1);
		}
		render() {
			return E;
		}
	};
	i._$litElement$ = !0, i["finalized"] = !0, s.litElementHydrateSupport?.({ LitElement: i });
	var o = s.litElementPolyfillSupport;
	o?.({ LitElement: i });
	(s.litElementVersions ??= []).push("4.2.2");
	//#endregion
	//#region src/components/styles/foundations.js
	var componentFoundationStyles = i$3`
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
`;
	var dialogFoundationStyles = i$3`
    :host {
        font-family: var(--edvibe-font-family);
    }
`;
	//#endregion
	//#region src/components/export-progress-dialog.styles.js
	var exportProgressDialogStyles = i$3`
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

`;
	//#endregion
	//#region src/components/export-progress-dialog.js
	var EXPORT_PROGRESS_TAG = "edvibe-toolbox-export-progress";
	var ExportProgressDialog = class extends i {
		static styles = [
			componentFoundationStyles,
			dialogFoundationStyles,
			exportProgressDialogStyles
		];
		static properties = {
			statusText: { state: true },
			loadedSections: { state: true },
			totalSections: { state: true },
			countText: { state: true },
			progressState: { state: true }
		};
		constructor() {
			super();
			this.statusText = "Preparing export...";
			this.loadedSections = 0;
			this.totalSections = 0;
			this.countText = void 0;
			this.progressState = "loading";
		}
		update(options = /* @__PURE__ */ new Map()) {
			if (options instanceof Map) {
				super.update(options);
				return;
			}
			options = options && typeof options === "object" ? options : {};
			const { statusText = "", loadedSections = 0, totalSections = 0, countText, state = "loading" } = options;
			this.statusText = String(statusText || "");
			this.loadedSections = Number(loadedSections) || 0;
			this.totalSections = Number(totalSections) || 0;
			this.countText = countText;
			this.progressState = String(state || "loading");
			this.syncHostState();
			return this;
		}
		syncHostState() {
			const hasTotal = this.totalSections > 0;
			this.toggleAttribute("indeterminate", !hasTotal && this.progressState === "loading");
			this.toggleAttribute("complete", this.progressState === "complete");
			this.toggleAttribute("error", this.progressState === "error");
		}
		complete(statusText, totalSections) {
			return this.update({
				statusText,
				loadedSections: totalSections,
				totalSections,
				state: "complete"
			});
		}
		error(statusText) {
			return this.update({
				statusText,
				state: "error"
			});
		}
		dismissAfter(ms) {
			const delay = Number.isFinite(Number(ms)) ? Math.max(0, Number(ms)) : 0;
			setTimeout(() => this.remove(), delay);
		}
		render() {
			const hasTotal = this.totalSections > 0;
			const progressPercent = this.progressState === "complete" ? 100 : hasTotal ? Math.min(100, Math.round(this.loadedSections / this.totalSections * 100)) : 0;
			const count = this.countText ?? (hasTotal ? `${this.loadedSections} / ${this.totalSections} sections loaded` : this.progressState === "complete" ? "Export complete" : "Discovering sections...");
			const progressValue = hasTotal || this.progressState === "complete" ? progressPercent : A;
			return b`
<div class="overlay">
                <section class="card" role="dialog" aria-modal="true"
                    aria-labelledby="export-progress-title">
                    <h2 id="export-progress-title">Exporting marathon</h2>
                    <p class="status">${this.statusText}</p>
                    <progress class="progress" max="100" value=${progressValue}></progress>
                    <div class="meta">
                        <span class="count">${count}</span>
                        <span class="percent">${progressPercent}%</span>
                    </div>
                    <button class="close" type="button" @click=${() => this.remove()}>Close</button>
                </section>
            </div>
        `;
		}
	};
	if (!customElements.get("edvibe-toolbox-export-progress")) customElements.define(EXPORT_PROGRESS_TAG, ExportProgressDialog);
	//#endregion
	//#region src/components/reset-lessons-dialog.styles.js
	var resetLessonsDialogStyles = i$3`
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

`;
	//#endregion
	//#region src/components/reset-lessons-dialog.js
	var RESET_DIALOG_TAG$1 = "edvibe-toolbox-reset-dialog";
	var RESET_OVERLAY_ID$1 = "edvibe-toolbox-reset-overlay";
	var ResetLessonsDialog = class extends i {
		static styles = [
			componentFoundationStyles,
			dialogFoundationStyles,
			resetLessonsDialogStyles
		];
		static properties = {
			currentStep: { state: true },
			allPupils: { state: true },
			pupilTotal: { state: true },
			selectedPupil: { state: true },
			lessons: { state: true },
			selectedLessonIds: { state: true },
			locked: { state: true },
			loading: { state: true },
			finished: { state: true },
			pupilPageLoading: { state: true },
			appliedSearchQuery: { state: true },
			searchDebouncing: { state: true },
			suppressPupilPageLoading: { state: true },
			searchValue: { state: true },
			statusMessage: { state: true },
			statusState: { state: true },
			progressVisible: { state: true },
			progressIndeterminate: { state: true },
			progressValue: { state: true }
		};
		constructor() {
			super();
			this.searchDelay = 1e3;
			this.log = () => {};
			this.loadLessons = null;
			this.loadNextPupils = null;
			this.currentStep = "user";
			this.allPupils = [];
			this.pupilTotal = 0;
			this.selectedPupil = null;
			this.loadedPupilId = null;
			this.lessons = [];
			this.selectedLessonIds = /* @__PURE__ */ new Set();
			this.locked = false;
			this.loading = false;
			this.finished = false;
			this.closed = false;
			this.pupilPagePromise = null;
			this.pupilPageLoading = false;
			this.searchTimer = null;
			this.searchGeneration = 0;
			this.appliedSearchQuery = "";
			this.searchDebouncing = false;
			this.suppressPupilPageLoading = false;
			this.searchValue = "";
			this.statusMessage = "";
			this.statusState = "";
			this.progressVisible = false;
			this.progressIndeterminate = false;
			this.progressValue = 0;
			this.elements = null;
			this.handleKeydownBound = (event) => this.handleKeydown(event);
		}
		connectedCallback() {
			super.connectedCallback();
			if (!this.id) this.id = RESET_OVERLAY_ID$1;
			this.ownerDocument?.addEventListener("keydown", this.handleKeydownBound);
		}
		disconnectedCallback() {
			this.cancelSearch();
			this.ownerDocument?.removeEventListener("keydown", this.handleKeydownBound);
			super.disconnectedCallback();
		}
		configure(options = {}) {
			options = options && typeof options === "object" ? options : {};
			const { searchDelay = 1e3, loadLessons, loadNextPupils, log = () => {} } = options;
			this.searchDelay = Number.isFinite(Number(searchDelay)) ? Math.max(0, Number(searchDelay)) : 1e3;
			this.loadLessons = typeof loadLessons === "function" ? loadLessons : null;
			this.loadNextPupils = typeof loadNextPupils === "function" ? loadNextPupils : null;
			this.log = typeof log === "function" ? log : () => {};
			return this;
		}
		updated() {
			this.cacheElements();
		}
		cacheElements() {
			if (!this.shadowRoot) {
				this.elements = null;
				return;
			}
			const find = (selector) => this.shadowRoot.querySelector(selector);
			this.elements = {
				backdrop: find(".edvibe-reset-overlay"),
				search: find(".edvibe-reset-search"),
				userStep: find(".edvibe-reset-user-step"),
				lessonStep: find(".edvibe-reset-lesson-step"),
				pupilsShell: find(".edvibe-reset-pupils-shell"),
				pupilsList: find(".edvibe-reset-pupils"),
				pupilsLoading: find(".edvibe-reset-pupils-loading"),
				lessonsList: find(".edvibe-reset-lessons"),
				selectAll: find(".edvibe-reset-select-all-input"),
				status: find(".edvibe-reset-status"),
				progress: find(".edvibe-reset-progress"),
				close: find(".edvibe-reset-close"),
				cancel: find(".edvibe-reset-cancel"),
				back: find(".edvibe-reset-back"),
				next: find(".edvibe-reset-next"),
				submit: find(".edvibe-reset-submit")
			};
		}
		normalizeSearchQuery(value) {
			return String(value || "").trim().toLowerCase();
		}
		filterPupils(query) {
			const normalized = this.normalizeSearchQuery(query);
			return normalized ? this.allPupils.filter((pupil) => String(pupil.Email || "").toLowerCase().includes(normalized)) : this.allPupils;
		}
		hasMorePupils() {
			return this.allPupils.length < this.pupilTotal;
		}
		hasLoadedLessonsForSelectedPupil() {
			return Boolean(this.selectedPupil) && this.selectedPupil.PupilId === this.loadedPupilId;
		}
		isPupilLoadingVisible() {
			return this.loading || this.pupilPageLoading && !this.suppressPupilPageLoading;
		}
		getViewState() {
			const blocked = this.loading || this.locked || this.finished;
			return {
				showingUsers: this.currentStep === "user",
				nextDisabled: blocked || !this.selectedPupil,
				backDisabled: this.loading || this.locked,
				submitDisabled: blocked || !this.selectedPupil || this.selectedLessonIds.size === 0,
				closeDisabled: this.loading || this.locked
			};
		}
		setStatus(message, state = "") {
			this.statusMessage = String(message || "");
			this.statusState = state === "error" || state === "success" ? state : "";
		}
		renderState() {
			this.requestUpdate();
		}
		renderPupilLoadingState() {
			this.requestUpdate();
		}
		renderPupils() {
			this.requestUpdate();
		}
		selectPupil(pupil) {
			if (this.locked || this.finished || this.isPupilLoadingVisible() || pupil.PupilId === this.selectedPupil?.PupilId) return;
			if (pupil.PupilId !== this.loadedPupilId) {
				this.loadedPupilId = null;
				this.lessons = [];
				this.selectedLessonIds = /* @__PURE__ */ new Set();
			}
			this.selectedPupil = pupil;
			this.setStatus(`Выбран пользователь: ${pupil.Email || "email отсутствует"}`);
		}
		renderLessons() {
			this.requestUpdate();
		}
		toggleLesson(lessonId, selected) {
			if (selected) this.selectedLessonIds.add(lessonId);
			else this.selectedLessonIds.delete(lessonId);
			this.requestUpdate();
		}
		handleSelectAll(event) {
			const checked = event?.currentTarget?.checked ?? this.elements?.selectAll?.checked;
			this.selectedLessonIds = checked ? new Set(this.lessons.map((lesson) => lesson.MarathonLessonId)) : /* @__PURE__ */ new Set();
		}
		handleSearchInput(event) {
			this.searchValue = String(event?.currentTarget?.value ?? this.searchValue);
			this.searchGeneration += 1;
			this.cancelSearchTimer();
			this.searchDebouncing = true;
			this.suppressPupilPageLoading = true;
			const query = this.normalizeSearchQuery(this.searchValue);
			const generation = this.searchGeneration;
			this.searchTimer = globalThis.setTimeout(async () => {
				if (!this.isCurrentSearch(generation, query)) return;
				this.searchTimer = null;
				const needsRemotePupils = Boolean(query && this.filterPupils(query).length === 0 && this.hasMorePupils());
				this.searchDebouncing = false;
				if (needsRemotePupils || !this.pupilPageLoading) this.suppressPupilPageLoading = false;
				if (needsRemotePupils && !await this.continueSearch(generation, query)) return;
				if (!this.isCurrentSearch(generation, query)) return;
				this.appliedSearchQuery = query;
			}, this.searchDelay);
		}
		isCurrentSearch(generation, query) {
			return !this.closed && generation === this.searchGeneration && query === this.normalizeSearchQuery(this.searchValue);
		}
		cancelSearchTimer() {
			if (this.searchTimer !== null) {
				globalThis.clearTimeout(this.searchTimer);
				this.searchTimer = null;
			}
		}
		cancelSearch() {
			this.searchGeneration += 1;
			this.cancelSearchTimer();
		}
		async continueSearch(generation, query) {
			while (this.isCurrentSearch(generation, query) && this.filterPupils(query).length === 0 && this.hasMorePupils()) if (!await this.loadNextPupilPage()) return false;
			return true;
		}
		async loadNextPupilPage() {
			if (this.closed || !this.loadNextPupils || !this.hasMorePupils()) return false;
			if (this.pupilPagePromise) return this.pupilPagePromise;
			this.suppressPupilPageLoading = false;
			this.pupilPageLoading = true;
			this.pupilPagePromise = (async () => {
				try {
					const page = await this.loadNextPupils();
					if (this.closed) return false;
					this.allPupils = Array.isArray(page?.pupils) ? page.pupils : [];
					this.pupilTotal = Number(page?.total) || 0;
					if (this.currentStep === "user" && !this.loading) this.setStatus(`Загружено пользователей: ${this.allPupils.length} из ${this.pupilTotal}`);
					return true;
				} catch (error) {
					if (!this.closed && this.currentStep === "user" && !this.loading) {
						this.log(`Failed to load another pupil page (${this.errorType(error)}).`);
						this.setStatus(error.message, "error");
					}
					return false;
				} finally {
					this.pupilPagePromise = null;
					this.pupilPageLoading = false;
					if (!this.searchDebouncing) this.suppressPupilPageLoading = false;
				}
			})();
			return this.pupilPagePromise;
		}
		handlePupilsScroll(event) {
			if (this.searchDebouncing) return;
			const list = event?.currentTarget || this.elements?.pupilsList;
			if (!list) return;
			if (list.scrollHeight - list.scrollTop - list.clientHeight <= 24) this.loadNextPupilPage();
		}
		async handleNext() {
			if (this.getViewState().nextDisabled || !this.selectedPupil) return;
			if (this.hasLoadedLessonsForSelectedPupil()) {
				this.currentStep = "lessons";
				await this.updateComplete;
				this.shadowRoot?.querySelector(".edvibe-reset-lessons")?.focus();
				return;
			}
			if (!this.loadLessons) return;
			try {
				this.setLoading(`Загрузка уроков для ${this.selectedPupil.Email}...`);
				const lessons = await this.loadLessons(this.selectedPupil);
				this.showLessons(this.selectedPupil, lessons);
			} catch (error) {
				this.loading = false;
				this.currentStep = "user";
				this.log(`Failed to load lessons for PupilId ${this.selectedPupil.PupilId} (${this.errorType(error)}).`);
				this.setStatus(error.message, "error");
			}
		}
		handleBack() {
			if (this.getViewState().backDisabled) return;
			if (this.finished) {
				this.resetForAnotherUser();
				return;
			}
			this.currentStep = "user";
			this.setStatus(`Выбран пользователь: ${this.selectedPupil?.Email || "email отсутствует"}`);
			this.updateComplete.then(() => this.shadowRoot?.querySelector(".edvibe-reset-search")?.focus());
		}
		handleSubmit() {
			if (this.getViewState().submitDisabled) return;
			this.dispatchEvent(new CustomEvent("edvibe-reset-request", { detail: {
				pupil: this.selectedPupil,
				lessons: this.lessons.filter((lesson) => this.selectedLessonIds.has(lesson.MarathonLessonId))
			} }));
		}
		handleBackdropClick(event) {
			if (event.target === event.currentTarget) this.close();
		}
		handleKeydown(event) {
			if (event.key === "Escape") this.close();
		}
		close() {
			if (this.locked || this.loading || this.closed) return;
			this.closed = true;
			this.cancelSearch();
			this.dispatchEvent(new CustomEvent("edvibe-dialog-close"));
			this.remove();
		}
		resetForAnotherUser() {
			this.finished = false;
			this.currentStep = "user";
			this.selectedPupil = null;
			this.loadedPupilId = null;
			this.lessons = [];
			this.selectedLessonIds = /* @__PURE__ */ new Set();
			this.searchValue = "";
			this.appliedSearchQuery = "";
			this.cancelSearch();
			this.searchDebouncing = false;
			this.suppressPupilPageLoading = false;
			this.progressVisible = false;
			this.progressIndeterminate = false;
			this.progressValue = 0;
			this.setStatus(`Загружено пользователей: ${this.allPupils.length} из ${this.pupilTotal}`);
			this.updateComplete.then(() => this.shadowRoot?.querySelector(".edvibe-reset-search")?.focus());
		}
		showPupils(options = {}) {
			options = options && typeof options === "object" ? options : {};
			const pupils = Array.isArray(options.pupils) ? options.pupils : [];
			const total = Number.isFinite(Number(options.total)) ? Number(options.total) : pupils.length;
			this.allPupils = pupils;
			this.pupilTotal = total;
			this.currentStep = "user";
			this.loading = false;
			this.setStatus(`Загружено пользователей: ${pupils.length} из ${total}`);
			this.updateComplete.then(() => this.shadowRoot?.querySelector(".edvibe-reset-search")?.focus());
			return this;
		}
		showLessons(pupil, lessons) {
			if (!pupil || typeof pupil !== "object") return this;
			lessons = Array.isArray(lessons) ? lessons : [];
			const pupilChanged = this.loadedPupilId !== pupil.PupilId;
			this.selectedPupil = pupil;
			this.loadedPupilId = pupil.PupilId;
			this.lessons = lessons;
			if (pupilChanged) this.selectedLessonIds = /* @__PURE__ */ new Set();
			this.loading = false;
			this.currentStep = "lessons";
			this.setStatus(`Загружено уроков: ${lessons.length}`);
			this.updateComplete.then(() => this.shadowRoot?.querySelector(".edvibe-reset-lessons")?.focus());
			return this;
		}
		setLoading(message) {
			this.loading = true;
			this.setStatus(message);
		}
		lock() {
			this.locked = true;
			this.classList.toggle("is-running", true);
		}
		completeRun() {
			this.locked = false;
			this.finished = true;
			this.classList.toggle("is-running", false);
		}
		unlockAfterRun() {
			this.locked = false;
			this.finished = false;
			this.classList.toggle("is-running", false);
		}
		showDiscovery(message) {
			this.setStatus(message);
			this.progressVisible = true;
			this.progressIndeterminate = true;
		}
		showProgress(options = {}) {
			options = options && typeof options === "object" ? options : {};
			const completed = Number(options.completed) || 0;
			const total = Number(options.total) || 0;
			const lesson = options.lesson && typeof options.lesson === "object" ? options.lesson : {};
			const exerciseId = options.exerciseId;
			const percent = total > 0 ? Math.round(completed / total * 100) : 100;
			const detail = exerciseId ? `Упражнение ${exerciseId}` : "Удаление запроса урока";
			this.setStatus(`${lesson.Name || ""}\n${detail} — ${completed} / ${total}`);
			this.progressVisible = true;
			this.progressIndeterminate = false;
			this.progressValue = percent;
		}
		showComplete(message) {
			this.setStatus(message, "success");
			this.progressVisible = true;
			this.progressIndeterminate = false;
			this.progressValue = 100;
		}
		showError(message) {
			if (!this.locked) this.loading = false;
			this.setStatus(message, "error");
			this.progressIndeterminate = false;
		}
		errorType(error) {
			return typeof error?.name === "string" ? error.name : "Error";
		}
		renderPupilRows() {
			const visiblePupils = this.filterPupils(this.appliedSearchQuery);
			if (visiblePupils.length === 0) return b`<p class="edvibe-reset-empty">Пользователи не найдены.</p>`;
			const busy = this.isPupilLoadingVisible();
			return visiblePupils.map((pupil) => {
				const selected = pupil.PupilId === this.selectedPupil?.PupilId;
				return b`<button type="button" class=${`edvibe-reset-row${selected ? " is-selected" : ""}`} role="option" aria-selected=${String(selected)} ?disabled=${busy || this.locked || this.finished} @click=${() => this.selectPupil(pupil)}><span class="edvibe-reset-row-copy"><span class="edvibe-reset-row-name">${pupil.Name || "Без имени"}</span><span class="edvibe-reset-row-email">${pupil.Email || "Email отсутствует"}</span></span></button>`;
			});
		}
		renderLessonRows(inputsBlocked) {
			if (this.lessons.length === 0) return b`<p class="edvibe-reset-empty">Для пользователя нет уроков.</p>`;
			return this.lessons.map((lesson) => b`<label class="edvibe-reset-row edvibe-reset-lesson"><input type="checkbox" .value=${String(lesson.MarathonLessonId)} .checked=${this.selectedLessonIds.has(lesson.MarathonLessonId)} ?disabled=${inputsBlocked} @change=${(event) => this.toggleLesson(lesson.MarathonLessonId, event.currentTarget.checked)}><span class="edvibe-reset-row-copy"><span class="edvibe-reset-row-name">${Number(lesson.Number) + 1}. ${lesson.Name}</span><span class="edvibe-reset-row-email">${lesson.LastRequest ? `Статус последнего запроса: ${lesson.LastRequest.Status}` : "Нет запросов на проверку"}</span></span></label>`);
		}
		render() {
			const view = this.getViewState();
			const inputsBlocked = this.locked || this.loading || this.finished;
			const pupilBusy = this.isPupilLoadingVisible();
			const selectAllChecked = this.lessons.length > 0 && this.selectedLessonIds.size === this.lessons.length;
			const selectAllIndeterminate = this.selectedLessonIds.size > 0 && this.selectedLessonIds.size < this.lessons.length;
			const statusClass = `edvibe-reset-status${this.statusState === "error" ? " is-error" : this.statusState === "success" ? " is-success" : ""}`;
			const progressClass = `edvibe-reset-progress${this.progressVisible ? " is-visible" : ""}${this.progressIndeterminate ? " is-indeterminate" : ""}`;
			const progressValue = this.progressIndeterminate ? A : this.progressValue;
			const selectedPupilLabel = this.selectedPupil ? `${this.selectedPupil.Name || "Без имени"} — ${this.selectedPupil.Email || ""}` : "";
			return b`
<div class="edvibe-reset-overlay" @click=${this.handleBackdropClick}>
                <div class="edvibe-reset-card" role="dialog" aria-modal="true" aria-labelledby="edvibe-reset-title">
                    <div class="edvibe-reset-header"><div><h2 id="edvibe-reset-title" class="edvibe-reset-title">Сброс уроков</h2><p class="edvibe-reset-subtitle"><span class="edvibe-reset-step-indicator">${view.showingUsers ? "Шаг 1 из 2" : "Шаг 2 из 2"}</span><span class="edvibe-reset-step-description">${view.showingUsers ? "Выберите пользователя." : "Выберите уроки для сброса прогресса."}</span></p></div><button class="edvibe-reset-close" type="button" aria-label="Закрыть" ?disabled=${view.closeDisabled} @click=${() => this.close()}>&times;</button></div>
                    <div class="edvibe-reset-body">
                        <section class="edvibe-reset-user-step" aria-label="Выбор пользователя" ?hidden=${!view.showingUsers}><label class="edvibe-reset-label" for="edvibe-reset-search">Поиск по email</label><input id="edvibe-reset-search" class="edvibe-reset-search" type="search" placeholder="user@example.com" autocomplete="off" .value=${this.searchValue} ?disabled=${inputsBlocked} @input=${this.handleSearchInput}><div class=${`edvibe-reset-pupils-shell${pupilBusy ? " is-loading" : ""}`}><div class="edvibe-reset-list edvibe-reset-pupils" role="listbox" aria-label="Пользователи марафона" aria-busy=${String(pupilBusy)} .inert=${pupilBusy} @scroll=${this.handlePupilsScroll}>${this.renderPupilRows()}</div><div class="edvibe-reset-pupils-loading" role="status" aria-live="polite" ?hidden=${!pupilBusy}><span class="edvibe-reset-spinner" aria-hidden="true"></span><span>Загрузка пользователей...</span></div></div></section>
                        <section class="edvibe-reset-lesson-step" aria-label="Выбор уроков" ?hidden=${view.showingUsers}><div class="edvibe-reset-label edvibe-reset-selected-pupil">${selectedPupilLabel}</div><label class="edvibe-reset-select-all"><input class="edvibe-reset-select-all-input" type="checkbox" .checked=${selectAllChecked} .indeterminate=${selectAllIndeterminate} ?disabled=${inputsBlocked || this.lessons.length === 0} @change=${this.handleSelectAll}>Выбрать все уроки</label><div class="edvibe-reset-list edvibe-reset-lessons" aria-label="Уроки пользователя" tabindex="-1">${this.renderLessonRows(inputsBlocked)}</div></section>
                    </div>
                    <div class="edvibe-reset-live-region"><p class=${statusClass} aria-live="polite">${this.statusMessage}</p><progress class=${progressClass} max="100" value=${progressValue}></progress></div>
                    <div class="edvibe-reset-footer"><button class="edvibe-reset-button edvibe-reset-cancel" type="button" ?disabled=${view.closeDisabled} @click=${() => this.close()}>Закрыть</button><button class="edvibe-reset-button edvibe-reset-back" type="button" ?hidden=${view.showingUsers} ?disabled=${view.backDisabled} @click=${this.handleBack}>${this.finished ? "Сбросить для другого пользователя" : "Назад"}</button><button class="edvibe-reset-button edvibe-reset-next" type="button" ?hidden=${!view.showingUsers} ?disabled=${view.nextDisabled} @click=${this.handleNext}>Далее</button><button class="edvibe-reset-button edvibe-reset-submit" type="button" ?hidden=${view.showingUsers} ?disabled=${view.submitDisabled} @click=${this.handleSubmit}>Сбросить прогресс</button></div>
                </div>
            </div>`;
		}
	};
	if (!customElements.get("edvibe-toolbox-reset-dialog")) customElements.define(RESET_DIALOG_TAG$1, ResetLessonsDialog);
	//#endregion
	//#region src/shared/logger.js
	var SUPPORTED_WORLDS = /* @__PURE__ */ new Set([
		"POPUP",
		"MAIN",
		"ISOLATED"
	]);
	/**
	* Creates component-scoped loggers for one explicit execution world.
	*
	* @param {string} world The execution world.
	* @returns {(module: string | null | undefined) => (...args: any[]) => void} A function that creates a logger function.
	*/
	function createLoggerFactory(world) {
		if (!SUPPORTED_WORLDS.has(world)) throw new Error(`Unsupported logging world: ${world}`);
		return function createLogger(component) {
			if (component !== void 0 && (typeof component !== "string" || !component.trim())) throw new Error("Component must be a non-empty string.");
			const namespace = `[Edvibe Toolbox][${world}]${component ? `[${component.trim()}]` : ""}`;
			return (...args) => console.log(namespace, ...args);
		};
	}
	//#endregion
	//#region src/shared/message-protocol.js
	var POPUP_COMMANDS = Object.freeze({
		START_EXPORT: "START_FULL_AUTOMATION",
		OPEN_LESSON_RESET: "OPEN_LESSON_RESET",
		OPEN_ACTION_RECORDER: "OPEN_ACTION_RECORDER",
		OPEN_BATCH_LESSON_ACCESS: "OPEN_BATCH_LESSON_ACCESS",
		OPEN_BATCH_USER_ONBOARDING: "OPEN_BATCH_USER_ONBOARDING",
		OPEN_BATCH_USER_MANAGEMENT: "OPEN_BATCH_USER_MANAGEMENT",
		OPEN_BATCH_SECTION_CREATION: "OPEN_BATCH_SECTION_CREATION",
		OPEN_BATCH_SECTION_DELETION: "OPEN_BATCH_SECTION_DELETION",
		OPEN_EXECUTION_HISTORY: "OPEN_EXECUTION_HISTORY"
	});
	var WINDOW_MESSAGE_TYPES = Object.freeze({
		START_EXPORT: "EDVIBE_TOOLBOX_START_ALL",
		OPEN_LESSON_RESET: "EDVIBE_TOOLBOX_OPEN_RESET",
		OPEN_ACTION_RECORDER: "EDVIBE_TOOLBOX_OPEN_RECORDER",
		OPEN_BATCH_LESSON_ACCESS: "EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS",
		OPEN_BATCH_USER_ONBOARDING: "EDVIBE_TOOLBOX_OPEN_BATCH_USER_ONBOARDING",
		OPEN_BATCH_USER_MANAGEMENT: "EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT",
		OPEN_BATCH_SECTION_CREATION: "EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION",
		OPEN_BATCH_SECTION_DELETION: "EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_DELETION",
		OPEN_EXECUTION_HISTORY: "EDVIBE_TOOLBOX_OPEN_EXECUTION_HISTORY",
		EXPORT_STATUS: "EDVIBE_TOOLBOX_EXPORT_STATUS",
		STORAGE_REQUEST: "EDVIBE_TOOLBOX_STORAGE_REQUEST",
		STORAGE_RESPONSE: "EDVIBE_TOOLBOX_STORAGE_RESPONSE"
	});
	Object.freeze({ EXPORT_STATUS: "EXPORT_STATUS" });
	var EXPORT_STATES = Object.freeze({
		STARTED: "started",
		COMPLETE: "complete",
		ERROR: "error"
	});
	var STORAGE_ACTIONS = Object.freeze({
		GET: "get",
		SET: "set"
	});
	var STORAGE_KEYS = Object.freeze({ EXECUTION_HISTORY_PREFERENCES: "executionHistoryPreferences" });
	var COMMAND_ROUTES = Object.freeze({
		[POPUP_COMMANDS.START_EXPORT]: Object.freeze({
			type: WINDOW_MESSAGE_TYPES.START_EXPORT,
			info: "Automation sequence channeled to page engine."
		}),
		[POPUP_COMMANDS.OPEN_LESSON_RESET]: Object.freeze({
			type: WINDOW_MESSAGE_TYPES.OPEN_LESSON_RESET,
			info: "Lesson reset workflow opened."
		}),
		[POPUP_COMMANDS.OPEN_ACTION_RECORDER]: Object.freeze({
			type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
			info: "Action recorder opened."
		}),
		[POPUP_COMMANDS.OPEN_BATCH_LESSON_ACCESS]: Object.freeze({
			type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_LESSON_ACCESS,
			info: "Batch lesson access opened."
		}),
		[POPUP_COMMANDS.OPEN_BATCH_USER_ONBOARDING]: Object.freeze({
			type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_USER_ONBOARDING,
			info: "Batch user onboarding opened."
		}),
		[POPUP_COMMANDS.OPEN_BATCH_USER_MANAGEMENT]: Object.freeze({
			type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_USER_MANAGEMENT,
			info: "Batch user management opened."
		}),
		[POPUP_COMMANDS.OPEN_BATCH_SECTION_CREATION]: Object.freeze({
			type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_SECTION_CREATION,
			info: "Batch section creation opened."
		}),
		[POPUP_COMMANDS.OPEN_BATCH_SECTION_DELETION]: Object.freeze({
			type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_SECTION_DELETION,
			info: "Batch section deletion opened."
		}),
		[POPUP_COMMANDS.OPEN_EXECUTION_HISTORY]: Object.freeze({
			type: WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY,
			info: "Execution history opened."
		})
	});
	var MAIN_COMMAND_TYPES = new Set(Object.values(COMMAND_ROUTES).map(({ type }) => type));
	var EXPORT_STATE_VALUES = new Set(Object.values(EXPORT_STATES));
	var STORAGE_ACTION_VALUES = new Set(Object.values(STORAGE_ACTIONS));
	var STORAGE_KEY_VALUES = new Set(Object.values(STORAGE_KEYS));
	function isRecord$1(value) {
		return value !== null && typeof value === "object" && !Array.isArray(value);
	}
	function hasOnlyKeys(value, allowedKeys) {
		return Object.keys(value).every((key) => allowedKeys.has(key));
	}
	function isNonEmptyString(value) {
		return typeof value === "string" && value.length > 0;
	}
	function isMainCommandMessage(value) {
		if (!isRecord$1(value) || !MAIN_COMMAND_TYPES.has(value.type)) return false;
		if (value.type === WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY) return hasOnlyKeys(value, /* @__PURE__ */ new Set(["type", "executionId"])) && (value.executionId === void 0 || value.executionId === null || isNonEmptyString(value.executionId));
		return hasOnlyKeys(value, /* @__PURE__ */ new Set(["type"]));
	}
	function createExportStatusMessage(state, message = "") {
		if (!EXPORT_STATE_VALUES.has(state)) throw new TypeError(`Unsupported export state: ${String(state)}`);
		if (typeof message !== "string") throw new TypeError("Export status message must be a string");
		return Object.freeze({
			type: WINDOW_MESSAGE_TYPES.EXPORT_STATUS,
			state,
			message
		});
	}
	function createStorageRequest({ requestId, action, key, value }) {
		const candidate = {
			type: WINDOW_MESSAGE_TYPES.STORAGE_REQUEST,
			requestId,
			action,
			key
		};
		if (action === STORAGE_ACTIONS.SET) candidate.value = value;
		if (!isStorageRequestMessage(candidate)) throw new TypeError("Invalid storage request");
		return Object.freeze(candidate);
	}
	function isStorageRequestMessage(value) {
		if (!isRecord$1(value) || value.type !== WINDOW_MESSAGE_TYPES.STORAGE_REQUEST || !isNonEmptyString(value.requestId) || !STORAGE_ACTION_VALUES.has(value.action) || !STORAGE_KEY_VALUES.has(value.key) || !hasOnlyKeys(value, /* @__PURE__ */ new Set([
			"type",
			"requestId",
			"action",
			"key",
			"value"
		]))) return false;
		if (value.action === STORAGE_ACTIONS.GET) return !Object.prototype.hasOwnProperty.call(value, "value");
		return Object.prototype.hasOwnProperty.call(value, "value") && value.value !== void 0;
	}
	function isStorageResponseMessage(value) {
		if (!isRecord$1(value) || value.type !== WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE || !isNonEmptyString(value.requestId) || typeof value.ok !== "boolean" || !hasOnlyKeys(value, /* @__PURE__ */ new Set([
			"type",
			"requestId",
			"ok",
			"value",
			"error"
		]))) return false;
		if (value.ok) return !Object.prototype.hasOwnProperty.call(value, "error");
		return isNonEmptyString(value.error) && !Object.prototype.hasOwnProperty.call(value, "value");
	}
	//#endregion
	//#region src/shared/websocket-transport.js
	var REQUEST_TIMEOUT_MS = 15e3;
	function createTransportError(code, message, details = {}) {
		const error = new Error(message);
		error.code = code;
		for (const key of [
			"controller",
			"method",
			"requestId",
			"serverErrorCode",
			"cause"
		]) if (details[key] !== void 0) error[key] = details[key];
		return error;
	}
	function createWebSocketTransport({ WebSocketClass, cryptoApi, requestTimeoutMs = REQUEST_TIMEOUT_MS, setTimeoutFn = setTimeout, clearTimeoutFn = clearTimeout, now = Date.now, log = () => {} }) {
		let activeSocket = null;
		let nextSocketId = 1;
		let internalSendDepth = 0;
		const pendingRequests = /* @__PURE__ */ new Map();
		const frameObservers = /* @__PURE__ */ new Set();
		function getByteLength(data) {
			if (typeof data === "string") {
				if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(data).byteLength;
				return unescape(encodeURIComponent(data)).length;
			}
			if (typeof Blob !== "undefined" && data instanceof Blob) return data.size;
			if (typeof ArrayBuffer !== "undefined") {
				if (data instanceof ArrayBuffer) return data.byteLength;
				if (ArrayBuffer.isView(data)) return data.byteLength;
			}
			return null;
		}
		function getDataType(data) {
			if (typeof data === "string") return "text";
			if (typeof Blob !== "undefined" && data instanceof Blob) return "blob";
			if (typeof ArrayBuffer !== "undefined" && (data instanceof ArrayBuffer || ArrayBuffer.isView(data))) return "array-buffer";
			return "other";
		}
		function emitFrame({ direction, socketId, data, origin }) {
			if (frameObservers.size === 0) return;
			const dataType = getDataType(data);
			const frame = {
				direction,
				socketId,
				capturedAt: now(),
				dataType,
				byteLength: getByteLength(data),
				origin
			};
			if (dataType === "text") frame.data = data;
			for (const observer of [...frameObservers]) try {
				observer(frame);
			} catch (error) {
				log("Frame observer failed:", error);
			}
		}
		function subscribeFrames(observer) {
			if (typeof observer !== "function") throw new TypeError("Frame observer must be a function.");
			frameObservers.add(observer);
			return () => frameObservers.delete(observer);
		}
		function createPacket(controller, method, projectName, valueObject) {
			return {
				Controller: controller,
				Method: method,
				ProjectName: projectName,
				RequestId: cryptoApi.randomUUID(),
				Value: JSON.stringify(valueObject)
			};
		}
		function handleMessage(event, socketId) {
			let data = null;
			if (typeof event.data === "string") try {
				data = JSON.parse(event.data);
			} catch (_) {}
			const isToolboxResponse = Boolean(data?.RequestId && pendingRequests.has(data.RequestId));
			emitFrame({
				direction: "inbound",
				socketId,
				data: event.data,
				origin: isToolboxResponse ? "toolbox" : "page"
			});
			if (typeof event.data !== "string") return;
			try {
				if (!data) return;
				if (!data.RequestId || !pendingRequests.has(data.RequestId)) return;
				const pending = pendingRequests.get(data.RequestId);
				pendingRequests.delete(data.RequestId);
				clearTimeoutFn(pending.timeoutId);
				const elapsedMs = now() - pending.startedAt;
				const outcome = data.IsSuccess === true ? "success" : `failed (${data.ErrorCode})`;
				log(`← ${pending.controller}.${pending.method} [${data.RequestId}] ${outcome} in ${elapsedMs}ms`);
				if (data.IsSuccess !== true) {
					pending.reject(createTransportError("SERVER_REJECTED", `${data.Class || "Edvibe"}:${data.Method || "request"} failed with ErrorCode ${data.ErrorCode}`, {
						controller: pending.controller,
						method: pending.method,
						requestId: data.RequestId,
						serverErrorCode: data.ErrorCode
					}));
					return;
				}
				pending.resolve(data);
			} catch (error) {
				log("Failed parsing WebSocket frame:", error);
			}
		}
		function install(rootObject) {
			function InterceptedWebSocket(url, protocols) {
				log("Intercepting WebSocket targeting:", url);
				const socket = protocols === void 0 ? new WebSocketClass(url) : new WebSocketClass(url, protocols);
				const socketId = nextSocketId;
				nextSocketId += 1;
				activeSocket = socket;
				const nativeSend = socket.send;
				socket.send = function observedSend(data) {
					emitFrame({
						direction: "outbound",
						socketId,
						data,
						origin: internalSendDepth > 0 ? "toolbox" : "page"
					});
					return nativeSend.call(socket, data);
				};
				socket.addEventListener("message", (event) => {
					handleMessage(event, socketId);
				});
				return socket;
			}
			InterceptedWebSocket.prototype = WebSocketClass.prototype;
			rootObject.WebSocket = InterceptedWebSocket;
		}
		function requireOpenSocket(controller, method) {
			if (!activeSocket || activeSocket.readyState !== WebSocketClass.OPEN) throw createTransportError("WS_UNAVAILABLE", "Active WebSocket connection is missing. Please reload the Edvibe tab context.", {
				controller,
				method
			});
			return activeSocket;
		}
		function getConnectionState() {
			return { isOpen: Boolean(activeSocket && activeSocket.readyState === WebSocketClass.OPEN) };
		}
		function sendRequest(controller, method, projectName, valueObject) {
			return new Promise((resolve, reject) => {
				let socket;
				try {
					socket = requireOpenSocket(controller, method);
				} catch (error) {
					log("No active WebSocket connection.");
					reject(error);
					return;
				}
				const packet = createPacket(controller, method, projectName, valueObject);
				const timeoutId = setTimeoutFn(() => {
					pendingRequests.delete(packet.RequestId);
					log(`✕ ${controller}.${method} [${packet.RequestId}] timed out after ${requestTimeoutMs}ms`);
					reject(createTransportError("REQUEST_TIMEOUT", `${controller}:${method} timed out after ${requestTimeoutMs}ms.`, {
						controller,
						method,
						requestId: packet.RequestId
					}));
				}, requestTimeoutMs);
				pendingRequests.set(packet.RequestId, {
					resolve,
					reject,
					timeoutId,
					controller,
					method,
					startedAt: now()
				});
				log(`→ ${controller}.${method} [${packet.RequestId}]`);
				try {
					internalSendDepth += 1;
					try {
						socket.send(JSON.stringify(packet));
					} finally {
						internalSendDepth -= 1;
					}
				} catch (error) {
					clearTimeoutFn(timeoutId);
					pendingRequests.delete(packet.RequestId);
					log(`✕ ${controller}.${method} [${packet.RequestId}] send failed: ${error.message}`);
					reject(createTransportError("SEND_FAILED", error.message, {
						controller,
						method,
						requestId: packet.RequestId,
						cause: error
					}));
				}
			});
		}
		function sendWithoutResponse(controller, method, projectName, valueObject) {
			const socket = requireOpenSocket(controller, method);
			const packet = createPacket(controller, method, projectName, valueObject);
			log(`→ ${controller}.${method} [${packet.RequestId}] (no response expected)`);
			internalSendDepth += 1;
			try {
				socket.send(JSON.stringify(packet));
			} finally {
				internalSendDepth -= 1;
			}
		}
		return {
			install,
			sendRequest,
			sendWithoutResponse,
			subscribeFrames,
			getConnectionState
		};
	}
	//#endregion
	//#region src/shared/operation-guard.js
	function createOperationGuard() {
		let activeOperation = null;
		return {
			canStart() {
				return activeOperation === null;
			},
			activate(operationName) {
				if (activeOperation !== null) return false;
				activeOperation = operationName;
				return true;
			},
			release(operationName) {
				if (activeOperation !== operationName) return false;
				activeOperation = null;
				return true;
			},
			getActiveOperation() {
				return activeOperation;
			}
		};
	}
	//#endregion
	//#region src/shared/indexeddb.js
	var indexeddb_exports = /* @__PURE__ */ __exportAll({
		IndexedDbError: () => IndexedDbError,
		createIndexedDb: () => createIndexedDb,
		requestToPromise: () => requestToPromise,
		transactionToPromise: () => transactionToPromise
	});
	var IndexedDbError = class extends Error {
		constructor(message, context = {}, cause) {
			super(message, cause === void 0 ? void 0 : { cause });
			this.name = "IndexedDbError";
			this.context = Object.freeze({ ...context });
			if (cause !== void 0 && this.cause === void 0) this.cause = cause;
		}
	};
	function errorMessage(action, context) {
		const details = [
			context.database && `database=${context.database}`,
			context.stores && `stores=${context.stores.join(",")}`,
			context.store && `store=${context.store}`,
			context.index && `index=${context.index}`,
			context.mode && `mode=${context.mode}`,
			context.operation && `operation=${context.operation}`,
			context.version && `version=${context.version}`
		].filter(Boolean).join(" ");
		return details ? `${action} (${details})` : action;
	}
	function wrapError(action, context, cause) {
		if (cause instanceof IndexedDbError) return cause;
		return new IndexedDbError(errorMessage(action, context), context, cause);
	}
	function requestToPromise(request, context = {}) {
		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(wrapError("IndexedDB request failed", context, request.error));
		});
	}
	function transactionToPromise(transaction, context = {}) {
		return new Promise((resolve, reject) => {
			transaction.oncomplete = () => resolve();
			transaction.onerror = () => reject(wrapError("IndexedDB transaction failed", context, transaction.error));
			transaction.onabort = () => reject(wrapError("IndexedDB transaction aborted", context, transaction.error));
		});
	}
	function normalizeStores(storeNames) {
		const stores = typeof storeNames === "string" ? [storeNames] : Array.from(storeNames || []);
		if (stores.length === 0) throw new TypeError("At least one object store is required");
		return stores;
	}
	function normalizeMigrations(definition) {
		const migrations = Array.from(definition.migrations || []).sort((left, right) => left.version - right.version);
		const seen = /* @__PURE__ */ new Set();
		for (const migration of migrations) {
			if (!Number.isInteger(migration.version) || migration.version < 1 || migration.version > definition.version) throw new TypeError(`Invalid migration version: ${migration.version}`);
			if (seen.has(migration.version)) throw new TypeError(`Duplicate migration version: ${migration.version}`);
			if (typeof migration.migrate !== "function") throw new TypeError(`Migration ${migration.version} must define migrate()`);
			seen.add(migration.version);
		}
		return migrations;
	}
	function cursorToPromise(source, options, context) {
		const { range = null, direction = "next", limit = Infinity, keysOnly = false, map = null } = options || {};
		if (!Number.isFinite(limit) && limit !== Infinity) throw new TypeError("Cursor limit must be a finite number or Infinity");
		if (limit < 0) throw new RangeError("Cursor limit cannot be negative");
		if (limit === 0) return Promise.resolve([]);
		return new Promise((resolve, reject) => {
			const results = [];
			let request;
			try {
				request = keysOnly ? source.openKeyCursor(range, direction) : source.openCursor(range, direction);
			} catch (error) {
				reject(wrapError("Failed to open IndexedDB cursor", context, error));
				return;
			}
			request.onerror = () => reject(wrapError("IndexedDB cursor failed", context, request.error));
			request.onsuccess = () => {
				const cursor = request.result;
				if (!cursor || results.length >= limit) {
					resolve(results);
					return;
				}
				const raw = keysOnly ? cursor.primaryKey : cursor.value;
				results.push(typeof map === "function" ? map(raw, cursor) : raw);
				cursor.continue();
			};
		});
	}
	function createSourceHelpers(source, context) {
		return {
			raw: source,
			get(key) {
				return requestToPromise(source.get(key), {
					...context,
					operation: "get"
				});
			},
			getKey(query) {
				return requestToPromise(source.getKey(query), {
					...context,
					operation: "getKey"
				});
			},
			getAll(query = null, count) {
				return requestToPromise(source.getAll(query, count), {
					...context,
					operation: "getAll"
				});
			},
			getAllKeys(query = null, count) {
				return requestToPromise(source.getAllKeys(query, count), {
					...context,
					operation: "getAllKeys"
				});
			},
			count(query = null) {
				return requestToPromise(source.count(query), {
					...context,
					operation: "count"
				});
			},
			iterate(options = {}) {
				return cursorToPromise(source, options, {
					...context,
					operation: "iterate"
				});
			}
		};
	}
	function createStoreHelpers(store, context) {
		return {
			...createSourceHelpers(store, context),
			put(value, key) {
				return requestToPromise(store.put(value, key), {
					...context,
					operation: "put"
				});
			},
			add(value, key) {
				return requestToPromise(store.add(value, key), {
					...context,
					operation: "add"
				});
			},
			delete(key) {
				return requestToPromise(store.delete(key), {
					...context,
					operation: "delete"
				});
			},
			clear() {
				return requestToPromise(store.clear(), {
					...context,
					operation: "clear"
				});
			},
			index(indexName) {
				return createSourceHelpers(store.index(indexName), {
					...context,
					index: indexName
				});
			}
		};
	}
	function createIndexedDb(definition, options = {}) {
		if (!definition || typeof definition.name !== "string" || definition.name.length === 0) throw new TypeError("Database definition requires a non-empty name");
		if (!Number.isInteger(definition.version) || definition.version < 1) throw new TypeError("Database definition requires a positive integer version");
		const indexedDbFactory = options.indexedDB || globalThis.indexedDB;
		if (!indexedDbFactory || typeof indexedDbFactory.open !== "function") throw new TypeError("An IndexedDB factory is required");
		const migrations = normalizeMigrations(definition);
		let connection = null;
		let opening = null;
		function invalidate(db) {
			if (connection === db) connection = null;
			opening = null;
		}
		function open() {
			if (connection) return Promise.resolve(connection);
			if (opening) return opening;
			opening = new Promise((resolve, reject) => {
				let request;
				let settled = false;
				let blockedTimer = null;
				try {
					request = indexedDbFactory.open(definition.name, definition.version);
				} catch (error) {
					reject(wrapError("Failed to open IndexedDB database", {
						database: definition.name,
						version: definition.version
					}, error));
					return;
				}
				const fail = (error) => {
					if (settled) return;
					settled = true;
					if (blockedTimer !== null) clearTimeout(blockedTimer);
					opening = null;
					reject(error);
				};
				request.onblocked = () => {
					const context = {
						database: definition.name,
						version: definition.version,
						operation: "open"
					};
					const error = wrapError("IndexedDB upgrade is blocked by another open connection", context, request.error);
					if (typeof options.onBlocked === "function") options.onBlocked(error, context);
					if (options.blockedTimeoutMs > 0 && blockedTimer === null) blockedTimer = setTimeout(() => fail(error), options.blockedTimeoutMs);
				};
				request.onupgradeneeded = (event) => {
					const db = request.result;
					const transaction = request.transaction;
					try {
						for (const migration of migrations) if (migration.version > event.oldVersion && migration.version <= event.newVersion) migration.migrate({
							db,
							transaction,
							oldVersion: event.oldVersion,
							newVersion: event.newVersion,
							version: migration.version
						});
					} catch (error) {
						try {
							transaction.abort();
						} catch (_) {}
						fail(wrapError("IndexedDB migration failed", {
							database: definition.name,
							version: event.newVersion,
							operation: "migrate"
						}, error));
					}
				};
				request.onerror = () => fail(wrapError("Failed to open IndexedDB database", {
					database: definition.name,
					version: definition.version,
					operation: "open"
				}, request.error));
				request.onsuccess = () => {
					const db = request.result;
					if (settled) {
						db.close();
						return;
					}
					settled = true;
					if (blockedTimer !== null) clearTimeout(blockedTimer);
					connection = db;
					opening = null;
					db.onversionchange = () => {
						db.close();
						invalidate(db);
						if (typeof options.onVersionChange === "function") options.onVersionChange({
							database: definition.name,
							version: db.version
						});
					};
					resolve(db);
				};
			});
			return opening;
		}
		async function runTransaction(storeNames, mode, callback, operation = "transaction") {
			const stores = normalizeStores(storeNames);
			if (mode !== "readonly" && mode !== "readwrite") throw new TypeError(`Unsupported transaction mode: ${mode}`);
			if (typeof callback !== "function") throw new TypeError("Transaction callback must be a function");
			const db = await open();
			const context = {
				database: definition.name,
				stores,
				mode,
				operation
			};
			let transaction;
			try {
				transaction = db.transaction(stores, mode);
			} catch (error) {
				throw wrapError("Failed to create IndexedDB transaction", context, error);
			}
			const completion = transactionToPromise(transaction, context);
			const helpers = Object.create(null);
			for (const storeName of stores) helpers[storeName] = createStoreHelpers(transaction.objectStore(storeName), {
				...context,
				store: storeName
			});
			let result;
			try {
				result = callback({
					transaction,
					stores: helpers,
					store(name) {
						if (!helpers[name]) throw new IndexedDbError(errorMessage("Store is not part of this transaction", {
							...context,
							store: name
						}), {
							...context,
							store: name
						});
						return helpers[name];
					},
					abort(reason) {
						if (reason !== void 0 && transaction.error === null) try {
							Object.defineProperty(transaction, "__edvibeAbortReason", { value: reason });
						} catch (_) {}
						transaction.abort();
					}
				});
			} catch (error) {
				try {
					transaction.abort();
				} catch (_) {}
				try {
					await completion;
				} catch (_) {}
				throw wrapError("IndexedDB transaction callback failed", context, error);
			}
			try {
				const [value] = await Promise.all([Promise.resolve(result), completion]);
				return value;
			} catch (error) {
				throw wrapError("IndexedDB transaction did not commit", context, transaction.__edvibeAbortReason || error);
			}
		}
		function repository(storeName) {
			return {
				get(key) {
					return runTransaction(storeName, "readonly", ({ store }) => store(storeName).get(key), `get:${storeName}`);
				},
				put(value, key) {
					return runTransaction(storeName, "readwrite", ({ store }) => store(storeName).put(value, key), `put:${storeName}`);
				},
				add(value, key) {
					return runTransaction(storeName, "readwrite", ({ store }) => store(storeName).add(value, key), `add:${storeName}`);
				},
				delete(key) {
					return runTransaction(storeName, "readwrite", ({ store }) => store(storeName).delete(key), `delete:${storeName}`);
				},
				clear() {
					return runTransaction(storeName, "readwrite", ({ store }) => store(storeName).clear(), `clear:${storeName}`);
				},
				count(query = null) {
					return runTransaction(storeName, "readonly", ({ store }) => store(storeName).count(query), `count:${storeName}`);
				},
				iterate(options = {}) {
					return runTransaction(storeName, "readonly", ({ store }) => store(storeName).iterate(options), `iterate:${storeName}`);
				},
				queryIndex(indexName, options = {}) {
					return runTransaction(storeName, "readonly", ({ store }) => {
						return store(storeName).index(indexName).iterate(options);
					}, `query-index:${storeName}.${indexName}`);
				},
				newest(indexName, options = {}) {
					return this.queryIndex(indexName, {
						...options,
						direction: "prev"
					});
				}
			};
		}
		function close() {
			if (connection) {
				const db = connection;
				connection = null;
				db.close();
			}
			opening = null;
		}
		return Object.freeze({
			name: definition.name,
			version: definition.version,
			open,
			close,
			reset: close,
			transaction: runTransaction,
			readonly(storeNames, callback, operation) {
				return runTransaction(storeNames, "readonly", callback, operation);
			},
			readwrite(storeNames, callback, operation) {
				return runTransaction(storeNames, "readwrite", callback, operation);
			},
			repository
		});
	}
	var TERMINAL_STATUSES$3 = Object.freeze([
		"completed",
		"completed_with_failures",
		"cancelled",
		"interrupted"
	]);
	var COUNT_KEYS = Object.freeze([
		"requested",
		"eligible",
		"attempted",
		"successful",
		"noOp",
		"skipped",
		"failed",
		"notAttempted"
	]);
	var UNSAFE_FIELD_WORDS = /* @__PURE__ */ new Set([
		"auth",
		"authorization",
		"binary",
		"bytes",
		"cookie",
		"credential",
		"credentials",
		"frame",
		"frames",
		"image",
		"password",
		"recording",
		"response",
		"session",
		"token",
		"transport",
		"websocket"
	]);
	function validationError(message, path = "") {
		const error = new TypeError(path ? `${message} (${path})` : message);
		error.code = "INVALID_EXECUTION_RECORD";
		error.path = path;
		return error;
	}
	function assertPlainObject(value, path) {
		if (!value || typeof value !== "object" || Array.isArray(value)) throw validationError("Expected an object", path);
		const prototype = Object.getPrototypeOf(value);
		if (prototype !== Object.prototype && prototype !== null) throw validationError("Expected a plain object", path);
	}
	function normalizeIsoTimestamp(value, path) {
		const date = value instanceof Date ? value : new Date(value);
		if (Number.isNaN(date.getTime())) throw validationError("Expected a valid timestamp", path);
		return date.toISOString();
	}
	function normalizeNonEmptyString(value, path, maxLength = 160) {
		const normalized = String(value ?? "").trim();
		if (!normalized) throw validationError("Expected a non-empty string", path);
		if (normalized.length > maxLength) throw validationError(`String exceeds ${maxLength} characters`, path);
		return normalized;
	}
	function normalizeOptionalString(value, path, maxLength = 500) {
		if (value === void 0 || value === null || value === "") return null;
		const normalized = String(value).trim();
		if (normalized.length > maxLength) throw validationError(`String exceeds ${maxLength} characters`, path);
		return normalized || null;
	}
	function normalizeCount(value, path) {
		const count = Number(value ?? 0);
		if (!Number.isSafeInteger(count) || count < 0) throw validationError("Expected a non-negative safe integer", path);
		return count;
	}
	function isUnsafeFieldName(key) {
		const words = String(key).replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
		return words.includes("raw") || words.some((word) => UNSAFE_FIELD_WORDS.has(word));
	}
	function sanitizeJsonValue(value, path = "value", seen = /* @__PURE__ */ new WeakSet()) {
		if (value === null || typeof value === "string" || typeof value === "boolean") return value;
		if (typeof value === "number") {
			if (!Number.isFinite(value)) throw validationError("Expected a finite number", path);
			return value;
		}
		if (value === void 0) return null;
		if (typeof value === "bigint" || typeof value === "function" || typeof value === "symbol") throw validationError("Unsupported JSON value", path);
		if (typeof value !== "object") throw validationError("Unsupported value", path);
		if (seen.has(value)) throw validationError("Circular values are not supported", path);
		seen.add(value);
		try {
			if (Array.isArray(value)) return value.map((entry, index) => sanitizeJsonValue(entry, `${path}[${index}]`, seen));
			assertPlainObject(value, path);
			const output = {};
			for (const [key, entry] of Object.entries(value)) {
				if (isUnsafeFieldName(key)) throw validationError("Unsafe field is not allowed", `${path}.${key}`);
				output[key] = sanitizeJsonValue(entry, `${path}.${key}`, seen);
			}
			return output;
		} finally {
			seen.delete(value);
		}
	}
	function normalizePageContext(value = {}) {
		assertPlainObject(value, "pageContext");
		const marathonId = value.marathonId === void 0 || value.marathonId === null || value.marathonId === "" ? null : String(value.marathonId).trim();
		return Object.freeze({
			marathonId: marathonId || null,
			marathonName: normalizeOptionalString(value.marathonName, "pageContext.marathonName", 240)
		});
	}
	function normalizeCounts(value = {}) {
		assertPlainObject(value, "counts");
		const counts = {};
		for (const key of COUNT_KEYS) counts[key] = normalizeCount(value[key], `counts.${key}`);
		if (counts.successful + counts.failed > counts.attempted) throw validationError("Successful and failed counts cannot exceed attempted count", "counts");
		if (counts.attempted + counts.notAttempted > counts.eligible) throw validationError("Attempted and not-attempted counts cannot exceed eligible count", "counts");
		return Object.freeze(counts);
	}
	function normalizeResult(value, index) {
		assertPlainObject(value, `results[${index}]`);
		const attempts = value.attempts === void 0 ? 1 : normalizeCount(value.attempts, `results[${index}].attempts`);
		const data = value.data === void 0 ? {} : sanitizeJsonValue(value.data, `results[${index}].data`);
		return Object.freeze({
			order: index,
			itemId: normalizeOptionalString(value.itemId, `results[${index}].itemId`, 160),
			label: normalizeNonEmptyString(value.label ?? value.itemId ?? `Item ${index + 1}`, `results[${index}].label`, 500),
			status: normalizeNonEmptyString(value.status, `results[${index}].status`, 80),
			code: normalizeNonEmptyString(value.code, `results[${index}].code`, 120),
			message: normalizeNonEmptyString(value.message, `results[${index}].message`, 1e3),
			attempts,
			data: Object.freeze(data)
		});
	}
	function fallbackExecutionId(now, operationType) {
		const random = Math.random().toString(36).slice(2, 10);
		return `${operationType}-${now.getTime().toString(36)}-${random}`;
	}
	function buildExecutionRecord(input, options = {}) {
		assertPlainObject(input, "record");
		const now = options.now instanceof Date ? options.now : new Date(options.now || Date.now());
		const operationType = normalizeNonEmptyString(input.operationType, "operationType", 120);
		const cryptoApi = options.cryptoApi;
		const generatedId = typeof cryptoApi?.randomUUID === "function" ? cryptoApi.randomUUID() : fallbackExecutionId(now, operationType);
		const id = normalizeNonEmptyString(input.id || generatedId, "id", 200);
		const status = normalizeNonEmptyString(input.status, "status", 80);
		if (!TERMINAL_STATUSES$3.includes(status)) throw validationError("Unsupported terminal status", "status");
		const startedAt = normalizeIsoTimestamp(input.startedAt, "startedAt");
		const completedAt = normalizeIsoTimestamp(input.completedAt ?? now, "completedAt");
		if (new Date(completedAt).getTime() < new Date(startedAt).getTime()) throw validationError("Completion timestamp cannot precede start timestamp", "completedAt");
		const results = Array.isArray(input.results) ? input.results.map(normalizeResult) : (() => {
			throw validationError("Expected an array", "results");
		})();
		const record = {
			schemaVersion: 1,
			id,
			operationType,
			startedAt,
			completedAt,
			status,
			pageContext: normalizePageContext(input.pageContext || {}),
			counts: normalizeCounts(input.counts || {}),
			results: Object.freeze(results),
			message: normalizeOptionalString(input.message, "message", 1e3)
		};
		validateExecutionRecord(record);
		return Object.freeze(record);
	}
	function validateExecutionRecord(record) {
		assertPlainObject(record, "record");
		if (record.schemaVersion !== 1) throw validationError("Unsupported execution record schema version", "schemaVersion");
		normalizeNonEmptyString(record.id, "id", 200);
		normalizeNonEmptyString(record.operationType, "operationType", 120);
		normalizeIsoTimestamp(record.startedAt, "startedAt");
		normalizeIsoTimestamp(record.completedAt, "completedAt");
		if (!TERMINAL_STATUSES$3.includes(record.status)) throw validationError("Unsupported terminal status", "status");
		normalizePageContext(record.pageContext || {});
		normalizeCounts(record.counts || {});
		if (!Array.isArray(record.results)) throw validationError("Expected an array", "results");
		record.results.forEach((result, index) => normalizeResult(result, index));
		sanitizeJsonValue(record, "record");
		return true;
	}
	function cloneExecutionRecord(record) {
		validateExecutionRecord(record);
		return JSON.parse(JSON.stringify(record));
	}
	//#endregion
	//#region src/shared/execution-history-repository.js
	var HISTORY_DATABASE_NAME = "edvibe-toolbox";
	var HISTORY_STORE_NAME = "executionHistory";
	var HISTORY_DB_DEFINITION = Object.freeze({
		name: HISTORY_DATABASE_NAME,
		version: 1,
		migrations: Object.freeze([Object.freeze({
			version: 1,
			migrate({ db }) {
				if (db.objectStoreNames.contains("executionHistory")) return;
				const store = db.createObjectStore(HISTORY_STORE_NAME, { keyPath: "id" });
				store.createIndex("completedAt", "completedAt", { unique: false });
				store.createIndex("operationType", "operationType", { unique: false });
				store.createIndex("status", "status", { unique: false });
				store.createIndex("marathonId", "pageContext.marathonId", { unique: false });
			}
		})])
	});
	function normalizeDateBoundary(value, path, endOfDay = false) {
		if (!value) return null;
		const serialized = String(value);
		const date = /^\d{4}-\d{2}-\d{2}$/.test(serialized) ? /* @__PURE__ */ new Date(`${serialized}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`) : new Date(value);
		if (Number.isNaN(date.getTime())) throw new TypeError(`Invalid ${path}`);
		return date.getTime();
	}
	function matchesFilters(record, filters = {}) {
		if (filters.operationType && record.operationType !== filters.operationType) return false;
		if (filters.status && record.status !== filters.status) return false;
		if (filters.marathonId && String(record.pageContext?.marathonId || "") !== String(filters.marathonId)) return false;
		const completed = new Date(record.completedAt).getTime();
		const from = normalizeDateBoundary(filters.from, "from");
		const to = normalizeDateBoundary(filters.to, "to", true);
		if (from !== null && completed < from) return false;
		if (to !== null && completed > to) return false;
		return true;
	}
	function createExecutionHistoryRepository(options = {}) {
		const api = options.indexedDbApi || indexeddb_exports;
		if (!api?.createIndexedDb) throw new TypeError("IndexedDB API is required");
		const db = api.createIndexedDb(HISTORY_DB_DEFINITION, { indexedDB: options.indexedDB });
		const repository = db.repository(HISTORY_STORE_NAME);
		return Object.freeze({
			async persist(record) {
				validateExecutionRecord(record);
				await repository.put(record);
				return cloneExecutionRecord(record);
			},
			async get(executionId) {
				const record = await repository.get(String(executionId));
				return record ? cloneExecutionRecord(record) : null;
			},
			async list(filters = {}) {
				return (await repository.newest("completedAt")).filter((record) => matchesFilters(record, filters)).map(cloneExecutionRecord);
			},
			async delete(executionId) {
				await repository.delete(String(executionId));
			},
			async clear() {
				await repository.clear();
			},
			count() {
				return repository.count();
			},
			close() {
				db.close();
			}
		});
	}
	//#endregion
	//#region src/shared/execution-history-retention.js
	var RETENTION_STORAGE_KEY = "executionHistoryPreferences";
	var DEFAULT_RETENTION_PREFERENCES = Object.freeze({
		mode: "limits",
		maxCount: 100,
		maxAgeDays: 90,
		autoExport: false
	});
	function normalizePositiveInteger(value, fallback, path) {
		const number = Number(value);
		if (!Number.isSafeInteger(number) || number <= 0) {
			if (value === void 0 || value === null || value === "") return fallback;
			throw new TypeError(`${path} must be a positive integer`);
		}
		return number;
	}
	function normalizeRetentionPreferences(value = {}) {
		const mode = value.mode === "indefinite" ? "indefinite" : "limits";
		return Object.freeze({
			mode,
			maxCount: normalizePositiveInteger(value.maxCount, DEFAULT_RETENTION_PREFERENCES.maxCount, "maxCount"),
			maxAgeDays: normalizePositiveInteger(value.maxAgeDays, DEFAULT_RETENTION_PREFERENCES.maxAgeDays, "maxAgeDays"),
			autoExport: Boolean(value.autoExport)
		});
	}
	function createRetentionPreferenceStore(storage) {
		if (!storage || typeof storage.get !== "function" || typeof storage.set !== "function") throw new TypeError("A storage adapter with get() and set() is required");
		return Object.freeze({
			async get() {
				return normalizeRetentionPreferences(await storage.get("executionHistoryPreferences") || {});
			},
			async set(preferences) {
				const normalized = normalizeRetentionPreferences(preferences);
				await storage.set(RETENTION_STORAGE_KEY, normalized);
				return normalized;
			}
		});
	}
	async function applyRetention({ repository, preferences, now = /* @__PURE__ */ new Date(), protectedExecutionId = null }) {
		const normalized = normalizeRetentionPreferences(preferences);
		if (normalized.mode === "indefinite") return Object.freeze({ deletedIds: Object.freeze([]) });
		const records = await repository.list();
		const cutoff = now.getTime() - normalized.maxAgeDays * 24 * 60 * 60 * 1e3;
		const deleteIds = /* @__PURE__ */ new Set();
		records.forEach((record, index) => {
			if (record.id === protectedExecutionId) return;
			if (index >= normalized.maxCount || new Date(record.completedAt).getTime() < cutoff) deleteIds.add(record.id);
		});
		for (const executionId of deleteIds) await repository.delete(executionId);
		return Object.freeze({ deletedIds: Object.freeze([...deleteIds]) });
	}
	//#endregion
	//#region src/shared/execution-history-export.js
	function serializeExecutionRecord(record) {
		validateExecutionRecord(record);
		return `${JSON.stringify(record, null, 2)}\n`;
	}
	function serializeExecutionRecords(records) {
		if (!Array.isArray(records)) throw new TypeError("Records must be an array");
		records.forEach(validateExecutionRecord);
		return `${JSON.stringify(records, null, 2)}\n`;
	}
	function slug(value) {
		return String(value || "operation").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "operation";
	}
	function compactTimestamp(value) {
		return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
	}
	function createExecutionFilename(record) {
		validateExecutionRecord(record);
		return `edvibe-${slug(record.operationType)}-${compactTimestamp(record.completedAt)}-${slug(record.id).slice(-36)}.json`;
	}
	function createHistoryFilename(now = /* @__PURE__ */ new Date()) {
		return `edvibe-execution-history-${compactTimestamp(now)}.json`;
	}
	function createJsonDownloader(options = {}) {
		const documentApi = options.document || globalThis.document;
		const URLApi = options.URL || globalThis.URL;
		const BlobClass = options.Blob || globalThis.Blob;
		if (!documentApi?.createElement || !URLApi?.createObjectURL || !BlobClass) return Object.freeze({ download() {
			throw new Error("Browser download APIs are unavailable");
		} });
		return Object.freeze({ download({ filename, json }) {
			const blob = new BlobClass([json], { type: "application/json;charset=utf-8" });
			const url = URLApi.createObjectURL(blob);
			const anchor = documentApi.createElement("a");
			anchor.href = url;
			anchor.download = filename;
			anchor.hidden = true;
			(documentApi.body || documentApi.documentElement).append(anchor);
			try {
				anchor.click();
			} finally {
				anchor.remove();
				URLApi.revokeObjectURL(url);
			}
		} });
	}
	WINDOW_MESSAGE_TYPES.STORAGE_REQUEST;
	WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE;
	function createStorageBridge(options = {}) {
		const windowApi = options.window || globalThis.window;
		const cryptoApi = options.cryptoApi || globalThis.crypto;
		const timeoutMs = options.timeoutMs || 5e3;
		if (!windowApi?.postMessage || !windowApi?.addEventListener) throw new TypeError("Window messaging APIs are required");
		const pending = /* @__PURE__ */ new Map();
		const onMessage = (event) => {
			if (event.source !== windowApi || !isStorageResponseMessage(event.data)) return;
			const request = pending.get(event.data.requestId);
			if (!request) return;
			pending.delete(event.data.requestId);
			clearTimeout(request.timer);
			if (event.data.ok) request.resolve(event.data.value);
			else request.reject(new Error(event.data.error || "Storage request failed"));
		};
		windowApi.addEventListener("message", onMessage);
		function request(action, key, value) {
			const requestId = typeof cryptoApi?.randomUUID === "function" ? cryptoApi.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
			let message;
			try {
				message = createStorageRequest({
					requestId,
					action,
					key,
					value
				});
			} catch (error) {
				return Promise.reject(error);
			}
			return new Promise((resolve, reject) => {
				const timer = setTimeout(() => {
					pending.delete(requestId);
					reject(/* @__PURE__ */ new Error("Storage request timed out"));
				}, timeoutMs);
				pending.set(requestId, {
					resolve,
					reject,
					timer
				});
				windowApi.postMessage(message, "*");
			});
		}
		return Object.freeze({
			get(key) {
				return request(STORAGE_ACTIONS.GET, key);
			},
			set(key, value) {
				return request(STORAGE_ACTIONS.SET, key, value);
			},
			dispose() {
				windowApi.removeEventListener("message", onMessage);
				for (const value of pending.values()) {
					clearTimeout(value.timer);
					value.reject(/* @__PURE__ */ new Error("Storage bridge disposed"));
				}
				pending.clear();
			}
		});
	}
	//#endregion
	//#region src/shared/execution-history-service.js
	function createExecutionHistoryService(options) {
		const { repository, preferenceStore, downloader } = options || {};
		if (!repository || !preferenceStore || !downloader) throw new TypeError("Repository, preference store, and downloader are required");
		const cryptoApi = options.cryptoApi;
		const now = typeof options.now === "function" ? options.now : () => /* @__PURE__ */ new Date();
		async function persistTerminal(input) {
			const record = buildExecutionRecord(input, {
				cryptoApi,
				now: now()
			});
			try {
				await repository.persist(record);
			} catch (persistenceError) {
				return Object.freeze({
					stored: false,
					record,
					persistenceError,
					retentionError: null,
					exportError: null
				});
			}
			let preferences;
			let retentionError = null;
			let exportError = null;
			try {
				preferences = await preferenceStore.get();
				await applyRetention({
					repository,
					preferences,
					now: now(),
					protectedExecutionId: record.id
				});
			} catch (error) {
				retentionError = error;
				preferences = preferences || DEFAULT_RETENTION_PREFERENCES;
			}
			if (preferences.autoExport) try {
				downloadRecord(record);
			} catch (error) {
				exportError = error;
			}
			return Object.freeze({
				stored: true,
				record,
				persistenceError: null,
				retentionError,
				exportError
			});
		}
		function downloadRecord(record) {
			downloader.download({
				filename: createExecutionFilename(record),
				json: serializeExecutionRecord(record)
			});
		}
		return Object.freeze({
			persistTerminal,
			get: (executionId) => repository.get(executionId),
			list: (filters) => repository.list(filters),
			delete: (executionId) => repository.delete(executionId),
			clear: () => repository.clear(),
			getPreferences: () => preferenceStore.get(),
			setPreferences: (preferences) => preferenceStore.set(preferences),
			exportRecord: async (executionId) => {
				const record = await repository.get(executionId);
				if (!record) throw new Error("Execution record was not found");
				downloadRecord(record);
				return record;
			},
			exportFiltered: async (filters = {}) => {
				const records = await repository.list(filters);
				downloader.download({
					filename: createHistoryFilename(now()),
					json: serializeExecutionRecords(records)
				});
				return records;
			}
		});
	}
	//#endregion
	//#region src/components/execution-history-dialog.styles.js
	var executionHistoryDialogStyles = i$3`
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

`;
	//#endregion
	//#region src/components/execution-history-dialog.js
	var EXECUTION_HISTORY_DIALOG_TAG = "edvibe-toolbox-execution-history-dialog";
	var STATUS_LABELS = Object.freeze({
		completed: "Completed",
		completed_with_failures: "Completed with failures",
		cancelled: "Cancelled",
		interrupted: "Interrupted"
	});
	function formatExecutionStatus(status) {
		return STATUS_LABELS[status] || String(status || "Unknown");
	}
	function formatExecutionDate(value, locale) {
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? String(value || "") : new Intl.DateTimeFormat(locale || void 0, {
			dateStyle: "medium",
			timeStyle: "short"
		}).format(date);
	}
	function createSummary(record) {
		return Object.freeze({
			title: record.operationType,
			subtitle: record.pageContext?.marathonName || (record.pageContext?.marathonId ? `Marathon #${record.pageContext.marathonId}` : "No marathon context"),
			outcome: `${record.counts.successful} successful · ${record.counts.failed} failed · ${record.counts.skipped} skipped`
		});
	}
	var ExecutionHistoryDialog = class extends i {
		static styles = [
			componentFoundationStyles,
			dialogFoundationStyles,
			executionHistoryDialogStyles
		];
		static properties = {
			options: { state: true },
			records: { state: true },
			selectedRecord: { state: true },
			operationTypes: { state: true },
			filterOperationType: { state: true },
			filterStatus: { state: true },
			filterMarathonId: { state: true },
			filterFrom: { state: true },
			filterTo: { state: true },
			listState: { state: true },
			listMessage: { state: true },
			preferences: { state: true },
			toastMessage: { state: true },
			toastError: { state: true }
		};
		constructor() {
			super();
			this.options = null;
			this.records = [];
			this.selectedRecord = null;
			this.operationTypes = [];
			this.filterOperationType = "";
			this.filterStatus = "";
			this.filterMarathonId = "";
			this.filterFrom = "";
			this.filterTo = "";
			this.listState = "loading";
			this.listMessage = "Loading history…";
			this.preferences = {
				mode: "limits",
				maxCount: "",
				maxAgeDays: "",
				autoExport: false
			};
			this.toastMessage = "";
			this.toastError = false;
			this.initializationPromise = null;
			this.handleKeydownBound = (event) => {
				if (event.key === "Escape") this.options?.onClose?.();
			};
		}
		configure(options = {}) {
			this.options = options && typeof options === "object" ? options : {};
			if (this.isConnected) this.initialize();
			return this;
		}
		connectedCallback() {
			super.connectedCallback();
			this.addEventListener("keydown", this.handleKeydownBound);
			this.initialize();
		}
		disconnectedCallback() {
			this.removeEventListener("keydown", this.handleKeydownBound);
			super.disconnectedCallback();
		}
		initialize() {
			if (!this.options) return Promise.resolve();
			if (this.initializationPromise) return this.initializationPromise;
			this.initializationPromise = (async () => {
				await this.updateComplete;
				this.shadowRoot?.querySelector("[data-action=\"close\"]")?.focus();
				await this.loadPreferences();
				await this.loadRecords();
				if (this.options.initialExecutionId) await this.openRecord(this.options.initialExecutionId);
			})();
			return this.initializationPromise;
		}
		get filters() {
			const entries = {
				operationType: this.filterOperationType,
				status: this.filterStatus,
				marathonId: this.filterMarathonId,
				from: this.filterFrom,
				to: this.filterTo
			};
			return Object.fromEntries(Object.entries(entries).filter(([, value]) => value !== ""));
		}
		setFilter(name, value) {
			const normalized = String(value || "");
			if (name === "operationType") this.filterOperationType = normalized;
			if (name === "status") this.filterStatus = normalized;
			if (name === "marathonId") this.filterMarathonId = normalized;
			if (name === "from") this.filterFrom = normalized;
			if (name === "to") this.filterTo = normalized;
		}
		async loadRecords() {
			this.listState = "loading";
			this.listMessage = "Loading history…";
			try {
				this.records = await this.options.service.list(this.filters);
				this.operationTypes = [.../* @__PURE__ */ new Set([...this.operationTypes, ...this.records.map((record) => record.operationType)])].sort();
				this.listState = this.records.length === 0 ? "empty" : "ready";
				this.listMessage = this.records.length === 0 ? "No executions match these filters." : "";
			} catch (error) {
				this.records = [];
				this.listState = "error";
				this.listMessage = error.message || "Could not load execution history.";
			}
		}
		renderEmptyDetail() {
			this.selectedRecord = null;
		}
		async openRecord(executionId) {
			try {
				const record = await this.options.service.get(executionId);
				if (!record) throw new Error("Execution record was not found.");
				this.selectedRecord = record;
			} catch (error) {
				this.showToast(error.message || "Could not open the execution.", true);
			}
		}
		async loadPreferences() {
			try {
				const preferences = await this.options.service.getPreferences();
				this.preferences = {
					mode: preferences.mode,
					maxCount: preferences.maxCount,
					maxAgeDays: preferences.maxAgeDays,
					autoExport: Boolean(preferences.autoExport)
				};
			} catch (error) {
				this.showToast(error.message || "Could not load retention settings.", true);
			}
		}
		updatePreference(name, value) {
			this.preferences = {
				...this.preferences,
				[name]: value
			};
		}
		async savePreferences() {
			const preferences = {
				mode: this.preferences.mode,
				maxCount: Number(this.preferences.maxCount),
				maxAgeDays: Number(this.preferences.maxAgeDays),
				autoExport: Boolean(this.preferences.autoExport)
			};
			try {
				await this.options.service.setPreferences(preferences);
				this.showToast("Retention settings saved.");
			} catch (error) {
				this.showToast(error.message || "Could not save retention settings.", true);
			}
		}
		async resetFilters() {
			this.filterOperationType = "";
			this.filterStatus = "";
			this.filterMarathonId = "";
			this.filterFrom = "";
			this.filterTo = "";
			await this.loadRecords();
		}
		confirm(message) {
			return this.ownerDocument.defaultView.confirm(message);
		}
		async runAction(action, successMessage, failureMessage) {
			try {
				await action();
				this.showToast(successMessage);
			} catch (error) {
				this.showToast(error.message || failureMessage, true);
			}
		}
		async runMutation(action, successMessage, failureMessage) {
			try {
				await action();
				this.renderEmptyDetail();
				await this.loadRecords();
				this.showToast(successMessage);
			} catch (error) {
				this.showToast(error.message || failureMessage, true);
			}
		}
		async handleAction(action) {
			if (action === "close") this.options.onClose?.();
			if (action === "reset-filters") await this.resetFilters();
			if (action === "export-filtered") await this.runAction(() => this.options.service.exportFiltered(this.filters), "Filtered history exported.", "Could not export history.");
			if (action === "download-one" && this.selectedRecord) await this.runAction(() => this.options.service.exportRecord(this.selectedRecord.id), "Execution exported.", "Could not export execution.");
			if (action === "delete-one" && this.selectedRecord && this.confirm(`Delete execution ${this.selectedRecord.id}?`)) await this.runMutation(() => this.options.service.delete(this.selectedRecord.id), "Execution deleted.", "Could not delete the execution.");
			if (action === "clear-all" && this.confirm("Clear all execution history? This cannot be undone.")) await this.runMutation(() => this.options.service.clear(), "Execution history cleared.", "Could not clear execution history.");
			if (action === "save-preferences") await this.savePreferences();
		}
		showToast(message, isError = false) {
			this.toastMessage = String(message || "");
			this.toastError = Boolean(isError);
		}
		renderRecord(record) {
			const summary = createSummary(record);
			return b`
            <button type="button" class="record-card" data-execution-id=${record.id}
                data-status=${record.status}
                aria-pressed=${String(this.selectedRecord?.id === record.id)}
                @click=${() => this.openRecord(record.id)}>
                <span class="record-heading">
                    <strong>${summary.title}</strong>
                    <span class="status-chip">${formatExecutionStatus(record.status)}</span>
                </span>
                <span class="record-context">${summary.subtitle}</span>
                <span class="record-outcome">${summary.outcome}</span>
                <time>${formatExecutionDate(record.completedAt)}</time>
            </button>
        `;
		}
		renderOutcome(result) {
			const hasData = result.data && Object.keys(result.data).length > 0;
			return b`
            <article class="outcome-card" data-status=${result.status}>
                <div><strong>${result.label}</strong><span class="status-chip">${result.status}</span></div>
                <p>${result.message}</p>
                <small>${result.code} · ${result.attempts} attempt${result.attempts === 1 ? "" : "s"}</small>
                ${hasData ? b`
                    <details><summary>Item details</summary><pre>${JSON.stringify(result.data, null, 2)}</pre></details>
                ` : ""}
            </article>
        `;
		}
		renderDetail() {
			const record = this.selectedRecord;
			if (!record) return b`
                <div class="detail-placeholder">
                    <span aria-hidden="true">↗</span>
                    <h3>Select an execution</h3>
                    <p>Its summary and ordered item outcomes will appear here.</p>
                </div>
            `;
			const context = [
				["Execution ID", record.id],
				["Marathon", record.pageContext?.marathonName || record.pageContext?.marathonId || "Not recorded"],
				["Started", formatExecutionDate(record.startedAt)],
				["Completed", formatExecutionDate(record.completedAt)]
			];
			return b`
            <section class="detail-header">
                <div>
                    <h3>${record.operationType}</h3>
                    <p>${formatExecutionStatus(record.status)} · ${formatExecutionDate(record.completedAt)}</p>
                </div>
                <div class="detail-actions">
                    <button type="button" class="secondary" @click=${() => this.handleAction("download-one")}>Download JSON</button>
                    <button type="button" class="danger secondary" @click=${() => this.handleAction("delete-one")}>Delete</button>
                </div>
            </section>
            <dl class="summary-grid">
                ${context.map(([label, value]) => b`<div><dt>${label}</dt><dd>${value}</dd></div>`)}
            </dl>
            <section class="counts">
                ${Object.entries(record.counts).map(([key, value]) => b`
                    <div><strong>${value}</strong><span>${key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)}</span></div>
                `)}
            </section>
            <section class="outcomes">
                <h4>Item outcomes (${record.results.length})</h4>
                ${record.results.length === 0 ? b`<p class="muted">No per-item outcomes were recorded.</p>` : record.results.map((result) => this.renderOutcome(result))}
            </section>
        `;
		}
		render() {
			const listVisible = this.listState === "ready";
			const stateVisible = !listVisible;
			const stateClass = `state-card${this.listState === "error" ? " is-error" : ""}`;
			const indefinite = this.preferences.mode === "indefinite";
			const toastClass = `toast${this.toastError ? " is-error" : ""}`;
			return b`
<div class="overlay">
                <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="history-title">
                    <header class="dialog-header">
                        <div><p class="eyebrow">Edvibe Toolbox</p><h2 id="history-title">Execution history</h2><p class="header-copy">Browse terminal operation reports stored in this browser.</p></div>
                        <button class="icon-button" type="button" data-action="close" aria-label="Close" @click=${() => this.handleAction("close")}>×</button>
                    </header>
                    <div class="workspace">
                        <aside class="browser-panel">
                            <form class="filters" data-role="filters" @submit=${(event) => {
				event.preventDefault();
				this.loadRecords();
			}}>
                                <label>Operation<select name="operationType" .value=${this.filterOperationType} @change=${(event) => this.setFilter("operationType", event.currentTarget.value)}>
                                    <option value="">All operations</option>
                                    ${this.operationTypes.map((operationType) => b`<option value=${operationType}>${operationType}</option>`)}
                                </select></label>
                                <label>Status<select name="status" .value=${this.filterStatus} @change=${(event) => this.setFilter("status", event.currentTarget.value)}>
                                    <option value="">All statuses</option><option value="completed">Completed</option><option value="completed_with_failures">Completed with failures</option><option value="cancelled">Cancelled</option><option value="interrupted">Interrupted</option>
                                </select></label>
                                <label>Marathon<input name="marathonId" type="search" inputmode="numeric" placeholder="Any marathon" .value=${this.filterMarathonId} @input=${(event) => this.setFilter("marathonId", event.currentTarget.value)}></label>
                                <div class="date-fields">
                                    <label>From<input name="from" type="date" .value=${this.filterFrom} @input=${(event) => this.setFilter("from", event.currentTarget.value)}></label>
                                    <label>To<input name="to" type="date" .value=${this.filterTo} @input=${(event) => this.setFilter("to", event.currentTarget.value)}></label>
                                </div>
                                <div class="filter-actions"><button type="submit">Apply</button><button type="button" class="secondary" @click=${() => this.handleAction("reset-filters")}>Reset</button></div>
                            </form>
                            <div class="list-toolbar"><strong data-role="record-count">${this.records.length} execution${this.records.length === 1 ? "" : "s"}</strong><button type="button" class="secondary compact" @click=${() => this.handleAction("export-filtered")}>Export filtered</button></div>
                            <div class=${stateClass} data-role="state" ?hidden=${!stateVisible}>${this.listMessage}</div>
                            <div class="record-list" data-role="record-list" ?hidden=${!listVisible}>${this.records.map((record) => this.renderRecord(record))}</div>
                        </aside>
                        <main class="detail-panel" data-role="detail">${this.renderDetail()}</main>
                    </div>
                    <footer class="dialog-footer">
                        <details class="retention-settings"><summary>Retention & automatic export</summary><div class="settings-grid">
                            <label class="checkbox"><input type="checkbox" name="keepIndefinitely" .checked=${indefinite} @change=${(event) => this.updatePreference("mode", event.currentTarget.checked ? "indefinite" : "limits")}>Keep indefinitely</label>
                            <label>Newest executions<input type="number" name="maxCount" min="1" step="1" .value=${String(this.preferences.maxCount)} ?disabled=${indefinite} @input=${(event) => this.updatePreference("maxCount", event.currentTarget.value)}></label>
                            <label>Maximum age, days<input type="number" name="maxAgeDays" min="1" step="1" .value=${String(this.preferences.maxAgeDays)} ?disabled=${indefinite} @input=${(event) => this.updatePreference("maxAgeDays", event.currentTarget.value)}></label>
                            <label class="checkbox"><input type="checkbox" name="autoExport" .checked=${this.preferences.autoExport} @change=${(event) => this.updatePreference("autoExport", event.currentTarget.checked)}>Download JSON after persistence</label>
                            <button type="button" @click=${() => this.handleAction("save-preferences")}>Save settings</button>
                        </div></details>
                        <div class="footer-actions"><button type="button" class="danger secondary" @click=${() => this.handleAction("clear-all")}>Clear all history</button><button type="button" @click=${() => this.handleAction("close")}>Close</button></div>
                        <p class=${toastClass} data-role="toast" role="status" ?hidden=${!this.toastMessage}>${this.toastMessage}</p>
                    </footer>
                </section>
            </div>
        `;
		}
	};
	if (!customElements.get("edvibe-toolbox-execution-history-dialog")) customElements.define(EXECUTION_HISTORY_DIALOG_TAG, ExecutionHistoryDialog);
	var executionHistoryDialogApi = Object.freeze({
		EXECUTION_HISTORY_DIALOG_TAG,
		ExecutionHistoryDialog,
		formatExecutionStatus,
		formatExecutionDate,
		createSummary
	});
	globalThis.EdVibeExecutionHistoryDialog = executionHistoryDialogApi;
	//#endregion
	//#region src/features/execution-history.js
	var HISTORY_OVERLAY_ID = "edvibe-toolbox-execution-history";
	function createExecutionHistoryFeature({ service, canStart, onActiveChange, createDialog, log = () => {} }) {
		let active = false;
		function open({ executionId = null } = {}) {
			if (active || document.getElementById("edvibe-toolbox-execution-history")) return;
			if (!canStart()) {
				window.alert("Another Edvibe Toolbox operation is already running.");
				return;
			}
			active = true;
			onActiveChange(true);
			try {
				const dialog = createDialog();
				dialog.id = HISTORY_OVERLAY_ID;
				dialog.configure({
					service,
					initialExecutionId: executionId,
					onClose() {
						dialog.remove();
						active = false;
						onActiveChange(false);
					}
				});
				(document.body || document.documentElement).append(dialog);
			} catch (error) {
				active = false;
				onActiveChange(false);
				log("Failed to open execution history:", error);
				window.alert(error.message || "Could not open execution history.");
			}
		}
		return Object.freeze({ open });
	}
	/*!
	
	JSZip v3.10.1 - A JavaScript class for generating and reading zip files
	<http://stuartk.com/jszip>
	
	(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
	Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.
	
	JSZip uses the library pako released under the MIT license :
	https://github.com/nodeca/pako/blob/main/LICENSE
	*/
	//#endregion
	//#region node_modules/turndown/lib/turndown.browser.es.js
	var import_jszip_min = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function(e) {
			if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
			else if ("function" == typeof define && define.amd) define([], e);
			else ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).JSZip = e();
		})(function() {
			return function s(a, o, h) {
				function u(r, e) {
					if (!o[r]) {
						if (!a[r]) {
							var t = "function" == typeof require && require;
							if (!e && t) return t(r, !0);
							if (l) return l(r, !0);
							var n = /* @__PURE__ */ new Error("Cannot find module '" + r + "'");
							throw n.code = "MODULE_NOT_FOUND", n;
						}
						var i = o[r] = { exports: {} };
						a[r][0].call(i.exports, function(e) {
							var t = a[r][1][e];
							return u(t || e);
						}, i, i.exports, s, a, o, h);
					}
					return o[r].exports;
				}
				for (var l = "function" == typeof require && require, e = 0; e < h.length; e++) u(h[e]);
				return u;
			}({
				1: [function(e, t, r) {
					"use strict";
					var d = e("./utils"), c = e("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
					r.encode = function(e) {
						for (var t, r, n, i, s, a, o, h = [], u = 0, l = e.length, f = l, c = "string" !== d.getTypeOf(e); u < e.length;) f = l - u, n = c ? (t = e[u++], r = u < l ? e[u++] : 0, u < l ? e[u++] : 0) : (t = e.charCodeAt(u++), r = u < l ? e.charCodeAt(u++) : 0, u < l ? e.charCodeAt(u++) : 0), i = t >> 2, s = (3 & t) << 4 | r >> 4, a = 1 < f ? (15 & r) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
						return h.join("");
					}, r.decode = function(e) {
						var t, r, n, i, s, a, o = 0, h = 0, u = "data:";
						if (e.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
						var l, f = 3 * (e = e.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
						if (e.charAt(e.length - 1) === p.charAt(64) && f--, e.charAt(e.length - 2) === p.charAt(64) && f--, f % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
						for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e.length;) t = p.indexOf(e.charAt(o++)) << 2 | (i = p.indexOf(e.charAt(o++))) >> 4, r = (15 & i) << 4 | (s = p.indexOf(e.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p.indexOf(e.charAt(o++))), l[h++] = t, 64 !== s && (l[h++] = r), 64 !== a && (l[h++] = n);
						return l;
					};
				}, {
					"./support": 30,
					"./utils": 32
				}],
				2: [function(e, t, r) {
					"use strict";
					var n = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
					function o(e, t, r, n, i) {
						this.compressedSize = e, this.uncompressedSize = t, this.crc32 = r, this.compression = n, this.compressedContent = i;
					}
					o.prototype = {
						getContentWorker: function() {
							var e = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t = this;
							return e.on("end", function() {
								if (this.streamInfo.data_length !== t.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
							}), e;
						},
						getCompressedWorker: function() {
							return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
						}
					}, o.createWorkerFrom = function(e, t, r) {
						return e.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new a("compressedSize")).withStreamInfo("compression", t);
					}, t.exports = o;
				}, {
					"./external": 6,
					"./stream/Crc32Probe": 25,
					"./stream/DataLengthProbe": 26,
					"./stream/DataWorker": 27
				}],
				3: [function(e, t, r) {
					"use strict";
					var n = e("./stream/GenericWorker");
					r.STORE = {
						magic: "\0\0",
						compressWorker: function() {
							return new n("STORE compression");
						},
						uncompressWorker: function() {
							return new n("STORE decompression");
						}
					}, r.DEFLATE = e("./flate");
				}, {
					"./flate": 7,
					"./stream/GenericWorker": 28
				}],
				4: [function(e, t, r) {
					"use strict";
					var n = e("./utils");
					var o = function() {
						for (var e, t = [], r = 0; r < 256; r++) {
							e = r;
							for (var n = 0; n < 8; n++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
							t[r] = e;
						}
						return t;
					}();
					t.exports = function(e, t) {
						return void 0 !== e && e.length ? "string" !== n.getTypeOf(e) ? function(e, t, r, n) {
							var i = o, s = n + r;
							e ^= -1;
							for (var a = n; a < s; a++) e = e >>> 8 ^ i[255 & (e ^ t[a])];
							return -1 ^ e;
						}(0 | t, e, e.length, 0) : function(e, t, r, n) {
							var i = o, s = n + r;
							e ^= -1;
							for (var a = n; a < s; a++) e = e >>> 8 ^ i[255 & (e ^ t.charCodeAt(a))];
							return -1 ^ e;
						}(0 | t, e, e.length, 0) : 0;
					};
				}, { "./utils": 32 }],
				5: [function(e, t, r) {
					"use strict";
					r.base64 = !1, r.binary = !1, r.dir = !1, r.createFolders = !0, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
				}, {}],
				6: [function(e, t, r) {
					"use strict";
					var n = null;
					n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = { Promise: n };
				}, { lie: 37 }],
				7: [function(e, t, r) {
					"use strict";
					var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n ? "uint8array" : "array";
					function h(e, t) {
						a.call(this, "FlateWorker/" + e), this._pako = null, this._pakoAction = e, this._pakoOptions = t, this.meta = {};
					}
					r.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function(e) {
						this.meta = e.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, e.data), !1);
					}, h.prototype.flush = function() {
						a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], !0);
					}, h.prototype.cleanUp = function() {
						a.prototype.cleanUp.call(this), this._pako = null;
					}, h.prototype._createPako = function() {
						this._pako = new i[this._pakoAction]({
							raw: !0,
							level: this._pakoOptions.level || -1
						});
						var t = this;
						this._pako.onData = function(e) {
							t.push({
								data: e,
								meta: t.meta
							});
						};
					}, r.compressWorker = function(e) {
						return new h("Deflate", e);
					}, r.uncompressWorker = function() {
						return new h("Inflate", {});
					};
				}, {
					"./stream/GenericWorker": 28,
					"./utils": 32,
					pako: 38
				}],
				8: [function(e, t, r) {
					"use strict";
					function A(e, t) {
						var r, n = "";
						for (r = 0; r < t; r++) n += String.fromCharCode(255 & e), e >>>= 8;
						return n;
					}
					function n(e, t, r, n, i, s) {
						var a, o, h = e.file, u = e.compression, l = s !== O.utf8encode, f = I.transformTo("string", s(h.name)), c = I.transformTo("string", O.utf8encode(h.name)), d = h.comment, p = I.transformTo("string", s(d)), m = I.transformTo("string", O.utf8encode(d)), _ = c.length !== h.name.length, g = m.length !== d.length, b = "", v = "", y = "", w = h.dir, k = h.date, x = {
							crc32: 0,
							compressedSize: 0,
							uncompressedSize: 0
						};
						t && !r || (x.crc32 = e.crc32, x.compressedSize = e.compressedSize, x.uncompressedSize = e.uncompressedSize);
						var S = 0;
						t && (S |= 8), l || !_ && !g || (S |= 2048);
						var z = 0, C = 0;
						w && (z |= 16), "UNIX" === i ? (C = 798, z |= function(e, t) {
							var r = e;
							return e || (r = t ? 16893 : 33204), (65535 & r) << 16;
						}(h.unixPermissions, w)) : (C = 20, z |= function(e) {
							return 63 & (e || 0);
						}(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y);
						var E = "";
						return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), {
							fileRecord: R.LOCAL_FILE_HEADER + E + f + b,
							dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(n, 4) + f + b + p
						};
					}
					var I = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B = e("../crc32"), R = e("../signature");
					function s(e, t, r, n) {
						i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t, this.zipPlatform = r, this.encodeFileName = n, this.streamFiles = e, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
					}
					I.inherits(s, i), s.prototype.push = function(e) {
						var t = e.meta.percent || 0, r = this.entriesCount, n = this._sources.length;
						this.accumulate ? this.contentBuffer.push(e) : (this.bytesWritten += e.data.length, i.prototype.push.call(this, {
							data: e.data,
							meta: {
								currentFile: this.currentFile,
								percent: r ? (t + 100 * (r - n - 1)) / r : 100
							}
						}));
					}, s.prototype.openedSource = function(e) {
						this.currentSourceOffset = this.bytesWritten, this.currentFile = e.file.name;
						var t = this.streamFiles && !e.file.dir;
						if (t) {
							var r = n(e, t, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
							this.push({
								data: r.fileRecord,
								meta: { percent: 0 }
							});
						} else this.accumulate = !0;
					}, s.prototype.closedSource = function(e) {
						this.accumulate = !1;
						var t = this.streamFiles && !e.file.dir, r = n(e, t, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
						if (this.dirRecords.push(r.dirRecord), t) this.push({
							data: function(e) {
								return R.DATA_DESCRIPTOR + A(e.crc32, 4) + A(e.compressedSize, 4) + A(e.uncompressedSize, 4);
							}(e),
							meta: { percent: 100 }
						});
						else for (this.push({
							data: r.fileRecord,
							meta: { percent: 0 }
						}); this.contentBuffer.length;) this.push(this.contentBuffer.shift());
						this.currentFile = null;
					}, s.prototype.flush = function() {
						for (var e = this.bytesWritten, t = 0; t < this.dirRecords.length; t++) this.push({
							data: this.dirRecords[t],
							meta: { percent: 100 }
						});
						var r = this.bytesWritten - e, n = function(e, t, r, n, i) {
							var s = I.transformTo("string", i(n));
							return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e, 2) + A(e, 2) + A(t, 4) + A(r, 4) + A(s.length, 2) + s;
						}(this.dirRecords.length, r, e, this.zipComment, this.encodeFileName);
						this.push({
							data: n,
							meta: { percent: 100 }
						});
					}, s.prototype.prepareNextSource = function() {
						this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
					}, s.prototype.registerPrevious = function(e) {
						this._sources.push(e);
						var t = this;
						return e.on("data", function(e) {
							t.processChunk(e);
						}), e.on("end", function() {
							t.closedSource(t.previous.streamInfo), t._sources.length ? t.prepareNextSource() : t.end();
						}), e.on("error", function(e) {
							t.error(e);
						}), this;
					}, s.prototype.resume = function() {
						return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
					}, s.prototype.error = function(e) {
						var t = this._sources;
						if (!i.prototype.error.call(this, e)) return !1;
						for (var r = 0; r < t.length; r++) try {
							t[r].error(e);
						} catch (e) {}
						return !0;
					}, s.prototype.lock = function() {
						i.prototype.lock.call(this);
						for (var e = this._sources, t = 0; t < e.length; t++) e[t].lock();
					}, t.exports = s;
				}, {
					"../crc32": 4,
					"../signature": 23,
					"../stream/GenericWorker": 28,
					"../utf8": 31,
					"../utils": 32
				}],
				9: [function(e, t, r) {
					"use strict";
					var u = e("../compressions"), n = e("./ZipFileWorker");
					r.generateWorker = function(e, a, t) {
						var o = new n(a.streamFiles, t, a.platform, a.encodeFileName), h = 0;
						try {
							e.forEach(function(e, t) {
								h++;
								var r = function(e, t) {
									var r = e || t, n = u[r];
									if (!n) throw new Error(r + " is not a valid compression method !");
									return n;
								}(t.options.compression, a.compression), n = t.options.compressionOptions || a.compressionOptions || {}, i = t.dir, s = t.date;
								t._compressWorker(r, n).withStreamInfo("file", {
									name: e,
									dir: i,
									date: s,
									comment: t.comment || "",
									unixPermissions: t.unixPermissions,
									dosPermissions: t.dosPermissions
								}).pipe(o);
							}), o.entriesCount = h;
						} catch (e) {
							o.error(e);
						}
						return o;
					};
				}, {
					"../compressions": 3,
					"./ZipFileWorker": 8
				}],
				10: [function(e, t, r) {
					"use strict";
					function n() {
						if (!(this instanceof n)) return new n();
						if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
						this.files = Object.create(null), this.comment = null, this.root = "", this.clone = function() {
							var e = new n();
							for (var t in this) "function" != typeof this[t] && (e[t] = this[t]);
							return e;
						};
					}
					(n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(e, t) {
						return new n().loadAsync(e, t);
					}, n.external = e("./external"), t.exports = n;
				}, {
					"./defaults": 5,
					"./external": 6,
					"./load": 11,
					"./object": 15,
					"./support": 30
				}],
				11: [function(e, t, r) {
					"use strict";
					var u = e("./utils"), i = e("./external"), n = e("./utf8"), s = e("./zipEntries"), a = e("./stream/Crc32Probe"), l = e("./nodejsUtils");
					function f(n) {
						return new i.Promise(function(e, t) {
							var r = n.decompressed.getContentWorker().pipe(new a());
							r.on("error", function(e) {
								t(e);
							}).on("end", function() {
								r.streamInfo.crc32 !== n.decompressed.crc32 ? t(/* @__PURE__ */ new Error("Corrupted zip : CRC32 mismatch")) : e();
							}).resume();
						});
					}
					t.exports = function(e, o) {
						var h = this;
						return o = u.extend(o || {}, {
							base64: !1,
							checkCRC32: !1,
							optimizedBinaryString: !1,
							createFolders: !1,
							decodeFileName: n.utf8decode
						}), l.isNode && l.isStream(e) ? i.Promise.reject(/* @__PURE__ */ new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e, !0, o.optimizedBinaryString, o.base64).then(function(e) {
							var t = new s(o);
							return t.load(e), t;
						}).then(function(e) {
							var t = [i.Promise.resolve(e)], r = e.files;
							if (o.checkCRC32) for (var n = 0; n < r.length; n++) t.push(f(r[n]));
							return i.Promise.all(t);
						}).then(function(e) {
							for (var t = e.shift(), r = t.files, n = 0; n < r.length; n++) {
								var i = r[n], s = i.fileNameStr, a = u.resolve(i.fileNameStr);
								h.file(a, i.decompressed, {
									binary: !0,
									optimizedBinaryString: !0,
									date: i.date,
									dir: i.dir,
									comment: i.fileCommentStr.length ? i.fileCommentStr : null,
									unixPermissions: i.unixPermissions,
									dosPermissions: i.dosPermissions,
									createFolders: o.createFolders
								}), i.dir || (h.file(a).unsafeOriginalName = s);
							}
							return t.zipComment.length && (h.comment = t.zipComment), h;
						});
					};
				}, {
					"./external": 6,
					"./nodejsUtils": 14,
					"./stream/Crc32Probe": 25,
					"./utf8": 31,
					"./utils": 32,
					"./zipEntries": 33
				}],
				12: [function(e, t, r) {
					"use strict";
					var n = e("../utils"), i = e("../stream/GenericWorker");
					function s(e, t) {
						i.call(this, "Nodejs stream input adapter for " + e), this._upstreamEnded = !1, this._bindStream(t);
					}
					n.inherits(s, i), s.prototype._bindStream = function(e) {
						var t = this;
						(this._stream = e).pause(), e.on("data", function(e) {
							t.push({
								data: e,
								meta: { percent: 0 }
							});
						}).on("error", function(e) {
							t.isPaused ? this.generatedError = e : t.error(e);
						}).on("end", function() {
							t.isPaused ? t._upstreamEnded = !0 : t.end();
						});
					}, s.prototype.pause = function() {
						return !!i.prototype.pause.call(this) && (this._stream.pause(), !0);
					}, s.prototype.resume = function() {
						return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
					}, t.exports = s;
				}, {
					"../stream/GenericWorker": 28,
					"../utils": 32
				}],
				13: [function(e, t, r) {
					"use strict";
					var i = e("readable-stream").Readable;
					function n(e, t, r) {
						i.call(this, t), this._helper = e;
						var n = this;
						e.on("data", function(e, t) {
							n.push(e) || n._helper.pause(), r && r(t);
						}).on("error", function(e) {
							n.emit("error", e);
						}).on("end", function() {
							n.push(null);
						});
					}
					e("../utils").inherits(n, i), n.prototype._read = function() {
						this._helper.resume();
					}, t.exports = n;
				}, {
					"../utils": 32,
					"readable-stream": 16
				}],
				14: [function(e, t, r) {
					"use strict";
					t.exports = {
						isNode: "undefined" != typeof Buffer,
						newBufferFrom: function(e, t) {
							if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(e, t);
							if ("number" == typeof e) throw new Error("The \"data\" argument must not be a number");
							return new Buffer(e, t);
						},
						allocBuffer: function(e) {
							if (Buffer.alloc) return Buffer.alloc(e);
							var t = new Buffer(e);
							return t.fill(0), t;
						},
						isBuffer: function(e) {
							return Buffer.isBuffer(e);
						},
						isStream: function(e) {
							return e && "function" == typeof e.on && "function" == typeof e.pause && "function" == typeof e.resume;
						}
					};
				}, {}],
				15: [function(e, t, r) {
					"use strict";
					function s(e, t, r) {
						var n, i = u.getTypeOf(t), s = u.extend(r || {}, f);
						s.date = s.date || /* @__PURE__ */ new Date(), null !== s.compression && (s.compression = s.compression.toUpperCase()), "string" == typeof s.unixPermissions && (s.unixPermissions = parseInt(s.unixPermissions, 8)), s.unixPermissions && 16384 & s.unixPermissions && (s.dir = !0), s.dosPermissions && 16 & s.dosPermissions && (s.dir = !0), s.dir && (e = g(e)), s.createFolders && (n = _(e)) && b.call(this, n, !0);
						var a = "string" === i && !1 === s.binary && !1 === s.base64;
						r && void 0 !== r.binary || (s.binary = !a), (t instanceof c && 0 === t.uncompressedSize || s.dir || !t || 0 === t.length) && (s.base64 = !1, s.binary = !0, t = "", s.compression = "STORE", i = "string");
						var o = null;
						o = t instanceof c || t instanceof l ? t : p.isNode && p.isStream(t) ? new m(e, t) : u.prepareContent(e, t, s.binary, s.optimizedBinaryString, s.base64);
						var h = new d(e, o, s);
						this.files[e] = h;
					}
					var i = e("./utf8"), u = e("./utils"), l = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), f = e("./defaults"), c = e("./compressedObject"), d = e("./zipObject"), o = e("./generate"), p = e("./nodejsUtils"), m = e("./nodejs/NodejsStreamInputAdapter"), _ = function(e) {
						"/" === e.slice(-1) && (e = e.substring(0, e.length - 1));
						var t = e.lastIndexOf("/");
						return 0 < t ? e.substring(0, t) : "";
					}, g = function(e) {
						return "/" !== e.slice(-1) && (e += "/"), e;
					}, b = function(e, t) {
						return t = void 0 !== t ? t : f.createFolders, e = g(e), this.files[e] || s.call(this, e, null, {
							dir: !0,
							createFolders: t
						}), this.files[e];
					};
					function h(e) {
						return "[object RegExp]" === Object.prototype.toString.call(e);
					}
					t.exports = {
						load: function() {
							throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
						},
						forEach: function(e) {
							var t, r, n;
							for (t in this.files) n = this.files[t], (r = t.slice(this.root.length, t.length)) && t.slice(0, this.root.length) === this.root && e(r, n);
						},
						filter: function(r) {
							var n = [];
							return this.forEach(function(e, t) {
								r(e, t) && n.push(t);
							}), n;
						},
						file: function(e, t, r) {
							if (1 !== arguments.length) return e = this.root + e, s.call(this, e, t, r), this;
							if (h(e)) {
								var n = e;
								return this.filter(function(e, t) {
									return !t.dir && n.test(e);
								});
							}
							var i = this.files[this.root + e];
							return i && !i.dir ? i : null;
						},
						folder: function(r) {
							if (!r) return this;
							if (h(r)) return this.filter(function(e, t) {
								return t.dir && r.test(e);
							});
							var e = this.root + r, t = b.call(this, e), n = this.clone();
							return n.root = t.name, n;
						},
						remove: function(r) {
							r = this.root + r;
							var e = this.files[r];
							if (e || ("/" !== r.slice(-1) && (r += "/"), e = this.files[r]), e && !e.dir) delete this.files[r];
							else for (var t = this.filter(function(e, t) {
								return t.name.slice(0, r.length) === r;
							}), n = 0; n < t.length; n++) delete this.files[t[n].name];
							return this;
						},
						generate: function() {
							throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
						},
						generateInternalStream: function(e) {
							var t, r = {};
							try {
								if ((r = u.extend(e || {}, {
									streamFiles: !1,
									compression: "STORE",
									compressionOptions: null,
									type: "",
									platform: "DOS",
									comment: null,
									mimeType: "application/zip",
									encodeFileName: i.utf8encode
								})).type = r.type.toLowerCase(), r.compression = r.compression.toUpperCase(), "binarystring" === r.type && (r.type = "string"), !r.type) throw new Error("No output type specified.");
								u.checkSupport(r.type), "darwin" !== r.platform && "freebsd" !== r.platform && "linux" !== r.platform && "sunos" !== r.platform || (r.platform = "UNIX"), "win32" === r.platform && (r.platform = "DOS");
								var n = r.comment || this.comment || "";
								t = o.generateWorker(this, r, n);
							} catch (e) {
								(t = new l("error")).error(e);
							}
							return new a(t, r.type || "string", r.mimeType);
						},
						generateAsync: function(e, t) {
							return this.generateInternalStream(e).accumulate(t);
						},
						generateNodeStream: function(e, t) {
							return (e = e || {}).type || (e.type = "nodebuffer"), this.generateInternalStream(e).toNodejsStream(t);
						}
					};
				}, {
					"./compressedObject": 2,
					"./defaults": 5,
					"./generate": 9,
					"./nodejs/NodejsStreamInputAdapter": 12,
					"./nodejsUtils": 14,
					"./stream/GenericWorker": 28,
					"./stream/StreamHelper": 29,
					"./utf8": 31,
					"./utils": 32,
					"./zipObject": 35
				}],
				16: [function(e, t, r) {
					"use strict";
					t.exports = e("stream");
				}, { stream: void 0 }],
				17: [function(e, t, r) {
					"use strict";
					var n = e("./DataReader");
					function i(e) {
						n.call(this, e);
						for (var t = 0; t < this.data.length; t++) e[t] = 255 & e[t];
					}
					e("../utils").inherits(i, n), i.prototype.byteAt = function(e) {
						return this.data[this.zero + e];
					}, i.prototype.lastIndexOfSignature = function(e) {
						for (var t = e.charCodeAt(0), r = e.charCodeAt(1), n = e.charCodeAt(2), i = e.charCodeAt(3), s = this.length - 4; 0 <= s; --s) if (this.data[s] === t && this.data[s + 1] === r && this.data[s + 2] === n && this.data[s + 3] === i) return s - this.zero;
						return -1;
					}, i.prototype.readAndCheckSignature = function(e) {
						var t = e.charCodeAt(0), r = e.charCodeAt(1), n = e.charCodeAt(2), i = e.charCodeAt(3), s = this.readData(4);
						return t === s[0] && r === s[1] && n === s[2] && i === s[3];
					}, i.prototype.readData = function(e) {
						if (this.checkOffset(e), 0 === e) return [];
						var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
						return this.index += e, t;
					}, t.exports = i;
				}, {
					"../utils": 32,
					"./DataReader": 18
				}],
				18: [function(e, t, r) {
					"use strict";
					var n = e("../utils");
					function i(e) {
						this.data = e, this.length = e.length, this.index = 0, this.zero = 0;
					}
					i.prototype = {
						checkOffset: function(e) {
							this.checkIndex(this.index + e);
						},
						checkIndex: function(e) {
							if (this.length < this.zero + e || e < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e + "). Corrupted zip ?");
						},
						setIndex: function(e) {
							this.checkIndex(e), this.index = e;
						},
						skip: function(e) {
							this.setIndex(this.index + e);
						},
						byteAt: function() {},
						readInt: function(e) {
							var t, r = 0;
							for (this.checkOffset(e), t = this.index + e - 1; t >= this.index; t--) r = (r << 8) + this.byteAt(t);
							return this.index += e, r;
						},
						readString: function(e) {
							return n.transformTo("string", this.readData(e));
						},
						readData: function() {},
						lastIndexOfSignature: function() {},
						readAndCheckSignature: function() {},
						readDate: function() {
							var e = this.readInt(4);
							return new Date(Date.UTC(1980 + (e >> 25 & 127), (e >> 21 & 15) - 1, e >> 16 & 31, e >> 11 & 31, e >> 5 & 63, (31 & e) << 1));
						}
					}, t.exports = i;
				}, { "../utils": 32 }],
				19: [function(e, t, r) {
					"use strict";
					var n = e("./Uint8ArrayReader");
					function i(e) {
						n.call(this, e);
					}
					e("../utils").inherits(i, n), i.prototype.readData = function(e) {
						this.checkOffset(e);
						var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
						return this.index += e, t;
					}, t.exports = i;
				}, {
					"../utils": 32,
					"./Uint8ArrayReader": 21
				}],
				20: [function(e, t, r) {
					"use strict";
					var n = e("./DataReader");
					function i(e) {
						n.call(this, e);
					}
					e("../utils").inherits(i, n), i.prototype.byteAt = function(e) {
						return this.data.charCodeAt(this.zero + e);
					}, i.prototype.lastIndexOfSignature = function(e) {
						return this.data.lastIndexOf(e) - this.zero;
					}, i.prototype.readAndCheckSignature = function(e) {
						return e === this.readData(4);
					}, i.prototype.readData = function(e) {
						this.checkOffset(e);
						var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
						return this.index += e, t;
					}, t.exports = i;
				}, {
					"../utils": 32,
					"./DataReader": 18
				}],
				21: [function(e, t, r) {
					"use strict";
					var n = e("./ArrayReader");
					function i(e) {
						n.call(this, e);
					}
					e("../utils").inherits(i, n), i.prototype.readData = function(e) {
						if (this.checkOffset(e), 0 === e) return /* @__PURE__ */ new Uint8Array(0);
						var t = this.data.subarray(this.zero + this.index, this.zero + this.index + e);
						return this.index += e, t;
					}, t.exports = i;
				}, {
					"../utils": 32,
					"./ArrayReader": 17
				}],
				22: [function(e, t, r) {
					"use strict";
					var n = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), h = e("./Uint8ArrayReader");
					t.exports = function(e) {
						var t = n.getTypeOf(e);
						return n.checkSupport(t), "string" !== t || i.uint8array ? "nodebuffer" === t ? new o(e) : i.uint8array ? new h(n.transformTo("uint8array", e)) : new s(n.transformTo("array", e)) : new a(e);
					};
				}, {
					"../support": 30,
					"../utils": 32,
					"./ArrayReader": 17,
					"./NodeBufferReader": 19,
					"./StringReader": 20,
					"./Uint8ArrayReader": 21
				}],
				23: [function(e, t, r) {
					"use strict";
					r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
				}, {}],
				24: [function(e, t, r) {
					"use strict";
					var n = e("./GenericWorker"), i = e("../utils");
					function s(e) {
						n.call(this, "ConvertWorker to " + e), this.destType = e;
					}
					i.inherits(s, n), s.prototype.processChunk = function(e) {
						this.push({
							data: i.transformTo(this.destType, e.data),
							meta: e.meta
						});
					}, t.exports = s;
				}, {
					"../utils": 32,
					"./GenericWorker": 28
				}],
				25: [function(e, t, r) {
					"use strict";
					var n = e("./GenericWorker"), i = e("../crc32");
					function s() {
						n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
					}
					e("../utils").inherits(s, n), s.prototype.processChunk = function(e) {
						this.streamInfo.crc32 = i(e.data, this.streamInfo.crc32 || 0), this.push(e);
					}, t.exports = s;
				}, {
					"../crc32": 4,
					"../utils": 32,
					"./GenericWorker": 28
				}],
				26: [function(e, t, r) {
					"use strict";
					var n = e("../utils"), i = e("./GenericWorker");
					function s(e) {
						i.call(this, "DataLengthProbe for " + e), this.propName = e, this.withStreamInfo(e, 0);
					}
					n.inherits(s, i), s.prototype.processChunk = function(e) {
						if (e) {
							var t = this.streamInfo[this.propName] || 0;
							this.streamInfo[this.propName] = t + e.data.length;
						}
						i.prototype.processChunk.call(this, e);
					}, t.exports = s;
				}, {
					"../utils": 32,
					"./GenericWorker": 28
				}],
				27: [function(e, t, r) {
					"use strict";
					var n = e("../utils"), i = e("./GenericWorker");
					function s(e) {
						i.call(this, "DataWorker");
						var t = this;
						this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, e.then(function(e) {
							t.dataIsReady = !0, t.data = e, t.max = e && e.length || 0, t.type = n.getTypeOf(e), t.isPaused || t._tickAndRepeat();
						}, function(e) {
							t.error(e);
						});
					}
					n.inherits(s, i), s.prototype.cleanUp = function() {
						i.prototype.cleanUp.call(this), this.data = null;
					}, s.prototype.resume = function() {
						return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, n.delay(this._tickAndRepeat, [], this)), !0);
					}, s.prototype._tickAndRepeat = function() {
						this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
					}, s.prototype._tick = function() {
						if (this.isPaused || this.isFinished) return !1;
						var e = null, t = Math.min(this.max, this.index + 16384);
						if (this.index >= this.max) return this.end();
						switch (this.type) {
							case "string":
								e = this.data.substring(this.index, t);
								break;
							case "uint8array":
								e = this.data.subarray(this.index, t);
								break;
							case "array":
							case "nodebuffer": e = this.data.slice(this.index, t);
						}
						return this.index = t, this.push({
							data: e,
							meta: { percent: this.max ? this.index / this.max * 100 : 0 }
						});
					}, t.exports = s;
				}, {
					"../utils": 32,
					"./GenericWorker": 28
				}],
				28: [function(e, t, r) {
					"use strict";
					function n(e) {
						this.name = e || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = {
							data: [],
							end: [],
							error: []
						}, this.previous = null;
					}
					n.prototype = {
						push: function(e) {
							this.emit("data", e);
						},
						end: function() {
							if (this.isFinished) return !1;
							this.flush();
							try {
								this.emit("end"), this.cleanUp(), this.isFinished = !0;
							} catch (e) {
								this.emit("error", e);
							}
							return !0;
						},
						error: function(e) {
							return !this.isFinished && (this.isPaused ? this.generatedError = e : (this.isFinished = !0, this.emit("error", e), this.previous && this.previous.error(e), this.cleanUp()), !0);
						},
						on: function(e, t) {
							return this._listeners[e].push(t), this;
						},
						cleanUp: function() {
							this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
						},
						emit: function(e, t) {
							if (this._listeners[e]) for (var r = 0; r < this._listeners[e].length; r++) this._listeners[e][r].call(this, t);
						},
						pipe: function(e) {
							return e.registerPrevious(this);
						},
						registerPrevious: function(e) {
							if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
							this.streamInfo = e.streamInfo, this.mergeStreamInfo(), this.previous = e;
							var t = this;
							return e.on("data", function(e) {
								t.processChunk(e);
							}), e.on("end", function() {
								t.end();
							}), e.on("error", function(e) {
								t.error(e);
							}), this;
						},
						pause: function() {
							return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
						},
						resume: function() {
							if (!this.isPaused || this.isFinished) return !1;
							var e = this.isPaused = !1;
							return this.generatedError && (this.error(this.generatedError), e = !0), this.previous && this.previous.resume(), !e;
						},
						flush: function() {},
						processChunk: function(e) {
							this.push(e);
						},
						withStreamInfo: function(e, t) {
							return this.extraStreamInfo[e] = t, this.mergeStreamInfo(), this;
						},
						mergeStreamInfo: function() {
							for (var e in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e) && (this.streamInfo[e] = this.extraStreamInfo[e]);
						},
						lock: function() {
							if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
							this.isLocked = !0, this.previous && this.previous.lock();
						},
						toString: function() {
							var e = "Worker " + this.name;
							return this.previous ? this.previous + " -> " + e : e;
						}
					}, t.exports = n;
				}, {}],
				29: [function(e, t, r) {
					"use strict";
					var h = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), u = e("../base64"), n = e("../support"), a = e("../external"), o = null;
					if (n.nodestream) try {
						o = e("../nodejs/NodejsStreamOutputAdapter");
					} catch (e) {}
					function l(e, o) {
						return new a.Promise(function(t, r) {
							var n = [], i = e._internalType, s = e._outputType, a = e._mimeType;
							e.on("data", function(e, t) {
								n.push(e), o && o(t);
							}).on("error", function(e) {
								n = [], r(e);
							}).on("end", function() {
								try {
									t(function(e, t, r) {
										switch (e) {
											case "blob": return h.newBlob(h.transformTo("arraybuffer", t), r);
											case "base64": return u.encode(t);
											default: return h.transformTo(e, t);
										}
									}(s, function(e, t) {
										var r, n = 0, i = null, s = 0;
										for (r = 0; r < t.length; r++) s += t[r].length;
										switch (e) {
											case "string": return t.join("");
											case "array": return Array.prototype.concat.apply([], t);
											case "uint8array":
												for (i = new Uint8Array(s), r = 0; r < t.length; r++) i.set(t[r], n), n += t[r].length;
												return i;
											case "nodebuffer": return Buffer.concat(t);
											default: throw new Error("concat : unsupported type '" + e + "'");
										}
									}(i, n), a));
								} catch (e) {
									r(e);
								}
								n = [];
							}).resume();
						});
					}
					function f(e, t, r) {
						var n = t;
						switch (t) {
							case "blob":
							case "arraybuffer":
								n = "uint8array";
								break;
							case "base64": n = "string";
						}
						try {
							this._internalType = n, this._outputType = t, this._mimeType = r, h.checkSupport(n), this._worker = e.pipe(new i(n)), e.lock();
						} catch (e) {
							this._worker = new s("error"), this._worker.error(e);
						}
					}
					f.prototype = {
						accumulate: function(e) {
							return l(this, e);
						},
						on: function(e, t) {
							var r = this;
							return "data" === e ? this._worker.on(e, function(e) {
								t.call(r, e.data, e.meta);
							}) : this._worker.on(e, function() {
								h.delay(t, arguments, r);
							}), this;
						},
						resume: function() {
							return h.delay(this._worker.resume, [], this._worker), this;
						},
						pause: function() {
							return this._worker.pause(), this;
						},
						toNodejsStream: function(e) {
							if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
							return new o(this, { objectMode: "nodebuffer" !== this._outputType }, e);
						}
					}, t.exports = f;
				}, {
					"../base64": 1,
					"../external": 6,
					"../nodejs/NodejsStreamOutputAdapter": 13,
					"../support": 30,
					"../utils": 32,
					"./ConvertWorker": 24,
					"./GenericWorker": 28
				}],
				30: [function(e, t, r) {
					"use strict";
					if (r.base64 = !0, r.array = !0, r.string = !0, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = !1;
					else {
						var n = /* @__PURE__ */ new ArrayBuffer(0);
						try {
							r.blob = 0 === new Blob([n], { type: "application/zip" }).size;
						} catch (e) {
							try {
								var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
								i.append(n), r.blob = 0 === i.getBlob("application/zip").size;
							} catch (e) {
								r.blob = !1;
							}
						}
					}
					try {
						r.nodestream = !!e("readable-stream").Readable;
					} catch (e) {
						r.nodestream = !1;
					}
				}, { "readable-stream": 16 }],
				31: [function(e, t, s) {
					"use strict";
					for (var o = e("./utils"), h = e("./support"), r = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++) u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
					u[254] = u[254] = 1;
					function a() {
						n.call(this, "utf-8 decode"), this.leftOver = null;
					}
					function l() {
						n.call(this, "utf-8 encode");
					}
					s.utf8encode = function(e) {
						return h.nodebuffer ? r.newBufferFrom(e, "utf-8") : function(e) {
							var t, r, n, i, s, a = e.length, o = 0;
							for (i = 0; i < a; i++) 55296 == (64512 & (r = e.charCodeAt(i))) && i + 1 < a && 56320 == (64512 & (n = e.charCodeAt(i + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), i++), o += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
							for (t = h.uint8array ? new Uint8Array(o) : new Array(o), i = s = 0; s < o; i++) 55296 == (64512 & (r = e.charCodeAt(i))) && i + 1 < a && 56320 == (64512 & (n = e.charCodeAt(i + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), i++), r < 128 ? t[s++] = r : (r < 2048 ? t[s++] = 192 | r >>> 6 : (r < 65536 ? t[s++] = 224 | r >>> 12 : (t[s++] = 240 | r >>> 18, t[s++] = 128 | r >>> 12 & 63), t[s++] = 128 | r >>> 6 & 63), t[s++] = 128 | 63 & r);
							return t;
						}(e);
					}, s.utf8decode = function(e) {
						return h.nodebuffer ? o.transformTo("nodebuffer", e).toString("utf-8") : function(e) {
							var t, r, n, i, s = e.length, a = new Array(2 * s);
							for (t = r = 0; t < s;) if ((n = e[t++]) < 128) a[r++] = n;
							else if (4 < (i = u[n])) a[r++] = 65533, t += i - 1;
							else {
								for (n &= 2 === i ? 31 : 3 === i ? 15 : 7; 1 < i && t < s;) n = n << 6 | 63 & e[t++], i--;
								1 < i ? a[r++] = 65533 : n < 65536 ? a[r++] = n : (n -= 65536, a[r++] = 55296 | n >> 10 & 1023, a[r++] = 56320 | 1023 & n);
							}
							return a.length !== r && (a.subarray ? a = a.subarray(0, r) : a.length = r), o.applyFromCharCode(a);
						}(e = o.transformTo(h.uint8array ? "uint8array" : "array", e));
					}, o.inherits(a, n), a.prototype.processChunk = function(e) {
						var t = o.transformTo(h.uint8array ? "uint8array" : "array", e.data);
						if (this.leftOver && this.leftOver.length) {
							if (h.uint8array) {
								var r = t;
								(t = new Uint8Array(r.length + this.leftOver.length)).set(this.leftOver, 0), t.set(r, this.leftOver.length);
							} else t = this.leftOver.concat(t);
							this.leftOver = null;
						}
						var n = function(e, t) {
							var r;
							for ((t = t || e.length) > e.length && (t = e.length), r = t - 1; 0 <= r && 128 == (192 & e[r]);) r--;
							return r < 0 ? t : 0 === r ? t : r + u[e[r]] > t ? r : t;
						}(t), i = t;
						n !== t.length && (h.uint8array ? (i = t.subarray(0, n), this.leftOver = t.subarray(n, t.length)) : (i = t.slice(0, n), this.leftOver = t.slice(n, t.length))), this.push({
							data: s.utf8decode(i),
							meta: e.meta
						});
					}, a.prototype.flush = function() {
						this.leftOver && this.leftOver.length && (this.push({
							data: s.utf8decode(this.leftOver),
							meta: {}
						}), this.leftOver = null);
					}, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function(e) {
						this.push({
							data: s.utf8encode(e.data),
							meta: e.meta
						});
					}, s.Utf8EncodeWorker = l;
				}, {
					"./nodejsUtils": 14,
					"./stream/GenericWorker": 28,
					"./support": 30,
					"./utils": 32
				}],
				32: [function(e, t, a) {
					"use strict";
					var o = e("./support"), h = e("./base64"), r = e("./nodejsUtils"), u = e("./external");
					function n(e) {
						return e;
					}
					function l(e, t) {
						for (var r = 0; r < e.length; ++r) t[r] = 255 & e.charCodeAt(r);
						return t;
					}
					e("setimmediate"), a.newBlob = function(t, r) {
						a.checkSupport("blob");
						try {
							return new Blob([t], { type: r });
						} catch (e) {
							try {
								var n = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
								return n.append(t), n.getBlob(r);
							} catch (e) {
								throw new Error("Bug : can't construct the Blob.");
							}
						}
					};
					var i = {
						stringifyByChunk: function(e, t, r) {
							var n = [], i = 0, s = e.length;
							if (s <= r) return String.fromCharCode.apply(null, e);
							for (; i < s;) "array" === t || "nodebuffer" === t ? n.push(String.fromCharCode.apply(null, e.slice(i, Math.min(i + r, s)))) : n.push(String.fromCharCode.apply(null, e.subarray(i, Math.min(i + r, s)))), i += r;
							return n.join("");
						},
						stringifyByChar: function(e) {
							for (var t = "", r = 0; r < e.length; r++) t += String.fromCharCode(e[r]);
							return t;
						},
						applyCanBeUsed: {
							uint8array: function() {
								try {
									return o.uint8array && 1 === String.fromCharCode.apply(null, /* @__PURE__ */ new Uint8Array(1)).length;
								} catch (e) {
									return !1;
								}
							}(),
							nodebuffer: function() {
								try {
									return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
								} catch (e) {
									return !1;
								}
							}()
						}
					};
					function s(e) {
						var t = 65536, r = a.getTypeOf(e), n = !0;
						if ("uint8array" === r ? n = i.applyCanBeUsed.uint8array : "nodebuffer" === r && (n = i.applyCanBeUsed.nodebuffer), n) for (; 1 < t;) try {
							return i.stringifyByChunk(e, r, t);
						} catch (e) {
							t = Math.floor(t / 2);
						}
						return i.stringifyByChar(e);
					}
					function f(e, t) {
						for (var r = 0; r < e.length; r++) t[r] = e[r];
						return t;
					}
					a.applyFromCharCode = s;
					var c = {};
					c.string = {
						string: n,
						array: function(e) {
							return l(e, new Array(e.length));
						},
						arraybuffer: function(e) {
							return c.string.uint8array(e).buffer;
						},
						uint8array: function(e) {
							return l(e, new Uint8Array(e.length));
						},
						nodebuffer: function(e) {
							return l(e, r.allocBuffer(e.length));
						}
					}, c.array = {
						string: s,
						array: n,
						arraybuffer: function(e) {
							return new Uint8Array(e).buffer;
						},
						uint8array: function(e) {
							return new Uint8Array(e);
						},
						nodebuffer: function(e) {
							return r.newBufferFrom(e);
						}
					}, c.arraybuffer = {
						string: function(e) {
							return s(new Uint8Array(e));
						},
						array: function(e) {
							return f(new Uint8Array(e), new Array(e.byteLength));
						},
						arraybuffer: n,
						uint8array: function(e) {
							return new Uint8Array(e);
						},
						nodebuffer: function(e) {
							return r.newBufferFrom(new Uint8Array(e));
						}
					}, c.uint8array = {
						string: s,
						array: function(e) {
							return f(e, new Array(e.length));
						},
						arraybuffer: function(e) {
							return e.buffer;
						},
						uint8array: n,
						nodebuffer: function(e) {
							return r.newBufferFrom(e);
						}
					}, c.nodebuffer = {
						string: s,
						array: function(e) {
							return f(e, new Array(e.length));
						},
						arraybuffer: function(e) {
							return c.nodebuffer.uint8array(e).buffer;
						},
						uint8array: function(e) {
							return f(e, new Uint8Array(e.length));
						},
						nodebuffer: n
					}, a.transformTo = function(e, t) {
						if (t = t || "", !e) return t;
						a.checkSupport(e);
						return c[a.getTypeOf(t)][e](t);
					}, a.resolve = function(e) {
						for (var t = e.split("/"), r = [], n = 0; n < t.length; n++) {
							var i = t[n];
							"." === i || "" === i && 0 !== n && n !== t.length - 1 || (".." === i ? r.pop() : r.push(i));
						}
						return r.join("/");
					}, a.getTypeOf = function(e) {
						return "string" == typeof e ? "string" : "[object Array]" === Object.prototype.toString.call(e) ? "array" : o.nodebuffer && r.isBuffer(e) ? "nodebuffer" : o.uint8array && e instanceof Uint8Array ? "uint8array" : o.arraybuffer && e instanceof ArrayBuffer ? "arraybuffer" : void 0;
					}, a.checkSupport = function(e) {
						if (!o[e.toLowerCase()]) throw new Error(e + " is not supported by this platform");
					}, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(e) {
						var t, r, n = "";
						for (r = 0; r < (e || "").length; r++) n += "\\x" + ((t = e.charCodeAt(r)) < 16 ? "0" : "") + t.toString(16).toUpperCase();
						return n;
					}, a.delay = function(e, t, r) {
						setImmediate(function() {
							e.apply(r || null, t || []);
						});
					}, a.inherits = function(e, t) {
						function r() {}
						r.prototype = t.prototype, e.prototype = new r();
					}, a.extend = function() {
						var e, t, r = {};
						for (e = 0; e < arguments.length; e++) for (t in arguments[e]) Object.prototype.hasOwnProperty.call(arguments[e], t) && void 0 === r[t] && (r[t] = arguments[e][t]);
						return r;
					}, a.prepareContent = function(r, e, n, i, s) {
						return u.Promise.resolve(e).then(function(n) {
							return o.blob && (n instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n))) && "undefined" != typeof FileReader ? new u.Promise(function(t, r) {
								var e = new FileReader();
								e.onload = function(e) {
									t(e.target.result);
								}, e.onerror = function(e) {
									r(e.target.error);
								}, e.readAsArrayBuffer(n);
							}) : n;
						}).then(function(e) {
							var t = a.getTypeOf(e);
							return t ? ("arraybuffer" === t ? e = a.transformTo("uint8array", e) : "string" === t && (s ? e = h.decode(e) : n && !0 !== i && (e = function(e) {
								return l(e, o.uint8array ? new Uint8Array(e.length) : new Array(e.length));
							}(e))), e) : u.Promise.reject(/* @__PURE__ */ new Error("Can't read the data of '" + r + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
						});
					};
				}, {
					"./base64": 1,
					"./external": 6,
					"./nodejsUtils": 14,
					"./support": 30,
					setimmediate: 54
				}],
				33: [function(e, t, r) {
					"use strict";
					var n = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = e("./support");
					function h(e) {
						this.files = [], this.loadOptions = e;
					}
					h.prototype = {
						checkSignature: function(e) {
							if (!this.reader.readAndCheckSignature(e)) {
								this.reader.index -= 4;
								var t = this.reader.readString(4);
								throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t) + ", expected " + i.pretty(e) + ")");
							}
						},
						isSignature: function(e, t) {
							var r = this.reader.index;
							this.reader.setIndex(e);
							var n = this.reader.readString(4) === t;
							return this.reader.setIndex(r), n;
						},
						readBlockEndOfCentral: function() {
							this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
							var e = this.reader.readData(this.zipCommentLength), t = o.uint8array ? "uint8array" : "array", r = i.transformTo(t, e);
							this.zipComment = this.loadOptions.decodeFileName(r);
						},
						readBlockZip64EndOfCentral: function() {
							this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
							for (var e, t, r, n = this.zip64EndOfCentralSize - 44; 0 < n;) e = this.reader.readInt(2), t = this.reader.readInt(4), r = this.reader.readData(t), this.zip64ExtensibleData[e] = {
								id: e,
								length: t,
								value: r
							};
						},
						readBlockZip64EndOfCentralLocator: function() {
							if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
						},
						readLocalFiles: function() {
							var e, t;
							for (e = 0; e < this.files.length; e++) t = this.files[e], this.reader.setIndex(t.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t.readLocalPart(this.reader), t.handleUTF8(), t.processAttributes();
						},
						readCentralDir: function() {
							var e;
							for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);) (e = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e);
							if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
						},
						readEndOfCentral: function() {
							var e = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
							if (e < 0) throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? /* @__PURE__ */ new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : /* @__PURE__ */ new Error("Corrupted zip: can't find end of central directory");
							this.reader.setIndex(e);
							var t = e;
							if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
								if (this.zip64 = !0, (e = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
								if (this.reader.setIndex(e), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
								this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
							}
							var r = this.centralDirOffset + this.centralDirSize;
							this.zip64 && (r += 20, r += 12 + this.zip64EndOfCentralSize);
							var n = t - r;
							if (0 < n) this.isSignature(t, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n);
							else if (n < 0) throw new Error("Corrupted zip: missing " + Math.abs(n) + " bytes.");
						},
						prepareReader: function(e) {
							this.reader = n(e);
						},
						load: function(e) {
							this.prepareReader(e), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
						}
					}, t.exports = h;
				}, {
					"./reader/readerFor": 22,
					"./signature": 23,
					"./support": 30,
					"./utils": 32,
					"./zipEntry": 34
				}],
				34: [function(e, t, r) {
					"use strict";
					var n = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), h = e("./compressions"), u = e("./support");
					function l(e, t) {
						this.options = e, this.loadOptions = t;
					}
					l.prototype = {
						isEncrypted: function() {
							return 1 == (1 & this.bitFlag);
						},
						useUTF8: function() {
							return 2048 == (2048 & this.bitFlag);
						},
						readLocalPart: function(e) {
							var t, r;
							if (e.skip(22), this.fileNameLength = e.readInt(2), r = e.readInt(2), this.fileName = e.readData(this.fileNameLength), e.skip(r), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
							if (null === (t = function(e) {
								for (var t in h) if (Object.prototype.hasOwnProperty.call(h, t) && h[t].magic === e) return h[t];
								return null;
							}(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
							this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t, e.readData(this.compressedSize));
						},
						readCentralPart: function(e) {
							this.versionMadeBy = e.readInt(2), e.skip(2), this.bitFlag = e.readInt(2), this.compressionMethod = e.readString(2), this.date = e.readDate(), this.crc32 = e.readInt(4), this.compressedSize = e.readInt(4), this.uncompressedSize = e.readInt(4);
							var t = e.readInt(2);
							if (this.extraFieldsLength = e.readInt(2), this.fileCommentLength = e.readInt(2), this.diskNumberStart = e.readInt(2), this.internalFileAttributes = e.readInt(2), this.externalFileAttributes = e.readInt(4), this.localHeaderOffset = e.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
							e.skip(t), this.readExtraFields(e), this.parseZIP64ExtraField(e), this.fileComment = e.readData(this.fileCommentLength);
						},
						processAttributes: function() {
							this.unixPermissions = null, this.dosPermissions = null;
							var e = this.versionMadeBy >> 8;
							this.dir = !!(16 & this.externalFileAttributes), 0 == e && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = !0);
						},
						parseZIP64ExtraField: function() {
							if (this.extraFields[1]) {
								var e = n(this.extraFields[1].value);
								this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e.readInt(4));
							}
						},
						readExtraFields: function(e) {
							var t, r, n, i = e.index + this.extraFieldsLength;
							for (this.extraFields || (this.extraFields = {}); e.index + 4 < i;) t = e.readInt(2), r = e.readInt(2), n = e.readData(r), this.extraFields[t] = {
								id: t,
								length: r,
								value: n
							};
							e.setIndex(i);
						},
						handleUTF8: function() {
							var e = u.uint8array ? "uint8array" : "array";
							if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
							else {
								var t = this.findExtraFieldUnicodePath();
								if (null !== t) this.fileNameStr = t;
								else {
									var r = s.transformTo(e, this.fileName);
									this.fileNameStr = this.loadOptions.decodeFileName(r);
								}
								var n = this.findExtraFieldUnicodeComment();
								if (null !== n) this.fileCommentStr = n;
								else {
									var i = s.transformTo(e, this.fileComment);
									this.fileCommentStr = this.loadOptions.decodeFileName(i);
								}
							}
						},
						findExtraFieldUnicodePath: function() {
							var e = this.extraFields[28789];
							if (e) {
								var t = n(e.value);
								return 1 !== t.readInt(1) ? null : a(this.fileName) !== t.readInt(4) ? null : o.utf8decode(t.readData(e.length - 5));
							}
							return null;
						},
						findExtraFieldUnicodeComment: function() {
							var e = this.extraFields[25461];
							if (e) {
								var t = n(e.value);
								return 1 !== t.readInt(1) ? null : a(this.fileComment) !== t.readInt(4) ? null : o.utf8decode(t.readData(e.length - 5));
							}
							return null;
						}
					}, t.exports = l;
				}, {
					"./compressedObject": 2,
					"./compressions": 3,
					"./crc32": 4,
					"./reader/readerFor": 22,
					"./support": 30,
					"./utf8": 31,
					"./utils": 32
				}],
				35: [function(e, t, r) {
					"use strict";
					function n(e, t, r) {
						this.name = e, this.dir = r.dir, this.date = r.date, this.comment = r.comment, this.unixPermissions = r.unixPermissions, this.dosPermissions = r.dosPermissions, this._data = t, this._dataBinary = r.binary, this.options = {
							compression: r.compression,
							compressionOptions: r.compressionOptions
						};
					}
					var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), h = e("./stream/GenericWorker");
					n.prototype = {
						internalStream: function(e) {
							var t = null, r = "string";
							try {
								if (!e) throw new Error("No output type specified.");
								var n = "string" === (r = e.toLowerCase()) || "text" === r;
								"binarystring" !== r && "text" !== r || (r = "string"), t = this._decompressWorker();
								var i = !this._dataBinary;
								i && !n && (t = t.pipe(new a.Utf8EncodeWorker())), !i && n && (t = t.pipe(new a.Utf8DecodeWorker()));
							} catch (e) {
								(t = new h("error")).error(e);
							}
							return new s(t, r, "");
						},
						async: function(e, t) {
							return this.internalStream(e).accumulate(t);
						},
						nodeStream: function(e, t) {
							return this.internalStream(e || "nodebuffer").toNodejsStream(t);
						},
						_compressWorker: function(e, t) {
							if (this._data instanceof o && this._data.compression.magic === e.magic) return this._data.getCompressedWorker();
							var r = this._decompressWorker();
							return this._dataBinary || (r = r.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r, e, t);
						},
						_decompressWorker: function() {
							return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new i(this._data);
						}
					};
					for (var u = [
						"asText",
						"asBinary",
						"asNodeBuffer",
						"asUint8Array",
						"asArrayBuffer"
					], l = function() {
						throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
					}, f = 0; f < u.length; f++) n.prototype[u[f]] = l;
					t.exports = n;
				}, {
					"./compressedObject": 2,
					"./stream/DataWorker": 27,
					"./stream/GenericWorker": 28,
					"./stream/StreamHelper": 29,
					"./utf8": 31
				}],
				36: [function(e, l, t) {
					(function(t) {
						"use strict";
						var r, n, e = t.MutationObserver || t.WebKitMutationObserver;
						if (e) {
							var i = 0, s = new e(u), a = t.document.createTextNode("");
							s.observe(a, { characterData: !0 }), r = function() {
								a.data = i = ++i % 2;
							};
						} else if (t.setImmediate || void 0 === t.MessageChannel) r = "document" in t && "onreadystatechange" in t.document.createElement("script") ? function() {
							var e = t.document.createElement("script");
							e.onreadystatechange = function() {
								u(), e.onreadystatechange = null, e.parentNode.removeChild(e), e = null;
							}, t.document.documentElement.appendChild(e);
						} : function() {
							setTimeout(u, 0);
						};
						else {
							var o = new t.MessageChannel();
							o.port1.onmessage = u, r = function() {
								o.port2.postMessage(0);
							};
						}
						var h = [];
						function u() {
							var e, t;
							n = !0;
							for (var r = h.length; r;) {
								for (t = h, h = [], e = -1; ++e < r;) t[e]();
								r = h.length;
							}
							n = !1;
						}
						l.exports = function(e) {
							1 !== h.push(e) || n || r();
						};
					}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
				}, {}],
				37: [function(e, t, r) {
					"use strict";
					var i = e("immediate");
					function u() {}
					var l = {}, s = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
					function o(e) {
						if ("function" != typeof e) throw new TypeError("resolver must be a function");
						this.state = n, this.queue = [], this.outcome = void 0, e !== u && d(this, e);
					}
					function h(e, t, r) {
						this.promise = e, "function" == typeof t && (this.onFulfilled = t, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r && (this.onRejected = r, this.callRejected = this.otherCallRejected);
					}
					function f(t, r, n) {
						i(function() {
							var e;
							try {
								e = r(n);
							} catch (e) {
								return l.reject(t, e);
							}
							e === t ? l.reject(t, /* @__PURE__ */ new TypeError("Cannot resolve promise with itself")) : l.resolve(t, e);
						});
					}
					function c(e) {
						var t = e && e.then;
						if (e && ("object" == typeof e || "function" == typeof e) && "function" == typeof t) return function() {
							t.apply(e, arguments);
						};
					}
					function d(t, e) {
						var r = !1;
						function n(e) {
							r || (r = !0, l.reject(t, e));
						}
						function i(e) {
							r || (r = !0, l.resolve(t, e));
						}
						var s = p(function() {
							e(i, n);
						});
						"error" === s.status && n(s.value);
					}
					function p(e, t) {
						var r = {};
						try {
							r.value = e(t), r.status = "success";
						} catch (e) {
							r.status = "error", r.value = e;
						}
						return r;
					}
					(t.exports = o).prototype.finally = function(t) {
						if ("function" != typeof t) return this;
						var r = this.constructor;
						return this.then(function(e) {
							return r.resolve(t()).then(function() {
								return e;
							});
						}, function(e) {
							return r.resolve(t()).then(function() {
								throw e;
							});
						});
					}, o.prototype.catch = function(e) {
						return this.then(null, e);
					}, o.prototype.then = function(e, t) {
						if ("function" != typeof e && this.state === a || "function" != typeof t && this.state === s) return this;
						var r = new this.constructor(u);
						this.state !== n ? f(r, this.state === a ? e : t, this.outcome) : this.queue.push(new h(r, e, t));
						return r;
					}, h.prototype.callFulfilled = function(e) {
						l.resolve(this.promise, e);
					}, h.prototype.otherCallFulfilled = function(e) {
						f(this.promise, this.onFulfilled, e);
					}, h.prototype.callRejected = function(e) {
						l.reject(this.promise, e);
					}, h.prototype.otherCallRejected = function(e) {
						f(this.promise, this.onRejected, e);
					}, l.resolve = function(e, t) {
						var r = p(c, t);
						if ("error" === r.status) return l.reject(e, r.value);
						var n = r.value;
						if (n) d(e, n);
						else {
							e.state = a, e.outcome = t;
							for (var i = -1, s = e.queue.length; ++i < s;) e.queue[i].callFulfilled(t);
						}
						return e;
					}, l.reject = function(e, t) {
						e.state = s, e.outcome = t;
						for (var r = -1, n = e.queue.length; ++r < n;) e.queue[r].callRejected(t);
						return e;
					}, o.resolve = function(e) {
						if (e instanceof this) return e;
						return l.resolve(new this(u), e);
					}, o.reject = function(e) {
						var t = new this(u);
						return l.reject(t, e);
					}, o.all = function(e) {
						var r = this;
						if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(/* @__PURE__ */ new TypeError("must be an array"));
						var n = e.length, i = !1;
						if (!n) return this.resolve([]);
						var s = new Array(n), a = 0, t = -1, o = new this(u);
						for (; ++t < n;) h(e[t], t);
						return o;
						function h(e, t) {
							r.resolve(e).then(function(e) {
								s[t] = e, ++a !== n || i || (i = !0, l.resolve(o, s));
							}, function(e) {
								i || (i = !0, l.reject(o, e));
							});
						}
					}, o.race = function(e) {
						var t = this;
						if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(/* @__PURE__ */ new TypeError("must be an array"));
						var r = e.length, n = !1;
						if (!r) return this.resolve([]);
						var i = -1, s = new this(u);
						for (; ++i < r;) a = e[i], t.resolve(a).then(function(e) {
							n || (n = !0, l.resolve(s, e));
						}, function(e) {
							n || (n = !0, l.reject(s, e));
						});
						var a;
						return s;
					};
				}, { immediate: 36 }],
				38: [function(e, t, r) {
					"use strict";
					var n = {};
					(0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
				}, {
					"./lib/deflate": 39,
					"./lib/inflate": 40,
					"./lib/utils/common": 41,
					"./lib/zlib/constants": 44
				}],
				39: [function(e, t, r) {
					"use strict";
					var a = e("./zlib/deflate"), o = e("./utils/common"), h = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, c = 0, d = 8;
					function p(e) {
						if (!(this instanceof p)) return new p(e);
						this.options = o.assign({
							level: f,
							method: d,
							chunkSize: 16384,
							windowBits: 15,
							memLevel: 8,
							strategy: c,
							to: ""
						}, e || {});
						var t = this.options;
						t.raw && 0 < t.windowBits ? t.windowBits = -t.windowBits : t.gzip && 0 < t.windowBits && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
						var r = a.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
						if (r !== l) throw new Error(i[r]);
						if (t.header && a.deflateSetHeader(this.strm, t.header), t.dictionary) {
							var n;
							if (n = "string" == typeof t.dictionary ? h.string2buf(t.dictionary) : "[object ArrayBuffer]" === u.call(t.dictionary) ? new Uint8Array(t.dictionary) : t.dictionary, (r = a.deflateSetDictionary(this.strm, n)) !== l) throw new Error(i[r]);
							this._dict_set = !0;
						}
					}
					function n(e, t) {
						var r = new p(t);
						if (r.push(e, !0), r.err) throw r.msg || i[r.err];
						return r.result;
					}
					p.prototype.push = function(e, t) {
						var r, n, i = this.strm, s = this.options.chunkSize;
						if (this.ended) return !1;
						n = t === ~~t ? t : !0 === t ? 4 : 0, "string" == typeof e ? i.input = h.string2buf(e) : "[object ArrayBuffer]" === u.call(e) ? i.input = new Uint8Array(e) : i.input = e, i.next_in = 0, i.avail_in = i.input.length;
						do {
							if (0 === i.avail_out && (i.output = new o.Buf8(s), i.next_out = 0, i.avail_out = s), 1 !== (r = a.deflate(i, n)) && r !== l) return this.onEnd(r), !(this.ended = !0);
							0 !== i.avail_out && (0 !== i.avail_in || 4 !== n && 2 !== n) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(i.output, i.next_out))) : this.onData(o.shrinkBuf(i.output, i.next_out)));
						} while ((0 < i.avail_in || 0 === i.avail_out) && 1 !== r);
						return 4 === n ? (r = a.deflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === l) : 2 !== n || (this.onEnd(l), !(i.avail_out = 0));
					}, p.prototype.onData = function(e) {
						this.chunks.push(e);
					}, p.prototype.onEnd = function(e) {
						e === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
					}, r.Deflate = p, r.deflate = n, r.deflateRaw = function(e, t) {
						return (t = t || {}).raw = !0, n(e, t);
					}, r.gzip = function(e, t) {
						return (t = t || {}).gzip = !0, n(e, t);
					};
				}, {
					"./utils/common": 41,
					"./utils/strings": 42,
					"./zlib/deflate": 46,
					"./zlib/messages": 51,
					"./zlib/zstream": 53
				}],
				40: [function(e, t, r) {
					"use strict";
					var c = e("./zlib/inflate"), d = e("./utils/common"), p = e("./utils/strings"), m = e("./zlib/constants"), n = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
					function a(e) {
						if (!(this instanceof a)) return new a(e);
						this.options = d.assign({
							chunkSize: 16384,
							windowBits: 0,
							to: ""
						}, e || {});
						var t = this.options;
						t.raw && 0 <= t.windowBits && t.windowBits < 16 && (t.windowBits = -t.windowBits, 0 === t.windowBits && (t.windowBits = -15)), !(0 <= t.windowBits && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32), 15 < t.windowBits && t.windowBits < 48 && 0 == (15 & t.windowBits) && (t.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
						var r = c.inflateInit2(this.strm, t.windowBits);
						if (r !== m.Z_OK) throw new Error(n[r]);
						this.header = new s(), c.inflateGetHeader(this.strm, this.header);
					}
					function o(e, t) {
						var r = new a(t);
						if (r.push(e, !0), r.err) throw r.msg || n[r.err];
						return r.result;
					}
					a.prototype.push = function(e, t) {
						var r, n, i, s, a, o, h = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = !1;
						if (this.ended) return !1;
						n = t === ~~t ? t : !0 === t ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof e ? h.input = p.binstring2buf(e) : "[object ArrayBuffer]" === _.call(e) ? h.input = new Uint8Array(e) : h.input = e, h.next_in = 0, h.avail_in = h.input.length;
						do {
							if (0 === h.avail_out && (h.output = new d.Buf8(u), h.next_out = 0, h.avail_out = u), (r = c.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r = c.inflateSetDictionary(this.strm, o)), r === m.Z_BUF_ERROR && !0 === f && (r = m.Z_OK, f = !1), r !== m.Z_STREAM_END && r !== m.Z_OK) return this.onEnd(r), !(this.ended = !0);
							h.next_out && (0 !== h.avail_out && r !== m.Z_STREAM_END && (0 !== h.avail_in || n !== m.Z_FINISH && n !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (i = p.utf8border(h.output, h.next_out), s = h.next_out - i, a = p.buf2string(h.output, i), h.next_out = s, h.avail_out = u - s, s && d.arraySet(h.output, h.output, i, s, 0), this.onData(a)) : this.onData(d.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = !0);
						} while ((0 < h.avail_in || 0 === h.avail_out) && r !== m.Z_STREAM_END);
						return r === m.Z_STREAM_END && (n = m.Z_FINISH), n === m.Z_FINISH ? (r = c.inflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === m.Z_OK) : n !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
					}, a.prototype.onData = function(e) {
						this.chunks.push(e);
					}, a.prototype.onEnd = function(e) {
						e === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
					}, r.Inflate = a, r.inflate = o, r.inflateRaw = function(e, t) {
						return (t = t || {}).raw = !0, o(e, t);
					}, r.ungzip = o;
				}, {
					"./utils/common": 41,
					"./utils/strings": 42,
					"./zlib/constants": 44,
					"./zlib/gzheader": 47,
					"./zlib/inflate": 49,
					"./zlib/messages": 51,
					"./zlib/zstream": 53
				}],
				41: [function(e, t, r) {
					"use strict";
					var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
					r.assign = function(e) {
						for (var t = Array.prototype.slice.call(arguments, 1); t.length;) {
							var r = t.shift();
							if (r) {
								if ("object" != typeof r) throw new TypeError(r + "must be non-object");
								for (var n in r) r.hasOwnProperty(n) && (e[n] = r[n]);
							}
						}
						return e;
					}, r.shrinkBuf = function(e, t) {
						return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t, e);
					};
					var i = {
						arraySet: function(e, t, r, n, i) {
							if (t.subarray && e.subarray) e.set(t.subarray(r, r + n), i);
							else for (var s = 0; s < n; s++) e[i + s] = t[r + s];
						},
						flattenChunks: function(e) {
							var t, r, n, i, s, a;
							for (t = n = 0, r = e.length; t < r; t++) n += e[t].length;
							for (a = new Uint8Array(n), t = i = 0, r = e.length; t < r; t++) s = e[t], a.set(s, i), i += s.length;
							return a;
						}
					}, s = {
						arraySet: function(e, t, r, n, i) {
							for (var s = 0; s < n; s++) e[i + s] = t[r + s];
						},
						flattenChunks: function(e) {
							return [].concat.apply([], e);
						}
					};
					r.setTyped = function(e) {
						e ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
					}, r.setTyped(n);
				}, {}],
				42: [function(e, t, r) {
					"use strict";
					var h = e("./common"), i = !0, s = !0;
					try {
						String.fromCharCode.apply(null, [0]);
					} catch (e) {
						i = !1;
					}
					try {
						String.fromCharCode.apply(null, /* @__PURE__ */ new Uint8Array(1));
					} catch (e) {
						s = !1;
					}
					for (var u = new h.Buf8(256), n = 0; n < 256; n++) u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
					function l(e, t) {
						if (t < 65537 && (e.subarray && s || !e.subarray && i)) return String.fromCharCode.apply(null, h.shrinkBuf(e, t));
						for (var r = "", n = 0; n < t; n++) r += String.fromCharCode(e[n]);
						return r;
					}
					u[254] = u[254] = 1, r.string2buf = function(e) {
						var t, r, n, i, s, a = e.length, o = 0;
						for (i = 0; i < a; i++) 55296 == (64512 & (r = e.charCodeAt(i))) && i + 1 < a && 56320 == (64512 & (n = e.charCodeAt(i + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), i++), o += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
						for (t = new h.Buf8(o), i = s = 0; s < o; i++) 55296 == (64512 & (r = e.charCodeAt(i))) && i + 1 < a && 56320 == (64512 & (n = e.charCodeAt(i + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), i++), r < 128 ? t[s++] = r : (r < 2048 ? t[s++] = 192 | r >>> 6 : (r < 65536 ? t[s++] = 224 | r >>> 12 : (t[s++] = 240 | r >>> 18, t[s++] = 128 | r >>> 12 & 63), t[s++] = 128 | r >>> 6 & 63), t[s++] = 128 | 63 & r);
						return t;
					}, r.buf2binstring = function(e) {
						return l(e, e.length);
					}, r.binstring2buf = function(e) {
						for (var t = new h.Buf8(e.length), r = 0, n = t.length; r < n; r++) t[r] = e.charCodeAt(r);
						return t;
					}, r.buf2string = function(e, t) {
						var r, n, i, s, a = t || e.length, o = new Array(2 * a);
						for (r = n = 0; r < a;) if ((i = e[r++]) < 128) o[n++] = i;
						else if (4 < (s = u[i])) o[n++] = 65533, r += s - 1;
						else {
							for (i &= 2 === s ? 31 : 3 === s ? 15 : 7; 1 < s && r < a;) i = i << 6 | 63 & e[r++], s--;
							1 < s ? o[n++] = 65533 : i < 65536 ? o[n++] = i : (i -= 65536, o[n++] = 55296 | i >> 10 & 1023, o[n++] = 56320 | 1023 & i);
						}
						return l(o, n);
					}, r.utf8border = function(e, t) {
						var r;
						for ((t = t || e.length) > e.length && (t = e.length), r = t - 1; 0 <= r && 128 == (192 & e[r]);) r--;
						return r < 0 ? t : 0 === r ? t : r + u[e[r]] > t ? r : t;
					};
				}, { "./common": 41 }],
				43: [function(e, t, r) {
					"use strict";
					t.exports = function(e, t, r, n) {
						for (var i = 65535 & e | 0, s = e >>> 16 & 65535 | 0, a = 0; 0 !== r;) {
							for (r -= a = 2e3 < r ? 2e3 : r; s = s + (i = i + t[n++] | 0) | 0, --a;);
							i %= 65521, s %= 65521;
						}
						return i | s << 16 | 0;
					};
				}, {}],
				44: [function(e, t, r) {
					"use strict";
					t.exports = {
						Z_NO_FLUSH: 0,
						Z_PARTIAL_FLUSH: 1,
						Z_SYNC_FLUSH: 2,
						Z_FULL_FLUSH: 3,
						Z_FINISH: 4,
						Z_BLOCK: 5,
						Z_TREES: 6,
						Z_OK: 0,
						Z_STREAM_END: 1,
						Z_NEED_DICT: 2,
						Z_ERRNO: -1,
						Z_STREAM_ERROR: -2,
						Z_DATA_ERROR: -3,
						Z_BUF_ERROR: -5,
						Z_NO_COMPRESSION: 0,
						Z_BEST_SPEED: 1,
						Z_BEST_COMPRESSION: 9,
						Z_DEFAULT_COMPRESSION: -1,
						Z_FILTERED: 1,
						Z_HUFFMAN_ONLY: 2,
						Z_RLE: 3,
						Z_FIXED: 4,
						Z_DEFAULT_STRATEGY: 0,
						Z_BINARY: 0,
						Z_TEXT: 1,
						Z_UNKNOWN: 2,
						Z_DEFLATED: 8
					};
				}, {}],
				45: [function(e, t, r) {
					"use strict";
					var o = function() {
						for (var e, t = [], r = 0; r < 256; r++) {
							e = r;
							for (var n = 0; n < 8; n++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
							t[r] = e;
						}
						return t;
					}();
					t.exports = function(e, t, r, n) {
						var i = o, s = n + r;
						e ^= -1;
						for (var a = n; a < s; a++) e = e >>> 8 ^ i[255 & (e ^ t[a])];
						return -1 ^ e;
					};
				}, {}],
				46: [function(e, t, r) {
					"use strict";
					var h, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E = 113, A = 1, I = 2, O = 3, B = 4;
					function R(e, t) {
						return e.msg = n[t], t;
					}
					function T(e) {
						return (e << 1) - (4 < e ? 9 : 0);
					}
					function D(e) {
						for (var t = e.length; 0 <= --t;) e[t] = 0;
					}
					function F(e) {
						var t = e.state, r = t.pending;
						r > e.avail_out && (r = e.avail_out), 0 !== r && (c.arraySet(e.output, t.pending_buf, t.pending_out, r, e.next_out), e.next_out += r, t.pending_out += r, e.total_out += r, e.avail_out -= r, t.pending -= r, 0 === t.pending && (t.pending_out = 0));
					}
					function N(e, t) {
						u._tr_flush_block(e, 0 <= e.block_start ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, F(e.strm);
					}
					function U(e, t) {
						e.pending_buf[e.pending++] = t;
					}
					function P(e, t) {
						e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = 255 & t;
					}
					function L(e, t) {
						var r, n, i = e.max_chain_length, s = e.strstart, a = e.prev_length, o = e.nice_match, h = e.strstart > e.w_size - z ? e.strstart - (e.w_size - z) : 0, u = e.window, l = e.w_mask, f = e.prev, c = e.strstart + S, d = u[s + a - 1], p = u[s + a];
						e.prev_length >= e.good_match && (i >>= 2), o > e.lookahead && (o = e.lookahead);
						do
							if (u[(r = t) + a] === p && u[r + a - 1] === d && u[r] === u[s] && u[++r] === u[s + 1]) {
								s += 2, r++;
								do								;
while (u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && s < c);
								if (n = S - (c - s), s = c - S, a < n) {
									if (e.match_start = t, o <= (a = n)) break;
									d = u[s + a - 1], p = u[s + a];
								}
							}
						while ((t = f[t & l]) > h && 0 != --i);
						return a <= e.lookahead ? a : e.lookahead;
					}
					function j(e) {
						var t, r, n, i, s, a, o, h, u, l, f = e.w_size;
						do {
							if (i = e.window_size - e.lookahead - e.strstart, e.strstart >= f + (f - z)) {
								for (c.arraySet(e.window, e.window, f, f, 0), e.match_start -= f, e.strstart -= f, e.block_start -= f, t = r = e.hash_size; n = e.head[--t], e.head[t] = f <= n ? n - f : 0, --r;);
								for (t = r = f; n = e.prev[--t], e.prev[t] = f <= n ? n - f : 0, --r;);
								i += f;
							}
							if (0 === e.strm.avail_in) break;
							if (a = e.strm, o = e.window, h = e.strstart + e.lookahead, u = i, l = void 0, l = a.avail_in, u < l && (l = u), r = 0 === l ? 0 : (a.avail_in -= l, c.arraySet(o, a.input, a.next_in, l, h), 1 === a.state.wrap ? a.adler = d(a.adler, o, l, h) : 2 === a.state.wrap && (a.adler = p(a.adler, o, l, h)), a.next_in += l, a.total_in += l, l), e.lookahead += r, e.lookahead + e.insert >= x) for (s = e.strstart - e.insert, e.ins_h = e.window[s], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[s + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[s + x - 1]) & e.hash_mask, e.prev[s & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = s, s++, e.insert--, !(e.lookahead + e.insert < x)););
						} while (e.lookahead < z && 0 !== e.strm.avail_in);
					}
					function Z(e, t) {
						for (var r, n;;) {
							if (e.lookahead < z) {
								if (j(e), e.lookahead < z && t === l) return A;
								if (0 === e.lookahead) break;
							}
							if (r = 0, e.lookahead >= x && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + x - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 !== r && e.strstart - r <= e.w_size - z && (e.match_length = L(e, r)), e.match_length >= x) if (n = u._tr_tally(e, e.strstart - e.match_start, e.match_length - x), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= x) {
								for (e.match_length--; e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + x - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart, 0 != --e.match_length;);
								e.strstart++;
							} else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
							else n = u._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
							if (n && (N(e, !1), 0 === e.strm.avail_out)) return A;
						}
						return e.insert = e.strstart < x - 1 ? e.strstart : x - 1, t === f ? (N(e, !0), 0 === e.strm.avail_out ? O : B) : e.last_lit && (N(e, !1), 0 === e.strm.avail_out) ? A : I;
					}
					function W(e, t) {
						for (var r, n, i;;) {
							if (e.lookahead < z) {
								if (j(e), e.lookahead < z && t === l) return A;
								if (0 === e.lookahead) break;
							}
							if (r = 0, e.lookahead >= x && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + x - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = x - 1, 0 !== r && e.prev_length < e.max_lazy_match && e.strstart - r <= e.w_size - z && (e.match_length = L(e, r), e.match_length <= 5 && (1 === e.strategy || e.match_length === x && 4096 < e.strstart - e.match_start) && (e.match_length = x - 1)), e.prev_length >= x && e.match_length <= e.prev_length) {
								for (i = e.strstart + e.lookahead - x, n = u._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - x), e.lookahead -= e.prev_length - 1, e.prev_length -= 2; ++e.strstart <= i && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + x - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 != --e.prev_length;);
								if (e.match_available = 0, e.match_length = x - 1, e.strstart++, n && (N(e, !1), 0 === e.strm.avail_out)) return A;
							} else if (e.match_available) {
								if ((n = u._tr_tally(e, 0, e.window[e.strstart - 1])) && N(e, !1), e.strstart++, e.lookahead--, 0 === e.strm.avail_out) return A;
							} else e.match_available = 1, e.strstart++, e.lookahead--;
						}
						return e.match_available && (n = u._tr_tally(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < x - 1 ? e.strstart : x - 1, t === f ? (N(e, !0), 0 === e.strm.avail_out ? O : B) : e.last_lit && (N(e, !1), 0 === e.strm.avail_out) ? A : I;
					}
					function M(e, t, r, n, i) {
						this.good_length = e, this.max_lazy = t, this.nice_length = r, this.max_chain = n, this.func = i;
					}
					function H() {
						this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
					}
					function G(e) {
						var t;
						return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = i, (t = e.state).pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap ? C : E, e.adler = 2 === t.wrap ? 0 : 1, t.last_flush = l, u._tr_init(t), m) : R(e, _);
					}
					function K(e) {
						var t = G(e);
						return t === m && function(e) {
							e.window_size = 2 * e.w_size, D(e.head), e.max_lazy_match = h[e.level].max_lazy, e.good_match = h[e.level].good_length, e.nice_match = h[e.level].nice_length, e.max_chain_length = h[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = x - 1, e.match_available = 0, e.ins_h = 0;
						}(e.state), t;
					}
					function Y(e, t, r, n, i, s) {
						if (!e) return _;
						var a = 1;
						if (t === g && (t = 6), n < 0 ? (a = 0, n = -n) : 15 < n && (a = 2, n -= 16), i < 1 || y < i || r !== v || n < 8 || 15 < n || t < 0 || 9 < t || s < 0 || b < s) return R(e, _);
						8 === n && (n = 9);
						var o = new H();
						return (e.state = o).strm = e, o.wrap = a, o.gzhead = null, o.w_bits = n, o.w_size = 1 << o.w_bits, o.w_mask = o.w_size - 1, o.hash_bits = i + 7, o.hash_size = 1 << o.hash_bits, o.hash_mask = o.hash_size - 1, o.hash_shift = ~~((o.hash_bits + x - 1) / x), o.window = new c.Buf8(2 * o.w_size), o.head = new c.Buf16(o.hash_size), o.prev = new c.Buf16(o.w_size), o.lit_bufsize = 1 << i + 6, o.pending_buf_size = 4 * o.lit_bufsize, o.pending_buf = new c.Buf8(o.pending_buf_size), o.d_buf = 1 * o.lit_bufsize, o.l_buf = 3 * o.lit_bufsize, o.level = t, o.strategy = s, o.method = r, K(e);
					}
					h = [
						new M(0, 0, 0, 0, function(e, t) {
							var r = 65535;
							for (r > e.pending_buf_size - 5 && (r = e.pending_buf_size - 5);;) {
								if (e.lookahead <= 1) {
									if (j(e), 0 === e.lookahead && t === l) return A;
									if (0 === e.lookahead) break;
								}
								e.strstart += e.lookahead, e.lookahead = 0;
								var n = e.block_start + r;
								if ((0 === e.strstart || e.strstart >= n) && (e.lookahead = e.strstart - n, e.strstart = n, N(e, !1), 0 === e.strm.avail_out)) return A;
								if (e.strstart - e.block_start >= e.w_size - z && (N(e, !1), 0 === e.strm.avail_out)) return A;
							}
							return e.insert = 0, t === f ? (N(e, !0), 0 === e.strm.avail_out ? O : B) : (e.strstart > e.block_start && (N(e, !1), e.strm.avail_out), A);
						}),
						new M(4, 4, 8, 4, Z),
						new M(4, 5, 16, 8, Z),
						new M(4, 6, 32, 32, Z),
						new M(4, 4, 16, 16, W),
						new M(8, 16, 32, 32, W),
						new M(8, 16, 128, 128, W),
						new M(8, 32, 128, 256, W),
						new M(32, 128, 258, 1024, W),
						new M(32, 258, 258, 4096, W)
					], r.deflateInit = function(e, t) {
						return Y(e, t, v, 15, 8, 0);
					}, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function(e, t) {
						return e && e.state ? 2 !== e.state.wrap ? _ : (e.state.gzhead = t, m) : _;
					}, r.deflate = function(e, t) {
						var r, n, i, s;
						if (!e || !e.state || 5 < t || t < 0) return e ? R(e, _) : _;
						if (n = e.state, !e.output || !e.input && 0 !== e.avail_in || 666 === n.status && t !== f) return R(e, 0 === e.avail_out ? -5 : _);
						if (n.strm = e, r = n.last_flush, n.last_flush = t, n.status === C) if (2 === n.wrap) e.adler = 0, U(n, 31), U(n, 139), U(n, 8), n.gzhead ? (U(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)), U(n, 255 & n.gzhead.time), U(n, n.gzhead.time >> 8 & 255), U(n, n.gzhead.time >> 16 & 255), U(n, n.gzhead.time >> 24 & 255), U(n, 9 === n.level ? 2 : 2 <= n.strategy || n.level < 2 ? 4 : 0), U(n, 255 & n.gzhead.os), n.gzhead.extra && n.gzhead.extra.length && (U(n, 255 & n.gzhead.extra.length), U(n, n.gzhead.extra.length >> 8 & 255)), n.gzhead.hcrc && (e.adler = p(e.adler, n.pending_buf, n.pending, 0)), n.gzindex = 0, n.status = 69) : (U(n, 0), U(n, 0), U(n, 0), U(n, 0), U(n, 0), U(n, 9 === n.level ? 2 : 2 <= n.strategy || n.level < 2 ? 4 : 0), U(n, 3), n.status = E);
						else {
							var a = v + (n.w_bits - 8 << 4) << 8;
							a |= (2 <= n.strategy || n.level < 2 ? 0 : n.level < 6 ? 1 : 6 === n.level ? 2 : 3) << 6, 0 !== n.strstart && (a |= 32), a += 31 - a % 31, n.status = E, P(n, a), 0 !== n.strstart && (P(n, e.adler >>> 16), P(n, 65535 & e.adler)), e.adler = 1;
						}
						if (69 === n.status) if (n.gzhead.extra) {
							for (i = n.pending; n.gzindex < (65535 & n.gzhead.extra.length) && (n.pending !== n.pending_buf_size || (n.gzhead.hcrc && n.pending > i && (e.adler = p(e.adler, n.pending_buf, n.pending - i, i)), F(e), i = n.pending, n.pending !== n.pending_buf_size));) U(n, 255 & n.gzhead.extra[n.gzindex]), n.gzindex++;
							n.gzhead.hcrc && n.pending > i && (e.adler = p(e.adler, n.pending_buf, n.pending - i, i)), n.gzindex === n.gzhead.extra.length && (n.gzindex = 0, n.status = 73);
						} else n.status = 73;
						if (73 === n.status) if (n.gzhead.name) {
							i = n.pending;
							do {
								if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > i && (e.adler = p(e.adler, n.pending_buf, n.pending - i, i)), F(e), i = n.pending, n.pending === n.pending_buf_size)) {
									s = 1;
									break;
								}
								s = n.gzindex < n.gzhead.name.length ? 255 & n.gzhead.name.charCodeAt(n.gzindex++) : 0, U(n, s);
							} while (0 !== s);
							n.gzhead.hcrc && n.pending > i && (e.adler = p(e.adler, n.pending_buf, n.pending - i, i)), 0 === s && (n.gzindex = 0, n.status = 91);
						} else n.status = 91;
						if (91 === n.status) if (n.gzhead.comment) {
							i = n.pending;
							do {
								if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > i && (e.adler = p(e.adler, n.pending_buf, n.pending - i, i)), F(e), i = n.pending, n.pending === n.pending_buf_size)) {
									s = 1;
									break;
								}
								s = n.gzindex < n.gzhead.comment.length ? 255 & n.gzhead.comment.charCodeAt(n.gzindex++) : 0, U(n, s);
							} while (0 !== s);
							n.gzhead.hcrc && n.pending > i && (e.adler = p(e.adler, n.pending_buf, n.pending - i, i)), 0 === s && (n.status = 103);
						} else n.status = 103;
						if (103 === n.status && (n.gzhead.hcrc ? (n.pending + 2 > n.pending_buf_size && F(e), n.pending + 2 <= n.pending_buf_size && (U(n, 255 & e.adler), U(n, e.adler >> 8 & 255), e.adler = 0, n.status = E)) : n.status = E), 0 !== n.pending) {
							if (F(e), 0 === e.avail_out) return n.last_flush = -1, m;
						} else if (0 === e.avail_in && T(t) <= T(r) && t !== f) return R(e, -5);
						if (666 === n.status && 0 !== e.avail_in) return R(e, -5);
						if (0 !== e.avail_in || 0 !== n.lookahead || t !== l && 666 !== n.status) {
							var o = 2 === n.strategy ? function(e, t) {
								for (var r;;) {
									if (0 === e.lookahead && (j(e), 0 === e.lookahead)) {
										if (t === l) return A;
										break;
									}
									if (e.match_length = 0, r = u._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, r && (N(e, !1), 0 === e.strm.avail_out)) return A;
								}
								return e.insert = 0, t === f ? (N(e, !0), 0 === e.strm.avail_out ? O : B) : e.last_lit && (N(e, !1), 0 === e.strm.avail_out) ? A : I;
							}(n, t) : 3 === n.strategy ? function(e, t) {
								for (var r, n, i, s, a = e.window;;) {
									if (e.lookahead <= S) {
										if (j(e), e.lookahead <= S && t === l) return A;
										if (0 === e.lookahead) break;
									}
									if (e.match_length = 0, e.lookahead >= x && 0 < e.strstart && (n = a[i = e.strstart - 1]) === a[++i] && n === a[++i] && n === a[++i]) {
										s = e.strstart + S;
										do										;
while (n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && i < s);
										e.match_length = S - (s - i), e.match_length > e.lookahead && (e.match_length = e.lookahead);
									}
									if (e.match_length >= x ? (r = u._tr_tally(e, 1, e.match_length - x), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (r = u._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), r && (N(e, !1), 0 === e.strm.avail_out)) return A;
								}
								return e.insert = 0, t === f ? (N(e, !0), 0 === e.strm.avail_out ? O : B) : e.last_lit && (N(e, !1), 0 === e.strm.avail_out) ? A : I;
							}(n, t) : h[n.level].func(n, t);
							if (o !== O && o !== B || (n.status = 666), o === A || o === O) return 0 === e.avail_out && (n.last_flush = -1), m;
							if (o === I && (1 === t ? u._tr_align(n) : 5 !== t && (u._tr_stored_block(n, 0, 0, !1), 3 === t && (D(n.head), 0 === n.lookahead && (n.strstart = 0, n.block_start = 0, n.insert = 0))), F(e), 0 === e.avail_out)) return n.last_flush = -1, m;
						}
						return t !== f ? m : n.wrap <= 0 ? 1 : (2 === n.wrap ? (U(n, 255 & e.adler), U(n, e.adler >> 8 & 255), U(n, e.adler >> 16 & 255), U(n, e.adler >> 24 & 255), U(n, 255 & e.total_in), U(n, e.total_in >> 8 & 255), U(n, e.total_in >> 16 & 255), U(n, e.total_in >> 24 & 255)) : (P(n, e.adler >>> 16), P(n, 65535 & e.adler)), F(e), 0 < n.wrap && (n.wrap = -n.wrap), 0 !== n.pending ? m : 1);
					}, r.deflateEnd = function(e) {
						var t;
						return e && e.state ? (t = e.state.status) !== C && 69 !== t && 73 !== t && 91 !== t && 103 !== t && t !== E && 666 !== t ? R(e, _) : (e.state = null, t === E ? R(e, -3) : m) : _;
					}, r.deflateSetDictionary = function(e, t) {
						var r, n, i, s, a, o, h, u, l = t.length;
						if (!e || !e.state) return _;
						if (2 === (s = (r = e.state).wrap) || 1 === s && r.status !== C || r.lookahead) return _;
						for (1 === s && (e.adler = d(e.adler, t, l, 0)), r.wrap = 0, l >= r.w_size && (0 === s && (D(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0), u = new c.Buf8(r.w_size), c.arraySet(u, t, l - r.w_size, r.w_size, 0), t = u, l = r.w_size), a = e.avail_in, o = e.next_in, h = e.input, e.avail_in = l, e.next_in = 0, e.input = t, j(r); r.lookahead >= x;) {
							for (n = r.strstart, i = r.lookahead - (x - 1); r.ins_h = (r.ins_h << r.hash_shift ^ r.window[n + x - 1]) & r.hash_mask, r.prev[n & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = n, n++, --i;);
							r.strstart = n, r.lookahead = x - 1, j(r);
						}
						return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = x - 1, r.match_available = 0, e.next_in = o, e.input = h, e.avail_in = a, r.wrap = s, m;
					}, r.deflateInfo = "pako deflate (from Nodeca project)";
				}, {
					"../utils/common": 41,
					"./adler32": 43,
					"./crc32": 45,
					"./messages": 51,
					"./trees": 52
				}],
				47: [function(e, t, r) {
					"use strict";
					t.exports = function() {
						this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
					};
				}, {}],
				48: [function(e, t, r) {
					"use strict";
					t.exports = function(e, t) {
						var r = e.state, n = e.next_in, i, s, a, o, h, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z = e.input, C;
						i = n + (e.avail_in - 5), s = e.next_out, C = e.output, a = s - (t - e.avail_out), o = s + (e.avail_out - 257), h = r.dmax, u = r.wsize, l = r.whave, f = r.wnext, c = r.window, d = r.hold, p = r.bits, m = r.lencode, _ = r.distcode, g = (1 << r.lenbits) - 1, b = (1 << r.distbits) - 1;
						e: do {
							p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = m[d & g];
							t: for (;;) {
								if (d >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255)) C[s++] = 65535 & v;
								else {
									if (!(16 & y)) {
										if (0 == (64 & y)) {
											v = m[(65535 & v) + (d & (1 << y) - 1)];
											continue t;
										}
										if (32 & y) {
											r.mode = 12;
											break e;
										}
										e.msg = "invalid literal/length code", r.mode = 30;
										break e;
									}
									w = 65535 & v, (y &= 15) && (p < y && (d += z[n++] << p, p += 8), w += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = _[d & b];
									r: for (;;) {
										if (d >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
											if (0 == (64 & y)) {
												v = _[(65535 & v) + (d & (1 << y) - 1)];
												continue r;
											}
											e.msg = "invalid distance code", r.mode = 30;
											break e;
										}
										if (k = 65535 & v, p < (y &= 15) && (d += z[n++] << p, (p += 8) < y && (d += z[n++] << p, p += 8)), h < (k += d & (1 << y) - 1)) {
											e.msg = "invalid distance too far back", r.mode = 30;
											break e;
										}
										if (d >>>= y, p -= y, (y = s - a) < k) {
											if (l < (y = k - y) && r.sane) {
												e.msg = "invalid distance too far back", r.mode = 30;
												break e;
											}
											if (S = c, (x = 0) === f) {
												if (x += u - y, y < w) {
													for (w -= y; C[s++] = c[x++], --y;);
													x = s - k, S = C;
												}
											} else if (f < y) {
												if (x += u + f - y, (y -= f) < w) {
													for (w -= y; C[s++] = c[x++], --y;);
													if (x = 0, f < w) {
														for (w -= y = f; C[s++] = c[x++], --y;);
														x = s - k, S = C;
													}
												}
											} else if (x += f - y, y < w) {
												for (w -= y; C[s++] = c[x++], --y;);
												x = s - k, S = C;
											}
											for (; 2 < w;) C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
											w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
										} else {
											for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3););
											w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
										}
										break;
									}
								}
								break;
							}
						} while (n < i && s < o);
						n -= w = p >> 3, d &= (1 << (p -= w << 3)) - 1, e.next_in = n, e.next_out = s, e.avail_in = n < i ? i - n + 5 : 5 - (n - i), e.avail_out = s < o ? o - s + 257 : 257 - (s - o), r.hold = d, r.bits = p;
					};
				}, {}],
				49: [function(e, t, r) {
					"use strict";
					var I = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), R = e("./inffast"), T = e("./inftrees"), D = 1, F = 2, N = 0, U = -2, P = 1, n = 852, i = 592;
					function L(e) {
						return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24);
					}
					function s() {
						this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
					}
					function a(e) {
						var t;
						return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = P, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new I.Buf32(n), t.distcode = t.distdyn = new I.Buf32(i), t.sane = 1, t.back = -1, N) : U;
					}
					function o(e) {
						var t;
						return e && e.state ? ((t = e.state).wsize = 0, t.whave = 0, t.wnext = 0, a(e)) : U;
					}
					function h(e, t) {
						var r, n;
						return e && e.state ? (n = e.state, t < 0 ? (r = 0, t = -t) : (r = 1 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || 15 < t) ? U : (null !== n.window && n.wbits !== t && (n.window = null), n.wrap = r, n.wbits = t, o(e))) : U;
					}
					function u(e, t) {
						var r, n;
						return e ? (n = new s(), (e.state = n).window = null, (r = h(e, t)) !== N && (e.state = null), r) : U;
					}
					var l, f, c = !0;
					function j(e) {
						if (c) {
							var t;
							for (l = new I.Buf32(512), f = new I.Buf32(32), t = 0; t < 144;) e.lens[t++] = 8;
							for (; t < 256;) e.lens[t++] = 9;
							for (; t < 280;) e.lens[t++] = 7;
							for (; t < 288;) e.lens[t++] = 8;
							for (T(D, e.lens, 0, 288, l, 0, e.work, { bits: 9 }), t = 0; t < 32;) e.lens[t++] = 5;
							T(F, e.lens, 0, 32, f, 0, e.work, { bits: 5 }), c = !1;
						}
						e.lencode = l, e.lenbits = 9, e.distcode = f, e.distbits = 5;
					}
					function Z(e, t, r, n) {
						var i, s = e.state;
						return null === s.window && (s.wsize = 1 << s.wbits, s.wnext = 0, s.whave = 0, s.window = new I.Buf8(s.wsize)), n >= s.wsize ? (I.arraySet(s.window, t, r - s.wsize, s.wsize, 0), s.wnext = 0, s.whave = s.wsize) : (n < (i = s.wsize - s.wnext) && (i = n), I.arraySet(s.window, t, r - n, i, s.wnext), (n -= i) ? (I.arraySet(s.window, t, r - n, n, 0), s.wnext = n, s.whave = s.wsize) : (s.wnext += i, s.wnext === s.wsize && (s.wnext = 0), s.whave < s.wsize && (s.whave += i))), 0;
					}
					r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function(e) {
						return u(e, 15);
					}, r.inflateInit2 = u, r.inflate = function(e, t) {
						var r, n, i, s, a, o, h, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z, C = 0, E = new I.Buf8(4), A = [
							16,
							17,
							18,
							0,
							8,
							7,
							9,
							6,
							10,
							5,
							11,
							4,
							12,
							3,
							13,
							2,
							14,
							1,
							15
						];
						if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) return U;
						12 === (r = e.state).mode && (r.mode = 13), a = e.next_out, i = e.output, h = e.avail_out, s = e.next_in, n = e.input, o = e.avail_in, u = r.hold, l = r.bits, f = o, c = h, x = N;
						e: for (;;) switch (r.mode) {
							case P:
								if (0 === r.wrap) {
									r.mode = 13;
									break;
								}
								for (; l < 16;) {
									if (0 === o) break e;
									o--, u += n[s++] << l, l += 8;
								}
								if (2 & r.wrap && 35615 === u) {
									E[r.check = 0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0), l = u = 0, r.mode = 2;
									break;
								}
								if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & u) << 8) + (u >> 8)) % 31) {
									e.msg = "incorrect header check", r.mode = 30;
									break;
								}
								if (8 != (15 & u)) {
									e.msg = "unknown compression method", r.mode = 30;
									break;
								}
								if (l -= 4, k = 8 + (15 & (u >>>= 4)), 0 === r.wbits) r.wbits = k;
								else if (k > r.wbits) {
									e.msg = "invalid window size", r.mode = 30;
									break;
								}
								r.dmax = 1 << k, e.adler = r.check = 1, r.mode = 512 & u ? 10 : 12, l = u = 0;
								break;
							case 2:
								for (; l < 16;) {
									if (0 === o) break e;
									o--, u += n[s++] << l, l += 8;
								}
								if (r.flags = u, 8 != (255 & r.flags)) {
									e.msg = "unknown compression method", r.mode = 30;
									break;
								}
								if (57344 & r.flags) {
									e.msg = "unknown header flags set", r.mode = 30;
									break;
								}
								r.head && (r.head.text = u >> 8 & 1), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0)), l = u = 0, r.mode = 3;
							case 3:
								for (; l < 32;) {
									if (0 === o) break e;
									o--, u += n[s++] << l, l += 8;
								}
								r.head && (r.head.time = u), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, E[2] = u >>> 16 & 255, E[3] = u >>> 24 & 255, r.check = B(r.check, E, 4, 0)), l = u = 0, r.mode = 4;
							case 4:
								for (; l < 16;) {
									if (0 === o) break e;
									o--, u += n[s++] << l, l += 8;
								}
								r.head && (r.head.xflags = 255 & u, r.head.os = u >> 8), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0)), l = u = 0, r.mode = 5;
							case 5:
								if (1024 & r.flags) {
									for (; l < 16;) {
										if (0 === o) break e;
										o--, u += n[s++] << l, l += 8;
									}
									r.length = u, r.head && (r.head.extra_len = u), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0)), l = u = 0;
								} else r.head && (r.head.extra = null);
								r.mode = 6;
							case 6:
								if (1024 & r.flags && (o < (d = r.length) && (d = o), d && (r.head && (k = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), I.arraySet(r.head.extra, n, s, d, k)), 512 & r.flags && (r.check = B(r.check, n, d, s)), o -= d, s += d, r.length -= d), r.length)) break e;
								r.length = 0, r.mode = 7;
							case 7:
								if (2048 & r.flags) {
									if (0 === o) break e;
									for (d = 0; k = n[s + d++], r.head && k && r.length < 65536 && (r.head.name += String.fromCharCode(k)), k && d < o;);
									if (512 & r.flags && (r.check = B(r.check, n, d, s)), o -= d, s += d, k) break e;
								} else r.head && (r.head.name = null);
								r.length = 0, r.mode = 8;
							case 8:
								if (4096 & r.flags) {
									if (0 === o) break e;
									for (d = 0; k = n[s + d++], r.head && k && r.length < 65536 && (r.head.comment += String.fromCharCode(k)), k && d < o;);
									if (512 & r.flags && (r.check = B(r.check, n, d, s)), o -= d, s += d, k) break e;
								} else r.head && (r.head.comment = null);
								r.mode = 9;
							case 9:
								if (512 & r.flags) {
									for (; l < 16;) {
										if (0 === o) break e;
										o--, u += n[s++] << l, l += 8;
									}
									if (u !== (65535 & r.check)) {
										e.msg = "header crc mismatch", r.mode = 30;
										break;
									}
									l = u = 0;
								}
								r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = !0), e.adler = r.check = 0, r.mode = 12;
								break;
							case 10:
								for (; l < 32;) {
									if (0 === o) break e;
									o--, u += n[s++] << l, l += 8;
								}
								e.adler = r.check = L(u), l = u = 0, r.mode = 11;
							case 11:
								if (0 === r.havedict) return e.next_out = a, e.avail_out = h, e.next_in = s, e.avail_in = o, r.hold = u, r.bits = l, 2;
								e.adler = r.check = 1, r.mode = 12;
							case 12: if (5 === t || 6 === t) break e;
							case 13:
								if (r.last) {
									u >>>= 7 & l, l -= 7 & l, r.mode = 27;
									break;
								}
								for (; l < 3;) {
									if (0 === o) break e;
									o--, u += n[s++] << l, l += 8;
								}
								switch (r.last = 1 & u, l -= 1, 3 & (u >>>= 1)) {
									case 0:
										r.mode = 14;
										break;
									case 1:
										if (j(r), r.mode = 20, 6 !== t) break;
										u >>>= 2, l -= 2;
										break e;
									case 2:
										r.mode = 17;
										break;
									case 3: e.msg = "invalid block type", r.mode = 30;
								}
								u >>>= 2, l -= 2;
								break;
							case 14:
								for (u >>>= 7 & l, l -= 7 & l; l < 32;) {
									if (0 === o) break e;
									o--, u += n[s++] << l, l += 8;
								}
								if ((65535 & u) != (u >>> 16 ^ 65535)) {
									e.msg = "invalid stored block lengths", r.mode = 30;
									break;
								}
								if (r.length = 65535 & u, l = u = 0, r.mode = 15, 6 === t) break e;
							case 15: r.mode = 16;
							case 16:
								if (d = r.length) {
									if (o < d && (d = o), h < d && (d = h), 0 === d) break e;
									I.arraySet(i, n, s, d, a), o -= d, s += d, h -= d, a += d, r.length -= d;
									break;
								}
								r.mode = 12;
								break;
							case 17:
								for (; l < 14;) {
									if (0 === o) break e;
									o--, u += n[s++] << l, l += 8;
								}
								if (r.nlen = 257 + (31 & u), u >>>= 5, l -= 5, r.ndist = 1 + (31 & u), u >>>= 5, l -= 5, r.ncode = 4 + (15 & u), u >>>= 4, l -= 4, 286 < r.nlen || 30 < r.ndist) {
									e.msg = "too many length or distance symbols", r.mode = 30;
									break;
								}
								r.have = 0, r.mode = 18;
							case 18:
								for (; r.have < r.ncode;) {
									for (; l < 3;) {
										if (0 === o) break e;
										o--, u += n[s++] << l, l += 8;
									}
									r.lens[A[r.have++]] = 7 & u, u >>>= 3, l -= 3;
								}
								for (; r.have < 19;) r.lens[A[r.have++]] = 0;
								if (r.lencode = r.lendyn, r.lenbits = 7, S = { bits: r.lenbits }, x = T(0, r.lens, 0, 19, r.lencode, 0, r.work, S), r.lenbits = S.bits, x) {
									e.msg = "invalid code lengths set", r.mode = 30;
									break;
								}
								r.have = 0, r.mode = 19;
							case 19:
								for (; r.have < r.nlen + r.ndist;) {
									for (; g = (C = r.lencode[u & (1 << r.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l);) {
										if (0 === o) break e;
										o--, u += n[s++] << l, l += 8;
									}
									if (b < 16) u >>>= _, l -= _, r.lens[r.have++] = b;
									else {
										if (16 === b) {
											for (z = _ + 2; l < z;) {
												if (0 === o) break e;
												o--, u += n[s++] << l, l += 8;
											}
											if (u >>>= _, l -= _, 0 === r.have) {
												e.msg = "invalid bit length repeat", r.mode = 30;
												break;
											}
											k = r.lens[r.have - 1], d = 3 + (3 & u), u >>>= 2, l -= 2;
										} else if (17 === b) {
											for (z = _ + 3; l < z;) {
												if (0 === o) break e;
												o--, u += n[s++] << l, l += 8;
											}
											l -= _, k = 0, d = 3 + (7 & (u >>>= _)), u >>>= 3, l -= 3;
										} else {
											for (z = _ + 7; l < z;) {
												if (0 === o) break e;
												o--, u += n[s++] << l, l += 8;
											}
											l -= _, k = 0, d = 11 + (127 & (u >>>= _)), u >>>= 7, l -= 7;
										}
										if (r.have + d > r.nlen + r.ndist) {
											e.msg = "invalid bit length repeat", r.mode = 30;
											break;
										}
										for (; d--;) r.lens[r.have++] = k;
									}
								}
								if (30 === r.mode) break;
								if (0 === r.lens[256]) {
									e.msg = "invalid code -- missing end-of-block", r.mode = 30;
									break;
								}
								if (r.lenbits = 9, S = { bits: r.lenbits }, x = T(D, r.lens, 0, r.nlen, r.lencode, 0, r.work, S), r.lenbits = S.bits, x) {
									e.msg = "invalid literal/lengths set", r.mode = 30;
									break;
								}
								if (r.distbits = 6, r.distcode = r.distdyn, S = { bits: r.distbits }, x = T(F, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, S), r.distbits = S.bits, x) {
									e.msg = "invalid distances set", r.mode = 30;
									break;
								}
								if (r.mode = 20, 6 === t) break e;
							case 20: r.mode = 21;
							case 21:
								if (6 <= o && 258 <= h) {
									e.next_out = a, e.avail_out = h, e.next_in = s, e.avail_in = o, r.hold = u, r.bits = l, R(e, c), a = e.next_out, i = e.output, h = e.avail_out, s = e.next_in, n = e.input, o = e.avail_in, u = r.hold, l = r.bits, 12 === r.mode && (r.back = -1);
									break;
								}
								for (r.back = 0; g = (C = r.lencode[u & (1 << r.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l);) {
									if (0 === o) break e;
									o--, u += n[s++] << l, l += 8;
								}
								if (g && 0 == (240 & g)) {
									for (v = _, y = g, w = b; g = (C = r.lencode[w + ((u & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l);) {
										if (0 === o) break e;
										o--, u += n[s++] << l, l += 8;
									}
									u >>>= v, l -= v, r.back += v;
								}
								if (u >>>= _, l -= _, r.back += _, r.length = b, 0 === g) {
									r.mode = 26;
									break;
								}
								if (32 & g) {
									r.back = -1, r.mode = 12;
									break;
								}
								if (64 & g) {
									e.msg = "invalid literal/length code", r.mode = 30;
									break;
								}
								r.extra = 15 & g, r.mode = 22;
							case 22:
								if (r.extra) {
									for (z = r.extra; l < z;) {
										if (0 === o) break e;
										o--, u += n[s++] << l, l += 8;
									}
									r.length += u & (1 << r.extra) - 1, u >>>= r.extra, l -= r.extra, r.back += r.extra;
								}
								r.was = r.length, r.mode = 23;
							case 23:
								for (; g = (C = r.distcode[u & (1 << r.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l);) {
									if (0 === o) break e;
									o--, u += n[s++] << l, l += 8;
								}
								if (0 == (240 & g)) {
									for (v = _, y = g, w = b; g = (C = r.distcode[w + ((u & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l);) {
										if (0 === o) break e;
										o--, u += n[s++] << l, l += 8;
									}
									u >>>= v, l -= v, r.back += v;
								}
								if (u >>>= _, l -= _, r.back += _, 64 & g) {
									e.msg = "invalid distance code", r.mode = 30;
									break;
								}
								r.offset = b, r.extra = 15 & g, r.mode = 24;
							case 24:
								if (r.extra) {
									for (z = r.extra; l < z;) {
										if (0 === o) break e;
										o--, u += n[s++] << l, l += 8;
									}
									r.offset += u & (1 << r.extra) - 1, u >>>= r.extra, l -= r.extra, r.back += r.extra;
								}
								if (r.offset > r.dmax) {
									e.msg = "invalid distance too far back", r.mode = 30;
									break;
								}
								r.mode = 25;
							case 25:
								if (0 === h) break e;
								if (d = c - h, r.offset > d) {
									if ((d = r.offset - d) > r.whave && r.sane) {
										e.msg = "invalid distance too far back", r.mode = 30;
										break;
									}
									p = d > r.wnext ? (d -= r.wnext, r.wsize - d) : r.wnext - d, d > r.length && (d = r.length), m = r.window;
								} else m = i, p = a - r.offset, d = r.length;
								for (h < d && (d = h), h -= d, r.length -= d; i[a++] = m[p++], --d;);
								0 === r.length && (r.mode = 21);
								break;
							case 26:
								if (0 === h) break e;
								i[a++] = r.length, h--, r.mode = 21;
								break;
							case 27:
								if (r.wrap) {
									for (; l < 32;) {
										if (0 === o) break e;
										o--, u |= n[s++] << l, l += 8;
									}
									if (c -= h, e.total_out += c, r.total += c, c && (e.adler = r.check = r.flags ? B(r.check, i, c, a - c) : O(r.check, i, c, a - c)), c = h, (r.flags ? u : L(u)) !== r.check) {
										e.msg = "incorrect data check", r.mode = 30;
										break;
									}
									l = u = 0;
								}
								r.mode = 28;
							case 28:
								if (r.wrap && r.flags) {
									for (; l < 32;) {
										if (0 === o) break e;
										o--, u += n[s++] << l, l += 8;
									}
									if (u !== (4294967295 & r.total)) {
										e.msg = "incorrect length check", r.mode = 30;
										break;
									}
									l = u = 0;
								}
								r.mode = 29;
							case 29:
								x = 1;
								break e;
							case 30:
								x = -3;
								break e;
							case 31: return -4;
							case 32:
							default: return U;
						}
						return e.next_out = a, e.avail_out = h, e.next_in = s, e.avail_in = o, r.hold = u, r.bits = l, (r.wsize || c !== e.avail_out && r.mode < 30 && (r.mode < 27 || 4 !== t)) && Z(e, e.output, e.next_out, c - e.avail_out) ? (r.mode = 31, -4) : (f -= e.avail_in, c -= e.avail_out, e.total_in += f, e.total_out += c, r.total += c, r.wrap && c && (e.adler = r.check = r.flags ? B(r.check, i, c, e.next_out - c) : O(r.check, i, c, e.next_out - c)), e.data_type = r.bits + (r.last ? 64 : 0) + (12 === r.mode ? 128 : 0) + (20 === r.mode || 15 === r.mode ? 256 : 0), (0 == f && 0 === c || 4 === t) && x === N && (x = -5), x);
					}, r.inflateEnd = function(e) {
						if (!e || !e.state) return U;
						var t = e.state;
						return t.window && (t.window = null), e.state = null, N;
					}, r.inflateGetHeader = function(e, t) {
						var r;
						return e && e.state ? 0 == (2 & (r = e.state).wrap) ? U : ((r.head = t).done = !1, N) : U;
					}, r.inflateSetDictionary = function(e, t) {
						var r, n = t.length;
						return e && e.state ? 0 !== (r = e.state).wrap && 11 !== r.mode ? U : 11 === r.mode && O(1, t, n, 0) !== r.check ? -3 : Z(e, t, n, n) ? (r.mode = 31, -4) : (r.havedict = 1, N) : U;
					}, r.inflateInfo = "pako inflate (from Nodeca project)";
				}, {
					"../utils/common": 41,
					"./adler32": 43,
					"./crc32": 45,
					"./inffast": 48,
					"./inftrees": 50
				}],
				50: [function(e, t, r) {
					"use strict";
					var D = e("../utils/common"), F = [
						3,
						4,
						5,
						6,
						7,
						8,
						9,
						10,
						11,
						13,
						15,
						17,
						19,
						23,
						27,
						31,
						35,
						43,
						51,
						59,
						67,
						83,
						99,
						115,
						131,
						163,
						195,
						227,
						258,
						0,
						0
					], N = [
						16,
						16,
						16,
						16,
						16,
						16,
						16,
						16,
						17,
						17,
						17,
						17,
						18,
						18,
						18,
						18,
						19,
						19,
						19,
						19,
						20,
						20,
						20,
						20,
						21,
						21,
						21,
						21,
						16,
						72,
						78
					], U = [
						1,
						2,
						3,
						4,
						5,
						7,
						9,
						13,
						17,
						25,
						33,
						49,
						65,
						97,
						129,
						193,
						257,
						385,
						513,
						769,
						1025,
						1537,
						2049,
						3073,
						4097,
						6145,
						8193,
						12289,
						16385,
						24577,
						0,
						0
					], P = [
						16,
						16,
						16,
						16,
						17,
						17,
						18,
						18,
						19,
						19,
						20,
						20,
						21,
						21,
						22,
						22,
						23,
						23,
						24,
						24,
						25,
						25,
						26,
						26,
						27,
						27,
						28,
						28,
						29,
						29,
						64,
						64
					];
					t.exports = function(e, t, r, n, i, s, a, o) {
						var h, u, l, f, c, d, p, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R = null, T = 0;
						for (b = 0; b <= 15; b++) O[b] = 0;
						for (v = 0; v < n; v++) O[t[r + v]]++;
						for (k = g, w = 15; 1 <= w && 0 === O[w]; w--);
						if (w < k && (k = w), 0 === w) return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
						for (y = 1; y < w && 0 === O[y]; y++);
						for (k < y && (k = y), b = z = 1; b <= 15; b++) if (z <<= 1, (z -= O[b]) < 0) return -1;
						if (0 < z && (0 === e || 1 !== w)) return -1;
						for (B[1] = 0, b = 1; b < 15; b++) B[b + 1] = B[b] + O[b];
						for (v = 0; v < n; v++) 0 !== t[r + v] && (a[B[t[r + v]]++] = v);
						if (d = 0 === e ? (A = R = a, 19) : 1 === e ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, c = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === e && 852 < C || 2 === e && 592 < C) return 1;
						for (;;) {
							for (p = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; i[c + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u;);
							for (h = 1 << b - 1; E & h;) h >>= 1;
							if (0 !== h ? (E &= h - 1, E += h) : E = 0, v++, 0 == --O[b]) {
								if (b === w) break;
								b = t[r + a[v]];
							}
							if (k < b && (E & f) !== l) {
								for (0 === S && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0);) x++, z <<= 1;
								if (C += 1 << x, 1 === e && 852 < C || 2 === e && 592 < C) return 1;
								i[l = E & f] = k << 24 | x << 16 | c - s | 0;
							}
						}
						return 0 !== E && (i[c + E] = b - S << 24 | 4194304), o.bits = k, 0;
					};
				}, { "../utils/common": 41 }],
				51: [function(e, t, r) {
					"use strict";
					t.exports = {
						2: "need dictionary",
						1: "stream end",
						0: "",
						"-1": "file error",
						"-2": "stream error",
						"-3": "data error",
						"-4": "insufficient memory",
						"-5": "buffer error",
						"-6": "incompatible version"
					};
				}, {}],
				52: [function(e, t, r) {
					"use strict";
					var i = e("../utils/common"), o = 0, h = 1;
					function n(e) {
						for (var t = e.length; 0 <= --t;) e[t] = 0;
					}
					var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p = 7, m = 256, b = 16, v = 17, y = 18, w = [
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						1,
						1,
						1,
						1,
						2,
						2,
						2,
						2,
						3,
						3,
						3,
						3,
						4,
						4,
						4,
						4,
						5,
						5,
						5,
						5,
						0
					], k = [
						0,
						0,
						0,
						0,
						1,
						1,
						2,
						2,
						3,
						3,
						4,
						4,
						5,
						5,
						6,
						6,
						7,
						7,
						8,
						8,
						9,
						9,
						10,
						10,
						11,
						11,
						12,
						12,
						13,
						13
					], x = [
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						2,
						3,
						7
					], S = [
						16,
						17,
						18,
						0,
						8,
						7,
						9,
						6,
						10,
						5,
						11,
						4,
						12,
						3,
						13,
						2,
						14,
						1,
						15
					], z = new Array(2 * (l + 2));
					n(z);
					var C = new Array(2 * f);
					n(C);
					var E = new Array(512);
					n(E);
					var A = new Array(256);
					n(A);
					var I = new Array(a);
					n(I);
					var O, B, R, T = new Array(f);
					function D(e, t, r, n, i) {
						this.static_tree = e, this.extra_bits = t, this.extra_base = r, this.elems = n, this.max_length = i, this.has_stree = e && e.length;
					}
					function F(e, t) {
						this.dyn_tree = e, this.max_code = 0, this.stat_desc = t;
					}
					function N(e) {
						return e < 256 ? E[e] : E[256 + (e >>> 7)];
					}
					function U(e, t) {
						e.pending_buf[e.pending++] = 255 & t, e.pending_buf[e.pending++] = t >>> 8 & 255;
					}
					function P(e, t, r) {
						e.bi_valid > d - r ? (e.bi_buf |= t << e.bi_valid & 65535, U(e, e.bi_buf), e.bi_buf = t >> d - e.bi_valid, e.bi_valid += r - d) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += r);
					}
					function L(e, t, r) {
						P(e, r[2 * t], r[2 * t + 1]);
					}
					function j(e, t) {
						for (var r = 0; r |= 1 & e, e >>>= 1, r <<= 1, 0 < --t;);
						return r >>> 1;
					}
					function Z(e, t, r) {
						var n, i, s = new Array(g + 1), a = 0;
						for (n = 1; n <= g; n++) s[n] = a = a + r[n - 1] << 1;
						for (i = 0; i <= t; i++) {
							var o = e[2 * i + 1];
							0 !== o && (e[2 * i] = j(s[o]++, o));
						}
					}
					function W(e) {
						var t;
						for (t = 0; t < l; t++) e.dyn_ltree[2 * t] = 0;
						for (t = 0; t < f; t++) e.dyn_dtree[2 * t] = 0;
						for (t = 0; t < c; t++) e.bl_tree[2 * t] = 0;
						e.dyn_ltree[2 * m] = 1, e.opt_len = e.static_len = 0, e.last_lit = e.matches = 0;
					}
					function M(e) {
						8 < e.bi_valid ? U(e, e.bi_buf) : 0 < e.bi_valid && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
					}
					function H(e, t, r, n) {
						var i = 2 * t, s = 2 * r;
						return e[i] < e[s] || e[i] === e[s] && n[t] <= n[r];
					}
					function G(e, t, r) {
						for (var n = e.heap[r], i = r << 1; i <= e.heap_len && (i < e.heap_len && H(t, e.heap[i + 1], e.heap[i], e.depth) && i++, !H(t, n, e.heap[i], e.depth));) e.heap[r] = e.heap[i], r = i, i <<= 1;
						e.heap[r] = n;
					}
					function K(e, t, r) {
						var n, i, s, a, o = 0;
						if (0 !== e.last_lit) for (; n = e.pending_buf[e.d_buf + 2 * o] << 8 | e.pending_buf[e.d_buf + 2 * o + 1], i = e.pending_buf[e.l_buf + o], o++, 0 === n ? L(e, i, t) : (L(e, (s = A[i]) + u + 1, t), 0 !== (a = w[s]) && P(e, i -= I[s], a), L(e, s = N(--n), r), 0 !== (a = k[s]) && P(e, n -= T[s], a)), o < e.last_lit;);
						L(e, m, t);
					}
					function Y(e, t) {
						var r, n, i, s = t.dyn_tree, a = t.stat_desc.static_tree, o = t.stat_desc.has_stree, h = t.stat_desc.elems, u = -1;
						for (e.heap_len = 0, e.heap_max = _, r = 0; r < h; r++) 0 !== s[2 * r] ? (e.heap[++e.heap_len] = u = r, e.depth[r] = 0) : s[2 * r + 1] = 0;
						for (; e.heap_len < 2;) s[2 * (i = e.heap[++e.heap_len] = u < 2 ? ++u : 0)] = 1, e.depth[i] = 0, e.opt_len--, o && (e.static_len -= a[2 * i + 1]);
						for (t.max_code = u, r = e.heap_len >> 1; 1 <= r; r--) G(e, s, r);
						for (i = h; r = e.heap[1], e.heap[1] = e.heap[e.heap_len--], G(e, s, 1), n = e.heap[1], e.heap[--e.heap_max] = r, e.heap[--e.heap_max] = n, s[2 * i] = s[2 * r] + s[2 * n], e.depth[i] = (e.depth[r] >= e.depth[n] ? e.depth[r] : e.depth[n]) + 1, s[2 * r + 1] = s[2 * n + 1] = i, e.heap[1] = i++, G(e, s, 1), 2 <= e.heap_len;);
						e.heap[--e.heap_max] = e.heap[1], function(e, t) {
							var r, n, i, s, a, o, h = t.dyn_tree, u = t.max_code, l = t.stat_desc.static_tree, f = t.stat_desc.has_stree, c = t.stat_desc.extra_bits, d = t.stat_desc.extra_base, p = t.stat_desc.max_length, m = 0;
							for (s = 0; s <= g; s++) e.bl_count[s] = 0;
							for (h[2 * e.heap[e.heap_max] + 1] = 0, r = e.heap_max + 1; r < _; r++) p < (s = h[2 * h[2 * (n = e.heap[r]) + 1] + 1] + 1) && (s = p, m++), h[2 * n + 1] = s, u < n || (e.bl_count[s]++, a = 0, d <= n && (a = c[n - d]), o = h[2 * n], e.opt_len += o * (s + a), f && (e.static_len += o * (l[2 * n + 1] + a)));
							if (0 !== m) {
								do {
									for (s = p - 1; 0 === e.bl_count[s];) s--;
									e.bl_count[s]--, e.bl_count[s + 1] += 2, e.bl_count[p]--, m -= 2;
								} while (0 < m);
								for (s = p; 0 !== s; s--) for (n = e.bl_count[s]; 0 !== n;) u < (i = e.heap[--r]) || (h[2 * i + 1] !== s && (e.opt_len += (s - h[2 * i + 1]) * h[2 * i], h[2 * i + 1] = s), n--);
							}
						}(e, t), Z(s, u, e.bl_count);
					}
					function X(e, t, r) {
						var n, i, s = -1, a = t[1], o = 0, h = 7, u = 4;
						for (0 === a && (h = 138, u = 3), t[2 * (r + 1) + 1] = 65535, n = 0; n <= r; n++) i = a, a = t[2 * (n + 1) + 1], ++o < h && i === a || (o < u ? e.bl_tree[2 * i] += o : 0 !== i ? (i !== s && e.bl_tree[2 * i]++, e.bl_tree[2 * b]++) : o <= 10 ? e.bl_tree[2 * v]++ : e.bl_tree[2 * y]++, s = i, u = (o = 0) === a ? (h = 138, 3) : i === a ? (h = 6, 3) : (h = 7, 4));
					}
					function V(e, t, r) {
						var n, i, s = -1, a = t[1], o = 0, h = 7, u = 4;
						for (0 === a && (h = 138, u = 3), n = 0; n <= r; n++) if (i = a, a = t[2 * (n + 1) + 1], !(++o < h && i === a)) {
							if (o < u) for (; L(e, i, e.bl_tree), 0 != --o;);
							else 0 !== i ? (i !== s && (L(e, i, e.bl_tree), o--), L(e, b, e.bl_tree), P(e, o - 3, 2)) : o <= 10 ? (L(e, v, e.bl_tree), P(e, o - 3, 3)) : (L(e, y, e.bl_tree), P(e, o - 11, 7));
							s = i, u = (o = 0) === a ? (h = 138, 3) : i === a ? (h = 6, 3) : (h = 7, 4);
						}
					}
					n(T);
					var q = !1;
					function J(e, t, r, n) {
						P(e, (s << 1) + (n ? 1 : 0), 3), function(e, t, r, n) {
							M(e), n && (U(e, r), U(e, ~r)), i.arraySet(e.pending_buf, e.window, t, r, e.pending), e.pending += r;
						}(e, t, r, !0);
					}
					r._tr_init = function(e) {
						q || (function() {
							var e, t, r, n, i, s = new Array(g + 1);
							for (n = r = 0; n < a - 1; n++) for (I[n] = r, e = 0; e < 1 << w[n]; e++) A[r++] = n;
							for (A[r - 1] = n, n = i = 0; n < 16; n++) for (T[n] = i, e = 0; e < 1 << k[n]; e++) E[i++] = n;
							for (i >>= 7; n < f; n++) for (T[n] = i << 7, e = 0; e < 1 << k[n] - 7; e++) E[256 + i++] = n;
							for (t = 0; t <= g; t++) s[t] = 0;
							for (e = 0; e <= 143;) z[2 * e + 1] = 8, e++, s[8]++;
							for (; e <= 255;) z[2 * e + 1] = 9, e++, s[9]++;
							for (; e <= 279;) z[2 * e + 1] = 7, e++, s[7]++;
							for (; e <= 287;) z[2 * e + 1] = 8, e++, s[8]++;
							for (Z(z, l + 1, s), e = 0; e < f; e++) C[2 * e + 1] = 5, C[2 * e] = j(e, 5);
							O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, c, p);
						}(), q = !0), e.l_desc = new F(e.dyn_ltree, O), e.d_desc = new F(e.dyn_dtree, B), e.bl_desc = new F(e.bl_tree, R), e.bi_buf = 0, e.bi_valid = 0, W(e);
					}, r._tr_stored_block = J, r._tr_flush_block = function(e, t, r, n) {
						var i, s, a = 0;
						0 < e.level ? (2 === e.strm.data_type && (e.strm.data_type = function(e) {
							var t, r = 4093624447;
							for (t = 0; t <= 31; t++, r >>>= 1) if (1 & r && 0 !== e.dyn_ltree[2 * t]) return o;
							if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26]) return h;
							for (t = 32; t < u; t++) if (0 !== e.dyn_ltree[2 * t]) return h;
							return o;
						}(e)), Y(e, e.l_desc), Y(e, e.d_desc), a = function(e) {
							var t;
							for (X(e, e.dyn_ltree, e.l_desc.max_code), X(e, e.dyn_dtree, e.d_desc.max_code), Y(e, e.bl_desc), t = c - 1; 3 <= t && 0 === e.bl_tree[2 * S[t] + 1]; t--);
							return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
						}(e), i = e.opt_len + 3 + 7 >>> 3, (s = e.static_len + 3 + 7 >>> 3) <= i && (i = s)) : i = s = r + 5, r + 4 <= i && -1 !== t ? J(e, t, r, n) : 4 === e.strategy || s === i ? (P(e, 2 + (n ? 1 : 0), 3), K(e, z, C)) : (P(e, 4 + (n ? 1 : 0), 3), function(e, t, r, n) {
							var i;
							for (P(e, t - 257, 5), P(e, r - 1, 5), P(e, n - 4, 4), i = 0; i < n; i++) P(e, e.bl_tree[2 * S[i] + 1], 3);
							V(e, e.dyn_ltree, t - 1), V(e, e.dyn_dtree, r - 1);
						}(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, a + 1), K(e, e.dyn_ltree, e.dyn_dtree)), W(e), n && M(e);
					}, r._tr_tally = function(e, t, r) {
						return e.pending_buf[e.d_buf + 2 * e.last_lit] = t >>> 8 & 255, e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t, e.pending_buf[e.l_buf + e.last_lit] = 255 & r, e.last_lit++, 0 === t ? e.dyn_ltree[2 * r]++ : (e.matches++, t--, e.dyn_ltree[2 * (A[r] + u + 1)]++, e.dyn_dtree[2 * N(t)]++), e.last_lit === e.lit_bufsize - 1;
					}, r._tr_align = function(e) {
						P(e, 2, 3), L(e, m, z), function(e) {
							16 === e.bi_valid ? (U(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : 8 <= e.bi_valid && (e.pending_buf[e.pending++] = 255 & e.bi_buf, e.bi_buf >>= 8, e.bi_valid -= 8);
						}(e);
					};
				}, { "../utils/common": 41 }],
				53: [function(e, t, r) {
					"use strict";
					t.exports = function() {
						this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
					};
				}, {}],
				54: [function(e, t, r) {
					(function(e) {
						(function(r, n) {
							"use strict";
							if (!r.setImmediate) {
								var i, s, t, a, o = 1, h = {}, u = !1, l = r.document, e = Object.getPrototypeOf && Object.getPrototypeOf(r);
								e = e && e.setTimeout ? e : r, i = "[object process]" === {}.toString.call(r.process) ? function(e) {
									process.nextTick(function() {
										c(e);
									});
								} : function() {
									if (r.postMessage && !r.importScripts) {
										var e = !0, t = r.onmessage;
										return r.onmessage = function() {
											e = !1;
										}, r.postMessage("", "*"), r.onmessage = t, e;
									}
								}() ? (a = "setImmediate$" + Math.random() + "$", r.addEventListener ? r.addEventListener("message", d, !1) : r.attachEvent("onmessage", d), function(e) {
									r.postMessage(a + e, "*");
								}) : r.MessageChannel ? ((t = new MessageChannel()).port1.onmessage = function(e) {
									c(e.data);
								}, function(e) {
									t.port2.postMessage(e);
								}) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function(e) {
									var t = l.createElement("script");
									t.onreadystatechange = function() {
										c(e), t.onreadystatechange = null, s.removeChild(t), t = null;
									}, s.appendChild(t);
								}) : function(e) {
									setTimeout(c, 0, e);
								}, e.setImmediate = function(e) {
									"function" != typeof e && (e = new Function("" + e));
									for (var t = new Array(arguments.length - 1), r = 0; r < t.length; r++) t[r] = arguments[r + 1];
									return h[o] = {
										callback: e,
										args: t
									}, i(o), o++;
								}, e.clearImmediate = f;
							}
							function f(e) {
								delete h[e];
							}
							function c(e) {
								if (u) setTimeout(c, 0, e);
								else {
									var t = h[e];
									if (t) {
										u = !0;
										try {
											(function(e) {
												var t = e.callback, r = e.args;
												switch (r.length) {
													case 0:
														t();
														break;
													case 1:
														t(r[0]);
														break;
													case 2:
														t(r[0], r[1]);
														break;
													case 3:
														t(r[0], r[1], r[2]);
														break;
													default: t.apply(n, r);
												}
											})(t);
										} finally {
											f(e), u = !1;
										}
									}
								}
							}
							function d(e) {
								e.source === r && "string" == typeof e.data && 0 === e.data.indexOf(a) && c(+e.data.slice(a.length));
							}
						})("undefined" == typeof self ? void 0 === e ? this : e : self);
					}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
				}, {}]
			}, {}, [10])(10);
		});
	})))());
	function extend(destination) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (source.hasOwnProperty(key)) destination[key] = source[key];
		}
		return destination;
	}
	function repeat(character, count) {
		return Array(count + 1).join(character);
	}
	function trimLeadingNewlines(string) {
		return string.replace(/^\n*/, "");
	}
	function trimTrailingNewlines(string) {
		var indexEnd = string.length;
		while (indexEnd > 0 && string[indexEnd - 1] === "\n") indexEnd--;
		return string.substring(0, indexEnd);
	}
	function trimNewlines(string) {
		return trimTrailingNewlines(trimLeadingNewlines(string));
	}
	var blockElements = [
		"ADDRESS",
		"ARTICLE",
		"ASIDE",
		"AUDIO",
		"BLOCKQUOTE",
		"BODY",
		"CANVAS",
		"CENTER",
		"DD",
		"DIR",
		"DIV",
		"DL",
		"DT",
		"FIELDSET",
		"FIGCAPTION",
		"FIGURE",
		"FOOTER",
		"FORM",
		"FRAMESET",
		"H1",
		"H2",
		"H3",
		"H4",
		"H5",
		"H6",
		"HEADER",
		"HGROUP",
		"HR",
		"HTML",
		"ISINDEX",
		"LI",
		"MAIN",
		"MENU",
		"NAV",
		"NOFRAMES",
		"NOSCRIPT",
		"OL",
		"OUTPUT",
		"P",
		"PRE",
		"SECTION",
		"TABLE",
		"TBODY",
		"TD",
		"TFOOT",
		"TH",
		"THEAD",
		"TR",
		"UL"
	];
	function isBlock(node) {
		return is(node, blockElements);
	}
	var voidElements = [
		"AREA",
		"BASE",
		"BR",
		"COL",
		"COMMAND",
		"EMBED",
		"HR",
		"IMG",
		"INPUT",
		"KEYGEN",
		"LINK",
		"META",
		"PARAM",
		"SOURCE",
		"TRACK",
		"WBR"
	];
	function isVoid(node) {
		return is(node, voidElements);
	}
	function hasVoid(node) {
		return has(node, voidElements);
	}
	var meaningfulWhenBlankElements = [
		"A",
		"TABLE",
		"THEAD",
		"TBODY",
		"TFOOT",
		"TH",
		"TD",
		"IFRAME",
		"SCRIPT",
		"AUDIO",
		"VIDEO"
	];
	function isMeaningfulWhenBlank(node) {
		return is(node, meaningfulWhenBlankElements);
	}
	function hasMeaningfulWhenBlank(node) {
		return has(node, meaningfulWhenBlankElements);
	}
	function is(node, tagNames) {
		return tagNames.indexOf(node.nodeName) >= 0;
	}
	function has(node, tagNames) {
		return node.getElementsByTagName && tagNames.some(function(tagName) {
			return node.getElementsByTagName(tagName).length;
		});
	}
	var rules = {};
	rules.paragraph = {
		filter: "p",
		replacement: function(content) {
			return "\n\n" + content + "\n\n";
		}
	};
	rules.lineBreak = {
		filter: "br",
		replacement: function(content, node, options) {
			return options.br + "\n";
		}
	};
	rules.heading = {
		filter: [
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6"
		],
		replacement: function(content, node, options) {
			var hLevel = Number(node.nodeName.charAt(1));
			if (options.headingStyle === "setext" && hLevel < 3) {
				var underline = repeat(hLevel === 1 ? "=" : "-", content.length);
				return "\n\n" + content + "\n" + underline + "\n\n";
			} else return "\n\n" + repeat("#", hLevel) + " " + content + "\n\n";
		}
	};
	rules.blockquote = {
		filter: "blockquote",
		replacement: function(content) {
			content = trimNewlines(content).replace(/^/gm, "> ");
			return "\n\n" + content + "\n\n";
		}
	};
	rules.list = {
		filter: ["ul", "ol"],
		replacement: function(content, node) {
			var parent = node.parentNode;
			if (parent.nodeName === "LI" && parent.lastElementChild === node) return "\n" + content;
			else return "\n\n" + content + "\n\n";
		}
	};
	rules.listItem = {
		filter: "li",
		replacement: function(content, node, options) {
			var prefix = options.bulletListMarker + "   ";
			var parent = node.parentNode;
			if (parent.nodeName === "OL") {
				var start = parent.getAttribute("start");
				var index = Array.prototype.indexOf.call(parent.children, node);
				prefix = (start ? Number(start) + index : index + 1) + ".  ";
			}
			var isParagraph = /\n$/.test(content);
			content = trimNewlines(content) + (isParagraph ? "\n" : "");
			content = content.replace(/\n/gm, "\n" + " ".repeat(prefix.length));
			return prefix + content + (node.nextSibling ? "\n" : "");
		}
	};
	rules.indentedCodeBlock = {
		filter: function(node, options) {
			return options.codeBlockStyle === "indented" && node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE";
		},
		replacement: function(content, node, options) {
			return "\n\n    " + node.firstChild.textContent.replace(/\n/g, "\n    ") + "\n\n";
		}
	};
	rules.fencedCodeBlock = {
		filter: function(node, options) {
			return options.codeBlockStyle === "fenced" && node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE";
		},
		replacement: function(content, node, options) {
			var language = ((node.firstChild.getAttribute("class") || "").match(/language-(\S+)/) || [null, ""])[1];
			var code = node.firstChild.textContent;
			var fenceChar = options.fence.charAt(0);
			var fenceSize = 3;
			var fenceInCodeRegex = new RegExp("^" + fenceChar + "{3,}", "gm");
			var match;
			while (match = fenceInCodeRegex.exec(code)) if (match[0].length >= fenceSize) fenceSize = match[0].length + 1;
			var fence = repeat(fenceChar, fenceSize);
			return "\n\n" + fence + language + "\n" + code.replace(/\n$/, "") + "\n" + fence + "\n\n";
		}
	};
	rules.horizontalRule = {
		filter: "hr",
		replacement: function(content, node, options) {
			return "\n\n" + options.hr + "\n\n";
		}
	};
	rules.inlineLink = {
		filter: function(node, options) {
			return options.linkStyle === "inlined" && node.nodeName === "A" && node.getAttribute("href");
		},
		replacement: function(content, node) {
			var href = node.getAttribute("href");
			if (href) href = href.replace(/([()])/g, "\\$1");
			var title = cleanAttribute(node.getAttribute("title"));
			if (title) title = " \"" + title.replace(/"/g, "\\\"") + "\"";
			return "[" + content + "](" + href + title + ")";
		}
	};
	rules.referenceLink = {
		filter: function(node, options) {
			return options.linkStyle === "referenced" && node.nodeName === "A" && node.getAttribute("href");
		},
		replacement: function(content, node, options) {
			var href = node.getAttribute("href");
			var title = cleanAttribute(node.getAttribute("title"));
			if (title) title = " \"" + title + "\"";
			var replacement;
			var reference;
			switch (options.linkReferenceStyle) {
				case "collapsed":
					replacement = "[" + content + "][]";
					reference = "[" + content + "]: " + href + title;
					break;
				case "shortcut":
					replacement = "[" + content + "]";
					reference = "[" + content + "]: " + href + title;
					break;
				default:
					var id = this.references.length + 1;
					replacement = "[" + content + "][" + id + "]";
					reference = "[" + id + "]: " + href + title;
			}
			this.references.push(reference);
			return replacement;
		},
		references: [],
		append: function(options) {
			var references = "";
			if (this.references.length) {
				references = "\n\n" + this.references.join("\n") + "\n\n";
				this.references = [];
			}
			return references;
		}
	};
	rules.emphasis = {
		filter: ["em", "i"],
		replacement: function(content, node, options) {
			if (!content.trim()) return "";
			return options.emDelimiter + content + options.emDelimiter;
		}
	};
	rules.strong = {
		filter: ["strong", "b"],
		replacement: function(content, node, options) {
			if (!content.trim()) return "";
			return options.strongDelimiter + content + options.strongDelimiter;
		}
	};
	rules.code = {
		filter: function(node) {
			var hasSiblings = node.previousSibling || node.nextSibling;
			var isCodeBlock = node.parentNode.nodeName === "PRE" && !hasSiblings;
			return node.nodeName === "CODE" && !isCodeBlock;
		},
		replacement: function(content) {
			if (!content) return "";
			content = content.replace(/\r?\n|\r/g, " ");
			var extraSpace = /^`|^ .*?[^ ].* $|`$/.test(content) ? " " : "";
			var delimiter = "`";
			var matches = content.match(/`+/gm) || [];
			while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + "`";
			return delimiter + extraSpace + content + extraSpace + delimiter;
		}
	};
	rules.image = {
		filter: "img",
		replacement: function(content, node) {
			var alt = cleanAttribute(node.getAttribute("alt"));
			var src = node.getAttribute("src") || "";
			var title = cleanAttribute(node.getAttribute("title"));
			var titlePart = title ? " \"" + title + "\"" : "";
			return src ? "![" + alt + "](" + src + titlePart + ")" : "";
		}
	};
	function cleanAttribute(attribute) {
		return attribute ? attribute.replace(/(\n+\s*)+/g, "\n") : "";
	}
	/**
	* Manages a collection of rules used to convert HTML to Markdown
	*/
	function Rules(options) {
		this.options = options;
		this._keep = [];
		this._remove = [];
		this.blankRule = { replacement: options.blankReplacement };
		this.keepReplacement = options.keepReplacement;
		this.defaultRule = { replacement: options.defaultReplacement };
		this.array = [];
		for (var key in options.rules) this.array.push(options.rules[key]);
	}
	Rules.prototype = {
		add: function(key, rule) {
			this.array.unshift(rule);
		},
		keep: function(filter) {
			this._keep.unshift({
				filter,
				replacement: this.keepReplacement
			});
		},
		remove: function(filter) {
			this._remove.unshift({
				filter,
				replacement: function() {
					return "";
				}
			});
		},
		forNode: function(node) {
			if (node.isBlank) return this.blankRule;
			var rule;
			if (rule = findRule(this.array, node, this.options)) return rule;
			if (rule = findRule(this._keep, node, this.options)) return rule;
			if (rule = findRule(this._remove, node, this.options)) return rule;
			return this.defaultRule;
		},
		forEach: function(fn) {
			for (var i = 0; i < this.array.length; i++) fn(this.array[i], i);
		}
	};
	function findRule(rules, node, options) {
		for (var i = 0; i < rules.length; i++) {
			var rule = rules[i];
			if (filterValue(rule, node, options)) return rule;
		}
	}
	function filterValue(rule, node, options) {
		var filter = rule.filter;
		if (typeof filter === "string") {
			if (filter === node.nodeName.toLowerCase()) return true;
		} else if (Array.isArray(filter)) {
			if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true;
		} else if (typeof filter === "function") {
			if (filter.call(rule, node, options)) return true;
		} else throw new TypeError("`filter` needs to be a string, array, or function");
	}
	/**
	* The collapseWhitespace function is adapted from collapse-whitespace
	* by Luc Thevenard.
	*
	* The MIT License (MIT)
	*
	* Copyright (c) 2014 Luc Thevenard <lucthevenard@gmail.com>
	*
	* Permission is hereby granted, free of charge, to any person obtaining a copy
	* of this software and associated documentation files (the "Software"), to deal
	* in the Software without restriction, including without limitation the rights
	* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	* copies of the Software, and to permit persons to whom the Software is
	* furnished to do so, subject to the following conditions:
	*
	* The above copyright notice and this permission notice shall be included in
	* all copies or substantial portions of the Software.
	*
	* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	* THE SOFTWARE.
	*/
	/**
	* collapseWhitespace(options) removes extraneous whitespace from an the given element.
	*
	* @param {Object} options
	*/
	function collapseWhitespace(options) {
		var element = options.element;
		var isBlock = options.isBlock;
		var isVoid = options.isVoid;
		var isPre = options.isPre || function(node) {
			return node.nodeName === "PRE";
		};
		if (!element.firstChild || isPre(element)) return;
		var prevText = null;
		var keepLeadingWs = false;
		var prev = null;
		var node = next(prev, element, isPre);
		while (node !== element) {
			if (node.nodeType === 3 || node.nodeType === 4) {
				var text = node.data.replace(/[ \r\n\t]+/g, " ");
				if ((!prevText || / $/.test(prevText.data)) && !keepLeadingWs && text[0] === " ") text = text.substr(1);
				if (!text) {
					node = remove(node);
					continue;
				}
				node.data = text;
				prevText = node;
			} else if (node.nodeType === 1) {
				if (isBlock(node) || node.nodeName === "BR") {
					if (prevText) prevText.data = prevText.data.replace(/ $/, "");
					prevText = null;
					keepLeadingWs = false;
				} else if (isVoid(node) || isPre(node)) {
					prevText = null;
					keepLeadingWs = true;
				} else if (prevText) keepLeadingWs = false;
			} else {
				node = remove(node);
				continue;
			}
			var nextNode = next(prev, node, isPre);
			prev = node;
			node = nextNode;
		}
		if (prevText) {
			prevText.data = prevText.data.replace(/ $/, "");
			if (!prevText.data) remove(prevText);
		}
	}
	/**
	* remove(node) removes the given node from the DOM and returns the
	* next node in the sequence.
	*
	* @param {Node} node
	* @return {Node} node
	*/
	function remove(node) {
		var next = node.nextSibling || node.parentNode;
		node.parentNode.removeChild(node);
		return next;
	}
	/**
	* next(prev, current, isPre) returns the next node in the sequence, given the
	* current and previous nodes.
	*
	* @param {Node} prev
	* @param {Node} current
	* @param {Function} isPre
	* @return {Node}
	*/
	function next(prev, current, isPre) {
		if (prev && prev.parentNode === current || isPre(current)) return current.nextSibling || current.parentNode;
		return current.firstChild || current.nextSibling || current.parentNode;
	}
	var root = typeof window !== "undefined" ? window : {};
	function canParseHTMLNatively() {
		var Parser = root.DOMParser;
		var canParse = false;
		try {
			if (new Parser().parseFromString("", "text/html")) canParse = true;
		} catch (e) {}
		return canParse;
	}
	function createHTMLParser() {
		var Parser = function() {};
		if (shouldUseActiveX()) Parser.prototype.parseFromString = function(string) {
			var doc = new window.ActiveXObject("htmlfile");
			doc.designMode = "on";
			doc.open();
			doc.write(string);
			doc.close();
			return doc;
		};
		else Parser.prototype.parseFromString = function(string) {
			var doc = document.implementation.createHTMLDocument("");
			doc.open();
			doc.write(string);
			doc.close();
			return doc;
		};
		return Parser;
	}
	function shouldUseActiveX() {
		var useActiveX = false;
		try {
			document.implementation.createHTMLDocument("").open();
		} catch (e) {
			if (root.ActiveXObject) useActiveX = true;
		}
		return useActiveX;
	}
	var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();
	function RootNode(input, options) {
		var root;
		if (typeof input === "string") root = htmlParser().parseFromString("<x-turndown id=\"turndown-root\">" + input + "</x-turndown>", "text/html").getElementById("turndown-root");
		else root = input.cloneNode(true);
		collapseWhitespace({
			element: root,
			isBlock,
			isVoid,
			isPre: options.preformattedCode ? isPreOrCode : null
		});
		return root;
	}
	var _htmlParser;
	function htmlParser() {
		_htmlParser = _htmlParser || new HTMLParser();
		return _htmlParser;
	}
	function isPreOrCode(node) {
		return node.nodeName === "PRE" || node.nodeName === "CODE";
	}
	function Node(node, options) {
		node.isBlock = isBlock(node);
		node.isCode = node.nodeName === "CODE" || node.parentNode.isCode;
		node.isBlank = isBlank(node);
		node.flankingWhitespace = flankingWhitespace(node, options);
		return node;
	}
	function isBlank(node) {
		return !isVoid(node) && !isMeaningfulWhenBlank(node) && /^\s*$/i.test(node.textContent) && !hasVoid(node) && !hasMeaningfulWhenBlank(node);
	}
	function flankingWhitespace(node, options) {
		if (node.isBlock || options.preformattedCode && node.isCode) return {
			leading: "",
			trailing: ""
		};
		var edges = edgeWhitespace(node.textContent);
		if (edges.leadingAscii && isFlankedByWhitespace("left", node, options)) edges.leading = edges.leadingNonAscii;
		if (edges.trailingAscii && isFlankedByWhitespace("right", node, options)) edges.trailing = edges.trailingNonAscii;
		return {
			leading: edges.leading,
			trailing: edges.trailing
		};
	}
	function edgeWhitespace(string) {
		var m = string.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
		return {
			leading: m[1],
			leadingAscii: m[2],
			leadingNonAscii: m[3],
			trailing: m[4],
			trailingNonAscii: m[5],
			trailingAscii: m[6]
		};
	}
	function isFlankedByWhitespace(side, node, options) {
		var sibling;
		var regExp;
		var isFlanked;
		if (side === "left") {
			sibling = node.previousSibling;
			regExp = / $/;
		} else {
			sibling = node.nextSibling;
			regExp = /^ /;
		}
		if (sibling) {
			if (sibling.nodeType === 3) isFlanked = regExp.test(sibling.nodeValue);
			else if (options.preformattedCode && sibling.nodeName === "CODE") isFlanked = false;
			else if (sibling.nodeType === 1 && !isBlock(sibling)) isFlanked = regExp.test(sibling.textContent);
		}
		return isFlanked;
	}
	var reduce = Array.prototype.reduce;
	var escapes = [
		[/\\/g, "\\\\"],
		[/\*/g, "\\*"],
		[/^-/g, "\\-"],
		[/^\+ /g, "\\+ "],
		[/^(=+)/g, "\\$1"],
		[/^(#{1,6}) /g, "\\$1 "],
		[/`/g, "\\`"],
		[/^~~~/g, "\\~~~"],
		[/\[/g, "\\["],
		[/\]/g, "\\]"],
		[/^>/g, "\\>"],
		[/_/g, "\\_"],
		[/^(\d+)\. /g, "$1\\. "]
	];
	function TurndownService(options) {
		if (!(this instanceof TurndownService)) return new TurndownService(options);
		var defaults = {
			rules,
			headingStyle: "setext",
			hr: "* * *",
			bulletListMarker: "*",
			codeBlockStyle: "indented",
			fence: "```",
			emDelimiter: "_",
			strongDelimiter: "**",
			linkStyle: "inlined",
			linkReferenceStyle: "full",
			br: "  ",
			preformattedCode: false,
			blankReplacement: function(content, node) {
				return node.isBlock ? "\n\n" : "";
			},
			keepReplacement: function(content, node) {
				return node.isBlock ? "\n\n" + node.outerHTML + "\n\n" : node.outerHTML;
			},
			defaultReplacement: function(content, node) {
				return node.isBlock ? "\n\n" + content + "\n\n" : content;
			}
		};
		this.options = extend({}, defaults, options);
		this.rules = new Rules(this.options);
	}
	TurndownService.prototype = {
		/**
		* The entry point for converting a string or DOM node to Markdown
		* @public
		* @param {String|HTMLElement} input The string or DOM node to convert
		* @returns A Markdown representation of the input
		* @type String
		*/
		turndown: function(input) {
			if (!canConvert(input)) throw new TypeError(input + " is not a string, or an element/document/fragment node.");
			if (input === "") return "";
			var output = process$1.call(this, new RootNode(input, this.options));
			return postProcess.call(this, output);
		},
		/**
		* Add one or more plugins
		* @public
		* @param {Function|Array} plugin The plugin or array of plugins to add
		* @returns The Turndown instance for chaining
		* @type Object
		*/
		use: function(plugin) {
			if (Array.isArray(plugin)) for (var i = 0; i < plugin.length; i++) this.use(plugin[i]);
			else if (typeof plugin === "function") plugin(this);
			else throw new TypeError("plugin must be a Function or an Array of Functions");
			return this;
		},
		/**
		* Adds a rule
		* @public
		* @param {String} key The unique key of the rule
		* @param {Object} rule The rule
		* @returns The Turndown instance for chaining
		* @type Object
		*/
		addRule: function(key, rule) {
			this.rules.add(key, rule);
			return this;
		},
		/**
		* Keep a node (as HTML) that matches the filter
		* @public
		* @param {String|Array|Function} filter The unique key of the rule
		* @returns The Turndown instance for chaining
		* @type Object
		*/
		keep: function(filter) {
			this.rules.keep(filter);
			return this;
		},
		/**
		* Remove a node that matches the filter
		* @public
		* @param {String|Array|Function} filter The unique key of the rule
		* @returns The Turndown instance for chaining
		* @type Object
		*/
		remove: function(filter) {
			this.rules.remove(filter);
			return this;
		},
		/**
		* Escapes Markdown syntax
		* @public
		* @param {String} string The string to escape
		* @returns A string with Markdown syntax escaped
		* @type String
		*/
		escape: function(string) {
			return escapes.reduce(function(accumulator, escape) {
				return accumulator.replace(escape[0], escape[1]);
			}, string);
		}
	};
	/**
	* Reduces a DOM node down to its Markdown string equivalent
	* @private
	* @param {HTMLElement} parentNode The node to convert
	* @returns A Markdown representation of the node
	* @type String
	*/
	function process$1(parentNode) {
		var self = this;
		return reduce.call(parentNode.childNodes, function(output, node) {
			node = new Node(node, self.options);
			var replacement = "";
			if (node.nodeType === 3) replacement = node.isCode ? node.nodeValue : self.escape(node.nodeValue);
			else if (node.nodeType === 1) replacement = replacementForNode.call(self, node);
			return join(output, replacement);
		}, "");
	}
	/**
	* Appends strings as each rule requires and trims the output
	* @private
	* @param {String} output The conversion output
	* @returns A trimmed version of the ouput
	* @type String
	*/
	function postProcess(output) {
		var self = this;
		this.rules.forEach(function(rule) {
			if (typeof rule.append === "function") output = join(output, rule.append(self.options));
		});
		return output.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "");
	}
	/**
	* Converts an element node to its Markdown equivalent
	* @private
	* @param {HTMLElement} node The node to convert
	* @returns A Markdown representation of the node
	* @type String
	*/
	function replacementForNode(node) {
		var rule = this.rules.forNode(node);
		var content = process$1.call(this, node);
		var whitespace = node.flankingWhitespace;
		if (whitespace.leading || whitespace.trailing) content = content.trim();
		return whitespace.leading + rule.replacement(content, node, this.options) + whitespace.trailing;
	}
	/**
	* Joins replacement to the current output with appropriate number of new lines
	* @private
	* @param {String} output The current conversion output
	* @param {String} replacement The string to append to the output
	* @returns Joined output
	* @type String
	*/
	function join(output, replacement) {
		var s1 = trimTrailingNewlines(output);
		var s2 = trimLeadingNewlines(replacement);
		var nls = Math.max(output.length - s1.length, replacement.length - s2.length);
		return s1 + "\n\n".substring(0, nls) + s2;
	}
	/**
	* Determines whether an input can be converted
	* @private
	* @param {String|HTMLElement} input Describe this parameter
	* @returns Describe what it returns
	* @type String|Object|Array|Boolean|Number
	*/
	function canConvert(input) {
		return input != null && (typeof input === "string" || input.nodeType && (input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11));
	}
	//#endregion
	//#region src/features/marathon-export.js
	var FORBIDDEN_PATH_CHARS = /[\\/:*?"<>|]/g;
	function sanitizePathName(name, fallback = "untitled") {
		return String(name || "").replace(FORBIDDEN_PATH_CHARS, "").replace(/\s+/g, " ").trim().replace(/\.+$/, "") || fallback;
	}
	function uniquePathName(baseName, usedNames, fallback = "untitled") {
		let candidate = sanitizePathName(baseName, fallback);
		if (!usedNames.has(candidate)) {
			usedNames.add(candidate);
			return candidate;
		}
		let counter = 2;
		while (usedNames.has(`${candidate} (${counter})`)) counter += 1;
		candidate = `${candidate} (${counter})`;
		usedNames.add(candidate);
		return candidate;
	}
	function createMarkdownTurndownService() {
		const service = new TurndownService({
			headingStyle: "atx",
			bulletListMarker: "-",
			codeBlockStyle: "fenced",
			emDelimiter: "*",
			strongDelimiter: "**",
			br: "\n"
		});
		service.addRule("stripInlineStyles", {
			filter: ["span", "font"],
			replacement: (content) => content
		});
		service.addRule("hideExerciseIds", {
			filter: (node) => node.nodeName === "EM" && node.classList?.contains("hide-id-exercise-item"),
			replacement: () => ""
		});
		return service;
	}
	function preprocessHtml(html) {
		if (!html) return "";
		return String(html).replace(/<br\s+style="[^"]*"\s*\/?>/gi, "<br>").replace(/&nbsp;/gi, " ").replace(/\u00A0/g, " ").replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>");
	}
	function postprocessMarkdown(markdown) {
		return markdown.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
	}
	function htmlToMarkdown(html, turndown, log) {
		const preprocessed = preprocessHtml(html);
		if (!preprocessed.trim()) return "";
		try {
			return postprocessMarkdown(turndown.turndown(preprocessed));
		} catch (error) {
			log("HTML conversion failed, falling back to plain text:", error);
			return preprocessed.replace(/<[^>]+>/g, "").trim();
		}
	}
	function extensionFromUrl(url) {
		try {
			const ext = new URL(url).pathname.split(".").pop()?.toLowerCase();
			if (ext && /^[a-z0-9]{2,5}$/.test(ext)) return ext;
		} catch (_) {}
		return "jpg";
	}
	async function localizeImage(url, imageId, imagesFolder, urlMap, log) {
		if (!url) return null;
		if (urlMap.has(url)) return urlMap.get(url);
		const filename = `${imageId || "img"}_${crypto.randomUUID().slice(0, 8)}.${extensionFromUrl(url)}`;
		const relativePath = `./images/${filename}`;
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const blob = await response.blob();
			imagesFolder.file(filename, blob);
			urlMap.set(url, relativePath);
			return relativePath;
		} catch (error) {
			log(`Image fetch failed for ${url}:`, error.message);
			urlMap.set(url, url);
			return url;
		}
	}
	async function renderImageMarkdown(imageEntry, imagesFolder, urlMap, log) {
		const url = imageEntry.UrlFull || imageEntry.Url;
		if (!url) return "";
		return `![Illustration](${await localizeImage(url, imageEntry.ImageId || imageEntry.ImageFullId, imagesFolder, urlMap, log)})`;
	}
	async function processDescriptionsAndImages(item, ctx) {
		const parts = [];
		const descriptions = item.Descriptions || [];
		const images = item.Images || [];
		const slotCount = Math.max(descriptions.length, images.length);
		for (let index = 0; index < slotCount; index += 1) {
			const description = descriptions[index];
			if (description && description.trim()) parts.push(ctx.htmlToMarkdown(description));
			if (images[index]) parts.push(await renderImageMarkdown(images[index], ctx.imagesFolder, ctx.urlMap, ctx.log));
		}
		return parts.filter(Boolean).join("\n\n");
	}
	function appendRichTextBlocks(blocks, item, htmlToMarkdownFn) {
		for (const block of blocks || []) {
			if (block.Question) item.push(htmlToMarkdownFn(block.Question));
			if (block.Text) item.push(htmlToMarkdownFn(block.Text));
		}
	}
	async function processItemToMarkdown(item, ctx) {
		const sections = [];
		if (item.Name && String(item.Name).trim()) sections.push(`### ${ctx.htmlToMarkdown(item.Name)}`);
		switch (item.Type) {
			case 27:
			case 2:
				sections.push(await processDescriptionsAndImages(item, ctx));
				break;
			case 29:
				if (item.Button?.Link) {
					const linkText = (item.Button.Text ? ctx.htmlToMarkdown(item.Button.Text) : item.Button.Link).replace(/\n+/g, " ").trim() || "Open link";
					sections.push(`[${linkText}](${item.Button.Link})`);
				}
				break;
			case 10:
			case 13:
				appendRichTextBlocks(item.QuestionWithCodingTexts, sections, ctx.htmlToMarkdown);
				break;
			case 3:
				for (const video of item.Videos || []) {
					if (!video.Link) continue;
					const linkText = (video.Text ? ctx.htmlToMarkdown(video.Text) : "Watch video").replace(/\n+/g, " ").trim() || "Watch video";
					sections.push(`[${linkText}](${video.Link})`);
				}
				break;
			default:
				appendRichTextBlocks(item.QuestionWithCodingTexts, sections, ctx.htmlToMarkdown);
				for (const description of item.Descriptions || []) if (description && description.trim()) sections.push(ctx.htmlToMarkdown(description));
				if (item.Button?.Link) {
					const linkText = (item.Button.Text ? ctx.htmlToMarkdown(item.Button.Text) : item.Button.Link).replace(/\n+/g, " ").trim() || "Open link";
					sections.push(`[${linkText}](${item.Button.Link})`);
				}
				for (const video of item.Videos || []) if (video.Link) sections.push(`[${video.Text || "Watch video"}](${video.Link})`);
				for (const image of item.Images || []) sections.push(await renderImageMarkdown(image, ctx.imagesFolder, ctx.urlMap, ctx.log));
				if (item.Text) sections.push(ctx.htmlToMarkdown(item.Text));
				if (sections.length === 0) ctx.log(`Unhandled item Type ${item.Type} (Id: ${item.Id})`);
				break;
		}
		for (const pdf of item.Pdfs || []) {
			const pdfUrl = pdf.Url || pdf.Link;
			if (pdfUrl) sections.push(`[${pdf.Name || pdf.Text || "PDF document"}](${pdfUrl})`);
		}
		return sections.filter(Boolean).join("\n\n");
	}
	function triggerBlobDownload(blob, filename) {
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
	async function compileMarathonToZip(backupData, options = {}) {
		const log = options.log || (() => {});
		if (!backupData || !Array.isArray(backupData.lessons)) throw new Error("Invalid backup data: expected an object with a lessons array.");
		log("Starting marathon workspace compilation...");
		const zip = new import_jszip_min.default();
		const turndown = createMarkdownTurndownService();
		const archiveRootName = `marathon_${backupData.marathonId || "export"}`;
		const rootFolder = zip.folder(archiveRootName);
		const backupJsonName = `edvibe_marathon_${backupData.marathonId || "export"}_backup.json`;
		rootFolder.file(backupJsonName, JSON.stringify(backupData, null, 2));
		const usedLessonNames = /* @__PURE__ */ new Set();
		const totalLessons = backupData.lessons.length;
		for (const [lessonIndex, lesson] of backupData.lessons.entries()) {
			options.onProgress?.({
				message: `Processing lesson ${lessonIndex + 1} of ${totalLessons}: ${lesson.name}`,
				current: lessonIndex + 1,
				total: totalLessons
			});
			const lessonFolderName = uniquePathName(lesson.name, usedLessonNames, `lesson_${lesson.lessonId}`);
			const lessonFolder = rootFolder.folder(lessonFolderName);
			const imagesFolder = lessonFolder.folder("images");
			const usedSectionNames = /* @__PURE__ */ new Set();
			const ctx = {
				turndown,
				imagesFolder,
				urlMap: /* @__PURE__ */ new Map(),
				log,
				htmlToMarkdown: (html) => htmlToMarkdown(html, turndown, log)
			};
			if (lesson.imageUrl) await localizeImage(lesson.imageUrl, `lesson_${lesson.lessonId}`, imagesFolder, ctx.urlMap, log);
			for (const [sectionIndex, section] of (lesson.sections || []).entries()) {
				const sectionFileName = `${uniquePathName(`${sectionIndex + 1} - ${section.name}`, usedSectionNames, `section_${section.sectionId}`)}.md`;
				const markdownParts = [`# ${section.name}`];
				if (section.isHomework) markdownParts.push("> Homework section");
				markdownParts.push("");
				for (const item of section.items || []) {
					if (item.IsHideExercise) continue;
					const block = await processItemToMarkdown(item, ctx);
					if (!block) continue;
					markdownParts.push(block);
					markdownParts.push("---");
				}
				while (markdownParts.length && markdownParts[markdownParts.length - 1] === "---") markdownParts.pop();
				if (markdownParts.length <= 2) markdownParts.push("_No content in this section._");
				lessonFolder.file(sectionFileName, `${markdownParts.join("\n\n").trim()}\n`);
			}
		}
		rootFolder.file("_export_meta.json", JSON.stringify({
			exportedAt: backupData.exportedAt,
			marathonId: backupData.marathonId,
			totalLessons: backupData.totalLessons,
			compiledAt: (/* @__PURE__ */ new Date()).toISOString()
		}, null, 2));
		options.onProgress?.({ message: "Compressing archive..." });
		const zipBlob = await zip.generateAsync({
			type: "blob",
			compression: "DEFLATE",
			compressionOptions: { level: 6 }
		});
		const downloadName = `edvibe_marathon_${backupData.marathonId || "export"}_workspace.zip`;
		triggerBlobDownload(zipBlob, downloadName);
		log("Marathon workspace archive downloaded:", downloadName);
		return zipBlob;
	}
	function parseMarathonId$5(url) {
		const match = String(url || "").match(/marathon\/(\d+)/);
		return match ? Number(match[1]) : null;
	}
	function createExportProgressOverlay() {
		document.querySelector(EXPORT_PROGRESS_TAG)?.remove();
		const dialog = document.createElement(EXPORT_PROGRESS_TAG);
		(document.body || document.documentElement).appendChild(dialog);
		return dialog;
	}
	function createMarathonExportFeature({ sendRequest, wait, canStart, onActiveChange, compileToZip = compileMarathonToZip, notifyStatus, createProgressOverlay = createExportProgressOverlay, getCurrentUrl = () => window.location.href, now = () => (/* @__PURE__ */ new Date()).toISOString(), log = () => {} }) {
		async function start() {
			if (!canStart()) {
				const message = "Cannot start export while another operation is active.";
				log(message);
				notifyStatus("error", message);
				return;
			}
			onActiveChange(true);
			let progressOverlay = null;
			try {
				notifyStatus("started");
				log("Starting marathon export...");
				progressOverlay = createProgressOverlay();
				progressOverlay.update({
					statusText: "Finding marathon lessons...",
					loadedSections: 0,
					totalSections: 0
				});
				const marathonId = parseMarathonId$5(getCurrentUrl());
				if (!marathonId) {
					progressOverlay.error("Failed to find a valid MarathonId in the current page URL.");
					notifyStatus("error", "Invalid marathon URL.");
					return;
				}
				const backupBundle = {
					exportedAt: now(),
					marathonId,
					totalLessons: 0,
					lessons: []
				};
				const marathonLessons = (await sendRequest("MarathonLessonWsController", "GetMarathonLessonsPagination", "Marathons", {
					MarathonId: marathonId,
					SearchTerm: "",
					Page: {
						Skip: 0,
						Take: 100
					}
				})).Value?.Items || [];
				backupBundle.totalLessons = marathonLessons.length;
				progressOverlay.update({
					statusText: `Found ${marathonLessons.length} lessons. Loading lesson sections...`,
					loadedSections: 0,
					totalSections: 0
				});
				const lessonQueue = [];
				let totalSections = 0;
				for (const [lessonIndex, lessonNode] of marathonLessons.entries()) {
					progressOverlay.update({
						statusText: `Loading sections for lesson ${lessonIndex + 1} of ${marathonLessons.length}: ${lessonNode.Name}`,
						loadedSections: 0,
						totalSections: 0
					});
					const lessonStructure = await sendRequest("LessonWsController", "GetLessonWithId", "Books", { LessonId: lessonNode.LessonId });
					const sections = [...lessonStructure.Value?.Sections || []];
					if (lessonStructure.Value?.HomeworkSection) sections.push(lessonStructure.Value.HomeworkSection);
					totalSections += sections.length;
					lessonQueue.push({
						lessonNode,
						lessonStructure,
						sections
					});
				}
				progressOverlay.update({
					statusText: `Found ${totalSections} sections. Loading exercise assets...`,
					loadedSections: 0,
					totalSections
				});
				let loadedSections = 0;
				for (const { lessonNode, lessonStructure, sections } of lessonQueue) {
					const lessonEntry = {
						lessonId: lessonNode.LessonId,
						marathonLessonId: lessonNode.MarathonLessonId,
						name: lessonNode.Name,
						imageUrl: lessonStructure.Value?.ImageUrl || lessonNode.Image,
						sections: []
					};
					for (const section of sections) {
						progressOverlay.update({
							statusText: `Lesson: ${lessonNode.Name}\nSection: ${section.Name}`,
							loadedSections,
							totalSections
						});
						await wait(300);
						const exerciseResponse = await sendRequest("GetExerciseWsController", "LoadExercises", "Exercises", {
							IsTeacher: true,
							SectionId: section.Id,
							LessonId: lessonNode.LessonId,
							LessonSection: 0
						});
						const parsedValue = typeof exerciseResponse.Value === "string" ? JSON.parse(exerciseResponse.Value) : exerciseResponse.Value;
						lessonEntry.sections.push({
							sectionId: section.Id,
							name: section.Name,
							isHomework: section.IsHomework || false,
							items: parsedValue?.Items || []
						});
						loadedSections += 1;
						progressOverlay.update({
							statusText: `Loaded "${section.Name}" from "${lessonNode.Name}".`,
							loadedSections,
							totalSections
						});
					}
					backupBundle.lessons.push(lessonEntry);
				}
				progressOverlay.update({
					statusText: "All sections loaded.\nProcessing lesson content and archiving workspace...\nDownloading images — this may take a few minutes.",
					loadedSections: 0,
					totalSections: 0
				});
				await compileToZip(backupBundle, { onProgress({ message, current, total }) {
					const isCompressing = message === "Compressing archive...";
					progressOverlay.update({
						statusText: isCompressing ? "Processing lesson content and archiving workspace...\nCompressing archive..." : `Processing lesson content and archiving workspace...\n${message}`,
						loadedSections: isCompressing ? 0 : current || 0,
						totalSections: isCompressing ? 0 : total || 0,
						countText: isCompressing ? "Compressing archive..." : total ? `${current} / ${total} lessons processed` : "Preparing archive..."
					});
				} });
				progressOverlay.complete("ZIP workspace archive downloaded successfully.", totalSections);
				progressOverlay.dismissAfter(3e3);
				notifyStatus("complete");
			} catch (error) {
				log("Export workflow failed:", error);
				progressOverlay?.error(`Export failed: ${error.message}`);
				notifyStatus("error", error.message);
			} finally {
				onActiveChange(false);
			}
		}
		return { start };
	}
	//#endregion
	//#region src/features/reset-lessons.js
	var RESET_DIALOG_TAG = "edvibe-toolbox-reset-dialog";
	var RESET_OVERLAY_ID = "edvibe-toolbox-reset-overlay";
	function parseMarathonId$4(url) {
		const match = String(url || "").match(/marathon\/(\d+)/);
		return match ? Number(match[1]) : null;
	}
	function collectLessonSections(lessonValue) {
		const sections = Array.isArray(lessonValue?.Sections) ? lessonValue.Sections.filter(Boolean) : [];
		if (lessonValue?.HomeworkSection) sections.push(lessonValue.HomeworkSection);
		return sections;
	}
	function shouldDeleteLastRequest(lesson) {
		const status = lesson?.LastRequest?.Status;
		return Boolean(lesson?.LastRequest?.Id && Number.isFinite(status) && status !== 0);
	}
	function buildLoadExercisesPayload({ marathonId, pupilId, marathonLessonId, sectionId }) {
		return {
			MarathonId: marathonId,
			LessonId: marathonLessonId,
			SectionId: sectionId,
			PupilId: pupilId,
			IsTeacher: true,
			LessonSection: 0,
			Domain: "edvibe.com"
		};
	}
	function buildResetAnswerPayload({ marathonId, pupilId, lessonId, exercise }) {
		return {
			SelfSync: false,
			IsReset: true,
			ExerciseId: exercise.id,
			ExerciseType: exercise.type,
			SectionId: exercise.sectionId,
			PupilId: pupilId,
			MarathonId: marathonId,
			SingleAnswer: {},
			ManyAnswers: [],
			RepeatingManyAnswers: [],
			AnswerErrorsCount: [[]],
			StatisticsInfo: {
				CountAnswersTrue: 0,
				CountAnswersFalse: 0,
				CountAnswersPending: 0
			},
			LessonId: lessonId
		};
	}
	function createPupilPager(sendRequest, marathonId, pageSize = 50) {
		let pupils = [];
		let total = null;
		let inFlight = null;
		function snapshot() {
			return {
				pupils: [...pupils],
				total,
				hasMore: total === null || pupils.length < total
			};
		}
		async function requestNextPage() {
			if (total !== null && pupils.length >= total) return snapshot();
			const response = await sendRequest("MarathonPupilsWsController", "GetMarathonPupils", "Marathons", {
				MarathonId: marathonId,
				Skip: pupils.length,
				Take: pageSize
			});
			const items = response.Value?.Items;
			const nextTotal = response.Value?.Page?.Count;
			if (!Array.isArray(items) || typeof nextTotal !== "number" || !Number.isInteger(nextTotal) || nextTotal < 0) throw new Error("GetMarathonPupils returned an invalid response.");
			if (items.length === 0 && pupils.length < nextTotal) throw new Error("GetMarathonPupils pagination stopped before all pupils were loaded.");
			pupils = pupils.concat(items);
			total = nextTotal;
			return snapshot();
		}
		return {
			loadNext() {
				if (inFlight) return inFlight;
				inFlight = requestNextPage().finally(() => {
					inFlight = null;
				});
				return inFlight;
			},
			getSnapshot: snapshot
		};
	}
	async function discoverResetWork({ sendRequest, wait, marathonId, pupilId, lessons, onDiscovery = () => {}, log = () => {} }) {
		const work = [];
		for (const lesson of lessons) {
			log(`Discovering lesson ${lesson.MarathonLessonId} (LessonId: ${lesson.LessonId}).`);
			onDiscovery(`Loading sections for "${lesson.Name}"...`);
			const sections = collectLessonSections((await sendRequest("LessonWsController", "GetLessonWithId", "Books", { LessonId: lesson.LessonId })).Value);
			const exercises = [];
			log(`Lesson ${lesson.MarathonLessonId}: ${sections.length} section(s) found.`);
			for (const section of sections) {
				await wait(300);
				const items = (await sendRequest("GetExerciseWsController", "LoadExercises", "Exercises", buildLoadExercisesPayload({
					marathonId,
					pupilId,
					marathonLessonId: lesson.MarathonLessonId,
					sectionId: section.Id
				}))).Value?.Items;
				if (!Array.isArray(items)) throw new Error(`LoadExercises returned invalid data for "${lesson.Name}".`);
				const resettableItems = items.filter((item) => Number.isFinite(item.Id) && Array.isArray(item.AnswerVersion1) && item.AnswerVersion1.length > 0);
				exercises.push(...resettableItems.map((item) => ({
					id: item.Id,
					type: item.Type,
					sectionId: section.Id
				})));
				log(`Lesson ${lesson.MarathonLessonId}, section ${section.Id}: ${resettableItems.length} of ${items.length} exercise(s) have saved answers.`);
			}
			work.push({
				lesson,
				exercises,
				deleteRequestId: shouldDeleteLastRequest(lesson) ? lesson.LastRequest.Id : null
			});
			log(`Lesson ${lesson.MarathonLessonId}: ${exercises.length} exercise reset(s), ${shouldDeleteLastRequest(lesson) ? "request deletion required" : "no request deletion"}.`);
		}
		return work;
	}
	async function executeResetWork({ sendRequest, sendWithoutResponse, wait, marathonId, pupilId, work, onProgress, log = () => {} }) {
		const total = work.reduce((sum, item) => sum + item.exercises.length, 0);
		let completed = 0;
		log(`Starting ${total} operation(s) for PupilId ${pupilId} across ${work.length} lesson(s).`);
		for (const item of work) {
			for (const exercise of item.exercises) {
				try {
					log(`Resetting exercise ${exercise.id} for lesson ${item.lesson.MarathonLessonId} (${completed + 1}/${total}).`);
					await wait(300);
					await sendRequest("ExerciseAnswerSaveVersion1WsController", "SaveAnswer", "ExerciseAnswer", buildResetAnswerPayload({
						marathonId,
						pupilId,
						lessonId: item.lesson.LessonId,
						exercise
					}));
					if ((await sendRequest("MarathonStatisticService", "DropMarathonExerciseStatistic", "Statistic", {
						MarathondId: marathonId,
						PupilId: pupilId,
						ExerciseId: exercise.id
					})).Value !== true) throw new Error("server did not confirm the reset");
				} catch (error) {
					throw new Error(`Failed in "${item.lesson.Name}", exercise ${exercise.id}: ${error.message}`);
				}
				completed += 1;
				onProgress({
					completed,
					total,
					lesson: item.lesson,
					exerciseId: exercise.id
				});
			}
			if (item.deleteRequestId) sendWithoutResponse("MarathonLessonWsController", "DeleteMarathonLessonRequestPupil", "Marathons", { RequestId: item.deleteRequestId });
		}
		log(`Completed all ${total} operation(s) for PupilId ${pupilId}.`);
	}
	function getErrorType(error) {
		return typeof error?.name === "string" ? error.name : "Error";
	}
	function createResetLessonsFeature({ sendRequest, sendWithoutResponse, wait, canStart, onActiveChange, createDialog = () => document.createElement(RESET_DIALOG_TAG), log = () => {} }) {
		let running = false;
		let active = false;
		function releaseOperation() {
			if (!active) return;
			active = false;
			onActiveChange(false);
		}
		async function open() {
			if (document.getElementById(RESET_OVERLAY_ID)) return;
			if (!canStart()) {
				window.alert("Another Edvibe Toolbox operation is already running.");
				return;
			}
			const marathonId = parseMarathonId$4(window.location.href);
			if (!marathonId) {
				window.alert("Open an Edvibe marathon page before resetting lessons.");
				return;
			}
			active = true;
			onActiveChange(true);
			const dialog = createDialog();
			dialog.addEventListener("edvibe-dialog-close", releaseOperation);
			dialog.addEventListener("edvibe-reset-request", async (event) => {
				const { pupil, lessons } = event.detail;
				if (!window.confirm(`Reset ${lessons.length} lesson(s) for ${pupil.Email}?`)) return;
				running = true;
				dialog.lock();
				let completed = false;
				try {
					dialog.showDiscovery("Discovering exercises...");
					const work = await discoverResetWork({
						sendRequest,
						wait,
						marathonId,
						pupilId: pupil.PupilId,
						lessons,
						onDiscovery: (message) => dialog.showDiscovery(message),
						log
					});
					await executeResetWork({
						sendRequest,
						sendWithoutResponse,
						wait,
						marathonId,
						pupilId: pupil.PupilId,
						work,
						onProgress: (progress) => dialog.showProgress(progress),
						log
					});
					dialog.showComplete("Selected lesson progress was reset successfully.");
					completed = true;
				} catch (error) {
					const lessonIds = lessons.map((lesson) => lesson.MarathonLessonId).join(", ");
					log(`Reset stopped for PupilId ${pupil.PupilId}; MarathonLessonIds: ${lessonIds} (${getErrorType(error)}).`);
					dialog.showError(error.message);
				} finally {
					running = false;
					if (completed) dialog.completeRun();
					else dialog.unlockAfterRun();
				}
			});
			try {
				const pupilPager = createPupilPager(sendRequest, marathonId);
				dialog.configure({
					loadNextPupils: () => pupilPager.loadNext(),
					loadLessons: async (pupil) => {
						log(`Loading lessons for PupilId ${pupil.PupilId}.`);
						const response = await sendRequest("MarathonLessonWsController", "GetMarathonLessonsForPupil", "Marathons", {
							PupilId: pupil.PupilId,
							MarathonId: marathonId,
							SearchTerm: "",
							Domain: "edvibe.com"
						});
						if (!Array.isArray(response.Value)) throw new Error("GetMarathonLessonsForPupil returned invalid data.");
						log(`Loaded ${response.Value.length} lesson(s) for PupilId ${pupil.PupilId}.`);
						return response.Value;
					},
					log
				});
				(document.body || document.documentElement).appendChild(dialog);
				dialog.setLoading("Loading marathon pupils...");
				const initialPage = await pupilPager.loadNext();
				log(`Loaded ${initialPage.pupils.length} of ${initialPage.total} pupil(s) for MarathonId ${marathonId}.`);
				dialog.showPupils({
					pupils: initialPage.pupils,
					total: initialPage.total
				});
			} catch (error) {
				log(`Failed to initialize reset workflow for MarathonId ${marathonId} (${getErrorType(error)}).`);
				if (typeof dialog.showError === "function") dialog.showError(error.message);
				else {
					releaseOperation();
					throw error;
				}
			}
		}
		return {
			open,
			isRunning: () => running
		};
	}
	//#endregion
	//#region src/features/action-recorder.js
	var DEFAULT_LIMITS = Object.freeze({
		maxFrames: 1e3,
		maxStoredBytes: 5 * 1024 * 1024,
		maxDurationMs: 600 * 1e3
	});
	var REDACTED_VALUE = "[REDACTED_BY_TOOLBOX]";
	var SENSITIVE_KEYS = /* @__PURE__ */ new Set([
		"authorization",
		"accesstoken",
		"refreshtoken",
		"token",
		"cookie",
		"password",
		"secret"
	]);
	function parseJson(value) {
		if (typeof value !== "string") return {
			parsed: false,
			value
		};
		try {
			return {
				parsed: true,
				value: JSON.parse(value)
			};
		} catch (_) {
			return {
				parsed: false,
				value
			};
		}
	}
	function redactValue(value, path = "", redactions = []) {
		if (Array.isArray(value)) return value.map((item, index) => redactValue(item, `${path}[${index}]`, redactions));
		if (!value || typeof value !== "object") return value;
		const redacted = {};
		for (const [key, entry] of Object.entries(value)) {
			const entryPath = path ? `${path}.${key}` : key;
			if (SENSITIVE_KEYS.has(key.toLowerCase())) {
				redacted[key] = REDACTED_VALUE;
				redactions.push(entryPath);
			} else redacted[key] = redactValue(entry, entryPath, redactions);
		}
		return redacted;
	}
	function parseEnvelope(rawText, redactions) {
		const outer = parseJson(rawText);
		if (!outer.parsed || !outer.value || typeof outer.value !== "object") return {
			parsed: false,
			value: rawText
		};
		const envelope = { ...outer.value };
		const nested = parseJson(envelope.Value);
		if (nested.parsed) envelope.Value = nested.value;
		return {
			parsed: true,
			value: redactValue(envelope, "", redactions)
		};
	}
	function pickExtra(envelope, knownKeys) {
		const extra = {};
		for (const [key, value] of Object.entries(envelope)) if (!knownKeys.has(key)) extra[key] = value;
		return Object.keys(extra).length > 0 ? extra : void 0;
	}
	function operationKey(socketId, requestId) {
		return `${socketId}:${String(requestId)}`;
	}
	function safePageContext(locationObject) {
		const pathname = String(locationObject?.pathname || "");
		const marathonMatch = pathname.match(/\/marathon\/(\d+)(?:\/|$)/);
		return {
			origin: String(locationObject?.origin || ""),
			pathname,
			marathonId: marathonMatch ? Number(marathonMatch[1]) : null
		};
	}
	function sanitizeIsoForFilename(isoDate) {
		return isoDate.replace(/[:.]/g, "-");
	}
	function makeRequestSnippet(operation) {
		const serializedValue = JSON.stringify(operation.requestValue === void 0 ? null : operation.requestValue, null, 4);
		return [
			"await sendRequest(",
			`    ${JSON.stringify(operation.controller || "")},`,
			`    ${JSON.stringify(operation.method || "")},`,
			`    ${JSON.stringify(operation.projectName || "")},`,
			serializedValue.split("\n").map((line) => `    ${line}`).join("\n"),
			");"
		].join("\n");
	}
	function makeRecipe(operations) {
		const pageOperations = operations.filter((operation) => operation.origin === "page");
		const lines = [
			"// Recorded from Edvibe UI. Review IDs, ordering, and mutation effects before use.",
			"// This code is intentionally not executable by the recorder.",
			""
		];
		pageOperations.forEach((operation, index) => {
			if (index > 0) {
				const previous = pageOperations[index - 1];
				const gap = operation.startedAfterMs - previous.startedAfterMs;
				if (gap >= 250) lines.push(`await wait(${Math.round(gap)});`, "");
			}
			lines.push(makeRequestSnippet(operation), "");
		});
		return lines.join("\n").trimEnd();
	}
	function createBrowserDownload(filename, text) {
		const blob = new Blob([text], { type: "application/json;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
	}
	function createActionRecorderFeature({ subscribeFrames, createPanel, getPageContext = () => safePageContext(window.location), downloadText = createBrowserDownload, copyText = (text) => navigator.clipboard.writeText(text), createId = () => crypto.randomUUID(), now = Date.now, setTimeoutFn = setTimeout, clearTimeoutFn = clearTimeout, limits = DEFAULT_LIMITS, log = () => {} }) {
		if (typeof subscribeFrames !== "function") throw new Error("Action recorder requires a frame subscription.");
		if (typeof createPanel !== "function") throw new Error("Action recorder requires a panel factory.");
		const configuredLimits = {
			...DEFAULT_LIMITS,
			...limits
		};
		let status = "idle";
		let session = null;
		let pendingOperations = /* @__PURE__ */ new Map();
		let durationTimer = null;
		let panel = null;
		let copyFallback = "";
		let notice = "";
		function getState() {
			return {
				status,
				session,
				copyFallback,
				notice,
				limits: configuredLimits
			};
		}
		function render() {
			panel?.setState?.(getState());
		}
		function finish(nextStatus, reason = "") {
			if (status !== "recording") return;
			clearTimeoutFn(durationTimer);
			durationTimer = null;
			status = nextStatus;
			session.stoppedAt = new Date(now()).toISOString();
			if (reason) {
				session.limits.limitReached = true;
				session.limits.reason = reason;
				notice = `Recording stopped: ${reason}.`;
			}
			render();
		}
		function start() {
			if (status === "recording") return;
			const startedAtMs = now();
			status = "recording";
			copyFallback = "";
			notice = "";
			pendingOperations = /* @__PURE__ */ new Map();
			session = {
				schemaVersion: 1,
				sessionId: createId(),
				startedAt: new Date(startedAtMs).toISOString(),
				stoppedAt: null,
				page: getPageContext(),
				limits: {
					maxFrames: configuredLimits.maxFrames,
					maxStoredBytes: configuredLimits.maxStoredBytes,
					maxDurationMs: configuredLimits.maxDurationMs,
					limitReached: false
				},
				frameCount: 0,
				storedBytes: 0,
				operations: [],
				otherFrames: [],
				anomalies: [],
				redactions: [],
				_startedAtMs: startedAtMs
			};
			durationTimer = setTimeoutFn(() => {
				finish("limit-reached", "duration limit reached");
			}, configuredLimits.maxDurationMs);
			render();
		}
		function stop() {
			finish("stopped");
		}
		function clear() {
			if (status === "recording") {
				clearTimeoutFn(durationTimer);
				durationTimer = null;
			}
			status = "idle";
			session = null;
			pendingOperations = /* @__PURE__ */ new Map();
			copyFallback = "";
			notice = "";
			render();
		}
		function limitReason(frame) {
			if (session.frameCount + 1 > configuredLimits.maxFrames) return "frame limit reached";
			if (session.storedBytes + (frame.dataType === "text" ? Number(frame.byteLength || 0) : 0) > configuredLimits.maxStoredBytes) return "size limit reached";
			return "";
		}
		function storeOtherFrame(frame, envelope, rawText) {
			const otherFrame = {
				sequence: session.frameCount,
				direction: frame.direction,
				socketId: frame.socketId,
				origin: frame.origin,
				capturedAfterMs: frame.capturedAt - session._startedAtMs,
				dataType: frame.dataType,
				byteLength: frame.byteLength
			};
			if (envelope !== void 0) otherFrame.envelope = envelope;
			if (rawText !== void 0) otherFrame.rawText = rawText;
			session.otherFrames.push(otherFrame);
		}
		function storeOutbound(frame, envelope) {
			const requestId = envelope.RequestId;
			if (!(requestId !== void 0 && (envelope.Controller !== void 0 || envelope.Method !== void 0 || envelope.ProjectName !== void 0))) {
				storeOtherFrame(frame, envelope);
				return;
			}
			const key = operationKey(frame.socketId, requestId);
			if (pendingOperations.has(key)) {
				session.anomalies.push({
					type: "duplicate-outbound-request",
					socketId: frame.socketId,
					requestId
				});
				storeOtherFrame(frame, envelope);
				return;
			}
			const operation = {
				sequence: session.operations.length + 1,
				socketId: frame.socketId,
				origin: frame.origin,
				requestId,
				startedAfterMs: frame.capturedAt - session._startedAtMs,
				durationMs: null,
				controller: envelope.Controller || "",
				method: envelope.Method || "",
				projectName: envelope.ProjectName || "",
				requestValue: envelope.Value,
				response: null,
				extra: pickExtra(envelope, /* @__PURE__ */ new Set([
					"Controller",
					"Method",
					"ProjectName",
					"RequestId",
					"Value"
				])),
				_capturedAt: frame.capturedAt
			};
			session.operations.push(operation);
			pendingOperations.set(key, operation);
		}
		function storeInbound(frame, envelope) {
			const requestId = envelope.RequestId;
			const key = requestId === void 0 ? "" : operationKey(frame.socketId, requestId);
			const operation = pendingOperations.get(key);
			if (!operation) {
				storeOtherFrame(frame, envelope);
				return;
			}
			operation.durationMs = Math.max(0, frame.capturedAt - operation._capturedAt);
			operation.response = {
				isSuccess: typeof envelope.IsSuccess === "boolean" ? envelope.IsSuccess : null,
				errorCode: envelope.ErrorCode ?? null,
				value: envelope.Value,
				extra: pickExtra(envelope, /* @__PURE__ */ new Set([
					"RequestId",
					"IsSuccess",
					"ErrorCode",
					"Value"
				]))
			};
			pendingOperations.delete(key);
		}
		function handleFrame(frame) {
			if (status !== "recording" || !session) return;
			const reason = limitReason(frame);
			if (reason) {
				finish("limit-reached", reason);
				return;
			}
			session.frameCount += 1;
			if (frame.dataType === "text") session.storedBytes += Number(frame.byteLength || 0);
			if (frame.dataType !== "text") {
				storeOtherFrame(frame);
				render();
				return;
			}
			const frameRedactions = [];
			const parsed = parseEnvelope(frame.data, frameRedactions);
			session.redactions.push(...frameRedactions.map((path) => ({
				frame: session.frameCount,
				path
			})));
			if (!parsed.parsed) storeOtherFrame(frame, void 0, parsed.value);
			else if (frame.direction === "outbound") storeOutbound(frame, parsed.value);
			else storeInbound(frame, parsed.value);
			render();
		}
		function buildExport() {
			if (!session) return null;
			return {
				schemaVersion: session.schemaVersion,
				sessionId: session.sessionId,
				startedAt: session.startedAt,
				stoppedAt: session.stoppedAt,
				page: session.page,
				limits: session.limits,
				frameCount: session.frameCount,
				storedBytes: session.storedBytes,
				operations: session.operations.map((operation) => {
					const { _capturedAt, ...exported } = operation;
					return exported;
				}),
				otherFrames: session.otherFrames,
				anomalies: session.anomalies,
				redactions: session.redactions
			};
		}
		function exportJson() {
			const exported = buildExport();
			if (!exported) return;
			const filename = `edvibe-ws-recording-${sanitizeIsoForFilename(exported.startedAt)}.json`;
			downloadText(filename, JSON.stringify(exported, null, 2));
			notice = `Saved ${filename}.`;
			render();
		}
		async function copy(content) {
			copyFallback = "";
			try {
				await copyText(content);
				notice = "Copied to clipboard.";
			} catch (error) {
				log("Clipboard copy failed:", error);
				copyFallback = content;
				notice = "Clipboard unavailable. Copy the text below.";
			}
			render();
		}
		function copyRequest(sequence) {
			const operation = session?.operations.find((entry) => entry.sequence === sequence);
			if (operation) return copy(makeRequestSnippet(operation));
			return Promise.resolve();
		}
		function copyRecipe() {
			if (!session) return Promise.resolve();
			return copy(makeRecipe(session.operations));
		}
		function closePanel() {
			panel?.remove?.();
			panel = null;
		}
		function open() {
			if (!panel) {
				panel = createPanel();
				panel.configure?.({
					onStart: start,
					onStop: stop,
					onClear: clear,
					onExport: exportJson,
					onCopyRequest: copyRequest,
					onCopyRecipe: copyRecipe,
					onClose: closePanel
				});
				panel.mount?.();
			} else {
				panel.configure?.();
				panel.restore?.();
			}
			render();
		}
		subscribeFrames(handleFrame);
		return {
			open,
			start,
			stop,
			clear,
			exportJson,
			copyRequest,
			copyRecipe,
			buildExport,
			getState
		};
	}
	//#endregion
	//#region src/components/action-recorder-dialog.styles.js
	var actionRecorderDialogStyles = i$3`
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

`;
	//#endregion
	//#region src/components/action-recorder-dialog.js
	var RECORDER_DIALOG_TAG = "edvibe-toolbox-action-recorder";
	var RECORDER_DIALOG_ID = "edvibe-toolbox-action-recorder";
	var ActionRecorderDialog = class extends i {
		static styles = [
			componentFoundationStyles,
			dialogFoundationStyles,
			actionRecorderDialogStyles
		];
		static properties = {
			state: { state: true },
			minimized: { state: true },
			showToolbox: { state: true },
			elapsedLabel: { state: true }
		};
		constructor() {
			super();
			this.callbacks = {};
			this.state = {
				status: "idle",
				session: null
			};
			this.minimized = false;
			this.showToolbox = false;
			this.elapsedLabel = "";
			this.elapsedTimer = null;
		}
		connectedCallback() {
			super.connectedCallback();
			if (!this.id) this.id = RECORDER_DIALOG_ID;
			this.syncElapsedTimer();
		}
		disconnectedCallback() {
			this.stopElapsedTimer();
			super.disconnectedCallback();
		}
		configure(options = {}) {
			options = options && typeof options === "object" ? options : {};
			for (const name of [
				"onStart",
				"onStop",
				"onClear",
				"onExport",
				"onCopyRequest",
				"onCopyRecipe",
				"onClose"
			]) if (typeof options[name] === "function") this.callbacks[name] = options[name];
			return this;
		}
		mount() {
			if (!this.isConnected && globalThis.document?.body) globalThis.document.body.appendChild(this);
		}
		restore() {
			this.minimized = false;
		}
		setState(state) {
			this.state = state && typeof state === "object" ? state : {
				status: "idle",
				session: null
			};
			this.elapsedLabel = this.calculateElapsed();
			this.syncElapsedTimer();
			return this;
		}
		confirm(message) {
			return globalThis.confirm(message);
		}
		handleStart() {
			if (this.state.session && !this.confirm("Удалить предыдущую запись и начать новую?")) return;
			this.callbacks.onStart?.();
		}
		handleClear() {
			if (!this.state.session || this.confirm("Удалить текущую запись?")) this.callbacks.onClear?.();
		}
		handleClose() {
			if (this.state.status === "recording") {
				this.minimized = true;
				return;
			}
			this.callbacks.onClose?.();
		}
		formatBytes(bytes) {
			if (bytes < 1024) return `${bytes} Б`;
			if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КиБ`;
			return `${(bytes / 1024 / 1024).toFixed(1)} МиБ`;
		}
		operationStatus(operation) {
			if (!operation.response) return "Ожидается";
			if (operation.response.isSuccess === true) return "Успешно";
			if (operation.response.isSuccess === false) return "Ошибка";
			return "Ответ получен";
		}
		visibleOperations() {
			return (this.state.session?.operations || []).filter((operation) => this.showToolbox || operation.origin === "page");
		}
		calculateElapsed() {
			const startedAt = this.state.session?.startedAt;
			if (!startedAt) return "";
			const started = Date.parse(startedAt);
			if (Number.isNaN(started)) return "";
			const end = this.state.session.stoppedAt ? Date.parse(this.state.session.stoppedAt) : Date.now();
			const elapsedSeconds = Math.max(0, Math.floor((end - started) / 1e3));
			return `${Math.floor(elapsedSeconds / 60)}:${String(elapsedSeconds % 60).padStart(2, "0")}`;
		}
		syncElapsedTimer() {
			this.stopElapsedTimer();
			if (this.state.status !== "recording" || !this.isConnected) return;
			this.elapsedTimer = globalThis.setInterval(() => {
				this.elapsedLabel = this.calculateElapsed();
			}, 1e3);
		}
		stopElapsedTimer() {
			if (this.elapsedTimer !== null) {
				globalThis.clearInterval(this.elapsedTimer);
				this.elapsedTimer = null;
			}
		}
		renderJsonBlock(label, value) {
			return b`<div><strong>${label}</strong><pre>${JSON.stringify(value, null, 2)}</pre></div>`;
		}
		renderOperation(operation) {
			const resultClass = `operation-result is-${operation.response?.isSuccess === false ? "error" : "normal"}`;
			return b`
            <details class="operation">
                <summary>
                    <span class="operation-sequence">${String(operation.sequence).padStart(2, "0")}</span>
                    <strong class="operation-name">${operation.controller}.${operation.method}</strong>
                    <span class="operation-duration">${operation.durationMs === null ? "—" : `${operation.durationMs} мс`}</span>
                    <span class=${resultClass}>${this.operationStatus(operation)}</span>
                </summary>
                <div class="operation-content">
                    <p>${[
				`Project: ${operation.projectName || "—"}`,
				`RequestId: ${operation.requestId}`,
				`Origin: ${operation.origin}`
			].join(" · ")}</p>
                    ${this.renderJsonBlock("Запрос Value", operation.requestValue)}
                    ${this.renderJsonBlock("Ответ", operation.response)}
                    <button type="button" class="button copy-request"
                        @click=${() => this.callbacks.onCopyRequest?.(operation.sequence)}>
                        Копировать запрос
                    </button>
                </div>
            </details>
        `;
		}
		render() {
			const recording = this.state.status === "recording";
			const hasSession = Boolean(this.state.session);
			const operations = this.state.session?.operations || [];
			const visibleOperations = this.visibleOperations();
			const otherFrames = this.state.session?.otherFrames || [];
			const labels = {
				idle: "Готово к записи",
				recording: "Идёт запись",
				stopped: "Запись остановлена",
				"limit-reached": "Достигнут лимит"
			};
			const indicatorClass = `recorder-indicator${recording ? " is-recording" : ""}`;
			const copyFallback = String(this.state.copyFallback || "");
			return b`
<button class=${indicatorClass} type="button" ?hidden=${!this.minimized}
                aria-label="Открыть запись WebSocket" @click=${() => this.restore()}>
                <span></span><strong>REC</strong>
                <span class="indicator-count">${visibleOperations.length}</span>
            </button>
            <div class="recorder-overlay" ?hidden=${this.minimized}>
                <section class="recorder-panel" role="dialog" aria-labelledby="recorder-title">
                    <header class="recorder-header">
                        <div>
                            <h2 id="recorder-title">Запись действий WebSocket</h2>
                            <p class="recorder-subtitle">Выполните одно действие в Edvibe и изучите обмен сообщениями.</p>
                        </div>
                        <div class="header-actions">
                            <button class="icon-button recorder-minimize" type="button" aria-label="Свернуть"
                                @click=${() => {
				this.minimized = true;
			}}>−</button>
                            <button class="icon-button recorder-close" type="button" aria-label="Закрыть"
                                @click=${() => this.handleClose()}>&times;</button>
                        </div>
                    </header>
                    <div class="recorder-toolbar">
                        <div class="recorder-state" data-status=${this.state.status}>
                            <span class="state-dot"></span>
                            <strong class="state-label">${labels[this.state.status] || labels.idle}</strong>
                            <span class="elapsed">${this.elapsedLabel}</span>
                        </div>
                        <div class="toolbar-actions">
                            <button class="button primary recorder-start" type="button" ?hidden=${recording}
                                @click=${() => this.handleStart()}>Начать запись</button>
                            <button class="button danger recorder-stop" type="button" ?hidden=${!recording}
                                @click=${() => this.callbacks.onStop?.()}>Остановить</button>
                            <button class="button recorder-clear" type="button" ?disabled=${!hasSession}
                                @click=${() => this.handleClear()}>Очистить</button>
                            <button class="button recorder-copy" type="button"
                                ?disabled=${!hasSession || operations.length === 0}
                                @click=${() => this.callbacks.onCopyRecipe?.()}>Копировать рецепт</button>
                            <button class="button recorder-export" type="button" ?disabled=${!hasSession}
                                @click=${() => this.callbacks.onExport?.()}>Экспорт JSON</button>
                        </div>
                    </div>
                    <div class="recorder-body">
                        <aside class="privacy-warning">
                            Запись может содержать данные учеников, уроки, ответы и идентификаторы.
                            Проверьте файл перед отправкой или коммитом.
                        </aside>
                        <div class="recorder-summary">
                            <span><strong class="operation-count">${visibleOperations.length}</strong> операций</span>
                            <span><strong class="frame-count">${this.state.session?.frameCount || 0}</strong> кадров</span>
                            <span><strong class="byte-count">${this.formatBytes(this.state.session?.storedBytes || 0)}</strong> текста</span>
                            <label><input class="show-toolbox" type="checkbox" .checked=${this.showToolbox}
                                @change=${(event) => {
				this.showToolbox = event.currentTarget.checked;
			}}>
                                Показать трафик Toolbox</label>
                        </div>
                        <p class="recorder-notice" role="status" ?hidden=${!this.state.notice}>${this.state.notice || ""}</p>
                        <section>
                            <h3>Операции</h3>
                            <div class="operation-list">${visibleOperations.map((operation) => this.renderOperation(operation))}</div>
                            <p class="empty-operations" ?hidden=${visibleOperations.length > 0}>
                                Запустите запись и выполните действие в Edvibe.
                            </p>
                        </section>
                        <details class="other-section">
                            <summary>Другие кадры (<span class="other-count">${otherFrames.length}</span>)</summary>
                            <div class="other-list">${otherFrames.map((frame) => b`<pre>${JSON.stringify(frame, null, 2)}</pre>`)}</div>
                        </details>
                        <label class="copy-fallback" ?hidden=${!copyFallback}>
                            Скопируйте текст вручную
                            <textarea readonly .value=${copyFallback}></textarea>
                        </label>
                    </div>
                </section>
            </div>
        `;
		}
	};
	if (!customElements.get("edvibe-toolbox-action-recorder")) customElements.define(RECORDER_DIALOG_TAG, ActionRecorderDialog);
	globalThis.EdVibeActionRecorderDialog = {
		RECORDER_DIALOG_TAG,
		RECORDER_DIALOG_ID,
		ActionRecorderDialog
	};
	//#endregion
	//#region src/shared/batch-workflow-primitives.js
	var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	var TRANSIENT_CODES = /* @__PURE__ */ new Set([
		"WS_UNAVAILABLE",
		"REQUEST_TIMEOUT",
		"SEND_FAILED"
	]);
	function createFeatureError(code, message, details = {}) {
		const error = new Error(message);
		error.code = code;
		Object.assign(error, details);
		return error;
	}
	function parseMarathonId$3(url) {
		const match = String(url || "").match(/\/marathon\/(\d+)(?:\/|$)/);
		return match ? Number(match[1]) : null;
	}
	function parseEmailInput$1(value, { includeItems = false } = {}) {
		const entries = [];
		const malformed = [];
		const items = [];
		const seen = /* @__PURE__ */ new Set();
		for (const token of String(value || "").split(/[,;\r\n]+/)) {
			const input = token.trim();
			if (!input) continue;
			const normalized = input.toLowerCase();
			if (seen.has(normalized)) continue;
			seen.add(normalized);
			const isValid = EMAIL_PATTERN.test(input);
			if (!isValid) malformed.push(input);
			else entries.push({
				input,
				normalized
			});
			if (includeItems) items.push({
				input,
				normalized,
				isValid
			});
		}
		return includeItems ? {
			entries,
			malformed,
			items
		} : {
			entries,
			malformed
		};
	}
	function appendPage(items, total, nextItems, nextTotal, label) {
		if (!Array.isArray(nextItems) || !Number.isInteger(nextTotal) || nextTotal < 0 || total !== null && nextTotal !== total || nextItems.length === 0 && items.length < nextTotal || items.length + nextItems.length > nextTotal) throw createFeatureError("INVALID_RESPONSE", `${label} returned invalid pagination data.`);
		return {
			items: items.concat(nextItems),
			total: nextTotal
		};
	}
	function isTransientError(error, getConnectionState) {
		if (!TRANSIENT_CODES.has(error?.code)) return false;
		if (error.code !== "SEND_FAILED") return true;
		return Boolean(error.cause) && !getConnectionState().isOpen;
	}
	async function runWithRetry(operation, { wait, getConnectionState, retryDelays = [1e3, 3e3] }) {
		let attempts = 0;
		while (attempts <= retryDelays.length) {
			attempts += 1;
			try {
				if (attempts > 1 && !getConnectionState().isOpen) throw createFeatureError("WS_UNAVAILABLE", "The Edvibe connection is unavailable.");
				return {
					value: await operation(),
					attempts
				};
			} catch (error) {
				if (!isTransientError(error, getConnectionState) || attempts > retryDelays.length) {
					error.attempts = attempts;
					throw error;
				}
				await wait(retryDelays[attempts - 1]);
			}
		}
		throw createFeatureError("INTERNAL_ERROR", "Retry loop ended unexpectedly.");
	}
	//#endregion
	//#region src/shared/edvibe-marathon-api.js
	/** @typedef {import('./edvibe-marathon-api.types.js').EdvibeSendRequest} EdvibeSendRequest */
	/** @typedef {import('./edvibe-marathon-api.types.js').EdvibeMarathonApi} EdvibeMarathonApi */
	/** @typedef {import('./edvibe-marathon-api.types.js').MarathonLesson} MarathonLesson */
	/** @typedef {import('./edvibe-marathon-api.types.js').MarathonPupil} MarathonPupil */
	/**
	* @param {unknown} value
	* @returns {value is Record<string, unknown>}
	*/
	function isRecord(value) {
		return value !== null && typeof value === "object" && !Array.isArray(value);
	}
	/**
	* @param {unknown} sendRequest
	* @returns {EdvibeSendRequest}
	*/
	function requireRequest(sendRequest) {
		if (typeof sendRequest !== "function") throw new TypeError("sendRequest is required");
		return sendRequest;
	}
	/**
	* Decode the transport envelope without changing pagination failure semantics.
	* The shared appendPage validator remains authoritative for Items and Count.
	* @param {unknown} response
	* @returns {{ items: unknown, total: unknown }}
	*/
	function readPage(response) {
		if (!isRecord(response)) return {
			items: void 0,
			total: void 0
		};
		const value = isRecord(response.Value) ? response.Value : isRecord(response.value) ? response.value : null;
		if (!value) return {
			items: void 0,
			total: void 0
		};
		const page = isRecord(value.Page) ? value.Page : null;
		return {
			items: value.Items,
			total: page?.Count
		};
	}
	/**
	* @param {{ sendRequest: EdvibeSendRequest, marathonId: number, pageSize?: number }} options
	* @returns {Promise<MarathonPupil[]>}
	*/
	async function loadAllPupils({ sendRequest, marathonId, pageSize = 50 }) {
		const request = requireRequest(sendRequest);
		/** @type {Record<string, unknown>[]} */
		let items = [];
		/** @type {number | null} */
		let total = null;
		while (total === null || items.length < total) {
			const pageData = readPage(await request("MarathonPupilsWsController", "GetMarathonPupils", "Marathons", {
				MarathonId: marathonId,
				Skip: items.length,
				Take: pageSize
			}));
			const page = appendPage(items, total, pageData.items, pageData.total, "GetMarathonPupils");
			items = page.items;
			total = page.total;
		}
		return items;
	}
	/**
	* @param {{ sendRequest: EdvibeSendRequest, marathonId: number, pupilId: number, pageSize?: number }} options
	* @returns {Promise<MarathonLesson[]>}
	*/
	async function loadAllPupilLessons({ sendRequest, marathonId, pupilId, pageSize = 20 }) {
		const request = requireRequest(sendRequest);
		/** @type {Record<string, unknown>[]} */
		let items = [];
		/** @type {number | null} */
		let total = null;
		while (total === null || items.length < total) {
			const pageData = readPage(await request("MarathonLessonWsController", "GetMarathonLessonsForPupilPagination", "Marathons", {
				PupilId: pupilId,
				MarathonId: marathonId,
				SearchTerm: "",
				Page: {
					Skip: items.length,
					Take: pageSize
				}
			}));
			const page = appendPage(items, total, pageData.items, pageData.total, "GetMarathonLessonsForPupilPagination");
			items = page.items;
			total = page.total;
		}
		return items;
	}
	/**
	* @param {{ sendRequest: EdvibeSendRequest, marathonId: number, pageSize?: number }} options
	* @returns {Promise<MarathonLesson[]>}
	*/
	async function loadAllMarathonLessons({ sendRequest, marathonId, pageSize = 100 }) {
		const request = requireRequest(sendRequest);
		/** @type {Record<string, unknown>[]} */
		let items = [];
		/** @type {number | null} */
		let total = null;
		while (total === null || items.length < total) {
			const pageData = readPage(await request("MarathonLessonWsController", "GetMarathonLessonsPagination", "Marathons", {
				MarathonId: marathonId,
				SearchTerm: "",
				Page: {
					Skip: items.length,
					Take: pageSize
				}
			}));
			const page = appendPage(items, total, pageData.items, pageData.total, "GetMarathonLessonsPagination");
			items = page.items;
			total = page.total;
		}
		return items;
	}
	/**
	* @param {{ sendRequest: EdvibeSendRequest, lessonId: number }} options
	* @returns {Promise<Record<string, unknown>>}
	*/
	async function getLessonById({ sendRequest, lessonId }) {
		const response = await requireRequest(sendRequest)("LessonWsController", "GetLessonWithId", "Books", { LessonId: lessonId });
		if (!isRecord(response)) throw createFeatureError("INVALID_RESPONSE", "GetLessonWithId returned an invalid response.");
		return response;
	}
	//#endregion
	//#region src/features/batch-lesson-access.js
	var OPERATIONAL_WRITE_CODES = /* @__PURE__ */ new Set([
		...TRANSIENT_CODES,
		"SERVER_REJECTED",
		"INVALID_RESPONSE"
	]);
	var BATCH_ACCESS_DIALOG_TAG$1 = "edvibe-toolbox-batch-access-dialog";
	var BATCH_ACCESS_OVERLAY_ID$1 = "edvibe-toolbox-batch-access-overlay";
	function getPupilId$1(pupil) {
		return pupil.PupilId === void 0 ? pupil.Id : pupil.PupilId;
	}
	function getMarathonPupilId$1(pupil) {
		return pupil.MarathonPupilId === void 0 ? pupil.Id : pupil.MarathonPupilId;
	}
	function resolvePupilsByEmail(entries, pupils) {
		const pupilsByEmail = /* @__PURE__ */ new Map();
		for (const pupil of pupils) {
			const email = String(pupil.Email || "").trim().toLowerCase();
			const candidates = pupilsByEmail.get(email) || [];
			candidates.push(pupil);
			pupilsByEmail.set(email, candidates);
		}
		const matches = [];
		const errors = [];
		for (const entry of entries) {
			const candidates = pupilsByEmail.get(entry.normalized) || [];
			if (candidates.length === 1) matches.push(candidates[0]);
			else if (candidates.length === 0) errors.push({
				type: "missing",
				input: entry.input,
				message: `No marathon pupil found for ${entry.input}.`
			});
			else errors.push({
				type: "ambiguous",
				input: entry.input,
				count: candidates.length,
				message: `Multiple marathon pupils found for ${entry.input}.`
			});
		}
		return {
			matches,
			errors
		};
	}
	function buildAccessPlan({ pupils, selectedLessonIds, lessonsByPupilId }) {
		const alreadyOpen = [];
		const needsOpening = [];
		const errors = [];
		for (const pupil of pupils) {
			const pupilId = getPupilId$1(pupil);
			const lessons = lessonsByPupilId.get(pupilId) || [];
			const selectedLessons = /* @__PURE__ */ new Map();
			const duplicateLessonIds = /* @__PURE__ */ new Set();
			for (const lesson of lessons) {
				if (!selectedLessonIds.includes(lesson.MarathonLessonId)) continue;
				if (selectedLessons.get(lesson.MarathonLessonId)) {
					duplicateLessonIds.add(lesson.MarathonLessonId);
					errors.push(createFeatureError("INVALID_RESPONSE", `Multiple lesson states were returned for lesson ${lesson.MarathonLessonId}.`, {
						email: pupil.Email,
						pupilId,
						marathonLessonId: lesson.MarathonLessonId
					}));
					continue;
				}
				selectedLessons.set(lesson.MarathonLessonId, lesson);
			}
			for (const marathonLessonId of selectedLessonIds) {
				const lesson = selectedLessons.get(marathonLessonId);
				if (duplicateLessonIds.has(marathonLessonId)) continue;
				if (!lesson) {
					errors.push(createFeatureError("INVALID_RESPONSE", `Lesson ${marathonLessonId} was not returned for ${pupil.Email}.`, {
						email: pupil.Email,
						pupilId,
						marathonLessonId
					}));
					continue;
				}
				if (typeof lesson.IsOpen !== "boolean") {
					errors.push(createFeatureError("INVALID_RESPONSE", `Lesson ${marathonLessonId} returned an invalid access state.`, {
						email: pupil.Email,
						pupilId,
						marathonLessonId
					}));
					continue;
				}
				const item = {
					email: pupil.Email,
					pupilId,
					marathonPupilId: getMarathonPupilId$1(pupil),
					marathonLessonId,
					lessonNumber: lesson.Number + 1,
					lessonName: lesson.Name
				};
				if (lesson.IsOpen === true) alreadyOpen.push(item);
				else needsOpening.push(item);
			}
		}
		return {
			alreadyOpen,
			needsOpening,
			errors
		};
	}
	function createProgressSnapshot({ completed, total, opened, failures, alreadyOpen, item }) {
		return Object.freeze({
			completed,
			total,
			opened,
			failures,
			alreadyOpen,
			current: Object.freeze({
				email: item.email,
				lessonName: item.lessonName
			})
		});
	}
	function createExecutionFailure(item, error, { code = error?.code || "UNKNOWN_ERROR", message = error?.message || "The lesson access change failed.", attempts = error?.attempts || 1 } = {}) {
		return {
			email: item.email,
			lessonNumber: item.lessonNumber,
			lessonName: item.lessonName,
			marathonLessonId: item.marathonLessonId,
			attempts,
			code,
			message
		};
	}
	function createExecutionResult({ requestedEmails, matchedUsers, selectedLessons, opened, alreadyOpen, failures, attempts }) {
		return {
			requestedEmails,
			matchedUsers,
			selectedLessons,
			opened,
			alreadyOpen: alreadyOpen.length,
			failures,
			attempts
		};
	}
	async function executeAccessPlan({ marathonId, requestedEmails, matchedUsers, selectedLessons, alreadyOpen = [], needsOpening = [], sendRequest, wait, getConnectionState, onProgress = () => {} }) {
		const opened = [];
		const failures = [];
		let attempts = 0;
		for (let index = 0; index < needsOpening.length; index += 1) {
			const item = needsOpening[index];
			let itemAttempts = 0;
			try {
				onProgress(createProgressSnapshot({
					completed: index,
					total: needsOpening.length,
					opened: opened.length,
					failures: failures.length,
					alreadyOpen: alreadyOpen.length,
					item
				}));
				await wait(300);
				try {
					itemAttempts = (await runWithRetry(async () => {
						const response = await sendRequest("MarathonLessonWsController", "ChangeIsOpenLessonForPupil", "Marathons", {
							IsOpen: true,
							MarathonLessonId: item.marathonLessonId,
							MarathonPupilId: item.marathonPupilId,
							MarathonId: marathonId
						});
						if (response?.Value !== true) throw createFeatureError("INVALID_RESPONSE", "The lesson access change was not confirmed.");
						return response;
					}, {
						wait,
						getConnectionState
					})).attempts;
					attempts += itemAttempts;
					opened.push(item);
				} catch (error) {
					itemAttempts = error.attempts || 1;
					attempts += itemAttempts;
					if (!OPERATIONAL_WRITE_CODES.has(error?.code)) throw error;
					failures.push(createExecutionFailure(item, error, { attempts: itemAttempts }));
				}
				onProgress(createProgressSnapshot({
					completed: index + 1,
					total: needsOpening.length,
					opened: opened.length,
					failures: failures.length,
					alreadyOpen: alreadyOpen.length,
					item
				}));
			} catch (error) {
				failures.push(createExecutionFailure(item, error, {
					code: "INTERNAL_ERROR",
					message: "An internal error stopped the batch operation.",
					attempts: itemAttempts
				}));
				throw createFeatureError("INTERNAL_ERROR", "An internal error stopped the batch operation.", {
					cause: error,
					partialResult: createExecutionResult({
						requestedEmails,
						matchedUsers,
						selectedLessons,
						opened,
						alreadyOpen,
						failures,
						attempts
					})
				});
			}
		}
		return createExecutionResult({
			requestedEmails,
			matchedUsers,
			selectedLessons,
			opened,
			alreadyOpen,
			failures,
			attempts
		});
	}
	function formatBatchReport(result) {
		const lines = [
			`Requested emails: ${result.requestedEmails.length}`,
			`Matched users: ${result.matchedUsers}`,
			`Selected lessons: ${result.selectedLessons}`,
			`Opened: ${result.opened.length}`,
			`Already open: ${result.alreadyOpen}`,
			`Failed: ${result.failures.length}`,
			`Attempts: ${result.attempts}`
		];
		for (const failure of result.failures) lines.push(`FAILED ${failure.email} — ${failure.lessonNumber}. ${failure.lessonName} — ${failure.attempts} attempts — ${failure.code}: ${failure.message}`);
		return lines.join("\n");
	}
	function freezeItems$1(items) {
		return Object.freeze(items.map((item) => Object.freeze({ ...item })));
	}
	function freezePlan({ requestedEmails, matchedUsers, selectedLessonIds, alreadyOpen, needsOpening }) {
		return Object.freeze({
			requestedEmails: Object.freeze([...requestedEmails]),
			matchedUsers,
			selectedLessonIds: Object.freeze([...selectedLessonIds]),
			alreadyOpen: freezeItems$1(alreadyOpen),
			needsOpening: freezeItems$1(needsOpening)
		});
	}
	function createBatchLessonAccessFeature({ sendRequest, getConnectionState, wait, canStart, onActiveChange, createDialog = () => document.createElement(BATCH_ACCESS_DIALOG_TAG$1), copyText = async () => {}, log = () => {} }) {
		let active = false;
		let running = false;
		let pupils = [];
		let lessonCatalogue = [];
		let pendingPlan = null;
		let completedResult = null;
		let marathonId = null;
		let dialog = null;
		function releaseOperation() {
			if (!active) return;
			active = false;
			onActiveChange(false);
		}
		function handleClose() {
			running = false;
			pupils = [];
			lessonCatalogue = [];
			pendingPlan = null;
			completedResult = null;
			marathonId = null;
			dialog = null;
			releaseOperation();
		}
		function getErrorCode(error) {
			return typeof error?.code === "string" ? error.code : "UNKNOWN_ERROR";
		}
		function createReadError(error, pupil, pupilId) {
			const code = getErrorCode(error);
			const email = String(pupil?.Email || "").trim();
			return createFeatureError(code, `Could not load lesson access for ${email || "the selected pupil"} (${code}).`, {
				email,
				pupilId,
				attempts: error?.attempts || 1
			});
		}
		function createInputErrors(parsed, selectedLessonIds) {
			const errors = parsed.malformed.map((input) => createFeatureError("INVALID_EMAIL", `Invalid email address: ${input}.`));
			if (parsed.entries.length === 0 && parsed.malformed.length === 0) errors.push(createFeatureError("EMAILS_REQUIRED", "Enter at least one email address."));
			if (selectedLessonIds.length === 0) errors.push(createFeatureError("LESSONS_REQUIRED", "Select at least one lesson."));
			return errors;
		}
		function showCompletedPlan(plan) {
			completedResult = {
				requestedEmails: [...plan.requestedEmails],
				matchedUsers: plan.matchedUsers,
				selectedLessons: plan.selectedLessonIds.length,
				opened: [],
				alreadyOpen: plan.alreadyOpen.length,
				failures: [],
				attempts: 0
			};
			pendingPlan = null;
			dialog.showComplete(completedResult);
		}
		async function handleSubmit(event) {
			if (running) return;
			running = true;
			pendingPlan = null;
			completedResult = null;
			const submittedEmailInput = String(event?.detail?.emailInput || "");
			const selectedLessonIds = Object.freeze(Array.isArray(event?.detail?.selectedLessonIds) ? [...event.detail.selectedLessonIds] : []);
			try {
				dialog.showValidation();
				const parsed = parseEmailInput$1(submittedEmailInput);
				const inputErrors = createInputErrors(parsed, selectedLessonIds);
				const resolution = resolvePupilsByEmail(parsed.entries, pupils);
				const validationErrors = inputErrors.concat(resolution.errors);
				if (validationErrors.length > 0) {
					log(`Batch access validation blocked for MarathonId ${marathonId}; ${validationErrors.length} error(s).`);
					dialog.showValidationErrors(validationErrors);
					return;
				}
				const lessonsByPupilId = /* @__PURE__ */ new Map();
				const pupilsWithLessons = [];
				const readErrors = [];
				for (const pupil of resolution.matches) {
					const pupilId = getPupilId$1(pupil);
					try {
						log(`Loading batch access state for PupilId ${pupilId} in MarathonId ${marathonId}.`);
						const result = await runWithRetry(() => loadAllPupilLessons({
							sendRequest,
							marathonId,
							pupilId
						}), {
							wait,
							getConnectionState
						});
						lessonsByPupilId.set(pupilId, result.value);
						pupilsWithLessons.push(pupil);
						log(`Loaded ${result.value.length} lesson state(s) for PupilId ${pupilId} after ${result.attempts} attempt(s).`);
					} catch (error) {
						readErrors.push(createReadError(error, pupil, pupilId));
						log(`Batch access state read failed for PupilId ${pupilId} in MarathonId ${marathonId} (${getErrorCode(error)}).`);
					}
				}
				const plan = buildAccessPlan({
					pupils: pupilsWithLessons,
					selectedLessonIds,
					lessonsByPupilId
				});
				const preflightErrors = readErrors.concat(plan.errors);
				if (preflightErrors.length > 0) {
					log(`Batch access preflight blocked for MarathonId ${marathonId}; ${preflightErrors.length} error(s), zero writes issued.`);
					dialog.showValidationErrors(preflightErrors);
					return;
				}
				pendingPlan = freezePlan({
					requestedEmails: parsed.entries.map((entry) => entry.input),
					matchedUsers: resolution.matches.length,
					selectedLessonIds,
					alreadyOpen: plan.alreadyOpen,
					needsOpening: plan.needsOpening
				});
				log(`Batch access preflight complete for MarathonId ${marathonId}; ${pendingPlan.needsOpening.length} pending, ${pendingPlan.alreadyOpen.length} already open.`);
				if (pendingPlan.needsOpening.length === 0) {
					showCompletedPlan(pendingPlan);
					return;
				}
				dialog.showConfirmation(Object.freeze({
					matchedUsers: pendingPlan.matchedUsers,
					selectedLessons: pendingPlan.selectedLessonIds.length,
					needsOpening: pendingPlan.needsOpening,
					alreadyOpen: pendingPlan.alreadyOpen
				}));
			} catch (error) {
				log(`Batch access preflight failed for MarathonId ${marathonId} (${getErrorCode(error)}).`);
				dialog.showValidationErrors([error]);
			} finally {
				running = false;
			}
		}
		async function handleConfirm() {
			if (running || !pendingPlan) return;
			running = true;
			const executionPlan = pendingPlan;
			pendingPlan = null;
			try {
				try {
					completedResult = await executeAccessPlan({
						marathonId,
						requestedEmails: executionPlan.requestedEmails,
						matchedUsers: executionPlan.matchedUsers,
						selectedLessons: executionPlan.selectedLessonIds.length,
						alreadyOpen: executionPlan.alreadyOpen,
						needsOpening: executionPlan.needsOpening,
						sendRequest,
						wait,
						getConnectionState,
						onProgress: (progress) => dialog.showExecution(progress)
					});
				} catch (error) {
					if (error?.code !== "INTERNAL_ERROR" || !error.partialResult) throw error;
					completedResult = error.partialResult;
					log(`Batch access execution stopped for MarathonId ${marathonId}; ${completedResult.opened.length} opened, ${completedResult.failures.length} failed (INTERNAL_ERROR).`);
				}
				log(`Batch access execution complete for MarathonId ${marathonId}; ${completedResult.opened.length} opened, ${completedResult.alreadyOpen} already open, ${completedResult.failures.length} failed.`);
				for (const failure of completedResult.failures) log(`Batch access write failed for MarathonLessonId ${failure.marathonLessonId} (${failure.code}).`);
				dialog.showComplete(completedResult);
			} finally {
				running = false;
			}
		}
		async function handleCopyReport() {
			if (!completedResult) return;
			await copyText(formatBatchReport(completedResult));
		}
		function handleRestart() {
			pendingPlan = null;
			completedResult = null;
			running = false;
		}
		async function open() {
			if (active || document.getElementById(BATCH_ACCESS_OVERLAY_ID$1)) return;
			if (!canStart()) {
				window.alert("Another Edvibe Toolbox operation is already running.");
				return;
			}
			marathonId = parseMarathonId$3(window.location.href);
			if (!marathonId) {
				window.alert("Open an Edvibe marathon page before opening batch lesson access.");
				return;
			}
			active = true;
			onActiveChange(true);
			try {
				dialog = createDialog();
				dialog.addEventListener("edvibe-dialog-close", handleClose);
				dialog.addEventListener("edvibe-batch-access-input-change", (event) => {
					const parsed = parseEmailInput$1(event?.detail?.emailInput);
					dialog.setEmailState({
						validCount: parsed.entries.length,
						malformedCount: parsed.malformed.length
					});
				});
				dialog.addEventListener("edvibe-batch-access-submit", handleSubmit);
				dialog.addEventListener("edvibe-batch-access-confirm", handleConfirm);
				dialog.addEventListener("edvibe-batch-access-copy-report", handleCopyReport);
				dialog.addEventListener("edvibe-batch-access-restart", handleRestart);
				dialog.configure();
				(document.body || document.documentElement).appendChild(dialog);
				dialog.showLoading();
				log(`Initializing batch access for MarathonId ${marathonId}.`);
				pupils = await loadAllPupils({
					sendRequest,
					marathonId
				});
				if (pupils.length === 0) throw createFeatureError("EMPTY_ROSTER", "No pupils were found in this marathon.");
				const firstPupilId = getPupilId$1(pupils[0]);
				lessonCatalogue = await loadAllPupilLessons({
					sendRequest,
					marathonId,
					pupilId: firstPupilId
				});
				log(`Initialized batch access for MarathonId ${marathonId}; ${pupils.length} pupil(s), ${lessonCatalogue.length} lesson(s), catalogue PupilId ${firstPupilId}.`);
				dialog.showConfigure({ lessons: lessonCatalogue });
			} catch (error) {
				log(`Batch access initialization failed for MarathonId ${marathonId} (${getErrorCode(error)}).`);
				try {
					if (typeof dialog?.showFatalError === "function") dialog.showFatalError(error);
					else throw error;
				} finally {
					releaseOperation();
				}
			}
		}
		return {
			open,
			isRunning: () => running
		};
	}
	//#endregion
	//#region src/features/batch-lesson-access-history-model.js
	var batch_lesson_access_history_model_exports = /* @__PURE__ */ __exportAll({
		OPERATION_TYPE: () => OPERATION_TYPE$4,
		attemptKey: () => attemptKey,
		buildObservedPlan: () => buildObservedPlan$1,
		createCapture: () => createCapture$1,
		freezeObject: () => freezeObject,
		lessonKey: () => lessonKey$2,
		normalizeEmail: () => normalizeEmail,
		observeRequest: () => observeRequest$1,
		recordWriteAttempt: () => recordWriteAttempt$1,
		sanitizeLesson: () => sanitizeLesson$1,
		sanitizePupil: () => sanitizePupil,
		splitSubmittedInputs: () => splitSubmittedInputs
	});
	var OPERATION_TYPE$4 = "batch_lesson_access";
	function freezeObject(value) {
		return Object.freeze({ ...value });
	}
	function freezeItems(items) {
		return Object.freeze(items.map((item) => freezeObject(item)));
	}
	function normalizeEmail(value) {
		return String(value || "").trim().toLowerCase();
	}
	function getPupilId(pupil) {
		return pupil?.PupilId ?? pupil?.Id ?? null;
	}
	function getMarathonPupilId(pupil) {
		return pupil?.MarathonPupilId ?? pupil?.Id ?? null;
	}
	function sanitizePupil(pupil) {
		return freezeObject({
			email: String(pupil?.Email || "").trim() || null,
			pupilId: getPupilId(pupil),
			marathonPupilId: getMarathonPupilId(pupil)
		});
	}
	function sanitizeLesson$1(lesson) {
		const number = Number(lesson?.Number);
		return freezeObject({
			marathonLessonId: lesson?.MarathonLessonId ?? null,
			lessonNumber: Number.isFinite(number) ? number + 1 : null,
			lessonName: String(lesson?.Name || "").trim() || null,
			isOpen: typeof lesson?.IsOpen === "boolean" ? lesson.IsOpen : null
		});
	}
	function splitSubmittedInputs(value) {
		const entries = [];
		const seen = /* @__PURE__ */ new Set();
		for (const token of String(value || "").split(/[,;\r\n]+/)) {
			const submittedInput = token.trim();
			if (!submittedInput) continue;
			const normalizedEmail = normalizeEmail(submittedInput);
			if (seen.has(normalizedEmail)) continue;
			seen.add(normalizedEmail);
			entries.push(freezeObject({
				submittedInput,
				normalizedEmail
			}));
		}
		return Object.freeze(entries);
	}
	function lessonKey$2(email, marathonLessonId) {
		return `${normalizeEmail(email)}:${String(marathonLessonId)}`;
	}
	function attemptKey(marathonPupilId, marathonLessonId) {
		return `${String(marathonPupilId)}:${String(marathonLessonId)}`;
	}
	function serializeError(error, fallbackCode, fallbackMessage) {
		return freezeObject({
			code: typeof error?.code === "string" ? error.code : fallbackCode,
			message: String(error?.message || fallbackMessage),
			email: String(error?.email || "").trim() || null,
			pupilId: error?.pupilId ?? null,
			marathonLessonId: error?.marathonLessonId ?? null,
			attempts: Number.isInteger(error?.attempts) ? error.attempts : 0,
			type: typeof error?.type === "string" ? error.type : null,
			count: Number.isInteger(error?.count) ? error.count : null
		});
	}
	function createCapture$1() {
		return {
			pupils: [],
			lessonsByPupilId: /* @__PURE__ */ new Map(),
			lessonCatalogue: [],
			writeAttempts: /* @__PURE__ */ new Map(),
			attempt: null,
			sequence: 0
		};
	}
	function replacePage(target, offset, values) {
		if (offset === 0) target.length = 0;
		for (let index = 0; index < values.length; index += 1) target[offset + index] = values[index];
		while (target.length > 0 && target[target.length - 1] === void 0) target.pop();
	}
	function observeRequest$1(capture, method, value, result) {
		if (method === "GetMarathonPupils") {
			const items = Array.isArray(result?.Value?.Items) ? result.Value.Items.map(sanitizePupil) : [];
			replacePage(capture.pupils, Number(value?.Skip) || 0, items);
			return;
		}
		if (method === "GetMarathonLessonsForPupilPagination") {
			const pupilId = value?.PupilId ?? null;
			const lessons = capture.lessonsByPupilId.get(pupilId) || [];
			const items = Array.isArray(result?.Value?.Items) ? result.Value.Items.map(sanitizeLesson$1) : [];
			replacePage(lessons, Number(value?.Page?.Skip) || 0, items);
			capture.lessonsByPupilId.set(pupilId, lessons);
		}
	}
	function recordWriteAttempt$1(capture, method, value) {
		if (method !== "ChangeIsOpenLessonForPupil") return;
		const key = attemptKey(value?.MarathonPupilId, value?.MarathonLessonId);
		capture.writeAttempts.set(key, (capture.writeAttempts.get(key) || 0) + 1);
	}
	function buildIdentityResolution({ submittedEmailInput, pupils }) {
		const submitted = splitSubmittedInputs(submittedEmailInput);
		const valid = parseEmailInput$1(submittedEmailInput);
		const malformed = new Set(valid.malformed.map(normalizeEmail));
		const pupilsByEmail = /* @__PURE__ */ new Map();
		for (const pupil of pupils) {
			const key = normalizeEmail(pupil.email);
			const candidates = pupilsByEmail.get(key) || [];
			candidates.push(pupil);
			pupilsByEmail.set(key, candidates);
		}
		return submitted.map((entry) => {
			if (malformed.has(entry.normalizedEmail)) return freezeObject({
				...entry,
				resolution: "malformed",
				resolvedEmail: null,
				pupilId: null,
				marathonPupilId: null,
				code: "USER_INPUT_MALFORMED",
				message: `Invalid email address: ${entry.submittedInput}.`
			});
			const candidates = pupilsByEmail.get(entry.normalizedEmail) || [];
			if (candidates.length === 0) return freezeObject({
				...entry,
				resolution: "missing",
				resolvedEmail: null,
				pupilId: null,
				marathonPupilId: null,
				code: "USER_NOT_FOUND",
				message: `No marathon pupil found for ${entry.submittedInput}.`
			});
			if (candidates.length > 1) return freezeObject({
				...entry,
				resolution: "ambiguous",
				resolvedEmail: null,
				pupilId: null,
				marathonPupilId: null,
				code: "USER_AMBIGUOUS",
				message: `Multiple marathon pupils found for ${entry.submittedInput}.`
			});
			const pupil = candidates[0];
			return freezeObject({
				...entry,
				resolution: "matched",
				resolvedEmail: pupil.email,
				pupilId: pupil.pupilId,
				marathonPupilId: pupil.marathonPupilId,
				code: null,
				message: null
			});
		});
	}
	function selectedLessonMetadata(selectedLessonIds, lessonCatalogue) {
		const byId = new Map(lessonCatalogue.map((lesson) => [lesson.marathonLessonId, lesson]));
		return freezeItems(selectedLessonIds.map((marathonLessonId) => {
			const lesson = byId.get(marathonLessonId);
			return {
				marathonLessonId,
				lessonNumber: lesson?.lessonNumber ?? null,
				lessonName: lesson?.lessonName || `Lesson ${marathonLessonId}`
			};
		}));
	}
	function findDiscoveryError(errors, identity) {
		return errors.find((error) => identity.pupilId !== null && error.pupilId === identity.pupilId || identity.resolvedEmail && normalizeEmail(error.email) === normalizeEmail(identity.resolvedEmail));
	}
	function buildObservedPlan$1({ submittedEmailInput, selectedLessonIds, pupils, lessonsByPupilId, lessonCatalogue, errors = [] }) {
		const identities = buildIdentityResolution({
			submittedEmailInput,
			pupils
		});
		const selectedLessons = selectedLessonMetadata(selectedLessonIds, lessonCatalogue);
		const serializedErrors = freezeItems(errors.map((error) => serializeError(error, "LESSON_ACCESS_PREFLIGHT_FAILED", "The lesson-access preflight failed.")));
		const matrix = [];
		const discoveryFailures = [];
		const representedErrorCodes = /* @__PURE__ */ new Set([
			"INVALID_EMAIL",
			"USER_INPUT_MALFORMED",
			"USER_NOT_FOUND",
			"USER_AMBIGUOUS"
		]);
		const operationFailures = serializedErrors.filter((error) => !error.email && error.pupilId === null && error.marathonLessonId === null && !error.type && !representedErrorCodes.has(error.code)).map((error) => freezeObject({
			code: error.code,
			message: error.message,
			attempts: error.attempts,
			kind: ["EMAILS_REQUIRED", "LESSONS_REQUIRED"].includes(error.code) ? "input" : "preflight"
		}));
		for (const identity of identities) {
			if (identity.resolution !== "matched") continue;
			const lessons = lessonsByPupilId.get(identity.pupilId);
			if (!Array.isArray(lessons)) {
				const source = findDiscoveryError(serializedErrors, identity);
				if (source) discoveryFailures.push(freezeObject({
					submittedEmail: identity.submittedInput,
					resolvedEmail: identity.resolvedEmail,
					pupilId: identity.pupilId,
					marathonPupilId: identity.marathonPupilId,
					code: source.code || "LESSON_STATE_DISCOVERY_FAILED",
					message: source.message || `Could not load lesson access for ${identity.resolvedEmail}.`,
					attempts: source.attempts || 0
				}));
				for (const selected of selectedLessons) matrix.push(freezeObject({
					...identity,
					...selected,
					preflightAccessState: "unknown",
					plannedOutcome: "not_attempted",
					code: source ? "LESSON_STATE_UNAVAILABLE" : "PREFLIGHT_BLOCKED",
					message: source ? "The lesson state could not be loaded, so this combination was not attempted." : "Validation stopped before this confirmed user and lesson combination could be prepared."
				}));
				continue;
			}
			const matchingByLessonId = /* @__PURE__ */ new Map();
			for (const lesson of lessons) {
				const values = matchingByLessonId.get(lesson.marathonLessonId) || [];
				values.push(lesson);
				matchingByLessonId.set(lesson.marathonLessonId, values);
			}
			for (const selected of selectedLessons) {
				const states = matchingByLessonId.get(selected.marathonLessonId) || [];
				if (states.length === 0) {
					matrix.push(freezeObject({
						...identity,
						...selected,
						preflightAccessState: "unknown",
						plannedOutcome: "rejected",
						code: "LESSON_NOT_RETURNED",
						message: `Lesson ${selected.marathonLessonId} was not returned for ${identity.resolvedEmail}.`
					}));
					continue;
				}
				if (states.length > 1) {
					matrix.push(freezeObject({
						...identity,
						...selected,
						preflightAccessState: "unknown",
						plannedOutcome: "rejected",
						code: "LESSON_STATE_AMBIGUOUS",
						message: `Multiple lesson states were returned for lesson ${selected.marathonLessonId}.`
					}));
					continue;
				}
				const state = states[0];
				if (typeof state.isOpen !== "boolean") {
					matrix.push(freezeObject({
						...identity,
						...selected,
						lessonNumber: state.lessonNumber ?? selected.lessonNumber,
						lessonName: state.lessonName || selected.lessonName,
						preflightAccessState: "unknown",
						plannedOutcome: "rejected",
						code: "INVALID_ACCESS_STATE",
						message: `Lesson ${selected.marathonLessonId} returned an invalid access state.`
					}));
					continue;
				}
				matrix.push(freezeObject({
					...identity,
					...selected,
					lessonNumber: state.lessonNumber ?? selected.lessonNumber,
					lessonName: state.lessonName || selected.lessonName,
					preflightAccessState: state.isOpen ? "open" : "closed",
					plannedOutcome: state.isOpen ? "already_open" : "pending",
					code: null,
					message: null
				}));
			}
		}
		return Object.freeze({
			identities: freezeItems(identities),
			selectedLessons,
			matrix: freezeItems(matrix),
			discoveryFailures: freezeItems(discoveryFailures),
			operationFailures: freezeItems(operationFailures),
			errors: serializedErrors
		});
	}
	//#endregion
	//#region src/features/batch-lesson-access-history-record.js
	var batch_lesson_access_history_record_exports = /* @__PURE__ */ __exportAll({ buildExecutionHistoryInput: () => buildExecutionHistoryInput$6 });
	var REJECTED_WRITE_CODES = /* @__PURE__ */ new Set(["SERVER_REJECTED", "INVALID_RESPONSE"]);
	function resultFromMatrix(item, outcome, attempts, code, message) {
		const status = {
			opened: "success",
			already_open: "noop",
			rejected: "rejected",
			failed: "failed",
			not_attempted: "not_attempted"
		}[outcome];
		return freezeObject({
			itemId: lessonKey$2(item.resolvedEmail || item.submittedInput, item.marathonLessonId),
			label: `${item.resolvedEmail || item.submittedInput} — ${item.lessonNumber || "?"}. ${item.lessonName}`,
			status,
			code,
			message,
			attempts,
			data: freezeObject({
				submittedEmail: item.submittedInput,
				resolvedEmail: item.resolvedEmail,
				pupilId: item.pupilId,
				marathonPupilId: item.marathonPupilId,
				marathonLessonId: item.marathonLessonId,
				lessonNumber: item.lessonNumber,
				lessonName: item.lessonName,
				preflightAccessState: item.preflightAccessState,
				outcome
			})
		});
	}
	function buildMatrixResults(plan, summary = {}, writeAttempts = /* @__PURE__ */ new Map()) {
		const openedKeys = new Set((Array.isArray(summary.opened) ? summary.opened : []).map((item) => lessonKey$2(item.email, item.marathonLessonId)));
		const failuresByKey = /* @__PURE__ */ new Map();
		for (const failure of Array.isArray(summary.failures) ? summary.failures : []) failuresByKey.set(lessonKey$2(failure.email, failure.marathonLessonId), failure);
		return plan.matrix.map((item) => {
			if (item.plannedOutcome === "already_open") return resultFromMatrix(item, "already_open", 0, "LESSON_ALREADY_OPEN", "Lesson access was already open.");
			if (item.plannedOutcome === "rejected") return resultFromMatrix(item, "rejected", 0, item.code, item.message);
			if (item.plannedOutcome === "not_attempted") return resultFromMatrix(item, "not_attempted", 0, item.code, item.message);
			const key = lessonKey$2(item.resolvedEmail, item.marathonLessonId);
			if (openedKeys.has(key)) return resultFromMatrix(item, "opened", writeAttempts.get(attemptKey(item.marathonPupilId, item.marathonLessonId)) || 1, "LESSON_ACCESS_OPENED", "Lesson access was opened.");
			const failure = failuresByKey.get(key);
			if (failure) return resultFromMatrix(item, REJECTED_WRITE_CODES.has(failure.code) ? "rejected" : "failed", Number.isInteger(failure.attempts) ? failure.attempts : 1, failure.code || "LESSON_ACCESS_WRITE_FAILED", failure.message || "The lesson access change failed.");
			return resultFromMatrix(item, "not_attempted", 0, "LESSON_ACCESS_NOT_ATTEMPTED", "The confirmed combination was not attempted.");
		});
	}
	function inputFailureResults(identities) {
		return identities.filter((identity) => identity.resolution !== "matched").map((identity) => freezeObject({
			itemId: `input:${identity.normalizedEmail || identity.submittedInput}`,
			label: identity.submittedInput,
			status: "rejected",
			code: identity.code,
			message: identity.message,
			attempts: 0,
			data: freezeObject({
				submittedInput: identity.submittedInput,
				normalizedEmail: identity.normalizedEmail,
				resolution: identity.resolution
			})
		}));
	}
	function operationFailureResults(failures) {
		return failures.map((failure, index) => freezeObject({
			itemId: `operation:${index + 1}:${failure.code}`,
			label: failure.kind === "input" ? "Submitted request" : "Lesson-access preflight",
			status: failure.kind === "input" ? "rejected" : "failed",
			code: failure.code,
			message: failure.message,
			attempts: failure.attempts,
			data: freezeObject({ stage: failure.kind === "input" ? "input_validation" : "preflight" })
		}));
	}
	function discoveryFailureResults(failures) {
		return failures.map((failure) => freezeObject({
			itemId: `discovery:${normalizeEmail(failure.resolvedEmail || failure.submittedEmail)}`,
			label: failure.resolvedEmail || failure.submittedEmail,
			status: "failed",
			code: failure.code,
			message: failure.message,
			attempts: failure.attempts,
			data: freezeObject({
				submittedEmail: failure.submittedEmail,
				resolvedEmail: failure.resolvedEmail,
				pupilId: failure.pupilId,
				marathonPupilId: failure.marathonPupilId,
				stage: "lesson_state_discovery"
			})
		}));
	}
	function buildSummary(plan, matrixResults) {
		const matchedUsers = plan.identities.filter((identity) => identity.resolution === "matched").length;
		const countOutcome = (outcome) => matrixResults.filter((result) => result.data.outcome === outcome).length;
		return Object.freeze({
			requestedInputs: plan.identities.length,
			matchedUsers,
			selectedLessons: plan.selectedLessons.length,
			totalCombinations: plan.matrix.length,
			newlyOpened: countOutcome("opened"),
			alreadyOpen: countOutcome("already_open"),
			rejected: countOutcome("rejected"),
			failedWrites: countOutcome("failed"),
			notAttempted: countOutcome("not_attempted"),
			inputFailures: plan.identities.filter((identity) => identity.resolution !== "matched").length,
			discoveryFailures: plan.discoveryFailures.length,
			operationFailures: plan.operationFailures.length
		});
	}
	function inferTerminalStatus$3(explicitStatus, operationSummary) {
		if (explicitStatus === "cancelled" || explicitStatus === "interrupted") return explicitStatus;
		return operationSummary.rejected > 0 || operationSummary.failedWrites > 0 || operationSummary.notAttempted > 0 || operationSummary.inputFailures > 0 || operationSummary.discoveryFailures > 0 || operationSummary.operationFailures > 0 ? "completed_with_failures" : "completed";
	}
	function buildExecutionHistoryInput$6({ plan, summary = {}, writeAttempts = /* @__PURE__ */ new Map(), startedAt, completedAt, marathonId, marathonName = null, terminalStatus = null }) {
		const matrixResults = buildMatrixResults(plan, summary, writeAttempts);
		const inputResults = inputFailureResults(plan.identities);
		const discoveryResults = discoveryFailureResults(plan.discoveryFailures);
		const operationResults = operationFailureResults(plan.operationFailures);
		const operationSummary = buildSummary(plan, matrixResults);
		const attempted = operationSummary.newlyOpened + operationSummary.rejected + operationSummary.failedWrites;
		const failed = operationSummary.rejected + operationSummary.failedWrites;
		return Object.freeze({
			operationType: OPERATION_TYPE$4,
			startedAt,
			completedAt,
			status: inferTerminalStatus$3(terminalStatus, operationSummary),
			pageContext: Object.freeze({
				marathonId,
				marathonName
			}),
			counts: Object.freeze({
				requested: operationSummary.requestedInputs,
				eligible: operationSummary.totalCombinations,
				attempted,
				successful: operationSummary.newlyOpened,
				noOp: operationSummary.alreadyOpen,
				skipped: operationSummary.inputFailures + operationSummary.discoveryFailures + operationSummary.operationFailures,
				failed,
				notAttempted: operationSummary.notAttempted
			}),
			results: Object.freeze([
				...inputResults,
				...operationResults,
				...discoveryResults,
				...matrixResults
			]),
			message: JSON.stringify(operationSummary)
		});
	}
	//#endregion
	//#region src/features/batch-lesson-access-history.js
	var { createCapture, recordWriteAttempt, observeRequest, sanitizeLesson, buildObservedPlan } = batch_lesson_access_history_model_exports;
	var { buildExecutionHistoryInput: buildExecutionHistoryInput$5 } = batch_lesson_access_history_record_exports;
	function appendStatus$2(dialog, message, isError = false) {
		const current = dialog.elements?.status?.textContent || "";
		dialog.setStatus?.(`${current}${current ? " " : ""}${message}`, isError ? "error" : "");
	}
	function addHistoryButton$2(dialog, executionId, openHistory) {
		dialog.shadowRoot?.querySelector?.(".edvibe-batch-access-history")?.remove?.();
		const button = (dialog.ownerDocument || globalThis.document)?.createElement?.("button");
		if (!button) return;
		button.type = "button";
		button.className = "edvibe-batch-access-history";
		button.textContent = "Открыть в истории";
		button.addEventListener("click", () => {
			dialog.close?.();
			openHistory(executionId);
		});
		dialog.elements?.footer?.appendChild?.(button);
	}
	function createHistoryAwareFeature$1(options = {}) {
		const { createFeature = createBatchLessonAccessFeature, sendRequest, createDialog, persistExecution, openHistory = () => {}, getLocationHref = () => "", getMarathonName = () => null, now = () => /* @__PURE__ */ new Date(), log = () => {}, ...featureOptions } = options;
		if (typeof createFeature !== "function") throw new TypeError("createFeature is required");
		if (typeof sendRequest !== "function") throw new TypeError("sendRequest is required");
		if (typeof createDialog !== "function") throw new TypeError("createDialog is required");
		if (typeof persistExecution !== "function") throw new TypeError("persistExecution is required");
		let capture = null;
		async function trackedSendRequest(controller, method, projectName, value) {
			const current = capture;
			if (current) recordWriteAttempt(current, method, value);
			const result = await sendRequest(controller, method, projectName, value);
			if (current) observeRequest(current, method, value, result);
			return result;
		}
		function createTrackedDialog() {
			const dialog = createDialog();
			const current = createCapture();
			capture = current;
			const originalShowConfigure = dialog.showConfigure.bind(dialog);
			const originalShowConfirmation = dialog.showConfirmation.bind(dialog);
			const originalShowValidationErrors = dialog.showValidationErrors.bind(dialog);
			const originalShowComplete = dialog.showComplete.bind(dialog);
			const originalShowFatalError = dialog.showFatalError.bind(dialog);
			function startAttempt(detail = {}) {
				current.sequence += 1;
				current.writeAttempts.clear();
				current.attempt = {
					sequence: current.sequence,
					startedAt: now().toISOString(),
					submittedEmailInput: String(detail.emailInput || ""),
					selectedLessonIds: Array.isArray(detail.selectedLessonIds) ? [...detail.selectedLessonIds] : [],
					plan: null,
					terminal: false
				};
				dialog.shadowRoot?.querySelector?.(".edvibe-batch-access-history")?.remove?.();
			}
			function buildPlan(errors = []) {
				const attempt = current.attempt;
				if (!attempt) return null;
				return buildObservedPlan({
					submittedEmailInput: attempt.submittedEmailInput,
					selectedLessonIds: attempt.selectedLessonIds,
					pupils: current.pupils,
					lessonsByPupilId: current.lessonsByPupilId,
					lessonCatalogue: current.lessonCatalogue,
					errors
				});
			}
			function persist(summary, terminalStatus, errors = []) {
				const attempt = current.attempt;
				if (!attempt || attempt.terminal) return;
				attempt.terminal = true;
				const sequence = attempt.sequence;
				let input;
				try {
					const completedAt = now().toISOString();
					const plan = attempt.plan || buildPlan(errors);
					if (!plan) return;
					input = buildExecutionHistoryInput$5({
						plan,
						summary,
						writeAttempts: current.writeAttempts,
						startedAt: attempt.startedAt,
						completedAt,
						marathonId: parseMarathonId$3(getLocationHref()),
						marathonName: getMarathonName(),
						terminalStatus
					});
				} catch (error) {
					appendStatus$2(dialog, "Экранный результат сохранён, но записать историю не удалось.", true);
					log("Batch lesson access history record creation failed:", error);
					return;
				}
				Promise.resolve().then(() => persistExecution(input)).then((history) => {
					if (sequence !== current.sequence) return;
					if (history?.stored) {
						appendStatus$2(dialog, "Результат сохранён в истории.");
						if (history.record?.id) addHistoryButton$2(dialog, history.record.id, openHistory);
					} else {
						appendStatus$2(dialog, "Экранный результат сохранён, но записать историю не удалось.", true);
						if (history?.persistenceError) log("Batch lesson access history persistence failed:", history.persistenceError);
					}
				}).catch((error) => {
					if (sequence !== current.sequence) return;
					appendStatus$2(dialog, "Экранный результат сохранён, но записать историю не удалось.", true);
					log("Batch lesson access history persistence failed:", error);
				});
			}
			dialog.showConfigure = (value = {}) => {
				current.lessonCatalogue = Array.isArray(value.lessons) ? value.lessons.map(sanitizeLesson) : [];
				current.attempt = null;
				current.sequence += 1;
				return originalShowConfigure(value);
			};
			dialog.showConfirmation = (value = {}) => {
				if (current.attempt) current.attempt.plan = buildPlan();
				return originalShowConfirmation(value);
			};
			dialog.showValidationErrors = (errors = []) => {
				const output = originalShowValidationErrors(errors);
				if (current.attempt) persist({}, null, Array.isArray(errors) ? errors : [errors]);
				return output;
			};
			dialog.showComplete = (summary = {}) => {
				const output = originalShowComplete(summary);
				if (current.attempt) {
					if (!current.attempt.plan) current.attempt.plan = buildPlan();
					persist(summary, (summary.failures || []).some((failure) => failure?.code === "INTERNAL_ERROR") ? "interrupted" : null);
				}
				return output;
			};
			dialog.showFatalError = (error) => {
				const output = originalShowFatalError(error);
				if (current.attempt) persist({}, "interrupted", [error]);
				return output;
			};
			dialog.addEventListener("edvibe-batch-access-submit", (event) => startAttempt(event?.detail));
			dialog.addEventListener("edvibe-batch-access-restart", () => {
				current.sequence += 1;
				current.attempt = null;
				dialog.shadowRoot?.querySelector?.(".edvibe-batch-access-history")?.remove?.();
			});
			dialog.addEventListener("edvibe-dialog-close", () => {
				if (current.attempt?.plan && !current.attempt.terminal) persist({}, "cancelled");
			});
			return dialog;
		}
		return createFeature({
			...featureOptions,
			sendRequest: trackedSendRequest,
			createDialog: createTrackedDialog,
			log
		});
	}
	//#endregion
	//#region src/components/batch-lesson-access-dialog.styles.js
	var batchLessonAccessDialogStyles = i$3`
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

`;
	//#endregion
	//#region src/components/batch-lesson-access-dialog.js
	var BATCH_ACCESS_DIALOG_TAG = "edvibe-toolbox-batch-access-dialog";
	var BATCH_ACCESS_OVERLAY_ID = "edvibe-toolbox-batch-access-overlay";
	var BatchLessonAccessDialog = class extends i {
		static styles = [
			componentFoundationStyles,
			dialogFoundationStyles,
			batchLessonAccessDialogStyles
		];
		static properties = {
			lessons: { state: true },
			selectedLessonIds: { state: true },
			emailState: { state: true },
			emailInput: { state: true },
			mode: { state: true },
			statusMessage: { state: true },
			statusError: { state: true },
			errors: { state: true },
			summaryLines: { state: true },
			failures: { state: true },
			progress: { state: true }
		};
		constructor() {
			super();
			this.lessons = [];
			this.selectedLessonIds = /* @__PURE__ */ new Set();
			this.emailState = {
				validCount: 0,
				malformedCount: 0
			};
			this.emailInput = "";
			this.mode = "initializing";
			this.statusMessage = "";
			this.statusError = false;
			this.errors = [];
			this.summaryLines = [];
			this.failures = [];
			this.progress = {
				visible: false,
				indeterminate: false,
				completed: 0,
				total: 0
			};
			this.handleKeydownBound = (event) => this.handleKeydown(event);
		}
		connectedCallback() {
			super.connectedCallback();
			if (!this.id) this.id = BATCH_ACCESS_OVERLAY_ID;
			this.ownerDocument?.addEventListener("keydown", this.handleKeydownBound);
		}
		disconnectedCallback() {
			this.ownerDocument?.removeEventListener("keydown", this.handleKeydownBound);
			super.disconnectedCallback();
		}
		configure(options = {}) {
			options = options && typeof options === "object" ? options : {};
			if (options.lessons !== void 0 || options.emailState !== void 0) this.showConfigure(options);
			return this;
		}
		setEmailState(state = {}) {
			state = state && typeof state === "object" ? state : {};
			this.emailState = {
				validCount: Math.max(0, Number(state.validCount) || 0),
				malformedCount: Math.max(0, Number(state.malformedCount) || 0)
			};
			return this;
		}
		showConfigure(options = {}) {
			if (Array.isArray(options)) options = { lessons: options };
			options = options && typeof options === "object" ? options : {};
			if (Array.isArray(options.lessons)) {
				this.lessons = options.lessons;
				this.selectedLessonIds = /* @__PURE__ */ new Set();
			}
			if (options.emailInput !== void 0) this.emailInput = String(options.emailInput || "");
			this.mode = "configure";
			this.clearMessages();
			this.progress = {
				visible: false,
				indeterminate: false,
				completed: 0,
				total: 0
			};
			if (options.emailState !== void 0) this.setEmailState(options.emailState);
			return this;
		}
		showLoading(message = "Загружаем уроки…") {
			this.mode = "loading";
			this.clearMessages();
			this.setStatus(message);
			this.progress = {
				visible: true,
				indeterminate: true,
				completed: 0,
				total: 0
			};
			return this;
		}
		showValidation(message = "Проверяем данные…") {
			this.mode = "validating";
			this.clearMessages();
			this.progress = {
				visible: false,
				indeterminate: false,
				completed: 0,
				total: 0
			};
			this.setStatus(message);
			return this;
		}
		showValidationErrors(errors = []) {
			this.mode = "validation-error";
			this.errors = this.normalizeErrors(errors);
			this.summaryLines = [];
			this.failures = [];
			this.progress = {
				visible: false,
				indeterminate: false,
				completed: 0,
				total: 0
			};
			this.setStatus("Исправьте ошибки и повторите проверку.", "error");
			return this;
		}
		showConfirmation(plan = {}) {
			this.mode = "confirm";
			this.clearMessages();
			const pending = this.count(plan.needsOpening, plan.pendingCount);
			const alreadyOpen = this.count(plan.alreadyOpen, plan.alreadyOpenCount);
			const selectedLessons = this.count(plan.selectedLessons, plan.selectedLessonCount);
			const matchedUsers = this.count(plan.matchedUsers, plan.matchedUserCount);
			this.summaryLines = [
				`${matchedUsers} пользователей сопоставлено`,
				`${selectedLessons} уроков выбрано`,
				`${pending} доступов нужно открыть`,
				`${alreadyOpen} уже открыт${alreadyOpen === 1 ? "" : "о"} и будет пропущено`
			];
			this.setStatus("Подтвердите открытие доступа.");
			return this;
		}
		showExecution(progress = {}) {
			this.mode = "executing";
			const completed = Math.max(0, Number(progress.completed) || 0);
			const total = Math.max(0, Number(progress.total) || 0);
			const opened = Math.max(0, Number(progress.opened) || 0);
			const failures = Math.max(0, Number(progress.failures) || 0);
			const alreadyOpen = Math.max(0, Number(progress.alreadyOpen) || 0);
			this.progress = {
				visible: true,
				indeterminate: false,
				completed,
				total
			};
			const current = progress.current?.email && progress.current?.lessonName ? ` Сейчас: ${progress.current.email} — ${progress.current.lessonName}.` : "";
			this.setStatus(`Выполнено: ${completed} из ${total}. Открыто: ${opened}. Ошибок: ${failures}. Уже открыто: ${alreadyOpen}.${current}`);
			return this;
		}
		showComplete(summary = {}) {
			const failures = Array.isArray(summary.failures) ? summary.failures : [];
			this.mode = failures.length ? "partial-complete" : "complete";
			this.clearMessages();
			this.progress = {
				visible: false,
				indeterminate: false,
				completed: 0,
				total: 0
			};
			this.summaryLines = [
				`Email запрошено: ${this.count(summary.requestedEmails, summary.requestedEmailCount)}`,
				`Пользователей сопоставлено: ${this.count(summary.matchedUsers, summary.matchedUserCount)}`,
				`Уроков выбрано: ${this.count(summary.selectedLessons, summary.selectedLessonCount)}`,
				`Доступов открыто: ${this.count(summary.opened, summary.openedCount)}`,
				`Уже открыто: ${this.count(summary.alreadyOpen, summary.alreadyOpenCount)}`,
				`Ошибок: ${this.count(failures, summary.failureCount)}`,
				`Попыток запросов: ${Math.max(0, Number(summary.attempts) || 0)}`
			];
			this.failures = failures;
			this.setStatus(failures.length ? "Завершено с ошибками. Скопируйте отчёт для подробностей." : "Готово.");
			return this;
		}
		showFatalError(error) {
			this.mode = "fatal-error";
			this.clearMessages();
			this.errors = this.normalizeErrors([error]);
			this.setStatus("Не удалось подготовить пакетное открытие доступа.", "error");
			return this;
		}
		normalizeErrors(errors) {
			return (Array.isArray(errors) ? errors : [errors]).map((error) => typeof error === "string" ? error : String(error?.message || "Неизвестная ошибка."));
		}
		clearMessages() {
			this.errors = [];
			this.summaryLines = [];
			this.failures = [];
			this.statusMessage = "";
			this.statusError = false;
		}
		setStatus(message, state = "") {
			this.statusMessage = String(message || "");
			this.statusError = state === "error";
		}
		isEditingLocked() {
			return [
				"validating",
				"confirm",
				"executing",
				"fatal-error"
			].includes(this.mode);
		}
		isLessonSelectionLocked() {
			return this.mode === "loading" || this.isEditingLocked();
		}
		canClose() {
			return [
				"configure",
				"validation-error",
				"complete",
				"partial-complete",
				"fatal-error"
			].includes(this.mode);
		}
		canSubmit() {
			return (this.mode === "configure" || this.mode === "validation-error") && this.emailState.validCount > 0 && this.selectedLessonIds.size > 0;
		}
		selectLesson(lessonId, selected) {
			if (this.isLessonSelectionLocked()) return;
			const next = new Set(this.selectedLessonIds);
			if (selected) next.add(lessonId);
			else next.delete(lessonId);
			this.selectedLessonIds = next;
		}
		handleInput(event) {
			this.emailInput = String(event.currentTarget.value || "");
			this.dispatchEvent(new CustomEvent("edvibe-batch-access-input-change", { detail: { emailInput: this.emailInput } }));
		}
		handleSelectAll(event) {
			if (this.isLessonSelectionLocked()) return;
			this.selectedLessonIds = event.currentTarget.checked ? new Set(this.lessons.map((lesson) => lesson.MarathonLessonId)) : /* @__PURE__ */ new Set();
		}
		handleClearAll() {
			if (this.isLessonSelectionLocked()) return;
			this.selectedLessonIds = /* @__PURE__ */ new Set();
		}
		handleSubmit() {
			if (!this.canSubmit()) return;
			this.dispatchEvent(new CustomEvent("edvibe-batch-access-submit", { detail: {
				emailInput: this.emailInput,
				selectedLessonIds: [...this.selectedLessonIds]
			} }));
		}
		handleConfirm() {
			if (this.mode === "confirm") this.dispatchEvent(new CustomEvent("edvibe-batch-access-confirm"));
		}
		handleCopy() {
			if (["complete", "partial-complete"].includes(this.mode)) this.dispatchEvent(new CustomEvent("edvibe-batch-access-copy-report"));
		}
		handleRestart() {
			if (!["complete", "partial-complete"].includes(this.mode)) return;
			this.mode = "configure";
			this.selectedLessonIds = /* @__PURE__ */ new Set();
			this.emailInput = "";
			this.setEmailState({
				validCount: 0,
				malformedCount: 0
			});
			this.clearMessages();
			this.progress = {
				visible: false,
				indeterminate: false,
				completed: 0,
				total: 0
			};
			this.dispatchEvent(new CustomEvent("edvibe-batch-access-restart"));
		}
		handleBackdropClick(event) {
			if (event.target === event.currentTarget) this.close();
		}
		handleKeydown(event) {
			if (event.key === "Escape") this.close();
		}
		close() {
			if (!this.canClose()) return;
			this.dispatchEvent(new CustomEvent("edvibe-dialog-close"));
			this.remove();
		}
		count(value, fallback) {
			if (Array.isArray(value)) return value.length;
			if (Number.isFinite(Number(value))) return Math.max(0, Number(value));
			return Math.max(0, Number(fallback) || 0);
		}
		renderLesson(lesson, locked) {
			const lessonId = lesson.MarathonLessonId;
			return b`
            <label class="edvibe-batch-access-lesson">
                ${Number(lesson.Number) + 1}. ${lesson.Name || "Без названия"}
                <input type="checkbox" .value=${String(lessonId)}
                    .checked=${this.selectedLessonIds.has(lessonId)} ?disabled=${locked}
                    @change=${(event) => this.selectLesson(lessonId, event.currentTarget.checked)}>
            </label>
        `;
		}
		renderFailure(failure) {
			const lessonNumber = Math.max(0, Number(failure?.lessonNumber) || 0);
			const attempts = Math.max(0, Number(failure?.attempts) || 0);
			return b`<p class="edvibe-batch-access-failure">
            ${String(failure?.email || "Email отсутствует")} —
            ${lessonNumber}. ${String(failure?.lessonName || "Урок без названия")} —
            ${attempts} попытки — ${String(failure?.code || "UNKNOWN_ERROR")}:
            ${String(failure?.message || "Неизвестная ошибка.")}
        </p>`;
		}
		render() {
			const editingLocked = this.isEditingLocked();
			const lessonsLocked = this.isLessonSelectionLocked() || this.mode === "fatal-error";
			const completed = ["complete", "partial-complete"].includes(this.mode);
			const selected = this.selectedLessonIds.size;
			const lessonCount = this.lessons.length;
			const allSelected = lessonCount > 0 && selected === lessonCount;
			const someSelected = selected > 0 && selected < lessonCount;
			const progressValue = this.progress.indeterminate ? A : this.progress.completed;
			const statusClass = `edvibe-batch-access-status${this.statusError ? " is-error" : ""}`;
			return b`
<div class="edvibe-batch-access-overlay" @click=${this.handleBackdropClick}>
                <section class="edvibe-batch-access-card" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-access-title">
                    <header class="edvibe-batch-access-header">
                        <div><h2 id="edvibe-batch-access-title">Открыть доступ к урокам</h2>
                            <p class="edvibe-batch-access-description">Укажите email учеников и выберите уроки.</p></div>
                        <button class="edvibe-batch-access-close" type="button" aria-label="Закрыть"
                            ?disabled=${!this.canClose()} @click=${() => this.close()}>&times;</button>
                    </header>
                    <div class="edvibe-batch-access-body">
                        <section class="edvibe-batch-access-configure">
                            <label for="edvibe-batch-access-emails">Email учеников</label>
                            <textarea id="edvibe-batch-access-emails" class="edvibe-batch-access-emails"
                                rows="5" placeholder="user@example.com" .value=${this.emailInput}
                                ?disabled=${editingLocked || this.mode === "fatal-error"}
                                @input=${this.handleInput}></textarea>
                            <div class="edvibe-batch-access-email-state" aria-live="polite">
                                <span class="edvibe-batch-access-email-count">Уникальных email: ${this.emailState.validCount}</span>
                                <span class="edvibe-batch-access-malformed-count">Некорректных: ${this.emailState.malformedCount}</span>
                            </div>
                            <div class="edvibe-batch-access-lesson-heading"><h3>Уроки</h3>
                                <div class="edvibe-batch-access-selection-actions">
                                    <label><input class="edvibe-batch-access-select-all" type="checkbox"
                                        .checked=${allSelected} .indeterminate=${someSelected}
                                        ?disabled=${lessonsLocked || lessonCount === 0}
                                        @change=${this.handleSelectAll}>Выбрать все</label>
                                    <button class="edvibe-batch-access-clear-all" type="button"
                                        ?disabled=${editingLocked || selected === 0}
                                        @click=${this.handleClearAll}>Очистить выбор</button>
                                </div>
                            </div>
                            <div class="edvibe-batch-access-lessons" aria-label="Список уроков">
                                ${lessonCount === 0 ? b`<p class="edvibe-batch-access-empty">Уроки не найдены.</p>` : this.lessons.map((lesson) => this.renderLesson(lesson, lessonsLocked))}
                            </div>
                        </section>
                        <section class="edvibe-batch-access-errors" aria-live="polite" ?hidden=${this.errors.length === 0}>
                            ${this.errors.map((error) => b`<p class="edvibe-batch-access-error">${error}</p>`)}
                        </section>
                        <section class="edvibe-batch-access-summary" aria-live="polite" ?hidden=${this.summaryLines.length === 0}>
                            ${this.summaryLines.join("\n")}
                        </section>
                        <section class="edvibe-batch-access-failures" aria-live="polite" ?hidden=${this.failures.length === 0}>
                            ${this.failures.map((failure) => this.renderFailure(failure))}
                        </section>
                    </div>
                    <div class="edvibe-batch-access-live-region">
                        <span class="edvibe-batch-access-loading-indicator" role="img" aria-label="Загрузка уроков"
                            ?hidden=${this.mode !== "loading"}></span>
                        <p class=${statusClass} role="status" aria-live="polite">${this.statusMessage}</p>
                        <progress class="edvibe-batch-access-progress" max=${this.progress.total}
                            value=${progressValue} ?hidden=${!this.progress.visible}
                            aria-label=${this.progress.indeterminate ? "Загрузка уроков" : A}></progress>
                    </div>
                    <footer class="edvibe-batch-access-footer">
                        <button class="edvibe-batch-access-copy" type="button" ?hidden=${!completed}
                            ?disabled=${!completed} @click=${this.handleCopy}>Копировать отчёт</button>
                        <button class="edvibe-batch-access-restart" type="button" ?hidden=${!completed}
                            ?disabled=${!completed} @click=${this.handleRestart}>Запустить другую группу</button>
                        <button class="edvibe-batch-access-confirm" type="button" ?hidden=${this.mode !== "confirm"}
                            ?disabled=${this.mode !== "confirm"} @click=${this.handleConfirm}>Подтвердить открытие доступа</button>
                        <button class="edvibe-batch-access-submit" type="button"
                            ?hidden=${!["configure", "validation-error"].includes(this.mode)}
                            ?disabled=${!this.canSubmit()} @click=${this.handleSubmit}>Проверить и открыть доступ</button>
                    </footer>
                </section>
            </div>
        `;
		}
	};
	if (!customElements.get("edvibe-toolbox-batch-access-dialog")) customElements.define(BATCH_ACCESS_DIALOG_TAG, BatchLessonAccessDialog);
	globalThis.EdVibeBatchAccessDialogComponent = {
		BATCH_ACCESS_DIALOG_TAG,
		BATCH_ACCESS_OVERLAY_ID,
		BatchLessonAccessDialog
	};
	//#endregion
	//#region src/features/batch-user-management.js
	var USER_MANAGEMENT_DIALOG_TAG$1 = "edvibe-toolbox-batch-user-management-dialog";
	function parseEmailInput(value) {
		return parseEmailInput$1(value, { includeItems: true });
	}
	function resolveUsersByEmail(entries, pupils) {
		const pupilsByEmail = /* @__PURE__ */ new Map();
		for (const pupil of Array.isArray(pupils) ? pupils : []) {
			const email = String(pupil?.Email || "").trim().toLowerCase();
			const candidates = pupilsByEmail.get(email) || [];
			candidates.push(pupil);
			pupilsByEmail.set(email, candidates);
		}
		const rows = [];
		const errors = [];
		for (const entry of Array.isArray(entries) ? entries : []) {
			const candidates = pupilsByEmail.get(entry.normalized) || [];
			if (candidates.length === 1) {
				rows.push({
					email: entry.input,
					normalizedEmail: entry.normalized,
					pupil: candidates[0],
					status: "matched",
					message: ""
				});
				continue;
			}
			const type = candidates.length === 0 ? "missing" : "ambiguous";
			const message = candidates.length === 0 ? `No marathon pupil found for ${entry.input}.` : `Multiple marathon pupils found for ${entry.input}.`;
			rows.push({
				email: entry.input,
				normalizedEmail: entry.normalized,
				pupil: null,
				status: type,
				message
			});
			errors.push({
				type,
				input: entry.input,
				count: candidates.length,
				message
			});
		}
		return {
			rows,
			errors
		};
	}
	function buildUserPlan({ rows }) {
		return (Array.isArray(rows) ? rows : []).map((row) => {
			const matched = row.status === "matched" && row.pupil;
			const hasCurator = Boolean(matched && Array.isArray(row.pupil.Moderators) && row.pupil.Moderators.length > 0);
			return {
				email: row.email,
				normalizedEmail: row.normalizedEmail,
				pupil: matched ? row.pupil : null,
				marathonPupilId: matched ? row.pupil.MarathonPupilId : null,
				hasCurator,
				actionable: Boolean(matched),
				status: row.status,
				message: row.message,
				unassignSelected: false,
				deleteSelected: false,
				unassign: null,
				delete: null,
				result: {
					status: "pending",
					message: matched ? "Not started" : row.message
				}
			};
		});
	}
	function cloneUserRow(row) {
		return {
			...row,
			unassign: null,
			delete: null,
			result: { ...row.result }
		};
	}
	function createOperationFailure(error) {
		return {
			status: "failed",
			attempts: error?.attempts || 1,
			code: error?.code || "UNKNOWN_ERROR",
			message: error?.message || "The operation failed."
		};
	}
	function createSuccessOperation(attempts) {
		return {
			status: "success",
			attempts
		};
	}
	function createNoopOperation() {
		return {
			status: "noop",
			attempts: 0,
			message: "No curator was assigned."
		};
	}
	function createSkippedOperation(message) {
		return {
			status: "skipped",
			attempts: 0,
			message
		};
	}
	function getSelectedOperations(row) {
		const operations = [];
		if (row.unassignSelected) operations.push("unassign");
		if (row.deleteSelected) operations.push("delete");
		return operations;
	}
	function describeOperation(operation, result) {
		if (!result) return "";
		if (operation === "unassign") {
			if (result.status === "noop") return "Curator already absent";
			if (result.status === "success") return "Curator removed";
			return `Curator removal failed (${result.code || "UNKNOWN_ERROR"}): ${result.message || "The operation failed."}`;
		}
		if (result.status === "success") return "User deleted";
		if (result.status === "skipped") return `Deletion skipped: ${result.message || "The operation was skipped."}`;
		return `Deletion failed (${result.code || "UNKNOWN_ERROR"}): ${result.message || "The operation failed."}`;
	}
	function setRowResult(row) {
		const operations = getSelectedOperations(row);
		row.result = {
			status: operations.some((operation) => row[operation]?.status === "failed") ? "failed" : "success",
			message: operations.map((operation) => describeOperation(operation, row[operation])).filter(Boolean).join("; ")
		};
	}
	async function executeUserPlan({ marathonId, rows, sendRequest, wait, getConnectionState, onProgress = () => {} }) {
		const executionRows = (Array.isArray(rows) ? rows : []).filter((row) => row.actionable !== false && getSelectedOperations(row).length > 0).map(cloneUserRow);
		const total = executionRows.length;
		let completed = 0;
		let successes = 0;
		let failures = 0;
		let attempts = 0;
		function report(row, operation) {
			try {
				onProgress(Object.freeze({
					completed,
					total,
					successes,
					failures,
					current: Object.freeze({
						email: row.email,
						operation
					})
				}));
			} catch (_) {}
		}
		for (const row of executionRows) {
			const selectedOperations = getSelectedOperations(row);
			try {
				if (row.unassignSelected) {
					report(row, "unassign");
					if (!row.hasCurator) row.unassign = createNoopOperation();
					else try {
						const result = await runWithRetry(async () => {
							const response = await sendRequest("MarathonPupilsWsController", "AddModeratorsToPupil", "Marathons", {
								MarathonId: marathonId,
								MarathonPupilId: row.marathonPupilId,
								SelectedModeratorsIds: []
							});
							if (response?.Value?.IsSuccess !== true) throw createFeatureError("INVALID_RESPONSE", "The curator removal was not confirmed.");
							return response;
						}, {
							wait,
							getConnectionState
						});
						row.unassign = createSuccessOperation(result.attempts);
						attempts += result.attempts;
					} catch (error) {
						row.unassign = createOperationFailure(error);
						attempts += row.unassign.attempts;
					}
				}
				if (row.deleteSelected) if (row.unassign?.status === "failed") row.delete = createSkippedOperation("Skipped because curator removal failed.");
				else {
					report(row, "delete");
					try {
						const result = await runWithRetry(async () => {
							const response = await sendRequest("MarathonPupilsWsController", "DeleteMarathonPupil", "Marathons", { MarathonPupilId: row.marathonPupilId });
							if (response?.Value !== row.marathonPupilId) throw createFeatureError("INVALID_RESPONSE", "The user deletion was not confirmed.");
							return response;
						}, {
							wait,
							getConnectionState
						});
						row.delete = createSuccessOperation(result.attempts);
						attempts += result.attempts;
					} catch (error) {
						row.delete = createOperationFailure(error);
						attempts += row.delete.attempts;
					}
				}
			} catch (error) {
				const operation = row.unassign?.status !== "success" && row.unassign?.status !== "noop" ? "unassign" : "delete";
				row[operation] ||= createOperationFailure(error);
			}
			setRowResult(row);
			if (row.result.status === "failed") failures += 1;
			else successes += 1;
			completed += 1;
			report(row, row.delete?.status === "skipped" ? "unassign" : selectedOperations[selectedOperations.length - 1]);
		}
		return {
			rows: executionRows,
			completed,
			total,
			successes,
			failures,
			attempts
		};
	}
	function createInputErrors(parsed) {
		if (parsed.entries.length === 0 && parsed.malformed.length === 0) return [createFeatureError("EMAILS_REQUIRED", "Enter at least one email address.")];
		return [];
	}
	function orderResolvedRows(parsed, resolution) {
		const resolvedRows = new Map(resolution.rows.map((row) => [row.normalizedEmail, row]));
		return parsed.items.map((item) => item.isValid ? resolvedRows.get(item.normalized) : {
			email: item.input,
			normalizedEmail: item.normalized,
			pupil: null,
			status: "malformed",
			message: `Invalid email address: ${item.input}.`
		});
	}
	function createBatchUserManagementFeature({ sendRequest, getConnectionState, wait, canStart, onActiveChange, createDialog = () => document.createElement(USER_MANAGEMENT_DIALOG_TAG$1), log = () => {} }) {
		let active = false;
		let running = false;
		let pupils = [];
		let currentRows = [];
		let marathonId = null;
		let dialog = null;
		function releaseOperation() {
			if (!active) return;
			active = false;
			onActiveChange(false);
		}
		function handleClose() {
			running = false;
			pupils = [];
			currentRows = [];
			marathonId = null;
			dialog = null;
			releaseOperation();
		}
		function getErrorCode(error) {
			return typeof error?.code === "string" ? error.code : "UNKNOWN_ERROR";
		}
		function handleInput(event) {
			const parsed = parseEmailInput(event?.detail?.emailInput);
			dialog.setEmailState({
				validCount: parsed.entries.length,
				malformedCount: parsed.malformed.length
			});
		}
		function applySelections(rows) {
			const selectionsByEmail = new Map((Array.isArray(rows) ? rows : []).map((row) => [row.normalizedEmail, {
				unassignSelected: Boolean(row.unassignSelected),
				deleteSelected: Boolean(row.deleteSelected)
			}]));
			return currentRows.map((row) => ({
				...row,
				...selectionsByEmail.get(row.normalizedEmail) || {
					unassignSelected: false,
					deleteSelected: false
				},
				result: { ...row.result }
			}));
		}
		function updateCachedPupils(executedRows) {
			const deletedIds = new Set(executedRows.filter((row) => row.delete?.status === "success").map((row) => row.marathonPupilId));
			const unassignedIds = new Set(executedRows.filter((row) => row.unassign?.status === "success" || row.unassign?.status === "noop").map((row) => row.marathonPupilId));
			pupils = pupils.filter((pupil) => !deletedIds.has(pupil.MarathonPupilId)).map((pupil) => unassignedIds.has(pupil.MarathonPupilId) ? {
				...pupil,
				Moderators: []
			} : pupil);
		}
		async function handleCheck(event) {
			if (running) return;
			running = true;
			try {
				const parsed = parseEmailInput(event?.detail?.emailInput);
				const inputErrors = createInputErrors(parsed);
				if (inputErrors.length > 0) {
					dialog.showValidationErrors(inputErrors);
					return;
				}
				dialog.showChecking("Проверяем пользователей…");
				currentRows = buildUserPlan({ rows: orderResolvedRows(parsed, resolveUsersByEmail(parsed.entries, pupils)) });
				dialog.showReview({ rows: currentRows });
				log(`Batch user management checked ${currentRows.length} row(s) for MarathonId ${marathonId}.`);
			} catch (error) {
				dialog.showValidationErrors([error]);
			} finally {
				running = false;
			}
		}
		function handleSelectionChange(event) {
			if (Array.isArray(event?.detail?.rows)) currentRows = applySelections(event.detail.rows);
		}
		async function handleStart(event) {
			if (running) return;
			const selectedRows = applySelections(event?.detail?.rows || currentRows);
			if (!selectedRows.some((row) => row.actionable !== false && (row.unassignSelected || row.deleteSelected))) return;
			running = true;
			try {
				const result = await executeUserPlan({
					marathonId,
					rows: selectedRows,
					sendRequest,
					wait,
					getConnectionState,
					onProgress: (progress) => dialog.showExecution(progress)
				});
				const completedByEmail = new Map(result.rows.map((row) => [row.normalizedEmail, row]));
				updateCachedPupils(result.rows);
				currentRows = selectedRows.map((row) => completedByEmail.get(row.normalizedEmail) || row);
				dialog.showComplete({
					...result,
					rows: currentRows
				});
			} catch (error) {
				dialog.showComplete({
					rows: currentRows,
					completed: 0,
					total: 0,
					successes: 0,
					failures: 1,
					attempts: error?.attempts || 1,
					error
				});
			} finally {
				running = false;
			}
		}
		function handleRestart() {
			currentRows = [];
			running = false;
		}
		async function open() {
			if (active || document.getElementById("edvibe-toolbox-batch-user-management-overlay")) return;
			if (!canStart()) {
				window.alert("Another Edvibe Toolbox operation is already running.");
				return;
			}
			marathonId = parseMarathonId$3(window.location.href);
			if (!marathonId) {
				window.alert("Open an Edvibe marathon page before managing users.");
				return;
			}
			active = true;
			onActiveChange(true);
			try {
				dialog = createDialog();
				dialog.addEventListener("edvibe-dialog-close", handleClose);
				dialog.addEventListener("edvibe-batch-user-management-input-change", handleInput);
				dialog.addEventListener("edvibe-batch-user-management-check", handleCheck);
				dialog.addEventListener("edvibe-batch-user-management-selection-change", handleSelectionChange);
				dialog.addEventListener("edvibe-batch-user-management-start", handleStart);
				dialog.addEventListener("edvibe-batch-user-management-restart", handleRestart);
				dialog.configure();
				(document.body || document.documentElement).appendChild(dialog);
				dialog.showChecking("Загружаем пользователей…");
				log(`Initializing batch user management for MarathonId ${marathonId}.`);
				pupils = await loadAllPupils({
					sendRequest,
					marathonId
				});
				if (pupils.length === 0) throw createFeatureError("EMPTY_ROSTER", "No pupils were found in this marathon.");
				dialog.showConfigure();
			} catch (error) {
				log(`Batch user management initialization failed for MarathonId ${marathonId} (${getErrorCode(error)}).`);
				try {
					dialog?.showFatalError?.(error);
				} catch (renderError) {
					log(`Batch user management error rendering failed (${getErrorCode(renderError)}).`);
				} finally {
					releaseOperation();
				}
			}
		}
		return {
			open,
			isRunning: () => running
		};
	}
	//#endregion
	//#region src/features/batch-user-management-history.js
	var OPERATION_TYPE$3 = "batch_user_management";
	var OPERATION_NAMES = Object.freeze({
		unassign: "unassign_curator",
		delete: "delete_user"
	});
	function parseMarathonId$2(url) {
		const match = String(url || "").match(/\/marathon\/(\d+)(?:\/|$)/);
		return match ? String(match[1]) : null;
	}
	function selectedOperations(row) {
		const operations = [];
		if (row?.unassignSelected) operations.push(OPERATION_NAMES.unassign);
		if (row?.deleteSelected) operations.push(OPERATION_NAMES.delete);
		return operations;
	}
	function serializeIdentity(row) {
		const pupil = row?.pupil || {};
		return Object.freeze({
			email: pupil.Email || row?.normalizedEmail || row?.email || null,
			displayName: pupil.DisplayName || pupil.FullName || pupil.Name || null,
			firstName: pupil.FirstName || null,
			lastName: pupil.LastName || null,
			pupilId: pupil.PupilId ?? pupil.Id ?? null,
			marathonPupilId: row?.marathonPupilId ?? pupil.MarathonPupilId ?? null
		});
	}
	function serializeOperation(name, result) {
		if (!result) return Object.freeze({
			name,
			status: "not_attempted",
			attemptCount: 0,
			code: "NOT_ATTEMPTED",
			message: "The operation was not attempted.",
			dependency: null
		});
		const dependencyBlocked = result.status === "skipped" && /curator removal failed/i.test(result.message || "");
		return Object.freeze({
			name,
			status: result.status,
			attemptCount: Number.isInteger(result.attempts) ? result.attempts : 0,
			code: result.code || (dependencyBlocked ? "DEPENDENCY_FAILED" : null),
			message: result.message || null,
			dependency: dependencyBlocked ? Object.freeze({ blockedBy: OPERATION_NAMES.unassign }) : null
		});
	}
	function inferItemStatus(row, operations) {
		if (row?.status !== "matched") return "rejected";
		if (operations.length === 0) return "skipped";
		const values = operations.map((operation) => operation.status);
		if (values.includes("failed")) return "failed";
		if (values.includes("not_attempted")) return "not_attempted";
		if (values.includes("skipped")) return "skipped";
		if (values.every((status) => status === "noop")) return "noop";
		return "success";
	}
	function resultCode$2(row, status) {
		if (status === "rejected") return {
			malformed: "USER_INPUT_MALFORMED",
			missing: "USER_NOT_FOUND",
			ambiguous: "USER_AMBIGUOUS"
		}[row?.status] || "USER_REJECTED";
		return {
			success: "USER_OPERATIONS_COMPLETED",
			noop: "USER_OPERATIONS_NOOP",
			skipped: "USER_OPERATIONS_SKIPPED",
			failed: "USER_OPERATIONS_FAILED",
			not_attempted: "USER_OPERATIONS_NOT_ATTEMPTED"
		}[status];
	}
	function resultMessage$2(row, status, operations) {
		if (status === "rejected") return row?.message || "The submitted user could not be resolved safely.";
		if (operations.length === 0) return "No user-management operation was selected.";
		const messages = operations.map((operation) => operation.message).filter(Boolean);
		if (messages.length > 0) return messages.join("; ");
		return {
			success: "All selected operations completed successfully.",
			noop: "All selected operations were already satisfied.",
			skipped: "One or more selected operations were skipped.",
			failed: "One or more selected operations failed.",
			not_attempted: "One or more selected operations were not attempted."
		}[status];
	}
	function serializeRow(row, index) {
		const names = selectedOperations(row);
		const operations = names.map((name) => name === OPERATION_NAMES.unassign ? serializeOperation(name, row?.unassign) : serializeOperation(name, row?.delete));
		const status = inferItemStatus(row, operations);
		return Object.freeze({
			itemId: row?.normalizedEmail || row?.email || `input-${index + 1}`,
			label: row?.email || row?.normalizedEmail || `Input ${index + 1}`,
			status,
			code: resultCode$2(row, status),
			message: resultMessage$2(row, status, operations),
			attempts: operations.reduce((sum, operation) => sum + operation.attemptCount, 0),
			data: Object.freeze({
				submittedInput: row?.email || null,
				normalizedEmail: row?.normalizedEmail || null,
				resolution: row?.status || "malformed",
				resolutionMessage: row?.message || null,
				user: row?.status === "matched" ? serializeIdentity(row) : null,
				curatorPresent: row?.status === "matched" ? Boolean(row?.hasCurator) : null,
				selectedOperations: Object.freeze(names),
				operations: Object.freeze(operations)
			})
		});
	}
	function buildCounts$2(results) {
		const eligible = results.filter((result) => result.data.resolution === "matched" && result.data.selectedOperations.length > 0).length;
		const notAttempted = results.filter((result) => result.status === "not_attempted").length;
		const attempted = results.filter((result) => result.data.resolution === "matched" && result.data.selectedOperations.length > 0 && result.status !== "not_attempted").length;
		return Object.freeze({
			requested: results.length,
			eligible,
			attempted,
			successful: results.filter((result) => result.status === "success").length,
			noOp: results.filter((result) => result.status === "noop").length,
			skipped: results.filter((result) => result.status === "skipped" || result.status === "rejected").length,
			failed: results.filter((result) => result.status === "failed").length,
			notAttempted
		});
	}
	function inferTerminalStatus$2(summary, results) {
		if (summary?.error) return "interrupted";
		return results.some((result) => result.status === "failed" || result.status === "skipped" || result.status === "rejected") ? "completed_with_failures" : "completed";
	}
	function buildExecutionHistoryInput$4({ rows, summary = {}, startedAt, completedAt, marathonId, marathonName = null }) {
		const results = (Array.isArray(rows) ? rows : []).map(serializeRow);
		const operationCounts = {
			selected: 0,
			attempted: 0,
			successful: 0,
			noOp: 0,
			skipped: 0,
			failed: 0,
			notAttempted: 0
		};
		for (const result of results) for (const operation of result.data.operations) {
			operationCounts.selected += 1;
			if (operation.status !== "not_attempted") operationCounts.attempted += 1;
			if (operation.status === "success") operationCounts.successful += 1;
			if (operation.status === "noop") operationCounts.noOp += 1;
			if (operation.status === "skipped") operationCounts.skipped += 1;
			if (operation.status === "failed") operationCounts.failed += 1;
			if (operation.status === "not_attempted") operationCounts.notAttempted += 1;
		}
		const counts = buildCounts$2(results);
		return Object.freeze({
			operationType: OPERATION_TYPE$3,
			startedAt,
			completedAt,
			status: inferTerminalStatus$2(summary, results),
			pageContext: Object.freeze({
				marathonId,
				marathonName
			}),
			counts,
			results: Object.freeze(results),
			message: JSON.stringify({
				userCounts: counts,
				operationCounts
			})
		});
	}
	function createHistoryAwareDialog$1({ createDialog, persistExecution, openHistory = () => {}, getLocationHref = () => "", getMarathonName = () => null, now = () => /* @__PURE__ */ new Date(), log = () => {} }) {
		if (typeof createDialog !== "function") throw new TypeError("createDialog is required");
		if (typeof persistExecution !== "function") throw new TypeError("persistExecution is required");
		return function createPatchedDialog() {
			const dialog = createDialog();
			let startedAt = null;
			let persistenceSequence = 0;
			const originalShowComplete = dialog.showComplete.bind(dialog);
			const originalShowReview = dialog.showReview.bind(dialog);
			const originalShowConfigure = dialog.showConfigure.bind(dialog);
			function clearHistoryButton() {
				dialog.shadowRoot?.querySelector?.(".edvibe-batch-user-management-history")?.remove?.();
			}
			function appendStatus(message) {
				const current = dialog.elements?.status?.textContent || "";
				dialog.setStatus?.(`${current}${current ? " " : ""}${message}`);
			}
			function addHistoryButton(executionId) {
				clearHistoryButton();
				const button = (dialog.ownerDocument || globalThis.document)?.createElement?.("button");
				if (!button) return;
				button.type = "button";
				button.className = "edvibe-batch-user-management-history";
				button.textContent = "Открыть в истории";
				button.addEventListener("click", () => {
					dialog.close?.();
					openHistory(executionId);
				});
				dialog.elements?.footer?.appendChild?.(button);
				if (!dialog.elements?.footer) dialog.shadowRoot?.querySelector?.(".edvibe-batch-user-management-footer")?.appendChild?.(button);
			}
			dialog.showReview = (value) => {
				startedAt = null;
				persistenceSequence += 1;
				clearHistoryButton();
				return originalShowReview(value);
			};
			dialog.showConfigure = (...args) => {
				startedAt = null;
				persistenceSequence += 1;
				clearHistoryButton();
				return originalShowConfigure(...args);
			};
			dialog.addEventListener("edvibe-batch-user-management-start", () => {
				startedAt = now().toISOString();
				persistenceSequence += 1;
				clearHistoryButton();
			});
			dialog.showComplete = (summary = {}) => {
				const output = originalShowComplete(summary);
				const sequence = persistenceSequence;
				const completedAt = now().toISOString();
				const input = buildExecutionHistoryInput$4({
					rows: summary.rows || dialog.rows,
					summary,
					startedAt: startedAt || completedAt,
					completedAt,
					marathonId: parseMarathonId$2(getLocationHref()),
					marathonName: getMarathonName()
				});
				Promise.resolve().then(() => persistExecution(input)).then((history) => {
					if (sequence !== persistenceSequence) return;
					if (history?.stored) {
						appendStatus("Результат сохранён в истории.");
						if (history.record?.id) addHistoryButton(history.record.id);
					} else {
						appendStatus("Экранный результат сохранён, но записать историю не удалось.");
						if (history?.persistenceError) log("Batch user management history persistence failed:", history.persistenceError);
					}
				}).catch((error) => {
					if (sequence !== persistenceSequence) return;
					appendStatus("Экранный результат сохранён, но записать историю не удалось.");
					log("Batch user management history persistence failed:", error);
				});
				return output;
			};
			return dialog;
		};
	}
	//#endregion
	//#region src/components/batch-user-management-dialog.styles.js
	var batchUserManagementDialogStyles = i$3`
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

`;
	//#endregion
	//#region src/components/batch-user-management-dialog.js
	var USER_MANAGEMENT_DIALOG_TAG = "edvibe-toolbox-batch-user-management-dialog";
	var USER_MANAGEMENT_OVERLAY_ID = "edvibe-toolbox-batch-user-management-overlay";
	var BatchUserManagementDialog = class extends i {
		static styles = [
			componentFoundationStyles,
			dialogFoundationStyles,
			batchUserManagementDialogStyles
		];
		static properties = {
			rows: { state: true },
			emailState: { state: true },
			emailInput: { state: true },
			mode: { state: true },
			errors: { state: true },
			statusMessage: { state: true },
			statusError: { state: true },
			progress: { state: true }
		};
		constructor() {
			super();
			this.rows = [];
			this.emailState = {
				validCount: 0,
				malformedCount: 0
			};
			this.emailInput = "";
			this.mode = "configure";
			this.errors = [];
			this.statusMessage = "";
			this.statusError = false;
			this.progress = {
				visible: false,
				completed: 0,
				total: 0
			};
			this.handleKeydownBound = (event) => this.handleKeydown(event);
		}
		connectedCallback() {
			super.connectedCallback();
			if (!this.id) this.id = USER_MANAGEMENT_OVERLAY_ID;
			this.ownerDocument?.addEventListener("keydown", this.handleKeydownBound);
		}
		disconnectedCallback() {
			this.ownerDocument?.removeEventListener("keydown", this.handleKeydownBound);
			super.disconnectedCallback();
		}
		configure(options = {}) {
			options = options && typeof options === "object" ? options : {};
			return this;
		}
		setEmailState(state = {}) {
			this.emailState = {
				validCount: Math.max(0, Number(state?.validCount) || 0),
				malformedCount: Math.max(0, Number(state?.malformedCount) || 0)
			};
			return this;
		}
		showConfigure() {
			this.mode = "configure";
			this.clearMessages();
			return this;
		}
		showChecking(message = "Проверяем пользователей…") {
			this.mode = "checking";
			this.clearMessages();
			this.setStatus(message);
			return this;
		}
		showValidationErrors(errors = []) {
			this.mode = "validation-error";
			this.errors = this.normalizeErrors(errors);
			this.progress = {
				visible: false,
				completed: 0,
				total: 0
			};
			this.setStatus("Исправьте ошибки и повторите проверку.", "error");
			return this;
		}
		showReview({ rows = [] } = {}) {
			this.mode = "review";
			this.rows = this.normalizeRows(rows);
			this.clearMessages();
			this.setStatus("Выберите операции для пользователей.");
			return this;
		}
		showExecution(progress = {}) {
			this.mode = "executing";
			const completed = Math.max(0, Number(progress.completed) || 0);
			const total = Math.max(0, Number(progress.total) || 0);
			const successes = Math.max(0, Number(progress.successes) || 0);
			const failures = Math.max(0, Number(progress.failures) || 0);
			this.progress = {
				visible: true,
				completed,
				total
			};
			const current = progress.current?.email && progress.current?.operation ? ` Сейчас: ${progress.current.email} — ${{
				unassign: "снятие куратора",
				delete: "удаление пользователя"
			}[progress.current.operation] || progress.current.operation}.` : "";
			this.setStatus(`Выполнено: ${completed} из ${total}. Успешно: ${successes}. Ошибок: ${failures}.${current}`);
			return this;
		}
		showComplete(summary = {}) {
			this.rows = this.normalizeRows(Array.isArray(summary.rows) ? summary.rows : this.rows);
			const failures = Math.max(0, Number(summary.failures) || 0);
			this.mode = failures > 0 ? "partial-complete" : "complete";
			this.clearMessages();
			this.setStatus(failures > 0 ? `Завершено с ошибками. Успешно: ${Math.max(0, Number(summary.successes) || 0)}.` : "Готово.");
			return this;
		}
		showFatalError(error) {
			this.mode = "fatal-error";
			this.clearMessages();
			this.errors = this.normalizeErrors([error]);
			this.setStatus("Не удалось загрузить пользователей.", "error");
			return this;
		}
		normalizeRows(rows) {
			return rows.map((row) => ({
				...row,
				result: { ...row.result || {
					status: "pending",
					message: "Not started"
				} }
			}));
		}
		normalizeErrors(errors) {
			return (Array.isArray(errors) ? errors : [errors]).map((error) => typeof error === "string" ? error : String(error?.message || "Неизвестная ошибка."));
		}
		selectOperation(row, operation, selected) {
			if (this.isLocked() || row.actionable === false) return;
			this.rows = this.rows.map((item) => item === row ? {
				...item,
				[`${operation}Selected`]: Boolean(selected),
				result: { ...item.result || {} }
			} : item);
			this.dispatchSelectionChange();
		}
		selectAll(operation, selected) {
			if (this.isLocked()) return;
			this.rows = this.rows.map((row) => row.actionable === false ? row : {
				...row,
				[`${operation}Selected`]: Boolean(selected),
				result: { ...row.result || {} }
			});
			this.dispatchSelectionChange();
		}
		allSelected(operation) {
			const actionable = this.rows.filter((row) => row.actionable !== false);
			return actionable.length > 0 && actionable.every((row) => row[`${operation}Selected`]);
		}
		dispatchSelectionChange() {
			this.dispatchEvent(new CustomEvent("edvibe-batch-user-management-selection-change", { detail: { rows: this.copyRows() } }));
		}
		handleInput(event) {
			this.emailInput = String(event.currentTarget.value || "");
			this.dispatchEvent(new CustomEvent("edvibe-batch-user-management-input-change", { detail: { emailInput: this.emailInput } }));
		}
		handleCheck() {
			if (!this.canCheck()) return;
			this.dispatchEvent(new CustomEvent("edvibe-batch-user-management-check", { detail: { emailInput: this.emailInput } }));
		}
		handleStart() {
			if (!this.canStart()) return;
			this.dispatchEvent(new CustomEvent("edvibe-batch-user-management-start", { detail: { rows: this.copyRows() } }));
		}
		handleRestart() {
			if (!["complete", "partial-complete"].includes(this.mode)) return;
			this.rows = [];
			this.mode = "configure";
			this.emailInput = "";
			this.setEmailState({
				validCount: 0,
				malformedCount: 0
			});
			this.clearMessages();
			this.dispatchEvent(new CustomEvent("edvibe-batch-user-management-restart"));
		}
		handleBackdropClick(event) {
			if (event.target === event.currentTarget) this.close();
		}
		handleKeydown(event) {
			if (event.key === "Escape") this.close();
		}
		close() {
			if (!this.canClose()) return;
			this.dispatchEvent(new CustomEvent("edvibe-dialog-close"));
			this.remove();
		}
		copyRows() {
			return this.rows.map((row) => ({
				...row,
				result: { ...row.result || {} }
			}));
		}
		clearMessages() {
			this.errors = [];
			this.progress = {
				visible: false,
				completed: 0,
				total: 0
			};
			this.setStatus("");
		}
		setStatus(message, state = "") {
			this.statusMessage = String(message || "");
			this.statusError = state === "error";
		}
		isLocked() {
			return [
				"checking",
				"executing",
				"complete",
				"partial-complete"
			].includes(this.mode);
		}
		canCheck() {
			return ["configure", "validation-error"].includes(this.mode) && this.emailInput.trim().length > 0;
		}
		canStart() {
			return this.mode === "review" && this.rows.some((row) => row.actionable !== false && (row.unassignSelected || row.deleteSelected));
		}
		canClose() {
			return [
				"configure",
				"validation-error",
				"review",
				"complete",
				"partial-complete",
				"fatal-error"
			].includes(this.mode);
		}
		renderRow(row) {
			const locked = this.isLocked();
			return b`
            <tr>
                <td class="edvibe-batch-user-management-user">${row.pupil?.Name ? `${row.pupil.Name} — ` : ""}${row.email}</td>
                <td><input class="operation-unassign" type="checkbox"
                    .checked=${Boolean(row.unassignSelected)} ?disabled=${row.actionable === false || locked}
                    @change=${(event) => this.selectOperation(row, "unassign", event.currentTarget.checked)}></td>
                <td><input class="operation-delete" type="checkbox"
                    .checked=${Boolean(row.deleteSelected)} ?disabled=${row.actionable === false || locked}
                    @change=${(event) => this.selectOperation(row, "delete", event.currentTarget.checked)}></td>
                <td class="edvibe-batch-user-management-result">${String(row.result?.message || row.message || "")}</td>
            </tr>
        `;
		}
		render() {
			const completed = ["complete", "partial-complete"].includes(this.mode);
			const locked = this.isLocked();
			const statusClass = `edvibe-batch-user-management-status${this.statusError ? " is-error" : ""}`;
			return b`
<div class="edvibe-batch-user-management-overlay" @click=${this.handleBackdropClick}>
                <section class="edvibe-batch-user-management-card" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-user-management-title">
                    <header class="edvibe-batch-user-management-header">
                        <div><h2 id="edvibe-batch-user-management-title">Управление пользователями</h2>
                            <p class="edvibe-batch-user-management-description">Снимите кураторов и удалите пользователей по списку email.</p></div>
                        <button class="edvibe-batch-user-management-close" type="button" aria-label="Закрыть"
                            ?disabled=${!this.canClose()} @click=${() => this.close()}>&times;</button>
                    </header>
                    <div class="edvibe-batch-user-management-body">
                        <section class="edvibe-batch-user-management-configure">
                            <label for="edvibe-batch-user-management-emails">Email пользователей</label>
                            <textarea id="edvibe-batch-user-management-emails" class="edvibe-batch-user-management-emails"
                                rows="5" placeholder="user@example.com" .value=${this.emailInput}
                                ?disabled=${locked || completed || this.mode === "fatal-error"} @input=${this.handleInput}></textarea>
                            <div class="edvibe-batch-user-management-email-state" aria-live="polite">
                                <span class="edvibe-batch-user-management-email-count">Уникальных email: ${this.emailState.validCount}</span>
                                <span class="edvibe-batch-user-management-malformed-count">Некорректных: ${this.emailState.malformedCount}</span>
                            </div>
                        </section>
                        <section class="edvibe-batch-user-management-errors" aria-live="polite" ?hidden=${this.errors.length === 0}>
                            ${this.errors.map((error) => b`<p class="edvibe-batch-user-management-error">${error}</p>`)}
                        </section>
                        <section class="edvibe-batch-user-management-table-wrap" ?hidden=${this.rows.length === 0}>
                            <table class="edvibe-batch-user-management-table">
                                <thead><tr><th scope="col">Пользователь</th>
                                    <th scope="col">Снять куратора <button class="edvibe-batch-user-management-select-all-unassign" type="button"
                                        ?disabled=${locked || this.rows.length === 0} @click=${() => this.selectAll("unassign", !this.allSelected("unassign"))}>Выбрать все</button></th>
                                    <th scope="col">Удалить пользователя <button class="edvibe-batch-user-management-select-all-delete" type="button"
                                        ?disabled=${locked || this.rows.length === 0} @click=${() => this.selectAll("delete", !this.allSelected("delete"))}>Выбрать все</button></th>
                                    <th scope="col">Результат</th></tr></thead>
                                <tbody class="edvibe-batch-user-management-table-body">${this.rows.map((row) => this.renderRow(row))}</tbody>
                            </table>
                        </section>
                    </div>
                    <div class="edvibe-batch-user-management-live-region">
                        <p class=${statusClass} role="status" aria-live="polite">${this.statusMessage}</p>
                        <progress class="edvibe-batch-user-management-progress" max=${this.progress.total}
                            value=${this.progress.completed} ?hidden=${!this.progress.visible}></progress>
                    </div>
                    <footer class="edvibe-batch-user-management-footer">
                        <button class="edvibe-batch-user-management-restart" type="button" ?hidden=${!completed}
                            ?disabled=${!completed} @click=${this.handleRestart}>Запустить другую группу</button>
                        <button class="edvibe-batch-user-management-start" type="button" ?hidden=${this.mode !== "review"}
                            ?disabled=${!this.canStart()} @click=${this.handleStart}>Начать обработку</button>
                        <button class="edvibe-batch-user-management-check" type="button"
                            ?hidden=${!["configure", "validation-error"].includes(this.mode)} ?disabled=${!this.canCheck()}
                            @click=${this.handleCheck}>Проверить пользователей</button>
                    </footer>
                </section>
            </div>
        `;
		}
	};
	if (!customElements.get("edvibe-toolbox-batch-user-management-dialog")) customElements.define(USER_MANAGEMENT_DIALOG_TAG, BatchUserManagementDialog);
	globalThis.EdVibeBatchUserManagementDialog = {
		USER_MANAGEMENT_DIALOG_TAG,
		USER_MANAGEMENT_OVERLAY_ID,
		BatchUserManagementDialog
	};
	//#endregion
	//#region src/features/batch-user-onboarding.js
	var DIALOG_TAG$2 = "edvibe-toolbox-batch-user-onboarding-dialog";
	var OPERATION_TYPE$2 = "batch_user_onboarding";
	var EXPECTED_WRITE_CODES$2 = /* @__PURE__ */ new Set([
		"SERVER_REJECTED",
		"INVALID_RESPONSE",
		"REQUEST_TIMEOUT",
		"SEND_FAILED"
	]);
	function featureError(code, message, details = {}) {
		return createFeatureError(code, message, details);
	}
	function deepFreeze(value) {
		if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
		Object.freeze(value);
		for (const nested of Object.values(value)) deepFreeze(nested);
		return value;
	}
	function normalizeModerator(item) {
		const id = Number(item?.Id);
		const teacherId = Number(item?.TeacherId);
		if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(teacherId) || teacherId <= 0) throw featureError("INVALID_MODERATOR_RESPONSE", "The moderator catalogue contained an invalid identifier.");
		return Object.freeze({
			id,
			teacherId,
			name: String(item?.Name || "").trim() || null,
			email: String(item?.Email || "").trim() || null
		});
	}
	function normalizeModeratorCatalogue(items) {
		if (!Array.isArray(items)) throw featureError("INVALID_MODERATOR_RESPONSE", "The moderator catalogue was not an array.");
		const moderators = items.map(normalizeModerator);
		const ids = /* @__PURE__ */ new Set();
		const teacherIds = /* @__PURE__ */ new Set();
		for (const moderator of moderators) {
			if (ids.has(moderator.id) || teacherIds.has(moderator.teacherId)) throw featureError("INVALID_MODERATOR_RESPONSE", "The moderator catalogue contained ambiguous identifiers.");
			ids.add(moderator.id);
			teacherIds.add(moderator.teacherId);
		}
		return Object.freeze(moderators);
	}
	async function loadModerators({ sendRequest, marathonId }) {
		return normalizeModeratorCatalogue((await sendRequest("MarathonModeratorWsController", "GetMarathonModerators", "Marathons", { MarathonId: marathonId }))?.Value?.Items);
	}
	function buildModeratorIndex(moderators) {
		return new Map((moderators || []).map((moderator) => [moderator.teacherId, moderator]));
	}
	function resolvePupilModerators(pupilModerators, moderators) {
		if (!Array.isArray(pupilModerators)) return Object.freeze({
			safe: false,
			moderators: Object.freeze([]),
			code: "UNSAFE_MODERATOR_REPLACEMENT",
			message: "Current curator assignments could not be interpreted safely."
		});
		const byTeacherId = buildModeratorIndex(moderators);
		const resolved = [];
		const seen = /* @__PURE__ */ new Set();
		for (const current of pupilModerators) {
			const teacherId = Number(current?.TeacherId);
			const moderator = byTeacherId.get(teacherId);
			if (!Number.isSafeInteger(teacherId) || !moderator || seen.has(moderator.id)) return Object.freeze({
				safe: false,
				moderators: Object.freeze([]),
				code: "UNSAFE_MODERATOR_REPLACEMENT",
				message: "Existing curator assignments cannot be preserved without guessing."
			});
			seen.add(moderator.id);
			resolved.push(moderator);
		}
		return Object.freeze({
			safe: true,
			moderators: Object.freeze(resolved),
			code: null,
			message: null
		});
	}
	function serializePupil(pupil) {
		if (!pupil) return null;
		return Object.freeze({
			email: String(pupil.Email || "").trim() || null,
			name: String(pupil.Name || pupil.DisplayName || pupil.FullName || "").trim() || null,
			pupilId: Number.isSafeInteger(Number(pupil.PupilId)) ? Number(pupil.PupilId) : null,
			marathonPupilId: Number.isSafeInteger(Number(pupil.MarathonPupilId)) ? Number(pupil.MarathonPupilId) : null
		});
	}
	function buildPupilEmailIndex(pupils) {
		const index = /* @__PURE__ */ new Map();
		for (const pupil of Array.isArray(pupils) ? pupils : []) {
			const email = String(pupil?.Email || "").trim().toLowerCase();
			if (!email) continue;
			const values = index.get(email) || [];
			values.push(pupil);
			index.set(email, values);
		}
		return index;
	}
	function resolveOnboardingRows(parsed, pupils, moderators) {
		const pupilIndex = buildPupilEmailIndex(pupils);
		const rows = [];
		for (const item of parsed?.items || []) {
			if (!item.isValid) {
				rows.push(Object.freeze({
					email: item.input,
					normalizedEmail: item.normalized,
					resolution: "invalid",
					membership: "unknown",
					user: null,
					currentModerators: Object.freeze([]),
					moderatorStateSafe: false,
					actionable: false,
					message: `Invalid email address: ${item.input}.`,
					addSelected: false,
					assignSelected: false
				}));
				continue;
			}
			const candidates = pupilIndex.get(item.normalized) || [];
			if (candidates.length > 1) {
				rows.push(Object.freeze({
					email: item.input,
					normalizedEmail: item.normalized,
					resolution: "ambiguous",
					membership: "ambiguous",
					user: null,
					currentModerators: Object.freeze([]),
					moderatorStateSafe: false,
					actionable: false,
					message: `Multiple marathon users matched ${item.input}.`,
					addSelected: false,
					assignSelected: false
				}));
				continue;
			}
			if (candidates.length === 0) {
				rows.push(Object.freeze({
					email: item.input,
					normalizedEmail: item.normalized,
					resolution: "resolvable_not_in_marathon",
					membership: "not_in_marathon",
					user: null,
					currentModerators: Object.freeze([]),
					moderatorStateSafe: true,
					actionable: true,
					message: "Not currently in the marathon; the recorded add-by-email workflow is available.",
					addSelected: false,
					assignSelected: false
				}));
				continue;
			}
			const current = resolvePupilModerators(candidates[0].Moderators, moderators);
			rows.push(Object.freeze({
				email: item.input,
				normalizedEmail: item.normalized,
				resolution: "in_marathon",
				membership: "in_marathon",
				user: serializePupil(candidates[0]),
				currentModerators: current.moderators,
				moderatorStateSafe: current.safe,
				actionable: true,
				message: current.safe ? "Already in the marathon." : current.message,
				addSelected: false,
				assignSelected: false
			}));
		}
		return Object.freeze(rows);
	}
	function operationPreview(status, code, message, dependency = null) {
		return Object.freeze({
			status,
			code,
			message,
			dependency
		});
	}
	function findTargetModerator(moderators, targetModeratorId) {
		const targetId = Number(targetModeratorId);
		return (moderators || []).find((moderator) => moderator.id === targetId) || null;
	}
	function buildExecutionPlan$1({ rows, moderators, targetModeratorId }) {
		const values = Array.isArray(rows) ? rows : [];
		const assignmentSelected = values.some((row) => Boolean(row.assignSelected));
		const target = assignmentSelected ? findTargetModerator(moderators, targetModeratorId) : null;
		if (assignmentSelected && !target) throw featureError("CURATOR_REQUIRED", "Select a curator before preparing the execution plan.");
		const planRows = values.map((row) => {
			const addSelected = Boolean(row.addSelected);
			const assignSelected = Boolean(row.assignSelected);
			let add = null;
			let assign = null;
			if (addSelected) add = !row.actionable ? operationPreview("rejected", "INVALID_USER_INPUT", row.message || "The user is not actionable.") : row.membership === "in_marathon" ? operationPreview("noop", "USER_ALREADY_IN_MARATHON", "User is already in the marathon.") : operationPreview("pending", "USER_ADD_PENDING", "User will be added to the marathon.");
			if (assignSelected) if (!row.actionable) assign = operationPreview("rejected", "INVALID_USER_INPUT", row.message || "The user is not actionable.");
			else if (!row.moderatorStateSafe) assign = operationPreview("rejected", "UNSAFE_MODERATOR_REPLACEMENT", "Existing curator assignments cannot be preserved safely.");
			else if (row.membership === "not_in_marathon" && !addSelected) assign = operationPreview("rejected", "USER_NOT_IN_MARATHON", "Curator assignment requires adding this user first.");
			else if (row.membership === "in_marathon" && row.currentModerators.some((moderator) => moderator.teacherId === target.teacherId)) assign = operationPreview("noop", "CURATOR_ALREADY_ASSIGNED", "Target curator is already assigned.");
			else assign = operationPreview("pending", "CURATOR_ASSIGNMENT_PENDING", row.membership === "not_in_marathon" ? "The curator will be assigned by the recorded add-user request." : "The curator will be added while preserving all current curators.", row.membership === "not_in_marathon" ? Object.freeze({ blockedBy: "add_user" }) : null);
			return deepFreeze({
				itemId: row.normalizedEmail || row.email,
				email: row.email,
				normalizedEmail: row.normalizedEmail,
				resolution: row.resolution,
				membership: row.membership,
				user: row.user ? { ...row.user } : null,
				currentModerators: (row.currentModerators || []).map((moderator) => ({ ...moderator })),
				moderatorStateSafe: Boolean(row.moderatorStateSafe),
				actionable: Boolean(row.actionable),
				message: row.message || "",
				selectedOperations: Object.freeze([...addSelected ? ["add_user"] : [], ...assignSelected ? ["assign_curator"] : []]),
				addSelected,
				assignSelected,
				add,
				assign,
				targetModerator: target ? { ...target } : null
			});
		});
		const countStatus = (status) => planRows.reduce((sum, row) => sum + (row.add?.status === status ? 1 : 0) + (row.assign?.status === status ? 1 : 0), 0);
		return deepFreeze({
			rows: planRows,
			targetModerator: target ? { ...target } : null,
			counts: {
				requested: planRows.length,
				selectedOperations: planRows.reduce((sum, row) => sum + row.selectedOperations.length, 0),
				additions: planRows.filter((row) => row.addSelected).length,
				assignments: planRows.filter((row) => row.assignSelected).length,
				noOps: countStatus("noop"),
				rejectedOperations: countStatus("rejected"),
				dependentAssignments: planRows.filter((row) => row.assign?.dependency?.blockedBy === "add_user").length
			}
		});
	}
	function pad(value, length = 2) {
		return String(value).padStart(length, "0");
	}
	function formatClientTime(value) {
		const date = value instanceof Date ? value : new Date(value);
		if (Number.isNaN(date.getTime())) throw featureError("INVALID_CLIENT_TIME", "Could not build the Edvibe client timestamp.");
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
	}
	function buildAddRequest({ marathonId, emails, moderatorIds = [], host = "edvibe.com", now = /* @__PURE__ */ new Date(), userId = null }) {
		const normalizedEmails = (emails || []).map((email) => String(email || "").trim()).filter(Boolean);
		if (normalizedEmails.length === 0) throw featureError("EMAILS_REQUIRED", "At least one email is required for addition.");
		const hostname = String(host || "").trim() || "edvibe.com";
		const value = {
			MarathonId: marathonId,
			Emails: normalizedEmails,
			MailMessageLanguageId: 0,
			ModeratorsIds: [...moderatorIds],
			AccessGroups: [],
			Domain: hostname,
			ApiHost: hostname,
			ClientTime: formatClientTime(now),
			DeviceType: "desktop"
		};
		const numericUserId = Number(userId);
		if (Number.isSafeInteger(numericUserId) && numericUserId > 0) value.UserId = numericUserId;
		return deepFreeze({
			controller: "MarathonPupilsWsController",
			method: "AddMarathonPupil",
			projectName: "Marathons",
			value
		});
	}
	function buildAssignRequest({ marathonId, marathonPupilId, existingModeratorIds, targetModeratorId }) {
		const selected = [.../* @__PURE__ */ new Set([...(existingModeratorIds || []).map(Number), Number(targetModeratorId)])];
		if (selected.some((id) => !Number.isSafeInteger(id) || id <= 0)) throw featureError("UNSAFE_MODERATOR_REPLACEMENT", "A safe complete curator list could not be constructed.");
		return deepFreeze({
			controller: "MarathonPupilsWsController",
			method: "AddModeratorsToPupil",
			projectName: "Marathons",
			value: {
				MarathonId: marathonId,
				MarathonPupilId: marathonPupilId,
				SelectedModeratorsIds: selected
			}
		});
	}
	function operationResult(status, code, message, attempts = 0, dependency = null) {
		return {
			status,
			code,
			message,
			attempts,
			dependency
		};
	}
	function initializeExecutionRows(plan) {
		const fromPreview = (preview, label) => preview ? operationResult(preview.status === "pending" ? "not_attempted" : preview.status, preview.status === "pending" ? "NOT_ATTEMPTED" : preview.code, preview.status === "pending" ? `${label} has not been attempted yet.` : preview.message, 0, preview.dependency) : null;
		return plan.rows.map((row) => ({
			...row,
			currentModerators: row.currentModerators.map((moderator) => ({ ...moderator })),
			runtimePupil: row.user ? { ...row.user } : null,
			addResult: fromPreview(row.add, "The addition"),
			assignResult: fromPreview(row.assign, "The curator assignment")
		}));
	}
	function isPending(result) {
		return result?.status === "not_attempted";
	}
	function isRevalidatable(result) {
		return result && ![
			"rejected",
			"failed",
			"skipped"
		].includes(result.status);
	}
	function moderatorTeacherIds(values) {
		return (values || []).map((moderator) => moderator.teacherId).sort((a, b) => a - b);
	}
	function sameNumbers(left, right) {
		return left.length === right.length && left.every((value, index) => value === right[index]);
	}
	function rejectSelectedState(row, code, message) {
		if (row.addSelected && isRevalidatable(row.addResult)) row.addResult = operationResult("rejected", code, message);
		if (row.assignSelected && isRevalidatable(row.assignResult)) row.assignResult = operationResult("rejected", code, message);
	}
	function revalidateRows({ rows, pupils, moderators, targetModerator }) {
		const pupilIndex = buildPupilEmailIndex(pupils);
		for (const row of rows) {
			if (!row.actionable || row.selectedOperations.length === 0) continue;
			const candidates = pupilIndex.get(row.normalizedEmail) || [];
			if (candidates.length > 1) {
				rejectSelectedState(row, "USER_AMBIGUOUS", "The user became ambiguous before execution.");
				continue;
			}
			if (row.membership === "in_marathon") {
				if (candidates.length !== 1 || Number(candidates[0].MarathonPupilId) !== Number(row.user?.marathonPupilId)) {
					rejectSelectedState(row, "STATE_CHANGED", "Marathon membership changed after preflight.");
					continue;
				}
				const currentPupil = candidates[0];
				row.runtimePupil = serializePupil(currentPupil);
				if (row.addSelected && isRevalidatable(row.addResult)) row.addResult = operationResult("noop", "USER_ALREADY_IN_MARATHON", "User is already in the marathon.");
				if (!row.assignSelected || !isRevalidatable(row.assignResult)) continue;
				const current = resolvePupilModerators(currentPupil.Moderators, moderators);
				if (!current.safe) {
					row.assignResult = operationResult("rejected", current.code, current.message);
					continue;
				}
				if (!sameNumbers(moderatorTeacherIds(row.currentModerators), moderatorTeacherIds(current.moderators))) {
					row.assignResult = operationResult("rejected", "STATE_CHANGED", "Current curator assignments changed after preflight.");
					continue;
				}
				row.currentModerators = current.moderators.map((moderator) => ({ ...moderator }));
				row.assignResult = current.moderators.some((moderator) => moderator.teacherId === targetModerator?.teacherId) ? operationResult("noop", "CURATOR_ALREADY_ASSIGNED", "Target curator is already assigned.") : operationResult("not_attempted", "NOT_ATTEMPTED", "The curator assignment has not been attempted yet.");
				continue;
			}
			if (row.membership !== "not_in_marathon" || candidates.length === 0) continue;
			const currentPupil = candidates[0];
			row.runtimePupil = serializePupil(currentPupil);
			if (row.addSelected && isRevalidatable(row.addResult)) row.addResult = operationResult("noop", "USER_ALREADY_IN_MARATHON", "User entered the marathon after preflight; no duplicate add was sent.");
			if (row.assignSelected && isRevalidatable(row.assignResult)) {
				const current = resolvePupilModerators(currentPupil.Moderators, moderators);
				row.assignResult = current.safe && current.moderators.some((moderator) => moderator.teacherId === targetModerator?.teacherId) ? operationResult("noop", "CURATOR_ALREADY_ASSIGNED", "Target curator was assigned after preflight.") : operationResult("rejected", "STATE_CHANGED", "The user entered the marathon after preflight; curator state was not part of the confirmed plan.");
			}
		}
		return rows;
	}
	function isOperationWide(error, getConnectionState) {
		if (!error?.code) return true;
		if (error.code === "WS_UNAVAILABLE") return true;
		if (error.code === "SEND_FAILED" && !getConnectionState().isOpen) return true;
		return !EXPECTED_WRITE_CODES$2.has(error.code);
	}
	function countTerminalOperations(rows) {
		const results = rows.flatMap((row) => [row.addResult, row.assignResult]).filter(Boolean);
		return {
			completed: results.filter((result) => result.status !== "not_attempted").length,
			total: results.length,
			successes: results.filter((result) => ["success", "noop"].includes(result.status)).length,
			failures: results.filter((result) => [
				"failed",
				"rejected",
				"skipped"
			].includes(result.status)).length
		};
	}
	function emitProgress(onProgress, rows, current = null) {
		try {
			onProgress?.({
				...countTerminalOperations(rows),
				current
			});
		} catch (_) {}
	}
	async function executeAddGroup({ rows, marathonId, targetModerator, includeModerator, sendRequest, wait, getConnectionState, getRequestContext, now }) {
		const targets = rows.filter((row) => isPending(row.addResult) && row.membership === "not_in_marathon" && Boolean(row.assignSelected) === includeModerator);
		if (targets.length === 0) return {
			targets,
			confirmed: false,
			fatalError: null
		};
		const context = getRequestContext?.() || {};
		const request = buildAddRequest({
			marathonId,
			emails: targets.map((row) => row.email),
			moderatorIds: includeModerator ? [targetModerator.id] : [],
			host: context.host,
			userId: context.userId,
			now: now()
		});
		try {
			const result = await runWithRetry(async () => {
				const response = await sendRequest(request.controller, request.method, request.projectName, request.value);
				if (response?.Value?.IsSuccess !== true) throw featureError("INVALID_RESPONSE", "User addition was not positively confirmed.");
				return response;
			}, {
				wait,
				getConnectionState
			});
			for (const row of targets) row.addRequestAttempts = result.attempts;
			return {
				targets,
				confirmed: true,
				fatalError: null
			};
		} catch (error) {
			for (const row of targets) {
				row.addResult = operationResult("failed", error.code || "USER_ADD_FAILED", error.message || "User addition failed.", error.attempts || 1);
				if (isPending(row.assignResult)) row.assignResult = operationResult("skipped", "ASSIGNMENT_BLOCKED_BY_ADD_FAILURE", "Curator assignment was skipped because user addition failed.", 0, { blockedBy: "add_user" });
			}
			return {
				targets,
				confirmed: false,
				fatalError: isOperationWide(error, getConnectionState) ? error : null
			};
		}
	}
	function reconcileAddedRows({ groups, pupils, targetModerator }) {
		const pupilIndex = buildPupilEmailIndex(pupils);
		for (const group of groups.filter((item) => item.confirmed)) for (const row of group.targets) {
			const candidates = pupilIndex.get(row.normalizedEmail) || [];
			if (candidates.length !== 1) {
				row.addResult = operationResult("failed", "INVALID_USER_RESPONSE", candidates.length === 0 ? "The add request succeeded, but the user was not found in the refreshed marathon roster." : "The add request succeeded, but the refreshed user identity was ambiguous.", row.addRequestAttempts || 1);
				if (isPending(row.assignResult)) row.assignResult = operationResult("skipped", "ASSIGNMENT_BLOCKED_BY_ADD_FAILURE", "Curator assignment was skipped because the added user could not be resolved safely.", 0, { blockedBy: "add_user" });
				continue;
			}
			const currentPupil = candidates[0];
			row.runtimePupil = serializePupil(currentPupil);
			row.addResult = operationResult("success", "USER_ADDED", "User was added to the marathon.", row.addRequestAttempts || 1);
			if (isPending(row.assignResult) && row.assignSelected) row.assignResult = Array.isArray(currentPupil.Moderators) && currentPupil.Moderators.some((moderator) => Number(moderator?.TeacherId) === Number(targetModerator?.teacherId)) ? operationResult("success", "CURATOR_ASSIGNED", "Target curator was assigned during user addition.", row.addRequestAttempts || 1, { blockedBy: "add_user" }) : operationResult("failed", "INVALID_MODERATOR_RESPONSE", "The user was added, but the target curator was not confirmed on the refreshed roster.", row.addRequestAttempts || 1, { blockedBy: "add_user" });
		}
	}
	function markConfirmedGroupsUnverified(groups, error) {
		for (const group of groups.filter((item) => item.confirmed)) for (const row of group.targets) {
			if (!isPending(row.addResult)) continue;
			row.addResult = operationResult("failed", "ADD_VERIFICATION_FAILED", `The add request was accepted, but per-user verification could not finish: ${error?.message || "operation interrupted"}`, row.addRequestAttempts || 1);
			if (isPending(row.assignResult)) row.assignResult = operationResult("skipped", "ASSIGNMENT_BLOCKED_BY_ADD_FAILURE", "Curator assignment could not be verified because the added user was not safely resolved.", 0, { blockedBy: "add_user" });
		}
	}
	async function executeExistingAssignments({ rows, marathonId, targetModerator, sendRequest, wait, getConnectionState, requestDelayMs, onProgress }) {
		let fatalError = null;
		const targets = rows.filter((row) => isPending(row.assignResult) && row.membership === "in_marathon" && row.runtimePupil?.marathonPupilId);
		for (const [index, row] of targets.entries()) {
			if (fatalError) break;
			const request = buildAssignRequest({
				marathonId,
				marathonPupilId: row.runtimePupil.marathonPupilId,
				existingModeratorIds: row.currentModerators.map((moderator) => moderator.id),
				targetModeratorId: targetModerator.id
			});
			try {
				row.assignResult = operationResult("success", "CURATOR_ASSIGNED", "Target curator was assigned while preserving existing curators.", (await runWithRetry(async () => {
					const response = await sendRequest(request.controller, request.method, request.projectName, request.value);
					if (response?.Value?.IsSuccess !== true) throw featureError("INVALID_RESPONSE", "Curator assignment was not positively confirmed.");
					return response;
				}, {
					wait,
					getConnectionState
				})).attempts);
			} catch (error) {
				row.assignResult = operationResult("failed", error.code || "CURATOR_ASSIGNMENT_FAILED", error.message || "Curator assignment failed.", error.attempts || 1);
				if (isOperationWide(error, getConnectionState)) fatalError = error;
			}
			emitProgress(onProgress, rows, {
				email: row.email,
				operation: "assign_curator"
			});
			if (index < targets.length - 1 && requestDelayMs > 0 && !fatalError) await wait(requestDelayMs);
		}
		return fatalError;
	}
	function markRemainingNotAttempted(rows, message = "Not attempted because the operation stopped.") {
		for (const row of rows) {
			if (isPending(row.addResult)) row.addResult = operationResult("not_attempted", "NOT_ATTEMPTED", message);
			if (isPending(row.assignResult)) row.assignResult = operationResult("not_attempted", "NOT_ATTEMPTED", message);
		}
	}
	function rejectRevalidatableRows(rows, error) {
		for (const row of rows) rejectSelectedState(row, error?.code || "STATE_CHANGED", error?.message || "The confirmed plan could not be revalidated.");
	}
	async function executePlan$1({ plan, marathonId, sendRequest, wait, getConnectionState, getRequestContext = () => ({ host: "edvibe.com" }), now = () => /* @__PURE__ */ new Date(), requestDelayMs = 250, onProgress = () => {} }) {
		const rows = initializeExecutionRows(plan);
		const groups = [];
		let fatalError = null;
		let writesStarted = false;
		try {
			const [latestPupils, latestModerators] = await Promise.all([loadAllPupils({
				sendRequest,
				marathonId
			}), loadModerators({
				sendRequest,
				marathonId
			})]);
			const target = plan.targetModerator ? findTargetModerator(latestModerators, plan.targetModerator.id) : null;
			if (plan.targetModerator && (!target || target.teacherId !== plan.targetModerator.teacherId)) throw featureError("STATE_CHANGED", "The selected curator changed or disappeared after preflight.");
			revalidateRows({
				rows,
				pupils: latestPupils,
				moderators: latestModerators,
				targetModerator: target
			});
			emitProgress(onProgress, rows, { operation: "revalidate" });
			for (const includeModerator of [false, true]) {
				if (!rows.some((row) => isPending(row.addResult) && row.membership === "not_in_marathon" && Boolean(row.assignSelected) === includeModerator)) continue;
				writesStarted = true;
				const group = await executeAddGroup({
					rows,
					marathonId,
					targetModerator: target,
					includeModerator,
					sendRequest,
					wait,
					getConnectionState,
					getRequestContext,
					now
				});
				groups.push(group);
				fatalError ||= group.fatalError;
				emitProgress(onProgress, rows, { operation: includeModerator ? "add_user_with_curator" : "add_user" });
				if (fatalError) break;
				if (requestDelayMs > 0) await wait(requestDelayMs);
			}
			if (!fatalError && groups.some((group) => group.confirmed)) {
				reconcileAddedRows({
					groups,
					pupils: await loadAllPupils({
						sendRequest,
						marathonId
					}),
					targetModerator: target
				});
				emitProgress(onProgress, rows, { operation: "verify_additions" });
			}
			if (!fatalError && target) {
				if (rows.some((row) => isPending(row.assignResult) && row.membership === "in_marathon")) writesStarted = true;
				fatalError = await executeExistingAssignments({
					rows,
					marathonId,
					targetModerator: target,
					sendRequest,
					wait,
					getConnectionState,
					requestDelayMs,
					onProgress
				});
			}
		} catch (error) {
			fatalError = error;
		}
		if (fatalError && groups.some((group) => group.confirmed)) markConfirmedGroupsUnverified(groups, fatalError);
		if (fatalError && !writesStarted) rejectRevalidatableRows(rows, fatalError);
		markRemainingNotAttempted(rows, fatalError ? "Not attempted because the operation stopped." : "The selected operation was not applicable after revalidation.");
		emitProgress(onProgress, rows, null);
		return deepFreeze({
			plan,
			rows: rows.map((row) => ({
				itemId: row.itemId,
				email: row.email,
				normalizedEmail: row.normalizedEmail,
				resolution: row.resolution,
				membership: row.membership,
				user: row.runtimePupil ? { ...row.runtimePupil } : row.user ? { ...row.user } : null,
				currentModerators: row.currentModerators.map((moderator) => ({ ...moderator })),
				targetModerator: row.targetModerator ? { ...row.targetModerator } : null,
				selectedOperations: [...row.selectedOperations],
				addResult: row.addResult ? { ...row.addResult } : null,
				assignResult: row.assignResult ? { ...row.assignResult } : null,
				message: row.message
			})),
			fatalError: fatalError ? Object.freeze({
				code: fatalError.code || "INTERNAL_ERROR",
				message: fatalError.message || "The operation stopped unexpectedly."
			}) : null
		});
	}
	function inferRowStatus(row) {
		const results = [row.addResult, row.assignResult].filter(Boolean);
		if (row.resolution === "invalid" || row.resolution === "ambiguous") return "rejected";
		if (results.length === 0) return "skipped";
		if (results.some((result) => result.status === "failed")) return "failed";
		if (results.some((result) => result.status === "not_attempted")) return "not_attempted";
		if (results.some((result) => result.status === "rejected")) return "rejected";
		if (results.some((result) => result.status === "skipped")) return "skipped";
		if (results.every((result) => result.status === "noop")) return "noop";
		return "success";
	}
	function formatReport$1(result) {
		const lines = [
			"Edvibe Toolbox: batch user onboarding",
			`Requested users: ${result.plan.counts.requested}`,
			`Selected additions: ${result.plan.counts.additions}`,
			`Selected assignments: ${result.plan.counts.assignments}`,
			result.plan.targetModerator ? `Target curator: ${result.plan.targetModerator.name || result.plan.targetModerator.email || result.plan.targetModerator.id}` : "Target curator: not selected",
			""
		];
		for (const row of result.rows) {
			const label = row.user?.name ? `${row.user.name} <${row.email}>` : row.email;
			lines.push(`[${inferRowStatus(row)}] ${label}`);
			if (row.addResult) lines.push(`  add_user: ${row.addResult.status} ${row.addResult.code} — ${row.addResult.message}`);
			if (row.assignResult) lines.push(`  assign_curator: ${row.assignResult.status} ${row.assignResult.code} — ${row.assignResult.message}`);
			if (!row.addResult && !row.assignResult) lines.push(`  discovery: ${row.resolution} — ${row.message || "No operation selected."}`);
		}
		if (result.fatalError) lines.push("", `Interrupted: ${result.fatalError.code} — ${result.fatalError.message}`);
		return lines.join("\n");
	}
	function buildCounts$1(rows) {
		const statuses = rows.map(inferRowStatus);
		return Object.freeze({
			requested: rows.length,
			eligible: rows.filter((row) => !["invalid", "ambiguous"].includes(row.resolution) && row.selectedOperations.length > 0).length,
			attempted: rows.filter((row) => [row.addResult, row.assignResult].filter(Boolean).some((result) => !["not_attempted", "rejected"].includes(result.status))).length,
			successful: statuses.filter((status) => status === "success").length,
			noOp: statuses.filter((status) => status === "noop").length,
			skipped: statuses.filter((status) => status === "skipped" || status === "rejected").length,
			failed: statuses.filter((status) => status === "failed").length,
			notAttempted: statuses.filter((status) => status === "not_attempted").length
		});
	}
	function serializeHistoryOperation(name, result) {
		return result ? Object.freeze({
			name,
			status: result.status,
			attemptCount: Number(result.attempts) || 0,
			code: result.code || null,
			message: result.message || null,
			dependency: result.dependency ? Object.freeze({ ...result.dependency }) : null
		}) : null;
	}
	function buildExecutionHistoryInput$3({ marathonId, marathonName = null, startedAt, completedAt, result }) {
		const rows = result.rows || [];
		const counts = buildCounts$1(rows);
		const operationCounts = {
			selected: 0,
			attempted: 0,
			successful: 0,
			noOp: 0,
			skipped: 0,
			rejected: 0,
			failed: 0,
			notAttempted: 0
		};
		const historyRows = rows.map((row) => {
			const operations = [serializeHistoryOperation("add_user", row.addResult), serializeHistoryOperation("assign_curator", row.assignResult)].filter(Boolean);
			for (const operation of operations) {
				operationCounts.selected += 1;
				if (!["not_attempted", "rejected"].includes(operation.status)) operationCounts.attempted += 1;
				if (operation.status === "success") operationCounts.successful += 1;
				if (operation.status === "noop") operationCounts.noOp += 1;
				if (operation.status === "skipped") operationCounts.skipped += 1;
				if (operation.status === "rejected") operationCounts.rejected += 1;
				if (operation.status === "failed") operationCounts.failed += 1;
				if (operation.status === "not_attempted") operationCounts.notAttempted += 1;
			}
			const status = inferRowStatus(row);
			return Object.freeze({
				itemId: row.itemId,
				label: row.email,
				status,
				code: {
					success: "USER_ONBOARDING_COMPLETED",
					noop: "USER_ONBOARDING_NOOP",
					skipped: "USER_ONBOARDING_SKIPPED",
					rejected: "USER_ONBOARDING_REJECTED",
					failed: "USER_ONBOARDING_FAILED",
					not_attempted: "NOT_ATTEMPTED"
				}[status],
				message: operations.map((operation) => operation.message).filter(Boolean).join("; ") || row.message || "No operation selected.",
				attempts: operations.reduce((sum, operation) => sum + operation.attemptCount, 0),
				data: Object.freeze({
					submittedInput: row.email,
					normalizedEmail: row.normalizedEmail,
					resolution: row.resolution,
					membershipPreflight: row.membership,
					user: row.user ? Object.freeze({ ...row.user }) : null,
					existingCurators: Object.freeze(row.currentModerators.map((moderator) => Object.freeze({ ...moderator }))),
					targetCurator: row.targetModerator ? Object.freeze({ ...row.targetModerator }) : null,
					selectedOperations: Object.freeze([...row.selectedOperations]),
					operations: Object.freeze(operations)
				})
			});
		});
		return deepFreeze({
			operationType: OPERATION_TYPE$2,
			startedAt,
			completedAt,
			status: result.fatalError ? "interrupted" : counts.failed > 0 || counts.skipped > 0 ? "completed_with_failures" : "completed",
			pageContext: {
				marathonId: String(marathonId),
				marathonName
			},
			counts,
			results: historyRows,
			message: JSON.stringify({
				userCounts: counts,
				operationCounts
			})
		});
	}
	function createBatchUserOnboardingFeature({ sendRequest, getConnectionState, wait, canStart, onActiveChange, createDialog = () => document.createElement(DIALOG_TAG$2), copyText = (text) => navigator.clipboard.writeText(text), persistExecution = async () => Object.freeze({ stored: false }), openHistory = () => {}, getLocationHref = () => window.location.href, getMarathonName = () => document.querySelector("h1")?.textContent?.trim() || document.title || null, getRequestContext = () => ({ host: window.location.hostname }), now = () => /* @__PURE__ */ new Date(), log = () => {} }) {
		let active = false;
		function release() {
			if (!active) return;
			active = false;
			onActiveChange(false);
		}
		async function open() {
			if (active || !canStart()) {
				window.alert("Another Edvibe Toolbox operation is already running.");
				return;
			}
			const marathonId = parseMarathonId$3(getLocationHref());
			if (!marathonId) {
				window.alert("Open an Edvibe marathon page before adding users.");
				return;
			}
			active = true;
			onActiveChange(true);
			const dialog = createDialog();
			(document.body || document.documentElement).appendChild(dialog);
			try {
				dialog.showLoading?.("Loading marathon users and curators…");
				const [pupils, moderators] = await Promise.all([loadAllPupils({
					sendRequest,
					marathonId
				}), loadModerators({
					sendRequest,
					marathonId
				})]);
				let discoveryRows = [];
				dialog.configure({
					moderators,
					parseEmailInput,
					onDiscover({ emailInput }) {
						const parsed = parseEmailInput(emailInput);
						if (parsed.items.length === 0) throw featureError("EMAILS_REQUIRED", "Enter at least one email address.");
						discoveryRows = resolveOnboardingRows(parsed, pupils, moderators);
						return discoveryRows;
					},
					onPreflight({ rows, targetModeratorId }) {
						const selections = new Map((rows || []).map((row) => [row.normalizedEmail, {
							addSelected: Boolean(row.addSelected),
							assignSelected: Boolean(row.assignSelected)
						}]));
						const plan = buildExecutionPlan$1({
							rows: discoveryRows.map((row) => ({
								...row,
								...selections.get(row.normalizedEmail) || {
									addSelected: false,
									assignSelected: false
								}
							})),
							moderators,
							targetModeratorId
						});
						if (plan.counts.selectedOperations === 0) throw featureError("OPERATIONS_REQUIRED", "Select at least one add or curator-assignment operation.");
						return plan;
					},
					async onExecute(plan, onProgress) {
						const startedAt = now().toISOString();
						const result = await executePlan$1({
							plan,
							marathonId,
							sendRequest,
							wait,
							getConnectionState,
							getRequestContext,
							now,
							onProgress
						});
						const report = formatReport$1(result);
						const completedAt = now().toISOString();
						let history;
						try {
							history = await persistExecution(buildExecutionHistoryInput$3({
								marathonId,
								marathonName: getMarathonName(),
								startedAt,
								completedAt,
								result
							}));
						} catch (persistenceError) {
							history = Object.freeze({
								stored: false,
								persistenceError
							});
							log("Batch user onboarding history persistence failed:", persistenceError);
						}
						return {
							...result,
							report,
							history
						};
					},
					onCopy: copyText,
					onOpenHistory(executionId) {
						dialog.remove();
						release();
						openHistory(executionId);
					},
					onClose() {
						dialog.remove();
						release();
					}
				});
				dialog.showConfigure?.();
				log(`Batch user onboarding initialized for MarathonId ${marathonId}.`);
			} catch (error) {
				log(`Batch user onboarding initialization failed (${error.code || "UNKNOWN_ERROR"}).`);
				dialog.remove();
				release();
				window.alert(error.message || "Could not initialize batch user onboarding.");
			}
		}
		return Object.freeze({ open });
	}
	//#endregion
	//#region src/components/batch-user-onboarding-dialog.styles.js
	var batchUserOnboardingDialogStyles = i$3`
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
`;
	//#endregion
	//#region src/components/batch-user-onboarding-dialog.js
	var BATCH_USER_ONBOARDING_DIALOG_TAG = "edvibe-toolbox-batch-user-onboarding-dialog";
	var BatchUserOnboardingDialog = class extends i {
		static styles = [
			componentFoundationStyles,
			dialogFoundationStyles,
			batchUserOnboardingDialogStyles
		];
		static properties = {
			options: { state: true },
			rows: { state: true },
			plan: { state: true },
			mode: { state: true },
			executionId: { state: true },
			emailInput: { state: true },
			targetModeratorId: { state: true },
			emailCounts: { state: true },
			errors: { state: true },
			report: { state: true },
			statusMessage: { state: true },
			progress: { state: true }
		};
		constructor() {
			super();
			this.options = null;
			this.rows = [];
			this.plan = null;
			this.mode = "loading";
			this.executionId = null;
			this.emailInput = "";
			this.targetModeratorId = "";
			this.emailCounts = {
				valid: 0,
				invalid: 0
			};
			this.errors = [];
			this.report = "";
			this.statusMessage = "";
			this.progress = {
				visible: false,
				completed: 0,
				total: 1
			};
			this.handleKeydownBound = (event) => {
				if (event.key === "Escape") this.close();
			};
		}
		connectedCallback() {
			super.connectedCallback();
			this.ownerDocument?.addEventListener("keydown", this.handleKeydownBound);
		}
		disconnectedCallback() {
			this.ownerDocument?.removeEventListener("keydown", this.handleKeydownBound);
			super.disconnectedCallback();
		}
		configure(options = {}) {
			this.options = options && typeof options === "object" ? options : {};
			return this;
		}
		showLoading(message = "Загрузка…") {
			this.mode = "loading";
			this.showStatus(message);
			return this;
		}
		showConfigure() {
			this.mode = "configure";
			this.plan = null;
			this.executionId = null;
			this.clearErrors();
			this.report = "";
			this.progress = {
				visible: false,
				completed: 0,
				total: 1
			};
			this.showStatus("Введите email пользователей и проверьте список.");
			this.updateEmailCounts();
			return this;
		}
		updateEmailCounts() {
			if (!this.options?.parseEmailInput) return;
			const parsed = this.options.parseEmailInput(this.emailInput);
			this.emailCounts = {
				valid: parsed.entries?.length || 0,
				invalid: parsed.malformed?.length || 0
			};
		}
		async discover() {
			if (!this.options?.onDiscover || this.mode === "executing") return;
			this.clearErrors();
			this.mode = "loading";
			this.showStatus("Проверяем пользователей…");
			try {
				const discovered = await this.options.onDiscover({ emailInput: this.emailInput });
				this.rows = discovered.map((row) => ({
					...row,
					addSelected: false,
					assignSelected: false
				}));
				this.plan = null;
				this.mode = "review";
				this.showStatus("Проверьте найденные состояния и выберите операции.");
			} catch (error) {
				this.showError(error);
				this.mode = "configure";
			}
		}
		canAssign(row) {
			if (!row.actionable || !row.moderatorStateSafe) return false;
			if (row.membership === "in_marathon") return true;
			return row.membership === "not_in_marathon" && Boolean(row.addSelected);
		}
		setRowSelection(normalizedEmail, field, checked) {
			if (this.mode !== "review") return;
			this.rows = this.rows.map((row) => {
				if (row.normalizedEmail !== normalizedEmail) return row;
				const next = {
					...row,
					[field]: Boolean(checked)
				};
				if (field === "addSelected" && !checked && row.membership === "not_in_marathon") next.assignSelected = false;
				return next;
			});
			this.plan = null;
		}
		selectAll(field) {
			if (this.mode !== "review") return;
			this.rows = this.rows.map((row) => {
				if (field === "addSelected" && row.actionable) return {
					...row,
					addSelected: true
				};
				if (field === "assignSelected" && this.canAssign(row)) return {
					...row,
					assignSelected: true
				};
				return row;
			});
			this.plan = null;
		}
		async preparePlan() {
			if (!this.options?.onPreflight || this.mode !== "review") return;
			this.clearErrors();
			try {
				this.plan = await this.options.onPreflight({
					rows: this.rows.map((row) => ({
						normalizedEmail: row.normalizedEmail,
						addSelected: Boolean(row.addSelected),
						assignSelected: Boolean(row.assignSelected)
					})),
					targetModeratorId: this.targetModeratorId
				});
				this.mode = "preflight";
				this.showStatus("План зафиксирован. Проверьте его и подтвердите выполнение.");
			} catch (error) {
				this.showError(error);
			}
		}
		returnToReview() {
			if (this.mode !== "preflight") return;
			this.plan = null;
			this.mode = "review";
			this.showStatus("Измените выбор и подготовьте новый план.");
		}
		async execute() {
			if (!this.plan || !this.options?.onExecute || this.mode !== "preflight") return;
			this.mode = "executing";
			this.showStatus("Выполняем подтверждённый план…");
			this.progress = {
				visible: true,
				completed: 0,
				total: 1
			};
			try {
				const result = await this.options.onExecute(this.plan, (progress) => this.showProgress(progress));
				this.report = result.report || "";
				this.executionId = result.history?.stored ? result.history.record?.id || null : null;
				this.mode = result.fatalError ? "partial-complete" : "complete";
				const historyMessage = result.history?.stored ? " Результат сохранён в истории." : result.history?.persistenceError ? " Видимый отчёт сохранён, но историю записать не удалось." : "";
				this.showStatus(`${result.fatalError ? "Операция прервана, частичные результаты сохранены." : "Обработка завершена."}${historyMessage}`);
			} catch (error) {
				this.mode = "partial-complete";
				this.showError(error);
			} finally {
				this.progress = {
					...this.progress,
					visible: false
				};
			}
		}
		showProgress(progress = {}) {
			const completed = Math.max(0, Number(progress.completed) || 0);
			const total = Math.max(0, Number(progress.total) || 0);
			this.progress = {
				visible: true,
				completed: Math.min(completed, Math.max(total, 1)),
				total: Math.max(total, 1)
			};
			const current = progress.current?.operation ? ` Сейчас: ${progress.current.email ? `${progress.current.email}, ` : ""}${progress.current.operation}.` : "";
			this.showStatus(`Готово операций: ${completed}/${total}. Успешных/no-op: ${progress.successes || 0}. Проблем: ${progress.failures || 0}.${current}`);
		}
		restart() {
			if (this.mode === "executing") return;
			this.rows = [];
			this.plan = null;
			this.executionId = null;
			this.emailInput = "";
			this.targetModeratorId = "";
			this.report = "";
			this.mode = "configure";
			this.updateEmailCounts();
			this.showStatus("Введите следующую группу пользователей.");
		}
		close() {
			if (this.mode === "executing" || this.mode === "loading") return;
			this.options?.onClose?.();
		}
		clearErrors() {
			this.errors = [];
		}
		showError(error) {
			const message = error?.message || String(error || "Неизвестная ошибка.");
			this.errors = [message];
			this.showStatus(message);
		}
		showStatus(message) {
			this.statusMessage = String(message || "");
		}
		membershipLabel(row) {
			return {
				in_marathon: "В марафоне",
				resolvable_not_in_marathon: "Можно добавить по email",
				ambiguous: "Неоднозначно",
				invalid: "Некорректный email"
			}[row.resolution] || row.resolution;
		}
		curatorLabel(row) {
			if (!row.moderatorStateSafe && row.membership === "in_marathon") return "Нельзя безопасно прочитать";
			return row.currentModerators?.length ? row.currentModerators.map((moderator) => moderator.name || moderator.email || `#${moderator.id}`).join(", ") : "Нет";
		}
		renderRow(row) {
			return b`
            <tr data-email=${row.normalizedEmail}>
                <td><strong>${row.user?.name || row.email}</strong><small>${row.user?.name ? row.email : ""}</small></td>
                <td>${this.membershipLabel(row)}</td>
                <td class=${!row.moderatorStateSafe && row.membership === "in_marathon" ? "is-error" : ""}>${this.curatorLabel(row)}</td>
                <td><input class="add-selected" type="checkbox" .checked=${Boolean(row.addSelected)}
                    ?disabled=${this.mode !== "review" || !row.actionable}
                    aria-label=${`Добавить ${row.email}`}
                    @change=${(event) => this.setRowSelection(row.normalizedEmail, "addSelected", event.currentTarget.checked)}></td>
                <td><input class="assign-selected" type="checkbox" .checked=${Boolean(row.assignSelected)}
                    ?disabled=${this.mode !== "review" || !this.canAssign(row)}
                    aria-label=${`Назначить куратора ${row.email}`}
                    @change=${(event) => this.setRowSelection(row.normalizedEmail, "assignSelected", event.currentTarget.checked)}></td>
                <td class="row-status">${row.message || "Готово к выбору."}</td>
            </tr>`;
		}
		renderPreflight() {
			if (!this.plan) return A;
			return b`
            <section class="preflight" ?hidden=${!["preflight", "executing"].includes(this.mode)}>
                <h3>Неизменяемый план</h3>
                <p>Строк: ${this.plan.counts.requested}. Добавлений: ${this.plan.counts.additions}. Назначений: ${this.plan.counts.assignments}. Предсказанных no-op: ${this.plan.counts.noOps}. Отклонённых операций: ${this.plan.counts.rejectedOperations}.</p>
                <ul>${this.plan.rows.map((row) => {
				const pieces = [];
				if (row.add) pieces.push(`add: ${row.add.status} (${row.add.code})`);
				if (row.assign) pieces.push(`assign: ${row.assign.status} (${row.assign.code})`);
				if (pieces.length === 0) pieces.push(row.message || row.resolution);
				return b`<li>${row.email}: ${pieces.join("; ")}</li>`;
			})}</ul>
            </section>`;
		}
		render() {
			const reviewVisible = [
				"review",
				"preflight",
				"executing",
				"complete",
				"partial-complete"
			].includes(this.mode) && this.rows.length > 0;
			const completed = ["complete", "partial-complete"].includes(this.mode);
			return b`
<div class="overlay" @click=${(event) => {
				if (event.target === event.currentTarget) this.close();
			}}>
                <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="batch-user-onboarding-title">
                    <header class="header"><div><p class="eyebrow">Edvibe Toolbox</p><h2 id="batch-user-onboarding-title">Добавить пользователей и назначить куратора</h2><p class="description">Проверьте весь список, подготовьте неизменяемый план и только потом подтвердите запись.</p></div>
                        <button class="icon close" type="button" aria-label="Закрыть" ?disabled=${["loading", "executing"].includes(this.mode)} @click=${() => this.close()}>×</button></header>
                    <main class="body">
                        <section class="configure">
                            <label class="field"><span>Email пользователей</span><textarea class="emails" rows="5" placeholder="user@example.com"
                                .value=${this.emailInput} ?disabled=${this.mode !== "configure"}
                                @input=${(event) => {
				this.emailInput = event.currentTarget.value;
				this.updateEmailCounts();
			}}></textarea></label>
                            <div class="email-state" aria-live="polite"><span class="valid-count">Уникальных email: ${this.emailCounts.valid}</span><span class="invalid-count">Некорректных: ${this.emailCounts.invalid}</span></div>
                            <label class="field curator-field"><span>Целевой куратор</span>
                                <select class="curator" .value=${this.targetModeratorId} ?disabled=${!["configure", "review"].includes(this.mode)}
                                    @change=${(event) => {
				this.targetModeratorId = event.currentTarget.value;
				this.plan = null;
			}}>
                                    <option value="">Не выбран</option>
                                    ${(this.options?.moderators || []).map((moderator) => b`<option value=${String(moderator.id)}>${moderator.name ? `${moderator.name}${moderator.email ? ` · ${moderator.email}` : ""}` : moderator.email || `Moderator #${moderator.id}`}</option>`)}
                                </select><small>Нужен только для строк с операцией назначения.</small></label>
                        </section>
                        <section class="errors" aria-live="polite" ?hidden=${this.errors.length === 0}>${this.errors.map((error) => b`<p>${error}</p>`)}</section>
                        <section class="review" ?hidden=${!reviewVisible}><div class="review-toolbar"><strong class="review-count">${this.rows.length} строк</strong><span>Все операции по умолчанию выключены.</span></div>
                            <div class="table-wrap"><table><thead><tr><th>Пользователь</th><th>Статус</th><th>Текущие кураторы</th><th>Добавить<button class="select-all-add" type="button" ?disabled=${this.mode !== "review"} @click=${() => this.selectAll("addSelected")}>Выбрать все</button></th><th>Назначить<button class="select-all-assign" type="button" ?disabled=${this.mode !== "review"} @click=${() => this.selectAll("assignSelected")}>Выбрать все</button></th><th>Проверка / результат</th></tr></thead><tbody class="rows">${this.rows.map((row) => this.renderRow(row))}</tbody></table></div>
                        </section>
                        ${this.renderPreflight()}
                        <section class="result" ?hidden=${!completed}><label class="field"><span>Отчёт</span><textarea class="report" rows="12" readonly .value=${this.report}></textarea></label>
                            <div class="result-actions"><button class="copy secondary" type="button" @click=${() => this.options?.onCopy?.(this.report)}>Скопировать отчёт</button><button class="history secondary" type="button" ?hidden=${!this.executionId} @click=${() => this.executionId && this.options?.onOpenHistory?.(this.executionId)}>Открыть в истории</button></div></section>
                    </main>
                    <div class="live-region"><p class="status" role="status" aria-live="polite">${this.statusMessage}</p><progress class="progress" max=${this.progress.total} value=${this.progress.completed} ?hidden=${!this.progress.visible}></progress></div>
                    <footer class="footer">
                        <button class="restart secondary" type="button" ?hidden=${!completed} @click=${this.restart}>Запустить другую группу</button>
                        <button class="edit secondary" type="button" ?hidden=${this.mode !== "preflight"} @click=${this.returnToReview}>Изменить выбор</button>
                        <button class="discover primary" type="button" ?hidden=${this.mode !== "configure"} @click=${this.discover}>Проверить пользователей</button>
                        <button class="prepare primary" type="button" ?hidden=${this.mode !== "review"} @click=${this.preparePlan}>Подготовить план</button>
                        <button class="execute primary" type="button" ?hidden=${this.mode !== "preflight"} @click=${this.execute}>Подтвердить и выполнить</button>
                    </footer>
                </section>
            </div>`;
		}
	};
	if (!customElements.get("edvibe-toolbox-batch-user-onboarding-dialog")) customElements.define(BATCH_USER_ONBOARDING_DIALOG_TAG, BatchUserOnboardingDialog);
	var batchUserOnboardingDialogApi = Object.freeze({
		BATCH_USER_ONBOARDING_DIALOG_TAG,
		BatchUserOnboardingDialog
	});
	globalThis.EdVibeBatchUserOnboardingDialog = batchUserOnboardingDialogApi;
	//#endregion
	//#region src/features/batch-section-creation.js
	var DIALOG_TAG$1 = "edvibe-toolbox-batch-section-creation-dialog";
	var EXPECTED_WRITE_CODES$1 = /* @__PURE__ */ new Set([
		.../* @__PURE__ */ new Set([
			"WS_UNAVAILABLE",
			"REQUEST_TIMEOUT",
			"SEND_FAILED"
		]),
		"SERVER_REJECTED",
		"INVALID_RESPONSE"
	]);
	var TOKEN_PATTERN = /\{\{\s*([^{}]+?)\s*\}\}/g;
	function normalizeUrl(value) {
		const text = String(value || "").trim();
		if (!text) return "";
		try {
			const url = new URL(text);
			return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
		} catch (_) {
			return "";
		}
	}
	function normalizeBlock(block, index) {
		const type = String(block?.type || "").trim();
		const id = String(block?.id || `block-${index + 1}`).trim();
		if (type === "image") return Object.freeze({
			id,
			type,
			url: String(block?.url || "").trim(),
			alt: String(block?.alt || "").trim()
		});
		if (type === "text") return Object.freeze({
			id,
			type,
			text: String(block?.text || "").trim()
		});
		if (type === "link") return Object.freeze({
			id,
			type,
			label: String(block?.label || "").trim(),
			url: String(block?.url || "").trim()
		});
		return Object.freeze({
			id,
			type
		});
	}
	function validateSectionDefinition(input = {}) {
		const errors = [];
		const name = String(input?.name || "").trim();
		const blocks = Array.isArray(input?.blocks) ? input.blocks.map(normalizeBlock) : [];
		const seenIds = /* @__PURE__ */ new Set();
		if (!name) errors.push(createFeatureError("SECTION_NAME_REQUIRED", "Section name is required."));
		if (blocks.length === 0) errors.push(createFeatureError("SECTION_BLOCK_REQUIRED", "Add at least one section block."));
		for (const [index, block] of blocks.entries()) {
			if (seenIds.has(block.id)) errors.push(createFeatureError("DUPLICATE_BLOCK_ID", `Block ${index + 1} has a duplicate ID.`));
			seenIds.add(block.id);
			if (block.type === "image") {
				if (!normalizeUrl(block.url)) errors.push(createFeatureError("IMAGE_URL_REQUIRED", `Image block ${index + 1} requires an HTTP(S) URL.`));
			} else if (block.type === "text") {
				if (!block.text) errors.push(createFeatureError("TEXT_REQUIRED", `Text block ${index + 1} cannot be empty.`));
			} else if (block.type === "link") {
				if (!block.label) errors.push(createFeatureError("LINK_LABEL_REQUIRED", `Link block ${index + 1} requires a label.`));
				if (!normalizeUrl(block.url)) errors.push(createFeatureError("LINK_URL_REQUIRED", `Link block ${index + 1} requires an HTTP(S) URL.`));
			} else errors.push(createFeatureError("UNSUPPORTED_BLOCK_TYPE", `Block ${index + 1} has unsupported type "${block.type || "unknown"}".`));
		}
		return {
			definition: Object.freeze({
				name,
				blocks: Object.freeze(blocks)
			}),
			errors
		};
	}
	function normalizeLesson$2(node, index = 0) {
		const lessonId = node?.LessonId ?? node?.lessonId ?? node?.Id;
		const marathonLessonId = node?.MarathonLessonId ?? node?.marathonLessonId ?? node?.Id;
		return Object.freeze({
			lessonId: Number(lessonId),
			marathonLessonId: Number(marathonLessonId),
			number: Number(node?.Number ?? node?.number ?? index) + (node?.Number !== void 0 ? 1 : 0),
			name: String(node?.Name ?? node?.name ?? `Lesson ${index + 1}`)
		});
	}
	function extractNormalSections$1(structure) {
		const value = structure?.Value ?? structure;
		if (!value || !Array.isArray(value.Sections)) throw createFeatureError("INVALID_LESSON_RESPONSE", "The lesson response did not contain a normal sections array.");
		return value.Sections;
	}
	function freezeEntries(entries) {
		return Object.freeze(entries.map((entry) => Object.freeze({ ...entry })));
	}
	function buildPreflightPlan({ lessons, selectedLessonIds, definition, inspectionsByLessonId }) {
		const validated = validateSectionDefinition(definition);
		if (validated.errors.length > 0) throw createFeatureError("INVALID_SECTION_DEFINITION", "The section definition is invalid.", { validationErrors: validated.errors });
		const selected = new Set((selectedLessonIds || []).map(Number));
		const eligible = [];
		const rejected = [];
		for (const lesson of (lessons || []).filter((entry) => selected.has(Number(entry.lessonId)))) {
			const inspection = inspectionsByLessonId.get(Number(lesson.lessonId));
			if (!inspection || inspection.error) {
				const error = inspection?.error || createFeatureError("INVALID_LESSON_RESPONSE", "The lesson was not inspected.");
				rejected.push({
					...lesson,
					code: error.code || "INVALID_LESSON_RESPONSE",
					message: error.message || "The lesson could not be inspected."
				});
				continue;
			}
			try {
				if (extractNormalSections$1(inspection.structure).some((section) => String(section?.Name || "").trim() === validated.definition.name)) rejected.push({
					...lesson,
					code: "SECTION_NAME_COLLISION",
					message: `A section named "${validated.definition.name}" already exists.`
				});
				else eligible.push({ ...lesson });
			} catch (error) {
				rejected.push({
					...lesson,
					code: error.code || "INVALID_LESSON_RESPONSE",
					message: error.message
				});
			}
		}
		const blockSummary = validated.definition.blocks.map((block, index) => Object.freeze({
			index,
			type: block.type,
			id: block.id
		}));
		return Object.freeze({
			definition: validated.definition,
			selectedLessonIds: Object.freeze([...selected]),
			eligible: freezeEntries(eligible),
			rejected: freezeEntries(rejected),
			blockSummary: Object.freeze(blockSummary)
		});
	}
	function readPath(source, path) {
		return String(path || "").split(".").filter(Boolean).reduce((value, key) => value == null ? void 0 : value[key], source);
	}
	function resolveToken(path, context) {
		if (path.startsWith("generated.")) {
			const key = path.slice(10);
			const store = context.block ? context.blockGenerated : context.generated;
			if (!(key in store)) store[key] = context.createId();
			return store[key];
		}
		return readPath(context, path);
	}
	function resolveTemplate(value, context) {
		if (Array.isArray(value)) return value.map((entry) => resolveTemplate(entry, context));
		if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, resolveTemplate(entry, context)]));
		if (typeof value !== "string") return value;
		const exact = value.match(/^\{\{\s*([^{}]+?)\s*\}\}$/);
		if (exact) return resolveToken(exact[1], context);
		return value.replace(TOKEN_PATTERN, (_match, path) => {
			const resolved = resolveToken(path, context);
			return resolved == null ? "" : String(resolved);
		});
	}
	function validateRecipe(recipe) {
		const errors = [];
		if (!recipe || recipe.version !== 1) errors.push(createFeatureError("RECIPE_MISSING", "A version 1 recording recipe is required."));
		if (recipe && recipe.reviewedDynamicFields !== true) errors.push(createFeatureError("RECIPE_NOT_REVIEWED", "The recording recipe must explicitly confirm reviewed dynamic fields."));
		if (recipe && !Array.isArray(recipe.steps)) errors.push(createFeatureError("RECIPE_STEPS_REQUIRED", "The recording recipe requires steps."));
		for (const step of recipe?.steps || []) if (!step.controller || !step.method || !step.projectName || !step.valueTemplate) errors.push(createFeatureError("INVALID_RECIPE_STEP", `Recipe step "${step.id || step.method || "unknown"}" is incomplete.`));
		return errors;
	}
	function createRecordedCreationAdapter({ recipe = null, cryptoApi = globalThis.crypto, requestDelayMs = 300 } = {}) {
		const errors = validateRecipe(recipe);
		const createId = () => cryptoApi?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
		function expandSteps(steps, definition) {
			const expanded = [];
			for (let index = 0; index < steps.length;) {
				const step = steps[index];
				if (step.forEach !== "blocks") {
					expanded.push({
						step,
						block: null,
						blockIndex: null
					});
					index += 1;
					continue;
				}
				const group = [];
				while (index < steps.length && steps[index].forEach === "blocks") {
					group.push(steps[index]);
					index += 1;
				}
				definition.blocks.forEach((block, blockIndex) => {
					const matching = group.find((candidate) => !Array.isArray(candidate.blockTypes) || candidate.blockTypes.includes(block.type));
					if (matching) expanded.push({
						step: matching,
						block,
						blockIndex
					});
				});
			}
			return expanded;
		}
		async function executeSteps({ steps, marathonId, lesson, definition, sendRequest, wait, captured = {}, generated = {} }) {
			const blockGeneratedById = /* @__PURE__ */ new Map();
			const expanded = expandSteps(steps, definition);
			let markedCreated = false;
			for (const [index, entry] of expanded.entries()) {
				const blockGenerated = entry.block ? blockGeneratedById.get(entry.block.id) || {} : generated;
				if (entry.block) blockGeneratedById.set(entry.block.id, blockGenerated);
				const context = {
					marathonId,
					lesson,
					section: definition,
					block: entry.block,
					blockIndex: entry.blockIndex,
					captured,
					generated,
					blockGenerated,
					createId
				};
				try {
					const response = await sendRequest(entry.step.controller, entry.step.method, entry.step.projectName, resolveTemplate(entry.step.valueTemplate, context));
					for (const [name, path] of Object.entries(entry.step.capture || {})) {
						const capturedValue = readPath(response, path);
						if (capturedValue === void 0) throw createFeatureError("INVALID_RESPONSE", `Recipe capture "${name}" was missing after ${entry.step.id || entry.step.method}.`);
						captured[name] = capturedValue;
					}
					if (entry.step.marksSectionCreated === true) markedCreated = true;
					if (index < expanded.length - 1 && requestDelayMs > 0) await wait(requestDelayMs);
				} catch (error) {
					error.partialCreated = markedCreated;
					error.captured = { ...captured };
					error.generated = { ...generated };
					throw error;
				}
			}
			return {
				captured: { ...captured },
				generated: { ...generated }
			};
		}
		return Object.freeze({
			isReady: errors.length === 0,
			errors: Object.freeze(errors),
			async createSection(context) {
				if (errors.length > 0) throw createFeatureError("RECIPE_UNAVAILABLE", errors[0].message);
				return executeSteps({
					...context,
					steps: recipe.steps
				});
			},
			async cleanupSection(context) {
				if (!Array.isArray(recipe?.cleanupSteps) || recipe.cleanupSteps.length === 0) return {
					attempted: false,
					status: "unavailable"
				};
				try {
					await executeSteps({
						...context,
						steps: recipe.cleanupSteps
					});
					return {
						attempted: true,
						status: "success"
					};
				} catch (error) {
					return {
						attempted: true,
						status: "failed",
						code: error.code || "CLEANUP_FAILED",
						message: error.message
					};
				}
			}
		});
	}
	async function loadLessonCatalogue$1({ sendRequest, marathonId, pageSize = 100 }) {
		return (await loadAllMarathonLessons({
			sendRequest,
			marathonId,
			pageSize
		})).map(normalizeLesson$2);
	}
	async function inspectLessonsSequentially$1({ lessons, selectedLessonIds, sendRequest, wait, delayMs = 300 }) {
		const selected = new Set((selectedLessonIds || []).map(Number));
		const targets = (lessons || []).filter((lesson) => selected.has(Number(lesson.lessonId)));
		const inspections = /* @__PURE__ */ new Map();
		for (const [index, lesson] of targets.entries()) {
			try {
				const structure = await getLessonById({
					sendRequest,
					lessonId: lesson.lessonId
				});
				inspections.set(Number(lesson.lessonId), { structure });
			} catch (error) {
				inspections.set(Number(lesson.lessonId), { error });
			}
			if (index < targets.length - 1 && delayMs > 0) await wait(delayMs);
		}
		return inspections;
	}
	function createResult(lesson, status, details = {}) {
		return {
			lessonId: lesson.lessonId,
			marathonLessonId: lesson.marathonLessonId,
			lessonNumber: lesson.number,
			lessonName: lesson.name,
			status,
			...details
		};
	}
	function isFatalError(error, getConnectionState) {
		if (error?.code === "WS_UNAVAILABLE") return true;
		if (error?.code === "SEND_FAILED" && !getConnectionState().isOpen) return true;
		return !EXPECTED_WRITE_CODES$1.has(error?.code);
	}
	async function executeCreationPlan({ marathonId, plan, adapter, sendRequest, wait, getConnectionState, lessonDelayMs = 300, onProgress = () => {} }) {
		if (!adapter?.isReady) throw createFeatureError("RECIPE_UNAVAILABLE", adapter?.errors?.[0]?.message || "Recording recipe unavailable.");
		const results = plan.rejected.map((lesson) => createResult(lesson, "rejected", {
			code: lesson.code,
			message: lesson.message
		}));
		let attempts = 0;
		for (const [index, lesson] of plan.eligible.entries()) {
			onProgress({
				completed: index,
				total: plan.eligible.length,
				lesson,
				results: [...results]
			});
			try {
				attempts += 1;
				const created = await adapter.createSection({
					marathonId,
					lesson,
					definition: plan.definition,
					sendRequest,
					wait
				});
				results.push(createResult(lesson, "created", {
					captured: created.captured,
					generated: created.generated,
					attempts: 1
				}));
			} catch (error) {
				const partial = Boolean(error.partialCreated);
				const fatal = isFatalError(error, getConnectionState);
				let cleanup = null;
				if (partial && !fatal) cleanup = await adapter.cleanupSection({
					marathonId,
					lesson,
					definition: plan.definition,
					sendRequest,
					wait,
					captured: error.captured || {},
					generated: error.generated || {}
				});
				results.push(createResult(lesson, partial ? "partially_created" : "failed", {
					code: error.code || "UNKNOWN_ERROR",
					message: error.message || "Section creation failed.",
					captured: error.captured,
					generated: error.generated,
					cleanup,
					attempts: error.attempts || 1
				}));
				if (fatal) {
					for (const remaining of plan.eligible.slice(index + 1)) results.push(createResult(remaining, "not_attempted", {
						code: "OPERATION_INTERRUPTED",
						message: "Not attempted because the batch operation stopped."
					}));
					error.partialResult = {
						definition: plan.definition,
						results,
						attempts,
						fatalError: error
					};
					throw error;
				}
			}
			onProgress({
				completed: index + 1,
				total: plan.eligible.length,
				lesson,
				results: [...results]
			});
			if (index < plan.eligible.length - 1 && lessonDelayMs > 0) await wait(lessonDelayMs);
		}
		return {
			definition: plan.definition,
			results,
			attempts
		};
	}
	function formatCreationReport(result) {
		const rows = Array.isArray(result?.results) ? result.results : [];
		const counts = (status) => rows.filter((entry) => entry.status === status).length;
		const lines = [
			`Section: ${result?.definition?.name || "Unknown"}`,
			`Blocks: ${result?.definition?.blocks?.length || 0}`,
			`Created: ${counts("created")}`,
			`Rejected in preflight: ${counts("rejected")}`,
			`Failed: ${counts("failed")}`,
			`Partially created: ${counts("partially_created")}`,
			`Not attempted: ${counts("not_attempted")}`,
			""
		];
		for (const entry of rows) {
			lines.push(`${entry.lessonNumber || "?"}. ${entry.lessonName} — ${entry.status}` + (entry.code ? ` — ${entry.code}: ${entry.message || ""}` : ""));
			if (entry.captured?.sectionId !== void 0) lines.push(`  Captured sectionId: ${entry.captured.sectionId}`);
			if (entry.cleanup) lines.push(`  Cleanup: ${entry.cleanup.status}`);
		}
		return lines.join("\n").trim();
	}
	function createBatchSectionCreationFeature({ sendRequest, getConnectionState, wait, canStart, onActiveChange, adapter, createDialog = () => document.createElement(DIALOG_TAG$1), copyText = async () => {}, log = () => {} }) {
		let active = false;
		let running = false;
		let dialog = null;
		let marathonId = null;
		let lessons = [];
		let pendingPlan = null;
		let completedResult = null;
		function release() {
			if (active) {
				active = false;
				onActiveChange(false);
			}
		}
		function close() {
			running = false;
			dialog = null;
			lessons = [];
			pendingPlan = null;
			completedResult = null;
			release();
		}
		async function preflight(event) {
			if (running) return;
			running = true;
			try {
				const definition = event?.detail?.definition || {};
				const selectedLessonIds = event?.detail?.selectedLessonIds || [];
				const validation = validateSectionDefinition(definition);
				const errors = [...validation.errors];
				if (selectedLessonIds.length === 0) errors.push(createFeatureError("LESSON_SELECTION_REQUIRED", "Select at least one lesson."));
				if (errors.length > 0) {
					dialog.showValidationErrors(errors);
					return;
				}
				dialog.showLoading("Проверяем выбранные уроки…");
				const inspections = await inspectLessonsSequentially$1({
					lessons,
					selectedLessonIds,
					sendRequest,
					wait
				});
				pendingPlan = buildPreflightPlan({
					lessons,
					selectedLessonIds,
					definition: validation.definition,
					inspectionsByLessonId: inspections
				});
				dialog.showConfirmation(pendingPlan);
			} catch (error) {
				dialog.showValidationErrors([error]);
			} finally {
				running = false;
			}
		}
		async function confirm() {
			if (running || !pendingPlan?.eligible?.length) return;
			running = true;
			try {
				completedResult = await executeCreationPlan({
					marathonId,
					plan: pendingPlan,
					adapter,
					sendRequest,
					wait,
					getConnectionState,
					onProgress: (progress) => dialog.showExecution(progress)
				});
				dialog.showComplete(completedResult);
			} catch (error) {
				completedResult = error.partialResult || {
					definition: pendingPlan.definition,
					results: pendingPlan.rejected,
					fatalError: error
				};
				dialog.showComplete(completedResult, error);
			} finally {
				running = false;
			}
		}
		async function copyReport() {
			if (completedResult) await copyText(formatCreationReport(completedResult));
		}
		function restart() {
			pendingPlan = null;
			completedResult = null;
			dialog.showConfigure({
				lessons,
				recipeReady: adapter?.isReady,
				recipeErrors: adapter?.errors || []
			});
		}
		async function open() {
			if (active || document.getElementById("edvibe-toolbox-batch-section-creation-overlay")) return;
			if (!canStart()) {
				window.alert("Another Edvibe Toolbox operation is already running.");
				return;
			}
			marathonId = parseMarathonId$3(window.location.href);
			if (!marathonId) {
				window.alert("Open an Edvibe marathon page before creating sections.");
				return;
			}
			active = true;
			onActiveChange(true);
			try {
				dialog = createDialog();
				dialog.addEventListener("edvibe-dialog-close", close);
				dialog.addEventListener("edvibe-batch-section-preflight", preflight);
				dialog.addEventListener("edvibe-batch-section-confirm", confirm);
				dialog.addEventListener("edvibe-batch-section-copy", copyReport);
				dialog.addEventListener("edvibe-batch-section-restart", restart);
				dialog.configure();
				(document.body || document.documentElement).appendChild(dialog);
				dialog.showLoading("Загружаем уроки марафона…");
				lessons = await loadLessonCatalogue$1({
					sendRequest,
					marathonId
				});
				if (lessons.length === 0) throw createFeatureError("EMPTY_LESSON_CATALOGUE", "No lessons were found.");
				dialog.showConfigure({
					lessons,
					recipeReady: adapter?.isReady,
					recipeErrors: adapter?.errors || []
				});
				log(`Batch section creation ready for MarathonId ${marathonId}.`);
			} catch (error) {
				log(`Batch section creation initialization failed (${error.code || "UNKNOWN_ERROR"}).`);
				try {
					dialog?.showFatalError?.(error);
				} finally {
					release();
				}
			}
		}
		return {
			open,
			isRunning: () => running
		};
	}
	//#endregion
	//#region src/features/batch-section-creation-history-model.js
	var OPERATION_TYPE$1 = "batch_section_creation";
	var TERMINAL_STATUSES$2 = Object.freeze([
		"completed",
		"completed_with_failures",
		"cancelled",
		"interrupted"
	]);
	var ATTEMPTED_STATUSES$1 = Object.freeze([
		"created",
		"failed",
		"partially_created"
	]);
	var FAILURE_STATUSES = Object.freeze(["failed", "partially_created"]);
	var SENSITIVE_IDENTIFIER_WORDS = /* @__PURE__ */ new Set([
		"auth",
		"authorization",
		"cookie",
		"credential",
		"credentials",
		"password",
		"response",
		"session",
		"token",
		"transport",
		"websocket"
	]);
	function parseMarathonId$1(url) {
		const match = String(url || "").match(/\/marathon\/(\d+)(?:\/|$)/);
		return match ? String(match[1]) : null;
	}
	function text$1(value, fallback = "", maxLength = 4e3) {
		const normalized = String(value ?? "").trim();
		if (!normalized) return fallback;
		return normalized.length <= maxLength ? normalized : `${normalized.slice(0, Math.max(0, maxLength - 1))}…`;
	}
	function safeUrl(value) {
		const normalized = text$1(value);
		if (!normalized) return null;
		try {
			const url = new URL(normalized);
			return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
		} catch (_) {
			return null;
		}
	}
	function safeBlockText(value, maxLength) {
		return text$1(value, "", maxLength).replace(/data:image\/[^;,<>"'\s]+(?:;[^,<>"'\s]+)*;base64,[a-z0-9+/=\r\n]+/gi, "[redacted image data]");
	}
	function freezeArray(entries) {
		return Object.freeze(entries.map((entry) => Object.freeze(entry)));
	}
	function summarizeBlock(block, index) {
		const type = text$1(block?.type, "unknown", 80);
		const summary = {
			order: index,
			blockId: text$1(block?.id, `block-${index + 1}`, 160),
			type
		};
		const clientId = text$1(block?.clientId, "", 500);
		if (clientId) summary.clientId = clientId;
		if (type === "image") {
			summary.url = safeUrl(block?.url);
			summary.alt = safeBlockText(block?.alt, 1e3) || null;
		} else if (type === "text") summary.content = safeBlockText(block?.text, 1e4) || null;
		else if (type === "link") {
			summary.label = safeBlockText(block?.label, 1e3) || null;
			summary.url = safeUrl(block?.url);
		}
		return summary;
	}
	function serializeSectionDefinition(definition = {}) {
		const blocks = Array.isArray(definition?.blocks) ? definition.blocks.map(summarizeBlock) : [];
		return Object.freeze({
			name: text$1(definition?.name, "Unnamed section", 500),
			blocks: freezeArray(blocks)
		});
	}
	function words(value) {
		return String(value || "").replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
	}
	function isSafeIdentifierPath(path) {
		const leaf = words(path.at(-1));
		const allParts = path.flatMap(words);
		return leaf.includes("id") && !allParts.some((part) => SENSITIVE_IDENTIFIER_WORDS.has(part));
	}
	function collectIdentifiers(source, sourceName, output, path = [], depth = 0, seen = /* @__PURE__ */ new WeakSet()) {
		if (source === null || source === void 0 || depth > 5) return;
		if (typeof source !== "object") {
			if (!isSafeIdentifierPath(path)) return;
			const value = typeof source === "number" || typeof source === "boolean" ? source : text$1(source, "", 500);
			if (value === "") return;
			output.push({
				source: sourceName,
				name: path.join("."),
				value
			});
			return;
		}
		if (seen.has(source)) return;
		seen.add(source);
		try {
			if (Array.isArray(source)) {
				source.forEach((entry, index) => collectIdentifiers(entry, sourceName, output, [...path, String(index)], depth + 1, seen));
				return;
			}
			for (const [key, value] of Object.entries(source)) collectIdentifiers(value, sourceName, output, [...path, key], depth + 1, seen);
		} finally {
			seen.delete(source);
		}
	}
	function serializeIdentifiers(result = {}) {
		const entries = [];
		collectIdentifiers(result?.captured, "captured", entries);
		collectIdentifiers(result?.generated, "generated", entries);
		collectIdentifiers(result?.blockGenerated, "block_generated", entries);
		const deduplicated = [];
		const seen = /* @__PURE__ */ new Set();
		for (const entry of entries) {
			const key = `${entry.source}\u0000${entry.name}\u0000${String(entry.value)}`;
			if (seen.has(key)) continue;
			seen.add(key);
			deduplicated.push(entry);
		}
		return freezeArray(deduplicated);
	}
	function normalizeLesson$1(value = {}, fallbackId = null) {
		const lessonId = value.lessonId ?? value.LessonId ?? fallbackId;
		const marathonLessonId = value.marathonLessonId ?? value.MarathonLessonId ?? null;
		const number = value.lessonNumber ?? value.number ?? value.Number ?? null;
		const name = value.lessonName ?? value.name ?? value.Name ?? null;
		return Object.freeze({
			lessonId: lessonId === void 0 || lessonId === null ? null : lessonId,
			marathonLessonId: marathonLessonId === void 0 ? null : marathonLessonId,
			number: number === void 0 ? null : number,
			name: text$1(name, "Unnamed lesson", 500)
		});
	}
	function lessonKey$1(value) {
		const lessonId = value?.lessonId ?? value?.LessonId;
		return lessonId === void 0 || lessonId === null ? null : String(lessonId);
	}
	function asExecutionResult(value, fallbackStatus, terminalStatus) {
		return {
			lessonId: value?.lessonId ?? value?.LessonId ?? null,
			marathonLessonId: value?.marathonLessonId ?? value?.MarathonLessonId ?? null,
			lessonNumber: value?.lessonNumber ?? value?.number ?? value?.Number ?? null,
			lessonName: value?.lessonName ?? value?.name ?? value?.Name ?? null,
			status: value?.status || fallbackStatus,
			code: value?.code,
			message: value?.message,
			attempts: value?.attempts,
			captured: value?.captured,
			generated: value?.generated,
			blockGenerated: value?.blockGenerated,
			cleanup: value?.cleanup,
			terminalStatus
		};
	}
	function materializeResults$1(plan = {}, executionResult = {}, terminalStatus = null) {
		const rejectedByLesson = /* @__PURE__ */ new Map();
		for (const entry of plan?.rejected || []) {
			const key = lessonKey$1(entry);
			if (key !== null) rejectedByLesson.set(key, asExecutionResult(entry, "rejected", terminalStatus));
		}
		const finalByLesson = /* @__PURE__ */ new Map();
		for (const entry of executionResult?.results || []) {
			const key = lessonKey$1(entry);
			if (key === null) continue;
			const fallbackStatus = entry?.status || (rejectedByLesson.has(key) ? "rejected" : null);
			finalByLesson.set(key, asExecutionResult(entry, fallbackStatus, terminalStatus));
		}
		const eligibleByLesson = /* @__PURE__ */ new Map();
		for (const entry of plan?.eligible || []) {
			const key = lessonKey$1(entry);
			if (key !== null) eligibleByLesson.set(key, entry);
		}
		const selectedIds = Array.isArray(plan?.selectedLessonIds) ? plan.selectedLessonIds.map(String) : [];
		const ordered = [];
		const included = /* @__PURE__ */ new Set();
		for (const id of selectedIds) {
			let entry = finalByLesson.get(id) || rejectedByLesson.get(id);
			if (!entry && eligibleByLesson.has(id)) entry = asExecutionResult(eligibleByLesson.get(id), "not_attempted", terminalStatus);
			if (!entry) entry = asExecutionResult({
				lessonId: id,
				lessonName: `Lesson ${id}`
			}, "not_attempted", terminalStatus);
			ordered.push(entry);
			included.add(id);
		}
		for (const entry of [...rejectedByLesson.values(), ...finalByLesson.values()]) {
			const key = lessonKey$1(entry);
			if (key !== null && included.has(key)) continue;
			ordered.push(entry);
			if (key !== null) included.add(key);
		}
		for (const [key, entry] of eligibleByLesson.entries()) {
			if (included.has(key)) continue;
			ordered.push(asExecutionResult(entry, "not_attempted", terminalStatus));
			included.add(key);
		}
		return ordered;
	}
	function isAttemptedStatus(status) {
		return ATTEMPTED_STATUSES$1.includes(status);
	}
	function isFailureStatus(status) {
		return FAILURE_STATUSES.includes(status);
	}
	function buildCounts(results, plan = {}) {
		const attempted = results.filter((result) => isAttemptedStatus(result.status)).length;
		const notAttempted = results.filter((result) => result.status === "not_attempted").length;
		const inferredEligible = attempted + notAttempted;
		const plannedEligible = Array.isArray(plan?.eligible) ? plan.eligible.length : 0;
		return Object.freeze({
			requested: results.length,
			eligible: Math.max(plannedEligible, inferredEligible),
			attempted,
			successful: results.filter((result) => result.status === "created").length,
			noOp: 0,
			skipped: results.filter((result) => result.status === "rejected").length,
			failed: results.filter((result) => isFailureStatus(result.status)).length,
			notAttempted
		});
	}
	//#endregion
	//#region src/features/batch-section-creation-history-record.js
	var TERMINAL_STATUSES$1 = new Set(TERMINAL_STATUSES$2);
	function resultCode$1(result, terminalStatus) {
		if (result?.code) return text$1(result.code, "UNKNOWN_ERROR", 120);
		return {
			created: "SECTION_CREATED",
			rejected: "PREFLIGHT_REJECTED",
			failed: "SECTION_CREATION_FAILED",
			partially_created: "SECTION_PARTIALLY_CREATED",
			not_attempted: terminalStatus === "cancelled" ? "OPERATION_CANCELLED" : "OPERATION_INTERRUPTED"
		}[result?.status] || "UNKNOWN_RESULT";
	}
	function resultMessage$1(result, terminalStatus) {
		if (result?.message) return text$1(result.message, "No message was provided.", 1e3);
		return {
			created: "Section created successfully.",
			rejected: "The lesson was rejected during preflight.",
			failed: "Section creation failed.",
			partially_created: "Section creation failed after the section had been created.",
			not_attempted: terminalStatus === "cancelled" ? "Not attempted because the confirmed run was cancelled." : "Not attempted because the confirmed run was interrupted."
		}[result?.status] || "The operation produced an unknown result.";
	}
	function serializeCleanup(result, terminalStatus) {
		if (result?.status !== "partially_created") return null;
		const cleanup = result?.cleanup;
		if (!cleanup) return Object.freeze({
			attempted: false,
			status: "unavailable",
			code: terminalStatus === "interrupted" ? "CLEANUP_UNAVAILABLE_AFTER_INTERRUPTION" : "CLEANUP_UNAVAILABLE",
			message: terminalStatus === "interrupted" ? "Cleanup was unavailable after the batch was interrupted." : "Cleanup was unavailable for this partially created section."
		});
		const attempted = Boolean(cleanup.attempted);
		const status = [
			"success",
			"failed",
			"unavailable"
		].includes(cleanup.status) ? cleanup.status : attempted ? "failed" : "unavailable";
		return Object.freeze({
			attempted,
			status,
			code: cleanup.code ? text$1(cleanup.code, "CLEANUP_FAILED", 120) : status === "success" ? "CLEANUP_SUCCEEDED" : status === "unavailable" ? "CLEANUP_UNAVAILABLE" : "CLEANUP_FAILED",
			message: cleanup.message ? text$1(cleanup.message, "Cleanup failed.", 1e3) : status === "success" ? "Cleanup completed successfully." : status === "unavailable" ? "Cleanup was unavailable." : "Cleanup failed."
		});
	}
	function serializeCreationFailure(result, terminalStatus) {
		if (!isFailureStatus(result?.status)) return null;
		return Object.freeze({
			code: resultCode$1(result, terminalStatus),
			message: resultMessage$1(result, terminalStatus),
			attemptCount: Number.isSafeInteger(result?.attempts) && result.attempts >= 0 ? result.attempts : 1
		});
	}
	function serializeResult$1(result, definitionSummary, terminalStatus) {
		const lesson = normalizeLesson$1(result);
		const status = text$1(result?.status, "not_attempted", 80);
		const attempts = Number.isSafeInteger(result?.attempts) && result.attempts >= 0 ? result.attempts : isAttemptedStatus(status) ? 1 : 0;
		const normalizedResult = {
			...result,
			status
		};
		const code = resultCode$1(normalizedResult, terminalStatus);
		const message = resultMessage$1(normalizedResult, terminalStatus);
		return Object.freeze({
			itemId: lesson.lessonId === null ? null : String(lesson.lessonId),
			label: `${lesson.number ?? "?"}. ${lesson.name}`,
			status,
			code,
			message,
			attempts,
			data: Object.freeze({
				lesson,
				section: definitionSummary,
				preflight: Object.freeze({
					status: status === "rejected" ? "rejected" : "eligible",
					code: status === "rejected" ? code : "PREFLIGHT_ELIGIBLE",
					message: status === "rejected" ? message : "The lesson passed preflight and was included in the confirmed plan."
				}),
				creationFailure: serializeCreationFailure(normalizedResult, terminalStatus),
				cleanup: serializeCleanup(normalizedResult, terminalStatus),
				identifiers: serializeIdentifiers(result)
			})
		});
	}
	function inferTerminalStatus$1(explicitStatus, fatalError, results) {
		if (TERMINAL_STATUSES$1.has(explicitStatus)) return explicitStatus;
		if (fatalError) return "interrupted";
		return results.some((result) => [
			"rejected",
			"failed",
			"partially_created",
			"not_attempted"
		].includes(result.status)) ? "completed_with_failures" : "completed";
	}
	function buildExecutionHistoryInput$2({ plan, result = {}, startedAt, completedAt, marathonId, marathonName = null, terminalStatus = null, fatalError = null }) {
		const materializationStatus = TERMINAL_STATUSES$1.has(terminalStatus) ? terminalStatus : fatalError ? "interrupted" : null;
		const definitionSummary = serializeSectionDefinition(plan?.definition || result?.definition || {});
		const results = materializeResults$1(plan, result, materializationStatus).map((entry) => serializeResult$1(entry, definitionSummary, materializationStatus));
		const status = inferTerminalStatus$1(terminalStatus, fatalError || result?.fatalError, results);
		const counts = buildCounts(results, plan);
		return Object.freeze({
			operationType: OPERATION_TYPE$1,
			startedAt,
			completedAt,
			status,
			pageContext: Object.freeze({
				marathonId,
				marathonName
			}),
			counts,
			results: Object.freeze(results),
			message: JSON.stringify({
				sectionName: definitionSummary.name,
				blockCount: definitionSummary.blocks.length,
				counts
			})
		});
	}
	//#endregion
	//#region src/features/batch-section-creation-history.js
	function appendStatus$1(dialog, message, isError = false) {
		const current = dialog.elements?.status?.textContent || "";
		dialog.setStatus?.(`${current}${current ? " " : ""}${message}`, isError ? "error" : "");
	}
	function addHistoryButton$1(dialog, executionId, openHistory) {
		dialog.shadowRoot?.querySelector?.(".edvibe-batch-section-history")?.remove?.();
		const button = (dialog.ownerDocument || globalThis.document)?.createElement?.("button");
		if (!button) return;
		button.type = "button";
		button.className = "edvibe-batch-section-history";
		button.textContent = "Открыть в истории";
		button.addEventListener("click", () => {
			dialog.close?.();
			openHistory(executionId);
		});
		(dialog.elements?.footer || dialog.shadowRoot?.querySelector?.(".edvibe-batch-section-footer"))?.appendChild?.(button);
	}
	function createHistoryAwareDialog({ createDialog, persistExecution, openHistory = () => {}, getLocationHref = () => "", getMarathonName = () => null, now = () => /* @__PURE__ */ new Date(), log = () => {} }) {
		if (typeof createDialog !== "function") throw new TypeError("createDialog is required");
		if (typeof persistExecution !== "function") throw new TypeError("persistExecution is required");
		return function createPatchedDialog() {
			const dialog = createDialog();
			let confirmedPlan = null;
			let latestResult = null;
			let startedAt = null;
			let terminal = false;
			let sequence = 0;
			const originalShowConfigure = dialog.showConfigure.bind(dialog);
			const originalShowConfirmation = dialog.showConfirmation.bind(dialog);
			const originalShowExecution = dialog.showExecution.bind(dialog);
			const originalShowComplete = dialog.showComplete.bind(dialog);
			const originalShowFatalError = dialog.showFatalError.bind(dialog);
			function clearHistoryButton() {
				dialog.shadowRoot?.querySelector?.(".edvibe-batch-section-history")?.remove?.();
			}
			function resetAttempt() {
				sequence += 1;
				confirmedPlan = null;
				latestResult = null;
				startedAt = null;
				terminal = false;
				clearHistoryButton();
			}
			function persist(result, terminalStatus = null, fatalError = null) {
				if (!confirmedPlan || terminal) return;
				terminal = true;
				const currentSequence = sequence;
				let input;
				try {
					const completedAt = now().toISOString();
					input = buildExecutionHistoryInput$2({
						plan: confirmedPlan,
						result: result || latestResult || {},
						startedAt: startedAt || completedAt,
						completedAt,
						marathonId: parseMarathonId$1(getLocationHref()),
						marathonName: getMarathonName(),
						terminalStatus,
						fatalError
					});
				} catch (error) {
					appendStatus$1(dialog, "Экранный результат сохранён, но записать историю не удалось.", true);
					log("Batch section creation history record creation failed:", error);
					return;
				}
				Promise.resolve().then(() => persistExecution(input)).then((history) => {
					if (currentSequence !== sequence) return;
					if (history?.stored) {
						appendStatus$1(dialog, "Результат сохранён в истории.");
						if (history.record?.id) addHistoryButton$1(dialog, history.record.id, openHistory);
					} else {
						appendStatus$1(dialog, "Экранный результат сохранён, но записать историю не удалось.", true);
						if (history?.persistenceError) log("Batch section creation history persistence failed:", history.persistenceError);
					}
				}).catch((error) => {
					if (currentSequence !== sequence) return;
					appendStatus$1(dialog, "Экранный результат сохранён, но записать историю не удалось.", true);
					log("Batch section creation history persistence failed:", error);
				});
			}
			dialog.showConfigure = (...args) => {
				resetAttempt();
				return originalShowConfigure(...args);
			};
			dialog.showConfirmation = (plan) => {
				sequence += 1;
				clearHistoryButton();
				confirmedPlan = plan;
				latestResult = {
					definition: plan?.definition,
					results: Array.isArray(plan?.rejected) ? plan.rejected.map((entry) => asExecutionResult(entry, "rejected")) : []
				};
				startedAt = now().toISOString();
				terminal = false;
				const output = originalShowConfirmation(plan);
				if (!plan?.eligible?.length) persist(latestResult);
				return output;
			};
			dialog.showExecution = (progress = {}) => {
				if (confirmedPlan && Array.isArray(progress?.results)) latestResult = {
					definition: confirmedPlan.definition,
					results: [...progress.results]
				};
				return originalShowExecution(progress);
			};
			dialog.showComplete = (result = {}, fatalError = null) => {
				const output = originalShowComplete(result, fatalError);
				latestResult = result;
				persist(result, fatalError ? "interrupted" : null, fatalError);
				return output;
			};
			dialog.showFatalError = (error) => {
				const output = originalShowFatalError(error);
				if (confirmedPlan) persist(latestResult, "interrupted", error);
				return output;
			};
			dialog.addEventListener("edvibe-batch-section-restart", resetAttempt);
			dialog.addEventListener("edvibe-dialog-close", () => {
				if (confirmedPlan && !terminal) persist(latestResult, "cancelled");
			});
			return dialog;
		};
	}
	//#endregion
	//#region src/components/batch-section-creation-dialog.styles.js
	var batchSectionCreationDialogStyles = i$3`
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

`;
	//#endregion
	//#region src/components/batch-section-image-upload.styles.js
	var batchSectionImageUploadStyles = i$3`
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

`;
	//#endregion
	//#region src/components/batch-section-image-upload.js
	var IMAGE_PLACEHOLDER_PREFIX$1 = "https://media-files-y.edvibe.com/local-upload/";
	function createClientId(cryptoApi = globalThis.crypto) {
		return cryptoApi?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
	}
	function createPlaceholderUrl(clientId) {
		return `${IMAGE_PLACEHOLDER_PREFIX$1}${encodeURIComponent(String(clientId || ""))}`;
	}
	function parseClientId$1(value) {
		const text = String(value || "");
		if (!text.startsWith("https://media-files-y.edvibe.com/local-upload/")) return "";
		try {
			return decodeURIComponent(text.slice(46));
		} catch (_) {
			return "";
		}
	}
	function formatFileSize(value) {
		const bytes = Math.max(0, Number(value) || 0);
		if (bytes < 1024) return `${bytes} Б`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
	}
	function createRegistry() {
		const files = /* @__PURE__ */ new Map();
		return Object.freeze({
			register(clientId, file) {
				if (clientId && file) files.set(String(clientId), file);
			},
			get(clientId) {
				return files.get(String(clientId || "")) || null;
			},
			remove(clientId) {
				files.delete(String(clientId || ""));
			},
			clear() {
				files.clear();
			},
			size() {
				return files.size;
			}
		});
	}
	function enhanceImageBlock(block, cryptoApi = globalThis.crypto) {
		const clientId = block?.clientId || parseClientId$1(block?.url) || createClientId(cryptoApi);
		return {
			...block,
			clientId,
			url: createPlaceholderUrl(clientId),
			alt: String(block?.alt || ""),
			fileName: String(block?.fileName || ""),
			fileSize: Math.max(0, Number(block?.fileSize) || 0),
			fileType: String(block?.fileType || ""),
			previewUrl: String(block?.previewUrl || ""),
			fileError: String(block?.fileError || "")
		};
	}
	var BatchSectionImageUploadController = class {
		constructor({ registry = createRegistry(), urlApi = globalThis.URL, cryptoApi = globalThis.crypto } = {}) {
			this.registry = registry;
			this.urlApi = urlApi;
			this.cryptoApi = cryptoApi;
		}
		createBlock(block = {}) {
			return enhanceImageBlock(block, this.cryptoApi);
		}
		hasSelectedFile(block) {
			if (!block || block.type !== "image") return true;
			return Boolean(this.registry.get(block.clientId || parseClientId$1(block.url)));
		}
		canSubmit(blocks = []) {
			return !blocks.some((block) => block.type === "image" && !this.hasSelectedFile(block));
		}
		selectFile(block, file) {
			const released = this.releaseBlock(block);
			if (!file) return released;
			if (!String(file.type || "").startsWith("image/")) return {
				...released,
				fileError: "Выберите файл изображения."
			};
			const clientId = released.clientId || createClientId(this.cryptoApi);
			const previewUrl = this.urlApi?.createObjectURL?.(file) || "";
			this.registry.register(clientId, file);
			return {
				...released,
				clientId,
				url: createPlaceholderUrl(clientId),
				fileName: String(file.name || ""),
				fileSize: Math.max(0, Number(file.size) || 0),
				fileType: String(file.type || ""),
				previewUrl,
				fileError: ""
			};
		}
		clearFile(block) {
			return this.releaseBlock(block);
		}
		releaseBlock(block) {
			if (!block || block.type !== "image") return block;
			const clientId = block.clientId || parseClientId$1(block.url);
			if (clientId) this.registry.remove(clientId);
			if (block.previewUrl) this.urlApi?.revokeObjectURL?.(block.previewUrl);
			return {
				...enhanceImageBlock({
					...block,
					clientId
				}, this.cryptoApi),
				fileName: "",
				fileSize: 0,
				fileType: "",
				previewUrl: "",
				fileError: ""
			};
		}
		releaseAll(blocks = []) {
			return blocks.map((block) => this.releaseBlock(block));
		}
	};
	var registry = createRegistry();
	var controller = new BatchSectionImageUploadController({ registry });
	//#endregion
	//#region src/components/batch-section-creation-dialog.js
	var BATCH_SECTION_DIALOG_TAG = "edvibe-toolbox-batch-section-creation-dialog";
	var BATCH_SECTION_OVERLAY_ID = "edvibe-toolbox-batch-section-creation-overlay";
	var BatchSectionCreationDialog = class extends i {
		static styles = [
			componentFoundationStyles,
			dialogFoundationStyles,
			batchSectionCreationDialogStyles,
			batchSectionImageUploadStyles
		];
		static properties = {
			lessons: { state: true },
			selectedLessonIds: { state: true },
			blocks: { state: true },
			sectionName: { state: true },
			mode: { state: true },
			recipeReady: { state: true },
			recipeErrors: { state: true },
			currentPlan: { state: true },
			errors: { state: true },
			result: { state: true },
			fatalResultError: { state: true },
			statusMessage: { state: true },
			statusState: { state: true },
			progress: { state: true }
		};
		constructor() {
			super();
			this.imageController = controller;
			this.lessons = [];
			this.selectedLessonIds = /* @__PURE__ */ new Set();
			this.blocks = [];
			this.sectionName = "";
			this.nextBlockId = 1;
			this.mode = "initializing";
			this.recipeReady = false;
			this.recipeErrors = [];
			this.currentPlan = null;
			this.errors = [];
			this.result = null;
			this.fatalResultError = null;
			this.statusMessage = "";
			this.statusState = "";
			this.progress = {
				visible: false,
				completed: 0,
				total: 0
			};
			this.onKeydownBound = (event) => this.onKeydown(event);
		}
		connectedCallback() {
			super.connectedCallback();
			if (!this.id) this.id = BATCH_SECTION_OVERLAY_ID;
			this.ownerDocument?.addEventListener("keydown", this.onKeydownBound);
		}
		disconnectedCallback() {
			this.releaseImageFiles();
			this.ownerDocument?.removeEventListener("keydown", this.onKeydownBound);
			super.disconnectedCallback();
		}
		configure(options = {}) {
			options = options && typeof options === "object" ? options : {};
			if (options.imageController) this.imageController = options.imageController;
			return this;
		}
		showLoading(message = "Загрузка…") {
			this.mode = "loading";
			this.clearMessages();
			this.setStatus(message);
			return this;
		}
		showConfigure({ lessons = this.lessons, recipeReady = false, recipeErrors = [] } = {}) {
			this.mode = "configure";
			this.lessons = Array.isArray(lessons) ? lessons : [];
			this.recipeReady = Boolean(recipeReady);
			this.recipeErrors = Array.isArray(recipeErrors) ? recipeErrors : [];
			this.selectedLessonIds = /* @__PURE__ */ new Set();
			this.currentPlan = null;
			this.progress = {
				visible: false,
				completed: 0,
				total: 0
			};
			this.clearMessages();
			this.setStatus("Настройте раздел и выберите уроки.");
			return this;
		}
		showValidationErrors(errors = []) {
			this.mode = "validation-error";
			this.errors = this.normalizeErrors(errors);
			this.currentPlan = null;
			this.result = null;
			this.setStatus("Исправьте ошибки и повторите проверку.", "error");
			return this;
		}
		showConfirmation(plan) {
			this.mode = "confirm";
			this.currentPlan = plan;
			this.clearMessages();
			this.setStatus(plan?.eligible?.length ? "Проверка завершена. Подтвердите создание." : "Нет уроков, подходящих для создания.", "warning");
			return this;
		}
		showExecution(progress = {}) {
			this.mode = "executing";
			const completed = Math.max(0, Number(progress.completed) || 0);
			const total = Math.max(0, Number(progress.total) || 0);
			this.progress = {
				visible: true,
				completed,
				total
			};
			const lesson = progress.lesson ? ` Сейчас: ${progress.lesson.number}. ${progress.lesson.name}.` : "";
			this.setStatus(`Выполнено ${completed} из ${total}.${lesson}`);
			return this;
		}
		showComplete(result = {}, fatalError = null) {
			this.mode = "complete";
			this.clearMessages();
			this.result = result;
			this.fatalResultError = fatalError;
			this.progress = {
				visible: false,
				completed: 0,
				total: 0
			};
			this.setStatus(fatalError ? "Операция остановлена. Частичный результат сохранён." : "Пакетная операция завершена.", fatalError ? "error" : "");
			return this;
		}
		showFatalError(error) {
			this.mode = "fatal-error";
			this.clearMessages();
			this.errors = this.normalizeErrors([error]);
			this.setStatus("Не удалось открыть инструмент.", "error");
			return this;
		}
		clearMessages() {
			this.errors = [];
			this.result = null;
			this.fatalResultError = null;
			this.statusMessage = "";
			this.statusState = "";
		}
		normalizeErrors(errors) {
			return (Array.isArray(errors) ? errors : [errors]).map((error) => ({
				code: error?.code || "ERROR",
				message: error?.message || String(error)
			}));
		}
		setStatus(message, state = "") {
			this.statusMessage = String(message || "");
			this.statusState = String(state || "");
		}
		createBlock(type) {
			const block = {
				id: `block-${this.nextBlockId++}`,
				type
			};
			if (type === "image") return this.imageController.createBlock({
				...block,
				url: "",
				alt: ""
			});
			if (type === "text") return {
				...block,
				text: ""
			};
			return {
				...block,
				label: "",
				url: ""
			};
		}
		blockLabel(type) {
			return {
				image: "Баннер",
				text: "Текст",
				link: "Ссылка"
			}[type] || type;
		}
		collectDefinition() {
			return {
				name: this.sectionName,
				blocks: this.blocks.map((block) => ({ ...block }))
			};
		}
		updateBlock(blockId, field, value) {
			this.blocks = this.blocks.map((block) => block.id === blockId ? {
				...block,
				[field]: value
			} : block);
		}
		replaceBlock(blockId, replacement) {
			this.blocks = this.blocks.map((block) => block.id === blockId ? replacement : block);
		}
		onImageFileChange(block, event) {
			const file = event.currentTarget.files?.[0] || null;
			this.replaceBlock(block.id, this.imageController.selectFile(block, file));
			event.currentTarget.value = "";
		}
		onClearImage(block) {
			this.replaceBlock(block.id, this.imageController.clearFile(block));
		}
		releaseImageFiles() {
			if (!this.imageController || this.blocks.length === 0) return;
			this.blocks = this.imageController.releaseAll(this.blocks);
		}
		onLessonChange(event) {
			const lessonId = Number(event.currentTarget.value);
			const next = new Set(this.selectedLessonIds);
			if (event.currentTarget.checked) next.add(lessonId);
			else next.delete(lessonId);
			this.selectedLessonIds = next;
		}
		onSelectAll() {
			this.selectedLessonIds = new Set(this.lessons.map((lesson) => Number(lesson.lessonId)));
		}
		onClearAll() {
			this.selectedLessonIds = /* @__PURE__ */ new Set();
		}
		onAddBlock(type) {
			if (![
				"image",
				"text",
				"link"
			].includes(type)) return;
			this.blocks = [...this.blocks, this.createBlock(type)];
		}
		onBlockAction(blockId, action) {
			const index = this.blocks.findIndex((block) => block.id === blockId);
			if (index < 0) return;
			const next = [...this.blocks];
			if (action === "remove") {
				const [removed] = next.splice(index, 1);
				if (removed?.type === "image") this.imageController.releaseBlock(removed);
			} else if (action === "up" && index > 0) {
				const [block] = next.splice(index, 1);
				next.splice(index - 1, 0, block);
			} else if (action === "down" && index < next.length - 1) {
				const [block] = next.splice(index, 1);
				next.splice(index + 1, 0, block);
			}
			this.blocks = next;
		}
		canPreflight() {
			return ["configure", "validation-error"].includes(this.mode) && this.selectedLessonIds.size > 0 && this.sectionName.trim().length > 0 && this.blocks.length > 0 && this.imageController.canSubmit(this.blocks);
		}
		onPreflight() {
			if (!this.canPreflight()) return;
			this.dispatchEvent(new CustomEvent("edvibe-batch-section-preflight", {
				bubbles: true,
				composed: true,
				detail: {
					definition: this.collectDefinition(),
					selectedLessonIds: [...this.selectedLessonIds]
				}
			}));
		}
		onConfirm() {
			this.dispatchEvent(new CustomEvent("edvibe-batch-section-confirm", {
				bubbles: true,
				composed: true
			}));
		}
		onCopy() {
			this.dispatchEvent(new CustomEvent("edvibe-batch-section-copy", {
				bubbles: true,
				composed: true
			}));
		}
		onRestart() {
			this.releaseImageFiles();
			this.sectionName = "";
			this.blocks = [];
			this.selectedLessonIds = /* @__PURE__ */ new Set();
			this.dispatchEvent(new CustomEvent("edvibe-batch-section-restart", {
				bubbles: true,
				composed: true
			}));
		}
		close() {
			this.releaseImageFiles();
			this.dispatchEvent(new CustomEvent("edvibe-dialog-close", {
				bubbles: true,
				composed: true
			}));
			this.remove();
		}
		onBackdrop(event) {
			if (event.target === event.currentTarget && !this.isBusy()) this.close();
		}
		onKeydown(event) {
			if (event.key === "Escape" && !this.isBusy()) this.close();
		}
		isBusy() {
			return ["loading", "executing"].includes(this.mode);
		}
		resultStatusLabel(status) {
			return {
				created: "Создано",
				rejected: "Отклонено",
				failed: "Ошибка",
				partially_created: "Нужна ручная проверка",
				not_attempted: "Не выполнено"
			}[status] || status;
		}
		renderLesson(lesson, configurable) {
			const lessonId = Number(lesson.lessonId);
			return b`
            <label class="edvibe-batch-section-lesson">
                <input type="checkbox" .value=${String(lessonId)}
                    .checked=${this.selectedLessonIds.has(lessonId)}
                    ?disabled=${!configurable} @change=${this.onLessonChange}>
                <span>${lesson.number || "?"}. ${lesson.name}</span>
            </label>
        `;
		}
		renderBlockField(block, labelText, field, multiline, configurable) {
			return b`
            <label class="edvibe-batch-section-field">
                <span>${labelText}</span>
                ${multiline ? b`<textarea data-block-field=${field} .value=${block[field] || ""}
                        ?disabled=${!configurable}
                        @input=${(event) => this.updateBlock(block.id, field, event.currentTarget.value)}></textarea>` : b`<input type="text" data-block-field=${field} .value=${block[field] || ""}
                        ?disabled=${!configurable}
                        @input=${(event) => this.updateBlock(block.id, field, event.currentTarget.value)}>`}
            </label>
        `;
		}
		renderImageFields(block, configurable) {
			return b`
            <label class="edvibe-batch-section-field">
                <span>Файл изображения</span>
                <input class="edvibe-batch-section-file-input" type="file" accept="image/*"
                    ?disabled=${!configurable}
                    @change=${(event) => this.onImageFileChange(block, event)}>
            </label>
            ${block.fileName ? b`
                <div class="edvibe-batch-section-file-details">
                    <span>${block.fileName} · ${formatFileSize(block.fileSize)}</span>
                    <button type="button" ?disabled=${!configurable}
                        @click=${() => this.onClearImage(block)}>Убрать файл</button>
                </div>
            ` : A}
            ${block.fileError ? b`<p class="edvibe-batch-section-file-error">${block.fileError}</p>` : A}
            ${block.previewUrl ? b`
                <img class="edvibe-batch-section-image-preview" src=${block.previewUrl}
                    alt=${block.alt || "Предпросмотр изображения"}>
            ` : A}
            ${this.renderBlockField(block, "Альтернативный текст", "alt", false, configurable)}
        `;
		}
		renderBlock(block, index, configurable) {
			return b`
            <article class="edvibe-batch-section-block" data-block-id=${block.id}>
                <header>
                    <strong>${index + 1}. ${this.blockLabel(block.type)}</strong>
                    <div class="edvibe-batch-section-block-actions">
                        <button type="button" data-block-action="up" ?disabled=${!configurable || index === 0}
                            @click=${() => this.onBlockAction(block.id, "up")}>↑</button>
                        <button type="button" data-block-action="down"
                            ?disabled=${!configurable || index === this.blocks.length - 1}
                            @click=${() => this.onBlockAction(block.id, "down")}>↓</button>
                        <button type="button" data-block-action="remove" ?disabled=${!configurable}
                            @click=${() => this.onBlockAction(block.id, "remove")}>Удалить</button>
                    </div>
                </header>
                ${block.type === "image" ? this.renderImageFields(block, configurable) : block.type === "text" ? b`
                        ${this.renderBlockField(block, "Текст или HTML", "text", true, configurable)}
                    ` : b`
                        ${this.renderBlockField(block, "Подпись кнопки", "label", false, configurable)}
                        ${this.renderBlockField(block, "URL", "url", false, configurable)}
                    `}
            </article>
        `;
		}
		previewDetail(block) {
			if (block.type === "image") return block.fileName || "Файл не выбран";
			if (block.type === "text") return block.text || "Текст не указан";
			return `${block.label || "Без подписи"} → ${block.url || "URL не указан"}`;
		}
		renderRecipeState() {
			if (this.recipeReady) return A;
			return b`
            <section class="edvibe-batch-section-protocol">
                <strong>Запись WebSocket ещё не подключена.</strong>
                <p>${this.recipeErrors[0]?.message || "Создание будет заблокировано, пока запись не преобразована в проверенный рецепт."}</p>
            </section>
        `;
		}
		renderErrors() {
			if (this.errors.length === 0) return A;
			return b`
            <section class="edvibe-batch-section-errors" aria-live="polite">
                <h3>Что нужно исправить</h3>
                <ul>${this.errors.map((error) => b`<li>${error.code}: ${error.message}</li>`)}</ul>
            </section>
        `;
		}
		renderSummaryGroup(title, lessons, formatter) {
			return b`
            <div class="edvibe-batch-section-summary-group">
                <h4>${title} (${lessons.length})</h4>
                <ul>${lessons.length ? lessons.map((lesson) => b`<li>${formatter(lesson)}</li>`) : b`<li>Нет</li>`}</ul>
            </div>
        `;
		}
		renderPlan() {
			const plan = this.currentPlan;
			if (!plan) return A;
			return b`
            <section class="edvibe-batch-section-summary" aria-live="polite">
                <h3>Предварительный план</h3>
                <ul>
                    <li>Выбрано уроков: ${plan.selectedLessonIds.length}</li>
                    <li>Готово к созданию: ${plan.eligible.length}</li>
                    <li>Отклонено проверкой: ${plan.rejected.length}</li>
                    <li>Раздел: ${plan.definition.name}</li>
                    <li>Блоков: ${plan.definition.blocks.length}</li>
                </ul>
                ${this.renderSummaryGroup("Будут обработаны", plan.eligible, (lesson) => `${lesson.number}. ${lesson.name}`)}
                ${this.renderSummaryGroup("Отклонены", plan.rejected, (lesson) => `${lesson.number}. ${lesson.name} — ${lesson.code}: ${lesson.message}`)}
            </section>
        `;
		}
		renderResults() {
			if (!this.result) return A;
			return b`
            <section class="edvibe-batch-section-results" aria-live="polite">
                <h3>${this.fatalResultError ? "Частичный результат" : "Результат"}</h3>
                <div class="edvibe-batch-section-result-list">
                    ${(this.result.results || []).map((entry) => b`
                        <article class=${`edvibe-batch-section-result is-${entry.status}`}>
                            <strong>${entry.lessonNumber || "?"}. ${entry.lessonName}</strong>
                            <span>${this.resultStatusLabel(entry.status)}</span>
                            <p>${entry.code ? `${entry.code}: ${entry.message || ""}` : entry.message || "Готово"}</p>
                            ${entry.cleanup ? b`<small>Очистка: ${entry.cleanup.status}</small>` : A}
                        </article>
                    `)}
                </div>
                ${this.fatalResultError ? b`
                    <p class="edvibe-batch-section-fatal-note">
                        ${this.fatalResultError.code || "INTERNAL_ERROR"}: ${this.fatalResultError.message}
                    </p>
                ` : A}
            </section>
        `;
		}
		render() {
			const configurable = ["configure", "validation-error"].includes(this.mode);
			const busy = this.isBusy();
			const canPreflight = this.canPreflight();
			return b`
<div class="edvibe-batch-section-overlay" @click=${this.onBackdrop}>
                <section class="edvibe-batch-section-card" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-section-title">
                    <header class="edvibe-batch-section-header">
                        <div><p class="edvibe-batch-section-eyebrow">Edvibe Toolbox</p>
                            <h2 id="edvibe-batch-section-title">Создать раздел в нескольких уроках</h2>
                            <p class="edvibe-batch-section-description">Соберите раздел один раз, проверьте план и примените его к выбранным урокам.</p></div>
                        <button class="edvibe-batch-section-close" type="button" aria-label="Закрыть"
                            ?disabled=${busy} @click=${() => this.close()}>&times;</button>
                    </header>
                    <div class="edvibe-batch-section-body">
                        <section class="edvibe-batch-section-configure" ?hidden=${!configurable}>
                            <div class="edvibe-batch-section-grid">
                                <div class="edvibe-batch-section-column">
                                    <label class="edvibe-batch-section-field"><span>Название раздела</span>
                                        <input class="edvibe-batch-section-name" type="text" maxlength="200"
                                            autocomplete="off" placeholder="Например, Летняя акция"
                                            .value=${this.sectionName} ?disabled=${!configurable}
                                            @input=${(event) => {
				this.sectionName = event.currentTarget.value;
			}}></label>
                                    <div class="edvibe-batch-section-heading-row"><div><h3>Уроки</h3><p>Выберите все уроки, куда нужно добавить раздел.</p></div>
                                        <div class="edvibe-batch-section-selection-actions">
                                            <button class="edvibe-batch-section-select-all" type="button" ?disabled=${!configurable} @click=${this.onSelectAll}>Выбрать все</button>
                                            <button class="edvibe-batch-section-clear-all" type="button" ?disabled=${!configurable} @click=${this.onClearAll}>Очистить</button>
                                        </div></div>
                                    <div class="edvibe-batch-section-lessons" aria-label="Список уроков">
                                        ${this.lessons.length ? this.lessons.map((lesson) => this.renderLesson(lesson, configurable)) : b`<p class="edvibe-batch-section-empty">Уроки не найдены.</p>`}
                                    </div>
                                </div>
                                <div class="edvibe-batch-section-column">
                                    <div class="edvibe-batch-section-heading-row"><div><h3>Конструктор</h3><p>Порядок блоков сохранится при выполнении.</p></div></div>
                                    <div class="edvibe-batch-section-add-actions" role="group" aria-label="Добавить блок">
                                        ${[
				["image", "+ Баннер"],
				["text", "+ Текст"],
				["link", "+ Ссылка"]
			].map(([type, label]) => b`
                                            <button type="button" data-add-block=${type} ?disabled=${!configurable}
                                                @click=${() => this.onAddBlock(type)}>${label}</button>`)}
                                    </div>
                                    <div class="edvibe-batch-section-blocks">
                                        ${this.blocks.length ? this.blocks.map((block, index) => this.renderBlock(block, index, configurable)) : b`<p class="edvibe-batch-section-empty">Добавьте баннер, текст или ссылку.</p>`}
                                    </div>
                                    <section class="edvibe-batch-section-preview" aria-live="polite">
                                        <h3>Предпросмотр структуры</h3>
                                        <p class="edvibe-batch-section-preview-name">${this.sectionName.trim() || "Название не задано"}</p>
                                        <ol class="edvibe-batch-section-preview-blocks">
                                            ${this.blocks.length ? this.blocks.map((block, index) => b`<li>${index + 1}. ${this.blockLabel(block.type)}: ${this.previewDetail(block)}</li>`) : b`<li>Блоки не добавлены</li>`}
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
                        <span class="edvibe-batch-section-spinner" role="img" aria-label="Выполняется операция" ?hidden=${!busy}></span>
                        <p class="edvibe-batch-section-status" data-state=${this.statusState} role="status" aria-live="polite">${this.statusMessage}</p>
                        <progress class="edvibe-batch-section-progress" max=${this.progress.total}
                            value=${this.progress.completed} ?hidden=${!this.progress.visible}></progress>
                    </div>
                    <footer class="edvibe-batch-section-footer">
                        <button class="edvibe-batch-section-copy" type="button" ?hidden=${this.mode !== "complete"} @click=${this.onCopy}>Копировать отчёт</button>
                        <button class="edvibe-batch-section-restart" type="button" ?hidden=${this.mode !== "complete"} @click=${this.onRestart}>Создать другой раздел</button>
                        <button class="edvibe-batch-section-confirm" type="button" ?hidden=${this.mode !== "confirm"}
                            ?disabled=${!this.recipeReady || !this.currentPlan?.eligible?.length} @click=${this.onConfirm}>Подтвердить создание</button>
                        <button class="edvibe-batch-section-preflight" type="button" ?hidden=${!configurable}
                            ?disabled=${!canPreflight} @click=${this.onPreflight}>Проверить план</button>
                    </footer>
                </section>
            </div>
        `;
		}
	};
	if (!customElements.get("edvibe-toolbox-batch-section-creation-dialog")) customElements.define(BATCH_SECTION_DIALOG_TAG, BatchSectionCreationDialog);
	globalThis.EdVibeBatchSectionCreationDialog = {
		BatchSectionCreationDialog,
		BATCH_SECTION_DIALOG_TAG,
		BATCH_SECTION_OVERLAY_ID
	};
	//#endregion
	//#region src/features/batch-section-creation-recipe.js
	var clientTime = (/* @__PURE__ */ new Date()).toISOString();
	var batchSectionCreationRecipe = Object.freeze({
		version: 1,
		reviewedDynamicFields: true,
		steps: Object.freeze([
			Object.freeze({
				id: "create-section",
				controller: "LessonSectionWsController",
				method: "AddStageSection",
				projectName: "Books",
				valueTemplate: Object.freeze({
					LessonId: "{{lesson.lessonId}}",
					StageSectionName: "{{section.name}}",
					SortId: 4
				}),
				capture: Object.freeze({ sectionId: "Value.StageSectionId" }),
				marksSectionCreated: true
			}),
			Object.freeze({
				id: "confirm-section-name",
				controller: "LessonSectionWsController",
				method: "EditStageSection",
				projectName: "Books",
				valueTemplate: Object.freeze({
					LessonId: "{{lesson.lessonId}}",
					StageSectionId: "{{captured.sectionId}}",
					StageSectionName: "{{section.name}}",
					SortId: 4
				})
			}),
			Object.freeze({
				id: "save-image",
				controller: "SaveExerciseWsController",
				method: "SaveExercise",
				projectName: "Exercises",
				forEach: "blocks",
				blockTypes: Object.freeze(["image"]),
				valueTemplate: Object.freeze({
					ClassId: null,
					Domain: "edvibe.com",
					ExerciseView: Object.freeze({
						Id: 0,
						Number: "{{blockIndex}}",
						Name: "",
						IsHidePupil: false,
						Type: 27,
						HomeworkLessonId: null,
						PersonalMaterialId: null,
						LessonSectionId: "{{captured.sectionId}}",
						Descriptions: Object.freeze([""]),
						ChangeExerciseImages: Object.freeze([Object.freeze({
							ImageId: 687640222,
							FullImageId: 687640223,
							ImageUrl: "https://media-y.edvibe.com/files/LessonExerciseImages/b455a98f-ef63-49b5-a6f4-2111c7edebc6.png",
							FullImageUrl: "https://media-y.edvibe.com/files/LessonExerciseImages/035f9f67-1474-4eb3-8359-5eb93ea68a2e.png",
							cropped: false
						})])
					}),
					AiUsed: false,
					UsedNewConstructor: true,
					ClientTime: clientTime,
					DeviceType: "desktop"
				})
			}),
			Object.freeze({
				id: "save-cta",
				controller: "SaveExerciseWsController",
				method: "SaveExercise",
				projectName: "Exercises",
				forEach: "blocks",
				blockTypes: Object.freeze(["link"]),
				valueTemplate: Object.freeze({
					ClassId: null,
					Domain: "edvibe.com",
					ExerciseView: Object.freeze({
						Id: 0,
						Number: "{{blockIndex}}",
						Name: "",
						IsHidePupil: false,
						Type: 29,
						HomeworkLessonId: null,
						PersonalMaterialId: null,
						LessonSectionId: "{{captured.sectionId}}",
						Button: Object.freeze({
							Link: "{{block.url}}",
							Text: "{{block.label}}"
						})
					}),
					AiUsed: false,
					UsedNewConstructor: true,
					ClientTime: clientTime,
					DeviceType: "desktop"
				})
			})
		])
	});
	//#endregion
	//#region src/features/batch-section-image-upload.js
	var UPLOAD_ENDPOINT = "https://media-files-y.edvibe.com/api/MediaFile/create-multiple";
	function createUploadError(code, message, details = {}) {
		const error = new Error(message);
		error.code = code;
		Object.assign(error, details);
		return error;
	}
	function parseClientId(value) {
		const text = String(value || "");
		if (!text.startsWith("https://media-files-y.edvibe.com/local-upload/")) return "";
		try {
			return decodeURIComponent(text.slice(46));
		} catch (_) {
			return "";
		}
	}
	function normalizeRequestUrl(input, baseUrl) {
		const candidate = typeof input === "string" || input instanceof URL ? String(input) : String(input?.url || "");
		try {
			return new URL(candidate, baseUrl || "https://edvibe.com/");
		} catch (_) {
			return null;
		}
	}
	function isTrustedEdvibeUrl(input, baseUrl) {
		const url = normalizeRequestUrl(input, baseUrl);
		return Boolean(url) && url.protocol === "https:" && (url.hostname === "edvibe.com" || url.hostname.endsWith(".edvibe.com"));
	}
	function readHeader(headers, name, HeadersCtor = globalThis.Headers) {
		if (!headers) return "";
		try {
			if (HeadersCtor) return new HeadersCtor(headers).get(name) || "";
		} catch (_) {}
		const target = String(name).toLowerCase();
		if (Array.isArray(headers)) {
			const entry = headers.find(([key]) => String(key).toLowerCase() === target);
			return entry ? String(entry[1] || "") : "";
		}
		for (const [key, value] of Object.entries(headers)) if (String(key).toLowerCase() === target) return String(value || "");
		return "";
	}
	function createAuthorizationCapture(rootObject) {
		let authorization = "";
		const baseUrl = rootObject.location?.href || "https://edvibe.com/";
		const originalFetch = rootObject.fetch;
		const HeadersCtor = rootObject.Headers;
		function capture(input, headers) {
			if (!isTrustedEdvibeUrl(input, baseUrl)) return;
			const value = readHeader(headers, "authorization", HeadersCtor);
			if (value) authorization = value;
		}
		if (typeof originalFetch === "function") rootObject.fetch = function edvibeToolboxFetch(input, init) {
			capture(input, init?.headers || input?.headers);
			return originalFetch.apply(this, arguments);
		};
		const xhrPrototype = rootObject.XMLHttpRequest?.prototype;
		if (xhrPrototype?.open && xhrPrototype?.setRequestHeader) {
			const originalOpen = xhrPrototype.open;
			const originalSetRequestHeader = xhrPrototype.setRequestHeader;
			const urls = /* @__PURE__ */ new WeakMap();
			xhrPrototype.open = function open(method, url) {
				urls.set(this, url);
				return originalOpen.apply(this, arguments);
			};
			xhrPrototype.setRequestHeader = function setRequestHeader(name, value) {
				if (String(name).toLowerCase() === "authorization" && isTrustedEdvibeUrl(urls.get(this), baseUrl) && value) authorization = String(value);
				return originalSetRequestHeader.apply(this, arguments);
			};
		}
		return Object.freeze({
			getAuthorization: () => authorization,
			capture
		});
	}
	function createDynamicImageRecipe(recipe) {
		if (!recipe || !Array.isArray(recipe.steps)) return recipe;
		const steps = recipe.steps.map((step) => {
			if (step.id !== "save-image") return step;
			const exerciseView = step.valueTemplate?.ExerciseView || {};
			return Object.freeze({
				...step,
				valueTemplate: Object.freeze({
					...step.valueTemplate,
					ExerciseView: Object.freeze({
						...exerciseView,
						ChangeExerciseImages: Object.freeze([Object.freeze({
							ImageId: "{{block.asset.imageId}}",
							FullImageId: "{{block.asset.fullImageId}}",
							ImageUrl: "{{block.asset.imageUrl}}",
							FullImageUrl: "{{block.asset.fullImageUrl}}",
							cropped: false
						})])
					})
				})
			});
		});
		return Object.freeze({
			...recipe,
			steps: Object.freeze(steps)
		});
	}
	async function uploadImageAssets({ definition, registry, authorization, fetchFn, FormDataCtor }) {
		const imageBlocks = (definition?.blocks || []).filter((block) => block.type === "image");
		if (imageBlocks.length === 0) return definition;
		if (!authorization) throw createUploadError("AUTH_CONTEXT_UNAVAILABLE", "Edvibe authorization context is unavailable. Reload the page and try again.");
		const formData = new FormDataCtor();
		formData.append("Type", "8");
		formData.append("SaveOriginal", "true");
		formData.append("IsOriginalSizeOutputImage", "true");
		const clientIds = [];
		imageBlocks.forEach((block, index) => {
			const clientId = parseClientId(block.url);
			const file = registry?.get?.(clientId);
			if (!clientId || !file) throw createUploadError("IMAGE_FILE_REQUIRED", `Image block ${index + 1} requires a selected file.`);
			clientIds.push(clientId);
			formData.append(`Files[${index}]`, file, file.name);
			formData.append(`Selections[${index}].X`, "0");
			formData.append(`Selections[${index}].Y`, "0");
			formData.append(`Selections[${index}].Width`, "0");
			formData.append(`Selections[${index}].Height`, "0");
			formData.append(`Ids[${index}]`, clientId);
		});
		let response;
		try {
			response = await fetchFn(UPLOAD_ENDPOINT, {
				method: "POST",
				headers: {
					accept: "*/*",
					authorization
				},
				body: formData,
				mode: "cors",
				credentials: "include"
			});
		} catch (error) {
			throw createUploadError("MEDIA_UPLOAD_FAILED", "Could not upload the selected image.", { cause: error });
		}
		if (!response?.ok) throw createUploadError("MEDIA_UPLOAD_FAILED", `Edvibe image upload failed with HTTP ${response?.status || "unknown"}.`);
		let payload;
		try {
			payload = await response.json();
		} catch (error) {
			throw createUploadError("INVALID_MEDIA_RESPONSE", "Edvibe returned an invalid image response.", { cause: error });
		}
		if (!payload?.IsSuccess) throw createUploadError("MEDIA_UPLOAD_REJECTED", payload?.ErrorMessage || "Edvibe rejected the selected image.");
		if ((payload?.Data?.ErrorItems || []).length > 0) throw createUploadError("MEDIA_UPLOAD_PARTIAL", "Edvibe failed to upload one or more selected images.", { errorItems: payload.Data.ErrorItems });
		const assetsByClientId = new Map((payload?.Data?.Items || []).map((item) => [String(item.OldId || ""), Object.freeze({
			imageId: item.Id,
			fullImageId: item.IdFull,
			imageUrl: item.Url,
			fullImageUrl: item.UrlFull
		})]));
		for (const clientId of clientIds) if (!assetsByClientId.has(clientId)) throw createUploadError("INVALID_MEDIA_RESPONSE", "Edvibe did not return an asset for every selected image.");
		const blocks = definition.blocks.map((block) => {
			if (block.type !== "image") return block;
			const clientId = parseClientId(block.url);
			return Object.freeze({
				...block,
				asset: assetsByClientId.get(clientId)
			});
		});
		return Object.freeze({
			...definition,
			blocks: Object.freeze(blocks)
		});
	}
	function createEnhancedAdapterFactory({ originalFactory, registry, authorizationCapture, fetchFn, FormDataCtor }) {
		if (typeof originalFactory !== "function") return null;
		return function createEnhancedAdapter(options) {
			const adapter = originalFactory(options);
			const uploadsByDefinition = /* @__PURE__ */ new WeakMap();
			async function enrich(definition) {
				if (!definition || typeof definition !== "object") return definition;
				let upload = uploadsByDefinition.get(definition);
				if (!upload) {
					upload = uploadImageAssets({
						definition,
						registry,
						authorization: authorizationCapture.getAuthorization(),
						fetchFn,
						FormDataCtor
					});
					uploadsByDefinition.set(definition, upload);
				}
				return upload;
			}
			return Object.freeze({
				...adapter,
				async createSection(context) {
					const definition = await enrich(context.definition);
					return adapter.createSection({
						...context,
						definition
					});
				},
				async cleanupSection(context) {
					const definition = await enrich(context.definition);
					return adapter.cleanupSection({
						...context,
						definition
					});
				}
			});
		};
	}
	var authorizationCapture = globalThis.document ? createAuthorizationCapture(globalThis) : null;
	var dynamicImageRecipe = createDynamicImageRecipe(batchSectionCreationRecipe);
	var createImageUploadCreationAdapter = authorizationCapture ? createEnhancedAdapterFactory({
		originalFactory: createRecordedCreationAdapter,
		registry,
		authorizationCapture,
		fetchFn: globalThis.fetch.bind(globalThis),
		FormDataCtor: globalThis.FormData
	}) : createRecordedCreationAdapter;
	//#endregion
	//#region src/features/batch-section-deletion.js
	var batch_section_deletion_exports = /* @__PURE__ */ __exportAll({
		DIALOG_TAG: () => DIALOG_TAG,
		buildDeleteRequest: () => buildDeleteRequest,
		buildExecutionHistoryInput: () => buildExecutionHistoryInput$1,
		buildExecutionPlan: () => buildExecutionPlan,
		createBatchSectionDeletionFeature: () => createBatchSectionDeletionFeature$1,
		executePlan: () => executePlan,
		extractNormalSections: () => extractNormalSections,
		findExactSectionMatches: () => findExactSectionMatches,
		formatReport: () => formatReport,
		inspectLessonsSequentially: () => inspectLessonsSequentially,
		loadLessonCatalogue: () => loadLessonCatalogue,
		normalizeLesson: () => normalizeLesson,
		normalizeSectionName: () => normalizeSectionName,
		parseMarathonId: () => parseMarathonId$3
	});
	var DIALOG_TAG = "edvibe-toolbox-batch-section-deletion-dialog";
	var EXPECTED_WRITE_CODES = /* @__PURE__ */ new Set([
		"SERVER_REJECTED",
		"INVALID_RESPONSE",
		"REQUEST_TIMEOUT",
		"SEND_FAILED",
		"WS_UNAVAILABLE"
	]);
	function normalizeSectionName(value) {
		const name = String(value || "").trim();
		if (!name) throw createFeatureError("SECTION_NAME_REQUIRED", "Enter the exact section name.");
		return name;
	}
	function normalizeLesson(node, index = 0) {
		const lessonId = Number(node?.LessonId ?? node?.lessonId ?? node?.Id);
		return Object.freeze({
			lessonId,
			marathonLessonId: Number(node?.MarathonLessonId ?? node?.marathonLessonId ?? node?.Id),
			number: Number(node?.Number ?? node?.number ?? index + 1),
			name: String(node?.Name ?? node?.name ?? `Lesson ${index + 1}`)
		});
	}
	function extractNormalSections(response) {
		const value = response?.Value ?? response?.value ?? response;
		if (!value || !Array.isArray(value.Sections)) throw createFeatureError("INVALID_LESSON_RESPONSE", "The lesson response did not contain a normal Sections array.");
		return value.Sections;
	}
	function findExactSectionMatches(sections, sectionName) {
		const name = normalizeSectionName(sectionName);
		if (!Array.isArray(sections)) throw createFeatureError("INVALID_LESSON_RESPONSE", "Sections must be an array.");
		return sections.filter((section) => String(section?.Name ?? "") === name);
	}
	function rejection(lesson, code, message) {
		return Object.freeze({
			...lesson,
			status: "rejected",
			code,
			message
		});
	}
	function buildExecutionPlan({ lessons, selectedLessonIds, sectionName, inspectionsByLessonId }) {
		const name = normalizeSectionName(sectionName);
		const selected = new Set((selectedLessonIds || []).map(Number));
		const eligible = [];
		const rejected = [];
		for (const lesson of (lessons || []).filter((item) => selected.has(Number(item.lessonId)))) {
			const inspection = inspectionsByLessonId.get(Number(lesson.lessonId));
			if (!inspection || inspection.error) {
				const error = inspection?.error;
				rejected.push(rejection(lesson, error?.code || "INVALID_LESSON_RESPONSE", error?.message || "The lesson could not be inspected."));
				continue;
			}
			try {
				const matches = findExactSectionMatches(extractNormalSections(inspection.response), name);
				if (matches.length === 0) rejected.push(rejection(lesson, "SECTION_NOT_FOUND", `Section "${name}" was not found.`));
				else if (matches.length > 1) rejected.push(rejection(lesson, "SECTION_NAME_AMBIGUOUS", `Found ${matches.length} sections named "${name}".`));
				else {
					const sectionId = Number(matches[0]?.Id);
					if (!Number.isSafeInteger(sectionId) || sectionId <= 0) rejected.push(rejection(lesson, "UNSUPPORTED_SECTION_TYPE", "The matching section has no safe normal-section ID."));
					else eligible.push(Object.freeze({
						...lesson,
						sectionName: name,
						sectionId
					}));
				}
			} catch (error) {
				rejected.push(rejection(lesson, error.code || "INVALID_LESSON_RESPONSE", error.message));
			}
		}
		return Object.freeze({
			sectionName: name,
			selectedCount: selected.size,
			eligible: Object.freeze(eligible),
			rejected: Object.freeze(rejected)
		});
	}
	function buildDeleteRequest(entry) {
		return Object.freeze({
			controller: "LessonSectionWsController",
			method: "DeleteStageSection",
			projectName: "Books",
			value: Object.freeze({ StageSectionId: entry.sectionId })
		});
	}
	async function loadLessonCatalogue({ sendRequest, marathonId, pageSize = 100 }) {
		return (await loadAllMarathonLessons({
			sendRequest,
			marathonId,
			pageSize
		})).map(normalizeLesson);
	}
	async function inspectLessonsSequentially({ lessons, selectedLessonIds, sendRequest, wait, requestDelayMs = 250, onProgress }) {
		const selected = new Set((selectedLessonIds || []).map(Number));
		const targets = lessons.filter((lesson) => selected.has(Number(lesson.lessonId)));
		const inspections = /* @__PURE__ */ new Map();
		for (const [index, lesson] of targets.entries()) {
			try {
				const response = await getLessonById({
					sendRequest,
					lessonId: lesson.lessonId
				});
				extractNormalSections(response);
				inspections.set(lesson.lessonId, { response });
			} catch (error) {
				inspections.set(lesson.lessonId, { error: createFeatureError(error.code || "INVALID_LESSON_RESPONSE", error.message || "Inspection failed.") });
			}
			onProgress?.({
				current: index + 1,
				total: targets.length,
				lesson
			});
			if (index < targets.length - 1 && requestDelayMs > 0) await wait(requestDelayMs);
		}
		return inspections;
	}
	async function executePlan({ plan, sendRequest, wait, requestDelayMs = 300, onProgress }) {
		const results = plan.rejected.map((entry) => ({ ...entry }));
		let fatalError = null;
		for (const [index, entry] of plan.eligible.entries()) {
			if (fatalError) {
				results.push({
					...entry,
					status: "not_attempted",
					code: "OPERATION_INTERRUPTED",
					message: "Not attempted because the operation stopped."
				});
				continue;
			}
			try {
				const request = buildDeleteRequest(entry);
				const response = await sendRequest(request.controller, request.method, request.projectName, request.value);
				const value = response?.Value ?? response?.value;
				if (response?.IsSuccess === false || response?.isSuccess === false || value === false || value == null) throw createFeatureError("INVALID_RESPONSE", "Deletion was not positively confirmed.");
				results.push({
					...entry,
					status: "deleted",
					code: "DELETED",
					message: "Section deleted."
				});
			} catch (error) {
				const code = error.code || "DELETE_FAILED";
				results.push({
					...entry,
					status: "failed",
					code,
					message: error.message || "Deletion failed."
				});
				if (!EXPECTED_WRITE_CODES.has(code)) fatalError = error;
			}
			onProgress?.({
				current: index + 1,
				total: plan.eligible.length,
				entry,
				results: [...results]
			});
			if (index < plan.eligible.length - 1 && requestDelayMs > 0 && !fatalError) await wait(requestDelayMs);
		}
		return Object.freeze({
			plan,
			results: Object.freeze(results.map(Object.freeze)),
			fatalError
		});
	}
	function formatReport(result) {
		const lines = [
			"Edvibe Toolbox: batch section deletion",
			`Section: ${result.plan.sectionName}`,
			`Selected: ${result.plan.selectedCount}`,
			`Eligible: ${result.plan.eligible.length}`,
			`Rejected: ${result.plan.rejected.length}`,
			""
		];
		for (const entry of result.results) {
			const label = `#${entry.number} ${entry.name} (lesson ${entry.lessonId})`;
			const section = entry.sectionId ? `, section ${entry.sectionId}` : "";
			lines.push(`[${entry.status}] ${label}${section}: ${entry.code} — ${entry.message}`);
		}
		return lines.join("\n");
	}
	function buildExecutionHistoryInput$1({ marathonId, startedAt, completedAt, result }) {
		const deleted = result.results.filter((entry) => entry.status === "deleted").length;
		const failed = result.results.filter((entry) => entry.status === "failed").length;
		const rejected = result.results.filter((entry) => entry.status === "rejected").length;
		const notAttempted = result.results.filter((entry) => entry.status === "not_attempted").length;
		const status = result.fatalError ? "interrupted" : failed > 0 || rejected > 0 ? "completed_with_failures" : "completed";
		return Object.freeze({
			operationType: "batch-section-deletion",
			startedAt,
			completedAt,
			status,
			pageContext: Object.freeze({ marathonId }),
			counts: Object.freeze({
				requested: result.plan.selectedCount,
				eligible: result.plan.eligible.length,
				attempted: deleted + failed,
				successful: deleted,
				noOp: 0,
				skipped: rejected,
				failed,
				notAttempted
			}),
			results: Object.freeze(result.results.map((entry) => Object.freeze({
				itemId: `lesson-${entry.lessonId}`,
				label: `#${entry.number} ${entry.name}`,
				status: entry.status,
				code: entry.code,
				message: entry.message,
				attempts: entry.status === "not_attempted" || entry.status === "rejected" ? 0 : 1,
				data: Object.freeze({
					lessonId: entry.lessonId,
					marathonLessonId: entry.marathonLessonId,
					sectionId: entry.sectionId || null,
					sectionName: result.plan.sectionName
				})
			})))
		});
	}
	function createBatchSectionDeletionFeature$1({ sendRequest, getConnectionState, wait, canStart, onActiveChange, createDialog, copyText, persistExecution = async () => Object.freeze({ stored: false }), openHistory = () => {}, log = () => {} }) {
		let active = false;
		async function open() {
			if (active || !canStart()) {
				window.alert("Another Edvibe Toolbox operation is already running.");
				return;
			}
			const marathonId = parseMarathonId$3(window.location.href);
			if (!marathonId) {
				window.alert("Open an Edvibe marathon page first.");
				return;
			}
			if (getConnectionState?.()?.ready === false) {
				window.alert("Edvibe WebSocket connection is not ready.");
				return;
			}
			active = true;
			onActiveChange(true);
			const dialog = createDialog();
			document.body.append(dialog);
			try {
				const lessons = await loadLessonCatalogue({
					sendRequest,
					marathonId
				});
				dialog.configure({
					marathonId,
					lessons,
					async onInspect(input) {
						const inspectionsByLessonId = await inspectLessonsSequentially({
							lessons,
							selectedLessonIds: input.selectedLessonIds,
							sendRequest,
							wait,
							onProgress: input.onProgress
						});
						return buildExecutionPlan({
							lessons,
							selectedLessonIds: input.selectedLessonIds,
							sectionName: input.sectionName,
							inspectionsByLessonId
						});
					},
					async onExecute(plan, onProgress) {
						const startedAt = (/* @__PURE__ */ new Date()).toISOString();
						const result = await executePlan({
							plan,
							sendRequest,
							wait,
							onProgress
						});
						const completedAt = (/* @__PURE__ */ new Date()).toISOString();
						let history;
						try {
							history = await persistExecution(buildExecutionHistoryInput$1({
								marathonId,
								startedAt,
								completedAt,
								result
							}));
						} catch (persistenceError) {
							history = Object.freeze({
								stored: false,
								persistenceError
							});
							log("Batch section deletion history persistence failed:", persistenceError);
						}
						return {
							...result,
							report: formatReport(result),
							history
						};
					},
					onCopy: copyText,
					onOpenHistory(executionId) {
						dialog.remove();
						active = false;
						onActiveChange(false);
						openHistory(executionId);
					},
					onClose() {
						dialog.remove();
						active = false;
						onActiveChange(false);
					}
				});
			} catch (error) {
				log("Failed to open batch section deletion:", error);
				dialog.remove();
				active = false;
				onActiveChange(false);
				window.alert(error.message || "Failed to load lessons.");
			}
		}
		return Object.freeze({ open });
	}
	//#endregion
	//#region src/features/batch-section-deletion-history.js
	var OPERATION_TYPE = "batch-section-deletion";
	var TERMINAL_STATUSES = /* @__PURE__ */ new Set([
		"completed",
		"completed_with_failures",
		"cancelled",
		"interrupted"
	]);
	var ATTEMPTED_STATUSES = /* @__PURE__ */ new Set(["deleted", "failed"]);
	function text(value, fallback = "", maxLength = 1e3) {
		const normalized = String(value ?? "").trim();
		if (!normalized) return fallback;
		return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 1)}…`;
	}
	function parseMarathonId(url) {
		const match = String(url || "").match(/\/marathon\/(\d+)(?:\/|$)/);
		return match ? String(match[1]) : null;
	}
	function lessonKey(value) {
		const id = value?.lessonId ?? value?.LessonId;
		return id === void 0 || id === null ? null : String(id);
	}
	function discoveryOutcome(entry = {}) {
		if (entry.discoveryOutcome) return text(entry.discoveryOutcome, "inspection_failed", 120);
		return {
			SECTION_NOT_FOUND: "not_found",
			SECTION_NAME_AMBIGUOUS: "ambiguous",
			UNSUPPORTED_SECTION_TYPE: "unsupported_section_type",
			INVALID_LESSON_RESPONSE: "invalid_lesson_response"
		}[entry.code] || (entry.sectionId ? "matched" : "inspection_failed");
	}
	function enrichPlan(plan = {}, selectedLessonIds = []) {
		const sectionName = text(plan.sectionName, "Unnamed section", 500);
		const eligible = (plan.eligible || []).map((entry) => Object.freeze({
			...entry,
			sectionName,
			sectionType: "normal",
			discoveryOutcome: "matched",
			matchCount: 1
		}));
		const rejected = (plan.rejected || []).map((entry) => Object.freeze({
			...entry,
			sectionName,
			sectionId: null,
			sectionType: null,
			discoveryOutcome: discoveryOutcome(entry),
			matchCount: entry.code === "SECTION_NOT_FOUND" ? 0 : null,
			attempts: 0
		}));
		return Object.freeze({
			...plan,
			sectionName,
			selectedLessonIds: Object.freeze([...selectedLessonIds]),
			selectedCount: Number.isSafeInteger(plan.selectedCount) ? plan.selectedCount : selectedLessonIds.length,
			eligible: Object.freeze(eligible),
			rejected: Object.freeze(rejected)
		});
	}
	function resultCode(entry, terminalStatus) {
		if (entry.code) return text(entry.code, "UNKNOWN_RESULT", 120);
		if (entry.status === "deleted") return "DELETED";
		if (entry.status === "rejected") return "PREFLIGHT_REJECTED";
		if (entry.status === "failed") return "DELETE_FAILED";
		return terminalStatus === "cancelled" ? "OPERATION_CANCELLED" : "OPERATION_INTERRUPTED";
	}
	function resultMessage(entry, terminalStatus) {
		if (entry.message) return text(entry.message, "No message was provided.");
		if (entry.status === "deleted") return "Section deleted.";
		if (entry.status === "rejected") return "The lesson was rejected during discovery.";
		if (entry.status === "failed") return "The validated deletion request failed.";
		return terminalStatus === "cancelled" ? "Not attempted because the confirmed run was cancelled." : "Not attempted because the confirmed run was interrupted.";
	}
	function materializeResults(plan = {}, execution = {}, terminalStatus = null) {
		const byId = /* @__PURE__ */ new Map();
		for (const entry of plan.rejected || []) byId.set(lessonKey(entry), {
			...entry,
			status: "rejected",
			attempts: 0
		});
		for (const entry of execution.results || []) byId.set(lessonKey(entry), { ...entry });
		const eligible = new Map((plan.eligible || []).map((entry) => [lessonKey(entry), entry]));
		const ordered = [];
		const included = /* @__PURE__ */ new Set();
		for (const id of plan.selectedLessonIds || []) {
			const key = String(id);
			let entry = byId.get(key);
			if (!entry && eligible.has(key)) entry = {
				...eligible.get(key),
				status: "not_attempted",
				attempts: 0
			};
			if (!entry) entry = {
				lessonId: id,
				name: `Lesson ${id}`,
				status: "not_attempted",
				attempts: 0,
				sectionName: plan.sectionName
			};
			ordered.push(entry);
			included.add(key);
		}
		for (const entry of [...byId.values(), ...eligible.values()]) {
			const key = lessonKey(entry);
			if (key !== null && included.has(key)) continue;
			ordered.push(byId.get(key) || {
				...entry,
				status: "not_attempted",
				attempts: 0
			});
			if (key !== null) included.add(key);
		}
		return ordered.map((entry) => {
			const status = text(entry.status, "not_attempted", 80);
			return {
				...entry,
				status,
				attempts: Number.isSafeInteger(entry.attempts) && entry.attempts >= 0 ? entry.attempts : ATTEMPTED_STATUSES.has(status) ? 1 : 0,
				terminalStatus
			};
		});
	}
	function matchCount(entry) {
		if (Number.isSafeInteger(entry.matchCount) && entry.matchCount >= 0) return entry.matchCount;
		if (entry.sectionId) return 1;
		if (entry.code === "SECTION_NOT_FOUND") return 0;
		const match = String(entry.message || "").match(/Found (\d+) sections/);
		return match ? Number(match[1]) : null;
	}
	function serializeResult(entry, plan, terminalStatus) {
		const status = entry.status;
		const code = resultCode(entry, terminalStatus);
		const message = resultMessage(entry, terminalStatus);
		const outcome = discoveryOutcome(entry);
		const lesson = Object.freeze({
			lessonId: entry.lessonId ?? null,
			marathonLessonId: entry.marathonLessonId ?? null,
			number: entry.number ?? null,
			name: text(entry.name, "Unnamed lesson", 500)
		});
		return Object.freeze({
			itemId: lesson.lessonId === null ? null : `lesson-${lesson.lessonId}`,
			label: `${lesson.number ?? "?"}. ${lesson.name}`,
			status,
			code,
			message,
			attempts: entry.attempts,
			data: Object.freeze({
				lesson,
				section: Object.freeze({
					requestedName: text(entry.sectionName || plan.sectionName, "Unnamed section", 500),
					matchedId: entry.sectionId ?? null,
					supportedType: entry.sectionId ? "normal" : null
				}),
				discovery: Object.freeze({
					outcome,
					code: outcome === "matched" ? "DISCOVERY_MATCHED" : code,
					message: outcome === "matched" ? "Exactly one supported normal lesson section matched the requested name." : message,
					matchCount: matchCount(entry)
				}),
				finalOutcome: status,
				deletionFailure: status === "failed" ? Object.freeze({
					code,
					message,
					attemptCount: entry.attempts
				}) : null
			})
		});
	}
	function inferTerminalStatus(explicitStatus, fatalError, results) {
		if (TERMINAL_STATUSES.has(explicitStatus)) return explicitStatus;
		if (fatalError) return "interrupted";
		return results.some((entry) => [
			"rejected",
			"failed",
			"not_attempted"
		].includes(entry.status)) ? "completed_with_failures" : "completed";
	}
	function buildExecutionHistoryInput({ plan, result = {}, startedAt, completedAt, marathonId, marathonName = null, terminalStatus = null, fatalError = null }) {
		const materializationStatus = TERMINAL_STATUSES.has(terminalStatus) ? terminalStatus : fatalError || result.fatalError ? "interrupted" : null;
		const results = materializeResults(plan, result, materializationStatus).map((entry) => serializeResult(entry, plan, materializationStatus));
		const status = inferTerminalStatus(terminalStatus, fatalError || result.fatalError, results);
		const attempted = results.filter((entry) => ATTEMPTED_STATUSES.has(entry.status)).length;
		const notAttempted = results.filter((entry) => entry.status === "not_attempted").length;
		const counts = Object.freeze({
			requested: results.length,
			eligible: Math.max(plan.eligible?.length || 0, attempted + notAttempted),
			attempted,
			successful: results.filter((entry) => entry.status === "deleted").length,
			noOp: 0,
			skipped: results.filter((entry) => entry.status === "rejected").length,
			failed: results.filter((entry) => entry.status === "failed").length,
			notAttempted
		});
		return Object.freeze({
			operationType: OPERATION_TYPE,
			startedAt,
			completedAt,
			status,
			pageContext: Object.freeze({
				marathonId,
				marathonName
			}),
			counts,
			results: Object.freeze(results),
			message: JSON.stringify({
				sectionName: plan.sectionName,
				counts
			})
		});
	}
	function appendStatus(dialog, message) {
		const current = (dialog.shadowRoot?.querySelector?.(".status"))?.textContent || "";
		dialog.showStatus?.(`${current}${current ? " " : ""}${message}`);
	}
	function addHistoryButton(dialog, executionId, openHistory) {
		const button = (dialog.ownerDocument || globalThis.document)?.createElement?.("button");
		if (!button) return;
		button.type = "button";
		button.className = "edvibe-batch-section-deletion-history";
		button.textContent = "Open in history";
		button.addEventListener("click", () => openHistory?.(executionId));
		dialog.shadowRoot?.querySelector?.("footer")?.appendChild?.(button);
	}
	function createHistoryAwareFeature(options = {}) {
		const { createFeature = createBatchSectionDeletionFeature$1, createDialog, persistExecution, getLocationHref = () => "", getMarathonName = () => null, now = () => /* @__PURE__ */ new Date(), log = () => {}, ...featureOptions } = options;
		if (typeof createDialog !== "function") throw new TypeError("createDialog is required");
		if (typeof persistExecution !== "function") throw new TypeError("persistExecution is required");
		function createTrackedDialog() {
			const dialog = createDialog();
			const originalConfigure = dialog.configure.bind(dialog);
			let plan = null;
			let latestResult = null;
			let startedAt = null;
			let terminal = false;
			let sequence = 0;
			async function persist(result, terminalStatus = null, fatalError = null) {
				const currentSequence = sequence;
				try {
					const completedAt = now().toISOString();
					const input = buildExecutionHistoryInput({
						plan,
						result: result || latestResult || {},
						startedAt: startedAt || completedAt,
						completedAt,
						marathonId: parseMarathonId(getLocationHref()),
						marathonName: getMarathonName(),
						terminalStatus,
						fatalError
					});
					const history = await persistExecution(input);
					return currentSequence === sequence ? history : Object.freeze({
						stored: false,
						stale: true
					});
				} catch (persistenceError) {
					log("Batch section deletion history persistence failed:", persistenceError);
					return Object.freeze({
						stored: false,
						persistenceError
					});
				}
			}
			dialog.configure = (config = {}) => {
				const originalInspect = config.onInspect;
				const originalExecute = config.onExecute;
				const originalClose = config.onClose;
				const originalOpenHistory = config.onOpenHistory;
				return originalConfigure({
					...config,
					async onInspect(input) {
						const inspected = await originalInspect(input);
						sequence += 1;
						plan = enrichPlan(inspected, input?.selectedLessonIds || []);
						latestResult = {
							plan,
							results: []
						};
						startedAt = now().toISOString();
						terminal = false;
						if (!plan.eligible.length) {
							terminal = true;
							persist(latestResult).then((history) => {
								if (history?.stored) {
									appendStatus(dialog, "Result saved to execution history.");
									if (history.record?.id) addHistoryButton(dialog, history.record.id, originalOpenHistory);
								} else if (history?.persistenceError) appendStatus(dialog, "The visible preflight is intact, but history could not be saved.");
							});
						}
						return plan;
					},
					async onExecute(confirmedPlan, onProgress) {
						plan = enrichPlan(confirmedPlan, confirmedPlan.selectedLessonIds || []);
						startedAt = startedAt || now().toISOString();
						terminal = false;
						try {
							const result = await originalExecute(plan, (progress = {}) => {
								if (Array.isArray(progress.results)) latestResult = {
									plan,
									results: [...progress.results],
									fatalError: progress.fatalError || null
								};
								onProgress?.(progress);
							});
							latestResult = result;
							terminal = true;
							const history = await persist(result, result.fatalError ? "interrupted" : null, result.fatalError || null);
							return {
								...result,
								history
							};
						} catch (error) {
							terminal = true;
							await persist(latestResult, "interrupted", error);
							throw error;
						}
					},
					onOpenHistory: originalOpenHistory,
					onClose() {
						if (plan && !terminal) {
							terminal = true;
							persist(latestResult, "cancelled");
						}
						originalClose?.();
					}
				});
			};
			return dialog;
		}
		return createFeature({
			...featureOptions,
			createDialog: createTrackedDialog,
			log
		});
	}
	function installHistoryAwareFeature(baseApi = batch_section_deletion_exports) {
		return Object.freeze({
			...baseApi,
			createBatchSectionDeletionFeature(options = {}) {
				return createHistoryAwareFeature({
					...options,
					createFeature: baseApi.createBatchSectionDeletionFeature,
					getLocationHref: options.getLocationHref || (() => globalThis.location?.href || ""),
					getMarathonName: options.getMarathonName || (() => globalThis.document?.querySelector?.("h1")?.textContent?.trim() || globalThis.document?.title || null)
				});
			}
		});
	}
	function createBatchSectionDeletionFeature(options = {}) {
		return installHistoryAwareFeature(batch_section_deletion_exports).createBatchSectionDeletionFeature(options);
	}
	//#endregion
	//#region src/components/batch-section-deletion-dialog.styles.js
	var batchSectionDeletionDialogStyles = i$3`
:host{all:initial;font-family:Inter,system-ui,sans-serif;color:#202124}.overlay{position:fixed;inset:0;z-index:2147483647;background:rgba(16,20,30,.66);display:grid;place-items:center;padding:24px}.dialog{width:min(900px,96vw);max-height:92vh;background:#fff;border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden}.dialog header,.dialog footer{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 22px;border-bottom:1px solid #e6e8ec}.dialog footer{border-bottom:0;border-top:1px solid #e6e8ec;justify-content:flex-end}.dialog h2,.dialog p{margin:0}.dialog p{margin-top:4px;color:#68707d}.dialog main{padding:20px 22px;overflow:auto;display:grid;gap:16px}label{display:grid;gap:6px;font-weight:600}input[type=text]{padding:10px 12px;border:1px solid #b9c0ca;border-radius:8px;font:inherit}.toolbar{display:flex;align-items:center;gap:8px}.selection{margin-left:auto;color:#68707d}.lessons{border:1px solid #dde1e7;border-radius:10px;max-height:280px;overflow:auto}.lesson{display:flex;grid-template-columns:none;align-items:center;gap:10px;padding:10px 12px;font-weight:400;border-bottom:1px solid #edf0f3}.lesson:last-child{border-bottom:0}.status{padding:10px 12px;background:#f3f5f8;border-radius:8px}.preflight,.result{border:1px solid #dde1e7;border-radius:10px;padding:14px}.preflight h3,.preflight h4{margin:0 0 8px}.preflight dl{display:flex;gap:20px;margin:0 0 14px}.preflight dl div{display:flex;gap:6px}.preflight dd{margin:0;font-weight:700}.preflight ul{margin:0 0 14px;padding-left:20px}.result textarea{box-sizing:border-box;width:100%;min-height:220px;resize:vertical;font:12px/1.5 ui-monospace,monospace}.result-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.result-actions .history{background:#315efb;color:#fff}button{border:0;border-radius:8px;padding:9px 13px;font:600 14px/1.2 inherit;background:#eef1f5;color:#222;cursor:pointer}button:hover{filter:brightness(.97)}button:disabled{opacity:.5;cursor:not-allowed}.inspect{background:#315efb;color:#fff}.danger{background:#c62828;color:#fff}.secondary{background:#eef1f5}.icon{font-size:24px;line-height:1;padding:5px 9px;background:transparent}@media(max-width:640px){.overlay{padding:8px}.dialog{max-height:98vh}.dialog header,.dialog footer,.dialog main{padding:14px}.dialog footer{flex-wrap:wrap}.preflight dl{flex-wrap:wrap}}

`;
	//#endregion
	//#region src/components/batch-section-deletion-dialog.js
	var BATCH_SECTION_DELETION_DIALOG_TAG = "edvibe-toolbox-batch-section-deletion-dialog";
	var BatchSectionDeletionDialog = class extends i {
		static styles = [
			componentFoundationStyles,
			dialogFoundationStyles,
			batchSectionDeletionDialogStyles
		];
		static properties = {
			options: { state: true },
			sectionName: { state: true },
			selectedLessonIds: { state: true },
			plan: { state: true },
			executionId: { state: true },
			busy: { state: true },
			statusMessage: { state: true },
			statusVisible: { state: true },
			resultReport: { state: true },
			resultVisible: { state: true }
		};
		constructor() {
			super();
			this.options = null;
			this.sectionName = "";
			this.selectedLessonIds = /* @__PURE__ */ new Set();
			this.plan = null;
			this.executionId = null;
			this.busy = false;
			this.statusMessage = "";
			this.statusVisible = false;
			this.resultReport = "";
			this.resultVisible = false;
		}
		configure(options = {}) {
			this.options = options && typeof options === "object" ? options : {};
			this.selectedLessonIds = /* @__PURE__ */ new Set();
			this.plan = null;
			this.executionId = null;
			this.resultReport = "";
			this.resultVisible = false;
			return this;
		}
		selectedIds() {
			return [...this.selectedLessonIds];
		}
		setLessonSelected(lessonId, selected) {
			if (this.busy) return;
			const next = new Set(this.selectedLessonIds);
			if (selected) next.add(Number(lessonId));
			else next.delete(Number(lessonId));
			this.selectedLessonIds = next;
		}
		selectAll() {
			if (this.busy) return;
			this.selectedLessonIds = new Set((this.options?.lessons || []).map((lesson) => Number(lesson.lessonId)));
		}
		clearSelection() {
			if (this.busy) return;
			this.selectedLessonIds = /* @__PURE__ */ new Set();
		}
		setBusy(message) {
			this.busy = true;
			this.showStatus(message);
		}
		clearBusy() {
			this.busy = false;
		}
		async inspect() {
			const selectedLessonIds = this.selectedIds();
			if (!this.sectionName.trim() || selectedLessonIds.length === 0) {
				this.showStatus("Enter a section name and select at least one lesson.");
				return;
			}
			this.setBusy("Inspecting lessons…");
			try {
				this.plan = await this.options.onInspect({
					sectionName: this.sectionName,
					selectedLessonIds,
					onProgress: ({ current, total }) => this.showStatus(`Inspecting ${current}/${total}…`)
				});
			} catch (error) {
				this.showStatus(error.message || "Inspection failed.");
			} finally {
				this.clearBusy();
			}
		}
		async execute() {
			if (!this.plan || this.plan.eligible.length === 0) return;
			this.setBusy("Deleting sections…");
			try {
				const result = await this.options.onExecute(this.plan, ({ current, total }) => this.showStatus(`Deleting ${current}/${total}…`));
				this.resultReport = String(result.report || "");
				this.resultVisible = true;
				this.executionId = result.history?.stored ? result.history.record?.id || null : null;
				const outcome = result.fatalError ? "Stopped after an operation-wide error. Partial results retained." : "Deletion finished.";
				const history = result.history?.stored ? " Saved to execution history." : result.history?.persistenceError ? " The visible report is intact, but history could not be saved." : "";
				this.showStatus(`${outcome}${history}`);
			} catch (error) {
				this.showStatus(error.message || "Deletion failed.");
			} finally {
				this.clearBusy();
			}
		}
		showStatus(message) {
			this.statusMessage = String(message || "");
			this.statusVisible = true;
		}
		close() {
			if (!this.busy) this.options?.onClose?.();
		}
		openHistory() {
			if (this.executionId) this.options?.onOpenHistory?.(this.executionId);
		}
		renderPlanGroup(title, items, formatter) {
			return b`
            <h4>${title}</h4>
            <ul>${items.length ? items.map((item) => b`<li>${formatter(item)}</li>`) : b`<li>None</li>`}</ul>
        `;
		}
		renderPlan() {
			if (!this.plan) return A;
			return b`
            <section class="preflight">
                <h3>Preflight</h3>
                <dl>
                    <div><dt>Selected</dt><dd>${this.plan.selectedCount}</dd></div>
                    <div><dt>Eligible</dt><dd>${this.plan.eligible.length}</dd></div>
                    <div><dt>Rejected</dt><dd>${this.plan.rejected.length}</dd></div>
                </dl>
                ${this.renderPlanGroup("Will delete", this.plan.eligible, (item) => `#${item.number} ${item.name} → section ${item.sectionId}`)}
                ${this.renderPlanGroup("Will not modify", this.plan.rejected, (item) => `#${item.number} ${item.name}: ${item.code} — ${item.message}`)}
            </section>
        `;
		}
		render() {
			const lessons = this.options?.lessons || [];
			const canExecute = Boolean(this.plan?.eligible?.length) && !this.resultVisible;
			return b`
<div class="overlay">
                <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="title">
                    <header>
                        <div><h2 id="title">Delete section from lessons</h2><p>Every lesson is inspected before any deletion.</p></div>
                        <button class="icon close" type="button" aria-label="Close" ?disabled=${this.busy}
                            @click=${() => this.close()}>×</button>
                    </header>
                    <main>
                        <label>Exact section name<input class="section-name" type="text" autocomplete="off"
                            placeholder="Ogłoszenie" .value=${this.sectionName} ?disabled=${this.busy}
                            @input=${(event) => {
				this.sectionName = event.currentTarget.value;
			}}></label>
                        <div class="toolbar">
                            <button class="select-all" type="button" ?disabled=${this.busy} @click=${this.selectAll}>Select all</button>
                            <button class="clear" type="button" ?disabled=${this.busy} @click=${this.clearSelection}>Clear</button>
                            <span class="selection">${this.selectedLessonIds.size} selected</span>
                        </div>
                        <div class="lessons">
                            ${lessons.map((lesson) => b`
                                <label class="lesson">
                                    <input type="checkbox" .value=${String(lesson.lessonId)}
                                        .checked=${this.selectedLessonIds.has(Number(lesson.lessonId))}
                                        ?disabled=${this.busy}
                                        @change=${(event) => this.setLessonSelected(lesson.lessonId, event.currentTarget.checked)}>
                                    <span>#${lesson.number} ${lesson.name}</span>
                                </label>
                            `)}
                        </div>
                        <div class="status" ?hidden=${!this.statusVisible}>${this.statusMessage}</div>
                        ${this.renderPlan()}
                        <section class="result" ?hidden=${!this.resultVisible}>
                            <textarea readonly .value=${this.resultReport}></textarea>
                            <div class="result-actions">
                                <button class="copy" type="button" ?disabled=${this.busy}
                                    @click=${() => this.options?.onCopy?.(this.resultReport)}>Copy report</button>
                                <button class="history" type="button" ?hidden=${!this.executionId}
                                    ?disabled=${this.busy} @click=${this.openHistory}>Open in history</button>
                            </div>
                        </section>
                    </main>
                    <footer>
                        <button class="secondary close" type="button" ?disabled=${this.busy}
                            @click=${() => this.close()}>Cancel</button>
                        <button class="inspect" type="button" ?hidden=${this.resultVisible} ?disabled=${this.busy}
                            @click=${this.inspect}>${this.plan ? "Run preflight again" : "Inspect selected lessons"}</button>
                        <button class="danger execute" type="button" ?hidden=${!canExecute} ?disabled=${this.busy}
                            @click=${this.execute}>Confirm deletion</button>
                    </footer>
                </section>
            </div>
        `;
		}
	};
	if (!customElements.get("edvibe-toolbox-batch-section-deletion-dialog")) customElements.define(BATCH_SECTION_DELETION_DIALOG_TAG, BatchSectionDeletionDialog);
	var batchSectionDeletionDialogApi = Object.freeze({
		BATCH_SECTION_DELETION_DIALOG_TAG,
		BatchSectionDeletionDialog
	});
	globalThis.EdVibeBatchSectionDeletionDialog = batchSectionDeletionDialogApi;
	//#endregion
	//#region src/main.js
	var createMainLog = createLoggerFactory("MAIN");
	var log = createMainLog();
	log("Initializing Toolbox modules...");
	var transport = createWebSocketTransport({
		WebSocketClass: window.WebSocket,
		cryptoApi: window.crypto,
		log: createMainLog("Transport")
	});
	transport.install(window);
	var operationGuard = createOperationGuard();
	var wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	var guardedActiveChange = (key) => (isActive) => {
		if (isActive) operationGuard.activate(key);
		else operationGuard.release(key);
	};
	var storageBridge = createStorageBridge({
		window,
		cryptoApi: window.crypto
	});
	var historyService = createExecutionHistoryService({
		repository: createExecutionHistoryRepository({
			indexedDbApi: indexeddb_exports,
			indexedDB: window.indexedDB
		}),
		preferenceStore: createRetentionPreferenceStore(storageBridge),
		downloader: createJsonDownloader({
			document,
			URL: window.URL,
			Blob: window.Blob
		}),
		cryptoApi: window.crypto
	});
	var executionHistoryFeature = createExecutionHistoryFeature({
		service: historyService,
		canStart: operationGuard.canStart,
		onActiveChange: guardedActiveChange("history"),
		createDialog: () => document.createElement(EXECUTION_HISTORY_DIALOG_TAG),
		log: createMainLog("History")
	});
	function notifyExportStatus(state, message = "") {
		window.postMessage(createExportStatusMessage(state, message), "*");
	}
	var marathonExportFeature = createMarathonExportFeature({
		sendRequest: transport.sendRequest,
		wait,
		canStart: operationGuard.canStart,
		onActiveChange: guardedActiveChange("export"),
		notifyStatus: notifyExportStatus,
		log: createMainLog("Export"),
		compileToZip: (backupData, options) => compileMarathonToZip(backupData, {
			...options,
			log: createMainLog("Zip")
		})
	});
	var lessonResetFeature = createResetLessonsFeature({
		sendRequest: transport.sendRequest,
		sendWithoutResponse: transport.sendWithoutResponse,
		wait,
		canStart: operationGuard.canStart,
		onActiveChange: guardedActiveChange("reset"),
		log: createMainLog("Reset")
	});
	var recorderOpen = false;
	var actionRecorderFeature = createActionRecorderFeature({
		subscribeFrames: transport.subscribeFrames,
		createPanel() {
			const panel = document.createElement(RECORDER_DIALOG_TAG);
			const configure = panel.configure.bind(panel);
			panel.configure = (options = {}) => configure({
				...options,
				onClose() {
					try {
						options.onClose?.();
					} finally {
						recorderOpen = false;
						operationGuard.release("recording");
					}
				}
			});
			recorderOpen = true;
			return panel;
		},
		log: createMainLog("Recorder")
	});
	var batchLessonAccessFeature = createHistoryAwareFeature$1({
		createFeature: createBatchLessonAccessFeature,
		sendRequest: transport.sendRequest,
		getConnectionState: transport.getConnectionState,
		wait,
		canStart: operationGuard.canStart,
		onActiveChange: guardedActiveChange("batch-access"),
		createDialog: () => document.createElement(BATCH_ACCESS_DIALOG_TAG),
		copyText: (text) => navigator.clipboard.writeText(text),
		persistExecution: historyService.persistTerminal,
		openHistory: (executionId) => executionHistoryFeature.open({ executionId }),
		getLocationHref: () => window.location.href,
		getMarathonName: () => document.querySelector("h1")?.textContent?.trim() || document.title || null,
		log: createMainLog("BatchAccessHistory")
	});
	var createBatchUserManagementDialog = createHistoryAwareDialog$1({
		createDialog: () => document.createElement(USER_MANAGEMENT_DIALOG_TAG),
		persistExecution: historyService.persistTerminal,
		openHistory: (executionId) => executionHistoryFeature.open({ executionId }),
		getLocationHref: () => window.location.href,
		getMarathonName: () => document.querySelector("h1")?.textContent?.trim() || document.title || null,
		log: createMainLog("BatchUserManagementHistory")
	});
	var batchUserManagementFeature = createBatchUserManagementFeature({
		sendRequest: transport.sendRequest,
		getConnectionState: transport.getConnectionState,
		wait,
		canStart: operationGuard.canStart,
		onActiveChange: guardedActiveChange("batch-user-management"),
		createDialog: createBatchUserManagementDialog,
		log: createMainLog("BatchUserManagement")
	});
	var batchUserOnboardingFeature = createBatchUserOnboardingFeature({
		sendRequest: transport.sendRequest,
		getConnectionState: transport.getConnectionState,
		wait,
		canStart: operationGuard.canStart,
		onActiveChange: guardedActiveChange("batch-user-onboarding"),
		createDialog: () => document.createElement(BATCH_USER_ONBOARDING_DIALOG_TAG),
		copyText: (text) => navigator.clipboard.writeText(text),
		persistExecution: historyService.persistTerminal,
		openHistory: (executionId) => executionHistoryFeature.open({ executionId }),
		getLocationHref: () => window.location.href,
		getMarathonName: () => document.querySelector("h1")?.textContent?.trim() || document.title || null,
		getRequestContext: () => ({ host: window.location.hostname }),
		log: createMainLog("BatchUserOnboarding")
	});
	var createBatchSectionCreationDialog = createHistoryAwareDialog({
		createDialog: () => document.createElement(BATCH_SECTION_DIALOG_TAG),
		persistExecution: historyService.persistTerminal,
		openHistory: (executionId) => executionHistoryFeature.open({ executionId }),
		getLocationHref: () => window.location.href,
		getMarathonName: () => document.querySelector("h1")?.textContent?.trim() || document.title || null,
		log: createMainLog("BatchSectionCreationHistory")
	});
	var batchSectionCreationAdapter = createImageUploadCreationAdapter({
		recipe: dynamicImageRecipe,
		cryptoApi: window.crypto
	});
	var batchSectionCreationFeature = createBatchSectionCreationFeature({
		sendRequest: transport.sendRequest,
		getConnectionState: transport.getConnectionState,
		wait,
		canStart: operationGuard.canStart,
		onActiveChange: guardedActiveChange("batch-section-creation"),
		adapter: batchSectionCreationAdapter,
		createDialog: createBatchSectionCreationDialog,
		copyText: (text) => navigator.clipboard.writeText(text),
		log: createMainLog("BatchSectionCreation")
	});
	var batchSectionDeletionFeature = createBatchSectionDeletionFeature({
		sendRequest: transport.sendRequest,
		getConnectionState: transport.getConnectionState,
		wait,
		canStart: operationGuard.canStart,
		onActiveChange: guardedActiveChange("batch-section-deletion"),
		createDialog: () => document.createElement(BATCH_SECTION_DELETION_DIALOG_TAG),
		copyText: (text) => navigator.clipboard.writeText(text),
		persistExecution: historyService.persistTerminal,
		openHistory: (executionId) => executionHistoryFeature.open({ executionId }),
		log: createMainLog("BatchSectionDeletion")
	});
	function openActionRecorder() {
		if (recorderOpen) actionRecorderFeature.open();
		else if (operationGuard.activate("recording")) try {
			actionRecorderFeature.open();
		} catch (error) {
			operationGuard.release("recording");
			throw error;
		}
		else window.alert("Another Edvibe Toolbox operation is already running.");
	}
	var mainCommandHandlers = /* @__PURE__ */ new Map([
		[WINDOW_MESSAGE_TYPES.START_EXPORT, () => marathonExportFeature.start()],
		[WINDOW_MESSAGE_TYPES.OPEN_LESSON_RESET, () => lessonResetFeature.open()],
		[WINDOW_MESSAGE_TYPES.OPEN_BATCH_LESSON_ACCESS, () => batchLessonAccessFeature.open()],
		[WINDOW_MESSAGE_TYPES.OPEN_BATCH_USER_ONBOARDING, () => batchUserOnboardingFeature.open()],
		[WINDOW_MESSAGE_TYPES.OPEN_BATCH_USER_MANAGEMENT, () => batchUserManagementFeature.open()],
		[WINDOW_MESSAGE_TYPES.OPEN_BATCH_SECTION_CREATION, () => batchSectionCreationFeature.open()],
		[WINDOW_MESSAGE_TYPES.OPEN_BATCH_SECTION_DELETION, () => batchSectionDeletionFeature.open()],
		[WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY, (data) => executionHistoryFeature.open({ executionId: data.executionId || null })],
		[WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER, openActionRecorder]
	]);
	window.addEventListener("message", (event) => {
		if (event.source !== window || !isMainCommandMessage(event.data)) return;
		mainCommandHandlers.get(event.data.type)?.(event.data);
	});
	log("Toolbox modules ready.");
	//#endregion
})();
