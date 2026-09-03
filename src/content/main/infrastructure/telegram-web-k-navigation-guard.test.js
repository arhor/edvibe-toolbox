import assert from 'node:assert/strict';
import test from 'node:test';

import { registerTelegramWebKEscapeGuard } from '#src/content/main/infrastructure/telegram-web-k-navigation-guard.js';

test('Telegram escape guard should block Telegram navigation and expose cleanup', () => {
    let registeredHandler = null;
    let unregisterCalls = 0;
    const adapter = {
        globalObject: {
            appNavigationController: {
                registerEscapeHandler(handler) {
                    registeredHandler = handler;
                    return () => {
                        unregisterCalls += 1;
                    };
                }
            }
        }
    };

    const unregister = registerTelegramWebKEscapeGuard(adapter);

    assert.equal(typeof unregister, 'function');
    assert.equal(registeredHandler(), false);

    unregister();
    assert.equal(unregisterCalls, 1);
});

test('Telegram escape guard should degrade safely when navigation hook is unavailable', () => {
    assert.equal(registerTelegramWebKEscapeGuard({ globalObject: {} }), null);
    assert.equal(registerTelegramWebKEscapeGuard(null), null);
});
