"use strict";
const { params }  = require("./config");
const path        = require("path");
const browserSync = require("browser-sync").create();

module.exports = function () {
    return function () {
        browserSync.init({
            server : path.resolve(params.out)
        });

        browserSync.watch(`${params.out}/**/*.*`).on("change", browserSync.reload);
    };
};