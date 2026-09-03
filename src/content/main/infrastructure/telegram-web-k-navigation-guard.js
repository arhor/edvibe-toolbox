function registerTelegramWebKEscapeGuard(adapter) {
    const navigationController = adapter?.globalObject?.appNavigationController;
    if (typeof navigationController?.registerEscapeHandler !== 'function') {
        return null;
    }

    try {
        const unregister = navigationController.registerEscapeHandler(() => false);
        return typeof unregister === 'function' ? unregister : null;
    } catch {
        return null;
    }
}

export { registerTelegramWebKEscapeGuard };
