"use strict";

module.exports = {
    params        : {
        out        : "public",
        prod       : "public/prod",
        htmlSrc    : "pug/*.pug",
        levels     : [ "xs", 'sm', 'md', 'lg', 'xl'],
        html       : [ "pug/*.pug", "blocks/**/*.pug", "blocks/data.json" ],
        blocksName : [
            'example'
        ],
        js         : "./javascript/index.js",
        json       : "blocks/**/*.json",
        styl       : "./setting.styl/index.styl",
        images     : [],
        type       : {
            styl   : "blocks/**/**/*.styl",
            js     : "config/**/*.js",
            images : "./blocks/**/images/*.{gif,jpg,png,ico,svg}"
        }
    },
    isDevelopment : !process.env.NODE_ENV || process.env.NODE_ENV === "development",
    gulp          : require("gulp"),
    $             : require("gulp-load-plugins")({
        rename : {
            "gulp-css-url-adjuster" : "url",
            "gulp-merge-json"       : "merge"
        }
    })
};

