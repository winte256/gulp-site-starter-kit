"use strict";

const { params, gulp, $ } = require("./config");

module.exports = function (taskName) {
    return function () {
        return gulp.src("./bower_components/jquery/dist/jquery.min.js")
            .pipe($.plumber({
                errorHandler : $.notify.onError(err => {
                    return {
                        title   : taskName,
                        message : err.message
                    };
                })
            }))
            .pipe(gulp.dest(`${params.out}/js`))
            .pipe(gulp.dest(`${params.prod}/js`));
    };
};
