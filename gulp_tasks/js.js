const gulp = require('gulp');
const named = require('vinyl-named');
const gulplog = require('gulplog');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const { params, $ } = require('./config');
const webpackCondig = require('../webpack.config');

module.exports = (taskName) => (callback) => {
  let firstBuildReady = false;

  const done = (err, stats) => {
    firstBuildReady = true;

    // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
    // emit('error', err) in webpack-stream
    if (err) return;

    gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
      colors: true,
    }));
  };

  return gulp.src(params.js)
    .pipe($.plumber({
      errorHandler: $.notify.onError((err) => ({
        title: taskName,
        message: err.message,
      })),
    }))
    .pipe(named())
    .pipe(webpackStream(webpackCondig, webpack, done))
    .pipe(gulp.dest(params.out))
    .on('data', () => {
      if (firstBuildReady) {
        callback();
      }
    });
};
