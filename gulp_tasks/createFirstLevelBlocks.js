"use strict";

const { params } = require("./config");
const fs         = require("fs");
const path       = require("path");

module.exports = function () {
    return function (cb) {
        for ( let blockName of params.blocksName ) {
            let folder = path.join(process.cwd(), "blocks", blockName); // ./blocks/example
            let file   = path.join(folder, `${blockName}.pug`);

            try {
                fs.mkdirSync(folder);
                fs.mkdirSync(path.join(folder, "images"));
                fs.writeFileSync(file, `.${blockName}`);
            } catch (err) {
            }
        }
        cb();
    };
};