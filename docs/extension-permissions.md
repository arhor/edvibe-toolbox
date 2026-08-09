# Extension permissions

Edvibe Toolbox keeps its Manifest V3 permission surface intentionally small.

| Capability | Manifest declaration | Current use |
| --- | --- | --- |
| Extension storage | `storage` | Persists export busy state and execution-history preferences through the ISOLATED-world bridge. |
| User-invoked active tab | `activeTab` | Lets the popup inspect the active tab URL after the extension action is invoked and address that tab for Toolbox commands. |
| Automatic Edvibe runtime injection | `content_scripts.matches` for `*://*.edvibe.com/*` | Loads the ISOLATED and MAIN runtime entry points on supported Edvibe pages at `document_start`. |

The extension does not request `scripting`: production code uses statically declared content scripts and never calls `chrome.scripting`.

The extension also does not request separate `host_permissions`. Its automatic page access is declared by the static content-script match pattern, while popup access to the user-selected active tab is temporary through `activeTab`.

When a feature needs a new Chrome capability, add the narrowest permission that supports its current runtime behavior and update this document together with the manifest contract test.