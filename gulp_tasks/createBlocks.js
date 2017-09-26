const gulp = require('gulp');
const fs = require('fs');
const through2 = require('through2').obj;
const path = require('path');
const Vinyl = require('vinyl');
const { createStylByBem, getBemByHtml } = require('./utils');
const { params, $ } = require('./config');

module.exports = (taskName) => () => {
  let dataLocals = {};

  try {
    dataLocals = JSON.parse(fs.readFileSync('./blocks/data.json', 'utf8'));
  } catch (e) {
    console.error(e);
  }

  return gulp.src(['./pug/*.pug', './blocks/**/*.pug'])
    .pipe($.plumber({
      errorHandler: $.notify.onError((err) => ({
        title: taskName,
        message: err.message,
      })),
    }))
    .pipe($.pug({
      locals: dataLocals,
    }))
    .pipe($.concat('merge.html'))
    .pipe(through2(function(file, enc, cb) {
      const contents = String(file.contents);
      const bemBlocks = getBemByHtml(contents);

      Object.keys(bemBlocks).forEach((blockName) => {
        params.levels.forEach((level) => {
          const cssPath = path.join(process.cwd(), 'blocks', blockName, level, `${blockName}.styl`);
          const cssBase = path.join(process.cwd(), 'blocks');

          try {
            fs.statSync(cssPath);
          } catch (err) {
            const cssFile = new Vinyl({
              cwd: '/',
              base: cssBase,
              path: cssPath,
              contents: Buffer.from(createStylByBem(blockName, bemBlocks[blockName], level)),
            });
            this.push(cssFile);
          }
        });
      });

      cb();
    }))
    .pipe(gulp.dest('blocks'));
};
