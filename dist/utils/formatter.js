"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.italic = exports.bold = void 0;
const bold = (str, inHTML) => {
    if (inHTML) {
        return `<strong>${str}</strong>`;
    }
    return `*${str}*`;
};
exports.bold = bold;
const italic = (str, inHTML) => {
    if (inHTML) {
        return `<i>${str}</i>`;
    }
    return `_${str}_`;
};
exports.italic = italic;
