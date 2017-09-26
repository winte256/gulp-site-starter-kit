const gulp = require('gulp');
const { params, $, isDevelopment } = require('./config');

params.images.push(params.type.images);

module.exports = (taskName) => () =>
  gulp.src(params.images, { since: gulp.lastRun(taskName) })
    .pipe($.plumber({
      errorHandler: $.notify.onError((err) => ({
        title: taskName,
        message: err.message,
      })),
    }))
    .pipe($.rename({ dirname: '' }))
    .pipe(gulp.dest(`${params.out}/images`))
    .pipe($.if(!isDevelopment, gulp.dest(`${params.prod}/images`)));
