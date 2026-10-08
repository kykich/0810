function makeEl(tag) {
    const cls = new Set();
    return {
        tagName: tag, dataset: {}, style: {}, children: [], attrs: {},
        classList: {
            toggle(c, on) { on ? cls.add(c) : cls.delete(c); },
            contains(c) { return cls.has(c); },
            remove(c) { cls.delete(c); },
        },
        setAttribute(k, v) { this.attrs[k] = v; },
        addEventListener() {},
        querySelector() { return null; },
        querySelectorAll() { return []; },
        appendChild(c) { this.children.push(c); },
        get scrollWidth() { return 120; },
    };
}

const section = makeEl("section");
section.dataset.section = "strategy";
const head = makeEl("button");
section.querySelector = (sel) => (sel === ".side-sec-head" ? head : null);
section.querySelectorAll = () => [];

const side = makeEl("aside");
side.children = [section];

globalThis.document = {
    querySelector(sel) { return sel === ".side" ? side : null; },
    querySelectorAll(sel) { return sel === ".side-sec" ? [section] : []; },
    getElementById() { return null; },
};
globalThis.window = {
    addEventListener() {},
    getComputedStyle() { return { paddingLeft: "8px", paddingRight: "8px" }; },
};
globalThis.setTimeout = () => 0;

const mod = await import("../js/features/sections.js");
const refresh = mod.initSections(() => ({ strategy: true }));
console.log("initSections returned:", typeof refresh);
mod.autoFitSide();
console.log("autoFitSide ran; side.width =", side.style.width);
console.log("head aria-expanded =", head.attrs["aria-expanded"]);
