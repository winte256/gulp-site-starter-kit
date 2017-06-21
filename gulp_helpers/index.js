"use strict";
const { gulp } = require("../gulp_tasks/config");

module.exports = {
    lazyRequireTask : function (taskName, path) {
        gulp.task(taskName, function (callback) {
            let task = require(`.${path}`).call(null, taskName);

            return task(callback);
        });
    },
    createStylByBem : (blockName, bem = [], level) =>
        `\
media-breakpoint-up(${level}) {
    .${blockName} {    
        
    ${bem.map((element) => `    &${element} {\n\n    }`).join("\n")}
    }
}`,
    getBemByHtml    : function (html) {
        const classes   = [];
        const rGetClass = /\sclass=('|")([\s\S]+?)\1/gi;

        const replacer = function (str, unused, className) {
            (/\s+/g.test(className.trim()) ? className.trim().split(/\s+/) : [ className ])
                .forEach(function (el) {
                    if ( !classes.includes(el) ) {
                        classes.push(el);
                    }
                });
        };

        html.replace(rGetClass, replacer);

        const bemBlocks = {};
        classes.forEach(function (el) {
            el = el.replace(/(_|__)[\s\S]+/, '');
            if ( !bemBlocks.hasOwnProperty(el) ) {
                bemBlocks[ el ] = [];
            }
        });

        for ( let block in bemBlocks ) {
            classes.forEach(function (el) {
                if ( !( /_/.test(el) && (new RegExp(`^${block}__`)).test(el) ) ) return;
                el = el.replace(new RegExp(`^${block}`), '');

                if ( bemBlocks[ block ].includes(el) ) return;

                bemBlocks[ block ].push(el);
            });

        }
        return bemBlocks;
    }
};