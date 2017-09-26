const gulp = require('gulp');

module.exports = {
  lazyRequireTask(taskName, path) {
    gulp.task(taskName, (callback) => {
      const pathToTask = `.${path}`;
      // eslint-disable-next-line
      const task = require(pathToTask).call(null, taskName);
      return task(callback);
    });
  },
  createStylByBem(blockName, bem = [], level) {
    return (
      `+media-breakpoint-up(${level}) {\n` +
      `  .${blockName} {\n` +
      `${bem.map((element) => `    &${element} {\n\n    }`).join('\n')}` +
      '  }\n' +
      '}\n'
    );
  },
  getBemByHtml(html) {
    const classes = [];
    const rGetClass = /\sclass=('|")([\s\S]+?)\1/gi;

    const replacer = (str, unused, className) => {
      (/\s+/g.test(className.trim()) ? className.trim().split(/\s+/) : [className])
        .forEach((el) => {
          if (!classes.includes(el)) {
            classes.push(el);
          }
        });
    };

    html.replace(rGetClass, replacer);

    const bemBlocks = {};
    classes.forEach((el) => {
      const element = el.replace(/(_|__)[\s\S]+/, '');
      if (!bemBlocks[element]) {
        bemBlocks[element] = [];
      }
    });

    Object.keys(bemBlocks).forEach((block) => {
      classes.forEach((el) => {
        const rBlock = new RegExp(`^${block}__`);
        if (!/_/.test(el) || !rBlock.test(el)) return;

        const element = el.replace(new RegExp(`^${block}`), '');

        if (bemBlocks[block].includes(element)) return;

        bemBlocks[block].push(element);
      });
    });
    return bemBlocks;
  },
};
