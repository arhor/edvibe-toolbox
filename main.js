// main.js - Работает в контексте страницы (MAIN world)
const OriginalWebSocket = window.WebSocket;

window.WebSocket = function (url, protocols) {
    const ws = new OriginalWebSocket(url, protocols);

    ws.addEventListener('message', (event) => {
        try {
            const data = JSON.parse(event.data);

            if (data.Method === "LoadExercises" && data.IsSuccess) {
                const parsedValue = typeof data.Value === 'string' ? JSON.parse(data.Value) : data.Value;

                const lessonPayload = {
                    lessonId: parsedValue.LessonId || "unknown",
                    sectionId: parsedValue.SectionId,
                    items: parsedValue.Items || [],
                    timestamp: new Date().toISOString()
                };

                // Стреляем в isolated.js через postMessage
                window.postMessage({
                    type: 'EDVIBE_TOOLBOX_CAPTURE',
                    payload: lessonPayload
                }, '*');
            }
        } catch (e) {
            // Игнорируем не-JSON сообщения
        }
    });

    return ws;
};

window.WebSocket.prototype = OriginalWebSocket.prototype;
console.log('[Edvibe Toolbox] WebSocket proxy successfully injected via MAIN world.');