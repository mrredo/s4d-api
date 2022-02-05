"use strict";
module.exports = function mathRandomInt(a, b) {
    if (a > b) {
        // Swap a and b to ensure a is smaller.
        const c = a;
        a = b;
        b = c;
    }
    return Math.floor(Math.random() * (b - a + 1) + a);
};
