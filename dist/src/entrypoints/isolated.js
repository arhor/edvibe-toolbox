(function() {
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
	var RUNTIME_MESSAGE_ACTIONS = Object.freeze({ EXPORT_STATUS: "EXPORT_STATUS" });
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
	new Set(Object.values(COMMAND_ROUTES).map(({ type }) => type));
	var EXPORT_STATE_VALUES = new Set(Object.values(EXPORT_STATES));
	var STORAGE_ACTION_VALUES = new Set(Object.values(STORAGE_ACTIONS));
	var STORAGE_KEY_VALUES = new Set(Object.values(STORAGE_KEYS));
	function isRecord(value) {
		return value !== null && typeof value === "object" && !Array.isArray(value);
	}
	function hasOnlyKeys(value, allowedKeys) {
		return Object.keys(value).every((key) => allowedKeys.has(key));
	}
	function isNonEmptyString(value) {
		return typeof value === "string" && value.length > 0;
	}
	function getCommandRoute(action) {
		return typeof action === "string" && Object.prototype.hasOwnProperty.call(COMMAND_ROUTES, action) ? COMMAND_ROUTES[action] : null;
	}
	function isPopupCommandMessage(value) {
		return isRecord(value) && hasOnlyKeys(value, /* @__PURE__ */ new Set(["action"])) && getCommandRoute(value.action) !== null;
	}
	function createMainCommandMessage(action, payload = {}) {
		const route = getCommandRoute(action);
		if (!route) throw new TypeError(`Unsupported popup command: ${String(action)}`);
		const message = { type: route.type };
		if (route.type === WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY && payload.executionId != null) {
			if (!isNonEmptyString(payload.executionId)) throw new TypeError("executionId must be a non-empty string");
			message.executionId = payload.executionId;
		}
		return Object.freeze(message);
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
	function isExportStatusMessage(value) {
		return isRecord(value) && hasOnlyKeys(value, /* @__PURE__ */ new Set([
			"type",
			"state",
			"message"
		])) && value.type === WINDOW_MESSAGE_TYPES.EXPORT_STATUS && EXPORT_STATE_VALUES.has(value.state) && (value.message === void 0 || typeof value.message === "string");
	}
	function createRuntimeExportStatusMessage(state, message = "") {
		if (!EXPORT_STATE_VALUES.has(state)) throw new TypeError(`Unsupported export state: ${String(state)}`);
		if (typeof message !== "string") throw new TypeError("Export status message must be a string");
		return Object.freeze({
			action: RUNTIME_MESSAGE_ACTIONS.EXPORT_STATUS,
			state,
			message
		});
	}
	function isStorageRequestMessage(value) {
		if (!isRecord(value) || value.type !== WINDOW_MESSAGE_TYPES.STORAGE_REQUEST || !isNonEmptyString(value.requestId) || !STORAGE_ACTION_VALUES.has(value.action) || !STORAGE_KEY_VALUES.has(value.key) || !hasOnlyKeys(value, /* @__PURE__ */ new Set([
			"type",
			"requestId",
			"action",
			"key",
			"value"
		]))) return false;
		if (value.action === STORAGE_ACTIONS.GET) return !Object.prototype.hasOwnProperty.call(value, "value");
		return Object.prototype.hasOwnProperty.call(value, "value") && value.value !== void 0;
	}
	function createStorageResponse({ requestId, ok, value, error }) {
		const candidate = {
			type: WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE,
			requestId,
			ok
		};
		if (ok) candidate.value = value;
		else candidate.error = error || "Storage request failed";
		if (!isStorageResponseMessage(candidate)) throw new TypeError("Invalid storage response");
		return Object.freeze(candidate);
	}
	function isStorageResponseMessage(value) {
		if (!isRecord(value) || value.type !== WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE || !isNonEmptyString(value.requestId) || typeof value.ok !== "boolean" || !hasOnlyKeys(value, /* @__PURE__ */ new Set([
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
	//#region src/isolated.js
	function initializeIsolatedBridge(options = {}) {
		const windowApi = options.windowApi || globalThis.window;
		const chromeApi = options.chromeApi || globalThis.chrome;
		const log = options.log || (() => {});
		if (!windowApi?.addEventListener || !windowApi?.postMessage) throw new TypeError("Window messaging APIs are required");
		if (!chromeApi?.runtime?.onMessage || !chromeApi?.storage?.local) throw new TypeError("Chrome runtime and storage APIs are required");
		log("Script successfully injected and initialized.");
		chromeApi.storage.local.set({ exportInProgress: false }, () => {
			log("Reset stale export state for the loaded page.");
		});
		const onWindowMessage = (event) => {
			if (event.source !== windowApi) return;
			if (isExportStatusMessage(event.data)) relayExportStatus(event.data);
			else if (isStorageRequestMessage(event.data)) handleStorageRequest(event.data);
		};
		const onRuntimeMessage = (message, _sender, sendResponse) => {
			log("Incoming message received:", message);
			if (!isPopupCommandMessage(message)) {
				sendResponse({ status: "ignored" });
				return true;
			}
			const route = getCommandRoute(message.action);
			if (message.action === POPUP_COMMANDS.START_EXPORT) relayExportStatus(createExportStatusMessage(EXPORT_STATES.STARTED));
			windowApi.postMessage(createMainCommandMessage(message.action), "*");
			sendResponse({
				status: "success",
				info: route.info
			});
			return true;
		};
		windowApi.addEventListener("message", onWindowMessage);
		chromeApi.runtime.onMessage.addListener(onRuntimeMessage);
		function relayExportStatus(payload) {
			if (!isExportStatusMessage(payload)) return;
			const isActive = payload.state === EXPORT_STATES.STARTED;
			chromeApi.storage.local.set({ exportInProgress: isActive }, () => {
				chromeApi.runtime.sendMessage(createRuntimeExportStatusMessage(payload.state, payload.message || ""));
			});
		}
		async function handleStorageRequest(request) {
			try {
				let value;
				if (request.action === STORAGE_ACTIONS.GET) value = (await getLocalStorage(request.key))[request.key];
				else {
					await setLocalStorage({ [request.key]: request.value });
					value = request.value;
				}
				windowApi.postMessage(createStorageResponse({
					requestId: request.requestId,
					ok: true,
					value
				}), "*");
			} catch (error) {
				windowApi.postMessage(createStorageResponse({
					requestId: request.requestId,
					ok: false,
					error: error.message || "Storage request failed"
				}), "*");
			}
		}
		function getLocalStorage(key) {
			return new Promise((resolve, reject) => {
				chromeApi.storage.local.get(key, (values) => {
					if (chromeApi.runtime.lastError) reject(new Error(chromeApi.runtime.lastError.message));
					else resolve(values || {});
				});
			});
		}
		function setLocalStorage(values) {
			return new Promise((resolve, reject) => {
				chromeApi.storage.local.set(values, () => {
					if (chromeApi.runtime.lastError) reject(new Error(chromeApi.runtime.lastError.message));
					else resolve();
				});
			});
		}
		return Object.freeze({ dispose() {
			windowApi.removeEventListener?.("message", onWindowMessage);
			chromeApi.runtime.onMessage.removeListener?.(onRuntimeMessage);
		} });
	}
	if (typeof window !== "undefined" && typeof chrome !== "undefined") initializeIsolatedBridge({
		windowApi: window,
		chromeApi: chrome,
		log: createLoggerFactory("ISOLATED")()
	});
	//#endregion
})();
