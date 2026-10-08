/* core/api.js — тонкая обёртка над fetch для JSON-API сервера.
 *
 * Все модули ходят на сервер через эти функции: единая обработка ошибок и
 * заголовков. Это заодно упрощает замену транспорта (напр. на EventSource)
 * в одном месте — ещё один аспект «подключаемой» архитектуры.
 *
 * Экспорт: apiGet , apiPost.
 */

// GET JSON. Бросает Error при сетевой ошибке/невалидном JSON.
export async function apiGet(url) {
    var resp = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!resp.ok) throw new Error("HTTP " + resp.status + " для " + url);
    return await resp.json();
}

// POST JSON c телом body (объект). Возвращает распарсенный ответ.
export async function apiPost(url, body) {
    var resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body || {}),
    });
    if (!resp.ok) {
        // Сервер может вернуть осмысленный текст ошибки в JSON.
        var msg = "HTTP " + resp.status;
        try {
            var data = await resp.json();
            if (data && data.error) msg = data.error;
        } catch (e) { /* тело не JSON — оставляем код */ }
        throw new Error(msg);
    }
    return await resp.json();
}
