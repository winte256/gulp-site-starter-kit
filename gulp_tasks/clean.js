"use strict";
const { params : { out } } = require("./config");
const del                  = require("del");

module.exports = () => () => del(out);