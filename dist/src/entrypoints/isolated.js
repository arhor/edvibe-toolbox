(function() {
	//#region src/isolated.js
	var log = EdVibeLogger.createLoggerFactory("ISOLATED")();
	var STORAGE_REQUEST_TYPE = "EDVIBE_TOOLBOX_STORAGE_REQUEST";
	var STORAGE_RESPONSE_TYPE = "EDVIBE_TOOLBOX_STORAGE_RESPONSE";
	var ALLOWED_STORAGE_KEYS = /* @__PURE__ */ new Set(["executionHistoryPreferences"]);
	log("Script successfully injected and initialized.");
	chrome.storage.local.set({ exportInProgress: false }, () => {
		log("Reset stale export state for the loaded page.");
	});
	window.addEventListener("message", (event) => {
		if (event.source !== window || !event.data?.type) return;
		if (event.data.type === "EDVIBE_TOOLBOX_EXPORT_STATUS") relayExportStatus(event.data);
		if (event.data.type === STORAGE_REQUEST_TYPE) handleStorageRequest(event.data);
	});
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		log("Incoming message received:", message);
		const commands = {
			OPEN_LESSON_RESET: [
				"EDVIBE_TOOLBOX_OPEN_RESET",
				"src/components/reset-lessons-dialog.css",
				"Lesson reset workflow opened."
			],
			OPEN_ACTION_RECORDER: [
				"EDVIBE_TOOLBOX_OPEN_RECORDER",
				"src/components/action-recorder-dialog.css",
				"Action recorder opened."
			],
			OPEN_BATCH_LESSON_ACCESS: [
				"EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS",
				"src/components/batch-lesson-access-dialog.css",
				"Batch lesson access opened."
			],
			OPEN_BATCH_USER_ONBOARDING: [
				"EDVIBE_TOOLBOX_OPEN_BATCH_USER_ONBOARDING",
				"src/components/batch-user-onboarding-dialog.css",
				"Batch user onboarding opened."
			],
			OPEN_BATCH_USER_MANAGEMENT: [
				"EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT",
				"src/components/batch-user-management-dialog.css",
				"Batch user management opened."
			],
			OPEN_BATCH_SECTION_CREATION: [
				"EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION",
				"src/components/batch-section-creation-dialog.css",
				"Batch section creation opened."
			],
			OPEN_BATCH_SECTION_DELETION: [
				"EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_DELETION",
				"src/components/batch-section-deletion-dialog.css",
				"Batch section deletion opened."
			],
			OPEN_EXECUTION_HISTORY: [
				"EDVIBE_TOOLBOX_OPEN_EXECUTION_HISTORY",
				"src/components/execution-history-dialog.css",
				"Execution history opened."
			]
		};
		if (message.action === "START_FULL_AUTOMATION") {
			relayExportStatus({ state: "started" });
			window.postMessage({
				type: "EDVIBE_TOOLBOX_START_ALL",
				stylesheetUrl: chrome.runtime.getURL("src/components/export-progress-dialog.css")
			}, "*");
			sendResponse({
				status: "success",
				info: "Automation sequence channeled to page engine."
			});
		} else if (commands[message.action]) {
			const [type, stylesheet, info] = commands[message.action];
			window.postMessage({
				type,
				stylesheetUrl: chrome.runtime.getURL(stylesheet)
			}, "*");
			sendResponse({
				status: "success",
				info
			});
		} else sendResponse({ status: "ignored" });
		return true;
	});
	function relayExportStatus(payload) {
		const isActive = payload.state === "started";
		chrome.storage.local.set({ exportInProgress: isActive }, () => {
			chrome.runtime.sendMessage({
				action: "EXPORT_STATUS",
				state: payload.state,
				message: payload.message || ""
			});
		});
	}
	async function handleStorageRequest(request) {
		const response = {
			type: STORAGE_RESPONSE_TYPE,
			requestId: request.requestId
		};
		try {
			if (!ALLOWED_STORAGE_KEYS.has(request.key)) throw new Error("Storage key is not allowed");
			if (request.action === "get") response.value = (await getLocalStorage(request.key))[request.key];
			else if (request.action === "set") {
				await setLocalStorage({ [request.key]: request.value });
				response.value = request.value;
			} else throw new Error("Storage action is not supported");
			response.ok = true;
		} catch (error) {
			response.ok = false;
			response.error = error.message || "Storage request failed";
		}
		window.postMessage(response, "*");
	}
	function getLocalStorage(key) {
		return new Promise((resolve, reject) => {
			chrome.storage.local.get(key, (values) => {
				if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
				else resolve(values || {});
			});
		});
	}
	function setLocalStorage(values) {
		return new Promise((resolve, reject) => {
			chrome.storage.local.set(values, () => {
				if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
				else resolve();
			});
		});
	}
	//#endregion
})();
