"use strict";

const {
          params,
          $,
          gulp,
          isDevelopment
      }       = require("./config");
const fs      = require("fs");
const combine = require("stream-combiner2");

module.exports = function (taskName) {
    let dataLocals = {};

    return function () {
        try {
            dataLocals = JSON.parse(fs.readFileSync("./blocks/data.json", "utf8"));
        } catch (e) {
            console.error(e);
        }

        return gulp.src(params.htmlSrc)
            .pipe($.plumber({
                errorHandler : $.notify.onError(err => {
                    return {
                        title   : taskName,
                        message : err.message
                    };
                })
            }))
            .pipe($.newer(params.out))
            .pipe($.pug({
                locals : dataLocals,
                pretty : true
            }))
            .pipe(gulp.dest(params.out))
            .pipe($.if(
                !isDevelopment,
                combine(
                    $.htmlmin({
                        minifyJS       : true,
                        minifyCSS      : true,
                        removeComments : true
                    }),
                    gulp.dest(params.prod)
                )
            ));
    };
};