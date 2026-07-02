// Обновление статуса в UI при открытии попапа
chrome.storage.local.get({ capturedLessons: {} }, (result) => {
    const count = Object.keys(result.capturedLessons).length;
    // Можно динамически выводить количество в интерфейс, если добавить тег в HTML
    console.log(`Найдено уроков в кэше: ${count}`);
});

// Логика кнопки "Включить перехват" (она уже работает автоматически благодаря content.js)
document.getElementById('startCaptureBtn').addEventListener('click', (e) => {
    e.target.innerText = "⏳ Перехват активен...";
    e.target.style.backgroundColor = "#27ae60";
});

// Скачивание накопленного JSON-бэкапа
document.getElementById('downloadJsonBtn').addEventListener('click', () => {
    chrome.storage.local.get({ capturedLessons: {} }, (result) => {
        const lessonsMap = result.capturedLessons;
        const lessonsList = Object.values(lessonsMap);

        if (lessonsList.length === 0) {
            alert('Кэш пуст! Сначала зайдите в марафон и покликайте по урокам, чтобы поймать данные.');
            return;
        }

        // Создаем красивый структурированный JSON-бэкап
        const backupData = {
            exportedAt: new Date().toISOString(),
            totalLessons: lessonsList.length,
            lessons: lessonsList
        };

        // Генерируем Blob и скачиваем файл средствами JS
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `edvibe_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();

        // Чистим за собой
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});

// Сброс текущего урока (заглушка для следующего шага)
document.getElementById('resetLessonBtn').addEventListener('click', () => {
    alert('Для сброса нам нужно будет послать исходящую сокет-команду. Логика будет тут.');
});