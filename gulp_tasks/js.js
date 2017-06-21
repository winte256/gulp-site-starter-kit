'use strict';

const { params, gulp, $ } = require('./config');
const webpackStream       = require('webpack-stream');
const named               = require('vinyl-named');
const gulplog             = require('gulplog');
const path                = require('path');

module.exports = taskName =>
    function (callback) {
        let firstBuildReady = false;

        function done(err, stats) {
            firstBuildReady = true;

            if ( err ) { // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
                return;  // emit('error', err) in webpack-stream
            }

            gulplog[ stats.hasErrors() ? 'error' : 'info' ](stats.toString({
                colors : true
            }));

        }

        return gulp.src(params.js)
            .pipe($.plumber({
                errorHandler : $.notify.onError(err => {
                    return {
                        title   : taskName,
                        message : err.message
                    };
                })
            }))
            .pipe(named())
            .pipe(webpackStream(require('../webpack.config'), require('webpack'), done))
            .pipe(gulp.dest(params.out))
            .on('data', function () {
                if ( firstBuildReady ) {
                    callback();
                }
            });
    };