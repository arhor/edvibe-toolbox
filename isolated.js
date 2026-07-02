// isolated.js - Работает в песочнице расширения (ISOLATED world)
window.addEventListener('message', (event) => {
    // Проверяем, что сообщение пришло от нашей страницы и содержит нужный тип
    if (event.source !== window || !event.data || event.data.type !== 'EDVIBE_TOOLBOX_CAPTURE') {
        return;
    }

    const newLesson = event.data.payload;

    // Сохраняем в локальное хранилище расширения
    chrome.storage.local.get({ capturedLessons: {} }, (result) => {
        const lessons = result.capturedLessons;
        lessons[newLesson.lessonId] = newLesson;

        chrome.storage.local.set({ capturedLessons: lessons }, () => {
            console.log(`[Edvibe Toolbox] Урок ${newLesson.lessonId} успешно сохранен в локальный кэш.`);
        });
    });
});