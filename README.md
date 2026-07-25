# Edvibe Toolbox

**Edvibe Toolbox** is a versatile Google Chrome browser extension designed to automate routine processes, extend interface capabilities, and optimize workflows on the Edvibe platform.

---

## ✨ Key Features

* **Process Automation:** Execute repetitive and uniform actions in just a few clicks via the built-in control panel.
* **Data Management:** Real-time tools to analyze, intercept, and process the platform's internal data structures.
* **Interface Customization:** Local UI/UX enhancements tailored to adapt the platform to specific user needs.
* **WebSocket Action Recorder:** Capture a manual Edvibe workflow as correlated
  request/response operations, copy `sendRequest(...)` scaffolding, and export a
  local JSON trace without opening DevTools.

## WebSocket Action Recorder

Open any Edvibe page, select **Запись действий WebSocket** in the extension
popup, and start recording in the in-page panel. Perform one logical operation,
stop the recording, then inspect its requests and responses. Individual
requests and a review-only recipe can be copied; the complete trace can be
downloaded as JSON.

The recorder never replays traffic. Generated code contains the exact observed
values and must be reviewed for dynamic IDs, sequencing, and mutation effects.
If an operation produces no frames, it may use HTTP, uploads, browser storage,
or DOM-only behavior instead of WebSocket messaging.

Recordings stay in page memory until exported and are lost on navigation or
reload. Common credential fields are redacted, but traces may still contain
pupil data, names, answers, lesson content, email addresses, and stable IDs.
Review recordings before sharing or committing them. A session stops at 1,000
frames, 5 MiB of text traffic, or 10 minutes.

---

## 🚀 Installation (Developer Mode)

Since this is a custom tool, it is installed directly from the source code, bypassing the Chrome Web Store:

1.  **Download the Project:** Clone this repository or download it as a ZIP archive and unpack it into a local folder.
2.  **Open Extensions Page:** Open Google Chrome and navigate to `chrome://extensions/`.
3.  **Enable Developer Mode:** Toggle the **"Developer mode"** switch in the top-right corner of the page.
4.  **Load the Extension:** Click the **"Load unpacked"** button that appears in the top-left corner.
5.  **Select the Folder:** In the file picker, select the directory containing the `manifest.json` file.

> 💡 **Tip:** Once installed, click the "puzzle" icon on the Chrome toolbar and pin the extension for quick access to the control panel.

---

## 🛠️ Tech Stack

The project is built in compliance with the **Manifest V3** standard and utilizes a clean web stack without heavy frameworks:
* **HTML5 / CSS3** — Modular layout for the control panel interface (Popup).
* **Vanilla JavaScript** — Isolated runtime architecture (Content Scripts) for secure interaction with the Edvibe page context.

Whenever you make changes to the source code, simply click the **"Reload"** (circular arrow) icon on the extension's card within the `chrome://extensions/` dashboard.
