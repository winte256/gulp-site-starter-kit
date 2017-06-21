"use strict";

const { gulp, $ } = require("./config");
const through2    = require("through2").obj;
const fs          = require("fs");
const path        = require("path");
const css         = require("css");

module.exports = function (taskName) {
    let dataSvg = {};

    return () =>
        gulp.src("./blocks/**/**/*.svg")
            .pipe($.plumber({
                errorHandler : $.notify.onError(err => ({
                        title   : taskName,
                        message : err.message
                    })
                )
            }))
            .pipe($.svgo())
            // .pipe($.juice())
            .pipe(through2(
                function (file, enc, cb) {
                    const svgName = path.parse(file.path).name;
                    const svg     = String(file.contents).replace(/id="[\s\S]*?"\s/, '');

                    dataSvg[ svgName ] = svg;
                    cb(null, file);
                },
                function (cb) {
                    const dataPath = path.join(process.cwd(), "blocks", "data.json");
                    const dataJson = fs.readFileSync(dataPath);

                    const data = JSON.parse(dataJson);
                    data.svg   = dataSvg;

                    fs.unlinkSync(dataPath);
                    fs.writeFileSync(dataPath, JSON.stringify(data), "utf8");

                    cb();
                }
            ))
            .pipe(gulp.dest("blocks"));
};