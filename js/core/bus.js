/* core/bus.js — минимальная шина событий (pub/sub) и «паспорт» модулей.
 *
 * Назначение: ПОСЛЕ рефакторинга функциональность разбита на независимые
 * модули (features/*). Чтобы модули не тянули друг друга напрямую (это
 * порождало бы циклы импорта), они общаются через НАСТОЯЩУЮ шину событий:
 *
 *   * один модуль публикует событие (bus.emit("memory:updated", mem));
 *   * другие подписываются (bus.on("memory:updated", renderFacts));
 *
 * Это и есть «подключаемая архитектура» (плагины): новые модули можно
 * добавлять/убирать, не меняя код остальных.
 *
 * Экспорт: bus, registry.
 */

function createBus() {
    var handlers = Object.create(null);   // {eventName: [fn, …]}
    return {
        // Подписка на событие. Возвращает функцию отписки.
        on: function (name, fn) {
            (handlers[name] || (handlers[name] = [])).push(fn);
            return function () {
                var arr = handlers[name] || [];
                var i = arr.indexOf(fn);
                if (i >= 0) arr.splice(i, 1);
            };
        },
        // Публикация события: вызываем все подписчики, ошибки не рвут поток.
        emit: function (name, payload) {
            var arr = handlers[name] || [];
            for (var i = 0; i < arr.length; i++) {
                try { arr[i](payload); }
                catch (e) { /* один модуль не должен ломать другие */ }
            }
        },
    };
}

// Единственная на всё приложение шина событий.
export var bus = createBus();

/* Реестр модулей: каждый feature-модуль регистрируется по имени и может
 * получить других. Используется как простая «карта плагинов». */
export var registry = {
    _mods: Object.create(null),
    // Зарегистрировать модуль (объект с методами). Возвращает его же.
    add: function (name, mod) { this._mods[name] = mod; return mod; },
    // Получить модуль по имени (или null).
    get: function (name) { return this._mods[name] || null; },
    // Список имён зарегистрированных модулей.
    names: function () { return Object.keys(this._mods); },
};
