"use strict";

const { params, gulp, $ } = require("./config");
const {
          createStylByBem,
          getBemByHtml
      }                   = require("../gulp_helpers");
const fs                  = require("fs");
const through2            = require("through2").obj;
const path                = require("path");
const Vinyl               = require('vinyl');

module.exports = function (taskName) {
    return function () {
        let dataLocals = {};

        try {
            dataLocals = JSON.parse(fs.readFileSync("./blocks/data.json", "utf8"));
        } catch (e) {
            console.error(e);
        }

        return gulp.src([ "./pug/*.pug", './blocks/**/*.pug' ])
            .pipe($.plumber({
                errorHandler : $.notify.onError(err => {
                    return {
                        title   : taskName,
                        message : err.message
                    };
                })
            }))
            .pipe($.pug({
                locals : dataLocals
            }))
            .pipe($.concat("merge.html"))
            .pipe(through2(function (file, enc, cb) {
                const contents  = String(file.contents);
                const bemBlocks = getBemByHtml(contents);

                for ( let blockName in bemBlocks ) {
                    for ( let level of params.levels ) {
                        let cssPath = path.join(process.cwd(), "blocks", blockName, level, `${blockName}.styl`);
                        let cssBase = path.join(process.cwd(), "blocks");

                        try {
                            fs.statSync(cssPath);
                        } catch (err) {

                            let cssFile = new Vinyl({
                                cwd      : '/',
                                base     : cssBase,
                                path     : cssPath,
                                contents : new Buffer(createStylByBem(blockName, bemBlocks[ blockName ], level))
                            });
                            this.push(cssFile);
                        }
                    }
                }

                cb();
            }))
            .pipe(gulp.dest("blocks"));
    };
};