"use strict";

const { params, gulp, $, isDevelopment } = require("./config");

params.images.push(params.type.images);

module.exports = function (taskName) {
    return function () {
        return gulp.src(params.images, { since : gulp.lastRun(taskName) })
            .pipe($.plumber({
                errorHandler : $.notify.onError(err => {
                    return {
                        title   : taskName,
                        message : err.message
                    };
                })
            }))
            .pipe($.rename({ dirname : "" }))
            .pipe(gulp.dest(`${params.out}/images`))
            .pipe($.if(!isDevelopment, gulp.dest(`${params.prod}/images`)));
    };
};
