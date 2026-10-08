/* core/dom.js — базовые DOM-утилиты и ссылки на общие элементы страницы.
 *
 * Модуль вынесен из исторического монолитного app.js (рефакторинг): здесь
 * собраны ХЕЛПЕРЫ, не привязанные к конкретной функциональности, — чтобы
 * остальные модули (chat, memory, mcp, rag, local, …) могли их переиспользовать
 * и не дублировать код.
 *
 * Экспорт: $ , $$ , esc , setStatus , fmt.
 */

// Быстрый доступ к элементу по id.
export function $(id) {
    return document.getElementById(id);
}

// Все элементы по селектору (массив).
export function $$(sel, root) {
    return Array.prototype.slice.call(
        (root || document).querySelectorAll(sel));
}

// Экранирование строки для вставки в HTML.
export function esc(s) {
    return String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Форматирование числа с разделителями тысяч.
export function fmt(n) {
    return (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Индикатор состояния внизу страницы (сообщение/ошибка/успех).
export function setStatus(message, kind) {
    var statusEl = $("status");
    if (!statusEl) return;
    statusEl.hidden = !message;
    statusEl.textContent = message || "";
    statusEl.className = "side-status composer-status" +
        (kind === "error" ? " error" : (kind === "ok" ? " ok" : ""));
}
