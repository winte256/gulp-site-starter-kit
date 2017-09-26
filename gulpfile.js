const { params, gulp } = require('./gulp_tasks/config');
const { lazyRequireTask } = require('./gulp_tasks/utils');

lazyRequireTask('server', './gulp_tasks/server');
lazyRequireTask('clean', './gulp_tasks/clean');
lazyRequireTask('css', './gulp_tasks/css');
lazyRequireTask('html', './gulp_tasks/html');
lazyRequireTask('images', './gulp_tasks/images');
lazyRequireTask('svgo', './gulp_tasks/svgo');
lazyRequireTask('js', './gulp_tasks/js');
lazyRequireTask('createBlocks', './gulp_tasks/createBlocks');
lazyRequireTask('createFirstLevelBlocks', './gulp_tasks/createFirstLevelBlocks');

gulp.task('watch', () => {
  gulp.watch(params.html, gulp.series('html'));
  gulp.watch([params.type.styl, params.styl], gulp.series('css'));
  gulp.watch(params.type.images, gulp.series('images'));
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('html', 'css', 'images', 'js'),
));

gulp.task('default', gulp.series(
  'build',
  gulp.parallel('server', 'watch'),
));
