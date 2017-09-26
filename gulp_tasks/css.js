const gulp = require('gulp');
const combine = require('stream-combiner2');
// const stylus = require('gulp-stylus').stylus;
const autoprefixer = require('autoprefixer');
const postcssCsso = require('postcss-csso');
const { params, $, isDevelopment } = require('./config');

const errorHandler = (taskName) =>
  $.notify.onError((err) => ({
    title: taskName,
    message: err.message,
  }));

module.exports = (taskName) => () =>
  gulp.src(params.styl)
    .pipe($.plumber({
      errorHandler: errorHandler(taskName),
    }))
    .pipe($.if(isDevelopment, $.sourcemaps.init()))
    .pipe($.stylus({
      'include css': true,
    }))
    .pipe($.url({
      replace: ['../images/', ''],
      prepend: ['images/'],
    }))
    .pipe($.rename('styles.css'))
    .pipe($.if(isDevelopment, $.sourcemaps.write()))
    .pipe(gulp.dest(params.out))
    .pipe($.if(
      !isDevelopment,
      combine(
        $.postcss([
          autoprefixer({ browsers: ['last 4 version'] }),
          postcssCsso,
        ]),
        gulp.dest(params.prod),
      ),
    ));
