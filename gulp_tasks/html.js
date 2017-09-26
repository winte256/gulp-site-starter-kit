const gulp = require('gulp');
const combine = require('stream-combiner2');
const fs = require('fs');
const { params, $, isDevelopment } = require('./config');

module.exports = (taskName) => {
  let dataLocals = {};

  return () => {
    try {
      dataLocals = JSON.parse(fs.readFileSync('./blocks/data.json', 'utf8'));
    } catch (e) {
      console.error(e);
    }

    return gulp.src(params.htmlSrc)
      .pipe($.plumber({
        errorHandler: $.notify.onError((err) => ({
          title: taskName,
          message: err.message,
        })),
      }))
      .pipe($.newer(params.out))
      .pipe($.pug({
        locals: dataLocals,
        pretty: true,
      }))
      .pipe(gulp.dest(params.out))
      .pipe($.if(
        !isDevelopment,
        combine(
          $.htmlmin({
            minifyJS: true,
            minifyCSS: true,
            removeComments: true,
          }),
          gulp.dest(params.prod),
        ),
      ));
  };
};
