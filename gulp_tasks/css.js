"use strict";

const { params, $, gulp, isDevelopment } = require("./config");
const combine                            = require("stream-combiner2");
const stylus                             = require('gulp-stylus').stylus;
const errorHandler                       = taskName =>
    $.notify.onError(err => ({
        title   : taskName,
        message : err.message
    }));

module.exports = function (taskName) {
    return function () {
        return gulp.src(params.styl)
            .pipe($.plumber({
                errorHandler : errorHandler(taskName)
            }))
            .pipe($.if(isDevelopment, $.sourcemaps.init()))
            .pipe($.stylus({
                'include css' : true
            }))
            .pipe($.url({
                replace : [ "../images/", "" ],
                prepend : [ "images/" ]
            }))
            .pipe($.rename("styles.css"))
            .pipe($.if(isDevelopment, $.sourcemaps.write()))
            .pipe(gulp.dest(params.out))
            .pipe($.if(
                !isDevelopment,
                combine(
                    $.postcss([
                        require("autoprefixer")({ browsers : [ "last 4 version" ] }),
                        require("postcss-csso")
                    ]),
                    gulp.dest(params.prod)
                )
            ));
    };
};