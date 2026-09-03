# Telegram Web K runtime adapter

This document records the private Telegram Web K integration facts that Toolfox relies on and the boundary that keeps those facts out of product features.

## Scope

The initial integration targets Telegram Web K at `https://web.telegram.org/k/`. Telegram Web A is intentionally unsupported.

Toolfox reuses the existing ISOLATED bridge on both supported platforms while keeping MAIN composition separate. Edvibe retains its existing `src/content/main/index.js` entry and dependency graph. Telegram Web K uses its own minimal MAIN entry, `src/content/main/telegram-web-k.js`, which creates only the Telegram context and adapter. Loading Telegram Web K therefore does not import or initialize the Edvibe feature graph.

Feature code must depend on semantic adapter operations and normalized values. It must not reference Telegram globals, manager names, IndexedDB records, or raw Telegram objects.

## Source-verified runtime contract

Reviewed against the current Telegram Web K source on 2026-09-03 (`morethanwords/tweb`). These are private implementation details and may change without notice.

- `createProxiedManagersForAccount(accountNumber)` is mounted on the page global object by `src/lib/getProxiedManagers.ts`.
- The active account number is derived from the `account` URL query parameter. Valid account numbers are `1` through `4`; absent or invalid values resolve to account `1`.
- `dialogsStorage.getDialogs({ offsetIndex, limit })` returns a page containing `dialogs`; each normal dialog exposes `peerId` and `top_message` used by the adapter.
- `appPeersManager.getPeer(peerId)` resolves the current peer object.
- Telegram group shapes used by Toolfox are:
  - basic group: peer `_ === 'chat'`;
  - supergroup: peer `_ === 'channel'` with `pFlags.megagroup`;
  - creator/owner: `pFlags.creator`.
- `appMessagesManager.getMessageByPeer(peerId, topMessageId)` resolves the dialog's top message; its `date` field is Unix seconds and is normalized by Toolfox to an ISO timestamp.
- For chat peers, Telegram's own peer-id helpers derive the chat id as `Math.abs(peerId)`. `appChatsManager.hasRights(chatId, 'send_plain')` provides the text-send permission check used by the adapter.
- `appMessagesManager.sendText({ peerId, text })` is the current text-send path.

The adapter is intentionally the only Toolfox module that knows these names and shapes.

## Toolfox adapter contract

`TelegramWebKAdapter` exposes:

- `getCompatibility()` — reports `supported` or an explicit unsupported reason without touching user data;
- `listDialogs({ offset, limit })` — returns normalized dialog summaries and pagination state;
- `resolvePeer(peerId)` — returns normalized peer metadata;
- `getLastActivity(dialog)` — returns an ISO timestamp or `null`;
- `canSendText(peerId)` — checks the current runtime's plain-text permission for a chat peer;
- `resolveGroupCandidate(dialog)` — combines normalized group metadata, ownership, last activity, and send capability;
- `sendText(peerId, text)` — sends plain text through the already-authenticated Telegram Web session;
- `probe()` — non-mutating runtime validation for discovery, peer resolution, and last-activity calls. Sending remains explicitly pending until a live test message is performed.

Normalized objects deliberately omit Telegram manager references and raw flags.

## Compatibility and startup behavior

The content script starts at `document_start`, before Telegram necessarily mounts its runtime globals. A missing manager factory is therefore not cached as a permanent failure. The adapter checks compatibility lazily when an operation is requested and can become supported later in the same page lifecycle.

When the expected boundary is absent or rejects the expected call shape, Toolfox raises `TelegramWebKRuntimeError` with a Toolfox-owned error code. The host page is not modified to emulate missing Telegram APIs, and Toolfox does not fall back to DOM automation or direct IndexedDB reads.

## Production field validation

Status: **pending live production validation**.

The production check must be performed in a logged-in Telegram Web K tab with a dedicated group that is safe to receive a test message. Do not record credentials, cookies, session/auth keys, message contents, peer identifiers, group titles, or private data in GitHub.

Only structural facts should be retained, for example:

- whether `createProxiedManagersForAccount` exists;
- whether dialog paging succeeds and returns an array;
- whether peer resolution returns a recognized group shape;
- whether top-message resolution provides a numeric `date`;
- whether `hasRights(..., 'send_plain')` returns a boolean;
- whether one test message is successfully sent to the dedicated group.

After this check, update this section with the validation date and the structural result. If production differs from the source-verified contract, adapt only the Telegram adapter rather than leaking a compatibility branch into feature code.

## Upstream references

- `src/lib/getProxiedManagers.ts`
- `src/lib/accounts/getCurrentAccount.ts`
- `src/lib/accounts/getCurrentAccountFromURL.ts`
- `src/lib/accounts/getValidatedAccount.ts`
- `src/lib/accounts/constants.ts`
- `src/helpers/peerIdPolyfill.ts`
- `src/lib/storages/dialogs.ts`
- `src/lib/appManagers/appPeersManager.ts`
- `src/lib/appManagers/appChatsManager.ts`
- `src/lib/appManagers/appMessagesManager.ts`
